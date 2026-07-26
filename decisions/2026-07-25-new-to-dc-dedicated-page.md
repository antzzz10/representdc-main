# Decision: "New to D.C." gets its own page instead of an anchor scroll

**Date:** 2026-07-25
**Context:** Revisiting the segment-mapping IA (`decisions/2026-07-20-segment-mapping.md`)
after deploying the persona-picker rebuild. Of the four picker cards, three already land
on a dedicated route (`/statehood-curious`, `/myths-and-faq`, `/take-action`). "New to
D.C." was the outlier — its first click scrolled down the homepage to `#explainer`,
which had no distinct URL, no arrival moment, and — the concern that prompted this
review — read as disorienting on mobile: an anchor-jump past content you'd already
scrolled by, with no page title change to signal you'd "gone" anywhere.

## What happens to the existing homepage explainer section?

**Options considered:**
1. Extract to a shared component, render in both places (same light content, two spots)
2. Move it off the homepage entirely, matching the other three personas exactly
3. **(Chosen, revised from the initial recommendation)** Keep the current light version
   on the homepage unchanged, and write a genuinely more detailed version for the new
   dedicated page

**Chosen:** Option 3. The user's read: the existing 3-step explainer is too light for
someone who actually wants to understand D.C.'s status as a new resident, not just skim
it mid-scroll. Rather than duplicate that same light content onto a new URL, the new
page (`/how-congress-controls-dc`) goes deeper — pre-1973 governance history, all three
mechanisms Congress uses (review period, appropriations riders, budget authority), and
the non-voting delegate — while the homepage's `#explainer` section stays exactly as-is
for organic scrollers who never touch the picker.

## URL

`/how-congress-controls-dc` — content-descriptive, matching `/the-case` and
`/myths-and-faq`'s naming pattern rather than a persona label.

## Sourcing

New factual claims not already used elsewhere on the site were verified against:
- **DC Council** (`dccouncil.gov/dc-home-rule/`) — pre-1973 governance timeline (1802
  charter → ~93 years of a fully presidentially-appointed 3-commissioner board, 1874–1967
  → 1967 mayor-commissioner → 1973 Home Rule Act), Council structure, budget process,
  delegate status
- **ACLU of DC** (Feb 2026, `acludc.org/news/dc-home-rule-what-it-how-it-works-and-why-it-matters/`)
  — exact congressional review period (30 working days civil / 60 criminal), and
  appropriations riders as a separate override mechanism, with a concrete 2025 example
  (H.R. 8773, a proposed rider blocking D.C.'s no-turn-on-red enforcement)

No current officeholder is named for the delegate seat, consistent with the standing
site convention (see `decisions/2026-07-11-content-review-and-audience.md`).

## Implementation

- `src/HowCongressControlsDC.jsx` — new page, same `Nav`/`page-hero`/`Footer` shell as
  the other dedicated pages. Reuses existing `.explainer-steps`/`.explainer-step` CSS
  for the three-mechanism breakdown; adds a shared `.source-note` class to `App.css`
  (the equivalent `.myth-source-note` lived only in `MythsAndFaq.css`, not imported
  here). Ties off with the live bill count (`useBillStats`, same hook as `Home.jsx`) and
  forward links to `/the-case` and `/myths-and-faq`.
- `src/App.jsx` — route added at `/how-congress-controls-dc`.
- `src/Home.jsx` — "New to D.C." picker card now `Link`s to the new route instead of
  anchor-scrolling to `#explainer`; icon changed from `arrow-down` to `arrow-right` to
  match the other three cards' "goes to a page" convention. The `#explainer` section
  itself is untouched.
- Verified with Playwright: desktop click-through from the picker card, mobile viewport
  (390×844) render, no console errors, live bill count renders correctly on the new
  page.

## Known gap accepted for now

`/statehood-curious` and `/take-action` are IA-complete (own page) but still
content-incomplete (interim placeholders) — unrelated to this fix, tracked separately
in `WHATS-NEXT.md` Phase 4/7.
