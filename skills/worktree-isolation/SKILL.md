---
name: worktree-isolation
category: core
description: Use when starting feature work that needs isolation from the current workspace, or before executing implementation plans.
---

# Git Worktree Isolation

## Why Worktrees

Git worktrees create isolated workspaces sharing the same repository. Work on a feature branch without touching your main working directory. Dirty state in one worktree cannot affect another.

Use before any non-trivial implementation to guarantee a clean starting point.

## Directory Selection

Follow this priority:

### 1. Check for Existing Directory

```bash
ls -d .worktrees 2>/dev/null || ls -d worktrees 2>/dev/null
```

Found → use it. Both exist → `.worktrees` wins.

### 2. Check CLAUDE.md / Project Config

```bash
grep -i "worktree.*director" CLAUDE.md 2>/dev/null
```

Preference specified → use it without asking.

### 3. Ask the User

Nothing exists and no preference configured:

> "No worktree directory found. Where should I create worktrees?
>
> 1. `.worktrees/` (project-local, hidden)
> 2. `~/worktrees/<project-name>/` (global location)
>
> Which?"

## Safety Verification

**For project-local directories (.worktrees or worktrees):**

Verify the directory is gitignored before creating a worktree:

```bash
git check-ignore -q .worktrees 2>/dev/null
```

NOT ignored → add to `.gitignore` and commit before proceeding.

**Why:** Prevents accidentally committing worktree contents to the repository.

**For global directories:** No gitignore check needed - outside the project.

## Creation Steps

```bash
# 1. Detect project name
project=$(basename "$(git rev-parse --show-toplevel)")

# 2. Create worktree with new branch
git worktree add <path>/<branch-name> -b <branch-name>
cd <path>/<branch-name>

# 3. Auto-detect and run setup
[ -f package.json ] && npm install
[ -f Cargo.toml ] && cargo build
[ -f go.mod ] && go mod download
[ -f requirements.txt ] && pip install -r requirements.txt
[ -f pyproject.toml ] && uv sync 2>/dev/null || poetry install

# 4. Run baseline tests
# Use project-appropriate command (npm test, cargo test, go test ./..., pytest)

# 5. Report
echo "Worktree ready at <path>. Tests: <N> passing, 0 failures."
```

**Baseline tests fail:** Report failures to user. Ask whether to proceed or investigate. Don't silently continue.

## Quick Reference

| Situation | Action |
|---|---|
| `.worktrees/` exists | Use it (verify ignored) |
| `worktrees/` exists | Use it (verify ignored) |
| Both exist | Use `.worktrees/` |
| Neither exists | Check CLAUDE.md, then ask user |
| Directory not ignored | Add to `.gitignore` + commit |
| Baseline tests fail | Report failures, ask user |
| No package.json/Cargo.toml | Skip dependency install |

## Cleanup

After work is complete (via `hyperstack:deliver`):

```bash
# If merged or discarded
git worktree remove <path>

# If keeping the branch
# Leave worktree in place, report its location
```

## Red Flags - STOP

| Thought | Reality |
|---|---|
| "I'll just work on the main branch" | Dirty state → mysterious failures. Isolate. |
| "Worktree setup is overhead" | 30 seconds of setup prevents hours of state debugging. |
| "I'll skip baseline tests" | Won't know if failures are yours or pre-existing. |
| "The directory doesn't need to be ignored" | One `git add .` and the worktree is in your repo. |

## Integration

- **Called by:** `hyperstack:forge-plan` (before execution), `hyperstack:subagent-ops` (before dispatching tasks)
- **Pairs with:** `hyperstack:deliver` (cleanup after completion)


## Lifecycle Integration

### Agent Workflow Chains

**Pre-flight for all execution modes:**
```
forge-plan → worktree-isolation (THIS) → [autonomous-mode | subagent-ops | engineering-discipline]
```

**Cleanup after delivery:**
```
deliver → worktree-isolation cleanup
```

### Upstream Dependencies
- `forge-plan` → before execution begins
- `subagent-ops` → before dispatching tasks

### Downstream Consumers
- All execution modes benefit from clean workspace
- `deliver` → cleanup after completion
