import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { DOMAINS, getChecklistByDomain } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "ui_ux_get_checklist",
    "Get quality checklist for a UI/UX domain before shipping",
    {
      domain: z.enum(DOMAINS).describe("Domain: typography, color, accessibility, motion, etc."),
    },
    async ({ domain }) => {
      const checklist = getChecklistByDomain(domain);
      if (!checklist) {
        return {
          content: [{ type: "text", text: `No checklist for domain "${domain}". Available: ${DOMAINS.join(", ")}` }],
          isError: true,
        };
      }

      let text = `# ${domain} checklist\n\n`;
      const critical = checklist.items.filter((i) => i.critical);
      const standard = checklist.items.filter((i) => !i.critical);

      if (critical.length) {
        text += `## Critical (must pass)\n`;
        for (const item of critical) {
          text += `- [ ] **${item.label}** - ${item.detail}\n`;
        }
        text += "\n";
      }

      if (standard.length) {
        text += `## Standard\n`;
        for (const item of standard) {
          text += `- [ ] ${item.label} - ${item.detail}\n`;
        }
      }

      return { content: [{ type: "text", text }] };
    }
  );
}
