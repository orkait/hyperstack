import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { INDUSTRY_CATEGORIES, getIndustryRule } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "designer_get_industry_rules",
    "Get design rules for an industry: primary/secondary style, must-have features, never-use patterns, color mood, emotional target",
    {
      industry: z.enum(INDUSTRY_CATEGORIES).describe("Industry category"),
    },
    async ({ industry }) => {
      const rule = getIndustryRule(industry);

      if (!rule) {
        return {
          content: [{ type: "text", text: `Not found. Available: ${INDUSTRY_CATEGORIES.join(", ")}` }],
          isError: true,
        };
      }

      let text = `# Industry Rules: ${rule.industry}\n\n`;
      text += `**Primary style:** ${rule.primaryStyle}\n`;
      text += `**Secondary style:** ${rule.secondaryStyle}\n`;
      text += `**Color mood:** ${rule.colorMood}\n`;
      text += `**Emotional target:** ${rule.emotionalTarget}\n\n`;

      text += `## Must Have\n`;
      for (const item of rule.mustHave) text += `- ${item}\n`;

      text += `\n## Never Use\n`;
      for (const item of rule.neverUse) text += `- ${item}\n`;

      return { content: [{ type: "text", text }] };
    }
  );
}
