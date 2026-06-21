# Harness Router

## Default Rule

Every user request enters through `hyper`.

Users do not invoke internal roles directly. Roles are internal and auto-called.

## Persona Gate

Before routing a net-new feature, product, or scope decision to any specialist,
`hyper` engages the `product-manager` persona gate (`pm-gate` skill). The gate must
return PASS before design/build. Tweaks/bugfixes get an advisory brief, not a block.
The user may explicitly override ("skip PM"), which is honoured and logged.

## Routing Matrix

Route `hyper -> website-builder` when the request is primarily about:

- landing pages
- dashboards
- marketing or product websites
- page redesigns
- website page structure
- CTA hierarchy
- trust signals
- form friction
- responsive content priority
- "make the website/page feel better" style requests

Before routing, `hyper` must inspect the workspace enough to know:

- which package manifests and dependency signals define the active frontend stack
- which core frontend files likely own the affected surface
- whether the request is actually website-facing rather than generic frontend or
  backend work

Keep work in `hyper` when the request is primarily about:

- backend or infra
- pure MCP/plugin behavior
- verification, review, or delivery
- non-website specialist domains not yet modeled as roles

## Safety Rule

If the request is ambiguous, keep ownership in `hyper` until delegation criteria
are explicit.
