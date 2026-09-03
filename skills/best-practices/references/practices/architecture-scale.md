# Architecture at Scale

Decisions that are cheap now and expensive later. Each one is about where a boundary goes and which
direction it points.

## Default to a modular monolith

One deployable, hard module boundaries inside it. This covers most systems and almost all systems that
do not yet have a scaling problem they have measured.

Microservices buy independent deploy, independent scaling, and team autonomy. They cost a network hop
where a function call was, distributed failure modes, eventual consistency, and an operational surface
per service. Taking that cost before the boundaries are known produces a distributed monolith: all the
latency and none of the independence, because the services still change together.

The migration path is one-way-easy: a module with a clean interface becomes a service when it needs to.
A service with the wrong boundary is a rewrite.

| Signal that a module should become a service | Not a signal |
|---|---|
| It needs to scale on a different axis than the rest | The codebase feels large |
| It has a different availability or compliance requirement | A different team owns it |
| Its deploy cadence is genuinely independent, measured | Microservices are the current default in blog posts |

## Dependencies point inward

The domain, the rules that would still be true on paper, depends on nothing. Infrastructure depends on
the domain, never the reverse.

```
        ┌──────────────┐
        │    domain    │   no framework, no driver, no HTTP
        └──────▲───────┘
               │
        ┌──────┴───────┐
        │ application  │   use cases, orchestration
        └──────▲───────┘
               │
        ┌──────┴───────┐
        │infrastructure│   database, HTTP, queue, third parties
        └──────────────┘
```

The test is mechanical: can the domain be compiled and tested with no database and no web framework on
the path? If an import of the ORM appears in a domain file, the arrow has flipped and the rules are now
coupled to a vendor.

## No cycles

`A` imports `B`, `B` imports `A`: extract the shared piece into `C`. A cycle means the boundary was
drawn in the wrong place, and it breaks tree-shaking, initialization order, and the ability to reason
about either module alone. Enforce it in lint rather than discovering it during a refactor.

## API first

Design the interface before the implementation, and treat it as a contract with a consumer who is not
in the room. That means the schema, the error shapes, the pagination, and the versioning strategy are
decided before the first handler is written.

An API designed after the implementation exposes the implementation, which is what makes the second
version a breaking change.

## The 12 factors that still matter

| Factor | Practical rule |
|---|---|
| Config | Everything that varies by environment comes from the environment, never a branch on `if env == "prod"` |
| Backing services | Database, cache, queue are attached resources addressed by URL, swappable without a code change |
| Processes | Stateless. Anything that must survive a restart lives in a backing service, not in memory |
| Port binding | The app serves itself; it is not installed into a web server |
| Concurrency | Scale by process count, not by threads inside one special process |
| Disposability | Fast start, graceful shutdown, safe to kill at any moment |
| Dev/prod parity | Same backing services in development as in production. SQLite locally with Postgres in production is a bug generator |
| Logs | Event streams to stdout. The process does not manage log files or rotation |

## Write the decision down

An ADR is one page: the context, the options considered, the decision, and the consequences. Numbered,
in the repository, immutable once accepted, superseded rather than edited.

```
docs/adr/0007-choose-postgres-over-dynamodb.md
```

The value is not the decision, which people usually remember. It is the constraint set at the time,
which nobody remembers, and which is the only way to tell later whether the decision is still correct
or merely still in place.

Worth an ADR: anything expensive to reverse. Not worth one: anything a reader can infer from the code
in a minute.
