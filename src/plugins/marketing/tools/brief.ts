import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { buildBrief } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_brief",
    "Assemble a product-marketing brief for a specific brand: returns the ordered workflow (which frameworks/tools to apply, in sequence) for the deliverables you need. It routes the work - you produce the marketing.",
    {
      brand: z.string().describe("The brand/product to market (one line: what it is + who it is for if known)."),
      deliverables: z.array(z.string()).optional().describe("Subset of: positioning, messaging, copy, brand, gtm. Omit for the full workflow."),
    },
    async ({ brand, deliverables }) => {
      const steps = buildBrief(deliverables);
      let text = `# Marketing brief: ${brand}\n\n`;
      text += `Apply these in order. Each step names the tool(s) that supply the framework; you do the marketing.\n\n`;
      steps.forEach((s, i) => {
        text += `${i + 1}. **${s.step}** - ${s.why}\n   tools: \`${s.tools}\`\n`;
      });
      text += `\nStart with intake: who is it for, what does it do, what are the competitive alternatives, what is unique.\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
