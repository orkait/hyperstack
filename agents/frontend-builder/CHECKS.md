# Frontend Builder Checks

## Preconditions

- Delegation from `hyper` exists
- Frontend scope is explicit
- Required plan/design gate is active

## Required Evidence

- The package manifests and dependency signals that describe the active frontend stack
- The core frontend file map for the active surface: routes, layouts, major
  components, styles, tokens, navigation
- Whether the task is existing-pattern frontend logic, frontend visual change,
  or a new surface
- State coverage for loading, empty, error, success, disabled, or destructive states
- Responsive and accessibility implications
- MCP-backed grounding for stack-specific implementation choices

## Done Criteria

- Workspace and frontend inventory are explicit and tied to the delegated task
- Frontend scope completed without widening
- Specialist output is ready for `hyper` to review
- No shipping or completion claim made directly by `frontend-builder`

## Red Flags

- Acting like a page-only website builder instead of a frontend specialist
- Implementing outside delegated scope
- Missing state coverage or proof requirements
- Claiming completion without handing back to `hyper`
