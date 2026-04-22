import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { PAGE_TYPE_NAMES, getPageComposition } from "../data.js";

/**
 * get-composition is the bridge between designer's page templates and shadcn components.
 * When forge-plan processes a DESIGN.md with a specific page type, it calls this tool
 * to get concrete shadcn component recommendations per section.
 */
export function register(server: ToolServer): void {
  server.tool(
    "shadcn_get_composition",
    "Get shadcn/ui component composition for a specific page type. Returns which components to combine per section with rationale. This is the bridge from designer's page templates to concrete implementation. Use after designer_get_page_template.",
    {
      page_type: z.enum(PAGE_TYPE_NAMES).describe("Page type: landing, dashboard, auth, settings, checkout, blog, docs, admin, profile, pricing, onboarding, ai-chat"),
    },
    async ({ page_type }) => {
      const composition = getPageComposition(page_type);
      if (!composition) {
        return {
          content: [{ type: "text" as const, text: `Page type "${page_type}" has no composition mapping. Available: ${PAGE_TYPE_NAMES.join(", ")}` }],
          isError: true,
        };
      }

      let text = `# shadcn Composition: ${composition.type}\n\n`;
      text += `${composition.description}\n\n`;
      text += `## Section-by-Section Component Mapping\n\n`;

      for (const section of composition.sections) {
        text += `### ${section.name}\n\n`;
        text += `**Components:**\n`;
        for (const c of section.components) {
          text += `- ${c}\n`;
        }
        text += `\n**Why:** ${section.rationale}\n\n`;
      }

      text += `---\n\n## Next Steps\n\n`;
      text += `For each component listed above:\n`;
      text += `1. Call \`shadcn_get_component(name)\` for full spec\n`;
      text += `2. Call \`shadcn_get_snippet(name)\` for usage example\n`;
      text += `3. Verify against DESIGN.md Section 5 (Component Specifications)\n`;
      text += `4. Call \`shadcn_get_rules\` before writing any code\n\n`;
      text += `**Integration with designer:** This composition should be cross-referenced with \`designer_get_page_template("${composition.type}")\` to ensure the section anatomy matches. If they conflict, DESIGN.md is the source of truth - escalate back to \`hyperstack:designer\` to reconcile.\n`;

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
