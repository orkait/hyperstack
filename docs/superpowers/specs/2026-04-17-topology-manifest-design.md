# Topology Manifest V1 Design

Date: 2026-04-17
Status: Approved design, pre-implementation
Scope: Replace Docker-MCP-first wiring with a topology-manifest-driven local navigation engine while preserving stable tool-call identities

## 1. Goal

Hyperstack currently has three high-value assets:

- researched domain truth
- strong skill/process discipline
- internal agent routing ideas

The failure mode is not missing research. The failure mode is wiring drift:

- agents, skills, tests, bootstrap artifacts, and runtime contracts drift apart
- Docker-based MCP adds setup friction and transport complexity
- long frontend skills create skip behavior because the active runtime surface is too large
- frontend and backend are treated too symmetrically even though their proof paths are different

V1 solves wiring drift by introducing a topology manifest as the single source of truth for runtime contracts while replacing the Docker MCP layer with a local navigation/injection engine backed by a file-based corpus.

## 2. Design Summary

V1 architecture:

```text
User
  -> hyper
    -> builder agent
      -> skills
        -> local navigation engine
          -> corpus folders
```

Previous architecture:

```text
Agents -> Skills -> Docker MCP Server -> Data
```

V1 architecture:

```text
Agents -> Skills -> Local Navigation/Injection Engine -> Corpus
```

Key decisions:

- topology manifest becomes source of truth for runtime wiring
- tool-call names stay stable
- Docker MCP stops being the primary runtime transport
- corpus remains file-backed and researched
- engine resolves domain, capability, allowed links, and injection slices
- generated files cover topology-derived artifacts only

## 3. Core Principles

### 3.1 Transport Is Not Product

The MCP transport is not the product. The product is:

- domain truth
- contract-aware routing
- enforceable skill usage
- proof-aware autonomy

V1 removes Docker MCP as the default transport but keeps stable tool-call identities through local adapters.

### 3.2 Skills Enforce, Corpus Informs

Skills should not carry the full research corpus. Skills should be short enforcement contracts that define:

- call order
- required artifacts
- forbidden actions
- proof required before completion

The researched material remains in the corpus.

### 3.3 Frontend and Backend Are Not Symmetric

Backend has stronger executable proof paths:

- unit tests
- integration tests
- API calls
- logs

Frontend has weaker proof paths and needs design-constrained execution:

- layout quality
- hierarchy
- motion quality
- responsive behavior
- interaction feedback

This asymmetry must be explicit in topology.

### 3.4 Stable Tool Names, New Runtime

Tool identities such as `designer_resolve_intent`, `reactflow_get_api`, and `golang_get_practice` remain stable. What changes is the resolver behind them:

- old: server transport
- new: local adapter -> capability resolver -> corpus injection

## 4. V1 Repo Shape

```text
hyperstack/
├─ topology/
│  ├─ manifest.yaml
│  ├─ domains/
│  │  ├─ frontend.yaml
│  │  ├─ backend.yaml
│  │  └─ shared.yaml
│  ├─ agents/
│  │  ├─ hyper.yaml
│  │  ├─ frontend-builder.yaml
│  │  ├─ backend-builder.yaml
│  │  └─ fullstack-builder.yaml
│  ├─ skills/
│  │  ├─ groups.yaml
│  │  └─ policies.yaml
│  └─ bundles/
│     ├─ frontend.design.yaml
│     ├─ frontend.react.yaml
│     ├─ backend.http.yaml
│     ├─ backend.lang.go.yaml
│     ├─ backend.lang.rust.yaml
│     └─ shared.system.yaml
├─ corpus/
│  ├─ frontend/
│  │  ├─ designer/
│  │  ├─ design-tokens/
│  │  ├─ ui-ux/
│  │  ├─ react/
│  │  ├─ shadcn/
│  │  ├─ motion/
│  │  ├─ lenis/
│  │  └─ reactflow/
│  ├─ backend/
│  │  ├─ echo/
│  │  ├─ golang/
│  │  └─ rust/
│  └─ shared/
│     └─ system/
├─ engine/
│  ├─ registry.ts
│  ├─ resolver.ts
│  ├─ injector.ts
│  ├─ contracts.ts
│  ├─ navigation.ts
│  └─ policy.ts
├─ adapters/
│  └─ local-tools/
├─ agents/
├─ skills/
├─ generated/
│  ├─ routing/
│  ├─ runtime-context/
│  ├─ tool-index/
│  └─ tests/
└─ tests/
```

## 5. Domain Model

V1 domains:

- `frontend`
- `backend`
- `shared`

Domains are not decorative labels. They enforce:

- allowed bundles
- forbidden bundles
- default proof model
- write autonomy
- required gates

### 5.1 Domain Policies

#### Frontend

- write policy: `constrained`
- completion proof: `visual_and_behavioral`
- truth source: frontend design/react bundles
- required gates: `designer`, `behaviour-analysis`
- optional gate: `shadcn-expert`

#### Backend

- write policy: `direct`
- completion proof: `executable`
- truth source: backend http/language bundles
- required gate: none beyond shared quality gates
- optional gate: `security-review`

#### Shared

- write policy: `policy_only`
- completion proof: `routing_and_verification`
- truth source: topology/system
- used mainly by `hyper`

## 6. Agent Model

Agents are runtime work owners. They are not generic personalities. Each agent is defined by domain set, allowed skills, allowed bundles, and handoff contracts.

### 6.1 V1 Agents

#### `hyper`

- kind: `orchestrator`
- domains: `[shared]`
- owns:
  - classification
  - route decision
  - gate enforcement
  - final verification
  - delivery
- should not own deep frontend/backend implementation by default

#### `frontend-builder`

- kind: `specialist`
- domains: `[frontend]`
- owns:
  - UI implementation
  - page/app surface
  - component assembly
  - interaction and state behavior
- must operate under design constraint

#### `backend-builder`

- kind: `specialist`
- domains: `[backend]`
- owns:
  - HTTP/API/service logic
  - auth
  - data flow
  - jobs and backend integrations

#### `fullstack-builder`

- kind: `cross-domain`
- domains: `[frontend, backend]`
- owns:
  - tightly coupled end-to-end slices
  - integration work where frontend and backend cannot be cleanly separated
- must not become wildcard `*`
- completion proof uses the strictest touched domain

### 6.2 Agent Hierarchy

```text
hyper
├─ frontend-builder
├─ backend-builder
└─ fullstack-builder
```

## 7. Skill Model

Skills are enforcement contracts. They are not the source of deep domain truth.

### 7.1 Shared Process Skills

These should remain shared, short, and reusable:

- `blueprint`
- `forge-plan`
- `run-plan`
- `parallel-dispatch`
- `subagent-ops`
- `autonomous-mode`
- `test-first`
- `debug-discipline`
- `engineering-discipline`
- `worktree-isolation`
- `ship-gate`
- `code-review`
- `deliver`

### 7.2 Frontend Specialty Skills

- `designer`
- `behaviour-analysis`
- `shadcn-expert`

### 7.3 Backend Specialty Skill

- `security-review`

### 7.4 Deferred Skills

Not core to V1 workgroup routing:

- `readme-writer`
- `testing-skills`

These remain installed but are not part of the default routed working group.

## 8. Bundle Model

Bundles replace the old MCP-layer mental model in runtime topology. A bundle is a capability-backed grouping of corpus sources and stable tool prefixes.

### 8.1 V1 Bundles

#### `shared.system`

- domain: `shared`
- source: system/topology/runtime guidance
- stable tool family: system setup and policy tooling

#### `frontend.design`

- domain: `frontend`
- sources:
  - `designer`
  - `design-tokens`
  - `ui-ux`
- capabilities:
  - `design.intent`
  - `design.contract`
  - `design.tokens`

#### `frontend.react`

- domain: `frontend`
- sources:
  - `react`
  - `shadcn`
  - `motion`
  - `lenis`
  - `reactflow`
- capabilities:
  - `frontend.patterns`
  - `frontend.motion`
  - `frontend.flow`

#### `backend.http`

- domain: `backend`
- source:
  - `echo`
- capabilities:
  - `backend.http.patterns`

#### `backend.lang.go`

- domain: `backend`
- source:
  - `golang`
- capabilities:
  - `backend.go.patterns`

#### `backend.lang.rust`

- domain: `backend`
- source:
  - `rust`
- capabilities:
  - `backend.rust.patterns`

## 9. Capability Model

Capabilities are the stable runtime vocabulary. They are more durable than plugin names.

V1 capability set:

- `system.setup`
- `design.intent`
- `design.contract`
- `design.tokens`
- `frontend.patterns`
- `frontend.motion`
- `frontend.flow`
- `backend.http.patterns`
- `backend.go.patterns`
- `backend.rust.patterns`
- `quality.security.review`
- `quality.behaviour.audit`
- `quality.ship.verify`

Why capability names matter:

- tools can stay stable while storage changes
- bundles can be reorganized without breaking every agent
- tests can assert capability coverage directly

## 10. Artifact Contracts

Artifacts are typed handoff shapes between agents, skills, and adapters.

Recommended first V1 artifact set:

- `task_handoff`
- `design_contract`
- `build_result`
- `review_report`
- `verification_report`
- `delivery_report`

### 10.1 `task_handoff`

Produced by:

- `hyper`

Consumed by:

- builder agents
- design/planning skills

Fields:

- request_id
- domain_targets
- capability_targets
- constraints
- success_criteria
- touched_surfaces

### 10.2 `design_contract`

Produced by:

- `designer`

Consumed by:

- `frontend-builder`
- `fullstack-builder`
- `behaviour-analysis`

Fields:

- visual_theme
- color_system
- typography
- spacing
- component_states
- motion_rules
- responsive_rules
- anti_patterns

### 10.3 `verification_report`

Produced by:

- `behaviour-analysis`
- `ship-gate`
- future runtime verifiers

Consumed by:

- `hyper`
- `deliver`

Fields:

- status
- proof_mode
- findings
- covered_paths
- residual_risks

## 11. Runtime Resolution Flow

Every stable tool call resolves through the same pipeline:

```text
tool name
-> capability
-> bundle
-> corpus paths
-> injector
-> shaped artifact
```

This replaces the previous server-centric model.

### 11.1 Example: `designer_resolve_intent`

User asks for a developer analytics landing page.

Flow:

1. `hyper` receives the request
2. `hyper` classifies:
   - domain = frontend
   - capability = `design.intent`
3. `hyper` routes to `frontend-builder`
4. `frontend-builder` is required to use `frontend.design`
5. local adapter `designer_resolve_intent` resolves the call
6. engine maps the tool to:
   - capability: `design.intent`
   - bundle: `frontend.design`
   - corpus paths:
     - `corpus/frontend/designer`
     - `corpus/frontend/ui-ux`
     - `corpus/frontend/design-tokens`
7. injector builds a short context pack
8. adapter returns a shaped `intent_resolution` artifact
9. `designer` skill can now produce `design_contract`
10. no frontend completion path may claim done before required frontend proof exists

## 12. Local Navigation Engine

The engine is the new runtime center. It is not plain folder search.

Responsibilities:

- register tools, capabilities, bundles, and sources
- enforce allowed and forbidden links
- resolve minimal corpus slices
- build short injection packs
- return shaped artifacts
- support stable local tool handlers

The engine should not:

- act as a generic server-first runtime
- dump giant markdown payloads by default
- depend on Docker
- bypass manifest policy

## 13. Smart Injection Rules

To avoid long-skill skip behavior:

- default injection must be minimal
- domain truth stays in corpus
- adapters inject only what the capability needs
- long references are annex material, not default runtime payload

Rule:

- Skills define order and gates
- Bundles define accessible truth
- Engine injects the smallest valid slice

This preserves research while shrinking active prompt load.

## 14. Generation Scope

V1 generation should cover topology-derived outputs only.

Generate:

- routing matrix
- allow/deny link tables
- tool index
- runtime topology bootstrap
- contract tests
- stale-link tests

Do not generate:

- full skill prose
- deep domain corpus
- implementation code for researched tools

Reason:

- topology owns wiring
- corpus owns knowledge
- hand-authored process prose remains curated

## 15. Validation and Proof

### 15.1 Frontend

Frontend completion requires stronger proof because code correctness is not enough.

Required proof path:

- design contract exists
- frontend truth bundles used
- behavior audit completed
- final report marks residual risks explicitly

Compile-only or typecheck-only proof is insufficient.

### 15.2 Backend

Backend completion may be more direct because executable proof is stronger.

Acceptable proof paths include:

- tests
- API calls
- logs
- integration checks

### 15.3 Fullstack

Fullstack completion inherits the strictest touched domain.

If frontend is touched:

- frontend proof requirements apply

Backend proof alone cannot close a fullstack task that changes frontend behavior.

## 16. Invariants

- no direct user -> specialist execution
- no unrestricted specialist -> forbidden bundle access
- no frontend completion without `design_contract`
- no completion claim without `verification_report`
- no cross-domain execution without declared domain union
- no runtime link outside topology manifest
- no generated artifact used as hand-authored source of truth

## 17. Migration Strategy

V1 should migrate in this order:

1. create topology manifest and split files
2. define domain policies
3. define four V1 agents
4. define bundles and capability mapping
5. define first artifact contracts
6. build local navigation engine registry/resolver
7. add local tool adapters preserving stable tool names
8. generate routing/bootstrap/tests from topology
9. progressively move deep researched data into `corpus/`
10. retire Docker MCP as default runtime path

## 18. Risks

### Risk 1: Topology becomes too generic

Mitigation:

- keep V1 domains small
- keep capability set focused
- generate only what is needed

### Risk 2: Corpus migration becomes a rewrite

Mitigation:

- keep existing researched files first
- map them into corpus gradually
- do not rewrite deep content during topology phase

### Risk 3: Tool compatibility breaks

Mitigation:

- preserve stable tool names
- swap transport behind adapters
- add compatibility tests per tool family

### Risk 4: Frontend still over-injects

Mitigation:

- enforce bundle-level injection
- keep skills short
- move long theory to corpus annexes

### Risk 5: Fullstack becomes wildcard

Mitigation:

- declare exact domain union
- enforce strictest-proof rule
- test forbidden links

## 19. Recommendation

Ship V1 as:

- topology manifest
- local navigation engine
- local stable tool adapters
- four-agent working group:
  - `hyper`
  - `frontend-builder`
  - `backend-builder`
  - `fullstack-builder`
- existing researched knowledge preserved in corpus-backed storage
- Docker MCP removed from the default runtime path

This is the smallest design that meaningfully reduces drift while preserving the existing research investment.
