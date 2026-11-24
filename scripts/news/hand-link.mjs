/**
 * "Add a news link": the owner adds one article to the news page by hand (2026-11-23).
 *
 * Why it exists: the stories she most wants often come from outlets whose terms bar
 * scripts (AP, the Washington Post, WTOP, Axios), so the scan may not read them. She
 * reads them herself and adds the link. A person choosing a link is the whole point: no
 * script fetches the outlet. This module never touches the network, and nothing in the
 * add-link path calls a model.
 *
 * A hand-added link goes straight into the archive's confirmed `items`, marked
 * `addedBy: "hand"`. That makes it exactly what a twice-confirmed article is to every
 * later scan (archive.mjs): permanent, shown inside its display window, never sent to
 * the relevance filter, never put to the topic rule, never rewritten.
 *
 * Pure functions: no network, no clock, no files. scripts/news/add-link.mjs does the
 * reading and writing, through publishFeed like every other writer.
 */

import { decodeEntities, FEEDS, DEFAULT_MAX_AGE_DAYS } from './feeds.mjs';
import { isHttpsUrl, checkArticles, MAX_ARTICLES } from './gates.mjs';
import { DISPLAY_WINDOW_DAYS } from './archive.mjs';

export const MAX_TITLE_LENGTH = 200;
export const MAX_SOURCE_LENGTH = 60;
export const MAX_LINK_LENGTH = 2000;
/** Written to api/news.json when adding a link changed the articles the summary was about. */
export const HAND_LINK_DECISION = 'link-added-by-hand';

const DAY_MS = 24 * 60 * 60 * 1000;

// Control characters, including tab and newline: a headline is one line of text.
const CONTROL = /[\u0000-\u001F\u007F-\u009F\u2028\u2029]/;
// Anything shaped like a tag or a comment. Checked AFTER entities are decoded, so
// "&lt;b&gt;" is caught as well as "<b>".
const HTML = /<\s*[a-z!/?]|<!--|-->/i;

/** Each feed's own display window by source name, as the scan uses for confirmed items. */
export function windowDaysBySource(feeds = FEEDS) {
  return Object.fromEntries(feeds.map((feed) => [feed.source, feed.maxAgeDays ?? DEFAULT_MAX_AGE_DAYS]));
}

function cleanText(raw, label, maxLength, errors) {
  if (typeof raw !== 'string') {
    errors.push(`${label} is missing`);
    return '';
  }
  // Decoded FIRST, the same way feed titles are (so a pasted "D.C.&#8217;s" reads
  // correctly), and only then checked: "&#7;" and "&#27;[31m" are control characters
  // once decoded, and "&lt;b&gt;" is a tag.
  const decoded = decodeEntities(raw);
  if (CONTROL.test(raw) || CONTROL.test(decoded)) errors.push(`${label} has a line break or other control character in it`);
  const text = decoded.replace(/\s+/g, ' ').trim();
  if (!text) errors.push(`${label} is empty`);
  if (HTML.test(text)) errors.push(`${label} looks like it contains HTML`);
  if (text.length > maxLength) errors.push(`${label} is ${text.length} characters; the limit is ${maxLength}`);
  return text;
}

/**
 * The link, checked harder than a feed's links are, because a person pastes it and a
 * person will trust it. Returns { link, host } or pushes plain reasons onto `errors`.
 *
 * A link can be built to read as one site and go to another, so on top of isHttpsUrl
 * (https, a hostname, no username or password part): no spaces or control characters, a
 * length limit, and a host that is a real domain name (has a dot, is not an IP address).
 * None of that can catch a look-alike domain such as "apnews.com.example.org", which is
 * a perfectly valid address. For that the script prints the host on its own line
 * ("Link goes to: ...") in the preview and the result, for the owner to read.
 */
export function checkHandLinkUrl(raw, errors) {
  const link = typeof raw === 'string' ? raw.trim() : '';
  const before = errors.length;
  if (CONTROL.test(link) || /\s/.test(link)) errors.push('link has a space or control character in it');
  if (link.length > MAX_LINK_LENGTH) errors.push(`link is ${link.length} characters; the limit is ${MAX_LINK_LENGTH}`);
  let url = null;
  try {
    url = new URL(link);
  } catch {
    url = null;
  }
  if (url && (url.username !== '' || url.password !== '')) {
    errors.push(`link has a username or password part before an @ sign; it really goes to ${url.hostname}`);
  } else if (!isHttpsUrl(link)) {
    errors.push('link must be a full https address, for example https://apnews.com/article/...');
  } else if (url.hostname.startsWith('[') || /^\d+(\.\d+){3}$/.test(url.hostname)) {
    errors.push(`link goes to a bare network address (${url.hostname}), not a named website`);
  } else if (!url.hostname.replace(/\.$/, '').includes('.')) {
    errors.push(`link goes to "${url.hostname}", which is not a full website name`);
  }
  return errors.length === before ? { link, host: url.hostname } : { link, host: null };
}

/** Today's calendar date in a time zone, as YYYY-MM-DD. */
function dayIn(timeZone, now) {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(now));
}

/**
 * Checks what the owner typed. Returns { ok, errors, entry }. `entry` (when ok) is
 * { link, host, title, source, pubDate } with pubDate as an ISO instant.
 *
 * The date is a calendar day, YYYY-MM-DD. Which "today"?
 *
 *   - Left blank, it is today in Washington (America/New_York), where the owner is.
 *   - A typed date is accepted up to today's date in UTC and refused after it, with no
 *     tolerance. UTC is ahead of every U.S. time zone, so her own "today" is never
 *     refused as tomorrow: at 8 p.m. in Washington it is already the next day in UTC,
 *     and both dates are accepted. Tomorrow, by any U.S. clock, is refused.
 *   - It is stored as noon UTC on that day (the same day in every U.S. time zone), or
 *     as the current instant if noon UTC is still ahead. A displayed article dated ahead
 *     of the clock would fail G4 on every scan.
 */
export function validateHandLink({ link, title, source, date }, now) {
  const errors = [];

  const checkedLink = checkHandLinkUrl(link, errors);
  const cleanTitle = cleanText(title, 'title', MAX_TITLE_LENGTH, errors);
  const cleanSource = cleanText(source, 'source', MAX_SOURCE_LENGTH, errors);

  const todayUtc = new Date(now).toISOString().slice(0, 10);
  const day = typeof date === 'string' && date.trim() ? date.trim() : dayIn('America/New_York', now);
  let pubDate = null;
  const start = /^\d{4}-\d{2}-\d{2}$/.test(day) ? Date.parse(`${day}T00:00:00Z`) : NaN;
  // Date.parse accepts "2026-02-31" and rolls it over; a real day survives a round trip.
  if (!Number.isFinite(start) || new Date(start).toISOString().slice(0, 10) !== day) {
    errors.push(`date must be a real day written YYYY-MM-DD, for example ${todayUtc}`);
  } else if (day > todayUtc) {
    // Calendar days compared as text: YYYY-MM-DD sorts in date order.
    errors.push(`date ${day} is in the future (today is ${todayUtc})`);
  } else {
    pubDate = new Date(Math.min(start + 12 * 60 * 60 * 1000, now)).toISOString();
  }

  return {
    ok: errors.length === 0,
    errors,
    entry: errors.length === 0 ? { link: checkedLink.link, host: checkedLink.host, title: cleanTitle, source: cleanSource, pubDate } : null,
  };
}

/**
 * Is the branch's api/news.json in the shape this writer builds on? Throws a plain
 * message if not. Without this, a missing or mangled `articles` was read as "no
 * articles" and the file was quietly rebuilt from the archive alone, dropping whatever
 * the page showed. A malformed feed is something for a person (or the next scan) to
 * put right, not something to paper over while adding a link.
 */
export function assertFeedShape(feed) {
  const problems = [];
  if (feed === null || typeof feed !== 'object' || Array.isArray(feed)) {
    throw new Error('api/news.json on the site is not in the expected shape (it is not an object). Nothing was changed; run a scan to rebuild it');
  }
  if (!Array.isArray(feed.articles)) problems.push('"articles" is not a list');
  else {
    feed.articles.forEach((a, i) => {
      const where = `article ${i + 1}`;
      if (a === null || typeof a !== 'object' || Array.isArray(a)) return problems.push(`${where} is not an object`);
      if (typeof a.title !== 'string' || !a.title) problems.push(`${where} has no title`);
      if (!isHttpsUrl(a.link)) problems.push(`${where} has no https link`);
      if (typeof a.source !== 'string' || !a.source) problems.push(`${where} has no source`);
      if (typeof a.pubDate !== 'string' || !Number.isFinite(new Date(a.pubDate).getTime())) problems.push(`${where} has no readable date`);
      return undefined;
    });
  }
  if (feed.newsletters !== undefined && !Array.isArray(feed.newsletters)) problems.push('"newsletters" is not a list');
  if (problems.length) {
    throw new Error(`api/news.json on the site is not in the expected shape: ${problems.slice(0, 4).join('; ')}. Nothing was changed; run a scan to rebuild it`);
  }
}

function inWindow(item, now, windows) {
  const days = Math.max(Object.hasOwn(windows, item.source) ? windows[item.source] : DISPLAY_WINDOW_DAYS, DISPLAY_WINDOW_DAYS);
  return new Date(item.pubDate).getTime() > now - days * DAY_MS;
}

const asArticle = (a) => ({ title: a.title, link: a.link, pubDate: a.pubDate, source: a.source });

/**
 * What one push attempt writes when a link is added by hand. Called from inside
 * publishFeed's `apply`, so it runs again on fresh state after a rejected push.
 *
 * @param current         the branch's api/news.json (must exist)
 * @param currentArchive  the branch's archive (must exist: this writer never bootstraps)
 * @param entry           a validated { link, title, source, pubDate }
 * @param now             ms
 * @param windows         display window by source name (windowDaysBySource())
 * @param id              this writer's own id, for the live check (see below)
 *
 * Returns { status, feed, archive, displayedChanged, shows, summaryDropped }:
 *   status 'already-there'  the link is already a confirmed item. Nothing to write
 *                           (feed and archive are null).
 *   status 'promoted'       the link was pending on one model yes; it is confirmed now,
 *                           under the title, source and date given by hand, keeping the
 *                           pending entry's firstSeen.
 *   status 'added'          a new confirmed item.
 *
 * `articles` is rebuilt as a scan would for confirmed items (inside the window, newest
 * first, capped), plus any article currently in the file that is not confirmed: those
 * are this morning's unconfirmed scan results, and a hand edit must not wipe them.
 *
 * The summary: it was judged against the old article list. If the list changes, the
 * headlines publish and the summary does not (summaryDecision "link-added-by-hand");
 * the next scan writes a new one. If the list is unchanged (the new item is outside the
 * window or below the cap) the summary stays.
 *
 * Not changed: runId and lastUpdated (the page's "Last checked" is about scans),
 * newsletters, withheldAt (a withholding on the branch stays), and everything else in
 * the file. `handAdded` records this edit, and its `id` is what the live check looks for.
 */
export function composeHandLink({ current, currentArchive, entry, now, windows = windowDaysBySource(), id }) {
  if (!current) throw new Error('there is no api/news.json on gh-pages yet; run a scan first');
  if (!currentArchive) throw new Error('there is no archive to add to');
  // Before anything is decided, including "already there": a malformed feed stops here.
  assertFeedShape(current);

  if (currentArchive.items.some((item) => item.link === entry.link)) {
    return { status: 'already-there', feed: null, archive: null, displayedChanged: false, shows: false, summaryDropped: false };
  }

  const nowIso = new Date(now).toISOString();
  const wasPending = currentArchive.pending.find((p) => p.link === entry.link) ?? null;
  const item = {
    link: entry.link,
    title: entry.title,
    source: entry.source,
    pubDate: entry.pubDate,
    firstSeen: wasPending?.firstSeen ?? nowIso,
    confirmedAt: nowIso,
    addedBy: 'hand',
  };
  const archive = {
    ...currentArchive,
    items: [...currentArchive.items, item],
    pending: currentArchive.pending.filter((p) => p.link !== entry.link),
  };

  const confirmed = new Set(archive.items.map((i) => i.link));
  const before = current.articles;
  const seen = new Set();
  const articles = [
    ...archive.items.filter((i) => inWindow(i, now, windows)).map(asArticle),
    ...before.filter((a) => !confirmed.has(a.link)).map(asArticle),
  ]
    .filter((a) => (seen.has(a.link) ? false : seen.add(a.link)))
    .sort((a, b) => (new Date(b.pubDate).getTime() || 0) - (new Date(a.pubDate).getTime() || 0))
    .slice(0, MAX_ARTICLES);

  // The same gate a scan's list has to pass. Nothing is written if it fails.
  const check = checkArticles(articles, null, now);
  if (!check.pass) throw new Error(`the article list would be rejected: ${check.detail}`);

  const displayedChanged = JSON.stringify(articles) !== JSON.stringify(before.map(asArticle));
  const summaryDropped = displayedChanged && Boolean(current.summary);

  let feed = { ...current, articles, handAdded: { id, at: nowIso, link: entry.link } };
  if (displayedChanged) {
    feed = { ...feed, summary: null, summarySource: null, summaryCheck: null, summaryDecision: HAND_LINK_DECISION };
  }

  return {
    status: wasPending ? 'promoted' : 'added',
    feed,
    archive,
    displayedChanged,
    shows: articles.some((a) => a.link === entry.link),
    summaryDropped,
  };
}
