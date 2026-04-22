import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { spawn } from "node:child_process";
import test from "node:test";

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
