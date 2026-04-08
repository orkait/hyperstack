import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PATTERNS, getPatternByName } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "react_get_pattern",
    "Get a React/Next.js pattern with full code example and anti-pattern",
    {
      name: z.string().describe("Pattern name (e.g. 'rsc-default', 'state-hierarchy', 'zustand-store', 'suspense-boundary', 'nextjs-metadata', 'composition-pattern', 'component-template')"),
    },
    async ({ name }) => {
      const pattern = getPatternByName(name);
      if (!pattern) {
        const available = PATTERNS.map((p) => p.name).join(", ");
        return {
          content: [{ type: "text", text: `Pattern "${name}" not found.\n\nAvailable: ${available}` }],
          isError: true,
        };
      }

      let text = `# ${pattern.name} [${pattern.category}]\n\n`;
      text += `${pattern.description}\n\n`;
      text += `**When to use:** ${pattern.when}\n\n`;
      text += `## Code\n\`\`\`tsx\n${pattern.code}\n\`\`\`\n\n`;

      if (pattern.antiPattern) {
        text += `## Anti-pattern (avoid)\n\`\`\`tsx\n${pattern.antiPattern}\n\`\`\`\n\n`;
      }

      if (pattern.tips?.length) {
        text += `## Tips\n`;
        for (const tip of pattern.tips) text += `- ${tip}\n`;
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
