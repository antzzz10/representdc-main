Reviewed `HEAD` (`9b307c4`). **Four MATERIAL findings; no BLOCKER findings.** No files modified.

1. **MATERIAL · (a) OVERSTATED** · `src/HowCongressControlsDC.jsx:87,107`  
   “Only on days Congress is in session” is misleading. Weekdays during short adjournments can count without either chamber meeting; weekends and holidays are excluded regardless. [D.C. Code § 1-206.02(c)(1)](https://code.dccouncil.gov/us/dc/council/code/sections/1-206.02).

   **Suggested:** “Excluding weekends, holidays and qualifying congressional recesses or adjournments.” For fuller precision, explain that the latter exclusion applies when neither chamber is in session during a recess or adjournment longer than three days, or after final adjournment.

2. **MATERIAL · (b) WRONG as an unconditional statement** · `src/HowCongressControlsDC.jsx:108`  
   A joint resolution is the correct mechanism. But timely passage and presentation to the President can be followed by enactment **after** review expires, repealing an act already effective. Presidential signature is also not essential: Congress can override a veto. [D.C. Code § 1-206.02(c)(1)–(2)](https://code.dccouncil.gov/us/dc/council/code/sections/1-206.02); [CRS IN12119](https://www.everycrsreport.com/reports/IN12119.html).

   **Suggested:** “Congress can pass a joint resolution disapproving the law. If it becomes federal law before review ends, the D.C. law cannot take effect. If enacted afterward, following timely passage and delivery to the President, it repeals the D.C. law. Congress can also override a presidential veto.”

3. **MATERIAL · (c) OVERSTATED** · `src/HowCongressControlsDC.jsx:109`  
   The **90-day limit is accurate**, but “the exception” implies an exhaustive rule. Budget measures submitted to the President follow a different process; charter amendments have a separate 35-day review. Also, “temporary legislation” is a distinct category, generally lasting up to 225 days and requiring congressional review. [§ 1-204.12(a), including editorial notes](https://code.dccouncil.gov/us/dc/council/code/sections/1-204.12); [§ 1-206.02(c)](https://code.dccouncil.gov/us/dc/council/code/sections/1-206.02); [§ 1-203.03(b)](https://code.dccouncil.gov/us/dc/council/code/sections/1-203.03).

   **Suggested:** Change the opening to “Most Council laws undergo congressional review before taking effect.” Then: “Emergency laws bypass this review and last up to 90 days. Charter amendments and federal budget requests follow separate procedures.”

4. **MATERIAL · (d) OVERSTATED** · `src/HowCongressControlsDC.jsx:131`  
   “Takes effect only when Congress approves it” omits local budget autonomy. The 2012 act, upheld locally in 2016 and followed by D.C. since then, provides for local budget enactment after passive congressional review. **Congress nevertheless continues approving, modifying or restricting the budget through appropriations.** Both facts matter. [D.C. Code § 1-204.46](https://code.dccouncil.gov/us/dc/council/code/sections/1-204.46); [Council’s explanation](https://dccouncil.gov/councils-battle-budget-autonomy-wins-substantial-victory-dc-taxpayers/); [CRS R49497, October 2026](https://www.everycrsreport.com/reports/R49497.html).

   **Suggested heading:** “Congress retains control over D.C.’s budget”  
   **Suggested copy:** “D.C. adopts its local budget under a budget autonomy law that provides for congressional review. Congress still approves the budget through federal spending legislation and can change it or restrict spending. The federal portion requires congressional appropriations.”

5. **NOTE · (e) ACCURATE** · `src/HowCongressControlsDC.jsx:157`  
   Complainant Lynn Povich’s firsthand account identifies Norton as their attorney and describes the March 1970 EEOC complaint. “Landmark” is supported by its significance for women throughout the news industry. **Keep the wording.** [Povich, *The Good Girls Revolt*, excerpt](https://longreads.com/2014/05/16/the-good-girls-revolt-when-46-women-sued-newsweek-for-discrimination-2/).

   Source limitation: Norton’s [official biography](https://norton.house.gov/about/full-biography) returned HTTP 403, so I could not independently verify its contents.

6. **NOTE · (f) ACCURATE** · `src/HowCongressControlsDC.jsx:48`  
   The Council’s history supports appointed commissioner government during this period. The revised label appropriately avoids claiming residents lacked every kind of ballot. **Keep the wording.** [Council’s home-rule history](https://dccouncil.gov/dc-home-rule/).

Copy check: headings use sentence case; there are no em-dashes or narration of the site’s editorial process. Two small **NOTES**:

- `src/HowCongressControlsDC.jsx:191,195`: source labels contain bare “DC.” Use “Council of the District of Columbia” and, to follow the requested punctuation rule, “ACLU of D.C.”
- `src/HowCongressControlsDC.jsx:96`: define the unfamiliar term briefly: “Appropriations rider: a provision added to a federal spending bill.”

**Verdict: Revise (a)–(d) before publishing; retain (e) and (f).**