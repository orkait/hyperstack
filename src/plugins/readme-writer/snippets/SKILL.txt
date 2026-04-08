---
name: readme-evidence-writer
description: Writes or rewrites project README files using repository evidence instead of generic filler. Use when creating a new README, improving an existing README, or auditing an LLM-written README for inaccuracies, missing setup details, weak quickstarts, unclear audience fit, vague feature claims, or poor presentation choices.
license: Apache-2.0
metadata:
  author: OpenAI
  version: "1.1"
compatibility: Works best in coding agents that can inspect repository files and existing documentation. No network access is required.
---

# README evidence writer

Write README files that are specific, verifiable, and useful to the next developer.

The main failure mode of LLM-written READMEs is not grammar. It is false confidence: invented setup steps, inflated feature claims, vague value propositions, and examples that are not grounded in the repository.

This skill also applies an explicit presentation style layer inspired by the user's `~/.claude/CLAUDE.md` README rules:

- emoji on every section heading
- centered hero block with project name, tagline, and badges in `<div align="center">`
- richer, library-specific badges with logos and colors instead of generic badges
- collapsible `<details>` blocks for long lists
- human tone that sounds like a person, not a policy memo
- no walls of text - prefer tables and lists over dense paragraphs
- no em dashes - always use a regular hyphen (`-`)

The style layer is important, but accuracy still comes first. A beautiful README that lies is worse than a plain README that is correct.

## Use this skill when

- The user asks to write, rewrite, improve, or audit a `README.md`
- The repository already has code but the documentation is weak
- The existing README sounds generic, salesy, or inconsistent with the code
- The project has multiple setup paths, hidden assumptions, or environment constraints
- The agent needs to explain what is missing instead of hallucinating missing facts
- The user wants a more polished README that still stays grounded in the repo

## Core rule

Every substantive README claim must be backed by repository evidence or be explicitly labeled as an assumption, TODO, or open question.

Do not invent:

- supported platforms
- package names
- environment variables
- CLI flags
- API endpoints
- benchmark numbers
- deployment steps
- version compatibility
- feature availability
- roadmap promises

## Evidence-gathering workflow

Before writing, inspect the highest-signal sources in this order when available:

1. Package metadata and build files
   - `package.json`
   - `pyproject.toml`, `requirements.txt`, `setup.py`
   - `Cargo.toml`
   - `go.mod`
   - `pom.xml`, `build.gradle`
   - `Dockerfile`, `docker-compose.yml`
2. Executable entry points and public interfaces
   - `src/`, `cmd/`, `bin/`, `main.*`
   - exported modules and public APIs
   - CLI help text and subcommands
3. Usage evidence
   - `examples/`
   - tests that demonstrate real usage
   - scripts in CI or Makefiles
4. Existing documentation
   - current `README.md`
   - docs site content
   - `CONTRIBUTING.md`, `LICENSE`, changelog
5. Operational constraints
   - required services
   - environment variables
   - supported OS/runtime/toolchain versions

Build a short internal evidence map before drafting. Example:

- What it is: from package metadata + entrypoint names
- Who it is for: from API shape, CLI design, docs, examples
- How to install: from package manager files and lockfiles
- How to run: from scripts, tests, examples, CI
- Limitations: from TODOs, issue notes, missing integrations, platform checks

If evidence is missing, say so plainly in the README or provide a marked placeholder section.

## What usually goes wrong in LLM-written READMEs

See `references/readme-anti-patterns.md` for the detailed list. Prioritize fixing these categories:

1. **Invented reality**
   - Features are described that the repo does not implement
   - Install steps mention tools or package names absent from the repo
   - Examples use fictional commands or environment variables

2. **Weak opening**
   - The first paragraph says almost nothing concrete
   - The README does not explain what problem the project solves, for whom, and in what form (library, CLI, service, app, template)

3. **No fast path**
   - Setup exists but the quickest path to first success is buried
   - The user cannot tell what command to run first

4. **Audience mismatch**
   - The text explains basic concepts to experts or assumes expertise from beginners
   - The README does not state whether the project targets users, contributors, or operators

5. **Missing boundaries**
   - No limitations, non-goals, compatibility constraints, or required infrastructure
   - No note on current project status if the repo looks experimental or internal

6. **Unverifiable examples**
   - Code snippets do not match real APIs, filenames, imports, or flags
   - Pseudocode is presented as ready-to-run code

7. **Presentation mismatch**
   - The README ignores the desired style system
   - Long sections are not scannable
   - The tone sounds robotic or boilerplate-heavy
   - Section headings do not use icons
   - Hero content is missing or sloppy

## Drafting rules

### 1) Open with precision

The first 2-4 lines should answer:

- What is this?
- Who is it for?
- What does it help them do?
- How is it used: library, CLI, service, starter, desktop app, etc.?

Bad:

> A powerful and flexible toolkit for modern development workflows.

Better:

> `toolname` is a Rust CLI for running untrusted code inside a constrained sandbox. It is intended for agent and judge-style workloads that need process isolation, resource limits, and reproducible execution.

### 2) Use the required visual style

Unless the user asks for a different style, default to:

- a centered hero block using `<div align="center">`
- project title, one-line tagline, and curated badges in the hero block
- emoji on every major section heading
- tables for option comparison, prerequisites, or support matrices
- bullet lists instead of long explanatory paragraphs
- `<details>` blocks for long examples, install variants, integrations, or FAQ-style content

Bad:

- giant wall of prose before any runnable step
- plain top section with no visual anchor
- generic badges that could belong to any repo

Better:

- concise hero block + concrete quickstart near the top
- badges tied to actual language, package manager, version, license, docs, CI, or release channels
- collapsible sections for advanced or secondary material

### 3) Prefer a success-oriented structure

Default section order:

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

### 4) Write the quickest truthful quickstart

The quickstart should get a reader to first success in the smallest number of steps supported by the repository.

- Use real commands
- Mention prerequisites only if required
- Prefer one working path over many variants at the top
- Move advanced options later

### 5) Separate facts from assumptions

If a detail is unclear:

- either omit it
- or label it clearly as `TODO`, `Assumption`, or `Project-specific note needed`

Never guess.

### 6) Match examples to the repo

Examples must reuse:

- real binary names
- real module imports
- real file paths
- real config keys
- real environment variable names

When examples are incomplete, say they are illustrative.

### 7) State boundaries

Add a concise boundaries section when relevant:

- supported OS or runtime
- required external services
- current maturity level
- non-goals
- known limitations

### 8) Sound human, not institutional

Prefer:

- direct language
- short explanation followed by runnable detail
- confident statements only when supported by evidence

Avoid:

- over-formal policy tone
- bloated intro copy
- stock marketing adjectives
- spec-document voice unless the repo itself requires it

### 9) Remove fluff

Delete words like:

- robust
- seamless
- cutting-edge
- powerful
- modern
- enterprise-grade

unless the claim is immediately justified.

### 10) Never use em dashes

Replace em dashes with:

- a regular hyphen
- a colon
- parentheses
- a new sentence

## Presentation rules to enforce during audit

When auditing an LLM-written README, explicitly check:

- Are all major headings prefixed with an emoji?
- Is the hero block centered and visually clean?
- Are badges specific to the actual project stack and status?
- Are long sections collapsed with `<details>` where that improves scanning?
- Does the text sound like a human explaining the project?
- Are tables or lists used where they reduce text density?
- Are there any em dashes that must be replaced?

## README audit checklist

Before finalizing, verify:

- Every command appears to exist in the repo or docs
- Every package name matches the manifest or install instructions
- Every feature bullet maps to code, tests, or docs
- Every example uses existing identifiers
- The opening paragraph identifies artifact type and audience
- The quickstart is shorter than the full installation section
- Missing facts are marked, not invented
- Limitations are included where they materially affect adoption
- Contributor guidance is separated from end-user setup
- The hero block is centered and not cluttered
- Badges are curated and evidence-backed
- Major headings use icons
- Long content is collapsed where helpful
- There are no em dashes in the final output

See `references/readme-rubric.md` for the scoring rubric.

## Output modes

Choose one depending on the task.

### Mode A: New README

Produce a full README with only evidence-backed sections.

### Mode B: Rewrite existing README

Keep valid project-specific details, remove generic filler, fix ordering, tighten language, and apply the style rules above.

### Mode C: Audit an LLM-written README

Return:

1. `What is inaccurate`
2. `What is vague`
3. `What is missing`
4. `What violates the style rules`
5. `What should be reordered`
6. `Rewritten README`

## Preferred response pattern

When the user asks for a README, respond in this order:

1. A short evidence summary used for drafting
2. Any missing facts that could not be verified
3. The rewritten README
4. A short audit note listing what was fixed

## Assets and references

- Template: `assets/README.template.md`
- Anti-patterns: `references/readme-anti-patterns.md`
- Rubric: `references/readme-rubric.md`

