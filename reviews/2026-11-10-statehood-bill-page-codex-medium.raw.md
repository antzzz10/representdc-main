<!-- codex exec -s read-only, model_reasoning_effort=medium, diff b9ea616..09104ac, run 2026-11-10. Prompt: standard review. Final message only. -->

**0 BLOCKER / 6 MATERIAL / 2 NOTE.** Changes are needed before release.

1. **MATERIAL — Lookup stops working after a chamber switches Congress.** [useStatehoodBillData.js:10](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/hooks/useStatehoodBillData.js:10) always fetches `members-119.json`. When the House switches to a confirmed 120th bill, `MemberLookup.jsx:29` rejects that roster and renders a blank panel. **Fix:** fetch the roster matching each current chamber bill’s Congress, preserving independent transitions.

2. **MATERIAL — Frozen historical totals can be overwritten by older data.** [statehoodBill.js:263](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:263) replaces history counts whenever the bill number and Congress match. Parsing discards `final`, and replacement ignores `current`. A local probe changed a final historical total of **210** to an archived bill’s **209**. **Fix:** retain `final` and preserve final rows; reconcile only non-final rows with an eligible current snapshot.

3. **MATERIAL — Truncated rosters pass validation and produce misleading organizer results.** [statehoodBill.js:132](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:132) ignores the contract’s `counts`. A probe containing one member but declaring 541 members was accepted. The lookup would present that partial population as its complete denominator. Missing Congress metadata also becomes `null`, which bypasses the lookup’s Congress check. **Fix:** validate roster counts against the rows and require an explicit matching Congress before showing statuses or counts.

4. **MATERIAL — The non-voting subtotal is not checked against the cosponsor list.** [statehoodBill.js:96](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:96) only checks whether it exceeds the overall total. Changing the fixture’s subtotal from **2** to **200** passed validation and would display “Including 200 non-voting members.” **Fix:** recompute the subtotal from validated seat information and reject disagreement, as already done for original cosponsors.

5. **MATERIAL — Production omits the required explanation of the bill.** [StatehoodBill.jsx:20](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/StatehoodBill.jsx:20) sets `WHAT_IT_IS` permanently to `null`; production removes the placeholder without supplying copy. Newcomers receive procedural facts but no explanation of what the Admission Act does, leaving PRD §4 A.1 and prior finding 9 unresolved. **Fix:** supply the required approved paragraph before release. PRD §9’s default is for the agent to draft it for Andria’s review.

6. **MATERIAL — “This month” can display a previous month’s sign-ons.** [statehoodBill.js:227](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:227) chooses the month from `checkedAt`. With an October 31 snapshot viewed in November, the probe returned October 9 under “Signed on this month.” Archived snapshots can preserve this error indefinitely. **Fix:** use the current Eastern calendar month, or explicitly label the snapshot’s month; scope any empty-state claim to the chambers successfully checked.

7. **NOTE — Impossible check dates pass validation.** [statehoodBill.js:26](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:26) accepts `2026-02-30T12:00:00Z` because JavaScript normalizes it. **Fix:** validate calendar components before parsing, following the existing `useBillStats.js` implementation.

8. **NOTE — Recent additions lack the requested count.** [StatehoodBill.jsx:82](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/StatehoodBill.jsx:82) renders the recent list without a total, although PRD decision 5 requests one. **Fix:** display the count derived from `recent.rows.length`.

Verification: lint, production build, and diff whitespace checks passed. Production assets contained no fixture names, fixture IDs, fixture import path, or draft placeholder. Source inspection confirms labelled controls, arrow-key tabs, live result counts, focus styles, stacked rows at 600px, and a captioned scrolling history table. Browser verification was blocked by sandbox temporary-file permissions.

No source files were edited; Git status retained only the pre-existing untracked files.

**Verdict: Revise before release; roster completeness, Congress transitions, and historical-count integrity remain unresolved.**
