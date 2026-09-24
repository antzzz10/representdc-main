/**
 * The summary judge: a second, stronger model reading what Haiku wrote.
 *
 * Offline only for now (NEWS-SUMMARY-EVAL-PLAN.md, layer 4). It flags; it never blocks a
 * run. Promoting it to a live gate is a decision for after a month of data, because an
 * uncalibrated judge that blocks is just a second way to lose summaries.
 *
 * It reads ONLY the model-written body. The vetted closing sentence is deliberately kept
 * out of its input: that sentence states law the headlines do not contain, so a
 * grounding judge would flag every correct closer. Closer accuracy is a one-time human
 * check against a primary source, not this model's job — which is also why calibration
 * requires the three historical BODY errors, not all five known errors.
 */

import Anthropic from '@anthropic-ai/sdk';
import { headlineBlock } from './summarize.mjs';

export const JUDGE_MODEL = 'claude-sonnet-5';
export const JUDGE_VERSION = '2026-09-12.1';

const CRITERIA = `J1 supported — every claim is stated or directly implied by a headline. Flag invented specifics (dates, numbers, names), inferences the headlines do not support (an anniversary is not proof that something ended or is still happening), and a proposal described as though it were already in force. Completing a name or title the headline already gives is NOT an invention: "Norton reintroduces a bill" supports "Delegate Eleanor Holmes Norton reintroduced a bill".
J2 no legal claims — the text must not state what powers D.C. does or does not have as a non-state. A separate vetted sentence does that.
J3 temporal — D.C. statehood news moves slowly, so "currently", "ongoing", "recent" and the present tense are FINE for anything within roughly the last two months. Do not flag ordinary tense or word choice. Flag only outright errors: (a) describing something as pending, underway or under consideration when a headline shows it was already decided, passed, rejected or completed; (b) a date, duration or sequence the headlines contradict; (c) present-tense claims resting only on an article more than about two months old.
J4 attributed — flag only a contested claim stated AS FACT in the site's own voice, where no headline supports it ("the takeover proves D.C. can never be safe"). Characterising advocates' position ("advocates say momentum is growing", "groups call it urgent") is fine and is not a flag.`;

export function buildPrompt(body, articles, now) {
  return `You are checking a short news-digest paragraph written for a D.C. statehood website, against the only source it was given: the headlines below, with their publication dates. Today is ${new Date(now).toISOString().slice(0, 10)}.

Judge it on four criteria:

${CRITERIA}

Headlines:
${headlineBlock(articles, now)}

Paragraph to check:
"""
${body}
"""

Return ONLY a JSON object:
{"verdicts": [{"criterion": "J1", "pass": true|false, "quote": "the exact words at issue, or null", "why": "one sentence"}], "overall": "pass"|"flag"}

Include one entry per criterion. Be specific and quote the text you are flagging. A paragraph with nothing wrong returns four passes and "pass".`;
}

/** Returns { verdicts, overall, raw, usage } — never throws on a bad reply. */
export async function judgeSummary(client, body, articles, now = Date.now()) {
  // 4096, not 1024: this model thinks before it answers, and at 1024 an entire run came
  // back with output_tokens == thinking_tokens == 1024 and no text block at all
  // (2026-09-12, replaying the 2026-08-29 summary). A judge that silently returns
  // nothing is worse than no judge, because "no flags" reads as "nothing wrong".
  const message = await client.messages.create({
    model: JUDGE_MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: buildPrompt(body, articles, now) }],
  });

  // Not content[0]: a model that emits a thinking block first would put no text there.
  const raw = (message.content.find((block) => block.type === 'text')?.text ?? '').trim();
  // Distinct from 'unparseable': no text at all means the call was truncated or refused,
  // which is an error to chase, never a quiet pass. Callers must not treat either as
  // "the summary is fine".
  if (!raw) {
    return {
      verdicts: [],
      overall: 'no-text',
      stopReason: message.stop_reason,
      raw: '',
      usage: message.usage,
    };
  }
  // A truncated reply can still contain a JSON-looking fragment that parses. Its verdicts
  // are whatever the model managed to emit before being cut off, which is not a judgment.
  // Only a normally completed reply may be read as one.
  if (message.stop_reason !== 'end_turn' && message.stop_reason !== 'stop_sequence') {
    return {
      verdicts: [],
      overall: 'incomplete',
      stopReason: message.stop_reason,
      raw,
      usage: message.usage,
    };
  }

  // Parse the WHOLE reply, not the first brace-run inside it: fishing a substring out of
  // arbitrary text accepted prose wrapped around a fragment.
  // Named jsonText, not body: `body` is this function's own parameter — the summary text
  // being judged.
  const jsonText = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
  if (!jsonText.startsWith('{') || !jsonText.endsWith('}')) {
    return { verdicts: [], overall: 'unparseable', raw, usage: message.usage };
  }
  try {
    const parsed = JSON.parse(jsonText);
    const verdicts = Array.isArray(parsed.verdicts) ? parsed.verdicts : [];
    const criteria = new Set(verdicts.map((v) => v?.criterion));
    // Exactly one boolean verdict per criterion — no missing ones, no duplicates voting
    // twice. A reply of {"overall":"pass"} with no verdicts used to come back as a clean
    // pass: an unchecked summary indistinguishable from a checked one.
    const wellFormed =
      verdicts.length === 4 &&
      criteria.size === 4 &&
      verdicts.every((v) => typeof v?.pass === 'boolean') &&
      ['J1', 'J2', 'J3', 'J4'].every((c) => criteria.has(c));

    if (!wellFormed) {
      return { verdicts, overall: 'incomplete', raw, usage: message.usage };
    }

    const statedOverall = parsed.overall ?? null;
    const allPass = verdicts.every((v) => v.pass);

    // Now that this gates publication, a disagreement between the model's own summary
    // line and its verdicts must never resolve to "publish". Previously the verdicts
    // always won, so a reply saying overall:"flag" with four passing verdicts returned a
    // pass. A missing overall is likewise not a judgment.
    if (statedOverall !== (allPass ? 'pass' : 'flag')) {
      return { verdicts, overall: 'incomplete', statedOverall, raw, usage: message.usage };
    }

    return { verdicts, overall: allPass ? 'pass' : 'flag', statedOverall, raw, usage: message.usage };
  } catch {
    return { verdicts: [], overall: 'unparseable', raw, usage: message.usage };
  }
}

export function judgeClient(apiKey = process.env.ANTHROPIC_API_KEY) {
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  // Same bound as the summarizer's client, for the same reason: an unbounded judge call
  // would consume the job's whole budget, and the headlines-only fallback only helps if
  // the process survives to reach it. A judge that times out withholds the summary.
  return new Anthropic({ apiKey, maxRetries: 2, timeout: 60_000 });
}
