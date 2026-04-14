---
name: design-patterns-skill
category: domain
description: Apply core programming principles and design patterns from Clean Code, The Pragmatic Programmer, Code Complete, Refactoring, and Design Patterns. Use when writing code, reviewing PRs, refactoring, or designing system architecture.
triggers:
  - "code review"
  - "design pattern"
  - "refactor"
  - "clean code"
  - "SOLID"
  - "code quality"
  - "architecture design"
  - "code generation"
activation:
  mode: fuzzy
  priority: normal
  triggers:
    - "code review"
    - "design pattern"
    - "refactor"
    - "clean code"
    - "SOLID"
    - "code quality"
    - "architecture design"
    - "code generation"
compatibility: ">=1.0.0"
metadata:
  version: "1.0.0"
references:
  - references/patterns/readability.md
  - references/patterns/simplicity.md
  - references/patterns/design-architecture.md
  - references/patterns/testing.md
  - references/patterns/error-handling.md
  - references/patterns/maintainability.md
---

# Design Patterns & Programming Principles

## When to Apply

- **Code Generation** → writing new functions, classes, or modules
- **Code Review** → evaluating PRs or existing codebases
- **Refactoring** → improving code structure and clarity
- **Architecture Design** → choosing appropriate patterns and abstractions

## Core Philosophy

1. Readability over cleverness → code is read more than written
2. Simplicity over complexity → simplest solution that works
3. Testability by design → write code that's easy to test
4. Incremental improvement → leave code better than you found it
5. Patterns as tools → apply when they clarify, not by default

## Principle Categories

### 1. Readability & Clarity
Descriptive naming, consistent formatting, self-documenting code, small focused functions
→ `references/patterns/readability.md`

### 2. Simplicity & Efficiency
KISS, DRY, YAGNI
→ `references/patterns/simplicity.md`

### 3. Design & Architecture
SRP, composition over inheritance, program to interfaces
Patterns: Factory, Strategy, Observer, Decorator, Adapter, Command, Singleton
→ `references/patterns/design-architecture.md`

### 4. Testing & Quality
Automated testing, focused assertions, edge case coverage
→ `references/patterns/testing.md`

### 5. Error Handling
Clear error messages, early validation, proper exception usage
→ `references/patterns/error-handling.md`

### 6. Maintainability
Boy Scout Rule, continuous refactoring, atomic commits, automation
→ `references/patterns/maintainability.md`

## AI-Specific Guidance

When generating or reviewing code:
1. Check for AI pitfalls listed in each principle
2. Avoid pattern prediction bias → don't use patterns just because they're common
3. Question generic naming → resist `data`, `temp`, `result` without context
4. Validate edge cases → don't skip error handling
5. Keep functions focused → resist combining unrelated operations
6. Match project conventions → maintain consistency with existing codebase

## Quick Reference

| Situation | Apply |
|-----------|-------|
| Function > 20 lines | Split into smaller functions (SRP) |
| Repeated code blocks | Extract to function/constant (DRY) |
| Complex conditionals | Strategy or State pattern |
| Object creation logic | Factory pattern |
| Cross-cutting concerns | Decorator or Observer pattern |
| Incompatible interfaces | Adapter pattern |
| Need undo/logging | Command pattern |
| Global access point | Singleton (use sparingly) |

## Sources

- *Clean Code* - Robert C. Martin
- *The Pragmatic Programmer* - Andrew Hunt & David Thomas
- *Code Complete* - Steve McConnell
- *Refactoring* - Martin Fowler
- *Design Patterns* - Gang of Four
