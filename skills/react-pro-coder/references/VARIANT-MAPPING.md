# Variant Mapping Detection

Identifies components that structure styling or behavior around string literal union variants plus
`Record`-based lookup tables. Run it during audits, or when asked whether a component follows the
pattern.

## Detection rules

| # | Signal | Shape |
|---|---|---|
| 1 | Closed variant set | `export type Variant = 'a' \| 'b' \| 'c';` |
| 2 | Variant to value mapping | `const styles: Record<Variant, string>` with keys matching the union exactly |
| 3 | Resolver | a function taking the union and returning from the mapping |
| 4 | Composition at the render site | multiple resolver outputs combined, for example `className={cn(getTone(tone), getSize(size))}` |

## Trigger condition

Report the pattern only when all of the following hold: at least one string literal union type, at
least one `Record<Union, T>` keyed by that union, and use of the mapping inside a resolver that affects
rendering. Two out of three is a coincidence, not the pattern.

## Report format

```
Result: composable variant mapping detected | not detected

Variant axes: <e.g. tone, size, density>
Mappings: <name -> Record type, what it produces (class names, style keys, behavior)>
Resolvers: <function names and their axis>
Render composition sites: <file:line>
Refactor notes: <optional>
```

## Why it matters

The pattern is the correct expression of CD-5 (variants over boolean flags) and TS-2 (discriminated
props). When it is present, exhaustiveness is checkable by the compiler: adding a union member breaks
every `Record` that has not been updated. When it is half-present, for example a mapping typed
`Record<string, string>`, that guarantee is gone and adding a variant fails silently at runtime.
Report the half-present case as a Major finding.
