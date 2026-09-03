# Production and Observability (OB-1 .. OB-7)

## OB-1: Structured logging

```python
import structlog

log = structlog.get_logger()
log.info("user_created", user_id=str(user.id), tenant_id=tenant.id, duration_ms=elapsed)
```

Events are named, fields are typed key-values, output is JSON in production and human-readable
locally. An interpolated sentence cannot be filtered, aggregated, or alerted on.

Never log secrets, tokens, full request bodies containing personal data, or password fields. `SecretStr`
(CF-5) makes that harder to do by accident.

## OB-2: Request id and timing middleware

Accept an inbound `X-Request-ID` when present, generate one when absent, bind it into the log context
for the request, return it on the response, and propagate it to downstream calls. Log method, path,
status, and duration once per request.

This is what turns a user's screenshot of an error into a log query (ER-2).

## OB-3: Health and readiness are different endpoints

```python
@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}

@router.get("/ready")
async def ready(db: DbSession) -> dict[str, str]:
    await db.execute(text("SELECT 1"))
    return {"status": "ready"}
```

Liveness answers "is the process alive", so it touches nothing. Readiness answers "can it serve
traffic", so it checks the dependencies it cannot work without. Wiring the database into liveness is
how one slow query restarts every pod at once.

Keep readiness cheap and give it a timeout: a probe that hangs is a probe that fails.

## OB-4: Tracing and error tracking

OpenTelemetry spans across the request, the database calls, and outbound HTTP; Sentry or equivalent for
exceptions with the request id attached. Sample traces in production rather than dropping them
entirely, because the trace you need is the slow one, and tail-based sampling is what keeps it.

## OB-5: Control what the docs expose

```python
app = FastAPI(
    docs_url="/docs" if settings.debug else None,
    redoc_url=None,
    openapi_url="/openapi.json" if settings.debug else None,
)
```

Public interactive docs advertise the whole surface, including admin routes. Either disable them
outside development or put them behind the same auth as the rest.

Where docs stay on, invest in them: `description`, `summary`, `response_model`, examples, and
`Annotated` metadata are what make the generated schema usable by a client generator.

## OB-6: Timeouts everywhere, and a graceful shutdown

Every outbound HTTP client, database pool, and cache client gets an explicit timeout. A default of
"wait forever" turns one slow dependency into a saturated worker pool.

Shutdown drains in-flight requests inside the `lifespan` teardown (PS-4), closes pools, and flushes
telemetry, bounded by a deadline shorter than the orchestrator's kill timeout.

## OB-7: Container image and process model

```dockerfile
FROM python:3.13-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project
COPY . .
RUN uv sync --frozen --no-dev --no-editable

FROM python:3.13-slim
RUN useradd -m -u 10001 appuser
WORKDIR /app
COPY --from=builder --chown=appuser:appuser /app /app
ENV PATH="/app/.venv/bin:$PATH"
USER appuser
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Multi-stage keeps build tooling out of the runtime image, dependencies install before the source copy
so the layer cache survives a code change, and the process runs as a non-root user.

Process model: on Kubernetes, one worker per pod and let replicas scale, since the orchestrator is
already a process manager. On a bare VM or a single container, Gunicorn with
`uvicorn.workers.UvicornWorker` and workers roughly equal to available cores. Pick from the target
environment, not from a blog post.
