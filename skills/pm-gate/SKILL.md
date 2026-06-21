---
name: pm-gate
description: Use BEFORE any net-new feature, product, or scope decision - the product-manager persona gate. Grounds the build in a validated customer problem (opportunity-vs-solution, four risks, prioritized call) and emits PASS/BLOCK/NEEDS-INPUT before design or engineering. Advisory for tweaks; user can override.
category: core
---

# PM Gate

The product-manager persona's gate. It owns the value and viability product risks
that nothing else in Hyperstack owns. It runs BEFORE designer/blueprint on net-new
work.

## Iron Law

```
NO NET-NEW BUILD WITHOUT A PASSED PRODUCT DECISION
(value + viability addressed, prioritized call stated with a rationale)
```

## When

| Request | Gate |
|---|---|
| net-new feature / product / scope decision | HARD - must PASS before design/build |
| tweak / bugfix / refactor | ADVISORY - emit brief, do not block |
| user says "skip PM" | OVERRIDE - honour, log it |

## Steps (MCP-grounded - call the tools, do not reason from memory)

1. `product_manager_opportunity_vs_solution(statement)` - reject a solution-in-disguise.
2. `product_manager_get_discovery_rules()` - confirm customer evidence; flag opinion-requirements.
3. `product_manager_get_four_risks()` - assess all four, especially VALUE and VIABILITY.
4. `product_manager_score_rice(...)` and `product_manager_get_strategy_rules()` - state the one call, cut scope.
5. `product_manager_resolve_product_decision(description, isNetNew)` - emit the verdict.

## Verdict handling

- PASS -> hand to `hyper`; proceed to designer/blueprint.
- BLOCK -> stop; report the unaddressed risk; do not route to build.
- NEEDS-INPUT -> ask the user the specific missing question.

## Red flags (from the corpus)

- "A customer said they want X" used as a requirement -> opinion, not evidence.
- Reasoning covers value but is silent on viability -> the named weak-PM failure.
- "Strategy" that is a long feature list rejecting nothing -> not a strategy.
- Treating a strategy/interpersonal/culture problem as an execution problem.
