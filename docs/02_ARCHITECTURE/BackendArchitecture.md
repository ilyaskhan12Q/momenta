---
id: BackendArchitecture
title: Backend Architecture & Service Design
sidebar_label: Backend Architecture
---

# Momenta — Backend Architecture & Service Design

---

## 1. Modular Backend Design (Modulith)

The backend is architected as a **Clean Modular Monolith (Modulith)** using Fastify / Node.js and TypeScript, organized into domain modules with strict encapsulation interfaces.

```mermaid
graph TD
    subgraph HTTP / Transport Layer
      A[Fastify Server] --> B[Authentication Middleware]
      B --> C[Rate Limiter & Security Headers]
    end

    subgraph Module Controller Layer
      C --> D[Authoring Controller]
      C --> E[Delivery Controller]
      C --> F[Media Controller]
    end

    subgraph Application Service Layer
      D --> G[StoryAuthoringService]
      E --> H[StoryDeliveryService]
      F --> I[MediaProcessingService]
    end

    subgraph Domain & Repository Layer
      G --> J[IStoryRepository]
      H --> J
      I --> K[IMediaStorageRepository]
      J --> L[(Prisma ORM / PostgreSQL)]
      K --> M[AWS S3 / Cloudflare R2]
    end
```

---

## 2. Layer Definitions & Contracts

### 2.1 Repository Pattern Implementation

All database interactions pass through typed Repository interfaces. Direct ORM calls inside services are strictly forbidden.

```typescript
// Shared Domain Abstraction
export interface IStoryRepository {
  findById(id: string): Promise<Story | null>;
  findByAccessToken(token: string): Promise<Story | null>;
  save(story: Story): Promise<void>;
  updateStatus(id: string, status: StoryStatus): Promise<void>;
  delete(id: string): Promise<boolean>;
}
```

```typescript
// Infrastructure Concrete Implementation
export class PrismaStoryRepository implements IStoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByAccessToken(token: string): Promise<Story | null> {
    const record = await this.prisma.story.findUnique({
      where: { accessToken: token },
      include: { nodes: true, media: true },
    });
    if (!record) return null;
    return StoryMapper.toDomain(record);
  }

  async save(story: Story): Promise<void> {
    const data = StoryMapper.toPersistence(story);
    await this.prisma.story.upsert({
      where: { id: story.id },
      create: data,
      update: data,
    });
  }

  async updateStatus(id: string, status: StoryStatus): Promise<void> {
    await this.prisma.story.update({
      where: { id },
      data: { status },
    });
  }

  async findById(id: string): Promise<Story | null> {
    const record = await this.prisma.story.findUnique({ where: { id } });
    return record ? StoryMapper.toDomain(record) : null;
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.prisma.story.delete({ where: { id } });
    return !!res;
  }
}
```

---

## 3. Dependency Injection Architecture

Momenta uses lightweight constructor-based Dependency Injection managed by `tsyringe` or native Fastify plugin decorators.

```mermaid
classDiagram
    class StoryAuthoringService {
      -IStoryRepository storyRepo
      -IEmotionEngine emotionEngine
      -IMediaStorageRepository storageRepo
      +createDraft(dto: CreateDraftDTO): Promise~Story~
      +publishStory(storyId: string): Promise~PublishResult~
    }
    class IStoryRepository {
      <<interface>>
      +findById(id)
      +save(story)
    }
    class IEmotionEngine {
      <<interface>>
      +analyzeTone(text)
      +recommendTheme(intent)
    }
    StoryAuthoringService --> IStoryRepository
    StoryAuthoringService --> IEmotionEngine
```

---

## 4. Middleware & Error Handling Pipeline

```mermaid
flowchart TD
    Req[Incoming HTTP Request] --> RateLimit{Rate Limit OK?}
    RateLimit -- No --> R429[Return 429 Too Many Requests]
    RateLimit -- Yes --> AuthCheck{Auth Middleware}
    AuthCheck -- Token Invalid --> R401[Return 401 Unauthorized]
    AuthCheck -- Valid --> BodyVal{Zod Body Validation}
    BodyVal -- Invalid Schema --> R400[Return 400 Bad Request + Field Errors]
    BodyVal -- Valid --> Controller[Execute Controller & Service]
    Controller --> ErrorCatch{Unhandled Exception?}
    ErrorCatch -- Yes --> Logger[Log Error with Trace ID to Pino/Datadog]
    Logger --> R500[Return 500 Internal Server Error]
    ErrorCatch -- No --> R200[Return 200 OK Response]
```

### Global Error Contract Schema

```json
{
  "success": false,
  "error": {
    "code": "STORY_NOT_FOUND",
    "message": "The requested story experience could not be located or has expired.",
    "traceId": "req-94a2-11ee-b9d1-0242ac120002",
    "timestamp": "2026-07-22T16:05:23.000Z",
    "details": []
  }
}
```

---

## 5. Async Queue & Background Jobs (BullMQ + Redis)

```mermaid
graph LR
    subgraph Producer
      API[Fastify API Endpoint]
    end

    subgraph Queue Layer
      Redis[(Redis Queue: BullMQ)]
    end

    subgraph Workers Cluster
      W1[Media Transcoder Worker]
      W2[Manifest Generator Worker]
      W3[Notification Worker]
    end

    API -->|Push Event: MEDIA_UPLOADED| Redis
    API -->|Push Event: STORY_PUBLISHED| Redis
    Redis --> W1
    Redis --> W2
    Redis --> W3
```

- **Media Transcoder Queue**: Concurrently converts raw image uploads into responsive WebP resolutions (`1920x1080`, `1280x720`, `480x270` blurred placeholders). Strips EXIF metadata.
- **Manifest Builder Queue**: Compiles story nodes, timing intervals, audio wave data, and emotion color tokens into a single static JSON manifest deployed to Edge KV.
