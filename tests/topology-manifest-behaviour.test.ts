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
