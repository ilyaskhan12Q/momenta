---
id: UserJourneys
title: User Journeys & End-to-End Workflows
sidebar_label: User Journeys
---

# Momenta — User Journeys & End-to-End Workflows

---

## 1. Primary Workflows Overview

Momenta orchestrates two critical end-to-end paths:
1. **Creation & Delivery Journey (Sender)**
2. **Story Consumption & Interaction Journey (Recipient)**

```mermaid
sequenceDiagram
    autonumber
    actor Sender
    participant Studio as Sender Studio (SPA)
    participant API as Backend API Gateway
    participant Storage as Cloud Storage (S3)
    participant CDN as Global Edge CDN
    actor Recipient
    participant Engine as Recipient Engine (WebAudio/WebGL)

    Sender->>Studio: Start Creation (Select Relationship/Occasion)
    Studio->>API: POST /api/v1/stories/draft
    API-->>Studio: Return draft_id + signed upload URLs
    Sender->>Studio: Upload Photos & Custom Audio
    Studio->>Storage: Direct Binary Upload (S3 Signed URL)
    Sender->>Studio: Preview & Confirm Final Interaction
    Sender->>API: POST /api/v1/stories/{draft_id}/publish
    API->>API: Generate Access Token (Nanoid) & Encrypt Payload
    API-->>Sender: Return Unique Experience URL (e.g. momenta.app/s/x9k2pL1m)

    Sender->>Recipient: Share URL via Messaging App (WhatsApp/SMS)
    Recipient->>CDN: GET /s/x9k2pL1m
    CDN-->>Recipient: Serve Pre-rendered Edge Shell & Assets
    Recipient->>Engine: Tap "Begin Experience" (Initialize WebAudio)
    Engine->>Engine: Render Act I -> Act II -> Act III -> Final Gesture
    Recipient->>Engine: Complete Final Gesture (Break Wax Seal)
    Engine->>API: POST /api/v1/stories/{id}/events (Type: READ_COMPLETE)
    API-->>Sender: Push Notification ("Your Momenta story was experienced!")
```

---

## 2. Sender Creation Journey (Step-by-Step)

```mermaid
stateDiagram-v2
    state "Step 1: Emotional Intent" as S1
    state "Step 2: Content Composition" as S2
    state "Step 3: Asset Orchestration" as S3
    state "Step 4: Real-time Canvas Preview" as S4
    state "Step 5: Fulfillment & Publishing" as S5

    [*] --> S1
    S1 --> S2: Validated Intent & Relationship
    S2 --> S3: Text Saved (Draft)
    S3 --> S4: Assets Transcoded & Pre-fetched
    S4 --> S3: Adjust Timings / Reorder Photos
    S4 --> S5: Confirm Preview
    S5 --> [*]: Receive Encrypted Shareable Token
```

### Flow Breakdown & Business Validation

| Step | User Action | System Operations | Error Recovery |
| :--- | :--- | :--- | :--- |
| **01. Intent** | Selects relationship ("Partner") & occasion ("Anniversary"). | Initializes draft record in database (`status: DRAFT`). Applies default theme tokens. | Network failure auto-retries using local storage fallback. |
| **02. Composition** | Enters personal message, key dates, and emotional quotes. | Runs client-side character validation and tone classifier (Emotion Engine). | Truncates text over 2,000 characters with visual indicator. |
| **03. Assets** | Selects 5 photos and background audio track. | Generates client-side thumbnails; requests signed S3 PUT URLs. Transcodes audio waveforms. | If upload fails, retries upload with exponential backoff. |
| **04. Preview** | Views real-time WebGL/CSS preview in simulated mobile frame. | Executes local WebAudio synth and layout preview. | Frame drops > 10% trigger low-spec shader preview automatically. |
| **05. Publish** | Clicks "Lock & Send". | Transitions state to `PUBLISHED`. Generates 128-bit Nanoid link token. | Idempotency key prevents double billing/publishing. |

---

## 3. Recipient Consumption Journey

```mermaid
flowchart TD
    A[Click Share Link] --> B{Valid Token?}
    B -- No --> C[Display 404 / Expired Story Screen]
    B -- Yes --> D[Fetch Story Manifest JSON]
    D --> E[Show Atmospheric Splash Screen]
    E --> F[User Taps 'Open Experience']
    F --> G[Initialize WebAudio Context & Start Ambient Track]
    G --> H[Act I: Ambient Title & Typographic Intro]
    H --> I[Act II: Photo Narrative Beats & Parallax Cards]
    I --> J[Act III: Emotional Climax Text]
    J --> K[Act IV: Interactive Final Gesture]
    K --> L[Send Reaction & Download Memory Keepsake]
```

### Recipient Interaction Rules

1. **Autoplay Safeguard**: Web browser audio policies forbid unprompted audio playback. The entry screen presents a full-bleed atmospheric ambient visual with a single pulsing trigger button (`"Open Momenta"`). Tapping this button executes `audioCtx.resume()`.
2. **Gesture Mechanics**: 
   - Mobile: Swipe up / Tap side controls story pacing.
   - Desktop: Scroll wheel or Arrow keys control timeline progression.
3. **One-Time Interaction Rule**: Senders can configure *Single-View Mode*. After the final gesture is executed, the server marks the token state as `CONSUMED`. Subsequent access displays a read-only archived keepsake view without the interactive reveal state.
