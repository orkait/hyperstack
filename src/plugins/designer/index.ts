import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Plugin } from "../../registry.js";
import { register as listPersonalities } from "./tools/list-personalities.js";
import { register as getPersonality } from "./tools/get-personality.js";
import { register as getIndustryRules } from "./tools/get-industry-rules.js";
import { register as getCognitiveLaw } from "./tools/get-cognitive-law.js";
import { register as getDesignSystem } from "./tools/get-design-system.js";
import { register as getCompositionRules } from "./tools/get-composition-rules.js";
import { register as getInteractionPattern } from "./tools/get-interaction-pattern.js";
import { register as getUxWriting } from "./tools/get-ux-writing.js";
import { register as getLandingPattern } from "./tools/get-landing-pattern.js";
import { register as getAntiPatterns } from "./tools/get-anti-patterns.js";
import { register as resolveIntent } from "./tools/resolve-intent.js";
import { register as search } from "./tools/search.js";
import { register as generateDesignBrief } from "./tools/generate-design-brief.js";
import { register as getPageTemplate } from "./tools/get-page-template.js";
import { register as getPreset } from "./tools/get-preset.js";
import { register as listPresets } from "./tools/list-presets.js";
import { register as getFontPairing } from "./tools/get-font-pairing.js";
import { register as generateImplementationPlan } from "./tools/generate-implementation-plan.js";
import { register as verifyImplementation } from "./tools/verify-implementation.js";

function register(server: McpServer): void {
  listPersonalities(server);
  getPersonality(server);
  getIndustryRules(server);
  getCognitiveLaw(server);
  getDesignSystem(server);
  getCompositionRules(server);
  getInteractionPattern(server);
  getUxWriting(server);
  getLandingPattern(server);
  getAntiPatterns(server);
  resolveIntent(server);
  search(server);
  generateDesignBrief(server);
  getPageTemplate(server);
  getPreset(server);
  listPresets(server);
  getFontPairing(server);
  generateImplementationPlan(server);
  verifyImplementation(server);
}

export const designerPlugin: Plugin = {
  name: "designer",
  register,
};
