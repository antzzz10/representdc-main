<!-- codex exec -s read-only, model_reasoning_effort=high, focused recheck of HEAD~1..HEAD at feaf196, run 2026-11-10. Final message only. -->

**Verdict: Revise before release—both MATERIAL findings remain partly fixed. No NEW BLOCKER or MATERIAL issue reproduced.**

Reviewed only `HEAD~1..HEAD` at `feaf196`.

- **MATERIAL — Same-state identity swap: PARTLY FIXED.**  
  [src/data/statehoodBill.js:329](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:329). The original **H005, CA-1 → H255, CA-6** probe now suppresses lookup correctly. However, replacing signed **S002**’s ID with unsigned **S052**’s ID—both AK senators—still passes validation. Lookup marks S052 **“Signed on”** and S002 **“Not yet,”** while the cosponsor record retains S002’s name.  
  **Fix:** reconcile compatible person identity as well as seat information for overlapping IDs, including senators.

- **MATERIAL — Stale observations presented as current: PARTLY FIXED.**  
  [src/data/statehoodBill.js:323](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:323). The October 31 snapshot now hides recent sign-ons on November 10; the January 2025 roster now suppresses lookup. But a **fresh roster combined with October 31 bill data** still produces **441 House statuses, including 231 “Not yet.”** Only roster age is checked for lookup. Separately, a fresh House bill with an incomplete Senate list still produces the unqualified **“No new cosponsors since October 9, 2026.”**  
  **Fix:** check bill freshness before assigning lookup statuses; qualify recent claims by checked date and covered chambers.

The **HTTP→HTTPS upgrade** at [src/data/statehoodBill.js:71](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:71) produced **no non-official-host bypass** in probes. Official House/Senate URLs upgraded; deceptive suffixes, credentials, nonstandard ports and other protocols were rejected. Backslash normalization yielded an actual official hostname.

Both residual failures also reproduce in the parent commit, so they are unresolved findings rather than new regressions. **28 focused checks, changed-file lint and diff whitespace checks passed.** No edits or network writes occurred; pre-existing `.claude/launch.json` remained untouched.
