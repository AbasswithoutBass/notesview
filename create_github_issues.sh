#!/usr/bin/env bash
set -euo pipefail

REPO=${1:-}
if [ -z "$REPO" ]; then
  read -rp "Enter GitHub repo (owner/repo): " REPO
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: GitHub CLI ('gh') not found."
  echo "Please install it: https://cli.github.com/ and run 'gh auth login' to authenticate."
  exit 1
fi

TEMPLATE_DIR=".github/ISSUE_TEMPLATE"
if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "Error: $TEMPLATE_DIR not found. Make sure you're running this script at the project root where the .github templates exist."
  exit 1
fi

FILES=(
  "feature-keyboard.md"
  "feature-random-quiz.md"
  "feature-stats.md"
  "feature-teacher-mode.md"
  "chore-ui-design.md"
)

for f in "${FILES[@]}"; do
  path="$TEMPLATE_DIR/$f"
  if [ ! -f "$path" ]; then
    echo "Warning: template $path not found, skipping"
    continue
  fi

  # Extract title from frontmatter 'name: ...'
  title=$(grep '^name:' "$path" | head -n1 | sed 's/^name:[[:space:]]*//')
  # Extract labels from frontmatter 'labels: ...'
  labels=$(grep '^labels:' "$path" | head -n1 | sed 's/^labels:[[:space:]]*//')

  # Create temp body file without the YAML frontmatter (strip lines between the first '---' pair if present)
  body_tmp=$(mktemp)
  if grep -q '^---' "$path"; then
    # remove the first YAML frontmatter block
    awk 'BEGIN{in=0; first=1} /^---/{if(first){in=1; first=0; next} else {in=0; next}} !in{print}' "$path" > "$body_tmp"
  else
    cp "$path" "$body_tmp"
  fi

  echo "Creating issue: $title"
  if [ -n "$labels" ]; then
    gh issue create --repo "$REPO" --title "$title" --body-file "$body_tmp" --label "$labels" || echo "Failed to create issue: $title"
  else
    gh issue create --repo "$REPO" --title "$title" --body-file "$body_tmp" || echo "Failed to create issue: $title"
  fi

  rm -f "$body_tmp"
done

echo "Done. If issues failed, check gh auth and that the repo exists and you have permissions."