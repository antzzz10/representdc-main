# Statehood Stakeholder Map — decision history

**Status: shipped 2026-07-27 as `/statehood-partner-map` — 22 orgs, all verified.**

**Data lives in `src/data/statehoodPartners.js`, not here.** That file is the single
source of truth for every org's name, category, layer, scope, URL, and description —
edit it directly (see its header comment for the field guide). This doc is decision
history and open questions only; it does **not** duplicate the org data, so there's
nothing to keep in sync when the data changes. (Before 2026-07-27 this doc held a
parallel copy of the org tables — that duplication is exactly what caused sync risk
across correction rounds, so it was retired in favor of one source.)

The page is live but not yet linked from nav or any other page — reachable by direct
URL only.

## Naming: two different things called "statehood pledge"

- **Statehood Pledge** (`dcstatehoodpledge.org`) is a real, external, volunteer-run
  project — **national in scope**, tracking pledge signers among candidates and
  elected officials across multiple states. It's one of three tools run by the same
  single independent volunteer, with no formal org name.
- **RepresentDC's own tool** (`candidates.representdc.org`, the repo internally named
  `dc-statehood-pledge`) should be referred to as the **Statehood Candidate
  Questionnaire** — D.C.-focused (2026 candidates specifically), and must not be
  confused with the external Statehood Pledge above. The shipped page does not give
  the Questionnaire its own row — it's a feature of RepresentDC, not a separate
  entity, so it's mentioned in RepresentDC's own entry instead.

## End vision

1. **A visual map** of the main orgs doing D.C. statehood work and how they relate to
   each other — not a flat logo wall, since it's a real layered coalition.
2. **A matching tool**: "if you want *this*, here's who to connect with."

## The layer model (primary structure, adopted 2026-07-26)

Orgs are grouped by **how central statehood is to their mission** — not by what kind
of org they are (the secondary "Category" tag) or where they operate (the secondary
"Scope" tag).

- **Core** — "100% statehood." Statehood is the *entire* reason the org/tool/effort
  exists.
- **Local Allies** — "Broader mandate that includes statehood." Statehood is a
  *named, core* part of the mission, but the org has a broader mandate beyond it.
- **National Allies** — "Support through national platforms and resolutions." The
  org's own statehood support is a national on-record resolution or platform plank —
  not a sustained day-to-day program. **Reworded 2026-07-27 (second pass):**
  previously said "through a DC chapter and national resolutions," but that's no
  longer accurate now that DC chapters (LWV DC, ACLU DC) have their own Local Allies
  entries separate from their national parent orgs.

Boundaries are genuinely fuzzy in places — see "Notable judgment calls" below rather
than a table footnote, since the data tables themselves have moved to the JS file.

## Notable judgment calls

Context that doesn't fit as a code comment but matters for the next correction round:

- **DC Democratic Party Statehood Committee vs. DC Democratic Party vs. DNC** — a
  deliberate three-layer progression (Core → Local Allies → National Allies) for the
  same underlying party family, each layer verified independently. The Statehood
  Committee's party affiliation is stated plainly on the page as a fact about the
  org, not a RepresentDC stance.
- **Free DC** — is home-rule defense genuinely *broader* than statehood (Local
  Allies), or just the same fight from a defensive angle (arguably Core)? No clean
  line; kept in Local Allies, revisit if it matters for the visual.
- **LWV / ACLU split (2026-07-27, second pass)** — each is now two entries: a
  DC-chapter entry (Local Allies, e.g. "LWV DC") and a national-org entry (National
  Allies, e.g. "LWV"). Verified both levels have independent on-record statehood
  involvement: the DC chapters are listed by name on `statehood.dc.gov`'s own
  statehood-supporters page, and the national orgs each have their own documented
  advocacy (LWVUS statements to Congress; ACLU's official scoring of the June 2020
  H.R. 51 vote).
- **NAACP did NOT get the same split** — checked `naacpdc.org`'s "Who We Are" and
  "Political Action" pages plus `statehood.dc.gov`'s supporters list (which credits
  LWV-DC and ACLU-DC by name but only national NAACP). Found no DC-Branch-specific
  statehood statement, so NAACP stays a single National Allies entry (resolutions
  since 1978, most recently reaffirmed 2025). Revisit if a DC-Branch-specific
  statehood statement ever surfaces.
- **DC Appleseed / DCFPI / Anacostia Coordinating Council** — moved from National
  Allies to Local Allies (2026-07-27); the earlier "possibly Middle, not Outer" flag
  on DC Appleseed specifically is resolved.
- **The unnamed long tail** — "and a growing coalition of 100+ organizations" is a
  single credit line on the page linking directly to Together for DC's own coalition
  page (`togetherfordc.org`) as the living source of truth. Together for DC's own
  steering committee alone already lists 16+ named orgs (Center for Economic
  Democracy, DC Jobs With Justice, DC Justice Lab, DC Chapter NOW, Fair Budget
  Coalition, Miriam's Kitchen, National LGBTQ Task Force, Public Citizen, SPACEs in
  Action, Taskforce for Democracy, DCNOW, and others) — not reproduced in the data
  file since it will drift out of date; check Together for DC's page directly.

## Open questions for the next iteration

- **Nav / IA placement** — the shipped page isn't linked from anywhere yet. Candidates:
  add to main nav, link from `/statehood-curious`'s "Meet the movement" preview card
  (would partially retire that card's coming-soon status — pursuing that was explicitly
  deferred as its own bigger decision on 2026-07-26), or leave direct-URL-only for now.
- **Matching-tool UX** — how a visitor expresses "what they want" and how that maps to
  each org. Not built yet — the shipped page is the map, not yet the matcher.
- **Relationship lines between orgs** — e.g. LWV DC sitting on Together for DC's
  steering committee isn't shown as a connection on the matrix. Would need a v0.3
  visual treatment if worth showing.

## Changelog

- **2026-07-26** — Initial draft: 8 Tier 1 orgs pulled from the Action & Persona IA
  Brainstorm doc, categorized by type.
- **2026-07-26 (correction pass)** — Fixed a naming conflation: "DC Statehood Pledge"
  wrongly treated as RepresentDC's own tool. Renamed ours to Statehood Candidate
  Questionnaire. Added Advocacy tool-oriented orgs, Funding/PACs, Coalition/partnership
  categories.
- **2026-07-26 (structure pass)** — Collapsed Pledge/Compact/Scorecard into one
  anonymous Tier 1 node (single volunteer, no org name).
- **2026-07-26 (layer model pass)** — Replaced the flat Tier 1/Tier 2 split with the
  inner/middle/outer layer model (centrality of mission, not org type). Reclassified
  all existing entries; added ACLU DC (middle), DCFPI, DC Appleseed, Anacostia
  Coordinating Council, and NAACP (outer) — all verified. Flagged DC Appleseed as a
  possible middle-layer miscategorization pending a call. Confirmed no other org
  shares the DC Dem Party's parent/child sub-committee structure.
- **2026-07-26 (first visual pass)** — Built a v0.1 concentric-circle diagram as a
  Claude Artifact to pressure-test the layer model visually.
- **2026-07-26 (visual v0.2)** — v0.1 rejected on review: too visually similar across
  orgs, Type not legible without hovering. Rebuilt as a Layer × Type matrix table.
  Surfaced a real finding in the process: Official government, Party-affiliated,
  Student, Tools, Funding, and Coalition org *types* are all exclusively Inner-layer —
  "purpose-built for statehood" correlates with org type, not just self-report. Fixed
  a mobile layout bug along the way (table's min-width was pushing the whole page
  wider than the viewport instead of scrolling within its own container).
- **2026-07-27 (shipped to production)** — Built as a real public page,
  `/statehood-partner-map` in `src/StatehoodPartnerMap.jsx`, not a private Artifact.
  Verified all 6 remaining "Not yet" orgs against their own sites before shipping.
  Un-collapsed Pledge/Compact/Scorecard back into three separate entries. Replaced the
  "Tracking tools" column with DC Community Advocacy / National Advocacy, and moved
  RepresentDC's own Statehood Candidate Questionnaire into the grid as a normal entry
  instead of a separate callout. Added an expanded full-directory section below the
  matrix (real cards, full descriptions, external links) per the "give each org more
  room" feedback — the compact matrix chip alone couldn't carry that. Not yet linked
  from nav or any other page.
- **2026-07-27 (correction pass)** — First categorization attempt got the new
  columns wrong. Corrected: DC Community Advocacy = renamed Grassroots & community,
  now also holding RepresentDC and the Pledge/Compact/Scorecard trio (not National
  Advocacy, which was the wrong home for them). National Advocacy = renamed Civic &
  rights advocacy (LWV DC/ACLU DC/NAACP), not the tools. Merged Policy & legal
  research + Fiscal/budget research into a new DC Policy category. Removed the
  standalone Statehood Candidate Questionnaire row — folded into the new RepresentDC
  entry. Fixed "Students for DC Statehood" chip label (had dropped the "DC"). Live
  page transposed to Type-rows/Layer-columns. Found and fixed a new mobile bug from
  the transpose (fixed-width row-header column crushing the 3 data columns
  unreadably narrow on a phone).
- **2026-07-27 (naming, party family, tighter intro)** — Renamed layers to Core /
  Local Allies / National Allies. Name corrections: "New Columbia Statehood
  Commission" → "New Columbia Commission"; "Statehood Pledge/Compact/Scorecard" →
  "DC Statehood Pledge/Compact/Scorecard" (matches their actual self-branding, found
  during the original verification pass but not carried through to the page). Added
  DC Democratic Party (Local Allies) and DNC (National Allies) to Party-affiliated,
  completing a three-layer progression alongside the existing Statehood Committee
  (Core) — verified DNC's platform position before adding. Cut the entire intro
  section (lead paragraph + Layer/Type explainer box) per "keep it tight" feedback;
  folded one line into the hero subtitle instead. Every directory card now has an
  explicit "Visit site" text link, not just a small icon.
- **2026-07-27 (layer rebalance, tag styling)** — Moved DC Appleseed, DCFPI, and
  Anacostia Coordinating Council from National Allies to Local Allies — resolves the
  open "DC Appleseed's layer" question. Moved League of Women Voters DC and ACLU DC
  from Local Allies to National Allies, making that layer coherent as "national org +
  DC chapter / national resolution" (joining NAACP DC Branch and DNC). Wrote
  supportive/descriptive taglines for all three layers to replace the previously
  label-only names. Fixed "DC Statehood PAC" blurb (was missing "DC"). Directory
  cards: added a third, color-coded layer tag distinct from the category tag;
  bottom-aligned the "Visit site" link via flexbox so it lines up across cards of
  varying description length in the same grid row; renamed the scope tag's
  "D.C.-local" text to "Local" (cleaner, matches the matrix's own "Local" label).
- **2026-07-27 (LWV/ACLU/NAACP split, category cleanup, matrix decluttered)** — Split
  LWV and ACLU each into a DC-chapter entry (Local Allies, e.g. "LWV DC") and a
  national-org entry (National Allies, e.g. "LWV") — verified both levels have
  independent on-record statehood involvement. **NAACP did not get the same split**
  — no DC-Branch-specific statehood statement found. Folded Student organizing into
  DC Community Advocacy (its only member was Students for DC Statehood — not enough
  to justify its own category). Renamed Coalition / partnership to DC Community
  Coalition. Removed the matrix chips' dashed-border treatment (it silently encoded
  org scope with no legend or explanation); scope is still shown as plain text on
  each directory card, so nothing was lost, just decluttered.
- **2026-07-27 (data consolidation)** — Extracted the org data out of
  `StatehoodPartnerMap.jsx` and this doc's parallel tables into a single new file,
  `src/data/statehoodPartners.js`, now the sole source of truth. This doc no longer
  duplicates org data — it's decision history and open questions only. Prompted by a
  direct question about where corrections should live going forward, to remove the
  two-copies sync risk that had shown up as small drifts across earlier rounds (e.g.
  a source-list entry or blurb fix landing in one file but not the other).
- **2026-07-27 (copy pass: tone, capacity references, stale data)** — Reviewed all 22
  descriptions for editorializing and diminishing language. Removed every reference
  to org operating capacity/informality: "volunteer-run" (RepresentDC), "same single
  volunteer" / "same volunteer operator" (Pledge/Compact/Scorecard), "volunteer"
  qualifier on Anacostia Coordinating Council's consortium, and the "D.C. residents
  alone can't" framing on Together for DC (reworded to describe the coalition's
  purpose without implying D.C. residents are insufficient on their own). Removed
  internal meta-commentary that had leaked into public card copy: the Statehood
  Committee's "not a RepresentDC stance" disclaimer, Free DC's "fuzzy inner/middle
  boundary" categorization note, DNC's "not a sustained day-to-day focus" aside, and
  LWV DC/ACLU DC's "listed by name on D.C.'s own statehood-supporters page" citation
  fragments (that verification detail lives in this doc's "Notable judgment calls"
  section instead — a card should describe the org, not our sourcing process).
  Removed DC Statehood PAC's 2021–2022 fundraising figure since we don't have a more
  recent number and stale specifics read worse than no specifics.
- **2026-07-28 (Official government split into three entries)** — The single "New
  Columbia Commission" entry conflated three separate government bodies. Split into:
  **Office of the Senior Advisor** (mayoral office; its Office of Federal and
  Regional Affairs coordinates the statehood push — `osa.dc.gov`), **DC Shadow
  Delegation** (two shadow Senators + one shadow Representative, elected by D.C.
  voters since 1990 to lobby Congress — `statehood.dc.gov/page/dc-governance`), and
  **New Columbia Statehood Commission** (created 2014; Mayor, Council Chairman, and
  the two shadow Senators — `statehood.dc.gov/page/new-columbia-statehood-commission`).
  Also **corrected the Commission's name** back to "New Columbia Statehood
  Commission" — the 2026-07-27 naming pass had trimmed it to "New Columbia
  Commission," but `statehood.dc.gov`'s own page confirms "Statehood" is part of the
  official name. Descriptions note the Commission/Delegation overlap (both shadow
  Senators sit on the Commission) without re-litigating it at length, per the prior
  round's "no meta-commentary" cleanup.
- **2026-07-28 (Fair Budget Coalition added; matrix note removed; chip hover
  affordance added)** — Added **Fair Budget Coalition** (`fairbudget.org`) to DC
  Community Coalition / Local Allies — verified via their own account: "Autonomy and
  statehood are deeply intertwined with our ability to have a just, equitable
  #DCbudget." Their core mission (racial-justice budget advocacy) is broader than
  statehood, so Local Allies rather than Core. Removed the `.spm-matrix-note`
  paragraph below the matrix ("Empty cells are informative... Click any chip to jump
  to its full entry below") — unclear value, and the "click any chip" half is now
  redundant with a new hover/focus affordance: chips round from a rectangle (7px) into
  a full pill (999px) and lift slightly on hover/focus-visible, signaling
  clickability visually instead of spelling it out in text.
- **2026-08-03 (PAC/Pledge copy precision; source-link audit)** — **DC Statehood PAC**:
  replaced a paraphrased mission ("full voting representation for D.C. via statehood")
  with the PAC's own verified words, quoted directly from `dcstatehoodpac.com`: "We
  support candidates and elected officials who support DC Statehood, and we oppose
  those who don't." More direct, and no longer a RepresentDC paraphrase of their
  position. **DC Statehood Pledge**: broadened the office list — the old copy named
  only U.S. Senate, state lieutenant governor, and state senate, which read as
  exhaustive but wasn't; the site actually covers the presidency, Congress, governors,
  state legislatures, and local offices (treasurers, comptrollers, school boards,
  city councils). Confirmed the site doesn't claim to perform outreach (just tracks/
  lists signers), so the broadened copy stays to "tracks," not "performs outreach to,"
  despite that phrasing being floated — an unverified action verb didn't belong even
  though the broader office list was correct.
  **Source-link audit (all 25 orgs + all `SOURCES` entries):** every org's `url`
  ("Visit site") field already pointed to the org's own domain — no fixes needed
  there. Found two `SOURCES` entries citing a third party instead of the org itself:
  DC Statehood PAC's only listed source was its FEC filing (`fec.gov`), not
  `dcstatehoodpac.com` — added the org's own site as the primary citation, kept the
  FEC filing as a secondary citation specifically for the "FEC-registered" claim.
  Same pattern for DNC: only source was a 2016 DCist news article — added
  `democrats.org`'s own 2024 platform page as the primary citation, kept the DCist
  article as a secondary citation specifically for the 2016-addition history claim.
  Fair Budget Coalition's statehood-statement source (`x.com/FairBudgetDC/...`) was
  flagged but kept as-is: checked `fairbudget.org/about` for an on-site alternative
  and found none — the X post is still the org's own verified account, just not their
  own domain, and no better primary source exists. All 37 unique URLs on the page
  spot-checked for HTTP 200 (one 403 on `lwv.org` is curl being bot-blocked, not a
  dead link — confirmed reachable via browser/search earlier in the project).
