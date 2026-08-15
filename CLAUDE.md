# RepresentDC — Landing Page

This repo is the main site of **representdc.org**, a three-app DC statehood advocacy platform (all built with Claude Code, hosted on GitHub Pages with CNAME subdomains).

| App | Directory | URL | Purpose |
|-----|-----------|-----|---------|
| **Landing Page** | `representdc-main/` (this repo) | www.representdc.org | Advocacy site with loss-framing messaging, live bill stats, CTAs to the other tools |
| Bill Tracker | `../dc-bills-tracker/` | billtracker.representdc.org | 71+ anti-DC bills, automated Congress.gov monitoring |
| Candidate Tracker | `../dc-statehood-pledge/` | candidates.representdc.org | 2026 candidate questionnaire responses |

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

**Git:** commit directly to `main` — parallel Claude sessions share this one checkout, so
`git checkout -b` silently moves the other session onto your branch. Stage named paths
only; another session's in-progress edits are often sitting dirty in the tree.
