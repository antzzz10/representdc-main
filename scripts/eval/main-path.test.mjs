/**
 * Runs the REAL scripts/fetch-news.mjs, start to finish, offline, and checks the one
 * rule the newsletters list depends on: no newsletter title or link reaches a model, the
 * `articles` list or the archive.
 *
 * Nothing was extracted or restructured to make this possible. The script runs unchanged
 * as a child process with fixtures/main-path-preload.mjs loaded first, which replaces
 * global fetch: feeds come from fixtures built here, the model API is a stub that
 * records every prompt it receives, and the live-site check reads the local bare repo
 * that NEWS_REMOTE points the publisher at. No network, no API key, no GitHub.
 *
 * Two runs. The second meets a withholding that lands between its read of the branch
 * and its push (a pre-receive hook on the bare repo swaps it in and rejects the push
 * once), so the retry path and the withhold interleaving both run for real.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, chmodSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { publishFeed } from '../news/publish.mjs';
import { emptyArchive, parseArchive } from '../news/archive.mjs';
import { FEEDS, NEWSLETTERS } from '../news/feeds.mjs';

const SCRIPT = fileURLToPath(new URL('../fetch-news.mjs', import.meta.url));
const PRELOAD = fileURLToPath(new URL('./fixtures/main-path-preload.mjs', import.meta.url));
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();

// Strings that exist only in the newsletter fixture. None may appear where a model, the
// articles list or the archive could see it.
const NEWSLETTER_MARKS = ['NEWSLETTER-MARKER', 'Full Rights Update', 'lwvdc.substack.com', 'p/marker-'];
const NEWS_LINK = 'https://51st.news/statehood-bill-advances/';

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toUTCString();
const rss = (items) =>
  `<?xml version="1.0"?><rss version="2.0"><channel><title>t</title>${items
    .map((i) => `<item><title>${i.title}</title><link>${i.link}</link><pubDate>${i.pubDate}</pubDate></item>`)
    .join('')}</channel></rss>`;

let scratch;
let remote;
let log;
let feedsFile;

function published(path) {
  return git(remote, 'show', `gh-pages:${path}`);
}

/** One real run of the script. Returns its exit code, output and run record. */
function runScript(name) {
  const cwd = join(scratch, name);
  mkdirSync(cwd);
  const env = { ...process.env, NEWS_REMOTE: remote, MAIN_PATH_LOG: log, MAIN_PATH_FEEDS: feedsFile, ANTHROPIC_API_KEY: 'test-key-not-real' };
  for (const key of ['GITHUB_TOKEN', 'GITHUB_OUTPUT', 'GITHUB_RUN_ID', 'DRY_RUN', 'NEWS_ARCHIVE_BOOTSTRAP', 'NEWS_SUMMARY_ENABLED']) delete env[key];
  const result = spawnSync(process.execPath, ['--import', PRELOAD, SCRIPT], { cwd, env, encoding: 'utf8', timeout: 120000 });
  const recordPath = join(cwd, 'run-record.json');
  return {
    status: result.status,
    out: result.stdout + result.stderr,
    record: existsSync(recordPath) ? JSON.parse(readFileSync(recordPath, 'utf8')) : null,
  };
}

const prompts = () => readFileSync(log, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));

function assertNoNewsletter(text, where) {
  for (const mark of NEWSLETTER_MARKS) assert.equal(text.includes(mark), false, `${where} must not contain "${mark}"`);
}

before(async () => {
  scratch = mkdtempSync(join(tmpdir(), 'main-path-'));
  log = join(scratch, 'model-prompts.jsonl');
  writeFileSync(log, '');

  // Every news feed fails except one, and the newsletter feed works. The newsletter's
  // title says "statehood" on purpose: the stub filter says yes to that word.
  const routes = { '*': 503 };
  routes[FEEDS[0].url] = rss([
    { title: 'D.C. statehood bill advances in the House', link: NEWS_LINK, pubDate: daysAgo(1) },
    { title: 'Where to find the best holiday markets', link: 'https://51st.news/holiday-markets/', pubDate: daysAgo(1) },
  ]);
  routes[NEWSLETTERS[0].url] = rss([
    { title: 'Full Rights Update: statehood NEWSLETTER-MARKER one', link: 'https://lwvdc.substack.com/p/marker-one', pubDate: daysAgo(2) },
    { title: 'Full Rights Update: statehood NEWSLETTER-MARKER two', link: 'https://lwvdc.substack.com/p/marker-two', pubDate: daysAgo(9) },
  ]);
  feedsFile = join(scratch, 'feeds.json');
  writeFileSync(feedsFile, JSON.stringify(routes));

  // A gh-pages branch with a site on it and an archive already bootstrapped (empty).
  remote = join(scratch, 'remote.git');
  execFileSync('git', ['init', '--bare', '-q', '-b', 'gh-pages', remote]);
  const seed = join(scratch, 'seed');
  mkdirSync(seed);
  git(seed, 'init', '-q', '-b', 'gh-pages');
  git(seed, 'config', 'user.email', 'test@example.com');
  git(seed, 'config', 'user.name', 'Test');
  writeFileSync(join(seed, 'index.html'), '<!doctype html>site\n');
  git(seed, 'add', '-A');
  git(seed, 'commit', '-q', '-m', 'site');
  git(seed, 'remote', 'add', 'origin', remote);
  git(seed, 'push', '-q', 'origin', 'gh-pages');

  process.env.NEWS_REMOTE = remote;
  try {
    await publishFeed(() => ({ feed: { runId: 'bootstrap', summary: null, articles: [] }, archive: emptyArchive() }), {
      message: 'bootstrap',
      withArchive: true,
      bootstrap: true,
    });
  } finally {
    delete process.env.NEWS_REMOTE;
  }
});

after(() => rmSync(scratch, { recursive: true, force: true }));

test('main path, first run: newsletters publish in their own list and no model is shown them', () => {
  const run = runScript('run1');
  assert.equal(run.status, 0, run.out);
  assert.equal(run.record.outcome, 'published', run.out);

  const seen = prompts();
  assert.deepEqual(seen.map((p) => p.kind), ['filter', 'summary', 'judge'], 'all three model calls really happened');
  for (const p of seen) assertNoNewsletter(p.prompt, `the ${p.kind} prompt`);
  // The prompts did carry the news: this is the real path, not an empty one.
  assert.match(seen[0].prompt, /D\.C\. statehood bill advances/);
  assert.match(seen[1].prompt, /D\.C\. statehood bill advances/);

  const feed = JSON.parse(published('api/news.json'));
  assert.deepEqual(feed.articles.map((a) => a.link), [NEWS_LINK]);
  assertNoNewsletter(JSON.stringify(feed.articles), 'articles');
  assertNoNewsletter(feed.summary, 'the summary');
  assert.deepEqual(feed.newsletters.map((n) => n.link), ['https://lwvdc.substack.com/p/marker-one', 'https://lwvdc.substack.com/p/marker-two']);
  assert.deepEqual(feed.newsletters.map((n) => n.source), ['League of Women Voters DC', 'League of Women Voters DC']);

  const archiveText = published('api/news-archive.json');
  const archive = parseArchive(archiveText);
  assert.deepEqual(archive.pending.map((p) => p.link), [NEWS_LINK]);
  assertNoNewsletter(JSON.stringify([archive.items, archive.pending]), 'archive items and pending');
  // Its feed health is the one thing memory keeps about it, under its own key.
  assert.deepEqual(archive.feedHealth['newsletter:League of Women Voters DC'], { failingSince: null, lastStatus: 'ok' });
  assertNoNewsletter(archiveText.replace(/"newsletter:League of Women Voters DC"/, ''), 'the archive file');

  assertNoNewsletter(JSON.stringify(run.record.candidates), 'the candidates sent toward the filter');
  assert.equal(run.record.newsletters.length, 2);
  // G5 passed on the one news feed; the newsletter feed is recorded but did not count.
  assert.match(run.record.gates[0].detail, new RegExp(`^1/${FEEDS.length} sources ok`));
  assert.equal(run.record.sources.filter((s) => s.kind === 'newsletter').length, 1);
});

test('main path, second run: a withholding lands mid-push; the retry keeps it, the newsletters and the separation', () => {
  // The withholding, exactly as scripts/news/withhold.mjs writes it, prepared as a commit
  // on a side branch. The hook swaps it onto gh-pages when this run's push arrives and
  // rejects that push once, so the run has to re-read the branch and apply again.
  const withheldAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const rival = join(scratch, 'rival');
  mkdirSync(rival);
  git(rival, 'clone', '-q', remote, '.');
  git(rival, 'config', 'user.email', 'owner@example.com');
  git(rival, 'config', 'user.name', 'Owner');
  const current = JSON.parse(readFileSync(join(rival, 'api/news.json'), 'utf8'));
  writeFileSync(join(rival, 'api/news.json'), `${JSON.stringify({ ...current, summary: null, summarySource: null, withheldAt, withheldReason: 'test' }, null, 2)}\n`);
  git(rival, 'add', '-A');
  git(rival, 'commit', '-q', '-m', 'Withhold news summary');
  git(rival, 'push', '-q', 'origin', 'gh-pages:refs/heads/rival');
  const rivalSha = git(rival, 'rev-parse', 'HEAD');
  const archiveBefore = published('api/news-archive.json');

  writeFileSync(join(remote, 'armed'), rivalSha);
  writeFileSync(
    join(remote, 'hooks/pre-receive'),
    `#!/bin/sh
dir="$(pwd)"
[ -f "$dir/armed" ] || exit 0
sha="$(cat "$dir/armed")"
rm "$dir/armed"
env -u GIT_QUARANTINE_PATH -u GIT_OBJECT_DIRECTORY -u GIT_ALTERNATE_OBJECT_DIRECTORIES git --git-dir="$dir" update-ref refs/heads/gh-pages "$sha"
echo "rejected once: a withholding landed first" >&2
exit 1
`,
  );
  chmodSync(join(remote, 'hooks/pre-receive'), 0o755);
  writeFileSync(log, '');

  const run = runScript('run2');
  assert.equal(run.status, 0, run.out);
  assert.equal(existsSync(join(remote, 'armed')), false, 'the hook fired');
  assert.equal(run.record.published.attempt, 2, 'the first push was rejected and the run retried');
  assert.equal(run.record.outcome, 'summary-withheld');
  assert.match(run.record.reason, /withholding/);

  // The withholding commit itself kept the newsletters and never touched the archive.
  const withheldFeed = JSON.parse(git(remote, 'show', `${rivalSha}:api/news.json`));
  assert.equal(withheldFeed.newsletters.length, 2, 'a withholding keeps the list that is on the branch');
  assert.equal(git(remote, 'show', `${rivalSha}:api/news-archive.json`), archiveBefore);

  const feed = JSON.parse(published('api/news.json'));
  assert.equal(feed.summary, null, 'the newer withholding wins');
  assert.equal(feed.withheldAt, withheldAt);
  assert.deepEqual(feed.articles.map((a) => a.link), [NEWS_LINK]);
  assertNoNewsletter(JSON.stringify(feed.articles), 'articles after the retry');
  assert.equal(feed.newsletters.length, 2);

  // The second yes confirmed the article; still nothing of the newsletter in memory.
  const archive = parseArchive(published('api/news-archive.json'));
  assert.deepEqual(archive.items.map((i) => i.link), [NEWS_LINK]);
  assert.deepEqual(archive.pending, []);
  assertNoNewsletter(JSON.stringify([archive.items, archive.pending]), 'archive items and pending after the retry');

  const seen = prompts();
  assert.deepEqual(seen.map((p) => p.kind), ['filter', 'summary', 'judge']);
  for (const p of seen) assertNoNewsletter(p.prompt, `the ${p.kind} prompt on the second run`);
});

test('main path, third run: the confirmed article skips the filter, and newsletters still reach no model', () => {
  writeFileSync(log, '');
  const run = runScript('run3');
  assert.equal(run.status, 0, run.out);
  const seen = prompts();
  assert.ok(seen.length >= 1);
  const filter = seen.find((p) => p.kind === 'filter');
  assert.doesNotMatch(filter.prompt, /statehood bill advances/, 'confirmed: not judged again');
  for (const p of seen) assertNoNewsletter(p.prompt, `the ${p.kind} prompt on the third run`);
  const feed = JSON.parse(published('api/news.json'));
  assert.deepEqual(feed.articles.map((a) => a.link), [NEWS_LINK]);
  assert.equal(feed.newsletters.length, 2);
  assert.equal(parseArchive(published('api/news-archive.json')).items.length, 1);
});
