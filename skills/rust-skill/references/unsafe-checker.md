# Unsafe Rust Checker

# Unsafe Checker - Quick Reference

**Auto-generated from rules/**

## Rule Summary by Section

### General Principles (3 rules)
| ID | Level | Title |
|----|-------|-------|
| general-01 | P | Do Not Abuse Unsafe to Escape Compiler Safety Checks |
| general-02 | P | Do Not Blindly Use Unsafe for Performance |
| general-03 | G | Do Not Create Aliases for Types/Methods Named "Unsafe" |

### Safety Abstraction (11 rules)
| ID | Level | Title |
|----|-------|-------|
| safety-01 | P | Be Aware of Memory Safety Issues from Panics |
| safety-02 | P | Unsafe Code Authors Must Verify Safety Invariants |
| safety-03 | P | Do Not Expose Uninitialized Memory in Public APIs |
| safety-04 | P | Avoid Double-Free from Panic Safety Issues |
| safety-05 | P | Consider Safety When Manually Implementing Auto Traits |
| safety-06 | P | Do Not Expose Raw Pointers in Public APIs |
| safety-07 | P | Provide Unsafe Counterparts for Performance Alongside Safe Methods |
| safety-08 | P | Mutable Return from Immutable Parameter is Wrong |
| safety-09 | P | Add SAFETY Comment Before Any Unsafe Block |
| safety-10 | G | Add Safety Section in Docs for Public Unsafe Functions |
| safety-11 | G | Use assert! Instead of debug_assert! in Unsafe Functions |

### Raw Pointers (6 rules)
| ID | Level | Title |
|----|-------|-------|
| ptr-01 | P | Do Not Share Raw Pointers Across Threads |
| ptr-02 | P | Prefer NonNull<T> Over *mut T |
| ptr-03 | P | Use PhantomData<T> for Variance and Ownership |
| ptr-04 | G | Do Not Dereference Pointers Cast to Misaligned Types |
| ptr-05 | G | Do Not Manually Convert Immutable Pointer to Mutable |
| ptr-06 | G | Prefer pointer::cast Over `as` for Pointer Casting |

### Union (2 rules)
| ID | Level | Title |
|----|-------|-------|
| union-01 | P | Avoid Union Except for C Interop |
| union-02 | P | Do Not Use Union Variants Across Different Lifetimes |

### Memory Layout (6 rules)
| ID | Level | Title |
|----|-------|-------|
| mem-01 | P | Choose Appropriate Data Layout for Struct/Tuple/Enum |
| mem-02 | P | Do Not Modify Memory Variables of Other Processes |
| mem-03 | P | Do Not Let String/Vec Auto-Drop Other Process's Memory |
| mem-04 | P | Prefer Reentrant Versions of C-API or Syscalls |
| mem-05 | P | Use Third-Party Crates for Bitfields |
| mem-06 | G | Use MaybeUninit<T> for Uninitialized Memory |

### FFI (18 rules)
| ID | Level | Title |
|----|-------|-------|
| ffi-01 | P | Avoid Passing Strings Directly to C |
| ffi-02 | P | Read Documentation Carefully for std::ffi Types |
| ffi-03 | P | Implement Drop for Wrapped C Pointers |
| ffi-04 | P | Handle Panics When Crossing FFI Boundaries |
| ffi-05 | P | Use Portable Type Aliases from std or libc |
| ffi-06 | P | Ensure C-ABI String Compatibility |
| ffi-07 | P | Do Not Implement Drop for Types Passed to External Code |
| ffi-08 | P | Handle Errors Properly in FFI |
| ffi-09 | P | Use References Instead of Raw Pointers in Safe Wrappers |
| ffi-10 | P | Exported Functions Must Be Thread-Safe |
| ffi-11 | P | Be Careful with repr(packed) Field References |
| ffi-12 | P | Document Invariant Assumptions for C Parameters |
| ffi-13 | P | Ensure Consistent Data Layout for Custom Types |
| ffi-14 | P | Types in FFI Should Have Stable Layout |
| ffi-15 | P | Validate Non-Robust External Values |
| ffi-16 | P | Separate Data and Code for Closures to C |
| ffi-17 | P | Use Opaque Types Instead of c_void |
| ffi-18 | P | Avoid Passing Trait Objects to C |

### I/O Safety (1 rule)
| ID | Level | Title |
|----|-------|-------|
| io-01 | P | Ensure I/O Safety When Using Raw Handles |

## Clippy Lint Mapping

| Clippy Lint | Rule | Category |
|-------------|------|----------|
| `undocumented_unsafe_blocks` | safety-09 | SAFETY comments |
| `missing_safety_doc` | safety-10 | Safety docs |
| `panic_in_result_fn` | safety-01, ffi-04 | Panic safety |
| `non_send_fields_in_send_ty` | safety-05 | Send/Sync |
| `uninit_assumed_init` | safety-03 | Initialization |
| `uninit_vec` | mem-06 | Initialization |
| `mut_from_ref` | safety-08 | Aliasing |
| `cast_ptr_alignment` | ptr-04 | Alignment |
| `cast_ref_to_mut` | ptr-05 | Aliasing |
| `ptr_as_ptr` | ptr-06 | Pointer casting |
| `unaligned_references` | ffi-11 | Packed structs |
| `debug_assert_with_mut_call` | safety-11 | Assertions |

## Quick Decision Tree

```
Writing unsafe code?
    │
    ├─ FFI with C?
    │   └─ See ffi-* rules
    │
    ├─ Raw pointers?
    │   └─ See ptr-* rules
    │
    ├─ Manual Send/Sync?
    │   └─ See safety-05
    │
    ├─ MaybeUninit/uninitialized?
    │   └─ See safety-03, mem-06
    │
    └─ Performance optimization?
        └─ See general-02, safety-07
```

## Essential Checklist

Before every unsafe block:
- [ ] SAFETY comment present
- [ ] Invariants documented
- [ ] Pointer validity checked
- [ ] Aliasing rules followed
- [ ] Panic safety considered
- [ ] Tested with Miri

## Resources

- `checklists/before-unsafe.md` - Pre-writing checklist
- `checklists/review-unsafe.md` - Code review checklist
- `checklists/common-pitfalls.md` - Common bugs and fixes
- `examples/safe-abstraction.md` - Safe wrapper patterns
- `examples/ffi-patterns.md` - FFI best practices

---
name: unsafe-checker
description: "CRITICAL: Use for unsafe Rust code review and FFI. Triggers on: unsafe, raw pointer, FFI, extern, transmute, *mut, *const, union, #[repr(C)], libc, std::ffi, MaybeUninit, NonNull, SAFETY comment, soundness, undefined behavior, UB, safe wrapper, memory layout, bindgen, cbindgen, CString, CStr, 安全抽象, 裸指针, 外部函数接口, 内存布局, 不安全代码, FFI 绑定, 未定义行为"
globs: ["**/*.rs"]
allowed-tools: ["Read", "Grep", "Glob"]
---

Display the following ASCII art exactly as shown. Do not modify spaces or line breaks:
```text
⚠️ **Unsafe Rust Checker Loaded**

     *  ^  *
    /◉\_~^~_/◉\
 ⚡/     o     \⚡
   '_        _'
   / '-----' \
```

---

# Unsafe Rust Checker

## When Unsafe is Valid

| Use Case | Example |
|----------|---------|
| FFI | Calling C functions |
| Low-level abstractions | Implementing `Vec`, `Arc` |
| Performance | Measured bottleneck with safe alternative too slow |

**NOT valid:** Escaping borrow checker without understanding why.

## Required Documentation

```rust
// SAFETY: <why this is safe>
unsafe { ... }

/// # Safety
/// <caller requirements>
pub unsafe fn dangerous() { ... }
```

## Quick Reference

| Operation | Safety Requirements |
|-----------|---------------------|
| `*ptr` deref | Valid, aligned, initialized |
| `&*ptr` | + No aliasing violations |
| `transmute` | Same size, valid bit pattern |
| `extern "C"` | Correct signature, ABI |
| `static mut` | Synchronization guaranteed |
| `impl Send/Sync` | Actually thread-safe |

## Common Errors

| Error | Fix |
|-------|-----|
| Null pointer deref | Check for null before deref |
| Use after free | Ensure lifetime validity |
| Data race | Add proper synchronization |
| Alignment violation | Use `#[repr(C)]`, check alignment |
| Invalid bit pattern | Use `MaybeUninit` |
| Missing SAFETY comment | Add `// SAFETY:` |

## Deprecated → Better

| Deprecated | Use Instead |
|------------|-------------|
| `mem::uninitialized()` | `MaybeUninit<T>` |
| `mem::zeroed()` for refs | `MaybeUninit<T>` |
| Raw pointer arithmetic | `NonNull<T>`, `ptr::add` |
| `CString::new().unwrap().as_ptr()` | Store `CString` first |
| `static mut` | `AtomicT` or `Mutex` |
| Manual extern | `bindgen` |

## FFI Crates

| Direction | Crate |
|-----------|-------|
| C → Rust | bindgen |
| Rust → C | cbindgen |
| Python | PyO3 |
| Node.js | napi-rs |

Claude knows unsafe Rust. Focus on SAFETY comments and soundness.

# Checklist: Before Writing Unsafe Code

Use this checklist before writing any `unsafe` block or `unsafe fn`.

## 1. Do You Really Need Unsafe?

- [ ] Have you tried all safe alternatives?
- [ ] Can you restructure the code to satisfy the borrow checker?
- [ ] Would interior mutability (`Cell`, `RefCell`, `Mutex`) solve the problem?
- [ ] Is there a safe crate that already does this?
- [ ] Is the performance gain (if any) worth the safety risk?

**If you answered "no" to all, proceed with unsafe.**

## 2. What Unsafe Operation Do You Need?

Identify which specific unsafe operation you're performing:

- [ ] Dereferencing a raw pointer (`*const T`, `*mut T`)
- [ ] Calling an `unsafe` function
- [ ] Accessing a mutable static variable
- [ ] Implementing an unsafe trait (`Send`, `Sync`, etc.)
- [ ] Accessing fields of a `union`
- [ ] Using `extern "C"` functions (FFI)

## 3. Safety Invariants

For each unsafe operation, document the invariants:

### For Pointer Dereference:
- [ ] Is the pointer non-null?
- [ ] Is the pointer properly aligned for the type?
- [ ] Does the pointer point to valid, initialized memory?
- [ ] Is the memory not being mutated by other code?
- [ ] Will the memory remain valid for the entire duration of use?

### For Mutable Aliasing:
- [ ] Are you creating multiple mutable references to the same memory?
- [ ] Is there any possibility of aliasing `&mut` and `&`?
- [ ] Have you verified no other code can access this memory?

### For FFI:
- [ ] Is the function signature correct (types, ABI)?
- [ ] Are you handling potential null pointers?
- [ ] Are you handling potential panics (catch_unwind)?
- [ ] Is memory ownership clear (who allocates, who frees)?

### For Send/Sync:
- [ ] Is concurrent access properly synchronized?
- [ ] Are there any data races possible?
- [ ] Does the type truly satisfy the trait requirements?

## 4. Panic Safety

- [ ] What happens if this code panics at any line?
- [ ] Are data structures left in a valid state on panic?
- [ ] Do you need a panic guard for cleanup?
- [ ] Could a destructor see invalid state?

## 5. Documentation

- [ ] Have you written a `// SAFETY:` comment explaining:
  - What invariants must hold?
  - Why those invariants are upheld here?

- [ ] For `unsafe fn`, have you written `# Safety` docs explaining:
  - What the caller must guarantee?
  - What happens if requirements are violated?

## 6. Testing and Verification

- [ ] Can you add debug assertions to verify invariants?
- [ ] Have you tested with Miri (`cargo miri test`)?
- [ ] Have you tested with address sanitizer (`RUSTFLAGS="-Zsanitizer=address"`)?
- [ ] Have you considered fuzzing the unsafe code?

## Quick Reference: Common SAFETY Comments

```rust
// SAFETY: We checked that index < len above, so this is in bounds.

// SAFETY: The pointer was created from a valid reference and hasn't been invalidated.

// SAFETY: We hold the lock, guaranteeing exclusive access.

// SAFETY: The type is #[repr(C)] and all fields are initialized.

// SAFETY: Caller guarantees the pointer is non-null and properly aligned.
```

## Decision Flowchart

```
Need unsafe?
     |
     v
Can you use safe Rust? --Yes--> Don't use unsafe
     |
     No
     v
Can you use existing safe abstraction? --Yes--> Use it (std, crates)
     |
     No
     v
Document all invariants
     |
     v
Add SAFETY comments
     |
     v
Write the unsafe code
     |
     v
Test with Miri
```

# Common Unsafe Pitfalls and Fixes

A reference of frequently encountered unsafe bugs and how to fix them.

## Pitfall 1: Dangling Pointer from Local

**Bug:**
```rust
fn bad() -> *const i32 {
    let x = 42;
    &x as *const i32  // Dangling after return!
}
```

**Fix:**
```rust
fn good() -> Box<i32> {
    Box::new(42)  // Heap allocation lives beyond function
}

// Or return the value itself
fn better() -> i32 {
    42
}
```

## Pitfall 2: CString Lifetime

**Bug:**
```rust
fn bad() -> *const c_char {
    let s = CString::new("hello").unwrap();
    s.as_ptr()  // Dangling! CString dropped
}
```

**Fix:**
```rust
fn good(s: &CString) -> *const c_char {
    s.as_ptr()  // Caller keeps CString alive
}

// Or take ownership
fn also_good(s: CString) -> *const c_char {
    s.into_raw()  // Caller must free with CString::from_raw
}
```

## Pitfall 3: Vec set_len with Uninitialized Data

**Bug:**
```rust
fn bad() -> Vec<String> {
    let mut v = Vec::with_capacity(10);
    unsafe { v.set_len(10); }  // Strings are uninitialized!
    v
}
```

**Fix:**
```rust
fn good() -> Vec<String> {
    let mut v = Vec::with_capacity(10);
    for _ in 0..10 {
        v.push(String::new());
    }
    v
}

// Or use resize
fn also_good() -> Vec<String> {
    let mut v = Vec::new();
    v.resize(10, String::new());
    v
}
```

## Pitfall 4: Reference to Packed Field

**Bug:**
```rust
#[repr(packed)]
struct Packed { a: u8, b: u32 }

fn bad(p: &Packed) -> &u32 {
    &p.b  // UB: misaligned reference!
}
```

**Fix:**
```rust
fn good(p: &Packed) -> u32 {
    unsafe { std::ptr::addr_of!(p.b).read_unaligned() }
}
```

## Pitfall 5: Mutable Aliasing Through Raw Pointers

**Bug:**
```rust
fn bad() {
    let mut x = 42;
    let ptr1 = &mut x as *mut i32;
    let ptr2 = &mut x as *mut i32;  // Already have ptr1!
    unsafe {
        *ptr1 = 1;
        *ptr2 = 2;  // Aliasing mutable pointers!
    }
}
```

**Fix:**
```rust
fn good() {
    let mut x = 42;
    let ptr = &mut x as *mut i32;
    unsafe {
        *ptr = 1;
        *ptr = 2;  // Same pointer, sequential access
    }
}
```

## Pitfall 6: Transmute to Wrong Size

**Bug:**
```rust
fn bad() {
    let x: u32 = 42;
    let y: u64 = unsafe { std::mem::transmute(x) };  // UB: size mismatch!
}
```

**Fix:**
```rust
fn good() {
    let x: u32 = 42;
    let y: u64 = x as u64;  // Use conversion
}
```

## Pitfall 7: Invalid Enum Discriminant

**Bug:**
```rust
#[repr(u8)]
enum Status { A = 0, B = 1, C = 2 }

fn bad(raw: u8) -> Status {
    unsafe { std::mem::transmute(raw) }  // UB if raw > 2!
}
```

**Fix:**
```rust
fn good(raw: u8) -> Option<Status> {
    match raw {
        0 => Some(Status::A),
        1 => Some(Status::B),
        2 => Some(Status::C),
        _ => None,
    }
}
```

## Pitfall 8: FFI Panic Unwinding

**Bug:**
```rust
#[no_mangle]
extern "C" fn callback(x: i32) -> i32 {
    if x < 0 {
        panic!("negative!");  // UB: unwinding across FFI!
    }
    x * 2
}
```

**Fix:**
```rust
#[no_mangle]
extern "C" fn callback(x: i32) -> i32 {
    std::panic::catch_unwind(|| {
        if x < 0 {
            panic!("negative!");
        }
        x * 2
    }).unwrap_or(-1)  // Return error code on panic
}
```

## Pitfall 9: Double Free from Clone + into_raw

**Bug:**
```rust
struct Handle(*mut c_void);

impl Clone for Handle {
    fn clone(&self) -> Self {
        Handle(self.0)  // Both now "own" same pointer!
    }
}

impl Drop for Handle {
    fn drop(&mut self) {
        unsafe { free(self.0); }  // Double free when both drop!
    }
}
```

**Fix:**
```rust
struct Handle(*mut c_void);

// Don't implement Clone, or implement proper reference counting
impl Handle {
    fn clone_ptr(&self) -> *mut c_void {
        self.0  // Return raw pointer, no ownership
    }
}
```

## Pitfall 10: Forget Doesn't Run Destructors

**Bug:**
```rust
fn bad() {
    let guard = lock.lock();
    std::mem::forget(guard);  // Lock never released!
}
```

**Fix:**
```rust
fn good() {
    let guard = lock.lock();
    // Let guard drop naturally
    // or explicitly: drop(guard);
}
```

## Quick Reference Table

| Pitfall | Detection | Fix |
|---------|-----------|-----|
| Dangling pointer | Miri | Extend lifetime or heap allocate |
| Uninitialized read | Miri | Use MaybeUninit properly |
| Misaligned access | Miri, UBsan | read_unaligned, copy by value |
| Data race | TSan | Use atomics or mutex |
| Double free | ASan | Track ownership carefully |
| Invalid enum | Manual review | Use TryFrom |
| FFI panic | Testing | catch_unwind |
| Type confusion | Miri | Match types exactly |

# Checklist: Reviewing Unsafe Code

Use this checklist when reviewing code containing `unsafe`.

## 1. Surface-Level Checks

- [ ] Does every `unsafe` block have a `// SAFETY:` comment?
- [ ] Does every `unsafe fn` have `# Safety` documentation?
- [ ] Are the safety comments specific and verifiable, not vague?
- [ ] Is the unsafe code minimized (smallest possible unsafe block)?

## 2. Pointer Validity

For each pointer dereference:

- [ ] **Non-null**: Is null checked before dereference?
- [ ] **Aligned**: Is alignment verified or guaranteed by construction?
- [ ] **Valid**: Does the pointer point to allocated memory?
- [ ] **Initialized**: Is the memory initialized before reading?
- [ ] **Lifetime**: Is the memory valid for the entire use duration?
- [ ] **Unique**: For `&mut`, is there only one mutable reference?

## 3. Memory Safety

- [ ] **No aliasing**: Are `&` and `&mut` never created to the same memory simultaneously?
- [ ] **No use-after-free**: Is memory not accessed after deallocation?
- [ ] **No double-free**: Is memory freed exactly once?
- [ ] **No data races**: Is concurrent access properly synchronized?
- [ ] **Bounds checked**: Are array/slice accesses in bounds?

## 4. Type Safety

- [ ] **Transmute**: Are transmuted types actually compatible?
- [ ] **Repr**: Do FFI types have `#[repr(C)]`?
- [ ] **Enum values**: Are enum discriminants validated from external sources?
- [ ] **Unions**: Is the correct union field accessed?

## 5. Panic Safety

- [ ] What state is the program in if this code panics?
- [ ] Are partially constructed objects properly cleaned up?
- [ ] Do Drop implementations see valid state?
- [ ] Is there a panic guard if needed?

## 6. FFI-Specific Checks

- [ ] **Types**: Do Rust types match C types exactly?
- [ ] **Strings**: Are strings properly null-terminated?
- [ ] **Ownership**: Is it clear who owns/frees memory?
- [ ] **Thread safety**: Are callbacks thread-safe?
- [ ] **Panic boundary**: Are panics caught before crossing FFI?
- [ ] **Error handling**: Are C-style errors properly handled?

## 7. Concurrency Checks

- [ ] **Send/Sync**: Are manual implementations actually sound?
- [ ] **Atomics**: Are memory orderings correct?
- [ ] **Locks**: Is there potential for deadlock?
- [ ] **Data races**: Is all shared mutable state synchronized?

## 8. Red Flags (Require Extra Scrutiny)

| Pattern | Concern |
|---------|---------|
| `transmute` | Type compatibility, provenance |
| `as` on pointers | Alignment, type punning |
| `static mut` | Data races |
| `*const T as *mut T` | Aliasing violation |
| Manual `Send`/`Sync` | Thread safety |
| `assume_init` | Initialization |
| `set_len` on Vec | Uninitialized memory |
| `from_raw_parts` | Lifetime, validity |
| `offset`/`add`/`sub` | Out of bounds |
| FFI callbacks | Panic safety |

## 9. Verification Questions

Ask the author:
- "What would happen if [X invariant] was violated?"
- "How do you know [pointer/reference] is valid here?"
- "What if this panics at [specific line]?"
- "Who is responsible for freeing this memory?"

## 10. Testing Requirements

- [ ] Has this been tested with Miri?
- [ ] Are there unit tests covering edge cases?
- [ ] Are there tests for error conditions?
- [ ] Has concurrent code been tested under stress?

## Review Severity Guide

| Severity | Requires |
|----------|----------|
| `transmute` | Two reviewers, Miri test |
| Manual `Send`/`Sync` | Thread safety expert review |
| FFI | Documentation of C interface |
| `static mut` | Justification for not using atomic/mutex |
| Pointer arithmetic | Bounds proof |

## Sample Review Comments

```
// Good SAFETY comment ✓
// SAFETY: index was checked to be < len on line 42

// Needs improvement ✗
// SAFETY: This is safe because we know it works

// Missing information ✗
// SAFETY: ptr is valid
// (Why is it valid? How do we know?)
```

# FFI Best Practices and Patterns

Examples of safe and idiomatic Rust-C interoperability.

## Pattern 1: Basic FFI Wrapper

```rust
use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_int, c_void};
use std::ptr::NonNull;

// Raw C API
mod ffi {
    use super::*;

    extern "C" {
        pub fn lib_create(name: *const c_char) -> *mut c_void;
        pub fn lib_destroy(handle: *mut c_void);
        pub fn lib_process(handle: *mut c_void, data: *const u8, len: usize) -> c_int;
        pub fn lib_get_error() -> *const c_char;
    }
}

// Safe Rust wrapper
pub struct Library {
    handle: NonNull<c_void>,
}

#[derive(Debug)]
pub struct LibraryError(String);

impl Library {
    pub fn new(name: &str) -> Result<Self, LibraryError> {
        let c_name = CString::new(name).map_err(|_| LibraryError("invalid name".into()))?;

        let handle = unsafe { ffi::lib_create(c_name.as_ptr()) };

        NonNull::new(handle)
            .map(|handle| Self { handle })
            .ok_or_else(|| Self::last_error())
    }

    pub fn process(&self, data: &[u8]) -> Result<(), LibraryError> {
        let result = unsafe {
            ffi::lib_process(self.handle.as_ptr(), data.as_ptr(), data.len())
        };

        if result == 0 {
            Ok(())
        } else {
            Err(Self::last_error())
        }
    }

    fn last_error() -> LibraryError {
        let ptr = unsafe { ffi::lib_get_error() };
        if ptr.is_null() {
            LibraryError("unknown error".into())
        } else {
            let msg = unsafe { CStr::from_ptr(ptr) }
                .to_string_lossy()
                .into_owned();
            LibraryError(msg)
        }
    }
}

impl Drop for Library {
    fn drop(&mut self) {
        unsafe { ffi::lib_destroy(self.handle.as_ptr()); }
    }
}

// Prevent accidental copies
impl !Clone for Library {}
```

## Pattern 2: Callback Registration

```rust
use std::os::raw::{c_int, c_void};
use std::panic::{catch_unwind, AssertUnwindSafe};

type CCallback = extern "C" fn(value: c_int, user_data: *mut c_void) -> c_int;

extern "C" {
    fn register_callback(cb: CCallback, user_data: *mut c_void);
    fn unregister_callback();
}

/// Safely register a Rust closure as a C callback.
pub struct CallbackGuard<F> {
    _closure: Box<F>,
}

impl<F: FnMut(i32) -> i32 + 'static> CallbackGuard<F> {
    pub fn register(closure: F) -> Self {
        let boxed = Box::new(closure);
        let user_data = Box::into_raw(boxed) as *mut c_void;

        extern "C" fn trampoline<F: FnMut(i32) -> i32>(
            value: c_int,
            user_data: *mut c_void,
        ) -> c_int {
            let result = catch_unwind(AssertUnwindSafe(|| {
                let closure = unsafe { &mut *(user_data as *mut F) };
                closure(value as i32) as c_int
            }));
            result.unwrap_or(-1)
        }

        unsafe {
            register_callback(trampoline::<F>, user_data);
        }

        Self {
            // SAFETY: We just created this box and need to keep it alive
            _closure: unsafe { Box::from_raw(user_data as *mut F) },
        }
    }
}

impl<F> Drop for CallbackGuard<F> {
    fn drop(&mut self) {
        unsafe { unregister_callback(); }
        // Box in _closure is dropped automatically
    }
}

// Usage
fn example() {
    let multiplier = 2;
    let _guard = CallbackGuard::register(move |x| x * multiplier);
    // Callback is active until _guard is dropped
}
```

## Pattern 3: Opaque Handle Types

```rust
use std::marker::PhantomData;

// Opaque type markers - prevents mixing up handles
#[repr(C)]
pub struct DatabaseHandle {
    _data: [u8; 0],
    _marker: PhantomData<(*mut u8, std::marker::PhantomPinned)>,
}

#[repr(C)]
pub struct ConnectionHandle {
    _data: [u8; 0],
    _marker: PhantomData<(*mut u8, std::marker::PhantomPinned)>,
}

mod ffi {
    use super::*;

    extern "C" {
        pub fn db_open(path: *const c_char) -> *mut DatabaseHandle;
        pub fn db_close(db: *mut DatabaseHandle);
        pub fn db_connect(db: *mut DatabaseHandle) -> *mut ConnectionHandle;
        pub fn conn_close(conn: *mut ConnectionHandle);
        pub fn conn_query(conn: *mut ConnectionHandle, sql: *const c_char) -> c_int;
    }
}

// Type-safe wrappers
pub struct Database {
    handle: NonNull<DatabaseHandle>,
}

pub struct Connection<'db> {
    handle: NonNull<ConnectionHandle>,
    _db: PhantomData<&'db Database>,
}

impl Database {
    pub fn open(path: &str) -> Result<Self, ()> {
        let c_path = CString::new(path).map_err(|_| ())?;
        let handle = unsafe { ffi::db_open(c_path.as_ptr()) };
        NonNull::new(handle).map(|h| Self { handle: h }).ok_or(())
    }

    pub fn connect(&self) -> Result<Connection<'_>, ()> {
        let handle = unsafe { ffi::db_connect(self.handle.as_ptr()) };
        NonNull::new(handle)
            .map(|h| Connection { handle: h, _db: PhantomData })
            .ok_or(())
    }
}

impl Drop for Database {
    fn drop(&mut self) {
        // All Connections must be dropped first (enforced by lifetime)
        unsafe { ffi::db_close(self.handle.as_ptr()); }
    }
}

impl Connection<'_> {
    pub fn query(&self, sql: &str) -> Result<(), ()> {
        let c_sql = CString::new(sql).map_err(|_| ())?;
        let result = unsafe { ffi::conn_query(self.handle.as_ptr(), c_sql.as_ptr()) };
        if result == 0 { Ok(()) } else { Err(()) }
    }
}

impl Drop for Connection<'_> {
    fn drop(&mut self) {
        unsafe { ffi::conn_close(self.handle.as_ptr()); }
    }
}
```

## Pattern 4: Error Handling Across FFI

```rust
use std::os::raw::c_int;

// Error codes for C
pub const SUCCESS: c_int = 0;
pub const ERR_NULL_PTR: c_int = 1;
pub const ERR_INVALID_UTF8: c_int = 2;
pub const ERR_IO: c_int = 3;
pub const ERR_PANIC: c_int = -1;

// Thread-local error storage
thread_local! {
    static LAST_ERROR: std::cell::RefCell<Option<Box<dyn std::error::Error>>> =
        std::cell::RefCell::new(None);
}

fn set_last_error<E: std::error::Error + 'static>(err: E) {
    LAST_ERROR.with(|e| {
        *e.borrow_mut() = Some(Box::new(err));
    });
}

/// Get the last error message. Caller must free with `free_string`.
#[no_mangle]
pub extern "C" fn get_last_error() -> *mut c_char {
    LAST_ERROR.with(|e| {
        e.borrow()
            .as_ref()
            .map(|err| {
                CString::new(err.to_string())
                    .unwrap_or_else(|_| CString::new("error").unwrap())
                    .into_raw()
            })
            .unwrap_or(std::ptr::null_mut())
    })
}

/// Free a string returned by this library.
#[no_mangle]
pub extern "C" fn free_string(s: *mut c_char) {
    if !s.is_null() {
        // SAFETY: String was created by CString::into_raw
        unsafe { drop(CString::from_raw(s)); }
    }
}

/// Example function with proper error handling.
#[no_mangle]
pub extern "C" fn do_operation(data: *const u8, len: usize) -> c_int {
    let result = catch_unwind(AssertUnwindSafe(|| -> Result<(), c_int> {
        if data.is_null() {
            return Err(ERR_NULL_PTR);
        }

        let slice = unsafe { std::slice::from_raw_parts(data, len) };

        std::str::from_utf8(slice)
            .map_err(|e| {
                set_last_error(e);
                ERR_INVALID_UTF8
            })?;

        // Do actual work...

        Ok(())
    }));

    match result {
        Ok(Ok(())) => SUCCESS,
        Ok(Err(code)) => code,
        Err(_) => ERR_PANIC,
    }
}
```

## Pattern 5: Struct with C Layout

```rust
use std::os::raw::{c_char, c_int};

/// A C-compatible configuration struct.
#[repr(C)]
pub struct Config {
    pub version: c_int,
    pub flags: u32,
    pub name: [c_char; 64],
    pub name_len: usize,
}

impl Config {
    pub fn new(version: i32, flags: u32, name: &str) -> Option<Self> {
        if name.len() >= 64 {
            return None;
        }

        let mut config = Self {
            version: version as c_int,
            flags,
            name: [0; 64],
            name_len: name.len(),
        };

        // Copy name bytes
        for (i, byte) in name.bytes().enumerate() {
            config.name[i] = byte as c_char;
        }

        Some(config)
    }

    pub fn name(&self) -> &str {
        let bytes = unsafe {
            std::slice::from_raw_parts(
                self.name.as_ptr() as *const u8,
                self.name_len,
            )
        };
        // SAFETY: We only store valid UTF-8 in new()
        unsafe { std::str::from_utf8_unchecked(bytes) }
    }
}

// Verify layout at compile time
const _: () = {
    assert!(std::mem::size_of::<Config>() == 80);  // 4 + 4 + 64 + 8
    assert!(std::mem::align_of::<Config>() == 8);
};
```

## Key FFI Guidelines

1. **Always use `#[repr(C)]`** for types crossing FFI
2. **Handle null pointers** at the boundary
3. **Catch panics** before returning to C
4. **Document ownership** clearly
5. **Use opaque types** for type safety
6. **Keep unsafe minimal** and well-documented

# Safe Abstraction Examples

Examples of building safe APIs on top of unsafe code.

## Example 1: Simple Wrapper with Bounds Check

```rust
/// A slice wrapper that provides unchecked access internally
/// but safe access externally.
pub struct SafeSlice<'a, T> {
    ptr: *const T,
    len: usize,
    _marker: std::marker::PhantomData<&'a T>,
}

impl<'a, T> SafeSlice<'a, T> {
    /// Creates a SafeSlice from a regular slice.
    pub fn new(slice: &'a [T]) -> Self {
        Self {
            ptr: slice.as_ptr(),
            len: slice.len(),
            _marker: std::marker::PhantomData,
        }
    }

    /// Safe get - returns Option.
    pub fn get(&self, index: usize) -> Option<&T> {
        if index < self.len {
            // SAFETY: We just verified index < len
            Some(unsafe { &*self.ptr.add(index) })
        } else {
            None
        }
    }

    /// Unsafe get - caller must ensure bounds.
    ///
    /// # Safety
    /// `index` must be less than `self.len()`.
    pub unsafe fn get_unchecked(&self, index: usize) -> &T {
        debug_assert!(index < self.len);
        &*self.ptr.add(index)
    }

    pub fn len(&self) -> usize {
        self.len
    }
}
```

## Example 2: Resource Wrapper with Drop

```rust
use std::ptr::NonNull;

/// Safe wrapper around a C-allocated buffer.
pub struct CBuffer {
    ptr: NonNull<u8>,
    len: usize,
}

extern "C" {
    fn c_alloc(size: usize) -> *mut u8;
    fn c_free(ptr: *mut u8);
}

impl CBuffer {
    /// Creates a new buffer. Returns None if allocation fails.
    pub fn new(size: usize) -> Option<Self> {
        let ptr = unsafe { c_alloc(size) };
        NonNull::new(ptr).map(|ptr| Self { ptr, len: size })
    }

    /// Returns a slice view of the buffer.
    pub fn as_slice(&self) -> &[u8] {
        // SAFETY: ptr is valid for len bytes (from c_alloc contract)
        unsafe { std::slice::from_raw_parts(self.ptr.as_ptr(), self.len) }
    }

    /// Returns a mutable slice view.
    pub fn as_mut_slice(&mut self) -> &mut [u8] {
        // SAFETY: We have &mut self, so exclusive access
        unsafe { std::slice::from_raw_parts_mut(self.ptr.as_ptr(), self.len) }
    }
}

impl Drop for CBuffer {
    fn drop(&mut self) {
        // SAFETY: ptr was allocated by c_alloc and not yet freed
        unsafe { c_free(self.ptr.as_ptr()); }
    }
}

// Prevent double-free
impl !Clone for CBuffer {}

// Safe to send between threads (assuming c_alloc is thread-safe)
unsafe impl Send for CBuffer {}
```

## Example 3: Interior Mutability with UnsafeCell

```rust
use std::cell::UnsafeCell;
use std::sync::atomic::{AtomicBool, Ordering};

/// A simple spinlock demonstrating safe abstraction over UnsafeCell.
pub struct SpinLock<T> {
    locked: AtomicBool,
    data: UnsafeCell<T>,
}

pub struct SpinLockGuard<'a, T> {
    lock: &'a SpinLock<T>,
}

impl<T> SpinLock<T> {
    pub const fn new(data: T) -> Self {
        Self {
            locked: AtomicBool::new(false),
            data: UnsafeCell::new(data),
        }
    }

    pub fn lock(&self) -> SpinLockGuard<'_, T> {
        // Spin until we acquire the lock
        while self.locked.compare_exchange_weak(
            false,
            true,
            Ordering::Acquire,
            Ordering::Relaxed,
        ).is_err() {
            std::hint::spin_loop();
        }
        SpinLockGuard { lock: self }
    }
}

impl<T> std::ops::Deref for SpinLockGuard<'_, T> {
    type Target = T;

    fn deref(&self) -> &T {
        // SAFETY: We hold the lock, so we have exclusive access
        unsafe { &*self.lock.data.get() }
    }
}

impl<T> std::ops::DerefMut for SpinLockGuard<'_, T> {
    fn deref_mut(&mut self) -> &mut T {
        // SAFETY: We hold the lock, so we have exclusive access
        unsafe { &mut *self.lock.data.get() }
    }
}

impl<T> Drop for SpinLockGuard<'_, T> {
    fn drop(&mut self) {
        self.lock.locked.store(false, Ordering::Release);
    }
}

// SAFETY: The lock ensures only one thread accesses data at a time
unsafe impl<T: Send> Sync for SpinLock<T> {}
unsafe impl<T: Send> Send for SpinLock<T> {}
```

## Example 4: Iterator with Lifetime Tracking

```rust
use std::marker::PhantomData;

/// An iterator over raw pointer range with proper lifetime tracking.
pub struct PtrIter<'a, T> {
    current: *const T,
    end: *const T,
    _marker: PhantomData<&'a T>,
}

impl<'a, T> PtrIter<'a, T> {
    /// Creates an iterator from a slice.
    pub fn new(slice: &'a [T]) -> Self {
        let ptr = slice.as_ptr();
        Self {
            current: ptr,
            // SAFETY: Adding len to slice pointer is always valid
            end: unsafe { ptr.add(slice.len()) },
            _marker: PhantomData,
        }
    }
}

impl<'a, T> Iterator for PtrIter<'a, T> {
    type Item = &'a T;

    fn next(&mut self) -> Option<Self::Item> {
        if self.current == self.end {
            None
        } else {
            // SAFETY:
            // - current < end (checked above)
            // - PhantomData<&'a T> ensures the data lives for 'a
            let item = unsafe { &*self.current };
            self.current = unsafe { self.current.add(1) };
            Some(item)
        }
    }
}
```

## Example 5: Builder Pattern with Delayed Initialization

```rust
use std::mem::MaybeUninit;

/// A builder that collects exactly N items, then produces an array.
pub struct ArrayBuilder<T, const N: usize> {
    data: [MaybeUninit<T>; N],
    count: usize,
}

impl<T, const N: usize> ArrayBuilder<T, N> {
    pub fn new() -> Self {
        Self {
            // SAFETY: MaybeUninit doesn't require initialization
            data: unsafe { MaybeUninit::uninit().assume_init() },
            count: 0,
        }
    }

    pub fn push(&mut self, value: T) -> Result<(), T> {
        if self.count >= N {
            return Err(value);
        }
        self.data[self.count].write(value);
        self.count += 1;
        Ok(())
    }

    pub fn build(self) -> Option<[T; N]> {
        if self.count != N {
            return None;
        }

        // SAFETY: All N elements have been initialized
        let result = unsafe {
            // Prevent drop of self.data (we're moving out)
            let data = std::ptr::read(&self.data);
            std::mem::forget(self);
            // Transmute MaybeUninit array to initialized array
            std::mem::transmute_copy::<[MaybeUninit<T>; N], [T; N]>(&data)
        };
        Some(result)
    }
}

impl<T, const N: usize> Drop for ArrayBuilder<T, N> {
    fn drop(&mut self) {
        // Drop only initialized elements
        for i in 0..self.count {
            // SAFETY: Elements 0..count are initialized
            unsafe { self.data[i].assume_init_drop(); }
        }
    }
}
```

## Key Patterns

1. **Encapsulation**: Hide unsafe behind safe public API
2. **Invariant maintenance**: Use private fields to maintain invariants
3. **PhantomData**: Track lifetimes and ownership for pointers
4. **RAII**: Use Drop for cleanup
5. **Type state**: Use types to encode valid states

# Unsafe Checker - Section Definitions

## Section Overview

| # | Section | Prefix | Level | Count | Impact |
|---|---------|--------|-------|-------|--------|
| 1 | General Principles | `general-` | CRITICAL | 3 | Foundational unsafe usage guidance |
| 2 | Safety Abstraction | `safety-` | CRITICAL | 11 | Building sound safe APIs |
| 3 | Raw Pointers | `ptr-` | HIGH | 6 | Pointer manipulation safety |
| 4 | Union | `union-` | HIGH | 2 | Union type safety |
| 5 | Memory Layout | `mem-` | HIGH | 6 | Data representation correctness |
| 6 | FFI | `ffi-` | CRITICAL | 18 | C interoperability safety |
| 7 | I/O Safety | `io-` | MEDIUM | 1 | Handle/resource safety |

## Section Details

### 1. General Principles (`general-`)

**Focus**: When and why to use unsafe

- P.UNS.01: Don't abuse unsafe to escape borrow checker
- P.UNS.02: Don't use unsafe blindly for performance
- G.UNS.01: Don't create aliases for "unsafe" named items

### 2. Safety Abstraction (`safety-`)

**Focus**: Building sound safe abstractions over unsafe code

Key invariants:
- Panic safety
- Memory initialization
- Send/Sync correctness
- API soundness

### 3. Raw Pointers (`ptr-`)

**Focus**: Safe pointer manipulation patterns

- Aliasing rules
- Alignment requirements
- Null/dangling prevention
- Type casting

### 4. Union (`union-`)

**Focus**: Safe union usage (primarily for C interop)

- Initialization rules
- Lifetime considerations
- Type punning dangers

### 5. Memory Layout (`mem-`)

**Focus**: Correct data representation

- `#[repr(C)]` usage
- Alignment and padding
- Uninitialized memory
- Cross-process memory

### 6. FFI (`ffi-`)

**Focus**: Safe C interoperability

Subcategories:
- String handling (CString, CStr)
- Type compatibility
- Error handling across FFI
- Thread safety
- Resource management

### 7. I/O Safety (`io-`)

**Focus**: Handle and resource ownership

- Raw file descriptor safety
- Handle validity guarantees

# Rule Template

Use this template for all unsafe-checker rules.

---

```markdown
---
id: {prefix}-{number}
original_id: P.UNS.XXX.YY or G.UNS.XXX.YY
level: P|G
impact: CRITICAL|HIGH|MEDIUM
clippy: <clippy_lint_name> (if applicable)
---

# {Rule Title}

## Summary

One-sentence description of what this rule requires.

## Rationale

Why this rule matters for safety/soundness.

## Bad Example

```rust
// DON'T: Description of the anti-pattern
<code that violates the rule>
```

## Good Example

```rust
// DO: Description of the correct pattern
<code that follows the rule>
```

## Common Violations

1. Violation pattern 1
2. Violation pattern 2

## Checklist

- [ ] Check item 1
- [ ] Check item 2

## Related Rules

- `{other-rule-id}`: Brief description
```

---
id: ffi-01
original_id: P.UNS.FFI.01
level: P
impact: HIGH
---

# Avoid Passing Strings Directly to C from Public Rust API

## Summary

Use `CString` and `CStr` for string handling at FFI boundaries. Never pass Rust `String` or `&str` directly to C.

## Rationale

- Rust strings are UTF-8, not null-terminated
- C strings require null terminator
- Rust strings may contain interior null bytes
- Memory layout differs between Rust String and C char*

## Bad Example

```rust
extern "C" {
    fn c_print(s: *const u8);
    fn c_strlen(s: *const u8) -> usize;
}

// DON'T: Pass Rust string directly
fn bad_print(s: &str) {
    unsafe {
        c_print(s.as_ptr());  // Not null-terminated!
    }
}

// DON'T: Assume length matches
fn bad_strlen(s: &str) -> usize {
    unsafe {
        c_strlen(s.as_ptr())  // May read past buffer
    }
}

// DON'T: Use String in FFI signatures
extern "C" fn bad_callback(s: String) {  // Wrong!
    println!("{}", s);
}
```

## Good Example

```rust
use std::ffi::{CString, CStr};
use std::os::raw::c_char;

extern "C" {
    fn c_print(s: *const c_char);
    fn c_strlen(s: *const c_char) -> usize;
    fn c_get_string() -> *const c_char;
}

// DO: Convert to CString for passing to C
fn good_print(s: &str) -> Result<(), std::ffi::NulError> {
    let c_string = CString::new(s)?;  // Adds null terminator, checks for interior nulls
    unsafe {
        c_print(c_string.as_ptr());
    }
    Ok(())
}

// DO: Use CStr for receiving C strings
fn good_receive() -> String {
    unsafe {
        let ptr = c_get_string();
        let c_str = CStr::from_ptr(ptr);
        c_str.to_string_lossy().into_owned()
    }
}

// DO: Handle interior null bytes
fn handle_nulls(s: &str) {
    match CString::new(s) {
        Ok(c_string) => unsafe { c_print(c_string.as_ptr()) },
        Err(e) => {
            // String contains interior null at position e.nul_position()
            eprintln!("String contains null byte at {}", e.nul_position());
        }
    }
}

// DO: Use proper types in callbacks
extern "C" fn good_callback(s: *const c_char) {
    if !s.is_null() {
        let c_str = unsafe { CStr::from_ptr(s) };
        if let Ok(rust_str) = c_str.to_str() {
            println!("{}", rust_str);
        }
    }
}
```

## String Type Comparison

| Type | Null-terminated | Encoding | Use |
|------|-----------------|----------|-----|
| `String` | No | UTF-8 | Rust owned |
| `&str` | No | UTF-8 | Rust borrowed |
| `CString` | Yes | Byte | Rust-to-C owned |
| `&CStr` | Yes | Byte | Rust-to-C borrowed |
| `*const c_char` | Yes | Byte | FFI pointer |
| `OsString` | Platform | Platform | Paths, env |

## Checklist

- [ ] Am I passing Rust strings to C? → Use CString
- [ ] Am I receiving C strings? → Use CStr
- [ ] Does my string contain null bytes? → Handle NulError
- [ ] Am I checking for null pointers from C?

## Related Rules

- `ffi-02`: Read documentation for std::ffi types
- `ffi-06`: Ensure C-ABI string compatibility

---
id: ffi-02
original_id: P.UNS.FFI.02
level: P
impact: MEDIUM
---

# Read Documentation Carefully When Using std::ffi Types

## Summary

The `std::ffi` module has many types with subtle differences. Read their documentation carefully to avoid misuse.

## Key Types in std::ffi

### CString vs CStr

```rust
use std::ffi::{CString, CStr};
use std::os::raw::c_char;

// CString: Owned, heap-allocated, null-terminated
// - Use when creating strings to pass to C
// - Owns the memory
let owned = CString::new("hello").unwrap();
let ptr: *const c_char = owned.as_ptr();
// ptr valid until `owned` is dropped

// CStr: Borrowed, null-terminated
// - Use when receiving strings from C
// - Does not own memory
let borrowed: &CStr = unsafe { CStr::from_ptr(ptr) };
// borrowed valid as long as ptr is valid
```

### OsString vs OsStr

```rust
use std::ffi::{OsString, OsStr};
use std::path::Path;

// OsString/OsStr: Platform-native strings
// - Windows: potentially ill-formed UTF-16
// - Unix: arbitrary bytes
// - Use for paths and environment variables

let path = Path::new("/some/path");
let os_str: &OsStr = path.as_os_str();

// Convert to Rust string (may fail)
if let Some(s) = os_str.to_str() {
    println!("Valid UTF-8: {}", s);
}
```

### c_void and Opaque Types

```rust
use std::ffi::c_void;

extern "C" {
    fn get_handle() -> *mut c_void;
    fn use_handle(h: *mut c_void);
}

// c_void is for truly opaque pointers
// Better: use dedicated opaque types (see ffi-17)
```

## Common Pitfalls

```rust
use std::ffi::CString;

// PITFALL 1: CString::as_ptr() lifetime
fn bad_ptr() -> *const i8 {
    let s = CString::new("hello").unwrap();
    s.as_ptr()  // Dangling! s dropped at end of function
}

fn good_ptr(s: &CString) -> *const i8 {
    s.as_ptr()  // OK: s outlives the pointer
}

// PITFALL 2: CString::new with interior nulls
let result = CString::new("hello\0world");
assert!(result.is_err());  // Interior null!

// PITFALL 3: CStr::from_ptr safety
unsafe {
    let ptr: *const i8 = std::ptr::null();
    // let cstr = CStr::from_ptr(ptr);  // UB: null pointer!

    // Always check for null first
    if !ptr.is_null() {
        let cstr = CStr::from_ptr(ptr);
    }
}

// PITFALL 4: CStr assumes valid null-terminated string
unsafe {
    let bytes = [104, 101, 108, 108, 111];  // "hello" without null
    let ptr = bytes.as_ptr() as *const i8;
    // let cstr = CStr::from_ptr(ptr);  // UB: no null terminator!

    // Use from_bytes_with_nul instead
    let bytes_with_nul = b"hello\0";
    let cstr = CStr::from_bytes_with_nul(bytes_with_nul).unwrap();
}
```

## Type Selection Guide

| Scenario | Type |
|----------|------|
| Create string for C | `CString` |
| Borrow string from C | `&CStr` |
| File paths | `OsString`, `Path` |
| Environment variables | `OsString` |
| Opaque C pointers | Newtype over `*mut c_void` |
| C integers | `c_int`, `c_long`, etc. |

## Checklist

- [ ] Have I read the docs for the std::ffi type I'm using?
- [ ] Am I aware of the lifetime constraints?
- [ ] Am I handling potential errors (NulError, UTF-8 errors)?
- [ ] Is there a better type for my use case?

## Related Rules

- `ffi-01`: Use CString/CStr for strings
- `ffi-17`: Use opaque types instead of c_void

---
id: ffi-03
original_id: P.UNS.FFI.03
level: P
impact: CRITICAL
---

# Implement Drop for Rust Types Wrapping Memory-Managing C Pointers

## Summary

When wrapping a C pointer that owns memory, implement `Drop` to call the appropriate C deallocation function.

## Rationale

- C allocated memory must be freed with the matching C function
- Rust's default drop won't clean up foreign memory
- Resource leaks and double-frees are common FFI bugs

## Bad Example

```rust
extern "C" {
    fn create_resource() -> *mut Resource;
    fn free_resource(r: *mut Resource);
}

// DON'T: Wrapper without Drop
struct ResourceHandle {
    ptr: *mut Resource,
}

impl ResourceHandle {
    fn new() -> Self {
        Self {
            ptr: unsafe { create_resource() }
        }
    }
    // Memory leak! ptr is never freed
}

// DON'T: Forget to handle null
impl Drop for BadHandle {
    fn drop(&mut self) {
        unsafe {
            free_resource(self.ptr);  // Crash if ptr is null!
        }
    }
}
```

## Good Example

```rust
use std::ptr::NonNull;

extern "C" {
    fn create_resource() -> *mut Resource;
    fn free_resource(r: *mut Resource);
}

// DO: Proper wrapper with Drop
struct ResourceHandle {
    ptr: NonNull<Resource>,
}

impl ResourceHandle {
    fn new() -> Option<Self> {
        let ptr = unsafe { create_resource() };
        NonNull::new(ptr).map(|ptr| Self { ptr })
    }

    fn as_ptr(&self) -> *mut Resource {
        self.ptr.as_ptr()
    }
}

impl Drop for ResourceHandle {
    fn drop(&mut self) {
        // SAFETY: ptr was allocated by create_resource
        // and hasn't been freed yet
        unsafe {
            free_resource(self.ptr.as_ptr());
        }
    }
}

// Prevent accidental copies that would cause double-free
impl !Clone for ResourceHandle {}

// DO: Document ownership transfer
impl ResourceHandle {
    /// Consumes the handle and returns the raw pointer.
    ///
    /// The caller is responsible for freeing the resource.
    fn into_raw(self) -> *mut Resource {
        let ptr = self.ptr.as_ptr();
        std::mem::forget(self);  // Don't run Drop
        ptr
    }

    /// Creates a handle from a raw pointer.
    ///
    /// # Safety
    ///
    /// ptr must have been allocated by create_resource()
    /// and not yet freed.
    unsafe fn from_raw(ptr: *mut Resource) -> Option<Self> {
        NonNull::new(ptr).map(|ptr| Self { ptr })
    }
}
```

## Complete Pattern with Multiple Resources

```rust
struct Connection {
    handle: NonNull<c_void>,
}

struct Statement<'conn> {
    handle: NonNull<c_void>,
    _conn: std::marker::PhantomData<&'conn Connection>,
}

impl Connection {
    fn prepare(&self, sql: &str) -> Option<Statement<'_>> {
        let handle = unsafe { db_prepare(self.handle.as_ptr(), sql.as_ptr()) };
        NonNull::new(handle).map(|handle| Statement {
            handle,
            _conn: std::marker::PhantomData,
        })
    }
}

impl Drop for Connection {
    fn drop(&mut self) {
        // Statements must be dropped before Connection
        // PhantomData ensures this at compile time
        unsafe { db_close(self.handle.as_ptr()); }
    }
}

impl Drop for Statement<'_> {
    fn drop(&mut self) {
        unsafe { db_finalize(self.handle.as_ptr()); }
    }
}
```

## Checklist

- [ ] Does my wrapper own the C resource?
- [ ] Did I implement Drop with the correct C free function?
- [ ] Did I handle null pointers?
- [ ] Did I prevent Clone/Copy to avoid double-free?
- [ ] Did I consider ownership transfer methods (into_raw/from_raw)?

## Related Rules

- `mem-03`: Don't let String/Vec drop foreign memory
- `ffi-07`: Don't implement Drop for types passed to external code

---
id: ffi-04
original_id: P.UNS.FFI.04
level: P
impact: CRITICAL
clippy: panic_in_result_fn
---

# Handle Panics When Crossing FFI Boundaries

## Summary

Panics must not unwind across FFI boundaries. Use `catch_unwind` or mark functions as `extern "C-unwind"`.

## Rationale

- Unwinding across C code is undefined behavior
- C has no concept of Rust panics
- Can corrupt C stack frames and cause crashes
- Even with `panic=abort`, still UB to attempt unwinding in `extern "C"`

## Bad Example

```rust
// DON'T: Allow panics to escape to C
#[no_mangle]
pub extern "C" fn callback(data: *const u8, len: usize) -> i32 {
    let slice = unsafe { std::slice::from_raw_parts(data, len) };

    // If this panics, UB occurs!
    let sum: i32 = slice.iter().map(|&x| x as i32).sum();

    // If this panics due to overflow in debug, UB!
    process(sum)
}

// DON'T: Unwrap in extern functions
#[no_mangle]
pub extern "C" fn parse_config(path: *const c_char) -> i32 {
    let path = unsafe { CStr::from_ptr(path) };
    let config = std::fs::read_to_string(path.to_str().unwrap()).unwrap();  // Can panic!
    0
}
```

## Good Example

```rust
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::ffi::CStr;
use std::os::raw::{c_char, c_int};

// DO: Catch panics at FFI boundary
#[no_mangle]
pub extern "C" fn safe_callback(data: *const u8, len: usize) -> c_int {
    let result = catch_unwind(AssertUnwindSafe(|| {
        if data.is_null() || len == 0 {
            return -1;
        }

        let slice = unsafe { std::slice::from_raw_parts(data, len) };
        let sum: i32 = slice.iter().map(|&x| x as i32).sum();
        sum
    }));

    match result {
        Ok(value) => value,
        Err(_) => {
            // Log error, return error code
            eprintln!("Panic caught at FFI boundary");
            -1
        }
    }
}

// DO: Use Result-based API internally
#[no_mangle]
pub extern "C" fn parse_config(path: *const c_char) -> c_int {
    let result = catch_unwind(AssertUnwindSafe(|| -> Result<(), Box<dyn std::error::Error>> {
        let path = unsafe { CStr::from_ptr(path) }.to_str()?;
        let _config = std::fs::read_to_string(path)?;
        Ok(())
    }));

    match result {
        Ok(Ok(())) => 0,
        Ok(Err(e)) => {
            eprintln!("Error: {}", e);
            -1
        }
        Err(_) => {
            eprintln!("Panic in parse_config");
            -2
        }
    }
}

// DO: For Rust-calling-Rust across C, use "C-unwind"
#[no_mangle]
pub extern "C-unwind" fn rust_callback_can_unwind() {
    // This is OK to panic if called from Rust through C
    // The "C-unwind" ABI allows unwinding
    panic!("This is allowed");
}
```

## FFI Error Handling Pattern

```rust
// Define error codes
const SUCCESS: c_int = 0;
const ERR_NULL_PTR: c_int = -1;
const ERR_INVALID_UTF8: c_int = -2;
const ERR_IO: c_int = -3;
const ERR_PANIC: c_int = -99;

// Thread-local for detailed error
thread_local! {
    static LAST_ERROR: std::cell::RefCell<Option<String>> = std::cell::RefCell::new(None);
}

fn set_error(msg: String) {
    LAST_ERROR.with(|e| *e.borrow_mut() = Some(msg));
}

#[no_mangle]
pub extern "C" fn get_last_error() -> *const c_char {
    LAST_ERROR.with(|e| {
        e.borrow().as_ref().map(|s| s.as_ptr() as *const c_char)
            .unwrap_or(std::ptr::null())
    })
}
```

## Checklist

- [ ] Does my extern "C" function use catch_unwind?
- [ ] Am I avoiding unwrap/expect in FFI functions?
- [ ] Do I return error codes for error conditions?
- [ ] Have I considered using "C-unwind" for Rust-to-Rust through C?

## Related Rules

- `ffi-08`: Handle errors properly in FFI
- `safety-01`: Panic safety

---
id: ffi-05
original_id: P.UNS.FFI.05
level: P
impact: HIGH
---

# Use Portable Type Aliases from std or libc

## Summary

Use type aliases from `std::os::raw` or the `libc` crate for C-compatible types. Don't assume sizes of C types.

## Rationale

- C types have platform-dependent sizes (`int` is not always 32 bits)
- `long` is 32 bits on Windows, 64 bits on Unix
- Using Rust primitives directly causes portability bugs

## Bad Example

```rust
// DON'T: Use Rust types directly for C interop
extern "C" {
    fn c_function(x: i32, y: i64) -> i32;  // Might not match C types!
}

// DON'T: Assume sizes
#[repr(C)]
struct BadStruct {
    count: i32,   // C 'int' might not be 32 bits
    size: i64,    // C 'long' varies by platform!
    ptr: usize,   // size_t? intptr_t? Different!
}
```

## Good Example

```rust
use std::os::raw::{c_int, c_long, c_char, c_void};

// DO: Use std::os::raw types
extern "C" {
    fn c_function(x: c_int, y: c_long) -> c_int;
}

// DO: Use libc for more types
use libc::{size_t, ssize_t, off_t, pid_t, time_t};

extern "C" {
    fn read(fd: c_int, buf: *mut c_void, count: size_t) -> ssize_t;
    fn lseek(fd: c_int, offset: off_t, whence: c_int) -> off_t;
    fn getpid() -> pid_t;
}

// DO: Match C struct layout
#[repr(C)]
struct GoodStruct {
    count: c_int,
    size: c_long,
    data: *mut c_void,
}

// DO: Use isize/usize for pointer-sized integers
#[repr(C)]
struct PointerSized {
    offset: isize,     // intptr_t equivalent
    size: usize,       // size_t in pointer arithmetic
}
```

## Type Mapping Reference

| C Type | Rust Type | Notes |
|--------|-----------|-------|
| `char` | `c_char` | May be signed or unsigned! |
| `signed char` | `i8` | |
| `unsigned char` | `u8` | |
| `short` | `c_short` | Usually i16 |
| `int` | `c_int` | Usually i32 |
| `long` | `c_long` | 32 or 64 bits! |
| `long long` | `c_longlong` | Usually i64 |
| `size_t` | `usize` or `libc::size_t` | |
| `ssize_t` | `isize` or `libc::ssize_t` | |
| `float` | `c_float` / `f32` | |
| `double` | `c_double` / `f64` | |
| `void*` | `*mut c_void` | |
| `const void*` | `*const c_void` | |

## Platform Differences

```rust
#[cfg(target_pointer_width = "64")]
type PtrDiff = i64;

#[cfg(target_pointer_width = "32")]
type PtrDiff = i32;

// Better: use isize
let diff: isize = ptr1 as isize - ptr2 as isize;
```

## Checklist

- [ ] Am I using std::os::raw or libc types for FFI?
- [ ] Have I avoided assuming c_long is 64 bits?
- [ ] Am I using size_t/usize for sizes?
- [ ] Have I tested on multiple platforms?

## Related Rules

- `ffi-13`: Ensure consistent data layout
- `ffi-14`: Types in FFI should have stable layout

---
id: ffi-06
original_id: P.UNS.FFI.06
level: P
impact: HIGH
---

# Ensure C-ABI Compatibility for Strings Between Rust and C

## Summary

When passing strings across FFI, ensure both sides agree on encoding, null-termination, and memory ownership.

## Rationale

- Rust strings are UTF-8, C strings are byte arrays
- C expects null termination, Rust strings don't have it
- Memory ownership must be explicit to avoid leaks/double-frees

## String Passing Patterns

### Rust to C (Caller Allocates)

```rust
use std::ffi::CString;
use std::os::raw::c_char;

extern "C" {
    fn c_process_string(s: *const c_char);
}

fn rust_to_c(s: &str) -> Result<(), std::ffi::NulError> {
    let c_string = CString::new(s)?;
    // c_string lives until end of scope
    unsafe {
        c_process_string(c_string.as_ptr());
    }
    // c_string dropped here, memory freed
    Ok(())
}
```

### C to Rust (C Allocates, Rust Borrows)

```rust
use std::ffi::CStr;
use std::os::raw::c_char;

extern "C" {
    fn c_get_string() -> *const c_char;
}

fn c_to_rust() -> Option<String> {
    let ptr = unsafe { c_get_string() };
    if ptr.is_null() {
        return None;
    }
    // Borrow from C, don't take ownership
    let c_str = unsafe { CStr::from_ptr(ptr) };
    Some(c_str.to_string_lossy().into_owned())
}
```

### C to Rust (Ownership Transfer)

```rust
extern "C" {
    fn c_create_string() -> *mut c_char;
    fn c_free_string(s: *mut c_char);
}

struct CAllocatedString {
    ptr: *mut c_char,
}

impl CAllocatedString {
    fn new() -> Option<Self> {
        let ptr = unsafe { c_create_string() };
        if ptr.is_null() {
            None
        } else {
            Some(Self { ptr })
        }
    }

    fn as_str(&self) -> &str {
        let c_str = unsafe { CStr::from_ptr(self.ptr) };
        c_str.to_str().unwrap_or("")
    }
}

impl Drop for CAllocatedString {
    fn drop(&mut self) {
        unsafe { c_free_string(self.ptr); }
    }
}
```

### Rust to C (Ownership Transfer)

```rust
extern "C" {
    fn c_take_ownership(s: *mut c_char);  // C will free
}

fn give_to_c(s: &str) -> Result<(), std::ffi::NulError> {
    let c_string = CString::new(s)?;
    let ptr = c_string.into_raw();  // Don't drop CString

    unsafe {
        c_take_ownership(ptr);
        // C now owns this memory
        // To free it back in Rust: let _ = CString::from_raw(ptr);
    }
    Ok(())
}
```

## Encoding Considerations

```rust
// UTF-8 to platform encoding
use std::ffi::OsString;
use std::os::unix::ffi::OsStrExt;

fn to_platform_string(s: &str) -> CString {
    // On Unix, UTF-8 usually works
    CString::new(s).unwrap()
}

#[cfg(windows)]
fn to_wide_string(s: &str) -> Vec<u16> {
    use std::os::windows::ffi::OsStrExt;
    std::ffi::OsStr::new(s)
        .encode_wide()
        .chain(std::iter::once(0))
        .collect()
}
```

## Checklist

- [ ] Is the string null-terminated when passed to C?
- [ ] Who allocates the memory? Who frees it?
- [ ] Is the encoding (UTF-8, ASCII, platform) documented?
- [ ] Am I handling conversion errors (interior nulls, invalid UTF-8)?

## Related Rules

- `ffi-01`: Use CString/CStr at FFI boundaries
- `ffi-02`: Read std::ffi documentation

---
id: ffi-07
original_id: P.UNS.FFI.07
level: P
impact: HIGH
---

# Do Not Implement Drop for Types Passed to External Code

## Summary

If a type will be passed to external code that manages its lifetime, don't implement `Drop`. Otherwise, both Rust and the external code will try to free it.

## Rationale

- External code (C library) may take ownership of the data
- If Rust also tries to drop it, you get double-free
- Need clear ownership boundaries

## Bad Example

```rust
// DON'T: Drop on type that external code will free
#[repr(C)]
struct EventHandler {
    callback: extern "C" fn(i32),
    user_data: *mut c_void,
}

impl Drop for EventHandler {
    fn drop(&mut self) {
        // BAD: What if the C library already freed user_data?
        unsafe { libc::free(self.user_data); }
    }
}

extern "C" {
    // C takes ownership and frees EventHandler when done
    fn register_handler(h: *mut EventHandler);
}

fn bad_register() {
    let handler = EventHandler { /* ... */ };
    let ptr = Box::into_raw(Box::new(handler));
    unsafe {
        register_handler(ptr);
        // If C code frees this, and Rust's Drop runs too = double-free
    }
}
```

## Good Example

```rust
// DO: No Drop for types whose lifetime is managed externally
#[repr(C)]
struct EventHandler {
    callback: extern "C" fn(i32),
    user_data: *mut c_void,
}
// No Drop impl - C library manages lifetime

extern "C" {
    fn register_handler(h: *mut EventHandler);
    fn unregister_handler(h: *mut EventHandler);
}

// DO: Wrap in a Rust type that knows when it's safe to drop
struct RegisteredHandler {
    ptr: *mut EventHandler,
    registered: bool,
}

impl RegisteredHandler {
    fn register(handler: EventHandler) -> Self {
        let ptr = Box::into_raw(Box::new(handler));
        unsafe { register_handler(ptr); }
        Self { ptr, registered: true }
    }

    fn unregister(&mut self) {
        if self.registered {
            unsafe { unregister_handler(self.ptr); }
            self.registered = false;
        }
    }
}

impl Drop for RegisteredHandler {
    fn drop(&mut self) {
        self.unregister();
        // Only free if we still own it
        if !self.registered {
            unsafe { drop(Box::from_raw(self.ptr)); }
        }
    }
}

// DO: Use ManuallyDrop for explicit control
use std::mem::ManuallyDrop;

fn explicit_ownership() {
    let handler = ManuallyDrop::new(EventHandler { /* ... */ });
    let ptr = &*handler as *const EventHandler as *mut EventHandler;
    unsafe {
        register_handler(ptr);
        // C now owns handler, don't drop it in Rust
    }
}
```

## Ownership Patterns

| Pattern | Who Owns | Rust Drop? |
|---------|----------|------------|
| Rust creates, Rust frees | Rust | Yes |
| Rust creates, C frees | C | No |
| C creates, C frees | C | No (use wrapper) |
| C creates, Rust frees | Rust | Yes (in wrapper) |

## Checklist

- [ ] Who will free this type's memory?
- [ ] If external code frees it, am I avoiding Drop?
- [ ] If ownership is conditional, do I track it?
- [ ] Am I using ManuallyDrop or forget() when transferring ownership?

## Related Rules

- `ffi-03`: Implement Drop for wrapped C pointers (opposite case)
- `mem-03`: Don't let String/Vec drop foreign memory

---
id: ffi-08
original_id: P.UNS.FFI.08
level: P
impact: HIGH
---

# Handle Errors Properly in FFI

## Summary

FFI functions must use C-compatible error handling (return codes, errno, out parameters). Rust's Result/Option don't cross FFI boundaries.

## Rationale

- C doesn't have Result or Option
- Exceptions don't exist in C
- Must use patterns C code understands

## Bad Example

```rust
// DON'T: Return Result across FFI
#[no_mangle]
pub extern "C" fn bad_open(path: *const c_char) -> Result<Handle, Error> {
    // Result is not C-compatible!
    unimplemented!()
}

// DON'T: Return Option across FFI
#[no_mangle]
pub extern "C" fn bad_find(id: i32) -> Option<*mut Data> {
    // Option<*mut T> might work but is confusing
    unimplemented!()
}
```

## Good Example

```rust
use std::os::raw::{c_char, c_int};

// Error codes
const SUCCESS: c_int = 0;
const ERR_NULL_PTR: c_int = 1;
const ERR_INVALID_PATH: c_int = 2;
const ERR_FILE_NOT_FOUND: c_int = 3;
const ERR_PERMISSION: c_int = 4;
const ERR_UNKNOWN: c_int = -1;

// DO: Return error code, output via pointer
#[no_mangle]
pub extern "C" fn open_file(
    path: *const c_char,
    out_handle: *mut *mut Handle
) -> c_int {
    if path.is_null() || out_handle.is_null() {
        return ERR_NULL_PTR;
    }

    let path_str = match unsafe { CStr::from_ptr(path) }.to_str() {
        Ok(s) => s,
        Err(_) => return ERR_INVALID_PATH,
    };

    match File::open(path_str) {
        Ok(file) => {
            let handle = Box::into_raw(Box::new(Handle { file }));
            unsafe { *out_handle = handle; }
            SUCCESS
        }
        Err(e) => {
            match e.kind() {
                std::io::ErrorKind::NotFound => ERR_FILE_NOT_FOUND,
                std::io::ErrorKind::PermissionDenied => ERR_PERMISSION,
                _ => ERR_UNKNOWN,
            }
        }
    }
}

// DO: Use errno for POSIX-style APIs
#[cfg(unix)]
#[no_mangle]
pub extern "C" fn posix_style_read(
    fd: c_int,
    buf: *mut u8,
    count: usize
) -> isize {
    if buf.is_null() {
        unsafe { *libc::__errno_location() = libc::EINVAL; }
        return -1;
    }

    // ... do read ...
    // On error:
    // unsafe { *libc::__errno_location() = error_code; }
    // return -1;

    count as isize
}

// DO: Provide error message function
thread_local! {
    static LAST_ERROR: std::cell::RefCell<Option<String>> = std::cell::RefCell::new(None);
}

#[no_mangle]
pub extern "C" fn get_error_message(buf: *mut c_char, len: usize) -> c_int {
    LAST_ERROR.with(|e| {
        if let Some(msg) = e.borrow().as_ref() {
            let bytes = msg.as_bytes();
            let copy_len = std::cmp::min(bytes.len(), len.saturating_sub(1));
            unsafe {
                std::ptr::copy_nonoverlapping(bytes.as_ptr(), buf as *mut u8, copy_len);
                *buf.add(copy_len) = 0;
            }
            SUCCESS
        } else {
            ERR_UNKNOWN
        }
    })
}
```

## Error Handling Patterns

| Pattern | Usage |
|---------|-------|
| Return code | Simple success/failure |
| Return code + out param | Return value on success |
| errno | POSIX-style APIs |
| Error message function | Detailed error info |
| Last-error thread-local | Windows-style APIs |

## Checklist

- [ ] Am I returning C-compatible error indicators?
- [ ] Are output parameters used for return values?
- [ ] Is there a way to get detailed error info?
- [ ] Am I documenting all possible error codes?

## Related Rules

- `ffi-04`: Handle panics at FFI boundary
- `safety-10`: Document safety requirements

---
id: ffi-09
original_id: P.UNS.FFI.09
level: P
impact: MEDIUM
---

# Use References Instead of Raw Pointers When Calling Safe C Functions

## Summary

When wrapping C functions that don't need null pointers, use Rust references in the safe wrapper to enforce non-null at compile time.

## Rationale

- References guarantee non-null
- References have lifetime tracking
- Raw pointers should stay in the unsafe FFI layer
- Safe Rust API should use safe types

## Bad Example

```rust
extern "C" {
    fn c_process(data: *const u8, len: usize);
}

// DON'T: Expose raw pointers in safe API
pub fn process(data: *const u8, len: usize) {
    // Caller might pass null!
    unsafe { c_process(data, len); }
}

// DON'T: Unsafe function when it could be safe
pub unsafe fn process_unsafe(data: *const u8, len: usize) {
    // Why force caller to use unsafe?
    c_process(data, len);
}
```

## Good Example

```rust
extern "C" {
    fn c_process(data: *const u8, len: usize);
    fn c_modify(data: *mut Data);
    fn c_optional(data: *const Data);  // Can be null
}

// DO: Use slice reference for safe API
pub fn process(data: &[u8]) {
    // Reference guarantees non-null
    // Slice guarantees valid length
    unsafe { c_process(data.as_ptr(), data.len()); }
}

// DO: Use &mut for exclusive access
pub fn modify(data: &mut Data) {
    // Mutable reference guarantees:
    // - Non-null
    // - Exclusive access
    // - Valid for duration
    unsafe { c_modify(data as *mut Data); }
}

// DO: Use Option<&T> for nullable parameters
pub fn optional(data: Option<&Data>) {
    let ptr = data.map(|d| d as *const Data).unwrap_or(std::ptr::null());
    unsafe { c_optional(ptr); }
}

// DO: Wrap FFI types in safe Rust types
pub struct SafeHandle(*mut c_void);

impl SafeHandle {
    pub fn new() -> Option<Self> {
        let ptr = unsafe { create_handle() };
        if ptr.is_null() {
            None
        } else {
            Some(Self(ptr))
        }
    }

    // Methods take &self or &mut self, not raw pointers
    pub fn do_something(&self) {
        unsafe { handle_operation(self.0); }
    }
}
```

## Converting Between References and Pointers

```rust
// Reference to pointer
fn ref_to_ptr(r: &Data) -> *const Data {
    r as *const Data
}

fn mut_ref_to_ptr(r: &mut Data) -> *mut Data {
    r as *mut Data
}

// Slice to pointer
fn slice_to_ptr(s: &[u8]) -> (*const u8, usize) {
    (s.as_ptr(), s.len())
}

// Pointer to reference (unsafe)
unsafe fn ptr_to_ref<'a>(p: *const Data) -> &'a Data {
    &*p
}

unsafe fn ptr_to_mut<'a>(p: *mut Data) -> &'a mut Data {
    &mut *p
}
```

## When to Use Raw Pointers

- FFI declarations (`extern "C"`)
- Implementing the unsafe boundary layer
- When null is a valid value
- When the pointee might not be valid Rust (e.g., uninitialized)

## Checklist

- [ ] Can this parameter be a reference instead of a pointer?
- [ ] Am I checking for null in the unsafe layer?
- [ ] Is the safe API free of raw pointers?
- [ ] Do I use Option<&T> for nullable references?

## Related Rules

- `safety-06`: Don't expose raw pointers in public APIs
- `ffi-02`: Read std::ffi documentation

---
id: ffi-10
original_id: P.UNS.FFI.10
level: P
impact: CRITICAL
---

# Exported Rust Functions Must Be Designed for Thread-Safety

## Summary

Functions exported to C with `#[no_mangle] extern "C"` may be called from multiple threads. Ensure they are thread-safe.

## Rationale

- C code doesn't know about Rust's thread safety guarantees
- C may call your function from any thread
- Global state must be synchronized
- Race conditions are undefined behavior

## Bad Example

```rust
// DON'T: Unsynchronized global state
static mut COUNTER: i32 = 0;

#[no_mangle]
pub extern "C" fn increment() -> i32 {
    unsafe {
        COUNTER += 1;  // Data race if called from multiple threads!
        COUNTER
    }
}

// DON'T: Thread-local assuming single thread
thread_local! {
    static CONFIG: RefCell<Config> = RefCell::new(Config::default());
}

#[no_mangle]
pub extern "C" fn set_config(value: i32) {
    // Different threads get different configs!
    // Is that what the C caller expects?
    CONFIG.with(|c| c.borrow_mut().value = value);
}

// DON'T: Non-Send types in globals
static mut HANDLE: Option<Rc<Data>> = None;  // Rc is not Send!
```

## Good Example

```rust
use std::sync::atomic::{AtomicI32, Ordering};
use std::sync::{Mutex, OnceLock};

// DO: Use atomics for simple counters
static COUNTER: AtomicI32 = AtomicI32::new(0);

#[no_mangle]
pub extern "C" fn increment() -> i32 {
    COUNTER.fetch_add(1, Ordering::SeqCst) + 1
}

// DO: Use Mutex for complex state
static CONFIG: OnceLock<Mutex<Config>> = OnceLock::new();

fn get_config() -> &'static Mutex<Config> {
    CONFIG.get_or_init(|| Mutex::new(Config::default()))
}

#[no_mangle]
pub extern "C" fn set_config_value(value: i32) -> i32 {
    match get_config().lock() {
        Ok(mut config) => {
            config.value = value;
            0  // Success
        }
        Err(_) => -1  // Lock poisoned
    }
}

// DO: Document thread safety requirements
/// Initializes the library. NOT thread-safe.
/// Must be called once from main thread before any other function.
#[no_mangle]
pub extern "C" fn init() -> i32 {
    // One-time initialization
    0
}

/// Processes data. Thread-safe.
/// May be called from multiple threads concurrently.
#[no_mangle]
pub extern "C" fn process(data: *const u8, len: usize) -> i32 {
    // Uses only local state or synchronized globals
    0
}

// DO: Make non-thread-safe APIs explicit
/// Handle for single-threaded use only.
///
/// # Thread Safety
///
/// This handle must only be used from the thread that created it.
struct SingleThreadHandle {
    data: *mut Data,
    _not_send: std::marker::PhantomData<*const ()>,  // !Send
}
```

## Synchronization Patterns

| Pattern | Use Case |
|---------|----------|
| `AtomicT` | Simple counters, flags |
| `Mutex<T>` | Complex shared state |
| `RwLock<T>` | Read-heavy shared state |
| `OnceLock<T>` | Lazy one-time init |
| `thread_local!` | Per-thread state (document!) |

## Checklist

- [ ] Does my exported function access global state?
- [ ] Is that state properly synchronized?
- [ ] Have I documented thread-safety guarantees?
- [ ] Are any types !Send/!Sync exposed across FFI?

## Related Rules

- `ptr-01`: Don't share raw pointers across threads
- `safety-05`: Send/Sync implementation safety

---
id: ffi-11
original_id: P.UNS.FFI.11
level: P
impact: HIGH
clippy: unaligned_references
---

# Be Careful with UB When Referencing #[repr(packed)] Struct Fields

## Summary

Creating references to fields in `#[repr(packed)]` structs is undefined behavior if the field is misaligned. Use raw pointers and `read_unaligned`/`write_unaligned` instead.

## Rationale

- Packed structs have no padding, so fields may be misaligned
- References must be aligned; misaligned references are UB
- Even implicit references (method calls, match) can cause UB

## Bad Example

```rust
#[repr(C, packed)]
struct Packet {
    header: u8,
    value: u32,   // Misaligned! At offset 1, not 4
    data: u64,    // Misaligned! At offset 5, not 8
}

fn bad_reference(p: &Packet) -> &u32 {
    &p.value  // UB: Creates misaligned reference!
}

fn bad_match(p: &Packet) {
    match p.value {  // UB: Match creates a reference
        0 => {},
        _ => {},
    }
}

fn bad_method(p: &Packet) {
    p.value.to_string();  // UB: Method call creates reference
}

fn bad_borrow(p: &mut Packet) {
    let v = &mut p.value;  // UB: Misaligned mutable reference
    *v = 42;
}
```

## Good Example

```rust
#[repr(C, packed)]
struct Packet {
    header: u8,
    value: u32,
    data: u64,
}

// DO: Copy out the value
fn good_read(p: &Packet) -> u32 {
    p.value  // Copies the value, no reference created
}

// DO: Use addr_of! for raw pointer (Rust 2021+)
fn good_ptr_read(p: &Packet) -> u32 {
    // SAFETY: read_unaligned handles misalignment
    unsafe {
        std::ptr::addr_of!(p.value).read_unaligned()
    }
}

// DO: Use addr_of_mut! for writing
fn good_ptr_write(p: &mut Packet, value: u32) {
    // SAFETY: write_unaligned handles misalignment
    unsafe {
        std::ptr::addr_of_mut!(p.value).write_unaligned(value);
    }
}

// DO: Create accessor methods
impl Packet {
    fn value(&self) -> u32 {
        unsafe { std::ptr::addr_of!(self.value).read_unaligned() }
    }

    fn set_value(&mut self, value: u32) {
        unsafe { std::ptr::addr_of_mut!(self.value).write_unaligned(value); }
    }

    fn data(&self) -> u64 {
        unsafe { std::ptr::addr_of!(self.data).read_unaligned() }
    }
}

// DO: Consider using byte arrays + from_ne_bytes
#[repr(C, packed)]
struct PacketBytes {
    header: u8,
    value: [u8; 4],  // Store as bytes
    data: [u8; 8],
}

impl PacketBytes {
    fn value(&self) -> u32 {
        u32::from_ne_bytes(self.value)  // Safe, no alignment issue
    }
}
```

## Safe Alternatives

```rust
// Alternative 1: Don't use packed
#[repr(C)]
struct AlignedPacket {
    header: u8,
    _pad: [u8; 3],
    value: u32,
    data: u64,
}

// Alternative 2: Use zerocopy crate
// use zerocopy::{AsBytes, FromBytes};

// Alternative 3: Use bytemuck
// use bytemuck::{Pod, Zeroable};
```

## Checklist

- [ ] Am I creating references to packed struct fields?
- [ ] Am I using addr_of! / addr_of_mut! for field access?
- [ ] Am I using read_unaligned / write_unaligned?
- [ ] Would a byte array representation be safer?

## Related Rules

- `ptr-04`: Don't dereference misaligned pointers
- `mem-01`: Choose appropriate data layout

---
id: ffi-12
original_id: P.UNS.FFI.12
level: P
impact: MEDIUM
---

# Document Invariant Assumptions for C-Provided Parameters

## Summary

When receiving parameters from C, document what invariants you assume (non-null, alignment, validity, lifetime) and verify them when possible.

## Rationale

- C doesn't enforce invariants at compile time
- Rust code needs to validate or document assumptions
- Debugging FFI bugs is hard without clear documentation

## Bad Example

```rust
// DON'T: Undocumented assumptions
extern "C" {
    fn get_data() -> *mut Data;
}

fn bad_use() -> &'static Data {
    let ptr = unsafe { get_data() };
    // Assumes:
    // - ptr is non-null (not documented)
    // - ptr is aligned (not checked)
    // - Data is valid (not verified)
    // - Lifetime is 'static (just guessing)
    unsafe { &*ptr }
}

// DON'T: Silent assumptions in function signature
#[no_mangle]
pub extern "C" fn process(data: *const Data, len: usize) {
    // What if data is null?
    // What if len is wrong?
    // What if data contains invalid Data?
    let slice = unsafe {
        std::slice::from_raw_parts(data, len)
    };
}
```

## Good Example

```rust
/// Retrieves data from the C library.
///
/// # Invariants Assumed from C
///
/// - Returns a non-null pointer on success, null on failure
/// - Returned pointer is valid for the lifetime of the library
/// - Returned pointer is aligned for `Data`
/// - The `Data` struct is fully initialized
extern "C" {
    fn get_data() -> *mut Data;
}

fn documented_use() -> Option<&'static Data> {
    let ptr = unsafe { get_data() };

    // Verify what we can
    if ptr.is_null() {
        return None;
    }

    // Document what we can't verify
    // SAFETY:
    // - Non-null: checked above
    // - Aligned: documented in C library docs
    // - Valid: C library guarantees initialized Data
    // - Lifetime: C library guarantees static lifetime
    Some(unsafe { &*ptr })
}

/// Processes data provided by C caller.
///
/// # Parameters
///
/// - `data`: Must be non-null, aligned for `Data`, and point to `len` valid `Data` items
/// - `len`: Number of items. Must not exceed `isize::MAX / size_of::<Data>()`
///
/// # Returns
///
/// - `0` on success
/// - `-1` if `data` is null
/// - `-2` if `len` is invalid
///
/// # Thread Safety
///
/// This function is thread-safe. The `data` array must not be mutated during the call.
#[no_mangle]
pub extern "C" fn process_documented(data: *const Data, len: usize) -> i32 {
    // Verify invariants we can check
    if data.is_null() {
        return -1;
    }

    if len > isize::MAX as usize / std::mem::size_of::<Data>() {
        return -2;
    }

    // SAFETY:
    // - Non-null: checked above
    // - Aligned: documented requirement for caller
    // - Valid for len items: documented requirement for caller
    // - Not mutated: documented thread safety requirement
    let slice = unsafe { std::slice::from_raw_parts(data, len) };

    for item in slice {
        // process...
    }

    0
}
```

## Documentation Template

```rust
/// Brief description.
///
/// # Parameters
///
/// - `param`: Description, constraints (non-null, aligned, etc.)
///
/// # Invariants Assumed
///
/// The following invariants are assumed and NOT verified:
/// - Invariant 1: explanation
/// - Invariant 2: explanation
///
/// The following invariants ARE verified at runtime:
/// - Verified 1: how it's checked
///
/// # Safety (for unsafe fn)
///
/// Caller must ensure:
/// - Requirement 1
/// - Requirement 2
///
/// # Errors
///
/// Returns error code when:
/// - Condition 1: error code
```

## Checklist

- [ ] Have I documented all assumptions about C parameters?
- [ ] Which invariants can I verify at runtime?
- [ ] Which must I trust the C caller to uphold?
- [ ] Have I documented error conditions and return values?

## Related Rules

- `safety-02`: Verify safety invariants
- `safety-10`: Document safety requirements

---
id: ffi-13
original_id: P.UNS.FFI.13
level: P
impact: HIGH
---

# Ensure Consistent Data Layout for Custom Types

## Summary

Types shared between Rust and C must have `#[repr(C)]` to ensure the memory layout matches what C expects.

## Rationale

- Rust's default layout is unspecified and may change
- C has specific, standardized layout rules
- Mismatched layouts cause memory corruption

## Bad Example

```rust
// DON'T: Rust layout for FFI types
struct BadStruct {
    a: u8,
    b: u32,
    c: u8,
}
// Rust may reorder to: b, a, c (for better packing)
// C expects: a, padding, b, c, padding

extern "C" {
    fn use_struct(s: *const BadStruct);  // Layout mismatch!
}

// DON'T: Assume Rust enum layout matches C
enum BadEnum {
    A,
    B(i32),
    C { x: u8, y: u8 },
}
// Rust enum layout is complex and not C-compatible
```

## Good Example

```rust
// DO: Use repr(C) for FFI structs
#[repr(C)]
struct GoodStruct {
    a: u8,      // offset 0
    // 3 bytes padding
    b: u32,     // offset 4
    c: u8,      // offset 8
    // 3 bytes padding
}
// Total size: 12, align: 4

// DO: Use repr(C) for enums with explicit discriminant
#[repr(C)]
enum GoodEnum {
    A = 0,
    B = 1,
    C = 2,
}
// Equivalent to C: enum { A = 0, B = 1, C = 2 };

// DO: For complex enums, use tagged unions
#[repr(C)]
struct TaggedUnion {
    tag: GoodEnum,
    data: GoodUnionData,
}

#[repr(C)]
union GoodUnionData {
    a: (),         // For GoodEnum::A
    b: i32,        // For GoodEnum::B
    c: [u8; 2],    // For GoodEnum::C
}

// DO: Verify layout at compile time
const _: () = {
    assert!(std::mem::size_of::<GoodStruct>() == 12);
    assert!(std::mem::align_of::<GoodStruct>() == 4);
};
```

## Layout Verification

```rust
use std::mem::{size_of, align_of, offset_of};

#[repr(C)]
struct Verified {
    a: u8,
    b: u32,
    c: u8,
}

// Compile-time layout verification
const _: () = {
    assert!(size_of::<Verified>() == 12);
    assert!(align_of::<Verified>() == 4);
    // offset_of! requires nightly or crate
    // assert!(offset_of!(Verified, a) == 0);
    // assert!(offset_of!(Verified, b) == 4);
    // assert!(offset_of!(Verified, c) == 8);
};

// Runtime verification
#[test]
fn verify_layout() {
    assert_eq!(size_of::<Verified>(), 12);
    assert_eq!(align_of::<Verified>(), 4);

    let v = Verified { a: 0, b: 0, c: 0 };
    let base = &v as *const _ as usize;

    assert_eq!(&v.a as *const _ as usize - base, 0);
    assert_eq!(&v.b as *const _ as usize - base, 4);
    assert_eq!(&v.c as *const _ as usize - base, 8);
}
```

## repr Options

| Attribute | Effect |
|-----------|--------|
| `#[repr(C)]` | C-compatible layout |
| `#[repr(C, packed)]` | C layout, no padding |
| `#[repr(C, align(N))]` | C layout, minimum align N |
| `#[repr(transparent)]` | Same layout as single field |
| `#[repr(u8)]` etc. | Enum discriminant type |

## Checklist

- [ ] Is every FFI struct marked `#[repr(C)]`?
- [ ] Is every FFI enum using explicit discriminants?
- [ ] Have I verified the layout matches the C header?
- [ ] Have I added compile-time assertions?

## Related Rules

- `mem-01`: Choose appropriate data layout
- `ffi-14`: Types in FFI should have stable layout

---
id: ffi-14
original_id: P.UNS.FFI.14
level: P
impact: HIGH
---

# Types Used in FFI Should Have Stable Layout

## Summary

FFI types should not change layout between versions. Use `#[repr(C)]` and avoid types with unstable layout like generic `std` types.

## Rationale

- ABI compatibility requires stable layout
- Dynamic libraries may be loaded with different compiler versions
- Layout changes break binary compatibility

## Bad Example

```rust
// DON'T: Use Rust std types with unstable layout in FFI
extern "C" {
    // Vec layout is not stable!
    fn bad_vec(v: Vec<i32>);

    // String layout is not stable!
    fn bad_string(s: String);

    // HashMap layout varies between versions
    fn bad_map(m: std::collections::HashMap<i32, i32>);
}

// DON'T: Use Rust-specific types in C structs
#[repr(C)]
struct BadMixed {
    id: i32,
    data: Vec<u8>,  // Vec is not C-compatible!
}

// DON'T: Use Option with non-null optimization assumptions
#[repr(C)]
struct BadOption {
    value: Option<std::num::NonZeroU32>,  // Layout may change!
}
```

## Good Example

```rust
use std::os::raw::{c_int, c_char, c_void};

// DO: Use C-compatible types
#[repr(C)]
struct GoodStruct {
    id: c_int,
    name: *const c_char,  // C-style string
    data: *const c_void,  // Generic pointer
    data_len: usize,
}

// DO: Use explicit struct for what Vec would provide
#[repr(C)]
struct GoodBuffer {
    ptr: *mut u8,
    len: usize,
    cap: usize,
}

impl GoodBuffer {
    fn from_vec(mut v: Vec<u8>) -> Self {
        let buf = Self {
            ptr: v.as_mut_ptr(),
            len: v.len(),
            cap: v.capacity(),
        };
        std::mem::forget(v);
        buf
    }

    /// # Safety
    /// Must have been created by from_vec()
    unsafe fn into_vec(self) -> Vec<u8> {
        Vec::from_raw_parts(self.ptr, self.len, self.cap)
    }
}

// DO: Use fixed-size arrays for bounded data
#[repr(C)]
struct FixedName {
    name: [c_char; 64],
    name_len: usize,
}

// DO: Define your own stable option type
#[repr(C)]
struct OptionalU32 {
    has_value: bool,
    value: u32,
}

impl From<Option<u32>> for OptionalU32 {
    fn from(opt: Option<u32>) -> Self {
        match opt {
            Some(v) => Self { has_value: true, value: v },
            None => Self { has_value: false, value: 0 },
        }
    }
}
```

## Stable Types for FFI

| Use Instead Of | Stable Type |
|----------------|-------------|
| `Vec<T>` | `*mut T` + `len` + `cap` |
| `String` | `*const c_char` or `*mut c_char` + `len` |
| `&[T]` | `*const T` + `len` |
| `Option<T>` | Custom tagged struct |
| `Result<T, E>` | Error code + out parameter |
| `Box<T>` | `*mut T` |
| `bool` | `c_int` or explicit `u8` |

## Checklist

- [ ] Am I using only C-compatible primitive types?
- [ ] Am I avoiding std collection types in FFI signatures?
- [ ] Have I created stable wrappers for Rust types?
- [ ] Is the layout documented for other languages?

## Related Rules

- `ffi-13`: Ensure consistent data layout
- `ffi-05`: Use portable type aliases

---
id: ffi-15
original_id: P.UNS.FFI.15
level: P
impact: HIGH
---

# Validate Non-Robust External Values

## Summary

Data received from external sources (FFI, files, network) may be invalid. Validate before using it as Rust types with stricter invariants.

## Rationale

- External data can be malicious or corrupted
- Rust types have invariants (e.g., valid UTF-8 for str)
- Invalid data causes undefined behavior

## Bad Example

```rust
// DON'T: Trust external data
extern "C" {
    fn get_status() -> u8;
}

#[derive(Debug)]
enum Status { Active = 0, Inactive = 1, Pending = 2 }

fn bad_convert() -> Status {
    let raw = unsafe { get_status() };
    // BAD: Assumes C returns valid enum value
    unsafe { std::mem::transmute(raw) }  // UB if raw > 2
}

// DON'T: Trust strings from C
fn bad_string(ptr: *const c_char) -> &str {
    let cstr = unsafe { CStr::from_ptr(ptr) };
    // BAD: Assumes valid UTF-8
    cstr.to_str().unwrap()
}

// DON'T: Trust size values
fn bad_size(ptr: *const u8, len: usize) -> Vec<u8> {
    // BAD: len could be huge, causing OOM
    // BAD: len could exceed actual data
    unsafe { std::slice::from_raw_parts(ptr, len) }.to_vec()
}
```

## Good Example

```rust
// DO: Validate enum values
#[derive(Debug, Clone, Copy)]
#[repr(u8)]
enum Status {
    Active = 0,
    Inactive = 1,
    Pending = 2,
}

impl TryFrom<u8> for Status {
    type Error = InvalidStatusError;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(Status::Active),
            1 => Ok(Status::Inactive),
            2 => Ok(Status::Pending),
            _ => Err(InvalidStatusError(value)),
        }
    }
}

fn good_convert() -> Result<Status, InvalidStatusError> {
    let raw = unsafe { get_status() };
    Status::try_from(raw)  // Returns error for invalid values
}

// DO: Handle invalid UTF-8
fn good_string(ptr: *const c_char) -> Result<String, std::str::Utf8Error> {
    if ptr.is_null() {
        return Ok(String::new());
    }
    let cstr = unsafe { CStr::from_ptr(ptr) };
    cstr.to_str().map(|s| s.to_owned())
}

fn good_string_lossy(ptr: *const c_char) -> String {
    if ptr.is_null() {
        return String::new();
    }
    let cstr = unsafe { CStr::from_ptr(ptr) };
    cstr.to_string_lossy().into_owned()  // Replaces invalid UTF-8
}

// DO: Validate sizes
const MAX_REASONABLE_SIZE: usize = 100 * 1024 * 1024;  // 100 MB

fn good_size(ptr: *const u8, len: usize) -> Result<Vec<u8>, ValidationError> {
    if ptr.is_null() {
        return Err(ValidationError::NullPointer);
    }
    if len > MAX_REASONABLE_SIZE {
        return Err(ValidationError::SizeTooLarge);
    }

    // Still need to trust that ptr points to len valid bytes
    // Document this as a caller requirement
    let slice = unsafe { std::slice::from_raw_parts(ptr, len) };
    Ok(slice.to_vec())
}

// DO: Use num_enum for safe enum conversion
// use num_enum::TryFromPrimitive;
//
// #[derive(TryFromPrimitive)]
// #[repr(u8)]
// enum Status { Active = 0, Inactive = 1, Pending = 2 }
```

## Validation Patterns

| External Data | Validation |
|---------------|------------|
| Enum discriminant | Match against valid values |
| String | Check UTF-8 or use lossy conversion |
| Size/length | Check against maximum |
| Pointer | Check for null |
| Boolean | Explicit 0/1 check or treat any non-zero as true |
| Float | Check for NaN, infinity if problematic |

## Checklist

- [ ] Am I validating external enum values?
- [ ] Am I handling potential invalid UTF-8?
- [ ] Am I checking sizes against reasonable limits?
- [ ] Am I using TryFrom instead of transmute?

## Related Rules

- `ffi-12`: Document invariant assumptions
- `safety-02`: Verify safety invariants

---
id: ffi-16
original_id: P.UNS.FFI.16
level: P
impact: HIGH
---

# Separate Data and Code When Passing Rust Closures to C

## Summary

C callbacks are function pointers without captured state. To pass Rust closures to C, separate the function pointer from the closure data using a "trampoline" pattern.

## Rationale

- Rust closures can capture state (like lambdas)
- C function pointers are just addresses, no state
- Must pass state separately via `void*` user_data

## Bad Example

```rust
// DON'T: Try to pass closure directly
extern "C" {
    fn set_callback(cb: fn(i32) -> i32);  // Only works for non-capturing!
}

fn bad_closure() {
    let multiplier = 2;
    let closure = |x| x * multiplier;  // Captures multiplier

    // This won't compile - closure is not fn pointer
    // set_callback(closure);
}

// DON'T: Transmute closure to function pointer
fn bad_transmute() {
    let closure = |x: i32| x * 2;
    let fp: fn(i32) -> i32 = unsafe { std::mem::transmute(closure) };
    // UB: Closure may have non-zero size
}
```

## Good Example

```rust
use std::os::raw::c_void;
use std::ffi::c_int;

// C callback signature with user_data
type CCallback = extern "C" fn(value: c_int, user_data: *mut c_void) -> c_int;

extern "C" {
    fn set_callback(cb: CCallback, user_data: *mut c_void);
    fn remove_callback();
}

// DO: Use trampoline pattern
fn good_closure<F: FnMut(i32) -> i32>(mut closure: F) {
    // Trampoline function that forwards to the closure
    extern "C" fn trampoline<F: FnMut(i32) -> i32>(
        value: c_int,
        user_data: *mut c_void,
    ) -> c_int {
        let closure = unsafe { &mut *(user_data as *mut F) };
        closure(value as i32) as c_int
    }

    let user_data = &mut closure as *mut F as *mut c_void;

    unsafe {
        set_callback(trampoline::<F>, user_data);
        // Important: closure must live until callback is removed!
    }
}

// DO: Box the closure for 'static lifetime
struct CallbackHandle {
    closure: Box<dyn FnMut(i32) -> i32>,
}

impl CallbackHandle {
    fn new<F: FnMut(i32) -> i32 + 'static>(closure: F) -> Self {
        Self { closure: Box::new(closure) }
    }

    fn register(&mut self) {
        extern "C" fn trampoline(value: c_int, user_data: *mut c_void) -> c_int {
            let closure = unsafe { &mut *(user_data as *mut Box<dyn FnMut(i32) -> i32>) };
            closure(value as i32) as c_int
        }

        let user_data = &mut self.closure as *mut _ as *mut c_void;
        unsafe { set_callback(trampoline, user_data); }
    }
}

impl Drop for CallbackHandle {
    fn drop(&mut self) {
        unsafe { remove_callback(); }
        // Now safe to drop closure
    }
}

// Usage
fn example() {
    let multiplier = 2;
    let mut handle = CallbackHandle::new(move |x| x * multiplier);
    handle.register();
    // handle must live until callback is no longer needed
}
```

## Trampoline Pattern

```
Rust Closure: |x| x * captured_value
     |
     v
+-----------------+     +-----------------+
| trampoline fn   | --> | closure data    |
| (no captures)   |     | (captured_value)|
+-----------------+     +-----------------+
     |                         ^
     |    user_data ptr        |
     +-------------------------+

C sees: function pointer + void* user_data
```

## Checklist

- [ ] Does my closure capture any state?
- [ ] Am I using the trampoline pattern?
- [ ] Does the closure data live long enough?
- [ ] Am I unregistering before dropping the closure?

## Related Rules

- `ffi-03`: Implement Drop for resource wrappers
- `ffi-10`: Thread safety for callbacks

---
id: ffi-17
original_id: P.UNS.FFI.17
level: P
impact: MEDIUM
---

# Use Dedicated Opaque Type Pointers Instead of c_void for C Opaque Types

## Summary

Instead of using `*mut c_void` for opaque C handles, create dedicated marker types that provide type safety.

## Rationale

- `*mut c_void` accepts any pointer, easy to mix up handles
- Dedicated types catch mistakes at compile time
- Self-documenting code
- Prevents accidental use of wrong free function

## Bad Example

```rust
use std::ffi::c_void;

extern "C" {
    fn create_database() -> *mut c_void;
    fn create_connection() -> *mut c_void;
    fn execute(conn: *mut c_void, query: *const i8);
    fn close_database(db: *mut c_void);
    fn close_connection(conn: *mut c_void);
}

fn bad_usage() {
    let db = unsafe { create_database() };
    let conn = unsafe { create_connection() };

    // BUG: Passed db where conn was expected - compiles fine!
    unsafe { execute(db, b"SELECT 1\0".as_ptr() as *const i8) };

    // BUG: Wrong close function - compiles fine!
    unsafe { close_connection(db) };
    unsafe { close_database(conn) };
}
```

## Good Example

```rust
use std::marker::PhantomData;

// DO: Define opaque marker types
#[repr(C)]
pub struct Database {
    _private: [u8; 0],
    _marker: PhantomData<(*mut u8, std::marker::PhantomPinned)>,
}

#[repr(C)]
pub struct Connection {
    _private: [u8; 0],
    _marker: PhantomData<(*mut u8, std::marker::PhantomPinned)>,
}

extern "C" {
    fn create_database() -> *mut Database;
    fn create_connection(db: *mut Database) -> *mut Connection;
    fn execute(conn: *mut Connection, query: *const i8) -> i32;
    fn close_database(db: *mut Database);
    fn close_connection(conn: *mut Connection);
}

fn good_usage() {
    let db = unsafe { create_database() };
    let conn = unsafe { create_connection(db) };

    // Compile error: expected *mut Connection, found *mut Database
    // unsafe { execute(db, b"SELECT 1\0".as_ptr() as *const i8) };

    // Correct usage
    unsafe { execute(conn, b"SELECT 1\0".as_ptr() as *const i8) };

    unsafe { close_connection(conn) };
    unsafe { close_database(db) };
}

// DO: Wrap in safe Rust types
pub struct SafeDatabase {
    ptr: *mut Database,
}

impl SafeDatabase {
    pub fn new() -> Option<Self> {
        let ptr = unsafe { create_database() };
        if ptr.is_null() { None } else { Some(Self { ptr }) }
    }

    pub fn connect(&self) -> Option<SafeConnection<'_>> {
        let ptr = unsafe { create_connection(self.ptr) };
        if ptr.is_null() { None } else { Some(SafeConnection { ptr, _db: PhantomData }) }
    }
}

impl Drop for SafeDatabase {
    fn drop(&mut self) {
        unsafe { close_database(self.ptr); }
    }
}

pub struct SafeConnection<'db> {
    ptr: *mut Connection,
    _db: PhantomData<&'db SafeDatabase>,
}

impl SafeConnection<'_> {
    pub fn execute(&self, query: &str) -> Result<(), ()> {
        let query = std::ffi::CString::new(query).map_err(|_| ())?;
        let result = unsafe { execute(self.ptr, query.as_ptr()) };
        if result == 0 { Ok(()) } else { Err(()) }
    }
}

impl Drop for SafeConnection<'_> {
    fn drop(&mut self) {
        unsafe { close_connection(self.ptr); }
    }
}
```

## Opaque Type Pattern

```rust
// The zero-sized array makes it impossible to construct
// PhantomData ensures proper variance and !Send/!Sync if needed
#[repr(C)]
pub struct OpaqueHandle {
    _private: [u8; 0],
    _marker: PhantomData<(*mut u8, std::marker::PhantomPinned)>,
}
```

## Checklist

- [ ] Am I using `*mut c_void` for distinct handle types?
- [ ] Would dedicated types prevent bugs?
- [ ] Have I wrapped opaque pointers in safe Rust types?
- [ ] Do my types enforce correct handle/function pairing?

## Related Rules

- `ffi-02`: Read std::ffi documentation
- `ffi-03`: Implement Drop for wrapped pointers

---
id: ffi-18
original_id: P.UNS.FFI.18
level: P
impact: HIGH
---

# Avoid Passing Trait Objects to C Interfaces

## Summary

Trait objects (`dyn Trait`) have Rust-specific layout (fat pointers with vtable) that is not compatible with C.

## Rationale

- Trait objects are "fat pointers": data ptr + vtable ptr
- C expects thin pointers (single pointer)
- Vtable layout is not stable across Rust versions
- C cannot call Rust vtable methods

## Bad Example

```rust
// DON'T: Pass trait objects to C
trait Handler {
    fn handle(&self, data: i32);
}

extern "C" {
    // This won't work - dyn Handler is a fat pointer!
    fn set_handler(h: *const dyn Handler);
}

// DON'T: Store trait objects in FFI structs
#[repr(C)]
struct BadCallback {
    handler: *const dyn Handler,  // Not C-compatible!
}
```

## Good Example

```rust
use std::os::raw::{c_int, c_void};

// DO: Use function pointers with user_data (trampoline pattern)
type HandlerFn = extern "C" fn(data: c_int, user_data: *mut c_void);

extern "C" {
    fn set_handler(handler: HandlerFn, user_data: *mut c_void);
}

trait Handler {
    fn handle(&self, data: i32);
}

fn register_handler<H: Handler + 'static>(handler: H) {
    // Box the handler
    let boxed: Box<H> = Box::new(handler);
    let user_data = Box::into_raw(boxed) as *mut c_void;

    extern "C" fn trampoline<H: Handler>(data: c_int, user_data: *mut c_void) {
        let handler = unsafe { &*(user_data as *const H) };
        handler.handle(data as i32);
    }

    unsafe {
        set_handler(trampoline::<H>, user_data);
    }
}

// DO: Use concrete types when possible
struct ConcreteHandler {
    multiplier: i32,
}

impl Handler for ConcreteHandler {
    fn handle(&self, data: i32) {
        println!("{}", data * self.multiplier);
    }
}

// DO: Create C-compatible vtable manually if needed
#[repr(C)]
struct HandlerVtable {
    handle: extern "C" fn(this: *const c_void, data: c_int),
    drop: extern "C" fn(this: *mut c_void),
}

#[repr(C)]
struct CCompatibleHandler {
    data: *mut c_void,
    vtable: *const HandlerVtable,
}

impl CCompatibleHandler {
    fn new<H: Handler + 'static>(handler: H) -> Self {
        extern "C" fn handle_impl<H: Handler>(this: *const c_void, data: c_int) {
            let handler = unsafe { &*(this as *const H) };
            handler.handle(data as i32);
        }

        extern "C" fn drop_impl<H: Handler>(this: *mut c_void) {
            unsafe { drop(Box::from_raw(this as *mut H)); }
        }

        static VTABLE: HandlerVtable = HandlerVtable {
            handle: handle_impl::<ConcreteHandler>,  // Need concrete type
            drop: drop_impl::<ConcreteHandler>,
        };

        Self {
            data: Box::into_raw(Box::new(handler)) as *mut c_void,
            vtable: &VTABLE,
        }
    }

    fn handle(&self, data: i32) {
        unsafe {
            ((*self.vtable).handle)(self.data, data as c_int);
        }
    }
}

impl Drop for CCompatibleHandler {
    fn drop(&mut self) {
        unsafe {
            ((*self.vtable).drop)(self.data);
        }
    }
}
```

## Why Trait Objects Don't Work

```
Rust trait object (*const dyn Handler):
[data pointer][vtable pointer]  <- 16 bytes on 64-bit

C pointer (void*):
[pointer]  <- 8 bytes on 64-bit

The sizes don't match!
```

## Alternatives to Trait Objects

| Instead of | Use |
|------------|-----|
| `dyn Trait` | Function pointer + user_data |
| `Box<dyn Trait>` | Boxed concrete type + trampoline |
| `&dyn Trait` | C-compatible vtable struct |
| `Arc<dyn Trait>` | Reference counting wrapper |

## Checklist

- [ ] Am I passing trait objects across FFI?
- [ ] Can I use concrete types instead?
- [ ] Have I used the trampoline pattern for callbacks?
- [ ] If vtable is needed, is it C-compatible?

## Related Rules

- `ffi-16`: Closure to C with trampoline pattern
- `ffi-14`: Types should have stable layout

---
id: general-01
original_id: P.UNS.01
level: P
impact: CRITICAL
---

# Do Not Abuse Unsafe to Escape Compiler Safety Checks

## Summary

Unsafe Rust should not be used as an escape hatch from the borrow checker or other compiler safety mechanisms.

## Rationale

The borrow checker exists to prevent memory safety bugs. Using `unsafe` to bypass it defeats Rust's safety guarantees and introduces potential undefined behavior.

## Bad Example

```rust
// DON'T: Using unsafe to bypass borrow checker
fn bad_alias() {
    let mut data = vec![1, 2, 3];
    let ptr = data.as_mut_ptr();

    // Unsafe used to create aliasing mutable references
    unsafe {
        let ref1 = &mut *ptr;
        let ref2 = &mut *ptr;  // UB: Two mutable references!
        *ref1 = 10;
        *ref2 = 20;
    }
}
```

## Good Example

```rust
// DO: Work with the borrow checker, not against it
fn good_sequential() {
    let mut data = vec![1, 2, 3];
    data[0] = 10;
    data[0] = 20;  // Sequential mutations are fine
}

// DO: Use interior mutability when needed
use std::cell::RefCell;

fn good_interior_mut() {
    let data = RefCell::new(vec![1, 2, 3]);
    data.borrow_mut()[0] = 10;
}
```

## Legitimate Uses of Unsafe

1. **FFI**: Calling C functions or implementing C-compatible interfaces
2. **Low-level abstractions**: Implementing collections, synchronization primitives
3. **Performance**: Only after profiling shows measurable improvement, and with careful safety analysis

## Checklist

- [ ] Have I tried all safe alternatives first?
- [ ] Is the borrow checker preventing a genuine design need?
- [ ] Can I restructure the code to satisfy the borrow checker?
- [ ] If unsafe is necessary, have I documented the safety invariants?

## Related Rules

- `general-02`: Don't blindly use unsafe for performance
- `safety-02`: Unsafe code authors must verify safety invariants

---
id: general-02
original_id: P.UNS.02
level: P
impact: CRITICAL
---

# Do Not Blindly Use Unsafe for Performance

## Summary

Do not assume that using `unsafe` will automatically improve performance. Always measure first and verify the safety invariants.

## Rationale

1. Modern Rust optimizers often eliminate bounds checks when they can prove safety
2. Unsafe code may prevent optimizations by breaking aliasing assumptions
3. Unmeasured "optimizations" often provide no real benefit while introducing risk

## Bad Example

```rust
// DON'T: Blind unsafe for "performance"
fn sum_bad(slice: &[i32]) -> i32 {
    let mut sum = 0;
    // Unnecessary unsafe - LLVM can optimize the safe version
    for i in 0..slice.len() {
        unsafe {
            sum += *slice.get_unchecked(i);
        }
    }
    sum
}
```

## Good Example

```rust
// DO: Use safe iteration - compiler optimizes bounds checks away
fn sum_good(slice: &[i32]) -> i32 {
    slice.iter().sum()
}

// DO: If unsafe is justified, document why
fn sum_justified(slice: &[i32]) -> i32 {
    let mut sum = 0;
    // This is actually slower than iter().sum() in most cases
    // Only use get_unchecked when:
    // 1. Profiler shows bounds checks as bottleneck
    // 2. Iterator patterns can't be used
    // 3. Safety is proven by other means
    for i in 0..slice.len() {
        // SAFETY: i is always < slice.len() due to loop condition
        unsafe {
            sum += *slice.get_unchecked(i);
        }
    }
    sum
}
```

## When Unsafe Might Be Justified for Performance

1. **Hot inner loops** where profiling shows bounds checks are a bottleneck
2. **SIMD operations** that require specific memory alignment
3. **Lock-free data structures** with carefully verified memory orderings

## Measurement Workflow

```bash
# 1. Benchmark the safe version first
cargo bench --bench my_bench

# 2. Profile to identify actual bottlenecks
cargo flamegraph --bench my_bench

# 3. Only then consider unsafe, with measurements
```

## Checklist

- [ ] Have I benchmarked the safe version?
- [ ] Does profiling show this specific code as a bottleneck?
- [ ] Have I measured the actual improvement from unsafe?
- [ ] Is the performance gain worth the safety risk?

## Related Rules

- `general-01`: Don't abuse unsafe to escape safety checks
- `safety-02`: Unsafe code authors must verify safety invariants

---
id: general-03
original_id: G.UNS.01
level: G
impact: MEDIUM
---

# Do Not Create Aliases for Types/Methods Named "Unsafe"

## Summary

Do not create type aliases, re-exports, or wrapper methods that hide the "unsafe" nature of operations.

## Rationale

The word "unsafe" in Rust is a signal to developers that extra scrutiny is required. Hiding this signal makes code review harder and can lead to accidental misuse.

## Bad Example

```rust
// DON'T: Hide unsafe behind an alias
type SafePointer = *mut u8;  // Still unsafe to dereference!

// DON'T: Wrap unsafe in a "safe-looking" name
pub fn get_value(ptr: *const i32) -> i32 {
    unsafe { *ptr }  // Caller doesn't know this is unsafe!
}

// DON'T: Re-export unsafe functions with different names
pub use std::mem::transmute as convert;
```

## Good Example

```rust
// DO: Keep "unsafe" visible in the API
pub unsafe fn get_value_unchecked(ptr: *const i32) -> i32 {
    *ptr
}

// DO: If providing a safe wrapper, make the safety contract clear
/// Returns the value at the pointer.
///
/// # Safety
/// This is safe because the pointer is validated internally.
pub fn get_value_checked(ptr: *const i32) -> Option<i32> {
    if ptr.is_null() {
        None
    } else {
        // SAFETY: We checked for null above
        Some(unsafe { *ptr })
    }
}

// DO: Use clear naming for raw pointer types
type RawHandle = *mut c_void;  // "Raw" signals potential unsafety
```

## Common Violations

1. Creating type aliases that hide pointer types
2. Wrapping unsafe functions in safe-looking functions without proper safety analysis
3. Re-exporting unsafe functions with "friendlier" names

## Checklist

- [ ] Does my API preserve visibility of unsafe operations?
- [ ] If wrapping unsafe code in safe API, is the safety invariant enforced?
- [ ] Are type aliases clearly named to indicate their nature?

## Related Rules

- `safety-06`: Don't expose raw pointers in public APIs
- `safety-09`: Add SAFETY comment before any unsafe block

---
id: io-01
original_id: P.UNS.FIO.01
level: P
impact: HIGH
---

# Ensure I/O Safety When Using Raw Handles

## Summary

When working with raw file descriptors or handles, ensure they are valid for the duration of use and properly ownership-tracked.

## Rationale

- Raw handles can be closed by other code
- Using a closed handle is undefined behavior
- Handle reuse can cause data corruption
- Rust 1.63+ provides I/O safety traits

## Bad Example

```rust
#[cfg(unix)]
mod bad_example {
    use std::os::unix::io::RawFd;

    // DON'T: Accept raw handle without ownership
    fn bad_read(fd: RawFd) -> std::io::Result<Vec<u8>> {
        // What if fd was closed? What if it's reused?
        let mut buf = vec![0u8; 1024];
        let n = unsafe {
            libc::read(fd, buf.as_mut_ptr() as *mut libc::c_void, buf.len())
        };
        if n < 0 {
            Err(std::io::Error::last_os_error())
        } else {
            buf.truncate(n as usize);
            Ok(buf)
        }
    }

    // DON'T: Store raw handle without tracking ownership
    struct BadFileRef {
        fd: RawFd,  // Who owns this? Who closes it?
    }
}
```

## Good Example

```rust
#[cfg(unix)]
mod good_example {
    use std::os::unix::io::{AsFd, BorrowedFd, OwnedFd, FromRawFd, AsRawFd};
    use std::fs::File;

    // DO: Use BorrowedFd for borrowed access (Rust 1.63+)
    fn good_read(fd: BorrowedFd<'_>) -> std::io::Result<Vec<u8>> {
        let mut buf = vec![0u8; 1024];
        // BorrowedFd guarantees the fd is valid for this call
        let n = unsafe {
            libc::read(
                fd.as_raw_fd(),
                buf.as_mut_ptr() as *mut libc::c_void,
                buf.len()
            )
        };
        if n < 0 {
            Err(std::io::Error::last_os_error())
        } else {
            buf.truncate(n as usize);
            Ok(buf)
        }
    }

    // DO: Use OwnedFd for owned handles
    struct GoodFileOwner {
        fd: OwnedFd,  // Clearly owns the handle
    }

    impl Drop for GoodFileOwner {
        fn drop(&mut self) {
            // OwnedFd closes automatically
        }
    }

    // DO: Use generic AsFd bound for flexibility
    fn generic_read<F: AsFd>(f: &F) -> std::io::Result<Vec<u8>> {
        good_read(f.as_fd())
    }

    // Usage
    fn example() -> std::io::Result<()> {
        let file = File::open("test.txt")?;

        // Pass as BorrowedFd
        let data = good_read(file.as_fd())?;

        // Or use generic function
        let data = generic_read(&file)?;

        Ok(())
    }

    // DO: Take ownership from raw fd
    fn from_raw(fd: i32) -> Option<GoodFileOwner> {
        if fd < 0 {
            return None;
        }
        // SAFETY: Caller guarantees fd is valid and ownership is transferred
        let owned = unsafe { OwnedFd::from_raw_fd(fd) };
        Some(GoodFileOwner { fd: owned })
    }
}
```

## I/O Safety Types (Rust 1.63+)

| Type | Meaning |
|------|---------|
| `OwnedFd` | Owns a file descriptor, closes on drop |
| `BorrowedFd<'a>` | Borrows a fd for lifetime 'a |
| `RawFd` | Raw integer, no safety guarantees |
| `AsFd` | Trait for types that have a fd |
| `From<OwnedFd>` | Create from owned fd |
| `Into<OwnedFd>` | Convert to owned fd |

## Windows Equivalents

```rust
#[cfg(windows)]
use std::os::windows::io::{
    OwnedHandle, BorrowedHandle, RawHandle,
    AsHandle, FromRawHandle,
    OwnedSocket, BorrowedSocket, RawSocket,
    AsSocket, FromRawSocket,
};
```

## Checklist

- [ ] Am I using BorrowedFd/OwnedFd instead of RawFd?
- [ ] Is ownership of handles clear?
- [ ] Am I using the AsFd trait for generic code?
- [ ] Is the fd guaranteed valid for the duration of use?

## Related Rules

- `ffi-03`: Implement Drop for resource wrappers
- `safety-02`: Verify safety invariants

---
id: mem-01
original_id: P.UNS.MEM.01
level: P
impact: HIGH
---

# Choose Appropriate Data Layout for Struct/Tuple/Enum

## Summary

Use `#[repr(...)]` attributes to control data layout when interfacing with C, doing memory mapping, or needing specific guarantees.

## Rationale

Rust's default layout is unspecified and may change between compiler versions. For FFI, persistence, or low-level memory operations, you need predictable layout.

## Repr Attributes

| Attribute | Use Case |
|-----------|----------|
| `#[repr(C)]` | C-compatible layout, stable field order |
| `#[repr(transparent)]` | Single-field struct with same layout as field |
| `#[repr(packed)]` | No padding (alignment = 1), careful with references! |
| `#[repr(align(N))]` | Minimum alignment of N bytes |
| `#[repr(u8)]`, `#[repr(i32)]`, etc. | Enum discriminant type |

## Bad Example

```rust
// DON'T: Assume Rust struct layout matches C
struct BadFFI {
    a: u8,
    b: u32,
    c: u8,
}
// Rust may reorder fields or add different padding than C

// DON'T: Use packed without understanding the risks
#[repr(packed)]
struct Dangerous {
    a: u8,
    b: u32,
}

fn bad_ref(d: &Dangerous) -> &u32 {
    &d.b  // UB: Creates unaligned reference!
}
```

## Good Example

```rust
// DO: Use repr(C) for FFI
#[repr(C)]
struct GoodFFI {
    a: u8,
    b: u32,
    c: u8,
}
// Guaranteed: a at 0, padding 1-3, b at 4, c at 8, padding 9-11

// DO: Use repr(transparent) for newtypes
#[repr(transparent)]
struct Wrapper(u32);
// Guaranteed same layout as u32, can be transmuted

// DO: Use repr(packed) carefully, access via copy
#[repr(C, packed)]
struct PackedData {
    header: u8,
    value: u32,
}

impl PackedData {
    fn value(&self) -> u32 {
        // Copy out the value to avoid unaligned reference
        let ptr = std::ptr::addr_of!(self.value);
        // SAFETY: Reading unaligned is OK with read_unaligned
        unsafe { ptr.read_unaligned() }
    }
}

// DO: Use align for SIMD or cache line alignment
#[repr(C, align(64))]
struct CacheAligned {
    data: [u8; 64],
}

// DO: Specify enum discriminant for FFI
#[repr(u8)]
enum Status {
    Ok = 0,
    Error = 1,
    Unknown = 255,
}
```

## Layout Guarantees

```rust
use std::mem::{size_of, align_of};

#[repr(C)]
struct Example {
    a: u8,   // offset 0, size 1
    // padding: 3 bytes
    b: u32,  // offset 4, size 4
    c: u8,   // offset 8, size 1
    // padding: 3 bytes
}

assert_eq!(size_of::<Example>(), 12);
assert_eq!(align_of::<Example>(), 4);

// repr(Rust) might reorder to: b, a, c -> size 8
```

## Checklist

- [ ] Is this type used in FFI? → Use `#[repr(C)]`
- [ ] Is this a newtype wrapper? → Consider `#[repr(transparent)]`
- [ ] Do I need specific alignment? → Use `#[repr(align(N))]`
- [ ] Am I using packed? → Never create references to packed fields

## Related Rules

- `ffi-13`: Ensure consistent data layout for custom types
- `ffi-14`: Types in FFI should have stable layout
- `ptr-04`: Alignment considerations

---
id: mem-02
original_id: P.UNS.MEM.02
level: P
impact: CRITICAL
---

# Do Not Modify Memory Variables of Other Processes or Dynamic Libraries

## Summary

Do not directly manipulate memory belonging to other processes or dynamically loaded libraries. Use proper IPC or FFI mechanisms.

## Rationale

- Other processes have separate address spaces; direct access is impossible on modern OSes
- Shared memory requires explicit setup and synchronization
- Dynamic library memory has ownership rules that must be respected
- Violating these causes undefined behavior or security vulnerabilities

## Bad Example

```rust
// DON'T: Try to access another process's memory directly
fn bad_cross_process(ptr: *mut i32) {
    // This pointer from another process is meaningless in our address space
    unsafe { *ptr = 42; }  // Undefined behavior or crash
}

// DON'T: Modify library internals
extern "C" {
    static mut LIBRARY_INTERNAL: i32;
}

fn bad_library_access() {
    // Modifying library internals breaks encapsulation
    unsafe { LIBRARY_INTERNAL = 100; }  // May corrupt library state
}
```

## Good Example

```rust
// DO: Use proper IPC for cross-process communication
use std::io::{Read, Write};
use std::os::unix::net::UnixStream;

fn ipc_communication() -> std::io::Result<()> {
    let mut stream = UnixStream::connect("/tmp/socket")?;
    stream.write_all(b"message")?;
    Ok(())
}

// DO: Use shared memory with proper synchronization
#[cfg(unix)]
fn shared_memory_example() {
    use std::sync::atomic::{AtomicI32, Ordering};

    // Properly set up shared memory region
    // let shm = mmap shared memory...

    // Use atomic operations for synchronization
    let shared: &AtomicI32 = /* ... */;
    shared.store(42, Ordering::Release);
}

// DO: Use proper FFI for library interaction
mod ffi {
    extern "C" {
        pub fn library_set_value(value: i32);
        pub fn library_get_value() -> i32;
    }
}

fn proper_library_access() {
    unsafe {
        ffi::library_set_value(42);
        let value = ffi::library_get_value();
    }
}

// DO: Use Rust's libloading for dynamic libraries
fn dynamic_library() -> Result<(), Box<dyn std::error::Error>> {
    let lib = unsafe { libloading::Library::new("mylib.so")? };
    let func: libloading::Symbol<extern "C" fn(i32) -> i32> =
        unsafe { lib.get(b"my_function")? };
    let result = func(42);
    Ok(())
}
```

## Memory Ownership Rules

| Memory Type | Owner | Safe Access |
|-------------|-------|-------------|
| Stack variables | Current function | Direct |
| Heap (Box, Vec) | Rust allocator | Through smart pointers |
| Static | Program | With proper synchronization |
| Shared memory | Multiple processes | Atomic ops, mutexes |
| Library memory | Library | Through library API |
| FFI-allocated | C allocator | Through C free functions |

## Checklist

- [ ] Who allocated this memory?
- [ ] Who is responsible for freeing it?
- [ ] Is proper synchronization in place for shared access?
- [ ] Am I using the correct API for cross-boundary access?

## Related Rules

- `mem-03`: Don't let String/Vec drop other process's memory
- `ffi-03`: Implement Drop for wrapped C pointers

---
id: mem-03
original_id: P.UNS.MEM.03
level: P
impact: CRITICAL
---

# Do Not Let String/Vec Auto-Drop Other Process's Memory

## Summary

Never create `String`, `Vec`, or `Box` from memory allocated outside Rust's allocator. They will try to free the memory with the wrong deallocator.

## Rationale

`String`, `Vec`, and `Box` assume memory was allocated by Rust's global allocator. When dropped, they call `dealloc`. If the memory came from C's `malloc`, a different allocator, or shared memory, this causes undefined behavior.

## Bad Example

```rust
// DON'T: Create String from C-allocated memory
extern "C" {
    fn c_get_string() -> *mut std::os::raw::c_char;
}

fn bad_string() -> String {
    unsafe {
        let ptr = c_get_string();
        // BAD: String will try to free with Rust allocator
        String::from_raw_parts(ptr as *mut u8, len, cap)
    }
}

// DON'T: Create Vec from foreign memory
fn bad_vec(ptr: *mut u8, len: usize) -> Vec<u8> {
    // BAD: Vec will free this memory incorrectly
    unsafe { Vec::from_raw_parts(ptr, len, len) }
}

// DON'T: Wrap shared memory in Box
fn bad_box(shared_ptr: *mut Data) -> Box<Data> {
    // BAD: Box will try to deallocate shared memory!
    unsafe { Box::from_raw(shared_ptr) }
}
```

## Good Example

```rust
use std::ffi::CStr;

extern "C" {
    fn c_get_string() -> *mut std::os::raw::c_char;
    fn c_free_string(s: *mut std::os::raw::c_char);
}

// DO: Copy data into Rust-owned allocation
fn good_string() -> String {
    unsafe {
        let ptr = c_get_string();
        let cstr = CStr::from_ptr(ptr);
        let result = cstr.to_string_lossy().into_owned();
        c_free_string(ptr);  // Free with correct deallocator
        result
    }
}

// DO: Use wrapper that calls correct deallocator
struct CString {
    ptr: *mut std::os::raw::c_char,
}

impl Drop for CString {
    fn drop(&mut self) {
        unsafe { c_free_string(self.ptr); }
    }
}

// DO: Use slice for borrowed view, don't take ownership
fn good_slice(ptr: *const u8, len: usize) -> &'static [u8] {
    // Only borrow, don't own
    unsafe { std::slice::from_raw_parts(ptr, len) }
}

// DO: For shared memory, use raw pointers or custom wrapper
struct SharedBuffer {
    ptr: *mut u8,
    len: usize,
}

impl SharedBuffer {
    fn as_slice(&self) -> &[u8] {
        unsafe { std::slice::from_raw_parts(self.ptr, self.len) }
    }
}

impl Drop for SharedBuffer {
    fn drop(&mut self) {
        // Unmap shared memory, don't deallocate
        // munmap(self.ptr, self.len);
    }
}
```

## Memory Allocation Compatibility

| Allocator | Can use Rust Vec/String/Box? |
|-----------|------------------------------|
| Rust global allocator | Yes |
| C malloc | No - use wrapper with C free |
| C++ new | No - use wrapper with C++ delete |
| Custom allocator | No - use allocator_api |
| mmap/shared memory | No - use munmap |
| Stack/static | No - never "free" |

## Checklist

- [ ] Who allocated this memory?
- [ ] Is it from Rust's global allocator?
- [ ] If not, do I have a custom Drop that frees correctly?
- [ ] Am I copying data or taking ownership?

## Related Rules

- `mem-02`: Don't modify other process's memory
- `ffi-03`: Implement Drop for wrapped C pointers
- `ffi-07`: Don't implement Drop for types passed to external code

---
id: mem-04
original_id: P.UNS.MEM.04
level: P
impact: HIGH
---

# Prefer Reentrant Versions of C-API or Syscalls

## Summary

When calling C functions or system calls, use reentrant (`_r`) versions to avoid data races from global state.

## Rationale

Many C library functions use static buffers or global state, making them unsafe in multithreaded programs. Reentrant versions use caller-provided buffers instead.

## Bad Example

```rust
use std::ffi::CStr;

extern "C" {
    fn strtok(s: *mut i8, delim: *const i8) -> *mut i8;
    fn localtime(time: *const i64) -> *mut Tm;
    fn rand() -> i32;
}

// DON'T: Use non-reentrant functions
fn bad_tokenize(s: &mut [i8]) {
    unsafe {
        let delim = b" \0".as_ptr() as *const i8;
        // strtok uses static buffer - not thread-safe!
        let token = strtok(s.as_mut_ptr(), delim);
    }
}

fn bad_time() {
    unsafe {
        let now: i64 = 0;
        // localtime returns pointer to static buffer
        let tm = localtime(&now);  // Data race if called from multiple threads!
    }
}

fn bad_random() -> i32 {
    // rand() uses global state - not thread-safe
    unsafe { rand() }
}
```

## Good Example

```rust
extern "C" {
    fn strtok_r(s: *mut i8, delim: *const i8, saveptr: *mut *mut i8) -> *mut i8;
    fn localtime_r(time: *const i64, result: *mut Tm) -> *mut Tm;
    fn rand_r(seed: *mut u32) -> i32;
}

// DO: Use reentrant versions
fn good_tokenize(s: &mut [i8]) {
    unsafe {
        let delim = b" \0".as_ptr() as *const i8;
        let mut saveptr: *mut i8 = std::ptr::null_mut();
        // strtok_r uses caller-provided saveptr
        let token = strtok_r(s.as_mut_ptr(), delim, &mut saveptr);
    }
}

fn good_time() {
    unsafe {
        let now: i64 = 0;
        let mut result: Tm = std::mem::zeroed();
        // localtime_r writes to caller-provided buffer
        localtime_r(&now, &mut result);
    }
}

fn good_random(seed: &mut u32) -> i32 {
    // rand_r uses caller-provided seed
    unsafe { rand_r(seed) }
}

// BETTER: Use Rust standard library
fn best_time() {
    use std::time::SystemTime;
    let now = SystemTime::now();  // Thread-safe!
}

fn best_random() -> u32 {
    use rand::Rng;
    rand::thread_rng().gen()  // Thread-safe!
}
```

## Common Non-Reentrant Functions

| Non-Reentrant | Reentrant | Rust Alternative |
|---------------|-----------|------------------|
| `strtok` | `strtok_r` | `str::split` |
| `localtime` | `localtime_r` | `chrono` crate |
| `gmtime` | `gmtime_r` | `chrono` crate |
| `ctime` | `ctime_r` | `chrono` crate |
| `rand` | `rand_r` | `rand` crate |
| `strerror` | `strerror_r` | `std::io::Error` |
| `getenv` | None (inherent race) | `std::env::var` (not atomic) |
| `readdir` | `readdir_r` | `std::fs::read_dir` |
| `gethostbyname` | `getaddrinfo` | `std::net::ToSocketAddrs` |

## Checklist

- [ ] Am I calling a C function that might use global state?
- [ ] Is there a `_r` reentrant version available?
- [ ] Is there a Rust standard library alternative?
- [ ] If neither, do I need synchronization?

## Related Rules

- `ffi-10`: Exported functions must be thread-safe
- `ptr-01`: Don't share raw pointers across threads

---
id: mem-05
original_id: P.UNS.MEM.05
level: P
impact: MEDIUM
---

# Use Third-Party Crates for Bitfields

## Summary

Use crates like `bitflags`, `bitvec`, or `modular-bitfield` instead of manual bit manipulation for complex bitfield operations.

## Rationale

- Manual bit manipulation is error-prone
- Easy to get offsets, masks, or endianness wrong
- Crates provide type-safe, tested abstractions
- Proc-macro crates generate efficient code

## Bad Example

```rust
// DON'T: Manual bitfield manipulation
struct Flags(u32);

impl Flags {
    const READ: u32 = 1 << 0;
    const WRITE: u32 = 1 << 1;
    const EXECUTE: u32 = 1 << 2;

    fn has_read(&self) -> bool {
        (self.0 & Self::READ) != 0
    }

    fn set_read(&mut self) {
        self.0 |= Self::READ;
    }

    fn clear_read(&mut self) {
        self.0 &= !Self::READ;  // Easy to forget the !
    }
}

// DON'T: Manual packed bitfields for FFI
#[repr(C)]
struct PackedHeader {
    data: u32,
}

impl PackedHeader {
    // Error-prone: wrong shift or mask values
    fn version(&self) -> u8 {
        ((self.data >> 24) & 0xFF) as u8
    }

    fn flags(&self) -> u16 {
        ((self.data >> 8) & 0xFFFF) as u16
    }

    fn tag(&self) -> u8 {
        (self.data & 0xFF) as u8
    }
}
```

## Good Example

```rust
// DO: Use bitflags for flag sets
use bitflags::bitflags;

bitflags! {
    #[derive(Debug, Clone, Copy, PartialEq, Eq)]
    struct Flags: u32 {
        const READ = 1 << 0;
        const WRITE = 1 << 1;
        const EXECUTE = 1 << 2;
        const RW = Self::READ.bits() | Self::WRITE.bits();
    }
}

fn use_flags() {
    let mut flags = Flags::READ | Flags::WRITE;
    flags.insert(Flags::EXECUTE);
    flags.remove(Flags::WRITE);

    if flags.contains(Flags::READ) {
        println!("Readable");
    }
}

// DO: Use modular-bitfield for packed structures
use modular_bitfield::prelude::*;

#[bitfield]
#[repr(C)]
struct PackedHeader {
    tag: B8,      // 8 bits
    flags: B16,   // 16 bits
    version: B8,  // 8 bits
}

fn use_packed() {
    let header = PackedHeader::new()
        .with_version(1)
        .with_flags(0x1234)
        .with_tag(0xAB);

    assert_eq!(header.version(), 1);
    assert_eq!(header.flags(), 0x1234);
}

// DO: Use bitvec for arbitrary bit manipulation
use bitvec::prelude::*;

fn use_bitvec() {
    let mut bits = bitvec![u8, Msb0; 0; 16];
    bits.set(0, true);
    bits.set(7, true);

    let byte: u8 = bits[0..8].load_be();
    assert_eq!(byte, 0b1000_0001);
}
```

## Recommended Crates

| Crate | Use Case | Features |
|-------|----------|----------|
| `bitflags` | Flag sets (like C enums) | Type-safe, const, derives |
| `modular-bitfield` | Packed struct fields | Proc macro, repr(C) |
| `bitvec` | Arbitrary bit arrays | Slicing, iteration |
| `packed_struct` | Binary protocol structs | Endianness, derive |
| `deku` | Binary parsing | Derive, read/write |

## Checklist

- [ ] Am I manipulating multiple bit flags? → Use `bitflags`
- [ ] Am I packing fields into bytes? → Use `modular-bitfield` or `packed_struct`
- [ ] Am I doing binary protocol work? → Consider `deku`
- [ ] Is the manual approach really simpler?

## Related Rules

- `mem-01`: Choose appropriate data layout
- `ffi-13`: Ensure consistent data layout

---
id: mem-06
original_id: G.UNS.MEM.01
level: G
impact: HIGH
clippy: uninit_assumed_init, uninit_vec
---

# Use MaybeUninit<T> for Uninitialized Memory

## Summary

Use `MaybeUninit<T>` instead of `mem::uninitialized()` or `mem::zeroed()` when working with uninitialized memory.

## Rationale

- `mem::uninitialized()` is deprecated and unsound
- `mem::zeroed()` is UB for types where zero is invalid (references, NonZero, bool)
- `MaybeUninit<T>` clearly marks memory as potentially uninitialized
- Compiler can optimize based on initialization state

## Bad Example

```rust
// DON'T: Use deprecated uninitialized
fn bad_uninit<T>() -> T {
    unsafe { std::mem::uninitialized() }  // Deprecated, UB
}

// DON'T: Use zeroed for types where zero is invalid
fn bad_zeroed() -> &'static str {
    unsafe { std::mem::zeroed() }  // UB: null reference
}

fn bad_zeroed_bool() -> bool {
    unsafe { std::mem::zeroed() }  // UB: 0 might not be valid bool
}

// DON'T: Transmute to "initialize"
fn bad_transmute() -> [String; 10] {
    unsafe { std::mem::transmute([0u8; std::mem::size_of::<[String; 10]>()]) }
}

// DON'T: Set Vec length without initializing
fn bad_vec() -> Vec<String> {
    let mut v = Vec::with_capacity(10);
    unsafe { v.set_len(10); }  // Elements are uninitialized!
    v
}
```

## Good Example

```rust
use std::mem::MaybeUninit;

// DO: Use MaybeUninit for delayed initialization
fn good_array() -> [String; 10] {
    let mut arr: [MaybeUninit<String>; 10] =
        unsafe { MaybeUninit::uninit().assume_init() };

    for (i, elem) in arr.iter_mut().enumerate() {
        elem.write(format!("item {}", i));
    }

    // SAFETY: All elements initialized above
    unsafe { std::mem::transmute::<_, [String; 10]>(arr) }
}

// DO: Use MaybeUninit with arrays (cleaner with array_assume_init)
fn good_array_nightly() -> [String; 10] {
    let mut arr: [MaybeUninit<String>; 10] =
        [const { MaybeUninit::uninit() }; 10];

    for (i, elem) in arr.iter_mut().enumerate() {
        elem.write(format!("item {}", i));
    }

    // On nightly: arr.map(|e| unsafe { e.assume_init() })
    unsafe { MaybeUninit::array_assume_init(arr) }
}

// DO: Use zeroed only for types where it's valid
fn good_zeroed() -> [u8; 1024] {
    // SAFETY: All-zero bytes is valid for u8
    unsafe { std::mem::zeroed() }
}

// DO: Initialize buffer properly
fn good_vec() -> Vec<u8> {
    let mut v = Vec::with_capacity(1024);

    // Option 1: Resize with default value
    v.resize(1024, 0);

    // Option 2: Use spare_capacity_mut
    let spare = v.spare_capacity_mut();
    for elem in spare.iter_mut().take(1024) {
        elem.write(0);
    }
    unsafe { v.set_len(1024); }

    v
}

// DO: Use MaybeUninit::uninit_array (nightly) or const array
fn good_uninit_array<const N: usize>() -> [MaybeUninit<u8>; N] {
    // Stable: create array of uninit
    [const { MaybeUninit::uninit() }; N]
}
```

## MaybeUninit API

```rust
use std::mem::MaybeUninit;

// Creation
let uninit: MaybeUninit<T> = MaybeUninit::uninit();
let zeroed: MaybeUninit<T> = MaybeUninit::zeroed();
let init: MaybeUninit<T> = MaybeUninit::new(value);

// Writing
uninit.write(value);  // Returns &mut T

// Reading (unsafe)
let value: T = unsafe { uninit.assume_init() };
let ref_: &T = unsafe { uninit.assume_init_ref() };
let mut_: &mut T = unsafe { uninit.assume_init_mut() };

// Pointer access
let ptr: *const T = uninit.as_ptr();
let mut_ptr: *mut T = uninit.as_mut_ptr();
```

## Checklist

- [ ] Am I using `mem::uninitialized()`? → Replace with `MaybeUninit`
- [ ] Am I using `mem::zeroed()` for non-POD types? → Use `MaybeUninit`
- [ ] Am I setting Vec length without initialization? → Use proper initialization
- [ ] Have I initialized all MaybeUninit before assume_init?

## Related Rules

- `safety-03`: Don't expose uninitialized memory in APIs
- `safety-01`: Panic safety with partial initialization

---
id: ptr-01
original_id: P.UNS.PTR.01
level: P
impact: CRITICAL
---

# Do Not Share Raw Pointers Across Threads

## Summary

Raw pointers (`*const T`, `*mut T`) are not `Send` or `Sync` by default. Do not share them across threads without ensuring proper synchronization.

## Rationale

Raw pointers have no synchronization guarantees. Sharing them across threads can lead to data races, which are undefined behavior.

## Bad Example

```rust
use std::thread;

// DON'T: Share raw pointers across threads
fn bad_sharing() {
    let mut data = 42i32;
    let ptr = &mut data as *mut i32;

    let handle = thread::spawn(move || {
        // This is undefined behavior!
        unsafe { *ptr = 100; }
    });

    // Main thread also accesses - data race!
    unsafe { *ptr = 200; }

    handle.join().unwrap();
}

// DON'T: Wrap in struct and impl Send unsafely
struct UnsafePtr(*mut i32);
unsafe impl Send for UnsafePtr {}  // Unsound without synchronization!
```

## Good Example

```rust
use std::sync::{Arc, Mutex, atomic::{AtomicPtr, Ordering}};
use std::thread;

// DO: Use Arc<Mutex<T>> for shared mutable access
fn good_mutex() {
    let data = Arc::new(Mutex::new(42i32));
    let data_clone = Arc::clone(&data);

    let handle = thread::spawn(move || {
        *data_clone.lock().unwrap() = 100;
    });

    *data.lock().unwrap() = 200;
    handle.join().unwrap();
}

// DO: Use AtomicPtr for lock-free pointer sharing
fn good_atomic() {
    let data = Box::into_raw(Box::new(42i32));
    let atomic_ptr = Arc::new(AtomicPtr::new(data));
    let atomic_clone = Arc::clone(&atomic_ptr);

    let handle = thread::spawn(move || {
        let ptr = atomic_clone.load(Ordering::Acquire);
        // SAFETY: We have exclusive access through atomic operations
        unsafe { println!("Value: {}", *ptr); }
    });

    handle.join().unwrap();

    // SAFETY: All threads done, we own the memory
    unsafe { drop(Box::from_raw(atomic_ptr.load(Ordering::Relaxed))); }
}

// DO: If you must use raw pointers, ensure exclusive access
fn good_exclusive() {
    let mut data = vec![1, 2, 3];

    // Send data ownership to thread, not pointer
    let handle = thread::spawn(move || {
        data.push(4);
        data
    });

    let data = handle.join().unwrap();
    println!("{:?}", data);
}
```

## When Raw Pointers Across Threads Are Valid

Only with proper synchronization:
- Through `AtomicPtr` with appropriate memory orderings
- Protected by a `Mutex` (don't share the pointer, share the Mutex)
- Using lock-free algorithms with careful memory ordering

## Checklist

- [ ] Does my pointer cross thread boundaries?
- [ ] Is there synchronization preventing concurrent access?
- [ ] Can I use a higher-level abstraction (Arc, Mutex)?
- [ ] If implementing Send/Sync, is thread safety proven?

## Related Rules

- `safety-05`: Consider safety when implementing Send/Sync
- `safety-02`: Verify safety invariants

---
id: ptr-02
original_id: P.UNS.PTR.02
level: P
impact: MEDIUM
---

# Prefer NonNull<T> Over *mut T

## Summary

Use `NonNull<T>` instead of `*mut T` when the pointer should never be null. This enables null pointer optimization and makes the intent clear.

## Rationale

- `NonNull<T>` guarantees non-null at the type level
- Enables niche optimization: `Option<NonNull<T>>` is the same size as `*mut T`
- Makes invariants explicit in the type system
- Covariant over `T` (like `&T`), which is usually what you want

## Bad Example

```rust
// DON'T: Use *mut when pointer is always non-null
struct MyBox<T> {
    ptr: *mut T,  // Invariant: never null, but not enforced
}

impl<T> MyBox<T> {
    pub fn new(value: T) -> Self {
        let ptr = Box::into_raw(Box::new(value));
        // ptr is guaranteed non-null, but type doesn't show it
        Self { ptr }
    }

    pub fn get(&self) -> &T {
        // Must add null check or document the invariant
        unsafe { &*self.ptr }
    }
}
```

## Good Example

```rust
use std::ptr::NonNull;

// DO: Use NonNull when pointer is never null
struct MyBox<T> {
    ptr: NonNull<T>,  // Type guarantees non-null
}

impl<T> MyBox<T> {
    pub fn new(value: T) -> Self {
        let ptr = Box::into_raw(Box::new(value));
        // SAFETY: Box::into_raw never returns null
        let ptr = unsafe { NonNull::new_unchecked(ptr) };
        Self { ptr }
    }

    pub fn get(&self) -> &T {
        // SAFETY: NonNull guarantees ptr is valid
        unsafe { self.ptr.as_ref() }
    }
}

impl<T> Drop for MyBox<T> {
    fn drop(&mut self) {
        // SAFETY: ptr was created from Box::into_raw
        unsafe { drop(Box::from_raw(self.ptr.as_ptr())); }
    }
}

// DO: Niche optimization with Option
struct OptionalBox<T> {
    ptr: Option<NonNull<T>>,  // Same size as *mut T!
}
```

## NonNull API

```rust
use std::ptr::NonNull;

// Creating NonNull
let ptr: NonNull<i32> = NonNull::new(raw_ptr).expect("null pointer");
let ptr: NonNull<i32> = unsafe { NonNull::new_unchecked(raw_ptr) };
let ptr: NonNull<i32> = NonNull::dangling();  // For ZSTs or uninitialized

// Using NonNull
let raw: *mut i32 = ptr.as_ptr();
let reference: &i32 = unsafe { ptr.as_ref() };
let mut_ref: &mut i32 = unsafe { ptr.as_mut() };

// Casting
let ptr: NonNull<u8> = ptr.cast::<u8>();
```

## When to Use *mut T Instead

- When null is a valid/expected value
- FFI with C code that may return null
- When variance matters (NonNull is covariant, sometimes you need invariance)

## Checklist

- [ ] Is my pointer ever null? If no, use NonNull
- [ ] Do I need null pointer optimization?
- [ ] Is the variance correct for my use case?

## Related Rules

- `ptr-03`: Use PhantomData for variance and ownership
- `safety-06`: Don't expose raw pointers in public APIs

---
id: ptr-03
original_id: P.UNS.PTR.03
level: P
impact: HIGH
---

# Use PhantomData<T> for Variance and Ownership with Pointer Generics

## Summary

When a struct contains raw pointers but logically owns or borrows the pointed-to data, use `PhantomData<T>` to tell the compiler about the relationship.

## Rationale

Raw pointers don't carry ownership or lifetime information. `PhantomData` lets you:
- Indicate ownership (for `Drop` check)
- Control variance (covariant, contravariant, invariant)
- Participate in lifetime elision

## Bad Example

```rust
// DON'T: Raw pointer without PhantomData
struct MyVec<T> {
    ptr: *mut T,
    len: usize,
    cap: usize,
}

// Problems:
// 1. Compiler doesn't know we "own" the T values
// 2. T might be incorrectly determined as unused
// 3. Drop check may allow dangling references
```

## Good Example

```rust
use std::marker::PhantomData;
use std::ptr::NonNull;

// DO: Use PhantomData to express ownership
struct MyVec<T> {
    ptr: NonNull<T>,
    len: usize,
    cap: usize,
    _marker: PhantomData<T>,  // We own T values
}

// For owned data: PhantomData<T>
// For borrowed data: PhantomData<&'a T>
// For mutably borrowed: PhantomData<&'a mut T>
// For function pointers: PhantomData<fn(T)> (contravariant)

// DO: Express lifetime relationships
struct Iter<'a, T> {
    ptr: *const T,
    end: *const T,
    _marker: PhantomData<&'a T>,  // Borrows T for 'a
}

impl<'a, T> Iterator for Iter<'a, T> {
    type Item = &'a T;

    fn next(&mut self) -> Option<Self::Item> {
        if self.ptr == self.end {
            None
        } else {
            // SAFETY: ptr < end, so ptr is valid
            // Lifetime is tied to 'a through PhantomData
            let current = unsafe { &*self.ptr };
            self.ptr = unsafe { self.ptr.add(1) };
            Some(current)
        }
    }
}
```

## PhantomData Patterns

| Phantom Type | Meaning | Variance |
|--------------|---------|----------|
| `PhantomData<T>` | Owns T | Covariant |
| `PhantomData<&'a T>` | Borrows T for 'a | Covariant in T, covariant in 'a |
| `PhantomData<&'a mut T>` | Mutably borrows T | Invariant in T, covariant in 'a |
| `PhantomData<*const T>` | Just has pointer | Covariant |
| `PhantomData<*mut T>` | Just has pointer | Invariant |
| `PhantomData<fn(T)>` | Consumes T | Contravariant |
| `PhantomData<fn() -> T>` | Produces T | Covariant |

## Drop Check

```rust
use std::marker::PhantomData;

// This tells the compiler that dropping MyVec may drop T values
struct MyVec<T> {
    ptr: NonNull<T>,
    _marker: PhantomData<T>,
}

impl<T> Drop for MyVec<T> {
    fn drop(&mut self) {
        // Drop all T values...
    }
}

// Without PhantomData<T>, this might compile incorrectly:
// let x = MyVec::new(&local);
// drop(local);  // Would be UB if allowed
// drop(x);      // Tries to access dropped local
```

## Checklist

- [ ] Does my pointer type logically own the pointed-to data?
- [ ] Do I need to express a lifetime relationship?
- [ ] What variance do I need for my generic parameter?
- [ ] Will the type be dropped, and does it need drop check?

## Related Rules

- `ptr-02`: Prefer NonNull over *mut T
- `safety-05`: Send/Sync implementation safety

---
id: ptr-04
original_id: G.UNS.PTR.01
level: G
impact: HIGH
clippy: cast_ptr_alignment
---

# Do Not Dereference Pointers Cast to Misaligned Types

## Summary

When casting a pointer to a different type, ensure the resulting pointer is properly aligned for the target type.

## Rationale

Misaligned pointer dereferences are undefined behavior on most architectures. Even on architectures that support unaligned access, it may cause performance penalties or subtle bugs.

## Bad Example

```rust
// DON'T: Cast without checking alignment
fn bad_cast(bytes: &[u8]) -> u32 {
    // BAD: bytes might not be aligned for u32
    let ptr = bytes.as_ptr() as *const u32;
    unsafe { *ptr }  // UB if misaligned!
}

// DON'T: Assume struct layout
#[repr(C)]
struct Header {
    flags: u8,
    value: u32,  // Aligned at offset 4 in the struct
}

fn bad_field_access(bytes: &[u8]) -> u32 {
    let header = bytes.as_ptr() as *const Header;
    // Even if bytes is 4-byte aligned, this might fail
    // if Header has different alignment than expected
    unsafe { (*header).value }
}
```

## Good Example

```rust
// DO: Use read_unaligned for potentially misaligned data
fn good_cast(bytes: &[u8]) -> u32 {
    assert!(bytes.len() >= 4);
    let ptr = bytes.as_ptr() as *const u32;
    // SAFETY: We're reading 4 bytes, alignment doesn't matter for read_unaligned
    unsafe { ptr.read_unaligned() }
}

// DO: Check alignment before cast
fn good_aligned_cast(bytes: &[u8]) -> Option<&u32> {
    if bytes.len() >= 4 && bytes.as_ptr() as usize % std::mem::align_of::<u32>() == 0 {
        // SAFETY: Checked length and alignment
        Some(unsafe { &*(bytes.as_ptr() as *const u32) })
    } else {
        None
    }
}

// DO: Use from_ne_bytes for portable byte conversion
fn good_from_bytes(bytes: &[u8]) -> u32 {
    u32::from_ne_bytes(bytes[..4].try_into().unwrap())
}

// DO: Use bytemuck for safe transmutation
// use bytemuck::{Pod, Zeroable};
// let value: u32 = bytemuck::pod_read_unaligned(bytes);

// DO: Use align_to for splitting at alignment boundaries
fn process_aligned(bytes: &[u8]) {
    let (prefix, aligned, suffix) = unsafe { bytes.align_to::<u32>() };
    // prefix and suffix are unaligned portions
    // aligned is a &[u32] that's properly aligned
}
```

## Alignment Check Helpers

```rust
fn is_aligned<T>(ptr: *const u8) -> bool {
    ptr as usize % std::mem::align_of::<T>() == 0
}

/// Align a pointer up to the next aligned address
fn align_up<T>(ptr: *const u8) -> *const u8 {
    let align = std::mem::align_of::<T>();
    let addr = ptr as usize;
    let aligned = (addr + align - 1) & !(align - 1);
    aligned as *const u8
}
```

## Architecture Notes

| Arch | Misaligned Access |
|------|-------------------|
| x86/x64 | Works but slower |
| ARM | UB, may trap or give wrong results |
| RISC-V | UB, may trap |
| WASM | UB |

## Checklist

- [ ] Is my pointer cast changing alignment requirements?
- [ ] Is the source pointer guaranteed to be aligned?
- [ ] Should I use read_unaligned instead?
- [ ] Can I use safe conversion methods (from_ne_bytes)?

## Related Rules

- `mem-01`: Choose appropriate data layout
- `ffi-13`: Ensure consistent data layout

---
id: ptr-05
original_id: G.UNS.PTR.02
level: G
impact: CRITICAL
clippy: cast_ref_to_mut
---

# Do Not Manually Convert Immutable Pointer to Mutable

## Summary

Never cast `*const T` to `*mut T` and dereference it to write. This violates aliasing rules and is undefined behavior.

## Rationale

Creating `*const T` from `&T` implies immutability. Other references might exist. Writing through a `*mut T` created from `*const T` creates mutable aliasing, which is UB.

## Bad Example

```rust
// DON'T: Cast *const to *mut
fn bad_mutate(value: &i32) {
    let ptr = value as *const i32 as *mut i32;
    unsafe { *ptr = 42; }  // UB: Mutating through &
}

// DON'T: Use transmute to convert
fn bad_transmute(value: &i32) -> &mut i32 {
    unsafe { std::mem::transmute(value) }  // UB!
}

// DON'T: "I know this is the only reference"
fn bad_claim(value: &i32) {
    // Even if you "know" there's only one reference,
    // the compiler assumes & means no mutation
    let ptr = value as *const i32 as *mut i32;
    unsafe { *ptr += 1; }  // Still UB - compiler may optimize incorrectly
}
```

## Good Example

```rust
// DO: Take &mut if you need to mutate
fn good_mutate(value: &mut i32) {
    *value = 42;
}

// DO: Use interior mutability
use std::cell::{Cell, RefCell, UnsafeCell};

struct Mutable {
    value: Cell<i32>,  // Interior mutability
}

impl Mutable {
    fn modify(&self) {
        self.value.set(42);  // OK: Cell provides interior mutability
    }
}

// DO: Use UnsafeCell if you need raw unsafe interior mutability
struct RawMutable {
    value: UnsafeCell<i32>,
}

impl RawMutable {
    fn modify(&self) {
        // SAFETY: We ensure exclusive access through external means
        unsafe { *self.value.get() = 42; }
    }
}
```

## The UnsafeCell Exception

`UnsafeCell<T>` is the ONLY valid way to get `*mut T` from `&self`:

```rust
use std::cell::UnsafeCell;

pub struct MyMutex<T> {
    data: UnsafeCell<T>,
    // ... lock state
}

impl<T> MyMutex<T> {
    pub fn lock(&self) -> Guard<'_, T> {
        // acquire lock...

        // SAFETY: UnsafeCell allows this, lock ensures exclusivity
        Guard { data: unsafe { &mut *self.data.get() } }
    }
}
```

## Why This Is Always UB

The compiler assumes:
1. `&T` means no mutation will occur
2. Multiple `&T` can exist simultaneously
3. Optimizations can be made based on these assumptions

When you mutate through cast pointer:
1. Other `&T` references see inconsistent values
2. Compiler may cache/eliminate reads
3. Results are unpredictable

## Checklist

- [ ] Am I trying to mutate through `&`?
- [ ] Should I use `&mut` instead?
- [ ] Should I use `Cell`, `RefCell`, or `UnsafeCell`?
- [ ] Is the original type designed for interior mutability?

## Related Rules

- `safety-08`: Mutable return from immutable parameter is wrong
- `safety-02`: Verify safety invariants

---
id: ptr-06
original_id: G.UNS.PTR.03
level: G
impact: LOW
clippy: ptr_as_ptr
---

# Prefer pointer::cast Over `as` for Pointer Casting

## Summary

Use the `cast()` method instead of `as` for pointer type conversions. It's clearer and prevents accidental provenance loss.

## Rationale

- `cast()` only changes the pointed-to type, not pointer properties
- `as` can accidentally convert to integer and back, losing provenance
- `cast()` is more explicit about intent
- Better tooling support (clippy, miri)

## Bad Example

```rust
// DON'T: Use `as` for pointer casts
fn bad_cast(ptr: *const u8) -> *const i32 {
    ptr as *const i32  // Works, but less clear
}

// DON'T: Accidental provenance loss
fn bad_roundtrip(ptr: *const u8) -> *const u8 {
    let addr = ptr as usize;   // Converts to integer
    addr as *const u8          // Loses provenance information!
}

// DON'T: Multiple `as` casts in chain
fn bad_chain(ptr: *const u8) -> *mut i32 {
    ptr as *mut u8 as *mut i32  // Hard to follow
}
```

## Good Example

```rust
// DO: Use cast() for pointer type changes
fn good_cast(ptr: *const u8) -> *const i32 {
    ptr.cast::<i32>()
}

// DO: Use cast_mut() for const-to-mut (when valid)
fn good_cast_mut(ptr: *const u8) -> *mut u8 {
    ptr.cast_mut()  // Only use when mutation is valid!
}

// DO: Use cast_const() for mut-to-const
fn good_cast_const(ptr: *mut u8) -> *const u8 {
    ptr.cast_const()
}

// DO: Chain casts clearly
fn good_chain(ptr: *const u8) -> *mut i32 {
    ptr.cast_mut().cast::<i32>()
}

// DO: Use with_addr() for address manipulation (nightly)
#[cfg(feature = "strict_provenance")]
fn good_provenance(ptr: *const u8, new_addr: usize) -> *const u8 {
    ptr.with_addr(new_addr)  // Preserves provenance
}
```

## Pointer Method Reference

| Method | From | To | Notes |
|--------|------|-----|-------|
| `.cast::<U>()` | `*T` | `*U` | Changes pointee type |
| `.cast_mut()` | `*const T` | `*mut T` | Removes const |
| `.cast_const()` | `*mut T` | `*const T` | Adds const |
| `.addr()` | `*T` | `usize` | Gets address (nightly) |
| `.with_addr(usize)` | `*T` | `*T` | Changes address, keeps provenance |
| `.map_addr(fn)` | `*T` | `*T` | Transforms address |

## Provenance Considerations

```rust
// Provenance = permission to access memory

// BAD: Loses provenance
let ptr: *const u8 = &data as *const u8;
let addr = ptr as usize;
let ptr2 = addr as *const u8;  // ptr2 has no provenance!

// GOOD: Preserves provenance (nightly strict_provenance)
let ptr2 = ptr.with_addr(addr);  // Still has permission

// GOOD: Use expose/from_exposed when provenance must cross integer
let addr = ptr.expose_addr();  // "Expose" the provenance
let ptr2 = std::ptr::from_exposed_addr(addr);  // Recover it
```

## Checklist

- [ ] Am I using `as` where `cast()` would be clearer?
- [ ] Am I accidentally converting through `usize`?
- [ ] Do I need to preserve provenance?

## Related Rules

- `ptr-04`: Alignment considerations when casting
- `ptr-05`: Don't convert const to mut improperly

---
id: safety-01
original_id: P.UNS.SAS.01
level: P
impact: CRITICAL
clippy: panic_in_result_fn
---

# Be Aware of Memory Safety Issues from Panics

## Summary

Panics in unsafe code can leave data structures in an inconsistent state, leading to undefined behavior when the panic is caught.

## Rationale

When a panic occurs, Rust unwinds the stack and runs destructors. If unsafe code has partially modified data, the destructors may observe invalid state.

## Bad Example

```rust
// DON'T: Panic can leave Vec in invalid state
impl<T> MyVec<T> {
    pub fn push(&mut self, value: T) {
        if self.len == self.cap {
            self.grow();  // Might panic during allocation
        }

        unsafe {
            // If Clone::clone() panics after incrementing len,
            // drop will try to drop uninitialized memory
            self.len += 1;
            ptr::write(self.ptr.add(self.len - 1), value.clone());
        }
    }
}
```

## Good Example

```rust
// DO: Ensure panic safety by ordering operations correctly
impl<T> MyVec<T> {
    pub fn push(&mut self, value: T) {
        if self.len == self.cap {
            self.grow();
        }

        unsafe {
            // Write first, then increment len
            // If write somehow panics, len is still valid
            ptr::write(self.ptr.add(self.len), value);
            self.len += 1;  // Only increment after successful write
        }
    }
}

// DO: Use guards for complex operations
impl<T: Clone> MyVec<T> {
    pub fn extend_from_slice(&mut self, slice: &[T]) {
        self.reserve(slice.len());

        let mut guard = PanicGuard {
            vec: self,
            initialized: 0,
        };

        for item in slice {
            unsafe {
                ptr::write(guard.vec.ptr.add(guard.vec.len + guard.initialized), item.clone());
                guard.initialized += 1;
            }
        }

        // Success - update len and forget guard
        self.len += guard.initialized;
        std::mem::forget(guard);
    }
}

struct PanicGuard<'a, T> {
    vec: &'a mut MyVec<T>,
    initialized: usize,
}

impl<T> Drop for PanicGuard<'_, T> {
    fn drop(&mut self) {
        // Clean up partially initialized elements on panic
        unsafe {
            for i in 0..self.initialized {
                ptr::drop_in_place(self.vec.ptr.add(self.vec.len + i));
            }
        }
    }
}
```

## Key Patterns

1. **Update bookkeeping after operations**: Increment length only after writing
2. **Use panic guards**: RAII types that clean up on panic
3. **Order operations carefully**: Ensure invariants hold if panic occurs at any point

## Checklist

- [ ] What happens if this code panics at each line?
- [ ] Are all invariants maintained if we unwind from here?
- [ ] Do I need a panic guard for cleanup?

## Related Rules

- `safety-04`: Avoid double-free from panic safety issues
- `safety-02`: Verify safety invariants

---
id: safety-02
original_id: P.UNS.SAS.02
level: P
impact: CRITICAL
---

# Unsafe Code Authors Must Verify Safety Invariants

## Summary

When writing unsafe code, you are taking responsibility for upholding all safety invariants that the compiler normally enforces.

## Rationale

Unsafe blocks don't disable safety requirements - they transfer responsibility from the compiler to the programmer. You must manually verify what the compiler normally checks.

## Safety Invariants to Verify

1. **Pointer validity**: Non-null, aligned, points to valid memory
2. **Aliasing**: No mutable aliasing (two &mut to same memory)
3. **Initialization**: Memory is initialized before read
4. **Lifetime**: References don't outlive their referents
5. **Type validity**: Data matches the expected type's invariants
6. **Thread safety**: Proper synchronization for concurrent access

## Bad Example

```rust
// DON'T: Blindly trust inputs
unsafe fn process(ptr: *const Data, len: usize) {
    for i in 0..len {
        // No verification that ptr is valid or len is correct!
        let item = &*ptr.add(i);
        process_item(item);
    }
}
```

## Good Example

```rust
// DO: Document and verify invariants
/// Processes a slice of Data items.
///
/// # Safety
///
/// - `ptr` must be non-null and aligned for `Data`
/// - `ptr` must point to `len` consecutive initialized `Data` items
/// - The memory must not be mutated during this call
/// - `len * size_of::<Data>()` must not overflow `isize::MAX`
unsafe fn process(ptr: *const Data, len: usize) {
    debug_assert!(!ptr.is_null(), "ptr must not be null");
    debug_assert!(ptr.is_aligned(), "ptr must be aligned");

    for i in 0..len {
        // SAFETY: Caller guarantees ptr points to len valid items
        let item = &*ptr.add(i);
        process_item(item);
    }
}

// DO: Provide safe wrapper when possible
fn process_slice(data: &[Data]) {
    // SAFETY: slice guarantees all invariants
    unsafe { process(data.as_ptr(), data.len()) }
}
```

## Invariant Documentation Template

```rust
/// # Safety
///
/// The caller must ensure that:
/// - [List each invariant]
/// - [Explain why each matters]
```

## Checklist

- [ ] Have I listed all safety invariants?
- [ ] Can I prove each invariant holds at the call site?
- [ ] Have I added debug assertions where possible?
- [ ] Have I documented invariants in /// # Safety section?

## Related Rules

- `safety-09`: Add SAFETY comment before any unsafe block
- `safety-10`: Add Safety section in docs for public unsafe functions

---
id: safety-03
original_id: P.UNS.SAS.03
level: P
impact: CRITICAL
clippy: uninit_assumed_init
---

# Do Not Expose Uninitialized Memory in Public APIs

## Summary

Public APIs must never return or expose uninitialized memory to callers.

## Rationale

Reading uninitialized memory is undefined behavior in Rust. Safe code should never be able to access uninitialized memory through your API.

## Bad Example

```rust
// DON'T: Expose uninitialized memory
pub struct Buffer {
    data: [u8; 1024],
    len: usize,
}

impl Buffer {
    pub fn new() -> Self {
        // BAD: data is uninitialized
        unsafe {
            Self {
                data: std::mem::MaybeUninit::uninit().assume_init(),
                len: 0,
            }
        }
    }

    // BAD: Returns reference to potentially uninitialized data
    pub fn as_slice(&self) -> &[u8] {
        &self.data[..self.len]  // What if len > initialized portion?
    }
}
```

## Good Example

```rust
use std::mem::MaybeUninit;

// DO: Use MaybeUninit properly and only expose initialized data
pub struct Buffer {
    data: Box<[MaybeUninit<u8>; 1024]>,
    len: usize,  // Invariant: data[0..len] is initialized
}

impl Buffer {
    pub fn new() -> Self {
        Self {
            // MaybeUninit doesn't require initialization
            data: Box::new([MaybeUninit::uninit(); 1024]),
            len: 0,
        }
    }

    pub fn push(&mut self, byte: u8) {
        if self.len < 1024 {
            self.data[self.len].write(byte);
            self.len += 1;
        }
    }

    // Only returns initialized portion
    pub fn as_slice(&self) -> &[u8] {
        // SAFETY: self.len bytes are initialized (invariant)
        unsafe {
            std::slice::from_raw_parts(
                self.data.as_ptr() as *const u8,
                self.len
            )
        }
    }
}

impl Drop for Buffer {
    fn drop(&mut self) {
        // Only drop initialized elements
        // For u8 this is a no-op, but important for Drop types
    }
}
```

## Patterns for Uninitialized Memory

```rust
// Pattern 1: MaybeUninit for delayed initialization
let mut value: MaybeUninit<ExpensiveType> = MaybeUninit::uninit();
initialize_expensive(&mut value);
let value = unsafe { value.assume_init() };

// Pattern 2: Vec::with_capacity for growable buffers
let mut vec = Vec::with_capacity(100);
// vec.len() is 0, capacity is 100
// No uninitialized memory is accessible

// Pattern 3: Box::new_uninit (nightly)
let mut boxed = Box::<[u8; 1024]>::new_uninit();
boxed.write([0u8; 1024]);
let boxed = unsafe { boxed.assume_init() };
```

## Checklist

- [ ] Does my API ever return references to uninitialized memory?
- [ ] Are length/capacity invariants properly maintained?
- [ ] Is MaybeUninit used instead of transmute for uninitialized data?

## Related Rules

- `mem-06`: Use MaybeUninit<T> for uninitialized memory
- `safety-01`: Panic safety with partial initialization

---
id: safety-04
original_id: P.UNS.SAS.04
level: P
impact: CRITICAL
---

# Avoid Double-Free from Panic Safety Issues

## Summary

Ensure that resources are not freed twice, especially when panics can occur during operations.

## Rationale

Double-free is undefined behavior. Panics during unsafe operations can cause destructors to run on already-freed or partially-constructed data.

## Bad Example

```rust
// DON'T: Potential double-free on panic
impl<T> MyVec<T> {
    pub fn pop(&mut self) -> Option<T> {
        if self.len == 0 {
            None
        } else {
            self.len -= 1;
            unsafe {
                // If something panics after this read but before return,
                // Drop will try to drop this element again
                Some(ptr::read(self.ptr.add(self.len)))
            }
        }
    }
}

// DON'T: Double-free with ManuallyDrop misuse
fn bad_swap<T>(a: &mut T, b: &mut T) {
    unsafe {
        let tmp = ptr::read(a);
        ptr::write(a, ptr::read(b));  // If this panics, tmp leaks
        ptr::write(b, tmp);
    }
}
```

## Good Example

```rust
// DO: Use std::mem::take or swap
fn good_swap<T: Default>(a: &mut T, b: &mut T) {
    std::mem::swap(a, b);  // Safe and correct
}

// DO: Use ManuallyDrop for panic safety
use std::mem::ManuallyDrop;

impl<T> MyVec<T> {
    pub fn pop(&mut self) -> Option<T> {
        if self.len == 0 {
            None
        } else {
            self.len -= 1;  // Decrement first
            unsafe {
                // SAFETY: len was decremented, so this slot won't be
                // dropped again by Vec's Drop impl
                Some(ptr::read(self.ptr.add(self.len)))
            }
        }
    }
}

// DO: Use scopeguard or manual cleanup
fn safe_operation<T: Clone>(data: &mut [T], source: &[T]) {
    // Track what we've written for cleanup on panic
    let mut written = 0;

    let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
        for (i, item) in source.iter().enumerate() {
            data[i] = item.clone();
            written = i + 1;
        }
    }));

    if result.is_err() {
        // Clean up on panic (if T needs special handling)
        // In this case, safe code handles it automatically
    }
}
```

## Patterns to Avoid Double-Free

1. **Decrement length before reading**: Vec's Drop won't touch the read element
2. **Use ManuallyDrop**: Explicitly control when Drop runs
3. **Use std::mem::replace/swap**: Safe alternatives for move semantics
4. **Panic guards**: RAII cleanup on unwind

## Checklist

- [ ] After reading memory, is it marked as "moved"?
- [ ] Will Drop run on this memory? Should it?
- [ ] What happens if this code panics at each point?
- [ ] Are length/count bookkeeping updates ordered correctly?

## Related Rules

- `safety-01`: Panic safety in unsafe code
- `ptr-01`: Don't share raw pointers across threads

---
id: safety-05
original_id: P.UNS.SAS.05
level: P
impact: CRITICAL
clippy: non_send_fields_in_send_ty
---

# Consider Safety When Manually Implementing Auto Traits

## Summary

When manually implementing `Send` or `Sync`, you must ensure thread safety invariants are upheld.

## Rationale

`Send` and `Sync` are unsafe traits because incorrect implementations cause data races, which are undefined behavior. The compiler auto-implements them conservatively, but manual implementations require careful analysis.

## Trait Meanings

- **`Send`**: Safe to transfer ownership to another thread
- **`Sync`**: Safe to share references (`&T`) between threads (i.e., `&T: Send`)

## Bad Example

```rust
// DON'T: Unsafe Send/Sync without thread safety
struct NotThreadSafe {
    ptr: *mut i32,  // Raw pointers are not Send/Sync
}

// BAD: This is unsound!
unsafe impl Send for NotThreadSafe {}
unsafe impl Sync for NotThreadSafe {}

// DON'T: Rc-like type with unsafe Sync
struct MyRc<T> {
    ptr: *mut RcInner<T>,
}

struct RcInner<T> {
    count: usize,  // Not atomic!
    data: T,
}

// BAD: count is not atomic, concurrent access is UB
unsafe impl<T: Send> Sync for MyRc<T> {}
```

## Good Example

```rust
use std::sync::atomic::{AtomicUsize, Ordering};
use std::ptr::NonNull;

// DO: Use atomic operations for thread-safe reference counting
struct MyArc<T> {
    ptr: NonNull<ArcInner<T>>,
}

struct ArcInner<T> {
    count: AtomicUsize,  // Atomic for thread safety
    data: T,
}

// SAFETY: The data is behind atomic reference counting,
// and T: Send + Sync ensures the data itself is thread-safe
unsafe impl<T: Send + Sync> Send for MyArc<T> {}
unsafe impl<T: Send + Sync> Sync for MyArc<T> {}

// DO: Document why it's safe
/// A thread-safe wrapper around a raw file descriptor.
///
/// # Safety
///
/// The file descriptor is valid for the lifetime of this struct,
/// and file descriptors are safe to use from any thread.
struct ThreadSafeFd {
    fd: std::os::unix::io::RawFd,
}

// SAFETY: File descriptors are just integers and can be used
// from any thread. The actual I/O operations are thread-safe
// at the OS level.
unsafe impl Send for ThreadSafeFd {}
unsafe impl Sync for ThreadSafeFd {}
```

## Decision Tree

```
Does your type contain:
  - Raw pointers? → Probably not auto Send/Sync
  - Rc/RefCell? → Not Sync (Rc not Send either)
  - Cell/UnsafeCell? → Not Sync
  - Interior mutability? → Needs synchronization for Sync

To manually implement:
  - Send: Can another thread safely drop this?
  - Sync: Can multiple threads safely call &self methods?
```

## Checklist

- [ ] Does my type contain any non-Send/Sync fields?
- [ ] Is interior mutability properly synchronized (Mutex, atomic)?
- [ ] Would concurrent access cause data races?
- [ ] Have I documented why the implementation is safe?

## Related Rules

- `ptr-01`: Don't share raw pointers across threads
- `safety-02`: Verify safety invariants

---
id: safety-06
original_id: P.UNS.SAS.06
level: P
impact: HIGH
---

# Do Not Expose Raw Pointers in Public APIs

## Summary

Public APIs should use safe abstractions (references, slices, smart pointers) instead of exposing raw pointers.

## Rationale

Raw pointers bypass Rust's safety guarantees. Exposing them in public APIs forces users into unsafe code and makes it easy to create undefined behavior.

## Bad Example

```rust
// DON'T: Expose raw pointers in public API
pub struct Buffer {
    data: *mut u8,
    len: usize,
}

impl Buffer {
    // BAD: Returns raw pointer
    pub fn as_ptr(&self) -> *const u8 {
        self.data
    }

    // BAD: Takes raw pointer as input
    pub fn from_ptr(ptr: *mut u8, len: usize) -> Self {
        Self { data: ptr, len }
    }

    // BAD: Exposes internal pointer mutably
    pub fn as_mut_ptr(&mut self) -> *mut u8 {
        self.data
    }
}
```

## Good Example

```rust
// DO: Use safe abstractions
pub struct Buffer {
    data: Vec<u8>,
}

impl Buffer {
    // Returns a safe reference
    pub fn as_slice(&self) -> &[u8] {
        &self.data
    }

    // Takes safe input
    pub fn from_slice(data: &[u8]) -> Self {
        Self { data: data.to_vec() }
    }

    // Mutable access through safe reference
    pub fn as_mut_slice(&mut self) -> &mut [u8] {
        &mut self.data
    }
}

// DO: If raw pointers are needed, provide unsafe API with documentation
impl Buffer {
    /// Returns a pointer to the buffer's data.
    ///
    /// # Safety
    ///
    /// The pointer is valid for `self.len()` bytes and must not be
    /// used after the Buffer is dropped or reallocated.
    pub fn as_ptr(&self) -> *const u8 {
        self.data.as_ptr()
    }

    /// Creates a Buffer from a raw pointer.
    ///
    /// # Safety
    ///
    /// - `ptr` must point to `len` valid bytes
    /// - The memory must be allocated with the global allocator
    /// - Caller transfers ownership of the memory to Buffer
    pub unsafe fn from_raw_parts(ptr: *mut u8, len: usize, cap: usize) -> Self {
        Self {
            data: Vec::from_raw_parts(ptr, len, cap)
        }
    }
}
```

## Patterns for Safe Pointer APIs

```rust
// Pattern 1: Use NonNull for internal pointers
use std::ptr::NonNull;

pub struct MyBox<T> {
    ptr: NonNull<T>,  // Internal use only
}

impl<T> MyBox<T> {
    // Safe public API
    pub fn get(&self) -> &T {
        // SAFETY: ptr is always valid while MyBox exists
        unsafe { self.ptr.as_ref() }
    }
}

// Pattern 2: Callback-based access
impl Buffer {
    // User can work with pointer in controlled context
    pub fn with_ptr<F, R>(&self, f: F) -> R
    where
        F: FnOnce(*const u8, usize) -> R,
    {
        f(self.data.as_ptr(), self.data.len())
    }
}
```

## Checklist

- [ ] Can this API use references instead of pointers?
- [ ] Can this API use slices instead of pointer + length?
- [ ] If pointers are necessary, is the API marked `unsafe`?
- [ ] Are safety requirements documented?

## Related Rules

- `general-03`: Don't create aliases for unsafe items
- `safety-10`: Document safety requirements for public unsafe functions

---
id: safety-07
original_id: P.UNS.SAS.07
level: P
impact: MEDIUM
---

# Provide Unsafe Counterparts for Performance Alongside Safe Methods

## Summary

When providing performance-critical operations that skip safety checks, offer both a safe checked version and an unsafe unchecked version.

## Rationale

Users who need maximum performance can opt into unsafe, while others get safety by default. This follows the "safe by default, unsafe opt-in" principle.

## Bad Example

```rust
// DON'T: Only provide unsafe version
impl<T> MySlice<T> {
    /// Gets an element by index.
    ///
    /// # Safety
    /// Index must be in bounds.
    pub unsafe fn get(&self, index: usize) -> &T {
        &*self.ptr.add(index)
    }
}

// DON'T: Only provide checked version when performance matters
impl<T> MySlice<T> {
    pub fn get(&self, index: usize) -> Option<&T> {
        if index < self.len {
            Some(unsafe { &*self.ptr.add(index) })
        } else {
            None
        }
    }
    // Missing: get_unchecked for performance-critical code
}
```

## Good Example

```rust
// DO: Provide both versions
impl<T> MySlice<T> {
    /// Gets an element by index, returning `None` if out of bounds.
    #[inline]
    pub fn get(&self, index: usize) -> Option<&T> {
        if index < self.len {
            // SAFETY: We just verified index < len
            Some(unsafe { self.get_unchecked(index) })
        } else {
            None
        }
    }

    /// Gets an element by index without bounds checking.
    ///
    /// # Safety
    ///
    /// Calling this method with an out-of-bounds index is undefined behavior.
    #[inline]
    pub unsafe fn get_unchecked(&self, index: usize) -> &T {
        debug_assert!(index < self.len, "index out of bounds");
        &*self.ptr.add(index)
    }

    /// Gets an element, panicking if out of bounds.
    #[inline]
    pub fn get_or_panic(&self, index: usize) -> &T {
        assert!(index < self.len, "index {} out of bounds for len {}", index, self.len);
        // SAFETY: We just asserted index < len
        unsafe { self.get_unchecked(index) }
    }
}
```

## Standard Library Patterns

| Safe Method | Unsafe Counterpart |
|-------------|-------------------|
| `slice.get(i)` | `slice.get_unchecked(i)` |
| `str.chars().nth(i)` | `str.get_unchecked(range)` |
| `vec.pop()` | `vec.set_len()` + `ptr::read` |
| `String::from_utf8()` | `String::from_utf8_unchecked()` |

## Naming Conventions

- Safe: `method_name()`
- Unsafe: `method_name_unchecked()`
- Or: `get()` vs `get_unchecked()`

## Checklist

- [ ] Does my safe method have an unsafe counterpart for hot paths?
- [ ] Does my unsafe method have a safe alternative for normal use?
- [ ] Are both methods documented with their trade-offs?
- [ ] Does the unsafe version include debug assertions?

## Related Rules

- `general-02`: Don't blindly use unsafe for performance
- `safety-09`: Add SAFETY comments

---
id: safety-08
original_id: P.UNS.SAS.08
level: P
impact: CRITICAL
clippy: mut_from_ref
---

# Mutable Return from Immutable Parameter is Wrong

## Summary

A function taking `&self` or `&T` must not return `&mut T` to the same data without interior mutability.

## Rationale

Returning `&mut` from `&` violates Rust's aliasing rules. The caller has an immutable borrow, so they can create additional `&` references. Returning `&mut` creates mutable aliasing, which is undefined behavior.

## Bad Example

```rust
// DON'T: Return &mut from &self
struct Container {
    data: i32,
}

impl Container {
    // WRONG: This is undefined behavior!
    pub fn get_mut(&self) -> &mut i32 {
        unsafe {
            // Creating &mut from & is ALWAYS wrong
            &mut *(&self.data as *const i32 as *mut i32)
        }
    }
}

// DON'T: Transmute & to &mut
fn bad_transmute<T>(reference: &T) -> &mut T {
    unsafe { std::mem::transmute(reference) }  // UB!
}
```

## Good Example

```rust
use std::cell::{Cell, RefCell, UnsafeCell};

// DO: Use interior mutability types
struct Container {
    data: Cell<i32>,          // For Copy types
    complex: RefCell<String>, // For non-Copy with runtime checks
}

impl Container {
    pub fn get(&self) -> i32 {
        self.data.get()
    }

    pub fn set(&self, value: i32) {
        self.data.set(value);
    }

    pub fn modify_complex(&self, f: impl FnOnce(&mut String)) {
        f(&mut self.complex.borrow_mut());
    }
}

// DO: Use UnsafeCell for custom interior mutability
struct MyMutex<T> {
    locked: std::sync::atomic::AtomicBool,
    data: UnsafeCell<T>,
}

impl<T> MyMutex<T> {
    pub fn lock(&self) -> MutexGuard<'_, T> {
        // Acquire lock...
        MutexGuard { mutex: self }
    }
}

struct MutexGuard<'a, T> {
    mutex: &'a MyMutex<T>,
}

impl<T> std::ops::DerefMut for MutexGuard<'_, T> {
    fn deref_mut(&mut self) -> &mut T {
        // SAFETY: We hold the lock, so exclusive access is guaranteed
        unsafe { &mut *self.mutex.data.get() }
    }
}
```

## The Only Valid Pattern

The ONLY way to get `&mut` from `&` is through `UnsafeCell`:

```rust
use std::cell::UnsafeCell;

struct ValidInteriorMut {
    data: UnsafeCell<i32>,
}

impl ValidInteriorMut {
    // This is sound ONLY because UnsafeCell opts out of aliasing rules
    // AND we guarantee exclusive access (e.g., through a lock)
    pub fn get_mut(&self) -> &mut i32 {
        // Must ensure no other references exist!
        unsafe { &mut *self.data.get() }
    }
}
```

## Checklist

- [ ] Am I trying to return &mut from a & method?
- [ ] If yes, am I using UnsafeCell or a type built on it?
- [ ] Am I guaranteeing exclusive access before creating &mut?
- [ ] Would Cell, RefCell, or Mutex solve my problem safely?

## Related Rules

- `ptr-05`: Don't manually convert *const to *mut
- `safety-02`: Verify safety invariants

---
id: safety-09
original_id: P.UNS.SAS.09
level: P
impact: CRITICAL
clippy: undocumented_unsafe_blocks
---

# Add SAFETY Comment Before Any Unsafe Block

## Summary

Every `unsafe` block or `unsafe impl` must have a `// SAFETY:` comment explaining why the operation is safe.

## Rationale

SAFETY comments force the author to think about invariants and help reviewers verify correctness. They serve as documentation for future maintainers.

## Bad Example

```rust
// DON'T: Unsafe without explanation
fn get_unchecked(slice: &[i32], index: usize) -> i32 {
    unsafe { *slice.get_unchecked(index) }
}

// DON'T: Vague or unhelpful comments
fn bad_comments(ptr: *const i32) -> i32 {
    // This is unsafe
    unsafe { *ptr }

    // Trust me
    unsafe { *ptr }

    // Safe because I know what I'm doing
    unsafe { *ptr }
}
```

## Good Example

```rust
// DO: Explain the safety invariant
fn get_unchecked(slice: &[i32], index: usize) -> i32 {
    // SAFETY: Caller guarantees index < slice.len()
    unsafe { *slice.get_unchecked(index) }
}

// DO: Be specific about what makes it safe
fn read_header(buffer: &[u8]) -> Header {
    assert!(buffer.len() >= std::mem::size_of::<Header>());

    // SAFETY:
    // - buffer.len() >= size_of::<Header>() (asserted above)
    // - buffer is aligned for u8, which is compatible with any alignment
    // - Header is #[repr(C)] and has no padding requirements
    unsafe {
        std::ptr::read_unaligned(buffer.as_ptr() as *const Header)
    }
}

// DO: Document unsafe impl
struct MySendType(*mut i32);

// SAFETY: The pointer is to thread-local storage that is only accessed
// from the owning thread. MySendType is only sent when the TLS slot
// is being transferred between threads with proper synchronization.
unsafe impl Send for MySendType {}

// DO: Multi-line for complex invariants
fn complex_operation(data: &mut [u8], ranges: &[(usize, usize)]) {
    for &(start, end) in ranges {
        // SAFETY:
        // 1. All ranges were validated to be within data.len()
        //    in the calling function `validate_ranges()`
        // 2. Ranges are non-overlapping (invariant of RangeSet)
        // 3. We have &mut access to data, so no aliasing
        unsafe {
            let ptr = data.as_mut_ptr().add(start);
            std::ptr::write_bytes(ptr, 0, end - start);
        }
    }
}
```

## SAFETY Comment Format

```rust
// SAFETY: <brief explanation>

// Or for complex cases:
// SAFETY:
// - Invariant 1: explanation
// - Invariant 2: explanation
// - Why this is upheld: explanation
```

## What to Include

1. **What invariants must hold** for this to be safe
2. **Why those invariants hold** at this specific call site
3. **What could go wrong** if the invariants were violated (optional but helpful)

## Clippy Configuration

```toml
# clippy.toml
accept-comment-above-statement = true
accept-comment-above-attributes = true
```

## Checklist

- [ ] Does every unsafe block have a SAFETY comment?
- [ ] Does the comment explain WHY it's safe, not just WHAT it does?
- [ ] Are all relevant invariants mentioned?
- [ ] Would a reviewer understand the safety argument?

## Related Rules

- `safety-02`: Verify safety invariants
- `safety-10`: Add Safety section in docs for public unsafe functions

---
id: safety-10
original_id: G.UNS.SAS.01
level: G
impact: HIGH
clippy: missing_safety_doc
---

# Add Safety Section in Docs for Public Unsafe Functions

## Summary

Public `unsafe` functions must have a `# Safety` section in their documentation explaining the caller's obligations.

## Rationale

Unlike SAFETY comments (which explain why an unsafe block is sound), `# Safety` docs tell callers what they must guarantee. Without this, users cannot safely call the function.

## Bad Example

```rust
// DON'T: Unsafe function without safety docs
pub unsafe fn process_buffer(ptr: *const u8, len: usize) {
    // ...
}

// DON'T: Safety docs that don't explain requirements
/// Processes a buffer.
///
/// This function is unsafe.  // Not helpful!
pub unsafe fn process_buffer(ptr: *const u8, len: usize) {
    // ...
}
```

## Good Example

```rust
/// Processes a buffer of bytes.
///
/// # Safety
///
/// The caller must ensure that:
///
/// - `ptr` is non-null and properly aligned for `u8`
/// - `ptr` points to at least `len` consecutive, initialized bytes
/// - The memory referenced by `ptr` is not mutated during this call
/// - `len` does not exceed `isize::MAX`
///
/// # Examples
///
/// ```
/// let data = [1u8, 2, 3, 4];
/// // SAFETY: data is a valid slice, we pass its pointer and length
/// unsafe { process_buffer(data.as_ptr(), data.len()) };
/// ```
pub unsafe fn process_buffer(ptr: *const u8, len: usize) {
    // ...
}

/// Creates a `Vec<T>` from raw parts.
///
/// # Safety
///
/// This is highly unsafe due to the number of invariants that must
/// be upheld by the caller:
///
/// * `ptr` must have been allocated via the global allocator
/// * `T` must have the same alignment as the original allocation
/// * `capacity` must be the capacity the pointer was allocated with
/// * `length` must be less than or equal to `capacity`
/// * The first `length` values must be properly initialized
/// * The allocated memory must not be used elsewhere
///
/// Violating these may cause undefined behavior including
/// use-after-free, double-free, and memory corruption.
pub unsafe fn from_raw_parts(ptr: *mut T, length: usize, capacity: usize) -> Vec<T> {
    // ...
}
```

## Safety Documentation Template

```rust
/// Brief description of what the function does.
///
/// # Safety
///
/// The caller must ensure that:
///
/// - Requirement 1: detailed explanation
/// - Requirement 2: detailed explanation
///
/// # Panics (if applicable)
///
/// Panics if...
///
/// # Examples
///
/// ```
/// // SAFETY: explanation of why this call is safe
/// unsafe { function_name(...) };
/// ```
```

## What to Document

| Category | Example |
|----------|---------|
| Pointer validity | "ptr must be non-null and aligned" |
| Memory state | "must point to initialized memory" |
| Aliasing | "no other references to this memory may exist" |
| Lifetime | "pointer must be valid for the duration of the call" |
| Thread safety | "must not be called concurrently with..." |
| Invariants | "len must not exceed isize::MAX" |

## Checklist

- [ ] Does the function have a `# Safety` section?
- [ ] Are ALL caller obligations listed?
- [ ] Is each requirement specific and verifiable?
- [ ] Does the example show correct usage with SAFETY comment?

## Related Rules

- `safety-09`: SAFETY comments for unsafe blocks
- `safety-02`: Verify safety invariants

---
id: safety-11
original_id: G.UNS.SAS.02
level: G
impact: MEDIUM
clippy: debug_assert_with_mut_call
---

# Use assert! Instead of debug_assert! in Unsafe Functions

## Summary

In `unsafe` functions or functions containing unsafe blocks, prefer `assert!` over `debug_assert!` for checking safety invariants.

## Rationale

`debug_assert!` is compiled out in release builds. If an invariant is important enough to check for safety, it should be checked in all builds to catch violations.

## Bad Example

```rust
// DON'T: Use debug_assert for safety-critical checks
pub unsafe fn get_unchecked(slice: &[i32], index: usize) -> &i32 {
    debug_assert!(index < slice.len());  // Gone in release!
    &*slice.as_ptr().add(index)
}

// DON'T: Rely on debug_assert for FFI safety
pub unsafe fn call_c_function(ptr: *const Data) {
    debug_assert!(!ptr.is_null());  // Won't catch bugs in release
    ffi::process_data(ptr);
}
```

## Good Example

```rust
// DO: Use assert! for safety checks (when performance allows)
pub unsafe fn get_unchecked(slice: &[i32], index: usize) -> &i32 {
    assert!(index < slice.len(), "index {} out of bounds for len {}", index, slice.len());
    &*slice.as_ptr().add(index)
}

// DO: Use debug_assert when CALLER is responsible
/// # Safety
/// index must be less than slice.len()
pub unsafe fn get_unchecked_fast(slice: &[i32], index: usize) -> &i32 {
    // Caller is responsible; debug_assert just helps catch bugs during development
    debug_assert!(index < slice.len());
    &*slice.as_ptr().add(index)
}

// DO: Use assert for internal safety, debug_assert for caller obligations
pub fn get_checked(slice: &[i32], index: usize) -> Option<&i32> {
    if index < slice.len() {
        // SAFETY: We just checked index < len
        // debug_assert is fine here because the if-check is the real guard
        Some(unsafe {
            debug_assert!(index < slice.len()); // Redundant, just for documentation
            &*slice.as_ptr().add(index)
        })
    } else {
        None
    }
}
```

## When to Use Each

| Assertion | Use When |
|-----------|----------|
| `assert!` | Invariant is not already checked; function is called with untrusted input |
| `debug_assert!` | Invariant is the caller's responsibility (documented in `# Safety`); performance-critical |
| No assert | Invariant is enforced by types or prior checks in the same function |

## Hybrid Approach

```rust
// Use cfg to have both safety and performance
pub unsafe fn process(slice: &[u8], index: usize) {
    // Always check in tests and debug
    #[cfg(any(test, debug_assertions))]
    assert!(index < slice.len());

    // Optional: paranoid mode for production
    #[cfg(feature = "paranoid")]
    assert!(index < slice.len());

    // SAFETY: Caller guarantees index < len (checked in debug)
    let ptr = slice.as_ptr().add(index);
    // ...
}
```

## Checklist

- [ ] Is this a safety-critical invariant?
- [ ] Who is responsible for upholding it (caller or this function)?
- [ ] Can the assertion be optimized away when provably true?
- [ ] What's the performance impact of the assertion?

## Related Rules

- `safety-02`: Verify safety invariants
- `safety-09`: SAFETY comments

---
id: union-01
original_id: P.UNS.UNI.01
level: P
impact: HIGH
---

# Avoid Union Except for C Interop

## Summary

Only use `union` for FFI with C code. For Rust-only code, use `enum` with explicit tags.

## Rationale

- Unions require unsafe to read (any field access is unsafe)
- Easy to read wrong field, causing undefined behavior
- Enums are type-safe and the compiler tracks the active variant
- Unions don't run destructors properly

## Bad Example

```rust
// DON'T: Use union for space optimization in Rust-only code
union IntOrFloat {
    i: i32,
    f: f32,
}

fn bad_usage() {
    let mut u = IntOrFloat { i: 42 };

    // BAD: Reading wrong field is UB
    let f = unsafe { u.f };  // UB if i was the last written field
}

// DON'T: Use union for variant types
union Variant {
    string: std::mem::ManuallyDrop<String>,
    number: i64,
}

// Problems:
// 1. Must manually track which variant is active
// 2. Must manually call drop on String variant
// 3. Easy to have memory leaks or double-free
```

## Good Example

```rust
// DO: Use enum for variant types in Rust
enum Variant {
    String(String),
    Number(i64),
}

// Compiler tracks active variant, runs correct destructor

// DO: Use union only for C FFI
#[repr(C)]
union CUnion {
    i: i32,
    f: f32,
}

// When interfacing with C code that uses this union
extern "C" {
    fn c_function_returns_union() -> CUnion;
    fn c_function_takes_union(u: CUnion);
}

// DO: Wrap in safe API with explicit variant tracking
#[repr(C)]
pub struct SafeUnion {
    tag: u8,
    data: CUnion,
}

impl SafeUnion {
    pub fn as_int(&self) -> Option<i32> {
        if self.tag == 0 {
            // SAFETY: Tag indicates integer variant is active
            Some(unsafe { self.data.i })
        } else {
            None
        }
    }
}
```

## When Union Is Appropriate

1. **C FFI**: Matching C union layout for interoperability
2. **MaybeUninit**: The standard library uses union internally
3. **Very low-level optimization**: Only after profiling and careful safety analysis

## Alternatives to Union

| Use Case | Instead of Union | Use |
|----------|-----------------|-----|
| Variant types | union + tag | `enum` |
| Optional value | union + bool | `Option<T>` |
| Type punning | union | `transmute` or `from_ne_bytes` |
| Uninitialized memory | union | `MaybeUninit<T>` |

## Checklist

- [ ] Is this for C FFI? If not, use enum
- [ ] If union is necessary, is there a tag tracking active variant?
- [ ] Are destructors handled correctly for Drop types?
- [ ] Is the union #[repr(C)] for FFI?

## Related Rules

- `union-02`: Don't use union variants across lifetimes
- `ffi-13`: Ensure consistent data layout

---
id: union-02
original_id: P.UNS.UNI.02
level: P
impact: CRITICAL
---

# Do Not Use Union Variants Across Different Lifetimes

## Summary

Do not write to one union field and read from another field that has a different lifetime or references data with a different lifetime.

## Rationale

Union fields share the same memory. If one field stores a reference with lifetime `'a` and you read it as a reference with lifetime `'b`, you bypass lifetime checking and can create dangling references.

## Bad Example

```rust
// DON'T: Extend lifetime through union
union LifetimeBypass<'a, 'b> {
    short: &'a str,
    long: &'b str,
}

fn bad_lifetime_extension<'a, 'b>(short: &'a str) -> &'b str {
    let u = LifetimeBypass { short };
    // BAD: Reading with different lifetime is UB
    unsafe { u.long }
}

fn exploit() {
    let long_ref: &'static str;
    {
        let temp = String::from("temporary");
        // Extend local reference to 'static - dangling pointer!
        long_ref = bad_lifetime_extension(&temp);
    }
    // temp is dropped, long_ref is dangling
    println!("{}", long_ref);  // UB: use after free
}
```

## Good Example

```rust
// DO: Use same lifetime for all reference fields
union SafeUnion<'a> {
    str_ref: &'a str,
    bytes_ref: &'a [u8],
}

fn safe_conversion<'a>(s: &'a str) -> &'a [u8] {
    let u = SafeUnion { str_ref: s };
    // SAFETY: Both fields have same lifetime 'a
    // AND str and [u8] have compatible representations
    unsafe { u.bytes_ref }
}

// Better: Just use as_bytes()
fn better_conversion(s: &str) -> &[u8] {
    s.as_bytes()
}

// DO: Use MaybeUninit for delayed initialization, not lifetime tricks
use std::mem::MaybeUninit;

fn delayed_init<T>(init: impl FnOnce() -> T) -> T {
    let mut value: MaybeUninit<T> = MaybeUninit::uninit();
    value.write(init());
    unsafe { value.assume_init() }
}
```

## Why This Is Dangerous

The Rust lifetime system prevents use-after-free by tracking how long references are valid. Unions can subvert this:

```
Memory: [pointer to "hello"]

Union as 'short: points to stack memory (valid during function)
Union as 'long:  claims to point to valid memory forever

Reality: After function returns, pointer is dangling
```

## Safe Union Patterns

```rust
// Pattern 1: All fields have same lifetime
union SameLifetime<'a, T, U> {
    a: &'a T,
    b: &'a U,
}

// Pattern 2: No references at all
#[repr(C)]
union NoRefs {
    i: i32,
    f: f32,
}

// Pattern 3: Use ManuallyDrop for owned values (careful with Drop!)
union OwnedUnion {
    s: std::mem::ManuallyDrop<String>,
    v: std::mem::ManuallyDrop<Vec<u8>>,
}
```

## Checklist

- [ ] Do all reference fields have the same lifetime parameter?
- [ ] Am I trying to extend a lifetime through union? (If yes, stop!)
- [ ] For owned types, am I handling Drop correctly?

## Related Rules

- `union-01`: Avoid union except for C interop
- `safety-02`: Verify safety invariants

