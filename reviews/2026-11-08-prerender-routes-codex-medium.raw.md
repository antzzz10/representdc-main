**0 BLOCKER / 0 MATERIAL findings.** The fix covers every current extensionless route. Four NOTEs:

- **NOTE — Explicit `.html` URLs render incorrectly.** [Main script:61](/Users/andriathomas/Projects/representdc-main/scripts/prerender-routes.mjs:61), [candidate script:47](/Users/andriathomas/Projects/dc-statehood-pledge/scripts/prerender-routes.mjs:47): the generated files are directly accessible, but installed React Router matchers reject `/news.html`, `/party.html`, and `/2026/primary.html`. Article `.html` URLs include the suffix in `slug`, triggering a redirect to `/news`. Internal links and sitemaps use extensionless URLs, so the intended paths work. Consider normalizing explicit `.html` requests.

- **NOTE — Trailing-slash requests retain the original 404 behavior.** Same locations: `/news/`, `/reading/`, and `/2026/primary/` lack corresponding index files. React Router accepts trailing slashes after the fallback restores the URL, but the initial response remains 404. Confirmed this hosting behavior against a live GitHub Pages fixture. This is an existing limitation, not a regression.

- **NOTE — Route discovery can silently miss valid future JSX.** [Main:42](/Users/andriathomas/Projects/representdc-main/scripts/prerender-routes.mjs:42), [candidate:34](/Users/andriathomas/Projects/dc-statehood-pledge/scripts/prerender-routes.mjs:34): multiline whitespace works, and every current route is captured. Single quotes, reordered props, intervening props, expression-valued paths, nested relative routes, and additional parameterized routes are unsupported. The nonempty-pages check will not detect individual omissions.

- **NOTE — `lastmod` represents build time rather than content changes.** [Main:67](/Users/andriathomas/Projects/representdc-main/scripts/prerender-routes.mjs:67), [candidate:52](/Users/andriathomas/Projects/dc-statehood-pledge/scripts/prerender-routes.mjs:52): every rebuild marks every page changed. Use meaningful modification dates or omit this optional field. [Google guidance](https://developers.google.com/search/blog/2014/10/best-practices-for-xml-sitemaps-rssatom).

Other requested checks passed:

- Pages gives `reading.html` precedence over the adjacent `reading/` directory for `/reading`; nested `.html` files support extensionless paths. Confirmed precedence against a live [Pages fixture](https://github.com/simonw/playing-with-github-pages).
- Both restore scripts are inert on fresh direct loads without `redirectPath`. A stale stored value can override a direct load, but that behavior predates this change.
- Sitemaps contain valid absolute URLs, match their CNAME hosts, and exclude `Navigate` redirects. Robots files are valid. The apex currently redirects to `www`, preserving the path.
- `/myths-and-faq` already redirects to `/myths`; it is excluded from the sitemap. No new duplicate-content defect found, though neither site supplies canonical tags.
- Main deployment preserves `api/news.json`, rejects a build containing it, replaces generated route files, and copies `.nojekyll`. Removal does not include dotfiles; that existing behavior causes no conflict here.
- Neither repo’s workflows build or deploy the SPA. Candidate predeploy intentionally rejects the current dirty tree; after committing the intended changes, ignored `dist/` output will not break that check.

No files modified; no builds or deployments run. Reviewed existing artifacts and ran read-only syntax and route-matcher checks.