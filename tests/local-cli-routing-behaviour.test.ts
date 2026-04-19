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
