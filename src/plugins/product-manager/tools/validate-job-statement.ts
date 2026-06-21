import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { JOB_CRITERIA_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_validate_job_statement",
    "Returns the 7-point JTBD job-statement criteria (Christensen/Ulwick) for YOU to judge a statement against - it does not pass/fail for you. Use to sharpen a vague job into one with context + progress.",
    { statement: z.string().optional().describe("Optional: the job statement you want to judge against the criteria.") },
    async ({ statement }) => {
      let text = `# JTBD Job-Statement Criteria (rubric)\n\n${JOB_CRITERIA_DOC}\n`;
      if (statement) text += `\n---\nJudge this statement against the 7 criteria: "${statement}"\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
