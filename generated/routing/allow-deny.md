# Allow / Deny Matrix

## hyper
- Allowed: shared.system
- Forbidden: 
- Allowed Skills: blueprint, forge-plan, run-plan, parallel-dispatch, subagent-ops, autonomous-mode, ship-gate, code-review, deliver
- Completion Proof: routing_and_verification

## frontend-builder
- Allowed: frontend.design, frontend.react
- Forbidden: backend.http, backend.lang.go, backend.lang.rust
- Allowed Skills: test-first, debug-discipline, engineering-discipline, worktree-isolation, designer, behaviour-analysis, shadcn-expert
- Completion Proof: visual_and_behavioral

## backend-builder
- Allowed: backend.http, backend.lang.go, backend.lang.rust
- Forbidden: frontend.design, frontend.react
- Allowed Skills: test-first, debug-discipline, engineering-discipline, worktree-isolation, security-review
- Completion Proof: executable

## fullstack-builder
- Allowed: frontend.design, frontend.react, backend.http, backend.lang.go, backend.lang.rust
- Forbidden: 
- Allowed Skills: test-first, debug-discipline, engineering-discipline, worktree-isolation, designer, behaviour-analysis, shadcn-expert, security-review
- Completion Proof: strictest_touched_domain
