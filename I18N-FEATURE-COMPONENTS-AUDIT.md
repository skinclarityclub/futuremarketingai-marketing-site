# i18n Feature Components Audit

**Date:** 2025-10-23
**Status:** In Progress - Feature Components Translation
**Goal:** Translate all feature-related components on landing page

---

## 🎯 Components to Translate

### 1. FeatureShowcase.tsx (Priority: HIGH)

**Hardcoded Strings Found: ~35**

| Feature ID | Category    | String                                     | Translation Key                           | Priority |
| ---------- | ----------- | ------------------------------------------ | ----------------------------------------- | -------- |
| 1          | Title       | "Research & Planning Intelligence"         | `landing.features.research.title`         | High     |
| 1          | Description | "AI analyzes market trends 24/7..."        | `landing.features.research.description`   | High     |
| 1          | Stat        | "€6,400/mo saved"                          | `landing.features.research.stat`          | High     |
| 2          | Title       | "Manager Orchestration Engine"             | `landing.features.manager.title`          | High     |
| 2          | Description | "Coordinates all workflows..."             | `landing.features.manager.description`    | High     |
| 2          | Stat        | "€12,000/mo saved"                         | `landing.features.manager.stat`           | High     |
| 3          | Title       | "Content Creation Pipelines"               | `landing.features.content.title`          | High     |
| 3          | Description | "Creates platform-optimized content..."    | `landing.features.content.description`    | High     |
| 3          | Stat        | "€8,000/mo saved"                          | `landing.features.content.stat`           | High     |
| 4          | Title       | "Smart Publishing Layer"                   | `landing.features.publishing.title`       | High     |
| 4          | Description | "Posts at scientifically optimal times..." | `landing.features.publishing.description` | High     |
| 4          | Stat        | "+€15,000/mo revenue"                      | `landing.features.publishing.stat`        | High     |
| 5          | Title       | "Self-Learning Analytics"                  | `landing.features.analytics.title`        | High     |
| 5          | Description | "Learns from every campaign..."            | `landing.features.analytics.description`  | High     |
| 5          | Stat        | "23% monthly improvement"                  | `landing.features.analytics.stat`         | High     |
| 6          | Title       | "Automated Ad Campaigns"                   | `landing.features.ads.title`              | High     |
| 6          | Description | "Converts winning posts to ads..."         | `landing.features.ads.description`        | High     |
| 6          | Stat        | "+€45,000/mo revenue"                      | `landing.features.ads.stat`               | High     |

**Totaal:** 18 strings × 3 talen = 54 translations

---

### 2. FeaturesSection.tsx (Priority: HIGH)

**Estimated: ~80+ strings**

**Structure:**

- 6 platform features
- Each feature heeft:
  - Name, tagline, description
  - 4 benefits
  - 3 use cases

**Total per feature:** ~12 strings
**Total for 6 features:** ~72 strings + section titles = ~80 strings

---

### 3. SocialProof.tsx (Priority: MEDIUM)

**Estimated: ~40 strings**

**Structure:**

- Founding teams (3)
- Platform milestones (6)
- Guarantees (4 with titles + descriptions)

---

## 🎯 Translation Key Structure

```
landing:
  features:
    showcase:
      research: { title, description, stat }
      manager: { title, description, stat }
      content: { title, description, stat }
      publishing: { title, description, stat }
      analytics: { title, description, stat }
      ads: { title, description, stat }

    detailed:
      research: { name, tagline, description, benefits[], useCases[] }
      manager: { name, tagline, description, benefits[], useCases[] }
      # ... etc

  social_proof:
    founding_teams: []
    milestones: []
    guarantees: []
```

---

## ✅ Progress

- [x] SimpleHeader.tsx - DONE
- [x] Footer.tsx - DONE
- [ ] FeatureShowcase.tsx - IN PROGRESS
- [ ] FeaturesSection.tsx - PENDING
- [ ] SocialProof.tsx - PENDING
