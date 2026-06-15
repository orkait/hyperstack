---
name: optimizer
category: core
description: Teaches runtime analysis - deriving Big-O straight from code - and how to derive a better algorithm by removing redundant work, then confirms the technique via the optimizer_* catalog and web-searches the implementation. Suggests the complexity win as Big-O before -> after. Evidence-gated, not premature - stays quiet when the naive solution is correctly the lazy-right answer. Use when asked to optimize, "make it faster", "better algorithm", "what's the complexity", or when a hot path / large-n / nested-loop / known-slow pattern shows up in review.
---

# Optimizer - Algorithmic Lens

Hyperstack already makes code current, correct, designed, and minimal. This is the missing axis: **the right algorithm and data structure for the problem, proven in complexity terms.** A lens, not a gate.

It does not hand you a list of algorithms to copy. It teaches two transferable skills - **(1) derive the runtime, (2) derive a better algorithm by removing redundant work** - and uses the `optimizer_*` catalog only to confirm the named technique and point you at the authoritative implementation. The thinking is the skill; the catalog is the lookup.

## 1. Runtime analysis (derive it, never guess)

Read the Big-O off the code. Cost model:

| Code shape | Complexity |
|---|---|
| sequential statements | add, dominant term wins |
| single loop to n | O(n) |
| two nested loops to n (all pairs, all subarrays) | O(n^2) |
| loop that halves/doubles the range each step | O(log n) |
| loop to n with an O(log n) op inside (binary search, heap push, set in a balanced tree) | O(n log n) |
| binary recursion on n/2 + linear merge: `T(n)=2T(n/2)+O(n)` | O(n log n) |
| linear recursion: `T(n)=T(n-1)+O(1)` | O(n) |
| branching recursion ×2, depth n: `T(n)=2T(n-1)+O(1)` | O(2^n) (naive Fibonacci, all subsets) |
| all permutations | O(n!) |

Rules:
- **Drop constants and lower-order terms.** `O(n + n log n) = O(n log n)`. `O(2n) = O(n)`.
- **Recursion -> recurrence -> Master Theorem.** `T(n)=aT(n/b)+f(n)`: compare `f(n)` to `n^(log_b a)`. Or draw the recursion tree and sum the levels.
- **Amortized != worst-case-per-op.** Dynamic-array push is O(1) amortized, not O(n). Union-find op is ~O(alpha(n)). A loop where an inner pointer only ever *advances* (two-pointer, sliding window) is O(n) total - not O(n^2) - because the inner index moves at most n times across the whole run.
- **Space:** count auxiliary allocation - recursion stack depth (`O(h)`), aux arrays, a memo/DP table (`O(states)`). In-place = `O(1)` aux.

**Then find the bottleneck:** the single highest-order term IS what to attack. Usually a loop or recursion doing repeated work. Everything below it is noise until that term is lowered.

## 2. The improvement playbook (derive the better algorithm)

You do not pick an algorithm from a list - you *remove redundant work*. The one question:

> **What is this code computing repeatedly that it could compute once?**

Map the redundancy to its fix - that *names the technique class*; then confirm + fetch the impl from the catalog.

| Redundant work (the smell) | The idea (remove the repetition) | Typical lift |
|---|---|---|
| re-searching a collection every step | hash for O(1) lookup, or sort once + binary search | O(n^2) -> O(n) / O(n log n) |
| re-summing / re-aggregating a range per query | precompute prefix sums | O(n)/query -> O(1) |
| recomputing overlapping subproblems | memoize / tabulate (DP) | exponential -> polynomial |
| re-finding the min/max repeatedly | heap, or monotonic stack/deque | O(n^2) -> O(n log n) / O(n) |
| comparing all pairs in ordered/sorted data | two pointers / sliding window | O(n^2) -> O(n) |
| repeated connectivity / grouping queries | union-find | O(V+E)/query -> ~O(1) |
| exhaustive search with structure | prune (backtracking), greedy if an exchange argument holds, or DP if optimal substructure holds | n! -> tractable |
| repeated shortest-path / level queries | BFS (unweighted) / Dijkstra (weighted) | re-scan -> O(V+E) / O(E log V) |

### The derivation loop

1. **Derive** the current complexity (section 1).
2. **Locate** the dominant cost - the loop/recursion that produces the top term.
3. **Name the redundancy** - what work repeats across its iterations?
4. **Map** the redundancy to its fix (table above) -> this yields the technique *class*.
5. **Confirm + fetch:** `optimizer_match_problem` / `optimizer_get_technique` to confirm the named technique and get the web-search query; **web-search the implementation** (off-by-ones and edge cases are where memory fails) and hand to the language plugin (`golang_*`, `rust_*`, `react_*`) for idiomatic code.
6. **Re-derive** the new complexity to *prove* the win. Present Big-O before -> after.

## When NOT to apply (the restraint gate)

Gated by Coding Law 0 / YAGNI. **Do not optimize what does not need it.** A naive loop over 10 items is correctly the lazy-right answer. Skip when input is provably small, the path is cold, or the code is correct and clear. Premature optimization is its own slop - the opposite of this skill. When you skip, say why (e.g. "O(n^2) but n<=50 on a cold path - leaving it").

## MCP tools (the lookup, after you have reasoned)

| Tool | Purpose |
|---|---|
| `optimizer_match_problem` | problem -> candidate classes + techniques |
| `optimizer_list_classes` | the taxonomy |
| `optimizer_list_techniques` | the menu, optionally per class |
| `optimizer_get_technique` | complexity + naive-smell + web-search query for the impl |
| `optimizer_search` | free-text over the catalog |

## Position in the harness

| Connection | Wiring |
|---|---|
| Gated by | Coding Law 0 / YAGNI |
| Deepens | `engineering-discipline` Step 8 (negative doubt: "try a better alternative") |
| Adds a dimension to | `code-review` - "right algorithm + complexity?" |
| Hands off to | `golang_*` / `rust_*` / `react_*` for idiomatic implementation |
| Verifies via | web search (catalog ships no code - algorithms are stable, specifics get checked) |

## Red flags - STOP

| Thought | Reality |
|---|---|
| "It's roughly O(n) I think" | Derive it. Count the loops, write the recurrence. Guessed Big-O is how slow code ships. |
| "I'll write the algorithm from memory" | Reason to the *class* yourself; web-search the *implementation*. Edge cases are where memory fails. |
| "Faster is always better, optimize it" | No. Premature optimization is slop. Gate on scale + hot path. |
| "It's O(n^2) but the input is tiny" | Then leave it, and say so. Correct + clear beats clever for n=10. |
| "I'll claim it's faster" | Prove it: Big-O before -> after, both derived. |
