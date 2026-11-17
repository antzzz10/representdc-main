Reviewed `7683b4f`. **0 BLOCKER, 1 MATERIAL.**

- **MATERIAL — `src/Follow.jsx:16–17`:** “Weekly email” and “One email a week” present a firm cadence before any issue has been sent. The existing signup page qualifies as a real way to follow, but does not establish weekly delivery. **Fix:** use “Email updates” and remove “One email a week.” The remaining description explains what subscribers would receive without self-descriptive or capacity language.

Other checks passed:

- **Wording:** sentence case, “D.C.” with periods, no em-dashes, non-partisan and concrete.
- **Icon:** `mail` becomes `Mail` in `src/components/Icon.jsx:9–15`; the installed Lucide export resolves.
- **External link:** `src/Follow.jsx:58` uses the same native, same-tab anchor as the bill-tracker card.
- **Metadata/output:** `src/data/routeMeta.js:53–55` still matches the hero. Both generated Follow HTML files have matching metadata and reference a bundle containing the card. `dist/sitemap.xml:12` retains `/follow`; no new route is needed.
- **Accessibility:** the whole card is one keyboard-accessible link with descriptive text, decorative icons hidden from assistive technology, no nested controls, and focus styling in `src/App.css:178–182`.

Focused ESLint passed. No files changed. The signup URL could not be fetched by the web tool; its existence is taken from your stated context. Accessibility was checked in source, without a browser walkthrough.

**Verdict: Soften the unproven delivery promise before publishing; otherwise the card passes.**