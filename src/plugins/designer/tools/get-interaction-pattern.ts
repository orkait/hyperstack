import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { INTERACTION_CATEGORIES, getInteractionPattern } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "designer_get_interaction_pattern",
    "Get interaction pattern: key rule, detail, best practices, and anti-patterns",
    {
      category: z.enum(INTERACTION_CATEGORIES).describe("Interaction pattern category"),
    },
    async ({ category }) => {
      const pattern = getInteractionPattern(category);

      if (!pattern) {
        return {
          content: [{ type: "text", text: `Not found. Available: ${INTERACTION_CATEGORIES.join(", ")}` }],
          isError: true,
        };
      }

      let text = `# ${pattern.displayName}\n\n`;
      text += `**Key rule:** ${pattern.keyRule}\n\n`;
      text += `${pattern.detail}\n\n`;

      text += `## Best Practices\n`;
      for (const bp of pattern.bestPractices) text += `- ${bp}\n`;

      text += `\n## Anti-Patterns\n`;
      for (const ap of pattern.antiPatterns) text += `- ${ap}\n`;

      return { content: [{ type: "text", text }] };
    }
  );
}
