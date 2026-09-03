---
name: best-practices
category: core
description: The language-agnostic engineering rulebook - Clean Code and Gang of Four patterns, SOLID, architectural reasoning, coupling and abstraction limits, change and review hygiene, architecture-at-scale decisions, an operations baseline, systematic verification, and safety gates. Use when writing production code, choosing an abstraction or design pattern, reviewing code, refactoring systems, deciding where a boundary goes, or when engineering rigor and correctness are required. Supports both quick reference lookup and full step-by-step process mode.
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
  - "clean code"
  - "code quality"
  - "best practices"
  - "coding standards"
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
    - "clean code"
    - "code quality"
    - "best practices"
    - "coding standards"
compatibility: ">=2.0.0"
metadata:
  version: "3.0.0"
  supersedes: ["engineering-discipline", "design-patterns-skill"]
references:
  - references/patterns/readability.md
  - references/patterns/simplicity.md
  - references/patterns/design-architecture.md
  - references/patterns/testing.md
  - references/patterns/error-handling.md
  - references/patterns/maintainability.md
  - references/practices/coupling-and-abstraction.md
  - references/practices/change-hygiene.md
  - references/practices/architecture-scale.md
  - references/practices/operations-baseline.md
  - references/architecture/task-classification.md
  - references/architecture/architecture-reasoning.md
  - references/architecture/verification-gates.md
  - references/architecture/negative-doubt.md
  - references/architecture/output-format.md
---

# Best Practices - Senior SDE-3 Engineering Rulebook

Absorbs the former `engineering-discipline` and `design-patterns-skill`. One source for how code is
written, reviewed, and shipped in a Hyperstack-governed repository.

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

## Coding Laws

How to write code in any Hyperstack-governed repo. These compose with the Iron Laws above and are enforced at `ship-gate`.

**Law 0 - does this need to exist?** Before any law below, ask whether the code should be written at all. Speculative need, unrequested abstraction, boilerplate "for later" - skip it and say so in one line. The cheapest code is the code never written. Stop at the first rung that holds: needed? → stdlib? → native platform feature? → already-installed dependency? → one line? → only then the minimum that works. (This is the `ponytail` lazy-senior-dev ladder; compose with it for the full minimalism pass before `blueprint`.)

1. **Config out of code.** Every value that varies by environment, deploy, or secret lives in config/env/constants - never inlined. If you type a literal that could change, lift it.
2. **Build for reuse.** Write each unit so the next caller uses it without copying. Extract the shared shape at the second duplicate, not the fifth - but do not abstract before the duplication is real.
3. **No hacks, no hot patches.** Never paper over a problem with a local workaround. Find the root cause and propose the complete fix as a plan (`hyperstack:blueprint` / `hyperstack:forge-plan`). If the proper fix is large, say so and let the user decide - never ship the hack silently. When a deliberate simplification IS the right call, mark it inline with its ceiling and upgrade path - `// upgrade: global lock; per-account locks if throughput matters`. A marked shortcut reads as intent, not ignorance, and carries its own fix. (Convention borrowed from `ponytail`'s shortcut markers.)
4. **React: respect the house.** Follow current industry practice and the project's existing folder structure; do not impose your own layout on an established repo. Ground component and API choices in the `react_*` / `shadcn_*` MCP tools, not memory. When a file outgrows what it should hold, flag it and propose the split - then respect the user's call.
5. **Lean comments.** A comment explains non-obvious *why*; it never narrates *what* the code already says. Where you find comment poisoning (over-commented code), flag it and propose trimming - do not add to it.
6. **Docs are source of truth.** Treat docs as code that drifts. When you change behaviour the docs describe, update the docs in the same change. When you find docs that no longer match the code, flag the drift and correct it (`hyperstack:readme-writer`).
7. **Crisp communication.** Say what you mean in the fewest exact words. No filler, no padding, no vague gestures - every sentence carries intent or it is cut.

These connect outward, they are not an island: Laws 1, 2, and 5 are the same family as `codemode`'s post-load discipline; Law 3 routes to the planning gates; Law 4 to the `react_*` / `shadcn_*` plugins; Law 6 to the doc-maintenance lifecycle. Stated once here; other skills reference, not restate.

## Quick Reference Index

### Patterns & Principles
- Readability & Clarity → `references/patterns/readability.md`
- Simplicity & Efficiency (KISS, DRY, YAGNI) → `references/patterns/simplicity.md`
- Design & Architecture (SRP, composition, GoF patterns) → `references/patterns/design-architecture.md`
- Testing & Quality → `references/patterns/testing.md`
- Error Handling → `references/patterns/error-handling.md`
- Maintainability → `references/patterns/maintainability.md`

### Practices
- Coupling & Abstraction (Demeter, CQS, flag args, rule of three, leaky abstractions) → `references/practices/coupling-and-abstraction.md`
- Change Hygiene (commits, branches, PR size, review conduct, tracked debt) → `references/practices/change-hygiene.md`
- Architecture at Scale (modular monolith, dependency direction, 12 factors, ADRs) → `references/practices/architecture-scale.md`
- Operations Baseline (structured logs, metrics, health, degradation, N+1) → `references/practices/operations-baseline.md`

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

**Visual/UX gate:** Task changes how something looks, feels, moves, or is interacted with → STOP, invoke `hyperstack:designer` first. Designer → DESIGN.md → input to `hyperstack:forge-plan`. Return to best-practices only during execution of forge-plan tasks.

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
| Boundary, coupling, or "should this be abstracted" | `references/practices/coupling-and-abstraction.md` |
| Commits, PR size, how to give review feedback | `references/practices/change-hygiene.md` |
| Monolith vs services, dependency direction, ADR | `references/practices/architecture-scale.md` |
| Logging, health checks, timeouts, degradation | `references/practices/operations-baseline.md` |

## Pattern Selection Quick Reference

| Situation | Apply |
|-----------|-------|
| Function > 20 lines | Split into smaller functions (SRP) |
| Repeated code blocks, third occurrence | Extract to function or constant (DRY, rule of three) |
| Complex conditionals | Strategy or State pattern |
| Object creation logic | Factory pattern |
| Cross-cutting concerns | Decorator or Observer pattern |
| Incompatible interfaces | Adapter pattern |
| Need undo or an audit log | Command pattern |
| Global access point | Singleton, sparingly, and name the force |
| Chained calls through another object's internals | Move the behavior (Law of Demeter) |
| A boolean parameter selecting behavior | Two functions, no flag argument |

Every row is subject to the Pattern Gate in Step 5. A row matching is not a reason; the named force is.

## AI-Specific Guidance

When generating or reviewing code, the failure modes are predictable:

| Bias | Counter |
|---|---|
| Pattern prediction: reaching for the pattern that appears most in training data | Name the force first, then pick. No force, no pattern |
| Generic naming: `data`, `temp`, `result`, `handler` | Name the concept, not the container |
| Skipping edge cases because the happy path compiles | Null, empty, zero, max, negative, unicode, concurrent |
| Combining unrelated operations into one function | One reason to change per unit |
| Importing a convention from another project | Match the conventions already in this repository |
| Over-commenting generated code | A comment explains a non-obvious why, never the what |

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
forge-plan → best-practices (THIS) → ship-gate → deliver
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

### Owned Elsewhere - Route, Do Not Restate

| Concern | Skill |
|---|---|
| Vulnerability hunting, OWASP mapping | `security-review` |
| Complexity analysis, algorithmic wins | `optimizer` |
| Dispatching a reviewer and handling feedback | `code-review` (this skill supplies the review conduct rules it applies) |
| React and Next.js specifics | `react-pro-coder` |
| FastAPI, Pydantic, SQLAlchemy specifics | `python-pro-coder` |
| Visual and interaction design | `designer`, `ui-ux`, `design-tokens` |

## Sources

- *Clean Code* - Robert C. Martin
- *A Philosophy of Software Design* - John Ousterhout
- *The Pragmatic Programmer* - Hunt and Thomas
- *Code Complete* - Steve McConnell
- *Refactoring* - Martin Fowler
- *Design Patterns* - Gang of Four
- *The Twelve-Factor App* - 12factor.net
