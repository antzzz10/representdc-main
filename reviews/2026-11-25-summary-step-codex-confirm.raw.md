# Confirming pass (high), after the fixes

**DO NOT SHIP.** The publication race and false recovery issues are fixed, but the scan count can still overcount a rerun and does not measure consecutive flagged scans.

### Earlier findings

- **BLOCKER — Kept summary overwrites a concurrent withholding: CONFIRMED FIXED.** [archive.mjs:416](scripts/news/archive.mjs:416) drops the kept summary if the branch no longer contains exactly that text, on every push attempt. The separate article comparison at [archive.mjs:399](scripts/news/archive.mjs:399) prevents publication beside a different headline list.

- **MATERIAL — Repeated-flag incident closes without a summary returning: CONFIRMED FIXED.** [news-incident.sh:184](.github/scripts/news-incident.sh:184) skips closing that incident unless the outcome is `published`.

- **MATERIAL — Count uses stale state and can reset for a summary that was dropped: PARTIALLY FIXED.** [fetch-news.mjs:508](scripts/fetch-news.mjs:508) now calculates against each push attempt’s current feed and actual composed summary, and [line 540](scripts/fetch-news.mjs:540) reports the written count. But [summary-memory.mjs:137](scripts/news/summary-memory.mjs:137) deliberately preserves it through other outcomes: flagged scan → no-articles scan → flagged scan yields two, so it still is not a count of *consecutive* flagged scans. It now measures flagged scans since a summary last published.

- **MATERIAL — A rerun can count one scan twice: PARTIALLY FIXED.** Immediate reruns are deduplicated, but [summary-memory.mjs:135](scripts/news/summary-memory.mjs:135) remembers only the last scan that added. If flagged run A publishes, flagged run B publishes, and A is rerun and flagged again, the count rises from two to three even though only two workflow runs contributed. It can therefore overstate the incident count.

- **MATERIAL — Judge pass is not bound to its text and articles: PARTIALLY FIXED.** [summary-memory.mjs:96](scripts/news/summary-memory.mjs:96) catches edits that leave the fingerprint unchanged. It is an unkeyed hash, however: a repository writer who changes the summary or articles **and recomputes the hash** can still carry the old pass forward. The code explicitly identifies this limit at [line 35](scripts/news/summary-memory.mjs:35), so it addresses accidental edits, not the earlier attacker-influenced-feed threat model.

### New defects introduced by the fixes

No additional BLOCKER or MATERIAL defects found. In particular, `publishFeed` parses the current JSON before comparison, so JSON formatting whitespace does not change the summary string; an unchanged summary survives an ordinary retry. `REPEATED_TITLE` is initialized before the healthy branch, including under `set -u`.

This was a read-only review; I ran no tests and used no network. The supplied folder is a scratch copy rather than a Git checkout, so Git status and history could not be verified.
# Left as they are, on purpose

- The count is flagged scans since a summary last published, not strictly consecutive scans. That is the number the alert is about, and the code and email now say so.
- A much older run that is run again after a newer flagged scan can add one to the count. By then the one email has already been sent, so only the number in the log is affected.
- The fingerprint is a plain hash. It guards against accidental edits. Anyone who can write the branch can write anything.
