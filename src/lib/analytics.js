/**
 * Thin analytics wrapper: the only file in src/ that knows which vendor we use.
 * Same approach as the bill tracker (dc-bills-tracker src/lib/analytics.js and its
 * decisions/2026-07-27-analytics.md); see decisions/2026-11-18-analytics-events.md here.
 *
 * Privacy posture, deliberate: no cookies, no autocapture, no session recording, nothing
 * typed by a visitor, and no link text. PostHog is loaded by the snippet in index.html,
 * which also strips every address parameter except campaign tags before an event leaves
 * the browser. With no project key at build time nothing loads and every call here is a
 * no-op.
 *
 * What is recorded:
 *   - one page view per page, so tagged links (utm_source and friends) show which
 *     campaign sent a visit;
 *   - clicks on a short list of links we care about (classifyLink below);
 *   - the named events in EVENTS.
 */

/** PostHog is loaded by an async snippet in index.html, so it may not exist yet. */
/** Which RepresentDC site sent the event; all three share one PostHog project. */
const SITE = 'main'

function client() {
  return typeof window !== 'undefined' ? window.posthog : undefined
}

/**
 * Record an event. Safe to call anywhere: it does nothing when analytics is absent
 * (local dev, or a build with no key) and never throws, because a broken tracker must
 * not break the page.
 */
export function track(event, properties = {}) {
  const ph = client()
  if (!ph || typeof ph.capture !== 'function') return
  try {
    ph.capture(event, { site: SITE, ...properties })
  } catch {
    // Analytics is never worth surfacing an error to a visitor.
  }
}

/** Event names, kept in one place so call sites can't drift or typo them apart. */
export const EVENTS = {
  /** A visitor opened the newsletter sign-up page. */
  EMAIL_SIGNUP_OPENED: 'email_signup_opened',
  /** A visitor opened the Bluesky account. */
  BLUESKY_OPENED: 'bluesky_opened',
  /** A visitor went to the "Stay in the loop" page. */
  FOLLOW_PAGE_OPENED: 'follow_page_opened',
  /** A visitor crossed to another RepresentDC site. */
  MAIN_SITE_OPENED: 'main_site_opened',
  TRACKER_OPENED: 'tracker_opened',
  CANDIDATES_OPENED: 'candidates_opened',
  /** A visitor followed a link to a source outside RepresentDC. Host only. */
  OUTBOUND_LINK_OPENED: 'outbound_link_opened',
  /** A visitor used a control on the cosponsor lookup. The control's name only. */
  MEMBER_LOOKUP_USED: 'member_lookup_used',
}

const HOSTS = {
  'representdc.beehiiv.com': EVENTS.EMAIL_SIGNUP_OPENED,
  'bsky.app': EVENTS.BLUESKY_OPENED,
  'www.representdc.org': EVENTS.MAIN_SITE_OPENED,
  'representdc.org': EVENTS.MAIN_SITE_OPENED,
  'billtracker.representdc.org': EVENTS.TRACKER_OPENED,
  'candidates.representdc.org': EVENTS.CANDIDATES_OPENED,
}

const isFollowPath = (pathname) => pathname === '/follow' || pathname === '/follow/'

/**
 * Decide whether a clicked link is one we record, and as what. Pure, so it can be tested
 * without a browser (scripts/analytics.test.mjs).
 *
 *   href  the link's resolved address (anchor.href)
 *   here  where the visitor is: { host, pathname }
 *   area  'nav', 'footer' or 'page'
 *
 * Returns { event, properties } or null. Properties never include link text, address
 * parameters or fragments; an outside link is recorded by host alone.
 */
export function classifyLink(href, here, area = 'page') {
  let url
  try {
    url = new URL(href)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null // mailto:, tel:
  const base = { area, page: here.pathname }

  if (url.host === here.host) {
    // Links within this site are covered by page views, apart from the follow page,
    // where knowing which button was used (menu, footer or page) is the point.
    if (isFollowPath(url.pathname) && !isFollowPath(here.pathname)) {
      return { event: EVENTS.FOLLOW_PAGE_OPENED, properties: base }
    }
    return null
  }

  const known = HOSTS[url.host]
  if (known === EVENTS.MAIN_SITE_OPENED && isFollowPath(url.pathname)) {
    return { event: EVENTS.FOLLOW_PAGE_OPENED, properties: base }
  }
  if (known) return { event: known, properties: base }
  return { event: EVENTS.OUTBOUND_LINK_OPENED, properties: { ...base, host: url.host } }
}

function areaOf(anchor) {
  if (anchor.closest('nav')) return 'nav'
  if (anchor.closest('footer')) return 'footer'
  return 'page'
}

function onClick(e) {
  // A plain left click, or a middle click that opens a new tab (auxclick, button 1).
  if (e.type === 'auxclick' && e.button !== 1) return
  const anchor = e.target instanceof Element ? e.target.closest('a[href]') : null
  if (!anchor) return
  const hit = classifyLink(anchor.href, window.location, areaOf(anchor))
  if (hit) track(hit.event, hit.properties)
}

let installed = false

/** Listen for clicks on links, once. Call from the app's entry point. */
export function installLinkTracking() {
  if (installed || typeof document === 'undefined') return
  installed = true
  // Capture phase: this must run before the router handles the click, because the
  // router changes the address at once and "page" has to be the page the click was on.
  document.addEventListener('click', onClick, true)
  document.addEventListener('auxclick', onClick, true)
}

let lastPath = null

/**
 * Record a page view for a path. The site is a single-page app, so the router calls this
 * on each navigation. A repeat of the same path is ignored (React runs effects twice in
 * development, and a change of fragment is not a new page).
 */
export function trackPageview(pathname) {
  if (pathname === lastPath) return
  lastPath = pathname
  track('$pageview')
}
