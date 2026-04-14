# Hyperstack Skills Index

Auto-generated from each skill's frontmatter `category` field.
Regenerate with: `bash scripts/generate-skills-index.sh`

Categories:
- **core** - workflow, discipline, and gates used on every task
- **domain** - specialized skills for specific contexts (visual, components, security, docs)
- **meta** - skills about skills (bootstrap, testing)

---

## Core (workflow + discipline)

| Skill | Description |
|---|---|
| `autonomous-mode` | Use when the user chooses fully autonomous execution. Aggressively uses the entire Hyperstack to implement the solution  |
| `blueprint` | Use before any feature build, component creation, or behaviour modification. MCP-surveyed design with a hard gate before |
| `code-review` | Use when completing tasks, implementing features, or before merging - to dispatch a review subagent and handle feedback  |
| `debug-discipline` | Use when encountering any bug, test failure, or unexpected behaviour. Root cause investigation is mandatory before any f |
| `deliver` | Use after all implementation tasks are complete. Runs final verification, confirms the branch is clean, and executes the |
| `engineering-discipline` | Apply senior-level software engineering discipline including design patterns, SOLID principles, architectural reasoning, |
| `forge-plan` | Use after blueprint design approval to produce a task-by-task implementation plan grounded in MCP-verified API calls. No |
| `parallel-dispatch` | Use when facing 2+ independent tasks that can be investigated or executed without shared state or sequential dependencie |
| `run-plan` | Use when you have an existing plan, spec, or task list to execute. Validates the plan for gaps and MCP accuracy before a |
| `ship-gate` | Use before claiming any work is complete, fixed, or passing. Run the verification command and show output before making  |
| `subagent-ops` | Use when executing implementation plans with independent tasks. Dispatches one fresh subagent per task with two-stage re |
| `test-first` | Use when implementing any feature, bug fix, or behaviour change - before writing implementation code. Enforces test-befo |
| `worktree-isolation` | Use when starting feature work that needs isolation from the current workspace, or before executing implementation plans |

## Domain (specialized context)

| Skill | Description |
|---|---|
| `behaviour-analysis` | Systematic UI/UX behaviour analysis for interactive applications. Audits every user action, state transition, view mode, |
| `designer` | Evidence-based design decision engine. Intention gate that produces non-slop |
| `design-patterns-skill` | Apply core programming principles and design patterns from Clean Code, The Pragmatic Programmer, Code Complete, Refactor |
| `readme-writer` | Writes or rewrites project README files using repository evidence instead of generic filler. Use when creating a new REA |
| `security-review` | Security code review for vulnerabilities. Use when asked to security review, find vulnerabilities, check for security is |
| `shadcn-expert` | Advanced shadcn/ui architect specializing in Base UI, Tailwind v4, data-slot patterns, and component composition. Use wh |

## Meta (skills about skills)

| Skill | Description |
|---|---|
| `testing-skills` | Use when creating or editing Hyperstack skills, before shipping them, to verify they actually work under pressure and re |
| `using-hyperstack` | Bootstrap - establishes Hyperstack MCP tools and skills before any technical work. Auto-loaded at session start via Sess |
