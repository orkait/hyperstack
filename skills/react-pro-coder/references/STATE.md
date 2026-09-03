# State Management (ST-1 .. ST-5)

The hierarchy, strictly ordered. Place state at the first level that can hold it.

| Level | Home | Use for |
|---|---|---|
| 1 | URL (`searchParams`, `pathname`) | Anything shareable, linkable, or restorable: filters, tabs, pagination, selected id |
| 2 | Server state (RSC fetch, TanStack Query, SWR) | Anything that came from the server |
| 3 | Local component state | Anything one subtree owns |
| 4 | Shared client state (Zustand) | Cross-tree client state with no server owner |
| 5 | Context | Injection only: theme, auth token, i18n, feature flags |

Redux is prohibited. Jotai is acceptable where the state is genuinely atom-shaped.

## ST-1: Local first

Start at the lowest level that works. Promote only when a second consumer appears outside the subtree,
and promote to the lowest level that serves both.

## ST-2: Colocate state as low as possible

Form state belongs to the form, not to a global store. A global store entry that exactly one component
reads is a bug in placement.

## ST-3: Immutable updates always

Never mutate. Spread, or use Immer for deep updates. Mutation defeats reference equality, so memoized
children stop updating and the bug looks like a render problem.

```tsx
// BAD
state.user.name = 'New';

// GOOD
setState(s => ({ ...s, user: { ...s.user, name: 'New' } }));
```

## ST-4: Make impossible states impossible

Model with a discriminated union, not a bag of independent booleans. `isLoading && error && data` has
eight combinations, six of which are nonsense.

```tsx
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: Error };
```

Switch exhaustively over `status` and let TypeScript prove that every state renders something.

## ST-5: Server state is not client state

Server data is a cache of something you do not own: it goes stale, refetches, retries, and needs
invalidation. Client UI state is owned outright. Keep them in different systems (TanStack Query or SWR
versus `useState`/Zustand) and never copy server data into client state "so it can be edited". Hold the
draft separately and reconcile on submit.

Deriving values from state is covered by H-5. It applies here identically: no duplicated derived state
in any store.
