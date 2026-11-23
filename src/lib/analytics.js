/**
 * Thin analytics wrapper: the only file in src/ that knows which vendor we use.
 * Decision and privacy rules: decisions/2026-11-18-analytics-events.md. The bill tracker
 * has the older version of this approach (dc-bills-tracker src/lib/analytics.js).
 *
 * Privacy posture, deliberate: no cookies, no autocapture, no session recording, nothing
 * typed by a visitor, and no link text. index.html holds only PostHog's loader stub, and
 * only when a project key was present at build time; everything else is here so it can
 * be tested (scripts/analytics.test.mjs).
 *
 * What is recorded:
 *   - one page view per path, so tagged links (utm_source and friends) show which
 *     campaign sent a visit;
 *   - clicks on a short list of links we care about (classifyLink below);
 *   - which of the four home page picker cards was clicked (one of four fixed labels);
 *   - the named events in EVENTS.
 *
 * The safety net is cleanEvent, PostHog's before_send hook. It is an allowlist: an event
 * whose name is not ours is dropped, and a property whose name is not listed in ALLOWED
 * is dropped, whatever a future version of the PostHog library decides to add.
 */

/** Which RepresentDC site sent the event; all three share one PostHog project. */
const SITE = 'main'

/** Event names, kept in one place so call sites can't drift or typo them apart. */
export const EVENTS = {
  /** A visitor clicked a link to the newsletter sign-up page. */
  EMAIL_SIGNUP_OPENED: 'email_signup_opened',
  /** A visitor clicked a link to the Bluesky account. */
  BLUESKY_OPENED: 'bluesky_opened',
  /** A visitor clicked a link to the "Stay in the loop" page. */
  FOLLOW_PAGE_OPENED: 'follow_page_opened',
  /** A visitor clicked a link to another RepresentDC site. */
  MAIN_SITE_OPENED: 'main_site_opened',
  TRACKER_OPENED: 'tracker_opened',
  CANDIDATES_OPENED: 'candidates_opened',
  /** A visitor clicked a link to a source outside RepresentDC. Host only. */
  OUTBOUND_LINK_OPENED: 'outbound_link_opened',
  /** A visitor used a control on the cosponsor lookup. The control's name only. */
  MEMBER_LOOKUP_USED: 'member_lookup_used',
  /** A visitor clicked a card in the home page picker. Which of the four cards only. */
  PICKER_PATH_CHOSEN: 'picker_path_chosen',
}

/** The four picker cards, in page order. The only values the `path` property may hold. */
export const PICKER_PATHS = ['new-to-dc', 'curious', 'questioning', 'activist']

const PAGEVIEW = '$pageview'
const OUR_EVENTS = new Set([PAGEVIEW, ...Object.values(EVENTS)])

// ─── What may leave the browser ────────────────────────────────────────────

const CAMPAIGN_TAGS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
// A campaign tag is a short label we put on our own links ("bluesky", "sendoff-2026-11").
// Anything else in that slot (an email address, a sentence, a long identifier) is dropped.
const TAG_VALUE = /^[A-Za-z0-9_.-]{1,60}$/

/** Properties we set ourselves, with the values each may hold. */
const OWN = {
  site: (v) => v === SITE,
  area: (v) => v === 'nav' || v === 'footer' || v === 'page',
  page: (v) => typeof v === 'string' && v.startsWith('/') && v.length <= 200,
  host: (v) => typeof v === 'string' && /^[a-z0-9.-]{1,100}$/.test(v),
  control: (v) => v === 'chamber' || v === 'filter' || v === 'state',
  path: (v) => typeof v === 'string' && PICKER_PATHS.includes(v),
}

/** PostHog's own properties that are kept as they are: delivery plumbing and device type. */
const ALLOWED = new Set([
  'token', 'distinct_id', '$device_id', '$session_id', '$window_id', '$insert_id', '$time',
  '$lib', '$lib_version', '$process_person_profile', '$is_identified',
  '$browser', '$browser_version', '$os', '$os_version', '$device_type',
  '$screen_height', '$screen_width', '$viewport_height', '$viewport_width',
  '$browser_language', '$timezone',
])

/**
 * A page address cut down to origin and path, plus any well-formed campaign tags.
 * Returns '' for anything that is not a web address.
 */
export function cleanPageUrl(value) {
  let url
  try {
    url = new URL(value)
  } catch {
    return ''
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return ''
  const tags = campaignTags(url)
  const query = Object.entries(tags).map(([k, v]) => `${k}=${v}`).join('&')
  return url.origin + url.pathname.slice(0, 200) + (query ? `?${query}` : '')
}

/** The well-formed campaign tags on an address, as { utm_source: 'bluesky', ... }. */
export function campaignTags(url) {
  const tags = {}
  for (const name of CAMPAIGN_TAGS) {
    const value = url.searchParams.get(name)
    if (value && TAG_VALUE.test(value)) tags[name] = value
  }
  return tags
}

/** Where a visit came from, as a host name only ("www.google.com"), or ''. */
export function referringHost(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.host : ''
  } catch {
    return ''
  }
}

/**
 * PostHog's before_send hook: the last thing that runs before an event leaves the
 * browser. Returns the event to send, or null to drop it.
 */
export function cleanEvent(event) {
  if (!event || !OUR_EVENTS.has(event.event)) return null
  const given = event.properties && typeof event.properties === 'object' ? event.properties : {}
  const kept = {}
  for (const [name, value] of Object.entries(given)) {
    if (ALLOWED.has(name)) kept[name] = value
    else if (Object.hasOwn(OWN, name) && OWN[name](value)) kept[name] = value
    else if (CAMPAIGN_TAGS.includes(name) && typeof value === 'string' && TAG_VALUE.test(value)) kept[name] = value
  }
  // Addresses are rebuilt, never passed through.
  const pageUrl = cleanPageUrl(given.$current_url)
  if (pageUrl) {
    const url = new URL(pageUrl)
    kept.$current_url = pageUrl
    kept.$host = url.host
    kept.$pathname = url.pathname
  }
  const from = referringHost(given.$referrer)
  if (from) kept.$referring_domain = from
  event.properties = kept
  // Person properties are never used: the site identifies no one.
  delete event.$set
  delete event.$set_once
  return event
}

const CONFIG = {
  api_host: 'https://us.i.posthog.com',
  persistence: 'memory',        // cookieless: no consent banner needed
  autocapture: false,           // only the events we chose
  capture_pageview: false,      // sent by hand per path, see trackPageview
  capture_pageleave: false,
  disable_session_recording: true,

  // These default to "ask PostHog's server", and the server turns them on (verified on
  // the bill tracker, 2026-07-28). Only an explicit false keeps them off. Do not remove
  // these lines.
  capture_dead_clicks: false,
  capture_performance: false,   // Cloudflare already does Core Web Vitals
  capture_heatmaps: false,
  capture_exceptions: false,
  rageclick: false,
  disable_surveys: true,
  disable_web_experiments: true,
  disable_external_dependency_loading: true, // no extra PostHog scripts, whatever the server says
  advanced_disable_flags: true, // we use no feature flags

  before_send: cleanEvent,
}

// ─── Sending ───────────────────────────────────────────────────────────────

/** PostHog's loader stub, put on the page by index.html when a key was set at build time. */
function client() {
  return typeof window !== 'undefined' ? window.posthog : undefined
}

let started = false

/** Start PostHog, once. Does nothing without a project key. */
export function initAnalytics() {
  if (started) return
  // Never in local development, even when .env.local holds the key for deploys.
  if (import.meta.env?.DEV) return
  const key = import.meta.env?.VITE_POSTHOG_KEY
  const ph = client()
  if (!key || !ph || typeof ph.init !== 'function') return
  started = true
  try {
    ph.init(key, CONFIG)
  } catch {
    // Analytics is never worth surfacing an error to a visitor.
  }
}

/**
 * The page's address, campaign tags and referring host, read now. PostHog would fill
 * these in itself, but only when its library has finished loading, and by then a quick
 * visitor may be on another page. Reading them at the moment of the event keeps a page
 * view on the page it belongs to.
 */
function whereNow() {
  if (typeof window === 'undefined') return {}
  const pageUrl = cleanPageUrl(window.location.href)
  if (!pageUrl) return {}
  const from = referringHost(document.referrer)
  return {
    $current_url: pageUrl,
    ...visitTags(new URL(pageUrl)),
    ...(from ? { $referrer: `https://${from}/` } : {}),
  }
}

let firstTags = null

/**
 * The campaign tags for this visit: the first tagged address seen since the page loaded,
 * kept in memory so the tag stays with the visit as the visitor moves around the site.
 * All five names are always given, null when absent, so PostHog cannot fill a gap later
 * from whatever address the visitor has reached by then.
 */
export function visitTags(url) {
  const here = campaignTags(url)
  if (!firstTags && Object.keys(here).length > 0) firstTags = here
  const tags = firstTags ?? {}
  return Object.fromEntries(CAMPAIGN_TAGS.map((name) => [name, tags[name] ?? null]))
}

/**
 * Record an event. Safe to call anywhere: it does nothing when analytics is absent
 * (local dev, or a build with no key) and never throws, because a broken tracker must
 * not break the page. `leaving` marks a click that may take the visitor off the page,
 * so the event is handed to the browser to send even if the page closes.
 */
export function track(event, properties = {}, { leaving = false } = {}) {
  const ph = client()
  if (!ph || typeof ph.capture !== 'function') return
  try {
    const options = leaving ? { send_instantly: true, transport: 'sendBeacon' } : undefined
    ph.capture(event, { ...whereNow(), site: SITE, ...properties }, options)
  } catch {
    // Analytics is never worth surfacing an error to a visitor.
  }
}

// ─── Link clicks ───────────────────────────────────────────────────────────

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
 * without a browser.
 *
 *   href  the link's resolved address (anchor.href)
 *   here  where the visitor is: { host, pathname }
 *   area  'nav' (the site menu), 'footer' or 'page'
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
  if (anchor.closest('nav.nav')) return 'nav' // the site menu, not a contents list
  if (anchor.closest('footer')) return 'footer'
  return 'page'
}

function onClick(e) {
  // A plain left click, or a middle click that opens a new tab (auxclick, button 1).
  if (e.type === 'auxclick' && e.button !== 1) return
  const anchor = e.target instanceof Element ? e.target.closest('a[href]') : null
  if (!anchor) return
  const hit = classifyLink(anchor.href, window.location, areaOf(anchor))
  if (hit) track(hit.event, hit.properties, { leaving: true })
}

let installed = false

/** Listen for clicks on links, once. Call from the app's entry point. */
export function installLinkTracking() {
  if (installed || typeof document === 'undefined') return
  installed = true
  // Capture phase: this must run before the router handles the click, because the
  // router changes the address at once and "page" has to be the page the click was on.
  // It records the click, not the arrival: another handler may still cancel it.
  document.addEventListener('click', onClick, true)
  document.addEventListener('auxclick', onClick, true)
}

// ─── Page views ────────────────────────────────────────────────────────────

let lastPath = null

/**
 * Record a page view for a path. The site is a single-page app, so the router calls this
 * on each change of path. A repeat of the same path is ignored (React runs effects twice
 * in development; a change of fragment or address parameter is not a new page).
 */
export function trackPageview(pathname) {
  if (pathname === lastPath) return
  lastPath = pathname
  track(PAGEVIEW)
}
