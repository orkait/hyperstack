import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getArchetypeDoc, ROSTER } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "reflect_get_persona",
    "Get one Reflect reviewer archetype's full lens, what they catch/undervalue, and voice - so you can review a screen AS them. Then apply the shared voice rules (reflect_get_voice_rules).",
    { id: z.string().describe("one of: morgan, max, diane, riley") },
    async ({ id }) => {
      const doc = getArchetypeDoc(id);
      if (!doc) {
        return { content: [{ type: "text" as const, text: `Unknown reviewer "${id}". Roster: ${ROSTER.map((r) => r.id).join(", ")}. Call reflect_list_personas.` }] };
      }
      return { content: [{ type: "text" as const, text: `${doc}\n\n---\nNow apply the shared human-voice rules: reflect_get_voice_rules.\n` }] };
    },
  );
}
