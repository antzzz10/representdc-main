# Decision: Talking point generator — initial scoping

**Date:** 2026-07-26
**Context:** "Give me talking points" is one of RepresentDC's most frequent asks, and
the site answers it today with a fixed set behind a modal on `/the-case`
(`src/data/talkingPoints.js`: 4 of 7 categories × 2 audiences × 3 lengths). Idea raised:
a generator that tailors points to the user's actual situation, draws on vetted claims
plus live news, and improves over time. Full detail in
`TALKING-POINT-GENERATOR-PRD.md`; this note records the four scoping calls and why.

## 1. Architecture: hybrid, precomputed first

Precompute a reduced matrix at build time — a local script calls the Claude API and
writes reviewable static JSON that ships with the build. A serverless "refine this"
proxy is a later, optional layer.

**Why:** all three RepresentDC sites are static GitHub Pages builds. There is no
backend, and a key in client-side JS is a published key. Beyond that constraint,
precomputing is what makes the accuracy standard enforceable — you can review 160 static
cells, and you cannot review an unbounded live output space. Rejected pure-precompute
(can't ever incorporate live news, hard ceiling on variety) and pure-serverless (adds
infra, rate limiting, cost logging, and an unreviewable surface to a site that currently
has none of that).

## 2. Four input levers, one of them a formatting transform

Locked: **topic → who you're talking to → how much time → where it's going.** Tone folds
into the audience choice rather than getting its own dial.

**Why:** the eight dimensions originally raised produce thousands of cells, most of them
near-duplicates, and several are strongly correlated (where the audience lives, how well
they know D.C., how well they know the issue — largely one question wearing three hats).
Four questions is ~15 seconds and still changes the output meaningfully. Rejected six
levers (separate tone and hostility dials roughly double the matrix and invite the
"same paragraph, swapped adjective" failure) and all eight (a form nobody finishes).

Design refinement made during the write-up: **medium is packaging, not argument.** A
character ceiling, a salutation, a testimony opener, hashtag handling — that's
deterministic code wrapping generated content. So generate topic × audience × time
(160 cells at full coverage) and apply medium client-side. Cuts generation and review
burden 4×. Flagged for validation on a couple of cells before committing — if testimony
and a social post genuinely need different *arguments*, medium moves back into the
matrix.

## 3. "Learns over time" = feedback capture + human curation

Thumbs up/down and copy tracking on generated sets; Andria periodically reviews what's
failing or missing and adds vetted claims to the library.

**Why:** the site has no accounts, no analytics, and no data store, so there is no
learning signal today. Naming this honestly matters — the system improves because the
source material improves, not because a model self-trains. Rejected the fresh-sources-
only option (valuable, but it's really "stay current," not "learn") and both-at-once
(the sources pipeline overlaps Phase 4 eval work and isn't free). Where the feedback
data actually lands is still open; decide it with the serverless question, since the
cheapest paths need the same function.

## 4. Own route, after `/statehood-curious`

A dedicated `/talking-points`, linked from The Case, the Take Action Hub, and the
activist persona card. Built after the next Phase 4 chunk, not before it.

**Why:** the Phase 4 eval pipeline (trusted-domain allowlist gate → LLM-assisted
citation-support check) is a genuine prerequisite — this feature shouldn't ship without
it, and it lands with `/statehood-curious`. Rejected pulling Phase 7's Take Action Hub
forward to host this (jumps the eval pipeline, leaves `/statehood-curious` an interim
page longer) and extending the existing modal in place (leaves the most-requested thing
on the site buried behind a toggle on one page).

## Risks carried forward

The PRD's §6 has the full list. The two that most shape implementation:

- **Accuracy vs. generative text.** `DEVELOPMENT-GUIDELINES.md` forbids unsourced
  claims; inventing plausible statistics is a language model's default failure mode, and
  on an advocacy site one fabricated number is a credibility event. Mitigation is
  architectural, not prompt-based: retrieval-constrained generation, where the model
  receives vetted claim objects (text + citation) and may only select, order, compress,
  and re-voice them — never introduce a fact.
- **The hostility dial vs. the non-partisan voice guardrail.** A user-selectable
  sharpness setting makes an existing tension (`DESIGN-GUARDRAILS.md` bans party-label
  rhetoric; the framing guide tells allies to "name the opposition") into a product
  feature. Needs an explicit written ceiling, settled by ruling on two or three sample
  outputs at the edge rather than in the abstract.

## Next step

No build yet. When `/statehood-curious` and the eval pipeline land, revisit the PRD's
remaining open questions (§7) and draft an implementation plan.
