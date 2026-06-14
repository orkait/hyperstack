import { test, expect } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { captureTool, extractTextContent } from "./helpers.ts";
import { register as getRules } from "../src/plugins/shadcn/tools/get-rules.ts";

test("shadcn rules surface uses the canonical cn import path", async () => {
  const tool = captureTool(getRules);
  const text = extractTextContent(await tool.invoke({}));
  expect(text).toContain("@/lib/utils");
  expect(text).not.toContain("@repo/ui-utils");
});

test("orphan shared/rules.ts is removed (single source of truth)", () => {
  expect(existsSync(resolve("src/plugins/shadcn/shared/rules.ts"))).toBe(false);
});
