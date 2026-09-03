# Styling and Accessibility (UI-1 .. UI-4)

## UI-1: Colocate styles

Tailwind classes in the JSX, or a CSS Module beside the component. No growing global stylesheet, no
styles for a component living three directories away from it.

## UI-2: No new style objects every render

```tsx
// BAD: a new object identity every render, and it defeats memoized children
<div style={{ marginTop: 10 }} />

// GOOD
<div className="mt-2.5" />
```

Prefer a class. If an inline style is genuinely dynamic, hoist the static part to a module constant and
only compute the variable part. Reach for `useMemo` here only when the object feeds a memoized child
(PF-3); otherwise the class solves it with no hook at all.

## UI-3: Accessible by default

- Semantic elements: `button` for actions, `a` for navigation, `div` with `onClick` never.
- Every interactive element reachable and operable by keyboard, with a visible focus indicator.
- Labels tied to inputs, `aria-*` only where semantics do not already say it.
- Focus trapped in modals and returned to the trigger on close.
- Never signal state by color alone. Add text, icon, or shape.
- Touch targets at least 44x44px.

Accessibility is verified in tests through role and name queries (TQ-1), which is why those queries are
mandatory rather than stylistic.

## UI-4: Responsive and dark mode from day one

Design mobile-first. Test keyboard and dark mode in the first pass, not in a cleanup pass, because
retrofitting either usually means changing the markup.

For the visual system itself (type scale, color ramps, spacing grid, elevation, motion), defer to the
`ui-ux` and `design-tokens` skills rather than restating their rules here.
