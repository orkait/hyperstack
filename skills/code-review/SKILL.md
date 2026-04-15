---
name: code-review
category: core
description: Use when completing tasks, implementing features, or before merging - to dispatch a review subagent and handle feedback with technical rigor.
---

# Code Review

## Two Modes

1. **Requesting** → dispatching a reviewer subagent to evaluate your work
2. **Receiving** → handling review feedback with technical rigor, not performative agreement

## Requesting Review

### When to Request

**Mandatory:**
- After each task in `subagent-ops` (handled automatically)
- After completing a major feature
- Before merge to main

**Valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing a complex bug

### How to Dispatch

**1. Get the diff range:**

```bash
BASE_SHA=$(git merge-base HEAD main)
HEAD_SHA=$(git rev-parse HEAD)
```

**2. Dispatch a review subagent with:**
- What was implemented (one sentence)
- Requirements or spec it should match
- The git diff (`git diff $BASE_SHA..$HEAD_SHA`)
- Specific question: "Does this match the spec? Flag missing, extra, or incorrect code."

**Note:** Review subagents get raw diff + spec only. Do not load bootstrap (`hyperstack`) → `<SUBAGENT-STOP>` gate prevents it anyway. Provide exactly what they need to evaluate.

**3. Act on results:**

| Severity | Action |
|---|---|
| Critical | Fix immediately. Do not proceed. |
| Important | Fix before moving to next task. |
| Minor | Note for later. |
| Disagree | Push back with technical reasoning. |

### MCP-Enhanced Review

For domain-specific code, include MCP verification in the review prompt:

> "For any React Flow API usage, verify against `reactflow_get_api`. For any Go patterns, verify against `golang_get_practice`. Flag any API usage that doesn't match MCP output."

This catches API drift a generic reviewer would miss.

## Receiving Review

### The Response Pattern

```
1. READ:       Complete feedback without reacting
2. UNDERSTAND: Restate the requirement (or ask)
3. VERIFY:     Check against codebase reality
4. EVALUATE:   Technically sound for THIS codebase?
5. RESPOND:    Technical acknowledgment or reasoned pushback
6. IMPLEMENT:  One item at a time, test each
```

### Forbidden Responses

Never:
- "You're absolutely right!"
- "Great point!"
- "Thanks for catching that!"
- Any performative agreement

Instead:
- Restate the technical requirement
- Ask clarifying questions if unclear
- Push back with reasoning if wrong
- Just fix it (actions over words)

### When to Push Back

Push back when:
- Suggestion breaks existing functionality
- Reviewer lacks full context
- Violates YAGNI
- Technically incorrect for this stack
- Conflicts with user's architectural decisions

**How:** Technical reasoning, not defensiveness. Reference working tests/code. Involve user if architectural.

### Handling Unclear Feedback

Any item unclear → stop. Do not implement anything yet. Ask for clarification first.

Items may be related. Partial understanding → wrong implementation.

### Implementation Order

For multi-item feedback:
1. Clarify anything unclear FIRST
2. Blocking issues (breaks, security)
3. Simple fixes (typos, imports)
4. Complex fixes (refactoring, logic)
5. Test each fix individually
6. Verify no regressions

## Red Flags - STOP

| Thought | Reality |
|---|---|
| "Skip review, it's simple" | Simple code has bugs. Review catches them. |
| "I'll review my own code" | Self-review ≠ code review. Dispatch a subagent. |
| "Reviewer is wrong, ignore it" | Push back with reasoning. Don't silently ignore. |
| "I agree with everything" | Performative agreement ≠ technical evaluation. |
| "I'll implement all feedback at once" | One item at a time, test each. |

## Integration

- **Called by:** `hyperstack:subagent-ops` (per-task review cycle), `hyperstack:deliver` (pre-merge review)
- **Pairs with:** `hyperstack:ship-gate` (verification after fixes)
- **Escalate to:** User if reviewer and implementer disagree on architectural decisions


## Lifecycle Integration

### Agent Workflow Chains

**Per-task review (subagent-ops):**
```
subagent-ops → implementer → code-review (THIS) → [fix loop] → next task
```

**Pre-merge review:**
```
[autonomous-mode | engineering-discipline] → code-review (THIS) → deliver
```

### Upstream Dependencies
- `subagent-ops` → per-task review cycle (automatic)
- `engineering-discipline` → after completing major features
- `deliver` → pre-merge review

### Skills Used With
- `ship-gate` → verification after review fixes applied

### MCP-Enhanced Review
Include MCP verification in review prompts for domain-specific code (reactflow_get_api, golang_get_practice, etc.)
