# RepresentDC value updates: plan for review

**Version:** v0.2, 2026-11-08 (added C0, the permanent history archive, after Andria's question and a Codex check) · Proposal, nothing built · Covers all three sites. Findings come from a read-only check on 2026-11-08.

## ✏️ YOUR INPUT GOES HERE

| # | Question | Your answer | My default |
|---|---|---|---|
| 1 | Order of work | ___ | A (fix 404s), then C0 (history archive, seeded before the Jan 3 Congress switch), then B (Congress transition and support bills), then C (timeline, built on the archive), then D (org updates) |
| 1b | Archive in a separate data repository? (C0) | ___ | Yes. Creating a repo is an external write, so you'd approve it |
| 2 | Support bills: a separate `/support` page on the tracker, or a "120th Congress: bills to back" section on the main site? | ___ | Separate `/support` page, which was already the preferred shape when you parked them |
| 3 | Org updates: links only (org name, their headline, date, their own one-line excerpt), with no AI summary? | ___ | Yes: it's the creator-respecting version, and the Feed test |
| 4 | Run this in a separate session? | ___ | Yes, one session for A+B, then one for C+D. This session stays on Feed |
| 5 | Codex review before each change ships (production sites)? | ___ | Yes, medium and high passes per your policy |

## What I checked (2026-11-08)

- **All automation healthy:** the last 6 runs of bill monitoring, discovery, news fetch, freshness check and watchdog all succeeded. /news refreshed today; its AI summary passed its accuracy check.
- **Data gates pass** on the latest data: the lint and 27 golden labels show 0 warnings, and the 2 published claims check out. The tracker currently says 97 bills, 15 cleared a chamber, 4 law.
- **No console errors** on the home page, the bill tracker or the candidate tracker.
- **Housekeeping:** the local tracker checkout is 46 automated data commits behind GitHub. Pulling is safe; your uncommitted `WHATS-NEXT.md` edits and the guardrails draft are untouched.

## A. Bug: every sub-page returns "404 not found" (fix first, small)

Every page except the home page (`/news`, `/the-case`, `/myths-and-faq`, `/take-action`, `/about`, `/reading`, `/statehood-partner-map`, and `/party` and `/respond` on candidates) is served with HTTP status 404. It still displays, because GitHub Pages' 404 page redirects into the app.

**Why it matters:**
- Search engines treat these pages as missing and don't index them.
- Some link-preview and link-checking tools show the link as broken.
- There's also no `sitemap.xml`, and `robots.txt` returns 404.

**Fix:** at build time, write a copy of `index.html` into each route's folder (`/news/index.html` and so on), so each page is served with a 200 status. Then add a sitemap and a robots file. About an hour per site, with no visual change. Test: every route returns 200, and the browser check still renders each page.

## B. The 120th Congress: support bills, kept clearly separate (the forward-looking piece)

**Why now:**
- The 119th Congress ends Jan 3, 2027, and every pending bill dies with it. "This tracker follows 97 bills" becomes untrue that day unless the tracker archives them.
- Your pending guardrails question 1 (a separate archive for prior-Congress measures, outside active counts) has to be answered before January anyway.
- After the midterms, the new Congress makes pro-D.C. bills realistic again: H.R. 51 and S. 51 are usually reintroduced in January.

**Proposed shape:**
1. **Congress switch.** The active view shows the current Congress only. The 119th becomes a searchable archive with its final outcome on each bill: passed, enacted, or died at the end of the Congress. Counts reset and say which Congress they cover.
2. **Support bills on their own page (`/support`),** never on the attack list. They get their own colour and heading ("Bills to back"), and a link between the two pages.
3. **Fix what blocked revival:** the monitor never scanned support bills, so their data has drifted (H.R. 51 was already stale). Extend the scan, check the priority logic for support bills, then add discovery for 120th-Congress reintroductions.
4. **"What to watch in the 120th Congress":** a short, dated list of expected reintroductions (statehood, budget autonomy, legislative home rule). Each entry is marked "expected" until it has a bill number. That's the forward-looking signal, kept truthful.

**Needs your decisions:** guardrails questions 1–4 in `dc-bills-tracker/PUBLIC-LISTING-GUARDRAILS-DRAFT.md`. My recommendation on question 1 is the archive.

## C0. Permanent bill-history archive (added v0.2: Andria's question, confirmed by Codex)

**Andria, 2026-11-08:** why not store the full Congress.gov histories permanently, for trends, for sharing an authoritative statehood and home-rule dataset with other orgs, and to stop re-fetching everything except for verification?

**Answer: yes.** Codex (high, 0 BLOCKER, 6 MATERIAL, 2 NOTE; raw output in `reviews/2026-11-08-bill-history-archive-codex-high.raw.md`) agrees. Today's 30-check log is for monitoring, not history: it keeps 30 runs of selected status fields and no full action lists. The archive becomes the foundation for the timeline (C), trends, and sharing.

**Design (Codex's recommendations, accepted):**
- **What to store, for every curated measure, its companion bills, and the bill each rider attaches to:**
  - official metadata;
  - every action;
  - cosponsors with the dates they joined or withdrew;
  - recorded votes;
  - a list of text versions.

  Today's monitor checks only the main bill list and each entry's first number. It also fetches actions without pagination, so it sees only the first 20.
- **Three layers:**
  1. raw official responses, unchanged;
  2. a normalized record per bill, filed by Congress, type and number;
  3. small generated files the website reads.

  Each record carries its source URL, when it was retrieved, when it was last updated upstream, and a checksum.
- **Where it lives:** a separate data repository, with compressed raw archives as versioned release assets. That keeps the tracker's daily commits and page size clean (both are existing rules).
- **Updates:**
  - **Seed once.** GovInfo's bulk BILLSTATUS XML is a strong source for this.
  - **Then daily:** fetch only bills changed since the last run.
  - **Full checks against Congress.gov:** monthly for the current Congress, quarterly for past ones.
  - **No AI tokens:** this is plain code; agents query the stored data.
- **Corrections:** keep each record current when Congress.gov corrects it, and keep every prior raw version. Identify bills by Congress, type and number. A reintroduced H.R. 51 is a new bill, linked to the old one through a reviewed "policy family".
- **Sharing:** the official facts are public domain. RepresentDC's oppose and support labels, attack types and priorities are editorial, so they're published as a separate table with methodology, review dates and a license. Release it as dated JSON and CSV with change notes, and describe it as "official-source, curated", not government-certified.
- **Limits:**
  - **No back-filling what we knew then:** a backfill can't recreate what was known at past dates, though older monitoring states are partly recoverable from git.
  - **Trends need two kinds of change kept apart:** trend charts must separate legislative events from RepresentDC changing its own labels.

**Was it asked before?**
- **No recorded decision** on a permanent archive or data sharing, according to Codex and my own search of decisions, docs, commit messages and past session transcripts.
- **Related records exist:**
  - **July 11:** the "accelerating" trend claim was cut because no history existed to support it.
  - **The 30-check cap:** it came with the first monitoring script (Nov 2025) and was never a deliberate decision.
  - **Prior-Congress archive:** it's already the recommended answer to guardrails question 1.

## C. Timeline of bills and key actions

**The data gap:** the tracker keeps only 30 days of status snapshots, so a real timeline needs each bill's action history from Congress.gov (the `actions` endpoint, using the API key the tracker already has).

**Proposed:**
- **On each bill card:** a compact timeline of key actions only (introduced, committee referral, hearing, markup, floor vote, passed a chamber, became law), each with its date and a Congress.gov link. Routine actions are left out.
- **One overview chart** at the top: bills introduced and bills that advanced, by month, across the Congress. It shows pace and progress at a glance, and the 119th-to-120th switch is visible.
- **Constraints the tracker already has:** store this in a separate file fetched on change only, not in `bills.json`, so the data doesn't churn daily or bloat the page. Both rules are in `WHATS-NEXT.md`.

## D. Updates and events from statehood organisations (the light Feed test)

**What exists:** /news already pulls DC Vote, ACLU DC, LWV DC and news outlets, with one AI summary on top.

**Feeds checked 2026-11-08:**

| Org | Feed | Freshness |
|---|---|---|
| DC Vote | News RSS | Fresh (Nov 4) |
| ACLU DC | News RSS and events RSS | Fresh (Oct 27 and 28); covers many topics, so needs a statehood filter |
| Free DC | Events JSON, 50 items | Live |
| Fair Budget Coalition | Events RSS | Fresh (Nov 13 event); statehood-adjacent |
| Together for DC, Mayor's office | RSS | Stale (April) |
| Neighbors United (the51st.org), statehood.dc.gov, Rep. Norton | RSS | Stale (2017–2022) |
| DC Appleseed, DCFPI, Statehood Compact, PAC, Pledge, Scorecard, DC Dems, Anacostia CC | None found on common paths | — |

**Proposed:** a section called "From the organizations doing the work" on /news (or the Take Action page, per the existing matcher PRD). Each entry shows:
- the org's name;
- the org's own headline or event title and date;
- the org's own one-line excerpt, if their feed includes one;
- a link to their page.

No AI summary or rewriting. Events show only future dates, and past events drop off. Each org links to its own sign-up page.

**What makes it a Feed test:**
- Add one cookieless event, `org_link_opened`, which fits the existing analytics policy. You'd see how often RepresentDC sends people to each org.
- This is the creator-respecting pattern (find and route, don't replace), on one issue.
- Ask DC Vote and Free DC whether they're happy to be listed this way. That doubles as an org-side interview.

**Gaps to name on the page or in outreach:** DC Dems' events live on Mobilize. Its public API needs the organization's ID, which isn't confirmed yet. Half the orgs have no feed, so the section shows only orgs that publish one, and says so in a footnote, not a disclaimer.

## Suggested sessions

- **Session 1, A+B:** 404 fix and sitemap; Congress switch and archive; support page. Gated on your guardrails answers.
- **Session 2, C+D:** timeline data and display; org updates section.
- Each session plans first, gets Codex review, shows you a local preview, and deploys only on your yes.
