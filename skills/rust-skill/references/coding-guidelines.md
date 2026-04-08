# coding-guidelines

# Coding Guidelines - Agent Integration

> **Skill:** coding-guidelines
> **Agent:** style-guide-enforcer

## Quick Reference

This skill handles Rust coding standards and best practices. It uses the style-guide-enforcer agent for comprehensive style review.

## When to Use Agent

Use the agent when:
- Reviewing code for style violations
- Enforcing naming conventions
- Learning idiomatic Rust patterns
- Configuring clippy/rustfmt
- Teaching best practices

## Agent Invocation

```
Task(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: <read from ../../agents/style-guide-enforcer.md>
)
```

## Coverage

The agent enforces:
- Naming conventions (no `get_` prefix, iterator names, conversion names)
- Data type best practices (newtypes, pre-allocation)
- String handling (prefer `&str`, use `Cow`, `format!`)
- Error handling (`?` operator, `expect` over `unwrap`)
- Memory patterns (meaningful lifetimes, `try_borrow`)
- Concurrency (atomics, no locks across await)
- Deprecated pattern detection

## Success Criteria

Agent invocation is successful when:
1. All style violations identified
2. Explanations provided for each rule
3. Correct examples shown
4. Tool configurations recommended
5. Idiomatic patterns taught

---
name: coding-guidelines
description: "Use when asking about Rust code style or best practices. Keywords: naming, formatting, comment, clippy, rustfmt, lint, code style, best practice, P.NAM, G.FMT, code review, naming convention, variable naming, function naming, type naming, 命名规范, 代码风格, 格式化, 最佳实践, 代码审查, 怎么命名"
source: https://rust-coding-guidelines.github.io/rust-coding-guidelines-zh/
user-invocable: false
---

# Rust Coding Guidelines (50 Core Rules)

## Naming (Rust-Specific)

| Rule | Guideline |
|------|-----------|
| No `get_` prefix | `fn name()` not `fn get_name()` |
| Iterator convention | `iter()` / `iter_mut()` / `into_iter()` |
| Conversion naming | `as_` (cheap &), `to_` (expensive), `into_` (ownership) |
| Static var prefix | `G_CONFIG` for `static`, no prefix for `const` |

## Data Types

| Rule | Guideline |
|------|-----------|
| Use newtypes | `struct Email(String)` for domain semantics |
| Prefer slice patterns | `if let [first, .., last] = slice` |
| Pre-allocate | `Vec::with_capacity()`, `String::with_capacity()` |
| Avoid Vec abuse | Use arrays for fixed sizes |

## Strings

| Rule | Guideline |
|------|-----------|
| Prefer bytes | `s.bytes()` over `s.chars()` when ASCII |
| Use `Cow<str>` | When might modify borrowed data |
| Use `format!` | Over string concatenation with `+` |
| Avoid nested iteration | `contains()` on string is O(n*m) |

## Error Handling

| Rule | Guideline |
|------|-----------|
| Use `?` propagation | Not `try!()` macro |
| `expect()` over `unwrap()` | When value guaranteed |
| Assertions for invariants | `assert!` at function entry |

## Memory

| Rule | Guideline |
|------|-----------|
| Meaningful lifetimes | `'src`, `'ctx` not just `'a` |
| `try_borrow()` for RefCell | Avoid panic |
| Shadowing for transformation | `let x = x.parse()?` |

## Concurrency

| Rule | Guideline |
|------|-----------|
| Identify lock ordering | Prevent deadlocks |
| Atomics for primitives | Not Mutex for bool/usize |
| Choose memory order carefully | Relaxed/Acquire/Release/SeqCst |

## Async

| Rule | Guideline |
|------|-----------|
| Sync for CPU-bound | Async is for I/O |
| Don't hold locks across await | Use scoped guards |

## Macros

| Rule | Guideline |
|------|-----------|
| Avoid unless necessary | Prefer functions/generics |
| Follow Rust syntax | Macro input should look like Rust |

## Deprecated → Better

| Deprecated | Better | Since |
|------------|--------|-------|
| `lazy_static!` | `std::sync::OnceLock` | 1.70 |
| `once_cell::Lazy` | `std::sync::LazyLock` | 1.80 |
| `std::sync::mpsc` | `crossbeam::channel` | - |
| `std::sync::Mutex` | `parking_lot::Mutex` | - |
| `failure`/`error-chain` | `thiserror`/`anyhow` | - |
| `try!()` | `?` operator | 2018 |

## Quick Reference

```
Naming: snake_case (fn/var), CamelCase (type), SCREAMING_CASE (const)
Format: rustfmt (just use it)
Docs: /// for public items, //! for module docs
Lint: #![warn(clippy::all)]
```

Claude knows Rust conventions well. These are the non-obvious Rust-specific rules.

# Clippy Lint → Rule Mapping

| Clippy Lint | Category | Fix |
|-------------|----------|-----|
| `unwrap_used` | Error | Use `?` or `expect()` |
| `needless_clone` | Perf | Use reference |
| `await_holding_lock` | Async | Scope guard before await |
| `linkedlist` | Perf | Use Vec/VecDeque |
| `wildcard_imports` | Style | Explicit imports |
| `missing_safety_doc` | Safety | Add `# Safety` doc |
| `undocumented_unsafe_blocks` | Safety | Add `// SAFETY:` |
| `transmute_ptr_to_ptr` | Safety | Use `pointer::cast()` |
| `large_stack_arrays` | Mem | Use Vec or Box |
| `too_many_arguments` | Design | Use struct params |

For unsafe-related lints → see `unsafe-checker` skill.

# Complete Rules Reference

For the full 500+ rules, see:
- Source: https://rust-coding-guidelines.github.io/rust-coding-guidelines-zh/

Core rules are in `../SKILL.md`.

