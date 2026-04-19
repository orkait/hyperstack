# Hyperstack: What It Is and Where It Came From

This is an internal evolution document. For the user-facing overview, read `README.md`. For the operational contract, read `SKILL.md`.

---

## 🎯 The Vision

Redefine the relationship between a human developer and an AI coding assistant. Instead of a "chat autocomplete" that guesses at APIs and ships AI-slop UIs, build a disciplined engineering appliance that transforms the LLM into a Senior Staff Engineer with encyclopedic ground-truth knowledge and enforced workflow discipline.

---

## 🛠️ What We Have Accomplished

### 1. Monorepo Consolidation
Merged two fragmented repositories (`unified-mcp` for data, `unified-skill` for persona) into a single high-cohesion repository. Hyperstack is now a **Three-Layer Ecosystem**:
- **Layer 1: Ground Truth (MCP)** - The "Brain": Deterministic data and tools
- **Layer 2: Process (Skills)** - The "Body": Disciplined engineering workflows and gates
- **Layer 3: Orchestration (Agents)** - The "Nervous System": Internal roles for routing and verification

### 2. Plugin Architecture (Encapsulation)
Every plugin is self-contained:
- `src/plugins/<name>/index.ts` registers tools
- `src/plugins/<name>/data.ts` holds typed TypeScript constants
- `src/plugins/<name>/tools/` holds one file per MCP tool
- `src/plugins/<name>/snippets/` holds raw `.txt` code examples
- **Data Integrity:** snippets are `.txt` not `.md` to prevent linter-induced formatting drift

### 3. Build-Free, Source-First Execution
- The server runs directly from `src/index.ts` via `tsx`
- No `dist/` folder, no build step for deployment
- `npm run build` is `tsc --noEmit` (type checking only)
- Any change to a snippet or a tool is immediately reflected without a build command

### 4. Agent-First Installation Pipeline
- **Zero-Install Docker:** GitHub Actions auto-publishes to `ghcr.io/orkait/hyperstack:main` on every push to main
- **Dynamic Discovery (`install.md`):** Environment-aware installation instructions written for AI agents to follow step-by-step
- **The Raw Prompt:** Users prompt their AI with *"Fetch and follow instructions from [raw URL to install.md]"* and the agent autonomously detects its environment, clones the skills, updates the MCP config, and runs verification steps

### 5. The Designer Pipeline (Flagship)
The flagship plugin + skill combination. Forces every visual design decision through industry context, cognitive science, design master principles, and anti-pattern detection before any code is generated.

- **19 MCP tools** covering:
  - 6 personality clusters (derived from 58 real company design systems)
  - 15 industry rules with must-have/never-use constraints
  - 11 cognitive laws (Fitts, Hick, Miller, Gestalt, Von Restorff, Serial Position, F-Pattern, Z-Pattern, Jakob, Doherty, Peak-End)
  - 13 page templates with section anatomy and component inventories
  - 9 code-ready presets (Linear, Stripe, Vercel, Apple, Carbon, shadcn, Notion, Supabase, Figma)
  - 21 curated font pairings with Google Fonts imports
  - 50+ anti-patterns (the AI slop fingerprint)
- **DESIGN.md contract** produced before any visual code. 10 sections: theme, colors, typography, spacing, components, motion, elevation, do's and don'ts, responsive, anti-patterns
- **Programmatic verification** via `designer_verify_implementation` that greps for the AI slop fingerprint (AI purple, cold Tailwind grey, rgba shadows, missing states, etc.) before ship-gate allows completion

### 6. The shadcn Integration (Optional, Gated)
shadcn/ui Base UI edition support is available through 5 MCP tools and a dedicated `shadcn-expert` skill. Critically, shadcn is **optional**. Designer's Q11b explicitly asks the user to pick between shadcn, raw Tailwind, Material UI, Mantine, Chakra, Ant Design, or a custom component library. `shadcn-expert` only fires when the user picked shadcn. No silent assumptions.

### 7. Adversarial Enforcement (Inspired by obra/superpowers)
Every gate skill rewritten with:
- **Iron Laws** in all-caps (NO CODE WITHOUT MCP GROUND-TRUTH DATA, NO VISUAL CODE WITHOUT AN APPROVED DESIGN.md, NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE, etc.)
- **1% Rule** - if there is even a 1% chance a skill applies, invoke it
- **Rationalization tables** listing the exact excuses the AI will use to skip the gate, with counters
- **Spirit of the rule equals letter of the rule** clause to close loophole-hunting
- **SessionStart hook** (`hooks/session-start`) that force-injects the `hyperstack` skill into every session's context, so discipline reaches the agent without manual invocation

### 8. Internal Agent Harness (Layer 3)
Hyperstack uses internal roles to manage complexity. These roles are **internal and auto-invoked**, ensuring specialists are used when necessary without shifting the burden to the user:
- **`hyper` (Core):** The conductor. Owns request classification, routing, gate enforcement, final verification, and delivery.
- **`website-builder` (Specialist):** Owns website-facing design/implementation, CTA hierarchy, and page structure. Delegates back to `hyper` for verification.

### 9. The Skill System (21 skills, 3 categories)
Every skill has a `category:` frontmatter field. The index at `skills/INDEX.md` is auto-generated from frontmatter by `bash scripts/generate-skills-index.sh`.

- **Core (13):** blueprint, forge-plan, run-plan, engineering-discipline, ship-gate, deliver, test-first, debug-discipline, code-review, autonomous-mode, subagent-ops, parallel-dispatch, worktree-isolation
- **Domain (6):** designer, shadcn-expert, behaviour-analysis, security-review, design-patterns-skill, readme-writer
- **Meta (2):** hyperstack, testing-skills

### 10. Skill Testing Discipline (`testing-skills`)
A TDD-for-skills methodology:
1. Write pressure scenarios
2. Dispatch fresh subagents WITHOUT the skill (RED phase)
3. Capture the exact rationalizations they use
4. Write the skill addressing those specific failures (GREEN phase)
5. Close loopholes (REFACTOR)

Iron Law: NO SKILL SHIPS WITHOUT SUBAGENT PRESSURE TEST EVIDENCE.

Scenario files currently exist for ship-gate, designer, and blueprint. Remaining gate skills still need their own scenarios.

### 11. Ecosystem Wiring
Every skill references its upstream and downstream edges explicitly.
- Designer hands DESIGN.md to forge-plan
- Forge-plan calls shadcn tools (if shadcn chosen) or hand-builds from DESIGN.md (if raw Tailwind)
- Ship-gate verifies DESIGN.md compliance before allowing completion claims
- `behaviour-analysis` uses DESIGN.md as expected-behavior ground truth
- Reverse escalation is explicit: forge-plan can escalate back to designer if it discovers a gap mid-plan

---

## 🧠 The "Why" Behind the Design

- **Why `.txt` instead of `.md`?** To treat code snippets as data, not prose. Prevents linter-induced hallucinations.
- **Why no `dist/` folder?** In the age of AI agents, speed of context loading is everything. Running from source guarantees the AI isn't reading stale artifacts.
- **Why bundled skills?** An AI with data but no discipline is a "Junior with a search engine." An AI with discipline but no data is a "Senior without a keyboard." Hyperstack provides both.
- **Why `install.md`?** Every AI harness (Claude Code, Cursor, Gemini CLI, Copilot CLI, etc.) is different. Abstract the installation logic so the AI decides *how* to install itself based on the system it detects.
- **Why adversarial enforcement?** Polite suggestion fails under pressure. "Maybe you should..." gets skipped when the model is rushing to be helpful. Iron Laws and rationalization counters close the loopholes before they open.
- **Why force-inject via SessionStart hook?** If the AI doesn't know the system exists, it can't use it. The hook guarantees the agent starts every session with the rules loaded.
- **Why designer as a separate plugin, not just a skill?** Design decisions are data, not prose. Personalities, industry rules, cognitive laws, and anti-patterns are queryable facts that the AI needs to call, not a document it reads once.
- **Why is shadcn optional?** Not every project uses shadcn. Silently assuming it produces AI-slop defaults. Q11b forces the user to explicitly pick.

---

## 🚀 Current Status

**Active development.** Main branch is stable and the Docker image publishes automatically on push.

Eleven plugins, seventy-nine tools, twenty-one skills, and two internal agents (`hyper` and `website-builder`). The SessionStart hook is wired. The adversarial enforcement is in place. The designer pipeline works end-to-end (verified via test harness). shadcn is integrated as an optional choice.

### Remaining work
- More pressure-test scenarios for gate skills (forge-plan, engineering-discipline, behaviour-analysis, test-first)
- Additional backend-focused loops (API-build workflow, security-audit loop)
- End-to-end integration tests beyond the designer pipeline
- More curated components in the shadcn plugin (currently 4: Button, Dialog, Field, Select)
