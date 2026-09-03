# Pydantic v2 (PD-1 .. PD-8)

## PD-1: v2 syntax only

| v1 | v2 |
|---|---|
| `class Config:` | `model_config = ConfigDict(...)` |
| `orm_mode = True` | `from_attributes=True` |
| `@validator` | `@field_validator` (plus `@classmethod`) |
| `@root_validator` | `@model_validator(mode="before" \| "after")` |
| `.dict()`, `.json()` | `.model_dump()`, `.model_dump_json()` |
| `.parse_obj()`, `.parse_raw()` | `.model_validate()`, `.model_validate_json()` |
| `.schema()` | `.model_json_schema()` |

Mixed v1 and v2 syntax in one codebase is a migration that stalled. Finish it.

## PD-2: Separate input, output, and persistence models

```python
class UserCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: EmailStr
    password: str = Field(min_length=8)

class UserUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: EmailStr | None = None

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    email: EmailStr
    created_at: datetime

class UserInDB(BaseModel):
    id: UUID
    hashed_password: str
```

One model for all three roles means either the API leaks a column it should not (SE-6) or the table
carries a field it does not need. The duplication is the point: request shape, response shape, and row
shape change for different reasons.

## PD-3: `Field` for anything that needs validation or documentation

```python
class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100, description="Product name")
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    tags: list[str] = Field(default_factory=list, max_length=10)
```

`description` lands in the OpenAPI schema, so the validation and the documentation stay in one place
and cannot drift apart. Never use a mutable default directly; `default_factory` exists for that.

## PD-4: `Annotated` for reusable constrained types

```python
from typing import Annotated

Email = Annotated[EmailStr, Field(description="User email")]
Age = Annotated[int, Field(ge=0, le=150)]
Money = Annotated[Decimal, Field(gt=0, max_digits=12, decimal_places=2)]

class UserCreate(BaseModel):
    email: Email
    age: Age
```

Define the constraint once and the same rule applies everywhere the type is used, including nested
models and route parameters.

## PD-5: `field_validator` and `model_validator`, default to `mode="after"`

```python
class UserCreate(BaseModel):
    password: str
    password_confirm: str

    @field_validator("password")
    @classmethod
    def password_strong(cls, v: str) -> str:
        if len(v) < 8 or not any(c.isdigit() for c in v):
            raise ValueError("password must be at least 8 characters and contain a digit")
        return v

    @model_validator(mode="after")
    def passwords_match(self):
        if self.password != self.password_confirm:
            raise ValueError("passwords do not match")
        return self
```

`mode="after"` receives parsed, typed values. `mode="before"` receives raw input and is only for
reshaping payloads that arrive in the wrong form. Raise `ValueError`, not `HTTPException`: FastAPI
turns the former into a 422 with field-level detail (ER-3).

## PD-6: `computed_field` for derived data

```python
class UserResponse(BaseModel):
    first_name: str
    last_name: str

    @computed_field
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
```

Derived values are computed, not stored, and they still appear in the OpenAPI schema. A stored copy of
a derivable value is two sources of truth waiting to disagree.

## PD-7: Strict mode where coercion would hide a bug

```python
class FeatureFlags(BaseModel):
    model_config = ConfigDict(strict=True)
    max_items: int
    enabled: bool
```

In lax mode `"1"` becomes `1` and `"yes"` can become `True`. That is convenient for a form post and
dangerous for a config file or an internal message. Set `strict=True` on the model rather than
scattering `StrictInt` and `StrictBool` field types; both work, one is consistent.

## PD-8: `model_config` settings that carry weight

| Setting | Effect | Use on |
|---|---|---|
| `from_attributes=True` | reads ORM objects | response models |
| `extra="forbid"` | rejects unknown fields | every input model (CF-4) |
| `str_strip_whitespace=True` | trims strings | input models |
| `frozen=True` | immutable, hashable | value objects, response models |
| `populate_by_name=True` | accepts field name and alias | models with camelCase aliases |

Set these deliberately per model. A blanket base class that turns everything on removes the ability to
say what a specific model needs.
