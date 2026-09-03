# Security and Production (SP-1 .. SP-5)

## SP-1: Never `dangerouslySetInnerHTML` without sanitizing

Sanitize with DOMPurify at the point of render, and sanitize on the server when the content is stored.
If the content can be rendered as structured data instead of HTML, do that and delete the escape hatch.

## SP-2: No secrets in the client bundle

Anything prefixed `NEXT_PUBLIC_` or `VITE_` is public and is shipped to every visitor. Secrets stay in
server-only modules, Server Actions, or route handlers. Keep the public and server env schemas separate
(AR-6), and confirm by searching the built bundle for the value before a release, not after an
incident.

## SP-3: Handle every state

Every data-backed component handles loading, empty, error, and success. Exhaustively, via the
discriminated union in ST-4, so the type checker fails the build when a new state is added and one
branch is missing. "Empty" is a distinct designed state, not a blank area.

## SP-4: Idempotent effects

Effects must be safe to run twice: Strict Mode does exactly that in development, and it is a preview of
remount behavior in production. Guard non-idempotent work, or move it to an event handler or the server
where it belongs. If an effect breaks on double invocation, the effect is wrong, not Strict Mode.

## SP-5: Observability

Meaningful messages, structured context, real error tracking. No silent catch.

```tsx
catch (error) {
  logger.error('Failed to create user', { userId, error });
  throw error;
}
```

Log at the boundary that can add context, rethrow so the caller still sees the failure, and let the
error boundary (AR-5) render the user-facing state. Never log a secret, a token, or full request
bodies containing personal data.
