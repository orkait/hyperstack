import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { FOUR_RISKS, classifyOpportunityVsSolution } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_resolve_product_decision",
    "The PM gate engine. Takes a build/feature description and returns a structured product decision: opportunity framing, four-risks assessment (esp value+viability), and a PASS/BLOCK/NEEDS-INPUT verdict the gate enforces.",
    {
      description: z.string().describe("What is being proposed to build."),
      isNetNew: z.boolean().optional().describe("True for a net-new feature/product (hard gate); false for a tweak (advisory)."),
    },
    async ({ description, isNetNew }) => {
      const opp = classifyOpportunityVsSolution(description);
      let text = `# Product Decision\n\n**Proposal:** ${description}\n\n`;
      text += `## 1. Opportunity framing\n${opp.isOpportunity ? "Framed as an opportunity." : "SOLUTION in disguise - reframe to the underlying need."} ${opp.reason}\n\n`;
      text += `## 2. Four-risks assessment (fill before proceeding)\n`;
      for (const r of FOUR_RISKS) text += `- **${r.id}** (${r.owner}): ${r.question}  -> _unassessed_\n`;
      text += `\n## 3. Verdict\n`;
      const gate = isNetNew === false ? "ADVISORY" : "HARD";
      if (!opp.isOpportunity) {
        text += `NEEDS-INPUT (${gate}): restate as an opportunity, then assess value + viability before build.\n`;
      } else {
        text += `NEEDS-INPUT (${gate}): assess all four risks - especially value and viability - and state the prioritized call with a rationale. PASS only when value+viability are addressed.\n`;
      }
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
