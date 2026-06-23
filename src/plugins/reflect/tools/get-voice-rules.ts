import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { VOICE_RULES_DOC, SAMPLES_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "reflect_get_voice_rules",
    "The shared Reflect voice contract: sounds-human vs sounds-like-AI, the 5 moods, the 6 in-head checks, how to reply, plus sample replies. Apply to every archetype so the review sounds like a real person, not a UX bot.",
    {},
    async () => ({ content: [{ type: "text" as const, text: `${VOICE_RULES_DOC}\n\n---\n\n${SAMPLES_DOC}\n` }] }),
  );
}
