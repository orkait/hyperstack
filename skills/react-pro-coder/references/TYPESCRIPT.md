# TypeScript with React (TS-1 .. TS-5)

## TS-1: Type props explicitly, never `any`

```tsx
type Props = { user: User; onSelect: (id: string) => void };
```

When the type is genuinely unknown, use `unknown` and narrow. `any` disables checking silently and
spreads through every value it touches.

## TS-2: Discriminate variants

Encode "this prop is required only for that variant" in the type, not in a comment or a runtime check.

```tsx
type AlertProps =
  | { variant: 'success'; onRetry?: never }
  | { variant: 'error'; onRetry: () => void };
```

This is CD-5 and ST-4 applied to the props surface.

## TS-3: Type children correctly

`ReactNode` for anything renderable, `ReactElement` when exactly one element is required,
`PropsWithChildren<P>` for the common case. Do not type children as `JSX.Element` when a string or an
array is also valid.

## TS-4: Generic components for real reuse

```tsx
function Select<T extends { id: string }>({ options }: { options: T[] }) { /* ... */ }
```

Constrain the parameter so the component can rely on the shape. A generic with no constraint is `any`
wearing a hat.

## TS-5: Strict null checks

`strict: true` in tsconfig, no exceptions per file. Refs are nullable until mounted, so
`ref.current?.focus()`. Optional chain at the boundary where the value can actually be absent, not
everywhere out of habit, since a chain over a value that should exist hides the bug instead of
reporting it.

`npx tsc --noEmit` runs in CI and is part of the definition of done.
