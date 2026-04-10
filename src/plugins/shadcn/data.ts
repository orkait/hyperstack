import { snippet } from "./loader.js";

// ---------------------------------------------------------------------------
// SHADCN COMPONENTS (Base UI Edition — curated reference)
// ---------------------------------------------------------------------------
//
// This plugin provides REFERENCE knowledge for shadcn/ui (Base UI variant).
// Components are bundled as static data so the plugin works independently of
// the user's project. For live reading of a user's actual shadcn components,
// use their filesystem directly — this plugin describes the canonical patterns.

export const COMPONENT_CATEGORIES = [
  "button", "input", "card", "dialog", "dropdown", "tabs",
  "table", "form", "navigation", "feedback", "overlay", "data-display",
] as const;
export type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number];

export interface ShadcnComponent {
  name: string;
  category: ComponentCategory;
  description: string;
  basePrimitive: string;
  dataSlots: string[];
  variants?: string[];
  sizes?: string[];
  requiresUseClient: boolean;
  usageSnippet: string;
  pairsWith: string[];
}

export const SHADCN_COMPONENTS: ShadcnComponent[] = [
  {
    name: "Button",
    category: "button",
    description: "Interactive button with variant + size support. Uses CVA for variant composition.",
    basePrimitive: "native <button> element",
    dataSlots: ["button"],
    variants: ["default", "outline", "secondary", "ghost", "destructive", "link"],
    sizes: ["sm", "md", "lg", "icon"],
    requiresUseClient: false,
    usageSnippet: snippet("button.Usage.txt"),
    pairsWith: ["Dialog", "Form", "DropdownMenu"],
  },
  {
    name: "Dialog",
    category: "dialog",
    description: "Modal dialog with backdrop and portal. Uses @base-ui/react Dialog primitive.",
    basePrimitive: "@base-ui/react/dialog",
    dataSlots: ["dialog-overlay", "dialog-content", "dialog-header", "dialog-title", "dialog-description", "dialog-footer"],
    variants: [],
    sizes: [],
    requiresUseClient: true,
    usageSnippet: snippet("dialog.Usage.txt"),
    pairsWith: ["Button", "Form", "Select"],
  },
  {
    name: "Field",
    category: "form",
    description: "Form field wrapper with label, description, error. Uses @container for responsive layout.",
    basePrimitive: "@base-ui/react/field",
    dataSlots: ["field", "field-label", "field-control", "field-description", "field-error"],
    variants: ["vertical", "horizontal"],
    sizes: [],
    requiresUseClient: false,
    usageSnippet: snippet("field.Usage.txt"),
    pairsWith: ["Input", "Select", "Textarea", "Checkbox"],
  },
  {
    name: "Select",
    category: "dropdown",
    description: "Accessible select with search and keyboard nav. Uses @base-ui/react Select.",
    basePrimitive: "@base-ui/react/select",
    dataSlots: ["select-trigger", "select-value", "select-content", "select-item", "select-icon"],
    variants: [],
    sizes: ["sm", "md", "lg"],
    requiresUseClient: true,
    usageSnippet: snippet("select.Usage.txt"),
    pairsWith: ["Field", "Form"],
  },
];

// ---------------------------------------------------------------------------
// ARCHITECTURAL RULES
// ---------------------------------------------------------------------------

export const SHADCN_RULES = {
  primitives: "@base-ui/react (not @radix-ui)",
  styling: "Tailwind CSS v4 with OKLCH color tokens",
  coreSelectors: "data-slot attributes on all sub-components",
  responsive: "Container queries (@container) over viewport queries",
  naming: "PascalCase root + sub-components (Dialog, DialogHeader, DialogFooter)",
  utilities: ["cn from @repo/ui-utils", "cva from class-variance-authority"],
  animation: "data-state modifiers (data-open, data-closed)",
  clientDirective: "'use client' for components with state/effects/browser APIs",
};

export const ARCHITECTURAL_CHECKLIST = [
  "Uses @base-ui/react primitive (not @radix-ui/react-*)",
  "Every rendered element has data-slot attribute",
  "cva used for variants (size, variant props)",
  "cn used for all className merging",
  "'use client' directive on stateful components",
  "Props spread (...props) to underlying primitive",
  "Sub-components exported for composition",
  "No Radix imports — migrated to Base UI",
  "OKLCH color tokens from design system, not hardcoded hex",
  "Tailwind v4 native CSS variables for positioning/sizing",
];

// ---------------------------------------------------------------------------
// COMPONENT COMPOSITION — which components to combine for a page type
// This is the bridge between designer's page templates and shadcn primitives.
// ---------------------------------------------------------------------------

export const PAGE_TYPE_NAMES = [
  "landing", "dashboard", "auth", "settings", "checkout",
  "blog", "docs", "admin", "profile", "pricing", "onboarding", "ai-chat",
] as const;
export type ShadcnPageType = (typeof PAGE_TYPE_NAMES)[number];

export interface PageComposition {
  type: ShadcnPageType;
  description: string;
  sections: Array<{
    name: string;
    components: string[];
    rationale: string;
  }>;
}

export const PAGE_COMPOSITIONS: PageComposition[] = [
  {
    type: "landing",
    description: "Marketing landing page with hero, features, social proof, pricing, CTA",
    sections: [
      { name: "Hero", components: ["Button (primary CTA)", "Button (secondary CTA)"], rationale: "Single primary CTA per Von Restorff. Secondary for low-commitment action." },
      { name: "Features grid", components: ["Card", "Card (interactive variant)"], rationale: "Card grid for scannable features. Interactive variant if each feature links out." },
      { name: "Social proof", components: ["Avatar", "Card"], rationale: "Testimonial cards with avatar + quote. Named attribution beats anonymous." },
      { name: "Pricing", components: ["Tabs (monthly/annual toggle)", "Card (3 tiers)", "Button (tier CTAs)"], rationale: "3 tiers with highlighted middle. Annual default." },
      { name: "FAQ", components: ["Accordion"], rationale: "Accordion for progressive disclosure of objections." },
      { name: "Final CTA", components: ["Button"], rationale: "Repeat hero CTA after trust signals." },
    ],
  },
  {
    type: "dashboard",
    description: "App shell with sidebar, header, and data panels",
    sections: [
      { name: "Sidebar nav", components: ["NavigationMenu", "Tooltip (collapsed state)"], rationale: "Persistent primary nav. Tooltip for collapsed-rail icons." },
      { name: "Top bar", components: ["DropdownMenu (user)", "Command (Cmd+K)", "Avatar", "Badge (notifications)"], rationale: "Command palette as power-user nav. User menu via DropdownMenu." },
      { name: "KPI row", components: ["Card (metric)", "Skeleton (loading)"], rationale: "Card grid for metrics. Skeleton loaders during fetch." },
      { name: "Data table", components: ["Table", "Input (search)", "Select (filter)", "Pagination", "Checkbox (multi-select)"], rationale: "Standard table with sort/filter/search/bulk. Pagination > infinite scroll." },
      { name: "Detail drawer", components: ["Sheet", "Tabs", "Form"], rationale: "Side drawer keeps list context. Tabs organize detail sections." },
      { name: "Empty states", components: ["Card", "Button (CTA)"], rationale: "Every empty state gets a single CTA — primary vector for feature adoption." },
    ],
  },
  {
    type: "auth",
    description: "Login, signup, forgot password flows",
    sections: [
      { name: "Login form", components: ["Card", "Field", "Input (email)", "Input (password)", "Checkbox (remember me)", "Button (submit)"], rationale: "Max 3 fields. Never disable paste. Show/hide password toggle." },
      { name: "Signup form", components: ["Card", "Field", "Input (name/email/password)", "Checkbox (terms)", "Button (create)"], rationale: "Max 4-5 fields. Real-time password strength (exception to blur-only validation)." },
      { name: "Forgot password", components: ["Card", "Field", "Input (email)", "Button", "Alert (success)"], rationale: "Single field. Clear success confirmation." },
    ],
  },
  {
    type: "settings",
    description: "User/account configuration with tabs or sidebar",
    sections: [
      { name: "Navigation", components: ["Tabs", "NavigationMenu"], rationale: "Tabs for < 5 sections, sidebar nav for more." },
      { name: "Profile form", components: ["Field", "Input", "Textarea", "Button (save)"], rationale: "Auto-save where possible. Explicit save for sensitive changes." },
      { name: "Preferences", components: ["Switch (toggles)", "Select", "RadioGroup"], rationale: "Switch for binary, Select for lists, Radio for exclusive choices." },
      { name: "Danger zone", components: ["Card (destructive)", "AlertDialog", "Button (destructive)"], rationale: "Destructive actions at bottom, red button, typed confirmation via AlertDialog." },
    ],
  },
  {
    type: "checkout",
    description: "Purchase flow — minimize friction, maximize trust",
    sections: [
      { name: "Cart summary", components: ["Card", "Table (line items)", "Input (quantity)", "Input (promo code)"], rationale: "Sticky on desktop, collapsible on mobile. Always visible total." },
      { name: "Contact info", components: ["Field", "Input (email)", "Input (phone)"], rationale: "Max 2 fields. Guest checkout mandatory (26% abandon if forced account)." },
      { name: "Address", components: ["Field", "Input (autocomplete)", "Select (country)"], rationale: "Address autocomplete reduces fields." },
      { name: "Payment", components: ["Field", "Input (card)", "Badge (trust signals)"], rationale: "Auto-chunk card number. Trust badges adjacent to payment CTA." },
      { name: "Submit", components: ["Button (specific amount)", "Card (guarantee)"], rationale: "'Place order — $X.XX' specific. Money-back guarantee +32% sales." },
    ],
  },
  {
    type: "ai-chat",
    description: "Conversational AI with streaming text + tool indicators",
    sections: [
      { name: "Message list", components: ["ScrollArea", "Card (message)", "Skeleton (typing)"], rationale: "Streaming text must feel responsive. No layout shift during stream." },
      { name: "Code blocks", components: ["Card", "Button (copy)", "Badge (language)"], rationale: "Syntax highlighting + copy button always." },
      { name: "Input bar", components: ["Textarea (auto-expand)", "Button (send)", "Button (attach)", "Select (model)"], rationale: "Fixed at bottom. Enter to send, Shift+Enter for newline." },
      { name: "History sidebar", components: ["NavigationMenu", "Input (search)", "Button (new chat)"], rationale: "Collapsible. Most recent first." },
    ],
  },
  {
    type: "pricing",
    description: "Plan comparison with psychology-driven layout",
    sections: [
      { name: "Toggle", components: ["Tabs (monthly/annual)", "Badge (savings)"], rationale: "Default to annual. '2 months free' framing." },
      { name: "Tier cards", components: ["Card (3 tiers)", "Badge (recommended)", "Button (per tier)"], rationale: "3 tiers, highlight middle. Expensive first (anchoring)." },
      { name: "Comparison table", components: ["Table", "Checkbox (icon)"], rationale: "Full feature comparison for detail-oriented buyers." },
      { name: "Enterprise CTA", components: ["Card", "Button (contact sales)"], rationale: "For high-value leads who don't fit standard tiers." },
    ],
  },
  {
    type: "docs",
    description: "Technical documentation with sidebar nav + code blocks",
    sections: [
      { name: "Sidebar nav", components: ["NavigationMenu", "Input (search)", "Command (Cmd+K)"], rationale: "Hierarchical nav. Command palette for jump-to-page." },
      { name: "Content", components: ["Card (callout)", "Button (copy)", "Badge (version)"], rationale: "Callouts for info/warning. Copy button on every code block." },
      { name: "TOC", components: ["NavigationMenu (auto-generated)"], rationale: "Right sidebar. Sticky on scroll." },
      { name: "Footer nav", components: ["Button (prev/next)"], rationale: "Sequential navigation for tutorial flows." },
    ],
  },
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

export function getComponentByName(name: string): ShadcnComponent | undefined {
  const target = name.toLowerCase();
  return SHADCN_COMPONENTS.find((c) => c.name.toLowerCase() === target);
}

export function getComponentsByCategory(category: ComponentCategory): ShadcnComponent[] {
  return SHADCN_COMPONENTS.filter((c) => c.category === category);
}

export function getPageComposition(type: ShadcnPageType): PageComposition | undefined {
  return PAGE_COMPOSITIONS.find((p) => p.type === type);
}

export function searchComponents(query: string): ShadcnComponent[] {
  const q = query.toLowerCase();
  return SHADCN_COMPONENTS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.includes(q) ||
      c.dataSlots.some((s) => s.includes(q)),
  );
}
