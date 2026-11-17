Reviewed `eda2673` and the adjacent tracker/candidate worktrees. **0 BLOCKER, 2 MATERIAL.** No files changed.

- **MATERIAL — Search queries can reach analytics.** `tracker-74/index.html:35` and `tracker-74/src/lib/analytics.js:37`: opening `/?search=<text>` leaves that text in the address. With PostHog enabled, subsequent category clicks or bill events include its default `$current_url`, despite the stated policy against tracking searches. Disabling pageviews does not prevent this. **Fix:** sanitize query strings from URL properties with `before_send`, including initial/referrer URL properties. [PostHog documentation](https://posthog.com/docs/privacy/data-collection)

- **MATERIAL — Main-site navigation has insufficient room at 320px.** `src/components/Nav.css:176`, together with `src/App.css:884`: the container leaves 272px for the brand, red CTA, 44px menu button, and gap. Their minimum widths exceed that budget. Unlike the siblings, the main site has no rule hiding the bar CTA below 359px. **Fix:** adopt that sibling rule, retaining the red CTA inside the panel. This is a pre-existing issue identified through CSS inspection; browser confirmation was sandbox-blocked.

- **NOTE — Clearing filters leaves a stale address.** `tracker-74/src/App.jsx:224`: clearing resets React state but preserves `?category=…&search=…`. Reloading restores cleared filters, and copying the address shares them. **Fix:** remove these parameters with `history.replaceState` when clearing, preserving unrelated parameters and the hash.

- **NOTE — Existing category copy misses the requested conventions.** `src/data/categoryDetails.js:13`, `:17`, and subsequent entries retain title case and unpunctuated “DC” in body copy. **Fix:** use sentence-case titles and “D.C.” in prose. The menu labels meet the requested conventions; no new reader-facing em-dashes were introduced.

The nine destinations and their order match across all three menus, and the main-site routes exist. All seven category queries resolve correctly; unknown categories are ignored and legacy aliases work. Search uses React input values and literal string matching, with no identified XSS or injection path.

Static inspection found sound toggle, Escape, outside-click, focus-exit, open-panel resize, `hidden`, and ARIA handling. Non-interactive current-page spans appropriately stay outside the Tab order while remaining available to screen readers. CSS and JavaScript both use the 1160px desktop threshold.

ESLint and in-memory Vite production compilation passed. All 28 non-race tests passed. Race tests and Playwright launch were blocked by temporary-file permissions. Rendered checks at **320, 375, 768, 1024, 1160, and 1280px**, full prerendering, and deployment remain unverified.

**Verdict: Fix the analytics exposure and 320px navigation fit before release.**