<div align="center">

# hyperstack

**A disciplined MCP server and AI skill system that forces your agent to use real docs, real designs, and real verification before shipping.**

<p>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MCP-compatible-6366f1?style=flat-square" alt="MCP" />
  <img src="https://img.shields.io/badge/Node-%E2%89%A518-43853d?style=flat-square&logo=node.js&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
</p>

<p>
  <img src="https://img.shields.io/badge/11_plugins-79_tools-6366f1?style=flat-square" alt="Plugins" />
  <img src="https://img.shields.io/badge/21_skills-adversarial_gates-a855f7?style=flat-square" alt="Skills" />
  <img src="https://img.shields.io/badge/SessionStart-hook_injected-f59e0b?style=flat-square" alt="Hook" />
</p>

<p>
  <img src="https://img.shields.io/badge/React_Flow-v12-22c55e?style=flat-square&logo=react&logoColor=white" alt="React Flow" />
  <img src="https://img.shields.io/badge/Motion-v12-f59e0b?style=flat-square&logo=framer&logoColor=white" alt="Motion" />
  <img src="https://img.shields.io/badge/Lenis-smooth_scroll-0ea5e9?style=flat-square" alt="Lenis" />
  <img src="https://img.shields.io/badge/Tailwind-v4_OKLCH-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-Base_UI-000000?style=flat-square" alt="shadcn" />
  <img src="https://img.shields.io/badge/Echo-Go-00ADD8?style=flat-square" alt="Echo" />
  <img src="https://img.shields.io/badge/Rust-practices-ce422b?style=flat-square&logo=rust&logoColor=white" alt="Rust" />
</p>

</div>

---

## ⚡ What is this?

Hyperstack is two things bolted together:

1. **A TypeScript MCP server** with 11 plugins and 79 tools. Your AI calls these for ground-truth API signatures, component specs, design decisions, and architectural patterns. No hallucinated imports.

2. **A skill system with enforcement teeth.** 21 skills with Iron Laws, rationalization tables, and a SessionStart hook that force-injects discipline on every session. Your AI cannot "just try one thing" without the gate firing.

The combination turns a generic coding assistant into a Senior Staff Engineer who checks docs before writing code, writes a DESIGN.md before any visual work, and refuses to claim completion without verification evidence.

**You should use this if** you are tired of AI agents inventing API shapes, shipping AI-slop UIs, or claiming "tests pass" without running them.

**Skip this if** you want a frictionless autocomplete. Hyperstack is the opposite of frictionless - it is intentional friction that catches bugs before they ship.

---

## 🚀 Quickstart

### 🤖 Agent-first install

If you are using Claude Code, Cursor, Gemini CLI, Copilot CLI, OpenCode, or Codex, paste this at your agent:

> Fetch and follow the instructions at https://raw.githubusercontent.com/orkait/hyperstack/main/install.md

The agent will pull the Docker image and configure your MCP client.

### 🐳 Docker (manual)

Add this to `~/.claude.json`, Cursor config, or equivalent:

```json
{
  "mcpServers": {
    "hyperstack": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "--memory=256m", "--cpus=0.5",
        "ghcr.io/orkait/hyperstack:main"
      ]
    }
  }
}
```

The `--memory=256m` and `--cpus=0.5` flags enforce resource limits. Keep them.

### 🔧 Install the skills

The MCP server gives you tools. The skills give you discipline. Install both:

```bash
git clone https://github.com/orkait/hyperstack.git ~/.claude/skills/hyperstack
```

After installing, the SessionStart hook (at `hooks/session-start.mjs`) will auto-inject the `using-hyperstack` skill into every session. No manual activation needed.

### 💻 From source

```bash
git clone https://github.com/orkait/hyperstack.git
cd hyperstack
bun install
bun bin/hyperstack.mjs   # same entrypoint the published bin uses
bun start                # no build step
bun dev                  # watch mode
bun run build            # tsc --noEmit (type-check only, no dist output)
```

Node 18+ required.

---

## 🧠 The two-layer system

### Layer 1: MCP Plugins (deterministic knowledge)

Your AI calls these for exact API data. Memory is not acceptable. Every plugin serves typed TypeScript data + `.txt` snippets bundled with the plugin.

| Plugin | Tools | Domain |
|---|:---:|---|
| 🎨 **designer** | 19 | Design decision engine - 6 personality clusters, 15 industry rules, 11 cognitive laws, 13 page templates, 9 presets (Linear, Stripe, Vercel, Apple, Carbon, shadcn, Notion, Supabase, Figma), 21 font pairings, DESIGN.md pipeline |
| ✨ **design-tokens** | 7 | Tailwind v4 + OKLCH token systems, 10 categories, 8 build procedures |
| 💅 **ui-ux** | 6 | Typography scales, spacing grids, accessibility checklists, component patterns |
| 🧩 **shadcn** | 5 | shadcn/ui Base UI edition - rules, components, compositions, snippets |
| ⚛️ **reactflow** | 9 | @xyflow/react v12 - 56 APIs, 17 patterns, templates, migration guides |
| 🎬 **motion** | 7 | Motion for React v12 - 33 APIs, transition reference, animation generators |
| 🌊 **lenis** | 6 | Smooth scroll - 7 recipes, GSAP integration, React hooks |
| ⚛️ **react** | 4 | React 19 + Next.js - RSC patterns, Zustand hierarchy, data fetching rules |
| 🐹 **echo** | 6 | Echo Go framework - 19 recipes, 13 middleware, decision matrices |
| 🐹 **golang** | 6 | Go - 18 practices, 10 design patterns, anti-patterns |
| 🦀 **rust** | 4 | Rust - 18 practices, ownership guide, performance tips |

**79 tools total.**

### Layer 2: Skills (process enforcement)

Markdown with adversarial enforcement. Each gate skill has an Iron Law, a 1% Rule, and a rationalization table that names the exact excuses your AI will use to skip the gate and counters each one.

The `using-hyperstack` skill is injected into every session by `hooks/session-start.mjs`. You do not have to invoke it manually.

<details>
<summary><strong>🧱 Core (13)</strong> - workflow, discipline, gates used on every task</summary>

| Skill | Role |
|---|---|
| `blueprint` | Hard gate: no code without an approved design |
| `forge-plan` | MCP-verified task-by-task implementation plan |
| `run-plan` | Execute an existing plan |
| `engineering-discipline` | 8-step Senior SDE framework with 5 Iron Laws |
| `ship-gate` | No completion claims without fresh verification evidence |
| `deliver` | Final verification and delivery |
| `test-first` | No production code without a failing test first |
| `debug-discipline` | Root cause first, 3-strike escalation |
| `code-review` | Dispatch reviewer subagent, handle feedback technically |
| `autonomous-mode` | Full end-to-end execution, only stops on failure |
| `subagent-ops` | Fresh agent per task, two-stage review |
| `parallel-dispatch` | Concurrent agent dispatch for independent tasks |
| `worktree-isolation` | Clean workspace isolation before feature work |

</details>

<details>
<summary><strong>🎯 Domain (6)</strong> - specialized skills for specific contexts</summary>

| Skill | Role |
|---|---|
| `designer` | Intention gate - produces DESIGN.md contract before any visual code |
| `shadcn-expert` | shadcn/ui Base UI architect - ONLY when user picks shadcn in designer Q11b |
| `behaviour-analysis` | UI/UX state audits, Nielsen heuristics, interaction matrices |
| `security-review` | OWASP audits, vulnerability checklists |
| `design-patterns-skill` | Clean Code + Pragmatic Programmer patterns |
| `readme-writer` | Evidence-based README generation (this skill) |

</details>

<details>
<summary><strong>🔭 Meta (2)</strong> - skills about skills</summary>

| Skill | Role |
|---|---|
| `using-hyperstack` | Force-injected at session start via hook - the enforcement payload |
| `testing-skills` | RED-GREEN-REFACTOR pressure testing for skills using subagents |

</details>

Full index at `skills/INDEX.md`. Regenerate with `bash scripts/generate-skills-index.sh` after adding or editing any skill.

---

## 🔒 Why adversarial enforcement?

Ordinary skill markdown is polite suggestion. Polite suggestion fails when the model is under pressure to "be helpful fast." Hyperstack gate skills are written adversarially, inspired by [obra/superpowers](https://github.com/obra/superpowers):

- **Iron Laws** in all-caps that spell out the non-negotiable rule
- **1% Rule** - if there is even a 1% chance a skill applies, invoke it
- **Rationalization tables** listing the exact excuses your AI will use to skip the gate, with counters
- **"Spirit of the rule is the letter of the rule"** clause to close loophole-hunting
- **SessionStart hook** that injects `using-hyperstack` into every new session so the AI cannot forget the system exists

Examples of Iron Laws enforced today:

```
NO CODE WITHOUT MCP GROUND-TRUTH DATA
NO VISUAL CODE WITHOUT AN APPROVED DESIGN.md
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
NO REFACTOR WITHOUT A FAILING TEST FIRST
NO PATTERN WITHOUT A NAMED FORCE
```

---

## 🎨 The designer workflow (flagship example)

The designer plugin + skill is the clearest illustration of how hyperstack composes all three layers.

When you say *"build me a SaaS dashboard"*:

1. **SessionStart hook** has already injected `using-hyperstack` - the AI knows the system exists
2. **Blueprint skill** detects visual work and routes to `hyperstack:designer`
3. **Designer skill** calls `designer_resolve_intent(product)` to auto-detect industry, personality, style, density, mode
4. **Designer asks 3 questions** (base mode) or 12 questions (advanced mode)
5. **Q11b** asks which component library - shadcn, raw Tailwind, MUI, Mantine, Chakra, Ant Design, or custom
6. **Designer produces a DESIGN.md contract** with 10 sections (theme, colors, typography, spacing, components, motion, elevation, do/don'ts, responsive, anti-patterns)
7. **User approves** the DESIGN.md
8. **Forge-plan skill** reads the DESIGN.md and generates one task per section. For Section 5 (components), it calls `shadcn_get_component` for each component (only if Q11b chose shadcn - otherwise hand-builds from DESIGN.md spec)
9. **Implementation tasks** execute with the ground truth from MCP tools
10. **designer_verify_implementation** runs a programmatic compliance check against DESIGN.md before ship-gate
11. **Ship-gate** enforces the DESIGN.md compliance table (10 sections x specific rules) before allowing any completion claim

At every step, the AI cannot skip ahead. The hard gates are enforced by rationalization tables that have already written down every excuse your AI will try.

---

## 🛠️ Available Tools

<details>
<summary><strong>🎨 Designer</strong> - <code>designer_*</code> (19 tools)</summary>

- `designer_resolve_intent` - Auto-detect industry, personality, style from product description
- `designer_list_personalities` + `designer_get_personality` - 6 personality clusters from 58 real company design systems
- `designer_list_presets` + `designer_get_preset` - 9 code-ready token presets (Linear, Stripe, Vercel, Apple, Carbon, shadcn, Notion, Supabase, Figma)
- `designer_get_industry_rules` - 15 industry profiles with must-have/never-use constraints
- `designer_get_cognitive_law` - 11 laws (Fitts, Hick, Miller, Gestalt, Von Restorff, Serial Position, F-Pattern, Z-Pattern, Jakob, Doherty, Peak-End)
- `designer_get_page_template` - 13 page types with section anatomy
- `designer_get_composition_rules` - Visual hierarchy, CRAP, whitespace, fold, reading patterns
- `designer_get_interaction_pattern` - Form design, navigation, empty states, micro-interactions
- `designer_get_ux_writing` - Button labels, error messages, confirmation dialogs
- `designer_get_landing_pattern` - Hero, social proof, pricing, CTA optimization
- `designer_get_design_system` - Specific values from 7 premium systems
- `designer_get_font_pairing` - 21 curated pairings with Google Fonts imports
- `designer_get_anti_patterns` - 50+ anti-patterns (the AI slop fingerprint) filterable by category/industry
- `designer_search` - Cross-domain search
- `designer_generate_design_brief` - Assemble structured brief
- `designer_generate_implementation_plan` - Parse DESIGN.md into executable task list with MCP calls per section
- `designer_verify_implementation` - Programmatic compliance check against DESIGN.md
</details>

<details>
<summary><strong>🧩 shadcn/ui</strong> - <code>shadcn_*</code> (5 tools, optional)</summary>

Only invoked when the user explicitly chose shadcn in designer Q11b.

- `shadcn_get_rules` - Architectural rules and mandatory checklist (call first)
- `shadcn_list_components` - Curated component catalog
- `shadcn_get_component` - Full spec: primitive, data-slots, variants, sizes
- `shadcn_get_snippet` - Canonical usage example
- `shadcn_get_composition` - Which components compose for a page type (bridge from designer page templates)
</details>

<details>
<summary><strong>✨ Design Tokens</strong> - <code>design_tokens_*</code> (7 tools)</summary>

- `design_tokens_list_categories` - 10 token categories (colors, spacing, grid, radius, shadows, motion, z-index, opacity, component sizing, typography)
- `design_tokens_get_category` - CSS, rules, gotchas per category
- `design_tokens_get_color_ramp` - OKLCH values + semantic roles
- `design_tokens_get_procedure` - 8 step-by-step build procedures
- `design_tokens_get_gotchas` - Aggregate implementation mistakes
- `design_tokens_generate` - Complete Tailwind v4 token file from a palette
- `design_tokens_search` - Cross-category search
</details>

<details>
<summary><strong>💅 UI/UX Principles</strong> - <code>ui_ux_*</code> (6 tools)</summary>

- `ui_ux_list_principles` - Browse by domain (typography, color, accessibility, responsive, motion)
- `ui_ux_get_principle` - Rule, detail, CSS examples, anti-patterns
- `ui_ux_get_component_pattern` - Button, card, badge, form specs
- `ui_ux_get_checklist` - Pre-ship checklist per domain
- `ui_ux_get_gotchas` - Common UI mistakes and fixes
- `ui_ux_search` - Cross-domain search
</details>

<details>
<summary><strong>⚛️ React Flow</strong> - <code>reactflow_*</code> (9 tools)</summary>

- `reactflow_list_apis` - Browse 56 APIs by kind
- `reactflow_get_api` - Full reference: props, usage, tips
- `reactflow_search_docs` - Full-text search
- `reactflow_get_examples` - Curated code examples by category
- `reactflow_get_pattern` - Enterprise patterns (zustand-store, drag-and-drop, SSR)
- `reactflow_get_template` - Production-ready starters
- `reactflow_get_migration_guide` - v11 to v12 breaking changes
- `reactflow_generate_flow` - Generate a flow from prose
</details>

<details>
<summary><strong>🎬 Motion for React</strong> - <code>motion_*</code> (7 tools)</summary>

- `motion_list_apis` - Browse 33 APIs
- `motion_get_api` - Full reference with props and usage
- `motion_search_docs` - Full-text search
- `motion_get_examples` - Animation examples by category (gestures, scroll, layout)
- `motion_get_transitions` - Transition reference for tween, spring, inertia
- `motion_generate_animation` - Generate animation snippet from description
- `motion_cheatsheet` - Quick reference
</details>

<details>
<summary><strong>🌊 Lenis</strong> - <code>lenis_*</code> (6 tools)</summary>

- `lenis_list_apis` - Options, methods, events
- `lenis_get_api` - Full reference with snippets
- `lenis_get_pattern` - Next.js, GSAP, Framer Motion integrations
- `lenis_generate_setup` - Complete Lenis setup
- `lenis_cheatsheet` - Required CSS and pitfalls
- `lenis_search_docs` - Full-text search
</details>

<details>
<summary><strong>⚛️ React + Next.js</strong> - <code>react_*</code> (4 tools)</summary>

- `react_list_patterns` - All React/Next.js patterns
- `react_get_pattern` - Full implementation with anti-patterns
- `react_get_constraints` - Hard rules (e.g., no `useEffect` for fetching)
- `react_search_docs` - Search patterns and rules
</details>

<details>
<summary><strong>🐹 Echo (Go)</strong> - <code>echo_*</code> (6 tools)</summary>

- `echo_list_recipes` - Browse 19 recipes
- `echo_get_recipe` - Full recipe (jwt-auth, websocket, sse)
- `echo_list_middleware` + `echo_get_middleware` - 13 middleware components
- `echo_decision_matrix` - Echo vs standard library
- `echo_search_docs` - Full-text search
</details>

<details>
<summary><strong>🐹 Golang</strong> - <code>golang_*</code> (6 tools)</summary>

- `golang_list_practices` - Browse 18 best practices
- `golang_get_practice` - Rule, reasoning, good/bad examples
- `golang_list_patterns` + `golang_get_pattern` - 10 Go-idiomatic design patterns
- `golang_get_antipatterns` - Common mistakes and fixes
- `golang_search_docs` - Search practices and patterns
</details>

<details>
<summary><strong>🦀 Rust</strong> - <code>rust_*</code> (4 tools)</summary>

- `rust_list_practices` + `rust_get_practice` - 18 best practices
- `rust_cheatsheet` - Ownership rules, pointer types, performance
- `rust_search_docs` - Search all practices
</details>

---

## 🏗️ Architecture

Everything runs from source. The published `hyperstack` bin is a small Node wrapper that boots `src/index.ts` through `tsx`, and Docker uses the same source-first runtime. No `dist/` output, no build step for deployment - just type checking.

```text
bin/
└── hyperstack.mjs           # Published CLI wrapper - boots src/index.ts via tsx

src/
├── index.ts                  # Entry - creates McpServer, loads all 11 plugins
├── registry.ts               # Plugin interface + loadPlugins()
├── shared/
│   └── loader-factory.ts     # createSnippetLoader() reads .txt at module init
└── plugins/
    ├── designer/             # 19 tools, data.ts with distilled research
    ├── shadcn/               # 5 tools, bundled component catalog
    ├── design-tokens/        # 7 tools
    ├── ui-ux/                # 6 tools
    ├── reactflow/            # 9 tools
    ├── motion/               # 7 tools
    ├── lenis/                # 6 tools
    ├── react/                # 4 tools
    ├── echo/                 # 6 tools
    ├── golang/               # 6 tools
    └── rust/                 # 4 tools

skills/
├── INDEX.md                  # Auto-generated from frontmatter category field
├── using-hyperstack/         # Force-injected by SessionStart hook
├── (20 other skills)/

hooks/
├── hooks.json                # Registers the SessionStart hook
├── session-start.mjs         # Cross-platform hook entrypoint for auto-injecting using-hyperstack
├── session-start             # Legacy shell helper
└── run-hook.cmd              # Windows dispatcher

scripts/
└── generate-skills-index.sh  # Regenerates skills/INDEX.md from frontmatter
```

Each plugin follows the same structure: `index.ts` registers tools from `tools/`, data lives in `data.ts`, code snippets live in `snippets/*.txt` and are loaded at module init time via `loader.ts`.

---

## 🚧 Boundaries and current status

- **Platform:** Claude Code, Cursor, Gemini CLI, Copilot CLI, OpenCode, Codex, and any MCP-compatible client. Tested primarily on Claude Code.
- **Node:** 18 or newer.
- **No build step:** runs via `tsx`. Do not add a `dist/` folder.
- **Knowledgebase:** The original 25 research files that seeded the designer plugin are NOT in this repo anymore. They live at `../knowledgebase/` outside the repo, gitignored for safety. All actionable content is distilled into `src/plugins/designer/data.ts`.
- **shadcn plugin:** Ships with 4 curated components (Button, Dialog, Field, Select) as reference. For a full catalog, you still need your project's own shadcn files.
- **Enforcement vs suggestion:** Hyperstack skills are markdown-based prose gates. They depend on the AI reading them. The SessionStart hook makes this harder to skip, but it is not a hard runtime block. True enforcement would require tool-level hooks.
- **Testing skills:** `testing-skills` defines a RED-GREEN-REFACTOR methodology for pressure-testing skills with subagents. Scenario files exist for 3 skills (ship-gate, designer, blueprint). Other gate skills need their own scenarios.

---

## 🤝 Contributing

Fork, branch, open a PR. All new plugins must follow the existing file structure (`index.ts` + `data.ts` + `tools/` + `snippets/`). All new skills must include a `category:` frontmatter field (core, domain, or meta) so they appear in `skills/INDEX.md`.

After adding or editing any skill:

```bash
bash scripts/generate-skills-index.sh
```

Run type checking before opening a PR:

```bash
npm run build   # tsc --noEmit
```

---

## 📄 License

MIT © [Orkait](https://github.com/orkait)

---

## 🙏 Acknowledgements

The enforcement philosophy behind Hyperstack's gate skills - Iron Laws, 1% Rule, rationalization tables - was adopted from [obra/superpowers](https://github.com/obra/superpowers) (MIT © Jesse Vincent). We agreed with how it frames AI compliance: adversarially, not politely. See [CREDITS.md](./CREDITS.md).
