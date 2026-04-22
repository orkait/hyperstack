import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { snippet } from "../loader.js";

const CHEATSHEET = snippet("cheatsheet.txt");

export function register(server: McpServer): void {
  server.tool(
    "rust_cheatsheet",
    "Quick Rust reference: ownership rules, error handling, clippy commands, and key patterns",
    {},
    async () => {
      return { content: [{ type: "text", text: CHEATSHEET }] };
    }
  );
}
