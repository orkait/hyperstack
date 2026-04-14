#!/bin/bash

# Hard check to ensure only one Hyperstack container is running.
# Removes all previous instances (by name or image) before starting a fresh one.

IMAGE="ghcr.io/orkait/hyperstack:main"
CONTAINER_NAME="hyperstack-mcp"

echo "Checking for existing Hyperstack containers..."

# 1. Find containers by the specific image
BY_IMAGE=$(docker ps -aq --filter "ancestor=$IMAGE")

# 2. Find containers by name
BY_NAME=$(docker ps -aq --filter "name=$CONTAINER_NAME")

# Combine and remove duplicates
ALL_STALE=$(echo "$BY_IMAGE $BY_NAME" | xargs -n1 | sort -u)

if [ -n "$ALL_STALE" ]; then
    echo "Removing stale Hyperstack containers: $ALL_STALE"
    docker rm -f $ALL_STALE 2>/dev/null
else
    echo "No stale containers found."
fi

echo "Starting fresh Hyperstack container: $CONTAINER_NAME"
docker run -d --name "$CONTAINER_NAME" --restart unless-stopped \
  --memory=512m --cpus=1 \
  --entrypoint sleep \
  "$IMAGE" infinity

echo "Verification:"
docker ps --filter name="$CONTAINER_NAME"
