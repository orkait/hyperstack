import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  compileUsingHyperstackBootstrap,
  validateUsingHyperstackBootstrap,
} from "../src/internal/context-compiler.ts";

test("compileUsingHyperstackBootstrap keeps required invariants while shrinking the source", () => {
  const source = readFileSync(resolve("skills/using-hyperstack/SKILL.md"), "utf8");
  const { content, stats } = compileUsingHyperstackBootstrap(source);
  const missing = validateUsingHyperstackBootstrap(content);

  assert.equal(missing.length, 0, `Missing bootstrap markers: ${missing.join(", ")}`);
  assert.ok(stats.artifactChars < stats.sourceChars, "Compiled bootstrap should be smaller than source");
  assert.ok(stats.savingsRatio >= 0.2, `Expected at least 20% savings, got ${(stats.savingsRatio * 100).toFixed(1)}%`);
});

test("generated bootstrap artifact stays in sync with the compiler output", () => {
  const source = readFileSync(resolve("skills/using-hyperstack/SKILL.md"), "utf8");
  const generated = readFileSync(resolve("generated/runtime-context/using-hyperstack.bootstrap.md"), "utf8");
  const { content } = compileUsingHyperstackBootstrap(source);

  assert.equal(generated, content, "Generated bootstrap artifact is stale. Run `bun run compile:context`.");
});
