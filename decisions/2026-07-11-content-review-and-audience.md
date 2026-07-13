# Decision: Content review findings and audience-separation approach

**Date:** 2026-07-11
**Context:** Phase 2 of the `WHATS-NEXT.md` roadmap — full content review of the main
site, plus deciding how representdc-main should relate to dc-statehood-pledge given
they serve different audiences (broad statehood-sympathetic public vs. D.C. voters
specifically).

## Audience approach: keep sites separate, improve signposting

Confirmed by comparing actual copy: dc-statehood-pledge is unmistakably written for
**D.C. voters** — primary election date, office/party filters, candidate-questionnaire
mechanics, "before you vote" framing throughout. representdc-main is written for
**anyone sympathetic to the cause**, nationally, with no electoral mechanics at all.

**Decision:** keep each site's voice as-is rather than unify them or build D.C.-resident
content directly into the main site. Instead, make sure the main site signals clearly,
before a visitor clicks through, that the candidate tracker is a D.C.-voter/election
tool, not a general advocacy page like the rest of the site.

**Why:** dc-statehood-pledge is explicitly time-boxed to a specific election cycle and
will likely get repurposed or archived after it; representdc-main is evergreen
advocacy. Unifying voice risks diluting the sharp, effective voter-urgency copy on the
pledge site for no real benefit, and building resident-specific content into the main
site duplicates a job the pledge site already does well.

**Implemented:**
- Footer link: "Candidate tracker" → "Candidate tracker (for D.C. voters)"
- Nav link: added a `title` tooltip ("For D.C. voters — 2026 primary candidate
  positions on statehood") rather than lengthening the visible nav label, since nav
  space is tight with six items already

## Content review findings and fixes

Four concrete issues found reading the full main-site copy critically, all fixed
directly (not just flagged) per the decision to fix rather than walk through
individually:

1. **Values section read as a disconnected interlude.** Sat between two concrete,
   evidence-driven sections (category examples above, trend stats below) with no
   bridge — pure abstraction dropped into an otherwise concrete page. Not restructured
   (still three value cards), but see #3 below for the specific wording fix.

2. **Trend section didn't show a trend.** Claimed "this isn't new—but it's
   accelerating" while displaying `{totalBills}` and `{pendingBills}` — the same
   numbers already shown in the Facts section above, with no year-over-year comparison
   or other evidence of acceleration. **Fixed:** reframed as "Not stalled—actively
   moving through Congress," now showing `{passedBills}` (already passed a chamber) vs.
   `{pendingBills}` (still pending) — a genuinely different cut of the data (movement
   through the legislative process) instead of a repeated total, and a claim ("actively
   moving") the numbers actually support instead of an unverifiable "accelerating"
   claim `DEVELOPMENT-GUIDELINES.md` wouldn't let us source anyway.

3. **"Local control" duplicated verbatim** as both a Values card title and a Solution
   point title. **Fixed:** renamed the Values card to "Self-governance" — same
   underlying idea (Americans governing their own communities), distinct phrasing from
   the Solution section's concrete "Local control" mechanism (Congress can't overturn
   D.C. laws post-statehood).

4. **Inconsistent, occasionally partisan-adjacent naming of office-holders** in
   `categoryDetails.js`, despite `STRATEGY.md`'s explicit "no party labels" rule:
   - "Trump administration" (traffic category, critical framing) → "the executive
     branch" (×2 instances)
   - "House Republicans passed a continuing resolution" (budget category) → "the House
     passed a continuing resolution" — this one was a direct party-label mention, a
     clearer rule violation than the presidential naming
   - "President Trump publicly urged the House to approve it" (budget category,
     supportive framing) → "the White House publicly urged the House to approve it"

   **Standing rule going forward:** name Congressional bill sponsors specifically
   (normal legislative-tracking practice, already done correctly elsewhere — e.g. Rep.
   Nancy Mace, Rep. Scott Perry) but refer to the executive branch institutionally
   ("the executive branch," "the White House," "the administration") rather than by a
   sitting president's name, regardless of whether the mention is critical or
   supportive of D.C.'s position. Document this in `DESIGN-GUARDRAILS.md` if the
   pattern recurs.

## Next step
Phase 2 of `WHATS-NEXT.md` is complete. Phase 3 (dc-bills-tracker token rollout) is
next per the roadmap, and can run independently of anything above.
