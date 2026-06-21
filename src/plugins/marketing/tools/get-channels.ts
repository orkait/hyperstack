import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CHANNELS_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "marketing_get_channels",
    "The 19 traction channels + the Bullseye framework (Traction, Weinberg & Mares): scan all channels, rank, test ~3 cheaply, focus on the one that works. Use to choose acquisition channels.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `# Channels\n\n${CHANNELS_DOC}\n` }] }),
  );
}
