// Product-Manager persona - the PM DECISION MENU, not project opinions.
//
// Carries only stable, source-cited PM craft (Cagan/SVPG, Torres, Intercom,
// Christensen, Doshi) transcribed from docs/research/2026-06-21-pm-craft-corpus.json.
// Tools surface these frameworks so the agent makes grounded value+viability
// calls before design/build. No project-specific product opinions live here.

export interface ProductRisk {
  id: "value" | "usability" | "feasibility" | "viability";
  question: string;
  owner: "product-manager" | "designer" | "engineer";
}

export const FOUR_RISKS: ProductRisk[] = [
  { id: "value",       question: "Will customers buy it, or will users choose to use it?", owner: "product-manager" },
  { id: "usability",   question: "Can users figure out how to use it?", owner: "designer" },
  { id: "feasibility", question: "Can engineers build it with available time, skills, and tech?", owner: "engineer" },
  { id: "viability",   question: "Does it work for the business - legal, sales, finance, marketing, support?", owner: "product-manager" },
];

export const PM_OWNED_RISKS: ReadonlySet<string> = new Set(
  FOUR_RISKS.filter((r) => r.owner === "product-manager").map((r) => r.id),
);

export interface AntiPattern {
  id: string;
  smell: string;
  source: string;
}

export const ANTI_PATTERNS: AntiPattern[] = [
  { id: "feature-factory", smell: "Shipping as many stakeholder features as possible. Cagan: that is 'really no product strategy at all.'", source: "Cagan/SVPG" },
  { id: "reactivity", smell: "Driven by reacting to sales, competitors, requests, or price pressure instead of a product vision.", source: "Cagan/SVPG" },
  { id: "viability-avoidance", smell: "Reasoning covers value/desirability but is silent on whether the business can sell, support, fund, or legally ship it.", source: "Cagan/SVPG" },
  { id: "execution-misdiagnosis", smell: "Treating a strategy, interpersonal, OR culture problem as an execution problem and band-aiding it.", source: "Doshi" },
  { id: "opinion-requirement", smell: "A requirement justified by 'a customer said they want X' (opinion/hypothetical) instead of an observed past-behaviour story.", source: "Torres / The Mom Test" },
];

export const DISCOVERY_RULES: string[] = [
  "Engage customers continuously (aspirationally weekly); minimize build decisions made without customer evidence.",
  "Never ask customers what they want or need - cognitive biases make opinion answers unreliable.",
  "Elicit needs, pains, and desires through specific PAST-BEHAVIOUR stories.",
  "Demographics do not predict intent; the JOB the customer hires the product for does.",
];

export const STRATEGY_RULES: string[] = [
  "Strategy decides which problems to solve NOW by focusing on a FEW (2-3) critical business levers.",
  "Prioritization is an act of saying NO: focus means rejecting the hundred other good ideas.",
  "A 'strategy' that is a long list rejecting nothing is not a strategy.",
];

export interface Jtbd {
  definition: string;
  dimensions: string[];
  fourForces: { push: string[]; resist: string[]; rule: string };
}

export const JTBD: Jtbd = {
  definition: "A job is the PROGRESS a person wants to make under specific circumstances - a process, not a single action.",
  dimensions: ["functional", "emotional", "social"],
  fourForces: {
    push: ["frustration with the status quo (F1)", "attraction to the new solution (F2)"],
    resist: ["anxiety of learning the new (F3)", "habit/comfort of the current solution (F4)"],
    rule: "A switch happens only when Push + Pull > Anxiety + Habit.",
  },
};

// JTBD job-statement validator - the regex-checkable SUBSET (context, progress,
// not-a-single-solution). The full 7-point checklist (e.g. "not a trend",
// "appropriate abstraction") is not mechanically testable and is a Phase 2 item.
export interface JobCheck { id: string; test: (s: string) => boolean; failHint: string; }

export const JOB_CHECKS: JobCheck[] = [
  { id: "has-context", test: (s) => /\b(when|while|after|before|during|because)\b/i.test(s), failHint: "missing context (when/while/because ...)" },
  { id: "not-single-solution", test: (s) => !/\b(button|toggle|page|dropdown|API|endpoint|screen)\b/i.test(s), failHint: "names a specific solution, not a job" },
  { id: "expresses-progress", test: (s) => /\b(so that|in order to|to|need|want to)\b/i.test(s), failHint: "does not express the progress sought" },
];

export interface JobValidation { valid: boolean; passed: string[]; failed: { id: string; failHint: string }[]; }

export function validateJobStatement(statement: string): JobValidation {
  const passed: string[] = [];
  const failed: { id: string; failHint: string }[] = [];
  for (const c of JOB_CHECKS) {
    if (c.test(statement)) passed.push(c.id);
    else failed.push({ id: c.id, failHint: c.failHint });
  }
  return { valid: failed.length === 0, passed, failed };
}

export interface OppClassification { isOpportunity: boolean; reason: string; }

// Torres test: "is there more than one way to address this?" If a statement
// names a single concrete mechanism, it is a solution disguised as a problem.
const SOLUTION_MARKERS = /\b(add|build|create|implement|use|toggle|button|dropdown|dark mode|integrate)\b/i;

export function classifyOpportunityVsSolution(statement: string): OppClassification {
  if (SOLUTION_MARKERS.test(statement)) {
    return { isOpportunity: false, reason: "Names a single concrete mechanism. Restate as the underlying need it serves (there should be more than one way to address it)." };
  }
  return { isOpportunity: true, reason: "Stated as a need/pain with more than one possible solution." };
}

export interface RiceInput { reach: number; impact: number; confidence: number; effort: number; }
export interface RiceResult { score: number; formula: string; }

export function scoreRice(i: RiceInput): RiceResult {
  const score = (i.reach * i.impact * i.confidence) / i.effort;
  return { score, formula: "(Reach x Impact x Confidence) / Effort" };
}
