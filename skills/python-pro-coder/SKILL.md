---
name: python-pro-coder
category: domain
description: Staff-level Python API engineering discipline for FastAPI + Pydantic v2 + SQLAlchemy 2.0 - 60 enforced rules across project structure, Pydantic modelling, endpoint design, settings, dependency injection, async and performance, security, error handling, database access, testing, and production observability, plus a version-verified stack file that names the dead dependencies (python-jose, passlib, on_event) and their replacements. Use when writing, reviewing, refactoring, debugging, or auditing FastAPI or Pydantic code, when designing an API surface or its schemas, when choosing async versus sync, or when asked for Python API best practices or an audit.
references:
  - references/PROJECT-STRUCTURE.md
  - references/PYDANTIC.md
  - references/ENDPOINTS.md
  - references/CONFIG-VALIDATION.md
  - references/DEPENDENCIES.md
  - references/ASYNC-PERFORMANCE.md
  - references/SECURITY.md
  - references/ERRORS.md
  - references/DATABASE.md
  - references/TESTING.md
  - references/OBSERVABILITY.md
  - references/REVIEW-CHECKLIST.md
  - references/OUTPUT-CONTRACT.md
  - references/TEMPLATES.md
  - references/STACK-2026.md
---

# Python Pro Coder (SDE-3, FastAPI + Pydantic v2 + SQLAlchemy 2.0)

## The Iron Law

```
NO DEPENDENCY RECOMMENDATION WITHOUT references/STACK-2026.md
```

The Python API ecosystem rots faster than memory updates. `python-jose` is abandoned with a live CVE,
`passlib` breaks on Python 3.13, `@app.on_event` has been deprecated since FastAPI 0.93, and
`AsyncClient(app=app)` is deprecated in httpx. Every one of those is still the first result an agent
recalls. Read the stack file before naming a package or a version, and re-verify anything in it older
than a quarter.

Scope is HTTP API services. Data science, notebooks, CLI tools, and library packaging are out of
scope: the typing, testing, and structure rules transfer, the FastAPI-specific ones do not.

## Rationalization table

| Excuse | Reality |
|---|---|
| "I know the FastAPI patterns" | The patterns you know are the 2023 ones. Three of them are deprecated. |
| "It is one endpoint" | One endpoint without `response_model` is one endpoint leaking `hashed_password`. |
| "The tutorial used `python-jose`" | The tutorial predates the abandonment. FastAPI's own docs moved to PyJWT. |
| "Async is faster, make it all async" | AS-1: one blocking call inside `async def` stalls the whole loop. Consistency beats the label. |
| "Mocking the database is faster" | TQ-1: mocks assert that your code called what you expected. Constraints and dialects are where the bugs are. |
| "Pagination can come later" | AS-4: later is when a tenant reaches a million rows and takes the process down. |
| "I will add the migration after" | DB-3: `create_all` in production has no downgrade and no history. |

## Step 0: Environment gate (always first)

```bash
python -V                      # 3.10 is the floor for FastAPI 0.141
uv pip list | grep -Ei 'fastapi|pydantic|sqlalchemy|httpx'
ruff check . && ruff format --check .
mypy --strict app/             # or pyright --strict
pytest -q
```

Defaults when the project has not decided:

| Concern | Default |
|---|---|
| Framework | FastAPI, one router per feature |
| Validation | Pydantic v2 + pydantic-settings |
| ORM | SQLAlchemy 2.0 async + Alembic + asyncpg |
| Auth | PyJWT or joserfc + pwdlib, OAuth2 password bearer |
| Tests | pytest + httpx `ASGITransport` + polyfactory + testcontainers |
| Quality | Ruff (lint + format), mypy or pyright strict |
| Packaging | uv |
| Observability | structlog + OpenTelemetry + Sentry |

## Step 1: Task classification (exactly one)

| Class | Trigger words |
|---|---|
| New Feature | add endpoint, new service, create model, scaffold |
| Refactor | restructure, split, extract, migrate, clean up |
| Bug Fix | fix, 500, failing, regression, race, leak |
| Performance | slow, N+1, timeout, throughput, blocking |
| Review/Audit | review, audit, security check, schema check |
| Documentation Only | document, explain, write up |

Unclear class means stop and ask.

## Step 2: Architecture-first order (never skip a layer)

Boundaries, invariants, data ownership, transaction scope, public API surface (routes and schemas),
module layout, files, functions, syntax. The transaction boundary is decided before the first query is
written.

Router to service to repository. Three layers, one direction.

## Step 3: The rule set

| Domain | Rules | Reference |
|---|---|---|
| Project structure | PS-1..PS-5 | `references/PROJECT-STRUCTURE.md` |
| Pydantic v2 | PD-1..PD-8 | `references/PYDANTIC.md` |
| Endpoint design | EP-1..EP-6 | `references/ENDPOINTS.md` |
| Settings and validation | CF-1..CF-5 | `references/CONFIG-VALIDATION.md` |
| Dependency injection | DI-1..DI-4 | `references/DEPENDENCIES.md` |
| Async and performance | AS-1..AS-5 | `references/ASYNC-PERFORMANCE.md` |
| Security | SE-1..SE-6 | `references/SECURITY.md` |
| Error handling | ER-1..ER-4 | `references/ERRORS.md` |
| Database and ORM | DB-1..DB-5 | `references/DATABASE.md` |
| Testing and quality | TQ-1..TQ-5 | `references/TESTING.md` |
| Production and observability | OB-1..OB-7 | `references/OBSERVABILITY.md` |

Read the file for the domain being touched before writing code in it.

## Step 4: Forbidden patterns (hard stops)

| Pattern | Instead |
|---|---|
| `@app.on_event("startup")` | `lifespan` async context manager (PS-4) |
| Pydantic v1 `class Config`, `@validator`, `.dict()`, `.parse_obj()` | `ConfigDict`, `@field_validator`, `.model_dump()`, `.model_validate()` (PD-1) |
| One model for request, response, and ORM row | Separate Create / Update / Response / DB models (PD-2) |
| `Query(default=...)` inside `Annotated` | Default with `=` on the parameter. The other form raises `AssertionError` at import (EP-3) |
| Blocking calls in `async def` | `await`, or `run_in_threadpool` (AS-2) |
| Unbounded list endpoints | Mandatory pagination with a bounded limit (AS-4) |
| `Base.metadata.create_all()` in production | Alembic migration with a downgrade (DB-3) |
| Returning an ORM object from a route | A response schema (SE-6) |
| `python-jose`, `passlib` | PyJWT or joserfc, and pwdlib (SE-1, SE-2) |
| `AsyncClient(app=app)` in tests | `AsyncClient(transport=ASGITransport(app=app))` (TQ-1) |
| `datetime.utcnow()` | `datetime.now(UTC)`, deprecated since Python 3.12 |
| Bare `except:` | `except Exception:` at minimum (DI-3) |
| `os.getenv` scattered through the code | One `BaseSettings` object (CF-1) |

## Step 5: Tests are part of the output

Every endpoint owes a contract test: status code, response validated against the response model, and
the exact key set. Plus the validation failure, the authorization failure, and the not-found case.
Composes with `test-first` for ordering and `ship-gate` for evidence.

## Step 6: Output contract and negative doubt

Follow `references/OUTPUT-CONTRACT.md`. The negative-doubt routine runs before finalizing, and its hard
stop applies: if correctness is still uncertain after the second pass, return the revised design and
the missing inputs instead of code.

## Review and audit mode

`references/REVIEW-CHECKLIST.md` is the pass list, keyed to rule IDs, with the severity scale. Report
findings as `path:line - RULE-ID - problem - fix`. Scaffolds in `references/TEMPLATES.md`.

## Boundaries with other skills

| Concern | Owner |
|---|---|
| Whether the feature should exist | `pm-gate` |
| Vulnerability hunting across a codebase | `security-review`. SE-1..SE-6 are build-time rules, not an audit |
| Algorithmic complexity of a hot path | `optimizer` |
| Completion claims and verification evidence | `ship-gate` |
| Frontend consuming this API | `react-pro-coder` |

This skill owns the service-side engineering decision: layering, schemas, transaction boundaries, async
model, error surface, and what the API is allowed to return.
