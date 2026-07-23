---
id: ADRs
title: Architecture Decision Records (ADRs)
sidebar_label: ADRs (Decision Records)
---

# Momenta — Architecture Decision Records (ADRs)

---

## ADR Index & Governance

Momenta uses Architecture Decision Records (ADRs) to document significant architectural decisions, trade-offs, context, and consequences.

---

### ADR-001: Selection of Docusaurus for Engineering Documentation Site

- **Status**: Accepted
- **Date**: 2026-07-22
- **Deciders**: Principal Software Architect, Staff Frontend Engineer, Technical Writing Lead

#### Context & Problem Statement
Momenta requires a world-class, Stripe-grade engineering documentation platform to serve as the single source of truth for all future implementation teams. The solution must support MDX, search, sidebar navigation, Mermaid diagrams, dark mode, responsive design, GitHub Pages deployment, and Vercel hosting.

#### Decision Drivers
- Developer Experience (DX) and Markdown/MDX ecosystem integration.
- Built-in dynamic Mermaid diagram rendering support (`@docusaurus/theme-mermaid`).
- Automated static site generation (SSG) for ultra-fast edge delivery.
- Out-of-the-box dark mode and responsive layout styling.

#### Options Considered
1. **Docusaurus 3.x** (Chosen)
2. Nextra (Next.js-based)
3. VitePress (Vue-based)

#### Decision Outcome
Chosen Option: **Docusaurus 3.x**. 
*Rationale*: Docusaurus provides the most robust off-the-shelf sidebar customization, native Mermaid rendering plugin, dark mode support, and seamless GitHub Pages deployment action integration.

#### Consequences & Trade-offs
- *Positive*: Zero manual routing code required for documentation categories; high performance static HTML output; standardized search integration.
- *Negative*: React 18 requirement for custom components within MDX files.

---

### ADR-002: Edge KV Storage Strategy for Compiled Story Manifests

- **Status**: Accepted
- **Date**: 2026-07-22
- **Deciders**: Principal Software Architect, Database Architect, DevOps Engineer

#### Context & Problem Statement
Serving recipients from a centralized relational database during viral traffic spikes risks connection pool exhaustion and elevated latencies (> 500ms) for international users.

#### Decision Outcome
Chosen Option: **Cloudflare Edge KV + Immutable S3 JSON Manifests**.
*Rationale*: When a sender publishes a story, the backend compiles all nodes and assets into a single static JSON manifest (`story_v1_manifest`) written to S3 and mirrored to Cloudflare Edge KV. Recipient requests are served directly from the nearest CDN edge node in < 30ms without hitting primary PostgreSQL databases.

#### Consequences
- Primary database load reduced by 99% for story consumption.
- Requires explicit Edge KV purge cache invalidation when a story is deleted or expired by the sender.

---

### ADR-003: WebAudio Autoplay Compliance via Interactive Splash Trigger

- **Status**: Accepted
- **Date**: 2026-07-22
- **Deciders**: Staff Frontend Engineer, Motion System Architect, UX Architect

#### Context & Problem Statement
Modern web browsers (iOS Safari, Chrome, Edge) block unprompted audio autoplay without an explicit user gesture (`AudioContext` initialized in suspended state).

#### Decision Outcome
Design an atmospheric splash screen featuring an explicit pulsing action trigger button (`"Open Momenta"`). Clicking/tapping this button calls `audioCtx.resume()` within the physical touch event handler, satisfying browser autoplay policies seamlessly.

---

### ADR-004: Experience Aggregate Root & Domain Event Bus Architecture

- **Status**: Accepted
- **Date**: 2026-07-22
- **Deciders**: Lead Backend Engineer, System Architect

#### Context & Problem Statement
The authoring domain model previously treated stories as isolated nodes. To support multi-scene timelines, strict publishing preconditions, and audit trails, the domain model required an aggregate root structure.

#### Decision Outcome
Chosen Option: Make `Experience` the Aggregate Root with `Story` and `Scene` subdomains. Domain events (`ExperienceCreatedEvent`, `SceneAppendedEvent`, `ExperiencePublishedEvent`, `ExperienceDeletedEvent`) are dispatched asynchronously via `DomainEventBus`.

---

### ADR-005: Modular Emotion Pipeline & Deterministic On-The-Fly ExperiencePresentationContract Generation

- **Status**: Accepted
- **Date**: 2026-07-23
- **Deciders**: Lead Backend Engineer, System Architect

#### Context & Problem Statement
Dynamic sensory presentation tokens (colors, typography, WebGL shaders, WebAudio stems, gestures, animations) need to be synthesized from experience text without storing rigid static blobs in relational database tables.

#### Decision Outcome
Chosen Option:
1. `ExperiencePresentationContract` represents the runtime presentation model.
2. `EmotionPipelineOrchestrator` coordinates stage execution (`LanguageDetectionStage`, `ContextAnalysisStage`, `EmotionScoringStage`, `IntensityResolutionStage`, `PresentationResolutionStage`, `StructuralValidationStage`, `ExperienceValidationStage`).
3. Pure domain isolation (`src/modules/emotion-engine/domain` has zero Next.js, Supabase, HTTP, or browser dependencies).
4. Presentation resolution is delegated to dedicated sub-resolvers (`ColorResolver`, `TypographyResolver`, `ShaderResolver`, `AnimationResolver`, `AudioResolver`, `GestureResolver`, `InteractionResolver`, `AccessibilityResolver`) backed by Strategy Registries.
5. Contracts are generated deterministically on-the-fly using `engineVersion: "1.0.0"` and `themeVersion: "1.0.0"`.

#### Consequences
- 100% deterministic outputs suitable for snapshot testing.
- Easily extensible with future AI/LLM analyzers via `IEmotionAnalyzer`.
- Zero database storage overhead for generated presentation tokens.

---

### ADR-006: Immutable StoryManifestV1 Compiler & CDN Edge Caching Strategy

- **Status**: Accepted
- **Date**: 2026-07-23
- **Deciders**: Lead Backend Engineer, System Architect

#### Context & Problem Statement
When a sender publishes an experience, recipients need to load the full scene timeline and dynamic presentation tokens instantly without executing dynamic database JOIN queries or running emotion pipeline scoring on every page load.

#### Decision Outcome
1. `StoryManifestCompiler` compiles the `Experience` aggregate root and `ExperiencePresentationContract` into a frozen `StoryManifestV1` document (`manifestVersion: "1.0.0"`).
2. Manifests include a SHA-256 integrity `checksum` computed over scene beats and presentation tokens.
3. The public recipient endpoint `GET /api/v1/manifests/[token]` returns static JSON manifests with HTTP header `Cache-Control: public, max-age=31536000, immutable`, enabling edge CDN caching.

#### Consequences
- Recipient playback load latency reduced to < 20ms.
- 100% isolated from primary database traffic spikes.
- Immutable snapshot isolation guarantees experiences never break even if drafts are modified.

---

### ADR-007: WebGL Fragment Shader Canvas & WebAudio API Synthesizer Architecture

- **Status**: Accepted
- **Date**: 2026-07-23
- **Deciders**: Lead Backend Engineer, Staff Frontend Engineer, System Architect

#### Context & Problem Statement
Rendering dynamic presentation tokens (shaders, audio stems, typography, and gestures) for recipients must deliver a premium, responsive experience without heavy 3D engine bundles (Three.js ~600KB) or autoplay policy rejections.

#### Decision Outcome
1. **Pure WebGL2 Canvas (`ShaderBackgroundCanvas`)**: Fragment shaders (`WARM_AURORA`, `CELESTIAL_SPARKS`) rendered directly using raw WebGL2 contexts without external 3D engine dependencies.
2. **WebAudio Autoplay Compliance (`ExperienceSplash` & `AudioSoundscapeEngine`)**: `AudioContext` is created/resumed inside the initial touch/click gesture handler (`"Open Experience"`), ensuring 100% compliance with iOS Safari and Chrome autoplay policies.
3. **Interactive Gesture Seals**: `WaxSealGesture` provides press-and-hold radial progress feedback before starting scene playback.

#### Consequences
- Zero external bundle bloat for WebGL/WebAudio.
- Instant, smooth recipient playback across mobile and desktop viewports.
- Fully compliant with browser WebAudio autoplay security policies.



