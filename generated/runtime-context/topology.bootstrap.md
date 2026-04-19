# Topology Runtime Bootstrap

Entry agent: hyper
Cross-domain agent: fullstack-builder
Workspace inventory required: true
Design contract is conditional

## Artifacts
- workspace_inventory: discovery_only
- task_handoff: routing_only
- design_contract: visual_contract_conditional
- build_result: executable
- verification_report: routing_and_verification

## Agents
- hyper: orchestrator -> shared
- frontend-builder: specialist -> frontend
- backend-builder: specialist -> backend
- fullstack-builder: cross-domain -> frontend, backend

## Bundles
- shared.system: system.setup
- frontend.design: design.intent, design.contract, design.tokens
- frontend.react: frontend.patterns, frontend.motion, frontend.flow
- backend.http: backend.http.patterns
- backend.lang.go: backend.go.patterns
- backend.lang.rust: backend.rust.patterns
