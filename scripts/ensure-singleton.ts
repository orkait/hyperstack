import { execSync } from "child_process";

const IMAGE = "ghcr.io/orkait/hyperstack:main";
const CONTAINER_NAME = "hyperstack-mcp";

function run() {
  console.log("Checking for existing Hyperstack containers (cross-platform)...");

  try {
    // 1. Find containers by image and name
    const byImage = execSync(`docker ps -aq --filter "ancestor=${IMAGE}"`).toString().trim().split(/\s+/).filter(Boolean);
    const byName = execSync(`docker ps -aq --filter "name=${CONTAINER_NAME}"`).toString().trim().split(/\s+/).filter(Boolean);

    // 2. Combine and uniq
    const allStale = Array.from(new Set([...byImage, ...byName]));

    if (allStale.length > 0) {
      console.log(`Removing stale Hyperstack containers: ${allStale.join(", ")}`);
      // We use a loop or join with space since 'docker rm -f' accepts multiple IDs
      execSync(`docker rm -f ${allStale.join(" ")}`, { stdio: "inherit" });
    } else {
      console.log("No stale containers found.");
    }

    // 3. Start fresh container
    console.log(`Starting fresh Hyperstack container: ${CONTAINER_NAME}`);
    execSync(
      `docker run -d --name ${CONTAINER_NAME} --restart unless-stopped \
      --memory=512m --cpus=1 \
      --entrypoint sleep \
      ${IMAGE} infinity`,
      { stdio: "inherit" }
    );

    console.log("\nVerification:");
    execSync(`docker ps --filter name=${CONTAINER_NAME}`, { stdio: "inherit" });

  } catch (error: any) {
    console.error("Error ensuring singleton container:", error.message);
    process.exit(1);
  }
}

run();
