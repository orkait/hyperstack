import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { COLOR_RAMPS, getRampByName } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "design_tokens_get_color_ramp",
    "Get a color ramp (brand/neutral/pop) with all 11 OKLCH stops, semantic roles, and light/dark mode usage",
    {
      name: z.enum(["brand", "neutral", "pop"]).describe("Ramp name"),
    },
    async ({ name }) => {
      const ramp = getRampByName(name);
      if (!ramp) {
        return {
          content: [{ type: "text", text: `Ramp "${name}" not found. Available: ${COLOR_RAMPS.map((r) => r.name).join(", ")}` }],
          isError: true,
        };
      }

      let text = `# ${ramp.name} color ramp\n\n${ramp.description}\n\n`;
      text += "Use **role-based naming** (`brand-500`), never hue names (`violet-500`) — prevents codebase-wide renames when palette changes.\n\n";

      text += "## Stops\n\n";
      text += "| Stop | OKLCH | Role | Light Mode | Dark Mode |\n";
      text += "|------|-------|------|------------|----------|\n";
      for (const stop of ramp.stops) {
        text += `| ${stop.stop} | \`${stop.oklch}\` | ${stop.role} | ${stop.lightMode} | ${stop.darkMode ?? "—"} |\n`;
      }

      text += "\n## CSS\n\`\`\`css\n@theme {\n";
      for (const stop of ramp.stops) {
        text += `  --color-${name}-${stop.stop}: ${stop.oklch};\n`;
      }
      text += "}\n\`\`\`\n\n";
      text += "**Contrast fix:** If status colors fail 4.5:1 with white text, reduce OKLCH Lightness (L 0.63 → 0.55) — keep C and H unchanged.";

      return { content: [{ type: "text", text }] };
    }
  );
}
