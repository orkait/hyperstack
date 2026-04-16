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
