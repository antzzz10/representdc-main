# Bill-history archive: implementation plan

**Version:** v0.2, 2026-11-08 · Approved by Andria (answers recorded below); build in progress in `~/Projects/representdc-data` · Implements section C0 of `2026-11-08-value-updates-plan.md`. Codex's design review: `reviews/2026-11-08-bill-history-archive-codex-high.raw.md`.

## ✏️ YOUR INPUT GOES HERE

| # | Question | Your answer | My default |
|---|---|---|---|
| 1 | New GitHub repository for the archive. I prepare it locally; you OK the creation, and visibility stays yours to set by hand. Name? | **Yes** (2026-11-08) | `representdc-data`, created **private**; you make it public when ready to share |
| 2 | What to seed first | **Yes.** Next step after that: go back 10 years, covering her time on the DC Dems (114th–118th Congresses, 2015–2024) | The 134 measures the tracker has curated in the 119th Congress, plus earlier versions of the statehood bill (H.R. 51 and S. 51, 116th–118th) for the long view |
| 3 | Licence for RepresentDC's own labels when you share | **Defer the formal licence**, but document the methodology now and add basic terms, e.g. "public use allowed with acknowledgment and a link back to the site". Not her current priority | Decide later; facts are public domain either way |
| 4 | OK to add one small library (`fast-xml-parser`) to read the official XML? | **Yes** | Yes |
| 5 | Should the archive replace the tracker's own daily Congress.gov calls later, or only verify them? | **Yes, agreed.** She checked that the switch depends on the archive updating daily. It does: GovInfo refreshes current-Congress files every 4 hours, and the archive checks them daily | Verify first, for one month; switch later if the two agree |

## What the test run showed (2026-11-08, scratch folder only)

| | Result |
|---|---|
| Measures the tracker curates (all sections, incl. parked support bills) | **134**, all found in GovInfo's free bulk data |
| Official actions | 772 (max 53 on one bill) |
| Bills with more than 20 actions | **6**. Today's monitor reads only the first 20 actions per bill, so the archive closes a real gap |
| Cosponsor records | 1,054, with join and withdrawal dates |
| Bills with recorded votes | 15 |
| Text versions listed | 180 |
| Raw size | 7.1 MB |
| Not a bill | 1 (Senate amendment S.Amdt. 4253) needs Congress.gov's amendment endpoint |

**GovInfo needs no API key** and updates current-Congress files every 4 hours. So the archive can run without the tracker's secret key, which stays in GitHub only.

## Design

**Repository `representdc-data`:**

```
raw/          official BILLSTATUS XML, one per measure (latest); dated monthly snapshots as release assets
bills/119/hr/51.json      normalized record: metadata, every action, cosponsors, votes, text versions, subjects, related bills
labels/representdc.json   RepresentDC's editorial labels (oppose/support, category, attack type, priority, review dates, methodology version), kept separate from facts
families.json             links a bill across Congresses (e.g. "D.C. statehood admission": 116 H.R. 51 → 119 H.R. 51), reviewed by hand
exports/      CSV + JSON tables per dated release, with checksums and a change log
site/         small files the websites read: key-action timelines, monthly counts
```

**Every record carries:**
- its source URL;
- when it was fetched;
- the upstream update date;
- a checksum;
- the parser version.

When an upstream record changes, the normalized file is replaced and the old raw file is kept in the monthly snapshot. That way corrections are kept, not missed.

**Updates:**
- **Daily** (GitHub Actions, no key): read GovInfo's update sitemap, re-download only the measures whose files changed, re-normalize, commit.
- **Monthly:** a full check against the Congress.gov API (in the tracker's workflow, which has the key). Differences are reported, not silently overwritten.
- **New measures:** when the tracker's discovery adds a bill, the archive picks it up the next day.
- **Jan 3, 2027:** the 119th is frozen with its final outcomes, and the 120th starts. The archive is the record the tracker's Congress switch reads from.

**What it enables next:**
- **The timeline (section C):** built from `site/`, so the tracker page stays fast.
- **Trends:** for example, anti-D.C. bills introduced per month across Congresses, or how far bills got. Legislative events and RepresentDC relabelling are kept separate.
- **Sharing:** dated CSV/JSON releases that other orgs can use.
- **Cost and speed:** agents and scripts read local files instead of calling the API, and use no AI tokens.

## Build steps (after your answers)

1. Create the repo locally: ingester, normalizer, labels export, CSV export, README with methodology and the fact-vs-judgment split.
2. Seed the 134 measures, plus the statehood-bill history if you said yes.
3. Coverage report (bills, actions, cosponsors, votes, gaps), checked against the tracker's current statuses. Every mismatch is listed.
4. Codex review, medium and high.
5. Your yes, then create the GitHub repo (private) and add the daily workflow.

**Estimate:** about half a day of agent work for steps 1–4. Your time: answering the five questions, then one yes.
