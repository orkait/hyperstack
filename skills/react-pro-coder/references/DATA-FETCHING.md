# Data Fetching and React 19 (DF-1 .. DF-5)

## DF-1: Server Components fetch by default

Fetch on the server, ship less JavaScript, keep the credential out of the client.

```tsx
// app/users/page.tsx (Server Component)
export default async function UsersPage() {
  const users = await db.users.findMany();
  return <UsersList users={users} />;
}
```

Client fetching is the exception: user-triggered queries, polling, infinite scroll, anything keyed to
client-only state. Then use TanStack Query or SWR, never a bare `useEffect` (H-4).

## DF-2: Suspense boundaries carry the loading state

Wrap the async subtree instead of threading `isLoading` ternaries through the render. Pair every
Suspense boundary with an error boundary (AR-5) so the failure state is handled at the same level.

Place the boundary where the layout can absorb the swap. A boundary around the whole page turns a slow
widget into a slow page.

## DF-3: Server Actions for mutations

```tsx
'use server';
export async function createUser(formData: FormData) { /* validate, write, revalidate */ }
```

The action validates its own input with Zod: a Server Action is a public endpoint, and client-side
validation is not a check. Revalidate or redirect after the write, never leave the cache stale.

React 19 supplies the client half: `useActionState` for the pending and error result, `useFormStatus`
inside the submit button, `useOptimistic` for the optimistic row. These replace the older pattern of an
effect watching a mutation flag.

## DF-4: `use()` unwraps a promise in render

```tsx
import { use } from 'react';

function Comments({ promise }: { promise: Promise<Comment[]> }) {
  const comments = use(promise);
  return <List data={comments} />;
}
```

Unlike other hooks, `use()` may be called conditionally and inside loops. Start the promise in the
server component and pass it down, so the request begins before the client renders. `use()` is also how
a client component reads the async `params` and `searchParams` of Next.js 15.

## DF-5: No waterfalls, parallelize

```tsx
// BAD: the second request waits on the first for no reason
const user = await getUser();
const posts = await getPosts(user.id);

// GOOD
const [user, posts] = await Promise.all([getUser(), getPosts()]);
```

Sequential await is correct only when the second call genuinely needs the first result. When it does,
consider whether the server can return both in one query.

## Next.js 15 note

`params` and `searchParams` are Promises. Awaiting them is mandatory; destructuring them synchronously
is a runtime error.

```tsx
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
}
```

## SEO

SEO-critical content renders on the server: RSC, SSR, SSG, or ISR. Export `generateMetadata` for
dynamic routes, and treat title, description, canonical, and Open Graph as required output, not polish.
Checklist: `TEMPLATES.md`.
