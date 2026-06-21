# Harness Transitions

## Allowed

- `user request -> hyper`
- `hyper -> website-builder`
- `website-builder -> hyper`
- `hyper -> existing Hyperstack skills/plugins`
- `hyper -> verification and delivery gates`
- `hyper -> product-manager persona gate (net-new build/scope)`
- `product-manager persona gate -> hyper`

## Disallowed

- `user request -> website-builder`
- `website-builder -> ship`
- `website-builder -> deliver`
- `website-builder` claiming final completion directly
- `product-manager persona gate -> ship` (must hand back to hyper)
- `product-manager persona gate -> deliver`

## V1 Principle

The new role harness is layered on top of the current Hyperstack skills and MCP
plugins. It does not replace them in v1.
