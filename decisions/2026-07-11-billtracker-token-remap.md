# Decision: dc-bills-tracker color/token remap (Phase 3)

**Date:** 2026-07-11
**Context:** Phase 3 of `WHATS-NEXT.md` — applying the design system to
dc-bills-tracker. Fully spec'd by the 2026-07-10 handoff
(`reference/brand/handoff-2026-07-10/billtracker-token-handoff.dc.html`), which read
confirmed color semantics directly from that repo's own `DEVELOPMENT-GUIDELINES.md`,
`.claude/CLAUDE.md`, and component CSS before proposing any remap — no visual redesign,
color/token remap only.

## What changed

- Added `src/styles/tokens.css` to dc-bills-tracker (same token set as
  representdc-main's copy — no shared package yet, per the earlier decision to keep
  copies in sync manually). Fonts are **not** loaded in this repo yet — this pass is
  color-only, `--font-*` tokens are inert until a future pass adopts them here.
- `BillCard.css` / `BillCard.jsx`: full remap per the confirmed table — priority
  borders → `--prio-high/medium/low`; deep-linked highlight → `--navy` (wayfinding, not
  severity, per the confirmed semantics — keeps red exclusive to genuine urgency);
  category badge → `--navy` (neutral label); sponsor party badges → `--party-r/d/i`;
  floor-vote badge → flat `--dc-red` with a small pulsing dot (matching the
  `.hero-badge` pattern from representdc-main) instead of the old orange gradient +
  box-shadow pulse.
- `RecentActivity.css`: header/chrome → navy/paper/line; activity-priority tiers →
  the same three priority tokens.
- `PassedBillsSection.css`: the "passed a chamber" header changed from a red gradient
  to flat navy — passing one chamber is procedural progress, independent of
  priority/severity per the confirmed semantics table, so it doesn't need the accent
  red. The **enacted** section (signed into law, the gravest and most final stage)
  keeps a strong red (`--status-enacted`), now flat instead of a gradient. Status tags
  (`passed-house/senate/both`) tokenized to `--status-*`. The "Disputed by DC" tag
  restyled from a solid amber fill to a white background with a dashed slate
  border — the same "texture, not just color" accessible device used on the logo mark,
  since a caveat isn't a severity level.
- `index.css`: page background → `--paper`.

## Left alone (per handoff's own flagged conflicts)

- Uncommitted pre-existing changes to `package.json`/`package-lock.json`/
  `scripts/weekly-digest.js` and the untracked `CLAUDE.md` — none design-related.
- The pre-existing lint baseline (~50 errors, mostly `process is not defined` in
  Node scripts and pre-existing unused vars) — confirmed via `git diff` that none of
  it touches the files this pass modified; not this pass's job to clean up.
- Fonts (Public Sans etc.) — out of scope, this was a color remap only.

## Next step
Phase 3 of `WHATS-NEXT.md` is complete. Phase 4 (News & Ways to Help — events sourcing
+ interactive stakeholder map) is next per the roadmap, gated on Phase 2 already being
done. dc-statehood-pledge's own rollout (Phase 6) remains separately gated — no
finalized component spec exists for it yet, only staged tokens.
