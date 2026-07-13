# RepresentDC — Design, Content & Goals Guardrails

Consolidated from the Claude Design "RepresentDC Design System" project, this repo's
`STRATEGY.md` and `DEVELOPMENT-GUIDELINES.md`, and conflict resolutions in
`decisions/2026-07-10-design-system-integration.md`. This is the single reference for
the full RepresentDC domain (representdc-main, dc-bills-tracker, dc-statehood-pledge) —
update it here first if any of the three repos need to diverge, and note the divergence
explicitly rather than letting the docs silently drift apart.

## Visual system

- **Navy (`--navy` `#14213D`) is the workhorse** — headers, headings, primary surfaces,
  default icon color. **Red (`--dc-red` `#C8102E`) is a rationed accent** — urgency
  (alerts), primary CTAs, and the high-priority bill flag only. Never flood a surface in
  red.
- **Icons: Lucide only** (2px stroke, single color). Never emoji, never hand-drawn SVG,
  never unicode glyphs (✓, →, etc.) doing icon duty.
- **Fonts: exactly three** — Public Sans (UI/body/headings), Source Serif 4 (editorial
  pull-quotes only), IBM Plex Mono (data: bill numbers, votes, dates). Loaded via Google
  Fonts CDN for now (2026-07-10 decision) — revisit self-hosting only if load time
  becomes a measured problem.
- **No raw hex colors or raw px values in component code** — reference design tokens via
  `var(--token)`. Full token set in `colors_and_type.css`.
- **No gradients as a rule** — the one sanctioned exception is a subtle navy
  `#14213D → #243657` on large hero/footer panels.
- **Logo:** finalized 2026-07-10 — a five-pointed star with one point rendered as a
  diagonal hatch instead of a flat fill (texture, not color alone, carries the meaning:
  D.C.'s incomplete standing in American democracy). Deliberately not a recreation of the
  D.C. flag's three-stars-two-bars, to stay distinct from nearly every other statehood
  org's mark. Full spec (construction, wordmark rules, color combinations, clear space,
  minimum sizes, don'ts): `reference/brand/RepresentDC Logo Style Guide.dc.html`.
  Implementation: `src/components/Logo.jsx` (`Logo` + `Wordmark`, both take a `variant`
  of `color` / `reversed` / `mono`). "RepresentDC" is always one word; "DC" always carries
  a thin underline in the accent color tying it to the star.

## Voice & content casing

- **Sentence case everywhere, including headlines and the hero** — this supersedes any
  earlier Title Case / all-caps-for-emphasis examples in `STRATEGY.md`. Urgency comes from
  word choice and the red/navy accent system, not capitalization.
- **UPPERCASE reserved for tiny eyebrow/label text only** (e.g. `UPDATE`, `FLOOR VOTE`).
- **Brand name: "RepresentDC", one word.** ("Represent DC" was a typo in this repo's
  footer/copyright text, not an intentional variant.)
- **"D.C." with periods in body copy**; "DC" acceptable in compact UI and the wordmark.
- **No emoji in copy, ever.**
- Non-partisan, concrete, loss-framed voice; no party-label rhetoric (sponsor party shown
  only as a neutral R/D/I badge). Full voice rules in the design system's own README if
  copied locally, otherwise treat this section as authoritative.
- **Name Congressional bill sponsors specifically** (normal legislative-tracking
  practice — e.g. "Rep. Nancy Mace") **but refer to the executive branch
  institutionally** ("the executive branch," "the White House," "the administration")
  rather than by a sitting president's name — regardless of whether the mention is
  critical or supportive of D.C.'s position. Confirmed 2026-07-11 after finding both a
  critical and a supportive presidential mention in the same content set; see
  `decisions/2026-07-11-content-review-and-audience.md`.

## Content integrity (non-negotiable — see `DEVELOPMENT-GUIDELINES.md`)

- Every factual claim needs a verified, cited source. Never port placeholder/fabricated
  data (fake sponsors, fake bill numbers, invented statistics) from design mocks or
  prototypes into production code — mockup filler must never look like real content.
- Ask before adding any new statistical claim, bill status, or sponsor attribution.

## Persuasion architecture (see `STRATEGY.md`)

- The landing page follows a deliberate 5-part sequence: **Hook (hero) → Validate
  (facts) → Connect (American values) → Pattern (trend) → Solution (statehood).** All
  five sections are required. A design exploration that omits some "for focus" still
  needs them rebuilt in the new visual language before shipping — omission is a scope
  limitation of the mock, not a content decision.

## Cross-site integrity

- representdc-main, dc-bills-tracker (billtracker.representdc.org), and
  dc-statehood-pledge (candidates.representdc.org) cross-link in nav/footer. Keep those
  links live and correct when editing any shared chrome.
- Don't invent new nav destinations without a real target — point to an existing anchor
  on the current page, or explicitly scope a new page/route as its own decision.

## Repo/package structure

- No shared design-system package across the three repos for now (2026-07-10 decision).
  Copy `colors_and_type.css` and assets directly into each repo that adopts this design
  pass. Revisit a real shared package only if visual drift becomes a maintenance problem.
- This design pass currently covers **representdc-main only**. Rolling it out to
  dc-bills-tracker / dc-statehood-pledge is a separate future decision — don't assume
  parity until that decision is made and documented.
