// Reflect persona (capability) - review a screen AS a real target-customer persona.
//
// Ground-truth = the reviewer roster + the shared human-voice rules (snippets).
// The behaviour lives in skills/reflect; these tools serve the roster and rules
// so the review can run via MCP too. No logic that the LLM does better - just
// the archetypes and the voice contract.

import { snippet } from "./loader.js";

export interface ReviewerArchetype {
  id: string;
  label: string;
  oneLiner: string;
}

export const ROSTER: ReviewerArchetype[] = [
  { id: "morgan", label: "Morgan", oneLiner: "Brand-side approver (default): reputation, compliance, budget defensibility, trust." },
  { id: "max", label: "Max", oneLiner: "Performance lead at a D2C brand: ROAS/CAC/cohorts; catches weak attribution + vanity metrics; undervalues brand safety." },
  { id: "diane", label: "Diane", oneLiner: "Brand custodian at a global FMCG major: 3-year equity, legal-heavy; catches off-brand tone; undervalues speed." },
  { id: "riley", label: "Riley", oneLiner: "High-volume operator inside the product: throughput + bulk actions; catches friction at volume; undervalues trust hand-holding." },
  { id: "kenji", label: "Kenji", oneLiner: "Senior backend engineer, devtool buyer: docs-first, failure modes, exit paths; catches magic without observability + vague pricing; undervalues visual polish." },
  { id: "sandra", label: "Sandra", oneLiner: "Enterprise IT / security procurement: SSO/SCIM, SOC 2, audit logs, DPA; catches security handwaves + per-seat ambiguity; undervalues delight." },
  { id: "zoe", label: "Zoe", oneLiner: "Consumer mobile user, 23: 8-second patience, thumb-first, free tier; catches onboarding friction, permission grabs, paywall ambush; undervalues feature depth." },
  { id: "sam", label: "Sam", oneLiner: "Screen-reader user (NVDA + keyboard), accessibility lens: focus order, names, contrast; catches unlabeled buttons, focus traps, div-soup; undervalues aesthetics." },
];

const VALID: ReadonlySet<string> = new Set(ROSTER.map((r) => r.id));

export function getArchetypeDoc(id: string): string | null {
  const key = id.trim().toLowerCase();
  if (!VALID.has(key)) return null;
  return snippet(`roster/${key}.txt`);
}

export const VOICE_RULES_DOC: string = snippet("rules/voice-and-moods.txt");
export const SAMPLES_DOC: string = snippet("examples/samples.txt");
