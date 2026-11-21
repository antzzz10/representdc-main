/**
 * Tests for the separate newsletters list (scripts/news/newsletters.mjs).
 *
 * The rule under test is separation: newsletters carry more opinion than news, so no
 * model reads them, they never enter `articles` or the archive, and they cannot satisfy
 * G5. And a newsletter problem never costs the reader the headlines.
 *
 * No network: `fetch` is replaced for the tests that go through fetchAllFeeds. The page
 * tests compile the real src/components/NewsList.jsx with esbuild (already installed, as
 * Vite's own dependency) and render it to HTML with react-dom/server. Run with
 * `npm run test:news`.
 */

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';

import { selectNewsletters, MAX_NEWSLETTERS, NEWSLETTER_WINDOW_DAYS } from '../news/newsletters.mjs';
import { fetchAllFeeds, FEEDS, NEWSLETTERS } from '../news/feeds.mjs';
import { checkSourceHealth, checkArticles, isHttpsUrl } from '../news/gates.mjs';
import { applyRun, composePublication, emptyArchive, updateFeedHealth, longFailingSources, failingSources, feedLabel, parseArchive, validateArchive, archivable } from '../news/archive.mjs';

const DAY = 24 * 60 * 60 * 1000;
const T0 = new Date('2026-11-21T06:17:00Z').getTime();
const LWV = 'League of Women Voters DC';

const letter = (id, daysOld = 1) => ({
  title: `Full Rights Update ${id}`,
  link: `https://lwvdc.substack.com/p/${id}`,
  pubDate: new Date(T0 - daysOld * DAY).toUTCString(),
  source: LWV,
});
const story = (id, daysOld = 1) => ({
  title: `Statehood story ${id}`,
  link: `https://example.org/${id}`,
  pubDate: new Date(T0 - daysOld * DAY).toUTCString(),
  source: 'The 51st',
});

const rss = (items) =>
  `<?xml version="1.0"?><rss version="2.0"><channel><title>t</title>${items
    .map((i) => `<item><title>${i.title}</title><link>${i.link}</link><pubDate>${i.pubDate}</pubDate>${i.sourceTag ? `<source url="https://x.org">${i.sourceTag}</source>` : ''}</item>`)
    .join('')}</channel></rss>`;

/** Replaces fetch for one call of fn. `routes` maps a URL to a body, or to an HTTP status. */
async function withFetch(routes, fn) {
  const real = globalThis.fetch;
  globalThis.fetch = async (url) => {
    const reply = routes[String(url)];
    if (typeof reply === 'number') return { ok: false, status: reply, text: async () => '' };
    return { ok: true, status: 200, text: async () => reply };
  };
  try {
    return await fn();
  } finally {
    globalThis.fetch = real;
  }
}

test('lists: newsletters are their own list, and the League newsletter is not among the news feeds', () => {
  assert.deepEqual(NEWSLETTERS, [{ url: 'https://lwvdc.substack.com/feed', source: LWV }]);
  const newsUrls = FEEDS.map((f) => f.url);
  assert.equal(newsUrls.some((url) => /substack\.com\/feed$/.test(url) && /lwvdc/.test(url)), false);
  assert.equal(FEEDS.some((f) => f.source === LWV), false);
  for (const url of ['https://wamu.org/feed/', 'https://gwhatchet.com/feed/', 'https://www.nbcwashington.com/?rss=y&most_recent=y']) {
    assert.ok(newsUrls.includes(url), `${url} is a news feed`);
  }
});

test('newsletters: last 30 days only, newest first, at most five, in the articles shape', () => {
  assert.equal(MAX_NEWSLETTERS, 5);
  assert.equal(NEWSLETTER_WINDOW_DAYS, 30);
  const items = [3, 29, 1, 31, 8, 45, 15, 22, 2].map((d) => letter(`d${d}`, d));
  const selected = selectNewsletters(items, T0);
  assert.deepEqual(selected.map((n) => n.title), ['d1', 'd2', 'd3', 'd8', 'd15'].map((id) => `Full Rights Update ${id}`));
  assert.deepEqual(Object.keys(selected[0]), ['title', 'link', 'pubDate', 'source']);
  assert.equal(selected[0].pubDate, new Date(T0 - DAY).toISOString());
  // Inside the window but over the cap: left out. Outside the window: never in.
  assert.deepEqual(selectNewsletters([letter('old', 31), letter('edge', 29.9)], T0).map((n) => n.title), ['Full Rights Update edge']);
  // The published list is exactly what G4's per-item checks accept.
  assert.equal(checkArticles(selected, null, T0).pass, true);
});

test('newsletters: an item G4 would reject is dropped, and the rest still publish', () => {
  const good = letter('good');
  const bad = [
    { ...letter('http'), link: 'http://lwvdc.substack.com/p/http' },
    { ...letter('untitled'), title: '' },
    { ...letter('nosource'), source: '' },
    { ...letter('undated'), pubDate: 'next week' },
    { ...letter('future'), pubDate: new Date(T0 + 3 * DAY).toUTCString() },
    null,
  ];
  for (const item of bad) assert.equal(checkArticles([item], null, T0).pass, false, 'each of these fails G4');
  assert.deepEqual(selectNewsletters([...bad, good, good], T0).map((n) => n.link), [good.link], 'dropped, deduped, and no throw');
  assert.deepEqual(selectNewsletters([], T0), []);
  assert.deepEqual(selectNewsletters(undefined, T0), []);
});

test('newsletters: fetched by the shared code, labelled as a newsletter, always under the list\'s own source', async () => {
  const feed = { url: 'https://lwvdc.substack.com/feed', source: LWV };
  const body = rss([{ ...letter('a'), sourceTag: 'Some Other Outlet' }, letter('b', 2)]);
  const { sourceResults, articles } = await withFetch({ [feed.url]: body }, () => fetchAllFeeds([feed], T0, 'newsletter'));
  assert.equal(sourceResults[0].kind, 'newsletter');
  assert.equal(sourceResults[0].status, 'ok');
  assert.deepEqual(articles.map((a) => a.source), [LWV, LWV], 'an item-level <source> tag cannot relabel a newsletter');
  // The default call, as the news list makes it, labels its sources as news.
  const news = await withFetch({ 'https://example.org/feed': rss([story('n')]) }, () => fetchAllFeeds([{ url: 'https://example.org/feed', source: 'The 51st' }], T0));
  assert.equal(news.sourceResults[0].kind, 'news');
});

test('newsletters: a failed newsletter feed gives an empty list on a healthy run, and is tracked for the alert', async () => {
  const newsFeed = { url: 'https://example.org/feed', source: 'The 51st' };
  const routes = { [newsFeed.url]: rss([story('n')]), [NEWSLETTERS[0].url]: 403 };
  const news = await withFetch(routes, () => fetchAllFeeds([newsFeed], T0));
  const letters = await withFetch(routes, () => fetchAllFeeds(NEWSLETTERS, T0, 'newsletter'));
  assert.equal(letters.sourceResults[0].status, 'http-403');
  assert.deepEqual(selectNewsletters(letters.articles, T0), [], 'newsletters: []');

  const all = [...news.sourceResults, ...letters.sourceResults];
  assert.equal(checkSourceHealth(all).pass, true, 'the run is healthy: the news source worked');

  // And it is in feedHealth, so two days of this opens the failing-feed issue.
  const day0 = updateFeedHealth({}, all, T0);
  assert.equal(day0[`newsletter:${LWV}`].failingSince, new Date(T0).toISOString());
  const day2 = updateFeedHealth(day0, all, T0 + 2 * DAY);
  assert.deepEqual(longFailingSources(day2, T0 + 2 * DAY).map((f) => f.source), [`${LWV} (newsletter)`]);
});

test('G5: a working newsletter feed does not count as a news source', () => {
  const newsDown = [
    { source: 'The 51st', kind: 'news', status: 'http-500' },
    { source: 'Roll Call', kind: 'news', status: 'not-a-feed' },
  ];
  const withLetter = [...newsDown, { source: LWV, kind: 'newsletter', status: 'ok' }];
  assert.equal(checkSourceHealth(newsDown).pass, false);
  const result = checkSourceHealth(withLetter);
  assert.equal(result.pass, false, 'every NEWS source failed, so nothing may publish');
  assert.equal(result.detail, 'every source failed');
  // A newsletter failure alone is not reported as a failed news source either.
  const fine = checkSourceHealth([{ source: 'The 51st', kind: 'news', status: 'ok' }, { source: LWV, kind: 'newsletter', status: 'http-403' }]);
  assert.equal(fine.pass, true);
  assert.equal(fine.someFailed, false);
  assert.match(fine.detail, /^1\/1 sources ok$/);
});

test('newsletters never reach the archive, the articles list, or the summary comparison', () => {
  const a = story('a');
  const newsletters = selectNewsletters([letter('x'), letter('y', 2)], T0);
  // What fetch-news.mjs hands to memory: the news candidates only.
  const run = { candidates: [a], relevantLinks: [a.link], sourceResults: [{ source: 'The 51st', kind: 'news', status: 'ok' }, { source: LWV, kind: 'newsletter', status: 'ok' }], now: T0 };
  const summarisedArticles = applyRun(emptyArchive(), run).articles;
  const payload = { runId: 'r', lastUpdated: new Date(T0).toISOString(), summary: 'Judged summary.', summarySource: null, summaryCheck: { judge: 'pass' }, summaryDecision: 'judge-pass', articles: summarisedArticles, newsletters };

  const composed = composePublication({ payload, summarisedArticles, run, current: null, currentArchive: emptyArchive(), seed: null, startedAt: new Date(T0), runId: 'r' });

  assert.deepEqual(composed.feed.newsletters, newsletters, 'carried through to the published feed, unchanged');
  assert.deepEqual(composed.feed.articles.map((x) => x.link), [a.link], 'and never among the articles');
  assert.equal(composed.feed.summary, 'Judged summary.', 'the summary is kept: newsletters are no part of what it is compared against');
  const stored = JSON.stringify(parseArchive(JSON.stringify(composed.archive)));
  assert.doesNotMatch(stored, /substack\.com\/p\//, 'no newsletter item in items or pending');
  assert.deepEqual(Object.keys(composed.archive.feedHealth), ['The 51st', LWV], 'only feed health is remembered');

  // A second run confirms the article; still no newsletter in memory.
  const second = composePublication({ payload, summarisedArticles, run: { ...run, now: T0 + DAY / 2 }, current: composed.feed, currentArchive: composed.archive, seed: null, startedAt: new Date(T0 + DAY / 2), runId: 'r2' });
  assert.deepEqual(second.archive.items.map((x) => x.link), [a.link]);
  assert.deepEqual(second.archive.pending, []);
});

test('fetch-news.mjs: newsletter items go to the newsletters list and nowhere else', () => {
  // The run script cannot be executed here (it calls the API), so this pins its wiring:
  // the fetched newsletter items are used in exactly one place, and the model calls and
  // the archive are given the news candidates.
  const script = readFileSync(new URL('../fetch-news.mjs', import.meta.url), 'utf8');
  const code = script.split('\n').filter((line) => !line.trim().startsWith('//')).join('\n');
  assert.equal(code.match(/newsletterItems/g).length, 2, 'declared once, used once');
  assert.match(code, /const newsletters = selectNewsletters\(newsletterItems, runNow\);/);
  assert.match(code, /fetchAllFeeds\(NEWSLETTERS, Date\.now\(\), 'newsletter'\)/);
  assert.match(code, /splitCandidates\(archive, candidates\)/);
  assert.match(code, /filterByRelevance\(client, toFilter\)/);
  assert.match(code, /summarizeArticles\(client, articles\)/);
  assert.match(code, /judgeSummary\(client, result\.body, articles\)/);
  assert.match(code, /checkArticles\(articles, summary \? articles\.map/);
  // `newsletters` itself appears only in the import path, where it is decided, where it
  // is recorded (twice on that line) and where it is put in the payload.
  assert.equal(code.match(/\bnewsletters\b/g).length, 5);
});

test('links: "https://" with no host is not a link, for G4, the archive and newsletters alike', () => {
  for (const link of ['https://', 'https://?q=1', 'http://example.org/a', 'javascript:alert(1)', 'example.org/a', '', null, undefined, 42, {}]) {
    assert.equal(isHttpsUrl(link), false, `${JSON.stringify(link)} must be refused`);
    const item = { ...story('x'), link };
    assert.equal(checkArticles([item], null, T0).pass, false, `G4 refuses ${JSON.stringify(link)}`);
    assert.equal(archivable(item, T0), false);
    assert.deepEqual(selectNewsletters([{ ...letter('x'), link }], T0), []);
  }
  for (const link of ['https://example.org/a', 'https://www.nbcwashington.com/?rss=y&most_recent=y', 'https://51st.news/a-b/']) {
    assert.equal(isHttpsUrl(link), true);
  }
  // Never remembered: shown this run for G4 to reject, as with any other bad item.
  const hostless = { ...story('hostless'), link: 'https://' };
  const result = applyRun(emptyArchive(), { candidates: [hostless], relevantLinks: ['https://'], sourceResults: [], now: T0 });
  assert.deepEqual(result.archive.pending, []);
  const entry = { link: 'https://', title: 't', source: 's', pubDate: '2026-11-01T00:00:00.000Z', firstSeen: '2026-11-02T00:00:00.000Z', confirmedAt: '2026-11-03T00:00:00.000Z' };
  assert.throws(() => validateArchive({ ...emptyArchive(), items: [entry] }), /link is not https/);
  // And nothing already in the committed seed is turned away by the stricter check.
  const seed = parseArchive(readFileSync(new URL('../news/seed-archive.json', import.meta.url), 'utf8'));
  assert.ok(seed.items.length > 0 && seed.items.every((item) => isHttpsUrl(item.link) && archivable(item, T0)));
});

test('newsletters: checked first and deduped second, so a bad first copy cannot discard a good one', async () => {
  const feed = NEWSLETTERS[0];
  const good = letter('twice', 2);
  // The same link twice in the feed: first with a date in the future, then correctly.
  const badFirst = { ...good, pubDate: new Date(T0 + 5 * DAY).toUTCString() };
  const { articles } = await withFetch({ [feed.url]: rss([badFirst, good, good]) }, () => fetchAllFeeds([feed], T0, 'newsletter'));
  assert.equal(articles.length, 3, 'the fetch leaves every copy for the checks to see');
  const selected = selectNewsletters(articles, T0);
  assert.deepEqual(selected.map((n) => [n.link, n.pubDate]), [[good.link, new Date(good.pubDate).toISOString()]], 'the good copy is published, once');
  // News items are still deduped at fetch, as before.
  const news = await withFetch({ 'https://example.org/feed': rss([story('n'), story('n')]) }, () => fetchAllFeeds([{ url: 'https://example.org/feed', source: 'The 51st' }], T0));
  assert.equal(news.articles.length, 1);
});

test('feedHealth: a newsletter has its own key and cannot inherit a same-named news feed\'s failure date', async () => {
  // What the branch may still hold: the removed lwvdc.org website feed, failing since July.
  const previous = { [LWV]: { failingSince: '2026-07-12T06:17:00.000Z', lastStatus: 'http-403' }, 'The 51st': { failingSince: null, lastStatus: 'ok' } };
  const routes = { 'https://example.org/feed': rss([story('n')]), [NEWSLETTERS[0].url]: 500 };
  const news = await withFetch(routes, () => fetchAllFeeds([{ url: 'https://example.org/feed', source: 'The 51st' }], T0));
  const letters = await withFetch(routes, () => fetchAllFeeds(NEWSLETTERS, T0, 'newsletter'));
  assert.equal(letters.sourceResults[0].source, LWV, 'the label people see is unchanged');
  assert.equal(letters.sourceResults[0].healthKey, `newsletter:${LWV}`);
  assert.equal(news.sourceResults[0].healthKey, undefined);

  const next = updateFeedHealth(previous, [...news.sourceResults, ...letters.sourceResults], T0);
  assert.deepEqual(Object.keys(next), ['The 51st', `newsletter:${LWV}`], 'the old website entry is gone, not reused');
  assert.equal(next[`newsletter:${LWV}`].failingSince, new Date(T0).toISOString(), 'its clock starts now, not in July');
  assert.deepEqual(longFailingSources(next, T0), [], 'so no alert on its first failing run');
  validateArchive({ ...emptyArchive(), feedHealth: next });

  // The alert names it readably.
  assert.equal(feedLabel(`newsletter:${LWV}`), `${LWV} (newsletter)`);
  assert.equal(feedLabel('Roll Call'), 'Roll Call');
  assert.deepEqual(failingSources(next).map((f) => f.source), [`${LWV} (newsletter)`]);
  // And a news feed and a newsletter with one name are tracked apart.
  const both = updateFeedHealth({}, [{ source: LWV, status: 'ok' }, { source: LWV, healthKey: `newsletter:${LWV}`, status: 'http-500' }], T0);
  assert.equal(both[LWV].failingSince, null);
  assert.equal(both[`newsletter:${LWV}`].failingSince, new Date(T0).toISOString());
});

// ── The page ────────────────────────────────────────────────────────────────────────

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const OUT_DIR = join(ROOT, 'node_modules/.cache/news-page-test');
after(() => rmSync(OUT_DIR, { recursive: true, force: true }));

/** Compiles the real component file and returns its exports plus a render-to-HTML helper. */
// (validNewsItems is bundled in from src/utils/newsItems.js, so the real filter runs.)
async function loadNewsList() {
  const { build } = await import('esbuild');
  mkdirSync(OUT_DIR, { recursive: true });
  const outfile = join(OUT_DIR, `NewsList-${process.pid}.mjs`);
  await build({
    entryPoints: [join(ROOT, 'src/components/NewsList.jsx')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    jsx: 'automatic',
    packages: 'external',
    outfile,
    logLevel: 'silent',
  });
  const mod = await import(pathToFileURL(outfile).href);
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  return { ...mod, html: (component, props) => renderToStaticMarkup(createElement(component, props)) };
}

test('page: the newsletters section renders nothing when the array is empty, missing or not an array', async () => {
  const { NewsletterSection, html } = await loadNewsList();
  for (const newsletters of [[], undefined, null, 'oops', {}]) {
    assert.equal(html(NewsletterSection, { newsletters }), '', `nothing for ${JSON.stringify(newsletters)}`);
  }
});

test('page: with items, one heading and the same list markup as the headlines', async () => {
  const { NewsletterSection, default: NewsList, html } = await loadNewsList();
  const newsletters = selectNewsletters([letter('x'), letter('y', 2)], T0);
  const out = html(NewsletterSection, { newsletters });
  assert.match(out, /^<h3 class="news-subheading">Newsletters and opinion<\/h3><ul class="news-list">/);
  assert.equal(out.match(/<li class="news-item"/g).length, 2);
  assert.match(out, /href="https:\/\/lwvdc\.substack\.com\/p\/x" target="_blank" rel="noopener noreferrer"/);
  assert.match(out, /League of Women Voters DC/);
  // No AI disclosure and no summary inside this section.
  assert.doesNotMatch(out, /AI|news-summary|news-ai-disclosure/);
  // The list part is byte for byte what the headlines list renders for the same items.
  assert.equal(out.replace(/^<h3[^>]*>.*?<\/h3>/, ''), html(NewsList, { items: newsletters }));
});

test('page: the section sits below the headlines, and the summary rules read articles only', () => {
  const page = readFileSync(join(ROOT, 'src/NewsAndAnalysis.jsx'), 'utf8');
  const headlines = page.indexOf('<NewsList items={articles} />');
  const section = page.indexOf('<NewsletterSection newsletters={data?.newsletters} />');
  const analysis = page.indexOf('id="analysis"');
  const disclosure = page.indexOf('news-ai-disclosure');
  assert.ok(disclosure > 0 && disclosure < headlines && headlines < section && section < analysis);
  assert.equal(page.match(/newsletters/g).length, 2, 'used only to render the section');
  assert.match(page, /const articles = validNewsItems\(data\?\.articles\)\n\s+const \{ newest, age: coverageAge \} = newestCoverage\(articles\)/);
});

test('page: malformed entries are dropped from both lists instead of crashing the page', async () => {
  const { NewsletterSection, default: NewsList, html } = await loadNewsList();
  const good = selectNewsletters([letter('ok')], T0)[0];
  const malformed = [
    null,
    undefined,
    42,
    'a string',
    [],
    {},
    { ...good, title: { text: 'object title' } },
    { ...good, title: '' },
    { ...good, title: '   ' },
    { ...good, link: 'https://' },
    { ...good, link: 'javascript:alert(1)' },
    { ...good, link: 'http://example.org/insecure' },
    { ...good, link: undefined },
    { ...good, link: { href: 'https://example.org' } },
    { ...good, link: 'https://example.org/src', source: { name: 'object source' } },
    { ...good, link: 'https://example.org/date', pubDate: 12345 },
  ];

  // Every one of these alone renders nothing: no list, no heading, no throw.
  for (const item of malformed) {
    const label = JSON.stringify(item) ?? String(item);
    assert.equal(html(NewsletterSection, { newsletters: [item] }), '', `newsletters: ${label}`);
    assert.equal(html(NewsList, { items: [item] }), '', `articles: ${label}`);
  }
  assert.equal(html(NewsletterSection, { newsletters: malformed }), '');
  assert.equal(html(NewsList, { items: malformed }), '');

  // Mixed in with a good item, only the good one is shown, in both lists.
  const mixed = [...malformed.slice(0, 8), good, ...malformed.slice(8), good];
  for (const out of [html(NewsletterSection, { newsletters: mixed }), html(NewsList, { items: mixed })]) {
    assert.equal(out.match(/<li class="news-item"/g).length, 1);
    assert.doesNotMatch(out, /javascript:|href="https:\/\/"|insecure|object/);
    assert.match(out, /href="https:\/\/lwvdc\.substack\.com\/p\/ok"/);
  }

  // A valid payload renders exactly as it did: optional fields may be absent.
  const valid = [good, { title: 'No date or source', link: 'https://example.org/bare' }];
  assert.equal(html(NewsList, { items: valid }).match(/<li class="news-item"/g).length, 2);
  assert.equal(html(NewsletterSection, { newsletters: valid }).match(/<h3/g).length, 1);
});
