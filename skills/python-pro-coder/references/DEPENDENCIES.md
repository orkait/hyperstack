# Dependency Injection (DI-1 .. DI-4)

## DI-1: One dependency, one job

Authentication, session provision, pagination parsing, tenant resolution: separate dependencies, each
testable and overridable alone. A dependency that authenticates and also opens a session and also logs
cannot be reused for the route that needs only one of those.

## DI-2: Dependencies for cross-cutting request shapes

```python
class PaginationParams(BaseModel):
    offset: int = Field(0, ge=0)
    limit: int = Field(20, ge=1, le=100)

Pagination = Annotated[PaginationParams, Depends()]

@router.get("/", response_model=Page[UserResponse])
async def list_users(pagination: Pagination, service: UserServiceDep):
    ...
```

Pagination, filtering, and sorting are the same three parameters on every list endpoint. Defining them
once fixes the bounds once, which is what stops the endpoint that forgot its `le=100`.

## DI-3: The session dependency owns the session lifecycle, the service owns the transaction

```python
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

Note what is absent: the commit. A dependency that commits on the way out commits whatever the handler
left behind, including a half-finished multi-step operation, and it removes the service's ability to
decide that two writes are one unit. The service commits (DB-5).

Never write a bare `except:`; it swallows `KeyboardInterrupt` and `CancelledError`, and under an async
server that turns a shutdown into a hang.

## DI-4: `yield` dependencies for anything that must be released

Sessions, locks, tracing spans, temporary files, acquired pool connections. The teardown runs after the
response, so it is also where per-request cleanup belongs.

Two constraints worth knowing: teardown code after `yield` runs after the response has been sent, so it
cannot change the response; and an exception raised in teardown is not the client's error, it is a
server error that needs its own log line (OB-1).
