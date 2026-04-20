import { expect, test } from "bun:test";
import { invokeRegisteredTool } from "../src/engine/tool-bridge.ts";
import { register as registerGetPractice } from "../src/plugins/golang/tools/get-practice.ts";
import { register as registerGetPrinciple } from "../src/plugins/ui-ux/tools/get-principle.ts";
import { register as registerGetPersonality } from "../src/plugins/designer/tools/get-personality.ts";
import { register as registerGetIndustryRules } from "../src/plugins/designer/tools/get-industry-rules.ts";
import { register as registerResolveIntent } from "../src/plugins/designer/tools/resolve-intent.ts";
import { register as registerGetTokenCategory } from "../src/plugins/design-tokens/tools/get-category.ts";

test("golang_get_practice reads corpus-backed practice documents first", async () => {
  const result = await invokeRegisteredTool(registerGetPractice, {
    name: "error-wrapping",
  });

  expect(result.content?.[0]?.text).toMatch(/Always wrap errors with context/);
  expect(result.content?.[0]?.text).toMatch(/\*\*Corpus Source:\*\* backend\.golang/);
});

test("ui_ux_get_principle reads corpus-backed frontend knowledge first", async () => {
  const result = await invokeRegisteredTool(registerGetPrinciple, {
    name: "wcag-contrast",
  });

  expect(result.content?.[0]?.text).toMatch(/Body text: 4\.5:1/);
  expect(result.content?.[0]?.text).toMatch(/\*\*Corpus Source:\*\* frontend\.ui-ux/);
});

test("designer_get_personality reads corpus-backed designer knowledge first", async () => {
  const result = await invokeRegisteredTool(registerGetPersonality, {
    cluster: "premium-precision",
  });

  expect(result.content?.[0]?.text).toMatch(/Ultra-minimal, zero decoration/);
  expect(result.content?.[0]?.text).toMatch(/\*\*Corpus Source:\*\* frontend\.designer/);
});

test("designer_get_industry_rules reads corpus-backed designer knowledge first", async () => {
  const result = await invokeRegisteredTool(registerGetIndustryRules, {
    industry: "saas",
  });

  expect(result.content?.[0]?.text).toMatch(/Primary style:/);
  expect(result.content?.[0]?.text).toMatch(/\*\*Corpus Source:\*\* frontend\.designer/);
});

test("designer_resolve_intent reads corpus-backed designer mappings first", async () => {
  const result = await invokeRegisteredTool(registerResolveIntent, {
    product: "developer analytics dashboard",
  });

  expect(result.content?.[0]?.text).toMatch(/\*\*Industry:\*\* analytics/);
  expect(result.content?.[0]?.text).toMatch(/\*\*Personality:\*\* technical-developer/);
  expect(result.content?.[0]?.text).toMatch(/\*\*Corpus Source:\*\* frontend\.designer/);
});

test("design_tokens_get_category reads corpus-backed token knowledge first", async () => {
  const result = await invokeRegisteredTool(registerGetTokenCategory, {
    name: "colors",
  });

  expect(result.content?.[0]?.text).toMatch(/Three-layer architecture/);
  expect(result.content?.[0]?.text).toMatch(/\*\*Corpus Source:\*\* frontend\.design-tokens/);
});
