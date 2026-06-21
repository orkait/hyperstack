// Product-Manager persona - typed structure + decision LOGIC.
//
// The prose corpus (risk questions, anti-pattern smells, discovery/strategy
// rules, JTBD framing) lives in snippets/*.txt and is loaded via the shared
// createSnippetLoader, identical to the other Hyperstack plugins. Only stable,
// source-cited PM craft (Cagan/SVPG, Torres, Intercom, Christensen, Doshi),
// transcribed from docs/research/2026-06-21-pm-craft-corpus.json. No
// project-specific product opinions live here.

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
