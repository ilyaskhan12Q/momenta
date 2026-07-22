---
id: API
title: REST API Reference & Specification
sidebar_label: API Reference
---

# Momenta — REST API Reference & Specification

---

## 1. Global API Standards

- **Base URL**: `https://api.momenta.app/v1`
- **Content-Type**: `application/json`
- **Authentication**: `Bearer <JWT_TOKEN>` in `Authorization` header for Authoring endpoints; None required for public token delivery endpoints.
- **Rate Limiting**: 100 requests per minute per IP for public endpoints; 300 requests per minute for authenticated users. Header indicators: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

---

## 2. API Endpoints Reference Matrix

| Endpoint Path | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Public | Register a new sender account. |
| `/auth/login` | `POST` | Public | Authenticate user & issue JWT tokens. |
| `/stories/draft` | `POST` | Bearer | Create a new story draft. |
| `/stories/draft/:id` | `PUT` | Bearer | Update an existing draft payload. |
| `/stories/:id/publish` | `POST` | Bearer | Compile & publish draft to Edge KV. |
| `/delivery/:token` | `GET` | Public | Fetch static story manifest for recipient rendering. |
| `/events/telemetry` | `POST` | Public | Emit non-blocking recipient telemetry/gesture event. |

---

## 3. Endpoints In-Depth Documentation

### 3.1 `POST /stories/draft`

#### Request Headers
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Idempotency-Key: 7b9a4c8e-32d1-4e9f-8a0b-112233445566
```

#### Request Body
```json
{
  "title": "Ten Golden Years",
  "relationship": "PARTNER",
  "occasion": "ANNIVERSARY",
  "gesture": "WAX_SEAL",
  "burnOnRead": false,
  "nodes": [
    {
      "sequenceOrder": 1,
      "nodeType": "INTRO_HEADING",
      "contentText": "To my dearest Elena,"
    },
    {
      "sequenceOrder": 2,
      "nodeType": "MEMORY_BEAT",
      "contentText": "Remember that rainy afternoon in Prague?"
    }
  ]
}
```

#### Successful Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "draftId": "b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "status": "DRAFT",
    "createdAt": "2026-07-22T16:05:23.000Z",
    "updatedAt": "2026-07-22T16:05:23.000Z"
  }
}
```

---

### 3.2 `POST /stories/:id/publish`

#### Request Path Parameters
- `id` (UUID): The internal story draft ID.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "storyId": "b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "status": "PUBLISHED",
    "accessToken": "x9k2pL1m92a",
    "shareUrl": "https://momenta.app/s/x9k2pL1m92a",
    "publishedAt": "2026-07-22T16:06:00.000Z"
  }
}
```

---

### 3.3 `GET /delivery/:token`

#### Request Path Parameters
- `token` (String): 16+ character Nanoid access token.

#### Response Headers
```http
Cache-Control: public, max-age=31536000, immutable
Content-Type: application/json
```

#### Successful Response (`200 OK`)
```json
{
  "storyId": "b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "accessToken": "x9k2pL1m92a",
  "metadata": {
    "relationship": "PARTNER",
    "occasion": "ANNIVERSARY",
    "senderDisplayName": "Marcus"
  },
  "theme": {
    "presetId": "EMOTION_WARM_NOSTALGIA",
    "colors": {
      "background": "#0d0f17",
      "primaryText": "#f8fafc",
      "accentGlow": "#8b5cf6"
    }
  },
  "timeline": [
    {
      "nodeId": "node-1",
      "type": "INTRO_HEADING",
      "text": "To my dearest Elena,",
      "durationMs": 4000
    }
  ],
  "finalGesture": {
    "gestureType": "WAX_SEAL",
    "promptText": "Tap & drag to break the seal",
    "revealedMessageText": "Happy 10th Anniversary, my love."
  }
}
```

#### Error Response (`404 Not Found`)
```json
{
  "success": false,
  "error": {
    "code": "STORY_EXPIRED_OR_NOT_FOUND",
    "message": "This Momenta story link is invalid or has expired.",
    "traceId": "req-88a1-42b9"
  }
}
```
