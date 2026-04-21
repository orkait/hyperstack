import { expect, test } from "bun:test";
import { captureTool, extractTextContent } from "./helpers";
import { register as registerDesignTokensGetProcedure } from "../src/plugins/design-tokens/tools/get-procedure.ts";

const designTokensGetProcedure = captureTool(registerDesignTokensGetProcedure);

test("design_tokens_get_procedure prefers corpus metadata for step 1", async () => {
  const result = await designTokensGetProcedure.invoke({ step: 1 });
  const text = extractTextContent(result);

  expect(text).toContain("# Step 1: Define color ramp primitives in @theme");
  expect(text).toContain("**Corpus Source:** frontend.design-tokens");
  expect(text).toContain("--color-brand-50: oklch(0.98 0.01 291);");
});

test("design_tokens_get_procedure prefers corpus metadata for step 2", async () => {
  const result = await designTokensGetProcedure.invoke({ step: 2 });
  const text = extractTextContent(result);

  expect(text).toContain("# Step 2: Map semantic tokens in :root and .dark");
  expect(text).toContain("**Corpus Source:** frontend.design-tokens");
  expect(text).toContain("--color-bg: var(--color-neutral-50);");
});

test("design_tokens_get_procedure prefers corpus metadata for step 3", async () => {
  const result = await designTokensGetProcedure.invoke({ step: 3 });
  const text = extractTextContent(result);

  expect(text).toContain("# Step 3: Bridge to Tailwind v4 utilities with @theme inline");
  expect(text).toContain("**Corpus Source:** frontend.design-tokens");
  expect(text).toContain("--color-background: var(--color-bg);");
});

test("design_tokens_get_procedure prefers corpus metadata for step 4", async () => {
  const result = await designTokensGetProcedure.invoke({ step: 4 });
  const text = extractTextContent(result);

  expect(text).toContain("# Step 4: Define spacing system");
  expect(text).toContain("**Corpus Source:** frontend.design-tokens");
  expect(text).toContain("--spacing: 0.25rem;");
});

test("design_tokens_get_procedure prefers corpus metadata for step 5", async () => {
  const result = await designTokensGetProcedure.invoke({ step: 5 });
  const text = extractTextContent(result);

  expect(text).toContain("# Step 5: Set up typography scale");
  expect(text).toContain("**Corpus Source:** frontend.design-tokens");
  expect(text).toContain("--font-sans:");
});

test("design_tokens_get_procedure prefers corpus metadata for step 6", async () => {
  const result = await designTokensGetProcedure.invoke({ step: 6 });
  const text = extractTextContent(result);

  expect(text).toContain("# Step 6: Define shadows and elevation");
  expect(text).toContain("**Corpus Source:** frontend.design-tokens");
  expect(text).toContain("--shadow-xs: 0 1px 2px 0 oklch(0.30 0.02 60 / 0.08);");
});

test("design_tokens_get_procedure prefers corpus metadata for step 7", async () => {
  const result = await designTokensGetProcedure.invoke({ step: 7 });
  const text = extractTextContent(result);

  expect(text).toContain("# Step 7: Define motion and z-index tokens");
  expect(text).toContain("**Corpus Source:** frontend.design-tokens");
  expect(text).toContain("--duration-fast: 100ms;");
});

test("design_tokens_get_procedure falls back to in-file data for other steps", async () => {
  const result = await designTokensGetProcedure.invoke({ step: 8 });
  const text = extractTextContent(result);

  expect(text).toContain("# Step 8: Run contrast audit and verify token usage");
  expect(text).toContain("## Code");
  expect(text).not.toContain("**Corpus Source:** frontend.design-tokens");
});

test("design_tokens_get_procedure summary includes corpus source when corpus metadata is present", async () => {
  const result = await designTokensGetProcedure.invoke({});
  const text = extractTextContent(result);

  expect(text).toContain("# Design Token Build Procedure");
  expect(text).toContain("**Corpus Source:** frontend.design-tokens");
  expect(text).toContain("## Step 1: Define color ramp primitives in @theme");
});
