**0 BLOCKER, 3 MATERIAL. Both original fixes improve behavior, but neither is complete. Fix these before live use.**

1. **MATERIAL — Normalized duplicates can still race.** [Workflow line 29](/Users/andriathomas/Projects/representdc-main/.github/workflows/post-to-bluesky.yml:29) groups raw input; [script line 24](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:24) trims and normalizes it. `"Hello"` and `" Hello "` therefore enter different groups but publish identical text. Synchronized mocks produced **two creates**. LF versus CRLF input reproduced the same result. The concurrency identity must use the same normalization as posting and comparison.

2. **MATERIAL — Case-only differences can cancel a distinct pending post.** GitHub’s group names are case-insensitive. With `"Hello"` running, `"HELLO"` pending, and another `"Hello"` dispatched, the third replaces the pending `"HELLO"` run. These are different approved texts under the script’s case-sensitive comparison. The workflow comment claiming different posts never share a group is incorrect. Use a key that preserves case distinctions, such as a digest. [GitHub concurrency rules](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#concurrency).

3. **MATERIAL — The bare-hostname boundary still accepts truncated destinations.** [Script line 61](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:61) correctly excludes ASCII `.evil.invalid` and `:8443`, but reproduced these inputs all becoming `https://billtracker.representdc.org`:
   - `billtracker.representdc.org.рф/path`
   - `billtracker.representdc.org。evil.invalid/path`
   - `billtracker.representdc.org%2Eevil.invalid/path`

   These are hostname continuations, including Unicode and encoded dots. Parse the complete candidate before accepting its hostname; validating the already-truncated prefix cannot catch them.

**NOTE — Text in the group is valid syntax; length support has limits to verification.** GitHub permits string expressions using `inputs`. Quotes, punctuation, and newlines in the resulting value do not become shell commands or new YAML structure. I found **no documented group-name length cap**, so a claimed 256-character restriction would be unsupported. A 300-character ASCII post produces a 319-character live group name; the script validates length only after scheduling. Backend acceptance of long or multiline names was not exercised through a dispatch. A bounded digest avoids this uncertainty. [GitHub syntax documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#concurrency).

**NOTE — A third genuinely identical dispatch replacing the pending second is harmless for the one-post objective.** The running first remains protected, and the third represents the same text and mode. This conclusion assumes no intervening post deletion or eviction from the lookup window. Case-only variants are the separate MATERIAL issue above.

The requested NOTE fixes passed mocks:

- Missing, null, non-array, and invalid-JSON record listings prevent creation.
- A 10,000-character API error code is reduced to 60 characters.
- Existing CRLF and outer whitespace normalize consistently and suppress duplicates.

Sequential identical runs and retries after a persisted post’s response was lost also passed. Remaining limitations: only 50 records are checked, other posting clients are outside this concurrency control, and terminal query/fragment punctuation can still be removed by `trimUrl()`.

Validation: Node syntax check, in-memory mocked execution, and official GitHub documentation. **No files edited, credentials accessed, workflows dispatched, or posts sent.** Git status remained unchanged; both target files remain untracked on `main` at `156670f`.