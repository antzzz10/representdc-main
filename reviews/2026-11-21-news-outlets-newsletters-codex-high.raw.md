- **MATERIAL — A malformed newsletter array can take down the page.** [NewsList.jsx](src/components/NewsList.jsx:17) assumes every array element is an object. For example, `newsletters: [null]` passes the section’s array check and throws while reading `item.link`, preventing the news page from rendering. Filter and validate entries before rendering, and test malformed *elements* as well as malformed field values.

- **NOTE — The safety check accepts invalid HTTPS links.** [newsletters.mjs](scripts/news/newsletters.mjs:40) relies on `archivable`, which checks only the `https://` prefix. An item with link `https://` passes selection and is published as a broken link. Parse the URL and require a valid HTTPS URL with a hostname before including it.

- **NOTE — Deduplication can discard a valid item before safety checks.** [feeds.mjs](scripts/news/feeds.mjs:244) keeps the first item for a link before newsletter validation. If a future-dated item precedes a valid item with the same link, the first is later dropped and the valid one has already been discarded. Validate first, then deduplicate, and cover that ordering in a test.

- **NOTE — The separation test does not exercise the pipeline it claims to protect.** [newsletters.test.mjs](scripts/eval/newsletters.test.mjs:172) checks source-code strings and constructs its own news-only run; it would not establish that actual model calls and publication receive no newsletter text after a wiring regression. Add an offline integration test with stubbed feeds, model calls and publisher that captures their inputs, including a retry and withholding interleaving.

The inspected main path separates newsletter candidates from news candidates, and G5 excludes newsletter results. The targeted tests were not run because they write test artifacts and this review was restricted to read-only access; the invalid-link and duplicate-order cases were reproduced with offline, in-memory checks.

DO NOT SHIP on code correctness.