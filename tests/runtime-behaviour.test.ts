import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { spawn } from "node:child_process";
import test from "node:test";

async function runSessionStartHook(envOverrides: Record<string, string | undefined>) {
  const child = spawn(process.execPath, [resolve("hooks/session-start.mjs")], {
    cwd: process.cwd(),
    env: { ...process.env, ...envOverrides },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk: Buffer | string) => {
    stdout += chunk.toString();
  });
  child.stderr.on("data", (chunk: Buffer | string) => {
    stderr += chunk.toString();
  });

  const [exitCode] = (await once(child, "close")) as [number | null];
  assert.equal(exitCode, 0, `SessionStart hook failed.\nstdout:\n${stdout}\nstderr:\n${stderr}`);

  return JSON.parse(stdout) as {
    additional_context?: string;
    additionalContext?: string;
    hookSpecificOutput?: { additionalContext?: string };
  };
}

test("Claude SessionStart hook command executes successfully on this platform", async () => {
  const raw = await readFile(resolve("hooks/hooks.json"), "utf8");
  const config = JSON.parse(raw) as {
    hooks: {
      SessionStart: Array<{
        hooks: Array<{ command: string }>;
      }>;
    };
  };

  const command = config.hooks.SessionStart[0]?.hooks[0]?.command;
  assert.ok(command, "SessionStart hook command is missing");

  const child = spawn("bash", ["-lc", command], {
    cwd: process.cwd(),
    env: { ...process.env, CLAUDE_PLUGIN_ROOT: process.cwd() },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk: Buffer | string) => {
    stdout += chunk.toString();
  });
  child.stderr.on("data", (chunk: Buffer | string) => {
    stderr += chunk.toString();
  });

  const [exitCode] = (await once(child, "close")) as [number | null];
  assert.equal(exitCode, 0, `SessionStart hook failed.\nstdout:\n${stdout}\nstderr:\n${stderr}`);

  const payload = JSON.parse(stdout) as {
    additionalContext?: string;
    hookSpecificOutput?: { additionalContext?: string };
  };

  assert.ok(
    payload.additionalContext || payload.hookSpecificOutput?.additionalContext,
    "SessionStart hook output did not include additional context",
  );
  assert.match(
    payload.additionalContext || payload.hookSpecificOutput?.additionalContext || "",
    /compiled runtime bootstrap/,
    "Claude SessionStart hook should prefer the compiled bootstrap artifact",
  );
});

test("SessionStart hook emits Cursor-compatible output shape when CURSOR_PLUGIN_ROOT is set", async () => {
  const payload = await runSessionStartHook({
    CURSOR_PLUGIN_ROOT: process.cwd(),
    CLAUDE_PLUGIN_ROOT: undefined,
    COPILOT_CLI: undefined,
  });

  assert.ok(payload.additional_context, "Cursor hook output did not include additional_context");
  assert.equal(payload.additionalContext, undefined, "Cursor hook should not emit additionalContext");
  assert.equal(payload.hookSpecificOutput, undefined, "Cursor hook should not emit hookSpecificOutput");
});

test("SessionStart hook emits SDK-standard output shape when no platform-specific env is set", async () => {
  const payload = await runSessionStartHook({
    CURSOR_PLUGIN_ROOT: undefined,
    CLAUDE_PLUGIN_ROOT: undefined,
    COPILOT_CLI: undefined,
  });

  assert.ok(payload.additionalContext, "Generic hook output did not include additionalContext");
  assert.equal(payload.additional_context, undefined, "Generic hook should not emit additional_context");
  assert.equal(payload.hookSpecificOutput, undefined, "Generic hook should not emit hookSpecificOutput");
});

test("SessionStart hook prefers Cursor output when both CURSOR_PLUGIN_ROOT and CLAUDE_PLUGIN_ROOT are set", async () => {
  const payload = await runSessionStartHook({
    CURSOR_PLUGIN_ROOT: process.cwd(),
    CLAUDE_PLUGIN_ROOT: process.cwd(),
    COPILOT_CLI: undefined,
  });

  assert.ok(payload.additional_context, "Cursor-preferred hook output did not include additional_context");
  assert.equal(payload.additionalContext, undefined, "Cursor-preferred hook should not emit additionalContext");
  assert.equal(payload.hookSpecificOutput, undefined, "Cursor-preferred hook should not emit hookSpecificOutput");
});

test("package bin entry starts without an immediate runtime crash", async () => {
  const raw = await readFile(resolve("package.json"), "utf8");
  const pkg = JSON.parse(raw) as {
    bin?: { hyperstack?: string };
  };

  const binEntry = pkg.bin?.hyperstack;
  assert.ok(binEntry, "package bin entry is missing");

  const child = spawn(process.execPath, [resolve(binEntry)], {
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stderr = "";
  child.stderr.on("data", (chunk: Buffer | string) => {
    stderr += chunk.toString();
  });

  await delay(200);
  assert.equal(child.exitCode, null, `bin entry crashed on startup.\nstderr:\n${stderr}`);

  child.kill("SIGTERM");
  await once(child, "close");
});
