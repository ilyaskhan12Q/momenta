---
id: Glossary
title: Technical & Domain Glossary
sidebar_label: Technical Glossary
---

# Momenta — Technical & Domain Glossary

---

## 1. Terminology Directory

| Term | Category | Definition & Technical Meaning |
| :--- | :--- | :--- |
| **Story Manifest** | Data Architecture | A static, immutable JSON document compiled upon publication containing the complete node graph, audio stem references, shader tokens, and final gesture configuration for an experience. |
| **Emotion Engine** | Domain Architecture | The algorithmic subsystem that analyzes sender text sentiment and maps intent to WebGL shaders, HSL color palettes, typography scales, and WebAudio stems. |
| **Story Node** | Data Model | A single narrative beat within a story (e.g. Intro Heading, Paragraph, Memory Photo Card, Quote, Climax Text). |
| **Final Gesture** | Recipient UX | An interactive physical-like gesture executed at the end of a story (e.g. Wax Seal Shatter, Candle Blowout) that reveals the final note and completes the experience. |
| **Link Token** | Security | A 16+ character cryptographically random Nanoid appended to story delivery URLs providing high entropy access without requiring recipient authentication. |
| **Burn-on-Read** | Security / Privacy | An optional setting where a published story manifest is purged from Edge KV shortly after the recipient completes the final gesture, rendering the link single-use. |
| **LQIP** | Performance | Low Quality Image Placeholder — a micro-sized (32px width) WebP or 48-byte Base64 blur hash loaded instantaneously before high-res assets hydrate. |
| **Edge KV** | Infrastructure | Globally distributed Key-Value data store running at CDN edge nodes (Cloudflare Workers KV) providing sub-30ms reads worldwide. |
| **WebAudio API** | Frontend Tech | High-level JavaScript API for processing and synthesizing audio in web applications, used in Momenta for synchronized ambient stem crossfading. |
