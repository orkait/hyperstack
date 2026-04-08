import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { COMPONENT_PATTERNS, getComponentPatternByName } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "ui_ux_get_component_pattern",
    "Get component pattern spec including variants, states, and sizing rules",
    {
      name: z.string().describe("Component name: button, card, badge, form-input"),
    },
    async ({ name }) => {
      const pattern = getComponentPatternByName(name);
      if (!pattern) {
        const available = COMPONENT_PATTERNS.map((c) => c.name).join(", ");
        return {
          content: [{ type: "text", text: `Component "${name}" not found.\n\nAvailable: ${available}` }],
          isError: true,
        };
      }

      let text = `# ${pattern.name} component pattern\n\n`;

      if (pattern.variants?.length) {
        text += `**Variants:** ${pattern.variants.join(", ")}\n`;
      }
      text += `**States:** ${pattern.states.join(", ")}\n\n`;

      text += `## Rules\n`;
      for (const rule of pattern.rules) text += `- ${rule}\n`;

      if (pattern.code) {
        text += `\n## CSS\n\`\`\`css\n${pattern.code}\n\`\`\`\n`;
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
