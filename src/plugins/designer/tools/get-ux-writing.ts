import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WRITING_TOPICS, getWritingGuideline } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "designer_get_ux_writing",
    "Get UX writing guideline: key rule, evidence, do/don't examples",
    {
      topic: z.enum(WRITING_TOPICS).describe("UX writing topic"),
    },
    async ({ topic }) => {
      const guideline = getWritingGuideline(topic);

      if (!guideline) {
        return {
          content: [{ type: "text", text: `Not found. Available: ${WRITING_TOPICS.join(", ")}` }],
          isError: true,
        };
      }

      let text = `# ${guideline.displayName}\n\n`;
      text += `**Key rule:** ${guideline.keyRule}\n\n`;
      text += `**Evidence:** ${guideline.evidence}\n\n`;

      text += `## Do\n`;
      for (const ex of guideline.doExamples) text += `- ${ex}\n`;

      text += `\n## Don't\n`;
      for (const ex of guideline.dontExamples) text += `- ${ex}\n`;

      return { content: [{ type: "text", text }] };
    }
  );
}
