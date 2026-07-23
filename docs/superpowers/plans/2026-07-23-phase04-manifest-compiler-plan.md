# Phase 04: Story Manifest Compiler Engine (`StoryManifestV1`) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Phase 04 Story Manifest Compiler Engine: `StoryManifestV1` domain contract, SHA-256 checksum calculator, `StoryManifestCompiler`, `ManifestValidationSpec`, `SupabaseManifestRepository`, `CompileAndPublishManifestUseCase`, `GetPublishedManifestUseCase`, public REST API `GET /api/v1/manifests/[token]`, and unit/integration tests.

**Architecture:** Clean Architecture with pure domain isolation (`src/modules/story-manifest/domain` has zero framework dependencies).

---

### Task 1: StoryManifestV1 Domain Contract & ManifestValidationSpec

**Files:**
- Create: `src/modules/story-manifest/domain/contracts/StoryManifestV1.ts`
- Create: `src/modules/story-manifest/domain/specifications/ManifestValidationSpec.ts`
- Create: `tests/modules/story-manifest/domain/ManifestValidationSpec.spec.ts`

- [ ] **Step 1: Write failing unit test for ManifestValidationSpec**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement StoryManifestV1 interface and ManifestValidationSpec**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 2: StoryManifestCompiler & SHA-256 Checksum Generator

**Files:**
- Create: `src/modules/story-manifest/domain/compiler/StoryManifestCompiler.ts`
- Create: `tests/modules/story-manifest/domain/StoryManifestCompiler.spec.ts`

- [ ] **Step 1: Write failing unit test for StoryManifestCompiler & Checksum calculation**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement StoryManifestCompiler with crypto SHA-256 generator**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 3: IManifestRepository & SupabaseManifestRepository

**Files:**
- Create: `src/modules/story-manifest/domain/repositories/IManifestRepository.ts`
- Create: `src/modules/story-manifest/infrastructure/repositories/SupabaseManifestRepository.ts`
- Create: `tests/modules/story-manifest/infrastructure/SupabaseManifestRepository.spec.ts`

- [ ] **Step 1: Write failing unit test for SupabaseManifestRepository**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement IManifestRepository and SupabaseManifestRepository**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 4: Application Layer Use Cases

**Files:**
- Create: `src/modules/story-manifest/application/use-cases/CompileAndPublishManifestUseCase.ts`
- Create: `src/modules/story-manifest/application/use-cases/GetPublishedManifestUseCase.ts`
- Create: `tests/modules/story-manifest/application/ManifestUseCases.spec.ts`

- [ ] **Step 1: Write failing unit test for CompileAndPublishManifestUseCase & GetPublishedManifestUseCase**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement both application use cases**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 5: Recipient REST API Controller

**Files:**
- Create: `src/app/api/v1/manifests/[token]/route.ts`
- Create: `tests/presentation/manifests-api.spec.ts`

- [ ] **Step 1: Write integration test for GET /api/v1/manifests/[token]**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement GET endpoint handler returning JSON manifest with CDN cache headers**
- [ ] **Step 4: Run test to verify pass & commit**

---

### Task 6: Full Verification & ADR-006

**Files:**
- Update: `docs/08_APPENDIX/ADRs.md` (Add ADR-006)

- [ ] **Step 1: Run typecheck `npx tsc --noEmit`**
- [ ] **Step 2: Run full test suite `npx vitest run`**
- [ ] **Step 3: Run static documentation build `npm run build`**
- [ ] **Step 4: Final commit & push**
