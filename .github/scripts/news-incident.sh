#!/usr/bin/env bash
# Decides whether this run is an incident, and emits what the workflow should email.
#
# Design rules, each one earned from a review finding:
#
# 1. EMAIL is the alert; a GitHub issue is only the state that prevents a repeat
#    (decisions/2026-09-15-alert-channels.md).
# 2. Suppression requires proof the email was SENT, not merely that an issue exists. The
#    workflow labels the issue `alert-sent` after the mail step succeeds. Keying dedupe on
#    the issue alone meant one SMTP failure silenced that incident permanently — and with
#    the mail secrets not yet in this repo, the first failure was the expected case.
# 3. `gh` must never kill this script before the outputs are written. A GitHub hiccup that
#    suppressed the email would be the worst possible failure: broken, and silent.
# 4. When a lookup fails we do not know whether an alert is pending, so we alert. Noise is
#    recoverable; silence is not.
# 5. Classification reads the DECISION, not just the outcome. `generation-failure` and
#    `judge-api-failure` publish headlines and look like an ordinary withheld summary, so
#    treating every `summary-withheld` as healthy would let a permanently broken judge
#    strip summaries forever with green runs and no alert.
#
# Called by fetch-news.yml with OUTCOME, DECISION, RUN_URL, GH_TOKEN.
set -uo pipefail   # deliberately NOT -e: see rule 3.

LABEL="news-incident"
SENT_LABEL="alert-sent"
REPO="${GITHUB_REPOSITORY}"
OUTCOME="${OUTCOME:-}"
DECISION="${DECISION:-}"
PAGE="https://www.representdc.org/news"

notify="none"
subject=""
body=""
issue_number=""

# Rule 3: whatever happens below, the workflow gets its outputs.
write_outputs() {
  {
    echo "notify=$notify"
    echo "issue_number=$issue_number"
    echo "subject=$subject"
    echo "body<<EOF_NEWS_BODY"
    echo "$body"
    echo "EOF_NEWS_BODY"
  } >> "$GITHUB_OUTPUT"
}
trap write_outputs EXIT

# Operational failures hide behind an ordinary-looking outcome (rule 5).
case "$DECISION" in
  generation-failure|judge-api-failure)
    OPERATIONAL=1 ;;
  *)
    OPERATIONAL=0 ;;
esac

# A judge flag or a gate withholding is the design working, not a fault.
if [ "$OPERATIONAL" = "1" ]; then
  KEY="degraded"
  TITLE="News pipeline: summaries are failing"
  BODY="Summaries are not being produced (reason: ${DECISION}). The page is publishing
headlines with no summary, which is safe — but it will keep doing that until this is fixed.

Run log: $RUN_URL"
else
  case "$OUTCOME" in
    published|published-empty|summary-withheld|summary-disabled|dry-run)
      KEY="" ;;
    pushed-not-live)
      KEY="not-live"
      TITLE="News pipeline: published but not live"
      BODY="The news feed was pushed, but $PAGE never served this run.
The page may be showing older news.

Run log: $RUN_URL" ;;
    not-published)
      KEY="not-published"
      TITLE="News pipeline: nothing published"
      BODY="A run ended without publishing (reason: ${DECISION:-unknown}).
The page still shows the last feed that published, and any summary older than 72 hours
hides itself.

Run log: $RUN_URL" ;;
    *)
      KEY="failed"
      TITLE="News pipeline: run failed"
      BODY="The run failed before recording an outcome. The page is unchanged unless the
failure came after publishing — the run log says which.

Run log: $RUN_URL" ;;
  esac
fi

ALL_TITLES=(
  "News pipeline: summaries are failing"
  "News pipeline: published but not live"
  "News pipeline: nothing published"
  "News pipeline: run failed"
)

# Prints the issue number, or "?" when the lookup itself failed (rule 4).
find_open_issue() {
  local out
  if ! out=$(gh issue list --repo "$REPO" --state open --label "$LABEL" --search "$1 in:title" \
      --json number,title,labels 2>/dev/null); then
    echo "?"
    return
  fi
  echo "$out" | jq -r --arg t "$1" 'map(select(.title == $t)) | .[0].number // empty'
}

has_sent_label() {
  local out
  out=$(gh issue view "$1" --repo "$REPO" --json labels 2>/dev/null) || { echo "?"; return; }
  echo "$out" | jq -r --arg l "$SENT_LABEL" 'if (.labels | map(.name) | index($l)) then "yes" else "no" end'
}

gh label create "$LABEL" --repo "$REPO" --color B60205 \
  --description "An unattended news-pipeline problem needing attention" --force >/dev/null 2>&1
gh label create "$SENT_LABEL" --repo "$REPO" --color CCCCCC \
  --description "The alert email for this incident was sent" --force >/dev/null 2>&1

if [ -z "$KEY" ]; then
  # Healthy. Close anything open and say so once — recovery is worth one email, because it
  # tells her she can stop thinking about it.
  for open_title in "${ALL_TITLES[@]}"; do
    number=$(find_open_issue "$open_title")
    [ -z "$number" ] && continue
    [ "$number" = "?" ] && continue
    gh issue comment "$number" --repo "$REPO" --body "✅ Recovered — a later run published successfully. Closing." >/dev/null 2>&1
    gh issue close "$number" --repo "$REPO" >/dev/null 2>&1
    notify="recovered"
    issue_number="$number"
    subject="✅ RepresentDC news: recovered"
    body="The news pipeline is working again, so the earlier problem has cleared.
Nothing to do.

$PAGE"
  done
  [ "$notify" = "none" ] && echo "Healthy ($OUTCOME / ${DECISION:-none}); nothing to report."
  exit 0
fi

existing=$(find_open_issue "$TITLE")

if [ "$existing" = "?" ]; then
  # Rule 4: the lookup failed, so we cannot know whether she has been told. Tell her.
  notify="open"
  subject="⚠️ RepresentDC news: ${TITLE#News pipeline: }"
  body="$BODY

(GitHub issue lookup failed during this run, so this email may repeat one you have
already had.)"
  echo "Lookup failed; alerting rather than risking silence."
  exit 0
fi

if [ -n "$existing" ]; then
  issue_number="$existing"
  sent=$(has_sent_label "$existing")
  if [ "$sent" = "yes" ]; then
    echo "Incident '$KEY' already open as #$existing and already emailed — staying quiet."
    exit 0
  fi
  # Open but never successfully emailed (rule 2): try again.
  notify="open"
  subject="⚠️ RepresentDC news: ${TITLE#News pipeline: }"
  body="$BODY

Nothing is urgent — the site keeps working and stale summaries hide themselves after
72 hours. You will not get another email about this until it recovers."
  echo "Incident '$KEY' open as #$existing but not yet emailed — retrying the email."
  exit 0
fi

created=$(gh issue create --repo "$REPO" --title "$TITLE" --label "$LABEL" --assignee antzzz10 \
  --body "@antzzz10

$BODY

This issue stays open until a run succeeds, and closes itself then. Comment \`/withhold\`
here to pull a live summary.

To stop summaries entirely while this is unresolved: Settings → Secrets and variables →
Actions → Variables → set \`NEWS_SUMMARY_ENABLED\` to \`false\`." 2>/dev/null)

# Even if issue creation failed, the email still goes out (rule 3).
issue_number=$(echo "$created" | grep -oE '[0-9]+$' || true)
notify="open"
subject="⚠️ RepresentDC news: ${TITLE#News pipeline: }"
body="$BODY

Nothing is urgent — the site keeps working and stale summaries hide themselves after
72 hours. You will not get another email about this until it recovers.

${created:+Track it here: $created}"
echo "Opened incident '$KEY'${issue_number:+ as #$issue_number}."
