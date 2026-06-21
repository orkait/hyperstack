import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ANTI_PATTERNS_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_anti_patterns",
    "Marketing red flags with fixes: feature-dumping, we-we copy, vague unproven claims, marketing-to-everyone, better-not-different, premature scaling, vanity metrics. Use to QA any marketing output before shipping.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Marketing anti-patterns\n\n${ANTI_PATTERNS_DOC}\n` }] }),
  );
}
