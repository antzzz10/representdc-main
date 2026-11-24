**NOTE — [follow-page.test.mjs](scripts/eval/follow-page.test.mjs:15):** The test checks that each selected ID resolves to a named partner, but `.find()` does not detect duplicate IDs in `statehoodPartners.js`. It also does not assert the owner’s chosen three IDs and order or exercise the rendered list. Those are coverage gaps; the current data is correct.

**NOTE — [Follow.jsx](src/Follow.jsx:13):** The comment says nothing on the page points back to the site’s own pages, but the “All statehood partners” link points to `/statehood-partner-map`. The similar comment in [followWays.js](src/data/followWays.js:4) is also inaccurate. These comments predate the change.

All three selected IDs appear exactly once in the partner data, and the rendering code preserves their chosen order. The page displays the second group as **“LWV DC”**, its name in the shared data. Both existing tests pass. Link destinations and the home-page signup claim could not be verified under the no-network constraint.

**SHIP**