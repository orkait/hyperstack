# Rust Best Practices Cheatsheet

## Borrowing & Ownership
- Prefer `&T` over `.clone()` unless ownership transfer is required
- Use `&str` over `String`, `&[T]` over `Vec<T>` in function parameters
- Small `Copy` types (≤24 bytes) can be passed by value — no cost
- Use `Cow<'_, T>` when ownership is ambiguous (sometimes needed, sometimes not)
- Pass large types (>512 bytes) by reference — avoid stack copies

## Error Handling
- Return `Result<T, E>` for fallible operations; avoid `panic!` in production
- Never use `unwrap()`/`expect()` outside tests
- Use `thiserror` for library errors (callers match on typed errors)
- Use `anyhow` for binary/application errors (context strings only)
- Prefer `?` operator over match chains for error propagation

## Performance
- Always benchmark with `--release` flag — debug is 10–100x slower
- Run `cargo clippy -- -D clippy::perf` for performance hints
- Avoid cloning in loops — use `.iter()` instead of `.into_iter()` for Copy types
- Prefer iterators over manual loops — avoid intermediate `.collect()` calls
- Keep small types on the stack; heap-allocate recursive or large (>512B) structures
- Profile with `cargo flamegraph` before optimizing — don't guess, measure

## Linting
Run: `cargo clippy --all-targets --all-features --locked -- -D warnings`

Key lints:
- `redundant_clone` — unnecessary cloning
- `large_enum_variant` — oversized variants (consider boxing)
- `needless_collect` — premature collection

Use `#[expect(clippy::lint, reason = "...")]` over `#[allow(...)]` — expect fails if the lint is fixed.

## Testing
- Name tests descriptively: `process_should_return_error_when_input_empty()`
- One assertion per test when possible
- Use doc tests (`///`) for public API examples — they compile and run with `cargo test`
- Consider `cargo insta` for snapshot testing generated output

## Generics & Dispatch
- Prefer generics (static dispatch) for performance-critical code — zero runtime cost
- Use `dyn Trait` only when heterogeneous collections are needed or type erasure is required
- Box at API boundaries, not internally — use generics internally, expose `Box<dyn Trait>` at the public API edge
- Avoid premature boxing: use `struct Renderer<B: Backend>` not `struct Renderer { backend: Box<dyn Backend> }`

## Type State Pattern
Encode valid states in the type system to catch invalid operations at compile time.
Use `PhantomData<State>` on structs — impl blocks restrict methods to valid states only.
Use only when invalid state transitions are a real risk — simple enums often suffice.

## Pointers & Thread Safety
| Pointer | Thread-safe? | Use |
|---------|-------------|-----|
| `&T` | Yes | Shared read access |
| `&mut T` | No (exclusive) | Exclusive mutation |
| `Box<T>` | Yes (if T: Send+Sync) | Single-owner heap allocation |
| `Rc<T>` | No | Multiple owners, single thread |
| `Arc<T>` | Yes | Multiple owners, multiple threads |
| `RefCell<T>` | No | Interior mutability, single thread |
| `Mutex<T>` | Yes | Shared mutability across threads |
| `RwLock<T>` | Yes | Multiple readers OR one writer |
| `OnceLock<T>` | Yes | Thread-safe single initialization |

Common pattern: `Arc<Mutex<T>>` for shared mutable state across threads.

## Documentation
- `//` comments explain *why* (safety, workarounds, design rationale)
- `///` doc comments explain *what* and *how* for public APIs
- Every `Note` comment needs a linked issue: `// Note(#42): ...`
- Enable `#![deny(missing_docs)]` for libraries