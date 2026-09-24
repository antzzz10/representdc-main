# Decision: Move the news pipeline to the main site; pair News with Reading in the nav

**Date:** 2026-09-11
**Status:** Approved by Andria. Build not started.
**Plan of record:** `NEWS-AND-ANALYSIS-PRD.md` and `NEWS-SUMMARY-EVAL-PLAN.md` (v3).
Review history:
- Codex reviewed v1 at medium and high effort. That fed into v2, whose decisions
  Andria approved here.
- Codex round 2 reviewed v2 plus section F. That fed into v3, which changes
  mechanisms, not these decisions.
- The PRD's review log records every finding and its disposition. The v3 changes
  haven't had a third review.

## Context

`/news` is a main-site page, but its RSS fetch, relevance filter, AI summary, schedule,
and API key live in `dc-bills-tracker`. A read of the summary history found at least
five published errors since 2026-08-15, with no check between the model and the page.
News was also absent from the nav, and on phones Reading was too.

## Decisions

1. **Ownership:** the pipeline moves into `representdc-main`. This supersedes the
   "fetch the bill tracker's `news.json`" choice in
   `2026-07-12-persona-picker-and-statehood-curious.md` and
   `2026-07-23-standalone-news-page.md`.
2. **Nav:** one item replacing "Reading" (working name "News & Analysis") opens a
   combined hub at `/news`: digest and headlines on top, long-form articles below.
   `/reading` redirects there; `/reading/:slug` URLs don't change. On phones a short
   label is used so it fits beside the brand and CTA.
3. **Take Action placement superseded:** News no longer sits under the Take Action Hub
   dropdown (IA brainstorm; `2026-07-28-take-action-matcher-scope.md`).
4. **Failed checks remove the summary.** When a summary fails the gates, the page shows
   headlines with no summary. It never shows an older summary.
5. **Separate Anthropic API key** for the main site, so usage is attributed separately
   from the bill tracker.
6. **Weekly digest pulls news from the main site** (`https://www.representdc.org/api/news.json`)
   instead of losing its news section when the bill tracker's file is removed.
7. **Up to 20% of runs may withhold the summary at launch**, with the rate reported
   weekly and actively managed down over time.
8. **Andria reviews summaries, delivered to her rather than remembered.** Each run's
   summary arrives as its own GitHub issue, assigned to her with an @mention (email plus
   GitHub Mobile push), with instructions inline. Replying `/withhold` to the email
   removes a bad summary. See PRD section F.

## Amendment, 2026-09-12 — what counts as a summary error

**Decision:** the accuracy bar is **outright errors, not language nuance.** D.C. statehood
news moves slowly, so present-tense framing — "currently considering", "ongoing" — is
appropriate for anything within roughly one to two months. What must never ship:

- calling something pending or under consideration when it has already been decided;
- a date, duration or sequence that the sources contradict (a provably wrong date, or an
  event described as ended when it has not);
- invented specifics of any kind.

**Why:** the original bar came from Claude's assumption that a claim needed support from
the last 14 days. That is a general-news cadence, not this subject's, and it turned the
checker into a style critic — flagging 44% of generated summaries, which would have
withheld about four in nine and blown the approved 20% ceiling.

**What changed as a result:** the judge's J3 and J4 criteria were rescoped, the
summarizer's prompt now allows a two-month present-tense window while forbidding
unsupported outcomes, two golden cases were relabelled as acceptable rather than errors,
and a new case was added for the failure that does matter — a decided vote described as
still under consideration.

**Rejected:** keeping the tighter window and relying on the withhold loop to catch the
consequences. It would have suppressed correct summaries and trained the reviewer to
ignore flags.

## Amendment, 2026-09-15 — unattended operation

**Context:** Andria set new constraints — scope is only the summary on `/news`; assume
1–2 days of attention and then nobody watching; alerts must be pushed to her and must be
rare; maintenance burden is the binding constraint. She also called the build overkill,
which it was.

**Decisions:**

1. **The judge gates.** A summary publishes only on an explicit, complete judge pass.
   A flag, an unusable reply, or an API failure publishes the headlines with no summary.
   An advisory judge protects nobody when no one reads its findings.
2. **~17% of runs showing headlines without a summary is acceptable** (approved). One
   prompt line forbidding unsupported generalisation moved the flag rate from 41% to 17%
   and judge-mandatory availability to 83%.
3. **Alerts are exception-only** — failure, all sources down, pushed-but-not-live,
   unconfirmed withholding, repeated withholding — de-duplicated per incident. No
   per-run notifications, no weekly reports, no standing review obligation.
4. **Watchdog: the sibling `dc-bills-tracker` repo** polls the public feed's timestamp
   and alerts if nothing has published in ~36h. **Known limitation, accepted:** it runs
   on the same GitHub scheduler it watches, so it cannot catch GitHub dropping scheduled
   runs. Both Codex reviews preferred an external dead-man's switch; rejected to avoid a
   new vendor and secret.
5. **Cut** the review-issue machinery, the run-log branch writes, the replay script, and
   the weekly digest work — roughly 700 lines. The `news-data` branch is no longer
   written to but is not deleted; it is historical evidence and deletion was not
   approved.

**Reviewed:** Codex at medium and high effort on the scope reduction, and again on this
implementation plan. Their findings are recorded in the PRD's review log.

## Rejected alternatives

- Keep the pipeline in the bill tracker and just fix the prompt: fails the ownership
  goal.
- CI rebuild and full deploy of the main site: would ship unreleased commits twice a
  day.
- Show the last good summary when checks fail: it would describe different headlines
  than the ones on the page.
- Two separate nav links, or a dropdown: a seventh link, or a touch-hostile control.
- Email through a new mail service, or push through a third-party service, for review
  alerts: each adds a credential and a vendor. GitHub notifications need neither.
