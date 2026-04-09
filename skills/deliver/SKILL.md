---
name: deliver
description: Use after all implementation tasks are complete. Runs final verification, confirms the branch is clean, and executes the chosen delivery method.
---

# Deliver

## When to Use

After every task in the implementation plan is marked complete and all verification has passed. This is the terminal state of every Hyperstack workflow.

Do NOT invoke this skill until all tasks are done. It is a gate, not a shortcut.

## The Process

### Step 1: Full Verification

Run the complete test suite. Not a subset. Not the tests you just wrote. All of them.

Show the output. If anything fails, stop here — invoke `hyperstack:debug-discipline` and resolve before continuing.

### Step 2: Type / Lint Check

Run the appropriate check for the project's language:

| Language | Command |
|---|---|
| TypeScript / Next.js | `npx tsc --noEmit` |
| Rust | `cargo check` |
| Go | `go vet ./...` |
| Python | `mypy .` (if configured) |

Zero errors required. Warnings are acceptable if pre-existing and documented.

### Step 3: Diff Review

Run `git diff <base-branch>..HEAD` where `<base-branch>` is main, master, or develop — whichever this branch was cut from.

Check:
- Does the diff match the plan or approved design?
- Are there any unintended changes (modified files outside the plan's scope)?
- Are there any debug statements, console.logs, or temporary code left in?

If anything is unintended, revert it before continuing.

### Step 4: Ship Gate

Invoke `hyperstack:ship-gate` on the overall implementation.

Do not skip this. Passing individual task verifications does not replace a final gate on the whole.

### Step 5: Present Options

Once Steps 1-4 pass, present the delivery options to the user:

> "All verification passed. How do you want to deliver this?
>
> 1. **PR** — push branch and open a pull request (`gh pr create`)
> 2. **Squash** — squash all commits into one and merge
> 3. **Leave as branch** — push branch only, no PR yet"

Wait for the user's choice.

### Step 6: Execute

Execute exactly the chosen option. Do not add steps. Do not clean up other things "while you're at it."

**Option 1 — PR:**
```bash
git push -u origin [branch-name]
gh pr create --title "[feature name]" --body "[summary of changes]"
```

**Option 2 — Squash:**
```bash
git checkout main
git merge --squash [branch-name]
git commit -m "[single descriptive commit message]"
```

**Option 3 — Leave as branch:**
```bash
git push -u origin [branch-name]
```

## Red Flags — STOP

| Thought | Reality |
|---|---|
| "Tests mostly pass, I'll fix the rest in a follow-up" | No. Fix them now or don't deliver. |
| "The type errors are pre-existing" | Verify with `git stash` — if they existed before your change, document it. If not, fix them. |
| "I'll skip ship-gate, I just ran individual verifications" | Individual gates do not cover composition. Run ship-gate. |
| "Let me also clean up X while I'm here" | Scope creep. Out-of-plan changes go on a new branch. |

## Integration

- **Requires:** All tasks in `forge-plan` or `run-plan` complete and individually verified (via `autonomous-mode`, `subagent-ops`, or `engineering-discipline`)
- **Requires:** `hyperstack:ship-gate` passing on full implementation
- **Invoked after:** `hyperstack:autonomous-mode`, `hyperstack:subagent-ops`, or `hyperstack:engineering-discipline` completes
