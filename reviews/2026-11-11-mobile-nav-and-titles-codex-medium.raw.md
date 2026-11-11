<!-- codex exec -s read-only, model_reasoning_effort=medium, diff 0d25259..1bbc2c7, run 2026-11-11. Prompt: standard review. Final message only. -->

**0 BLOCKER / 1 MATERIAL / 1 NOTE**

- **MATERIAL — [Nav.jsx:62](src/components/Nav.jsx:62): Keyboard focus can move behind the open panel.** Open Menu on the homepage at 1024px with a tall viewport, then Tab through the panel’s final CTA. Focus advances to “Find your starting point” beneath the opaque panel, which remains open because only pointer events, Escape, and navigation close it. The focused control is fully obscured. **Fix:** close the panel when focus leaves the navigation, using `onBlur` with a `relatedTarget` containment check.

- **NOTE — [Nav.css:69](src/components/Nav.css:69): New styles violate the token-only guardrail.** Focus outlines and offsets, button borders, and visually hidden label geometry introduce raw pixel values, including lines 85 and 182–187. **Fix:** define appropriate shared tokens and reference them in these declarations.

Changed React/data files pass lint; `git diff --check` passes. An in-memory prerender run verified all 27 HTML outputs and confirmed that a missing metadata entry fails the build. A full build and browser walkthrough were not run in the read-only environment. No files changed.