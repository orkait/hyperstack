<div align="center">

# hyperstack

**One MCP server. Every library your AI needs. Zero conflicts.**

<p>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT" />
  <a href="https://github.com/orkait/hyperstack/stargazers"><img src="https://img.shields.io/github/stars/orkait/hyperstack?style=flat-square&color=f0c040" alt="Stars" /></a>
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MCP-compatible-6366f1?style=flat-square" alt="MCP" />
  <img src="https://img.shields.io/badge/plugins-9-10b981?style=flat-square" alt="9 plugins" />
</p>
<p>
  <img src="https://img.shields.io/badge/React_Flow-v12-22c55e?style=flat-square&logo=react&logoColor=white" alt="React Flow" />
  <img src="https://img.shields.io/badge/Motion-v12-f59e0b?style=flat-square&logo=framer&logoColor=white" alt="Motion" />
  <img src="https://img.shields.io/badge/Lenis-smooth_scroll-0ea5e9?style=flat-square" alt="Lenis" />
  <img src="https://img.shields.io/badge/React_19-Next.js-61dafb?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind-v4_tokens-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Echo-Go-00ADD8?style=flat-square" alt="Echo" />
  <img src="https://img.shields.io/badge/Golang-practices-00ADD8?style=flat-square" alt="Go" />
  <img src="https://img.shields.io/badge/Rust-practices-ce422b?style=flat-square&logo=rust&logoColor=white" alt="Rust" />
  <img src="https://img.shields.io/badge/UI%2FUX-principles-a855f7?style=flat-square" alt="UI/UX" />
</p>

<br/>

> Plugin-based MCP server that gives your AI assistant deep knowledge of frontend and backend libraries -
> API refs, patterns, code generation, design systems - all through a single process with namespaced tools.

</div>

---

## 🤝 AI Skill Included

This repository includes `SKILL.md` - a Claude Code skill that teaches your AI assistant *when and how* to use these tools. The skill handles judgment and gotchas; the MCP server handles the data.

To use the skill, clone this repository into your Claude Code skills directory:

```bash
git clone https://github.com/orkait/hyperstack.git ~/.claude/skills/hyperstack
```

---

## 🧩 Plugins

| Plugin | Library / Domain | Tools | What's included |
|--------|-----------------|:-----:|-----------------|
| **reactflow** | [@xyflow/react](https://reactflow.dev) v12 | 8 | 56 APIs, 17 patterns, 3 templates, migration guide |
| **motion** | [Motion for React](https://motion.dev) v12 | 6 | 33 APIs, 14 example categories, transition reference |
| **lenis** | [Lenis](https://lenis.darkroom.engineering) smooth scroll | 6 | API reference, 7 patterns, 7 recipes, CSS rules, GSAP integration |
| **react** | React 19 + Next.js App Router | 4 | RSC patterns, state hierarchy, data fetching, Zustand, composition |
| **echo** | [Echo](https://echo.labstack.com) Go web framework | 6 | 19 recipes, 13 middleware, decision matrix, cheatsheet |
| **golang** | Go best practices + design patterns | 6 | 18 best practices, 10 design patterns, anti-patterns, cheatsheet |
| **rust** | Rust best practices | 4 | 18 practices (good/bad pairs), ownership guide, cheatsheet |
| **design-tokens** | Tailwind v4 + OKLCH token system | 7 | 10 token categories, 8 build procedures, color ramp templates |
| **ui-ux** | UI/UX design principles | 6 | Typography, color, spacing, elevation, motion, a11y, component patterns |

---

## 🛠️ Tools

<details>
<summary><strong>⚛️ React Flow</strong> - <code>reactflow_*</code></summary>

| Tool | What it does |
|------|-------------|
| `reactflow_list_apis` | Browse all 56 APIs grouped by kind - components, hooks, utilities, types |
| `reactflow_get_api` | Full reference for any API: props table, usage snippet, examples, tips |
| `reactflow_search_docs` | Full-text search across all docs and code examples |
| `reactflow_get_examples` | Curated code examples by category |
| `reactflow_get_pattern` | Complete enterprise patterns with full implementation code |
| `reactflow_get_template` | Production-ready starters: `custom-node`, `custom-edge`, `zustand-store` |
| `reactflow_get_migration_guide` | v11 → v12 breaking changes with before/after diffs |
| `reactflow_generate_flow` | Generate a complete flow component from a plain English description |

<details>
<summary>17 available patterns</summary>

`zustand-store` · `undo-redo` · `drag-and-drop` · `auto-layout-dagre` · `auto-layout-elk` · `context-menu` · `copy-paste` · `save-restore` · `prevent-cycles` · `keyboard-shortcuts` · `performance` · `dark-mode` · `ssr` · `subflows` · `edge-reconnection` · `custom-connection-line` · `auto-layout-on-mount`

</details>
</details>

<details>
<summary><strong>🎬 Motion for React</strong> - <code>motion_*</code></summary>

| Tool | What it does |
|------|-------------|
| `motion_list_apis` | Browse all 33 APIs grouped by kind - components, hooks, functions |
| `motion_get_api` | Full reference for any API: props table, usage snippet, examples, tips |
| `motion_search_docs` | Full-text search across all docs and code examples |
| `motion_get_examples` | Curated animation examples by category |
| `motion_get_transitions` | Complete transition reference: tween, spring, inertia, orchestration |
| `motion_generate_animation` | Generate a Motion animation snippet from a plain English description |

<details>
<summary>14 example categories</summary>

`animation` · `gestures` · `scroll` · `layout` · `exit` · `drag` · `hover` · `svg` · `transitions` · `variants` · `keyframes` · `spring` · `reorder` · `performance`

</details>
</details>

<details>
<summary><strong>🌊 Lenis</strong> - <code>lenis_*</code></summary>

| Tool | What it does |
|------|-------------|
| `lenis_list_apis` | Browse all Lenis APIs - options, methods, events |
| `lenis_get_api` | Full reference for any API with usage snippet |
| `lenis_get_pattern` | Integration patterns: Next.js, GSAP, Framer Motion, custom container |
| `lenis_generate_setup` | Generate a complete Lenis setup from a description |
| `lenis_cheatsheet` | Required CSS, `data-lenis-prevent` usage, pitfalls table |
| `lenis_search_docs` | Full-text search across all Lenis docs |

<details>
<summary>7 patterns and 7 recipes</summary>

**Patterns:** `full-page` · `next-js` · `gsap-integration` · `framer-motion-integration` · `custom-container` · `accessibility` · `scroll-to-nav`

**Recipes:** `scroll-progress-bar` · `back-to-top` · `horizontal-scroll-section` · `scroll-locked-modal` · `parallax-layer` · `direction-indicator` · `gsap-complete`

</details>
</details>

<details>
<summary><strong>⚛️ React + Next.js</strong> - <code>react_*</code></summary>

| Tool | What it does |
|------|-------------|
| `react_list_patterns` | List all React/Next.js patterns with categories |
| `react_get_pattern` | Full pattern: code, anti-pattern, tips |
| `react_get_constraints` | Hard rules and banned patterns (no `useEffect` for fetching, no Redux, etc.) |
| `react_search_docs` | Search across patterns and rules |

</details>

<details>
<summary><strong>🐹 Echo (Go)</strong> - <code>echo_*</code></summary>

| Tool | What it does |
|------|-------------|
| `echo_list_recipes` | Browse all 19 recipes by category |
| `echo_get_recipe` | Full recipe with complete runnable code |
| `echo_list_middleware` | Browse all 13 middleware with purpose and order guidance |
| `echo_get_middleware` | Full middleware reference with usage and gotchas |
| `echo_decision_matrix` | When to use what - Echo vs stdlib vs alternatives |
| `echo_search_docs` | Full-text search across all recipes and middleware |

<details>
<summary>19 recipes</summary>

`hello-world` · `crud-api` · `jwt-auth` · `websocket` · `sse` · `file-upload` · `file-download` · `graceful-shutdown` · `middleware-chain` · `cors` · `route-groups` · `http2` · `auto-tls` · `reverse-proxy` · `streaming-response` · `embed-resources` · `timeout` · `subdomain-routing` · `jsonp`

</details>
</details>

<details>
<summary><strong>🐹 Golang</strong> - <code>golang_*</code></summary>

| Tool | What it does |
|------|-------------|
| `golang_list_practices` | Browse all 18 best practices by topic |
| `golang_get_practice` | Full practice: rule, reason, good/bad code examples |
| `golang_list_patterns` | Browse all 10 design patterns by category |
| `golang_get_pattern` | Full pattern with Go-idiomatic implementation |
| `golang_get_antipatterns` | Common Go mistakes and their fixes |
| `golang_search_docs` | Search across practices and patterns |

<details>
<summary>Topics and patterns</summary>

**Practice topics:** `fundamentals` · `error-handling` · `concurrency` · `api-server` · `database` · `config` · `logging` · `security` · `testing`

**Pattern categories:** `creational` (functional-options) · `structural` (adapter, middleware-decorator, consumer-side-interface) · `behavioral` (strategy, observer, command) · `concurrency` (worker-pool, pipeline, fan-out-fan-in)

</details>
</details>

<details>
<summary><strong>🦀 Rust</strong> - <code>rust_*</code></summary>

| Tool | What it does |
|------|-------------|
| `rust_list_practices` | Browse all 18 best practices by topic |
| `rust_get_practice` | Full practice: rule, reason, good/bad examples |
| `rust_search_docs` | Search across all practices |
| `rust_cheatsheet` | Ownership rules, pointer type table, performance tips |

</details>

<details>
<summary><strong>🎨 Design Tokens</strong> - <code>design_tokens_*</code></summary>

| Tool | What it does |
|------|-------------|
| `design_tokens_list_categories` | Browse all 10 token categories with descriptions |
| `design_tokens_get_category` | Full CSS + rules + gotchas for a token category |
| `design_tokens_get_color_ramp` | Color ramp reference: stops, oklch values, semantic roles |
| `design_tokens_get_procedure` | Step-by-step token build procedures (8 steps) |
| `design_tokens_get_gotchas` | All gotchas across every category and procedure |
| `design_tokens_generate` | Generate a complete Tailwind v4 token file from a palette |
| `design_tokens_search` | Search across all categories, ramps, and procedures |

<details>
<summary>10 token categories</summary>

`colors` · `spacing` · `typography` · `component-sizing` · `border-radius` · `shadows-elevation` · `motion` · `z-index` · `opacity` · `grid-layout`

</details>
</details>

<details>
<summary><strong>💅 UI/UX Principles</strong> - <code>ui_ux_*</code></summary>

| Tool | What it does |
|------|-------------|
| `ui_ux_list_principles` | Browse all principles by domain |
| `ui_ux_get_principle` | Full principle: rule, detail, CSS example, anti-patterns |
| `ui_ux_get_component_pattern` | Component spec: variants, states, sizing rules, CSS |
| `ui_ux_get_checklist` | Pre-ship checklist per domain (typography, color, a11y, motion) |
| `ui_ux_get_gotchas` | All common UI mistakes and their fixes |
| `ui_ux_search` | Search across principles, patterns, and gotchas |

<details>
<summary>Domains and components</summary>

**Domains:** `typography` · `color` · `spacing` · `elevation` · `motion` · `accessibility` · `responsive` · `components`

**Component patterns:** `button` · `card` · `badge` · `form-input`

</details>
</details>

---

## 📄 Resources

| Resource | URI | Description |
|----------|-----|-------------|
| React Flow cheatsheet | `reactflow://cheatsheet` | Quick reference for @xyflow/react v12 |
| Motion cheatsheet | `motion://react/cheatsheet` | Quick reference for motion/react v12 |

---

## 🚀 Install

### 🐳 Docker (recommended)

Build once, reuse forever. The wrapper script keeps **one** named container alive and runs each MCP session inside it via `docker exec` - no duplicate containers, no matter how many AI sessions are open.

```bash
git clone https://github.com/orkait/hyperstack.git
cd hyperstack
npm install
docker build -t hyperstack .
```

Add to your MCP config:

<details>
<summary><strong>Claude Code</strong> - <code>~/.claude.json</code></summary>

```json
{
  "mcpServers": {
    "hyperstack": {
      "command": "/absolute/path/to/hyperstack/scripts/start-mcp.sh"
    }
  }
}
```

</details>

<details>
<summary><strong>Claude Desktop / Cursor / Windsurf</strong> - their respective config files</summary>

```json
{
  "mcpServers": {
    "hyperstack": {
      "command": "/absolute/path/to/hyperstack/scripts/start-mcp.sh"
    }
  }
}
```

</details>

---

### 📦 Without Docker (Node directly)

```bash
git clone https://github.com/orkait/hyperstack.git
cd hyperstack
npm install && npm run build
```

```json
{
  "mcpServers": {
    "hyperstack": {
      "command": "node",
      "args": ["/absolute/path/to/hyperstack/dist/index.js"]
    }
  }
}
```

---

## 💡 Why unified?

Running a separate MCP server per library means one Docker container per server at startup. Two libraries = two containers. Ten libraries = ten containers - every session.

`hyperstack` runs everything in **one process**. All plugins share the same server, same connection, same container.

Tool names are namespaced per plugin (`reactflow_list_apis` vs `motion_list_apis`) so there are zero naming conflicts - the LLM always knows which library a tool belongs to.

---

## 🔌 Adding a Plugin

1. Create `src/plugins/<name>/` with:
   - `data.ts` - reference data (keep all code examples in `snippets/<name>/` as `.md` files)
   - `loader.ts` - `export const snippet = createSnippetLoader("<name>")`
   - `tools/<tool-name>.ts` - one file per tool, each exporting `register(server)`; prefix all tool names with `<name>_`
   - `index.ts` - export `const <name>Plugin: Plugin = { name: "<name>", register }`

2. Register in `src/index.ts`:
   ```typescript
   import { shadcnPlugin } from "./plugins/shadcn/index.js";
   loadPlugins(server, [...existingPlugins, shadcnPlugin]);
   ```

3. Rebuild and redeploy:
   ```bash
   npm run build
   docker build -t hyperstack .
   docker rm -f hyperstack-daemon   # next session recreates it
   ```

No changes to your MCP config required.

---

## 🏗️ Architecture

```
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
    ├── lenis/                 # Lenis smooth scroll
    │   └── snippets/          # 31 .txt files
    ├── react/                 # React 19 + Next.js App Router
    │   └── snippets/          # 13 .txt files
    ├── echo/                  # Echo Go framework
    │   └── snippets/          # 33 .txt files
    ├── golang/                # Go best practices + design patterns
    │   └── snippets/          # 43 .txt files
    ├── rust/                  # Rust best practices
    │   └── snippets/          # 28 .txt files
    ├── design-tokens/         # Tailwind v4 OKLCH token system
    │   └── snippets/          # 24 .txt files
    └── ui-ux/                 # UI/UX design principles
        └── snippets/          # 25 .txt files

scripts/
└── start-mcp.sh               # Single-container Docker wrapper
```

**Plugin interface:**
```typescript
export interface Plugin {
  name: string;
  register: (server: McpServer) => void;
}
```

Every plugin stores all code examples as `.md` files loaded at runtime:
```typescript
// loader.ts
export const snippet = createSnippetLoader("golang");

// data.ts
good: snippet("practices/error-wrapping-good.md"),
bad:  snippet("practices/error-wrapping-bad.md"),
```

---

## 🛠 Development

```bash
npm install
npm start         # run server using tsx
npm run dev       # watch mode using tsx
```

```bash
# Verify all plugins load and tools are registered correctly
npx tsx <<'EOF'
import { reactflowPlugin } from './src/plugins/reactflow/index.js';
import { motionPlugin } from './src/plugins/motion/index.js';
import { lenisPlugin } from './src/plugins/lenis/index.js';
import { golangPlugin } from './src/plugins/golang/index.js';
const tools = [];
const fake = { tool: (n) => tools.push(n), resource: () => {} };
[reactflowPlugin, motionPlugin, lenisPlugin, golangPlugin].forEach(p => p.register(fake));
console.log('Tools registered:', tools.length);
EOF
```

---

## 📄 License

MIT © [Orkait](https://github.com/orkait)
T © [Orkait](https://github.com/orkait)
ait)
