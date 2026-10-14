You are reviewing work in the representdc-main repo (React/Vite site + an unattended GitHub Actions news pipeline: scripts/fetch-news.mjs, scripts/news/*.mjs, .github/workflows/fetch-news.yml, .github/scripts/news-incident.sh; tests in scripts/eval/*.test.mjs). Read-only. Read the code yourself; do not trust my descriptions.

Context: from 2026-10-12 to 2026-10-14 the repo's ANTHROPIC_API_KEY returned 401. Four scheduled runs ended `not-published (run threw: 401 ...)`, the live feed froze, and an external watchdog fired. The key has been replaced; a dry run (workflow_dispatch dry_run=true) passed.

Review three things. For each finding give severity (BLOCKER / MATERIAL / NOTE), file:line, a concrete failure scenario, and a recommended fix. "No material findings" is a valid answer.

1. COMMITTED CODE — commit c402f9e ("Decode HTML entities in news headlines"): `git show c402f9e`. Titles like "DC&#8217;s" (inside CDATA) were reaching the page raw. Check correctness of decodeEntities and where it is applied: double-decoding risks, entity-shaped text that should stay literal, interaction with the relevance filter / numeric-grounding gate (scripts/news/gates.mjs) / judge, whether `link` or other fields also need it, and whether the page (src/NewsAndAnalysis.jsx) could now render anything unsafe (React text escaping).

2. PROPOSED FIXES (not yet written) to .github/scripts/news-incident.sh:
   a. A dry run currently counts as healthy and closed open incident #3 ("nothing published") while the live feed was still stale — a dry run publishes nothing, so it proves nothing about recovery. Proposal: when OUTCOME=dry-run, exit early with notify=none, neither opening nor closing incidents.
   b. On a thrown run, the not-published email said "reason: unknown" because the body interpolates DECISION (empty when the run threw before the summary stage). Proposal: pass the run step's existing `reason` output to the script as REASON and use it in the not-published body (falling back to DECISION, then "unknown"). Check this against the script's injection/escaping concerns — the reason contains untrusted API error text and lands in an issue body, an email, and $GITHUB_OUTPUT heredocs.
   Say whether each proposal is right, and anything else in the incident/alert path the outage exposed.

3. DESIGN DECISION — what should a dead or failing Anthropic API do to the headlines? Today the relevance filter (filterByRelevance, an AI call) throws, so the run publishes nothing and the last good file stays up. Options I'm weighing:
   (a) keep that behavior, and add a reader-facing "Last checked <time> ET" line on /news (from the feed's lastUpdated), plus "· Newest coverage: <date>" when the newest article is >7 days old, and hide the AI summary when the newest article is >14 days old (the 72h summary cutoff is keyed on run time, so a fresh-looking summary of 5-week-old news currently shows, e.g. "A senator recently committed..." about an Aug 24 item). Recommended.
   (b) add a non-AI keyword fallback filter so headlines still refresh when the API is down.
   (c) do nothing.
   Note: in (a), during an outage lastUpdated does not advance, so "Last checked" honestly ages. Evaluate the options and any flaw in (a) — e.g. does lastUpdated actually mean "checked" in every outcome, how withhold.mjs writes interact with it, and edge cases in the page's freshness logic.

Be concise. No praise, no restating the code.
