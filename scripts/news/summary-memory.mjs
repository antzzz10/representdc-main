/**
 * What a scan remembers about the summary between runs. Two things, both read from the
 * feed the branch holds when the run starts, both pure functions of that feed.
 *
 * 1. Keeping a summary that already passed. Every scan used to write a new summary and
 *    send it to the judge, even when the list of headlines had not changed. In 19 of 39
 *    scans to 2026-11-25 the list was identical to the scan before; a summary that had
 *    passed was thrown away each time, and three times its replacement was flagged, so
 *    the page lost its summary with no change in the news. A passed summary is now kept
 *    for as long as it is still exactly what it was judged as (reusableSummary).
 *
 * 2. Counting scans in a row that left the summary off because a draft was flagged
 *    (withheldStreak), so the workflow can say so by email once, instead of the owner
 *    finding out by looking at the page.
 */

import { createHash } from 'node:crypto';
import { closerFor, CLOSER_KEYS } from './closers.mjs';

const DAY_MS = 24 * 60 * 60 * 1000;
// A kept summary is rewritten after this long even if nothing changed, because its
// wording can lean on when it was written ("this week", the present tense).
export const REUSE_MAX_AGE_DAYS = 7;
// The same allowance the page gives a scan's clock.
const CLOCK_SKEW_MS = 15 * 60 * 1000;
// Scans in a row with a flagged summary before the owner is emailed.
export const WITHHELD_ALERT_AFTER = 2;

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/**
 * Ties a judge pass to the exact text and the exact headlines it was given for. Stored
 * beside the pass when a summary is written, and checked before one is kept, so a feed
 * whose summary or articles were edited afterwards cannot carry the old pass forward.
 * It is a check against accidents and stray edits, not a signature: anyone who can write
 * the branch can also write a matching value.
 */
export function summaryFingerprint(summary, articles) {
  return createHash('sha256').update(JSON.stringify([summary, articles])).digest('hex');
}

/**
 * The summary on the branch, if it may be published again as it stands. Returns
 * `{ summary, closer, writtenAt, fromRun }`, or `{ summary: null, why }`.
 *
 * Every condition must hold. Anything missing or odd means "write a new one": that only
 * costs a model call, while keeping the wrong text would publish something no judge
 * passed for these headlines.
 *
 * - the feed has a summary carrying a judge pass, made by the judge and the writing
 *   rules this code has now (a change to either means it should be written again);
 * - `writtenAt` is a real time, not in the future, less than REUSE_MAX_AGE_DAYS ago, and
 *   after the last withholding, if there was one;
 * - the displayed articles are the same objects in the same order as the ones it was
 *   written from. The whole objects, as composePublication compares them: a headline
 *   reworded under the same link is a different list;
 * - it ends with the standing closing sentence its key names, as that sentence reads
 *   today. If the closing sentence was corrected in code, the old one must not survive;
 * - its fingerprint matches this text and these articles (summaryFingerprint).
 *
 * This is only the decision to TRY to keep it, made from the feed as read when the run
 * began. Whether it is still there to be kept is checked again against the branch at
 * every push (composePublication, archive.mjs): a summary removed in between is not put
 * back.
 */
export function reusableSummary({ current, articles, now, judgeVersion, promptVersion }) {
  const no = (why) => ({ summary: null, why });
  if (!isObject(current)) return no('no published feed');
  const { summary, summaryCheck: check, summarySource: source } = current;
  if (typeof summary !== 'string' || summary.trim() === '') return no('no summary on the page');
  if (!isObject(check) || check.judge !== 'pass') return no('the published summary carries no judge pass');
  if (check.judgeVersion !== judgeVersion) return no('the judge has changed since it was written');
  if (typeof check.promptVersion !== 'string' || check.promptVersion !== promptVersion) {
    return no('the writing rules have changed since it was written');
  }

  const writtenAt = typeof check.writtenAt === 'string' ? new Date(check.writtenAt).getTime() : NaN;
  if (!Number.isFinite(writtenAt)) return no('the published summary does not say when it was written');
  if (writtenAt > now + CLOCK_SKEW_MS) return no('the published summary is dated in the future');
  if (now - writtenAt >= REUSE_MAX_AGE_DAYS * DAY_MS) return no(`it was written ${REUSE_MAX_AGE_DAYS} or more days ago`);
  if (current.withheldAt !== undefined && current.withheldAt !== null) {
    const withheldAt = new Date(current.withheldAt).getTime();
    if (!Number.isFinite(withheldAt) || withheldAt >= writtenAt) return no('a summary was withheld by hand after it was written');
  }

  if (!Array.isArray(current.articles) || !Array.isArray(articles) || articles.length === 0) return no('no articles to compare');
  if (JSON.stringify(current.articles) !== JSON.stringify(articles)) return no('the headline list has changed');

  if (!isObject(source) || typeof source.closerKey !== 'string' || !CLOSER_KEYS.includes(source.closerKey)) {
    return no('the published summary does not name its closing sentence');
  }
  const closer = closerFor(source.closerKey);
  if (closer.key !== source.closerKey || source.closerSource !== closer.source) return no('its closing sentence has changed');
  const body = summary.slice(0, summary.length - closer.text.length);
  if (!summary.endsWith(closer.text) || body.trim() === '') return no('its closing sentence has changed');
  if (typeof check.fingerprint !== 'string' || check.fingerprint !== summaryFingerprint(summary, articles)) {
    return no('the published summary or its headlines were changed after the judge passed it');
  }

  return {
    summary,
    closer,
    writtenAt: new Date(writtenAt).toISOString(),
    fromRun: typeof check.writtenByRun === 'string' ? check.writtenByRun : typeof current.runId === 'string' ? current.runId : null,
  };
}

/** Decisions that mean "a draft was written and the checks turned it down". */
export function isFlaggedDecision(decision) {
  if (decision === 'gate-withheld') return true;
  // Every judge outcome except a pass (new or kept) and a judge that could not be reached.
  const notFlagged = ['judge-pass', 'judge-pass-kept', 'judge-api-failure'];
  return typeof decision === 'string' && decision.startsWith('judge-') && !notFlagged.includes(decision);
}

/**
 * Flagged scans since a summary last published, counting this one: `{ runs, scan }`, both
 * carried in the feed (`summaryWithheldRuns`, `summaryWithheldScan`).
 *
 * - A published summary resets it to 0.
 * - A scan whose own draft was flagged adds 1, once per scan: `scan` is the id of the
 *   scan that last added, so running the same workflow run again does not add twice.
 * - Anything else leaves it where it was: nothing to summarise, a writer or judge that
 *   could not be reached (those raise their own alert), or a summary this run had that
 *   was dropped at the push because the page changed underneath it.
 * - A count on the branch that is not a whole number counts as 0.
 *
 * Call it with the branch's feed as it is at the push, and with the summary that is
 * actually being written, so the number describes what was published (fetch-news.mjs).
 */
export function withheldStreak(current, decision, summary, scanId = null) {
  const before = isObject(current) && Number.isInteger(current.summaryWithheldRuns) && current.summaryWithheldRuns > 0
    ? current.summaryWithheldRuns
    : 0;
  const lastScan = isObject(current) && typeof current.summaryWithheldScan === 'string' ? current.summaryWithheldScan : null;
  if (summary) return { runs: 0, scan: null };
  if (!isFlaggedDecision(decision)) return { runs: before, scan: before > 0 ? lastScan : null };
  if (before > 0 && scanId !== null && lastScan === scanId) return { runs: before, scan: lastScan };
  return { runs: before + 1, scan: scanId };
}
