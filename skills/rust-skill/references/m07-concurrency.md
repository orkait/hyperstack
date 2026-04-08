# m07-concurrency

# Concurrency - Agent Integration

> **Skill:** m07-concurrency
> **Agent:** concurrency-expert

## Quick Reference

This skill handles concurrency issues in Rust. It can delegate to the concurrency-expert agent for deep analysis of concurrent code, deadlock prevention, and performance optimization.

## When to Use Agent

Use the agent when:
- Designing concurrent architecture
- Debugging deadlocks or race conditions
- Optimizing concurrent performance
- Choosing synchronization primitives
- Converting between sync and async

## Agent Invocation

```
Task(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: <read from ../../agents/concurrency-expert.md>
)
```

## Concurrency Issues → Agent Mapping

| Issue | Agent Helps With |
|-------|------------------|
| Deadlock | Lock ordering analysis |
| Lock contention | Synchronization primitive selection |
| Logical race | Ordering and synchronization design |
| Performance | Parallel vs async decision |
| Thread safety | Send/Sync implementation |
| Async design | Tokio/async-std patterns |

## Workflow

### Inline Mode (Simple Cases)
1. Identify concurrency pattern
2. Apply pattern from skill reference
3. Use Arc<Mutex<T>> or channels

### Agent Mode (Complex Issues)
1. Describe concurrency requirements
2. Invoke concurrency-expert agent
3. Agent analyzes architecture
4. Agent recommends primitives
5. Agent provides implementation
6. Test with stress tests

## Concurrency Patterns

### Pattern 1: Shared State
```rust
use std::sync::{Arc, Mutex};

let data = Arc::new(Mutex::new(Vec::new()));
let data_clone = Arc::clone(&data);

thread::spawn(move || {
    let mut data = data_clone.lock().unwrap();
    data.push(42);
});
```

### Pattern 2: Message Passing
```rust
use std::sync::mpsc;

let (tx, rx) = mpsc::channel();

thread::spawn(move || {
    tx.send(42).unwrap();
});

let value = rx.recv().unwrap();
```

### Pattern 3: Async/Await
```rust
#[tokio::main]
async fn main() {
    let result = fetch_data().await;
    process(result).await;
}
```

## Agent Output Format

The agent provides:
- **Current Situation**: Analysis of concurrency pattern
- **Issues Identified**: Deadlocks, races, bottlenecks
- **Recommended Approach**: Synchronization strategy
- **Implementation**: Code with proper primitives
- **Testing Strategy**: How to test concurrent code
- **Performance Considerations**: Scalability analysis

## Deadlock Prevention

The agent helps with:
1. **Lock Ordering**: Consistent lock acquisition order
2. **Try-Lock Pattern**: Non-blocking lock attempts
3. **Minimize Lock Scope**: Hold locks briefly
4. **Avoid Nested Locks**: Reduce lock complexity

## Performance Optimization

The agent helps with:
1. **Reduce Contention**: Use RwLock or Atomic
2. **Avoid False Sharing**: Cache line alignment
3. **Batch Operations**: Lock once, do many operations
4. **Choose Right Primitive**: Mutex vs RwLock vs Atomic

## Async vs Threads

| Use Threads | Use Async |
|-------------|-----------|
| CPU-bound work | I/O-bound work |
| Parallel computation | Network requests |
| Blocking operations | High concurrency |

## Related Agents

- **ownership-analyzer**: For Send/Sync issues
- **performance-optimizer**: For concurrent performance
- **unsafe-code-reviewer**: For lock-free code

## Testing Tools

- **Miri**: Detect undefined behavior
- **Loom**: Model checker for concurrency
- **ThreadSanitizer**: Runtime race detector
- **Stress tests**: High-load testing

## Success Criteria

Agent invocation is successful when:
1. Concurrency pattern is correct
2. No deadlocks or data races
3. Performance meets requirements
4. Code is testable
5. Synchronization is minimal but sufficient

---
name: m07-concurrency
description: "CRITICAL: Use for concurrency/async. Triggers: E0277 Send Sync, cannot be sent between threads, thread, spawn, channel, mpsc, Mutex, RwLock, Atomic, async, await, Future, tokio, deadlock, race condition, 并发, 线程, 异步, 死锁"
user-invocable: false
---

# Concurrency

> **Layer 1: Language Mechanics**

## Core Question

**Is this CPU-bound or I/O-bound, and what's the sharing model?**

Before choosing concurrency primitives:
- What's the workload type?
- What data needs to be shared?
- What's the thread safety requirement?

---

## Error → Design Question

| Error | Don't Just Say | Ask Instead |
|-------|----------------|-------------|
| E0277 Send | "Add Send bound" | Should this type cross threads? |
| E0277 Sync | "Wrap in Mutex" | Is shared access really needed? |
| Future not Send | "Use spawn_local" | Is async the right choice? |
| Deadlock | "Reorder locks" | Is the locking design correct? |

---

## Thinking Prompt

Before adding concurrency:

1. **What's the workload?**
   - CPU-bound → threads (std::thread, rayon)
   - I/O-bound → async (tokio, async-std)
   - Mixed → hybrid approach

2. **What's the sharing model?**
   - No sharing → message passing (channels)
   - Immutable sharing → Arc<T>
   - Mutable sharing → Arc<Mutex<T>> or Arc<RwLock<T>>

3. **What are the Send/Sync requirements?**
   - Cross-thread ownership → Send
   - Cross-thread references → Sync
   - Single-thread async → spawn_local

---

## Trace Up ↑ (MANDATORY)

**CRITICAL**: Don't just fix the error. Trace UP to find domain constraints.

### Domain Detection Table

| Context Keywords | Load Domain Skill | Key Constraint |
|-----------------|-------------------|----------------|
| Web API, HTTP, axum, actix, handler | **domain-web** | Handlers run on any thread |
| 交易, 支付, trading, payment | **domain-fintech** | Audit + thread safety |
| gRPC, kubernetes, microservice | **domain-cloud-native** | Distributed tracing |
| CLI, terminal, clap | **domain-cli** | Usually single-thread OK |

### Example: Web API + Rc Error

```
"Rc cannot be sent between threads" in Web API context
    ↑ DETECT: "Web API" → Load domain-web
    ↑ FIND: domain-web says "Shared state must be thread-safe"
    ↑ FIND: domain-web says "Rc in state" is Common Mistake
    ↓ DESIGN: Use Arc<T> with State extractor
    ↓ IMPL: axum::extract::State<Arc<AppConfig>>
```

### Generic Trace

```
"Send not satisfied for my type"
    ↑ Ask: What domain is this? Load domain-* skill
    ↑ Ask: Does this type need to cross thread boundaries?
    ↑ Check: m09-domain (is the data model correct?)
```

| Situation | Trace To | Question |
|-----------|----------|----------|
| Send/Sync in Web | **domain-web** | What's the state management pattern? |
| Send/Sync in CLI | **domain-cli** | Is multi-thread really needed? |
| Mutex vs channels | m09-domain | Shared state or message passing? |
| Async vs threads | m10-performance | What's the workload profile? |

---

## Trace Down ↓

From design to implementation:

```
"Need parallelism for CPU work"
    ↓ Use: std::thread or rayon

"Need concurrency for I/O"
    ↓ Use: async/await with tokio

"Need to share immutable data across threads"
    ↓ Use: Arc<T>

"Need to share mutable data across threads"
    ↓ Use: Arc<Mutex<T>> or Arc<RwLock<T>>
    ↓ Or: channels for message passing

"Need simple atomic operations"
    ↓ Use: AtomicBool, AtomicUsize, etc.
```

---

## Send/Sync Markers

| Marker | Meaning | Example |
|--------|---------|---------|
| `Send` | Can transfer ownership between threads | Most types |
| `Sync` | Can share references between threads | `Arc<T>` |
| `!Send` | Must stay on one thread | `Rc<T>` |
| `!Sync` | No shared refs across threads | `RefCell<T>` |

## Quick Reference

| Pattern | Thread-Safe | Blocking | Use When |
|---------|-------------|----------|----------|
| `std::thread` | Yes | Yes | CPU-bound parallelism |
| `async/await` | Yes | No | I/O-bound concurrency |
| `Mutex<T>` | Yes | Yes | Shared mutable state |
| `RwLock<T>` | Yes | Yes | Read-heavy shared state |
| `mpsc::channel` | Yes | Optional | Message passing |
| `Arc<Mutex<T>>` | Yes | Yes | Shared mutable across threads |

## Decision Flowchart

```
What type of work?
├─ CPU-bound → std::thread or rayon
├─ I/O-bound → async/await
└─ Mixed → hybrid (spawn_blocking)

Need to share data?
├─ No → message passing (channels)
├─ Immutable → Arc<T>
└─ Mutable →
   ├─ Read-heavy → Arc<RwLock<T>>
   └─ Write-heavy → Arc<Mutex<T>>
   └─ Simple counter → AtomicUsize

Async context?
├─ Type is Send → tokio::spawn
├─ Type is !Send → spawn_local
└─ Blocking code → spawn_blocking
```

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| E0277 `Send` not satisfied | Non-Send in async | Use Arc or spawn_local |
| E0277 `Sync` not satisfied | Non-Sync shared | Wrap with Mutex |
| Deadlock | Lock ordering | Consistent lock order |
| `future is not Send` | Non-Send across await | Drop before await |
| `MutexGuard` across await | Guard held during suspend | Scope guard properly |

---

## Anti-Patterns

| Anti-Pattern | Why Bad | Better |
|--------------|---------|--------|
| Arc<Mutex<T>> everywhere | Contention, complexity | Message passing |
| thread::sleep in async | Blocks executor | tokio::time::sleep |
| Holding locks across await | Blocks other tasks | Scope locks tightly |
| Ignoring deadlock risk | Hard to debug | Lock ordering, try_lock |

---

## Async-Specific Patterns

### Avoid MutexGuard Across Await

```rust
// Bad: guard held across await
let guard = mutex.lock().await;
do_async().await;  // guard still held!

// Good: scope the lock
{
    let guard = mutex.lock().await;
    // use guard
}  // guard dropped
do_async().await;
```

### Non-Send Types in Async

```rust
// Rc is !Send, can't cross await in spawned task
// Option 1: use Arc instead
// Option 2: use spawn_local (single-thread runtime)
// Option 3: ensure Rc is dropped before .await
```

---

## Related Skills

| When | See |
|------|-----|
| Smart pointer choice | m02-resource |
| Interior mutability | m03-mutability |
| Performance tuning | m10-performance |
| Domain concurrency needs | domain-* |

# Concurrency: Comparison with Other Languages

## Rust vs Go

### Concurrency Model

| Aspect | Rust | Go |
|--------|------|-----|
| Model | Ownership + Send/Sync | CSP (Communicating Sequential Processes) |
| Primitives | Arc, Mutex, channels | goroutines, channels |
| Safety | Compile-time | Runtime (race detector) |
| Async | async/await + runtime | Built-in scheduler |

### Goroutines vs Rust Tasks

```rust
// Rust: explicit about thread safety
use std::sync::Arc;
use tokio::sync::Mutex;

let data = Arc::new(Mutex::new(vec![]));
let data_clone = Arc::clone(&data);

tokio::spawn(async move {
    let mut guard = data_clone.lock().await;
    guard.push(1);  // Safe: Mutex protects access
});

// Go: implicit sharing (potential race)
// data := []int{}
// go func() {
//     data = append(data, 1)  // RACE CONDITION!
// }()
```

### Channel Comparison

```rust
// Rust: typed channels with ownership
use tokio::sync::mpsc;

let (tx, mut rx) = mpsc::channel::<String>(100);

tokio::spawn(async move {
    tx.send("hello".to_string()).await.unwrap();
    // tx is moved, can't be used elsewhere
});

// Go: channels are more flexible but less safe
// ch := make(chan string, 100)
// go func() {
//     ch <- "hello"
//     // ch can still be used anywhere
// }()
```

---

## Rust vs Java

### Thread Safety Model

| Aspect | Rust | Java |
|--------|------|------|
| Safety | Compile-time (Send/Sync) | Runtime (synchronized, volatile) |
| Null | No null (Option) | NullPointerException risk |
| Locks | RAII (drop releases) | try-finally or try-with-resources |
| Memory | No GC | GC with stop-the-world |

### Synchronization Comparison

```rust
// Rust: lock is tied to data
use std::sync::Mutex;

let data = Mutex::new(vec![1, 2, 3]);
{
    let mut guard = data.lock().unwrap();
    guard.push(4);
}  // lock released automatically

// Java: lock and data are separate
// List<Integer> data = new ArrayList<>();
// synchronized(data) {
//     data.add(4);
// }  // easy to forget synchronization elsewhere
```

### Thread Pool Comparison

```rust
// Rust: rayon for data parallelism
use rayon::prelude::*;

let sum: i32 = (0..1000)
    .into_par_iter()
    .map(|x| x * x)
    .sum();

// Java: Stream API
// int sum = IntStream.range(0, 1000)
//     .parallel()
//     .map(x -> x * x)
//     .sum();
```

---

## Rust vs C++

### Safety Guarantees

| Aspect | Rust | C++ |
|--------|------|-----|
| Data races | Prevented at compile-time | Undefined behavior |
| Deadlocks | Not prevented (same as C++) | Not prevented |
| Thread safety | Send/Sync traits | Convention only |
| Memory ordering | Explicit Ordering enum | memory_order enum |

### Atomic Comparison

```rust
// Rust: clear memory ordering
use std::sync::atomic::{AtomicI32, Ordering};

let counter = AtomicI32::new(0);
counter.fetch_add(1, Ordering::SeqCst);
let value = counter.load(Ordering::Acquire);

// C++: similar but without safety
// std::atomic<int> counter{0};
// counter.fetch_add(1, std::memory_order_seq_cst);
// int value = counter.load(std::memory_order_acquire);
```

### Mutex Comparison

```rust
// Rust: data protected by Mutex
use std::sync::Mutex;

struct SafeCounter {
    count: Mutex<i32>,  // Mutex contains the data
}

impl SafeCounter {
    fn increment(&self) {
        *self.count.lock().unwrap() += 1;
    }
}

// C++: mutex separate from data (error-prone)
// class Counter {
//     std::mutex mtx;
//     int count;  // NOT protected by type system
// public:
//     void increment() {
//         std::lock_guard<std::mutex> lock(mtx);
//         count++;
//     }
//     void unsafe_increment() {
//         count++;  // Compiles! But wrong.
//     }
// };
```

---

## Async Models Comparison

| Language | Model | Runtime |
|----------|-------|---------|
| Rust | async/await, zero-cost | tokio, async-std (bring your own) |
| Go | goroutines | Built-in scheduler |
| JavaScript | async/await, Promises | Event loop (single-threaded) |
| Python | async/await | asyncio (single-threaded) |
| Java | CompletableFuture, Virtual Threads | ForkJoinPool, Loom |

### Rust vs JavaScript Async

```rust
// Rust: async requires explicit runtime, can use multiple threads
#[tokio::main]
async fn main() {
    let results = tokio::join!(
        fetch("url1"),  // runs concurrently
        fetch("url2"),
    );
}

// JavaScript: single-threaded event loop
// async function main() {
//     const results = await Promise.all([
//         fetch("url1"),
//         fetch("url2"),
//     ]);
// }
```

### Rust vs Python Async

```rust
// Rust: true parallelism possible
#[tokio::main(flavor = "multi_thread")]
async fn main() {
    let handles: Vec<_> = urls
        .into_iter()
        .map(|url| tokio::spawn(fetch(url)))  // spawns on thread pool
        .collect();

    for handle in handles {
        let _ = handle.await;
    }
}

// Python: asyncio is single-threaded (use ProcessPoolExecutor for CPU)
# async def main():
#     tasks = [asyncio.create_task(fetch(url)) for url in urls]
#     await asyncio.gather(*tasks)  # all on same thread
```

---

## Send and Sync: Rust's Unique Feature

No other mainstream language has compile-time thread safety markers:

| Trait | Meaning | Auto-impl |
|-------|---------|-----------|
| `Send` | Safe to transfer between threads | Most types |
| `Sync` | Safe to share `&T` between threads | Types with thread-safe `&` |
| `!Send` | Must stay on one thread | Rc, raw pointers |
| `!Sync` | References can't be shared | RefCell, Cell |

### Why This Matters

```rust
// Rust PREVENTS this at compile time:
use std::rc::Rc;

let rc = Rc::new(42);
std::thread::spawn(move || {
    println!("{}", rc);  // ERROR: Rc is not Send
});

// In other languages, this would be a runtime bug:
// - Go: race detector might catch it
// - Java: undefined behavior
// - Python: GIL usually saves you
// - C++: undefined behavior
```

---

## Performance Characteristics

| Aspect | Rust | Go | Java | C++ |
|--------|------|-----|------|-----|
| Thread overhead | System threads or M:N | M:N (goroutines) | System or virtual | System threads |
| Context switch | OS-level or cooperative | Cheap (goroutines) | OS-level | OS-level |
| Memory | Predictable (no GC) | GC pauses | GC pauses | Predictable |
| Async overhead | Zero-cost futures | Runtime overhead | Boxing overhead | Depends |

### When to Use What

| Scenario | Best Choice |
|----------|-------------|
| CPU-bound parallelism | Rust (rayon), C++ |
| I/O-bound concurrency | Rust (tokio), Go, Node.js |
| Low latency required | Rust, C++ |
| Rapid development | Go, Python |
| Complex concurrent state | Rust (compile-time safety) |

---

## Mental Model Shifts

### From Go

```
Before: "Just use goroutines and channels"
After:  "Explicitly declare what can be shared and how"
```

Key shifts:
- `Arc<Mutex<T>>` instead of implicit sharing
- Compiler enforces thread safety
- Async needs explicit runtime

### From Java

```
Before: "synchronized everywhere, hope for the best"
After:  "Types encode thread safety, compiler enforces"
```

Key shifts:
- No need for synchronized keyword
- Mutex contains data, not separate
- No GC pauses in critical sections

### From C++

```
Before: "Be careful, read the docs, use sanitizers"
After:  "Compiler catches data races, trust the type system"
```

Key shifts:
- Send/Sync replace convention
- RAII locks are mandatory, not optional
- Much harder to write incorrect concurrent code

# Thread-Based Concurrency Patterns

## Thread Spawning Best Practices

### Basic Thread Spawn
```rust
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        println!("Hello from thread!");
        42  // return value
    });

    let result = handle.join().unwrap();
    println!("Thread returned: {}", result);
}
```

### Named Threads for Debugging
```rust
use std::thread;

let builder = thread::Builder::new()
    .name("worker-1".to_string())
    .stack_size(32 * 1024);  // 32KB stack

let handle = builder.spawn(|| {
    println!("Thread name: {:?}", thread::current().name());
}).unwrap();
```

### Scoped Threads (No 'static Required)
```rust
use std::thread;

fn process_data(data: &[u32]) -> Vec<u32> {
    thread::scope(|s| {
        let handles: Vec<_> = data
            .chunks(2)
            .map(|chunk| {
                s.spawn(|| {
                    chunk.iter().map(|x| x * 2).collect::<Vec<_>>()
                })
            })
            .collect();

        handles
            .into_iter()
            .flat_map(|h| h.join().unwrap())
            .collect()
    })
}

fn main() {
    let data = vec![1, 2, 3, 4, 5, 6];
    let result = process_data(&data);  // No 'static needed!
    println!("{:?}", result);
}
```

---

## Shared State Patterns

### Arc + Mutex (Read-Write)
```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn shared_counter() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

### Arc + RwLock (Read-Heavy)
```rust
use std::sync::{Arc, RwLock};
use std::thread;

fn read_heavy_cache() {
    let cache = Arc::new(RwLock::new(vec![1, 2, 3]));

    // Many readers
    for i in 0..5 {
        let cache = Arc::clone(&cache);
        thread::spawn(move || {
            let data = cache.read().unwrap();
            println!("Reader {}: {:?}", i, *data);
        });
    }

    // Occasional writer
    {
        let cache = Arc::clone(&cache);
        thread::spawn(move || {
            let mut data = cache.write().unwrap();
            data.push(4);
            println!("Writer: added element");
        });
    }
}
```

### Atomic for Simple Types
```rust
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;
use std::thread;

fn atomic_counter() {
    let counter = Arc::new(AtomicUsize::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            for _ in 0..1000 {
                counter.fetch_add(1, Ordering::SeqCst);
            }
        }));
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", counter.load(Ordering::SeqCst));
}
```

---

## Channel Patterns

### MPSC Channel
```rust
use std::sync::mpsc;
use std::thread;

fn producer_consumer() {
    let (tx, rx) = mpsc::channel();

    // Multiple producers
    for i in 0..3 {
        let tx = tx.clone();
        thread::spawn(move || {
            for j in 0..5 {
                tx.send(format!("msg {}-{}", i, j)).unwrap();
            }
        });
    }
    drop(tx);  // Drop original sender

    // Single consumer
    for received in rx {
        println!("Got: {}", received);
    }
}
```

### Sync Channel (Bounded)
```rust
use std::sync::mpsc;
use std::thread;

fn bounded_channel() {
    let (tx, rx) = mpsc::sync_channel(2);  // buffer size 2

    thread::spawn(move || {
        for i in 0..5 {
            println!("Sending {}", i);
            tx.send(i).unwrap();  // blocks if buffer full
            println!("Sent {}", i);
        }
    });

    thread::sleep(std::time::Duration::from_millis(500));
    for received in rx {
        println!("Received: {}", received);
        thread::sleep(std::time::Duration::from_millis(100));
    }
}
```

---

## Thread Pool Patterns

### Using rayon for Parallel Iteration
```rust
use rayon::prelude::*;

fn parallel_map() {
    let numbers: Vec<i32> = (0..1000).collect();

    let squares: Vec<i32> = numbers
        .par_iter()  // parallel iterator
        .map(|x| x * x)
        .collect();

    println!("Processed {} items", squares.len());
}

fn parallel_filter_map() {
    let data: Vec<String> = get_data();

    let results: Vec<_> = data
        .par_iter()
        .filter(|s| !s.is_empty())
        .map(|s| expensive_process(s))
        .collect();
}
```

### Custom Thread Pool with crossbeam
```rust
use crossbeam::channel;
use std::thread;

fn custom_pool(num_workers: usize) {
    let (tx, rx) = channel::bounded::<Box<dyn FnOnce() + Send>>(100);

    // Spawn workers
    let workers: Vec<_> = (0..num_workers)
        .map(|_| {
            let rx = rx.clone();
            thread::spawn(move || {
                while let Ok(task) = rx.recv() {
                    task();
                }
            })
        })
        .collect();

    // Submit tasks
    for i in 0..100 {
        tx.send(Box::new(move || {
            println!("Processing task {}", i);
        })).unwrap();
    }

    drop(tx);  // Close channel

    for worker in workers {
        worker.join().unwrap();
    }
}
```

---

## Synchronization Primitives

### Barrier (Wait for All)
```rust
use std::sync::{Arc, Barrier};
use std::thread;

fn barrier_example() {
    let barrier = Arc::new(Barrier::new(3));
    let mut handles = vec![];

    for i in 0..3 {
        let barrier = Arc::clone(&barrier);
        handles.push(thread::spawn(move || {
            println!("Thread {} starting", i);
            thread::sleep(std::time::Duration::from_millis(i as u64 * 100));

            barrier.wait();  // All threads wait here

            println!("Thread {} after barrier", i);
        }));
    }

    for handle in handles {
        handle.join().unwrap();
    }
}
```

### Condvar (Condition Variable)
```rust
use std::sync::{Arc, Condvar, Mutex};
use std::thread;

fn condvar_example() {
    let pair = Arc::new((Mutex::new(false), Condvar::new()));
    let pair_clone = Arc::clone(&pair);

    // Waiter thread
    let waiter = thread::spawn(move || {
        let (lock, cvar) = &*pair_clone;
        let mut started = lock.lock().unwrap();
        while !*started {
            started = cvar.wait(started).unwrap();
        }
        println!("Waiter: condition met!");
    });

    // Notifier
    thread::sleep(std::time::Duration::from_millis(100));
    let (lock, cvar) = &*pair;
    {
        let mut started = lock.lock().unwrap();
        *started = true;
    }
    cvar.notify_one();

    waiter.join().unwrap();
}
```

### Once (One-Time Initialization)
```rust
use std::sync::Once;

static INIT: Once = Once::new();
static mut CONFIG: Option<Config> = None;

fn get_config() -> &'static Config {
    INIT.call_once(|| {
        unsafe {
            CONFIG = Some(load_config());
        }
    });
    unsafe { CONFIG.as_ref().unwrap() }
}

// Better: use once_cell or lazy_static
use once_cell::sync::Lazy;

static CONFIG: Lazy<Config> = Lazy::new(|| {
    load_config()
});
```

---

## Error Handling in Threads

### Handling Panics
```rust
use std::thread;

fn handle_panic() {
    let handle = thread::spawn(|| {
        panic!("Thread panicked!");
    });

    match handle.join() {
        Ok(_) => println!("Thread completed successfully"),
        Err(e) => {
            if let Some(s) = e.downcast_ref::<&str>() {
                println!("Thread panicked with: {}", s);
            } else if let Some(s) = e.downcast_ref::<String>() {
                println!("Thread panicked with: {}", s);
            } else {
                println!("Thread panicked with unknown error");
            }
        }
    }
}
```

### Catching Panics
```rust
use std::panic;

fn catch_panic() {
    let result = panic::catch_unwind(|| {
        risky_operation()
    });

    match result {
        Ok(value) => println!("Success: {:?}", value),
        Err(_) => println!("Operation panicked, continuing..."),
    }
}
```

# Async Patterns in Rust

## Task Spawning

### Basic Spawn
```rust
use tokio::task;

#[tokio::main]
async fn main() {
    // Spawn a task that runs concurrently
    let handle = task::spawn(async {
        expensive_computation().await
    });

    // Do other work while task runs
    other_work().await;

    // Wait for result
    let result = handle.await.unwrap();
}
```

### Spawn with Shared State
```rust
use std::sync::Arc;
use tokio::sync::Mutex;

async fn process_with_state() {
    let state = Arc::new(Mutex::new(vec![]));

    let handles: Vec<_> = (0..10)
        .map(|i| {
            let state = Arc::clone(&state);
            tokio::spawn(async move {
                let mut guard = state.lock().await;
                guard.push(i);
            })
        })
        .collect();

    // Wait for all tasks
    for handle in handles {
        handle.await.unwrap();
    }
}
```

---

## Select Pattern

### Racing Multiple Futures
```rust
use tokio::select;
use tokio::time::{sleep, Duration};

async fn first_response() {
    select! {
        result = fetch_from_server_a() => {
            println!("A responded first: {:?}", result);
        }
        result = fetch_from_server_b() => {
            println!("B responded first: {:?}", result);
        }
    }
}
```

### Select with Timeout
```rust
use tokio::time::timeout;

async fn with_timeout() -> Result<Data, Error> {
    select! {
        result = fetch_data() => result,
        _ = sleep(Duration::from_secs(5)) => {
            Err(Error::Timeout)
        }
    }
}

// Or use timeout directly
async fn with_timeout2() -> Result<Data, Error> {
    timeout(Duration::from_secs(5), fetch_data())
        .await
        .map_err(|_| Error::Timeout)?
}
```

### Select with Channel
```rust
use tokio::sync::mpsc;

async fn process_messages(mut rx: mpsc::Receiver<Message>) {
    loop {
        select! {
            Some(msg) = rx.recv() => {
                handle_message(msg).await;
            }
            _ = tokio::signal::ctrl_c() => {
                println!("Shutting down...");
                break;
            }
        }
    }
}
```

---

## Channel Patterns

### MPSC (Multi-Producer, Single-Consumer)
```rust
use tokio::sync::mpsc;

async fn producer_consumer() {
    let (tx, mut rx) = mpsc::channel(100);

    // Spawn producers
    for i in 0..3 {
        let tx = tx.clone();
        tokio::spawn(async move {
            tx.send(format!("Message from {}", i)).await.unwrap();
        });
    }

    // Drop original sender so channel closes
    drop(tx);

    // Consume
    while let Some(msg) = rx.recv().await {
        println!("Received: {}", msg);
    }
}
```

### Oneshot (Single-Shot Response)
```rust
use tokio::sync::oneshot;

async fn request_response() {
    let (tx, rx) = oneshot::channel();

    tokio::spawn(async move {
        let result = compute_something().await;
        tx.send(result).unwrap();
    });

    // Wait for response
    let response = rx.await.unwrap();
}
```

### Broadcast (Multi-Consumer)
```rust
use tokio::sync::broadcast;

async fn pub_sub() {
    let (tx, _) = broadcast::channel(16);

    // Subscribe multiple consumers
    let mut rx1 = tx.subscribe();
    let mut rx2 = tx.subscribe();

    tokio::spawn(async move {
        while let Ok(msg) = rx1.recv().await {
            println!("Consumer 1: {}", msg);
        }
    });

    tokio::spawn(async move {
        while let Ok(msg) = rx2.recv().await {
            println!("Consumer 2: {}", msg);
        }
    });

    // Publish
    tx.send("Hello").unwrap();
}
```

### Watch (Single Latest Value)
```rust
use tokio::sync::watch;

async fn config_updates() {
    let (tx, mut rx) = watch::channel(Config::default());

    // Consumer watches for changes
    tokio::spawn(async move {
        while rx.changed().await.is_ok() {
            let config = rx.borrow();
            apply_config(&config);
        }
    });

    // Update config
    tx.send(Config::new()).unwrap();
}
```

---

## Structured Concurrency

### JoinSet for Task Groups
```rust
use tokio::task::JoinSet;

async fn parallel_fetch(urls: Vec<String>) -> Vec<Result<Response, Error>> {
    let mut set = JoinSet::new();

    for url in urls {
        set.spawn(async move {
            fetch(&url).await
        });
    }

    let mut results = vec![];
    while let Some(res) = set.join_next().await {
        results.push(res.unwrap());
    }
    results
}
```

### Scoped Tasks (no 'static)
```rust
// Using tokio-scoped or async-scoped crate
use async_scoped::TokioScope;

async fn scoped_example(data: &[u32]) {
    let results = TokioScope::scope_and_block(|scope| {
        for item in data {
            scope.spawn(async move {
                process(item).await
            });
        }
    });
}
```

---

## Cancellation Patterns

### Using CancellationToken
```rust
use tokio_util::sync::CancellationToken;

async fn cancellable_task(token: CancellationToken) {
    loop {
        select! {
            _ = token.cancelled() => {
                println!("Task cancelled");
                break;
            }
            _ = do_work() => {
                // Continue working
            }
        }
    }
}

async fn main_with_cancellation() {
    let token = CancellationToken::new();
    let task_token = token.clone();

    let handle = tokio::spawn(cancellable_task(task_token));

    // Cancel after some condition
    tokio::time::sleep(Duration::from_secs(5)).await;
    token.cancel();

    handle.await.unwrap();
}
```

### Graceful Shutdown
```rust
async fn serve_with_shutdown(shutdown: impl Future) {
    let server = TcpListener::bind("0.0.0.0:8080").await.unwrap();

    loop {
        select! {
            Ok((socket, _)) = server.accept() => {
                tokio::spawn(handle_connection(socket));
            }
            _ = &mut shutdown => {
                println!("Shutting down...");
                break;
            }
        }
    }
}

#[tokio::main]
async fn main() {
    let ctrl_c = async {
        tokio::signal::ctrl_c().await.unwrap();
    };

    serve_with_shutdown(ctrl_c).await;
}
```

---

## Backpressure Patterns

### Bounded Channels
```rust
use tokio::sync::mpsc;

async fn with_backpressure() {
    // Buffer of 10 - producers will wait if full
    let (tx, mut rx) = mpsc::channel(10);

    let producer = tokio::spawn(async move {
        for i in 0..1000 {
            // This will wait if channel is full
            tx.send(i).await.unwrap();
        }
    });

    let consumer = tokio::spawn(async move {
        while let Some(item) = rx.recv().await {
            // Slow consumer
            tokio::time::sleep(Duration::from_millis(10)).await;
            process(item);
        }
    });

    let _ = tokio::join!(producer, consumer);
}
```

### Semaphore for Rate Limiting
```rust
use tokio::sync::Semaphore;
use std::sync::Arc;

async fn rate_limited_requests(urls: Vec<String>) {
    let semaphore = Arc::new(Semaphore::new(10));  // max 10 concurrent

    let handles: Vec<_> = urls
        .into_iter()
        .map(|url| {
            let sem = Arc::clone(&semaphore);
            tokio::spawn(async move {
                let _permit = sem.acquire().await.unwrap();
                fetch(&url).await
            })
        })
        .collect();

    for handle in handles {
        handle.await.unwrap();
    }
}
```

---

## Error Handling in Async

### Propagating Errors
```rust
async fn fetch_and_parse(url: &str) -> Result<Data, Error> {
    let response = fetch(url).await?;
    let data = parse(response).await?;
    Ok(data)
}
```

### Handling Task Panics
```rust
async fn robust_spawn() {
    let handle = tokio::spawn(async {
        risky_operation().await
    });

    match handle.await {
        Ok(result) => println!("Success: {:?}", result),
        Err(e) if e.is_panic() => {
            println!("Task panicked: {:?}", e);
        }
        Err(e) => {
            println!("Task cancelled: {:?}", e);
        }
    }
}
```

### Try-Join for Multiple Results
```rust
use tokio::try_join;

async fn fetch_all() -> Result<(A, B, C), Error> {
    // All must succeed, or first error returned
    try_join!(
        fetch_a(),
        fetch_b(),
        fetch_c(),
    )
}
```

# Common Concurrency Errors & Fixes

## E0277: Cannot Send Between Threads

### Error Pattern
```rust
use std::rc::Rc;

let data = Rc::new(42);
std::thread::spawn(move || {
    println!("{}", data);  // ERROR: Rc<i32> cannot be sent between threads
});
```

### Fix Options

**Option 1: Use Arc instead**
```rust
use std::sync::Arc;

let data = Arc::new(42);
let data_clone = Arc::clone(&data);
std::thread::spawn(move || {
    println!("{}", data_clone);  // OK: Arc is Send
});
```

**Option 2: Move owned data**
```rust
let data = 42;  // i32 is Copy and Send
std::thread::spawn(move || {
    println!("{}", data);  // OK
});
```

---

## E0277: Cannot Share Between Threads (Not Sync)

### Error Pattern
```rust
use std::cell::RefCell;
use std::sync::Arc;

let data = Arc::new(RefCell::new(42));
// ERROR: RefCell is not Sync
```

### Fix Options

**Option 1: Use Mutex for thread-safe interior mutability**
```rust
use std::sync::{Arc, Mutex};

let data = Arc::new(Mutex::new(42));
let data_clone = Arc::clone(&data);
std::thread::spawn(move || {
    let mut guard = data_clone.lock().unwrap();
    *guard += 1;
});
```

**Option 2: Use RwLock for read-heavy workloads**
```rust
use std::sync::{Arc, RwLock};

let data = Arc::new(RwLock::new(42));
let data_clone = Arc::clone(&data);
std::thread::spawn(move || {
    let guard = data_clone.read().unwrap();
    println!("{}", *guard);
});
```

---

## Deadlock Patterns

### Pattern 1: Lock Ordering Deadlock
```rust
// DANGER: potential deadlock
use std::sync::{Arc, Mutex};

let a = Arc::new(Mutex::new(1));
let b = Arc::new(Mutex::new(2));

// Thread 1: locks a then b
let a1 = Arc::clone(&a);
let b1 = Arc::clone(&b);
std::thread::spawn(move || {
    let _a = a1.lock().unwrap();
    let _b = b1.lock().unwrap();  // waits for b
});

// Thread 2: locks b then a (opposite order!)
let a2 = Arc::clone(&a);
let b2 = Arc::clone(&b);
std::thread::spawn(move || {
    let _b = b2.lock().unwrap();
    let _a = a2.lock().unwrap();  // waits for a - DEADLOCK
});
```

### Fix: Consistent Lock Ordering
```rust
// SAFE: always lock in same order (a before b)
std::thread::spawn(move || {
    let _a = a1.lock().unwrap();
    let _b = b1.lock().unwrap();
});

std::thread::spawn(move || {
    let _a = a2.lock().unwrap();  // same order
    let _b = b2.lock().unwrap();
});
```

### Pattern 2: Self-Deadlock
```rust
// DANGER: locking same mutex twice
let m = Mutex::new(42);
let _g1 = m.lock().unwrap();
let _g2 = m.lock().unwrap();  // DEADLOCK on std::Mutex

// FIX: use parking_lot::ReentrantMutex if needed
// or restructure code to avoid double locking
```

---

## Mutex Guard Across Await

### Error Pattern
```rust
use std::sync::Mutex;
use tokio::time::sleep;

async fn bad_async() {
    let m = Mutex::new(42);
    let guard = m.lock().unwrap();
    sleep(Duration::from_secs(1)).await;  // WARNING: guard held across await
    println!("{}", *guard);
}
```

### Fix Options

**Option 1: Scope the lock**
```rust
async fn good_async() {
    let m = Mutex::new(42);
    let value = {
        let guard = m.lock().unwrap();
        *guard  // copy value
    };  // guard dropped here
    sleep(Duration::from_secs(1)).await;
    println!("{}", value);
}
```

**Option 2: Use tokio::sync::Mutex**
```rust
use tokio::sync::Mutex;

async fn good_async() {
    let m = Mutex::new(42);
    let guard = m.lock().await;  // async lock
    sleep(Duration::from_secs(1)).await;  // OK with tokio::Mutex
    println!("{}", *guard);
}
```

---

## Data Race Prevention

### Pattern: Missing Synchronization
```rust
// This WON'T compile - Rust prevents data races
use std::sync::Arc;

let data = Arc::new(0);
let d1 = Arc::clone(&data);
let d2 = Arc::clone(&data);

std::thread::spawn(move || {
    // *d1 += 1;  // ERROR: cannot mutate through Arc
});

std::thread::spawn(move || {
    // *d2 += 1;  // ERROR: cannot mutate through Arc
});
```

### Fix: Add Synchronization
```rust
use std::sync::{Arc, Mutex};
use std::sync::atomic::{AtomicI32, Ordering};

// Option 1: Mutex
let data = Arc::new(Mutex::new(0));
let d1 = Arc::clone(&data);
std::thread::spawn(move || {
    *d1.lock().unwrap() += 1;
});

// Option 2: Atomic (for simple types)
let data = Arc::new(AtomicI32::new(0));
let d1 = Arc::clone(&data);
std::thread::spawn(move || {
    d1.fetch_add(1, Ordering::SeqCst);
});
```

---

## Channel Errors

### Disconnected Channel
```rust
use std::sync::mpsc;

let (tx, rx) = mpsc::channel();
drop(tx);  // sender dropped
match rx.recv() {
    Ok(v) => println!("{}", v),
    Err(_) => println!("channel disconnected"),  // this happens
}
```

### Fix: Handle Disconnection
```rust
// Use try_recv for non-blocking
loop {
    match rx.try_recv() {
        Ok(msg) => handle(msg),
        Err(TryRecvError::Empty) => continue,
        Err(TryRecvError::Disconnected) => break,
    }
}

// Or iterate (stops on disconnect)
for msg in rx {
    handle(msg);
}
```

---

## Async Common Errors

### Forgetting to Spawn
```rust
// WRONG: future not polled
async fn fetch_data() -> Result<Data, Error> { ... }

fn process() {
    fetch_data();  // does nothing! returns Future that's dropped
}

// RIGHT: await or spawn
async fn process() {
    let data = fetch_data().await;  // awaited
}

fn process_sync() {
    tokio::spawn(fetch_data());  // spawned
}
```

### Blocking in Async Context
```rust
// WRONG: blocks the executor
async fn bad() {
    std::thread::sleep(Duration::from_secs(1));  // blocks!
    std::fs::read_to_string("file.txt").unwrap();  // blocks!
}

// RIGHT: use async versions
async fn good() {
    tokio::time::sleep(Duration::from_secs(1)).await;
    tokio::fs::read_to_string("file.txt").await.unwrap();
}

// Or spawn_blocking for CPU-bound work
async fn compute() {
    let result = tokio::task::spawn_blocking(|| {
        heavy_computation()  // OK to block here
    }).await.unwrap();
}
```

---

## Thread Panic Handling

### Unhandled Panic
```rust
let handle = std::thread::spawn(|| {
    panic!("oops");
});

// Main thread continues, might miss the error
handle.join().unwrap();  // panics here
```

### Proper Error Handling
```rust
let handle = std::thread::spawn(|| {
    panic!("oops");
});

match handle.join() {
    Ok(result) => println!("Success: {:?}", result),
    Err(e) => println!("Thread panicked: {:?}", e),
}

// For async: use catch_unwind
use std::panic;

async fn safe_task() {
    let result = panic::catch_unwind(|| {
        risky_operation()
    });

    match result {
        Ok(v) => use_value(v),
        Err(_) => log_error("task panicked"),
    }
}
```

