# Momenta — Engineering Documentation Portal

> *"Your feelings, on a page."*

Momenta transforms heartfelt messages into cinematic interactive web experiences. This repository houses the **Single Source of Truth Engineering Documentation** built with Docusaurus.

---

## 📚 Documentation Structure

The documentation is organized into clear engineering domain modules:

```text
docs/
├── 01_PRODUCT/              # Vision, PRD, Personas, User Journeys
├── 02_ARCHITECTURE/         # Engineering Principles, System, Backend, Frontend & Domain Architecture
├── 03_BACKEND/              # Feature Specs, Database Schema (DDL), Storage, API Reference, Security, Business Rules
├── 04_DESIGN/               # Emotion Engine, Story Engine, Design System, Animation Bible
├── 05_DEVOPS/               # Docker, GitHub Actions CI/CD, Deployment, Monitoring & Observability
├── 06_TESTING/              # Unit, Integration, E2E (Playwright), Security & Load Testing (k6)
├── 07_ROADMAP/              # MVP Scope, Version 2.0 Features, Future Ideas
└── 08_APPENDIX/             # ADRs, Technical Glossary, Architecture FAQ
```

---

## 🚀 Quick Start (Local Development)

To run the documentation portal locally:

1. **Install Dependencies**:
   ```bash
   npm ci
   ```

2. **Start Docusaurus Development Server**:
   ```bash
   npm run start
   ```
   Open `http://localhost:3000` in your web browser.

3. **Build Static Site for Production**:
   ```bash
   npm run build
   ```

4. **Type Check**:
   ```bash
   npm run typecheck
   ```

---

## 🌐 Deployments

- **GitHub Pages**: Deployed automatically on every commit to `main` via [.github/workflows/documentation.yml](.github/workflows/documentation.yml).
- **Vercel**: Pre-configured via [vercel.json](vercel.json).
