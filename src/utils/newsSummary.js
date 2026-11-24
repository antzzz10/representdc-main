// When the news summary shows, and what the page says about how old the coverage is.
// Pure, so the rules can be tested without a browser (scripts/eval/news-summary.test.mjs).

const DAY_MS = 24 * 60 * 60 * 1000

// A summary written longer ago than this stops being shown. The scan rewrites it on
// every run, so this only fires when the scan itself has stopped: nothing has checked
// for newer coverage, and the page should not say otherwise.
export const SUMMARY_MAX_AGE_MS = 72 * 60 * 60 * 1000

// Past this, the page names the newest story, so old coverage under a recent check
// reads as a quiet stretch rather than a stalled page. The summary used to be hidden
// after 14 quiet days; it now stays, with this note in front of it (Andria, 2026-11-24).
export const QUIET_NOTE_AFTER_MS = 7 * DAY_MS

// A scan stamp further in the future than clock skew explains is not trustworthy.
export const CLOCK_SKEW_MS = 15 * 60 * 1000

// Only a real date string counts: `new Date(null)` is 1970, not "no date".
function publishedAt(article) {
  const value = article?.pubDate
  return typeof value === 'string' && value.trim() !== '' ? new Date(value).getTime() : NaN
}

// Near-future dates (a source's clock skew) clamp to now rather than read as "newer than now".
// allDated is false when any headline has no usable date: it could be newer than the rest.
export function newestCoverage(articles = [], now = Date.now()) {
  const all = articles.map(publishedAt)
  const times = all.filter(Number.isFinite)
  if (!times.length) return { newest: null, age: null, allDated: false }
  const newest = Math.min(Math.max(...times), now)
  return { newest, age: now - newest, allDated: times.length === all.length }
}

export function formatCoverageDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function isFresh(lastUpdated, now) {
  const ts = new Date(lastUpdated).getTime()
  return Number.isFinite(ts) && ts <= now + CLOCK_SKEW_MS && now - ts < SUMMARY_MAX_AGE_MS
}

/**
 * showSummary: a summary exists, the scan ran within 72 hours, and there is at least one
 *   dated headline for it to describe. The age of the headlines no longer hides it.
 * quietSince: the newest headline's date, once it is a week old; otherwise null. Shown
 *   inside the summary when there is one, and on the "Last checked" line when there is not.
 *   Null when any headline on the page has no usable date, since "nothing newer" would
 *   then be a guess.
 */
export function summaryState({ summary, lastUpdated, articles }, now = Date.now()) {
  const { newest, age, allDated } = newestCoverage(articles, now)
  const showSummary =
    typeof summary === 'string' && summary.trim() !== '' && isFresh(lastUpdated, now) && age !== null
  const quietSince =
    allDated && age !== null && age >= QUIET_NOTE_AFTER_MS ? formatCoverageDate(newest) : null
  return { showSummary, quietSince }
}
