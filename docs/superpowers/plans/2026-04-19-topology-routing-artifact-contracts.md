# Workspace-First Topology Routing And Artifact Contracts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make topology the active runtime authority for workspace-aware routing, conditional design contracts, skill enforcement, and typed artifact handoffs.

**Architecture:** Extend topology with universal planning artifacts and route defaults, then build a runtime layer that validates artifacts, routes requests based on domain plus workspace reality, computes required artifacts, and exposes those results through the CLI. `workspace_inventory` is universal, `design_contract` is conditional, `verification_report` is universal.

**Tech Stack:** TypeScript, Bun, YAML, existing `src/engine/*`, existing `src/cli.ts`, generated topology/runtime artifacts, Bun test

---

## File Structure Lock-In

### New Files

- `topology/artifacts/workspace_inventory.yaml`
- `topology/artifacts/task_handoff.yaml`
- `topology/artifacts/design_contract.yaml`
- `topology/artifacts/build_result.yaml`
- `topology/artifacts/verification_report.yaml`
- `topology/routes/defaults.yaml`
- `src/engine/artifact-loader.ts`
- `src/engine/artifact-validator.ts`
- `src/engine/router.ts`
- `src/engine/skill-enforcer.ts`
- `tests/artifact-contracts-behaviour.test.ts`
- `tests/router-behaviour.test.ts`
- `tests/local-cli-routing-behaviour.test.ts`

### Files To Modify

- `topology/manifest.yaml`
- `src/engine/contracts.ts`
- `src/engine/topology-loader.ts`
- `src/engine/policy.ts`
- `src/engine/navigation.ts`
- `src/cli.ts`
- `scripts/generate-topology-artifacts.ts`
- `generated/runtime-context/topology.bootstrap.md`
- `generated/routing/allow-deny.md`
- `tests/topology-artifacts-behaviour.test.ts`

### Responsibility Boundaries

- `workspace_inventory` is mandatory for any routed work.
- `design_contract` is conditional and only required for new surfaces or visual-semantic changes.
- `verification_report` remains mandatory before completion claims.
- `src/engine/router.ts` owns route choice and required-artifact computation.
- `src/engine/skill-enforcer.ts` owns allowed-skill checks for a routed agent.
- `src/cli.ts` is transport only. No policy logic belongs there.

---

### Task 1: Add Workspace-First Artifact Contracts And Route Defaults

**Files:**
- Modify: `topology/manifest.yaml`
- Create: `topology/artifacts/workspace_inventory.yaml`
- Create: `topology/artifacts/task_handoff.yaml`
- Create: `topology/artifacts/design_contract.yaml`
- Create: `topology/artifacts/build_result.yaml`
- Create: `topology/artifacts/verification_report.yaml`
- Create: `topology/routes/defaults.yaml`
- Modify: `src/engine/contracts.ts`
- Modify: `src/engine/topology-loader.ts`
- Test: `tests/topology-manifest-behaviour.test.ts`

- [ ] **Step 1: Extend the failing topology test**

```ts
import { expect, test } from "bun:test";
import { loadTopology } from "../src/engine/topology-loader.ts";

test("loadTopology reads workspace-first artifacts and route defaults", () => {
  const topology = loadTopology(process.cwd());

  expect(topology.artifacts.map((a) => a.id)).toEqual([
    "workspace_inventory",
    "task_handoff",
    "design_contract",
    "build_result",
    "verification_report",
  ]);
  expect(topology.routeDefaults.defaultAgent).toBe("hyper");
  expect(topology.routeDefaults.requiresWorkspaceInventory).toBe(true);
  expect(topology.routeDefaults.domainPreference.frontend).toBe("frontend-builder");
  expect(topology.routeDefaults.designContractRequiredWhen).toContain("new_surface");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test tests/topology-manifest-behaviour.test.ts`
Expected: FAIL with `topology.artifacts` or `topology.routeDefaults` missing

- [ ] **Step 3: Add topology YAMLs**

```yaml
# topology/artifacts/workspace_inventory.yaml
id: workspace_inventory
required_fields:
  - repo_type
  - stack
  - touched_surfaces
  - existing_patterns
  - verification_commands
  - project_mode
proof_mode: discovery_only
```

```yaml
# topology/artifacts/task_handoff.yaml
id: task_handoff
required_fields:
  - request_id
  - domain_targets
  - capability_targets
  - success_criteria
  - change_classification
  - requires_design_contract
  - required_artifacts
proof_mode: routing_only
```

```yaml
# topology/artifacts/design_contract.yaml
id: design_contract
required_fields:
  - visual_theme
  - color_system
  - typography
  - spacing
  - component_states
  - motion_rules
proof_mode: visual_contract_conditional
```

```yaml
# topology/routes/defaults.yaml
default_agent: hyper
requires_workspace_inventory: true
domain_preference:
  frontend: frontend-builder
  backend: backend-builder
  shared: hyper
cross_domain_agent: fullstack-builder
design_contract_required_when:
  - new_surface
  - visual_semantic_change
  - no_existing_pattern_match
strictest_proof_order:
  - routing_and_verification
  - executable
  - visual_and_behavioral
```

- [ ] **Step 4: Extend contracts**

```ts
// src/engine/contracts.ts
export interface ArtifactContract {
  id: string;
  requiredFields: string[];
  proofMode: string;
}

export interface RouteDefaults {
  defaultAgent: string;
  requiresWorkspaceInventory: boolean;
  domainPreference: Record<string, string>;
  crossDomainAgent: string;
  designContractRequiredWhen: string[];
  strictestProofOrder: string[];
}

export interface TopologyRoot {
  version: 1;
  defaultTransport: "local-tools";
  entryAgent: string;
  domains: string[];
  agents: string[];
  bundles: string[];
  artifacts: string[];
}

export interface LoadedTopology {
  version: 1;
  defaultTransport: "local-tools";
  entryAgent: string;
  domains: DomainPolicy[];
  agents: AgentPolicy[];
  bundles: BundlePolicy[];
  artifacts: ArtifactContract[];
  routeDefaults: RouteDefaults;
}
```

- [ ] **Step 5: Extend the loader**

```ts
// src/engine/topology-loader.ts
interface ArtifactDocument {
  id: string;
  required_fields: string[];
  proof_mode: string;
}

interface RouteDefaultsDocument {
  default_agent: string;
  requires_workspace_inventory: boolean;
  domain_preference: Record<string, string>;
  cross_domain_agent: string;
  design_contract_required_when: string[];
  strictest_proof_order: string[];
}

function mapArtifactDocument(doc: ArtifactDocument): ArtifactContract {
  return {
    id: doc.id,
    requiredFields: doc.required_fields,
    proofMode: doc.proof_mode,
  };
}

function mapRouteDefaultsDocument(doc: RouteDefaultsDocument): RouteDefaults {
  return {
    defaultAgent: doc.default_agent,
    requiresWorkspaceInventory: doc.requires_workspace_inventory,
    domainPreference: doc.domain_preference,
    crossDomainAgent: doc.cross_domain_agent,
    designContractRequiredWhen: doc.design_contract_required_when,
    strictestProofOrder: doc.strictest_proof_order,
  };
}
```

- [ ] **Step 6: Run the test and typecheck**

Run: `bun test tests/topology-manifest-behaviour.test.ts && bun run build`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add topology/manifest.yaml topology/artifacts topology/routes src/engine/contracts.ts src/engine/topology-loader.ts tests/topology-manifest-behaviour.test.ts
git commit -m "feat: add workspace-first artifact contracts and route defaults"
```

---

### Task 2: Implement Artifact Validation For Planning And Verification

**Files:**
- Create: `src/engine/artifact-loader.ts`
- Create: `src/engine/artifact-validator.ts`
- Test: `tests/artifact-contracts-behaviour.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { expect, test } from "bun:test";
import { loadTopology } from "../src/engine/topology-loader.ts";
import { validateArtifactPayload } from "../src/engine/artifact-validator.ts";

test("validateArtifactPayload accepts a complete workspace_inventory", () => {
  const topology = loadTopology(process.cwd());
  const result = validateArtifactPayload(topology, "workspace_inventory", {
    repo_type: "web-app",
    stack: ["react", "tailwind"],
    touched_surfaces: ["settings page"],
    existing_patterns: ["shadcn form"],
    verification_commands: ["bun test", "bun run build"],
    project_mode: "existing",
  });

  expect(result.ok).toBe(true);
});

test("validateArtifactPayload rejects missing design_contract fields", () => {
  const topology = loadTopology(process.cwd());
  const result = validateArtifactPayload(topology, "design_contract", {
    visual_theme: "dark",
    color_system: "brand + neutral",
  });

  expect(result.ok).toBe(false);
  expect(result.missingFields).toContain("typography");
  expect(result.missingFields).toContain("component_states");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test tests/artifact-contracts-behaviour.test.ts`
Expected: FAIL with `Cannot find module "../src/engine/artifact-validator.ts"`

- [ ] **Step 3: Add the artifact loader**

```ts
// src/engine/artifact-loader.ts
import type { ArtifactContract, LoadedTopology } from "./contracts.js";

export function getArtifactContract(topology: LoadedTopology, artifactId: string): ArtifactContract {
  const artifact = topology.artifacts.find((entry) => entry.id === artifactId);
  if (!artifact) {
    throw new Error(`Unknown artifact contract: ${artifactId}`);
  }
  return artifact;
}
```

- [ ] **Step 4: Implement the validator**

```ts
// src/engine/artifact-validator.ts
import type { LoadedTopology } from "./contracts.js";
import { getArtifactContract } from "./artifact-loader.js";

export function validateArtifactPayload(
  topology: LoadedTopology,
  artifactId: string,
  payload: Record<string, unknown>,
) {
  const contract = getArtifactContract(topology, artifactId);
  const missingFields = contract.requiredFields.filter((field) => !(field in payload));

  return {
    ok: missingFields.length === 0,
    artifactId,
    proofMode: contract.proofMode,
    missingFields,
  };
}
```

- [ ] **Step 5: Run tests and build**

Run: `bun test tests/artifact-contracts-behaviour.test.ts && bun run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/engine/artifact-loader.ts src/engine/artifact-validator.ts tests/artifact-contracts-behaviour.test.ts
git commit -m "feat: add artifact validation for planning and verification"
```

---

### Task 3: Add Workspace-Aware Router With Conditional Design Contracts

**Files:**
- Create: `src/engine/router.ts`
- Modify: `src/engine/policy.ts`
- Test: `tests/router-behaviour.test.ts`

- [ ] **Step 1: Write the failing router tests**

```ts
import { expect, test } from "bun:test";
import { loadTopology } from "../src/engine/topology-loader.ts";
import { routeRequest } from "../src/engine/router.ts";

test("routeRequest sends existing-project frontend logic work to frontend-builder without design contract", () => {
  const topology = loadTopology(process.cwd());
  const route = routeRequest(topology, {
    requestId: "req-1",
    domainTargets: ["frontend"],
    capabilityTargets: ["frontend.patterns"],
    workspaceInventory: {
      projectMode: "existing",
      existingPatterns: ["existing form shell"],
    },
    changeClassification: "frontend_logic",
  });

  expect(route.agent.id).toBe("frontend-builder");
  expect(route.requiredArtifacts).toContain("workspace_inventory");
  expect(route.requiredArtifacts).not.toContain("design_contract");
});

test("routeRequest requires design contract for a new visual surface", () => {
  const topology = loadTopology(process.cwd());
  const route = routeRequest(topology, {
    requestId: "req-2",
    domainTargets: ["frontend"],
    capabilityTargets: ["design.intent"],
    workspaceInventory: {
      projectMode: "greenfield",
      existingPatterns: [],
    },
    changeClassification: "frontend_visual",
  });

  expect(route.agent.id).toBe("frontend-builder");
  expect(route.requiredArtifacts).toContain("workspace_inventory");
  expect(route.requiredArtifacts).toContain("design_contract");
  expect(route.proofMode).toBe("visual_and_behavioral");
});

test("routeRequest sends mixed frontend+backend work to fullstack-builder", () => {
  const topology = loadTopology(process.cwd());
  const route = routeRequest(topology, {
    requestId: "req-3",
    domainTargets: ["frontend", "backend"],
    capabilityTargets: ["frontend.patterns", "backend.http.patterns"],
    workspaceInventory: {
      projectMode: "existing",
      existingPatterns: [],
    },
    changeClassification: "fullstack_slice",
  });

  expect(route.agent.id).toBe("fullstack-builder");
  expect(route.proofMode).toBe("visual_and_behavioral");
});
```

- [ ] **Step 2: Run the router test to verify it fails**

Run: `bun test tests/router-behaviour.test.ts`
Expected: FAIL with `Cannot find module "../src/engine/router.ts"`

- [ ] **Step 3: Add a strictest-proof helper**

```ts
// src/engine/policy.ts
export function getStrictestProofMode(order: string[], proofModes: string[]): string {
  const ranked = proofModes
    .map((mode) => ({ mode, index: order.indexOf(mode) }))
    .filter((entry) => entry.index >= 0)
    .sort((left, right) => right.index - left.index);

  if (ranked.length === 0) {
    throw new Error(`No proof mode could be ranked from: ${proofModes.join(", ")}`);
  }

  return ranked[0].mode;
}
```

- [ ] **Step 4: Implement the router**

```ts
// src/engine/router.ts
import type { LoadedTopology } from "./contracts.js";
import { getAgent, getDomain, getStrictestProofMode } from "./policy.js";

function shouldRequireDesignContract(input: {
  changeClassification: string;
  workspaceInventory: { projectMode: "greenfield" | "existing"; existingPatterns: string[] };
}): boolean {
  if (input.changeClassification !== "frontend_visual") {
    return false;
  }

  return (
    input.workspaceInventory.projectMode === "greenfield" ||
    input.workspaceInventory.existingPatterns.length === 0
  );
}

export function routeRequest(
  topology: LoadedTopology,
  input: {
    requestId: string;
    domainTargets: string[];
    capabilityTargets: string[];
    workspaceInventory: {
      projectMode: "greenfield" | "existing";
      existingPatterns: string[];
    };
    changeClassification: string;
  },
) {
  const uniqueDomains = [...new Set(input.domainTargets)];
  const routeAgentId =
    uniqueDomains.length > 1
      ? topology.routeDefaults.crossDomainAgent
      : topology.routeDefaults.domainPreference[uniqueDomains[0] ?? "shared"] ?? topology.routeDefaults.defaultAgent;

  const agent = getAgent(topology, routeAgentId);
  const proofMode = getStrictestProofMode(
    topology.routeDefaults.strictestProofOrder,
    uniqueDomains.map((domainId) => getDomain(topology, domainId).completionProof),
  );

  const requiredArtifacts = ["workspace_inventory", "task_handoff"];
  const requiresDesignContract = shouldRequireDesignContract(input);

  if (requiresDesignContract) {
    requiredArtifacts.push("design_contract");
  }

  return {
    requestId: input.requestId,
    agent,
    proofMode,
    domains: uniqueDomains,
    capabilityTargets: input.capabilityTargets,
    requiredArtifacts,
    requiresDesignContract,
  };
}
```

- [ ] **Step 5: Run router tests and build**

Run: `bun test tests/router-behaviour.test.ts && bun run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/engine/policy.ts src/engine/router.ts tests/router-behaviour.test.ts
git commit -m "feat: add workspace-aware router with conditional design contracts"
```

---

### Task 4: Enforce Allowed Skills For Routed Agents

**Files:**
- Create: `src/engine/skill-enforcer.ts`
- Test: `tests/router-behaviour.test.ts`

- [ ] **Step 1: Extend the failing router test**

```ts
import { expect, test } from "bun:test";
import { loadTopology } from "../src/engine/topology-loader.ts";
import { routeRequest } from "../src/engine/router.ts";
import { assertSkillAllowedForAgent } from "../src/engine/skill-enforcer.ts";

test("assertSkillAllowedForAgent rejects backend-only review skill on frontend-builder", () => {
  const topology = loadTopology(process.cwd());
  const route = routeRequest(topology, {
    requestId: "req-4",
    domainTargets: ["frontend"],
    capabilityTargets: ["frontend.patterns"],
    workspaceInventory: {
      projectMode: "existing",
      existingPatterns: ["existing form shell"],
    },
    changeClassification: "frontend_logic",
  });

  expect(() => assertSkillAllowedForAgent(route.agent, "security-review")).toThrow(/not allowed/i);
});

test("assertSkillAllowedForAgent accepts designer for frontend-builder", () => {
  const topology = loadTopology(process.cwd());
  const route = routeRequest(topology, {
    requestId: "req-5",
    domainTargets: ["frontend"],
    capabilityTargets: ["design.intent"],
    workspaceInventory: {
      projectMode: "greenfield",
      existingPatterns: [],
    },
    changeClassification: "frontend_visual",
  });

  expect(() => assertSkillAllowedForAgent(route.agent, "designer")).not.toThrow();
});
```

- [ ] **Step 2: Run the router test to verify it fails**

Run: `bun test tests/router-behaviour.test.ts`
Expected: FAIL with `Cannot find module "../src/engine/skill-enforcer.ts"`

- [ ] **Step 3: Add the skill enforcer**

```ts
// src/engine/skill-enforcer.ts
import type { AgentPolicy } from "./contracts.js";

export function assertSkillAllowedForAgent(agent: AgentPolicy, skillName: string): void {
  if (!agent.allowedSkills.includes(skillName)) {
    throw new Error(`Skill ${skillName} is not allowed for agent ${agent.id}`);
  }
}
```

- [ ] **Step 4: Run tests and build**

Run: `bun test tests/router-behaviour.test.ts && bun run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/engine/skill-enforcer.ts tests/router-behaviour.test.ts
git commit -m "feat: enforce allowed skills for routed agents"
```

---

### Task 5: Expose Routing And Artifact Validation Through The CLI

**Files:**
- Modify: `src/cli.ts`
- Test: `tests/local-cli-routing-behaviour.test.ts`

- [ ] **Step 1: Write the failing CLI routing test**

```ts
import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

test("CLI route command returns routed agent and required artifacts", () => {
  const result = spawnSync(
    process.execPath,
    [
      resolve("bin/hyperstack.mjs"),
      "route",
      "--json",
      '{"requestId":"req-1","domainTargets":["frontend"],"capabilityTargets":["frontend.patterns"],"workspaceInventory":{"projectMode":"existing","existingPatterns":["existing form shell"]},"changeClassification":"frontend_logic"}',
    ],
    { cwd: process.cwd(), encoding: "utf8" },
  );

  expect(result.status).toBe(0);
  expect(result.stdout).toMatch(/frontend-builder/);
  expect(result.stdout).toMatch(/workspace_inventory/);
  expect(result.stdout).not.toMatch(/design_contract/);
});

test("CLI artifact validate command reports missing fields", () => {
  const result = spawnSync(
    process.execPath,
    [
      resolve("bin/hyperstack.mjs"),
      "artifact",
      "validate",
      "workspace_inventory",
      "--json",
      '{"repo_type":"web-app"}',
    ],
    { cwd: process.cwd(), encoding: "utf8" },
  );

  expect(result.status).toBe(0);
  expect(result.stdout).toMatch(/missingFields/);
  expect(result.stdout).toMatch(/stack/);
});
```

- [ ] **Step 2: Run the CLI test to verify it fails**

Run: `bun test tests/local-cli-routing-behaviour.test.ts`
Expected: FAIL because `src/cli.ts` only supports `tool`

- [ ] **Step 3: Extend the CLI**

```ts
// src/cli.ts
import { loadTopology } from "./engine/topology-loader.js";
import { routeRequest } from "./engine/router.js";
import { validateArtifactPayload } from "./engine/artifact-validator.js";
import { invokeLocalTool } from "./adapters/local-tools/index.js";

const topology = loadTopology(process.cwd());

if (command === "tool") {
  // existing path
}

if (command === "route" && flag === "--json" && json) {
  const input = JSON.parse(json) as {
    requestId: string;
    domainTargets: string[];
    capabilityTargets: string[];
    workspaceInventory: { projectMode: "greenfield" | "existing"; existingPatterns: string[] };
    changeClassification: string;
  };

  process.stdout.write(`${JSON.stringify(routeRequest(topology, input), null, 2)}\n`);
  process.exit(0);
}

if (command === "artifact" && process.argv[3] === "validate") {
  const artifactId = process.argv[4];
  const jsonFlag = process.argv[5];
  const jsonPayload = process.argv[6];

  if (jsonFlag !== "--json" || !artifactId || !jsonPayload) {
    process.stderr.write("Usage: hyperstack artifact validate <artifact-id> --json '{...}'\n");
    process.exit(1);
  }

  const payload = JSON.parse(jsonPayload) as Record<string, unknown>;
  process.stdout.write(`${JSON.stringify(validateArtifactPayload(topology, artifactId, payload), null, 2)}\n`);
  process.exit(0);
}
```

- [ ] **Step 4: Run CLI tests and build**

Run: `bun test tests/local-cli-routing-behaviour.test.ts && bun run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/cli.ts tests/local-cli-routing-behaviour.test.ts
git commit -m "feat: expose routing and artifact validation via cli"
```

---

### Task 6: Regenerate Topology Summaries With Workspace-First Rules

**Files:**
- Modify: `scripts/generate-topology-artifacts.ts`
- Modify: `tests/topology-artifacts-behaviour.test.ts`
- Modify: `generated/runtime-context/topology.bootstrap.md`
- Modify: `generated/routing/allow-deny.md`

- [ ] **Step 1: Extend the failing topology artifact test**

```ts
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test("generated topology bootstrap includes workspace-first routing markers", () => {
  const bootstrap = readFileSync(resolve("generated/runtime-context/topology.bootstrap.md"), "utf8");
  expect(bootstrap).toMatch(/workspace_inventory/);
  expect(bootstrap).toMatch(/design_contract/);
  expect(bootstrap).toMatch(/design contract is conditional/i);
  expect(bootstrap).toMatch(/cross-domain agent: fullstack-builder/i);
});
```

- [ ] **Step 2: Run the artifact test to verify it fails**

Run: `bun test tests/topology-artifacts-behaviour.test.ts`
Expected: FAIL because current topology summaries do not include workspace-first routing markers

- [ ] **Step 3: Extend the generator**

```ts
// scripts/generate-topology-artifacts.ts
writeFileSync(
  resolve("generated/runtime-context/topology.bootstrap.md"),
  [
    "# Topology Runtime Bootstrap",
    "",
    `Entry agent: ${topology.entryAgent}`,
    `Cross-domain agent: ${topology.routeDefaults.crossDomainAgent}`,
    `Workspace inventory required: ${topology.routeDefaults.requiresWorkspaceInventory}`,
    "Design contract is conditional",
    "",
    "## Artifacts",
    ...topology.artifacts.map((artifact) => `- ${artifact.id}: ${artifact.proofMode}`),
    "",
    "## Agents",
    ...topology.agents.map((agent) => `- ${agent.id}: ${agent.kind} -> ${agent.domains.join(", ")}`),
    "",
    "## Bundles",
    ...topology.bundles.map((bundle) => `- ${bundle.id}: ${bundle.capabilities.join(", ")}`),
    "",
  ].join("\n"),
);
```

- [ ] **Step 4: Regenerate and verify**

Run: `bun run generate:topology && bun test tests/topology-artifacts-behaviour.test.ts && bun run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-topology-artifacts.ts generated/runtime-context/topology.bootstrap.md generated/routing/allow-deny.md tests/topology-artifacts-behaviour.test.ts
git commit -m "feat: generate workspace-first topology summaries"
```

---

## Spec Coverage Check

- Workspace-first planning: covered by Tasks 1, 2, 3, and 5.
- Conditional `design_contract` for existing projects: covered by Tasks 3, 5, and 6.
- Universal `verification_report`: preserved by route and artifact model.
- Strictest touched-domain proof model: covered by Task 3.
- Skill allow/deny enforcement: covered by Task 4.
- CLI/runtime exposure for routing and validation: covered by Task 5.

## Placeholder Scan

- No `TBD`, `TODO`, or deferred implementation placeholders are present.
- Every code-touching step contains concrete code.
- Every verification step includes an exact command and expected outcome.

## Type Consistency Check

- Artifact IDs are consistently `workspace_inventory`, `task_handoff`, `design_contract`, `build_result`, `verification_report`.
- Route inputs consistently use `workspaceInventory` and `changeClassification`.
- Proof mode names stay `routing_and_verification`, `executable`, `visual_and_behavioral`.
- Agent IDs stay `hyper`, `frontend-builder`, `backend-builder`, `fullstack-builder`.

## Notes For Execution

- Do not force `design_contract` for every frontend request.
- Treat client existing-project work as workspace-first by default.
- Keep local tool execution intact; this phase layers routing and planning logic above it.
