# Async and Performance (AS-1 .. AS-5)

## AS-1: Pick one execution model per route and hold it

FastAPI runs `def` routes in a threadpool and `async def` routes on the event loop. Both are correct.
Mixing them wrongly is what hurts: an `async def` route that calls blocking code stalls the loop for
every other request in the process.

| Route | Database driver | HTTP client | Verdict |
|---|---|---|---|
| `async def` | asyncpg via SQLAlchemy async | httpx async | correct |
| `def` | psycopg sync | requests | correct, runs in the threadpool |
| `async def` | sync session or `requests` | any | broken, blocks the loop |

## AS-2: Never block inside `async def`

No `time.sleep`, no synchronous `requests`, no blocking file IO, no CPU-heavy loop.

```python
from fastapi.concurrency import run_in_threadpool

@router.post("/render")
async def render(payload: RenderRequest):
    return await run_in_threadpool(expensive_sync_render, payload)
```

CPU-bound work does not belong in the web process at all past a certain size; the threadpool is a
bridge for library calls that have no async form, not a substitute for a worker.

## AS-3: Faster JSON when payloads justify it

```python
from fastapi.responses import ORJSONResponse

app = FastAPI(default_response_class=ORJSONResponse)
```

Worth it for large or hot payloads. Measure first: for a 2 KB response the serializer is not the
bottleneck, and the change costs a dependency plus a subtle difference in how some types serialize.

## AS-4: Pagination is mandatory on list endpoints

```python
@router.get("/", response_model=Page[UserResponse])
async def list_users(pagination: Pagination, service: UserServiceDep) -> Page[UserResponse]:
    ...
```

An unbounded list endpoint is a denial of service with a friendly name: it works for a year, then one
tenant reaches a million rows and the endpoint takes the process down. Bound the limit in the schema
(DI-2) so the bound cannot be bypassed by a query string.

Keyset pagination beats offset for large or frequently mutated tables: offset scans everything it
skips, and rows shift under a paging client.

## AS-5: Kill N+1 at the query, not in a loop

```python
# BAD: one query for users, then one per user
users = (await db.execute(select(User))).scalars().all()
for user in users:
    _ = user.posts

# GOOD
stmt = select(User).options(selectinload(User.posts))
users = (await db.execute(stmt)).scalars().all()
```

`selectinload` issues a second query with an `IN` clause and is the default choice for collections.
`joinedload` uses one query with a join and suits many-to-one. Lazy loading on an async session raises
rather than silently emitting IO, which is a feature: it turns an N+1 into an error during development.

Log or assert query counts in tests for the endpoints that matter. N+1 regressions arrive through
unrelated changes.
