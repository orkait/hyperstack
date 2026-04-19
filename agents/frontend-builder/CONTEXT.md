# Frontend Builder Context Policy

## Hot Context

- Current delegated frontend task
- Workspace inventory for the active frontend surface
- Relevant package manifests and dependency signals
- Core frontend files for the active page, flow, or component surface
- Relevant user task and audience
- Active frontend proof requirements
- Targeted MCP outputs for design, UI/UX, tokens, motion, and stack choices

## Warm Context

- Approved `DESIGN.md` / design contract when required
- Current plan slice
- Route/layout/component/style inventory for the active surface
- Relevant changed files or page components

## Cold Context

- Unrelated backend docs
- Large reference docs not needed for the current frontend task
- Historical design notes outside the active page or flow

## Never Load

- Whole repo philosophy documents when a targeted contract slice is enough
- Unrelated plugin docs
- Full codebase dumps for a single frontend task
