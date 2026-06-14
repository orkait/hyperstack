---
name: deliver
category: core
description: Use after all implementation tasks are complete. Runs final verification, confirms the branch is clean, detects the workspace environment, and executes the chosen delivery method.
---

# Deliver

## When to Use

After every task in the implementation plan is marked complete and all verification has passed. Terminal state of every Hyperstack workflow.

Do NOT invoke until all tasks are done. It is a gate, not a shortcut.

## The Process

### Step 1: Full Verification

Run the complete test suite. Not a subset. Not just the tests you wrote. All of them.

Show the output. Anything fails - stop, invoke `hyperstack:debug-discipline`, resolve before continuing.

### Step 2: Type / Lint Check

| Language | Command |
|---|---|
| TypeScript / Next.js | `npx tsc --noEmit` |
| Rust | `cargo check` |
| Go | `go vet ./...` |
| Python | `mypy .` (if configured) |

Zero errors required. Pre-existing warnings acceptable if documented.

### Step 3: Diff Review

Run `git diff <base-branch>..HEAD`.

Check:
- Diff matches plan or approved design?
- Unintended changes (files outside plan's scope)?
- Debug statements, console.logs, or temp code left in?

Anything unintended - revert before continuing.

### Step 4: Ship Gate

Invoke `hyperstack:ship-gate` on the overall implementation.

Don't skip. Passing individual task verifications does not equal a final gate on the whole.

### Step 5: Detect Environment

**Determine workspace state before presenting options:**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
```

| State | Menu | Cleanup |
|---|---|---|
| `GIT_DIR == GIT_COMMON` (normal repo) | Standard options | No worktree to clean up |
| `GIT_DIR != GIT_COMMON`, named branch | Standard options | Provenance-based (see Step 7) |
| `GIT_DIR != GIT_COMMON`, detached HEAD | Reduced 2 options (no merge/squash) | No cleanup (externally managed) |

### Step 6: Present Options

Once Steps 1-5 pass.

**Normal repo or named-branch worktree:**

> "All verification passed. How do you want to deliver this?
>
> 1. **PR** - push branch and open a pull request (`gh pr create`)
> 2. **Squash** - squash all commits into one and merge locally
> 3. **Leave as branch** - push branch only, no PR yet"

**Detached HEAD (externally managed workspace):**

> "All verification passed. You're on a detached HEAD (externally managed workspace).
>
> 1. **Push as new branch and PR** - push to new branch and open a pull request
> 2. **Leave as-is** - I'll handle it later"

Wait for the user's choice.

### Step 7: Execute

Execute exactly the chosen option. No extra steps. No "cleaning up other things while you're at it."

**Option 1 - PR:**
```bash
git push -u origin [branch-name]
gh pr create --title "[feature name]" --body "[summary of changes]"
```

Do NOT clean up the worktree - the user needs it alive for PR iteration.

**Option 2 - Squash (normal repo / named-branch only):**
```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
git checkout main
git merge --squash [branch-name]
git commit -m "[single descriptive commit message]"
```

Verify tests on merged result, then proceed to cleanup (Step 8).

**Option 3 - Leave as branch:**
```bash
git push -u origin [branch-name]
```

Preserve worktree. Done.

### Step 8: Cleanup Workspace

**Only runs after squash-merge (Option 2).** All other options preserve the worktree.

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
WORKTREE_PATH=$(git rev-parse --show-toplevel)
```

**If `GIT_DIR == GIT_COMMON`:** Normal repo, no worktree to clean up. Done.

**If worktree path is under `.worktrees/`, `worktrees/`, or `~/.config/superpowers/worktrees/`:** Hyperstack / superpowers created this worktree - we own cleanup.

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
git worktree remove "$WORKTREE_PATH"
git worktree prune
git branch -d [branch-name]
```

**Otherwise:** The host environment (harness) owns this workspace. Do NOT remove it. If your platform provides a workspace-exit tool, use it. Otherwise leave the workspace in place.

## Red Flags - STOP

| Thought | Reality |
|---|---|
| "Tests mostly pass, I'll fix the rest in a follow-up" | Fix them now or don't deliver. |
| "The type errors are pre-existing" | Verify with `git stash`. Pre-existing - document it. Not pre-existing - fix it. |
| "I'll skip ship-gate, I just ran individual verifications" | Individual gates do not equal composition. Run ship-gate. |
| "Let me also clean up X while I'm here" | Scope creep. Out-of-plan changes - new branch. |
| "I'll skip environment detection, it's obviously a normal repo" | Detached HEAD produces broken cleanup. Always detect first. |
| "The worktree isn't under `.worktrees/` but I'll remove it anyway" | Removing a harness-owned workspace causes phantom state. Provenance check is mandatory. |
| "I'll delete the branch before removing the worktree" | `git branch -d` fails while the worktree still references the branch. Remove worktree first. |

## Integration

- **Requires:** All tasks in `forge-plan` or `run-plan` complete and individually verified
- **Requires:** `hyperstack:ship-gate` passing on full implementation
- **Invoked after:** `hyperstack:autonomous-mode`, `hyperstack:subagent-ops`, or `hyperstack:engineering-discipline` completes

## Lifecycle Integration

### Agent Workflow Chains

**Terminal state of all workflows:**
```
[autonomous-mode | subagent-ops | engineering-discipline] -> ship-gate -> deliver (THIS)
```

### Upstream Dependencies
- `ship-gate` - must pass before deliver invoked
- All tasks in plan marked complete

### Downstream Consumers
- None (terminal state)

### Cleanup
- `worktree-isolation` - provenance-based cleanup after delivery (if worktree was created by Hyperstack)
