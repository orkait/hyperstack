import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PRINCIPLES } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "ui_ux_get_principle",
    "Get full details for a UI/UX principle including examples, anti-patterns, and CSS examples",
    {
      name: z.string().describe("Principle name (e.g. 'type-scale', 'wcag-contrast', 'dark-mode-principles', 'touch-targets', 'easing-rules')"),
    },
    async ({ name }) => {
      const principle = PRINCIPLES.find(
        (p) => p.name.toLowerCase() === name.toLowerCase()
      );

      if (!principle) {
        const available = PRINCIPLES.map((p) => p.name).join(", ");
        return {
          content: [{ type: "text", text: `Principle "${name}" not found.\n\nAvailable: ${available}` }],
          isError: true,
        };
      }

      let text = `# ${principle.name} [${principle.domain}]\n\n`;
      text += `**Rule:** ${principle.rule}\n\n`;
      text += `${principle.detail}\n\n`;

      if (principle.cssExample) {
        text += `## CSS Example\n\`\`\`css\n${principle.cssExample}\n\`\`\`\n\n`;
      }

      if (principle.examples?.length) {
        text += `## Examples\n`;
        for (const ex of principle.examples) text += `- ${ex}\n`;
        text += "\n";
      }

      if (principle.antiPatterns?.length) {
        text += `## Anti-patterns (avoid)\n`;
        for (const ap of principle.antiPatterns) text += `- ❌ ${ap}\n`;
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
