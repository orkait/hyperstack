# Hooks (H-1 .. H-7)

## H-1: The rules of hooks are law

Top level only, React functions only. Enforce with `eslint-plugin-react-hooks`, including
`exhaustive-deps` as an error, not a warning. The one exception is React 19's `use()`, which is allowed
conditionally and inside loops by design (DF-4).

## H-2: Custom hooks for logic, not HOCs or render props

Reusable stateful logic goes in a `useXxx` function. HOCs obscure the component tree and break types;
render props nest badly.

```tsx
function useLocalStorage<T>(key: string, initial: T) { /* ... */ }
```

## H-3: `useMemo` and `useCallback` only after measuring

Memoization costs allocation, dependency comparison, and reading difficulty. Profile first (PF-1). Wrap
when the profiler shows the render is expensive or the value feeds a memoized child (PF-3).

If React Compiler is enabled in the project, verify that before hand-memoizing: the compiler inserts
memoization automatically and manual wrappers become noise.

## H-4: `useEffect` synchronizes with external systems, it does not transform data

If the value can be computed during render, compute it during render.

```tsx
// BAD
const [fullName, setFullName] = useState('');
useEffect(() => { setFullName(`${first} ${last}`); }, [first, last]);

// GOOD
const fullName = `${first} ${last}`;
```

Legitimate effects: subscriptions, DOM measurement, imperative widget setup, analytics, syncing to
`localStorage` or the URL. Not legitimate: data fetching (DF-1), derived values (H-5), reacting to a
prop change by setting state.

## H-5: Derive, do not sync

Never store state that can be computed from props or other state. Two sources of truth drift, and the
sync effect always misses a case. If the derivation is expensive, memoize it (subject to H-3), do not
mirror it into state.

## H-6: Clean up everything

Unsubscribe, abort, clear. Every effect that starts something returns the function that stops it.

```tsx
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  return () => controller.abort();
}, [url]);
```

## H-7: `useReducer` for complex transitions

Three or more related `useState` calls, or transitions with rules about which state may follow which,
belong in a reducer. The reducer is testable without rendering (AR-5) and pairs with the discriminated
union in ST-4.
