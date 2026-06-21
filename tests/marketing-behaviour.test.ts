import { test, expect } from "bun:test";
import { buildBrief, FULL_WORKFLOW } from "../src/plugins/marketing/data.ts";
import { captureTool, extractTextContent } from "./helpers.ts";
import { register as getPositioning } from "../src/plugins/marketing/tools/get-positioning.ts";
import { register as getFormulas } from "../src/plugins/marketing/tools/get-copywriting-formulas.ts";
import { register as getChannels } from "../src/plugins/marketing/tools/get-channels.ts";
import { register as brief } from "../src/plugins/marketing/tools/brief.ts";

// --- the brief assembler ---
test("full workflow leads with positioning", () => {
  expect(FULL_WORKFLOW[0].step).toBe("Position");
});

test("buildBrief returns the full workflow when no deliverables given", () => {
  expect(buildBrief()).toEqual(FULL_WORKFLOW);
});

test("buildBrief for copy returns write+voice+check, not positioning", () => {
  const steps = buildBrief(["copy"]).map((s) => s.step);
  expect(steps).toContain("Write");
  expect(steps).toContain("Voice");
  expect(steps).toContain("Check");
  expect(steps).not.toContain("Position");
});

// --- tools serve ground-truth frameworks ---
test("get_positioning returns Dunford's components", async () => {
  const tool = captureTool(getPositioning);
  expect(tool.name).toBe("marketing_get_positioning");
  const text = extractTextContent(await tool.invoke({}));
  expect(text).toMatch(/competitive alternatives/i);
  expect(text).toMatch(/market category/i);
});

test("get_copywriting_formulas returns PAS and AIDA templates", async () => {
  const tool = captureTool(getFormulas);
  const text = extractTextContent(await tool.invoke({}));
  expect(text).toMatch(/PAS/);
  expect(text).toMatch(/AIDA/);
});

test("get_channels returns the Bullseye framework", async () => {
  const tool = captureTool(getChannels);
  const text = extractTextContent(await tool.invoke({}));
  expect(text).toMatch(/Bullseye/i);
});

test("brief assembles an ordered plan for a specific brand", async () => {
  const tool = captureTool(brief);
  expect(tool.name).toBe("marketing_brief");
  const text = extractTextContent(await tool.invoke({ brand: "a meditation app for busy parents" }));
  expect(text).toMatch(/meditation app/);
  expect(text).toMatch(/Position/);
});
