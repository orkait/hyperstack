import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { COMPOSITION_TOPICS, getCompositionRule } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "designer_get_composition_rules",
    "Get visual composition rules: key rule, detail, applications, and violations",
    {
      topic: z.enum(COMPOSITION_TOPICS).describe("Composition topic"),
    },
    async ({ topic }) => {
      const rule = getCompositionRule(topic);

      if (!rule) {
        return {
          content: [{ type: "text", text: `Not found. Available: ${COMPOSITION_TOPICS.join(", ")}` }],
          isError: true,
        };
      }

      let text = `# ${rule.displayName}\n\n`;
      text += `**Key rule:** ${rule.keyRule}\n\n`;
      text += `${rule.detail}\n\n`;

      text += `## Applications\n`;
      for (const app of rule.applications) text += `- ${app}\n`;

      text += `\n## Violations\n`;
      for (const v of rule.violations) text += `- ${v}\n`;

      return { content: [{ type: "text", text }] };
    }
  );
}
