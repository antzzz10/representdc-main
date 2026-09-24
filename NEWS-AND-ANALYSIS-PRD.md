# News & Analysis — move the news pipeline to the main site (mini-PRD)

**Status:** **Built, uncommitted, 2026-09-15.** Read the 2026-09-15 amendment at the end
first: the constraints changed to unattended operation, and it supersedes the per-run
review issues, the `runs.jsonl` log and the weekly obligations described below. The body
is kept as the decision and review record, not as a description of what runs.
Decisions: `decisions/2026-09-11-news-pipeline-to-main-site.md` and its amendments.
Codex reviewed the plan (v1, v2), the scope reduction, the implementation plan, and the
final code.
**Companion:** `NEWS-SUMMARY-EVAL-PLAN.md` (accuracy and recency evaluation).
**Supersedes, if approved:** the "fetch the bill tracker's `news.json`" choice in
`decisions/2026-07-12-persona-picker-and-statehood-curious.md` and
`decisions/2026-07-23-standalone-news-page.md`, and the "Latest News" slot in the Take
Action Hub dropdown (`reference/brand/…IA Brainstorm`,
`decisions/2026-07-28-take-action-matcher-scope.md`).

## Problem

1. **The news feature belongs to the wrong repo.** `/news` is a main-site page, but its
   RSS fetch, relevance filter, AI summary prompt, schedule, API key, and data URL all
   live in `dc-bills-tracker`. Changing the summary means working in another repo. The
   prompt still introduces the site as `billtracker.representdc.org`, and `News.jsx`'s
   error copy points readers to the bill tracker.
2. **The summary ships errors unchecked.** Five known errors from 2026-08-15 to
   2026-09-11 (about 55 runs):
   - An invented date: "events in January 2021" (Sept 5).
   - Two closing sentences claiming Congress can "deploy federal troops" (Aug 25,
     Sept 10).
   - An unsupported inference: the deployment "lasted a year" (Aug 26); the troops are
     still there.
   - Old news presented as current: a House committee is "currently considering
     proposals" (Aug 29), based on a July 21 headline.

   Nothing checks the summary between the model and the page. The count comes from two
   partial reads, not a labeled pass, so treat it as a floor.
3. **News isn't in the nav, and on phones Reading isn't either.** At ≤768px, `Nav.css`
   hides every `.nav-link` except Home. The brand and the "See the bills" CTA stay
   visible.

## Goal

- The main site owns the news pipeline end to end.
- News and long-form Reading form one prominent nav section, visible on phones too.
- A summary reaches the page only after automated checks pass, and accuracy and recency
  are measured over time.

## Audience

Statehood-curious readers who want the gist of current coverage before choosing what to
read, and activists checking what's moving this week.

## MVP scope

### A. Move the pipeline

- Port `dc-bills-tracker/scripts/fetch-news.js` to `scripts/fetch-news.mjs` here. Add
  `@anthropic-ai/sdk` as a devDependency; it runs only in CI, so there is no bundle
  impact.
- Add `.github/workflows/fetch-news.yml` (this repo's first workflow), at **06:17 and
  18:17 UTC** — deliberately off the hour, because GitHub delays and sometimes drops jobs
  queued at minute 0. **Permissions are declared per job (v3):** declaring any permission
  sets the rest to none.
  - The publish job gets `contents: write` (branch pushes) and `issues: write` (review
    posts).
  - The failure reporter gets `issues: write`.
  - The Withhold workflow gets `contents: write` and `issues: write`. It's triggered by
    Andria, either through a `/withhold` comment (gated to the repo owner) or by manual
    dispatch.
  - Nothing needs `actions: write`. The `NEWS_SUMMARY_ENABLED` variable is changed by
    hand, since `GITHUB_TOKEN` can read variables but not write them.
- **Publish without rebuilding the site.** The main site is deployed by hand, and the
  gap between "pushed" and "deployed" is used on purpose. A CI rebuild would ship
  unreleased commits twice a day. No bot commits land on `main`.
- **Manual deploys and news writers own separate files on `gh-pages`.**
  - Manual deploys write **everything except** `api/news.json`. `dist` never contains
    it (asserted before publishing), and the deploy's remove list excludes it.
  - This means a small `scripts/deploy.mjs` calling `ghpages.publish()` with
    `remove: ['**', '!api/news.json']`, `history: true`, and `dotfiles: true`.
    Confirmed 2026-09-11 against the installed gh-pages 6.3.0 in a scratch tree: the
    exclusion works.
  - **v3:** `ghpages.publish()` reports failures only through its callback, and its
    promise resolves even when the push is rejected (both Codex reviews; confirmed at
    `node_modules/gh-pages/lib/index.js:254`). The script must turn callback errors
    into a non-zero exit, as the CLI does. Phase 1 includes a test where a rejected
    push makes `npm run deploy` exit non-zero.
  - This replaces v1's "copy `news.json` into `dist` before deploy", which could
    silently restore older news.
  - **Separate files do not mean no collisions.** Git rejects a push onto a diverged
    branch whatever files each side touched, so overlapping writers do collide (Codex
    round 3). What the split buys is that no content is lost: the bot re-reads and
    re-applies, up to 3 attempts, and a manual deploy fails loudly and is rerun.
    `scripts/eval/race.test.mjs` asserts the retry actually happens.
- **All news writers are serialized (v3).** Scheduled runs, reruns, and the Withhold
  workflow all write `api/news.json`, so v2's "one file, one writer" argument doesn't
  cover them (Codex round 2, blocker). Three rules:
  1. The fetch workflow uses a `news-publish` concurrency group. **Withhold uses its own
     group** (`news-withhold`): GitHub keeps at most one *pending* run per group, so a
     scheduled fetch queueing behind a queued withholding would have cancelled it — the
     owner's emergency action dropped silently (Codex round 3). Rules 2 and 3 are what
     make separate groups safe.
  2. Every writer re-reads the **current** `gh-pages` copy of `api/news.json`
     immediately before pushing, and applies its change to that copy. On a rejected
     push it re-reads and re-applies; it never re-pushes a stale payload.
  3. **Withhold wins over older runs.** Withhold stamps `withheldAt` in the file. A
     fetch run that started before that time publishes its headlines with
     `summary: null`.

  Withhold removes the *current* summary only; the next scheduled run may publish a
  new one. To keep summaries off, use the `NEWS_SUMMARY_ENABLED` variable, which runs
  read inside the lock, at publish time. GitHub keeps at most one *pending* job per
  concurrency group, so a rapid sequence can cancel a queued Withhold. Rule 3 plus
  the runbook's "check the live page" step covers that case.

  Phase 1 tests, in a scratch repo: manual deploy vs. bot in both orders; Withhold vs.
  an in-flight fetch in both orders; and a rerun after Withhold.
- **Publication mechanism:** the push uses `GITHUB_TOKEN`. Both Codex rounds flagged
  that GitHub's docs say such pushes don't trigger a Pages build. The sibling repo's
  record contradicts the docs:
  - `dc-bills-tracker` has the same setup (legacy build from `gh-pages`).
  - Its scheduled fetch-news run on 2026-09-11 (10:04:10–10:04:51 UTC) pushed
    `gh-pages` commit `0eda553` at 10:04:47.
  - The Pages build for exactly that commit was created at 10:04:49 by
    `github-actions[bot]` and finished `built`.
  - That workflow's only push credential is `GITHUB_TOKEN`, and no manual deploy ran
    at that hour.

  This is strong evidence, not proof for this repo. So, **on every publish, not only in
  shadow**, the run polls `https://www.representdc.org/api/news.json` for up to 10
  minutes until its `runId` appears. Only then is the outcome `published`; otherwise
  it's `pushed-not-live`, which alerts. Shadow runs must be bot-only (no manual deploy
  nearby). If shadow shows `pushed-not-live`, the fallback is switching Pages to the
  Actions build type, which changes the manual deploy too and needs a new decision.
- ~~**History on the `news-data` branch, as a log only.**~~ **Superseded 2026-09-15:**
  the branch is no longer written to; each run's record is a 90-day workflow artifact.
  The original design follows, for the record. It appends to `runs.jsonl`;
  nothing publishes from it. **Complete run record (v3):**
  - `runId` and attempt number; model ID and prompt version;
  - start, push, and live-verified timestamps;
  - per-source status;
  - every fetched title with its filter verdict;
  - the **final article snapshot** (title, link, source, date);
  - every summary attempt with its gate results, and the final assembled payload;
  - the outcome, one of `published` / `published-empty` / `summary-withheld` /
    `summary-disabled` / `pushed-not-live` / `not-published` (with a reason);
  - `response.usage` for every call.

  Write order: publish, verify live, then log. If the log push fails, the run
  uploads the record as an Actions artifact (90-day retention) and the next weekly
  report is marked **incomplete** until it's reconciled. A gap is never treated as
  recovered evidence.
- **Run outcomes are distinct (revised in v3):**
  - **Source success means a valid parsed feed:** an RSS or Atom root and a channel.
    HTTP 200 carrying HTML, or malformed XML, counts as a *failed* source.
  - **All sources failed:** don't publish; keep the last file; fail the run.
  - **Some sources failed:** publish, with the failure recorded.
  - **Filter response must be valid:** a JSON array of in-range integer indices.
    Anything else is retried once, then the run fails and keeps the last file. (Today
    the script turns a malformed response into `[]`, which would look like "no news".)
  - **Zero relevant articles**, from valid feeds and a valid filter verdict only:
    publish an empty feed (healthy-empty).
  - **API overloaded:** keep the last file; exit non-zero after retries. Today's
    script exits 0 and stays silent.
  - Phase 1 test fixtures: HTML-with-200, malformed RSS, a valid empty feed, and
    malformed filter output.
- **Page:** `News.jsx` reads same-origin `/api/news.json`. Hide the summary when
  `lastUpdated` is older than 72h. Replace the error copy that names the bill tracker.

Rejected alternatives:
1. Leave the pipeline in the bill tracker and just fix the prompt: fails the ownership
   goal.
2. CI rebuild and full deploy: ships unreleased commits.
3. Bot commits to `main`: twice-daily commits in a checkout that parallel sessions push
   to directly.
4. `gh-pages --add`: stale hashed assets pile up forever.
5. A separate data repo: another repo to own, and cross-origin again.
6. v1's predeploy copy from `news-data`: allows a silent rollback (Codex).
7. Switching Pages to the Actions build type now: it would change how every manual
   deploy works. Held as the fallback if live verification fails.

### B. Accuracy fixes, in the ported script

1. **Closing sentence from a fixed list.** The model returns a key, and the code appends
   the vetted sentence, each with a primary-source URL verified under `CLAUDE.md`'s
   citation standard before shipping. This removes the *closing* sentence from the
   model's hands. The body can still make an unsupported legal claim, so the prompt
   bars legal claims in the body and the judge checks for them (eval J2).
2. **Numeric grounding gate.** Any year, number, dollar amount, or percentage in
   model-written text must appear in a published headline. This is a narrow safeguard:
   it catches invented numbers like "2021", not wrong actors, outcomes, or durations
   like "lasted a year". On failure, retry once, then publish with `summary: null`.
   Never fall back to the previous summary.
3. **Dates in the prompt (new).** Today the summarizer sees titles and sources but no
   dates (`fetch-news.js:145`). Pass each headline's publish date and age, and require
   past tense for anything older than 14 days. This is the direct fix for "currently
   considering".
4. **Prompt fixes.** Name the site `www.representdc.org`, drop "today's top
   headlines", and ask for one paragraph.

### C. Nav and hub — decisions needed

| Option | What it is | Tradeoff |
|---|---|---|
| **1 (recommended)** | One nav item replacing "Reading" (working name "News & Analysis") that opens a combined hub: digest plus headlines at the top, long-form articles below | Nav count unchanged, news gets the prominent slot. Section headings must keep the AI digest visibly separate from guest work (the guest-piece rule bars AI summaries of articles) |
| 2 | "Read" dropdown → News / Articles | Needs a dropdown; poor on touch |
| 3 | Two adjacent links, "News" and "Reading" | Simplest, but a seventh link in an already wide nav |

- **Mobile (revised):** the phone row today holds the brand, Home, and the CTA. Adding a
  long combined label risks overflow, because the row has a fixed height and doesn't
  wrap. Specify the layout before building: likely a short label ("News") on mobile, or
  drop Home there, since the brand already links home. Verify at 320, 375, 400, 767,
  and 769px, plus keyboard focus and 200% zoom.
- **URLs:** hub at `/news` (already linked from `/myths` and `/statehood-curious`);
  `/reading` redirects there; `/reading/:slug` article URLs don't change.
- **Naming:** keep a path open to the planned "Resources" fold-in
  (`decisions/2026-09-09-reading-section.md`).
- A parallel session already rewrote the Reading hero on 2026-09-11. Fold that into the
  hub; don't redo it.

### D. Evaluation

See `NEWS-SUMMARY-EVAL-PLAN.md`. Cutover requires everything in the Phase 3 checklist
below, not just section B.

### E. Decommission in the bill tracker (separate approval)

- Disable `fetch-news.yml`, and remove `scripts/fetch-news.js` and
  `public/api/news.json`, only after the main site has published cleanly for 4 or more
  verified runs and `News.jsx` has switched.
- **Weekly digest: repoint it (decision 6), and do that before deleting anything.**
  `scripts/weekly-digest.js:51–54` reads the local `news.json`; deleting it yields "No
  news this week". The schedule is paused (Kit API key issue), but it can still be run
  by hand. v3 contract:
  - Fetch `https://www.representdc.org/api/news.json` with a 10s timeout and a schema
    check. The digest uses headlines only, not `summary`, so withholding a summary
    doesn't affect it.
  - When the feed is unavailable, or older than 72h, say "News feed unavailable this
    week". Never say "No news this week" for a failed fetch.
  - **Fix the `HEAD~7` window** (`weekly-digest.js:59–70`), which treats seven commits
    as seven days. Once twice-daily news commits stop, it would cover a different span.
    Switch to a date-based comparison (`--since='7 days ago'`) with enough fetch depth
    (`weekly-digest.yml:30`).
  - Verify with fixtures. **Don't** use the digest's draft or test modes, which write to
    external services.
  - Keep `ANTHROPIC_API_KEY` in the bill tracker; the digest still uses it.
- **Fewer recovery chances for failed bill deploys (reworded in v3).**
  `monitor-bills.yml` commits bill data *before* deploying, and the freshness watchdog
  checks the repo's `bills.json`, not the live site. Today, if a bill deploy fails, the
  next news-triggered rebuild (within 12h) also publishes it. After decommissioning,
  only the next monitor run that finds bill changes redeploys. That's less frequent,
  and the repo-fresh / live-stale mismatch stays undetectable either way.

  Deliver both a *detector* and a *fix*:
  - **Detector:** publish a small `api/status.json` stamp at build time, and have the
    watchdog compare the live stamp with the repo's `lastChecked`.
  - **Fix:** a deploy-only recovery path. Re-running the monitor doesn't redeploy when
    it finds no new changes.

  Acceptance test: the data commit succeeds, the deploy fails, repo freshness stays
  healthy, and the detector catches the mismatch and the fix republishes.
- **Build date:** the PDF export's "Last Updated" (`__BUILD_DATE__`) will advance only
  on bill deploys. (v1 said the footer's "Site last built" would change too; that label
  is only a fallback, and `lastChecked` is normally shown.)
- Update the docs and comments that describe fetch-news's redeploys: `src/App.jsx`
  (lines 262–266), the `data-freshness-check.yml` header,
  `docs/watchdog-self-heal-proposal.md`, `decisions/2026-07-27-analytics.md`,
  `WHATS-NEXT.md` (line 199 on), and `CLAUDE.md`.
- The local checkout is 58 commits behind, with uncommitted edits to `WHATS-NEXT.md`.
  Pull first and preserve those edits.

### F. Review alerts and runbook (added after approval)

Andria reviews the summaries, so they're delivered to her; she doesn't have to remember
to check. The channel is **GitHub issues in this repo, assigned to Andria**. That means
email to her GitHub notification address (set it to her ProtonMail address) plus a
GitHub Mobile push. There are no new credentials or vendors.

- **One issue per run (v3; was one per day).** Codex showed that later comments on a
  daily issue may not trigger a phone push, and that closing the morning issue would
  mark the evening summary "reviewed" unseen. Each run's issue:
  - is titled "News summary review — YYYY-MM-DD AM/PM";
  - is assigned to Andria and **@mentions her** in the body (assignments and mentions
    are the events GitHub Mobile pushes);
  - carries the outcome, the summary exactly as published, the headlines with sources,
    dates, and links, gate results, judge flags (once the judge exists), whether the
    live URL was verified, and the "What to do" block below.

  A rerun of the same slot updates that issue instead of opening a new one. That's two
  notifications a day for the first two weeks, which is the review cadence Andria
  asked for.
- **Failures post too, from a separate job (v3).** A `report-failure` job runs when the
  main job fails. It doesn't depend on the main job's outputs. It finds or creates that
  run's issue, @mentions Andria, and includes the run link and the failed step (or
  "see run log"). It can't report a workflow that never started. Those cases are
  covered by GitHub's own failure email, the page's 72h stale-hide, and the weekly
  report's gap count. The Phase 0 checklist confirms where the failure email lands.
- **What to do** (included in every post):
  1. **Looks right:** close the issue. Each closed issue is that run's review record.
  2. **Something is wrong:** reply to the notification email (or comment on the issue)
     with **`/withhold`** plus what's wrong in plain words.
     - That runs the Withhold workflow, which only acts on comments from the repo
       owner. It republishes the current headlines with no summary, then posts
       "✅ Summary removed — verified live" or "⚠️ Removal not confirmed" on the issue.
     - It adds the `summary-error` label automatically.
     - **Backup, if the reply doesn't work:** in a browser, go to the repo's **Actions**
       tab → **Withhold news summary** → **Run workflow** → branch `main` → **Run
       workflow**. Wait for the green check (1–3 minutes), then refresh
       `www.representdc.org/news`.
     - **If the summary is still there after 10 minutes,** do step 3. The worst case is
       an AI-labeled summary staying up until someone fixes it; nothing else on the
       site is affected.
  3. **Same problem twice, or Withhold failed:** turn summaries off. Go to repo
     Settings → Secrets and variables → Actions → Variables, and set
     `NEWS_SUMMARY_ENABLED` to `false`. From the next run, headlines keep updating with
     no summary. Set it back to `true` after the fix.
  4. **Feed failed or stale:** nothing is urgent. The page hides a summary older than
     72h.
- **Who acts on `summary-error` issues (v3):** labeling doesn't start anything
  automatically. Andria opens a Claude Code session in `representdc-main` and says
  "handle the open summary-error issues". Each one becomes a golden eval case and,
  where needed, a prompt or check fix, validated on the golden set before shipping.
  The weekly issue lists every open `summary-error` issue, so none sit forgotten.
- **After the first two weeks:** one **weekly** issue with a sample of 5 summaries,
  every gate failure and judge flag, the withheld rate against the 20% ceiling, and
  open `summary-error` issues. A flag between weekly issues gets a comment on an open
  "summary flags" incident issue (@mention), not a new issue each time.
- **Tested before cutover (Phase 2):**
  - An issue created by a run reaches Andria's ProtonMail and phone.
  - A `report-failure` post reaches her the same way.
  - A `/withhold` reply works, both by email reply and as a comment.
  - A comment from a non-owner is ignored.
- `docs/news-summary-runbook.md` holds these instructions in full.

## Out of scope

New sources, article-body ingestion, a homepage teaser, the Take Action Hub build, the
"Resources" rename, and alerts outside GitHub (email or push through a third-party
service).

## Rollout and approval gates

| Phase | Work | Gate / approval |
|---|---|---|
| 0 | ~~Approve plan~~ ✅; add a separate `ANTHROPIC_API_KEY` to repo secrets; set GitHub notification email and GitHub Mobile push | Andria (credential change) |
| 1 | Port script with B1–B4, run outcomes, and `runs.jsonl`; `scripts/deploy.mjs` with the file-ownership split and non-zero exit on failure; review issues, `report-failure`, Withhold (`/withhold` + manual), the `NEWS_SUMMARY_ENABLED` switch, and the runbook (F); labeled baseline pass and eval replay | Lint and build pass; scratch-repo tests: manual deploy vs. bot (both orders), Withhold vs. in-flight fetch (both orders), rerun after Withhold, rejected push → non-zero exit; ingestion fixtures pass; replay meets the eval plan's bar; Codex reviews the Phase 1 diff |
| 2 | Push workflows in **shadow**: publishes `/api/news.json` + log; `News.jsx` still reads the bill tracker | Push approval; ≥4 **bot-only** runs whose `runId` is confirmed on the live URL; then one deliberate manual deploy that leaves the feed untouched; notification tests from F (ProtonMail, phone, `/withhold` by email and by comment, a non-owner comment ignored) |
| 3 | **Cutover checklist:** G1–G5 live; 72h stale-hide on page; same-origin fetch; nav + hub; mobile layout verified at the listed widths | Deploy approval; browser check |
| 4 | Decommission in `dc-bills-tracker` (section E, including digest + watchdog) | Separate approval: other repo, push + deploy |
| 5 | Decision notes, `CLAUDE.md`, `WHATS-NEXT.md`, memory | — |

## Decisions (answered 2026-09-11)

1. Nav: option 1 as recommended. The final label will be proposed during the build;
   phones get a short label.
2. Supersedes "Latest News" under the Take Action Hub dropdown: confirmed.
3. Gates block a summary: remove it (`summary: null`).
4. Separate API key for the main site: yes.
5. Weekly digest: pull news from the main site's feed.
6. Up to 20% withheld at launch: yes, reported weekly and managed down.
7. Andria reviews summaries, delivered by GitHub issue notification with inline
   instructions (section F).

## Review log

**2026-09-11, Codex plan review** (Codex CLI 0.153.4, `gpt-6-astra`, `medium` and
`high` effort, read-only sandbox, reviewing v1 of both docs). Raw output was kept
outside the repo in the session scratchpad. Findings are the union of both runs, with
their disposition:

| Finding | Disposition |
|---|---|
| BLOCKER: `GITHUB_TOKEN` pushes won't trigger a Pages build (both runs) | **Disputed on evidence.** The sibling repo's identical setup builds on bot pushes (Pages API, 2026-09-11). Kept the live-URL `runId` check as the acceptance test |
| BLOCKER: predeploy copy lets a manual deploy silently roll back newer news (both) | **Accepted.** Redesigned to split file ownership between the two writers (A) |
| Weekly digest depends on `news.json` (both) | **Accepted.** Added to E |
| News rebuilds are an accidental recovery path for failed bill deploys (high) | **Accepted, verified** in `monitor-bills.yml` and `data-freshness-check.yml`. Added to E |
| Numeric gate and fixed closer are narrower than claimed; "lasted a year" passes (both) | **Accepted, verified.** Wording narrowed; judge covers the body |
| Recency checks miss "currently considering" from a July headline (both) | **Accepted, verified.** Added B3; eval R3 revised |
| No publication-state or recovery contract across two branches (high) | **Accepted.** Simplified: `news-data` is log-only, with defined outcomes and write order |
| Source failures and empty results are indistinguishable (both) | **Accepted.** Run outcomes defined in A |
| Pass bar hides suppression; judge calibration is weak (both) | **Accepted.** See eval plan |
| Mobile diagnosis omits the visible CTA (both) | **Accepted.** Revised C |
| NIT: "Site last built" isn't the normal display; the Reading lede was already fixed; rejected titles are recoverable from Actions logs (both/high) | **Accepted.** Corrected |

**2026-09-11, Codex round 2** (same versions and settings; reviewed v2 + section F + the
decision note; `--add-dir` for the tracker and the v1 snapshots). Both runs found 2
blockers; medium found 10 should-fixes + 1 nit, high 9 + 1 nit, largely overlapping.
Disposition:

| Finding | Disposition |
|---|---|
| BLOCKER: Withhold and scheduled runs can undo each other (both) | **Accepted.** All news writers serialized: shared concurrency group, re-read before push, `withheldAt` beats older runs; tests listed (A) |
| BLOCKER: `contents: write` alone blocks every issue post (both) | **Accepted.** Per-job permissions; `issues: write` added; the variable stays a manual change (A) |
| `await ghpages.publish()` resolves even when the push is rejected (both) | **Accepted, verified** at `gh-pages/lib/index.js:254`. The script converts callback errors to a non-zero exit; tested in Phase 1 (A) |
| Pages question still open (both; neither kept it a blocker) | **Stronger evidence added:** the sibling repo's run, commit, and build line up within seconds, with `GITHUB_TOKEN` as the only credential. Live `runId` verification now runs on every publish, with a fallback named (A) |
| Comments on a daily issue may not push to phone; closing it marks the evening run reviewed (both) | **Accepted.** One issue per run, assigned + @mention; reruns update in place (F) |
| `if: failure()` has no issue target or reason; the runbook overpromised; unclear who handles labels (both) | **Accepted.** Separate `report-failure` job; exact Withhold steps; failed-removal escalation; handoff named (F) |
| Judge must "catch all five" but can't see the closers (both) | **Accepted.** Three body errors required; closers assessed separately; recall over all labeled body errors (eval) |
| ≥95% exact outcome match conflicts with the 20% ceiling; no production denominator; fixtures age (both) | **Accepted.** Correctness and availability split; denominators defined; frozen eval date (eval) |
| "Healthy-empty" can hide parser or filter failures (both) | **Accepted.** Source success = valid parsed feed; filter output validated; fixtures (A) |
| Digest repoint lacks a failure contract; `HEAD~7` window omitted (both / high) | **Accepted.** Contract and date-based window (E) |
| Log gaps lose evidence; the record lacks an article snapshot (both) | **Accepted.** Complete record; artifact fallback; "incomplete" reports (A) |
| "Once news leaves, nothing does" is overstated; no acceptance test (both) | **Accepted.** Reworded; detector + fix + acceptance test (E) |
| NIT: the decision note credits the Codex review to v2 (both) | **Accepted.** Corrected |

**Not Codex-reviewed (added in v3):** the `/withhold` email-reply trigger. It uses an
`issue_comment` workflow gated to `author_association == 'OWNER'`, so on this public
repo other people's comments are ignored. It's small, but it is new: include it in the
Phase 1 diff review.

---

## Amendment — 2026-09-15: unattended operation

Andria's constraints changed the problem: scope is only the summary on `/news`, there is
no sustained human review (1–2 days, then unattended), alerts must be pushed to her and
must be rare, and maintenance burden is the binding constraint. She also called the build
overkill, which it was — 1,381 lines of production code for three sentences twice a day.

**What this supersedes in the sections above:** section F's per-run review issues and
review checklist; the `runs.jsonl` log on the `news-data` branch (A); the weekly reporting
and `summary-error` processing obligations; the phase table's Phase 1 row; and the
weekly-digest work in section E, which is now out of scope entirely.

**The design now:**

| | |
|---|---|
| Judge | **Mandatory gate.** A summary publishes only on an explicit, complete pass. A flag, an unusable reply, or a judge API failure publishes the headlines with `summary: null`. Enforced twice: in `fetch-news.mjs`, and as an invariant in `publishFeed()` that refuses any summary lacking a judge pass |
| Cost of that | ~17% of runs publish headlines without a summary. Approved |
| Alerts | Exception-only, by **email** from `noreply@representdc.org` (`decisions/2026-09-15-alert-channels.md`): run failed, published-but-not-live, nothing published, recovered. One per episode, not per run |
| Alert state | One open GitHub issue per incident key — the state store and the `/withhold` surface, not the notification |
| Watchdog | **Decided, NOT BUILT.** To live in `dc-bills-tracker`, polling this site's feed timestamp (~36h). That repo is untouched — its `data-freshness-check.yml` watches bill data, not news — so until it is built, a silently stopped news job alerts nobody. **Known limit when built:** same scheduler it watches |
| Run record | A 90-day workflow artifact. The `news-data` branch is no longer written to, and is retained as history |
| Removed | `review-issue.mjs`, `log-run.mjs`, `logRun()`, `replay.mjs` (its data materialised to `scripts/eval/fixtures/history-summaries.json`), the `eval:news:replay` script |

**Reviewed by Codex** at medium and high effort, twice: on the scope reduction, and on
this implementation plan. Both called an advisory judge a blocker under unattended
operation; both required a missing-run detector; both said to keep `withheldAt`. Findings
applied include strict judge parsing (a stated `flag` with all-passing verdicts used to
return `pass`), a truncation gate, the publish invariant, and the withhold-stamp hole on
the already-clear path.

**Still open:** the `/withhold` email-reply path is unproven; the three email secrets
(`EMAIL_USERNAME`, `EMAIL_PASSWORD`, `NOTIFICATION_EMAIL`) exist in `dc-bills-tracker` but
not in this repo; judge precision rests on a single clean control, which supports no
precision claim.

### Recorded disagreement — `GITHUB_TOKEN` and Pages builds

Codex raised this three times, twice as a blocker: GitHub's documentation states that
commits pushed by a workflow using `GITHUB_TOKEN` do not trigger a Pages build, which
would mean this pipeline updates the branch while readers keep seeing the old feed.

**Evidence against, re-verified 2026-09-15** on the sibling repo, which uses the identical
pattern (`x-access-token:$GITHUB_TOKEN` push to a legacy `gh-pages` source):

| Pages build created | Pusher | Status | Matching scheduled run |
|---|---|---|---|
| 2026-09-15 10:33:01Z | `github-actions[bot]` | built | 10:32:23 → 10:33:04 |
| 2026-09-14 21:05:45Z | `github-actions[bot]` | built | 10:05:07 → 21:05:48 |
| 2026-09-14 11:03:09Z | `github-actions[bot]` | built | 11:02:30 → 11:03:11 |

Five consecutive builds, all bot-pushed, all `built`, each inside its run's window. That
workflow holds no other push credential.

**Resolution:** proceed. The documentation does not describe observed behaviour on this
account. The disagreement costs nothing either way, because every run already verifies the
live URL serves its own `runId` before reporting `published` — if Codex turns out to be
right in some configuration, the run reports `pushed-not-live` and emails, rather than
failing silently.
