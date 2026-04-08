#!/usr/bin/env bash
set -euo pipefail

CONTAINER="hyperstack-daemon"
IMAGE="hyperstack"
LOCK_FILE="/tmp/${CONTAINER}.lock"

# Use a file lock so concurrent session startups don't race to create the container.
# Only one process runs the startup block at a time; the rest wait, then see the
# container already running and skip straight to docker exec.
(
  flock -x 200

  if ! docker ps -q --filter "name=^${CONTAINER}$" 2>/dev/null | grep -q .; then
    # Remove any stopped container with the same name
    docker rm -f "$CONTAINER" 2>/dev/null || true

    # Start a long-running daemon container (tail keeps it alive).
    # Each MCP session gets its own node process via docker exec below.
    docker run -d \
      --name "$CONTAINER" \
      --restart unless-stopped \
      --entrypoint tail \
      "$IMAGE" -f /dev/null

    sleep 0.3
  fi

) 200>"$LOCK_FILE"

exec docker exec -i "$CONTAINER" npx tsx src/index.ts
