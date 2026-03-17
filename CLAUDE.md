# FutureMarketingAI — Demo Website

> Agent Operating Manual — read this before every session

**One-liner**: Interactive B2B demo/showcase website for FutureMarketingAI. Desktop-first React/Vite app demonstrating the Marketing Machine to enterprise clients.

---

## Obsidian Knowledge Vault

**Vault path**: `C:\Users\daley\Desktop\SkinClarity Club\FMai-SKC`

All project documentation is centralized in this Obsidian vault, shared between FMai and SKC projects. Use this vault to:

- **Read** context from other projects (e.g., FMai strategy, pricing docs)
- **Write** new documentation in Obsidian format when creating significant docs
- **Cross-reference** using `[[wikilinks]]` between documents

### Obsidian conventions for all .md files:

- YAML frontmatter: `title`, `tags`, `created`, `source`
- Internal links: `[[Document Name]]` (wikilinks, not markdown links)
- Tags: `#tag` format
- No emoji in headings

### Key vault locations for this project:

- `FMai/Website/` — this project's docs (README, deployment, AI assistant)
- `FMai/Architectuur/` — design system, SaaS blueprint
- `FMai/Strategie/` — pricing, pitch guides, business plans
- `FMai/Roadmaps/` — active roadmaps and requirements
- `Gedeeld/` — shared audits, research, legal docs

### Related projects:

- `C:\Users\daley\Desktop\fma-app` — SaaS command center (Next.js)
- `C:\Users\daley\Desktop\FMai` — n8n content automation (WAT architecture)
- `C:\Users\daley\Desktop\skinclarityclub` — SKC member platform
- `C:\Users\daley\Desktop\skinclarity-shopify` — SKC Shopify webshop

---

## Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Framework  | React 18.3+ with TypeScript |
| Build Tool | Vite 6.0+                   |
| Styling    | Tailwind CSS 3.4+           |
| Animations | Framer Motion 11.0+         |
| Routing    | React Router 6.22+          |
| Deployment | Vercel                      |

## Architecture: Desktop-First

**THIS PROJECT IS DESKTOP-FIRST. MOBILE IS SUPPLEMENTAL.**

- **Primary**: Desktop experience (B2B professionals)
- **Supplemental**: Mobile variant for discovery/teaser
- **Critical**: Desktop components NEVER modified for mobile
- **Approach**: Separate mobile components + conditional rendering

## Theme

- **Dark Background:** #050814
- **Surface:** #0A0E27
- **Primary Accent:** #00D4FF (Cyan)
- **Secondary Accent:** #A855F7 (Purple)
- **Success:** #00FF88 (Green)
- **Typography:** Inter (sans), JetBrains Mono (mono)
