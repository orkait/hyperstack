import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SHADCN_COMPONENTS, COMPONENT_CATEGORIES, getComponentsByCategory } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "shadcn_list_components",
    "List all curated shadcn/ui components (Base UI edition). Optionally filter by category: button, input, card, dialog, dropdown, tabs, table, form, navigation, feedback, overlay, data-display.",
    {
      category: z.enum(COMPONENT_CATEGORIES).optional().describe("Filter by component category"),
    },
    async ({ category }) => {
      const components = category ? getComponentsByCategory(category) : SHADCN_COMPONENTS;

      if (components.length === 0) {
        return {
          content: [{ type: "text" as const, text: `No components found${category ? ` in category "${category}"` : ""}.` }],
          isError: true,
        };
      }

      let text = `# shadcn/ui Components${category ? ` - ${category}` : ""}\n\n`;
      text += `${components.length} component${components.length > 1 ? "s" : ""} found.\n\n`;
      text += `| Component | Category | Base Primitive | Variants | Client |\n`;
      text += `|---|---|---|---|---|\n`;

      for (const c of components) {
        const variants = c.variants && c.variants.length > 0 ? c.variants.join(", ") : "-";
        const client = c.requiresUseClient ? "yes" : "no";
        text += `| **${c.name}** | ${c.category} | ${c.basePrimitive} | ${variants} | ${client} |\n`;
      }

      text += `\nUse \`shadcn_get_component(name)\` for full details on any component.\n`;

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
