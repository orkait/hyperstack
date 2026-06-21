// Marketing persona (capability) - ground-truth frameworks + a real brief assembler.
//
// PHILOSOPHY (same as the corrected product-manager plugin): tools supply the
// canon (frameworks, formulas-with-templates, swipe structures, playbooks) that
// the agent RECALLS and APPLIES. No regex/classifier "deciders" - the marketer
// makes the call. The only logic here is a deterministic assembler that maps a
// requested deliverable to the ordered set of frameworks to apply.
//
// Corpus prose lives in snippets/*.txt via createSnippetLoader. Sources: Dunford,
// Osterwalder, Miller, Raskin, Schwartz, Ogilvy/Caples, Cialdini, Mark & Pearson,
// Byron Sharp, Binet & Field, Play Bigger, Weinberg/Mares, McClure, Balfour/Reforge.

import { snippet } from "./loader.js";

const join = (...parts: string[]) => parts.join("\n\n---\n\n");

export const POSITIONING_DOC: string = join(snippet("positioning/dunford.txt"), snippet("positioning/styles.txt"));
export const MESSAGING_DOC: string = join(snippet("messaging/value-prop-canvas.txt"), snippet("messaging/storybrand.txt"), snippet("messaging/narrative.txt"));
export const FORMULAS_DOC: string = snippet("copywriting/formulas.txt");
export const AWARENESS_DOC: string = snippet("copywriting/awareness-stages.txt");
export const PERSUASION_DOC: string = join(snippet("copywriting/headlines.txt"), snippet("copywriting/persuasion.txt"), snippet("copywriting/landing-anatomy.txt"));
export const VOICE_DOC: string = join(snippet("brand/archetypes.txt"), snippet("brand/voice-tone.txt"));
export const BRAND_DOC: string = join(snippet("brand/laws.txt"), snippet("brand/category-design.txt"));
export const GTM_DOC: string = join(snippet("gtm/motions.txt"), snippet("gtm/launch.txt"));
export const CHANNELS_DOC: string = snippet("gtm/channels.txt");
export const GROWTH_DOC: string = snippet("gtm/growth-model.txt");
export const ANTI_PATTERNS_DOC: string = snippet("anti-patterns/marketing.txt");
export const VOC_DOC: string = snippet("research/voice-of-customer.txt");
export const ICP_DOC: string = snippet("positioning/icp.txt");
export const PRICING_DOC: string = snippet("gtm/pricing.txt");

// --- The brief assembler: deterministic, real (not a fake verdict). ---
// Given which deliverables the brand needs, return the ordered workflow steps +
// which tools to call. The agent does the actual marketing; this routes it.

export interface BriefStep { step: string; tools: string; why: string; }

export const FULL_WORKFLOW: BriefStep[] = [
  { step: "Research", tools: "marketing_get_voice_of_customer", why: "mine the customer's exact words (VoC) - the raw material for all the copy." },
  { step: "Position", tools: "marketing_get_positioning, marketing_get_icp", why: "Dunford's 5 components in order + define the ICP; decide what it is and who exactly it is for." },
  { step: "Message", tools: "marketing_get_messaging", why: "value-prop canvas + StoryBrand + strategic narrative; build the message hierarchy." },
  { step: "Awareness", tools: "marketing_get_awareness_stages", why: "match the copy to how aware the market already is." },
  { step: "Write", tools: "marketing_get_copywriting_formulas, marketing_get_persuasion", why: "pick a formula, write headline + body + CTA with proof - in the customer's words." },
  { step: "Voice", tools: "marketing_get_voice", why: "pick a brand archetype + tone dimensions, apply consistently." },
  { step: "GTM", tools: "marketing_get_gtm, marketing_get_channels, marketing_get_growth_model, marketing_get_pricing", why: "choose the motion, Bullseye the channels, design a growth loop, package the pricing." },
  { step: "Check", tools: "marketing_get_anti_patterns", why: "no feature-dump, we-we copy, or vague unproven claims." },
];

const DELIVERABLE_STEPS: Record<string, string[]> = {
  positioning: ["Research", "Position"],
  messaging: ["Message", "Awareness"],
  copy: ["Research", "Awareness", "Write", "Voice"],
  copywriting: ["Research", "Awareness", "Write", "Voice"],
  brand: ["Voice"],
  gtm: ["GTM"],
  growth: ["GTM"],
  pricing: ["GTM"],
};

export function buildBrief(deliverables?: string[]): BriefStep[] {
  if (!deliverables || deliverables.length === 0) return FULL_WORKFLOW;
  const wanted = new Set<string>();
  for (const d of deliverables) {
    for (const s of DELIVERABLE_STEPS[d.trim().toLowerCase()] ?? []) wanted.add(s);
  }
  if (wanted.size === 0) return FULL_WORKFLOW;
  wanted.add("Check");
  return FULL_WORKFLOW.filter((s) => wanted.has(s.step));
}
