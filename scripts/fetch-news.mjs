#!/usr/bin/env node

/**
 * Builds and publishes the D.C. statehood news digest for www.representdc.org/news.
 *
 * Moved here from dc-bills-tracker on 2026-09-12 (NEWS-AND-ANALYSIS-PRD.md). The site
 * that shows the summary now owns the code that writes it.
 *
 * The run has one job beyond fetching news: never publish a summary that has not passed
 * every gate. Withholding is always available and always preferable — the page simply
 * shows headlines without a digest. Five errors reached readers under the old pipeline
 * because nothing stood between the model and the page.
 *
 * Since 2026-11-21 the run has a memory (scripts/news/archive.mjs): api/news-archive.json
 * on gh-pages. An article the filter has confirmed twice stays on the page for 30 days
 * and in the archive for good, whether or not its outlet's feed still lists it. The
 * summary, the gates and the judge all work on the displayed set, which is memory plus
 * this run's own relevant candidates.
 *
 * Outcomes, all recorded:
 *   published          a summary went live
 *   published-empty    no relevant articles; feed published empty (healthy)
 *   summary-withheld   articles published, summary blocked by a gate
 *   summary-disabled   NEWS_SUMMARY_ENABLED=false
 *   pushed-not-live    pushed, but the public URL never served this run
 *   not-published      ingestion failed, or the archive on the branch is unreadable;
 *                      the last good feed and the archive are both left alone
 *
 * Env: ANTHROPIC_API_KEY (required), GITHUB_TOKEN (to push), NEWS_SUMMARY_ENABLED,
 *      DRY_RUN=1 to run everything except the push,
 *      NEWS_ARCHIVE_BOOTSTRAP=1 to create the archive from the seed when gh-pages has
 *      none (one time, by hand; ignored when an archive already exists).
 */

import { writeFileSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { fetchAllFeeds, NEWSLETTERS } from './news/feeds.mjs';
import { selectNewsletters } from './news/newsletters.mjs';
import { getClient, filterByRelevance, summarizeArticles, MODEL, PROMPT_VERSION } from './news/summarize.mjs';
import { judgeSummary, JUDGE_MODEL, JUDGE_VERSION } from './news/judge.mjs';
import { closerFor } from './news/closers.mjs';
import {
  checkSourceHealth,
  checkCloserKey,
  checkNumericGrounding,
  checkFormat,
  checkArticles,
  MAX_ARTICLES,
} from './news/gates.mjs';
import { publishFeed, verifyLive, readPublishedArchive, readSeedArchive } from './news/publish.mjs';
import {
  applyRun,
  composePublication,
  splitCandidates,
  updateFeedHealth,
  longFailingSources,
  failingSources,
  ArchiveError,
} from './news/archive.mjs';

// The articles earlier runs already published, rebuilt from their run records by
// scripts/news/build-seed-archive.mjs, so the page recovers at once instead of starting
// its memory from nothing. Used ONLY on an explicit bootstrap: NEWS_ARCHIVE_BOOTSTRAP=1,
// which the workflow sets from a hand-ticked input and never on a schedule, AND no
// archive on gh-pages. Nothing is seeded automatically: without the flag an absent
// archive ends the run as not-published (publish.mjs, readArchiveOrRefuse).
const SEED_PATH = fileURLToPath(new URL('./news/seed-archive.json', import.meta.url));

const loadSeed = () => readSeedArchive(SEED_PATH);

/** Git errors can quote the remote URL, and the remote URL carries the push token. */
function redact(message) {
  return String(message ?? '').replace(/x-access-token:[^@\s]+@/g, 'x-access-token:***@');
}

const DRY_RUN = process.env.DRY_RUN === '1';
const BOOTSTRAP = process.env.NEWS_ARCHIVE_BOOTSTRAP === '1';
const SUMMARIES_ENABLED = process.env.NEWS_SUMMARY_ENABLED !== 'false';
const RUN_ID = process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT ?? '1'}`
  : `local-${Date.now()}`;

const startedAt = new Date();
const usage = [];
const record = {
  runId: RUN_ID,
  startedAt: startedAt.toISOString(),
  model: MODEL,
  promptVersion: PROMPT_VERSION,
  judgeModel: JUDGE_MODEL,
  judgeVersion: JUDGE_VERSION,
  summariesEnabled: SUMMARIES_ENABLED,
  sources: [],
  candidates: [],
  attempts: [],
  articles: [],
  outcome: null,
  reason: null,
  usage,
};

/** Writes the record where CI can pick it up even if the log push later fails. */
function saveRecordLocally() {
  writeFileSync('run-record.json', `${JSON.stringify(record, null, 2)}\n`);
}

function setOutput(key, value) {
  if (!process.env.GITHUB_OUTPUT) return;
  const delimiter = `EOF_${Math.random().toString(36).slice(2)}`;
  appendFileSync(process.env.GITHUB_OUTPUT, `${key}<<${delimiter}\n${value}\n${delimiter}\n`);
}

function finish(outcome, reason = null) {
  record.outcome = outcome;
  record.reason = reason;
  record.finishedAt = new Date().toISOString();
  saveRecordLocally();
  setOutput('outcome', outcome);
  setOutput('reason', reason ?? '');
  console.log(`\noutcome: ${outcome}${reason ? ` (${reason})` : ''}`);
}

async function main() {
  console.log(`Run ${RUN_ID} — fetching feeds…\n`);
  const { sourceResults: newsResults, articles: candidates } = await fetchAllFeeds();
  // Newsletters are fetched by the same code but kept apart from here on
  // (newsletters.mjs): `newsletterItems` goes to the page's second list and nowhere
  // else. It is never merged into `candidates`, so no model reads it and the archive
  // never sees it. fetchFeed never throws, so a dead newsletter feed is just a failed
  // status and an empty list.
  const { sourceResults: newsletterResults, articles: newsletterItems } = await fetchAllFeeds(NEWSLETTERS, Date.now(), 'newsletter');
  // Both kinds, for the run record and for feedHealth (the two-day alert covers
  // newsletter feeds too). G5 below ignores the newsletter ones.
  const sourceResults = [...newsResults, ...newsletterResults];
  record.sources = sourceResults;
  for (const s of sourceResults) {
    console.log(`  ${s.status === 'ok' ? '✓' : '✗'} ${s.source}: ${s.status} (${s.fresh}/${s.fetched} fresh)`);
  }

  // G5 — an all-failed fetch must never look like a quiet news day.
  const health = checkSourceHealth(sourceResults);
  record.gates = [health];
  if (!health.pass) {
    finish('not-published', 'every source failed to return a valid feed');
    process.exitCode = 1;
    return;
  }

  // Memory, read before anything is judged. An archive that is absent, unreadable, or
  // smaller than the feed's marker records stops the run: carrying on would end with an
  // empty or seed-only archive written over the record. The one exception is the
  // explicit bootstrap flag with no archive and no marker, which starts from the seed.
  let archive;
  try {
    const onBranch = await readPublishedArchive({ bootstrap: BOOTSTRAP });
    if (onBranch === null) {
      archive = loadSeed();
      console.log(`\nNEWS_ARCHIVE_BOOTSTRAP: no archive on gh-pages, starting from the seed (${archive.items.length} items)`);
    } else {
      archive = onBranch;
      if (BOOTSTRAP) console.log('\nNEWS_ARCHIVE_BOOTSTRAP ignored: gh-pages already has an archive, and it is kept');
    }
    record.archiveBootstrap = onBranch === null;
  } catch (err) {
    const what = err instanceof ArchiveError ? 'the news archive cannot be used' : 'could not read the news archive';
    finish('not-published', `${what}: ${redact(err.message)}`);
    process.exitCode = 1;
    return;
  }
  console.log(`\narchive: ${archive.items.length} confirmed, ${archive.pending.length} pending`);

  // One fixed clock for every use of memory in this run, so re-applying the run's
  // changes after a rejected push gives the same answer as the first time.
  const runNow = startedAt.getTime();
  const windowDaysBySource = Object.fromEntries(newsResults.map((s) => [s.source, s.maxAgeDays]));
  // Decided once, here, so every push attempt publishes the same list.
  const newsletters = selectNewsletters(newsletterItems, runNow);
  record.newsletters = newsletters;

  // G5 only fails the run when EVERY source fails, so one dead feed was invisible: Roll
  // Call returned 404 for three days in November 2026 with green runs throughout. A
  // source failing for two days or more is reported through a step output, and the
  // workflow keeps a single issue open for it. Emitted here, before the filter, so a run
  // that later fails for another reason still reports it.
  //
  // Known limit, accepted: `failingSince` is stored in the archive, and the archive is
  // written only by a run that publishes. So the two-day clock does not advance through
  // a stretch of runs that cannot publish (it is computed here from the last published
  // state plus this run), and a run where EVERY feed fails returns at G5 above, before
  // this point. Both cases are runs that end `not-published`, which already raise the
  // existing incident alert, so nothing goes unreported; no second write path was added
  // for failed runs.
  const healthNow = updateFeedHealth(archive.feedHealth, sourceResults, runNow);
  const feedAlert = longFailingSources(healthNow, runNow);
  const failingNow = failingSources(healthNow);
  record.feedAlert = feedAlert;
  record.feedsFailingNow = failingNow;
  // Statuses can carry raw error text. Keep each line short and plain: it lands in an
  // issue body.
  const alertLines = (list) =>
    list
      .map((f) => `${f.source}: ${f.lastStatus}, failing since ${f.failingSince.slice(0, 10)}`.replace(/[^\w .:,()/-]/g, ' ').slice(0, 160))
      .join('\n');
  setOutput('feed_alert', alertLines(feedAlert));
  // Every source failing right now, including ones under two days. The issue closes only
  // when this is empty, so one source recovering while another has been down for a day
  // is not announced as "all recovered".
  setOutput('feed_failing_now', alertLines(failingNow));
  // Tells the workflow an empty list means "all sources fine", not "never checked".
  setOutput('feed_alert_checked', 'true');
  if (feedAlert.length) console.warn(`  failing for 2+ days: ${feedAlert.map((f) => f.source).join(', ')}`);

  const client = getClient();

  // A confirmed link is never judged again. Re-asking is what made articles flicker on
  // and off the page: the same headline drew a different verdict on a different run.
  const { toFilter, alreadyConfirmed } = splitCandidates(archive, candidates);
  const confirmedLinks = new Set(alreadyConfirmed.map((a) => a.link));

  // G6 lives inside filterByRelevance: a malformed reply is a failure, not "no news".
  console.log(`${candidates.length} candidates, ${alreadyConfirmed.length} already confirmed — filtering ${toFilter.length}…`);
  let filtered = await filterByRelevance(client, toFilter);
  if (filtered.usage) usage.push({ call: 'filter', attempt: 1, ...filtered.usage });
  if (!filtered.check.pass) {
    console.warn(`  filter reply rejected (${filtered.check.detail}) — retrying once`);
    filtered = await filterByRelevance(client, toFilter);
    usage.push({ call: 'filter', attempt: 2, ...filtered.usage });
  }
  record.gates.push(filtered.check);
  record.candidates = candidates.map((a) => ({
    title: a.title,
    source: a.source,
    pubDate: a.pubDate,
    // Recorded since 2026-11-21: without it a run record cannot say which article a
    // verdict belonged to once two headlines match.
    link: a.link,
    // `confirmed` means memory answered and the filter was not asked this run.
    confirmed: confirmedLinks.has(a.link),
    relevant: confirmedLinks.has(a.link) ? true : filtered.articles?.some((f) => f.link === a.link) ?? null,
  }));

  if (!filtered.check.pass) {
    finish('not-published', `relevance filter returned an unusable reply: ${filtered.check.detail}`);
    process.exitCode = 1;
    return;
  }

  // What this run saw, kept as plain data so it can be applied to the archive now and
  // re-applied, unchanged, to a newer copy of the archive if the push is rejected.
  const run = {
    candidates,
    relevantLinks: filtered.articles.map((a) => a.link),
    sourceResults,
    now: runNow,
    windowDaysBySource,
  };
  // The displayed set: confirmed articles still inside the display window, plus this
  // run's relevant candidates that are not confirmed yet (so new items still show at
  // once, as before), newest first, capped at MAX_ARTICLES. Everything downstream (the
  // summary, the gates, the judge) works on exactly this list.
  const { articles } = applyRun(archive, run);
  record.articles = articles;
  console.log(`  ${run.relevantLinks.length} judged relevant this run; ${articles.length} article(s) to display (cap ${MAX_ARTICLES})`);

  // Summarize, unless there is nothing to summarize or summaries are switched off.
  // `summary` stays null until a candidate has passed every gate AND the judge, so no
  // code path can publish text that was merely generated.
  let summary = null;
  let closer = null;
  // Stable enum, recorded whether or not anything publishes: judge-pass, judge-flag,
  // judge-incomplete, judge-no-text, judge-unparseable, judge-api-failure, gate-withheld,
  // no-articles, summaries-disabled. (The published file can also say archive-changed:
  // see the publish step.)
  let decision = 'no-articles';
  if (!articles.length) {
    record.reason = 'no relevant articles';
  } else if (!SUMMARIES_ENABLED) {
    decision = 'summaries-disabled';
    record.reason = 'NEWS_SUMMARY_ENABLED=false';
  } else {
    const headlines = articles.map((a) => a.title);
    for (let attempt = 1; attempt <= 2 && summary === null; attempt += 1) {
      let result;
      try {
        result = await summarizeArticles(client, articles);
      } catch (err) {
        // Once the headlines are ready, no generation failure — including a retry after
        // the judge rejected the first attempt — may cost the reader the feed.
        console.warn(`  summary generation failed: ${err.message}`);
        decision = 'generation-failure';
        record.reason = `summary generation failed: ${err.message}`;
        break;
      }
      usage.push({ call: 'summary', attempt, ...result.usage });

      const keyCheck = checkCloserKey(result.key);
      // A truncated reply can be a well-formed paragraph that simply stops mid-thought,
      // so no wording gate catches it. The model tells us directly; believe it.
      const completion = {
        gate: 'G7',
        pass: result.stopReason !== 'max_tokens',
        detail: result.stopReason === 'max_tokens' ? 'reply truncated at max_tokens' : `stop_reason ${result.stopReason}`,
      };
      const gates = [keyCheck, completion, checkNumericGrounding(result.body, headlines), checkFormat(result.body)];
      record.attempts.push({ attempt, body: result.body, key: result.key, raw: result.raw, gates });
      gates.forEach((g) => console.log(`  ${g.pass ? '✓' : '✗'} ${g.gate}: ${g.detail}`));

      // G1 falling back to "laws" is recorded but not fatal; a wrong number or a
      // malformed body is.
      if (!gates.filter((g) => g.gate !== 'G1').every((g) => g.pass)) {
        decision = 'gate-withheld';
        if (attempt === 1) console.warn('  retrying summary once');
        continue;
      }

      // The judge is mandatory, and it judges THIS candidate's body against THIS article
      // set. Nothing becomes publishable before it returns an explicit, complete pass:
      // unattended, a flag that does not block is no protection at all.
      let verdict;
      try {
        verdict = await judgeSummary(client, result.body, articles);
        usage.push({ call: 'judge', attempt, ...verdict.usage });
      } catch (err) {
        // Caught here, not at the top level: a judge outage must still publish fresh
        // headlines rather than abandon the run and leave yesterday's feed up.
        console.warn(`  judge unavailable: ${err.message}`);
        record.attempts.at(-1).judge = { overall: 'api-failure', error: err.message };
        decision = 'judge-api-failure';
        break;
      }

      // Defensive on shape, not just on outcome: a reply like {"verdicts":[null]} comes
      // back as `incomplete`, and reading .pass off that null threw out here — outside
      // the catch — turning a bad judge reply into an aborted run with no fresh
      // headlines. The verdicts are untrusted model output; treat them as such.
      const verdictList = Array.isArray(verdict.verdicts) ? verdict.verdicts : [];
      record.attempts.at(-1).judge = {
        overall: verdict.overall,
        flagged: verdictList
          .filter((v) => v && typeof v === 'object' && !v.pass)
          .map((v) => ({ criterion: v.criterion, quote: v.quote })),
      };
      console.log(`  ${verdict.overall === 'pass' ? '✓' : '✗'} judge: ${verdict.overall}`);

      if (verdict.overall === 'pass') {
        closer = closerFor(result.key);
        summary = `${result.body} ${closer.text}`.replace(/\s+/g, ' ').trim();
        decision = 'judge-pass';
      } else {
        decision = `judge-${verdict.overall}`;
        if (attempt === 1) console.warn('  retrying summary once');
      }
    }
    if (summary === null) record.reason = `summary withheld (${decision})`;
  }

  // G4 — the payload itself, checked against the exact set the summary was built from.
  const articleCheck = checkArticles(articles, summary ? articles.map((a) => a.link) : null);
  record.gates.push(articleCheck);
  if (!articleCheck.pass) {
    finish('not-published', `article set rejected: ${articleCheck.detail}`);
    process.exitCode = 1;
    return;
  }

  record.summaryDecision = decision;
  setOutput('summary_decision', decision);

  const payload = {
    runId: RUN_ID,
    lastUpdated: new Date().toISOString(),
    summary,
    summarySource: closer ? { closerKey: closer.key, closerSource: closer.source } : null,
    // Carried in the published file so the invariant in publishFeed() can be checked
    // against what is actually being written, not against what this process believes.
    summaryCheck: summary ? { judge: 'pass', judgeVersion: JUDGE_VERSION } : null,
    summaryDecision: decision,
    articles,
    // The separate list. Not part of anything the summary or the judge saw, and not
    // compared when a retry decides whether the summary still matches its articles.
    newsletters,
  };

  if (DRY_RUN) {
    console.log(`\nDRY_RUN — would publish:\n${JSON.stringify(payload, null, 2)}`);
    record.summaryPublished = summary;
    // Not "published": nothing was pushed and nothing was verified live. Saying
    // otherwise would put a false "it's live" line in the review issue.
    finish('dry-run', summary ? 'summary generated, nothing pushed' : 'no summary generated, nothing pushed');
    return;
  }

  // Everything decided per push attempt lives in composePublication (archive.mjs): this
  // run's observations re-applied to the branch's archive as it is now (rule 2), the
  // summary dropped if the displayed articles are no longer exactly the ones it was
  // written from, and a withholding newer than this run winning (rule 3).
  const result = await publishFeed(
    (current, currentArchive) => {
      const composed = composePublication({
        payload,
        summarisedArticles: articles,
        run,
        current,
        currentArchive,
        // Reached only on an explicit bootstrap: publishFeed refuses a missing archive
        // without the flag, and with it once the feed carries the marker.
        seed: currentArchive ? null : loadSeed(),
        startedAt,
        runId: RUN_ID,
      });
      if (composed.reason) record.reason = composed.reason;
      return { feed: composed.feed, archive: composed.archive };
    },
    { message: `Update news feed — ${payload.lastUpdated}`, withArchive: true, baseArchive: archive, bootstrap: BOOTSTRAP },
  );
  // What actually reached the branch, which is not always what this run generated: a
  // withholding can supersede it (rule 3 above).
  const publishedSummary = result.payload?.summary ?? null;
  record.summaryPublished = publishedSummary;
  record.articles = result.payload?.articles ?? articles;
  record.archive = { confirmed: result.archive?.items.length ?? null, pending: result.archive?.pending.length ?? null };
  record.published = { pushed: Boolean(result.pushed), attempt: result.attempt ?? null };

  const live = await verifyLive(RUN_ID);
  record.live = live;
  if (!live.live) {
    finish('pushed-not-live', `public URL did not serve this run within the wait (last seen: ${live.lastSeen ?? 'none'})`);
    process.exitCode = 1;
    return;
  }

  if (!articles.length) finish('published-empty', record.reason);
  else if (!publishedSummary && !SUMMARIES_ENABLED) finish('summary-disabled', record.reason);
  else if (!publishedSummary) finish('summary-withheld', record.reason);
  else finish('published');
}

main().catch((err) => {
  console.error(err);
  // The old script exited 0 on an overloaded API, which made a silent failure look like
  // a successful run. Every failure here is loud.
  finish('not-published', `run threw: ${err.message}`);
  process.exitCode = 1;
});
