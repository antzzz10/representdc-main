# Decision: Take Action Hub matcher — initial scoping

**Date:** 2026-07-28
**Context:** `/take-action` exists today as a placeholder previewing content that was
never built (outreach toolkit, state-level advocacy, no-donation-without-representation).
Separately, the original IA brainstorm scoped a Take Action Hub with an "Actions &
Events" section but never solved events sourcing, and the Statehood Partner Map
(shipped 2026-07-27) is a browse experience with no way to translate "I want to help"
into a specific next step. Idea raised: a short preference intake that matches a
visitor to the right partner org, plus a real events list sourced from those orgs. Full
detail in `TAKE-ACTION-MATCHER-PRD.md`; this note records the four scoping calls and
why.

## 1. Replaces `/take-action`'s placeholder content

The matcher and events list become the Take Action Hub's real content, reusing the
sitewide nav entry already decided in the original IA brainstorm. The placeholder's
original three ideas (outreach toolkit, state-level advocacy, no-donation-without-
representation) move to `WHATS-NEXT.md`'s backlog, unscheduled.

**Why:** `/take-action` already has a decided IA slot (nav dropdown: Talking Points ·
Latest News · Actions & Events) and a page that's been sitting as a coming-soon stub.
Standing up a second new page/URL for this would either orphan that slot or create two
competing "take action" destinations. Rejected a brand-new route (duplicates an IA
decision that's already made) and layering the matcher onto `/statehood-partner-map`
itself (the Partner Map's job is the comprehensive directory; conflating it with a
guided intake risks making both jobs worse).

## 2. Events sourcing: feed-based only, verified before committing

Pull events only from partner orgs with a real structured data export — RSS, iCal, or
a documented export like Squarespace's `?format=json-pretty`. Never scrape arbitrary
HTML.

**Why:** scraping is fragile (breaks silently on a redesign), sits in a legal/ethical
gray area depending on the org's terms, and would be a meaningfully riskier pattern
than anything else in this codebase — the closest precedent, dc-bills-tracker's news
pipeline, already follows "only include sources with a real feed, skip ones that don't
have one" (NOTUS confirmed working; Norton's office excluded for lacking any working
feed). Verified this is viable before locking it in: Free DC
(`freedcproject.org/event-list?format=json-pretty`) returns 30 real, currently
upcoming, structured events — title, start/end time, location, and a link to each
event's own page. That's a genuine anchor for the list, not a hypothetical. Rejected
manual curation (real option, but higher ongoing upkeep than a feed check) and
link-out-only (lowest effort, but doesn't deliver an aggregate list at all).

## 3. Two-question intake, not three

How do you want to get involved (a new field) and are you D.C.-local or supporting
nationally (the existing `scope` field). Cause/category area is not asked in v1.

**Why:** keeps the intake to roughly two taps. A third question (cause area, mapping
to the existing `Category` field) was considered and rejected for v1 — it narrows
results further and adds friction for a feature whose whole point is a fast "what's
next for me," not a research tool. Can be added later if two questions turn out to be
too coarse.

## 4. The org "how to plug in" audit happens now, as part of this build

Populating the new `entryPoints` field (volunteer / mailing-list / events / donate /
advocacy / staff-only) means re-checking all 25 orgs' own sites specifically for
public engagement paths — not inferring it from their mission descriptions, which are
already written and don't answer this question.

**Why:** this data *is* the matcher's core value. Without it, the tool can only filter
on Layer/Category/Scope — dimensions that describe what an org does and how central
statehood is to their mission, not how a person actually plugs in. Shipping without it
would answer a question nobody asked ("what type of org is this") instead of the one
that was ("how do I get involved"). Rejected deferring the audit to a fast-follow —
faster to ship, but the v1 wouldn't actually do the thing it's named for.

## Risks carried forward

The PRD's §6 has the full list. The two that most shape implementation:

- **Entry-point data goes stale faster than mission descriptions.** A volunteer drive
  or mailing list can close anytime. Needs a recurring review cadence (folded into the
  existing correction-round pattern) and a visible "last checked" date per org in
  `STAKEHOLDER-MAP.md`, not a one-time audit treated as permanent.
- **Feed-based sourcing means real but uneven coverage.** Free DC is the only
  confirmed source so far. The page needs to say honestly that this is "real events
  from partner orgs with a working feed," not imply a comprehensive regional calendar.

## Next step

No build yet. `TAKE-ACTION-MATCHER-PRD.md` §7 has five smaller open questions (entry-
point vocabulary, low-match-count behavior, events-list scope, intake visual design,
tracking) — each has a proposed default and none blocks drafting an implementation
plan. Also worth revisiting `TALKING-POINT-GENERATOR-PRD.md` §7 Q2 when that feature
is next picked up, since it anticipates the same org-matching concept from a different
entry point and the two should converge on one data model rather than build twice.
