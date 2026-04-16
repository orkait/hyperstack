---
name: test-first
category: core
description: Use when implementing any feature, bug fix, or behaviour change - before writing implementation code. Enforces test-before-code discipline.
---

# Test-First Development


## When to Use

**Always:**
- New features
- Bug fixes
- Behaviour changes
- Refactoring (lock behaviour with tests first)

**Exceptions (user must explicitly approve):**
- Throwaway prototypes
- Generated code
- Configuration-only changes

Thinking "skip TDD just this once"? That's rationalization. Stop.

## Red-Green-Refactor

### RED: Write Failing Test

Write one minimal test showing what **should** happen.

Requirements:
- One behaviour per test
- Clear name describing the behaviour ("rejects empty email", not "test1")
- Real code, not mocks (unless external dependency makes it unavoidable)

Run the test. Confirm it **fails** for the right reason (feature missing, not typo or import error).

Test passes immediately? → You're testing existing behaviour. Fix the test.

### GREEN: Minimal Code

Write the **simplest** code that makes the test pass.

Do not:
- Add features beyond what the test requires
- Refactor other code
- Add configurability, options, or generalization

Run the test. Confirm it passes. Confirm other tests still pass.

Test still fails? → Fix code, not test.

### REFACTOR: Clean Up (Tests Stay Green)

After green only:
- Remove duplication
- Improve names
- Extract helpers

Run tests after every change. Anything goes red → revert the refactor.

### Repeat

Next failing test for next behaviour.

## MCP Integration

Before writing a test for domain-specific code, verify the API shape:

| Domain | Verify with |
|---|---|
| React Flow | `reactflow_get_api` for the component under test |
| Motion | `motion_get_api` for the animation primitive |
| Go / Echo | `golang_get_pattern` or `echo_get_recipe` |
| Rust | `rust_get_practice` for the relevant pattern |
| Design tokens | `design_tokens_get_procedure` |

Test built on wrong API assumptions → passes against wrong code. MCP verification prevents this.

## Debugging Integration

Bug found → write a failing test that reproduces it → follow red-green cycle. The test proves the fix and prevents regression.

Never fix bugs without a test. Use `hyperstack:debug-discipline` for root cause, then write the test here.

## Verification

Before marking work complete:

- Every new function/method has a test
- You watched each test fail before implementing
- Each test failed for the expected reason (feature missing, not typo)
- Minimal code was written to pass each test
- All tests pass
- Tests use real code (mocks only if unavoidable)

Can't check all boxes? → You skipped TDD. Start over.

## The Rule

No production code without a failing test first. Delete code written before the test — don't keep it as "reference".


## Integration

- **Invoked by:** `hyperstack:engineering-discipline` (Step 7), `hyperstack:forge-plan` (task steps), `hyperstack:subagent-ops` (implementer subagents)
- **Pairs with:** `hyperstack:debug-discipline` (write failing test after root cause found)
- **Verified by:** `hyperstack:ship-gate` (checks test evidence before completion claims)


## Lifecycle Integration

### Agent Workflow Chains

**Used inline during all implementation:**
```
[autonomous-mode | subagent-ops | engineering-discipline] → test-first (THIS)
                                                                  ↓
                                                    [red-green-refactor per task]
```

### Upstream Dependencies
- Any execution mode implementing features/fixes

### Skills Used With
- `debug-discipline` → write failing test after root cause found
- `ship-gate` → verifies test evidence before completion claims

### MCP Integration
Before writing test → verify API shape with relevant MCP tool (reactflow_get_api, golang_get_pattern, etc.)
