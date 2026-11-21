/**
 * Tests for .github/scripts/news-feed-alert.sh, the step that keeps one issue open while
 * a news source keeps failing.
 *
 * The real script runs under bash against a fake `gh` (written to a temp folder and put
 * first on PATH) that keeps issues in a JSON file and can be told to fail one kind of
 * call. Needs bash and jq, as the workflow runner has. No network, no GitHub. Run with
 * `npm run test:news`.
 */

import { test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = fileURLToPath(new URL('../../.github/scripts/news-feed-alert.sh', import.meta.url));
const dir = mkdtempSync(join(tmpdir(), 'feed-alert-'));
const STATE = join(dir, 'state.json');

// A stand-in for the GitHub CLI: just the five calls the script makes.
writeFileSync(
  join(dir, 'gh'),
  `#!/usr/bin/env node
const fs = require('fs');
const args = process.argv.slice(2);
const call = args.slice(0, 2).join(' ');
const state = JSON.parse(fs.readFileSync(process.env.GH_STATE, 'utf8'));
state.calls.push(call);
const save = () => fs.writeFileSync(process.env.GH_STATE, JSON.stringify(state));
if ((process.env.GH_FAIL || '').split(',').includes(call)) { save(); process.exit(1); }
const flag = (name) => args[args.indexOf(name) + 1];
const issue = () => state.issues.find((i) => String(i.number) === args[2]);
if (call === 'issue list') {
  console.log(JSON.stringify(state.issues.filter((i) => i.open).map(({ number, title, body }) => ({ number, title, body }))));
} else if (call === 'issue view') {
  console.log(JSON.stringify({ comments: issue().comments.map((body) => ({ body })) }));
} else if (call === 'issue create') {
  const number = state.issues.length + 1;
  state.issues.push({ number, title: flag('--title'), body: flag('--body'), open: true, comments: [] });
  console.log('https://github.com/x/y/issues/' + number);
} else if (call === 'issue comment') {
  issue().comments.push(flag('--body'));
} else if (call === 'issue edit') {
  issue().body = flag('--body');
} else if (call === 'issue close') {
  issue().open = false;
} else if (call !== 'label create') {
  process.exit(2);
}
save();
`,
);
chmodSync(join(dir, 'gh'), 0o755);

const ROLL_CALL = 'Roll Call: http-404, failing since 2026-11-18';
const DC_VOTE = 'DC Vote: http-503, failing since 2026-11-20';
const ACLU = 'ACLU DC: http-500, failing since 2026-11-17';

/** One workflow run. `long` = failing two days or more; `now` = everything failing. */
function run({ long = [], now = long, fail = '', env = {} } = {}) {
  const result = spawnSync('bash', [SCRIPT], {
    encoding: 'utf8',
    env: {
      PATH: `${dir}:${process.env.PATH}`,
      GH_STATE: STATE,
      GH_FAIL: fail,
      GITHUB_REPOSITORY: 'x/y',
      RUN_URL: 'https://example.org/run',
      FEED_ALERT: long.join('\n'),
      FEED_FAILING_NOW: now.join('\n'),
      FEED_ALERT_CHECKED: 'true',
      ...env,
    },
  });
  return { status: result.status, out: result.stdout + result.stderr };
}

const state = () => JSON.parse(readFileSync(STATE, 'utf8'));
const issues = () => state().issues;

beforeEach(() => writeFileSync(STATE, JSON.stringify({ issues: [], calls: [] })));
after(() => rmSync(dir, { recursive: true, force: true }));

test('feed alert: opens one issue, stays quiet while nothing changes, closes when all recover', () => {
  assert.equal(run({ long: [ROLL_CALL] }).status, 0);
  assert.equal(issues().length, 1);
  assert.match(issues()[0].body, /Roll Call: http-404/);

  for (let i = 0; i < 3; i += 1) assert.match(run({ long: [ROLL_CALL] }).out, /staying quiet/);
  assert.equal(issues().length, 1, 'never one issue per run');
  assert.deepEqual(issues()[0].comments, []);

  assert.equal(run({ long: [] }).status, 0);
  assert.equal(issues()[0].open, false);
  assert.deepEqual(issues()[0].comments, ['Recovered: every source fetched on this run. Closing.']);
});

test('feed alert: a source failing for under two days opens nothing', () => {
  const result = run({ long: [], now: [DC_VOTE] });
  assert.equal(result.status, 0);
  assert.deepEqual(issues(), []);
});

test('feed alert: a changed list adds one comment and rewrites the body', () => {
  run({ long: [ROLL_CALL] });
  run({ long: [ROLL_CALL, ACLU] });
  assert.equal(issues().length, 1);
  assert.match(issues()[0].body, /ACLU DC: http-500/);
  assert.equal(issues()[0].comments.length, 1);
  assert.match(issues()[0].comments[0], /ACLU DC/);
  // One unchanged source must not hide a newly failing one, or a recovered one.
  run({ long: [ACLU] });
  assert.doesNotMatch(issues()[0].body, /Roll Call/);
  assert.equal(issues()[0].comments.length, 2);
});

test('feed alert: A recovers while B has failed for one day: the issue stays open and is not called recovered', () => {
  run({ long: [ROLL_CALL] });
  const handoff = run({ long: [], now: [DC_VOTE] });
  assert.equal(handoff.status, 0);

  const [issue] = issues();
  assert.equal(issue.open, true, 'another source is still down');
  assert.doesNotMatch(issue.comments.join('\n'), /Recovered/);
  assert.doesNotMatch(handoff.out, /All sources healthy/);
  // And the issue now says what is true: Roll Call is back, DC Vote is the one failing.
  assert.doesNotMatch(issue.body, /Roll Call/);
  assert.match(issue.body, /DC Vote: http-503/);
  assert.match(issue.body, /less than two\s+days/);
  assert.equal(issue.comments.length, 1);

  // Same state next run: silent. Then B passes two days: updated. Then all clear: closed.
  assert.match(run({ long: [], now: [DC_VOTE] }).out, /staying quiet/);
  run({ long: [DC_VOTE] });
  assert.match(issues()[0].body, /two days or more:\s+DC Vote/);
  run({ long: [], now: [] });
  assert.equal(issues()[0].open, false);
  assert.equal(issues().length, 1);
});

test('feed alert: a source under two days is listed beside the long-failing ones', () => {
  run({ long: [ROLL_CALL], now: [ROLL_CALL, DC_VOTE] });
  assert.match(issues()[0].body, /two days or more:\s+Roll Call[^]*less than two days so far:\s+DC Vote/);
});

test('feed alert: a preview or an unchecked run touches nothing', () => {
  run({ long: [ROLL_CALL] });
  const calls = state().calls.length;
  assert.equal(run({ long: [], env: { DRY_RUN: '1' } }).status, 0);
  assert.equal(run({ long: [], env: { FEED_ALERT_CHECKED: '' } }).status, 0);
  assert.equal(state().calls.length, calls, 'no GitHub call at all');
  assert.equal(issues()[0].open, true);
});

test('feed alert: a failed lookup exits non-zero and changes nothing', () => {
  const result = run({ long: [ROLL_CALL], fail: 'issue list' });
  assert.equal(result.status, 1);
  assert.match(result.out, /::error::.*could not look up/);
  assert.doesNotMatch(result.out, /Opened|healthy/);
  assert.deepEqual(issues(), []);
});

test('feed alert: a failed create exits non-zero, and the next run opens exactly one issue', () => {
  for (const fail of ['issue create', 'label create']) {
    writeFileSync(STATE, JSON.stringify({ issues: [], calls: [] }));
    const failed = run({ long: [ROLL_CALL], fail });
    assert.equal(failed.status, 1, `${fail} failing must not read as success`);
    assert.doesNotMatch(failed.out, /Opened feed alert/);
    assert.deepEqual(issues(), []);
    assert.equal(run({ long: [ROLL_CALL] }).status, 0);
    assert.equal(issues().length, 1);
  }
});

test('feed alert: a failed update is retried next run without a duplicate comment', () => {
  // Each way the update can break part-way, then a clean run.
  for (const fail of ['issue view', 'issue comment', 'issue edit']) {
    writeFileSync(STATE, JSON.stringify({ issues: [], calls: [] }));
    run({ long: [ROLL_CALL] });
    const failed = run({ long: [ROLL_CALL, ACLU], fail });
    assert.equal(failed.status, 1, `${fail} failing must not read as success`);
    assert.doesNotMatch(failed.out, /Updated feed alert/);
    assert.doesNotMatch(issues()[0].body, /ACLU/, 'the body only changes once the whole update worked');

    assert.equal(run({ long: [ROLL_CALL, ACLU] }).status, 0);
    assert.match(issues()[0].body, /ACLU DC/);
    assert.equal(issues()[0].comments.length, 1, `exactly one comment after ${fail} failed once`);
    assert.equal(issues().length, 1);
  }
});

test('feed alert: a failed close is retried next run without a second recovery comment', () => {
  for (const fail of ['issue comment', 'issue close']) {
    writeFileSync(STATE, JSON.stringify({ issues: [], calls: [] }));
    run({ long: [ROLL_CALL] });
    const failed = run({ long: [], fail });
    assert.equal(failed.status, 1);
    assert.doesNotMatch(failed.out, /closed #/);
    assert.equal(issues()[0].open, true);

    assert.equal(run({ long: [] }).status, 0);
    assert.equal(issues()[0].open, false);
    assert.equal(issues()[0].comments.length, 1);
  }
});

test('fetch-news.yml: the step passes both lists and cannot fail the job', () => {
  const workflow = readFileSync(new URL('../../.github/workflows/fetch-news.yml', import.meta.url), 'utf8');
  const step = workflow.slice(workflow.indexOf('Open, update or close the failing-feed issue'));
  const block = step.slice(0, step.indexOf('news-feed-alert.sh'));
  assert.match(block, /continue-on-error: true/);
  assert.match(block, /FEED_ALERT: \$\{\{ steps\.run\.outputs\.feed_alert \}\}/);
  assert.match(block, /FEED_FAILING_NOW: \$\{\{ steps\.run\.outputs\.feed_failing_now \}\}/);
  assert.match(block, /FEED_ALERT_CHECKED: \$\{\{ steps\.run\.outputs\.feed_alert_checked \}\}/);
});
