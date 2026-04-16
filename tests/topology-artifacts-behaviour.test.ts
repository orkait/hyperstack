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
