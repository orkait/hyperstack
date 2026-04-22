import type { ToolServer } from "../../../shared/tool-types.js";
import { PRESETS } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "designer_list_presets",
    "List all available design presets - complete, code-ready design token configurations based on real premium design systems (Linear, Stripe, Vercel, Apple, Carbon, shadcn, Notion, Supabase, Figma).",
    {},
    async () => {
      let text = "# Design Presets\n\n";
      text += "Complete, code-ready design token configurations. Each is a full design system you can start from.\n\n";
      text += "| Preset | Personality | Mode | Body | Density | Key Trait |\n";
      text += "|---|---|---|---|---|---|\n";

      for (const p of PRESETS) {
        text += `| **${p.displayName}** | ${p.personality} | ${p.tokens.colors.mode} | ${p.tokens.typography.bodySize}/w${p.tokens.typography.bodyWeight} | ${p.tokens.spacing.density} | ${p.tokens.motion.style.split("-")[0].trim()} |\n`;
      }

      text += `\nUse \`designer_get_preset(name)\` for full token configuration + CSS example.\n`;
      text += `\n## When to Use Presets\n\n`;
      text += `- **Starting a new project** → pick the closest preset, customize brand color\n`;
      text += `- **"Make it feel like Linear"** → use the linear preset directly\n`;
      text += `- **Can't decide** → shadcn preset is the safe default (brand-agnostic)\n`;
      text += `- **Enterprise** → carbon preset ships WCAG AA out of the box\n`;
      text += `- **Developer tool** → supabase preset (dark, emerald, compact)\n`;
      text += `- **Content/editorial** → notion preset (warm, serif headings, comfortable)\n`;

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
