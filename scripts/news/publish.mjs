/**
 * Publishing and logging for the news digest.
 *
 * Two branches, with strictly separate jobs (NEWS-AND-ANALYSIS-PRD.md section A):
 *
 *   gh-pages   api/news.json          — the feed the page reads.
 *              api/news-archive.json  — the scan's memory (archive.mjs, 2026-11-21),
 *                              always written in the same commit as the feed.
 *                              These are the only two files this pipeline publishes.
 *                              Manual deploys exclude both, so the two writers never
 *                              collide.
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

import {
  ARCHIVE_PATH,
  ArchiveError,
  parseArchive,
  assertArchiveOnlyGrows,
  archiveMarker,
  readArchiveMarker,
} from './archive.mjs';

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
 * Reads the archive from a checkout. null means the file is not on the branch yet, which
 * is the one case that may start from the seed. A file that is there but unreadable
 * throws (ArchiveError): it must never be mistaken for "no archive" and overwritten.
 */
function readArchive(dir) {
  const path = join(dir, ARCHIVE_PATH);
  return existsSync(path) ? parseArchive(readFileSync(path, 'utf8')) : null;
}

/** How the owner starts the archive, quoted in every "archive is absent" refusal. */
export const BOOTSTRAP_HOW =
  'To start the archive from the seed, run the "Fetch DC News" workflow by hand with the ' +
  '"bootstrap_archive" box ticked (NEWS_ARCHIVE_BOOTSTRAP=1). To recover a deleted archive, ' +
  "restore api/news-archive.json from the gh-pages branch's history instead";

/**
 * The archive, or null ONLY when this run is explicitly allowed to bootstrap one.
 *
 * Nothing is ever seeded automatically. An absent archive file stops the run unless the
 * caller passes `bootstrap` (the workflow's hand-ticked input, never set on a schedule):
 * "the file is not there" cannot be told apart from "the file was deleted" by looking,
 * and guessing wrong would start again from the seed and lose every confirmation made
 * since, with the only-grows check blind because it would have nothing to compare with.
 *
 * The marker in api/news.json is the second line of defence, and the flag does not
 * override it:
 *   - file absent, marker present: the archive was deleted. Refused even with the flag.
 *   - file present with fewer items than the marker records: items were lost before
 *     this run could see them (a hand edit, a bad restore). Refused.
 *   - marker present but malformed: refused, never read as "no marker".
 */
function readArchiveOrRefuse(dir, currentFeed, bootstrap) {
  const marker = readArchiveMarker(currentFeed);
  const archive = readArchive(dir);
  if (archive === null) {
    if (marker) {
      throw new ArchiveError(
        `${ARCHIVE_PATH} is missing from gh-pages, but ${NEWS_PATH} records an archive of ` +
          `${marker.items} items, so it was deleted. Restore the file from the branch's history. ` +
          'Refusing to start again from the seed, with or without the bootstrap flag',
      );
    }
    if (!bootstrap) {
      throw new ArchiveError(`${ARCHIVE_PATH} is not on gh-pages, and nothing is seeded automatically. ${BOOTSTRAP_HOW}`);
    }
    return null;
  }
  if (marker && archive.items.length < marker.items) {
    throw new ArchiveError(
      `${ARCHIVE_PATH} holds ${archive.items.length} confirmed items, but ${NEWS_PATH} records ${marker.items}: ` +
        "items have been lost. Restore the file from the branch's history",
    );
  }
  return archive;
}

/**
 * The seed an explicit bootstrap starts from. Fails closed: a missing or malformed seed must
 * not quietly become an empty archive, because the first archive written is the baseline
 * everything later is checked against, and nothing would go back and add what the seed
 * should have held.
 */
export function readSeedArchive(path) {
  if (!existsSync(path)) throw new ArchiveError(`the seed archive is missing (${path})`);
  return parseArchive(readFileSync(path, 'utf8'));
}

function readFeed(dir) {
  const path = join(dir, NEWS_PATH);
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
}

/**
 * The archive as the branch holds it right now, for the start of a run: the run needs it
 * before filtering (confirmed links are not re-judged) and before summarising (the
 * summary is written from the displayed set, which memory contributes to). Read-only.
 * Returns null only when `bootstrap` is set and there is no archive and no marker.
 */
export async function readPublishedArchive({ bootstrap = false } = {}) {
  const { dir } = await checkoutBranch('gh-pages');
  return readArchiveOrRefuse(dir, readFeed(dir), bootstrap);
}

/**
 * Publishes a feed payload to gh-pages.
 *
 * `apply` receives the branch's current file (or null) and returns what to write, so a
 * caller can make its decision against fresh state on every attempt — that is rule 2,
 * and it is what lets Withhold and a scheduled run interleave safely.
 *
 * With `withArchive`, rule 2 covers the archive too: `apply(current, currentArchive)` is
 * given the branch's archive (null only on an explicit `bootstrap`, see
 * readArchiveOrRefuse) and returns `{ feed, archive }`, and both files go out in one
 * commit. The feed is stamped with the archive marker here, so no caller can write an
 * archive without it.
 * `baseArchive` is the archive the caller read when its run began: the write must keep
 * every confirmed item in that copy as well as in the branch's current one.
 *
 * Without `withArchive` the archive is not read, parsed or staged at all. That is
 * deliberate: Withhold is the owner's emergency action, so it must work even when the
 * archive is corrupt, and it must have no way to drop or rewrite it. Such a writer
 * cannot introduce, alter or remove the marker either: whatever it returns, the marker
 * written is the branch's current one, byte for byte, or none if the branch has none.
 */
export async function publishFeed(apply, { message, withArchive = false, baseArchive = null, bootstrap = false }) {
  let lastError;
  for (let attempt = 1; attempt <= PUSH_ATTEMPTS; attempt += 1) {
    const { dir } = await checkoutBranch('gh-pages');
    const path = join(dir, NEWS_PATH);
    const current = readFeed(dir);
    // Checked on every attempt, so an archive deleted between this run's first read and
    // its push (or between two push attempts) stops the publish too.
    const currentArchive = withArchive ? readArchiveOrRefuse(dir, current, bootstrap) : null;

    const applied = withArchive ? apply(current, currentArchive) : apply(current);
    if (applied === null) return { pushed: false, skipped: true, current };
    const nextArchive = withArchive ? applied.archive : null;
    let next = withArchive ? applied.feed : applied;

    // The invariant, enforced at the boundary rather than trusted upstream: a published
    // summary must carry its own judge pass. A future caller that bypasses
    // fetch-news.mjs — or a refactor that sets `summary` before judging — fails loudly
    // here instead of quietly publishing unchecked text.
    if (next.summary && next.summaryCheck?.judge !== 'pass') {
      throw new Error(
        `refusing to publish a summary without a judge pass (summaryCheck: ${JSON.stringify(next.summaryCheck)})`,
      );
    }

    // The same kind of boundary check for the archive: well formed, and every confirmed
    // item the branch already holds is still there, unchanged. It is the only copy of
    // the record, so a caller's bug must fail here rather than shrink it.
    // Against BOTH copies: the branch's current one, and the one this run read at its
    // start. Either alone leaves a gap: a branch copy that lost items between the read
    // and the push would otherwise be accepted as the new baseline.
    if (withArchive) {
      assertArchiveOnlyGrows(currentArchive, nextArchive);
      assertArchiveOnlyGrows(baseArchive, nextArchive);
      next = { ...next, archive: archiveMarker(nextArchive) };
    } else {
      // A writer that was not given the archive cannot touch its marker: not drop it,
      // not alter it, and not invent one on a branch that has none (an invented marker
      // would make a later bootstrap look like a deletion, or hide a real one).
      const { archive: _ignored, ...withoutMarker } = next;
      next = current?.archive !== undefined ? { ...withoutMarker, archive: current.archive } : withoutMarker;
    }

    mkdirSync(join(dir, 'api'), { recursive: true });
    writeFileSync(path, `${JSON.stringify(next, null, 2)}\n`);
    if (withArchive) {
      writeFileSync(join(dir, ARCHIVE_PATH), `${JSON.stringify(nextArchive, null, 2)}\n`);
    }

    // Named paths only, never `add -A`: a writer that was not given the archive cannot
    // stage a change to it.
    await git(dir, ['add', NEWS_PATH, ...(withArchive ? [ARCHIVE_PATH] : [])]);
    const staged = await git(dir, ['diff', '--staged', '--name-only']);
    if (!staged) return { pushed: false, unchanged: true, payload: next, archive: nextArchive };

    await git(dir, ['commit', '-q', '-m', message]);
    try {
      await git(dir, ['push', '-q', 'origin', 'gh-pages']);
      return { pushed: true, payload: next, archive: nextArchive, attempt };
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
