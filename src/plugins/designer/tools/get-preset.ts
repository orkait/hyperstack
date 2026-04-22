import type { ToolServer } from "../../../shared/tool-types.js";
import { z } from "zod";
import { PRESET_NAMES, PRESETS, getPreset } from "../data.js";

export function register(server: ToolServer): void {
  server.tool(
    "designer_get_preset",
    "Get a complete, code-ready design token preset based on a real premium design system. Returns colors (OKLCH), typography (font, scale, weights, tracking), spacing, radius, shadows, motion, and CSS example. Available presets: linear, stripe, vercel, apple, carbon, shadcn, notion, supabase, figma.",
    {
      name: z.enum(PRESET_NAMES).describe("Preset name: linear, stripe, vercel, apple, carbon, shadcn, notion, supabase, figma"),
    },
    async ({ name }) => {
      const preset = getPreset(name);
      if (!preset) {
        return {
          content: [{ type: "text" as const, text: `Preset "${name}" not found. Available: ${PRESET_NAMES.join(", ")}` }],
          isError: true,
        };
      }

      const t = preset.tokens;
      let text = `# Preset: ${preset.displayName}\n\n`;
      text += `**Personality:** ${preset.personality}\n`;
      text += `**Description:** ${preset.description}\n\n`;
      text += `> ${preset.inspiration}\n\n`;

      text += `## Colors\n\n`;
      text += `| Property | Value |\n|---|---|\n`;
      text += `| Brand hue | ${t.colors.brand.hue}° - ${t.colors.brand.description} |\n`;
      text += `| Neutral | H:${t.colors.neutral.hue}° C:${t.colors.neutral.chroma} (${t.colors.neutral.temperature}) |\n`;
      text += `| Accent | H:${t.colors.accent.hue}° - ${t.colors.accent.description} |\n`;
      text += `| Default mode | ${t.colors.mode} |\n`;
      text += `| Dark strategy | ${t.colors.darkStrategy} |\n\n`;

      text += `## Typography\n\n`;
      text += `| Property | Value |\n|---|---|\n`;
      text += `| Sans | ${t.typography.fontSans} |\n`;
      text += `| Mono | ${t.typography.fontMono} |\n`;
      if (t.typography.fontSerif) text += `| Serif | ${t.typography.fontSerif} |\n`;
      text += `| Body | ${t.typography.bodySize} / weight ${t.typography.bodyWeight} / tracking ${t.typography.trackingBody} / lh ${t.typography.lineHeightBody} |\n`;
      text += `| Heading | weight ${t.typography.headingWeight} / tracking ${t.typography.trackingHeading} |\n`;
      text += `| Display | weight ${t.typography.displayWeight} / tracking ${t.typography.trackingDisplay} / lh ${t.typography.lineHeightDisplay} |\n`;
      text += `| Scale ratio | ${t.typography.scaleRatio} |\n\n`;

      text += `## Spacing\n\n`;
      text += `| Property | Value |\n|---|---|\n`;
      text += `| Base unit | ${t.spacing.base} |\n`;
      text += `| Section Y | ${t.spacing.sectionY} |\n`;
      text += `| Card padding | ${t.spacing.cardPadding} |\n`;
      text += `| Grid gutter | ${t.spacing.gridGutter} |\n`;
      text += `| Content max | ${t.spacing.contentMax} |\n`;
      text += `| Density | ${t.spacing.density} |\n\n`;

      text += `## Radius\n\n`;
      text += `sm: ${t.radius.sm} | md: ${t.radius.md} | lg: ${t.radius.lg} | pill: ${t.radius.pill}\n`;
      text += `Style: ${t.radius.style}\n\n`;

      text += `## Shadows\n\n`;
      text += `${t.shadows.style}\nTint hue: ${t.shadows.tintHue}°\n\n`;

      text += `## Motion\n\n`;
      text += `fast: ${t.motion.fast} | normal: ${t.motion.normal} | slow: ${t.motion.slow}\n`;
      text += `Easing: ${t.motion.easing}\n`;
      text += `Style: ${t.motion.style}\n\n`;

      text += `## CSS Example\n\n\`\`\`css\n${preset.css}\n\`\`\`\n\n`;

      text += `---\n\n*Use this preset as a starting point. Customize brand hue, accent, and density to match your product. Call \`design_tokens_generate\` to produce the full Tailwind v4 CSS from these values.*`;

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
