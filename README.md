# unified-mcp

<p align="center">
  <a href="https://github.com/orkait/unified-mcp/actions/workflows/ci.yml"><img src="https://github.com/orkait/unified-mcp/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/orkait/unified-mcp/blob/main/LICENSE"><img src="https://img.shields.io/github/license/orkait/unified-mcp" alt="license" /></a>
  <a href="https://modelcontextprotocol.io"><img src="https://img.shields.io/badge/MCP-compatible-blue.svg" alt="MCP" /></a>
  <a href="https://github.com/orkait/unified-mcp/stargazers"><img src="https://img.shields.io/github/stars/orkait/unified-mcp?style=social" alt="stars" /></a>
</p>

One MCP server. All frontend libraries. No conflicts.

`unified-mcp` is a plugin-based MCP server that bundles documentation, API references, patterns, and code generation for multiple frontend libraries into a single process. Each library is a plugin with namespaced tools (`reactflow_*`, `motion_*`) so tool names never collide — regardless of how many plugins are loaded.

---

## Plugins

| Plugin | Library | Tools | Coverage |
|--------|---------|-------|----------|
| **reactflow** | [@xyflow/react](https://reactflow.dev) v12 | 8 tools | 56 APIs, 17 patterns, 3 templates, migration guide |
| **motion** | [Motion for React](https://motion.dev) v12 | 6 tools | 33 APIs, 14 example categories, transition reference |

---

## Tools

### React Flow (`reactflow_*`)

| Tool | Description |
|------|-------------|
| `reactflow_list_apis` | Browse all 56 APIs grouped by kind (components, hooks, utilities, types) |
| `reactflow_get_api` | Detailed reference for any API — props, usage, examples, tips |
| `reactflow_search_docs` | Keyword search across all documentation and code examples |
| `reactflow_get_examples` | Code examples by category (15 categories) |
| `reactflow_get_pattern` | Enterprise patterns with full implementation (17 patterns) |
| `reactflow_get_template` | Production-ready templates: custom-node, custom-edge, zustand-store |
| `reactflow_get_migration_guide` | React Flow v11 → v12 migration guide with breaking changes |
| `reactflow_generate_flow` | Generate a complete flow component from natural language |

**Patterns:** zustand-store, undo-redo, drag-and-drop, auto-layout-dagre, auto-layout-elk, context-menu, copy-paste, save-restore, prevent-cycles, keyboard-shortcuts, performance, dark-mode, ssr, subflows, edge-reconnection, custom-connection-line, auto-layout-on-mount

### Motion for React (`motion_*`)

| Tool | Description |
|------|-------------|
| `motion_list_apis` | Browse all 33 APIs grouped by kind (components, hooks, functions) |
| `motion_get_api` | Detailed reference for any API — props, usage, examples, tips |
| `motion_search_docs` | Keyword search across all documentation and code examples |
| `motion_get_examples` | Code examples by animation category (14 categories) |
| `motion_get_transitions` | Complete transition types reference (tween, spring, inertia, orchestration) |
| `motion_generate_animation` | Generate a Motion animation snippet from natural language |

**Example categories:** animation, gestures, scroll, layout, exit, drag, hover, svg, transitions, variants, keyframes, spring, reorder, performance

### Resources

| Resource | URI | Description |
|----------|-----|-------------|
| React Flow cheatsheet | `reactflow://cheatsheet` | Quick reference for @xyflow/react v12 |
| Motion cheatsheet | `motion://react/cheatsheet` | Quick reference for motion/react v12 |

---

## Install

### Docker (recommended)

Build the image once, then use the single-container wrapper so Claude never spawns duplicate containers:

```bash
git clone https://github.com/orkait/unified-mcp.git
cd unified-mcp
npm install && npm run build
docker build -t frontend-mcp .
```

Add to your MCP config (Claude Code: `~/.claude.json`, Claude Desktop / Cursor / Windsurf: their respective config files):

```json
{
  "mcpServers": {
    "frontend-mcp": {
      "command": "/absolute/path/to/unified-mcp/scripts/start-mcp.sh"
    }
  }
}
```

The wrapper script (`scripts/start-mcp.sh`) keeps **one** named Docker container alive and spawns each MCP session inside it via `docker exec -i` — no matter how many Claude sessions are open, only one container runs.

### Without Docker (Node directly)

```bash
git clone https://github.com/orkait/unified-mcp.git
cd unified-mcp
npm install && npm run build
```

```json
{
  "mcpServers": {
    "frontend-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/unified-mcp/dist/index.js"]
    }
  }
}
```

---

## Why unified?

When you run separate MCP servers for each library, Claude startup spins up one Docker container per server. Two libraries = two containers every session. Ten libraries = ten containers.

`unified-mcp` runs everything in one process. All plugins share the same server, the same connection, and (with the Docker wrapper) the same container.

Tool names are namespaced by plugin (`reactflow_list_apis` vs `motion_list_apis`) so there are no conflicts — the LLM always knows which library a tool belongs to.

---

## Adding a Plugin

1. Create `src/plugins/<name>/` with:
   - `data.ts` or `data/` — your library's reference data
   - `tools/<tool-name>.ts` — one file per tool, each exporting `register(server)`; use `<name>_` prefix on all tool names
   - `index.ts` — export `const <name>Plugin: Plugin = { name: "<name>", register }`

2. Register it in `src/index.ts`:
   ```typescript
   import { shadcnPlugin } from "./plugins/shadcn/index.js";
   loadPlugins(server, [reactflowPlugin, motionPlugin, shadcnPlugin]);
   ```

3. Rebuild and redeploy:
   ```bash
   npm run build
   docker build -t frontend-mcp .
   docker rm -f frontend-mcp-daemon   # next Claude startup recreates it
   ```

No changes to your MCP config required.

---

## Development

```bash
npm install
npm run build     # compile TypeScript → dist/
npm run dev       # watch mode
npm start         # run server directly
```

```bash
# Verify all tools registered with correct prefixes
node --input-type=module <<'EOF'
import { reactflowPlugin } from './dist/plugins/reactflow/index.js';
import { motionPlugin } from './dist/plugins/motion/index.js';
const tools = [];
const fake = { tool: (n) => tools.push(n), resource: () => {} };
reactflowPlugin.register(fake);
motionPlugin.register(fake);
console.log('Tools:', tools);
EOF
```

---

## Architecture

```
src/
├── index.ts               # Entry point — creates McpServer, loads plugins, starts StdioTransport
├── registry.ts            # Plugin interface + loadPlugins()
└── plugins/
    ├── reactflow/
    │   ├── index.ts       # Exports reactflowPlugin
    │   ├── tools/         # One file per tool, all prefixed reactflow_*
    │   └── data/          # React Flow v12 API reference data
    └── motion/
        ├── index.ts       # Exports motionPlugin
        ├── tools/         # One file per tool, all prefixed motion_*
        └── data.ts        # Motion for React v12 API reference data

scripts/
└── start-mcp.sh           # Single-container Docker wrapper
```

**Plugin interface:**
```typescript
export interface Plugin {
  name: string;
  register: (server: McpServer) => void;
}
```

---

## License

MIT © [Orkait](https://github.com/orkait)
