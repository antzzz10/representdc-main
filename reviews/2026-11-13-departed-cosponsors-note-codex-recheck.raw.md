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
session id: 01a1d617-352e-7903-ae7b-e661575a04c1
--------
user
Focused re-check of the last commit (git show HEAD) in this repository. A prior review found (1) MATERIAL: departedCosponsors() in src/data/statehoodBill.js used sponsorshipDate <= rosterDate, so a member seated and cosponsoring on the roster date was named as having left; (2) NOTE: "1 cosponsors" in DepartedNote in src/components/MemberLookup.jsx. Confirm whether both are fixed and whether the fix introduced anything new. Read-only. Report BLOCKER / MATERIAL / NOTE with file:line, or "no findings".
codex
I’ll read the review guidance, inspect `git show HEAD`, and check both fixes and nearby behavior without changing files.
exec
/bin/zsh -lc 'pwd; git status --short; git show --stat --oneline HEAD; rg --files -g AGENTS.md -g CLAUDE.md /Users/andriathomas/Projects/representdc-main /Users/andriathomas/Projects/andria-agent-system 2>/dev/null' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
/Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-0G3vVEzv' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-Q44d8E9i' (errno=Operation not permitted)
?? reviews/2026-11-13-departed-cosponsors-note-codex-recheck.raw.md
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-jJPIV7EH' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-GDNZMmsc' (errno=Operation not permitted)
a67e2fb statehood-bill: fix Codex findings on the departed-cosponsor note
 ...1-13-departed-cosponsors-note-codex-high.raw.md | 2121 ++++++++++++++++++++
 ...13-departed-cosponsors-note-codex-medium.raw.md | 2029 +++++++++++++++++++
 src/components/MemberLookup.jsx                    |    3 +-
 src/data/statehoodBill.js                          |    8 +-
 4 files changed, 4156 insertions(+), 5 deletions(-)
/Users/andriathomas/Projects/andria-agent-system/CLAUDE.md
/Users/andriathomas/Projects/andria-agent-system/AGENTS.md
/Users/andriathomas/Projects/andria-agent-system/adapters/CLAUDE.md
/Users/andriathomas/Projects/andria-agent-system/adapters/AGENTS.md
/Users/andriathomas/Projects/representdc-main/CLAUDE.md

exec
/bin/zsh -lc 'cat /Users/andriathomas/Projects/andria-agent-system/shared/WORKING_GUIDE.md; cat /Users/andriathomas/Projects/andria-agent-system/shared/REVIEW_POLICY.md' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
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
/bin/zsh -lc 'for p in /AGENTS.md /Users/AGENTS.md /Users/andriathomas/AGENTS.md /Users/andriathomas/Projects/AGENTS.md /Users/andriathomas/Projects/representdc-main/AGENTS.md /Users/andriathomas/Projects/representdc-main/.claude/AGENTS.md /Users/andriathomas/Projects/representdc-main/.claude/worktrees/AGENTS.md; do if [ -f "$p" ]; then printf '"'\\n%s\\n' \""'$p"; cat "$p"; fi; done; rg --files --hidden -g AGENTS.md -g CLAUDE.md -g '"'"'!node_modules'"' -g '"'!.git'"' .; cat CLAUDE.md; git log -3 --oneline; git show HEAD -- src/data/statehoodBill.js src/components/MemberLookup.jsx; cat package.json" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
./CLAUDE.md
./.claude/CLAUDE.md
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
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-prTR1gtT' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-jABqRFBg' (errno=Operation not permitted)
a67e2fb statehood-bill: fix Codex findings on the departed-cosponsor note
9ef9ec1 statehood-bill: note under the member list naming cosponsors who have left the chamber
392b0ab Merge pull request #6 from antzzz10/claude/cosponsor-sort-filter
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-3AHZZQPt' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-eu7Tcxob' (errno=Operation not permitted)
commit a67e2fbca6245b27840ebff8da69163ad5226e6a
Author: antzzz10 <andria.thomas@gmail.com>
Date:   Fri Nov 13 13:06:47 2026 -0500

    statehood-bill: fix Codex findings on the departed-cosponsor note
    
    A cosponsor who signed on the roster's own date is no longer named as having left (they
    may be newly seated); singular 'cosponsor' when the total is one. Raw reviews recorded.
    
    Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>

diff --git a/src/components/MemberLookup.jsx b/src/components/MemberLookup.jsx
index 7a92e17..fe2a7a1 100644
--- a/src/components/MemberLookup.jsx
+++ b/src/components/MemberLookup.jsx
@@ -11,13 +11,14 @@ const CHAMBERS = [
 function DepartedNote({ bill, departed, chamberLabel }) {
   if (departed.length === 0) return null
   const n = departed.length
+  const total = bill.totals.cosponsors
   const names = [...departed]
     .sort((a, b) => lastNameKey(a.name).localeCompare(lastNameKey(b.name)))
     .map((c) => `${c.name} (${c.state})`)
     .join(', ')
   return (
     <p className="lookup-footnote">
-      Congress.gov records {bill.totals.cosponsors} cosponsors of {bill.billNumber}. {n} of them{' '}
+      Congress.gov records {total} {total === 1 ? 'cosponsor' : 'cosponsors'} of {bill.billNumber}. {n} of them{' '}
       {n === 1 ? 'has' : 'have'} since left the {chamberLabel} and {n === 1 ? 'is' : 'are'} not listed here: {names}.
     </p>
   )
diff --git a/src/data/statehoodBill.js b/src/data/statehoodBill.js
index 7a494da..47ceb3e 100644
--- a/src/data/statehoodBill.js
+++ b/src/data/statehoodBill.js
@@ -362,15 +362,15 @@ export function memberStatuses(roster, bill, now = new Date()) {
 /**
  * Cosponsors on the bill's record who are absent from the chamber's current roster, i.e.
  * members who signed on and have since left. They count in the recorded total but cannot
- * appear in the member list, which is built from the roster. A cosponsor who signed on
- * after the roster was generated is left out: that is a new member the weekly roster has
- * not caught up with, not a departure.
+ * appear in the member list, which is built from the roster. Only a cosponsor who signed on
+ * before the roster's date counts: one who signed on that day or later may be a new member
+ * the weekly roster has not caught up with, not a departure (Codex review, 2026-11-13).
  */
 export function departedCosponsors(roster, bill) {
   if (!roster || !bill || roster.congress !== bill.congress || !bill.complete) return []
   const seated = new Set(roster.members.filter((m) => m.chamber === bill.chamber).map((m) => m.bioguideId))
   const rosterDate = etDate(roster.generatedAt)
-  return bill.cosponsors.filter((c) => !seated.has(c.bioguideId) && c.sponsorshipDate <= rosterDate)
+  return bill.cosponsors.filter((c) => !seated.has(c.bioguideId) && c.sponsorshipDate < rosterDate)
 }
 
 /**
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
/bin/zsh -lc "cat .claude/CLAUDE.md; nl -ba src/data/statehoodBill.js | sed -n '1,160p;260,420p'; nl -ba src/components/MemberLookup.jsx | sed -n '1,260p'; rg -n 'departedCosponsors|DepartedNote|generatedAt|sponsorshipDate' scripts src/data --glob '"'!*.json'"'; rg --files public | rg 'roster|statehood|cosponsor'; git diff HEAD -- src/data/statehoodBill.js src/components/MemberLookup.jsx" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
# Represent DC Main Site - Project Memory

## Project Overview
Landing page for RepresentDC.org that explains D.C.'s lack of representation and links to the bill tracker. Persuasive advocacy site using loss-framing and American values messaging.

**Tech Stack:** React 19 + Vite

**Live URLs:**
- Production: https://www.representdc.org (GitHub Pages)
- Bill Tracker: https://billtracker.representdc.org (separate repository)

## Project Structure

```
representdc-main/
├── src/
│   ├── App.jsx          # Main landing page component
│   ├── App.css          # All styling
│   ├── About.jsx        # /about — team roster, precursor to guest bylines
│   ├── Reading.jsx       # /reading — long-form article hub
│   ├── reading/          # One JSX file per article (e.g. RepublicansSupportedAutonomy.jsx)
│   ├── data/reading.js   # READING registry feeding the /reading hub cards
│   └── main.jsx         # React entry point
├── public/
│   ├── CNAME            # Custom domain: www.representdc.org
│   ├── .nojekyll        # Disables Jekyll on GitHub Pages
│   └── vite.svg
├── dist/                # Build output (not in git)
├── package.json
├── vite.config.js
└── STRATEGY.md          # Messaging strategy document
```

## Common Commands

### Development
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

### Deployment
```bash
npm run deploy       # Build and deploy to GitHub Pages (www.representdc.org)
```

## Site Content

### Key Messaging
- **Problem Framing:** "Congress Is Blocking D.C. Laws Right Now"
- **Loss Framing:** Shows what Congress has already taken away (not just threats)
- **American Values:** "No taxation without representation"
- **Solution:** D.C. statehood for full democracy

### Sections
1. **Hero** - Breaking news, urgency, CTA to bill tracker
2. **Facts** - 0 Senators, 0 voting members, 71 bills
3. **Impact** - What Congress has blocked (healthcare, policing, traffic, etc.)
4. **American Values** - No taxation without representation quote
5. **Trend** - Getting worse narrative with stats
6. **Solution** - D.C. statehood benefits
7. **Footer** - Links to bill tracker, about section, copyright

### Current Stats (as of 2025-11-19)
- **71 bills** pending in Congress (54 bills + 17 riders)
- **2 bills** just passed the House (H.R. 5214, H.R. 5107)
- **700,000** D.C. residents without representation

## Reading section (added 2026-09-09)

`/reading` — long-form articles, distinct from the site's own sourced facts (Myths, fact
cards). Structure: one JSX file per article under `src/reading/`, registered in
`src/data/reading.js` (`READING`) so the `/reading` hub can list them without holding
full article bodies. Linked from Nav and from a card on `/statehood-curious`.

Guest pieces (like the first one, by Miriam Edelman / WashingtonDCNow) are held to a
different citation bar than site-authored content: full attribution (byline,
publication, date, link to the original) and no AI-generated summary — not per-claim
primary-source re-sourcing of the guest author's own argument. See
`decisions/2026-09-09-reading-section.md` for the full rationale and a fidelity caveat
on the first article (lightly copy-edited from the original, not a byte-for-byte
transcript — flagged there for verification).

Byline treatment is a plain "By [Name]" line, not the `About` page's team-card format.
Naming is "Reading" rather than "Articles" so it can later fold into a broader
"Resources" section without a rename collision.

## Design System

### Colors
- **Primary Red:** `#DC143C` (matches bill tracker)
- **Dark Red:** `#A00000`
- **Accent Gold:** `#FFD700`
- **Dark Background:** `#1a1a1a`
- **Light Background:** `#f8f9fa`

### Typography
- System font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', etc.
- Hero title: 3.5rem, weight 800
- Section titles: 2.5rem, weight 700
- Body text: 1.1rem, line-height 1.6

### Components
- **Hero section** - Red gradient background with urgency badge
- **Fact cards** - Grid layout with large numbers
- **Impact cards** - Icon + heading + description
- **CTA buttons** - Primary (white on page), Secondary (red)
- **Footer** - Matches bill tracker design

## Deployment Configuration

### GitHub Pages Setup
- Repository: `representdc-main`
- Branch: `gh-pages` (auto-created by gh-pages package)
- Custom domain: `www.representdc.org`
- CNAME file in `/public/` directory
- `.nojekyll` file to disable Jekyll processing

### DNS Configuration
Your DNS provider should have:
- CNAME record: `www` → `[your-github-username].github.io`
- Or A records pointing to GitHub Pages IPs

### Important Files
- `public/CNAME` - Contains "www.representdc.org"
- `public/.nojekyll` - Empty file, prevents Jekyll processing
- `vite.config.js` - `base: '/'` for custom domain
- `package.json` - `"deploy": "gh-pages -d dist --dotfiles"`

## Content Updates

### When Bills Pass
Update in `src/App.jsx`:
- Line 19: Update date and note (e.g., "2 bills just passed the House")
- Update stats in Facts section if needed

### Updating Bill Count
If total bill count changes:
- Line 14: Update subtitle count
- Line 17: Update CTA text
- Line 39: Update fact card number
- Line 127-133: Update trend stats

## Relationship to Bill Tracker

**Main Site (www.representdc.org):**
- Educational/advocacy landing page
- Explains the problem and solution
- Drives traffic to bill tracker

**Bill Tracker (billtracker.representdc.org):**
- Detailed tracking of all 71 bills
- Searchable, filterable database
- PDF/CSV exports
- Separate repository: `dc-bills-tracker`

**Links:**
- Main site links to tracker in hero CTA
- Main site links to tracker in trend section
- Main site links to tracker in footer
- Both sites share same branding and copyright

## Copyright & Attribution

**Copyright:** © 2025 Represent DC

**About:**
"This is an independent, volunteer-run project created by a proud DC resident
to track anti-DC legislation and advocate for full democracy for D.C. residents.
Not affiliated with any organization."

Same attribution appears on both main site and bill tracker.

## Troubleshooting

### Custom Domain Not Working
1. Check `public/CNAME` contains `www.representdc.org`
2. Verify DNS settings at your domain registrar
3. Check GitHub Pages settings in repository
4. Ensure `--dotfiles` flag in deploy script

### Build Errors
- Run `npm install` to ensure dependencies are up to date
- Clear `node_modules` and reinstall if needed
- Check ESLint errors with `npm run lint`

### Deployment Issues
- Ensure `gh-pages` package is installed
- Check that `dist/` folder is being created during build
- Verify `gh-pages` branch exists in GitHub repository

## Future Enhancements

- Add analytics tracking
- Create blog/news section
- Add email signup form
- Integrate with bill tracker data API
- Add social sharing functionality
- Create additional landing pages for specific issues

## Related Documentation

- **STRATEGY.md** - Detailed messaging strategy
- **Bill Tracker CLAUDE.md** - Documentation for billtracker.representdc.org
- **FEEDBACK-SETUP.md** (in bill tracker repo) - Feedback system setup
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
   365	 * appear in the member list, which is built from the roster. Only a cosponsor who signed on
   366	 * before the roster's date counts: one who signed on that day or later may be a new member
   367	 * the weekly roster has not caught up with, not a departure (Codex review, 2026-11-13).
   368	 */
   369	export function departedCosponsors(roster, bill) {
   370	  if (!roster || !bill || roster.congress !== bill.congress || !bill.complete) return []
   371	  const seated = new Set(roster.members.filter((m) => m.chamber === bill.chamber).map((m) => m.bioguideId))
   372	  const rosterDate = etDate(roster.generatedAt)
   373	  return bill.cosponsors.filter((c) => !seated.has(c.bioguideId) && c.sponsorshipDate < rosterDate)
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
    14	  const total = bill.totals.cosponsors
    15	  const names = [...departed]
    16	    .sort((a, b) => lastNameKey(a.name).localeCompare(lastNameKey(b.name)))
    17	    .map((c) => `${c.name} (${c.state})`)
    18	    .join(', ')
    19	  return (
    20	    <p className="lookup-footnote">
    21	      Congress.gov records {total} {total === 1 ? 'cosponsor' : 'cosponsors'} of {bill.billNumber}. {n} of them{' '}
    22	      {n === 1 ? 'has' : 'have'} since left the {chamberLabel} and {n === 1 ? 'is' : 'are'} not listed here: {names}.
    23	    </p>
    24	  )
    25	}
    26	
    27	const FILTERS = [
    28	  { key: 'not-yet', label: 'Not yet signed on' },
    29	  { key: 'signed', label: 'Signed on' },
    30	  { key: 'all', label: 'All' },
    31	]
    32	
    33	// The organizer view: every current member, their status on this chamber's bill.
    34	// Tabs follow the WAI-ARIA tabs pattern (arrow keys move between them); filters are a
    35	// native radio group, so they work by keyboard with no extra code. Party and sort are
    36	// native selects for the same reason.
    37	function MemberLookup({ bills, rosters }) {
    38	  const [chamber, setChamber] = useState('house')
    39	  const [filter, setFilter] = useState('not-yet')
    40	  const [stateCode, setStateCode] = useState('')
    41	  const [partyChoice, setPartyChoice] = useState('')
    42	  const [sort, setSort] = useState('name')
    43	  const [query, setQuery] = useState('')
    44	  const tabRefs = useRef({})
    45	  const id = useId()
    46	
    47	  const bill = bills[chamber]
    48	  // A roster only answers "not yet" for its own Congress, and only while this chamber's
    49	  // bill is the current one with a complete cosponsor list. memberStatuses returns null
    50	  // when the files disagree about a member, and the panel then shows nothing.
    51	  const roster = bill ? rosters[bill.congress]?.data : null
    52	  const statuses = useMemo(
    53	    () => (bill && bill.current && bill.complete ? memberStatuses(roster, bill) : null),
    54	    [bill, roster],
    55	  )
    56	  const usable = Boolean(statuses)
    57	  const departed = useMemo(() => (usable ? departedCosponsors(roster, bill) : []), [usable, roster, bill])
    58	  const all = useMemo(() => statuses ?? [], [statuses])
    59	  const states = useMemo(() => [...new Set(all.map((m) => m.state))].sort(), [all])
    60	  const parties = useMemo(() => partyOptions(all), [all])
    61	  // A party picked in one chamber may not exist in the other; then it filters nothing.
    62	  const party = parties.some((p) => p.key === partyChoice) ? partyChoice : ''
    63	  const sorted = useMemo(() => sortMembers(all, sort), [all, sort])
    64	  const needle = query.trim().toLowerCase()
    65	  const shown = sorted.filter((m) =>
    66	    (filter === 'all' || m.status === filter || (filter === 'signed' && m.status === 'sponsor')) &&
    67	    (!stateCode || m.state === stateCode) &&
    68	    (!party || partyKey(m) === party) &&
    69	    (!needle || m.name.toLowerCase().includes(needle)))
    70	
    71	  // Sign-on order says nothing about members who have not signed on, so the two choices
    72	  // move together: picking it shows who has signed, and leaving for "not yet" drops it.
    73	  const chooseSort = (key) => {
    74	    setSort(key)
    75	    if (key === 'recent' && filter === 'not-yet') setFilter('signed')
    76	  }
    77	  const chooseFilter = (key) => {
    78	    setFilter(key)
    79	    if (key === 'not-yet' && sort === 'recent') setSort('name')
    80	  }
    81	
    82	  const selectTab = (key) => {
    83	    setChamber(key)
    84	    setStateCode('')
    85	    tabRefs.current[key]?.focus()
    86	  }
    87	  const onTabKey = (e) => {
    88	    const i = CHAMBERS.findIndex((c) => c.key === chamber)
    89	    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: CHAMBERS.length - 1 }[e.key]
    90	    if (next === undefined) return
    91	    e.preventDefault()
    92	    selectTab(CHAMBERS[(next + CHAMBERS.length) % CHAMBERS.length].key)
    93	  }
    94	
    95	  const active = CHAMBERS.find((c) => c.key === chamber)
    96	
    97	  return (
    98	    <div className="lookup">
    99	      <div className="lookup-tabs" role="tablist" aria-label="Chamber">
   100	        {CHAMBERS.map((c) => (
   101	          <button
   102	            key={c.key}
   103	            ref={(el) => { tabRefs.current[c.key] = el }}
   104	            type="button"
   105	            role="tab"
   106	            id={`${id}-tab-${c.key}`}
   107	            aria-selected={chamber === c.key}
   108	            aria-controls={`${id}-panel`}
   109	            tabIndex={chamber === c.key ? 0 : -1}
   110	            className="lookup-tab"
   111	            onClick={() => selectTab(c.key)}
   112	            onKeyDown={onTabKey}
   113	          >
   114	            {c.label}
   115	          </button>
   116	        ))}
   117	      </div>
   118	
   119	      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${chamber}`} className="lookup-panel">
   120	        {!usable ? (
   121	          bill && !bill.current
   122	            ? <p className="lookup-empty">No confirmed {ordinal(bill.congress + 1)}-Congress bill linked yet.</p>
   123	            : null
   124	        ) : (
   125	          <>
   126	            <div className="lookup-controls">
   127	              <fieldset className="lookup-filters">
   128	                <legend className="sr-only">Show</legend>
   129	                {FILTERS.map((f) => (
   130	                  <label key={f.key} className="filter-chip">
   131	                    <input type="radio" name={`${id}-filter`} value={f.key} checked={filter === f.key} onChange={() => chooseFilter(f.key)} />
   132	                    <span>{f.label}</span>
   133	                  </label>
   134	                ))}
   135	              </fieldset>
   136	              <label className="lookup-field">
   137	                <span>State</span>
   138	                <select value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
   139	                  <option value="">All states</option>
   140	                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
   141	                </select>
   142	              </label>
   143	              <label className="lookup-field">
   144	                <span>Party</span>
   145	                <select value={party} onChange={(e) => setPartyChoice(e.target.value)}>
   146	                  <option value="">All parties</option>
   147	                  {parties.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
   148	                </select>
   149	              </label>
   150	              <label className="lookup-field">
   151	                <span>Sort by</span>
   152	                <select value={sort} onChange={(e) => chooseSort(e.target.value)}>
   153	                  {SORTS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
   154	                </select>
   155	              </label>
   156	              <label className="lookup-field">
   157	                <span>Search by name</span>
   158	                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
   159	              </label>
   160	            </div>
   161	            <p className="lookup-count" role="status" aria-live="polite">
   162	              Showing {shown.length} of {all.length} {active.plural}.
   163	            </p>
   164	            {shown.length > 0 && (
   165	              <ul className="member-list">
   166	                {shown.map((m) => <MemberRow key={m.bioguideId} member={m} />)}
   167	              </ul>
   168	            )}
   169	            <DepartedNote bill={bill} departed={departed} chamberLabel={active.label} />
   170	          </>
   171	        )}
   172	      </div>
   173	    </div>
   174	  )
   175	}
   176	
   177	export default MemberLookup
src/data/statehoodBill.js:152:    if (!p || !isDateOnly(c.sponsorshipDate) || typeof c.isOriginalCosponsor !== 'boolean') return null
src/data/statehoodBill.js:154:    if (c.sponsorshipDate < raw.introducedDate || (checkedDate && c.sponsorshipDate > checkedDate)) return null
src/data/statehoodBill.js:155:    cosponsors.push({ ...p, sponsorshipDate: c.sponsorshipDate, isOriginalCosponsor: c.isOriginalCosponsor })
src/data/statehoodBill.js:207:  if (!isObj(json) || json.congress !== expectedCongress || !Array.isArray(json.members) || !isInstant(json.generatedAt)) return null
src/data/statehoodBill.js:236:  return { congress: expectedCongress, generatedAt: json.generatedAt, members }
src/data/statehoodBill.js:322:      if (!latestDate || c.sponsorshipDate > latestDate) latestDate = c.sponsorshipDate
src/data/statehoodBill.js:323:      if (c.sponsorshipDate.slice(0, 7) === month) rows.push({ ...c, chamber: b.chamber, billNumber: b.billNumber })
src/data/statehoodBill.js:326:  rows.sort((a, b) => b.sponsorshipDate.localeCompare(a.sponsorshipDate) || a.name.localeCompare(b.name))
src/data/statehoodBill.js:339:  if (now - Date.parse(roster.generatedAt) > ROSTER_MAX_AGE_MS) return null
src/data/statehoodBill.js:352:  const signed = new Map(bill.cosponsors.map((c) => [c.bioguideId, c.sponsorshipDate]))
src/data/statehoodBill.js:369:export function departedCosponsors(roster, bill) {
src/data/statehoodBill.js:372:  const rosterDate = etDate(roster.generatedAt)
src/data/statehoodBill.js:373:  return bill.cosponsors.filter((c) => !seated.has(c.bioguideId) && c.sponsorshipDate < rosterDate)
scripts/eval/run-golden.mjs:224:writeFileSync(outPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), model: MODEL, promptVersion: PROMPT_VERSION, results }, null, 2)}\n`);
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-nPlLfAsr' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-XX29NWHl' (errno=Operation not permitted)

codex
Both fixes are present: the date comparison is now strict `<`, and the note uses “cosponsor” when the total is one. I’m checking the date boundary and rendered copy for regressions.
exec
/bin/zsh -lc './node_modules/.bin/eslint src/data/statehoodBill.js src/components/MemberLookup.jsx; git show --format= --check HEAD; git status --short' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 260ms:
[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-0wtEoUXD' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-4aAxbGNg' (errno=Operation not permitted)
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:127: trailing whitespace.
+**Canonical cross-tool source**  
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:298: trailing whitespace.
+    
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:302: trailing whitespace.
+    
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:312: trailing whitespace.
+ 
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:334: trailing whitespace.
+ 
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:381: trailing whitespace.
+ 
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:411: trailing whitespace.
+     9	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:428: trailing whitespace.
+    26	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:443: trailing whitespace.
+    41	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:448: trailing whitespace.
+    46	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:454: trailing whitespace.
+    52	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:465: trailing whitespace.
+    63	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:474: trailing whitespace.
+    72	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:493: trailing whitespace.
+    91	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:496: trailing whitespace.
+    94	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:502: trailing whitespace.
+   100	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:518: trailing whitespace.
+   116	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:546: trailing whitespace.
+   144	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:550: trailing whitespace.
+   148	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:560: trailing whitespace.
+   158	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:570: trailing whitespace.
+   168	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:586: trailing whitespace.
+   184	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:600: trailing whitespace.
+   198	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:640: trailing whitespace.
+   238	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:648: trailing whitespace.
+   246	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:680: trailing whitespace.
+   278	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:682: trailing whitespace.
+   280	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:688: trailing whitespace.
+   286	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:695: trailing whitespace.
+   293	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:699: trailing whitespace.
+   297	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:706: trailing whitespace.
+   304	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:731: trailing whitespace.
+   329	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:763: trailing whitespace.
+   361	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:777: trailing whitespace.
+   375	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:796: trailing whitespace.
+     5	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:816: trailing whitespace.
+    25	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:822: trailing whitespace.
+    31	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:836: trailing whitespace.
+    45	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:860: trailing whitespace.
+    69	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:871: trailing whitespace.
+    80	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:884: trailing whitespace.
+    93	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:886: trailing whitespace.
+    95	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:908: trailing whitespace.
+   117	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:966: trailing whitespace.
+   175	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1178: trailing whitespace.
+    12	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1183: trailing whitespace.
+    17	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1192: trailing whitespace.
+    26	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1194: trailing whitespace.
+    28	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1202: trailing whitespace.
+    36	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1206: trailing whitespace.
+    40	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1227: trailing whitespace.
+    61	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1246: trailing whitespace.
+    80	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1266: trailing whitespace.
+   100	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1268: trailing whitespace.
+   102	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1303: trailing whitespace.
+   137	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1312: trailing whitespace.
+   146	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1327: trailing whitespace.
+   161	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1350: trailing whitespace.
+   184	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1359: trailing whitespace.
+   193	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1366: trailing whitespace.
+   200	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1373: trailing whitespace.
+   207	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1380: trailing whitespace.
+   214	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1388: trailing whitespace.
+   222	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1395: trailing whitespace.
+   345	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1407: trailing whitespace.
+   357	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1413: trailing whitespace.
+   363	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1420: trailing whitespace.
+   370	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1425: trailing whitespace.
+   375	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1433: trailing whitespace.
+   383	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1816: trailing whitespace.
+     4	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1824: trailing whitespace.
+    12	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1837: trailing whitespace.
+    25	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1848: trailing whitespace.
+    36	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1850: trailing whitespace.
+    38	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1856: trailing whitespace.
+    44	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1865: trailing whitespace.
+    53	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1870: trailing whitespace.
+    58	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1882: trailing whitespace.
+    70	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1886: trailing whitespace.
+     2	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1892: trailing whitespace.
+     8	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1907: trailing whitespace.
+    23	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1926: trailing whitespace.
+    42	
reviews/2026-11-13-departed-cosponsors-note-codex-high.raw.md:1960: trailing whitespace.
+    76	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:36: trailing whitespace.
+    
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:40: trailing whitespace.
+    
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:49: trailing whitespace.
+**Canonical cross-tool source**  
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:299: trailing whitespace.
+    
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:303: trailing whitespace.
+    
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:313: trailing whitespace.
+ 
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:335: trailing whitespace.
+ 
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:382: trailing whitespace.
+ 
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1275: trailing whitespace.
+   238	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1283: trailing whitespace.
+   246	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1315: trailing whitespace.
+   278	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1317: trailing whitespace.
+   280	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1323: trailing whitespace.
+   286	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1330: trailing whitespace.
+   293	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1334: trailing whitespace.
+   297	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1341: trailing whitespace.
+   304	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1366: trailing whitespace.
+   329	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1398: trailing whitespace.
+   361	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1412: trailing whitespace.
+   375	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1431: trailing whitespace.
+     5	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1451: trailing whitespace.
+    25	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1457: trailing whitespace.
+    31	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1471: trailing whitespace.
+    45	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1495: trailing whitespace.
+    69	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1506: trailing whitespace.
+    80	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1519: trailing whitespace.
+    93	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1521: trailing whitespace.
+    95	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1543: trailing whitespace.
+   117	
reviews/2026-11-13-departed-cosponsors-note-codex-medium.raw.md:1601: trailing whitespace.
+   175	
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-SYITYf9R' (errno=Operation not permitted)
git: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
git: error: couldn't create cache file '/tmp/xcrun_db-J83wJnn3' (errno=Operation not permitted)
?? reviews/2026-11-13-departed-cosponsors-note-codex-recheck.raw.md

exec
/bin/zsh -lc "node --input-type=module -e '
import assert from '\\''node:assert/strict'\\'';
import {departedCosponsors,etDate} from '\\''./src/data/statehoodBill.js'\\'';
const row=(bioguideId,sponsorshipDate)=>({bioguideId,sponsorshipDate});
const roster={congress:119,generatedAt:'\\''2026-11-13T02:00:00Z'\\'',members:[{bioguideId:'\\''S000001'\\'',chamber:'\\''house'\\''},{bioguideId:'\\''X000001'\\'',chamber:'\\''senate'\\''}]};
const bill={congress:119,chamber:'\\''house'\\'',complete:true,cosponsors:[row('\\''B000001'\\'','\\''2026-11-11'\\''),row('\\''E000001'\\'','\\''2026-11-12'\\''),row('\\''A000001'\\'','\\''2026-11-13'\\''),row('\\''S000001'\\'','\\''2026-11-11'\\''),row('\\''X000001'\\'','\\''2026-11-11'\\'')]};
assert.equal(etDate(roster.generatedAt),'\\''2026-11-12'\\'');
assert.deepEqual(departedCosponsors(roster,bill).map(c=>c.bioguideId),['\\''B000001'\\'','\\''X000001'\\'']);
for(const generatedAt of ['\\''2026-11-13T05:00:00Z'\\'','\\''2026-11-13T23:00:00Z'\\'']){
const r={...roster,generatedAt};const b={...bill,cosponsors:[row('\\''B000001'\\'','\\''2026-11-12'\\''),row('\\''E000001'\\'','\\''2026-11-13'\\''),row('\\''A000001'\\'','\\''2026-11-14'\\'')]};
assert.deepEqual(departedCosponsors(r,b).map(c=>c.bioguideId),['\\''B000001'\\'']);}
assert.deepEqual(departedCosponsors(null,bill),[]);
assert.deepEqual(departedCosponsors(roster,null),[]);
assert.deepEqual(departedCosponsors(roster,{...bill,congress:120}),[]);
assert.deepEqual(departedCosponsors(roster,{...bill,complete:false}),[]);
console.log('\\''PASS: date boundary, Eastern rollover, seated/chamber membership, null/mismatched/incomplete guards'\\'');
'" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
PASS: date boundary, Eastern rollover, seated/chamber membership, null/mismatched/incomplete guards

exec
/bin/zsh -lc "node --input-type=module -e '
import assert from '\\''node:assert/strict'\\'';
import fs from '\\''node:fs'\\'';
import {transform} from '\\''esbuild'\\'';
import React from '\\''react'\\'';
import {renderToStaticMarkup} from '\\''react-dom/server'\\'';
import {lastNameKey} from '\\''./src/data/memberSort.js'\\'';
const source=fs.readFileSync('\\''src/components/MemberLookup.jsx'\\'','\\''utf8'\\'');
const note=source.slice(source.indexOf('\\''function DepartedNote('\\''),source.indexOf('\\''\\nconst FILTERS'\\''));
const compiled=await transform(note,{loader:'\\''jsx'\\'',jsxFactory:'\\''React.createElement'\\''});
const DepartedNote=new Function('\\''React'\\'','\\''lastNameKey'\\'',compiled.code+'\\''; return DepartedNote'\\'')(React,lastNameKey);
const p=name=>({name,state:'\\''DC'\\''});
for(const [total,departed,expected] of [[1,[p('\\''Alpha'\\'')],'\\''records 1 cosponsor of H.R. 51. 1 of them has'\\''],[2,[p('\\''Beta'\\''),p('\\''Alpha'\\'')],'\\''records 2 cosponsors of H.R. 51. 2 of them have'\\'']]){
const html=renderToStaticMarkup(React.createElement(DepartedNote,{bill:{totals:{cosponsors:total},billNumber:'\\''H.R. 51'\\''},departed,chamberLabel:'\\''House'\\''}));
assert.ok(html.includes(expected),html);
if(departed.length===2)assert.ok(html.includes('\\''Alpha (DC), Beta (DC)'\\''),html);}
assert.equal(renderToStaticMarkup(React.createElement(DepartedNote,{departed:[]})),'\\'''\\'');
console.log('\\''PASS: actual JSX singular/plural, verbs, sorted names, empty note'\\'');
'" in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 0ms:
PASS: actual JSX singular/plural, verbs, sorted names, empty note

exec
/bin/zsh -lc './node_modules/.bin/eslint src/data/statehoodBill.js src/components/MemberLookup.jsx' in /Users/andriathomas/Projects/representdc-main/.claude/worktrees/cosponsor-sort-filter
 succeeded in 204ms:
[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`

codex
No findings in `a67e2fb`.

Both prior issues are fixed:

- `src/data/statehoodBill.js:373` uses `< rosterDate`, excluding same-day signers from departures.
- `src/components/MemberLookup.jsx:21` renders “1 cosponsor.”

No new issues found. Date-boundary checks, actual JSX singular/plural rendering, and targeted ESLint passed. No files changed.
tokens used
31,247
No findings in `a67e2fb`.

Both prior issues are fixed:

- `src/data/statehoodBill.js:373` uses `< rosterDate`, excluding same-day signers from departures.
- `src/components/MemberLookup.jsx:21` renders “1 cosponsor.”

No new issues found. Date-boundary checks, actual JSX singular/plural rendering, and targeted ESLint passed. No files changed.
