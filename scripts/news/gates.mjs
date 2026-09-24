/**
 * Pre-publish gates for the news digest (NEWS-SUMMARY-EVAL-PLAN.md, layer 1).
 *
 * Pure functions, no network and no side effects, so the eval harness can replay every
 * historical summary through them. Each returns { pass, detail } and the caller decides
 * whether to retry, withhold the summary, or fail the run.
 */

import { CLOSER_KEYS } from './closers.mjs';

export const MAX_BODY_WORDS = 90;
// A reply of just "CLOSER: laws" leaves an empty body, which passes every other check and
// publishes the vetted sentence alone as though it were a digest.
//
// Set at 10, not 15: the prompt tells the model to write one shorter, general sentence
// when the headlines are thin, and a 15-word floor withheld exactly those — a quiet news
// day would have lost its summary every time (golden run, 2026-09-12). This catches the
// empty and closer-only cases, which are nought to three words, without punishing brevity.
export const MIN_BODY_WORDS = 10;
export const MAX_ARTICLES = 5;

/**
 * Every number in a string, normalised for comparison.
 *
 * Compared as whole tokens, never as substrings. A substring test both missed invented
 * numbers and blocked accurate ones: against the headline "House votes 214-209 …", an
 * invented "21%" was "grounded" because 214 contains 21, while the correct "the vote was
 * 214-209" was rejected because the sentence's final period rode along in the token.
 * Compound figures split, so 214-209 grounds both 214 and 209, and separators are
 * stripped so 700,000 matches 700000.
 */
function numericTokens(text) {
  return (text.match(/\d[\d,.:%$–—-]*/g) ?? [])
    .flatMap((token) => token.split(/[:–—-]/))
    .map((token) => token.replace(/[.,:%$–—-]+$/, '').replace(/,/g, ''))
    .filter(Boolean);
}

/** G1 — the model chose a key from the approved list; the code supplies the sentence. */
export function checkCloserKey(key) {
  const pass = CLOSER_KEYS.includes(key);
  return {
    gate: 'G1',
    pass,
    detail: pass ? `key "${key}"` : `unknown key ${JSON.stringify(key)}; falling back`,
  };
}

/**
 * G2 — numeric grounding. Every year, number, dollar amount or percentage the model
 * wrote must appear in a headline.
 *
 * Deliberately narrow: this catches an invented number ("events in January 2021",
 * 2026-09-05) and nothing else. It cannot catch a wrong actor, outcome or duration —
 * "the deployment, which lasted a year" (2026-08-26) passes, because "year" carries no
 * digits. Those are the judge's job (J1), not this gate's.
 */
export function checkNumericGrounding(body, headlines) {
  const ungrounded = [...new Set(numericTokens(body))].filter(
    (token) => !new Set(numericTokens(headlines.join(' '))).has(token),
  );
  return {
    gate: 'G2',
    pass: ungrounded.length === 0,
    detail: ungrounded.length ? `not in any headline: ${ungrounded.join(', ')}` : 'all numbers grounded',
  };
}

/** G3 — shape: one paragraph of plain prose, no markdown, no preamble. */
export function checkFormat(body) {
  const problems = [];
  if (/\n\s*\n/.test(body.trim())) problems.push('more than one paragraph');
  if (/^[-*#>]|\*\*|^\s*\d\./m.test(body)) problems.push('markdown formatting');
  if (/^(here('s| is)|summary:|sure[,!])/i.test(body.trim())) problems.push('preamble');
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  if (words > MAX_BODY_WORDS) problems.push(`${words} words > ${MAX_BODY_WORDS}`);
  if (words < MIN_BODY_WORDS) problems.push(`${words} words < ${MIN_BODY_WORDS} (empty or truncated body)`);
  return {
    gate: 'G3',
    pass: problems.length === 0,
    detail: problems.length ? problems.join('; ') : `${words} words, single paragraph`,
  };
}

/**
 * G4 — the published article set. Zero articles is allowed here (healthy-empty is
 * decided upstream by G5/G6); what is not allowed is a malformed or future-dated item,
 * or a summary generated from a different set than the one being published.
 */
export function checkArticles(articles, summarySourceIds = null, now = Date.now()) {
  const problems = [];
  if (!Array.isArray(articles)) return { gate: 'G4', pass: false, detail: 'articles is not an array' };
  if (articles.length > MAX_ARTICLES) problems.push(`${articles.length} articles > ${MAX_ARTICLES}`);

  articles.forEach((a, i) => {
    if (!a?.title) problems.push(`#${i} missing title`);
    if (!a?.source) problems.push(`#${i} missing source`);
    if (!/^https:\/\//.test(a?.link ?? '')) problems.push(`#${i} link is not https`);
    const ts = new Date(a?.pubDate ?? '').getTime();
    if (Number.isNaN(ts)) problems.push(`#${i} unparseable date`);
    // A future date means a broken feed or a bad parse, not news. The tolerance covers
    // clock skew and sloppy timezone offsets only — a full day of slack made "not in the
    // future" untrue, and a tomorrow-dated item would sort to the top and render as
    // "-1 days ago".
    else if (ts > now + 2 * 60 * 60 * 1000) problems.push(`#${i} dated in the future`);
  });

  if (summarySourceIds) {
    const published = articles.map((a) => a.link).join('|');
    if (published !== summarySourceIds.join('|')) {
      problems.push('summary was generated from a different article set');
    }
  }

  return {
    gate: 'G4',
    pass: problems.length === 0,
    detail: problems.length ? problems.join('; ') : `${articles.length} articles ok`,
  };
}

/**
 * G5 — source health. A source counts as successful only when it returned something that
 * parses as a feed. An HTTP 200 carrying an error page is a failure: without this, a
 * dead feed looks identical to a quiet news day and the site would publish an empty feed
 * as if it were the truth.
 */
export function checkSourceHealth(sourceResults) {
  const ok = sourceResults.filter((s) => s.status === 'ok');
  const failed = sourceResults.filter((s) => s.status !== 'ok');
  return {
    gate: 'G5',
    pass: ok.length > 0,
    detail: ok.length
      ? `${ok.length}/${sourceResults.length} sources ok${failed.length ? `; failed: ${failed.map((f) => `${f.source} (${f.status})`).join(', ')}` : ''}`
      : 'every source failed',
    someFailed: failed.length > 0,
  };
}

/**
 * G6 — the relevance filter's reply is a JSON array of in-range indices. Today's script
 * turns anything unexpected into [], which publishes as "no relevant news" — a silent
 * failure this gate exists to stop.
 */
export function checkFilterResponse(raw, articleCount) {
  // The whole reply must be the array. Fishing out the first bracketed run accepted
  // things like "[[]]" as an empty list — i.e. a malformed answer publishing as "no
  // relevant news", the silent failure this gate exists to prevent.
  // A ```json fence is how the model actually replies, so strip one — but only one, and
  // then the remainder must be exactly an array. Fishing the first bracketed run out of
  // arbitrary text is what let "[[]]" through as an empty list.
  const text = String(raw ?? '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { gate: 'G6', pass: false, detail: 'reply is not a JSON array', indices: null };
  }
  if (!Array.isArray(parsed)) {
    return { gate: 'G6', pass: false, detail: `reply parsed as ${typeof parsed}, not an array`, indices: null };
  }
  const bad = parsed.filter((i) => !Number.isInteger(i) || i < 0 || i >= articleCount);
  if (bad.length) {
    return { gate: 'G6', pass: false, detail: `out-of-range indices: ${bad.join(', ')}`, indices: null };
  }
  // Duplicates would publish the same article twice, burn the five-article budget and
  // collide as React keys.
  const unique = [...new Set(parsed)];
  if (unique.length !== parsed.length) {
    return { gate: 'G6', pass: false, detail: 'duplicate indices', indices: null };
  }
  return { gate: 'G6', pass: true, detail: `${unique.length} indices`, indices: unique };
}
