---
name: autonomous-mode
category: core
description: Use when the user chooses fully autonomous execution. Aggressively uses the entire Hyperstack to implement the solution end-to-end without asking for human review.
---

# Autonomous Mode

## What This Is

You are unleashed. Execute the full plan end-to-end, using every Hyperstack MCP tool, web search, and skill to make evidence-backed decisions. No asking for review, clarification, or permission between tasks. Think → verify → implement → move.

User gets the finished product. Not questions. Not checkpoints.


- Every MCP tool that could be relevant → call it
- Every quality gate → run it yourself
- Every decision point → make it with evidence, log reasoning, keep moving
- Every ambiguity → resolve via MCP data, web search, codebase patterns, engineering judgment
- Every uncertainty → ground it with a deterministic check before proceeding

You are the senior engineer, reviewer, QA, and decision-maker.

## When to Use

- User explicitly chose autonomous execution
- Plan approved via `blueprint` or `run-plan`
- User said "just do it", "go ahead", "autonomous", "don't ask, build it"

## The Autonomous Loop: Reason-Act-Verify

```
REASON: State what you're about to do and why (one line, logged)
ACT:    Execute (write code, run command, call MCP tool)
VERIFY: Check result against deterministic signal (test output, exit code, MCP data)
        PASS → next action
        FAIL → self-correct (see Self-Correction Hierarchy)
```

Never skip VERIFY. "It looks right" is not verification.

## Process

### Step 1: Pre-Flight

1. **Worktree** → `hyperstack:worktree-isolation`
2. **MCP survey** → for every domain the plan touches, call tools upfront:

   | Domain | Call NOW |
   |---|---|
   | React Flow | `reactflow_search_docs` + `reactflow_list_apis` + `reactflow_get_api` per component |
   | Motion | `motion_search_docs` + `motion_list_apis` |
   | Go / Echo | `golang_search_docs` + `echo_list_recipes` + `echo_list_middleware` |
   | Rust | `rust_search_docs` + `rust_list_practices` |
   | React / Next.js | `react_search_docs` + `react_list_patterns` + `react_get_constraints` |
   | Design tokens | `design_tokens_list_categories` + `design_tokens_get_gotchas` |
   | UI/UX | `ui_ux_list_principles` + `ui_ux_get_gotchas` |

3. **Baseline** → run full test suite, record pass count
4. **Task list** → create from plan, all pending
5. **Decision log** → format: `Decision: [what] | Evidence: [source] | Alternatives rejected: [why]`

### Step 2: Execute All Tasks

For each task:

1. Mark in progress
2. **MCP verify** → call specific tools for APIs/patterns in THIS task
3. **Test first** → write failing test, run it, confirm it fails for the right reason
4. **Implement** → minimal code to pass, MCP-verified API shapes only
5. **Verify** → run test + full suite, zero regressions
6. **Self-review** → diff matches plan? No debug artifacts? No scope creep?
7. **Commit** → atomic, descriptive
8. Mark complete

### Self-Correction Hierarchy

```
Level 1: MCP GROUND TRUTH     → call the relevant tool
Level 2: CODEBASE PATTERN     → grep for similar working implementations
Level 3: WEB SEARCH           → targeted: "[library] [version] [error]"
                                 cross-reference against MCP; reject outdated/wrong-version results
Level 4: DEBUG DISCIPLINE     → root cause → hypothesis → minimal test → fix
                                 fix within 2 attempts → continue
                                 3rd attempt fails → ABORT
Level 5: ABORT                → stop, report to user
```

Web search is NOT first resort. MCP → codebase → web → debug → abort.

**Web search IS mandatory when:**
- Error not in MCP data
- Library not covered by Hyperstack MCP
- MCP data seems outdated for the version in use
- Platform-specific issue (OS, browser, runtime)

### Decision-Making Without the User

**On ambiguity:** Resolve via MCP → codebase patterns → web search → engineering judgment (simpler/more maintainable). Log every decision.

**On missing info:** Exhaust self-correction hierarchy first. All 4 levels fail → abort condition.

**On style/approach:** Follow existing codebase conventions. No convention → simpler option + log it.

### Step 3: Final Verification

1. `git diff <base-branch>..HEAD` → full diff review
2. Diff matches plan? Fix any drift.
3. Remove debug artifacts, console.logs, temp code
4. Full test suite → all green
5. Type/lint check → zero errors
6. `hyperstack:ship-gate`

### Step 4: Deliver

Invoke `hyperstack:deliver`. Only human touchpoint.

Present:
- Summary of what was built (per-task, one line)
- Decision log with evidence and rejected alternatives
- Test results (before/after pass counts)
- Delivery options (PR / squash / branch)

## What Runs Automatically

| Gate | How |
|---|---|
| MCP API verification | Per-domain upfront + per-task inline |
| Web search | On unfamiliar errors, uncovered APIs, version-specific issues |
| Test-first | Every task, no exceptions |
| Full test suite | After every task + final |
| Debug-discipline | On any failure, up to 3 attempts |
| Self-review | After every task + final diff |
| Ship-gate | Final gate before delivery |
| Decision logging | Every autonomous choice with evidence |

## Abort Conditions

1. **3-strike escalation** → 3 failed fix attempts after exhausting self-correction hierarchy
2. **MCP down for critical domain** → try web search; if insufficient → stop and report
3. **Test suite collapse** → 3+ unrelated failures after a single task
4. **Scope impossibility** → missing dependency, incompatible versions, circular requirement
5. **Security concern** → vulnerability discovered → never ship insecure code autonomously
6. **Information exhaustion** → all 4 self-correction levels failed

Everything else → you handle it.

## Drift Prevention

1. **Per-task plan check** → re-read plan requirement before starting, verify diff matches after
2. **Scope fence** → changes outside plan's listed files → log as out-of-scope, mention at delivery
3. **Decision log review** → every 3 tasks, scan log for repeated reversals (signals drift)
4. **Deterministic over probabilistic** → if you can check with a command, do that instead of reasoning


## Integration

- **Requires:** Approved plan from `hyperstack:forge-plan` or `hyperstack:run-plan`
- **Uses aggressively:** All MCP tools, web search, `hyperstack:worktree-isolation`, `hyperstack:test-first` (inline), `hyperstack:debug-discipline` (inline on failure), `hyperstack:ship-gate` (final)
- **Completes via:** `hyperstack:deliver` (only human touchpoint)


## Lifecycle Integration

### Agent Workflow Chains

**Full autonomous execution:**
```
forge-plan → autonomous-mode (THIS) → ship-gate → deliver
                  ↓
         [uses all skills inline]
                  ↓
    worktree-isolation → test-first → debug-discipline (on failure)
```

### Upstream Dependencies
- `forge-plan` → approved MCP-verified plan
- `run-plan` → validated existing plan

### Skills Used Inline (not invoked, applied directly)
- `worktree-isolation` → pre-flight
- `test-first` → every task (red-green-refactor)
- `debug-discipline` → on any failure (self-correction hierarchy)
- `ship-gate` → final gate before delivery

### Downstream Consumers
- `deliver` → only human touchpoint

### Abort Escalation
| Condition | Escalate to | Action |
|---|---|---|
| 3 failed fix attempts | User | Report findings, suggest architectural change |
| MCP down for critical domain | User | Cannot verify, ask to proceed or wait |
| Test suite collapse | User | 3+ unrelated failures, stop |
| Security concern | User | Never ship insecure code autonomously |
