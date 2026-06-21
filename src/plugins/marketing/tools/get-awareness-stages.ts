import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AWARENESS_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_awareness_stages",
    "Eugene Schwartz's 5 stages of market awareness (unaware -> most-aware) + market sophistication, with how the copy must change per stage. Use to decide what to say before writing.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Market awareness\n\n${AWARENESS_DOC}\n` }] }),
  );
}
