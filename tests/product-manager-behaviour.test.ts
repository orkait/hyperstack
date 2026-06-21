import { test, expect } from "bun:test";
import {
  FOUR_RISKS,
  PM_OWNED_RISKS,
  computeDecision,
  scoreRice,
} from "../src/plugins/product-manager/data.ts";
import { captureTool, extractTextContent } from "./helpers.ts";
import { register as getFourRisks } from "../src/plugins/product-manager/tools/get-four-risks.ts";
import { register as getAntiPatterns } from "../src/plugins/product-manager/tools/get-anti-patterns.ts";
import { register as oppVsSol } from "../src/plugins/product-manager/tools/opportunity-vs-solution.ts";
import { register as validateJob } from "../src/plugins/product-manager/tools/validate-job-statement.ts";
import { register as scoreRiceTool } from "../src/plugins/product-manager/tools/score-rice.ts";
import { register as resolveDecision } from "../src/plugins/product-manager/tools/resolve-product-decision.ts";
import { register as getPrioritization } from "../src/plugins/product-manager/tools/get-prioritization.ts";
import { register as getDecisionTools } from "../src/plugins/product-manager/tools/get-decision-tools.ts";
import { register as getMvpScoping } from "../src/plugins/product-manager/tools/get-mvp-scoping.ts";

// --- data layer ---
test("four risks are exactly the canonical four", () => {
  expect(FOUR_RISKS.map((r) => r.id).sort()).toEqual(["feasibility", "usability", "value", "viability"]);
});

test("PM owns exactly value and viability", () => {
  expect([...PM_OWNED_RISKS].sort()).toEqual(["value", "viability"]);
});

test("rice score is (reach*impact*confidence)/effort", () => {
  expect(scoreRice({ reach: 100, impact: 2, confidence: 0.8, effort: 4 }).score).toBeCloseTo(40);
});

// --- the real gate: PASS is earned, BLOCK on missing, ADVISORY for tweaks ---
test("computeDecision PASSes when value and viability are both assessed", () => {
  const d = computeDecision({
    description: "x",
    valueAssessment: "users repeatedly ask for this in interviews, strong pull",
    viabilityAssessment: "no legal/support cost, fits the paid tier",
    isNetNew: true,
  });
  expect(d.verdict).toBe("PASS");
  expect(d.missing).toEqual([]);
});

test("computeDecision BLOCKs a net-new build with viability unaddressed", () => {
  const d = computeDecision({
    description: "x",
    valueAssessment: "users repeatedly ask for this, strong evidence of pull",
    isNetNew: true,
  });
  expect(d.verdict).toBe("BLOCK");
  expect(d.missing).toContain("viability");
});

test("computeDecision is ADVISORY (not BLOCK) for a tweak", () => {
  const d = computeDecision({ description: "x", isNetNew: false });
  expect(d.verdict).toBe("ADVISORY");
});

// --- tools ---
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

test("opportunity_vs_solution returns the rubric for the agent to apply, not a verdict", async () => {
  const tool = captureTool(oppVsSol);
  expect(tool.name).toBe("product_manager_opportunity_vs_solution");
  const text = extractTextContent(await tool.invoke({ statement: "add a dark mode toggle" }));
  expect(text).toMatch(/more than one way/i);
  expect(text).toMatch(/rubric/i);
});

test("validate_job_statement returns the criteria rubric", async () => {
  const tool = captureTool(validateJob);
  const text = extractTextContent(await tool.invoke({ statement: "I want a faster app" }));
  expect(text).toMatch(/criteria/i);
  expect(text).toMatch(/context/i);
});

test("score_rice renders the computed score", async () => {
  const tool = captureTool(scoreRiceTool);
  const text = extractTextContent(await tool.invoke({ reach: 100, impact: 2, confidence: 0.8, effort: 4 }));
  expect(text).toMatch(/40/);
});

test("resolve_product_decision BLOCKs a net-new build with no assessments", async () => {
  const tool = captureTool(resolveDecision);
  expect(tool.name).toBe("product_manager_resolve_product_decision");
  const text = extractTextContent(await tool.invoke({ description: "add CSV export", isNetNew: true }));
  expect(text).toMatch(/BLOCK/);
  expect(text).toMatch(/value/i);
  expect(text).toMatch(/viability/i);
});

test("resolve_product_decision PASSes when value and viability are supplied", async () => {
  const tool = captureTool(resolveDecision);
  const text = extractTextContent(await tool.invoke({
    description: "add CSV export",
    valueAssessment: "top request from power users who export to Excel weekly",
    viabilityAssessment: "trivial to support, no legal exposure, fits all tiers",
    isNetNew: true,
  }));
  expect(text).toMatch(/PASS/);
});

test("get_prioritization includes Kano and MoSCoW", async () => {
  const tool = captureTool(getPrioritization);
  expect(tool.name).toBe("product_manager_get_prioritization");
  const text = extractTextContent(await tool.invoke({}));
  expect(text).toMatch(/Kano/);
  expect(text).toMatch(/MoSCoW/);
});

test("get_decision_tools includes Type 1/Type 2 and pre-mortem", async () => {
  const tool = captureTool(getDecisionTools);
  const text = extractTextContent(await tool.invoke({}));
  expect(text).toMatch(/Type 1/);
  expect(text).toMatch(/[Pp]re-mortem/);
});

test("get_mvp_scoping includes the riskiest assumption test", async () => {
  const tool = captureTool(getMvpScoping);
  const text = extractTextContent(await tool.invoke({}));
  expect(text).toMatch(/Riskiest Assumption|riskiest assumption/);
});
