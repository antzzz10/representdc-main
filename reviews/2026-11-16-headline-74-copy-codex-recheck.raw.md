**0 BLOCKER; 1 new MATERIAL issue.** No files modified.

The five distinct findings across both previous reviews:

| Previous finding | Status | Evidence |
|---|---|---|
| Unconditional activity heading | **FIXED** | “Threats to D.C. home rule in this Congress” no longer asserts active movement at zero or after failure. |
| “Would override” includes enacted measures | **NOT FIXED** | Deliberately retained for the owner, as instructed; excluded from the verdict. |
| Missing explainer statistics source | **FIXED** | A bill-tracker source entry now appears at `HowCongressControlsDC.jsx:199–201`. Live destination verification was unavailable. |
| Counted unit left implicit | **FIXED** | The homepage now labels the count “bills, resolutions and budget riders.” |
| “Are tracked” narration and singular disagreement | **FIXED** | Removed. The explainer correctly renders “0 threats” and “1 threat.” |

**New MATERIAL — singular count label:** [Home.jsx:202](/private/tmp/claude-501/-Users-andriathomas-Projects-mervalabs-com/b69ea3cb-6c11-4386-89e1-c841f39c6b37/scratchpad/main-74/src/Home.jsx:202) now renders **“1 bills, resolutions and budget riders.”** Previously, the singular-aware label rendered “1 threat to D.C. home rule.” Keep a singular-aware count label and put the category list separately.

Other checks:

- **Count 0:** Grammar is correct; zero-valued status groups disappear.
- **Failed stats:** Homepage numbers become blank; counts, breakdown and checked date disappear. The explainer retains generic explanatory copy. No stale numbers appear, but failure remains indistinguishable from loading, with no unavailable message.
- **Changed copy:** No remaining em-dashes, process narration, “not X but Y” framing, or new duplicative hero text. Existing em-dashes elsewhere are outside this diff.

Verified through in-memory rendering at 0, 1, 74, loading and failure. All six existing bill-progress tests passed; diff whitespace check passed.

**Verdict: Fix the new singular count-label regression before publishing; the owner-reserved wording remains deferred.**