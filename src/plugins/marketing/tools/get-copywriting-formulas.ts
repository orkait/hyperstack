import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FORMULAS_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_copywriting_formulas",
    "Copywriting formulas with fill-in templates: PAS, AIDA, BAB, FAB, PASTOR, 4 Ps, the 4 U's. Use to structure any headline, ad, landing page, or email. Apply the formula yourself - this supplies the templates.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Copywriting formulas\n\n${FORMULAS_DOC}\n` }] }),
  );
}
