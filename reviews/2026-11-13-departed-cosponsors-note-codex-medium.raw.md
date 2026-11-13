Reading additional input from stdin...
OpenAI Codex v0.159.2
--------
workdir: /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
model: gpt-6.1-sol
provider: openai
approval: never
sandbox: read-only
reasoning effort: medium
reasoning summaries: none
session id: 01a1d614-ce36-7280-8fca-99f14b66e3a0
--------
user
Review the last commit in this repository (git show HEAD): it adds departedCosponsors() to src/data/statehoodBill.js and a DepartedNote under the member list in src/components/MemberLookup.jsx (style in src/StatehoodBill.css). The note explains why the recorded cosponsor total exceeds the rows marked signed on: cosponsors absent from the current roster have left the chamber; it names them. Look for correctness bugs (could someone be wrongly named as having left; does the sentence stay true in every data state the validators allow, including stale rosters, a Congress switch, non-current bills; singular/plural), hook misuse, and conflicts with CLAUDE.md content standards. Read-only: do not edit files. Report findings as BLOCKER / MATERIAL / NOTE with file:line and a concrete failure scenario; say "no findings" if none.
codex
I’ll read the repository guidance and last commit, then check the note’s claims against the data states the validators allow.
exec
/bin/zsh -lc 'pwd; git status --short; git show --stat HEAD; cat /Users/andriathomas/Projects/andria-agent-system/shared/WORKING_GUIDE.md; cat /Users/andriathomas/Projects/andria-agent-system/shared/REVIEW_POLICY.md' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
/Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-0ysZFn2U' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-1IzvTrOB' (errno=Operation not permitted)
?? reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md
?? reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-OMXMhzoA' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-qn4kVIkY' (errno=Operation not permitted)
commit 9ef9ec1203c6fc284ef8fd8bd0fa0e083b961edc
Author: antzzz10 <andria.thomas@gmail.com>
Date:   Fri Nov 13 13:04:09 2026 -0500

    statehood-bill: note under the member list naming cosponsors who have left the chamber
    
    The recorded total (209 for H.R. 51) is larger than the rows marked signed on, because
    members who cosponsored and have since left are not on the current roster. A note under
    the list now gives the total, how many have left and their names, derived from the data.
    
    Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>

 src/StatehoodBill.css           |  7 +++++++
 src/components/MemberLookup.jsx | 22 ++++++++++++++++++++--
 src/data/statehoodBill.js       | 14 ++++++++++++++
 3 files changed, 41 insertions(+), 2 deletions(-)
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
/bin/zsh -lc 'for p in /Users/andriathomas/AGENTS.md /Users/andriathomas/Projects/AGENTS.md /Users/andriathomas/Projects/representdc-main/AGENTS.md /Users/andriathomas/Projects/representdc-main/.claude/AGENTS.md /Users/andriathomas/Projects/representdc-main/.claude/worktrees/AGENTS.md; do if [ -f "$p" ]; then echo "$p"; cat "$p"; fi; done; rg --files -g AGENTS.md -g CLAUDE.md -g '"'*statehood*' -g '*validat*' -g '*MemberLookup*' -g 'package.json'" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
src/data/statehoodBill.js
src/data/statehoodPartners.js
src/fixtures/statehoodBill.js
src/components/MemberLookup.jsx
reviews/2026-11-10-statehood-bill-page-codex-high.raw.md
reviews/2026-11-10-statehood-bill-what-it-is-codex-high-recheck.raw.md
reviews/2026-11-10-statehood-bill-page-codex-recheck3.raw.md
reviews/2026-11-10-statehood-bill-page-codex-recheck.raw.md
reviews/2026-11-10-statehood-bill-page-codex-medium.raw.md
reviews/2026-11-10-statehood-bill-what-it-is-codex-high.raw.md
reviews/2026-11-10-statehood-bill-page-codex-high-attack.raw.md
reviews/2026-11-10-statehood-bill-page-codex-recheck2.raw.md
CLAUDE.md
package.json
decisions/2026-07-12-persona-picker-and-statehood-curious.md
decisions/2026-07-27-statehood-partner-map-page.md

exec
/bin/zsh -lc "git show HEAD; cat CLAUDE.md; cat src/data/statehoodBill.js; cat src/components/MemberLookup.jsx; cat package.json; rg -n 'validate|congress|roster|cosponsor|current' scripts src/data src/fixtures .github" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-LQ3sCX0q' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-3gXfll4d' (errno=Operation not permitted)
commit 9ef9ec1203c6fc284ef8fd8bd0fa0e083b961edc
Author: antzzz10 <andria.thomas@gmail.com>
Date:   Fri Nov 13 13:04:09 2026 -0500

    statehood-bill: note under the member list naming cosponsors who have left the chamber
    
    The recorded total (209 for H.R. 51) is larger than the rows marked signed on, because
    members who cosponsored and have since left are not on the current roster. A note under
    the list now gives the total, how many have left and their names, derived from the data.
    
    Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>

diff --git a/src/StatehoodBill.css b/src/StatehoodBill.css
index 13b3512..73a8415 100644
--- a/src/StatehoodBill.css
+++ b/src/StatehoodBill.css
@@ -361,6 +361,13 @@
   margin: 0 0 var(--s-2);
 }
 
+.lookup-footnote {
+  font-size: var(--fs-sm);
+  line-height: var(--lh-body);
+  color: var(--slate-700);
+  margin: var(--s-3) 0 0;
+}
+
 .lookup-empty {
   font-weight: 700;
   color: var(--navy);
diff --git a/src/components/MemberLookup.jsx b/src/components/MemberLookup.jsx
index 4087fde..7a92e17 100644
--- a/src/components/MemberLookup.jsx
+++ b/src/components/MemberLookup.jsx
@@ -1,12 +1,28 @@
 import { useId, useMemo, useRef, useState } from 'react'
 import { MemberRow } from './MemberRow'
-import { memberStatuses, ordinal } from '../data/statehoodBill'
-import { SORTS, partyKey, partyOptions, sortMembers } from '../data/memberSort'
+import { departedCosponsors, memberStatuses, ordinal } from '../data/statehoodBill'
+import { SORTS, lastNameKey, partyKey, partyOptions, sortMembers } from '../data/memberSort'
 
 const CHAMBERS = [
   { key: 'house', label: 'House', plural: 'House members' },
   { key: 'senate', label: 'Senate', plural: 'senators' },
 ]
+// Why the recorded total is larger than the number of rows marked "Signed on".
+function DepartedNote({ bill, departed, chamberLabel }) {
+  if (departed.length === 0) return null
+  const n = departed.length
+  const names = [...departed]
+    .sort((a, b) => lastNameKey(a.name).localeCompare(lastNameKey(b.name)))
+    .map((c) => `${c.name} (${c.state})`)
+    .join(', ')
+  return (
+    <p className="lookup-footnote">
+      Congress.gov records {bill.totals.cosponsors} cosponsors of {bill.billNumber}. {n} of them{' '}
+      {n === 1 ? 'has' : 'have'} since left the {chamberLabel} and {n === 1 ? 'is' : 'are'} not listed here: {names}.
+    </p>
+  )
+}
+
 const FILTERS = [
   { key: 'not-yet', label: 'Not yet signed on' },
   { key: 'signed', label: 'Signed on' },
@@ -37,6 +53,7 @@ function MemberLookup({ bills, rosters }) {
     [bill, roster],
   )
   const usable = Boolean(statuses)
+  const departed = useMemo(() => (usable ? departedCosponsors(roster, bill) : []), [usable, roster, bill])
   const all = useMemo(() => statuses ?? [], [statuses])
   const states = useMemo(() => [...new Set(all.map((m) => m.state))].sort(), [all])
   const parties = useMemo(() => partyOptions(all), [all])
@@ -148,6 +165,7 @@ function MemberLookup({ bills, rosters }) {
                 {shown.map((m) => <MemberRow key={m.bioguideId} member={m} />)}
               </ul>
             )}
+            <DepartedNote bill={bill} departed={departed} chamberLabel={active.label} />
           </>
         )}
       </div>
diff --git a/src/data/statehoodBill.js b/src/data/statehoodBill.js
index db990a4..7a494da 100644
--- a/src/data/statehoodBill.js
+++ b/src/data/statehoodBill.js
@@ -359,6 +359,20 @@ export function memberStatuses(roster, bill, now = new Date()) {
     .sort((a, b) => a.state.localeCompare(b.state) || (a.district ?? 0) - (b.district ?? 0) || a.name.localeCompare(b.name))
 }
 
+/**
+ * Cosponsors on the bill's record who are absent from the chamber's current roster, i.e.
+ * members who signed on and have since left. They count in the recorded total but cannot
+ * appear in the member list, which is built from the roster. A cosponsor who signed on
+ * after the roster was generated is left out: that is a new member the weekly roster has
+ * not caught up with, not a departure.
+ */
+export function departedCosponsors(roster, bill) {
+  if (!roster || !bill || roster.congress !== bill.congress || !bill.complete) return []
+  const seated = new Set(roster.members.filter((m) => m.chamber === bill.chamber).map((m) => m.bioguideId))
+  const rosterDate = etDate(roster.generatedAt)
+  return bill.cosponsors.filter((c) => !seated.has(c.bioguideId) && c.sponsorshipDate <= rosterDate)
+}
+
 /**
  * History rows. A row the tracker marks provisional (`final: false`) takes its count from
  * the live cosponsor file when that file holds the same bill as the current, complete one,
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
  if (!isObj(raw) || !isStr(raw.billNumber) || !isCount(raw.cosponsors)) return undefined
  const billNumber = squash(raw.billNumber)
  if (chamberFromNumber(billNumber) !== chamber || raw.cosponsors > CHAMBER_MAX[chamber]) return undefined
  return { billNumber, cosponsors: raw.cosponsors, url: officialUrl(raw.url, isGovInfo) }
}

/** Returns an array of rows ordered by Congress, or null. */
export function parseHistory(json) {
  const rows = Array.isArray(json?.congresses) ? json.congresses : null
  if (!rows || rows.length === 0) return null
  const out = []
  const seen = new Set()
  for (const raw of rows) {
    if (!isObj(raw) || !Number.isInteger(raw.congress) || !Number.isInteger(raw.startYear) || seen.has(raw.congress)) return null
    seen.add(raw.congress)
    const house = historyBill(raw.house, 'house')
    const senate = historyBill(raw.senate, 'senate')
    if (house === undefined || senate === undefined || (!house && !senate)) return null
    const fa = raw.furthestAction
    let furthestAction = null
    if (fa !== null && fa !== undefined) {
      if (!isObj(fa) || !isStr(fa.text) || (fa.date != null && !isDateOnly(fa.date))) return null
      furthestAction = { text: squash(fa.text), date: fa.date ?? null }
    }
    out.push({
      congress: raw.congress,
      startYear: raw.startYear,
      endYear: Number.isInteger(raw.endYear) ? raw.endYear : null,
      // Only an explicit `final: false` marks a snapshot the live file may update.
      final: raw.final !== false,
      house,
      senate,
      furthestAction,
    })
  }
  return out.sort((a, b) => a.congress - b.congress)
}

// ---- Derivations -------------------------------------------------------------------

export function ordinal(n) {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  return `${n}${{ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th'}`
}

/** Courtesy title from chamber and seat (validated: seat and voting status agree). */
export function memberTitle(chamber, state) {
  if (chamber === 'senate') return 'Sen.'
  if (!NON_VOTING.has(state)) return 'Rep.'
  return state === 'PR' ? 'Res. Comm.' : 'Del.'
}

export function seatLabel(chamber, state, dist) {
  return chamber === 'house' && dist ? `${state}-${dist}` : state
}

/** "January 3, 2025" from a validated YYYY-MM-DD, pinned to UTC so it never shifts a day. */
export function formatDate(dateOnly, month = 'long') {
  return new Date(`${dateOnly}T00:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC', month, day: 'numeric', year: 'numeric',
  })
}

/**
 * Cosponsors who signed on in the current Eastern calendar month (`now`), across the bills
 * currently linked, plus the latest sponsorship date overall for the empty state. Null
 * (section hidden) when any of those bills lacks a complete list checked in the last two
 * days.
 */
export function signedThisMonth(bills, now = new Date()) {
  // Only bills currently linked count, and every one of them must have a complete list
  // checked recently, or "No new cosponsors since <date>" overreaches.
  const shown = bills.filter((b) => b && b.current)
  if (shown.length === 0) return null
  if (shown.some((b) => !b.complete || now - Date.parse(b.checkedAt) > CHECK_MAX_AGE_MS)) return null
  const month = etDate(now).slice(0, 7)
  const rows = []
  let latestDate = null
  for (const b of shown) {
    for (const c of b.cosponsors) {
      if (!latestDate || c.sponsorshipDate > latestDate) latestDate = c.sponsorshipDate
      if (c.sponsorshipDate.slice(0, 7) === month) rows.push({ ...c, chamber: b.chamber, billNumber: b.billNumber })
    }
  }
  rows.sort((a, b) => b.sponsorshipDate.localeCompare(a.sponsorshipDate) || a.name.localeCompare(b.name))
  return { rows, latestDate }
}

/**
 * Every current member of the chamber with their status on this bill, joined by Bioguide
 * ID: the sponsor, a cosponsor (with date), or not yet. Members who cosponsored and have
 * since left are absent from the roster, so they count in the recorded total but not
 * here. Returns null if the two files disagree about who someone is (same ID, different
 * state or surname), since a wrong "Not yet" is worse than no list.
 */
export function memberStatuses(roster, bill, now = new Date()) {
  if (!roster || roster.congress !== bill.congress || !bill.complete) return null
  if (now - Date.parse(roster.generatedAt) > ROSTER_MAX_AGE_MS) return null
  if (now - Date.parse(bill.checkedAt) > CHECK_MAX_AGE_MS) return null
  const members = roster.members.filter((m) => m.chamber === bill.chamber)
  const byId = new Map(members.map((m) => [m.bioguideId, m]))
  // Same ID must mean the same person: same state and same surname. District is NOT
  // compared: the cosponsor record keeps the district at sponsorship, and redistricting
  // moves members (real case, 2026-11-10: McBath, GA-7 on H.R. 51, GA-6 today). Rows here
  // come from the roster, so they show the member's current district.
  for (const p of [bill.sponsor, ...bill.cosponsors]) {
    const m = byId.get(p.bioguideId)
    if (!m) continue
    if (m.state !== p.state || surname(m.name) !== surname(p.name)) return null
  }
  const signed = new Map(bill.cosponsors.map((c) => [c.bioguideId, c.sponsorshipDate]))
  return members
    .map((m) => {
      if (m.bioguideId === bill.sponsor.bioguideId) return { ...m, status: 'sponsor', date: null }
      if (signed.has(m.bioguideId)) return { ...m, status: 'signed', date: signed.get(m.bioguideId) }
      return { ...m, status: 'not-yet', date: null }
    })
    .sort((a, b) => a.state.localeCompare(b.state) || (a.district ?? 0) - (b.district ?? 0) || a.name.localeCompare(b.name))
}

/**
 * Cosponsors on the bill's record who are absent from the chamber's current roster, i.e.
 * members who signed on and have since left. They count in the recorded total but cannot
 * appear in the member list, which is built from the roster. A cosponsor who signed on
 * after the roster was generated is left out: that is a new member the weekly roster has
 * not caught up with, not a departure.
 */
export function departedCosponsors(roster, bill) {
  if (!roster || !bill || roster.congress !== bill.congress || !bill.complete) return []
  const seated = new Set(roster.members.filter((m) => m.chamber === bill.chamber).map((m) => m.bioguideId))
  const rosterDate = etDate(roster.generatedAt)
  return bill.cosponsors.filter((c) => !seated.has(c.bioguideId) && c.sponsorshipDate <= rosterDate)
}

/**
 * History rows. A row the tracker marks provisional (`final: false`) takes its count from
 * the live cosponsor file when that file holds the same bill as the current, complete one,
 * so the table and the headline never disagree. Final rows are never overwritten.
 */
export function historyWithLive(history, house, senate) {
  return history.map((row) => {
    if (row.final) return row
    const live = (b, side) => (b && b.current && b.complete && side && b.congress === row.congress && b.billNumber === side.billNumber
      ? { ...side, cosponsors: b.totals.cosponsors }
      : side)
    return { ...row, house: live(house, row.house), senate: live(senate, row.senate) }
  })
}
import { useId, useMemo, useRef, useState } from 'react'
import { MemberRow } from './MemberRow'
import { departedCosponsors, memberStatuses, ordinal } from '../data/statehoodBill'
import { SORTS, lastNameKey, partyKey, partyOptions, sortMembers } from '../data/memberSort'

const CHAMBERS = [
  { key: 'house', label: 'House', plural: 'House members' },
  { key: 'senate', label: 'Senate', plural: 'senators' },
]
// Why the recorded total is larger than the number of rows marked "Signed on".
function DepartedNote({ bill, departed, chamberLabel }) {
  if (departed.length === 0) return null
  const n = departed.length
  const names = [...departed]
    .sort((a, b) => lastNameKey(a.name).localeCompare(lastNameKey(b.name)))
    .map((c) => `${c.name} (${c.state})`)
    .join(', ')
  return (
    <p className="lookup-footnote">
      Congress.gov records {bill.totals.cosponsors} cosponsors of {bill.billNumber}. {n} of them{' '}
      {n === 1 ? 'has' : 'have'} since left the {chamberLabel} and {n === 1 ? 'is' : 'are'} not listed here: {names}.
    </p>
  )
}

const FILTERS = [
  { key: 'not-yet', label: 'Not yet signed on' },
  { key: 'signed', label: 'Signed on' },
  { key: 'all', label: 'All' },
]

// The organizer view: every current member, their status on this chamber's bill.
// Tabs follow the WAI-ARIA tabs pattern (arrow keys move between them); filters are a
// native radio group, so they work by keyboard with no extra code. Party and sort are
// native selects for the same reason.
function MemberLookup({ bills, rosters }) {
  const [chamber, setChamber] = useState('house')
  const [filter, setFilter] = useState('not-yet')
  const [stateCode, setStateCode] = useState('')
  const [partyChoice, setPartyChoice] = useState('')
  const [sort, setSort] = useState('name')
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
  const departed = useMemo(() => (usable ? departedCosponsors(roster, bill) : []), [usable, roster, bill])
  const all = useMemo(() => statuses ?? [], [statuses])
  const states = useMemo(() => [...new Set(all.map((m) => m.state))].sort(), [all])
  const parties = useMemo(() => partyOptions(all), [all])
  // A party picked in one chamber may not exist in the other; then it filters nothing.
  const party = parties.some((p) => p.key === partyChoice) ? partyChoice : ''
  const sorted = useMemo(() => sortMembers(all, sort), [all, sort])
  const needle = query.trim().toLowerCase()
  const shown = sorted.filter((m) =>
    (filter === 'all' || m.status === filter || (filter === 'signed' && m.status === 'sponsor')) &&
    (!stateCode || m.state === stateCode) &&
    (!party || partyKey(m) === party) &&
    (!needle || m.name.toLowerCase().includes(needle)))

  // Sign-on order says nothing about members who have not signed on, so the two choices
  // move together: picking it shows who has signed, and leaving for "not yet" drops it.
  const chooseSort = (key) => {
    setSort(key)
    if (key === 'recent' && filter === 'not-yet') setFilter('signed')
  }
  const chooseFilter = (key) => {
    setFilter(key)
    if (key === 'not-yet' && sort === 'recent') setSort('name')
  }

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
                    <input type="radio" name={`${id}-filter`} value={f.key} checked={filter === f.key} onChange={() => chooseFilter(f.key)} />
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
                <span>Party</span>
                <select value={party} onChange={(e) => setPartyChoice(e.target.value)}>
                  <option value="">All parties</option>
                  {parties.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                </select>
              </label>
              <label className="lookup-field">
                <span>Sort by</span>
                <select value={sort} onChange={(e) => chooseSort(e.target.value)}>
                  {SORTS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
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
            <DepartedNote bill={bill} departed={departed} chamberLabel={active.label} />
          </>
        )}
      </div>
    </div>
  )
}

export default MemberLookup
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
src/fixtures/statehoodBill.js:5:// 2026-11-08; tracker check 2026-11-09): H.R. 51, 209 cosponsors incl. 2 non-voting, 159
src/fixtures/statehoodBill.js:6:// original, introduced 2025-01-03; S. 51, 43 cosponsors, 40 original, introduced
src/fixtures/statehoodBill.js:9:// Every MEMBER row (cosponsors and roster) is deliberately fake: names are "Fixture
src/fixtures/statehoodBill.js:22:function roster() {
src/fixtures/statehoodBill.js:57:function cosponsorsFrom(members, { count, original, introduced, latest, nonVoting = [] }) {
src/fixtures/statehoodBill.js:74:  const members = roster()
src/fixtures/statehoodBill.js:81:        chamber: 'house', congress: 119, billNumber: 'H.R. 51', current: true,
src/fixtures/statehoodBill.js:85:        congressGovUrl: 'https://www.congress.gov/bill/119th-congress/house-bill/51',
src/fixtures/statehoodBill.js:87:        cosponsors: cosponsorsFrom(house, { count: 209, original: 159, introduced: '2025-01-03', latest: '2026-10-09', nonVoting: ['PR', 'VI'] }),
src/fixtures/statehoodBill.js:88:        totals: { cosponsors: 209, original: 159, nonVoting: 2 },
src/fixtures/statehoodBill.js:91:        chamber: 'senate', congress: 119, billNumber: 'S. 51', current: scenario !== 'transition',
src/fixtures/statehoodBill.js:95:        congressGovUrl: 'https://www.congress.gov/bill/119th-congress/senate-bill/51',
src/fixtures/statehoodBill.js:97:        cosponsors: cosponsorsFrom(senate, { count: 43, original: 40, introduced: '2025-01-09', latest: '2025-04-29' }),
src/fixtures/statehoodBill.js:98:        totals: { cosponsors: 43, original: 40, nonVoting: 0 },
src/fixtures/statehoodBill.js:108:  congresses: [
src/fixtures/statehoodBill.js:109:    { congress: 115, startYear: 2017, endYear: 2019, house: { billNumber: 'H.R. 1291', cosponsors: 181, url: govinfo(115, 'hr', 1291) }, senate: { billNumber: 'S. 1278', cosponsors: 30, url: govinfo(115, 's', 1278) }, furthestAction: null },
src/fixtures/statehoodBill.js:110:    { congress: 116, startYear: 2019, endYear: 2021, house: { billNumber: 'H.R. 51', cosponsors: 227, url: govinfo(116, 'hr', 51) }, senate: { billNumber: 'S. 631', cosponsors: 42, url: govinfo(116, 's', 631) }, furthestAction: { text: 'Passed House', date: '2020-06-26' } },
src/fixtures/statehoodBill.js:111:    { congress: 117, startYear: 2021, endYear: 2023, house: { billNumber: 'H.R. 51', cosponsors: 216, url: govinfo(117, 'hr', 51) }, senate: { billNumber: 'S. 51', cosponsors: 45, url: govinfo(117, 's', 51) }, furthestAction: { text: 'Passed House', date: '2021-04-22' } },
src/fixtures/statehoodBill.js:112:    { congress: 118, startYear: 2023, endYear: 2025, house: { billNumber: 'H.R. 51', cosponsors: 211, url: govinfo(118, 'hr', 51) }, senate: { billNumber: 'S. 51', cosponsors: 46, url: govinfo(118, 's', 51) }, furthestAction: null },
src/fixtures/statehoodBill.js:113:    { congress: 119, startYear: 2025, endYear: null, final: false, house: { billNumber: 'H.R. 51', cosponsors: 209 }, senate: { billNumber: 'S. 51', cosponsors: 43 }, furthestAction: null },
src/fixtures/statehoodBill.js:118:  if (key === 'statehood-cosponsors') return bills(scenario)
src/fixtures/statehoodBill.js:120:    const members = roster()
src/fixtures/statehoodBill.js:126:    return { congress: 119, generatedAt: CHECKED_AT, counts, members }
src/data/statehoodBill.js:20:// Freshness limits. The cosponsor check runs daily and the roster weekly; past these, a
src/data/statehoodBill.js:88:const isCongressGov = (h) => h === 'www.congress.gov' || h === 'congress.gov'
src/data/statehoodBill.js:123:  const congressGovUrl = officialUrl(raw.congressGovUrl, (h, path) =>
src/data/statehoodBill.js:124:    isCongressGov(h) && path.replace(/\/+$/, '') === `/bill/${ordinal(raw.congress)}-congress/${CHAMBER_PATH[chamber]}/${billNumber.match(/\d+$/)[0]}`)
src/data/statehoodBill.js:128:  const totals = raw.complete === false && raw.totals == null ? { cosponsors: 0, original: 0, nonVoting: 0 } : raw.totals
src/data/statehoodBill.js:131:    !Number.isInteger(raw.congress) || raw.congress < 100 ||
src/data/statehoodBill.js:132:    typeof raw.current !== 'boolean' ||
src/data/statehoodBill.js:136:    !congressGovUrl ||
src/data/statehoodBill.js:141:    !Array.isArray(raw.cosponsors) ||
src/data/statehoodBill.js:142:    !isObj(totals) || !isCount(totals.cosponsors) || !isCount(totals.original) || !isCount(totals.nonVoting)
src/data/statehoodBill.js:149:  const cosponsors = []
src/data/statehoodBill.js:150:  for (const c of raw.cosponsors) {
src/data/statehoodBill.js:153:    if (p.bioguideId === sponsor.bioguideId) return null // the sponsor is never a cosponsor
src/data/statehoodBill.js:155:    cosponsors.push({ ...p, sponsorshipDate: c.sponsorshipDate, isOriginalCosponsor: c.isOriginalCosponsor })
src/data/statehoodBill.js:157:  if (!complete && (cosponsors.length > 0 || totals.cosponsors > 0)) return null
src/data/statehoodBill.js:160:  const nonVoting = chamber === 'house' ? cosponsors.filter((c) => NON_VOTING.has(c.state)).length : 0
src/data/statehoodBill.js:162:    cosponsors.length !== totals.cosponsors ||
src/data/statehoodBill.js:163:    cosponsors.length > CHAMBER_MAX[chamber] ||
src/data/statehoodBill.js:164:    new Set(cosponsors.map((c) => c.bioguideId)).size !== cosponsors.length ||
src/data/statehoodBill.js:165:    cosponsors.filter((c) => c.isOriginalCosponsor).length !== totals.original ||
src/data/statehoodBill.js:172:    congress: raw.congress,
src/data/statehoodBill.js:174:    current: raw.current,
src/data/statehoodBill.js:178:    congressGovUrl,
src/data/statehoodBill.js:180:    cosponsors,
src/data/statehoodBill.js:181:    totals: { cosponsors: totals.cosponsors, original: totals.original, nonVoting },
src/data/statehoodBill.js:200: * Returns { congress, members } or null. `expectedCongress` is the Congress named in the
src/data/statehoodBill.js:204:  // At a Congress switch the tracker may publish a placeholder ({ congress, pending: true,
src/data/statehoodBill.js:207:  if (!isObj(json) || json.congress !== expectedCongress || !Array.isArray(json.members) || !isInstant(json.generatedAt)) return null
src/data/statehoodBill.js:236:  return { congress: expectedCongress, generatedAt: json.generatedAt, members }
src/data/statehoodBill.js:241:  if (!isObj(raw) || !isStr(raw.billNumber) || !isCount(raw.cosponsors)) return undefined
src/data/statehoodBill.js:243:  if (chamberFromNumber(billNumber) !== chamber || raw.cosponsors > CHAMBER_MAX[chamber]) return undefined
src/data/statehoodBill.js:244:  return { billNumber, cosponsors: raw.cosponsors, url: officialUrl(raw.url, isGovInfo) }
src/data/statehoodBill.js:249:  const rows = Array.isArray(json?.congresses) ? json.congresses : null
src/data/statehoodBill.js:254:    if (!isObj(raw) || !Number.isInteger(raw.congress) || !Number.isInteger(raw.startYear) || seen.has(raw.congress)) return null
src/data/statehoodBill.js:255:    seen.add(raw.congress)
src/data/statehoodBill.js:266:      congress: raw.congress,
src/data/statehoodBill.js:276:  return out.sort((a, b) => a.congress - b.congress)
src/data/statehoodBill.js:287:/** Courtesy title from chamber and seat (validated: seat and voting status agree). */
src/data/statehoodBill.js:298:/** "January 3, 2025" from a validated YYYY-MM-DD, pinned to UTC so it never shifts a day. */
src/data/statehoodBill.js:306: * Cosponsors who signed on in the current Eastern calendar month (`now`), across the bills
src/data/statehoodBill.js:307: * currently linked, plus the latest sponsorship date overall for the empty state. Null
src/data/statehoodBill.js:312:  // Only bills currently linked count, and every one of them must have a complete list
src/data/statehoodBill.js:313:  // checked recently, or "No new cosponsors since <date>" overreaches.
src/data/statehoodBill.js:314:  const shown = bills.filter((b) => b && b.current)
src/data/statehoodBill.js:321:    for (const c of b.cosponsors) {
src/data/statehoodBill.js:331: * Every current member of the chamber with their status on this bill, joined by Bioguide
src/data/statehoodBill.js:332: * ID: the sponsor, a cosponsor (with date), or not yet. Members who cosponsored and have
src/data/statehoodBill.js:333: * since left are absent from the roster, so they count in the recorded total but not
src/data/statehoodBill.js:337:export function memberStatuses(roster, bill, now = new Date()) {
src/data/statehoodBill.js:338:  if (!roster || roster.congress !== bill.congress || !bill.complete) return null
src/data/statehoodBill.js:339:  if (now - Date.parse(roster.generatedAt) > ROSTER_MAX_AGE_MS) return null
src/data/statehoodBill.js:341:  const members = roster.members.filter((m) => m.chamber === bill.chamber)
src/data/statehoodBill.js:344:  // compared: the cosponsor record keeps the district at sponsorship, and redistricting
src/data/statehoodBill.js:346:  // come from the roster, so they show the member's current district.
src/data/statehoodBill.js:347:  for (const p of [bill.sponsor, ...bill.cosponsors]) {
src/data/statehoodBill.js:352:  const signed = new Map(bill.cosponsors.map((c) => [c.bioguideId, c.sponsorshipDate]))
src/data/statehoodBill.js:363: * Cosponsors on the bill's record who are absent from the chamber's current roster, i.e.
src/data/statehoodBill.js:365: * appear in the member list, which is built from the roster. A cosponsor who signed on
src/data/statehoodBill.js:366: * after the roster was generated is left out: that is a new member the weekly roster has
src/data/statehoodBill.js:369:export function departedCosponsors(roster, bill) {
src/data/statehoodBill.js:370:  if (!roster || !bill || roster.congress !== bill.congress || !bill.complete) return []
src/data/statehoodBill.js:371:  const seated = new Set(roster.members.filter((m) => m.chamber === bill.chamber).map((m) => m.bioguideId))
src/data/statehoodBill.js:372:  const rosterDate = etDate(roster.generatedAt)
src/data/statehoodBill.js:373:  return bill.cosponsors.filter((c) => !seated.has(c.bioguideId) && c.sponsorshipDate <= rosterDate)
src/data/statehoodBill.js:378: * the live cosponsor file when that file holds the same bill as the current, complete one,
src/data/statehoodBill.js:384:    const live = (b, side) => (b && b.current && b.complete && side && b.congress === row.congress && b.billNumber === side.billNumber
src/data/statehoodBill.js:385:      ? { ...side, cosponsors: b.totals.cosponsors }
src/data/myths.jsx:48:        <Cite href={SRC.shadowDelegation}>elected a shadow congressional delegation</Cite> since
src/data/myths.jsx:119:        <Link to="/how-congress-controls-dc">
src/data/myths.jsx:168:        <Cite href={SRC.wards}>eight wards</Cite>—and congressional control extends over all of
src/data/myths.jsx:267:    label: 'Home Rule Act § 1–204.46 (budget) and § 1–206.02 (congressional review of D.C. laws)',
src/data/statehoodPartners.js:46:      desc: "Two shadow Senators and one shadow Representative, elected by D.C. voters since 1990 to lobby Congress for statehood and defend home rule. Unpaid, non-voting positions with no formal congressional standing. Its shadow Senators also sit on the New Columbia Statehood Commission below.",
src/data/statehoodPartners.js:58:      desc: 'Founded in 1998, a citizen engagement and advocacy organization focused on full democracy for D.C. — budget and legislative autonomy free of congressional interference, and equal representation in the House and Senate. A member of the National Coalition for Statehood.',
src/data/statehoodPartners.js:120:      desc: "The District's chief executive, and a member of the New Columbia Statehood Commission above. The Mayor's official site features a running count of D.C. residents without a congressional vote, linking directly to the District's statehood campaign.",
src/data/statehoodPartners.js:132:      desc: "D.C.'s one official, elected voice in Congress — distinct from the unofficial Shadow Delegation above. Can introduce legislation and vote in committee, though not on the House floor. Has introduced the Washington, D.C. Admission Act (H.R. 51) in every recent Congress, currently with well over 100 House cosponsors.",
src/data/statehoodPartners.js:138:      desc: "The District's chief legal officer, an elected office since 2014. Has sued the federal government multiple times to defend D.C.'s Home Rule Act autonomy against federal overreach, and a prior Attorney General filed a court brief arguing D.C. residents are directly harmed by the lack of congressional representation.",
src/data/statehoodPartners.js:150:      desc: 'Founded in 1997, a grassroots, nonpartisan 501(c)(3) protecting D.C. home rule — full local budget control with no congressional review, locally elected or appointed judges, and full voting representation.',
src/data/statehoodPartners.js:192:      scope: 'national', url: 'https://www.congress.gov/bill/119th-congress/senate-bill/51/cosponsors',
src/data/statehoodPartners.js:194:      desc: 'S. 51, the Washington, D.C. Admission Act, introduced in the Senate for the 119th Congress with several dozen original cosponsors — real, voting senators from other states putting their name behind D.C. statehood.',
src/data/statehoodPartners.js:198:      scope: 'national', url: 'https://www.congress.gov/bill/119th-congress/house-bill/51/cosponsors',
src/data/statehoodPartners.js:200:      desc: "H.R. 51, the Washington, D.C. Admission Act, introduced in the House for the 119th Congress with well over 100 cosponsors — introduced by D.C.'s Delegate to Congress (Local Allies above) in every recent Congress.",
src/data/statehoodPartners.js:218:      desc: 'The national ACLU officially scored Congress’s June 2020 vote on H.R. 51, the Washington, D.C. Admission Act, in its congressional scorecard, urging a “yes” vote as a matter of “liberty, justice, and democracy.”',
src/data/statehoodPartners.js:238:  { name: 'DC Attorney General — court brief on lack of congressional representation', url: 'https://oag.dc.gov/release/ag-racine-files-court-brief-arguing-dc-residents' },
src/data/statehoodPartners.js:239:  { name: 'S. 51 (119th Congress) cosponsors', url: 'https://www.congress.gov/bill/119th-congress/senate-bill/51/cosponsors' },
src/data/statehoodPartners.js:240:  { name: 'H.R. 51 (119th Congress) cosponsors', url: 'https://www.congress.gov/bill/119th-congress/house-bill/51/cosponsors' },
src/data/statehoodPartners.js:258:  { name: 'League of Women Voters (national)', url: 'https://www.lwv.org/elections/lwvus-urges-congress-support-dc-statehood' },
src/data/categoryDetails.js:2: * Detailed information about each category of anti-DC congressional action
src/data/categoryDetails.js:17:DC's incarceration rate is the highest in the nation, driven partly by congressional interventions that override local preferences for reform and restorative justice approaches.`
src/data/categoryDetails.js:93:While some street renaming bills are routine, others are intentionally provocative, using DC's lack of autonomy to make political statements that contradict what DC residents have chosen for their own community. No state would tolerate Congress renaming its state capital's streets and plazas to impose political messages rejected by local residents. DC's civic spaces should reflect DC values, not be tools for congressional culture wars.`
.github/workflows/withhold.yml:27:# re-applies on every attempt, so concurrent writers cannot overwrite each other, and
scripts/fetch-news.mjs:263:    (current) => {
scripts/fetch-news.mjs:264:      const withheldAt = current?.withheldAt ? new Date(current.withheldAt) : null;
scripts/fetch-news.mjs:266:        record.reason = `a withholding at ${current.withheldAt} superseded this run's summary`;
scripts/fetch-news.mjs:267:        return { ...payload, summary: null, summarySource: null, withheldAt: current.withheldAt };
scripts/fetch-news.mjs:270:      // withholding happened, not "currently withheld" — dropping it would let a run that
scripts/fetch-news.mjs:272:      return current?.withheldAt ? { ...payload, withheldAt: current.withheldAt } : payload;
src/data/memberSort.js:23:// Sign-on order: dated cosponsors first, then the sponsor, then members not yet signed on.
src/data/memberSort.js:35: * newest sign-on first; most cosponsors share the introduction date, so ties fall back to
src/data/routeMeta.js:41:  '/how-congress-controls-dc': {
scripts/news/withhold.mjs:46:  (current) => {
scripts/news/withhold.mjs:47:    if (!current) {
scripts/news/withhold.mjs:54:    if (!current.summary) {
scripts/news/withhold.mjs:57:      return { ...current, summary: null, summarySource: null, withheldAt, withheldReason: reason };
scripts/news/withhold.mjs:60:    // Built from the branch's current copy, not from anything this process generated,
scripts/news/withhold.mjs:62:    return { ...current, summary: null, summarySource: null, withheldAt, withheldReason: reason };
scripts/eval/news.test.mjs:214:test('prompt: headlines carry dates and ages, the fix for "currently considering"', () => {
scripts/news/judge.mjs:23:J3 temporal — D.C. statehood news moves slowly, so "currently", "ongoing", "recent" and the present tense are FINE for anything within roughly the last two months. Do not flag ordinary tense or word choice. Flag only outright errors: (a) describing something as pending, underway or under consideration when a headline shows it was already decided, passed, rejected or completed; (b) a date, duration or sequence the headlines contradict; (c) present-tense claims resting only on an article more than about two months old.
src/data/talkingPoints.js:13:      elevatorPitch: "House Republicans held hearings to block DC's traffic cameras and right-on-red ban, with one congressman calling safety enforcement 'tyranny.' Meanwhile, DC has one of the worst pedestrian death rates in America. This is what taxation without representation looks like: suburban drivers' convenience matters more than DC kids walking to school. No state would tolerate Congress micromanaging their stop signs.",
src/data/talkingPoints.js:15:      fullArgument: "This is authoritarian control, plain and simple. House Republicans are micromanaging DC's traffic lights, speed cameras, and crosswalk rules while 700,000 DC residents have zero voting representation in Congress. They held multiple hearings in 2023-2024 specifically targeting DC's traffic safety measures—cameras that [reduce fatal crashes by 30%](https://www.iihs.org/news/detail/study-red-light-cameras-cut-fatal-crashes) and [speeding by 70%](https://ddot.dc.gov/page/vision-zero-initiative) near schools. One congressman called automated enforcement 'tyranny' and the 2025 appropriations bill blocked funding for these life-saving cameras. DC has [one of the highest pedestrian fatality rates](https://www.ghsa.org/resources/Pedestrians24) among major cities, yet Congress prioritizes the convenience of drivers passing through from Virginia and Maryland over DC children's lives. This is taxation without representation in its most literal form: Congress treating DC like federal property instead of a home to 700,000 Americans who [pay more federal taxes per capita](https://www.dcfpi.org/all/federal-taxes-paid-by-district-residents/) than any state. No state—red or blue—would tolerate this level of federal interference in their local traffic enforcement. We need statehood now."
src/data/talkingPoints.js:44:      fullArgument: "This is authoritarian control over the most personal healthcare decisions. Since 1988, Congress has renewed the Dornan Amendment annually, blocking DC from using any funds—even locally-raised tax revenue—for abortion services. No state faces this restriction. In 2011, [Congress nearly forced a government shutdown](https://www.washingtonpost.com/local/dc-politics/congress-dc-abortion-funding-fight/2011/04/08/) because DC's budget included local abortion funding. House Republicans have also blocked DC's [death with dignity laws](https://dcist.com/story/17/01/23/congress-blocks-dc-death-with-dignity-law/), needle exchange programs, and medical marijuana regulations. Now Rep. Christopher Smith (R-NJ) and others are pushing to repeal DC's [Human Rights Sanctuary Amendment Act](https://code.dccouncil.gov/us/dc/council/laws/24-257)—a shield law protecting abortion and gender-affirming care providers from out-of-state investigations. Twenty-two states have identical shield law protections, yet Congress singles out DC for interference. This creates a two-tiered system where constitutional rights depend on your zip code. DC residents [pay more federal taxes per capita](https://www.dcfpi.org/all/federal-taxes-paid-by-district-residents/) than any state but can't make basic healthcare decisions with their own money. No state would tolerate this level of federal control over local healthcare policy. We need statehood now."
src/data/talkingPoints.js:52:      fullArgument: "Local communities should control healthcare policy funded with their own tax dollars. Since 1988, Congress has annually renewed the Dornan Amendment, blocking DC from spending locally-raised revenue (not federal funds) on abortion services. No state faces this restriction—it's unique to DC. Apply the conservative principle consistently: if your state legislature voted to fund certain healthcare services with state tax dollars, should federal politicians override that decision? Beyond abortion, Congress has blocked DC's [death with dignity law](https://dcist.com/story/17/01/23/congress-blocks-dc-death-with-dignity-law/)—supported by DC voters—and interfered with needle exchange programs and medical marijuana regulations. Now Congress is targeting DC's shield law, which protects healthcare providers from out-of-state investigations. [Twenty-two states have identical shield law protections](https://www.guttmacher.org/state-policy/explore/shield-laws-sexual-and-reproductive-health-care) for reproductive and gender-affirming care—including red states protecting their providers' ability to serve out-of-state patients. Yet Congress is trying to repeal DC's law while leaving state laws untouched. This isn't about red or blue politics—it's about whether local communities can make healthcare decisions with their own money. DC taxpayers [pay more per capita to the federal government](https://www.dcfpi.org/all/federal-taxes-paid-by-district-residents/) than any state, yet face restrictions no state tolerates. The same federalism principle that protects your state's healthcare decisions should apply to DC."
src/data/talkingPoints.js:102:      fullArgument: "This is authoritarian control over the most fundamental issues of public safety and justice. In 2023, Congress passed H.J.Res. 26 to overturn DC's [Revised Criminal Code Act of 2022](https://www.congress.gov/bill/118th-congress/house-joint-resolution/26)—a comprehensive modernization that was 16 years in the making, involved judges, prosecutors, defense attorneys, and community advocates, and passed the DC Council unanimously. The Senate voted 81-14 to block it, marking [only the second time in 50 years](https://www.npr.org/2023/03/08/1161902691/d-c-crime-bill-biden-overturn) Congress fully overturned a DC law and the first time the Senate voted to do so. President Biden signed the disapproval resolution despite previously opposing congressional interference in DC affairs. The pattern continues in 2025. H.R. 5107, the [CLEAN DC Act](https://www.congress.gov/bill/119th-congress/house-bill/5107), passed the House (233-190) to repeal DC's Comprehensive Policing and Justice Reform Amendment Act of 2022—which established common-sense police accountability measures like requiring officers to consult mental health workers before using deadly force and prohibiting officers from reviewing body camera footage before writing initial incident reports. These are policies that [20 states have mandated for body cameras](https://worldpopulationreview.com/state-rankings/body-camera-laws-by-state), including Georgia, whose congressman Andrew Clyde sponsors H.R. 5107. H.R. 5214, the [District of Columbia Cash Bail Reform Act](https://www.congress.gov/bill/119th-congress/house-bill/5214), passed the House (237-179) to force DC to reinstate cash bail—overriding DC's pretrial justice reforms. Yet [Illinois eliminated cash bail entirely](https://worldpopulationreview.com/state-rankings/no-cash-bail-states) in 2023 through the Pretrial Fairness Act, New Jersey virtually eliminated it in 2017, and New York ended it for most misdemeanors and nonviolent felonies in 2020. Congress doesn't try to override any state's bail reform policies—only DC's. Here's the context: DC has [one of the highest incarceration rates in the United States](https://www.prisonpolicy.org/global/appendix_states_2024.html)—816 per 100,000 people, ranking among the top 10 jurisdictions nationally. DC's jail population is [87.4% Black](https://www.law.georgetown.edu/mcrp-journal/blog/true-justice-the-disturbing-truth-about-incarceration-in-d-c/) despite Black residents comprising 44.4% of DC's population. This disparity is driven partly by decades of congressional interventions that override local preferences for reform and restorative justice approaches. DC voters elect officials who support police accountability, bail reform, and alternative approaches to public safety—but Congress blocks every reform while DC residents have no voting representation to defend these policies. No state would tolerate federal politicians overriding 16 years of criminal justice work or forcing the state to abandon evidence-based policing reforms. We need statehood now."
src/data/talkingPoints.js:110:      fullArgument: "Local communities should control their own criminal justice and public safety policies. In 2023, Congress used the Congressional Review Act to overturn DC's [Revised Criminal Code Act of 2022](https://www.congress.gov/bill/118th-congress/house-joint-resolution/26)—a comprehensive modernization that took 16 years to develop and involved local judges, prosecutors, defense attorneys, and community advocates. The DC Council passed it unanimously. Congress rejected all that local expertise and community input with a single vote. Apply the conservative principle consistently: [20 states mandate body cameras for law enforcement](https://worldpopulationreview.com/state-rankings/body-camera-laws-by-state), including Colorado, Connecticut, Illinois, Maryland, New Jersey, New Mexico, and South Carolina. Georgia passed legislation requiring retention of body camera footage for specific periods. Yet H.R. 5107 would repeal DC's police accountability law that includes similar body camera policies and requirements for mental health consultation before use of deadly force. If Georgia can establish body camera policies, why can't DC? On bail reform: [Illinois eliminated cash bail entirely](https://worldpopulationreview.com/state-rankings/no-cash-bail-states) through the Pretrial Fairness Act in September 2023. New Jersey virtually eliminated cash bail in 2017. [New York ended cash bail](https://www.brennancenter.org/our-work/research-reports/facts-bail-reform-new-york-how-pretrial-detention-and-release-works-now) for most misdemeanors and nonviolent felonies in 2020—and research shows it [reduced recidivism and felony rearrests](https://www.fwd.us/news/new-york-bail-reform-success-story/). Congress doesn't try to override any of these state policies. Yet H.R. 5214 forces DC to reinstate cash bail, eliminating DC's pretrial justice reforms. Here's the context that should concern anyone who values federalism: DC has [one of the highest incarceration rates in America](https://www.prisonpolicy.org/global/appendix_states_2024.html)—816 per 100,000 people, ranking among the top 10 jurisdictions nationally. Local officials, prosecutors, and judges concluded that criminal justice reform was necessary to address this crisis. Congress overrode 16 years of their work without considering the local context or expertise. This isn't about red or blue politics—it's about whether local communities can make evidence-based criminal justice decisions with input from local law enforcement, prosecutors, judges, and residents. The same federalism principle that protects your state's criminal justice reforms should apply to DC. Congress shouldn't be micromanaging local police policies and bail procedures—especially when DC residents have zero voting representation in that same Congress."
src/data/talkingPoints.js:116:        examples: "Clyde sponsors the [CLEAN DC Act (H.R. 5107)](https://www.congress.gov/bill/119th-congress/house-bill/5107) to repeal DC's Comprehensive Policing and Justice Reform Amendment Act, which includes body camera policies and use-of-force restrictions. Yet [Georgia law requires](https://law.justia.com/codes/georgia/title-50/chapter-18/article-5/section-50-18-96/) all law enforcement departments that use body-worn cameras to retain video recordings for 180 days, with extended retention for videos involving arrests or use of force. Georgia's proposed [Transparency in Policing Act (HB325)](https://www.billtrack50.com/billdetail/1565487) would require all uniformed officers to wear body cameras by July 1, 2025. While Georgia establishes police accountability measures, Clyde blocks DC from doing the same."
src/data/talkingPoints.js:120:        examples: "Stefanik sponsors the [District of Columbia Cash Bail Reform Act (H.R. 5214)](https://www.congress.gov/bill/119th-congress/house-bill/5214) to require DC to impose cash bail on those charged with public safety offenses. Yet [New York ended cash bail](https://www.brennancenter.org/our-work/research-reports/facts-bail-reform-new-york-how-pretrial-detention-and-release-works-now) for most misdemeanors and nonviolent felonies in 2020—exactly the type of reform DC was pursuing. Research from John Jay College found New York's bail reform [led to decreased felony rearrests and reduced recidivism](https://www.fwd.us/news/new-york-bail-reform-success-story/). New York Governor Kathy Hochul has defended the state's bail reform against federal interference. Yet Stefanik—who represents a New York district—seeks to force DC to abandon similar reforms while DC residents have no voting representation to defend their local policies."
src/data/talkingPoints.js:124:        examples: "The Senate voted [81-14 to pass H.J.Res. 26](https://www.govtrack.us/congress/votes/118-2023/s49) overturning DC's Revised Criminal Code Act of 2022. Only 14 senators voted against the measure. Senators from states with progressive criminal justice reforms voted to block DC's reforms: Illinois (which [eliminated cash bail entirely in 2023](https://worldpopulationreview.com/state-rankings/no-cash-bail-states)), New Jersey (which virtually eliminated cash bail in 2017), and Connecticut (which [mandates body cameras statewide](https://worldpopulationreview.com/state-rankings/body-camera-laws-by-state)). These senators defend their states' right to criminal justice reform while denying DC the same autonomy—despite DC having one of the highest incarceration rates in the nation and DC residents having zero voting representation in the Senate."
scripts/eval/race.test.mjs:118:    (current) => {
scripts/eval/race.test.mjs:119:      seenByApply.push(current?.runId ?? null);
scripts/eval/race.test.mjs:141:    (current) => {
scripts/eval/race.test.mjs:142:      seenByApply.push(current?.runId ?? null);
scripts/eval/race.test.mjs:164:        previousRunId: current?.runId ?? null,
scripts/eval/race.test.mjs:183:    (current) => ({ ...current, summary: null, withheldAt: '2026-09-12T10:05:00Z' }),
scripts/eval/race.test.mjs:190:    (current) => {
scripts/eval/race.test.mjs:191:      const withheldAt = current?.withheldAt ? new Date(current.withheldAt) : null;
scripts/eval/race.test.mjs:199:        return { ...payload, summary: null, withheldAt: current.withheldAt };
scripts/news/publish.mjs:10: * Three rules keep concurrent writers honest, because scheduled runs, reruns and the
scripts/news/publish.mjs:14: *   2. Every write re-reads the branch's current file immediately before pushing and
scripts/news/publish.mjs:80: * `apply` receives the branch's current file (or null) and returns what to write, so a
scripts/news/publish.mjs:89:    const current = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
scripts/news/publish.mjs:91:    const next = apply(current);
scripts/news/publish.mjs:92:    if (next === null) return { pushed: false, skipped: true, current };
scripts/eval/news-golden.json:39:      "id": "hist-2026-08-29-stale-as-current",
scripts/eval/news-golden.json:42:      "note": "Published. RELABELLED 2026-09-12 on Andria's call: 39 days is inside the ~2-month window this beat moves on, so 'currently considering' is acceptable language, not an error. Kept as a case because the same body calls a takeover from 12+ months earlier 'recent', which is outside the window — borderline, so it scores neither as a required catch nor as a precision control.",
scripts/eval/news-golden.json:49:      "publishedBody": "Recent federal interventions in D.C.—including a takeover and National Guard deployment—have prompted advocates to emphasize how statehood would protect the District, and a House committee is currently considering proposals that advocates say would further undermine D.C.'s fiscal independence.",
scripts/eval/news-golden.json:64:      "publishedBody": "The House is currently considering whether to overturn a District policing law, while senators continue to debate a rider affecting D.C.'s budget.",
scripts/eval/news-golden.json:163:      "note": "Numbers present in headlines must pass G2; numbers absent from them must not. NOT a judge-precision control — it has no labelled clean body, and its generations legitimately draw flags (a single vote became 'continuing a pattern of congressional intervention', which J1/J4 correctly caught).",
scripts/news/summarize.mjs:8: *   titles and sources only, which is how "a House committee is currently considering
scripts/news/summarize.mjs:81:- DC home rule or congressional oversight of DC
scripts/news/summarize.mjs:124:        content: `You write a short neutral news-digest summary for a DC statehood advocacy website (www.representdc.org). Below are the current DC statehood/home-rule headlines the site is showing, each with its publication date and age.
scripts/news/summarize.mjs:130:- Respect the dates, but do not be pedantic about them: this beat moves slowly, so "currently", "ongoing" and the present tense are fine for anything within the last two months or so. What you must never do is state an outcome the headlines do not support — calling something pending when a headline says it was decided, passed or rejected; saying an event ended, lasted a set time, or is still going on when the headlines only mark its anniversary; or attaching a date the headlines do not give. If the only headline behind a claim is older than about two months, write it in the past tense.
scripts/news/closers.mjs:47:  // since FY2017, subject to the congressional review period rather than an
scripts/news/closers.mjs:57:      "Without statehood, the District's budget must clear a congressional review " +
scripts/news/feeds.mjs:37:  // happens as congressional action on DC (riders, oversight, home-rule bills).
scripts/eval/fixtures/history-summaries.json:85:      "summary": "D.C. statehood advocates are intensifying their push at multiple levels, with efforts targeting the midterm elections, securing commitments from federal lawmakers, and responding to recent events including a federal takeover and National Guard deployment that they argue demonstrate the need for greater local autonomy. The movement is also working to protect D.C.'s fiscal independence against congressional action.\n\nWithout statehood, Congress can override any law the District passes and can unilaterally take control of D.C.'s government and finances.",
scripts/eval/fixtures/history-summaries.json:86:      "body": "D.C. statehood advocates are intensifying their push at multiple levels, with efforts targeting the midterm elections, securing commitments from federal lawmakers, and responding to recent events including a federal takeover and National Guard deployment that they argue demonstrate the need for greater local autonomy. The movement is also working to protect D.C.'s fiscal independence against congressional action.",
scripts/eval/fixtures/history-summaries.json:501:      "summary": "D.C. statehood advocates are intensifying their push ahead of the midterm elections, with efforts to build support among states and secure commitments from federal lawmakers. Recent events including federal intervention in D.C. governance and the deployment of National Guard troops have prompted advocates to argue that statehood is increasingly urgent for protecting local autonomy. Separately, advocates are working to defend D.C.'s fiscal independence against what they characterize as congressional overreach.\n\nWithout statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:502:      "body": "D.C. statehood advocates are intensifying their push ahead of the midterm elections, with efforts to build support among states and secure commitments from federal lawmakers. Recent events including federal intervention in D.C. governance and the deployment of National Guard troops have prompted advocates to argue that statehood is increasingly urgent for protecting local autonomy. Separately, advocates are working to defend D.C.'s fiscal independence against what they characterize as congressional overreach.",
scripts/eval/fixtures/history-summaries.json:527:      "summary": "D.C. statehood advocates are intensifying their push ahead of the midterm elections, with supporters highlighting recent events including federal intervention and National Guard deployment as reasons statehood is urgent. A senator has committed to prioritizing D.C. statehood while advocates work to protect the District's fiscal autonomy against congressional challenges. Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any local laws the District passes.",
scripts/eval/fixtures/history-summaries.json:528:      "body": "D.C. statehood advocates are intensifying their push ahead of the midterm elections, with supporters highlighting recent events including federal intervention and National Guard deployment as reasons statehood is urgent. A senator has committed to prioritizing D.C. statehood while advocates work to protect the District's fiscal autonomy against congressional challenges.",
scripts/eval/fixtures/history-summaries.json:579:      "summary": "D.C. statehood advocates are intensifying their push across multiple fronts, securing commitments from federal lawmakers while highlighting incidents they argue demonstrate the need for local autonomy. Recent events, including a federal takeover and National Guard deployment in D.C., are being used to underscore the urgency of statehood as advocates expand their reach into other states ahead of the midterm elections and defend D.C.'s fiscal independence against congressional challenges.\n\nWithout statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:580:      "body": "D.C. statehood advocates are intensifying their push across multiple fronts, securing commitments from federal lawmakers while highlighting incidents they argue demonstrate the need for local autonomy. Recent events, including a federal takeover and National Guard deployment in D.C., are being used to underscore the urgency of statehood as advocates expand their reach into other states ahead of the midterm elections and defend D.C.'s fiscal independence against congressional challenges.",
scripts/eval/fixtures/history-summaries.json:683:      "summary": "D.C. statehood advocates are pursuing multiple strategies to advance their cause, including mobilizing around midterm elections and securing commitments from sympathetic federal lawmakers, while also responding to recent events that they argue demonstrate the need for local autonomy. Recent federal interventions in D.C.—including a takeover and National Guard deployment—have prompted advocates to emphasize how statehood would protect the District from external federal control, and a House committee is currently considering proposals that advocates say would further undermine D.C.'s fiscal independence. Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:684:      "body": "D.C. statehood advocates are pursuing multiple strategies to advance their cause, including mobilizing around midterm elections and securing commitments from sympathetic federal lawmakers, while also responding to recent events that they argue demonstrate the need for local autonomy. Recent federal interventions in D.C.—including a takeover and National Guard deployment—have prompted advocates to emphasize how statehood would protect the District from external federal control, and a House committee is currently considering proposals that advocates say would further undermine D.C.'s fiscal independence.",
scripts/eval/fixtures/history-summaries.json:735:      "summary": "D.C. statehood advocates are intensifying efforts ahead of the midterm elections, with a senator committing to prioritize the issue while advocates reference recent events—including a National Guard deployment and federal fiscal interventions—as evidence for why statehood is urgent. The campaign is expanding beyond D.C. to reach voters in other states, and advocates are actively opposing congressional actions that constrain the District's autonomy.\n\nWithout statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:736:      "body": "D.C. statehood advocates are intensifying efforts ahead of the midterm elections, with a senator committing to prioritize the issue while advocates reference recent events—including a National Guard deployment and federal fiscal interventions—as evidence for why statehood is urgent. The campaign is expanding beyond D.C. to reach voters in other states, and advocates are actively opposing congressional actions that constrain the District's autonomy.",
scripts/eval/fixtures/history-summaries.json:839:      "summary": "D.C. statehood advocates are expanding their efforts beyond the District, taking their campaign to other states ahead of the midterm elections while seeking congressional support, and residents continue to grapple with the aftermath of National Guard deployment in the city. Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:840:      "body": "D.C. statehood advocates are expanding their efforts beyond the District, taking their campaign to other states ahead of the midterm elections while seeking congressional support, and residents continue to grapple with the aftermath of National Guard deployment in the city.",
scripts/eval/fixtures/history-summaries.json:1021:      "summary": "A year after federal deployment of National Guard troops to Washington, D.C., advocacy groups are highlighting the incident as evidence for the need for statehood, while separately opposing what they characterize as a congressional attack on the District's fiscal independence. The coverage underscores ongoing concerns about federal control over D.C.'s governance and resources.\n\nWithout statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1022:      "body": "A year after federal deployment of National Guard troops to Washington, D.C., advocacy groups are highlighting the incident as evidence for the need for statehood, while separately opposing what they characterize as a congressional attack on the District's fiscal independence. The coverage underscores ongoing concerns about federal control over D.C.'s governance and resources.",
scripts/eval/fixtures/history-summaries.json:1125:      "summary": "The headlines reflect ongoing concerns about federal control over D.C., including the deployment of National Guard troops a year ago and current threats to the District's fiscal independence. Advocates are using these events to underscore what they see as the necessity of statehood to prevent future federal overreach. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1126:      "body": "The headlines reflect ongoing concerns about federal control over D.C., including the deployment of National Guard troops a year ago and current threats to the District's fiscal independence. Advocates are using these events to underscore what they see as the necessity of statehood to prevent future federal overreach.",
scripts/eval/fixtures/history-summaries.json:1177:      "summary": "A year after federal deployment of National Guard troops to D.C., advocacy groups are highlighting the incident as evidence of why the District needs statehood, while separately pushing back against what they characterize as congressional threats to D.C.'s fiscal independence. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1178:      "body": "A year after federal deployment of National Guard troops to D.C., advocacy groups are highlighting the incident as evidence of why the District needs statehood, while separately pushing back against what they characterize as congressional threats to D.C.'s fiscal independence.",
scripts/eval/fixtures/history-summaries.json:1333:      "summary": "The District continues grappling with the aftermath of a year-long National Guard deployment, with advocacy groups citing the federal military presence as evidence for statehood, while the Department of Justice has opposed the D.C. Council's efforts to demand withdrawal. Separately, D.C. Vote is pushing back against what it characterizes as a congressional threat to the District's fiscal independence. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1334:      "body": "The District continues grappling with the aftermath of a year-long National Guard deployment, with advocacy groups citing the federal military presence as evidence for statehood, while the Department of Justice has opposed the D.C. Council's efforts to demand withdrawal. Separately, D.C. Vote is pushing back against what it characterizes as a congressional threat to the District's fiscal independence.",
scripts/eval/fixtures/history-summaries.json:1489:      "summary": "A year after the National Guard deployment in Washington, D.C., statehood advocates and the Department of Justice are at odds over the D.C. Council's response, with advocacy groups citing the incident as evidence for why D.C. statehood is necessary. Meanwhile, a separate threat to D.C.'s fiscal independence is drawing opposition from statehood supporters urging congressional rejection of the proposed measures.",
scripts/eval/fixtures/history-summaries.json:1490:      "body": "A year after the National Guard deployment in Washington, D.C., statehood advocates and the Department of Justice are at odds over the D.C. Council's response, with advocacy groups citing the incident as evidence for why D.C. statehood is necessary. Meanwhile, a separate threat to D.C.'s fiscal independence is drawing opposition from statehood supporters urging congressional rejection of the proposed measures.",
scripts/eval/fixtures/history-summaries.json:1723:      "summary": "The District is engaged in multiple ongoing battles over autonomy and federal control. Recent victories include success against the Trump administration on voter rolls, while current threats to DC's fiscal independence and federal oversight of the National Guard illustrate persistent challenges to home rule. These conflicts underscore longstanding concerns about DC's limited self-governance that statehood advocates argue could be resolved through statehood.",
scripts/eval/fixtures/history-summaries.json:1724:      "body": "The District is engaged in multiple ongoing battles over autonomy and federal control. Recent victories include success against the Trump administration on voter rolls, while current threats to DC's fiscal independence and federal oversight of the National Guard illustrate persistent challenges to home rule. These conflicts underscore longstanding concerns about DC's limited self-governance that statehood advocates argue could be resolved through statehood.",

exec
/bin/zsh -lc "nl -ba src/data/statehoodBill.js | sed -n '220,410p'; nl -ba src/components/MemberLookup.jsx; cat src/fixtures/statehoodBill.js; cat src/hooks/useStatehoodBill.js; cat package.json; rg --files src scripts | rg 'statehood|Statehood|Member|memberSort'; find src -name AGENTS.md -o -name CLAUDE.md" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
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
   363	 * Cosponsors on the bill's record who are absent from the chamber's current roster, i.e.
   364	 * members who signed on and have since left. They count in the recorded total but cannot
   365	 * appear in the member list, which is built from the roster. A cosponsor who signed on
   366	 * after the roster was generated is left out: that is a new member the weekly roster has
   367	 * not caught up with, not a departure.
   368	 */
   369	export function departedCosponsors(roster, bill) {
   370	  if (!roster || !bill || roster.congress !== bill.congress || !bill.complete) return []
   371	  const seated = new Set(roster.members.filter((m) => m.chamber === bill.chamber).map((m) => m.bioguideId))
   372	  const rosterDate = etDate(roster.generatedAt)
   373	  return bill.cosponsors.filter((c) => !seated.has(c.bioguideId) && c.sponsorshipDate <= rosterDate)
   374	}
   375	
   376	/**
   377	 * History rows. A row the tracker marks provisional (`final: false`) takes its count from
   378	 * the live cosponsor file when that file holds the same bill as the current, complete one,
   379	 * so the table and the headline never disagree. Final rows are never overwritten.
   380	 */
   381	export function historyWithLive(history, house, senate) {
   382	  return history.map((row) => {
   383	    if (row.final) return row
   384	    const live = (b, side) => (b && b.current && b.complete && side && b.congress === row.congress && b.billNumber === side.billNumber
   385	      ? { ...side, cosponsors: b.totals.cosponsors }
   386	      : side)
   387	    return { ...row, house: live(house, row.house), senate: live(senate, row.senate) }
   388	  })
   389	}
     1	import { useId, useMemo, useRef, useState } from 'react'
     2	import { MemberRow } from './MemberRow'
     3	import { departedCosponsors, memberStatuses, ordinal } from '../data/statehoodBill'
     4	import { SORTS, lastNameKey, partyKey, partyOptions, sortMembers } from '../data/memberSort'
     5	
     6	const CHAMBERS = [
     7	  { key: 'house', label: 'House', plural: 'House members' },
     8	  { key: 'senate', label: 'Senate', plural: 'senators' },
     9	]
    10	// Why the recorded total is larger than the number of rows marked "Signed on".
    11	function DepartedNote({ bill, departed, chamberLabel }) {
    12	  if (departed.length === 0) return null
    13	  const n = departed.length
    14	  const names = [...departed]
    15	    .sort((a, b) => lastNameKey(a.name).localeCompare(lastNameKey(b.name)))
    16	    .map((c) => `${c.name} (${c.state})`)
    17	    .join(', ')
    18	  return (
    19	    <p className="lookup-footnote">
    20	      Congress.gov records {bill.totals.cosponsors} cosponsors of {bill.billNumber}. {n} of them{' '}
    21	      {n === 1 ? 'has' : 'have'} since left the {chamberLabel} and {n === 1 ? 'is' : 'are'} not listed here: {names}.
    22	    </p>
    23	  )
    24	}
    25	
    26	const FILTERS = [
    27	  { key: 'not-yet', label: 'Not yet signed on' },
    28	  { key: 'signed', label: 'Signed on' },
    29	  { key: 'all', label: 'All' },
    30	]
    31	
    32	// The organizer view: every current member, their status on this chamber's bill.
    33	// Tabs follow the WAI-ARIA tabs pattern (arrow keys move between them); filters are a
    34	// native radio group, so they work by keyboard with no extra code. Party and sort are
    35	// native selects for the same reason.
    36	function MemberLookup({ bills, rosters }) {
    37	  const [chamber, setChamber] = useState('house')
    38	  const [filter, setFilter] = useState('not-yet')
    39	  const [stateCode, setStateCode] = useState('')
    40	  const [partyChoice, setPartyChoice] = useState('')
    41	  const [sort, setSort] = useState('name')
    42	  const [query, setQuery] = useState('')
    43	  const tabRefs = useRef({})
    44	  const id = useId()
    45	
    46	  const bill = bills[chamber]
    47	  // A roster only answers "not yet" for its own Congress, and only while this chamber's
    48	  // bill is the current one with a complete cosponsor list. memberStatuses returns null
    49	  // when the files disagree about a member, and the panel then shows nothing.
    50	  const roster = bill ? rosters[bill.congress]?.data : null
    51	  const statuses = useMemo(
    52	    () => (bill && bill.current && bill.complete ? memberStatuses(roster, bill) : null),
    53	    [bill, roster],
    54	  )
    55	  const usable = Boolean(statuses)
    56	  const departed = useMemo(() => (usable ? departedCosponsors(roster, bill) : []), [usable, roster, bill])
    57	  const all = useMemo(() => statuses ?? [], [statuses])
    58	  const states = useMemo(() => [...new Set(all.map((m) => m.state))].sort(), [all])
    59	  const parties = useMemo(() => partyOptions(all), [all])
    60	  // A party picked in one chamber may not exist in the other; then it filters nothing.
    61	  const party = parties.some((p) => p.key === partyChoice) ? partyChoice : ''
    62	  const sorted = useMemo(() => sortMembers(all, sort), [all, sort])
    63	  const needle = query.trim().toLowerCase()
    64	  const shown = sorted.filter((m) =>
    65	    (filter === 'all' || m.status === filter || (filter === 'signed' && m.status === 'sponsor')) &&
    66	    (!stateCode || m.state === stateCode) &&
    67	    (!party || partyKey(m) === party) &&
    68	    (!needle || m.name.toLowerCase().includes(needle)))
    69	
    70	  // Sign-on order says nothing about members who have not signed on, so the two choices
    71	  // move together: picking it shows who has signed, and leaving for "not yet" drops it.
    72	  const chooseSort = (key) => {
    73	    setSort(key)
    74	    if (key === 'recent' && filter === 'not-yet') setFilter('signed')
    75	  }
    76	  const chooseFilter = (key) => {
    77	    setFilter(key)
    78	    if (key === 'not-yet' && sort === 'recent') setSort('name')
    79	  }
    80	
    81	  const selectTab = (key) => {
    82	    setChamber(key)
    83	    setStateCode('')
    84	    tabRefs.current[key]?.focus()
    85	  }
    86	  const onTabKey = (e) => {
    87	    const i = CHAMBERS.findIndex((c) => c.key === chamber)
    88	    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: CHAMBERS.length - 1 }[e.key]
    89	    if (next === undefined) return
    90	    e.preventDefault()
    91	    selectTab(CHAMBERS[(next + CHAMBERS.length) % CHAMBERS.length].key)
    92	  }
    93	
    94	  const active = CHAMBERS.find((c) => c.key === chamber)
    95	
    96	  return (
    97	    <div className="lookup">
    98	      <div className="lookup-tabs" role="tablist" aria-label="Chamber">
    99	        {CHAMBERS.map((c) => (
   100	          <button
   101	            key={c.key}
   102	            ref={(el) => { tabRefs.current[c.key] = el }}
   103	            type="button"
   104	            role="tab"
   105	            id={`${id}-tab-${c.key}`}
   106	            aria-selected={chamber === c.key}
   107	            aria-controls={`${id}-panel`}
   108	            tabIndex={chamber === c.key ? 0 : -1}
   109	            className="lookup-tab"
   110	            onClick={() => selectTab(c.key)}
   111	            onKeyDown={onTabKey}
   112	          >
   113	            {c.label}
   114	          </button>
   115	        ))}
   116	      </div>
   117	
   118	      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${chamber}`} className="lookup-panel">
   119	        {!usable ? (
   120	          bill && !bill.current
   121	            ? <p className="lookup-empty">No confirmed {ordinal(bill.congress + 1)}-Congress bill linked yet.</p>
   122	            : null
   123	        ) : (
   124	          <>
   125	            <div className="lookup-controls">
   126	              <fieldset className="lookup-filters">
   127	                <legend className="sr-only">Show</legend>
   128	                {FILTERS.map((f) => (
   129	                  <label key={f.key} className="filter-chip">
   130	                    <input type="radio" name={`${id}-filter`} value={f.key} checked={filter === f.key} onChange={() => chooseFilter(f.key)} />
   131	                    <span>{f.label}</span>
   132	                  </label>
   133	                ))}
   134	              </fieldset>
   135	              <label className="lookup-field">
   136	                <span>State</span>
   137	                <select value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
   138	                  <option value="">All states</option>
   139	                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
   140	                </select>
   141	              </label>
   142	              <label className="lookup-field">
   143	                <span>Party</span>
   144	                <select value={party} onChange={(e) => setPartyChoice(e.target.value)}>
   145	                  <option value="">All parties</option>
   146	                  {parties.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
   147	                </select>
   148	              </label>
   149	              <label className="lookup-field">
   150	                <span>Sort by</span>
   151	                <select value={sort} onChange={(e) => chooseSort(e.target.value)}>
   152	                  {SORTS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
   153	                </select>
   154	              </label>
   155	              <label className="lookup-field">
   156	                <span>Search by name</span>
   157	                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
   158	              </label>
   159	            </div>
   160	            <p className="lookup-count" role="status" aria-live="polite">
   161	              Showing {shown.length} of {all.length} {active.plural}.
   162	            </p>
   163	            {shown.length > 0 && (
   164	              <ul className="member-list">
   165	                {shown.map((m) => <MemberRow key={m.bioguideId} member={m} />)}
   166	              </ul>
   167	            )}
   168	            <DepartedNote bill={bill} departed={departed} chamberLabel={active.label} />
   169	          </>
   170	        )}
   171	      </div>
   172	    </div>
   173	  )
   174	}
   175	
   176	export default MemberLookup
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
cat: src/hooks/useStatehoodBill.js: No such file or directory
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
src/StatehoodBill.css
src/data/statehoodBill.js
src/data/memberSort.js
src/data/statehoodPartners.js
src/StatehoodPartnerMap.css
src/fixtures/statehoodBill.js
src/components/MemberLookup.jsx
src/components/MemberRow.jsx
src/hooks/useStatehoodBillData.js
src/StatehoodCurious.jsx
src/StatehoodBill.jsx
src/StatehoodPartnerMap.jsx
src/StatehoodBillSources.jsx

codex
The UI guards hide the note for stale rosters, mismatched Congresses, and non-current bills. The departure test has a gap, though: it compares calendar dates, so a member who joins and cosponsors later on the roster’s generation day can be wrongly named as having left. I’m checking that scenario through the validators.
exec
/bin/zsh -lc "cat src/hooks/useStatehoodBillData.js; cat src/StatehoodBillSources.jsx; rg -n 'Source|Congress.gov|MemberLookup|checked|current' src/StatehoodBill.jsx; cat eslint.config.js; git log -3 --oneline; ls node_modules/.bin/eslint" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
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
import { ordinal } from './data/statehoodBill'

// One consolidated sources block (DESIGN-GUARDRAILS: sources at the bottom, never per
// fact). Bill links come from the tracker's data so they follow the bills each Congress.
const link = (href, text) => (
  <a href={href} target="_blank" rel="noopener noreferrer">{text}</a>
)

// Sources for the "what the bill is" paragraph (CRS R47101 as on /myths; the Cornell
// overview essay rather than the bare clause page, per the Codex fact check).
const EXPLAINER = [
  {
    label: 'Constitution Annotated, "Overview of Admissions (New States) Clause," Art. IV, § 3, cl. 1, via Cornell LII',
    href: 'https://www.law.cornell.edu/constitution-conan/article-4/section-3/clause-1/overview-of-admissions-new-states-clause',
    host: 'law.cornell.edu',
  },
  {
    label: 'Congressional Research Service R47101, "DC Statehood: Constitutional Considerations for Proposed Legislation"',
    href: 'https://www.everycrsreport.com/reports/R47101.html',
    host: 'everycrsreport.com',
  },
]

const PROCEDURE = [
  {
    // Same CRS report as congress.gov/crs-product/98-988, which blocks automated link checks.
    label: 'Congressional Research Service, "Voting and Quorum Procedures in the House of Representatives" (March 2023)',
    href: 'https://www.everycrsreport.com/reports/98-988.html',
    host: 'everycrsreport.com',
  },
  {
    label: 'U.S. Senate, "About Voting"',
    href: 'https://www.senate.gov/about/powers-procedures/voting.htm',
    host: 'senate.gov',
  },
  {
    label: 'U.S. Senate, "About Filibusters and Cloture"',
    href: 'https://www.senate.gov/about/powers-procedures/filibusters-cloture.htm',
    host: 'senate.gov',
  },
]

function StatehoodBillSources({ bills, history, congress, explainer }) {
  const earlier = (history ?? []).filter((r) => r.congress !== congress)
  return (
    <div className="sources-block">
      <h2 className="sources-heading">Sources</h2>
      <div className="sources-list">
        {bills.filter((b) => b.complete).map((b) => (
          <span key={b.chamber}>
            Congress.gov, {b.billNumber} ({ordinal(b.congress)} Congress), cosponsors—
            {link(`${b.congressGovUrl.replace(/\/+$/, '')}/cosponsors`, 'congress.gov')}
          </span>
        ))}
        {congress && (
          <span>
            Congress.gov, members of the {ordinal(congress)} Congress—
            {link(`https://www.congress.gov/members?q=${encodeURIComponent(JSON.stringify({ congress }))}`, 'congress.gov')}
          </span>
        )}
        {earlier.flatMap((r) => [r.house, r.senate].filter((s) => s?.url).map((s) => (
          <span key={s.url}>
            GovInfo, bill status of {s.billNumber} ({ordinal(r.congress)} Congress)—{link(s.url, 'govinfo.gov')}
          </span>
        )))}
        {explainer && EXPLAINER.map((p) => (
          <span key={p.href}>{p.label}—{link(p.href, p.host)}</span>
        ))}
        {bills.length > 0 && PROCEDURE.map((p) => (
          <span key={p.href}>{p.label}—{link(p.href, p.host)}</span>
        ))}
      </div>
    </div>
  )
}

export default StatehoodBillSources
4:import MemberLookup from './components/MemberLookup'
9:import StatehoodBillSources from './StatehoodBillSources'
21:// Its two sources (New States Clause overview, CRS R47101) are in StatehoodBillSources.
44:      {!bill.current && <NotLinkedNote bill={bill} />}
47:        <span className="bill-chamber">{CHAMBER_NAME[bill.chamber]}{!bill.current && ` · ${ordinal(bill.congress)} Congress`}</span>
56:        <div><dt>Official record</dt><dd><ExternalLink href={bill.congressGovUrl}>Congress.gov</ExternalLink></dd></div>
67:        {CHAMBER_NAME[bill.chamber]} · {bill.billNumber}{!bill.current && ` · ${ordinal(bill.congress)} Congress`}
76:      <p className="count-checked">Last checked {formatCheckedInstant(bill.checkedAt)}</p>
156:              ? `Cosponsors of ${bills.house.billNumber} and ${bills.senate.billNumber}, from Congress.gov, checked daily.`
204:              <MemberLookup bills={bills} rosters={rosters} />
215:          <StatehoodBillSources bills={shown} history={historyRows} congress={congress} explainer={Boolean(WHAT_IT_IS)} />
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
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-N7oFpuXc' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-nzSq6OtY' (errno=Operation not permitted)
9ef9ec1 statehood-bill: note under the member list naming cosponsors who have left the chamber
392b0ab Merge pull request #6 from antzzz10/claude/cosponsor-sort-filter
f5e5a02 Record Codex medium and high reviews of the member list sort and party filter (no blocker or material findings)
node_modules/.bin/eslint

exec
/bin/zsh -lc 'node node_modules/eslint/bin/eslint.js src/data/statehoodBill.js src/components/MemberLookup.jsx' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 361ms:
[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`

exec
/bin/zsh -lc "node --input-type=module -e 'import { fixture } from \"./src/fixtures/statehoodBill.js\"; import { parseCosponsors, parseMembers, memberStatuses, departedCosponsors } from \"./src/data/statehoodBill.js\"; const now = new Date(\"2026-11-13T18:00:00Z\"); const rb=fixture(\"statehood-cosponsors\"), rr=fixture(\"members-119\"); rb.bills.forEach(b=>b.checkedAt=now.toISOString()); rr.generatedAt=\"2026-11-13T05:10:00Z\"; const c=rb.bills[0].cosponsors.find(c=>c.state===\"AL\"); c.sponsorshipDate=\"2026-11-13\"; c.isOriginalCosponsor=false; rb.bills[0].totals.original--; rr.members=rr.members.filter(m=>m.bioguideId"'!==c.bioguideId); rr.counts.house--; rr.counts.houseVoting--; const b=parseCosponsors(rb)?.house, r=parseMembers(rr,119); console.log(JSON.stringify({scenario:"new member joins after 00:10 Eastern roster and cosponsors same day",billValid:!!b,rosterValid:!!r,lookupUsable:!!memberStatuses(r,b,now),wronglyDeparted:departedCosponsors(r,b).map(c=>c.name)})); c.sponsorshipDate="2025-01-03"; c.isOriginalCosponsor=true; rb.bills[0].totals.original++; const b2=parseCosponsors(rb)?.house; console.log(JSON.stringify({scenario:"roster omits still-serving original cosponsor; counts match remaining rows",billValid:!!b2,rosterValid:!!r,lookupUsable:!!memberStatuses(r,b2,now),wronglyDeparted:departedCosponsors(r,b2).map(c=>c.name)})); console.log(JSON.stringify({staleRosterUsable:!!memberStatuses({...r,generatedAt:"2026-10-01T12:00:00Z"},b,now),differentCongressUsable:!!memberStatuses({...r,congress:120},b,now)}));'"'" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
{"scenario":"new member joins after 00:10 Eastern roster and cosponsors same day","billValid":true,"rosterValid":true,"lookupUsable":true,"wronglyDeparted":["Fixture member H001"]}
{"scenario":"roster omits still-serving original cosponsor; counts match remaining rows","billValid":true,"rosterValid":true,"lookupUsable":true,"wronglyDeparted":["Fixture member H001"]}
{"staleRosterUsable":false,"differentCongressUsable":false}

exec
/bin/zsh -lc 'git status --short' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-7KzMQHOx' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-wRTmnKCS' (errno=Operation not permitted)
?? reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md
?? reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md

codex
- **MATERIAL — [src/data/statehoodBill.js:373](src/data/statehoodBill.js#L373): Absence does not establish departure.** A roster generated at 00:10 Eastern omits a member seated later that day. If they cosponsor that afternoon, `sponsorshipDate <= rosterDate` passes and the note falsely names them as having left. A partial roster with matching counts can also misidentify a still-serving cosponsor. Both scenarios passed the validators and lookup guards in focused reproduction. This also conflicts with CLAUDE.md’s requirement for objective support for factual claims.

- **NOTE — [src/components/MemberLookup.jsx:20](src/components/MemberLookup.jsx#L20): Singular total uses “cosponsors.”** A valid bill with exactly one cosponsor, absent from the roster, renders “Congress.gov records 1 cosponsors.” The subsequent “1 of them has … is” agrees correctly.

No hook misuse found; targeted ESLint passed. Existing guards suppress the note for stale rosters, Congress mismatches, and non-current bills. No files changed.
tokens used
38,201
- **MATERIAL — [src/data/statehoodBill.js:373](src/data/statehoodBill.js#L373): Absence does not establish departure.** A roster generated at 00:10 Eastern omits a member seated later that day. If they cosponsor that afternoon, `sponsorshipDate <= rosterDate` passes and the note falsely names them as having left. A partial roster with matching counts can also misidentify a still-serving cosponsor. Both scenarios passed the validators and lookup guards in focused reproduction. This also conflicts with CLAUDE.md’s requirement for objective support for factual claims.

- **NOTE — [src/components/MemberLookup.jsx:20](src/components/MemberLookup.jsx#L20): Singular total uses “cosponsors.”** A valid bill with exactly one cosponsor, absent from the roster, renders “Congress.gov records 1 cosponsors.” The subsequent “1 of them has … is” agrees correctly.

No hook misuse found; targeted ESLint passed. Existing guards suppress the note for stale rosters, Congress mismatches, and non-current bills. No files changed.
