import { snippet } from "./loader.js";

export interface BestPractice {
  name: string;
  topic: Topic;
  priority: "P0" | "P1";
  rule: string;
  reason: string;
  good?: string;
  bad?: string;
}

export interface DesignPattern {
  name: string;
  category: "creational" | "structural" | "behavioral" | "concurrency";
  goApproach: string;
  when: string;
  code: string;
  antiPattern?: string;
  oopEquivalent?: string;
}

export const TOPICS = [
  "fundamentals", "architecture", "error-handling", "concurrency",
  "api-server", "database", "config", "logging", "security", "testing",
] as const;
export type Topic = (typeof TOPICS)[number];

// ---------------------------------------------------------------------------
// BEST PRACTICES
// ---------------------------------------------------------------------------

export const BEST_PRACTICES: BestPractice[] = [
  // FUNDAMENTALS
  {
    name: "naming-conventions",
    topic: "fundamentals",
    priority: "P0",
    rule: "camelCase for unexported, PascalCase for exported. Short, descriptive names.",
    reason: "Go convention. Exported names are part of the package API.",
    good: snippet("practices/naming-conventions-good.md"),
    bad: snippet("practices/naming-conventions-bad.md"),
  },
  {
    name: "small-interfaces",
    topic: "fundamentals",
    priority: "P0",
    rule: "Keep interfaces small (1-2 methods). Define at consumer, not producer.",
    reason: "Go proverb: the bigger the interface, the weaker the abstraction. Consumer-side definition enables decoupling without circular deps.",
    good: snippet("practices/small-interfaces-good.md"),
    bad: snippet("practices/small-interfaces-bad.md"),
  },
  {
    name: "constructor-pattern",
    topic: "fundamentals",
    priority: "P0",
    rule: "Use NewType() constructor functions for structs requiring validation or defaults.",
    reason: "Prevents zero-value misuse. Validation at construction, not at every use site.",
    good: snippet("practices/constructor-pattern-good.md"),
  },
  // ERROR HANDLING
  {
    name: "error-wrapping",
    topic: "error-handling",
    priority: "P0",
    rule: "Always wrap errors with context: fmt.Errorf(\"context: %w\", err)",
    reason: "Provides call stack context without expensive stack traces. %w enables errors.Is/As.",
    good: snippet("practices/error-wrapping-good.md"),
    bad: snippet("practices/error-wrapping-bad.md"),
  },
  {
    name: "handle-once",
    topic: "error-handling",
    priority: "P0",
    rule: "Handle errors once: Log OR Return, never both.",
    reason: "Logging and returning causes duplicate error messages at every stack level.",
    bad: snippet("practices/handle-once-bad.md"),
    good: snippet("practices/handle-once-good.md"),
  },
  {
    name: "errors-is-as",
    topic: "error-handling",
    priority: "P0",
    rule: "Use errors.Is() for sentinel errors, errors.As() for error types.",
    reason: "Works correctly with wrapped errors (%w). Direct == comparison breaks wrapping.",
    good: snippet("practices/errors-is-as-good.md"),
    bad: snippet("practices/errors-is-as-bad.md"),
  },
  // CONCURRENCY
  {
    name: "context-first-param",
    topic: "concurrency",
    priority: "P0",
    rule: "Pass context.Context as the first parameter to every function that does I/O.",
    reason: "Enables cancellation propagation and deadline enforcement across service boundaries.",
    good: snippet("practices/context-first-param-good.md"),
    bad: snippet("practices/context-first-param-bad.md"),
  },
  {
    name: "goroutine-lifecycle",
    topic: "concurrency",
    priority: "P0",
    rule: "Never start a goroutine without knowing how it stops.",
    reason: "Goroutine leaks exhaust memory. Every goroutine needs a clear exit condition.",
    good: snippet("practices/goroutine-lifecycle-good.md"),
    bad: snippet("practices/goroutine-lifecycle-bad.md"),
  },
  {
    name: "errgroup",
    topic: "concurrency",
    priority: "P0",
    rule: "Use errgroup over WaitGroup when goroutines can fail.",
    reason: "errgroup propagates the first error and cancels the context for all siblings.",
    good: snippet("practices/errgroup-good.md"),
    bad: snippet("practices/errgroup-bad.md"),
  },
  // SECURITY
  {
    name: "crypto-rand",
    topic: "security",
    priority: "P0",
    rule: "ALWAYS use crypto/rand for security-sensitive randomness. Never math/rand.",
    reason: "math/rand is deterministic and predictable. crypto/rand uses OS entropy.",
    good: snippet("practices/crypto-rand-good.md"),
    bad: snippet("practices/crypto-rand-bad.md"),
  },
  {
    name: "parameterized-queries",
    topic: "security",
    priority: "P0",
    rule: "Always use parameterized queries. Never string concatenation for SQL.",
    reason: "SQL injection is a critical vulnerability. String concatenation is always wrong.",
    good: snippet("practices/parameterized-queries-good.md"),
    bad: snippet("practices/parameterized-queries-bad.md"),
  },
  // API SERVER
  {
    name: "graceful-shutdown",
    topic: "api-server",
    priority: "P0",
    rule: "MUST implement graceful shutdown with signal handling.",
    reason: "Without graceful shutdown, in-flight requests are aborted on deploy/restart.",
    good: snippet("practices/graceful-shutdown-good.md"),
  },
  {
    name: "thin-handlers",
    topic: "api-server",
    priority: "P0",
    rule: "Keep handlers thin: parse → call service → respond. No business logic in handlers.",
    reason: "Business logic in handlers is untestable and non-reusable.",
    good: snippet("practices/thin-handlers-good.md"),
  },
  // TESTING
  {
    name: "table-driven-tests",
    topic: "testing",
    priority: "P0",
    rule: "Use table-driven test pattern for all test cases.",
    reason: "DRY, readable, easy to add cases, works well with t.Run.",
    good: snippet("practices/table-driven-tests-good.md"),
  },
  // DATABASE
  {
    name: "database-repository",
    topic: "database",
    priority: "P0",
    rule: "Use the repository pattern with interfaces. Always use QueryContext/ExecContext with context. Always defer rows.Close().",
    reason: "Repository pattern decouples business logic from database implementation. Context enables cancellation. Forgetting rows.Close() causes connection leaks.",
    good: snippet("practices/database-repository-good.md"),
    bad: snippet("practices/database-repository-bad.md"),
  },
  // CONFIG
  {
    name: "config-env-vars",
    topic: "config",
    priority: "P1",
    rule: "Load all config from environment variables into a typed struct at startup. Validate on startup. Never scatter os.Getenv() calls.",
    reason: "Centralized validation prevents silent misconfiguration. 12-factor compliance. Typed struct makes config injectable and testable.",
    good: snippet("practices/config-env-vars-good.md"),
    bad: snippet("practices/config-env-vars-bad.md"),
  },
  // LOGGING
  {
    name: "structured-logging",
    topic: "logging",
    priority: "P1",
    rule: "Use log/slog with structured key-value pairs. JSON in production, text in development. Never log.Fatal() in libraries.",
    reason: "Structured logs are machine-parseable and alertable. log.Fatal() in libraries kills the process without allowing cleanup.",
    good: snippet("practices/structured-logging-good.md"),
    bad: snippet("practices/structured-logging-bad.md"),
  },
  // TOOLING
  {
    name: "golangci-lint",
    topic: "fundamentals",
    priority: "P1",
    rule: "Configure golangci-lint with errcheck, gosec, staticcheck, bodyclose, and noctx. Run in CI.",
    reason: "Automated linting catches error handling gaps, security issues, and resource leaks before code review.",
    good: snippet("practices/golangci-lint-good.md"),
  },
];

// ---------------------------------------------------------------------------
// DESIGN PATTERNS
// ---------------------------------------------------------------------------

export const DESIGN_PATTERNS: DesignPattern[] = [
  {
    name: "functional-options",
    category: "creational",
    goApproach: "Variadic options functions instead of config structs or builder chains",
    when: "Constructor with 5+ optional parameters",
    oopEquivalent: "Builder pattern",
    code: snippet("patterns/functional-options.md"),
  },
  {
    name: "adapter",
    category: "structural",
    goApproach: "Wrapper struct that implements an interface using a different underlying type",
    when: "Integrating external libraries or legacy code behind a clean interface",
    oopEquivalent: "Adapter / Wrapper",
    code: snippet("patterns/adapter.md"),
  },
  {
    name: "middleware-decorator",
    category: "structural",
    goApproach: "Higher-order functions wrapping handlers — the standard HTTP middleware pattern",
    when: "Adding cross-cutting behavior (logging, auth, rate limiting) without modifying handlers",
    oopEquivalent: "Decorator pattern",
    code: snippet("patterns/middleware-decorator.md"),
  },
  {
    name: "worker-pool",
    category: "concurrency",
    goApproach: "Bounded goroutine pool using buffered channel as semaphore",
    when: "Parallel work with bounded concurrency (CPU/network limits)",
    code: snippet("patterns/worker-pool.md"),
  },
  {
    name: "pipeline",
    category: "concurrency",
    goApproach: "Chain of goroutines connected by channels — each stage transforms the stream",
    when: "Stage-by-stage stream processing (ETL, data transformation)",
    code: snippet("patterns/pipeline.md"),
  },
  {
    name: "consumer-side-interface",
    category: "structural",
    goApproach: "Define interfaces in the consuming package, not the implementing package",
    when: "Always — this is the idiomatic Go approach to dependency management",
    code: snippet("patterns/consumer-side-interface.md"),
    antiPattern: snippet("patterns/consumer-side-interface-anti.md"),
  },
  {
    name: "strategy",
    category: "behavioral",
    goApproach: "Interface injection — pass the algorithm as a function or interface",
    when: "Multiple algorithms that can be swapped at runtime",
    oopEquivalent: "Strategy pattern",
    code: snippet("patterns/strategy.md"),
  },
  {
    name: "fan-out-fan-in",
    category: "concurrency",
    goApproach: "Distribute work across N goroutines (fan-out), then merge results into one channel (fan-in)",
    when: "Parallel independent work items with result collection",
    code: snippet("patterns/fan-out-fan-in.md"),
  },
  {
    name: "observer",
    category: "behavioral",
    goApproach: "Channel-based event bus — subscribers receive from buffered channels",
    when: "Decoupling event producers from consumers without shared state",
    oopEquivalent: "Observer / Pub-Sub pattern",
    code: snippet("patterns/observer.md"),
  },
  {
    name: "command",
    category: "behavioral",
    goApproach: "Function closures as commands — submitted to a worker channel for execution",
    when: "Job queues, undo stacks, deferred execution, task pipelines",
    oopEquivalent: "Command pattern",
    code: snippet("patterns/command.md"),
  },
];

// ---------------------------------------------------------------------------
// ANTI-PATTERNS
// ---------------------------------------------------------------------------

export const ANTI_PATTERNS = [
  { name: "global-mutable-state", description: "Global vars for dependency storage", fix: "Dependency injection — pass deps to constructors" },
  { name: "ignoring-errors", description: "_ = someFunc() or no error check", fix: "Always handle: return, log, or wrap" },
  { name: "business-logic-in-handlers", description: "DB queries, computations in HTTP handlers", fix: "Thin handlers — delegate to service layer" },
  { name: "sql-string-concat", description: "\"SELECT * WHERE id = \" + id", fix: "Always use parameterized queries ($1, ?, ?)" },
  { name: "math-rand-security", description: "math/rand for tokens/secrets", fix: "crypto/rand always for security-sensitive values" },
  { name: "goroutine-leak", description: "Goroutine with no exit condition", fix: "Always pass ctx, select on ctx.Done()" },
  { name: "missing-context", description: "Functions doing I/O without ctx parameter", fix: "First param is always context.Context for I/O" },
  { name: "not-closing-rows", description: "db.QueryContext without defer rows.Close()", fix: "Always defer rows.Close() immediately after query" },
  { name: "log-and-return", description: "log.Printf(err) then return err", fix: "Choose one: return (let caller log) or log (don't return)" },
  { name: "sleep-in-tests", description: "time.Sleep(100*ms) waiting for async", fix: "Use channels, select, or sync primitives" },
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

export function getPracticesByTopic(topic: Topic): BestPractice[] {
  return BEST_PRACTICES.filter((p) => p.topic === topic);
}

export function getPatternsByCategory(cat: string): DesignPattern[] {
  return DESIGN_PATTERNS.filter((p) => p.category === cat);
}

export function searchAll(query: string): { practices: BestPractice[]; patterns: DesignPattern[] } {
  const q = query.toLowerCase();
  return {
    practices: BEST_PRACTICES.filter(
      (p) => p.name.includes(q) || p.rule.toLowerCase().includes(q) || p.topic.includes(q)
    ),
    patterns: DESIGN_PATTERNS.filter(
      (p) => p.name.includes(q) || p.goApproach.toLowerCase().includes(q) || p.category.includes(q)
    ),
  };
}
