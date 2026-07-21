# Decision: User segment → needs → paths mapping (approved)

**Date:** 2026-07-20
**Context:** Follow-up to `2026-07-14-persona-flow-fixes.md`, which fixed the broken
picker flows and deferred two questions to this mapping review: whether the picker
needed a path to `/the-case`, and whether the hero/Trend CTAs should stop pointing at
the external bill tracker. Mapping proposed and approved as-is.

## The mapping

| Segment | Arrives knowing / needing | First click | Intended journey |
|---|---|---|---|
| **New to D.C.** | Doesn't know D.C. isn't a state; needs basics, low commitment | Picker → `#explainer` | Explainer → The Case → Myths & FAQ |
| **Statehood-curious** | Knows the problem; needs what's happening now + easy plug-ins | Picker → `/statehood-curious` | News → orgs → shallow actions (full page build pending) |
| **Statehood-questioning** | Has objections; needs direct sourced answers, no pitch | Picker → `/myths-and-faq` | Myths → evidence depth (`/the-case`) when warming |
| **Statehood activist** | Convinced; needs tools and speed | Picker → `/take-action` | Toolkit → talking points → organizing (hub build is Phase 7) |
| **D.C. voter** (cross-cutting) | 2026 primary candidate positions | Nav → Candidates (external) | Kept deliberately separate per 2026-07-11 audience decision |

## Resolutions of the two held questions

1. **No fifth picker card, no destination changes for `/the-case`.** Cross-links added
   where the need actually arises instead:
   - Explainer section already links forward to `/the-case` (2026-07-14)
   - Bottom of Myths & FAQ: "Seen the claims—now see the record" → `/the-case`
     (serves the warming skeptic at the moment they're ready)
   - Take Action coming-soon page: "talking points are already live" → `/the-case`,
     plus a bill-tracker link (activists get real tools today, not just a preview)
2. **Hero and Trend CTAs stay pointed at the bill tracker.** The tracker is the site's
   strongest evidence and a same-brand subdomain, not a true exit. The picker one
   scroll below the hero is the internal router; a competing internal CTA in the hero
   would dilute its loss-framed urgency.

## Known gaps accepted for now

- The "New to D.C." journey ends in reading — no light-touch action endpoint for that
  segment yet. Revisit when the Take Action Hub gets its full build (Phase 7).
- Statehood-curious remains an interim page; its full build (news, orgs, case-in-brief,
  eval pipeline) is the next Phase 4 chunk.
