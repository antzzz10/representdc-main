# News summary runbook

The D.C. news digest on [www.representdc.org/news](https://www.representdc.org/news) runs
unattended. This is what it does, what it tells you, and the one action you might need to
take.

**Plan of record:** `NEWS-AND-ANALYSIS-PRD.md`, `NEWS-SUMMARY-EVAL-PLAN.md`,
`decisions/2026-09-11-news-pipeline-to-main-site.md` (and its 2026-09-15 amendment).

## What runs

| | |
| --- | --- |
| **Schedule** | 06:17 and 18:17 UTC (`.github/workflows/fetch-news.yml`) |
| **What it publishes** | One file: `api/news.json` on the `gh-pages` branch |
| **What it never does** | Rebuild or redeploy the site. Releases stay manual |
| **Where the summary comes from** | Claude Haiku, from the headlines only — it never reads the articles |
| **What must approve it** | A second model (Sonnet) checks every summary against the headlines. **No pass, no summary** |
| **The closing statehood sentence** | Chosen from four vetted sentences in `scripts/news/closers.mjs`, each tied to a primary source. The model picks which; it never writes one |
| **Record of each run** | A workflow artifact, kept 90 days |

**Roughly one run in six publishes headlines with no summary.** That is the design
working, not a fault: the checker withheld something it could not verify. Nothing alerts
you, and nothing needs doing.

## What will actually reach you

Only exceptions, by email, from `noreply@representdc.org`:

| Email | Meaning |
| --- | --- |
| ⚠️ run failed | The job broke. The page is unchanged unless it failed after publishing |
| ⚠️ published but not live | The feed was pushed but the public URL never served it |
| ⚠️ nothing published | Ingestion failed; the last good feed is still up |
| ✅ recovered | A later run succeeded. Nothing to do |

**You get one email per episode, not one per run.** An open GitHub issue tracks the
episode and closes itself on recovery.

Nothing here is urgent. The site keeps serving, and any summary older than 72 hours hides
itself automatically.

## If a summary is wrong

**Comment on an incident issue in GitHub** — the alert email links to the one it opened —
with:

> /withhold the second sentence says the deployment ended, it hasn't

That removes the summary from the live page, keeps the headlines, and replies telling you
whether removal was confirmed. Only comments from you trigger it — the repo is public, so
everyone else's are ignored.

**Replying to the alert email does nothing.** It is ordinary mail from a send-only
account, not a GitHub issue address — the comment has to be made in GitHub (the mobile app
works), or use the backup below.

**If there is no open incident issue** — the likely case, since a bad summary is not an
incident — use the backup. Optional one-time setup that restores the one-comment path:
open an issue titled "News summary control", label it `news-control`, and keep it open.
`/withhold` works on it from then on.

**Backup:** Actions tab → **Withhold news summary** → **Run workflow** → branch `main`.

**If it is still there after ten minutes:** Settings → Secrets and variables → Actions →
Variables → set `NEWS_SUMMARY_ENABLED` to `false`. That stops the *next* run generating a
summary. It does **not** remove one already published — only withholding does that.

## Getting a bad summary fixed for good

Open a Claude Code session in this repo and say:

> handle the summary-error issues

Each becomes a test case in `scripts/eval/news-golden.json` and, where needed, a prompt or
gate change — validated against the whole set before it ships.

## For whoever maintains this

```bash
npm run test:news                                    # feed parsing, gates, concurrency, the publish invariant
DRY_RUN=1 ANTHROPIC_API_KEY=... npm run news:fetch   # a full run that publishes nothing
ANTHROPIC_API_KEY=... npm run eval:news              # the golden set, through live prompts and the judge
```

- `scripts/fetch-news.mjs` — orchestration, the judge gate, run outcomes
- `scripts/news/feeds.mjs` — fetching and feed validation
- `scripts/news/summarize.mjs` — both prompts and the prompt version
- `scripts/news/judge.mjs` — the four checks a summary must pass
- `scripts/news/gates.mjs` — the deterministic checks (G1–G7)
- `scripts/news/closers.mjs` — the vetted sentences and their sources
- `scripts/news/publish.mjs` — branch writes, live verification, the publish invariant
- `scripts/news/withhold.mjs` — removal, and confirming it went live
- `.github/scripts/news-incident.sh` — what turns a bad run into one email

Changing a prompt means re-running `eval:news` first. Changing a closing sentence means
re-verifying its primary source, per `CLAUDE.md`'s citation standard.

**Known gap — the freshness watchdog is NOT BUILT yet.** It is decided (it will live in
`dc-bills-tracker`, polling this site's feed timestamp, ~36h threshold) but that repo has
not been touched: its existing `data-freshness-check.yml` watches bill data, not news.
Until it exists, a news job that silently stops running will not alert anyone. When built,
it will still ride the same GitHub scheduler it watches — accepted, to avoid a new vendor.
