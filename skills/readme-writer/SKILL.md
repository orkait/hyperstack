---
name: readme-evidence-writer
category: domain
description: Writes or rewrites project README files using repository evidence instead of generic filler. Use when creating a new README, improving an existing README, or auditing an LLM-written README for inaccuracies, missing setup details, weak quickstarts, unclear audience fit, vague feature claims, or poor presentation choices.
license: Apache-2.0
metadata:
  author: OpenAI
  version: "1.1"
compatibility: Works best in coding agents that can inspect repository files and existing documentation. No network access is required.
---

# README Evidence Writer

Write README files that are specific, verifiable, and useful to the next developer.

Main failure mode of LLM-written READMEs: false confidence - invented setup steps, inflated feature claims, vague value propositions, examples not grounded in the repository.

**Style layer (from CLAUDE.md rules):**
- Emoji on every section heading
- Centered hero block with project name, tagline, and badges in `<div align="center">`
- Library-specific badges with colors and logos (not generic)
- Collapsible `<details>` blocks for long lists
- Human tone - sounds like a person, not a spec doc
- No walls of text - prefer tables and lists over paragraphs
- No em dashes - use a regular hyphen (`-`) instead

Accuracy comes first. A beautiful README that lies is worse than a plain README that is correct.

## When to Use

- User asks to write, rewrite, improve, or audit a `README.md`
- Repo has code but documentation is weak
- Existing README sounds generic, salesy, or inconsistent with the code
- Project has multiple setup paths, hidden assumptions, or environment constraints
- User wants a polished README that stays grounded in the repo

## Core Rule

Every substantive README claim must be backed by repository evidence or explicitly labeled as an assumption, TODO, or open question.

Do not invent: supported platforms, package names, environment variables, CLI flags, API endpoints, benchmark numbers, deployment steps, version compatibility, feature availability, roadmap promises.

## Evidence-Gathering Workflow

Inspect highest-signal sources in this order:

1. Package metadata and build files (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Dockerfile`)
2. Executable entry points and public interfaces (`src/`, `cmd/`, `bin/`, exported modules, CLI help text)
3. Usage evidence (`examples/`, tests that demonstrate real usage, scripts in CI or Makefiles)
4. Existing documentation (current `README.md`, docs site, `CONTRIBUTING.md`, `LICENSE`, changelog)
5. Operational constraints (required services, environment variables, supported OS/runtime/toolchain versions)

Build a short internal evidence map before drafting:
- What it is → from package metadata + entrypoint names
- Who it is for → from API shape, CLI design, docs, examples
- How to install → from package manager files and lockfiles
- How to run → from scripts, tests, examples, CI
- Limitations → from TODOs, issue notes, missing integrations, platform checks

Missing evidence → say so plainly or provide a marked placeholder section.

## What Usually Goes Wrong in LLM-Written READMEs

See `references/readme-anti-patterns.md` for the full list. Prioritize fixing:

1. **Invented reality** → features described that don't exist, install steps with absent tools, fictional commands
2. **Weak opening** → first paragraph says almost nothing concrete, doesn't explain what problem it solves, for whom, in what form
3. **No fast path** → setup exists but quickest path to first success is buried
4. **Audience mismatch** → explains basic concepts to experts or assumes expertise from beginners
5. **Missing boundaries** → no limitations, non-goals, compatibility constraints, or required infrastructure
6. **Unverifiable examples** → code snippets don't match real APIs, filenames, imports, or flags
7. **Presentation mismatch** → ignores desired style system, long sections not scannable, robotic tone

## Drafting Rules

### 1. Open with precision

First 2-4 lines answer:
- What is this?
- Who is it for?
- What does it help them do?
- How is it used: library, CLI, service, starter, desktop app?

Bad: "A powerful and flexible toolkit for modern development workflows."
Better: "`toolname` is a Rust CLI for running untrusted code inside a constrained sandbox. Intended for agent and judge-style workloads that need process isolation, resource limits, and reproducible execution."

### 2. Use the required visual style

- Centered hero block using `<div align="center">`
- Project title, one-line tagline, and curated badges in the hero block
- Emoji on every major section heading
- Tables for option comparison, prerequisites, or support matrices
- Bullet lists instead of long explanatory paragraphs
- `<details>` blocks for long examples, install variants, integrations, or FAQ-style content

### 3. Default section order

1. Hero block
2. Quick project description
3. Quickstart
4. Key capabilities
5. Installation
6. Usage examples
7. Configuration or architecture (only if needed)
8. Limitations or compatibility notes
9. Contributing
10. License

Only include sections that add practical value.

### 4. Write the quickest truthful quickstart

- Use real commands
- Mention prerequisites only if required
- Prefer one working path over many variants at the top
- Move advanced options later

### 5. Separate facts from assumptions

Unclear detail → either omit it or label clearly as `TODO`, `Assumption`, or `Project-specific note needed`. Never guess.

### 6. Match examples to the repo

Examples must reuse real binary names, real module imports, real file paths, real config keys, real environment variable names. Incomplete examples → say they are illustrative.

### 7. State boundaries

Add a concise boundaries section when relevant: supported OS or runtime, required external services, current maturity level, non-goals, known limitations.

### 8. Sound human, not institutional

Prefer direct language, short explanation followed by runnable detail, confident statements only when supported by evidence.

Delete: robust, seamless, cutting-edge, powerful, modern, enterprise-grade (unless immediately justified).

### 9. Never use em dashes

Replace with: a regular hyphen, a colon, parentheses, or a new sentence.

## Presentation Audit Checks

- All major headings prefixed with an emoji?
- Hero block centered and visually clean?
- Badges specific to the actual project stack and status?
- Long sections collapsed with `<details>` where helpful?
- Text sounds like a human explaining the project?
- Tables or lists used where they reduce text density?
- No em dashes?

## README Audit Checklist

- Every command appears to exist in the repo or docs
- Every package name matches the manifest or install instructions
- Every feature bullet maps to code, tests, or docs
- Every example uses existing identifiers
- Opening paragraph identifies artifact type and audience
- Quickstart is shorter than the full installation section
- Missing facts are marked, not invented
- Limitations included where they materially affect adoption
- Contributor guidance separated from end-user setup
- Hero block centered and not cluttered
- Badges are curated and evidence-backed
- Major headings use icons
- Long content collapsed where helpful
- No em dashes in the final output

See `references/readme-rubric.md` for the scoring rubric.

## Output Modes

**Mode A: New README** → full README with only evidence-backed sections

**Mode B: Rewrite existing README** → keep valid project-specific details, remove generic filler, fix ordering, tighten language, apply style rules

**Mode C: Audit an LLM-written README** → return:
1. What is inaccurate
2. What is vague
3. What is missing
4. What violates the style rules
5. What should be reordered
6. Rewritten README

## Preferred Response Pattern

1. Short evidence summary used for drafting
2. Any missing facts that could not be verified
3. The rewritten README
4. Short audit note listing what was fixed

## Assets and References

- Template: `assets/README.template.md`
- Anti-patterns: `references/readme-anti-patterns.md`
- Rubric: `references/readme-rubric.md`


## Lifecycle Integration

### Agent Workflow Chains

**Documentation task (standalone):**
```
user request → readme-writer (THIS) → [evidence gathering] → [README.md output]
```

**Post-delivery documentation:**
```
deliver → readme-writer (if README needed)
```

### Upstream Dependencies
- Repository with code but weak/missing documentation
- User request to write/improve/audit README

### Downstream Consumers
- None (documentation task)

### Evidence Sources
- Package metadata (package.json, Cargo.toml, etc.)
- Executable entry points (src/, cmd/, bin/)
- Usage evidence (examples/, tests, CI scripts)
- Existing docs (current README, CONTRIBUTING, LICENSE)
