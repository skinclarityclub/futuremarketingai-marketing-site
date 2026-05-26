# Post-nightshift site walkthrough — handover
**Datum**: 2026-05-26 13:59 (start)
**Status**: in progress — visueel doorlopen van hele site met user, fix per pagina

---

## Context

Na de autonome nightshift (Fase 0-10, $106.87, 45 commits, all live op `origin/main`) doet user nu een **gerichte visuele walkthrough** van de hele site. Per pagina noteert hij wat hij ziet, agent fixt direct.

Pre-walkthrough verificatie heeft al uitgevoerd (zie `project_sitewide_upgrade_complete_2026-05-26.md`):
- 31 pages × 2 viewports = 62 visuele audits → 0 errors
- 226/228 e2e tests pass (1 lighthouse expected, 1 chatbot Escape flake)
- 2 echte bugs gefixt + gepusht: `c2ae3a4` (FORMATTING_ERROR assessment/result) + `4bd0c90` (guided-demo selector)

Walkthrough start **bovenaan**: homepage → header → en zo door alle pagina's.

---

## Procedure

1. User noemt observatie (pagina + viewport + element)
2. Agent inspecteert code + screenshot
3. Agent commit fix met `fix(<scope>): <wat>`
4. User verifieert in browser (live op `http://localhost:3000`)
5. Door naar volgende observatie

**Geen autonome scope-creep**: alleen fixen wat user noemt. Andere observaties bewaren voor later in walkthrough.

---

## Issue log

### 1. Header mega-menu te klein ✅ FIXED (commit `9b03a88`)

**Pagina**: alle (header global)
**Viewport**: desktop
**Probleem**:
- Mega-menu 880px → 3 cols à 176px → ~41px overbleef voor title na icon+padding+badge
- Truncated zichtbaar: "Voic...", "Ad ...", "Reel...", "Email Manageme..."
- "Binnenkort" badge bezette ruimte die title nodig had

**Fix**:
- Width: `880px` → `min(1240px, calc(100vw - 48px))` (responsive clamp)
- BINNENKORT badge: `tracking-wider` weg (5px winst per badge)

**Verificatie**: alle 12 skill labels volledig leesbaar, ook met BINNENKORT
badge (Voice Agent, Ad Creator, Reel Builder).

### 2. Mega-menu rechter-overlap met Clyde hero ✅ FIXED (commit `2b51e9b`)

**Pagina**: alle (header global)
**Viewport**: desktop 1440
**Probleem**: menu opende `-left-4` onder "Vaardigheden" trigger → menu liep
~340px voorbij rechter viewport-rand, overlap met Clyde hero.

**Fix**: switch van `absolute top-full -left-4` → `fixed left-1/2 top-[72px]`
met `x: '-50%'` in motion animate. Exact viewport-centered.

**Verificatie**: op 1440 viewport: x=100, width=1240, 100px margin beide zijden.
Caret indicator op "Vaardigheden" + opacity/y fade-in behouden visuele connectie.

---

## Resterende pagina's in walkthrough

Volgorde voor walkthrough — agent niet vooruitlopen:
- [x] Header mega-menu (issues 1 + 2 — voltooid 2026-05-26)
- [ ] Resterende header (logo, andere nav items, login/CTA, locale switcher, sticky scroll behavior, mobile menu)
- [ ] Homepage hero + sections
- [ ] /memory (LayerCube 3D, comparison demo)
- [ ] /pricing (WorkspaceSlider, tier bento, FAQ)
- [ ] /founding-member (SpotScarcityGrid, QuickApplyTeaser)
- [ ] /case-studies/skinclarity-club (ScrollProgressRail, BeforeAfterTimeline)
- [ ] /about (MissionTimeline, CapacityBar)
- [ ] /how-it-works (5-stappen onboardingreis)
- [ ] /skills (index bento + Clyde featured tile)
- [ ] /skills/{12 skills} (template parts)
- [ ] /contact (form)
- [ ] /apply (application form)
- [ ] /assessment (intro) + /assessment/result (shared persona reveal)
- [ ] /blog (index + post)
- [ ] /roadmap
- [ ] /logo-lab
- [ ] /newsletter/confirm
- [ ] /legal (cookies/privacy/terms)
- [ ] Footer

---

## Hoe te resumeren bij context-reset

**Prompt voor nieuwe sessie:**

```
Lees C:\Users\daley\Desktop\Futuremarketingai\docs\plans\2026-05-26-post-nightshift-walkthrough.md
We doen een interactieve walkthrough van de site. Header mega-menu is klaar.
Vraag waar ik wil verdergaan (resterende header items, of door naar homepage hero).
Dev server moet ik zelf starten met `npm run dev` in fmai-nextjs/.
```

**Status bij hand-off (2026-05-26):**
- Branch: `main` synced met origin
- Laatste 4 commits sinds nightshift complete:
  - `2b51e9b` mega-menu centreren op viewport
  - `9b03a88` mega-menu breder (1240px) + badge compacter
  - `4bd0c90` guided-demo test selector fix
  - `c2ae3a4` assessment/result FORMATTING_ERROR fix
- Dev server: niet draaiend (gebruiker stop het netjes als hij wegloopt)
- E2E: 226/228 pass (1 lighthouse expected, 1 chatbot Escape workers=2 flake)
- Visual audit: 0 errors over 31 pages × 2 viewports

**Bekende baseline issues (niet voor walkthrough, voor later):**
- chatbot Escape test flakey met workers=2 (passes isolatie + workers=1)
- audit-v2-lighthouse needs `npm run audit:server` op port 3002 om te draaien
- Spline Hero base64 video genereert console warning (3rd-party, niet onze code)

**Belangrijke conventies tijdens walkthrough:**
- Geen scope-creep — alleen fix wat user noemt
- Per fix: atomic commit + push naar `main`
- Update dit doc met issue + commit hash na elke fix
- Bij design-keuze: 2-3 sentence advies + tradeoff, dan user beslist
- Dev server kan zombie processes achterlaten — bij twijfel `rm -rf .next` + restart
