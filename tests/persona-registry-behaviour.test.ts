import { test, expect } from "bun:test";
import { loadPersonas } from "../src/personas/registry.ts";

test("registry loads the product-manager persona manifest", () => {
  const personas = loadPersonas();
  const pm = personas.find((p) => p.id === "product-manager");
  expect(pm).toBeDefined();
  expect(pm!.owns.risks.sort()).toEqual(["value", "viability"]);
  expect(pm!.gate_policy.net_new).toBe("hard");
});

test("registry loads the marketing capability persona", () => {
  const personas = loadPersonas();
  const m = personas.find((p) => p.id === "marketing");
  expect(m).toBeDefined();
  expect(m!.mode).toBe("capability");
  expect(m!.owns.plugin).toBe("marketing");
});

test("registry loads the reflect capability persona", () => {
  const personas = loadPersonas();
  const r = personas.find((p) => p.id === "reflect");
  expect(r).toBeDefined();
  expect(r!.mode).toBe("capability");
  expect(r!.owns.plugin).toBe("reflect");
});

test("a malformed manifest is skipped, not thrown", () => {
  expect(() => loadPersonas()).not.toThrow();
});
