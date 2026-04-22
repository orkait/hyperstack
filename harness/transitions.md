# Harness Transitions

## Allowed

- `user request -> hyper`
- `hyper -> website-builder`
- `website-builder -> hyper`
- `hyper -> existing Hyperstack skills/plugins`
- `hyper -> verification and delivery gates`

## Disallowed

- `user request -> website-builder`
- `website-builder -> ship`
- `website-builder -> deliver`
- `website-builder` claiming final completion directly

## V1 Principle

The new role harness is layered on top of the current Hyperstack skills and MCP
plugins. It does not replace them in v1.
