import { snippet } from "./loader.js";

export interface Principle {
  name: string;
  domain: Domain;
  rule: string;
  detail: string;
  examples?: string[];
  antiPatterns?: string[];
  cssExample?: string;
}

export interface ComponentPattern {
  name: string;
  variants?: string[];
  states: string[];
  rules: string[];
  code?: string;
}

export interface Checklist {
  domain: Domain;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  label: string;
  detail: string;
  critical: boolean;
}

export const DOMAINS = [
  "typography", "color", "spacing", "elevation",
  "motion", "accessibility", "responsive", "components",
] as const;
export type Domain = (typeof DOMAINS)[number];

// ---------------------------------------------------------------------------
// PRINCIPLES
// ---------------------------------------------------------------------------

export const PRINCIPLES: Principle[] = [
  // TYPOGRAPHY
  {
    name: "type-scale",
    domain: "typography",
    rule: "Use mathematical ratios for type scale, not arbitrary sizes.",
    detail: "Common ratios: 1.25 (Major Third), 1.333 (Perfect Fourth), 1.414 (Augmented Fourth). Recommended web scale: Display 48-72px, H1 40-56px, H2 28-40px, H3 20-24px, Subtitle 16-20px, Body 16px, Body-sm 14px, Caption 13px, Overline 12px.",
    cssExample: snippet("principles/type-scale.txt"),
    antiPatterns: ["Random px values with no ratio", "Fluid body text (causes reflow)", "More than 2 type families"],
  },
  {
    name: "line-height-rules",
    domain: "typography",
    rule: "Line height ratio increases as font size decreases.",
    detail: "Large text 24px+: tight (1.05–1.2) — built-in optical spacing. Body text 14–18px: generous (1.6–1.75) — reading comfort. Small text 12–13px: moderate (1.4–1.5).",
    antiPatterns: ["Same line height for headings and body", "Line height below 1.4 for body text"],
  },
  {
    name: "tracking-rules",
    domain: "typography",
    rule: "Headings: negative tracking. Body: zero. Overlines: positive.",
    detail: "Headings -0.01 to -0.03em (improves density at large sizes). Body: zero (default kerning is optimal). Overlines/caps: +0.06 to +0.10em (spreads uppercase for legibility). NEVER track body text negatively.",
    antiPatterns: ["Negative tracking on body text (kills readability)", "Tracking headings positively"],
  },
  {
    name: "font-pairing",
    domain: "typography",
    rule: "Max 2 font families. Sans + mono is safest for apps.",
    detail: "Mono only for: code, technical values, badges, terminal output. Always include fallback stack: `ui-sans-serif, system-ui, sans-serif`.",
    antiPatterns: ["3+ font families", "Decorative fonts for body text", "Missing fallback stack"],
  },
  {
    name: "prose-width",
    domain: "typography",
    rule: "Max prose width: 65ch (~600px). Beyond this, eye tracking degrades.",
    detail: "Apply `max-width: 65ch` to all body text containers. This is not the page width — cards and components can be wider.",
    cssExample: snippet("principles/prose-width.txt"),
    antiPatterns: ["Full-width paragraphs", "Applying 65ch to the whole layout"],
  },

  // COLOR
  {
    name: "oklch-color-space",
    domain: "color",
    rule: "Use OKLCH for new projects — perceptually uniform, P3 gamut, Tailwind v4 native.",
    detail: "oklch(L C H): L=Lightness 0–1, C=Chroma 0–0.4, H=Hue 0–360°. Each axis is independent. To darken: reduce L. To desaturate: reduce C. To shift hue: adjust H only.",
    cssExample: snippet("principles/oklch-color.txt"),
    antiPatterns: ["Mixing HSL and OKLCH", "Using rgb() for brand colors in new projects"],
  },
  {
    name: "warm-vs-cool-neutrals",
    domain: "color",
    rule: "Commit to warm OR cool neutrals — never mix.",
    detail: "Warm (C 0.005–0.015, H 50–80°): inviting, premium. Cool (C ~0, H 220–240°): technical, corporate. Mixing warm backgrounds with cool borders breaks visual coherence.",
    antiPatterns: ["Warm bg with cool border", "Switching neutral tone across components"],
  },
  {
    name: "wcag-contrast",
    domain: "color",
    rule: "Body text: 4.5:1 (AA). Large text ≥18px bold or ≥24px: 3:1 (AA). UI components: 3:1.",
    detail: "AAA (enhanced): 7:1 for body, 4.5:1 for large. Fix: reduce OKLCH Lightness (L) of status colors from ~0.63 to ~0.55. Keep C and H unchanged.",
    examples: ["Run: npm install wcag-contrast", "Online: https://webaim.org/resources/contrastchecker/"],
    antiPatterns: ["Testing only in light mode", "Assuming brand colors pass without checking"],
  },
  {
    name: "dark-mode-principles",
    domain: "color",
    rule: "Dark mode: redesign, don't invert. Warm charcoal, not black.",
    detail: "Background: oklch(0.13 0.008 265) — warm charcoal, not #000. Text: oklch(0.94 0.008 265) — off-white, not #fff. Higher elevation = lighter bg (shadows invisible on dark). Reduce saturation slightly (vivid on dark = neon). Primary accents brighten: brand-600 → brand-400.",
    cssExample: snippet("principles/dark-mode.txt"),
    antiPatterns: ["Pure black background (#000)", "Pure white text (#fff) on dark", "Inverting light mode colors directly"],
  },
  {
    name: "semantic-status-colors",
    domain: "color",
    rule: "Always provide solid + soft variant for status colors (success/error/warning/info).",
    detail: "Solid: passes 4.5:1 with white text (L ~0.55). Soft: light tinted bg + dark text for non-critical contexts. Warning uses dark text (not white) because amber is too light.",
    cssExample: snippet("principles/semantic-status-colors.txt"),
    antiPatterns: ["White text on warning (fails contrast)", "Same color for solid and soft"],
  },

  // SPACING
  {
    name: "4px-grid",
    domain: "spacing",
    rule: "All spacing = multiples of 4px: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96px.",
    detail: "Provides enough granularity without pixel-pushing. In Tailwind v4, `--spacing: 0.25rem` sets the base and all utilities derive from it automatically.",
    antiPatterns: ["6px, 10px, 14px values", "Mixing 4px and 8px grids"],
  },
  {
    name: "spacing-hierarchy",
    domain: "spacing",
    rule: "Space within groups < space between groups. This is the single most important spatial rule.",
    detail: "Tight (4–8px): related elements (icon + label). Medium (12–24px): grouped (card padding). Loose (32–64px): separated (grid gaps). Section (64–96px): major divisions.",
    antiPatterns: ["Same gap between items and between sections", "Large internal padding with small section gaps"],
  },

  // ELEVATION
  {
    name: "5-elevation-levels",
    domain: "elevation",
    rule: "5 surface levels. Each must be visually distinguishable via bg color, not just borders.",
    detail: "Level 0: flat (page bg). Level 1: subtle (inline cards). Level 2: raised (standard cards). Level 3: elevated (dropdowns, popovers). Level 4: floating (modals, dialogs). In dark mode: no shadows — use progressively lighter bg colors.",
    cssExample: snippet("principles/5-elevation-levels.txt"),
    antiPatterns: ["Borders as the only elevation signal", "Shadows on dark backgrounds"],
  },
  {
    name: "warm-shadows",
    domain: "elevation",
    rule: "Shadows must be warm-tinted (oklch), never rgba(0,0,0,...).",
    detail: "Pure black shadows look harsh and disconnected from warm UIs. Tint shadows with a warm hue at very low opacity.",
    cssExample: snippet("principles/warm-shadows.txt"),
    antiPatterns: ["rgba(0,0,0,...) shadows in warm UI", "High-opacity shadows (>0.2)"],
  },

  // MOTION
  {
    name: "duration-rules",
    domain: "motion",
    rule: "Exits faster than entrances. Users initiated the exit — they expect immediacy.",
    detail: "0ms: instant state changes. 100–150ms: hover/focus/toggles. 200ms: default transitions. 300ms: panel open/close. 400–500ms: complex animations. Exits: subtract 50–100ms from enter duration.",
    antiPatterns: ["Same duration for enter and exit", "Transitions longer than 500ms in UI (feels sluggish)"],
  },
  {
    name: "easing-rules",
    domain: "motion",
    rule: "ease-out for entering. ease-in for exiting. ease-in-out for repositioning. NEVER linear.",
    detail: "ease-out: elements appearing — starts fast, settles naturally. ease-in: elements leaving — starts gently, ends decisively. ease-in-out: elements moving to new position. Spring/bounce: playful feedback only.",
    cssExample: snippet("principles/easing-rules.txt"),
    antiPatterns: ["Linear easing for any UI motion", "Bounce/spring for serious/professional contexts"],
  },
  {
    name: "reduced-motion",
    domain: "motion",
    rule: "ALWAYS implement prefers-reduced-motion. Not optional.",
    detail: "Place in @layer base with !important. Applies to all elements and pseudos. Some users have vestibular disorders — motion can cause nausea.",
    cssExample: snippet("principles/reduced-motion.txt"),
    antiPatterns: ["Missing prefers-reduced-motion", "Only disabling some animations"],
  },

  // ACCESSIBILITY
  {
    name: "touch-targets",
    domain: "accessibility",
    rule: "Touch targets: min 44×44px (WCAG), recommended 48×48px. Gap ≥ 8px between targets.",
    detail: "Visual size ≠ touch target. A 34px button can have a 44px hit area via padding or ::after pseudo-element. Gap prevents accidental taps on adjacent targets.",
    cssExample: snippet("principles/touch-targets.txt"),
    antiPatterns: ["< 44px touch targets on mobile", "Adjacent buttons with no gap"],
  },
  {
    name: "focus-management",
    domain: "accessibility",
    rule: "Every interactive element MUST have visible focus indicator: 2px ring, 2px offset, primary color.",
    detail: "Trap focus in modals. Return focus to trigger on close. Never `outline: none` without a custom focus style.",
    cssExample: snippet("principles/focus-management.txt"),
    antiPatterns: ["outline: none without custom focus", "Focus styles with < 3:1 contrast", "No focus trap in modals"],
  },
  {
    name: "color-not-only-indicator",
    domain: "accessibility",
    rule: "Never use color as the ONLY state indicator — add icons, text, or patterns.",
    detail: "8% of men have color vision deficiency. Error states need both red color AND an error icon or text. Links need underline OR other visual differentiation beyond color.",
    antiPatterns: ["Red border as sole error indicator", "Links distinguished only by color"],
  },

  // RESPONSIVE
  {
    name: "breakpoints",
    domain: "responsive",
    rule: "Content-driven breakpoints, not device-driven.",
    detail: "Common breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px. But add a breakpoint where your content breaks — not where a device exists.",
    antiPatterns: ["Breakpoints at arbitrary device widths", "More than 5 breakpoints"],
  },
  {
    name: "mobile-first",
    domain: "responsive",
    rule: "Write mobile styles first, override with min-width queries.",
    detail: "Mobile-first produces smaller CSS. Most traffic is mobile. Progressive enhancement > graceful degradation.",
    cssExample: snippet("principles/mobile-first.txt"),
    antiPatterns: ["Desktop-first with max-width overrides", "Separate mobile stylesheet"],
  },
];

// ---------------------------------------------------------------------------
// COMPONENT PATTERNS
// ---------------------------------------------------------------------------

export const COMPONENT_PATTERNS: ComponentPattern[] = [
  {
    name: "button",
    variants: ["primary", "secondary", "ghost", "destructive", "link"],
    states: ["default", "hover", "active", "focus", "disabled", "loading"],
    rules: [
      "Min height 36px (sm), 40px (md), 44px (lg)",
      "Disabled: opacity 0.5, pointer-events none, aria-disabled",
      "Loading: show spinner, keep original width to prevent layout shift",
      "Touch target min 44px — use padding to expand if needed",
      "Primary: solid brand bg. Secondary: outlined. Ghost: transparent. Destructive: error color.",
    ],
    code: snippet("components/button.txt"),
  },
  {
    name: "card",
    variants: ["default", "elevated", "outlined", "interactive"],
    states: ["default", "hover", "focus", "selected"],
    rules: [
      "Padding 20–28px (sm screens), 28–40px (lg screens)",
      "Interactive cards need focus ring and cursor: pointer",
      "Use surface color, not bg color — for elevation distinction",
      "Border radius: 8px (sm), 12px (md), 16px (lg)",
    ],
  },
  {
    name: "badge",
    variants: ["default", "success", "error", "warning", "info", "outline"],
    states: ["default"],
    rules: [
      "Font: monospace or semi-bold sans-serif",
      "Height: 20px (sm), 24px (md)",
      "Padding: 0 6px (sm), 0 8px (md)",
      "Always include solid + soft variants per status",
      "Never use color alone — include semantic text or icon",
    ],
  },
  {
    name: "form-input",
    variants: ["text", "textarea", "select", "checkbox", "radio"],
    states: ["default", "hover", "focus", "error", "disabled", "readonly"],
    rules: [
      "Height: 36px (sm), 40px (md), 44px (lg)",
      "Error: red border + error icon + error text below (never color alone)",
      "Placeholder: muted color (not same as label)",
      "Label always visible (never placeholder-as-label)",
      "Focus: 2px ring at --color-primary",
    ],
  },
];

// ---------------------------------------------------------------------------
// CHECKLISTS
// ---------------------------------------------------------------------------

export const CHECKLISTS: Checklist[] = [
  {
    domain: "typography",
    items: [
      { label: "Type scale uses mathematical ratio", detail: "1.25 or 1.333 ratio between steps", critical: true },
      { label: "Heading line heights are tight (1.1)", detail: "Not body line height (1.75)", critical: true },
      { label: "Body line height generous (1.6–1.75)", detail: "Reading comfort at 16px", critical: true },
      { label: "No negative tracking on body text", detail: "Only headings get negative tracking", critical: true },
      { label: "Prose max-width: 65ch", detail: "Applied to content containers, not page", critical: false },
      { label: "Max 2 font families", detail: "Sans + mono for apps", critical: false },
      { label: "Fallback font stack present", detail: "ui-sans-serif, system-ui, sans-serif", critical: false },
      { label: "Fluid type uses clamp()", detail: "Headings only, body is fixed 16px", critical: false },
    ],
  },
  {
    domain: "color",
    items: [
      { label: "Body text 4.5:1 contrast (AA)", detail: "Test every text+bg combination", critical: true },
      { label: "UI components 3:1 contrast", detail: "Borders, icons, input outlines", critical: true },
      { label: "No pure black (#000)", detail: "Use dark neutral e.g. #1C1917", critical: true },
      { label: "No pure white (#FFF) for bg", detail: "Use tinted white e.g. #FAF8F5", critical: false },
      { label: "Warm/cool neutrals committed", detail: "Never mix warm bg with cool borders", critical: true },
      { label: "Status colors have soft variant", detail: "Solid + soft for success/error/warning/info", critical: false },
      { label: "Dark mode redesigned, not inverted", detail: "Warm charcoal, off-white text", critical: true },
    ],
  },
  {
    domain: "accessibility",
    items: [
      { label: "Touch targets ≥ 44×44px", detail: "All interactive elements on mobile", critical: true },
      { label: "Focus indicators on all interactive elements", detail: "2px ring, 2px offset, primary color", critical: true },
      { label: "Focus trapped in modals", detail: "Tab stays within modal, returned on close", critical: true },
      { label: "prefers-reduced-motion implemented", detail: "In @layer base with !important", critical: true },
      { label: "Color not sole state indicator", detail: "Error needs icon/text, not just red", critical: true },
      { label: "All images have alt text", detail: "Decorative: alt=''", critical: true },
    ],
  },
  {
    domain: "motion",
    items: [
      { label: "prefers-reduced-motion: reduce", detail: "All animations disabled", critical: true },
      { label: "Exits faster than entrances", detail: "Enter 200ms → exit 150ms", critical: false },
      { label: "No linear easing", detail: "ease-out for entering, ease-in for exiting", critical: false },
      { label: "No transitions > 500ms", detail: "Feels sluggish", critical: false },
      { label: "Spring/bounce limited to playful contexts", detail: "Not in professional/serious UIs", critical: false },
    ],
  },
];

// ---------------------------------------------------------------------------
// GOTCHAS
// ---------------------------------------------------------------------------

export const GOTCHAS: { domain: Domain; gotcha: string; fix: string }[] = [
  { domain: "typography", gotcha: "Heading line heights match body (1.75)", fix: "Headings need tight line height: 1.05–1.2" },
  { domain: "typography", gotcha: "Negative tracking on body text", fix: "Body tracking = 0. Only headings go negative." },
  { domain: "typography", gotcha: "More than 2 font families", fix: "Stick to Sans + Mono. Decorative fonts for headings only." },
  { domain: "color", gotcha: "Pure black (#000) for text", fix: "Use oklch(0.12 0.005 60) or similar warm dark neutral" },
  { domain: "color", gotcha: "Pure white (#FFF) background", fix: "Use oklch(0.98 0.004 60) — tinted white" },
  { domain: "color", gotcha: "Warm backgrounds with cool borders", fix: "Commit to one neutral temperature throughout" },
  { domain: "color", gotcha: "rgba(0,0,0,...) shadows", fix: "Use oklch-tinted shadows: oklch(0.22 0.006 56 / 0.08)" },
  { domain: "elevation", gotcha: "Shadows as only elevation signal in dark mode", fix: "Shadows invisible on dark. Use progressively lighter bg per level." },
  { domain: "motion", gotcha: "Missing prefers-reduced-motion", fix: "Add to @layer base with !important on * and pseudos" },
  { domain: "motion", gotcha: "Linear easing for UI motion", fix: "ease-out entering, ease-in exiting, ease-in-out repositioning" },
  { domain: "accessibility", gotcha: "outline: none with no custom focus style", fix: "Always replace with visible 2px ring" },
  { domain: "accessibility", gotcha: "Color as only error indicator", fix: "Add error icon and text message alongside red color" },
  { domain: "components", gotcha: "Z-index values: 999, 9999, 99999", fix: "Define scale: dropdown=1000, modal=1050, tooltip=1070, toast=1080" },
  { domain: "components", gotcha: "Disabled opacity not 0.5", fix: "Less = unreadable. More = doesn't look disabled. Exactly 0.5." },
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

export function getPrinciplesByDomain(domain: Domain): Principle[] {
  return PRINCIPLES.filter((p) => p.domain === domain);
}

export function searchPrinciples(query: string): Principle[] {
  const q = query.toLowerCase();
  return PRINCIPLES.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.rule.toLowerCase().includes(q) ||
      p.detail.toLowerCase().includes(q) ||
      p.domain.toLowerCase().includes(q)
  );
}

export function getComponentPatternByName(name: string): ComponentPattern | undefined {
  return COMPONENT_PATTERNS.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
}

export function getChecklistByDomain(domain: Domain): Checklist | undefined {
  return CHECKLISTS.find((c) => c.domain === domain);
}

export function getAllGotchas(domain?: Domain): { domain: Domain; gotcha: string; fix: string }[] {
  return domain ? GOTCHAS.filter((g) => g.domain === domain) : GOTCHAS;
}
