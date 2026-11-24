1. **PARTIALLY FIXED** — [gates.mjs:57](scripts/news/gates.mjs:57) rejects nonempty username or password components. The hand-link checks and host display are at [hand-link.mjs:70](scripts/news/hand-link.mjs:70) and [add-link.mjs:84](scripts/news/add-link.mjs:84). Leading or trailing whitespace and control characters are trimmed before checking, so they are accepted rather than refused.

2. **PARTIALLY FIXED** — [hand-link.mjs:148](scripts/news/hand-link.mjs:148) refuses missing or malformed article lists and several malformed article fields before rebuilding. It does not validate the entire feed: for example, it accepts malformed newsletter entries.

3. **PARTIALLY FIXED** — [publish.mjs:299](scripts/news/publish.mjs:299) bounds both stages and the overall deadline, but gives the body read a fresh budget. Headers taking 14 seconds and a body taking another 14 can make one request take 28 seconds, rather than the stated 15. The saved-but-not-live outcome is reported with exit 1 at [add-link.mjs:115](scripts/news/add-link.mjs:115).

4. **CONFIRMED FIXED** — [hand-link.mjs:50](scripts/news/hand-link.mjs:50) decodes entities before checking the decoded text for controls.

5. **CONFIRMED FIXED** — [hand-link.mjs:120](scripts/news/hand-link.mjs:120) rejects dates after the current UTC calendar day and preserves the accepted UTC day when choosing the stored instant.

6. **CONFIRMED FIXED** — [add-link.test.mjs:698](scripts/eval/add-link.test.mjs:698) asserts that the judge prompt contains the hand-added headline.

**New MATERIAL defect:** [gates.mjs:57](scripts/news/gates.mjs:57) changes validation of existing archive entries as well as new links. An archive item or pending entry such as `https://user@example.org/story` was valid under the previous check but now makes [archive.mjs:57](scripts/news/archive.mjs:57) reject the entire archive. The scheduled scan then stops at [fetch-news.mjs:155](scripts/fetch-news.mjs:155) on every run, even if that item is old and no longer displayed. Preserve compatibility when reading existing archive entries, while rejecting userinfo for newly ingested links, or provide a verified migration before enforcing the stricter rule. The live archive was unavailable in this checkout, so its actual contents could not be checked without network access.

The new `assertFeedShape` is called only on the manual-link path, so it does not itself stop scheduled scans. The live check keeps the scan’s run-ID match; its timeout changes polling behavior, but I found no new false-live result. The workflow passes typed inputs through environment variables and shares `news-publish` with scheduled scans. `DRY_RUN` prevents a feed or archive push, but does write a temporary checkout and the workflow summary.

DO NOT SHIP on code correctness.