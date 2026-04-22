import { test, expect } from "bun:test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { spawn } from "node:child_process";

function normalize(str: string): string {
  return str.replace(/\r\n/g, "\n");
}

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
  if (exitCode !== 0) {
    throw new Error(`SessionStart hook failed.\nstdout:\n${stdout}\nstderr:\n${stderr}`);
  }

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
  expect(command).toBeDefined();

  const scriptPath = resolve("hooks/session-start.mjs");
  const child = spawn(process.execPath, [scriptPath], {
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
  if (exitCode !== 0) {
    throw new Error(`SessionStart hook failed.\nstdout:\n${stdout}\nstderr:\n${stderr}`);
  }

  const payload = JSON.parse(stdout) as {
    additionalContext?: string;
    hookSpecificOutput?: { additionalContext?: string };
  };

  expect(payload.additionalContext || payload.hookSpecificOutput?.additionalContext).toBeDefined();
  expect(normalize(payload.additionalContext || payload.hookSpecificOutput?.additionalContext || "")).toMatch(/compiled runtime bootstrap/);
});

test("SessionStart hook emits Cursor-compatible output shape when CURSOR_PLUGIN_ROOT is set", async () => {
  const payload = await runSessionStartHook({
    CURSOR_PLUGIN_ROOT: process.cwd(),
    CLAUDE_PLUGIN_ROOT: undefined,
    COPILOT_CLI: undefined,
  });

  expect(payload.additional_context).toBeDefined();
  expect(payload.additionalContext).toBeUndefined();
  expect(payload.hookSpecificOutput).toBeUndefined();
});

test("SessionStart hook emits SDK-standard output shape when no platform-specific env is set", async () => {
  const payload = await runSessionStartHook({
    CURSOR_PLUGIN_ROOT: undefined,
    CLAUDE_PLUGIN_ROOT: undefined,
    COPILOT_CLI: undefined,
  });

  expect(payload.additionalContext).toBeDefined();
  expect(payload.additional_context).toBeUndefined();
  expect(payload.hookSpecificOutput).toBeUndefined();
});

test("SessionStart hook prefers Cursor output when both CURSOR_PLUGIN_ROOT and CLAUDE_PLUGIN_ROOT are set", async () => {
  const payload = await runSessionStartHook({
    CURSOR_PLUGIN_ROOT: process.cwd(),
    CLAUDE_PLUGIN_ROOT: process.cwd(),
    COPILOT_CLI: undefined,
  });

  expect(payload.additional_context).toBeDefined();
  expect(payload.additionalContext).toBeUndefined();
  expect(payload.hookSpecificOutput).toBeUndefined();
});

test("package bin entry starts without an immediate runtime crash", async () => {
  const raw = await readFile(resolve("package.json"), "utf8");
  const pkg = JSON.parse(raw) as {
    bin?: { hyperstack?: string };
  };

  const binEntry = pkg.bin?.hyperstack;
  expect(binEntry).toBeDefined();

  const child = spawn(process.execPath, [resolve(binEntry!)], {
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stderr = "";
  child.stderr.on("data", (chunk: Buffer | string) => {
    stderr += chunk.toString();
  });

  await delay(200);
  expect(child.exitCode).toBeNull();

  child.kill("SIGTERM");
  await once(child, "close");
});
