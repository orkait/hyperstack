import { expect, test } from "bun:test";
import { captureTool, extractTextContent } from "./helpers";
import { register as registerLenisGetPattern } from "../src/plugins/lenis/tools/get-pattern.ts";

const lenisGetPattern = captureTool(registerLenisGetPattern);

test("lenis_get_pattern prefers corpus metadata for gsap-integration", async () => {
  const result = await lenisGetPattern.invoke({ name: "gsap-integration" });
  const text = extractTextContent(result);

  expect(text).toContain("# Lenis Pattern: gsap-integration");
  expect(text).toContain("**Corpus Source:** frontend.lenis");
  expect(text).toContain('import { ReactLenis, useLenis } from "lenis/react"');
});

test("lenis_get_pattern prefers corpus metadata for full-page", async () => {
  const result = await lenisGetPattern.invoke({ name: "full-page" });
  const text = extractTextContent(result);

  expect(text).toContain("# Lenis Pattern: full-page");
  expect(text).toContain("**Corpus Source:** frontend.lenis");
  expect(text).toContain('<ReactLenis root options={{ lerp: 0.1 }}>');
});

test("lenis_get_pattern falls back to in-file data for non-corpus patterns", async () => {
  const result = await lenisGetPattern.invoke({ name: "accessibility" });
  const text = extractTextContent(result);

  expect(text).toContain("# Lenis Pattern: accessibility");
  expect(text).toContain("## Key Notes");
  expect(text).not.toContain("**Corpus Source:** frontend.lenis");
});
