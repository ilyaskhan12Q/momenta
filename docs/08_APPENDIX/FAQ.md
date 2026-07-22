---
id: FAQ
title: Frequently Asked Questions (FAQ)
sidebar_label: Architecture FAQ
---

# Momenta — Frequently Asked Questions (FAQ)

---

## 1. Architectural & Engineering FAQ

### Q1: Why did we choose a static manifest at Edge KV instead of dynamic SSR rendering for story links?
**A**: Story consumption is read-heavy and prone to viral bursts (e.g. recipients sharing links with family or social media). Static manifests pre-compiled to Edge KV deliver sub-30ms global response times, eliminate backend PostgreSQL connection pool bottlenecks, and reduce infrastructure costs by 95%.

### Q2: How does Momenta handle WebAudio autoplay restrictions across iOS Safari and mobile Chrome?
**A**: Autoplay policies require user interaction before playing audio. Momenta displays an atmospheric splash screen with an explicit action trigger button (`"Open Momenta"`). Tapping this button executes `audioCtx.resume()` within the touch event handler, guaranteeing compliant audio playback.

### Q3: What happens if a recipient denies microphone permissions during the Candle Blowout gesture?
**A**: The Candle Blowout gesture includes an automatic fallback. If microphone permissions are denied or unavailable, the UI seamlessly transitions to a press-and-hold interaction target without failing or throwing error modals.

### Q4: How is recipient data privacy protected?
**A**: Recipients do not log in or create accounts. No third-party ad pixels or tracking cookies are included in the story delivery payload. Media uploads have EXIF geolocation metadata automatically stripped during backend transcoding.

### Q5: How do we prevent link brute-forcing?
**A**: All story access links use 16+ character Nanoids providing over $2^{131}$ entropy combinations. Attempting to enumerate or brute-force links is mathematically infeasible and blocked by rate-limiting WAF rules.
