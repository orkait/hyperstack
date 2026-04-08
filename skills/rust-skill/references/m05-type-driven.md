# m05-type-driven

# Type-Driven Design - Agent Integration

> **Skill:** m05-type-driven
> **Agent:** type-system-designer

## Quick Reference

This skill handles type-driven design in Rust. It can delegate to the type-system-designer agent for comprehensive type system design and pattern selection.

## When to Use Agent

Use the agent when:
- Designing type-safe APIs
- Making invalid states unrepresentable
- Choosing between type patterns (newtype, type state, phantom data)
- Encoding invariants in types
- Creating compile-time validated APIs

## Agent Invocation

```
Task(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: <read from ../../agents/type-system-designer.md>
)
```

## Type Design Scenarios

| Scenario | Agent Helps With |
|----------|------------------|
| Semantic type safety | Newtype pattern design |
| State machine | Type state pattern implementation |
| Compile-time validation | Phantom type usage |
| Capability markers | Marker trait design |
| Gradual construction | Builder pattern |
| Closed trait set | Sealed trait pattern |

## Workflow

### Inline Mode (Simple Pattern)
1. Identify constraint type
2. Apply pattern from skill reference
3. Implement with validation

### Agent Mode (Complex Design)
1. Describe type safety requirements
2. Invoke type-system-designer agent
3. Agent analyzes constraints
4. Agent chooses appropriate pattern
5. Agent provides full implementation
6. Apply and test

## Type Patterns

### Newtype
```rust
struct UserId(u64);
struct Email(String);
```

### Type State
```rust
struct Connection<State> {
    stream: TcpStream,
    _state: PhantomData<State>,
}
```

### Builder
```rust
ConfigBuilder::new()
    .host("localhost")
    .port(8080)
    .build()?
```

## Agent Output Format

The agent provides:
- **Requirements**: What constraints to enforce
- **Chosen Pattern**: Pattern name and rationale
- **Implementation**: Complete type definitions
- **Usage Example**: How to use the API
- **Benefits**: What the design achieves
- **Compile-Time Guarantees**: What compiler prevents

## Success Criteria

Agent invocation is successful when:
1. Invalid states are unrepresentable
2. Validation happens at construction
3. API is ergonomic
4. Zero or minimal runtime cost
5. Code is self-documenting
6. Compiler prevents misuse

---
name: m05-type-driven
description: "CRITICAL: Use for type-driven design. Triggers: type state, PhantomData, newtype, marker trait, builder pattern, make invalid states unrepresentable, compile-time validation, sealed trait, ZST, 类型状态, 新类型模式, 类型驱动设计"
user-invocable: false
---

# Type-Driven Design

> **Layer 1: Language Mechanics**

## Core Question

**How can the type system prevent invalid states?**

Before reaching for runtime checks:
- Can the compiler catch this error?
- Can invalid states be unrepresentable?
- Can the type encode the invariant?

---

## Error → Design Question

| Pattern | Don't Just Say | Ask Instead |
|---------|----------------|-------------|
| Primitive obsession | "It's just a string" | What does this value represent? |
| Boolean flags | "Add an is_valid flag" | Can states be types? |
| Optional everywhere | "Check for None" | Is absence really possible? |
| Validation at runtime | "Return Err if invalid" | Can we validate at construction? |

---

## Thinking Prompt

Before adding runtime validation:

1. **Can the type encode the constraint?**
   - Numeric range → bounded types or newtypes
   - Valid states → type state pattern
   - Semantic meaning → newtype

2. **When is validation possible?**
   - At construction → validated newtype
   - At state transition → type state
   - Only at runtime → Result with clear error

3. **Who needs to know the invariant?**
   - Compiler → type-level encoding
   - API users → clear type signatures
   - Runtime only → documentation

---

## Trace Up ↑

When type design is unclear:

```
"Need to validate email format"
    ↑ Ask: Is this a domain value object?
    ↑ Check: m09-domain (Email as Value Object)
    ↑ Check: domain-* (validation requirements)
```

| Situation | Trace To | Question |
|-----------|----------|----------|
| What types to create | m09-domain | What's the domain model? |
| State machine design | m09-domain | What are valid transitions? |
| Marker trait usage | m04-zero-cost | Static or dynamic dispatch? |

---

## Trace Down ↓

From design to implementation:

```
"Need type-safe wrapper for primitives"
    ↓ Newtype: struct UserId(u64);

"Need compile-time state validation"
    ↓ Type State: Connection<Connected>

"Need to track phantom type parameters"
    ↓ PhantomData: PhantomData<T>

"Need capability markers"
    ↓ Marker Trait: trait Validated {}

"Need gradual construction"
    ↓ Builder: Builder::new().field(x).build()
```

---

## Quick Reference

| Pattern | Purpose | Example |
|---------|---------|---------|
| Newtype | Type safety | `struct UserId(u64);` |
| Type State | State machine | `Connection<Connected>` |
| PhantomData | Variance/lifetime | `PhantomData<&'a T>` |
| Marker Trait | Capability flag | `trait Validated {}` |
| Builder | Gradual construction | `Builder::new().name("x").build()` |
| Sealed Trait | Prevent external impl | `mod private { pub trait Sealed {} }` |

## Pattern Examples

### Newtype

```rust
struct Email(String);  // Not just any string

impl Email {
    pub fn new(s: &str) -> Result<Self, ValidationError> {
        // Validate once, trust forever
        validate_email(s)?;
        Ok(Self(s.to_string()))
    }
}
```

### Type State

```rust
struct Connection<State>(TcpStream, PhantomData<State>);

struct Disconnected;
struct Connected;
struct Authenticated;

impl Connection<Disconnected> {
    fn connect(self) -> Connection<Connected> { ... }
}

impl Connection<Connected> {
    fn authenticate(self) -> Connection<Authenticated> { ... }
}
```

---

## Decision Guide

| Need | Pattern |
|------|---------|
| Type safety for primitives | Newtype |
| Compile-time state validation | Type State |
| Lifetime/variance markers | PhantomData |
| Capability flags | Marker Trait |
| Gradual construction | Builder |
| Closed set of impls | Sealed Trait |
| Zero-sized type marker | ZST struct |

---

## Anti-Patterns

| Anti-Pattern | Why Bad | Better |
|--------------|---------|--------|
| Boolean flags for states | Runtime errors | Type state |
| String for semantic types | No type safety | Newtype |
| Option for uninitialized | Unclear invariant | Builder |
| Public fields with invariants | Invariant violation | Private + validated new() |

---

## Related Skills

| When | See |
|------|-----|
| Domain modeling | m09-domain |
| Trait design | m04-zero-cost |
| Error handling in constructors | m06-error-handling |
| Anti-patterns | m15-anti-pattern |

