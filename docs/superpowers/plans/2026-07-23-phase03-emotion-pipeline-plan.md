# Phase 03: Modular Emotion Pipeline & Experience Presentation Synthesis — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Phase 03 Modular Emotion Pipeline & Experience Presentation Synthesis: `ExperiencePresentationContract`, `EmotionPipelineOrchestrator`, dual validation stages, strategy registries, dedicated resolvers, rule-based analyzer, application use case, REST API endpoint, and deterministic snapshot testing.

**Architecture:** Clean Architecture with pure domain isolation (`src/modules/emotion-engine/domain` has zero framework dependencies).

---

### Task 1: Domain Contracts, Events, & Pipeline Hooks

**Files:**
- Create: `src/modules/emotion-engine/domain/contracts/ExperiencePresentationContract.ts`
- Create: `src/modules/emotion-engine/domain/interfaces/IEmotionAnalyzer.ts`
- Create: `src/modules/emotion-engine/domain/interfaces/IEmotionPipelineStage.ts`
- Create: `src/modules/emotion-engine/domain/interfaces/IPipelineHook.ts`
- Create: `src/modules/emotion-engine/domain/events/EmotionPipelineStartedEvent.ts`
- Create: `src/modules/emotion-engine/domain/events/EmotionPipelineCompletedEvent.ts`
- Create: `tests/modules/emotion-engine/domain/ContractsAndEvents.spec.ts`

- [ ] **Step 1: Write failing unit test for Contracts & Events**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement domain contracts, interfaces, and events**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 2: Strategy Registries & Default Fallback Profiles

**Files:**
- Create: `src/modules/emotion-engine/domain/registries/interfaces/IEmotionRegistry.ts`
- Create: `src/modules/emotion-engine/domain/registries/interfaces/IRelationshipRegistry.ts`
- Create: `src/modules/emotion-engine/domain/registries/interfaces/IOccasionRegistry.ts`
- Create: `src/modules/emotion-engine/domain/registries/interfaces/ITypographyRegistry.ts`
- Create: `src/modules/emotion-engine/domain/registries/interfaces/IShaderRegistry.ts`
- Create: `src/modules/emotion-engine/domain/registries/interfaces/IAnimationRegistry.ts`
- Create: `src/modules/emotion-engine/domain/registries/interfaces/IAudioRegistry.ts`
- Create: `src/modules/emotion-engine/domain/registries/interfaces/IGestureRegistry.ts`
- Create: `src/modules/emotion-engine/domain/registries/EmotionRegistry.ts`
- Create: `src/modules/emotion-engine/domain/registries/TypographyRegistry.ts`
- Create: `src/modules/emotion-engine/domain/registries/ShaderRegistry.ts`
- Create: `src/modules/emotion-engine/domain/registries/AnimationRegistry.ts`
- Create: `src/modules/emotion-engine/domain/registries/AudioRegistry.ts`
- Create: `src/modules/emotion-engine/domain/registries/GestureRegistry.ts`
- Create: `src/modules/emotion-engine/domain/fallbacks/DefaultEmotionProfile.ts`
- Create: `src/modules/emotion-engine/domain/fallbacks/DefaultPresentationProfile.ts`
- Create: `tests/modules/emotion-engine/domain/Registries.spec.ts`

- [ ] **Step 1: Write failing unit test for Registries and Fallback profiles**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement strategy registries and default fallbacks**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 3: Dedicated Presentation Sub-Resolvers

**Files:**
- Create: `src/modules/emotion-engine/domain/resolvers/ColorResolver.ts`
- Create: `src/modules/emotion-engine/domain/resolvers/TypographyResolver.ts`
- Create: `src/modules/emotion-engine/domain/resolvers/ShaderResolver.ts`
- Create: `src/modules/emotion-engine/domain/resolvers/AnimationResolver.ts`
- Create: `src/modules/emotion-engine/domain/resolvers/AudioResolver.ts`
- Create: `src/modules/emotion-engine/domain/resolvers/GestureResolver.ts`
- Create: `src/modules/emotion-engine/domain/resolvers/InteractionResolver.ts`
- Create: `src/modules/emotion-engine/domain/resolvers/AccessibilityResolver.ts`
- Create: `src/modules/emotion-engine/domain/resolvers/PresentationResolver.ts`
- Create: `tests/modules/emotion-engine/domain/Resolvers.spec.ts`

- [ ] **Step 1: Write failing unit test for PresentationResolvers**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement sub-resolvers and main PresentationResolver**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 4: Pipeline Stages & Rule-Based Emotion Analyzer

**Files:**
- Create: `src/modules/emotion-engine/domain/analyzers/RuleBasedEmotionAnalyzer.ts`
- Create: `src/modules/emotion-engine/domain/stages/LanguageDetectionStage.ts`
- Create: `src/modules/emotion-engine/domain/stages/ContextAnalysisStage.ts`
- Create: `src/modules/emotion-engine/domain/stages/EmotionScoringStage.ts`
- Create: `src/modules/emotion-engine/domain/stages/IntensityResolutionStage.ts`
- Create: `src/modules/emotion-engine/domain/stages/PresentationResolutionStage.ts`
- Create: `src/modules/emotion-engine/domain/stages/StructuralValidationStage.ts`
- Create: `src/modules/emotion-engine/domain/stages/ExperienceValidationStage.ts`
- Create: `tests/modules/emotion-engine/domain/PipelineStages.spec.ts`

- [ ] **Step 1: Write failing unit test for Stages & RuleBasedEmotionAnalyzer**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement 7 pipeline stages and analyzer**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 5: EmotionPipelineOrchestrator & Execution Engine

**Files:**
- Create: `src/modules/emotion-engine/domain/EmotionPipelineOrchestrator.ts`
- Create: `tests/modules/emotion-engine/domain/EmotionPipelineOrchestrator.spec.ts`
- Create: `tests/modules/emotion-engine/domain/DeterministicSnapshot.spec.ts`

- [ ] **Step 1: Write failing unit test for Orchestrator and Deterministic Snapshots**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement EmotionPipelineOrchestrator**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 6: Application Layer & Presentation API Controller

**Files:**
- Create: `src/modules/emotion-engine/application/use-cases/ProcessEmotionPipelineUseCase.ts`
- Create: `src/app/api/v1/experiences/[id]/emotion/route.ts`
- Create: `tests/presentation/emotion-api.spec.ts`

- [ ] **Step 1: Write integration tests for ProcessEmotionPipelineUseCase and POST /api/v1/experiences/[id]/emotion**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement Use Case and REST API Handler**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 7: Full Verification & ADR Recording

**Files:**
- Update: `docs/08_APPENDIX/ADRs.md` (Add ADR-005)
- Update: `docs/superpowers/specs/2026-07-23-phase03-emotion-pipeline-design.md`

- [ ] **Step 1: Run typecheck `npx tsc --noEmit`**
- [ ] **Step 2: Run full test suite `npx vitest run`**
- [ ] **Step 3: Run static documentation build `npm run build`**
- [ ] **Step 4: Final commit**
