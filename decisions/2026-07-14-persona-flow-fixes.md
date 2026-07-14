# Decision: Persona picker flow fixes (explainer section, interim Statehood-curious page)

**Date:** 2026-07-14
**Context:** A flow audit of the rebuilt homepage found the persona picker's first-click
actions bounced users around instead of giving each segment a clear path: the
"New to D.C." card pointed at `#explainer` — the stats band *above* the picker — so
clicking scrolled backward (with a down-arrow icon), and no section actually explained
home rule despite the card promising it. The Statehood-curious card landed on an empty
stub. Two further issues (no picker path to `/the-case`; both large CTAs exit to the
external bill tracker) were identified but deferred.

## "New to D.C." fix: new explainer section below the picker

**Options considered:**
1. Build a real explainer section below the picker (chosen)
2. Move the picker above the facts band (cheapest, but the card would still
   over-promise — the facts band doesn't explain home rule)
3. Point the card at `/the-case` (too abrupt an on-ramp for a true newcomer)

**Chosen:** Option 1 — restores the original design's section order (Hero → Stats →
Picker → Explainer). New "How Congress controls D.C." section (`#explainer`) with a
three-step walkthrough: 1973 Home Rule Act → congressional review of all Council
legislation + budget authority → no voting representation. All claims verified against
[dccouncil.gov/dc-home-rule](https://dccouncil.gov/dc-home-rule/) (fetched and checked
2026-07-14) or reuse already-vetted facts-band claims. Ends with a forward link to
`/the-case`. The facts band was renamed `#facts`.

## Statehood-curious: interim coming-soon page

The bare stub became a TakeAction-style preview page (news / movement orgs / case-in-
brief cards) plus "in the meantime" links to the bill tracker and `/the-case`, so the
persona card's first click is never a dead end. The full build (news integration,
stakeholder list, eval pipeline) remains the next Phase 4 chunk — see
`decisions/2026-07-12-persona-picker-and-statehood-curious.md`.

## Held for the segment-mapping review

- **No picker path to `/the-case`** — the densest content is nav-only. A
  segment → needs → paths mapping proposal will recommend whether/where to add
  cross-links (leaning: cross-link from Myths & FAQ and the explainer rather than
  changing picker destinations).
- **Hero and Trend CTAs both exit to the external bill tracker** — whether one should
  become an internal pathway is deferred to the same review.

## Verification

Playwright walkthrough on the dev server: anchor scroll direction (down), explainer
visibility after click, source-link presence, statehood-curious previews + interim
links, `/the-case` navigation, deep links, and anchor behavior after route changes.
The one anomaly (nav appearing mid-page in a full-page screenshot) was confirmed to be
Playwright's sticky-element capture artifact, not a bug.
