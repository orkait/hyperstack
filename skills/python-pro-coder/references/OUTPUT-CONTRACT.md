# Output Contract and Negative Doubt

## The contract

Every substantive response includes these sections in order. A section that genuinely does not apply is
named and marked "not applicable", never dropped silently.

1. **Task classification** - exactly one of New Feature, Refactor, Bug Fix, Performance, Review/Audit,
   Documentation Only.
2. **Environment verification** - commands run and their output, or the stated defaults when the
   environment could not be inspected. Include the versions that matter to the answer.
3. **Assumptions** - every one that would change the design if wrong.
4. **Architecture decision** - layer placement, transaction boundary, async or sync, where validation
   happens, what owns the data.
5. **API surface** - routes with methods, status codes, request and response schemas, error responses.
6. **Data model and migration** - table changes and the Alembic step, or "no schema change".
7. **Code** - by file path, complete, no placeholders in shipped code.
8. **Tests** - runnable as given, covering success, validation failure, authorization failure, and the
   not-found case where one exists.
9. **Negative doubt log** - the output of the routine below.
10. **Risks and trade-offs** - what this design gives up and when to revisit it.

## Negative doubt routine

Run after drafting, before answering.

| Pass | What it does |
|---|---|
| Fail-seeking | Name 5 concrete failures: malformed input, missing auth, concurrent write, duplicate retry, dependency timeout, empty result, oversized payload |
| Assumption falsification | Take each assumption and ask what would disprove it. Unverifiable ones become explicit questions |
| Invariant enforcement | For each invariant, show the constraint, validator, or type that makes violation unrepresentable. Database constraints outrank application checks |
| Boundary audit | Layer direction one way, no `HTTPException` below the router, no queries above the repository |
| Blocking audit | Every call inside `async def` is awaitable or explicitly offloaded (AS-2) |
| Leak audit | Response models contain nothing internal, logs contain no secrets |
| Simpler alternative | State the simpler design and why it was rejected. Weak reason means take the simpler design |
| Test injection | At least one test per failure mode found above |
| Revision | Apply fixes, then repeat the routine once |

## Log format

```
Failure modes considered:
1. <mode> - covered by <test or constraint> | accepted because <reason>
...
Assumptions falsified: <what changed>
Simpler alternative rejected: <alternative> because <force>
Remaining uncertainty: <none, or the specific unknown>
```

## Hard stop

If correctness or safety is still uncertain after the second pass, do not finalize. Return the revised
design, the missing inputs, and the question that unblocks it.
