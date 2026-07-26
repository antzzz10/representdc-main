# Decision: Homepage hero rewritten for four entry points, not one funnel

**Date:** 2026-07-26
**Context:** The hero still read like `billtracker.representdc.org` itself —
"Breaking" badge, "Congress is blocking D.C. laws right now," CTA jumping straight to
the external bill tracker. That's a deliberate choice from `STRATEGY.md`'s original
persuasion architecture (Hero = urgency-first "Hook," written for one generic
skeptical reader). But the persona picker added since then
(`decisions/2026-07-12-persona-picker-and-statehood-curious.md`) gives every visitor
four distinct entry points — and a newcomer who doesn't yet know what home rule is, or
a skeptic who hasn't been given a chance to ask their own questions, both hit
urgency-first framing before they've had any chance to self-select. The hero was still
written for the old single-funnel assumption; the rest of the site had moved on.

## Options considered

1. **Neutral orientation hero** — drop urgency-first framing, lead with the site's
   actual value prop (real-time info + path to statehood + multiple entry points), let
   downstream sections (Facts, Values, Trend, Solution) carry the persuasion work that
   `STRATEGY.md` documents.
2. **Fact-first, less edge** — keep more directness/urgency, but state Congress's power
   as a structural fact true regardless of politics rather than a present-tense
   accusation. Preserves more hook strength for returning/activist visitors.
3. **Pure hub framing** — most neutral, closest to a product landing page. Lowest risk
   of reading as picking a side, but weakest emotional hook of the three.

**Chosen:** Option 1, in an "explicit welcome" form — names the reader's likely
knowledge gap directly ("D.C. has no vote in Congress. Here's what that means for
you.") rather than assuming urgency-agreement from sentence one.

## What changed

- **Badge:** "🔴 Breaking" (pulsing red dot, news-alert styling) → "D.C. statehood,
  explained" (neutral label, same pill shape). Removed the now-unused `.hero-badge .dot`
  CSS and its `pulse` keyframe animation.
- **H1:** "Congress is blocking D.C. laws right now" → "D.C. has no vote in Congress.
  Here's what that means for you."
- **Subtitle:** bill count moved out of the subtitle into a smaller stat line below the
  CTA ("{N} bills pending right now · Updated {date} · N just passed the House").
- **Primary CTA:** "See all N bills" (external, → billtracker.representdc.org) → "Find
  your starting point ↓" (internal anchor to `#picker`, the persona-picker section,
  which gained that id for this purpose). The site's own picker is now the hero's
  primary action; the bill tracker is one of the things it points to, not the entire
  point of landing here.
- **Found in the same pass:** the "Statehood-questioning" persona card still had "no
  persuasion pitch required" — the same AI-authoring-tell phrase already cut from
  `/myths-and-faq`'s own subheading, just duplicated on the homepage card. Fixed to
  "sourced answers to the most common ones."

## Scope note

This is scoped to the hero only. Facts, Values, Trend, and Solution keep their original
loss-framed tone per `STRATEGY.md` — those sections are what a visitor sees if they keep
scrolling past the picker without clicking a card, and that funnel logic still holds for
that reading path. Noted the supersession directly in `STRATEGY.md`'s Section 1 rather
than letting the doc silently diverge from the deployed page.

## Verification

Playwright: hero renders with new copy, CTA click scrolls to `#picker` and lands on the
visible persona grid, no console errors, "no persuasion pitch" confirmed absent
site-wide (not just on the page it was originally cut from).
