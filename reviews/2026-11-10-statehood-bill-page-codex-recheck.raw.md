<!-- codex exec -s read-only, model_reasoning_effort=high, focused recheck of HEAD~1..HEAD at 1889b63 (fixes for the medium/high/attack findings), run 2026-11-10. Final message only. -->

**0 BLOCKER; two MATERIAL finding groups remain partly fixed. No new BLOCKER or MATERIAL regression reproduced.**

Reviewed only `HEAD~1..HEAD` at `1889b63`. Final probes loaded committed files directly. `WHAT_IT_IS` is excluded as requested. References below use **M** = medium, **H** = high, **A** = attack pass; line numbers refer to HEAD.

| Earlier MATERIAL finding | Disposition | Evidence |
|---|---|---|
| M1 / H1: roster cannot advance Congress | **Fixed** | `src/hooks/useStatehoodBillData.js:63`: actual hook execution fetched `members-119` normally and both `members-120` and `members-119` for independently transitioning chambers. |
| M2 / H4: archived data overwrites final history | **Fixed** | `src/data/statehoodBill.js:334`: final **210** remained **210** against archived **209**. Provisional rows update only from current, complete bills. |
| M3 / H2: truncated roster accepted | **Fixed** | `src/data/statehoodBill.js:211`: one retained member with unchanged published counts was rejected. |
| M4 / H3 / A4: false non-voting subtotal | **Fixed** | `src/data/statehoodBill.js:140`: subtotal is derived from House seats; incorrect House and nonzero Senate subtotals were rejected. |
| M6 / H5 / A7: stale month and freshness claims | **Partly fixed** | `src/data/statehoodBill.js:289`: October additions correctly disappear in November. Stale empty-state claims and roster freshness remain unresolved; details below. |
| A1: off-site links impersonate official sources | **Fixed** | `src/data/statehoodBill.js:59`: credential-bearing Congress.gov spoof rejected; off-site member and history links removed. |
| A2: inconsistent identities produce wrong statuses | **Partly fixed** | `src/data/statehoodBill.js:84`: padded IDs normalize and canonical duplicates reject. Same-state identity conflicts still pass; details below. |
| A3: sponsor inflates cosponsor count | **Fixed** | `src/data/statehoodBill.js:133`: adding the sponsor as a cosponsor rejected the payload. |
| A5: unknown Congress bypasses roster protection | **Fixed** | `src/data/statehoodBill.js:184`: missing, string, and mismatched Congress metadata reject; bare arrays also reject. |
| A6: chamber conflicts turn representatives into senators | **Fixed** | `src/data/statehoodBill.js:103`: chamber, number prefix, and official bill URL must agree. Contradictory chamber rejected. |
| A8: impossible chronology | **Fixed** | `src/data/statehoodBill.js:45`, `:127`, `:134`: February 30, future sponsorship, and pre-introduction sponsorship probes rejected. |
| A9: contradictory/duplicate history | **Fixed** | `src/data/statehoodBill.js:219`, `:231`: whitespace canonicalizes, **999** cosponsors rejects, duplicate Congress rows reject. |

The remaining failures are:

- **MATERIAL — Wrong same-state member receives “Signed on.”** At [src/data/statehoodBill.js:315](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:315), the cross-file check compares only state. Replacing fixture **H005, CA-1**’s ID with unsigned **H255, CA-6**’s ID passed both parsers. Lookup marked H255 signed and H005 “Not yet,” while the cosponsor list retained H005’s name. **Fix:** reconcile overlapping IDs against compatible identity and seat information before assigning statuses.

- **MATERIAL — Stale observations still become current claims.** At [src/StatehoodBill.jsx:80](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/StatehoodBill.jsx:80), an October 31 snapshot viewed November 10 produces **“No new cosponsors since October 9, 2026.”** It cannot establish what happened after October 31. Separately, [src/data/statehoodBill.js:213](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:213) discards `generatedAt`; a January 2025 roster still produced **441** current-looking House statuses. **Fix:** qualify empty-state claims by checked date and covered chambers; preserve roster freshness and label or suppress stale lookup results.

For the requested regression checks, the supplied real-format Bioguide IDs, `https://norton.house.gov/`, `https://www.vanhollen.senate.gov/`, and the exact Congress.gov bill URL all passed. No whole-page crash occurred. An invalid chamber still rejects the entire cosponsor file and prevents roster fetching; that whole-file rejection predates this fix.

**NOTE:** Bare-array rosters, described as contract-permitted in A5, now reject rather than receive endpoint provenance. Live-feed compatibility with that format was not verified.

Twenty-five pinned checks and the mocked React hook probes passed; lint passed. No edits or network writes occurred. A concurrent uncommitted source edit was excluded.

**Verdict: Revise before release—the identity and freshness findings remain partly fixed.**
