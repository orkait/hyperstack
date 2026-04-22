import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { TOKEN_CATEGORIES, getCategoryByName } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "design_tokens_get_category",
    "Get full details for a design token category including CSS examples, rules, and gotchas",
    {
      name: z.string().describe(
        "Category name: colors, spacing, typography, component-sizing, border-radius, shadows-elevation, motion, z-index, opacity, density"
      ),
    },
    async ({ name }) => {
      const cat = getCategoryByName(name);
      if (!cat) {
        const available = TOKEN_CATEGORIES.map((c) => c.name).join(", ");
        return {
          content: [{ type: "text", text: `Category "${name}" not found.\n\nAvailable: ${available}` }],
          isError: true,
        };
      }

      let text = `# ${cat.name} tokens\n\n`;
      text += `**Layer:** ${cat.layer}\n\n`;
      text += `${cat.description}\n\n`;

      text += `## CSS Example\n\`\`\`css\n${cat.cssExample}\n\`\`\`\n\n`;

      if (cat.tailwindExample) {
        text += `## Tailwind v4 Usage\n\`\`\`css\n${cat.tailwindExample}\n\`\`\`\n\n`;
      }

      text += `## Rules\n`;
      for (const rule of cat.rules) text += `- ${rule}\n`;

      text += `\n## Gotchas\n`;
      for (const gotcha of cat.gotchas) text += `- ${gotcha}\n`;

      return { content: [{ type: "text", text }] };
    }
  );
}
