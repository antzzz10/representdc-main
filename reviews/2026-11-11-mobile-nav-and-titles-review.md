# Mobile nav menu + per-route titles — Codex review reconciliation

**Tier 2** (public site output: nav and the titles/descriptions shown in search results).
Passes: medium + high (standard prompt), high attack-frame, then one focused high re-check
of the fixes. Raw output: `2026-11-11-mobile-nav-and-titles-codex-*.raw.md`.

**Result: 0 BLOCKER, 2 MATERIAL, both fixed and confirmed in the re-check.**

| Finding | Pass | Severity | Disposition |
|---|---|---|---|
| Tab past the last menu item lands on page content hidden under the open panel | medium | MATERIAL | Accepted — menu closes when focus leaves the nav (`onBlur` + `relatedTarget`). Browser-verified. |
| `String.replace` with a replacement string expands `$&` / `$'` in titles or descriptions, corrupting `<head>` | attack | MATERIAL | Accepted — replacement callback. No current copy contains `$`. |
| Back reopens a menu closed by navigation | high, attack | NOTE | Accepted — stale opened-on key cleared during render. Browser-verified. |
| Escape with focus outside the nav moves focus to the Menu button | attack | NOTE | Accepted — refocus only when focus was in the nav or on `body`. |
| Widening past 1024 px leaves focus on a hidden element | attack, recheck | NOTE | Accepted — focus moves to the brand link (from panel links or the button). |
| Metadata lookup case/percent-decoding differs from React Router (`/NEWS`) | high, attack | NOTE | Accepted — lookup lowercased and decoded. |
| Parameterised route without expansion passes the build | high | NOTE | Accepted — build fails on any `:param` route other than `/reading/:slug`. |
| Raw px values (focus outline, 1px borders, visually-hidden geometry) | medium, high | NOTE | Rejected — matches existing site convention (1px hairlines and raw focus outlines in `StatehoodBill.css`, `App.css`; visually-hidden block is the same as the existing `.sr-only`). Spacing, colour and radii all use tokens. |
| `/news%2F` decodes to News metadata though the router matches nothing | recheck | NOTE | Not fixed — no route renders there, so only the tab title of a blank page is affected. |
| Native `#hash` navigation keeps the location key, so the menu stays open | high, recheck | NOTE | Not fixed — the menu has no hash links; outside click / Escape still close it. |
