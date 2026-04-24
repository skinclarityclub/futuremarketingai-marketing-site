# FutureMarketingAI — Marketing Website (Repo Root)

> Agent Operating Manual — repo root. For code-level work use `fmai-nextjs/CLAUDE.md` (authoritative for the live codebase).

> Canonical domain (2026-04-24 unified): **https://future-marketing.ai**. Any legacy `futuremarketingai.com` in git history is 301-redirected at the Vercel edge. Do not re-introduce the legacy domain in new code.

## One-liner

Marketing + application site voor FutureMarketingAI, een high-touch AI marketing partnership platform. Live codebase: **`fmai-nextjs/`** (Next.js 16 + `next-intl`). Productie: `future-marketing.ai`. Content NL/EN/ES (NL authoritative).

## Repo layout

```
Futuremarketingai/
├── CLAUDE.md                 — dit bestand (root overview)
├── README.md
├── DEPLOYMENT.md
├── fmai-nextjs/              — LIVE CODEBASE (Next.js 16)
│   ├── CLAUDE.md             — project-specific operating manual
│   ├── src/app/[locale]/     — routes
│   ├── messages/             — i18n (nl.json / en.json / es.json)
│   └── public/               — assets, screenshots
└── docs/
    ├── plans/                — design docs, research, implementation plans
    └── ...                   — extra project documentation
```

> **Note**: een oudere `src/` tree op root-level kan bestaan als legacy van een eerdere Vite implementatie. Niet gebruiken — de levende site is `fmai-nextjs/`.

## Stack (live codebase)

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| React | 19 |
| i18n | next-intl 4.8 (NL / EN / ES) |
| Styling | Tailwind 4 |
| Deploy | Vercel |

Voor full stack-info, theme-colors, commands, conventions, pricing SSoT en content upgrade context: zie `fmai-nextjs/CLAUDE.md`.

## Obsidian Knowledge Vault

**Vault path**: `C:\Users\daley\Desktop\SkinClarity Club\FMai-SKC`
**This project's vault folder**: `Agency/Website/`

LLM Wiki pattern — read `_schema/CLAUDE.md` in de vault voor full conventions.
Auto-capture is configured globally in `~/.claude/CLAUDE.md`.

### Key vault locations

- `Agency/Website/` — project docs (README, deployment, AI assistant notes)
- `Agency/Architectuur/` — design system, SaaS blueprint
- `Agency/Strategie/` — pricing, pitch guides, business plans
- `Agency/Roadmaps/` — active roadmaps and requirements
- `Gedeeld/` — shared audits, research, legal docs
- `wiki/` — LLM-compiled knowledge (concepts, entities, skills, synthesis)

## Related Projects

- `C:\Users\daley\Desktop\fma-app` — Next.js SaaS command center (multi-tenant, Stripe, Supabase). **Pricing SSoT** — `src/lib/skills.ts`.
- `C:\Users\daley\Desktop\FMai` — n8n content automation (WAT architecture) voor SkinClarity Club
- `C:\Users\daley\Desktop\skinclarityclub` — SKC member platform
- `C:\Users\daley\Desktop\skinclarity-shopify` — SKC Shopify webshop

## Actieve Werkstroom (2026-04-20)

Volledige content-herpositionering van de website naar high-touch AI partnership model, 12 vaardigheden, nieuw pricing schema (Partner €347 / Growth €2.497 / Pro €4.497 / Ent €7.997 / Founding €997).

**Core docs in `docs/plans/`:**

- `2026-04-20-website-content-upgrade-design.md` — approved design (decision log)
- `2026-04-20-website-content-upgrade-plan.md` — task-by-task implementatie plan (6 phases)
- `2026-04-20-pricing-final-proposal.md` — pricing synthese
- `2026-04-19-audit-*` + `audit-capabilities-inventory.md` — onderliggende research

**Executie**: via `superpowers:executing-plans` skill, één phase per sessie. Status check altijd via `git log --oneline | head -20`.
