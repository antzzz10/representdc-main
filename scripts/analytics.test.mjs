// Offline checks for analytics: which links are recorded, and what the filter lets out
// of the browser. Run with `npm run test:analytics`. These test our own code. What the
// real PostHog library does with it was checked by hand in a browser (see the decision
// note, decisions/2026-11-18-analytics-events.md).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { classifyLink, cleanEvent, cleanPageUrl, referringHost, visitTags, EVENTS } from '../src/lib/analytics.js'

const HOST = 'www.representdc.org'
const here = { host: HOST, pathname: '/the-page' }

test('known destinations get their own event', () => {
  assert.equal(classifyLink('https://representdc.beehiiv.com/subscribe', here).event, EVENTS.EMAIL_SIGNUP_OPENED)
  assert.equal(classifyLink('https://bsky.app/profile/bills.representdc.org', here).event, EVENTS.BLUESKY_OPENED)
  assert.equal(classifyLink('https://billtracker.representdc.org/', here).event, EVENTS.TRACKER_OPENED)
})

test('the follow page is recorded with where the click was', () => {
  const hit = classifyLink('https://www.representdc.org/follow', here, 'nav')
  assert.deepEqual(hit, { event: EVENTS.FOLLOW_PAGE_OPENED, properties: { area: 'nav', page: '/the-page' } })
  // Already on it: not a new visit to it.
  assert.equal(classifyLink('https://www.representdc.org/follow', { host: 'www.representdc.org', pathname: '/follow' }), null)
})

test('other links inside the site are left to page views', () => {
  assert.equal(classifyLink(`https://${HOST}/somewhere-else`, here), null)
  assert.equal(classifyLink(`https://${HOST}/the-page#part`, here), null)
})

test('an outside link is recorded by host alone', () => {
  const hit = classifyLink('https://www.congress.gov/bill/119th-congress/house-bill/51?q=secret#x', here, 'page')
  assert.deepEqual(hit, {
    event: EVENTS.OUTBOUND_LINK_OPENED,
    properties: { area: 'page', page: '/the-page', host: 'www.congress.gov' },
  })
})

test('mail, phone and broken links are ignored', () => {
  assert.equal(classifyLink('mailto:someone@example.org', here), null)
  assert.equal(classifyLink('tel:+12025550100', here), null)
  assert.equal(classifyLink('not a link', here), null)
})

test('a page address keeps its path and well-formed campaign tags, nothing else', () => {
  assert.equal(
    cleanPageUrl(`https://${HOST}/follow?utm_source=bluesky&candidate=abc&fbclid=XYZ&q=words#frag`),
    `https://${HOST}/follow?utm_source=bluesky`,
  )
  // A tag that is not a short label is dropped: an email address, a sentence, a long id.
  assert.equal(cleanPageUrl(`https://${HOST}/?utm_term=someone%40example.org`), `https://${HOST}/`)
  assert.equal(cleanPageUrl(`https://${HOST}/?utm_source=two+words`), `https://${HOST}/`)
  assert.equal(cleanPageUrl(`https://${HOST}/?utm_campaign=${'x'.repeat(61)}`), `https://${HOST}/`)
  assert.equal(cleanPageUrl('javascript:alert(1)'), '')
  assert.equal(cleanPageUrl('$direct'), '')
})

test('a referrer is reduced to its host', () => {
  assert.equal(referringHost('https://www.google.com/search?q=private+words'), 'www.google.com')
  assert.equal(referringHost('$direct'), '')
  assert.equal(referringHost(''), '')
})

// Shaped like what the PostHog library builds for a visit that arrived from a search
// engine through an ad link: its own copies of the address, click identifiers, search
// words and person properties, under several prefixes.
const sdkEvent = () => ({
  uuid: 'u-1',
  event: '$pageview',
  properties: {
    token: 'phc_test',
    distinct_id: 'd-1',
    $session_id: 's-1',
    $browser: 'Safari',
    $device_type: 'Mobile',
    site: 'main',
    $current_url: `https://${HOST}/follow?utm_source=bluesky&candidate=abc&email=a%40b.org&fbclid=XYZ#frag`,
    $host: HOST,
    $pathname: '/follow',
    $referrer: 'https://www.google.com/search?q=private+words',
    $referring_domain: 'www.google.com',
    utm_source: 'bluesky',
    utm_term: 'someone@example.org',
    fbclid: 'XYZ',
    gclid: 'G1',
    oppref: 'O1',
    bfcid: 'B1',
    $fbc: 'fb.1.XYZ',
    ph_keyword: 'private words',
    $initial_gclid: 'G1',
    $session_entry_gclid: 'G1',
    $session_entry_fbclid: 'XYZ',
    $session_entry_ph_keyword: 'private words',
    $session_entry_url: `https://${HOST}/follow?candidate=abc&fbclid=XYZ`,
    $session_entry_referrer: 'https://www.google.com/search?q=private+words',
    $session_entry_utm_source: 'y'.repeat(500),
    $exception_message: 'typed text',
    something_new_in_a_later_version: 'private words',
    $set: { email: 'a@b.org' },
    $set_once: { $initial_current_url: `https://${HOST}/?candidate=abc`, $initial_ph_keyword: 'private words' },
  },
  $set: { name: 'A Visitor' },
  $set_once: { $initial_referrer: 'https://www.google.com/search?q=private+words' },
})

test('only listed properties leave the browser', () => {
  const sent = cleanEvent(sdkEvent())
  assert.deepEqual(sent, {
    uuid: 'u-1',
    event: '$pageview',
    properties: {
      token: 'phc_test',
      distinct_id: 'd-1',
      $session_id: 's-1',
      $browser: 'Safari',
      $device_type: 'Mobile',
      site: 'main',
      utm_source: 'bluesky',
      $current_url: `https://${HOST}/follow?utm_source=bluesky`,
      $host: HOST,
      $pathname: '/follow',
      $referring_domain: 'www.google.com',
    },
  })
  const text = JSON.stringify(sent)
  for (const secret of ['private', 'XYZ', 'G1', 'O1', 'B1', 'abc', 'a@b.org', 'a%40b.org', 'Visitor', 'typed', 'yyy']) {
    assert.equal(text.includes(secret), false, `"${secret}" must not be sent`)
  }
})

test('an event that is not ours is dropped whole', () => {
  for (const name of ['$exception', '$autocapture', '$snapshot', '$pageleave', '$identify', 'survey sent', 'anything']) {
    assert.equal(cleanEvent({ event: name, properties: { token: 'phc_test' } }), null)
  }
  assert.equal(cleanEvent(null), null)
})

test('our own properties are held to the values we expect', () => {
  const sent = cleanEvent({
    event: EVENTS.OUTBOUND_LINK_OPENED,
    properties: { site: 'somewhere else', area: 'sidebar', page: 'no-slash', host: 'Bad Host/with path', control: 'state' },
  })
  assert.deepEqual(sent.properties, { control: 'state' })
  const bad = cleanEvent({ event: EVENTS.OUTBOUND_LINK_OPENED, properties: { control: 'DC', candidate: 'someone' } })
  assert.deepEqual(bad.properties, {})
})

test('names every object inherits are not let through', () => {
  const sent = cleanEvent({
    event: EVENTS.BLUESKY_OPENED,
    properties: { toString: 'typed text', valueOf: 'typed text', constructor: 'typed text', hasOwnProperty: 'x', __proto__: null },
  })
  assert.deepEqual(Object.keys(sent.properties), [])
})

test('the first campaign tags seen stay with the visit, and gaps are filled with null', () => {
  const none = { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null }
  assert.deepEqual(visitTags(new URL(`https://${HOST}/`)), none)
  const tagged = { ...none, utm_source: 'bluesky' }
  assert.deepEqual(visitTags(new URL(`https://${HOST}/follow?utm_source=bluesky`)), tagged)
  assert.deepEqual(visitTags(new URL(`https://${HOST}/news`)), tagged)
  assert.deepEqual(visitTags(new URL(`https://${HOST}/news?utm_source=other&utm_medium=email`)), tagged)
  // A null tag is not sent.
  const sent = cleanEvent({ event: '$pageview', properties: { ...none, utm_source: 'bluesky' } })
  assert.deepEqual(sent.properties, { utm_source: 'bluesky' })
})

test('index.html defines the PostHog stub only when a key was set at build time', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  const script = html.split('<!-- PostHog loader stub')[1].split('<script>')[1].split('</script>')[0]
  const run = (key) => {
    const window = { document: { createElement: () => ({}), getElementsByTagName: () => [{ parentNode: { insertBefore() {} } }] } }
    window.window = window
    new Function('window', 'document', script.replace('%VITE_POSTHOG_KEY%', key))(window, window.document)
    return window.posthog
  }
  assert.equal(run('%VITE_POSTHOG_KEY%'), undefined)
  assert.equal(run(''), undefined)
  assert.equal(typeof run('phc_test').init, 'function')
  // The settings and the filter live in src/lib/analytics.js, not in the page.
  assert.equal(html.includes('posthog.init('), false)
})
