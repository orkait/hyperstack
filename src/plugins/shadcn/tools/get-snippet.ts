import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getComponentByName, SHADCN_COMPONENTS } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "shadcn_get_snippet",
    "Get a usage code snippet for a shadcn/ui component. Returns the canonical example showing variants, sizes, and composition patterns.",
    {
      name: z.string().describe("Component name (e.g., 'Button', 'Dialog', 'Field'). Case-insensitive."),
    },
    async ({ name }) => {
      const component = getComponentByName(name);
      if (!component) {
        const available = SHADCN_COMPONENTS.map((c) => c.name).join(", ");
        return {
          content: [{ type: "text" as const, text: `Component "${name}" not found. Available: ${available}` }],
          isError: true,
        };
      }

      let text = `# ${component.name} — Usage Snippet\n\n`;
      text += `\`\`\`tsx\n${component.usageSnippet}\n\`\`\`\n\n`;
      text += `**Base primitive:** ${component.basePrimitive}\n`;
      text += `**Data slots:** ${component.dataSlots.map((s) => `\`${s}\``).join(", ")}\n`;
      if (component.requiresUseClient) {
        text += `\n> Note: add \`'use client'\` directive at the top of the file.\n`;
      }

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
