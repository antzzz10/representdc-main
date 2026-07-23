# Decision: Standalone /news page, built ahead of the Statehood-curious facelift

**Date:** 2026-07-23
**Context:** The next scoped chunk of Phase 4 (see `WHATS-NEXT.md`) was the full
`/statehood-curious` build — hybrid case-for-statehood copy, a ported news section, a
stakeholder org list, and an accuracy eval pipeline. Before committing to that whole
facelift, the user wanted to see the news piece alone first and rescoped: pull the news
feed out of `dc-bills-tracker` (where it's only an inline `<NewsFeed>` section in
`App.jsx`, no dedicated page, no router installed there) and try it as its own page.

This resolves the open question left in `~/.claude/.../memory/project_news_separate_page.md`
(raised 2026-07-22 in the wrong repo, redirected here) — scope was genuinely
undetermined until this conversation.

## Where should the page live?

**Options considered:**
1. New standalone `/news` route in `representdc-main` (chosen)
2. Build straight into `/statehood-curious`, replacing the "Statehood in the news"
   preview card in place — no new route, but harder to judge the news piece on its own
   since the rest of that page is still placeholder cards
3. New route inside `dc-bills-tracker` itself — would require adding a router there
   (none installed today), and keeps news attached to the bill-tracker product rather
   than "breaking it out," which was the explicit ask

**Chosen:** Option 1. Standalone artifact, fully separable from the segment-mapping
decisions already approved in `decisions/2026-07-20-segment-mapping.md` — nothing about
`/statehood-curious`'s picker destination or interim-page content changes as a result of
this page existing.

## How discoverable should it be?

**Options considered:**
1. Unlinked — direct URL only (chosen)
2. Linked from the `/statehood-curious` interim page, replacing that page's "Statehood
   in the news" preview card
3. Added to main nav immediately

**Chosen:** Option 1. This is a trial to evaluate before deciding whether it earns a
permanent spot in the IA — linking it now would presume that outcome.

## Implementation

- `src/News.jsx` — new page, same `Nav`/`page-hero`/`Footer` shell as `TakeAction.jsx`
  and `StatehoodCurious.jsx`. Fetches `https://billtracker.representdc.org/api/news.json`
  client-side (confirmed the endpoint sends `access-control-allow-origin: *`, so no
  proxy or new pipeline needed — same static JSON the bill tracker's inline feed already
  reads, not a duplicate fetch).
- Route added at `/news` in `src/App.jsx`. Not added to `Nav.jsx`, `Home.jsx`, or any
  footer link — direct-URL only per the discoverability decision above.
- New CSS block in `App.css` (`.news-status`, `.news-list`, `.news-item*`) alongside the
  existing secondary-page patterns (`.page-hero`, `.preview-card`, etc.).
- Verified with a Playwright walkthrough against the dev server: page renders, live
  fetch returns real articles (5 at time of testing), no console errors other than a
  Cloudflare Analytics CORS warning on `localhost` (expected in dev, not present in
  production).

## Open follow-up

Once this has been looked at, decide whether `/statehood-curious`'s eventual news
section should embed this same fetch, link out to `/news`, or whether `/news` absorbs
that page's role entirely — deferred until the trial has been reviewed.
