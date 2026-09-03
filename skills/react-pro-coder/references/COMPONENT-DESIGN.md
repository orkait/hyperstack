# Component Design (CD-1 .. CD-8)

## CD-1: Single responsibility

One component, one job. If describing it needs the word "and", split it.

## CD-2: Keep components under 100 lines

Past 100 lines, extract. Small components are easier to test, memoize, and delete. The line count is a
smell detector, not a lint rule: a 120-line component with one coherent job is fine, an 80-line one
doing three jobs is not.

```tsx
// BAD: one component fetches, filters, renders a table, renders charts, owns modals
function Dashboard() { /* 300 lines */ }

// GOOD
function Dashboard() {
  return (
    <>
      <DashboardFilters />
      <DashboardTable />
      <DashboardCharts />
    </>
  );
}
```

## CD-3: Composition over prop spaghetti

Fifteen props is a design failure. Expose slots.

```tsx
// BAD
<Card title="..." subtitle="..." footer="..." action="..." icon="..." />

// GOOD
<Card>
  <Card.Header><Card.Title>...</Card.Title></Card.Header>
  <Card.Body>...</Card.Body>
  <Card.Footer><Button /></Card.Footer>
</Card>
```

## CD-4: Colocate

State, styles, types, and helpers live next to their only consumer. A shared `/components` or `/hooks`
directory is a dumping ground unless the thing in it is genuinely shared. See AR-1 for the
feature-based layout this implies.

## CD-5: Minimal props API

Props are explicit, predictable, and few. One `variant` union beats five booleans, and it makes the
impossible combinations unrepresentable.

```tsx
// BAD
<Button primary large rounded disabled />

// GOOD
type ButtonProps = { variant: 'primary' | 'secondary'; size: 'sm' | 'md' | 'lg' };
<Button variant="primary" size="lg" />
```

## CD-6: No prop drilling past 2 levels

If a prop crosses two intermediate components that do not read it, those components are coupled to data
they do not use. Fix with composition (pass the rendered child down), injected context for stable
values, or a Zustand selector for shared mutable state.

## CD-7: Pure render

Same props, same output. No side effects, no mutation, no `Math.random()` or `Date.now()` in the render
body. Impure render breaks Strict Mode double-invocation, memoization, and server rendering hydration.
Generate ids with `useId`, generate randomness in an effect or on the server.

## CD-8: Guard at the boundary

Handle invalid, empty, and error states at the top of the component and return early. The happy path
below stays flat.

```tsx
if (error) return <ErrorState error={error} />;
if (!user) return <EmptyState />;
```

Every fetch-backed component owes four states: loading, empty, error, success. Enforced by SP-3.
