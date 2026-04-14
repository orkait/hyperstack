# Hyperstack Excellence Roadmap

## Goal

Evolve Hyperstack into an AI-designer and AI-coder framework that is:

- grounded in deterministic MCP data
- disciplined enough to actually follow its workflows
- strong on website experience, not only visual style
- tested against real agent failure modes, not just happy-path tool outputs

## Executive Summary

Hyperstack already has stronger semantic grounding than most agent frameworks.
Its designer, design-token, UI/UX, shadcn, React Flow, Motion, Lenis, Echo, Go,
and Rust plugins make it unusually good at producing domain-aware outputs.

What it lacks relative to Superpowers is enforcement confidence. Hyperstack has
good gates, but weaker proof that agents actually obey them under realistic
prompts.

What it lacks relative to the VoltAgent ecosystem is ecosystem leverage:

- large-scale skill and subagent pattern curation
- design-contract libraries at scale
- clearer interoperability and packaging patterns
- stronger observability and evaluation framing

## Current Position

### Hyperstack Strengths

- Strong MCP-first philosophy
- Excellent `DESIGN.md` contract idea
- Programmatic compliance checking via `designer_verify_implementation`
- Better domain depth than generic workflow-only systems
- Good anti-slop language and visual quality bias

### Hyperstack Weaknesses

- Limited regression tests for skill triggering and premature action
- Limited enforcement tests for cross-harness bootstrap behavior
- Website experience guidance is under-specified compared to visual styling
- Design and implementation document review is weaker than it should be
- Limited observability and evaluation surfaces for skill adherence

## What to Learn from Superpowers

Source repo:

- https://github.com/obra/superpowers

### 1. Test the Enforcement, Not Just the Output

Superpowers directly tests:

- naive prompt -> expected skill trigger
- explicit skill request -> expected skill trigger
- no tool use before skill invocation
- multi-step workflow integration in realistic sandboxes

Hyperstack should add:

- `tests/skill-triggering/`
- `tests/explicit-skill-requests/`
- premature-action detection in logs
- at least one end-to-end workflow test for:
  - visual request -> `designer` -> `forge-plan`
  - backend request -> `blueprint` -> `forge-plan`

### 2. Treat Bootstrap as Product Infrastructure

Superpowers invests heavily in making bootstrap unavoidable across harnesses.
Hyperstack should improve:

- Codex-specific bootstrap/install guidance
- OpenCode bootstrap path
- startup tests for every supported harness

### 3. Separate Workflow Discipline from Domain Knowledge

Superpowers is very strong at:

- brainstorming
- planning
- TDD
- debugging
- review
- branch completion

Hyperstack should keep its domain depth, but borrow stronger workflow evals and
document-review loops.

## What to Learn from VoltAgent

Key current repos:

- https://github.com/orgs/VoltAgent/repositories?type=all
- https://github.com/VoltAgent/voltagent
- https://github.com/VoltAgent/awesome-design-md
- https://github.com/VoltAgent/awesome-agent-skills
- https://github.com/VoltAgent/awesome-claude-code-subagents
- https://github.com/VoltAgent/awesome-codex-subagents
- https://github.com/VoltAgent/vercel-ai-sdk-observability

### 1. DESIGN.md as a Distribution Format

VoltAgent's `awesome-design-md` validates that design contracts are now a
portable ecosystem artifact, not just an internal trick.

Hyperstack opportunity:

- ship a curated library of Hyperstack-native DESIGN.md exemplars
- provide quality-scored examples by industry and page type
- add "reference designs" users can adopt before customization

### 2. Skill and Subagent Interoperability

VoltAgent's skills and subagent repos show that discoverability, path
conventions, packaging, and naming matter.

Hyperstack opportunity:

- formalize compatibility targets by harness
- publish a clearer "skill ABI" and "subagent ABI"
- document path conventions and install surfaces like a platform, not a repo

### 3. Observability Matters

VoltAgent's observability work suggests a missing layer for Hyperstack:

- trace which skills fired
- trace which MCP tools were used
- trace whether required gates were skipped
- collect evaluation fixtures for agent behavior quality

Hyperstack opportunity:

- add lightweight execution traces for:
  - bootstrap injection
  - required skill invocation
  - MCP tool usage before code generation
  - verification before completion

### 4. Ecosystem Curation Beats Reinvention

VoltAgent's awesome lists prove that the ecosystem is a source of reusable
patterns, not noise.

Hyperstack opportunity:

- curate approved external design references
- curate approved external skills and subagents
- maintain a security review note for third-party imports

## What to Learn from Website Experience Standards

Key sources:

- https://web.dev/articles/lcp
- https://web.dev/inp/
- https://web.dev/optimize-cls
- https://web.dev/articles/rendering-performance
- https://web.dev/articles/codelab-address-form-best-practices
- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- https://www.nngroup.com/videos/mobile-images/

### Hyperstack Must Treat These as Design Inputs

- Core Web Vitals are website experience, not just engineering metrics:
  - LCP <= 2.5s
  - INP <= 200ms
  - CLS <= 0.1
- Website experience includes:
  - information scent
  - CTA hierarchy
  - task flow clarity
  - form friction
  - error recovery
  - accessible authentication
  - focus safety
  - target sizing
  - reduced motion
  - responsive content priority

## Recommended Roadmap

### Phase 1 - Enforcement Hardening

Target: Make Hyperstack provably harder to bypass.

Add:

- skill-triggering tests modeled on Superpowers
- explicit skill request tests
- premature-action tests
- bootstrap tests for supported harnesses

Files to add:

- `tests/skill-triggering/`
- `tests/explicit-skill-requests/`
- `tests/harness-bootstrap/`

### Phase 2 - Website Experience as First-Class Design

Target: Upgrade `designer` from visual style engine to website experience engine.

Add:

- website-experience reference material
- explicit website-experience checklist in `designer`
- stronger `DESIGN.md` requirements for:
  - state coverage
  - CTA hierarchy
  - auth friction
  - performance budgets
  - responsive content priority

### Phase 3 - Spec and Plan Review Systems

Target: Catch bad design docs and bad plans before execution.

Add:

- `designer_review_design_md`
- `forge-plan` document review loop
- tests with intentionally bad specs and plans

### Phase 4 - Observability and Eval Layer

Target: Know whether Hyperstack is being followed in reality.

Add:

- skill invocation traces
- MCP usage traces
- compliance summaries
- harness-specific eval fixtures

Potential outputs:

- machine-readable gate events
- eval dashboards
- regression fixtures for prompts that commonly bypass discipline

### Phase 5 - Curated Design and Subagent Libraries

Target: Make good defaults easy to start from.

Add:

- `examples/design-md/` library
- `examples/subagents/` library
- quality-scored starter packs by industry and stack

## Immediate Action Items

1. Add skill-trigger and premature-action tests.
2. Expand `designer` with website-experience requirements.
3. Add design/plan review loops before implementation.
4. Add lightweight observability around gate adherence.
5. Publish a curated set of Hyperstack-native DESIGN.md exemplars.

## Success Criteria

Hyperstack is "excellent" when:

- agents reliably invoke the right skill before acting
- agents use MCP tools before stack-specific code generation
- visual work always yields a coherent, approved `DESIGN.md`
- implementation can be checked against that contract
- website experience quality is explicit, measurable, and enforced
- regressions in behavior are caught by tests, not user frustration
