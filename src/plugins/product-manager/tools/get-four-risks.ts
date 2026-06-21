import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FOUR_RISKS } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_four_risks",
    "The four product risks every build must address before shipping (Cagan/SVPG): value, usability, feasibility, viability - with which role owns each. The PM owns value and viability.",
    {},
    async () => {
      let text = `# The Four Product Risks\n\nAddress all four before building. The PM is accountable for **value** and **viability**.\n\n| risk | question | owner |\n|---|---|---|\n`;
      for (const r of FOUR_RISKS) text += `| ${r.id} | ${r.question} | ${r.owner} |\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
