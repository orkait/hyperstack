import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { FONT_MOODS, INDUSTRY_CATEGORIES, FONT_PAIRINGS, getFontPairings } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "designer_get_font_pairing",
    "Get curated font pairings filtered by mood (technical, elegant, friendly, editorial, bold, corporate, playful, luxury, startup, minimal) and/or industry. Returns heading + body + mono fonts with weights, tracking, line-height, Google Fonts import, and rationale. 21 pairings available.",
    {
      mood: z.enum(FONT_MOODS).optional().describe("Font mood: technical, elegant, friendly, editorial, bold, corporate, playful, luxury, startup, minimal"),
      industry: z.enum(INDUSTRY_CATEGORIES).optional().describe("Filter by industry"),
    },
    async ({ mood, industry }) => {
      const results = getFontPairings(mood, industry);

      if (results.length === 0) {
        const moods = [...new Set(FONT_PAIRINGS.map((f) => f.mood))].join(", ");
        return {
          content: [{ type: "text" as const, text: `No font pairings found for mood="${mood ?? "any"}" industry="${industry ?? "any"}". Available moods: ${moods}` }],
          isError: true,
        };
      }

      let text = `# Font Pairings`;
      if (mood) text += ` - ${mood}`;
      if (industry) text += ` for ${industry}`;
      text += `\n\n${results.length} pairing${results.length > 1 ? "s" : ""} found.\n\n`;

      for (const f of results) {
        text += `## ${f.name}\n\n`;
        text += `**Mood:** ${f.mood} | **Personality:** ${f.personality} | **Industries:** ${f.industries.join(", ")}\n\n`;

        text += `| Role | Font | Weight | Tracking | Line Height |\n`;
        text += `|---|---|---|---|---|\n`;
        text += `| Heading | ${f.heading} | ${f.headingWeight} | ${f.trackingHeading} | - |\n`;
        text += `| Body | ${f.body} | ${f.bodyWeight} | ${f.trackingBody} | ${f.lineHeightBody} |\n`;
        text += `| Mono | ${f.mono} | 400 | 0 | 1.5 |\n\n`;

        text += `**Why this pairing:** ${f.why}\n\n`;
        text += `\`\`\`css\n${f.googleImport}\n\`\`\`\n\n`;
        text += `---\n\n`;
      }

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
