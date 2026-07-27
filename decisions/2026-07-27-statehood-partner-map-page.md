# Decision: Statehood Partner Map ships as a real public page

**Date:** 2026-07-27
**Context:** Following the matrix-visual review (`STAKEHOLDER-MAP.md`'s v0.2 changelog),
asked to turn the working-draft matrix into an actual public page — `/statehood-partner-map`
in `src/StatehoodPartnerMap.jsx` — with several changes for a public audience rather
than an internal working tool.

## What changed from the private draft

1. **Verification pass completed.** 6 orgs were still marked "Not yet" in the working
   doc (New Columbia Statehood Commission, DC Vote, Neighbors United, Students for DC
   Statehood, DC Democratic Party Statehood Committee, Free DC). Verified all 6
   against their own sites before shipping — `DEVELOPMENT-GUIDELINES.md`'s sourcing bar
   applies once something is public, not just to a private doc.
2. **RepresentDC's own tool is now a normal grid entry**, not a separate "not a peer
   org" callout — explicit instruction, since it's a real part of the ecosystem worth
   presenting alongside everyone else rather than set apart.
3. **"Tracking tools" (rejected as an unclear category name) replaced with two
   columns**: DC Community Advocacy (RepresentDC's Statehood Candidate Questionnaire)
   and National Advocacy (Statehood Pledge, Statehood Compact, Statehood Scorecard —
   un-collapsed back into three separate entries now that space isn't as constrained
   on a full public page).
4. **Expanded per-org detail.** The compact matrix chip (a few words) couldn't carry
   real information — added a full directory section below the matrix, grouped by
   layer, each org getting a real card: full description, type/scope tags, and a link
   to the org's own site.
5. **New intro copy** ahead of the table: a paragraph establishing the movement's
   breadth (echoes `STRATEGY.md`'s "counter pipe-dream narrative with momentum"
   principle, kept factual/measured rather than hyperbolic), plus a plain-language
   Layer/Type explainer so a first-time visitor isn't dropped straight into a matrix
   with no context.
6. **Title**: "The Statehood Partner Map."

## Implementation

- `src/StatehoodPartnerMap.jsx` + `.css` — new page, `Nav`/`page-hero`/`Footer` shell
  matching every other sub-page. Hero stays within the 3-info-block guardrail
  (eyebrow + h1 + one-line subtitle, no CTA).
- Matrix chips are real anchor links (`href="#{org-id}"`), not JS click handlers —
  reuses the site's existing `ScrollToTop` hash-scroll behavior instead of adding new
  interactive state, consistent with how the rest of the site is built (declarative
  JSX, not stateful widgets).
- One new CSS custom property, `--spm-outer`, added locally in
  `StatehoodPartnerMap.css` — a lighter navy step for the Outer layer that doesn't
  exist in the shared token set. Not promoted to the shared tokens since nothing else
  needs it yet.
- No dark mode — matches the rest of the site, which doesn't have one.
- Sources block (17 sources) uses the shared `.sources-block`/`.sources-list` classes
  per the `DESIGN-GUARDRAILS.md` aggregation guardrail.
- Verified with Playwright: desktop + mobile renders, matrix-chip-to-directory anchor
  link works, no page-level horizontal overflow on mobile (checked specifically —
  this exact bug had to be fixed on the private Artifact version the day before).

## Not done in this pass

- **Not linked from nav or any other page** — reachable by direct URL only. IA
  placement (main nav vs. linking from `/statehood-curious`'s "Meet the movement"
  card vs. staying direct-URL-only) is an open question, tracked in
  `STAKEHOLDER-MAP.md`.
- **No matching-tool UX** — this page is the map, not yet the "if you want X, connect
  with Y" matcher described in the original end vision.
- **No relationship lines between orgs** (e.g. shared steering-committee membership)
  — flagged as a candidate for a future visual iteration, not attempted here.
- **DC Appleseed's layer** (Outer vs. Middle) still an open question — shipped in
  Outer per the original placement, flagged in its card description.
