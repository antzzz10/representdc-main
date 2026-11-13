Reading additional input from stdin...
OpenAI Codex v0.159.2
--------
workdir: /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
model: gpt-6.1-sol
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 01a1d571-e005-7f62-82a7-f53589d57f1d
--------
user
Review the last commit in this repository (git show HEAD): it adds sorting (last name, most recently signed on, state) and a party filter to src/components/MemberLookup.jsx, with helpers in the new src/data/memberSort.js. Context: src/data/statehoodBill.js (memberStatuses supplies the rows), src/components/MemberRow.jsx, src/StatehoodBill.css, CLAUDE.md, DESIGN-GUARDRAILS.md. Look for correctness bugs (sort order, ties, null party/date rows, state across the House/Senate tabs, React hook misuse), accessibility problems (keyboard, labels, live region), and anything that breaks existing behaviour. Read-only: do not edit files. Report findings as BLOCKER / MATERIAL / NOTE with file:line and a concrete failure scenario; say "no findings" if none.
codex
I’ll read the review guidance and commit, then check sorting, filtering, tab state, and accessibility without editing files.
exec
/bin/zsh -lc 'pwd; git status --short; git show --stat --oneline HEAD; for p in /Users/andriathomas/Projects/andria-agent-system/shared/WORKING_GUIDE.md /Users/andriathomas/Projects/andria-agent-system/shared/REVIEW_POLICY.md; do cat "$p"; done' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
/Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-NzSRRK6S' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-ajdKh0br' (errno=Operation not permitted)
?? reviews/2026-11-13-cosponsor-sort-filter-codex-high.raw.md
?? reviews/2026-11-13-cosponsor-sort-filter-codex-medium.raw.md
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-LhykcplG' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-BrxzjDEo' (errno=Operation not permitted)
7d35662 statehood-bill: sort the member list by last name, sign-on date or state; filter by party
 src/components/MemberLookup.jsx | 39 ++++++++++++++++++++++++--
 src/data/memberSort.js          | 62 +++++++++++++++++++++++++++++++++++++++++
 2 files changed, 98 insertions(+), 3 deletions(-)
# Andria's AI Working Guide

**Canonical cross-tool source**  
**Version:** v2.5 — November 12, 2026 (ideas are filed in full, never lost); v2.4 — October 20, 2026 (one-off updates go through the agent, not document hunting); v2.3 — October 16, 2026 (open-files rule moved here from the Claude adapter); v2.2 — October 16, 2026 (review tiers; raw-first for Tier 2 only); v2.1 — October 16, 2026 (code change sets get two review passes); v2.0 — October 8, 2026 (moved from `~/Projects/ai-collaboration/working-guide.md`, last reviewed there October 3, 2026)

This guide governs Claude Code, Codex, and other coding agents across Andria's projects. Explicit task instructions and more-specific project guidance override it. Tool-specific mechanics belong in the adapters (`adapters/` in this repository), not here.

It is part of the shared agent operating system in `~/Projects/andria-agent-system`, the single canonical source for cross-project agent rules. The rest of that system (operating model, review policy, memory boundaries, hypotheses, pilot evaluation) lives beside it in `shared/`, `system/` and `pilots/`. Material in `~/Projects/ai-collaboration` is a supporting reference: the learning plan's autonomy criteria and evidence, and the historical decision notes cited below. It does not govern.

## Background and objective

Andria's background is management consulting and CPO work. She is building hands-on AI-technical credibility and may found a company. Explain technical concepts through their purpose, evidence, and tradeoffs so she can confidently discuss them with engineers, executives, or investors.

Claude Code is currently the default strategy and design partner. Codex is the default technical partner for investigation, independent review, and bounded low-risk implementation at earned autonomy A3. Autonomy levels and their change rules are set in § Autonomy and calibration below.

## Phase-appropriate AI use

- **Strategy and product direction:** Andria leads. Use sequential, human-in-the-loop discussion. Agents may broaden options or stress-test a formed direction; they do not choose what is worth building.
- **Research and synthesis:** Parallel evidence lanes are useful after Andria reviews the research plan.
- **Execution:** Supervised or autonomous work is appropriate only when direction is settled, scope is bounded, and output is verifiable.
- Always review the plan before agents execute multi-step research or implementation.
- **Prototypes as feedback vehicles:** a clickable prototype is a non-trivial investment when the result has to withstand scrutiny. A half-finished interactive artifact redirects the conversation onto its own gaps—placeholder copy, invented mechanics, unbuilt sections—and away from the feedback it was meant to carry. Before proposing one, ask whether there is time to invest in the quality of the experience. Default to annotated screenshots or static mockups; build the interactive version when the interaction itself is what is under discussion, or when the recipient has asked to click through it.

## Communication and attention

- Confirm a delegated task in one or two lines: what you will do and what you will decide independently.
- **When Andria needs to review a file, open it for her** instead of only giving a path. Markdown opens rendered in Obsidian, in a new tab (`~/Projects` is a registered vault), never as raw text. Other files open in native Apple apps (Numbers, Pages, Keynote, Preview). She has no Microsoft Office, so don't suggest Excel or Word. Tool-specific commands live in the adapters.
- **Don't make Andria hunt for a document to make one update.** She's glad to do focused document sessions of at least 10–15 minutes. Finding and opening a file for a single change costs more attention than the change is worth. For a one-off update (a tracker row, a date, a reaction), look for the facts first and ask her only for what's missing, in a sentence. Then write it in the right place yourself, within the task's authorization and in the workspace that owns it (family items stay in the family workspace). Approval rules for external writes still apply. When she must work in documents herself, batch that work into one session and give her a single file linking everything that needs her. Where she keeps a running capture list, file each item where it belongs and clear only the items that were filed; leave unresolved ones in place.
- **Ideas don't go to a dead-letter box.** When Andria shares an idea or a comment on direction in any session, file it in that project's private `IDEAS.md` (see the `resync` skill): her words quoted in full, your interpretation on a separate line, status *new*. Then say in one line where it was filed. Family and personal items stay in the family workspace.
- Ask necessary clarifying questions together before starting. Do not interrupt later for non-blocking questions.
- For work expected to exceed about two minutes, state a time estimate and whether Andria should stay, do something routine, or step away.
- Batch progress into a concise digest ordered by decision urgency; avoid streams of incremental pings.
- After a long absence or task, lead with: where we left off, outcomes since then, and the one decision now required.
- Explain tradeoffs and give explicit options with a recommendation when multiple good paths exist.
- State completion precisely: built, tested, verified, committed, pushed, and deployed are different states.
- **Investigate before escalating.** Before asking Andria an operational question, inspect the available evidence: files, history, diffs, logs and prior decisions. Ask only when the ambiguity is material, inspection or an existing rule cannot safely resolve it, and waiting would block useful progress or create meaningful risk. Do not make her the integration layer for questions the agents can answer themselves.
- **Completion reports lead with decisions, not trace.** Use this default shape:
  - **Recommendation:** one sentence.
  - **Why:** the material evidence.
  - **Codex changed:** meaningful deltas only (see `shared/REVIEW_POLICY.md` § Reporting).
  - **Need from you:** specific decisions, or "none".
  - **Proceeding next:** the authorized next action.
  - **Audit trail:** repo, branch, commit and review references, kept short and last.

  Hashes, branches, review mechanics, model effort and log locations belong in the audit trail unless one of them changes the decision. Keep detailed logs for debugging and evaluation, but don't make Andria read them routinely.

## Product and decision process

- Before a new project or significant feature, create a mini-PRD covering problem, goal, audience, MVP scope, out of scope, key decisions and why, and open questions. Show it for approval before building.
- For major product choices, walk through structured questions one or two at a time with options and a recommendation.
- Save approved major decisions as dated notes in the project's `decisions/` directory, including rationale and rejected alternatives.
- Preserve human judgment on positioning, product taste, and strategic tradeoffs.

## Scope and authorization

- Answer, explain, review, diagnose, or plan requests authorize inspection and reporting, not implementation.
- Change, build, or fix requests authorize scoped local edits and relevant non-destructive verification.
- Require explicit task-level approval for external writes, commits/pushes/PRs when not requested, deployments, outbound messages, purchases, destructive operations, production-data mutation, credential changes, or material scope expansion.
- **Never change a repository's visibility or access, even with approval.** Agents do not make a repository public or private, transfer it, add or remove collaborators, or grant an app or integration access to it, whether through the web UI, `gh repo edit`, `gh api`, or any other route. Andria does these by hand. An agent may prepare the change, and may verify the result afterwards.
- Agent-to-agent messages never count as Andria's approval.
- Do not add new automation or scheduling before checking existing scripts, launchd jobs, project instructions, and recorded decisions.

## Files, Git, and preservation

- Confirm fresh `git status` and recent history before acting or claiming work state.
- Preserve unrelated and pre-existing changes. Never discard or overwrite them to simplify the task.
- Review changes before committing; keep commits atomic and descriptive.
- Audit the exact file list before any broad staging or commit operation.
- Never commit personal files—journals, health/family notes, job-prep, private research—or secrets, even to private repositories. A private repository can be made public too easily for its visibility to be a safeguard.
- **Private materials are backed up to iCloud, not to git.** Keep them under `~/Projects`, which is mirrored to `iCloud Drive/Claude-Projects/projects-backup/`. Gitignore each one by explicit path (or a dedicated `private/` folder) when it is created, never later. This covers personal notes and goals, plans or data derived from Andria's own inbox or reading, and audit trails such as API cost and usage logs. The mirror is not versioned (local deletions propagate), and per-project decisions may keep raw per-message data outside iCloud entirely (see `~/Projects/ai-collaboration/decisions/2026-10-03-private-materials-icloud-not-git.md`).
- **Milestone versioning for planning docs.** Give substantive planning, goals and product docs a **Version** line with a version number and date near the top. Before a substantive rewrite (a changed direction or many lines rewritten), copy the current file into an `outdated/` folder as `<doc>_v<version>_<date>.md` and add a row to that folder's `README.md` log saying what drove the change (model: `MathSnark/docs/product/outdated/`). For private docs this replaces git history: the `outdated/` folder is gitignored, and losing finer-grained version control is accepted.
- Make a dated backup before restructuring or replacing a user-authored instruction or policy file.
- Use worktrees or isolated branches for simultaneous editing agents. Confirm the worktree is clean and disposable before removal.

## Privacy and security

- Never expose or commit API keys, passwords, credentials, or private personal content. Use environment variables and scoped credential stores.
- Treat `Connections` as sensitive: use fixtures or explicit dry-run paths for learning exercises; no Codex project trust entry or broad access by default.
- `payne-sat-academy` belongs to someone else and is read-only; never commit or push without an explicit in-the-moment request.
- Do not recommend workflows built on Andria's personal Gmail account; she is moving to ProtonMail. Exceptions: Matrix Mail's Gmail integration, and automated alert emails from the dedicated sender-only alert account to Andria's own-domain address (both addresses are in the decision note cited below). Scheduled alerts to that address have standing approval; adding new alert types or recipients still needs task-level approval (see `~/Projects/ai-collaboration/decisions/2026-09-15-alert-channels.md`).
- Validate inputs, check dependency risk, and explain the root cause when something breaks.
- **Calibrate privacy severity to actual exposure.** Keep identifying or sensitive information out of this cross-project repository. Inside a project repository, necessary non-identifying context about private-use participants (for example, "initial learners") may stay. Treat a reference as a BLOCKER only when it creates a real privacy, publication or data-handling risk, such as a name, an identifying relationship, raw research data, or content headed somewhere public. Otherwise, it is a NOTE or MATERIAL finding, sized to its consequence.

## Engineering preferences

- Prefer readable, measured solutions over cleverness or speculative optimization.
- Use existing repository patterns before introducing new architecture.
- Prefer lightweight dependencies and assess bundle impact before adding one.
- For React, prefer functional components, hooks, modern JavaScript, destructured props, and component files under roughly 200 lines when practical.
- Separate UI, logic, and data; comment non-obvious rationale rather than obvious mechanics.
- Run repository-defined build/lint/test checks. Where no suitable suite exists, prefer a focused browser walkthrough over introducing a test framework without approval.
- Flag useful eval opportunities for AI-powered features; do not assume an eval framework exists.
- Newsletter and email HTML must include mobile-responsive behavior at a 600px breakpoint or narrower.
- For applications that call the Claude API, log `response.usage` to a separate ignored JSONL file; do not hard-code mutable pricing assumptions.

## External services and bulk operations

- Before any bulk or external-service operation (batch jobs, backfills, large fetches, mass API calls), state: the needed-by time; the volume; the service's quotas and rate limits; what its status fields actually measure; cost vs. delay; a named fallback trigger with its cost; and who monitors it until it reaches a terminal state.
- Run a representative trial end to end (submit → complete → collect) before scaling. Revise expectations when the trial disagrees with documentation.
- Build quota handling, backoff, expiry and partial-completion recovery into the first implementation, not as follow-ups.
- Never diagnose from a status field without checking its definition. Report provider behavior separately from our own exposure.
- When something doesn't go as expected, identify the root cause, including our own decisions, and record the lesson, not just the fix (see `~/Projects/ai-collaboration/decisions/2026-09-30-bulk-external-operations.md`).

## Documentation and memory

- Keep README and deployment/setup documentation current when behavior materially changes.
- Project-specific architecture, commands, status, and domain rules live with that project.
- `~/Projects/QUEUE.md` is the cross-project backlog. Add mid-task ideas there only when the task or Andria authorizes queue maintenance.
- `CLAUDE.md` is Claude Code's portable project source of truth; `AGENTS.md` is Codex's durable project guidance. Do not blindly duplicate entire files—share stable rules and preserve tool-specific mechanics.

## Current tool roles

- **Claude Code:** default for strategy support and design; implementation fallback for ambiguous, high-risk, or broader work; independent falsifier for Codex-authored diffs when appropriate.
- **Codex:** default technical partner for investigation, independent review, and bounded low-risk local implementation at earned autonomy A3. Implementation still requires explicit task scope and objective checks. Review passes and effort follow `shared/REVIEW_POLICY.md`: code change sets get medium + high passes; plans and decisions get one appropriately configured pass per gate by default.
- **Launching Codex non-interactively:** run `codex exec` with stdin closed (`< /dev/null`). Otherwise a background run waits silently for input that never arrives. Check a background run's log within about 30 seconds; no progress past `Reading additional input from stdin...` means it has stalled (see `~/Projects/ai-collaboration/decisions/2026-10-03-codex-exec-stdin.md`).
- **Selection rule:** choose by task and current evidence, not a permanent primary-model label. Reassess after material model/tool changes or when observed quality, speed, safety, or intervention burden shifts.
- On reviews of Claude-authored **Tier 2 (high-stakes) code**, Andria reads raw Codex output before Claude assesses it. For Tier 0–1, raw output is saved and Andria gets the summary, unless a BLOCKER or MATERIAL finding is rejected or downgraded, or the passes materially disagree (`shared/REVIEW_POLICY.md` § Raw-first by tier). Claude proposes the tier, and Andria can raise it. **When unsure, use Tier 2.** Tier 2 code also gets a triaged attack-frame Codex pass, except in MathSnark, whose own one-round rule governs. Record disagreements and the evidence deciding them.
- Repository configuration `trust_level` is not equivalent to earned autonomy.

## Autonomy and calibration

These rules are canonical here. They were frozen from `~/Projects/ai-collaboration/learning-plan-current.md` (as of September 8, 2026). That plan and its exercises remain the evidence programme, but editing them does not change these rules.

- **Current levels:** Codex A3, as described under § Current tool roles. Claude: default strategy/design partner and implementation fallback.
- **Raising a level** needs the evidence the learning plan specifies, plus a decision in `system/decisions/` with Codex review and Andria's approval.
- **Stop rules:**
  - A material guardrail failure reduces earned autonomy by one level and requires a focused retest.
  - Stay at the current level if results are accurate but insufficiently repeated.
  - Pause the calibration programme if two consecutive exercises produce mostly false positives, if Codex takes an unapproved external or destructive action, or if the curriculum repeatedly displaces higher-priority work.
- **Claude invoking Codex:** direct CLI invocation for reviews is allowed. MCP-mediated or automated invocation requires at least five logged Claude-invoked reviews, an audited disagreement log, and Andria's explicit approval.

## Project sensitivity defaults

- **Low-risk learning:** clean, dormant repositories such as `dc-action-hub`, using isolated branches for planted changes.
- **Active production:** `andriathomas-site`, RepresentDC repositories, and automated data pipelines; re-ground and review read-only before edits.
- **Dirty worktrees:** inspection is allowed; implementation is deferred unless the task explicitly addresses and preserves existing changes.
- **Sensitive/read-only:** `Connections`, `payne-sat-academy`, and private personal materials.

## Change control

Edit this guide, or the relevant `shared/` file, first, in `~/Projects/andria-agent-system`. Then regenerate both tool adapters from `adapters/` (installed as `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`, each with a dated backup first) and run fresh-session instruction checks. Changes to this guide need Andria's direction or approval, plus Codex review. Record material policy changes in a dated decision note in `system/decisions/`. Don't edit the superseded copy in `ai-collaboration`.

For browser verification, prefer an existing Playwright setup. If none exists, ask
Andria for a manual check rather than launching Google Chrome directly merely to
satisfy a process exercise.
# Review and escalation policy

Classify by consequence, not effort or technical appearance.

| Level | Meaning | System behavior |
|---|---|---|
| R0 — Routine | Local, reversible, no meaningful downstream effect | Operating Partner decides; no record required |
| R1 — Notable | Contained and reversible effect | Operating Partner decides; update current artifact if truth changes |
| R2 — Significant | Could materially change scope, roadmap, architecture, evidence interpretation, or operating policy | Decision record + Codex review before settling |
| R3 — Consequential | Direction, sensitive-data posture, external commitment, costly/irreversible path, major portfolio tradeoff | Decision record + Codex review + Andria approval |

Automatic R2 system triggers:

- changing a shared role or capability contract;
- changing escalation or review rules;
- treating a system hypothesis as supported, weakened, or rejected;
- adding a persistent agent, automated handoff, or new durable artifact;
- resolving contradictory system direction.

Automatic R3 system triggers:

- expanding access across private project boundaries;
- enabling autonomous external actions;
- granting combined access to sensitive data and action tools;
- expanding into career/civic domains without confirmed isolation;
- major cost, vendor lock-in, or difficult-to-reverse automation.

Escalate to Andria now only when the issue is material, delaying blocks useful progress or creates meaningful risk, and existing decisions do not safely resolve it.

Claude must disposition each BLOCKER/MATERIAL Codex finding as Accepted, Rejected with reason, Converted to test/uncertainty, or Escalated.

## How Codex reviews run

**Version:** v0.5 — 2026-10-16. Review tiers and raw-first by tier (`system/decisions/2026-10-16-review-tiers.md`). v0.4: code change sets get medium + high (Andria's direction; `system/decisions/2026-10-16-code-changes-get-both-review-passes.md`). The one-pass rule for plans and decisions is unchanged from v0.3 (`system/decisions/2026-10-08-canonical-source-and-review-burden.md`).

- **Code change sets: medium and high, for now.** Every Claude-authored code change set gets two Codex passes, medium and high, run in parallel on the same diff. This covers app code, scripts, workflows and executable config that will be committed or deployed. Neither effort level reliably finds what the other does, and Andria isn't a software engineer, so code is where an unverified change carries the most risk for her. A diff that mixes code and documents counts as a code change set. Local-only executable changes that won't be committed or deployed (throwaway scripts in a scratchpad) are exempt. Re-checks after a BLOCKER or MATERIAL fix may be one focused pass of the changed parts. A correction that adds new behavior beyond the fix is a new change set and gets a new pair. Revisit when `system/PARKING_LOT.md` P-01 (other ways to build confidence in generated code) produces an alternative.
- **Plans, decisions and documents: one pass per gate by default.** Use one appropriately configured Codex review per R2 gate. Run a second pass only:
  - after a BLOCKER or MATERIAL correction, as a focused re-check of the changed parts;
  - when the first review was technically incomplete (it stalled, lost access to sources, or skipped a required scope);
  - for an R3 decision where independent confirmation is justified.

  Do not routinely run both medium- and high-effort reviews of the same unchanged artifact.
- **Effort.** Choose the effort level by artifact. Use `high` for R2/R3 plans, decisions and audits. In the bootstrap, high raised one novel MATERIAL finding and upgraded one NOTE to MATERIAL, so high is the provisional choice; the data doesn't show that high dominates. Code change sets use both levels (above). Record the choice in the review file.
- **Invocation.** Claude invokes the Codex CLI directly (`codex exec -s read-only`, stdin closed or supplied from a prompt file). Plugin-mediated or automated invocation stays off until the gate in `WORKING_GUIDE.md` § Autonomy and calibration is met.
- **Raw output.** Save raw Codex output verbatim next to the reconciliation (`system/reviews/` here; the project's reviews folder for project work). It is audit trail, not something Andria reads by default.
- **Raw-first by tier (Andria, 2026-10-16; `system/decisions/2026-10-16-review-tiers.md`).** Claude states the tier, with a one-line reason, in every approval request and report. Andria may raise any tier. **When unsure, use Tier 2.**

  | Tier | What | Codex | What Andria sees |
  |---|---|---|---|
  | **0** | Plans, decisions, documents | One pass (high) | Claude's reconciled summary |
  | **1** | Low-stakes code: UI, copy, cosmetic, tests, internal scripts with no data access and no external effect | Medium + high | Summary; raw output saved |
  | **2** | High-stakes code: anything touching user or personal data, privacy, deletion, credentials, money, public or child-facing output, scheduled automation, or with downstream effects on any of these | Medium + high, plus an attack-frame pass (triaged by Claude against the severity bar) | **Raw output first**, before Claude's assessment |

  **Escalate raw to Andria at any tier** when Claude rejects or downgrades a BLOCKER or MATERIAL finding, or when the Codex passes disagree on a material point.

  **Where a change fits more than one tier, the higher tier wins.** For example, UI copy that's public or child-facing is Tier 2.

  **Project rules govern their own projects.** MathSnark's code is child-facing, so it's Tier 2 with raw-first. But its project rule (one medium + high round per change set; re-verification only for wrong math, child-facing tone, data loss or privacy) takes precedence: the attack-frame pass does **not** apply to MathSnark unless Andria asks for it.
- **Measure the burden.** Log each pass in the pilot's review-burden table (`pilots/mathsnark/EVALUATION_PLAN.md`).

## Reporting reviews to Andria

Do not list every review comment. Report only:

- the number of BLOCKER and MATERIAL findings;
- what changed because of them;
- any finding rejected, and why;
- any unresolved disagreement that needs her judgment.

"No material findings" is a complete, valid result. The full disposition table stays in the decision record or review file (audit trail).

## Severity calibration

BLOCKER means proceeding would cause real harm or an irreversible problem: a genuine privacy, publication, data-handling, correctness or safety risk, or loss of user work. Size privacy findings by actual exposure and consequence (working guide § Privacy and security). Non-identifying context about private-use participants inside the owning project repository is not a BLOCKER.

exec
/bin/zsh -lc 'for d in /Users /Users/andriathomas /Users/andriathomas/Projects /Users/andriathomas/Projects/representdc-main /Users/andriathomas/Projects/representdc-main/.claude /Users/andriathomas/Projects/representdc-main/.claude/worktrees /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter; do if [ -f "$d/AGENTS.md" ]; then printf '"'\\n%s\\n' \""'$d/AGENTS.md"; cat "$d/AGENTS.md"; fi; done' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
exec
/bin/zsh -lc "rg --files -g AGENTS.md -g CLAUDE.md -g DESIGN-GUARDRAILS.md -g package.json -g '*test*' -g '*spec*' -g '*playwright*' -g '"'!package-lock.json'"' -g '"'!node_modules'"' -g '"'!reviews/**'"'" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
package.json
CLAUDE.md
scripts/eval/race.test.mjs
scripts/eval/news.test.mjs
DESIGN-GUARDRAILS.md

exec
/bin/zsh -lc 'nl -ba src/data/statehoodBill.js; nl -ba src/StatehoodBill.css' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
     1	// Validation and derivations for /statehood-bill. Pure functions only, so the page and any
     2	// future check script share one definition of what the tracker files must look like.
     3	// Anything that fails validation is dropped whole: the page shows no number rather than a
     4	// number from a half-understood file (same rule as useBillStats). The checks below came
     5	// from the Codex medium/high/attack passes of 2026-11-10 (reviews/2026-11-10-statehood-
     6	// bill-page-codex-*.raw.md): every published total is re-derived from the rows it
     7	// summarizes, identities are canonical before any join, and links must point at the
     8	// official host they are labelled with.
     9	
    10	const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/
    11	const ISO_INSTANT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/
    12	const BIOGUIDE = /^[A-Z]\d{6}$/
    13	const STATE = /^[A-Z]{2}$/
    14	const PARTIES = new Set(['R', 'D', 'I'])
    15	// Non-voting House seats. Puerto Rico's member is a Resident Commissioner; the rest are
    16	// Delegates. Used for courtesy titles and to re-derive the non-voting subtotal.
    17	const NON_VOTING = new Set(['DC', 'PR', 'GU', 'VI', 'AS', 'MP'])
    18	// Upper bounds on any one chamber's population, voting and non-voting seats together.
    19	const CHAMBER_MAX = { house: 441, senate: 100 }
    20	// Freshness limits. The cosponsor check runs daily and the roster weekly; past these, a
    21	// "this month" or "not yet" statement could describe a world that has since changed, so
    22	// those sections are withheld (the count cards still show their own "Last checked" date).
    23	const DAY_MS = 24 * 60 * 60 * 1000
    24	const CHECK_MAX_AGE_MS = 2 * DAY_MS
    25	const ROSTER_MAX_AGE_MS = 15 * DAY_MS
    26	
    27	const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
    28	const isStr = (v) => typeof v === 'string' && v.trim() !== ''
    29	const isCount = (v) => Number.isInteger(v) && v >= 0
    30	const squash = (s) => s.trim().replace(/\s+/g, ' ')
    31	const SUFFIX = /^(jr|sr|i{1,3}|iv|v)$/
    32	// Last surname token, case-, accent- and punctuation-insensitive, generational suffix
    33	// dropped. Handles both name orders Congress.gov uses: "Donald M. Payne, Jr." and
    34	// "Payne, Donald M., Jr." \u2014 in either, the surname ends the text before the first comma.
    35	function surname(name) {
    36	  const tokens = name.split(',')[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    37	    .replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(Boolean)
    38	  while (tokens.length > 1 && SUFFIX.test(tokens.at(-1))) tokens.pop()
    39	  return tokens.at(-1) ?? ''
    40	}
    41	
    42	function validCalendar(y, mo, d) {
    43	  const dt = new Date(Date.UTC(y, mo - 1, d))
    44	  return mo >= 1 && mo <= 12 && dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d
    45	}
    46	
    47	export function isDateOnly(value) {
    48	  if (typeof value !== 'string') return false
    49	  const m = DATE_ONLY.exec(value)
    50	  return Boolean(m) && validCalendar(Number(m[1]), Number(m[2]), Number(m[3]))
    51	}
    52	
    53	// Same rule as useBillStats: Date() silently rolls "2026-02-30" into March, so the calendar
    54	// is checked before the value is trusted.
    55	export function isInstant(value) {
    56	  if (typeof value !== 'string') return false
    57	  const m = ISO_INSTANT.exec(value)
    58	  if (!m) return false
    59	  const [hour, minute, second] = [Number(m[4]), Number(m[5]), Number(m[6] ?? 0)]
    60	  if (hour > 23 || minute > 59 || second > 59) return false
    61	  return validCalendar(Number(m[1]), Number(m[2]), Number(m[3])) && !Number.isNaN(Date.parse(value))
    62	}
    63	
    64	/** Eastern calendar date (YYYY-MM-DD) of an instant. */
    65	export function etDate(instant) {
    66	  const parts = new Intl.DateTimeFormat('en-CA', {
    67	    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
    68	  }).formatToParts(new Date(instant))
    69	  const get = (t) => parts.find((p) => p.type === t).value
    70	  return `${get('year')}-${get('month')}-${get('day')}`
    71	}
    72	
    73	// A link is only shown under an official label if it really points at that host: https, no
    74	// embedded credentials, and the expected hostname (exact, or a subdomain where allowed).
    75	function officialUrl(value, hostOk, upgradeHttp = false) {
    76	  if (typeof value !== 'string') return null
    77	  try {
    78	    const u = new URL(value)
    79	    // Congress.gov lists a few member sites as http (e.g. menefee.house.gov, 2026-11-10);
    80	    // House and Senate sites all serve https, so those are upgraded rather than dropped.
    81	    if (upgradeHttp && u.protocol === 'http:') u.protocol = 'https:'
    82	    if (u.protocol !== 'https:' || u.username || u.password || u.port) return null
    83	    return hostOk(u.hostname.toLowerCase(), u.pathname) ? u.href : null
    84	  } catch {
    85	    return null
    86	  }
    87	}
    88	const isCongressGov = (h) => h === 'www.congress.gov' || h === 'congress.gov'
    89	const isGovInfo = (h) => h === 'www.govinfo.gov' || h === 'govinfo.gov'
    90	const isMemberSite = (h) => /^[a-z0-9-]+(\.[a-z0-9-]+)*\.(house|senate)\.gov$/.test(h)
    91	
    92	const CHAMBER_PREFIX = { house: /^H\.R\. \d+$/, senate: /^S\. \d+$/ }
    93	const CHAMBER_PATH = { house: 'house-bill', senate: 'senate-bill' }
    94	
    95	function chamberFromNumber(billNumber) {
    96	  if (CHAMBER_PREFIX.house.test(billNumber)) return 'house'
    97	  if (CHAMBER_PREFIX.senate.test(billNumber)) return 'senate'
    98	  return null
    99	}
   100	
   101	function person(raw) {
   102	  if (!isObj(raw) || typeof raw.bioguideId !== 'string' || !isStr(raw.name) || typeof raw.state !== 'string') return null
   103	  const bioguideId = raw.bioguideId.trim().toUpperCase()
   104	  const state = raw.state.trim().toUpperCase()
   105	  if (!BIOGUIDE.test(bioguideId) || !STATE.test(state)) return null
   106	  const d = raw.district
   107	  if (!(d === null || d === undefined || isCount(d))) return null
   108	  return {
   109	    bioguideId,
   110	    name: squash(raw.name),
   111	    party: PARTIES.has(raw.party) ? raw.party : null,
   112	    state,
   113	    district: d ?? null,
   114	  }
   115	}
   116	
   117	function bill(raw) {
   118	  if (!isObj(raw) || !isStr(raw.billNumber)) return null
   119	  const billNumber = squash(raw.billNumber)
   120	  const chamber = chamberFromNumber(billNumber)
   121	  // The chamber field, the bill number and the official URL must all agree.
   122	  if (!chamber || (raw.chamber !== undefined && raw.chamber !== chamber)) return null
   123	  const congressGovUrl = officialUrl(raw.congressGovUrl, (h, path) =>
   124	    isCongressGov(h) && path.replace(/\/+$/, '') === `/bill/${ordinal(raw.congress)}-congress/${CHAMBER_PATH[chamber]}/${billNumber.match(/\d+$/)[0]}`)
   125	  const sponsor = person(raw.sponsor)
   126	  const action = raw.latestAction
   127	  // Incomplete lists carry `totals: null` (tracker 61ba66a); zeros are accepted too.
   128	  const totals = raw.complete === false && raw.totals == null ? { cosponsors: 0, original: 0, nonVoting: 0 } : raw.totals
   129	  const complete = raw.complete !== false
   130	  if (
   131	    !Number.isInteger(raw.congress) || raw.congress < 100 ||
   132	    typeof raw.current !== 'boolean' ||
   133	    !sponsor ||
   134	    !isDateOnly(raw.introducedDate) ||
   135	    !isObj(action) || !isDateOnly(action.actionDate) || !isStr(action.text) ||
   136	    !congressGovUrl ||
   137	    // The tracker publishes `complete: false` (empty list, null totals, no checkedAt) when
   138	    // the last fetch did not return the whole list. That bill keeps its official facts but
   139	    // shows no counts, sign-ons or lookup.
   140	    (complete && !isInstant(raw.checkedAt)) ||
   141	    !Array.isArray(raw.cosponsors) ||
   142	    !isObj(totals) || !isCount(totals.cosponsors) || !isCount(totals.original) || !isCount(totals.nonVoting)
   143	  ) return null
   144	
   145	  const checkedDate = complete ? etDate(raw.checkedAt) : null
   146	  // Chronology: nothing happens before introduction or after the check that recorded it.
   147	  if (action.actionDate < raw.introducedDate || (checkedDate && action.actionDate > checkedDate)) return null
   148	
   149	  const cosponsors = []
   150	  for (const c of raw.cosponsors) {
   151	    const p = person(c)
   152	    if (!p || !isDateOnly(c.sponsorshipDate) || typeof c.isOriginalCosponsor !== 'boolean') return null
   153	    if (p.bioguideId === sponsor.bioguideId) return null // the sponsor is never a cosponsor
   154	    if (c.sponsorshipDate < raw.introducedDate || (checkedDate && c.sponsorshipDate > checkedDate)) return null
   155	    cosponsors.push({ ...p, sponsorshipDate: c.sponsorshipDate, isOriginalCosponsor: c.isOriginalCosponsor })
   156	  }
   157	  if (!complete && (cosponsors.length > 0 || totals.cosponsors > 0)) return null
   158	
   159	  // Every published total must equal what the list itself says, or neither is trusted.
   160	  const nonVoting = chamber === 'house' ? cosponsors.filter((c) => NON_VOTING.has(c.state)).length : 0
   161	  if (
   162	    cosponsors.length !== totals.cosponsors ||
   163	    cosponsors.length > CHAMBER_MAX[chamber] ||
   164	    new Set(cosponsors.map((c) => c.bioguideId)).size !== cosponsors.length ||
   165	    cosponsors.filter((c) => c.isOriginalCosponsor).length !== totals.original ||
   166	    nonVoting !== totals.nonVoting
   167	  ) return null
   168	
   169	  return {
   170	    chamber,
   171	    complete,
   172	    congress: raw.congress,
   173	    billNumber,
   174	    current: raw.current,
   175	    sponsor,
   176	    introducedDate: raw.introducedDate,
   177	    latestAction: { actionDate: action.actionDate, text: squash(action.text) },
   178	    congressGovUrl,
   179	    checkedAt: complete ? raw.checkedAt : null,
   180	    cosponsors,
   181	    totals: { cosponsors: totals.cosponsors, original: totals.original, nonVoting },
   182	  }
   183	}
   184	
   185	/** Returns { house, senate } (either may be null) or null if the file is unusable. */
   186	export function parseCosponsors(json) {
   187	  const list = Array.isArray(json?.bills) ? json.bills : null
   188	  if (!list) return null
   189	  const out = { house: null, senate: null }
   190	  for (const raw of list) {
   191	    const b = bill(raw)
   192	    if (!b) return null
   193	    if (out[b.chamber]) return null // two bills claiming one chamber: ambiguous
   194	    out[b.chamber] = b
   195	  }
   196	  return out.house || out.senate ? out : null
   197	}
   198	
   199	/**
   200	 * Returns { congress, members } or null. `expectedCongress` is the Congress named in the
   201	 * file's URL; the file must say the same, and its published counts must match its rows.
   202	 */
   203	export function parseMembers(json, expectedCongress) {
   204	  // At a Congress switch the tracker may publish a placeholder ({ congress, pending: true,
   205	  // members: [] }): no lookup yet, same as a missing file.
   206	  if (isObj(json) && json.pending === true) return null
   207	  if (!isObj(json) || json.congress !== expectedCongress || !Array.isArray(json.members) || !isInstant(json.generatedAt)) return null
   208	  const members = []
   209	  const seen = new Set()
   210	  for (const raw of json.members) {
   211	    const p = person(raw)
   212	    if (!p || (raw.chamber !== 'house' && raw.chamber !== 'senate') || typeof raw.votingMember !== 'boolean') return null
   213	    // Seat and voting status must agree: senators and state House seats vote, the six
   214	    // territorial/district seats do not.
   215	    const shouldVote = raw.chamber === 'senate' || !NON_VOTING.has(p.state)
   216	    if (raw.votingMember !== shouldVote || (raw.chamber === 'senate' && NON_VOTING.has(p.state))) return null
   217	    if (seen.has(p.bioguideId)) return null
   218	    seen.add(p.bioguideId)
   219	    members.push({
   220	      ...p,
   221	      chamber: raw.chamber,
   222	      votingMember: raw.votingMember,
   223	      officialWebsiteUrl: officialUrl(raw.officialWebsiteUrl, isMemberSite, true),
   224	    })
   225	  }
   226	  const count = (fn) => members.filter(fn).length
   227	  const actual = {
   228	    house: count((m) => m.chamber === 'house'),
   229	    senate: count((m) => m.chamber === 'senate'),
   230	    houseVoting: count((m) => m.chamber === 'house' && m.votingMember),
   231	    houseNonVoting: count((m) => m.chamber === 'house' && !m.votingMember),
   232	  }
   233	  const c = json.counts
   234	  if (!isObj(c) || Object.keys(actual).some((k) => c[k] !== actual[k])) return null
   235	  if (actual.house === 0 || actual.senate === 0 || actual.house > CHAMBER_MAX.house || actual.senate > CHAMBER_MAX.senate) return null
   236	  return { congress: expectedCongress, generatedAt: json.generatedAt, members }
   237	}
   238	
   239	function historyBill(raw, chamber) {
   240	  if (raw === null || raw === undefined) return null
   241	  if (!isObj(raw) || !isStr(raw.billNumber) || !isCount(raw.cosponsors)) return undefined
   242	  const billNumber = squash(raw.billNumber)
   243	  if (chamberFromNumber(billNumber) !== chamber || raw.cosponsors > CHAMBER_MAX[chamber]) return undefined
   244	  return { billNumber, cosponsors: raw.cosponsors, url: officialUrl(raw.url, isGovInfo) }
   245	}
   246	
   247	/** Returns an array of rows ordered by Congress, or null. */
   248	export function parseHistory(json) {
   249	  const rows = Array.isArray(json?.congresses) ? json.congresses : null
   250	  if (!rows || rows.length === 0) return null
   251	  const out = []
   252	  const seen = new Set()
   253	  for (const raw of rows) {
   254	    if (!isObj(raw) || !Number.isInteger(raw.congress) || !Number.isInteger(raw.startYear) || seen.has(raw.congress)) return null
   255	    seen.add(raw.congress)
   256	    const house = historyBill(raw.house, 'house')
   257	    const senate = historyBill(raw.senate, 'senate')
   258	    if (house === undefined || senate === undefined || (!house && !senate)) return null
   259	    const fa = raw.furthestAction
   260	    let furthestAction = null
   261	    if (fa !== null && fa !== undefined) {
   262	      if (!isObj(fa) || !isStr(fa.text) || (fa.date != null && !isDateOnly(fa.date))) return null
   263	      furthestAction = { text: squash(fa.text), date: fa.date ?? null }
   264	    }
   265	    out.push({
   266	      congress: raw.congress,
   267	      startYear: raw.startYear,
   268	      endYear: Number.isInteger(raw.endYear) ? raw.endYear : null,
   269	      // Only an explicit `final: false` marks a snapshot the live file may update.
   270	      final: raw.final !== false,
   271	      house,
   272	      senate,
   273	      furthestAction,
   274	    })
   275	  }
   276	  return out.sort((a, b) => a.congress - b.congress)
   277	}
   278	
   279	// ---- Derivations -------------------------------------------------------------------
   280	
   281	export function ordinal(n) {
   282	  const mod100 = n % 100
   283	  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
   284	  return `${n}${{ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th'}`
   285	}
   286	
   287	/** Courtesy title from chamber and seat (validated: seat and voting status agree). */
   288	export function memberTitle(chamber, state) {
   289	  if (chamber === 'senate') return 'Sen.'
   290	  if (!NON_VOTING.has(state)) return 'Rep.'
   291	  return state === 'PR' ? 'Res. Comm.' : 'Del.'
   292	}
   293	
   294	export function seatLabel(chamber, state, dist) {
   295	  return chamber === 'house' && dist ? `${state}-${dist}` : state
   296	}
   297	
   298	/** "January 3, 2025" from a validated YYYY-MM-DD, pinned to UTC so it never shifts a day. */
   299	export function formatDate(dateOnly, month = 'long') {
   300	  return new Date(`${dateOnly}T00:00:00Z`).toLocaleDateString('en-US', {
   301	    timeZone: 'UTC', month, day: 'numeric', year: 'numeric',
   302	  })
   303	}
   304	
   305	/**
   306	 * Cosponsors who signed on in the current Eastern calendar month (`now`), across the bills
   307	 * currently linked, plus the latest sponsorship date overall for the empty state. Null
   308	 * (section hidden) when any of those bills lacks a complete list checked in the last two
   309	 * days.
   310	 */
   311	export function signedThisMonth(bills, now = new Date()) {
   312	  // Only bills currently linked count, and every one of them must have a complete list
   313	  // checked recently, or "No new cosponsors since <date>" overreaches.
   314	  const shown = bills.filter((b) => b && b.current)
   315	  if (shown.length === 0) return null
   316	  if (shown.some((b) => !b.complete || now - Date.parse(b.checkedAt) > CHECK_MAX_AGE_MS)) return null
   317	  const month = etDate(now).slice(0, 7)
   318	  const rows = []
   319	  let latestDate = null
   320	  for (const b of shown) {
   321	    for (const c of b.cosponsors) {
   322	      if (!latestDate || c.sponsorshipDate > latestDate) latestDate = c.sponsorshipDate
   323	      if (c.sponsorshipDate.slice(0, 7) === month) rows.push({ ...c, chamber: b.chamber, billNumber: b.billNumber })
   324	    }
   325	  }
   326	  rows.sort((a, b) => b.sponsorshipDate.localeCompare(a.sponsorshipDate) || a.name.localeCompare(b.name))
   327	  return { rows, latestDate }
   328	}
   329	
   330	/**
   331	 * Every current member of the chamber with their status on this bill, joined by Bioguide
   332	 * ID: the sponsor, a cosponsor (with date), or not yet. Members who cosponsored and have
   333	 * since left are absent from the roster, so they count in the recorded total but not
   334	 * here. Returns null if the two files disagree about who someone is (same ID, different
   335	 * state or surname), since a wrong "Not yet" is worse than no list.
   336	 */
   337	export function memberStatuses(roster, bill, now = new Date()) {
   338	  if (!roster || roster.congress !== bill.congress || !bill.complete) return null
   339	  if (now - Date.parse(roster.generatedAt) > ROSTER_MAX_AGE_MS) return null
   340	  if (now - Date.parse(bill.checkedAt) > CHECK_MAX_AGE_MS) return null
   341	  const members = roster.members.filter((m) => m.chamber === bill.chamber)
   342	  const byId = new Map(members.map((m) => [m.bioguideId, m]))
   343	  // Same ID must mean the same person: same state and same surname. District is NOT
   344	  // compared: the cosponsor record keeps the district at sponsorship, and redistricting
   345	  // moves members (real case, 2026-11-10: McBath, GA-7 on H.R. 51, GA-6 today). Rows here
   346	  // come from the roster, so they show the member's current district.
   347	  for (const p of [bill.sponsor, ...bill.cosponsors]) {
   348	    const m = byId.get(p.bioguideId)
   349	    if (!m) continue
   350	    if (m.state !== p.state || surname(m.name) !== surname(p.name)) return null
   351	  }
   352	  const signed = new Map(bill.cosponsors.map((c) => [c.bioguideId, c.sponsorshipDate]))
   353	  return members
   354	    .map((m) => {
   355	      if (m.bioguideId === bill.sponsor.bioguideId) return { ...m, status: 'sponsor', date: null }
   356	      if (signed.has(m.bioguideId)) return { ...m, status: 'signed', date: signed.get(m.bioguideId) }
   357	      return { ...m, status: 'not-yet', date: null }
   358	    })
   359	    .sort((a, b) => a.state.localeCompare(b.state) || (a.district ?? 0) - (b.district ?? 0) || a.name.localeCompare(b.name))
   360	}
   361	
   362	/**
   363	 * History rows. A row the tracker marks provisional (`final: false`) takes its count from
   364	 * the live cosponsor file when that file holds the same bill as the current, complete one,
   365	 * so the table and the headline never disagree. Final rows are never overwritten.
   366	 */
   367	export function historyWithLive(history, house, senate) {
   368	  return history.map((row) => {
   369	    if (row.final) return row
   370	    const live = (b, side) => (b && b.current && b.complete && side && b.congress === row.congress && b.billNumber === side.billNumber
   371	      ? { ...side, cosponsors: b.totals.cosponsors }
   372	      : side)
   373	    return { ...row, house: live(house, row.house), senate: live(senate, row.senate) }
   374	  })
   375	}
     1	/* /statehood-bill. Tokens only (DESIGN-GUARDRAILS): no raw hex, no raw px in values that
     2	   carry design meaning; borders use 1px hairlines as elsewhere in App.css. */
     3	
     4	.sr-only {
     5	  position: absolute;
     6	  width: 1px;
     7	  height: 1px;
     8	  padding: 0;
     9	  margin: -1px;
    10	  overflow: hidden;
    11	  clip: rect(0, 0, 0, 0);
    12	  white-space: nowrap;
    13	  border: 0;
    14	}
    15	
    16	.page-hero .hero-subtitle {
    17	  min-height: 1.6em; /* reserves the line while the bill numbers load */
    18	}
    19	
    20	.statehood-bill {
    21	  background: var(--paper);
    22	}
    23	
    24	.sb-container {
    25	  max-width: 55rem;
    26	}
    27	
    28	.statehood-bill section {
    29	  margin-bottom: var(--s-7);
    30	}
    31	
    32	.statehood-bill h2 {
    33	  font-size: var(--fs-h2);
    34	  font-weight: 700;
    35	  color: var(--navy);
    36	  letter-spacing: var(--ls-tight);
    37	  margin: 0 0 var(--s-4);
    38	}
    39	
    40	.statehood-bill a:focus-visible,
    41	.statehood-bill button:focus-visible,
    42	.statehood-bill select:focus-visible,
    43	.statehood-bill input:focus-visible,
    44	.statehood-bill .history-scroll:focus-visible,
    45	.filter-chip:has(input:focus-visible) {
    46	  outline: 3px solid var(--gold);
    47	  outline-offset: 2px;
    48	}
    49	
    50	.section-note {
    51	  color: var(--slate-700);
    52	  font-size: var(--fs-base);
    53	  line-height: var(--lh-body);
    54	  margin: var(--s-4) 0 0;
    55	}
    56	
    57	.recent-count {
    58	  margin: 0 0 var(--s-3);
    59	}
    60	
    61	.draft-placeholder {
    62	  border: 2px dashed var(--gold);
    63	  background: var(--gold-soft);
    64	  color: var(--ink);
    65	  font-style: italic;
    66	  padding: var(--s-3) var(--s-4);
    67	  border-radius: var(--r-sm);
    68	}
    69	
    70	.mono-date,
    71	.bill-number {
    72	  font-family: var(--font-mono);
    73	}
    74	
    75	/* Chamber rows */
    76	.bill-row {
    77	  background: var(--surface);
    78	  border: 1px solid var(--line);
    79	  border-radius: var(--r-md);
    80	  padding: var(--s-4) var(--s-5);
    81	  margin-top: var(--s-4);
    82	}
    83	
    84	.bill-transition {
    85	  margin: 0 0 var(--s-3);
    86	  font-weight: 700;
    87	  color: var(--navy);
    88	}
    89	
    90	.bill-row-head {
    91	  display: flex;
    92	  gap: var(--s-3);
    93	  align-items: baseline;
    94	  margin: 0 0 var(--s-3);
    95	}
    96	
    97	.bill-number {
    98	  font-size: var(--fs-lg);
    99	  font-weight: 600;
   100	  color: var(--navy);
   101	}
   102	
   103	.bill-chamber {
   104	  font-size: var(--fs-sm);
   105	  color: var(--slate-500);
   106	  font-weight: 600;
   107	}
   108	
   109	.bill-facts {
   110	  display: grid;
   111	  gap: var(--s-2);
   112	  margin: 0;
   113	}
   114	
   115	.bill-facts > div {
   116	  display: grid;
   117	  grid-template-columns: 9rem 1fr;
   118	  gap: var(--s-3);
   119	}
   120	
   121	.bill-facts dt {
   122	  font-size: var(--fs-sm);
   123	  font-weight: 600;
   124	  color: var(--slate-500);
   125	}
   126	
   127	.bill-facts dd {
   128	  margin: 0;
   129	  color: var(--ink);
   130	}
   131	
   132	.statehood-bill a {
   133	  color: var(--navy);
   134	  font-weight: 600;
   135	}
   136	
   137	/* Party badge: letter + screen-reader word, so colour is never the only signal. */
   138	.party-badge {
   139	  display: inline-flex;
   140	  align-items: center;
   141	  justify-content: center;
   142	  min-width: 1.4em;
   143	  height: 1.4em;
   144	  padding: 0 0.3em;
   145	  border-radius: var(--r-sm);
   146	  font-size: var(--fs-xs);
   147	  font-weight: 700;
   148	  color: var(--white);
   149	  flex-shrink: 0;
   150	}
   151	
   152	.party-badge--d { background: var(--party-d); }
   153	.party-badge--r { background: var(--party-r); }
   154	.party-badge--i { background: var(--party-i); }
   155	
   156	.member-name {
   157	  display: inline-flex;
   158	  gap: var(--s-2);
   159	  align-items: baseline;
   160	}
   161	
   162	.member-seat {
   163	  color: var(--slate-500);
   164	}
   165	
   166	/* Counts */
   167	.count-grid {
   168	  display: grid;
   169	  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
   170	  gap: var(--s-4);
   171	}
   172	
   173	.count-card {
   174	  background: var(--surface);
   175	  border: 1px solid var(--line);
   176	  border-radius: var(--r-md);
   177	  padding: var(--s-5);
   178	}
   179	
   180	.count-card p {
   181	  margin: 0;
   182	}
   183	
   184	.count-label {
   185	  font-size: var(--fs-xs);
   186	  font-weight: 700;
   187	  text-transform: uppercase;
   188	  letter-spacing: var(--ls-label);
   189	  color: var(--slate-500);
   190	}
   191	
   192	.count-number {
   193	  font-family: var(--font-mono);
   194	  font-size: var(--fs-display);
   195	  font-weight: 600;
   196	  color: var(--navy);
   197	  line-height: var(--lh-tight);
   198	  margin: var(--s-2) 0 !important;
   199	}
   200	
   201	.count-number .count-unit {
   202	  font-family: var(--font-sans);
   203	  font-size: var(--fs-lg);
   204	  font-weight: 600;
   205	  margin-left: var(--s-2);
   206	}
   207	
   208	.count-note {
   209	  color: var(--slate-700);
   210	}
   211	
   212	.count-checked {
   213	  margin-top: var(--s-3) !important;
   214	  font-size: var(--fs-sm);
   215	  color: var(--slate-500);
   216	}
   217	
   218	/* Recent sign-ons and member rows share one row shape. */
   219	.recent-list,
   220	.member-list {
   221	  list-style: none;
   222	  margin: 0;
   223	  padding: 0;
   224	  background: var(--surface);
   225	  border: 1px solid var(--line);
   226	  border-radius: var(--r-md);
   227	}
   228	
   229	.recent-row,
   230	.member-row {
   231	  display: grid;
   232	  grid-template-columns: 1fr auto;
   233	  gap: var(--s-3);
   234	  align-items: baseline;
   235	  padding: var(--s-3) var(--s-4);
   236	  border-bottom: 1px solid var(--line);
   237	}
   238	
   239	.member-row {
   240	  grid-template-columns: 1fr 10rem 9rem;
   241	}
   242	
   243	.recent-row:last-child,
   244	.member-row:last-child {
   245	  border-bottom: 0;
   246	}
   247	
   248	.member-status {
   249	  font-size: var(--fs-sm);
   250	  color: var(--slate-700);
   251	}
   252	
   253	.member-row--sponsor .member-status,
   254	.member-row--signed .member-status {
   255	  font-weight: 600;
   256	  color: var(--navy);
   257	}
   258	
   259	.member-link {
   260	  font-size: var(--fs-sm);
   261	  text-align: right;
   262	}
   263	
   264	/* Lookup controls */
   265	.lookup-tabs {
   266	  display: flex;
   267	  flex-wrap: wrap;
   268	  gap: var(--s-1);
   269	  border-bottom: 1px solid var(--line-2);
   270	  margin-bottom: var(--s-4);
   271	}
   272	
   273	.lookup-tab {
   274	  font: inherit;
   275	  font-weight: 600;
   276	  background: none;
   277	  border: 0;
   278	  border-bottom: 3px solid transparent;
   279	  padding: var(--s-2) var(--s-4);
   280	  color: var(--slate-700);
   281	  cursor: pointer;
   282	}
   283	
   284	.lookup-tab[aria-selected='true'] {
   285	  color: var(--navy);
   286	  border-bottom-color: var(--navy);
   287	}
   288	
   289	.lookup-controls {
   290	  display: flex;
   291	  flex-wrap: wrap;
   292	  gap: var(--s-4);
   293	  align-items: flex-end;
   294	  margin-bottom: var(--s-3);
   295	}
   296	
   297	.lookup-filters {
   298	  display: flex;
   299	  flex-wrap: wrap;
   300	  gap: var(--s-2);
   301	  border: 0;
   302	  margin: 0;
   303	  padding: 0;
   304	}
   305	
   306	.filter-chip {
   307	  position: relative;
   308	  cursor: pointer;
   309	  border-radius: var(--r-pill);
   310	}
   311	
   312	.filter-chip input {
   313	  position: absolute;
   314	  opacity: 0;
   315	  inset: 0;
   316	  margin: 0;
   317	  cursor: pointer;
   318	}
   319	
   320	.filter-chip span {
   321	  display: inline-block;
   322	  padding: var(--s-1) var(--s-3);
   323	  border: 1px solid var(--line-2);
   324	  border-radius: var(--r-pill);
   325	  background: var(--surface);
   326	  font-size: var(--fs-sm);
   327	  font-weight: 600;
   328	  color: var(--slate-700);
   329	}
   330	
   331	.filter-chip input:checked + span {
   332	  background: var(--navy);
   333	  border-color: var(--navy);
   334	  color: var(--white);
   335	}
   336	
   337	.lookup-field {
   338	  display: flex;
   339	  flex-direction: column;
   340	  gap: var(--s-1);
   341	  font-size: var(--fs-sm);
   342	  font-weight: 600;
   343	  color: var(--slate-700);
   344	}
   345	
   346	.lookup-field select,
   347	.lookup-field input {
   348	  font: inherit;
   349	  font-weight: 400;
   350	  padding: var(--s-1) var(--s-2);
   351	  border: 1px solid var(--line-2);
   352	  border-radius: var(--r-sm);
   353	  background: var(--surface);
   354	  color: var(--ink);
   355	  min-height: 2.25rem;
   356	}
   357	
   358	.lookup-count {
   359	  font-size: var(--fs-sm);
   360	  color: var(--slate-500);
   361	  margin: 0 0 var(--s-2);
   362	}
   363	
   364	.lookup-empty {
   365	  font-weight: 700;
   366	  color: var(--navy);
   367	}
   368	
   369	/* History table: scrolls sideways on narrow screens rather than squeezing. */
   370	.history-scroll {
   371	  overflow-x: auto;
   372	  background: var(--surface);
   373	  border: 1px solid var(--line);
   374	  border-radius: var(--r-md);
   375	}
   376	
   377	.history-table {
   378	  width: 100%;
   379	  min-width: 40rem;
   380	  border-collapse: collapse;
   381	  font-size: var(--fs-sm);
   382	}
   383	
   384	.history-table caption {
   385	  text-align: left;
   386	  padding: var(--s-3) var(--s-4);
   387	  color: var(--slate-500);
   388	}
   389	
   390	.history-table th,
   391	.history-table td {
   392	  text-align: left;
   393	  padding: var(--s-2) var(--s-4);
   394	  border-top: 1px solid var(--line);
   395	  white-space: nowrap;
   396	}
   397	
   398	.history-table thead th {
   399	  color: var(--slate-500);
   400	  font-weight: 600;
   401	}
   402	
   403	.history-table tbody th {
   404	  font-weight: 600;
   405	  color: var(--navy);
   406	}
   407	
   408	.history-table .num {
   409	  text-align: right;
   410	}
   411	
   412	.history-table tbody .num {
   413	  font-family: var(--font-mono);
   414	}
   415	
   416	.history-table td:last-child {
   417	  white-space: normal;
   418	  min-width: 10rem;
   419	}
   420	
   421	.sources-block .sources-heading {
   422	  font-size: var(--fs-xs);
   423	  font-weight: 700;
   424	  text-transform: uppercase;
   425	  letter-spacing: var(--ls-label);
   426	  color: var(--slate-500);
   427	  margin: 0 0 var(--s-3);
   428	}
   429	
   430	@media (max-width: 600px) {
   431	  .bill-row {
   432	    padding: var(--s-3) var(--s-4);
   433	  }
   434	
   435	  .bill-facts > div {
   436	    grid-template-columns: 1fr;
   437	    gap: 0;
   438	  }
   439	
   440	  .recent-row,
   441	  .member-row {
   442	    grid-template-columns: 1fr;
   443	    gap: var(--s-1);
   444	  }
   445	
   446	  .member-link {
   447	    text-align: left;
   448	  }
   449	
   450	  .lookup-controls {
   451	    flex-direction: column;
   452	    align-items: stretch;
   453	  }
   454	
   455	  .count-number {
   456	    font-size: var(--fs-h1);
   457	  }
   458	}

exec
/bin/zsh -lc 'cat CLAUDE.md DESIGN-GUARDRAILS.md package.json; nl -ba src/components/MemberLookup.jsx; nl -ba src/data/memberSort.js; nl -ba src/components/MemberRow.jsx' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
# RepresentDC — Landing Page

This repo is the main site of **representdc.org**, a three-app DC statehood advocacy platform (all built with Claude Code, hosted on GitHub Pages with CNAME subdomains).

| App | Directory | URL | Purpose |
|-----|-----------|-----|---------|
| **Landing Page** | `representdc-main/` (this repo) | www.representdc.org | Advocacy site with loss-framing messaging, live bill stats, CTAs to the other tools |
| Bill Tracker | `../dc-bills-tracker/` | billtracker.representdc.org | 71+ anti-DC bills, automated Congress.gov monitoring |
| Candidate Tracker | `../dc-statehood-pledge/` | candidates.representdc.org | 2026 candidate questionnaire responses |
| Bill archive (data, private) | `../representdc-data/` | github.com/antzzz10/representdc-data | Permanent official bill histories from GovInfo; daily update. See `decisions/2026-11-08-bill-history-archive.md` |

**Stack:** React 19, Vite 7, ESLint 9, gh-pages.
**Cross-site links:** all three sites link to each other in navigation/footers — keep links intact when editing nav.

**Commands:**
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run deploy   # Deploy to GitHub Pages
```

**Shared data files:** `~/Projects/dc-advocacy-files/` (iCloud-synced, not in any repo) — `dc-candidates-2026.json` is the master candidate database.

## Content standards

**Citations (established 2026-08-12, `/myths-and-faq` audit).** Every source link — inline
and in a page's Sources list — must point at the specific page holding the supporting
figure, never an organization's homepage. If a stated fact can't be tied to a live,
current URL from an objective source, remove the fact rather than hedge it. Prefer primary
sources (IRS Data Book, Census tables, `code.dccouncil.gov`, NPS, OSSE, CRS via
everycrsreport.com) over advocacy restatements — swapping one in often corrects the claim.
Verify links with a browser User-Agent before shipping; several legitimate sources 403
bare `curl` while serving browsers fine.

**No self-descriptive copy.** Never write reader-facing text in which the site explains its
own editorial choices, sourcing method, or reasoning. A citation list demonstrates rigor by
existing; narrating it reads as defensive. Keep that reasoning in code comments or a
`decisions/` note. Same rule bars capacity language, named current officeholders, and
hardcoded fast-moving numbers in org/partner descriptions.

**No duplicative hero subheadings (established 2026-09-11, `/reading` hero rewrite).** A
page-hero's `<h1>` and its `<p>` must each carry distinct information — a subheading that
restates the headline in different words is padding, not content, and reads as an AI tell.
If the subheading has nothing to add, cut it entirely rather than write a redundant one —
`StatehoodCurious.jsx`'s headline-only hero is the pattern for that case. This overlaps
with "No self-descriptive copy" above: a subheading that narrates the page's own
process/rigor ("credited in full," "full sourcing for every claim") is self-descriptive
copy *and* usually duplicates what the content itself already demonstrates.

**Git:** commit directly to `main` — parallel Claude sessions share this one checkout, so
`git checkout -b` silently moves the other session onto your branch. Stage named paths
only; another session's in-progress edits are often sitting dirty in the tree.
# RepresentDC — Design, Content & Goals Guardrails

Consolidated from the Claude Design "RepresentDC Design System" project, this repo's
`STRATEGY.md` and `DEVELOPMENT-GUIDELINES.md`, and conflict resolutions in
`decisions/2026-07-10-design-system-integration.md`. This is the single reference for
the full RepresentDC domain (representdc-main, dc-bills-tracker, dc-statehood-pledge) —
update it here first if any of the three repos need to diverge, and note the divergence
explicitly rather than letting the docs silently drift apart.

## Visual system

- **Navy (`--navy` `#14213D`) is the workhorse** — headers, headings, primary surfaces,
  default icon color. **Red (`--dc-red` `#C8102E`) is a rationed accent** — urgency
  (alerts), primary CTAs, and the high-priority bill flag only. Never flood a surface in
  red.
- **Icons: Lucide only** (2px stroke, single color). Never emoji, never hand-drawn SVG,
  never unicode glyphs (✓, →, etc.) doing icon duty.
- **Fonts: exactly three** — Public Sans (UI/body/headings), Source Serif 4 (editorial
  pull-quotes only), IBM Plex Mono (data: bill numbers, votes, dates). Loaded via Google
  Fonts CDN for now (2026-07-10 decision) — revisit self-hosting only if load time
  becomes a measured problem.
- **No raw hex colors or raw px values in component code** — reference design tokens via
  `var(--token)`. Full token set in `colors_and_type.css`.
- **No gradients as a rule** — the one sanctioned exception is a subtle navy
  `#14213D → #243657` on large hero/footer panels.
- **Logo:** finalized 2026-07-10 — a five-pointed star with one point rendered as a
  diagonal hatch instead of a flat fill (texture, not color alone, carries the meaning:
  D.C.'s incomplete standing in American democracy). Deliberately not a recreation of the
  D.C. flag's three-stars-two-bars, to stay distinct from nearly every other statehood
  org's mark. Full spec (construction, wordmark rules, color combinations, clear space,
  minimum sizes, don'ts): `reference/brand/RepresentDC Logo Style Guide.dc.html`.
  Implementation: `src/components/Logo.jsx` (`Logo` + `Wordmark`, both take a `variant`
  of `color` / `reversed` / `mono`). "RepresentDC" is always one word; "DC" always carries
  a thin underline in the accent color tying it to the star.

## Hero sections — max 3 information levels

Established 2026-07-26 after the homepage hero accumulated five competing blocks
(eyebrow pill, two-color headline, subheading, CTA, multi-part stat line) — too many
distinct things asking for attention at once. Two allowed shapes, same cap:

- **Sub-page hero** (`/the-case`, `/myths-and-faq`, `/how-congress-controls-dc`,
  `/take-action`, `/statehood-curious`, `/news`, etc.): eyebrow + h1 + an optional
  one-line subtitle. Max 3. No CTA or stats inside the hero block itself — those live in
  a section below.
- **Landing hero** (homepage only): h1 (may split across two lines, e.g. a color
  change on the second clause — force the break with `<br />` rather than leaving it to
  wrap unpredictably) + one primary CTA + one simple stat/date line. Max 3. No eyebrow
  pill on this pattern — the CTA and stat line already fill that budget.

Either way: **3 blocks, not 5.** If a new fact or label seems worth adding, cut
something else first rather than stacking a 4th. See
`decisions/2026-07-26-hero-simplification.md`.

## Voice & content casing

- **Sentence case everywhere, including headlines and the hero** — this supersedes any
  earlier Title Case / all-caps-for-emphasis examples in `STRATEGY.md`. Urgency comes from
  word choice and the red/navy accent system, not capitalization.
- **UPPERCASE reserved for tiny eyebrow/label text only** (e.g. `UPDATE`, `FLOOR VOTE`).
- **Brand name: "RepresentDC", one word.** ("Represent DC" was a typo in this repo's
  footer/copyright text, not an intentional variant.)
- **"D.C." with periods in body copy**; "DC" acceptable in compact UI and the wordmark.
- **No emoji in copy, ever.**
- Non-partisan, concrete, loss-framed voice; no party-label rhetoric (sponsor party shown
  only as a neutral R/D/I badge). Full voice rules in the design system's own README if
  copied locally, otherwise treat this section as authoritative.
- **Name Congressional bill sponsors specifically** (normal legislative-tracking
  practice — e.g. "Rep. Nancy Mace") **but refer to the executive branch
  institutionally** ("the executive branch," "the White House," "the administration")
  rather than by a sitting president's name — regardless of whether the mention is
  critical or supportive of D.C.'s position. Confirmed 2026-07-11 after finding both a
  critical and a supportive presidential mention in the same content set; see
  `decisions/2026-07-11-content-review-and-audience.md`.

## Content integrity (non-negotiable — see `DEVELOPMENT-GUIDELINES.md`)

- Every factual claim needs a verified, cited source. Never port placeholder/fabricated
  data (fake sponsors, fake bill numbers, invented statistics) from design mocks or
  prototypes into production code — mockup filler must never look like real content.
- Ask before adding any new statistical claim, bill status, or sponsor attribution.
- **Aggregate sources at the bottom of a content page, not per-fact.** A citation next
  to every individual claim reads as clutter and, worse, as an AI-authoring tell. Use
  the shared `.sources-block`/`.sources-list` classes (`App.css`) for one consolidated
  list at the end of the page instead. Established on `/how-congress-controls-dc`
  (`decisions/2026-07-25-new-to-dc-dedicated-page.md`) and carried over to
  `/myths-and-faq` (`decisions/2026-07-25-myths-faq-redesign.md`).

## Persuasion architecture (see `STRATEGY.md`)

- The landing page follows a deliberate 5-part sequence: **Hook (hero) → Validate
  (facts) → Connect (American values) → Pattern (trend) → Solution (statehood).** All
  five sections are required. A design exploration that omits some "for focus" still
  needs them rebuilt in the new visual language before shipping — omission is a scope
  limitation of the mock, not a content decision.

## Cross-site integrity

- representdc-main, dc-bills-tracker (billtracker.representdc.org), and
  dc-statehood-pledge (candidates.representdc.org) cross-link in nav/footer. Keep those
  links live and correct when editing any shared chrome.
- Don't invent new nav destinations without a real target — point to an existing anchor
  on the current page, or explicitly scope a new page/route as its own decision.

## Repo/package structure

- No shared design-system package across the three repos for now (2026-07-10 decision).
  Copy `colors_and_type.css` and assets directly into each repo that adopts this design
  pass. Revisit a real shared package only if visual drift becomes a maintenance problem.
- This design pass currently covers **representdc-main only**. Rolling it out to
  dc-bills-tracker / dc-statehood-pledge is a separate future decision — don't assume
  parity until that decision is made and documented.
{
  "name": "representdc-main",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/prerender-routes.mjs",
    "lint": "eslint .",
    "preview": "vite preview",
    "import:article": "node scripts/import-article.mjs",
    "test:news": "node --test scripts/eval/*.test.mjs",
    "news:fetch": "node scripts/fetch-news.mjs",
    "eval:news": "node scripts/eval/run-golden.mjs",
    "predeploy": "npm run build",
    "deploy": "node scripts/deploy.mjs"
  },
  "dependencies": {
    "lucide-react": "^0.544.0",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.18.1",
    "remark-gfm": "^4.0.1"
  },
  "devDependencies": {
    "@anthropic-ai/sdk": "^0.125.0",
    "@eslint/js": "9.39.1",
    "@mozilla/readability": "^0.6.0",
    "@types/react": "19.2.4",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "5.1.1",
    "eslint": "9.39.1",
    "eslint-plugin-react-hooks": "7.0.1",
    "eslint-plugin-react-refresh": "0.4.24",
    "gh-pages": "6.3.0",
    "globals": "16.5.0",
    "jsdom": "^29.1.1",
    "playwright": "^1.63.0",
    "turndown": "^7.2.4",
    "turndown-plugin-gfm": "^1.0.2",
    "vite": "7.2.2"
  }
}
     1	import { useId, useMemo, useRef, useState } from 'react'
     2	import { MemberRow } from './MemberRow'
     3	import { memberStatuses, ordinal } from '../data/statehoodBill'
     4	import { SORTS, partyKey, partyOptions, sortMembers } from '../data/memberSort'
     5	
     6	const CHAMBERS = [
     7	  { key: 'house', label: 'House', plural: 'House members' },
     8	  { key: 'senate', label: 'Senate', plural: 'senators' },
     9	]
    10	const FILTERS = [
    11	  { key: 'not-yet', label: 'Not yet signed on' },
    12	  { key: 'signed', label: 'Signed on' },
    13	  { key: 'all', label: 'All' },
    14	]
    15	
    16	// The organizer view: every current member, their status on this chamber's bill.
    17	// Tabs follow the WAI-ARIA tabs pattern (arrow keys move between them); filters are a
    18	// native radio group, so they work by keyboard with no extra code. Party and sort are
    19	// native selects for the same reason.
    20	function MemberLookup({ bills, rosters }) {
    21	  const [chamber, setChamber] = useState('house')
    22	  const [filter, setFilter] = useState('not-yet')
    23	  const [stateCode, setStateCode] = useState('')
    24	  const [partyChoice, setPartyChoice] = useState('')
    25	  const [sort, setSort] = useState('name')
    26	  const [query, setQuery] = useState('')
    27	  const tabRefs = useRef({})
    28	  const id = useId()
    29	
    30	  const bill = bills[chamber]
    31	  // A roster only answers "not yet" for its own Congress, and only while this chamber's
    32	  // bill is the current one with a complete cosponsor list. memberStatuses returns null
    33	  // when the files disagree about a member, and the panel then shows nothing.
    34	  const roster = bill ? rosters[bill.congress]?.data : null
    35	  const statuses = useMemo(
    36	    () => (bill && bill.current && bill.complete ? memberStatuses(roster, bill) : null),
    37	    [bill, roster],
    38	  )
    39	  const usable = Boolean(statuses)
    40	  const all = useMemo(() => statuses ?? [], [statuses])
    41	  const states = useMemo(() => [...new Set(all.map((m) => m.state))].sort(), [all])
    42	  const parties = useMemo(() => partyOptions(all), [all])
    43	  // A party picked in one chamber may not exist in the other; then it filters nothing.
    44	  const party = parties.some((p) => p.key === partyChoice) ? partyChoice : ''
    45	  const sorted = useMemo(() => sortMembers(all, sort), [all, sort])
    46	  const needle = query.trim().toLowerCase()
    47	  const shown = sorted.filter((m) =>
    48	    (filter === 'all' || m.status === filter || (filter === 'signed' && m.status === 'sponsor')) &&
    49	    (!stateCode || m.state === stateCode) &&
    50	    (!party || partyKey(m) === party) &&
    51	    (!needle || m.name.toLowerCase().includes(needle)))
    52	
    53	  // Sign-on order says nothing about members who have not signed on, so the two choices
    54	  // move together: picking it shows who has signed, and leaving for "not yet" drops it.
    55	  const chooseSort = (key) => {
    56	    setSort(key)
    57	    if (key === 'recent' && filter === 'not-yet') setFilter('signed')
    58	  }
    59	  const chooseFilter = (key) => {
    60	    setFilter(key)
    61	    if (key === 'not-yet' && sort === 'recent') setSort('name')
    62	  }
    63	
    64	  const selectTab = (key) => {
    65	    setChamber(key)
    66	    setStateCode('')
    67	    tabRefs.current[key]?.focus()
    68	  }
    69	  const onTabKey = (e) => {
    70	    const i = CHAMBERS.findIndex((c) => c.key === chamber)
    71	    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: CHAMBERS.length - 1 }[e.key]
    72	    if (next === undefined) return
    73	    e.preventDefault()
    74	    selectTab(CHAMBERS[(next + CHAMBERS.length) % CHAMBERS.length].key)
    75	  }
    76	
    77	  const active = CHAMBERS.find((c) => c.key === chamber)
    78	
    79	  return (
    80	    <div className="lookup">
    81	      <div className="lookup-tabs" role="tablist" aria-label="Chamber">
    82	        {CHAMBERS.map((c) => (
    83	          <button
    84	            key={c.key}
    85	            ref={(el) => { tabRefs.current[c.key] = el }}
    86	            type="button"
    87	            role="tab"
    88	            id={`${id}-tab-${c.key}`}
    89	            aria-selected={chamber === c.key}
    90	            aria-controls={`${id}-panel`}
    91	            tabIndex={chamber === c.key ? 0 : -1}
    92	            className="lookup-tab"
    93	            onClick={() => selectTab(c.key)}
    94	            onKeyDown={onTabKey}
    95	          >
    96	            {c.label}
    97	          </button>
    98	        ))}
    99	      </div>
   100	
   101	      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${chamber}`} className="lookup-panel">
   102	        {!usable ? (
   103	          bill && !bill.current
   104	            ? <p className="lookup-empty">No confirmed {ordinal(bill.congress + 1)}-Congress bill linked yet.</p>
   105	            : null
   106	        ) : (
   107	          <>
   108	            <div className="lookup-controls">
   109	              <fieldset className="lookup-filters">
   110	                <legend className="sr-only">Show</legend>
   111	                {FILTERS.map((f) => (
   112	                  <label key={f.key} className="filter-chip">
   113	                    <input type="radio" name={`${id}-filter`} value={f.key} checked={filter === f.key} onChange={() => chooseFilter(f.key)} />
   114	                    <span>{f.label}</span>
   115	                  </label>
   116	                ))}
   117	              </fieldset>
   118	              <label className="lookup-field">
   119	                <span>State</span>
   120	                <select value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
   121	                  <option value="">All states</option>
   122	                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
   123	                </select>
   124	              </label>
   125	              <label className="lookup-field">
   126	                <span>Party</span>
   127	                <select value={party} onChange={(e) => setPartyChoice(e.target.value)}>
   128	                  <option value="">All parties</option>
   129	                  {parties.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
   130	                </select>
   131	              </label>
   132	              <label className="lookup-field">
   133	                <span>Sort by</span>
   134	                <select value={sort} onChange={(e) => chooseSort(e.target.value)}>
   135	                  {SORTS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
   136	                </select>
   137	              </label>
   138	              <label className="lookup-field">
   139	                <span>Search by name</span>
   140	                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
   141	              </label>
   142	            </div>
   143	            <p className="lookup-count" role="status" aria-live="polite">
   144	              Showing {shown.length} of {all.length} {active.plural}.
   145	            </p>
   146	            {shown.length > 0 && (
   147	              <ul className="member-list">
   148	                {shown.map((m) => <MemberRow key={m.bioguideId} member={m} />)}
   149	              </ul>
   150	            )}
   151	          </>
   152	        )}
   153	      </div>
   154	    </div>
   155	  )
   156	}
   157	
   158	export default MemberLookup
     1	// Ordering and party options for the member list on /statehood-bill. Pure functions.
     2	
     3	// Lower-case words that begin a surname ("Van Hollen", "De La Cruz"). The tracker
     4	// publishes names as "First Last" with no separate family name, so the last word is taken
     5	// as the surname and these particles are pulled in with it. Unhyphenated double surnames
     6	// ("Wasserman Schultz") cannot be told apart from a middle name plus surname ("Holmes
     7	// Norton"), so those sort by their final word.
     8	const PARTICLES = new Set(['van', 'von', 'de', 'del', 'della', 'la', 'le', 'du', 'st', 'st.'])
     9	const SUFFIX = /^(jr\.?|sr\.?|i{1,3}|iv|v)$/i
    10	
    11	const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    12	
    13	/** "hollen van chris" style key: surname first (with particles), then the rest. */
    14	export function lastNameKey(name) {
    15	  const tokens = fold(name).replace(/,/g, ' ').split(/\s+/).filter(Boolean)
    16	  while (tokens.length > 1 && SUFFIX.test(tokens.at(-1))) tokens.pop()
    17	  let start = tokens.length - 1
    18	  while (start > 1 && PARTICLES.has(tokens[start - 1])) start -= 1
    19	  return [...tokens.slice(start), ...tokens.slice(0, start)].join(' ')
    20	}
    21	
    22	const byName = (a, b) => lastNameKey(a.name).localeCompare(lastNameKey(b.name))
    23	// Sign-on order: dated cosponsors first, then the sponsor, then members not yet signed on.
    24	const RANK = { signed: 0, sponsor: 1, 'not-yet': 2 }
    25	
    26	export const SORTS = [
    27	  { key: 'name', label: 'Last name (A–Z)' },
    28	  { key: 'recent', label: 'Most recently signed on' },
    29	  { key: 'state', label: 'State' },
    30	]
    31	
    32	/**
    33	 * Returns a new array in the chosen order. `members` arrives in state order (state,
    34	 * district, name) from memberStatuses, so 'state' is the order as given. 'recent' puts the
    35	 * newest sign-on first; most cosponsors share the introduction date, so ties fall back to
    36	 * last name. Rows without a sign-on date (the sponsor, then members not yet signed on)
    37	 * follow the dated ones rather than being dropped.
    38	 */
    39	export function sortMembers(members, sort) {
    40	  if (sort === 'state') return members
    41	  if (sort === 'recent') {
    42	    return [...members].sort((a, b) =>
    43	      RANK[a.status] - RANK[b.status] ||
    44	      (b.date ?? '').localeCompare(a.date ?? '') ||
    45	      byName(a, b))
    46	  }
    47	  return [...members].sort(byName)
    48	}
    49	
    50	const PARTY_LABELS = { D: 'Democrats', R: 'Republicans', I: 'Independents' }
    51	// A member whose party the tracker did not publish is still listed, under its own option.
    52	export const NO_PARTY = 'none'
    53	export const partyKey = (member) => member.party ?? NO_PARTY
    54	
    55	/** Party options present among `members`, in a fixed order, each with its count. */
    56	export function partyOptions(members) {
    57	  const counts = {}
    58	  for (const m of members) counts[partyKey(m)] = (counts[partyKey(m)] ?? 0) + 1
    59	  return ['D', 'R', 'I', NO_PARTY]
    60	    .filter((key) => counts[key])
    61	    .map((key) => ({ key, label: PARTY_LABELS[key] ?? 'Party not listed', count: counts[key] }))
    62	}
     1	import Icon from './Icon'
     2	import { formatDate, memberTitle, seatLabel } from '../data/statehoodBill'
     3	
     4	const PARTY_NAMES = { R: 'Republican', D: 'Democrat', I: 'Independent' }
     5	
     6	// Neutral party badge: the letter carries the meaning (never colour alone), the full word
     7	// is there for screen readers.
     8	export function PartyBadge({ party }) {
     9	  if (!party) return null
    10	  return (
    11	    <span className={`party-badge party-badge--${party.toLowerCase()}`}>
    12	      <span aria-hidden="true">{party}</span>
    13	      <span className="sr-only">{PARTY_NAMES[party]}</span>
    14	    </span>
    15	  )
    16	}
    17	
    18	/** "Rep. First Last" with badge and seat, shared by the sponsor line and member rows. */
    19	export function MemberName({ chamber, member }) {
    20	  return (
    21	    <span className="member-name">
    22	      <PartyBadge party={member.party} />
    23	      <span>
    24	        {memberTitle(chamber, member.state, member.votingMember)} {member.name}
    25	        <span className="member-seat">, {seatLabel(chamber, member.state, member.district)}</span>
    26	      </span>
    27	    </span>
    28	  )
    29	}
    30	
    31	const STATUS = {
    32	  sponsor: () => 'Sponsor',
    33	  signed: (date) => `Signed on ${formatDate(date, 'short')}`,
    34	  'not-yet': () => 'Not yet',
    35	}
    36	
    37	export function MemberRow({ member }) {
    38	  return (
    39	    <li className={`member-row member-row--${member.status}`}>
    40	      <MemberName chamber={member.chamber} member={member} />
    41	      <span className="member-status">{STATUS[member.status](member.date)}</span>
    42	      {member.officialWebsiteUrl ? (
    43	        <a className="member-link" href={member.officialWebsiteUrl} target="_blank" rel="noopener noreferrer">
    44	          Official website<span className="sr-only"> of {member.name}</span> <Icon name="external-link" size={14} />
    45	        </a>
    46	      ) : (
    47	        <span className="member-link" />
    48	      )}
    49	    </li>
    50	  )
    51	}

exec
/bin/zsh -lc 'git show HEAD -- src/components/MemberLookup.jsx src/data/memberSort.js; git log -3 --oneline' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-2IpsrI52' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-nj4poLTk' (errno=Operation not permitted)
commit 7d35662bdd1171cb91ce97e80cf88c0b40a6e811
Author: antzzz10 <andria.thomas@gmail.com>
Date:   Fri Nov 13 10:06:12 2026 -0500

    statehood-bill: sort the member list by last name, sign-on date or state; filter by party
    
    The list opened in state order, which made a member hard to find. It now opens in
    last-name order, with sign-on date (newest first) and state as the other choices, and a
    party filter beside the state filter. Choosing sign-on order switches the list to members
    who have signed on, since the order means nothing for those who have not.
    
    Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>

diff --git a/src/components/MemberLookup.jsx b/src/components/MemberLookup.jsx
index 1d94a25..4087fde 100644
--- a/src/components/MemberLookup.jsx
+++ b/src/components/MemberLookup.jsx
@@ -1,6 +1,7 @@
 import { useId, useMemo, useRef, useState } from 'react'
 import { MemberRow } from './MemberRow'
 import { memberStatuses, ordinal } from '../data/statehoodBill'
+import { SORTS, partyKey, partyOptions, sortMembers } from '../data/memberSort'
 
 const CHAMBERS = [
   { key: 'house', label: 'House', plural: 'House members' },
@@ -14,11 +15,14 @@ const FILTERS = [
 
 // The organizer view: every current member, their status on this chamber's bill.
 // Tabs follow the WAI-ARIA tabs pattern (arrow keys move between them); filters are a
-// native radio group, so they work by keyboard with no extra code.
+// native radio group, so they work by keyboard with no extra code. Party and sort are
+// native selects for the same reason.
 function MemberLookup({ bills, rosters }) {
   const [chamber, setChamber] = useState('house')
   const [filter, setFilter] = useState('not-yet')
   const [stateCode, setStateCode] = useState('')
+  const [partyChoice, setPartyChoice] = useState('')
+  const [sort, setSort] = useState('name')
   const [query, setQuery] = useState('')
   const tabRefs = useRef({})
   const id = useId()
@@ -35,12 +39,28 @@ function MemberLookup({ bills, rosters }) {
   const usable = Boolean(statuses)
   const all = useMemo(() => statuses ?? [], [statuses])
   const states = useMemo(() => [...new Set(all.map((m) => m.state))].sort(), [all])
+  const parties = useMemo(() => partyOptions(all), [all])
+  // A party picked in one chamber may not exist in the other; then it filters nothing.
+  const party = parties.some((p) => p.key === partyChoice) ? partyChoice : ''
+  const sorted = useMemo(() => sortMembers(all, sort), [all, sort])
   const needle = query.trim().toLowerCase()
-  const shown = all.filter((m) =>
+  const shown = sorted.filter((m) =>
     (filter === 'all' || m.status === filter || (filter === 'signed' && m.status === 'sponsor')) &&
     (!stateCode || m.state === stateCode) &&
+    (!party || partyKey(m) === party) &&
     (!needle || m.name.toLowerCase().includes(needle)))
 
+  // Sign-on order says nothing about members who have not signed on, so the two choices
+  // move together: picking it shows who has signed, and leaving for "not yet" drops it.
+  const chooseSort = (key) => {
+    setSort(key)
+    if (key === 'recent' && filter === 'not-yet') setFilter('signed')
+  }
+  const chooseFilter = (key) => {
+    setFilter(key)
+    if (key === 'not-yet' && sort === 'recent') setSort('name')
+  }
+
   const selectTab = (key) => {
     setChamber(key)
     setStateCode('')
@@ -90,7 +110,7 @@ function MemberLookup({ bills, rosters }) {
                 <legend className="sr-only">Show</legend>
                 {FILTERS.map((f) => (
                   <label key={f.key} className="filter-chip">
-                    <input type="radio" name={`${id}-filter`} value={f.key} checked={filter === f.key} onChange={() => setFilter(f.key)} />
+                    <input type="radio" name={`${id}-filter`} value={f.key} checked={filter === f.key} onChange={() => chooseFilter(f.key)} />
                     <span>{f.label}</span>
                   </label>
                 ))}
@@ -102,6 +122,19 @@ function MemberLookup({ bills, rosters }) {
                   {states.map((s) => <option key={s} value={s}>{s}</option>)}
                 </select>
               </label>
+              <label className="lookup-field">
+                <span>Party</span>
+                <select value={party} onChange={(e) => setPartyChoice(e.target.value)}>
+                  <option value="">All parties</option>
+                  {parties.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
+                </select>
+              </label>
+              <label className="lookup-field">
+                <span>Sort by</span>
+                <select value={sort} onChange={(e) => chooseSort(e.target.value)}>
+                  {SORTS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
+                </select>
+              </label>
               <label className="lookup-field">
                 <span>Search by name</span>
                 <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
diff --git a/src/data/memberSort.js b/src/data/memberSort.js
new file mode 100644
index 0000000..94ae06a
--- /dev/null
+++ b/src/data/memberSort.js
@@ -0,0 +1,62 @@
+// Ordering and party options for the member list on /statehood-bill. Pure functions.
+
+// Lower-case words that begin a surname ("Van Hollen", "De La Cruz"). The tracker
+// publishes names as "First Last" with no separate family name, so the last word is taken
+// as the surname and these particles are pulled in with it. Unhyphenated double surnames
+// ("Wasserman Schultz") cannot be told apart from a middle name plus surname ("Holmes
+// Norton"), so those sort by their final word.
+const PARTICLES = new Set(['van', 'von', 'de', 'del', 'della', 'la', 'le', 'du', 'st', 'st.'])
+const SUFFIX = /^(jr\.?|sr\.?|i{1,3}|iv|v)$/i
+
+const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
+
+/** "hollen van chris" style key: surname first (with particles), then the rest. */
+export function lastNameKey(name) {
+  const tokens = fold(name).replace(/,/g, ' ').split(/\s+/).filter(Boolean)
+  while (tokens.length > 1 && SUFFIX.test(tokens.at(-1))) tokens.pop()
+  let start = tokens.length - 1
+  while (start > 1 && PARTICLES.has(tokens[start - 1])) start -= 1
+  return [...tokens.slice(start), ...tokens.slice(0, start)].join(' ')
+}
+
+const byName = (a, b) => lastNameKey(a.name).localeCompare(lastNameKey(b.name))
+// Sign-on order: dated cosponsors first, then the sponsor, then members not yet signed on.
+const RANK = { signed: 0, sponsor: 1, 'not-yet': 2 }
+
+export const SORTS = [
+  { key: 'name', label: 'Last name (A–Z)' },
+  { key: 'recent', label: 'Most recently signed on' },
+  { key: 'state', label: 'State' },
+]
+
+/**
+ * Returns a new array in the chosen order. `members` arrives in state order (state,
+ * district, name) from memberStatuses, so 'state' is the order as given. 'recent' puts the
+ * newest sign-on first; most cosponsors share the introduction date, so ties fall back to
+ * last name. Rows without a sign-on date (the sponsor, then members not yet signed on)
+ * follow the dated ones rather than being dropped.
+ */
+export function sortMembers(members, sort) {
+  if (sort === 'state') return members
+  if (sort === 'recent') {
+    return [...members].sort((a, b) =>
+      RANK[a.status] - RANK[b.status] ||
+      (b.date ?? '').localeCompare(a.date ?? '') ||
+      byName(a, b))
+  }
+  return [...members].sort(byName)
+}
+
+const PARTY_LABELS = { D: 'Democrats', R: 'Republicans', I: 'Independents' }
+// A member whose party the tracker did not publish is still listed, under its own option.
+export const NO_PARTY = 'none'
+export const partyKey = (member) => member.party ?? NO_PARTY
+
+/** Party options present among `members`, in a fixed order, each with its count. */
+export function partyOptions(members) {
+  const counts = {}
+  for (const m of members) counts[partyKey(m)] = (counts[partyKey(m)] ?? 0) + 1
+  return ['D', 'R', 'I', NO_PARTY]
+    .filter((key) => counts[key])
+    .map((key) => ({ key, label: PARTY_LABELS[key] ?? 'Party not listed', count: counts[key] }))
+}
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-HVfMjvt7' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-TLybDoOD' (errno=Operation not permitted)
7d35662 statehood-bill: sort the member list by last name, sign-on date or state; filter by party
16d0631 Remove PR-only screenshots of /statehood-bill
ddd8abc Merge pull request #5 from antzzz10/claude/mobile-nav-and-titles-580bc2

exec
/bin/zsh -lc 'nl -ba src/components/MemberLookup.jsx; nl -ba src/components/MemberRow.jsx; cat package.json; cat DESIGN-GUARDRAILS.md' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
     1	import { useId, useMemo, useRef, useState } from 'react'
     2	import { MemberRow } from './MemberRow'
     3	import { memberStatuses, ordinal } from '../data/statehoodBill'
     4	import { SORTS, partyKey, partyOptions, sortMembers } from '../data/memberSort'
     5	
     6	const CHAMBERS = [
     7	  { key: 'house', label: 'House', plural: 'House members' },
     8	  { key: 'senate', label: 'Senate', plural: 'senators' },
     9	]
    10	const FILTERS = [
    11	  { key: 'not-yet', label: 'Not yet signed on' },
    12	  { key: 'signed', label: 'Signed on' },
    13	  { key: 'all', label: 'All' },
    14	]
    15	
    16	// The organizer view: every current member, their status on this chamber's bill.
    17	// Tabs follow the WAI-ARIA tabs pattern (arrow keys move between them); filters are a
    18	// native radio group, so they work by keyboard with no extra code. Party and sort are
    19	// native selects for the same reason.
    20	function MemberLookup({ bills, rosters }) {
    21	  const [chamber, setChamber] = useState('house')
    22	  const [filter, setFilter] = useState('not-yet')
    23	  const [stateCode, setStateCode] = useState('')
    24	  const [partyChoice, setPartyChoice] = useState('')
    25	  const [sort, setSort] = useState('name')
    26	  const [query, setQuery] = useState('')
    27	  const tabRefs = useRef({})
    28	  const id = useId()
    29	
    30	  const bill = bills[chamber]
    31	  // A roster only answers "not yet" for its own Congress, and only while this chamber's
    32	  // bill is the current one with a complete cosponsor list. memberStatuses returns null
    33	  // when the files disagree about a member, and the panel then shows nothing.
    34	  const roster = bill ? rosters[bill.congress]?.data : null
    35	  const statuses = useMemo(
    36	    () => (bill && bill.current && bill.complete ? memberStatuses(roster, bill) : null),
    37	    [bill, roster],
    38	  )
    39	  const usable = Boolean(statuses)
    40	  const all = useMemo(() => statuses ?? [], [statuses])
    41	  const states = useMemo(() => [...new Set(all.map((m) => m.state))].sort(), [all])
    42	  const parties = useMemo(() => partyOptions(all), [all])
    43	  // A party picked in one chamber may not exist in the other; then it filters nothing.
    44	  const party = parties.some((p) => p.key === partyChoice) ? partyChoice : ''
    45	  const sorted = useMemo(() => sortMembers(all, sort), [all, sort])
    46	  const needle = query.trim().toLowerCase()
    47	  const shown = sorted.filter((m) =>
    48	    (filter === 'all' || m.status === filter || (filter === 'signed' && m.status === 'sponsor')) &&
    49	    (!stateCode || m.state === stateCode) &&
    50	    (!party || partyKey(m) === party) &&
    51	    (!needle || m.name.toLowerCase().includes(needle)))
    52	
    53	  // Sign-on order says nothing about members who have not signed on, so the two choices
    54	  // move together: picking it shows who has signed, and leaving for "not yet" drops it.
    55	  const chooseSort = (key) => {
    56	    setSort(key)
    57	    if (key === 'recent' && filter === 'not-yet') setFilter('signed')
    58	  }
    59	  const chooseFilter = (key) => {
    60	    setFilter(key)
    61	    if (key === 'not-yet' && sort === 'recent') setSort('name')
    62	  }
    63	
    64	  const selectTab = (key) => {
    65	    setChamber(key)
    66	    setStateCode('')
    67	    tabRefs.current[key]?.focus()
    68	  }
    69	  const onTabKey = (e) => {
    70	    const i = CHAMBERS.findIndex((c) => c.key === chamber)
    71	    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: CHAMBERS.length - 1 }[e.key]
    72	    if (next === undefined) return
    73	    e.preventDefault()
    74	    selectTab(CHAMBERS[(next + CHAMBERS.length) % CHAMBERS.length].key)
    75	  }
    76	
    77	  const active = CHAMBERS.find((c) => c.key === chamber)
    78	
    79	  return (
    80	    <div className="lookup">
    81	      <div className="lookup-tabs" role="tablist" aria-label="Chamber">
    82	        {CHAMBERS.map((c) => (
    83	          <button
    84	            key={c.key}
    85	            ref={(el) => { tabRefs.current[c.key] = el }}
    86	            type="button"
    87	            role="tab"
    88	            id={`${id}-tab-${c.key}`}
    89	            aria-selected={chamber === c.key}
    90	            aria-controls={`${id}-panel`}
    91	            tabIndex={chamber === c.key ? 0 : -1}
    92	            className="lookup-tab"
    93	            onClick={() => selectTab(c.key)}
    94	            onKeyDown={onTabKey}
    95	          >
    96	            {c.label}
    97	          </button>
    98	        ))}
    99	      </div>
   100	
   101	      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${chamber}`} className="lookup-panel">
   102	        {!usable ? (
   103	          bill && !bill.current
   104	            ? <p className="lookup-empty">No confirmed {ordinal(bill.congress + 1)}-Congress bill linked yet.</p>
   105	            : null
   106	        ) : (
   107	          <>
   108	            <div className="lookup-controls">
   109	              <fieldset className="lookup-filters">
   110	                <legend className="sr-only">Show</legend>
   111	                {FILTERS.map((f) => (
   112	                  <label key={f.key} className="filter-chip">
   113	                    <input type="radio" name={`${id}-filter`} value={f.key} checked={filter === f.key} onChange={() => chooseFilter(f.key)} />
   114	                    <span>{f.label}</span>
   115	                  </label>
   116	                ))}
   117	              </fieldset>
   118	              <label className="lookup-field">
   119	                <span>State</span>
   120	                <select value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
   121	                  <option value="">All states</option>
   122	                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
   123	                </select>
   124	              </label>
   125	              <label className="lookup-field">
   126	                <span>Party</span>
   127	                <select value={party} onChange={(e) => setPartyChoice(e.target.value)}>
   128	                  <option value="">All parties</option>
   129	                  {parties.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
   130	                </select>
   131	              </label>
   132	              <label className="lookup-field">
   133	                <span>Sort by</span>
   134	                <select value={sort} onChange={(e) => chooseSort(e.target.value)}>
   135	                  {SORTS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
   136	                </select>
   137	              </label>
   138	              <label className="lookup-field">
   139	                <span>Search by name</span>
   140	                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
   141	              </label>
   142	            </div>
   143	            <p className="lookup-count" role="status" aria-live="polite">
   144	              Showing {shown.length} of {all.length} {active.plural}.
   145	            </p>
   146	            {shown.length > 0 && (
   147	              <ul className="member-list">
   148	                {shown.map((m) => <MemberRow key={m.bioguideId} member={m} />)}
   149	              </ul>
   150	            )}
   151	          </>
   152	        )}
   153	      </div>
   154	    </div>
   155	  )
   156	}
   157	
   158	export default MemberLookup
     1	import Icon from './Icon'
     2	import { formatDate, memberTitle, seatLabel } from '../data/statehoodBill'
     3	
     4	const PARTY_NAMES = { R: 'Republican', D: 'Democrat', I: 'Independent' }
     5	
     6	// Neutral party badge: the letter carries the meaning (never colour alone), the full word
     7	// is there for screen readers.
     8	export function PartyBadge({ party }) {
     9	  if (!party) return null
    10	  return (
    11	    <span className={`party-badge party-badge--${party.toLowerCase()}`}>
    12	      <span aria-hidden="true">{party}</span>
    13	      <span className="sr-only">{PARTY_NAMES[party]}</span>
    14	    </span>
    15	  )
    16	}
    17	
    18	/** "Rep. First Last" with badge and seat, shared by the sponsor line and member rows. */
    19	export function MemberName({ chamber, member }) {
    20	  return (
    21	    <span className="member-name">
    22	      <PartyBadge party={member.party} />
    23	      <span>
    24	        {memberTitle(chamber, member.state, member.votingMember)} {member.name}
    25	        <span className="member-seat">, {seatLabel(chamber, member.state, member.district)}</span>
    26	      </span>
    27	    </span>
    28	  )
    29	}
    30	
    31	const STATUS = {
    32	  sponsor: () => 'Sponsor',
    33	  signed: (date) => `Signed on ${formatDate(date, 'short')}`,
    34	  'not-yet': () => 'Not yet',
    35	}
    36	
    37	export function MemberRow({ member }) {
    38	  return (
    39	    <li className={`member-row member-row--${member.status}`}>
    40	      <MemberName chamber={member.chamber} member={member} />
    41	      <span className="member-status">{STATUS[member.status](member.date)}</span>
    42	      {member.officialWebsiteUrl ? (
    43	        <a className="member-link" href={member.officialWebsiteUrl} target="_blank" rel="noopener noreferrer">
    44	          Official website<span className="sr-only"> of {member.name}</span> <Icon name="external-link" size={14} />
    45	        </a>
    46	      ) : (
    47	        <span className="member-link" />
    48	      )}
    49	    </li>
    50	  )
    51	}
{
  "name": "representdc-main",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/prerender-routes.mjs",
    "lint": "eslint .",
    "preview": "vite preview",
    "import:article": "node scripts/import-article.mjs",
    "test:news": "node --test scripts/eval/*.test.mjs",
    "news:fetch": "node scripts/fetch-news.mjs",
    "eval:news": "node scripts/eval/run-golden.mjs",
    "predeploy": "npm run build",
    "deploy": "node scripts/deploy.mjs"
  },
  "dependencies": {
    "lucide-react": "^0.544.0",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.18.1",
    "remark-gfm": "^4.0.1"
  },
  "devDependencies": {
    "@anthropic-ai/sdk": "^0.125.0",
    "@eslint/js": "9.39.1",
    "@mozilla/readability": "^0.6.0",
    "@types/react": "19.2.4",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "5.1.1",
    "eslint": "9.39.1",
    "eslint-plugin-react-hooks": "7.0.1",
    "eslint-plugin-react-refresh": "0.4.24",
    "gh-pages": "6.3.0",
    "globals": "16.5.0",
    "jsdom": "^29.1.1",
    "playwright": "^1.63.0",
    "turndown": "^7.2.4",
    "turndown-plugin-gfm": "^1.0.2",
    "vite": "7.2.2"
  }
}
# RepresentDC — Design, Content & Goals Guardrails

Consolidated from the Claude Design "RepresentDC Design System" project, this repo's
`STRATEGY.md` and `DEVELOPMENT-GUIDELINES.md`, and conflict resolutions in
`decisions/2026-07-10-design-system-integration.md`. This is the single reference for
the full RepresentDC domain (representdc-main, dc-bills-tracker, dc-statehood-pledge) —
update it here first if any of the three repos need to diverge, and note the divergence
explicitly rather than letting the docs silently drift apart.

## Visual system

- **Navy (`--navy` `#14213D`) is the workhorse** — headers, headings, primary surfaces,
  default icon color. **Red (`--dc-red` `#C8102E`) is a rationed accent** — urgency
  (alerts), primary CTAs, and the high-priority bill flag only. Never flood a surface in
  red.
- **Icons: Lucide only** (2px stroke, single color). Never emoji, never hand-drawn SVG,
  never unicode glyphs (✓, →, etc.) doing icon duty.
- **Fonts: exactly three** — Public Sans (UI/body/headings), Source Serif 4 (editorial
  pull-quotes only), IBM Plex Mono (data: bill numbers, votes, dates). Loaded via Google
  Fonts CDN for now (2026-07-10 decision) — revisit self-hosting only if load time
  becomes a measured problem.
- **No raw hex colors or raw px values in component code** — reference design tokens via
  `var(--token)`. Full token set in `colors_and_type.css`.
- **No gradients as a rule** — the one sanctioned exception is a subtle navy
  `#14213D → #243657` on large hero/footer panels.
- **Logo:** finalized 2026-07-10 — a five-pointed star with one point rendered as a
  diagonal hatch instead of a flat fill (texture, not color alone, carries the meaning:
  D.C.'s incomplete standing in American democracy). Deliberately not a recreation of the
  D.C. flag's three-stars-two-bars, to stay distinct from nearly every other statehood
  org's mark. Full spec (construction, wordmark rules, color combinations, clear space,
  minimum sizes, don'ts): `reference/brand/RepresentDC Logo Style Guide.dc.html`.
  Implementation: `src/components/Logo.jsx` (`Logo` + `Wordmark`, both take a `variant`
  of `color` / `reversed` / `mono`). "RepresentDC" is always one word; "DC" always carries
  a thin underline in the accent color tying it to the star.

## Hero sections — max 3 information levels

Established 2026-07-26 after the homepage hero accumulated five competing blocks
(eyebrow pill, two-color headline, subheading, CTA, multi-part stat line) — too many
distinct things asking for attention at once. Two allowed shapes, same cap:

- **Sub-page hero** (`/the-case`, `/myths-and-faq`, `/how-congress-controls-dc`,
  `/take-action`, `/statehood-curious`, `/news`, etc.): eyebrow + h1 + an optional
  one-line subtitle. Max 3. No CTA or stats inside the hero block itself — those live in
  a section below.
- **Landing hero** (homepage only): h1 (may split across two lines, e.g. a color
  change on the second clause — force the break with `<br />` rather than leaving it to
  wrap unpredictably) + one primary CTA + one simple stat/date line. Max 3. No eyebrow
  pill on this pattern — the CTA and stat line already fill that budget.

Either way: **3 blocks, not 5.** If a new fact or label seems worth adding, cut
something else first rather than stacking a 4th. See
`decisions/2026-07-26-hero-simplification.md`.

## Voice & content casing

- **Sentence case everywhere, including headlines and the hero** — this supersedes any
  earlier Title Case / all-caps-for-emphasis examples in `STRATEGY.md`. Urgency comes from
  word choice and the red/navy accent system, not capitalization.
- **UPPERCASE reserved for tiny eyebrow/label text only** (e.g. `UPDATE`, `FLOOR VOTE`).
- **Brand name: "RepresentDC", one word.** ("Represent DC" was a typo in this repo's
  footer/copyright text, not an intentional variant.)
- **"D.C." with periods in body copy**; "DC" acceptable in compact UI and the wordmark.
- **No emoji in copy, ever.**
- Non-partisan, concrete, loss-framed voice; no party-label rhetoric (sponsor party shown
  only as a neutral R/D/I badge). Full voice rules in the design system's own README if
  copied locally, otherwise treat this section as authoritative.
- **Name Congressional bill sponsors specifically** (normal legislative-tracking
  practice — e.g. "Rep. Nancy Mace") **but refer to the executive branch
  institutionally** ("the executive branch," "the White House," "the administration")
  rather than by a sitting president's name — regardless of whether the mention is
  critical or supportive of D.C.'s position. Confirmed 2026-07-11 after finding both a
  critical and a supportive presidential mention in the same content set; see
  `decisions/2026-07-11-content-review-and-audience.md`.

## Content integrity (non-negotiable — see `DEVELOPMENT-GUIDELINES.md`)

- Every factual claim needs a verified, cited source. Never port placeholder/fabricated
  data (fake sponsors, fake bill numbers, invented statistics) from design mocks or
  prototypes into production code — mockup filler must never look like real content.
- Ask before adding any new statistical claim, bill status, or sponsor attribution.
- **Aggregate sources at the bottom of a content page, not per-fact.** A citation next
  to every individual claim reads as clutter and, worse, as an AI-authoring tell. Use
  the shared `.sources-block`/`.sources-list` classes (`App.css`) for one consolidated
  list at the end of the page instead. Established on `/how-congress-controls-dc`
  (`decisions/2026-07-25-new-to-dc-dedicated-page.md`) and carried over to
  `/myths-and-faq` (`decisions/2026-07-25-myths-faq-redesign.md`).

## Persuasion architecture (see `STRATEGY.md`)

- The landing page follows a deliberate 5-part sequence: **Hook (hero) → Validate
  (facts) → Connect (American values) → Pattern (trend) → Solution (statehood).** All
  five sections are required. A design exploration that omits some "for focus" still
  needs them rebuilt in the new visual language before shipping — omission is a scope
  limitation of the mock, not a content decision.

## Cross-site integrity

- representdc-main, dc-bills-tracker (billtracker.representdc.org), and
  dc-statehood-pledge (candidates.representdc.org) cross-link in nav/footer. Keep those
  links live and correct when editing any shared chrome.
- Don't invent new nav destinations without a real target — point to an existing anchor
  on the current page, or explicitly scope a new page/route as its own decision.

## Repo/package structure

- No shared design-system package across the three repos for now (2026-07-10 decision).
  Copy `colors_and_type.css` and assets directly into each repo that adopts this design
  pass. Revisit a real shared package only if visual drift becomes a maintenance problem.
- This design pass currently covers **representdc-main only**. Rolling it out to
  dc-bills-tracker / dc-statehood-pledge is a separate future decision — don't assume
  parity until that decision is made and documented.

exec
/bin/zsh -lc "sed -n '1,240p' src/data/statehoodBill.js; rg --files src scripts public | rg 'roster|member|cosponsor|statehood|Statehood|test|eval'" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
// Validation and derivations for /statehood-bill. Pure functions only, so the page and any
// future check script share one definition of what the tracker files must look like.
// Anything that fails validation is dropped whole: the page shows no number rather than a
// number from a half-understood file (same rule as useBillStats). The checks below came
// from the Codex medium/high/attack passes of 2026-11-10 (reviews/2026-11-10-statehood-
// bill-page-codex-*.raw.md): every published total is re-derived from the rows it
// summarizes, identities are canonical before any join, and links must point at the
// official host they are labelled with.

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/
const ISO_INSTANT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/
const BIOGUIDE = /^[A-Z]\d{6}$/
const STATE = /^[A-Z]{2}$/
const PARTIES = new Set(['R', 'D', 'I'])
// Non-voting House seats. Puerto Rico's member is a Resident Commissioner; the rest are
// Delegates. Used for courtesy titles and to re-derive the non-voting subtotal.
const NON_VOTING = new Set(['DC', 'PR', 'GU', 'VI', 'AS', 'MP'])
// Upper bounds on any one chamber's population, voting and non-voting seats together.
const CHAMBER_MAX = { house: 441, senate: 100 }
// Freshness limits. The cosponsor check runs daily and the roster weekly; past these, a
// "this month" or "not yet" statement could describe a world that has since changed, so
// those sections are withheld (the count cards still show their own "Last checked" date).
const DAY_MS = 24 * 60 * 60 * 1000
const CHECK_MAX_AGE_MS = 2 * DAY_MS
const ROSTER_MAX_AGE_MS = 15 * DAY_MS

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const isStr = (v) => typeof v === 'string' && v.trim() !== ''
const isCount = (v) => Number.isInteger(v) && v >= 0
const squash = (s) => s.trim().replace(/\s+/g, ' ')
const SUFFIX = /^(jr|sr|i{1,3}|iv|v)$/
// Last surname token, case-, accent- and punctuation-insensitive, generational suffix
// dropped. Handles both name orders Congress.gov uses: "Donald M. Payne, Jr." and
// "Payne, Donald M., Jr." \u2014 in either, the surname ends the text before the first comma.
function surname(name) {
  const tokens = name.split(',')[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(Boolean)
  while (tokens.length > 1 && SUFFIX.test(tokens.at(-1))) tokens.pop()
  return tokens.at(-1) ?? ''
}

function validCalendar(y, mo, d) {
  const dt = new Date(Date.UTC(y, mo - 1, d))
  return mo >= 1 && mo <= 12 && dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d
}

export function isDateOnly(value) {
  if (typeof value !== 'string') return false
  const m = DATE_ONLY.exec(value)
  return Boolean(m) && validCalendar(Number(m[1]), Number(m[2]), Number(m[3]))
}

// Same rule as useBillStats: Date() silently rolls "2026-02-30" into March, so the calendar
// is checked before the value is trusted.
export function isInstant(value) {
  if (typeof value !== 'string') return false
  const m = ISO_INSTANT.exec(value)
  if (!m) return false
  const [hour, minute, second] = [Number(m[4]), Number(m[5]), Number(m[6] ?? 0)]
  if (hour > 23 || minute > 59 || second > 59) return false
  return validCalendar(Number(m[1]), Number(m[2]), Number(m[3])) && !Number.isNaN(Date.parse(value))
}

/** Eastern calendar date (YYYY-MM-DD) of an instant. */
export function etDate(instant) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date(instant))
  const get = (t) => parts.find((p) => p.type === t).value
  return `${get('year')}-${get('month')}-${get('day')}`
}

// A link is only shown under an official label if it really points at that host: https, no
// embedded credentials, and the expected hostname (exact, or a subdomain where allowed).
function officialUrl(value, hostOk, upgradeHttp = false) {
  if (typeof value !== 'string') return null
  try {
    const u = new URL(value)
    // Congress.gov lists a few member sites as http (e.g. menefee.house.gov, 2026-11-10);
    // House and Senate sites all serve https, so those are upgraded rather than dropped.
    if (upgradeHttp && u.protocol === 'http:') u.protocol = 'https:'
    if (u.protocol !== 'https:' || u.username || u.password || u.port) return null
    return hostOk(u.hostname.toLowerCase(), u.pathname) ? u.href : null
  } catch {
    return null
  }
}
const isCongressGov = (h) => h === 'www.congress.gov' || h === 'congress.gov'
const isGovInfo = (h) => h === 'www.govinfo.gov' || h === 'govinfo.gov'
const isMemberSite = (h) => /^[a-z0-9-]+(\.[a-z0-9-]+)*\.(house|senate)\.gov$/.test(h)

const CHAMBER_PREFIX = { house: /^H\.R\. \d+$/, senate: /^S\. \d+$/ }
const CHAMBER_PATH = { house: 'house-bill', senate: 'senate-bill' }

function chamberFromNumber(billNumber) {
  if (CHAMBER_PREFIX.house.test(billNumber)) return 'house'
  if (CHAMBER_PREFIX.senate.test(billNumber)) return 'senate'
  return null
}

function person(raw) {
  if (!isObj(raw) || typeof raw.bioguideId !== 'string' || !isStr(raw.name) || typeof raw.state !== 'string') return null
  const bioguideId = raw.bioguideId.trim().toUpperCase()
  const state = raw.state.trim().toUpperCase()
  if (!BIOGUIDE.test(bioguideId) || !STATE.test(state)) return null
  const d = raw.district
  if (!(d === null || d === undefined || isCount(d))) return null
  return {
    bioguideId,
    name: squash(raw.name),
    party: PARTIES.has(raw.party) ? raw.party : null,
    state,
    district: d ?? null,
  }
}

function bill(raw) {
  if (!isObj(raw) || !isStr(raw.billNumber)) return null
  const billNumber = squash(raw.billNumber)
  const chamber = chamberFromNumber(billNumber)
  // The chamber field, the bill number and the official URL must all agree.
  if (!chamber || (raw.chamber !== undefined && raw.chamber !== chamber)) return null
  const congressGovUrl = officialUrl(raw.congressGovUrl, (h, path) =>
    isCongressGov(h) && path.replace(/\/+$/, '') === `/bill/${ordinal(raw.congress)}-congress/${CHAMBER_PATH[chamber]}/${billNumber.match(/\d+$/)[0]}`)
  const sponsor = person(raw.sponsor)
  const action = raw.latestAction
  // Incomplete lists carry `totals: null` (tracker 61ba66a); zeros are accepted too.
  const totals = raw.complete === false && raw.totals == null ? { cosponsors: 0, original: 0, nonVoting: 0 } : raw.totals
  const complete = raw.complete !== false
  if (
    !Number.isInteger(raw.congress) || raw.congress < 100 ||
    typeof raw.current !== 'boolean' ||
    !sponsor ||
    !isDateOnly(raw.introducedDate) ||
    !isObj(action) || !isDateOnly(action.actionDate) || !isStr(action.text) ||
    !congressGovUrl ||
    // The tracker publishes `complete: false` (empty list, null totals, no checkedAt) when
    // the last fetch did not return the whole list. That bill keeps its official facts but
    // shows no counts, sign-ons or lookup.
    (complete && !isInstant(raw.checkedAt)) ||
    !Array.isArray(raw.cosponsors) ||
    !isObj(totals) || !isCount(totals.cosponsors) || !isCount(totals.original) || !isCount(totals.nonVoting)
  ) return null

  const checkedDate = complete ? etDate(raw.checkedAt) : null
  // Chronology: nothing happens before introduction or after the check that recorded it.
  if (action.actionDate < raw.introducedDate || (checkedDate && action.actionDate > checkedDate)) return null

  const cosponsors = []
  for (const c of raw.cosponsors) {
    const p = person(c)
    if (!p || !isDateOnly(c.sponsorshipDate) || typeof c.isOriginalCosponsor !== 'boolean') return null
    if (p.bioguideId === sponsor.bioguideId) return null // the sponsor is never a cosponsor
    if (c.sponsorshipDate < raw.introducedDate || (checkedDate && c.sponsorshipDate > checkedDate)) return null
    cosponsors.push({ ...p, sponsorshipDate: c.sponsorshipDate, isOriginalCosponsor: c.isOriginalCosponsor })
  }
  if (!complete && (cosponsors.length > 0 || totals.cosponsors > 0)) return null

  // Every published total must equal what the list itself says, or neither is trusted.
  const nonVoting = chamber === 'house' ? cosponsors.filter((c) => NON_VOTING.has(c.state)).length : 0
  if (
    cosponsors.length !== totals.cosponsors ||
    cosponsors.length > CHAMBER_MAX[chamber] ||
    new Set(cosponsors.map((c) => c.bioguideId)).size !== cosponsors.length ||
    cosponsors.filter((c) => c.isOriginalCosponsor).length !== totals.original ||
    nonVoting !== totals.nonVoting
  ) return null

  return {
    chamber,
    complete,
    congress: raw.congress,
    billNumber,
    current: raw.current,
    sponsor,
    introducedDate: raw.introducedDate,
    latestAction: { actionDate: action.actionDate, text: squash(action.text) },
    congressGovUrl,
    checkedAt: complete ? raw.checkedAt : null,
    cosponsors,
    totals: { cosponsors: totals.cosponsors, original: totals.original, nonVoting },
  }
}

/** Returns { house, senate } (either may be null) or null if the file is unusable. */
export function parseCosponsors(json) {
  const list = Array.isArray(json?.bills) ? json.bills : null
  if (!list) return null
  const out = { house: null, senate: null }
  for (const raw of list) {
    const b = bill(raw)
    if (!b) return null
    if (out[b.chamber]) return null // two bills claiming one chamber: ambiguous
    out[b.chamber] = b
  }
  return out.house || out.senate ? out : null
}

/**
 * Returns { congress, members } or null. `expectedCongress` is the Congress named in the
 * file's URL; the file must say the same, and its published counts must match its rows.
 */
export function parseMembers(json, expectedCongress) {
  // At a Congress switch the tracker may publish a placeholder ({ congress, pending: true,
  // members: [] }): no lookup yet, same as a missing file.
  if (isObj(json) && json.pending === true) return null
  if (!isObj(json) || json.congress !== expectedCongress || !Array.isArray(json.members) || !isInstant(json.generatedAt)) return null
  const members = []
  const seen = new Set()
  for (const raw of json.members) {
    const p = person(raw)
    if (!p || (raw.chamber !== 'house' && raw.chamber !== 'senate') || typeof raw.votingMember !== 'boolean') return null
    // Seat and voting status must agree: senators and state House seats vote, the six
    // territorial/district seats do not.
    const shouldVote = raw.chamber === 'senate' || !NON_VOTING.has(p.state)
    if (raw.votingMember !== shouldVote || (raw.chamber === 'senate' && NON_VOTING.has(p.state))) return null
    if (seen.has(p.bioguideId)) return null
    seen.add(p.bioguideId)
    members.push({
      ...p,
      chamber: raw.chamber,
      votingMember: raw.votingMember,
      officialWebsiteUrl: officialUrl(raw.officialWebsiteUrl, isMemberSite, true),
    })
  }
  const count = (fn) => members.filter(fn).length
  const actual = {
    house: count((m) => m.chamber === 'house'),
    senate: count((m) => m.chamber === 'senate'),
    houseVoting: count((m) => m.chamber === 'house' && m.votingMember),
    houseNonVoting: count((m) => m.chamber === 'house' && !m.votingMember),
  }
  const c = json.counts
  if (!isObj(c) || Object.keys(actual).some((k) => c[k] !== actual[k])) return null
  if (actual.house === 0 || actual.senate === 0 || actual.house > CHAMBER_MAX.house || actual.senate > CHAMBER_MAX.senate) return null
  return { congress: expectedCongress, generatedAt: json.generatedAt, members }
}

function historyBill(raw, chamber) {
  if (raw === null || raw === undefined) return null
scripts/eval/run-golden.mjs
scripts/eval/news.test.mjs
scripts/eval/race.test.mjs
scripts/eval/news-golden.json
scripts/eval/fixtures/history-summaries.json
scripts/eval/fixtures/feeds/html-200.html
src/data/statehoodBill.js
scripts/eval/fixtures/feeds/valid-rss.xml
scripts/eval/fixtures/feeds/malformed.xml
scripts/eval/fixtures/feeds/valid-atom.xml
scripts/eval/fixtures/feeds/empty-but-valid.xml
src/data/memberSort.js
src/data/statehoodPartners.js
src/StatehoodPartnerMap.css
src/StatehoodPartnerMap.jsx
src/StatehoodBillSources.jsx
src/StatehoodBill.jsx
src/StatehoodCurious.jsx
src/StatehoodBill.css
src/fixtures/statehoodBill.js
src/hooks/useStatehoodBillData.js

codex
The new hooks are unconditional, and the selects have labels and use native keyboard behavior. I’m checking the roster’s name and date formats and how party selections behave across tabs. This should take another few minutes; no input is needed.
exec
/bin/zsh -lc 'nl -ba src/data/memberSort.js; ls /Users/andriathomas/Projects/dc-bills-tracker; ls /Users/andriathomas/Projects/representdc-main/node_modules/.bin' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
     1	// Ordering and party options for the member list on /statehood-bill. Pure functions.
     2	
     3	// Lower-case words that begin a surname ("Van Hollen", "De La Cruz"). The tracker
     4	// publishes names as "First Last" with no separate family name, so the last word is taken
     5	// as the surname and these particles are pulled in with it. Unhyphenated double surnames
     6	// ("Wasserman Schultz") cannot be told apart from a middle name plus surname ("Holmes
     7	// Norton"), so those sort by their final word.
     8	const PARTICLES = new Set(['van', 'von', 'de', 'del', 'della', 'la', 'le', 'du', 'st', 'st.'])
     9	const SUFFIX = /^(jr\.?|sr\.?|i{1,3}|iv|v)$/i
    10	
    11	const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    12	
    13	/** "hollen van chris" style key: surname first (with particles), then the rest. */
    14	export function lastNameKey(name) {
    15	  const tokens = fold(name).replace(/,/g, ' ').split(/\s+/).filter(Boolean)
    16	  while (tokens.length > 1 && SUFFIX.test(tokens.at(-1))) tokens.pop()
    17	  let start = tokens.length - 1
    18	  while (start > 1 && PARTICLES.has(tokens[start - 1])) start -= 1
    19	  return [...tokens.slice(start), ...tokens.slice(0, start)].join(' ')
    20	}
    21	
    22	const byName = (a, b) => lastNameKey(a.name).localeCompare(lastNameKey(b.name))
    23	// Sign-on order: dated cosponsors first, then the sponsor, then members not yet signed on.
    24	const RANK = { signed: 0, sponsor: 1, 'not-yet': 2 }
    25	
    26	export const SORTS = [
    27	  { key: 'name', label: 'Last name (A–Z)' },
    28	  { key: 'recent', label: 'Most recently signed on' },
    29	  { key: 'state', label: 'State' },
    30	]
    31	
    32	/**
    33	 * Returns a new array in the chosen order. `members` arrives in state order (state,
    34	 * district, name) from memberStatuses, so 'state' is the order as given. 'recent' puts the
    35	 * newest sign-on first; most cosponsors share the introduction date, so ties fall back to
    36	 * last name. Rows without a sign-on date (the sponsor, then members not yet signed on)
    37	 * follow the dated ones rather than being dropped.
    38	 */
    39	export function sortMembers(members, sort) {
    40	  if (sort === 'state') return members
    41	  if (sort === 'recent') {
    42	    return [...members].sort((a, b) =>
    43	      RANK[a.status] - RANK[b.status] ||
    44	      (b.date ?? '').localeCompare(a.date ?? '') ||
    45	      byName(a, b))
    46	  }
    47	  return [...members].sort(byName)
    48	}
    49	
    50	const PARTY_LABELS = { D: 'Democrats', R: 'Republicans', I: 'Independents' }
    51	// A member whose party the tracker did not publish is still listed, under its own option.
    52	export const NO_PARTY = 'none'
    53	export const partyKey = (member) => member.party ?? NO_PARTY
    54	
    55	/** Party options present among `members`, in a fixed order, each with its count. */
    56	export function partyOptions(members) {
    57	  const counts = {}
    58	  for (const m of members) counts[partyKey(m)] = (counts[partyKey(m)] ?? 0) + 1
    59	  return ['D', 'R', 'I', NO_PARTY]
    60	    .filter((key) => counts[key])
    61	    .map((key) => ({ key, label: PARTY_LABELS[key] ?? 'Party not listed', count: counts[key] }))
    62	}
AUTO-SYNC.md
CLAUDE.md
DEPLOYMENT.md
DEVELOPMENT-GUIDELINES.md
EMAIL-NOTIFICATION-SETUP.md
FEEDBACK-SETUP.md
GIT-WORKFLOW.md
METHODOLOGY.md
MONITORING-VERIFICATION.md
PUBLIC-LISTING-GUARDRAILS-DRAFT.md
README.md
WHATS-NEXT.md
bill-status-history.json
dc-candidates-schema.json
decisions
deploy-staging.js
dist
docs
eslint.config.js
index.html
newsletters
node_modules
package-lock.json
package.json
public
reviews
scripts
src
vite.config.js
acorn
anthropic-ai-sdk
baseline-browser-mapping
browserslist
esbuild
eslint
gh-pages
gh-pages-clean
js-yaml
jsesc
json5
nanoid
node-which
parser
playwright
playwright-core
rollup
semver
specificity
tldts
update-browserslist-db
vite

exec
/bin/zsh -lc 'cat src/fixtures/statehoodBill.js; cat src/hooks/useStatehoodBillData.js; cat src/StatehoodBill.jsx; cat eslint.config.js' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
// DEV-ONLY FIXTURES for /statehood-bill. Loaded only through the `import.meta.env.DEV`
// branch in useStatehoodBillData, so no production build can reach this file.
//
// Bill-level values are the real 119th-Congress figures (representdc-data archive,
// 2026-11-08; tracker check 2026-11-09): H.R. 51, 209 cosponsors incl. 2 non-voting, 159
// original, introduced 2025-01-03; S. 51, 43 cosponsors, 40 original, introduced
// 2025-01-09; end-of-Congress history 115th–119th.
//
// Every MEMBER row (cosponsors and roster) is deliberately fake: names are "Fixture
// member …", Bioguide IDs are Z100001 and up (real Z IDs are Z000…), websites are
// fixture-member-*.house.gov / .senate.gov hosts that do not exist. They exist to exercise
// the counts, the join and the filters, never to look like real people.

const STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
  'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH',
  'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
const PARTIES = ['D', 'R', 'R', 'D', 'I']
const pad = (n) => String(n).padStart(3, '0')
const HOUSE_SPONSOR = 'Z800001'
const SENATE_SPONSOR = 'Z800002'

function roster() {
  const members = []
  const districtCount = {}
  for (let i = 1; i <= 435; i++) {
    const state = STATES[(i - 1) % STATES.length]
    districtCount[state] = (districtCount[state] ?? 0) + 1
    members.push({
      bioguideId: `Z${100000 + i}`, name: `Fixture member H${pad(i)}`, party: PARTIES[i % PARTIES.length],
      state, district: districtCount[state], chamber: 'house', votingMember: true,
      officialWebsiteUrl: `https://fixture-member-h${pad(i)}.house.gov`,
    })
  }
  ;['DC', 'PR', 'VI', 'GU', 'AS', 'MP'].forEach((state, j) => members.push({
    bioguideId: state === 'DC' ? HOUSE_SPONSOR : `Z${200000 + j}`, name: `Fixture member ${state} non-voting`,
    party: 'D', state, district: null, chamber: 'house', votingMember: false,
    officialWebsiteUrl: j === 3 ? null : `https://fixture-member-${state.toLowerCase()}.house.gov`,
  }))
  for (let i = 1; i <= 100; i++) {
    members.push({
      bioguideId: i === 1 ? SENATE_SPONSOR : `Z${300000 + i}`, name: `Fixture member S${pad(i)}`,
      party: PARTIES[i % PARTIES.length], state: STATES[(i - 1) % STATES.length], district: null,
      chamber: 'senate', votingMember: true, officialWebsiteUrl: `https://fixture-member-s${pad(i)}.senate.gov`,
    })
  }
  return members
}

// Spread n later sponsorship dates between `from` and the real latest date `to`.
function laterDates(n, from, to) {
  const a = Date.parse(`${from}T00:00:00Z`)
  const b = Date.parse(`${to}T00:00:00Z`)
  return Array.from({ length: n }, (_, k) =>
    new Date(n === 1 ? b : a + ((b - a) * (k + 1)) / n).toISOString().slice(0, 10))
}

function cosponsorsFrom(members, { count, original, introduced, latest, nonVoting = [] }) {
  const pool = [
    ...members.filter((m) => nonVoting.includes(m.state)),
    ...members.filter((m) => m.votingMember && m.bioguideId !== HOUSE_SPONSOR && m.bioguideId !== SENATE_SPONSOR),
  ].slice(0, count)
  const later = laterDates(count - original, '2025-02-01', latest)
  return pool.map((m, k) => ({
    bioguideId: m.bioguideId, name: m.name, party: m.party, state: m.state, district: m.district,
    sponsorshipDate: k < original ? introduced : later[k - original], isOriginalCosponsor: k < original,
  }))
}

// The page withholds "this month" and the lookup when checks are stale, so the fixture
// is always "checked an hour ago" (the real tracker check on 2026-11-09 was 1:10 PM ET).
const CHECKED_AT = new Date(Date.now() - 60 * 60 * 1000).toISOString()

function bills(scenario) {
  const members = roster()
  const house = members.filter((m) => m.chamber === 'house')
  const senate = members.filter((m) => m.chamber === 'senate')
  return {
    generatedAt: CHECKED_AT,
    bills: [
      {
        chamber: 'house', congress: 119, billNumber: 'H.R. 51', current: true,
        sponsor: { bioguideId: HOUSE_SPONSOR, name: 'Fixture member DC non-voting', party: 'D', state: 'DC', district: null },
        introducedDate: '2025-01-03',
        latestAction: { actionDate: '2025-01-03', text: 'Referred to the Committee on Oversight and Government Reform.' },
        congressGovUrl: 'https://www.congress.gov/bill/119th-congress/house-bill/51',
        checkedAt: CHECKED_AT,
        cosponsors: cosponsorsFrom(house, { count: 209, original: 159, introduced: '2025-01-03', latest: '2026-10-09', nonVoting: ['PR', 'VI'] }),
        totals: { cosponsors: 209, original: 159, nonVoting: 2 },
      },
      {
        chamber: 'senate', congress: 119, billNumber: 'S. 51', current: scenario !== 'transition',
        sponsor: { bioguideId: SENATE_SPONSOR, name: 'Fixture member S001', party: 'D', state: 'AL', district: null },
        introducedDate: '2025-01-09',
        latestAction: { actionDate: '2025-01-09', text: 'Read twice and referred to the Committee on Homeland Security and Governmental Affairs.' },
        congressGovUrl: 'https://www.congress.gov/bill/119th-congress/senate-bill/51',
        checkedAt: CHECKED_AT,
        cosponsors: cosponsorsFrom(senate, { count: 43, original: 40, introduced: '2025-01-09', latest: '2025-04-29' }),
        totals: { cosponsors: 43, original: 40, nonVoting: 0 },
      },
    ],
  }
}

const govinfo = (c, type, n) => `https://www.govinfo.gov/bulkdata/BILLSTATUS/${c}/${type}/BILLSTATUS-${c}${type}${n}.xml`

const HISTORY = {
  generatedAt: CHECKED_AT,
  congresses: [
    { congress: 115, startYear: 2017, endYear: 2019, house: { billNumber: 'H.R. 1291', cosponsors: 181, url: govinfo(115, 'hr', 1291) }, senate: { billNumber: 'S. 1278', cosponsors: 30, url: govinfo(115, 's', 1278) }, furthestAction: null },
    { congress: 116, startYear: 2019, endYear: 2021, house: { billNumber: 'H.R. 51', cosponsors: 227, url: govinfo(116, 'hr', 51) }, senate: { billNumber: 'S. 631', cosponsors: 42, url: govinfo(116, 's', 631) }, furthestAction: { text: 'Passed House', date: '2020-06-26' } },
    { congress: 117, startYear: 2021, endYear: 2023, house: { billNumber: 'H.R. 51', cosponsors: 216, url: govinfo(117, 'hr', 51) }, senate: { billNumber: 'S. 51', cosponsors: 45, url: govinfo(117, 's', 51) }, furthestAction: { text: 'Passed House', date: '2021-04-22' } },
    { congress: 118, startYear: 2023, endYear: 2025, house: { billNumber: 'H.R. 51', cosponsors: 211, url: govinfo(118, 'hr', 51) }, senate: { billNumber: 'S. 51', cosponsors: 46, url: govinfo(118, 's', 51) }, furthestAction: null },
    { congress: 119, startYear: 2025, endYear: null, final: false, house: { billNumber: 'H.R. 51', cosponsors: 209 }, senate: { billNumber: 'S. 51', cosponsors: 43 }, furthestAction: null },
  ],
}

export function fixture(key, scenario) {
  if (key === 'statehood-cosponsors') return bills(scenario)
  if (key === 'members-119') {
    const members = roster()
    const n = (fn) => members.filter(fn).length
    const counts = {
      house: n((m) => m.chamber === 'house'), senate: n((m) => m.chamber === 'senate'),
      houseVoting: n((m) => m.chamber === 'house' && m.votingMember), houseNonVoting: n((m) => m.chamber === 'house' && !m.votingMember),
    }
    return { congress: 119, generatedAt: CHECKED_AT, counts, members }
  }
  if (key === 'statehood-bill-history') return structuredClone(HISTORY)
  throw new Error(`no fixture for ${key}`)
}
import { useEffect, useState } from 'react'
import { STATS_BASE_URL } from '../utils/statsBaseUrl'
import { parseCosponsors, parseMembers, parseHistory } from '../data/statehoodBill'

// The tracker files behind /statehood-bill. Each loads and validates on its own, so a
// missing roster hides only the lookup, not the counts. No fallback values: a section
// renders nothing until its file arrives and passes validation (useBillStats rule).
//
// Rosters are per Congress (members-119.json, members-120.json, ...) and are fetched for
// the Congress of each chamber's current bill, so the House and Senate can switch to the
// 120th independently.

async function loadRaw(name) {
  // Dev-only fixtures (VITE_STATEHOOD_FIXTURES=1, or =transition for the Senate row's
  // switchover state). `import.meta.env.DEV` is a build-time false in production, so this
  // branch and the fixture module are dropped from the production bundle entirely.
  if (import.meta.env.DEV && import.meta.env.VITE_STATEHOOD_FIXTURES) {
    const { fixture } = await import('../fixtures/statehoodBill.js')
    return fixture(name, import.meta.env.VITE_STATEHOOD_FIXTURES)
  }
  const response = await fetch(`${STATS_BASE_URL}/api/${name}.json`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

async function load(name, parse) {
  try {
    const data = parse(await loadRaw(name))
    if (!data) throw new Error('failed validation')
    return { data, status: 'ready' }
  } catch (error) {
    console.warn(`statehood-bill: /api/${name}.json unavailable (${error.message})`)
    return { data: null, status: 'error' }
  }
}

const LOADING = { data: null, status: 'loading' }

export function useStatehoodBillData() {
  const [cosponsors, setCosponsors] = useState(LOADING)
  const [history, setHistory] = useState(LOADING)
  // Keyed by Congress number: { 119: { data, status } }.
  const [rosters, setRosters] = useState({})

  useEffect(() => {
    let cancelled = false
    load('statehood-cosponsors', parseCosponsors).then((r) => !cancelled && setCosponsors(r))
    load('statehood-bill-history', parseHistory).then((r) => !cancelled && setHistory(r))
    return () => {
      cancelled = true
    }
  }, [])

  const bills = cosponsors.data
  const wanted = bills
    ? [...new Set([bills.house, bills.senate].filter((b) => b && b.current && b.complete).map((b) => b.congress))].join(',')
    : ''

  useEffect(() => {
    if (!wanted) return undefined
    let cancelled = false
    for (const congress of wanted.split(',').map(Number)) {
      load(`members-${congress}`, (raw) => parseMembers(raw, congress))
        .then((r) => !cancelled && setRosters((s) => ({ ...s, [congress]: r })))
    }
    return () => {
      cancelled = true
    }
  }, [wanted])

  return { cosponsors, history, rosters }
}
import Nav from './components/Nav'
import Footer from './components/Footer'
import Icon from './components/Icon'
import MemberLookup from './components/MemberLookup'
import { MemberName } from './components/MemberRow'
import { useStatehoodBillData } from './hooks/useStatehoodBillData'
import { formatCheckedInstant } from './utils/formatCheckedInstant'
import { formatDate, historyWithLive, ordinal, signedThisMonth } from './data/statehoodBill'
import StatehoodBillSources from './StatehoodBillSources'
import './App.css'
import './StatehoodBill.css'

// /statehood-bill — who has cosponsored the Washington, D.C. Admission Act. Every number
// comes from the tracker's files (useStatehoodBillData); nothing renders until they load.
// Public sentences are the approved drafts in dc-bills-tracker's PRD § 7
// (docs/2026-11-10-cosponsor-page-and-120th-overview-prd.md).

// Approved by Andria 2026-11-10 ("My edited version"), revised after a Codex fact check
// (reviews/2026-11-10-statehood-bill-what-it-is-codex-high.raw.md): it describes the
// legislative route and stays clear of D.C.'s own unresolved constitutional questions.
// Its two sources (New States Clause overview, CRS R47101) are in StatehoodBillSources.
// If this is ever set back to null, the dev server shows a marked placeholder and
// production omits it.
const WHAT_IT_IS =
  'The Washington, D.C. Admission Act would admit the land outside a shrunken federal district as a state by legislation, the route used for all 37 states admitted after the original 13.'

const CHAMBER_NAME = { house: 'House', senate: 'Senate' }

function ExternalLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} <Icon name="external-link" size={14} />
    </a>
  )
}

function NotLinkedNote({ bill }) {
  return <p className="bill-transition">No confirmed {ordinal(bill.congress + 1)}-Congress bill linked yet.</p>
}

function ChamberRow({ bill }) {
  return (
    <div className="bill-row">
      {!bill.current && <NotLinkedNote bill={bill} />}
      <p className="bill-row-head">
        <span className="bill-number">{bill.billNumber}</span>
        <span className="bill-chamber">{CHAMBER_NAME[bill.chamber]}{!bill.current && ` · ${ordinal(bill.congress)} Congress`}</span>
      </p>
      <dl className="bill-facts">
        <div><dt>Sponsor</dt><dd><MemberName chamber={bill.chamber} member={bill.sponsor} /></dd></div>
        <div><dt>Introduced</dt><dd>{formatDate(bill.introducedDate)}</dd></div>
        <div>
          <dt>Latest action</dt>
          <dd>{bill.latestAction.text} <span className="mono-date">({formatDate(bill.latestAction.actionDate)})</span></dd>
        </div>
        <div><dt>Official record</dt><dd><ExternalLink href={bill.congressGovUrl}>Congress.gov</ExternalLink></dd></div>
      </dl>
    </div>
  )
}

function CountCard({ bill }) {
  const { cosponsors, nonVoting } = bill.totals
  return (
    <div className="count-card">
      <p className="count-label">
        {CHAMBER_NAME[bill.chamber]} · {bill.billNumber}{!bill.current && ` · ${ordinal(bill.congress)} Congress`}
      </p>
      <p className="count-number">
        {cosponsors}
        <span className="count-unit">{cosponsors === 1 ? ' cosponsor' : ' cosponsors'}</span>
      </p>
      {nonVoting > 0 && (
        <p className="count-note">Including {nonVoting} non-voting {nonVoting === 1 ? 'member' : 'members'}.</p>
      )}
      <p className="count-checked">Last checked {formatCheckedInstant(bill.checkedAt)}</p>
    </div>
  )
}

function RecentSignOns({ recent }) {
  if (recent.rows.length === 0) {
    return recent.latestDate ? <p className="section-note">No new cosponsors since {formatDate(recent.latestDate)}.</p> : null
  }
  const n = recent.rows.length
  return (
    <>
      <p className="section-note recent-count">{n} new {n === 1 ? 'cosponsor' : 'cosponsors'} this month.</p>
      <ul className="recent-list">
        {recent.rows.map((c) => (
          <li key={`${c.chamber}-${c.bioguideId}`} className="recent-row">
            <MemberName chamber={c.chamber} member={c} />
            <span className="mono-date">{c.billNumber} · {formatDate(c.sponsorshipDate, 'short')}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

const congressYears = (row) => `${row.startYear}–${row.endYear ? String(row.endYear).slice(2) : ''}`

function HistoryTable({ rows }) {
  return (
    <div className="history-scroll" tabIndex={0} role="region" aria-labelledby="history-caption">
      <table className="history-table">
        <caption id="history-caption">
          Cosponsors at the end of each Congress; for a Congress still in session, the latest count.
        </caption>
        <thead>
          <tr>
            <th scope="col">Congress</th>
            <th scope="col">House bill</th>
            <th scope="col" className="num">House cosponsors</th>
            <th scope="col">Senate bill</th>
            <th scope="col" className="num">Senate cosponsors</th>
            <th scope="col">Furthest step</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.congress}>
              <th scope="row">{ordinal(r.congress)} ({congressYears(r)})</th>
              <td className="mono-date">{r.house?.billNumber ?? ''}</td>
              <td className="num">{r.house?.cosponsors ?? ''}</td>
              <td className="mono-date">{r.senate?.billNumber ?? ''}</td>
              <td className="num">{r.senate?.cosponsors ?? ''}</td>
              {/* The tracker publishes null when the bill got no further than introduction. */}
              <td>{r.furthestAction ? `${r.furthestAction.text}${r.furthestAction.date ? `, ${formatDate(r.furthestAction.date)}` : ''}` : 'Introduced'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatehoodBill() {
  const { cosponsors, history, rosters } = useStatehoodBillData()
  const bills = cosponsors.data
  const shown = bills ? [bills.house, bills.senate].filter(Boolean) : []
  const counted = shown.filter((b) => b.complete)
  const recent = signedThisMonth(shown)
  const congress = shown.length ? Math.max(...shown.map((b) => b.congress)) : null
  const historyRows = history.data ? historyWithLive(history.data, bills?.house, bills?.senate) : null

  return (
    <div className="app">
      <Nav />
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow">Statehood bill{congress && ` · ${ordinal(congress)} Congress`}</p>
          <h1>Who is behind the Washington, D.C. Admission Act</h1>
          <p className="hero-subtitle">
            {bills?.house && bills?.senate
              ? `Cosponsors of ${bills.house.billNumber} and ${bills.senate.billNumber}, from Congress.gov, checked daily.`
              : ' '}
          </p>
        </div>
      </header>

      <main className="impact-section statehood-bill">
        <div className="container sb-container">
          <section aria-labelledby="sb-what">
            <h2 id="sb-what">What the bill is and where it stands</h2>
            {WHAT_IT_IS
              ? <p>{WHAT_IT_IS}</p>
              : import.meta.env.DEV && (
                <p className="draft-placeholder">
                  [Placeholder for Andria, not public copy: two or three sentences on what the
                  Admission Act does and how statehood is granted, drafted from /the-case. Production
                  builds omit this paragraph until it is written.]
                </p>
              )}
            {shown.map((b) => <ChamberRow key={b.chamber} bill={b} />)}
            {shown.length > 0 && (
              <p className="section-note">
                Cosponsoring is a statement of support, not a vote. Passing the House ordinarily takes a
                majority of members voting; passing the Senate a majority, and ending debate there
                ordinarily takes 60 votes.
              </p>
            )}
          </section>

          {counted.length > 0 && (
            <section aria-labelledby="sb-counts">
              <h2 id="sb-counts">Recorded cosponsors</h2>
              <div className="count-grid">
                {counted.map((b) => <CountCard key={b.chamber} bill={b} />)}
              </div>
            </section>
          )}

          {recent && (
            <section aria-labelledby="sb-recent">
              <h2 id="sb-recent">Signed on this month</h2>
              <RecentSignOns recent={recent} />
            </section>
          )}

          {bills && Object.values(rosters).some((r) => r.data) && (
            <section aria-labelledby="sb-lookup">
              <h2 id="sb-lookup">Members who have not yet signed on</h2>
              <MemberLookup bills={bills} rosters={rosters} />
            </section>
          )}

          {historyRows && (
            <section aria-labelledby="sb-history">
              <h2 id="sb-history">The same bill in earlier Congresses</h2>
              <HistoryTable rows={historyRows} />
            </section>
          )}

          <StatehoodBillSources bills={shown} history={historyRows} congress={congress} explainer={Boolean(WHAT_IT_IS)} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default StatehoodBill
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'reference']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])

exec
/bin/zsh -lc "rg -n 'last.name|sort|party|recent|Van Hollen|Wasserman|De La|McIver|members-current' decisions scripts src/fixtures README.md; ls node_modules/.bin; git show HEAD"'^:src/components/MemberLookup.jsx' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
src/fixtures/statehoodBill.js:29:      bioguideId: `Z${100000 + i}`, name: `Fixture member H${pad(i)}`, party: PARTIES[i % PARTIES.length],
src/fixtures/statehoodBill.js:36:    party: 'D', state, district: null, chamber: 'house', votingMember: false,
src/fixtures/statehoodBill.js:42:      party: PARTIES[i % PARTIES.length], state: STATES[(i - 1) % STATES.length], district: null,
src/fixtures/statehoodBill.js:64:    bioguideId: m.bioguideId, name: m.name, party: m.party, state: m.state, district: m.district,
src/fixtures/statehoodBill.js:82:        sponsor: { bioguideId: HOUSE_SPONSOR, name: 'Fixture member DC non-voting', party: 'D', state: 'DC', district: null },
src/fixtures/statehoodBill.js:92:        sponsor: { bioguideId: SENATE_SPONSOR, name: 'Fixture member S001', party: 'D', state: 'AL', district: null },
scripts/post-to-bluesky.mjs:144:// its 50 most recent posts, stop and point to it. The workflow runs one post at a time, so
scripts/post-to-bluesky.mjs:147:async function recentPosts(did, token) {
scripts/post-to-bluesky.mjs:158:const existing = (await recentPosts(session.did, session.accessJwt))
scripts/eval/run-golden.mjs:156:  // correctly flagging a weak generation ("recently committed" about a 19-day-old item).
scripts/news/gates.mjs:103:    // future" untrue, and a tomorrow-dated item would sort to the top and render as
scripts/news/feeds.mjs:21:  // News outlets — recent coverage only.
scripts/news/feeds.mjs:195:      // worked, it simply has nothing recent.
scripts/news/judge.mjs:23:J3 temporal — D.C. statehood news moves slowly, so "currently", "ongoing", "recent" and the present tense are FINE for anything within roughly the last two months. Do not flag ordinary tense or word choice. Flag only outright errors: (a) describing something as pending, underway or under consideration when a headline shows it was already decided, passed, rejected or completed; (b) a date, duration or sequence the headlines contradict; (c) present-tense claims resting only on an article more than about two months old.
scripts/news/closers.mjs:21:  // "Congressional Disapproval of Acts of the Council" note, most recently Pub. L. 118-1.
scripts/eval/news-golden.json:42:      "note": "Published. RELABELLED 2026-09-12 on Andria's call: 39 days is inside the ~2-month window this beat moves on, so 'currently considering' is acceptable language, not an error. Kept as a case because the same body calls a takeover from 12+ months earlier 'recent', which is outside the window — borderline, so it scores neither as a required catch nor as a precision control.",
scripts/eval/fixtures/history-summaries.json:7:      "summary": "The Trump administration is challenging D.C.'s tuition policy for undocumented immigrants, while statehood advocates point to recent federal interventions—including a National Guard deployment and fiscal constraints—as evidence for the urgency of local autonomy. A senator has pledged to prioritize D.C. statehood, and advocates are urging Congress to reject further restrictions on the District's financial independence. Without statehood, Congress can override any law the District passes and can restrict how D.C. spends its own local tax revenue.",
scripts/eval/fixtures/history-summaries.json:8:      "body": "The Trump administration is challenging D.C.'s tuition policy for undocumented immigrants, while statehood advocates point to recent federal interventions—including a National Guard deployment and fiscal constraints—as evidence for the urgency of local autonomy. A senator has pledged to prioritize D.C. statehood, and advocates are urging Congress to reject further restrictions on the District's financial independence.",
scripts/eval/fixtures/history-summaries.json:59:      "summary": "D.C. statehood advocates are intensifying their efforts ahead of the midterm elections, with a senator committing to make statehood a priority while the movement highlights recent federal interventions—including a National Guard deployment and federal fiscal oversight—as evidence of why D.C. needs greater autonomy. Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress retains the power to deploy federal troops within the District's borders.",
scripts/eval/fixtures/history-summaries.json:60:      "body": "D.C. statehood advocates are intensifying their efforts ahead of the midterm elections, with a senator committing to make statehood a priority while the movement highlights recent federal interventions—including a National Guard deployment and federal fiscal oversight—as evidence of why D.C. needs greater autonomy.",
scripts/eval/fixtures/history-summaries.json:85:      "summary": "D.C. statehood advocates are intensifying their push at multiple levels, with efforts targeting the midterm elections, securing commitments from federal lawmakers, and responding to recent events including a federal takeover and National Guard deployment that they argue demonstrate the need for greater local autonomy. The movement is also working to protect D.C.'s fiscal independence against congressional action.\n\nWithout statehood, Congress can override any law the District passes and can unilaterally take control of D.C.'s government and finances.",
scripts/eval/fixtures/history-summaries.json:86:      "body": "D.C. statehood advocates are intensifying their push at multiple levels, with efforts targeting the midterm elections, securing commitments from federal lawmakers, and responding to recent events including a federal takeover and National Guard deployment that they argue demonstrate the need for greater local autonomy. The movement is also working to protect D.C.'s fiscal independence against congressional action.",
scripts/eval/fixtures/history-summaries.json:345:      "summary": "National Guard troops continue to remain deployed in D.C. more than a year after their initial arrival, drawing scrutiny from civil liberties advocates, while statehood advocates are intensifying efforts ahead of the midterm elections and working to build support among state-level lawmakers. A U.S. senator has committed to prioritizing D.C. statehood, and advocacy organizations are framing the federal response to recent events as evidence of why local autonomy is needed.\n\nWithout statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:346:      "body": "National Guard troops continue to remain deployed in D.C. more than a year after their initial arrival, drawing scrutiny from civil liberties advocates, while statehood advocates are intensifying efforts ahead of the midterm elections and working to build support among state-level lawmakers. A U.S. senator has committed to prioritizing D.C. statehood, and advocacy organizations are framing the federal response to recent events as evidence of why local autonomy is needed.",
scripts/eval/fixtures/history-summaries.json:371:      "summary": "Statehood advocates are intensifying their push ahead of the midterm elections, with renewed focus on voting rights and recent national events underscoring their case. A senator has committed to making D.C. statehood a priority, while advocates point to federal interventions in the District—including a National Guard deployment and federal takeover—as evidence that statehood is urgently needed. Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:372:      "body": "Statehood advocates are intensifying their push ahead of the midterm elections, with renewed focus on voting rights and recent national events underscoring their case. A senator has committed to making D.C. statehood a priority, while advocates point to federal interventions in the District—including a National Guard deployment and federal takeover—as evidence that statehood is urgently needed.",
scripts/eval/fixtures/history-summaries.json:423:      "summary": "D.C. statehood advocates are intensifying their push as the midterm elections approach, with efforts to build support both within the District and across state lines, while recent events including a federal takeover and the deployment of National Guard troops have renewed urgency around the statehood campaign. Senator Slotkin has pledged to prioritize D.C. statehood efforts.\n\nWithout statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:424:      "body": "D.C. statehood advocates are intensifying their push as the midterm elections approach, with efforts to build support both within the District and across state lines, while recent events including a federal takeover and the deployment of National Guard troops have renewed urgency around the statehood campaign. Senator Slotkin has pledged to prioritize D.C. statehood efforts.",
scripts/eval/fixtures/history-summaries.json:475:      "summary": "D.C. statehood advocates are intensifying their campaign ahead of the midterm elections, securing commitments from federal lawmakers and highlighting recent events—including the National Guard deployment and federal fiscal restrictions—as reasons why statehood is needed. The push encompasses both efforts to build support among states and pressure on Congress to protect D.C.'s limited local autonomy.\n\nWithout statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:476:      "body": "D.C. statehood advocates are intensifying their campaign ahead of the midterm elections, securing commitments from federal lawmakers and highlighting recent events—including the National Guard deployment and federal fiscal restrictions—as reasons why statehood is needed. The push encompasses both efforts to build support among states and pressure on Congress to protect D.C.'s limited local autonomy.",
scripts/eval/fixtures/history-summaries.json:527:      "summary": "D.C. statehood advocates are intensifying their push ahead of the midterm elections, with supporters highlighting recent events including federal intervention and National Guard deployment as reasons statehood is urgent. A senator has committed to prioritizing D.C. statehood while advocates work to protect the District's fiscal autonomy against congressional challenges. Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any local laws the District passes.",
scripts/eval/fixtures/history-summaries.json:528:      "body": "D.C. statehood advocates are intensifying their push ahead of the midterm elections, with supporters highlighting recent events including federal intervention and National Guard deployment as reasons statehood is urgent. A senator has committed to prioritizing D.C. statehood while advocates work to protect the District's fiscal autonomy against congressional challenges.",
scripts/eval/fixtures/history-summaries.json:553:      "summary": "D.C. statehood advocates are intensifying efforts ahead of the midterm elections, securing commitments from federal lawmakers and highlighting recent events—including the deployment of National Guard troops and threats to fiscal autonomy—as evidence for why statehood is necessary. The movement is working both within Congress and across states to build support for the cause.\n\nWithout statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:554:      "body": "D.C. statehood advocates are intensifying efforts ahead of the midterm elections, securing commitments from federal lawmakers and highlighting recent events—including the deployment of National Guard troops and threats to fiscal autonomy—as evidence for why statehood is necessary. The movement is working both within Congress and across states to build support for the cause.",
scripts/eval/fixtures/history-summaries.json:605:      "summary": "D.C. statehood advocates are intensifying their campaign ahead of the midterm elections, with supporters in Congress pledging to prioritize the issue while pointing to recent federal interventions—including the deployment of National Guard troops and federal budget constraints—as examples of why local autonomy matters. The movement is framing statehood as essential to protecting D.C.'s fiscal and operational independence from federal overreach.\n\nWithout statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:606:      "body": "D.C. statehood advocates are intensifying their campaign ahead of the midterm elections, with supporters in Congress pledging to prioritize the issue while pointing to recent federal interventions—including the deployment of National Guard troops and federal budget constraints—as examples of why local autonomy matters. The movement is framing statehood as essential to protecting D.C.'s fiscal and operational independence from federal overreach.",
scripts/eval/fixtures/history-summaries.json:631:      "summary": "D.C. statehood advocates are intensifying their efforts across multiple fronts, with campaigns targeting midterm elections and state-level support while highlighting recent federal interventions—including National Guard deployment and threats to fiscal independence—as evidence for why statehood is urgent. A senator has publicly committed to prioritizing D.C. statehood as a legislative goal. Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress retains the power to override any local law the District passes.",
scripts/eval/fixtures/history-summaries.json:632:      "body": "D.C. statehood advocates are intensifying their efforts across multiple fronts, with campaigns targeting midterm elections and state-level support while highlighting recent federal interventions—including National Guard deployment and threats to fiscal independence—as evidence for why statehood is urgent. A senator has publicly committed to prioritizing D.C. statehood as a legislative goal.",
scripts/eval/fixtures/history-summaries.json:657:      "summary": "D.C. statehood advocates are intensifying their push ahead of the midterm elections, with efforts to build support among states and elected officials while pointing to recent federal interventions—including a National Guard deployment and threats to fiscal independence—as evidence for why statehood is needed. A senator has committed to making D.C. statehood a priority, while advocacy groups continue to highlight how federal control over D.C. affairs demonstrates the urgency of the cause.\n\nWithout statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:658:      "body": "D.C. statehood advocates are intensifying their push ahead of the midterm elections, with efforts to build support among states and elected officials while pointing to recent federal interventions—including a National Guard deployment and threats to fiscal independence—as evidence for why statehood is needed. A senator has committed to making D.C. statehood a priority, while advocacy groups continue to highlight how federal control over D.C. affairs demonstrates the urgency of the cause.",
scripts/eval/fixtures/history-summaries.json:683:      "summary": "D.C. statehood advocates are pursuing multiple strategies to advance their cause, including mobilizing around midterm elections and securing commitments from sympathetic federal lawmakers, while also responding to recent events that they argue demonstrate the need for local autonomy. Recent federal interventions in D.C.—including a takeover and National Guard deployment—have prompted advocates to emphasize how statehood would protect the District from external federal control, and a House committee is currently considering proposals that advocates say would further undermine D.C.'s fiscal independence. Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:684:      "body": "D.C. statehood advocates are pursuing multiple strategies to advance their cause, including mobilizing around midterm elections and securing commitments from sympathetic federal lawmakers, while also responding to recent events that they argue demonstrate the need for local autonomy. Recent federal interventions in D.C.—including a takeover and National Guard deployment—have prompted advocates to emphasize how statehood would protect the District from external federal control, and a House committee is currently considering proposals that advocates say would further undermine D.C.'s fiscal independence.",
scripts/eval/fixtures/history-summaries.json:709:      "summary": "D.C. statehood advocates are intensifying efforts ahead of the midterm elections, with a senator committing to prioritize the issue and organizations highlighting recent events—including federal troop deployment and threats to fiscal independence—as evidence for why statehood is urgent. These campaigns are unfolding as advocates work to build support both within Congress and across other states.\n\nWithout statehood, Congress can override any law D.C. passes and can impose restrictions on how the District spends its locally generated tax revenue.",
scripts/eval/fixtures/history-summaries.json:710:      "body": "D.C. statehood advocates are intensifying efforts ahead of the midterm elections, with a senator committing to prioritize the issue and organizations highlighting recent events—including federal troop deployment and threats to fiscal independence—as evidence for why statehood is urgent. These campaigns are unfolding as advocates work to build support both within Congress and across other states.",
scripts/eval/fixtures/history-summaries.json:735:      "summary": "D.C. statehood advocates are intensifying efforts ahead of the midterm elections, with a senator committing to prioritize the issue while advocates reference recent events—including a National Guard deployment and federal fiscal interventions—as evidence for why statehood is urgent. The campaign is expanding beyond D.C. to reach voters in other states, and advocates are actively opposing congressional actions that constrain the District's autonomy.\n\nWithout statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:736:      "body": "D.C. statehood advocates are intensifying efforts ahead of the midterm elections, with a senator committing to prioritize the issue while advocates reference recent events—including a National Guard deployment and federal fiscal interventions—as evidence for why statehood is urgent. The campaign is expanding beyond D.C. to reach voters in other states, and advocates are actively opposing congressional actions that constrain the District's autonomy.",
scripts/eval/fixtures/history-summaries.json:761:      "summary": "D.C. statehood advocates are intensifying efforts around the midterm elections and highlighting recent federal interventions in the District, including a National Guard deployment and actions affecting D.C.'s fiscal autonomy, as reasons why statehood is urgently needed. A senator has committed to prioritizing D.C. statehood while the movement expands its outreach beyond the District.\n\nWithout statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:762:      "body": "D.C. statehood advocates are intensifying efforts around the midterm elections and highlighting recent federal interventions in the District, including a National Guard deployment and actions affecting D.C.'s fiscal autonomy, as reasons why statehood is urgently needed. A senator has committed to prioritizing D.C. statehood while the movement expands its outreach beyond the District.",
scripts/eval/fixtures/history-summaries.json:1047:      "summary": "A year after the National Guard deployment in Washington, D.C., advocacy groups are highlighting how federal control over the District's affairs underscores the need for statehood, with recent events continuing to demonstrate federal oversight of D.C.'s operations and autonomy. DC Vote is also urging lawmakers to reject measures that would further limit the District's fiscal independence. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1048:      "body": "A year after the National Guard deployment in Washington, D.C., advocacy groups are highlighting how federal control over the District's affairs underscores the need for statehood, with recent events continuing to demonstrate federal oversight of D.C.'s operations and autonomy. DC Vote is also urging lawmakers to reject measures that would further limit the District's fiscal independence.",
scripts/eval/fixtures/history-summaries.json:1541:      "summary": "One year after the National Guard deployment in Washington, D.C., statehood advocates are highlighting the incident as evidence of why the district needs greater autonomy and self-governance. Separately, DC Vote is urging lawmakers to reject legislation that would restrict the district's fiscal independence, while also pointing to recent federal control issues as underscoring the case for statehood.",
scripts/eval/fixtures/history-summaries.json:1542:      "body": "One year after the National Guard deployment in Washington, D.C., statehood advocates are highlighting the incident as evidence of why the district needs greater autonomy and self-governance. Separately, DC Vote is urging lawmakers to reject legislation that would restrict the district's fiscal independence, while also pointing to recent federal control issues as underscoring the case for statehood.",
scripts/eval/fixtures/history-summaries.json:1645:      "summary": "DC statehood advocates are pointing to recent federal interventions in local affairs—including a federal takeover, a dispute over voter rolls, and a court case involving ballroom construction—as evidence that the city lacks sufficient autonomy to govern itself. The headlines reflect ongoing tensions between DC's local authority and federal oversight, with supporters arguing these situations underscore the need for statehood.",
scripts/eval/fixtures/history-summaries.json:1646:      "body": "DC statehood advocates are pointing to recent federal interventions in local affairs—including a federal takeover, a dispute over voter rolls, and a court case involving ballroom construction—as evidence that the city lacks sufficient autonomy to govern itself. The headlines reflect ongoing tensions between DC's local authority and federal oversight, with supporters arguing these situations underscore the need for statehood.",
scripts/eval/fixtures/history-summaries.json:1671:      "summary": "The District is facing multiple challenges to its autonomy, with recent developments highlighting federal control over DC affairs and threats to its fiscal independence. DC has secured a legal victory regarding voter rolls against the Trump Administration, while advocacy groups emphasize how federal intervention in DC governance underscores the ongoing case for statehood.",
scripts/eval/fixtures/history-summaries.json:1672:      "body": "The District is facing multiple challenges to its autonomy, with recent developments highlighting federal control over DC affairs and threats to its fiscal independence. DC has secured a legal victory regarding voter rolls against the Trump Administration, while advocacy groups emphasize how federal intervention in DC governance underscores the ongoing case for statehood.",
scripts/eval/fixtures/history-summaries.json:1775:      "summary": "The District is navigating challenges to its autonomy on multiple fronts, including a recent victory against the Trump Administration regarding voter rolls and ongoing efforts to protect its fiscal independence from federal interference. Recent events involving federal control of DC resources and the President's comments about the city have renewed focus among advocacy groups on the need for greater home-rule protections and statehood.",
scripts/eval/fixtures/history-summaries.json:1776:      "body": "The District is navigating challenges to its autonomy on multiple fronts, including a recent victory against the Trump Administration regarding voter rolls and ongoing efforts to protect its fiscal independence from federal interference. Recent events involving federal control of DC resources and the President's comments about the city have renewed focus among advocacy groups on the need for greater home-rule protections and statehood.",
scripts/eval/fixtures/history-summaries.json:1827:      "summary": "A costly National Guard deployment in Washington is raising questions about federal control of the District, with advocates arguing the situation underscores the need for statehood and DC's fiscal independence. Multiple DC home-rule organizations are responding to recent federal actions and statements affecting the District's autonomy and governance.",
scripts/eval/fixtures/history-summaries.json:1828:      "body": "A costly National Guard deployment in Washington is raising questions about federal control of the District, with advocates arguing the situation underscores the need for statehood and DC's fiscal independence. Multiple DC home-rule organizations are responding to recent federal actions and statements affecting the District's autonomy and governance.",
scripts/eval/fixtures/history-summaries.json:1931:      "summary": "The Trump administration is proposing significant federal spending to maintain a National Guard presence in D.C. through 2029, while simultaneously advancing what DC statehood advocates characterize as threats to the district's fiscal independence and local control. DC Vote and other home-rule advocates are opposing what they describe as federal overreach into DC governance, including recent comments from the administration targeting local leadership.",
scripts/eval/fixtures/history-summaries.json:1932:      "body": "The Trump administration is proposing significant federal spending to maintain a National Guard presence in D.C. through 2029, while simultaneously advancing what DC statehood advocates characterize as threats to the district's fiscal independence and local control. DC Vote and other home-rule advocates are opposing what they describe as federal overreach into DC governance, including recent comments from the administration targeting local leadership.",
scripts/eval/fixtures/history-summaries.json:1983:      "summary": "Federal control of Washington, DC has become a focal point this week, with DC Vote opposing what it characterizes as threats to the city's fiscal independence and increased National Guard deployment under federal authority. The advocacy organization is responding to recent statements and actions regarding DC governance, including comments from President Trump about potential federal intervention in the district.",
scripts/eval/fixtures/history-summaries.json:1984:      "body": "Federal control of Washington, DC has become a focal point this week, with DC Vote opposing what it characterizes as threats to the city's fiscal independence and increased National Guard deployment under federal authority. The advocacy organization is responding to recent statements and actions regarding DC governance, including comments from President Trump about potential federal intervention in the district.",
scripts/eval/fixtures/history-summaries.json:2009:      "summary": "Recent federal actions have intensified scrutiny over DC's autonomy, with DC Vote opposing what it characterizes as threats to the district's fiscal independence and increased federal control through National Guard deployments. The advocacy group has responded to presidential comments about DC and recent developments it views as attempts to limit local governance ahead of the district's primary election. These developments highlight ongoing tensions between DC's local authority and federal oversight.",
scripts/eval/fixtures/history-summaries.json:2010:      "body": "Recent federal actions have intensified scrutiny over DC's autonomy, with DC Vote opposing what it characterizes as threats to the district's fiscal independence and increased federal control through National Guard deployments. The advocacy group has responded to presidential comments about DC and recent developments it views as attempts to limit local governance ahead of the district's primary election. These developments highlight ongoing tensions between DC's local authority and federal oversight.",
scripts/eval/fixtures/history-summaries.json:2087:      "summary": "Federal control over the District has become a focal point of recent debate, with DC Vote responding to multiple threats to the city's autonomy—including comments from President Trump about a potential DC takeover, expanded National Guard deployment in Washington, and proposed legislation that would restrict DC's fiscal independence. The advocacy group is urging House committees to reject measures that would further limit DC's self-governance while raising concerns about the implications of federal military presence in the District.",
scripts/eval/fixtures/history-summaries.json:2088:      "body": "Federal control over the District has become a focal point of recent debate, with DC Vote responding to multiple threats to the city's autonomy—including comments from President Trump about a potential DC takeover, expanded National Guard deployment in Washington, and proposed legislation that would restrict DC's fiscal independence. The advocacy group is urging House committees to reject measures that would further limit DC's self-governance while raising concerns about the implications of federal military presence in the District.",
scripts/eval/fixtures/history-summaries.json:2139:      "summary": "DC statehood advocates are raising concerns about federal overreach and threats to DC's autonomy, citing recent developments involving federal military presence in the district and comments from national leadership. Multiple headlines point to growing tensions around DC's fiscal independence and local governance as the primary election approaches.",
scripts/eval/fixtures/history-summaries.json:2140:      "body": "DC statehood advocates are raising concerns about federal overreach and threats to DC's autonomy, citing recent developments involving federal military presence in the district and comments from national leadership. Multiple headlines point to growing tensions around DC's fiscal independence and local governance as the primary election approaches.",
scripts/eval/fixtures/history-summaries.json:2165:      "summary": "DC statehood and home-rule advocates are expressing concerns about federal control of the District, with recent developments including a House committee proposal affecting DC's fiscal independence, increased National Guard deployment in the capital, and statements from the Trump administration regarding federal takeover of DC. These issues have prompted DC Vote and other organizations to mobilize public response ahead of DC's primary election.",
scripts/eval/fixtures/history-summaries.json:2166:      "body": "DC statehood and home-rule advocates are expressing concerns about federal control of the District, with recent developments including a House committee proposal affecting DC's fiscal independence, increased National Guard deployment in the capital, and statements from the Trump administration regarding federal takeover of DC. These issues have prompted DC Vote and other organizations to mobilize public response ahead of DC's primary election.",
scripts/eval/fixtures/history-summaries.json:2217:      "summary": "Federal control over Washington, D.C. has become a focal point of debate, with DC Vote raising concerns about threats to the district's fiscal independence and increased National Guard deployment in the capital. The advocacy group is responding to recent developments involving federal authority in DC, including presidential comments and actions that have drawn scrutiny ahead of the district's primary election.",
scripts/eval/fixtures/history-summaries.json:2218:      "body": "Federal control over Washington, D.C. has become a focal point of debate, with DC Vote raising concerns about threats to the district's fiscal independence and increased National Guard deployment in the capital. The advocacy group is responding to recent developments involving federal authority in DC, including presidential comments and actions that have drawn scrutiny ahead of the district's primary election.",
scripts/eval/fixtures/history-summaries.json:2269:      "summary": "DC statehood advocates are raising concerns about federal control and interference in District governance, citing threats to fiscal independence, expanded National Guard presence in the city, and recent presidential comments about a potential federal takeover. Multiple statements from DC Vote suggest growing tensions between local DC interests and federal authority over the District's operations and elections.",
scripts/eval/fixtures/history-summaries.json:2270:      "body": "DC statehood advocates are raising concerns about federal control and interference in District governance, citing threats to fiscal independence, expanded National Guard presence in the city, and recent presidential comments about a potential federal takeover. Multiple statements from DC Vote suggest growing tensions between local DC interests and federal authority over the District's operations and elections.",
scripts/eval/fixtures/history-summaries.json:2347:      "summary": "DC statehood advocates are raising concerns about federal control and interference in District governance, citing recent House committee actions, National Guard deployments, and presidential statements as threats to local autonomy. The advocacy group DC Vote is urging lawmakers to protect DC's fiscal independence while calling attention to what it characterizes as expanding federal involvement in local affairs.",
scripts/eval/fixtures/history-summaries.json:2348:      "body": "DC statehood advocates are raising concerns about federal control and interference in District governance, citing recent House committee actions, National Guard deployments, and presidential statements as threats to local autonomy. The advocacy group DC Vote is urging lawmakers to protect DC's fiscal independence while calling attention to what it characterizes as expanding federal involvement in local affairs.",
scripts/eval/fixtures/history-summaries.json:2373:      "summary": "DC's home rule authority is facing renewed scrutiny from Congress as a House committee considers legislation affecting the district's tax powers, while DC statehood advocates are raising concerns about federal control and criticizing recent statements from the Trump administration regarding DC's governance and autonomy.",
scripts/eval/fixtures/history-summaries.json:2374:      "body": "DC's home rule authority is facing renewed scrutiny from Congress as a House committee considers legislation affecting the district's tax powers, while DC statehood advocates are raising concerns about federal control and criticizing recent statements from the Trump administration regarding DC's governance and autonomy.",
scripts/eval/fixtures/history-summaries.json:2399:      "summary": "The District's home rule authority is under scrutiny as a House Committee considers a tax authority bill, while DC Vote and other advocates are pushing back against what they characterize as threats to the city's fiscal independence. Meanwhile, political divisions are emerging within DC's electoral landscape, and recent federal actions have renewed focus on questions of federal control over the District's governance.",
scripts/eval/fixtures/history-summaries.json:2400:      "body": "The District's home rule authority is under scrutiny as a House Committee considers a tax authority bill, while DC Vote and other advocates are pushing back against what they characterize as threats to the city's fiscal independence. Meanwhile, political divisions are emerging within DC's electoral landscape, and recent federal actions have renewed focus on questions of federal control over the District's governance.",
scripts/eval/fixtures/history-summaries.json:2425:      "summary": "A House committee is advancing legislation that would affect D.C.'s tax authority, prompting advocacy groups to warn against what they characterize as threats to the district's fiscal independence. Meanwhile, D.C.'s political landscape is being tested by independent and Green Party candidates challenging the unified Democratic slate, and recent federal actions have renewed focus on the extent of federal control over the district.",
scripts/eval/fixtures/history-summaries.json:2426:      "body": "A House committee is advancing legislation that would affect D.C.'s tax authority, prompting advocacy groups to warn against what they characterize as threats to the district's fiscal independence. Meanwhile, D.C.'s political landscape is being tested by independent and Green Party candidates challenging the unified Democratic slate, and recent federal actions have renewed focus on the extent of federal control over the district.",
scripts/fetch-news.mjs:130:    .sort((a, b) => b._ts - a._ts)
decisions/2026-09-11-news-pipeline-to-main-site.md:112:- Email through a new mail service, or push through a third-party service, for review
decisions/2026-07-10-design-system-integration.md:77:previously-unused `--status-*`/`--party-*` set) were synced into this repo's
decisions/2026-07-10-design-system-integration.md:107:Nixon, Frederick Douglass, and party platforms without inline citation links, unlike
decisions/2026-07-27-domain-standards-and-rollout.md:54:  ~73 kB gzip. Third-party SDKs do not go in our bundles.
decisions/2026-07-27-domain-standards-and-rollout.md:86:Third-party SDKs load async and stay out of the bundle. Any dependency adding more
decisions/2026-07-11-content-review-and-audience.md:12:**D.C. voters** — primary election date, office/party filters, candidate-questionnaire
decisions/2026-07-11-content-review-and-audience.md:61:   `categoryDetails.js`, despite `STRATEGY.md`'s explicit "no party labels" rule:
decisions/2026-07-11-content-review-and-audience.md:65:     passed a continuing resolution" — this one was a direct party-label mention, a
decisions/2026-07-11-billtracker-token-remap.md:20:  category badge → `--navy` (neutral label); sponsor party badges → `--party-r/d/i`;
decisions/2026-07-26-talking-point-generator-scope.md:81:  sharpness setting makes an existing tension (`DESIGN-GUARDRAILS.md` bans party-label
acorn
anthropic-ai-sdk
baseline-browser-mapping
browserslist
esbuild
eslint
gh-pages
gh-pages-clean
js-yaml
jsesc
json5
nanoid
node-which
parser
playwright
playwright-core
rollup
semver
specificity
tldts
update-browserslist-db
vite
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-bcFD4L8l' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-MK4Cqpr5' (errno=Operation not permitted)
import { useId, useMemo, useRef, useState } from 'react'
import { MemberRow } from './MemberRow'
import { memberStatuses, ordinal } from '../data/statehoodBill'

const CHAMBERS = [
  { key: 'house', label: 'House', plural: 'House members' },
  { key: 'senate', label: 'Senate', plural: 'senators' },
]
const FILTERS = [
  { key: 'not-yet', label: 'Not yet signed on' },
  { key: 'signed', label: 'Signed on' },
  { key: 'all', label: 'All' },
]

// The organizer view: every current member, their status on this chamber's bill.
// Tabs follow the WAI-ARIA tabs pattern (arrow keys move between them); filters are a
// native radio group, so they work by keyboard with no extra code.
function MemberLookup({ bills, rosters }) {
  const [chamber, setChamber] = useState('house')
  const [filter, setFilter] = useState('not-yet')
  const [stateCode, setStateCode] = useState('')
  const [query, setQuery] = useState('')
  const tabRefs = useRef({})
  const id = useId()

  const bill = bills[chamber]
  // A roster only answers "not yet" for its own Congress, and only while this chamber's
  // bill is the current one with a complete cosponsor list. memberStatuses returns null
  // when the files disagree about a member, and the panel then shows nothing.
  const roster = bill ? rosters[bill.congress]?.data : null
  const statuses = useMemo(
    () => (bill && bill.current && bill.complete ? memberStatuses(roster, bill) : null),
    [bill, roster],
  )
  const usable = Boolean(statuses)
  const all = useMemo(() => statuses ?? [], [statuses])
  const states = useMemo(() => [...new Set(all.map((m) => m.state))].sort(), [all])
  const needle = query.trim().toLowerCase()
  const shown = all.filter((m) =>
    (filter === 'all' || m.status === filter || (filter === 'signed' && m.status === 'sponsor')) &&
    (!stateCode || m.state === stateCode) &&
    (!needle || m.name.toLowerCase().includes(needle)))

  const selectTab = (key) => {
    setChamber(key)
    setStateCode('')
    tabRefs.current[key]?.focus()
  }
  const onTabKey = (e) => {
    const i = CHAMBERS.findIndex((c) => c.key === chamber)
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: CHAMBERS.length - 1 }[e.key]
    if (next === undefined) return
    e.preventDefault()
    selectTab(CHAMBERS[(next + CHAMBERS.length) % CHAMBERS.length].key)
  }

  const active = CHAMBERS.find((c) => c.key === chamber)

  return (
    <div className="lookup">
      <div className="lookup-tabs" role="tablist" aria-label="Chamber">
        {CHAMBERS.map((c) => (
          <button
            key={c.key}
            ref={(el) => { tabRefs.current[c.key] = el }}
            type="button"
            role="tab"
            id={`${id}-tab-${c.key}`}
            aria-selected={chamber === c.key}
            aria-controls={`${id}-panel`}
            tabIndex={chamber === c.key ? 0 : -1}
            className="lookup-tab"
            onClick={() => selectTab(c.key)}
            onKeyDown={onTabKey}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${chamber}`} className="lookup-panel">
        {!usable ? (
          bill && !bill.current
            ? <p className="lookup-empty">No confirmed {ordinal(bill.congress + 1)}-Congress bill linked yet.</p>
            : null
        ) : (
          <>
            <div className="lookup-controls">
              <fieldset className="lookup-filters">
                <legend className="sr-only">Show</legend>
                {FILTERS.map((f) => (
                  <label key={f.key} className="filter-chip">
                    <input type="radio" name={`${id}-filter`} value={f.key} checked={filter === f.key} onChange={() => setFilter(f.key)} />
                    <span>{f.label}</span>
                  </label>
                ))}
              </fieldset>
              <label className="lookup-field">
                <span>State</span>
                <select value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
                  <option value="">All states</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="lookup-field">
                <span>Search by name</span>
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
              </label>
            </div>
            <p className="lookup-count" role="status" aria-live="polite">
              Showing {shown.length} of {all.length} {active.plural}.
            </p>
            {shown.length > 0 && (
              <ul className="member-list">
                {shown.map((m) => <MemberRow key={m.bioguideId} member={m} />)}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MemberLookup

exec
/bin/zsh -lc "rg --files /Users/andriathomas/Projects/dc-bills-tracker/public/api | rg 'members-119|statehood-cosponsors'; cat eslint.config.js; node --version" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
/Users/andriathomas/Projects/dc-bills-tracker/public/api/members-119.json
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'reference']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
v22.16.0

exec
/bin/zsh -lc './node_modules/.bin/eslint src/components/MemberLookup.jsx src/data/memberSort.js' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 348ms:
[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`

exec
/bin/zsh -lc "node --input-type=module -e '
import assert from '\\''node:assert/strict'\\''
import { readFileSync } from '\\''node:fs'\\''
import { lastNameKey, sortMembers, partyOptions, partyKey } from '\\''./src/data/memberSort.js'\\''
const member = (name, status, date=null, party=null) => ({name,status,date,party})
const input = [member('\\''Null Notyet'\\'','\\''not-yet'\\''),member('\\''Origin Sponsor'\\'','\\''sponsor'\\''),member('\\''Zoe Beta'\\'','\\''signed'\\'','\\''2026-11-12'\\'','\\''D'\\''),member('\\''Amy Alpha'\\'','\\''signed'\\'','\\''2026-11-12'\\'','\\''R'\\''),member('\\''Later Zulu'\\'','\\''signed'\\'','\\''2026-11-13'\\'','\\''I'\\'')]
const before = JSON.stringify(input)
assert.deepEqual(sortMembers(input,'\\''recent'\\'').map(m=>m.name),['\\''Later Zulu'\\'','\\''Amy Alpha'\\'','\\''Zoe Beta'\\'','\\''Origin Sponsor'\\'','\\''Null Notyet'\\''])
assert.deepEqual(sortMembers(input,'\\''name'\\'').map(m=>m.name),['\\''Amy Alpha'\\'','\\''Zoe Beta'\\'','\\''Null Notyet'\\'','\\''Origin Sponsor'\\'','\\''Later Zulu'\\''])
assert.deepEqual(sortMembers(input,'\\''state'\\''),input)
assert.equal(JSON.stringify(input),before)
assert.deepEqual(partyOptions(input).map(p=>[p.key,p.count]),[['\\''D'\\'',1],['\\''R'\\'',1],['\\''I'\\'',1],['\\''none'\\'',2]])
assert.equal(partyKey({party:null}),'\\''none'\\'')
assert.deepEqual(sortMembers([], '\\''recent'\\''),[])
console.log('\\''Helper assertions passed: descending dates, date ties, null sponsor/not-yet dates, name order, source order, nonmutation, null parties, empty input.'\\'')
const raw=JSON.parse(readFileSync('\\''/Users/andriathomas/Projects/dc-bills-tracker/public/api/members-119.json'\\'','\\''utf8'\\''))
console.log('\\''Roster shape:'\\'',Object.keys(raw))
console.log('\\''Surname edge cases:'\\'', raw.members.filter(m=> /,| van | de | del | la | st\\.? |schultz|norton/i.test(m.name)).map(m=>[m.name,lastNameKey(m.name)]))
console.log('\\''Party values:'\\'', [...new Set(raw.members.map(m=>m.party))])
'" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
Helper assertions passed: descending dates, date ties, null sponsor/not-yet dates, name order, source order, nonmutation, null parties, empty input.
Roster shape: [ 'congress', 'generatedAt', 'source', 'counts', 'members' ]
Surname edge cases: [
  [ 'Gilbert Ray Cisneros, Jr.', 'cisneros gilbert ray' ],
  [ 'Eleanor Holmes Norton', 'norton eleanor holmes' ],
  [ 'Debbie Wasserman Schultz', 'schultz debbie wasserman' ],
  [ 'Sanford D. Bishop, Jr.', 'bishop sanford d.' ],
  [ 'Henry C. "Hank" Johnson, Jr.', 'johnson henry c. "hank"' ],
  [ 'Johnny Olszewski, Jr.', 'olszewski johnny' ],
  [ 'Chris Van Hollen', 'van hollen chris' ],
  [ 'Robert F. Onder, Jr.', 'onder robert f.' ],
  [ 'Jefferson Van Drew', 'van drew jefferson' ],
  [ 'Herbert C. Conaway, Jr.', 'conaway herbert c.' ],
  [ 'Frank Pallone, Jr.', 'pallone frank' ],
  [ 'Thomas H. Kean, Jr.', 'kean thomas h.' ],
  [ 'Robert P. Bresnahan, Jr.', 'bresnahan robert p.' ],
  [ 'Matt Van Epps', 'van epps matt' ],
  [ 'Randy K. Weber, Sr.', 'weber randy k.' ],
  [ 'Monica De La Cruz', 'de la cruz monica' ],
  [ 'Beth Van Duyne', 'van duyne beth' ],
  [ 'Donald S. Beyer, Jr.', 'beyer donald s.' ],
  [ 'Derrick Van Orden', 'van orden derrick' ]
]
Party values: [ 'R', 'D', 'I' ]

exec
/bin/zsh -lc "node --input-type=module -e '
import assert from '\\''node:assert/strict'\\''
import { build } from '\\''esbuild'\\''
import { createRequire } from '\\''node:module'\\''
import { JSDOM } from '\\''jsdom'\\''
import React, { act } from '\\''react'\\''
import { createRoot } from '\\''react-dom/client'\\''
const dom = new JSDOM('\\''<"'!doctype html><div id="root"></div>'"'\\'', {url:'\\''http://localhost/'\\''})
globalThis.window=dom.window
globalThis.document=dom.window.document
globalThis.HTMLElement=dom.window.HTMLElement
globalThis.IS_REACT_ACT_ENVIRONMENT=true
const compiled=await build({entryPoints:['\\''src/components/MemberLookup.jsx'\\''],bundle:true,write:false,platform:'\\''node'\\'',format:'\\''cjs'\\'',packages:'\\''external'\\'',jsx:'\\''automatic'\\'',logLevel:'\\''silent'\\''})
const module={exports:{}}
new Function('\\''require'\\'','\\''module'\\'','\\''exports'\\'',compiled.outputFiles[0].text)(createRequire(import.meta.url),module,module.exports)
const MemberLookup=module.exports.default
const now=new Date().toISOString()
const members=[
['\\''Z100001'\\'','\\''Abel Zulu'\\'','\\''D'\\'','\\''house'\\'','\\''CA'\\''],
['\\''Z100002'\\'','\\''Zoe Alpha'\\'',null,'\\''house'\\'','\\''CA'\\''],
['\\''Z100003'\\'','\\''Amy Alpha'\\'','\\''R'\\'','\\''house'\\'','\\''AK'\\''],
['\\''Z100004'\\'','\\''Origin Sponsor'\\'','\\''D'\\'','\\''house'\\'','\\''DC'\\''],
['\\''Z100005'\\'','\\''Never Beta'\\'','\\''D'\\'','\\''house'\\'','\\''NY'\\''],
['\\''Z200001'\\'','\\''Origin Senator'\\'','\\''D'\\'','\\''senate'\\'','\\''CA'\\''],
['\\''Z200002'\\'','\\''Ben Bravo'\\'','\\''I'\\'','\\''senate'\\'','\\''VT'\\''],
['\\''Z200003'\\'','\\''Notyet Adams'\\'','\\''R'\\'','\\''senate'\\'','\\''AK'\\'']
].map(([bioguideId,name,party,chamber,state])=>({bioguideId,name,party,chamber,state,district:null}))
const bill=(chamber,sponsorId,ids)=>({congress:119,current:true,complete:true,chamber,checkedAt:now,sponsor:members.find(m=>m.bioguideId===sponsorId),cosponsors:ids.map((id,i)=>({...members.find(m=>m.bioguideId===id),sponsorshipDate:i===0?'\\''2026-11-12'\\'':'\\''2026-11-13'\\''}))})
const bills={house:bill('\\''house'\\'','\\''Z100004'\\'',['\\''Z100001'\\'','\\''Z100002'\\'','\\''Z100003'\\'']),senate:bill('\\''senate'\\'','\\''Z200001'\\'',['\\''Z200002'\\''])}
const rosters={119:{data:{congress:119,generatedAt:now,members}}}
const root=createRoot(document.getElementById('\\''root'\\''))
await act(()=>root.render(React.createElement(MemberLookup,{bills,rosters})))
const select=(label)=>[...document.querySelectorAll('\\''label.lookup-field'\\'')].find(el=>el.querySelector('\\''span'\\'').textContent===label).querySelector('\\''select'\\'')
const change=async(el,value)=>{await act(()=>{el.value=value;el.dispatchEvent(new window.Event('\\''change'\\'',{bubbles:true}))})}
const radio=(value)=>document.querySelector('\\''input[type=radio][value=\"'\\''+value+'\\''\"]'\\'')
const click=async(el)=>{await act(()=>el.click())}
const rows=()=>[...document.querySelectorAll('\\''.member-row'\\'')].map(el=>el.textContent)
assert.equal(document.querySelector('\\''input:checked'\\'').value,'\\''not-yet'\\'')
assert.equal(rows().length,1)
await change(select('\\''Sort by'\\''),'\\''recent'\\'')
assert.equal(document.querySelector('\\''input:checked'\\'').value,'\\''signed'\\'')
assert.equal(rows().length,4)
assert.ok(rows()[0].includes('\\''Amy Alpha'\\''))
assert.ok(rows()[1].includes('\\''Zoe Alpha'\\''))
assert.ok(rows()[2].includes('\\''Abel Zulu'\\''))
assert.ok(rows()[3].includes('\\''Origin Sponsor'\\''))
await click(radio('\\''not-yet'\\''))
assert.equal(select('\\''Sort by'\\'').value,'\\''name'\\'')
await click(radio('\\''all'\\''))
await change(select('\\''Party'\\''),'\\''none'\\'')
assert.equal(rows().length,1)
assert.ok(rows()[0].includes('\\''Zoe Alpha'\\''))
await change(select('\\''State'\\''),'\\''CA'\\'')
const tabs=[...document.querySelectorAll('\\''[role=tab]'\\'')]
await click(tabs[1])
assert.equal(select('\\''State'\\'').value,'\\'''\\'')
assert.equal(select('\\''Party'\\'').value,'\\'''\\'')
assert.equal(rows().length,3)
assert.equal(document.activeElement,tabs[1])
await change(select('\\''Party'\\''),'\\''I'\\'')
assert.equal(rows().length,1)
await click(tabs[0])
assert.equal(select('\\''Party'\\'').value,'\\'''\\'')
assert.equal(rows().length,5)
await click(tabs[1])
assert.equal(select('\\''Party'\\'').value,'\\''I'\\'')
assert.equal(rows().length,1)
await act(()=>tabs[1].dispatchEvent(new window.KeyboardEvent('\\''keydown'\\'',{key:'\\''ArrowLeft'\\'',bubbles:true})))
assert.equal(tabs[0].getAttribute('\\''aria-selected'\\''),'\\''true'\\'')
assert.equal(document.activeElement,tabs[0])
assert.equal(document.querySelector('\\''[role=status]'\\'').textContent.trim(),'\\''Showing 5 of 5 House members.'\\'')
await act(()=>root.render(React.createElement(MemberLookup,{bills:{...bills,house:null},rosters})))
assert.equal(document.querySelectorAll('\\''.lookup-controls'\\'').length,0)
await act(()=>root.render(React.createElement(MemberLookup,{bills,rosters})))
assert.equal(document.querySelectorAll('\\''.lookup-controls'\\'').length,1)
await act(()=>root.unmount())
console.log('\\''React DOM checks passed: recent/name/filter transitions, date ties, null-party filtering, state reset on tab change, missing-party fallback, party persistence, tab keyboard focus, live count, unavailable-to-ready render transitions.'\\'')
'" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 457ms:
React DOM checks passed: recent/name/filter transitions, date ties, null-party filtering, state reset on tab change, missing-party fallback, party persistence, tab keyboard focus, live count, unavailable-to-ready render transitions.

codex
The helper and React DOM checks passed for date ties, null-party rows, filter transitions, tab focus, and unavailable-data transitions. I found one documented limitation: “Debbie Wasserman Schultz” sorts under S rather than W. I’ll report that as a NOTE; I found no BLOCKER or MATERIAL issues.
exec
/bin/zsh -lc 'git status --short; git rev-parse --short HEAD' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-S1OGlNQp' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-peIOn69w' (errno=Operation not permitted)
?? reviews/2026-11-13-cosponsor-sort-filter-codex-high.raw.md
?? reviews/2026-11-13-cosponsor-sort-filter-codex-medium.raw.md
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-JKERiwCC' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-iiTVoiu5' (errno=Operation not permitted)
7d35662

codex
No BLOCKER or MATERIAL findings in `7d35662`.

- **NOTE — [src/data/memberSort.js:17](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter/src/data/memberSort.js:17):** Compound surnames without a recognized particle sort by their final word. For example, “Debbie Wasserman Schultz” appears under **S**, rather than **W**, in “Last name (A–Z).” This is documented but makes some members harder to locate.

Focused ESLint, helper assertions, and React DOM checks passed, including date ties, null-party filtering, tab transitions, and focus handling. Accessibility was checked through code and DOM inspection; no browser or screen-reader walkthrough was performed. No files changed.
tokens used
52,752
No BLOCKER or MATERIAL findings in `7d35662`.

- **NOTE — [src/data/memberSort.js:17](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter/src/data/memberSort.js:17):** Compound surnames without a recognized particle sort by their final word. For example, “Debbie Wasserman Schultz” appears under **S**, rather than **W**, in “Last name (A–Z).” This is documented but makes some members harder to locate.

Focused ESLint, helper assertions, and React DOM checks passed, including date ties, null-party filtering, tab transitions, and focus handling. Accessibility was checked through code and DOM inspection; no browser or screen-reader walkthrough was performed. No files changed.
