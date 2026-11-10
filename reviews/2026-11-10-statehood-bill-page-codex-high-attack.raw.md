<!-- codex exec -s read-only, model_reasoning_effort=high, diff b9ea616..09104ac, run 2026-11-10. Prompt: attack-frame. Final message only. -->

I reproduced **9 MATERIAL findings and 2 NOTEs; no BLOCKER findings** in `b9ea616..09104ac`. The attacks below were exercised against the production bundle in JSDOM. Example people are synthetic; inputs are mutations to otherwise contract-valid JSON.

1. **MATERIAL — Off-site links impersonate official sources.**  
   **Input:** Set `congressGovUrl` to `https://www.congress.gov@evil.example/phish`, a member’s `officialWebsiteUrl` to `https://evil.example/member`, and a historical bill’s `url` to `https://evil.example/archive`.  
   **Public output:** All reach `href`s labeled “Congress.gov,” “Official website,” or “govinfo.gov.” The cosponsors citation also points to the attacker’s host.  
   **Fix:** Validate hostname, credentials, and expected paths separately for each link type. HTTPS alone establishes no official affiliation. [URL validation](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:30)

2. **MATERIAL — Inconsistent person IDs produce wrong statuses and duplicate counts.**  
   **Input/output:** Three successful variants:
   - Change Alex’s cosponsor ID from `"A000001"` to `"A000001 "`. Alex appears in recent sign-ons **and** as **“Not yet.”**
   - Append Alex again using the padded ID and increment the total. The page shows **3 cosponsors instead of 2** and lists Alex twice.
   - Give Alex’s cosponsor row Jordan’s roster ID, retaining Alex’s name and CA seat. Recent sign-ons name Alex, while lookup shows **Jordan, FL-4 — “Signed on Nov 2, 2026”** and **Alex — “Not yet.”**
   
   **Fix:** Canonicalize and validate IDs before deduplication and joining. Reject contradictory identity/seat information for overlapping IDs across files. [Person parsing](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:41)

3. **MATERIAL — The sponsor can inflate the cosponsor count.**  
   **Input:** Append the House sponsor to `cosponsors` with a valid sponsorship date; increment `totals.cosponsors` and `totals.nonVoting`.  
   **Public output:** **“3 cosponsors”** where there are two actual cosponsors, plus Eleanor Holmes Norton appearing among recent cosponsor sign-ons.  
   **Fix:** Reject any cosponsor whose canonical ID equals the sponsor’s ID. [Count validation](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:92)

4. **MATERIAL — Non-voting totals need not match the people counted.**  
   **Input:** For a House list containing one voting representative and one Puerto Rico member, set `nonVoting: 2`; for a Senate list containing one senator, set `nonVoting: 1`.  
   **Public output:** House: **“Including 2 non-voting members.”** Senate: **“Including 1 non-voting member.”**  
   **Fix:** Derive and verify this subtotal from validated seats; require zero for Senate bills. Currently only the upper bound is checked. [Subtotal validation](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:96)

5. **MATERIAL — Unknown roster Congress bypasses the mismatch protection.**  
   **Input:** Supply roster `congress: "120"` as a string alongside 119th-Congress bills. Alternatively, supply the contract-permitted bare 119th roster array alongside a House bill marked `congress: 120, current: true`.  
   **Public output:** Both rosters receive definitive “Not yet”/“Signed on” statuses. In the second variant, the page announces **“120th Congress”** while using the old roster and displaying a Senate bill still marked current in the 119th. A correctly typed numeric mismatch *does* suppress lookup.  
   **Fix:** Reject malformed Congress metadata. Assign bare arrays explicit provenance from the `members-119.json` endpoint rather than treating unknown Congress as universally compatible. Validate current-bill Congress consistency. [Lookup gate](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/components/MemberLookup.jsx:29)

6. **MATERIAL — Chamber conflicts turn House members into senators.**  
   **Input:** Keep only the House bill, change its `chamber` to `"senate"`, and retain `billNumber: "H.R. 51"` and its House URL and people.  
   **Public output:** **“Senate · H.R. 51,” “Sen. Eleanor Holmes Norton,”** and Senate titles for House cosponsors.  
   **Fix:** Require agreement among chamber, parsed bill-number prefix, and official URL identity. An explicit chamber currently overrides contradictory evidence. [Chamber selection](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:54)

7. **MATERIAL — Stale data changes the meaning of “this month.”**  
   **Input:** On November 10, give both bills `checkedAt: "2026-10-31T18:10:00Z"` and sponsorship dates of October 20.  
   **Public output:** October sign-ons appear under **“Signed on this month.”** The hero still says **“checked daily,”** although the count cards truthfully show the October check. Separately, roster `generatedAt: "2025-01-01T00:00:00Z"` is ignored and the roster remains presented as current.  
   **Fix:** Name the snapshot month explicitly or use the actual current Eastern month. Preserve freshness metadata and mark or suppress stale lookup data. [Month calculation](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:224)

8. **MATERIAL — Valid-looking dates can assert impossible chronology.**  
   **Input/output:** With a November 9 check, `sponsorshipDate: "2026-11-30"` produces **“Signed on Nov 30, 2026”** and appears in recent sign-ons. A `"2024-11-02"` sponsorship date is accepted for a bill introduced January 2025. Also, `checkedAt: "2026-02-30T18:10:00Z"` passes validation and renders **“Last checked March 2, 2026.”**  
   **Fix:** Validate timestamp calendar components strictly and enforce introduction ≤ sponsorship/action date ≤ applicable check date. [Timestamp validation](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:26)

9. **MATERIAL — Historical counts can contradict the headline and themselves.**  
   **Input:** Give the 119th history row `billNumber: "H.R.  51"` and `cosponsors: 999`, while the live bill is `"H.R. 51"` with two cosponsors.  
   **Public output:** The headline shows **2**; the same Congress’s history shows **999** because whitespace defeats reconciliation. A second accepted variant duplicates the 118th row with a conflicting total; both rows render.  
   **Fix:** Join by canonical bill identity, enforce unique Congress rows and chamber-appropriate count bounds, and reject unresolved live/history conflicts. [History reconciliation](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:263)

10. **NOTE — Courtesy titles accept contradictory seat information.**  
    **Input:** Change Norton’s sponsor state to `"DC "`; separately set a Puerto Rico roster member’s `votingMember` to `true`.  
    **Public output:** **“Rep. Eleanor Holmes Norton”** and **“Rep. Pat Example, PR,”** while the recent-sign-on row still calls Pat **“Res. Comm.”**  
    **Fix:** Trim and validate state codes and reject seat/voting-status contradictions. [Title derivation](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/data/statehoodBill.js:195)

11. **NOTE — Missing historical bills become an affirmative introduction claim.**  
    **Input:** A history row with Congress/year metadata, both bill fields omitted, and `furthestAction: null`.  
    **Public output:** An otherwise empty Congress row confidently says **“Introduced.”**  
    **Fix:** Require at least one identified bill before rendering the row or inferring introduction. [History rendering](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/statehood-bill-page-b7961e/src/StatehoodBill.jsx:122)

Verification: `npm run build` and lint passed. The resulting `dist` contains the route and no fixture names, fixture URLs, or placeholder paragraph. A fixture-enabled production build performed in memory also omitted them. HTML payloads rendered as escaped text; `javascript:`/`data:` URLs were rejected or removed. Across 364 malformed-value checks, no parser/derivation crash occurred. Date-only rendering stayed January 3 in Honolulu and Tokyo. I found no static copy implying party alignment or forecasting passage. Tracked files and pre-existing untracked work remain unchanged; no commits, pushes, or network writes occurred.

**Verdict: Fix the MATERIAL validation and provenance gaps before publishing `/statehood-bill`.**
