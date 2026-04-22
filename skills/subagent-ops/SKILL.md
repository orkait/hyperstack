---
name: subagent-ops
category: core
description: Use when executing implementation plans with independent tasks. Dispatches one fresh subagent per task with two-stage review after each.
---

# Subagent-Driven Execution

## Why Subagents

Fresh context per task prevents context pollution. You construct exactly what each subagent needs - they never inherit your session history. Keeps them focused, preserves your context for coordination.

## When to Use

Use when:
- You have an implementation plan (from `forge-plan` or `run-plan`)
- Tasks are mostly independent (don't share mutable state)
- You want to stay in this session (not hand off to a separate session)

Don't use when:
- Tasks are tightly coupled (each depends on prior's exact output)
- You need exploratory work (use `blueprint` first)
- Single small task (just do it inline)

## The Process

### Step 1: Extract All Tasks

Read the plan once. Extract every task with its full text, file paths, and MCP references. Create a task list.

Don't make subagents read the plan file - provide the full task text directly.

### Step 2: Per-Task Cycle

For each task in order:

**2a. Dispatch Implementer**

Dispatch a fresh subagent with:
- Full task text (copied, not referenced)
- Relevant context: what prior tasks produced, file paths, types
- Test-first discipline inline (subagents can't invoke the Skill tool - provide rules inline: write failing test → watch it fail → minimal code → verify green)
- Instruction: use MCP tools to verify API shapes before coding
- Instruction: commit when done, report status

**Implementer statuses:**
- **DONE** → proceed to review
- **DONE_WITH_CONCERNS** → read concerns, address if correctness-related, then review
- **NEEDS_CONTEXT** → provide missing context, re-dispatch
- **BLOCKED** → assess: context problem (provide more), reasoning problem (use more capable model), task too large (break it up), plan wrong (escalate to user)

Never ignore a BLOCKED status. Something must change before re-dispatch.

**2b. Spec Compliance Review**

Dispatch a review subagent with:
- Original task spec (full text)
- Git diff of what the implementer produced
- Question: "Does the code match the spec? Flag anything missing, extra, or wrong."

Issues found → implementer fixes → reviewer re-reviews. Loop until clean.

**2c. Code Quality Review**

Only after spec compliance passes. Dispatch a review subagent with:
- The git diff
- Question: "Review for code quality: naming, structure, edge cases, test coverage. Flag Important and Critical issues only."

Issues found → implementer fixes → reviewer re-reviews. Loop until clean.

**2d. Mark Complete**

Mark task complete in the task list. Move to next task.

### Step 3: Final Review

After all tasks complete, dispatch one final review subagent covering the entire implementation diff (`git diff <base-branch>..HEAD`). Catches composition issues per-task reviews miss.

### Step 4: Deliver

Invoke `hyperstack:deliver` for full verification and delivery flow.

## MCP Integration

When constructing implementer prompts, include MCP tool calls the subagent should make:

| Task touches | Include in prompt |
|---|---|
| React Flow components | "Call `reactflow_get_api('[component]')` before implementing" |
| Go patterns | "Call `golang_get_practice('[topic]')` before implementing" |
| Motion animations | "Call `motion_get_api('[hook]')` before implementing" |
| Design tokens | "Call `design_tokens_get_procedure` before implementing" |

Subagent verifies API shapes in its own context. Don't assume your earlier MCP calls are still current.

## Prompt Structure

Good subagent prompts are:
1. **Focused** → one task, one clear goal
2. **Self-contained** → all context needed, no "see above"
3. **Specific about output** → what to return, what format

Bad: "Fix the tests" (too broad)
Good: "Fix the 3 failing tests in `src/flow/nodes.test.ts`. Root cause is [X]. Expected: all pass. Return: summary of changes."

## Red Flags - STOP

| Thought | Reality |
|---|---|
| "I'll dispatch multiple implementers in parallel" | They'll conflict on shared files. One at a time. |
| "Skip spec review, the code looks fine" | Spec drift is invisible without review. |
| "Start code quality before spec compliance" | Wrong order. Spec first, quality second. |
| "Subagent said done, move on" | Verify with review. Trust but verify. |
| "I'll fix it myself instead of re-dispatching" | Context pollution. Dispatch a fix subagent. |
| "This task is too small for the full cycle" | Small tasks still get spec + quality review. |
| "Let the subagent read the plan file" | Provide full text. File reads waste subagent context. |

## Integration

- **Requires:** Plan from `hyperstack:forge-plan` or `hyperstack:run-plan`
- **Subagents use:** `hyperstack:test-first` discipline (inline)
- **Per-task gate:** Spec compliance review + code quality review
- **Final gate:** `hyperstack:deliver`
- **If blocked:** `hyperstack:debug-discipline` for root cause investigation


## Lifecycle Integration

### Agent Workflow Chains

**Subagent-driven execution:**
```
forge-plan → subagent-ops (THIS) → deliver
                  ↓
    [per-task: implementer → spec review → quality review]
                  ↓
         [final review on full diff]
```

### Upstream Dependencies
- `forge-plan` → approved MCP-verified plan
- `run-plan` → validated existing plan

### Subagent Discipline (provided inline, not invoked)
- `test-first` → implementer subagents follow red-green-refactor
- `debug-discipline` → implementer subagents use on BLOCKED status
- `code-review` → review subagents follow review protocol

### Downstream Consumers
- `deliver` → final verification and delivery

### Escalation Paths
| Subagent Status | Action |
|---|---|
| DONE | Proceed to review |
| DONE_WITH_CONCERNS | Address if correctness-related, then review |
| NEEDS_CONTEXT | Provide missing context, re-dispatch |
| BLOCKED | Assess: context/reasoning/task-size/plan-wrong → fix → re-dispatch |
