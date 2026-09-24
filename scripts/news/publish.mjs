/**
 * Publishing and logging for the news digest.
 *
 * Two branches, with strictly separate jobs (NEWS-AND-ANALYSIS-PRD.md section A):
 *
 *   gh-pages   api/news.json  — the only file this pipeline ever publishes. Manual
 *                              deploys exclude it, so the two writers never collide.
 *   news-data                 — a historical log, no longer written to (see below).
 *
 * Three rules keep concurrent writers honest, because scheduled runs, reruns and the
 * Withhold workflow all target the same file (Codex round 2, blocker 1):
 *
 *   1. The workflows share a concurrency group, so only one runs at a time.
 *   2. Every write re-reads the branch's current file immediately before pushing and
 *      re-applies its change to that copy. A rejected push never re-pushes stale bytes.
 *   3. A withholding always beats an older run: a fetch that started before the file's
 *      `withheldAt` publishes its headlines with summary: null.
 *
 * "Published" means the JSON is live at the public URL with this run's id — not that a
 * push succeeded. GitHub's docs say a GITHUB_TOKEN push does not trigger a Pages build;
 * the sibling repo's record says otherwise (dc-bills-tracker, 2026-09-11: bot push at
 * 10:04:47, Pages build for that commit `built` at 10:04:49). Rather than trust either,
 * every run checks the live URL.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const exec = promisify(execFile);

export const LIVE_URL = 'https://www.representdc.org/api/news.json';
export const NEWS_PATH = 'api/news.json';
const PUSH_ATTEMPTS = 3;

async function git(cwd, args) {
  const { stdout } = await exec('git', args, { cwd, maxBuffer: 10 * 1024 * 1024 });
  return stdout.trim();
}

function repoUrl() {
  // NEWS_REMOTE points the publisher at a local bare repo so the concurrency tests can
  // exercise real pushes, rejections and retries without touching GitHub.
  if (process.env.NEWS_REMOTE) return process.env.NEWS_REMOTE;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY ?? 'antzzz10/representdc-main';
  return token
    ? `https://x-access-token:${token}@github.com/${repo}.git`
    : `https://github.com/${repo}.git`;
}

/** Shallow-clones one branch into a temp dir, creating it as an orphan if missing. */
async function checkoutBranch(branch) {
  const dir = mkdtempSync(join(tmpdir(), `news-${branch}-`));
  await git(dir, ['init', '-q']);
  await git(dir, ['remote', 'add', 'origin', repoUrl()]);
  await git(dir, ['config', 'user.name', 'RepresentDC News Bot']);
  await git(dir, ['config', 'user.email', 'github-actions[bot]@users.noreply.github.com']);
  try {
    await git(dir, ['fetch', '--depth', '1', 'origin', branch]);
    await git(dir, ['checkout', '-q', 'FETCH_HEAD']);
    await git(dir, ['checkout', '-q', '-B', branch]);
    return { dir, existed: true };
  } catch (err) {
    // Only a genuinely absent branch may fall through to an orphan. Treating every
    // failure that way would turn an auth or network error into "there is no feed yet",
    // and publish a fresh branch over a repo that already has one.
    const message = `${err.stderr ?? ''}${err.message ?? ''}`;
    if (!/couldn't find remote ref|not our ref|unknown revision/i.test(message)) throw err;
    await git(dir, ['checkout', '-q', '--orphan', branch]);
    return { dir, existed: false };
  }
}

/**
 * Publishes a feed payload to gh-pages.
 *
 * `apply` receives the branch's current file (or null) and returns what to write, so a
 * caller can make its decision against fresh state on every attempt — that is rule 2,
 * and it is what lets Withhold and a scheduled run interleave safely.
 */
export async function publishFeed(apply, { message }) {
  let lastError;
  for (let attempt = 1; attempt <= PUSH_ATTEMPTS; attempt += 1) {
    const { dir } = await checkoutBranch('gh-pages');
    const path = join(dir, NEWS_PATH);
    const current = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;

    const next = apply(current);
    if (next === null) return { pushed: false, skipped: true, current };

    // The invariant, enforced at the boundary rather than trusted upstream: a published
    // summary must carry its own judge pass. A future caller that bypasses
    // fetch-news.mjs — or a refactor that sets `summary` before judging — fails loudly
    // here instead of quietly publishing unchecked text.
    if (next.summary && next.summaryCheck?.judge !== 'pass') {
      throw new Error(
        `refusing to publish a summary without a judge pass (summaryCheck: ${JSON.stringify(next.summaryCheck)})`,
      );
    }

    mkdirSync(join(dir, 'api'), { recursive: true });
    writeFileSync(path, `${JSON.stringify(next, null, 2)}\n`);

    await git(dir, ['add', NEWS_PATH]);
    const staged = await git(dir, ['diff', '--staged', '--name-only']);
    if (!staged) return { pushed: false, unchanged: true, payload: next };

    await git(dir, ['commit', '-q', '-m', message]);
    try {
      await git(dir, ['push', '-q', 'origin', 'gh-pages']);
      return { pushed: true, payload: next, attempt };
    } catch (err) {
      // Almost always a non-fast-forward: another writer got there first. Start over
      // from their state rather than force-pushing over it.
      lastError = err;
      console.warn(`push attempt ${attempt} rejected, re-reading branch: ${err.message}`);
    }
  }
  throw new Error(`could not publish after ${PUSH_ATTEMPTS} attempts: ${lastError?.message}`);
}

/**
 * Polls the public URL until it serves this run's id. Returns the outcome rather than
 * throwing: a run that pushed but is not live yet is a real state the record must carry.
 */
export async function verifyLive(runId, { timeoutMs = 10 * 60 * 1000, intervalMs = 20000, url = LIVE_URL, fetchImpl = fetch } = {}) {
  const deadline = Date.now() + timeoutMs;
  let lastSeen = null;
  while (Date.now() < deadline) {
    try {
      const res = await fetchImpl(`${url}?cb=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const body = await res.json();
        lastSeen = body.runId ?? null;
        if (lastSeen === runId) {
          return { live: true, waitedMs: timeoutMs - (deadline - Date.now()) };
        }
      }
    } catch {
      // Network blips are expected while Pages rebuilds; keep polling until the deadline.
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return { live: false, lastSeen };
}

// The news-data branch log was removed on 2026-09-15: it existed to support a weekly
// human review that is no longer part of the design, and reconciling its failures was
// standing maintenance for one person running many projects. Each run's full record is
// uploaded as a 90-day workflow artifact instead. The branch itself is left in place as
// historical evidence; only the writing stopped.
