// Offline checks for analytics: which links are recorded, and what the snippet in
// index.html lets out of the browser. Run with `npm run test:analytics`.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { classifyLink, EVENTS } from '../src/lib/analytics.js'

const here = { host: 'www.representdc.org', pathname: '/the-page' }

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
  assert.equal(classifyLink('https://www.representdc.org/somewhere-else', here), null)
  assert.equal(classifyLink('https://www.representdc.org/the-page#part', here), null)
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

// Run the real snippet from index.html against a stand-in browser and take the
// before_send function it hands to PostHog.
function beforeSendFromIndexHtml(key) {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  const block = html.split('<!-- PostHog:')[1].split('<!-- End PostHog -->')[0]
  const script = block.split('<script>')[1].split('</script>')[0].replace('%VITE_POSTHOG_KEY%', key)
  const document = {
    createElement: () => ({}),
    getElementsByTagName: () => [{ parentNode: { insertBefore() {} } }],
  }
  // In a browser the global object is `window`, and the snippet relies on that.
  const window = { document, URL, encodeURIComponent }
  window.window = window
  vm.runInNewContext(script, window)
  return window.posthog?._i?.[0]?.[1]
}

test('with no key the snippet loads nothing', () => {
  assert.equal(beforeSendFromIndexHtml('%VITE_POSTHOG_KEY%'), undefined)
  assert.equal(beforeSendFromIndexHtml(''), undefined)
})

test('the settings keep cookies, autocapture and recording off', () => {
  const config = beforeSendFromIndexHtml('phc_test')
  assert.equal(config.persistence, 'memory')
  assert.equal(config.autocapture, false)
  assert.equal(config.capture_pageview, false)
  assert.equal(config.disable_session_recording, true)
  assert.equal(config.capture_heatmaps, false)
  assert.equal(config.capture_dead_clicks, false)
})

test('only campaign tags survive from an address', () => {
  const { before_send } = beforeSendFromIndexHtml('phc_test')
  const event = before_send({
    event: '$pageview',
    properties: {
      $current_url: 'https://www.representdc.org/follow?utm_source=bluesky&candidate=abc&email=a%40b.org&fbclid=XYZ#frag',
      $referrer: 'https://www.google.com/search?q=private+words',
      $referring_domain: 'www.google.com',
      $pathname: '/follow',
      utm_source: 'bluesky',
      fbclid: 'XYZ',
      $initial_gclid: 'G1',
      $set_once: { $initial_current_url: 'https://www.representdc.org/?candidate=abc&utm_campaign=sendoff', $initial_fbclid: 'XYZ' },
    },
    $set_once: { $initial_referrer: 'https://t.co/abc?x=1' },
  })
  assert.equal(event.properties.$current_url, 'https://www.representdc.org/follow?utm_source=bluesky')
  assert.equal(event.properties.$referrer, 'https://www.google.com/search')
  assert.equal(event.properties.utm_source, 'bluesky')
  assert.equal('fbclid' in event.properties, false)
  assert.equal('$initial_gclid' in event.properties, false)
  assert.equal(event.properties.$set_once.$initial_current_url, 'https://www.representdc.org/?utm_campaign=sendoff')
  assert.equal('$initial_fbclid' in event.properties.$set_once, false)
  assert.equal(event.$set_once.$initial_referrer, 'https://t.co/abc')
  assert.equal(JSON.stringify(event).includes('private'), false)
  assert.equal(JSON.stringify(event).includes('abc&'), false)
})

test('a campaign tag is cut to 100 characters', () => {
  const { before_send } = beforeSendFromIndexHtml('phc_test')
  const long = 'x'.repeat(300)
  const event = before_send({ properties: { $current_url: `https://www.representdc.org/?utm_source=${long}`, utm_source: long } })
  assert.equal(event.properties.utm_source.length, 100)
  assert.equal(event.properties.$current_url, `https://www.representdc.org/?utm_source=${'x'.repeat(100)}`)
})
