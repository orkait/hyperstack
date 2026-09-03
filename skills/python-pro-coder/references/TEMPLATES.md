# Scaffolds

Starting points, not paste-and-ship. Every scaffold is held to the rules in the other reference files.

## Settings

```python
from functools import lru_cache
from pydantic import Field, PostgresDsn, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="forbid")

    environment: str = "local"
    debug: bool = False
    database_url: PostgresDsn
    secret_key: SecretStr = Field(min_length=32)
    access_token_ttl_seconds: int = Field(900, ge=60, le=3600)

@lru_cache
def get_settings() -> Settings:
    return Settings()
```

## Database session dependency

```python
from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

engine = create_async_engine(str(settings.database_url), pool_pre_ping=True)
async_session = async_sessionmaker(engine, expire_on_commit=False)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

DbSession = Annotated[AsyncSession, Depends(get_db)]
```

`expire_on_commit=False` keeps loaded attributes usable after commit, which matters when the response
model reads the object the service just wrote.

## Feature router

```python
router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserCreate, service: UserServiceDep) -> UserResponse:
    return await service.create(payload)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: Annotated[UUID, Path(description="User id")],
    service: UserServiceDep,
) -> UserResponse:
    return await service.get_by_id(user_id)

@router.get("/", response_model=Page[UserResponse])
async def list_users(pagination: Pagination, service: UserServiceDep) -> Page[UserResponse]:
    return await service.list(pagination)
```

## Paginated response envelope

```python
from typing import Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class Page(BaseModel, Generic[T]):
    items: list[T]
    total: int
    offset: int
    limit: int
```

## Application factory

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await startup_checks()
    yield
    await engine.dispose()

def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Service",
        lifespan=lifespan,
        default_response_class=ORJSONResponse,
        docs_url="/docs" if settings.debug else None,
        openapi_url="/openapi.json" if settings.debug else None,
    )
    app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins,
                       allow_credentials=True, allow_methods=["GET", "POST"],
                       allow_headers=["Authorization", "Content-Type"])
    app.add_exception_handler(AppError, app_error_handler)
    app.include_router(users_router, prefix="/api/v1")
    app.include_router(health_router)
    return app

app = create_app()
```

The factory form is what lets a test build an app with overridden settings instead of importing a
module-level singleton.

## Test conftest

```python
import pytest
from httpx import ASGITransport, AsyncClient

@pytest.fixture
async def client(app_with_test_db: FastAPI) -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(transport=ASGITransport(app=app_with_test_db),
                           base_url="http://test") as c:
        yield c

@pytest.fixture
def override_settings(app_with_test_db: FastAPI):
    app_with_test_db.dependency_overrides[get_settings] = lambda: Settings(debug=True, ...)
    yield
    app_with_test_db.dependency_overrides.clear()
```

```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
```

## Dockerfile

See OB-7 in `OBSERVABILITY.md` for the multi-stage uv image and the process-model decision.

## pyproject quality block

```toml
[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "ASYNC", "S", "SIM", "RUF"]

[tool.mypy]
strict = true
plugins = ["pydantic.mypy"]
```
