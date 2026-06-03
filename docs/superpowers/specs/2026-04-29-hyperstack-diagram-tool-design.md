# Hyperstack Diagram Tool Design Spec

Date: 2026-04-29
Target skill: `hyperstack:hyperstack`
Status: Draft for user review

## Purpose

Add first-class diagram support to Hyperstack as a generic diagram capability, using `cathrynlavery/diagram-design` as the source reference for diagram grammar and taste gates while adapting it to Hyperstack's three-layer model.

The result must guide agents through the full diagram lifecycle:

1. Decide whether a diagram is warranted.
2. Select the right diagram type.
3. Select the right output format and style profile.
4. Create the diagram artifact.
5. Integrate it into the target README, docs page, app page, or asset tree.
6. Verify readability, references, and placement before reporting completion.

This is not a rustbox-branded tool. Any terminal or box-drawing look is an optional style profile, not the identity of the system.

## Source Evidence

The upstream `diagram-design` repository contains enough reference material for diagram grammar:

- `skills/diagram-design/SKILL.md`: type selection, complexity budget, semantic style roles, anti-patterns, pre-output checklist.
- `skills/diagram-design/references/type-*.md`: layout conventions and anti-patterns for architecture, flowchart, sequence, state, ER, timeline, swimlane, quadrant, nested, tree, layers, venn, and pyramid diagrams.
- `skills/diagram-design/references/style-guide.md`: semantic token model.
- `skills/diagram-design/references/onboarding.md`: project-style onboarding flow.
- `skills/diagram-design/assets/*.html`: standalone HTML/SVG examples and templates.

What upstream does not provide:

- Hyperstack MCP plugin wiring.
- Hyperstack skill index and bootstrap updates.
- Generic style-profile architecture.
- Markdown/text diagram integration rules.
- Repository integration workflow for updating consuming docs/pages.
- Tests for Hyperstack plugin and skill registration.

## Product Contract

Hyperstack will expose diagram support through both:

- Layer 1 MCP ground truth: a `diagram` plugin with deterministic `diagram_*` tools.
- Layer 2 process: a `diagram-tool` skill that agents invoke when creating or integrating diagrams.

The `hyperstack:hyperstack` bootstrap must list the diagram namespace as a must-call-first MCP domain and route diagram work to the diagram skill before file generation.

## Scope

In scope:

- Add a generic diagram domain to Hyperstack.
- Add a domain skill for diagram creation and integration.
- Add MCP tools that return diagram types, style profiles, templates, integration recipes, and checklists.
- Support both visual diagrams and documentation-native text diagrams.
- Adapt upstream type grammar and anti-patterns without copying its hard-coded editorial identity as the only style.
- Update bootstrap documentation so agents know diagram work is first-class.

Out of scope for the first implementation:

- A browser-based diagram editor.
- Automatic screenshot rendering or PNG export.
- Full brand extraction/onboarding from arbitrary websites.
- Rebuilding the upstream gallery inside Hyperstack.
- Generating diagrams from natural language via a layout solver.

## Architecture

### MCP Plugin

Create `src/plugins/diagram/` with curated data and tool registrations.

Initial tools:

| Tool | Purpose |
|---|---|
| `diagram_list_types` | List supported diagram types with use cases and limits. |
| `diagram_get_type` | Return grammar, layout rules, anti-patterns, and complexity limits for one type. |
| `diagram_list_style_profiles` | List available style profiles. |
| `diagram_get_style_profile` | Return tokens and constraints for one style profile. |
| `diagram_get_integration_recipe` | Return placement and embedding rules for README, docs, app asset, and standalone artifact targets. |
| `diagram_get_template` | Return a starter template for a diagram type, output format, and style profile. |
| `diagram_get_checklist` | Return pre-output and integration verification checklist. |
| `diagram_search_docs` | Search diagram rules by keyword. |

Tool output must be deterministic text, not generated prose. Templates should be small enough to serve as scaffolds, not full example galleries.

### Skill

Create `skills/diagram-tool/SKILL.md`.

Skill responsibilities:

- Gate diagram usage: if prose or a table communicates better, do not draw.
- Call `diagram_*` MCP tools before designing a diagram.
- Load only the relevant diagram-type reference.
- Choose output format based on the integration target.
- Create the artifact in the right project location.
- Update the consuming document or page.
- Verify final references and readability.

The skill should be domain category `domain` and included in `skills/INDEX.md`.

### Bootstrap Changes

Update `skills/hyperstack/SKILL.md`:

- Add `diagram_*` to Layer 1 MCP tools.
- Add `hyperstack:diagram-tool` to support/domain skills.
- Add a red flag for "I'll just draw it from memory".
- Clarify that diagram work is visual/content architecture work and must use the diagram domain before artifact creation.

Regenerate `generated/runtime-context/hyperstack.bootstrap.md` after changing the bootstrap skill.

## Diagram Types

Supported types for the first implementation:

- Architecture: components and connections in a system.
- Flowchart: decision logic and branching.
- Sequence: time-ordered messages between actors.
- State machine: states, transitions, guards.
- ER/data model: entities, fields, relationships.
- Timeline: events on a time axis.
- Swimlane: cross-functional process with handoffs.
- Quadrant: two-axis positioning or prioritization.
- Nested: containment and scope boundaries.
- Tree: parent-child hierarchy.
- Layers: stacked abstractions.
- Venn: set overlap.
- Pyramid/funnel: ranked hierarchy or conversion drop-off.

Each type must define:

- Best use cases.
- When not to use it.
- Layout conventions.
- Complexity limits.
- Type-specific anti-patterns.
- Required labels or legends.
- Template support for at least HTML/SVG and Markdown text where applicable.

## Output Formats

The diagram tool chooses format by consumer, not by agent preference.

| Format | Use when |
|---|---|
| Markdown fenced text | README, ADRs, changelogs, terminal-first docs, small architecture sketches. |
| Standalone HTML with inline SVG | Rich docs, blog-style docs, screenshots, design reviews, browser inspection. |
| Inline SVG fragment | App/public asset pipelines or pages that already own surrounding HTML. |
| Markdown image/link reference | When a generated SVG/HTML artifact should be linked from docs. |

Every output format requires integration. Dropping a file without updating the consuming document or page is incomplete.

## Style Profiles

The core tool must be style-agnostic. Style profiles provide constraints without changing diagram grammar.

Initial profiles:

| Profile | Purpose |
|---|---|
| `neutral-html-svg` | Conservative default for standalone HTML/SVG. |
| `docs-minimal` | Low-chrome diagrams for technical documentation. |
| `terminal-box` | Monospace, Unicode box-drawing first, ASCII fallback available. |
| `editorial` | Adapted from upstream diagram-design, with semantic tokens and limited accent use. |
| `custom-project-style` | Project-defined semantic roles, used only when a local style guide exists. |

The `terminal-box` profile is optional. It must not become the default identity of the diagram tool.

## Integration Recipes

`diagram_get_integration_recipe` must support these targets:

- `readme`: place small Markdown diagrams inline; place larger HTML/SVG artifacts under `docs/diagrams/` or an existing docs asset path, then link from README.
- `docs`: place artifacts near the consuming document or under a local `diagrams/` folder; use relative links.
- `app-public-asset`: place SVG/HTML under the app's public/static asset directory and update the importing page/component.
- `standalone`: create a self-contained artifact and provide its path; include enough title/caption text inside the artifact to make it understandable on its own.
- `adr`: prefer Markdown text diagrams unless the relationship density requires SVG.

Integration must include:

- Relative link or import update.
- Caption or short explanatory sentence.
- Alt text where the host format supports it.
- No broken references.

## Quality Gates

Before producing a diagram:

- Confirm a diagram is better than prose/table.
- Confirm the diagram type fits the data.
- Call the relevant `diagram_*` MCP tool.
- Keep within the complexity budget.
- Use one dominant visual grammar; do not hybridize diagram types.
- Do not use color as the only signal.

Before reporting completion:

- Verify the artifact file exists.
- Verify the consuming document/page references it.
- Verify relative links resolve.
- Verify text is readable in the target medium.
- Verify Markdown text diagrams use a fenced code block and fixed-width alignment.
- Verify HTML/SVG diagrams are self-contained unless intentionally integrated into an app pipeline.

## Error Handling

If a requested diagram exceeds complexity limits:

- Split it into overview and detail diagrams, or ask the user to choose the focal story.

If the target integration location is ambiguous:

- Prefer existing docs conventions if present.
- Otherwise use `docs/diagrams/` for standalone artifacts.

If the requested style conflicts with readability:

- Preserve readability and explain the rejected style move.

If Unicode box drawing may not render correctly:

- Use ASCII fallback or HTML/SVG instead.

## Tests

Implementation must add or update tests for:

- Plugin registry includes the `diagram` namespace.
- No duplicate MCP tool names.
- Each `diagram_*` tool returns non-empty deterministic content.
- `skills/INDEX.md` includes `diagram-tool`.
- `generated/runtime-context/hyperstack.bootstrap.md` stays in sync after bootstrap changes.
- `diagram_get_type` handles all supported diagram types.
- `diagram_get_integration_recipe` handles all supported targets.

Manual verification should include generating one small Markdown text diagram and one standalone HTML/SVG template, then confirming both can be integrated into a sample document path.

## Negative Doubt

Failure modes and mitigations:

- Agents create attractive but unintegrated files.
  - Mitigation: diagram skill defines integration as part of completion; checklist requires reference verification.
- Agents copy upstream editorial styling as the only identity.
  - Mitigation: bootstrap and MCP describe generic style profiles; editorial is one profile.
- Agents use diagrams when tables would be clearer.
  - Mitigation: diagram gate requires prose/table comparison before drawing.
- Agents overload one diagram with too many nodes.
  - Mitigation: per-type complexity limits from MCP; split overview/detail when exceeded.
- Markdown text diagrams break in proportional contexts.
  - Mitigation: fenced code block requirement and integration recipe validation.
- Unicode box drawing fails in a target renderer.
  - Mitigation: ASCII fallback and HTML/SVG alternative.
- Bootstrap grows too large.
  - Mitigation: only add diagram routing summary to `hyperstack:hyperstack`; keep detailed rules in `diagram-tool` and `diagram_*` MCP output.
- MCP tools become template generators with stale examples.
  - Mitigation: keep templates minimal and rule-driven; add tests for supported type coverage.

## Rollout Plan

1. Add `src/plugins/diagram/` with data, loader, tools, and registry wiring.
2. Add `skills/diagram-tool/SKILL.md` and concise references.
3. Update `skills/hyperstack/SKILL.md` to route diagram work.
4. Regenerate `skills/INDEX.md`.
5. Regenerate runtime bootstrap context.
6. Add tests for plugin registration, tool coverage, skill index, and bootstrap sync.
7. Run `bun test` and `bun run build`.

## User Review Gate

This spec must be reviewed before implementation starts. The next step after approval is an implementation plan grounded in the new spec and the existing Hyperstack plugin/skill patterns.
