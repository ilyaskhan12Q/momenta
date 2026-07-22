---
id: Deployment
title: Deployment Architecture (GitHub Pages & Vercel)
sidebar_label: Deployment Strategy
---

# Momenta — Deployment Architecture (GitHub Pages & Vercel)

---

## 1. Dual Deployment Strategy

Momenta supports dual production deployment targets to guarantee high availability:

1. **GitHub Pages (Primary Docs Host)**: Automated build and deployment via GitHub Actions on every merge to `main`.
2. **Vercel (Alternative Edge Platform)**: Zero-configuration Git integration for global edge routing, preview deployments, and analytics.

```mermaid
graph TD
    Repo[GitHub Repository: momenta-org/momenta-docs] --> Actions[GitHub Actions Pipeline]
    Repo --> VercelGit[Vercel GitHub Integration]
    
    Actions -->|Publish Static Build| GHPages[GitHub Pages CDN (gh-pages branch)]
    VercelGit -->|Build & Distribute| VercelEdge[Vercel Global Edge Network]
    
    GHPages --> Domain1[https://momenta-org.github.io]
    VercelEdge --> Domain2[https://docs.momenta.app]
```

---

## 2. Vercel Configuration Specification (`vercel.json`)

To deploy Momenta Documentation on Vercel with optimal caching and clean URL rewrites, the following configuration file is placed in the project root:

```json
{
  "version": 2,
  "framework": "docusaurus-2",
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 3. Environment Variables & Secrets Management

| Environment Variable | Secret Location | Purpose |
| :--- | :--- | :--- |
| `VERCEL_TOKEN` | GitHub Secrets | Authentication for Vercel CLI deployments. |
| `VERCEL_ORG_ID` | GitHub Secrets | Target Vercel Organization identifier. |
| `VERCEL_PROJECT_ID` | GitHub Secrets | Target Vercel Project identifier. |
| `GITHUB_TOKEN` | Automated Actions | Native permissions for GitHub Pages publishing. |
