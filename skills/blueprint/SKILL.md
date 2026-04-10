---
name: blueprint
description: Use before any feature build, component creation, or behaviour modification. MCP-surveyed design with a hard gate before any implementation. Do not skip, do not skim, do not rationalize your way out of it.
---

# Feature Planning

## The Iron Law

```
NO CODE WITHOUT AN APPROVED DESIGN
```

If you have not presented a design and the user has not explicitly approved it, you cannot write code. **Violating the letter of this rule is violating the spirit of this rule.**

## The Hard Gate

<HARD-GATE>
Do NOT write code, scaffold files, or invoke any implementation skill until:
1. You have completed the MCP survey for relevant domains
2. You have presented a design
   - For VISUAL/UX work: the design is a DESIGN.md contract from `skills/designer/SKILL.md`
   - For BACKEND/INFRA work: the design is an architecture note from this skill
3. The user has explicitly approved it

This applies to every task, regardless of perceived simplicity.
</HARD-GATE>

## The 1% Rule

If there is even a 1% chance this task involves:
- A new file
- A new component
- A new function
- A behavior change
- A configuration change that affects runtime
- Any visual/UX modification

...then you MUST run blueprint first. You do not have a choice. You cannot rationalize your way out.

"Simple" tasks are where unexamined assumptions do the most damage. A 5-minute design prevents hours of wrong implementation. There are no exceptions.

## The Process

### Step 1: Context Scan

Before asking anything, read the current state:
- Relevant source files, recent commits, existing patterns
- What already exists that can be reused or extended
- Which Hyperstack MCP domains are relevant to this task

Do not ask the user questions until you have scanned the codebase. You should arrive at Step 2 already informed.

### Step 2: MCP Survey

For each relevant domain, call the discovery tools before proposing anything:

| Domain is relevant | Call first |
|---|---|
| **Visual/UX work (any)** | **STOP this flow. Invoke `skills/designer/SKILL.md` instead. It produces a DESIGN.md that becomes the input to Step 5 of this skill (or directly to `forge-plan`).** |
| React Flow | `reactflow_search_docs` + `reactflow_list_apis` |
| Motion / animation | `motion_search_docs` + `motion_list_apis` |
| Lenis scroll | `lenis_search_docs` + `lenis_list_apis` |
| React / Next.js | `react_search_docs` + `react_list_patterns` |
| Go / Echo | `golang_search_docs` + `echo_list_recipes` |
| Rust | `rust_search_docs` + `rust_list_practices` |
| Design tokens | `design_tokens_list_categories` + `design_tokens_get_gotchas` |
| UI/UX | `ui_ux_list_principles` + `ui_ux_get_gotchas` |

This step ensures the design you propose uses real API shapes — not imagined ones. A design built on wrong API assumptions is not a design; it is technical debt scheduled for delivery.

**Visual work routing:** If the user's request involves designing a new page, component library, landing page, dashboard, redesign, or any "make it look like X" task — the `designer` skill owns the design gate. Invoke it instead of running Step 4-6 here. Return with a DESIGN.md contract and proceed to handoff (Step 7).

### Step 3: Clarify Requirements

Ask clarifying questions one at a time:
- Purpose and success criteria — what does done look like?
- Constraints — performance targets, accessibility requirements, existing patterns to follow
- Scope boundary — what is explicitly NOT included in this task?

One question per message. Wait for the answer before asking the next one.

If the request describes multiple independent subsystems, flag this before proceeding. One design → one implementation cycle. Large requests must be decomposed into sub-projects first.

### Step 4: Propose 2-3 Approaches

Present options with:
- Trade-offs for each approach
- Which MCP-backed APIs and patterns each approach uses (cite the tool output from Step 2)
- Your recommendation with reasoning

Lead with your recommended option. Do not present options without a recommendation.

### Step 5: Present Design

Scale each section to its complexity:

- **Architecture** — module boundaries, data flow, key abstractions
- **Invariants** — what must always be true at runtime
- **Interfaces** — public APIs between modules, including types
- **Error paths** — what happens when dependencies fail, inputs are invalid, or async operations time out

Get user confirmation after presenting. Revise if needed. Do not proceed until the user approves.

### Step 6: Negative Doubt

Before finalising, list at least 5 failure modes:

- What breaks at runtime under normal usage?
- What edge cases does this design not handle?
- Which invariants could be violated by concurrent operations or unexpected state?
- What does the MCP `get_gotchas` data say about this domain?
- What external dependency (API, library version, browser API) could change and break this?

Address each failure mode explicitly — either design around it or record the accepted risk.

### Step 7: Handoff to Implementation

Once the design is approved:
- Save a short design note to the relevant docs directory if the task is non-trivial
- For visual/UX work: DESIGN.md already exists (produced by `designer` skill). Save it at `docs/DESIGN.md` or `<project>/DESIGN.md`.
- Invoke `hyperstack:forge-plan` to build a fully MCP-verified implementation plan from the approved design
- **If DESIGN.md exists:** forge-plan reads it as its input spec. Each of the 10 sections becomes one or more tasks.
- The approved design is the spec — `forge-plan` translates it into traceable tasks, `engineering-discipline` executes them

## Red Flags — STOP

These are the exact thoughts you will have when you want to skip this skill. Every one is a rationalization. Every one has been used before to build wrong architectures. Every one has a counter.

| Thought | Reality |
|---|---|
| "I know React Flow well enough to skip the survey" | MCP data has v12-specific API shapes. Memory has v11. Call the tool. |
| "This is too simple for a design" | Simple tasks are where unexamined assumptions do the most damage. Return to the Hard Gate. |
| "Let me just start with a file and we'll design as we go" | This is how wrong architectures get built. Do the design FIRST. |
| "The user seems impatient, I'll skip Step 6" | User impatience is not permission to ship slop. Negative Doubt is not optional. |
| "I'll propose one approach — the obvious one" | Two approaches exist for every non-trivial design. Find both. |
| "The task is a single-line change" | A single line at the wrong place destroys invariants. Design first. |
| "This is a bug fix, not a feature" | Bug fixes change behavior. Behavior changes need designs. |
| "I'm just refactoring" | Refactors move responsibility. Moving responsibility is architectural. Design first. |
| "The design will slow us down" | No. Wrong code ships. Then you fix it. Then fix it again. That is slow. Design once, ship right. |
| "I can reason about this without external tools" | MCP data contains edge cases and gotchas you will not remember. Call the tool. |
| "The user will tell me if I'm wrong" | The user hired you to prevent that. Do the design. |
| "I already did a similar design last week" | State drifts. Codebase changes. Do the current survey. |
| "This is not my call, I'm just executing instructions" | Executing instructions with no design is how bad instructions become shipped bugs. Design first. |
| "Let me start with a prototype" | Prototypes become production. Design the prototype. |
