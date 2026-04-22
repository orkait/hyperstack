---
name: debug-discipline
category: core
description: Use when encountering any bug, test failure, or unexpected behaviour. Root cause investigation is mandatory before any fix attempt.
---

# Systematic Debugging

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE FIRST.
```

Symptom fix = failure. Random changes = thrashing. Every fix attempt without confirmed root cause → higher probability of a second bug.

Phase 1 not complete → no fix proposed.

## When to Use

Any technical failure: test failures, runtime errors/panics, unexpected behaviour, build failures, performance regressions, integration issues.

Use **especially** when:
- Under time pressure → urgency makes guessing tempting
- "The fix is obvious" → obvious fixes often address the wrong layer
- You already tried something and it didn't work
- Error message points to a dependency or library function

## The Four Phases

### Phase 1: Root Cause Investigation

**BEFORE any fix attempt:**

**1. Read the error in full**
Stack trace, error message, line numbers, exit codes → read every line. The exact wording often contains the fix.

**2. Reproduce consistently**
Can you trigger it reliably? Exact steps? Can't reproduce → gather more data first, don't guess.

**3. Check recent changes**
`git diff`, recent commits. Most recent change is guilty until proven otherwise.

**4. Check MCP docs for the failing domain**

| Domain | Call |
|---|---|
| React Flow component behaves unexpectedly | `reactflow_get_api` for the component, `reactflow_get_pattern` for usage |
| Go runtime error (goroutine, context, nil pointer) | `golang_get_practice` for the relevant topic |
| Rust borrow checker / lifetime error | `rust_get_practice` + `rust_cheatsheet` |
| Echo middleware or routing issue | `echo_get_middleware` or `echo_get_recipe` |
| Motion animation not firing | `motion_get_api` for the failing hook or component |
| CSS/token rendering wrong | `design_tokens_get_gotchas` or `ui_ux_get_gotchas` |

MCP gotchas data frequently contains the exact failure mode you're looking at.

**5. Trace the data flow**
Where does the bad value originate? Trace backwards from symptom to source. Add diagnostic logging at each layer boundary if needed. Run once to see which layer breaks → investigate that layer.

Fix at the source. Never at the symptom.

### Phase 2: Pattern Analysis

Before writing a fix:

1. Locate similar working code in the same codebase
2. Compare failing code against working example → list every difference, however small
3. Check MCP reference for the correct pattern (`[domain]_get_pattern`)
4. Understand what the failing code assumed that the working code does not

### Phase 3: Hypothesis and Test

One variable at a time:

1. **State hypothesis explicitly:** "I believe X is the root cause because Y"
2. **Design minimal test:** smallest change that confirms or refutes the hypothesis
3. **Make one change** → don't bundle multiple fixes
4. **Verify result:**
   - Confirms → Phase 4
   - Refutes → new hypothesis, return to top of Phase 3 (count as failed attempt)
   - After 2 refuted hypotheses → return to Phase 1 with all new information
   - After 3 failed hypotheses total → stop, go to Escalation Rule

Don't stack a second change on top of a failed one.

If you genuinely don't know the root cause after Phase 1 and 2 → say so explicitly. Proposing a fix you don't understand is not debugging.

### Phase 4: Fix

Fix the root cause. Not the symptom.

1. **Write failing test first** → simplest possible reproduction. Run it. Confirm it fails.
2. **Implement one fix** → address confirmed root cause. One change.
3. **Run the test** → confirm it passes.
4. **Check for regressions** → run full test suite.
5. **Invoke `hyperstack:ship-gate`** before claiming the bug is fixed.

**Attempt counter - mandatory:**
- Attempts 1-2: fix doesn't work → return to Phase 1 with new information
- **Attempt 3: STOP. Do not attempt a fourth fix.**

### Escalation Rule (3+ Failed Fixes)

Three failed attempts → architectural problem, not a surface bug.

Signals:
- Each fix reveals new coupling or unexpected shared state elsewhere
- Correct fix would require "significant refactoring" → current structure can't accommodate correct behaviour
- Each fix creates a new symptom elsewhere

Stop fixing. Present findings to user: what you tried, what each attempt revealed, what architectural change appears required.

## Red Flags - STOP

| Thought | Reality |
|---|---|
| "Let me just try changing X" | No root cause → don't touch it |
| "It's probably a race condition" | "Probably" ≠ root cause |
| "Quick fix now, investigate later" | There is no later |
| "Multiple small changes at once" | Can't isolate what worked |
| "The library is broken" | Check MCP docs first |
| "One more attempt" (after 2 failures) | Stop. Escalate. |
| "I fixed it - the error is gone" | Run `hyperstack:ship-gate` |

## Integration

- Use `hyperstack:ship-gate` before claiming any bug is fixed
- Use `hyperstack:engineering-discipline` if Phase 4 escalation reveals architectural change needed
- Use `hyperstack:blueprint` if fix requires building new functionality rather than correcting existing behaviour


## Lifecycle Integration

### Agent Workflow Chains

**Used inline during execution:**
```
[autonomous-mode | subagent-ops | engineering-discipline] → debug-discipline (THIS)
                                                                    ↓
                                                    [self-correction hierarchy]
                                                                    ↓
                                                    [fix → ship-gate]
```

### Upstream Dependencies
- Any execution mode encountering failure

### Skills Used Inline
- `test-first` → Phase 4 (write failing test before fix)
- `ship-gate` → Phase 4 (verify fix before claiming complete)

### Escalation Paths
| Condition | Escalate to | Action |
|---|---|---|
| 3 failed fix attempts | User | Architectural problem, not surface bug |
| Fix requires new functionality | `blueprint` | Not a bug fix, needs design |
| Fix requires architectural change | `engineering-discipline` | Step 3 architecture reasoning |
