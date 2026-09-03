# Testing and Quality (TQ-1 .. TQ-5)

## TQ-1: Real client, real database

```python
import pytest
from httpx import ASGITransport, AsyncClient

@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
```

`AsyncClient(app=app)` is deprecated in httpx; the explicit transport is the supported form and needs
httpx 0.27.2 or later for clean typing. `TestClient` remains fine for synchronous tests.

Run against a real Postgres (testcontainers, or a disposable database in CI), not SQLite and not a
mocked session. Half the bugs worth catching are dialect, constraint, and transaction behavior, and a
mock asserts only that the code called what the test expected it to call.

Async plugin: `pytest-asyncio` with `asyncio_mode = "auto"` for an asyncio-only service, or the `anyio`
plugin when Trio also matters. Both in auto mode conflict; choose one.

## TQ-2: Generated test data, not hand-written dicts

```python
from polyfactory.factories.pydantic_factory import ModelFactory

class UserCreateFactory(ModelFactory[UserCreate]):
    __model__ = UserCreate

payload = UserCreateFactory.build(email="known@example.com")
```

The factory tracks the schema, so adding a required field breaks the factory once rather than breaking
forty tests. Override only the fields the test is actually about; everything else being arbitrary is
the point.

## TQ-3: Test the contract, status code and schema

```python
async def test_create_user(client: AsyncClient) -> None:
    resp = await client.post("/api/v1/users/", json=UserCreateFactory.build().model_dump(mode="json"))
    assert resp.status_code == 201
    body = UserResponse.model_validate(resp.json())
    assert set(resp.json()) == set(UserResponse.model_fields)
```

Validating the body against the response model catches a schema regression that a field-by-field
assertion misses. The exact-keys assertion is what catches a leaked internal field (SE-6).

Every endpoint owes at least: the success case, the validation failure (422), the authorization failure
(401 or 403), and the not-found case where one exists.

## TQ-4: Strict type checking in CI

`mypy --strict` or `pyright --strict` over the application package, as a gate, not a suggestion.
FastAPI and Pydantic are fully typed, so strict mode actually finds things: an unawaited coroutine, an
optional that is never checked, a response model that cannot be built from what the function returns.

Astral's `ty` is fast and still beta; run it as an extra signal if you like, but the gate stays mypy or
pyright until its 1.0.

## TQ-5: Ruff for lint and format

```toml
[tool.ruff]
line-length = 100
target-version = "py312"   # match the project's actual minimum

[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "ASYNC", "S", "SIM", "RUF"]
```

One tool replaces flake8, isort, and black. `ASYNC` catches blocking calls inside `async def` (AS-2),
`S` is the bandit security rule set, and `UP` keeps syntax current with the target version. Wire it
into pre-commit and CI so the gate is not a habit.
