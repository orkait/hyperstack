<div align="center">

# hyperstack

**One MCP server + AI Skill. Every library your AI needs. Zero conflicts.**

<p>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MCP-compatible-6366f1?style=flat-square" alt="MCP" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
</p>

<p>
  <img src="https://img.shields.io/badge/React_Flow-v12-22c55e?style=flat-square&logo=react&logoColor=white" alt="React Flow" />
  <img src="https://img.shields.io/badge/Motion-v12-f59e0b?style=flat-square&logo=framer&logoColor=white" alt="Motion" />
  <img src="https://img.shields.io/badge/Lenis-smooth_scroll-0ea5e9?style=flat-square" alt="Lenis" />
  <img src="https://img.shields.io/badge/React_19-Next.js-61dafb?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind-v4_tokens-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Echo-Go-00ADD8?style=flat-square" alt="Echo" />
  <img src="https://img.shields.io/badge/Golang-practices-00ADD8?style=flat-square&logo=go&logoColor=white" alt="Go" />
  <img src="https://img.shields.io/badge/Rust-practices-ce422b?style=flat-square&logo=rust&logoColor=white" alt="Rust" />
</p>

<br/>

> Hyperstack is a plugin-based MCP server paired with a master AI Skill. It gives your AI assistant deep, deterministic knowledge of frontend and backend libraries through exact API references, architectural patterns, and production-ready code generation.

</div>

---

## ⚡ What is Hyperstack?

LLMs hallucinate API signatures and struggle with complex library patterns (like React Flow or framer-motion). Hyperstack solves this by providing your AI with exact, ground-truth documentation and code snippets loaded directly into its context window at runtime. 

It is designed as an **Agent-First** tool: your AI decides when it needs information, queries the specific Hyperstack tool, and receives precise, up-to-date implementation guidelines.

---

## 🚀 Quickstart

### 🤖 Agent-First Install (Easiest)
If you are using an AI agent (like Claude Code, Cursor, or Gemini CLI), simply prompt it:
> "Fetch and follow instructions from https://raw.githubusercontent.com/orkait/hyperstack/main/install.md"

The agent will read the installation file, pull the pre-built Docker image, and configure your system automatically.

### 🐳 Docker (Manual Configuration)
If you prefer to configure it yourself, add the following to your MCP config file (e.g., `~/.claude.json` or Cursor config):

```json
{
  "mcpServers": {
    "hyperstack": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--memory=256m",
        "--cpus=0.5",
        "ghcr.io/orkait/hyperstack:main"
      ]
    }
  }
}
```

*Note: The `--memory=256m` and `--cpus=0.5` flags are highly recommended. They ensure the server runs with strict resource limits, preventing it from consuming excess host RAM or compute.*

---

## 🧠 The Hyperstack Engine (AI Skill)

Hyperstack includes a master `SKILL.md` file that acts as a **cognitive bootloader** for your AI. It transforms the assistant from a generic autocomplete engine into a disciplined Senior Staff Engineer.

The skill enforces a strict 4-phase operational lifecycle:
1.  **Discovery:** Inventorying state and querying MCP ground-truth data.
2.  **Reasoning:** Architectural gating via the `engineering-discipline` skill.
3.  **Execution:** Surgical implementation using verified MCP patterns.
4.  **Verification:** Automated audits and evidence-based reporting.

To fully enable the engine, clone this repository into your AI's skills directory:

```bash
git clone https://github.com/orkait/hyperstack.git ~/.claude/skills/hyperstack
```

---

## 🧩 MCP Plugins

The server is built around independent plugins, each offering targeted tools for specific domains.

| Plugin | Domain | Tools | Capabilities |
|--------|--------|:-----:|--------------|
| **reactflow** | @xyflow/react v12 | 8 | 56 APIs, 17 patterns, 3 templates, migration guides |
| **motion** | Motion for React v12 | 6 | 33 APIs, 14 categories, full transition reference |
| **lenis** | Smooth scrolling | 6 | 7 recipes, GSAP integration, CSS rules, React hooks |
| **react** | React 19 + Next.js | 4 | RSC patterns, Zustand hierarchy, data fetching |
| **echo** | Echo Go Framework | 6 | 19 recipes, 13 middleware setups, decision matrices |
| **golang** | Go Architecture | 6 | 18 best practices, 10 design patterns, anti-patterns |
| **rust** | Rust Idioms | 4 | 18 practices, ownership guide, performance tips |
| **design-tokens** | Tailwind v4 + OKLCH | 7 | 10 token categories, 8 build procedures |
| **ui-ux** | UI/UX Principles | 6 | Typography scales, spacing grids, accessibility |

---

## 🛠️ Available Tools

<details>
<summary><strong>⚛️ React Flow</strong> - <code>reactflow_*</code></summary>

- `reactflow_list_apis`: Browse all 56 APIs grouped by kind.
- `reactflow_get_api`: Full reference for any API including props, usage, and tips.
- `reactflow_search_docs`: Full-text search across all docs and examples.
- `reactflow_get_examples`: Curated code examples by category.
- `reactflow_get_pattern`: Enterprise patterns (e.g., `zustand-store`, `drag-and-drop`, `ssr`).
- `reactflow_get_template`: Production-ready starters.
- `reactflow_get_migration_guide`: v11 to v12 breaking changes.
- `reactflow_generate_flow`: Generate a complete flow from a prose description.
</details>

<details>
<summary><strong>🎬 Motion for React</strong> - <code>motion_*</code></summary>

- `motion_list_apis`: Browse all 33 APIs.
- `motion_get_api`: Full reference including props and usage.
- `motion_search_docs`: Full-text search across examples.
- `motion_get_examples`: Animation examples by category (e.g., `gestures`, `scroll`, `layout`).
- `motion_get_transitions`: Complete transition reference for tween, spring, and inertia.
- `motion_generate_animation`: Generate an animation snippet from a description.
</details>

<details>
<summary><strong>🌊 Lenis</strong> - <code>lenis_*</code></summary>

- `lenis_list_apis`: Browse options, methods, and events.
- `lenis_get_api`: Full reference with usage snippets.
- `lenis_get_pattern`: Integration patterns for Next.js, GSAP, and Framer Motion.
- `lenis_generate_setup`: Generate a complete Lenis setup.
- `lenis_cheatsheet`: Required CSS and pitfalls.
- `lenis_search_docs`: Full-text search.
</details>

<details>
<summary><strong>⚛️ React + Next.js</strong> - <code>react_*</code></summary>

- `react_list_patterns`: List all React/Next.js patterns.
- `react_get_pattern`: Full pattern implementation with anti-patterns.
- `react_get_constraints`: Hard rules (e.g., no `useEffect` for fetching).
- `react_search_docs`: Search across patterns and rules.
</details>

<details>
<summary><strong>🐹 Echo (Go)</strong> - <code>echo_*</code></summary>

- `echo_list_recipes`: Browse all 19 recipes.
- `echo_get_recipe`: Full recipe with runnable code (e.g., `jwt-auth`, `websocket`, `sse`).
- `echo_list_middleware`: Browse all 13 middleware components.
- `echo_get_middleware`: Usage and gotchas for specific middleware.
- `echo_decision_matrix`: When to use Echo vs standard library.
- `echo_search_docs`: Full-text search.
</details>

<details>
<summary><strong>🐹 Golang</strong> - <code>golang_*</code></summary>

- `golang_list_practices`: Browse 18 best practices by topic.
- `golang_get_practice`: Rule, reasoning, and good/bad code examples.
- `golang_list_patterns`: Browse 10 Go-idiomatic design patterns.
- `golang_get_pattern`: Full implementation details.
- `golang_get_antipatterns`: Common mistakes and fixes.
- `golang_search_docs`: Search practices and patterns.
</details>

<details>
<summary><strong>🦀 Rust</strong> - <code>rust_*</code></summary>

- `rust_list_practices`: Browse 18 best practices.
- `rust_get_practice`: Rule, reasoning, and good/bad code examples.
- `rust_search_docs`: Search all practices.
- `rust_cheatsheet`: Ownership rules, pointer type table, and performance tips.
</details>

<details>
<summary><strong>🎨 Design Tokens</strong> - <code>design_tokens_*</code></summary>

- `design_tokens_list_categories`: Browse 10 token categories (e.g., colors, spacing, grid).
- `design_tokens_get_category`: CSS, rules, and gotchas.
- `design_tokens_get_color_ramp`: OKLCH values and semantic roles.
- `design_tokens_get_procedure`: Step-by-step token build procedures.
- `design_tokens_get_gotchas`: Common implementation mistakes.
- `design_tokens_generate`: Generate a complete Tailwind v4 token file from a palette.
- `design_tokens_search`: Search across categories and procedures.
</details>

<details>
<summary><strong>💅 UI/UX Principles</strong> - <code>ui_ux_*</code></summary>

- `ui_ux_list_principles`: Browse principles by domain (typography, color, a11y, etc.).
- `ui_ux_get_principle`: Rule, detail, CSS examples, and anti-patterns.
- `ui_ux_get_component_pattern`: Specifications for buttons, cards, badges, etc.
- `ui_ux_get_checklist`: Pre-ship checklist per domain.
- `ui_ux_get_gotchas`: Common UI mistakes and fixes.
- `ui_ux_search`: Search principles and patterns.
</details>

---

## 🧠 Additional Engineering Skills

Hyperstack also bundles 5 specialized engineering skills that provide comprehensive guidelines, checklists, and principles. 

Unlike the plugins above, these are **NOT** MCP tools. They are static Markdown files located in the `skills/` directory. AI agents can read these documents using standard file reading tools when needed.

| Skill | Focus Area |
|-------|------------|
| `behaviour-analysis` | UI/UX state audits, Nielsen heuristics |
| `design-patterns-skill` | Clean Code, Pragmatic Programmer concepts |
| `engineering-discipline`| Architecture reasoning, verification gates |
| `readme-writer` | Evidence-based README generation |
| `security-review` | OWASP audits, vulnerability checklists |

---

## 🏗️ Architecture

The repository is built for high cohesion and instant execution. The `dist/` compilation step was entirely removed in favor of `tsx` runtime execution. 

```text
src/
├── index.ts                  # Entry - creates McpServer, loads all plugins
├── registry.ts               # Plugin interface + loadPlugins()
├── shared/
│   └── loader-factory.ts     # createSnippetLoader() - reads .txt files at runtime
└── plugins/
    ├── reactflow/             # @xyflow/react v12
    │   └── snippets/          # 94 .txt files
    ├── motion/                # motion/react v12
    │   └── snippets/          # 79 .txt files
    ├── echo/                  # Echo Go framework
    │   └── snippets/          # 33 .txt files
    └── ... (other plugins follow the exact same structure)
```

Each plugin encapsulates its own logic, tools, and raw data (`.txt` snippets). The tools dynamically read the text files at runtime via the `loader-factory.ts`.

---

## 💻 Local Development

To contribute or run the server locally from source without Docker:

```bash
git clone https://github.com/orkait/hyperstack.git
cd hyperstack
npm install
npm start         # runs the server via tsx
npm run dev       # watch mode for local development
```

---

## 📄 License

MIT © [Orkait](https://github.com/orkait)