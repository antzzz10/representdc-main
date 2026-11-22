/**
 * Tests for the topic rule (scripts/news/relevance-rules.mjs), the deterministic check
 * applied to the relevance filter's yes list, and for the no-dashes rule in the summary
 * (the prompt line and gate G3).
 *
 * The fixtures are real: every headline the model filter accepted across the 89 recorded
 * runs up to 2026-11-21 (each distinct headline and source once, roundups left out),
 * split by what the rule does with it, plus the two stories that prompted the rule.
 * Run with `npm run test:news`.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { passesTopicRule, applyTopicRule, keepPendingByTopicRule, normaliseTitle } from '../news/relevance-rules.mjs';
import { FEEDS, fetchAllFeeds } from '../news/feeds.mjs';
import { applyRun, emptyArchive, parseArchive } from '../news/archive.mjs';
import { checkFormat } from '../news/gates.mjs';
import { summarizeArticles, PROMPT_VERSION } from '../news/summarize.mjs';
import { closerFor, CLOSER_KEYS } from '../news/closers.mjs';

// In these fixtures an article's source is the feed it was recorded from, so the feed
// configuration's flag can be looked up from it. Production never does this lookup: the
// flag is put on each item by the fetch (tested further down).
const ORG_FEEDS = new Set(FEEDS.filter((f) => f.statehoodOrg === true).map((f) => f.source));
const passes = (title, source) => passesTopicRule(title, { statehoodOrg: ORG_FEEDS.has(source) });

// Accepted by the model at least once, and off topic. The rule must block each.
const BLOCKED = [
  ['The 51st in print!', 'The 51st'],
  ["The 51st's first crossword puzzle", 'The 51st'],
  ['Ticket Policy Forum Has Sued D.C. to Block RESALE Act', 'Washington City Paper'],
  ['Ticket Resale Platforms Sue D.C. to Block Price Cap', 'The Washington Sun'],
  ['Three Things to Know When Voting in D.C.', 'ACLU DC'],
  ['Yes, D.C. does still have a general election … Here’s what to know', 'The 51st'],
  ['‘The Capital’ Reclaims D.C.’s Place in the American Story', 'Washington Informer'],
  ['Morning Sun: What the Money Says', 'The Washington Sun'],
  ['Social Security, Voting and the Power of D.C.’s 50-Plus Voters', 'Washington Informer'],
  ['Honoring the ‘Warrior on the Hill’: Eleanor Holmes Norton Legacy Fund Luncheon Celebrates Namesake’s Longtime Leadership', 'Washington Informer'],
  ['Workers Lose 52 Cents of Every Dollar Gained to Pay Down Debt, Says New Report', 'Washington Informer'],
  // Blocked because "president" and "presidential" are deliberately not in the lexicon.
  ["It's not obscene or a threat. The government can't shut down free speech that criticizes the president.", 'ACLU DC'],
  ['Morning Sun: Presidential Politicking', 'The Washington Sun'],
  // On the page on 2026-11-21, the day the rule was written.
  ['D.C. delays Medicaid work requirements, but thousands may still lose their health insurance next year', 'The 51st'],
  ['D.C. is poised to pass major utility reforms. Will they get gas and electric bills under control?', 'The 51st'],
];

// Accepted by the model, and the rule keeps each.
const KEPT = [
  ['Election Shakeup Revives D.C.’s Fight for Statehood', 'Washington Informer'],
  ['Why Doesn’t D.C. Have More Control Over Its Parks?', 'The Washington Sun'],
  ['Can DC’s new delegate get Congress to care about statehood?', 'Roll Call'],
  ['Where the Fight Stands – Amy Vruno, DC Vote Executive Director', 'DC Vote'],
  ['Why we shouldn’t have National Guard Troops in D.C.', 'ACLU DC'],
  ['Nine Attacks on DC’s Local Authority, and How We Responded', 'DC Vote'],
  ['VIDEO: Senator Slotkin Commits to Making DC Statehood a Top Priority', 'DC Vote'],
  ['D.C. Elections Board Asks National Guard to Stay Away From Ballot Drop Boxes', 'The Washington Sun'],
  ['Trump’s Military Occupation of D.C. Faces Court Test as Judges Question Presidential Power', 'Washington Informer'],
  ['DC Has More People Than Some States Already Have', 'DC Vote'],
  ['The Washington Sun Metro: Representation Talks Taxation', 'The Washington Sun'],
  ['DOJ Asks a Judge to Recuse Herself From East Potomac Park Case', 'The Washington Sun'],
  ['Trump Administration Says East Potomac Renovation Plans Aren’t Final or Reviewable', 'The Washington Sun'],
  ['D.C. Attorney General Warns Federal Agents, National Guard Against Interfering with November Election', 'Washington Informer'],
  ['As Early Voting Begins in D.C., Some Prepare for Federal Interference', 'The Washington Sun'],
  ['Delegate on Deadline', 'The Washington Sun'],
  ['Robert White Is Rushing to Preserve His Eligibility in the D.C. Delegate Race', 'The Washington Sun'],
  ['D.C., Virginia Sue Trump Adminstration Over Proposed Triumphal Arch', 'The Washington Sun'],
  ['Trump’s Power on Trial as D.C. Faces Political Upheaval', 'Washington Informer'],
  ['D.C., Virginia Fight Trump’s 250-Foot Arch', 'Washington Informer'],
  ['At-Large D.C. Council Member White to Resign, While D.C. Democrats Allege Interference in Process to Appoint a Successor', 'Washington Informer'],
  ['DC Vote: Midterm Results Create New Momentum for DC Statehood', 'DC Vote'],
  ['Trump’s Grip on Washington Faces New Resistance as Courts, Congress Challenge His Remaking of D.C.', 'Washington Informer'],
];

// Plainly on topic, and blocked by the first version of the rule (review, 2026-11-21):
// no lexicon word, or a hyphen hiding one.
const MUST_PASS = [
  'House votes to overturn D.C. law',
  'D.C. voting rights bill advances',
  'D.C. leaders fight for budget independence',
  'Home-rule law at risk',
  'D.C. self\u2011government under threat',
  'D.C. home-rule law faces challenge',
  'D.C. residents demand voting rights',
];

test('topic rule: on-topic wordings the first version blocked now pass', () => {
  assert.ok(MUST_PASS[4].includes('\u2011'), 'the fixture really holds a non-breaking hyphen');
  for (const title of MUST_PASS) assert.equal(passes(title, 'The 51st'), true, `must pass: ${title}`);
});

test('topic rule: "law enforcement" is not "D.C. law"', () => {
  assert.equal(passes('D.C. law enforcement arrests burglary suspect', 'The 51st'), false);
  assert.equal(passes('Local law enforcement steps up patrols', 'The 51st'), false);
  assert.equal(passes('House votes to overturn D.C. law', 'The 51st'), true);
  assert.equal(passes('New D.C. laws take effect in January', 'The 51st'), true);
});

test('topic rule: headlines are normalised before matching', () => {
  assert.equal(normaliseTitle('Home-rule  law\u00A0at risk'), 'Home rule law at risk');
  assert.equal(normaliseTitle('D.C. self\u2011government \u2013 under threat'), 'DC self government under threat');
  assert.equal(normaliseTitle('D.C.\u2019s plan &#8212; and Trump&#8217;s'), "DC's plan and Trump's");
  // Every hyphen and dash variant, and "DC" written either way.
  for (const dash of ['-', '\u2010', '\u2011', '\u2012', '\u2013', '\u2014', '\u2015', '\u2212']) {
    assert.equal(passes(`Home${dash}rule fight`, 'The 51st'), true, `home rule with U+${dash.charCodeAt(0).toString(16)}`);
    assert.equal(passes(`Self${dash}determination for the District`, 'The 51st'), true);
  }
  assert.equal(passes('Congress targets a DC law', 'x'), true);
  assert.equal(passes('A D.C. law under review', 'x'), true);
  assert.equal(passes('Two DC laws under review', 'x'), true);
  for (const title of ['Council moves to repeal the measure', 'Mayor vetoes the bill', 'A veto fight looms', 'Bill would preempt the Council', 'Bill would pre-empt the Council', 'Resolution of disapproval filed', 'Court overrules the board', 'Plan to nullify the act', 'Members override the mayor', 'Lawmakers weigh a new plan', 'House passes spending package', 'A House bill on the District', 'Local laws at stake', 'Budget autonomy returns', 'Voting representation for the District', 'A vote in Congress, at last', 'The Home Rule Act at 50']) {
    assert.equal(passes(title, 'x'), true, `must pass: ${title}`);
  }
});

test('topic rule: blocks every off-topic headline the model has accepted', () => {
  for (const [title, source] of BLOCKED) {
    assert.equal(passes(title, source), false, `must block: ${title} (${source})`);
  }
});

test('topic rule: keeps every on-topic headline the model has accepted', () => {
  for (const [title, source] of KEPT) {
    assert.equal(passes(title, source), true, `must keep: ${title} (${source})`);
  }
});

test('topic rule: statehood organisations pass on the feed flag, and only DC Vote carries it', () => {
  assert.deepEqual(FEEDS.filter((f) => f.statehoodOrg).map((f) => f.source), ['DC Vote']);
  assert.equal(passesTopicRule('Where the Fight Stands', { statehoodOrg: true }), true);
  // Without the flag the headline is judged on its words, whatever else is passed.
  assert.equal(passesTopicRule('Where the Fight Stands'), false);
  assert.equal(passesTopicRule('Where the Fight Stands', { statehoodOrg: false }), false);
  assert.equal(passesTopicRule('Where the Fight Stands', { statehoodOrg: 'DC Vote' }), false);
  assert.equal(passesTopicRule('Where the Fight Stands', { source: 'DC Vote' }), false);
  // A source label alone earns nothing.
  assert.deepEqual(applyTopicRule([{ title: 'Where the Fight Stands', source: 'DC Vote', link: 'https://example.org/x' }]).kept, []);
  // The name is configuration, not part of the rule.
  const source = readFileSync(new URL('../news/relevance-rules.mjs', import.meta.url), 'utf8');
  const code = source.split('\n').filter((line) => !/^\s*(\/\/|\*|\/\*)/.test(line)).join('\n');
  assert.doesNotMatch(code, /DC Vote/);
});

test('topic rule: whole words, any case, entities decoded, stems where the lexicon says so', () => {
  const pass = (title) => passesTopicRule(title);
  // Case and stems.
  for (const title of ['HOME RULE under threat', 'D.C. self-government at 50', 'A fight over self-governance', 'District autonomy on the line', 'Residents disenfranchised again', 'Plan would federalize the police', 'Federally funded and locally run', 'Budget riders return', 'A rider on needle exchange', 'House GOP targets D.C.', 'H.R. 51 gets a hearing', 'S. 51 reintroduced', 'Delegate-elect lays out a plan', 'Taxation without a vote', 'The 51st state question', 'Feds move in', 'Shadow senator sworn in', 'Senators press the mayor']) {
    assert.equal(pass(title), true, `must pass: ${title}`);
  }
  // Apostrophes, straight, curly and entity-encoded.
  assert.equal(pass("Trump's plan for the city"), true);
  assert.equal(pass('Trump’s plan for the city'), true);
  assert.equal(pass('Trump&#8217;s plan for the city'), true);
  assert.equal(pass('D.C.&#8217;s home&nbsp;rule fight'), true);
  // Whole words only: a lexicon word inside another word does not count.
  for (const title of ['Trumpet player wins award', 'Preoccupations of a city', 'Outriders tour kicks off', 'A senatorial candidate drops out', 'Confederal ideas in history', 'Delegates gather for the convention', 'Housebill Brewing opens downtown']) {
    assert.equal(pass(title), false, `must not pass: ${title}`);
  }
  // Deliberately absent from the lexicon.
  assert.equal(pass('The president visits a school'), false);
  assert.equal(pass('Presidential motorcade snarls traffic'), false);
  // Not a string: blocked, never a throw.
  for (const title of [undefined, null, 42, {}]) assert.equal(pass(title), false);
});

test('topic rule: only ever removes from the model\'s yes list', () => {
  const article = ([title, source], i) => ({ title, source, link: `https://example.org/${i}`, _statehoodOrg: ORG_FEEDS.has(source) });
  const yes = [...BLOCKED, ...KEPT].map(article);
  const { kept, blocked } = applyTopicRule(yes);
  assert.equal(kept.length, KEPT.length);
  assert.equal(blocked.length, BLOCKED.length);
  assert.deepEqual([...kept, ...blocked].map((a) => a.link).sort(), yes.map((a) => a.link).sort(), 'every yes is in exactly one list');
  assert.ok(kept.every((a) => yes.includes(a)), 'nothing is added or rewritten');
  assert.deepEqual(applyTopicRule([]), { kept: [], blocked: [] });
});

const DAY = 24 * 60 * 60 * 1000;
const T0 = new Date('2026-11-21T06:17:00Z').getTime();
const SOURCES = [{ source: 'The 51st', status: 'ok', maxAgeDays: 30 }];
const MEDICAID = { title: BLOCKED.at(-2)[0], source: 'The 51st', link: 'https://51st.news/medicaid/', pubDate: new Date(T0 - DAY).toUTCString(), _statehoodOrg: false };

/** One run as fetch-news.mjs makes it: the model's yes list, then the rule, then memory. */
function ruledRun(archive, { feed, modelYes, now }) {
  const { kept } = applyTopicRule(modelYes);
  const result = applyRun(archive, { candidates: feed, relevantLinks: kept.map((a) => a.link), sourceResults: SOURCES, now, keepPending: keepPendingByTopicRule });
  parseArchive(JSON.stringify(result.archive));
  return result;
}

test('pending: an entry whose stored headline the rule blocks is dropped on the next run and never confirmed', () => {
  // Before the rule existed: one model yes, so it is pending on the branch (as two
  // entries were on the live site when the rule was written).
  let archive = applyRun(emptyArchive(), { candidates: [MEDICAID], relevantLinks: [MEDICAID.link], sourceResults: SOURCES, now: T0 }).archive;
  assert.equal(archive.pending[0].yes, 1);

  // Every later run: the model says yes again and the rule blocks it.
  for (let i = 1; i <= 6; i += 1) {
    const result = ruledRun(archive, { feed: [MEDICAID], modelYes: [MEDICAID], now: T0 + (i * DAY) / 2 });
    assert.deepEqual(result.articles, [], 'off the page from the first run under the rule');
    assert.deepEqual(result.archive.pending, [], 'the stored entry is removed, not left to age');
    assert.deepEqual(result.archive.items, []);
    archive = result.archive;
  }
  // Also removed when the link has simply left the feeds.
  const stale = applyRun(emptyArchive(), { candidates: [MEDICAID], relevantLinks: [MEDICAID.link], sourceResults: SOURCES, now: T0 }).archive;
  assert.deepEqual(ruledRun(stale, { feed: [], modelYes: [], now: T0 + DAY }).archive.pending, []);
});

test('pending: a blocked stored headline is never confirmed, even when a later rewrite passes on its first appearance', () => {
  const stored = applyRun(emptyArchive(), { candidates: [MEDICAID], relevantLinks: [MEDICAID.link], sourceResults: SOURCES, now: T0 }).archive;
  // The outlet rewrites the headline into one the rule accepts. Same link.
  const rewritten = { ...MEDICAID, title: 'Congress moves to block D.C. Medicaid changes' };
  assert.equal(passesTopicRule(rewritten.title), true);

  const first = ruledRun(stored, { feed: [rewritten], modelYes: [rewritten], now: T0 + DAY / 2 });
  assert.deepEqual(first.archive.items, [], 'the old yes was for the blocked wording and does not count');
  assert.deepEqual(first.archive.pending.map((p) => [p.title, p.yes]), [[rewritten.title, 1]]);
  assert.deepEqual(first.articles.map((a) => a.title), [rewritten.title], 'shown on this run\'s verdict, as any new article is');

  // The same check with no pruning at all: the headline change alone restarts the count.
  const unpruned = applyRun(stored, { candidates: [rewritten], relevantLinks: [rewritten.link], sourceResults: SOURCES, now: T0 + DAY / 2 });
  assert.deepEqual(unpruned.archive.items, []);
  assert.deepEqual(unpruned.archive.pending.map((p) => [p.title, p.yes]), [[rewritten.title, 1]]);

  // A second yes for the SAME wording confirms it, under that wording.
  const second = ruledRun(first.archive, { feed: [rewritten], modelYes: [rewritten], now: T0 + DAY });
  assert.deepEqual(second.archive.items.map((i) => i.title), [rewritten.title]);
});

test('pending: one link, two headlines: the count restarts, so the confirmed text has had two yeses itself', () => {
  const v1 = { title: 'House panel weighs D.C. home rule bill', source: 'The 51st', link: 'https://51st.news/home-rule-bill/', pubDate: new Date(T0 - DAY).toUTCString(), _statehoodOrg: false };
  const v2 = { ...v1, title: 'House panel advances D.C. home rule bill' };

  const run1 = ruledRun(emptyArchive(), { feed: [v1], modelYes: [v1], now: T0 });
  assert.deepEqual(run1.archive.pending.map((p) => [p.title, p.yes]), [[v1.title, 1]]);

  // Second yes, but for a different headline: not confirmed.
  const run2 = ruledRun(run1.archive, { feed: [v2], modelYes: [v2], now: T0 + DAY / 2 });
  assert.deepEqual(run2.archive.items, []);
  assert.deepEqual(run2.archive.pending.map((p) => [p.title, p.yes]), [[v2.title, 1]]);
  assert.equal(run2.archive.pending[0].firstSeen, new Date(T0).toISOString(), 'firstSeen still dates the link');

  // Flipping back restarts it again.
  const run3 = ruledRun(run2.archive, { feed: [v1], modelYes: [v1], now: T0 + DAY });
  assert.deepEqual(run3.archive.items, []);
  assert.equal(run3.archive.pending[0].yes, 1);

  // Two yeses in a row for one wording: confirmed, with that wording and the first date.
  const run4 = ruledRun(run3.archive, { feed: [v1], modelYes: [v1], now: T0 + 1.5 * DAY });
  assert.deepEqual(run4.archive.items.map((i) => [i.title, i.firstSeen]), [[v1.title, new Date(T0).toISOString()]]);
  // Once confirmed, a later rewrite changes nothing: confirmed items are never rewritten.
  const run5 = ruledRun(run4.archive, { feed: [v2], modelYes: [], now: T0 + 2 * DAY });
  assert.deepEqual(run5.archive.items, run4.archive.items);
});

test('pending: an organisation\'s entry is kept through the feed flag, never through its label', () => {
  const post = { title: 'Where the Fight Stands', source: 'DC Vote', link: 'https://www.dcvote.org/where/', pubDate: new Date(T0 - DAY).toUTCString(), _statehoodOrg: true };
  const run1 = ruledRun(emptyArchive(), { feed: [post], modelYes: [post], now: T0 });
  assert.equal(run1.archive.pending.length, 1);
  assert.equal('_statehoodOrg' in run1.archive.pending[0], false);
  const run2 = ruledRun(run1.archive, { feed: [post], modelYes: [post], now: T0 + DAY / 2 });
  assert.deepEqual(run2.archive.items.map((i) => i.link), [post.link], 'kept and confirmed while its feed still lists it');
  assert.doesNotMatch(JSON.stringify([run2.archive, run2.articles]), /_statehoodOrg|_ts/);

  // The same stored entry, but this run's copy of the link is NOT from a flagged feed
  // (it only carries the label): dropped.
  const impostor = { ...post, _statehoodOrg: false };
  assert.deepEqual(ruledRun(run1.archive, { feed: [impostor], modelYes: [impostor], now: T0 + DAY / 2 }).archive.items, []);
  assert.equal(keepPendingByTopicRule(run1.archive.pending[0], null), false, 'and on its title alone once the link has left the feeds');
});

test('topic rule: an article already confirmed in the archive is untouched', () => {
  // Confirmed before the rule existed, with a headline the rule would block today.
  const old = { title: 'Three Things to Know When Voting in D.C.', source: 'The 51st', link: 'https://example.org/three-things/', pubDate: new Date(T0 - DAY).toUTCString() };
  const first = applyRun(emptyArchive(), { candidates: [old], relevantLinks: [old.link], sourceResults: SOURCES, now: T0 - DAY });
  const confirmed = applyRun(first.archive, { candidates: [old], relevantLinks: [old.link], sourceResults: SOURCES, now: T0 - DAY / 2 }).archive;
  assert.equal(passesTopicRule(old.title), false);
  // A run after the rule: nothing judged relevant, and the confirmed item is still there.
  const after = ruledRun(confirmed, { feed: [old], modelYes: [], now: T0 });
  assert.deepEqual(after.archive.items, confirmed.items);
  assert.deepEqual(after.articles.map((a) => a.link), [old.link]);
});

// ── The organisation flag comes from the feed configuration, through the real fetch ──

const rss = (items) =>
  `<?xml version="1.0"?><rss version="2.0"><channel><title>t</title>${items
    .map((i) => `<item><title>${i.title}</title><link>${i.link}</link><pubDate>${new Date(T0 - DAY).toUTCString()}</pubDate>${i.sourceTag ? `<source url="https://x.org">${i.sourceTag}</source>` : ''}</item>`)
    .join('')}</channel></rss>`;

async function fetchWith(routes, feeds) {
  const real = globalThis.fetch;
  globalThis.fetch = async (url) => ({ ok: true, status: 200, text: async () => routes[String(url)] });
  try {
    return await fetchAllFeeds(feeds, T0);
  } finally {
    globalThis.fetch = real;
  }
}

test('org flag: an item labelled "DC Vote" by a <source> tag in another feed gets no exemption', async () => {
  const other = FEEDS.find((f) => f.source === 'The 51st');
  const { articles } = await fetchWith({ [other.url]: rss([{ title: 'Where the Fight Stands', link: 'https://51st.news/fight/', sourceTag: 'DC Vote' }]) }, [other]);
  assert.equal(articles[0].source, 'DC Vote', 'the label really is spoofed');
  assert.equal(articles[0]._statehoodOrg, false);
  assert.deepEqual(applyTopicRule(articles), { kept: [], blocked: articles });
});

test('org flag: a DC Vote feed item keeps its exemption whatever its <source> label says', async () => {
  const dcVote = FEEDS.find((f) => f.statehoodOrg === true);
  const { articles } = await fetchWith({ [dcVote.url]: rss([{ title: 'Where the Fight Stands', link: 'https://www.dcvote.org/fight/', sourceTag: 'Some Other Outlet' }, { title: 'A plain post', link: 'https://www.dcvote.org/plain/' }]) }, [dcVote]);
  assert.deepEqual(articles.map((a) => [a.source, a._statehoodOrg]), [['Some Other Outlet', true], ['DC Vote', true]]);
  assert.deepEqual(applyTopicRule(articles).blocked, []);
  // And the flag stops at memory and the page: neither ever carries it.
  const result = applyRun(emptyArchive(), { candidates: articles, relevantLinks: articles.map((a) => a.link), sourceResults: SOURCES, now: T0, keepPending: keepPendingByTopicRule });
  assert.doesNotMatch(JSON.stringify(result), /_statehoodOrg/);
  assert.deepEqual(Object.keys(result.articles[0]), ['title', 'link', 'pubDate', 'source']);
});

// ── No dashes in the summary ────────────────────────────────────────────────────────

const PROSE = 'A senator pledged to prioritize D.C. statehood, while advocacy groups urged a House committee to reject new limits on the District';

test('G3: an em-dash or an en-dash used as punctuation fails the format gate', () => {
  assert.equal(checkFormat(`${PROSE}.`).pass, true);
  for (const body of [
    `${PROSE} — and the mayor agreed.`,
    `${PROSE}—and the mayor agreed.`,
    `${PROSE} – and the mayor agreed.`,
    `${PROSE}–and the mayor agreed.`,
    `Advocates – led by DC Vote – pressed their case as ${PROSE}.`,
    `${PROSE}, covering 2024 – 2026.`,
    `${PROSE}, from 2024–present.`,
  ]) {
    const result = checkFormat(body);
    assert.equal(result.pass, false, `must fail: ${body}`);
    assert.match(result.detail, /em-dash or en-dash/);
  }
});

test('G3: an en-dash between digits is a range and passes; hyphens are untouched', () => {
  assert.equal(checkFormat(`${PROSE}, citing the 1874–1967 period.`).pass, true);
  assert.equal(checkFormat(`${PROSE} after a 214–209 vote.`).pass, true);
  assert.equal(checkFormat(`${PROSE} in a 214-209 vote on a long-running, home-rule dispute.`).pass, true);
  // An em-dash is never a range.
  assert.equal(checkFormat(`${PROSE}, citing the 1874—1967 period.`).pass, false);
});

test('summary prompt: tells the model not to use dashes, under a new prompt version', async () => {
  let prompt = '';
  const client = {
    messages: {
      create: async ({ messages }) => {
        prompt = messages[0].content;
        return { content: [{ text: `${PROSE}.\nCLOSER: laws` }], stop_reason: 'end_turn', usage: {} };
      },
    },
  };
  await summarizeArticles(client, [{ title: 'House votes on D.C. bill', source: 'The 51st', pubDate: '2026-11-20T12:00:00Z' }]);
  assert.match(prompt, /\n- Do not use em-dashes or en-dashes\. Use commas, periods or parentheses instead\.\n/);
  assert.equal(PROMPT_VERSION, '2026-11-21.1');
});

test('closers: no vetted closing sentence contains a dash', () => {
  // The closer is appended after G3 runs, so it is checked here instead.
  for (const key of CLOSER_KEYS) assert.doesNotMatch(closerFor(key).text, /[—–]/, `closer "${key}"`);
});
