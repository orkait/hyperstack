# Scaffolds

Starting points, not output to paste unchanged. Every placeholder in `{{braces}}` is replaced, and
every scaffold is then held to the rules in the other reference files.

## Component (client or server)

```tsx
// Add 'use client' only when interactivity requires it (see DF-1).
import * as React from 'react';
import { cn } from '@/lib/cn';
import type { {{ComponentName}}Props } from './{{fileBase}}.types';

export function {{ComponentName}}({ className, ...props }: {{ComponentName}}Props) {
  return (
    <section role="{{role}}" className={cn('{{baseClasses}}', className)} {...props}>
      {{children}}
    </section>
  );
}
```

## Props type

```ts
import * as React from 'react';

export interface {{ComponentName}}Props extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  {{props}}
}
```

## `cn` helper

```ts
// lib/cn.ts
export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ');
}
```

Projects already on `clsx` + `tailwind-merge` keep theirs. Do not introduce a second helper.

## Next.js page with metadata

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '{{title}}',
  description: '{{description}}',
  alternates: { canonical: '{{canonical}}' },
  openGraph: {
    title: '{{ogTitle}}',
    description: '{{ogDescription}}',
    images: ['{{ogImage}}'],
  },
};

export default async function {{PageName}}Page() {
  return (
    <main>
      <h1>{{h1}}</h1>
      {{content}}
    </main>
  );
}
```

Dynamic routes export `generateMetadata` instead of a static `metadata` object.

## Component test

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { {{ComponentName}} } from './{{fileBase}}';

describe('{{ComponentName}}', () => {
  it('renders and is reachable by its accessible role', () => {
    render(<{{ComponentName}}>content</{{ComponentName}}>);
    expect(screen.getByRole('{{role}}')).toBeInTheDocument();
  });
});
```

## SEO checklist

- [ ] Unique title per page, 50 to 60 characters
- [ ] Unique meta description, 160 characters or fewer
- [ ] Canonical URL set
- [ ] Open Graph fields present
- [ ] Semantic landmarks: `main`, `nav`, `header`, `footer`
- [ ] One `h1`, heading levels in order
- [ ] Descriptive `alt` on every meaningful image
- [ ] Navigation uses real `a href`, not router pushes alone
- [ ] Critical content rendered on the server
- [ ] JSON-LD structured data where the content type has a schema

## Audit report

```
# React / Next.js Audit

<one paragraph: what was audited, what the headline finding is>

## Environment
Framework, React version, Next.js version, styling, state libraries. Commands run.

## Findings
| # | Location | Rule | Severity | Problem | Fix |
|---|---|---|---|---|---|

## Prioritized recommendations
Ordered by severity, then by effort.

## Risks and trade-offs
What the recommended changes give up.
```

Severity levels are defined in `REVIEW-CHECKLIST.md`.
