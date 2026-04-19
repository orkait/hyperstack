import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

test("local CLI invokes stable tool names with JSON payload", () => {
  const result = spawnSync(
    process.execPath,
    [
      resolve("bin/hyperstack.mjs"),
      "tool",
      "designer_resolve_intent",
      "--json",
      '{"product":"developer analytics dashboard"}',
    ],
    { cwd: process.cwd(), encoding: "utf8" },
  );

  expect(result.status).toBe(0);
  expect(result.stdout).toMatch(/Resolved Design Intent/);
});
