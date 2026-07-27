# Statehood Stakeholder Map (working doc)

**Status: shipped 2026-07-27 as `/statehood-partner-map` — all 18 orgs verified.**
This doc remains the source-of-truth reference for that page's content; edit here
first, then port changes to `src/StatehoodPartnerMap.jsx`. The page is live but not
yet linked from nav or any other page — reachable by direct URL only.

## Naming: two different things called "statehood pledge"

- **Statehood Pledge** (`dcstatehoodpledge.org`) is a real, external, volunteer-run
  project — **national in scope**, tracking pledge signers among candidates and
  elected officials across multiple states. It's one of three tools run by the same
  single independent volunteer, with no formal org name — see the Inner Layer table
  below.
- **RepresentDC's own tool** (`candidates.representdc.org`, the repo internally named
  `dc-statehood-pledge`) should be referred to as the **Statehood Candidate
  Questionnaire** — D.C.-focused (2026 candidates specifically), and must not be
  confused with the external Statehood Pledge above. Worth a separate check on whether
  that site's own UI needs a wording fix too (not done in this pass). **Update
  2026-07-27:** the Questionnaire does not get its own row on the shipped page — it's
  a feature of RepresentDC, not a separate entity. The map instead has one
  **RepresentDC** entry (DC Community Advocacy, Inner layer) whose description
  mentions the Questionnaire and the Bill Tracker as two of the things RepresentDC
  runs.

## End vision

1. **A visual map** of the main orgs doing D.C. statehood work and how they relate to
   each other — not a flat logo wall, since it's a real layered coalition.
2. **A matching tool**: "if you want *this*, here's who to connect with."

## The layer model (primary structure, adopted 2026-07-26)

Replaces the earlier flat "Tier 1 / Tier 2" split. Orgs are grouped by **how central
statehood is to their mission** — not by what kind of org they are (that's the
secondary "Type" tag in each table) or where they operate (the secondary "Scope" tag).
Maps naturally to a concentric-circle visual: inner ring, middle ring, outer ring, with
the unnamed 100+ coalition as a loose outer haze beyond all three.

- **Core** (formerly "Inner layer") — statehood is the *entire* reason the
  org/tool/effort exists.
- **Local Allies** (formerly "Middle layer") — statehood is a *named, core* part of
  the mission, but the org has a broader mandate beyond it.
- **National Allies** (formerly "Outer layer") — the org supports statehood (on
  record, sometimes with real advocacy history), but it isn't a sustained core focus
  of their day-to-day work.

Renamed 2026-07-27. Tables below keep the old `### Inner/Middle/Outer layer` headers
as internal section anchors — only the reader-facing label changed, not the
underlying grouping.

Boundaries are genuinely fuzzy in places — flagged per entry below rather than papered
over.

**2026-07-27 restructure (this replaces the columns as first documented above):**
the old "Tracking tools" name was rejected as unclear, and RepresentDC's own presence
belonged in the same family — resolved differently than the first attempt:

- **DC Community Advocacy** — renamed from "Grassroots & community." Now also holds
  **RepresentDC itself** and the **Statehood Pledge / Statehood Compact / Statehood
  Scorecard** trio (moved out of a separately-invented "National Advocacy" column from
  the first pass — that was the wrong home for them).
- **National Advocacy** — renamed from "Civic & rights advocacy" (League of Women
  Voters DC, ACLU DC, NAACP). Note this reuses a name that briefly meant something
  else in the very first restructure attempt; if referencing an old screenshot or
  export, check the date.
- **DC Policy** — new category, merging the old "Policy & legal research" and
  "Fiscal/budget research" columns (DC Vote, DC Appleseed, DCFPI).
- **Statehood Candidate Questionnaire removed as its own row** — folded into the new
  RepresentDC entry instead (see the naming section above).
- The live page also **transposed the matrix**: Type is the row axis, Layer is the
  column axis (this table stays organized by Layer for readability, since re-deriving
  a Type-primary table in Markdown isn't worth the churn — the underlying data is
  identical either way).

### Inner layer

| Org | Category | Scope | Verified? | What they do (draft) |
|---|---|---|---|---|
| **New Columbia Commission** | Official government | D.C. | Confirmed 2026-07-27 — `statehood.dc.gov` | Created 2014 to coordinate D.C.'s statehood strategy for the District government and support the "shadow" congressional delegation. Led by the Mayor, Council Chairman, and D.C.'s shadow senators. |
| **DC Vote** | DC Policy | D.C. | Confirmed 2026-07-27 — `dcvote.org` | Founded 1998. Citizen engagement and advocacy for full democracy: budget/legislative autonomy and equal representation in Congress. Member of the National Coalition for Statehood. |
| **Neighbors United for DC Statehood** | DC Community Advocacy | D.C. | Confirmed 2026-07-27 — `the51st.org` | Grassroots, neighborhood-by-neighborhood statehood organizing — living-room talks, civic-group outreach, direct congressional lobbying. |
| **RepresentDC** | DC Community Advocacy | D.C. | N/A (ours) | This site — independent, volunteer-run. Also runs the Bill Tracker (billtracker.representdc.org) and the Statehood Candidate Questionnaire (candidates.representdc.org). |
| **DC Statehood Pledge** | DC Community Advocacy | National | Confirmed 2026-07-26 — `dcstatehoodpledge.org` | Tracks candidate/official pledge signers nationally — U.S. Senate, state lieutenant governor, state senate, across multiple states. One of three tools, same single volunteer, no formal org name. |
| **DC Statehood Compact** | DC Community Advocacy | National | Confirmed 2026-07-26 — `dcstatehoodcompact.org` | Tracks state legislatures introducing resolutions backing D.C. statehood (interstate-compact approach). Sibling of Pledge/Scorecard. |
| **DC Statehood Scorecard** | DC Community Advocacy | National | Confirmed 2026-07-26 — `dcstatehoodscorecard.org` | Searchable legislator-by-legislator voting/interference tracker, filterable by name/party/jurisdiction/rating. Sibling of Pledge/Compact. |
| **DC Democratic Party Statehood Committee** | Party-affiliated | D.C. | Confirmed 2026-07-27 — `dcdemocraticparty.org/dcstatehood` | Officially affiliated committee of the D.C. Democratic Party dedicated to full democracy and self-determination for D.C. |
| **Students for DC Statehood** | Student organizing | National — 8 university chapters incl. D.C. | Confirmed 2026-07-27 — `studentsfordcstatehood.com` | National student org, 8 active chapters (Georgetown, American, Trinity Washington, and others), mobilizing 100,000+ D.C. college students. |
| **DC Statehood PAC** | Funding / PAC | National (FEC-registered) | Confirmed 2026-07-26 — FEC ID C00800227, `dcstatehoodpac.com` | Hybrid PAC ("Carey committee"); mission is full voting representation via statehood. Raised ~$56K in the 2021–2022 cycle. |
| **Together for DC** | Coalition / partnership | National | Confirmed 2026-07-26 — `togetherfordc.org` | Launched June 2026. "National solidarity infrastructure" recruiting out-of-state/national allies to pressure Congress. Steering committee includes League of Women Voters DC (see Local Allies), DCNOW, Public Citizen, Taskforce for Democracy. Also the natural link target for the "100+ orgs" line below. |

**Guardrail (from the original brainstorm doc, §7):** the DC Democratic Party
Statehood Committee's party affiliation must be labeled plainly and explicitly on the
map — it's a fact about the org, not a RepresentDC stance.

**Parent/child note:** the Statehood Committee is a sub-unit of the broader D.C.
Democratic Party (middle-layer mandate: statehood is one plank of a full party
platform). Kept as a single entry for now — checked whether the same
parent/sub-unit pattern applies to League of Women Voters, ACLU DC, or NAACP and found
no evidence any of them have a similarly named, dedicated internal statehood
committee; their statehood work is folded into their general advocacy rather than
run through a separate branded unit. Revisit only if that changes.

### Middle layer

| Org | Category | Scope | Verified? | What they do (draft) |
|---|---|---|---|---|
| **DC Democratic Party** | Party-affiliated | D.C. | Confirmed 2026-07-27 — `dcdemocraticparty.org` | The party itself — broader mandate than its own Statehood Committee (Core layer, above), but statehood organizing has been a consistent activist priority within it for decades. Added 2026-07-27 to make the Committee → Party → DNC progression explicit across all three layers. |
| **Free DC** | DC Community Advocacy | D.C. | Confirmed 2026-07-27 — `freedcproject.org` | Founded 1997, grassroots nonpartisan 501(c)(3) protecting home rule: full local budget control, locally elected/appointed judges, full voting representation. |
| **League of Women Voters of DC** | National Advocacy | D.C. (chapter of national org) | Confirmed active — also on Together for DC's steering committee | Voter education and civic engagement; has taken positions on and hosted events around statehood. |
| **ACLU of DC** | National Advocacy | D.C. (chapter of national org) | Confirmed 2026-07-26 — `acludc.org` | D.C. Statehood is one of ACLU-DC's four major issue areas (alongside criminal legal system reform, First Amendment, freedom from discrimination). Runs an active "DC Statehood Now" campaign with a dedicated staff position. |

**Fuzzy boundary flags:**
- **Free DC** — is home-rule defense genuinely *broader* than statehood (middle), or
  just the same fight from a defensive angle (arguably inner)? No clean line; kept in
  middle per the original placement, revisit if it matters for the visual.
- **ACLU DC** — one of four issue areas, but backed by a dedicated campaign and staff
  role — deeper commitment than a typical middle-layer entry. Still middle (statehood
  isn't ACLU-DC's *entire* mission), but flagging that it sits close to the inner
  boundary.

### Outer layer

| Org | Category | Scope | Verified? | What they do (draft) |
|---|---|---|---|---|
| **DNC** | Party-affiliated | National | Confirmed 2026-07-27 — national platform has backed D.C. statehood since 2016, reaffirmed at the 2024 convention (dcist.com) | The Democratic National Committee's national platform has included D.C. statehood support since 2016 — on-the-record national backing, not a sustained day-to-day focus. Completes the Committee (Core) → DC Democratic Party (Local Allies) → DNC (National Allies) progression. |
| **DC Appleseed** | DC Policy | D.C. | Confirmed 2026-07-26 — `dcappleseed.org` | Core mission is broad DC governance/public-interest law ("make DC a better place to live and work"). **Flag:** deeper statehood involvement than a typical outer-layer entry — 30+ years of advocacy, described as the "primary legal architect" of DC's voting-rights legal strategy, filed a federal lawsuit over congressional voting rights in 2018. Possibly belongs in Middle Layer instead; kept in Outer per original placement pending your call. |
| **DC Fiscal Policy Institute (DCFPI)** | DC Policy | D.C. | Confirmed 2026-07-26 — `dcfpi.org` | Core mission is budget/tax research for low- and moderate-income D.C. residents. Published "The High Cost of Denying Statehood to the District of Columbia" (March 2021) connecting statehood to fiscal outcomes — a specific research output, not a sustained standalone program. |
| **Anacostia Coordinating Council** | DC Community Advocacy | D.C. (Wards 7–8) | Confirmed 2026-07-26 — active since 1983, 80+ partner orgs | Core mission is East-of-the-River community revitalization. Ran an "East of the River Youth Voices for Statehood" poetry/essay project — a specific program, not an ongoing statehood focus. |
| **NAACP (DC Branch)** | National Advocacy | National org, D.C. branch | Confirmed 2026-07-26 | National NAACP has reaffirmed statehood support via resolutions since 1978 (multiple times through 2016); DC Branch president has signed on to public letters. Statehood is one plank on a very broad national civil-rights platform. |

Plus the unnamed long tail: **"and a growing coalition of 100+ organizations"** — a
single credit line linking directly to Together for DC's own coalition page
(`togetherfordc.org`) as the living source of truth, dated to whenever last checked.
Together for DC's own steering committee alone already lists 16+ named orgs (Center
for Economic Democracy, DC Jobs With Justice, DC Justice Lab, DC Chapter NOW, Fair
Budget Coalition, Miriam's Kitchen, National LGBTQ Task Force, Public Citizen, SPACEs
in Action, Taskforce for Democracy, DCNOW, and others) — not reproduced here since it
will drift out of date; check Together for DC's page directly rather than this doc for
that list.

## Open questions for the next iteration

- **DC Appleseed's layer** — flagged above as possibly middle, not outer. Your call.
- **Nav / IA placement** — the shipped page isn't linked from anywhere yet. Candidates:
  add to main nav, link from `/statehood-curious`'s "Meet the movement" preview card
  (would partially retire that card's coming-soon status — pursuing that was explicitly
  deferred as its own bigger decision on 2026-07-26), or leave direct-URL-only for now.
- **Matching-tool UX** — how a visitor expresses "what they want" and how that maps to
  the "best for" column above. Not built yet — the shipped page is the map, not yet
  the matcher.
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
  possible middle-layer miscategorization pending your call. Confirmed no other org
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
