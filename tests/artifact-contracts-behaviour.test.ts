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
