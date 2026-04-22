import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PERSONALITY_CLUSTERS, getPersonality } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "designer_get_personality",
    "Get full personality profile: description, exemplars, visual vocabulary, mode, and CSS example",
    {
      cluster: z.enum(PERSONALITY_CLUSTERS).describe("Personality cluster name"),
    },
    async ({ cluster }) => {
      const p = getPersonality(cluster);

      if (!p) {
        return {
          content: [{ type: "text", text: `Not found. Available: ${PERSONALITY_CLUSTERS.join(", ")}` }],
          isError: true,
        };
      }

      let text = `# ${p.cluster}\n\n`;
      text += `${p.description}\n\n`;

      text += `## Exemplars\n`;
      for (const e of p.exemplars) {
        text += `- **${e.name}** - ${e.signature}\n`;
      }

      text += `\n## Visual Vocabulary\n`;
      text += `- **Colors:** ${p.vocabulary.colors}\n`;
      text += `- **Typography:** ${p.vocabulary.typography}\n`;
      text += `- **Radius:** ${p.vocabulary.radius}\n`;
      text += `- **Shadows:** ${p.vocabulary.shadows}\n`;
      text += `- **Motion:** ${p.vocabulary.motion}\n`;
      text += `- **Density:** ${p.vocabulary.density}\n`;

      text += `\n**Default mode:** ${p.defaultMode}\n`;

      if (p.cssExample) {
        text += `\n## CSS Example\n\`\`\`css\n${p.cssExample}\n\`\`\`\n`;
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
