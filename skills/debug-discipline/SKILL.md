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

A symptom fix is a failure. Random changes are not debugging — they are thrashing. Every fix attempt without a confirmed root cause increases the probability of a second bug.

**If you have not completed Phase 1, you cannot propose a fix.**

## When to Use

Use this for any technical failure:
- Test failures
- Runtime errors or panics
- Unexpected behaviour (wrong output, wrong rendering, wrong state)
- Build failures
- Performance regressions
- Integration issues

Use it **especially** when:
- Under time pressure — urgency makes guessing tempting
- "The fix is obvious" — obvious fixes often address the wrong layer
- You have already tried something and it did not work
- The error message points to a dependency or library function

## The Four Phases

### Phase 1: Root Cause Investigation

**BEFORE attempting any fix:**

**1. Read the error in full**
Stack trace, error message, line numbers, exit codes — read every line. Do not skim. The exact wording often contains the fix.

**2. Reproduce consistently**
Can you trigger it reliably? What are the exact steps? If you cannot reproduce it, do not guess — gather more data first.

**3. Check recent changes**
`git diff`, recent commits. What changed that could have caused this? Assume the most recent change is guilty until proven otherwise.

**4. Check MCP docs for the failing domain**

Before assuming you understand how a library or API behaves, verify:

| Domain | What to call |
|---|---|
| React Flow component behaves unexpectedly | `reactflow_get_api` for the component, `reactflow_get_pattern` for the usage pattern |
| Go runtime error (goroutine, context, nil pointer) | `golang_get_practice` for the relevant topic |
| Rust borrow checker / lifetime error | `rust_get_practice` + `rust_cheatsheet` |
| Echo middleware or routing issue | `echo_get_middleware` or `echo_get_recipe` |
| Motion animation not firing | `motion_get_api` for the failing hook or component |
| CSS/token rendering wrong | `design_tokens_get_gotchas` or `ui_ux_get_gotchas` |

The MCP gotchas data frequently contains the exact failure mode you are looking at. Check it before forming a hypothesis.

**5. Trace the data flow**

Where does the bad value originate? Trace backwards from the symptom to the source. Add diagnostic logging at each layer boundary if needed. Run once to see which layer breaks. Then investigate that specific layer.

Fix at the source. Never at the symptom.

### Phase 2: Pattern Analysis

Before writing a fix, find the correct pattern:

1. Locate similar working code in the same codebase
2. Compare the failing code against the working example — list every difference, however small
3. Check the MCP reference for the correct pattern (`[domain]_get_pattern`)
4. Understand what the failing code assumed that the working code does not

### Phase 3: Hypothesis and Test

Scientific method — one variable at a time:

1. **State the hypothesis explicitly:** "I believe X is the root cause because Y"
2. **Design the minimal test:** the smallest change that would confirm or refute the hypothesis
3. **Make one change** — do not bundle multiple fixes
4. **Verify the result:**
   - Confirms hypothesis → Phase 4
   - Refutes hypothesis → form a new hypothesis, return to top of Phase 3 (count this as a failed attempt)
   - After 2 refuted hypotheses: return to Phase 1 with all new information before forming another hypothesis
   - After 3 failed hypotheses total: stop — go directly to the Escalation Rule below
   - Do NOT stack a second change on top of a failed one

If you genuinely do not know what the root cause is after Phase 1 and 2, say so explicitly. "I don't understand why X behaves this way" is correct. Proposing a fix you don't understand is not.

### Phase 4: Fix

Fix the root cause. Not the symptom.

1. **Write a failing test first** — the simplest possible reproduction. Run it. Confirm it fails.
2. **Implement one fix** — address the confirmed root cause. One change.
3. **Run the test** — confirm it now passes.
4. **Check for regressions** — run the full test suite.
5. **Invoke `hyperstack:ship-gate`** before claiming the bug is fixed.

**Attempt counter — mandatory:**
- Attempts 1-2: if the fix does not work, return to Phase 1 with the new information
- **Attempt 3: STOP. Do not attempt a fourth fix.**

### Escalation Rule (3+ Failed Fixes)

Three failed attempts signals an architectural problem, not a surface bug.

Diagnostic pattern:
- Each fix reveals new coupling or unexpected shared state in a different location
- The correct fix would require "significant refactoring" — which means the current structure cannot accommodate the correct behaviour
- Each fix creates a new symptom elsewhere

At this point, stop fixing. Present the findings to the user: what you tried, what each attempt revealed, and what architectural change appears to be required. Do not continue patching.

## Red Flags — STOP

| Thought | Reality |
|---|---|
| "Let me just try changing X" | You do not have a root cause |
| "It's probably a race condition" | "Probably" is not a root cause |
| "Quick fix now, investigate later" | There is no later |
| "Multiple small changes at once" | You cannot isolate what worked |
| "The library is broken" | Check the MCP docs first |
| "One more attempt" (after 2 failures) | Stop. Escalate. |
| "I fixed it — the error is gone" | Run `hyperstack:ship-gate` |

## Integration

- Use `hyperstack:ship-gate` before claiming any bug is fixed
- Use `hyperstack:engineering-discipline` if Phase 4 escalation reveals an architectural change is needed
- Use `hyperstack:blueprint` if the fix requires building new functionality rather than correcting existing behaviour
