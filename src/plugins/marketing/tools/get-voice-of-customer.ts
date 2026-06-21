import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { VOC_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_voice_of_customer",
    "Voice-of-Customer / message mining (Copyhackers): how to harvest the customer's EXACT words from reviews, support, calls, and surveys, and turn them into copy. The method for getting marketing words straight from real customers. Use FIRST, before writing anything.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Voice of Customer\n\n${VOC_DOC}\n` }] }),
  );
}
