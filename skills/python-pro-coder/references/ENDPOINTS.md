# Endpoint Design (EP-1 .. EP-6)

## EP-1: Explicit `response_model` and status code

```python
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserCreate, service: UserServiceDep) -> UserResponse:
    return await service.create(payload)
```

The response model is the filter that stops internal fields reaching the client (SE-6) and the source
of the documented schema. Use `status.HTTP_*` constants, not bare integers: `201`, `202`, and `204`
carry meaning that a reader should not have to look up.

## EP-2: `Annotated` dependencies

```python
from typing import Annotated

CurrentUser = Annotated[User, Depends(get_current_user)]
DbSession = Annotated[AsyncSession, Depends(get_db)]

@router.get("/me", response_model=UserResponse)
async def get_me(user: CurrentUser) -> UserResponse:
    return user
```

The alias is defined once and reused across every route, the signature stays readable, and the type is
visible to the type checker instead of hidden behind a default value.

## EP-3: Path, query, and header metadata belongs in the parameter

```python
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: Annotated[UUID, Path(description="User id")],
    include_deleted: Annotated[bool, Query(description="Include soft-deleted rows")] = False,
) -> UserResponse:
    ...
```

The default goes on the parameter with `=`, never inside `Query(...)`. `Query(default=False)` inside
`Annotated` raises `AssertionError` at import time: FastAPI refuses the ambiguity of two default
sources.

## EP-4: `BackgroundTasks` for non-critical side effects

```python
@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(payload: UserCreate, background_tasks: BackgroundTasks, service: UserServiceDep):
    user = await service.create(payload)
    background_tasks.add_task(send_welcome_email, user.email)
    return user
```

Background tasks run in the same process after the response is sent. They are right for a welcome
email and wrong for anything that must survive a restart, be retried, or be observed. That work goes to
a real queue.

## EP-5: Three layers, one direction

Router to service to repository. The router does not query, the repository does not decide, and
nothing calls back up the stack. A fourth layer needs a stated reason.

## EP-6: Version the API from day one

```python
app.include_router(users_router, prefix="/api/v1")
```

Adding a version prefix later means every client changes at once. Adding it now costs one string. The
version is a URL prefix on the mount, not a per-route decoration.
