import { test, expect } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  compileUsingHyperstackBootstrap,
  validateUsingHyperstackBootstrap,
} from "../src/internal/context-compiler.ts";

const REQUIRED_ROLE_FILES = [
  "agents/hyper/PROFILE.md",
  "agents/hyper/LIFECYCLE.md",
  "agents/hyper/CONTEXT.md",
  "agents/hyper/CHECKS.md",
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

function normalize(str: string): string {
  return str.replace(/\r\n/g, "\n");
}

test("role harness files exist for hyper and website-builder", () => {
  for (const relativePath of REQUIRED_ROLE_FILES) {
    expect(existsSync(resolve(relativePath))).toBe(true);
  }
});

test("role profile frontmatter includes the required contract keys", () => {
  for (const relativePath of [
    "agents/hyper/PROFILE.md",
    "agents/website-builder/PROFILE.md",
  ]) {
    const content = normalize(readFileSync(resolve(relativePath), "utf8"));
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---\n/);
    expect(frontmatter?.[1]).toBeDefined();

    if (frontmatter) {
      for (const key of REQUIRED_PROFILE_KEYS) {
        expect(frontmatter[1]).toMatch(new RegExp(`^${key}:`, "m"));
      }
    }
  }
});

test("role lifecycle and checks documents expose required headings", () => {
  const lifecycleContent = normalize(readFileSync(resolve("agents/hyper/LIFECYCLE.md"), "utf8"));
  expect(lifecycleContent).toMatch(/^## Entry Criteria$/m);
  expect(lifecycleContent).toMatch(/^## Steps$/m);
  expect(lifecycleContent).toMatch(/^## Handoffs$/m);
  expect(lifecycleContent).toMatch(/^## Exit Criteria$/m);
  expect(lifecycleContent).toMatch(/^## Failure Escalation$/m);

  const checksContent = normalize(readFileSync(resolve("agents/website-builder/CHECKS.md"), "utf8"));
  expect(checksContent).toMatch(/^## Preconditions$/m);
  expect(checksContent).toMatch(/^## Required Evidence$/m);
  expect(checksContent).toMatch(/^## Done Criteria$/m);
  expect(checksContent).toMatch(/^## Red Flags$/m);
});

test("hyperstack bootstrap compiler preserves role-routing markers", () => {
  const source = normalize(readFileSync(resolve("skills/hyperstack/SKILL.md"), "utf8"));
  const { content } = compileUsingHyperstackBootstrap(source);
  const missing = validateUsingHyperstackBootstrap(content);

  expect(missing.length).toBe(0);
  expect(content).toMatch(/hyper/);
  expect(content).toMatch(/website-builder/);
  expect(content).toMatch(/auto-called/);
  expect(content).toMatch(/hyper -> website-builder/);
});

test("website-builder lifecycle requires workspace discovery before website decisions", () => {
  const lifecycleContent = normalize(readFileSync(resolve("agents/website-builder/LIFECYCLE.md"), "utf8"));
  const contextContent = normalize(readFileSync(resolve("agents/website-builder/CONTEXT.md"), "utf8"));

  expect(lifecycleContent).toMatch(/workspace/i);
  expect(lifecycleContent).toMatch(/package\.json|manifests?|dependencies|packages/i);
  expect(lifecycleContent).toMatch(/frontend core files|core frontend files|routes|components|tokens|styles/i);
  expect(contextContent).toMatch(/package\.json|manifests?|dependencies|packages/i);
});

test("designer skill gives user preferences precedence over auto-resolved defaults", () => {
  const designerContent = normalize(readFileSync(resolve("skills/designer/SKILL.md"), "utf8"));

  expect(designerContent).toMatch(/user preferences?/i);
  expect(designerContent).toMatch(/preferences?.*override|override.*preferences?/i);
  expect(designerContent).toMatch(/auto-resolved defaults?|defaults?.*suggestions?/i);
});
