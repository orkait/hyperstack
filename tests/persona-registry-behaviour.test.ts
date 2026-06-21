import { test, expect } from "bun:test";
import { loadPersonas } from "../src/personas/registry.ts";

test("registry loads the product-manager persona manifest", () => {
  const personas = loadPersonas();
  const pm = personas.find((p) => p.id === "product-manager");
  expect(pm).toBeDefined();
  expect(pm!.owns.risks.sort()).toEqual(["value", "viability"]);
  expect(pm!.gate_policy.net_new).toBe("hard");
});

test("a malformed manifest is skipped, not thrown", () => {
  expect(() => loadPersonas()).not.toThrow();
});
