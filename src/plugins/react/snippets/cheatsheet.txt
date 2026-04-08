# React Pro Coder - Quick Reference

## Architecture-First Reasoning Order (Step 2)

Never skip layers. Reason strictly in this order:
1. Responsibilities
2. Invariants (inputs/state/ordering)
3. Dependency direction
4. Module boundaries
5. Public APIs
6. Folder structure
7. Files
8. Functions
9. Syntax

## Rendering Decision Tree

```
Is it SEO-critical?
├── Yes → RSC / SSR / SSG / ISR
└── No
    ├── Needs interactivity? (state, events, browser APIs)
    │   └── Yes → "use client" Client Component
    └── No → RSC (default)
```

## State Hierarchy (Strict Order)

1. URL state (searchParams/pathname) — shareable, bookmarkable
2. Server state (React Query / SWR / RSC fetch) — cached, deduplicated
3. Local component state — useState / useReducer
4. Shared client state — Zustand (Redux prohibited)
5. Context — injection only (theme, auth tokens, i18n, feature flags)

## Forbidden Patterns

| Pattern | Reason | Alternative |
|---|---|---|
| `useEffect` for data fetching | Waterfall, no caching, race conditions | RSC fetch or React Query |
| `useEffect(fn, [])` as componentDidMount | Runs twice in React 18 Strict Mode | RSC async functions, useQuery |
| Prop drilling > 2 levels | Tight coupling, middle components hold data they don't use | Composition (children/slots), context injection, Zustand |
| Context for frequently changing state | Every consumer re-renders on every change | Zustand with slice selectors |
| `any` in TypeScript | Defeats type safety | `unknown` + type narrowing, or define proper types |
| Redux | Verbose boilerplate | Zustand |
| Barrel exports in large codebases | Breaks tree-shaking | Direct imports |

## Output Contract Checklist (Step 6)

Every implementation response must include:
- [ ] Task Classification (Feature / Refactor / Bug Fix / Performance / Review)
- [ ] Environment Verification (node version, React version, Next.js version)
- [ ] Assumptions stated explicitly
- [ ] Architecture Decision (rendering + state location + module boundaries)
- [ ] SEO Requirements (if applicable)
- [ ] Public APIs documented
- [ ] Code organized by file paths
- [ ] Tests (Vitest + Testing Library)
- [ ] Negative Doubt Log
- [ ] Risks & Trade-offs

## Negative Doubt Routine (Step 7)

After drafting output, verify:
1. Find 5 concrete failure modes + add tests for each
2. Falsify assumptions — what if they are wrong?
3. Enforce invariants with guards/validation
4. Audit dependencies — no circular deps, minimal public surface
5. Challenge simpler alternatives — is there an easier way?
6. Inject at least one test per failure mode
7. Revise + repeat pass
8. Append Negative Doubt Log to response

Hard stop: if correctness/safety is still uncertain after this routine, refuse to finalize.

## Environment Gate (Step 0)

```bash
node -v          # >= 18.x
npm ls react     # React 18+
npm ls next      # Next.js 14+ if using App Router / RSC
```

Defaults (if unspecified):
- Framework: Next.js App Router
- Styling: Tailwind CSS + shadcn/ui
- Icons: lucide-react
- Shared client state: Zustand
- Server state: React Query or SWR (or RSC fetch)