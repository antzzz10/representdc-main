**0 new BLOCKER; 2 new MATERIAL issues.** Reviewed the staged snapshot; no unstaged differences or file modifications. Tracker findings excluded. M/H below identify the prior medium/high reviews.

Prior archive findings:

- **FIXED — Monthly unchanged-record preservation (M1).** `scripts/ingest.mjs:57–65` writes raw XML before the identical-content return. Raw files are committed; monthly tar/release dependence is removed (`.github/workflows/update.yml:50`).
- **FIXED — Superseded raw versions (H1/M2).** `scripts/ingest.mjs:58–63` keeps distinct checksum-named versions; `.gitignore:1–2` permits their retention and workflow line 50 stages them.
- **FIXED — Parser/checkpoint updates (H2/M3).** `scripts/ingest.mjs:40,67–78` refreshes normalization on parser-version changes and saves changed sitemap checkpoints despite identical XML. Reproduced both cases.
- **PARTLY — Missing-record publication policy (H3).** `scripts/ingest.mjs:46–51` and `README.md:39` explicitly permit missing new records and flag retained stale records. However, the workflow can discard those warnings; see below.
- **FIXED — Coarse, undocumented status (H4).** `scripts/export.mjs:21–34,68–72` adds committee reporting, separate milestones and resolution-aware outcomes. `README.md:37` identifies the derivation and identical-text limitation.
- **FIXED by narrowing scope — Text/vote preservation (H5).** `README.md:41–44` explicitly excludes stored bill text, member-level votes, amendments and verified rider outcomes.
- **FIXED — Removed measures stop receiving updates (M4).** `scripts/build-manifest.mjs:47–50` retains previous identities for subsequent ingestion. Its inclusion flag has a new defect below.
- **FIXED — Rider/parent conflation (H8/M5).** `scripts/export.mjs:113–117` separates parent facts and excludes riders from status comparisons; `README.md:44` states the limitation.

New **MATERIAL** issues:

1. **Commit condition discards meaningful outputs.** `.github/workflows/update.yml:53–55` checks only bills, raw, manifest and labels. An existing record’s 404 can change only `reports/last-ingest.json`, so its stale warning never reaches the repository. Export-only status corrections or family-output changes can likewise be discarded. Include meaningful report/export/site changes while excluding volatile timestamps.

2. **Removed measures remain marked currently tracked.** `scripts/build-manifest.mjs:49` preserves historical `tracker:*` reasons; line 52 interprets any non-`retained` reason as current. A mocked removal reproduced `currentlyTracked: true`. Family-only measures also receive that flag. This contradicts `README.md:40`; derive current tracker membership from today’s tracker entries.

Smaller prior notes: CSV carriage-return escaping and premature integration claims are fixed (`scripts/export.mjs:62`; `README.md:5,16`). Unpinned methodology and legacy-summary parsing remain (`scripts/export.mjs:56`; `scripts/lib.mjs:116`).

All 142 saved raw files reproduced their normalized records/checksums; in-memory export verification reproduced CSV/site outputs.