#!/usr/bin/env bash
# Generates skills/INDEX.md from skill frontmatter category fields.
# Run: bash scripts/generate-skills-index.sh
# Categories: core (workflow/discipline), domain (specialized), meta (skills about skills)

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_DIR="${REPO_ROOT}/skills"
INDEX="${SKILLS_DIR}/INDEX.md"

# Collect skills by category
core_list=""
domain_list=""
meta_list=""
uncategorized_list=""

for dir in "${SKILLS_DIR}"/*/; do
  skill_name=$(basename "$dir")
  skill_file="${dir}SKILL.md"
  [ -f "$skill_file" ] || continue

  category=$(grep "^category:" "$skill_file" 2>/dev/null | head -1 | sed 's/category:[[:space:]]*//' | tr -d '\r')

  # Extract first line of description
  desc_line=$(awk '/^description:/{flag=1; sub(/^description:[[:space:]]*/,""); sub(/^>-?/,""); if($0!="") print; flag=1; next} flag && /^  / {sub(/^[[:space:]]+/,""); print; exit} flag && /^[a-z]/ {exit}' "$skill_file" | head -1 | tr -d '"')
  desc_short=$(printf '%s' "$desc_line" | cut -c 1-120)

  line="| \`${skill_name}\` | ${desc_short} |"
  case "$category" in
    core)    core_list+="${line}"$'\n' ;;
    domain)  domain_list+="${line}"$'\n' ;;
    meta)    meta_list+="${line}"$'\n' ;;
    *)       uncategorized_list+="${line}"$'\n' ;;
  esac
done

# Write index
cat > "$INDEX" <<EOF
# Hyperstack Skills Index

Auto-generated from each skill's frontmatter \`category\` field.
Regenerate with: \`bash scripts/generate-skills-index.sh\`

Categories:
- **core** — workflow, discipline, and gates used on every task
- **domain** — specialized skills for specific contexts (visual, components, security, docs)
- **meta** — skills about skills (bootstrap, testing)

---

## Core (workflow + discipline)

| Skill | Description |
|---|---|
$(printf '%s' "$core_list")

## Domain (specialized context)

| Skill | Description |
|---|---|
$(printf '%s' "$domain_list")

## Meta (skills about skills)

| Skill | Description |
|---|---|
$(printf '%s' "$meta_list")
EOF

if [ -n "$uncategorized_list" ]; then
  cat >> "$INDEX" <<EOF

## Uncategorized (missing \`category:\` field)

| Skill | Description |
|---|---|
$(printf '%s' "$uncategorized_list")

These skills need a \`category:\` added to their frontmatter.
EOF
fi

echo "Wrote ${INDEX}"
