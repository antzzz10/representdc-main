**MATERIAL — The news page can pull readers away from where they chose to read.** [NewsAndAnalysis.jsx](src/NewsAndAnalysis.jsx:125) only treats wheel, touch movement and keyboard input as reader movement. If the feed is slow and a reader drags the scrollbar or uses another scrolling mechanism before it loads, the settling effect can scroll them back to the fragment. Track actual user-initiated scrolling, including scrollbar interaction, and cancel the pending correction when it occurs.

**MATERIAL — Fragment correction is limited to once per mounted news page.** [NewsAndAnalysis.jsx](src/NewsAndAnalysis.jsx:132) never resets `hashSettled` or `readerMoved` when the location changes. For example, after visiting a fragment, using Back and Forward while `/news` remains mounted can leave a later `#analysis` navigation without its feed-settling correction. Scope these flags to each navigation and test back/forward with a delayed feed.

**NOTE — The Reading link uses smooth scrolling even when reduced motion is requested.** The new `/news#analysis` link reaches the existing unconditional smooth scroll in [ScrollToTop.jsx](src/components/ScrollToTop.jsx:14). Honor `prefers-reduced-motion` when choosing the scroll behavior.

**NOTE — Follow card copy still has duplicate sources.** [StatehoodCurious.jsx](src/StatehoodCurious.jsx:15) repeats the news card’s title and body from [followWays.js](src/data/followWays.js:30). Editing the Follow card can leave the curious page out of sync. Export and reuse that card data as well.

**NOTE — The new action cards skip a heading level.** [TakeAction.jsx](src/TakeAction.jsx:49) places card `h3` headings directly after the page `h1`, with no intervening `h2`. The first card row on the curious page has the same structure. Use `h2` for top-level card headings or add an appropriate section heading.

The analytics unit tests passed, including fixed-value and inherited-name checks. The picker wiring test inspects source text rather than exercising actual click navigation, so it does not establish runtime behavior. I did not run a browser walkthrough or a build; the review was read-only and offline.

DO NOT SHIP