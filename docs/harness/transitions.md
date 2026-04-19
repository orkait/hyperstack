# Harness Transitions

## Allowed

- `user request -> hyper`
- `hyper -> frontend-builder`
- `frontend-builder -> hyper`
- `hyper -> existing Hyperstack skills/plugins`
- `hyper -> verification and delivery gates`

## Disallowed

- `user request -> frontend-builder`
- `frontend-builder -> ship`
- `frontend-builder -> deliver`
- `frontend-builder` claiming final completion directly

## V1 Principle

The new role harness is layered on top of the current Hyperstack skills and MCP
plugins. It does not replace them in v1.
