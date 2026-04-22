import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { getComponentByName, SHADCN_COMPONENTS } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "shadcn_get_component",
    "Get full details for a shadcn/ui component: base primitive, data-slots, variants, sizes, usage example, and which other components it pairs with. Uses curated reference data.",
    {
      name: z.string().describe("Component name (e.g., 'Button', 'Dialog', 'Field', 'Select'). Case-insensitive."),
    },
    async ({ name }: { name: string }) => {
      const component = getComponentByName(name);
      if (!component) {
        const available = SHADCN_COMPONENTS.map((c) => c.name).join(", ");
        return {
          content: [{ type: "text" as const, text: `Component "${name}" not found. Available: ${available}` }],
          isError: true,
        };
      }

      let text = `# ${component.name}\n\n`;
      text += `**Category:** ${component.category}\n`;
      text += `**Base primitive:** ${component.basePrimitive}\n`;
      text += `**Requires 'use client':** ${component.requiresUseClient ? "yes" : "no"}\n\n`;
      text += `${component.description}\n\n`;

      text += `## Data Slots\n\n`;
      text += `Every rendered element must have a \`data-slot\` attribute for external styling.\n\n`;
      for (const slot of component.dataSlots) {
        text += `- \`data-slot="${slot}"\`\n`;
      }
      text += `\n`;

      if (component.variants && component.variants.length > 0) {
        text += `## Variants (via cva)\n\n`;
        text += component.variants.map((v) => `\`${v}\``).join(" · ") + `\n\n`;
      }

      if (component.sizes && component.sizes.length > 0) {
        text += `## Sizes (via cva)\n\n`;
        text += component.sizes.map((s) => `\`${s}\``).join(" · ") + `\n\n`;
      }

      text += `## Usage Example\n\n\`\`\`tsx\n${component.usageSnippet}\n\`\`\`\n\n`;

      if (component.pairsWith.length > 0) {
        text += `## Pairs With\n\n`;
        text += `${component.pairsWith.map((p) => `\`${p}\``).join(", ")}\n\n`;
      }

      text += `## Required Checklist\n\n`;
      text += `- [ ] Uses @base-ui/react primitive (not @radix-ui/react-*)\n`;
      text += `- [ ] All sub-components have data-slot attributes\n`;
      text += `- [ ] cva for variants (if applicable)\n`;
      text += `- [ ] cn for className merging\n`;
      if (component.requiresUseClient) text += `- [ ] 'use client' directive at top of file\n`;
      text += `- [ ] Props spread (...props) to underlying primitive\n`;
      text += `- [ ] OKLCH color tokens from design system (not hardcoded hex)\n`;

      return { content: [{ type: "text" as const, text }] };
    },
  );
}
