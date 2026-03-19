# SSR / SSG Setup

React Flow requires the DOM for measurement. For Next.js or other SSR frameworks:

```tsx
'use client'; // Next.js app dir

import dynamic from 'next/dynamic';

const Flow = dynamic(() => import('./Flow'), { ssr: false });

export default function Page() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Flow />
    </div>
  );
}
```

Or with React.lazy:
```tsx
import { Suspense, lazy } from 'react';
const Flow = lazy(() => import('./Flow'));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading flow...</div>}>
      <Flow />
    </Suspense>
  );
}
```
