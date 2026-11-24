**DO NOT SHIP.** One link conflicts with the stated direction, and the supplied copy is incomplete for the requested site-wide and visual checks.

- **MATERIAL — [Follow.jsx:95](src/Follow.jsx:95):** “All statehood partners” links back to this site’s partner map. The owner’s stated intent says the Follow page should not point back at the same site. Remove the link or confirm an exception.

- **NOTE — [Follow.jsx:19](src/Follow.jsx:19):** A missing or renamed partner ID silently removes that group from the page. All four IDs currently match, so this is a maintenance risk rather than a current omission. A validation check would make future mismatches visible.

- **NOTE — [Follow.css:162](src/Follow.css:162):** The partner-map link has no specified 44px minimum touch target. If the link is retained by exception, verify its rendered target size.

The supplied page files do not import the removed `WAYS` export or use the removed `.follow-card` and `.follow-cta` classes. The four partner links have descriptive names, the drawing is hidden from assistive technology, the visible section headings follow the h1, and the new visible copy has no em-dashes. The live Bluesky limit is three.

This is a partial code copy: it omits other site files, shared CSS and color definitions, dependencies, and a runnable app. I could not establish that **all** other pages are unaffected, verify contrast or 375px overflow, or run a build or browser check.

**DO NOT SHIP.**