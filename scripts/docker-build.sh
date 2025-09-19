#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${1:-creative-dna}"

# Load .env if present so VITE_* are available as shell vars
# Load precedence: .env.docker > .env.production > .env
if [ -f .env.docker ]; then
  echo "Using .env.docker"
  set -a; source .env.docker; set +a
elif [ -f .env.production ]; then
  echo "Using .env.production"
  set -a; source .env.production; set +a
elif [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

: "${VITE_SUPABASE_URL:?VITE_SUPABASE_URL is required}"
: "${VITE_SUPABASE_ANON_KEY:?VITE_SUPABASE_ANON_KEY is required}"

echo "Building image: ${APP_NAME}"
docker build \
  -t "${APP_NAME}" \
  --build-arg VITE_SUPABASE_URL="${VITE_SUPABASE_URL}" \
  --build-arg VITE_SUPABASE_ANON_KEY="${VITE_SUPABASE_ANON_KEY}" \
  .

echo "Done. Run: docker run --rm -p 8080:8080 ${APP_NAME}"
