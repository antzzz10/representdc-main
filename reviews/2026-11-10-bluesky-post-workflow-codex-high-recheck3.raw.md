**0 BLOCKER, 2 MATERIAL.** Read the prior recheck; the requested reproductions are resolved, but two parsing issues remain.

1. **MATERIAL — Unicode prefixes still allow truncated destinations.** [scripts/post-to-bluesky.mjs:63](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:63) uses ASCII `\w` for its start boundary. Reproduced `érepresentdc.org/path` linking its suffix to `https://representdc.org/path`, although the complete hostname parses as `xn--representdc-99a.org`. Also, `billtracker。representdc.org/path` incorrectly links to the apex domain. Validate the complete hostname boundary before accepting a start.

2. **MATERIAL — The scanner reprocesses starts inside an already-consumed URL.** [scripts/post-to-bluesky.mjs:65](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:65). Reproduced:
   - `https://example.org/?next=representdc.org` produces overlapping whole-URL and suffix facets, contrary to [Bluesky’s facet requirements](https://github.com/bluesky-social/bsky-docs/blob/main/docs/advanced-guides/post-richtext.md).
   - Valid URL `https://example.org/?q=https://` aborts posting because the nested `https://` is parsed separately.

   Advance scanning beyond each complete consumed address.

Confirmed fixes:

- All three prior continuations—`.рф/path`, `。evil.invalid/path`, and `%2Eevil.invalid/path`—produce **no facets**.
- Serialized whitespace and LF/CRLF variants produce **one create**, with the second run detecting the existing post. The constant group at [workflow:29](/Users/andriathomas/Projects/representdc-main/.github/workflows/post-to-bluesky.yml:29) removes the separate-group race, consistent with [GitHub’s concurrency rules](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#concurrency).
- The accepted pending-run limitation is documented accurately for this configuration.

Node syntax and in-memory mocked checks passed. No files edited, credentials accessed, workflows dispatched, or posts sent; Git status unchanged.