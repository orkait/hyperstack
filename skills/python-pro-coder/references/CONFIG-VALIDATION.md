# Settings and Validation (CF-1 .. CF-5)

## CF-1: One `BaseSettings` object, no scattered `os.getenv`

```python
from pydantic import Field, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="forbid")

    database_url: PostgresDsn
    secret_key: str = Field(min_length=32)
    debug: bool = False
```

A missing or malformed variable fails at construction with the field name, not at 3am inside a request
handler. `extra="forbid"` catches the typo'd variable name that would otherwise be silently ignored.

## CF-2: Cache settings behind a dependency

```python
from functools import lru_cache

@lru_cache
def get_settings() -> Settings:
    return Settings()

SettingsDep = Annotated[Settings, Depends(get_settings)]
```

Pick this or a module-level singleton, not both. The dependency form is preferred because a test can
override it with `app.dependency_overrides[get_settings]`, which a module-level `settings = Settings()`
cannot offer without monkeypatching.

## CF-3: Validate at the edge, trust inside

Pydantic validates at the HTTP boundary and at every other input boundary: queue messages, webhook
payloads, external API responses, config files. Past that boundary the types are true, and a service
that re-checks `if not isinstance(...)` is admitting it does not believe its own signature.

The corollary: anything that enters without passing a model is not validated. Parse it into a model
first.

## CF-4: Forbid extra fields on input

```python
class UserCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
```

Default Pydantic behavior ignores unknown fields, so a client sending `{"email": ..., "is_admin": true}`
gets a silent success and the field vanishes. `extra="forbid"` turns that into a 422. Response models
are the opposite case: they should not forbid, they should simply not contain what must not leave.

## CF-5: Use the precise type, not `str`

`EmailStr`, `HttpUrl`, `AnyUrl`, `PostgresDsn`, `UUID`, `Decimal` for money, `datetime` with timezone
awareness, `SecretStr` for anything that must not appear in a log or a repr. Each one is a validation
rule and a piece of documentation obtained for free, and `SecretStr` in particular prevents the class
of incident where a settings dump lands in a log line.

Money is `Decimal` with explicit `max_digits` and `decimal_places`. Never `float`.
