---
name: run-plan
category: core
description: Use when you have an existing plan, spec, or task list to execute. Validates the plan for gaps and MCP accuracy before any implementation begins.
---

# Run Plan

## When to Use

- User hands you a pre-written plan, spec, design doc, or task list
- Resuming work on a plan from a previous session
- Plan written outside Hyperstack (Notion, GitHub issue, Linear ticket, etc.)

Creating a new plan from scratch → use `hyperstack:blueprint` → `hyperstack:forge-plan` instead.


## Process

### Step 1: Load and Read the Plan

Read the plan completely. Don't skim.

Identify:
- What domains does this plan touch? (React Flow, Go, Rust, design tokens, etc.)
- Overall goal?
- How many tasks, and what order?

### Step 2: MCP Spot-Check

For every domain the plan touches, call the relevant MCP tool to verify API assumptions:

| Plan references | Verify with |
|---|---|
| React Flow components or hooks | `reactflow_get_api("[component name]")` |
| Go patterns or practices | `golang_get_practice("[topic]")` |
| Motion animations | `motion_get_api("[hook or component]")` |
| Design token procedures | `design_tokens_get_procedure([step])` |
| Echo middleware or recipes | `echo_get_recipe("[name]")` |
| Rust practices | `rust_get_practice("[name]")` |

Flag any step where plan's code or API usage doesn't match MCP output → **plan bugs**, resolve before executing.

**MCP Degraded Mode:** Tools fail → inform user: "MCP unavailable for [domain] - cannot verify plan's API assumptions." Mark affected steps `[UNVERIFIED]`. Ask user whether to proceed with the risk or wait.

### Step 3: Gap Review

Check the plan:

1. **Completeness** → every requirement in the goal has at least one task?
2. **Placeholders** → any "TBD", "add error handling", "implement later", steps without code? Flag them.
3. **Type consistency** → type names, method signatures, file paths consistent across tasks?
4. **Verification steps** → each task has a way to confirm it worked?

### Step 4: Raise Concerns or Proceed

Issues found in Steps 2-3 → present before starting:

> "Before I begin, I found [N] issues in the plan:
> - [issue 1 - what's wrong and what MCP says instead]
> - [issue 2]
>
> Should I fix these in the plan first, or proceed with the known gaps?"

Wait for user's decision.

No issues → create task list and state:

> "Plan validated. Starting execution with `hyperstack:engineering-discipline`."

### Step 5: Execute

For each task in order:

1. Mark task in progress
2. Execute task steps exactly as written (don't improvise outside plan's scope)
3. Run the task's verification step
4. Invoke `hyperstack:ship-gate` before marking complete
5. Mark task complete
6. Commit

Blocker mid-task → stop immediately, don't guess or work around it. Report to user: what failed, what was expected, what actually happened. Wait for instruction.

### Step 6: Complete

All tasks marked complete → invoke `hyperstack:deliver`.


## Integration

- **Alternative entry:** No plan exists → `hyperstack:blueprint` → `hyperstack:forge-plan` first
- **Execution:** Uses `hyperstack:engineering-discipline` phase gates per task
- **Per-task gate:** `hyperstack:ship-gate` before marking each task complete
- **Terminal:** `hyperstack:deliver` after all tasks complete


## Lifecycle Integration

### Agent Workflow Chains

**Alternative entry (existing plan):**
```
run-plan (THIS) → [autonomous-mode | subagent-ops | engineering-discipline] → ship-gate → deliver
     ↓
[MCP validation]
```

**Compared to new plan:**
```
blueprint → forge-plan → [execution]  (new plan)
run-plan → [execution]                (existing plan)
```

### Upstream Dependencies
- User-provided plan (external or previous session)

### Downstream Consumers
- `autonomous-mode` | `subagent-ops` | `engineering-discipline` → executes validated plan
- `deliver` → final delivery

### Escalation Paths
| Discovery | Escalate to | Action |
|---|---|---|
| Plan has wrong API shapes | Fix plan or escalate to user |
| Plan has gaps | Fix plan or escalate to user |
| MCP unavailable for critical domain | Ask user: proceed with risk or wait |
