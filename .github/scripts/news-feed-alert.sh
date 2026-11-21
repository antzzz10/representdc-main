#!/usr/bin/env bash
# Keeps ONE open issue while any news source has been failing for two days or more, and
# closes it only when no source is failing at all.
#
# Why this exists: G5 fails a run only when every source fails, so one dead feed changes
# nothing a reader or the owner can see. Roll Call's feed returned 404 from 2026-11-18 to
# 2026-11-21 with green runs throughout. fetch-news.mjs tracks how long each source has
# been failing (api/news-archive.json, feedHealth) and passes two lists here.
#
# Separate from news-incident.sh on purpose. That script decides whether the RUN was an
# incident and drives the alert email; a slow feed failure is not a run incident (the run
# publishes normally), and folding it in would have meant reworking that script's dedupe
# and recovery rules. This one only opens, updates or closes its own issue:
#
# - One issue, found by exact title and label. A run with the same lists stays silent; a
#   changed list adds one comment and rewrites the body.
# - OPENED only when a source passes two days (FEED_ALERT). CLOSED only when nothing is
#   failing at all (FEED_FAILING_NOW empty). In between, for example A recovers while B
#   has been down one day, the issue stays open and says exactly that. It never
#   announces a recovery while a source is still down.
# - Every gh call is checked. A failure is logged and the script exits 1. The workflow
#   step is continue-on-error, so a GitHub hiccup shows in the log without turning a
#   published run red, and the next run tries again.
# - Retries never duplicate. The body is written LAST and is the record of "done": until
#   it matches, the next run repeats the update, and it skips the comment if the issue's
#   newest comment already carries the same text.
# - The owner is told by GitHub's own notification (assignee and mention). No email step
#   is wired to this, unlike run incidents.
# - FEED_ALERT_CHECKED must be "true". The run sets it only after it has fetched the
#   feeds and read the archive, so empty lists from a run that died earlier are never
#   read as "all sources recovered".
# - A preview (DRY_RUN) never opens or closes anything, as in news-incident.sh rule 6.
#
# Called by fetch-news.yml with FEED_ALERT, FEED_FAILING_NOW, FEED_ALERT_CHECKED, DRY_RUN,
# RUN_URL, GH_TOKEN.
set -uo pipefail   # deliberately NOT -e: each gh call is checked by hand, see above.

LABEL="news-feed-failing"
TITLE="News pipeline: a source feed keeps failing"
REPO="${GITHUB_REPOSITORY}"
RECOVERED="Recovered: every source fetched on this run. Closing."
# Bounded, and already reduced to plain characters by fetch-news.mjs.
LONG="$(printf '%s' "${FEED_ALERT:-}" | cut -c1-2000)"
NOW="$(printf '%s' "${FEED_FAILING_NOW:-}" | cut -c1-2000)"

fail() {
  echo "::error::Failing-feed issue: $1. Nothing is lost: the next run tries again."
  exit 1
}

if [ -n "${DRY_RUN:-}" ]; then
  echo "Preview run; feed alert left untouched."
  exit 0
fi
if [ "${FEED_ALERT_CHECKED:-}" != "true" ]; then
  echo "The run did not get as far as checking feed health; feed alert left untouched."
  exit 0
fi
# A source past two days is by definition failing now. If the second list did not arrive,
# fall back to the first rather than read "nothing failing" into a missing value.
[ -z "$NOW" ] && NOW="$LONG"

lookup=$(gh issue list --repo "$REPO" --state open --label "$LABEL" --search "$TITLE in:title" \
  --json number,title,body 2>/dev/null) || fail "could not look up the open issue"
existing=$(printf '%s' "$lookup" | jq -r --arg t "$TITLE" 'map(select(.title == $t)) | .[0].number // empty') \
  || fail "could not read the issue lookup"

# Prints the newest comment's text. Used to skip a comment a failed earlier run already made.
last_comment() {
  local out
  out=$(gh issue view "$1" --repo "$REPO" --json comments 2>/dev/null) || return 1
  printf '%s' "$out" | jq -r '.comments | last | .body // ""' | tr -d '\r'
}

# Comments once: not again if the newest comment is already this text.
comment_once() {
  local newest
  newest=$(last_comment "$1") || fail "could not read the comments on #$1"
  if [ "$newest" = "$2" ]; then
    echo "Comment already on #$1 from an earlier attempt; not repeating it."
    return 0
  fi
  gh issue comment "$1" --repo "$REPO" --body "$2" >/dev/null 2>&1 || fail "could not comment on #$1"
}

if [ -z "$NOW" ]; then
  if [ -z "$existing" ]; then
    echo "All sources healthy; nothing to report."
    exit 0
  fi
  comment_once "$existing" "$RECOVERED"
  gh issue close "$existing" --repo "$REPO" >/dev/null 2>&1 || fail "could not close #$existing"
  echo "All sources healthy; closed #$existing."
  exit 0
fi

# Something is failing, but nothing has reached two days, and no issue is open: too
# early to raise one.
if [ -z "$LONG" ] && [ -z "$existing" ]; then
  echo "A source is failing, but for less than two days; nothing to report yet."
  exit 0
fi

# Indented four spaces so the lists render as code, not Markdown.
indent() { printf '%s\n' "$1" | sed 's/^/    /'; }
# Sources failing now that have not reached two days.
RECENT="$(printf '%s\n' "$NOW" | grep -vxF -f <(printf '%s\n' "$LONG") || true)"

if [ -n "$LONG" ]; then
  STATE="These news sources have failed on every run for two days or more:

$(indent "$LONG")"
  if [ -n "$RECENT" ]; then
    STATE="$STATE

Also failing, for less than two days so far:

$(indent "$RECENT")"
  fi
else
  STATE="No source has now been failing for two days or more: the ones listed here before
are fetching again. This stays open because another source is failing, for less than two
days so far:

$(indent "$RECENT")"
fi

BODY="@antzzz10

<!-- state -->
$STATE
<!-- /state -->

The page keeps publishing from the other sources, so nothing is broken for readers. But
no articles are coming in from the ones above. The usual cause is a feed address that has
moved: check it in a browser, then update the list in \`scripts/news/feeds.mjs\`.

This issue closes itself on the first run where every source fetches.

Latest run: ${RUN_URL:-}"

if [ -n "$existing" ]; then
  previous=$(printf '%s' "$lookup" | jq -r --arg t "$TITLE" 'map(select(.title == $t)) | .[0].body // ""' | tr -d '\r') \
    || fail "could not read the issue body"
  # Whole-block containment, not grep: grep reads a multi-line pattern as alternatives,
  # so one unchanged source would have hidden a newly failing one.
  if [[ "$previous" == *"<!-- state -->
$STATE
<!-- /state -->"* ]]; then
    echo "Feed alert already open as #$existing with the same sources; staying quiet."
    exit 0
  fi
  # Comment first, body last: the body is what marks this update as done (see header).
  comment_once "$existing" "The failing sources changed.

$STATE"
  gh issue edit "$existing" --repo "$REPO" --body "$BODY" >/dev/null 2>&1 || fail "could not update #$existing"
  echo "Updated feed alert #$existing."
  exit 0
fi

gh label create "$LABEL" --repo "$REPO" --color FBCA04 \
  --description "A news source has been failing for two days or more" --force >/dev/null 2>&1 \
  || fail "could not create the label"
created=$(gh issue create --repo "$REPO" --title "$TITLE" --label "$LABEL" --assignee antzzz10 --body "$BODY" 2>/dev/null) \
  || fail "could not open the issue"
echo "Opened feed alert${created:+: $created}."
exit 0
