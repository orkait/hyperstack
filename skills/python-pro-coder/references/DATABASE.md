# Database and ORM (DB-1 .. DB-5)

## DB-1: SQLAlchemy 2.0 style

```python
from sqlalchemy.orm import Mapped, mapped_column

class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(UTC))
```

`Mapped[...]` plus `mapped_column` gives the type checker real column types and makes nullability
explicit in the annotation. Queries use `select()` with `await db.execute(...)`, not the legacy
`Query` API.

## DB-2: One persistence pattern per codebase

Either SQLAlchemy models with separate Pydantic schemas, or SQLModel unifying both. Both work. Three
half-migrated patterns in one repository means every developer must guess which one applies to the file
they opened.

SQLModel is maintained but still pre-1.0; the separate-model shape stays the default when the table and
the API schema diverge, which they do as soon as there is a computed field, a hidden column, or a
different name on the wire.

## DB-3: Alembic migrations, always

`Base.metadata.create_all()` is for a test fixture and nothing else. It cannot alter, cannot backfill,
cannot roll back, and cannot tell two environments apart.

Every migration is reviewed like code: it has a downgrade, it does not lock a large table for minutes,
and index creation on a busy Postgres table is concurrent. A migration that drops a column ships after
the code that stopped reading it, never with it.

## DB-4: Repository per aggregate for testable queries

```python
class UserRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_email(self, email: str) -> User | None:
        return (await self.db.execute(select(User).where(User.email == email))).scalar_one_or_none()
```

The repository holds query construction so the service reads as business rules and the queries can be
exercised directly. It does not commit and does not decide policy.

## DB-5: The service owns the transaction

The unit of work is a business operation, not an HTTP request and not a single query. The service
opens, commits, and rolls back; the dependency provides the session (DI-3); the repository never
commits.

```python
async def transfer(self, src: UUID, dst: UUID, amount: Decimal) -> None:
    async with self.db.begin():
        await self.accounts.debit(src, amount)
        await self.accounts.credit(dst, amount)
```

When two writes must both happen or neither, that fact is expressed once, in the service, and is
visible to a reader.
