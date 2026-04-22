import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { LANDING_TOPICS, getLandingPattern } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "designer_get_landing_pattern",
    "Get landing page pattern: key stats, best practices, and anti-patterns",
    {
      topic: z.enum(LANDING_TOPICS).describe("Landing page topic"),
    },
    async ({ topic }) => {
      const pattern = getLandingPattern(topic);

      if (!pattern) {
        return {
          content: [{ type: "text", text: `Not found. Available: ${LANDING_TOPICS.join(", ")}` }],
          isError: true,
        };
      }

      let text = `# ${pattern.displayName}\n\n`;

      text += `## Key Stats\n`;
      for (const stat of pattern.keyStats) text += `- ${stat}\n`;

      text += `\n## Best Practices\n`;
      for (const bp of pattern.bestPractices) text += `- ${bp}\n`;

      text += `\n## Anti-Patterns\n`;
      for (const ap of pattern.antiPatterns) text += `- ${ap}\n`;

      return { content: [{ type: "text", text }] };
    }
  );
}
