/**
 * The two model calls behind the news digest: a relevance filter and a summary.
 *
 * Changes from dc-bills-tracker's version, all traceable to errors the old prompt
 * actually published (see NEWS-SUMMARY-EVAL-PLAN.md's failure table):
 *
 * - Headlines now carry their publication date and age. The summarizer previously saw
 *   titles and sources only, which is how "a House committee is currently considering
 *   proposals" reached the page on 2026-08-29 from a headline dated July 21.
 * - The model picks a closing-sentence key; the vetted sentence is appended by code.
 * - The body is forbidden from making legal claims about D.C.'s powers; that is the
 *   closer's job, and free-written versions were wrong twice.
 * - The site names itself www.representdc.org, not the bill tracker.
 * - Every call returns its usage so the run record can log it.
 */

import Anthropic from '@anthropic-ai/sdk';
import { closerMenu, CLOSER_KEYS } from './closers.mjs';
import { checkFilterResponse } from './gates.mjs';

export const MODEL = 'claude-haiku-4-5-20251001';
export const PROMPT_VERSION = '2026-09-12.1';

export function getClient(apiKey = process.env.ANTHROPIC_API_KEY) {
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  // Bounded on purpose. The SDK's default allows ten minutes per attempt, and with five
  // retries one stalled call can outlast the 20-minute job — which would cost both the
  // headlines fallback and the alert, because neither gets to run. 60s x 3 attempts per
  // call keeps the worst case for a filter, a summary, a retry and two judge calls well
  // inside the budget.
  return new Anthropic({ apiKey, maxRetries: 2, timeout: 60_000 });
}

function daysOld(pubDate, now) {
  const ts = new Date(pubDate).getTime();
  if (!Number.isFinite(ts)) return null;
  return Math.max(0, Math.floor((now - ts) / (24 * 60 * 60 * 1000)));
}

/** "- "Title" (Source, published 2026-08-24, 19 days ago)" */
export function headlineBlock(articles, now = Date.now()) {
  return articles
    .map((a) => {
      const age = daysOld(a.pubDate, now);
      const date = Number.isFinite(new Date(a.pubDate).getTime())
        ? new Date(a.pubDate).toISOString().slice(0, 10)
        : 'undated';
      const ageText = age === null ? '' : `, ${age === 0 ? 'published today' : `${age} day${age === 1 ? '' : 's'} ago`}`;
      return `- "${a.title}" (${a.source}, ${date}${ageText})`;
    })
    .join('\n');
}

export async function filterByRelevance(client, articles) {
  const titlesBlock = articles.map((a, i) => `${i}: ${a.title}`).join('\n');

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `You are a relevance filter for a DC statehood and home rule advocacy website (www.representdc.org).

Below are article titles from DC-area news sources. Return ONLY the index numbers of articles that are specifically about one or more of:
- DC statehood
- DC home rule or congressional oversight of DC
- Congressional legislation, votes, or budget actions that directly affect DC governance or local laws
- Federal actions that override or threaten DC's self-governance

Do NOT include articles about:
- General DC local news (crime, weather, sports, events, local politics not related to autonomy)
- DC neighborhood or community stories
- Federal policy that affects DC only as a city/region (not as a self-governance issue)
- Human interest stories unrelated to DC autonomy or statehood

Return a JSON array of index numbers only, e.g. [0, 3, 7]. Return [] if none qualify.
Output the bare array and nothing else: no code fences, no explanation, no repeated indices.

Article titles:
${titlesBlock}`,
      },
    ],
  });

  const raw = message.content[0].text.trim();
  const check = checkFilterResponse(raw, articles.length);
  return {
    check,
    raw,
    usage: message.usage,
    articles: check.pass ? check.indices.map((i) => articles[i]).filter(Boolean) : null,
  };
}

/**
 * Returns the model-written body and its chosen closer key. The caller appends the
 * vetted sentence — this function never returns a closing sentence of its own.
 */
export async function summarizeArticles(client, articles, now = Date.now()) {
  if (!articles.length) return null;

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `You write a short neutral news-digest summary for a DC statehood advocacy website (www.representdc.org). Below are the current DC statehood/home-rule headlines the site is showing, each with its publication date and age.

Write 2-3 sentences summarizing what is happening across these stories, for a reader who wants the gist before deciding which to read in full.

Rules:
- Use ONLY information present in the headlines below. Do not infer or invent specifics — numbers, dates, names, durations, or outcomes — that are not stated in a headline.
- Respect the dates, but do not be pedantic about them: this beat moves slowly, so "currently", "ongoing" and the present tense are fine for anything within the last two months or so. What you must never do is state an outcome the headlines do not support — calling something pending when a headline says it was decided, passed or rejected; saying an event ended, lasted a set time, or is still going on when the headlines only mark its anniversary; or attaching a date the headlines do not give. If the only headline behind a claim is older than about two months, write it in the past tense.
- Attribute contested claims to whoever made them ("advocates say", "the group argues"). Do not assert them in the site's own voice, and do not claim the coverage proves anything.
- Do NOT state what powers D.C. does or does not have as a non-state. A separate vetted sentence handles that, and it is added after your text.
- Write about the events, not about the coverage. Do not open with "Recent headlines...", "These stories...", "Coverage shows..." or any other reference to the list itself.
- Do not characterise a pattern, trend, escalation or wider significance that no headline states. One vote is one vote; two stories are two stories. Phrases like "continuing a pattern of", "part of a broader effort", "demonstrating ongoing", "underscoring how" are the failure to avoid — report what happened instead.
- Plain prose. One paragraph, no headers, no bullet points, no preamble like "Here is a summary."
- If the headlines are too thin to summarize substantively, write one shorter, more general sentence rather than guessing.

Then, on a final separate line, output exactly:
CLOSER: <key>

where <key> is whichever of these standing facts best matches what these headlines are about:
${closerMenu()}

Choose the key by subject matter only. If nothing matches cleanly, use "laws".

Headlines:
${headlineBlock(articles, now)}`,
      },
    ],
  });

  const text = message.content[0].text.trim();
  const match = text.match(/^CLOSER:\s*([a-z]+)\s*$/im);
  const key = match ? match[1].toLowerCase() : null;
  const body = text.replace(/^CLOSER:.*$/im, '').trim();

  return {
    body,
    key,
    keyWasStated: Boolean(match) && CLOSER_KEYS.includes(key),
    raw: text,
    // Carried so the caller can reject a truncated answer. A reply cut off at max_tokens
    // can still read as a clean paragraph and pass every gate — verified in review with
    // output ending "after members debated the".
    stopReason: message.stop_reason,
    usage: message.usage,
  };
}
