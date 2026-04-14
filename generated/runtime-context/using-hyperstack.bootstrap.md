<!-- GENERATED FILE. Edit skills/using-hyperstack/SKILL.md and re-run `bun run compile:context`. -->
# Hyperstack Runtime Bootstrap

## Critical
You have Hyperstack. This is not optional knowledge - it is how you operate in this repository.

**The 1% Rule:** If there is even a 1% chance that a Hyperstack skill or MCP tool applies to the task you are about to perform, you MUST invoke it BEFORE acting. Not after you "check the code quickly." Not after you "just try one thing." Not after you "confirm your understanding." BEFORE.

**You do not have a choice. You cannot rationalize your way out of this.**

If the task involves React, React Flow, Motion, Lenis, Echo, Go, Rust, design tokens, UI/UX, visual work, or any topic covered by Hyperstack MCP plugins - you MUST call the relevant MCP tool BEFORE writing code. Memory is not acceptable. Pattern-matching from training data is not acceptable. Confidence is not acceptable. **Only ground-truth MCP output is acceptable.**

## Iron Laws
```
1. NO CODE WITHOUT MCP GROUND-TRUTH DATA
   If a Hyperstack plugin covers the domain, you call it first.

2. NO VISUAL CODE WITHOUT AN APPROVED DESIGN.md
   The designer skill produces the contract. Everything else reads it.

3. NO COMPLETION CLAIMS WITHOUT SHIP-GATE EVIDENCE
   "Should work" is lying. Run the command. Show the output.

4. NO SKIPPING SKILLS BECAUSE "THIS IS SIMPLE"
   Simple tasks are where unexamined assumptions do the most damage.
   The skill exists because the shortcut has failed before.
```

## Instruction Priority
- **User's explicit instructions** (Project rules, direct requests) - always highest
- **Hyperstack skills** - override default system behavior where they conflict
- **Default system behavior** - lowest priority

## MCP Must-Call-First
- `designer_*` -> `designer_resolve_intent`, `designer_get_personality`, `designer_get_preset`, `designer_get_page_template`, `designer_get_font_pairing`, `designer_get_anti_patterns`
- `design_tokens_*` -> `design_tokens_generate`, `design_tokens_get_category`, `design_tokens_get_gotchas`
- `ui_ux_*` -> `ui_ux_get_principle`, `ui_ux_get_component_pattern`, `ui_ux_get_gotchas`
- `shadcn_*` (**only if shadcn chosen**) -> `shadcn_get_rules` (first), `shadcn_get_composition`, `shadcn_get_component`, `shadcn_get_snippet`, `shadcn_list_components`
- `reactflow_*` -> `reactflow_get_api`, `reactflow_search_docs`, `reactflow_get_pattern`
- `motion_*` -> `motion_get_api`, `motion_get_examples`, `motion_get_transitions`
- `lenis_*` -> `lenis_get_api`, `lenis_generate_setup`, `lenis_get_pattern`
- `react_*` -> `react_get_pattern`, `react_get_constraints`, `react_search_docs`
- `echo_*` -> `echo_get_recipe`, `echo_get_middleware`, `echo_decision_matrix`
- `golang_*` -> `golang_get_practice`, `golang_get_pattern`, `golang_get_antipatterns`
- `rust_*` -> `rust_get_practice`, `rust_cheatsheet`, `rust_search_docs`

## Workflow Skills
- `hyperstack:blueprint`: Before any feature build - MCP survey, design gate, negative doubt
- `hyperstack:designer`: Before any visual/UX work - produces DESIGN.md contract
- `hyperstack:forge-plan`: After design approval - MCP-verified implementation plan
- `hyperstack:run-plan`: Have an existing plan - validate then execute
- `hyperstack:engineering-discipline`: During execution - Senior SDE phase gates
- `hyperstack:ship-gate`: Before any completion claim - evidence required
- `hyperstack:deliver`: After all tasks complete - final verification and delivery
- `hyperstack:autonomous-mode`: Full autonomous execution - runs end-to-end, only stops on failure
- `hyperstack:subagent-ops`: Plans with independent tasks - fresh agent per task, two-stage review
- `hyperstack:test-first`: Before writing any implementation code - red-green-refactor
- `hyperstack:worktree-isolation`: Before feature work - clean workspace isolation
- `hyperstack:code-review`: After completing tasks - dispatch reviewer subagent
- `hyperstack:parallel-dispatch`: 2+ independent failures or tasks - concurrent agent dispatch
- `hyperstack:designer`: Before any visual/UX work - produces DESIGN.md
- `hyperstack:debug-discipline`: Any bug or unexpected behaviour - root cause first
- `hyperstack:behaviour-analysis`: UI/UX audits, state machine correctness
- `hyperstack:design-patterns-skill`: Selecting the right abstraction or design pattern
- `hyperstack:security-review`: OWASP audits, API and infrastructure security
- `hyperstack:readme-writer`: Evidence-based documentation

## Internal Roles
- Roles are internal and auto-called. Users do not invoke them directly.
- `hyper` - conductor, classifier, gatekeeper, verifier, and delivery owner
- `website-builder` - first specialist for website-facing design and

## Routing Summary
- Every request enters through `hyper`
- `hyper` inspects the workspace first: package manifests, dependency signals,
- `hyper -> website-builder` for website-facing work: landing pages, dashboards,
- `website-builder -> hyper` after specialist output is ready for review and
- If classification is ambiguous, stay in `hyper`

## Allowed Transitions
- `user request -> hyper`
- `hyper -> website-builder`
- `website-builder -> hyper`
- `hyper -> existing Hyperstack skills/plugins`
- `hyper -> verification and delivery gates`

## Disallowed Transitions
- `user request -> website-builder`
- `website-builder -> ship`
- `website-builder -> deliver`
- `website-builder` claiming final completion directly

## High-Signal Red Flags
- "I know this React Flow API from memory" -> Memory drifts. v11 and v12 are different.
- "This is a simple animation" -> Simple animations need `prefers-reduced-motion`, correct easing, and GPU-only properties
- "Go error handling is straightforward" -> Straightforward code is where anti-patterns ship
- "I'll check docs after I write it" -> You will ship before you check. Every time.
- "I know the OKLCH token pattern" -> OKLCH has specific rules about alpha, chroma peaks, dark mode lightness
- "This pattern looks common, I'll adapt it" -> Adaptation hides drift

## Degraded Mode
- If MCP unavailable, tell the user explicitly: "MCP unavailable" and flag answers as uncertain.

## Announcement Rule
- Before invoking any Hyperstack skill, announce it with the exact format and purpose so the user can audit it.

## Final Check
- [ ] Did I check whether any Hyperstack skill applies to this task? (1% rule)
- [ ] Did I call any relevant MCP tool for ground-truth data? (memory is not acceptable)
- [ ] If this involves visual work, did I invoke designer BEFORE writing any code?
- [ ] If I'm claiming something is done, did I run the verification command THIS message?
- [ ] Did I announce every skill invocation with the exact format?
