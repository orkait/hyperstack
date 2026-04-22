---
name: behaviour-analysis
category: domain
description: Systematic UI/UX behaviour analysis for interactive applications. Audits every user action, state transition, view mode, and edge case like an experienced QA + UX engineer. Produces a complete interaction matrix with expected vs actual behaviour, finds inconsistencies, dead states, and missing feedback. Use when reviewing UI behaviour, before shipping features, or when something "feels off" but you can't pinpoint why.
compatibility: Requires Read, Grep, Glob, WebSearch tools. Works with any frontend codebase.
metadata:
  author: kai
  version: "1.0"
---

# Behaviour Analysis

Systematic interaction audit combining UX heuristics, QA state-machine thinking, and developer code-reading.

## When to Use

- After implementing a feature with multiple interaction modes
- User reports something "doesn't feel right" or "is inconsistent"
- Before shipping → final behavioural review
- Adding a new view mode, action, or state to an existing system

## Integration with hyperstack:designer

**If DESIGN.md exists** → use it as "expected behaviour" ground truth for the interaction matrix in Phase 2.

| DESIGN.md Section | Use as... |
|---|---|
| 5. Component Specifications | Expected states per component. Every listed state MUST exist and be visually distinct. |
| 6. Motion | Expected timing for transitions. Matrix "expected" column cites DESIGN.md durations. |
| 8. Do's and Don'ts | Heuristic audit assertions. Each Do = check; each Don't = violation to search for. |
| 9. Responsive Breakpoints | Composition states for Phase 4 edge case sweep. Test every listed breakpoint. |
| 10. Anti-Patterns | Violations to search for in Phase 4. Fail audit if any found. |

**Without DESIGN.md:** Fall back to industry standards via WebSearch or general heuristics.

**Reverse escalation:** Audit finds a gap DESIGN.md doesn't specify → escalate back to `hyperstack:designer`.

## Process

### Phase 1: Inventory

Build a complete picture before judging anything:

1. **State variables** → read store/state management files, list every piece of state (data, config, transient UI), note persisted vs ephemeral
2. **User actions** → buttons, clicks, drags, keyboard shortcuts, sliders, toggles, API calls, implicit actions (hover, scroll, resize)
3. **View modes / display states** → tabs, toggles, conditional rendering branches, how modes compose
4. **Feedback mechanisms** → visual (highlighting, dimming, borders, badges), textual (labels, counts, status), animated (transitions, spring), absence of feedback (silent failures, no-ops)

Output: state inventory table + action inventory table.

### Phase 2: Interaction Matrix

Build matrix: every action × every relevant state combination.

For each cell:
- What should happen? (expected - think like UX designer)
- What does happen? (actual - read the code path)
- Match? → OK / BUG / UX-ISSUE / MISSING-FEEDBACK

```markdown
| # | Action | Context/State | Expected | Actual | Status |
|---|--------|---------------|----------|--------|--------|
```

Categories to cover:
- CRUD actions
- Selection & highlighting
- View mode transitions
- Layout mode transitions
- Configuration changes (sliders, toggles, settings)
- Drag & interaction
- Reset & cleanup
- Edge cases (empty, max, conflicting states)

### Phase 3: Heuristic Audit

Apply Nielsen's 10 heuristics:

1. **Visibility of system status** → does UI show what's active, selected, loading?
2. **Match between system and real world** → labels make sense? actions named clearly?
3. **User control and freedom** → can user undo/escape from any state?
4. **Consistency and standards** → similar actions behave the same everywhere?
5. **Error prevention** → can user reach a broken/dead state?
6. **Recognition rather than recall** → current mode/state visible without memorizing?
7. **Flexibility and efficiency** → shortcuts for power users?
8. **Aesthetic and minimalist design** → information at right density?
9. **Help users recover from errors** → what happens on API failure, empty results, bad input?
10. **Accessibility** → keyboard navigation, screen reader, reduced motion?

See [references/heuristics.md](references/heuristics.md) for detailed questions per heuristic.

### Phase 4: Edge Case Sweep

**Empty states:** no data, no results, no highlights, empty search filter results

**Boundary states:** 100+ nodes, single node/no edges, all nodes highlighted, all sliders at min/max

**Transition states:** mode switch with active highlights, mode switch mid-drag, query execution while loading, rapid repeated actions (double-click, spam slider)

**Composition states:** every view mode × every layout mode, highlight + search filter active simultaneously, collapsed groups + highlighting + path results

### Phase 5: Report

```markdown
## State Inventory
[table of all state variables]

## Action × State Matrix
[full interaction matrix with status]

## Heuristic Findings
[issues grouped by heuristic, with severity]

## Edge Cases
[bugs and UX issues found]

## Verdict
[summary: how many behaviours tested, how many correct, critical issues]
```

Severity: **CRITICAL** → broken/data loss/unreachable state | **HIGH** → major UX inconsistency | **MEDIUM** → minor inconsistency/missing feedback | **LOW** → cosmetic

## Research Enhancement

Before starting, search for:
- Current best practices for the specific UI pattern (graph viz, form, dashboard, etc.)
- Known UX patterns for the interaction model (drag-and-drop, force-directed graphs, etc.)
- Accessibility guidelines for the specific component type

Use findings to set expectations in the matrix - "expected behaviour" should be informed by industry standards, not gut feeling.

## Key Principles

- Think like a user first → what would someone expect when they click this?
- Think like QA second → what's the worst that could happen?
- Think like a developer third → read the code to verify, don't assume
- Every action must have visible feedback → silent no-op = bug
- Every state must be escapable → user should never be stuck
- Composition must be tested → features that work alone often break together

## The Iron Law

```
NO BEHAVIOUR CLAIM WITHOUT READING THE CODE PATH
```

You cannot say "this should work" - trace the actual code path and confirm. Reading code is not optional.

## Red Flags - STOP

| Thought | Reality |
|---|---|
| "I'll check a few interactions, not the full matrix" | Partial coverage misses composition bugs. Full matrix. |
| "This state combination is unlikely" | Unlikely states are where bugs live. Test them. |
| "Nielsen's heuristics are common sense" | Common sense ≠ verification. Apply them explicitly. |
| "I already know this code" | Code drifts. Mental models drift faster. Read it. |
| "Empty states are trivial" | Empty states = #1 place products feel broken. Audit them. |
| "Transition states will be fine" | Mid-drag/mid-animation/mid-load = where race conditions live. |
| "The user will report any issues" | Users don't report vague discomfort. They leave. |
| "Full audit is overkill for a simple component" | Simple components compose into complex flows. Audit it. |
| "I'll skip heuristics I don't remember exactly" | Open the reference. All 10 get applied. |
| "The behaviour feels right" | Feelings ≠ evidence. Read the code. |
| "I tested the happy path manually" | Happy path = 20% of the matrix. Audit the unhappy paths. |
| "No DESIGN.md → no ground truth" | Search for one. Escalate to designer if missing. |


## Lifecycle Integration

### Agent Workflow Chains

**UI/UX audit (after implementation):**
```
[execution complete] → behaviour-analysis (THIS) → [fix issues] → ship-gate
```

**DESIGN.md integration:**
```
designer → DESIGN.md → forge-plan → [execution] → behaviour-analysis (uses DESIGN.md as ground truth)
```

### Upstream Dependencies
- Implemented feature with multiple interaction modes
- `designer` → DESIGN.md as expected behaviour ground truth (if exists)

### Downstream Consumers
- `ship-gate` → final verification after fixes

### Reverse Escalation
| Discovery | Escalate to | Action |
|---|---|---|
| DESIGN.md doesn't specify expected behaviour | `designer` | Append clarification to DESIGN.md |
| Audit finds gap DESIGN.md doesn't cover | `designer` | Add to DESIGN.md |
