<div align="center">

# unified-mcp

**One MCP server. Every library your AI needs. Zero conflicts.**

<p>
  <!-- status -->
  <a href="https://github.com/orkait/unified-mcp/actions/workflows/ci.yml"><img src="https://github.com/orkait/unified-mcp/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/orkait/unified-mcp/blob/main/LICENSE"><img src="https://img.shields.io/github/license/orkait/unified-mcp?color=blue&logo=opensourceinitiative&logoColor=white" alt="License" /></a>
  <a href="https://github.com/orkait/unified-mcp/stargazers"><img src="https://img.shields.io/github/stars/orkait/unified-mcp?style=flat&logo=github&logoColor=white&color=f0c040" alt="Stars" /></a>
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
  <a href="https://modelcontextprotocol.io"><img src="https://img.shields.io/badge/MCP-compatible-6366f1?logo=anthropic&logoColor=white" alt="MCP compatible" /></a>
</p>
<p>
  <!-- frontend plugins -->
  <a href="https://reactflow.dev"><img src="https://img.shields.io/badge/%40xyflow%2Freact-v12-22c55e?logo=react&logoColor=white" alt="React Flow v12" /></a>
  <a href="https://motion.dev"><img src="https://img.shields.io/badge/motion%2Freact-v12-f59e0b?logo=framer&logoColor=white" alt="Motion v12" /></a>
  <a href="https://lenis.darkroom.engineering"><img src="https://img.shields.io/badge/lenis-smooth%20scroll-0ea5e9?logo=npm&logoColor=white" alt="Lenis" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19%20%2B%20Next.js-61dafb?logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-v4%20tokens-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind v4" /></a>
</p>
<p>
  <!-- backend + systems plugins -->
  <a href="https://echo.labstack.com"><img src="https://img.shields.io/badge/Echo-Go%20framework-00ADD8?logo=go&logoColor=white" alt="Echo Go" /></a>
  <a href="https://go.dev"><img src="https://img.shields.io/badge/Go-best%20practices-00ADD8?logo=go&logoColor=white" alt="Go" /></a>
  <a href="https://www.rust-lang.org"><img src="https://img.shields.io/badge/Rust-best%20practices-ce422b?logo=rust&logoColor=white" alt="Rust" /></a>
  <img src="https://img.shields.io/badge/UI%2FUX-design%20principles-a855f7?logo=figma&logoColor=white" alt="UI/UX" />
</p>

<br/>

> Plugin-based MCP server that gives your AI assistant deep knowledge of frontend and backend libraries -
> API refs, patterns, code generation, design systems - all through a single process with namespaced tools.

</div>

---

## 🤝 Companion

This server pairs with **[unified-skill](https://github.com/orkait/unified-skill)** - a Claude Code skill that teaches your AI assistant *when and how* to use these tools. The skill handles judgment and gotchas; this server handles the data.

Install both to get the full experience.

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
git clone https://github.com/orkait/unified-mcp.git
cd unified-mcp
npm install && npm run build
docker build -t unified-mcp .
```

Add to your MCP config:

<details>
<summary><strong>Claude Code</strong> - <code>~/.claude.json</code></summary>

```json
{
  "mcpServers": {
    "unified-mcp": {
      "command": "/absolute/path/to/unified-mcp/scripts/start-mcp.sh"
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
    "unified-mcp": {
      "command": "/absolute/path/to/unified-mcp/scripts/start-mcp.sh"
    }
  }
}
```

</details>

---

### 📦 Without Docker (Node directly)

```bash
git clone https://github.com/orkait/unified-mcp.git
cd unified-mcp
npm install && npm run build
```

```json
{
  "mcpServers": {
    "unified-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/unified-mcp/dist/index.js"]
    }
  }
}
```

---

## 💡 Why unified?

Running a separate MCP server per library means one Docker container per server at startup. Two libraries = two containers. Ten libraries = ten containers - every session.

`unified-mcp` runs everything in **one process**. All plugins share the same server, same connection, same container.

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
   docker build -t unified-mcp .
   docker rm -f unified-mcp-daemon   # next session recreates it
   ```

No changes to your MCP config required.

---

## 🏗️ Architecture

```
src/
├── index.ts                  # Entry - creates McpServer, loads all plugins
├── registry.ts               # Plugin interface + loadPlugins()
├── shared/
│   └── loader-factory.ts     # createSnippetLoader() - reads .md files at runtime
└── plugins/
    ├── reactflow/             # @xyflow/react v12
    ├── motion/                # motion/react v12
    ├── lenis/                 # Lenis smooth scroll
    ├── react/                 # React 19 + Next.js App Router
    ├── echo/                  # Echo Go framework
    ├── golang/                # Go best practices + design patterns
    ├── rust/                  # Rust best practices
    ├── design-tokens/         # Tailwind v4 OKLCH token system
    └── ui-ux/                 # UI/UX design principles

snippets/
├── reactflow/                 # 94 .md files
├── motion/                    # 79 .md files
├── lenis/                     # 31 .md files
├── react/                     # 13 .md files
├── echo/                      # 33 .md files
├── golang/                    # 43 .md files
├── rust/                      # 28 .md files
├── design-tokens/             # 24 .md files
└── ui-ux/                     # 25 .md files

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
npm run build     # compile TypeScript to dist/
npm run dev       # watch mode
npm start         # run server directly
```

```bash
# Verify all plugins load and tools are registered correctly
node --input-type=module <<'EOF'
import { reactflowPlugin } from './dist/plugins/reactflow/index.js';
import { motionPlugin } from './dist/plugins/motion/index.js';
import { lenisPlugin } from './dist/plugins/lenis/index.js';
import { golangPlugin } from './dist/plugins/golang/index.js';
const tools = [];
const fake = { tool: (n) => tools.push(n), resource: () => {} };
[reactflowPlugin, motionPlugin, lenisPlugin, golangPlugin].forEach(p => p.register(fake));
console.log('Tools registered:', tools.length);
EOF
```

---

## 📄 License

MIT © [Orkait](https://github.com/orkait)
