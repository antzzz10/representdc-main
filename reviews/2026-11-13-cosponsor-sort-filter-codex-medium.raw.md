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
session id: 01a1d571-e005-7af3-a984-9efdd77a91b2
--------
user
Review the last commit in this repository (git show HEAD): it adds sorting (last name, most recently signed on, state) and a party filter to src/components/MemberLookup.jsx, with helpers in the new src/data/memberSort.js. Context: src/data/statehoodBill.js (memberStatuses supplies the rows), src/components/MemberRow.jsx, src/StatehoodBill.css, CLAUDE.md, DESIGN-GUARDRAILS.md. Look for correctness bugs (sort order, ties, null party/date rows, state across the House/Senate tabs, React hook misuse), accessibility problems (keyboard, labels, live region), and anything that breaks existing behaviour. Read-only: do not edit files. Report findings as BLOCKER / MATERIAL / NOTE with file:line and a concrete failure scenario; say "no findings" if none.
codex
I’ll read the repository guidance, inspect HEAD, and trace the sorting and filtering behavior. I won’t edit any files.
exec
/bin/zsh -lc 'pwd && git status --short && git show --stat --oneline HEAD' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
/Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-ZwRwOQ6R' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-G2h5g9Ap' (errno=Operation not permitted)
?? reviews/2026-11-13-cosponsor-sort-filter-codex-high.raw.md
?? reviews/2026-11-13-cosponsor-sort-filter-codex-medium.raw.md
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-ULI1G192' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-5Ec3Pq58' (errno=Operation not permitted)
7d35662 statehood-bill: sort the member list by last name, sign-on date or state; filter by party
 src/components/MemberLookup.jsx | 39 ++++++++++++++++++++++++--
 src/data/memberSort.js          | 62 +++++++++++++++++++++++++++++++++++++++++
 2 files changed, 98 insertions(+), 3 deletions(-)

exec
/bin/zsh -lc 'cat /Users/andriathomas/Projects/andria-agent-system/shared/WORKING_GUIDE.md /Users/andriathomas/Projects/andria-agent-system/shared/REVIEW_POLICY.md' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
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
/bin/zsh -lc 'for p in /Users/AGENTS.md /Users/andriathomas/AGENTS.md /Users/andriathomas/Projects/AGENTS.md /Users/andriathomas/Projects/representdc-main/AGENTS.md /Users/andriathomas/Projects/representdc-main/.claude/AGENTS.md /Users/andriathomas/Projects/representdc-main/.claude/worktrees/AGENTS.md; do if [ -f "$p" ]; then printf '"'\\n%s\\n' \""'$p"; cat "$p"; fi; done; rg --files -g AGENTS.md -g CLAUDE.md -g DESIGN-GUARDRAILS.md -g package.json' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
CLAUDE.md
package.json
DESIGN-GUARDRAILS.md

exec
/bin/zsh -lc 'cat CLAUDE.md DESIGN-GUARDRAILS.md package.json; nl -ba src/components/MemberRow.jsx; nl -ba src/data/statehoodBill.js' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
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

exec
/bin/zsh -lc "rg -n 'member-lookup|member-search|member-sort|member-filter|lookup-|tab|sr-only|aria-live' src/StatehoodBill.css src/components src/data; rg --files -g '*test*' -g '*spec*' -g '*AGENTS*' -g '*playwright*' -g '*eslint*' -g '*vite*'" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
src/data/statehoodBill.js:365: * so the table and the headline never disagree. Final rows are never overwritten.
src/StatehoodBill.css:4:.sr-only {
src/StatehoodBill.css:265:.lookup-tabs {
src/StatehoodBill.css:273:.lookup-tab {
src/StatehoodBill.css:284:.lookup-tab[aria-selected='true'] {
src/StatehoodBill.css:289:.lookup-controls {
src/StatehoodBill.css:297:.lookup-filters {
src/StatehoodBill.css:337:.lookup-field {
src/StatehoodBill.css:346:.lookup-field select,
src/StatehoodBill.css:347:.lookup-field input {
src/StatehoodBill.css:358:.lookup-count {
src/StatehoodBill.css:364:.lookup-empty {
src/StatehoodBill.css:369:/* History table: scrolls sideways on narrow screens rather than squeezing. */
src/StatehoodBill.css:377:.history-table {
src/StatehoodBill.css:384:.history-table caption {
src/StatehoodBill.css:390:.history-table th,
src/StatehoodBill.css:391:.history-table td {
src/StatehoodBill.css:398:.history-table thead th {
src/StatehoodBill.css:403:.history-table tbody th {
src/StatehoodBill.css:408:.history-table .num {
src/StatehoodBill.css:412:.history-table tbody .num {
src/StatehoodBill.css:416:.history-table td:last-child {
src/StatehoodBill.css:450:  .lookup-controls {
src/components/TalkingPoints.jsx:79:            <div className="audience-tabs">
src/components/TalkingPoints.jsx:81:                className={`audience-tab ${activeAudience === 'allies' ? 'active' : ''}`}
src/components/TalkingPoints.jsx:87:                className={`audience-tab ${activeAudience === 'persuadable' ? 'active' : ''}`}
src/data/talkingPoints.js:23:      fullArgument: "Evidence-based traffic enforcement works: cameras [reduce speeding by 70%](https://ddot.dc.gov/page/vision-zero-initiative) and [cut fatal crashes by 30%](https://www.iihs.org/news/detail/study-red-light-cameras-cut-fatal-crashes) near schools. Communities across America—from Arizona to Ohio to Texas—use automated enforcement as a proven safety tool. Washington DC implemented cameras to address [one of the nation's highest pedestrian fatality rates](https://www.ghsa.org/resources/Pedestrians24). Here's what happened: Congress blocked DC from spending its own locally-raised tax dollars on this program. Not federal funds—DC taxpayer money that DC residents voted to spend on protecting their own children. Apply the conservative principle consistently: if a Texas town council votes for traffic cameras near schools, should federal politicians in Washington override that local decision? That's not federalism, that's federal micromanagement. DC funds its entire traffic enforcement program with local dollars, generating [zero cost to the federal budget](https://ddot.dc.gov/page/automated-traffic-enforcement). The same states' rights principle that protects your community's local decisions should apply to DC. This is about preventing preventable deaths through evidence-based policy and respecting local control—not red or blue politics."
src/data/talkingPoints.js:100:      elevatorPitch: "In 2023, Congress used a rare disapproval resolution to overturn DC's revised criminal code—the culmination of 16 years of work by judges, prosecutors, and community advocates. It was only the second time in 50 years Congress fully blocked a DC law. Now Congress is targeting DC's police accountability measures and bail reform while states across the country adopt similar policies. DC has one of the highest incarceration rates in the nation, yet Congress blocks every effort at criminal justice reform. This is taxation without representation: DC residents pay federal taxes but can't enact the criminal justice policies their elected officials support.",
src/data/talkingPoints.js:102:      fullArgument: "This is authoritarian control over the most fundamental issues of public safety and justice. In 2023, Congress passed H.J.Res. 26 to overturn DC's [Revised Criminal Code Act of 2022](https://www.congress.gov/bill/118th-congress/house-joint-resolution/26)—a comprehensive modernization that was 16 years in the making, involved judges, prosecutors, defense attorneys, and community advocates, and passed the DC Council unanimously. The Senate voted 81-14 to block it, marking [only the second time in 50 years](https://www.npr.org/2023/03/08/1161902691/d-c-crime-bill-biden-overturn) Congress fully overturned a DC law and the first time the Senate voted to do so. President Biden signed the disapproval resolution despite previously opposing congressional interference in DC affairs. The pattern continues in 2025. H.R. 5107, the [CLEAN DC Act](https://www.congress.gov/bill/119th-congress/house-bill/5107), passed the House (233-190) to repeal DC's Comprehensive Policing and Justice Reform Amendment Act of 2022—which established common-sense police accountability measures like requiring officers to consult mental health workers before using deadly force and prohibiting officers from reviewing body camera footage before writing initial incident reports. These are policies that [20 states have mandated for body cameras](https://worldpopulationreview.com/state-rankings/body-camera-laws-by-state), including Georgia, whose congressman Andrew Clyde sponsors H.R. 5107. H.R. 5214, the [District of Columbia Cash Bail Reform Act](https://www.congress.gov/bill/119th-congress/house-bill/5214), passed the House (237-179) to force DC to reinstate cash bail—overriding DC's pretrial justice reforms. Yet [Illinois eliminated cash bail entirely](https://worldpopulationreview.com/state-rankings/no-cash-bail-states) in 2023 through the Pretrial Fairness Act, New Jersey virtually eliminated it in 2017, and New York ended it for most misdemeanors and nonviolent felonies in 2020. Congress doesn't try to override any state's bail reform policies—only DC's. Here's the context: DC has [one of the highest incarceration rates in the United States](https://www.prisonpolicy.org/global/appendix_states_2024.html)—816 per 100,000 people, ranking among the top 10 jurisdictions nationally. DC's jail population is [87.4% Black](https://www.law.georgetown.edu/mcrp-journal/blog/true-justice-the-disturbing-truth-about-incarceration-in-d-c/) despite Black residents comprising 44.4% of DC's population. This disparity is driven partly by decades of congressional interventions that override local preferences for reform and restorative justice approaches. DC voters elect officials who support police accountability, bail reform, and alternative approaches to public safety—but Congress blocks every reform while DC residents have no voting representation to defend these policies. No state would tolerate federal politicians overriding 16 years of criminal justice work or forcing the state to abandon evidence-based policing reforms. We need statehood now."
src/data/talkingPoints.js:106:      oneLiner: "Congress overrode 16 years of DC criminal justice work in 2023 and now blocks police accountability measures used in 20 states—while DC has zero voting representation to defend local public safety decisions.",
src/data/talkingPoints.js:108:      elevatorPitch: "In 2023, Congress overturned DC's revised criminal code—16 years of work by local judges, prosecutors, and community stakeholders—using a disapproval resolution. Now Congress is blocking DC's police accountability policies (body cameras, mental health consultations before use of force) while 20 states have similar laws. Congress is also forcing DC to reinstate cash bail while Illinois, New Jersey, and New York have eliminated or limited cash bail without federal interference. Apply the conservative principle consistently: if your state's criminal justice reforms are decided locally, DC's should be too.",
src/data/talkingPoints.js:110:      fullArgument: "Local communities should control their own criminal justice and public safety policies. In 2023, Congress used the Congressional Review Act to overturn DC's [Revised Criminal Code Act of 2022](https://www.congress.gov/bill/118th-congress/house-joint-resolution/26)—a comprehensive modernization that took 16 years to develop and involved local judges, prosecutors, defense attorneys, and community advocates. The DC Council passed it unanimously. Congress rejected all that local expertise and community input with a single vote. Apply the conservative principle consistently: [20 states mandate body cameras for law enforcement](https://worldpopulationreview.com/state-rankings/body-camera-laws-by-state), including Colorado, Connecticut, Illinois, Maryland, New Jersey, New Mexico, and South Carolina. Georgia passed legislation requiring retention of body camera footage for specific periods. Yet H.R. 5107 would repeal DC's police accountability law that includes similar body camera policies and requirements for mental health consultation before use of deadly force. If Georgia can establish body camera policies, why can't DC? On bail reform: [Illinois eliminated cash bail entirely](https://worldpopulationreview.com/state-rankings/no-cash-bail-states) through the Pretrial Fairness Act in September 2023. New Jersey virtually eliminated cash bail in 2017. [New York ended cash bail](https://www.brennancenter.org/our-work/research-reports/facts-bail-reform-new-york-how-pretrial-detention-and-release-works-now) for most misdemeanors and nonviolent felonies in 2020—and research shows it [reduced recidivism and felony rearrests](https://www.fwd.us/news/new-york-bail-reform-success-story/). Congress doesn't try to override any of these state policies. Yet H.R. 5214 forces DC to reinstate cash bail, eliminating DC's pretrial justice reforms. Here's the context that should concern anyone who values federalism: DC has [one of the highest incarceration rates in America](https://www.prisonpolicy.org/global/appendix_states_2024.html)—816 per 100,000 people, ranking among the top 10 jurisdictions nationally. Local officials, prosecutors, and judges concluded that criminal justice reform was necessary to address this crisis. Congress overrode 16 years of their work without considering the local context or expertise. This isn't about red or blue politics—it's about whether local communities can make evidence-based criminal justice decisions with input from local law enforcement, prosecutors, judges, and residents. The same federalism principle that protects your state's criminal justice reforms should apply to DC. Congress shouldn't be micromanaging local police policies and bail procedures—especially when DC residents have zero voting representation in that same Congress."
src/data/talkingPoints.js:115:        point: "Rep. Andrew Clyde (R-GA) sponsors H.R. 5107 to repeal DC's police accountability law—yet his home state of Georgia mandates body camera footage retention and has pending legislation requiring all officers to wear body cameras",
src/data/talkingPoints.js:116:        examples: "Clyde sponsors the [CLEAN DC Act (H.R. 5107)](https://www.congress.gov/bill/119th-congress/house-bill/5107) to repeal DC's Comprehensive Policing and Justice Reform Amendment Act, which includes body camera policies and use-of-force restrictions. Yet [Georgia law requires](https://law.justia.com/codes/georgia/title-50/chapter-18/article-5/section-50-18-96/) all law enforcement departments that use body-worn cameras to retain video recordings for 180 days, with extended retention for videos involving arrests or use of force. Georgia's proposed [Transparency in Policing Act (HB325)](https://www.billtrack50.com/billdetail/1565487) would require all uniformed officers to wear body cameras by July 1, 2025. While Georgia establishes police accountability measures, Clyde blocks DC from doing the same."
src/data/categoryDetails.js:11:    summary: 'Local police accountability measures blocked or restricted',
src/data/categoryDetails.js:13:    description: `For decades, Congress has overridden DC's efforts at criminal justice reform—from mandatory minimums in the 1980s to blocking the revised criminal code in 2023. Despite DC voters electing officials who support police accountability and bail reform, Congress has repeatedly intervened to impose harsher policies rejected by local residents.
src/data/categoryDetails.js:69:DC taxpayers pay more federal taxes per capita than any state, yet Congress treats DC's local budget as a political football, forcing spending decisions that override local priorities and democratic accountability.`
src/data/statehoodPartners.js:174:      desc: 'A coalition of D.C. organizations advocating for a budget that supports racial justice and low-income communities, citing D.C.’s autonomy and statehood as deeply intertwined with achieving an equitable budget.',
src/data/myths.jsx:16:  census: 'https://www.census.gov/data/tables/time-series/demo/popest/2020s-state-total.html',
src/data/myths.jsx:18:  irs: 'https://www.irs.gov/statistics/soi-tax-stats-gross-collections-by-type-of-tax-and-state-irs-data-book-table-5',
src/data/myths.jsx:137:        Proximity isn't accountability. Not one voting member of Congress is elected by D.C.
src/data/routeMeta.js:4:// results, link previews and browser tabs all agree.
src/data/routeMeta.js:7:// h1 is a question that doesn't work as a tab title). Descriptions reuse sentences
src/components/MemberRow.jsx:13:      <span className="sr-only">{PARTY_NAMES[party]}</span>
src/components/MemberRow.jsx:44:          Official website<span className="sr-only"> of {member.name}</span> <Icon name="external-link" size={14} />
src/components/Nav.css:156:   including the "Bill tracker" text link the tablet bar used to drop. */
src/components/TalkingPoints.css:82:.audience-tabs {
src/components/TalkingPoints.css:93:.audience-tab {
src/components/TalkingPoints.css:106:.audience-tab:hover {
src/components/TalkingPoints.css:111:.audience-tab.active {
src/components/TalkingPoints.css:266:  .audience-tabs {
src/components/TalkingPoints.css:270:  .audience-tab {
src/components/MemberLookup.jsx:17:// Tabs follow the WAI-ARIA tabs pattern (arrow keys move between them); filters are a
src/components/MemberLookup.jsx:27:  const tabRefs = useRef({})
src/components/MemberLookup.jsx:67:    tabRefs.current[key]?.focus()
src/components/MemberLookup.jsx:81:      <div className="lookup-tabs" role="tablist" aria-label="Chamber">
src/components/MemberLookup.jsx:85:            ref={(el) => { tabRefs.current[c.key] = el }}
src/components/MemberLookup.jsx:87:            role="tab"
src/components/MemberLookup.jsx:88:            id={`${id}-tab-${c.key}`}
src/components/MemberLookup.jsx:91:            tabIndex={chamber === c.key ? 0 : -1}
src/components/MemberLookup.jsx:92:            className="lookup-tab"
src/components/MemberLookup.jsx:101:      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${chamber}`} className="lookup-panel">
src/components/MemberLookup.jsx:104:            ? <p className="lookup-empty">No confirmed {ordinal(bill.congress + 1)}-Congress bill linked yet.</p>
src/components/MemberLookup.jsx:108:            <div className="lookup-controls">
src/components/MemberLookup.jsx:109:              <fieldset className="lookup-filters">
src/components/MemberLookup.jsx:110:                <legend className="sr-only">Show</legend>
src/components/MemberLookup.jsx:118:              <label className="lookup-field">
src/components/MemberLookup.jsx:125:              <label className="lookup-field">
src/components/MemberLookup.jsx:132:              <label className="lookup-field">
src/components/MemberLookup.jsx:138:              <label className="lookup-field">
src/components/MemberLookup.jsx:143:            <p className="lookup-count" role="status" aria-live="polite">
reviews/2026-10-14-test-email-codex-raw.txt
reviews/2026-10-14-test-email-codex-prompt.md
eslint.config.js
vite.config.js
scripts/eval/race.test.mjs
scripts/eval/news.test.mjs
public/vite.svg

exec
/bin/zsh -lc 'git show HEAD -- src/components/MemberLookup.jsx src/data/memberSort.js && nl -ba src/components/MemberLookup.jsx && nl -ba src/data/memberSort.js' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-62ZrGZCH' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-zRbDAzv2' (errno=Operation not permitted)
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

exec
/bin/zsh -lc 'cat CLAUDE.md DESIGN-GUARDRAILS.md package.json' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
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

exec
/bin/zsh -lc "sed -n '1,200p' src/data/statehoodBill.js; cat src/components/MemberRow.jsx; sed -n '260,369p' src/StatehoodBill.css; sed -n '435,465p' src/StatehoodBill.css; rg --files public | rg 'roster|cosponsor|statehood|member'; cat eslint.config.js" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
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
import Icon from './Icon'
import { formatDate, memberTitle, seatLabel } from '../data/statehoodBill'

const PARTY_NAMES = { R: 'Republican', D: 'Democrat', I: 'Independent' }

// Neutral party badge: the letter carries the meaning (never colour alone), the full word
// is there for screen readers.
export function PartyBadge({ party }) {
  if (!party) return null
  return (
    <span className={`party-badge party-badge--${party.toLowerCase()}`}>
      <span aria-hidden="true">{party}</span>
      <span className="sr-only">{PARTY_NAMES[party]}</span>
    </span>
  )
}

/** "Rep. First Last" with badge and seat, shared by the sponsor line and member rows. */
export function MemberName({ chamber, member }) {
  return (
    <span className="member-name">
      <PartyBadge party={member.party} />
      <span>
        {memberTitle(chamber, member.state, member.votingMember)} {member.name}
        <span className="member-seat">, {seatLabel(chamber, member.state, member.district)}</span>
      </span>
    </span>
  )
}

const STATUS = {
  sponsor: () => 'Sponsor',
  signed: (date) => `Signed on ${formatDate(date, 'short')}`,
  'not-yet': () => 'Not yet',
}

export function MemberRow({ member }) {
  return (
    <li className={`member-row member-row--${member.status}`}>
      <MemberName chamber={member.chamber} member={member} />
      <span className="member-status">{STATUS[member.status](member.date)}</span>
      {member.officialWebsiteUrl ? (
        <a className="member-link" href={member.officialWebsiteUrl} target="_blank" rel="noopener noreferrer">
          Official website<span className="sr-only"> of {member.name}</span> <Icon name="external-link" size={14} />
        </a>
      ) : (
        <span className="member-link" />
      )}
    </li>
  )
}
  font-size: var(--fs-sm);
  text-align: right;
}

/* Lookup controls */
.lookup-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-1);
  border-bottom: 1px solid var(--line-2);
  margin-bottom: var(--s-4);
}

.lookup-tab {
  font: inherit;
  font-weight: 600;
  background: none;
  border: 0;
  border-bottom: 3px solid transparent;
  padding: var(--s-2) var(--s-4);
  color: var(--slate-700);
  cursor: pointer;
}

.lookup-tab[aria-selected='true'] {
  color: var(--navy);
  border-bottom-color: var(--navy);
}

.lookup-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-4);
  align-items: flex-end;
  margin-bottom: var(--s-3);
}

.lookup-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-2);
  border: 0;
  margin: 0;
  padding: 0;
}

.filter-chip {
  position: relative;
  cursor: pointer;
  border-radius: var(--r-pill);
}

.filter-chip input {
  position: absolute;
  opacity: 0;
  inset: 0;
  margin: 0;
  cursor: pointer;
}

.filter-chip span {
  display: inline-block;
  padding: var(--s-1) var(--s-3);
  border: 1px solid var(--line-2);
  border-radius: var(--r-pill);
  background: var(--surface);
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--slate-700);
}

.filter-chip input:checked + span {
  background: var(--navy);
  border-color: var(--navy);
  color: var(--white);
}

.lookup-field {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--slate-700);
}

.lookup-field select,
.lookup-field input {
  font: inherit;
  font-weight: 400;
  padding: var(--s-1) var(--s-2);
  border: 1px solid var(--line-2);
  border-radius: var(--r-sm);
  background: var(--surface);
  color: var(--ink);
  min-height: 2.25rem;
}

.lookup-count {
  font-size: var(--fs-sm);
  color: var(--slate-500);
  margin: 0 0 var(--s-2);
}

.lookup-empty {
  font-weight: 700;
  color: var(--navy);
}

/* History table: scrolls sideways on narrow screens rather than squeezing. */
  .bill-facts > div {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .recent-row,
  .member-row {
    grid-template-columns: 1fr;
    gap: var(--s-1);
  }

  .member-link {
    text-align: left;
  }

  .lookup-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .count-number {
    font-size: var(--fs-h1);
  }
}
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

codex
The hooks are called unconditionally, the new selects have labels, and the existing result-count live region remains in place. I’m checking name formats and chamber-switch behavior next for cases the code may mishandle.
exec
/bin/zsh -lc "sed -n '200,265p' src/data/statehoodBill.js; rg -n 'roster|cosponsors|statehood' src/hooks src/StatehoodBill.jsx scripts --glob '"'!*.test.mjs'"' --glob '"'!package-lock.json'"'; test -d node_modules && echo node_modules-present; git log -3 --oneline; rg -n 'focus-visible|filter-chip' src/*.css" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
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
src/StatehoodBill.jsx:8:import { formatDate, historyWithLive, ordinal, signedThisMonth } from './data/statehoodBill'
src/StatehoodBill.jsx:13:// /statehood-bill — who has cosponsored the Washington, D.C. Admission Act. Every number
src/StatehoodBill.jsx:19:// (reviews/2026-11-10-statehood-bill-what-it-is-codex-high.raw.md): it describes the
src/StatehoodBill.jsx:63:  const { cosponsors, nonVoting } = bill.totals
src/StatehoodBill.jsx:70:        {cosponsors}
src/StatehoodBill.jsx:71:        <span className="count-unit">{cosponsors === 1 ? ' cosponsor' : ' cosponsors'}</span>
src/StatehoodBill.jsx:83:    return recent.latestDate ? <p className="section-note">No new cosponsors since {formatDate(recent.latestDate)}.</p> : null
src/StatehoodBill.jsx:88:      <p className="section-note recent-count">{n} new {n === 1 ? 'cosponsor' : 'cosponsors'} this month.</p>
src/StatehoodBill.jsx:114:            <th scope="col" className="num">House cosponsors</th>
src/StatehoodBill.jsx:116:            <th scope="col" className="num">Senate cosponsors</th>
src/StatehoodBill.jsx:125:              <td className="num">{r.house?.cosponsors ?? ''}</td>
src/StatehoodBill.jsx:127:              <td className="num">{r.senate?.cosponsors ?? ''}</td>
src/StatehoodBill.jsx:139:  const { cosponsors, history, rosters } = useStatehoodBillData()
src/StatehoodBill.jsx:140:  const bills = cosponsors.data
src/StatehoodBill.jsx:162:      <main className="impact-section statehood-bill">
src/StatehoodBill.jsx:171:                  Admission Act does and how statehood is granted, drafted from /the-case. Production
src/StatehoodBill.jsx:187:              <h2 id="sb-counts">Recorded cosponsors</h2>
src/StatehoodBill.jsx:201:          {bills && Object.values(rosters).some((r) => r.data) && (
src/StatehoodBill.jsx:204:              <MemberLookup bills={bills} rosters={rosters} />
scripts/fetch-news.mjs:4: * Builds and publishes the D.C. statehood news digest for www.representdc.org/news.
src/hooks/useStatehoodBillData.js:3:import { parseCosponsors, parseMembers, parseHistory } from '../data/statehoodBill'
src/hooks/useStatehoodBillData.js:5:// The tracker files behind /statehood-bill. Each loads and validates on its own, so a
src/hooks/useStatehoodBillData.js:6:// missing roster hides only the lookup, not the counts. No fallback values: a section
src/hooks/useStatehoodBillData.js:18:    const { fixture } = await import('../fixtures/statehoodBill.js')
src/hooks/useStatehoodBillData.js:32:    console.warn(`statehood-bill: /api/${name}.json unavailable (${error.message})`)
src/hooks/useStatehoodBillData.js:40:  const [cosponsors, setCosponsors] = useState(LOADING)
src/hooks/useStatehoodBillData.js:43:  const [rosters, setRosters] = useState({})
src/hooks/useStatehoodBillData.js:47:    load('statehood-cosponsors', parseCosponsors).then((r) => !cancelled && setCosponsors(r))
src/hooks/useStatehoodBillData.js:48:    load('statehood-bill-history', parseHistory).then((r) => !cancelled && setHistory(r))
src/hooks/useStatehoodBillData.js:54:  const bills = cosponsors.data
src/hooks/useStatehoodBillData.js:71:  return { cosponsors, history, rosters }
scripts/news/judge.mjs:23:J3 temporal — D.C. statehood news moves slowly, so "currently", "ongoing", "recent" and the present tense are FINE for anything within roughly the last two months. Do not flag ordinary tense or word choice. Flag only outright errors: (a) describing something as pending, underway or under consideration when a headline shows it was already decided, passed, rejected or completed; (b) a date, duration or sequence the headlines contradict; (c) present-tense claims resting only on an article more than about two months old.
scripts/news/judge.mjs:27:  return `You are checking a short news-digest paragraph written for a D.C. statehood website, against the only source it was given: the headlines below, with their publication dates. Today is ${new Date(now).toISOString().slice(0, 10)}.
scripts/eval/news-golden.json:13:        { "title": "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states", "source": "The 51st", "pubDate": "Mon, 24 Aug 2026 21:28:39 GMT" },
scripts/eval/news-golden.json:16:      "publishedBody": "More than a year after events in January 2021, National Guard troops continue to patrol D.C. as civil rights advocates call for their withdrawal, while statehood supporters are intensifying advocacy efforts ahead of midterm elections, including gaining commitments from elected officials.",
scripts/eval/news-golden.json:28:        { "title": "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states", "source": "The 51st", "pubDate": "Mon, 24 Aug 2026 21:28:39 GMT" },
scripts/eval/news-golden.json:32:      "publishedBody": "D.C. statehood advocates are marking the anniversary of National Guard deployment to the District while intensifying advocacy efforts ahead of the midterm elections. The deployment, which lasted a year, is being highlighted by advocacy groups as evidence for why D.C. needs greater autonomy.",
scripts/eval/news-golden.json:45:        { "title": "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states", "source": "The 51st", "pubDate": "Mon, 24 Aug 2026 21:28:39 GMT" },
scripts/eval/news-golden.json:49:      "publishedBody": "Recent federal interventions in D.C.—including a takeover and National Guard deployment—have prompted advocates to emphasize how statehood would protect the District, and a House committee is currently considering proposals that advocates say would further undermine D.C.'s fiscal independence.",
scripts/eval/news-golden.json:81:      "publishedBody": "Separately, advocates have pointed to federal control of DC's National Guard and constraints on the District's fiscal independence as reasons why statehood remains urgent, citing a federal takeover from a year ago and ongoing restrictions on how DC can use its budget.",
scripts/eval/news-golden.json:96:      "publishedBody": "A senator pledged in late August to prioritize D.C. statehood. In July, DC Vote urged a House committee to reject what the group described as a sweeping attack on the District's fiscal independence.",
scripts/eval/news-golden.json:124:      "publishedBody": "The federal takeover proves that D.C. can never be safe without statehood.",
scripts/eval/news-golden.json:151:        { "title": "Norton reintroduces D.C. statehood bill", "source": "NOTUS", "pubDate": "Wed, 09 Sep 2026 14:00:00 GMT" }
scripts/news/summarize.mjs:77:        content: `You are a relevance filter for a DC statehood and home rule advocacy website (www.representdc.org).
scripts/news/summarize.mjs:80:- DC statehood
scripts/news/summarize.mjs:89:- Human interest stories unrelated to DC autonomy or statehood
scripts/news/summarize.mjs:90:- Multi-story roundups or digests (titles listing several unrelated stories, often ending "and More"), unless the roundup as a whole is about statehood or home rule
scripts/news/summarize.mjs:124:        content: `You write a short neutral news-digest summary for a DC statehood advocacy website (www.representdc.org). Below are the current DC statehood/home-rule headlines the site is showing, each with its publication date and age.
scripts/news/feeds.mjs:36:  // Congress-specific, not DC-specific — relevant because most DC-statehood action
scripts/news/closers.mjs:33:      "Without statehood, Congress reviews the District's laws and can vote to repeal " +
scripts/news/closers.mjs:57:      "Without statehood, the District's budget must clear a congressional review " +
scripts/news/closers.mjs:77:      "Without statehood, the District's National Guard answers to the President, not " +
scripts/news/closers.mjs:95:      'Without statehood, D.C. residents have no senators, and their one delegate to ' +
scripts/eval/fixtures/history-summaries.json:7:      "summary": "The Trump administration is challenging D.C.'s tuition policy for undocumented immigrants, while statehood advocates point to recent federal interventions—including a National Guard deployment and fiscal constraints—as evidence for the urgency of local autonomy. A senator has pledged to prioritize D.C. statehood, and advocates are urging Congress to reject further restrictions on the District's financial independence. Without statehood, Congress can override any law the District passes and can restrict how D.C. spends its own local tax revenue.",
scripts/eval/fixtures/history-summaries.json:8:      "body": "The Trump administration is challenging D.C.'s tuition policy for undocumented immigrants, while statehood advocates point to recent federal interventions—including a National Guard deployment and fiscal constraints—as evidence for the urgency of local autonomy. A senator has pledged to prioritize D.C. statehood, and advocates are urging Congress to reject further restrictions on the District's financial independence.",
scripts/eval/fixtures/history-summaries.json:9:      "closer": "Without statehood, Congress can override any law the District passes and can restrict how D.C. spends its own local tax revenue.",
scripts/eval/fixtures/history-summaries.json:33:      "summary": "The Trump administration is challenging D.C.'s tuition policies for undocumented immigrants while advocates continue highlighting federal interference in District affairs, from National Guard deployments to fiscal constraints. Meanwhile, a senator has pledged to prioritize D.C. statehood, and advocates are urging Congress to protect D.C.'s limited financial independence from further federal restrictions. Without statehood, Congress can override any law the District passes and can restrict how D.C. spends its own local tax revenue.",
scripts/eval/fixtures/history-summaries.json:34:      "body": "The Trump administration is challenging D.C.'s tuition policies for undocumented immigrants while advocates continue highlighting federal interference in District affairs, from National Guard deployments to fiscal constraints. Meanwhile, a senator has pledged to prioritize D.C. statehood, and advocates are urging Congress to protect D.C.'s limited financial independence from further federal restrictions.",
scripts/eval/fixtures/history-summaries.json:35:      "closer": "Without statehood, Congress can override any law the District passes and can restrict how D.C. spends its own local tax revenue.",
scripts/eval/fixtures/history-summaries.json:59:      "summary": "D.C. statehood advocates are intensifying their efforts ahead of the midterm elections, with a senator committing to make statehood a priority while the movement highlights recent federal interventions—including a National Guard deployment and federal fiscal oversight—as evidence of why D.C. needs greater autonomy. Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress retains the power to deploy federal troops within the District's borders.",
scripts/eval/fixtures/history-summaries.json:60:      "body": "D.C. statehood advocates are intensifying their efforts ahead of the midterm elections, with a senator committing to make statehood a priority while the movement highlights recent federal interventions—including a National Guard deployment and federal fiscal oversight—as evidence of why D.C. needs greater autonomy.",
scripts/eval/fixtures/history-summaries.json:61:      "closer": "Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress retains the power to deploy federal troops within the District's borders.",
scripts/eval/fixtures/history-summaries.json:63:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:85:      "summary": "D.C. statehood advocates are intensifying their push at multiple levels, with efforts targeting the midterm elections, securing commitments from federal lawmakers, and responding to recent events including a federal takeover and National Guard deployment that they argue demonstrate the need for greater local autonomy. The movement is also working to protect D.C.'s fiscal independence against congressional action.\n\nWithout statehood, Congress can override any law the District passes and can unilaterally take control of D.C.'s government and finances.",
scripts/eval/fixtures/history-summaries.json:86:      "body": "D.C. statehood advocates are intensifying their push at multiple levels, with efforts targeting the midterm elections, securing commitments from federal lawmakers, and responding to recent events including a federal takeover and National Guard deployment that they argue demonstrate the need for greater local autonomy. The movement is also working to protect D.C.'s fiscal independence against congressional action.",
scripts/eval/fixtures/history-summaries.json:87:      "closer": "Without statehood, Congress can override any law the District passes and can unilaterally take control of D.C.'s government and finances.",
scripts/eval/fixtures/history-summaries.json:89:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:111:      "summary": "More than a year after National Guard troops were deployed to Washington, D.C., they continue to patrol the city while advocates call for their removal and argue the situation underscores the need for statehood. Meanwhile, D.C. statehood supporters are intensifying efforts ahead of the midterm elections, with some elected officials committing to make the issue a priority. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:112:      "body": "More than a year after National Guard troops were deployed to Washington, D.C., they continue to patrol the city while advocates call for their removal and argue the situation underscores the need for statehood. Meanwhile, D.C. statehood supporters are intensifying efforts ahead of the midterm elections, with some elected officials committing to make the issue a priority.",
scripts/eval/fixtures/history-summaries.json:113:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:116:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:137:      "summary": "Congressional restrictions on D.C.'s budget and operations continue to affect the District's institutions and governance, while advocates are intensifying statehood efforts heading into the midterm elections and beyond. The presence of National Guard troops in D.C. remains a point of contention as civil liberties organizations demand withdrawal, and statehood supporters are working to build momentum both locally and nationally.\n\nWithout statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:138:      "body": "Congressional restrictions on D.C.'s budget and operations continue to affect the District's institutions and governance, while advocates are intensifying statehood efforts heading into the midterm elections and beyond. The presence of National Guard troops in D.C. remains a point of contention as civil liberties organizations demand withdrawal, and statehood supporters are working to build momentum both locally and nationally.",
scripts/eval/fixtures/history-summaries.json:139:      "closer": "Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:144:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:163:      "summary": "More than a year after National Guard troops were deployed to Washington, D.C., the forces remain on patrol as advocates and civil rights organizations continue calling for their removal and emphasizing the need for statehood. Meanwhile, D.C. statehood supporters are expanding their advocacy efforts to other states ahead of the midterm elections, with some elected officials pledging to prioritize the issue. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:164:      "body": "More than a year after National Guard troops were deployed to Washington, D.C., the forces remain on patrol as advocates and civil rights organizations continue calling for their removal and emphasizing the need for statehood. Meanwhile, D.C. statehood supporters are expanding their advocacy efforts to other states ahead of the midterm elections, with some elected officials pledging to prioritize the issue.",
scripts/eval/fixtures/history-summaries.json:165:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:168:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:189:      "summary": "More than a year after National Guard troops were deployed to Washington, D.C., they continue to patrol the city while advocates call for their removal and emphasize the need for statehood. Meanwhile, statehood supporters are intensifying efforts ahead of the midterm elections, with some lawmakers committing to make D.C. statehood a priority. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:190:      "body": "More than a year after National Guard troops were deployed to Washington, D.C., they continue to patrol the city while advocates call for their removal and emphasize the need for statehood. Meanwhile, statehood supporters are intensifying efforts ahead of the midterm elections, with some lawmakers committing to make D.C. statehood a priority.",
scripts/eval/fixtures/history-summaries.json:191:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:194:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:215:      "summary": "More than a year after National Guard troops were deployed to D.C., questions persist about their continued presence and role in the city, while advocacy efforts for D.C. statehood are intensifying ahead of midterm elections and gaining support from lawmakers. The statehood movement is framing these issues as evidence of the District's lack of autonomy and control over its own affairs. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:216:      "body": "More than a year after National Guard troops were deployed to D.C., questions persist about their continued presence and role in the city, while advocacy efforts for D.C. statehood are intensifying ahead of midterm elections and gaining support from lawmakers. The statehood movement is framing these issues as evidence of the District's lack of autonomy and control over its own affairs.",
scripts/eval/fixtures/history-summaries.json:217:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:221:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:241:      "summary": "D.C. is advancing on multiple fronts related to local control and representation, including efforts to manage armory land near RFK Stadium while National Guard troops remain deployed in the district more than a year after their arrival. As midterm elections approach, statehood advocates are intensifying their campaign both locally and in other states, with at least one senator committing to prioritize the issue. Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:242:      "body": "D.C. is advancing on multiple fronts related to local control and representation, including efforts to manage armory land near RFK Stadium while National Guard troops remain deployed in the district more than a year after their arrival. As midterm elections approach, statehood advocates are intensifying their campaign both locally and in other states, with at least one senator committing to prioritize the issue.",
scripts/eval/fixtures/history-summaries.json:243:      "closer": "Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:248:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:267:      "summary": "More than a year after National Guard troops were deployed to D.C., the troops remain in the District as advocates call for their removal and emphasize the need for statehood, while statehood supporters are taking their push to other states ahead of the midterm elections and securing commitments from elected officials. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:268:      "body": "More than a year after National Guard troops were deployed to D.C., the troops remain in the District as advocates call for their removal and emphasize the need for statehood, while statehood supporters are taking their push to other states ahead of the midterm elections and securing commitments from elected officials.",
scripts/eval/fixtures/history-summaries.json:269:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:272:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:293:      "summary": "More than a year after events in January 2021, National Guard troops continue to patrol D.C. as civil rights advocates call for their withdrawal, while statehood supporters are intensifying advocacy efforts ahead of midterm elections, including gaining commitments from elected officials. The headlines reflect ongoing concerns about federal control of D.C. and renewed momentum for the statehood movement. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:294:      "body": "More than a year after events in January 2021, National Guard troops continue to patrol D.C. as civil rights advocates call for their withdrawal, while statehood supporters are intensifying advocacy efforts ahead of midterm elections, including gaining commitments from elected officials. The headlines reflect ongoing concerns about federal control of D.C. and renewed momentum for the statehood movement.",
scripts/eval/fixtures/history-summaries.json:295:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:299:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:319:      "summary": "National Guard troops continue to remain stationed in D.C. more than a year after their deployment, with advocates arguing the situation underscores the need for statehood, while statehood supporters are working to build momentum for the cause ahead of midterm elections and securing commitments from elected officials. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:320:      "body": "National Guard troops continue to remain stationed in D.C. more than a year after their deployment, with advocates arguing the situation underscores the need for statehood, while statehood supporters are working to build momentum for the cause ahead of midterm elections and securing commitments from elected officials.",
scripts/eval/fixtures/history-summaries.json:321:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:324:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:345:      "summary": "National Guard troops continue to remain deployed in D.C. more than a year after their initial arrival, drawing scrutiny from civil liberties advocates, while statehood advocates are intensifying efforts ahead of the midterm elections and working to build support among state-level lawmakers. A U.S. senator has committed to prioritizing D.C. statehood, and advocacy organizations are framing the federal response to recent events as evidence of why local autonomy is needed.\n\nWithout statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:346:      "body": "National Guard troops continue to remain deployed in D.C. more than a year after their initial arrival, drawing scrutiny from civil liberties advocates, while statehood advocates are intensifying efforts ahead of the midterm elections and working to build support among state-level lawmakers. A U.S. senator has committed to prioritizing D.C. statehood, and advocacy organizations are framing the federal response to recent events as evidence of why local autonomy is needed.",
scripts/eval/fixtures/history-summaries.json:347:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:351:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:371:      "summary": "Statehood advocates are intensifying their push ahead of the midterm elections, with renewed focus on voting rights and recent national events underscoring their case. A senator has committed to making D.C. statehood a priority, while advocates point to federal interventions in the District—including a National Guard deployment and federal takeover—as evidence that statehood is urgently needed. Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:372:      "body": "Statehood advocates are intensifying their push ahead of the midterm elections, with renewed focus on voting rights and recent national events underscoring their case. A senator has committed to making D.C. statehood a priority, while advocates point to federal interventions in the District—including a National Guard deployment and federal takeover—as evidence that statehood is urgently needed.",
scripts/eval/fixtures/history-summaries.json:373:      "closer": "Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:376:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:397:      "summary": "National Guard troops continue to be stationed in D.C. more than a year after their deployment, while advocacy groups emphasize the need for greater local control in the District. Statehood supporters are intensifying efforts ahead of the midterm elections, including engaging support at the state level and securing commitments from elected officials. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:399:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:403:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:423:      "summary": "D.C. statehood advocates are intensifying their push as the midterm elections approach, with efforts to build support both within the District and across state lines, while recent events including a federal takeover and the deployment of National Guard troops have renewed urgency around the statehood campaign. Senator Slotkin has pledged to prioritize D.C. statehood efforts.\n\nWithout statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:424:      "body": "D.C. statehood advocates are intensifying their push as the midterm elections approach, with efforts to build support both within the District and across state lines, while recent events including a federal takeover and the deployment of National Guard troops have renewed urgency around the statehood campaign. Senator Slotkin has pledged to prioritize D.C. statehood efforts.",
scripts/eval/fixtures/history-summaries.json:425:      "closer": "Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:428:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:449:      "summary": "D.C. statehood advocates are intensifying their push for voting representation as the midterm elections approach, with organizing efforts expanding beyond the District and gaining commitments from sympathetic lawmakers. Recent events, including a federal takeover and the deployment of National Guard troops, have reinforced arguments among statehood supporters that D.C. residents lack essential protections and self-governance.\n\nWithout statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:450:      "body": "D.C. statehood advocates are intensifying their push for voting representation as the midterm elections approach, with organizing efforts expanding beyond the District and gaining commitments from sympathetic lawmakers. Recent events, including a federal takeover and the deployment of National Guard troops, have reinforced arguments among statehood supporters that D.C. residents lack essential protections and self-governance.",
scripts/eval/fixtures/history-summaries.json:451:      "closer": "Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:454:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:475:      "summary": "D.C. statehood advocates are intensifying their campaign ahead of the midterm elections, securing commitments from federal lawmakers and highlighting recent events—including the National Guard deployment and federal fiscal restrictions—as reasons why statehood is needed. The push encompasses both efforts to build support among states and pressure on Congress to protect D.C.'s limited local autonomy.\n\nWithout statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:476:      "body": "D.C. statehood advocates are intensifying their campaign ahead of the midterm elections, securing commitments from federal lawmakers and highlighting recent events—including the National Guard deployment and federal fiscal restrictions—as reasons why statehood is needed. The push encompasses both efforts to build support among states and pressure on Congress to protect D.C.'s limited local autonomy.",
scripts/eval/fixtures/history-summaries.json:477:      "closer": "Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:479:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:501:      "summary": "D.C. statehood advocates are intensifying their push ahead of the midterm elections, with efforts to build support among states and secure commitments from federal lawmakers. Recent events including federal intervention in D.C. governance and the deployment of National Guard troops have prompted advocates to argue that statehood is increasingly urgent for protecting local autonomy. Separately, advocates are working to defend D.C.'s fiscal independence against what they characterize as congressional overreach.\n\nWithout statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:502:      "body": "D.C. statehood advocates are intensifying their push ahead of the midterm elections, with efforts to build support among states and secure commitments from federal lawmakers. Recent events including federal intervention in D.C. governance and the deployment of National Guard troops have prompted advocates to argue that statehood is increasingly urgent for protecting local autonomy. Separately, advocates are working to defend D.C.'s fiscal independence against what they characterize as congressional overreach.",
scripts/eval/fixtures/history-summaries.json:503:      "closer": "Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:505:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:527:      "summary": "D.C. statehood advocates are intensifying their push ahead of the midterm elections, with supporters highlighting recent events including federal intervention and National Guard deployment as reasons statehood is urgent. A senator has committed to prioritizing D.C. statehood while advocates work to protect the District's fiscal autonomy against congressional challenges. Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any local laws the District passes.",
scripts/eval/fixtures/history-summaries.json:528:      "body": "D.C. statehood advocates are intensifying their push ahead of the midterm elections, with supporters highlighting recent events including federal intervention and National Guard deployment as reasons statehood is urgent. A senator has committed to prioritizing D.C. statehood while advocates work to protect the District's fiscal autonomy against congressional challenges.",
scripts/eval/fixtures/history-summaries.json:529:      "closer": "Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any local laws the District passes.",
scripts/eval/fixtures/history-summaries.json:531:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:553:      "summary": "D.C. statehood advocates are intensifying efforts ahead of the midterm elections, securing commitments from federal lawmakers and highlighting recent events—including the deployment of National Guard troops and threats to fiscal autonomy—as evidence for why statehood is necessary. The movement is working both within Congress and across states to build support for the cause.\n\nWithout statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:554:      "body": "D.C. statehood advocates are intensifying efforts ahead of the midterm elections, securing commitments from federal lawmakers and highlighting recent events—including the deployment of National Guard troops and threats to fiscal autonomy—as evidence for why statehood is necessary. The movement is working both within Congress and across states to build support for the cause.",
scripts/eval/fixtures/history-summaries.json:555:      "closer": "Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:557:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:579:      "summary": "D.C. statehood advocates are intensifying their push across multiple fronts, securing commitments from federal lawmakers while highlighting incidents they argue demonstrate the need for local autonomy. Recent events, including a federal takeover and National Guard deployment in D.C., are being used to underscore the urgency of statehood as advocates expand their reach into other states ahead of the midterm elections and defend D.C.'s fiscal independence against congressional challenges.\n\nWithout statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:580:      "body": "D.C. statehood advocates are intensifying their push across multiple fronts, securing commitments from federal lawmakers while highlighting incidents they argue demonstrate the need for local autonomy. Recent events, including a federal takeover and National Guard deployment in D.C., are being used to underscore the urgency of statehood as advocates expand their reach into other states ahead of the midterm elections and defend D.C.'s fiscal independence against congressional challenges.",
scripts/eval/fixtures/history-summaries.json:581:      "closer": "Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:583:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:605:      "summary": "D.C. statehood advocates are intensifying their campaign ahead of the midterm elections, with supporters in Congress pledging to prioritize the issue while pointing to recent federal interventions—including the deployment of National Guard troops and federal budget constraints—as examples of why local autonomy matters. The movement is framing statehood as essential to protecting D.C.'s fiscal and operational independence from federal overreach.\n\nWithout statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:606:      "body": "D.C. statehood advocates are intensifying their campaign ahead of the midterm elections, with supporters in Congress pledging to prioritize the issue while pointing to recent federal interventions—including the deployment of National Guard troops and federal budget constraints—as examples of why local autonomy matters. The movement is framing statehood as essential to protecting D.C.'s fiscal and operational independence from federal overreach.",
scripts/eval/fixtures/history-summaries.json:607:      "closer": "Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:609:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:631:      "summary": "D.C. statehood advocates are intensifying their efforts across multiple fronts, with campaigns targeting midterm elections and state-level support while highlighting recent federal interventions—including National Guard deployment and threats to fiscal independence—as evidence for why statehood is urgent. A senator has publicly committed to prioritizing D.C. statehood as a legislative goal. Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress retains the power to override any local law the District passes.",
scripts/eval/fixtures/history-summaries.json:632:      "body": "D.C. statehood advocates are intensifying their efforts across multiple fronts, with campaigns targeting midterm elections and state-level support while highlighting recent federal interventions—including National Guard deployment and threats to fiscal independence—as evidence for why statehood is urgent. A senator has publicly committed to prioritizing D.C. statehood as a legislative goal.",
scripts/eval/fixtures/history-summaries.json:633:      "closer": "Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress retains the power to override any local law the District passes.",
scripts/eval/fixtures/history-summaries.json:635:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:657:      "summary": "D.C. statehood advocates are intensifying their push ahead of the midterm elections, with efforts to build support among states and elected officials while pointing to recent federal interventions—including a National Guard deployment and threats to fiscal independence—as evidence for why statehood is needed. A senator has committed to making D.C. statehood a priority, while advocacy groups continue to highlight how federal control over D.C. affairs demonstrates the urgency of the cause.\n\nWithout statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:658:      "body": "D.C. statehood advocates are intensifying their push ahead of the midterm elections, with efforts to build support among states and elected officials while pointing to recent federal interventions—including a National Guard deployment and threats to fiscal independence—as evidence for why statehood is needed. A senator has committed to making D.C. statehood a priority, while advocacy groups continue to highlight how federal control over D.C. affairs demonstrates the urgency of the cause.",
scripts/eval/fixtures/history-summaries.json:659:      "closer": "Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:661:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:683:      "summary": "D.C. statehood advocates are pursuing multiple strategies to advance their cause, including mobilizing around midterm elections and securing commitments from sympathetic federal lawmakers, while also responding to recent events that they argue demonstrate the need for local autonomy. Recent federal interventions in D.C.—including a takeover and National Guard deployment—have prompted advocates to emphasize how statehood would protect the District from external federal control, and a House committee is currently considering proposals that advocates say would further undermine D.C.'s fiscal independence. Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:684:      "body": "D.C. statehood advocates are pursuing multiple strategies to advance their cause, including mobilizing around midterm elections and securing commitments from sympathetic federal lawmakers, while also responding to recent events that they argue demonstrate the need for local autonomy. Recent federal interventions in D.C.—including a takeover and National Guard deployment—have prompted advocates to emphasize how statehood would protect the District from external federal control, and a House committee is currently considering proposals that advocates say would further undermine D.C.'s fiscal independence.",
scripts/eval/fixtures/history-summaries.json:685:      "closer": "Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:687:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:709:      "summary": "D.C. statehood advocates are intensifying efforts ahead of the midterm elections, with a senator committing to prioritize the issue and organizations highlighting recent events—including federal troop deployment and threats to fiscal independence—as evidence for why statehood is urgent. These campaigns are unfolding as advocates work to build support both within Congress and across other states.\n\nWithout statehood, Congress can override any law D.C. passes and can impose restrictions on how the District spends its locally generated tax revenue.",
scripts/eval/fixtures/history-summaries.json:710:      "body": "D.C. statehood advocates are intensifying efforts ahead of the midterm elections, with a senator committing to prioritize the issue and organizations highlighting recent events—including federal troop deployment and threats to fiscal independence—as evidence for why statehood is urgent. These campaigns are unfolding as advocates work to build support both within Congress and across other states.",
scripts/eval/fixtures/history-summaries.json:711:      "closer": "Without statehood, Congress can override any law D.C. passes and can impose restrictions on how the District spends its locally generated tax revenue.",
scripts/eval/fixtures/history-summaries.json:713:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:735:      "summary": "D.C. statehood advocates are intensifying efforts ahead of the midterm elections, with a senator committing to prioritize the issue while advocates reference recent events—including a National Guard deployment and federal fiscal interventions—as evidence for why statehood is urgent. The campaign is expanding beyond D.C. to reach voters in other states, and advocates are actively opposing congressional actions that constrain the District's autonomy.\n\nWithout statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:736:      "body": "D.C. statehood advocates are intensifying efforts ahead of the midterm elections, with a senator committing to prioritize the issue while advocates reference recent events—including a National Guard deployment and federal fiscal interventions—as evidence for why statehood is urgent. The campaign is expanding beyond D.C. to reach voters in other states, and advocates are actively opposing congressional actions that constrain the District's autonomy.",
scripts/eval/fixtures/history-summaries.json:737:      "closer": "Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:739:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:761:      "summary": "D.C. statehood advocates are intensifying efforts around the midterm elections and highlighting recent federal interventions in the District, including a National Guard deployment and actions affecting D.C.'s fiscal autonomy, as reasons why statehood is urgently needed. A senator has committed to prioritizing D.C. statehood while the movement expands its outreach beyond the District.\n\nWithout statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:762:      "body": "D.C. statehood advocates are intensifying efforts around the midterm elections and highlighting recent federal interventions in the District, including a National Guard deployment and actions affecting D.C.'s fiscal autonomy, as reasons why statehood is urgently needed. A senator has committed to prioritizing D.C. statehood while the movement expands its outreach beyond the District.",
scripts/eval/fixtures/history-summaries.json:763:      "closer": "Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:765:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:787:      "summary": "D.C. statehood advocates are intensifying their efforts ahead of the midterm elections, with supporters in Congress pledging commitment to the cause while the movement expands to engage voters in other states. Recent events—including a federal takeover and the deployment of National Guard troops to the District—have prompted statehood advocates to argue that the issue has become more urgent, particularly regarding D.C.'s fiscal autonomy. Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can restrict the District's financial independence through legislation.",
scripts/eval/fixtures/history-summaries.json:788:      "body": "D.C. statehood advocates are intensifying their efforts ahead of the midterm elections, with supporters in Congress pledging commitment to the cause while the movement expands to engage voters in other states. Recent events—including a federal takeover and the deployment of National Guard troops to the District—have prompted statehood advocates to argue that the issue has become more urgent, particularly regarding D.C.'s fiscal autonomy.",
scripts/eval/fixtures/history-summaries.json:789:      "closer": "Without statehood, D.C. cannot spend its own local tax revenue until Congress approves its budget, and Congress can restrict the District's financial independence through legislation.",
scripts/eval/fixtures/history-summaries.json:791:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:813:      "summary": "D.C. statehood advocates are marking the anniversary of National Guard deployment to the District while intensifying advocacy efforts ahead of the midterm elections, including carrying the statehood message to other states and securing commitments from federal lawmakers. The deployment, which lasted a year, is being highlighted by advocacy groups as evidence for why D.C. needs greater autonomy. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:814:      "body": "D.C. statehood advocates are marking the anniversary of National Guard deployment to the District while intensifying advocacy efforts ahead of the midterm elections, including carrying the statehood message to other states and securing commitments from federal lawmakers. The deployment, which lasted a year, is being highlighted by advocacy groups as evidence for why D.C. needs greater autonomy.",
scripts/eval/fixtures/history-summaries.json:815:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:817:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:839:      "summary": "D.C. statehood advocates are expanding their efforts beyond the District, taking their campaign to other states ahead of the midterm elections while seeking congressional support, and residents continue to grapple with the aftermath of National Guard deployment in the city. Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:840:      "body": "D.C. statehood advocates are expanding their efforts beyond the District, taking their campaign to other states ahead of the midterm elections while seeking congressional support, and residents continue to grapple with the aftermath of National Guard deployment in the city.",
scripts/eval/fixtures/history-summaries.json:841:      "closer": "Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:845:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:865:      "summary": "D.C. statehood advocates are intensifying their grassroots efforts ahead of the midterm elections, with Council members and advocacy groups traveling beyond the District to build support for statehood while also highlighting the consequences of federal control over D.C.'s security. A senator has committed to prioritizing D.C. statehood in upcoming legislative work. Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:866:      "body": "D.C. statehood advocates are intensifying their grassroots efforts ahead of the midterm elections, with Council members and advocacy groups traveling beyond the District to build support for statehood while also highlighting the consequences of federal control over D.C.'s security. A senator has committed to prioritizing D.C. statehood in upcoming legislative work.",
scripts/eval/fixtures/history-summaries.json:867:      "closer": "Without statehood, D.C. residents have no voting representation in Congress, and Congress can override any law the District passes.",
scripts/eval/fixtures/history-summaries.json:871:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:891:      "summary": "D.C. statehood advocates are advancing their campaign ahead of the midterm elections, with some lawmakers pledging support for the cause. Recent events, including a federal takeover and National Guard deployment in the District, have intensified calls for statehood as a means to protect D.C.'s autonomy. Without statehood, Congress can override any law the District passes and can intervene directly in D.C. governance, including deploying federal troops within the District's borders.",
scripts/eval/fixtures/history-summaries.json:892:      "body": "D.C. statehood advocates are advancing their campaign ahead of the midterm elections, with some lawmakers pledging support for the cause. Recent events, including a federal takeover and National Guard deployment in the District, have intensified calls for statehood as a means to protect D.C.'s autonomy.",
scripts/eval/fixtures/history-summaries.json:893:      "closer": "Without statehood, Congress can override any law the District passes and can intervene directly in D.C. governance, including deploying federal troops within the District's borders.",
scripts/eval/fixtures/history-summaries.json:895:        "Eyeing the midterm elections, D.C. is taking the fight for statehood to the states",
scripts/eval/fixtures/history-summaries.json:917:      "summary": "A senator has committed to prioritizing D.C. statehood, while advocates mark the anniversary of the National Guard deployment to the District and warn against federal actions that would further restrict D.C.'s fiscal autonomy. These developments reflect ongoing advocacy efforts around what supporters describe as federal overreach into D.C.'s governance. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:918:      "body": "A senator has committed to prioritizing D.C. statehood, while advocates mark the anniversary of the National Guard deployment to the District and warn against federal actions that would further restrict D.C.'s fiscal autonomy. These developments reflect ongoing advocacy efforts around what supporters describe as federal overreach into D.C.'s governance.",
scripts/eval/fixtures/history-summaries.json:919:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:943:      "summary": "A year after the National Guard deployment in D.C., advocacy groups are highlighting how federal control over the District's security and finances underscores the need for statehood. The coverage marks the anniversary of the deployment while pointing to ongoing concerns about D.C.'s fiscal independence and federal authority over local matters. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:944:      "body": "A year after the National Guard deployment in D.C., advocacy groups are highlighting how federal control over the District's security and finances underscores the need for statehood. The coverage marks the anniversary of the deployment while pointing to ongoing concerns about D.C.'s fiscal independence and federal authority over local matters.",
scripts/eval/fixtures/history-summaries.json:945:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:969:      "summary": "A year after the deployment of National Guard troops to Washington, D.C., advocacy groups are highlighting the incident as evidence of the need for statehood, while separately opposing what they characterize as federal threats to the District's fiscal independence. The coverage underscores ongoing concerns about federal control over D.C.'s governance and resources.\n\nWithout statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:970:      "body": "A year after the deployment of National Guard troops to Washington, D.C., advocacy groups are highlighting the incident as evidence of the need for statehood, while separately opposing what they characterize as federal threats to the District's fiscal independence. The coverage underscores ongoing concerns about federal control over D.C.'s governance and resources.",
scripts/eval/fixtures/history-summaries.json:971:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:995:      "summary": "Recent events involving federal deployment of National Guard troops and federal intervention in D.C. governance have renewed focus on the District's lack of local autonomy. Advocacy groups are highlighting instances where federal control has overridden local decision-making, while also urging Congress to protect D.C.'s fiscal independence against legislative challenges. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:997:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1021:      "summary": "A year after federal deployment of National Guard troops to Washington, D.C., advocacy groups are highlighting the incident as evidence for the need for statehood, while separately opposing what they characterize as a congressional attack on the District's fiscal independence. The coverage underscores ongoing concerns about federal control over D.C.'s governance and resources.\n\nWithout statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1022:      "body": "A year after federal deployment of National Guard troops to Washington, D.C., advocacy groups are highlighting the incident as evidence for the need for statehood, while separately opposing what they characterize as a congressional attack on the District's fiscal independence. The coverage underscores ongoing concerns about federal control over D.C.'s governance and resources.",
scripts/eval/fixtures/history-summaries.json:1023:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1047:      "summary": "A year after the National Guard deployment in Washington, D.C., advocacy groups are highlighting how federal control over the District's affairs underscores the need for statehood, with recent events continuing to demonstrate federal oversight of D.C.'s operations and autonomy. DC Vote is also urging lawmakers to reject measures that would further limit the District's fiscal independence. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1048:      "body": "A year after the National Guard deployment in Washington, D.C., advocacy groups are highlighting how federal control over the District's affairs underscores the need for statehood, with recent events continuing to demonstrate federal oversight of D.C.'s operations and autonomy. DC Vote is also urging lawmakers to reject measures that would further limit the District's fiscal independence.",
scripts/eval/fixtures/history-summaries.json:1049:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1073:      "summary": "A year after the National Guard deployment in Washington, D.C., advocacy groups are highlighting federal control over the District as a central argument for statehood, while also opposing what they characterize as a federal attack on D.C.'s fiscal independence. The coverage underscores how both military deployment decisions and budget authority remain subject to federal oversight rather than local District control. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1074:      "body": "A year after the National Guard deployment in Washington, D.C., advocacy groups are highlighting federal control over the District as a central argument for statehood, while also opposing what they characterize as a federal attack on D.C.'s fiscal independence. The coverage underscores how both military deployment decisions and budget authority remain subject to federal oversight rather than local District control.",
scripts/eval/fixtures/history-summaries.json:1075:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1099:      "summary": "The headlines reflect on the one-year anniversary of National Guard deployment to D.C. and ongoing concerns about federal control, with advocacy groups emphasizing how these events demonstrate the need for statehood. Separately, D.C. Vote is opposing federal efforts to restrict the District's fiscal independence. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1100:      "body": "The headlines reflect on the one-year anniversary of National Guard deployment to D.C. and ongoing concerns about federal control, with advocacy groups emphasizing how these events demonstrate the need for statehood. Separately, D.C. Vote is opposing federal efforts to restrict the District's fiscal independence.",
scripts/eval/fixtures/history-summaries.json:1101:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1125:      "summary": "The headlines reflect ongoing concerns about federal control over D.C., including the deployment of National Guard troops a year ago and current threats to the District's fiscal independence. Advocates are using these events to underscore what they see as the necessity of statehood to prevent future federal overreach. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1126:      "body": "The headlines reflect ongoing concerns about federal control over D.C., including the deployment of National Guard troops a year ago and current threats to the District's fiscal independence. Advocates are using these events to underscore what they see as the necessity of statehood to prevent future federal overreach.",
scripts/eval/fixtures/history-summaries.json:1127:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1151:      "summary": "Recent events involving federal deployment of National Guard troops to Washington, D.C. and federal control over the District's finances have renewed advocacy focus on D.C. statehood as a response to federal overreach. D.C. statehood advocates are highlighting instances where federal authority has superseded local control, underscoring what they characterize as the urgency of granting D.C. residents full self-governance.\n\nWithout statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1152:      "body": "Recent events involving federal deployment of National Guard troops to Washington, D.C. and federal control over the District's finances have renewed advocacy focus on D.C. statehood as a response to federal overreach. D.C. statehood advocates are highlighting instances where federal authority has superseded local control, underscoring what they characterize as the urgency of granting D.C. residents full self-governance.",
scripts/eval/fixtures/history-summaries.json:1153:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1177:      "summary": "A year after federal deployment of National Guard troops to D.C., advocacy groups are highlighting the incident as evidence of why the District needs statehood, while separately pushing back against what they characterize as congressional threats to D.C.'s fiscal independence. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1178:      "body": "A year after federal deployment of National Guard troops to D.C., advocacy groups are highlighting the incident as evidence of why the District needs statehood, while separately pushing back against what they characterize as congressional threats to D.C.'s fiscal independence.",
scripts/eval/fixtures/history-summaries.json:1179:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1203:      "summary": "A year after federal troops were deployed to the District, advocacy groups are pointing to the episode as evidence that D.C. needs greater autonomy over its own affairs, while also highlighting ongoing threats to the District's limited fiscal control. The coverage reflects concerns about federal overreach and the constraints on local decision-making that D.C. faces. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1205:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1229:      "summary": "A year after federal deployment of National Guard troops to Washington, D.C., advocacy groups are highlighting the incident as evidence for the need for statehood, while separately raising concerns about federal efforts to limit the District's fiscal independence. The coverage reflects ongoing tensions around federal authority over the District's governance and operations.\n\nWithout statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1230:      "body": "A year after federal deployment of National Guard troops to Washington, D.C., advocacy groups are highlighting the incident as evidence for the need for statehood, while separately raising concerns about federal efforts to limit the District's fiscal independence. The coverage reflects ongoing tensions around federal authority over the District's governance and operations.",
scripts/eval/fixtures/history-summaries.json:1231:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1255:      "summary": "A year after National Guard troops were deployed to Washington, D.C., advocacy groups are highlighting the deployment as evidence for why statehood matters, while separately, a proposed sleeping ban at the MLK Library and threats to D.C.'s fiscal independence have drawn warnings from local advocates. The stories reflect ongoing concerns about federal control over D.C. governance and policy.\n\nWithout statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1256:      "body": "A year after National Guard troops were deployed to Washington, D.C., advocacy groups are highlighting the deployment as evidence for why statehood matters, while separately, a proposed sleeping ban at the MLK Library and threats to D.C.'s fiscal independence have drawn warnings from local advocates. The stories reflect ongoing concerns about federal control over D.C. governance and policy.",
scripts/eval/fixtures/history-summaries.json:1257:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1281:      "summary": "A year after the National Guard deployment in Washington, D.C., advocacy groups are highlighting the incident as evidence for why D.C. statehood is necessary, pointing to both the federal military presence and threats to the District's fiscal independence. The coverage reflects ongoing concerns about federal control over D.C.'s affairs and calls for greater local autonomy.\n\nWithout statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1282:      "body": "A year after the National Guard deployment in Washington, D.C., advocacy groups are highlighting the incident as evidence for why D.C. statehood is necessary, pointing to both the federal military presence and threats to the District's fiscal independence. The coverage reflects ongoing concerns about federal control over D.C.'s affairs and calls for greater local autonomy.",
scripts/eval/fixtures/history-summaries.json:1283:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1307:      "summary": "A year after National Guard troops were deployed to Washington, D.C., the District continues to grapple with questions about federal control over its territory and resources. The D.C. Council's efforts to address the occupation have drawn criticism from the Department of Justice, while statehood advocates cite the episode as evidence of D.C.'s vulnerability to federal overreach. Additionally, the District faces threats to its fiscal independence, prompting renewed calls for statehood.\n\nWithout statehood, D.C. cannot control its own National Guard and cannot refuse the deployment of federal or other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1308:      "body": "A year after National Guard troops were deployed to Washington, D.C., the District continues to grapple with questions about federal control over its territory and resources. The D.C. Council's efforts to address the occupation have drawn criticism from the Department of Justice, while statehood advocates cite the episode as evidence of D.C.'s vulnerability to federal overreach. Additionally, the District faces threats to its fiscal independence, prompting renewed calls for statehood.",
scripts/eval/fixtures/history-summaries.json:1309:      "closer": "Without statehood, D.C. cannot control its own National Guard and cannot refuse the deployment of federal or other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1333:      "summary": "The District continues grappling with the aftermath of a year-long National Guard deployment, with advocacy groups citing the federal military presence as evidence for statehood, while the Department of Justice has opposed the D.C. Council's efforts to demand withdrawal. Separately, D.C. Vote is pushing back against what it characterizes as a congressional threat to the District's fiscal independence. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1334:      "body": "The District continues grappling with the aftermath of a year-long National Guard deployment, with advocacy groups citing the federal military presence as evidence for statehood, while the Department of Justice has opposed the D.C. Council's efforts to demand withdrawal. Separately, D.C. Vote is pushing back against what it characterizes as a congressional threat to the District's fiscal independence.",
scripts/eval/fixtures/history-summaries.json:1335:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1359:      "summary": "A year after federal deployment of National Guard troops to Washington, D.C., the District continues to grapple with questions about federal control and local autonomy, with the DOJ challenging the D.C. Council's authority while advocacy groups cite the incident as evidence for statehood. The situation has also prompted debate over D.C.'s fiscal independence as Congress considers measures that could further restrict local control.\n\nWithout statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1360:      "body": "A year after federal deployment of National Guard troops to Washington, D.C., the District continues to grapple with questions about federal control and local autonomy, with the DOJ challenging the D.C. Council's authority while advocacy groups cite the incident as evidence for statehood. The situation has also prompted debate over D.C.'s fiscal independence as Congress considers measures that could further restrict local control.",
scripts/eval/fixtures/history-summaries.json:1361:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1385:      "summary": "A year after National Guard troops were deployed to Washington, D.C., the District continues to grapple with the aftermath, including ongoing disputes between the D.C. Council and the Department of Justice over the troops' presence and removal. The incident has intensified advocacy arguments that D.C.'s lack of control over federal forces and its fiscal constraints underscore the need for statehood. Without statehood, D.C. cannot control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1386:      "body": "A year after National Guard troops were deployed to Washington, D.C., the District continues to grapple with the aftermath, including ongoing disputes between the D.C. Council and the Department of Justice over the troops' presence and removal. The incident has intensified advocacy arguments that D.C.'s lack of control over federal forces and its fiscal constraints underscore the need for statehood.",
scripts/eval/fixtures/history-summaries.json:1387:      "closer": "Without statehood, D.C. cannot control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1411:      "summary": "A year after National Guard deployment in D.C., tensions continue between local officials and federal authorities over the District's ability to govern itself, with advocates citing the incident as evidence for the need for statehood. Meanwhile, D.C. faces a separate federal challenge to its fiscal independence. Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1412:      "body": "A year after National Guard deployment in D.C., tensions continue between local officials and federal authorities over the District's ability to govern itself, with advocates citing the incident as evidence for the need for statehood. Meanwhile, D.C. faces a separate federal challenge to its fiscal independence.",
scripts/eval/fixtures/history-summaries.json:1413:      "closer": "Without statehood, D.C. does not control its own National Guard and cannot refuse the deployment of other states' troops within its borders.",
scripts/eval/fixtures/history-summaries.json:1437:      "summary": "A year after the National Guard deployment to Washington, D.C., the city continues to grapple with federal control and restrictions on local autonomy. The Department of Justice has opposed the D.C. Council's efforts to withdraw National Guard troops, while advocacy groups including DC Vote and ACLU DC are using the anniversary to highlight how the incident demonstrates the need for statehood. Additionally, DC Vote is pushing back against what it characterizes as a federal attack on the city's fiscal independence.",
scripts/eval/fixtures/history-summaries.json:1438:      "body": "A year after the National Guard deployment to Washington, D.C., the city continues to grapple with federal control and restrictions on local autonomy. The Department of Justice has opposed the D.C. Council's efforts to withdraw National Guard troops, while advocacy groups including DC Vote and ACLU DC are using the anniversary to highlight how the incident demonstrates the need for statehood. Additionally, DC Vote is pushing back against what it characterizes as a federal attack on the city's fiscal independence.",
scripts/eval/fixtures/history-summaries.json:1463:      "summary": "A year after National Guard deployment to the District, federal actions and restrictions on local governance continue to draw criticism from statehood advocates and civil rights organizations, who argue the incidents demonstrate why DC needs full self-governance. The Department of Justice has challenged the DC Council's authority to demand the Guard's withdrawal, while advocacy groups contend the episode underscores the necessity of statehood. Additionally, concerns have emerged about federal threats to DC's fiscal independence that statehood advocates are urging Congress to reject.",
scripts/eval/fixtures/history-summaries.json:1464:      "body": "A year after National Guard deployment to the District, federal actions and restrictions on local governance continue to draw criticism from statehood advocates and civil rights organizations, who argue the incidents demonstrate why DC needs full self-governance. The Department of Justice has challenged the DC Council's authority to demand the Guard's withdrawal, while advocacy groups contend the episode underscores the necessity of statehood. Additionally, concerns have emerged about federal threats to DC's fiscal independence that statehood advocates are urging Congress to reject.",
scripts/eval/fixtures/history-summaries.json:1489:      "summary": "A year after the National Guard deployment in Washington, D.C., statehood advocates and the Department of Justice are at odds over the D.C. Council's response, with advocacy groups citing the incident as evidence for why D.C. statehood is necessary. Meanwhile, a separate threat to D.C.'s fiscal independence is drawing opposition from statehood supporters urging congressional rejection of the proposed measures.",
scripts/eval/fixtures/history-summaries.json:1490:      "body": "A year after the National Guard deployment in Washington, D.C., statehood advocates and the Department of Justice are at odds over the D.C. Council's response, with advocacy groups citing the incident as evidence for why D.C. statehood is necessary. Meanwhile, a separate threat to D.C.'s fiscal independence is drawing opposition from statehood supporters urging congressional rejection of the proposed measures.",
scripts/eval/fixtures/history-summaries.json:1515:      "summary": "A year after the National Guard deployment in Washington, D.C., statehood advocates are highlighting federal control of the District as a central argument for why statehood is urgently needed. The headlines also reflect ongoing efforts to defend D.C.'s fiscal independence against what advocates describe as federal attacks on local governance. These developments underscore tensions between local D.C. authority and federal oversight that continue to shape the statehood debate.",
scripts/eval/fixtures/history-summaries.json:1516:      "body": "A year after the National Guard deployment in Washington, D.C., statehood advocates are highlighting federal control of the District as a central argument for why statehood is urgently needed. The headlines also reflect ongoing efforts to defend D.C.'s fiscal independence against what advocates describe as federal attacks on local governance. These developments underscore tensions between local D.C. authority and federal oversight that continue to shape the statehood debate.",
scripts/eval/fixtures/history-summaries.json:1541:      "summary": "One year after the National Guard deployment in Washington, D.C., statehood advocates are highlighting the incident as evidence of why the district needs greater autonomy and self-governance. Separately, DC Vote is urging lawmakers to reject legislation that would restrict the district's fiscal independence, while also pointing to recent federal control issues as underscoring the case for statehood.",
scripts/eval/fixtures/history-summaries.json:1542:      "body": "One year after the National Guard deployment in Washington, D.C., statehood advocates are highlighting the incident as evidence of why the district needs greater autonomy and self-governance. Separately, DC Vote is urging lawmakers to reject legislation that would restrict the district's fiscal independence, while also pointing to recent federal control issues as underscoring the case for statehood.",
scripts/eval/fixtures/history-summaries.json:1567:      "summary": "A year after National Guard deployment in Washington, D.C., statehood advocates are highlighting the incident as evidence for why the district needs greater autonomy and self-governance. Meanwhile, DC Vote is actively opposing federal legislative efforts that would further restrict the district's fiscal independence and control.",
scripts/eval/fixtures/history-summaries.json:1568:      "body": "A year after National Guard deployment in Washington, D.C., statehood advocates are highlighting the incident as evidence for why the district needs greater autonomy and self-governance. Meanwhile, DC Vote is actively opposing federal legislative efforts that would further restrict the district's fiscal independence and control.",
scripts/eval/fixtures/history-summaries.json:1593:      "summary": "A year after National Guard deployment in Washington, D.C., statehood advocates are emphasizing how the incident demonstrates the need for greater local autonomy and self-governance. Meanwhile, DC Vote is calling on House lawmakers to reject proposals that would further restrict the district's fiscal independence. The headlines reflect ongoing concerns about federal control over D.C. and its implications for home rule.",
scripts/eval/fixtures/history-summaries.json:1594:      "body": "A year after National Guard deployment in Washington, D.C., statehood advocates are emphasizing how the incident demonstrates the need for greater local autonomy and self-governance. Meanwhile, DC Vote is calling on House lawmakers to reject proposals that would further restrict the district's fiscal independence. The headlines reflect ongoing concerns about federal control over D.C. and its implications for home rule.",
scripts/eval/fixtures/history-summaries.json:1619:      "summary": "A federal takeover and extended National Guard deployment in Washington, D.C. are prompting statehood advocates to argue that the city needs greater self-governance and autonomy. Meanwhile, D.C. secured a legal victory against the Trump administration regarding voter rolls, and questions about home rule authority continue to arise as federal control over local matters persists.",
scripts/eval/fixtures/history-summaries.json:1620:      "body": "A federal takeover and extended National Guard deployment in Washington, D.C. are prompting statehood advocates to argue that the city needs greater self-governance and autonomy. Meanwhile, D.C. secured a legal victory against the Trump administration regarding voter rolls, and questions about home rule authority continue to arise as federal control over local matters persists.",
scripts/eval/fixtures/history-summaries.json:1645:      "summary": "DC statehood advocates are pointing to recent federal interventions in local affairs—including a federal takeover, a dispute over voter rolls, and a court case involving ballroom construction—as evidence that the city lacks sufficient autonomy to govern itself. The headlines reflect ongoing tensions between DC's local authority and federal oversight, with supporters arguing these situations underscore the need for statehood.",
scripts/eval/fixtures/history-summaries.json:1646:      "body": "DC statehood advocates are pointing to recent federal interventions in local affairs—including a federal takeover, a dispute over voter rolls, and a court case involving ballroom construction—as evidence that the city lacks sufficient autonomy to govern itself. The headlines reflect ongoing tensions between DC's local authority and federal oversight, with supporters arguing these situations underscore the need for statehood.",
scripts/eval/fixtures/history-summaries.json:1671:      "summary": "The District is facing multiple challenges to its autonomy, with recent developments highlighting federal control over DC affairs and threats to its fiscal independence. DC has secured a legal victory regarding voter rolls against the Trump Administration, while advocacy groups emphasize how federal intervention in DC governance underscores the ongoing case for statehood.",
scripts/eval/fixtures/history-summaries.json:1672:      "body": "The District is facing multiple challenges to its autonomy, with recent developments highlighting federal control over DC affairs and threats to its fiscal independence. DC has secured a legal victory regarding voter rolls against the Trump Administration, while advocacy groups emphasize how federal intervention in DC governance underscores the ongoing case for statehood.",
scripts/eval/fixtures/history-summaries.json:1697:      "summary": "D.C. has secured a victory against the Trump Administration regarding voter rolls, while advocates continue highlighting concerns about federal control and threats to D.C.'s autonomy. These developments underscore ongoing debates over D.C.'s fiscal independence and self-governance, with statehood proponents urging lawmakers to reject measures they view as federal overreach into local affairs.",
scripts/eval/fixtures/history-summaries.json:1698:      "body": "D.C. has secured a victory against the Trump Administration regarding voter rolls, while advocates continue highlighting concerns about federal control and threats to D.C.'s autonomy. These developments underscore ongoing debates over D.C.'s fiscal independence and self-governance, with statehood proponents urging lawmakers to reject measures they view as federal overreach into local affairs.",
scripts/eval/fixtures/history-summaries.json:1723:      "summary": "The District is engaged in multiple ongoing battles over autonomy and federal control. Recent victories include success against the Trump administration on voter rolls, while current threats to DC's fiscal independence and federal oversight of the National Guard illustrate persistent challenges to home rule. These conflicts underscore longstanding concerns about DC's limited self-governance that statehood advocates argue could be resolved through statehood.",
scripts/eval/fixtures/history-summaries.json:1724:      "body": "The District is engaged in multiple ongoing battles over autonomy and federal control. Recent victories include success against the Trump administration on voter rolls, while current threats to DC's fiscal independence and federal oversight of the National Guard illustrate persistent challenges to home rule. These conflicts underscore longstanding concerns about DC's limited self-governance that statehood advocates argue could be resolved through statehood.",
scripts/eval/fixtures/history-summaries.json:1749:      "summary": "D.C. has secured a victory against the Trump administration regarding voter rolls, while advocates continue highlighting threats to D.C.'s autonomy and fiscal independence. Recent events involving federal control of the District—including deployment of National Guard troops and a Guard-related event—have renewed calls from statehood and home rule organizations for greater local self-governance, with DC Vote urging Congress to reject measures that would limit D.C.'s fiscal authority.",
scripts/eval/fixtures/history-summaries.json:1750:      "body": "D.C. has secured a victory against the Trump administration regarding voter rolls, while advocates continue highlighting threats to D.C.'s autonomy and fiscal independence. Recent events involving federal control of the District—including deployment of National Guard troops and a Guard-related event—have renewed calls from statehood and home rule organizations for greater local self-governance, with DC Vote urging Congress to reject measures that would limit D.C.'s fiscal authority.",
scripts/eval/fixtures/history-summaries.json:1775:      "summary": "The District is navigating challenges to its autonomy on multiple fronts, including a recent victory against the Trump Administration regarding voter rolls and ongoing efforts to protect its fiscal independence from federal interference. Recent events involving federal control of DC resources and the President's comments about the city have renewed focus among advocacy groups on the need for greater home-rule protections and statehood.",
scripts/eval/fixtures/history-summaries.json:1776:      "body": "The District is navigating challenges to its autonomy on multiple fronts, including a recent victory against the Trump Administration regarding voter rolls and ongoing efforts to protect its fiscal independence from federal interference. Recent events involving federal control of DC resources and the President's comments about the city have renewed focus among advocacy groups on the need for greater home-rule protections and statehood.",
scripts/eval/fixtures/history-summaries.json:1827:      "summary": "A costly National Guard deployment in Washington is raising questions about federal control of the District, with advocates arguing the situation underscores the need for statehood and DC's fiscal independence. Multiple DC home-rule organizations are responding to recent federal actions and statements affecting the District's autonomy and governance.",
scripts/eval/fixtures/history-summaries.json:1828:      "body": "A costly National Guard deployment in Washington is raising questions about federal control of the District, with advocates arguing the situation underscores the need for statehood and DC's fiscal independence. Multiple DC home-rule organizations are responding to recent federal actions and statements affecting the District's autonomy and governance.",
scripts/eval/fixtures/history-summaries.json:1879:      "summary": "Recent developments have intensified focus on federal control over Washington, D.C., with advocates pointing to National Guard deployments and threats of federal takeover as evidence that statehood remains urgent. DC Vote has urged lawmakers to reject what it characterizes as attacks on the district's fiscal independence while highlighting federal military presence in the capital as an ongoing demonstration of limited local autonomy.",
scripts/eval/fixtures/history-summaries.json:1880:      "body": "Recent developments have intensified focus on federal control over Washington, D.C., with advocates pointing to National Guard deployments and threats of federal takeover as evidence that statehood remains urgent. DC Vote has urged lawmakers to reject what it characterizes as attacks on the district's fiscal independence while highlighting federal military presence in the capital as an ongoing demonstration of limited local autonomy.",
scripts/eval/fixtures/history-summaries.json:1905:      "summary": "Recent developments underscore ongoing tensions over federal control of Washington, D.C., with the Trump administration planning extended National Guard deployment through 2029 while advocacy groups argue these moves highlight the need for greater local autonomy. DC statehood and home-rule advocates are responding to what they characterize as federal overreach affecting the district's fiscal independence and local governance, with multiple organizations calling attention to the federal government's authority over the capital.",
scripts/eval/fixtures/history-summaries.json:1906:      "body": "Recent developments underscore ongoing tensions over federal control of Washington, D.C., with the Trump administration planning extended National Guard deployment through 2029 while advocacy groups argue these moves highlight the need for greater local autonomy. DC statehood and home-rule advocates are responding to what they characterize as federal overreach affecting the district's fiscal independence and local governance, with multiple organizations calling attention to the federal government's authority over the capital.",
scripts/eval/fixtures/history-summaries.json:1931:      "summary": "The Trump administration is proposing significant federal spending to maintain a National Guard presence in D.C. through 2029, while simultaneously advancing what DC statehood advocates characterize as threats to the district's fiscal independence and local control. DC Vote and other home-rule advocates are opposing what they describe as federal overreach into DC governance, including recent comments from the administration targeting local leadership.",
scripts/eval/fixtures/history-summaries.json:1932:      "body": "The Trump administration is proposing significant federal spending to maintain a National Guard presence in D.C. through 2029, while simultaneously advancing what DC statehood advocates characterize as threats to the district's fiscal independence and local control. DC Vote and other home-rule advocates are opposing what they describe as federal overreach into DC governance, including recent comments from the administration targeting local leadership.",
scripts/eval/fixtures/history-summaries.json:2139:      "summary": "DC statehood advocates are raising concerns about federal overreach and threats to DC's autonomy, citing recent developments involving federal military presence in the district and comments from national leadership. Multiple headlines point to growing tensions around DC's fiscal independence and local governance as the primary election approaches.",
scripts/eval/fixtures/history-summaries.json:2140:      "body": "DC statehood advocates are raising concerns about federal overreach and threats to DC's autonomy, citing recent developments involving federal military presence in the district and comments from national leadership. Multiple headlines point to growing tensions around DC's fiscal independence and local governance as the primary election approaches.",
scripts/eval/fixtures/history-summaries.json:2165:      "summary": "DC statehood and home-rule advocates are expressing concerns about federal control of the District, with recent developments including a House committee proposal affecting DC's fiscal independence, increased National Guard deployment in the capital, and statements from the Trump administration regarding federal takeover of DC. These issues have prompted DC Vote and other organizations to mobilize public response ahead of DC's primary election.",
scripts/eval/fixtures/history-summaries.json:2166:      "body": "DC statehood and home-rule advocates are expressing concerns about federal control of the District, with recent developments including a House committee proposal affecting DC's fiscal independence, increased National Guard deployment in the capital, and statements from the Trump administration regarding federal takeover of DC. These issues have prompted DC Vote and other organizations to mobilize public response ahead of DC's primary election.",
scripts/eval/fixtures/history-summaries.json:2243:      "summary": "Recent federal actions have intensified concerns about DC's autonomy, with advocates urging the House to protect the district's fiscal independence and drawing attention to expanded National Guard presence in Washington as evidence of federal control. President Trump has made public comments threatening DC takeover ahead of the district's primary election, prompting responses from local statehood organizations.",
scripts/eval/fixtures/history-summaries.json:2244:      "body": "Recent federal actions have intensified concerns about DC's autonomy, with advocates urging the House to protect the district's fiscal independence and drawing attention to expanded National Guard presence in Washington as evidence of federal control. President Trump has made public comments threatening DC takeover ahead of the district's primary election, prompting responses from local statehood organizations.",
scripts/eval/fixtures/history-summaries.json:2269:      "summary": "DC statehood advocates are raising concerns about federal control and interference in District governance, citing threats to fiscal independence, expanded National Guard presence in the city, and recent presidential comments about a potential federal takeover. Multiple statements from DC Vote suggest growing tensions between local DC interests and federal authority over the District's operations and elections.",
scripts/eval/fixtures/history-summaries.json:2270:      "body": "DC statehood advocates are raising concerns about federal control and interference in District governance, citing threats to fiscal independence, expanded National Guard presence in the city, and recent presidential comments about a potential federal takeover. Multiple statements from DC Vote suggest growing tensions between local DC interests and federal authority over the District's operations and elections.",
scripts/eval/fixtures/history-summaries.json:2347:      "summary": "DC statehood advocates are raising concerns about federal control and interference in District governance, citing recent House committee actions, National Guard deployments, and presidential statements as threats to local autonomy. The advocacy group DC Vote is urging lawmakers to protect DC's fiscal independence while calling attention to what it characterizes as expanding federal involvement in local affairs.",
scripts/eval/fixtures/history-summaries.json:2348:      "body": "DC statehood advocates are raising concerns about federal control and interference in District governance, citing recent House committee actions, National Guard deployments, and presidential statements as threats to local autonomy. The advocacy group DC Vote is urging lawmakers to protect DC's fiscal independence while calling attention to what it characterizes as expanding federal involvement in local affairs.",
scripts/eval/fixtures/history-summaries.json:2373:      "summary": "DC's home rule authority is facing renewed scrutiny from Congress as a House committee considers legislation affecting the district's tax powers, while DC statehood advocates are raising concerns about federal control and criticizing recent statements from the Trump administration regarding DC's governance and autonomy.",
scripts/eval/fixtures/history-summaries.json:2374:      "body": "DC's home rule authority is facing renewed scrutiny from Congress as a House committee considers legislation affecting the district's tax powers, while DC statehood advocates are raising concerns about federal control and criticizing recent statements from the Trump administration regarding DC's governance and autonomy.",
node_modules-present
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-vDb8lXy6' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-5JdWZ05I' (errno=Operation not permitted)
7d35662 statehood-bill: sort the member list by last name, sign-on date or state; filter by party
16d0631 Remove PR-only screenshots of /statehood-bill
ddd8abc Merge pull request #5 from antzzz10/claude/mobile-nav-and-titles-580bc2
src/StatehoodPartnerMap.css:112:.spm-chip:focus-visible {
src/StatehoodPartnerMap.css:126:.spm-chip-self:focus-visible {
src/StatehoodPartnerMap.css:129:.spm-chip:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
src/StatehoodBill.css:40:.statehood-bill a:focus-visible,
src/StatehoodBill.css:41:.statehood-bill button:focus-visible,
src/StatehoodBill.css:42:.statehood-bill select:focus-visible,
src/StatehoodBill.css:43:.statehood-bill input:focus-visible,
src/StatehoodBill.css:44:.statehood-bill .history-scroll:focus-visible,
src/StatehoodBill.css:45:.filter-chip:has(input:focus-visible) {
src/StatehoodBill.css:306:.filter-chip {
src/StatehoodBill.css:312:.filter-chip input {
src/StatehoodBill.css:320:.filter-chip span {
src/StatehoodBill.css:331:.filter-chip input:checked + span {
src/App.css:179:a.preview-card-live:focus-visible {

exec
/bin/zsh -lc "node --input-type=module <<'JS'
import assert from 'node:assert/strict'
import {lastNameKey,sortMembers,partyOptions,partyKey} from './src/data/memberSort.js'
const rows = [{name:'Zoe Adams',status:'signed',date:'2026-01-01',party:'D'}, {name:'Alex Brown',status:'signed',date:'2026-11-01',party:'R'}, {name:'Alice Adams',status:'signed',date:'2026-11-01',party:null}, {name:'Sponsor Able',status:'sponsor',date:null,party:'I'}, {name:'Nobody Aardvark',status:'not-yet',date:null,party:null}]
assert.deepEqual(sortMembers(rows,'recent').map(m=>m.name),['Alice Adams','Alex Brown','Zoe Adams','Sponsor Able','Nobody Aardvark'])
assert.deepEqual(sortMembers(rows,'name').map(m=>m.name),['Nobody Aardvark','Sponsor Able','Alice Adams','Zoe Adams','Alex Brown'])
assert.equal(sortMembers(rows,'state'),rows)
assert.deepEqual(partyOptions(rows).map(p=>[p.key,p.count]),[['D',1],['R',1],['I',1],['none',2]])
assert.equal(partyKey({party:null}),'none')
for (const n of ['Chris Van Hollen','Monica De La Cruz','Robert Garcia','Robert Menendez, Jr.','Debbie Wasserman Schultz','Thomas H. Kean, Jr.','Delia C. Ramirez']) console.log(n, '=>', lastNameKey(n))
console.log('Focused sorting, tie, null-date, null-party and non-mutation assertions passed')
JS
./node_modules/.bin/eslint src/components/MemberLookup.jsx src/data/memberSort.js" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 441ms:
zsh:1: can't create temp file for here document: operation not permitted
[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`

exec
/bin/zsh -lc "node --input-type=module -e 'import assert from \"node:assert/strict\"; import {lastNameKey,sortMembers,partyOptions,partyKey} from \"./src/data/memberSort.js\"; const rows=[{name:\"Zoe Adams\",status:\"signed\",date:\"2026-01-01\",party:\"D\"},{name:\"Alex Brown\",status:\"signed\",date:\"2026-11-01\",party:\"R\"},{name:\"Alice Adams\",status:\"signed\",date:\"2026-11-01\",party:null},{name:\"Sponsor Able\",status:\"sponsor\",date:null,party:\"I\"},{name:\"Nobody Aardvark\",status:\"not-yet\",date:null,party:null}]; assert.deepEqual(sortMembers(rows,\"recent\").map(m=>m.name),[\"Alice Adams\",\"Alex Brown\",\"Zoe Adams\",\"Sponsor Able\",\"Nobody Aardvark\"]); assert.deepEqual(sortMembers(rows,\"name\").map(m=>m.name),[\"Nobody Aardvark\",\"Sponsor Able\",\"Alice Adams\",\"Zoe Adams\",\"Alex Brown\"]); assert.equal(sortMembers(rows,\"state\"),rows); assert.deepEqual(partyOptions(rows).map(p=>[p.key,p.count]),[[\"D\",1],[\"R\",1],[\"I\",1],[\"none\",2]]); assert.equal(partyKey({party:null}),\"none\"); console.log(\"PASS: newest date first; alphabetical date ties; sponsor and null dates retained; null party counted; state input order retained; input array unchanged.\"); for(const name of [\"Chris Van Hollen\",\"Monica De La Cruz\",\"Robert Menendez, Jr.\",\"Debbie Wasserman Schultz\",\"Thomas H. Kean, Jr.\"]) console.log(name,\"=>\",lastNameKey(name));'; cat src/fixtures/statehoodBill.js; cat src/hooks/useStatehoodBillData.js; git status --short" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
PASS: newest date first; alphabetical date ties; sponsor and null dates retained; null party counted; state input order retained; input array unchanged.
Chris Van Hollen => van hollen chris
Monica De La Cruz => de la cruz monica
Robert Menendez, Jr. => menendez robert
Debbie Wasserman Schultz => schultz debbie wasserman
Thomas H. Kean, Jr. => kean thomas h.
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
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-QeqoOFTp' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-xcEWNj78' (errno=Operation not permitted)
?? reviews/2026-11-13-cosponsor-sort-filter-codex-high.raw.md
?? reviews/2026-11-13-cosponsor-sort-filter-codex-medium.raw.md

codex
0 BLOCKER / 0 MATERIAL / 1 NOTE.

- **NOTE — [src/data/memberSort.js:17](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter/src/data/memberSort.js:17):** “Last name (A–Z)” misorders compound surnames without a recognized particle. For example, `Debbie Wasserman Schultz` produces `schultz debbie wasserman`, placing her under S instead of W. The same limitation affects date-sort ties. The comment acknowledges this, but users still encounter incorrect surname ordering.

Focused assertions and ESLint passed. No additional findings in hooks, null handling, chamber switching, keyboard controls, labels, or live-region markup. Browser interaction and screen-reader announcements were not tested. No files changed.
tokens used
42,901
0 BLOCKER / 0 MATERIAL / 1 NOTE.

- **NOTE — [src/data/memberSort.js:17](/Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter/src/data/memberSort.js:17):** “Last name (A–Z)” misorders compound surnames without a recognized particle. For example, `Debbie Wasserman Schultz` produces `schultz debbie wasserman`, placing her under S instead of W. The same limitation affects date-sort ties. The comment acknowledges this, but users still encounter incorrect surname ordering.

Focused assertions and ESLint passed. No additional findings in hooks, null handling, chamber switching, keyboard controls, labels, or live-region markup. Browser interaction and screen-reader announcements were not tested. No files changed.
