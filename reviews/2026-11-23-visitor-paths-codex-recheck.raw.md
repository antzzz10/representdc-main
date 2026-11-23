1. **CONFIRMED FIXED** — Movement is detected by a scroll-position change greater than 8 px, including a scrollbar drag. [NewsAndAnalysis.jsx:150](src/NewsAndAnalysis.jsx:150)

2. **PARTIALLY FIXED** — Jump state resets on location key or hash changes, but the scroll-restoration setting is not restored when leaving the page. See the material finding below. [NewsAndAnalysis.jsx:137](src/NewsAndAnalysis.jsx:137)

3. **CONFIRMED FIXED** — `ScrollToTop` uses an immediate jump when reduced motion is requested. [ScrollToTop.jsx:15](src/components/ScrollToTop.jsx:15)

4. **CONFIRMED FIXED** — The affected top-level card titles are now h2s; cards beneath a section heading remain h3s. The shared `CategoryCard` is used only on The Case, and its desktop and mobile selectors were updated. [StatehoodCurious.jsx:80](src/StatehoodCurious.jsx:80), [CategoryCard.css:54](src/components/CategoryCard.css:54)

5. **PARTIALLY FIXED** — Both news cards use `NEWS_WAY`, but the same description remains duplicated in route metadata. [StatehoodCurious.jsx:14](src/StatehoodCurious.jsx:14), [routeMeta.js:39](src/data/routeMeta.js:39)

6. **CONFIRMED FIXED** — The unused `.card-badge` rule and its use were removed. [App.css:190](src/App.css:190)

**New MATERIAL defect — scroll restoration carries into later entries.** [NewsAndAnalysis.jsx:145](src/NewsAndAnalysis.jsx:145) sets the current history entry to `manual`, but cleanup only removes the listener. A subsequent same-document navigation can inherit `manual`, leaving the browser unable to restore scroll normally on later Back/Forward traversals, including entries without a hash. Manage restoration across navigation boundaries and restore the prior setting for subsequent entries; account for the existing `ScrollToTop` behavior when testing traversal.

The added scroll listener and existing timers have cleanup. This was a read-only code review; I did not run the browser checks.

**DO NOT SHIP**