0 BLOCKER; 3 MATERIAL findings. Reviewed both requested diffs; no files modified.

- **MATERIAL — src/Home.jsx:198:** “Congress is using its power over D.C. now” is supported today by the supplied figures, especially the four enacted measures. It does **not** establish that all 74 are advancing. The heading remains unchanged with zero counts in a new Congress, or when loading fails and the number and breakdown disappear. Zero tracked measures cannot support the assertion; unavailable data cannot substantiate it. Suggested durable heading: **“Threats to D.C. home rule in this Congress.”** On failure, show **“Bill counts are unavailable.”**

- **MATERIAL — src/Home.jsx:142; src/HowCongressControlsDC.jsx:170:** “Measures … that **would override**” describes the entire total prospectively, although four are already law. Suggested wording: **“Bills, resolutions and budget riders that override or seek to override D.C.’s local laws or limit its self-government.”**

- **MATERIAL — src/HowCongressControlsDC.jsx:172:** The newly displayed status breakdown has no supporting bill-data source in the page’s consolidated Sources list. Its existing sources address history and biography. Add a source entry such as **“RepresentDC bill tracker: measures and legislative status”**, linked to the specific supporting tracker view. The homepage already provides a tracker link beside its breakdown.

- **NOTE — src/Home.jsx:202:** Removing the intro does **not** leave 74 undefined: “threats to D.C. home rule in this Congress” names the count, and the breakdown explains its stages. It does remove the standalone explanation of what qualifies. If that context matters here, use **“Bills, resolutions and budget riders targeting D.C.’s local laws or self-government.”** This adds information rather than repeating the heading.

- **NOTE — src/HowCongressControlsDC.jsx:169:** “Are tracked” narrates the site’s activity and also produces **“1 threat … are tracked.”** Suggested wording: **“This Congress: {count} {threat/threats} to D.C. home rule.”** Follow with the definition and breakdown.

The added or changed reader-facing lines contain **no remaining em-dashes, “not X but Y” contrast, emoji, or unicode icons**. The middle dots separate statistics; they do not perform icon duty. Sentence case and “D.C.” punctuation comply, and neither hero was changed. The repeated headline count is deliberate consistency; there is no new duplicative hero subheading. Existing em-dashes elsewhere in these files are outside the changed-copy scope.

**Verdict: Revise the unconditional headline, enacted-measure wording, and explainer sourcing before publishing.**