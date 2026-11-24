// Two ways a source is read besides one page of RSS (added 2026-11-24): a Google News
// sitemap, for an outlet whose feed holds a single story, and later pages of a WordPress
// feed, for an outlet whose feed turns over faster than the scan runs. No network: `fetch`
// is replaced for every test that fetches.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FEEDS,
  NEWSLETTERS,
  MAX_FEED_PAGES,
  fetchFeed,
  fetchAllFeeds,
  parseNewsSitemap,
  readNewsSitemap,
  looksLikeNewsSitemap,
  newsSitemapIsComplete,
  pageUrl,
} from '../news/feeds.mjs';
import { checkArticles, checkSourceHealth } from '../news/gates.mjs';
import { updateFeedHealth, longFailingSources } from '../news/archive.mjs';

const DAY = 24 * 60 * 60 * 1000;
const T0 = new Date('2026-11-24T18:17:00Z').getTime();
const SITEMAP = 'https://www.example-sun.com/news-sitemap-content.xml';

const entry = ({ loc, title, date }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>2026-11-24T13:35:21-05:00</lastmod>
    <news:news>
      <news:publication><news:name>Example Sun</news:name><news:language>eng</news:language></news:publication>
      ${date === undefined ? '' : `<news:publication_date>${date}</news:publication_date>`}
      ${title === undefined ? '' : `<news:title>${title}</news:title>`}
    </news:news>
  </url>`;
const sitemap = (entries) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${entries.map(entry).join('')}\n</urlset>`;

const rssItem = (id, daysOld = 1) =>
  `<item><title>Story ${id}</title><link>https://example.org/${id}</link><pubDate>${new Date(T0 - daysOld * DAY).toUTCString()}</pubDate></item>`;
const rss = (ids) => `<?xml version="1.0"?><rss version="2.0"><channel>${ids.map((id) => rssItem(id)).join('')}</channel></rss>`;

/** Replaces fetch with a table of address to body (or a number, for that HTTP status). */
async function withFetch(routes, fn) {
  const real = globalThis.fetch;
  const asked = [];
  const options = [];
  globalThis.fetch = async (url, init) => {
    asked.push(String(url));
    options.push(init);
    const hit = routes[String(url)];
    if (hit === undefined) return { ok: false, status: 404, text: async () => '' };
    if (typeof hit === 'number') return { ok: false, status: hit, text: async () => '' };
    return { ok: true, status: 200, text: async () => hit };
  };
  try {
    return { result: await fn(), asked, options };
  } finally {
    globalThis.fetch = real;
  }
}

test('news sitemap: title, address and publication time are read, nothing else', () => {
  const body = sitemap([
    { loc: 'https://www.example-sun.com/metro/dc/statehood-vote', title: 'Senate Sets a D.C. Statehood Vote', date: '2026-11-24T13:24:51-05:00' },
    { loc: 'https://www.example-sun.com/campaigns/a?x=1&amp;y=2', title: 'Shadow Senator&#8217;s Bid &amp; More', date: '2026-11-23T09:00:00-05:00' },
  ]);
  assert.equal(looksLikeNewsSitemap(body), true);
  assert.equal(newsSitemapIsComplete(body), true);
  assert.deepEqual(parseNewsSitemap(body, SITEMAP), [
    { title: 'Senate Sets a D.C. Statehood Vote', link: 'https://www.example-sun.com/metro/dc/statehood-vote', pubDate: '2026-11-24T13:24:51-05:00', source: '' },
    { title: 'Shadow Senator’s Bid & More', link: 'https://www.example-sun.com/campaigns/a?x=1&y=2', pubDate: '2026-11-23T09:00:00-05:00', source: '' },
  ]);
});

test('news sitemap: an entry on another host, over http, or without a title is dropped', () => {
  const good = { loc: 'https://www.example-sun.com/a', title: 'Kept', date: '2026-11-24T10:00:00-05:00' };
  const body = sitemap([
    { loc: 'https://evil.example/a', title: 'Other host', date: '2026-11-24T10:00:00-05:00' },
    { loc: 'https://www.example-sun.com@evil.example/a', title: 'Looks like the outlet', date: '2026-11-24T10:00:00-05:00' },
    { loc: 'https://example-sun.com/a', title: 'Not the same host', date: '2026-11-24T10:00:00-05:00' },
    { loc: 'http://www.example-sun.com/a', title: 'Not https', date: '2026-11-24T10:00:00-05:00' },
    { loc: 'not an address', title: 'No address', date: '2026-11-24T10:00:00-05:00' },
    { loc: 'https://www.example-sun.com/untitled', date: '2026-11-24T10:00:00-05:00' },
    good,
  ]);
  assert.deepEqual(parseNewsSitemap(body, SITEMAP).map((i) => i.title), ['Kept']);
});

test('news sitemap: an HTML page, an RSS feed and a cut-off file are not a working sitemap', async () => {
  const feed = { url: SITEMAP, source: 'Example Sun', format: 'news-sitemap' };
  const cutOff = sitemap([{ loc: 'https://www.example-sun.com/a', title: 'A', date: '2026-11-24T10:00:00-05:00' }]).replace('</urlset>', '');
  const cases = [
    ['<!doctype html><html><body><urlset>Just a moment...</urlset></body></html>', 'not-a-feed'],
    [rss(['a']), 'not-a-feed'],
    [cutOff, 'malformed-feed'],
    [sitemap([]), 'no-entries'],
    ['<urlset><broken></urlset>', 'no-entries'],
    [403, 'http-403'],
  ];
  for (const [body, status] of cases) {
    const { result } = await withFetch({ [SITEMAP]: body }, () => fetchFeed(feed));
    assert.equal(result.status, status);
    assert.deepEqual(result.items, []);
  }
});

test('news sitemap: stories reach the run labelled with the list\'s source and pass the article check', async () => {
  const feed = { url: SITEMAP, source: 'Example Sun', format: 'news-sitemap' };
  const body = sitemap([
    { loc: 'https://www.example-sun.com/new', title: 'New story', date: new Date(T0 - DAY).toISOString() },
    { loc: 'https://www.example-sun.com/old', title: 'Old story', date: new Date(T0 - 40 * DAY).toISOString() },
    { loc: 'https://www.example-sun.com/undated', title: 'Undated story' },
  ]);
  const { result, asked } = await withFetch({ [SITEMAP]: body }, () => fetchAllFeeds([feed], T0));
  assert.deepEqual(asked, [SITEMAP], 'one request, which is what the crawl delay allows');
  assert.equal(result.sourceResults[0].status, 'ok');
  assert.equal(result.sourceResults[0].fetched, 3);
  assert.equal(result.sourceResults[0].dated, 2);
  assert.deepEqual(result.articles.map((a) => [a.title, a.source]), [['New story', 'Example Sun']]);
  const published = result.articles.map(({ title, link, source, pubDate }) => ({ title, link, source, pubDate }));
  assert.equal(checkArticles(published, null, T0).pass, true);
});

test('news sitemap: a file whose stories all lack a date is reported as broken, not quiet', async () => {
  const feed = { url: SITEMAP, source: 'Example Sun', format: 'news-sitemap' };
  const body = sitemap([{ loc: 'https://www.example-sun.com/a', title: 'A' }]);
  const { result } = await withFetch({ [SITEMAP]: body }, () => fetchAllFeeds([feed], T0));
  assert.equal(result.sourceResults[0].status, 'bad-dates');
});

test('news sitemap: a file whose entries do not open and close one for one gives nothing', async () => {
  const feed = { url: SITEMAP, source: 'Example Sun', format: 'news-sitemap' };
  const a = { loc: 'https://www.example-sun.com/story-a', title: 'Story A', date: '2026-11-24T10:00:00-05:00' };
  const b = { loc: 'https://www.example-sun.com/story-b', title: 'Story B', date: '2026-11-24T11:00:00-05:00' };
  // Story A's entry lost its title, date and closing tag: read loosely, A's address would
  // be shown with B's title and date.
  const joined = sitemap([a, b]).replace(/<lastmod>[\s\S]*?<\/url>/, '');
  assert.match(joined, /story-a<\/loc>\s*<url>/);
  const nested = sitemap([b]).replace('<url>', '<url><url>').replace('</url>', '</url></url>');
  const openComment = sitemap([b]).replace('<url>', '<!-- <url>');
  const extraClose = sitemap([b]).replace('</url>', '</url></url>');
  for (const body of [joined, nested, openComment, extraClose]) {
    assert.deepEqual(readNewsSitemap(body, SITEMAP).items, []);
    assert.equal(readNewsSitemap(body, SITEMAP).sound, false);
    const { result } = await withFetch({ [SITEMAP]: body }, () => fetchAllFeeds([feed], T0));
    assert.equal(result.sourceResults[0].status, 'malformed-feed');
    assert.deepEqual(result.articles, []);
    assert.equal(checkSourceHealth(result.sourceResults).pass, false, 'a broken sitemap is not a working source');
  }
});

test('news sitemap: a commented-out address is not read, and tags are matched by their full names', () => {
  const body = `<urlset><url>
    <!-- <loc>https://www.example-sun.com/wrong</loc> -->
    <loc>https://www.example-sun.com/right</loc>
    <image:image><image:loc>https://www.example-sun.com/picture.jpg</image:loc></image:image>
    <news:news><news:title_extra>Not the title</news:title_extra><news:title>Real title</news:title>
    <news:publication_date>2026-11-24T10:00:00-05:00</news:publication_date></news:news>
  </url></urlset>`;
  assert.deepEqual(parseNewsSitemap(body, SITEMAP), [
    { title: 'Real title', link: 'https://www.example-sun.com/right', pubDate: '2026-11-24T10:00:00-05:00', source: '' },
  ]);
  // Two addresses, or two titles, in one entry: there is no telling which is right.
  const twoLocs = sitemap([{ loc: 'https://www.example-sun.com/a</loc><loc>https://www.example-sun.com/b', title: 'T', date: '2026-11-24T10:00:00-05:00' }]);
  const twoTitles = sitemap([{ loc: 'https://www.example-sun.com/a', title: 'One</news:title><news:title>Two', date: '2026-11-24T10:00:00-05:00' }]);
  assert.deepEqual(parseNewsSitemap(twoLocs, SITEMAP), []);
  assert.deepEqual(parseNewsSitemap(twoTitles, SITEMAP), []);
});

test('news sitemap: entries present but none usable is a broken source, and so is a file with no entries', async () => {
  const feed = { url: SITEMAP, source: 'Example Sun', format: 'news-sitemap' };
  const allRefused = sitemap([{ loc: 'https://other.example/x', title: 'Story', date: '2026-11-24T12:00:00Z' }]);
  const refused = await withFetch({ [SITEMAP]: allRefused }, () => fetchAllFeeds([feed], T0));
  assert.equal(refused.result.sourceResults[0].status, 'malformed-feed');
  assert.equal(checkSourceHealth(refused.result.sourceResults).pass, false);
  assert.ok(updateFeedHealth({}, refused.result.sourceResults, T0)['Example Sun'].failingSince);

  for (const body of [sitemap([]), '<urlset><broken></urlset>']) {
    const empty = await withFetch({ [SITEMAP]: body }, () => fetchAllFeeds([feed], T0));
    assert.equal(empty.result.sourceResults[0].status, 'no-entries');
    assert.equal(checkSourceHealth(empty.result.sourceResults).pass, false);
  }
});

test('news sitemap: text inside CDATA is text, a quoted attribute may hold ">", and a closing root inside a comment does not count', async () => {
  const feed = { url: SITEMAP, source: 'Example Sun', format: 'news-sitemap' };
  const date = new Date(T0 - DAY).toISOString();
  const tricky = `<urlset><url>
    <loc note="1 > 0"><![CDATA[https://www.example-sun.com/a?x=1&y=2]]></loc>
    <news:news><news:title><![CDATA[What <url> means <!-- to D.C. --> &#8217;now&#8217; & later]]></news:title>
    <news:publication_date>${date}</news:publication_date></news:news>
  </url></urlset>\n`;
  assert.deepEqual(parseNewsSitemap(tricky, SITEMAP), [
    { title: 'What <url> means <!-- to D.C. --> \u2019now\u2019 & later', link: 'https://www.example-sun.com/a?x=1&y=2', pubDate: date, source: '' },
  ]);

  for (const body of ['<urlset><!-- </urlset> -->', '<urlset><url/></urlset>', '<urlset></urlset><url><loc>https://www.example-sun.com/a</loc></url>']) {
    const { result } = await withFetch({ [SITEMAP]: body }, () => fetchAllFeeds([feed], T0));
    assert.equal(result.sourceResults[0].status, 'malformed-feed', body);
    assert.equal(checkSourceHealth(result.sourceResults).pass, false);
  }
});

test('news sitemap: a redirect is not followed, and ordinary feeds are fetched as before', async () => {
  const body = sitemap([{ loc: 'https://www.example-sun.com/a', title: 'A', date: new Date(T0 - DAY).toISOString() }]);
  const viaSitemap = await withFetch({ [SITEMAP]: body }, () => fetchFeed({ url: SITEMAP, source: 'Example Sun', format: 'news-sitemap' }));
  assert.equal(viaSitemap.options[0].redirect, 'manual');
  const moved = await withFetch({ [SITEMAP]: 301 }, () => fetchFeed({ url: SITEMAP, source: 'Example Sun', format: 'news-sitemap' }));
  assert.equal(moved.result.status, 'http-301');
  const viaFeed = await withFetch({ 'https://example.org/feed/': rss(['a']) }, () => fetchFeed({ url: 'https://example.org/feed/', source: 'X' }));
  assert.equal(viaFeed.options[0].redirect, undefined);
});

test('paged feed: later pages are added to the first, in order, with the page number in the address', async () => {
  const feed = { url: 'https://example.org/feed/', source: 'Example Informer', pages: 3, pagePauseMs: 0 };
  assert.equal(pageUrl(feed.url, 2), 'https://example.org/feed/?paged=2');
  assert.equal(pageUrl('https://example.org/?feed=rss2', 3), 'https://example.org/?feed=rss2&paged=3');
  const routes = {
    'https://example.org/feed/': rss(['a', 'b']),
    'https://example.org/feed/?paged=2': rss(['b', 'c']),
    'https://example.org/feed/?paged=3': rss(['d']),
  };
  const { result, asked } = await withFetch(routes, () => fetchAllFeeds([feed], T0));
  assert.deepEqual(asked, Object.keys(routes));
  assert.deepEqual(result.articles.map((a) => a.title), ['Story a', 'Story b', 'Story c', 'Story d'], 'a story on two pages appears once');
  assert.equal(result.sourceResults[0].status, 'ok');
});

test('paged feed: a later page that cannot be read keeps the first page and marks the source as failing', async () => {
  const feed = { url: 'https://example.org/feed/', source: 'Example Informer', pages: 3, pagePauseMs: 0 };
  const noLink = '<?xml version="1.0"?><rss version="2.0"><channel><item><title>Story</title><pubDate>Tue, 24 Nov 2026 12:00:00 GMT</pubDate></item></channel></rss>';
  const noDates = '<?xml version="1.0"?><rss version="2.0"><channel><item><title>Story c</title><link>https://example.org/c</link><pubDate>soon</pubDate></item></channel></rss>';
  const cases = [
    [500, 'partial-page-2-http-500'],
    ['<html><body>Just a moment...</body></html>', 'partial-page-2-not-a-feed'],
    [rss(['c']).replace('</rss>', ''), 'partial-page-2-malformed-feed'],
    [noLink, 'partial-page-2-unreadable-items'],
    [noDates, 'partial-page-2-bad-dates'],
  ];
  for (const [bad, status] of cases) {
    const routes = { 'https://example.org/feed/': rss(['a']), 'https://example.org/feed/?paged=2': bad, 'https://example.org/feed/?paged=3': rss(['z']) };
    const { result, asked } = await withFetch(routes, () => fetchAllFeeds([feed], T0));
    assert.equal(asked.length, 2, 'it stops at the page that failed');
    assert.deepEqual(result.articles.map((a) => a.title), ['Story a'], 'the stories already read are still used');
    assert.equal(result.sourceResults[0].status, status);
  }
});

test('paged feed: a later page failing run after run raises the two-day alert, and one good run clears it', async () => {
  const feed = { url: 'https://example.org/feed/', source: 'Example Informer', pages: 2, pagePauseMs: 0 };
  const broken = { 'https://example.org/feed/': rss(['a']), 'https://example.org/feed/?paged=2': 500 };
  const first = (await withFetch(broken, () => fetchAllFeeds([feed], T0))).result.sourceResults;
  assert.equal(checkSourceHealth(first).pass, false, 'the only source is not fully read, so it does not count as a working one');
  let health = updateFeedHealth({}, first, T0);
  assert.equal(health['Example Informer'].failingSince, new Date(T0).toISOString());
  const later = (await withFetch(broken, () => fetchAllFeeds([feed], T0 + 3 * DAY))).result.sourceResults;
  health = updateFeedHealth(health, later, T0 + 3 * DAY);
  assert.equal(health['Example Informer'].failingSince, new Date(T0).toISOString(), 'the clock keeps running');
  assert.deepEqual(longFailingSources(health, T0 + 3 * DAY).map((f) => f.source), ['Example Informer']);

  const fixed = { 'https://example.org/feed/': rss(['a']), 'https://example.org/feed/?paged=2': rss(['b']) };
  const good = (await withFetch(fixed, () => fetchAllFeeds([feed], T0 + 4 * DAY))).result.sourceResults;
  assert.equal(updateFeedHealth(health, good, T0 + 4 * DAY)['Example Informer'].failingSince, null);
});

test('paged feed: a first page that fails asks for nothing more, and an empty later page ends quietly', async () => {
  const feed = { url: 'https://example.org/feed/', source: 'Example Informer', pages: 3, pagePauseMs: 0 };
  const failed = await withFetch({ 'https://example.org/feed/': 503 }, () => fetchFeed(feed));
  assert.equal(failed.result.status, 'http-503');
  assert.deepEqual(failed.asked, ['https://example.org/feed/']);

  const emptyPage = '<?xml version="1.0"?><rss version="2.0"><channel></channel></rss>';
  const ended = await withFetch({ 'https://example.org/feed/': rss(['a']), 'https://example.org/feed/?paged=2': emptyPage }, () => fetchFeed(feed));
  assert.equal(ended.result.status, 'ok');
  assert.equal(ended.asked.length, 2);
});

test('paged feed: the page count is capped, and a nonsense count means one page', async () => {
  const routes = Object.fromEntries([1, 2, 3, 4, 5].map((n) => [n === 1 ? 'https://example.org/feed/' : `https://example.org/feed/?paged=${n}`, rss([`p${n}`])]));
  const many = await withFetch(routes, () => fetchFeed({ url: 'https://example.org/feed/', source: 'X', pages: 50, pagePauseMs: 0 }));
  assert.equal(many.asked.length, MAX_FEED_PAGES);
  for (const pages of [0, -2, 'lots', null, 1.9]) {
    const one = await withFetch(routes, () => fetchFeed({ url: 'https://example.org/feed/', source: 'X', pages, pagePauseMs: 0 }));
    assert.equal(one.asked.length, 1, String(pages));
  }
});

test('the source list: the Washington Sun is read from its news sitemap, and paging stays small', () => {
  const sun = FEEDS.filter((f) => f.source === 'The Washington Sun');
  assert.equal(sun.length, 1);
  assert.equal(sun[0].format, 'news-sitemap');
  assert.equal(new URL(sun[0].url).hostname, 'www.washingtonsun.com');
  assert.equal(sun[0].pages, undefined, 'a sitemap is one request: the Sun asks for a 10 second crawl delay');
  for (const feed of [...FEEDS, ...NEWSLETTERS]) {
    assert.equal(new URL(feed.url).protocol, 'https:');
    assert.ok(feed.format === undefined || feed.format === 'news-sitemap', feed.source);
    assert.ok(feed.pages === undefined || (Number.isInteger(feed.pages) && feed.pages >= 2 && feed.pages <= MAX_FEED_PAGES), feed.source);
  }
  assert.equal(new Set(FEEDS.map((f) => f.source)).size, FEEDS.length, 'feed health is kept by source name');
});
