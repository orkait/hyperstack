# Frontend Builder Lifecycle

## Entry Criteria

- `hyper` has classified the request as frontend work
- Delegation to `frontend-builder` is explicit
- Required planning or design gates are active

## Steps

1. Read the user workspace before making frontend decisions
2. Inspect package manifests and dependencies (`package.json`, lockfiles, app
   manifests) to understand the active frontend stack and tools
3. Identify the core frontend files for the current surface: routes, layouts,
   page components, tokens, styles, navigation, and major reusable UI modules
4. Load only the frontend-relevant context slice after that inventory exists
5. Resolve whether the task is existing-project frontend logic, frontend visual
   change, or a new surface
6. Use existing patterns first when they are trustworthy
7. Produce or refine frontend design outputs only when the route requires a
   design contract
8. Implement frontend code only when delegated and within scope
9. Return a specialist result package to `hyper` with evidence

## Handoffs

- `hyper -> frontend-builder` when the request is frontend-facing
- `frontend-builder -> hyper` after specialist output is ready for review and
  verification

## Exit Criteria

- Frontend-specific design or implementation output is complete for the
  delegated scope
- The workspace inventory is explicit: packages, stack, and core frontend files
  are known
- Required evidence is attached for `hyper` to verify

## Failure Escalation

- If the task drifts outside frontend work, stop and hand back to `hyper`
- If planning or proof gates are missing, stop and hand back to `hyper`
- If verification or shipping is requested, stop and hand back to `hyper`
