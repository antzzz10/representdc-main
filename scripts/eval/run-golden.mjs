#!/usr/bin/env node

/**
 * Runs the golden cases through the real pipeline functions and the judge.
 *
 * This exercises the live prompts, every gate, and the judge against hand-labelled
 * expectations. It replaced an earlier `replay.mjs`, which only re-checked previously
 * published text against two gates — so a prompt change that started producing bad
 * summaries would have left it green (Codex, 2026-09-12). The historical summaries that
 * script rebuilt from the sibling repo's git log are now materialised in
 * `fixtures/history-summaries.json`.
 *
 * Each case is generated `--runs` times (default 3) because output varies. Time is frozen
 * to the case's `asOf` so recency labels do not drift as the fixtures age.
 *
 * Metrics are reported separately, never rolled into one number — accuracy and
 * availability must not be able to hide each other:
 *
 *   factual errors      judge-flagged failures on published bodies   (bar: 0)
 *   required catches    cases whose known error MUST be flagged      (bar: all)
 *   false alarms        flags raised on the clean control cases      (bar: <= 10%)
 *   availability        cases expecting a summary that produced one  (bar: >= 80%)
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... node scripts/eval/run-golden.mjs [--runs 3] [--case <id>] [--no-judge]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getClient, summarizeArticles, MODEL, PROMPT_VERSION } from '../news/summarize.mjs';
import { judgeClient, judgeSummary, JUDGE_MODEL } from '../news/judge.mjs';
import { closerFor } from '../news/closers.mjs';
import { checkCloserKey, checkNumericGrounding, checkFormat } from '../news/gates.mjs';

const args = process.argv.slice(2);
const flag = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const RUNS = Number(flag('--runs', 3));
const ONLY = flag('--case', null);
const USE_JUDGE = !args.includes('--no-judge');

const here = dirname(fileURLToPath(import.meta.url));
const golden = JSON.parse(readFileSync(join(here, 'news-golden.json'), 'utf8'));
const cases = golden.cases.filter((c) => (ONLY ? c.id === ONLY : true));

const client = getClient();
const judge = USE_JUDGE ? judgeClient() : null;
const results = [];

for (const testCase of cases) {
  const now = Date.parse(testCase.asOf);
  const articles = testCase.headlines.map((h) => ({ ...h, link: `https://example.org/${encodeURIComponent(h.title.slice(0, 24))}` }));

  for (let run = 1; run <= RUNS; run += 1) {
    const attempt = { caseId: testCase.id, run, expected: testCase.expectedOutcome };

    if (testCase.expectedOutcome === 'empty') {
      // Relevance filtering is exercised by the filter set, not here; an "empty" case
      // only asserts that nothing is fabricated when there is nothing to say.
      attempt.skipped = 'expects an empty feed; no summary is generated';
      results.push(attempt);
      continue;
    }

    const generated = await summarizeArticles(client, articles, now);
    const headlines = articles.map((a) => a.title);
    // G7 included so the harness models production: a truncated generation must fail here
    // too, or the measurement overstates what would actually publish.
    const completion = {
      gate: 'G7',
      pass: generated.stopReason !== 'max_tokens',
      detail: `stop_reason ${generated.stopReason}`,
    };
    const gates = [
      checkCloserKey(generated.key),
      completion,
      checkNumericGrounding(generated.body, headlines),
      checkFormat(generated.body),
    ];
    const fatal = gates.filter((g) => g.gate !== 'G1' && !g.pass);
    attempt.body = generated.body;
    // Retained so the saved artifact can show no truncation occurred, rather than asking
    // anyone to take it on trust.
    attempt.stopReason = generated.stopReason;
    attempt.closerKey = closerFor(generated.key).key;
    attempt.gates = gates.map((g) => ({ gate: g.gate, pass: g.pass, detail: g.detail }));
    attempt.published = fatal.length === 0;
    attempt.closerAcceptable =
      testCase.acceptableCloserKeys.length === 0 ||
      testCase.acceptableCloserKeys.includes(attempt.closerKey);

    if (attempt.published && judge) {
      const verdict = await judgeSummary(judge, generated.body, articles, now);
      attempt.judge = {
        overall: verdict.overall,
        flagged: verdict.verdicts.filter((v) => !v.pass).map((v) => ({ criterion: v.criterion, quote: v.quote })),
      };
      // An unusable judge reply is never a pass — it means the case was not checked.
      attempt.judgeUsable = verdict.overall === 'pass' || verdict.overall === 'flag';
    }

    // What would actually reach readers if the judge were mandatory: deterministic gates
    // AND an explicit, usable judge pass. Anything else publishes headlines with no
    // summary. Reported separately from the deterministic figure because conflating them
    // is what made "29/30 availability" mean nothing — it counted summaries the judge
    // had already flagged.
    attempt.publishedWithJudge =
      attempt.published && (!judge || (attempt.judgeUsable && attempt.judge?.overall === 'pass'));
    results.push(attempt);
  }
}

/* ---------- reporting ---------- */

const byCase = new Map();
for (const r of results) {
  if (!byCase.has(r.caseId)) byCase.set(r.caseId, []);
  byCase.get(r.caseId).push(r);
}

let requiredTotal = 0;
let requiredCaught = 0;
let requiredCaughtAsLabelled = 0;
let controlRuns = 0;
let controlFlagged = 0;
let generationRuns = 0;
let generationFlagged = 0;
let summaryExpected = 0;
let summaryProduced = 0;
let summaryProducedGated = 0;
let judgeUnusable = 0;

console.log(`Golden run — ${cases.length} cases x ${RUNS}, model ${MODEL}, prompt ${PROMPT_VERSION}${USE_JUDGE ? `, judge ${JUDGE_MODEL}` : ', judge skipped'}\n`);

for (const [caseId, runs] of byCase) {
  const testCase = cases.find((c) => c.id === caseId);
  const published = runs.filter((r) => r.published);
  const required = testCase.mustBeCaughtBy ?? [];
  const isControl = required.length === 0 && testCase.expectedOutcome === 'summary';

  if (testCase.expectedOutcome === 'summary') {
    summaryExpected += runs.length;
    summaryProduced += published.length;
    summaryProducedGated += runs.filter((r) => r.publishedWithJudge).length;
  }

  const flaggedRuns = published.filter((r) => (r.judge?.flagged?.length ?? 0) > 0 || r.gates.some((g) => !g.pass));
  generationRuns += published.length;
  generationFlagged += flaggedRuns.length;
  judgeUnusable += published.filter((r) => r.judge && !r.judgeUsable).length;

  // Judge precision is measured against the case's LABELLED clean text, never against a
  // fresh generation. Judging generated output conflates two different things: the first
  // run of this harness reported a 100% false-alarm rate that was really the judge
  // correctly flagging a weak generation ("recently committed" about a 19-day-old item).
  if (isControl && testCase.publishedBody && judge && !testCase.excludeFromPrecision) {
    const articles = testCase.headlines.map((h) => ({ ...h, link: 'https://example.org/x' }));
    const verdict = await judgeSummary(judge, testCase.publishedBody, articles, Date.parse(testCase.asOf));
    const flags = verdict.verdicts.filter((v) => !v.pass);
    const usable = verdict.overall === 'pass' || verdict.overall === 'flag';
    controlRuns += 1;
    // An unusable reply on a control produced zero flag verdicts and was silently counted
    // as "no false alarm" — a judge that answered nothing scored as a judge that approved.
    if (!usable) {
      controlFlagged += 1;
      console.log(`    unusable judge reply on the labelled-clean body (${verdict.overall}) — counted against precision, not ignored`);
    } else if (flags.length) {
      controlFlagged += 1;
      console.log(`    false alarm on the labelled-clean body: ${flags.map((f) => f.criterion).join(', ')}`);
    }
  }

  // A case with a known error is scored on its published TEXT, which the harness
  // regenerates; the historical body is what the judge was calibrated on, so it is
  // checked directly rather than hoping the model reproduces the same mistake.
  if (required.length && testCase.publishedBody && judge) {
    requiredTotal += 1;
    const articles = testCase.headlines.map((h) => ({ ...h, link: 'https://example.org/x' }));
    const verdict = await judgeSummary(judge, testCase.publishedBody, articles, Date.parse(testCase.asOf));
    const gateFlags = [
      checkNumericGrounding(testCase.publishedBody, testCase.headlines.map((h) => h.title)),
      checkFormat(testCase.publishedBody),
    ].filter((g) => !g.pass).map((g) => g.gate);
    const caughtBy = [...gateFlags, ...verdict.verdicts.filter((v) => !v.pass).map((v) => v.criterion)];
    // Two measures, because they answer different questions. "Caught at all" is what
    // protects readers: an error flagged under J3 instead of J1 is still an error that
    // never publishes. "Caught as expected" is the diagnostic — a drift between the two
    // means the labels describe the failure less well than the judge does, which is
    // exactly what happened on 2026-09-12 (labelled J1, flagged J2/J3, scored a miss).
    const hit = caughtBy.length > 0;
    const asExpected = required.some((r) => caughtBy.includes(r));
    if (hit) requiredCaught += 1;
    if (asExpected) requiredCaughtAsLabelled += 1;
    console.log(
      `${hit ? '✓' : '✗'} ${caseId}: known ${required.join('/')} error ${hit ? 'caught' : 'MISSED'}` +
        ` (flagged: ${caughtBy.join(', ') || 'nothing'}${hit && !asExpected ? ' — caught, but not by the labelled criterion' : ''})`,
    );
  } else {
    // "flagged" here is a generation-quality signal. Judge precision is the separate
    // labelled-clean check above, so don't call these false alarms.
    console.log(`· ${caseId}: ${published.length}/${runs.length} produced a summary${flaggedRuns.length ? ` — ${flaggedRuns.length} generation flag(s)` : ''}`);
  }

  const badCloser = published.filter((r) => !r.closerAcceptable);
  if (badCloser.length) {
    console.log(`    closer outside the acceptable set on ${badCloser.length} run(s): ${[...new Set(badCloser.map((r) => r.closerKey))].join(', ')}`);
  }
}

const pct = (n, d) => (d === 0 ? 'n/a' : `${Math.round((n / d) * 100)}%`);
console.log('\nMetrics (bars from NEWS-SUMMARY-EVAL-PLAN.md):');
console.log(`  required catches   ${requiredCaught}/${requiredTotal}  (bar: all — flagged by anything)`);
console.log(`  ...as labelled     ${requiredCaughtAsLabelled}/${requiredTotal}  (diagnostic: label quality, not a bar)`);
console.log(`  false alarms       ${controlFlagged}/${controlRuns} = ${pct(controlFlagged, controlRuns)}  (bar: <= 10%, judged on labelled-clean text)`);
// Not a judge metric: how often freshly generated summaries get flagged. High here means
// the prompt needs work, not that the judge is wrong.
console.log(`  generation flags   ${generationFlagged}/${generationRuns} = ${pct(generationFlagged, generationRuns)}  (reported, not gated)`);
console.log(`  availability (deterministic gates only)   ${summaryProduced}/${summaryExpected} = ${pct(summaryProduced, summaryExpected)}`);
console.log(`  availability (judge mandatory)           ${summaryProducedGated}/${summaryExpected} = ${pct(summaryProducedGated, summaryExpected)}  (bar: >= 80%)`);
console.log(`  unusable judge replies ${judgeUnusable}  (bar: 0 — an unchecked summary is not a passing one)`);

const outPath = join(here, 'last-golden-run.json');
writeFileSync(outPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), model: MODEL, promptVersion: PROMPT_VERSION, results }, null, 2)}\n`);
console.log(`\nWrote ${outPath}`);

if (golden.status?.startsWith('PROPOSED')) {
  console.log('\nNOTE: labels are still PROPOSED and unapproved, so this run reports but does not gate.');
  process.exit(0);
}

const failed =
  requiredCaught < requiredTotal ||
  judgeUnusable > 0 ||
  (controlRuns > 0 && controlFlagged / controlRuns > 0.1) ||
  // Gated on judge-mandatory availability, which is what production will do. Gating on the
  // deterministic figure would have certified a pipeline publishing almost nothing.
  (summaryExpected > 0 && summaryProducedGated / summaryExpected < 0.8);
process.exitCode = failed ? 1 : 0;
