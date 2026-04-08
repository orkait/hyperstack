---
name: unified-skill
description: >-
  Build flow-based UIs with React Flow v12, animate with Motion for React v12,
  add smooth scroll with Lenis, build with React 19 and Next.js App Router,
  write Go APIs with Echo framework, apply Go best practices and design patterns,
  write idiomatic Rust, build design token systems with Tailwind v4 and OKLCH,
  and apply UI/UX design principles for typography, color, spacing, elevation,
  motion, and accessibility.
metadata:
  author: claude
  version: "2.0.0"
  license: MIT
triggers:
  - react flow
  - nodes and edges
  - flow diagram
  - workflow builder
  - pipeline editor
  - DAG editor
  - canvas UI
  - node-based editor
  - draggable nodes
  - xyflow
  - motion
  - framer-motion
  - animate
  - animation
  - AnimatePresence
  - exit animation
  - layout animation
  - whileHover
  - whileTap
  - whileInView
  - spring
  - variants
  - motion value
  - useScroll
  - lenis
  - smooth scroll
  - scroll animation
  - react component
  - server component
  - RSC
  - next.js
  - app router
  - zustand
  - echo framework
  - golang
  - go api
  - go server
  - rust
  - ownership
  - borrow checker
  - design tokens
  - tailwind v4
  - oklch
  - color ramp
  - token system
  - ui design
  - ux principles
  - typography scale
  - color contrast
  - wcag
activation:
  mode: fuzzy
  priority: high
---

# unified-mcp Skill

This skill relies on [unified-mcp](https://github.com/orkait/unified-mcp). Always use the MCP tools below for all API details, props, code examples, patterns, and transitions. This skill covers judgment, gotchas, and decisions only - unified-mcp provides all actual data.

---

## React Flow - MCP Tools

| Tool | What it returns |
|------|----------------|
| `reactflow_list_apis` | All 56 APIs grouped by kind (component/hook/utility/type) |
| `reactflow_get_api("Name")` | Full props table, usage snippet, code examples, tips |
| `reactflow_get_pattern("name")` | Complete implementation code for enterprise patterns |
| `reactflow_get_template("name")` | Production-ready TSX starter |
| `reactflow_get_examples("category")` | Curated code examples filtered by category |
| `reactflow_get_migration_guide` | v11 → v12 breaking changes with before/after diffs |
| `reactflow_generate_flow("description")` | Ready-to-use TSX from a prose description |
| `reactflow_search_docs("keyword")` | Full-text search across all docs |

Patterns: zustand-store, undo-redo, drag-and-drop, auto-layout-dagre, auto-layout-elk, context-menu, copy-paste, save-restore, prevent-cycles, keyboard-shortcuts, performance, dark-mode, ssr, subflows, edge-reconnection, custom-connection-line, auto-layout-on-mount

---

## React Flow - Critical Rules

- nodeTypes and edgeTypes must be defined outside components - never inline, causes remount on every render
- memo() all custom nodes and edges - they re-render aggressively otherwise
- node.measured.width/height is read-only - set by the library, do not set it yourself
- deleteElements() is async - returns Promise with deletedNodes and deletedEdges
- onBeforeDelete must be async - return Promise false to cancel, Promise true to confirm
- Hooks outside ReactFlow must be wrapped in ReactFlowProvider
- getNode() and getEdge() return undefined (not null) when not found - v12 change
- useUpdateNodeInternals() - call after adding or removing handles programmatically
- Attribution - use proOptions hideAttribution on free tier

---

## React Flow - Decisions

State management: single component use useNodesState and useEdgesState; shared across components use Zustand via reactflow_get_pattern zustand-store; undo/redo needed use Zustand with zundo via reactflow_get_pattern undo-redo

Layout: tree or left-right hierarchy use dagre via reactflow_get_pattern auto-layout-dagre; complex graphs nested ports use ELK via reactflow_get_pattern auto-layout-elk; on first render use useNodesInitialized with useEffect via reactflow_get_pattern auto-layout-on-mount

Custom nodes: always memo() with useCallback on handlers; use useNodeId() inside node to avoid prop drilling; use useNodesData(ids) to subscribe to specific node data; template via reactflow_get_template custom-node

Custom edges: destructure 5 values edgePath labelX labelY offsetX offsetY from path utils; complex labels use EdgeLabelRenderer (renders in DOM not SVG); template via reactflow_get_template custom-edge

Connection validation: prevent cycles via reactflow_get_pattern prevent-cycles; restrict handle types via isValidConnection prop on Handle or ReactFlow

Groups and subflows: parentId with extent parent and expandParent true on child nodes; add zIndexMode auto on ReactFlow for correct z-ordering

Performance: hide off-screen elements via onlyRenderVisibleElements prop; batch node updates via setNodes updater not repeated updateNode calls; full guide via reactflow_get_pattern performance

---

## Motion for React - MCP Tools

| Tool | What it returns |
|------|----------------|
| `motion_list_apis` | All 32 APIs grouped by kind (component/hook/function/utility) |
| `motion_get_api("Name")` | Full props table, usage snippet, code examples, tips |
| `motion_get_examples("category")` | Curated code examples filtered by category |
| `motion_get_transitions` | Complete transition reference: spring presets, tween, inertia, orchestration |
| `motion_generate_animation("description")` | Ready-to-use TSX animation from a prose description |
| `motion_search_docs("keyword")` | Full-text search across all docs |

Example categories: animation, gestures, scroll, layout, exit, drag, hover, svg, transitions, variants, keyframes, spring, reorder, performance

---

## Motion for React - Critical Rules

- Import from motion/react not framer-motion; framer-motion has been replaced by motion
- AnimatePresence goes outside the conditional - wrap the show/component expression, not the inner element
- exit requires AnimatePresence parent - without it, exit animations are silently ignored
- AnimatePresence direct children need unique key props
- MotionValues are NOT React state - do not read them in render; subscribe with useMotionValueEvent
- AnimatePresence mode popLayout - direct custom component children must accept ref as a prop (React 19)
- useReducedMotion() - always respect for accessibility
- stagger() - import from motion/react, use inside variant transition.delayChildren
- useScroll container vs target - container is a scrollable element; target is tracked within the container

---

## Motion for React - Decisions

Basic animation: simple one-off use initial and animate props; reusable states use variants; imperative control use useAnimate

Exit animations: always use AnimatePresence with exit prop and unique key; old page exits before new enters use mode wait; keep siblings in layout during exit use mode popLayout

Layout animations: single element reflow use layout prop; cross-component shared transition use layoutId; sync siblings use LayoutGroup wrapper

Scroll-linked: progress bar or parallax use useScroll with useTransform; enter viewport use whileInView or useInView

Physics and spring: bouncy feel use transition type spring; smooth follow use useSpring with a motionValue; presets via motion_get_transitions

Gestures: hover and tap states use whileHover and whileTap; drag use drag prop with dragConstraints; custom drag trigger use useDragControls with dragListener false

Staggered lists: use variants on container and children; set delayChildren stagger 0.3 in parent variant transition

Performance: animate transform and opacity only - avoid width height top left which triggers layout

---

## Lenis - MCP Tools

| Tool | What it returns |
|------|----------------|
| `lenis_list_apis` | All Lenis APIs - options, methods, events |
| `lenis_get_api("name")` | Full API reference with usage snippet |
| `lenis_get_pattern("name")` | Integration pattern with full code |
| `lenis_generate_setup("description")` | Complete Lenis setup from a description |
| `lenis_cheatsheet` | Required CSS, data-lenis-prevent usage, pitfalls |
| `lenis_search_docs("keyword")` | Full-text search across all Lenis docs |

Patterns: full-page, next-js, gsap-integration, framer-motion-integration, custom-container, accessibility, scroll-to-nav

Recipes: scroll-progress-bar, back-to-top, horizontal-scroll-section, scroll-locked-modal, parallax-layer, direction-indicator, gsap-complete

---

## Lenis - Critical Rules

- Required CSS must be imported - import 'lenis/dist/lenis.css' or add manually; without it scroll behavior breaks
- html.lenis and html.lenis body must have height: auto - do not set fixed height on these
- autoRaf false when using GSAP - use gsap.ticker.add to drive Lenis RAF; do not let both run simultaneously
- gsap.ticker.lagSmoothing(0) - required when integrating GSAP to prevent jank on tab refocus
- data-lenis-prevent on scrollable containers inside Lenis - modals, sidebars, code blocks with overflow scroll
- lenis.stop() when modal opens, lenis.start() when it closes - call via useLenis hook or ref
- Do not use requestAnimationFrame directly with Lenis - banned per project rules; use gsap.ticker or autoRaf

---

## Lenis - Decisions

Root vs container: full page smooth scroll use ReactLenis with root prop; scoped smooth scroll inside a div use ReactLenis without root and pass a container ref

GSAP integration: use lenis_get_pattern gsap-integration; set autoRaf false and drive via gsap.ticker.add

Framer Motion integration: use lenis_get_pattern framer-motion-integration; they coexist without conflict

Preventing scroll on nested elements: use data-lenis-prevent for all overrides; lenis_cheatsheet has the full attribute reference

---

## React + Next.js - MCP Tools

| Tool | What it returns |
|------|----------------|
| `react_list_patterns` | All patterns with categories |
| `react_get_pattern("name")` | Full pattern: code, anti-pattern, tips |
| `react_get_constraints` | Hard rules and banned patterns |
| `react_search_docs("keyword")` | Search across patterns and rules |

---

## React + Next.js - Critical Rules

- Server Components are the default - use 'use client' only when interactivity is required
- Never useEffect for data fetching - fetch in RSC or use React Query / SWR in client components
- Redux is banned - Zustand only for shared client state
- Context is for injection only (theme, auth, i18n) - not for frequently changing state
- URL state first (searchParams) before any other state mechanism
- generateMetadata must be async and in the same file as the page component

---

## React + Next.js - Decisions

State placement order: URL state (searchParams) → server state (RSC/React Query) → local useState → Zustand → Context injection

Component type: SEO-critical or data-only use RSC; needs onClick, useState, useEffect, or browser APIs use 'use client'

Data fetching: request-time data use RSC with async/await fetch; client-side only or real-time use React Query or SWR; never useEffect with fetch

Sharing state: two sibling client components use Zustand slice; deep component tree with stable values use Context; URL-serializable use searchParams

---

## Echo (Go) - MCP Tools

| Tool | What it returns |
|------|----------------|
| `echo_list_recipes` | All 19 recipes by category |
| `echo_get_recipe("name")` | Full recipe with complete runnable code |
| `echo_list_middleware` | All 13 middleware with purpose and order guidance |
| `echo_get_middleware("name")` | Full middleware reference with usage and gotchas |
| `echo_decision_matrix` | When to use what - Echo vs stdlib vs alternatives |
| `echo_search_docs("keyword")` | Full-text search across all recipes and middleware |

Recipes: hello-world, crud-api, jwt-auth, websocket, sse, file-upload, file-download, graceful-shutdown, middleware-chain, cors, route-groups, http2, auto-tls, reverse-proxy, streaming-response, embed-resources, timeout, subdomain-routing, jsonp

---

## Echo (Go) - Critical Rules

- Graceful shutdown is mandatory - always implement signal handling; aborts in-flight requests without it
- Never string concatenate SQL - always use parameterized queries; SQL injection is critical
- c.Bind(&req) before accessing request body - do not read c.Request().Body directly
- Gzip middleware must NOT be used on SSE or streaming routes - it buffers the full response
- JWT middleware runs before the handler - do not re-validate the token inside the handler
- e.Logger.Fatal() on startup errors only - never in request handlers
- Always return the error from handlers - do not swallow errors with _

---

## Echo (Go) - Decisions

Middleware order: Recover → Logger → RequestID → CORS → RateLimit → Auth → business handlers

Route grouping: shared prefix use e.Group(); shared middleware use group.Use(); per-route middleware pass as variadic args to GET/POST

Authentication: JWT use echo_get_middleware JWT; API keys use echo_get_middleware KeyAuth; basic auth use echo_get_middleware BasicAuth

Timeouts: per-handler use echo_get_middleware Timeout; global use server.ReadTimeout and WriteTimeout on http.Server

---

## Golang - MCP Tools

| Tool | What it returns |
|------|----------------|
| `golang_list_practices` | All 18 best practices by topic |
| `golang_get_practice("name")` | Full practice: rule, reason, good/bad code |
| `golang_list_patterns` | All 10 design patterns by category |
| `golang_get_pattern("name")` | Full pattern with Go-idiomatic implementation |
| `golang_get_antipatterns` | Common Go mistakes and fixes |
| `golang_search_docs("keyword")` | Search across practices and patterns |

Practice topics: fundamentals, error-handling, concurrency, api-server, database, config, logging, security, testing

Pattern categories: creational (functional-options), structural (adapter, middleware-decorator, consumer-side-interface), behavioral (strategy, observer, command), concurrency (worker-pool, pipeline, fan-out-fan-in)

---

## Golang - Critical Rules

- context.Context is always the first parameter for any function doing I/O - never store in struct
- Always wrap errors with fmt.Errorf("context: %w", err) - bare return err loses the call stack
- Handle errors once: log OR return, never both - duplicate log entries pollute production logs
- Never use math/rand for security-sensitive values - always crypto/rand
- Never string-concatenate SQL queries - always parameterized queries
- Never start a goroutine without knowing how it stops - always pass ctx and select on ctx.Done()
- Use errors.Is() and errors.As() not == or type assertion - direct comparison breaks with wrapped errors
- Always defer rows.Close() immediately after a successful query

---

## Golang - Decisions

Error handling: sentinel errors use errors.Is(); typed errors use errors.As(); new error types use golang_get_practice errors-is-as

Concurrency: goroutines that can fail use errgroup not WaitGroup; bounded parallel work use worker-pool pattern; streaming pipeline use pipeline pattern; details via golang_get_pattern

Interfaces: define in the consumer package not the producer; keep to 1-2 methods; details via golang_get_practice small-interfaces and golang_get_pattern consumer-side-interface

Constructor: any struct needing validation or defaults use NewType() pattern; never expose zero-value-misuse structs

Dependency injection: pass deps to constructors, never global vars; functional options for 5+ optional params via golang_get_pattern functional-options

---

## Rust - MCP Tools

| Tool | What it returns |
|------|----------------|
| `rust_list_practices` | All 18 best practices by topic |
| `rust_get_practice("name")` | Full practice: rule, reason, good/bad examples |
| `rust_search_docs("keyword")` | Search across all practices |
| `rust_cheatsheet` | Ownership rules, pointer type table, performance tips |

---

## Rust - Critical Rules

- Borrow over clone - pass &T not T unless you actually need ownership
- Never unwrap() in production code - use ? operator with proper error types
- Use thiserror for library errors, anyhow for application errors - never Box<dyn Error> in libraries
- Prefer iterators over manual loops - map, filter, fold compose and avoid bounds-check overhead
- &str over String for function parameters - more flexible, avoids forced allocation
- Send + Sync must be explicit for types crossing thread boundaries - derive or impl carefully
- Clone inside a loop is a red flag - restructure to borrow instead

---

## Rust - Decisions

Ownership ambiguity: shared ownership use Rc (single-thread) or Arc (multi-thread); ambiguous ownership use Cow<'a, T> via rust_get_practice cow-ambiguous-ownership

Error handling: library crate use thiserror with derive macros; application binary use anyhow with context(); never panic in library code

String handling: function parameter accepting string use &str; storing in struct use String; path handling use &Path not &str

Performance: profile before optimizing; benchmark in --release only; borrow instead of clone in hot paths; static dispatch over dyn Trait when the type set is known

---

## Design Tokens - MCP Tools

| Tool | What it returns |
|------|----------------|
| `design_tokens_list_categories` | All 10 token categories with descriptions |
| `design_tokens_get_category("name")` | Full CSS + rules + gotchas for a token category |
| `design_tokens_get_color_ramp("name")` | Color ramp: stops, oklch values, semantic roles |
| `design_tokens_get_procedure(step)` | Step-by-step token build procedures (8 steps) |
| `design_tokens_get_gotchas` | All gotchas across every category and procedure |
| `design_tokens_generate("description")` | Complete Tailwind v4 token file from a palette description |
| `design_tokens_search("keyword")` | Search across all categories, ramps, and procedures |

Token categories: colors, spacing, typography, component-sizing, border-radius, shadows-elevation, motion, z-index, opacity, grid-layout

---

## Design Tokens - Critical Rules

- @theme for primitives (static, compile-time) and @theme inline for semantic tokens (runtime-swappable, dark mode works)
- Never put runtime-swappable vars in plain @theme - dark mode will not work
- Three-layer architecture: @theme primitives → :root/:dark semantics → @theme inline utilities
- All spacing values must be multiples of 4px - never 6px, 10px, 14px, etc.
- --spacing in Tailwind v4 is the BASE MULTIPLIER (0.25rem) not an individual token - changing it scales all utilities
- Shadows must be oklch-tinted not rgba(0,0,0) - warm shadows on warm UIs
- Dark mode: disable all shadows, use progressively lighter bg-color per elevation level instead
- Status colors need L ~0.55 for 4.5:1 contrast with white foreground - run contrast audit after finalizing

---

## Design Tokens - Decisions

Building from scratch: follow the 8-step procedure via design_tokens_get_procedure; start with color primitives, then semantics, then @theme inline

Color space: always OKLCH for new projects; to darken reduce L only; to desaturate reduce C only; hue stays consistent across a ramp

Neutral temperature: commit to warm (H 50-80°) or cool (H 220-240°) - never mix; warm bg with cool borders breaks visual coherence

Tailwind integration: use design_tokens_get_category colors for the full three-layer template; @theme inline maps CSS vars to bg-X text-X border-X utilities at runtime

---

## UI/UX Principles - MCP Tools

| Tool | What it returns |
|------|----------------|
| `ui_ux_list_principles` | All principles by domain |
| `ui_ux_get_principle("name")` | Full principle: rule, detail, CSS example, anti-patterns |
| `ui_ux_get_component_pattern("name")` | Component spec: variants, states, sizing rules, CSS |
| `ui_ux_get_checklist("domain")` | Pre-ship checklist per domain |
| `ui_ux_get_gotchas` | All common UI mistakes and their fixes |
| `ui_ux_search("keyword")` | Search across principles, patterns, and gotchas |

Domains: typography, color, spacing, elevation, motion, accessibility, responsive, components

Component patterns: button, card, badge, form-input

---

## UI/UX - Critical Rules

- Touch targets minimum 44x44px (WCAG 2.5.5) - visual size does not equal hit area; expand with padding or ::after
- prefers-reduced-motion is mandatory - place in @layer base with !important on * and pseudos
- Never outline: none without a custom focus style - keyboard users become lost
- Never color as the only state indicator - error needs icon + text alongside red color
- Body text line height minimum 1.6 - tight line height on body is a critical readability bug
- Pure black (#000) and pure white (#fff) are banned - use near-black and near-white oklch values
- Heading line height must be tight (1.05-1.2) - body line height (1.75) on headings looks wrong

---

## UI/UX - Decisions

Typography scale: use mathematical ratio (1.25 or 1.333); fluid headings with clamp(), fixed 16px body; details via ui_ux_get_principle type-scale

Color system: OKLCH for new projects; warm or cool neutrals, never mixed; status colors need solid + soft variant; details via ui_ux_get_principle oklch-color-space

Spacing: 4px grid, all values multiples of 4; space within groups smaller than space between groups; details via ui_ux_get_principle 4px-grid

Elevation: 5 levels distinguished by bg-color not just borders; dark mode uses lighter bg per level, not shadows; details via ui_ux_get_principle 5-elevation-levels

Motion: exits faster than entrances (subtract 50-100ms); ease-out entering, ease-in exiting, ease-in-out repositioning; never linear; details via ui_ux_get_principle duration-rules

Pre-ship: run ui_ux_get_checklist for each domain before shipping a new component or page
