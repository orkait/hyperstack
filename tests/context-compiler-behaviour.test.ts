import { test, expect } from "bun:test";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  compileUsingHyperstackBootstrap,
  generateHyperstackBootstrap,
} from "../src/internal/context-compiler.ts";

function normalize(str: string): string {
  return str.replace(/\r\n/g, "\n");
}

test("compileUsingHyperstackBootstrap keeps required invariants while shrinking the source", () => {
  const source = `
<SUBAGENT-STOP>
Not for subagents.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
This is extremely important.
</EXTREMELY-IMPORTANT>

# Skill Name
This is a skill.
{INV: invariant-1}
{INV: invariant-2}

## The Iron Laws
\`\`\`
- Law 1
{INV: invariant-1}
{INV: invariant-2}
\`\`\`

## Instruction Priority
- P1

## Red Flags - STOP
- Red 1
${"x".repeat(2000)}

## Layer 1: MCP Tools (Ground-Truth Data)
- Tool 1

## Layer 2: Skills (Engineering Process)
- Skill 1

## Role Registry
- Role 1

## Routing Summary
- Route 1

## Allowed Transitions
- Transition 1

## Disallowed Transitions
- Transition 2

## The Rationalization Catalog (Read Before Every Session)
- Rational 1

## The One Rule That Governs All Rules
- Rule 1

## Final Check Before Any Response
- Check 1

### Steps
1. Step 1
  `;
  const { content } = compileUsingHyperstackBootstrap(source);

  expect(content).toMatch(/invariant-1/);
  expect(content).toMatch(/invariant-2/);
  expect(content.length).toBeLessThan(source.length);
});

test("generated bootstrap artifact stays in sync with the compiler output", () => {
  const skillSource = normalize(readFileSync(resolve("skills/hyperstack/SKILL.md"), "utf8"));
  const currentBootstrap = normalize(readFileSync(resolve("generated/runtime-context/hyperstack.bootstrap.md"), "utf8"));

  const nextBootstrap = generateHyperstackBootstrap(skillSource);

  expect(normalize(nextBootstrap)).toBe(currentBootstrap);
});
