import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ROSTER, getArchetypeDoc, VOICE_RULES_DOC, PANEL_PROTOCOL_DOC } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "reflect_get_panel",
    "Get the full multi-persona panel for reviewing a screen from every relevant lens at once: the panel protocol (relevance-based assembly, own-voice rules, collision naming, blocker vetoes), the shared voice rules, and the full lens docs. Pass ids to scope the panel; omit for all archetypes.",
    {
      ids: z.array(z.string()).optional().describe("Archetype ids to seat on the panel (e.g. ['kenji','sandra','sam']). Omit for the full roster."),
    },
    async ({ ids }) => {
      const seated = ids?.length
        ? ROSTER.filter((r) => ids.includes(r.id))
        : ROSTER;
      const unknown = ids?.filter((id) => !ROSTER.some((r) => r.id === id)) ?? [];

      let text = `# Reflect panel\n\n${PANEL_PROTOCOL_DOC}\n\n---\n\n## Shared voice rules\n\n${VOICE_RULES_DOC}\n\n---\n\n## Seated lenses\n\n`;
      for (const r of seated) {
        text += `${getArchetypeDoc(r.id)}\n\n`;
      }
      if (unknown.length) {
        text += `\nUnknown ids ignored: ${unknown.join(", ")}. Valid: ${ROSTER.map((r) => r.id).join(", ")}.\n`;
      }
      return { content: [{ type: "text" as const, text }] };
    },
  );
}
