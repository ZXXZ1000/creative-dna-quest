# Stage 1: Build static files with Vite
FROM node:20-alpine AS build
WORKDIR /app

# Install deps with clean cacheable layer
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Accept Vite env as build args (must be provided at build time)
ARG VITE_SUPABASE_URL=""
ARG VITE_SUPABASE_ANON_KEY=""
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

# Build static site
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Ensure static files are world-readable inside the image
# This fixes cases where host files (e.g., on macOS) carry 600 perms
# that prevent the nginx user from reading images and other assets.
RUN find /usr/share/nginx/html -type d -exec chmod 755 {} + \
  && find /usr/share/nginx/html -type f -exec chmod 644 {} + \
  && chown -R nginx:nginx /usr/share/nginx/html

# Runtime-generated Nginx config to honor $PORT (default 8080)
ENV PORT=8080
COPY scripts/start-nginx.sh /start-nginx.sh
RUN chmod +x /start-nginx.sh

EXPOSE 8080
CMD ["/start-nginx.sh"]
