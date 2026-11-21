/**
 * Newsletters: a second, separate list on /news (added 2026-11-21).
 *
 * The owner's rule: newsletters carry more opinion than news coverage, so they must not
 * be mixed in with the headlines. They are therefore kept apart all the way through:
 *
 *   - their own feed list (NEWSLETTERS in feeds.mjs), fetched by the same code;
 *   - no model ever sees them: not the relevance filter, not the summary, not the judge;
 *   - they are never in `articles`, so G4's "summary was written from exactly this set"
 *     does not include them, and the page's AI disclosure stays true;
 *   - they are never archived, pending or confirmed (archive.mjs never receives them);
 *   - they do not count toward G5: a working newsletter feed must not make an all-failed
 *     news fetch look like a quiet news day.
 *
 * A newsletter problem never costs the reader the headlines. A bad item is dropped, and a
 * failed newsletter feed publishes an empty list on a healthy run. The feed's failure
 * still goes into feedHealth, so the two-day failing-feed issue covers it.
 *
 * Pure: no network, no clock.
 */

import { archivable } from './archive.mjs';

export const MAX_NEWSLETTERS = 5;
export const NEWSLETTER_WINDOW_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The `newsletters` array for api/news.json: items from the last 30 days, newest first,
 * at most five overall, in the same four-field shape as `articles`.
 *
 * `archivable` is G4's per-item check (a link that parses as an https URL with a host, a
 * title, a source, a parseable date not in the future beyond tolerance). Here a failing
 * item is left out instead of failing the run, because nothing else depends on this list.
 *
 * Order matters: validate, THEN dedupe. Deduping first let a bad first copy of a link
 * (say, one dated in the future) discard a good later copy of the same link, and then
 * get dropped itself. fetchAllFeeds does not dedupe newsletter items for that reason.
 */
export function selectNewsletters(items, now) {
  const seen = new Set();
  return (Array.isArray(items) ? items : [])
    .filter((item) => archivable(item, now))
    .filter((item) => new Date(item.pubDate).getTime() > now - NEWSLETTER_WINDOW_DAYS * DAY_MS)
    .filter((item) => (seen.has(item.link) ? false : seen.add(item.link)))
    .map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: new Date(item.pubDate).toISOString(),
      source: item.source,
    }))
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, MAX_NEWSLETTERS);
}
