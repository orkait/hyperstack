import { test, expect } from "bun:test";
import {
  FOUR_RISKS,
  classifyOpportunityVsSolution,
  validateJobStatement,
  scoreRice,
  PM_OWNED_RISKS,
} from "../src/plugins/product-manager/data.ts";

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
