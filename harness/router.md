# Harness Router

## Default Rule

Every user request enters through `main`.

Users do not invoke internal roles directly. Roles are internal and auto-called.

## Routing Matrix

Route `main -> website-builder` when the request is primarily about:

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

Before routing, `main` must inspect the workspace enough to know:

- which package manifests and dependency signals define the active frontend stack
- which core frontend files likely own the affected surface
- whether the request is actually website-facing rather than generic frontend or
  backend work

Keep work in `main` when the request is primarily about:

- backend or infra
- pure MCP/plugin behavior
- verification, review, or delivery
- non-website specialist domains not yet modeled as roles

## Safety Rule

If the request is ambiguous, keep ownership in `main` until delegation criteria
are explicit.
