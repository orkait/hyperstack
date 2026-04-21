import { expect, test } from "bun:test";
import { captureTool, extractTextContent } from "./helpers";
import { register as registerRustGetPractice } from "../src/plugins/rust/tools/get-practice.ts";

const rustGetPractice = captureTool(registerRustGetPractice);

test("rust_get_practice prefers corpus metadata for borrow-over-clone", async () => {
  const result = await rustGetPractice.invoke({ name: "borrow-over-clone" });
  const text = extractTextContent(result);

  expect(text).toContain("# borrow-over-clone [coding-styles]");
  expect(text).toContain("**Corpus Source:** backend.rust");
  expect(text).toContain("fn process(data: &[u8])");
});

test("rust_get_practice prefers corpus metadata for result-not-panic", async () => {
  const result = await rustGetPractice.invoke({ name: "result-not-panic" });
  const text = extractTextContent(result);

  expect(text).toContain("# result-not-panic [error-handling]");
  expect(text).toContain("**Corpus Source:** backend.rust");
  expect(text).toContain("fs::read_to_string(path)?");
});

test("rust_get_practice falls back to in-file data for non-corpus practices", async () => {
  const result = await rustGetPractice.invoke({ name: "no-unwrap-in-prod" });
  const text = extractTextContent(result);

  expect(text).toContain("# no-unwrap-in-prod [error-handling]");
  expect(text).not.toContain("**Corpus Source:** backend.rust");
});
