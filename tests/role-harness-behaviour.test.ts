import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  compileUsingHyperstackBootstrap,
  validateUsingHyperstackBootstrap,
} from "../src/internal/context-compiler.ts";

const REQUIRED_ROLE_FILES = [
  "agents/main/PROFILE.md",
  "agents/main/LIFECYCLE.md",
  "agents/main/CONTEXT.md",
  "agents/main/CHECKS.md",
  "agents/website-builder/PROFILE.md",
  "agents/website-builder/LIFECYCLE.md",
  "agents/website-builder/CONTEXT.md",
  "agents/website-builder/CHECKS.md",
  "harness/router.md",
  "harness/transitions.md",
  "harness/context-policy.md",
  "harness/observability.md",
];

const REQUIRED_PROFILE_KEYS = [
  "name",
  "kind",
  "auto_invoke_when",
  "owns",
  "must_not_do",
  "delegates_to",
  "requires",
];

test("role harness files exist for main and website-builder", () => {
  for (const relativePath of REQUIRED_ROLE_FILES) {
    assert.ok(existsSync(resolve(relativePath)), `Missing role harness file: ${relativePath}`);
  }
});

test("role profile frontmatter includes the required contract keys", () => {
  for (const relativePath of [
    "agents/main/PROFILE.md",
    "agents/website-builder/PROFILE.md",
  ]) {
    const content = readFileSync(resolve(relativePath), "utf8");
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---\n/);
    assert.ok(frontmatter?.[1], `Missing frontmatter in ${relativePath}`);

    for (const key of REQUIRED_PROFILE_KEYS) {
      assert.match(frontmatter[1], new RegExp(`^${key}:`, "m"), `Missing frontmatter key "${key}" in ${relativePath}`);
    }
  }
});

test("role lifecycle and checks documents expose required headings", () => {
  const lifecycleContent = readFileSync(resolve("agents/main/LIFECYCLE.md"), "utf8");
  assert.match(lifecycleContent, /^## Entry Criteria$/m);
  assert.match(lifecycleContent, /^## Steps$/m);
  assert.match(lifecycleContent, /^## Handoffs$/m);
  assert.match(lifecycleContent, /^## Exit Criteria$/m);
  assert.match(lifecycleContent, /^## Failure Escalation$/m);

  const checksContent = readFileSync(resolve("agents/website-builder/CHECKS.md"), "utf8");
  assert.match(checksContent, /^## Preconditions$/m);
  assert.match(checksContent, /^## Required Evidence$/m);
  assert.match(checksContent, /^## Done Criteria$/m);
  assert.match(checksContent, /^## Red Flags$/m);
});

test("using-hyperstack bootstrap compiler preserves role-routing markers", () => {
  const source = readFileSync(resolve("skills/using-hyperstack/SKILL.md"), "utf8");
  const { content } = compileUsingHyperstackBootstrap(source);
  const missing = validateUsingHyperstackBootstrap(content);

  assert.equal(missing.length, 0, `Missing bootstrap markers: ${missing.join(", ")}`);
  assert.match(content, /main/);
  assert.match(content, /website-builder/);
  assert.match(content, /auto-called/);
  assert.match(content, /main -> website-builder/);
});

test("website-builder lifecycle requires workspace discovery before website decisions", () => {
  const lifecycleContent = readFileSync(resolve("agents/website-builder/LIFECYCLE.md"), "utf8");
  const contextContent = readFileSync(resolve("agents/website-builder/CONTEXT.md"), "utf8");

  assert.match(lifecycleContent, /workspace/i);
  assert.match(lifecycleContent, /package\.json|manifests?|dependencies|packages/i);
  assert.match(lifecycleContent, /frontend core files|core frontend files|routes|components|tokens|styles/i);
  assert.match(contextContent, /package\.json|manifests?|dependencies|packages/i);
});

test("designer skill gives user preferences precedence over auto-resolved defaults", () => {
  const designerContent = readFileSync(resolve("skills/designer/SKILL.md"), "utf8");

  assert.match(designerContent, /user preferences?/i);
  assert.match(designerContent, /preferences?.*override|override.*preferences?/i);
  assert.match(designerContent, /auto-resolved defaults?|defaults?.*suggestions?/i);
});
