/**
 * RSS/Atom fetching and parsing for the news digest.
 *
 * Ported from dc-bills-tracker/scripts/fetch-news.js with one substantive change: a
 * source now has to return something that actually parses as a feed. The old version
 * treated any HTTP 200 as success, so a feed endpoint serving an HTML error page looked
 * exactly like a quiet news day — and the site would have published an empty feed as
 * the truth (Codex round 2, finding 9).
 */

const USER_AGENT =
  'RepresentDC News Aggregator (www.representdc.org)';
const FETCH_TIMEOUT_MS = 10000;
export const DEFAULT_MAX_AGE_DAYS = 30;
// A feed may ask for later pages of itself (`pages`). Capped, with a pause between pages.
export const MAX_FEED_PAGES = 5;
const PAGE_PAUSE_MS = 1000;

/**
 * Feed list carried over from the bill tracker, including its field notes — they record
 * which sources were verified and why others were rejected, which is worth keeping.
 */
export const FEEDS = [
  // News outlets — recent coverage only.
  { url: 'https://51st.news/rss/', source: 'The 51st' },
  // `pages: 3` (2026-11-24): this feed holds ten items, about 16 hours of stories, and
  // GitHub has run the scan as much as a day apart, so stories fell out before a scan saw
  // them. Pages 2 and 3 of the same WordPress feed (?paged=N) reach back about five days.
  // robots.txt disallows none of it and sets no crawl delay.
  { url: 'https://washingtoninformer.com/feed/', source: 'Washington Informer', pages: 3 },
  { url: 'https://washingtoncitypaper.com/feed', source: 'Washington City Paper' },
  // NOTUS renamed itself twice in 2026: a planned rebrand to "The Star" was blocked by a
  // trademark suit from a separate, unrelated revived Washington Star newspaper (added
  // below), so NOTUS became The Washington Sun instead. notus.org now 301s here; this
  // points at the canonical URL directly rather than riding that redirect chain.
  // General national-politics feed, not DC-specific — confirmed valid RSS 2.0
  // (2026-09-29, carried over from the same confirmation on notus.org, 2026-07-12).
  // Relies on the relevance filter more than the DC-focused feeds above.
  //
  // 2026-11-24: index.rss now carries ONE item, the newest story, so two scans a day saw
  // at most two of the Sun's stories and missed the rest (three statehood stories between
  // Oct 27 and Nov 20 among them). Replaced by the Sun's Google News sitemap, which lists
  // every story from about the last two days with its title, link and publication time
  // (45 stories when checked). robots.txt allows it; its crawl delay of 10 seconds is
  // met by making one request per run.
  { url: 'https://www.washingtonsun.com/news-sitemap-content.xml', source: 'The Washington Sun', format: 'news-sitemap' },
  // The revived (2026) Washington Star — a separate outlet from the Sun above, see the
  // note there. Confirmed valid RSS 2.0 (2026-09-29), runs on Substack.
  { url: 'https://www.twstar.com/feed', source: 'The Washington Star' },
  // Congress-specific, not DC-specific — relevant because most DC-statehood action
  // happens as congressional action on DC (riders, oversight, home-rule bills).
  { url: 'https://thehill.com/homenews/house/feed/', source: 'The Hill (House)' },
  { url: 'https://thehill.com/homenews/senate/feed/', source: 'The Hill (Senate)' },
  // Roll Call's URL changed on 2026-11-21: the old path
  // (www.rollcall.com/rss/tag/rss-feed/all-news) had returned 404 on every run since
  // 2026-11-18, and nothing alerted because G5 only fails when every source fails.
  // rollcall.com/feed/ confirmed returning 200 on 2026-11-21. A source failing for two
  // days is now surfaced by the run (archive.mjs, feedHealth).
  { url: 'https://rollcall.com/feed/', source: 'Roll Call' },
  // Added 2026-11-21. All three returned 200 with items that day using this fetcher's
  // user agent. Each note records what the outlet's terms and robots.txt said when
  // checked; this pipeline takes the headline, link, source and date only.
  // - WAMU: terms restrict reusing content and say nothing about a headline and a link;
  //   robots.txt allows generic bots.
  { url: 'https://wamu.org/feed/', source: 'WAMU' },
  // - The GW Hatchet: no terms of use found; robots.txt allows crawling with a crawl
  //   delay of 6 seconds, which one request per run respects.
  //   `pages: 5` (2026-11-24): the Hatchet publishes a whole issue at once, 30 to 40
  //   stories on a Monday, and its feed holds ten, so most of an issue was gone before a
  //   scan ran (four statehood stories on Nov 2 were missed that way). Five pages hold 50
  //   stories. The pause between pages is its crawl delay plus a margin.
  { url: 'https://gwhatchet.com/feed/', source: 'The GW Hatchet', pages: 5, pagePauseMs: 6500 },
  // - NBC Washington: this exact URL, because robots.txt expressly allows it. The
  //   NBCUniversal terms were only partly read, so this one is not fully cleared.
  { url: 'https://www.nbcwashington.com/?rss=y&most_recent=y', source: 'NBC Washington' },
  // Added 2026-11-24, after a terms and robots.txt check that day (one request per run
  // each, which meets every crawl delay below). All four returned 200 with items using
  // this fetcher's user agent.
  // - HillRag (Capital Community News): no terms page found; crawl delay 20 seconds.
  { url: 'https://www.hillrag.com/feed/', source: 'HillRag' },
  // - Howard University News Service: its About page says its work may be used if the
  //   journalist and the service are credited. This pipeline shows a headline and a link
  //   under the service's name and does not show the journalist.
  { url: 'https://hunewsservice.com/feed/', source: 'Howard University News Service' },
  // - The Wash (American University): no terms page found; crawl delay 10 seconds.
  { url: 'https://thewash.org/feed/', source: 'The Wash' },
  // - The Hoya (Georgetown University): no site terms page found; crawl delay 6 seconds.
  { url: 'https://thehoya.com/feed/', source: 'The Hoya' },
  // Checked the same day, NOT added: Washington Blade (its terms bar republishing its RSS
  // feed without permission, so ask first) and The Well News (terms page returned 403 and
  // was not read).
  // Advocacy org blogs — publish infrequently, so allow a wider window.
  { url: 'https://acludc.org/feed/', source: 'ACLU DC', maxAgeDays: 60 },
  // `statehoodOrg`: a statehood organisation, so its posts pass the topic rule whatever
  // the headline says (relevance-rules.mjs). Set on DC Vote only (2026-11-21). The model
  // filter still has to say yes first. fetchAllFeeds copies the flag onto each item
  // fetched from THIS feed as `_statehoodOrg`; the exemption reads that, never the
  // item's source label, which a <source> tag in any feed could set to "DC Vote".
  { url: 'https://www.dcvote.org/feed/', source: 'DC Vote', maxAgeDays: 60, statehoodOrg: true },
  // League of Women Voters DC (lwvdc.org/feed/): REMOVED 2026-11-21. Added 2026-07-12
  // unconfirmed, and a bot-blocker returned 403 on 89 of 89 recorded runs, so it never
  // contributed an article. Needs a URL that answers this fetcher before it comes back.
  // Rep. Norton's office: NOT added. Every RSS path guessed either 403'd or 404'd, and
  // the one that returned a feed was a stale 2021-2022 artifact. Sen. Jain's site has no
  // feed at all. Both need a confirmed URL before they can be sources.
  //
  // Checked 2026-09-29, NOT added:
  // - Politico: every feed path (politico.com/rss/*) returns a Cloudflare bot challenge
  //   (403 "Just a moment..."), same failure mode as League of Women Voters DC above.
  // - City Cast DC: podcast-first network, no RSS feed for written articles at any
  //   standard path (checked /feed, /rss, /news/feed, /news/rss — all 404).
  // - House Oversight Committee (oversight.house.gov/feed/): resolves and parses as
  //   valid RSS, but every item's pubDate is from December 2020 — an abandoned endpoint
  //   left live by a since-migrated site, not a dead URL. Would silently contribute zero
  //   fresh items forever rather than erroring, so worth remembering not to re-add
  //   without re-checking actual item dates, not just HTTP status.
  // - DC Council's "News RSS" (dccouncil.gov/dc-council-rss-feeds/): links to a
  //   GovDelivery email-subscription signup page, not an actual RSS/Atom feed.
  // - DCist: permanently shut down by WAMU, February 2024.
  //
  // Checked 2026-11-21, NOT added (terms or robots.txt, not a technical failure):
  // - WUSA9: the feed licence is for individuals' personal use, and the terms bar scripts.
  // - Axios: the feed host's robots.txt disallows everything.
  // - WTOP: terms bar systematic retrieval into a database, which the archive is.
  // - Washington Post: paywalled, and the terms were not read.
  // - Politico: terms not read (and the feeds were bot-blocked on 2026-09-29, above).
  // - FOX 5 DC: the terms name deep linking.
  // - AP and Reuters: robots.txt and terms bar automated reading.
  // - Google News RSS: for use in a personal feed reader only.
];

/**
 * Newsletters, kept apart from FEEDS on purpose (newsletters.mjs explains the rule): they
 * carry more opinion than news coverage, so they get their own list on the page, no model
 * reads them, they are never archived, and they do not count toward G5. Fetched and
 * validated by the same code as FEEDS.
 */
export const NEWSLETTERS = [
  // League of Women Voters DC on Substack: the weekly "Full Rights Update". Returned 200
  // on 2026-11-21, and Substack's robots.txt allows /feed. This is the League's
  // newsletter, not its website feed (lwvdc.org/feed/), which was removed above.
  { url: 'https://lwvdc.substack.com/feed', source: 'League of Women Voters DC' },
];

function extractCDATA(text) {
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

const NAMED_ENTITIES = {
  quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  ndash: '–', mdash: '—', hellip: '…',
};

/**
 * Feeds escape titles inconsistently: WordPress sends `&#8217;` inside CDATA, where XML
 * leaves it untouched, so it reached the page verbatim ("DC&#8217;s", 2026-10-07).
 * `&amp;` goes first so a double-escaped `&amp;#8217;` also resolves.
 */
export function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (m, n) => safeCodePoint(Number(n)) ?? m)
    .replace(/&#x([0-9a-f]+);/gi, (m, n) => safeCodePoint(parseInt(n, 16)) ?? m)
    .replace(/&([a-z]+);/gi, (m, name) =>
      Object.hasOwn(NAMED_ENTITIES, name.toLowerCase()) ? NAMED_ENTITIES[name.toLowerCase()] : m,
    );
}

function safeCodePoint(n) {
  const valid = Number.isInteger(n) && n > 0 && n <= 0x10ffff && !(n >= 0xd800 && n <= 0xdfff);
  return valid ? String.fromCodePoint(n) : null;
}

function getTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? extractCDATA(match[1]).trim() : '';
}

/** Does this body actually look like a feed document, rather than an HTML error page? */
export function looksLikeFeed(body) {
  const head = body.slice(0, 2000).toLowerCase();
  if (/<!doctype html|<html[\s>]/.test(head) && !/<rss|<feed/.test(head)) return false;
  return /<rss[\s>]|<feed[\s>]|<rdf:rdf[\s>]/.test(head);
}

/**
 * Did the document finish?
 *
 * Opening `<rss>` is not enough. A response truncated mid-stream still looks like a feed
 * and still parses to zero items — which would otherwise be indistinguishable from a
 * genuinely quiet source, and would let a broken feed count toward G5's "at least one
 * source worked".
 */
export function feedIsComplete(body) {
  return /<\/rss>|<\/feed>|<\/rdf:RDF>/i.test(body);
}

/** RSS `<item>` and Atom `<entry>` both reduce to the same shape. */
export function parseItems(xml) {
  const items = [];
  const blocks = [
    ...xml.matchAll(/<item[\s>]([\s\S]*?)<\/item>/g),
    ...xml.matchAll(/<entry[\s>]([\s\S]*?)<\/entry>/g),
  ];
  for (const [, raw] of blocks) {
    const title = decodeEntities(getTag(raw, 'title'));
    const linkMatch =
      raw.match(/<link>(https?:\/\/[^<\s]+)<\/link>/i) ||
      raw.match(/<link[^>]*href="(https?:\/\/[^"]+)"/i);
    // XML-escaped query strings ("?a=1&amp;b=2") would otherwise request the wrong URL.
    // Only &amp;: a URL is not prose, so the headline decoder does not apply.
    const link = (linkMatch ? linkMatch[1] : getTag(raw, 'guid')).replace(/&amp;/g, '&');
    const pubDate = getTag(raw, 'pubDate') || getTag(raw, 'published') || getTag(raw, 'updated');
    const sourceMatch = raw.match(/<source[^>]*>([^<]+)<\/source>/i);
    const source = sourceMatch ? decodeEntities(extractCDATA(sourceMatch[1]).trim()) : '';
    if (title && link) items.push({ title, link, pubDate, source });
  }
  return items;
}

/** A Google News sitemap: `<urlset>` of `<url>` entries, each with a `<news:news>` block. */
export function looksLikeNewsSitemap(body) {
  const head = body.slice(0, 2000).toLowerCase();
  if (/<!doctype html|<html[\s>]/.test(head)) return false;
  return /<urlset[\s>]/.test(head);
}

export function newsSitemapIsComplete(body) {
  return /<\/urlset>/i.test(body);
}

// Attributes on a tag, allowing a quoted value to hold a `>`.
const ATTRS = `(?:\\s(?:"[^"]*"|'[^']*'|[^>"'])*)?`;

/**
 * A sitemap's text with CDATA sections turned into ordinary escaped text and comments
 * removed, in that order, so a `<url>` or `<!--` that is only text inside a CDATA title is
 * never read as markup, and a tag inside a comment is never read at all.
 */
function plainXml(xml) {
  return xml
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (m, text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'))
    .replace(/<!--[\s\S]*?-->/g, '');
}

/** The text of `<tag>` inside `xml`, only when that exact tag appears exactly once. */
function onlyTag(xml, tag) {
  const matches = [...xml.matchAll(new RegExp(`<${tag}${ATTRS}>([\\s\\S]*?)<\\/${tag}>`, 'g'))];
  const opens = xml.match(new RegExp(`<${tag}[\\s>/]`, 'g')) ?? [];
  return matches.length === 1 && opens.length === 1 ? matches[0][1].trim() : '';
}

/**
 * Reads a Google News sitemap into the same shape parseItems returns. Takes the story's
 * address, its `<news:title>` and its `<news:publication_date>`, nothing else.
 *
 * Strict on purpose, because a title shown beside the wrong link is worse than a missed
 * story (Codex, medium and high, 2026-11-24):
 * - comments are removed first, so a commented-out `<loc>` cannot be read, and the file
 *   has to end with a real `</urlset>`, not one inside a comment;
 * - `sound` is false when the entries do not open and close one for one, or one entry
 *   starts inside another. A missing `</url>` would otherwise join one story's address
 *   to the next story's title and date. Nothing is taken from an unsound file;
 * - an entry needs exactly one `<loc>`, one `<news:title>` and one
 *   `<news:publication_date>`, matched by their full names;
 * - an address on a different host from the sitemap, or not https, is dropped: the
 *   sitemap rules do not allow one, and the page shows these links under the outlet's name.
 *
 * `entries` is how many entries the file held, so a caller can tell a file whose every
 * entry was refused from an empty one.
 */
export function readNewsSitemap(xml, sitemapUrl) {
  const host = new URL(sitemapUrl).hostname;
  const clean = plainXml(xml);
  // `<url/>` counts as an entry that opens and never closes, so it makes the file unsound.
  const opens = (clean.match(/<url[\s>/]/g) ?? []).length;
  const closes = (clean.match(/<\/url>/g) ?? []).length;
  const blocks = [...clean.matchAll(new RegExp(`<url${ATTRS}>([\\s\\S]*?)<\\/url>`, 'g'))].map((m) => m[1]);
  const sound =
    !clean.includes('<!--') &&
    /<\/urlset>\s*$/.test(clean) &&
    opens === closes &&
    blocks.length === opens &&
    blocks.every((raw) => !/<url[\s>/]/.test(raw));
  if (!sound) return { sound: false, entries: opens, items: [] };

  const items = [];
  for (const raw of blocks) {
    // An address is not prose: only its XML escapes are undone, not typographic entities.
    const link = onlyTag(raw, 'loc').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    const title = decodeEntities(onlyTag(raw, 'news:title'));
    const pubDate = onlyTag(raw, 'news:publication_date');
    let linkHost = null;
    try {
      const parsed = new URL(link);
      if (parsed.protocol === 'https:' && !parsed.username && !parsed.password) linkHost = parsed.hostname;
    } catch {
      // not an address: dropped below
    }
    if (title && linkHost === host) items.push({ title, link, pubDate, source: '' });
  }
  return { sound: true, entries: opens, items };
}

export function parseNewsSitemap(xml, sitemapUrl) {
  return readNewsSitemap(xml, sitemapUrl).items;
}

/**
 * One document, checked. Never throws. `blocks` is how many items the document held
 * before any were refused, for the paging check in fetchFeed.
 */
async function fetchDocument(url, format) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      // A sitemap is asked for once and a redirect is not followed: the one outlet read
      // this way asks for ten seconds between requests, and a followed redirect is a
      // second request straight away. A moved sitemap shows up as http-301 instead.
      ...(format === 'news-sitemap' ? { redirect: 'manual' } : {}),
    });
    if (!res.ok) return { status: `http-${res.status}`, items: [], blocks: 0 };

    const body = await res.text();
    if (format === 'news-sitemap') {
      if (!looksLikeNewsSitemap(body)) return { status: 'not-a-feed', items: [], blocks: 0 };
      if (!newsSitemapIsComplete(body)) return { status: 'malformed-feed', items: [], blocks: 0 };
      const { sound, entries, items } = readNewsSitemap(body, url);
      // Entries present but none usable is a broken file, not a quiet outlet.
      if (!sound || (entries > 0 && items.length === 0)) return { status: 'malformed-feed', items: [], blocks: entries };
      // No entries at all also counts as failing. A news sitemap covers about two days of
      // a daily outlet, so an empty one is far more likely broken than quiet, and a file
      // of unrecognised tags with no entries would otherwise pass as a healthy source
      // (Codex, 2026-11-24).
      if (entries === 0) return { status: 'no-entries', items: [], blocks: 0 };
      return { status: 'ok', items, blocks: entries };
    }
    if (!looksLikeFeed(body)) return { status: 'not-a-feed', items: [], blocks: 0 };
    if (!feedIsComplete(body)) return { status: 'malformed-feed', items: [], blocks: 0 };
    const items = parseItems(body);
    const blocks = (body.match(/<item[\s>]|<entry[\s>]/g) ?? []).length;
    // A feed that parses but holds nothing is still a working source; it just has no
    // items. Distinguished from not-a-feed so the report can tell them apart.
    return { status: items.length ? 'ok' : 'no-items', items, blocks };
  } catch (err) {
    return { status: `error-${err.message}`, items: [], blocks: 0 };
  }
}

/** Page N of a WordPress feed: the same address with `paged=N`. */
export function pageUrl(url, page) {
  const paged = new URL(url);
  paged.searchParams.set('paged', String(page));
  return paged.toString();
}

/**
 * Fetches one feed. Never throws: returns a status the run record and G5 can read.
 * Statuses: ok | http-<code> | not-a-feed | malformed-feed | no-items | error-<message> |
 * partial-page-<n>-<why> (a paged feed whose later page could not be read) | no-entries
 * (a news sitemap with nothing in it, which counts as failing).
 * `format: 'news-sitemap'` reads a Google News sitemap instead of RSS or Atom. `pages`
 * also reads pages 2..N of a WordPress feed (at most MAX_FEED_PAGES).
 */
export async function fetchFeed({ url, source, format, pages = 1, pagePauseMs = PAGE_PAUSE_MS }) {
  const first = await fetchDocument(url, format);
  const items = [...first.items];
  let status = first.status;

  // Later pages only add to a first page that worked. A later page that cannot be read
  // makes the source `partial-page-N-<why>`: the stories already read are still used, but
  // the source counts as failing, so the run record and the two-day alert show that the
  // older stories, the reason for paging, are not being read (Codex, 2026-11-24). Only a
  // page with no items at all ends paging quietly.
  const lastPage = format === 'news-sitemap' ? 1 : Math.min(Math.max(1, Math.trunc(pages) || 1), MAX_FEED_PAGES);
  for (let page = 2; first.status === 'ok' && page <= lastPage; page++) {
    if (pagePauseMs > 0) await new Promise((resolve) => setTimeout(resolve, pagePauseMs));
    const next = await fetchDocument(pageUrl(url, page), format);
    if (next.status === 'no-items' && next.blocks === 0) break;
    const dated = next.items.filter((a) => Number.isFinite(new Date(a.pubDate).getTime()));
    const why = next.status === 'no-items' ? 'unreadable-items' : next.status !== 'ok' ? next.status : dated.length === 0 ? 'bad-dates' : null;
    if (why) {
      status = `partial-page-${page}-${why}`;
      break;
    }
    items.push(...next.items);
  }

  return { source, url, status, items: items.map((a) => ({ ...a, source: a.source || source })) };
}

/** Fetches every feed and applies each one's freshness window. */
export async function fetchAllFeeds(feeds = FEEDS, now = Date.now(), kind = 'news') {
  const results = [];
  const articles = [];
  const seen = new Set();

  for (const feed of feeds) {
    const result = await fetchFeed(feed);
    const maxAgeDays = feed.maxAgeDays ?? DEFAULT_MAX_AGE_DAYS;
    const cutoff = now - maxAgeDays * 24 * 60 * 60 * 1000;

    const fresh = result.items.filter((a) => {
      const ts = new Date(a.pubDate).getTime();
      return Number.isFinite(ts) && ts > cutoff;
    });

    // A feed whose items all carry unparseable dates is broken, not quiet. Counting it
    // healthy let a date-format regression mask other failures and replace good headlines
    // with an empty feed, reported as a normal run (Codex, high).
    const datedItems = result.items.filter((a) => Number.isFinite(new Date(a.pubDate).getTime()));
    const allDatesBad = result.items.length > 0 && datedItems.length === 0;

    results.push({
      source: feed.source,
      // 'news' or 'newsletter'. G5 counts news sources only.
      kind,
      // feedHealth key. Distinct for newsletters so one can never inherit the failure
      // date of a news feed with the same display name (archive.mjs, updateFeedHealth).
      ...(kind === 'newsletter' ? { healthKey: `newsletter:${feed.source}` } : {}),
      url: feed.url,
      // 'ok' covers a live feed whose items are all older than its window: the source
      // worked, it simply has nothing recent.
      status: allDatesBad ? 'bad-dates' : result.status === 'no-items' ? 'ok' : result.status,
      fetched: result.items.length,
      dated: datedItems.length,
      fresh: fresh.length,
      maxAgeDays,
    });

    for (const item of fresh) {
      // Newsletter items are deduped later, by selectNewsletters, after its safety
      // checks: deduping here would let a bad first copy of a link discard a good one.
      if (kind !== 'newsletter') {
        if (seen.has(item.link)) continue;
        seen.add(item.link);
      }
      // The list's own label, always, for a newsletter: an item-level <source> tag must
      // not be able to relabel opinion as coming from somewhere else.
      articles.push({
        ...item,
        ...(kind === 'newsletter' ? { source: feed.source } : {}),
        _ts: new Date(item.pubDate).getTime(),
        // Internal, like _ts: set from the feed's configuration, after the spread so
        // nothing parsed out of the feed can supply it. Never published or archived:
        // archive.mjs and the run record copy named fields only.
        _statehoodOrg: feed.statehoodOrg === true,
      });
    }
  }

  return { sourceResults: results, articles };
}
