# Publish Docker Image to Private Registry

This repo includes everything to build and publish a production image.

Files
- `Dockerfile`: multi-stage build (Node -> Vite build -> Nginx serve with SPA fallback).
- `.dockerignore`: trims build context.
- `scripts/docker-build.sh`: reads `.env.docker` > `.env.production` > `.env` and passes Vite env as build args.
- `scripts/docker-push.sh`: tags and pushes to any registry (Docker Hub / GHCR / custom).

## 1) Prepare env values

Create `.env.docker` at repo root with:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

These are injected at build time so the app can talk to Supabase in production.

## 2) Build locally

```
chmod +x scripts/*.sh
./scripts/docker-build.sh creative-dna
```

Test locally:

```
docker run --rm -p 8080:8080 creative-dna
# open http://localhost:8080
```

## 3) Push to Docker Hub (private)

```
export DOCKERHUB_USER=yourname
export DOCKERHUB_TOKEN=...   # create on hub.docker.com → Security → New Access Token

./scripts/docker-push.sh creative-dna docker.io ${DOCKERHUB_USER}/creative-dna:latest \
  ${DOCKERHUB_USER} ${DOCKERHUB_TOKEN}
```

## 4) Push to GHCR (private)

```
export GH_USER=your-github-user
export GH_TOKEN=... # a classic token with packages:write or use GITHUB_TOKEN in Actions

./scripts/docker-push.sh creative-dna ghcr.io ghcr.io/${GH_USER}/creative-dna:latest \
  ${GH_USER} ${GH_TOKEN}
```

## 5) Use on Claw Cloud

- Choose “private image”. Fill:
  - Image name: `docker.io/<user>/creative-dna:latest` (or `ghcr.io/<user>/creative-dna:latest`)
  - Username / Password: your registry credentials
  - Exposed port: `8080`

That’s it — the container serves the app with Nginx and SPA fallback.

### Notes
- Rebuild whenever you change code or Supabase env values:
  - `./scripts/docker-build.sh creative-dna`
  - re-push with `scripts/docker-push.sh`
- Your `.env*` files are excluded by `.dockerignore`; secrets are only used as build args.
- If you prefer CI: add a GitHub Actions workflow to build and push on every push; then point Claw Cloud to the latest tag.

