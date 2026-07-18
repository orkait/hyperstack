---
name: codemode
category: core
description: Deep context-loading protocol. Use when you must understand an unfamiliar codebase before answering, reviewing, or changing it - "codemode", "load the codebase", "map this repo", "understand before you touch". Maps structure, dependency graph, architecture, fragile components, behaviour, and high-impact improvements through 7 evidence-backed phases. Present the plan before loading anything.
---

# Codemode

A disciplined protocol for understanding a codebase before acting on it. When invoked, map the repo systematically - structure, dependencies, architecture, risk - and present each phase's findings before moving on. The output is a grounded mental model plus a prioritized improvement list, not a guess.

## The Iron Law

```
PRESENT THE PLAN BEFORE LOADING ANY FILES
RUN INLINE - NEVER DISPATCH PARALLEL SUBAGENTS
GREP FOR INVENTORY, READ FOR UNDERSTANDING - EXTRACTION NEVER REPLACES READING
NEVER RE-READ WHAT IS ALREADY IN CONTEXT - THE CONTEXT WINDOW IS THE CACHE
```

Announce the skill (`Using hyperstack:codemode - <purpose>`), then show the loading plan and the proposed scope. Do not read files or write code until the scope is confirmed. Scope decides what gets loaded; loading the wrong thing wastes the context budget.

## When to use

- Onboarding to an unfamiliar repo before a review, refactor, or feature.
- "Something is off here" and you need the whole picture, not a single file.
- Before any change whose blast radius you cannot yet estimate.

**Do NOT use** for: a one-fact lookup you can answer by reading one known file; a greenfield project with no existing code; pure web research (use a research skill instead).

## Position in the harness

Codemode is a connected node, not a standalone tool - it is the understanding phase the rest of Hyperstack depends on.

| Connection | Wiring |
|---|---|
| **Who invokes it** | entry to an unfamiliar/large repo; the deep form of the `hyper` and `website-builder` "inspect the workspace before routing/building" lifecycle step |
| **Phase 6 ->** | `hyperstack:behaviour-analysis` for UI state/interaction audits |
| **Phase 7 ->** | feeds `hyperstack:blueprint` (design gate) and `hyperstack:forge-plan` (implementation plan) |
| **Bug surfaced ->** | `hyperstack:debug-discipline` (root cause before fix) |
| **Grounding** | for any stack a plugin covers (React/Next, shadcn/Base UI, React Flow, Motion, Lenis, Echo, Go, Rust, Tailwind, tokens) ground Phases 4-7 with the matching `*_*` MCP tool - never memory |
| **Output** | obeys the shared Hyperstack doc/output discipline |

**Reverse boundary:** codemode never ships or claims completion. It produces understanding; `blueprint` / `forge-plan` / `ship-gate` own build-and-verify. If scope creeps into implementation, stop and hand back to the chain.

## Invocation

```
codemode (scope src/** and docs)
codemode (optimize for context)
codemode (<any scoping instruction>)
```

If no scope is given, propose one from the repo signals and confirm before Phase 1.

## Loading discipline (read before Phase 2)

Do NOT stuff the main context by reading every file. The main context is for the *synthesis*, not the raw dump. Four rules:

1. **Single inline agent - NEVER parallel subagents.** Run codemode entirely in the current context, yourself, sequentially. Do NOT dispatch `Explore` / `general-purpose` / any subagents, and do NOT fan out. Keep the main context lean the right way: read only the load-bearing files whole (entry points, core abstractions, anything fragile), and use programmatic extraction (`rg`/`fd`/git) for breadth - never by delegating to agents.
2. **Read for understanding, grep for inventory - never grep-shim a read.** Programmatic extraction answers inventory questions only: counts, import edges, version pins, call sites, naming sweeps. The moment the question is about meaning - what a file does, why it exists, how it behaves - READ the file. Grep fragments are not understanding; substituting greps for a needed read corrupts every later phase built on top of it. If a file matters enough to reason about, it matters enough to read.
3. **The context window is the cache - NEVER re-read what is loaded.** Once a file or slice is in context, it is authoritative for the rest of the session, through all phases and every follow-up after them. Answer from what is loaded. Re-read only what was never loaded, or what verifiably changed on disk (`git status` / `git diff` evidence) - never because re-reading feels safer. A re-read of unchanged, already-loaded content is pure context waste.
4. **Tier the context** (hot / warm / cold / never):
   - **Hot:** entry points, core modules, type definitions, config, the request itself.
   - **Warm:** the changed surface, recent verification results, targeted skill/MCP outputs.
   - **Cold:** deep reference docs, large examples, history - load a slice only when needed.
   - **Never by default:** whole reference forests, unrelated plugin docs, generated/build output, full large files when a targeted slice answers the question.

**Programmatic-first, bounded.** Prefer extracting facts with `rg`/`fd`/git over reading files when a query answers the question (tool inventory, import edges, version pins, call sites). One grep over the tree beats ten file reads. But this is a breadth tool with a hard boundary: it locates facts, it does not produce understanding. When the next statement you will make depends on how code behaves, read the file - a grep hit is evidence something exists, not evidence of what it does.

## The 7-Phase Pipeline

Each phase produces a short summary, presented before the next. Scale each to the repo - skip a phase explicitly (and say so) if it does not apply.

### Phase 1 - Structure Heuristic
Guess the full file/dir layout from cheap signals (`git ls-files`, `fd`, manifests, language histogram). Exclude build artifacts and caches (`node_modules/`, `dist/`, `.git/`, `__pycache__/`, `.next/`). Present an annotated tree: what exists, what is in scope, what is excluded and why.

### Phase 2 - File Loading
Load the in-scope logic per the loading discipline above (targeted whole-file reads + programmatic extraction, all inline - no subagents), prioritising entry points, core modules, config, and type definitions; deprioritising tests, fixtures, generated files. Read load-bearing files whole - do not grep-shim a file whose behaviour you will later assert. Present: what was loaded, what was skipped, and the approximate context cost. Stop loading well before the budget is exhausted - leave room to think.

### Phase 3 - Dependency Graph
Build who-imports-what / who-calls-what / who-owns-what. Present a compact UTF-8 graph or an adjacency table (padded, aligned). Name the coupling: which modules are leaf islands, which are hubs everything depends on.

### Phase 4 - Semantic Linking (architecture)
Map the high-level shape: layers, domains, data flow, key abstractions, the patterns in use (e.g. store -> hook -> component -> API). Present a short plain-language architecture summary - the mental model a new engineer would need.

### Phase 5 - Deep Linking (critical components)
Zoom into the load-bearing parts: shared utilities, widely-depended-on modules, anything complex, fragile, or side-effecting. Present a per-component table with role + risk. Flag the things that, if changed, ripple.

### Phase 6 - Behaviour Analysis
If UI is in scope, invoke `hyperstack:behaviour-analysis` (state + action inventory, interaction matrix, edge cases). Otherwise run a generic behaviour pass: inputs, states, transitions, failure modes. Present findings with severity (CRITICAL / HIGH / MEDIUM / LOW). Every proposed change carries a **Blast Radius** estimate (low / med / high impact on the rest of the graph).

### Phase 7 - Strategic Recommendations
Synthesise Phases 1-6 into high-impact improvements. Present a prioritized table on the Impact vs Effort matrix - what is worth doing, in what order, and why.

## MCP grounding

If the codebase uses a stack Hyperstack covers (React 19, Next, shadcn/Base UI, React Flow, Motion, Lenis, Echo, Go, Rust, Tailwind, design tokens), do NOT reason about those APIs from memory during Phases 4-7. Call the matching `*_*` MCP tool for ground truth before asserting how an API behaves or proposing a change against it. Memory drifts; the plugins are current.

## Post-Loading Discipline (Iron Rules)

Once loaded, every subsequent statement and change obeys these. Breaking one is breaking the spirit of the skill.

1. No comments unless required for correctness or non-obvious logic.
2. No hardcoded values - config/env driven.
3. No assumptions as truth - require evidence or a quick isolated test.
4. Treat every idea as probabilistic (~50/50), not a guaranteed outcome.
5. If a change is not clearly an improvement - stop, say so, propose alternatives.
6. Minimal language - clear, direct, no filler.
7. Output uses aligned, padded, UTF-8-safe tables.
8. No bluff - if something is unknown, say unknown.
9. Every verdict is evidence-backed (a file read, command output, or tool response).
10. No change that would break the build or cause cascading failure without alerting first.
11. Act like a staff engineer: reason, then doubt yourself, question your own conclusion, hold multiple solutions before picking one.
12. Never re-read a file that is already in context - the context window is the cache. Answer every phase and follow-up from what is loaded; re-read only on evidence the file changed on disk.

## Output style

Follow the same bar as any Hyperstack doc: lead with the finding, tables over prose, UTF-8 box-drawing for flows/graphs (padded so bars align), severity tables when issues are bundled, and a verification line for any claim that something works. No walls of text, no filler, no em dashes.
