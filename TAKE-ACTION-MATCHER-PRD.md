# PRD (draft): Take Action Hub — org matcher + events list

**Status:** Scoping — not approved, not scheduled
**Started:** 2026-07-28
**Owner:** Andria
**Related:** `WHATS-NEXT.md` (Phase 4/7, Take Action Hub), `STAKEHOLDER-MAP.md` (org data
and its decision history), `src/data/statehoodPartners.js` (org data, single source of
truth), `reference/brand/RepresentDC Action & Persona IA Brainstorm.dc.html` (original
Take Action Hub IA decision and events empty-state design),
`TALKING-POINT-GENERATOR-PRD.md` (§7 Q2 anticipates the same matching concept from a
different entry point — see §6E below), `DEVELOPMENT-GUIDELINES.md` (sourcing
standards), `DESIGN-GUARDRAILS.md` (hero/sourcing conventions)

---

## 1. Problem

Someone who lands on `/statehood-partner-map` gets a comprehensive, verified directory
of 25 organizations — but the page is a browse experience. It answers "who's doing this
work," not "what should *I* do." A visitor ready to plug in has to read through Layer ×
Category groupings and self-select, with no help translating "I want to help" into a
concrete next step.

Two related gaps, both already named elsewhere but not resolved:

- **`/take-action` is a placeholder with the wrong content.** It exists today
  (`src/TakeAction.jsx`) previewing three ideas — a Congressional outreach toolkit,
  state-level advocacy, and "no donation without representation" — none of which are
  built, and none of which is what's being proposed now.
- **No events surface exists at all.** The original IA brainstorm flagged this as a
  genuine content gap (not just an IA problem) and scoped an "Actions & Events" section
  for the already-decided Take Action Hub, including a "never show a blank state"
  empty-state design — but didn't solve *sourcing*. There's still no real events list
  anywhere on the site.

## 2. Proposed product

Two connected surfaces, replacing `/take-action`'s current placeholder content:

**(a) A short preference intake** — two questions, reusing mostly-existing org data —
that filters `src/data/statehoodPartners.js` down to a matched shortlist, rendered with
the same card UI already built for the Partner Map.

**(b) An events list** sourced from partner orgs' own structured data exports (feed-
based, not scraped), credited to the hosting org with RSVP links going to their own
page — never a RepresentDC-run signup, matching the "credit the movement" guardrail
from the original IA brainstorm.

If the intake produces very few matches, or no events are available, the page falls
back to the full Partner Map or a "something to do right now" link rather than
rendering blank — inheriting the empty-state rule already designed for this hub.

## 2a. Decisions resolved (2026-07-28)

Four scoping calls locked in the first review pass. Full reasoning:
`decisions/2026-07-28-take-action-matcher-scope.md`.

1. **IA placement: replaces `/take-action`'s current placeholder.** The old preview
   content (outreach toolkit, state-level advocacy, no-donation-without-representation)
   moves to backlog in `WHATS-NEXT.md`, unscheduled — not deleted, just not this.
2. **Events sourcing: feed-based only, verified viable.** Pull only from orgs with a
   real structured data export (RSS, iCal, or a documented JSON export like
   Squarespace's `?format=json-pretty`) — never scrape arbitrary HTML. Confirmed
   working on Free DC: `freedcproject.org/event-list?format=json-pretty` returns 30
   real structured upcoming events (title, start/end time, location, link to the
   event's own page). Extend the same check to other orgs during implementation.
3. **Intake: two questions, not three.** How do you want to get involved (new field)
   and are you D.C.-local or supporting nationally (existing `scope` field). Cause/
   category area is *not* asked in v1, to keep the intake to roughly two taps.
4. **The new org data gets audited now, not deferred.** "How do you want to get
   involved" needs a field that doesn't exist yet (§3). Populating it accurately means
   revisiting all 25 orgs' sites specifically for volunteer signup, mailing list,
   events, or donation paths — real work, done as part of this feature rather than
   after, since without it the matcher can only filter on Layer/Category/Scope, which
   doesn't actually answer the question being asked.

## 3. Data model additions

New fields on each org in `src/data/statehoodPartners.js`:

- **`entryPoints`** — array drawn from a fixed vocabulary (proposed, see §7 Q1):
  `volunteer` (a real signup path to canvass/act), `mailing-list` (newsletter signup),
  `events` (hosts public events), `donate` (accepts donations), `advocacy` (action
  alerts — email-your-rep, sign-on letters), `staff-only` (no public entry point found
  — e.g. government bodies, PACs without a volunteer program). An org can carry
  several tags; `staff-only` is used alone when nothing public exists.
- **`eventsFeedUrl`** — `null`, or a verified working feed/export URL, set only after
  confirming it returns real structured data (per §2a.2). Kept separate from the
  `events` entry-point tag so "hosts events" and "we can pull a feed from them" stay
  distinct facts — an org can do the former without the latter.

Both fields require the same verification bar as everything else in this file: a real
visit to the org's own site, not an inference from their mission description.

## 4. Content sources

1. `src/data/statehoodPartners.js` — existing 25 orgs, extended with the two new fields
2. `STAKEHOLDER-MAP.md` — decision history; extend with entry-point audit notes per its
   existing changelog pattern (dated, per-org "Confirmed [date] — [what was checked]")
3. Each org's own site — primary source for `entryPoints`, checked fresh
4. Structured data exports confirmed per org (Squarespace `?format=json-pretty`,
   RSS, iCal) — the events data source, never raw HTML scraping

## 5. Success criteria (draft)

- A visitor goes from landing on `/take-action` to a matched shortlist of orgs in
  roughly two taps.
- Every matched card states *why* it matched — which entry point(s) fit what the
  visitor asked for — not just "here's an org."
- The events list only ever shows real events with a working link back to the host
  org's own page; no placeholder or stale dates (inherits the brainstorm's "past event"
  state rule — a lapsed listing gets marked, not left looking current).
- Zero-match and zero-events states never render blank.

## 6. Problems and risks flagged

**A. Entry-point data will go stale faster than mission descriptions.** A volunteer
drive or mailing list can close anytime; an org's mission rarely changes. This needs a
recurring review, not a one-time audit — propose folding it into the same
correction-round cadence already used for the rest of the Partner Map, with a visible
"last checked" date per org in `STAKEHOLDER-MAP.md`, matching the existing
"Confirmed [date] — [source]" pattern.

**B. Feed-based sourcing means uneven, possibly thin coverage.** Free DC is the only
confirmed source so far. This isn't a comprehensive regional events calendar — it's
"whatever real structured feeds exist among partner orgs" — and the page's copy needs
to say that honestly rather than imply completeness.

**C. A purely categorical filter can return very few results for uncommon
combinations** (e.g. "national scope" + "volunteer" is likely thin, since
volunteer-facing work skews local). The never-blank fallback (§2a.1, inherited)
covers the zero-match case; §7 Q2 covers what to do at 1–2 matches.

**D. No backend.** Matching and event display are pure client-side filters over the
static data file — consistent with the rest of the site's declarative-JSX, no-backend
architecture. Events freshness is bounded by deploy cadence, not real-time, the same
limitation `news.json` already has.

**E. Overlaps the talking-point generator PRD's own open question.**
`TALKING-POINT-GENERATOR-PRD.md` §7 Q2 ("stakeholder-org handoff") anticipates
essentially this same situation-to-org matching, approached from a different
entry point (after generating talking points, rather than as its own destination).
Both features should converge on the same `entryPoints`/matching data rather than
building two separate systems — worth flagging in that PRD when it's next revisited.

**F. The old `/take-action` placeholder content is real, sketched work, not
disposable.** Replacing it doesn't mean the outreach-toolkit / state-level-advocacy /
no-donation-without-representation ideas were wrong — they just move to
`WHATS-NEXT.md`'s backlog, unscheduled, so the thinking isn't lost.

## 7. Open questions

Each has a proposed default; none blocks drafting an implementation plan.

1. **`entryPoints` vocabulary.** *Proposed:* the six values in §3
   (volunteer/mailing-list/events/donate/advocacy/staff-only). Confirm before starting
   the org-by-org audit — changing the vocabulary after auditing means re-checking
   orgs already done.
2. **What happens at 1–2 matches (not zero, just few)?** *Proposed:* show them as-is,
   plus a link to the full directory — don't auto-loosen a filter. Keeps the result
   predictable; a visitor who chose "national" shouldn't silently get local orgs back
   without knowing why.
3. **Does the events list show everything from feed-sourced orgs, or only events near
   a matched org?** *Proposed:* show all — the audience already arrived via a
   statehood-interested path, and per-org filtering can be added later if the list
   grows long enough to need it.
4. **Intake visual design** — card-style self-identification (like the homepage's
   4-card persona picker) vs. a lighter filter-chip bar? *Proposed:* card-style,
   matching the site's one already-established "let a visitor self-identify" pattern
   from the original IA brainstorm §4, rather than introducing a second pattern.
5. **Any tracking/success metric for v1?** *Proposed:* none — the site has no
   analytics or eval framework yet sitewide; revisit only if that gets decided at the
   site level, not scoped separately here.

## 8. Non-goals (v1)

- Scraping arbitrary org websites for events — structured exports only (§2a.2)
- A comprehensive regional events calendar — only what real partner-org feeds provide
- Accounts, saved preferences, or remembering a returning visitor's answers
- Real-time event sync — freshness is bounded by site rebuild/deploy cadence
- Matching logic beyond simple categorical filtering — no ranking or scoring model
