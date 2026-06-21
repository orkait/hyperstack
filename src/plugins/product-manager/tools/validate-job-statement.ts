import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { validateJobStatement } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_validate_job_statement",
    "Validate a JTBD job statement against the falsifiable checklist (has context, expresses progress, not a single solution). Returns pass/fail per check.",
    { statement: z.string().describe("The job statement to validate.") },
    async ({ statement }) => {
      const r = validateJobStatement(statement);
      let text = `# Job statement: ${r.valid ? "VALID" : "INVALID"}\n\n**Statement:** ${statement}\n\n`;
      text += `Passed: ${r.passed.join(", ") || "none"}\n\n`;
      if (r.failed.length) text += `Failed:\n${r.failed.map((f) => `- ${f.id}: ${f.failHint}`).join("\n")}\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
