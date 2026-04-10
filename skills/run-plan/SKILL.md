---
name: run-plan
category: core
description: Use when you have an existing plan, spec, or task list to execute. Validates the plan for gaps and MCP accuracy before any implementation begins.
---

# Run Plan

## When to Use

Use this when:
- The user hands you a pre-written plan, spec, design doc, or task list
- You are resuming work on a plan created in a previous session
- A plan was written outside Hyperstack (Notion, GitHub issue, Linear ticket, etc.)

If you are **creating** a new plan from scratch, use `hyperstack:blueprint` → `hyperstack:forge-plan` instead.

## The Iron Law

```
NO EXECUTION WITHOUT PLAN VALIDATION FIRST.
```

A plan with wrong API shapes or missing steps will produce wrong code. Two minutes of validation saves hours of rework.

## Process

### Step 1: Load and Read the Plan

Read the plan file or the content provided. Read it completely — do not skim.

Identify:
- What domains does this plan touch? (React Flow, Go, Rust, design tokens, etc.)
- What is the overall goal?
- How many tasks, and what order?

### Step 2: MCP Spot-Check

For every domain the plan touches, call the relevant MCP tool to verify the plan's API assumptions:

| Plan references | Verify with |
|---|---|
| React Flow components or hooks | `reactflow_get_api("[component name]")` |
| Go patterns or practices | `golang_get_practice("[topic]")` |
| Motion animations | `motion_get_api("[hook or component]")` |
| Design token procedures | `design_tokens_get_procedure([step])` |
| Echo middleware or recipes | `echo_get_recipe("[name]")` |
| Rust practices | `rust_get_practice("[name]")` |

Flag any step where the plan's code or API usage does not match MCP output. These are **plan bugs** -- resolve them before executing.

**MCP Degraded Mode:** If MCP tools fail or are unavailable during spot-check, inform the user: "MCP unavailable for [domain] -- cannot verify plan's API assumptions for this domain." Mark affected steps as `[UNVERIFIED]` and ask the user whether to proceed with the risk or wait for MCP to recover.

### Step 3: Gap Review

Check the plan against these questions:

1. **Completeness** — Does every requirement in the goal have at least one task?
2. **Placeholders** — Any "TBD", "add error handling", "implement later", steps without code? Flag them.
3. **Type consistency** — Do type names, method signatures, and file paths stay consistent across tasks?
4. **Verification steps** — Does each task have a way to confirm it worked?

### Step 4: Raise Concerns or Proceed

If you found issues in Steps 2-3:

Present them to the user before starting:

> "Before I begin, I found [N] issues in the plan:
> - [issue 1 — what's wrong and what MCP says instead]
> - [issue 2]
>
> Should I fix these in the plan first, or proceed with the known gaps?"

Wait for the user's decision.

If no issues: create a task list from the plan and state:

> "Plan validated. Starting execution with `hyperstack:engineering-discipline`."

### Step 5: Execute

For each task in order:

1. Mark task in progress
2. Execute the task steps exactly as written (do not improvise outside the plan's scope)
3. Run the task's verification step
4. Invoke `hyperstack:ship-gate` before marking complete
5. Mark task complete
6. Commit

If you hit a blocker mid-task:
- Stop immediately — do not guess or work around it
- Report to user: what failed, what was expected, what actually happened
- Wait for instruction before continuing

### Step 6: Complete

After all tasks are marked complete, invoke `hyperstack:deliver`.

## Red Flags — STOP

| Thought | Reality |
|---|---|
| "The plan looks fine, no need to check MCP" | One wrong prop name in a plan = broken code in every task that uses it |
| "I'll fix the gap as I go" | Undocumented gaps become undocumented decisions |
| "The user wrote this plan, it must be correct" | Plans have bugs. That is why this step exists |
| "Step N is unclear but I can infer what they meant" | Stop and ask. Inferred intent produces surprising code |
| "I'll skip ship-gate on this task, it's small" | No exceptions |

## Integration

- **Alternative entry:** If no plan exists, use `hyperstack:blueprint` → `hyperstack:forge-plan` to create one first
- **Execution:** Uses `hyperstack:engineering-discipline` phase gates per task
- **Per-task gate:** `hyperstack:ship-gate` before marking each task complete
- **Terminal:** `hyperstack:deliver` after all tasks complete
