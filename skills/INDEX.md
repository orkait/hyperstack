# Hyperstack Skills Index

Auto-generated from each skill's frontmatter `category` field.
Regenerate with: `bun scripts/generate-skills-index.ts` or `npm run skills:index`

Categories:
- **core** - workflow, discipline, and gates used on every task
- **domain** - specialized skills for specific contexts (visual, components, security, docs)
- **meta** - skills about skills (bootstrap, testing)

---

## Core (workflow + discipline)

| Skill | Description |
|---|---|
| `autonomous-mode` | Use when the user chooses fully autonomous execution. Aggressively uses the entire Hyperstack to implement the solution  |
| `blueprint` | Execute before any feature build, component creation, or behavior change. Performs MCP survey and enforces a hard design |
| `code-review` | Use when completing tasks, implementing features, or before merging - to dispatch a review subagent and handle feedback  |
| `debug-discipline` | Use when encountering any bug, test failure, or unexpected behaviour. Root cause investigation is mandatory before any f |
| `deliver` | Use after all implementation tasks are complete. Runs final verification, confirms the branch is clean, and executes the |
| `engineering-discipline` | Apply senior-level software engineering discipline including design patterns, SOLID principles, architectural reasoning, |
| `forge-plan` | Executed after blueprint/designer approval. Produces task-by-task implementation plan grounded in MCP-verified APIs. Zer |
| `parallel-dispatch` | Use when facing 2+ independent tasks that can be investigated or executed without shared state or sequential dependencie |
| `run-plan` | Use when you have an existing plan, spec, or task list to execute. Validates the plan for gaps and MCP accuracy before a |
| `ship-gate` | Execute before claiming work is complete, fixed, or passing. Run the verification command and show output. No evidence = |
| `subagent-ops` | Use when executing implementation plans with independent tasks. Dispatches one fresh subagent per task with two-stage re |
| `test-first` | Use when implementing any feature, bug fix, or behaviour change - before writing implementation code. Enforces test-befo |
| `worktree-isolation` | Use when starting feature work that needs isolation from the current workspace, or before executing implementation plans |

## Domain (specialized context)

| Skill | Description |
|---|---|
| `behaviour-analysis` | Systematic UI/UX behaviour analysis for interactive applications. Audits every user action, state transition, view mode, |
| `designer` |  |
| `readme-writer` | Writes or rewrites project README files using repository evidence instead of generic filler. Use when creating a new REA |
| `security-review` | Security code review for vulnerabilities. Use when asked to "security review", "find vulnerabilities", "check for securi |
| `shadcn-expert` | Advanced shadcn/ui architect specializing in Base UI, Tailwind v4, data-slot patterns, and component composition. Use wh |

## Meta (skills about skills)

| Skill | Description |
|---|---|
| `hyperstack` | Bootstrap definitions establishing MCP tools and skills prior to work. Auto-loaded at session start. Do not bypass or ra |
| `testing-skills` | Use when creating or editing Hyperstack skills, before shipping them, to verify they actually work under pressure and re |


