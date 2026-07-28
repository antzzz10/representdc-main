# Domain-wide standards and rollout state

**Date:** 2026-07-27
**Scope:** all three RepresentDC properties — `representdc-main`,
`dc-bills-tracker`, `dc-statehood-pledge`.

Several decisions were made during bill-tracker work over 2026-07-26/27 that are
really **domain-level policy**, not tracker-specific. Recording them here so they
apply to all three sites and so the tracker repo can be cleared for other work.

Per-repo detail lives in each repo's own `decisions/`. This file is the domain view.

---

## Current state

| | representdc-main | dc-bills-tracker | dc-statehood-pledge |
|---|---|---|---|
| Design tokens | ✅ canonical source | ✅ migrated 2026-07-26 | ❌ **151 raw hex, 0 tokens** |
| Three-font system | ✅ | ✅ | ❌ |
| Lucide icons only | ✅ | ✅ | ❌ **165 emoji/glyphs** |
| React Router | ✅ | ❌ single-page | ✅ |
| Cloudflare pageviews | ✅ | ✅ | ✅ |
| Custom event tracking | ❌ | ✅ built, inert | ❌ |
| `site-batch` profile | ❌ | ✅ | ❌ |

The pledge site is the outlier on everything visual. It was explicitly out of scope
for the 2026-07-10 design pass and has stayed there.

---

## Decisions that now apply to all three sites

### 1. Design system rollout is now domain policy, not main-only

`DESIGN-GUARDRAILS.md` § Repo/package structure still says *"This design pass
currently covers representdc-main only... don't assume parity until that decision is
made and documented."* That's now out of date: **dc-bills-tracker was migrated
2026-07-26** (see its `decisions/2026-07-26-design-system-rollout.md`).

**Decision: the design system applies to all three properties.** `dc-statehood-pledge`
is the remaining gap and should be migrated on the same terms — tokens copied, not
packaged; fonts loaded; Lucide replacing glyphs; sentence case; "D.C." in body copy.

Tokens remain **copied per repo**, not extracted into a shared package (2026-07-10,
unchanged). Token *values* must stay byte-identical; only header comments may differ.

### 2. Analytics: cookieless PostHog, one project across all three sites

Full reasoning and rejected options in
`dc-bills-tracker/decisions/2026-07-27-analytics.md`. The parts that generalise:

- **PostHog, loaded by async snippet — never the npm package.** `posthog-js` is
  ~73 kB gzip. Third-party SDKs do not go in our bundles.
- **`persistence: 'memory'` (cookieless), `autocapture: false`,
  `disable_session_recording: true`, `capture_pageview: false`.** Cloudflare Web
  Analytics keeps doing pageviews on all three sites.
- **One PostHog project across all three subdomains, not three.** Every event carries
  a `site` property (`main` | `billtracker` | `pledge`). The three properties are one
  product family and the interesting questions are cross-site — does the main site
  actually drive people to the tracker? do candidate-tracker visitors come from
  `/take-action`? Three separate projects make those questions unanswerable.
- Each site routes all calls through its own `src/lib/analytics.js`, so the vendor is
  swappable in one file per repo.

**Cloudflare Zaraz was rejected domain-wide.** It is a tag manager, not an analytics
backend — it needs a destination regardless — and it requires a Cloudflare-proxied
domain. None of the three are proxied: all resolve straight to GitHub Pages
(185.199.108–111.153, `server: GitHub.com`, no `cf-ray`).

### 3. Privacy posture is a standing rule, not a per-site choice

This audience is people researching government action against their own city. For
every property:

- **No cookies, therefore no consent banner.**
- **No session recording, ever.** It defaults to *on* in most tools — turn it off
  explicitly.
- **Never track search terms.** A query can reveal what a visitor is personally
  worried about.
- **No analytics vendor that routes behaviour to an ad business.** This is why GA4
  was rejected despite being free and capable.

### 4. Bundle discipline

Third-party SDKs load async and stay out of the bundle. Any dependency adding more
than ~10 kB gzip needs a reason recorded in a decision note.

Two live examples of why: the design-system rollout accidentally added **173 kB
gzip** by importing Lucide as a namespace (`import * as icons`), and choosing the
PostHog npm package over its snippet would have added **73 kB** for four events.

> **Open item:** `representdc-main/src/components/Icon.jsx` still uses
> `import * as icons from 'lucide-react'`. It is very likely shipping the same
> ~173 kB gzip of dead icon code. `dc-bills-tracker/src/components/Icon.jsx` has the
> fixed pattern — an explicit icon map — to copy.

### 5. About page is canonical at `representdc.org/about`

**Decision: one About page for the domain, on the main site.** Not duplicated onto
tool subdomains. All three footers link to it.

It goes here because `representdc-main` is the org's front door and already has a
router; the bill tracker has none, so hosting a page there would mean adding React
Router or a multi-page Vite build for a single page.

Draft copy and full spec: `dc-bills-tracker/docs/about-page-draft.md` — written to be
built here. Its numbers are wired to `useBillStats()` rather than hardcoded.

### 6. Cross-repo data contracts (previously undocumented)

`dc-bills-tracker` publishes two APIs that `representdc-main` consumes at runtime:

| Endpoint | Produced by | Consumed by |
|---|---|---|
| `billtracker.representdc.org/api/stats.json` | `generate-stats.js` (build step) | `main/src/hooks/useBillStats.js` |
| `billtracker.representdc.org/api/news.json` | `fetch-news.js` (6 AM/6 PM UTC) | `main/src/News.jsx` |

**Consequences, both learned the hard way:**

- Deleting the tracker's news pipeline breaks main's `/news` page. The tracker's
  *UI* news section was removed 2026-07-26; the *pipeline* must stay.
- Any published count has two consumers and they must derive from one filter. The
  tracker showed 93 while main published 96 for a period, because `generate-stats.js`
  counted unreviewed provisional bills and the site didn't. Now guarded by
  `lint-bills.js` check 7.

### 7. Parallel work: one profile per repo

The `site-batch` skill (`~/.claude/skills/site-batch/`) holds a project-independent
method; each repo carries `.claude/site-batch-profile.md` with its own cross-cutting
files, verification commands, deploy path and traps. Only `dc-bills-tracker` has one.

Triage is by **blast radius, not effort**. Fan out only isolated file-scoped work and
read-only investigation; keep shared visual language, judgment calls, and anything
whose hard part is verification serial.

---

## Next steps, sequenced

**Waiting on Andria (minutes each, both block otherwise-finished work):**

1. **PostHog project + key.** Free tier, 1M events/mo, no card. Set `VITE_POSTHOG_KEY`
   locally *and as a CI variable* in every repo that uses it — the tracker is rebuilt
   on a schedule by `monitor-bills.yml` and `fetch-news.yml`, and a missing CI key
   means every automated deploy silently ships the inert placeholder over a good one.
2. **Kit v4 API key.** Sole blocker on the tracker's weekly digest; its cron has been
   commented out since 2026-07-12 after five weeks of 401s on a v3 key.

**Then, in rough dependency order:**

3. **Fix `Icon.jsx` in representdc-main** (§4). Smallest change with the largest
   measured payoff on the whole domain.
4. **Build `/about`** (§5). Draft is written; also fixes the stale hardcoded `74`
   fallback in `useBillStats.js`.
5. **Update `DESIGN-GUARDRAILS.md`** — see below.
6. **Add analytics to main and pledge** (§2), once the key exists, with the `site`
   property set.
7. **Migrate `dc-statehood-pledge`** (§1) — the largest remaining piece: 151 raw hex
   values, 165 glyphs, no tokens or fonts. Should follow the tracker's rollout as a
   template.
8. **Write `site-batch` profiles** for main and pledge (§7).

---

## Edits `DESIGN-GUARDRAILS.md` needs

Not applied here — that file was being actively edited in a parallel session and a
new file cannot conflict where an edit can. To be applied by whoever next opens it:

- **§ Repo/package structure:** replace the "covers representdc-main only" paragraph
  with the §1 decision above; note dc-bills-tracker migrated 2026-07-26 and pledge is
  outstanding.
- **New § Privacy and analytics:** the §3 standing rules.
- **New § Bundle discipline:** the §4 rule, with the two measured examples.
- **§ Cross-site integrity:** add the §6 data contracts — they are currently recorded
  only in a code comment in the tracker's `App.jsx`.
