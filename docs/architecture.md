# Hyperstack Architecture

## Purpose

Hyperstack is no longer a Docker-first MCP server with skills attached.

Current architecture is:

```text
user request
-> hyper
-> workspace_inventory
-> topology routing
-> delegated agent
-> skills and gates
-> local tool runtime
-> topology + corpus-backed truth
-> verification_report
```

## Core Layers

### 1. Topology

Location:
- `topology/`

Owns:
- domains
- agents
- bundles
- artifacts
- route defaults
- allowed/forbidden links

Topology is the source of truth for runtime wiring.

### 2. Runtime

Location:
- `src/cli.ts`
- `src/adapters/local-tools/`
- `src/engine/`

Owns:
- loading topology
- validating artifact payloads
- routing requests
- enforcing allowed skills
- resolving stable tool calls

### 3. Knowledge

Location:
- `src/plugins/*`
- `corpus/`

Current state:
- stable tool calls already run locally
- research still mostly lives in plugin-shaped data
- `corpus/` exists but is still a partial ownership layer

This is the main remaining architecture gap.

## Universal vs Conditional Artifacts

### Universal

- `workspace_inventory`
- `task_handoff`
- `verification_report`

### Conditional

- `design_contract`

`design_contract` is required only when:
- a new surface is created
- visual semantics change
- no trustworthy existing pattern match exists

It is not required for every frontend task.

## Proof Model

### Backend

Usually uses `executable` proof:
- tests
- API calls
- logs
- integration checks

### Frontend

Usually uses `visual_and_behavioral` proof:
- state coverage
- interaction behavior
- accessibility
- layout and structure correctness

### Fullstack

Uses the strictest proof of the touched domains.

## Current Role Model

### `hyper`

Owns:
- classification
- routing
- gate enforcement
- final verification

### `frontend-builder`

Owns:
- frontend-facing implementation
- page structure
- interaction work
- existing-project frontend logic work

### `backend-builder`

Owns:
- API, service, auth, jobs, backend logic

### `fullstack-builder`

Owns:
- tightly coupled frontend + backend slices

## Current Invariant

The correct repo behavior is:

**planning is universal  
design contracts are conditional  
verification is universal**

Any future change that violates this should be treated as architectural drift.
