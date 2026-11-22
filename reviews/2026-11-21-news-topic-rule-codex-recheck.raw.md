1. **CONFIRMED FIXED** — The five specified headlines pass through the expanded lexicon and normalization. The examples are fixtures at [relevance-rules.test.mjs:79](scripts/eval/relevance-rules.test.mjs:79); matching is implemented at [relevance-rules.mjs:44](scripts/news/relevance-rules.mjs:44) and [relevance-rules.mjs:132](scripts/news/relevance-rules.mjs:132).

2. **CONFIRMED FIXED** — Blocked stored pending headlines are removed before verdicts are applied; a changed headline starts again at one yes. See [archive.mjs:261](scripts/news/archive.mjs:261) and [archive.mjs:285](scripts/news/archive.mjs:285).

3. **CONFIRMED FIXED** — The exemption comes from feed configuration and overwrites any item-supplied field. Published articles and newly created archive entries use named fields, excluding the flag. See [feeds.mjs:261](scripts/news/feeds.mjs:261), [relevance-rules.mjs:166](scripts/news/relevance-rules.mjs:166), and [archive.mjs:291](scripts/news/archive.mjs:291).

4. **CONFIRMED FIXED** — Unasked model verdicts are null with a reason, and unusable filter replies produce null counts. See [fetch-news.mjs:239](scripts/fetch-news.mjs:239).

5. **CONFIRMED FIXED** — The main-path test has a third run that checks an already-confirmed article is omitted from the filter and recorded as unasked. See [main-path.test.mjs:268](scripts/eval/main-path.test.mjs:268).

**New MATERIAL defect — normalization makes a common off-topic phrase pass.** At [relevance-rules.mjs:58](scripts/news/relevance-rules.mjs:58) and [relevance-rules.mjs:136](scripts/news/relevance-rules.mjs:136), “D.C. law enforcement arrests burglary suspect” becomes “DC law enforcement arrests burglary suspect” and matches `dc law`. Without normalization, that headline does not match the lexicon. If the model mistakenly says yes, this common kind of local crime headline passes the intended second check and can be confirmed permanently. Refine the `dc law` match to exclude “law enforcement,” and add that case as a regression test.

The pending changes do not remove or rewrite confirmed items: they operate on `pending`, while confirmed items are copied and checked by link and content. The marker counts confirmed items only. On a push retry, the rules are reapplied to the fresh archive, and a changed displayed article set causes the summary to be withheld; I found no new defect in that composition. See [archive.mjs:263](scripts/news/archive.mjs:263), [archive.mjs:356](scripts/news/archive.mjs:356), and [archive.mjs:385](scripts/news/archive.mjs:385).

I could not run the focused test file because this checkout lacks `@anthropic-ai/sdk`; the assessment above is based on code inspection and a direct check of the lexicon example.

**DO NOT SHIP**