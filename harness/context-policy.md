# Harness Context Policy

## Principle

Each internal role should load only the context slice it needs.

## Role Slices

- `main`
  - classification, routing, gates, verification, delivery
- `website-builder`
  - workspace inventory
  - package manifests and dependency signals
  - core frontend files for the active surface
  - website intent, page structure, website-experience constraints, website code

## Tiers

- Hot
  - current task
  - active role contract
  - active design/plan slice
- Warm
  - targeted skill or MCP outputs
  - changed surface summary
- Cold
  - deep references and examples
- Never load by default
  - unrelated plugin docs
  - whole reference forests
  - full repo dumps for narrow tasks
