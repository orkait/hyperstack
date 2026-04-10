# 🧠 Hyperstack

Hyperstack is a disciplined development environment for your coding agent. It's a set of MCP plugins that give your agent *real* API docs, design decisions, and component specs - plus a skill system that actually makes it use them. Turns a generic coding assistant into something closer to a Senior Staff Engineer who checks docs before writing code, designs before building, and verifies before shipping.

Think of it as the "no, actually, do your homework first" plugin for your AI.

## ✨ How it works

It starts the moment you fire up your coding agent. A SessionStart hook injects the `using-hyperstack` skill straight into the conversation context, so the agent knows the rules before you even type your first message. No manual activation, no `/plugin load`, no ceremony.

When you ask for something visual - a landing page, a dashboard, a new component - the agent *doesn't* jump to JSX. The `designer` skill takes over first. It auto-detects your industry, personality cluster, and style from the product description, asks you three quick questions (or twelve in advanced mode if you're feeling thorough), and produces a `DESIGN.md` contract with colors, typography, spacing, component specs, motion rules, and the anti-patterns it refuses to ship. You review. You approve. *Then* code happens.

Same rhythm for backend work. `blueprint` runs an MCP survey first, proposes two or three approaches with trade-offs, waits for you to pick, then hands off to `forge-plan` to break the work into 2-5 minute tasks. Each task cites the exact MCP tool output it depends on. No assumed API shapes, no imagined prop names, no "probably works like this."

During execution, `test-first` enforces real RED-GREEN-REFACTOR TDD. `ship-gate` refuses to let the agent claim completion without fresh verification evidence - you literally cannot say "tests pass" if you haven't run them in the current message. `behaviour-analysis` audits the implementation against the DESIGN.md before you ship.

The enforcement is adversarial on purpose. Every gate skill has an Iron Law in all-caps, a 1% Rule (if there's even a 1% chance a skill applies, invoke it), and a rationalization table listing the exact excuses your agent will use to skip the gate - with counters. "Just this once" is spelled out as *not allowed*, in writing, before the agent even thinks of it.

There's a bunch more to it, but that's the core. The MCP plugins give the agent deterministic knowledge. The skills give it discipline. The hook makes sure it can't forget either.

And because the skills trigger automatically, you don't need to do anything special. Your coding agent just has Hyperstack.

## 🚀 Installation

Installation differs slightly by platform. The easiest path is Docker plus a tiny MCP config.

### 🐳 Claude Code (Docker)

Add this to `~/.claude.json`:

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

The `--memory=256m` and `--cpus=0.5` flags are not optional. They keep the server from deciding it needs 4GB of RAM.

### 🤖 Agent-driven install

If you already have Claude Code, Cursor, or Gemini CLI running, just paste this at the agent:

```
Fetch and follow the instructions at https://raw.githubusercontent.com/orkait/hyperstack/main/install.md
```

The agent will pull the image and write the config for you. This is the path of least ceremony.

### 📦 Install the skills

The MCP server gives you tools. The skill system gives you the discipline that makes the tools worth using. Clone the repo into your skills directory:

```bash
git clone https://github.com/orkait/hyperstack.git ~/.claude/skills/hyperstack
```

The SessionStart hook activates automatically on your next session. No further setup.

### 🔧 From source

```bash
git clone https://github.com/orkait/hyperstack.git
cd hyperstack
npm install
npm start
```

Node 18 or later. There's no build step - everything runs via `tsx` at runtime. `npm run build` exists but it's `tsc --noEmit` for type checking only.

### ✅ Verify it works

Start a fresh session in your chosen client. Ask for something visual: *"help me design a SaaS dashboard for DevOps engineers."*

The agent should invoke `hyperstack:designer` before writing a single line of code. If it jumps straight to JSX, the hook didn't fire - check your MCP config, restart the client, and try again.

## 🧭 The basic workflow

1. **using-hyperstack** - Auto-loaded at session start by the hook. Establishes the Iron Laws, the 1% Rule, and the rationalization counters. You never invoke this manually.

2. **blueprint** - Activates before any feature build. Runs an MCP survey for the relevant domain, clarifies requirements, proposes two or three approaches, presents a design, runs negative doubt on it. Hard gate: no code without approval.

3. **designer** - Activates for anything visual. Produces a DESIGN.md contract with 10 sections (theme, colors, typography, spacing, components, motion, elevation, do's and don'ts, responsive, anti-patterns). Asks about framework and component library. Q11b picks between shadcn, raw Tailwind, MUI, Mantine, Chakra, Ant, or custom - because assuming shadcn by default is how you end up with AI-slop everywhere.

4. **forge-plan** - Activates after design approval. Reads the DESIGN.md (or architecture note), surveys the relevant MCP tools *again* with the implementation details in view, generates one task per DESIGN.md section. Each task has exact file paths, a failing test, minimal implementation, and a commit command.

5. **subagent-ops** or **autonomous-mode** - Activates with an approved plan. Dispatches fresh agents per task with two-stage review, or runs the full plan end-to-end without checkpoints. Your choice, depending on how much trust you've earned with the agent that day.

6. **test-first** - Activates during implementation. Enforces RED-GREEN-REFACTOR. Write the failing test, watch it fail, write minimal code, watch it pass, commit. Code written before the test *gets deleted*. No exceptions, no "I'll add tests after."

7. **ship-gate** - Activates before any completion claim. Runs the verification command fresh in the current message. No "should work," no "probably passes," no trusting subagent reports. You show the output or you don't claim it.

8. **deliver** - Activates after all tasks complete. Final verification, branch cleanup, PR or merge.

The agent checks for relevant skills before every action. These are mandatory workflows, not helpful suggestions.

## 🧩 What's inside

### 🔌 MCP plugins

Eleven plugins, seventy-nine tools, bundled TypeScript data and snippets. All loaded at server startup via `src/index.ts`.

**🎨 Design and components**
- **designer** - 19 tools. 6 personality clusters from 58 real company design systems, 15 industry rules, 11 cognitive laws (Fitts, Hick, Miller, Gestalt, Von Restorff, Serial Position, F-pattern, Z-pattern, Jakob, Doherty, Peak-End), 13 page templates, 9 code-ready presets (Linear, Stripe, Vercel, Apple, Carbon, shadcn, Notion, Supabase, Figma), 21 curated font pairings, 50+ anti-patterns. DESIGN.md pipeline with intent resolution, implementation plan generation, and programmatic compliance verification.
- **design-tokens** - 7 tools. Tailwind v4 + OKLCH token systems, 10 categories, 8 build procedures.
- **ui-ux** - 6 tools. Typography scales, spacing grids, accessibility checklists, component patterns.
- **shadcn** - 5 tools. shadcn/ui Base UI edition. Architectural rules, curated components, page-type composition mappings. Only invoked when the user picks shadcn in designer Q11b.

**⚛️ Frontend**
- **reactflow** - 9 tools. @xyflow/react v12, 56 APIs, 17 patterns, templates, migration guides.
- **motion** - 7 tools. Motion for React v12, 33 APIs, transition reference, animation generators.
- **lenis** - 6 tools. Smooth scroll, 7 recipes, GSAP integration, React hooks.
- **react** - 4 tools. React 19 and Next.js, RSC patterns, Zustand hierarchy, data fetching rules.

**🐹 Backend**
- **echo** - 6 tools. Echo Go framework, 19 recipes, 13 middleware, decision matrices.
- **golang** - 6 tools. Go, 18 practices, 10 design patterns, anti-patterns.
- **rust** - 4 tools. Rust, 18 practices, ownership guide, performance tips.

### 🎯 Skills

Twenty-one skills, grouped by category via frontmatter. Full index at `skills/INDEX.md`, auto-generated by `bash scripts/generate-skills-index.sh`.

**Core (workflow and discipline)**
- **blueprint** - Hard gate, no code without an approved design
- **forge-plan** - MCP-verified task-by-task implementation plan
- **run-plan** - Execute an existing plan
- **engineering-discipline** - 8-step Senior SDE framework with 5 Iron Laws
- **ship-gate** - No completion claims without fresh verification evidence
- **deliver** - Final verification and delivery
- **test-first** - No production code without a failing test first
- **debug-discipline** - Root cause first, 3-strike escalation
- **code-review** - Dispatch reviewer subagent, handle feedback technically
- **autonomous-mode** - Full end-to-end execution, only stops on failure
- **subagent-ops** - Fresh agent per task, two-stage review
- **parallel-dispatch** - Concurrent agent dispatch for independent tasks
- **worktree-isolation** - Clean workspace isolation before feature work

**Domain (specialized)**
- **designer** - Intention gate, produces DESIGN.md contract before any visual code
- **shadcn-expert** - shadcn/ui Base UI architect, only fires when user picks shadcn
- **behaviour-analysis** - UI/UX state audits, Nielsen heuristics, interaction matrices
- **security-review** - OWASP audits, vulnerability checklists
- **design-patterns-skill** - Clean Code and Pragmatic Programmer patterns
- **readme-writer** - Evidence-based README generation

**Meta**
- **using-hyperstack** - The force-injected enforcement payload
- **testing-skills** - RED-GREEN-REFACTOR pressure testing for skills using subagents

## 🎯 Philosophy

- **Evidence before claims** - Run the verification command, or don't claim it passes
- **Hard gates over polite suggestions** - "If you want to, you should probably..." fails under pressure
- **Ground-truth MCP data over memory** - Memory drifts, MCP data is versioned
- **DESIGN.md before visual code** - Intention before implementation
- **Iron Laws over nudges** - Short, memorable, all-caps, no exceptions
- **Spirit equals letter** - Rationalizations get written down and countered *before* they happen

## 🤝 Contributing

Skills and plugins live in this repo. To contribute:

1. Fork the repository
2. Create a feature branch (`feat/<name>`, `fix/<name>`, `chore/<name>`)
3. For new skills, follow the structure of existing ones, add a `category:` frontmatter field (core, domain, or meta), and regenerate the index:
   ```bash
   bash scripts/generate-skills-index.sh
   ```
4. For new plugins, follow the existing structure: `index.ts` registers tools from `tools/`, data lives in `data.ts`, snippets in `snippets/*.txt`
5. Run type checking before pushing:
   ```bash
   npm run build
   ```
6. Open a PR. Direct pushes to `main` are not allowed.

## 📄 License

MIT. See `LICENSE` for details.
