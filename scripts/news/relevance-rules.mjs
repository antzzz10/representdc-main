/**
 * The topic rule: a deterministic precision check on the relevance filter's yes list
 * (added 2026-11-21).
 *
 * Why: the model filter reads headlines only, and it lets through local D.C. stories
 * that are not about statehood or self-government. On 2026-11-21 the page carried
 * Medicaid work requirements and utility reform; earlier it carried a crossword and
 * ticket-resale lawsuits. An article now counts as relevant on a run only when the
 * model says yes AND this rule passes. The rule only ever removes. It is applied to
 * articles being judged on this run; an article already confirmed in the archive is not
 * re-examined (archive.mjs: a confirmed item is never rewritten or removed by a run).
 * A stored PENDING entry is re-examined: one whose headline fails the rule is dropped
 * before the run's verdicts are applied (keepPendingByTopicRule).
 *
 * Measured on 2026-11-21 against all 89 recorded runs, counting each distinct headline
 * and source once (entities decoded, roundups left out): of the 36 headlines the model
 * had ever accepted, the rule blocks 13 (the crossword, the print-edition notice, two
 * ticket-resale items, two voting how-tos, two "president" items and five other
 * off-topic local stories) and keeps the other 23. Both lists are a fixture in
 * scripts/eval/relevance-rules.test.mjs. (The owner's own count of the same records,
 * made a different way, was 11 blocked of 38; the 11 are all among these 13.)
 *
 * The lexicon was widened the same day, and headlines are now normalised before
 * matching (normaliseTitle), after review found it blocking plainly on-topic wordings
 * such as "House votes to overturn D.C. law" and "Home-rule law at risk". Re-measured on
 * the same records: the same 13 blocked, the same 23 kept.
 *
 * It cannot replace the model. Run on its own over the 2,067 headlines the model never
 * accepted, the rule would accept about 728, roughly a third: words like "federal",
 * "Trump" and "Senate" appear in a great deal of news that has nothing to do with D.C.
 * self-government. It is a second opinion on a yes, never a first opinion.
 *
 * "president" and "presidential" are deliberately NOT in the lexicon.
 *
 * Pure: no network, no clock.
 */

import { decodeEntities } from './feeds.mjs';

// Each entry is matched case-insensitively as whole words (\b on both sides) against the
// NORMALISED headline (see normaliseTitle): hyphens and dashes are already spaces and
// "D.C." is already "DC", so entries are written that way ("self govern", "dc law").
// A trailing \w* is a stem: "self govern" covers self-government and self-governance.
const LEXICON = [
  'statehood',
  '51st state',
  'home rule',
  'home rule act',
  'self govern\\w*',
  'self determination',
  'autonom\\w*',
  'budget autonomy',
  'budget independence',
  'independence',
  'local authority',
  'local control',
  // Not "law enforcement": "D.C. law enforcement arrests..." is a crime story (Codex, 2026-11-21).
  'local laws?(?! enforcement)',
  'dc laws?(?! enforcement)',
  'shadow senator',
  'shadow representative',
  // Also matches "delegate-elect".
  'delegate',
  'representation',
  'voting representation',
  'voting rights',
  'vote in congress',
  'disenfranchis\\w*',
  'taxation without',
  // What Congress does to a D.C. law.
  'overturn\\w*',
  'overrid\\w*',
  'overrul\\w*',
  'repeal\\w*',
  'disapprov\\w*',
  // "preempt" and "pre-empt" (the hyphen is a space by now).
  'pre ?empt\\w*',
  'nullif\\w*',
  'veto\\w*',
  'congress',
  'congressional',
  'capitol hill',
  'lawmakers',
  'house oversight',
  'house republicans',
  'house gop',
  'house committee',
  'house democrats',
  'house votes',
  'house passes',
  'house bill',
  'senate',
  'senators?',
  'riders?',
  'appropriations?',
  'federal',
  'federally',
  'federaliz\\w*',
  'feds',
  'national guard',
  'troops',
  'military',
  'occupation',
  'takeover',
  // Also matches "Trump's": an apostrophe is a word boundary.
  'trump',
  'white house',
  'administration',
  'doj',
  'justice department',
  'oversight',
  'control over',
  'some states',
  'admission act',
  'h\\.r\\. ?51',
  's\\. ?51',
  'interfer\\w*',
];

const TOPIC = new RegExp(`\\b(?:${LEXICON.join('|')})\\b`, 'i');

/**
 * A headline as the lexicon reads it. Outlets punctuate the same words differently, and
 * matching the raw text blocked plainly on-topic headlines: "Home-rule law at risk" has
 * no "home rule" in it, and a non-breaking hyphen (U+2011) hid "self‑government".
 *
 *   - HTML entities decoded;
 *   - every hyphen and dash (-, U+2010 to U+2015, U+2212) becomes a space;
 *   - curly apostrophes become straight ones;
 *   - "D.C." becomes "DC";
 *   - runs of whitespace, including non-breaking spaces, become one space.
 */
export function normaliseTitle(title) {
  return decodeEntities(String(title))
    .replace(/[-‐-―−]/g, ' ')
    .replace(/[‘’ʼ]/g, "'")
    .replace(/\bd\.c\./gi, 'DC')
    .replace(/[\s ]+/g, ' ')
    .trim();
}

/**
 * Does this headline pass the topic rule?
 *
 * @param title                 the headline
 * @param options.statehoodOrg  true when the article came from a FEED configured as a
 *                              statehood organisation (`statehoodOrg: true` in feeds.mjs,
 *                              carried on the fetched item as `_statehoodOrg`). Such a
 *                              post passes whatever its title says: "Where the Fight
 *                              Stands" from DC Vote is on topic because of who wrote it.
 *
 * The exemption is never decided from the article's source LABEL. A feed item can carry
 * its own <source> tag, so a label saying "DC Vote" proves nothing about where the item
 * came from; only the feed configuration does.
 */
export function passesTopicRule(title, { statehoodOrg = false } = {}) {
  if (statehoodOrg === true) return true;
  if (typeof title !== 'string') return false;
  return TOPIC.test(normaliseTitle(title));
}

/**
 * Splits the model's yes list by the rule. `kept` is what counts as relevant this run;
 * `blocked` is recorded and otherwise dropped. A blocked article gets no yes toward
 * confirmation.
 */
export function applyTopicRule(articles) {
  const kept = [];
  const blocked = [];
  for (const article of articles) {
    (passesTopicRule(article.title, { statehoodOrg: article._statehoodOrg === true }) ? kept : blocked).push(article);
  }
  return { kept, blocked };
}

/**
 * For applyRun's `keepPending`: should this stored pending entry stay?
 *
 * A pending entry is one model yes, recorded with the headline as it was then. If that
 * stored headline fails the rule, the entry goes, so a yes given before the rule existed
 * (or to an earlier wording) can never be the first of the two that confirm an article.
 * `candidate` is this run's fetched copy of the same link, or null if the link is no
 * longer in any feed; the organisation exemption comes from it and from nothing else, so
 * an organisation's pending entry is judged on its title alone once it has left the feed.
 */
export function keepPendingByTopicRule(entry, candidate) {
  return passesTopicRule(entry.title, { statehoodOrg: candidate?._statehoodOrg === true });
}
