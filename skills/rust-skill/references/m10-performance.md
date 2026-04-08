# m10-performance

# Performance - Agent Integration

> **Skill:** m10-performance
> **Agent:** performance-optimizer

## Quick Reference

This skill handles performance optimization in Rust. It can delegate to the performance-optimizer agent for comprehensive profiling, bottleneck identification, and optimization strategies.

## When to Use Agent

Use the agent when:
- Performance is below requirements
- Need to identify bottlenecks
- Optimizing hot paths
- Reducing allocations
- Improving algorithmic complexity

## Agent Invocation

```
Task(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: <read from ../../agents/performance-optimizer.md>
)
```

## Performance Issues → Agent Mapping

| Issue | Agent Helps With |
|-------|------------------|
| Slow execution | Profiling and bottleneck identification |
| High memory usage | Allocation analysis and reduction |
| Poor scalability | Algorithmic improvements |
| Lock contention | Concurrency optimization |
| Cache misses | Data structure layout |

## Workflow

### Inline Mode (Known Optimization)
1. Identify specific optimization
2. Apply pattern from skill reference
3. Benchmark before/after

### Agent Mode (Unknown Bottleneck)
1. Describe performance issue
2. Invoke performance-optimizer agent
3. Agent profiles code
4. Agent identifies bottlenecks
5. Agent suggests optimizations
6. Apply and benchmark
7. Validate correctness

## Optimization Hierarchy

1. **Algorithm**: O(n²) → O(n log n) (biggest impact)
2. **Data Structures**: Vec vs HashMap vs BTreeMap
3. **Allocations**: Reduce heap allocations
4. **Copies**: Avoid unnecessary clones
5. **Micro-optimizations**: Only if proven necessary

## Agent Output Format

The agent provides:
- **Profiling Results**: Where time is spent
- **Bottlenecks Identified**: Hot paths and causes
- **Optimization Strategy**: Prioritized improvements
- **Implementation**: Optimized code
- **Benchmark Results**: Before/after comparison
- **Trade-offs**: Readability vs performance

## Common Optimizations

### 1. Reduce Allocations
```rust
// Before: allocate each iteration
for _ in 0..1000 {
    let mut buffer = Vec::new();
    process(&mut buffer);
}

// After: reuse allocation
let mut buffer = Vec::new();
for _ in 0..1000 {
    buffer.clear();
    process(&mut buffer);
}
```

### 2. Pre-allocate Capacity
```rust
// Before: multiple reallocations
let mut vec = Vec::new();
for i in 0..1000 {
    vec.push(i);
}

// After: single allocation
let mut vec = Vec::with_capacity(1000);
for i in 0..1000 {
    vec.push(i);
}
```

### 3. Use References
```rust
// Before: copies data
fn process(data: Vec<i32>) -> i32 {
    data.iter().sum()
}

// After: borrows data
fn process(data: &[i32]) -> i32 {
    data.iter().sum()
}
```

### 4. Iterator Chains
```rust
// Before: intermediate collections
let data: Vec<_> = input.iter().map(|x| x * 2).collect();
let result: Vec<_> = data.iter().filter(|x| **x > 10).collect();

// After: chained iterators
let result: Vec<_> = input
    .iter()
    .map(|x| x * 2)
    .filter(|x| *x > 10)
    .collect();
```

## Profiling Tools

The agent uses:
- **cargo-flamegraph**: CPU profiling
- **perf**: Linux performance analysis
- **Instruments**: macOS profiling
- **criterion**: Benchmarking
- **heaptrack**: Memory profiling

## Benchmarking

Always benchmark before and after:
```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn benchmark(c: &mut Criterion) {
    c.bench_function("my_function", |b| {
        b.iter(|| my_function(black_box(42)))
    });
}

criterion_group!(benches, benchmark);
criterion_main!(benches);
```

## Related Agents

- **concurrency-expert**: For parallel optimization
- **ownership-analyzer**: For zero-copy optimization
- **refactor-assistant**: For performance refactoring

## Anti-Patterns

| Anti-Pattern | Why Bad | Better |
|--------------|---------|--------|
| Premature optimization | Wastes time | Profile first |
| Micro-optimizing cold paths | No impact | Focus on hot paths |
| Unsafe without proof | Risk without benefit | Benchmark first |
| Ignoring algorithm | Won't help O(n²) | Better algorithm |

## Success Criteria

Agent invocation is successful when:
1. Bottlenecks are identified through profiling
2. Optimizations are applied to hot paths
3. Improvements are validated with benchmarks
4. Code remains readable and maintainable
5. Performance meets requirements

---
name: m10-performance
description: "CRITICAL: Use for performance optimization. Triggers: performance, optimization, benchmark, profiling, flamegraph, criterion, slow, fast, allocation, cache, SIMD, make it faster, 性能优化, 基准测试"
user-invocable: false
---

# Performance Optimization

> **Layer 2: Design Choices**

## Core Question

**What's the bottleneck, and is optimization worth it?**

Before optimizing:
- Have you measured? (Don't guess)
- What's the acceptable performance?
- Will optimization add complexity?

---

## Performance Decision → Implementation

| Goal | Design Choice | Implementation |
|------|---------------|----------------|
| Reduce allocations | Pre-allocate, reuse | `with_capacity`, object pools |
| Improve cache | Contiguous data | `Vec`, `SmallVec` |
| Parallelize | Data parallelism | `rayon`, threads |
| Avoid copies | Zero-copy | References, `Cow<T>` |
| Reduce indirection | Inline data | `smallvec`, arrays |

---

## Thinking Prompt

Before optimizing:

1. **Have you measured?**
   - Profile first → flamegraph, perf
   - Benchmark → criterion, cargo bench
   - Identify actual hotspots

2. **What's the priority?**
   - Algorithm (10x-1000x improvement)
   - Data structure (2x-10x)
   - Allocation (2x-5x)
   - Cache (1.5x-3x)

3. **What's the trade-off?**
   - Complexity vs speed
   - Memory vs CPU
   - Latency vs throughput

---

## Trace Up ↑

To domain constraints (Layer 3):

```
"How fast does this need to be?"
    ↑ Ask: What's the performance SLA?
    ↑ Check: domain-* (latency requirements)
    ↑ Check: Business requirements (acceptable response time)
```

| Question | Trace To | Ask |
|----------|----------|-----|
| Latency requirements | domain-* | What's acceptable response time? |
| Throughput needs | domain-* | How many requests per second? |
| Memory constraints | domain-* | What's the memory budget? |

---

## Trace Down ↓

To implementation (Layer 1):

```
"Need to reduce allocations"
    ↓ m01-ownership: Use references, avoid clone
    ↓ m02-resource: Pre-allocate with_capacity

"Need to parallelize"
    ↓ m07-concurrency: Choose rayon or threads
    ↓ m07-concurrency: Consider async for I/O-bound

"Need cache efficiency"
    ↓ Data layout: Prefer Vec over HashMap when possible
    ↓ Access patterns: Sequential over random access
```

---

## Quick Reference

| Tool | Purpose |
|------|---------|
| `cargo bench` | Micro-benchmarks |
| `criterion` | Statistical benchmarks |
| `perf` / `flamegraph` | CPU profiling |
| `heaptrack` | Allocation tracking |
| `valgrind` / `cachegrind` | Cache analysis |

## Optimization Priority

```
1. Algorithm choice     (10x - 1000x)
2. Data structure       (2x - 10x)
3. Allocation reduction (2x - 5x)
4. Cache optimization   (1.5x - 3x)
5. SIMD/Parallelism     (2x - 8x)
```

## Common Techniques

| Technique | When | How |
|-----------|------|-----|
| Pre-allocation | Known size | `Vec::with_capacity(n)` |
| Avoid cloning | Hot paths | Use references or `Cow<T>` |
| Batch operations | Many small ops | Collect then process |
| SmallVec | Usually small | `smallvec::SmallVec<[T; N]>` |
| Inline buffers | Fixed-size data | Arrays over Vec |

---

## Common Mistakes

| Mistake | Why Wrong | Better |
|---------|-----------|--------|
| Optimize without profiling | Wrong target | Profile first |
| Benchmark in debug mode | Meaningless | Always `--release` |
| Use LinkedList | Cache unfriendly | `Vec` or `VecDeque` |
| Hidden `.clone()` | Unnecessary allocs | Use references |
| Premature optimization | Wasted effort | Make it work first |

---

## Anti-Patterns

| Anti-Pattern | Why Bad | Better |
|--------------|---------|--------|
| Clone to avoid lifetimes | Performance cost | Proper ownership |
| Box everything | Indirection cost | Stack when possible |
| HashMap for small sets | Overhead | Vec with linear search |
| String concat in loop | O(n^2) | `String::with_capacity` or `format!` |

---

## Related Skills

| When | See |
|------|-----|
| Reducing clones | m01-ownership |
| Concurrency options | m07-concurrency |
| Smart pointer choice | m02-resource |
| Domain requirements | domain-* |

# Rust Performance Optimization Guide

## Profiling First

### Tools
```bash
# CPU profiling
cargo install flamegraph
cargo flamegraph --bin myapp

# Memory profiling
cargo install cargo-instruments  # macOS
heaptrack ./target/release/myapp  # Linux

# Benchmarking
cargo bench  # with criterion

# Cache analysis
valgrind --tool=cachegrind ./target/release/myapp
```

### Criterion Benchmarks
```rust
use criterion::{criterion_group, criterion_main, Criterion};

fn benchmark_parse(c: &mut Criterion) {
    let input = "test data".repeat(1000);

    c.bench_function("parse_v1", |b| {
        b.iter(|| parse_v1(&input))
    });

    c.bench_function("parse_v2", |b| {
        b.iter(|| parse_v2(&input))
    });
}

criterion_group!(benches, benchmark_parse);
criterion_main!(benches);
```

---

## Common Optimizations

### 1. Avoid Unnecessary Allocations

```rust
// BAD: allocates on every call
fn to_uppercase(s: &str) -> String {
    s.to_uppercase()
}

// GOOD: return Cow, allocate only if needed
use std::borrow::Cow;

fn to_uppercase(s: &str) -> Cow<'_, str> {
    if s.chars().all(|c| c.is_uppercase()) {
        Cow::Borrowed(s)
    } else {
        Cow::Owned(s.to_uppercase())
    }
}
```

### 2. Reuse Allocations

```rust
// BAD: creates new Vec each iteration
for item in items {
    let mut buffer = Vec::new();
    process(&mut buffer, item);
}

// GOOD: reuse buffer
let mut buffer = Vec::new();
for item in items {
    buffer.clear();
    process(&mut buffer, item);
}
```

### 3. Use Appropriate Collections

| Need | Collection | Notes |
|------|------------|-------|
| Sequential access | `Vec<T>` | Best cache locality |
| Random access by key | `HashMap<K, V>` | O(1) lookup |
| Ordered keys | `BTreeMap<K, V>` | O(log n) lookup |
| Small sets (<20) | `Vec<T>` + linear search | Lower overhead |
| FIFO queue | `VecDeque<T>` | O(1) push/pop both ends |

### 4. Pre-allocate Capacity

```rust
// BAD: many reallocations
let mut v = Vec::new();
for i in 0..10000 {
    v.push(i);
}

// GOOD: single allocation
let mut v = Vec::with_capacity(10000);
for i in 0..10000 {
    v.push(i);
}
```

---

## String Optimization

### Avoid String Concatenation in Loops

```rust
// BAD: O(n²) allocations
let mut result = String::new();
for s in strings {
    result = result + &s;
}

// GOOD: O(n) with push_str
let mut result = String::new();
for s in strings {
    result.push_str(&s);
}

// BETTER: pre-calculate capacity
let total_len: usize = strings.iter().map(|s| s.len()).sum();
let mut result = String::with_capacity(total_len);
for s in strings {
    result.push_str(&s);
}

// BEST: use join for simple cases
let result = strings.join("");
```

### Use &str When Possible

```rust
// BAD: requires allocation
fn greet(name: String) {
    println!("Hello, {}", name);
}

// GOOD: borrows, no allocation
fn greet(name: &str) {
    println!("Hello, {}", name);
}

// Works with both:
greet("world");                    // &str
greet(&String::from("world"));     // &String coerces to &str
```

---

## Iterator Optimization

### Use Iterators Over Indexing

```rust
// BAD: bounds checking on each access
let mut sum = 0;
for i in 0..vec.len() {
    sum += vec[i];
}

// GOOD: no bounds checking
let sum: i32 = vec.iter().sum();

// GOOD: when index needed
for (i, item) in vec.iter().enumerate() {
    // ...
}
```

### Lazy Evaluation

```rust
// Iterators are lazy - computation happens at collect
let result: Vec<_> = data
    .iter()
    .filter(|x| x.is_valid())
    .map(|x| x.process())
    .take(10)  // stop after 10 items
    .collect();
```

### Avoid Collecting When Not Needed

```rust
// BAD: unnecessary intermediate allocation
let filtered: Vec<_> = items.iter().filter(|x| x.valid).collect();
let count = filtered.len();

// GOOD: no allocation
let count = items.iter().filter(|x| x.valid).count();
```

---

## Parallelism with Rayon

```rust
use rayon::prelude::*;

// Sequential
let sum: i32 = (0..1_000_000).map(|x| x * x).sum();

// Parallel (automatic work stealing)
let sum: i32 = (0..1_000_000).into_par_iter().map(|x| x * x).sum();

// Parallel with custom chunk size
let results: Vec<_> = data
    .par_chunks(1000)
    .map(|chunk| process_chunk(chunk))
    .collect();
```

---

## Memory Layout

### Use Appropriate Integer Sizes

```rust
// If values are small, use smaller types
struct Item {
    count: u8,      // 0-255, not u64
    flags: u8,      // small enum
    id: u32,        // if 4 billion is enough
}
```

### Pack Structs Efficiently

```rust
// BAD: 24 bytes due to padding
struct Bad {
    a: u8,   // 1 byte + 7 padding
    b: u64,  // 8 bytes
    c: u8,   // 1 byte + 7 padding
}

// GOOD: 16 bytes (or use #[repr(packed)])
struct Good {
    b: u64,  // 8 bytes
    a: u8,   // 1 byte
    c: u8,   // 1 byte + 6 padding
}
```

### Box Large Values

```rust
// Large enum variants waste space
enum Message {
    Quit,
    Data([u8; 10000]),  // all variants are 10000+ bytes
}

// Better: box the large variant
enum Message {
    Quit,
    Data(Box<[u8; 10000]>),  // variants are pointer-sized
}
```

---

## Async Performance

### Avoid Blocking in Async

```rust
// BAD: blocks the executor
async fn bad() {
    std::thread::sleep(Duration::from_secs(1));  // blocking!
    std::fs::read_to_string("file.txt").unwrap();  // blocking!
}

// GOOD: use async versions
async fn good() {
    tokio::time::sleep(Duration::from_secs(1)).await;
    tokio::fs::read_to_string("file.txt").await.unwrap();
}

// For CPU work: spawn_blocking
async fn compute() -> i32 {
    tokio::task::spawn_blocking(|| {
        heavy_computation()
    }).await.unwrap()
}
```

### Buffer Async I/O

```rust
use tokio::io::{AsyncBufReadExt, BufReader};

// BAD: many small reads
async fn bad(file: File) {
    let mut byte = [0u8];
    while file.read(&mut byte).await.unwrap() > 0 {
        process(byte[0]);
    }
}

// GOOD: buffered reading
async fn good(file: File) {
    let reader = BufReader::new(file);
    let mut lines = reader.lines();
    while let Some(line) = lines.next_line().await.unwrap() {
        process(&line);
    }
}
```

---

## Release Build Optimization

### Cargo.toml Settings

```toml
[profile.release]
lto = true           # Link-time optimization
codegen-units = 1    # Single codegen unit (slower compile, faster code)
panic = "abort"      # Smaller binary, no unwinding
strip = true         # Strip symbols

[profile.release-fast]
inherits = "release"
opt-level = 3        # Maximum optimization

[profile.release-small]
inherits = "release"
opt-level = "s"      # Optimize for size
```

### Compile-Time Assertions

```rust
// Zero runtime cost
const _: () = assert!(std::mem::size_of::<MyStruct>() <= 64);
```

---

## Checklist

Before optimizing:
- [ ] Profile to find actual bottlenecks
- [ ] Have benchmarks to measure improvement
- [ ] Consider if optimization is worth complexity

Common wins:
- [ ] Reduce allocations (Cow, reuse buffers)
- [ ] Use appropriate collections
- [ ] Pre-allocate with_capacity
- [ ] Use iterators instead of indexing
- [ ] Enable LTO for release builds
- [ ] Use rayon for parallel workloads

