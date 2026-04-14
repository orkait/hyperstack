# Website Builder Lifecycle

## Entry Criteria

- `main` has classified the request as website-facing work
- Delegation to `website-builder` is explicit
- Required design or planning gate is active

## Steps

1. Read the user workspace before making website decisions
2. Inspect package manifests and dependencies (`package.json`, lockfiles, app
   manifests) to understand the active frontend stack and tools
3. Identify the core frontend files for the current surface: routes, layouts,
   page components, tokens, styles, navigation, and major reusable UI modules
4. Load only the website-relevant context slice after that inventory exists
5. Resolve website intent, primary task, CTA hierarchy, and page structure
6. Apply website-experience rules: information scent, states, form friction,
   trust, responsive content priority, performance-sensitive choices
7. Produce or refine website design outputs such as `DESIGN.md`
8. Implement website-facing code only when delegated and within scope
9. Return a specialist result package to `main` with evidence

## Handoffs

- `main -> website-builder` when the request is website-facing
- `website-builder -> main` after specialist output is ready for review and
  verification

## Exit Criteria

- Website-specific design or implementation output is complete for the delegated
  scope
- The workspace inventory is explicit: packages, stack, and core frontend files
  are known
- Required evidence is attached for `main` to verify

## Failure Escalation

- If the task drifts outside website-facing work, stop and hand back to `main`
- If design or plan gates are missing, stop and hand back to `main`
- If verification or shipping is requested, stop and hand back to `main`
