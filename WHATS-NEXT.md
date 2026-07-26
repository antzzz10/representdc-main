# What's Next for RepresentDC

A running backlog of ideas and design work for the RepresentDC domain
(representdc-main, dc-bills-tracker, dc-statehood-pledge) that's been considered but
isn't being built yet. Add to this instead of letting half-built or shelved ideas
linger in code or in conversation. Pair with `decisions/` (resolved decisions) and
`DESIGN-GUARDRAILS.md` (standing rules) — this file is for what's *not* decided or
built yet.

## Proposed roadmap

This is a proposed sequence, not a decision — reorder or reject phases as you see fit.
The logic: settle strategy (audience, content) before building new features on top of
it, do cheap/independent cleanup whenever, and hold anything that needs a redesign
rather than let it block other work.

**Phase 1 — Foundation cleanup** ✅ done (2026-07-10)
- ~~Finish `TalkingPoints.css` token migration~~
- ~~Resolve the footer quote sourcing/attribution question~~ — removed the line
  entirely rather than reword it (see `decisions/2026-07-10-design-system-integration.md`)

**Phase 2 — Strategy: content and audience** ✅ done (2026-07-11)
- ~~Full content review of the main site~~ — fixed the Trend section (was claiming an
  unsupported "accelerating" trend, redundant with the Facts section — now shows
  passed-vs-pending as genuine movement evidence), the "Local control" title duplicated
  across Values and Solution sections, and inconsistent/partisan-adjacent naming of
  office-holders. See `decisions/2026-07-11-content-review-and-audience.md`.
- ~~Decide whether/how to separate the candidate site's audience~~ — kept
  representdc-main and dc-statehood-pledge's distinct voices as-is (broad advocacy vs.
  D.C.-voter/election tool), added explicit "for D.C. voters" signposting on both the
  nav and footer links to the candidate tracker instead of merging voice or duplicating
  content across sites.

**Phase 3 — Independent, low-risk track** ✅ done (2026-07-11)
- ~~dc-bills-tracker color/token remap~~ — see
  `decisions/2026-07-11-billtracker-token-remap.md`

**Phase 4 — Homepage realignment + Statehood-curious page** *(homepage/nav done 2026-07-12; Statehood-curious page + eval pipeline still pending)*
Scoped in detail after discovering the live homepage had drifted from the confirmed
design (see `decisions/2026-07-12-persona-picker-and-statehood-curious.md`):
- ~~Rebuild `Home.jsx`/`Nav.jsx` to restore the persona picker~~ ✅ done — 4-card
  persona picker live between the Explainer and Values sections; nav realigned to
  Home · The Case · Myths & FAQ · Bill tracker · Candidates · [See the bills]
- ~~Category-cards section moves to its own page~~ ✅ done — now `/the-case`
  (`src/TheCase.jsx`), linked from nav (not from a persona card — no card pointed to it
  in the original design either)
- ~~Take Action Hub coming-soon page~~ ✅ done — `src/TakeAction.jsx`, previews the
  three real content ideas (Congressional outreach toolkit, state-level advocacy, "No
  donation without representation")
- ~~"New to D.C." gets a dedicated page instead of an anchor scroll~~ ✅ done
  (2026-07-25) — `/how-congress-controls-dc`, a deeper newcomer explainer (pre-1973
  governance history, all three congressional override mechanisms, sourced against
  dccouncil.gov and ACLU of DC); homepage's light `#explainer` section kept as-is for
  organic scrollers. All four picker cards now land on their own route. See
  `decisions/2026-07-25-new-to-dc-dedicated-page.md`.
- `src/StatehoodCurious.jsx` is an **interim coming-soon page** (previews + live links;
  upgraded from bare stub 2026-07-14). Full build (hybrid case-for-statehood copy,
  ported news section, stakeholder org list, eval pipeline) is the next chunk of
  Phase 4 work. Flow fixes + approved segment mapping: see
  `decisions/2026-07-14-persona-flow-fixes.md` and
  `decisions/2026-07-20-segment-mapping.md`.
- ~~News piece, tried standalone first~~ ✅ done (2026-07-23) — `src/News.jsx` at
  `/news`, live-fetches dc-bills-tracker's public `news.json` (CORS-open, no new
  pipeline). Unlinked from nav/picker on purpose — it's a trial to evaluate before
  deciding whether it earns a permanent spot, or whether `/statehood-curious`
  eventually embeds/links to it instead of building its own news section. See
  `decisions/2026-07-23-standalone-news-page.md`.
- Build the **Statehood-curious** destination page: hybrid case-for-statehood copy
  (reuse already-sourced claims from Values/Solution/Myths rather than write new ones),
  a stakeholder org list (Tier 1/Tier 2 from the Action & Persona IA Brainstorm), and a
  decision on how the news piece above folds in — plus the eval pipeline below
- Build the accuracy eval pipeline: a trusted-domain allowlist gate, then an
  LLM-assisted citation-support check for anything that passes it — reusable beyond
  this one page, flagged as this project's first real eval process
- News sources finalized in dc-bills-tracker's `scripts/fetch-news.js`: **NOTUS**
  confirmed working; **League of Women Voters DC** added but unverified (check the
  next scheduled Action run's log); **Rep. Norton's office** excluded (no working feed
  found — the one guess that returned data was a stale 2021–2022 artifact); **Sen.
  Ankit Jain's site** skipped (no RSS/Atom feed exists at all)
- **Decided:** the "Statehood activist" persona card gets a coming-soon placeholder
  (Take Action Hub itself isn't scoped yet) that previews real planned content rather
  than a bare "coming soon": a toolkit for outreach to key members of Congress based on
  current bill status, ways to get involved at the state level (leading statehood
  resolutions in state legislatures, offering testimony when state-level statehood
  bills come up for a vote), and a "No donation without representation" push — urging
  donors to withhold financial/time support from candidates who haven't committed to
  statehood

**Phase 5 — Visual diversification** *(after Phase 4 settles)*
- Move the site away from text-only (imagery, data visualization, other media)

**Phase 6 — dc-statehood-pledge rollout**
- Token sync is already staged; full component work sequenced after the Phase 2
  audience-separation decision, since that decision could change what this site even
  needs to look like

**Phase 7 — Take Action Hub, full build** *(after Phase 4's coming-soon placeholder proves the demand)*
- Real content already sketched above (Congressional outreach toolkit, state-level
  advocacy, "No donation without representation"), plus whatever the Phase 4
  coming-soon page's engagement suggests is worth prioritizing first

**Held indefinitely**
- Myth-busting games — needs a redesign before it's worth reconsidering at all

---

## New since last update

- **Myths & FAQ categorization:** the combined myth/FAQ list (8 myths + 2 FAQs as of
  2026-07-25) is still a flat list — fine at this size, but revisit grouping if it
  grows toward 15–20+ items. Two options already proposed and one recommended
  (by theme: money/who-lives-here/rights/federal-status/feasibility) — see the
  "Follow-up" section of `decisions/2026-07-25-myths-faq-redesign.md` before
  re-deriving from scratch.
- **Automated events sourcing:** need a way to automatically source and rotate through
  upcoming statehood-related events, ideally pulled from partner orgs' own listings
  rather than events RepresentDC runs itself. (The Action & Persona IA Brainstorm
  already sketches this — see `reference/brand/RepresentDC Action & Persona IA
  Brainstorm.dc.html` — including a proposed empty-state fallback when nothing's
  scheduled.)
- **Interactive stakeholder map:** review the "meet the movement" stakeholder map
  concept and, ideally, make it interactive rather than static. Content groundwork
  already exists in the same brainstorm doc: a proposed two-tier structure (5–8 core
  orgs with one-line descriptions, plus a link out to Together for DC's own coalition
  page for the wider 100+ org network) — visual/interactive layout still needs design.
- **Visual diversification:** the site is entirely text-only today: photography, data
  visualization, illustration, or other media haven't been considered at all. Worth a
  deliberate pass once content direction is settled.

## Held

- **Myth-busting games on the Myths & FAQ page** (trivia, spot-the-51-star-flag,
  match-the-quote-to-the-person). Built once (2026-07-10) from a Claude Design handoff,
  then removed at the design's own request — the interaction design wasn't well
  thought through and needs another pass before it's worth shipping. The original
  content/logic reference is still in
  `reference/brand/handoff-2026-07-10/myths-and-faq-with-games.dc.html` if a future
  version wants to start from it. Note if picked back up: the quote-matching round's
  historical attributions (Nixon, Frederick Douglass, party platforms) need real inline
  citations before shipping, per `DEVELOPMENT-GUIDELINES.md`.

## Exploratory / not yet scoped

- **Take Action Hub page** — has a coming-soon placeholder scoped in Phase 4 (see
  above) but the full page is still Phase 7, not yet built.
- **Action & Persona IA Brainstorm** — raw information-architecture exploration behind
  the persona picker, events, and stakeholder map ideas — reference doc, not a build
  spec on its own, but Phase 4 now draws directly from it (stakeholder org list) rather
  than treating it as purely speculative.

## Backlog (mechanical / already scoped)

- Design system rollout to dc-statehood-pledge (new `--support-green` tokens staged,
  full component work not yet scoped)
