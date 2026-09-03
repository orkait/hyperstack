# Stack Facts

Every line here was verified on 2026-09-04 against the package registry or the project's own docs. When
a version or a maintenance claim drives a recommendation, read this file rather than recalling a
number. Re-verify anything older than a quarter.

## Versions

| Package | Version | Notes |
|---|---|---|
| FastAPI | 0.141.1 | requires Python >= 3.10 |
| Pydantic | 2.13.5 | v2 only, v1 syntax is a hard stop |
| pydantic-settings | 2.15.0 | requires Python >= 3.10 |
| SQLAlchemy | 2.0.52 | 2.0 style: `Mapped`, `mapped_column`, `select()` |
| Python | 3.14.7 latest stable | free-threaded build officially supported (PEP 779), no longer experimental |

Support floor for a new service: Python 3.12. Python 3.10 only when an existing deployment pins it.

## Dead or dying dependencies

| Package | Status | Replacement |
|---|---|---|
| `python-jose` | Abandoned, last release years old. CVE-2024-33664 (JWE decompression denial of service). FastAPI's own docs moved off it | `PyJWT` for JWS and JWT, `joserfc` when JWE, JWK, or full JOSE is needed |
| `passlib` | Unmaintained, breaks on Python 3.13+ | `pwdlib` with `PasswordHash.recommended()`. Keep passlib only to verify legacy hashes during a migration |
| `@app.on_event` | Deprecated since FastAPI 0.93 | `lifespan` async context manager |
| `AsyncClient(app=...)` | Deprecated in httpx | `AsyncClient(transport=ASGITransport(app=app))`, needs httpx >= 0.27.2 for clean typing |
| `datetime.utcnow()` | Deprecated since Python 3.12 | `datetime.now(UTC)` |

## Choices that are genuinely open

| Decision | Options | How to choose |
|---|---|---|
| Type checker | mypy, pyright, ty, pyrefly | mypy or pyright in strict mode is the safe default. Astral's `ty` is fast but still beta with a 1.0 targeted for 2026; treat it as an extra check, not the gate |
| Async test plugin | pytest-asyncio, anyio | pytest-asyncio with `asyncio_mode = "auto"` for an asyncio-only service. anyio when the code must also run on Trio. Running both plugins in auto mode conflicts, pick one |
| ORM shape | SQLAlchemy + separate Pydantic schemas, or SQLModel | SQLAlchemy plus separate schemas for anything with a non-trivial schema divergence between table and API. SQLModel is maintained and convenient, still pre-1.0 (0.0.x). Pick one and do not mix three shapes (DB-2) |
| Rate limiting | slowapi, fastapi-limiter, gateway or ingress level | Prefer the edge (gateway, ingress, CDN). In-process, `slowapi` is decorator-based and self-describes as alpha quality; `fastapi-limiter` is Redis-backed and dependency-based. Either is acceptable, neither is a substitute for an edge limit (SE-5) |
| Process model | Gunicorn with Uvicorn workers, or Uvicorn directly | Bare VM or single container: Gunicorn with `uvicorn.workers.UvicornWorker`, workers roughly equal to cores. Kubernetes: one Uvicorn worker per pod and let the orchestrator scale replicas (OB-7) |
| JSON response class | stdlib, `ORJSONResponse` | `ORJSONResponse` when payloads are large or hot. Measure before assuming it matters |

## Sources

- https://pypi.org/project/fastapi/
- https://pypi.org/project/pydantic/
- https://pypi.org/project/pydantic-settings/
- https://pypi.org/project/sqlalchemy/
- https://www.python.org/downloads/
- https://fastapi.tiangolo.com/advanced/async-tests/
- https://github.com/fastapi/fastapi/discussions/11345 (python-jose replacement)
- https://github.com/fastapi/fastapi/discussions/11773 (passlib status)
- https://github.com/frankie567/pwdlib/discussions/1
- https://docs.astral.sh/uv/guides/integration/docker/
