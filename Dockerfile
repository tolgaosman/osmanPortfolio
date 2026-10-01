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
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
