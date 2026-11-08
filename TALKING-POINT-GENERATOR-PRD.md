# PRD (draft): Statehood talking point generator

**Status:** Scoping — not approved, not scheduled
**Started:** 2026-07-26
**Owner:** Andria
**Related:** `WHATS-NEXT.md` (Phase 4 eval pipeline, Phase 7 Take Action Hub),
`DEVELOPMENT-GUIDELINES.md` (accuracy standards), `DESIGN-GUARDRAILS.md` (voice, sourcing
placement), `decisions/2026-07-20-segment-mapping.md` (segments), `STAKEHOLDER-MAP.md`
(orgs), `references/talking-points-framing-guide.md` (existing framing logic)

---

## 1. Problem

"Give me talking points for statehood" is one of the most frequent asks RepresentDC
gets. Today the site answers it with a fixed set: `src/data/talkingPoints.js` holds
one-liner / elevator pitch / full argument / hypocrisy points, in exactly two audience
flavors (`allies`, `persuadable`), for four categories (transportation, health,
elections, crime), surfaced only inside the expandable `TalkingPoints` modal on
`/the-case` category cards.

That's good raw material and badly under-served by the current packaging:

- **Two audience flavors is a blunt instrument.** A DC neighbor at a block party, a
  skeptical relative in Ohio, and a state legislator considering a statehood resolution
  all get the same two options.
- **Length and setting are unaddressed.** The three lengths are fixed; there's no
  version for a 30-second doorstep, a 5-minute testimony, a LinkedIn post, or a letter
  to an editor.
- **It's buried.** Talking points live behind a modal toggle on one page, discoverable
  only by someone already browsing categories.
- **It's frozen.** Nothing feeds current news, new bill activity, or what actually
  worked for real users back into the set.
- **Coverage is partial.** `categoryDetails.js` has 7 categories; `talkingPoints.js`
  has 4. Any generator will expose the three gaps immediately.

## 2. Proposed product

A **talking point generator**: the user answers a short set of structured questions
about their situation, and gets back a tailored, ready-to-use set of talking points —
copyable, sourced, and grounded in RepresentDC's already-vetted claim library plus
current news and known statehood resources.

Explicitly **not** an open chatbot. Structured input in, structured output out.

## 2a. Decisions resolved (2026-07-26)

Four scoping decisions locked in the first review pass. Full reasoning:
`decisions/2026-07-26-talking-point-generator-scope.md`.

1. **Architecture: hybrid.** Precompute a reduced matrix at build time — a local script
   calls the Claude API, output ships as reviewable static JSON, zero runtime cost and
   zero key exposure. A serverless "refine this" proxy stays a later, optional layer.
2. **Four input levers**, in this order: topic → who you're talking to → how much time →
   where it's going. Tone is folded into the audience choice rather than being its own
   dial. See §3.
3. **"Learns over time" = feedback capture plus human curation.** Thumbs up/down and
   copy tracking on generated sets; Andria reviews and adds vetted claims. Named
   honestly — the system improves because the source library improves, not because a
   model self-trains.
4. **Its own `/talking-points` route, built after `/statehood-curious`.** Phase 4
   sequencing holds; the eval pipeline that lands with `/statehood-curious` is a
   prerequisite for shipping this safely.

## 3. Customization dimensions

### v1 input set (locked)

Four questions, roughly 15 seconds to answer, each one genuinely changing the output:

1. **What's it about?** — the 7 categories, plus "the general case for statehood"
2. **Who are you talking to?** — a D.C. neighbor · someone outside D.C. who's never
   thought about it · a skeptic with objections · a hostile audience · an elected
   official or staffer
3. **How much time?** — 30 seconds · 2 minutes · 10 minutes · written long-form
4. **Where's it going?** — in person · social post · email · public testimony

### Design note: medium is a formatting transform, not a generation dimension

Treating all four levers as generated dimensions gives 8 × 5 × 4 × 4 = 640 cells — too
many to precompute or to review. But "where's it going" mostly changes *packaging*, not
*argument*: a character ceiling, a salutation, a "my name is ___ and I live in ___"
opener for testimony, hashtag and link handling for social. That's deterministic code
wrapping generated content.

So precompute **topic × audience × time** (8 × 5 × 4 = 160 cells, and fewer until the
three uncovered categories are filled — see §6G), then apply the medium as a
client-side transform at render time. Same product surface, a quarter of the
generation and review burden. Worth validating on a couple of cells before committing:
if testimony and a social post genuinely need different *arguments* rather than
different packaging, medium has to move back into the matrix.

### Full dimension set as originally raised

Captured as stated, with an assessment of each — the reasoning behind what made the
locked set above and what got folded in or dropped.

| Dimension | Options (sketch) | Assessment |
|---|---|---|
| **Where the audience is** | In D.C. / DMV / elsewhere in U.S. / abroad | Strong. Changes the ask entirely — a non-DC audience has a senator to call; a DC audience doesn't. |
| **How well they know D.C.** | Lives here / visited / knows it as "the government" | Moderate. Mostly affects how much scene-setting is needed. Correlates heavily with the row above. |
| **How well they know the statehood issue** | Never heard of it / heard of it / follows it | Strong. Determines whether you spend words on "D.C. has no vote" at all. |
| **Time available** | 30 seconds / 2 minutes / 10 minutes / written long-form | Strong, and cheap to implement — maps to existing oneLiner / elevatorPitch / fullArgument tiers. |
| **Likely hostility** | Friendly / neutral / skeptical / hostile | Strong but **risky** — see §6. Maps roughly to today's allies/persuadable split, extended. |
| **Tone you want** | Warm / factual / urgent / humorous | Moderate. Overlaps with hostility; two tone-ish dials may be one dial too many. |
| **Setting / medium** | In person / social post / email / letter to editor / public testimony / call to a member's office | Strong. Format constraints (char limits, salutations, "my name is… I live in…") are concrete and mechanical. |
| **Topic** *(not raised, but implied)* | Any of the 7 categories, or "general case for statehood" | Needed. Without it there's no content to draw from. |

## 4. Content sources

Everything generated must trace to something already vetted:

1. `src/data/talkingPoints.js` — 4 categories × 2 audiences × 3 lengths + hypocrisy
   points, all with inline citations
2. `src/data/categoryDetails.js` — 7 category descriptions with historical framing
3. `src/MythsAndFaq.jsx` — 8 myths + 2 FAQs, sourced rebuttals (best raw material for
   the hostile-audience path)
4. `src/HowCongressControlsDC.jsx` — mechanism explainer for the "never heard of it"
   path
5. Live bill data — `useBillStats.js` / dc-bills-tracker's public JSON
6. Live news — `news.json` from dc-bills-tracker (already fetched by `/news`)
7. `STAKEHOLDER-MAP.md` — orgs to hand off to ("if you want X, connect with Y")

**Hard rule (from `DEVELOPMENT-GUIDELINES.md`): the generator may recombine, reframe,
compress, and re-voice existing sourced claims. It may not introduce a new factual
claim.** This is the single most important constraint in this document — see §6.

## 5. Success criteria (draft)

- A user can go from landing on the page to a copied, usable set of points in **under
  60 seconds** and at most **4 questions answered**.
- Every factual sentence in the output traces to a claim in the library, with its
  source available.
- Output is genuinely different across input combinations — not the same three
  paragraphs with a swapped adjective (the failure mode a naive template hits).
- Copy/share rate is measurable, so §7 Q3's learning loop has a signal to learn from.

## 6. Problems and risks flagged

**A. There is no backend.** All three RepresentDC sites are static builds on GitHub
Pages. A live LLM call needs an API key, and a key in client-side JS is a published
key. Real options: (a) precompute every combination at build time and ship a lookup
table, (b) add a small serverless proxy (Cloudflare Worker / Vercel function) holding
the key, (c) hybrid — precomputed defaults with an optional live-refine call.
**Resolved (§2a): hybrid, starting from the precomputed half.**

**B. Combinatorial explosion.** The eight dimensions in §3 as sketched produce
thousands of combinations. Most are near-duplicates (a "hostile, humorous, 30-second,
in-person, in-DC" set differs from its neighbor by very little), and several dimensions
are strongly correlated. A precomputed matrix over all eight is infeasible; a live
generator over all eight is unfalsifiable — you can't review output quality across
thousands of cells. **Resolved (§2a and §3): four levers, three of them generated and
the fourth applied as a formatting transform — 160 cells at full category coverage.**

**C. Accuracy standards vs. generative text — the central tension.**
`DEVELOPMENT-GUIDELINES.md` says never make an unsourced claim and ask before adding
any new statistic, bill status, or sponsor attribution. A model writing free-form
advocacy copy will invent plausible statistics; that is its default failure mode, and
on an advocacy site a single fabricated number is a credibility event. The mitigation
is architectural, not prompt-based: **retrieval-constrained generation** — the model
receives only a shortlist of vetted claim objects (text + citation) and is restricted
to selecting, ordering, compressing, and re-voicing them. Pair with the staged eval
pipeline already scoped in Phase 4 (trusted-domain allowlist gate → LLM-assisted
citation-support check). This feature is a strong forcing function for building that
pipeline, and probably shouldn't ship before it exists.

**D. The hostility dial cuts against the brand voice.** `DESIGN-GUARDRAILS.md` mandates
a non-partisan voice with no party-label rhetoric. But the existing `allies` content
does name "House Republicans" directly, and the framing guide explicitly advises
"name the opposition" for that audience. A user-selectable hostility/tone dial makes
that tension a product feature — someone could generate a maximally combative version
and post it with RepresentDC's name attached. Needs an explicit ceiling on how sharp
the sharpest setting gets, and that ceiling should be a stated decision, not an
emergent property of a prompt.

**E. "Learns over time" has no signal today.** Static site, no accounts, no analytics,
no store. There's currently no way to know which generated points were copied, shared,
or worked. Without a feedback mechanism, "learning" reduces to Andria manually adding
claims — which is fine and honest, but should be named as such rather than implied to
be automatic. **Resolved (§2a): feedback capture plus human curation, named as such in
the UI.** The store itself is still an open design question — the site has no backend,
so even thumbs up/down needs somewhere to go. Cheapest paths: a form-service endpoint,
or a GitHub Issues write via a serverless function (the same function the "refine"
layer would eventually need). Decide alongside the serverless question, not before it.

**F. Cost and abuse.** A public LLM endpoint is a public token-burner. Any live-call
design needs rate limiting, aggressive response caching, and per-response
`response.usage` logging to a gitignored `*-usage-log.jsonl` (standing rule; never bake
cost estimates into code).

**G. Coverage gaps get exposed.** Three of seven categories have no talking points at
all. A generator that silently returns weaker output for those categories is worse than
one that says "we don't have vetted points on this yet — here's the closest thing."

**H. Existing component debt.** `TalkingPoints.jsx` uses emoji section headers and
per-claim inline citations — both now contrary to `DESIGN-GUARDRAILS.md` (no emoji
ever; aggregate sources at the bottom via `.sources-block`). Whatever gets built either
inherits that debt or fixes it. Recommend fixing it as part of this work.

**I. Placement.** This is arguably the anchor feature of the Take Action Hub (Phase 7,
unscoped) rather than a standalone route. **Resolved (§2a): its own `/talking-points`
route, sequenced after `/statehood-curious` so the eval pipeline exists first.** The
Take Action Hub links to it when that page gets built.

## 7. Open questions

Smaller than the four now resolved — each has a proposed default, none blocks drafting
an implementation plan.

1. **AI disclosure.** *Proposed: yes* — match the pattern already on `/news`
   (`Icon name="sparkles"` + a one-line note), worded for this context: assembled from
   vetted, sourced material; check it before using it publicly. Cheap, consistent, and
   it protects credibility more than it costs.
2. **Stakeholder-org handoff.** *Proposed: yes, but as a v1.1 follow-on* — the mapping
   from situation to org is exactly what `STAKEHOLDER-MAP.md` is building, and that doc
   still needs a per-org verification pass. Design the output block with a slot for it;
   fill the slot when the map is verified.
3. **Category coverage.** *Proposed: ship scoped to what's vetted*, with an explicit
   "we don't have vetted points on this yet — here's the closest thing" state for the
   three uncovered categories, rather than delaying launch behind three new
   research-heavy content sets or letting the generator quietly produce thinner output.
4. **Where feedback data lands** — see §6E; decide with the serverless question.
5. **Sharpest-setting ceiling** — §6D needs an explicit, written limit on how pointed
   the "hostile audience" output gets, given the non-partisan voice guardrail. Best
   settled by drafting two or three sample outputs at the edge and ruling on them, not
   in the abstract.

## 8. Non-goals (v1)

- Open-ended chat interface
- User accounts, saved sets, or personal history
- Generating claims about individual members of Congress not already in the vetted set
- Any output that asserts a fact not present in the claim library
