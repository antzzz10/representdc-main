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

- **One page view per page**, sent by hand on each route change. With it, a link tagged
  `utm_source=...` shows which campaign sent the visit. Cloudflare keeps counting visits
  too; the two will not match exactly, and Cloudflare stays the reference for totals.
- **Clicks on links we chose**, decided by `classifyLink` in `src/lib/analytics.js`:
  `email_signup_opened`, `bluesky_opened`, `follow_page_opened`, `main_site_opened`,
  `tracker_opened`, `candidates_opened`, and `outbound_link_opened` (the host only).
  Each carries the page it was on and whether the link sat in the menu, the footer or
  the page.
- **`member_lookup_used`** on the statehood bill page: which control was used (chamber, filter or state), never the choice made or the name typed.**
- Every event carries `site: 'main'`, because all three sites share one PostHog project.

## What is not recorded

Same rules as the tracker: no cookies (`persistence: 'memory'`), no autocapture, no
session recording, no heatmaps, no surveys. Nothing a visitor types. No link text.

**Nothing from the address except campaign tags.** A `before_send` function in
`index.html` cuts every web address in an event down to origin and path. The page's own
address keeps `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` and `utm_term`,
each cut to 100 characters. Per-click ad identifiers (`fbclid`, `gclid` and similar) are
deleted. The `?preview=` parameter on the follow page is dropped with the rest.

PostHog still attaches what a browser sends with any request: browser and device type,
screen size, language, time zone, and the visitor's IP address, which its servers turn
into an approximate location. **Open item for Andria:** switch on "Discard client IP
data" in the PostHog project settings if it is not on already. That setting lives in
PostHog, not in this code.

## How it is switched on

The snippet reads `%VITE_POSTHOG_KEY%`, filled in by Vite at build time. This site is
built and deployed by hand (`npm run deploy`), so the key goes in `.env.local` in the
checkout that runs the deploy (`VITE_POSTHOG_KEY=phc_...`; `.env.local` is gitignored).
The key is a publishable project key, already visible in the tracker's page source.
A deploy from a checkout without that file ships a site with tracking off, silently.
`.env.example` names the variable.

## Checks

`npm run test:analytics` covers which links are recorded, that the snippet loads nothing
without a key, that the privacy settings are as stated, and that only campaign tags
survive from an address. Checked in a browser on 2026-11-18 with a stand-in for PostHog:
the events fire with the properties above, no cookie is set, and with no key there are
no requests to PostHog.

## Not done here

- The bill tracker still sends no page views to PostHog, so campaign tags on links to
  the tracker are not attributed yet. Its events also still carry the full page address,
  including `?category=`.
- Tagging the links in Bluesky posts and newsletter issues.
