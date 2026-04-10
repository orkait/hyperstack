import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

test("publish workflow verifies the package across the supported OS and Bun matrix before publishing", async () => {
  const workflow = (await readFile(resolve(".github/workflows/publish.yml"), "utf8")).replace(/\r\n/g, "\n");

  assert.match(workflow, /pull_request:/, "workflow should validate on pull requests");
  assert.match(workflow, /strategy:\s*\n(?:\s+.*\n)*?\s+matrix:/, "workflow should define a matrix strategy");
  assert.match(
    workflow,
    /os:\s*\[ubuntu-latest,\s*macos-latest,\s*windows-latest\]/,
    "workflow should verify on ubuntu, macOS, and Windows",
  );
  assert.match(workflow, /bun-version:/, "workflow should verify with Bun");
  assert.match(workflow, /needs:\s*verify/, "publish job should wait for the verification matrix");
  assert.match(
    workflow,
    /if:\s*github\.event_name\s*!=\s*'pull_request'/,
    "publish job should not push images from pull request runs",
  );
});
