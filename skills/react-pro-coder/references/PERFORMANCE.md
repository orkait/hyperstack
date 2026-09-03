# Performance (PF-1 .. PF-6)

## PF-1: Measure before optimizing

React DevTools Profiler for render cost, Lighthouse or field data for Core Web Vitals, a bundle
analyzer for weight. No `memo` without a profile that shows the render mattered. Optimizing an
unmeasured path adds complexity and buys nothing.

Targets worth naming in a performance task: LCP under 2.5s, INP under 200ms, CLS under 0.1.

## PF-2: Keys must be stable, unique, and not the index

Index keys are correct only for a list that never reorders, filters, sorts, or removes from the middle.
Everything else needs the entity id. The failure mode is state attaching to the wrong row, which reads
as a data bug and is a key bug.

```tsx
// BAD
{items.map((item, i) => <Item key={i} />)}

// GOOD
{items.map(item => <Item key={item.id} />)}
```

## PF-3: Do not break memoization by accident

A memoized child re-renders anyway if it receives a new object, array, or function identity every
render. Memoize the props or hoist them out of the component. This is the one case where H-3 does not
require a separate profile: the memo on the child is the measurement.

## PF-4: Lazy load routes and heavy components

Charts, editors, maps, and modal-only trees load on demand.

```tsx
const HeavyChart = lazy(() => import('./HeavyChart'));

<Suspense fallback={<Skeleton />}>
  <HeavyChart />
</Suspense>
```

The fallback must reserve the final layout to protect CLS.

## PF-5: Virtualize long lists

Past roughly 100 rows, render a window, not the list. `react-window`, `virtua`, or TanStack Virtual.
Virtualization changes find-in-page and screen reader behavior, so pair it with the accessibility check
in UI-3.

## PF-6: Keep the bundle small

Import from the specific path so tree-shaking works: `import { debounce } from 'lodash-es'`, not the
whole package. Audit with the analyzer before adding a dependency that duplicates something already
installed. Prefer moving work to the server (DF-1) over shipping a faster client implementation.
