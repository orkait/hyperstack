import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ALL_APIS, API_KINDS, capitalize } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "lenis_list_apis",
    "List all Lenis smooth scroll APIs — ReactLenis component, useLenis hook, LenisRef and LenisOptions types.",
    {
      kind: z.enum(["all", ...API_KINDS]).optional().describe("Filter by API kind: component, hook, type, utility"),
    },
    async ({ kind }) => {
      const apis = kind && kind !== "all"
        ? ALL_APIS.filter((a) => a.kind === kind)
        : ALL_APIS;

      const grouped: Record<string, string[]> = {};
      for (const api of apis) {
        const k = api.kind;
        if (!grouped[k]) grouped[k] = [];
        grouped[k].push(`${api.name} — ${api.description.split(".")[0]}`);
      }

      let text = "# Lenis React — API Reference\n\n";
      text += `Import from \`"lenis/react"\` (types from \`"lenis"\`)\n\n`;
      for (const [k, items] of Object.entries(grouped)) {
        text += `## ${capitalize(k)}s\n`;
        for (const item of items) text += `- ${item}\n`;
        text += "\n";
      }
      return { content: [{ type: "text", text }] };
    },
  );
}
