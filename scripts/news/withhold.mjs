#!/usr/bin/env node

/**
 * Removes the summary from the live news feed, keeping the headlines.
 *
 * This is the one action Andria can take from her phone when a summary is wrong, so it
 * has to be blunt and verifiable: clear `summary`, stamp `withheldAt`, push, then watch
 * the public URL until the summary is actually gone. It reports what happened rather
 * than assuming success — "removed" has to mean removed for readers.
 *
 * `withheldAt` is also how a withholding beats an in-flight fetch: a run that started
 * before that stamp publishes its headlines with no summary (see publish.mjs, rule 3).
 *
 * Usage: node scripts/news/withhold.mjs ["reason"]
 */

import { writeFileSync } from 'node:fs';
import { publishFeed, LIVE_URL } from './publish.mjs';

const reason = process.argv[2] ?? 'withheld by the site owner';
const withheldAt = new Date().toISOString();

async function liveSummaryCleared({ timeoutMs = 10 * 60 * 1000, intervalMs = 20000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${LIVE_URL}?cb=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const body = await res.json();
        if (!body.summary) return { cleared: true, withheldAt: body.withheldAt ?? null };
      }
    } catch {
      // Pages is probably mid-rebuild; keep polling.
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return { cleared: false };
}

// Whether a summary was actually taken off the page, as distinct from whether a
// timestamp was written. Stamping an already-clear feed used to report "removed" and
// label the issue `summary-error`, marking a correct headlines-only feed as a mistake.
let removedSummary = false;

const result = await publishFeed(
  (current) => {
    if (!current) {
      console.log('No feed is published yet — nothing to withhold.');
      return null;
    }
    // Stamp even when the branch already shows no summary. Returning early here wrote no
    // withheldAt, so a run that started before this request could publish its summary
    // afterwards — walking straight around the rule meant to prevent exactly that.
    if (!current.summary) {
      console.log('Branch already has no summary; recording the withholding time anyway.');
      removedSummary = false;
      return { ...current, summary: null, summarySource: null, withheldAt, withheldReason: reason };
    }
    removedSummary = true;
    // Built from the branch's current copy, not from anything this process generated,
    // so a withholding can never roll headlines back to an older set.
    return { ...current, summary: null, summarySource: null, withheldAt, withheldReason: reason };
  },
  { message: `Withhold news summary — ${withheldAt}` },
);

// "The branch already has no summary" is NOT proof the reader sees no summary. On a
// retry — the exact case where someone is trying again because the first attempt looked
// wrong — the branch is already clear while Pages may still be serving the old file.
// Reporting "nothing to do" there would tell the owner a bad summary was gone when it
// was still up, so this path checks the live page like any other.
if (result.skipped) {
  const live = await liveSummaryCleared();
  const status = live.cleared ? 'already-clear' : 'pushed-not-live';
  writeFileSync('withhold-result.json', JSON.stringify({ status, withheldAt }, null, 2));
  if (live.cleared) {
    console.log('No summary on the branch, and the live page shows none either.');
    process.exit(0);
  }
  console.error('The branch has no summary, but the live page is still serving one.');
  process.exit(1);
}

const live = await liveSummaryCleared();
const status = !live.cleared ? 'pushed-not-live' : removedSummary ? 'removed' : 'already-clear';
writeFileSync('withhold-result.json', JSON.stringify({ status, withheldAt, reason }, null, 2));

if (live.cleared) {
  console.log('Summary removed and confirmed gone from the live page.');
} else {
  console.error('Pushed, but the live page still shows a summary. Set NEWS_SUMMARY_ENABLED=false.');
  process.exitCode = 1;
}
