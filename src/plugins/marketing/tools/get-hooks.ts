import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { HOOKS_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_hooks",
    "Hook frameworks for the first 1-3 seconds (ads, short-form video, social, subject lines): curiosity/open-loop, pain-point, pattern-interrupt, contrarian, result, plus the 4-beat short-form structure and swipe openers. Use to grab attention before the scroll.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Hooks\n\n${HOOKS_DOC}\n` }] }),
  );
}
