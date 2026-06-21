// Product-Manager persona - typed structure + the one piece of legitimate gate logic.
//
// PHILOSOPHY (see optimizer/data.ts): tools provide GROUND-TRUTH the LLM should
// recall and apply, NOT classification/judgment the LLM does better itself.
// Earlier versions shipped regex "classifiers" (opportunity-vs-solution,
// job-statement validation) that emitted exclusive verdicts - those were brittle
// theater and were removed. The agent applies the rubrics (snippets/rubrics/*.txt);
// the only logic kept here is deterministic STRUCTURE checks, not judgment.
//
// Corpus prose lives in snippets/*.txt via createSnippetLoader, identical to the
// other plugins. Source-cited PM craft (Cagan/SVPG, Torres, Intercom, Christensen,
// Doshi), transcribed from docs/research/2026-06-21-pm-craft-corpus.json.

import { snippet } from "./loader.js";

export interface ProductRisk {
  id: "value" | "usability" | "feasibility" | "viability";
  question: string;
  owner: "product-manager" | "designer" | "engineer";
}

export const FOUR_RISKS: ProductRisk[] = [
  { id: "value",       question: snippet("risks/value.txt"),       owner: "product-manager" },
  { id: "usability",   question: snippet("risks/usability.txt"),   owner: "designer" },
  { id: "feasibility", question: snippet("risks/feasibility.txt"), owner: "engineer" },
  { id: "viability",   question: snippet("risks/viability.txt"),   owner: "product-manager" },
];

export const PM_OWNED_RISKS: ReadonlySet<string> = new Set(
  FOUR_RISKS.filter((r) => r.owner === "product-manager").map((r) => r.id),
);

export interface AntiPattern {
  id: string;
  smell: string;
  source: string;
}

const ANTI_PATTERN_META: { id: string; source: string }[] = [
  { id: "feature-factory", source: "Cagan/SVPG" },
  { id: "reactivity", source: "Cagan/SVPG" },
  { id: "viability-avoidance", source: "Cagan/SVPG" },
  { id: "execution-misdiagnosis", source: "Doshi" },
  { id: "opinion-requirement", source: "Torres / The Mom Test" },
];

export const ANTI_PATTERNS: AntiPattern[] = ANTI_PATTERN_META.map((m) => ({
  id: m.id,
  source: m.source,
  smell: snippet(`anti-patterns/${m.id}.txt`),
}));

export const DISCOVERY_DOC: string = snippet("discovery/rules.txt");
export const STRATEGY_DOC: string = snippet("strategy/rules.txt");
export const JTBD_DOC: string = snippet("jtbd/jtbd.txt");

// Rubrics the AGENT applies (ground truth, not a verdict the tool computes).
export const OPPORTUNITY_RUBRIC_DOC: string = snippet("rubrics/opportunity-vs-solution.txt");
export const JOB_CRITERIA_DOC: string = snippet("rubrics/job-criteria.txt");

// --- The one legitimate piece of logic: a deterministic STRUCTURE gate. ---
// This does NOT judge whether the value/viability reasoning is good (that is the
// agent's job, supplied as input). It enforces the discipline: a net-new build
// cannot PASS unless the PM-owned risks (value AND viability) were actually
// addressed. A presence/substance check, not a judgment call.

export interface DecisionInput {
  description: string;
  valueAssessment?: string;
  viabilityAssessment?: string;
  isNetNew?: boolean;
}

export interface Decision {
  verdict: "PASS" | "BLOCK" | "ADVISORY";
  gate: "HARD" | "ADVISORY";
  missing: string[];
}

const MIN_ASSESSMENT_CHARS = 20;

function addressed(text?: string): boolean {
  return typeof text === "string" && text.trim().length >= MIN_ASSESSMENT_CHARS;
}

export function computeDecision(input: DecisionInput): Decision {
  const gate: Decision["gate"] = input.isNetNew === false ? "ADVISORY" : "HARD";
  const missing: string[] = [];
  if (!addressed(input.valueAssessment)) missing.push("value");
  if (!addressed(input.viabilityAssessment)) missing.push("viability");

  let verdict: Decision["verdict"];
  if (missing.length === 0) verdict = "PASS";
  else if (gate === "ADVISORY") verdict = "ADVISORY";
  else verdict = "BLOCK";

  return { verdict, gate, missing };
}

export interface RiceInput { reach: number; impact: number; confidence: number; effort: number; }
export interface RiceResult { score: number; formula: string; }

export function scoreRice(i: RiceInput): RiceResult {
  const score = (i.reach * i.impact * i.confidence) / i.effort;
  return { score, formula: "(Reach x Impact x Confidence) / Effort" };
}
