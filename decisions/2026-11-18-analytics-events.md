# Analytics events: page views and a short list of named actions

**Date:** 2026-11-18
**Status:** Built. Sends nothing until a PostHog project key is present at build time.

## Why

Cloudflare Web Analytics has counted visits here from the start, but it cannot record an
action (a click on the newsletter sign-up, a move to another RepresentDC site) or tell
which campaign sent a visit. The bill tracker has recorded four actions through PostHog
since July 2026 (`dc-bills-tracker/decisions/2026-07-27-analytics.md`). This brings the
same approach here, after a large outreach push went out with no way to see what people
did on arrival.

## What is recorded

- **One page view per path**, sent by hand when the router moves to a new path. A link
  tagged `utm_source=...` then shows which campaign sent the visit, and PostHog keeps
  that tag on the visit's later events. Cloudflare keeps counting visits too; the two
  will not match exactly, and Cloudflare stays the reference for totals. A change of
  fragment or address parameter on the same path is not counted as a new page.
- **Clicks on links we chose**, decided by `classifyLink` in `src/lib/analytics.js`:
  `email_signup_opened`, `bluesky_opened`, `follow_page_opened`, `main_site_opened`,
  `tracker_opened`, `candidates_opened`, and `outbound_link_opened` (the host only).
  Each carries the path it was on and whether the link sat in the site menu, the footer
  or the page.
- **`member_lookup_used`** on the statehood bill page: which control was used (chamber, filter or state), never the choice made or the name typed.**
- Every event carries `site: 'main'`, because all three sites share one PostHog project.

**These are counts of clicks, not of arrivals, and they run low.** The click is recorded
before the browser follows the link, so a cancelled click still counts. An event can
also be lost: PostHog's library loads after the page, and a visitor who clicks away
before it has loaded, or whose browser blocks it, leaves no record. Link clicks are
handed to the browser's send-on-exit queue to reduce that, not to remove it.

## What is not recorded

No cookies and no browser storage (`persistence: 'memory'`), no autocapture, no session
recording, no heatmaps, no surveys, no error capture. Our own code sends nothing a
visitor types and no link text.

**The filter is an allowlist.** `cleanEvent` in `src/lib/analytics.js` is PostHog's
`before_send` hook, the last step before an event leaves the browser:

- an event whose name is not one of ours is dropped whole;
- a property is kept only if its name is on the list in that file: delivery plumbing
  (project token, random per-page-load ids), browser, operating system, device type,
  screen size, language, time zone, and our own properties, each held to the values we
  expect;
- the page address is rebuilt as origin and path, plus `utm_source`, `utm_medium`,
  `utm_campaign`, `utm_content` and `utm_term` when the value is a short label
  (letters, digits, `.`, `_`, `-`, up to 60 characters). Every other address parameter
  is dropped, including `?preview=` on the follow page;
- the referrer is reduced to its host name;
- person properties (`$set`, `$set_once`) are deleted.

Anything else the PostHog library adds, now or in a later version, is dropped by
default. Checked against library version 1.450.0, which adds click identifiers
(`gclid`, `fbclid` and others, also under `$session_entry_` names), the raw user-agent
string and session-entry addresses: none of them is sent.

**What the filter cannot promise.** Three things reach PostHog that depend on what
someone else puts in a link or types in the address bar:

- the path. An address typed by hand that matches no page is still sent as a path, up to
  200 characters;
- a campaign tag that fits the short-label pattern, whoever wrote it;
- the visitor's IP address, which arrives with any web request and which PostHog's
  servers turn into an approximate location. **Open item for Andria:** switch on
  "Discard client IP data" in the PostHog project settings if it is not on already. That
  setting lives in PostHog, not in this code.

The library itself is loaded from PostHog at its current version, not a pinned one, as
on the bill tracker. The allowlist is what keeps a change in a future version from
widening what is sent. `disable_external_dependency_loading` stops the library fetching
further PostHog scripts.

## How it is switched on

`index.html` holds PostHog's loader stub, and only when `%VITE_POSTHOG_KEY%` was filled
in by Vite at build time. `initAnalytics()` in `src/lib/analytics.js` starts it with the
same key (`import.meta.env.VITE_POSTHOG_KEY`). This site is built and deployed by hand
(`npm run deploy`), so the key goes in `.env.local` in the checkout that runs the deploy
(`VITE_POSTHOG_KEY=phc_...`; `.env.local` is gitignored). The key is a publishable
project key, already visible in the tracker's page source. A deploy from a checkout
without that file ships a site with tracking off, silently. `.env.example` names the
variable.

## Checks

`npm run test:analytics` tests our own code: which links are recorded, that the filter
drops unlisted events and properties (using an event shaped like the library's), and
that the page defines the stub only when a key is set. It does not load the PostHog
library.

Checked by hand in a browser on 2026-11-18, on a local build with a made-up key and the
real library (1.450.0), landing on an address carrying `fbclid`, `gclid`, a search
parameter and an email address in `utm_term`: none of those values was in any event; an
error event and an unlisted event sent on purpose were dropped; no cookie and no
browser storage were set; the only requests to PostHog were the library and the events.
With no key, there were no requests to PostHog at all.

In local development React runs effects twice, so some events would fire twice there.
Development builds have no key, so nothing is sent.

## Not done here

- The bill tracker still sends no page views to PostHog, so campaign tags on links to
  the tracker are not attributed yet. Its events also still carry the full page address,
  including `?category=`, and it has the older filter-free setup.
- Tagging the links in Bluesky posts and newsletter issues.
