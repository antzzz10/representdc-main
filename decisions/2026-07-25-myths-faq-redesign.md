# Decision: Myths & FAQ redesign — combined list, aggregated sources, fact chips

**Date:** 2026-07-25
**Context:** Follow-up review after the `/how-congress-controls-dc` build. Four
requested tweaks: combine the two separate myths/FAQ lists into one, aggregate the
per-section source notes into one block at the bottom (and codify that as a guardrail,
since it's now the second page to adopt the pattern), sweep for AI-authoring tells
(the "No persuasion pitch—just direct, sourced rebuttals" subheading specifically),
add selected links reusing sources already vetted elsewhere on the site, and pair
"fun facts" with the myths — with an explicit ask to consider layout so the page
doesn't read as one homogeneous wall of text.

## Structure

**Options considered for the "fun facts":**
1. A separate stat band (like `/how-congress-controls-dc`'s bill-type grid), placed once
2. A small sourced fact chip embedded directly inside each paired myth/FAQ card
   (chosen)

**Chosen:** Option 2 — a `.myth-fact` chip (number + label + one-line detail) appended
to whichever list item it actually supports. This satisfies "pair with the myths"
literally (a separate band would only be thematically adjacent, not paired), and gives
visual variety spread through the whole list rather than in one lump — five of six
myths and one FAQ ("too small or too subsidized") got a chip; the rest were left alone
rather than forcing a fact where none fit:

| Item | Fact | Source |
|---|---|---|
| Myth 1 (residents work for govt/military) | 18% of employed D.C. residents work in public administration | Census via Data USA |
| Myth 2 (doesn't pay taxes) | Highest per-capita federal tax rate in the U.S. | Rep. Norton's office |
| Myth 3 (same rights) | 499 D.C. residents died in WWI service | National Park Service |
| Myth 5 (too small) | 129,831 children live in D.C. | DC Action |
| Myth 6 (belongs to all Americans) | D.C.'s National Guard is 1 of 54 reporting to the President, not a governor | DC National Guard |
| FAQ "too small or too subsidized" | 250 public schools operate in D.C. | OSSE (edscape.dc.gov) |

Myth 4 ("proximity gives influence") is a reasoning-based myth with no natural
statistic to pair — left without a chip rather than forcing one.

## Sourcing verification

Every new figure above was checked against a primary or DEVELOPMENT-GUIDELINES.md-tier
source before use — several of the user's example figures were close to correct but
not copied verbatim without checking (e.g. "~250 K-12 schools" was confirmed via OSSE's
own SY2025-26 count, not assumed). Two example claims the user raised were **dropped**
rather than approximated: an "average federal tax paid" dollar figure (couldn't get a
clean primary-source number — `norton.house.gov` and `census.gov` both blocked
automated fetches, and a secondary NTU/moneyrates.com figure wasn't solid enough to
publish) and a "~200k served since WWI" cumulative figure (NPS's own memorial page only
documents the 499 who died, not a total-served count; used the verified figure instead
of the broader unverified one). The tax myth still gets a qualitative "highest
per-capita" fact instead, matching language already live on the site pre-dating this
session.

## Selected links

Three items got an inline link, reusing sources already established elsewhere on the
site rather than new research: Myth 3 links to `/how-congress-controls-dc` (the exact
mechanism it's describing), FAQ "want statehood" links to `dcvote.org` (already cited
elsewhere on this same page), FAQ "achievable" links to `/the-case`. Items whose paired
fact chip already carries a citation weren't given a duplicate inline link.

## New guardrail

Added to `DESIGN-GUARDRAILS.md`: aggregate sources at the bottom of a content page via
the shared `.sources-block`/`.sources-list` classes, not per-fact. Promoted those
classes from `HowCongressControlsDC.css` into the shared `App.css` since two pages now
use the identical pattern.

## Implementation

- `src/MythsAndFaq.jsx` — single `ITEMS` array (type `myth`/`faq`) rendered as one list;
  removed the two separate section headers/intros and their per-section source notes.
- `src/MythsAndFaq.css` — removed now-unused `.myth-sec-alt`/`.myth-source-note`; added
  `.myth-fact*` chip styles (mobile: chip stacks vertically under 480px).
- Verified with Playwright: 10 items render in one list/one section, AI-tell phrase
  confirmed absent, 6 fact chips present, the Myth 3 internal link navigates correctly,
  both desktop and 390px mobile renders checked.

## Follow-up: myth vs. FAQ framing, and categorization

Same day, same session. Asked to step back on whether myths and FAQs are meaningfully
different content types, and to propose categorization for findability as the list
grows.

**Myth conversion — partial, not full.** Two of the four FAQs were already rhetorical
objections in question form and converted cleanly to myth 7/8: "isn't D.C. statehood
unconstitutional?" → *"D.C. statehood would be unconstitutional"*; "isn't D.C. too
small or too subsidized?" → *"D.C. is too small and too subsidized to be a state."*
The other two ("do residents want statehood," "is it achievable") were **left as
questions** — converting them would have meant inventing a strawman claim
("residents don't want it," "it's just a slogan") more combative than the source
material actually supports, just to force uniformity. List is now 8 myths + 2 FAQs.

**Categorization — held.** Proposed two options (by theme: money/who-lives-here/
rights/federal-status/feasibility; by objection type: factual/fairness/legal/
feasibility). Recommended "by theme" if/when built, but decided the 10-item flat list
doesn't need it yet — revisit if the list heads toward 15–20+ items. Tracked as an
open item in `WHATS-NEXT.md` rather than built now.
