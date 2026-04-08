import { snippet } from "./loader.js";

export interface BestPractice {
  name: string;
  chapter: Chapter;
  rule: string;
  reason: string;
  good?: string;
  bad?: string;
  tips?: string[];
}

export const CHAPTERS = [
  "coding-styles", "clippy", "performance", "error-handling",
  "testing", "generics", "type-state", "documentation", "pointers",
] as const;
export type Chapter = (typeof CHAPTERS)[number];

// ---------------------------------------------------------------------------
// BEST PRACTICES
// ---------------------------------------------------------------------------

export const BEST_PRACTICES: BestPractice[] = [
  // CODING STYLES
  {
    name: "borrow-over-clone",
    chapter: "coding-styles",
    rule: "Prefer &T over .clone() unless ownership transfer is required.",
    reason: "Cloning allocates heap memory unnecessarily. References are zero-cost.",
    good: snippet("practices/borrow-over-clone-good.txt"),
    bad: snippet("practices/borrow-over-clone-bad.txt"),
  },
  {
    name: "str-over-string",
    chapter: "coding-styles",
    rule: "Use &str over String, &[T] over Vec<T> in function parameters.",
    reason: "&str accepts both &String and string literals. More flexible and zero-copy.",
    good: snippet("practices/str-over-string-good.txt"),
    bad: snippet("practices/str-over-string-bad.txt"),
  },
  {
    name: "copy-by-value",
    chapter: "coding-styles",
    rule: "Small Copy types (≤24 bytes) can be passed by value — no need for &T.",
    reason: "Copying small types (u32, bool, small structs) is as fast or faster than a reference.",
    good: snippet("practices/copy-by-value-good.txt"),
  },
  {
    name: "cow-ambiguous-ownership",
    chapter: "coding-styles",
    rule: "Use Cow<'_, T> when ownership is sometimes required and sometimes not.",
    reason: "Avoids always cloning (wasteful) or always borrowing (restrictive).",
    good: snippet("practices/cow-ambiguous-ownership-good.txt"),
  },

  // ERROR HANDLING
  {
    name: "result-not-panic",
    chapter: "error-handling",
    rule: "Return Result<T, E> for fallible operations. Never panic! in production code.",
    reason: "panic! unwinds the stack and kills the thread. Use it only for programmer errors.",
    good: snippet("practices/result-not-panic-good.txt"),
    bad: snippet("practices/result-not-panic-bad.txt"),
  },
  {
    name: "no-unwrap-in-prod",
    chapter: "error-handling",
    rule: "Never use unwrap() or expect() outside of tests.",
    reason: "Both panic on None/Err. Use ? operator or proper error handling.",
    good: snippet("practices/no-unwrap-in-prod-good.txt"),
    bad: snippet("practices/no-unwrap-in-prod-bad.txt"),
    tips: ["expect() is slightly better than unwrap() (message on panic), but still banned in prod"],
  },
  {
    name: "thiserror-vs-anyhow",
    chapter: "error-handling",
    rule: "thiserror for library errors, anyhow for binary/application errors.",
    reason: "Libraries need typed errors (callers match on them). Binaries just need context strings.",
    good: snippet("practices/thiserror-vs-anyhow-good.txt"),
  },

  // PERFORMANCE
  {
    name: "benchmark-release",
    chapter: "performance",
    rule: "Always benchmark with --release flag. Debug builds are 10-100x slower.",
    reason: "Debug builds disable optimizations. Benchmarks without --release are meaningless.",
    good: snippet("practices/benchmark-release-good.txt"),
    bad: snippet("practices/benchmark-release-bad.txt"),
  },
  {
    name: "avoid-clone-in-loops",
    chapter: "performance",
    rule: "Avoid cloning in loops. Use .iter() instead of .into_iter() for Copy types.",
    reason: "Cloning in a loop = N allocations. References or Copy types are zero-cost.",
    good: snippet("practices/avoid-clone-in-loops-good.txt"),
    bad: snippet("practices/avoid-clone-in-loops-bad.txt"),
  },
  {
    name: "prefer-iterators",
    chapter: "performance",
    rule: "Prefer iterator chains over manual loops. Avoid premature .collect().",
    reason: "Iterators are lazy — they don't allocate until consumed. collect() is the allocation point.",
    good: snippet("practices/prefer-iterators-good.txt"),
    bad: snippet("practices/prefer-iterators-bad.txt"),
  },

  // CLIPPY
  {
    name: "clippy-command",
    chapter: "clippy",
    rule: "Run: cargo clippy --all-targets --all-features --locked -- -D warnings",
    reason: "Catches common mistakes, redundant code, and performance issues automatically.",
    tips: [
      "Add to CI to enforce on every PR",
      "Key lints: redundant_clone, large_enum_variant, needless_collect",
      "Use #[expect(clippy::lint)] with justification comment, not #[allow(...)]",
    ],
  },
  {
    name: "expect-over-allow",
    chapter: "clippy",
    rule: "Use #[expect(clippy::lint_name)] over #[allow(...)]. Add a justification comment.",
    reason: "#[expect] fails if the warning no longer fires (lint was fixed). #[allow] silently rots.",
    good: snippet("practices/expect-over-allow-good.txt"),
    bad: snippet("practices/expect-over-allow-bad.txt"),
  },

  // TESTING
  {
    name: "descriptive-test-names",
    chapter: "testing",
    rule: "Name tests descriptively: process_should_return_error_when_input_empty()",
    reason: "Test names are documentation. Vague names like test_process() don't explain what's tested.",
    good: snippet("practices/descriptive-test-names-good.txt"),
    bad: snippet("practices/descriptive-test-names-bad.txt"),
  },
  {
    name: "one-assertion-per-test",
    chapter: "testing",
    rule: "One assertion per test when possible.",
    reason: "Multiple assertions in one test: first failure hides the rest. Separate tests give clearer failures.",
    good: snippet("practices/one-assertion-per-test-good.txt"),
  },
  {
    name: "doc-tests",
    chapter: "documentation",
    rule: "Use doc tests (///) for public API usage examples. They run with cargo test.",
    reason: "Doc tests are the only examples guaranteed to stay correct — they compile and run.",
    good: snippet("practices/doc-tests-good.txt"),
  },

  // GENERICS
  {
    name: "static-over-dynamic-dispatch",
    chapter: "generics",
    rule: "Prefer generics (static dispatch) for performance-critical code. Use dyn Trait for heterogeneous collections.",
    reason: "Generics monomorphize at compile time — zero runtime cost. dyn Trait has vtable overhead.",
    good: snippet("practices/static-over-dynamic-dispatch-good.txt"),
  },

  // TYPE STATE
  {
    name: "type-state-pattern",
    chapter: "type-state",
    rule: "Encode valid state transitions in the type system using PhantomData.",
    reason: "Catches invalid operations at compile time, not runtime. Zero cost abstraction.",
    good: snippet("practices/type-state-pattern-good.txt"),
    tips: ["Use when invalid state transitions are a real risk", "Don't over-engineer — simple enums often suffice"],
  },

  // POINTERS
  {
    name: "send-sync",
    chapter: "pointers",
    rule: "Understand Send + Sync before sharing data across threads.",
    reason: "Send = safe to move to another thread. Sync = safe to share reference across threads. Wrong use = data races.",
    tips: [
      "Arc<T>: shared ownership across threads (T: Send + Sync)",
      "Mutex<T>: interior mutability for T: Send",
      "Rc<T> and RefCell<T> are NOT thread-safe — local only",
    ],
    good: snippet("practices/send-sync-good.txt"),
    bad: snippet("practices/send-sync-bad.txt"),
  },
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

export function getPracticesByChapter(chapter: Chapter): BestPractice[] {
  return BEST_PRACTICES.filter((p) => p.chapter === chapter);
}

export function searchPractices(query: string): BestPractice[] {
  const q = query.toLowerCase();
  return BEST_PRACTICES.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.rule.toLowerCase().includes(q) ||
      p.chapter.toLowerCase().includes(q) ||
      (p.reason?.toLowerCase().includes(q) ?? false)
  );
}
