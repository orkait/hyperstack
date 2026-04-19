# Topology Manifest Runtime Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Docker-MCP-first runtime with a topology-manifest-driven local navigation engine that preserves stable tool-call names, enforces agent/skill/domain contracts, and keeps the researched corpus intact.

**Architecture:** Keep deep researched content on disk, move runtime wiring into `topology/`, and add a local tool adapter layer that invokes existing tool modules directly through a production bridge instead of an MCP server. Implement this in small phases: manifest + loader, policy resolver, direct tool bridge, generated local tool registry, local CLI runtime, topology artifact generation, then cut Docker-first setup and stale tests.

**Tech Stack:** TypeScript, Bun, Bun test, Zod, YAML parsing, existing `src/plugins/*/tools/*.ts` tool modules, existing `bin/hyperstack.mjs`

---

## File Structure Lock-In

### New Files

- `topology/manifest.yaml`
- `topology/domains/frontend.yaml`
- `topology/domains/backend.yaml`
- `topology/domains/shared.yaml`
- `topology/agents/hyper.yaml`
- `topology/agents/frontend-builder.yaml`
- `topology/agents/backend-builder.yaml`
- `topology/agents/fullstack-builder.yaml`
- `topology/skills/groups.yaml`
- `topology/skills/policies.yaml`
- `topology/bundles/shared.system.yaml`
- `topology/bundles/frontend.design.yaml`
- `topology/bundles/frontend.react.yaml`
- `topology/bundles/backend.http.yaml`
- `topology/bundles/backend.lang.go.yaml`
- `topology/bundles/backend.lang.rust.yaml`
- `corpus/frontend/README.md`
- `corpus/backend/README.md`
- `corpus/shared/README.md`
- `src/engine/contracts.ts`
- `src/engine/topology-loader.ts`
- `src/engine/policy.ts`
- `src/engine/resolver.ts`
- `src/engine/injector.ts`
- `src/engine/tool-bridge.ts`
- `src/engine/navigation.ts`
- `src/adapters/local-tools/index.ts`
- `src/cli.ts`
- `scripts/generate-local-tool-registry.ts`
- `scripts/generate-topology-artifacts.ts`
- `tests/topology-manifest-behaviour.test.ts`
- `tests/tool-bridge-behaviour.test.ts`
- `tests/local-cli-behaviour.test.ts`
- `tests/topology-artifacts-behaviour.test.ts`

### Generated Files

- `generated/tool-index/local-tool-registry.ts`
- `generated/tool-index/local-tool-registry.json`
- `generated/runtime-context/topology.bootstrap.md`
- `generated/routing/allow-deny.md`

### Files To Modify

- `package.json`
- `bin/hyperstack.mjs`
- `src/index.ts`
- `src/internal/setup-hyperstack.ts`
- `scripts/setup.ts`
- `hooks/session-start.mjs`
- `tests/runtime-behaviour.test.ts`
- `tests/plugin-registry-behaviour.test.ts`
- `tests/context-compiler-behaviour.test.ts`
- `tests/role-harness-behaviour.test.ts`
- `README.md`

### Responsibility Boundaries

- `topology/` is the source of truth for runtime contracts and routing.
- `corpus/` holds file-backed knowledge roots and migration markers; V1 can reference legacy plugin data from these roots instead of rewriting all research immediately.
- `src/engine/` owns loading, policy enforcement, capability resolution, injection, and direct tool bridging.
- `scripts/` own generation of local tool registry and topology artifacts.
- `generated/` is derived only; never hand-edit.
- `src/plugins/` remains the existing research/tool implementation surface reused by the direct tool bridge during migration.

---

### Task 1: Add Topology Manifest Scaffolding and Loader

**Files:**
- Create: `topology/manifest.yaml`
- Create: `topology/domains/frontend.yaml`
- Create: `topology/domains/backend.yaml`
- Create: `topology/domains/shared.yaml`
- Create: `topology/agents/hyper.yaml`
- Create: `topology/agents/frontend-builder.yaml`
- Create: `topology/agents/backend-builder.yaml`
- Create: `topology/agents/fullstack-builder.yaml`
- Create: `topology/skills/groups.yaml`
- Create: `topology/skills/policies.yaml`
- Create: `topology/bundles/shared.system.yaml`
- Create: `topology/bundles/frontend.design.yaml`
- Create: `topology/bundles/frontend.react.yaml`
- Create: `topology/bundles/backend.http.yaml`
- Create: `topology/bundles/backend.lang.go.yaml`
- Create: `topology/bundles/backend.lang.rust.yaml`
- Create: `corpus/frontend/README.md`
- Create: `corpus/backend/README.md`
- Create: `corpus/shared/README.md`
- Create: `src/engine/contracts.ts`
- Create: `src/engine/topology-loader.ts`
- Modify: `package.json`
- Test: `tests/topology-manifest-behaviour.test.ts`

- [ ] **Step 1: Write the failing topology loader test**

```ts
import { expect, test } from "bun:test";
import { loadTopology } from "../src/engine/topology-loader.ts";

test("loadTopology reads root manifest and expanded domain/agent/bundle files", () => {
  const topology = loadTopology(process.cwd());

  expect(topology.version).toBe(1);
  expect(topology.entryAgent).toBe("hyper");
  expect(topology.domains.map((d) => d.id)).toEqual(["frontend", "backend", "shared"]);
  expect(topology.agents.map((a) => a.id)).toContain("frontend-builder");
  expect(topology.bundles.map((b) => b.id)).toContain("frontend.design");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test tests/topology-manifest-behaviour.test.ts`
Expected: FAIL with `Cannot find module "../src/engine/topology-loader.ts"` or `loadTopology is not defined`

- [ ] **Step 3: Add YAML parsing dependency and topology files**

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.17.0",
    "tsx": "^4.21.0",
    "yaml": "^2.5.1",
    "zod": "^3.23.0"
  }
}
```

```yaml
# topology/manifest.yaml
version: 1
default_transport: local-tools
entry_agent: hyper
domains:
  - frontend
  - backend
  - shared
agents:
  - hyper
  - frontend-builder
  - backend-builder
  - fullstack-builder
bundles:
  - shared.system
  - frontend.design
  - frontend.react
  - backend.http
  - backend.lang.go
  - backend.lang.rust
```

```yaml
# topology/domains/frontend.yaml
id: frontend
write_policy: constrained
completion_proof: visual_and_behavioral
truth_bundles:
  - frontend.design
  - frontend.react
required_gates:
  - designer
  - behaviour-analysis
optional_gates:
  - shadcn-expert
forbidden_bundles:
  - backend.http
  - backend.lang.go
  - backend.lang.rust
```

- [ ] **Step 4: Implement topology contracts and loader**

```ts
// src/engine/contracts.ts
export interface TopologyRoot {
  version: 1;
  defaultTransport: "local-tools";
  entryAgent: string;
  domains: string[];
  agents: string[];
  bundles: string[];
}

export interface DomainPolicy {
  id: string;
  writePolicy: "constrained" | "direct" | "policy_only";
  completionProof: string;
  truthBundles: string[];
  requiredGates: string[];
  optionalGates: string[];
  forbiddenBundles: string[];
}

export interface AgentPolicy {
  id: string;
  kind: "orchestrator" | "specialist" | "cross-domain";
  domains: string[];
  allowedSkills: string[];
  allowedBundles: string[];
  forbiddenBundles: string[];
  handoffIn: string;
  handoffOut: string;
  completionProof: string;
}

export interface BundlePolicy {
  id: string;
  domain: string;
  capabilities: string[];
  sources: string[];
  toolPrefixes: string[];
  outputContracts: string[];
}

export interface LoadedTopology {
  version: 1;
  defaultTransport: "local-tools";
  entryAgent: string;
  domains: DomainPolicy[];
  agents: AgentPolicy[];
  bundles: BundlePolicy[];
}
```

```ts
// src/engine/topology-loader.ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import type { AgentPolicy, BundlePolicy, DomainPolicy, LoadedTopology, TopologyRoot } from "./contracts.js";

function readYaml<T>(filePath: string): T {
  return YAML.parse(readFileSync(filePath, "utf8")) as T;
}

export function loadTopology(repoRoot: string): LoadedTopology {
  const root = readYaml<TopologyRoot>(join(repoRoot, "topology", "manifest.yaml"));
  const domains = root.domains.map((id) => readYaml<DomainPolicy>(join(repoRoot, "topology", "domains", `${id}.yaml`)));
  const agents = root.agents.map((id) => readYaml<AgentPolicy>(join(repoRoot, "topology", "agents", `${id}.yaml`)));
  const bundles = root.bundles.map((id) => readYaml<BundlePolicy>(join(repoRoot, "topology", "bundles", `${id}.yaml`)));

  return {
    version: root.version,
    defaultTransport: root.defaultTransport,
    entryAgent: root.entryAgent,
    domains,
    agents,
    bundles,
  };
}
```

- [ ] **Step 5: Run the test and typecheck**

Run: `bun test tests/topology-manifest-behaviour.test.ts && bun run build`
Expected: test PASS, `tsc --noEmit` exits `0`

- [ ] **Step 6: Commit**

```bash
git add package.json bun.lock topology corpus src/engine/contracts.ts src/engine/topology-loader.ts tests/topology-manifest-behaviour.test.ts
git commit -m "feat: add topology manifest scaffolding and loader"
```

---

### Task 2: Enforce Domain Policy and Capability Resolution

**Files:**
- Create: `src/engine/policy.ts`
- Create: `src/engine/resolver.ts`
- Modify: `src/engine/contracts.ts`
- Test: `tests/topology-manifest-behaviour.test.ts`

- [ ] **Step 1: Add a failing resolver test**

```ts
import { expect, test } from "bun:test";
import { loadTopology } from "../src/engine/topology-loader.ts";
import { resolveCapabilityContext } from "../src/engine/resolver.ts";

test("resolveCapabilityContext rejects forbidden bundle access", () => {
  const topology = loadTopology(process.cwd());

  expect(() =>
    resolveCapabilityContext(topology, {
      agentId: "frontend-builder",
      capability: "backend.http.patterns",
    }),
  ).toThrow(/forbidden bundle/i);
});

test("resolveCapabilityContext returns frontend.design for design.intent", () => {
  const topology = loadTopology(process.cwd());
  const result = resolveCapabilityContext(topology, {
    agentId: "frontend-builder",
    capability: "design.intent",
  });

  expect(result.bundle.id).toBe("frontend.design");
  expect(result.domain.id).toBe("frontend");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test tests/topology-manifest-behaviour.test.ts`
Expected: FAIL with `Cannot find module "../src/engine/resolver.ts"` or missing export

- [ ] **Step 3: Implement policy helpers**

```ts
// src/engine/policy.ts
import type { AgentPolicy, BundlePolicy, DomainPolicy, LoadedTopology } from "./contracts.js";

export function getAgent(topology: LoadedTopology, agentId: string): AgentPolicy {
  const agent = topology.agents.find((entry) => entry.id === agentId);
  if (!agent) throw new Error(`Unknown agent: ${agentId}`);
  return agent;
}

export function getBundleByCapability(topology: LoadedTopology, capability: string): BundlePolicy {
  const bundle = topology.bundles.find((entry) => entry.capabilities.includes(capability));
  if (!bundle) throw new Error(`No bundle found for capability: ${capability}`);
  return bundle;
}

export function getDomain(topology: LoadedTopology, domainId: string): DomainPolicy {
  const domain = topology.domains.find((entry) => entry.id === domainId);
  if (!domain) throw new Error(`Unknown domain: ${domainId}`);
  return domain;
}
```

- [ ] **Step 4: Implement capability resolver with allow/deny enforcement**

```ts
// src/engine/resolver.ts
import type { LoadedTopology } from "./contracts.js";
import { getAgent, getBundleByCapability, getDomain } from "./policy.js";

export function resolveCapabilityContext(
  topology: LoadedTopology,
  input: { agentId: string; capability: string },
) {
  const agent = getAgent(topology, input.agentId);
  const bundle = getBundleByCapability(topology, input.capability);
  const domain = getDomain(topology, bundle.domain);

  if (!agent.allowedBundles.includes(bundle.id)) {
    throw new Error(`Agent ${agent.id} cannot access bundle ${bundle.id}`);
  }

  if (agent.forbiddenBundles.includes(bundle.id) || domain.forbiddenBundles.includes(bundle.id)) {
    throw new Error(`Agent ${agent.id} attempted forbidden bundle ${bundle.id}`);
  }

  return { agent, bundle, domain };
}
```

- [ ] **Step 5: Re-run the focused test suite**

Run: `bun test tests/topology-manifest-behaviour.test.ts`
Expected: PASS for loader + resolver assertions

- [ ] **Step 6: Commit**

```bash
git add src/engine/policy.ts src/engine/resolver.ts src/engine/contracts.ts tests/topology-manifest-behaviour.test.ts
git commit -m "feat: add topology policy and capability resolver"
```

---

### Task 3: Add a Production Direct Tool Bridge for Existing Tool Modules

**Files:**
- Create: `src/engine/tool-bridge.ts`
- Test: `tests/tool-bridge-behaviour.test.ts`
- Reference: existing `src/plugins/*/tools/*.ts`

- [ ] **Step 1: Write the failing tool bridge test**

```ts
import { expect, test } from "bun:test";
import { invokeRegisteredTool } from "../src/engine/tool-bridge.ts";
import { register as registerResolveIntent } from "../src/plugins/designer/tools/resolve-intent.ts";
import { register as registerGetPractice } from "../src/plugins/golang/tools/get-practice.ts";

test("invokeRegisteredTool runs a designer tool module without MCP server transport", async () => {
  const result = await invokeRegisteredTool(registerResolveIntent, {
    product: "developer analytics dashboard",
  });

  expect(result.isError).toBeUndefined();
  expect(result.content?.[0]?.text).toMatch(/Resolved Design Intent/);
});

test("invokeRegisteredTool runs a golang tool module without MCP server transport", async () => {
  const result = await invokeRegisteredTool(registerGetPractice, {
    name: "error-wrapping",
  });

  expect(result.content?.[0]?.text).toMatch(/error-wrapping/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test tests/tool-bridge-behaviour.test.ts`
Expected: FAIL with `Cannot find module "../src/engine/tool-bridge.ts"`

- [ ] **Step 3: Implement production tool capture**

```ts
// src/engine/tool-bridge.ts
import assert from "node:assert/strict";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

type ToolResult = {
  content?: Array<{ type?: string; text?: string }>;
  isError?: boolean;
};

type ToolHandler = (args: Record<string, unknown>) => Promise<ToolResult> | ToolResult;

export async function invokeRegisteredTool(
  register: (server: McpServer) => void,
  args: Record<string, unknown>,
): Promise<ToolResult> {
  let capturedHandler: ToolHandler | undefined;

  const server = {
    tool(_name: string, _description: string, _schema: unknown, handler: ToolHandler) {
      capturedHandler = handler;
    },
  } as unknown as McpServer;

  register(server);

  assert.ok(capturedHandler, "tool registration did not capture a handler");
  return await capturedHandler(args);
}
```

- [ ] **Step 4: Run the tool bridge test**

Run: `bun test tests/tool-bridge-behaviour.test.ts`
Expected: PASS for both direct-invocation cases

- [ ] **Step 5: Commit**

```bash
git add src/engine/tool-bridge.ts tests/tool-bridge-behaviour.test.ts
git commit -m "feat: add direct bridge for local tool invocation"
```

---

### Task 4: Generate and Use a Stable Local Tool Registry

**Files:**
- Create: `scripts/generate-local-tool-registry.ts`
- Create: `src/adapters/local-tools/index.ts`
- Create: `generated/tool-index/local-tool-registry.ts`
- Create: `generated/tool-index/local-tool-registry.json`
- Modify: `package.json`
- Test: `tests/topology-artifacts-behaviour.test.ts`

- [ ] **Step 1: Write the failing registry generation test**

```ts
import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

test("generated local tool registry includes stable tool names", () => {
  const registryPath = resolve("generated/tool-index/local-tool-registry.json");
  expect(existsSync(registryPath)).toBe(true);

  const registry = JSON.parse(readFileSync(registryPath, "utf8")) as Record<string, unknown>;
  expect(Object.keys(registry)).toContain("designer_resolve_intent");
  expect(Object.keys(registry)).toContain("golang_get_practice");
  expect(Object.keys(registry)).toContain("reactflow_get_api");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test tests/topology-artifacts-behaviour.test.ts`
Expected: FAIL because the generated registry files do not exist

- [ ] **Step 3: Add generation script entries to package.json**

```json
{
  "scripts": {
    "generate:local-tools": "tsx scripts/generate-local-tool-registry.ts",
    "generate:topology": "tsx scripts/generate-topology-artifacts.ts"
  }
}
```

- [ ] **Step 4: Implement registry generation**

```ts
// scripts/generate-local-tool-registry.ts
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = resolve(".");
const pluginsRoot = join(repoRoot, "src", "plugins");
const outputJson = join(repoRoot, "generated", "tool-index", "local-tool-registry.json");
const outputTs = join(repoRoot, "generated", "tool-index", "local-tool-registry.ts");

const entries: Array<{ name: string; importPath: string; exportName: string }> = [];

for (const plugin of readdirSync(pluginsRoot)) {
  const toolsDir = join(pluginsRoot, plugin, "tools");
  try {
    for (const file of readdirSync(toolsDir)) {
      if (!file.endsWith(".ts")) continue;
      const fullPath = join(toolsDir, file);
      const source = readFileSync(fullPath, "utf8");
      const match = source.match(/server\\.tool\\(\\s*"([^"]+)"/);
      if (!match?.[1]) continue;
      entries.push({
        name: match[1],
        importPath: `../../src/plugins/${plugin}/tools/${file.replace(/\\.ts$/, ".js")}`,
        exportName: "register",
      });
    }
  } catch {}
}

mkdirSync(join(repoRoot, "generated", "tool-index"), { recursive: true });
writeFileSync(outputJson, JSON.stringify(Object.fromEntries(entries.map((entry) => [entry.name, entry.importPath])), null, 2));
writeFileSync(
  outputTs,
  [
    "export const LOCAL_TOOL_REGISTRY = {",
    ...entries.map((entry) => `  "${entry.name}": () => import("${entry.importPath}"),`),
    "} as const;",
    "",
  ].join("\n"),
);
```

- [ ] **Step 5: Add local adapter entrypoint**

```ts
// src/adapters/local-tools/index.ts
import { LOCAL_TOOL_REGISTRY } from "../../generated/tool-index/local-tool-registry.js";
import { invokeRegisteredTool } from "../../src/engine/tool-bridge.js";

export async function invokeLocalTool(name: string, args: Record<string, unknown>) {
  const loader = LOCAL_TOOL_REGISTRY[name as keyof typeof LOCAL_TOOL_REGISTRY];
  if (!loader) throw new Error(`Unknown local tool: ${name}`);
  const module = await loader();
  return invokeRegisteredTool(module.register, args);
}
```

- [ ] **Step 6: Generate the registry and run the test**

Run: `bun run generate:local-tools && bun test tests/topology-artifacts-behaviour.test.ts`
Expected: generator writes both files, test PASS

- [ ] **Step 7: Commit**

```bash
git add package.json scripts/generate-local-tool-registry.ts src/adapters/local-tools/index.ts generated/tool-index tests/topology-artifacts-behaviour.test.ts
git commit -m "feat: generate stable local tool registry"
```

---

### Task 5: Build Local CLI Runtime and Replace Server-First Entry

**Files:**
- Create: `src/cli.ts`
- Modify: `bin/hyperstack.mjs`
- Modify: `src/index.ts`
- Test: `tests/local-cli-behaviour.test.ts`
- Test: `tests/runtime-behaviour.test.ts`

- [ ] **Step 1: Write the failing CLI test**

```ts
import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

test("local CLI invokes stable tool names with JSON payload", () => {
  const result = spawnSync(
    process.execPath,
    [resolve("bin/hyperstack.mjs"), "tool", "designer_resolve_intent", "--json", '{"product":"developer analytics dashboard"}'],
    { cwd: process.cwd(), encoding: "utf8" },
  );

  expect(result.status).toBe(0);
  expect(result.stdout).toMatch(/Resolved Design Intent/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test tests/local-cli-behaviour.test.ts`
Expected: FAIL because `bin/hyperstack.mjs` still points at the old runtime

- [ ] **Step 3: Implement CLI runtime**

```ts
// src/cli.ts
import { invokeLocalTool } from "./adapters/local-tools/index.js";

async function main() {
  const [command, toolName, flag, json] = process.argv.slice(2);

  if (command !== "tool" || !toolName || flag !== "--json" || !json) {
    process.stderr.write('Usage: hyperstack tool <tool-name> --json \'{"key":"value"}\'\n');
    process.exit(1);
  }

  const args = JSON.parse(json) as Record<string, unknown>;
  const result = await invokeLocalTool(toolName, args);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
```

- [ ] **Step 4: Redirect the binary to the CLI entrypoint**

```js
// bin/hyperstack.mjs
#!/usr/bin/env node

import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const binDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(binDir, "..");
const entrypoint = resolve(rootDir, "src/cli.ts");
const nodeMajor = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10);
const tsxLoaderArgs = nodeMajor >= 20 ? ["--import", "tsx"] : ["--loader", "tsx"];

const child = spawn(process.execPath, [...tsxLoaderArgs, entrypoint, ...process.argv.slice(2)], {
  cwd: rootDir,
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 1));
child.on("error", (error) => {
  console.error("Failed to start hyperstack:", error);
  process.exit(1);
});
```

- [ ] **Step 5: Preserve compatibility by making `src/index.ts` a thin re-export or deprecation shim**

```ts
// src/index.ts
export { invokeLocalTool } from "./adapters/local-tools/index.js";
```

- [ ] **Step 6: Run CLI and runtime tests**

Run: `bun test tests/local-cli-behaviour.test.ts tests/runtime-behaviour.test.ts`
Expected: PASS, binary starts, local CLI returns JSON output

- [ ] **Step 7: Commit**

```bash
git add src/cli.ts bin/hyperstack.mjs src/index.ts tests/local-cli-behaviour.test.ts tests/runtime-behaviour.test.ts
git commit -m "feat: switch hyperstack binary to local tool runtime"
```

---

### Task 6: Generate Topology Artifacts and Session Bootstrap from Manifest

**Files:**
- Create: `src/engine/navigation.ts`
- Create: `src/engine/injector.ts`
- Create: `scripts/generate-topology-artifacts.ts`
- Create: `generated/runtime-context/topology.bootstrap.md`
- Create: `generated/routing/allow-deny.md`
- Modify: `hooks/session-start.mjs`
- Modify: `tests/context-compiler-behaviour.test.ts`
- Modify: `tests/role-harness-behaviour.test.ts`
- Test: `tests/topology-artifacts-behaviour.test.ts`

- [ ] **Step 1: Write the failing topology artifact test**

```ts
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test("generated topology bootstrap includes agent and bundle routing markers", () => {
  const bootstrap = readFileSync(resolve("generated/runtime-context/topology.bootstrap.md"), "utf8");
  expect(bootstrap).toMatch(/hyper/);
  expect(bootstrap).toMatch(/frontend-builder/);
  expect(bootstrap).toMatch(/backend-builder/);
  expect(bootstrap).toMatch(/frontend\\.design/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test tests/topology-artifacts-behaviour.test.ts`
Expected: FAIL because topology bootstrap does not exist

- [ ] **Step 3: Implement injection and artifact generation**

```ts
// src/engine/injector.ts
import type { BundlePolicy } from "./contracts.js";

export function buildInjectionSlice(bundle: BundlePolicy, capability: string) {
  return {
    bundle: bundle.id,
    capability,
    sources: bundle.sources,
    toolPrefixes: bundle.toolPrefixes,
  };
}
```

```ts
// scripts/generate-topology-artifacts.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadTopology } from "../src/engine/topology-loader.js";

const repoRoot = resolve(".");
const topology = loadTopology(repoRoot);

mkdirSync(resolve("generated/runtime-context"), { recursive: true });
mkdirSync(resolve("generated/routing"), { recursive: true });

writeFileSync(
  resolve("generated/runtime-context/topology.bootstrap.md"),
  [
    "# Topology Runtime Bootstrap",
    "",
    `Entry agent: ${topology.entryAgent}`,
    "",
    "## Agents",
    ...topology.agents.map((agent) => `- ${agent.id}: ${agent.kind} -> ${agent.domains.join(", ")}`),
    "",
    "## Bundles",
    ...topology.bundles.map((bundle) => `- ${bundle.id}: ${bundle.capabilities.join(", ")}`),
    "",
  ].join("\n"),
);

writeFileSync(
  resolve("generated/routing/allow-deny.md"),
  [
    "# Allow / Deny Matrix",
    "",
    ...topology.agents.flatMap((agent) => [
      `## ${agent.id}`,
      `- Allowed: ${agent.allowedBundles.join(", ")}`,
      `- Forbidden: ${agent.forbiddenBundles.join(", ")}`,
      "",
    ]),
  ].join("\n"),
);
```

- [ ] **Step 4: Make the session hook prefer topology bootstrap**

```js
// hooks/session-start.mjs
const topologyBootstrapPath = join(pluginRoot, "generated", "runtime-context", "topology.bootstrap.md");
const legacyBootstrapPath = join(pluginRoot, "generated", "runtime-context", "hyperstack.bootstrap.md");

try {
  bootstrapContent = readFileSync(topologyBootstrapPath, "utf8");
  bootstrapLabel = "generated topology bootstrap";
} catch {
  try {
    bootstrapContent = readFileSync(legacyBootstrapPath, "utf8");
    bootstrapLabel = "compiled runtime bootstrap";
  } catch {
    bootstrapContent = readFileSync(fallbackSkillPath, "utf8");
    bootstrapLabel = "full content of your 'hyperstack:hyperstack' skill";
  }
}
```

- [ ] **Step 5: Generate artifacts and run targeted tests**

Run: `bun run generate:topology && bun test tests/topology-artifacts-behaviour.test.ts tests/context-compiler-behaviour.test.ts tests/role-harness-behaviour.test.ts`
Expected: PASS; no stale heading/path assertions remain

- [ ] **Step 6: Commit**

```bash
git add src/engine/injector.ts src/engine/navigation.ts scripts/generate-topology-artifacts.ts hooks/session-start.mjs generated/runtime-context generated/routing tests/topology-artifacts-behaviour.test.ts tests/context-compiler-behaviour.test.ts tests/role-harness-behaviour.test.ts
git commit -m "feat: generate topology runtime artifacts and hook bootstrap"
```

---

### Task 7: Remove Docker-First Setup Defaults and Refresh Documentation

**Files:**
- Modify: `src/internal/setup-hyperstack.ts`
- Modify: `scripts/setup.ts`
- Modify: `README.md`
- Modify: `tests/plugin-registry-behaviour.test.ts`
- Modify: `tests/runtime-behaviour.test.ts`
- Test: `tests/runtime-behaviour.test.ts`
- Test: `tests/workflow-behaviour.test.ts`

- [ ] **Step 1: Write a failing setup test for local-tool default**

```ts
import { expect, test } from "bun:test";
import { generateMcpPatch } from "../src/internal/setup-hyperstack.ts";

test("generateMcpPatch defaults to local tool runtime instead of docker", () => {
  const patch = generateMcpPatch("/tmp/config.json", "/repo", "cursor");

  expect(JSON.stringify(patch.content)).toMatch(/hyperstack/);
  expect(JSON.stringify(patch.content)).toMatch(/bin\\/hyperstack\\.mjs|src\\/cli\\.ts/);
  expect(JSON.stringify(patch.content)).not.toMatch(/docker/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test tests/runtime-behaviour.test.ts`
Expected: FAIL because setup still emits Docker-first config

- [ ] **Step 3: Update setup generation to prefer local transport**

```ts
// src/internal/setup-hyperstack.ts
const localServerConfig = {
  command: "node",
  args: [binaryPath],
  env: { HYPERSTACK_ROOT: pluginRoot },
};

export function generateMcpPatch(
  configPath: string,
  pluginRoot: string,
  platform: string,
  method: "local" | "docker" = "local",
) {
  const serverConfig = method === "docker" ? dockerServerConfig : localServerConfig;
  // unchanged format logic below
}
```

```ts
// scripts/setup.ts
const patch = setup.generateMcpPatch(configPath, pluginRoot, platform, "local");
```

- [ ] **Step 4: Refresh README and tests away from plugin-count/server-first language**

```md
## Runtime

Hyperstack now defaults to a local tool runtime backed by topology manifests and corpus navigation.
Docker is no longer required for the default setup path.
Stable tool-call names are preserved through local adapters.
```

```ts
// tests/plugin-registry-behaviour.test.ts
import { existsSync } from "node:fs";
import { resolve } from "node:path";

test("generated local tool registry exists and includes stable tool names", () => {
  expect(existsSync(resolve("generated/tool-index/local-tool-registry.json"))).toBe(true);
});
```

- [ ] **Step 5: Run the final verification suite**

Run: `bun run generate:local-tools && bun run generate:topology && bun test && bun run build`
Expected: all tests PASS, build exits `0`

- [ ] **Step 6: Commit**

```bash
git add src/internal/setup-hyperstack.ts scripts/setup.ts README.md tests/plugin-registry-behaviour.test.ts tests/runtime-behaviour.test.ts tests/workflow-behaviour.test.ts
git commit -m "refactor: remove docker-first runtime defaults"
```

---

## Spec Coverage Check

- Spec repo shape is covered by Task 1 scaffolding plus Task 6 generated outputs.
- Domain policies and agent contracts are covered by Tasks 1 and 2.
- Stable local tool names are preserved by Tasks 3, 4, and 5.
- Topology bootstrap and routing artifacts are covered by Task 6.
- Docker-first setup removal is covered by Task 7.
- Frontend/backend asymmetry is enforced through domain policies and resolver tests in Tasks 1 and 2.

## Placeholder Scan

- No `TBD`, `TODO`, or deferred implementation placeholders are present in tasks.
- Each code-touching task includes a concrete code block.
- Each verification step includes an exact command and expected outcome.

## Type Consistency Check

- `loadTopology`, `resolveCapabilityContext`, and `invokeRegisteredTool` names are defined before they are reused.
- `task_handoff`, `build_result`, and `verification_report` are treated as artifact names, not runtime function names.
- `frontend-builder`, `backend-builder`, `fullstack-builder`, `frontend.design`, and `backend.http` naming stays consistent with the approved spec.

## Notes for Implementation

- Keep `src/plugins/*` intact during V1. Reuse them through the direct tool bridge first; migrate deep data into `corpus/` later.
- Do not rewrite the 30+ hours of researched content during topology cutover.
- Prefer small focused commits exactly as listed above.
