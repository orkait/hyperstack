import { snippet } from "./loader.js";

export interface ApiEntry {
  name: string;
  kind: ApiKind;
  description: string;
  importPath: string;
  props?: PropEntry[];
  returns?: string;
  usage: string;
  examples: Example[];
  tips?: string[];
  relatedApis?: string[];
}

export interface PropEntry {
  name: string;
  type: string;
  description: string;
  default?: string;
}

export interface Example {
  title: string;
  code: string;
  description?: string;
  category: string;
}

export interface Pattern {
  name: string;
  description: string;
  code: string;
  tips?: string[];
}

export const API_KINDS = ["component", "hook", "type", "utility"] as const;
export type ApiKind = (typeof API_KINDS)[number];

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatApiReference(api: ApiEntry): string {
  let out = `# ${api.name}\n\n`;
  out += `**Kind:** ${api.kind}\n`;
  out += `**Import:** \`${api.importPath}\`\n\n`;
  out += `${api.description}\n\n`;

  if (api.returns) {
    out += `**Returns:** \`${api.returns}\`\n\n`;
  }

  out += `## Usage\n\n\`\`\`tsx\n${api.usage}\n\`\`\`\n\n`;

  if (api.props && api.props.length > 0) {
    out += `## Props / Options\n\n`;
    for (const p of api.props) {
      out += `- **${p.name}**: \`${p.type}\`${p.default ? ` (default: \`${p.default}\`)` : ""} — ${p.description}\n`;
    }
    out += "\n";
  }

  if (api.examples.length > 0) {
    out += `## Examples\n\n`;
    for (const ex of api.examples) {
      out += `### ${ex.title}\n`;
      if (ex.description) out += `${ex.description}\n\n`;
      out += `\`\`\`tsx\n${ex.code}\n\`\`\`\n\n`;
    }
  }

  if (api.tips && api.tips.length > 0) {
    out += `## Tips\n\n`;
    for (const tip of api.tips) out += `- ${tip}\n`;
    out += "\n";
  }

  if (api.relatedApis && api.relatedApis.length > 0) {
    out += `**Related:** ${api.relatedApis.join(", ")}\n`;
  }

  return out;
}

export interface SearchResult {
  api: ApiEntry;
  matchingExamples: Example[];
}

export function searchApis(query: string): SearchResult[] {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];
  for (const api of ALL_APIS) {
    const nameMatch = api.name.toLowerCase().includes(q);
    const descMatch = api.description.toLowerCase().includes(q);
    const matchingExamples = api.examples.filter(
      (ex) =>
        ex.title.toLowerCase().includes(q) ||
        ex.category.toLowerCase().includes(q) ||
        ex.code.toLowerCase().includes(q),
    );
    if (nameMatch || descMatch || matchingExamples.length > 0) {
      results.push({ api, matchingExamples });
    }
  }
  return results;
}

export function getApiByName(name: string): ApiEntry | undefined {
  const n = name.toLowerCase();
  return ALL_APIS.find((a) => a.name.toLowerCase() === n);
}

// ---------------------------------------------------------------------------
// COMPONENTS
// ---------------------------------------------------------------------------

const reactLenis: ApiEntry = {
  name: "ReactLenis",
  kind: "component",
  description:
    "The core Lenis provider component. Wraps your app (or a scroll container) and sets up the smooth scroll context. When used with root={true}, it attaches to the window scroll. Without root, it creates a container-scoped scroller.",
  importPath: 'import { ReactLenis } from "lenis/react"',
  props: [
    {
      name: "root",
      type: "boolean",
      description: "Attach Lenis to the window/document scroll instead of a container element. Use this in your root layout.",
      default: "false",
    },
    {
      name: "options",
      type: "LenisOptions",
      description: "Configuration object passed directly to the Lenis instance. See LenisOptions for all available fields.",
    },
    {
      name: "ref",
      type: "React.Ref<LenisRef>",
      description: "Ref forwarded to expose the Lenis instance and wrapper DOM element. Shape: { lenis: Lenis | undefined, wrapper: HTMLElement }.",
    },
    {
      name: "autoRaf",
      type: "boolean",
      description: "Automatically drive Lenis via its internal requestAnimationFrame loop. Set false when integrating with GSAP ticker or Framer Motion's frame scheduler.",
      default: "true",
    },
    {
      name: "className",
      type: "string",
      description: "CSS class applied to the outer wrapper div (only relevant when root={false}).",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "The content to be scroll-wrapped.",
    },
  ],
  usage: snippet("usage/react-lenis.txt"),
  examples: [
    {
      title: "Root layout setup",
      category: "setup",
      code: snippet("examples/react-lenis-root.txt"),
    },
    {
      title: "Container scroll (non-root)",
      category: "setup",
      code: snippet("examples/react-lenis-container.txt"),
    },
    {
      title: "Accessing the Lenis instance via ref",
      category: "setup",
      code: snippet("examples/react-lenis-ref.txt"),
    },
  ],
  tips: [
    "Always import 'lenis/dist/lenis.css' — without it, the scroll container loses its overflow styles and the scroller breaks visibly.",
    "In Next.js App Router, ReactLenis must be in a 'use client' file or wrapped in a client component — it uses refs and effects internally.",
    "root={true} delegates to the window scroll. root={false} (default) creates a div-based scroller — you need to set height/overflow on the parent.",
    "autoRaf defaults to true. If you integrate GSAP or Framer Motion, set autoRaf={false} and tick manually to avoid double-frame rendering.",
  ],
  relatedApis: ["useLenis", "LenisRef", "LenisOptions"],
};

// ---------------------------------------------------------------------------
// HOOKS
// ---------------------------------------------------------------------------

const useLenis: ApiEntry = {
  name: "useLenis",
  kind: "hook",
  description:
    "Returns the nearest Lenis instance from context. Accepts an optional scroll callback that fires on every scroll frame with the Lenis instance as argument. Must be used inside a ReactLenis provider; returns undefined if no provider is found.",
  importPath: 'import { useLenis } from "lenis/react"',
  props: [
    {
      name: "callback",
      type: "(lenis: Lenis) => void",
      description: "Optional. Fired on every scroll frame. Use for scroll-linked animations or reading scroll position.",
    },
    {
      name: "deps",
      type: "React.DependencyList",
      description: "Optional. Dependency array for the scroll callback, like useEffect deps.",
      default: "[]",
    },
    {
      name: "priority",
      type: "number",
      description: "Optional. Callback execution order when multiple useLenis calls are active. Lower = earlier.",
      default: "0",
    },
  ],
  returns: "Lenis | undefined",
  usage: snippet("usage/use-lenis.txt"),
  examples: [
    {
      title: "Scroll to element",
      category: "navigation",
      code: snippet("examples/use-lenis-scroll-to.txt"),
    },
    {
      title: "Scroll progress tracker",
      category: "scroll",
      code: snippet("examples/use-lenis-progress.txt"),
    },
    {
      title: "Scroll-linked parallax",
      category: "scroll",
      code: snippet("examples/use-lenis-parallax.txt"),
    },
    {
      title: "Stop/start scrolling",
      category: "control",
      code: snippet("examples/use-lenis-modal.txt"),
    },
  ],
  tips: [
    "useLenis() outside a ReactLenis provider returns undefined — always guard with optional chaining: lenis?.scrollTo(...).",
    "The scroll callback fires every frame when scrolling — avoid expensive operations or setState directly inside it. Use refs for DOM mutation or debounce for state.",
    "lenis.scrollTo() accepts a CSS selector string, HTMLElement, or number (pixel offset). Passing 0 scrolls to top.",
    "lenis.stop() and lenis.start() are the correct way to lock scroll (e.g. modals). Do NOT manipulate overflow on body manually.",
  ],
  relatedApis: ["ReactLenis", "LenisRef"],
};

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

const lenisRef: ApiEntry = {
  name: "LenisRef",
  kind: "type",
  description:
    "The shape of the ref forwarded by ReactLenis. Use this when you need to imperatively access the Lenis instance or its wrapper DOM element outside of the useLenis hook.",
  importPath: 'import type { LenisRef } from "lenis/react"',
  props: [
    {
      name: "lenis",
      type: "Lenis | undefined",
      description: "The active Lenis instance. May be undefined before the component mounts.",
    },
    {
      name: "wrapper",
      type: "HTMLElement",
      description: "The outer wrapper DOM element that Lenis is attached to.",
    },
  ],
  usage: snippet("usage/lenis-ref.txt"),
  examples: [
    {
      title: "Imperative scroll from outside context",
      category: "setup",
      code: snippet("examples/lenis-ref-imperative.txt"),
    },
  ],
  tips: [
    "LenisRef.lenis is undefined until ReactLenis mounts — always check for its existence before calling methods.",
    "Prefer useLenis() over LenisRef for components inside the provider tree. LenisRef is mainly for components that render the provider itself.",
  ],
  relatedApis: ["ReactLenis", "useLenis"],
};

const lenisOptions: ApiEntry = {
  name: "LenisOptions",
  kind: "type",
  description:
    "Configuration object passed to ReactLenis via the options prop. Controls scroll physics, orientation, and behavior. All fields are optional.",
  importPath: 'import type { LenisOptions } from "lenis"',
  props: [
    {
      name: "lerp",
      type: "number",
      description: "Linear interpolation factor. Controls how quickly scroll catches up to the target. Lower = smoother but slower.",
      default: "0.1",
    },
    {
      name: "duration",
      type: "number",
      description: "Duration (in seconds) for scroll animations triggered programmatically. Overrides lerp when set.",
    },
    {
      name: "easing",
      type: "(t: number) => number",
      description: "Easing function for programmatic scrolls. Receives t in [0,1] and returns eased value.",
      default: "(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))",
    },
    {
      name: "orientation",
      type: "'vertical' | 'horizontal'",
      description: "Scroll axis.",
      default: "'vertical'",
    },
    {
      name: "gestureOrientation",
      type: "'vertical' | 'horizontal' | 'both'",
      description: "Which gesture axes to capture for scroll.",
      default: "'vertical'",
    },
    {
      name: "smoothWheel",
      type: "boolean",
      description: "Enable smooth scrolling for mouse wheel events.",
      default: "true",
    },
    {
      name: "smoothTouch",
      type: "boolean",
      description: "Enable smooth scrolling for touch (mobile) events. Can feel laggy on low-end iOS devices.",
      default: "false",
    },
    {
      name: "touchMultiplier",
      type: "number",
      description: "Multiplier applied to touch scroll delta.",
      default: "2",
    },
    {
      name: "infinite",
      type: "boolean",
      description: "Enable infinite scroll — wraps around when reaching start or end.",
      default: "false",
    },
    {
      name: "autoRaf",
      type: "boolean",
      description: "Automatically run Lenis via its internal RAF loop. Set false when integrating with GSAP ticker or Framer Motion.",
      default: "true",
    },
    {
      name: "wrapper",
      type: "HTMLElement | Window",
      description: "The scroll container element. Defaults to window when root={true}.",
    },
    {
      name: "content",
      type: "HTMLElement",
      description: "The inner content element. Used for non-root (container) scroll.",
    },
  ],
  usage: snippet("usage/lenis-options.txt"),
  examples: [
    {
      title: "Tuned scroll feel for a marketing site",
      category: "options",
      code: snippet("options/tuned-marketing.txt"),
    },
    {
      title: "Horizontal scroll options",
      category: "options",
      code: snippet("options/horizontal.txt"),
    },
  ],
  tips: [
    "lerp: 0.1 is the default — values closer to 0 are smoother but feel slower. 0.05-0.15 is the practical range.",
    "Do NOT set smoothTouch: true on production sites targeting iOS — it introduces perceivable input lag.",
    "duration and lerp are mutually exclusive; duration-based scrolling uses an easing function while lerp uses linear interpolation per frame.",
    "infinite: true works best with a content height that is a multiple of the viewport — otherwise it jumps.",
  ],
  relatedApis: ["ReactLenis"],
};

// ---------------------------------------------------------------------------
// ALL APIS EXPORT
// ---------------------------------------------------------------------------

export const ALL_APIS: ApiEntry[] = [reactLenis, useLenis, lenisRef, lenisOptions];

// ---------------------------------------------------------------------------
// PATTERNS
// ---------------------------------------------------------------------------

export const PATTERNS: Record<string, Pattern> = {
  "full-page": {
    name: "full-page",
    description: "Standard root layout setup — ReactLenis wraps the entire app for full-page smooth scrolling.",
    code: snippet("patterns/full-page.txt"),
    tips: [
      "root={true} is required for full-page scroll — without it, Lenis creates an overflow:hidden container.",
      "The CSS import is mandatory — skip it and the layout breaks.",
    ],
  },
  "next-js": {
    name: "next-js",
    description: "Next.js App Router pattern using a dedicated SmoothScrollProvider client component to wrap the layout.",
    code: snippet("patterns/next-js.txt"),
    tips: [
      "Keep app/layout.tsx as a Server Component — extract the 'use client' directive into SmoothScrollProvider.",
      "This preserves RSC boundaries and avoids unnecessarily client-rendering the entire layout.",
    ],
  },
  "gsap-integration": {
    name: "gsap-integration",
    description: "Integrate Lenis with GSAP ScrollTrigger by disabling autoRaf and driving Lenis from GSAP's ticker.",
    code: snippet("patterns/gsap-integration.txt"),
    tips: [
      "autoRaf: false is required — if GSAP and Lenis both run their own RAF loops, scroll updates fire twice per frame causing desync.",
      "gsap.ticker.lagSmoothing(0) prevents GSAP from adjusting delta time which would cause Lenis to stutter after tab switches.",
      "lenis.raf() expects milliseconds — multiply GSAP time (seconds) by 1000.",
    ],
  },
  "framer-motion-integration": {
    name: "framer-motion-integration",
    description: "Integrate Lenis with Framer Motion by disabling autoRaf and syncing via frame.update.",
    code: snippet("patterns/framer-motion-integration.txt"),
    tips: [
      "Use frame from 'motion' (not 'framer-motion') — this is the Framer Motion v11+ low-level scheduler.",
      "frame.update(fn, true) schedules the update to run on every frame. The second argument (true) enables loop mode.",
      "autoRaf: false is mandatory — same reasoning as with GSAP, prevent double-ticking.",
    ],
  },
  "custom-container": {
    name: "custom-container",
    description: "Scoped scroll container using wrapper and content refs for non-window smooth scroll.",
    code: snippet("patterns/custom-container.txt"),
    tips: [
      "The wrapper element needs overflow: hidden and a fixed height for container scroll to work.",
      "The content element is the scrollable inner div — it should grow naturally with its children.",
      "This pattern is useful for split-panel layouts, side drawers, or modal scroll areas.",
    ],
  },
  "accessibility": {
    name: "accessibility",
    description: "Respect prefers-reduced-motion by disabling smooth scrolling for users who prefer it.",
    code: snippet("patterns/accessibility.txt"),
    tips: [
      "Never force smooth scrolling on users who have opted out via prefers-reduced-motion.",
      "When skipping ReactLenis, native scroll is used — no polyfill needed.",
      "For a hook-based approach, use the useReducedMotion hook from Framer Motion or write your own with a useEffect + matchMedia listener.",
    ],
  },
  "scroll-to-nav": {
    name: "scroll-to-nav",
    description: "Navigation link that uses lenis.scrollTo() for smooth in-page anchor navigation.",
    code: snippet("patterns/scroll-to-nav.txt"),
    tips: [
      "offset compensates for sticky headers — pass a negative value equal to the header height.",
      "lenis.scrollTo() accepts a CSS selector ('#section'), HTMLElement, or pixel number.",
      "For Next.js App Router, use usePathname to detect route changes and reset scroll position.",
    ],
  },
};
