# Momenta Phase 05: Recipient WebGL & WebAudio Experience Renderer — Technical Design Specification

**Date:** 2026-07-23  
**Status:** Approved  
**Author:** Lead Backend Engineer & System Architect  

---

## 1. Executive Summary & Component Architecture

Phase 05 implements the **Recipient Experience Renderer** (`src/modules/recipient-renderer`) for Momenta.

### Key Architectural Principles
1. **Zero-Bundle WebGL Canvas**: Fragment shaders (`WARM_AURORA`, `CELESTIAL_SPARKS`) rendered using pure HTML5 WebGL2 context without 600KB external 3D libraries (Three.js).
2. **WebAudio Autoplay Compliance**: `AudioContext` initialized inside the interactive user tap gesture handler (`ExperienceSplash`).
3. **Responsive Glassmorphic UI**: Premium presentation contracts (`ExperiencePresentationContract`) mapped to HSL colors, typography fonts, ambient gradients, and glassmorphic cards.
4. **Interactive Gesture Unsealing**: `WaxSealGesture` (press-and-hold radial progress) and `RibbonPullGesture` (touch drag untying).

---

## 2. Component Structure & Data Flow

```mermaid
graph TD
    subgraph Recipient Page Route src/app/experience/[token]/page.tsx
      Page[Experience Page Controller] --> Fetch[Fetch StoryManifestV1 from API]
      Fetch --> State{State: UNOPENED | PLAYING | COMPLETED}
      State -->|UNOPENED| Splash[ExperienceSplash & WaxSealGesture]
      State -->|PLAYING| Renderer[ExperienceContainer]
      Renderer --> Canvas[ShaderBackgroundCanvas - WebGL]
      Renderer --> Audio[AudioSoundscapeEngine - WebAudio]
      Renderer --> Timeline[SceneTimelineViewer]
    end
```

---

## 3. Core Component Contracts

### 1. WebGL Canvas Renderer (`ShaderBackgroundCanvas.tsx`)
- **Props**: `shader: ShaderTokens`, `colors: ColorTokens`, `reducedMotion?: boolean`.
- **GLSL Shaders**:
  - `WARM_AURORA`: Simplex noise warm color wave shader.
  - `CELESTIAL_SPARKS`: Radial spark particle shader.
- **Fallback**: Static radial HSL ambient gradient if WebGL is unsupported or `reducedMotion` is true.

### 2. WebAudio Soundscape Engine (`AudioSoundscapeEngine.ts`)
- **API**:
  - `initialize(audioCtx: AudioContext, tokens: AudioTokens): void`
  - `start(): void`
  - `stop(): void`
  - `setCutoff(frequencyHz: number): void`
- **Graph**: `OscillatorNode[]` / `AudioBufferSourceNode` $\rightarrow$ `BiquadFilterNode` $\rightarrow$ `GainNode` $\rightarrow$ `destination`.

### 3. Interactive Gesture Seals (`WaxSealGesture.tsx`)
- **Props**: `gesture: GestureTokens`, `onComplete: () => void`.
- **Interaction**: Press-and-hold timer (1000ms threshold) with SVG radial progress ring and golden particle explosion canvas.

### 4. Timeline Scene Navigator (`SceneTimelineViewer.tsx`)
- **Props**: `scenes: ManifestSceneBeat[]`, `typography: TypographyTokens`, `colors: ColorTokens`, `animation: AnimationTokens`, `onComplete: () => void`.
- **Features**: Automatic beat progress timer, scene transition animations, manual tap navigation (left/right).

---

## 4. Summary of Files to Produce in Phase 05

1. **WebAudio & WebGL Core Engine**:
   - `src/modules/recipient-renderer/infrastructure/audio/AudioSoundscapeEngine.ts`
   - `src/modules/recipient-renderer/infrastructure/webgl/ShaderBackgroundCanvas.tsx`
2. **Interactive UI Components**:
   - `src/modules/recipient-renderer/presentation/components/WaxSealGesture.tsx`
   - `src/modules/recipient-renderer/presentation/components/ExperienceSplash.tsx`
   - `src/modules/recipient-renderer/presentation/components/SceneTimelineViewer.tsx`
3. **Recipient Next.js Page Route**:
   - `src/app/experience/[token]/page.tsx`
4. **Tests**:
   - `tests/modules/recipient-renderer/infrastructure/AudioSoundscapeEngine.spec.ts`
   - `tests/presentation/recipient-page.spec.ts`
