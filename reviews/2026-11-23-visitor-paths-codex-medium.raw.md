**MATERIAL — Late feed loading can override a reader’s scroll.** [NewsAndAnalysis.jsx](src/NewsAndAnalysis.jsx:125) only treats wheel, touch movement, and keyboard input as reader movement. A reader who drags the scrollbar while the feed loads can be pulled back to the fragment when the response arrives. Track pointer-driven scrolling as well, while distinguishing it from the initial programmatic scroll.

**MATERIAL — The correction is scoped to the component lifetime, not each fragment navigation.** [NewsAndAnalysis.jsx](src/NewsAndAnalysis.jsx:121) never resets `readerMoved` or `hashSettled` when the hash changes. For example, a visitor can scroll on `/news`, then navigate forward to `/news#analysis` while the feed is pending; the initial scroll occurs, but the later correction is suppressed and loaded headlines push the destination away. Reset the state for each fragment navigation and test back/forward and delayed responses.

**NOTE — The new Reading link uses smooth scrolling even for reduced-motion users.** [StatehoodCurious.jsx](src/StatehoodCurious.jsx:36) now invokes the existing [ScrollToTop.jsx](src/components/ScrollToTop.jsx:14) smooth scroll. Respect `prefers-reduced-motion` by using an immediate scroll when requested.

**NOTE — The new action cards skip a heading level.** [TakeAction.jsx](src/TakeAction.jsx:49) renders their titles as `h3` directly after the page’s `h1`. Use `h2` for the card titles or introduce an appropriate `h2` for the card group.

**NOTE — The removed placeholder leaves dead CSS.** [App.css](src/App.css:190) retains `.card-badge`, but no source component uses it after the Take Action replacement. Remove the unused rule.

The 16 analytics tests pass. The new fixed-value validator uses the existing own-property check, and campaign-tag handling is unchanged. The new wiring tests inspect source text rather than exercising browser clicks; they do not establish navigation behavior at runtime. I did not run a browser walkthrough or build in this read-only environment.

DO NOT SHIP