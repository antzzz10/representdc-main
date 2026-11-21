# News scan: how well it finds statehood coverage, and how to fix it

**Version:** v0.1, 2026-11-21 · Assessment and proposal. Nothing is changed, pushed or deployed.

## ✏️ YOUR INPUT GOES HERE

| # | Decision | Recommendation | Your answer |
|---|---|---|---|
| 1 | Build fixes 1 to 4 below (keep articles, repair feeds, raise the limit, show the summary) | **Yes.** These explain almost all of what you saw | ___ |
| 2 | Add outlets with working feeds (list in section 4) | **Yes, all nine** | ___ |
| 3 | How to reach AP and Reuters | **Their news sitemaps**, tested first. Not Google News | ___ |
| 4 | Google News search as a source | **Private weekly check only.** Its terms forbid anything but personal reader use | ___ |
| 5 | How long an article stays on /news | **30 days, up to 15 shown** (today: 5, and only while the outlet's feed still lists it) | ___ |

## 1. What I found

Checked against the code, 89 run records, the live data file and ten Google News searches.

**The scan has no memory.** Every run rebuilds the page from whatever each outlet's feed lists at that moment. When an article scrolls out of the outlet's feed, it leaves our page. That takes about 9 hours for Roll Call, under 3 days for the Washington Informer and about a day for The Hill. DC Vote and ACLU DC feeds reach back months, so they fill the page.

- 15 news articles from the last 30 days were judged relevant at some point. **None is on the page today.**
- The page shows 5 items, all from DC Vote and ACLU DC. The newest is November 4.

**The summary exists but the page hides it.** A summary was written and passed its check this morning. The page hides any summary when the newest article shown is more than 14 days old (a rule added in October so stale news is never described as recent). The newest is 17 days old, so it has been hidden since about November 18. The rule is right; the missing articles are the cause.

**Your four examples**

| Article | What happened |
|---|---|
| Washington Informer, "Election Shakeup Revives D.C.'s Fight for Statehood" | Found and shown November 4 to 9, then dropped when the Informer's feed moved on |
| Roll Call, "Can DC's new delegate get Congress to care about statehood?" | Shown for one run, gone 9 hours later |
| AP, "First new DC delegate since 1991..." | Never seen. AP is not a source, and its feed refuses automated readers |
| ACLU of DC, "Statehood is More Important Than Ever" | In the feed, but dated August 5, past the 60-day limit for organizations |

**Against Google News.** Ten searches, last 30 days, 50 distinct articles (a floor: Google returns about 20 per search).

- 0 are on our page.
- 2 came from outlets we scan. Both were shown, then aged out.
- 48 came from outlets we do not scan. About 7 of those are noise.
- Most missed: WUSA9 (7), GW Hatchet (4), then Washington Post, Axios, WTOP, HillRag, City Cast and FOX 5 (2 each).

**Other faults**

- **Roll Call's feed has returned "not found" since November 18.** No alert fired, because the health check passes if any one feed works. A working address exists.
- **League of Women Voters DC has been blocked in all 89 runs.** The Washington Sun feed now carries 1 item, down from 30.
- **The limit of 5 articles was hit in 37 of 84 runs.**
- **The relevance check reads titles only, and is unsteady.** 30 of 46 relevant items were judged differently from one run to the next. Clear statehood headlines always passed.
- **Runs start 5 to 8 hours late** on GitHub's schedule, with gaps of up to 15 hours. That matters only because of the missing memory.

## 2. What good practice says

From vendor guides, published research and the services' own terms (sources in the private research note).

1. **Cast a wide net, then filter.** Discovery and judgement are separate steps. A fixed feed list can only see the outlets on it.
2. **Search by several narrow queries**, not one: "D.C. statehood", "51st state", "Home Rule Act", "Washington, D.C. Admission Act", "H.R. 51", "shadow senator", rider language.
3. **Grade relevance** (central, substantial, passing, off-topic) on title plus description, and send "unsure" to a review list instead of dropping it.
4. **Judge each article once and keep the verdict.**
5. **Merge copies of the same wire story** and link the original outlet.
6. **Measure it.** Each week, compare with an independent search and record what was missed. Alert when any single source goes quiet.
7. **Show automatically only from a list of known outlets.** Unknown sites wait for review.

## 3. Proposed fixes, in order

| # | Fix | What it solves | Size |
|---|---|---|---|
| 1 | Keep a record of every relevant article; show the last 30 days | Articles vanishing; the hidden summary | About half a day |
| 2 | Repair Roll Call's address; alert on any single feed failing for 2 days | Silent feed failures | 1 to 2 hours |
| 3 | Show up to 15, with news and organization updates listed separately | DC Vote crowding out news | 2 to 3 hours |
| 4 | Judge once per article, on title plus description, with the graded scale | Unsteady verdicts | About half a day |
| 5 | Add outlets (section 4) and merge duplicate wire stories | The 48 missed articles | About half a day |
| 6 | Weekly private comparison with Google News, logged | Knowing the miss rate from now on | 2 to 3 hours |

Sizes include tests and the two Codex passes. Each fix changes the live site, so each ships only on your yes.

## 4. Outlets to add

**Feeds that answered today:** Washington Post (local and politics), WAMU, Politico (Congress), WUSA9, WTOP, Axios (national), GW Hatchet, NBC Washington, FOX 5.

**Blocked or gone:** AP, Reuters, Axios D.C., States Newsroom, DCist, City Cast.

**AP and Reuters.** Both publish a "news sitemap", a list of everything from the last two days. It has not been tested for our use yet. Google News search is the only route to AP confirmed so far, but its feed says it is for personal reader use only, so I recommend it as a private check and not as a source.

## 5. Not verified

- Whether the relevance check would have accepted the AP headline (no paid call was made).
- Whether AP and Reuters sitemaps work from GitHub's servers.
- The page was checked through its live data and published code, not in a browser.
