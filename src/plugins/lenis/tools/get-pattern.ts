import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { PATTERNS } from "../data.js";

const PATTERN_NAMES = Object.keys(PATTERNS) as [string, ...string[]];

export function register(server: ToolServer): void {
  server.tool(
    "lenis_get_pattern",
    "Get a complete Lenis integration pattern with full production-ready code. Covers Next.js setup, GSAP integration, Framer Motion sync, custom containers, accessibility, and navigation.",
    {
      name: z
        .enum(PATTERN_NAMES)
        .describe(
          "Pattern name: full-page | next-js | gsap-integration | framer-motion-integration | custom-container | accessibility | scroll-to-nav",
        ),
    },
    async ({ name }: { name: string }) => {
      const pattern = PATTERNS[name];
      if (!pattern) {
        return {
          content: [
            {
              type: "text",
              text: `Pattern "${name}" not found.\n\nAvailable patterns:\n${Object.entries(PATTERNS)
                .map(([k, p]) => `- ${k}: ${p.description}`)
                .join("\n")}`,
            },
          ],
          isError: true,
        };
      }

      let text = `# Lenis Pattern: ${pattern.name}\n\n`;
      text += `${pattern.description}\n\n`;
      text += `## Code\n\n\`\`\`tsx\n${pattern.code}\n\`\`\`\n\n`;

      if (pattern.tips && pattern.tips.length > 0) {
        text += `## Key Notes\n\n`;
        for (const tip of pattern.tips) text += `- ${tip}\n`;
      }
      return { content: [{ type: "text", text }] };
    },
  );
}
