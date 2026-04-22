import type { ToolServer } from "../../../shared/tool-types.js";
import { PERSONALITIES } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "designer_list_personalities",
    "List all 6 designer personality clusters with descriptions and exemplar names",
    {},
    async () => {
      let text = "# Designer Personality Clusters\n\n";

      for (const p of PERSONALITIES) {
        text += `## ${p.cluster}\n`;
        text += `${p.description}\n\n`;
        text += `**Exemplars:** ${p.exemplars.map((e) => e.name).join(", ")}\n`;
        text += `**Default mode:** ${p.defaultMode} | **Density:** ${p.vocabulary.density}\n\n`;
      }

      text += `**Total:** ${PERSONALITIES.length} personality clusters`;
      return { content: [{ type: "text", text }] };
    }
  );
}
