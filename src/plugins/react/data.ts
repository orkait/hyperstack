import { snippet } from "./loader.js";

export interface Pattern {
  name: string;
  category: PatternCategory;
  description: string;
  when: string;
  code: string;
  antiPattern?: string;
  tips?: string[];
}

export interface Constraint {
  name: string;
  rule: string;
  reason: string;
  example?: string;
}

export const PATTERN_CATEGORIES = [
  "rendering", "state", "data-fetching", "routing",
  "performance", "testing", "architecture",
] as const;
export type PatternCategory = (typeof PATTERN_CATEGORIES)[number];

// ---------------------------------------------------------------------------
// PATTERNS
// ---------------------------------------------------------------------------

export const PATTERNS: Pattern[] = [
  {
    name: "rsc-default",
    category: "rendering",
    description: "Server Components are the default. Use 'use client' only when interactivity is required.",
    when: "Every new component. Decide server vs client first.",
    code: snippet("patterns/rsc-default.md"),
    antiPattern: snippet("patterns/rsc-anti.md"),
    tips: [
      "SEO-critical content → RSC/SSR/SSG/ISR",
      "Non-SEO + interactive → Client Component",
      "Fetching data → always RSC unless client-side only",
    ],
  },
  {
    name: "state-hierarchy",
    category: "state",
    description: "Strict state placement order: URL → server → local → Zustand → Context (injection only).",
    when: "Deciding where to put any new piece of state.",
    code: snippet("patterns/state-hierarchy.md"),
    antiPattern: snippet("patterns/state-hierarchy-anti.md"),
    tips: [
      "Ask: can this live in the URL? If yes → URL state",
      "Context is for injection (stable values), not reactive state",
      "Redux is banned — Zustand only for shared client state",
    ],
  },
  {
    name: "data-fetching-rsc",
    category: "data-fetching",
    description: "Fetch in Server Components. Never useEffect for data fetching.",
    when: "Any data that can be fetched at request time.",
    code: snippet("patterns/data-fetching-rsc.md"),
    antiPattern: snippet("patterns/data-fetching-anti.md"),
  },
  {
    name: "zustand-store",
    category: "state",
    description: "Zustand for shared client state. Slice pattern for large stores.",
    when: "State shared across multiple client components that isn't URL or server state.",
    code: snippet("patterns/zustand-store.md"),
    tips: ["Never use Redux", "Slice selectors prevent unnecessary re-renders", "persist middleware for auth/settings"],
  },
  {
    name: "suspense-boundary",
    category: "rendering",
    description: "Suspense for async RSC children. Error boundaries for error states.",
    when: "Any page with async data in RSC children.",
    code: snippet("patterns/suspense-boundary.md"),
    tips: ["Skeleton over spinner for layout-stable loading", "ErrorBoundary wraps Suspense"],
  },
  {
    name: "nextjs-metadata",
    category: "routing",
    description: "generateMetadata for dynamic SEO in Next.js App Router.",
    when: "Every page that needs SEO (title, description, OG).",
    code: snippet("patterns/nextjs-metadata.md"),
  },
  {
    name: "composition-pattern",
    category: "architecture",
    description: "Avoid prop drilling >2 levels. Use composition or context injection.",
    when: "Props being passed through >2 intermediate components.",
    code: snippet("patterns/composition-pattern.md"),
    antiPattern: snippet("patterns/composition-anti.md"),
  },
  {
    name: "component-template",
    category: "architecture",
    description: "Standard component scaffold with TypeScript + Tailwind + shadcn/ui + lucide-react.",
    when: "Creating any new React component.",
    code: snippet("patterns/component-template.md"),
    tips: [
      "Always use cn() for conditional classNames",
      "Prefer named exports over default exports for components",
      "Use FC<Props> type annotation",
    ],
  },
];

// ---------------------------------------------------------------------------
// CONSTRAINTS
// ---------------------------------------------------------------------------

export const CONSTRAINTS: Constraint[] = [
  {
    name: "no-useeffect-fetch",
    rule: "Never useEffect for data fetching",
    reason: "Causes waterfall requests, no caching, race conditions, flash of loading state",
    example: "Use RSC for server data. Use React Query/SWR for client-side data.",
  },
  {
    name: "no-redux",
    rule: "No Redux — Zustand only for shared client state",
    reason: "Redux is verbose boilerplate. Zustand achieves the same with 10% of the code.",
    example: "create() from zustand with persist middleware",
  },
  {
    name: "no-any-typescript",
    rule: "No `any` in TypeScript",
    reason: "Defeats the purpose of TypeScript. Use unknown + type narrowing, or define the proper type.",
    example: "unknown + type guard, or generate types from API schema",
  },
  {
    name: "no-prop-drilling",
    rule: "No prop drilling more than 2 levels deep",
    reason: "Creates tight coupling. Middle components know about data they don't use.",
    example: "Composition (children/slots), context injection, or Zustand",
  },
  {
    name: "no-context-for-state",
    rule: "No Context for frequently changing state",
    reason: "Every consumer re-renders on every context change, even if they only use one field",
    example: "Zustand for state, Context only for: theme, auth tokens, i18n, feature flags",
  },
  {
    name: "no-barrel-exports",
    rule: "Avoid barrel exports (index.ts re-exports) in large codebases",
    reason: "Breaks tree-shaking — bundler must include everything from the barrel",
    example: "Import directly: import { Button } from '@/components/ui/button'",
  },
  {
    name: "server-first",
    rule: "Default to RSC. Only add 'use client' when interactivity is required",
    reason: "RSC reduces JS bundle size, improves LCP, enables streaming, better SEO",
    example: "Forms with server actions, data display → RSC. Dropdowns, modals → client",
  },
  {
    name: "no-useeffect-mount",
    rule: "No useEffect(fn, []) as componentDidMount substitute",
    reason: "In React 18 Strict Mode, effects run twice. Use RSC data fetching or React Query.",
    example: "RSC async functions, useQuery with enabled: true",
  },
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

export function getPatternsByCategory(category: PatternCategory): Pattern[] {
  return PATTERNS.filter((p) => p.category === category);
}

export function getPatternByName(name: string): Pattern | undefined {
  return PATTERNS.find((p) => p.name.toLowerCase() === name.toLowerCase());
}

export function searchPatterns(query: string): Pattern[] {
  const q = query.toLowerCase();
  return PATTERNS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.when.toLowerCase().includes(q)
  );
}
