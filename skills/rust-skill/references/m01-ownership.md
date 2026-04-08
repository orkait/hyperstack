# m01-ownership

# Ownership & Lifetimes - Agent Integration

> **Skill:** m01-ownership
> **Agent:** ownership-analyzer

## Quick Reference

This skill handles ownership, borrowing, and lifetime issues in Rust. When complex ownership problems arise, it can delegate to the ownership-analyzer agent for deep analysis.

## When to Use Agent

Use the agent when:
- Ownership errors persist after 2-3 fix attempts
- Complex lifetime relationships need analysis
- Design-level ownership decisions are needed
- Multiple interrelated ownership issues exist

## Agent Invocation

```
Task(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: <read from ../../agents/ownership-analyzer.md>
)
```

## Error Code → Agent Mapping

| Error Code | Description | Agent Helps With |
|------------|-------------|------------------|
| E0382 | Value moved | Ownership design analysis |
| E0597 | Borrow outlives owner | Lifetime relationship analysis |
| E0506 | Cannot assign while borrowed | Aliasing violation resolution |
| E0507 | Cannot move out of borrowed | Reference vs ownership design |
| E0515 | Cannot return local reference | Lifetime scope analysis |
| E0716 | Temporary value dropped | Scope boundary analysis |
| E0106 | Missing lifetime parameter | Lifetime annotation guidance |

## Workflow

### Inline Mode (No Agent)
1. Identify error code
2. Apply quick fix from skill reference
3. Validate with compiler

### Agent Mode (Complex Issues)
1. Identify persistent or complex issue
2. Invoke ownership-analyzer agent
3. Agent performs deep analysis
4. Agent suggests design-level solutions
5. Apply recommended changes
6. Validate with compiler

## Example: Strike 3 Escalation

```
Attempt 1: Add .clone()
    ↓ Still errors
Attempt 2: Change to reference
    ↓ Still errors
Attempt 3: Invoke agent
    ↓
Agent analyzes design
    ↓
Agent suggests Arc<T> for shared ownership
    ↓
Apply solution
    ↓
Success!
```

## Agent Output Format

The agent provides:
- **Problem Analysis**: What's wrong and why
- **Root Cause**: Design issue vs implementation issue
- **Recommended Fix**: Code changes with explanation
- **Trade-offs**: Pros and cons of approach
- **Alternatives**: Other possible solutions

## Related Agents

- **error-handling-expert**: For Result/Option lifetime issues
- **concurrency-expert**: For Send/Sync ownership issues
- **refactor-assistant**: For ownership-related refactoring

## Success Criteria

Agent invocation is successful when:
1. Root cause is identified (not just symptoms)
2. Fix aligns with design intent
3. Trade-offs are clearly explained
4. Code compiles and tests pass
5. Solution is maintainable

---
name: m01-ownership
description: "CRITICAL: Use for ownership/borrow/lifetime issues. Triggers: E0382, E0597, E0506, E0507, E0515, E0716, E0106, value moved, borrowed value does not live long enough, cannot move out of, use of moved value, ownership, borrow, lifetime, 'a, 'static, move, clone, Copy, 所有权, 借用, 生命周期"
user-invocable: false
---

# Ownership & Lifetimes

> **Layer 1: Language Mechanics**

## Core Question

**Who should own this data, and for how long?**

Before fixing ownership errors, understand the data's role:
- Is it shared or exclusive?
- Is it short-lived or long-lived?
- Is it transformed or just read?

---

## Error → Design Question

| Error | Don't Just Say | Ask Instead |
|-------|----------------|-------------|
| E0382 | "Clone it" | Who should own this data? |
| E0597 | "Extend lifetime" | Is the scope boundary correct? |
| E0506 | "End borrow first" | Should mutation happen elsewhere? |
| E0507 | "Clone before move" | Why are we moving from a reference? |
| E0515 | "Return owned" | Should caller own the data? |
| E0716 | "Bind to variable" | Why is this temporary? |
| E0106 | "Add 'a" | What is the actual lifetime relationship? |

---

## Thinking Prompt

Before fixing an ownership error, ask:

1. **What is this data's domain role?**
   - Entity (unique identity) → owned
   - Value Object (interchangeable) → clone/copy OK
   - Temporary (computation result) → maybe restructure

2. **Is the ownership design intentional?**
   - By design → work within constraints
   - Accidental → consider redesign

3. **Fix symptom or redesign?**
   - If Strike 3 (3rd attempt) → escalate to Layer 2

---

## Trace Up ↑

When errors persist, trace to design layer:

```
E0382 (moved value)
    ↑ Ask: What design choice led to this ownership pattern?
    ↑ Check: m09-domain (is this Entity or Value Object?)
    ↑ Check: domain-* (what constraints apply?)
```

| Persistent Error | Trace To | Question |
|-----------------|----------|----------|
| E0382 repeated | m02-resource | Should use Arc/Rc for sharing? |
| E0597 repeated | m09-domain | Is scope boundary at right place? |
| E0506/E0507 | m03-mutability | Should use interior mutability? |

---

## Trace Down ↓

From design decisions to implementation:

```
"Data needs to be shared immutably"
    ↓ Use: Arc<T> (multi-thread) or Rc<T> (single-thread)

"Data needs exclusive ownership"
    ↓ Use: move semantics, take ownership

"Data is read-only view"
    ↓ Use: &T (immutable borrow)
```

---

## Quick Reference

| Pattern | Ownership | Cost | Use When |
|---------|-----------|------|----------|
| Move | Transfer | Zero | Caller doesn't need data |
| `&T` | Borrow | Zero | Read-only access |
| `&mut T` | Exclusive borrow | Zero | Need to modify |
| `clone()` | Duplicate | Alloc + copy | Actually need a copy |
| `Rc<T>` | Shared (single) | Ref count | Single-thread sharing |
| `Arc<T>` | Shared (multi) | Atomic ref count | Multi-thread sharing |
| `Cow<T>` | Clone-on-write | Alloc if mutated | Might modify |

## Error Code Reference

| Error | Cause | Quick Fix |
|-------|-------|-----------|
| E0382 | Value moved | Clone, reference, or redesign ownership |
| E0597 | Reference outlives owner | Extend owner scope or restructure |
| E0506 | Assign while borrowed | End borrow before mutation |
| E0507 | Move out of borrowed | Clone or use reference |
| E0515 | Return local reference | Return owned value |
| E0716 | Temporary dropped | Bind to variable |
| E0106 | Missing lifetime | Add `'a` annotation |

---

## Anti-Patterns

| Anti-Pattern | Why Bad | Better |
|--------------|---------|--------|
| `.clone()` everywhere | Hides design issues | Design ownership properly |
| Fight borrow checker | Increases complexity | Work with the compiler |
| `'static` for everything | Restricts flexibility | Use appropriate lifetimes |
| Leak with `Box::leak` | Memory leak | Proper lifetime design |

---

## Related Skills

| When | See |
|------|-----|
| Need smart pointers | m02-resource |
| Need interior mutability | m03-mutability |
| Data is domain entity | m09-domain |
| Learning ownership concepts | m14-mental-model |

# Ownership: Comparison with Other Languages

## Rust vs C++

### Memory Management

| Aspect | Rust | C++ |
|--------|------|-----|
| Default | Move semantics | Copy semantics (pre-C++11) |
| Move | `let b = a;` (a invalidated) | `auto b = std::move(a);` (a valid but unspecified) |
| Copy | `let b = a.clone();` | `auto b = a;` |
| Safety | Compile-time enforcement | Runtime responsibility |

### Rust Move vs C++ Move

```rust
// Rust: after move, 'a' is INVALID
let a = String::from("hello");
let b = a;  // a moved
// println!("{}", a);  // COMPILE ERROR

// Equivalent in C++:
// std::string a = "hello";
// std::string b = std::move(a);
// std::cout << a;  // UNDEFINED (compiles but buggy)
```

### Smart Pointers

| Rust | C++ | Purpose |
|------|-----|---------|
| `Box<T>` | `std::unique_ptr<T>` | Unique ownership |
| `Rc<T>` | `std::shared_ptr<T>` | Shared ownership |
| `Arc<T>` | `std::shared_ptr<T>` + atomic | Thread-safe shared |
| `RefCell<T>` | (manual runtime checks) | Interior mutability |

---

## Rust vs Go

### Memory Model

| Aspect | Rust | Go |
|--------|------|-----|
| Memory | Stack + heap, explicit | GC manages all |
| Ownership | Enforced at compile-time | None (GC handles) |
| Null | `Option<T>` | `nil` for pointers |
| Concurrency | `Send`/`Sync` traits | Channels (less strict) |

### Sharing Data

```rust
// Rust: explicit about sharing
use std::sync::Arc;
let data = Arc::new(vec![1, 2, 3]);
let data_clone = Arc::clone(&data);
std::thread::spawn(move || {
    println!("{:?}", data_clone);
});

// Go: implicit sharing
// data := []int{1, 2, 3}
// go func() {
//     fmt.Println(data)  // potential race condition
// }()
```

### Why No GC in Rust

1. **Deterministic destruction**: Resources freed exactly when scope ends
2. **Zero-cost**: No GC pauses or overhead
3. **Embeddable**: Works in OS kernels, embedded systems
4. **Predictable latency**: Critical for real-time systems

---

## Rust vs Java/C#

### Reference Semantics

| Aspect | Rust | Java/C# |
|--------|------|---------|
| Objects | Owned by default | Reference by default |
| Null | `Option<T>` | `null` (nullable) |
| Immutability | Default | Must use `final`/`readonly` |
| Copy | Explicit `.clone()` | Reference copy (shallow) |

### Comparison

```rust
// Rust: clear ownership
fn process(data: Vec<i32>) {  // takes ownership
    // data is ours, will be freed at end
}

let numbers = vec![1, 2, 3];
process(numbers);
// numbers is invalid here

// Java: ambiguous ownership
// void process(List<Integer> data) {
//     // Who owns data? Caller? Callee? Both?
//     // Can caller still use it?
// }
```

---

## Rust vs Python

### Memory Model

| Aspect | Rust | Python |
|--------|------|--------|
| Typing | Static, compile-time | Dynamic, runtime |
| Memory | Ownership-based | Reference counting + GC |
| Mutability | Default immutable | Default mutable |
| Performance | Native, zero-cost | Interpreted, higher overhead |

### Common Pattern Translation

```rust
// Rust: borrowing iteration
let items = vec!["a", "b", "c"];
for item in &items {
    println!("{}", item);
}
// items still usable

// Python: iteration doesn't consume
// items = ["a", "b", "c"]
// for item in items:
//     print(item)
// items still usable (different reason - ref counting)
```

---

## Unique Rust Concepts

### Concepts Other Languages Lack

1. **Borrow Checker**: No other mainstream language has compile-time borrow checking
2. **Lifetimes**: Explicit annotation of reference validity
3. **Move by Default**: Values move, not copy
4. **No Null**: `Option<T>` instead of null pointers
5. **Affine Types**: Values can be used at most once

### Learning Curve Areas

| Concept | Coming From | Key Insight |
|---------|-------------|-------------|
| Ownership | GC languages | Think about who "owns" data |
| Borrowing | C/C++ | Like references but checked |
| Lifetimes | Any | Explicit scope of validity |
| Move | C++ | Move is default, not copy |

---

## Mental Model Shifts

### From GC Languages (Java, Go, Python)

```
Before: "Memory just works, GC handles it"
After:  "I explicitly decide who owns data and when it's freed"
```

Key shifts:
- Think about ownership at design time
- Returning references requires lifetime thinking
- No more `null` - use `Option<T>`

### From C/C++

```
Before: "I manually manage memory and hope I get it right"
After:  "Compiler enforces correctness, I fight the borrow checker"
```

Key shifts:
- Trust the compiler's errors
- Move is the default (unlike C++ copy)
- Smart pointers are idiomatic, not overhead

### From Functional Languages (Haskell, ML)

```
Before: "Everything is immutable, copying is fine"
After:  "Mutability is explicit, ownership prevents aliasing"
```

Key shifts:
- Mutability is safe because of ownership rules
- No persistent data structures needed (usually)
- Performance characteristics are explicit

---

## Performance Trade-offs

| Language | Memory Overhead | Latency | Throughput |
|----------|-----------------|---------|------------|
| Rust | Minimal (no GC) | Predictable | Excellent |
| C++ | Minimal | Predictable | Excellent |
| Go | GC overhead | GC pauses | Good |
| Java | GC overhead | GC pauses | Good |
| Python | High (ref counting + GC) | Variable | Lower |

### When Rust Ownership Wins

1. **Real-time systems**: No GC pauses
2. **Embedded**: No runtime overhead
3. **High-performance**: Zero-cost abstractions
4. **Concurrent**: Data races prevented at compile time

### When GC Might Be Preferable

1. **Rapid prototyping**: Less mental overhead
2. **Complex object graphs**: Cycles are tricky in Rust
3. **GUI applications**: Object lifetimes are dynamic
4. **Small programs**: Overhead doesn't matter

# Ownership Best Practices

## API Design Patterns

### 1. Prefer Borrowing Over Ownership

```rust
// BAD: takes ownership unnecessarily
fn print_name(name: String) {
    println!("Name: {}", name);
}

// GOOD: borrows instead
fn print_name(name: &str) {
    println!("Name: {}", name);
}

// Caller benefits:
let name = String::from("Alice");
print_name(&name);  // can reuse name
print_name(&name);  // still valid
```

### 2. Return Owned Values from Constructors

```rust
// GOOD: return owned value
impl User {
    fn new(name: &str) -> Self {
        User {
            name: name.to_string(),
        }
    }
}

// GOOD: accept Into<String> for flexibility
impl User {
    fn new(name: impl Into<String>) -> Self {
        User {
            name: name.into(),
        }
    }
}

// Usage:
let u1 = User::new("Alice");        // &str
let u2 = User::new(String::from("Bob"));  // String
```

### 3. Use AsRef for Generic Borrowing

```rust
// GOOD: accepts both &str and String
fn process<S: AsRef<str>>(input: S) {
    let s = input.as_ref();
    println!("{}", s);
}

process("literal");           // &str
process(String::from("owned")); // String
process(&String::from("ref")); // &String
```

### 4. Cow for Clone-on-Write

```rust
use std::borrow::Cow;

// Return borrowed when possible, owned when needed
fn maybe_modify(s: &str, uppercase: bool) -> Cow<'_, str> {
    if uppercase {
        Cow::Owned(s.to_uppercase())  // allocates
    } else {
        Cow::Borrowed(s)  // zero-cost
    }
}

let input = "hello";
let result = maybe_modify(input, false);
// result is borrowed, no allocation
```

---

## Struct Design Patterns

### 1. Owned Fields vs References

```rust
// Use owned fields for most cases
struct User {
    name: String,
    email: String,
}

// Use references only when lifetime is clear
struct UserView<'a> {
    name: &'a str,
    email: &'a str,
}

// Pattern: owned data + view for efficiency
impl User {
    fn view(&self) -> UserView<'_> {
        UserView {
            name: &self.name,
            email: &self.email,
        }
    }
}
```

### 2. Builder Pattern with Ownership

```rust
#[derive(Default)]
struct RequestBuilder {
    url: Option<String>,
    method: Option<String>,
    body: Option<Vec<u8>>,
}

impl RequestBuilder {
    fn new() -> Self {
        Self::default()
    }

    // Take self by value for chaining
    fn url(mut self, url: impl Into<String>) -> Self {
        self.url = Some(url.into());
        self
    }

    fn method(mut self, method: impl Into<String>) -> Self {
        self.method = Some(method.into());
        self
    }

    fn build(self) -> Result<Request, Error> {
        Ok(Request {
            url: self.url.ok_or(Error::MissingUrl)?,
            method: self.method.unwrap_or_else(|| "GET".to_string()),
            body: self.body.unwrap_or_default(),
        })
    }
}

// Usage:
let req = RequestBuilder::new()
    .url("https://example.com")
    .method("POST")
    .build()?;
```

### 3. Interior Mutability When Needed

```rust
use std::cell::RefCell;
use std::rc::Rc;

// Shared mutable state in single-threaded context
struct Counter {
    value: Rc<RefCell<u32>>,
}

impl Counter {
    fn new() -> Self {
        Counter {
            value: Rc::new(RefCell::new(0)),
        }
    }

    fn increment(&self) {
        *self.value.borrow_mut() += 1;
    }

    fn get(&self) -> u32 {
        *self.value.borrow()
    }

    fn clone_handle(&self) -> Self {
        Counter {
            value: Rc::clone(&self.value),
        }
    }
}
```

---

## Collection Patterns

### 1. Efficient Iteration

```rust
let items = vec![1, 2, 3, 4, 5];

// Iterate by reference (no move)
for item in &items {
    println!("{}", item);
}

// Iterate by mutable reference
for item in &mut items.clone() {
    *item *= 2;
}

// Consume with into_iter when done
let sum: i32 = items.into_iter().sum();
```

### 2. Collecting Results

```rust
// Collect into owned collection
let strings: Vec<String> = (0..5)
    .map(|i| format!("item_{}", i))
    .collect();

// Collect references
let refs: Vec<&str> = strings.iter().map(|s| s.as_str()).collect();

// Collect with transformation
let result: Result<Vec<i32>, _> = ["1", "2", "3"]
    .iter()
    .map(|s| s.parse::<i32>())
    .collect();
```

### 3. Entry API for Maps

```rust
use std::collections::HashMap;

let mut map: HashMap<String, Vec<i32>> = HashMap::new();

// Efficient: don't search twice
map.entry("key".to_string())
   .or_insert_with(Vec::new)
   .push(42);

// With entry modification
map.entry("key".to_string())
   .and_modify(|v| v.push(43))
   .or_insert_with(|| vec![43]);
```

---

## Error Handling with Ownership

### 1. Preserve Context in Errors

```rust
use std::error::Error;
use std::fmt;

#[derive(Debug)]
struct ParseError {
    input: String,  // owns the problematic input
    message: String,
}

impl fmt::Display for ParseError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Failed to parse '{}': {}", self.input, self.message)
    }
}

fn parse(input: &str) -> Result<i32, ParseError> {
    input.parse().map_err(|_| ParseError {
        input: input.to_string(),  // clone for error context
        message: "not a valid integer".to_string(),
    })
}
```

### 2. Ownership in Result Chains

```rust
fn process_data(path: &str) -> Result<ProcessedData, Error> {
    let content = std::fs::read_to_string(path)?;  // owned String
    let parsed = parse_content(&content)?;          // borrow
    let processed = transform(parsed)?;             // ownership moves
    Ok(processed)                                   // return owned
}
```

---

## Performance Considerations

### 1. Avoid Unnecessary Clones

```rust
// BAD: cloning just to compare
fn contains_item(items: &[String], target: &str) -> bool {
    items.iter().any(|s| s.clone() == target)  // unnecessary clone
}

// GOOD: compare references
fn contains_item(items: &[String], target: &str) -> bool {
    items.iter().any(|s| s == target)  // String implements PartialEq<str>
}
```

### 2. Use Slices for Flexibility

```rust
// BAD: requires Vec
fn sum(numbers: &Vec<i32>) -> i32 {
    numbers.iter().sum()
}

// GOOD: accepts any slice
fn sum(numbers: &[i32]) -> i32 {
    numbers.iter().sum()
}

// Now works with:
sum(&vec![1, 2, 3]);     // Vec
sum(&[1, 2, 3]);         // array
sum(&array[1..3]);       // slice
```

### 3. In-Place Mutation

```rust
// BAD: allocates new String
fn make_uppercase(s: &str) -> String {
    s.to_uppercase()
}

// GOOD when you own the data: mutate in place
fn make_uppercase(mut s: String) -> String {
    s.make_ascii_uppercase();  // in-place for ASCII
    s
}
```

# Common Ownership Errors & Fixes

## E0382: Use of Moved Value

### Error Pattern
```rust
let s = String::from("hello");
let s2 = s;          // s moved here
println!("{}", s);   // ERROR: value borrowed after move
```

### Fix Options

**Option 1: Clone (if ownership not needed)**
```rust
let s = String::from("hello");
let s2 = s.clone();  // s is cloned
println!("{}", s);   // OK: s still valid
```

**Option 2: Borrow (if modification not needed)**
```rust
let s = String::from("hello");
let s2 = &s;         // borrow, not move
println!("{}", s);   // OK
println!("{}", s2);  // OK
```

**Option 3: Use Rc/Arc (for shared ownership)**
```rust
use std::rc::Rc;
let s = Rc::new(String::from("hello"));
let s2 = Rc::clone(&s);  // shared ownership
println!("{}", s);       // OK
println!("{}", s2);      // OK
```

---

## E0597: Borrowed Value Does Not Live Long Enough

### Error Pattern
```rust
fn get_str() -> &str {
    let s = String::from("hello");
    &s  // ERROR: s dropped here, but reference returned
}
```

### Fix Options

**Option 1: Return owned value**
```rust
fn get_str() -> String {
    String::from("hello")  // return owned value
}
```

**Option 2: Use 'static lifetime**
```rust
fn get_str() -> &'static str {
    "hello"  // string literal has 'static lifetime
}
```

**Option 3: Accept reference parameter**
```rust
fn get_str<'a>(s: &'a str) -> &'a str {
    s  // return reference with same lifetime as input
}
```

---

## E0499: Cannot Borrow as Mutable More Than Once

### Error Pattern
```rust
let mut s = String::from("hello");
let r1 = &mut s;
let r2 = &mut s;  // ERROR: second mutable borrow
println!("{}, {}", r1, r2);
```

### Fix Options

**Option 1: Sequential borrows**
```rust
let mut s = String::from("hello");
{
    let r1 = &mut s;
    r1.push_str(" world");
}  // r1 goes out of scope
let r2 = &mut s;  // OK: r1 no longer exists
```

**Option 2: Use RefCell for interior mutability**
```rust
use std::cell::RefCell;
let s = RefCell::new(String::from("hello"));
let mut r1 = s.borrow_mut();
// drop r1 before borrowing again
drop(r1);
let mut r2 = s.borrow_mut();
```

---

## E0502: Cannot Borrow as Mutable While Immutable Borrow Exists

### Error Pattern
```rust
let mut v = vec![1, 2, 3];
let first = &v[0];      // immutable borrow
v.push(4);              // ERROR: mutable borrow while immutable exists
println!("{}", first);
```

### Fix Options

**Option 1: Finish using immutable borrow first**
```rust
let mut v = vec![1, 2, 3];
let first = v[0];       // copy value, not borrow
v.push(4);              // OK
println!("{}", first);  // OK: using copied value
```

**Option 2: Clone before mutating**
```rust
let mut v = vec![1, 2, 3];
let first = v[0].clone();  // if T: Clone
v.push(4);
println!("{}", first);
```

---

## E0507: Cannot Move Out of Borrowed Content

### Error Pattern
```rust
fn take_string(s: &String) {
    let moved = *s;  // ERROR: cannot move out of borrowed content
}
```

### Fix Options

**Option 1: Clone**
```rust
fn take_string(s: &String) {
    let cloned = s.clone();
}
```

**Option 2: Take ownership in function signature**
```rust
fn take_string(s: String) {  // take ownership
    let moved = s;
}
```

**Option 3: Use mem::take for Option/Default types**
```rust
fn take_from_option(opt: &mut Option<String>) -> Option<String> {
    std::mem::take(opt)  // replaces with None, returns owned value
}
```

---

## E0515: Return Local Reference

### Error Pattern
```rust
fn create_string() -> &String {
    let s = String::from("hello");
    &s  // ERROR: cannot return reference to local variable
}
```

### Fix Options

**Option 1: Return owned value**
```rust
fn create_string() -> String {
    String::from("hello")
}
```

**Option 2: Use static/const**
```rust
fn get_static_str() -> &'static str {
    "hello"
}
```

---

## E0716: Temporary Value Dropped While Borrowed

### Error Pattern
```rust
let r: &str = &String::from("hello");  // ERROR: temporary dropped
println!("{}", r);
```

### Fix Options

**Option 1: Bind to variable first**
```rust
let s = String::from("hello");
let r: &str = &s;
println!("{}", r);
```

**Option 2: Use let binding with reference**
```rust
let r: &str = {
    let s = String::from("hello");
    // s.as_str()  // ERROR: still temporary
    Box::leak(s.into_boxed_str())  // extreme: leak for 'static
};
```

---

## Pattern: Loop Ownership Issues

### Error Pattern
```rust
let strings = vec![String::from("a"), String::from("b")];
for s in strings {
    println!("{}", s);
}
// ERROR: strings moved into loop
println!("{:?}", strings);
```

### Fix Options

**Option 1: Iterate by reference**
```rust
let strings = vec![String::from("a"), String::from("b")];
for s in &strings {
    println!("{}", s);
}
println!("{:?}", strings);  // OK
```

**Option 2: Use iter()**
```rust
for s in strings.iter() {
    println!("{}", s);
}
```

**Option 3: Clone if needed**
```rust
for s in strings.clone() {
    // consumes cloned vec
}
println!("{:?}", strings);  // original still available
```

# Lifetime Patterns

## Basic Lifetime Annotation

### When Required
```rust
// ERROR: missing lifetime specifier
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() { x } else { y }
}

// FIX: explicit lifetime
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

### Lifetime Elision Rules
1. Each input reference gets its own lifetime
2. If one input lifetime, output uses same
3. If `&self` or `&mut self`, output uses self's lifetime

```rust
// These are equivalent (elision applies):
fn first_word(s: &str) -> &str { ... }
fn first_word<'a>(s: &'a str) -> &'a str { ... }

// Method with self (elision applies):
impl MyStruct {
    fn get_ref(&self) -> &str { ... }
    // Equivalent to:
    fn get_ref<'a>(&'a self) -> &'a str { ... }
}
```

---

## Struct Lifetimes

### Struct Holding References
```rust
// Struct must declare lifetime for references
struct Excerpt<'a> {
    part: &'a str,
}

impl<'a> Excerpt<'a> {
    fn level(&self) -> i32 { 3 }

    // Return reference tied to self's lifetime
    fn get_part(&self) -> &str {
        self.part
    }
}
```

### Multiple Lifetimes in Struct
```rust
struct Multi<'a, 'b> {
    x: &'a str,
    y: &'b str,
}

// Use when references may have different lifetimes
fn make_multi<'a, 'b>(x: &'a str, y: &'b str) -> Multi<'a, 'b> {
    Multi { x, y }
}
```

---

## 'static Lifetime

### When to Use
```rust
// String literals are 'static
let s: &'static str = "hello";

// Owned data can be leaked to 'static
let leaked: &'static str = Box::leak(String::from("hello").into_boxed_str());

// Thread spawn requires 'static or move
std::thread::spawn(move || {
    // closure owns data, satisfies 'static
});
```

### Avoid Overusing 'static
```rust
// BAD: requires 'static unnecessarily
fn process(s: &'static str) { ... }

// GOOD: use generic lifetime
fn process<'a>(s: &'a str) { ... }
// or
fn process(s: &str) { ... }  // lifetime elision
```

---

## Higher-Ranked Trait Bounds (HRTB)

### for<'a> Syntax
```rust
// Function that works with any lifetime
fn apply_to_ref<F>(f: F)
where
    F: for<'a> Fn(&'a str) -> &'a str,
{
    let s = String::from("hello");
    let result = f(&s);
    println!("{}", result);
}
```

### Common Use: Closure Bounds
```rust
// Closure that borrows any lifetime
fn filter_refs<F>(items: &[&str], pred: F) -> Vec<&str>
where
    F: for<'a> Fn(&'a str) -> bool,
{
    items.iter().copied().filter(|s| pred(s)).collect()
}
```

---

## Lifetime Bounds

### 'a: 'b (Outlives)
```rust
// 'a must live at least as long as 'b
fn coerce<'a, 'b>(x: &'a str) -> &'b str
where
    'a: 'b,
{
    x
}
```

### T: 'a (Type Outlives Lifetime)
```rust
// T must live at least as long as 'a
struct Wrapper<'a, T: 'a> {
    value: &'a T,
}

// Common pattern with trait objects
fn use_trait<'a, T: MyTrait + 'a>(t: &'a T) { ... }
```

---

## Common Lifetime Mistakes

### Mistake 1: Returning Reference to Local
```rust
// WRONG
fn dangle() -> &String {
    let s = String::from("hello");
    &s  // s dropped, reference invalid
}

// RIGHT
fn no_dangle() -> String {
    String::from("hello")
}
```

### Mistake 2: Conflicting Lifetimes
```rust
// WRONG: might return reference to y which has shorter lifetime
fn wrong<'a, 'b>(x: &'a str, y: &'b str) -> &'a str {
    y  // ERROR: 'b might not live as long as 'a
}

// RIGHT: use same lifetime or add bound
fn right<'a>(x: &'a str, y: &'a str) -> &'a str {
    y  // OK: both have lifetime 'a
}
```

### Mistake 3: Struct Outlives Reference
```rust
// WRONG: s might outlive the string it references
let r;
{
    let s = String::from("hello");
    r = Excerpt { part: &s };  // ERROR
}
println!("{}", r.part);  // s already dropped

// RIGHT: ensure source outlives struct
let s = String::from("hello");
let r = Excerpt { part: &s };
println!("{}", r.part);  // OK: s still in scope
```

---

## Subtyping and Variance

### Covariance
```rust
// &'a T is covariant in 'a
// Can use &'long where &'short expected
fn example<'short, 'long: 'short>(long_ref: &'long str) {
    let short_ref: &'short str = long_ref;  // OK: covariance
}
```

### Invariance
```rust
// &'a mut T is invariant in 'a
fn example<'a, 'b>(x: &'a mut &'b str, y: &'b str) {
    *x = y;  // ERROR if 'a and 'b are different
}
```

### Practical Impact
```rust
// This works due to covariance
fn accept_any<'a>(s: &'a str) { ... }

let s = String::from("hello");
let long_lived: &str = &s;
accept_any(long_lived);  // 'long coerces to 'short
```

