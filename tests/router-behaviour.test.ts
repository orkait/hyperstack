import { expect, test } from "bun:test";
import { loadTopology } from "../src/engine/topology-loader.ts";
import { routeRequest } from "../src/engine/router.ts";
import { assertSkillAllowedForAgent } from "../src/engine/skill-enforcer.ts";

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
