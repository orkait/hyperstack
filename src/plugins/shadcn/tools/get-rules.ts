import type { ToolServer } from "../../../shared/tool-types.js";
import { SHADCN_RULES, ARCHITECTURAL_CHECKLIST } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "shadcn_get_rules",
    "Get the architectural rules and mandatory checklist for shadcn/ui (Base UI edition). Call this before proposing any new component or modification.",
    {},
    async () => {
      let text = `# shadcn/ui (Base UI Edition) - Architectural Rules\n\n`;

      text += `## Core Conventions\n\n`;
      text += `| Rule | Standard |\n|---|---|\n`;
      text += `| Primitives | ${SHADCN_RULES.primitives} |\n`;
      text += `| Styling | ${SHADCN_RULES.styling} |\n`;
      text += `| Core selectors | ${SHADCN_RULES.coreSelectors} |\n`;
      text += `| Responsive | ${SHADCN_RULES.responsive} |\n`;
      text += `| Naming | ${SHADCN_RULES.naming} |\n`;
      text += `| Animation | ${SHADCN_RULES.animation} |\n`;
      text += `| Client directive | ${SHADCN_RULES.clientDirective} |\n\n`;

      text += `## Utilities\n\n`;
      for (const u of SHADCN_RULES.utilities) {
        text += `- ${u}\n`;
      }
      text += `\n`;

      text += `## Mandatory Checklist (before shipping any component)\n\n`;
      for (const item of ARCHITECTURAL_CHECKLIST) {
        text += `- [ ] ${item}\n`;
      }
      text += `\n`;

      text += `## Red Flags - STOP\n\n`;
      text += `| Anti-pattern | Fix |\n|---|---|\n`;
      text += `| \`import ... from "@radix-ui/react-*"\` | Migrate to \`@base-ui/react\` |\n`;
      text += `| \`className="trigger"\` for identification | Use \`data-slot="trigger"\` |\n`;
      text += `| Hardcoded px positions (\`top-8\`) | Use Base UI props (\`sideOffset={8}\`) |\n`;
      text += `| Missing \`'use client'\` on stateful component | Add it to the top of the file |\n`;
      text += `| Monolithic Dialog (all logic in one component) | Split into DialogHeader/Footer/etc. |\n`;
      text += `| Hex colors in component styles | Use OKLCH tokens from design system |\n`;
      text += `| Random variant names ('primary-light') | Stick to default/outline/secondary/ghost/destructive |\n`;

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
