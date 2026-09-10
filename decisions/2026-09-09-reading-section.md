# Decision: New "Reading" section for long-form articles, launched with a real guest piece

**Date:** 2026-09-09
**Context:** An About page (`/about`, uncommitted as of this session) was built as a
precursor to crediting external contributors. The next step was deciding how long-form
articles (history of statehood, "Republicans for statehood," etc.) get a home on the
site, starting with a dedicated section before interspersing links elsewhere.

## Naming

**Chosen:** "Reading," not "Articles." Andria's call — she expects this to eventually
merge into a broader "Resources" section, and "Reading" doesn't collide with that future
rename the way "Articles" would.

## Structure

**Chosen:** One JSX file per article (`src/reading/<ArticleName>.jsx`), not a shared
data array. Long-form prose with embedded headings, lists, and tables reads better as
its own component — this mirrors how `About.jsx` is its own file rather than a `TEAM`-style
array entry. A lightweight registry, `src/data/reading.js` (`READING`), feeds the
`/reading` hub's cards (title, dek, author, date, route) without needing the full body
in memory on the hub page.

**Routes:** `/reading` (hub, reusing the existing `preview-card`/`preview-grid` classes
from `StatehoodCurious`) + one explicit route per article
(`/reading/<slug>`), matching the site's existing pattern of explicit top-level routes
rather than a dynamic `:slug` + lookup table.

## Placement

**Chosen:** Both a permanent Nav link ("Reading") and a card in `/statehood-curious`.
Unlike `/about`, which launched link-only and deliberately stayed out of Nav, Andria
wants Reading discoverable immediately since it's meant to be an ongoing content pillar
with outside contributors, not a soft-launch page.

## Byline / attribution

**Chosen:** A simple byline line ("By [Name]"), not the `About` page's team-card
treatment (photo circle, role, bio). Lighter-weight, doesn't commit to a heavier guest-author
profile format before there's a body of contributors to justify it.

**Considered:** Reusing the `TeamCard` shape for guest authors — rejected for now as
more commitment than the first piece warrants; can revisit once Reading has more than
one contributor.

## Citation standard for guest pieces

The site's established sourcing bar (`CLAUDE.md`'s Content standards — every fact
deep-linked to a primary source, or cut) was written for site-authored content: Myths,
fact cards, org descriptions. A guest essay is different — the standard applied here is
**full attribution to the original piece and author** (byline, publication, date, a link
to the original at the bottom) and **no AI-generated summary standing in for it**, not
per-claim primary-source re-sourcing of another author's argument and quotes. This is a
narrower promise than "every fact cited to a primary source" and worth being explicit
about if Andria wants the two standards reconciled later — an AI summary is not the same
failure mode as an un-fact-checked guest quote, but this consciously treats them
differently rather than applying the Myths-page bar to guest content.

## First article

**"Blast From the Past: Republicans Supported Washington, D.C., Autonomy"** by Miriam
Edelman, originally published on WashingtonDCNow (dc-now.org), June 11, 2024. Edelman is
described as an actual collaborating author for the site, used as the real first test
of the Reading section rather than placeholder content — consistent with the project's
existing "no placeholder slots" pattern (see the `TEAM` array in `About.jsx`).

**Fidelity note:** the reprint at `src/reading/RepublicansSupportedAutonomy.jsx` is
adapted, not a byte-for-byte transcript — a few "See the below graph" references were
dropped where no chart data was supplied (only the two data tables, which are
reproduced in full), and some sentences were lightly copy-edited for flow. A couple of
apparent source typos (e.g., a governor's name) were silently corrected during
transcription. Given this is meant to be a full, credited reprint of another author's
work rather than site-authored copy, this is flagged for Andria to verify against the
original before treating the on-site version as authoritative — a closer word-for-word
pass may be warranted before this is treated as final.
