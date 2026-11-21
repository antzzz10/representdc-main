/**
 * Tests for the news scan's memory (scripts/news/archive.mjs): pure functions, so no
 * network, no API and no git. The git side (both files in one commit, a corrupt archive,
 * Withhold, a rejected push) is in race.test.mjs; the deploy side is in deploy.test.mjs.
 *
 * Each test replays runs the way fetch-news.mjs does: splitCandidates decides what the
 * filter is asked about, applyRun turns the verdicts into the next archive and the list
 * the page shows. Run with `npm run test:news`.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  applyRun,
  splitCandidates,
  updateFeedHealth,
  longFailingSources,
  parseArchive,
  validateArchive,
  assertArchiveOnlyGrows,
  emptyArchive,
  archivable,
  ArchiveError,
  ARCHIVE_PATH,
  DISPLAY_WINDOW_DAYS,
} from '../news/archive.mjs';
import { MAX_ARTICLES, checkArticles } from '../news/gates.mjs';
import { filterByRelevance } from '../news/summarize.mjs';
import { NEWS_PATH } from '../news/publish.mjs';

const DAY = 24 * 60 * 60 * 1000;
const T0 = new Date('2026-11-21T06:17:00Z').getTime();
const OK_SOURCES = [{ source: 'The 51st', status: 'ok', maxAgeDays: 30 }];

/** An article as fetchAllFeeds hands it over: RFC 822 date, as feeds send it. */
function article(id, daysOld = 1, source = 'The 51st', now = T0) {
  return {
    title: `Statehood story ${id}`,
    link: `https://example.org/${id}`,
    pubDate: new Date(now - daysOld * DAY).toUTCString(),
    source,
  };
}

/** One run: what was in the feeds, and which of those the filter said yes to. */
function run(archive, { feed, yes, now = T0, sourceResults = OK_SOURCES, windowDaysBySource = {} }) {
  const { toFilter } = splitCandidates(archive, feed);
  const asked = toFilter.map((a) => a.link);
  const result = applyRun(archive, {
    candidates: feed,
    relevantLinks: yes.map((a) => a.link).filter((link) => asked.includes(link)),
    sourceResults,
    now,
    windowDaysBySource,
  });
  // Every archive a run produces must be one the next run can read back.
  parseArchive(JSON.stringify(result.archive));
  return { ...result, asked };
}

const links = (list) => list.map((a) => a.link);

test('archive: a first yes shows the article at once but does not confirm it', () => {
  const a = article('a');
  const first = run(emptyArchive(), { feed: [a], yes: [a] });
  assert.deepEqual(links(first.articles), [a.link], 'new items still show immediately');
  assert.equal(first.archive.items.length, 0, 'one yes is not a confirmation');
  assert.equal(first.archive.pending.length, 1);
  assert.equal(first.archive.pending[0].yes, 1);
  assert.equal(first.archive.pending[0].firstSeen, new Date(T0).toISOString());
});

test('archive: the second yes, on a later run, confirms it', () => {
  const a = article('a');
  const first = run(emptyArchive(), { feed: [a], yes: [a] });
  const second = run(first.archive, { feed: [a], yes: [a], now: T0 + DAY / 2 });
  assert.equal(second.archive.pending.length, 0);
  assert.deepEqual(second.archive.items, [
    {
      link: a.link,
      title: a.title,
      source: 'The 51st',
      pubDate: new Date(a.pubDate).toISOString(),
      firstSeen: new Date(T0).toISOString(),
      confirmedAt: new Date(T0 + DAY / 2).toISOString(),
    },
  ]);
  // Headline, link, source and dates only. No summary, no body text.
  assert.deepEqual(Object.keys(second.archive.items[0]).sort(), ['confirmedAt', 'firstSeen', 'link', 'pubDate', 'source', 'title']);
});

test('archive: the two yeses need not be consecutive, and a no in between costs nothing', () => {
  const a = article('a');
  const first = run(emptyArchive(), { feed: [a], yes: [a] });
  const flipped = run(first.archive, { feed: [a], yes: [], now: T0 + DAY / 2 });
  assert.deepEqual(flipped.articles, [], 'judged no this run, and not confirmed: off the page');
  assert.equal(flipped.archive.pending[0].yes, 1, 'the earlier yes is still on record');
  const third = run(flipped.archive, { feed: [a], yes: [a], now: T0 + DAY });
  assert.equal(third.archive.items.length, 1);
});

test('archive: a confirmed article stays displayed after it leaves the feed', () => {
  // The failure this whole change exists for: the outlet's feed scrolls on and the
  // article used to vanish from the page with it.
  const a = article('a');
  const first = run(emptyArchive(), { feed: [a], yes: [a] });
  const second = run(first.archive, { feed: [a], yes: [a], now: T0 + DAY / 2 });
  const gone = run(second.archive, { feed: [], yes: [], now: T0 + DAY });
  assert.deepEqual(links(gone.articles), [a.link]);
  assert.equal(gone.articles[0].title, a.title);
});

test('archive: a single-yes article disappears when it leaves the feed', () => {
  // One yes may be the filter being wrong. It must not be able to keep an article on
  // the page for a month on its own.
  const a = article('a');
  const first = run(emptyArchive(), { feed: [a], yes: [a] });
  const gone = run(first.archive, { feed: [], yes: [], now: T0 + DAY / 2 });
  assert.deepEqual(gone.articles, []);
  assert.equal(gone.archive.items.length, 0);
});

test('archive: a confirmed article is never sent to the filter again, and a later no cannot remove it', async () => {
  const a = article('a');
  const b = article('b', 2);
  const first = run(emptyArchive(), { feed: [a], yes: [a] });
  const second = run(first.archive, { feed: [a], yes: [a], now: T0 + DAY / 2 });

  // Third run: `a` is still in the feed beside a new `b`. Only `b` may reach the model.
  const { toFilter, alreadyConfirmed } = splitCandidates(second.archive, [a, b]);
  assert.deepEqual(links(toFilter), [b.link]);
  assert.deepEqual(links(alreadyConfirmed), [a.link]);

  let sent = '';
  const client = {
    messages: {
      create: async ({ messages }) => {
        sent = messages[0].content;
        return { content: [{ text: '[]' }], usage: { input_tokens: 1, output_tokens: 1 } };
      },
    },
  };
  const filtered = await filterByRelevance(client, toFilter);
  assert.doesNotMatch(sent, /Statehood story a/);
  assert.match(sent, /Statehood story b/);

  // The filter said yes to nothing, and `a` is still there.
  const third = applyRun(second.archive, {
    candidates: [a, b],
    relevantLinks: links(filtered.articles),
    sourceResults: OK_SOURCES,
    now: T0 + DAY,
  });
  assert.deepEqual(links(third.articles), [a.link]);
  assert.deepEqual(third.archive.items, second.archive.items, 'a confirmed item is never rewritten');
});

test('archive: confirmed articles leave the page after 30 days but stay in the archive for good', () => {
  const a = article('a', 1);
  const first = run(emptyArchive(), { feed: [a], yes: [a] });
  const second = run(first.archive, { feed: [a], yes: [a], now: T0 + DAY / 2 });

  const day29 = run(second.archive, { feed: [], yes: [], now: T0 + 28 * DAY });
  assert.deepEqual(links(day29.articles), [a.link], 'still inside the 30-day window');

  const day31 = run(day29.archive, { feed: [], yes: [], now: T0 + 30 * DAY });
  assert.deepEqual(day31.articles, [], 'published 31 days ago: off the page');
  assert.deepEqual(links(day31.archive.items), [a.link], 'but the record keeps it');

  // A year of runs later it is still there, untouched.
  const nextYear = run(day31.archive, { feed: [], yes: [], now: T0 + 400 * DAY });
  assert.deepEqual(nextYear.archive.items, second.archive.items);
  assert.equal(DISPLAY_WINDOW_DAYS, 30);
});

test("archive: an org source's own 60-day window is honoured for confirmed articles", () => {
  const org = article('org', 1, 'DC Vote');
  const news = article('news', 1, 'The 51st');
  const windowDaysBySource = { 'DC Vote': 60, 'The 51st': 30 };
  const first = run(emptyArchive(), { feed: [org, news], yes: [org, news], windowDaysBySource });
  const second = run(first.archive, { feed: [org, news], yes: [org, news], now: T0 + DAY / 2, windowDaysBySource });
  const day45 = run(second.archive, { feed: [], yes: [], now: T0 + 44 * DAY, windowDaysBySource });
  assert.deepEqual(links(day45.articles), [org.link]);
  const day61 = run(day45.archive, { feed: [], yes: [], now: T0 + 60 * DAY, windowDaysBySource });
  assert.deepEqual(day61.articles, []);
  assert.equal(day61.archive.items.length, 2);
});

test('archive: pending entries are pruned once they age out of the window', () => {
  const a = article('a', 29);
  const first = run(emptyArchive(), { feed: [a], yes: [a] });
  assert.equal(first.archive.pending.length, 1);
  const later = run(first.archive, { feed: [], yes: [], now: T0 + 2 * DAY });
  assert.deepEqual(later.archive.pending, []);
  assert.deepEqual(later.archive.items, []);
});

test('archive: the page shows at most 15, newest first, without duplicates', () => {
  assert.equal(MAX_ARTICLES, 15);
  // 20 confirmed articles, one per day.
  const feed = Array.from({ length: 20 }, (_, i) => article(`c${i}`, i + 1));
  const first = run(emptyArchive(), { feed, yes: feed });
  const second = run(first.archive, { feed, yes: feed, now: T0 + DAY / 2 });
  assert.equal(second.archive.items.length, 20);

  // Plus two brand-new ones, the newest of all, seen for the first time.
  const fresh = [article('new1', 0.1, 'The 51st', T0 + DAY), article('new2', 0.2, 'The 51st', T0 + DAY)];
  const third = run(second.archive, { feed: [...feed, ...fresh], yes: fresh, now: T0 + DAY });
  assert.equal(third.articles.length, 15);
  assert.deepEqual(links(third.articles).slice(0, 2), links(fresh));
  const times = third.articles.map((a) => new Date(a.pubDate).getTime());
  assert.deepEqual(times, [...times].sort((x, y) => y - x));
  assert.equal(new Set(links(third.articles)).size, 15);
  assert.equal(third.archive.items.length, 20, 'the cap is on the page, never on the record');
  // The displayed list is exactly what G4 accepts, in the shape the page reads.
  assert.equal(checkArticles(third.articles, links(third.articles), T0 + DAY).pass, true);
  assert.deepEqual(Object.keys(third.articles[0]), ['title', 'link', 'pubDate', 'source']);
});

test('archive: an article G4 would reject is shown for G4 to reject, but never remembered', () => {
  // Remembered, it would fail G4 on every later run with no way out but a hand edit.
  const insecure = { ...article('http'), link: 'http://example.org/http' };
  const future = { ...article('future'), pubDate: new Date(T0 + 3 * DAY).toUTCString() };
  assert.equal(archivable(insecure, T0), false);
  assert.equal(archivable(future, T0), false);
  let state = emptyArchive();
  for (let i = 0; i < 3; i += 1) {
    const result = run(state, { feed: [insecure, future], yes: [insecure, future], now: T0 + i * DAY / 2 });
    assert.equal(result.articles.length, 2);
    assert.equal(checkArticles(result.articles, null, T0).pass, false);
    assert.deepEqual(result.archive.items, []);
    assert.deepEqual(result.archive.pending, []);
    state = result.archive;
  }
});

test('archive: re-applying a run to a newer archive keeps a rival run\'s confirmations', () => {
  // What publishFeed's retry relies on (rule 2): same observations, newer archive.
  const mine = article('mine');
  const theirs = article('theirs', 2);
  const start = run(emptyArchive(), { feed: [mine], yes: [mine] }).archive;
  const observations = { candidates: [mine], relevantLinks: [mine.link], sourceResults: OK_SOURCES, now: T0 + DAY / 2 };

  const firstAttempt = applyRun(start, observations);
  assert.deepEqual(links(firstAttempt.archive.items), [mine.link]);

  // A rival run confirmed `theirs` before this run's push landed.
  const rival = run(run(start, { feed: [theirs], yes: [theirs], now: T0 + DAY / 4 }).archive, {
    feed: [theirs],
    yes: [theirs],
    now: T0 + DAY / 3,
  }).archive;
  const retry = applyRun(rival, observations);
  assert.deepEqual(links(retry.archive.items).sort(), [mine.link, theirs.link].sort());
  assert.deepEqual(links(retry.articles), [mine.link, theirs.link]);
  // Nothing is lost by the re-apply, so the write-time check passes.
  assert.doesNotThrow(() => assertArchiveOnlyGrows(rival, retry.archive));
});

test('feedHealth: failingSince is set on the first failure, kept while failing, and cleared on recovery', () => {
  const failing = [{ source: 'Roll Call', status: 'http-404' }, { source: 'The 51st', status: 'ok' }];
  const day0 = updateFeedHealth({}, failing, T0);
  assert.deepEqual(day0, {
    'Roll Call': { failingSince: new Date(T0).toISOString(), lastStatus: 'http-404' },
    'The 51st': { failingSince: null, lastStatus: 'ok' },
  });

  // Still failing a day later, with a different error: the start date does not move.
  const day1 = updateFeedHealth(day0, [{ source: 'Roll Call', status: 'not-a-feed' }, { source: 'The 51st', status: 'ok' }], T0 + DAY);
  assert.equal(day1['Roll Call'].failingSince, new Date(T0).toISOString());
  assert.equal(day1['Roll Call'].lastStatus, 'not-a-feed');

  const recovered = updateFeedHealth(day1, [{ source: 'Roll Call', status: 'ok' }, { source: 'The 51st', status: 'ok' }], T0 + 3 * DAY);
  assert.deepEqual(recovered['Roll Call'], { failingSince: null, lastStatus: 'ok' });

  // Failing again later starts a new clock rather than reviving the old date.
  const again = updateFeedHealth(recovered, failing, T0 + 5 * DAY);
  assert.equal(again['Roll Call'].failingSince, new Date(T0 + 5 * DAY).toISOString());
});

test('feedHealth: a source is reported after two days of failing, not before, and not once removed', () => {
  const failing = [{ source: 'Roll Call', status: 'http-404' }, { source: 'The 51st', status: 'ok' }];
  const day0 = updateFeedHealth({}, failing, T0);
  assert.deepEqual(longFailingSources(day0, T0), []);
  assert.deepEqual(longFailingSources(updateFeedHealth(day0, failing, T0 + 1.5 * DAY), T0 + 1.5 * DAY), []);

  const day2 = updateFeedHealth(day0, failing, T0 + 2 * DAY);
  assert.deepEqual(longFailingSources(day2, T0 + 2 * DAY), [
    { source: 'Roll Call', failingSince: new Date(T0).toISOString(), lastStatus: 'http-404' },
  ]);

  // Taken out of the feed list (as League of Women Voters DC was): no longer tracked.
  const removed = updateFeedHealth(day2, [{ source: 'The 51st', status: 'ok' }], T0 + 3 * DAY);
  assert.deepEqual(Object.keys(removed), ['The 51st']);
  assert.deepEqual(longFailingSources(removed, T0 + 3 * DAY), []);
});

test('feedHealth: travels with the archive through a run', () => {
  const sourceResults = [{ source: 'Roll Call', status: 'http-404' }];
  const first = run(emptyArchive(), { feed: [], yes: [], sourceResults });
  const second = run(first.archive, { feed: [], yes: [], sourceResults, now: T0 + 2 * DAY });
  assert.equal(second.archive.feedHealth['Roll Call'].failingSince, new Date(T0).toISOString());
});

test('archive file: anything unreadable is an error, never an empty archive', () => {
  for (const text of ['', 'not json', '<html>502 Bad Gateway</html>', '[]', 'null', '{}', '{"version":1}']) {
    assert.throws(() => parseArchive(text), ArchiveError, `must reject ${JSON.stringify(text)}`);
  }
  assert.throws(() => parseArchive(JSON.stringify({ ...emptyArchive(), version: 2 })), /version/);
  assert.throws(() => parseArchive(JSON.stringify({ ...emptyArchive(), items: {} })), /items/);
  const item = { link: 'https://example.org/a', title: 't', source: 's', pubDate: '2026-11-01T00:00:00.000Z', firstSeen: '2026-11-02T00:00:00.000Z', confirmedAt: '2026-11-03T00:00:00.000Z' };
  assert.doesNotThrow(() => validateArchive({ ...emptyArchive(), items: [item] }));
  assert.throws(() => validateArchive({ ...emptyArchive(), items: [{ ...item, link: 'http://example.org/a' }] }), /https/);
  assert.throws(() => validateArchive({ ...emptyArchive(), items: [{ ...item, pubDate: 'soon' }] }), /pubDate/);
  assert.throws(() => validateArchive({ ...emptyArchive(), items: [item, item] }), /duplicate/);
  assert.throws(() => validateArchive({ ...emptyArchive(), pending: [{ ...item, yes: 0 }] }), /yes/);
  assert.throws(() => validateArchive({ ...emptyArchive(), feedHealth: { A: { failingSince: 'never', lastStatus: 'ok' } } }), /failingSince/);
});

test('archive file: a write that drops or rewrites a confirmed item is refused', () => {
  const item = { link: 'https://example.org/a', title: 't', source: 's', pubDate: '2026-11-01T00:00:00.000Z', firstSeen: '2026-11-02T00:00:00.000Z', confirmedAt: '2026-11-03T00:00:00.000Z' };
  const before = { ...emptyArchive(), items: [item] };
  assert.throws(() => assertArchiveOnlyGrows(before, emptyArchive()), /drops a confirmed item/);
  assert.throws(() => assertArchiveOnlyGrows(before, { ...emptyArchive(), items: [{ ...item, title: 'changed' }] }), /rewrites a confirmed item/);
  assert.doesNotThrow(() => assertArchiveOnlyGrows(before, { ...emptyArchive(), items: [item, { ...item, link: 'https://example.org/b' }] }));
  assert.doesNotThrow(() => assertArchiveOnlyGrows(null, emptyArchive()));
});

test('seed: the committed seed is a valid archive holding confirmed items only', () => {
  const seedPath = fileURLToPath(new URL('../news/seed-archive.json', import.meta.url));
  const seed = parseArchive(readFileSync(seedPath, 'utf8'));
  assert.ok(seed.items.length > 0);
  assert.deepEqual(seed.pending, []);
  assert.deepEqual(seed.feedHealth, {});
  // A first run from the seed displays something G4 accepts.
  const first = applyRun(seed, { candidates: [], relevantLinks: [], sourceResults: OK_SOURCES, now: T0, windowDaysBySource: { 'DC Vote': 60, 'ACLU DC': 60 } });
  assert.ok(first.articles.length > 0 && first.articles.length <= MAX_ARTICLES);
  assert.equal(checkArticles(first.articles, links(first.articles), T0).pass, true);
  assert.deepEqual(first.archive.items, seed.items);
});

test('paths: the feed and the archive are separate files in the same folder', () => {
  assert.equal(NEWS_PATH, 'api/news.json');
  assert.equal(ARCHIVE_PATH, 'api/news-archive.json');
});
