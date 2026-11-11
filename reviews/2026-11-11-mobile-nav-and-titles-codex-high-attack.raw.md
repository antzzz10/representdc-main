<!-- codex exec -s read-only, model_reasoning_effort=high, diff 0d25259..1bbc2c7, run 2026-11-11. Prompt: attack-frame. Final message only. -->

**0 BLOCKER / 1 MATERIAL / 4 NOTE.** Fix the renderer’s replacement-string handling before merging.

1. **MATERIAL — `$` sequences bypass the HTML escaping.**  
   **Input:** article title `Budget $& | RepresentDC`, or dek `Quoted $'`.  
   **Observed:** the renderer exits successfully. The first input produces nested `<title>` markup and moves the description outside `<head>`. The second duplicates template content, producing two `#root` elements and five scripts instead of three. Search metadata and page structure become corrupted. Current content does not contain these sequences.  
   **Location:** [scripts/prerender-routes.mjs:98](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/mobile-nav-and-titles-580bc2/scripts/prerender-routes.mjs:98).  
   **Fix:** supply a replacement callback: `indexHtml.replace(titleRe, () => escapedMarkup)`. String replacements interpret `$&`, ``$` ``, and `$'` even after HTML escaping.

2. **NOTE — Back resurrects a previously closed menu and steals focus.**  
   **Input:** load `/?utm_source=test`, open Menu, click the brand, then press Back.  
   **Observed:** the brand navigation closes the menu, but Back reopens it and focuses Home. Forward closes it again. The original `openedOn` value survives navigation and becomes active again when its history key returns. Reproduced with the current source under development StrictMode.  
   **Location:** [Nav.jsx:35](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/mobile-nav-and-titles-580bc2/src/components/Nav.jsx:35).  
   **Fix:** clear the stored opening state when the location key changes, rather than merely deriving temporary closure from a key mismatch.

3. **NOTE — Widening the viewport hides the focused control.**  
   **Input:** open Menu with keyboard focus on its first link; cross from 1024px to 1025px.  
   **Observed in DOM testing:** the panel becomes hidden while its link remains `document.activeElement`. The handler provides no visible focus destination. Browser-specific blur and subsequent Tab behavior remain unverified.  
   **Location:** [Nav.jsx:58](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/mobile-nav-and-titles-580bc2/src/components/Nav.jsx:58).  
   **Fix:** when focus is inside the panel, move it to the corresponding visible desktop link or brand before closing. The menu button also disappears at this breakpoint.

4. **NOTE — Escape outside navigation unexpectedly moves focus.**  
   **Input:** open Menu, keyboard-focus a footer link, then press Escape.  
   **Observed:** focus jumps from the footer to the menu button. The document-wide listener handles Escape regardless of its origin.  
   **Location:** [Nav.jsx:47](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/mobile-nav-and-titles-580bc2/src/components/Nav.jsx:47).  
   **Fix:** restore button focus only when Escape originated within navigation; preserve outside focus.

5. **NOTE — Router matching and metadata lookup disagree.**  
   **Input:** `/NEWS` or `/%6Eews`, including through the existing 404 restoration flow.  
   **Observed:** React Router renders **News & analysis**, while the title and description remain the home page’s.  
   **Location:** [routeMeta.js:69](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/mobile-nav-and-titles-580bc2/src/data/routeMeta.js:69).  
   **Fix:** resolve metadata using the router’s decoding and case-matching behavior, while preserving article slug semantics.

Verification passed for ordinary escaping of quotes, `<`, `&`, and newlines; literal `$1`; missing-metadata build rejection; redirect metadata; existing root and trailing-slash output; unchanged `404.html`; unknown-article redirects; ordinary metadata Back/Forward updates; StrictMode duplicate-tag checks; toggle closure; and outside pointer dismissal. Lint passed.

Playwright could not launch because the read-only sandbox blocks temporary-directory creation. Consequently, 320/375px layout, touch hit-testing, panel scrolling, and stacking remain visually unverified. I inspected existing `dist/` and used in-memory rendering/build harnesses. No files changed; the pre-existing untracked `.claude/launch.json` remains untouched.