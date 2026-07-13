# RepresentDC — Design System

A design system for **RepresentDC**, an independent, volunteer-run advocacy project
for **D.C. statehood** and for protecting the **voting rights and home rule** of all
700,000 District of Columbia residents.

The work is entirely **education and advocacy**: explaining, in plain and non-partisan
terms, how Congress overrides laws passed by D.C.'s elected government — and making the
case that statehood is the practical fix.

---

## Products represented

RepresentDC is a small family of single-page web tools (React + Vite, deployed to GitHub
Pages). They share a voice and a flag-based visual identity:

| Product | What it is | URL |
|---|---|---|
| **Anti-DC Bills Tracker** | The flagship tool. A searchable, filterable, auto-updating list of bills in Congress that threaten D.C. home rule — grouped by priority, status, and category, with sponsor and vote detail. | billtracker.representdc.org |
| **Main site (representdc.org)** | A persuasion-first landing page: loss-framed hero, "0 senators / 96 bills" facts, the "no taxation without representation" rally, and the statehood solution. | representdc.org |
| **Candidate / Statehood Pledge** | A questionnaire tracking where 2026 candidates stand on statehood. | candidates.representdc.org / pledge.representdc.org |

This design system focuses on the **website surface** (tracker + main site), which is where
nearly all the existing UI lives. There is one UI kit: `ui_kits/website/`.

---

## Sources

This system was reverse-engineered from the project's own source code. If you have access,
explore these repositories to design with higher fidelity — they contain the real component
code, the live copy, and the bill data model:

- **Anti-DC Bills Tracker** — https://github.com/antzzz10/dc-bills-tracker
- **Main site** — https://github.com/antzzz10/representdc-main
- Related: https://github.com/antzzz10/dc-statehood-pledge · https://github.com/antzzz10/dc-action-hub *(private)*

Imported source for reference lives in `src/` (the tracker's components + CSS + `bills.json`).

> **No logo existed in either repo** (both shipped the default Vite mark). The logo in
> `assets/` is a **proposed** mark built from the public-domain **District of Columbia flag**
> (three stars over two bars) plus a `RepresentDC` wordmark. Replace it if you have official
> brand art — see Caveats.

---

## The evolution this system makes

The brief: *"The colors of the DC flag are red and white… but there is too much red,
especially with the alerts."* This system keeps the flag identity while fixing that:

1. **Navy becomes the workhorse.** `#14213D` carries headers, headings, primary surfaces,
   and the default icon color. Red steps back to a **deliberate accent**.
2. **Red is rationed.** It now signals exactly three things: **urgency** (alerts), **primary
   CTAs**, and the **high-priority** bill flag. It is no longer the background of every banner.
3. **Alerts are contained, not flooded.** The old full-bleed red gradient slab becomes a white
   card with a 6px red accent bar and a pulsing red eyebrow — see `preview/comp-alert.html`.
4. **The AI-slop purple/blue gradient is gone.** The old `#667eea → #764ba2` "pending" gradient
   is replaced by navy.
5. **Emoji become real icons.** 📋 🔴 ⚪ → a single-weight **Lucide** stroke set.

---

## Content fundamentals

**Voice: informational, friendly, direct — and scrupulously non-partisan.** The strategy
(documented in the main repo's `STRATEGY.md`) is to win agreement incrementally with
evidence, not ideology.

- **Lead with the concrete, not the abstract.** "Congress is blocking D.C. laws **right now**"
  and "0 senators · 96 bills" — never "D.C. wants statehood." Specifics (traffic cameras,
  H.R. 8801, 700,000 residents) over philosophy.
- **Loss framing.** Emphasize what's being *taken away* from residents, because losses
  motivate more than gains.
- **American-values vocabulary, no party labels.** "No taxation without representation,"
  "local control," "equal rights," "accountability." Avoid naming Democrats / Republicans
  as teams; sponsors' parties are shown only as neutral data badges (R / D / I).
- **Person:** addresses the reader plainly ("See all 96 bills") and describes the project in
  the **first person plural / modest third person** ("This is an independent, volunteer-run
  project created by a proud DC resident"). Soft CTAs ("Learn more," "Send feedback"), never
  "Support statehood NOW!"
- **Casing:** sentence case for headlines and buttons. UPPERCASE only for tiny eyebrows /
  labels (`UPDATE`, `FLOOR VOTE`, status tags). Title Case avoided.
- **D.C., not DC**, in body copy (periods); "DC" is acceptable in compact UI and the wordmark.
- **Tone of the rally line** is the one place editorial *italic serif* and emotion are allowed.
- **No emoji in copy.** (The legacy code used them as section icons — this system replaces them.)

**Examples (verbatim from the live products):**
- Hero: *"Congress Is Blocking D.C. Laws Right Now."*
- Subhead: *"96 bills pending in Congress to overturn local D.C. decisions—from policing to healthcare to traffic laws."*
- Footer creed: *"D.C. statehood is a civil rights issue. These bills undermine the democratic rights of D.C. residents."*
- Precedent framing: *"The United States has admitted 37 states since the original 13. D.C. has more residents than Wyoming and Vermont."*

---

## Visual foundations

**Palette.** White / black / **DC-flag red** `#C8102E` / **civic navy** `#14213D`, with a
restrained **gold** `#E0A500` accent for dark surfaces and footer links. Warm-neutral slate
ramp for text and lines. Page background is a soft `#F6F7F9` paper, not flat grey. Full tokens
in `colors_and_type.css`; swatches in `preview/colors-*`.

**Type.** An intentional upgrade from the original system-font stack:
- **Public Sans** — UI, body, and headings. (It's literally the *U.S. Web Design System*
  typeface — a meaningful, on-theme choice for a representation brand.)
- **Source Serif 4** — reserved, italic, for the editorial "rallying-cry" pull-quotes only.
- **IBM Plex Mono** — all data: bill numbers, vote tallies, dates, the 119th Congress.
  Tabular numerals.
- Headlines are sentence case, weight 700–800, slightly tight tracking (`-0.02em`).

**Backgrounds.** Flat, confident fills — white cards on paper; **navy** for hero / footer /
emphasis panels. No photographic hero, no texture, **no gradients** as a rule (the one
sanctioned gradient is a *subtle* navy `#14213D → #243657` on large hero/footer panels).
No background patterns.

**Cards.** White, `--r-md` (10px) or `--r-lg` (14px) corners, hairline `#E3E7ED` border
and/or a soft navy-tinted shadow (`--shadow-sm` at rest, `--shadow-md` on hover). The
signature card is the **bill card**: a left **accent border** (4px) whose color encodes
priority — red only for high priority, slate otherwise.

**Borders & dividers.** 1–1.5px, `#E3E7ED` / `#D2D8E0`. Left accent bars (4–6px) are a
recurring motif for priority and alerts. Pills use full-round `--r-pill`.

**Shadows.** Soft and navy-tinted (`rgba(20,33,61,…)`), never harsh black. Four-step
elevation scale; overlays use `--shadow-lg`. No inner shadows; no glows except the alert's
pulsing red dot.

**Motion.** Quick and functional: `0.18s` with `cubic-bezier(0.4,0,0.2,1)`. Hover lifts
buttons/cards `translateY(-1px to -2px)` and deepens the shadow. The single decorative
animation is a slow **pulse** on the live "Update" dot / urgent badge. Expand/collapse uses
a short slide-down + fade. Respect `prefers-reduced-motion`.

**Hover / press states.** Buttons darken (red → `#9E0C24`, navy → `#33476B`) and lift; ghost
buttons gain a navy border + navy text. Pills fill navy when selected. Press = settle back to
`translateY(0)`. Links shift toward the darker shade; footer/gold links reduce opacity.

**Transparency & blur.** Used sparingly — translucent white chips (`rgba(255,255,255,.2)`)
for counts/badges on colored surfaces. No backdrop-blur glass.

**Imagery vibe.** The brand is **type- and data-forward**; there is almost no photography.
When imagery is needed, keep it documentary and civic (the Capitol, the flag), cool-neutral,
never warm-filtered or stocky.

**Layout.** Centered `max-width: 1200px` content column, `2rem` gutters, generous vertical
section rhythm (`--s-7`/`--s-9`). Single-column on mobile (`768px` breakpoint).

---

## Iconography

- **System: [Lucide](https://lucide.dev)** (CDN). Clean **2px stroke**, single-color, rounded
  joins — the right register for a calm, informational civic tool. Load via
  `https://unpkg.com/lucide@0.544.0/dist/umd/lucide.min.js` then `lucide.createIcons()`.
- **This is a substitution, and is flagged.** The original code used **emoji as iconography**
  (📋 pending, 🔴 high priority, ⚪ other, ✓ solution points, " quote mark). Emoji are
  inconsistent across platforms and read as informal; Lucide gives a uniform, brandable set.
  If you prefer a different family (e.g. Heroicons, Phosphor), swap the CDN — usage rules hold.
- **Color & size:** navy by default; **red only for genuinely urgent** icons. Sizes 16 / 20 /
  26px. Never multicolor, never filled.
- **Common glyphs:** `landmark` (Capitol/Congress), `scale` (bill/law), `alert-triangle`
  (urgent), `search`, `filter`, `vote`, `clock` (recent activity), `download` (export),
  `external-link` (Congress.gov source), `users` (sponsors). See `preview/brand-icons.html`.
- **Logo / brand mark:** the **DC flag** motif (3 stars, 2 bars) in `assets/`. It is an SVG;
  reference it directly, don't redraw it. No emoji or unicode glyphs as brand marks.

---

## What's in this folder (index)

| Path | What it is |
|---|---|
| `README.md` | This file. |
| `SKILL.md` | Agent-Skill front-matter so this system can be used in Claude Code. |
| `colors_and_type.css` | **Start here for tokens.** All color, type, spacing, radius, shadow CSS variables + semantic `.ds-*` classes. |
| `assets/` | `logo-representdc.svg` (light), `logo-representdc-dark.svg`, `dc-flag-mark.svg` (icon mark). |
| `preview/` | The Design System tab cards — small specimens for colors, type, spacing, components, brand. |
| `ui_kits/website/` | High-fidelity recreation of the RepresentDC website (tracker + landing). `index.html` is the interactive demo; `*.jsx` are reusable components. See its own README. |
| `src/` | Imported reference source from the tracker repo (real components, CSS, `bills.json`). Read, don't ship. |

---

## Caveats

- **No official logo or brand fonts exist** in the repos. The logo is a proposed flag-derived
  mark; the fonts are an intentional, documented upgrade from the system-font stack. **Please
  send real brand art and any licensed fonts** if they exist.
- Fonts load from the **Google Fonts CDN**. For offline / production hosting, self-host the
  files in a `fonts/` folder and replace the `@import`.
- This is a **considered evolution**, not a 1:1 mirror, of the live site — chiefly the
  red-reduction and the navy promotion. If you want the system to match the *current* site
  exactly instead, say so and I'll dial it back.
