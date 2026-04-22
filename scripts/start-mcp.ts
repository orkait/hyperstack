import { execSync, spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const IMAGE = "ghcr.io/orkait/hyperstack:main";
const CONTAINER_NAME = "hyperstack-mcp";
const LOCK_FILE = path.join(os.tmpdir(), "hyperstack-mcp-startup.lock");

/**
 * Standardized Cross-Platform MCP Startup Logic
 * - Ensures the persistent container is running.
 * - Bridges the local I/O to the containerized MCP process via 'docker exec'.
 */
async function startMcp() {
  let lockFd: number | null = null;
  
  try {
    // 1. Concurrency control via file lock
    try {
      lockFd = fs.openSync(LOCK_FILE, 'wx');
      
      // Check if the container is already running
      const running = execSync(`docker ps -q --filter "name=^${CONTAINER_NAME}$"`, { stdio: "pipe" }).toString().trim();
      
      if (!running) {
        // If not running, ensure it's removed and start fresh
        // Suppress errors if container doesn't exist
        try { execSync(`docker rm -f ${CONTAINER_NAME}`, { stdio: "ignore" }); } catch {}
        
        execSync(
          `docker run -d --name ${CONTAINER_NAME} --restart unless-stopped \
          --memory=512m --cpus=1 \
          --entrypoint sleep \
          ${IMAGE} infinity`,
          { stdio: "inherit" }
        );
        
        // Brief pause to allow Docker to initialize the process
        await new Promise(r => setTimeout(r, 300));
      }
    } catch (e: any) {
      if (e.code === 'EEXIST') {
        // Another process is handling startup, wait briefly
        await new Promise(r => setTimeout(r, 500));
      } else {
        throw e;
      }
    } finally {
      if (lockFd !== null) {
        fs.closeSync(lockFd);
        try { fs.unlinkSync(LOCK_FILE); } catch {}
      }
    }

    // 2. Connect to the MCP server inside the container
    // This allows the local agent/IDE to communicate with the containerized Bun process.
    const proc = spawn("docker", ["exec", "-i", CONTAINER_NAME, "bun", "/app/src/index.ts"], {
      stdio: "inherit"
    });

    proc.on("exit", (code) => process.exit(code || 0));
    proc.on("error", (err) => {
      console.error("Failed to bridge to containerized MCP:", err.message);
      process.exit(1);
    });

  } catch (error: any) {
    console.error("Critical error starting Hyperstack MCP:", error.message);
    process.exit(1);
  }
}

startMcp();
