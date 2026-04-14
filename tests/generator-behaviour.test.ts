import { test, expect } from "bun:test";
import { generateFlowCode } from "../src/plugins/reactflow/tools/generate-flow.ts";
import { generateAnimationCode } from "../src/plugins/motion/tools/generate-animation.ts";
import { generateSetupCode } from "../src/plugins/lenis/tools/generate-setup.ts";
import { buildTasks, parseDesignMd } from "../src/plugins/designer/tools/generate-implementation-plan.ts";

test("reactflow_generate_flow returns self-contained controlled-flow code", () => {
  const result = generateFlowCode("simple flow", false);
  expect(result).toMatch(/import { .*ReactFlow.* } from '@xyflow\/react'/);
  expect(result).toMatch(/useNodesState/);
  expect(result).toMatch(/useEdgesState/);
});

test("motion_generate_animation does not emit placeholder exit keys", () => {
  const result = generateAnimationCode("fade in");
  expect(result).not.toMatch(/exit=\{\}/);
});

test("motion_generate_animation declares list inputs for staggered list output", () => {
  const result = generateAnimationCode("staggered list");
  expect(result).toMatch(/items\.map/);
});

test("lenis_generate_setup uses a reactive reduced-motion check", () => {
  const { code } = generateSetupCode("next.js setup with basic accessibility");
  expect(code).toMatch(/useReducedMotion|matchMedia/);
});

test("buildTasks preserves multi-word component names from DESIGN.md", () => {
  const designMd = `## 5. Components\n\n### Header Navigation\n- Build a header with navigation.`;
  const sections = parseDesignMd(designMd);
  const tasks = buildTasks(sections, "react");
  expect(tasks.some((t) => t.name.includes("Header Navigation"))).toBe(true);
});
