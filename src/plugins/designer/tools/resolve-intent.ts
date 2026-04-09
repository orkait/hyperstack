import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { resolveFullIntent } from "../data.js";

const USER_TYPES = ["developer", "consumer", "enterprise", "child", "creative", "healthcare"] as const;
const EMOTIONAL_TARGETS = ["trustworthy", "playful", "premium", "energetic", "calm", "technical", "bold", "editorial"] as const;

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
      const intent = resolveFullIntent(product, userType, emotionalTarget);

      let text = `# Resolved Design Intent\n\n`;
      text += `**Product:** ${product}\n\n`;
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
