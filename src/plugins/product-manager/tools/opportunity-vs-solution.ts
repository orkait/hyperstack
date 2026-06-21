import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { classifyOpportunityVsSolution } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_opportunity_vs_solution",
    "Torres test: is a statement a real opportunity (a need with more than one way to address it) or a solution in disguise? Rejects premature solution-jumping.",
    { statement: z.string().describe("The problem/feature statement to classify.") },
    async ({ statement }) => {
      const r = classifyOpportunityVsSolution(statement);
      const verdict = r.isOpportunity ? "OPPORTUNITY" : "SOLUTION (reframe needed)";
      return { content: [{ type: "text" as const, text: `# ${verdict}\n\n**Statement:** ${statement}\n\n${r.reason}\n` }] };
    },
  );
}
