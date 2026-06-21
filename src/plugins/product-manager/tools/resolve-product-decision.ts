import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { computeDecision, FOUR_RISKS } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_resolve_product_decision",
    "The PM gate. Supply YOUR value and viability assessments for the proposal; returns a real verdict - PASS (both addressed), BLOCK (net-new build with a PM-owned risk unaddressed), or ADVISORY (tweak). PASS is earned by actually assessing value AND viability, not automatic. The judgment is yours; this enforces that you made it.",
    {
      description: z.string().describe("What is being proposed to build."),
      valueAssessment: z.string().optional().describe("Your assessment of VALUE risk: will users choose it? Cite the customer problem/evidence."),
      viabilityAssessment: z.string().optional().describe("Your assessment of VIABILITY risk: can the business sell/support/fund/legally ship it?"),
      isNetNew: z.boolean().optional().describe("True for a net-new feature/product (hard gate); false for a tweak (advisory)."),
    },
    async ({ description, valueAssessment, viabilityAssessment, isNetNew }) => {
      const d = computeDecision({ description, valueAssessment, viabilityAssessment, isNetNew });

      let text = `# Product Decision: ${d.verdict}\n\n**Proposal:** ${description}\n\n`;
      text += `## PM-owned risk assessments\n`;
      text += `- **value:** ${valueAssessment?.trim() || "_not provided_"}\n`;
      text += `- **viability:** ${viabilityAssessment?.trim() || "_not provided_"}\n\n`;
      text += `## Verdict: ${d.verdict} (${d.gate} gate)\n`;

      if (d.verdict === "PASS") {
        text += `Value and viability are addressed. Hand back to \`hyper\`; proceed to design/build.\n`;
      } else if (d.verdict === "BLOCK") {
        text += `Unaddressed PM-owned risk(s): **${d.missing.join(", ")}**. A net-new build cannot proceed until value AND viability are addressed. Assess the missing risk(s) and call this tool again.\n`;
      } else {
        text += `Tweak / non-net-new: unaddressed **${d.missing.join(", ")}** noted as advisory. Proceed allowed, but the gap is on the record.\n`;
      }

      text += `\n## The other two risks (not PM-owned, confirm before ship)\n`;
      for (const r of FOUR_RISKS.filter((r) => r.owner !== "product-manager")) {
        text += `- ${r.id} (${r.owner}): ${r.question}\n`;
      }
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
