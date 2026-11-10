**0 BLOCKER, 2 MATERIAL, 3 NOTE. Fix both MATERIAL findings before live use.** Read both prior reviews. This remains Tier 2 code because it handles credentials and public posting.

- **MATERIAL — Simultaneous identical dispatches can still publish twice.** [scripts/post-to-bluesky.mjs:128](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:128), [line 136](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:136). Both runs can finish their lookup before either creates its post. Reproduced with synchronized mocks: two empty listings led to two `createRecord` calls, each without an `rkey`. Removing concurrency exposes this race. Sequential reruns—including after a saved post’s response is lost—are successfully suppressed within the 50-post window. Define an operation identity and enforce uniqueness atomically; the content scan alone does not guarantee duplicate prevention.

- **MATERIAL — Bare RepresentDC links can still publish a different destination.** [scripts/post-to-bluesky.mjs:59](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:59). Reproduced:
  - `billtracker.representdc.org.evil.invalid/path` → `https://billtracker.representdc.org`
  - `billtracker.representdc.org?bill=51#anchor` → `https://billtracker.representdc.org`
  - `billtracker.representdc.org:8443/path` → `https://billtracker.representdc.org`

  The hostname boundary permits a following dot, and bare-link suffixes are captured only when they start with `/`. `new URL()` validates the truncated destination successfully. Require a complete hostname boundary and preserve supported suffixes—or reject unsupported forms without linking a prefix.

- **NOTE — The duplicate policy suppresses legitimate repeat posts and is not exact-text comparison.** [scripts/post-to-bluesky.mjs:129](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:129), [line 24](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:24). An intentionally repeated announcement exits successfully without posting while its text remains in the window, regardless of age or different facets. Existing text is trimmed, so `"  Hello\n"` suppresses `"Hello"`. Conversely, incoming CRLF is normalized but existing CRLF is not; that variant escaped suppression in a fixture. A repeat outside the first 50 records also escapes detection.

- **NOTE — Malformed successful listings fail open.** [scripts/post-to-bluesky.mjs:126](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:126). HTTP errors, network failures, and invalid JSON all prevent creation. However, HTTP 200 with `{}` or `{"records":null}` becomes an empty list and permits posting. Validate that `records` is an array before proceeding.

- **NOTE — Error codes are sanitized, but not bounded.** [scripts/post-to-bluesky.mjs:112](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:112). Free-text API messages are omitted, but a 10,000-character fixture error code was printed in full. Network and listing JSON exceptions also escape as ordinary exceptions rather than the claimed status/code format. No credential exposure was demonstrated.

The remaining claimed fixes verified:

| Check | Result |
|---|---|
| Account routing / ordering — [line 123](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:123) | The actual account’s unauthenticated `listRecords` request through `bsky.social` returned HTTP 200. Its [DID document](https://plc.directory/did:plc:tnb6ff4trxlp6wnotd4azf4h) identifies a Bluesky PDS. Default ordering is descending record key, appropriate for recent normal TID posts—not oldest-first. [Implementation](https://raw.githubusercontent.com/bluesky-social/atproto/main/packages/pds/src/actor-store/record/reader.ts) |
| Explicit URLs — [line 59](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:59) | Ordinary paths, queries, fragments, uppercase schemes, and balanced trailing parentheses pass. Invalid URLs fail; UTF-8 offsets pass. However, [line 53](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:53) also strips meaningful terminal punctuation: `https://example.org/search?q=why?` loses its final `?`. |
| Concurrency removal — [workflow line 23](/Users/andriathomas/Projects/representdc-main/.github/workflows/post-to-bluesky.yml:23) | Confirmed; group-based pending-run replacement is removed. |
| Dry-run — [line 25](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:25) | Only exact `"false"` reaches live posting. |
| Byte limit — [line 36](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:36) | 3,000 bytes accepted; 3,025 rejected despite being under 300 graphemes. |
| Password masking — [line 101](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:101) | Extracted, trimmed password is separately masked before authentication. |
| Post-log protection — [line 87](/Users/andriathomas/Projects/representdc-main/scripts/post-to-bluesky.mjs:87) | Text and facet output are enclosed by matching stop/resume markers in Actions. Dry-run text remains public log content. |

Validation: Node syntax check, in-memory mocked execution, and public read-only API requests. No files edited, credentials accessed, or posts sent. Fresh Git status remained unchanged; both target files remain untracked.