A. **CONFIRMED FIXED.** A missing archive is refused without bootstrap, and a marker prevents bootstrap even when the flag is set. An existing archive is returned rather than replaced. See [publish.mjs](scripts/news/publish.mjs:122). The workflow derives the flag from the manual input for that step; a schedule has no such input, and the value is not persisted to later runs. See [fetch-news.yml](.github/workflows/fetch-news.yml:20) and [line 69](.github/workflows/fetch-news.yml:69).

B. **CONFIRMED FIXED** for the stated fewer-items case. The count check is used on the initial read and on every push attempt. See [publish.mjs:138](scripts/news/publish.mjs:138), [line 169](scripts/news/publish.mjs:169), and [line 203](scripts/news/publish.mjs:203). The remaining identity gap is below.

C. **CONFIRMED FIXED.** A present marker must have exactly the required fields and values; a non-archive writer carries the existing marker forward and cannot invent one. See [archive.mjs:197](scripts/news/archive.mjs:197) and [publish.mjs:230](scripts/news/publish.mjs:230).

**New MATERIAL finding — equal-size replacement can hide lost confirmed items.** The marker records only a count ([archive.mjs:188](scripts/news/archive.mjs:188)), and the first read rejects only a lower count ([publish.mjs:138](scripts/news/publish.mjs:138)). If a mistaken restore or edit replaces a confirmed item while retaining the same or a larger count before a run starts, that run accepts the altered archive as its baseline and subsequent writes preserve the loss. Store and validate an identity-sensitive digest or equivalent independent record of the confirmed items, with a recovery path for mismatches.

I found no weakening of the judge-pass boundary, withholding precedence, or `verifyLive`, and no other new blocker or material defect in the reviewed paths. This was a read-only, offline review; I did not run tests.

**DO NOT SHIP**