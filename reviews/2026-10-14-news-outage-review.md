# Review — news outage fixes (2026-10-14)

**Trigger:** `ANTHROPIC_API_KEY` returned 401 from 2026-10-12 to 2026-10-14; four runs
published nothing. Key replaced by Andria. Codex reviewed the pushed entity fix
(`c402f9e`), two proposed incident-script fixes, and the "dead API → headlines" decision.

**Passes:** one `high` (R2: production automation + design decision), then one focused
`medium` re-check after BLOCKER/MATERIAL corrections, per `REVIEW_POLICY.md` v0.3.
Raw output: `2026-10-14-news-outage-codex-raw.txt`, `2026-10-14-news-outage-recheck-raw.txt`.

| Finding | Severity | Disposition |
|---|---|---|
| Proposed REASON in email/issue could break the `$GITHUB_OUTPUT` heredoc and inject `issue_number`, which was interpolated into shell | BLOCKER (against the proposal, not shipped code) | Accepted — random collision-checked delimiter, REASON flattened/bounded/indented as code, `issue_number` numeric-only and passed via env |
| A dry run closed a live incident | MATERIAL | Accepted — DRY_RUN exits before any `gh` call; guarded on the dispatch input, not the outcome, so failed previews stay neutral too |
| `generation-failure` + failed push alerted as "headlines still publishing" | MATERIAL | Accepted — degraded classification only when OUTCOME is `summary-withheld` |
| Summary of 5-week-old news passes the 72h cutoff | MATERIAL | Accepted — page also hides the summary when the newest article is ≥14 days old |
| …but one fresh article still lets older claims read as "recent" (prompt + judge allow ~2 months) | MATERIAL | **Escalated to Andria** — a prompt/judge change shifts the judge flag rate the 20% ceiling was approved against; needs a re-run of the golden eval |
| `&constructor;` resolves via prototype; lone surrogates | NOTE | Accepted |
| `&amp;` left in link query strings (pre-existing) | NOTE | Accepted — `&amp;` only, decoded in links |
| Cascading decode changes headlines that discuss literal entity syntax | NOTE | Rejected — vanishingly rare on this beat; decoding `&amp;` first deliberately handles double-escaped feeds |
| "Last successful check" is more precise than "Last checked" | NOTE | Rejected — reader-facing copy matches the homepage; during a failure the line understates freshness, the safe direction |
| Check line hidden for empty feeds; validate timestamps; clamp future article dates | NOTE | Accepted |

**Verified:** 25 news tests, lint, build; incident script exercised against dry-run,
injection, generation-failure-with/without-publish cases with a stubbed `gh`; `/news`
rendered via Playwright at 390px and 1280px in quiet, fresh, outage and empty states.
