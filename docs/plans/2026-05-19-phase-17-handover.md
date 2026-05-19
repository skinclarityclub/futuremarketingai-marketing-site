# Phase 17 Execution Handover (2026-05-19)

> Read this first in a new session before touching code. Captures state at end of 2026-05-19 working session.

## TL;DR

4 PRs in flight, stacked. Phase 17-A foundation + 17-B content sweep done. Phase 17-C/D/E/F still pending. Pick up at one of: review stack, complete MF-04 wire-up, or start next phase.

## PR stack (open)

```
main
 └── PR #2 ← fix/audit-2026-05-18-followup           (v1 audit followup, 20 commits)
      ├── PR #3 ← audit/2026-05-18-v2-sota           (Phase 16 SOTA audit, 31 commits)
      └── PR #4 ← feature/phase-17-b-content-sweep   (Phase 17-B, 1 commit)
           └── PR #5 ← feature/phase-17-a-foundation (Phase 17-A, 1 commit)
```

When PR #2 merges, #3 and #4 auto-target main. When #4 merges, #5 auto-targets main.

Verify state:
```bash
gh pr list
git log --oneline -10
```

## What landed this session

### Phase 16 closeout (commits 225cd71, 469a158, 7d3ede2, 27e231f on audit/2026-05-18-v2-sota)

- 22 prose em-dashes scrubbed from `01-baseline-snapshot.md` + `09-cross-browser.md`. The 4 remaining em-dashes in `05-seo-technical.md` are evidence-quotes of the literal `<title>Logo Lab — FutureMarketingAI</title>` (F-22 finding itself), intentionally kept.
- `tmp/` and `.planning/phases/*/tmp/` added to gitignore.
- 3 untracked research/plan docs committed (referenced by Phase 16 outputs but never staged before).
- **MF-06 WebKit root-cause CORRECTED** via convergent evidence after real-Safari proved unavailable. Direct compiled-CSS inspection ruled out the audit's hypotheses (`@property` on `<color>` types, `oklch()`). Actual cause: Tailwind 4 emits design tokens under `@layer theme { :root, :host { ... } }` (known Tailwind GitHub Discussions #15556 + #15284 — documented Safari/WebKit compat hotspot, official Tailwind 4 support floor is Safari 16.4+). 16-VERIFICATION.md status flipped `human_needed` → `passed`.

### Phase 17-B content sweep (commit 0979338)

Branch: `feature/phase-17-b-content-sweep` (stacked on fix/audit-2026-05-18-followup).

- B1: `public/llms.txt` + `public/llms-full.txt` regenerated from `fma-app/src/lib/skills.ts` SSoT. Removed Partner tier, switched to workspace-priced model. Skill statuses corrected (Ad Creator + Voice Agent → coming_soon, Email Mgmt + ManyChat → live).
- B2: `src/lib/chatbot/tool-data.ts` CHATBOT_TIERS migrated to workspace-priced. Added `pricingModel` discriminator + `pricePerWorkspace`/`minWorkspaces`/`maxWorkspaces`/`creditsPerWorkspace` fields. Kept `monthlyPrice` as starter price for ServiceCard backward-compat.
- B3: 16 canonical CTA edits across NL/EN/ES (`Plan een strategiegesprek`/`Plan een partnership-gesprek` → `Plan een gesprek`, etc.). Apply hero matches meta title. Chatbot starter chips canonicalised in `clyde.ts` + `ChatWidgetIsland.tsx`.
- B4: 21 over-length meta-titles trimmed to ≤70c, 12 over-length meta-descriptions trimmed to ≤155c across all 3 locales. `Empleado AI de Marketing` canonicalised. Legal title ES differentiated from EN (now `Aviso legal | Future Marketing AI`).
- B5: Contact page CTAs collapsed (3 → 2). `book_demo` namespace removed from all 3 locale files + Footer's GlassCard block deleted + unused CTAButton import removed. `applyCallout.button` canonicalised.
- B6: **Audit finding 16-05 F8 INVALIDATED**. The `chatbots` namespace is NOT orphan — 4 active consumers on `/skills/lead-qualifier` (DemoPlayground, DemoContextCard, MultiPlatformShowcase, PersonaSelector). Skipped destructive deletion. Added forward-looking `scripts/check-orphan-i18n.mjs` CI guard wired as `npm run check:i18n-orphans`. 2 truly orphan namespaces parked in ALLOW with TODO(phase-17-followup): `chatbot` singular (only `disclosure`, 0 consumers) and `landing` top-level (duplicate of `common.landing` used by Footer).

### Phase 17-A foundation (commit 6963184)

Branch: `feature/phase-17-a-foundation` (stacked on feature/phase-17-b-content-sweep).

- A1: `src/components/motion/ScrollReveal.tsx` + `LazySection.tsx` rewritten as SSR-safe pass-throughs. Removed `motion/react` import + `'use client'` + `initial={hidden}` gate. Children render visible on SSR. Reveal animation intentionally dropped (content-first principle). Prop signatures preserved for backward compat across 15 callers.
- A2: 4 SSR-orphan skill links added to Footer (now ships 12/12 hrefs in initial HTML). 3 new i18n keys per locale: `email_management`, `manychat`, `research` (reporting key already existed).
- A3: Breadcrumbs foundation:
  - `src/lib/breadcrumb-config.ts` (new): 30-route map with parent-chain walker.
  - `src/components/layout/Breadcrumbs.tsx` (new): server component, chevron separators, `aria-label="Breadcrumb"`, `aria-current="page"`.
  - `src/components/seo/BreadcrumbJsonLd.tsx`: now ships `@id: <pageWebPageId>#breadcrumb` on list + `@id: <itemUrl>#listitem` on each ListItem. `path` prop defaults to last items[] path so all 17 existing callers get @id automatically.
  - 29 new i18n keys per locale under `common.breadcrumbs.*`.
  - Pilot wired on `/contact` only.
- A4: `/skills` index page created in 3 locales. Server-rendered 12-card grid via `SKILLS_DATA` with live/coming_soon badges. WebPageJsonLd + BreadcrumbJsonLd + visible Breadcrumbs + ItemList JSON-LD enumerating all 12 skills with `@id`. New `skills-index` i18n namespace. Added `/skills` to sitemap with hreflang.
- A5: `HeaderClient` mega-menu refactored from `{skillsOpen && <motion.div>}` conditional render to always-rendered `<motion.div>` with `hidden`/`block` class toggle + `aria-hidden={!skillsOpen}` + `initial={false}`. All 12 skill `<a href>` ship in initial SSR HTML for GPTBot/ClaudeBot/PerplexityBot + JS-disabled visitors. CLS-safe because mega-menu is absolutely positioned. Mobile-menu AnimatePresence preserved (separate concern).
- A6: Verified `LegalSectionPage` + `(legal)/legal/page.tsx` already call BreadcrumbJsonLd. A3's @id update applies automatically. No code edits needed.

## P0 status (cumulative across this session)

| Meta-finding | Status |
|---|---|
| MF-01 ScrollReveal SSR-hidden gate | ✓ A1 |
| MF-02 Pricing SSoT drift | ✓ B1+B2 |
| MF-03 Canonical CTA breach | ✓ B3+B5 |
| MF-04 breadcrumbs absent | **partial** — foundation done; 13 pages still need `<Breadcrumbs>` wire-up |
| MF-06 WebKit unstyled render | root-cause corrected in audit docs; Phase 17-C C1 will apply the fix |
| MF-07 GEO citation zero | pending — Phase 17-E |
| MF-08 4 SSR-orphan skill pages | ✓ A2 + A5 |
| MF-12 ES locale fragmentation | ✓ B4 |
| F-10 BreadcrumbList missing @id (84 blocks) | ✓ A3 (applies to all 17 callers via derived path) |
| 16-04 F1 /skills parent collapse | ✓ A4 |

## Pending work options

### Option 1: Phase 17-C (a11y + cookie + cross-browser parity) — recommended next

- Includes MF-06 WebKit fix using the CORRECTED root-cause framing (Tailwind 4 `:root,:host` in `@layer theme`).
- C1 fix-plan options ranked: `@theme inline` (preferred), PostCSS `:host` strip, hex fallbacks on hot path. See `docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md` Phase C C1.
- 6 tasks (C1-C6), 14-18h estimated.
- Depends on Phase A for breadcrumb + skill-orphan rendering — ✓ already met.
- Branch: stack off `feature/phase-17-a-foundation`.

### Option 2: Complete MF-04 wire-up (highest leverage / lowest effort)

Add `<Breadcrumbs path={...} locale={locale} />` to 13 pages:

| Page | Path arg |
|---|---|
| `/about/page.tsx` | `/about` |
| `/how-it-works/page.tsx` | `/how-it-works` |
| `/pricing/page.tsx` | `/pricing` |
| `/founding-member/page.tsx` | `/founding-member` |
| `/memory/page.tsx` | `/memory` |
| `/apply/page.tsx` | `/apply` |
| `/assessment/page.tsx` | `/assessment` |
| `/roadmap/page.tsx` | `/roadmap` |
| `/case-studies/skinclarity-club/page.tsx` | `/case-studies/skinclarity-club` |
| `SkillPageTemplate.tsx` (covers 12 skill pages) | `/skills/${slug}` |
| `LegalSectionPage.tsx` (covers 3 legal sections) | `/legal/${section}` |
| `(legal)/legal/page.tsx` | `/legal` |
| `(blog)/blog/page.tsx` | `/blog` |

Each: ~5 LOC. SkillPageTemplate + LegalSectionPage are template components so editing them once covers 15 routes. Total ~30 min mechanical work. Closes MF-04 fully.

Branch: stack off `feature/phase-17-a-foundation`.

### Option 3: Phase 17-D (Forms + perf measurement)

- Apply form simplification (5 → 3 fields above-fold via Calendly intake step 2)
- chalk@5 fix for Lighthouse harness (pin chalk@4)
- PSI + CrUX API provisioning (dedicated GCP project + restricted API key)
- 5 tasks, 10-14h estimated.

### Option 4: Phase 17-E (Schema graph + GEO citation)

- MF-07 GEO citation zero across 7 Gemini queries is the headline
- Add speakable selector classNames (6 specific class tokens)
- Add Wikidata QID to Organization sameAs
- Regenerate llms structure for AI Overviews
- 6 tasks, 12-16h estimated.

### Option 5: Pause for review

- 4 open PRs need review
- Stripe price IDs need manual sync (deferred per `project_pricing_handover.md` memory)
- Real-Safari smoke test on MF-06 fix (when 17-C ships) via BrowserStack or borrowed Mac/iPhone

## Key context for new session

### Branch strategy (stacked PR pattern)

- Audit branch (`audit/2026-05-18-v2-sota`) is research-only. No production code changes ever.
- Each Phase 17 sub-phase = own feature branch.
- Stack PRs to avoid `messages/*.json` merge conflicts (every phase touches i18n).

### Conventions

- Commits: `type(scope): message` — why-focused. See `fmai-nextjs/CLAUDE.md`.
- **No em-dashes in user-facing copy** (NL/EN/ES) — strict rule from `feedback_no_em_dashes.md` memory.
- Pricing SSoT: `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts` AGENT_TIERS. Marketing site mirrors at `fmai-nextjs/src/lib/skills-data.ts` + `src/lib/pricing-data.ts`.
- Locale source-of-truth: NL → EN → ES (NL authoritative).
- Skills count: 12 total (9 live + 3 coming_soon).
- Founding spots: `FOUNDING_SPOTS_TAKEN=1` of `FOUNDING_SPOTS_TOTAL=10`, `MAX_PARTNERS_PER_YEAR=20`. Constants in `src/lib/constants.ts`.
- Canonical domain: `future-marketing.ai`. Never reference `futuremarketingai.com` (legacy, DNS unwired).

### Gotchas hit this session

- **Tailwind 4** emits `@layer theme { :root, :host {...} }` for `@theme` tokens. Known Safari/WebKit compat hotspot. Real MF-06 cause (NOT `@property` or `oklch` as audit hypothesised).
- **Audit findings need verification before destructive execution**. 16-05 F8 claimed `chatbots` namespace orphan; grep showed 4 active consumers. Always confirm before deleting.
- **Vercel infra noise**: `futuremarketingai-marketing-site` Vercel project fails on every PR. NOT a regression — same failure on main. Real prod project is `futuremarketingai` and stays green. Cleanup the broken project at some point (needs Vercel dashboard or CLI access).
- **next-intl namespace indirection**: `GLOBAL_CLIENT_NAMESPACES` list in `src/lib/i18n-namespaces.ts` routes namespaces to client without explicit `useTranslations` calls. The `check:i18n-orphans` script accounts for this.
- **Edit tool** requires Read on file first. Batching many Edits in parallel needs prior Reads to be in context.

### User preferences validated this session

- "Ga maar door" mode: user makes decisions decisively, expects forward motion. Use `AskUserQuestion` only for true forks (branch base, scope decisions, plan-conflicts).
- Stripe sync = deferred. Marketing-site code and llms files are workspace-priced; Stripe products still flat-monthly. User handles dashboard sync personally.
- ES translator pass: AI first-draft is acceptable; user reviews before merge.
- One PR per phase. Atomic commits per task cluster within the PR.
- Skip animations in favor of content visibility (A1 reveal animation drop was acceptable).

### Memory state

`/dream` ran earlier this session. 10 memory files in `~/.claude/projects/C--Users-daley-Desktop-Futuremarketingai/memory/`. MEMORY.md ~19 lines, tight.

Recent additions:
- `feedback_fmai_research_provider.md`: Gemini grounded > Perplexity for FMai audits.
- `feedback_sota_audit_depth.md`: audit work = SOTA depth always.

## How to resume

1. Read this file first.
2. Run `git log --oneline -10` and `gh pr list` to confirm state matches.
3. Pick one of the 5 options above.
4. If Phase 17-C/D/E/F: read corresponding `## Phase X:` section in `docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md` for full task scope. Branch off the highest-stacked previous phase.
5. If MF-04 wire-up: branch off `feature/phase-17-a-foundation`. Edit `SkillPageTemplate.tsx` and `LegalSectionPage.tsx` once each (covers 15 routes) plus add `<Breadcrumbs path locale />` to 8 standalone pages. One PR for the lot.

## Open follow-ups (tracked outside fix-plan)

- Stripe price IDs sync for workspace-pricing model (`project_pricing_handover.md` memory has the migration commit refs).
- Cleanup `chatbot` singular + `landing` top-level orphan namespaces (TODO in `scripts/check-orphan-i18n.mjs` ALLOW list).
- Real-Safari smoke test of MF-06 fix when Phase 17-C lands.
- Legacy `futuremarketingai-marketing-site` Vercel project cleanup (fails on every PR, not regression).
- Vercel CLI install (`npm i -g vercel`) for `vercel inspect` capabilities.
- Phase 16 audit branch `audit/2026-05-18-v2-sota` has 1.4MB of untracked `tmp/` scratch (now gitignored).

## Files reference

- Fix-plan canonical task source: `docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md` (on `audit/2026-05-18-v2-sota` branch; access via `git show audit/2026-05-18-v2-sota:docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md`).
- Roadmap: `docs/plans/2026-05-18-design-seo-roadmap-q3.md` (same branch).
- Executive summary: `docs/audits/2026-05-18-v2/00-executive-summary.md` (same branch).
- Audit verification: `.planning/phases/16-design-seo-audit-v2-sota/16-VERIFICATION.md` (same branch).
- Pricing canon: `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts` (different repo).
