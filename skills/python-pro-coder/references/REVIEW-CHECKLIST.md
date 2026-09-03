# Review and Audit Checklist

Run top to bottom. Report each finding as `path:line - RULE-ID - problem - fix`. Rules that do not
apply are skipped silently; a deliberate waiver is reported with its reason.

## Structure

- [ ] PS-1 Feature folders, not top-level layer folders
- [ ] PS-3 Routers thin: no queries, no business branching
- [ ] PS-4 `lifespan`, no `@app.on_event`
- [ ] PS-5 `main.py` wires only

## Pydantic

- [ ] PD-1 No v1 syntax: `class Config`, `@validator`, `.dict()`, `.parse_obj()`
- [ ] PD-2 Create, Update, Response, and DB models separate
- [ ] PD-3 `Field` constraints and descriptions where they matter, `default_factory` for mutables
- [ ] PD-5 Validators raise `ValueError`, `mode="after"` unless raw reshaping is needed
- [ ] PD-6 Derived values computed, not stored
- [ ] PD-8 `from_attributes` on response models, `extra="forbid"` on inputs

## Endpoints

- [ ] EP-1 `response_model` and explicit status code on every route
- [ ] EP-2 `Annotated` dependency aliases
- [ ] EP-3 Defaults with `=`, never `Query(default=...)` inside `Annotated`
- [ ] EP-4 Background tasks only for work that may be lost
- [ ] EP-5 Router to service to repository, one direction
- [ ] EP-6 Version prefix on the mount

## Settings

- [ ] CF-1 One `BaseSettings`, no scattered `os.getenv`
- [ ] CF-2 One settings access pattern, overridable in tests
- [ ] CF-4 `extra="forbid"` on input models
- [ ] CF-5 Precise types: `EmailStr`, `HttpUrl`, `UUID`, `Decimal` for money, `SecretStr` for secrets

## Dependencies

- [ ] DI-1 One dependency, one job
- [ ] DI-3 Session dependency rolls back and closes, does not commit
- [ ] DI-3 No bare `except:`
- [ ] DI-4 Everything acquired is released after `yield`

## Async and performance

- [ ] AS-1 Execution model consistent per route
- [ ] AS-2 No blocking call inside `async def`
- [ ] AS-4 Every list endpoint paginated with a bounded limit
- [ ] AS-5 Eager loading where a relationship is used, no N+1

## Security

- [ ] SE-1 `pwdlib`, not `passlib`, hashes never returned or logged
- [ ] SE-2 Maintained JWT library, explicit `algorithms`, `exp`/`iss`/`aud` verified, short lifetimes
- [ ] SE-3 Built-in security utilities, authorization in a dependency
- [ ] SE-4 CORS origins, methods, and headers listed explicitly
- [ ] SE-5 Rate limit on auth and expensive endpoints, keyed on something trustworthy
- [ ] SE-6 No internal model or ORM object returned

## Errors

- [ ] ER-1 Service layer free of `HTTPException`, domain errors mapped at the edge
- [ ] ER-2 No traceback, SQL, or path in a production response; correlation id present
- [ ] ER-3 422 detail preserved, validators raise `ValueError`
- [ ] ER-4 Creating writes idempotent where retries are plausible

## Database

- [ ] DB-1 SQLAlchemy 2.0 style, `select()` not legacy `Query`
- [ ] DB-2 One persistence pattern
- [ ] DB-3 Alembic migration with a downgrade, no `create_all` outside tests
- [ ] DB-4 Queries in repositories
- [ ] DB-5 Transaction boundary in the service, repository never commits

## Testing and quality

- [ ] TQ-1 `ASGITransport`, real database, one async plugin
- [ ] TQ-3 Contract tests: status code, schema validation, exact response keys
- [ ] TQ-4 `mypy --strict` or `pyright --strict` green in CI
- [ ] TQ-5 Ruff lint and format in CI, `ASYNC` and `S` rule sets enabled

## Production

- [ ] OB-1 Structured logs, no secrets
- [ ] OB-2 Request id propagated and returned
- [ ] OB-3 Liveness cheap, readiness checks dependencies
- [ ] OB-5 Docs closed or authenticated outside development
- [ ] OB-6 Explicit timeouts, graceful shutdown
- [ ] OB-7 Non-root multi-stage image, process model matched to the platform

## Severity

| Level | Meaning |
|---|---|
| Blocker | Data loss, auth bypass, secret exposure, unbounded query on a production path |
| Major | Rule violation that will cause an incident or an expensive migration |
| Minor | Rule violation with contained blast radius |
| Note | Preference or future consideration, explicitly not required |
