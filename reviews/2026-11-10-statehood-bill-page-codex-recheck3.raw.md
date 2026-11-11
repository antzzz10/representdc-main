<!-- codex exec -s read-only, model_reasoning_effort=high, focused recheck of HEAD~1..HEAD at 0725e25, run 2026-11-10. Final message only. -->

**Verdict: Revise before release—both residual MATERIAL findings are fixed; one NEW MATERIAL regression remains. No BLOCKER found.**

Reviewed only `HEAD~1..HEAD` at `0725e25`, using the pure functions and fixtures keyed `statehood-cosponsors`, `members-119`, and `statehood-bill-history`.

| Target | Result | Probe evidence |
|---|---|---|
| Same-state ID swap, including senators | **Fixed** | H005→H255 and AK senator S002→S052 both return `null` from `memberStatuses()`. Digit-bearing fixture names were preserved. |
| Stale bills with fresh roster | **Fixed** | October 31 bills with a November 10 roster return `null`; fresh controls produce 441 House / 100 Senate statuses. |
| Incomplete chamber in “No new cosponsors since” | **Fixed** | Fresh House + incomplete current Senate returns `null` from `signedThisMonth()`; the reverse also returns `null`. The page now passes all shown bills. |

**NEW MATERIAL — Valid name-order differences suppress the entire chamber lookup.**  
[surname(), line 33](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:33) takes the final token after removing punctuation. These same-person pairs pass both parsers with matching IDs and seats, but now make `memberStatuses()` return `null`; all returned statuses in the parent:

| Roster name | Bill name | Compared tokens |
|---|---|---|
| Nydia M. Velázquez | Velázquez, Nydia M. | `velazquez` / `m` |
| Donald M. Payne, Jr. | Payne, Donald M., Jr. | `payne` / `m` |
| Chris Van Hollen | Van Hollen, Chris | `hollen` / `chris` |

Congress.gov documents both [direct and inverted name orders](https://github.com/LibraryOfCongress/api.congress.gov/blob/main/Documentation/MemberEndpoint.md), making these realistic formats for one tracker’s inputs. Normalize name order before comparing surnames, preserving comma-delimited surname components and handling suffixes separately.

NOTE: Accent, capitalization, and suffix-punctuation variants passed.

NOTE: 24 focused assertions, changed-file ESLint, and code whitespace checks passed; full-diff whitespace check flags Markdown hard breaks in the saved review.

No edits or network writes occurred; pre-existing `.claude/launch.json` remains untouched.
