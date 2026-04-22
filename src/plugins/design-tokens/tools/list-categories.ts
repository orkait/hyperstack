import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { TOKEN_CATEGORIES } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "design_tokens_list_categories",
    "List all 10 design token categories with descriptions and architecture layer",
    {
      layer: z.enum(["all", "primitive", "semantic", "domain"]).optional()
        .describe("Filter by token layer"),
    },
    async ({ layer }) => {
      const cats = layer && layer !== "all"
        ? TOKEN_CATEGORIES.filter((c) => c.layer === layer)
        : TOKEN_CATEGORIES;

      let text = "# Design Token Categories\n\n";
      text += "A production token system covers 10 categories. Missing any = incomplete system.\n\n";
      text += "## Three-layer architecture\n";
      text += "- **@theme primitives** → raw values (ramp stops)\n";
      text += "- **:root/.dark semantics** → role-based mappings\n";
      text += "- **Domain tokens** → app-specific (viz, editor, etc.)\n\n";

      const byLayer: Record<string, typeof cats> = {};
      for (const cat of cats) {
        if (!byLayer[cat.layer]) byLayer[cat.layer] = [];
        byLayer[cat.layer].push(cat);
      }

      for (const [layerName, items] of Object.entries(byLayer)) {
        text += `## Layer: ${layerName}\n`;
        for (const cat of items) {
          text += `### ${cat.name}\n${cat.description}\n\n`;
        }
      }

      text += `\n**Total:** ${cats.length} categories`;
      return { content: [{ type: "text", text }] };
    }
  );
}
