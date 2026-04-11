import { snippet } from "./loader.js";

export interface TokenCategory {
  name: string;
  description: string;
  layer: "primitive" | "semantic" | "domain";
  cssExample: string;
  tailwindExample?: string;
  rules: string[];
  gotchas: string[];
}

export interface RampStop {
  stop: number;
  oklch: string;
  role: string;
  lightMode: string;
  darkMode?: string;
}

export interface ColorRamp {
  name: string;
  description: string;
  stops: RampStop[];
}

export interface TokenProcedure {
  step: number;
  title: string;
  description: string;
  code: string;
  rules: string[];
  gotchas: string[];
}

// ---------------------------------------------------------------------------
// TOKEN CATEGORIES
// ---------------------------------------------------------------------------

export const TOKEN_CATEGORIES: TokenCategory[] = [
  {
    name: "colors",
    description:
      "OKLCH-based color system using three-layer architecture: @theme primitives → :root/:dark semantics → domain tokens. Role-based naming prevents color-name coupling.",
    layer: "semantic",
    cssExample: snippet("categories/colors.txt"),
    tailwindExample: `<!-- Tailwind v4 utilities from @theme inline -->
<div class="bg-background text-foreground">
  <button class="bg-primary text-primary-foreground hover:bg-primary/90">
    Button
  </button>
  <p class="text-muted">Muted text</p>
</div>`,
    rules: [
      "Always use role-based names (--color-brand-500), never hue names (--color-violet-500)",
      "Three-layer architecture: @theme primitives → :root/:dark semantics → @theme inline utilities",
      "Dark mode uses oklch charcoal backgrounds (L 0.15-0.25), not pure black",
      "Status colors (success/error/warning) need L ~0.55 for 4.5:1 contrast with white foreground",
      "Brand color at 500 is the default for light mode; 400 for dark mode primary",
      "@theme inline is REQUIRED to expose CSS custom properties as Tailwind utilities",
      "Commit to one neutral temperature (warm OR cool) — never mix warm bg with cool borders",
    ],
    gotchas: [
      "@theme inline vs @theme: inline bridges runtime-swappable CSS vars; plain @theme defines static compile-time primitives. Use @theme for color ramp primitives, @theme inline to expose semantic tokens as utilities.",
      "Status colors (success green, error red) typically need L reduced from 0.63 to 0.55 for 4.5:1 contrast with white — run a contrast audit after finalizing the palette.",
      "Dark mode elevation: shadows are invisible on dark backgrounds. Use progressively lighter bg-color per elevation level instead of box-shadow.",
      "After renaming ramps, grep for stale hue-based names (e.g., old 'violet-500' references) in component files.",
      "oklch(0.62 0.14 291) and oklch(0.62 0.14 291 / 0.5) are different values — alpha must be explicit in oklch.",
      "Pure black (#000) and pure white (#fff) look harsh. Use near-black (oklch 0.10-0.15) and near-white (oklch 0.97-0.99) instead.",
      "Before inverting a site's default mode, verify the existing codebase's aesthetic direction. If every component uses dark backgrounds (charcoal-800, charcoal-900) with light text (offwhite, white/60), dark IS the default. Setting :root to light values and adding .dark overrides will make 90% of text unreadable until every component is migrated.",
    ],
  },
  {
    name: "spacing",
    description:
      "4px base grid system with named semantic tokens. The --spacing variable in Tailwind v4 is the base multiplier (0.25rem = 4px), not an individual token.",
    layer: "semantic",
    cssExample: snippet("categories/spacing.txt"),
    tailwindExample: `<!-- Named spacing utilities -->
<section class="py-section-y px-section-x">
  <div class="max-w-container-max mx-auto">
    <div class="grid grid-cols-3 gap-grid-cards">
      <div class="p-card bg-surface rounded-lg">
        <div class="flex items-center gap-inline">
          <Icon /> <span>Label</span>
        </div>
      </div>
    </div>
  </div>
</section>`,
    rules: [
      "--spacing in Tailwind v4 is the BASE MULTIPLIER (0.25rem), not individual token overrides",
      "ALL spacing values must be multiples of 4px (0.25rem increments)",
      "Space within groups < space between groups (single most important spacing rule)",
      "Named semantic tokens (--spacing-card, --spacing-section-y) auto-generate Tailwind utilities",
      "Use semantic names based on context/role, not pixel values (--spacing-card not --spacing-28)",
      "Mobile section-x: 1.5rem (24px); desktop: 3rem (48px) via responsive override",
    ],
    gotchas: [
      "--spacing in Tailwind v4 sets the multiplier for ALL numeric spacing utilities (p-4 = 4 × 0.25rem = 1rem). Overriding it changes EVERY spacing utility across the project.",
      "Named tokens like --spacing-card generate class p-card, but ONLY if defined in @theme or :root with Tailwind v4's CSS variable scanning. Verify the class exists before shipping.",
      "Do not use arbitrary pixel values outside the 4px grid (e.g., 7px, 13px, 22px) — they break visual rhythm.",
      "section-x padding should be responsive: smaller on mobile (1.5rem), larger on desktop (3-4rem). A single static value often looks wrong on one breakpoint.",
    ],
  },
  {
    name: "typography",
    description:
      "Fluid type scale using clamp() for display/heading sizes, fixed 16px body. Role-based tokens with strict line-height and tracking rules.",
    layer: "semantic",
    cssExample: snippet("categories/typography.txt"),
    tailwindExample: `<!-- Typography roles in JSX -->
<article class="max-w-[65ch]">
  <p class="text-overline text-primary mb-2">Category Label</p>
  <h1 class="text-h1 mb-4">Page Heading</h1>
  <p class="text-subtitle text-muted mb-6">
    A clear subtitle sentence introducing the content.
  </p>
  <p class="text-body leading-body">Body paragraph text at 16px with generous line height.</p>
</article>`,
    rules: [
      "Large text (24px+) requires tight line height (1.05–1.2); body requires generous (1.6–1.75)",
      "As font size decreases, line height must increase",
      "Headings use negative tracking (-0.01 to -0.03em); body uses zero tracking; overlines use positive (+0.06 to +0.10em)",
      "NEVER apply negative tracking to body text — it reduces readability",
      "Body text is FIXED at 16px — never use fluid clamp() for body",
      "Maximum 2 font families per project; mono only for code, badges, terminal output",
      "Prose max-width: 65ch for optimal reading line length",
      "Type scale ratios: minor third (1.25), perfect fourth (1.333), or augmented fourth (1.414)",
    ],
    gotchas: [
      "Tight line-height on body text (e.g., 1.2) is a critical readability bug. Always use 1.6+ for paragraph text.",
      "clamp() fluid scaling on body text causes reflow and unpredictable sizing on resize — keep body sizes fixed.",
      "Mixing font-weight 700 heading with font-weight 400 body in the same font variable file requires a variable font or separate font loads.",
      "letter-spacing in em is relative to font-size, so -0.03em on display (72px) = -2.16px — verify visually at each size.",
      "overline text-transform: uppercase with positive tracking looks correct; without uppercase it looks odd.",
    ],
  },
  {
    name: "component-sizing",
    description:
      "Standardized component size scales for buttons, inputs, icons, and avatars. Includes WCAG touch target minimums.",
    layer: "semantic",
    cssExample: snippet("categories/component-sizing.txt"),
    tailwindExample: `<!-- Button variants using sizing tokens -->
<button class="btn btn-lg bg-primary text-primary-foreground hover:bg-primary/90">
  Large Button
</button>
<button class="btn btn-sm bg-surface text-foreground border border-border">
  Small Button
</button>`,
    rules: [
      "All interactive elements on mobile must meet 44×44px touch target minimum (WCAG 2.5.5)",
      "Prefer 48px touch targets for comfortable use (2.5.5 AAA equivalent)",
      "Gap between adjacent touch targets must be ≥ 8px to prevent mis-taps",
      "Button md (40px) is the default for desktop; lg (44px) for mobile-first UIs",
      "Icon size inside button should be 1 step smaller than button text size",
      "Avatars in lists use sm (32px); standalone profile use lg/xl (48–64px)",
    ],
    gotchas: [
      "A 28px button without a larger hit area (via padding or pseudo-element) fails WCAG 2.5.5 on touch devices.",
      "Icon-only buttons require an explicit aria-label AND a visible tooltip — an icon alone is not accessible.",
      "Disabled buttons should still meet minimum size requirements even when opacity: 0.5.",
    ],
  },
  {
    name: "border-radius",
    description:
      "Consistent border radius scale from sharp (0) to pill. Semantic tokens for component contexts.",
    layer: "primitive",
    cssExample: snippet("categories/border-radius.txt"),
    tailwindExample: `<div class="rounded-lg p-card bg-surface">Card</div>
<button class="btn rounded-btn">Button</button>
<span class="rounded-full px-2 py-0.5 text-xs bg-primary/10 text-primary">Badge</span>`,
    rules: [
      "Keep radius consistent within a design system — all cards same radius, all buttons same radius",
      "Border radius should scale proportionally with component size (small badges use sm, large modals use xl)",
      "Pill (radius-full) is for badges, toggles, and avatar images — not general cards",
      "Inputs typically use smaller radius (sm/md) than cards (lg/xl) for visual differentiation",
    ],
    gotchas: [
      "Mixing large (24px) and small (4px) radii in adjacent components looks inconsistent. Pick 1–2 radius values per component tier.",
      "border-radius on a container does not clip overflowing children by default — add overflow: hidden if children need clipping.",
      "Very large radius (radius-3xl on small components) can make them look bubble-like and unpolished.",
    ],
  },
  {
    name: "shadows",
    description:
      "5-level elevation shadow scale using oklch-tinted warm shadows. Dark mode uses bg-color elevation instead of box shadows.",
    layer: "semantic",
    cssExample: snippet("categories/shadows-elevation.txt"),
    tailwindExample: `<!-- Light mode: box shadow -->
<div class="shadow-card rounded-card p-card bg-surface">Card</div>

<!-- Dark: elevation via bg-color (auto via CSS vars) -->
<div class="bg-[var(--color-surface-2)] rounded-card p-card">
  Elevated card in dark mode
</div>

<!-- Modal -->
<div class="shadow-modal rounded-modal bg-surface p-8">Modal</div>`,
    rules: [
      "Always use oklch-tinted warm shadows — never rgba(0,0,0) black shadows",
      "5 elevation levels: flat(none) / subtle(xs-sm) / raised(md) / elevated(lg) / floating(xl-2xl)",
      "Dark mode: shadows are invisible — use progressively lighter bg-color per elevation level instead",
      "Every elevation level must be visually distinguishable from adjacent levels",
      "Focus ring shadow uses 2px solid ring at 2px offset from element edge",
      "Modal/overlay uses shadow-2xl; dropdown uses shadow-lg; tooltip uses shadow-md",
    ],
    gotchas: [
      "rgba(0,0,0,0.1) shadows look cold and blue-grey on warm backgrounds. Use oklch-tinted shadows that complement your warm neutrals.",
      "In dark mode, box-shadow with dark backgrounds makes no visual difference. Forgetting to implement bg-color elevation in dark mode results in a flat, no-depth dark UI.",
      "Multiple box-shadow layers (comma-separated) are additive. Test on both dark and light backgrounds before shipping.",
      "shadow-focus must contrast with both the element background and the page background — test on white AND colored button variants.",
    ],
  },
  {
    name: "motion",
    description:
      "Duration and easing token system for consistent UI animation. Always includes prefers-reduced-motion override.",
    layer: "primitive",
    cssExample: snippet("categories/motion.txt"),
    tailwindExample: `<!-- Motion utilities from @theme -->
<button class="transition-[background-color,opacity] duration-fast ease-out">
  Button
</button>

<!-- Panel slide-in using semantic token -->
<div style={{ transition: "var(--transition-panel)" }}
     class="translate-x-0 data-[state=closed]:-translate-x-full">
  Sidebar panel
</div>`,
    rules: [
      "ALWAYS implement prefers-reduced-motion in @layer base with !important",
      "Hover/focus/toggles: 100–150ms (duration-fast)",
      "Default transitions (color, bg, border): 200ms (duration-normal)",
      "Panel open/close: 300ms (duration-slow)",
      "Complex animations: 400–500ms (duration-slower)",
      "Exits should be faster than entrances — user-initiated dismissal expects immediacy",
      "ease-out for entering elements, ease-in for exiting, ease-in-out for repositioning",
      "NEVER use linear easing for UI transitions (only for progress bars and loaders)",
    ],
    gotchas: [
      "Forgetting prefers-reduced-motion is a WCAG 2.3.3 violation. It must be in @layer base with !important to override inline styles.",
      "ease-in on enter makes the animation feel slow to start — always use ease-out for entering elements.",
      "Long exit durations (300ms+) make the UI feel sluggish because users are waiting to interact with the next state.",
      "CSS transition shorthand 'all' captures every property change, including layout — can cause jank. Explicitly list only the properties you want to animate.",
    ],
  },
  {
    name: "z-index",
    description:
      "Structured z-index scale to prevent stacking context chaos. Named semantic layers for every UI level.",
    layer: "primitive",
    cssExample: snippet("categories/z-index.txt"),
    tailwindExample: `<header class="sticky top-0 z-[var(--z-sticky)] bg-background/80 backdrop-blur">
  Navigation
</header>

<div class="fixed inset-0 z-[var(--z-overlay)] bg-black/50" />
<div class="fixed z-[var(--z-modal)] inset-10 bg-surface rounded-modal shadow-modal">
  Modal
</div>`,
    rules: [
      "NEVER use arbitrary z-index values (999, 9999) — always use named scale tokens",
      "Z-index only works on positioned elements (position: relative/absolute/fixed/sticky)",
      "Z-index is scoped to the stacking context — a child cannot exceed its parent's stacking context",
      "Sticky header should be below modals (z-sticky < z-modal)",
      "Toast notifications should be above everything except z-max",
      "Document every new z-index usage — stacking context bugs are very hard to debug",
    ],
    gotchas: [
      "transform, opacity < 1, filter, and will-change create new stacking contexts — a z-index on a child inside one of these is trapped within that context.",
      "z-index: 9999 on a component inside a transform: parent will still be below the parent's stacking context order.",
      "Libraries like Radix UI and Headless UI have their own z-index values (often 50-9999). Check their defaults before setting your own values.",
      "Two modals open simultaneously will stack by DOM order unless z-index is incremented dynamically.",
    ],
  },
  {
    name: "opacity",
    description:
      "Semantic opacity scale for disabled states, overlays, glass effects, and ghost UI elements.",
    layer: "primitive",
    cssExample: snippet("categories/opacity.txt"),
    tailwindExample: `<button disabled class="btn opacity-[var(--opacity-disabled)] cursor-not-allowed">
  Disabled
</button>

<!-- Modal overlay -->
<div class="fixed inset-0 bg-black opacity-[var(--opacity-overlay)]" />

<!-- Glass card -->
<div class="glass rounded-card p-card border border-white/10">
  Glass card
</div>`,
    rules: [
      "Disabled state: exactly 0.5 opacity (--opacity-disabled) — do not use 0.3 or 0.7",
      "pointer-events: none must accompany opacity: 0.5 on disabled elements",
      "Glass morphism requires backdrop-filter: blur() + semi-transparent background",
      "Opacity-based text muting (0.65) is acceptable; prefer semantic color tokens where possible",
      "Never use opacity < 0.35 for interactive elements — they become invisible to low-vision users",
    ],
    gotchas: [
      "opacity: 0 is different from visibility: hidden and display: none. opacity: 0 elements still receive pointer events and occupy layout space.",
      "backdrop-filter is not supported in all contexts — it requires the element to not have overflow: hidden on an ancestor. Test on Safari.",
      "Using opacity on a parent element reduces opacity of ALL children (including text) — for bg-only opacity, use an rgba/oklch background color with alpha channel instead.",
      "Disabled state with just opacity: 0.5 and no pointer-events: none still allows clicks — a common security/UX bug.",
    ],
  },
  {
    name: "density",
    description:
      "Density mode system for compact/default/comfortable UI via CSS class overrides on the root element.",
    layer: "domain",
    cssExample: snippet("categories/density.txt"),
    tailwindExample: `// React: density context provider
const DensityProvider = ({ density, children }) => (
  <div className={\`density-\${density}\`}>
    {children}
  </div>
);

// All spacing/sizing tokens automatically adjust inside the wrapper
<DensityProvider density="compact">
  <DataTable /> {/* Compact row heights, tighter padding */}
</DensityProvider>`,
    rules: [
      "Apply density class to the outermost wrapper — all child tokens cascade automatically",
      "Compact mode (0.75×): data-dense UIs like tables, admin panels, dashboards",
      "Default mode (1×): standard application interfaces",
      "Comfortable mode (1.125×): onboarding flows, marketing pages, reading UIs",
      "Touch targets must NEVER go below 44px even in compact mode — handle separately",
      "Only override the tokens that change; inherit everything else from default",
    ],
    gotchas: [
      "Compact density that reduces button height below 44px violates WCAG 2.5.5 on touch devices — either cap the minimum or apply density only on desktop breakpoints.",
      "Font sizes should change minimally between density modes (±1–2px) — the spacing/padding difference should drive the perception of density.",
      "Density mode on a nested component (not root) can cause unexpected token cascading if inner components define their own token values.",
    ],
  },
];

// ---------------------------------------------------------------------------
// COLOR RAMPS
// ---------------------------------------------------------------------------

export const COLOR_RAMPS: ColorRamp[] = [
  {
    name: "brand",
    description:
      "Primary brand color ramp (purple-violet, H=291). Used for CTAs, interactive elements, and brand identity.",
    stops: [
      { stop: 50,  oklch: "oklch(0.97 0.02 291)", role: "wash/tint",         lightMode: "Background tints, highlight bands",          darkMode: "Not used in dark mode" },
      { stop: 100, oklch: "oklch(0.94 0.04 291)", role: "subtle background", lightMode: "Hover state backgrounds, selected item bg",  darkMode: "Very dark tinted overlays" },
      { stop: 200, oklch: "oklch(0.88 0.06 291)", role: "hover background",  lightMode: "Pressed state backgrounds, focus rings",     darkMode: "Dark border accents" },
      { stop: 300, oklch: "oklch(0.78 0.09 291)", role: "active state",      lightMode: "Active state bg, icon fill in light mode",   darkMode: "Brand text on dark bg (subtle)" },
      { stop: 400, oklch: "oklch(0.70 0.12 291)", role: "dark mode primary", lightMode: "Strong icon fill",                          darkMode: "Primary CTA text, links, active indicators" },
      { stop: 500, oklch: "oklch(0.62 0.14 291)", role: "default brand",     lightMode: "Primary button bg, links, active indicators" },
      { stop: 600, oklch: "oklch(0.54 0.14 291)", role: "hover",             lightMode: "Hover state for brand-500 interactive elements" },
      { stop: 700, oklch: "oklch(0.46 0.13 291)", role: "dark text",         lightMode: "Brand-colored text on light bg",             darkMode: "Brand-colored borders" },
      { stop: 800, oklch: "oklch(0.38 0.11 291)", role: "dark borders",      lightMode: "Strong borders, dividers",                   darkMode: "Borders on dark elevated surfaces" },
      { stop: 900, oklch: "oklch(0.28 0.08 291)", role: "text light mode",   lightMode: "Brand-tinted text, headings with brand tone" },
      { stop: 950, oklch: "oklch(0.18 0.05 291)", role: "high emphasis",     lightMode: "Highest emphasis headings, near-black brand" },
    ],
  },
  {
    name: "neutral",
    description:
      "Warm neutral ramp (H=60-80, low chroma). Used for backgrounds, borders, text, and surfaces. Commit to warm OR cool — never mix.",
    stops: [
      { stop: 50,  oklch: "oklch(0.98 0.008 60)", role: "page background",   lightMode: "Main page background (warm off-white)",      darkMode: "Not used" },
      { stop: 100, oklch: "oklch(0.96 0.008 60)", role: "subtle bg",         lightMode: "Subtle backgrounds, zebra rows, code blocks", darkMode: "Not used" },
      { stop: 200, oklch: "oklch(0.92 0.008 60)", role: "border",            lightMode: "Default borders, dividers",                  darkMode: "Not typically used" },
      { stop: 300, oklch: "oklch(0.84 0.008 60)", role: "strong border",     lightMode: "Strong borders, input borders",               darkMode: "Subtle borders" },
      { stop: 400, oklch: "oklch(0.72 0.008 60)", role: "muted text",        lightMode: "Placeholder text, disabled text",            darkMode: "Strong borders, icons" },
      { stop: 500, oklch: "oklch(0.58 0.010 60)", role: "secondary text",    lightMode: "Secondary/muted text, captions",              darkMode: "Secondary text" },
      { stop: 600, oklch: "oklch(0.46 0.010 60)", role: "tertiary text",     lightMode: "Tertiary labels",                            darkMode: "Body text" },
      { stop: 700, oklch: "oklch(0.35 0.010 60)", role: "strong text",       lightMode: "Strong secondary text",                      darkMode: "Heading text" },
      { stop: 800, oklch: "oklch(0.26 0.010 60)", role: "body text",         lightMode: "Body copy, high-readability text",           darkMode: "Primary text" },
      { stop: 900, oklch: "oklch(0.18 0.008 60)", role: "heading text",      lightMode: "Headings, high contrast",                    darkMode: "Highest emphasis text" },
      { stop: 950, oklch: "oklch(0.12 0.005 60)", role: "near-black",        lightMode: "Maximum contrast, decorative dark elements",  darkMode: "Not used" },
    ],
  },
  {
    name: "pop",
    description:
      "Accent/pop color ramp (orange-amber, H=50). Used sparingly for callouts, highlights, and energy accents.",
    stops: [
      { stop: 50,  oklch: "oklch(0.97 0.025 50)", role: "wash",              lightMode: "Warm highlight backgrounds, callout tints" },
      { stop: 100, oklch: "oklch(0.94 0.045 50)", role: "subtle bg",         lightMode: "Callout backgrounds, warning backgrounds" },
      { stop: 200, oklch: "oklch(0.88 0.075 50)", role: "hover bg",          lightMode: "Pressed states for pop-colored elements" },
      { stop: 300, oklch: "oklch(0.80 0.110 50)", role: "active state",      lightMode: "Active indicators, selected states" },
      { stop: 400, oklch: "oklch(0.72 0.145 50)", role: "dark mode accent",  lightMode: "Strong icon fill",                          darkMode: "Accent CTAs, highlights in dark mode" },
      { stop: 500, oklch: "oklch(0.65 0.165 50)", role: "default pop",       lightMode: "Accent buttons, callout borders, highlights" },
      { stop: 600, oklch: "oklch(0.57 0.155 50)", role: "hover",             lightMode: "Hover state for pop-500 elements" },
      { stop: 700, oklch: "oklch(0.48 0.140 50)", role: "dark text",         lightMode: "Pop-colored text on light bg" },
      { stop: 800, oklch: "oklch(0.38 0.110 50)", role: "borders",           lightMode: "Strong accent borders" },
      { stop: 900, oklch: "oklch(0.28 0.070 50)", role: "text",              lightMode: "Pop-tinted text, warm headings" },
      { stop: 950, oklch: "oklch(0.18 0.040 50)", role: "near-black",        lightMode: "Maximum emphasis with pop warmth" },
    ],
  },
];

// ---------------------------------------------------------------------------
// BUILD PROCEDURES
// ---------------------------------------------------------------------------

export const TOKEN_PROCEDURES: TokenProcedure[] = [
  {
    step: 1,
    title: "Define color ramp primitives in @theme",
    description: "Create 11-stop OKLCH ramps for brand, neutral, and pop colors. These are static compile-time values.",
    code: snippet("procedures/step-1-colors.txt"),
    rules: [
      "Use @theme (not :root) for primitive ramps — they become Tailwind static utilities",
      "Hue angle (H) must be consistent across all stops in a ramp",
      "Chroma (C) peaks around 400-600, decreases toward 50 and 950",
      "Lightness (L) must be monotonically decreasing from 50 to 950",
    ],
    gotchas: [
      "@theme values are static — they cannot reference CSS custom properties or be overridden at runtime by JavaScript.",
      "If you change the H value after building components, all color utilities change across the app. Lock the hue angle early.",
    ],
  },
  {
    step: 2,
    title: "Map semantic tokens in :root and .dark",
    description: "Create role-based semantic tokens that reference primitives. These are the tokens your components actually use.",
    code: snippet("procedures/step-2-spacing.txt"),
    rules: [
      "Components must only reference semantic tokens, never primitive ramp values directly",
      "Dark mode requires bg-color elevation (lighter bg per level) since shadows are invisible",
      "Status color L should be ~0.55 for 4.5:1 contrast with white foreground",
      "Dark mode primary shifts from brand-500 (light) to brand-400 (dark) for perceptual brightness parity",
    ],
    gotchas: [
      "Status colors at L=0.63 (typical green/red) fail 4.5:1 AA with white. Always run contrast check after defining status colors.",
      "Do not use hex values for semantic tokens — use oklch primitives so the color stays in the defined color space.",
    ],
  },
  {
    step: 3,
    title: "Bridge to Tailwind v4 utilities with @theme inline",
    description: "Use @theme inline to expose runtime-swappable CSS custom properties as Tailwind utility classes.",
    code: snippet("procedures/step-3-typography.txt"),
    rules: [
      "@theme inline is read at runtime — it reflects CSS custom property values dynamically",
      "Plain @theme is static — values are baked in at build time",
      "Use @theme inline ONLY for semantic tokens; use plain @theme for primitive ramps",
      "Name mapping: --color-X in @theme inline → bg-X, text-X, border-X Tailwind classes",
    ],
    gotchas: [
      "If you put runtime-swappable vars in plain @theme (not inline), dark mode will NOT work — the values won't update when .dark class is toggled.",
      "@theme inline does not accept hardcoded values — it should only map CSS var references.",
      "@theme generates Tailwind utility classes but does NOT emit CSS custom properties on :root. If :root uses var(--color-brand-400) and --color-brand-400 is only defined in @theme, the var() resolves to undefined at runtime — making all text and backgrounds white. Correct architecture: raw OKLCH values on :root and .dark (runtime CSS vars), @theme inline bridges them to utilities, @theme separately generates primitive ramp utilities.",
    ],
  },
  {
    step: 4,
    title: "Define spacing system",
    description: "Set the 4px base multiplier and create named semantic spacing tokens.",
    code: snippet("procedures/step-4-component-sizing.txt"),
    rules: [
      "--spacing is the global multiplier — changing it scales ALL numeric spacing utilities",
      "Named tokens auto-generate Tailwind utilities: p-card, py-section-y, gap-grid-cards",
      "Always follow 4px grid: 0.25rem, 0.5rem, 0.75rem, 1rem, 1.25rem, 1.5rem, 1.75rem...",
    ],
    gotchas: [
      "--spacing is NOT an individual token for a specific spacing value. It is the base MULTIPLIER that affects p-1, p-2, p-4, etc. Overriding it changes every numeric spacing utility in the project.",
    ],
  },
  {
    step: 5,
    title: "Set up typography scale",
    description: "Define fluid heading sizes with clamp(), fixed body sizes, and line-height/tracking tokens.",
    code: snippet("procedures/step-5-remaining.txt"),
    rules: [
      "Body text (16px) is NEVER fluid — use fixed rem values",
      "Headings MUST have tight line-height (1.05–1.2), not body line-height (1.6+)",
      "Negative tracking on body text is a readability error",
    ],
    gotchas: [
      "Applying clamp() to body text causes font-size to change on window resize, causing reflow and jarring user experience.",
    ],
  },
  {
    step: 6,
    title: "Define shadows and elevation",
    description: "Build the 5-level elevation shadow system using warm oklch-tinted shadows.",
    code: snippet("procedures/step-6-accessibility.txt"),
    rules: ["Use oklch-tinted shadows, never rgba(0,0,0)", "Dark mode disables all shadows, uses bg-color elevation instead"],
    gotchas: ["rgba(0,0,0) shadows look cold on warm backgrounds. The warm hue tint (H=60) makes shadows feel natural."],
  },
  {
    step: 7,
    title: "Define motion and z-index tokens",
    description: "Add duration, easing, and z-index scale with prefers-reduced-motion.",
    code: snippet("procedures/step-7-validation.txt"),
    rules: ["prefers-reduced-motion MUST be in @layer base with !important", "Never use arbitrary z-index values"],
    gotchas: ["Forgetting prefers-reduced-motion is a WCAG 2.3.3 violation."],
  },
  {
    step: 8,
    title: "Run contrast audit and verify token usage",
    description: "After building the full token system, run a contrast audit on all color token pairs.",
    code: snippet("procedures/step-8-deliverables.txt"),
    rules: [
      "Run contrast audit AFTER finalizing the palette — before building components",
      "Status colors often need L adjusted to ~0.55 for AA compliance with white foreground",
      "Grep for stale hue-name references after renaming ramps",
    ],
    gotchas: [
      "WCAG contrast is calculated on final rendered colors. If CSS vars are not resolving correctly in dark mode, contrast tools won't catch it — test with a browser extension on the live page.",
    ],
  },
];

// ---------------------------------------------------------------------------
// SEARCH HELPER
// ---------------------------------------------------------------------------

export function searchTokens(query: string): { category?: TokenCategory; ramp?: ColorRamp; procedure?: TokenProcedure }[] {
  const q = query.toLowerCase();
  const results: { category?: TokenCategory; ramp?: ColorRamp; procedure?: TokenProcedure }[] = [];

  for (const cat of TOKEN_CATEGORIES) {
    if (
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.rules.some((r) => r.toLowerCase().includes(q)) ||
      cat.gotchas.some((g) => g.toLowerCase().includes(q)) ||
      cat.cssExample.toLowerCase().includes(q)
    ) {
      results.push({ category: cat });
    }
  }

  for (const ramp of COLOR_RAMPS) {
    if (
      ramp.name.toLowerCase().includes(q) ||
      ramp.description.toLowerCase().includes(q) ||
      ramp.stops.some((s) => s.role.toLowerCase().includes(q) || s.lightMode.toLowerCase().includes(q))
    ) {
      results.push({ ramp });
    }
  }

  for (const proc of TOKEN_PROCEDURES) {
    if (
      proc.title.toLowerCase().includes(q) ||
      proc.description.toLowerCase().includes(q) ||
      proc.code.toLowerCase().includes(q) ||
      proc.rules.some((r) => r.toLowerCase().includes(q)) ||
      proc.gotchas.some((g) => g.toLowerCase().includes(q))
    ) {
      results.push({ procedure: proc });
    }
  }

  return results;
}

export function getCategoryByName(name: string): TokenCategory | undefined {
  return TOKEN_CATEGORIES.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

export function getRampByName(name: string): ColorRamp | undefined {
  return COLOR_RAMPS.find((r) => r.name.toLowerCase() === name.toLowerCase());
}

export function getProcedureByStep(step: number): TokenProcedure | undefined {
  return TOKEN_PROCEDURES.find((p) => p.step === step);
}

export function getAllGotchas(): { source: string; gotcha: string }[] {
  const all: { source: string; gotcha: string }[] = [];
  for (const cat of TOKEN_CATEGORIES) {
    for (const gotcha of cat.gotchas) {
      all.push({ source: cat.name, gotcha });
    }
  }
  for (const proc of TOKEN_PROCEDURES) {
    for (const gotcha of proc.gotchas) {
      all.push({ source: `Step ${proc.step}: ${proc.title}`, gotcha });
    }
  }
  return all;
}
