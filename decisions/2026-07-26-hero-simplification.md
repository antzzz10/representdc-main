# Decision: Hero information-density guardrail, homepage hero simplified

**Date:** 2026-07-26
**Context:** Follow-up to the same-day hero rewrite (`decisions/2026-07-26-hero-rewrite.md`).
The rewritten hero was more welcoming but had stacked five distinct information
blocks: an eyebrow pill ("D.C. statehood, explained"), a two-color headline, a
subtitle sentence, a CTA, and a three-part trailing stat line. Too many things
competing for attention on first paint.

## New guardrail

Added to `DESIGN-GUARDRAILS.md`: hero sections cap at 3 information blocks, in one of
two shapes:
- **Sub-page hero** — eyebrow + h1 + optional one-line subtitle (already the pattern on
  every non-homepage hero; no changes needed there).
- **Landing hero** (homepage only) — h1 + one CTA + one stat/date line, no eyebrow.

**Option considered and rejected:** a single universal template for every hero,
homepage included, which would have meant moving the homepage's CTA and bill count out
of the hero block entirely to match sub-pages exactly. Rejected because the homepage
hero is doing a genuinely different job (primary landing + orientation) than a
sub-page's purely descriptive hero — forcing identical shape would have meant losing
the CTA/stat line's real function, not just simplifying it.

## What changed on the homepage hero

- Removed the "D.C. statehood, explained" eyebrow pill entirely (removed
  `.hero-badge` CSS, now unused).
- Headline's second clause ("Here's what that means for you.") now forced onto its own
  line via `<br />` instead of relying on natural text wrap — previously it could split
  mid-clause depending on viewport width.
- Removed the subtitle sentence entirely (removed `.hero-subtitle` CSS and its mobile
  media-query override, both now unused).
- Trailing stat line simplified from three parts ("{N} bills pending right now ·
  Updated {date} · {N} bills just passed the House") to two: "{N} anti-DC bills pending
  in Congress · Updated {date}" — dropping the "just passed" clause entirely, not
  folding it in elsewhere. Wording matches the "anti-DC bills" phrasing already used in
  the footer's bill-tracker link.
- Bumped `.hero-title`'s bottom margin slightly (`--s-5` → `--s-6`) since the CTA now
  follows the headline directly with no subtitle between them.

## Verification

Playwright screenshots at desktop, tablet (768px), and mobile (390px) widths — headline
splits cleanly at the intended point on all three (mobile: second clause still wraps to
2 lines internally, but starts fresh rather than bleeding from the first sentence).
CTA click confirmed still scrolls to `#picker`. No console errors, lint clean.
