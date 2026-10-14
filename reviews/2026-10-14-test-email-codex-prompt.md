Read-only review of commit 4261055 in representdc-main (`git show 4261055`): a manual `test_email` input on .github/workflows/fetch-news.yml that sends one test alert via a new `test-email` job and skips the `fetch` job.

Check: (1) scheduled runs and manual runs without test_email still run `fetch` exactly as before (note github.event.inputs is null on schedule; also consider dry_run + test_email both ticked); (2) the test job really exercises the same email path as incident alerts (action, version, server, secrets, from/to), so a delivered test proves real alerts can deliver; (3) permissions, concurrency-group interaction with publishing runs, and anything that could open/close incidents or publish; (4) any injection or secret-exposure risk in the body/subject.

Only report BLOCKER or MATERIAL findings with file:line, failure scenario and fix; NOTEs only if one line each. "No material findings" is a valid answer. Be concise.
