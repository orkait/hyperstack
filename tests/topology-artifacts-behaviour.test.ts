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

test("generated topology bootstrap includes agent and bundle routing markers", () => {
  const bootstrap = readFileSync(resolve("generated/runtime-context/topology.bootstrap.md"), "utf8");
  expect(bootstrap).toMatch(/workspace_inventory/);
  expect(bootstrap).toMatch(/hyper/);
  expect(bootstrap).toMatch(/frontend-builder/);
  expect(bootstrap).toMatch(/backend-builder/);
  expect(bootstrap).toMatch(/frontend\.design/);
  expect(bootstrap).toMatch(/design contract is conditional/i);
  expect(bootstrap).toMatch(/cross-domain agent: fullstack-builder/i);
  expect(bootstrap).toMatch(/backend\.golang/);
  expect(bootstrap).toMatch(/frontend\.ui-ux/);
});
