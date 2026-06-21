import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { VOICE_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_voice",
    "Brand voice: the 12 archetypes (Mark & Pearson) with core desire/voice/example, plus the 4 tone dimensions (Nielsen Norman) for defining and applying a consistent voice. Use to set how the brand sounds.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Brand voice\n\n${VOICE_DOC}\n` }] }),
  );
}
