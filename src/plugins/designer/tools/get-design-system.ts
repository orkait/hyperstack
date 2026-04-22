import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { DESIGN_SYSTEM_NAMES, getDesignSystem, CROSS_SYSTEM_CONVERGENCES } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "designer_get_design_system",
    "Get design system reference: signature, key insights, typography, color, spacing, reference code, and cross-system convergences",
    {
      system: z.enum(DESIGN_SYSTEM_NAMES).describe("Design system name"),
    },
    async ({ system }) => {
      const ds = getDesignSystem(system);

      if (!ds) {
        return {
          content: [{ type: "text", text: `Not found. Available: ${DESIGN_SYSTEM_NAMES.join(", ")}` }],
          isError: true,
        };
      }

      let text = `# ${ds.displayName}\n\n`;
      text += `**Signature:** ${ds.signature}\n\n`;

      text += `## Key Insights\n`;
      for (const insight of ds.keyInsights) text += `- ${insight}\n`;

      text += `\n## Typography\n${ds.typography}\n\n`;
      text += `## Color\n${ds.color}\n\n`;
      text += `## Spacing\n${ds.spacing}\n\n`;

      if (ds.reference) {
        text += `## Reference Code\n\`\`\`css\n${ds.reference}\n\`\`\`\n\n`;
      }

      text += `## Cross-System Convergences\n`;
      for (const c of CROSS_SYSTEM_CONVERGENCES) {
        if (c.systems.some((s) => s.toLowerCase().includes(system.replace(/-/g, " ").split("-")[0]))) {
          text += `### ${c.principle}\n`;
          text += `${c.detail}\n`;
          text += `Systems: ${c.systems.join(", ")}\n\n`;
        }
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
