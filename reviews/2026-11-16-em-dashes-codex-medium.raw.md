Reviewed all 118 changed lines in `bd2f598`. **0 BLOCKER, 1 MATERIAL, 4 NOTE findings.** No files modified.

- **MATERIAL — `src/data/statehoodPartners.js:52`:** The comma after “shadow Senators” makes “a separate body” appear to describe the senators or another list item, rather than the commission. Restore the separation with a period:
  > Members: the Mayor, the Council Chairman, and D.C.'s two shadow Senators. A separate body from the Shadow Delegation above, though membership overlaps.

- **NOTE — `src/HowCongressControlsDC.jsx:97`:** Adding “and” violates the strict punctuation-only requirement, although it preserves meaning. Use:
  > Skips review entirely; attaches straight to a funding bill

- **NOTE — `src/data/talkingPoints.js:48`:** Consecutive comma-delimited phrases blur the healthcare examples and the restriction. Use:
  > Congress blocks DC from spending its own locally-raised tax dollars on healthcare services (including abortion and end-of-life care), a restriction zero states face, violating the principle of local control.

- **NOTE — `src/data/talkingPoints.js:71`, `:73`, `:81`:** Replacing paired dashes with commas makes the resident descriptions resemble additional list items. Use parentheses around the existing phrases:
  > non-citizen residents (green card holders who pay local taxes) to vote…

  At line 73: “(green card holders who pay DC taxes)”; at line 81: “(permanent residents who pay DC taxes)”.

- **NOTE — `src/data/talkingPoints.js:108`:** The internal list now obscures where the parenthetical ends, briefly making “using a disapproval resolution” appear attached to the stakeholders. Use:
  > In 2023, Congress overturned DC's revised criminal code (16 years of work by local judges, prosecutors, and community stakeholders) using a disapproval resolution.

No changed facts, numbers, names, or dates found. All 14 changed JS/JSX files parsed successfully; in-memory rendering confirmed correct spacing around the changed citations and source links. No remaining in-scope reader-facing em-dashes were found in `src`, `index.html`, or `public`.

**Verdict: Revise the commission description and the noted punctuation before accepting the commit as punctuation-only.**