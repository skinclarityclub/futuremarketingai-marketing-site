# Website Audit Follow-up Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Fix every remaining P1/P2/P3 finding from the 2026-05-18 website audit (the items not already in PR #1) so the audit-doc closes to "all green".

**Architecture:** Single follow-up branch `fix/audit-2026-05-18-followup` off `main` after PR #1 merges. Atomic commit per fix-cluster. Conventional commit messages per CLAUDE.md. Build + lint green before each commit.

**Tech Stack:** Next.js 16.1.7 App Router, React 19.2.3, TypeScript strict, next-intl 4.8 (nl/en/es), Tailwind 4, Playwright (E2E), schema-dts (JsonLd).

**Source-of-truth references:**
- Audit report: `docs/audits/2026-05-18-website-full-audit.md`
- Audit backlog: `docs/audits/2026-05-18-website-full-audit-backlog.md`
- Pricing SSoT: `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts`
- Marketing mirror: `fmai-nextjs/src/lib/{skills-data,pricing-data,constants}.ts`

**Phases overview:**

| Phase | Items | Estimate |
|---|---|---|
| A | Quick Wins (stale comment, JsonLd hardcoded prices, integration markers) | ~1.5u |
| B | Coming_soon skill-page copy rewrite (voice-agent, ad-creator, reel-builder × NL/EN/ES) | ~1.5u |
| C | Schema + Footer (case-study Service/Review schema, reel-builder added to footer) | ~45min |
| D | HeaderClient SSoT-derive | ~30min (gated on brand-PR merge) |
| E | Skill-packs exposure (AddonCards + marketing pricing) | ~1.5u |
| F | Lint cleanup (19 pre-existing errors) | ~2-3u |
| G | Test-suite refactor (133 fails) | ~4-6u |
| H | P3 cleanup (dead components, splite typo, legacy domain) | ~1u |

**Autonomous decisions (no per-item approval needed during execution):**

1. **Reel Builder in Footer**: ADD it. Symmetry — all 3 coming_soon skills visible with markers.
2. **SKILL_PACKS visibility**: EXPOSE them. They're defined in SSoT and represent real overflow paths; hiding them is a feature-gap not dead code.
3. **HeaderClient SSoT-derive**: wait for brand-PR merge before starting Phase D (no conflict).
4. **Legacy `futuremarketingai.com`**: REACTIVATE DNS + Vercel 301 to align with CLAUDE.md. If domain is truly expired, update CLAUDE.md to reflect reality.
5. **Dead components** (LogoFMark/Knot/MemoryStack, QuickAnswerBlock): DELETE. Logo-lab still works without them (verified in audit).
6. **`splite.tsx`** typo: RENAME to `spline.tsx` if it wraps Spline; verify intent first.
7. **Stale `fma-app/src/lib/skills.ts:6-7` comment**: REPLACE with reference to `TIER_PRICING` as canonical source.
8. **Test-suite refactor scope** (B-P1-01): rewrite specs that reference current functionality, DELETE specs that test removed features (`/chatbots`, `/automations`, `/voice-agents`, `/marketing-machine`) rather than re-pointing them.

---

## Phase A — Quick Wins

Small fixes, no architecture impact.

### Task A1: Replace stale comment in fma-app `skills.ts`

**Files:**
- Modify: `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts:6-7`

**Step 1: Read current header comment** (lines 1-11) to confirm exact wording.

**Step 2: Replace block-comment header lines 6-7** with workspace-priced model description that points to `TIER_PRICING` as canonical source:

```typescript
/**
 * Skill definitions — single source of truth for the AaaS platform.
 * All skill references (sidebar, client workspace, billing, n8n triggers)
 * should import from this file.
 *
 * Pricing: workspace-priced model. See TIER_PRICING (this file) for the
 * canonical per-workspace rates, workspace ranges, and credit allocations.
 * Skill-gating via SKILL_CAPS (per-tier per-skill caps, -1 = unlimited,
 * 0 = not available). Credit packs + skill-specific packs for overflow.
 */
```

**Step 3: Verify TypeScript still compiles**

Run from `fma-app/`: `npx tsc --noEmit`
Expected: no new errors.

**Step 4: Commit (in fma-app repo, separate PR)**

```bash
cd C:/Users/daley/Desktop/fma-app
git checkout -b fix/audit-2026-05-18-stale-comment
git add src/lib/skills.ts
git commit -m "docs(skills): refresh stale v10 header comment to workspace-priced

Audit B-P3-01: header mentioned old €2.497/€4.497/€7.997 + Partner €347
tier model. Code already uses workspace-priced TIER_PRICING (Growth €499/
Pro €399/Ent €299/Founding €997). Point future readers at TIER_PRICING."
```

### Task A2: Interpolate prices in PricingJsonLd descriptions

**Files:**
- Modify: `fmai-nextjs/src/components/seo/PricingJsonLd.tsx:67,72,77`

**Step 1: Read current file** (full read needed to see imports + structure).

**Step 2: Add price interpolation**. Replace hardcoded `€499/workspace` strings with template literals using `TIER_PRICING` (already imported or via `pricing-data.ts`):

```typescript
// Before:
'Growth tier — linear per-workspace rate (€499/workspace) for portfolios of 2 to 4 brands...'

// After:
`Growth tier — linear per-workspace rate (€${TIER_PRICING.GROWTH.pricePerWorkspace}/workspace) for portfolios of 2 to 4 brands...`
```

**Step 3: Verify**

Run: `npm run build` from `fmai-nextjs/`. Expected: `Compiled successfully`.

**Step 4: Commit**

```bash
git add fmai-nextjs/src/components/seo/PricingJsonLd.tsx
git commit -m "fix(seo): interpolate tier prices in PricingJsonLd descriptions

Audit B-P2-01: descriptions hardcoded €499/€399/€299 instead of reading
from TIER_PRICING SSoT. Drift risk if tariffs recalibrate."
```

### Task A3: Add coming_soon markers to skill-page integration text

**Files:**
- Modify: `fmai-nextjs/messages/nl.json:1006-1008` (lead-qualifier integrations referencing voice-agent)
- Modify: `fmai-nextjs/messages/nl.json:2044-2046` (research integrations referencing ad-creator)
- Modify: `fmai-nextjs/messages/nl.json:2539-2541` (reel-builder integrations referencing ad-creator)
- Modify: parallel paths in `en.json` and `es.json`

**Step 1: Read each section** to confirm exact wording in each locale.

**Step 2: Add suffix to integration text**. Example for NL:

```json
// Before:
"integration1": "Voice Agent: gesprekken kwalificeren leads en synchroniseren naar het CRM."

// After:
"integration1": "Voice Agent (binnenkort): gesprekken kwalificeren leads en synchroniseren naar het CRM."
```

EN equivalent: `(coming soon)`. ES equivalent: `(próximamente)`.

**Step 3: Verify keys still parse**

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/nl.json'))"` (and en/es).
Expected: no errors.

**Step 4: Commit**

```bash
git add fmai-nextjs/messages/
git commit -m "content(skills): mark coming-soon cross-references in integration text

Audit B-P2-02: lead-qualifier, research, and reel-builder integration
sections mention coming_soon skills without indicator. Reader could
assume they're live."
```

---

## Phase B — Coming_soon Skill-Page Copy Rewrite

Rewrite features + how-it-works copy in 3 locales × 3 skills.

### Task B1: Voice Agent — Dutch copy rewrite to future framing

**Files:**
- Modify: `fmai-nextjs/messages/nl.json` (skills-voice-agent.features.* and skills-voice-agent.how.steps.*, lines ~968-1001)

**Step 1: Read current section** to confirm structure.

**Step 2: Rewrite each feature description** to use future-framing instead of present tense. Pattern: replace "Clyde X" with "Clyde gaat X" or "Straks: Clyde X". Examples:

```json
// Before:
"feature1": "Clyde beantwoordt veelgestelde vragen 24/7 per merk."
// After:
"feature1": "Straks: Clyde gaat veelgestelde vragen 24/7 per merk beantwoorden."

// Before (step title):
"step1": "Clyde belt de contactlijst"
// After:
"step1": "Clyde gaat de contactlijst bellen"
```

**Step 3: Verify** by loading `/skills/voice-agent` locally on `http://localhost:3005` (after `npm run dev`). All copy should read consistently as future.

**Step 4: Atomic commit** at end of Task B3 (combined with EN+ES — same logical fix-cluster across locales).

### Task B2: Voice Agent — EN + ES copy rewrite

**Files:**
- `fmai-nextjs/messages/en.json` — same key paths as B1
- `fmai-nextjs/messages/es.json` — same key paths

**Step 1: Read EN + ES sections** to confirm parallel structure.

**Step 2: Rewrite EN** using "will" or "Coming soon:" prefix. ES using "podrá" or "Próximamente:" prefix.

EN example: "Clyde answers FAQs 24/7" → "Coming soon: Clyde will answer FAQs 24/7".
ES example: "Clyde responde preguntas" → "Próximamente: Clyde responderá preguntas".

### Task B3: Repeat B1+B2 for Ad Creator and Reel Builder

**Files:**
- `messages/nl.json:1277-1309` (ad-creator) + `:2501-2534` (reel-builder)
- Parallel paths in en.json + es.json

**Step 1: Same rewrite pattern** as B1/B2.

**Step 2: Commit (single atomic commit for all 3 skills × 3 locales)**

```bash
git add fmai-nextjs/messages/
git commit -m "content(skills): future-frame coming_soon skill-page copy

Audit B-P1-02: voice-agent, ad-creator, reel-builder hero said
Binnenkort but features+how sections used present tense ('Clyde
beantwoordt'). Rewrote ~27 keys per locale across all 3 locales to
future framing for consistency with coming_soon status."
```

**Step 3: Visual verification** — load each of the 3 skill pages in each of the 3 locales (9 page-loads) on `http://localhost:3005`. Confirm hero + features + how-it-works all read as future.

---

## Phase C — Schema + Footer

### Task C1: Add `/skills/reel-builder` to Footer skills section

**Files:**
- Modify: `fmai-nextjs/src/components/layout/Footer.tsx` (skills `<nav>` block, after the `/skills/ad-creator` entry — see existing `<li>` structure)

**Step 1: Read Footer.tsx lines 30-105** to confirm exact placement.

**Step 2: Add new `<li>` with coming_soon badge** matching the pattern from PR #1:

```tsx
<li>
  <Link
    href="/skills/reel-builder"
    className="text-sm text-text-muted hover:text-text-primary transition-colors inline-flex items-center gap-1.5"
  >
    <span>{t('landing.footer.nav.reel_builder')}</span>
    <span className="text-[9px] font-semibold uppercase tracking-wider text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/30 rounded px-1 py-0.5">
      {t('comingSoon')}
    </span>
  </Link>
</li>
```

**Step 3: Add i18n key** `landing.footer.nav.reel_builder` to nl.json + en.json + es.json (find existing `landing.footer.nav.ad_creator` key path and add right after).

NL: `"reel_builder": "Reel Builder"`
EN: `"reel_builder": "Reel Builder"`
ES: `"reel_builder": "Reel Builder"`

**Step 4: Verify build**

Run: `npm run build`. Expected: green.

**Step 5: Commit**

```bash
git add fmai-nextjs/src/components/layout/Footer.tsx fmai-nextjs/messages/
git commit -m "content(footer): add Reel Builder to skills section for symmetry

Audit B-P2-04: footer showed voice-agent + ad-creator (both coming_soon
with marker after PR#1) but reel-builder was missing. Adds reel-builder
with the same Binnenkort badge for consistency."
```

### Task C2: Add Service + Review JsonLd to case-study

**Files:**
- Modify: `fmai-nextjs/src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx`
- Possible new: `fmai-nextjs/src/components/seo/ServiceJsonLd.tsx` (if not exists)
- Possible new: `fmai-nextjs/src/components/seo/ReviewJsonLd.tsx`

**Step 1: Inspect existing JsonLd components** to see pattern (`WebPageJsonLd.tsx`, `BreadcrumbJsonLd.tsx`, etc. in `src/components/seo/`).

**Step 2: Create ServiceJsonLd component** (if not exists) using `schema-dts`:

```typescript
// src/components/seo/ServiceJsonLd.tsx
import { JsonLd } from './JsonLd' // use existing helper
import type { Service } from 'schema-dts'

interface ServiceJsonLdProps {
  name: string
  description: string
  provider: { name: string; url: string }
  serviceType: string
  areaServed?: string
}

export function ServiceJsonLd(props: ServiceJsonLdProps) {
  const data: Service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: props.name,
    description: props.description,
    provider: { '@type': 'Organization', name: props.provider.name, url: props.provider.url },
    serviceType: props.serviceType,
    ...(props.areaServed && { areaServed: props.areaServed }),
  }
  return <JsonLd data={data} />
}
```

**Step 3: Use it in case-study page** — render `<ServiceJsonLd>` describing the AaaS engagement with SkinClarity Club as `provider`.

**Step 4: Optional — create ReviewJsonLd** if SKC has written/spoken testimonial we want to crawl-feed. Skip if no concrete review text exists yet.

**Step 5: Validate JsonLd** by viewing the page-source on `http://localhost:3005/nl/case-studies/skinclarity-club`, copying the `<script type="application/ld+json">` block, and pasting into Google Rich Results test (https://search.google.com/test/rich-results).

**Step 6: Commit**

```bash
git add fmai-nextjs/src/app/\[locale\]/\(marketing\)/case-studies/skinclarity-club/page.tsx fmai-nextjs/src/components/seo/ServiceJsonLd.tsx
git commit -m "feat(seo): add Service JsonLd to SkinClarity Club case study

Audit B-P2-03: case-study only had WebPage+Breadcrumb+Org+Person JsonLd,
missing the Service schema that lets crawlers connect the case to the
AaaS skill catalog. Improves rich-snippet eligibility."
```

---

## Phase D — HeaderClient SSoT-derive

**Gated on: PR with pre-existing brand-work modifications to `HeaderClient.tsx` being merged first.**

### Task D1: Derive `comingSoon` from `getSkillBySlug` in HeaderClient

**Files:**
- Modify: `fmai-nextjs/src/components/layout/HeaderClient.tsx:34-77, 308`

**Step 1: Verify the brand-PR is merged**

```bash
git log --oneline main -- src/components/layout/HeaderClient.tsx | head -5
```

If recent brand-related commits, proceed. If not, this task is blocked.

**Step 2: Read SKILL_CATEGORIES (l.34-77)** to confirm shape.

**Step 3: Remove `comingSoon: true` hardcoded properties**

```typescript
// Before:
{
  key: 'adCreator',
  icon: Megaphone,
  href: '/skills/ad-creator' as const,
  comingSoon: true,  // <-- delete this
},
```

**Step 4: Derive at render site (~l.308)**

```typescript
// Before:
{'comingSoon' in skill && skill.comingSoon && (
  <span className="...">{tHeader('skills.comingSoon')}</span>
)}

// After:
{(() => {
  const slug = skill.href.replace('/skills/', '')
  return getSkillBySlug(slug)?.status === 'coming_soon'
})() && (
  <span className="...">{tHeader('skills.comingSoon')}</span>
)}
```

Add import: `import { getSkillBySlug } from '@/lib/skills-data'`.

**Step 5: Verify badge still renders** for voice-agent, ad-creator, reel-builder in the mega-menu. Load `/nl` and hover the Skills nav item.

**Step 6: Commit**

```bash
git add fmai-nextjs/src/components/layout/HeaderClient.tsx
git commit -m "refactor(header): derive coming_soon from SSoT in mega-menu

Audit B-P1-03: SKILL_CATEGORIES hardcoded comingSoon:true on three
items, duplicating SSoT in skills-data.ts. Now reads status via
getSkillBySlug at render time so future status changes propagate
automatically."
```

---

## Phase E — Skill-Packs Exposure

`SKILL_PACKS` (VOICE_MINUTES, VIDEO_ADS, REELS, BLOG_POWER) are defined in `fma-app/src/lib/skills.ts:403-446` but invisible in both dashboard and marketing. Expose them.

### Task E1: Dashboard — render SKILL_PACKS in AddonCards

**Files:**
- Modify: `C:\Users\daley\Desktop\fma-app\src\components\billing\AddonCards.tsx`

**Step 1: Read current AddonCards (line 8)** to see the existing `Object.entries(CREDIT_PACKS)` loop.

**Step 2: Add a second section after credit-packs**, looping over `SKILL_PACKS`. Use the same card visual but with a "Skill pack" eyebrow label and the pack-specific cap displayed.

**Step 3: Verify** by booting fma-app locally and checking `/billing` shows two sections: "Credit packs" + "Skill packs".

**Step 4: Commit (in fma-app repo)**

```bash
cd C:/Users/daley/Desktop/fma-app
git add src/components/billing/AddonCards.tsx
git commit -m "feat(billing): expose SKILL_PACKS as add-ons in AddonCards

Audit B-P2-05: VOICE_MINUTES/VIDEO_ADS/REELS/BLOG_POWER were defined in
SSoT but invisible in the upgrade flow. Customers had no way to buy
overflow capacity for individual skills."
```

### Task E2: Marketing — render SKILL_PACK_KEYS in pricing page

**Files:**
- Modify: `fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx` around lines 53-54

**Step 1: Find current `SKILL_PACK_KEYS` reference** — what's already imported but unused?

**Step 2: Render them** in a "Skill packs" subsection of the pricing page, mirroring the credit-packs presentation.

**Step 3: Add i18n strings** if needed for "Skill packs" heading + per-pack description.

**Step 4: Build + verify**

**Step 5: Commit (in fmai-nextjs)**

```bash
git add fmai-nextjs/src/app/\[locale\]/\(marketing\)/pricing/page.tsx fmai-nextjs/messages/
git commit -m "content(pricing): render skill packs alongside credit packs

Audit B-P2-05: marketing pricing page referenced SKILL_PACK_KEYS in
imports but never rendered them. Now mirrors dashboard exposure."
```

---

## Phase F — Lint Cleanup

19 pre-existing ESLint errors block CI confidence. Address systematically.

### Task F1: Triage errors by category

Run from `fmai-nextjs/`:

```bash
npm run lint 2>&1 | grep "error" | sort -u > /tmp/lint-errors.txt
```

Categories observed in audit:
- `no-require-imports` (test files using `require()`)
- `no-explicit-any` (5+ hits)
- `react/no-unescaped-entities`
- `react-hooks/preserve-manual-memoization` (React 19 issue)
- "Cannot call impure function during render" (React 19 compiler)
- "Cannot create components during render" (React 19 anti-pattern)
- "Calling setState synchronously within an effect"

### Task F2: Fix `no-require-imports`

**Files:** test/script files using `require()` — find via grep.

**Step 1: Identify files**

```bash
grep -rn "^const .* = require(" fmai-nextjs/src fmai-nextjs/tests fmai-nextjs/scripts 2>/dev/null
```

**Step 2: Convert each to ESM `import`**.

**Step 3: Verify** with `npm run lint` — these errors should disappear.

**Step 4: Commit**

```bash
git commit -m "chore(lint): convert require() imports to ESM"
```

### Task F3: Fix `no-explicit-any` (5 hits)

**Per hit:** read the surrounding context, infer the actual type, replace `any` with proper type. Common patterns: API response types, event handlers, dynamic data structures.

If a `any` is truly necessary (rare), use `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with a comment explaining why.

**Commit:** `chore(lint): remove no-explicit-any violations`

### Task F4: Fix `react/no-unescaped-entities`

**Per hit:** replace literal `"` and `'` in JSX with `&quot;`, `&apos;`, or use `{'"'}` JSX-expression.

**Commit:** `chore(lint): escape JSX entities`

### Task F5: Fix React 19 compiler errors

**More involved:**
- "Cannot call impure function during render" — move calls into `useEffect` or `useMemo` with proper dependencies.
- "Cannot create components during render" — extract dynamic component definitions to module scope or stable refs.
- "Calling setState synchronously within an effect" — wrap setState in `requestAnimationFrame` or `setTimeout(_, 0)` if there's no logical alternative, OR refactor the effect.

**Files** (likely): `src/components/chatbot/*`, `src/components/interactive/*`, `src/hooks/*`.

**Step 1: For each error**, read 30 lines context, decide fix approach.

**Step 2: Test the affected feature manually** after fix (chatbot still works, etc.).

**Step 3: Atomic commit per affected feature** (don't bundle chatbot + interactive together — easier review).

**Commit messages:**
- `fix(chatbot): comply with React 19 render purity rules`
- `fix(interactive): move setState out of synchronous effect path`

### Task F6: Confirm lint is green

Run: `npm run lint`
Expected: 0 errors, warnings acceptable.

---

## Phase G — Test-Suite Refactor

133 failing E2E tests. Approach: delete tests for removed features, rewrite for current features.

### Task G1: Delete tests for removed routes

**Files:**
- `tests/e2e/navigation.spec.ts:131-149` (Service Pages — Chatbots, Automations, Voice Agents, Marketing Machine)

**Step 1: Read current test blocks** to confirm.

**Step 2: Delete the entire `Service Pages` describe block** since these routes don't exist anymore. Keep the `Marketing Pages` block (`/about`, `/pricing`, `/contact`, `/how-it-works`).

**Step 3: Replace with new `Skill Pages` describe** that tests all 12 current skill routes:

```typescript
test.describe('Skill Pages', () => {
  const skills = [
    'clyde', 'social-media', 'blog-factory', 'lead-qualifier',
    'email-management', 'manychat', 'reporting', 'research',
    'seo-geo', 'voice-agent', 'ad-creator', 'reel-builder',
  ]

  for (const slug of skills) {
    test(`should load /skills/${slug}`, async ({ page }) => {
      await page.goto(`/nl/skills/${slug}`)
      await expect(page.locator('h1')).toBeVisible()
    })
  }
})
```

**Step 4: Run** `npx playwright test tests/e2e/navigation.spec.ts --project=chromium`.

Expected: passes for all 12 skill routes + the Marketing Pages block.

**Step 5: Commit**

```bash
git commit -m "test(navigation): replace removed-service tests with skill-page coverage"
```

### Task G2: Fix `homepage.spec.ts`

**Files:**
- Modify: `tests/e2e/homepage.spec.ts`

**Issue:** test expects "Services section with 4 cards"; site now has 6.

**Step 1: Read the affected test** (line 39).

**Step 2: Update selector + count expectation** to 6, OR make it derive from the SERVICE_CARDS array.

**Step 3: Update other section-presence tests** to match current structure (Trust/Why Teams, Final CTA, Header, Footer).

**Step 4: Run** `npx playwright test tests/e2e/homepage.spec.ts`.

**Step 5: Commit**

```bash
git commit -m "test(homepage): update card-count and selectors to post-upgrade layout"
```

### Task G3: Fix `chatbot.spec.ts` + `guided-demo.spec.ts`

**Issue:** tests expect floating chat-button + guided-demo state that may have moved.

**Step 1: Manually open the homepage**, find the actual chat-widget selector, observe whether floating button still exists.

**Step 2: If chat-widget removed:** delete both spec files.
**If still present:** update selectors per actual DOM.

**Step 3: Commit per outcome**

### Task G4: Fix `conversion-polish.spec.ts` (22 sub-tests)

**Files:**
- Modify: `tests/e2e/conversion-polish.spec.ts`

**Issue:** 22 tests around assessment-flow, StickyCta, LeadMagnetCTA badges. Some may be stale, some are real regressions.

**Per test:**
- Re-read the assertion
- Manually verify the feature works on `http://localhost:3005`
- If feature works: fix selector/assertion
- If feature is removed: delete the test
- If feature is broken: fix the feature (likely small surface)

**Specific known case:** `conversion-polish.spec.ts:160` (desktop progress bar position). Read the test, check actual position in browser, decide fix.

**Step 2: Atomic commit per logical group** (trust-anchors / LeadMagnetCTA badges / newsletter retry / question-flow / progress-bar / share-card / privacy-section).

### Task G5: Fix `i18n.spec.ts`

**Issue:** locale-switcher selector likely outdated.

**Step 1: Open locale switcher in browser**, copy its actual selector.

**Step 2: Update spec**, run, commit.

### Task G6: Fix `accessibility.spec.ts`

**Issue:** 4 fails on ARIA + lang + footer + mobile-menu.

**Per test:** check actual DOM, add the missing ARIA attribute OR update the assertion.

**Commit:** `fix(a11y): add missing ARIA attributes flagged by E2E`

### Task G7: Fix `nl-content-smoke.spec.ts`

**Step 1: Run** the spec, see which 17 fail.

**Step 2: Per fail:** is the smoke-assertion (likely text presence) outdated, or is the content actually missing? Read each affected page in browser to decide.

**Step 3: Update assertions** per current content. Commit per logical group of pages.

### Task G8: Fix `logo-visual.spec.ts`

**Step 1: Re-baseline screenshots** with `npx playwright test tests/e2e/logo-visual.spec.ts --update-snapshots`.

**Step 2: Manually inspect** each new baseline to ensure they look correct (logo not corrupted, not rotated, sized correctly).

**Step 3: Commit baselines**

```bash
git commit -m "test(logo): re-baseline visual screenshots for current logo"
```

### Task G9: Fix `seo.spec.ts` + `performance.spec.ts`

**Per test:** verify the underlying expectation matches current site (canonical hosts, OG tags, JsonLd schemas, console-clean state).

**Commits:** per category.

### Task G10: Confirm full suite passes

Run: `npx playwright test --project=chromium`
Expected: > 90% pass rate. Document remaining intentional fails (if any) with `test.skip` + explanatory comment.

---

## Phase H — P3 Cleanup

### Task H1: Delete dead components

**Files:**
- Delete: `fmai-nextjs/src/components/brand/logos/LogoFMark.tsx`
- Delete: `fmai-nextjs/src/components/brand/logos/LogoKnot.tsx`
- Delete: `fmai-nextjs/src/components/brand/logos/LogoMemoryStack.tsx`
- Delete: `fmai-nextjs/src/components/ui/QuickAnswerBlock.tsx`

**Step 1: Verify no imports anywhere**

```bash
grep -r "LogoFMark\|LogoKnot\|LogoMemoryStack\|QuickAnswerBlock" fmai-nextjs/src fmai-nextjs/tests 2>/dev/null
```

Expected: only the definition files match.

**Step 2: Delete files**

**Step 3: Build verify** → green.

**Step 4: Commit**

```bash
git rm fmai-nextjs/src/components/brand/logos/LogoFMark.tsx fmai-nextjs/src/components/brand/logos/LogoKnot.tsx fmai-nextjs/src/components/brand/logos/LogoMemoryStack.tsx fmai-nextjs/src/components/ui/QuickAnswerBlock.tsx
git commit -m "chore: remove dead logo + UI components

Audit B-P3-02: components were never imported. Logo-lab works without them."
```

### Task H2: Resolve `splite.tsx` naming

**Files:** `fmai-nextjs/src/components/ui/splite.tsx`

**Step 1: Read** the file. Determine: does it wrap Spline (3D scene)?

**Step 2: If yes:** rename to `spline.tsx` via `git mv`. Update all imports.

**Step 3: If no:** add a doc-comment explaining what "splite" is. Commit a comment-only change.

**Step 4: Commit**

```bash
git commit -m "chore(ui): rename splite.tsx → spline.tsx (typo fix)"
# OR
git commit -m "docs(ui): document splite.tsx naming intent"
```

### Task H3: Legacy domain — reactivate or document

**Step 1: Check domain registration**

```bash
whois futuremarketingai.com 2>&1 | head -20
```

**Step 2: If domain is registered + DNS just misconfigured:**
- Restore DNS A/CNAME to point at Vercel
- Re-add 301 redirect rule in Vercel dashboard pointing all paths to `future-marketing.ai`
- Verify with `curl -sI https://futuremarketingai.com/` returning `301`

**Step 3: If domain is expired/lost:**
- Update `CLAUDE.md` to remove the "301-redirected at the Vercel edge" claim
- Add a note: "futuremarketingai.com was retired and the registration was not renewed."

**Step 4: Commit** the CLAUDE.md change (or the Vercel config doc):

```bash
git commit -m "docs(domain): reflect actual state of legacy futuremarketingai.com"
```

### Task H4: Update audit-doc status

**Files:** `docs/audits/2026-05-18-website-full-audit.md`, `docs/audits/2026-05-18-website-full-audit-backlog.md`

**Step 1: Mark each fixed item as DONE** with link to commit-SHA.

**Step 2: Move "Niet gefixt" section to "Closed"** when all items are addressed.

**Step 3: Commit**

```bash
git add docs/audits/
git commit -m "docs(audit): close all 2026-05-18 audit findings"
```

---

## Final Steps

### Task Z1: Push + open PR

```bash
git push -u origin fix/audit-2026-05-18-followup
gh pr create --title "fix(audit): 2026-05-18 follow-up - P1/P2/P3" --body "..."
```

PR body should reference PR #1 and list closed items by audit-ID (B-P1-01 through B-P3-05).

### Task Z2: Verify on production preview

After Vercel deploys the PR preview:
- Open `/nl`, `/en`, `/es` of all 3 coming_soon skill-pages and confirm future-tense copy reads consistently
- Open footer on any page and confirm 3 coming_soon-skills all have markers
- Open assessment-result with persona=operator and confirm 2-stop gradient
- Open `https://[preview-url]/sitemap.xml` and verify `/assessment` + `/roadmap` are listed
- Open Lighthouse on `/`, `/pricing`, `/skills/clyde` — confirm scores are not regressed

### Task Z3: Manual test-suite re-run on PR

```bash
npx playwright test --project=chromium --reporter=line
```

Expected: > 90% pass rate. Document any remaining intentional skips.

---

## Verification Checklist (when all phases done)

- [ ] `npm run lint` green (0 errors)
- [ ] `npm run build` green
- [ ] `npx playwright test` > 90% pass
- [ ] All audit-doc P1/P2/P3 items marked DONE with commit-SHA
- [ ] Production preview manually validated (3 locales × top pages)
- [ ] Lighthouse not regressed
- [ ] Both audit-docs updated to "all green"
- [ ] PR opened, build is green in CI
