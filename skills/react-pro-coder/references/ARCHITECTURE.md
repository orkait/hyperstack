# Architecture (AR-1 .. AR-6)

## AR-1: Feature-based structure, not type-based

```
features/auth/components/
features/auth/hooks/
features/auth/api/
features/auth/index.ts
```

not a top-level `components/`, `hooks/`, `utils/` that every feature dumps into. Type-based folders
scatter one feature across the tree, so a change touches five directories and deletion is never safe.
Genuinely shared primitives (design system components, the `cn` helper) still live in a shared
location; the test is whether a second feature actually uses it today.

## AR-2: Public API per feature, and the barrel exception

A feature exposes what others may use through its own `index.ts` and nothing else. Reaching into
`features/auth/hooks/useSession` from another feature is a boundary violation.

This is the one place a barrel file is allowed, and it comes with conditions: the barrel covers a
single feature, re-exports named symbols only, and the package sets `sideEffects: false` so the bundler
can drop what is unused. App-wide barrels (`components/index.ts` re-exporting everything) remain
forbidden: they pull the whole tree into every importer and defeat tree-shaking. Inside a feature,
import directly.

## AR-3: No circular dependencies

If A imports B and B imports A, the shared piece belongs in C. Cycles break tree-shaking, produce
undefined-at-import bugs that only appear in one bundler, and mean the boundary was drawn wrong. Add a
cycle check to lint (`import/no-cycle`) rather than finding them by hand.

## AR-4: Separate UI from business logic

Components render. Hooks and plain functions decide. A rule that lives in a component can only be
tested by rendering it; the same rule in a function is tested directly and reused on the server.

## AR-5: Error boundaries at feature level

Wrap each major feature, not only the app root. A root-only boundary turns one broken widget into a
blank page. Pair boundaries with the Suspense boundaries from DF-2 so loading and failure are handled
at the same granularity. Report the error from the boundary (SP-5); do not swallow it into a generic
message with no telemetry.

## AR-6: Validate environment config at startup

```tsx
const env = z.object({ API_URL: z.string().url() }).parse(process.env);
```

Fail fast at boot with a message naming the missing variable, rather than failing at 3am inside a
request with `undefined is not a URL`. Keep the server schema and the public schema separate so a
server-only secret cannot leak into the client bundle (SP-2).
