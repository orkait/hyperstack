<div align="center">

# hyperstack

**One MCP server + AI Skill. Every library your AI needs. Zero conflicts.**

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

> Plugin-based MCP server and AI Skill that gives your AI assistant deep knowledge of frontend and backend libraries -
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

## 🚀 Install

The easiest way to use Hyperstack is via our pre-built Docker image. Docker will automatically download and run the server without any manual cloning or installation required.

Add the following to your MCP config (`~/.claude.json` or Cursor config):

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
        "superorkait/hyperstack:main"
      ]
    }
  }
}
```

*Note: The `--memory=256m` and `--cpus=0.5` flags ensure the server runs with strict resource limits, preventing it from consuming too much RAM or compute.*

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
```

**Plugin interface:**
```typescript
export interface Plugin {
  name: string;
  register: (server: McpServer) => void;
}
```

Every plugin stores all code examples as `.txt` files loaded at runtime:
```typescript
// loader.ts
export const snippet = createSnippetLoader("golang");

// data.ts
good: snippet("practices/error-wrapping-good.txt"),
bad:  snippet("practices/error-wrapping-bad.txt"),
```

---

## 🛠 Development

To contribute or run locally from source:

```bash
git clone https://github.com/orkait/hyperstack.git
cd hyperstack
npm install
npm start         # run server using tsx
npm run dev       # watch mode using tsx
```

---

## 📄 License

MIT © [Orkait](https://github.com/orkait)
