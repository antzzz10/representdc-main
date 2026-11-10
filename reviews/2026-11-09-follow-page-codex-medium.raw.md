**0 BLOCKER, 1 MATERIAL, 2 NOTE findings.**

- **MATERIAL — Weekly-change promise exceeds the data.** [Follow.jsx:72–75](src/Follow.jsx:72): `stats.json` contains current counts and stages, without dated transitions or previous snapshots. An assistant cannot reliably answer “what changed this week” from these endpoints alone. Change the invitation to “ask for the current picture.”

- **NOTE — Accessibility structure.** [Follow.jsx:38](src/Follow.jsx:38): headings jump from `h1` to `h3`, and the page lacks a `main` landmark. Use `h2` for the cards and wrap the content in `main`. Whole-card links are valid, contain no nested controls, and have visible keyboard focus.

- **NOTE — Unqualified completeness claim.** [Follow.jsx:14](src/Follow.jsx:14): “Every bill” promises exhaustive coverage, while discovery uses relevance scoring and human review. “Track congressional bills targeting D.C.’s laws, budget or government” avoids that unsupported guarantee.

Otherwise, the copy has no hardcoded fast-moving numbers or editorial self-description; the hero adds distinct information. The route matches the existing page-generation script.

Both public JSON endpoints returned **HTTP 200**, with today’s timestamps: [bill stats](https://billtracker.representdc.org/api/stats.json), [news](https://www.representdc.org/api/news.json). Repository workflows support daily Congress.gov checks and twice-daily news updates.

**Verification limits:** live `/news` and partner-map requests failed in this environment, although both routes exist locally. Phone CSS was inspected, but browser rendering was blocked by filesystem permissions. Targeted ESLint passed. No files changed.