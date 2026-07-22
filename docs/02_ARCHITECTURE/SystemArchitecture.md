---
id: SystemArchitecture
title: Overall System Architecture
sidebar_label: System Architecture
---

# Momenta — Overall System Architecture

---

## 1. High-Level Architecture Topology

Momenta employs an **Edge-Accelerated Hybrid Architecture**. High-throughput story consumption is served via global edge workers (Cloudflare / Vercel Edge), while authoring, media processing, and analytics are handled by scalable containerized backend services.

```mermaid
architecture-beta
    group client(internet) Client Devices
    service sender(desktop)[Sender Studio SPA] in client
    service recipient(mobile)[Recipient Story Engine] in client

    group edge(cloud) Edge CDN Layer
    service edge_worker(server)[Cloudflare Edge Worker] in edge
    service keyval(database)[Edge KV Store] in edge

    group core(cloud) Core Backend Cluster
    service api_gateway(server)[Node.js API Gateway] in core
    service media_worker(server)[FFmpeg / Sharp Queue Worker] in core
    service db(database)[PostgreSQL Primary] in core
    service redis(database)[Redis Cache & Pub/Sub] in core
    service object_store(disk)[S3 Storage Bucket] in core

    sender --> api_gateway
    api_gateway --> db
    api_gateway --> redis
    api_gateway --> object_store
    api_gateway --> media_worker
    media_worker --> object_store
    media_worker --> db

    recipient --> edge_worker
    edge_worker --> keyval
    edge_worker --> object_store
```

---

## 2. Detailed Component Hierarchy

```mermaid
graph LR
    subgraph Client Tier
      A[Sender SPA - React/Vite]
      B[Recipient SPA - Three.js/WebAudio]
    end

    subgraph Edge CDN & Ingestion
      C[Cloudflare Edge / Vercel Functions]
      D[Edge KV - Read-heavy Story Manifests]
    end

    subgraph Core Processing Layer
      E[REST/GraphQL API Gateway - Fastify/Node.js]
      F[Async Background Jobs - BullMQ/Redis]
      G[Media Microservice - Sharp / FFmpeg]
    end

    subgraph Persistence Layer
      H[(PostgreSQL - Primary Database)]
      I[(Redis Cluster - Session & Caching)]
      J[AWS S3 / R2 - Asset Storage]
    end

    A --> E
    B --> C
    C --> D
    C --> J
    E --> H
    E --> I
    E --> F
    F --> G
    G --> J
    G --> H
```

---

## 3. Data Flow & Subsystem Communication

### 3.1 Story Publishing & Manifest Generation

```mermaid
sequenceDiagram
    autonumber
    actor Author
    participant Studio as Studio SPA
    participant API as API Server
    participant Worker as Media Worker
    participant DB as PostgreSQL
    participant R2 as Edge Storage
    participant KV as Edge KV

    Author->>Studio: Clicks "Publish Experience"
    Studio->>API: POST /v1/stories/publish (Story Payload)
    API->>DB: INSERT into stories & story_nodes (Transaction)
    API->>Worker: Enqueue Task: GENERATE_STORY_MANIFEST
    Worker->>DB: Fetch compiled nodes & media URLs
    Worker->>Worker: Construct Static JSON Manifest & Sign WebAudio Assets
    Worker->>R2: Upload static manifest (story_{token}.json)
    Worker->>KV: Populate Edge KV (Key: token -> R2 Manifest URL)
    Worker->>DB: UPDATE stories SET status = 'PUBLISHED'
    API-->>Studio: Return 201 Created { shareUrl: "https://momenta.app/s/{token}" }
```

---

## 4. Architecture Tradeoffs & Rationale

| Architecture Decision | Chosen Approach | Alternative Considered | Trade-off Rationale |
| :--- | :--- | :--- | :--- |
| **Delivery Model** | Static Manifest at Edge CDN + Edge KV | Dynamic Server-Side Rendering (SSR) per request | Serving static JSON manifests from Cloudflare Edge reduces recipient TTFB to < 50ms globally and eliminates backend DB load during viral spikes. |
| **Media Processing** | Asynchronous Worker Queue (BullMQ + Sharp) | Synchronous client-side upload & resize | Processing on backend workers ensures uniform WebP/AVIF output quality, metadata stripping (EXIF privacy), and fallback thumbnail generation regardless of client device CPU. |
| **Database Architecture** | PostgreSQL with JSONB story nodes | Pure NoSQL Document Store (MongoDB) | Relational integrity for user accounts, billing, audit logs, and access permissions, with JSONB flexibility for dynamic story engine beats. |
| **State Synchronization** | Optimistic UI updates with HTTP REST | Persistent WebSockets for draft editing | WebSockets add server memory overhead; drafts are authored single-user, making REST with debounce and local storage autosave vastly simpler and resilient. |
