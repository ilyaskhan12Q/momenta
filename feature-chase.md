# MOMENTA — CINEMATIC RECIPIENT EXPERIENCE FEATURE TRACKER (`feature-chase.md`)

This file tracks the architecture-driven implementation of the Momenta Cinematic Recipient Experience.

---

## Architecture Overview & Phase Blueprint

| Phase ID | Phase Name | Status | Completion Date | Commit Hash |
|---|---|---|---|---|
| **Phase 01** | Core Cinematic Experience Architecture & Lifecycle State Machine | Planned | - | - |
| **Phase 02** | Atmospheric WebGL Shader & Particle Background Engine | Planned | - | - |
| **Phase 03** | Relationship Acoustic & Harmonic Web Audio Soundscape | Planned | - | - |
| **Phase 04** | Multi-Modal Tactile Gesture & Unlocking Controller | Planned | - | - |
| **Phase 05** | Cinematic Scene Timeline & 3D Parallax Camera Engine | Planned | - | - |
| **Phase 06** | Relationship Theme & Aesthetic Adaptation Engine | Planned | - | - |
| **Phase 07** | Kinetic Typography & Staggered Word Reveal System | Planned | - | - |
| **Phase 08** | Ambient FX, Lighting Flares & Atmospheric Vignettes | Planned | - | - |
| **Phase 09** | Emotional Outro, Memory Keepsake & Pulse Reaction Engine | Planned | - | - |
| **Phase 10** | Accessibility, Performance Budgeting & E2E Verification | Planned | - | - |

---

## Detailed Phase Breakdown

### Phase 01: Core Cinematic Experience Architecture & Lifecycle State Machine

- **Purpose**: Establish a robust, deterministic state machine (`UNOPENED`, `UNLOCKING`, `PLAYING`, `PAUSED`, `COMPLETED`, `ERROR`) and state container for orchestrating sound, shaders, scene transitions, and user interactions without layout jumps or unhandled states.
- **Features**:
  - `CinematicExperienceContext` and `useCinematicExperience` state hook.
  - Manifest loader with local fallback & Supabase resilience.
  - Lifecycle state management with tick timing & progress signals.
- **Dependencies**: React 18, Zod schema validation.
- **Files Affected**:
  - `src/modules/recipient-renderer/domain/ExperienceStateMachine.ts`
  - `src/modules/recipient-renderer/presentation/context/CinematicExperienceContext.tsx`
  - `src/app/experience/[token]/page.tsx`
  - `tests/modules/recipient-renderer/domain/ExperienceStateMachine.spec.ts`
- **Status**: Verified
- **Progress**: 100%
- **Known Issues**: None
- **Risks**: None
- **Verification Checklist**:
  - [x] `npm run lint` passes (0 errors)
  - [x] `npm run typecheck` passes (0 errors)
  - [x] `npm test` passes (35 test files, 126 tests)
  - [x] `npm run build` succeeds (1.24s)
- **Completion Date**: 2026-07-24
- **Commit Hash**: `2704eab`
- **Notes**: Completed clean state machine architecture and context provider.

---

### Phase 02: Atmospheric WebGL Shader & Particle Background Engine

- **Purpose**: Build a living, dynamic ambient background canvas using WebGL / HTML5 Canvas that adapts shader color palettes, particle velocity, particle density, noise turbulence, and brightness based on relationship parameters (`warmth`, `intensity`, `mood`, `colorPalette`) and experience state.
- **Features**:
  - Custom WebGL / 2D Canvas shader renderer reacting to `useCinematicExperience`.
  - Relationship-to-shader color map (`ROMANTIC` -> deep rose & golden embers, `PLATONIC` -> warm amber & starlight, `FAMILY` -> soft hearth glow, `CUSTOM` -> dynamic HSL).
  - Smooth particle velocity interpolation during state transitions (`UNOPENED` floating gently -> `UNLOCKING` burst -> `PLAYING` dynamic flow -> `COMPLETED` subtle aurora drift).
- **Dependencies**: WebGL, HTML5 Canvas 2D.
- **Files Affected**:
  - `src/modules/recipient-renderer/infrastructure/webgl/ShaderBackgroundCanvas.tsx`
  - `src/modules/recipient-renderer/domain/AtmosphereEngine.ts`
  - `tests/modules/recipient-renderer/domain/AtmosphereEngine.spec.ts`
  - `tests/modules/recipient-renderer/infrastructure/ShaderBackgroundCanvas.spec.ts`
- **Status**: Verified
- **Progress**: 100%
- **Known Issues**: None
- **Risks**: None
- **Verification Checklist**:
  - [x] `npm run lint` passes (0 errors)
  - [x] `npm run typecheck` passes (0 errors)
  - [x] `npm test` passes (36 test files, 130 tests)
  - [x] `npm run build` succeeds (1.27s)
- **Completion Date**: 2026-07-24
- **Commit Hash**: Pending
- **Notes**: Built dynamic WebGL shaders & 2D particle canvas with AtmosphereEngine mappings.

---

### Phase 03: Relationship Acoustic & Harmonic Web Audio Soundscape

- **Purpose**: Procedural Web Audio API soundscape providing tailored musical keys, resonant ambient drone frequencies, and haptic acoustic feedback for touch gestures.
- **Features**:
  - Dual oscillator soundscape synthesizer with relationship tuning.
  - Touch gesture physical sound effects (wax crackle, ribbon slide, match spark).
  - Smooth volume fading and audio state controls with mute toggle.
- **Dependencies**: Web Audio API (Synthesizer & GainNodes).
- **Files Affected**:
  - `src/modules/recipient-renderer/infrastructure/AudioSoundscapeEngine.ts`
  - `tests/modules/recipient-renderer/infrastructure/AudioSoundscapeEngine.spec.ts`
- **Status**: Planned
- **Progress**: 0%
- **Known Issues**: Safari Web Audio autoplay restrictions require user-gesture initialization.
- **Risks**: Audio context suspension must be handled gracefully on splash screen touch.
- **Verification Checklist**:
  - [ ] `npm run lint` passes
  - [ ] `npm run typecheck` passes
  - [ ] `npm test` passes
  - [ ] `npm run build` succeeds
- **Completion Date**: TBD
- **Commit Hash**: TBD
- **Notes**: Multi-frequency harmonic generator.

---

### Phase 04: Multi-Modal Tactile Gesture & Unlocking Controller

- **Purpose**: Build 5 distinct interactive entry gestures tailored to specific relationships (`WaxSeal`, `SatinRibbon`, `MemoryCandle`, `UnfoldParchment`, `HeritageLocket`) with progressive visual feedback.
- **Features**:
  - Hold-to-break wax seal with radial particle burst & crackle sound.
  - Drag-to-untie satin ribbon with physics spring tension.
  - Hold-to-ignite match candle with warm flame bloom.
  - Corner-tap parchment unfolding with paper fold transformation.
  - Lock-and-key locket hold with silver shimmer unlock.
- **Dependencies**: React Pointer Events, GSAP.
- **Files Affected**:
  - `src/modules/recipient-renderer/presentation/components/InteractiveGestureController.tsx`
  - `src/modules/recipient-renderer/presentation/components/WaxSealGesture.tsx`
  - `src/modules/recipient-renderer/presentation/components/SatinRibbonGesture.tsx`
  - `src/modules/recipient-renderer/presentation/components/MemoryCandleGesture.tsx`
  - `src/modules/recipient-renderer/presentation/components/UnfoldParchmentGesture.tsx`
  - `src/modules/recipient-renderer/presentation/components/HeritageLocketGesture.tsx`
  - `tests/modules/recipient-renderer/presentation/InteractiveGestureController.spec.ts`
- **Status**: Planned
- **Progress**: 0%
- **Known Issues**: Touch screen gesture cancellation on drag scroll.
- **Risks**: Need `touch-action: none` on interactive containers to prevent browser scroll intercept.
- **Verification Checklist**:
  - [ ] `npm run lint` passes
  - [ ] `npm run typecheck` passes
  - [ ] `npm test` passes
  - [ ] `npm run build` succeeds
- **Completion Date**: TBD
- **Commit Hash**: TBD
- **Notes**: Primary gateway to emotional story unlocking.

---

### Phase 05: Cinematic Scene Timeline & 3D Parallax Camera Engine

- **Purpose**: Render full-screen cinematic scenes with 3D tilt perspective, auto-advancing progress timeline, manual pagination controls, and scene transition effects.
- **Features**:
  - Dynamic 3D parallax tilting based on cursor/gyroscope movement.
  - Multi-bar scene progress header with active countdown timer.
  - Keyboard navigation (ArrowRight, ArrowLeft, Space to pause).
  - Smooth scene fade and zoom transitions.
- **Dependencies**: GSAP, Lucide Icons.
- **Files Affected**:
  - `src/modules/recipient-renderer/presentation/components/SceneTimelineViewer.tsx`
  - `tests/modules/recipient-renderer/presentation/SceneTimelineViewer.spec.ts`
- **Status**: Planned
- **Progress**: 0%
- **Known Issues**: None
- **Risks**: Timer synchronization during page tab switching; handles page visibility API.
- **Verification Checklist**:
  - [ ] `npm run lint` passes
  - [ ] `npm run typecheck` passes
  - [ ] `npm test` passes
  - [ ] `npm run build` succeeds
- **Completion Date**: TBD
- **Commit Hash**: TBD
- **Notes**: Core story delivery engine.

---

### Phase 06: Relationship Theme & Aesthetic Adaptation Engine

- **Purpose**: Dynamic mapping of relationship types (`ROMANTIC_SOULMATE`, `BEST_FRIEND_FOREVER`, `DEEP_FAMILIAL`, `NOSTALGIC_CHILDHOOD`, `MENTOR_INSPIRATION`, etc.) to specific color tokens, font pairings, shaders, and acoustic scales.
- **Features**:
  - 10 comprehensive relationship preset profiles.
  - Automatic fallback mechanism for unknown relationship identifiers.
  - CSS custom variable injection into root context.
- **Dependencies**: Zod, TypeScript.
- **Files Affected**:
  - `src/modules/recipient-renderer/domain/relationship-presets.ts`
  - `tests/modules/recipient-renderer/domain/relationship-presets.spec.ts`
- **Status**: Planned
- **Progress**: 0%
- **Known Issues**: None
- **Risks**: Must ensure full type coverage without missing properties.
- **Verification Checklist**:
  - [ ] `npm run lint` passes
  - [ ] `npm run typecheck` passes
  - [ ] `npm test` passes
  - [ ] `npm run build` succeeds
- **Completion Date**: TBD
- **Commit Hash**: TBD
- **Notes**: Tailors the experience specifically to sender & recipient bond.

---

### Phase 07: Kinetic Typography & Staggered Word Reveal System

- **Purpose**: Word-by-word staggered reveal animation for memory text to create an intimate, spoken-word feel with custom typography pairings (Playfair, Cinzel, Dancing Script, Outfit, Space Grotesk).
- **Features**:
  - Word-level timing engine with punctuation-aware pause multipliers.
  - Dynamic font loader supporting Google Fonts display types.
  - Text glow & drop shadow micro-animations on current active word.
- **Dependencies**: GSAP, Google Fonts.
- **Files Affected**:
  - `src/modules/recipient-renderer/presentation/components/KineticTextReveal.tsx`
  - `tests/modules/recipient-renderer/presentation/KineticTextReveal.spec.ts`
- **Status**: Planned
- **Progress**: 0%
- **Known Issues**: Large text blocks could overflow small mobile viewports; responsive line height calculation needed.
- **Risks**: Font loading delays handled gracefully with fallback CSS stack.
- **Verification Checklist**:
  - [ ] `npm run lint` passes
  - [ ] `npm run typecheck` passes
  - [ ] `npm test` passes
  - [ ] `npm run build` succeeds
- **Completion Date**: TBD
- **Commit Hash**: TBD
- **Notes**: Enhances reading immersion.

---

### Phase 08: Ambient FX, Lighting Flares & Atmospheric Vignettes

- **Purpose**: Layered visual atmosphere including radial lighting flares, film grain textures, dark vignettes, and floating ambient dust motes.
- **Features**:
  - Floating dust motes canvas overlay with wind drift physics.
  - Dynamic vignette intensity scaling with scene emotional tone.
  - Anamorphic lens flare accents on scene transitions.
- **Dependencies**: Canvas 2D / CSS backdrop filters.
- **Files Affected**:
  - `src/modules/recipient-renderer/presentation/components/AtmosphericFXOverlay.tsx`
  - `tests/modules/recipient-renderer/presentation/AtmosphericFXOverlay.spec.ts`
- **Status**: Planned
- **Progress**: 0%
- **Known Issues**: CPU overhead on low-power devices; offloaded to requestAnimationFrame with throttle.
- **Risks**: Overlay must not block pointer events (`pointer-events: none`).
- **Verification Checklist**:
  - [ ] `npm run lint` passes
  - [ ] `npm run typecheck` passes
  - [ ] `npm test` passes
  - [ ] `npm run build` succeeds
- **Completion Date**: TBD
- **Commit Hash**: TBD
- **Notes**: Adds cinematic filmic depth.

---

### Phase 09: Emotional Outro, Memory Keepsake & Pulse Reaction Engine

- **Purpose**: Climax outro sequence presenting an interactive memory summary, replay capability, and direct emotional reaction trigger ("Send Heart / Warmth Pulse").
- **Features**:
  - Heart / Warmth pulse button with floating particle explosion.
  - Digital memory card keepsake summary generation.
  - Seamless replay loop resetting state machine back to scene 1 with soundtrack continuity.
- **Dependencies**: Supabase reaction API / local fallback, GSAP.
- **Files Affected**:
  - `src/modules/recipient-renderer/presentation/components/ExperienceOutro.tsx`
  - `tests/modules/recipient-renderer/presentation/ExperienceOutro.spec.ts`
- **Status**: Planned
- **Progress**: 0%
- **Known Issues**: Reaction feedback network failures must fail silently with optimistic UI confirmation.
- **Risks**: None.
- **Verification Checklist**:
  - [ ] `npm run lint` passes
  - [ ] `npm run typecheck` passes
  - [ ] `npm test` passes
  - [ ] `npm run build` succeeds
- **Completion Date**: TBD
- **Commit Hash**: TBD
- **Notes**: Emotional closure and connection loop back to sender.

---

### Phase 10: Accessibility, Performance Budgeting & E2E Verification

- **Purpose**: WCAG 2.2 Level AA accessibility compliance (screen reader announcements, focus traps, reduced motion support), performance benchmarking (<50ms frame budget, 60fps), and comprehensive Playwright/Vitest verification.
- **Features**:
  - `prefers-reduced-motion` compliance to simplify WebGL and disable parallax.
  - ARIA live region announcements for scene changes & gesture progress.
  - Complete integration test suite verifying full flow end-to-end.
- **Dependencies**: Vitest, Playwright.
- **Files Affected**:
  - `src/modules/recipient-renderer/presentation/components/` (Accessibility attributes)
  - `tests/e2e/recipient-experience.spec.ts`
- **Status**: Planned
- **Progress**: 0%
- **Known Issues**: None.
- **Risks**: None.
- **Verification Checklist**:
  - [ ] `npm run lint` passes
  - [ ] `npm run typecheck` passes
  - [ ] `npm test` passes
  - [ ] `npm run build` succeeds
- **Completion Date**: TBD
- **Commit Hash**: TBD
- **Notes**: Final quality gate and release verification.

---
