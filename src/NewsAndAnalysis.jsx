import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import NewsList, { NewsletterSection } from './components/NewsList'
import StayInTheLoop from './components/StayInTheLoop'
import { validNewsItems } from './utils/newsItems'
import { READING, readingRoute } from './data/reading'
import { formatCheckedInstant } from './utils/formatCheckedInstant'
import './App.css'
import './Reading.css'

// Same origin now: this site publishes its own feed (NEWS-AND-ANALYSIS-PRD.md).
// It used to fetch the bill tracker's copy cross-origin.
const NEWS_URL = '/api/news.json'

// A summary older than this stops being shown. Headlines keep their own dates, so they
// age honestly on their own; a stale digest does not.
const SUMMARY_MAX_AGE_MS = 72 * 60 * 60 * 1000

const DAY_MS = 24 * 60 * 60 * 1000

// The 72-hour cutoff is keyed on when the summary was written, and the pipeline rewrites
// it every run — so on a quiet stretch a "fresh" summary described five-week-old news as
// recent (2026-10, Codex review). This second cutoff keys on the coverage itself.
const SUMMARY_MAX_COVERAGE_AGE_MS = 14 * DAY_MS

// Past this, the check line also names the newest story, so an old dateline under a
// recent check reads as a quiet stretch rather than a stalled page.
const NEWEST_COVERAGE_NOTE_AFTER_MS = 7 * DAY_MS

// How far the page may sit from where a jump to a section left it and still count as
// untouched by the reader (sub-pixel rounding, a late font).
const HASH_SCROLL_TOLERANCE_PX = 8

// A feed stamp further in the future than clock skew explains is not trustworthy.
const CLOCK_SKEW_MS = 15 * 60 * 1000

function formatArticleDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function isFresh(lastUpdated) {
  const ts = new Date(lastUpdated).getTime()
  return Number.isFinite(ts) && Date.now() - ts < SUMMARY_MAX_AGE_MS
}

// lastUpdated advances only when a run gets as far as publishing (withholding preserves
// it), so during an outage it ages honestly rather than claiming a check that failed.
function validCheckedInstant(lastUpdated) {
  const ts = new Date(lastUpdated).getTime()
  return Number.isFinite(ts) && ts <= Date.now() + CLOCK_SKEW_MS ? lastUpdated : null
}

// Near-future dates (a source's clock skew) clamp to now rather than read as "newer than now".
function newestCoverage(articles = []) {
  const times = articles.map((a) => new Date(a.pubDate).getTime()).filter(Number.isFinite)
  if (!times.length) return { newest: null, age: null }
  const now = Date.now()
  const newest = Math.min(Math.max(...times), now)
  return { newest, age: now - newest }
}

function formatCoverageDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function NewsAndAnalysis() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  // Advances on its own so the 72-hour cutoff still fires in a tab left open while the
  // feed is unreachable. Relying on the poll alone did not: a repeated fetch failure sets
  // the same error value, React skips the re-render, and the age is only re-checked when
  // something renders.
  const [, setClockTick] = useState(0)

  useEffect(() => {
    const tick = setInterval(() => setClockTick((n) => n + 1), 5 * 60 * 1000)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = () =>
      fetch(NEWS_URL, { cache: 'no-store' })
        .then((r) => {
          if (!r.ok) throw new Error('not found')
          return r.json()
        })
        .then((payload) => {
          if (cancelled) return
          setData(payload)
          setError(false)
        })
        .catch(() => {
          if (!cancelled) setError(true)
        })

    load()
    // A left-open tab would otherwise keep showing a summary past its 72 hours, and
    // would never learn that one was withheld — the freshness cutoff is evaluated at
    // render, so something has to prompt another render.
    const timer = setInterval(load, 10 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  // A link to a section (/news#analysis, from the Statehood-curious "Reading" card). The
  // headlines load after the page opens and push that section down, so the page goes to
  // the section twice: once on arrival and once more when the feed settles (loaded or
  // failed). Both are immediate jumps, never animated, so the position they produce is
  // known at once and nothing moves for a reader who has asked for less motion.
  //
  // The second jump must not pull back a reader who has already moved. Movement is judged
  // by position, not by input type, so a dragged scrollbar counts: any scroll before the
  // feed settles that leaves the page away from where the first jump put it.
  //
  // All of this is per navigation (the router gives each one its own key), so arriving
  // again by a link or by Back/Forward starts afresh. No hash, no scrolling logic.
  const { hash, key: navKey } = useLocation()
  const jump = useRef(null)
  const feedSettled = Boolean(data) || error

  useLayoutEffect(() => {
    jump.current = null
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (!target) return
    // On Back/Forward the browser puts the page back where it was last time, a moment
    // after this runs, which would read as the reader moving. The setting belongs to this
    // one history entry (an address that names a section), so other pages are untouched.
    // Put back on leaving, so later pages and entries keep the browser's own behaviour.
    let previousRestoration = null
    try {
      previousRestoration = window.history.scrollRestoration
      window.history.scrollRestoration = 'manual'
    } catch {
      // Not supported: the first jump still happens.
    }
    target.scrollIntoView()
    const state = { y: window.scrollY, moved: false, settled: false }
    jump.current = state
    const onScroll = () => {
      if (!state.settled && Math.abs(window.scrollY - state.y) > HASH_SCROLL_TOLERANCE_PX) {
        state.moved = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (previousRestoration) {
        try {
          window.history.scrollRestoration = previousRestoration
        } catch {
          // Nothing to restore.
        }
      }
    }
  }, [navKey, hash])

  // A layout effect, so it runs as the headlines are put on the page and before the
  // browser reports any scroll of its own caused by the page growing.
  useLayoutEffect(() => {
    const state = jump.current
    if (!state || state.settled || !feedSettled) return
    state.settled = true
    if (!state.moved) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [navKey, hash, feedSettled])

  const checkedAt = validCheckedInstant(data?.lastUpdated)
  // Malformed entries are dropped before anything reads the list (utils/newsItems.js).
  const articles = validNewsItems(data?.articles)
  const { newest, age: coverageAge } = newestCoverage(articles)
  const showSummary =
    data?.summary &&
    isFresh(data.lastUpdated) &&
    coverageAge !== null &&
    coverageAge < SUMMARY_MAX_COVERAGE_AGE_MS

  return (
    <div className="app">
      <Nav />
      <header className="page-hero">
        <div className="container">
          <h1>News &amp; analysis</h1>
        </div>
      </header>

      <section className="impact-section" id="news">
        <div className="container">
          <h2 className="section-heading">In the news</h2>

          {error && (
            <p className="news-status">
              The news feed couldn&apos;t load right now. Try again shortly.
            </p>
          )}
          {!error && !data && <p className="news-status">Loading the latest coverage…</p>}

          {showSummary && (
            <div className="news-summary">
              <p>{data.summary}</p>
              <span className="news-ai-disclosure">
                <Icon name="sparkles" size={13} />
                AI summary of the headlines below.
              </span>
            </div>
          )}

          {checkedAt && (
            <p className="news-status news-status--meta">
              Last checked {formatCheckedInstant(checkedAt)}
              {coverageAge !== null && coverageAge >= NEWEST_COVERAGE_NOTE_AFTER_MS && (
                <> · Newest coverage: {formatCoverageDate(newest)}</>
              )}
            </p>
          )}

          {data && articles.length > 0 && <NewsList items={articles} />}
          {data && articles.length === 0 && (
            <p className="news-status">No articles in the feed right now. Check back soon.</p>
          )}

          {/* A separate list, below the headlines. The summary and its AI disclosure
              above belong to the headlines only, and the summary's freshness rules read
              `articles` only: nothing here feeds either. */}
          <NewsletterSection newsletters={data?.newsletters} />
        </div>
      </section>

      {/* Long-form work stays visually separate from the aggregated headlines: these are
          credited pieces by named authors, not links with an AI digest on top. */}
      <section className="impact-section impact-section--alt" id="analysis">
        <div className="container">
          <h2 className="section-heading">Analysis &amp; essays</h2>
          <div className="preview-grid">
            {READING.map((piece) => (
              <Link
                className="preview-card preview-card-live"
                to={readingRoute(piece.slug)}
                key={piece.slug}
              >
                <span className="reading-card-meta">
                  By {piece.author} · {formatArticleDate(piece.date)}
                </span>
                <h3>{piece.title}</h3>
                <p>{piece.dek}</p>
              </Link>
            ))}
          </div>
          <StayInTheLoop />
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default NewsAndAnalysis
