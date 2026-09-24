# News summary — evaluation plan (accuracy and recency)

**Status:** **Built, uncommitted, 2026-09-15.** Read the 2026-09-15 amendment at the end
first: the judge now gates publication, and there is no standing human review. Layers 4
and 5 below describe the superseded design and are kept as the reasoning trail.
**Companion:** `NEWS-AND-ANALYSIS-PRD.md`.

## Is there an existing eval plan?

No, not for the news summary. Two related pieces exist, and neither covers it:

- The **Phase 4 accuracy eval pipeline** (`WHATS-NEXT.md`,
  `decisions/2026-07-12-persona-picker-and-statehood-curious.md`) is a trusted-domain
  allowlist gate plus an LLM citation-support check. It was designed for site-authored
  claims that carry citations. The news summary has no citations; its only source is
  the headlines. It was never built.
- **`dc-bills-tracker/scripts/eval/golden-labels.json`** is a golden file for bill
  classification, enforced by `lint-bills.js`. This plan borrows that pattern: a
  hand-labeled golden file, checked in, with a script that fails on drift.

## What we're protecting against

The history is the bill tracker's `news.json` git log: 241 versions since 2026-04-29,
53 distinct headline sets, and about 55 runs since the closing-sentence change on
2026-08-14. The known errors come from two partial reads (Claude's, then Codex's), **not
a labeled pass, so treat them as a floor.**

| # | Failure mode | Known cases since 2026-08-15 | Caught by |
|---|---|---|---|
| F1 | Invented specific (date, number, name) | "events in January 2021" (Sept 5) | G2 (numbers), J1 (names) |
| F2 | Unsupported inference (outcome, duration, actor) | Deployment "lasted a year" (Aug 26) | J1 only; no deterministic check |
| F3 | Wrong legal claim in the closer | "Congress … deploy federal troops" (Aug 25, Sept 10) | **Prevented by design** (PRD B1), not detected |
| F4 | Legal claim in the body | None known | J2 |
| F5 | **Decided matters described as still pending**, or a contradicted date or duration (rescoped 2026-09-12 — ordinary present tense within ~2 months is not a failure) | None confirmed under the new bar; the Aug 29 "currently considering" (39 days) is now acceptable | Prompt fix (PRD B3), J3 |
| F6 | Advocacy claim asserted by the site rather than attributed | Not measured | J4 |
| F7 | Irrelevant article passes the filter | Not measured | Filter set |
| F8 | Feed stale, or healthy-looking despite source failures | Not measured; today's script hides both | G5, R1 |

## Layer 1 — pre-publish gates (every run, deterministic)

| Gate | Check | On failure |
|---|---|---|
| G1 | Closing key in the approved set; the code appends the sentence | Retry once, then `general` |
| G2 | Every year, number, dollar amount, or percentage in model-written text appears in a published headline. Narrow by design: catches F1 numbers only | Retry once, then `summary: null` |
| G3 | One paragraph, ≤90 model-written words, no markdown or preamble | Retry once, then `summary: null` |
| G4 | 0–5 articles; each has an https link, title, source, and a parseable date **not in the future**. The summary was generated from exactly this set | Don't publish; fail the run |
| G5 | Source health: at least one source returned a **valid parsed feed** (RSS or Atom root and channel; HTML-with-200 counts as failed); each source's status is recorded | All failed: don't publish, fail the run. Some failed: publish and log |
| G6 | Filter output is a JSON array of in-range integer indices | Retry once, then fail the run and keep the last file |

Zero relevant articles counts as **healthy-empty** only with valid feeds and a valid
filter verdict (see PRD A). Fixtures cover HTML-with-200, malformed RSS, a valid empty
feed, and malformed filter output.

## Layer 2 — recency

| Metric | Definition | Where it acts |
|---|---|---|
| R1 feed freshness | Age of `lastUpdated` on the **live URL** (not the branch) | Page hides the summary past 72h. A failed run emails the owner from `noreply@representdc.org`. A watchdog in `dc-bills-tracker` alerts if nothing has published in ~36h (decided 2026-09-15) |
| R2 content recency | Newest article's age; share older than 30 days; per-source failure rate | Recorded in each run's artifact. **No weekly report — that obligation was dropped on 2026-09-15**; read the artifacts if a question arises |
| R3 temporal claims (revised) | Present-tense or "current/ongoing/recent/today/this week" claims checked against **the date of the article they rest on**, not the newest article | J3 in the judge. The prompt fix (PRD B3) helps but is **not sufficient** — see below |

**Evidence that R3 needs the judge, not just the prompt (2026-09-12).** The first dry run
of the ported pipeline, with dates and ages in the prompt, still produced "ongoing
restrictions on how DC can use its budget" from a headline dated July 21 — 52 days old.
Milder than the August 29 "currently considering", and the rest of the body was clean and
properly attributed, but the same failure mode. That run is a golden case, and "ongoing"
belongs in J3's phrase list.

## Layer 3 — offline regression suite (`npm run eval:news`)

Run before any prompt change, model change, or new feed source.

- **Golden set** `scripts/eval/news-golden.json`: about 30 cases. Each case lists its
  headlines with dates, the acceptable closing keys, forbidden content notes, and an
  **expected outcome** (`summary` / `withheld` / `empty`).
  - Real sets: drawn from the 53 in history, including the five known-error runs.
  - Adversarial: a single headline; headlines containing numbers; off-topic headlines
    (expect `empty`); mixed ages (expect past tense for old items); Guard; budget; no
    clean mapping (expect `general`).
  - **Semantic counterexamples:** swapped actors, invented outcomes, wrong durations
    ("lasted a year"), and legal claims in the body.
  - Claude drafts the labels; Andria approves them.
- **Filter set:** about 40 titles labeled relevant or not. Reconstruct rejected titles
  from retained Actions logs (`fetch-news.js` prints every input title); after the
  move, each run's artifact records the filter's verdicts.
- **Frozen evaluation time:** each case carries an `asOf` timestamp, and generation and
  judging use it as "now". Recency labels don't drift as the fixtures age.
- **Runs:** each case three times, because output varies. Accuracy and availability
  are measured separately (v3), so neither can hide the other:

| Metric | Denominator | Launch bar |
|---|---|---|
| **Factual errors** in published summaries (F1–F6), human-confirmed. **A person reads every published golden output**, including ones the judge approved | All published golden outputs | **0** |
| **Must-not-summarize correctness:** no summary where the case expects `empty` or a failure; no publish on invalid ingestion | Cases expecting `empty` / failure | **100%** |
| **Availability:** summary published (not withheld) | Cases expecting a summary | ≥80% (the approved 20% ceiling) |
| First-attempt gate pass rate; retry recovery rate | All generation attempts | Reported, not gated |
| Closing-key choice in the acceptable set | Published summaries | ≥90% |
| Filter precision / recall | Filter set | Precision ≥90%; recall reported |

- Every run records the model ID, prompt version, and all raw attempts, so any result
  can be reproduced.

## Layer 4 — LLM judge (~~offline first~~ **now a mandatory gate**, see the 2026-09-15 amendment)

A stronger, different model (Sonnet 5) reviews **only the model-written body**, against
the headlines and their dates. The vetted closer is excluded: it's a fixed sentence
checked once by a person against its primary source. The judge returns a verdict per
sentence:
- **J1 supported:** every claim is stated or directly implied by a headline.
- **J2 no body legal claims:** no statements of D.C.'s legal powers in the body.
- **J3 temporal (rescoped 2026-09-12):** ordinary tense and words like "currently",
  "ongoing" and "recent" are **fine within roughly two months** — this beat moves slowly.
  Flag only outright errors: something called pending when a headline says it was
  decided; a date, duration or sequence the headlines contradict; or a present-tense
  claim resting only on something older than about two months.
- **J4 attributed (rescoped 2026-09-12):** flag only a contested claim stated **as fact**
  in the site's own voice. Characterising what advocates say is not a flag.

**Why the rescope:** Andria's call, 2026-09-12. The original 14-day window was an
assumption about news cadence, not a fact about this subject, and it made the judge
police wording rather than accuracy. The bar is outright errors — "currently considering"
after a decision, a provably wrong date — not nuance.

**Calibration (revised in v3):** calibrate against Andria's labels on a set with **at
least 10 real or seeded body errors, covering J1–J4, plus 20 or more correct
summaries**, including correct paraphrases as negative controls. Hold out about a third
of the set: tune the judge prompt on the rest and report results on the held-out part.
Report these separately, with counts by failure mode:
- **Required catches:** the three known *body* errors: "January 2021" (J1), "lasted a
  year" (J1), and "currently considering" (J3). The two troop closers are outside the
  judge's input; they're prevented by design and assessed separately.
- **Error recall** over all labeled body errors: ≥90%.
- **False-alarm rate:** ≤10%.

An always-approve judge scores high on agreement alone, so agreement is not the metric.
Until calibrated, the judge flags and never blocks. Whether it becomes a live gate is
decided after a month of data.

**Required catches — verified 2026-09-12.** Replaying the three historical body errors
through `scripts/news/judge.mjs` (Sonnet 5), each judged with its own run date as "now":

| Case | Required | Result |
|---|---|---|
| "events in January 2021" (2026-09-05) | J1 | **Caught.** Also flagged J4 on "renewed momentum" |
| "the deployment, which lasted a year" (2026-08-26) | J1 | **Caught** — "the headlines only mark the one-year anniversary … they do not state the deployment ended" |
| "a House committee is currently considering proposals" (2026-08-29) | J3 | **Caught** — "the only relevant headline is 39 days old" |

Two cautions carried forward from that run:
- The first attempt returned **no text at all**: the model spent its entire 1024-token
  budget on thinking. The code now uses 4096 and reports `no-text` as its own outcome.
  **A judge that returns nothing must never be scored as "no flags".**
- The judge also flags J4 on phrasing a person might accept ("renewed momentum"). That is
  what the false-alarm rate is for; it has not been measured yet.

## Layer 5 — human review (**superseded 2026-09-15 — there is no standing review**)

Andria is the reviewer. Summaries are **delivered** as GitHub issue notifications (email
plus mobile push) with inline "what to do" instructions (PRD section F); reading
`runs.jsonl` isn't required.
- **First two weeks after cutover:** every run opens its own review issue (assigned,
  @mention). Closing it is that run's review record.
- **After that:** a weekly issue with a sample of 5, every gate failure and judge flag,
  the withheld rate, and open `summary-error` issues. Flags between weekly issues go to
  one open incident issue.
- Every issue labeled `summary-error` becomes a golden case and, where needed, a fix.
  Andria starts that work in a Claude Code session; it doesn't happen on its own.
- **Withheld rate (v3 denominator):** runs with at least one article *and* summaries
  enabled, where the gates withheld the summary.
  - Reported separately: healthy-empty runs, failed runs, `pushed-not-live`, runs with
    summaries disabled, and human `/withhold` removals.
  - ≤20% is the launch ceiling (approved 2026-09-11), reported weekly with its trend.
    The main lever for lowering it is prompt changes validated on the golden set.
  - Any week with a missing run record is reported as **incomplete**.

## Baseline replay — run 2026-09-12 (`npm run eval:news`)

`scripts/eval/replay.mjs` replayed **96 distinct summaries** from the bill tracker's 241
feed versions through the current gates. Result:

| | |
| --- | --- |
| Summaries flagged by the deterministic gates | **1 of 96** — the "January 2021" invention (2026-09-05), caught by G2 |
| "the deployment, which lasted a year" (2026-08-26) | Passes G2 and G3, as designed. Needs judge J1 |
| "currently considering" from a July headline (2026-08-29) | Passes G2 and G3, as designed. Needs judge J3 |
| Summaries carrying a free-written closing sentence | 55, none matching a vetted sentence — **prevented by design now**, not detected |

**What this establishes:** the cheap checks catch invented numbers and nothing else. Two
of the three known body errors are invisible to them. A launch that ships the gates
without the judge is a launch with one detector, not three — worth stating plainly
rather than letting "all gates pass" imply the summary was verified.

The full per-summary output is written with `--json` for labelling.

## Golden harness — 2026-09-12 (`npm run eval:news`)

`scripts/eval/run-golden.mjs` runs the golden cases through the live prompts, the gates
and the judge, with time frozen to each case's `asOf`. Figures below are **11 cases × 3
runs**. Single-run passes proved too noisy to quote — the generation-flag rate read 20%
and 40% on two identical configurations — which is why the plan asks for three.

| Metric | Result | Bar |
|---|---|---|
| Required catches (known errors flagged by **anything**) | **6 / 6** | all |
| …caught by the **labelled** criterion | diagnostic only | not a bar |
| False alarms, judged on labelled-clean text | **0 / 1** | ≤ 10% |
| Availability (cases expecting a summary that produced one) | **29 / 30 = 97%** | ≥ 80% |
| Unusable judge replies | **0** | 0 |
| **Generation flags** (fresh summaries drawing any flag) | **12 / 29 = 41%** | reported, not gated |

**The 41% is the number to worry about.** The judge and the gates are doing their job;
the *generator* is what draws flags. After the 2026-09-12 rescope, tense is no longer
the driver — what remains is **unsupported generalisation**: turning one House vote into
"continuing a pattern of federal intervention" or "demonstrating ongoing congressional
power". It is concentrated, not diffuse: the single-vote case flagged on 3 of 3 runs,
while the two well-sourced cases flagged on 1 of 3 each. Consequences:
- Promoting the judge to a live gate today would withhold about two summaries in five —
  far past the approved 20% ceiling. **The judge stays advisory until prompt work brings
  this down.**
- The fix is narrow and testable: forbid characterising a pattern, trend or significance
  that no headline states. That is the concrete path for "manage the withheld rate down"
  (decision 7), and this harness measures whether it worked.

**Scoring: two measures, not one (2026-09-12).** A known error counts as caught when
**any** check flags it — that is what keeps it off the page. Whether the *labelled*
criterion fired is reported separately, as a diagnostic on label quality. The reason:
the pending-called-in-force case was labelled J1, the judge flagged it J2 and J3, and an
exact-match score called that a miss. It wasn't; the label simply described the failure
less precisely than the judge did. A metric that fails when the checker is right and the
label is imperfect trains you to distrust the checker.

**Method note, learned the hard way.** The first run reported a 100% false-alarm rate.
It was wrong: the harness was judging *freshly generated* bodies, so it measured
generation quality and blamed the judge. Precision is now measured against each control
case's labelled clean text, and generation flags are reported as their own line. A
metric that can't separate "the checker is wrong" from "the writer is wrong" is worse
than no metric.

## Baseline (remaining work)

1. **Labeled pass:** a human-labeled read of all ~55 post-change summaries, plus a
   sample of earlier ones, to replace the partial error count with a real baseline
   rate.
2. **Replay** those outputs through G2, G3, and the calibrated judge. Required results:
   - G2 flags the January 2021 invention.
   - J1 flags "lasted a year".
   - J3 flags "currently considering".
   - The two troop closers are reported as *prevented by design* (B1). Their wording
     not matching the new list is not evidence that anything detects legal errors.

## Logging and cost

Each run's artifact records `response.usage` for every model call (filter, summary, judge, retries,
judge), per the working guide. Don't hard-code pricing; compute cost from current
published rates when reporting.

## What this doesn't cover

- The accuracy of the source articles.
- Misleading headlines; the summarizer sees titles only.
- Whether the vetted closers are correct law. That's a one-time primary-source
  verification under `CLAUDE.md`'s citation standard, redone whenever a sentence
  changes.

---

## Amendment — 2026-09-15: the judge gates, and nobody is watching

**What changed:** no sustained human review. Layer 5 as written — reading every summary
twice a day, then weekly samples — is void. That reverses the earlier reasoning that the
judge was overkill: unattended, it is the only check that catches what the deterministic
gates provably cannot (1 of 96 historical summaries flagged by them).

**The judge is now a gate, not an advisor.** A summary publishes only on an explicit,
complete pass. `flag`, `no-text`, `incomplete`, `unparseable` and API failures all publish
headlines with no summary.

**What made that affordable:** one prompt line forbidding unsupported generalisation
("continuing a pattern of…", "demonstrating ongoing…") moved the flag rate from 41% to
17%, and judge-mandatory availability to 83% — inside the approved 20% ceiling.

**Corrections to this plan's earlier figures:**
- Availability was measured *before* judging, so "29/30" never meant what it said. The
  harness now reports deterministic and judge-mandatory availability separately and gates
  its exit code on the latter.
- An unusable judge reply on a control counted as "no false alarm" — a judge that answered
  nothing scored as one that approved. It now counts against precision.
- G7 (truncation) is now included in the harness, so the measurement models production.

**Superseded:** every reference above to `runs.jsonl`, the `news-data` branch log, weekly
reports, `replay.mjs`, and Layer 5's review cadence. Run records are 90-day workflow
artifacts; the historical summaries `replay.mjs` rebuilt now live in
`scripts/eval/fixtures/history-summaries.json`.

**The honest gap:** judge precision is unmeasured. With one clean control and zero false
alarms, the 95% upper bound on the false-alarm rate is about 53%. Roughly 20–29 distinct
clean controls would be needed to claim under 10%. Until then the 17% withheld rate is an
observation, not a guarantee.
