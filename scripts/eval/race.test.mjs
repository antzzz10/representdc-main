/**
 * Concurrency tests for the two writers of gh-pages.
 *
 * Codex's round-2 blocker: "the writers never touch the same file" only holds for manual
 * deploys, because scheduled runs, reruns and Withhold all write api/news.json. These
 * tests run real git pushes against a local bare repo (NEWS_REMOTE) and check the three
 * rules in publish.mjs actually hold:
 *
 *   1. a deploy and a news push never clobber each other's files;
 *   2. a rejected push re-reads the branch and re-applies, never re-pushing stale bytes;
 *   3. a withholding beats a run that started before it.
 *
 * No network, no GitHub. Run with `npm run test:news`.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { publishFeed } from '../news/publish.mjs';

// Every published summary must carry a judge pass; publishFeed refuses otherwise. These
// fixtures stand in for that record.
const JUDGE_PASS = { judge: 'pass', judgeVersion: 'test' };

let remote;
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();

/** A bare repo with a gh-pages branch holding a built site and a published feed. */
function seedRemote() {
  const bare = mkdtempSync(join(tmpdir(), 'news-remote-'));
  execFileSync('git', ['init', '--bare', '-q', '-b', 'gh-pages', bare]);

  const seed = mkdtempSync(join(tmpdir(), 'news-seed-'));
  git(seed, 'init', '-q', '-b', 'gh-pages');
  git(seed, 'config', 'user.email', 'test@example.com');
  git(seed, 'config', 'user.name', 'Test');
  mkdirSync(join(seed, 'api'), { recursive: true });
  mkdirSync(join(seed, 'assets'), { recursive: true });
  writeFileSync(join(seed, 'index.html'), '<!doctype html>v1\n');
  writeFileSync(join(seed, 'assets/app-v1.js'), 'console.log(1)\n');
  writeFileSync(
    join(seed, 'api/news.json'),
    `${JSON.stringify({ runId: 'seed', lastUpdated: '2026-09-01T00:00:00Z', summary: 'Seed summary.', articles: [] }, null, 2)}\n`,
  );
  git(seed, 'add', '-A');
  git(seed, 'commit', '-q', '-m', 'seed');
  git(seed, 'remote', 'add', 'origin', bare);
  git(seed, 'push', '-q', 'origin', 'gh-pages');
  rmSync(seed, { recursive: true, force: true });
  return bare;
}

/** Reads a file as the public site would see it. */
function published(path) {
  return git(remote, 'show', `gh-pages:${path}`);
}

/**
 * Stands in for `npm run deploy`: replaces every file except api/news.json, exactly as
 * scripts/deploy.mjs configures gh-pages to do.
 */
function deploySite(label) {
  const work = mkdtempSync(join(tmpdir(), 'deploy-'));
  git(work, 'clone', '-q', remote, '.');
  git(work, 'config', 'user.email', 'deploy@example.com');
  git(work, 'config', 'user.name', 'Deploy');
  writeFileSync(join(work, 'index.html'), `<!doctype html>${label}\n`);
  writeFileSync(join(work, `assets/app-${label}.js`), 'console.log(2)\n');
  rmSync(join(work, 'assets/app-v1.js'), { force: true });
  git(work, 'add', '-A');
  git(work, 'commit', '-q', '-m', `deploy ${label}`);
  git(work, 'push', '-q', 'origin', 'gh-pages');
  rmSync(work, { recursive: true, force: true });
}

before(() => {
  remote = seedRemote();
  process.env.NEWS_REMOTE = remote;
});

after(() => {
  rmSync(remote, { recursive: true, force: true });
  delete process.env.NEWS_REMOTE;
});

test('a news push leaves the deployed site alone, and a deploy leaves the feed alone', async () => {
  await publishFeed(() => ({ runId: 'r1', summary: 'First.', summaryCheck: JUDGE_PASS, articles: [] }), {
    message: 'news r1',
  });
  assert.match(published('index.html'), /v1/);

  deploySite('v2');
  const feed = JSON.parse(published('api/news.json'));
  assert.equal(feed.runId, 'r1', 'the deploy must not roll the feed back');
  assert.equal(feed.summary, 'First.');
  assert.match(published('index.html'), /v2/, 'the deploy still replaced the site');
});

test('a deploy landing mid-publish forces a retry and loses nothing', async () => {
  // Git rejects a push onto a diverged branch regardless of which files each side
  // touched, so a deploy landing between this run's fetch and its push DOES get the news
  // push rejected. An earlier version of this comment claimed otherwise. What the
  // ownership split buys is that neither writer's *content* is lost: the retry re-reads
  // the deploy's commit and re-applies the feed on top.
  //
  // Seeds its own starting state rather than inheriting the previous test's, which made
  // this file order-dependent and passing for the wrong reason.
  await publishFeed(() => ({ runId: 'pre-race', summary: 'Before.', summaryCheck: JUDGE_PASS, articles: [] }), {
    message: 'news pre-race',
  });

  const seenByApply = [];
  await publishFeed(
    (current) => {
      seenByApply.push(current?.runId ?? null);
      if (seenByApply.length === 1) deploySite('v3-race');
      return { runId: 'r2', summary: 'Second.', summaryCheck: JUDGE_PASS, articles: [] };
    },
    { message: 'news r2' },
  );

  const feed = JSON.parse(published('api/news.json'));
  assert.equal(seenByApply[0], 'pre-race', 'the first attempt saw the branch as it was');
  assert.equal(seenByApply.length, 2, 'the diverged branch must force one retry');
  assert.equal(seenByApply[1], 'pre-race', 'the retry re-read the feed, unchanged by the deploy');
  assert.equal(feed.summary, 'Second.', 'the news push still landed');
  assert.match(published('index.html'), /v3-race/, "the deploy's work survived");
});

test('a rejected push re-reads and re-applies rather than re-pushing stale bytes', async () => {
  // Two news writers, which is the case that actually produces a non-fast-forward: a
  // competing news push lands between this one's read and its push.
  const seenByApply = [];
  let injected = false;

  await publishFeed(
    (current) => {
      seenByApply.push(current?.runId ?? null);
      if (!injected) {
        injected = true;
        // Another news run publishes first, from its own checkout.
        const rival = mkdtempSync(join(tmpdir(), 'rival-'));
        git(rival, 'clone', '-q', remote, '.');
        git(rival, 'config', 'user.email', 'rival@example.com');
        git(rival, 'config', 'user.name', 'Rival');
        writeFileSync(
          join(rival, 'api/news.json'),
          `${JSON.stringify({ runId: 'rival', summary: 'Rival summary.', articles: [] }, null, 2)}\n`,
        );
        git(rival, 'add', '-A');
        git(rival, 'commit', '-q', '-m', 'rival news push');
        git(rival, 'push', '-q', 'origin', 'gh-pages');
        rmSync(rival, { recursive: true, force: true });
      }
      // Only ever publish on top of what is actually on the branch.
      return {
        runId: 'r2b',
        summary: 'Mine.',
        summaryCheck: JUDGE_PASS,
        previousRunId: current?.runId ?? null,
        articles: [],
      };
    },
    { message: 'news r2b' },
  );

  const feed = JSON.parse(published('api/news.json'));
  assert.equal(feed.runId, 'r2b');
  assert.equal(seenByApply.length, 2, 'the rejected push must trigger a re-read');
  assert.equal(seenByApply[1], 'rival', 'the retry must see the rival push, not stale state');
  assert.equal(feed.previousRunId, 'rival');
});

test('a withholding is not undone by a run that started before it', async () => {
  const runStartedAt = new Date('2026-09-12T10:00:00Z');

  // Andria withholds at 10:05, after that run began.
  await publishFeed(
    (current) => ({ ...current, summary: null, withheldAt: '2026-09-12T10:05:00Z' }),
    { message: 'withhold' },
  );

  // The in-flight run now publishes. It must keep its fresh headlines but drop its
  // summary, because the withholding is newer than its start time.
  await publishFeed(
    (current) => {
      const withheldAt = current?.withheldAt ? new Date(current.withheldAt) : null;
      const payload = {
        runId: 'r3',
        summary: 'Third.',
        summaryCheck: JUDGE_PASS,
        articles: [{ title: 'fresh' }],
      };
      if (withheldAt && withheldAt > runStartedAt) {
        return { ...payload, summary: null, withheldAt: current.withheldAt };
      }
      return payload;
    },
    { message: 'news r3' },
  );

  const feed = JSON.parse(published('api/news.json'));
  assert.equal(feed.summary, null, 'the withheld summary must not come back');
  assert.equal(feed.runId, 'r3', 'but the fresh headlines still publish');
  assert.equal(feed.articles.length, 1);
});

test('a summary without a judge pass is refused at the publishing boundary', async () => {
  // The invariant that stops a future caller — or a careless refactor — from publishing
  // text the judge never approved. Headlines alone stay publishable.
  await assert.rejects(
    () => publishFeed(() => ({ runId: 'sneaky', summary: 'Unchecked.', articles: [] }), { message: 'nope' }),
    /judge pass/,
  );
  await assert.rejects(
    () =>
      publishFeed(
        () => ({ runId: 'sneaky2', summary: 'Unchecked.', summaryCheck: { judge: 'flag' }, articles: [] }),
        { message: 'nope' },
      ),
    /judge pass/,
  );
  const headlinesOnly = await publishFeed(
    () => ({ runId: 'headlines', summary: null, articles: [{ title: 'ok' }] }),
    { message: 'headlines only' },
  );
  assert.equal(headlinesOnly.pushed, true);
});

test('apply() returning null publishes nothing at all', async () => {
  const before = published('api/news.json');
  const result = await publishFeed(() => null, { message: 'should not happen' });
  assert.equal(result.skipped, true);
  assert.equal(published('api/news.json'), before);
});
