import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readFileSync, existsSync } from "fs";
import { isAbsolute } from "path";

/**
 * Parses a DESIGN.md file into its 10 canonical sections and generates
 * an implementation plan with exact MCP calls per section. This is the bridge
 * that forge-plan uses to turn a DESIGN.md contract into executable tasks.
 */
export function register(server: McpServer): void {
  server.tool(
    "designer_generate_implementation_plan",
    "Parse a DESIGN.md file into its 10 sections and generate a structured implementation plan. Each section becomes one or more tasks with exact MCP calls (shadcn_get_component, motion_generate_animation, design_tokens_generate, etc.) and self-review assertions. This is the bridge from designer to forge-plan.",
    {
      design_md_path: z.string().describe("Absolute path to the DESIGN.md file"),
      framework: z.enum(["react", "next", "vue", "svelte", "html"]).optional().describe("Target framework (defaults to react+shadcn)"),
    },
    async ({ design_md_path, framework }) => {
      if (!isAbsolute(design_md_path)) {
        return {
          content: [{ type: "text" as const, text: `Error: design_md_path must be absolute. Got: ${design_md_path}` }],
          isError: true,
        };
      }
      if (!existsSync(design_md_path)) {
        return {
          content: [{ type: "text" as const, text: `Error: DESIGN.md not found at ${design_md_path}. Run hyperstack:designer first to produce one.` }],
          isError: true,
        };
      }

      const raw = readFileSync(design_md_path, "utf-8");
      const sections = parseDesignMd(raw);
      const fw = framework ?? "react";

      let text = `# Implementation Plan from DESIGN.md\n\n`;
      text += `**Source:** \`${design_md_path}\`\n`;
      text += `**Framework:** ${fw}\n`;
      text += `**Sections parsed:** ${Object.keys(sections).length}/10\n\n`;

      const missing = requiredSections.filter((s) => !sections[s]);
      if (missing.length > 0) {
        text += `> **Warning:** Missing required sections: ${missing.join(", ")}. Plan may be incomplete.\n\n`;
      }

      text += `---\n\n## Task Overview\n\n`;
      text += `| # | Task | Source Section | MCP Calls | Files |\n`;
      text += `|---|---|---|---|---|\n`;

      const tasks = buildTasks(sections, fw);
      tasks.forEach((t, i) => {
        text += `| ${i + 1} | ${t.name} | Section ${t.sourceSection} | ${t.mcpCalls.length} | ${t.files.length} |\n`;
      });

      text += `\n---\n\n## Detailed Tasks\n\n`;

      for (const [idx, task] of tasks.entries()) {
        text += `### Task ${idx + 1}: ${task.name}\n\n`;
        text += `**Source:** DESIGN.md ${task.sourceSection}\n`;
        text += `**Purpose:** ${task.purpose}\n\n`;

        text += `**Files:**\n`;
        for (const f of task.files) text += `- ${f}\n`;
        text += `\n`;

        if (task.mcpCalls.length > 0) {
          text += `**MCP Calls Required:**\n`;
          for (const call of task.mcpCalls) {
            text += `- \`${call.tool}(${call.params})\` → ${call.purpose}\n`;
          }
          text += `\n`;
        }

        text += `**Implementation Steps:**\n`;
        for (let i = 0; i < task.steps.length; i++) {
          text += `- [ ] **Step ${i + 1}:** ${task.steps[i]}\n`;
        }
        text += `\n`;

        text += `**Self-Review (assertions from DESIGN.md):**\n`;
        for (const a of task.assertions) {
          text += `- [ ] ${a}\n`;
        }
        text += `\n---\n\n`;
      }

      text += `## Handoff\n\n`;
      text += `This plan is generated from DESIGN.md. Every task traces back to a section.\n\n`;
      text += `**Next steps:**\n`;
      text += `1. Save this plan to \`docs/plans/\`\n`;
      text += `2. Invoke \`hyperstack:forge-plan\` or execute directly via autonomous mode\n`;
      text += `3. After implementation, run \`designer_verify_implementation\` to check compliance\n`;
      text += `4. Run \`hyperstack:ship-gate\` for final verification (it will check DESIGN.md compliance)\n\n`;
      text += `**If you find gaps during implementation:** escalate back to \`hyperstack:designer\` to update DESIGN.md. Do NOT invent what the contract doesn't specify.\n`;

      return { content: [{ type: "text" as const, text }] };
    }
  );
}

// ---------------------------------------------------------------------------
// DESIGN.md parser — extracts the 10 canonical sections
// ---------------------------------------------------------------------------

export const requiredSections = [
  "1. Visual Theme",
  "2. Color Palette",
  "3. Typography",
  "4. Spacing",
  "5. Component",
  "6. Motion",
  "7. Elevation",
  "8. Do",
  "9. Responsive",
  "10. Anti-Patterns",
];

export function parseDesignMd(raw: string): Record<string, string> {
  const sections: Record<string, string> = {};
  // Match headers like "## 1. Visual Theme & Atmosphere" or "## 2. Color Palette"
  const headerRegex = /^##\s+(\d+)\.\s+(.+?)$/gm;
  const matches: Array<{ num: number; title: string; start: number }> = [];

  let m: RegExpExecArray | null;
  while ((m = headerRegex.exec(raw)) !== null) {
    matches.push({
      num: parseInt(m[1]!, 10),
      title: m[2]!.trim(),
      start: m.index,
    });
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i]!;
    const next = matches[i + 1];
    const content = next ? raw.slice(current.start, next.start) : raw.slice(current.start);
    const key = `${current.num}. ${current.title}`;
    sections[key] = content.trim();
    // Also store by number prefix for lookup
    sections[`${current.num}`] = content.trim();
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Task builder — maps each DESIGN.md section to implementation tasks
// ---------------------------------------------------------------------------

export interface PlanTask {
  name: string;
  sourceSection: string;
  purpose: string;
  files: string[];
  mcpCalls: Array<{ tool: string; params: string; purpose: string }>;
  steps: string[];
  assertions: string[];
}

export function buildTasks(sections: Record<string, string>, framework: string): PlanTask[] {
  const tasks: PlanTask[] = [];

  // Task 1: Color tokens (Section 2)
  if (sections["2"]) {
    tasks.push({
      name: "Color tokens — OKLCH ramps + semantic tokens",
      sourceSection: "2 (Color Palette)",
      purpose: "Define the complete color system as CSS custom properties in Tailwind v4 @theme blocks",
      files: ["app/globals.css or src/styles/tokens.css"],
      mcpCalls: [
        {
          tool: "design_tokens_generate",
          params: "{ description: 'colors from DESIGN.md Section 2', brand: <extracted>, neutral: <extracted> }",
          purpose: "Generate Tailwind v4 @theme + :root + .dark blocks from OKLCH values",
        },
        {
          tool: "design_tokens_get_category",
          params: '"colors"',
          purpose: "Verify OKLCH token structure against reference",
        },
      ],
      steps: [
        "Extract brand/neutral/accent OKLCH values from DESIGN.md Section 2",
        "Call design_tokens_generate with those values",
        "Write the returned CSS to the tokens file",
        "Verify all 11-stop ramps present for each color",
        "Verify dark mode semantic tokens reference lighter stops (brand-400 not brand-500)",
      ],
      assertions: [
        "All semantic tokens from DESIGN.md Section 2 present in CSS",
        "Dark mode strategy matches DESIGN.md (bg-color elevation OR tonal overlays)",
        "Body text contrast >= 4.5:1 in both light and dark mode",
        "No hex/HSL values — only OKLCH",
      ],
    });
  }

  // Task 2: Typography (Section 3)
  if (sections["3"]) {
    tasks.push({
      name: "Typography — font loading + type scale",
      sourceSection: "3 (Typography)",
      purpose: "Load fonts and define type scale tokens with correct tracking/line-height per level",
      files: ["app/layout.tsx (font import)", "app/globals.css (type tokens)"],
      mcpCalls: [
        {
          tool: "design_tokens_get_category",
          params: '"typography"',
          purpose: "Get type scale token structure",
        },
      ],
      steps: [
        "Load fonts specified in DESIGN.md Section 3 (Google Fonts or local)",
        "Define --text-display, --text-h1 through --text-caption tokens",
        "Define --tracking-* tokens per level from DESIGN.md",
        "Define --leading-* tokens per level",
        "Apply fluid clamp() to headings only (body stays fixed 16px)",
      ],
      assertions: [
        "Max 2 font families loaded",
        "Body text is 16px fixed (not clamp)",
        "Headings use negative tracking (-0.01 to -0.03em)",
        "Line-height inverts with size (display tight, body generous)",
        "Fallback stack includes ui-sans-serif, system-ui, sans-serif",
        "No font-weight: 500 everywhere (weight contrast required)",
      ],
    });
  }

  // Task 3: Spacing (Section 4)
  if (sections["4"]) {
    tasks.push({
      name: "Spacing — 4px grid + semantic tokens",
      sourceSection: "4 (Spacing)",
      purpose: "Configure Tailwind v4 spacing with 4px base and semantic named tokens",
      files: ["app/globals.css (spacing tokens)"],
      mcpCalls: [
        {
          tool: "design_tokens_get_category",
          params: '"spacing"',
          purpose: "Get 4px grid token structure",
        },
      ],
      steps: [
        "Set --spacing base to 0.25rem (4px) in @theme",
        "Define --spacing-section-y, --spacing-card, --spacing-stack, --spacing-inline from DESIGN.md",
        "Define --spacing-grid-cards, --spacing-grid-2col",
        "Set content max-width from DESIGN.md Section 4",
      ],
      assertions: [
        "All spacing values are multiples of 4px",
        "Space within groups < space between groups",
        "Content max-width constraint active",
        "Prose max-width: 65ch applied to body text containers",
      ],
    });
  }

  // Task 4+: Components (Section 5) — one task per component
  if (sections["5"]) {
    const components = extractComponentsFromSection(sections["5"]);
    for (const comp of components) {
      tasks.push({
        name: `Component: ${comp}`,
        sourceSection: `5 (Components) — ${comp}`,
        purpose: `Implement ${comp} with ALL states and variants per DESIGN.md spec`,
        files: [`components/ui/${comp.toLowerCase()}.tsx`],
        mcpCalls: [
          {
            tool: "shadcn_list_components",
            params: "",
            purpose: "Find matching shadcn primitive",
          },
          {
            tool: "shadcn_get_component",
            params: `"${comp.toLowerCase()}"`,
            purpose: "Fetch shadcn source code as starting point",
          },
          {
            tool: "shadcn_get_rules",
            params: "",
            purpose: "Get composition rules (Base UI, Tailwind v4, data-slots)",
          },
          {
            tool: "ui_ux_get_component_pattern",
            params: `"${comp.toLowerCase()}"`,
            purpose: "Get pattern requirements (states, sizes, a11y)",
          },
        ],
        steps: [
          `Fetch shadcn ${comp.toLowerCase()} source`,
          `Customize variants per DESIGN.md Section 5 ${comp} spec`,
          `Implement ALL states: default, hover, active, focus, disabled, loading`,
          `Apply color tokens from Task 1`,
          `Apply typography tokens from Task 2`,
          `Apply spacing tokens from Task 3`,
          `Add aria-labels and keyboard handlers per Section 5 accessibility`,
          `Write component test covering all states`,
        ],
        assertions: [
          `ALL required states present (default/hover/active/focus/disabled/loading)`,
          `Touch target >= 44px`,
          `Focus ring 2px with 2px offset`,
          `cursor: pointer on clickable areas`,
          `aria-label on icon-only variants`,
          `No emoji icons (SVG only)`,
        ],
      });
    }
  }

  // Task: Motion (Section 6)
  if (sections["6"]) {
    tasks.push({
      name: "Motion — transitions + animations",
      sourceSection: "6 (Motion)",
      purpose: "Define duration/easing tokens and implement animations per DESIGN.md motion spec",
      files: ["app/globals.css (motion tokens)", "components with motion"],
      mcpCalls: [
        {
          tool: "motion_generate_animation",
          params: "{ description: '<from DESIGN.md>', durations: <from DESIGN.md>, easing: <from DESIGN.md> }",
          purpose: "Generate Framer Motion JSX for each animated component",
        },
        {
          tool: "motion_get_transitions",
          params: "",
          purpose: "Get transition patterns reference",
        },
      ],
      steps: [
        "Define --duration-fast/normal/slow/slower tokens from DESIGN.md",
        "Define easing tokens: ease-out (enter), ease-in (exit), ease-in-out (reposition)",
        "Apply prefers-reduced-motion override in @layer base with !important",
        "Call motion_generate_animation for each animated component",
        "Verify exits are 50-100ms shorter than entrances",
      ],
      assertions: [
        "prefers-reduced-motion implemented with !important",
        "No transitions > 500ms for UI",
        "No linear easing",
        "Only transform + opacity animated (GPU-accelerated)",
        "No animate-bounce/pulse on static elements",
      ],
    });
  }

  // Task: Elevation (Section 7)
  if (sections["7"]) {
    tasks.push({
      name: "Elevation — shadows + z-index scale",
      sourceSection: "7 (Elevation)",
      purpose: "Define 5-level shadow system (light) + bg-color elevation (dark) + named z-index scale",
      files: ["app/globals.css (elevation tokens)"],
      mcpCalls: [
        {
          tool: "design_tokens_get_category",
          params: '"shadows"',
          purpose: "Get shadow token structure",
        },
        {
          tool: "design_tokens_get_category",
          params: '"z-index"',
          purpose: "Get z-index scale structure",
        },
      ],
      steps: [
        "Define --shadow-surface-1 through --shadow-surface-4 with warm oklch tints (not rgba)",
        "Define --surface-0 through --surface-4 bg colors for dark mode elevation",
        "Define --z-dropdown (1000), --z-sticky (1020), --z-modal (1050), --z-tooltip (1070), --z-toast (1080)",
        "Dark mode: apply bg-color elevation (NOT shadows)",
      ],
      assertions: [
        "Shadows use oklch, not rgba(0,0,0)",
        "Dark mode uses bg-color elevation (shadows invisible on dark)",
        "Z-index uses named scale (no 9999 or arbitrary values)",
      ],
    });
  }

  // Task: Responsive (Section 9)
  if (sections["9"]) {
    tasks.push({
      name: "Responsive — breakpoint overrides",
      sourceSection: "9 (Responsive Breakpoints)",
      purpose: "Apply mobile-first responsive behavior at 375/768/1024/1280/1440px breakpoints",
      files: ["component files (responsive modifiers)"],
      mcpCalls: [
        {
          tool: "ui_ux_get_principle",
          params: '"responsive"',
          purpose: "Get mobile-first principles",
        },
      ],
      steps: [
        "Write mobile styles first (375px base)",
        "Add md: (768px) overrides for tablet",
        "Add lg: (1024px) overrides for desktop",
        "Add xl: (1280px) overrides for wide desktop",
        "Use min-h-dvh not 100vh for full-height mobile containers",
        "Test at 375px, 768px, 1024px, 1440px",
      ],
      assertions: [
        "No horizontal scroll on mobile at 375px",
        "Content max-width active at 1280px+",
        "Touch targets >= 44px at mobile breakpoint",
        "dvh used instead of vh for mobile full-height",
      ],
    });
  }

  // Task: Final anti-pattern audit (Section 10)
  tasks.push({
    name: "Anti-pattern audit — final compliance check",
    sourceSection: "10 (Anti-Patterns)",
    purpose: "Run full DESIGN.md compliance verification before declaring complete",
    files: ["all source files (audit pass)"],
    mcpCalls: [
      {
        tool: "designer_verify_implementation",
        params: `{ design_md_path: "${sections["1"] ? "<DESIGN.md path>" : "unknown"}", code_paths: ["<list>"] }`,
        purpose: "Programmatic compliance check against DESIGN.md",
      },
      {
        tool: "designer_get_anti_patterns",
        params: "{ industry: <from DESIGN.md> }",
        purpose: "Get industry-specific violations to verify absence",
      },
    ],
    steps: [
      "grep for #6366F1 and AI purple gradients — must be absent",
      "grep for font-weight: 500 — verify weight contrast exists",
      "grep for rgba(0,0,0 — verify no cold shadows on warm surfaces",
      "grep for animate-bounce/animate-pulse — verify only on loading states",
      "grep for outline: none — verify replaced with focus ring",
      "Verify every component has ALL required states",
      "Verify prefers-reduced-motion present",
      "Run designer_verify_implementation for programmatic check",
      "Run hyperstack:ship-gate for final verification",
    ],
    assertions: [
      "Zero matches in anti-pattern grep",
      "All P1-P10 rules from designer SKILL.md pass",
      "designer_verify_implementation returns no critical failures",
      "ship-gate DESIGN.md compliance gate passes",
    ],
  });

  return tasks;
}

function extractComponentsFromSection(section5Text: string): string[] {
  // Look for component headings: ### Button, ### Input, etc.
  const regex = /^###\s+([A-Z][A-Za-z\s]+?)(?:\n|$)/gm;
  const components = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = regex.exec(section5Text)) !== null) {
    const name = m[1]!.trim().split(/\s+/)[0]!; // first word
    if (name && !["Component", "All", "States", "Variants"].includes(name)) {
      components.add(name);
    }
  }
  // Fallback to common components if none found
  if (components.size === 0) {
    return ["Button", "Input", "Card"];
  }
  return Array.from(components);
}
