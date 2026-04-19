---
name: deliver
category: core
description: Use after all implementation tasks are complete. Runs final verification, confirms the branch is clean, and executes the chosen delivery method.
---

# Deliver

## When to Use

After every task in the implementation plan is marked complete and all verification has passed. Terminal state of every Hyperstack workflow.

Do NOT invoke until all tasks are done. It is a gate, not a shortcut.

## The Process

### Step 1: Full Verification

Run the complete test suite. Not a subset. Not just the tests you wrote. All of them.

Show the output. Anything fails → stop, invoke `hyperstack:debug-discipline`, resolve before continuing.

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

Anything unintended → revert before continuing.

### Step 4: Ship Gate

Invoke `hyperstack:ship-gate` on the overall implementation.

Don't skip. Passing individual task verifications ≠ final gate on the whole.

### Step 5: Present Options

Once Steps 1-4 pass:

> "All verification passed. How do you want to deliver this?
>
> 1. **PR** - push branch and open a pull request (`gh pr create`)
> 2. **Squash** - squash all commits into one and merge
> 3. **Leave as branch** - push branch only, no PR yet"

Wait for the user's choice.

### Step 6: Execute

Execute exactly the chosen option. No extra steps. No "cleaning up other things while you're at it."

**Option 1 - PR:**
```bash
git push -u origin [branch-name]
gh pr create --title "[feature name]" --body "[summary of changes]"
```

**Option 2 - Squash:**
```bash
git checkout main
git merge --squash [branch-name]
git commit -m "[single descriptive commit message]"
```

**Option 3 - Leave as branch:**
```bash
git push -u origin [branch-name]
```


## Integration

- **Requires:** All tasks in `forge-plan` or `run-plan` complete and individually verified
- **Requires:** `hyperstack:ship-gate` passing on full implementation
- **Invoked after:** `hyperstack:autonomous-mode`, `hyperstack:subagent-ops`, or `hyperstack:engineering-discipline` completes


## Lifecycle Integration

### Agent Workflow Chains

**Terminal state of all workflows:**
```
[autonomous-mode | subagent-ops | engineering-discipline] → ship-gate → deliver (THIS)
```

### Upstream Dependencies
- `ship-gate` → must pass before deliver invoked
- All tasks in plan marked complete

### Downstream Consumers
- None (terminal state)

### Cleanup
- `worktree-isolation` → cleanup after delivery (if worktree used)
