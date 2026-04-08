import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PRINCIPLES, DOMAINS, getPrinciplesByDomain } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "ui_ux_list_principles",
    "List all UI/UX principles by domain (typography, color, spacing, elevation, motion, accessibility, responsive, components)",
    {
      domain: z.enum(["all", ...DOMAINS]).optional().describe("Filter by domain"),
    },
    async ({ domain }) => {
      const list = domain && domain !== "all"
        ? getPrinciplesByDomain(domain as any)
        : PRINCIPLES;

      const grouped: Record<string, typeof PRINCIPLES> = {};
      for (const p of list) {
        if (!grouped[p.domain]) grouped[p.domain] = [];
        grouped[p.domain].push(p);
      }

      let text = "# UI/UX Principles\n\n";
      for (const [dom, items] of Object.entries(grouped)) {
        text += `## ${dom} (${items.length})\n`;
        for (const p of items) {
          text += `- **${p.name}** — ${p.rule}\n`;
        }
        text += "\n";
      }
      text += `\n**Total:** ${list.length} principles across ${Object.keys(grouped).length} domains`;
      return { content: [{ type: "text", text }] };
    }
  );
}
