# Phase 05: Recipient WebGL & WebAudio Experience Renderer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Phase 05 Recipient WebGL & WebAudio Experience Renderer: `AudioSoundscapeEngine`, `ShaderBackgroundCanvas`, `WaxSealGesture`, `ExperienceSplash`, `SceneTimelineViewer`, public page `/experience/[token]`, and automated tests.

**Architecture:** Clean Architecture with pure WebGL2 and WebAudio API browser integration.

---

### Task 1: AudioSoundscapeEngine (WebAudio Synthesizer Engine)

**Files:**
- Create: `src/modules/recipient-renderer/infrastructure/audio/AudioSoundscapeEngine.ts`
- Create: `tests/modules/recipient-renderer/infrastructure/AudioSoundscapeEngine.spec.ts`

- [ ] **Step 1: Write failing unit test for AudioSoundscapeEngine (mocking WebAudio API)**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement AudioSoundscapeEngine with low-pass filter and gain envelope**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 2: ShaderBackgroundCanvas (WebGL Fragment Shader Renderer)

**Files:**
- Create: `src/modules/recipient-renderer/infrastructure/webgl/ShaderBackgroundCanvas.tsx`
- Create: `tests/modules/recipient-renderer/infrastructure/ShaderBackgroundCanvas.spec.ts`

- [ ] **Step 1: Write failing component test for ShaderBackgroundCanvas**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement ShaderBackgroundCanvas with WARM_AURORA and CELESTIAL_SPARKS shaders**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 3: Interactive Gestures & Splash Screen

**Files:**
- Create: `src/modules/recipient-renderer/presentation/components/WaxSealGesture.tsx`
- Create: `src/modules/recipient-renderer/presentation/components/ExperienceSplash.tsx`
- Create: `tests/modules/recipient-renderer/presentation/WaxSealGesture.spec.ts`

- [ ] **Step 1: Write failing unit test for WaxSealGesture press-and-hold interaction**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement WaxSealGesture and ExperienceSplash components**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 4: Timeline Scene Viewer

**Files:**
- Create: `src/modules/recipient-renderer/presentation/components/SceneTimelineViewer.tsx`
- Create: `tests/modules/recipient-renderer/presentation/SceneTimelineViewer.spec.ts`

- [ ] **Step 1: Write failing unit test for SceneTimelineViewer timeline scene navigation**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement SceneTimelineViewer component**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 5: Recipient Page Controller (/experience/[token])

**Files:**
- Create: `src/app/experience/[token]/page.tsx`
- Create: `tests/presentation/recipient-page.spec.ts`

- [ ] **Step 1: Write integration test for Recipient Page route**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement src/app/experience/[token]/page.tsx client component**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 6: Full Verification, ADR-007 & Final System Integration

**Files:**
- Update: `docs/08_APPENDIX/ADRs.md` (Add ADR-007)

- [ ] **Step 1: Run typecheck `npx tsc --noEmit`**
- [ ] **Step 2: Run full test suite `npx vitest run`**
- [ ] **Step 3: Run static documentation build `npm run build`**
- [ ] **Step 4: Final commit & push**
