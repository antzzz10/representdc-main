<!-- codex exec -s read-only, model_reasoning_effort=high, diff 0d25259..1bbc2c7, run 2026-11-11. Prompt: standard review. Final message only. -->

**0 BLOCKER / 0 MATERIAL / 4 NOTE. No material findings.**

- **NOTE — `src/components/Nav.jsx:35–36`: navigation does not permanently close the menu.** Same-page navigation hides it by comparing location keys but retains the opening key; Back can reopen it. Native hash navigation can preserve the key and leave it open throughout. Reproduced in DOM tests. **Fix:** clear the opening state whenever the location changes, including its hash.

- **NOTE — `scripts/prerender-routes.mjs:114`: metadata validation misses unsupported parameterized routes.** An in-memory addition of `/new/:id` without metadata still completed successfully because parameterized routes are skipped before validation. Current routes are covered. **Fix:** reject parameterized routes unless they have an explicit expansion strategy, as `/reading/:slug` does.

- **NOTE — `src/data/routeMeta.js:69–70`: metadata matching differs from router matching.** React Router matches `/NEWS` to the news page, but `metaForPath('/NEWS')` returns homepage metadata. **Fix:** normalize casing or enforce canonical path casing.

- **NOTE — `src/components/Nav.css:69–70`: new styles violate the token rule.** Focus outlines and offsets use raw `2px`; additional new borders and visually hidden styles use raw pixel values. **Fix:** define and reference shared tokens for these measurements.

Lint, whitespace checks, an in-memory Vite compilation, and prerender checks passed. Every current generated route received one title and description; removing an existing entry correctly failed validation.

Visual fit and layout shift remain unverified: Playwright could not create its temporary directory under the read-only sandbox. No files were changed.