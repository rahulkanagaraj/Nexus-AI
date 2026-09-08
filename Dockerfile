# ==============================================================================
# InnoFlow React Client - Production Multi-Stage Dockerfile
# ==============================================================================

# Stage 1: Build static assets with Node.js
FROM node:20-alpine AS builder
WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm ci --silent

# Build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve with High-Performance Nginx
FROM nginx:1.25-alpine AS runner

# Copy customized Nginx reverse-proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled React artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
