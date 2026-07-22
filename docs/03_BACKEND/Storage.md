---
id: Storage
title: Cloud Storage & Blob Architecture
sidebar_label: Storage Architecture
---

# Momenta — Cloud Storage & Blob Architecture

---

## 1. Bucket Hierarchy & Topology

Momenta utilizes S3-compatible Cloud Storage (AWS S3 or Cloudflare R2) split across isolated environments and lifecycle tiers.

```text
s3://momenta-media-production/
├── raw-uploads/                     # Transient temporary ingestion bucket (7-day auto-purge)
│   └── {user_id}/{draft_id}/
│       └── {raw_file_id}.heic
│
├── processed/                       # Production optimized WebP & AAC files
│   └── stories/
│       └── {story_id}/
│           ├── images/
│           │   ├── {asset_id}_1080p.webp
│           │   └── {asset_id}_720p.webp
│           └── audio/
│               └── {asset_id}_stem.aac
│
└── manifests/                       # Immutable compiled JSON manifests
    └── {access_token}.json
```

---

## 2. Presigned URL Upload Flow

To prevent heavy binary file uploads from passing through API gateway servers, client browsers upload media directly to S3/R2 using pre-signed PUT URLs.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Studio SPA
    participant API as API Gateway
    participant S3 as AWS S3 / Cloudflare R2

    Client->>API: POST /api/v1/media/upload-url { filename: "photo.jpg", mimeType: "image/jpeg" }
    API->>API: Validate Auth Session & File Extension
    API->>S3: Generate Presigned PUT URL (Expiration: 900s)
    API-->>Client: Return { signedUrl, assetId, publicPath }
    Client->>S3: PUT /raw-uploads/user_123/asset_456.jpg (Binary payload)
    S3-->>Client: 200 OK
    Client->>API: POST /api/v1/media/confirm { assetId }
    API->>API: Enqueue BullMQ Processing Job
```

---

## 3. Storage Security & Encryption Controls

1. **Server-Side Encryption**: All objects stored using SSE-S3 (`AES-256` encryption at rest).
2. **Access Control (ACL)**: Production buckets deny public `s3:ListBucket`. Direct reads allowed only via Cloudflare CDN signed request signatures or origin access control (OAC).
3. **CORS Configuration**: Restricts direct upload endpoints to authorized domain origins (`https://momenta.app`, `https://studio.momenta.app`).
