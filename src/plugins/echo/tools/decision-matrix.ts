import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { DECISION_MATRIX } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "echo_decision_matrix",
    "Given a need or requirement, get the recommended Echo pattern and recipe to use.",
    {
      need: z.string().optional().describe("What you need to build (e.g., 'real-time', 'auth', 'file upload', 'REST API')"),
    },
    async ({ need }) => {
      if (!need) {
        let text = "# Echo Framework - Decision Matrix\n\n";
        text += "| Need | Pattern | Recipe | Notes |\n";
        text += "|------|---------|--------|-------|\n";
        for (const d of DECISION_MATRIX) {
          text += `| ${d.need} | ${d.pattern} | \`${d.recipe}\` | ${d.notes} |\n`;
        }
        return { content: [{ type: "text", text }] };
      }

      const q = need.toLowerCase();
      const matches = DECISION_MATRIX.filter(
        (d) =>
          d.need.toLowerCase().includes(q) ||
          d.pattern.toLowerCase().includes(q) ||
          d.notes.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        let text = `No direct match for "${need}".\n\n`;
        text += "# Full Decision Matrix\n\n";
        text += "| Need | Pattern | Recipe |\n";
        text += "|------|---------|--------|\n";
        for (const d of DECISION_MATRIX) {
          text += `| ${d.need} | ${d.pattern} | \`${d.recipe}\` |\n`;
        }
        return { content: [{ type: "text", text }] };
      }

      let text = `# Echo Pattern for: "${need}"\n\n`;
      for (const d of matches) {
        text += `## ${d.pattern}\n\n`;
        text += `**Need:** ${d.need}\n`;
        text += `**Recipe:** \`${d.recipe}\`\n`;
        text += `**Notes:** ${d.notes}\n\n`;
        text += `Run \`echo_get_recipe\` with name \`${d.recipe}\` for full working code.\n\n`;
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
