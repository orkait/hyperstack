---
name: worktree-isolation
category: core
description: Use when starting feature work that needs isolation from the current workspace, or before executing implementation plans - ensures an isolated workspace exists via native tools or git worktree fallback, and binds multi-repo feature worktrees into an explicit named group.
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

## Multi-Repo Feature Groups

Worktree isolation covers ONE repo. A feature that spans several repos - a
backend, an AI service, and a frontend, each in its own repository - needs one
worktree per repo, all on the same logical feature. Those worktrees are peers,
but git has no concept that binds them: `git worktree list` in the backend repo
cannot see the frontend's worktree.

For a tool-agnostic adoption recipe (registry schema, port-slot formula,
run-script generation, and reusable snippets), see
`references/multi-repo-feature-groups.md`.

**Bind them explicitly. Do not match on branch names.** Real feature branches
drift per repo (`feat/x-integration` in the backend vs `feat/x-attribution-ui`
in the frontend), so auto-matching by branch is unreliable and produces false
positives. Declare membership instead.

### The registry pattern

Keep a small append-only registry mapping each member worktree to a shared group
name and a role:

```
<group>	<role>	<worktree-toplevel-abspath>
```

- **group** - the feature, identical across all members (e.g. `checkout-redesign`).
- **role** - which repo this tree is (`be`, `ai`, `ui`, ...), derived from the
  repo and overridable.
- **toplevel** - absolute path from `git rev-parse --show-toplevel`, so a lookup
  succeeds from any subdirectory of the worktree.

A worktree "is in group G" when its toplevel appears under G. Membership is a
single file lookup - no cross-repo git calls, cheap enough to render on a
statusline hot path.

### Binding workflow

1. Create or enter the per-repo worktree (Steps 0-1 above).
2. Append `group + role + toplevel` to the registry.
3. Repeat in each repo's worktree using the SAME group name.

Membership is explicit and evolves. Add a member when the feature reaches a new
repo/surface; remove one (unbind from the registry, then keep or `git worktree
remove` the checkout) when that surface merges or is abandoned. A member is a
worktree holding part of THIS feature on its own branch - one per repo it
touches. The registry stays the single source of truth; never infer membership
from matching branch names.

Surface membership wherever git context is shown (prompt / statusline): the group
plus each member as `role` and only the part of its branch that distinguishes it.
Strip each branch's `type/` prefix and the shared group token, and collapse a
member whose branch is exactly the group name to role-only - so a group on branch
`feat/checkout` with `feat/checkout` (be) and `feat/checkout-mobile` (ui) renders
`⑂checkout[‹be›·ui:mobile]`, current member emphasized. Read each branch straight
from its `.git/HEAD` file (a linked worktree's `.git` is a file pointing at its
real gitdir) - a plain file read, not a `git` subprocess, so it stays cheap. Live
per-sibling dirty/ahead status is the expensive part: add it only behind a short
cache, since it costs one git invocation per member per render.

### Why explicit over heuristic

| approach | binds | cost | verdict |
|---|---|---|---|
| exact branch match | only byte-identical branch names | zero config | misses drifted names |
| branch-token heuristic | fuzzy prefix/suffix strip | zero config | false positives, fragile |
| **explicit registry** | **exactly what you declare** | **one line per member** | **correct, recommended** |

### Running the group (ports + OAuth)

Runtime hazards when several members run at once:

- **Config not carried by the worktree.** Gitignored config (`.env`, local
  secrets) is never created in a fresh worktree, but the services read it - so a
  new member boots mis-configured until its config is seeded from the repo's
  main checkout. Provide an idempotent seed step and run it before starting the
  stack.
- **Port collisions.** Give each group a port slot and derive every service's
  port from it (e.g. `base + 10*slot`). If a service hardcodes its port in
  source instead of reading an env var, the slot must be applied on the launch
  command (`--port`), not via an env file - verify which per service before
  assuming an env file is enough.
- **OAuth redirect pinning.** OAuth `redirect_uri`s are pre-registered with the
  provider at a fixed host:port. A member on any other port gets a redirect
  mismatch and the flow dies. That registered port is a singleton - only one
  member can hold it. So: generate a run script per worktree that port-swaps the
  OAuth/base URLs to the slot's port, warn loudly on the non-registered slots,
  and provide a "claim" command that moves a group onto the registered port when
  its OAuth flows need testing.

**Working the whole set as one session.** To act on the group as a unit, provide
a launcher that opens in the group's primary worktree and grants read/write
access to the siblings (a multi-directory flag), rather than one session per
worktree. Run it in a subshell so the caller's working directory and environment
are untouched on exit. Keep any "active group" indicator ephemeral to the
session (a status row that is torn down on exit) - never mutate the user's shell
prompt or persist state that outlives the session. If the host runs interactive
pickers without a controlling terminal (many agent hooks do), the selector must
be a shell launcher, not a startup hook.

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
| Feature spans multiple repos | One worktree per repo, bind them in a group registry |
| Branch names differ per repo | Bind explicitly - never auto-match by branch |

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
| "Same feature across repos, I'll match branch names" | Names drift per repo. Bind explicitly in a group registry. |

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
