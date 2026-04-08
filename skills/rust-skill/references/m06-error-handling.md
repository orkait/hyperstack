# m06-error-handling

# Error Handling - Agent Integration

> **Skill:** m06-error-handling
> **Agent:** error-handling-expert

## Quick Reference

This skill handles error handling design and implementation in Rust. It can delegate to the error-handling-expert agent for comprehensive error strategy design.

## When to Use Agent

Use the agent when:
- Designing error types for a new module/crate
- Refactoring existing error handling
- Choosing between error handling approaches
- Implementing error recovery strategies
- Converting between error types

## Agent Invocation

```
Task(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: <read from ../../agents/error-handling-expert.md>
)
```

## Error Handling Scenarios

| Scenario | Agent Helps With |
|----------|------------------|
| Library error design | Custom error type design with thiserror |
| Application errors | anyhow integration and context |
| Error conversion | From/Into implementations |
| Error propagation | ? operator and error chains |
| Error recovery | Fallback and retry strategies |
| User-facing errors | Error message design |

## Workflow

### Inline Mode (Simple Cases)
1. Identify error handling need
2. Apply pattern from skill reference
3. Implement with Result<T, E>

### Agent Mode (Complex Design)
1. Describe error handling requirements
2. Invoke error-handling-expert agent
3. Agent designs error type hierarchy
4. Agent provides implementation
5. Apply and test error handling
6. Validate with error scenarios

## Library vs Application

### Library Error Design (Use Agent)
```
Requirements:
- Public API with custom errors
- Callers need to match on errors
- Error context and recovery

Agent provides:
- Custom error enum design
- thiserror implementation
- Conversion implementations
- Documentation
```

### Application Error Design (Use Agent)
```
Requirements:
- Internal error handling
- Good error messages
- Context at each layer

Agent provides:
- anyhow integration
- Context strategy
- Error logging approach
- User-facing messages
```

## Agent Output Format

The agent provides:
- **Current Approach**: Analysis of existing error handling
- **Issues Identified**: Problems with current approach
- **Recommended Design**: Error type definitions
- **Usage Examples**: How to use the error types
- **Propagation Strategy**: How errors flow through system
- **Recovery Strategy**: How to handle/recover from errors

## Common Patterns

### Pattern 1: Custom Error Type
```rust
#[derive(Error, Debug)]
pub enum MyError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Parse error: {0}")]
    Parse(String),
}
```

### Pattern 2: Application Errors
```rust
use anyhow::{Context, Result};

fn load() -> Result<Data> {
    let data = read_file()
        .context("Failed to read file")?;
    Ok(data)
}
```

### Pattern 3: Error Recovery
```rust
let data = load_from_cache()
    .or_else(|_| load_from_network())
    .unwrap_or_default();
```

## Related Agents

- **ownership-analyzer**: For lifetime issues with errors
- **refactor-assistant**: For error handling refactoring
- **code-navigator**: For finding error usage

## Success Criteria

Agent invocation is successful when:
1. Error types match use case (library vs app)
2. Errors are actionable and informative
3. Error propagation is clean (? operator)
4. Recovery strategies are appropriate
5. Error messages help debugging

---
name: m06-error-handling
description: "CRITICAL: Use for error handling. Triggers: Result, Option, Error, ?, unwrap, expect, panic, anyhow, thiserror, when to panic vs return Result, custom error, error propagation, 错误处理, Result 用法, 什么时候用 panic"
user-invocable: false
---

# Error Handling

> **Layer 1: Language Mechanics**

## Core Question

**Is this failure expected or a bug?**

Before choosing error handling strategy:
- Can this fail in normal operation?
- Who should handle this failure?
- What context does the caller need?

---

## Error → Design Question

| Pattern | Don't Just Say | Ask Instead |
|---------|----------------|-------------|
| unwrap panics | "Use ?" | Is None/Err actually possible here? |
| Type mismatch on ? | "Use anyhow" | Are error types designed correctly? |
| Lost error context | "Add .context()" | What does the caller need to know? |
| Too many error variants | "Use Box<dyn Error>" | Is error granularity right? |

---

## Thinking Prompt

Before handling an error:

1. **What kind of failure is this?**
   - Expected → Result<T, E>
   - Absence normal → Option<T>
   - Bug/invariant → panic!
   - Unrecoverable → panic!

2. **Who handles this?**
   - Caller → propagate with ?
   - Current function → match/if-let
   - User → friendly error message
   - Programmer → panic with message

3. **What context is needed?**
   - Type of error → thiserror variants
   - Call chain → anyhow::Context
   - Debug info → anyhow or tracing

---

## Trace Up ↑

When error strategy is unclear:

```
"Should I return Result or Option?"
    ↑ Ask: Is absence/failure normal or exceptional?
    ↑ Check: m09-domain (what does domain say?)
    ↑ Check: domain-* (error handling requirements)
```

| Situation | Trace To | Question |
|-----------|----------|----------|
| Too many unwraps | m09-domain | Is the data model right? |
| Error context design | m13-domain-error | What recovery is needed? |
| Library vs app errors | m11-ecosystem | Who are the consumers? |

---

## Trace Down ↓

From design to implementation:

```
"Expected failure, library code"
    ↓ Use: thiserror for typed errors

"Expected failure, application code"
    ↓ Use: anyhow for ergonomic errors

"Absence is normal (find, get, lookup)"
    ↓ Use: Option<T>

"Bug or invariant violation"
    ↓ Use: panic!, assert!, unreachable!

"Need to propagate with context"
    ↓ Use: .context("what was happening")
```

---

## Quick Reference

| Pattern | When | Example |
|---------|------|---------|
| `Result<T, E>` | Recoverable error | `fn read() -> Result<String, io::Error>` |
| `Option<T>` | Absence is normal | `fn find() -> Option<&Item>` |
| `?` | Propagate error | `let data = file.read()?;` |
| `unwrap()` | Dev/test only | `config.get("key").unwrap()` |
| `expect()` | Invariant holds | `env.get("HOME").expect("HOME set")` |
| `panic!` | Unrecoverable | `panic!("critical failure")` |

## Library vs Application

| Context | Error Crate | Why |
|---------|-------------|-----|
| Library | `thiserror` | Typed errors for consumers |
| Application | `anyhow` | Ergonomic error handling |
| Mixed | Both | thiserror at boundaries, anyhow internally |

## Decision Flowchart

```
Is failure expected?
├─ Yes → Is absence the only "failure"?
│        ├─ Yes → Option<T>
│        └─ No → Result<T, E>
│                 ├─ Library → thiserror
│                 └─ Application → anyhow
└─ No → Is it a bug?
        ├─ Yes → panic!, assert!
        └─ No → Consider if really unrecoverable

Use ? → Need context?
├─ Yes → .context("message")
└─ No → Plain ?
```

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `unwrap()` panic | Unhandled None/Err | Use `?` or match |
| Type mismatch | Different error types | Use `anyhow` or `From` |
| Lost context | `?` without context | Add `.context()` |
| `cannot use ?` | Missing Result return | Return `Result<(), E>` |

---

## Anti-Patterns

| Anti-Pattern | Why Bad | Better |
|--------------|---------|--------|
| `.unwrap()` everywhere | Panics in production | `.expect("reason")` or `?` |
| Ignore errors silently | Bugs hidden | Handle or propagate |
| `panic!` for expected errors | Bad UX, no recovery | Result |
| Box<dyn Error> everywhere | Lost type info | thiserror |

---

## Related Skills

| When | See |
|------|-----|
| Domain error strategy | m13-domain-error |
| Crate boundaries | m11-ecosystem |
| Type-safe errors | m05-type-driven |
| Mental models | m14-mental-model |

# Error Handling: Library vs Application

## Library Error Design

### Principles
1. **Define specific error types** - Don't use `anyhow` in libraries
2. **Implement std::error::Error** - For compatibility
3. **Provide error variants** - Let users match on errors
4. **Include source errors** - Enable error chains
5. **Be `Send + Sync`** - For async compatibility

### Example: Library Error Type
```rust
// lib.rs
use thiserror::Error;

#[derive(Error, Debug)]
pub enum DatabaseError {
    #[error("connection failed: {host}:{port}")]
    ConnectionFailed {
        host: String,
        port: u16,
        #[source]
        source: std::io::Error,
    },

    #[error("query failed: {query}")]
    QueryFailed {
        query: String,
        #[source]
        source: SqlError,
    },

    #[error("record not found: {table}.{id}")]
    NotFound { table: String, id: String },

    #[error("constraint violation: {0}")]
    ConstraintViolation(String),
}

// Public Result alias
pub type Result<T> = std::result::Result<T, DatabaseError>;

// Library functions
pub fn connect(host: &str, port: u16) -> Result<Connection> {
    // ...
}

pub fn query(conn: &Connection, sql: &str) -> Result<Rows> {
    // ...
}
```

### Library Usage of Errors
```rust
impl Database {
    pub fn get_user(&self, id: &str) -> Result<User> {
        let rows = self.query(&format!("SELECT * FROM users WHERE id = '{}'", id))?;

        rows.first()
            .cloned()
            .ok_or_else(|| DatabaseError::NotFound {
                table: "users".to_string(),
                id: id.to_string(),
            })
    }
}
```

---

## Application Error Design

### Principles
1. **Use anyhow for convenience** - Or custom unified error
2. **Add context liberally** - Help debugging
3. **Log at boundaries** - Don't log in libraries
4. **Convert to user-friendly messages** - For display

### Example: Application Error Handling
```rust
// main.rs
use anyhow::{Context, Result};
use tracing::{error, info};

async fn run_server() -> Result<()> {
    let config = load_config()
        .context("failed to load configuration")?;

    let db = Database::connect(&config.db_url)
        .await
        .context("failed to connect to database")?;

    let server = Server::new(config.port)
        .context("failed to create server")?;

    info!("Server starting on port {}", config.port);

    server.run(db).await
        .context("server error")?;

    Ok(())
}

#[tokio::main]
async fn main() {
    tracing_subscriber::init();

    if let Err(e) = run_server().await {
        error!("Application error: {:#}", e);
        std::process::exit(1);
    }
}
```

### Converting Library Errors
```rust
use mylib::DatabaseError;

async fn get_user_handler(id: &str) -> Result<Response> {
    match db.get_user(id).await {
        Ok(user) => Ok(Response::json(user)),

        Err(DatabaseError::NotFound { .. }) => {
            Ok(Response::not_found("User not found"))
        }

        Err(DatabaseError::ConnectionFailed { .. }) => {
            error!("Database connection failed");
            Ok(Response::internal_error("Service unavailable"))
        }

        Err(e) => {
            error!("Database error: {}", e);
            Err(e.into())  // Convert to anyhow::Error
        }
    }
}
```

---

## Error Handling Layers

```
┌─────────────────────────────────────┐
│           Application Layer          │
│  - Use anyhow or unified error       │
│  - Add context at boundaries         │
│  - Log errors                        │
│  - Convert to user messages          │
└─────────────────────────────────────┘
                 │
                 │ calls
                 ▼
┌─────────────────────────────────────┐
│           Service Layer              │
│  - Map between error types           │
│  - Add business context              │
│  - Handle recoverable errors         │
└─────────────────────────────────────┘
                 │
                 │ calls
                 ▼
┌─────────────────────────────────────┐
│           Library Layer              │
│  - Define specific error types       │
│  - Use thiserror                     │
│  - Include source errors             │
│  - No logging                        │
└─────────────────────────────────────┘
```

---

## Practical Examples

### HTTP API Error Response
```rust
use axum::{response::IntoResponse, http::StatusCode};
use serde::Serialize;

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
    code: String,
}

enum AppError {
    NotFound(String),
    BadRequest(String),
    Internal(anyhow::Error),
}

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        let (status, error, code) = match self {
            AppError::NotFound(msg) => {
                (StatusCode::NOT_FOUND, msg, "NOT_FOUND")
            }
            AppError::BadRequest(msg) => {
                (StatusCode::BAD_REQUEST, msg, "BAD_REQUEST")
            }
            AppError::Internal(e) => {
                tracing::error!("Internal error: {:#}", e);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Internal server error".to_string(),
                    "INTERNAL_ERROR",
                )
            }
        };

        let body = ErrorResponse {
            error,
            code: code.to_string(),
        };

        (status, axum::Json(body)).into_response()
    }
}
```

### CLI Error Handling
```rust
use anyhow::{Context, Result};
use clap::Parser;

#[derive(Parser)]
struct Args {
    #[arg(short, long)]
    config: String,
}

fn main() {
    if let Err(e) = run() {
        eprintln!("Error: {:#}", e);
        std::process::exit(1);
    }
}

fn run() -> Result<()> {
    let args = Args::parse();

    let config = std::fs::read_to_string(&args.config)
        .context(format!("Failed to read config file: {}", args.config))?;

    let parsed: Config = toml::from_str(&config)
        .context("Failed to parse config file")?;

    process(parsed)?;

    println!("Done!");
    Ok(())
}
```

---

## Testing Error Handling

### Testing Error Cases
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_not_found_error() {
        let result = db.get_user("nonexistent");

        assert!(matches!(
            result,
            Err(DatabaseError::NotFound { table, id })
            if table == "users" && id == "nonexistent"
        ));
    }

    #[test]
    fn test_error_message() {
        let err = DatabaseError::NotFound {
            table: "users".to_string(),
            id: "123".to_string(),
        };

        assert_eq!(err.to_string(), "record not found: users.123");
    }

    #[test]
    fn test_error_chain() {
        let io_err = std::io::Error::new(
            std::io::ErrorKind::ConnectionRefused,
            "connection refused"
        );

        let err = DatabaseError::ConnectionFailed {
            host: "localhost".to_string(),
            port: 5432,
            source: io_err,
        };

        // Check source is preserved
        assert!(err.source().is_some());
    }
}
```

### Testing with anyhow
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_with_context() -> anyhow::Result<()> {
        let result = process("valid input")?;
        assert_eq!(result, expected);
        Ok(())
    }

    #[test]
    fn test_error_context() {
        let err = process("invalid")
            .context("processing failed")
            .unwrap_err();

        // Check error chain contains expected text
        let chain = format!("{:#}", err);
        assert!(chain.contains("processing failed"));
    }
}
```

# Error Handling Patterns

## The ? Operator

### Basic Usage
```rust
fn read_config() -> Result<Config, io::Error> {
    let content = std::fs::read_to_string("config.toml")?;
    let config: Config = toml::from_str(&content)?;  // needs From impl
    Ok(config)
}
```

### With Different Error Types
```rust
use std::error::Error;

// Box<dyn Error> for quick prototyping
fn process() -> Result<(), Box<dyn Error>> {
    let file = std::fs::read_to_string("data.txt")?;
    let num: i32 = file.trim().parse()?;  // different error type
    Ok(())
}
```

### Custom Conversion with From
```rust
#[derive(Debug)]
enum MyError {
    Io(std::io::Error),
    Parse(std::num::ParseIntError),
}

impl From<std::io::Error> for MyError {
    fn from(err: std::io::Error) -> Self {
        MyError::Io(err)
    }
}

impl From<std::num::ParseIntError> for MyError {
    fn from(err: std::num::ParseIntError) -> Self {
        MyError::Parse(err)
    }
}

fn process() -> Result<i32, MyError> {
    let content = std::fs::read_to_string("num.txt")?;  // auto-converts
    let num: i32 = content.trim().parse()?;  // auto-converts
    Ok(num)
}
```

---

## Error Type Design

### Simple Enum Error
```rust
#[derive(Debug, Clone, PartialEq)]
pub enum ConfigError {
    NotFound,
    InvalidFormat,
    MissingField(String),
}

impl std::fmt::Display for ConfigError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ConfigError::NotFound => write!(f, "configuration file not found"),
            ConfigError::InvalidFormat => write!(f, "invalid configuration format"),
            ConfigError::MissingField(field) => write!(f, "missing field: {}", field),
        }
    }
}

impl std::error::Error for ConfigError {}
```

### Error with Source (Wrapping)
```rust
#[derive(Debug)]
pub struct AppError {
    kind: AppErrorKind,
    source: Option<Box<dyn std::error::Error + Send + Sync>>,
}

#[derive(Debug, Clone, Copy)]
pub enum AppErrorKind {
    Config,
    Database,
    Network,
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self.kind {
            AppErrorKind::Config => write!(f, "configuration error"),
            AppErrorKind::Database => write!(f, "database error"),
            AppErrorKind::Network => write!(f, "network error"),
        }
    }
}

impl std::error::Error for AppError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        self.source.as_ref().map(|e| e.as_ref() as _)
    }
}
```

---

## Using thiserror

### Basic Usage
```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum DataError {
    #[error("file not found: {path}")]
    NotFound { path: String },

    #[error("invalid data format")]
    InvalidFormat,

    #[error("IO error")]
    Io(#[from] std::io::Error),

    #[error("parse error: {0}")]
    Parse(#[from] std::num::ParseIntError),
}

// Usage
fn load_data(path: &str) -> Result<Data, DataError> {
    let content = std::fs::read_to_string(path)
        .map_err(|_| DataError::NotFound { path: path.to_string() })?;
    let num: i32 = content.trim().parse()?;  // auto-converts with #[from]
    Ok(Data { value: num })
}
```

### Transparent Wrapper
```rust
use thiserror::Error;

#[derive(Error, Debug)]
#[error(transparent)]
pub struct MyError(#[from] InnerError);

// Useful for newtype error wrappers
```

---

## Using anyhow

### For Applications
```rust
use anyhow::{Context, Result, bail, ensure};

fn process_file(path: &str) -> Result<Data> {
    let content = std::fs::read_to_string(path)
        .context("failed to read config file")?;

    ensure!(!content.is_empty(), "config file is empty");

    let data: Data = serde_json::from_str(&content)
        .context("failed to parse JSON")?;

    if data.version < 1 {
        bail!("unsupported config version: {}", data.version);
    }

    Ok(data)
}

fn main() -> Result<()> {
    let data = process_file("config.json")
        .context("failed to load configuration")?;
    Ok(())
}
```

### Error Chain
```rust
use anyhow::{Context, Result};

fn deep_function() -> Result<()> {
    std::fs::read_to_string("missing.txt")
        .context("failed to read file")?;
    Ok(())
}

fn middle_function() -> Result<()> {
    deep_function()
        .context("failed in deep function")?;
    Ok(())
}

fn top_function() -> Result<()> {
    middle_function()
        .context("failed in middle function")?;
    Ok(())
}

// Error output shows full chain:
// Error: failed in middle function
// Caused by:
//     0: failed in deep function
//     1: failed to read file
//     2: No such file or directory (os error 2)
```

---

## Option Handling

### Converting Option to Result
```rust
fn find_user(id: u32) -> Option<User> { ... }

// Using ok_or for static error
fn get_user(id: u32) -> Result<User, &'static str> {
    find_user(id).ok_or("user not found")
}

// Using ok_or_else for dynamic error
fn get_user(id: u32) -> Result<User, String> {
    find_user(id).ok_or_else(|| format!("user {} not found", id))
}
```

### Chaining Options
```rust
fn get_nested_value(data: &Data) -> Option<&str> {
    data.config
        .as_ref()?
        .nested
        .as_ref()?
        .value
        .as_deref()
}

// Equivalent with and_then
fn get_nested_value(data: &Data) -> Option<&str> {
    data.config
        .as_ref()
        .and_then(|c| c.nested.as_ref())
        .and_then(|n| n.value.as_deref())
}
```

---

## Pattern: Result Combinators

### map and map_err
```rust
fn parse_port(s: &str) -> Result<u16, ParseError> {
    s.parse::<u16>()
        .map_err(|e| ParseError::InvalidPort(e))
}

fn get_url(config: &Config) -> Result<String, Error> {
    config.url()
        .map(|u| format!("https://{}", u))
}
```

### and_then (flatMap)
```rust
fn validate_and_save(input: &str) -> Result<(), Error> {
    validate(input)
        .and_then(|valid| save(valid))
        .and_then(|saved| notify(saved))
}
```

### unwrap_or and unwrap_or_else
```rust
// Default value
let port = config.port().unwrap_or(8080);

// Computed default
let port = config.port().unwrap_or_else(|| find_free_port());

// Default for Result
let data = load_data().unwrap_or_default();
```

---

## Pattern: Early Return vs Combinators

### Early Return Style
```rust
fn process(input: &str) -> Result<Output, Error> {
    let step1 = validate(input)?;
    if !step1.is_valid {
        return Err(Error::Invalid);
    }

    let step2 = transform(step1)?;
    let step3 = save(step2)?;

    Ok(step3)
}
```

### Combinator Style
```rust
fn process(input: &str) -> Result<Output, Error> {
    validate(input)
        .and_then(|s| {
            if s.is_valid {
                Ok(s)
            } else {
                Err(Error::Invalid)
            }
        })
        .and_then(transform)
        .and_then(save)
}
```

### When to Use Which

| Style | Best For |
|-------|----------|
| Early return (`?`) | Most cases, clearer flow |
| Combinators | Functional pipelines, one-liners |
| Match | Complex branching on errors |

---

## Panic vs Result

### When to Panic
```rust
// 1. Unrecoverable programmer error
fn get_config() -> &'static Config {
    CONFIG.get().expect("config must be initialized")
}

// 2. In tests
#[test]
fn test_parsing() {
    let result = parse("valid").unwrap();  // OK in tests
    assert_eq!(result, expected);
}

// 3. Prototype/examples
fn main() {
    let data = load().unwrap();  // OK for quick examples
}
```

### When to Return Result
```rust
// 1. Any I/O operation
fn read_file(path: &str) -> Result<String, io::Error>

// 2. User input validation
fn parse_port(s: &str) -> Result<u16, ParseError>

// 3. Network operations
async fn fetch(url: &str) -> Result<Response, Error>

// 4. Anything that can fail at runtime
fn connect(addr: &str) -> Result<Connection, Error>
```

---

## Error Context Best Practices

### Add Context at Boundaries
```rust
fn load_user_config(user_id: u64) -> Result<Config, Error> {
    let path = format!("/home/{}/config.toml", user_id);

    std::fs::read_to_string(&path)
        .context(format!("failed to read config for user {}", user_id))?
        // NOT: .context("failed to read file")  // too generic

    // ...
}
```

### Include Relevant Data
```rust
// Good: includes the problematic value
fn parse_age(s: &str) -> Result<u8, Error> {
    s.parse()
        .context(format!("invalid age value: '{}'", s))
}

// Bad: no context about what failed
fn parse_age(s: &str) -> Result<u8, Error> {
    s.parse()
        .context("parse error")
}
```

