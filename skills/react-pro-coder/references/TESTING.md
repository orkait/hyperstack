# Testing and Quality (TQ-1 .. TQ-5)

Stack: Vitest + Testing Library for units and components, Playwright for flows.

## TQ-1: Test behavior, not implementation

Query by role, label, and text. Never by class name, test id where a role exists, or internal state.

```tsx
expect(screen.getByRole('button', { name: /save/i })).toBeEnabled();
```

A test that breaks on a refactor with no behavior change was testing the wrong thing. Role-based
queries double as the accessibility check for UI-3.

## TQ-2: Sensible coverage

Roughly 80% on utilities, hooks, and reducers, where the logic is. Do not chase 100% on components;
cover the critical paths, the four states from CD-8, and every branch a user can reach. Coverage is a
diagnostic, not a target to game.

## TQ-3: No `act()` warnings, drive with user-event

```tsx
import userEvent from '@testing-library/user-event';
await userEvent.click(button);
```

`user-event` dispatches the full event sequence a real user produces and handles the act wrapping.
`fireEvent` is the fallback for events `user-event` cannot express.

## TQ-4: Storybook for visual components

Develop shared UI in isolation, with a story per variant and per state, including the empty and error
ones. Stories are also the cheapest place to check dark mode and keyboard focus (UI-4).

## TQ-5: Lint rules are enforced, not advisory

- `eslint-plugin-react-hooks` with `exhaustive-deps` as an error
- `import/no-cycle` (AR-3)
- import order
- no `console.log` in production code
- no `any`, no unused variables
- `npx tsc --noEmit` in CI

## Refactor rule

Before changing structure, characterization tests must exist and pass. If they do not exist, writing
them is the first commit of the refactor, not an optional preliminary.
