# Decision: Persona picker restoration, category-cards placement, Statehood-curious page

**Date:** 2026-07-12
**Context:** Reviewing the dev server against the confirmed design surfaced that the
2026-07-10 "scope discrepancy" call (declining to build the homepage's persona picker
because the handoff README only mentioned "a homepage teaser") was likely a
misreading — the persona picker is core substance (segment-specific pathways), not
scope creep. This note resolves the questions that follow from restoring it.

## Persona picker: restore it

The design's actual homepage is Hero → Stats → **persona picker** ("Where do you want
to start?" — New to D.C. / Statehood-curious / Statehood-questioning / Statehood-
activist) → Explainer → Values → Solution → Footer, with nav realigned to Explainer ·
The Case · Myths & FAQ · Bill Tracker · [Take action]. Rebuilding `Home.jsx`/`Nav.jsx`
to match is in progress under Phase 4 of `WHATS-NEXT.md`.

## Category-cards section: moves to its own page

The design's homepage doesn't include the category-cards section ("What Congress has
blocked" — 7 categories, each with multi-paragraph descriptions and expandable talking
points) at all, but it's real, substantial content on the live site today. Decided:
move it to its own page (`/the-case`) rather than keep it on the homepage or leave it
homeless.

**Why:** it's the densest content on the site — multi-paragraph descriptions per
category plus nested talking points, more detailed than anything else on the homepage.
Giving it a real URL means the persona picker, nav, footer, Myths & FAQ, and the new
Statehood-curious page can all link to one canonical destination instead of a
homepage-only anchor that doesn't work cleanly from other pages. It also lightens the
homepage back toward the design's leaner, persona-driven intent without actually
cutting the content.

## Statehood-curious destination page

Per the earlier options discussion (all four locked in):
- **Content model:** hybrid — a short, tightly-sourced "why statehood" framing unique
  to the page, linking into already-vetted existing content (Values/Solution/Myths)
  for depth rather than authoring new persuasive claims from scratch. Minimizes new
  accuracy-review surface area.
- **News integration:** fetch dc-bills-tracker's already-published `news.json`
  directly (it's a public static file) rather than duplicating the fetch/filter
  pipeline in a second repo.
- **Stakeholder content:** pull forward a static version of the Tier 1/Tier 2 org list
  from the Action & Persona IA Brainstorm now, rather than wait for the full
  interactive stakeholder map (Phase 4's original scope).
- **Eval process:** a staged pipeline — cheap trusted-domain allowlist gate first,
  then an LLM-assisted citation-support check (does the cited source actually support
  the claim?) only for claims that pass the domain gate. Flag anything failing either
  stage for human sign-off. This is the project's first real eval process; reusable
  beyond this page.

### News sources (dc-bills-tracker's `scripts/fetch-news.js`)

Requested additions verified individually rather than added on trust:
- **NOTUS** (`https://www.notus.org/index.rss`) — confirmed valid RSS, added. General
  national-politics feed, not DC-specific, so it leans on the existing Claude
  relevance filter more than the DC-focused feeds do.
- **League of Women Voters DC** (`https://lwvdc.org/feed/`) — added, but unverified.
  Returned 403 to direct fetch attempts (both a verification tool and a direct `curl`
  using the script's own User-Agent) — looks like WAF/bot-blocking rather than
  confirmation the feed doesn't exist. `fetchFeed()` already fails closed (logs a
  warning, returns `[]`, doesn't break the run) — check the next scheduled Action run's
  log for a "Failed: https://lwvdc.org/feed/" line before trusting this is live.
- **Rep. Eleanor Holmes Norton's office** — NOT added. Every guessed RSS path either
  403'd, 404'd, or (in the one case that returned real data, `/rss.xml`) turned out to
  be a stale artifact from an old site redesign — items dated 2021–2022 ("117th
  Congress convenes"). Needs a manually-confirmed current feed URL before this source
  can be added correctly; shipping the stale one would have quietly undermined the
  "known trusted sources" guardrail rather than served it.
- **Sen. Ankit Jain's site** — skipped. Confirmed no RSS/Atom feed exists at all (a
  manually-maintained listing page, not a blog feed). Not worth custom scraping code
  for one source unless it becomes important enough to justify it later.

## Take Action Hub: coming-soon placeholder, with real content previewed

Take Action Hub itself has no build scope yet (Phase 7). Until then, the "Statehood
activist" persona card links to a coming-soon page that previews specific planned
content rather than a bare "coming soon" message:
- A toolkit for outreach to key members of Congress, keyed to the current status of
  live bills
- Ways to get involved at the state level: leading the push for statehood resolutions
  in state legislatures, and offering testimony when state-level statehood bills come
  up for a vote
- **"No donation without representation"** — encouraging donors to withhold financial
  or time support from candidates seeking it who haven't committed to statehood

## Next step
Execute Phase 4: rebuild Home.jsx/Nav.jsx, build the `/the-case` page, build the
Statehood-curious page and its eval pipeline, build the Take Action Hub coming-soon
page.

## Executed (same day)

Homepage/nav rebuild, `/the-case`, and `/take-action` are done — see the files
directly (`src/Home.jsx`, `src/components/Nav.jsx`, `src/TheCase.jsx`,
`src/TakeAction.jsx`, `src/App.jsx` for routes, `src/App.css` for `.page-hero`/
`.persona-*`/`.preview-*` styles). `src/StatehoodCurious.jsx` exists only as a bare
stub (page-hero, no content) — that page's real build (hybrid case-for-statehood copy,
ported news section, stakeholder org list, eval pipeline) is still open.

Note: kept the facts-section's existing negative-margin stat-overlap effect intact by
inserting the persona picker *after* the Explainer section rather than before it, per
the design's literal order (Hero → Stats → Persona picker → Explainer). The current
site's "Explainer" section already double-duties as the stat band, so splitting it to
match the design's exact section order wasn't worth the churn for this pass.
