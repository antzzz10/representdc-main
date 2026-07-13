# Handoff: RepresentDC brand mark, style guide, myth-busting games & billtracker token remap

## Overview
Four pieces of design work from a Claude Design session, meant for two targets:
1. **representdc-main** — a new logo/wordmark, a brand style guide, and three myth-busting games added to the Myths & FAQ page (plus a homepage teaser).
2. **dc-bills-tracker** — a full audit of the repo's existing hardcoded colors, mapped 1:1 to design-system tokens (no visual redesign — a token remap of the existing UI).

## About the design files
The `.dc.html` files in this bundle are **design references built in a prototyping tool**, not production code — they use a custom runtime (`support.js`) that only exists in that tool. **Do not copy their markup/JS directly into the React apps.** Open them in a browser to see the intended look and behavior, then recreate the same visuals using each repo's real stack (React + Vite, existing component patterns, real CSS files). Every color, font, and measurement below is exact — recreate from these specs, not by eyeballing the screenshots.

## Fidelity
**High-fidelity.** Final colors, typography, and spacing throughout. Recreate pixel-close using each repo's existing component patterns.

---

## 1. Logo & brand mark — for representdc-main

See `logo-style-guide.dc.html` for the full visual reference. Full spec:

**The mark:** a five-pointed star (outer radius 22, inner radius 9, on a 64×64 grid), centered at (32,32). One point (upper-left) is rendered differently from the other four — that's the whole idea (see Meaning, below).

Full star path (all 10 vertices): `M32,10 L37.29,24.72 L52.92,25.20 L40.56,34.78 L44.93,49.80 L32,41 L19.07,49.80 L23.44,34.78 L11.08,25.20 L26.71,24.72 Z`

For the standard build: fill this whole path navy (`#14213D`), then draw a second path just for the accent point on top: `M23.44,34.78 L11.08,25.20 L26.71,24.72 Z`, filled with a diagonal hatch pattern (4×4px tile, lines rotated 45°) — red (`#C8102E` bg / white lines) on light backgrounds, gold (`#E0A500` bg / navy lines) on navy backgrounds.

At favicon scale (≤24px) the hatch is dropped for a flat accent-colored fill — same two paths, no pattern.

**Favicon/app-icon tile:** rounded square, corner radius ≈23% of width (e.g. 15px on a 64px tile), navy fill, mark inset ~14%.

**Wordmark:** "RepresentDC" — always one word, never "Represent DC" with a space in the logo. Public Sans, weight 800, letter-spacing -0.03em. "DC" is the same size/weight as "Represent," just colored with the accent (red on light, gold on navy) and given a thin underline (`border-bottom: 0.16em solid currentColor`) — no boxed badge; a box reads as two words.

**Color combinations (only these three):**
- Full color on white/paper: navy `#14213D` mark + red `#C8102E` accent.
- Reversed on navy: white mark + gold `#E0A500` accent (gold, not red, so it never competes with the urgent-alert red used elsewhere on navy).
- Single-ink monochrome (letterhead/print): all navy `#14213D`, hatch becomes knockout white lines (still one ink).

**Clear space:** minimum margin on all sides ≈¼ of the mark's width (one star point's width). **Minimum size:** 16px standalone favicon, 20px mark height paired with wordmark, 0.25in/18pt for print.

**Meaning (ready to paste into the site's FAQ as-is):**
> The mark is a five-pointed star with one point set apart in texture and color. It represents D.C.'s incomplete standing in American democracy — one piece of full representation still missing, still being worked on, rather than a finished, static symbol. That "different point" is built from a diagonal hatch pattern, not just a different color, so the idea comes through for colorblind visitors and in black-and-white print alike. We chose an original mark instead of the District's well-known three-stars-and-two-bars flag on purpose — that flag is already the logo of nearly every D.C. statehood group, and we wanted RepresentDC to be identifiable at a glance among them while still speaking the same visual language.

**Don't:** fill every point solid (loses the accessible signal), rotate/skew the star, add drop shadows/bevels/gradients to the mark.

Full context (header/hero/favicon/letterhead/footer mockups, do/don't examples) is in `logo-style-guide.dc.html`.

---

## 2. Myth-busting games — for representdc-main's Myths & FAQ page

Added a "Myth-busting games" section (`id="games"`) at the bottom of the Myths & FAQ page, plus a teaser card on the homepage linking to it (`#games`). Three tabbed rounds, all client-side, no backend:

- **Trivia** — 6 multiple-choice questions pulled directly from the existing myths content (population, tax rate, congressional override, statehood referendum, etc.)
- **Spot the 51-star flag** — 3 rounds, each showing 3 star-field cards (rendered as CSS dot grids, star counts 48–53) with one correct 51-star card per round.
- **Match the quote to the person/party** — 4 quotes (Nixon, Frederick Douglass, and two party-platform lines), each with 3 multiple-choice attributions, sourced to research on Republicans who have historically supported D.C. statehood.

All three follow the same pattern: progress indicator, answer feedback with a one-line fact, "next" button, end screen with score + replay. See `myths-and-faq-with-games.dc.html` for full copy and exact markup/CSS; recreate as React components using the repo's existing card/button patterns.

---

## 3. Color token remap — for dc-bills-tracker

**No new visual design was needed here.** `colors_and_type.css` already defined tokens for every status the tracker actually uses; this was a straight remap of hardcoded hex values to those tokens. Full remap table, confirmed semantics (read directly from the repo's own `DEVELOPMENT-GUIDELINES.md` and `.claude/CLAUDE.md`), and the reasoning behind each swap are in `billtracker-token-handoff.dc.html`. Key points:

| Old hardcoded value | Meaning | New token |
|---|---|---|
| `#DC143C` (priority-high border) | genuine active threat | `--prio-high` (`#C8102E`) |
| `#FF8C00` (priority-medium / rider border) | active, not critical | `--prio-medium` (`#B45309`) |
| `#ccc` (priority-low/watching border) | dormant | `--prio-low` (`#94A3B0`) |
| `#dc3545`/`#ffc107`/`#adb5bd` (RecentActivity priority) | same 3 tiers | same 3 tokens above |
| orange gradient + pulse (floor-vote badge) | act now | flat `--dc-red`, reuse the existing pulsing-dot pattern from `.hero-badge`/`.alert-eb` instead of a gradient |
| `#b71c1c` (deep-linked ring) | "you followed a link here," not severity | `--navy` (keeps red exclusive to urgency) |
| `#dc3545`/`#0066cc`/`#6c757d` (sponsor party badges) | neutral party data | `--party-r` `#B23A48` / `--party-d` `#1D4ED8` / `--party-i` `#64748B` |
| `#DC143C` (category badge, all categories) | neutral label | `--navy` (frees red to mean "urgent" exclusively) |
| `#343a40` + bootstrap grays (Recent Activity header/chrome) | section chrome | `--navy` (header), `--paper`/`--line` (chrome) |
| *(new)* "Disputed by DC" tag | caveat, not severity | `.tag.disputed` — white bg, dashed slate border (same "texture, not just color" device as the logo mark) |
| *(new, unused)* passed-senate tag | procedural stage | `--status-senate` (`#6D28D9`) — token already existed, just wasn't wired up |

**New tokens added** (staged now for the upcoming `dc-statehood-pledge` site, so both repos' token copies stay in sync):
- `--support-green: #2E6F4F`, `--support-green-dark: #24573F`, `--support-green-tint: #E7F0EA` — for an explicit "supports statehood" signal only, never a general success state.
- "Undeliverable / no contact" (pledge site) intentionally got **no new token** — it's an absence of signal, so it reuses `--slate-400` text on `--surface-2`.

These are already added to `colors_and_type.css` in `_ds/representdc-design-system-d750a15b-e517-4f7c-8d38-9339e64bd1a8/` in this bundle — copy that file's additions into both repos' local token copies.

**Files to touch in dc-bills-tracker:** `src/components/BillCard.css`, `src/components/RecentActivity.css`, and wherever `PassedBillsSection` status tags are styled.

---

## Design tokens (quick reference)
- Navy `#14213D` (workhorse), red `#C8102E` (urgency/CTA/high-priority only), gold `#E0A500` (dark-surface accent), paper `#F6F7F9` (background).
- Priority: high `#C8102E`, medium `#B45309`, low `#94A3B0`.
- Status: house `#1D4ED8`, senate `#6D28D9`, both `#B45309`, enacted `#7A0A1C`.
- Party: R `#B23A48`, D `#1D4ED8`, I `#64748B`.
- Support (new): `#2E6F4F` / `#24573F` / `#E7F0EA`.
- Fonts: Public Sans (UI/headings), Source Serif 4 italic (editorial pull-quotes only), IBM Plex Mono (all data/numbers).
- Full token list: `_ds/representdc-design-system-d750a15b-e517-4f7c-8d38-9339e64bd1a8/colors_and_type.css`.

## Assets
No photographic or external image assets — the logo is pure SVG (paths above), and the star-field graphics in the flag game are CSS dot grids, not images.

## Files in this bundle
- `logo-style-guide.dc.html` — full brand mark + wordmark spec, color/contrast, clear space, usage mockups, do/don't. Open in a browser.
- `billtracker-token-handoff.dc.html` — confirmed semantics, full remap table, decisions log. Open in a browser.
- `myths-and-faq-with-games.dc.html` — the Myths & FAQ page with the three games section, for exact copy/markup reference.
- `homepage.dc.html` — includes the games teaser card.
- `kit.css`, `support.js`, `_ds/` — supporting files so the `.dc.html` references render correctly in a browser; not needed by the target repos.
