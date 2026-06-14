---
name: worktree-isolation
category: core
description: Use when starting feature work that needs isolation from the current workspace, or before executing implementation plans - ensures an isolated workspace exists via native tools or git worktree fallback.
---

# Git Worktree Isolation

## Why Worktrees

Git worktrees create isolated workspaces sharing the same repository. Work on a feature branch without touching your main working directory. Dirty state in one worktree cannot affect another.

**Core principle:** Detect existing isolation first. Then use native tools. Then fall back to git. Never fight the harness.

Use before any non-trivial implementation to guarantee a clean starting point.

## Step 0: Detect Existing Isolation

**Before creating anything, check if you are already in an isolated workspace.**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

**Submodule guard:** `GIT_DIR != GIT_COMMON` is also true inside git submodules. Before concluding "already in a worktree," verify you are not in a submodule:

```bash
# If this returns a path, you're in a submodule, not a worktree - treat as normal repo
git rev-parse --show-superproject-working-tree 2>/dev/null
```

**If `GIT_DIR != GIT_COMMON` (and not a submodule):** Already in a linked worktree. Skip to Step 2 (Project Setup). Do NOT create another worktree.

Report with branch state:
- On a branch: "Already in isolated workspace at `<path>` on branch `<name>`."
- Detached HEAD: "Already in isolated workspace at `<path>` (detached HEAD, externally managed)."

**If `GIT_DIR == GIT_COMMON` (or in a submodule):** Normal repo checkout. Continue to Step 1.

Has the user already indicated a worktree preference in your instructions? If not, ask for consent:

> "Would you like me to set up an isolated worktree? It protects your current branch from changes."

If the user declines, work in place and skip to Step 2.

## Step 1: Create Isolated Workspace

**Two mechanisms. Try them in this order.**

### 1a. Native Worktree Tools (preferred)

Do you have a harness tool for worktree creation? Look for `EnterWorktree`, `WorktreeCreate`, a `/worktree` command, or a `--worktree` flag. If available, use it and skip to Step 2.

Native tools handle directory placement, branch creation, and cleanup automatically. Using `git worktree add` when a native tool exists creates phantom state the harness cannot manage.

Only proceed to Step 1b if no native worktree tool is available.

### 1b. Git Worktree Fallback

Use only when Step 1a does not apply.

#### Directory Selection

Follow this priority. Explicit user preference always beats observed filesystem state.

1. **Check your instructions for a declared worktree directory preference.** If specified, use it without asking.

2. **Check for existing project-local directory:**
   ```bash
   ls -d .worktrees 2>/dev/null || ls -d worktrees 2>/dev/null
   ```
   Found - use it. Both exist - `.worktrees` wins.

3. **Check project config / agent rules:**
   ```bash
   grep -ri "worktree.*director" .cursorrules .roo/ .claude.json 2>/dev/null
   ```
   Preference specified - use it without asking.

4. **If nothing exists and no preference configured**, ask the user:

   > "No worktree directory found. Where should I create worktrees?
   >
   > 1. `.worktrees/` (project-local, hidden)
   > 2. `~/worktrees/<project-name>/` (global location)
   >
   > Which?"

#### Safety Verification (project-local directories only)

Verify the directory is gitignored before creating a worktree:

```bash
git check-ignore -q .worktrees 2>/dev/null
```

NOT ignored - add to `.gitignore` and commit before proceeding.

**Why:** Prevents accidentally committing worktree contents to the repository.

Global directories (`~/worktrees/`) need no verification.

#### Create the Worktree

```bash
project=$(basename "$(git rev-parse --show-toplevel)")

# path = $LOCATION/$BRANCH_NAME
git worktree add "$path" -b "$BRANCH_NAME"
cd "$path"
```

**Sandbox fallback:** If `git worktree add` fails with a permission error (sandbox denial), tell the user the sandbox blocked worktree creation and you are working in the current directory instead. Then continue to Step 2.

## Step 2: Project Setup

Auto-detect and run setup:

```bash
[ -f package.json ] && npm install
[ -f Cargo.toml ] && cargo build
[ -f go.mod ] && go mod download
[ -f requirements.txt ] && pip install -r requirements.txt
[ -f pyproject.toml ] && uv sync 2>/dev/null || poetry install
```

## Step 3: Verify Clean Baseline

Run tests to ensure the workspace starts clean:

```bash
# Use project-appropriate command
npm test / cargo test / pytest / go test ./...
```

**Baseline tests fail:** Report failures to user. Ask whether to proceed or investigate. Don't silently continue.

**Tests pass:** Report ready.

```
Worktree ready at <path>. Tests: <N> passing, 0 failures.
```

## Quick Reference

| Situation | Action |
|---|---|
| Already in linked worktree | Skip creation (Step 0) |
| In a submodule | Treat as normal repo (Step 0 guard) |
| Native worktree tool available | Use it (Step 1a) |
| No native tool | Git worktree fallback (Step 1b) |
| `.worktrees/` exists | Use it (verify ignored) |
| `worktrees/` exists | Use it (verify ignored) |
| Both exist | Use `.worktrees/` |
| Neither exists | Check project config, then ask user |
| Directory not ignored | Add to `.gitignore` + commit |
| Permission error on create | Sandbox fallback, work in place |
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
| "I'll just work on the main branch" | Dirty state - mysterious failures. Isolate. |
| "Worktree setup is overhead" | 30 seconds of setup prevents hours of state debugging. |
| "I'll skip baseline tests" | Won't know if failures are yours or pre-existing. |
| "The directory doesn't need to be ignored" | One `git add .` and the worktree is in your repo. |
| "I'll use `git worktree add` - I have a native tool" | Phantom state the harness can't manage. Use Step 1a. |
| "I'll create a worktree - I'm already in one" | Nested isolation. Step 0 prevents this. |

## Integration

- **Called by:** `hyperstack:forge-plan` (before execution), `hyperstack:subagent-ops` (before dispatching tasks)
- **Pairs with:** `hyperstack:deliver` (cleanup after completion)


## Lifecycle Integration

### Agent Workflow Chains

**Pre-flight for all execution modes:**
```
forge-plan -> worktree-isolation (THIS) -> [autonomous-mode | subagent-ops | engineering-discipline]
```

**Cleanup after delivery:**
```
deliver -> worktree-isolation cleanup
```

### Upstream Dependencies
- `forge-plan` -> before execution begins
- `subagent-ops` -> before dispatching tasks

### Downstream Consumers
- All execution modes benefit from clean workspace
- `deliver` -> cleanup after completion
