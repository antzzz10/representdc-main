**BLOCKER: 0. MATERIAL: 0.**

- **NOTE — `src/Home.jsx:141–143`; `src/HowCongressControlsDC.jsx:169–172`:** In the singular state, “1 threat …: bills, resolutions and budget riders” is slightly awkward because the category list stays plural. This predates the commit; the new “overriding … or limiting” construction is grammatically parallel.

Verified:

- Rendered both components in memory for **0, 1, 74, loading, error, and missing progress data**. Spacing, punctuation, count agreement, and unavailable-stat fallbacks work.
- No active definition retains the old phrase. Remaining references are historical review records.
- No test or build/CI gate depends on the old words. All **6 bill-progress tests** and **ESLint** passed.
- At both changed locations, “aimed at” describes purpose without implying pending status. It accommodates proposed and enacted bills, disapproval resolutions, and restrictive budget riders. These mechanisms are documented by [Congressional Research Service](https://www.congress.gov/crs_external_products/R/PDF/R47927/R47927.1.pdf).
- Reviewed `bd2fff4`; no files modified. Working tree remained clean.

**Verdict: PASS — the wording change is accurate and introduces no material issue.**