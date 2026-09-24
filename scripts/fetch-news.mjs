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
 * Outcomes, all recorded:
 *   published          a summary went live
 *   published-empty    no relevant articles; feed published empty (healthy)
 *   summary-withheld   articles published, summary blocked by a gate
 *   summary-disabled   NEWS_SUMMARY_ENABLED=false
 *   pushed-not-live    pushed, but the public URL never served this run
 *   not-published      ingestion failed; the last good file is left alone
 *
 * Env: ANTHROPIC_API_KEY (required), GITHUB_TOKEN (to push), NEWS_SUMMARY_ENABLED,
 *      DRY_RUN=1 to run everything except the push.
 */

import { writeFileSync, appendFileSync } from 'node:fs';
import { fetchAllFeeds } from './news/feeds.mjs';
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
import { publishFeed, verifyLive } from './news/publish.mjs';

const DRY_RUN = process.env.DRY_RUN === '1';
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
  const { sourceResults, articles: candidates } = await fetchAllFeeds();
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

  const client = getClient();

  // G6 lives inside filterByRelevance: a malformed reply is a failure, not "no news".
  console.log(`\n${candidates.length} candidates — filtering…`);
  let filtered = await filterByRelevance(client, candidates);
  usage.push({ call: 'filter', attempt: 1, ...filtered.usage });
  if (!filtered.check.pass) {
    console.warn(`  filter reply rejected (${filtered.check.detail}) — retrying once`);
    filtered = await filterByRelevance(client, candidates);
    usage.push({ call: 'filter', attempt: 2, ...filtered.usage });
  }
  record.gates.push(filtered.check);
  record.candidates = candidates.map((a) => ({
    title: a.title,
    source: a.source,
    pubDate: a.pubDate,
    relevant: filtered.articles?.some((f) => f.link === a.link) ?? null,
  }));

  if (!filtered.check.pass) {
    finish('not-published', `relevance filter returned an unusable reply: ${filtered.check.detail}`);
    process.exitCode = 1;
    return;
  }

  const articles = filtered.articles
    .sort((a, b) => b._ts - a._ts)
    .slice(0, MAX_ARTICLES)
    .map(({ _ts, ...a }) => a);
  record.articles = articles;
  console.log(`  ${articles.length} relevant article(s)`);

  // Summarize, unless there is nothing to summarize or summaries are switched off.
  // `summary` stays null until a candidate has passed every gate AND the judge, so no
  // code path can publish text that was merely generated.
  let summary = null;
  let closer = null;
  // Stable enum, recorded whether or not anything publishes: judge-pass, judge-flag,
  // judge-incomplete, judge-no-text, judge-unparseable, judge-api-failure, gate-withheld,
  // no-articles, summaries-disabled.
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
  };

  if (DRY_RUN) {
    console.log(`\nDRY_RUN — would publish:\n${JSON.stringify(payload, null, 2)}`);
    record.summaryPublished = summary;
    // Not "published": nothing was pushed and nothing was verified live. Saying
    // otherwise would put a false "it's live" line in the review issue.
    finish('dry-run', summary ? 'summary generated, nothing pushed' : 'no summary generated, nothing pushed');
    return;
  }

  // Rule 3: a withholding that happened after this run started always wins. The run
  // publishes its fresh headlines but leaves the summary off.
  const result = await publishFeed(
    (current) => {
      const withheldAt = current?.withheldAt ? new Date(current.withheldAt) : null;
      if (withheldAt && withheldAt > startedAt) {
        record.reason = `a withholding at ${current.withheldAt} superseded this run's summary`;
        return { ...payload, summary: null, summarySource: null, withheldAt: current.withheldAt };
      }
      // Carry the stamp forward even when publishing normally. It records when the last
      // withholding happened, not "currently withheld" — dropping it would let a run that
      // started even earlier come back and republish its own summary over the removal.
      return current?.withheldAt ? { ...payload, withheldAt: current.withheldAt } : payload;
    },
    { message: `Update news feed — ${payload.lastUpdated}` },
  );
  // What actually reached the branch, which is not always what this run generated: a
  // withholding can supersede it (rule 3 above).
  const publishedSummary = result.payload?.summary ?? null;
  record.summaryPublished = publishedSummary;
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
