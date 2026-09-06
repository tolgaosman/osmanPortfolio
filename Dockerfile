# Step 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Step 2: Serve the static application with Nginx
FROM nginx:alpine

# Copy the static export to Nginx html directory
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
