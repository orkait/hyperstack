import { test, expect } from "bun:test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

test("publish workflow verifies the package across the supported OS and Bun matrix before publishing", async () => {
  const workflow = (await readFile(resolve(".github/workflows/publish.yml"), "utf8")).replace(/\r\n/g, "\n");

  expect(workflow).toMatch(/pull_request:/);
  expect(workflow).toMatch(/strategy:\s*\n(?:\s+.*\n)*?\s+matrix:/);
  expect(workflow).toMatch(/os:\s*\[ubuntu-latest,\s*macos-latest,\s*windows-latest\]/);
  expect(workflow).toMatch(/bun-version:/);
  expect(workflow).toMatch(/needs:\s*verify/);
  expect(workflow).toMatch(/gh release create/);
  expect(workflow).toMatch(/docker\/build-push-action/);
});
