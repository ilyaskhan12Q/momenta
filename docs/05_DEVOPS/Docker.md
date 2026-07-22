---
id: Docker
title: Docker Containerization Architecture
sidebar_label: Docker & Containers
---

# Momenta — Docker Containerization Architecture

---

## 1. Multi-Stage Dockerfile Specification

The Momenta backend and static documentation containers utilize multi-stage Docker builds to achieve minimal image footprints (< 150MB), non-root execution, and vulnerability scanning compatibility.

```dockerfile
# Stage 1: Base & Dependencies
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-libc-dev python3 make g++ vips-dev
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Stage 2: Builder
FROM base AS builder
WORKDIR /app
COPY . .
RUN npm run build
RUN npm prune --production

# Stage 3: Minimal Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 momenta

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER momenta

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]
```

---

## 2. Local Infrastructure Docker Compose (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://momenta_user:secret_pass@postgres:5432/momenta_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: momenta_user
      POSTGRES_PASSWORD: secret_pass
      POSTGRES_DB: momenta_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U momenta_user -d momenta_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```
