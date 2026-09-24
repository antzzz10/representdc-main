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

/**
 * Feed list carried over from the bill tracker, including its field notes — they record
 * which sources were verified and why others were rejected, which is worth keeping.
 */
export const FEEDS = [
  // News outlets — recent coverage only.
  { url: 'https://51st.news/rss/', source: 'The 51st' },
  { url: 'https://washingtoninformer.com/feed/', source: 'Washington Informer' },
  // NOTUS is a general national-politics feed, not DC-specific — confirmed valid RSS 2.0
  // (2026-07-12). Relies on the relevance filter more than the DC-focused feeds above.
  { url: 'https://www.notus.org/index.rss', source: 'NOTUS' },
  // Advocacy org blogs — publish infrequently, so allow a wider window.
  { url: 'https://acludc.org/feed/', source: 'ACLU DC', maxAgeDays: 60 },
  { url: 'https://www.dcvote.org/feed/', source: 'DC Vote', maxAgeDays: 60 },
  // Added 2026-07-12 and still unconfirmed: a direct fetch was 403'd by a bot-blocker.
  // fetchFeed fails closed, so a bad URL logs and returns a failed status rather than
  // breaking the run. Check a run's source report before trusting this one.
  { url: 'https://lwvdc.org/feed/', source: 'League of Women Voters DC', maxAgeDays: 60 },
  // Rep. Norton's office: NOT added. Every RSS path guessed either 403'd or 404'd, and
  // the one that returned a feed was a stale 2021-2022 artifact. Sen. Jain's site has no
  // feed at all. Both need a confirmed URL before they can be sources.
];

function extractCDATA(text) {
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
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
    const title = getTag(raw, 'title');
    const linkMatch =
      raw.match(/<link>(https?:\/\/[^<\s]+)<\/link>/i) ||
      raw.match(/<link[^>]*href="(https?:\/\/[^"]+)"/i);
    const link = linkMatch ? linkMatch[1] : getTag(raw, 'guid');
    const pubDate = getTag(raw, 'pubDate') || getTag(raw, 'published') || getTag(raw, 'updated');
    const sourceMatch = raw.match(/<source[^>]*>([^<]+)<\/source>/i);
    const source = sourceMatch ? extractCDATA(sourceMatch[1]).trim() : '';
    if (title && link) items.push({ title, link, pubDate, source });
  }
  return items;
}

/**
 * Fetches one feed. Never throws: returns a status the run record and G5 can read.
 * Statuses: ok | http-<code> | not-a-feed | no-items | error-<message>
 */
export async function fetchFeed({ url, source }) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return { source, url, status: `http-${res.status}`, items: [] };

    const body = await res.text();
    if (!looksLikeFeed(body)) return { source, url, status: 'not-a-feed', items: [] };
    if (!feedIsComplete(body)) return { source, url, status: 'malformed-feed', items: [] };

    const items = parseItems(body).map((a) => ({ ...a, source: a.source || source }));
    // A feed that parses but holds nothing is still a working source; it just has no
    // items. Distinguished from not-a-feed so the report can tell them apart.
    return { source, url, status: items.length ? 'ok' : 'no-items', items };
  } catch (err) {
    return { source, url, status: `error-${err.message}`, items: [] };
  }
}

/** Fetches every feed and applies each one's freshness window. */
export async function fetchAllFeeds(feeds = FEEDS, now = Date.now()) {
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
      if (seen.has(item.link)) continue;
      seen.add(item.link);
      articles.push({ ...item, _ts: new Date(item.pubDate).getTime() });
    }
  }

  return { sourceResults: results, articles };
}
