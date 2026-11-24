# Confirming pass 1 (high)

**DO NOT SHIP.** The reported pagination failures are now tracked correctly, but the sitemap can still report malformed content as a healthy empty source. The new parser also mishandles valid CDATA and quoted attributes.

### Earlier findings

| Earlier finding | Disposition | Evidence |
|---|---|---|
| **Medium MATERIAL — Missing entry close can mix two stories’ fields** | **CONFIRMED FIXED for the reported case.** The parser checks opening and closing counts and rejects nested `<url>` openings before extracting entries. [feeds.mjs:241](scripts/news/feeds.mjs:241) |
| **High MATERIAL — Commented-out link and similarly prefixed title can be selected** | **PARTIALLY FIXED.** Ordinary comments are removed, and exact tag-name boundaries prevent the reported `<news:title_extra>` match. But comment stripping also removes literal text inside CDATA. For example, `<news:title><![CDATA[Before <!-- literal --> After]]></news:title>` becomes `Before  After`. [feeds.mjs:240](scripts/news/feeds.mjs:240) |
| **Both MATERIAL — Broken sitemap can count as a healthy empty source** | **PARTIALLY FIXED.** Unbalanced entries and a populated sitemap whose entries are all refused now fail. But `<urlset><!-- </urlset> -->` has no real closing root: the check accepts the close inside the comment, then the parser reports an empty sitemap and `fetchAllFeeds` converts it to `ok`. Likewise, `<urlset><url/></urlset>` is treated as empty despite containing an unusable entry. G5 can therefore pass and the failure clock can clear. [feeds.mjs:209](scripts/news/feeds.mjs:209), [feeds.mjs:241](scripts/news/feeds.mjs:241), [feeds.mjs:380](scripts/news/feeds.mjs:380) |
| **Both MATERIAL — Persistent later-page failures do not trigger health tracking** | **CONFIRMED FIXED.** `partial-page-N-why` is non-`ok`, so G5 counts the source as failed and `updateFeedHealth` preserves its failure clock. [feeds.mjs:337](scripts/news/feeds.mjs:337), [gates.mjs:160](scripts/news/gates.mjs:160), [archive.mjs:169](scripts/news/archive.mjs:169) |
| **Medium MATERIAL / high MATERIAL — Unreadable later page or bad dates end paging silently** | **CONFIRMED FIXED for the reported cases.** A page with item blocks but no readable items gets `unreadable-items`; a page whose parsed items all have bad dates gets `bad-dates`. [feeds.mjs:335](scripts/news/feeds.mjs:335) |
| **Medium NOTE — Tests miss the failure modes** | **PARTIALLY FIXED.** The tests now cover the reported cross-entry, rejected-only, later-page and sustained-health examples, but miss the malformed-root and XML lexical cases described here. A failing input is `<urlset><!-- </urlset> -->`. [feed-sources.test.mjs:149](scripts/eval/feed-sources.test.mjs:149) |
| **High NOTE — Automatic sitemap redirects can make an immediate second request** | **CONFIRMED FIXED.** Sitemap fetches use `redirect: 'manual'`; ordinary feeds retain the default redirect behavior. [feeds.mjs:275](scripts/news/feeds.mjs:275) |

### New defects and checks

- **MATERIAL — Valid CDATA can make an entire sitemap fail.** A title such as `<news:title><![CDATA[What <url> means]]></news:title>` is valid character data, but the entry counter treats its literal `<url>` as an opening entry and rejects the file as `malformed-feed`. This can discard otherwise usable stories and mark the source failed. Normal CDATA without tag-like content works. [feeds.mjs:240](scripts/news/feeds.mjs:240)

- **MATERIAL — A valid quoted attribute containing `>` can discard a story.** For example, `<loc note="1 > 0">https://www.example.com/a</loc>` is valid XML, but `onlyTag` stops its attribute match at the `>` inside the quoted value. The resulting link is invalid, so an otherwise valid single-entry sitemap becomes `malformed-feed`. Ordinary attributes without `>` are handled. [feeds.mjs:214](scripts/news/feeds.mjs:214)

- **NOTE — A partial-page reason can be overwritten.** If page 1 has parsed stories but all their dates are invalid, and page 2 returns HTTP 500, `fetchFeed` produces `partial-page-2-http-500`, but `fetchAllFeeds` reports `bad-dates`. Health still fails, but the record loses the page-2 failure reason. [feeds.mjs:364](scripts/news/feeds.mjs:364)

The representative Google News shape with `<image:image>`, `<image:loc>`, and `<lastmod>` is handled: those tags do not collide with the exact `<loc>` match. Stories already obtained from page 1 remain in the candidate list after a later-page failure, subject to the normal date and freshness filters. The ordinary one-page RSS/Atom and newsletter paths showed no separate regression in this review.

The offline `feed-sources.test.mjs` suite passed **15/15**; the failing examples above were also checked with in-memory probes. This scratch directory is not a Git repository, so I could not verify branch or worktree status. No files were changed and no network was used.
# Confirming pass 2 (medium)

**DO NOT SHIP.** The reported CDATA and quoted-attribute cases now work, but a malformed sitemap can still appear healthy.

| Round-two item | Disposition | Evidence |
|---|---|---|
| Commented link and prefixed title; literal comment text in CDATA | **CONFIRMED FIXED** | The reported CDATA title `Before <!-- literal --> After` is preserved, and the tests cover commented links and exact tag names. |
| Broken sitemap reported as healthy | **NOT FIXED** | `<urlset><broken></urlset>` is malformed XML, but `readNewsSitemap` returns `sound: true` with zero entries. `fetchAllFeeds` consequently reports the source as `ok`, clearing its failure clock. The two reported examples—a closing root inside a comment and `<url/>`—are fixed. [feeds.mjs:276](scripts/news/feeds.mjs:276) |
| Tests missing failure modes | **NOT FIXED** | The suite covers the reported malformed-root and lexical examples, but does not cover `<urlset><broken></urlset>`, which still passes as a healthy empty source. |
| CDATA containing `<url>` rejects the sitemap | **CONFIRMED FIXED** | The new test accepts that literal text in a CDATA title. |
| Quoted attribute containing `>` discards a story | **CONFIRMED FIXED** | The new test accepts `<loc note="1 > 0">` and extracts the link. |

No additional BLOCKER or MATERIAL finding was established within the requested scope. The offline suite passed **16/16**; the malformed input above was also checked locally. No network was used or files changed. The scratch directory is not a Git repository, so branch and worktree status could not be verified.
# After pass 2

The one item pass 2 left open (a sitemap with no entries passing as a healthy source) was closed afterwards: a news sitemap with no entries now reports `no-entries`, which counts as failing. Tests cover it. That last change was not sent back to Codex.
