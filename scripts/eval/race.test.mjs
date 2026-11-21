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
 * Since 2026-11-21 the same branch also holds the scan's memory, api/news-archive.json.
 * The second half of this file checks that it goes out in the same commit as the feed,
 * that a rejected push re-applies archive changes to the rival's copy, that a corrupt
 * archive stops the publish with both files untouched, and that Withhold cannot change
 * it.
 *
 * No network, no GitHub. Run with `npm run test:news`.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { publishFeed, readPublishedArchive, readSeedArchive, NEWS_PATH } from '../news/publish.mjs';
import { applyRun, composePublication, emptyArchive, parseArchive, ArchiveError, ARCHIVE_PATH } from '../news/archive.mjs';

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

// ── The archive (api/news-archive.json) ─────────────────────────────────────────────

const DAY = 24 * 60 * 60 * 1000;
const T0 = new Date('2026-11-21T06:17:00Z').getTime();
const OK_SOURCES = [{ source: 'The 51st', status: 'ok', maxAgeDays: 30 }];
const story = (id, daysOld = 1) => ({
  title: `Statehood story ${id}`,
  link: `https://example.org/${id}`,
  pubDate: new Date(T0 - daysOld * DAY).toUTCString(),
  source: 'The 51st',
});
/** What one run saw: these articles in the feeds, all judged relevant. */
const observed = (articles, now) => ({
  candidates: articles,
  relevantLinks: articles.map((a) => a.link),
  sourceResults: OK_SOURCES,
  now,
});

/** Writes raw bytes to a path on the branch from a separate checkout, like any rival writer. */
function pushRaw(path, content, message = `write ${path}`) {
  const work = mkdtempSync(join(tmpdir(), 'raw-'));
  git(work, 'clone', '-q', remote, '.');
  git(work, 'config', 'user.email', 'raw@example.com');
  git(work, 'config', 'user.name', 'Raw');
  if (content === null) rmSync(join(work, path), { force: true });
  else writeFileSync(join(work, path), content);
  git(work, 'add', '-A');
  git(work, 'commit', '-q', '--allow-empty', '-m', message);
  git(work, 'push', '-q', 'origin', 'gh-pages');
  rmSync(work, { recursive: true, force: true });
}

/**
 * Back to a branch that has never had an archive: no archive file, and a feed with no
 * archive marker. Deleting the file alone is NOT a reset. With the marker still in the
 * feed that is a lost archive, and the publisher refuses it (tested below).
 */
function resetMemory(message = 'reset memory') {
  const work = mkdtempSync(join(tmpdir(), 'reset-'));
  git(work, 'clone', '-q', remote, '.');
  git(work, 'config', 'user.email', 'raw@example.com');
  git(work, 'config', 'user.name', 'Raw');
  rmSync(join(work, ARCHIVE_PATH), { force: true });
  mkdirSync(join(work, 'api'), { recursive: true });
  writeFileSync(join(work, NEWS_PATH), `${JSON.stringify({ runId: 'reset', summary: null, articles: [] }, null, 2)}\n`);
  git(work, 'add', '-A');
  git(work, 'commit', '-q', '--allow-empty', '-m', message);
  git(work, 'push', '-q', 'origin', 'gh-pages');
  rmSync(work, { recursive: true, force: true });
}

/**
 * A branch whose archive has been bootstrapped, empty: what every test below starts from
 * unless bootstrapping is the thing under test. Nothing is seeded automatically any
 * more, so a test cannot just delete the archive and publish.
 */
async function freshMemory() {
  resetMemory();
  await publishFeed(() => ({ feed: { runId: 'fresh', summary: null, articles: [] }, archive: emptyArchive() }), {
    message: 'bootstrap empty archive',
    withArchive: true,
    bootstrap: true,
  });
}

const head = () => git(remote, 'rev-parse', 'gh-pages');
const onBranch = (path) => git(remote, 'ls-tree', '--name-only', 'gh-pages', path) === path;

/** A publish the way fetch-news.mjs does it: this run's observations applied to the branch's archive. */
function publishRun(runId, observations, { onApply, baseArchive = null, bootstrap = false } = {}) {
  return publishFeed(
    (current, currentArchive) => {
      onApply?.(current, currentArchive);
      const fresh = applyRun(currentArchive ?? emptyArchive(), observations);
      return { feed: { runId, summary: null, articles: fresh.articles }, archive: fresh.archive };
    },
    { message: `news ${runId}`, withArchive: true, baseArchive, bootstrap },
  );
}

test('archive: an explicit bootstrap creates the archive in the same commit as the feed', async () => {
  resetMemory('no archive yet');
  assert.equal(onBranch(ARCHIVE_PATH), false);
  assert.equal(await readPublishedArchive({ bootstrap: true }), null, 'null only with the flag, no archive and no marker');

  let seenArchive = 'unset';
  const a = story('first');
  await publishRun('a1', observed([a], T0), { bootstrap: true, onApply: (_, archive) => { seenArchive = archive; } });
  assert.equal(seenArchive, null);

  const changed = git(remote, 'show', '--name-only', '--format=', 'gh-pages').split('\n').sort();
  assert.deepEqual(changed, [ARCHIVE_PATH, NEWS_PATH].sort(), 'one commit, both files');
  const archive = parseArchive(published(ARCHIVE_PATH));
  assert.equal(archive.pending.length, 1, 'one yes: pending, not confirmed');
  assert.equal(archive.items.length, 0);
  const feed = JSON.parse(published(NEWS_PATH));
  assert.deepEqual(feed.articles.map((x) => x.link), [a.link]);
  assert.deepEqual(feed.archive, { initialized: true, items: 0 }, 'the feed records that an archive now exists');
});

test('archive: an article confirmed on the second run stays on the page after it leaves the feed', async () => {
  await freshMemory();
  const a = story('kept');
  await publishRun('k1', observed([a], T0));
  await publishRun('k2', observed([a], T0 + DAY / 2));
  assert.deepEqual(parseArchive(published(ARCHIVE_PATH)).items.map((x) => x.link), [a.link]);

  // The feed has scrolled on: nothing in it, nothing judged relevant.
  await publishRun('k3', observed([], T0 + DAY));
  assert.deepEqual(JSON.parse(published(NEWS_PATH)).articles.map((x) => x.link), [a.link]);
  assert.deepEqual((await readPublishedArchive()).items.map((x) => x.link), [a.link]);
});

test('archive: a rejected push re-reads the archive and re-applies, keeping the rival run\'s changes', async () => {
  await freshMemory();
  const mine = story('mine');
  const theirs = story('theirs', 2);
  await publishRun('m1', observed([mine], T0));

  // This run would confirm `mine`. Between its read and its push, a rival run lands
  // that has confirmed `theirs`.
  const seen = [];
  let injected = false;
  const result = await publishRun('m2', observed([mine], T0 + DAY / 2), {
    onApply: (_, archive) => {
      seen.push(archive.items.map((x) => x.link));
      if (injected) return;
      injected = true;
      const once = applyRun(parseArchive(published(ARCHIVE_PATH)), observed([theirs], T0 + DAY / 4));
      const twice = applyRun(once.archive, observed([theirs], T0 + DAY / 3));
      pushRaw(ARCHIVE_PATH, `${JSON.stringify(twice.archive, null, 2)}\n`, 'rival news push');
    },
  });

  assert.equal(result.attempt, 2, 'the diverged branch must force one retry');
  assert.deepEqual(seen, [[], [theirs.link]], 'the retry saw the rival archive, not stale state');
  const archive = parseArchive(published(ARCHIVE_PATH));
  assert.deepEqual(archive.items.map((x) => x.link).sort(), [mine.link, theirs.link].sort(), "both runs' confirmations survive");
  assert.deepEqual(
    JSON.parse(published(NEWS_PATH)).articles.map((x) => x.link),
    [mine.link, theirs.link],
    'and the feed was rebuilt from the archive it was pushed with',
  );
});

test('archive: a corrupt archive stops the publish, and neither file is touched', async () => {
  // Never overwrite a corrupt archive with an empty one: it is the only copy of the
  // record, and "start again from nothing" would quietly throw the record away.
  for (const corrupt of ['{"version":1,"items":[', '<html>502</html>', '{}', '[]', JSON.stringify({ ...emptyArchive(), items: 'none' })]) {
    pushRaw(ARCHIVE_PATH, corrupt, 'corrupt archive');
    const before = head();
    const feedBefore = published(NEWS_PATH);
    let applyCalled = false;

    await assert.rejects(
      () => publishRun('never', observed([story('x')], T0), { onApply: () => { applyCalled = true; } }),
      ArchiveError,
    );
    await assert.rejects(() => readPublishedArchive(), ArchiveError, 'the read at the start of a run fails the same way');

    assert.equal(applyCalled, false, 'the run never gets to decide what to write');
    assert.equal(head(), before, 'nothing was pushed');
    assert.equal(published(ARCHIVE_PATH), corrupt, 'the corrupt archive is left exactly as found, for a person to repair');
    assert.equal(published(NEWS_PATH), feedBefore, 'the last good feed stays up');
  }
  resetMemory('clear corrupt archive');
});

test('archive: a write that would drop a confirmed item is refused at the publishing boundary', async () => {
  await freshMemory();
  const a = story('permanent');
  await publishRun('p1', observed([a], T0));
  await publishRun('p2', observed([a], T0 + DAY / 2));
  const before = head();

  await assert.rejects(
    () => publishFeed(() => ({ feed: { runId: 'wipe', summary: null, articles: [] }, archive: emptyArchive() }), { message: 'wipe', withArchive: true }),
    /drops a confirmed item/,
  );
  await assert.rejects(
    () => publishFeed(() => ({ feed: { runId: 'bad', summary: null, articles: [] }, archive: { items: [] } }), { message: 'bad', withArchive: true }),
    ArchiveError,
  );
  assert.equal(head(), before);
  // The judge-pass invariant still holds on the archive path.
  await assert.rejects(
    () => publishFeed((_, archive) => ({ feed: { runId: 'sneaky', summary: 'Unchecked.', articles: [] }, archive }), { message: 'nope', withArchive: true }),
    /judge pass/,
  );
  assert.equal(head(), before);
});

test('archive: withholding leaves the archive byte-for-byte intact', async () => {
  await freshMemory();
  const a = story('w');
  await publishRun('w1', observed([a], T0));
  await publishRun('w2', observed([a], T0 + DAY / 2));
  await publishFeed(
    (current) => ({ ...current, runId: 'w3', summary: 'Live summary.', summaryCheck: JUDGE_PASS }),
    { message: 'summary on' },
  );
  const archiveBefore = published(ARCHIVE_PATH);
  const articlesBefore = JSON.parse(published(NEWS_PATH)).articles;

  // Exactly the write scripts/news/withhold.mjs makes: one argument, no withArchive.
  const withhold = (current) => ({ ...current, summary: null, summarySource: null, withheldAt: '2026-11-21T10:05:00Z', withheldReason: 'test' });
  await publishFeed(withhold, { message: 'Withhold news summary' });

  const feed = JSON.parse(published(NEWS_PATH));
  assert.equal(feed.summary, null);
  assert.deepEqual(feed.articles, articlesBefore, 'headlines untouched');
  assert.equal(published(ARCHIVE_PATH), archiveBefore, 'archive untouched');
  assert.deepEqual(feed.archive, { initialized: true, items: 1 }, 'the archive marker is carried forward untouched');
  assert.deepEqual(git(remote, 'show', '--name-only', '--format=', 'gh-pages').split('\n'), [NEWS_PATH], 'the withholding commit changes the feed only');

  // The next run keeps the stamp's protection and still finds its memory.
  await publishRun('w4', observed([], T0 + DAY));
  assert.deepEqual(JSON.parse(published(NEWS_PATH)).articles.map((x) => x.link), [a.link]);
});

test('archive: withholding still works when the archive is corrupt, and does not touch it', async () => {
  // Withhold is the owner's emergency action. A broken archive stops scheduled runs,
  // which is exactly when a stale summary might need pulling by hand.
  await freshMemory();
  await publishFeed(() => ({ runId: 'c1', summary: 'Wrong summary.', summaryCheck: JUDGE_PASS, articles: [] }), { message: 'c1' });
  const corrupt = 'not json at all';
  pushRaw(ARCHIVE_PATH, corrupt, 'corrupt archive');

  const result = await publishFeed(
    (current) => ({ ...current, summary: null, summarySource: null, withheldAt: '2026-11-21T11:00:00Z' }),
    { message: 'Withhold news summary' },
  );
  assert.equal(result.pushed, true);
  assert.equal(JSON.parse(published(NEWS_PATH)).summary, null);
  assert.equal(published(ARCHIVE_PATH), corrupt);
  resetMemory('clear corrupt archive');
});

test('withhold.mjs writes through publishFeed without the archive', () => {
  // The two tests above mirror withhold.mjs's call rather than run it, because the
  // script then polls the live site. This pins the mirror to the real file: if
  // withhold.mjs ever opts in to the archive, or imports it, this fails.
  const source = readFileSync(new URL('../news/withhold.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /withArchive|archive\.mjs|news-archive/);
  assert.match(source, /publishFeed\(/);
});

// ── A missing archive is only a first run when the feed has never recorded one ──────

test('archive: bootstrap happens once; after that a deleted archive stops the run, even with the bootstrap flag', async () => {
  resetMemory();
  const seeded = story('from-the-seed', 5);
  const seed = applyRun(applyRun(emptyArchive(), observed([seeded], T0 - DAY)).archive, observed([seeded], T0 - DAY / 2)).archive;
  const later = story('confirmed-later');
  const publishFromSeed = (runId, now, bootstrap = false) =>
    publishFeed(
      (current, currentArchive) => {
        const fresh = applyRun(currentArchive ?? seed, observed([later], now));
        return { feed: { runId, summary: null, articles: fresh.articles }, archive: fresh.archive };
      },
      { message: `news ${runId}`, withArchive: true, bootstrap },
    );

  // No archive and no marker, and the flag set by hand: the one case that seeds.
  await publishFromSeed('b1', T0, true);
  // Every later run is an ordinary one, with no flag.
  await publishFromSeed('b2', T0 + DAY / 2);
  assert.deepEqual(parseArchive(published(ARCHIVE_PATH)).items.map((x) => x.link), [seeded.link, later.link]);
  assert.deepEqual(JSON.parse(published(NEWS_PATH)).archive, { initialized: true, items: 2 });

  // The archive is deleted (a deploy from an old checkout, a bad hand edit).
  pushRaw(ARCHIVE_PATH, null, 'archive deleted by mistake');
  const before = head();
  const feedBefore = published(NEWS_PATH);
  let applyCalled = false;

  await assert.rejects(() => readPublishedArchive(), (err) => err instanceof ArchiveError && /is missing/.test(err.message) && /2 items/.test(err.message));
  await assert.rejects(
    () =>
      publishFeed(
        (current, currentArchive) => {
          applyCalled = true;
          const fresh = applyRun(currentArchive ?? seed, observed([], T0 + DAY));
          return { feed: { runId: 'reseed', summary: null, articles: fresh.articles }, archive: fresh.archive };
        },
        // The marker says an archive existed, so not even the flag may reseed over it.
        { message: 'reseed', withArchive: true, bootstrap: true },
      ),
    /is missing/,
  );
  await assert.rejects(() => readPublishedArchive({ bootstrap: true }), /was deleted/);
  assert.equal(applyCalled, false, 'the seed is never reached');
  assert.equal(head(), before, 'nothing was pushed');
  assert.equal(onBranch(ARCHIVE_PATH), false, 'no seed-only archive was written over the gap');
  assert.equal(published(NEWS_PATH), feedBefore, 'the last good feed, and its marker, stay up');
});

test('archive: deleted between a run\'s first read and its push, the retry refuses rather than reseeding', async () => {
  await freshMemory();
  const a = story('held');
  await publishRun('d1', observed([a], T0));
  await publishRun('d2', observed([a], T0 + DAY / 2));
  const base = await readPublishedArchive();
  assert.equal(base.items.length, 1);

  let applies = 0;
  await assert.rejects(
    () =>
      publishRun('d3', observed([a], T0 + DAY), {
        baseArchive: base,
        onApply: () => {
          applies += 1;
          // Lands after this attempt read the branch and before its push.
          pushRaw(ARCHIVE_PATH, null, 'archive deleted mid-run');
        },
      }),
    (err) => err instanceof ArchiveError && /is missing/.test(err.message),
  );
  assert.equal(applies, 1, 'the retry stopped before deciding what to write');
  assert.equal(onBranch(ARCHIVE_PATH), false);
  assert.equal(JSON.parse(published(NEWS_PATH)).runId, 'd2', 'the feed is the last good one');
});

test('archive: a write must keep every item in the copy the run first read, not only the branch\'s current copy', async () => {
  await freshMemory();
  const a = story('first-read');
  await publishRun('g1', observed([a], T0));
  await publishRun('g2', observed([a], T0 + DAY / 2));
  const base = await readPublishedArchive();

  // The branch's archive is replaced by a valid but emptier one before this run pushes.
  // Checked against the branch alone, the run's write would pass and the loss would
  // become the new baseline.
  // The marker is lowered with it, as a rival writer's own commit would, so the count
  // check on the branch copy has nothing to object to.
  pushRaw(NEWS_PATH, `${JSON.stringify({ runId: 'rival', summary: null, articles: [], archive: { initialized: true, items: 0 } }, null, 2)}\n`, 'marker lowered');
  pushRaw(ARCHIVE_PATH, `${JSON.stringify(emptyArchive(), null, 2)}\n`, 'archive shrunk');
  const before = head();
  await assert.rejects(
    () => publishRun('g3', observed([], T0 + DAY), { baseArchive: base }),
    /drops a confirmed item/,
  );
  assert.equal(head(), before);
});

test('archive: a writer without the archive cannot drop the marker, whatever it returns', async () => {
  await freshMemory();
  await publishRun('n1', observed([story('n')], T0));
  // A fresh payload with no `archive` field at all, as a careless caller might build.
  await publishFeed(() => ({ runId: 'n2', summary: null, articles: [] }), { message: 'n2' });
  assert.deepEqual(JSON.parse(published(NEWS_PATH)).archive, { initialized: true, items: 0 });
  await publishFeed(() => ({ runId: 'n3', summary: null, articles: [], archive: { initialized: false } }), { message: 'n3' });
  assert.deepEqual(JSON.parse(published(NEWS_PATH)).archive, { initialized: true, items: 0 });
  await publishFeed(() => ({ runId: 'n4', summary: null, articles: [], archive: { initialized: true, items: 99 } }), { message: 'n4' });
  assert.deepEqual(JSON.parse(published(NEWS_PATH)).archive, { initialized: true, items: 0 }, 'nor raise the count');

  // And on a branch with no marker, it cannot invent one: that would make a later
  // bootstrap look like a deletion.
  resetMemory();
  await publishFeed(() => ({ runId: 'n5', summary: null, articles: [], archive: { initialized: true, items: 5 } }), { message: 'n5' });
  const feed = JSON.parse(published(NEWS_PATH));
  assert.equal(feed.runId, 'n5');
  assert.equal('archive' in feed, false);
  await freshMemory();
});

// ── The production per-attempt logic (composePublication), through real pushes ──────

/** A run as fetch-news.mjs publishes it, from the first read to the push. */
async function productionRun({ runId, observations, summary = 'Judged summary.', onApply }) {
  const base = (await readPublishedArchive()) ?? emptyArchive();
  // What the summary was written from and the judge read.
  const summarisedArticles = applyRun(base, observations).articles;
  const payload = {
    runId,
    lastUpdated: new Date(observations.now).toISOString(),
    summary,
    summarySource: null,
    summaryCheck: summary ? JUDGE_PASS : null,
    summaryDecision: summary ? 'judge-pass' : 'no-articles',
    articles: summarisedArticles,
  };
  const reasons = [];
  const result = await publishFeed(
    (current, currentArchive) => {
      onApply?.(current, currentArchive);
      const composed = composePublication({
        payload,
        summarisedArticles,
        run: observations,
        current,
        currentArchive,
        seed: emptyArchive(),
        startedAt: new Date(observations.now),
        runId,
      });
      reasons.push(composed.reason);
      return { feed: composed.feed, archive: composed.archive };
    },
    { message: `news ${runId}`, withArchive: true, baseArchive: base },
  );
  return { result, reasons, summarisedArticles };
}

test('production path: an undisturbed run publishes its summary beside exactly the articles it was written from', async () => {
  await freshMemory();
  const a = story('plain');
  const { result, reasons, summarisedArticles } = await productionRun({ runId: 'q1', observations: observed([a], T0) });
  assert.equal(result.attempt, 1);
  assert.deepEqual(reasons, [null]);
  const feed = JSON.parse(published(NEWS_PATH));
  assert.equal(feed.summary, 'Judged summary.');
  assert.deepEqual(feed.articles, summarisedArticles);
  assert.equal(parseArchive(published(ARCHIVE_PATH)).runId, 'q1');
});

test('production path: same link, different headline after a retry: headlines publish, the summary is withheld', async () => {
  // The judge read "Original headline". Before this run's push lands, a rival run records
  // the same link under another headline. On the retry this run's yes is the second one,
  // the article is confirmed, and memory's copy of the title is what gets displayed. The
  // links still match; the words the judge approved a summary against do not.
  await freshMemory();
  const mine = { ...story('retitled'), title: 'Original headline' };
  const rivalCopy = { ...mine, title: 'Rewritten headline' };
  let injected = false;

  const { result, reasons, summarisedArticles } = await productionRun({
    runId: 't1',
    observations: observed([mine], T0 + DAY / 2),
    onApply: () => {
      if (injected) return;
      injected = true;
      const rival = applyRun(emptyArchive(), observed([rivalCopy], T0));
      pushRaw(ARCHIVE_PATH, `${JSON.stringify(rival.archive, null, 2)}\n`, 'rival news push');
    },
  });

  assert.equal(result.attempt, 2);
  assert.equal(summarisedArticles[0].title, 'Original headline');
  const feed = JSON.parse(published(NEWS_PATH));
  assert.deepEqual(feed.articles.map((x) => x.link), summarisedArticles.map((x) => x.link), 'the links are identical');
  assert.equal(feed.articles[0].title, 'Rewritten headline', 'but the displayed headline is not the one the judge saw');
  assert.equal(feed.summary, null, 'so the summary must not publish');
  assert.equal(feed.summaryCheck, null);
  assert.equal(feed.summaryDecision, 'archive-changed');
  assert.equal(reasons[0], null, 'the first attempt saw nothing wrong');
  assert.match(reasons[1], /archive changed/);
  assert.equal(parseArchive(published(ARCHIVE_PATH)).items[0].title, 'Rewritten headline');
});

test('production path: a withholding newer than the run still wins, and the archive is still written', async () => {
  await freshMemory();
  const a = story('withheld-run');
  await publishFeed((current) => ({ ...current, summary: null, withheldAt: new Date(T0 + DAY).toISOString() }), { message: 'withhold' });
  const { reasons } = await productionRun({ runId: 'h1', observations: observed([a], T0) });
  const feed = JSON.parse(published(NEWS_PATH));
  assert.equal(feed.summary, null);
  assert.equal(feed.withheldAt, new Date(T0 + DAY).toISOString());
  assert.match(reasons[0], /superseded/);
  assert.equal(parseArchive(published(ARCHIVE_PATH)).pending.length, 1);
});

test('seed: a missing or malformed seed file fails closed instead of starting empty', () => {
  const dir = mkdtempSync(join(tmpdir(), 'seed-'));
  assert.throws(() => readSeedArchive(join(dir, 'absent.json')), (err) => err instanceof ArchiveError && /missing/.test(err.message));
  for (const bad of ['', '{}', '[]', '{"version":1,"items":[']) {
    writeFileSync(join(dir, 'bad.json'), bad);
    assert.throws(() => readSeedArchive(join(dir, 'bad.json')), ArchiveError);
  }
  const real = readSeedArchive(new URL('../news/seed-archive.json', import.meta.url).pathname);
  assert.ok(real.items.length > 0);
  rmSync(dir, { recursive: true, force: true });
});

// ── Nothing is seeded automatically ─────────────────────────────────────────────────

test('bootstrap: with no flag, an absent archive always stops the run, and nothing is written', async () => {
  const attempt = () => {
    let applyCalled = false;
    return assert
      .rejects(
        () => publishRun('auto', observed([story('auto')], T0), { onApply: () => { applyCalled = true; } }),
        (err) => err instanceof ArchiveError && /nothing is seeded automatically/.test(err.message) && /bootstrap_archive/.test(err.message),
      )
      .then(() => assert.equal(applyCalled, false));
  };

  // 1. Feed present with no marker, archive absent: the state of the live site today.
  resetMemory();
  let before = head();
  await attempt();
  await assert.rejects(() => readPublishedArchive(), /bootstrap_archive/);
  assert.equal(head(), before);
  assert.equal(onBranch(ARCHIVE_PATH), false);

  // 2. BOTH files deleted together, so there is no marker left to object. This used to
  //    look exactly like a first run and reseed.
  await freshMemory();
  await publishRun('x1', observed([story('lost')], T0));
  await publishRun('x2', observed([story('lost')], T0 + DAY / 2));
  pushRaw(ARCHIVE_PATH, null, 'archive deleted');
  pushRaw(NEWS_PATH, null, 'feed deleted');
  before = head();
  await attempt();
  await assert.rejects(() => readPublishedArchive(), ArchiveError);
  assert.equal(head(), before, 'nothing was pushed');
  assert.equal(onBranch(ARCHIVE_PATH), false, 'no archive was written');
  assert.equal(onBranch(NEWS_PATH), false, 'no feed was written');
});

test('bootstrap: the flag seeds once when there is no archive, and is ignored once one exists', async () => {
  resetMemory();
  const seeded = story('seeded', 3);
  const seed = applyRun(applyRun(emptyArchive(), observed([seeded], T0 - DAY)).archive, observed([seeded], T0 - DAY / 2)).archive;
  const later = story('after-bootstrap');
  const seen = [];
  const flagged = (runId, now) =>
    publishFeed(
      (current, currentArchive) => {
        seen.push(currentArchive === null ? 'seed' : 'existing');
        const fresh = applyRun(currentArchive ?? seed, observed([later], now));
        return { feed: { runId, summary: null, articles: fresh.articles }, archive: fresh.archive };
      },
      { message: `news ${runId}`, withArchive: true, bootstrap: true },
    );

  await flagged('f1', T0);
  assert.deepEqual(parseArchive(published(ARCHIVE_PATH)).items.map((x) => x.link), [seeded.link]);

  // The flag left on by mistake, twice more. The existing archive is used, not the seed:
  // `later` reaches its second yes and is confirmed, which a reseed would have undone.
  await flagged('f2', T0 + DAY / 2);
  await flagged('f3', T0 + DAY);
  assert.deepEqual(seen, ['seed', 'existing', 'existing']);
  assert.deepEqual(parseArchive(published(ARCHIVE_PATH)).items.map((x) => x.link), [seeded.link, later.link]);
  assert.notEqual(await readPublishedArchive({ bootstrap: true }), null);
});

test('marker: an archive holding fewer items than the feed records is refused before a run starts', async () => {
  await freshMemory();
  const a = story('counted-a');
  const b = story('counted-b', 2);
  await publishRun('s1', observed([a, b], T0));
  await publishRun('s2', observed([a, b], T0 + DAY / 2));
  assert.deepEqual(JSON.parse(published(NEWS_PATH)).archive, { initialized: true, items: 2 });

  // A perfectly valid archive, one item short: a hand edit, or a restore of an old copy.
  const full = parseArchive(published(ARCHIVE_PATH));
  const short = `${JSON.stringify({ ...full, items: full.items.slice(0, 1) }, null, 2)}\n`;
  pushRaw(ARCHIVE_PATH, short, 'archive lost an item');
  const before = head();

  await assert.rejects(() => readPublishedArchive(), (err) => err instanceof ArchiveError && /holds 1 confirmed items/.test(err.message) && /records 2/.test(err.message));
  let applyCalled = false;
  await assert.rejects(() => publishRun('s3', observed([], T0 + DAY), { onApply: () => { applyCalled = true; } }), /items have been lost/);
  assert.equal(applyCalled, false);
  assert.equal(head(), before);
  assert.equal(`${published(ARCHIVE_PATH)}\n`, short, 'left as found, for a person to repair');

  // Withhold still works in that state, and leaves both the archive and the marker alone.
  await publishFeed((current) => ({ ...current, summary: null, withheldAt: '2026-11-21T12:00:00Z' }), { message: 'withhold' });
  assert.deepEqual(JSON.parse(published(NEWS_PATH)).archive, { initialized: true, items: 2 });
  assert.equal(`${published(ARCHIVE_PATH)}\n`, short);
  await freshMemory();
});

test('marker: any other shape of the archive field is an error, never "not initialised"', async () => {
  for (const marker of [{ initialized: false, items: 3 }, { initialized: true }, { initialized: true, items: -1 }, { initialized: true, items: '3' }, { initialized: 'yes', items: 3 }, true, null, 'initialized', [], {}, { initialized: true, items: 1, extra: 1 }]) {
    // With the archive present, and with it absent plus the bootstrap flag: a bad marker
    // must not be read as "no marker", which would let the flag reseed.
    for (const withFile of [true, false]) {
      await freshMemory();
      pushRaw(NEWS_PATH, `${JSON.stringify({ runId: 'odd', summary: null, articles: [], archive: marker }, null, 2)}\n`, 'odd marker');
      if (!withFile) pushRaw(ARCHIVE_PATH, null, 'archive deleted');
      const before = head();
      const label = `${JSON.stringify(marker)} ${withFile ? 'with' : 'without'} an archive file`;
      await assert.rejects(() => readPublishedArchive({ bootstrap: true }), /marker in api\/news\.json is malformed/, label);
      await assert.rejects(() => publishRun('odd', observed([], T0), { bootstrap: true }), /malformed/, label);
      assert.equal(head(), before, label);
    }
  }
  await freshMemory();
});

test('fetch-news.yml: only a hand-ticked input can set the bootstrap flag', () => {
  const workflow = readFileSync(new URL('../../.github/workflows/fetch-news.yml', import.meta.url), 'utf8');
  const input = workflow.slice(workflow.indexOf('bootstrap_archive:'), workflow.indexOf('test_email:'));
  assert.match(input, /type: boolean\s+default: false/);
  // One place sets it, from that input alone; a scheduled run has no inputs.
  const sets = workflow.match(/NEWS_ARCHIVE_BOOTSTRAP:.*/g);
  assert.deepEqual(sets, ["NEWS_ARCHIVE_BOOTSTRAP: ${{ github.event.inputs.bootstrap_archive == 'true' && '1' || '' }}"]);
  const script = readFileSync(new URL('../fetch-news.mjs', import.meta.url), 'utf8');
  assert.match(script, /const BOOTSTRAP = process\.env\.NEWS_ARCHIVE_BOOTSTRAP === '1';/);
  // The seed is loaded in exactly two places, both behind a null archive from the publisher.
  assert.equal(script.match(/loadSeed\(\)/g).length, 2);
});

// ── Newsletters (the separate list in api/news.json) ────────────────────────────────

test('newsletters: withholding keeps the list that is on the branch, and a later run replaces it', async () => {
  await freshMemory();
  const a = story('beside-newsletters');
  const letters = [{ title: 'Full Rights Update', link: 'https://lwvdc.substack.com/p/one', pubDate: '2026-11-20T12:00:00.000Z', source: 'League of Women Voters DC' }];
  const publishWith = (runId, newsletters, now) =>
    publishFeed(
      (current, currentArchive) => {
        const run = observed([a], now);
        const summarisedArticles = applyRun(currentArchive, run).articles;
        const payload = { runId, lastUpdated: new Date(now).toISOString(), summary: 'Judged summary.', summarySource: null, summaryCheck: JUDGE_PASS, summaryDecision: 'judge-pass', articles: summarisedArticles, newsletters };
        const composed = composePublication({ payload, summarisedArticles, run, current, currentArchive, seed: null, startedAt: new Date(now), runId });
        return { feed: composed.feed, archive: composed.archive };
      },
      { message: `news ${runId}`, withArchive: true },
    );

  await publishWith('l1', letters, T0);
  assert.deepEqual(JSON.parse(published(NEWS_PATH)).newsletters, letters);
  assert.doesNotMatch(published(ARCHIVE_PATH), /substack/, 'never in the archive');

  // Exactly the write scripts/news/withhold.mjs makes.
  await publishFeed(
    (current) => ({ ...current, summary: null, summarySource: null, withheldAt: '2026-11-21T10:05:00Z', withheldReason: 'test' }),
    { message: 'Withhold news summary' },
  );
  const withheld = JSON.parse(published(NEWS_PATH));
  assert.equal(withheld.summary, null);
  assert.deepEqual(withheld.newsletters, letters, 'the newsletters list is untouched by a withholding');
  assert.equal(withheld.articles.length, 1);

  // The newsletter feed fails on the next run: an empty list, and the headlines still publish.
  await publishWith('l2', [], T0 + DAY / 2);
  const next = JSON.parse(published(NEWS_PATH));
  assert.deepEqual(next.newsletters, []);
  assert.deepEqual(next.articles.map((x) => x.link), [a.link]);
});
