# Review and Audit Checklist

Run top to bottom. Report each finding as `path:line - RULE-ID - problem - fix`. A rule that does not
apply is skipped silently; a rule that is deliberately waived is reported with the reason.

## Component design

- [ ] CD-1 One job per component, no "and" in the description
- [ ] CD-2 Under 100 lines, or long for a coherent reason
- [ ] CD-3 Slots instead of a wide prop list
- [ ] CD-5 Variants, not boolean flags
- [ ] CD-6 No prop drilling past 2 levels
- [ ] CD-7 Pure render: no side effects, no `Math.random()` or `Date.now()`
- [ ] CD-8 Early guards for invalid, empty, and error input

## Hooks

- [ ] H-1 Hooks at top level only, `exhaustive-deps` clean
- [ ] H-3 No memoization added without a measurement or a memoized consumer
- [ ] H-4 Effects synchronize with external systems only, never fetch
- [ ] H-5 No state that duplicates a derivable value
- [ ] H-6 Every subscription, timer, and request cleaned up
- [ ] H-7 Reducer where the transitions have rules

## State

- [ ] ST-1 State at the lowest level that works
- [ ] ST-2 Form state local, not global
- [ ] ST-3 Immutable updates everywhere
- [ ] ST-4 Discriminated union, not independent booleans
- [ ] ST-5 Server state in a query cache, not copied into client state

## Performance

- [ ] PF-1 Optimizations backed by a profile
- [ ] PF-2 Stable unique keys, no index keys on mutable lists
- [ ] PF-3 No new object, array, or function identity passed to memoized children
- [ ] PF-4 Heavy components lazy loaded with a layout-preserving fallback
- [ ] PF-5 Lists past ~100 rows virtualized
- [ ] PF-6 Deep imports, bundle checked

## Data fetching

- [ ] DF-1 Server Components fetch by default, no `useEffect` fetching
- [ ] DF-2 Suspense boundary paired with an error boundary, placed where the layout absorbs it
- [ ] DF-3 Server Actions validate input server-side and revalidate after writing
- [ ] DF-5 Independent requests parallelized, no accidental waterfall
- [ ] Next.js 15: `params` and `searchParams` awaited

## TypeScript

- [ ] TS-1 No `any`, `unknown` plus narrowing where the type is open
- [ ] TS-2 Variant-specific props encoded in the union
- [ ] TS-3 Children typed with the right renderable type
- [ ] TS-5 `strict: true`, refs optional-chained, `tsc --noEmit` clean

## Styling and accessibility

- [ ] UI-2 No new inline style objects per render
- [ ] UI-3 Semantic elements, keyboard operable, visible focus, labels present, not color-only state
- [ ] UI-4 Mobile and dark mode both verified

## Architecture

- [ ] AR-1 Feature-based layout, no dumping grounds
- [ ] AR-2 Cross-feature imports go through the feature `index.ts`, no app-wide barrels
- [ ] AR-3 No import cycles
- [ ] AR-4 Business logic outside components
- [ ] AR-5 Error boundary per feature
- [ ] AR-6 Env parsed and validated at startup

## Testing

- [ ] TQ-1 Behavior tested through role and text queries
- [ ] TQ-3 Interaction driven by `user-event`, no `act()` warnings
- [ ] TQ-5 Lint and type-check enforced in CI
- [ ] Refactors preceded by characterization tests

## Security and production

- [ ] SP-1 No unsanitized HTML injection
- [ ] SP-2 No secret reachable from the client bundle
- [ ] SP-3 Loading, empty, error, and success all handled
- [ ] SP-4 Effects safe under Strict Mode double invocation
- [ ] SP-5 Errors logged with context and rethrown, nothing swallowed, no secrets logged

## Severity

| Level | Meaning |
|---|---|
| Blocker | Data loss, security exposure, broken build, or an unhandled error state reachable by a user |
| Major | Rule violation that will cause a bug or a painful refactor later |
| Minor | Rule violation with contained blast radius |
| Note | Preference or future consideration, explicitly not required |
