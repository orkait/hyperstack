import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { snippet } from "../loader.js";

const TEMPLATE_COLORS = snippet("templates/colors-tailwind-v4.md");
const TEMPLATE_SPACING = snippet("templates/spacing.md");
const TEMPLATE_TYPOGRAPHY = snippet("templates/typography.md");
const TEMPLATE_MOTION = snippet("templates/motion.md");

export function register(server: McpServer): void {
  server.tool(
    "design_tokens_generate",
    "Generate CSS token scaffolding from a description. Returns ready-to-use CSS custom properties.",
    {
      description: z.string().describe(
        "What to generate (e.g. 'dark mode color tokens', 'spacing system', 'typography scale', 'motion tokens', 'complete token system')"
      ),
      framework: z.enum(["css", "tailwind-v4"]).optional()
        .describe("Output format (default: tailwind-v4)"),
    },
    async ({ description }) => {
      const desc = description.toLowerCase();

      const parts: string[] = [];

      if (desc.includes("color") || desc.includes("dark") || desc.includes("complete") || desc.includes("full")) {
        parts.push(TEMPLATE_COLORS);
      }

      if (desc.includes("spacing") || desc.includes("complete") || desc.includes("full")) {
        parts.push(TEMPLATE_SPACING);
      }

      if (desc.includes("typography") || desc.includes("type") || desc.includes("complete") || desc.includes("full")) {
        parts.push(TEMPLATE_TYPOGRAPHY);
      }

      if (desc.includes("motion") || desc.includes("animation") || desc.includes("complete") || desc.includes("full")) {
        parts.push(TEMPLATE_MOTION);
      }

      if (parts.length === 0) {
        return {
          content: [{ type: "text", text: `No template matched "${description}". Try: colors, spacing, typography, motion, complete` }],
        };
      }

      const code = parts.join("\n\n");
      return {
        content: [{ type: "text", text: `\`\`\`css\n${code}\n\`\`\`\n\nCustomize the OKLCH values to match your brand palette. Run a contrast audit after finalizing colors.` }],
      };
    }
  );
}
