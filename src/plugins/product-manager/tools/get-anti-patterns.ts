import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ANTI_PATTERNS } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "product_manager_get_anti_patterns",
    "Codifiable PM red flags (Cagan, Doshi): feature-factory, reactivity, viability-avoidance, execution-misdiagnosis, opinion-requirement. Use to flag weak product reasoning.",
    {},
    async () => {
      let text = `# PM Anti-Patterns (red flags)\n\n`;
      for (const a of ANTI_PATTERNS) text += `## ${a.id}\n${a.smell}  \n_source: ${a.source}_\n\n`;
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
