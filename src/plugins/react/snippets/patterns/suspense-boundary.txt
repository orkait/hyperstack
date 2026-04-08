import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function Page() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<Skeleton />}>
        <AsyncDataComponent />
      </Suspense>
    </ErrorBoundary>
  );
}