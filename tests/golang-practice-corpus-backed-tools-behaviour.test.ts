import { expect, test } from "bun:test";
import { captureTool, extractTextContent } from "./helpers";
import { register as registerGolangGetPractice } from "../src/plugins/golang/tools/get-practice.ts";

const golangGetPractice = captureTool(registerGolangGetPractice);

test("golang_get_practice prefers corpus metadata for error-wrapping", async () => {
  const result = await golangGetPractice.invoke({ name: "error-wrapping" });
  const text = extractTextContent(result);

  expect(text).toContain("# error-wrapping [error-handling] - P0");
  expect(text).toContain("**Corpus Source:** backend.golang");
  expect(text).toContain('fmt.Errorf("userRepo.FindByID');
});

test("golang_get_practice prefers corpus metadata for goroutine-lifecycle", async () => {
  const result = await golangGetPractice.invoke({ name: "goroutine-lifecycle" });
  const text = extractTextContent(result);

  expect(text).toContain("# goroutine-lifecycle [concurrency] - P0");
  expect(text).toContain("**Corpus Source:** backend.golang");
  expect(text).toContain("case <-ctx.Done(): return");
});

test("golang_get_practice prefers corpus metadata for context-first-param", async () => {
  const result = await golangGetPractice.invoke({ name: "context-first-param" });
  const text = extractTextContent(result);

  expect(text).toContain("# context-first-param [concurrency] - P0");
  expect(text).toContain("**Corpus Source:** backend.golang");
  expect(text).toContain("ctx context.Context, id string");
});

test("golang_get_practice falls back to in-file data for non-corpus practices", async () => {
  const result = await golangGetPractice.invoke({ name: "handle-once" });
  const text = extractTextContent(result);

  expect(text).toContain("# handle-once [error-handling] - P0");
  expect(text).not.toContain("**Corpus Source:** backend.golang");
});
