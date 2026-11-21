/**
 * A site deploy must not delete, replace or roll back the two files the news workflow
 * owns on gh-pages: api/news.json and api/news-archive.json.
 *
 * The archive is the one that cannot be rebuilt. It is the permanent record of every
 * confirmed article, gh-pages holds the only copy, and `npm run deploy` replaces
 * everything on that branch except what scripts/deploy.mjs tells gh-pages to keep. So
 * this runs the real scripts/deploy.mjs, with the installed gh-pages package, against a
 * local bare repo (DEPLOY_TEST_REPO) and a scratch build (DEPLOY_TEST_DIST). No network,
 * no GitHub. Run with `npm run test:news`.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { NEWS_PATH } from '../news/publish.mjs';
import { ARCHIVE_PATH } from '../news/archive.mjs';

const DEPLOY_SCRIPT = fileURLToPath(new URL('../deploy.mjs', import.meta.url));
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();

const FEED = `${JSON.stringify({ runId: 'live', summary: null, articles: [] }, null, 2)}\n`;
const ARCHIVE = `${JSON.stringify({ version: 1, items: [{ link: 'https://example.org/a', title: 'Kept forever', source: 'The 51st', pubDate: '2026-09-01T00:00:00.000Z', firstSeen: '2026-09-01T06:17:00.000Z', confirmedAt: '2026-09-01T18:17:00.000Z' }], pending: [], feedHealth: {} }, null, 2)}\n`;

let scratch;
let remote;

/** A bare repo whose gh-pages holds an old site build plus the two news files. */
function seedRemote() {
  const bare = join(scratch, 'remote.git');
  execFileSync('git', ['init', '--bare', '-q', '-b', 'gh-pages', bare]);
  const work = join(scratch, 'seed');
  mkdirSync(join(work, 'api'), { recursive: true });
  mkdirSync(join(work, 'assets'), { recursive: true });
  git(work, 'init', '-q', '-b', 'gh-pages');
  git(work, 'config', 'user.email', 'test@example.com');
  git(work, 'config', 'user.name', 'Test');
  writeFileSync(join(work, 'index.html'), '<!doctype html>old\n');
  writeFileSync(join(work, 'assets/app-old.js'), 'console.log("old")\n');
  writeFileSync(join(work, 'api/stale.json'), '{}\n');
  writeFileSync(join(work, NEWS_PATH), FEED);
  writeFileSync(join(work, ARCHIVE_PATH), ARCHIVE);
  git(work, 'add', '-A');
  git(work, 'commit', '-q', '-m', 'seed');
  git(work, 'remote', 'add', 'origin', bare);
  git(work, 'push', '-q', 'origin', 'gh-pages');
  return bare;
}

function makeDist(name, extraFiles = {}) {
  const dist = join(scratch, name);
  mkdirSync(join(dist, 'assets'), { recursive: true });
  writeFileSync(join(dist, 'index.html'), `<!doctype html>${name}\n`);
  writeFileSync(join(dist, `assets/app-${name}.js`), 'console.log("new")\n');
  for (const [path, content] of Object.entries(extraFiles)) {
    mkdirSync(join(dist, path, '..'), { recursive: true });
    writeFileSync(join(dist, path), content);
  }
  return dist;
}

function runDeploy(dist) {
  return spawnSync(process.execPath, [DEPLOY_SCRIPT], {
    encoding: 'utf8',
    env: {
      ...process.env,
      DEPLOY_TEST_DIST: dist,
      DEPLOY_TEST_REPO: remote,
      // gh-pages keeps its working clone in a cache folder; keep that out of node_modules.
      CACHE_DIR: join(scratch, 'cache'),
      GIT_AUTHOR_NAME: 'Deploy Test',
      GIT_AUTHOR_EMAIL: 'deploy@example.com',
      GIT_COMMITTER_NAME: 'Deploy Test',
      GIT_COMMITTER_EMAIL: 'deploy@example.com',
    },
  });
}

const published = (path) => execFileSync('git', ['show', `gh-pages:${path}`], { cwd: remote, encoding: 'utf8' });
const tree = () => git(remote, 'ls-tree', '-r', '--name-only', 'gh-pages').split('\n').sort();

before(() => {
  scratch = mkdtempSync(join(tmpdir(), 'deploy-test-'));
  remote = seedRemote();
});

after(() => {
  rmSync(scratch, { recursive: true, force: true });
});

test('deploy: replaces the site but leaves the news feed and the archive exactly as they were', () => {
  const result = runDeploy(makeDist('v2'));
  assert.equal(result.status, 0, result.stderr);

  assert.equal(published(ARCHIVE_PATH), ARCHIVE, 'the archive must survive a deploy byte for byte');
  assert.equal(published(NEWS_PATH), FEED, 'the feed must survive a deploy byte for byte');
  // And it really did replace everything else, including other files under api/.
  assert.deepEqual(tree(), [ARCHIVE_PATH, NEWS_PATH, 'assets/app-v2.js', 'index.html'].sort());
  assert.match(published('index.html'), /v2/);
});

test('deploy: a second deploy in a row still keeps both files', () => {
  // The first deploy leaves gh-pages' cached clone behind; the second reuses it.
  const result = runDeploy(makeDist('v3'));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(published(ARCHIVE_PATH), ARCHIVE);
  assert.equal(published(NEWS_PATH), FEED);
  assert.match(published('index.html'), /v3/);
});

test('deploy: refuses to run when the build contains either news file', () => {
  const headBefore = git(remote, 'rev-parse', 'gh-pages');
  for (const path of [ARCHIVE_PATH, NEWS_PATH]) {
    const result = runDeploy(makeDist(`bad-${path.replace(/\W/g, '-')}`, { [path]: '{"from":"a build"}\n' }));
    assert.equal(result.status, 1, `a build carrying ${path} must be refused`);
    assert.match(result.stderr, new RegExp(path.replace(/[.]/g, '\\.')));
  }
  assert.equal(git(remote, 'rev-parse', 'gh-pages'), headBefore, 'nothing was pushed');
  assert.equal(published(ARCHIVE_PATH), ARCHIVE);
});
