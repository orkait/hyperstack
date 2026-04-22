import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  PERSONALITY_CLUSTERS,
  INDUSTRY_CATEGORIES,
  STYLE_NAMES,
  resolveFullIntent,
  getPersonality,
  getIndustryRule,
  getStyle,
  getCognitiveLaw,
  getAntiPatterns,
  getDesignSystem,
  getCompositionRule,
} from "../data.js";
import type { EmotionalTarget, UserType, PersonalityCluster } from "../data.js";

const USER_TYPES = ["developer", "consumer", "enterprise", "child", "creative", "healthcare"] as const;
const EMOTIONAL_TARGETS = ["trustworthy", "playful", "premium", "energetic", "calm", "technical", "bold", "editorial"] as const;

const PERSONALITY_TO_SYSTEM: Record<string, string> = {
  "premium-precision": "vercel-geist",
  "technical-developer": "linear",
  "warm-editorial": "apple-hig",
  "bold-energetic": "material-design-3",
  "cinematic-dark": "stripe",
  "enterprise-trust": "ibm-carbon",
};

export function register(server: McpServer): void {
  server.tool(
    "designer_generate_design_brief",
    "Generate a complete design brief for a product: resolves intent, then assembles visual theme, industry rules, style, cognitive laws, anti-patterns, design system inspiration, and composition rules",
    {
      product: z.string().describe("Product description (e.g. 'developer analytics dashboard')"),
      industry: z.enum(INDUSTRY_CATEGORIES).optional().describe("Override auto-detected industry"),
      personality: z.enum(PERSONALITY_CLUSTERS).optional().describe("Override personality cluster"),
      style: z.enum(STYLE_NAMES).optional().describe("Override design style"),
      mode: z.enum(["light", "dark"]).optional().describe("Override light/dark mode"),
      emotionalTarget: z.enum(EMOTIONAL_TARGETS).optional().describe("Override emotional target"),
      userType: z.enum(USER_TYPES).optional().describe("Primary user type"),
    },
    async ({ product, industry, personality, style, mode, emotionalTarget, userType }) => {
      const intent = resolveFullIntent(
        product,
        userType as UserType | undefined,
        emotionalTarget as EmotionalTarget | undefined,
      );

      const finalIndustry = industry ?? intent.industry;
      const finalPersonality = personality ?? intent.personality;
      const finalStyle = style ?? intent.style;
      const finalMode = mode ?? intent.mode;

      let text = `# Design Brief: ${product}\n\n`;
      text += `**Industry:** ${finalIndustry} (${intent.industryConfidence} confidence)\n`;
      text += `**Personality:** ${finalPersonality}\n`;
      text += `**Style:** ${finalStyle}\n`;
      text += `**Mode:** ${finalMode}\n`;
      text += `**Density:** ${intent.density}\n`;
      text += `**Emotional target:** ${intent.emotionalTarget}\n\n`;

      // 1. Visual Theme
      const personalityProfile = getPersonality(finalPersonality);
      if (personalityProfile) {
        text += `---\n\n## 1. Visual Theme (${finalPersonality})\n\n`;
        text += `${personalityProfile.description}\n\n`;
        text += `### Visual Vocabulary\n`;
        text += `- **Colors:** ${personalityProfile.vocabulary.colors}\n`;
        text += `- **Typography:** ${personalityProfile.vocabulary.typography}\n`;
        text += `- **Radius:** ${personalityProfile.vocabulary.radius}\n`;
        text += `- **Shadows:** ${personalityProfile.vocabulary.shadows}\n`;
        text += `- **Motion:** ${personalityProfile.vocabulary.motion}\n`;
        text += `- **Density:** ${personalityProfile.vocabulary.density}\n\n`;
        text += `### Exemplars\n`;
        for (const e of personalityProfile.exemplars) {
          text += `- **${e.name}** — ${e.signature}\n`;
        }
        text += "\n";
      }

      // 2. Industry Rules
      const industryRule = getIndustryRule(finalIndustry);
      if (industryRule) {
        text += `---\n\n## 2. Industry Rules (${finalIndustry})\n\n`;
        text += `**Primary style:** ${industryRule.primaryStyle}\n`;
        text += `**Secondary style:** ${industryRule.secondaryStyle}\n`;
        text += `**Color mood:** ${industryRule.colorMood}\n\n`;
        text += `### Must Have\n`;
        for (const item of industryRule.mustHave) text += `- ${item}\n`;
        text += `\n### Never Use\n`;
        for (const item of industryRule.neverUse) text += `- ${item}\n`;
        text += "\n";
      }

      // 3. Style Properties
      const styleProfile = getStyle(finalStyle);
      if (styleProfile) {
        text += `---\n\n## 3. Style Properties (${finalStyle})\n\n`;
        text += `${styleProfile.description}\n\n`;
        text += `- **Colors:** ${styleProfile.colors}\n`;
        text += `- **Radius:** ${styleProfile.radius}\n`;
        text += `- **Shadows:** ${styleProfile.shadows}\n`;
        text += `- **Motion:** ${styleProfile.motion}\n`;
        text += `- **Effects:** ${styleProfile.effects}\n`;
        text += `- **Performance:** ${styleProfile.performance}\n\n`;
        if (styleProfile.cssExample) {
          text += `\`\`\`css\n${styleProfile.cssExample}\n\`\`\`\n\n`;
        }
      }

      // 4. Cognitive Laws to Apply
      text += `---\n\n## 4. Cognitive Laws to Apply\n\n`;
      const lawNames: Array<"fitts" | "hick" | "miller" | "peak-end"> = ["fitts", "peak-end"];

      const productLower = product.toLowerCase();
      if (
        productLower.includes("menu") || productLower.includes("pricing") ||
        productLower.includes("choice") || productLower.includes("select") ||
        productLower.includes("option") || productLower.includes("tier")
      ) {
        lawNames.push("hick");
      }
      if (
        productLower.includes("data") || productLower.includes("dashboard") ||
        productLower.includes("analytics") || productLower.includes("table") ||
        productLower.includes("list") || productLower.includes("form")
      ) {
        lawNames.push("miller");
      }

      for (const lawName of lawNames) {
        const law = getCognitiveLaw(lawName);
        if (law) {
          text += `### ${law.displayName}\n`;
          text += `**Formula:** \`${law.formula}\`\n\n`;
          text += `${law.keyInsight}\n\n`;
          text += `Applications:\n`;
          for (const app of law.uiApplications.slice(0, 3)) text += `- ${app}\n`;
          text += "\n";
        }
      }

      // 5. Anti-Patterns to Avoid
      const industryAntiPatterns = getAntiPatterns("industry-specific", finalIndustry);
      const generalAntiPatterns = getAntiPatterns().filter((a) => a.category !== "industry-specific").slice(0, 5);
      text += `---\n\n## 5. Anti-Patterns to Avoid\n\n`;
      if (industryAntiPatterns.length) {
        text += `### Industry-Specific (${finalIndustry})\n`;
        for (const ap of industryAntiPatterns) {
          text += `- **${ap.pattern}** — ${ap.whyItFails}. Fix: ${ap.fix}\n`;
        }
        text += "\n";
      }
      text += `### General\n`;
      for (const ap of generalAntiPatterns) {
        text += `- **${ap.pattern}** — ${ap.whyItFails}. Fix: ${ap.fix}\n`;
      }
      text += "\n";

      // 6. Design System Inspiration
      const systemName = PERSONALITY_TO_SYSTEM[finalPersonality];
      if (systemName) {
        const ds = getDesignSystem(systemName as any);
        if (ds) {
          text += `---\n\n## 6. Design System Inspiration (${ds.displayName})\n\n`;
          text += `**Signature:** ${ds.signature}\n\n`;
          text += `### Key Insights\n`;
          for (const insight of ds.keyInsights) text += `- ${insight}\n`;
          text += `\n**Typography:** ${ds.typography}\n`;
          text += `**Color:** ${ds.color}\n`;
          text += `**Spacing:** ${ds.spacing}\n\n`;
        }
      }

      // 7. Composition Rules
      text += `---\n\n## 7. Composition Rules\n\n`;
      for (const topic of ["visual-hierarchy", "reading-patterns"] as const) {
        const rule = getCompositionRule(topic);
        if (rule) {
          text += `### ${rule.displayName}\n`;
          text += `**Key rule:** ${rule.keyRule}\n\n`;
          for (const app of rule.applications) text += `- ${app}\n`;
          text += "\n";
        }
      }

      // Needs User Input
      if (intent.needsUserInput.length) {
        text += `---\n\n## Next Steps (needs user input)\n`;
        for (const item of intent.needsUserInput) text += `- ${item}\n`;
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
