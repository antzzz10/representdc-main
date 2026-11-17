**0 BLOCKER, 1 MATERIAL.** Reviewed commit `7683b4f`; no files changed.

- **MATERIAL — `src/Follow.jsx:16–17`: Unestablished email cadence.** Yes, “One email a week” needs softening given that no issue has been sent. “Weekly email” reinforces that expectation. The existing sign-up page supports listing email registration, but does not establish a recurring publication. **Fix:** use “Email updates” and “Sign up for updates on what Congress does to D.C., what D.C. is doing about it, and how you can help.” Also adjust the comment at line 10, which describes sending as established.

- **NOTE — `src/Follow.jsx:16–19`: Other content rules pass.** Sentence case, “D.C.” punctuation, no em-dashes, concrete and non-partisan wording. No reader-facing editorial explanation or capacity language. **Fix:** none beyond the cadence correction.

- **NOTE — `src/components/Icon.jsx:9–15`: Icon resolves.** `mail` becomes `Mail`; verified the installed Lucide export renders successfully. **Fix:** none.

- **NOTE — `src/Follow.jsx:58`: External navigation is consistent.** Newsletter and bill-tracker cards use the same native anchor and open in the current tab. **Fix:** none.

- **NOTE — `src/data/routeMeta.js:53–55`: Metadata and output agree.** The description still matches the hero. Both `dist/follow.html:7–8` and `dist/follow/index.html:7–8` match it; `dist/sitemap.xml:12` includes `/follow`. The generated bundle contains the new card and URL. **Fix:** none.

- **NOTE — `src/Follow.jsx:44–58`: Card accessibility passes source inspection.** One native, keyboard-accessible link contains descriptive text without nested controls; icons are hidden from assistive technology. Focus styling exists at `src/App.css:178–182`. **Fix:** none.

Focused ESLint passed. The sign-up URL could not be independently retrieved; its existence is accepted from your stated context. No build was run because it writes output.

**Verdict: Soften the cadence claim before shipping; the remaining checks pass.**