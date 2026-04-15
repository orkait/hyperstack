---
name: blueprint
category: core
description: Use before any feature build, component creation, or behaviour modification. MCP-surveyed design with a hard gate before any implementation. Do not skip, do not skim, do not rationalize your way out of it.
---

# Feature Planning

## The Iron Law

```
NO CODE WITHOUT AN APPROVED DESIGN
```

No design presented + no explicit user approval → no code. Violating the letter = violating the spirit.

## The Hard Gate

<HARD-GATE>
Do NOT write code, scaffold files, or invoke any implementation skill until:
1. MCP survey complete for relevant domains
2. Design presented OR We know user project preferences:
   - Visual/UX work → DESIGN.md contract from `skills/designer/SKILL.md` (if preference is not known)
   - Backend/infra work → architecture note from this skill
3. User explicitly approved it

Applies to every task, regardless of perceived simplicity.
</HARD-GATE>

## The 1% Rule

If there is even a 1% chance this task involves a new file, new component, new function, behavior change, config change affecting runtime, or any visual/UX modification → run blueprint first. No exceptions.

"Simple" tasks are where unexamined assumptions do the most damage. 5-minute design prevents hours of wrong implementation.

## The Process

### Step 1: Context Scan

Read the current state before asking anything:
- Relevant source files, recent commits, existing patterns
- What already exists that can be reused or extended
- Which Hyperstack MCP domains are relevant

Don't ask the user questions until you've scanned the codebase.

### Step 2: MCP Survey

| Domain is relevant | Call first |
|---|---|
| **Visual/UX work (any)** | **STOP → invoke `skills/designer/SKILL.md`. It produces DESIGN.md → input to Step 5 or directly to `forge-plan`.** |
| React Flow | `reactflow_search_docs` + `reactflow_list_apis` |
| Motion / animation | `motion_search_docs` + `motion_list_apis` |
| Lenis scroll | `lenis_search_docs` + `lenis_list_apis` |
| React / Next.js | `react_search_docs` + `react_list_patterns` |
| Go / Echo | `golang_search_docs` + `echo_list_recipes` |
| Rust | `rust_search_docs` + `rust_list_practices` |
| Design tokens | `design_tokens_list_categories` + `design_tokens_get_gotchas` |
| UI/UX | `ui_ux_list_principles` + `ui_ux_get_gotchas` |

Design built on wrong API assumptions = technical debt scheduled for delivery.

**Visual work routing:** New page, component library, landing page, dashboard, redesign, "make it look like X" → `designer` skill owns the design gate. Return with DESIGN.md → handoff (Step 7).

### Step 3: Clarify Requirements

Ask one clarifying question at a time:
- Purpose and success criteria → what does done look like?
- Constraints → performance targets, accessibility requirements, existing patterns
- Scope boundary → what is explicitly NOT included?

Wait for answer before asking the next. Multiple independent subsystems → flag before proceeding, decompose first.

### Step 4: Propose 2-3 Approaches

For each approach:
- Trade-offs
- MCP-backed APIs and patterns used (cite tool output from Step 2)
- Your recommendation with reasoning

Lead with your recommended option. No options without a recommendation.

### Step 5: Present Design

Scale each section to its complexity:

- **Architecture** → module boundaries, data flow, key abstractions
- **Invariants** → what must always be true at runtime
- **Interfaces** → public APIs between modules, including types
- **Error paths** → what happens when dependencies fail, inputs are invalid, async times out

Get user confirmation. Revise if needed. Don't proceed until approved.

### Step 6: Negative Doubt

List at least 5 failure modes before finalizing:

- What breaks at runtime under normal usage?
- What edge cases does this design not handle?
- Which invariants could be violated by concurrent operations or unexpected state?
- What does MCP `get_gotchas` say about this domain?
- What external dependency could change and break this?

Address each explicitly → design around it or record the accepted risk.

### Step 7: Handoff to Implementation

Once approved:
- Save design note to relevant docs directory if non-trivial
- Visual/UX work → DESIGN.md already exists. Save at `docs/DESIGN.md` or `<project>/DESIGN.md`.
- Invoke `hyperstack:forge-plan` → builds MCP-verified implementation plan from approved design
- DESIGN.md present → forge-plan reads it as input spec, each of 10 sections → one or more tasks

## Red Flags - STOP

| Thought | Reality |
|---|---|
| "I know React Flow well enough to skip the survey" | MCP has v12-specific API shapes. Memory has v11. Call the tool. |
| "This is too simple for a design" | Simple tasks → unexamined assumptions → most damage. Return to Hard Gate. |
| "Let me just start with a file and design as we go" | How wrong architectures get built. Design FIRST. |
| "User seems impatient, I'll skip Step 6" | User impatience ≠ permission to ship slop. Negative Doubt is not optional. |
| "I'll propose one approach - the obvious one" | Two approaches exist for every non-trivial design. Find both. |
| "The task is a single-line change" | Single line at the wrong place destroys invariants. Design first. |
| "This is a bug fix, not a feature" | Bug fixes change behavior. Behavior changes need designs. |
| "I'm just refactoring" | Refactors move responsibility. Moving responsibility is architectural. |
| "The design will slow us down" | Wrong code ships → fix it → fix it again. That is slow. Design once, ship right. |
| "I can reason about this without external tools" | MCP data contains gotchas you won't remember. Call the tool. |
| "The user will tell me if I'm wrong" | The user hired you to prevent that. Do the design. |
| "I already did a similar design last week" | State drifts. Codebase changes. Do the current survey. |
| "Let me start with a prototype" | Prototypes become production. Design the prototype. |


## Lifecycle Integration

### Agent Workflow Chains

**Website/Frontend Agent:**
```
blueprint (THIS) → designer → forge-plan → [execution] → ship-gate → deliver
     ↓ visual routing
```

**Backend/Infra Agent:**
```
blueprint (THIS) → forge-plan → [execution] → ship-gate → deliver
     ↓ architecture note
```

**Execution Options (chosen at forge-plan handoff):**
- `autonomous-mode` → full auto, stops only on failure
- `subagent-ops` → fresh agent per task, two-stage review
- `engineering-discipline` → manual with phase gates

### Upstream Dependencies
- None (entry point for feature work)
- `hyperstack` → 1% rule enforcement

### Downstream Consumers
- `forge-plan` → reads approved design, builds MCP-verified task plan
- `designer` → if visual/UX routing detected
- `run-plan` → if resuming existing plan

### Reverse Escalation
| Discovery | Escalate to | Action |
|---|---|---|
| Visual/UX work detected mid-task | `designer` | Pause, get DESIGN.md, resume |
| Architecture gap (non-visual) | `blueprint` | Re-enter for architecture decision |
