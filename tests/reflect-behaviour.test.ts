import { test, expect } from "bun:test";
import { ROSTER, getArchetypeDoc } from "../src/plugins/reflect/data.ts";
import { captureTool, extractTextContent } from "./helpers.ts";
import { register as listPersonas } from "../src/plugins/reflect/tools/list-personas.ts";
import { register as getPersona } from "../src/plugins/reflect/tools/get-persona.ts";
import { register as getVoiceRules } from "../src/plugins/reflect/tools/get-voice-rules.ts";

test("roster is the four archetypes, Morgan first (default)", () => {
  expect(ROSTER.map((r) => r.id)).toEqual(["morgan", "max", "diane", "riley"]);
});

test("getArchetypeDoc returns content for a valid id, null for unknown", () => {
  expect(getArchetypeDoc("morgan")).toMatch(/brand-side approver/i);
  expect(getArchetypeDoc("nobody")).toBeNull();
});

test("list_personas lists the roster", async () => {
  const tool = captureTool(listPersonas);
  expect(tool.name).toBe("reflect_list_personas");
  const text = extractTextContent(await tool.invoke({}));
  expect(text).toMatch(/Morgan/);
  expect(text).toMatch(/Riley/);
});

test("get_persona returns Max's performance lens", async () => {
  const tool = captureTool(getPersona);
  const text = extractTextContent(await tool.invoke({ id: "max" }));
  expect(text).toMatch(/performance/i);
  expect(text).toMatch(/ROAS|CAC|attribution/);
});

test("get_persona handles an unknown id gracefully", async () => {
  const tool = captureTool(getPersona);
  const text = extractTextContent(await tool.invoke({ id: "zzz" }));
  expect(text).toMatch(/Unknown reviewer/);
});

test("get_voice_rules carries the human-not-AI contract + moods", async () => {
  const tool = captureTool(getVoiceRules);
  const text = extractTextContent(await tool.invoke({}));
  expect(text).toMatch(/talk like a person/i);
  expect(text).toMatch(/Worried/);
});
