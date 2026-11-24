// When the news summary shows on /news, and what the page says in a quiet stretch.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { summaryState, newestCoverage, SUMMARY_MAX_AGE_MS, QUIET_NOTE_AFTER_MS, CLOCK_SKEW_MS } from '../../src/utils/newsSummary.js';

const NOW = Date.parse('2026-11-24T15:00:00Z');
const DAY = 24 * 60 * 60 * 1000;
const at = (msAgo) => new Date(NOW - msAgo).toISOString();
const feed = (over = {}) => ({
  summary: 'A summary.',
  lastUpdated: at(60 * 60 * 1000),
  articles: [{ pubDate: at(2 * DAY) }],
  ...over,
});

test('recent headlines: the summary shows with no quiet note', () => {
  assert.deepEqual(summaryState(feed(), NOW), { showSummary: true, quietSince: null });
});

test('old headlines no longer hide the summary; the quiet note names the newest date', () => {
  for (const days of [14, 20, 29, 60, 400]) {
    const s = summaryState(feed({ articles: [{ pubDate: at(days * DAY) }, { pubDate: at((days + 3) * DAY) }] }), NOW);
    assert.equal(s.showSummary, true, `${days} days`);
    assert.ok(s.quietSince, `${days} days`);
  }
  const s = summaryState(feed({ articles: [{ pubDate: '2026-11-04T21:40:00.000Z' }, { pubDate: '2026-10-31T14:40:07.000Z' }] }), NOW);
  assert.deepEqual(s, { showSummary: true, quietSince: 'November 4, 2026' });
});

test('the quiet note starts at exactly seven days', () => {
  assert.equal(summaryState(feed({ articles: [{ pubDate: at(QUIET_NOTE_AFTER_MS - 1) }] }), NOW).quietSince, null);
  assert.ok(summaryState(feed({ articles: [{ pubDate: at(QUIET_NOTE_AFTER_MS) }] }), NOW).quietSince);
});

test('the date is the day in Washington, not UTC', () => {
  // 02:30 UTC on November 5 is still the evening of November 4 in Washington.
  const s = summaryState(feed({ articles: [{ pubDate: '2026-11-05T02:30:00Z' }] }), NOW);
  assert.equal(s.quietSince, 'November 4, 2026');
});

test('a scan that has not run for 72 hours still hides the summary', () => {
  assert.equal(summaryState(feed({ lastUpdated: at(SUMMARY_MAX_AGE_MS - 1) }), NOW).showSummary, true);
  assert.equal(summaryState(feed({ lastUpdated: at(SUMMARY_MAX_AGE_MS) }), NOW).showSummary, false);
  for (const lastUpdated of [undefined, null, '', 'not a date']) {
    assert.equal(summaryState(feed({ lastUpdated }), NOW).showSummary, false);
  }
});

test('no summary, or nothing dated to describe: no summary shown', () => {
  for (const summary of [null, undefined, '', '   ', 42, {}]) {
    assert.equal(summaryState(feed({ summary }), NOW).showSummary, false);
  }
  for (const articles of [[], [{ pubDate: 'junk' }], [{}]]) {
    assert.deepEqual(summaryState(feed({ articles }), NOW), { showSummary: false, quietSince: null });
  }
  assert.deepEqual(summaryState({}, NOW), { showSummary: false, quietSince: null });
});

test('with no summary, the quiet date is still returned for the "Last checked" line', () => {
  const s = summaryState(feed({ summary: null, articles: [{ pubDate: at(10 * DAY) }] }), NOW);
  assert.equal(s.showSummary, false);
  assert.ok(s.quietSince);
});

test('a headline dated in the future counts as now', () => {
  assert.deepEqual(newestCoverage([{ pubDate: at(-DAY) }], NOW), { newest: NOW, age: 0, allDated: true });
});

test('a null, empty or non-text date is no date, never 1970', () => {
  for (const pubDate of [null, undefined, '', '  ', 0, 1730000000000, {}, 'junk']) {
    assert.deepEqual(summaryState(feed({ articles: [{ pubDate }] }), NOW), { showSummary: false, quietSince: null }, String(pubDate));
  }
});

test('one undated headline among old dated ones: the summary shows, the quiet claim does not', () => {
  for (const pubDate of [null, undefined, 'junk']) {
    const s = summaryState(feed({ articles: [{ pubDate: at(20 * DAY) }, { pubDate }] }), NOW);
    assert.deepEqual(s, { showSummary: true, quietSince: null });
  }
});

test('a scan stamp in the future: allowed within clock skew, refused beyond it', () => {
  const old = [{ pubDate: at(20 * DAY) }];
  assert.equal(summaryState(feed({ lastUpdated: at(-CLOCK_SKEW_MS), articles: old }), NOW).showSummary, true);
  assert.equal(summaryState(feed({ lastUpdated: at(-CLOCK_SKEW_MS - 1), articles: old }), NOW).showSummary, false);
  assert.equal(summaryState(feed({ lastUpdated: at(-400 * DAY), articles: old }), NOW).showSummary, false);
});

test('page: the quiet line sits inside the summary, before it; the checked line carries the date only when no summary shows', () => {
  const page = readFileSync(new URL('../../src/NewsAndAnalysis.jsx', import.meta.url), 'utf8');
  const box = page.indexOf('<div className="news-summary">');
  const quiet = page.indexOf('No new statehood headlines since {quietSince}.');
  const text = page.indexOf('<p>{data.summary}</p>');
  const disclosure = page.indexOf('news-ai-disclosure');
  assert.ok(box > 0 && box < quiet && quiet < text && text < disclosure);
  assert.equal(page.match(/No new statehood headlines/g).length, 1);
  assert.match(page, /\{showSummary && \(\n\s+<div className="news-summary">\n\s+\{quietSince && \(/);
  assert.match(page, /\{quietSince && !showSummary && <> · Newest coverage: \{quietSince\}<\/>\}/);
});
