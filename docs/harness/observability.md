# Harness Observability

## V1 Event Contract

Future harness traces should emit these event names:

- `request_classified`
- `role_selected`
- `role_handoff`
- `required_skill_invoked`
- `required_mcp_tool_invoked`
- `verification_gate_entered`
- `verification_gate_passed`
- `verification_gate_failed`

## V1 Scope

No external telemetry backend is required in v1. This file defines the event
contract so future traces and tests can rely on stable names.
