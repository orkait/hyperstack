---
name: behaviour-analysis
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
- When the user reports something "doesn't feel right" or "is inconsistent"
- Before shipping — final behavioural review
- When adding a new view mode, action, or state to an existing system

## Integration with hyperstack:designer

**If a DESIGN.md exists** (produced by `hyperstack:designer`), use it as the "expected behaviour" ground truth for the interaction matrix in Phase 2.

Mapping DESIGN.md sections to behaviour-analysis inputs:

| DESIGN.md Section | Use as... |
|---|---|
| 5. Component Specifications | **Expected states** for each component in the matrix. Every listed state MUST exist and be visually distinct. |
| 6. Motion | **Expected timing** for transitions. The matrix "expected behaviour" column cites DESIGN.md durations. |
| 8. Do's and Don'ts | **Heuristic audit assertions**. Each Do is a check; each Don't is a violation to search for. |
| 9. Responsive Breakpoints | **Composition states** for Phase 4 edge case sweep. Test every listed breakpoint. |
| 10. Anti-Patterns | **Violations to search for** in Phase 4. Fail the audit if any found. |

**Without a DESIGN.md:** Fall back to industry standards via WebSearch or general heuristics (the default behaviour described below).

**Reverse escalation:** If the audit finds a gap that the DESIGN.md doesn't specify (e.g., expected behaviour is ambiguous), escalate back to `hyperstack:designer` — the DESIGN.md may need to be updated.

## Process

### Phase 1: Inventory (read code, build the map)

Before judging anything, build a complete picture:

1. **Identify all state variables** that affect UI behaviour
   - Read the store/state management files
   - List every piece of state: data, config, transient UI state
   - Note which are persisted vs ephemeral

2. **Identify all user actions** that modify state
   - Buttons, clicks, drags, keyboard shortcuts, sliders, toggles
   - API calls triggered by actions
   - Implicit actions (hover, scroll, resize, mode switch)

3. **Identify all view modes / display states**
   - Tabs, toggles, conditional rendering branches
   - How different modes compose (layout mode x view mode x highlight state)

4. **Identify all feedback mechanisms**
   - Visual feedback (highlighting, dimming, borders, badges, glow)
   - Textual feedback (labels, counts, status text)
   - Animated feedback (transitions, physics, spring effects)
   - Absence of feedback (silent failures, no-ops)

Output: A **state inventory table** and an **action inventory table**.

### Phase 2: Interaction Matrix (the core analysis)

Build a matrix: **every action x every relevant state combination**.

For each cell ask:
- **What should happen?** (expected behaviour — think like a UX designer)
- **What does happen?** (actual behaviour — read the code path)
- **Match?** OK / BUG / UX-ISSUE / MISSING-FEEDBACK

Structure the matrix by category:

```markdown
| # | Action | Context/State | Expected | Actual | Status |
|---|--------|---------------|----------|--------|--------|
```

Categories to cover:
- **CRUD actions** (create, read, update, delete of primary data)
- **Selection & highlighting** (what gets selected, how, clear)
- **View mode transitions** (switching between modes)
- **Layout mode transitions** (switching layout engines)
- **Configuration changes** (sliders, toggles, settings)
- **Drag & interaction** (drag, hover, click targets)
- **Reset & cleanup** (what gets cleared, what persists)
- **Edge cases** (empty state, max state, conflicting states)

### Phase 3: Heuristic Audit

Apply Nielsen's 10 heuristics (adapted for interactive visualizations):

1. **Visibility of system status** — Does the UI show what's active, selected, loading?
2. **Match between system and real world** — Do labels make sense? Are actions named clearly?
3. **User control and freedom** — Can the user undo/escape from any state? Is there always a way back?
4. **Consistency and standards** — Do similar actions behave the same way everywhere?
5. **Error prevention** — Can the user reach a broken/dead state?
6. **Recognition rather than recall** — Is the current mode/state visible without memorizing?
7. **Flexibility and efficiency** — Are there shortcuts for power users?
8. **Aesthetic and minimalist design** — Is information presented at the right density?
9. **Help users recover from errors** — What happens on API failure, empty results, bad input?
10. **Accessibility** — Keyboard navigation, screen reader, reduced motion?

Refer to [references/heuristics.md](references/heuristics.md) for detailed questions per heuristic.

### Phase 4: Edge Case Sweep

Systematically check:

**Empty states:**
- No data loaded
- No results
- No highlights active
- Empty search filter results

**Boundary states:**
- Maximum data (100+ nodes)
- Single node, no edges
- All nodes highlighted
- All sliders at min/max

**Transition states:**
- Mode switch with active highlights
- Mode switch mid-drag
- Query execution while loading
- Rapid repeated actions (double-click, spam slider)

**Composition states:**
- Every view mode x every layout mode
- Highlight + search filter active simultaneously
- Collapsed groups + highlighting + path results

### Phase 5: Report

Output a structured report:

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

Severity levels:
- **CRITICAL** — broken functionality, data loss, unreachable state
- **HIGH** — major UX inconsistency, confusing behaviour
- **MEDIUM** — minor inconsistency, missing feedback
- **LOW** — cosmetic, nice-to-have

## Research Enhancement

Before starting the analysis, search for:
- Current best practices for the specific UI pattern being analyzed (graph viz, form, dashboard, etc.)
- Known UX patterns for the interaction model (drag-and-drop, force-directed graphs, etc.)
- Accessibility guidelines for the specific component type

Use findings to set expectations in the matrix — "expected behaviour" should be informed by industry standards, not just gut feeling.

## Key Principles

- **Think like a user first** — what would someone expect when they click this?
- **Think like QA second** — what's the worst thing that could happen?
- **Think like a developer third** — read the code to verify, don't assume
- **Every action must have visible feedback** — if clicking something does nothing visibly, that's a bug
- **Every state must be escapable** — the user should never be "stuck"
- **Composition must be tested** — features that work alone often break in combination
