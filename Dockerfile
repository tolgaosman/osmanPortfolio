# Step 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
# Cache the npm download dir between builds and skip audit/fund network calls,
# so a redeploy after a code-only change does not re-download every package.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund --prefer-offline

COPY . .
# Cap the V8 heap so the build fails fast and predictably instead of dragging
# a small host into swap; the native bundler needs headroom beyond this.
RUN NODE_OPTIONS=--max-old-space-size=1024 npm run build

# Step 2: Serve the static application with Nginx
FROM nginx:alpine

# Copy the static export to Nginx html directory
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80 4444
# Traefik only routes to healthy containers; 127.0.0.1 avoids busybox wget
# resolving localhost to ::1.
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
