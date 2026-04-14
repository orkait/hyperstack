---
name: engineering-discipline
category: core
description: Apply senior-level software engineering discipline including design patterns, SOLID principles, architectural reasoning, systematic verification, and safety gates. Use when writing production code, complex features, reviewing code, refactoring systems, or when engineering rigor and correctness are required. Supports both quick reference lookup and full step-by-step process mode.
triggers:
  - "build production code"
  - "design architecture"
  - "code review"
  - "refactor"
  - "engineering rigor"
  - "production feature"
  - "complex system"
  - "safety gates"
  - "design pattern"
  - "SOLID principles"
activation:
  mode: fuzzy
  priority: normal
  triggers:
    - "build production code"
    - "design architecture"
    - "code review"
    - "refactor"
    - "engineering rigor"
    - "production feature"
    - "complex system"
    - "safety gates"
    - "design pattern"
    - "SOLID principles"
compatibility: ">=2.0.0"
metadata:
  version: "2.0.0"
references:
  - references/patterns/readability.md
  - references/patterns/simplicity.md
  - references/patterns/design-architecture.md
  - references/patterns/testing.md
  - references/patterns/error-handling.md
  - references/patterns/maintainability.md
  - references/architecture/task-classification.md
  - references/architecture/architecture-reasoning.md
  - references/architecture/verification-gates.md
  - references/architecture/negative-doubt.md
  - references/architecture/output-format.md
---

# Engineering Discipline - Senior SDE-3 Framework

## Two Modes

- **Quick Reference** → direct lookup of patterns, principles, naming conventions
- **Process Mode** → full 8-step workflow for complex/production features

## The Iron Laws

```
1. NO REFACTOR WITHOUT TESTS FIRST
2. NO PATTERN WITHOUT A NAMED FORCE
3. NO SYNTAX BEFORE ARCHITECTURE
4. NO ASSUMPTIONS WITHOUT DISCLOSURE
5. NO "IT SHOULD WORK" - VERIFY IT DOES
```

Violating the letter = violating the spirit.

## Core Philosophy

- Correctness over speed → preserve invariants, prevent bugs
- Architecture over syntax → think in layers before coding
- Long-term maintainability → optimize for change velocity
- Explicit over implicit → no hidden assumptions
- Tests lock behavior → no refactor without tests
- Patterns require justification → no pattern without named force

## Quick Reference Index

### Patterns & Principles
- Readability & Clarity → `references/patterns/readability.md`
- Simplicity & Efficiency → `references/patterns/simplicity.md`
- Design & Architecture → `references/patterns/design-architecture.md`
- Testing & Quality → `references/patterns/testing.md`
- Error Handling → `references/patterns/error-handling.md`
- Maintainability → `references/patterns/maintainability.md`

### Architecture & Process
- Task Classification → `references/architecture/task-classification.md`
- Architecture Reasoning → `references/architecture/architecture-reasoning.md`
- Verification Gates → `references/architecture/verification-gates.md`
- Negative Doubt Bias → `references/architecture/negative-doubt.md`
- Standard Output Format → `references/architecture/output-format.md`

## Process Mode: 8-Step Framework

### Step 0: Environment Gate ⛔
Verify runtime, package manager, dependencies. Do NOT proceed without valid environment.

### Step 1: Task Classification 🏷️
Classify as exactly one: New feature | Refactor (behavior preserved) | Bug fix | Review/audit | Documentation only.
Unclear → STOP and request clarification.

**Visual/UX gate:** Task changes how something looks, feels, moves, or is interacted with → STOP, invoke `hyperstack:designer` first. Designer → DESIGN.md → input to `hyperstack:forge-plan`. Return to engineering-discipline only during execution of forge-plan tasks.

### Step 2: Load Engineering Constraints 📋
Hard rules: clear naming, single responsibility, explicit module boundaries, no circular dependencies, folder structure reflects architecture, tests before refactor, YAGNI, patterns only when forces are named.

### Step 3: Architecture-First Reasoning 🏗️
Reason in strict order:
1. Responsibilities → 2. Invariants → 3. Dependency Direction → 4. Module Boundaries → 5. Public APIs → 6. Folder Structure → 7. Files → 8. Functions → 9. Syntax

Never skip layers. Start at syntax → build wrong.

### Step 4: Behavior & Invariants 🔒
State observable behavior, invariants (input, state, ordering), and public vs private APIs.
Refactoring and behavior not test-locked → STOP.

### Step 5: Pattern Gate 🚧
Use design pattern ONLY if: force is stated, invariant it protects is stated, simpler alternatives rejected.
No force → no pattern.

### Step 6: Code Generation Rules ⚙️
- Prefer deletion over abstraction
- No `utils/`, `common/`, `shared/` without ownership
- One reason to change per file
- Explicit public API per module
- Flat over deep structures
- No global state without justification

### Step 7: Tests Are Part of Output 🧪
Behavior exists → tests must exist. Tests define invariants. Refactors require tests first.
No tests → no refactor.

### Step 8: Negative Doubt Routine 🔍
Self-verification: (1) list 5 failure modes, (2) falsify assumptions, (3) verify invariants enforced, (4) audit dependencies, (5) try simpler alternative, (6) add failure-mode tests, (7) revise if issues found, (8) log findings.
Critical issue unaddressed → HARD STOP.

## When to Use Each Section

| Situation | Reference |
|-----------|-----------|
| Need pattern advice | `references/patterns/` |
| Building complex feature | Full Process Mode (Steps 0-8) |
| Quick naming question | `references/patterns/readability.md` |
| Refactoring code | Process Mode + `references/patterns/maintainability.md` |
| Code review | Process Mode Step 4 + `references/patterns/testing.md` |
| Error handling unclear | `references/patterns/error-handling.md` |
| Architecture decisions | `references/architecture/architecture-reasoning.md` |
| Standard response format | `references/architecture/output-format.md` |

## Red Flags - STOP

| Thought | Reality |
|---|---|
| "Quick fix, don't need the full 8-step framework" | Quick fixes break invariants when you skip Step 3. Do the framework. |
| "I'll skip Step 8 Negative Doubt, I'm confident" | Confidence = #1 predictor of shipped bugs. Do the negative doubt. |
| "I already know the responsibilities" | Write them down anyway. Writing forces clarity you thought you had. |
| "Tests for a refactor are overkill" | Refactor without tests = random code change. Not negotiable. |
| "I'll add tests after the refactor" | Write tests first, watch them pass, then refactor. |
| "The pattern is obviously the right one" | Obvious patterns without named forces = cargo-culting. Name the force. |
| "Small code, skip architecture reasoning" | Small code with wrong architecture compounds fast. |
| "I'll assume the API is stable" | Never. State the assumption explicitly. |
| "The 5-failure-mode exercise is busywork" | Most effective bug catcher in the framework. Do all 5. |
| "I'll write tests that match the implementation" | Tests define behavior. Write them against the spec. |
| "Refactoring doesn't change behavior, so tests are unchanged" | Write a test first that locks behavior. Then refactor. Then run. |
| "I understand the invariants intuitively" | Write them down. Intuition drifts in 48 hours. |

## Critical Reminders

1. ⛔ No refactor without tests
2. ⛔ No pattern without named force
3. ⛔ No circular dependencies
4. ⛔ No assumptions without disclosure
5. ⛔ No global state without justification
6. ⛔ No proceeding with ambiguous requirements

Something cannot be done safely → say so and explain why.


## Lifecycle Integration

### Agent Workflow Chains

**Manual execution with phase gates:**
```
forge-plan → engineering-discipline (THIS) → ship-gate → deliver
                      ↓
         [8-step framework per task]
                      ↓
    test-first → debug-discipline (on failure) → code-review
```

### Upstream Dependencies
- `forge-plan` → approved plan
- `run-plan` → validated existing plan

### Skills Used Inline
- `test-first` → Step 7 (tests are part of output)
- `debug-discipline` → on any failure during implementation
- `code-review` → after completing major features

### Downstream Consumers
- `ship-gate` → verification before completion
- `deliver` → final delivery

### Visual/UX Gate
| Discovery | Escalate to | Action |
|---|---|---|
| Task changes look/feel/motion/interaction | `designer` | STOP, get DESIGN.md, return to forge-plan |
