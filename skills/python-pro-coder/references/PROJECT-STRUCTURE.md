# Project Structure (PS-1 .. PS-5)

## PS-1: Feature-based structure, not layer-based

```
app/
  features/
    users/
      router.py      # HTTP surface only
      schemas.py     # Pydantic request and response models
      service.py     # business rules, transaction boundary
      repository.py  # queries
      models.py      # SQLAlchemy tables
    auth/
  core/
    config.py
    security.py
    db.py
  main.py
```

not `app/routers/`, `app/models/`, `app/schemas/` at the top. Layer folders scatter one feature across
five directories, so every change is a five-file diff and deleting a feature is never clean. Shared
code lives in `core/`, and the test for putting something there is that a second feature already
imports it.

## PS-2: One router per feature

Each feature owns its `APIRouter` with its own prefix and tags, and `main.py` mounts it.

```python
# features/users/router.py
router = APIRouter(prefix="/users", tags=["users"])

# main.py
app.include_router(users_router, prefix="/api/v1")
```

Tags are what OpenAPI groups by, so they are part of the API surface, not decoration.

## PS-3: Routers are thin

Parse, delegate, return. No queries, no business branching, no transaction control in the route
function.

```python
# BAD
@router.get("/{user_id}")
async def get_user(user_id: UUID, db: DbSession):
    return (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()

# GOOD
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: UUID, service: UserServiceDep) -> UserResponse:
    return await service.get_by_id(user_id)
```

A router that only translates HTTP to a service call can be read in one breath, and the service can be
tested without an HTTP client.

## PS-4: `lifespan`, not `on_event`

`@app.on_event` has been deprecated since FastAPI 0.93.

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()

app = FastAPI(lifespan=lifespan)
```

Everything acquired before the `yield` is released after it, in reverse order. That includes HTTP
client pools, database engines, and background schedulers.

## PS-5: `main.py` wires, it does not decide

App construction, router mounting, middleware, exception handlers. No business logic, no queries, no
inline dependency definitions. When `main.py` grows past a screen, the growth belongs somewhere else.
