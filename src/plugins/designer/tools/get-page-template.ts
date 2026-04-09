import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PAGE_TYPES, getPageTemplate } from "../data.js";

export function register(server: McpServer): void {
  server.tool(
    "designer_get_page_template",
    "Get section anatomy, component inventory, and applicable cognitive laws for a page type. Covers landing, dashboard, auth, settings, checkout, blog, docs, admin, profile, error-page, ai-chat, pricing, and onboarding.",
    {
      type: z.enum(PAGE_TYPES).describe("Page type to get template for"),
    },
    async ({ type }) => {
      const template = getPageTemplate(type);
      if (!template) {
        return {
          content: [{ type: "text" as const, text: `Page type "${type}" not found. Available: ${PAGE_TYPES.join(", ")}` }],
          isError: true,
        };
      }

      let text = `# Page Template: ${template.type}\n\n`;
      text += `${template.description}\n\n`;
      text += `**Layout:** ${template.layout}\n\n`;

      text += `## Sections\n\n`;
      for (const section of template.sections) {
        text += `### ${section.name}${section.required ? "" : " (optional)"}\n\n`;
        text += `**Components:**\n`;
        for (const comp of section.components) {
          text += `- ${comp}\n`;
        }
        text += `\n**Notes:** ${section.notes}\n\n`;
      }

      text += `## Apply These\n\n`;
      text += `**Cognitive Laws:** ${template.cognitiveApply.join(", ")}\n`;
      text += `**Composition:** ${template.compositionApply.join(", ")}\n`;
      text += `**Interaction Patterns:** ${template.interactionApply.join(", ")}\n`;
      text += `**UX Writing:** ${template.writingApply.join(", ")}\n\n`;

      text += `## Key Rules\n\n`;
      for (const rule of template.keyRules) {
        text += `- ${rule}\n`;
      }

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
