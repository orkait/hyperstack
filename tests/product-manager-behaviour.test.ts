import { test, expect } from "bun:test";
import {
  FOUR_RISKS,
  classifyOpportunityVsSolution,
  validateJobStatement,
  scoreRice,
  PM_OWNED_RISKS,
} from "../src/plugins/product-manager/data.ts";
import { captureTool, extractTextContent } from "./helpers.ts";
import { register as getFourRisks } from "../src/plugins/product-manager/tools/get-four-risks.ts";
import { register as getAntiPatterns } from "../src/plugins/product-manager/tools/get-anti-patterns.ts";
import { register as oppVsSol } from "../src/plugins/product-manager/tools/opportunity-vs-solution.ts";
import { register as scoreRiceTool } from "../src/plugins/product-manager/tools/score-rice.ts";
import { register as resolveDecision } from "../src/plugins/product-manager/tools/resolve-product-decision.ts";

test("four risks are exactly the canonical four", () => {
  expect(FOUR_RISKS.map((r) => r.id).sort()).toEqual(
    ["feasibility", "usability", "value", "viability"],
  );
});

test("PM owns exactly value and viability", () => {
  expect([...PM_OWNED_RISKS].sort()).toEqual(["value", "viability"]);
});

test("single-path statement is classified as a solution, not an opportunity", () => {
  const r = classifyOpportunityVsSolution("add a dark mode toggle");
  expect(r.isOpportunity).toBe(false);
});

test("multi-path statement is classified as an opportunity", () => {
  const r = classifyOpportunityVsSolution("users cannot find their past orders");
  expect(r.isOpportunity).toBe(true);
});

test("job statement missing context fails validation", () => {
  const r = validateJobStatement("I want a faster app");
  expect(r.valid).toBe(false);
  expect(r.failed.length).toBeGreaterThan(0);
});

test("rice score is (reach*impact*confidence)/effort", () => {
  expect(scoreRice({ reach: 100, impact: 2, confidence: 0.8, effort: 4 }).score).toBeCloseTo(40);
});

test("get_four_risks names value and viability as PM-owned", async () => {
  const tool = captureTool(getFourRisks);
  expect(tool.name).toBe("product_manager_get_four_risks");
  const text = extractTextContent(await tool.invoke({}));
  expect(text).toMatch(/value/i);
  expect(text).toMatch(/viability/i);
  expect(text).toMatch(/product-manager/);
});

test("get_anti_patterns includes the feature-factory smell", async () => {
  const tool = captureTool(getAntiPatterns);
  const text = extractTextContent(await tool.invoke({}));
  expect(text).toMatch(/feature-factory/);
});

test("opportunity_vs_solution flags a solution-shaped statement", async () => {
  const tool = captureTool(oppVsSol);
  expect(tool.name).toBe("product_manager_opportunity_vs_solution");
  const text = extractTextContent(await tool.invoke({ statement: "add a dark mode toggle" }));
  expect(text).toMatch(/solution/i);
});

test("score_rice renders the computed score", async () => {
  const tool = captureTool(scoreRiceTool);
  const text = extractTextContent(await tool.invoke({ reach: 100, impact: 2, confidence: 0.8, effort: 4 }));
  expect(text).toMatch(/40/);
});

test("resolve_product_decision emits a verdict and the four risks", async () => {
  const tool = captureTool(resolveDecision);
  expect(tool.name).toBe("product_manager_resolve_product_decision");
  const text = extractTextContent(await tool.invoke({ description: "add a dark mode toggle" }));
  expect(text).toMatch(/VERDICT|NEEDS-INPUT|BLOCK|PASS/);
  expect(text).toMatch(/viability/i);
});
