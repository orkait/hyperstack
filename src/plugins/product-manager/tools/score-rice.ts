import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { scoreRice } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_score_rice",
    "Compute a RICE prioritization score = (Reach x Impact x Confidence) / Effort (Intercom). Confidence is 0-1. Use to rank competing initiatives.",
    {
      reach: z.number().describe("People affected per time period."),
      impact: z.number().describe("Per-person impact (e.g. 3=massive,2=high,1=medium,0.5=low,0.25=minimal)."),
      confidence: z.number().describe("Confidence 0-1 (1.0=high, 0.8=medium, 0.5=low)."),
      effort: z.number().describe("Person-months (or any consistent effort unit)."),
    },
    async ({ reach, impact, confidence, effort }) => {
      const r = scoreRice({ reach, impact, confidence, effort });
      return { content: [{ type: "text" as const, text: `# RICE score: ${r.score.toFixed(2)}\n\n\`${r.formula}\` = (${reach} x ${impact} x ${confidence}) / ${effort}\n` }] };
    },
  );
}
