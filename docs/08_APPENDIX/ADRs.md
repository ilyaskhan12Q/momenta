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
