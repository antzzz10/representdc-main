/**
 * Tests for "Add a news link": scripts/news/hand-link.mjs (the rules), the real
 * scripts/news/add-link.mjs (run as a child process), and its workflow file.
 *
 * Three layers, all offline:
 *   - the pure functions, with a fixed clock;
 *   - real pushes to a local bare repo through publishFeed (retry, withholding, a missing
 *     archive), as race.test.mjs does;
 *   - the real add-link script and the real scan script against one bare repo, using the
 *     main-path harness (fixtures/main-path-preload.mjs): a link is added by hand, then a
 *     scan runs, and the link must still be there, never having been sent to the
 *     relevance filter.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateHandLink, composeHandLink, assertFeedShape, windowDaysBySource, HAND_LINK_DECISION, MAX_TITLE_LENGTH, MAX_SOURCE_LENGTH, MAX_LINK_LENGTH } from '../news/hand-link.mjs';
import { publishFeed, verifyLive } from '../news/publish.mjs';
import { applyRun, emptyArchive, parseArchive, assertArchiveOnlyGrows, archiveMarker, ArchiveError, ARCHIVE_PATH } from '../news/archive.mjs';
import { MAX_ARTICLES, isHttpsUrl, checkArticles } from '../news/gates.mjs';
import { FEEDS, NEWSLETTERS } from '../news/feeds.mjs';

const DAY = 24 * 60 * 60 * 1000;
const T0 = new Date('2026-11-23T15:00:00Z').getTime();
const iso = (ms) => new Date(ms).toISOString();
const GOOD = { link: 'https://apnews.com/article/dc-statehood-senate', title: 'Senate panel weighs D.C. statehood bill', source: 'AP', date: '2026-11-22' };
const JUDGE_PASS = { judge: 'pass', judgeVersion: 'test' };
const SOURCES = [{ source: 'The 51st', status: 'ok', maxAgeDays: 30 }];

// ── The rules for what may be typed in ──────────────────────────────────────────────

test('validation: a good link is accepted, cleaned up, and dated at noon UTC on its day', () => {
  const result = validateHandLink({ ...GOOD, title: '  Senate panel weighs  D.C.&#8217;s statehood bill ', source: ' AP ' }, T0);
  assert.equal(result.ok, true, result.errors.join('; '));
  assert.deepEqual(result.entry, {
    link: GOOD.link,
    host: 'apnews.com',
    title: 'Senate panel weighs D.C.’s statehood bill',
    source: 'AP',
    pubDate: '2026-11-22T12:00:00.000Z',
  });
});

test('validation: a blank date is today in Washington, and a stored date is never later than now', () => {
  // 15:00 UTC is 10 a.m. in Washington on the same day: noon UTC has passed, so noon it is.
  assert.equal(validateHandLink({ ...GOOD, date: undefined }, T0).entry.pubDate, '2026-11-23T12:00:00.000Z');
  assert.equal(validateHandLink({ ...GOOD, date: '' }, T0).entry.pubDate, '2026-11-23T12:00:00.000Z');
  assert.equal(validateHandLink({ ...GOOD, date: '   ' }, T0).entry.pubDate, '2026-11-23T12:00:00.000Z');
});

test('validation: the day boundary. Her own "today" is never refused, and tomorrow always is', () => {
  // 8 p.m. Monday 23 November in Washington is 01:00 UTC on Tuesday the 24th.
  const evening = new Date('2026-11-24T01:00:00Z').getTime();
  const at = (date, now = evening) => validateHandLink({ ...GOOD, date }, now);

  // Left blank: Washington's today, the 23rd, not UTC's 24th.
  assert.equal(at(undefined).entry.pubDate, '2026-11-23T12:00:00.000Z');
  // She types her today: accepted, not refused as "yesterday" or adjusted.
  assert.equal(at('2026-11-23').entry.pubDate, '2026-11-23T12:00:00.000Z');
  // She types the UTC date (a story already dated the 24th by a UTC-stamped site):
  // accepted, and stored as this instant because noon UTC on the 24th is still ahead.
  assert.equal(at('2026-11-24').entry.pubDate, iso(evening));
  // Tomorrow by every clock: refused, not quietly changed.
  const tomorrow = at('2026-11-25');
  assert.equal(tomorrow.ok, false);
  assert.match(tomorrow.errors.join(), /date 2026-11-25 is in the future \(today is 2026-11-24\)/);

  // One minute before midnight UTC there is no tolerance for the next calendar day.
  const lastMinute = new Date('2026-11-23T23:59:00Z').getTime();
  assert.equal(at('2026-11-24', lastMinute).ok, false);
  assert.equal(at('2026-11-23', lastMinute).entry.pubDate, '2026-11-23T12:00:00.000Z');
  // One minute after, it is today.
  const firstMinute = new Date('2026-11-24T00:01:00Z').getTime();
  assert.equal(at('2026-11-24', firstMinute).entry.pubDate, iso(firstMinute));
  // Whatever is stored is never ahead of the clock, so G4 never sees a future article.
  for (const [date, now] of [['2026-11-24', evening], ['2026-11-23', evening], ['2026-11-24', firstMinute], [undefined, evening]]) {
    const { entry } = at(date, now);
    assert.ok(new Date(entry.pubDate).getTime() <= now);
    assert.equal(checkArticles([{ title: entry.title, link: entry.link, source: entry.source, pubDate: entry.pubDate }], null, now).pass, true);
  }
  // Summer time: 9 p.m. in Washington on 30 June is 01:00 UTC on 1 July.
  const summer = new Date('2026-07-01T01:00:00Z').getTime();
  assert.equal(at(undefined, summer).entry.pubDate, '2026-06-30T12:00:00.000Z');
});

test('validation: deceptive and odd links are refused, with the real host named', () => {
  const errorsFor = (link) => validateHandLink({ ...GOOD, link }, T0).errors.join(' | ');
  // A username part: reads as AP, goes to evil.example.
  assert.match(errorsFor('https://apnews.com@evil.example/a'), /username or password part before an @ sign; it really goes to evil\.example/);
  assert.match(errorsFor('https://apnews.com:443@evil.example/a'), /really goes to evil\.example/);
  assert.match(errorsFor('https://user:pass@apnews.com/a'), /username or password/);
  // The shared check refuses them too, so no feed item or archive entry can carry one.
  assert.equal(isHttpsUrl('https://apnews.com@evil.example/a'), false);
  assert.equal(isHttpsUrl('https://user:pass@apnews.com/a'), false);
  assert.equal(isHttpsUrl('https://apnews.com/a?to=someone@example.org'), true, 'an @ later in the address is fine');
  // IP addresses, in every spelling the URL parser understands, and bare host names.
  for (const link of ['https://127.0.0.1/a', 'https://192.168.1.10/story', 'https://2130706433/a', 'https://0x7f.1/a', 'https://[::1]/a', 'https://[2001:db8::1]/a']) {
    assert.match(errorsFor(link), /bare network address/, link);
  }
  for (const link of ['https://localhost/a', 'https://intranet/story', 'https://apnews/a']) assert.match(errorsFor(link), /not a full website name/, link);
  // Too long.
  const long = `https://apnews.com/${'a'.repeat(MAX_LINK_LENGTH)}`;
  assert.match(errorsFor(long), new RegExp(`link is ${long.length} characters; the limit is 2000`));
  assert.equal(validateHandLink({ ...GOOD, link: `https://apnews.com/${'a'.repeat(MAX_LINK_LENGTH - 19)}` }, T0).ok, true, 'exactly 2,000 is allowed');
  // Whitespace and control characters, which the URL parser would silently strip.
  for (const link of ['https://apnews.com/a b', 'https://apnews.com/a\tb', 'https://ap\nnews.com/a', 'https://apnews.com/a\u0007']) {
    assert.match(errorsFor(link), /space or control character/, JSON.stringify(link));
  }
  // A look-alike domain is a valid address and cannot be refused. What protects the
  // owner is that the real host is returned, and printed on its own line by the script.
  const lookalike = validateHandLink({ ...GOOD, link: 'https://apnews.com.evil.example/article/x' }, T0);
  assert.equal(lookalike.ok, true);
  assert.equal(lookalike.entry.host, 'apnews.com.evil.example');
  assert.equal(validateHandLink({ ...GOOD, link: 'https://xn--pnews-3ve.com/a' }, T0).entry.host, 'xn--pnews-3ve.com');
});

test('validation: control characters and tags hidden in entities are caught after decoding', () => {
  const errorsFor = (change) => validateHandLink({ ...GOOD, ...change }, T0).errors.join(' | ');
  assert.match(errorsFor({ title: 'Hi&#7;there' }), /title has a line break or other control character/);
  assert.match(errorsFor({ title: 'Hi&#x7;there' }), /control character/);
  assert.match(errorsFor({ title: 'Line&#10;break' }), /control character/);
  assert.match(errorsFor({ source: 'AP&#27;[31m' }), /source has a line break or other control character/);
  assert.match(errorsFor({ source: 'AP&#x1b;[0m' }), /control character/);
  assert.match(errorsFor({ title: 'Double &amp;#7; escaped' }), /control character/);
  assert.match(errorsFor({ source: '&#60;b&#62;AP' }), /source looks like it contains HTML/);
  // Ordinary entities still decode to ordinary text.
  assert.equal(validateHandLink({ ...GOOD, title: 'Q&amp;A: D.C.&#8217;s delegate &#8211; in her words' }, T0).entry.title, 'Q&A: D.C.\u2019s delegate \u2013 in her words');
});

test('validation: every rule, one bad field at a time', () => {
  const bad = (change, pattern) => {
    const result = validateHandLink({ ...GOOD, ...change }, T0);
    assert.equal(result.ok, false, `must refuse ${JSON.stringify(change)}`);
    assert.equal(result.entry, null);
    assert.match(result.errors.join(' | '), pattern, JSON.stringify(change));
  };
  // Link: the same isHttpsUrl the scan's G4 uses.
  for (const link of ['http://apnews.com/a', 'https://', 'apnews.com/a', 'javascript:alert(1)', '', undefined, 42]) bad({ link }, /link must be a full https address/);
  bad({ link: 'https://apnews.com/a b' }, /space or control character/);
  // Title.
  for (const title of ['', '   ', undefined, null, 42]) bad({ title }, /title is (empty|missing)/);
  bad({ title: 'x'.repeat(MAX_TITLE_LENGTH + 1) }, /title is 201 characters; the limit is 200/);
  bad({ title: 'Line one\nline two' }, /title has a line break or other control character/);
  bad({ title: 'Tab\there' }, /control character/);
  bad({ title: 'Bell\u0007' }, /control character/);
  for (const title of ['<b>Bold</b> move', 'Hello <script>alert(1)</script>', '&lt;img src=x&gt; headline', 'A <!-- note --> here', '</a> stray']) bad({ title }, /title looks like it contains HTML/);
  // Source.
  for (const source of ['', '  ', undefined]) bad({ source }, /source is (empty|missing)/);
  bad({ source: 'x'.repeat(MAX_SOURCE_LENGTH + 1) }, /source is 61 characters; the limit is 60/);
  bad({ source: '<i>AP</i>' }, /source looks like it contains HTML/);
  bad({ source: 'AP\r\n' }, /source has a line break/);
  // Date.
  for (const date of ['yesterday', '11/22/2026', '2026-13-01', '2026-02-31', '2026-11-2', '20261122']) bad({ date }, /date must be a real day written YYYY-MM-DD/);
  bad({ date: '2026-11-25' }, /date 2026-11-25 is in the future/);
  // Exactly at the limits is fine, and so are a less-than sign and an ampersand in prose.
  assert.equal(validateHandLink({ ...GOOD, title: 'x'.repeat(MAX_TITLE_LENGTH), source: 'y'.repeat(MAX_SOURCE_LENGTH) }, T0).ok, true);
  assert.equal(validateHandLink({ ...GOOD, title: 'Turnout < 30% in Ward 8, AP & others report' }, T0).ok, true);
  // Several problems are all reported at once.
  assert.equal(validateHandLink({ link: 'x', title: '', source: '', date: 'x' }, T0).errors.length, 4);
});

test('validation: an old date is allowed (it goes in the record, not on the page)', () => {
  const old = validateHandLink({ ...GOOD, date: '2026-08-01' }, T0);
  assert.equal(old.ok, true);
  assert.equal(old.entry.pubDate, '2026-08-01T12:00:00.000Z');
});

// ── What adding a link writes ───────────────────────────────────────────────────────

const story = (id, daysOld) => ({ title: `Statehood story ${id}`, link: `https://example.org/${id}`, pubDate: new Date(T0 - daysOld * DAY).toUTCString(), source: 'The 51st' });
const entryFor = (input = GOOD, now = T0) => validateHandLink(input, now).entry;

/** A branch state: `confirmed` stories confirmed by two runs, `unconfirmed` shown on one yes. */
function branchState({ confirmed = [], unconfirmed = [], summary = 'Judged summary.' } = {}) {
  const all = [...confirmed, ...unconfirmed];
  const first = applyRun(emptyArchive(), { candidates: all, relevantLinks: confirmed.map((a) => a.link), sourceResults: SOURCES, now: T0 - DAY });
  const second = applyRun(first.archive, { candidates: all, relevantLinks: all.map((a) => a.link), sourceResults: SOURCES, now: T0 - DAY / 2 });
  const feed = {
    runId: 'scan-1',
    lastUpdated: iso(T0 - DAY / 2),
    summary,
    summarySource: summary ? { closerKey: 'laws', closerSource: 'https://example.org/crs' } : null,
    summaryCheck: summary ? JUDGE_PASS : null,
    summaryDecision: summary ? 'judge-pass' : 'no-articles',
    articles: second.articles,
    newsletters: [{ title: 'Full Rights Update', link: 'https://lwvdc.substack.com/p/one', pubDate: iso(T0 - 2 * DAY), source: 'League of Women Voters DC' }],
    archive: archiveMarker(second.archive),
  };
  return { feed, archive: second.archive };
}

test('add: a new confirmed item marked as added by hand, shown in date order, summary removed', () => {
  const { feed, archive } = branchState({ confirmed: [story('a', 3)], unconfirmed: [story('u', 0.5)] });
  const out = composeHandLink({ current: feed, currentArchive: archive, entry: entryFor(), now: T0, id: 'add-link-test' });

  assert.equal(out.status, 'added');
  assert.deepEqual(out.archive.items.at(-1), {
    link: GOOD.link,
    title: GOOD.title,
    source: 'AP',
    pubDate: '2026-11-22T12:00:00.000Z',
    firstSeen: iso(T0),
    confirmedAt: iso(T0),
    addedBy: 'hand',
  });
  // The archive is still one every reader accepts, and it only grew.
  parseArchive(JSON.stringify(out.archive));
  assert.doesNotThrow(() => assertArchiveOnlyGrows(archive, out.archive));
  assert.deepEqual(out.archive.pending, archive.pending);
  assert.deepEqual(out.archive.feedHealth, archive.feedHealth);

  // The page list: the unconfirmed item from the last scan is kept, newest first.
  assert.deepEqual(out.feed.articles.map((a) => a.link), ['https://example.org/u', GOOD.link, 'https://example.org/a']);
  assert.deepEqual(Object.keys(out.feed.articles[1]), ['title', 'link', 'pubDate', 'source'], 'the published article does not carry addedBy');
  assert.equal(out.shows, true);

  // The summary was judged against the old list, so it does not publish beside the new one.
  assert.equal(out.displayedChanged, true);
  assert.equal(out.summaryDropped, true);
  assert.equal(out.feed.summary, null);
  assert.equal(out.feed.summaryCheck, null);
  assert.equal(out.feed.summarySource, null);
  assert.equal(out.feed.summaryDecision, HAND_LINK_DECISION);
  assert.equal(HAND_LINK_DECISION, 'link-added-by-hand');

  // Left alone: the scan's id and time, the newsletters, everything else.
  assert.equal(out.feed.runId, 'scan-1');
  assert.equal(out.feed.lastUpdated, feed.lastUpdated);
  assert.deepEqual(out.feed.newsletters, feed.newsletters);
  assert.deepEqual(out.feed.handAdded, { id: 'add-link-test', at: iso(T0), link: GOOD.link });
});

test('add: a link already in the archive changes nothing', () => {
  const { feed, archive } = branchState({ confirmed: [story('a', 3)] });
  const once = composeHandLink({ current: feed, currentArchive: archive, entry: entryFor(), now: T0, id: 'x' });
  const again = composeHandLink({ current: once.feed, currentArchive: once.archive, entry: entryFor({ ...GOOD, title: 'Another headline for the same link' }), now: T0 + 1000, id: 'y' });
  assert.deepEqual(again, { status: 'already-there', feed: null, archive: null, displayedChanged: false, shows: false, summaryDropped: false });
  // Also true for a link the scan itself confirmed.
  const scanned = composeHandLink({ current: feed, currentArchive: archive, entry: entryFor({ ...GOOD, link: 'https://example.org/a' }), now: T0, id: 'z' });
  assert.equal(scanned.status, 'already-there');
});

test('add: a pending link is promoted, keeping its firstSeen, under the hand-typed title', () => {
  const pendingStory = { ...story('p', 1), link: GOOD.link, title: 'Scan saw it under this headline' };
  const { feed, archive } = branchState({ confirmed: [story('a', 3)], unconfirmed: [pendingStory] });
  assert.deepEqual(archive.pending.map((p) => p.link), [GOOD.link]);
  const firstSeen = archive.pending[0].firstSeen;

  const out = composeHandLink({ current: feed, currentArchive: archive, entry: entryFor(), now: T0, id: 'x' });
  assert.equal(out.status, 'promoted');
  assert.deepEqual(out.archive.pending, []);
  const item = out.archive.items.find((i) => i.link === GOOD.link);
  assert.equal(item.firstSeen, firstSeen);
  assert.equal(item.confirmedAt, iso(T0));
  assert.equal(item.addedBy, 'hand');
  assert.equal(item.title, GOOD.title);
  // One copy on the page, the confirmed one.
  assert.deepEqual(out.feed.articles.filter((a) => a.link === GOOD.link).map((a) => a.title), [GOOD.title]);
  parseArchive(JSON.stringify(out.archive));
});

test('add: an article older than the window is archived, not shown, and the summary stays', () => {
  const { feed, archive } = branchState({ confirmed: [story('a', 3)] });
  const out = composeHandLink({ current: feed, currentArchive: archive, entry: entryFor({ ...GOOD, date: '2026-09-01' }), now: T0, id: 'x' });
  assert.equal(out.status, 'added');
  assert.equal(out.shows, false);
  assert.equal(out.displayedChanged, false);
  assert.equal(out.summaryDropped, false);
  assert.deepEqual(out.feed.articles, feed.articles);
  assert.equal(out.feed.summary, 'Judged summary.');
  assert.deepEqual(out.feed.summaryCheck, JUDGE_PASS);
  assert.equal(out.feed.summaryDecision, 'judge-pass');
  assert.equal(out.archive.items.at(-1).pubDate, '2026-09-01T12:00:00.000Z');
});

test('add: below the cap of 15 the list and the summary are unchanged', () => {
  const full = Array.from({ length: MAX_ARTICLES }, (_, i) => story(`c${i}`, i * 0.1 + 0.1));
  const { feed, archive } = branchState({ confirmed: full });
  assert.equal(feed.articles.length, MAX_ARTICLES);
  // Ten days old: inside the window, but older than all fifteen on the page.
  const out = composeHandLink({ current: feed, currentArchive: archive, entry: entryFor({ ...GOOD, date: '2026-11-13' }), now: T0, id: 'x' });
  assert.equal(out.shows, false);
  assert.equal(out.feed.summary, 'Judged summary.');
  assert.equal(out.feed.articles.length, MAX_ARTICLES);
  // A newer one pushes the oldest off, and the summary goes.
  const newer = composeHandLink({ current: feed, currentArchive: archive, entry: entryFor(), now: T0, id: 'x' });
  assert.equal(newer.feed.articles.length, MAX_ARTICLES);
  assert.equal(newer.shows, true);
  assert.equal(newer.feed.summary, null);
});

test('add: a source with its own longer window (an org feed) is honoured', () => {
  assert.equal(windowDaysBySource()['DC Vote'], 60);
  const { feed, archive } = branchState();
  const forty = iso(T0 - 40 * DAY).slice(0, 10);
  const org = composeHandLink({ current: feed, currentArchive: archive, entry: entryFor({ ...GOOD, source: 'DC Vote', date: forty }), now: T0, id: 'x' });
  assert.equal(org.shows, true);
  const other = composeHandLink({ current: feed, currentArchive: archive, entry: entryFor({ ...GOOD, date: forty }), now: T0, id: 'x' });
  assert.equal(other.shows, false);
});

test('add: a malformed api/news.json is refused, not rebuilt', () => {
  const { feed, archive } = branchState({ confirmed: [story('a', 3)], unconfirmed: [story('u', 0.5)] });
  const article = feed.articles[0];
  const malformed = {
    'articles missing': (({ articles: _gone, ...rest }) => rest)(feed),
    'articles null': { ...feed, articles: null },
    'articles an object': { ...feed, articles: { 0: article } },
    'articles a string': { ...feed, articles: 'none' },
    'a null entry': { ...feed, articles: [article, null] },
    'a string entry': { ...feed, articles: ['https://example.org/a'] },
    'an object title': { ...feed, articles: [{ ...article, title: { text: 'x' } }] },
    'no title': { ...feed, articles: [{ ...article, title: '' }] },
    'an http link': { ...feed, articles: [{ ...article, link: 'http://example.org/a' }] },
    'no source': { ...feed, articles: [{ ...article, source: undefined }] },
    'an unreadable date': { ...feed, articles: [{ ...article, pubDate: 'soon' }] },
    'a numeric date': { ...feed, articles: [{ ...article, pubDate: 12345 }] },
    'newsletters an object': { ...feed, newsletters: {} },
    'newsletters a string': { ...feed, newsletters: 'none' },
  };
  for (const [name, current] of Object.entries(malformed)) {
    assert.throws(
      () => composeHandLink({ current, currentArchive: archive, entry: entryFor(), now: T0, id: 'x' }),
      /api\/news\.json on the site is not in the expected shape: .*Nothing was changed/,
      name,
    );
    // Refused even for a link that is already there: a broken feed is reported either way.
    assert.throws(() => composeHandLink({ current, currentArchive: archive, entry: entryFor({ ...GOOD, link: 'https://example.org/a' }), now: T0, id: 'x' }), /expected shape/, name);
  }
  for (const current of [[], 'feed', 42]) assert.throws(() => assertFeedShape(current), /not an object/);
  // A well-formed feed passes, with or without the optional parts.
  assert.doesNotThrow(() => assertFeedShape(feed));
  assert.doesNotThrow(() => assertFeedShape({ articles: [] }));
});

test('add: needs a feed and an archive to add to', () => {
  const { feed, archive } = branchState();
  assert.throws(() => composeHandLink({ current: null, currentArchive: archive, entry: entryFor(), now: T0, id: 'x' }), /run a scan first/);
  assert.throws(() => composeHandLink({ current: feed, currentArchive: null, entry: entryFor(), now: T0, id: 'x' }), /no archive/);
});

test('a later scan keeps a hand-added item: not re-judged, not rewritten, still displayed', () => {
  const { feed, archive } = branchState({ confirmed: [story('a', 3)] });
  const added = composeHandLink({ current: feed, currentArchive: archive, entry: entryFor(), now: T0, id: 'x' });
  const hand = added.archive.items.at(-1);
  // The link turns up in a feed on the next scan and the model would say no.
  const candidate = { title: 'A different headline', link: GOOD.link, pubDate: new Date(T0).toUTCString(), source: 'Somewhere' };
  const scan = applyRun(added.archive, { candidates: [candidate], relevantLinks: [], sourceResults: SOURCES, now: T0 + DAY / 2, keepPending: () => false });
  assert.deepEqual(scan.archive.items.at(-1), hand, 'byte for byte, addedBy included');
  assert.doesNotThrow(() => assertArchiveOnlyGrows(added.archive, scan.archive));
  assert.deepEqual(scan.articles.find((a) => a.link === GOOD.link), { title: GOOD.title, link: GOOD.link, pubDate: hand.pubDate, source: 'AP' });
  // Thirty-one days on it leaves the page and stays in the record.
  const later = applyRun(scan.archive, { candidates: [], relevantLinks: [], sourceResults: SOURCES, now: T0 + 31 * DAY });
  assert.equal(later.articles.some((a) => a.link === GOOD.link), false);
  assert.deepEqual(later.archive.items.at(-1), hand);
});

test('verifyLive: a request that never answers, or a body that never arrives, cannot outlast the deadline', async () => {
  const opts = { timeoutMs: 150, intervalMs: 10, requestTimeoutMs: 40 };
  const timed = async (fetchImpl) => {
    const started = Date.now();
    const result = await verifyLive('scan-1', { ...opts, fetchImpl });
    return { result, took: Date.now() - started };
  };

  // The connection opens and nothing ever comes back. It ignores the abort signal too.
  let calls = 0;
  let sawSignal = false;
  const hung = await timed((url, init) => {
    calls += 1;
    sawSignal = init.signal instanceof AbortSignal;
    return new Promise(() => {});
  });
  assert.deepEqual(hung.result, { live: false, lastSeen: null });
  assert.ok(hung.took < 1000, `returned in ${hung.took}ms`);
  assert.ok(calls >= 2, 'a timed-out request is "not yet": it polls again');
  assert.equal(sawSignal, true, 'each request is given an abort signal');

  // Headers arrive, the body never does.
  const stalledBody = await timed(async () => ({ ok: true, json: () => new Promise(() => {}) }));
  assert.deepEqual(stalledBody.result, { live: false, lastSeen: null });
  assert.ok(stalledBody.took < 1000, `returned in ${stalledBody.took}ms`);

  // A fetch that honours the signal is aborted, and that also just means "not yet".
  let aborted = 0;
  const polite = await timed((url, init) => new Promise((resolve, reject) => {
    init.signal.addEventListener('abort', () => { aborted += 1; reject(new Error('aborted')); });
  }));
  assert.equal(polite.result.live, false);
  assert.ok(aborted >= 1);

  // Slow at first, then fine: still found within the deadline.
  let n = 0;
  const recovers = await timed(async () => {
    n += 1;
    if (n === 1) return new Promise(() => {});
    return { ok: true, json: async () => ({ runId: 'scan-1' }) };
  });
  assert.equal(recovers.result.live, true);
});

test('verifyLive: the scan\'s check is unchanged, and a writer can look for its own mark', async () => {
  const serving = (body) => async () => ({ ok: true, json: async () => body });
  const opts = { timeoutMs: 30, intervalMs: 5 };
  assert.equal((await verifyLive('scan-1', { ...opts, fetchImpl: serving({ runId: 'scan-1' }) })).live, true);
  assert.deepEqual(await verifyLive('scan-2', { ...opts, fetchImpl: serving({ runId: 'scan-1' }) }), { live: false, lastSeen: 'scan-1' });
  const feed = { runId: 'scan-1', handAdded: { id: 'add-link-9' } };
  const mine = (body) => body?.handAdded?.id === 'add-link-9';
  assert.equal((await verifyLive('add-link-9', { ...opts, fetchImpl: serving(feed), matches: mine })).live, true);
  assert.equal((await verifyLive('add-link-9', { ...opts, fetchImpl: serving({ runId: 'scan-1' }), matches: mine })).live, false);
  // The hand edit leaves runId alone, so a scan still sees its own id.
  assert.equal((await verifyLive('scan-1', { ...opts, fetchImpl: serving(feed) })).live, true);
});

// ── Real pushes, in process ─────────────────────────────────────────────────────────

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
let scratch;

function newRemote(name, files) {
  const bare = join(scratch, `${name}.git`);
  execFileSync('git', ['init', '--bare', '-q', '-b', 'gh-pages', bare]);
  const work = join(scratch, `${name}-seed`);
  mkdirSync(join(work, 'api'), { recursive: true });
  git(work, 'init', '-q', '-b', 'gh-pages');
  git(work, 'config', 'user.email', 'test@example.com');
  git(work, 'config', 'user.name', 'Test');
  writeFileSync(join(work, 'index.html'), '<!doctype html>site\n');
  for (const [path, content] of Object.entries(files)) writeFileSync(join(work, path), typeof content === 'string' ? content : `${JSON.stringify(content, null, 2)}\n`);
  git(work, 'add', '-A');
  git(work, 'commit', '-q', '-m', 'seed');
  git(work, 'remote', 'add', 'origin', bare);
  git(work, 'push', '-q', 'origin', 'gh-pages');
  return bare;
}

function pushChange(remote, change, message) {
  const work = mkdtempSync(join(scratch, 'rival-'));
  git(work, 'clone', '-q', remote, '.');
  git(work, 'config', 'user.email', 'rival@example.com');
  git(work, 'config', 'user.name', 'Rival');
  change(work);
  git(work, 'add', '-A');
  git(work, 'commit', '-q', '-m', message);
  git(work, 'push', '-q', 'origin', 'gh-pages');
}

const published = (remote, path) => git(remote, 'show', `gh-pages:${path}`);
const head = (remote) => git(remote, 'rev-parse', 'gh-pages');

/** The add-link write, as scripts/news/add-link.mjs makes it. */
async function addThrough(remote, entry, { onApply, now = T0, id = 'add-link-test' } = {}) {
  process.env.NEWS_REMOTE = remote;
  try {
    let outcome;
    const result = await publishFeed(
      (current, currentArchive) => {
        onApply?.(current, currentArchive);
        outcome = composeHandLink({ current, currentArchive, entry, now, id });
        return outcome.status === 'already-there' ? null : { feed: outcome.feed, archive: outcome.archive };
      },
      { message: 'Add news link by hand', withArchive: true },
    );
    return { result, outcome };
  } finally {
    delete process.env.NEWS_REMOTE;
  }
}

before(() => {
  scratch = mkdtempSync(join(tmpdir(), 'add-link-'));
});
after(() => rmSync(scratch, { recursive: true, force: true }));

test('push: both files in one commit, and the marker count goes up by one', async () => {
  const { feed, archive } = branchState({ confirmed: [story('a', 3)] });
  const remote = newRemote('one-commit', { 'api/news.json': feed, [ARCHIVE_PATH]: archive });
  assert.deepEqual(JSON.parse(published(remote, 'api/news.json')).archive, { initialized: true, items: 1 });

  const { result } = await addThrough(remote, entryFor());
  assert.equal(result.pushed, true);
  assert.deepEqual(git(remote, 'show', '--name-only', '--format=', 'gh-pages').split('\n').sort(), ['api/news-archive.json', 'api/news.json']);
  assert.deepEqual(JSON.parse(published(remote, 'api/news.json')).archive, { initialized: true, items: 2 });
  assert.equal(parseArchive(published(remote, ARCHIVE_PATH)).items.at(-1).addedBy, 'hand');

  // A second go at the same link pushes nothing.
  const before = head(remote);
  const again = await addThrough(remote, entryFor());
  assert.equal(again.outcome.status, 'already-there');
  assert.equal(again.result.skipped, true);
  assert.equal(head(remote), before);
});

test('push: a withholding on the branch stays, and a judge-less summary can never ride along', async () => {
  const { feed, archive } = branchState({ confirmed: [story('a', 3)], summary: null });
  const withheld = { ...feed, withheldAt: '2026-11-23T10:05:00.000Z', withheldReason: 'wrong' };
  const remote = newRemote('withheld', { 'api/news.json': withheld, [ARCHIVE_PATH]: archive });
  await addThrough(remote, entryFor());
  const after = JSON.parse(published(remote, 'api/news.json'));
  assert.equal(after.withheldAt, '2026-11-23T10:05:00.000Z');
  assert.equal(after.withheldReason, 'wrong');
  assert.equal(after.summary, null);
  assert.ok(after.articles.some((a) => a.link === GOOD.link));
});

test('push: a rejected push re-reads the branch and adds the link on top of the rival\'s changes', async () => {
  const { feed, archive } = branchState({ confirmed: [story('a', 3)] });
  const remote = newRemote('retry', { 'api/news.json': feed, [ARCHIVE_PATH]: archive });
  const rivalStory = story('rival', 1);
  let applies = 0;

  const { result } = await addThrough(remote, entryFor(), {
    onApply: () => {
      applies += 1;
      if (applies > 1) return;
      // A scan lands between this writer's read and its push: it confirms another article
      // and publishes its own summary and runId.
      pushChange(remote, (work) => {
        const one = applyRun(archive, { candidates: [rivalStory], relevantLinks: [rivalStory.link], sourceResults: SOURCES, now: T0 - 1000 });
        const two = applyRun(one.archive, { candidates: [rivalStory], relevantLinks: [rivalStory.link], sourceResults: SOURCES, now: T0 - 500 });
        writeFileSync(join(work, ARCHIVE_PATH), `${JSON.stringify(two.archive, null, 2)}\n`);
        writeFileSync(join(work, 'api/news.json'), `${JSON.stringify({ ...feed, runId: 'scan-2', summary: 'Newer summary.', articles: two.articles, archive: archiveMarker(two.archive) }, null, 2)}\n`);
      }, 'rival scan');
    },
  });

  assert.equal(result.attempt, 2);
  assert.equal(applies, 2);
  const after = JSON.parse(published(remote, 'api/news.json'));
  const archived = parseArchive(published(remote, ARCHIVE_PATH));
  assert.deepEqual(archived.items.map((i) => i.link), ['https://example.org/a', rivalStory.link, GOOD.link], "the rival's confirmation and the hand-added link both survive");
  assert.equal(after.runId, 'scan-2', "built on the rival scan's feed, not on stale bytes");
  assert.deepEqual(after.articles.map((a) => a.link).sort(), ['https://example.org/a', rivalStory.link, GOOD.link].sort());
  assert.equal(after.summary, null, "the rival's summary was not written about this list either");
  assert.deepEqual(after.archive, { initialized: true, items: 3 });
});

test('push: with no archive on the branch it fails closed and never bootstraps', async () => {
  const { feed, archive } = branchState();
  // Three ways the archive can be unusable.
  const cases = {
    'never-made': { 'api/news.json': { runId: 'scan-1', summary: null, articles: [] } },
    deleted: { 'api/news.json': feed },
    corrupt: { 'api/news.json': feed, [ARCHIVE_PATH]: 'not json' },
  };
  for (const [name, files] of Object.entries(cases)) {
    const remote = newRemote(`closed-${name}`, files);
    const before = head(remote);
    let applied = false;
    await assert.rejects(() => addThrough(remote, entryFor(), { onApply: () => { applied = true; } }), ArchiveError, name);
    assert.equal(applied, false, name);
    assert.equal(head(remote), before, `${name}: nothing was pushed`);
  }
  assert.ok(archive);
});

// ── The real scripts: add a link by hand, then scan ─────────────────────────────────

const ADD_SCRIPT = fileURLToPath(new URL('../news/add-link.mjs', import.meta.url));
const SCAN_SCRIPT = fileURLToPath(new URL('../fetch-news.mjs', import.meta.url));
const PRELOAD = fileURLToPath(new URL('./fixtures/main-path-preload.mjs', import.meta.url));
const HAND = { link: 'https://apnews.com/article/dc-statehood-senate-hearing', title: 'Senate panel sets hearing on D.C. statehood bill', source: 'AP' };
const FEED_STORY = { title: 'D.C. statehood bill advances in the House', link: 'https://51st.news/statehood-bill-advances/' };

const rss = (items) =>
  `<?xml version="1.0"?><rss version="2.0"><channel><title>t</title>${items
    .map((i) => `<item><title>${i.title}</title><link>${i.link}</link><pubDate>${new Date(Date.now() - DAY).toUTCString()}</pubDate></item>`)
    .join('')}</channel></rss>`;

let live;
let promptLog;
let feedsFile;
let runCount = 0;

function writeFeeds(items) {
  writeFileSync(feedsFile, JSON.stringify({ '*': 503, [FEEDS[0].url]: rss(items), [NEWSLETTERS[0].url]: 503 }));
}

function runNode(script, extraEnv = {}, remote = live) {
  runCount += 1;
  const cwd = join(scratch, `run-${runCount}`);
  mkdirSync(cwd);
  const stepSummary = join(cwd, 'step-summary.md');
  const env = { ...process.env, NEWS_REMOTE: remote, MAIN_PATH_LOG: promptLog, MAIN_PATH_FEEDS: feedsFile, ANTHROPIC_API_KEY: 'test-key-not-real', GITHUB_STEP_SUMMARY: stepSummary, ...extraEnv };
  for (const key of ['GITHUB_TOKEN', 'GITHUB_OUTPUT', 'GITHUB_RUN_ID', 'NEWS_ARCHIVE_BOOTSTRAP', 'NEWS_SUMMARY_ENABLED']) delete env[key];
  if (!('DRY_RUN' in extraEnv)) delete env.DRY_RUN;
  const result = spawnSync(process.execPath, ['--import', PRELOAD, script], { cwd, env, encoding: 'utf8', timeout: 120000 });
  return {
    status: result.status,
    out: result.stdout + result.stderr,
    stepSummary: existsSync(stepSummary) ? readFileSync(stepSummary, 'utf8') : '',
    record: existsSync(join(cwd, 'run-record.json')) ? JSON.parse(readFileSync(join(cwd, 'run-record.json'), 'utf8')) : null,
  };
}

const addEnv = (input, extra = {}) => ({ NEWS_LINK: input.link, NEWS_TITLE: input.title, NEWS_SOURCE: input.source, ...(input.date ? { NEWS_DATE: input.date } : {}), ...extra });
const prompts = () => readFileSync(promptLog, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));

test('scripts: set up a live branch with one scan', async () => {
  promptLog = join(scratch, 'prompts.jsonl');
  feedsFile = join(scratch, 'feeds.json');
  writeFileSync(promptLog, '');
  writeFeeds([FEED_STORY]);
  live = newRemote('live', {});
  process.env.NEWS_REMOTE = live;
  try {
    await publishFeed(() => ({ feed: { runId: 'bootstrap', summary: null, articles: [] }, archive: emptyArchive() }), { message: 'bootstrap', withArchive: true, bootstrap: true });
  } finally {
    delete process.env.NEWS_REMOTE;
  }
  const scan = runNode(SCAN_SCRIPT);
  assert.equal(scan.record?.outcome, 'published', scan.out);
  const feed = JSON.parse(published(live, 'api/news.json'));
  assert.ok(feed.summary, 'the scan published a summary');
  assert.deepEqual(feed.articles.map((a) => a.link), [FEED_STORY.link]);
});

test('scripts: a preview (DRY_RUN) says what would happen and changes nothing', () => {
  const before = head(live);
  const run = runNode(ADD_SCRIPT, addEnv(HAND, { DRY_RUN: '1' }));
  assert.equal(run.status, 0, run.out);
  assert.match(run.out, /Preview only\. Nothing was changed/);
  assert.match(run.out, /^Link goes to: apnews\.com$/m, 'the real host, on its own line');
  assert.match(run.stepSummary, /^Link goes to: apnews\.com$/m);
  assert.match(run.out, /It shows on the news page/);
  assert.match(run.out, /AI summary is off the page until the next scan/);
  assert.match(run.stepSummary, /Preview only/);
  assert.equal(head(live), before);
});

test('scripts: a preview names the real host of a look-alike link, and a username link is refused', () => {
  const before = head(live);
  const lookalike = runNode(ADD_SCRIPT, addEnv({ ...HAND, link: 'https://apnews.com.evil.example/article/x' }, { DRY_RUN: '1' }));
  assert.equal(lookalike.status, 0, lookalike.out);
  assert.match(lookalike.out, /^Link goes to: apnews\.com\.evil\.example$/m);
  const userinfo = runNode(ADD_SCRIPT, addEnv({ ...HAND, link: 'https://apnews.com@evil.example/a' }));
  assert.equal(userinfo.status, 1);
  assert.match(userinfo.out, /it really goes to evil\.example/);
  assert.equal(head(live), before);
});

test('scripts: bad input is refused with plain reasons, exit 1, nothing changed', () => {
  const before = head(live);
  const run = runNode(ADD_SCRIPT, addEnv({ link: 'http://apnews.com/x', title: '<b>Hi</b>', source: '' }));
  assert.equal(run.status, 1);
  assert.match(run.out, /Not added\. Please fix:/);
  assert.match(run.out, /link must be a full https address/);
  assert.match(run.out, /title looks like it contains HTML/);
  assert.match(run.out, /source is empty/);
  assert.match(run.out, /Nothing was changed/);
  assert.match(run.stepSummary, /Not added/);
  assert.equal(head(live), before);
});

test('scripts: adding a link publishes it, drops the summary, and leaves the scan\'s id alone', () => {
  const beforeFeed = JSON.parse(published(live, 'api/news.json'));
  const run = runNode(ADD_SCRIPT, addEnv(HAND));
  assert.equal(run.status, 0, run.out);
  assert.match(run.out, /Done\. The link is live/);
  assert.match(run.out, /^Link goes to: apnews\.com$/m);
  assert.match(run.stepSummary, /Done\. The link is live/);

  const feed = JSON.parse(published(live, 'api/news.json'));
  assert.deepEqual(feed.articles.map((a) => a.link).sort(), [HAND.link, FEED_STORY.link].sort(), 'the unconfirmed scan article is kept beside it');
  assert.doesNotMatch(JSON.stringify(feed.articles), /addedBy/);
  assert.equal(feed.summary, null);
  assert.equal(feed.summaryDecision, 'link-added-by-hand');
  assert.equal(feed.runId, beforeFeed.runId);
  assert.equal(feed.lastUpdated, beforeFeed.lastUpdated);
  assert.match(feed.handAdded.id, /^add-link-local-/);
  assert.deepEqual(feed.archive, { initialized: true, items: 1 });
  const archive = parseArchive(published(live, ARCHIVE_PATH));
  assert.deepEqual(archive.items.map((i) => [i.link, i.addedBy]), [[HAND.link, 'hand']]);
  assert.deepEqual(archive.pending.map((p) => p.link), [FEED_STORY.link], "the scan's pending entry is untouched");
});

test('scripts: the same link again reports "already there" and changes nothing', () => {
  const before = head(live);
  const run = runNode(ADD_SCRIPT, addEnv({ ...HAND, title: 'Typed differently this time' }));
  assert.equal(run.status, 0, run.out);
  assert.match(run.out, /Already there/);
  assert.equal(head(live), before);
});

test('scripts: the next scan keeps the hand-added link, never asks the filter about it, and writes a new summary', () => {
  // The outlet now also turns up in a feed the scan reads, under the same link.
  writeFeeds([FEED_STORY, { title: HAND.title, link: HAND.link }]);
  writeFileSync(promptLog, '');
  const scan = runNode(SCAN_SCRIPT);
  assert.equal(scan.record?.outcome, 'published', scan.out);

  const seen = prompts();
  assert.deepEqual(seen.map((p) => p.kind), ['filter', 'summary', 'judge']);
  assert.doesNotMatch(seen[0].prompt, /Senate panel sets hearing/, 'a confirmed link is not sent to the relevance filter');
  assert.match(seen[1].prompt, /Senate panel sets hearing/, 'it is one of the displayed headlines the summary is written from');
  assert.match(seen[2].prompt, /Senate panel sets hearing/, 'and the judge checks the summary against the same headlines');
  const candidate = scan.record.candidates.find((c) => c.link === HAND.link);
  assert.deepEqual([candidate.confirmed, candidate.modelRelevant, candidate.notAsked, candidate.ruleBlocked, candidate.relevant], [true, null, 'confirmed', false, true]);

  const feed = JSON.parse(published(live, 'api/news.json'));
  assert.ok(feed.summary, 'the scan wrote a new summary');
  assert.equal(feed.summaryDecision, 'judge-pass');
  assert.ok(feed.articles.some((a) => a.link === HAND.link), 'still on the page');
  assert.equal('handAdded' in feed, false, "the scan's feed is its own");
  const archive = parseArchive(published(live, ARCHIVE_PATH));
  const hand = archive.items.find((i) => i.link === HAND.link);
  assert.equal(hand.addedBy, 'hand');
  assert.equal(hand.title, HAND.title);
  assert.deepEqual(archive.items.map((i) => i.link).sort(), [HAND.link, FEED_STORY.link].sort(), 'and the scan confirmed its own article beside it');
  assert.deepEqual(feed.archive, { initialized: true, items: 2 });
});

test('scripts: a malformed feed on the site stops the script, and neither file is touched', () => {
  const { feed, archive } = branchState({ confirmed: [story('a', 3)] });
  const bare = newRemote('bad-feed', { 'api/news.json': { ...feed, articles: [feed.articles[0], null] }, [ARCHIVE_PATH]: archive });
  const before = head(bare);
  const archiveBefore = published(bare, ARCHIVE_PATH);
  const run = runNode(ADD_SCRIPT, addEnv(HAND), bare);
  assert.equal(run.status, 1);
  assert.match(run.out, /Not added\. Something went wrong:/);
  assert.match(run.out, /not in the expected shape: article 2 is not an object\. Nothing was changed/);
  assert.equal(head(bare), before);
  assert.equal(published(bare, ARCHIVE_PATH), archiveBefore, 'the archive is untouched');
});

test('scripts: saved but not live yet. The run says the link WAS saved, and ends failed like a scan\'s pushed-not-live', () => {
  for (const mode of ['stale', 'stall']) {
    const { feed, archive } = branchState({ confirmed: [story('a', 3)] });
    const bare = newRemote(`not-live-${mode}`, { 'api/news.json': feed, [ARCHIVE_PATH]: archive });
    const started = Date.now();
    const run = runNode(ADD_SCRIPT, addEnv(HAND, { MAIN_PATH_LIVE: mode, NEWS_LIVE_WAIT_MS: '600' }), bare);
    assert.ok(Date.now() - started < 30000, `${mode}: the wait is bounded`);
    assert.equal(run.status, 1, `${mode}: ends failed, as fetch-news.mjs does for pushed-not-live`);
    assert.match(run.out, /The link WAS saved\. Do not add it again\./, mode);
    assert.match(run.out, /only because the public page had not caught up/);
    assert.match(run.stepSummary, /The link WAS saved/);
    assert.doesNotMatch(run.out, /Not added|Nothing was changed/);
    // And it really was saved.
    assert.equal(parseArchive(published(bare, ARCHIVE_PATH)).items.at(-1).link, HAND.link);
    assert.ok(JSON.parse(published(bare, 'api/news.json')).articles.some((a) => a.link === HAND.link));
    // Trying again, as someone who misread the red run would, changes nothing.
    const again = runNode(ADD_SCRIPT, addEnv(HAND, { MAIN_PATH_LIVE: mode, NEWS_LIVE_WAIT_MS: '600' }), bare);
    assert.equal(again.status, 0);
    assert.match(again.out, /Already there/);
  }
});

test('scripts: with no archive on the site the script stops and says how to fix it', () => {
  const bare = newRemote('no-archive', { 'api/news.json': { runId: 'scan-1', summary: null, articles: [] } });
  const before = head(bare);
  const run = runNode(ADD_SCRIPT, addEnv(HAND), bare);
  assert.equal(run.status, 1);
  assert.match(run.out, /Not added\. The news archive on the site cannot be used/);
  assert.match(run.out, /nothing is seeded automatically/);
  assert.equal(head(bare), before);
  assert.equal(git(bare, 'ls-tree', '--name-only', 'gh-pages', ARCHIVE_PATH), '');
});

// ── The workflow file ───────────────────────────────────────────────────────────────

test('add-news-link.yml: manual only, in the scan\'s concurrency group, inputs through env, no model key', () => {
  const read = (name) => readFileSync(new URL(`../../.github/workflows/${name}`, import.meta.url), 'utf8');
  const workflow = read('add-news-link.yml');
  const code = workflow.split('\n').filter((line) => !line.trim().startsWith('#')).join('\n');

  // Triggered by hand and by nothing else.
  assert.match(code, /^on:\n {2}workflow_dispatch:\n {4}inputs:/m);
  assert.doesNotMatch(code, /schedule:|issue_comment:|push:|pull_request/);
  for (const input of ['link', 'title', 'source']) assert.match(code, new RegExp(`      ${input}:\\n(.*\\n)*?        required: true`));
  assert.match(code, /      date:\n(.*\n)*?        required: false/);
  assert.match(code, /      dry_run:\n(.*\n)*?        type: boolean\n        default: false/);

  // The same group the scan publishes in, so the two never run at once.
  assert.match(code, /concurrency:\n {2}group: news-publish\n {2}cancel-in-progress: false/);
  assert.match(read('fetch-news.yml'), /\|\| 'news-publish' \}\}/);

  // Hand-typed values reach the script through env only, never inside a command.
  const runLines = code.split('\n').filter((line) => /^\s+(- )?run:/.test(line));
  assert.deepEqual(runLines.map((line) => line.trim()), ['- run: npm ci', 'run: node scripts/news/add-link.mjs']);
  for (const [name, input] of [['NEWS_LINK', 'link'], ['NEWS_TITLE', 'title'], ['NEWS_SOURCE', 'source'], ['NEWS_DATE', 'date']]) {
    assert.ok(code.includes(`${name}: \${{ github.event.inputs.${input} }}`), name);
  }
  assert.equal(code.match(/github\.event\.inputs\./g).length, 5, 'four values and the dry-run switch, nothing else');

  // Same token handling as the scan; no model key, because no model is involved.
  assert.ok(code.includes('GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}'));
  assert.doesNotMatch(code, /ANTHROPIC|EMAIL_|NEWS_ARCHIVE_BOOTSTRAP/);
  assert.match(code, /permissions:\n {6}contents: write\n {4}steps:/);
});

test('add-link.mjs: calls no model and fetches no outlet', () => {
  for (const file of ['../news/add-link.mjs', '../news/hand-link.mjs']) {
    const code = readFileSync(new URL(file, import.meta.url), 'utf8').split('\n').filter((line) => !/^\s*(\/\/|\*|\/\*)/.test(line)).join('\n');
    assert.doesNotMatch(code, /anthropic|summarize\.mjs|judge\.mjs|getClient|fetchFeed|fetchAllFeeds|bootstrap: true/i, file);
  }
});
