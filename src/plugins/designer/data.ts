import { snippet } from "./loader.js";

// ---------------------------------------------------------------------------
// PERSONALITY CLUSTERS (KB 01 — 58 real company design systems)
// ---------------------------------------------------------------------------

export const PERSONALITY_CLUSTERS = [
  "premium-precision",
  "technical-developer",
  "warm-editorial",
  "bold-energetic",
  "cinematic-dark",
  "enterprise-trust",
] as const;
export type PersonalityCluster = (typeof PERSONALITY_CLUSTERS)[number];

export interface Exemplar {
  name: string;
  signature: string;
}

export interface VisualVocabulary {
  colors: string;
  typography: string;
  radius: string;
  shadows: string;
  motion: string;
  density: "compact" | "normal" | "comfortable";
}

export interface PersonalityProfile {
  cluster: PersonalityCluster;
  description: string;
  exemplars: Exemplar[];
  vocabulary: VisualVocabulary;
  defaultMode: "light" | "dark";
  cssExample: string;
}

export const PERSONALITIES: PersonalityProfile[] = [
  {
    cluster: "premium-precision",
    description:
      "Ultra-minimal, zero decoration, surgical whitespace. Every pixel is justified. The product disappears behind its content.",
    exemplars: [
      { name: "Linear", signature: "Tight type (-0.03em), purple accent, no gradients" },
      { name: "Vercel", signature: "Black + white only, Geist font, mathematical spacing" },
      { name: "Apple", signature: "Massive whitespace, cinematic imagery, SF Pro" },
      { name: "Stripe", signature: "Weight-300 elegance, purple gradient, rich docs" },
    ],
    vocabulary: {
      colors: "Monochromatic or single accent, zero chromatic noise",
      typography: "Tight tracking (-0.02 to -0.03em) on headings, weight 300-600 only",
      radius: "0-8px, sharp and precise",
      shadows: "None or ultra-subtle single layer",
      motion: "Subtle hover 200-250ms, no bounce",
      density: "normal",
    },
    defaultMode: "light",
    cssExample: snippet("personalities/premium-precision.txt"),
  },
  {
    cluster: "technical-developer",
    description:
      "Dark-first, code-native, keyboard-driven. Monospace accents, terminal aesthetics, information density over decoration.",
    exemplars: [
      { name: "Supabase", signature: "Dark emerald, code-first, documentation density" },
      { name: "Warp", signature: "Dark IDE-like, block-based command UI" },
      { name: "Cursor", signature: "Sleek dark, gradient accents, keyboard-first" },
      { name: "Raycast", signature: "Command palette native, bento grid, fast" },
    ],
    vocabulary: {
      colors: "Dark backgrounds, green/cyan/emerald accents, muted surfaces",
      typography: "Monospace for values/code, sans-serif for UI, tight tracking",
      radius: "4-8px, functional",
      shadows: "Minimal, glow effects on accents",
      motion: "Fast 100-200ms, snappy, no decoration",
      density: "compact",
    },
    defaultMode: "dark",
    cssExample: snippet("personalities/technical-developer.txt"),
  },
  {
    cluster: "warm-editorial",
    description:
      "Warm minimalism, editorial sensibility. Photography-driven, humanist typography, cream/warm backgrounds that feel like a premium notebook.",
    exemplars: [
      { name: "Notion", signature: "Serif headings, soft surfaces, cream backgrounds" },
      { name: "Airbnb", signature: "Warm coral accent, photography-driven, rounded-xl" },
      { name: "Zapier", signature: "Warm orange, friendly illustrations, rounded" },
      { name: "Medium", signature: "Serif body, reading-first, generous line height" },
    ],
    vocabulary: {
      colors: "Warm-tinted neutrals (not cold grey), 2-5deg hue shift in backgrounds",
      typography: "Serif or humanist sans, generous line height (1.6-1.75), large body (18px)",
      radius: "12-20px, friendly and approachable",
      shadows: "Warm-tinted, soft multi-layer",
      motion: "Smooth 200-300ms, no bounce, gentle easing",
      density: "comfortable",
    },
    defaultMode: "light",
    cssExample: snippet("personalities/warm-editorial.txt"),
  },
  {
    cluster: "bold-energetic",
    description:
      "Vivid color, large type, animated elements. Playful yet professional. The design demands attention and communicates confidence.",
    exemplars: [
      { name: "Figma", signature: "Multi-color, vibrant, playful yet professional" },
      { name: "Framer", signature: "Bold black + blue, motion-first, design-forward" },
      { name: "PostHog", signature: "Playful dark UI, hedgehog branding, developer-friendly" },
      { name: "Pitch", signature: "Bold gradients, large type, presentation-native" },
    ],
    vocabulary: {
      colors: "4-6 vivid colors, complementary/triadic, high chroma (C 0.15+)",
      typography: "Display weight (700-900), 32px+ headings, tight tracking",
      radius: "12-16px, confident",
      shadows: "Medium depth, colored shadows on brand elements",
      motion: "Rich 200-400ms, scroll reveals, spring animations",
      density: "normal",
    },
    defaultMode: "light",
    cssExample: snippet("personalities/bold-energetic.txt"),
  },
  {
    cluster: "cinematic-dark",
    description:
      "Stark dark premium. Full-viewport media, futuristic aesthetic. Content is the spectacle — the UI is invisible chrome around immersive experiences.",
    exemplars: [
      { name: "ElevenLabs", signature: "Dark cinematic, audio-waveform aesthetics" },
      { name: "RunwayML", signature: "Dark + media-rich, full-viewport" },
      { name: "SpaceX", signature: "Stark black + white, full-bleed imagery" },
      { name: "Nothing", signature: "Dot-matrix aesthetic, pure black, futuristic" },
    ],
    vocabulary: {
      colors: "Pure/near black bg, single accent, high-contrast text, neon highlights",
      typography: "Light weight (300-400) large display, high contrast against dark",
      radius: "0-6px, architectural",
      shadows: "Glow effects, no traditional box-shadows",
      motion: "Slow cinematic 400-600ms, scroll-triggered, parallax",
      density: "comfortable",
    },
    defaultMode: "dark",
    cssExample: snippet("personalities/cinematic-dark.txt"),
  },
  {
    cluster: "enterprise-trust",
    description:
      "Professional, structured, conservative. Blue/navy palettes, formal typography, clear hierarchy. The design communicates institutional reliability.",
    exemplars: [
      { name: "IBM", signature: "Carbon system, structured blue, information density" },
      { name: "HashiCorp", signature: "Enterprise-clean, black + white, structured" },
      { name: "Coinbase", signature: "Clean blue, trust-focused, institutional" },
      { name: "Salesforce", signature: "Lightning system, blue palette, data-dense" },
    ],
    vocabulary: {
      colors: "Professional blue/navy, conservative palette, no playful colors",
      typography: "Formal sans-serif, moderate weight contrast, no decorative fonts",
      radius: "4-8px, conservative",
      shadows: "Structured, consistent depth levels",
      motion: "Minimal 150-200ms, professional, no personality",
      density: "normal",
    },
    defaultMode: "light",
    cssExample: snippet("personalities/enterprise-trust.txt"),
  },
];

// ---------------------------------------------------------------------------
// DESIGN STYLES (KB 07 — 67 styles distilled to 7 primary)
// ---------------------------------------------------------------------------

export const STYLE_NAMES = [
  "minimalism",
  "glassmorphism",
  "soft-ui",
  "dark-oled",
  "vibrant-block",
  "claymorphism",
  "aurora-ui",
] as const;
export type StyleName = (typeof STYLE_NAMES)[number];

export interface DesignStyle {
  name: StyleName;
  description: string;
  useWhen: string[];
  neverUse: string[];
  colors: string;
  radius: string;
  shadows: string;
  motion: string;
  effects: string;
  antiPatterns: string[];
  performance: "excellent" | "good" | "moderate" | "poor";
  cssExample: string;
}

export const STYLES: DesignStyle[] = [
  {
    name: "minimalism",
    description: "Maximum reduction. Grid-based, typography-driven, zero decoration. Swiss Style heritage.",
    useWhen: ["Enterprise apps", "Dashboards", "Documentation", "Professional tools"],
    neverUse: ["Creative portfolios", "Entertainment", "Playful brands"],
    colors: "Monochromatic, black/white, single accent",
    radius: "0-6px sharp",
    shadows: "None or ultra-subtle",
    motion: "Subtle hover 200-250ms only",
    effects: "None",
    antiPatterns: ["Mistaking barren for minimal", "No contrast/hierarchy", "Empty without purpose"],
    performance: "excellent",
    cssExample: snippet("styles/minimalism.txt"),
  },
  {
    name: "glassmorphism",
    description: "Translucent surfaces with backdrop blur. Requires vibrant background to work — flat backgrounds kill it.",
    useWhen: ["Modern SaaS", "Financial dashboards", "Modal overlays", "Hero sections"],
    neverUse: ["Low-contrast backgrounds", "Accessibility-critical apps", "Text-heavy content"],
    colors: "Translucent white rgba(255,255,255,0.15) on vibrant bg",
    radius: "12-20px",
    shadows: "Subtle border 1px white/20%",
    motion: "Smooth 200-300ms, blur transitions",
    effects: "backdrop-filter: blur(15px)",
    antiPatterns: ["Text on blur without 4.5:1 contrast", "Flat backgrounds (kills the effect)", "Stacking glass layers"],
    performance: "good",
    cssExample: snippet("styles/glassmorphism.txt"),
  },
  {
    name: "soft-ui",
    description: "Modern neumorphism with improved contrast. Safe premium default for most apps.",
    useWhen: ["Modern enterprise", "SaaS", "Health/wellness", "Professional tools"],
    neverUse: ["Data-dense UIs", "Gaming", "Children's apps"],
    colors: "Improved contrast pastels, WCAG AA+",
    radius: "8-12px",
    shadows: "Soft multi-layer (0 2px 4px), clearer than classic neumorphism",
    motion: "200-300ms smooth",
    effects: "Subtle inner shadows for depth",
    antiPatterns: ["Insufficient contrast (classic neumorphism trap)", "Too many embossed elements"],
    performance: "good",
    cssExample: snippet("styles/soft-ui.txt"),
  },
  {
    name: "dark-oled",
    description: "True dark for dev tools and media. Pure/near-black backgrounds with vibrant accent colors.",
    useWhen: ["Coding platforms", "Developer tools", "Night-mode apps", "Entertainment", "Media consumption"],
    neverUse: ["Children's apps", "Healthcare", "Print-heavy content"],
    colors: "#000 or #121212 bg, neon/vibrant accents (green, blue, gold)",
    radius: "4-8px functional",
    shadows: "None (invisible on dark) — use bg-color elevation instead",
    motion: "Minimal glow effects, fast 150ms",
    effects: "Glow on accent elements, subtle gradients",
    antiPatterns: ["Cold #1a1a2e instead of warm dark", "Insufficient contrast", "Box shadows on dark bg"],
    performance: "excellent",
    cssExample: snippet("styles/dark-oled.txt"),
  },
  {
    name: "vibrant-block",
    description: "Bold, color-heavy, block-based sections. Neon/vivid palette. Youth-focused energy.",
    useWhen: ["Startups", "Creative agencies", "Gaming", "Social media", "Youth brands"],
    neverUse: ["Financial services", "Healthcare", "Formal business", "Government"],
    colors: "4-6 neon/vibrant from complementary/triadic schemes",
    radius: "12-20px bold",
    shadows: "Colored shadows matching brand",
    motion: "200-300ms, animated patterns, scroll reveals",
    effects: "Bold borders, color blocks, geometric patterns",
    antiPatterns: ["More than 6 colors", "Missing typography hierarchy", "No visual rest areas"],
    performance: "good",
    cssExample: snippet("styles/vibrant-block.txt"),
  },
  {
    name: "claymorphism",
    description: "Soft, rounded, playful. Pastel colors with thick borders and inner+outer shadows. Approachable and friendly.",
    useWhen: ["Educational apps", "Children's apps", "Friendly SaaS onboarding", "Playful brands"],
    neverUse: ["Formal corporate", "Medical/legal", "Financial services", "Government"],
    colors: "Pastels (peach, baby blue, mint, lilac)",
    radius: "16-24px, thick borders 3-4px",
    shadows: "Inner + outer double shadow",
    motion: "Soft bounce cubic-bezier(0.34, 1.56, 0.64, 1), 200ms",
    effects: "3D feel from layered shadows",
    antiPatterns: ["Applied to professional contexts", "Thin borders (kills the clay feel)", "Flat colors without depth"],
    performance: "good",
    cssExample: snippet("styles/claymorphism.txt"),
  },
  {
    name: "aurora-ui",
    description: "Mesh gradients with animated color transitions. Complementary color pairs create immersive premium feel.",
    useWhen: ["Modern SaaS heroes", "Creative agencies", "Music platforms", "Premium products"],
    neverUse: ["Data-dense UIs", "Government", "Accessibility-first apps"],
    colors: "Complementary pairs (blue-orange, purple-yellow) as mesh gradients",
    radius: "12-20px",
    shadows: "Soft, gradient-tinted",
    motion: "8-12s gradient animation loop, background-size 200%",
    effects: "Mesh gradient with slow animation",
    antiPatterns: ["Text contrast on gradient sections", "Animation too fast (distracting)", "Using for entire page (hero only)"],
    performance: "moderate",
    cssExample: snippet("styles/aurora-ui.txt"),
  },
];

// ---------------------------------------------------------------------------
// INDUSTRY RULES (KB 07 — 161 industry rules distilled)
// ---------------------------------------------------------------------------

export const INDUSTRY_CATEGORIES = [
  "saas", "analytics", "healthcare", "fintech", "creative-agency",
  "portfolio", "gaming", "ecommerce-luxury", "mental-health", "government",
  "developer-tool", "ai-chatbot", "b2b-service", "education", "wellness",
] as const;
export type IndustryCategory = (typeof INDUSTRY_CATEGORIES)[number];

export interface IndustryRule {
  industry: IndustryCategory;
  primaryStyle: string;
  secondaryStyle: string;
  mustHave: string[];
  neverUse: string[];
  colorMood: string;
  emotionalTarget: string;
}

export const INDUSTRY_RULES: IndustryRule[] = [
  {
    industry: "saas",
    primaryStyle: "glassmorphism + flat",
    secondaryStyle: "soft-ui",
    mustHave: ["Subtle hover transitions", "Smooth state changes", "Clear data hierarchy", "Empty states"],
    neverUse: ["Excessive animation", "More than 2 accent colors", "AI purple as default"],
    colorMood: "Trust blue + single accent contrast",
    emotionalTarget: "trustworthy",
  },
  {
    industry: "analytics",
    primaryStyle: "minimalism",
    secondaryStyle: "data-dense",
    mustHave: ["Data export", "Filtering", "Sortable tables", "Keyboard navigation"],
    neverUse: ["Ornate design", "Large images", "Playful elements", "Heavy animations"],
    colorMood: "Neutral + data visualization palette (Okabe-Ito or viridis)",
    emotionalTarget: "technical",
  },
  {
    industry: "healthcare",
    primaryStyle: "soft-ui",
    secondaryStyle: "accessible/ethical",
    mustHave: ["WCAG AAA", "Calm colors", "Large touch targets", "Clear error recovery"],
    neverUse: ["Bright neon", "Motion-heavy design", "Small text", "Playful animations"],
    colorMood: "Calm blue + health green, low saturation",
    emotionalTarget: "calm",
  },
  {
    industry: "fintech",
    primaryStyle: "minimalism",
    secondaryStyle: "enterprise-trust",
    mustHave: ["Security-first signals", "Trust badges", "Clear transaction states", "Number formatting"],
    neverUse: ["Playful design", "AI purple/pink gradients", "Unclear fees", "Hidden information"],
    colorMood: "Navy + trust blue + gold accent",
    emotionalTarget: "trustworthy",
  },
  {
    industry: "creative-agency",
    primaryStyle: "vibrant-block",
    secondaryStyle: "motion-driven",
    mustHave: ["Case studies", "Full-bleed imagery", "Scroll animations", "Portfolio grid"],
    neverUse: ["Corporate minimalism", "Hidden portfolio", "Stock photography"],
    colorMood: "Bold, client-specific, high chroma",
    emotionalTarget: "bold",
  },
  {
    industry: "portfolio",
    primaryStyle: "minimalism",
    secondaryStyle: "motion-driven",
    mustHave: ["Scroll reveals", "Project detail pages", "Contact CTA", "Responsive images"],
    neverUse: ["Generic templates", "Cluttered layouts", "Auto-playing audio"],
    colorMood: "Monochromatic + single accent, let work speak",
    emotionalTarget: "premium",
  },
  {
    industry: "gaming",
    primaryStyle: "dark-oled",
    secondaryStyle: "vibrant-block",
    mustHave: ["WebGL/3D elements", "Glitch effects", "Immersive media", "Achievement UI"],
    neverUse: ["Minimalist static design", "Corporate aesthetic", "Light mode default"],
    colorMood: "Neon on dark, high energy, saturated",
    emotionalTarget: "energetic",
  },
  {
    industry: "ecommerce-luxury",
    primaryStyle: "minimalism",
    secondaryStyle: "cinematic-dark",
    mustHave: ["Trust signals", "Product photography", "Size guides", "Review system"],
    neverUse: ["Block-based layout", "Playful colors", "Cheap-feeling badges"],
    colorMood: "Black + gold, minimal palette, premium neutrals",
    emotionalTarget: "premium",
  },
  {
    industry: "mental-health",
    primaryStyle: "soft-ui",
    secondaryStyle: "accessible/ethical",
    mustHave: ["Calm colors", "Privacy-first UX", "Breathing room", "Crisis resources"],
    neverUse: ["Bright neon", "Motion overload", "Gamification", "Social pressure"],
    colorMood: "Muted pastels, warm neutrals, low chroma",
    emotionalTarget: "calm",
  },
  {
    industry: "government",
    primaryStyle: "minimalism",
    secondaryStyle: "accessible/ethical",
    mustHave: ["WCAG AAA", "Skip links", "Plain language (grade 4-6)", "Breadcrumbs"],
    neverUse: ["Ornate design", "Low contrast", "Motion effects", "Decorative images"],
    colorMood: "High contrast, institutional blue, minimal palette",
    emotionalTarget: "trustworthy",
  },
  {
    industry: "developer-tool",
    primaryStyle: "dark-oled",
    secondaryStyle: "minimalism",
    mustHave: ["Code examples", "Keyboard shortcuts", "Command palette", "API reference"],
    neverUse: ["Heavy chrome", "Poor keyboard support", "Slow performance", "Excessive tooltips"],
    colorMood: "Dark + accent (emerald/cyan/blue), muted surfaces",
    emotionalTarget: "technical",
  },
  {
    industry: "ai-chatbot",
    primaryStyle: "minimalism",
    secondaryStyle: "soft-ui",
    mustHave: ["Streaming text", "Typing indicators", "Conversation history", "Tool indicators"],
    neverUse: ["Heavy chrome", "Distracting animations", "Cluttered sidebars"],
    colorMood: "Neutral + one distinct accent (NOT AI purple unless intentional)",
    emotionalTarget: "technical",
  },
  {
    industry: "b2b-service",
    primaryStyle: "enterprise-trust",
    secondaryStyle: "minimalism",
    mustHave: ["Case studies", "ROI messaging", "Trust signals", "Demo CTA"],
    neverUse: ["AI purple gradients", "Playful aesthetic", "Hidden credentials"],
    colorMood: "Professional blue/navy, conservative",
    emotionalTarget: "trustworthy",
  },
  {
    industry: "education",
    primaryStyle: "soft-ui",
    secondaryStyle: "claymorphism",
    mustHave: ["Progress indicators", "Achievement feedback", "Clear navigation", "Accessibility"],
    neverUse: ["Complex layouts", "Dense data tables", "Dark mode default"],
    colorMood: "Friendly pastels, warm accents, high readability",
    emotionalTarget: "playful",
  },
  {
    industry: "wellness",
    primaryStyle: "soft-ui",
    secondaryStyle: "warm-editorial",
    mustHave: ["Calm aesthetics", "Breathing space", "Warm photography", "Gentle CTAs"],
    neverUse: ["Dark mode default", "Aggressive animations", "Neon colors", "Dense layouts"],
    colorMood: "Warm earth tones, sage green, soft coral",
    emotionalTarget: "calm",
  },
];

// ---------------------------------------------------------------------------
// COGNITIVE LAWS (KB 11 — empirically documented facts)
// ---------------------------------------------------------------------------

export const COGNITIVE_LAW_NAMES = [
  "fitts", "hick", "miller", "gestalt", "von-restorff",
  "serial-position", "f-pattern", "z-pattern", "jakobs",
  "doherty", "peak-end",
] as const;
export type CognitiveLawName = (typeof COGNITIVE_LAW_NAMES)[number];

export interface CognitiveLaw {
  name: CognitiveLawName;
  displayName: string;
  formula: string;
  keyInsight: string;
  uiApplications: string[];
  violations: string[];
  source: string;
}

export const COGNITIVE_LAWS: CognitiveLaw[] = [
  {
    name: "fitts",
    displayName: "Fitts' Law",
    formula: "T = a + b * log2(2D/W)",
    keyInsight: "Halving distance to target is worth more than doubling target size. Touch targets must be >= 44px.",
    uiApplications: [
      "Touch targets physically >= 44pt (iOS) / 48dp (Android) / 44px (WCAG)",
      "Screen edges are infinite targets for mouse (macOS menu bar exploits this)",
      "Place submit CTA at bottom of form — pointer is already near last field",
      "Increase padding without visible border for invisible hit-area expansion",
      "Destructive actions must have >= 8px gap from safe actions",
    ],
    violations: [
      "Icon-only buttons (visual footprint != tap target)",
      "Delete adjacent to Save with < 8px gap",
      "Form submit at page top on mobile",
      "Tool palettes with zero gap between minimum-size items",
    ],
    source: "Fitts 1954, replicated by MacKenzie 1992",
  },
  {
    name: "hick",
    displayName: "Hick's Law",
    formula: "RT = a + b * log2(n + 1)",
    keyInsight: "Going from 2 to 4 choices costs far more than 20 to 22. First added choices are most expensive.",
    uiApplications: [
      "Minimize choices at irreversible decision points (checkout, delete)",
      "Wizard pattern: decompose into single-decision screens",
      "Surface a recommended option to short-circuit decisions",
      "Progressive disclosure: expose features incrementally",
      "Google homepage is canonical n=1: one input, one action",
    ],
    violations: [
      "SaaS onboarding showing all features on first login",
      "Pricing tiers with no highlighted recommendation",
      "Dropdowns with 50+ unsorted options",
      "Settings pages with every toggle visible at once",
    ],
    source: "Hick 1952, Hyman 1953",
  },
  {
    name: "miller",
    displayName: "Miller's Law",
    formula: "Working memory = 7 +/- 2 chunks (Cowan 2001: 4 +/- 1 without rehearsal)",
    keyInsight: "The unit is a CHUNK, not an item. (919) 555-2743 = 3 chunks vs 9195552743 = 10 items.",
    uiApplications: [
      "Auto-chunk phone/card numbers as user types",
      "Group form fields into visual sections of <= 5 fields",
      "Navigation: <= 7 primary items for unstructured lists",
      "Onboarding: max 5-7 sequential steps without checkpoint",
      "Dashboard: group related metrics together",
    ],
    violations: [
      "Flat navigation with 12+ items, no visual grouping",
      "IBAN/reference codes displayed as unbroken strings",
      "Long settings page with 20+ ungrouped controls",
    ],
    source: "Miller 1956, Cowan 2001",
  },
  {
    name: "gestalt",
    displayName: "Gestalt Principles",
    formula: "Proximity > Similarity > Closure > Continuity > Common Fate",
    keyInsight: "Proximity overrides color, size, and shape. Items closer together are perceived as same group.",
    uiApplications: [
      "Form label-to-input gap (4-8px) must be tighter than input-to-next-label (16-24px)",
      "Skeleton loaders pulse at identical timing (Common Fate) — offset reads as separate",
      "Partial card at viewport bottom = scroll hook (Closure)",
      "Vertical form alignment creates Continuity — zigzag layouts break it",
      "All links share consistent treatment (Similarity) — break = break comprehension",
    ],
    violations: [
      "Equal spacing between label, input, and next label (Proximity failure)",
      "Primary and secondary buttons at similar visual weight (Similarity failure)",
      "Delete button 4px from Save (dangerous Proximity)",
    ],
    source: "Wertheimer 1923, Koffka 1935",
  },
  {
    name: "von-restorff",
    displayName: "Von Restorff Effect (Isolation Effect)",
    formula: "Among similar items, the one that differs most is remembered first",
    keyInsight: "If three items are all highlighted, isolation cancels out. ONE primary CTA per view.",
    uiApplications: [
      "One primary CTA per view, differentiated from everything else",
      "Notification badges: the only red circle in monochromatic UI",
      "Pricing tables: recommended plan gets different bg/elevation/scale — only one",
      "Error states visually deviate from all other UI (color + icon + weight)",
    ],
    violations: [
      "Multiple CTAs styled as highlighted — they cancel each other",
      "6 elements animate on load — none is isolated",
      "Banner blindness: promo elements styled like features",
    ],
    source: "Von Restorff 1933",
  },
  {
    name: "serial-position",
    displayName: "Serial Position Effect",
    formula: "Items at start (primacy) and end (recency) are remembered most",
    keyInsight: "First and last positions in a sequence are premium real estate. Middle items are forgotten.",
    uiApplications: [
      "Navigation: most important items at first and last positions",
      "Pricing: recommended plan first or last, never second of three",
      "Onboarding: highest-value aha moment early, highest-friction step at end",
      "Form fields: easy fields first (name, email), hard fields in middle (tax ID)",
    ],
    violations: [
      "Primary CTA buried in middle of button row",
      "Critical info (cancellation policy) mid-paragraph",
      "Onboarding leading with most complex feature",
    ],
    source: "Ebbinghaus 1913, Murdock 1962",
  },
  {
    name: "f-pattern",
    displayName: "F-Pattern (NNG Eye Tracking)",
    formula: "Horizontal sweep top -> shorter sweep lower -> vertical scan left side only",
    keyInsight: "Right side of text-heavy pages receives near-zero attention. Users read ~28% of words per page.",
    uiApplications: [
      "Front-load sentences: key word first in every line",
      "Nav links lead with distinguishing word: 'Billing settings' not 'Settings for billing'",
      "Add H2/H3 every 200-300 words to break into layer-cake pattern",
      "Left 80% of page gets 80% of attention (NNG)",
    ],
    violations: [
      "Important information on right side of text pages",
      "Long paragraphs without subheadings",
      "Generic headings ('Overview') instead of summaries",
    ],
    source: "NNG 2006, 232 users + replications, 1.5M fixations",
  },
  {
    name: "z-pattern",
    displayName: "Z-Pattern",
    formula: "Top-left -> top-right -> diagonal -> bottom-right (CTA terminal)",
    keyInsight: "For sparse visual pages (landing, marketing). The Z terminal point is the action point.",
    uiApplications: [
      "Logo top-left, trust signals top-right",
      "Supporting copy bottom-left, primary CTA bottom-right",
      "Works for hero sections with < 50 words",
      "Gutenberg diagram: primary optical area top-left, terminal area bottom-right",
    ],
    violations: [
      "CTA in bottom-left (weak fallow area)",
      "Logo in center (breaks Z start point)",
      "Too much text (triggers F-pattern instead)",
    ],
    source: "Gutenberg 1950s, validated by NNG eye tracking",
  },
  {
    name: "jakobs",
    displayName: "Jakob's Law",
    formula: "Users prefer your site to work the same as sites they already know",
    keyInsight: "Convention is free usability. Breaking it costs discoverability. 30 years of blue underlined links.",
    uiApplications: [
      "Primary nav: top bar (desktop) or bottom tab (mobile)",
      "Radio = single-select, Checkbox = multi-select, Toggle = binary",
      "Blue underlined text = link (removing underlines reduces clicks 10-15%)",
      "Shopping cart icon top-right, search icon in header",
      "When redesigning: preview + opt-in + revert (not overnight change)",
    ],
    violations: [
      "Right sidebar navigation on desktop",
      "Non-standard toggle behavior (toggle != checkbox)",
      "Cart icon in non-standard position",
      "Forced redesign without transition (Snapchat 2018: lost 3M+ users)",
    ],
    source: "Jakob Nielsen, NNG",
  },
  {
    name: "doherty",
    displayName: "Doherty Threshold",
    formula: "< 400ms response time to maintain flow state",
    keyInsight: "< 100ms feels instantaneous. 100-400ms feels immediate. > 400ms breaks flow. > 1s = abandonment.",
    uiApplications: [
      "Optimistic UI: update immediately, fire API in background, rollback on failure",
      "Skeleton screens outperform spinners for perceived speed",
      "Search autocomplete must appear within 300ms to feel predictive",
      "Keystroke-to-display must be < 50ms (debounce React re-renders)",
      "Intentional artificial delays on instant operations increase perceived quality",
    ],
    violations: [
      "Waiting for API before updating UI (add-to-cart, like, save)",
      "No loading indicator for operations > 300ms",
      "Search suggestions appearing after 500ms+",
    ],
    source: "IBM 1982, Doherty & Thadhani",
  },
  {
    name: "peak-end",
    displayName: "Peak-End Rule",
    formula: "Remembered experience = avg(peak intensity, final moment). Duration neglect.",
    keyInsight: "Users judge experiences by the most intense moment and the last moment, not the average.",
    uiApplications: [
      "Order confirmation = peak AND end — invest in it (Mailchimp 'High Five')",
      "Onboarding completion = peak: immediate evidence of value (Slack pre-populated channel)",
      "Error recovery = peak management: helpful errors build trust (Stripe specific messages)",
      "Cancellation flow: genuine 'We'll miss you' creates less negative end than dark patterns",
    ],
    violations: [
      "Generic order confirmation page",
      "Dark-pattern 5-step cancellation (creates negative peak AND end)",
      "No celebration on onboarding completion",
    ],
    source: "Kahneman 1993",
  },
];

// ---------------------------------------------------------------------------
// DESIGN SYSTEM REFERENCES (KB 13 — specific values from premium systems)
// ---------------------------------------------------------------------------

export const DESIGN_SYSTEM_NAMES = [
  "apple-hig", "material-design-3", "linear", "stripe",
  "ibm-carbon", "shadcn-radix", "vercel-geist",
] as const;
export type DesignSystemName = (typeof DESIGN_SYSTEM_NAMES)[number];

export interface DesignSystemReference {
  name: DesignSystemName;
  displayName: string;
  signature: string;
  keyInsights: string[];
  typography: string;
  color: string;
  spacing: string;
  reference: string;
}

export const DESIGN_SYSTEMS: DesignSystemReference[] = [
  {
    name: "apple-hig",
    displayName: "Apple Human Interface Guidelines",
    signature: "Clarity, Deference, Depth — content takes center stage via translucency and spring physics",
    keyInsights: [
      "44pt minimum touch targets — Apple rejects apps violating this",
      "SF Pro Display above 20pt, SF Pro Text below — letterforms literally change shape at threshold",
      "Letter-spacing inverts: tight at large sizes (-0.003em), positive at small",
      "Dynamic Type: 11pt (Caption 2) absolute minimum",
      "Spring animations communicate mass and physicality — they are signifiers",
    ],
    typography: "SF Pro: Display/Text split at 20pt. Weight range Regular-Semibold only. Type scale: Large Title 34pt, Title 1-3 (28/22/20pt), Headline 17pt semibold, Body 17pt, Caption 12/11pt.",
    color: "System colors adapt to light/dark and high contrast. No fixed hex values in components.",
    spacing: "8pt grid implied, 44pt minimum touch, comfortable density for consumer apps.",
    reference: snippet("systems/apple-hig.txt"),
  },
  {
    name: "material-design-3",
    displayName: "Material Design 3",
    signature: "HCT color space with tonal elevation — shadows replaced by primary-color overlays at increasing opacity",
    keyInsights: [
      "HCT (Hue, Chroma, Tone) replaces HSL — perceptually uniform like OKLCH",
      "Elevation = primary color overlay (5%/8%/11%/12%/14%) not drop shadows",
      "Three-layer tokens: reference -> system -> component",
      "Display/Text font variant split (same logic as Apple SF Pro)",
      "Tonal elevation works in both light and dark without shadows",
    ],
    typography: "Google Sans / Roboto. Scale: Display XL 88px -> Display L 57px -> Headline L 32px -> Title L 22px -> Body L 16px -> Label S 11px.",
    color: "HCT color space. 13 stops per hue (primary10 through primary99). System tokens map to semantic roles.",
    spacing: "8dp base grid. 16dp standard padding. 24dp comfortable padding.",
    reference: snippet("systems/material-design-3.txt"),
  },
  {
    name: "linear",
    displayName: "Linear",
    signature: "Opacity-based hierarchy + LCH color space — 3 variables (base, accent, contrast) replace 98-variable HSL",
    keyInsights: [
      "LCH color space (same perceptual uniformity as OKLCH/HCT)",
      "Opacity-based hierarchy: sidebar content dimmed via opacity, not different colors",
      "8px spacing scale: pure powers of 2 (8, 16, 32, 64px)",
      "No unnecessary dividers — borders reduced, structure from spacing alone",
      "Text deliberately darker in light mode, lighter in dark than typical systems",
    ],
    typography: "Inter with negative tracking. Icon-only tab pills. Precision aesthetic from tight typographic control.",
    color: "3 design variables: base color, accent color, contrast. Auto high-contrast modes from contrast variable.",
    spacing: "8px pure powers of 2. No 12px. 2024 refresh specifically fixed icon-to-label alignment.",
    reference: snippet("systems/linear.txt"),
  },
  {
    name: "stripe",
    displayName: "Stripe",
    signature: "Weight-300 elegance in Söhne + CIELAB color system where 5-step separation guarantees 4.5:1 contrast",
    keyInsights: [
      "Söhne typeface (not Inter, not Helvetica) — contemporary Akzidenz-Grotesk reworking",
      "Weight vocabulary: body 300, headers 500. No 400 or 700 anywhere.",
      "CIELAB color system: 5+ step separation = mathematical 4.5:1 contrast guarantee",
      "Complex multi-point gradient meshes as hero backgrounds (not 2-stop gradients)",
      "Docs use same editorial typography as marketing (rare coherence)",
    ],
    typography: "Söhne: body weight 300, heading weight 500. Söhne Mono for code. Zero use of 400 or 700.",
    color: "CIELAB-based. Mathematical contrast guarantee. None of pre-rebuild text colors passed WCAG.",
    spacing: "Generous whitespace. Documentation density matches marketing density.",
    reference: snippet("systems/stripe.txt"),
  },
  {
    name: "ibm-carbon",
    displayName: "IBM Carbon Design System",
    signature: "Accessibility-first enterprise system — every component ships WCAG 2.1 AA with 3:1 focus ring contrast",
    keyInsights: [
      "Spacing includes 12px (spacing-04) for tight component internals — pure doubling lacks this",
      "IBM Plex: squared terminals distinguish from Helvetica/Arial, reads as 'IBM'",
      "Every component ships WCAG 2.1 AA out of the box",
      "Focus indicators: 3:1 minimum contrast on the ring itself",
      "Open source: teams consuming Carbon inherit a11y, not bolt it on",
    ],
    typography: "IBM Plex Sans/Serif/Mono. Line heights: 1.28 headings, 1.5 body.",
    color: "Structured blue palette. Accessibility-first: every token pair checked.",
    spacing: "2/4/8/12/16/24/32/40/48px scale. 12px exists for fine-grained enterprise density.",
    reference: snippet("systems/ibm-carbon.txt"),
  },
  {
    name: "shadcn-radix",
    displayName: "shadcn/ui + Radix",
    signature: "OKLCH migration + opacity-based dark borders (10% white overlay adapts to any background automatically)",
    keyInsights: [
      "Radix separates behavior (WAI-ARIA) from appearance — you style, they handle a11y",
      "OKLCH migration 2024: all tokens in oklch(), only destructive has chroma",
      "Dark mode borders: oklch(1 0 0 / 10%) — 10% white overlay, not fixed gray",
      "Semantic naming: bg-background, text-foreground — brand change = CSS vars only",
      "Architecture: behavior (Radix) + style (you) = brand-agnostic by construction",
    ],
    typography: "System font stack or custom. No opinion on typeface — that's your brand decision.",
    color: "OKLCH. Light: background oklch(1 0 0), foreground oklch(0.145 0 0). Dark: background oklch(0.145 0 0).",
    spacing: "Tailwind defaults. No custom spacing opinion — inherits from your design tokens.",
    reference: snippet("systems/shadcn-radix.txt"),
  },
  {
    name: "vercel-geist",
    displayName: "Vercel / Geist",
    signature: "Aggressive negative tracking (-0.04em display) + zero chromatic bias + mathematical whitespace",
    keyInsights: [
      "Geist: high x-height, short descenders, angular terminals — reads as 'technical'",
      "Negative tracking by default: -0.02em body, -0.04em display (Inter ships at 0)",
      "Color: pure #000/#FFF, 11-step neutral gray, single accent #0070F3",
      "No gradients in UI (gradients in marketing only)",
      "Section padding 96-128px — aggressive whitespace as premium signal",
    ],
    typography: "Geist: 9 weights, 825 glyphs. -0.04em display, -0.01em body. Line height: 1.15 tight, 1.5 base.",
    color: "Pure black/white. Zero chromatic bias in neutrals. Single blue accent for interactive only.",
    spacing: "8px grid. 96-128px section padding. 1.15 tight headline line-height is the key aesthetic.",
    reference: snippet("systems/vercel-geist.txt"),
  },
];

export const CROSS_SYSTEM_CONVERGENCES: { principle: string; systems: string[]; detail: string }[] = [
  {
    principle: "Perceptual color spaces over HSL",
    systems: ["Stripe (CIELAB)", "Linear (LCH)", "Material 3 (HCT)", "shadcn (OKLCH)"],
    detail: "HSL lightness is not perceptually uniform. Yellow at HSL L50 looks lighter than blue at L50.",
  },
  {
    principle: "Semantic token layers over raw values",
    systems: ["Apple (Dynamic Type)", "M3 (ref -> system -> component)", "shadcn (bg/fg pairs)", "Carbon (spacing-01)"],
    detail: "None expose raw px to components. Abstraction enables system-wide changes.",
  },
  {
    principle: "Typography weight restraint",
    systems: ["Stripe (300/500)", "Linear (regular/medium)", "Vercel (geometric sans)"],
    detail: "None use weight 700 for UI. Premium feel comes from 300/500/600 range.",
  },
  {
    principle: "Negative letter-spacing on headings",
    systems: ["Apple (-0.003em)", "Vercel (-0.04em)", "Linear (negative)"],
    detail: "Zero or positive tracking on headings reads as 'default'. Negative reads as 'designed'.",
  },
  {
    principle: "Opacity-based dark mode surfaces",
    systems: ["shadcn (border: oklch(1 0 0 / 10%))", "Linear (opacity hierarchy)", "M3 (elevation tint)"],
    detail: "Fixed gray borders break under different backgrounds. Percentage-white overlays never do.",
  },
];

// ---------------------------------------------------------------------------
// VISUAL COMPOSITION (KB 14 — mathematical alignment + eye tracking evidence)
// ---------------------------------------------------------------------------

export const COMPOSITION_TOPICS = [
  "golden-ratio", "rule-of-thirds", "visual-hierarchy", "crap-principles",
  "whitespace", "fold-rules", "reading-patterns", "visual-weight",
  "grid-theory", "optical-alignment",
] as const;
export type CompositionTopic = (typeof COMPOSITION_TOPICS)[number];

export interface CompositionRule {
  topic: CompositionTopic;
  displayName: string;
  keyRule: string;
  detail: string;
  applications: string[];
  violations: string[];
}

export const COMPOSITION_RULES: CompositionRule[] = [
  {
    topic: "golden-ratio",
    displayName: "Golden Ratio (phi = 1.618)",
    keyRule: "Use phi as a starting ratio for type scales and layout divisions. A reasonable default, not a law.",
    detail: "16px * 1.618 = ~26px heading. 61.8% main : 38.2% sidebar on 1200px = 741:459px. But responsive layouts break phi-based fixed proportions. Real-world ratio on top blogs ≈ 2.5, not 1.618.",
    applications: ["Type scale starting point", "Initial sidebar ratio", "Line height from body (16px * 1.618 ≈ 26px)"],
    violations: ["Treating phi as mandatory rule", "Fixed phi ratios that break at mobile widths"],
  },
  {
    topic: "rule-of-thirds",
    displayName: "Rule of Thirds",
    keyRule: "Place visual interest at 3x3 grid intersections, not geometric center.",
    detail: "Hero: headline on left-vertical third, CTA at lower-left intersection, image on right third. Creates asymmetric tension. Aligns with F-pattern scanning.",
    applications: ["Hero layout: headline left, image right", "Product photo: subject on right third", "Portrait crop: eyes at upper-left intersection"],
    violations: ["Center-everything on marketing pages", "Applying to data-dense dashboards (use mathematical grid instead)"],
  },
  {
    topic: "visual-hierarchy",
    displayName: "Visual Hierarchy — 6 Levers",
    keyRule: "Rank every element 1-N by importance, then assign: Size > Contrast > Color > Typography > Spacing > Position.",
    detail: "The squint test: blur 5-10px — if primary action isn't first thing visible, hierarchy is broken. Max 3 size variations, 3 contrast variations. If everything is emphasized, nothing is.",
    applications: [
      "Size: bigger = more important, never equal size for different priorities",
      "Contrast: operates independently from color (works for colorblind)",
      "Color: warm saturated advances, cool muted recedes. Red reserved for destructive.",
      "Typography: weight is primary hierarchy signal (bold vs regular)",
      "Spacing: more surrounding space = more attention",
      "Position: top-left receives most attention (F-pattern). Optical center sits above mathematical.",
    ],
    violations: ["Same-same design: equal weight/size/spacing everywhere", "Timid contrast (slightly larger/bolder reads as mistake)"],
  },
  {
    topic: "crap-principles",
    displayName: "CRAP: Contrast, Repetition, Alignment, Proximity",
    keyRule: "If two elements are not the same, make them VERY different. Timid contrast reads as a mistake.",
    detail: "Contrast: size/weight/spacing/position, not just color. Repetition: consistency creates implicit rules. Alignment: left-align everything is simplest valid system. Proximity: equal spacing regardless of relationship = invisible structure.",
    applications: ["Contrast: 3 button treatments, not subtle variations", "Repetition: all links same treatment", "Alignment: no center-everything on text pages", "Proximity: label 4-8px above input, 24-40px between sections"],
    violations: ["Center-aligned multi-line paragraphs", "Equal spacing between all elements", "Multiple button styles without semantic reason"],
  },
  {
    topic: "whitespace",
    displayName: "Whitespace as Signal",
    keyRule: "Micro whitespace governs readability. Macro whitespace governs perceived value. Active whitespace is a spotlight.",
    detail: "Micro: tracking, leading, label-input gap. Macro: section gaps, page margins, hero breathing room. Luxury = generous macro whitespace (Apple, Rolex). Crowded = 'affordable'. Active whitespace around an element = attention.",
    applications: ["Luxury: generous section padding (96px+)", "Data-dense: tight micro (8px rows)", "Spotlight: more space around CTA than neighbors"],
    violations: ["Cramped margins signaling low value", "Uniform spacing with no hierarchy"],
  },
  {
    topic: "fold-rules",
    displayName: "The Fold (NNG 57,453 fixations)",
    keyRule: "Above-fold gets 102% more views. Never fill exact viewport height — bleed 40-80px of next section.",
    detail: "57% of viewing time above fold (down from 80% in 2010). The illusion of completeness: full-viewport hero with no overflow makes users think page is done. Scrolling is conditioned by first 100px.",
    applications: ["Value prop + CTA above fold on all viewports", "Bleed next section 40-80px into view", "First 100px must be relevant or users leave"],
    violations: ["Full-viewport video with no content peeking below", "Hard horizontal rule at fold position", "Large gap that reads as page-end"],
  },
  {
    topic: "reading-patterns",
    displayName: "Reading Patterns (NNG 1.5M fixations)",
    keyRule: "F-pattern for text, Z-pattern for sparse visuals, Layer-cake for structured content (most effective).",
    detail: "F-pattern: right side gets near-zero attention, users read 28% of words. Layer-cake: headings scanned, body read only when heading matches intent. Spotted: users scan for distinct elements (links, bold, numbers).",
    applications: ["Front-load sentences", "Headings = summaries not labels", "Format scannable info with distinct treatment", "80% of viewing time on left half"],
    violations: ["Important info on right side", "Generic headings ('Overview')", "Long paragraphs without formatting"],
  },
  {
    topic: "visual-weight",
    displayName: "Visual Weight and Balance",
    keyRule: "Warm/dark/large/isolated elements weigh more. Asymmetric balance is more interesting than symmetry.",
    detail: "Weight: warm > cool, dark > light, large > small, isolated > crowded, high > low on page. Direction: shapes with axes direct the eye, faces direct toward gaze target.",
    applications: ["Large light element balanced by small dark element", "Place copy where subject's gaze points", "Optical center sits above mathematical center"],
    violations: ["Perfect symmetry feeling static/boring", "Mathematical center feeling low (bottom-heavy perception)"],
  },
  {
    topic: "grid-theory",
    displayName: "Grid Systems",
    keyRule: "12-column grid divides evenly by 1/2/3/4/6/12. Baseline grid (8px) makes layouts feel tight.",
    detail: "Manuscript: single column for editorial. Column: 12-col, 24px gutters, 48-64px margins. Modular: columns + horizontal divisions for dashboards. Baseline: all vertical spacing on 8px rhythm.",
    applications: ["Start with column + baseline grid", "Add modular only for heterogeneous blocks", "Line heights must be multiples of baseline (16, 24, 32, 40px)"],
    violations: ["No grid discipline (arbitrary placement)", "More than 12 columns (unnecessary complexity)"],
  },
  {
    topic: "optical-alignment",
    displayName: "Optical vs Mathematical Alignment",
    keyRule: "Mathematical centering is a starting point. The eye overrides the math — almost always needs upward adjustment.",
    detail: "Icons in buttons: 1-2px upward offset. Text in buttons: 1-2px more bottom padding. Hero headlines: raise 5-8% above mathematical center. Circles must be physically larger than squares to appear same size.",
    applications: ["Icons in buttons: 1-2px up", "Text in buttons: more bottom padding", "Hero: raise above mathematical center", "Display type: enable font-kerning, manually kern AV/WA/To"],
    violations: ["Relying on mathematical center without visual check", "Icons feeling 'low' in buttons"],
  },
];

// ---------------------------------------------------------------------------
// INTERACTION PATTERNS (KB 16 — evidence-based timing and behaviors)
// ---------------------------------------------------------------------------

export const INTERACTION_CATEGORIES = [
  "micro-interactions", "progressive-disclosure", "skeleton-vs-spinner",
  "form-design", "navigation", "empty-states", "onboarding",
  "error-recovery", "feedback", "gestures", "thumb-zone",
] as const;
export type InteractionCategory = (typeof INTERACTION_CATEGORIES)[number];

export interface InteractionPattern {
  category: InteractionCategory;
  displayName: string;
  keyRule: string;
  detail: string;
  bestPractices: string[];
  antiPatterns: string[];
}

export const INTERACTION_PATTERNS: InteractionPattern[] = [
  {
    category: "micro-interactions",
    displayName: "Micro-interactions (Saffer Framework)",
    keyRule: "Trigger -> Rules -> Feedback -> Loops/Modes. Every action must produce perceptible feedback.",
    detail: "100ms = physically immediate. 100-200ms = hover/button. 200-300ms = modal appear. 150-250ms = modal dismiss (exits faster). 500ms+ = feels like delay.",
    bestPractices: ["Silent no-ops are trust-destroyers", "Exits faster than entrances", "Objects appearing need longer duration than disappearing"],
    antiPatterns: ["No feedback on user action", "Same duration for enter/exit", "500ms+ for UI transitions"],
  },
  {
    category: "progressive-disclosure",
    displayName: "Progressive Disclosure (Nielsen 1995)",
    keyRule: "Defer features used by < 20% of users. If removing the feature entirely would go unnoticed by 80%, hide it.",
    detail: "Patterns: accordions, 'Advanced options' expand, tooltip explanations, drawer panels. The trap: hiding things because you couldn't prioritize is an architecture problem.",
    bestPractices: ["< 20% usage = hide behind expand", "Show most important first", "Wizard pattern for multi-step"],
    antiPatterns: ["Hiding essential features behind '+' icons", "All features visible at once on first use"],
  },
  {
    category: "skeleton-vs-spinner",
    displayName: "Skeleton Screens vs Spinners",
    keyRule: "Skeleton for known structure (cards, lists). Spinner for discrete actions (button submit). Nothing needed for < 300ms.",
    detail: "2018 ACM: skeletons scored higher perceived speed. Viget 2017: skeletons actually worst for perceived duration. Real advantage is reframing — content arriving vs system stuck.",
    bestPractices: ["Known shape = skeleton", "Unknown shape = spinner", "< 300ms = no indicator", "2s+ = progress bar or skeleton", "App cold start = skeleton over splash"],
    antiPatterns: ["Spinner for page content load", "Skeleton for unpredictable content shape", "No indicator for 1s+ operations"],
  },
  {
    category: "form-design",
    displayName: "Form Design",
    keyRule: "Top-aligned labels (fastest). Validate on blur, not input. Never disable paste. Never clear form on error.",
    detail: "Top labels: one fixation per field vs two for left-aligned. 'Reward early, punish late': validate real-time only when correcting existing error. Max 5 fields per step, 10 steps total.",
    bestPractices: [
      "Top-aligned labels (eye-tracking fastest)",
      "Validate on blur by default",
      "Real-time validate only when correcting existing error",
      "Preserve data on back navigation",
      "Specific final button: 'Create account' not 'Submit'",
      "Show/hide password toggle with text label",
    ],
    antiPatterns: ["Placeholder-as-label (disappears on focus)", "Validate on focus (empty field)", "Disable paste on password", "Clear form on error", "'Submit' as final button text"],
  },
  {
    category: "navigation",
    displayName: "Navigation Patterns",
    keyRule: "Hamburger menu: 39% slower on desktop, 15% on mobile. Tab bars increase engagement up to 58% vs hidden.",
    detail: "Hidden nav discovery: 27% desktop, 57% mobile. Visible: 48% desktop. Bottom tab bar: natural thumb zone, 1.5x more engagement, must persist on scroll.",
    bestPractices: ["Visible nav for < 5 items", "Bottom tab for 3-5 frequent destinations", "Sidebar for dense admin tools", "Breadcrumbs only for true hierarchy"],
    antiPatterns: ["Hamburger as primary nav on desktop", "Tab bar that hides on scroll", "Right sidebar nav on desktop", "Breadcrumbs on flat-hierarchy apps"],
  },
  {
    category: "empty-states",
    displayName: "Empty States",
    keyRule: "Empty states with a CTA are the primary vector for feature adoption. Never show a blank screen.",
    detail: "Three types: first-use (encouraging), user-cleared (congratulatory), no-results (helpful path forward). Structure: headline + copy + CTA + optional illustration.",
    bestPractices: ["Headline: what's missing", "Copy: what happens next", "Single specific CTA", "First-use = brand moment"],
    antiPatterns: ["Blank screen with no explanation", "Generic 'No data' message", "Empty state without action CTA"],
  },
  {
    category: "onboarding",
    displayName: "Onboarding (Userpilot 2024: 188 SaaS)",
    keyRule: "Checklists of 3-5 items outperform 8+. Time to First Value is the metric. Interactive > passive tours.",
    detail: "Average checklist completion: 19.2% (median 10.1%). Top SaaS: 70-80%. Users completing checklist: 3x more likely to convert paid. Tooltips 'trained to be ignored' — cap at 1-3.",
    bestPractices: ["3-5 checklist items", "Interactive walkthroughs over passive tours", "Track Time to First Value", "Describe outcomes not tasks: 'See your first report' not 'Configure data source'"],
    antiPatterns: ["8+ checklist items", "Full-screen takeover hiding product", "Tooltip overload", "Leading with most complex feature"],
  },
  {
    category: "error-recovery",
    displayName: "Error Messages (GOV.UK + Stripe gold standards)",
    keyRule: "Structure: What happened + Why + How to fix. Never blame the user. Never clear input.",
    detail: "GOV.UK: reading age 9, 25 words max. Stripe: parameter-specific, blame bank not user, suggest next step. NNG rubric: visibility + communication + efficiency.",
    bestPractices: ["Inline + summary at top (wording identical)", "Positive framing: describe what to do", "System-blaming tone", "Grade 7-8 reading level"],
    antiPatterns: ["'Error 403'", "'Something went wrong' with no next step", "ALL CAPS errors", "Red-only indicators", "Auto-dismissing before user reads"],
  },
  {
    category: "feedback",
    displayName: "Feedback Patterns",
    keyRule: "Match disruption to urgency. Toast for deletion = UX failure. Modal for liking a post = theater.",
    detail: "Toast: auto-dismiss 4-5s, low priority. Snackbar: + undo, low-medium. Banner: until resolved, medium-high. Inline: persists in context. Modal: blocks all, critical irreversible only.",
    bestPractices: ["Toasts: bottom-right desktop, bottom-center mobile", "Modals: genuinely critical irreversible only", "Inline: highest fidelity, where user is focused"],
    antiPatterns: ["Toast for errors requiring action", "Modal for reversible delete", "No feedback on completed action"],
  },
  {
    category: "gestures",
    displayName: "Gesture Design",
    keyRule: "Gestures are shortcuts, never the only path. Every gesture must have a visible button equivalent.",
    detail: "Tap: high discoverability. Long press: low. Swipe: medium (convention). Pull-to-refresh: medium (learned). Pinch: high (physical metaphor).",
    bestPractices: ["Button equivalent for every gesture", "Teach undiscoverable gestures in onboarding", "Pull-to-refresh only for dynamic content"],
    antiPatterns: ["Gesture-only actions with no button", "Undocumented custom gestures", "Long press without teaching"],
  },
  {
    category: "thumb-zone",
    displayName: "Thumb Zone (Hoober, 1300 observations)",
    keyRule: "75% of interactions are thumb-driven. Bottom third = easy. Top corners = hardest. Primary actions go bottom.",
    detail: "49% one-handed, 36% cradled + index, 15% two-thumbed. Bottom third: natural arc for thumb. Top corners require grip shift.",
    bestPractices: ["Primary actions in bottom third", "Tab bar at bottom", "FAB in thumb zone", "Avoid frequent actions in top corners"],
    antiPatterns: ["Close/cancel in top corners", "Primary CTA at top of screen", "All actions in hard-to-reach zones"],
  },
];

// ---------------------------------------------------------------------------
// UX WRITING (KB 17 — evidence-backed copy guidelines)
// ---------------------------------------------------------------------------

export const WRITING_TOPICS = [
  "button-labels", "voice-tone", "plain-language", "error-messages",
  "placeholder-text", "conversion-copy", "confirmation-dialogs",
  "inclusive-language", "onboarding-copy", "loading-states",
  "empty-states-copy", "headlines",
] as const;
export type WritingTopic = (typeof WRITING_TOPICS)[number];

export interface WritingGuideline {
  topic: WritingTopic;
  displayName: string;
  keyRule: string;
  evidence: string;
  doExamples: string[];
  dontExamples: string[];
}

export const WRITING_GUIDELINES: WritingGuideline[] = [
  {
    topic: "button-labels",
    displayName: "Button Label Psychology",
    keyRule: "First-person ('Start my trial') outperforms second-person ('Start your trial') by 90%. Verb + object always.",
    evidence: "ContentVerve A/B test: 90% CTR increase with first-person. HubSpot: personalized CTAs convert 202% better.",
    doExamples: ["Download report", "Add to cart", "Start my free trial", "Continue to payment"],
    dontExamples: ["Click here", "Submit", "OK", "Learn More (as primary)", "Yes / No"],
  },
  {
    topic: "voice-tone",
    displayName: "Voice & Tone (Mailchimp System)",
    keyRule: "Voice is constant (plainspoken, genuine, translators, dry humor). Tone adjusts to reader's emotional state.",
    evidence: "Mailchimp Content Style Guide — the industry reference for voice/tone systems.",
    doExamples: ["Clear over clever", "Active voice: 'You can edit'", "Say what users CAN do"],
    dontExamples: ["Forced humor", "Passive: 'Your profile can be edited'", "Condescending tone", "Snobbish references"],
  },
  {
    topic: "plain-language",
    displayName: "Plain Language (GOV.UK Standard)",
    keyRule: "Write at reading age 9 (~5,000 words). Max 25 words per sentence. Even experts prefer plain language.",
    evidence: "GOV.UK: 80% prefer clear English. Block capitals 13-18% harder to read.",
    doExamples: ["buy (not purchase)", "help (not assist)", "about (not approximately)", "start (not commence)"],
    dontExamples: ["purchase", "assist", "approximately", "commence", "negative contractions (can't -> cannot)"],
  },
  {
    topic: "error-messages",
    displayName: "Error Messages (NNG Rubric)",
    keyRule: "What happened + Why + How to fix. Grade 7-8 reading level. Never blame the user.",
    evidence: "NNG 3-dimension rubric. Craigslist scored D (2.08), J.Crew scored A (3.67).",
    doExamples: ["'That email is already registered. Try signing in, or use a different email.'", "'Your bank declined this charge. Try a different card.'"],
    dontExamples: ["'Error 403'", "'Invalid input'", "'You entered the wrong password'", "'Something went wrong'"],
  },
  {
    topic: "placeholder-text",
    displayName: "Placeholder Text (NNG Research)",
    keyRule: "Never use placeholder as label. Acceptable only for format hints (MM/DD/YYYY).",
    evidence: "NNG: users forget question, mistake for pre-filled default, impossible to verify responses.",
    doExamples: ["Persistent visible label above", "Format hint: 'e.g., jane@company.com'", "Floating label (compromise)"],
    dontExamples: ["Placeholder as only label", "Long instructions in placeholder", "Low-contrast placeholder violating a11y"],
  },
  {
    topic: "conversion-copy",
    displayName: "Conversion Copy (Copyhackers)",
    keyRule: "Voice-of-customer research is unfair advantage. Every line has one job: give reason to keep reading.",
    evidence: "Headlines do 80% of work. Specificity: '143 leads in 12 months' beats 'We help you grow'.",
    doExamples: ["Concrete numbers: '3,600 panelists'", "Odd numbers signal authenticity", "'So what?' test after every claim"],
    dontExamples: ["Vague claims: 'many participants'", "Round numbers feeling fabricated", "Feature-driven over benefit-driven"],
  },
  {
    topic: "confirmation-dialogs",
    displayName: "Confirmation Dialogs",
    keyRule: "Kill 'Are you sure?' — it teaches reflexive clicking. Title = action as question. Buttons = specific verbs.",
    evidence: "NNG: overused confirmations fail because users develop automatic 'Yes' response.",
    doExamples: ["Title: 'Delete this project?'", "Body: '12,847 subscribers will be lost. Cannot be undone.'", "Buttons: 'Delete project' / 'Keep project'"],
    dontExamples: ["'Are you sure?'", "'OK' / 'Cancel'", "'Yes' / 'No'", "No consequence description"],
  },
  {
    topic: "inclusive-language",
    displayName: "Inclusive Language (Microsoft)",
    keyRule: "Gender-neutral: use 'you' or plural. People-first disability language. Input-agnostic verbs.",
    evidence: "Microsoft Inclusive Design Guidelines.",
    doExamples: ["'select' not 'click'", "'go to' not 'navigate to'", "'they/their' for singular", "'chair' not 'chairman'"],
    dontExamples: ["he/him in generic references", "'handicapped'", "'click' (excludes keyboard/screen reader)", "'master/slave'"],
  },
  {
    topic: "onboarding-copy",
    displayName: "Onboarding Copy (UserOnboard)",
    keyRule: "The user is the hero, not the product. Describe outcomes not tasks: 'See your first report' not 'Configure data'.",
    evidence: "Userpilot 2024: users completing checklist 3x more likely to convert paid.",
    doExamples: ["'Here's what you'll do in 3 minutes'", "'See your first report'", "Progress indicators"],
    dontExamples: ["'Welcome to [Product]'", "'Configure data source'", "Full-screen takeover hiding product"],
  },
  {
    topic: "loading-states",
    displayName: "Loading State Copy",
    keyRule: "< 2s: spinner only (text disappears before readable). 2-10s: verb + ellipsis. 10s+: progressive with count.",
    evidence: "Doherty Threshold: > 400ms breaks flow. UIE: Amazon rated faster at 36s than About.com at 8s (task completion drives perception).",
    doExamples: ["'Saving...'", "'Uploading (3 of 12 files)...'", "'Processing — this may take a minute'"],
    dontExamples: ["'Loading...' for everything", "'Save in progress' (use participle)", "Text on < 2s operations"],
  },
  {
    topic: "empty-states-copy",
    displayName: "Empty State Copy",
    keyRule: "Every empty state is an onboarding moment. Headline + copy + CTA. Never blank.",
    evidence: "Empty states with CTA are primary vector for feature adoption.",
    doExamples: ["First-use: 'No projects yet. Create your first.'", "Cleared: 'All caught up!'", "No results: 'Try a different search term.'"],
    dontExamples: ["Blank screen", "'No data'", "Empty state without CTA"],
  },
  {
    topic: "headlines",
    displayName: "Headlines for UI",
    keyRule: "Front-load keywords. Sentence case. Under 8 words. Match user's mental model.",
    evidence: "Users scan first 2-3 words. Material, Carbon, Atlassian default to sentence case.",
    doExamples: ["'Payment settings'", "'3 items in your cart'", "Sentence case headings"],
    dontExamples: ["'Settings for your payment methods'", "'Almost there!' (clever over clear)", "Title Case Everywhere"],
  },
];

// ---------------------------------------------------------------------------
// LANDING PAGE PATTERNS (KB 18 — conversion science with hard numbers)
// ---------------------------------------------------------------------------

export const LANDING_TOPICS = [
  "hero-section", "section-ordering", "social-proof", "pricing-psychology",
  "form-optimization", "cta-optimization", "trust-signals", "page-speed",
  "awareness-framework", "mobile-landing",
] as const;
export type LandingTopic = (typeof LANDING_TOPICS)[number];

export interface LandingPattern {
  topic: LandingTopic;
  displayName: string;
  keyStats: string[];
  bestPractices: string[];
  antiPatterns: string[];
}

export const LANDING_PATTERNS: LandingPattern[] = [
  {
    topic: "hero-section",
    displayName: "Hero Section Science",
    keyStats: [
      "57% of viewing time above fold (NNG, down from 80% in 2010)",
      "84% attention difference above vs below fold",
      "Video heroes can boost conversion 80-86% but 52.8% abandon for faster mobile loads",
      "Simplified hero (headline + CTA only) improved CLS by 42% and conversion by 8%",
    ],
    bestPractices: ["Value prop comprehensible in 3 seconds", "CTA above fold", "Bleed 40-80px of next section into view", "75% of SaaS use product screenshot, 25% no image (both work)"],
    antiPatterns: ["Full-viewport hero with no overflow (false floor)", "Auto-playing video on slow connections", "Feature-focused instead of outcome-focused headline"],
  },
  {
    topic: "section-ordering",
    displayName: "Section Ordering",
    keyStats: ["Unbounce 41K+ pages: consistent top performers follow trust-building sequence"],
    bestPractices: ["Hero -> Social Proof (logos) -> Problem/Solution -> Features -> Testimonials -> Pricing -> FAQ -> Final CTA -> Footer", "Trust is a sequence, not a section", "Evidence appears near the claim it validates"],
    antiPatterns: ["Pricing before establishing value", "FAQ before features", "No repeated CTA after long scroll"],
  },
  {
    topic: "social-proof",
    displayName: "Social Proof (Cialdini)",
    keyStats: [
      "Named customer metrics: 30-70% conversion increase (TrustRadius)",
      "Enterprise logos: DocSend saw 260% conversion increase with 4-6 logos",
      "G2/Capterra badges: up to 55% conversion lift",
      "Video testimonials: +80% conversion",
      "95% of consumers spot generic/fake testimonials",
    ],
    bestPractices: ["Specific metrics from named customers (strongest)", "4-6 recognizable logos", "Third-party badges", "Named testimonials with photo/title/company"],
    antiPatterns: ["Generic 'trusted by 10,000+'", "Fake reviews", "Social proof far from CTA"],
  },
  {
    topic: "pricing-psychology",
    displayName: "Pricing Psychology",
    keyStats: [
      "Three tiers with highlighted middle outperforms 2/4/5 (ProfitWell 12K SaaS)",
      "Ariely decoy: increased premium selection by ~40% (The Economist)",
      "Annual default: +19% annual adoption",
      "Strikethrough anchor: +25-40% annual commitment (Zuora)",
    ],
    bestPractices: ["3 tiers, highlight middle", "Show expensive first (anchoring)", "Default to annual billing", "'Two months free' framing", "15-20% annual discount"],
    antiPatterns: ["No recommended plan highlighted", "Showing monthly first", "Too many tiers (decision fatigue)"],
  },
  {
    topic: "form-optimization",
    displayName: "Form Optimization (Baymard 5,700+ sessions)",
    keyStats: [
      "26% abandon because flow too long/complex",
      "7-8 fields optimal, drops 4-6% per field beyond 8",
      "81% mobile users abandon if form feels too long",
      "Inline validation: +22% completion",
      "Highest abandonment: 'Create password' field",
    ],
    bestPractices: ["7-8 fields for single product", "Inline validation on blur", "Guest checkout option", "Specific final button text"],
    antiPatterns: ["Mandatory account creation", "Phone/birthdate without clear reason", "No inline validation", "Clearing form on error"],
  },
  {
    topic: "cta-optimization",
    displayName: "CTA Optimization",
    keyStats: [
      "'Get Started' ≈ 2x clicks vs 'Contact Us'",
      "First-person: +90% ('Start my trial' vs 'Start your trial')",
      "'No credit card required' near CTA: +34% signups",
      "Single CTA: +266% conversions (WiserNotify)",
      "Above-fold CTA: +30% conversion (HubSpot 40K pages)",
    ],
    bestPractices: ["Single primary CTA per screen", "Repeat CTA after each major section", "Benefit-oriented verb", "Reduce anxiety: 'No credit card required'"],
    antiPatterns: ["Multiple competing CTAs", "'Click here'", "'Submit'", "CTA only in hero (disappears on scroll)"],
  },
  {
    topic: "trust-signals",
    displayName: "Trust Signals",
    keyStats: [
      "SSL badge: 85% more likely to complete purchase",
      "Money-back guarantee: +32% sales (VWO)",
      "Missing trust seals: 61% didn't complete purchase",
      "Trust badges aggregate: +17-21% revenue",
    ],
    bestPractices: ["Trust signal within visual proximity of every CTA", "Guarantee near payment CTA", "Third-party badges users recognize"],
    antiPatterns: ["Trust signals only in footer", "No guarantee near checkout", "Fake/unrecognized badges"],
  },
  {
    topic: "page-speed",
    displayName: "Page Speed and Conversion",
    keyStats: [
      "1s -> 3s: +32% bounce (Google 11M pages)",
      "1s -> 5s: +90% bounce",
      "Each second (0-5s): -4.42% conversion (Portent)",
      "0.1s improvement: +8.4% retail conversion (Deloitte 37 brands)",
      "53% mobile abandon if load > 3 seconds",
    ],
    bestPractices: ["Sub-2s load time", "AVIF > WebP > JPEG (50% savings)", "150KB JS budget (gzipped)", "Skeleton screens over spinners"],
    antiPatterns: ["Hero video on slow connections", "Unoptimized images", "Third-party script bloat", "No lazy loading below fold"],
  },
  {
    topic: "awareness-framework",
    displayName: "Schwartz Awareness Framework",
    keyStats: ["Crazy Egg: 363% revenue increase with 20x longer page (addressed every objection)", "Grade 5-7 copy converts 56% better than grade 8-9 (Unbounce)"],
    bestPractices: [
      "Unaware: longest copy (3000+ words), educate about problem",
      "Problem Aware: agitate problem, introduce solution category",
      "Solution Aware: differentiate from alternatives",
      "Product Aware: overcome objections, provide proof",
      "Most Aware: just the offer, price, CTA",
    ],
    antiPatterns: ["Short page for unaware audience", "Long page for most-aware audience", "Same page length regardless of awareness"],
  },
  {
    topic: "mobile-landing",
    displayName: "Mobile Landing Pages",
    keyStats: ["82.9% of traffic is mobile", "Sticky CTA bar increases mobile conversion"],
    bestPractices: ["Simplified above-fold: headline + CTA + one trust signal", "Thumb-zone CTA (lower-center)", "Max 4 form fields", "Sticky CTA bar at viewport bottom", "Accordions for non-essential content"],
    antiPatterns: ["Desktop layout on mobile", "CTA at top (scrolls away fast)", "Long forms without progressive disclosure"],
  },
];

// ---------------------------------------------------------------------------
// ANTI-PATTERNS (KB 09 — the AI slop fingerprint)
// ---------------------------------------------------------------------------

export const ANTI_PATTERN_CATEGORIES = [
  "color", "typography", "spacing", "component",
  "motion", "layout", "industry-specific", "feels-wrong",
] as const;
export type AntiPatternCategory = (typeof ANTI_PATTERN_CATEGORIES)[number];

export interface AntiPattern {
  category: AntiPatternCategory;
  pattern: string;
  whyItFails: string;
  fix: string;
  industry?: IndustryCategory;
}

export const ANTI_PATTERNS: AntiPattern[] = [
  // COLOR
  { category: "color", pattern: "AI purple gradient (#6366F1 to #8B5CF6)", whyItFails: "Instantly recognizable as AI-generated. No brand identity.", fix: "Choose a unique brand hue with intentional chroma in OKLCH" },
  { category: "color", pattern: "Hex/HSL for design system colors", whyItFails: "Non-uniform perceptual steps, bad dark mode generation", fix: "Use OKLCH for all color tokens" },
  { category: "color", pattern: "Same primary for charts AND UI", whyItFails: "Charts compete with interactive elements", fix: "Dedicate --chart-* tokens separate from --primary" },
  { category: "color", pattern: "Cold grey #F9FAFB background", whyItFails: "Generic, no warmth or personality", fix: "Add 2-5deg warm hue to neutral greys (C: 0.008-0.015)" },
  { category: "color", pattern: "Dark mode = just invert", whyItFails: "Produces cold, ugly darks", fix: "Warm charcoal bg, off-white text, progressively lighter surfaces" },
  { category: "color", pattern: "Pure #000 text on pure #FFF", whyItFails: "Irradiation: light bleeds into dark at high contrast, causes eye strain", fix: "Near-black (oklch 0.12-0.15) on tinted white (oklch 0.97-0.99)" },
  // TYPOGRAPHY
  { category: "typography", pattern: "Random font sizes (17px, 23px, 37px)", whyItFails: "No mathematical scale, no visual harmony", fix: "Use ratio-based scale (1.25/1.333/1.414)" },
  { category: "typography", pattern: "font-weight: 500 for everything", whyItFails: "No hierarchy — flat reading experience", fix: "Weight contrast: 700-800 heading, 400 body" },
  { category: "typography", pattern: "Positive tracking on headings", whyItFails: "Looks corporate and cheap", fix: "Negative tracking: -0.01 to -0.03em on headings" },
  { category: "typography", pattern: "Line-height 1.75 on app UI", whyItFails: "1.75 is prose line height, not app UI", fix: "1.5 for app body, 1.05-1.2 for display" },
  { category: "typography", pattern: "3+ font families", whyItFails: "Visual chaos", fix: "Max 2 families (sans + mono for apps)" },
  { category: "typography", pattern: "Full-width body text (90+ chars)", whyItFails: "Unreadable: eye loses track between lines", fix: "max-width: 65ch on prose containers" },
  // SPACING
  { category: "spacing", pattern: "Non-4px values (11px, 17px, 23px)", whyItFails: "Breaks visual rhythm", fix: "All spacing = multiples of 4px" },
  { category: "spacing", pattern: "Same padding everywhere", whyItFails: "No hierarchy, no rhythm", fix: "Semantic spacing tokens by context (section vs card vs inline)" },
  { category: "spacing", pattern: "No max-width on content", whyItFails: "Stretches to viewport on ultrawide", fix: "--size-content-max: 67.5rem (1080px)" },
  // COMPONENT
  { category: "component", pattern: "No hover state", whyItFails: "Silent interaction, no feedback", fix: "All interactive elements must have hover" },
  { category: "component", pattern: "outline: none without replacement", whyItFails: "Keyboard users completely lost", fix: "2px ring, 2px offset, primary color" },
  { category: "component", pattern: "Missing loading state", whyItFails: "User thinks action failed", fix: "Spinner/skeleton for all async operations" },
  { category: "component", pattern: "Missing empty state", whyItFails: "Confusing blank screen", fix: "Headline + copy + CTA for every empty container" },
  { category: "component", pattern: "Touch targets under 44px", whyItFails: "Unusable on mobile, WCAG failure", fix: "Pad to 44x44px minimum hit area" },
  { category: "component", pattern: "Emojis as icons", whyItFails: "Inconsistent rendering across OSes", fix: "SVG icon system (Lucide, Heroicons, Phosphor)" },
  { category: "component", pattern: "cursor: pointer missing on clickable elements", whyItFails: "User doesn't know it's interactive", fix: "Always cursor-pointer on clickable elements" },
  // MOTION
  { category: "motion", pattern: "animate-bounce on icons", whyItFails: "Distracting, serves no information", fix: "Reserve animation for loading/state changes only" },
  { category: "motion", pattern: "No prefers-reduced-motion", whyItFails: "Causes nausea in motion-sensitive users, WCAG 2.3.3 violation", fix: "@media (prefers-reduced-motion: reduce) with !important" },
  { category: "motion", pattern: "Transitions longer than 500ms", whyItFails: "Feels sluggish, breaks flow", fix: "150-300ms for UI, 400-500ms max for complex animations" },
  { category: "motion", pattern: "Linear easing", whyItFails: "Robotic, unnatural", fix: "ease-out (enter), ease-in (exit), ease-in-out (reposition)" },
  { category: "motion", pattern: "Animating width/height/top/left", whyItFails: "Triggers layout reflow — jank", fix: "Use transform and opacity only (GPU-accelerated)" },
  // LAYOUT
  { category: "layout", pattern: "Arbitrary z-index (999, 9999)", whyItFails: "Stacking context conflicts", fix: "Named scale: dropdown=1000, modal=1050, tooltip=1070" },
  { category: "layout", pattern: "No aspect-ratio on images", whyItFails: "CLS when image loads", fix: "Always set aspect-ratio or width+height on images" },
  { category: "layout", pattern: "Sticky nav without body padding", whyItFails: "Nav covers first section of content", fix: "padding-top: nav-height on body/main" },
  // FEELS WRONG (passes tests but feels off)
  { category: "feels-wrong", pattern: "24px spacing everywhere", whyItFails: "Visual monotony — no rhythm", fix: "Vary spacing by semantic context (tight/medium/loose/section)" },
  { category: "feels-wrong", pattern: "All colors same chroma level", whyItFails: "No focal point, flat feeling", fix: "One high-chroma accent, rest muted" },
  { category: "feels-wrong", pattern: "Pure #000 text on warm bg", whyItFails: "Feels harsh and disconnected", fix: "Warm near-black: oklch(0.12 0.005 60)" },
  { category: "feels-wrong", pattern: "Tables with no row hover", whyItFails: "Impossible to track which row you're reading", fix: "Subtle background highlight on row hover" },
  { category: "feels-wrong", pattern: "Borders without purpose", whyItFails: "Visual noise", fix: "Remove borders; use spacing/bg-color for grouping" },
  // INDUSTRY-SPECIFIC
  { category: "industry-specific", pattern: "AI purple gradient in banking/fintech", whyItFails: "Destroys institutional trust", fix: "Navy + trust blue + gold accent", industry: "fintech" },
  { category: "industry-specific", pattern: "Bright neon in healthcare", whyItFails: "Anxiety-inducing, not calming", fix: "Muted blues, calm greens, low saturation", industry: "healthcare" },
  { category: "industry-specific", pattern: "Motion-heavy in mental health apps", whyItFails: "Can trigger anxiety", fix: "Minimal, gentle transitions only", industry: "mental-health" },
  { category: "industry-specific", pattern: "Low contrast in government sites", whyItFails: "WCAG AAA required, diverse user base", fix: "Maximum contrast, skip links, plain language", industry: "government" },
  { category: "industry-specific", pattern: "Playful aesthetic in B2B enterprise", whyItFails: "Undermines professional trust", fix: "Conservative, structured, case-study-driven", industry: "b2b-service" },
  { category: "industry-specific", pattern: "Dark mode default in wellness apps", whyItFails: "Breaks the calm, warm impression", fix: "Light mode with warm neutrals, optional dark", industry: "wellness" },
  { category: "industry-specific", pattern: "Minimalist design for gaming", whyItFails: "No energy, no immersion", fix: "Dark + vibrant, WebGL, full-bleed media", industry: "gaming" },
];

// ---------------------------------------------------------------------------
// DESIGN MASTERS (KB 12 — 5 convergence points from 7 masters)
// ---------------------------------------------------------------------------

export interface MasterPrinciple {
  master: string;
  principle: string;
  application: string;
}

export const MASTER_PRINCIPLES: MasterPrinciple[] = [
  { master: "Dieter Rams", principle: "As little design as possible", application: "Every element must serve function. Remove features, not just decorations." },
  { master: "Dieter Rams", principle: "Good design is honest", application: "No dark patterns. Product doesn't appear more powerful than it is." },
  { master: "Dieter Rams", principle: "Thorough down to last detail", application: "404 pages, empty states, error messages, loading states — all are design surfaces." },
  { master: "Don Norman", principle: "Signifiers over affordances", application: "Designers control what communicates the action, not the action itself. Blue underlined = link." },
  { master: "Don Norman", principle: "Feedback must be immediate and calibrated", application: "< 100ms response. Not too little (missing), not too much (notification spam)." },
  { master: "Don Norman", principle: "Narrow Gulf of Execution and Evaluation", application: "Make possible actions obvious (execution) and outcomes perceivable (evaluation)." },
  { master: "Massimo Vignelli", principle: "Maximum 2 type sizes per screen", application: "Play small against large: 2x ratio minimum for hierarchy. White space > type variety." },
  { master: "Massimo Vignelli", principle: "Grid removes arbitrary placement", application: "Every element occupies a justified grid position. Elements span cells, never break them." },
  { master: "Erik Spiekermann", principle: "Type is brand", application: "Custom/deliberate typeface encodes character. Size and tracking are inverse." },
  { master: "Erik Spiekermann", principle: "Open apertures for screen legibility", application: "Humanist sans > geometric sans at small sizes (Meta > Helvetica)." },
  { master: "Jony Ive", principle: "Simplicity is purpose, not absence", application: "Removing clutter without achieving purpose = empty, not simple." },
  { master: "Jony Ive", principle: "9:1 rejection ratio", application: "The discipline is rigorous rejection, not having the right idea first." },
  { master: "Edward Tufte", principle: "Data-ink ratio toward 1.0", application: "If an element can be erased without info loss, erase it. Kill chartjunk." },
  { master: "Edward Tufte", principle: "Small multiples", application: "Same structure, vary only data. Eye reads structure once, then reads variation." },
  { master: "Susan Kare", principle: "Meaningful, Memorable, Clear", application: "Icons from real metaphors (trash can, folder). One-trial learning. Traffic sign test." },
  { master: "Susan Kare", principle: "Constraint as creative tool", application: "The pixel grid forced simplicity. Well-designed icons achieve permanence." },
];

export const CONVERGENCE_POINTS: { principle: string; masters: string[]; implication: string }[] = [
  {
    principle: "Reduction is the hardest work",
    masters: ["Rams (remove non-essential)", "Vignelli (10 typefaces enough)", "Tufte (erase non-data ink)", "Ive (reject 9/10)", "Kare (every pixel justified)"],
    implication: "Every element in the design must earn its place. Default is removal.",
  },
  {
    principle: "Constraints enable rather than limit",
    masters: ["Kare (32x32 grid)", "Tufte (data-ink)", "Vignelli (restricted palette)", "Norman (physical constraints)"],
    implication: "Good constraints remove decisions that distract from the core problem.",
  },
  {
    principle: "Timelessness over trend",
    masters: ["Vignelli (opposes fashion)", "Rams (long-lasting)", "Kare (stop sign test)"],
    implication: "Structural clarity doesn't age. Stylistic choices do. Build for structure.",
  },
  {
    principle: "Function precedes form, but form is not optional",
    masters: ["Norman (make possible obvious)", "Spiekermann (type is function)", "Rams (aesthetic = integral)"],
    implication: "Usefulness and beauty are not separate concerns. Both required.",
  },
  {
    principle: "Design communicates trust",
    masters: ["Norman (don't blame user)", "Rams (honest)", "Kare (universal)", "Tufte (honest graphics)"],
    implication: "Primary obligation is to the person receiving the design.",
  },
];

// ---------------------------------------------------------------------------
// INTENT RESOLUTION HELPERS
// ---------------------------------------------------------------------------

const INDUSTRY_KEYWORDS: Record<IndustryCategory, string[]> = {
  "saas": ["saas", "software", "app", "platform", "tool", "service", "subscription"],
  "analytics": ["analytics", "dashboard", "metrics", "data", "reporting", "visualization", "charts"],
  "healthcare": ["health", "medical", "hospital", "patient", "clinical", "doctor", "pharma"],
  "fintech": ["finance", "bank", "payment", "crypto", "trading", "investment", "money", "fintech"],
  "creative-agency": ["agency", "creative", "studio", "design agency", "branding"],
  "portfolio": ["portfolio", "personal site", "freelance", "resume", "cv"],
  "gaming": ["game", "gaming", "esports", "player", "multiplayer"],
  "ecommerce-luxury": ["ecommerce", "shop", "store", "luxury", "fashion", "retail"],
  "mental-health": ["mental health", "therapy", "meditation", "mindfulness", "counseling"],
  "government": ["government", "gov", "public service", "civic", "municipal"],
  "developer-tool": ["developer", "dev tool", "api", "cli", "sdk", "code", "ide", "terminal"],
  "ai-chatbot": ["ai", "chatbot", "copilot", "assistant", "llm", "gpt", "claude"],
  "b2b-service": ["b2b", "enterprise", "consulting", "professional service"],
  "education": ["education", "learning", "course", "school", "university", "tutorial", "lms"],
  "wellness": ["wellness", "fitness", "yoga", "spa", "nutrition", "self-care"],
};

const EMOTIONAL_TO_PERSONALITY: Record<string, PersonalityCluster> = {
  "trustworthy": "enterprise-trust",
  "playful": "bold-energetic",
  "premium": "premium-precision",
  "energetic": "bold-energetic",
  "calm": "warm-editorial",
  "technical": "technical-developer",
  "bold": "bold-energetic",
  "editorial": "warm-editorial",
};

export type EmotionalTarget = "trustworthy" | "playful" | "premium" | "energetic" | "calm" | "technical" | "bold" | "editorial";
export type UserType = "developer" | "consumer" | "enterprise" | "child" | "creative" | "healthcare";
export type DensityMode = "compact" | "normal" | "comfortable";
export type MotionLevel = "static" | "subtle" | "moderate" | "rich";

export interface ResolvedIntent {
  industry: IndustryCategory;
  industryConfidence: "high" | "medium" | "low";
  personality: PersonalityCluster;
  style: StyleName;
  mode: "light" | "dark";
  density: DensityMode;
  colorMood: string;
  mustHave: string[];
  neverUse: string[];
  emotionalTarget: string;
  needsUserInput: string[];
}

export function resolveIndustry(product: string): { industry: IndustryCategory; confidence: "high" | "medium" | "low" } {
  const lower = product.toLowerCase();
  let bestMatch: IndustryCategory = "saas";
  let bestScore = 0;

  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = industry as IndustryCategory;
    }
  }

  const confidence = bestScore >= 8 ? "high" : bestScore >= 4 ? "medium" : "low";
  return { industry: bestMatch, confidence };
}

export function resolvePersonality(emotional: EmotionalTarget): PersonalityCluster {
  return EMOTIONAL_TO_PERSONALITY[emotional] ?? "premium-precision";
}

export function resolveFullIntent(
  product: string,
  userType?: UserType,
  emotionalTarget?: EmotionalTarget,
): ResolvedIntent {
  const { industry, confidence } = resolveIndustry(product);
  const rules = INDUSTRY_RULES.find((r) => r.industry === industry);
  const emotional = emotionalTarget ?? (rules?.emotionalTarget as EmotionalTarget) ?? "trustworthy";
  const personality = resolvePersonality(emotional);

  const darkDefault = ["developer-tool", "gaming", "cinematic-dark"].includes(industry)
    || personality === "technical-developer"
    || personality === "cinematic-dark";

  const densityMap: Record<string, DensityMode> = {
    "developer": "compact",
    "consumer": "comfortable",
    "enterprise": "normal",
    "child": "comfortable",
    "creative": "normal",
    "healthcare": "comfortable",
  };

  const styleMap: Partial<Record<IndustryCategory, StyleName>> = {
    "saas": "soft-ui",
    "analytics": "minimalism",
    "healthcare": "soft-ui",
    "fintech": "minimalism",
    "developer-tool": "dark-oled",
    "gaming": "dark-oled",
    "creative-agency": "vibrant-block",
    "education": "claymorphism",
    "wellness": "soft-ui",
    "ecommerce-luxury": "minimalism",
    "government": "minimalism",
    "ai-chatbot": "minimalism",
    "b2b-service": "minimalism",
    "portfolio": "minimalism",
    "mental-health": "soft-ui",
  };

  const needsInput: string[] = [];
  if (confidence === "low") needsInput.push("industry (could not auto-detect)");
  if (!emotionalTarget) needsInput.push("emotional target (using industry default)");
  if (!userType) needsInput.push("primary user type");
  needsInput.push("brand color", "sections/pages", "framework/stack");

  return {
    industry,
    industryConfidence: confidence,
    personality,
    style: styleMap[industry] ?? "soft-ui",
    mode: darkDefault ? "dark" : "light",
    density: densityMap[userType ?? "consumer"] ?? "normal",
    colorMood: rules?.colorMood ?? "Trust blue + single accent",
    mustHave: rules?.mustHave ?? [],
    neverUse: rules?.neverUse ?? [],
    emotionalTarget: emotional,
    needsUserInput: needsInput,
  };
}

// ---------------------------------------------------------------------------
// SEARCH HELPER
// ---------------------------------------------------------------------------

export type SearchResultKind =
  | "personality" | "style" | "industry" | "law"
  | "system" | "composition" | "interaction" | "writing"
  | "landing" | "anti-pattern" | "master" | "convergence"
  | "page-template" | "preset" | "font-pairing";

export interface SearchResult {
  kind: SearchResultKind;
  name: string;
  summary: string;
}

export function searchDesigner(query: string): SearchResult[] {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const p of PERSONALITIES) {
    if (matchAny(q, p.cluster, p.description, ...p.exemplars.map((e) => e.name + " " + e.signature))) {
      results.push({ kind: "personality", name: p.cluster, summary: p.description });
    }
  }
  for (const s of STYLES) {
    if (matchAny(q, s.name, s.description, ...s.useWhen, ...s.antiPatterns)) {
      results.push({ kind: "style", name: s.name, summary: s.description });
    }
  }
  for (const r of INDUSTRY_RULES) {
    if (matchAny(q, r.industry, r.colorMood, ...r.mustHave, ...r.neverUse)) {
      results.push({ kind: "industry", name: r.industry, summary: `${r.primaryStyle} | ${r.colorMood}` });
    }
  }
  for (const l of COGNITIVE_LAWS) {
    if (matchAny(q, l.name, l.displayName, l.keyInsight, ...l.uiApplications)) {
      results.push({ kind: "law", name: l.displayName, summary: l.keyInsight });
    }
  }
  for (const d of DESIGN_SYSTEMS) {
    if (matchAny(q, d.name, d.displayName, d.signature, ...d.keyInsights)) {
      results.push({ kind: "system", name: d.displayName, summary: d.signature });
    }
  }
  for (const c of COMPOSITION_RULES) {
    if (matchAny(q, c.topic, c.displayName, c.keyRule, c.detail)) {
      results.push({ kind: "composition", name: c.displayName, summary: c.keyRule });
    }
  }
  for (const i of INTERACTION_PATTERNS) {
    if (matchAny(q, i.category, i.displayName, i.keyRule, ...i.bestPractices)) {
      results.push({ kind: "interaction", name: i.displayName, summary: i.keyRule });
    }
  }
  for (const w of WRITING_GUIDELINES) {
    if (matchAny(q, w.topic, w.displayName, w.keyRule, w.evidence)) {
      results.push({ kind: "writing", name: w.displayName, summary: w.keyRule });
    }
  }
  for (const lp of LANDING_PATTERNS) {
    if (matchAny(q, lp.topic, lp.displayName, ...lp.keyStats, ...lp.bestPractices)) {
      results.push({ kind: "landing", name: lp.displayName, summary: lp.keyStats[0] ?? "" });
    }
  }
  for (const a of ANTI_PATTERNS) {
    if (matchAny(q, a.category, a.pattern, a.whyItFails, a.fix)) {
      results.push({ kind: "anti-pattern", name: a.pattern, summary: a.fix });
    }
  }
  for (const m of MASTER_PRINCIPLES) {
    if (matchAny(q, m.master, m.principle, m.application)) {
      results.push({ kind: "master", name: `${m.master}: ${m.principle}`, summary: m.application });
    }
  }
  for (const t of PAGE_TEMPLATES) {
    if (matchAny(q, t.type, t.description, ...t.keyRules, ...t.sections.map((s) => s.name))) {
      results.push({ kind: "page-template", name: t.type, summary: t.description });
    }
  }
  for (const p of PRESETS) {
    if (matchAny(q, p.name, p.displayName, p.description, p.personality, p.inspiration)) {
      results.push({ kind: "preset", name: p.displayName, summary: p.description });
    }
  }
  for (const f of FONT_PAIRINGS) {
    if (matchAny(q, f.name, f.heading, f.body, f.mood, f.why, ...f.industries)) {
      results.push({ kind: "font-pairing", name: f.name, summary: `${f.heading} + ${f.body} — ${f.mood}` });
    }
  }

  return results;
}

function matchAny(query: string, ...fields: string[]): boolean {
  return fields.some((f) => f.toLowerCase().includes(query));
}

// ---------------------------------------------------------------------------
// LOOKUP HELPERS
// ---------------------------------------------------------------------------

export function getPersonality(cluster: PersonalityCluster): PersonalityProfile | undefined {
  return PERSONALITIES.find((p) => p.cluster === cluster);
}

export function getStyle(name: StyleName): DesignStyle | undefined {
  return STYLES.find((s) => s.name === name);
}

export function getIndustryRule(industry: IndustryCategory): IndustryRule | undefined {
  return INDUSTRY_RULES.find((r) => r.industry === industry);
}

export function getCognitiveLaw(name: CognitiveLawName): CognitiveLaw | undefined {
  return COGNITIVE_LAWS.find((l) => l.name === name);
}

export function getDesignSystem(name: DesignSystemName): DesignSystemReference | undefined {
  return DESIGN_SYSTEMS.find((d) => d.name === name);
}

export function getCompositionRule(topic: CompositionTopic): CompositionRule | undefined {
  return COMPOSITION_RULES.find((c) => c.topic === topic);
}

export function getInteractionPattern(category: InteractionCategory): InteractionPattern | undefined {
  return INTERACTION_PATTERNS.find((i) => i.category === category);
}

export function getWritingGuideline(topic: WritingTopic): WritingGuideline | undefined {
  return WRITING_GUIDELINES.find((w) => w.topic === topic);
}

export function getLandingPattern(topic: LandingTopic): LandingPattern | undefined {
  return LANDING_PATTERNS.find((lp) => lp.topic === topic);
}

export function getAntiPatterns(category?: AntiPatternCategory, industry?: IndustryCategory): AntiPattern[] {
  let results = ANTI_PATTERNS;
  if (category) results = results.filter((a) => a.category === category);
  if (industry) results = results.filter((a) => !a.industry || a.industry === industry);
  return results;
}

// ---------------------------------------------------------------------------
// PAGE-TYPE TEMPLATES (section anatomy + component inventory per page type)
// ---------------------------------------------------------------------------

export const PAGE_TYPES = [
  "landing", "dashboard", "auth", "settings", "checkout",
  "blog", "docs", "admin", "profile", "error-page",
  "ai-chat", "pricing", "onboarding",
] as const;
export type PageType = (typeof PAGE_TYPES)[number];

export interface PageSection {
  name: string;
  required: boolean;
  components: string[];
  notes: string;
}

export interface PageTemplate {
  type: PageType;
  description: string;
  layout: string;
  sections: PageSection[];
  cognitiveApply: CognitiveLawName[];
  compositionApply: CompositionTopic[];
  interactionApply: InteractionCategory[];
  writingApply: WritingTopic[];
  keyRules: string[];
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    type: "landing",
    description: "Conversion-focused single page. Every section builds trust toward a CTA.",
    layout: "Full-width sections, max-width content container (1280px), single-column flow",
    sections: [
      { name: "Hero", required: true, components: ["Headline (< 8 words)", "Subheadline", "Primary CTA", "Product screenshot or video", "Trust indicator (logo bar or stat)"], notes: "Value prop comprehensible in 3 seconds. CTA above fold. Bleed 40-80px of next section." },
      { name: "Social Proof (logos)", required: true, components: ["4-6 client logos", "Optional: stat bar ('10,000+ teams')"], notes: "Immediately after hero. DocSend: logos = +260% conversion." },
      { name: "Problem/Solution", required: false, components: ["Problem statement", "Solution framing", "Optional illustration"], notes: "Only if audience is problem-aware or lower (Schwartz framework)." },
      { name: "Features", required: true, components: ["Feature grid (3-4 items)", "Icon + title + description per feature", "Optional: bento grid layout"], notes: "Benefits over features. Each answers 'so what?' from user perspective." },
      { name: "Testimonials", required: true, components: ["Named testimonial with photo/title/company", "Star rating or metric", "Optional: video testimonial (+80% conversion)"], notes: "95% of consumers spot fake testimonials. Use real names." },
      { name: "Pricing", required: false, components: ["3-tier table", "Highlighted recommended plan", "Annual/monthly toggle", "Feature comparison"], notes: "3 tiers with highlighted middle. Show expensive first (anchoring). Annual default +19%." },
      { name: "FAQ", required: false, components: ["Accordion (5-8 items)", "Grouped by theme"], notes: "Addresses objections. Place before final CTA." },
      { name: "Final CTA", required: true, components: ["Repeated hero CTA", "Trust signal", "Guarantee or risk reducer"], notes: "Same CTA as hero. 'No credit card required' = +34% signups." },
      { name: "Footer", required: true, components: ["Navigation links", "Legal (privacy, terms)", "Social links", "Copyright"], notes: "Not a dump. Organized columns. No infinite scroll (kills footer access)." },
    ],
    cognitiveApply: ["von-restorff", "serial-position", "z-pattern", "peak-end"],
    compositionApply: ["fold-rules", "visual-hierarchy", "reading-patterns"],
    interactionApply: ["empty-states", "feedback"],
    writingApply: ["button-labels", "conversion-copy", "headlines"],
    keyRules: [
      "Single primary CTA repeated after each major section",
      "Trust signals within visual proximity of every CTA",
      "Grade 5-7 copy converts 56% better than grade 8-9",
      "Sub-2s page load (each second costs 4.42% conversion)",
      "Mobile: simplified above-fold, sticky CTA bar, max 4 form fields",
    ],
  },
  {
    type: "dashboard",
    description: "Data-forward workspace. Information density without sacrificing readability.",
    layout: "App shell: fixed sidebar (240-280px) + header (56-64px) + scrollable content area",
    sections: [
      { name: "Sidebar Navigation", required: true, components: ["Logo/brand mark", "Primary nav items (5-7 max)", "Workspace switcher", "Collapsed state for mobile", "User avatar + settings at bottom"], notes: "Persistent. Keyboard navigable. Active state clearly indicated." },
      { name: "Header Bar", required: true, components: ["Page title / breadcrumbs", "Search (Cmd+K)", "Notifications", "User menu"], notes: "Fixed/sticky. Height 56-64px. Search is power-user critical." },
      { name: "Metrics Row", required: false, components: ["3-5 KPI cards", "Trend indicator (up/down arrow + %)", "Sparkline or mini chart"], notes: "Miller's Law: max 5-7 metrics visible. Group related metrics." },
      { name: "Primary Content", required: true, components: ["Data table or card grid", "Filters + sort controls", "Pagination or virtual scroll", "Bulk actions toolbar"], notes: "Table: right-align numbers, monospace font, row hover, fixed headers." },
      { name: "Detail Panel", required: false, components: ["Side drawer (not modal)", "Record details", "Edit-in-place or form", "Action buttons"], notes: "Non-destructive viewing. User keeps list context while viewing detail." },
      { name: "Empty States", required: true, components: ["Illustration (optional)", "Headline: what's missing", "Body: what to do next", "Single CTA"], notes: "Every data container needs an empty state. Primary feature adoption vector." },
    ],
    cognitiveApply: ["miller", "hick", "gestalt", "fitts", "doherty"],
    compositionApply: ["grid-theory", "visual-hierarchy"],
    interactionApply: ["navigation", "skeleton-vs-spinner", "progressive-disclosure", "empty-states", "feedback"],
    writingApply: ["headlines", "empty-states-copy", "loading-states"],
    keyRules: [
      "Command palette (Cmd+K) for 50+ feature apps",
      "Keyboard shortcuts for all frequent actions",
      "Skeleton loaders for data panels, not spinners",
      "Right-align quantitative data in monospace font",
      "Compact density: 14px body, 48px section gaps, 20px card padding",
    ],
  },
  {
    type: "auth",
    description: "Login, signup, forgot password. Low friction, high trust. Single-purpose screens.",
    layout: "Centered card (max-width 420px) on page, optional split-screen with brand illustration",
    sections: [
      { name: "Login", required: true, components: ["Email input", "Password input (with show/hide toggle)", "Remember me checkbox", "Submit button ('Sign in')", "Forgot password link", "Social login options (if applicable)", "Sign up link"], notes: "Max 3 fields. Never disable paste on password. Specific button: 'Sign in' not 'Submit'." },
      { name: "Signup", required: true, components: ["Name input", "Email input", "Password input (with strength indicator)", "Terms checkbox", "Submit button ('Create account')", "Sign in link"], notes: "Max 4-5 fields. Real-time password strength (exception to blur-only rule). Guest option if e-commerce." },
      { name: "Forgot Password", required: true, components: ["Email input", "Submit button ('Send reset link')", "Back to sign in link", "Success message"], notes: "Single field. Clear success message: 'Check your email for a reset link.'" },
      { name: "Reset Password", required: true, components: ["New password input", "Confirm password input", "Submit button ('Reset password')"], notes: "Clear requirements shown inline. Redirect to login on success." },
    ],
    cognitiveApply: ["hick", "fitts", "jakobs", "doherty"],
    compositionApply: ["visual-hierarchy", "optical-alignment"],
    interactionApply: ["form-design", "error-recovery", "feedback"],
    writingApply: ["button-labels", "error-messages", "placeholder-text"],
    keyRules: [
      "Never disable paste on password fields",
      "Show/hide password toggle with text label",
      "Validate on blur, real-time only for existing errors",
      "Social login buttons above or below form, clearly separated",
      "Error: 'That email is already registered. Try signing in.' (not 'Invalid')",
    ],
  },
  {
    type: "settings",
    description: "User/account configuration. Grouped sections, progressive disclosure, auto-save where possible.",
    layout: "Sidebar tabs (or top tabs) + content area. Max-width 720px for form content.",
    sections: [
      { name: "Profile", required: true, components: ["Avatar upload", "Name fields", "Email (with verification state)", "Save button"], notes: "Auto-save where possible. Explicit save for sensitive changes." },
      { name: "Account", required: true, components: ["Email change (with re-verification)", "Password change", "Two-factor setup", "Delete account (destructive, bottom)"], notes: "Delete account: red button, bottom of page, maximum distance from other actions." },
      { name: "Preferences", required: false, components: ["Theme toggle (light/dark/system)", "Language selector", "Notification settings", "Density mode"], notes: "Group by category. Max 5 toggles per group (Miller's Law)." },
      { name: "Billing", required: false, components: ["Current plan indicator", "Usage metrics", "Payment method", "Invoice history", "Upgrade/downgrade CTA"], notes: "Clear plan comparison. Billing changes need confirmation dialog." },
    ],
    cognitiveApply: ["miller", "hick", "gestalt"],
    compositionApply: ["visual-hierarchy", "whitespace"],
    interactionApply: ["form-design", "progressive-disclosure", "feedback", "error-recovery"],
    writingApply: ["button-labels", "confirmation-dialogs", "headlines"],
    keyRules: [
      "Group settings into sections of 5 or fewer controls",
      "Destructive actions (delete account) at bottom, red, with typed confirmation",
      "Auto-save for non-sensitive fields, explicit save for sensitive ones",
      "Toast for successful saves, inline for validation errors",
    ],
  },
  {
    type: "checkout",
    description: "Purchase flow. Minimize friction, maximize trust. Every removed field increases conversion.",
    layout: "Two-column: form (left, 60%) + order summary (right, 40%). Single column on mobile.",
    sections: [
      { name: "Cart Summary", required: true, components: ["Line items with images", "Quantities (editable)", "Subtotal, tax, shipping", "Promo code input", "Total (prominent)"], notes: "Sticky on desktop. Always visible on mobile (collapsible)." },
      { name: "Contact Info", required: true, components: ["Email (pre-fill if logged in)", "Phone (only if shipping requires)"], notes: "2 fields max. Guest checkout option mandatory (26% abandon if forced account)." },
      { name: "Shipping", required: false, components: ["Address form (with autocomplete)", "Shipping method selector", "Delivery estimate"], notes: "Address autocomplete reduces fields. Show delivery date, not just method name." },
      { name: "Payment", required: true, components: ["Card number (auto-chunked)", "Expiry + CVV", "Trust badges (SSL, payment icons)", "Billing same-as-shipping checkbox"], notes: "Auto-chunk card number. Trust badges within visual proximity. Stripe-style inline validation." },
      { name: "Review + Submit", required: true, components: ["Order summary", "Edit links per section", "Submit button ('Place order — $X.XX')", "Guarantee/return policy"], notes: "Specific amount on button. Money-back guarantee = +32% sales." },
    ],
    cognitiveApply: ["hick", "fitts", "doherty", "peak-end"],
    compositionApply: ["visual-hierarchy", "reading-patterns"],
    interactionApply: ["form-design", "error-recovery", "feedback"],
    writingApply: ["button-labels", "error-messages", "confirmation-dialogs"],
    keyRules: [
      "7-8 fields optimal, -4-6% per field beyond 8 (Baymard)",
      "Guest checkout always available",
      "Inline validation on blur (+22% completion)",
      "Never clear form on error",
      "Trust signals adjacent to payment CTA",
      "Order confirmation screen = peak moment (invest in it)",
    ],
  },
  {
    type: "blog",
    description: "Content-first reading experience. Typography is 80% of the design.",
    layout: "Manuscript grid: single column, max-width 65ch, generous margins",
    sections: [
      { name: "Article Header", required: true, components: ["Title (H1, display size)", "Author + avatar", "Publish date", "Reading time estimate", "Category/tags"], notes: "Title is the hook. Front-load keywords." },
      { name: "Article Body", required: true, components: ["Prose content (65ch max)", "Subheadings every 200-300 words", "Code blocks (if technical)", "Images with captions", "Pull quotes"], notes: "Line height 1.6-1.75 for reading. Layer-cake pattern: headings = summaries." },
      { name: "Author Bio", required: false, components: ["Avatar", "Name + role", "Short bio", "Social links"], notes: "After article. Builds trust and personal connection." },
      { name: "Related Posts", required: false, components: ["3-4 related articles", "Thumbnail + title + excerpt"], notes: "Keep readers on site. Algorithmic or manual selection." },
    ],
    cognitiveApply: ["f-pattern", "serial-position"],
    compositionApply: ["reading-patterns", "whitespace", "grid-theory"],
    interactionApply: ["navigation", "skeleton-vs-spinner"],
    writingApply: ["headlines", "plain-language"],
    keyRules: [
      "Max prose width: 65ch (non-negotiable)",
      "Body: 18px, line-height 1.6-1.75, weight 400",
      "Headings every 200-300 words (layer-cake pattern)",
      "No full-width text (destroys readability)",
    ],
  },
  {
    type: "docs",
    description: "Technical documentation. Searchable, navigable, code-rich.",
    layout: "Three-panel: sidebar nav (240px) + content (flexible, 65ch prose) + table of contents (200px, optional)",
    sections: [
      { name: "Sidebar Navigation", required: true, components: ["Hierarchical nav tree", "Collapsible sections", "Search (Cmd+K)", "Version selector"], notes: "Persistent. Current page highlighted. Breadcrumbs in content area." },
      { name: "Content", required: true, components: ["Title + description", "Code blocks (with copy button + language label)", "Callout boxes (info/warning/danger)", "API parameter tables", "Step-by-step guides"], notes: "65ch prose width. Code blocks can be wider. Syntax highlighting required." },
      { name: "Table of Contents", required: false, components: ["Auto-generated from H2/H3", "Sticky on scroll", "Active section highlighted"], notes: "Right sidebar. Helps orientation in long docs. Hide on mobile." },
      { name: "Footer Nav", required: true, components: ["Previous/next page links", "Edit on GitHub link", "Last updated date"], notes: "Sequential navigation for tutorial flows." },
    ],
    cognitiveApply: ["jakobs", "f-pattern", "miller"],
    compositionApply: ["reading-patterns", "grid-theory", "whitespace"],
    interactionApply: ["navigation", "progressive-disclosure"],
    writingApply: ["plain-language", "headlines"],
    keyRules: [
      "Every code block must have a copy button",
      "Search is critical — Cmd+K with instant results",
      "Syntax highlighting for all code",
      "Callout boxes for warnings/breaking changes",
    ],
  },
  {
    type: "admin",
    description: "Internal management panel. Maximum information density, power-user first.",
    layout: "App shell: collapsible sidebar + header + dense content grid",
    sections: [
      { name: "Sidebar", required: true, components: ["Nav groups by domain", "Collapsible sections", "Badge counts (pending items)", "Admin indicator"], notes: "Compact density. More items than user-facing nav." },
      { name: "Data Tables", required: true, components: ["Sortable columns", "Bulk actions (checkbox select)", "Inline editing", "Filters + active filter chips", "Export"], notes: "Virtual scrolling for large datasets. Pagination > infinite scroll for tables." },
      { name: "Detail Views", required: true, components: ["Tabbed content", "Activity/audit log", "Status management", "Related records"], notes: "Side drawer preferred over full-page navigation." },
      { name: "System Status", required: false, components: ["Health indicators", "Error logs", "Usage metrics", "Quick actions"], notes: "Dashboard-style overview at admin home." },
    ],
    cognitiveApply: ["miller", "hick", "gestalt", "fitts"],
    compositionApply: ["grid-theory", "visual-hierarchy"],
    interactionApply: ["navigation", "progressive-disclosure", "feedback", "form-design"],
    writingApply: ["headlines", "error-messages", "confirmation-dialogs"],
    keyRules: [
      "Compact density: 14px body, tight spacing throughout",
      "Keyboard shortcuts for all batch operations",
      "Confirmation dialogs for destructive batch actions with count",
      "Audit log for all admin actions",
    ],
  },
  {
    type: "profile",
    description: "User-facing profile page. Public or semi-public representation.",
    layout: "Single column, max-width 720px centered. Header with avatar, content below.",
    sections: [
      { name: "Profile Header", required: true, components: ["Avatar (xl: 64-96px)", "Display name", "Title/role", "Bio (2-3 lines)", "Action buttons (edit/follow/contact)"], notes: "Visual hierarchy: avatar + name are primary. Bio is secondary." },
      { name: "Activity/Content", required: true, components: ["Tab bar (posts/projects/activity)", "Content list with previews", "Load more or pagination"], notes: "Tabs for content types. Default to most relevant tab." },
      { name: "Stats/Meta", required: false, components: ["Contribution metrics", "Joined date", "Links/social"], notes: "Secondary info. Don't compete with primary content." },
    ],
    cognitiveApply: ["serial-position", "gestalt", "von-restorff"],
    compositionApply: ["visual-hierarchy", "whitespace"],
    interactionApply: ["navigation", "empty-states", "skeleton-vs-spinner"],
    writingApply: ["headlines", "empty-states-copy"],
    keyRules: [
      "Avatar at xl size (64-96px) for recognition",
      "Clear edit affordance for own profile",
      "Empty states for zero-content sections",
    ],
  },
  {
    type: "error-page",
    description: "404, 500, and error states. Brand moment, not a dead end.",
    layout: "Centered content, max-width 480px, vertical stack",
    sections: [
      { name: "Error Content", required: true, components: ["Error code or icon", "Clear headline ('Page not found')", "Helpful description", "Primary CTA (go home / go back)", "Search box (optional)", "Popular links (optional)"], notes: "This is a Rams principle: 'thorough down to the last detail.' Error pages are design surfaces." },
    ],
    cognitiveApply: ["peak-end", "jakobs"],
    compositionApply: ["visual-hierarchy", "optical-alignment"],
    interactionApply: ["error-recovery", "empty-states"],
    writingApply: ["error-messages", "button-labels"],
    keyRules: [
      "Never a generic browser error page",
      "Always provide a path forward (home link, search, popular pages)",
      "Match the site's personality — error pages are brand moments",
      "404: friendly and helpful. 500: honest and apologetic.",
    ],
  },
  {
    type: "ai-chat",
    description: "Conversational AI interface. Streaming text, tool indicators, context management.",
    layout: "Full-height: message list (scrollable) + input bar (fixed bottom). Optional sidebar for history.",
    sections: [
      { name: "Message List", required: true, components: ["User message bubbles (right-aligned or distinct bg)", "AI response area (left-aligned, full-width)", "Streaming text with cursor/indicator", "Code blocks with copy + language label", "Tool/function call indicators", "Loading state (typing dots or skeleton)", "Timestamp (on hover or grouped)"], notes: "Streaming text must feel responsive (< 100ms first token). No layout shift during streaming." },
      { name: "Input Bar", required: true, components: ["Multi-line text input (auto-expand)", "Send button", "Attachment button (if applicable)", "Model/mode selector (if applicable)", "Character/token count (if limited)"], notes: "Fixed at bottom. Enter to send, Shift+Enter for newline (convention). Must be in thumb zone on mobile." },
      { name: "Conversation History", required: false, components: ["Sidebar list of past conversations", "Search within history", "New conversation button", "Rename/delete conversation"], notes: "Collapsible sidebar. Most recent first. Clear 'New chat' CTA." },
      { name: "Context Panel", required: false, components: ["Active context/files indicator", "Token usage", "Model info", "Settings quick-access"], notes: "Secondary info. Drawer or collapsible panel." },
    ],
    cognitiveApply: ["doherty", "jakobs", "fitts", "peak-end"],
    compositionApply: ["visual-hierarchy", "reading-patterns"],
    interactionApply: ["micro-interactions", "skeleton-vs-spinner", "feedback", "empty-states", "thumb-zone"],
    writingApply: ["loading-states", "empty-states-copy", "placeholder-text", "error-messages"],
    keyRules: [
      "Streaming text: first token visible < 100ms perceived latency",
      "No layout shift during response streaming",
      "Code blocks: syntax highlighting + copy button always",
      "Tool/function indicators: show what's happening, not just 'thinking...'",
      "Empty state: suggest prompts or show capabilities",
      "Keyboard: Enter to send, Shift+Enter for newline, Escape to stop generation",
      "Do NOT use AI purple (#6366F1) as default — choose intentional brand color",
      "Dark mode should be an option, not forced",
    ],
  },
  {
    type: "pricing",
    description: "Plan comparison and purchase decision. Psychology-driven layout.",
    layout: "Centered, max-width 1080px. Tier cards side-by-side (3 columns desktop, stacked mobile).",
    sections: [
      { name: "Plan Toggle", required: true, components: ["Monthly/Annual toggle", "Savings indicator ('Save 20%' or '2 months free')", "Default to annual"], notes: "Annual default = +19% adoption. Strikethrough anchor = +25-40% commitment." },
      { name: "Tier Cards", required: true, components: ["Plan name", "Price (large, prominent)", "Billing period", "Feature list (checkmarks)", "CTA per tier", "Recommended badge (one tier only)"], notes: "3 tiers. Highlight middle (center-stage effect). Show expensive first (anchoring). Von Restorff: only ONE recommended." },
      { name: "Feature Comparison", required: false, components: ["Full comparison table", "Collapsible on mobile", "Tooltips for complex features"], notes: "Below tier cards. For detail-oriented buyers. Progressive disclosure." },
      { name: "FAQ", required: false, components: ["Billing questions", "Cancellation policy", "Enterprise contact"], notes: "Address objections: 'Can I cancel anytime?' 'Is there a free trial?'" },
      { name: "Enterprise CTA", required: false, components: ["'Contact sales' card", "Custom pricing message", "Book demo CTA"], notes: "For high-value leads who don't fit standard tiers." },
    ],
    cognitiveApply: ["von-restorff", "hick", "serial-position"],
    compositionApply: ["visual-hierarchy", "optical-alignment"],
    interactionApply: ["progressive-disclosure", "feedback"],
    writingApply: ["button-labels", "conversion-copy", "confirmation-dialogs"],
    keyRules: [
      "3 tiers with highlighted middle (ProfitWell 12K SaaS)",
      "Ariely decoy: make premium look obviously better than mid-tier",
      "Annual default with '2 months free' framing",
      "One recommended plan only (Von Restorff)",
      "Specific CTA: 'Start free trial' not 'Get started'",
    ],
  },
  {
    type: "onboarding",
    description: "First-run experience. Time to First Value is the only metric that matters.",
    layout: "Full-screen or modal overlay. Progress indicator. Single-action per step.",
    sections: [
      { name: "Welcome", required: true, components: ["Personalized greeting", "Value proposition (what they'll achieve)", "Get started CTA", "Skip option"], notes: "'Here's what you'll do in 3 minutes' not 'Welcome to [Product]'. User is the hero." },
      { name: "Setup Steps", required: true, components: ["3-5 step checklist", "Progress indicator (numbered or bar)", "One action per step", "Skip option per step"], notes: "3-5 items outperform 8+. Interactive > passive tours. Describe outcomes not tasks." },
      { name: "Aha Moment", required: true, components: ["First meaningful result", "Celebration/success feedback", "Next steps guidance"], notes: "The single most important screen. Peak-End Rule: this IS the peak. Invest in it." },
      { name: "Ongoing Guidance", required: false, components: ["Tooltip hints (max 1-3)", "Help beacon", "Checklist sidebar (dismissable)"], notes: "Tooltips 'trained to be ignored' — cap at 1-3. Never supermodal (full-screen blocking)." },
    ],
    cognitiveApply: ["hick", "peak-end", "doherty", "serial-position"],
    compositionApply: ["visual-hierarchy", "whitespace"],
    interactionApply: ["onboarding", "empty-states", "feedback", "micro-interactions"],
    writingApply: ["onboarding-copy", "button-labels", "empty-states-copy"],
    keyRules: [
      "Track Time to First Value (TTFV) as primary metric",
      "Checklist completion: users 3x more likely to convert paid (Userpilot)",
      "Lead with easy, high-value action (primacy effect)",
      "Put highest-friction step last (recency reduces anxiety)",
      "Never show all features on first login (Hick's Law)",
    ],
  },
];

export function getPageTemplate(type: PageType): PageTemplate | undefined {
  return PAGE_TEMPLATES.find((t) => t.type === type);
}

// ---------------------------------------------------------------------------
// DESIGN PRESETS (complete, code-ready design token configurations)
// ---------------------------------------------------------------------------

export const PRESET_NAMES = [
  "linear", "stripe", "vercel", "apple", "carbon",
  "shadcn", "notion", "supabase", "figma",
] as const;
export type PresetName = (typeof PRESET_NAMES)[number];

export interface DesignPreset {
  name: PresetName;
  displayName: string;
  personality: PersonalityCluster;
  description: string;
  inspiration: string;
  tokens: PresetTokens;
  css: string;
}

export interface PresetTokens {
  colors: {
    brand: { hue: number; description: string };
    neutral: { hue: number; temperature: "warm" | "cool" | "neutral"; chroma: number };
    accent: { hue: number; description: string };
    mode: "light" | "dark";
    darkStrategy: string;
  };
  typography: {
    fontSans: string;
    fontMono: string;
    fontSerif?: string;
    bodySize: string;
    bodyWeight: number;
    headingWeight: number;
    displayWeight: number;
    trackingDisplay: string;
    trackingHeading: string;
    trackingBody: string;
    lineHeightDisplay: number;
    lineHeightBody: number;
    scaleRatio: number;
  };
  spacing: {
    base: string;
    sectionY: string;
    cardPadding: string;
    gridGutter: string;
    contentMax: string;
    density: DensityMode;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    pill: string;
    style: string;
  };
  shadows: {
    style: string;
    tintHue: number;
  };
  motion: {
    fast: string;
    normal: string;
    slow: string;
    easing: string;
    style: string;
  };
}

export const PRESETS: DesignPreset[] = [
  {
    name: "linear",
    displayName: "Linear",
    personality: "premium-precision",
    description: "Opacity-based hierarchy, LCH color, 8px grid, no unnecessary dividers. The engineered precision feel.",
    inspiration: "Linear's 2024 redesign: 98-variable HSL → 3 variables (base, accent, contrast). Karri Saarinen's process: works in opacities of black and white first.",
    tokens: {
      colors: {
        brand: { hue: 265, description: "Indigo-violet — Linear's signature, used with discipline (not as AI-purple default)" },
        neutral: { hue: 260, temperature: "cool", chroma: 0.008 },
        accent: { hue: 265, description: "Same as brand — single-accent system" },
        mode: "light",
        darkStrategy: "Opacity-based borders (oklch(1 0 0 / 8%)), progressively lighter surfaces, text deliberately lighter than typical",
      },
      typography: {
        fontSans: "'Inter', ui-sans-serif, system-ui, sans-serif",
        fontMono: "'JetBrains Mono', ui-monospace, monospace",
        bodySize: "14px",
        bodyWeight: 400,
        headingWeight: 600,
        displayWeight: 600,
        trackingDisplay: "-0.03em",
        trackingHeading: "-0.02em",
        trackingBody: "-0.011em",
        lineHeightDisplay: 1.1,
        lineHeightBody: 1.5,
        scaleRatio: 1.25,
      },
      spacing: {
        base: "8px",
        sectionY: "64px",
        cardPadding: "24px",
        gridGutter: "16px",
        contentMax: "1200px",
        density: "compact",
      },
      radius: { sm: "6px", md: "8px", lg: "10px", pill: "9999px", style: "Sharp, functional" },
      shadows: { style: "Minimal — structure from spacing, not shadows. No unnecessary dividers.", tintHue: 260 },
      motion: { fast: "100ms", normal: "150ms", slow: "200ms", easing: "ease-out", style: "Snappy, precise — every interaction under 200ms" },
    },
    css: snippet("personalities/premium-precision.txt"),
  },
  {
    name: "stripe",
    displayName: "Stripe",
    personality: "premium-precision",
    description: "Weight-300 elegance, CIELAB color with mathematical contrast guarantees, Söhne typeface. Documentation-grade polish.",
    inspiration: "Stripe Engineering: any two palette colors 5+ steps apart guarantee 4.5:1 contrast. Zero use of weight 400 or 700. Söhne (Klim) replaces Helvetica heritage with warmth.",
    tokens: {
      colors: {
        brand: { hue: 265, description: "Signature purple — used deliberately for hero gradients, not as UI default" },
        neutral: { hue: 240, temperature: "cool", chroma: 0.005 },
        accent: { hue: 220, description: "Clean blue for interactive elements" },
        mode: "light",
        darkStrategy: "CIELAB-based — vibrancy maintained during darkening, not muted like HSL",
      },
      typography: {
        fontSans: "'Söhne', 'Inter', ui-sans-serif, system-ui, sans-serif",
        fontMono: "'Söhne Mono', 'JetBrains Mono', ui-monospace, monospace",
        bodySize: "16px",
        bodyWeight: 300,
        headingWeight: 500,
        displayWeight: 500,
        trackingDisplay: "-0.02em",
        trackingHeading: "-0.015em",
        trackingBody: "0em",
        lineHeightDisplay: 1.1,
        lineHeightBody: 1.6,
        scaleRatio: 1.333,
      },
      spacing: {
        base: "8px",
        sectionY: "96px",
        cardPadding: "32px",
        gridGutter: "24px",
        contentMax: "1280px",
        density: "normal",
      },
      radius: { sm: "6px", md: "8px", lg: "12px", pill: "9999px", style: "Subtle, refined" },
      shadows: { style: "Ultra-subtle single layer, warm-tinted", tintHue: 240 },
      motion: { fast: "150ms", normal: "200ms", slow: "300ms", easing: "ease-out", style: "Smooth, considered — motion serves information" },
    },
    css: snippet("personalities/premium-precision.txt"),
  },
  {
    name: "vercel",
    displayName: "Vercel / Geist",
    personality: "premium-precision",
    description: "Aggressive negative tracking, zero chromatic bias, mathematical whitespace. The 'precision technical' aesthetic.",
    inspiration: "Geist: high x-height, short descenders, angular terminals. -0.04em display tracking. Section padding 96-128px. Single accent #0070F3 for interactive only.",
    tokens: {
      colors: {
        brand: { hue: 0, description: "Pure black #000 — no hue, zero chromatic bias" },
        neutral: { hue: 0, temperature: "neutral", chroma: 0 },
        accent: { hue: 220, description: "#0070F3 — links, buttons, active states only. Never as surface." },
        mode: "light",
        darkStrategy: "Pure inversion — #000 bg, #FFF text. 11-step neutral gray. No chromatic bias.",
      },
      typography: {
        fontSans: "'Geist', ui-sans-serif, system-ui, sans-serif",
        fontMono: "'Geist Mono', ui-monospace, monospace",
        bodySize: "16px",
        bodyWeight: 400,
        headingWeight: 600,
        displayWeight: 700,
        trackingDisplay: "-0.04em",
        trackingHeading: "-0.02em",
        trackingBody: "-0.01em",
        lineHeightDisplay: 1.15,
        lineHeightBody: 1.5,
        scaleRatio: 1.333,
      },
      spacing: {
        base: "8px",
        sectionY: "96px",
        cardPadding: "32px",
        gridGutter: "24px",
        contentMax: "1280px",
        density: "normal",
      },
      radius: { sm: "6px", md: "8px", lg: "12px", pill: "9999px", style: "Clean, geometric" },
      shadows: { style: "Minimal — whitespace creates hierarchy, not shadows", tintHue: 0 },
      motion: { fast: "150ms", normal: "200ms", slow: "300ms", easing: "ease-out", style: "Subtle, purposeful" },
    },
    css: snippet("personalities/premium-precision.txt"),
  },
  {
    name: "apple",
    displayName: "Apple HIG",
    personality: "premium-precision",
    description: "Clarity, Deference, Depth. SF Pro with Display/Text split. Spring physics. 44pt touch targets. Translucency for spatial hierarchy.",
    inspiration: "SF Pro Display above 20pt, Text below — letterforms change shape. Dynamic Type 11pt minimum. Spring animations = signifiers.",
    tokens: {
      colors: {
        brand: { hue: 220, description: "System blue — semantic, adapts to light/dark + high contrast automatically" },
        neutral: { hue: 0, temperature: "neutral", chroma: 0 },
        accent: { hue: 220, description: "System blue" },
        mode: "light",
        darkStrategy: "System colors adapt per mode. Vibrancy adjustments. Materials (translucency) communicate depth.",
      },
      typography: {
        fontSans: "-apple-system, BlinkMacSystemFont, 'SF Pro', ui-sans-serif, system-ui, sans-serif",
        fontMono: "'SF Mono', ui-monospace, monospace",
        bodySize: "17px",
        bodyWeight: 400,
        headingWeight: 400,
        displayWeight: 700,
        trackingDisplay: "-0.003em",
        trackingHeading: "0em",
        trackingBody: "0em",
        lineHeightDisplay: 1.1,
        lineHeightBody: 1.47,
        scaleRatio: 1.25,
      },
      spacing: {
        base: "8px",
        sectionY: "80px",
        cardPadding: "20px",
        gridGutter: "16px",
        contentMax: "1024px",
        density: "comfortable",
      },
      radius: { sm: "8px", md: "12px", lg: "16px", pill: "9999px", style: "Rounded, soft — continuous corners" },
      shadows: { style: "Subtle, multi-layer with translucency", tintHue: 0 },
      motion: { fast: "200ms", normal: "300ms", slow: "500ms", easing: "cubic-bezier(0.25, 0.1, 0.25, 1)", style: "Spring physics — mass and damping, not CSS easing. Interruptible." },
    },
    css: snippet("personalities/premium-precision.txt"),
  },
  {
    name: "carbon",
    displayName: "IBM Carbon",
    personality: "enterprise-trust",
    description: "Accessibility-first enterprise system. IBM Plex. Structured blue palette. Every component ships WCAG 2.1 AA. 12px spacing-04 for tight internals.",
    inspiration: "Spacing includes 12px (pure doubling lacks this). Plex: squared terminals = 'reads as IBM'. Focus ring: 3:1 contrast on the ring itself.",
    tokens: {
      colors: {
        brand: { hue: 220, description: "IBM Blue — institutional, structured palette" },
        neutral: { hue: 210, temperature: "cool", chroma: 0.005 },
        accent: { hue: 170, description: "Teal for secondary accent" },
        mode: "light",
        darkStrategy: "Gray 100 (#161616) base. Every token pair contrast-checked. Elevation via lighter grays.",
      },
      typography: {
        fontSans: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
        fontMono: "'IBM Plex Mono', ui-monospace, monospace",
        fontSerif: "'IBM Plex Serif', ui-serif, serif",
        bodySize: "14px",
        bodyWeight: 400,
        headingWeight: 600,
        displayWeight: 300,
        trackingDisplay: "0em",
        trackingHeading: "0em",
        trackingBody: "0em",
        lineHeightDisplay: 1.25,
        lineHeightBody: 1.5,
        scaleRatio: 1.25,
      },
      spacing: {
        base: "8px",
        sectionY: "64px",
        cardPadding: "24px",
        gridGutter: "32px",
        contentMax: "1280px",
        density: "normal",
      },
      radius: { sm: "0px", md: "0px", lg: "0px", pill: "9999px", style: "Zero radius — sharp, institutional. Only pills for tags/badges." },
      shadows: { style: "Structured elevation levels, consistent depth", tintHue: 210 },
      motion: { fast: "70ms", normal: "150ms", slow: "240ms", easing: "cubic-bezier(0.2, 0, 0.38, 0.9)", style: "Productive motion — fast, purposeful, no personality" },
    },
    css: snippet("personalities/enterprise-trust.txt"),
  },
  {
    name: "shadcn",
    displayName: "shadcn/ui",
    personality: "premium-precision",
    description: "OKLCH tokens, Radix primitives, opacity-based dark borders (10% white overlay). The modern default for React + Tailwind.",
    inspiration: "2024 OKLCH migration. Dark borders: oklch(1 0 0 / 10%) adapts to any background. Destructive is only token with chroma. Brand-agnostic by construction.",
    tokens: {
      colors: {
        brand: { hue: 0, description: "Achromatic default — your brand color goes here" },
        neutral: { hue: 0, temperature: "neutral", chroma: 0 },
        accent: { hue: 0, description: "Achromatic — customize per project" },
        mode: "light",
        darkStrategy: "Background oklch(0.145 0 0). Borders: oklch(1 0 0 / 10%). Input: oklch(1 0 0 / 15%). Percentage-white, not fixed gray.",
      },
      typography: {
        fontSans: "ui-sans-serif, system-ui, sans-serif",
        fontMono: "ui-monospace, monospace",
        bodySize: "14px",
        bodyWeight: 400,
        headingWeight: 600,
        displayWeight: 700,
        trackingDisplay: "-0.02em",
        trackingHeading: "-0.01em",
        trackingBody: "0em",
        lineHeightDisplay: 1.1,
        lineHeightBody: 1.5,
        scaleRatio: 1.25,
      },
      spacing: {
        base: "4px",
        sectionY: "64px",
        cardPadding: "24px",
        gridGutter: "16px",
        contentMax: "1280px",
        density: "normal",
      },
      radius: { sm: "6px", md: "8px", lg: "12px", pill: "9999px", style: "Moderate, Tailwind-aligned" },
      shadows: { style: "Subtle, achromatic", tintHue: 0 },
      motion: { fast: "150ms", normal: "200ms", slow: "300ms", easing: "ease-out", style: "Standard, unobtrusive" },
    },
    css: snippet("systems/shadcn-radix.txt"),
  },
  {
    name: "notion",
    displayName: "Notion",
    personality: "warm-editorial",
    description: "Warm minimalism, cream backgrounds, serif headings. The editor disappears — content takes center stage. Premium notebook feel.",
    inspiration: "Background: warm cream (#FAF8F5). The 0.012 chroma at hue 78 transforms 'cold SaaS' into 'premium notebook.' Rounded-xl elements feel approachable.",
    tokens: {
      colors: {
        brand: { hue: 0, description: "Achromatic — Notion's identity is in warmth and typography, not brand color" },
        neutral: { hue: 78, temperature: "warm", chroma: 0.012 },
        accent: { hue: 220, description: "Subtle blue for links and interactive elements" },
        mode: "light",
        darkStrategy: "Warm charcoal base (not cold). Maintains the notebook feel in dark. Off-white text, not pure white.",
      },
      typography: {
        fontSans: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
        fontMono: "'JetBrains Mono', ui-monospace, monospace",
        fontSerif: "'Lora', 'Georgia', ui-serif, serif",
        bodySize: "16px",
        bodyWeight: 400,
        headingWeight: 700,
        displayWeight: 700,
        trackingDisplay: "-0.01em",
        trackingHeading: "-0.01em",
        trackingBody: "0em",
        lineHeightDisplay: 1.2,
        lineHeightBody: 1.6,
        scaleRatio: 1.25,
      },
      spacing: {
        base: "4px",
        sectionY: "48px",
        cardPadding: "16px",
        gridGutter: "12px",
        contentMax: "900px",
        density: "comfortable",
      },
      radius: { sm: "4px", md: "6px", lg: "8px", pill: "9999px", style: "Subtle, not too rounded — content-first" },
      shadows: { style: "Very subtle, warm-tinted — the editor should feel flat", tintHue: 56 },
      motion: { fast: "150ms", normal: "200ms", slow: "300ms", easing: "ease-in-out", style: "Gentle, considered — the editor never draws attention to itself" },
    },
    css: snippet("personalities/warm-editorial.txt"),
  },
  {
    name: "supabase",
    displayName: "Supabase",
    personality: "technical-developer",
    description: "Dark emerald on near-black. Code-first — SQL editor is the hero. Documentation density rivals the product.",
    inspiration: "Emerald accent on dark surfaces. Code examples are first-class content. Dashboard is a developer workspace, not an admin panel.",
    tokens: {
      colors: {
        brand: { hue: 160, description: "Emerald green — references terminal conventions, signals 'developer-native'" },
        neutral: { hue: 260, temperature: "cool", chroma: 0.008 },
        accent: { hue: 160, description: "Same emerald — single-accent discipline" },
        mode: "dark",
        darkStrategy: "Near-black base (oklch 0.10). Emerald glow on accent elements. Surface elevation via lighter steps.",
      },
      typography: {
        fontSans: "'Inter', ui-sans-serif, system-ui, sans-serif",
        fontMono: "'Source Code Pro', 'JetBrains Mono', ui-monospace, monospace",
        bodySize: "14px",
        bodyWeight: 400,
        headingWeight: 600,
        displayWeight: 700,
        trackingDisplay: "-0.02em",
        trackingHeading: "-0.01em",
        trackingBody: "0em",
        lineHeightDisplay: 1.15,
        lineHeightBody: 1.5,
        scaleRatio: 1.25,
      },
      spacing: {
        base: "4px",
        sectionY: "48px",
        cardPadding: "20px",
        gridGutter: "16px",
        contentMax: "1200px",
        density: "compact",
      },
      radius: { sm: "4px", md: "6px", lg: "8px", pill: "9999px", style: "Functional, compact" },
      shadows: { style: "Glow on emerald accents (0 0 20px oklch(0.65 0.18 160 / 0.15)). No box-shadows.", tintHue: 160 },
      motion: { fast: "100ms", normal: "150ms", slow: "200ms", easing: "ease-out", style: "Fast, snappy — developers notice 50ms lag" },
    },
    css: snippet("personalities/technical-developer.txt"),
  },
  {
    name: "figma",
    displayName: "Figma",
    personality: "bold-energetic",
    description: "Multi-color vivid palette. Each feature gets its own color. Playful yet professional. The design tool that looks designed.",
    inspiration: "Multi-color palette — each feature is a color. Vibrant yet balanced through careful chroma control. Spring animations for playful feedback.",
    tokens: {
      colors: {
        brand: { hue: 265, description: "Vivid blue-violet — primary brand" },
        neutral: { hue: 240, temperature: "cool", chroma: 0.005 },
        accent: { hue: 330, description: "Vivid pink as secondary — multi-color system" },
        mode: "light",
        darkStrategy: "Rich dark with maintained vibrancy. Colors don't mute — they pop against dark surfaces.",
      },
      typography: {
        fontSans: "'Inter', ui-sans-serif, system-ui, sans-serif",
        fontMono: "'Roboto Mono', ui-monospace, monospace",
        bodySize: "14px",
        bodyWeight: 400,
        headingWeight: 700,
        displayWeight: 800,
        trackingDisplay: "-0.03em",
        trackingHeading: "-0.02em",
        trackingBody: "0em",
        lineHeightDisplay: 1.1,
        lineHeightBody: 1.5,
        scaleRatio: 1.333,
      },
      spacing: {
        base: "8px",
        sectionY: "80px",
        cardPadding: "28px",
        gridGutter: "24px",
        contentMax: "1280px",
        density: "normal",
      },
      radius: { sm: "8px", md: "12px", lg: "16px", pill: "9999px", style: "Confident, rounded" },
      shadows: { style: "Medium depth, colored shadows on brand elements", tintHue: 265 },
      motion: { fast: "150ms", normal: "250ms", slow: "350ms", easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", style: "Spring animations — playful, bouncy, responsive" },
    },
    css: snippet("personalities/bold-energetic.txt"),
  },
];

export function getPreset(name: PresetName): DesignPreset | undefined {
  return PRESETS.find((p) => p.name === name);
}

// ---------------------------------------------------------------------------
// FONT PAIRINGS (curated, Google Fonts compatible)
// ---------------------------------------------------------------------------

export const FONT_MOODS = [
  "technical", "elegant", "friendly", "editorial", "bold",
  "corporate", "playful", "luxury", "startup", "minimal",
] as const;
export type FontMood = (typeof FONT_MOODS)[number];

export interface FontPairing {
  name: string;
  heading: string;
  headingWeight: string;
  body: string;
  bodyWeight: string;
  mono: string;
  mood: FontMood;
  personality: PersonalityCluster;
  industries: string[];
  trackingHeading: string;
  trackingBody: string;
  lineHeightBody: number;
  googleImport: string;
  why: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
  // TECHNICAL
  {
    name: "Geist System",
    heading: "Geist", headingWeight: "600-700",
    body: "Geist", bodyWeight: "400",
    mono: "Geist Mono",
    mood: "technical", personality: "premium-precision",
    industries: ["developer-tool", "saas", "analytics", "ai-chatbot"],
    trackingHeading: "-0.04em", trackingBody: "-0.01em", lineHeightBody: 1.5,
    googleImport: "/* Geist: install via npm (vercel/geist-font), not Google Fonts */",
    why: "Vercel's signature. Angular terminals, high x-height, short descenders. The tightest tracking (-0.04em display) of any system font. Reads as 'engineered'.",
  },
  {
    name: "Inter + JetBrains Mono",
    heading: "Inter", headingWeight: "600-700",
    body: "Inter", bodyWeight: "400",
    mono: "JetBrains Mono",
    mood: "technical", personality: "premium-precision",
    industries: ["saas", "analytics", "developer-tool", "ai-chatbot"],
    trackingHeading: "-0.02em", trackingBody: "0em", lineHeightBody: 1.5,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');",
    why: "The universal SaaS pairing. Inter at -0.02em tracking achieves Linear's feel. JetBrains Mono for code/data values. Safe default when no strong brand direction.",
  },
  {
    name: "DM Sans + DM Mono",
    heading: "DM Sans", headingWeight: "500-700",
    body: "DM Sans", bodyWeight: "400",
    mono: "DM Mono",
    mood: "technical", personality: "premium-precision",
    industries: ["saas", "analytics", "developer-tool"],
    trackingHeading: "-0.02em", trackingBody: "0em", lineHeightBody: 1.5,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');",
    why: "Geometric but warmer than Inter. Same family for sans and mono = visual coherence. Slightly more character than Inter without being opinionated.",
  },
  {
    name: "IBM Plex Sans + Plex Mono",
    heading: "IBM Plex Sans", headingWeight: "600",
    body: "IBM Plex Sans", bodyWeight: "400",
    mono: "IBM Plex Mono",
    mood: "corporate", personality: "enterprise-trust",
    industries: ["b2b-service", "fintech", "government", "healthcare"],
    trackingHeading: "0em", trackingBody: "0em", lineHeightBody: 1.5,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');",
    why: "Squared terminals distinguish from Helvetica/Arial — reads as 'IBM'. Sans + Serif + Mono in same family. Carbon Design System default. Enterprise trust through typography.",
  },
  {
    name: "Source Sans 3 + Source Code Pro",
    heading: "Source Sans 3", headingWeight: "600-700",
    body: "Source Sans 3", bodyWeight: "400",
    mono: "Source Code Pro",
    mood: "corporate", personality: "enterprise-trust",
    industries: ["b2b-service", "government", "education", "healthcare"],
    trackingHeading: "-0.01em", trackingBody: "0em", lineHeightBody: 1.5,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Code+Pro:wght@400;500&display=swap');",
    why: "Adobe's open-source workhorse. Excellent legibility at small sizes (open apertures). Professional without personality — lets content speak.",
  },

  // ELEGANT / LUXURY
  {
    name: "Cormorant Garamond + Montserrat",
    heading: "Cormorant Garamond", headingWeight: "300-600",
    body: "Montserrat", bodyWeight: "400",
    mono: "JetBrains Mono",
    mood: "elegant", personality: "warm-editorial",
    industries: ["ecommerce-luxury", "portfolio", "wellness"],
    trackingHeading: "-0.01em", trackingBody: "0em", lineHeightBody: 1.6,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@400;500;600&display=swap');",
    why: "Cormorant at weight 300 = editorial luxury. High-contrast serif with dramatic thin strokes. Montserrat provides clean geometric counterpoint for body/UI.",
  },
  {
    name: "Playfair Display + Lato",
    heading: "Playfair Display", headingWeight: "400-700",
    body: "Lato", bodyWeight: "400",
    mono: "Fira Code",
    mood: "elegant", personality: "warm-editorial",
    industries: ["ecommerce-luxury", "wellness", "creative-agency"],
    trackingHeading: "-0.02em", trackingBody: "0em", lineHeightBody: 1.6,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap');",
    why: "Playfair's high contrast and ball terminals = classic luxury. Lato's humanist warmth balances the formality. Strong serif/sans contrast.",
  },
  {
    name: "Fraunces + Inter",
    heading: "Fraunces", headingWeight: "400-700",
    body: "Inter", bodyWeight: "400",
    mono: "JetBrains Mono",
    mood: "elegant", personality: "warm-editorial",
    industries: ["ecommerce-luxury", "wellness", "creative-agency", "portfolio"],
    trackingHeading: "-0.01em", trackingBody: "0em", lineHeightBody: 1.6,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');",
    why: "Variable font with WONK and SOFT axes — adjustable quirky/serious feel. Old-style serif that feels modern. Inter body keeps UI clean.",
  },

  // FRIENDLY / CONSUMER
  {
    name: "Plus Jakarta Sans + Jakarta Mono",
    heading: "Plus Jakarta Sans", headingWeight: "600-800",
    body: "Plus Jakarta Sans", bodyWeight: "400-500",
    mono: "JetBrains Mono",
    mood: "friendly", personality: "warm-editorial",
    industries: ["saas", "education", "wellness", "mental-health"],
    trackingHeading: "-0.02em", trackingBody: "0em", lineHeightBody: 1.6,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');",
    why: "Modern geometric humanist. Rounded terminals feel approachable without being childish. Works from weight 400 (body) to 800 (display) — broad range in one family.",
  },
  {
    name: "Nunito + Nunito Sans",
    heading: "Nunito", headingWeight: "700-800",
    body: "Nunito Sans", bodyWeight: "400",
    mono: "Fira Code",
    mood: "friendly", personality: "warm-editorial",
    industries: ["education", "wellness", "mental-health"],
    trackingHeading: "-0.01em", trackingBody: "0em", lineHeightBody: 1.6,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=Nunito+Sans:wght@400;600&display=swap');",
    why: "Rounded terminals on Nunito = friendly, non-threatening. Nunito Sans for body = same DNA but more readable at small sizes. Perfect for education and wellness.",
  },
  {
    name: "Poppins + Inter",
    heading: "Poppins", headingWeight: "600-700",
    body: "Inter", bodyWeight: "400",
    mono: "Fira Code",
    mood: "friendly", personality: "bold-energetic",
    industries: ["saas", "education", "creative-agency"],
    trackingHeading: "-0.02em", trackingBody: "0em", lineHeightBody: 1.5,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');",
    why: "Geometric with personality. Poppins is bolder and more distinctive than Inter for headings. Widely recognized from Stripe's early days and modern SaaS.",
  },

  // EDITORIAL / CONTENT
  {
    name: "Lora + Source Sans 3",
    heading: "Lora", headingWeight: "400-700",
    body: "Source Sans 3", bodyWeight: "400",
    mono: "Source Code Pro",
    mood: "editorial", personality: "warm-editorial",
    industries: ["portfolio", "wellness", "education"],
    trackingHeading: "0em", trackingBody: "0em", lineHeightBody: 1.75,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Source+Sans+3:wght@400;600&display=swap');",
    why: "Lora is a well-balanced, contemporary serif. Great for body text reading (unusual for serif). Source Sans body for UI elements. Classic trust pairing.",
  },
  {
    name: "Merriweather + Open Sans",
    heading: "Merriweather", headingWeight: "700-900",
    body: "Open Sans", bodyWeight: "400",
    mono: "Fira Code",
    mood: "editorial", personality: "enterprise-trust",
    industries: ["government", "education", "b2b-service"],
    trackingHeading: "0em", trackingBody: "0em", lineHeightBody: 1.6,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@700;900&family=Open+Sans:wght@400;600&display=swap');",
    why: "Merriweather was designed for screen reading — thick strokes, open counters. Open Sans is the most neutral body companion. Institutional without being cold.",
  },
  {
    name: "Newsreader + Inter",
    heading: "Newsreader", headingWeight: "400-700",
    body: "Inter", bodyWeight: "400",
    mono: "JetBrains Mono",
    mood: "editorial", personality: "warm-editorial",
    industries: ["portfolio", "creative-agency"],
    trackingHeading: "-0.01em", trackingBody: "0em", lineHeightBody: 1.6,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');",
    why: "Production-quality news serif with optical sizes. Variable font with opsz axis — automatically adjusts at different sizes. Modern editorial.",
  },

  // BOLD / STARTUP
  {
    name: "Space Grotesk + Space Mono",
    heading: "Space Grotesk", headingWeight: "500-700",
    body: "Space Grotesk", bodyWeight: "400",
    mono: "Space Mono",
    mood: "bold", personality: "bold-energetic",
    industries: ["creative-agency", "gaming", "portfolio"],
    trackingHeading: "-0.03em", trackingBody: "-0.01em", lineHeightBody: 1.5,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');",
    why: "Quirky geometric sans with character. Slightly unusual letterforms (tail on 'l', sharp 'y'). Same family mono. Reads as 'startup with opinions'.",
  },
  {
    name: "Sora + Inter",
    heading: "Sora", headingWeight: "600-800",
    body: "Inter", bodyWeight: "400",
    mono: "JetBrains Mono",
    mood: "startup", personality: "bold-energetic",
    industries: ["saas", "creative-agency", "ai-chatbot"],
    trackingHeading: "-0.02em", trackingBody: "0em", lineHeightBody: 1.5,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');",
    why: "Geometric with squared proportions — modern and bold. Looks great at large display sizes. Inter body keeps readability. Modern startup feel.",
  },
  {
    name: "Clash Display + Satoshi",
    heading: "Clash Display", headingWeight: "500-700",
    body: "Satoshi", bodyWeight: "400-500",
    mono: "JetBrains Mono",
    mood: "bold", personality: "bold-energetic",
    industries: ["creative-agency", "portfolio", "gaming"],
    trackingHeading: "-0.03em", trackingBody: "0em", lineHeightBody: 1.5,
    googleImport: "/* Clash Display + Satoshi: available from fontshare.com (free for commercial use) */",
    why: "Clash Display's sharp angles and high contrast = maximum impact. Satoshi is the modern neutral — similar to Inter but with more character. Designer-favorite pairing.",
  },

  // MINIMAL
  {
    name: "Outfit + JetBrains Mono",
    heading: "Outfit", headingWeight: "500-700",
    body: "Outfit", bodyWeight: "400",
    mono: "JetBrains Mono",
    mood: "minimal", personality: "premium-precision",
    industries: ["saas", "portfolio", "creative-agency"],
    trackingHeading: "-0.02em", trackingBody: "0em", lineHeightBody: 1.5,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');",
    why: "Geometric sans with consistent stroke width. Minimal, clean, modern. Variable font — smooth weight transitions. Less common than Inter = more distinctive.",
  },
  {
    name: "Manrope + Fira Code",
    heading: "Manrope", headingWeight: "600-800",
    body: "Manrope", bodyWeight: "400",
    mono: "Fira Code",
    mood: "minimal", personality: "premium-precision",
    industries: ["saas", "developer-tool", "analytics"],
    trackingHeading: "-0.02em", trackingBody: "0em", lineHeightBody: 1.5,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');",
    why: "Semi-condensed geometric with subtle humanist touches. Distinctive 'g' and 'a'. More interesting than Inter at headings without being loud. Technical but warm.",
  },

  // PLAYFUL
  {
    name: "Quicksand + Nunito Sans",
    heading: "Quicksand", headingWeight: "600-700",
    body: "Nunito Sans", bodyWeight: "400",
    mono: "Fira Code",
    mood: "playful", personality: "bold-energetic",
    industries: ["education", "wellness", "mental-health"],
    trackingHeading: "-0.01em", trackingBody: "0em", lineHeightBody: 1.6,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Nunito+Sans:wght@400;600&display=swap');",
    why: "Rounded geometric — maximum friendliness. Perfect for children's education, wellness, mental health. Nunito Sans body maintains readability. Never for enterprise.",
  },
  {
    name: "Fredoka + DM Sans",
    heading: "Fredoka", headingWeight: "500-700",
    body: "DM Sans", bodyWeight: "400",
    mono: "DM Mono",
    mood: "playful", personality: "bold-energetic",
    industries: ["education"],
    trackingHeading: "0em", trackingBody: "0em", lineHeightBody: 1.6,
    googleImport: "@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');",
    why: "Soft, bubbly, child-friendly. Variable font with WDTH axis. DM Sans body keeps things readable. Only for education/children — never professional contexts.",
  },
];

export function getFontPairings(mood?: FontMood, industry?: IndustryCategory): FontPairing[] {
  let results = FONT_PAIRINGS;
  if (mood) results = results.filter((f) => f.mood === mood);
  if (industry) results = results.filter((f) => f.industries.includes(industry));
  return results;
}

export function getFontPairingByName(name: string): FontPairing | undefined {
  return FONT_PAIRINGS.find((f) => f.name.toLowerCase() === name.toLowerCase());
}
