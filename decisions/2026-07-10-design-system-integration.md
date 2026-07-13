# Decision: Claude Design system integration — conflict resolutions

**Date:** 2026-07-10
**Context:** Pulled the "RepresentDC Design System" project from claude.ai/design (project `d750a15b-e517-4f7c-8d38-9339e64bd1a8`) to extend representdc-main with a navy-forward, red-rationed visual redesign. Before implementing, compared the prototype (`ui_kits/website/`) against the live site, the design system's own guardrails (`SKILL.md`, `_adherence.oxlintrc.json`), and this repo's existing guardrail docs (`DEVELOPMENT-GUIDELINES.md`, `STRATEGY.md`, `CLAUDE.md`). Full comparison table lives in the chat session that produced this note; resolutions below.

Consolidated, forward-looking guardrails from these decisions now live in `DESIGN-GUARDRAILS.md` (this repo). This note is the record of *why*.

## Decisions

**1. Brand name spelling → "RepresentDC" (one word)**
The logo wordmark, the design system README, and this repo's own `CLAUDE.md` all already use one word. Only the hardcoded footer/copyright strings in `App.jsx` say "Represent DC" — that's a typo to fix, not a real style choice. Applies to code in representdc-main now; other two repos to follow whenever they pick up this pass.

**2. Casing conflict (STRATEGY.md vs. SKILL.md) → sentence case wins, domain-wide**
`STRATEGY.md`'s original hero example used Title Case + full caps for emphasis ("Congress Is Blocking D.C. Laws RIGHT NOW"). The design system's `SKILL.md` mandates strict sentence case, caps reserved only for tiny eyebrow labels. Resolved in favor of sentence case everywhere, including the hero — urgency is carried by word choice and the red/navy accent system, not by capitalization. `STRATEGY.md`'s persuasion *strategy* (loss framing, foot-in-the-door, etc.) is unaffected; only the literal casing example is superseded.

**3. Scope → representdc-main only for this pass**
Tokens, rebuilt sections, and the logo hold (see #5) land in representdc-main first. `dc-bills-tracker` and `dc-statehood-pledge` are a separate future decision — do not assume this pass extends to them.

**4. Nav "The Case" link → anchors to existing Values/Solution content**
The prototype nav included a "The Case" link with no real target. Resolved as an in-page anchor link to the rebuilt Values + Solution sections — no new page/route.

**5. Logo → hold off, stay swap-ready**
A custom logo is being designed separately. Keep the current default mark in representdc-main for now; do **not** adopt the design system's placeholder flag-derived mark. Structure the header/nav/footer logo references so the real logo can drop in as a single asset swap once it's ready — don't hardcode around the placeholder's specific dimensions/proportions.

**6. Font hosting → Google Fonts CDN for now**
The design system's own README flags self-hosting as a production concern, but per standing guidance (optimize only for measured performance issues), ship with the CDN `@import` today. Revisit self-hosting only if load time becomes a measured problem.

**7. Shared design-system package → not now**
`_adherence.oxlintrc.json` assumes a real shared package (`import from index.js, not internals`), but the three RepresentDC repos are independent today with duplicated components. Copy `colors_and_type.css` + assets directly into representdc-main rather than standing up a shared npm package/submodule. Revisit only if visual drift across the three sites becomes a real maintenance problem.

## Also settled (non-negotiable, not a judgment call)

- **Placeholder bill data from the prototype (fake sponsors, fake bill numbers) must never be ported into representdc-main or dc-bills-tracker** — `DEVELOPMENT-GUIDELINES.md`'s sourcing/citation policy makes this non-negotiable, not a style preference.
- **The Values, Trend, and Solution sections must be rebuilt in the new visual language, not dropped** — per `STRATEGY.md`, these are 3 of 5 deliberate persuasion beats (Hook → Validate → Connect → Pattern → Solution), not optional polish the prototype happened to omit.
- **Cross-site nav links (billtracker.representdc.org, candidates.representdc.org) must stay live** — required by this repo's `CLAUDE.md`.
- **`Tracker.jsx` from the design system belongs to `dc-bills-tracker`, not this repo** — the design system project bundles prototypes for both products under one `ui_kits/website/` folder; this repo only takes the main-site pieces (Nav, Hero, StatBand, Footer, Icon, kit.css, tokens).

## Next step
Implement the port into representdc-main per these resolutions.

## Addendum (later same day): logo finalized

Decision #5 above (hold off on a logo) is superseded. A custom mark was designed in
Claude Design and delivered as `reference/brand/RepresentDC Logo Style Guide.dc.html` —
a five-pointed star with one point rendered as a diagonal hatch instead of a flat fill.
Per the guide's own "Meaning & intent" section, the asymmetric point is intentional: it
represents D.C.'s incomplete standing in American democracy, not a finished symbol.
Texture (not color alone) carries that meaning so it survives colorblindness and
single-ink print — confirmed as deliberate, not just an accessibility afterthought.

Also confirmed: staying with an original mark rather than the D.C. flag's three-stars-
two-bars, to avoid visual overlap with nearly every existing D.C. statehood
organization's branding — accepted trade-off against the flag's instant recognizability.

Implemented in `src/components/Logo.jsx`, wired into `Nav.jsx` and the footer, plus
`public/favicon.svg`. Full spec (wordmark rules, color combinations, clear space,
minimum sizes, don'ts) lives in the reference file, not duplicated here.

**Process note:** the style guide and five companion exploration pages (Logo Options,
Myths and FAQ, Homepage, News and Ways to Help, Take Action Hub, Action & Persona IA
Brainstorm) existed only as loose Claude Design canvas "Pages," invisible to Claude
Code's design-sync tooling until manually downloaded and committed to
`reference/brand/`. Worth checking whether Claude Design's page menu supports moving a
Page into a project's actual synced file tree — that would remove the manual
download-per-file step entirely.

## Addendum (later same day): Myths & FAQ page, games, and routing

A formal design handoff bundle (`reference/brand/handoff-2026-07-10/`) confirmed scope
for two things: (1) representdc-main gets three myth-busting games added to a new
Myths & FAQ page, plus a small teaser card on the homepage; (2) dc-bills-tracker gets a
confirmed 1:1 color-token remap (no visual redesign) — semantics read directly from
that repo's own `DEVELOPMENT-GUIDELINES.md` and `CLAUDE.md`, so task #3 in the workplan
is now fully unblocked whenever that repo's turn comes.

New tokens (`--support-green`, `--support-green-dark`, `--support-green-tint`, plus the
previously-unused `--status-*`/`--party-*` set) were synced into this repo's
`src/styles/tokens.css` per the handoff's explicit instruction to keep both repos'
copies in sync, even though representdc-main doesn't use the support-green token yet —
it's staged for the future dc-statehood-pledge rollout (task #4).

**Scope discrepancy caught before building:** the handoff's own README says
representdc-main only gets "a homepage teaser" — but the bundled `homepage.dc.html`
file actually contains a much larger redesign: a 4-card "Where do you want to start?"
persona picker, and a nav bar restructured around pages that don't exist yet (News and
Ways to Help, Take Action Hub — neither has a finalized spec, only earlier loose
exploration pages). Built only what the README confirmed as in scope — the small
game-teaser card — and left the persona grid / nav overhaul out rather than treating an
unconfirmed mockup file as authoritative over its own README.

**Structural change: this repo now has client-side routing for the first time**
(`react-router-dom`, `BrowserRouter` in `main.jsx`, routes in `App.jsx`), plus the
GitHub Pages SPA hack (`public/404.html` + a redirect-restore script in `index.html`) —
copied directly from dc-statehood-pledge's existing, working pattern rather than
inventing a new one. Page components live as top-level files (`Home.jsx`,
`MythsAndFaq.jsx`) rather than under a new `pages/` folder, again matching
dc-statehood-pledge's (`App.jsx`/`Party.jsx`/`Respond.jsx`) convention. Worth confirming
this is the convention going forward as more pages get added — it wasn't an explicit
decision point before today, just the closest existing precedent in the same product
family.

**Footer:** left untouched per instruction (the quote-sourcing question from earlier
this session is still open) — only mechanically extracted into `components/Footer.jsx`
since two routes now need it, no content or copy changed.

**Flagged, not resolved:** the games' quote-matching round attributes real quotes to
Nixon, Frederick Douglass, and party platforms without inline citation links, unlike
the myths/FAQ sections above them on the same page. `DEVELOPMENT-GUIDELINES.md` treats
historical claims and attributions as requiring verification before shipping — worth a
sourcing pass even though the design handoff treats this content as final/high-fidelity.

**Superseded same day:** the three games were removed entirely — the interaction
design wasn't well thought through and is being held for a better version. Moved to
`WHATS-NEXT.md` under "Held" rather than left half-built in code. The Myths & FAQ page
itself (six myths, four FAQs) and the routing infrastructure it required stay in
place — only the games and their homepage teaser card were pulled.

**Footer quote — resolved (removed):** the "D.C. statehood is a civil rights issue..."
line read too much like an attributed quote without a source, and once the footer
became shared across multiple pages (Home + Myths & FAQ), its "these bills" phrasing
stopped making sense on pages that aren't about bills specifically. Removed the
statement and its CSS (`.footer-statement`) entirely rather than reword it — the
footer doesn't need a mission-statement line to work.
