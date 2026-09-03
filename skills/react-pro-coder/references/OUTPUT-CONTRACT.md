# Output Contract and Negative Doubt

## The contract

Every substantive response includes these sections in this order. Sections that genuinely do not apply
are named and marked "not applicable", never dropped silently.

1. **Task classification** - exactly one of New Feature, Refactor, Bug Fix, Performance/SEO,
   Review/Audit, Documentation Only.
2. **Environment verification** - the commands run and their output, or the stated defaults when the
   environment could not be inspected.
3. **Assumptions** - every one that would change the design if wrong.
4. **Architecture decision** - rendering strategy (server or client, and why), state placement against
   the ST hierarchy, and module boundaries.
5. **SEO requirements** - metadata, canonical, structured data, rendering mode. Applies to any public
   route.
6. **Public APIs** - the exported surface: props, hook signatures, action signatures, return types.
7. **Code** - organized by file path, complete, no placeholders or `// ...` gaps in shipped code.
8. **Tests** - the tests that cover the behavior just written, runnable as given.
9. **Negative doubt log** - the output of the routine below.
10. **Risks and trade-offs** - what this design gives up, and the condition under which it should be
    revisited.

## Negative doubt routine

Run after drafting, before answering. This is a self-attack pass, not a summary.

| Pass | What it does |
|---|---|
| Fail-seeking | Name 5 concrete ways this breaks: bad input, empty data, slow network, double submit, race, unmount mid-flight, permission denied |
| Assumption falsification | Take each assumption from section 3 and ask what evidence would disprove it. Unverifiable ones become explicit questions |
| Invariant enforcement | For each invariant, show the guard, validation, or type that makes violation unrepresentable |
| Boundary audit | No import cycles, minimal public surface, dependency direction one way (AR-2, AR-3) |
| Simpler alternative | State the simpler design and why it was rejected. If the reason is weak, take the simpler design |
| Test injection | At least one test per failure mode found in the fail-seeking pass |
| Revision | Apply the fixes, then repeat the routine once |

## Negative doubt log format

```
Failure modes considered:
1. <mode> - covered by <test or guard> | accepted because <reason>
...
Assumptions falsified: <what changed>
Simpler alternative rejected: <alternative> because <force>
Remaining uncertainty: <none, or the specific unknown>
```

## Hard stop

If correctness or safety is still uncertain after the second pass, do not finalize. Return the revised
design, the specific missing inputs, and the question whose answer unblocks it. A confident wrong
answer costs more than an asked question.
