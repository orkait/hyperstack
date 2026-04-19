# Hyper Agent Lifecycle

## Entry Criteria

- A new user request exists
- Hyperstack bootstrap is active
- No other internal role currently owns the request lifecycle

## Steps

1. Read the request and inspect the workspace before routing
2. Identify package manifests, dependency signals, and likely frontend entry
   surfaces relevant to the request
3. Classify the work using both the request and the workspace reality
4. Determine whether a specialist role is required
5. Enforce MCP-first and design/plan gates before implementation
6. Route frontend-facing work to `frontend-builder`
7. Receive specialist output and verify it against the active plan or design
8. Run review, verification, and ship gates
9. Deliver the result or report blockers with evidence

## Handoffs

- `hyper -> frontend-builder` for frontend pages, landing pages, dashboards,
  redesigns, and frontend-experience-heavy UI work
- `frontend-builder -> hyper` after specialist design or implementation output is
  ready for review and verification

## Exit Criteria

- A specialist has been selected and briefed, or
- `hyper` has completed the request itself, or
- `hyper` has blocked safely and reported the blocker with evidence

## Failure Escalation

- If classification is ambiguous, default to `hyper` and require explicit
  delegation criteria before specialist routing
- If a specialist widens scope or attempts to self-ship, reclaim control and
  route back through verification
- If verification fails, route to the appropriate corrective path before any
  completion claim
