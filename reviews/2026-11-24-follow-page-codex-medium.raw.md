**MATERIAL — [Follow.jsx:95](src/Follow.jsx:95):** “All statehood partners” links to this site’s own partner map. That conflicts with the stated direction that the Follow page should not point back at the same site.

**NOTE — [Follow.jsx:19](src/Follow.jsx:19):** A missing or renamed partner ID silently removes that partner from the page. All four IDs currently match, so this is a maintenance risk rather than a present omission. A validation check would make future mismatches visible.

**NOTE — [Follow.css:162](src/Follow.css:162):** The partner-map link has no explicit 44px minimum touch target. If it is retained, its target needs checking against the shared styles.

The supplied context has no remaining imports of `WAYS` or uses of `.follow-card` or `.follow-cta`. The new section headings are h2s under the h1, the drawing is hidden from assistive technology, and partner links include their organization names. The changed visible copy has no em-dashes.

The copy is incomplete: shared styles, dependencies, and the rest of the site are absent. I could not verify site-wide imports, computed contrast, all touch targets, or actual overflow at 375px, and could not run the site.

**DO NOT SHIP**