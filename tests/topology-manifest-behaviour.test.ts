import { expect, test } from "bun:test";
import { loadTopology } from "../src/engine/topology-loader.ts";
import { resolveCapabilityContext } from "../src/engine/resolver.ts";

test("loadTopology reads root manifest and expanded domain/agent/bundle files", () => {
  const topology = loadTopology(process.cwd());

  expect(topology.version).toBe(1);
  expect(topology.entryAgent).toBe("hyper");
  expect(topology.domains.map((d) => d.id)).toEqual(["frontend", "backend", "shared"]);
  expect(topology.agents.map((a) => a.id)).toContain("frontend-builder");
  expect(topology.bundles.map((b) => b.id)).toContain("frontend.design");
});

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

test("loadTopology reads artifact contracts and route defaults", () => {
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
