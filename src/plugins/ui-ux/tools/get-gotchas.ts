import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DOMAINS, getAllGotchas } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "ui_ux_get_gotchas",
    "List all common UI/UX mistakes and fixes, optionally filtered by domain",
    {
      domain: z.enum(["all", ...DOMAINS]).optional().describe("Filter by domain"),
    },
    async ({ domain }) => {
      const gotchas = domain && domain !== "all"
        ? getAllGotchas(domain as any)
        : getAllGotchas();

      let text = "# UI/UX Gotchas\n\nCommon mistakes that break polished interfaces:\n\n";

      const byDomain: Record<string, typeof gotchas> = {};
      for (const g of gotchas) {
        if (!byDomain[g.domain]) byDomain[g.domain] = [];
        byDomain[g.domain].push(g);
      }

      for (const [dom, items] of Object.entries(byDomain)) {
        text += `## ${dom}\n`;
        for (const item of items) {
          text += `- ❌ **${item.gotcha}**\n  ✅ ${item.fix}\n`;
        }
        text += "\n";
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
