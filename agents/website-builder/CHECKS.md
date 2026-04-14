# Website Builder Checks

## Preconditions

- Delegation from `main` exists
- Website-facing scope is explicit
- Required design/plan gate is active

## Required Evidence

- The package manifests and dependency signals that describe the active frontend stack
- The core frontend file map for the active surface: routes, layouts, major
  components, styles, tokens, navigation
- What primary user task the page or flow serves
- CTA hierarchy and page structure decisions
- State coverage for loading, empty, error, success, disabled, or destructive states
- Responsive and accessibility implications
- MCP-backed grounding for stack-specific implementation choices

## Done Criteria

- Workspace and frontend inventory are explicit and tied to the delegated task
- Website-facing scope completed without widening
- Specialist output is ready for `main` to review
- No shipping or completion claim made directly by `website-builder`

## Red Flags

- Acting like a generic frontend builder instead of a website specialist
- Implementing outside delegated scope
- Missing state coverage or CTA hierarchy
- Claiming completion without handing back to `main`
