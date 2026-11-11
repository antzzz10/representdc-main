<!-- codex exec -s read-only, model_reasoning_effort=high, diff 1bbc2c7..b797101 -- src scripts, run 2026-11-11. Prompt: focused re-check of fixes. Final message only. -->

**0 BLOCKER / 0 MATERIAL / 3 NOTE — both earlier MATERIAL findings are fixed.** One NOTE is new; two are residual edge cases.

Reviewed only `1bbc2c7..b797101 -- src scripts`.

| Earlier finding | Result |
|---|---|
| Tab reaches content beneath open menu | **Fixed** — `Nav.jsx:89` closes the panel when focus leaves navigation. Button-to-panel and panel-to-panel focus keep it open. |
| `$&` / `$'` corrupt generated HTML | **Fixed** — `prerender-routes.mjs:104` uses a callback. Tested dollar patterns remain literal; generated HTML retains one root. |
| Back reopens menu | **Fixed** — `Nav.jsx:38` clears the stale key. Repeated navigation under StrictMode produced no render loop. Native hash exception below. |
| Escape steals outside focus | **Fixed** — `Nav.jsx:55` preserves focus outside navigation. |
| Widening leaves hidden focus | **Partially fixed** — panel-link focus moves to the brand; button-focus exception below. |
| Metadata differs from router matching | **Partially fixed** — `/NEWS`, `/%6Eews`, and trailing slashes work. Encoded-slash exception below. |
| Unsupported parameterized routes pass build | **Fixed** — `prerender-routes.mjs:56` rejects an injected `/new/:id`; current routes pass. |

Remaining findings:

- **NOTE — New: encoded slashes produce incorrect metadata.** [routeMeta.js:74](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/mobile-nav-and-titles-580bc2/src/data/routeMeta.js:74). For `/news%2F`, decoding and trailing-slash removal return News metadata, but React Router preserves the encoded segment boundary and matches no route. Match the router’s segment-wise decoding.

- **NOTE — Residual: native hash navigation leaves Menu open.** [Nav.jsx:38](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/mobile-nav-and-titles-580bc2/src/components/Nav.jsx:38). Open Menu, then navigate natively to `#target`; the location key stays unchanged, so the panel remains open. Ordinary navigation and Back are fixed.

- **NOTE — Residual: widening while Menu button has focus hides that focus.** [Nav.jsx:68](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/mobile-nav-and-titles-580bc2/src/components/Nav.jsx:68). Open Menu, Shift+Tab from Home to the button, then widen past 1024px. The handler checks only panel descendants, leaving focus on the now-hidden button.

Validation: in-memory Vite build and prerender passed for all **27 HTML outputs**; missing metadata and unsupported parameters correctly failed. Scoped lint and whitespace checks passed. Malformed percent escapes did not throw. Focus checks used DOM simulation; real-browser resize behavior remains unverified.

No files changed; pre-existing `.claude/launch.json` remains untouched.