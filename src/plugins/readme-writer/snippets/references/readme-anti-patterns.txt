# README anti-patterns to catch in LLM output

## 1. Hallucinated setup

Signs:
- Mentions package managers not used in the repo
- References `.env` keys not present in code or examples
- Includes commands for binaries that do not exist

Fix:
- Derive setup from manifests, Dockerfiles, scripts, CI, and examples
- Mark unknown setup steps explicitly instead of guessing

## 2. Generic value proposition

Signs:
- Uses words like "powerful", "modern", or "flexible" without concrete detail
- Does not identify whether the project is a library, CLI, service, or app

Fix:
- Name the artifact type, primary use case, and intended audience in the opening paragraph

## 3. Missing first-success path

Signs:
- Installation is long but there is no smallest working example
- The reader cannot tell which command to run first

Fix:
- Add a Quickstart that reaches a visible outcome in the fewest truthful steps

## 4. Feature inflation

Signs:
- README promises integrations, scale, performance, or compatibility not evidenced in code
- Roadmap items are presented as current features

Fix:
- Split current capabilities from future work and non-goals

## 5. Fake examples

Signs:
- Snippets import non-existent modules
- Commands use unsupported flags
- API examples omit required parameters visible in tests or source

Fix:
- Base examples on actual tests, examples, or public entrypoints

## 6. Audience confusion

Signs:
- User setup and contributor setup are mixed together
- Intro is too basic for a niche tool or too advanced for a starter library

Fix:
- Decide whether the README is primarily for adopters, operators, or contributors
- Add a separate contributing section when needed

## 7. Missing constraints

Signs:
- No runtime, OS, version, service, or hardware assumptions are stated
- Experimental projects present themselves as stable

Fix:
- Include compatibility, maturity, and limitation notes when they materially affect adoption

## 8. Robotic tone

Signs:
- Sounds like a compliance document or generated boilerplate
- Uses stiff transitions and repetitive phrasing
- Reads like it was written for no one in particular

Fix:
- Write like a human explaining the repo to another developer
- Prefer direct sentences, lists, and concrete guidance

## 9. Visual style drift

Signs:
- No centered hero block
- Headings have no emoji icons
- Badges are generic or irrelevant
- Dense sections are not collapsed
- Large text slabs appear where a table or list would scan better

Fix:
- Use a centered `<div align="center">` hero section
- Add emoji to all major headings
- Keep only badges that communicate real stack, status, package, CI, docs, or license info
- Use `<details>` for long lists, optional paths, or advanced examples
- Convert dense prose into tables or bullets when possible

## 10. Badge clutter

Signs:
- Top section is crowded with decorative badges
- Badges do not communicate useful repo-specific information
- Multiple badges repeat the same meaning

Fix:
- Keep badges curated and specific
- Favor library, language, package manager, CI, release, docs, and license badges that reflect real repo state
- Remove decorative filler badges

## 11. Typography policy violations

Signs:
- Em dashes appear in the final README
- Heading style is inconsistent

Fix:
- Replace em dashes with regular hyphens, colons, parentheses, or sentence breaks
- Apply one consistent heading style across the file
