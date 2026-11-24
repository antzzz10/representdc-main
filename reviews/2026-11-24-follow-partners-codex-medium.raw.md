**NOTE — [follow-page.test.mjs](scripts/eval/follow-page.test.mjs:11):** The test checks that Follow-list IDs are unique and that each has a matching named partner, but `find` does not check that an ID appears exactly once in the partner data. It also does not lock in the owner’s chosen three IDs or their order. A duplicate map entry or a later list change could pass the test.

**NOTE — [Follow.jsx](src/Follow.jsx:13):** The comment says nothing points back to the site’s own pages, but the page links to its statehood partner map at line 95. The link works with the rendering code; the comment is inaccurate.

The three selected IDs each occur exactly once in the partner data. The rendering preserves their order and displays the intended groups; the League appears as “LWV DC,” its name in the shared data. Both existing tests pass. The destination pages and the comment about Together for DC’s signup form could not be verified under the no-network constraint.

**SHIP**