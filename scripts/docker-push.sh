#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/docker-push.sh <local-image> <registry> <repo/image:tag> [username] [password]
# Examples:
#   ./scripts/docker-push.sh creative-dna docker.io myuser/creative-dna:latest myuser $DOCKERHUB_TOKEN
#   ./scripts/docker-push.sh creative-dna ghcr.io ghcr.io/myorg/creative-dna:latest $GITHUB_ACTOR $GHCR_TOKEN

LOCAL_IMAGE="${1:-creative-dna}"
REGISTRY="${2:-docker.io}"
REMOTE_IMAGE="${3:-myuser/creative-dna:latest}"
USER="${4:-}"
PASS="${5:-}"

echo "Tagging ${LOCAL_IMAGE} -> ${REMOTE_IMAGE}"
docker tag "${LOCAL_IMAGE}" "${REMOTE_IMAGE}"

if [ -n "$USER" ] && [ -n "$PASS" ]; then
  echo "Logging in to ${REGISTRY} as ${USER}"
  echo "$PASS" | docker login "$REGISTRY" -u "$USER" --password-stdin
else
  echo "No credentials supplied. Assuming public registry or pre-authenticated session."
fi

echo "Pushing ${REMOTE_IMAGE}"
docker push "${REMOTE_IMAGE}"
echo "Done."

