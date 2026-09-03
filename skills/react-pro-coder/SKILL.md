---
name: react-pro-coder
category: domain
description: Staff-level React and Next.js engineering discipline - 56 enforced rules across component design, hooks, state placement, performance, data fetching (RSC, React 19 Actions, use()), TypeScript, styling and accessibility, architecture, testing, and production security, with an environment gate, an architecture-first order, tests as output, and a negative-doubt verification pass. Use when writing, reviewing, refactoring, debugging, or auditing React or Next.js code, when deciding where state lives or whether a component renders on the server, or when asked for React best practices or a React audit.
references:
  - references/COMPONENT-DESIGN.md
  - references/HOOKS.md
  - references/STATE.md
  - references/PERFORMANCE.md
  - references/DATA-FETCHING.md
  - references/TYPESCRIPT.md
  - references/STYLING-A11Y.md
  - references/ARCHITECTURE.md
  - references/TESTING.md
  - references/SECURITY-PRODUCTION.md
  - references/REVIEW-CHECKLIST.md
  - references/OUTPUT-CONTRACT.md
  - references/TEMPLATES.md
  - references/VARIANT-MAPPING.md
---

# React Pro Coder (SDE-3, React 19 + Next.js App Router)

## The Iron Law

```
NO REACT CODE WITHOUT react_get_constraints FIRST
```

The `react_*` MCP tools are the ground truth for this domain. Call `react_get_constraints` before
proposing any React or Next.js change, `react_list_patterns` to find the pattern, and
`react_get_pattern` for the code plus its anti-pattern. Recalling a constraint from memory is a
violation, not a shortcut: the constraints move with the framework and your memory does not.

This skill is the rule set the tools do not carry. Rules live in `references/`, one file per domain,
each rule with a stable ID (`CD-3`, `ST-2`, `DF-5`). Cite the ID whenever a rule is applied or waived
so the reasoning survives review.

## Rationalization table

| Excuse | Reality |
|---|---|
| "It is a one-line change" | One line moved state to the wrong level or added an index key. Read the domain file. |
| "I know the React rules" | The 56 rules are here because knowing them is not the same as applying them under time pressure. |
| "The MCP call is slow" | Slower than a wrong rendering strategy discovered in review? No. |
| "There is no time for tests" | Then there is no time for the bug. TQ rules are not optional (see `test-first`). |
| "Memoize it to be safe" | H-3: memoization without a measurement is cost with no benefit. |
| "I will add the error state later" | SP-3: later is when a user finds it. Four states or it does not ship. |

## Step 0: Environment gate (always first)

```bash
node -v              # >= 18.x
npm ls react         # React 18+, React 19 for use() and Actions
npm ls next          # Next.js 14+ for App Router, 15+ makes params a Promise
npx tsc --noEmit     # clean before and after the change
```

Defaults when the project has not decided:

| Concern | Default |
|---|---|
| Framework | Next.js App Router |
| Styling | Tailwind CSS + shadcn/ui (only when the user picked shadcn - see `shadcn-expert`) |
| Icons | lucide-react |
| Shared client state | Zustand (Redux prohibited) |
| Server state | RSC fetch, or TanStack Query / SWR on the client |
| Forms | React Hook Form + Zod |
| Tests | Vitest + Testing Library, Playwright for flows |

## Step 1: Task classification (exactly one)

New Feature, Refactor, Bug Fix, Performance/SEO, Review/Audit, Documentation Only.

| Class | Trigger words |
|---|---|
| New Feature | create, build, add, implement, scaffold, component, page, route |
| Refactor | refactor, restructure, reorganize, migrate, simplify, clean up |
| Bug Fix | fix, bug, broken, failing, regression, crash |
| Performance/SEO | optimize, slow, bundle, LCP, CLS, INP, metadata, SEO |
| Review/Audit | review, audit, critique, accessibility, architecture check |
| Documentation Only | document, explain, comment, write up |

Unclear class means stop and ask, not guess.

## Step 2: Architecture-first order (never skip a layer)

Responsibilities, invariants, dependency direction, module boundaries, public APIs, folder structure,
files, functions, syntax. Syntax is decided last.

## Step 3: The rule set

| Domain | Rules | Reference |
|---|---|---|
| Component design | CD-1..CD-8 | `references/COMPONENT-DESIGN.md` |
| Hooks | H-1..H-7 | `references/HOOKS.md` |
| State management | ST-1..ST-5 | `references/STATE.md` |
| Performance | PF-1..PF-6 | `references/PERFORMANCE.md` |
| Data fetching and React 19 | DF-1..DF-5 | `references/DATA-FETCHING.md` |
| TypeScript | TS-1..TS-5 | `references/TYPESCRIPT.md` |
| Styling and accessibility | UI-1..UI-4 | `references/STYLING-A11Y.md` |
| Architecture | AR-1..AR-6 | `references/ARCHITECTURE.md` |
| Testing and quality | TQ-1..TQ-5 | `references/TESTING.md` |
| Security and production | SP-1..SP-5 | `references/SECURITY-PRODUCTION.md` |

Read the file for the domain being touched. Do not paraphrase a rule from memory when the file is one
read away.

## Step 4: Forbidden patterns (hard stops)

| Pattern | Instead |
|---|---|
| `useEffect` for data fetching | RSC fetch, TanStack Query, SWR |
| `useEffect(fn, [])` as componentDidMount | RSC, or a query with `enabled` |
| Redux | Zustand (Jotai acceptable for atom-shaped state) |
| `any` | `unknown` plus narrowing, or the real type |
| Prop drilling past 2 levels | Composition, slots, or injected context |
| Context for frequently changing state | Zustand selector subscriptions |
| App-wide barrel files | Direct imports (AR-2 holds the one exception) |
| Index as a key on reorderable lists | Stable entity id |
| Side effects during render | Effects, event handlers, or server code |
| `div` with `onClick` | `button`, `a`, or a real semantic element |
| Synchronous `params` in Next.js 15 | `await props.params`, or `use(props.params)` in a client component |

## Step 5: Pattern gate

Use a design pattern only when all three hold: the force it resolves is stated, the invariant it
protects is stated, and the simpler alternative was considered and rejected in writing. No force means
no pattern.

## Step 6: Tests are part of the output

Behavior that exists has a test. Refactors need characterization tests written before the structure
moves. Test through the accessible surface, never internal state. Details in `references/TESTING.md`.
This composes with `test-first`, which owns the ordering, and `ship-gate`, which owns the evidence.

## Step 7: Output contract and negative doubt

Follow `references/OUTPUT-CONTRACT.md`: classification, environment verification, assumptions,
architecture decision, SEO needs, public APIs, code by file path, tests, negative doubt log, risks. The
negative-doubt routine runs before finalizing, and its hard stop applies: if correctness is still
uncertain after the second pass, return the revised design and the missing inputs instead of code.

## Review and audit mode

`references/REVIEW-CHECKLIST.md` is the pass list, keyed to rule IDs, with the severity scale. Report
findings as `path:line - RULE-ID - problem - fix`. Report shape and scaffolds live in
`references/TEMPLATES.md`. For variant-mapping detection, use `references/VARIANT-MAPPING.md`.

## Boundaries with other skills

| Concern | Owner |
|---|---|
| Visual system: type scale, color, spacing, elevation, motion | `designer` (DESIGN.md contract), `ui-ux`, `design-tokens` |
| shadcn/ui component internals and Base UI specifics | `shadcn-expert`, and only when the user picked shadcn |
| Whether the feature should exist at all | `pm-gate` |
| Completion claims and verification evidence | `ship-gate` |

This skill owns the React and Next.js engineering decision: rendering strategy, state placement,
component boundaries, data flow, types, tests. When a DESIGN.md exists, it is the contract and this
skill implements against it rather than relitigating the visuals.
