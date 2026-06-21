import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { OPPORTUNITY_RUBRIC_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_opportunity_vs_solution",
    "Returns the Torres opportunity-vs-solution rubric (the test + reframe examples) for YOU to apply - it does not classify for you. Use to reframe a solution-shaped request into the underlying need.",
    { statement: z.string().optional().describe("Optional: the statement you want to apply the rubric to.") },
    async ({ statement }) => {
      let text = `# Opportunity vs Solution (rubric)\n\n${OPPORTUNITY_RUBRIC_DOC}\n`;
      if (statement) text += `\n---\nApply the test to: "${statement}"\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
