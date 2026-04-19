<!-- GENERATED FILE. Edit skills/hyperstack/SKILL.md and re-run `bun run compile:context`. -->
# Hyperstack Runtime Bootstrap

## Critical
Hyperstack is active. This constitutes the mandatory operational framework for this repository.

**Three-Layer Ecosystem:**
1. **Layer 1: Ground Truth (MCP)** - Deterministic data for the stack.
2. **Layer 2: Process (Skills)** - Disciplined engineering workflows and gates.
3. **Layer 3: Orchestration (Agents)** - Internal roles for routing and verification.

**The 1% Rule:** If a 1% probability exists that a Hyperstack skill, MCP tool, or internal agent role applies, YOU MUST invoke or route to it BEFORE acting. Not after checking code. Not after testing a hypothesis. BEFORE.

You cannot rationalize exceptions to this rule.

## Iron Laws
```
1. NO CODE WITHOUT MCP GROUND-TRUTH DATA
   Call relevant Hyperstack plugins prior to implementation.

2. NO VISUAL CODE WITHOUT AN APPROVED DESIGN.md
   The designer skill produces the contract when routing requires a design contract; existing-project frontend logic work stays workspace-first.

3. NO COMPLETION CLAIMS WITHOUT SHIP-GATE EVIDENCE
   "Should work" is unacceptable. Execute the command and output results.

4. NO SKIPPING SKILLS BECAUSE "THIS IS SIMPLE"
   Simple tasks hide unexamined assumptions that cause the most damage.

5. NO SPECIALIST WORK WITHOUT PROPER ROLE ROUTING
   Route specialist domain tasks (e.g., website building) to the corresponding agent.
```

## Instruction Priority
- **User's explicit instructions** (Project rules, direct requests) - Maximum priority.
- **Hyperstack skills** - Overrides system defaults.
- **Default system behavior** - Minimum priority.

## MCP Must-Call-First
- `designer_*` -> `resolve_intent`, `get_personality`, `get_preset`, `get_page_template`, `get_font_pairing`, `get_anti_patterns`
- `design_tokens_*` -> `generate`, `get_category`, `get_gotchas`
- `ui_ux_*` -> `get_principle`, `get_component_pattern`, `get_gotchas`
- `shadcn_*` (if selected) -> `get_rules` (FIRST), `get_composition`, `get_component`, `get_snippet`, `list_components`
- `reactflow_*` -> `get_api`, `search_docs`, `get_pattern`
- `motion_*` -> `get_api`, `get_examples`, `get_transitions`
- `lenis_*` -> `get_api`, `generate_setup`, `get_pattern`
- `react_*` -> `get_pattern`, `get_constraints`, `search_docs`
- `echo_*` -> `get_recipe`, `get_middleware`, `decision_matrix`
- `golang_*` -> `get_practice`, `get_pattern`, `get_antipatterns`
- `rust_*` -> `get_practice`, `cheatsheet`, `search_docs`

## Workflow Skills
- Starting any new feature, component, or behaviour change: `blueprint`
- Any task touching existing project code: `blueprint` builds `workspace_inventory` first
- Task creates a new surface, changes visual semantics, or has no reliable existing pattern match: `designer` → produces conditional `design_contract` / DESIGN.md
- Have an approved design or plan to execute: `forge-plan` or `run-plan`
- Claiming anything is complete, fixed, or passing: `ship-gate` — evidence required
- Hit any bug, test failure, or unexpected behaviour: `debug-discipline` — root cause before any fix
- User says "autonomous", "just do it", "go ahead": `autonomous-mode`
- Plan has 2+ independent tasks: `subagent-ops` or `parallel-dispatch`
- Implementing any feature or bug fix (before code): `test-first`
- Reviewing completed implementation: `code-review`
- Security-sensitive API, auth, or infra code: `security-review`
- UI state machine, interaction audit: `behaviour-analysis`
- Selecting an abstraction or design pattern: `engineering-discipline`
- Writing or updating project documentation: `readme-writer`
- Starting implementation that needs workspace isolation: `worktree-isolation`

## Internal Agents
- Roles are internal and auto-called. Users do not invoke them directly.
- Internal roles are auto-called, not user-facing.
- hyper -> frontend-builder
- `hyper`: Classification, routing, gate enforcement, final verification, delivery
- `frontend-builder`: Frontend-facing design/implementation, CTA hierarchy, page structure, and existing-project frontend logic work

## Disallowed Transitions
- `user request -> frontend-builder`
- `frontend-builder -> ship`
- `frontend-builder -> deliver`

## High-Signal Red Flags
- "I know the React Flow API from memory." -> Memory drifts. v11 and v12 differ.
- "This is a simple animation." -> Animations require `prefers-reduced-motion`, easing, and GPU properties.
- "Go error handling is straightforward." -> Straightforward code hosts anti-patterns.
- "I'll check docs after writing." -> Shipping occurs before checking.
- "I know the OKLCH token pattern." -> OKLCH dictates specific alpha, chroma, and lightness rules.
- "This pattern is common; I'll adapt it." -> Adaptation obscures structural drift.

## Degraded Mode
- If MCP unavailable, tell the user explicitly: "MCP unavailable" and flag answers as uncertain.

## Announcement Rule
- Before invoking any Hyperstack skill, announce it with the exact format and purpose so the user can audit it.

## Final Check
- [ ] Did I evaluate Hyperstack skill applicability? (1% rule)
- [ ] Did I execute relevant MCP tools? (No memory rely)
- [ ] If visual, did I invoke `designer` BEFORE coding?
- [ ] If claiming completion, did I execute verification THIS message?
- [ ] Did I announce skill invocation with exact formatting?
