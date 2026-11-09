# Decision: keep a permanent archive of official bill histories

**Date:** 2026-11-08 · **Decided by:** Andria · **Built:** `antzzz10/representdc-data` (private)

## Decision

RepresentDC keeps a permanent archive of the official legislative history of every measure it tracks, in a separate data repository. It runs alongside the bill tracker and doesn't replace it yet.

## Why

Andria asked why histories weren't stored. She wanted trends and change patterns, a shareable authoritative statehood and home-rule dataset, and to stop re-fetching everything from Congress.gov. The tracker kept only its last 30 monitoring checks, which held a few status fields and no full action history. On July 11 the site's "accelerating" claim had to be cut for lack of that history. Codex (high) agreed: `reviews/2026-11-08-bill-history-archive-codex-high.raw.md`.

## What was decided (Andria's answers, 2026-11-08)

1. **A new repository,** created private. Visibility is hers to change by hand.
2. **Seed:**
   - the 134 measures the tracker curates in the 119th Congress;
   - the Washington, D.C. Admission Act from the 115th to the 119th Congress.

   **Next step:** go back 10 years, to the 114th Congress, covering her time on the DC Dems.
3. **Licence deferred.** Methodology is documented now, and the README states: public use allowed with acknowledgment and a link back to representdc.org.
4. **`fast-xml-parser`** approved as a dependency.
5. **Switch-over:** the tracker reads from the archive after a month in which the two agree. That's possible because the archive updates daily from GovInfo.

## How it works

- **Source:** GovInfo BILLSTATUS bulk data, which needs no API key.
- **Daily:** re-download only the measures GovInfo's sitemaps mark as changed. Monthly: re-download everything.
- **Kept in the repo:**
  - every distinct official file, gzipped;
  - normalized records;
  - RepresentDC's labels, kept separate from the facts;
  - CSV exports;
  - a coverage report against the tracker.
- **Reviews:** Codex medium and high passes on the build, then a recheck; all findings fixed (`reviews/2026-11-08-bill-archive-*`).

## Rejected alternatives

- **Keep the 30-check log only.** It can't support trends, sharing, or verification.
- **Store histories inside the tracker repository.** That breaks the tracker's rules on daily diff churn and page size.
- **Raw files only as monthly release assets.** Versions seen between snapshots would be lost.

## Found while building

The archive showed two errors on the live tracker. Both were **fixed and deployed on 2026-11-08** (`dc-bills-tracker` `42532e3`, synced by monitor run `b5c2472`; see that repo's `decisions/2026-11-08-official-action-dates-and-hr5525.md`):
- **H.R. 5525 showed as "passed the House", but it only cleared committee.** The published count is now 14, not 15.
- **The monitor stamped "last action" with the date it noticed a change,** not the official action date. It now copies Congress.gov's own latest action; all 78 monitored bills match the archive.
