import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { ALL_APIS, API_KINDS, capitalize } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "motion_list_apis",
    "List all available Motion for React APIs (components, hooks, utilities)",
    {
      kind: z.enum(["all", ...API_KINDS]).optional().describe("Filter by API kind"),
    },
    async ({ kind }) => {
      const apis = kind && kind !== "all"
        ? ALL_APIS.filter((a) => a.kind === kind)
        : ALL_APIS;

      const grouped: Record<string, string[]> = {};
      for (const api of apis) {
        const k = api.kind;
        if (!grouped[k]) grouped[k] = [];
        grouped[k].push(`${api.name} - ${api.description.split(".")[0]}`);
      }

      let text = "# Motion for React - API Reference\n\n";
      text += `Import from \`"motion/react"\` (or \`"motion/react-client"\` for RSC)\n\n`;
      for (const [kind, items] of Object.entries(grouped)) {
        text += `## ${capitalize(kind)}s\n`;
        for (const item of items) text += `- ${item}\n`;
        text += "\n";
      }
      return { content: [{ type: "text", text }] };
    },
  );
}
