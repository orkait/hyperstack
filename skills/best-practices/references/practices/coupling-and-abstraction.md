# Coupling and Abstraction

Rules for the boundary between two pieces of code: what one is allowed to know about the other, and
when an abstraction has earned its existence.

## Law of Demeter: one dot

A unit talks to its immediate collaborators, not to their internals.

```
// BAD: the caller now depends on Address existing and on its shape
user.getAddress().getCity().getPostalCode()

// GOOD
user.postalCode()
```

Each extra dot is a dependency the caller did not ask for and cannot see when it breaks. The chain also
tells you the behavior lives in the wrong place: if three callers reach through `user` to format an
address, the formatting belongs on `user` or on an address service, not in all three.

Exempt: fluent builders and query DSLs, where chaining is the interface rather than a traversal of
someone else's object graph.

## Command-Query Separation

A function either returns a value or changes state. Not both.

```
// BAD: the name promises a read, the body performs a write
getUser(id)    -> loads the user AND refreshes its last-seen timestamp

// GOOD
getUser(id)          -> returns the user
touchLastSeen(id)    -> performs the write
```

Hidden writes behind a read-shaped name are the reason a test that "just reads" mutates the database,
and the reason an added log line changes behavior. Where a single operation genuinely must do both, for
example pop-from-queue, name it so the mutation is visible.

## No flag arguments

A boolean parameter that selects behavior is two functions wearing one name.

```
// BAD
createUser(payload, isAdmin)
render(data, compact)

// GOOD
createUser(payload)
createAdminUser(payload)
```

The call site `createUser(payload, true)` is unreadable without opening the definition. Where the flag
is genuinely data rather than a branch, for example a user-set preference, pass it as a named field on
an options object.

## Abstract on the third occurrence

Duplicate once, live with it. Duplicate twice, look. On the third, extract.

An abstraction built from two examples encodes an accident; the third case is what shows which parts
actually vary. The cost of waiting is a little duplication. The cost of not waiting is an abstraction
with a parameter for every difference, which every future caller must decode.

The corollary is that DRY is about knowledge, not text. Two blocks that look alike but change for
different reasons are not duplication, and merging them couples two things that were correctly
independent. Ask what would make each copy change; different answers mean leave them alone.

## Leaky abstractions

If the caller must know how it works to use it correctly, the abstraction failed.

Symptoms: a wrapper whose documentation explains the thing it wraps; a repository whose callers must
know it issues one query per item; a client that returns the underlying library's exception type. Fix
by either sealing the leak or dropping the wrapper and using the underlying thing directly. A thin
wrapper that leaks is worse than no wrapper, because it adds a layer and keeps the coupling.

## Cargo cult

A pattern copied without its force is decoration. Before adding one, state what problem it solves here,
what invariant it protects, and which simpler option was rejected. That is the pattern gate, and it
applies equally to patterns copied from another file in the same repository.

Same test for a dependency, a folder layout, or a config block copied from a previous project.

## God objects and lasagna

Two failure directions of the same decision.

| Shape | Symptom | Fix |
|---|---|---|
| God object | One class or module every feature imports and every change touches | Split by reason-to-change, not by size |
| Lasagna | Five layers to move one field, each doing nothing but forwarding | Delete the layers that only forward |

A layer earns its place by transforming, deciding, or isolating something. A layer that renames a field
and calls the next one down is overhead with a filename.
