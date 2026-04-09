import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { COGNITIVE_LAW_NAMES, getCognitiveLaw } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "designer_get_cognitive_law",
    "Get a cognitive law: formula, key insight, UI applications, common violations, and academic source",
    {
      name: z.enum(COGNITIVE_LAW_NAMES).describe("Cognitive law name"),
    },
    async ({ name }) => {
      const law = getCognitiveLaw(name);

      if (!law) {
        return {
          content: [{ type: "text", text: `Not found. Available: ${COGNITIVE_LAW_NAMES.join(", ")}` }],
          isError: true,
        };
      }

      let text = `# ${law.displayName}\n\n`;
      text += `**Formula:** \`${law.formula}\`\n\n`;
      text += `**Key insight:** ${law.keyInsight}\n\n`;
      text += `**Source:** ${law.source}\n\n`;

      text += `## UI Applications\n`;
      for (const app of law.uiApplications) text += `- ${app}\n`;

      text += `\n## Common Violations\n`;
      for (const v of law.violations) text += `- ${v}\n`;

      return { content: [{ type: "text", text }] };
    }
  );
}
