**MATERIAL — A deceptive URL can be published as an outlet link.** [hand-link.mjs:69](scripts/news/hand-link.mjs:69) accepts `https://apnews.com@evil.example/a`: the actual host is `evil.example`, but the input visually suggests AP. It is stored permanently and shown under the owner-supplied source. Reject URLs with a username or password, and show the parsed hostname in the preview so the owner can verify the destination. Add a test for userinfo and misleading hosts.

**MATERIAL — Live verification can hang after a successful push.** [publish.mjs:278](scripts/news/publish.mjs:278) awaits `fetch` and then `res.json()` without a per-request deadline. If either stalls, the ten-minute deadline is never checked; the workflow eventually times out without reporting that the archive was already changed. This behavior predates the change, but the new writer depends on it. Abort each request when the remaining deadline expires and test a never-resolving fetch. Keep the scan’s default `runId` matching behavior.

**NOTE — Encoded control characters bypass validation.** [hand-link.mjs:48](scripts/news/hand-link.mjs:48) checks controls before decoding entities. For example, `Hi&#7;there` is accepted and stored with a bell character in the permanent archive and published title. Check the decoded value for controls before whitespace normalization, and test numeric entities in both title and source.

**NOTE — Future calendar dates can be silently changed to today.** [hand-link.mjs:82](scripts/news/hand-link.mjs:82) accepts tomorrow’s date during the last two hours of the UTC day, then clamps it to the current instant. For example, `2026-11-24` at `2026-11-23T23:00Z` is saved as November 23, with an earlier display expiry. Compare calendar days explicitly and reject future days; test the UTC boundary.

No files were modified or network used. The focused validation examples were checked locally; the full test suite was not run.

DO NOT SHIP