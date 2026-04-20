import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import YAML from "yaml";
import { loadCorpusIndex, loadCorpusDocument } from "../../../engine/corpus-loader.js";
import { getNamespaceRoot } from "../../../engine/corpus-registry.js";
import {
  resolveFullIntent,
  type DensityMode,
  type EmotionalTarget,
  type IndustryCategory,
  type PersonalityCluster,
  type ResolvedIntent,
  type StyleName,
  type UserType,
} from "../data.js";

const USER_TYPES = ["developer", "consumer", "enterprise", "child", "creative", "healthcare"] as const;
const EMOTIONAL_TARGETS = ["trustworthy", "playful", "premium", "energetic", "calm", "technical", "bold", "editorial"] as const;

type CorpusIntentModel = {
  industryKeywords: Record<IndustryCategory, string[]>;
  emotionalToPersonality: Record<EmotionalTarget, PersonalityCluster>;
  densityMap: Record<UserType, DensityMode>;
  styleMap: Partial<Record<IndustryCategory, StyleName>>;
  darkDefaultIndustries: IndustryCategory[];
  defaultEmotionalTarget: EmotionalTarget;
  defaultStyle: StyleName;
  defaultDensity: DensityMode;
  defaultPersonality: PersonalityCluster;
};

type CorpusIndustryRule = {
  industry: string;
  primaryStyle: string;
  secondaryStyle: string;
  mustHave: string[];
  neverUse: string[];
  colorMood: string;
  emotionalTarget: string;
};

function loadCorpusIntentModel(repoRoot: string): CorpusIntentModel | null {
  const index = loadCorpusIndex(repoRoot);
  const root = getNamespaceRoot(index, "frontend.designer");
  const registry = YAML.parse(readFileSync(join(repoRoot, root, "index.yaml"), "utf8")) as {
    intentModel?: string;
  };

  return registry.intentModel ? loadCorpusDocument<CorpusIntentModel>(repoRoot, registry.intentModel) : null;
}

function loadCorpusIndustryRule(repoRoot: string, industry: string): CorpusIndustryRule | null {
  const index = loadCorpusIndex(repoRoot);
  const root = getNamespaceRoot(index, "frontend.designer");
  const registry = YAML.parse(readFileSync(join(repoRoot, root, "index.yaml"), "utf8")) as {
    industryRules?: Record<string, string>;
  };

  const path = registry.industryRules?.[industry];
  return path ? loadCorpusDocument<CorpusIndustryRule>(repoRoot, path) : null;
}

function resolveCorpusIntent(
  model: CorpusIntentModel,
  product: string,
  userType?: UserType,
  emotionalTarget?: EmotionalTarget,
): ResolvedIntent {
  const lower = product.toLowerCase();
  let industry: IndustryCategory = "saas";
  let bestScore = 0;

  for (const [candidate, keywords] of Object.entries(model.industryKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) score += keyword.length;
    }
    if (score > bestScore) {
      bestScore = score;
      industry = candidate as IndustryCategory;
    }
  }

  const confidence = bestScore >= 8 ? "high" : bestScore >= 4 ? "medium" : "low";
  const rule = loadCorpusIndustryRule(process.cwd(), industry);
  const emotional: EmotionalTarget = emotionalTarget ?? (rule?.emotionalTarget as EmotionalTarget | undefined) ?? model.defaultEmotionalTarget;
  const personality: PersonalityCluster = model.emotionalToPersonality[emotional] ?? model.defaultPersonality;
  const style = model.styleMap[industry] ?? model.defaultStyle;
  const density = model.densityMap[userType ?? "consumer"] ?? model.defaultDensity;
  const mode = model.darkDefaultIndustries.includes(industry) || personality === "technical-developer" ? "dark" : "light";

  const needsUserInput: string[] = [];
  if (confidence === "low") needsUserInput.push("industry (could not auto-detect)");
  if (!emotionalTarget) needsUserInput.push("emotional target (using industry default)");
  if (!userType) needsUserInput.push("primary user type");
  needsUserInput.push("brand color", "sections/pages", "framework/stack");

  return {
    industry,
    industryConfidence: confidence,
    personality,
    style,
    mode,
    density,
    colorMood: rule?.colorMood ?? "Trust blue + single accent",
    mustHave: rule?.mustHave ?? [],
    neverUse: rule?.neverUse ?? [],
    emotionalTarget: emotional,
    needsUserInput,
  };
}

export function register(server: McpServer): void {
  server.tool(
    "designer_resolve_intent",
    "Resolve a product description into a full design intent: industry, personality, style, mode, density, color mood, must-have/never-use lists",
    {
      product: z.string().describe("Product description (e.g. 'developer analytics dashboard', 'meditation app')"),
      userType: z.enum(USER_TYPES).optional().describe("Primary user type"),
      emotionalTarget: z.enum(EMOTIONAL_TARGETS).optional().describe("Desired emotional target"),
    },
    async ({ product, userType, emotionalTarget }) => {
      const corpusModel = loadCorpusIntentModel(process.cwd());
      const intent: ResolvedIntent = corpusModel
        ? resolveCorpusIntent(corpusModel, product, userType, emotionalTarget)
        : resolveFullIntent(product, userType, emotionalTarget);

      let text = `# Resolved Design Intent\n\n`;
      text += `**Product:** ${product}\n\n`;
      if (corpusModel) text += `**Corpus Source:** frontend.designer\n\n`;
      text += `## Resolution\n`;
      text += `- **Industry:** ${intent.industry} (confidence: ${intent.industryConfidence})\n`;
      text += `- **Personality:** ${intent.personality}\n`;
      text += `- **Style:** ${intent.style}\n`;
      text += `- **Mode:** ${intent.mode}\n`;
      text += `- **Density:** ${intent.density}\n`;
      text += `- **Color mood:** ${intent.colorMood}\n`;
      text += `- **Emotional target:** ${intent.emotionalTarget}\n\n`;

      text += `## Must Have\n`;
      for (const item of intent.mustHave) text += `- ${item}\n`;

      text += `\n## Never Use\n`;
      for (const item of intent.neverUse) text += `- ${item}\n`;

      if (intent.needsUserInput.length) {
        text += `\n## Needs User Input\n`;
        for (const item of intent.needsUserInput) text += `- ${item}\n`;
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
