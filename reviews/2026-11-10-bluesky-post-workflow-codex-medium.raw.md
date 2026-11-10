**0 BLOCKER, 2 MATERIAL. Fix both MATERIAL findings before live use.** No files edited, credentials accessed, or posts sent.

- **MATERIAL — [scripts/post-to-bluesky.mjs:88](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:88): retries can publish duplicates.** `createRecord` has no stable `rkey` or reconciliation check. If Bluesky saves the post but the response is lost, rerunning the failed job publishes it again. Rerunning a successful job also duplicates it; concurrency only serializes attempts. Use a stable record identity per approved operation and check for an existing record after ambiguous failures. The API supports an explicit [`rkey`](https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/com/atproto/repo/createRecord.json).

- **MATERIAL — [scripts/post-to-bluesky.mjs:40](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:40), [line 47](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:47): link parsing can change the approved destination.** Reproduced:
  - `https://example.community/path` → `https://example.com`
  - `https://example.org?bill=51` → `https://example.org`
  - `HTTPS://example.org/path` → `https://HTTPS://EXAMPLE.ORG/path` in equivalent uppercase input
  - `.edu`, `.vote`, and `.co.uk` links are missed; email domains become website links.

  Require complete hostname boundaries, preserve queries/fragments, and handle schemes case-insensitively. `D.C.` and `H.R. 51` correctly produce no links.

- **NOTE — [.github/workflows/post-to-bluesky.yml:25](/Users/andriathomas/Projects/representdc-main/.github/workflows/post-to-bluesky.yml:25): pending posts can be displaced.** With A running, B pending, and C dispatched, GitHub cancels B—even if C is a dry run. `cancel-in-progress: false` protects the active run from concurrency cancellation, not pending runs, manual cancellation, or timeout. `withhold.yml:22` already documents this limitation. Consider explicit queuing if every approved dispatch must survive. [GitHub concurrency documentation](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency).

- **NOTE — [scripts/post-to-bluesky.mjs:23](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:23): the script defaults to live posting.** The workflow correctly defaults `dry_run` to true, but direct execution with missing or misspelled `DRY_RUN` takes the live path.

- **NOTE — [scripts/post-to-bluesky.mjs:60](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:60): dry-run text is public.** Draft text appears in public workflow logs even when nothing reaches Bluesky. [GitHub log-access documentation](https://docs.github.com/en/rest/actions/workflow-jobs#download-job-logs-for-a-workflow-run).

The remaining checks passed or have these limits:

- **Injection:** environment-bound input and the fixed `node` command prevent shell execution and recursive GitHub-expression evaluation.
- **Secrets:** no password or JWT logging found. Raw API errors are printed at line 81; the claim that errors *never* contain passwords is stronger than established evidence, but no concrete credential leak was demonstrated.
- **Dispatch/forks:** public readers cannot dispatch the upstream workflow; repository writers can. Forks do not inherit its secret. Approval by Andria remains an operational rule, consistent with `withhold.yml`’s manual path. [Dispatch permissions](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow), [secret handling](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets).
- **AT Protocol:** session creation, authenticated record creation using `session.did`, and the pre-post handle check are appropriate. `bsky.social` forwards requests for Bluesky-hosted accounts, including custom-domain handles. Independently hosted/migrated accounts require their actual PDS; this account’s hosting was not verified. [Bluesky Entryway documentation](https://bsky.network/docs/entryway/).
- **Unicode:** UTF-8 facet offsets and the 300-grapheme check passed focused tests. The separate server byte limit is not checked, so unusually large combining sequences can pass dry-run and fail publication.

Validation used syntax checking and in-memory mocked execution, including response-loss/retry, Unicode offsets, length boundaries, and wrong-account rejection.