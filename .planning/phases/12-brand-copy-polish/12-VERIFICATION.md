---
phase: 12-brand-copy-polish
verified: 2026-04-25T13:30:00Z
status: human_needed
score: 5/5 success-criteria automated-pass; 1 visual + 2 social-share checks need human
re_verification: null
human_verification:
  - test: "Visual sweep of /nl/pricing tier matrix"
    expected: "All cells render NL labels: Onbeperkt / Add-on €97 / 30 min/mnd / 500 DMs/mnd / Max — never English (unlimited / add-on €X / /mo)"
    why_human: "labelKey + unit dispatch is verified at code level but visual confirmation across 12 skills × 5 tiers needs eyeball; dev port currently occupied"
  - test: "LinkedIn Post Inspector / Twitter card validator"
    expected: "https://future-marketing.ai/og-image.png renders 1200×630 social share with Clyde headline, FMai accent teal, NL tagline; OrganizationJsonLd.logo (https://future-marketing.ai/logo.png) returns 200"
    why_human: "Asset is on disk and 1200×630 RGBA verified, but only post-deploy can confirm the social-share crawler picks it up"
  - test: "Stripe product 'Max Credit Pack' rename"
    expected: "Stripe dashboard shows 15.000 credit pack named 'Max Credit Pack' (was 'Unlimited Credit Pack') so customer invoices match website copy"
    why_human: "Phase 12 only changed website display name; Stripe-side rename is documented in DECISION-PENDING-credit-pack-name.md and requires Daley action; default-after-2-weeks (2026-05-09) is 'Max stays'"
  - test: "VoiceDemoSection.tsx US phone number decision"
    expected: "Daley resolves DECISION-PENDING-phone-number.md (NL DID rental / hide CTA-only / keep-and-defer); default-after-2-weeks (2026-05-09) is hide CTA-only"
    why_human: "Audit finding parked deliberately per plan 12-03 task 5; not a Phase 12 code change"
notes:
  - "Success criterion 5 in verification prompt referenced 'orphan chatbots.* namespace removal' but Phase 12 README §Scope explicitly DEFERRED this with rationale: chatbot components (DemoPlayground, MultiPlatformShowcase, PersonaSelector, DemoContextCard) are still actively used on /skills/lead-qualifier — confirmed via grep of src/app/[locale]/(skills)/skills/lead-qualifier/page.tsx. Namespace is NOT orphan. Deletion deferred pending separate component-by-component audit."
  - "Hardcoded #F5A623 (current accent-human amber) appears in SkillsTierMatrix.tsx as text-[#F5A623]. Not a Phase 12 violation (deprecated palette is #050814/#00D4FF/#A855F7/#0A0E27 — F5A623 is NEW correct value), but design-token utility text-accent-human would be cleaner. Cosmetic only."
  - "AUDIT-BLOCKER-P0-BRAND requirement ID does not appear in REQUIREMENTS.md; phase plans declare WEB-01 instead. WEB-01 is marked Done in REQUIREMENTS.md and Phase 12 work substantially advances it."
---

# Phase 12: Brand Assets + Copy Polish Verification Report

**Phase Goal:** One palette, one copy voice, one canonical set of assets across all three locales; all tier-matrix labels render in the visitor's language; legacy orphan namespace and stale color tokens are gone.

**Verified:** 2026-04-25T13:30:00Z
**Status:** human_needed (all automated checks pass; visual + social-share + Stripe-side need human verification)
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (mapped to README §Success Criteria)

| #   | Truth                                                                                    | Status     | Evidence       |
| --- | ---------------------------------------------------------------------------------------- | ---------- | -------------- |
| 1   | og-image.png + logo.png exist + dynamic /api/og fallback                                 | VERIFIED   | See §1 below   |
| 2   | skills-data.ts contains zero hardcoded EN labels, em-dashes, "brand voice"               | VERIFIED   | See §2 below   |
| 3   | Palette migration: zero deprecated hex in src/; CLAUDE.md Theme matches actual palette   | VERIFIED   | See §3 below   |
| 4   | Hardcoded EN strings on HeaderClient/pricing/error/SkillsTierMatrix/ChatWidget routed via i18n | VERIFIED   | See §4 below   |
| 5   | Glossary enforced (klanten→merken, Onbeperkt credit pack→Max, IK/WIJ, MAX_PARTNERS interp, legal dates) | VERIFIED   | See §5 below   |

**Score:** 5/5 must-haves verified (automated). 4 items routed to human for visual / external-system confirmation.

---

## §1 — Brand Assets

| Check | Command | Result |
|---|---|---|
| og-image.png exists, 1200×630 PNG | `file public/og-image.png` | PNG image data, 1200 x 630, 8-bit/color RGBA — 47.4 KB ✓ |
| logo.png exists, 512×512 PNG | `file public/logo.png` | PNG image data, 512 x 512, 8-bit/color RGBA — 7.9 KB ✓ |
| Dynamic OG fallback route | `cat src/app/api/og/route.tsx` | Edge runtime, ImageResponse 1200×630, per-locale tagline (nl/en/es), s-maxage=31536000 ✓ |
| OrganizationJsonLd.logo points to /logo.png | `grep logo OrganizationJsonLd.tsx:10` | `logo: \`${SITE_URL}/logo.png\`` ✓ |
| og-image-square.png (optional per plan-01 task 1) | `ls public/og-image-square.png` | NOT PRESENT — README §Scope marked "if a specific meta tag references it; audit did not confirm". No `og-image-square` reference found in codebase, so absence is correct. |

**Artifacts:** og-image.png ✓ | logo.png ✓ | /api/og route ✓ | scripts/generate-brand-assets.mjs ✓ | scripts/verify-palette.sh ✓

---

## §2 — skills-data.ts Cleanliness

| Check | Command | Result |
|---|---|---|
| No `label: '...'` literal strings | `grep "label: '" src/lib/skills-data.ts` | 0 matches ✓ |
| No EN literals (unlimited / add-on / /mo / niet beschikbaar / Coming soon / brand voice) | `grep -iE "unlimited\|/mo\|add-on €\|niet beschikbaar\|Coming soon\|brand voice"` | 6 matches — ALL are JSDoc comments and `labelKey: 'unlimited'` enum literal type values (not user-facing strings) ✓ |
| No em-dashes | `grep -c "—" skills-data.ts` | 0 ✓ |
| pricing.matrix.* keys NL/EN/ES parity | `diff <(jq pricing.matrix...keys nl)` | 14 keys per locale, identical: addOn, addOn47, addOn97, dmsPerMonth, fairUse, itemsPerMonth, legend, minPerMonth, notAvailable, perMonth, skillHeader, subtitle, title, unlimited ✓ |
| SkillsTierMatrix dispatches via labelKey + unit | `cat src/components/pricing/SkillsTierMatrix.tsx:30-60` | renderCap branches on cap.labelKey first, then cap.unit (min/dm/count) → t() with `{count}` interpolation ✓ |

---

## §3 — Palette Migration

| Check | Command | Result |
|---|---|---|
| Zero deprecated hex in src/ | `grep -rE "#050814\|#00D4FF\|#A855F7" src/ --include="*.{tsx,ts,css}"` | 0 matches ✓ |
| `npm run check:palette` regression gate | `bash scripts/verify-palette.sh` | "PASS: no stale palette hex in src/" ✓ |
| CLAUDE.md Theme reads new palette | `grep -nE "#0a0d14\|#00d4aa" CLAUDE.md` | Line 25 `#0a0d14`, line 28 `#00d4aa` ✓ |
| CLAUDE.md Deprecated section warns about old palette | `grep "Deprecated" CLAUDE.md:37-41` | Lists #050814 / #0A0E27 / #00D4FF / #A855F7 with "do NOT use" ✓ |

**Note on #F5A623:** SkillsTierMatrix.tsx:65,102 uses `text-[#F5A623]` arbitrary tailwind. This is the NEW accent-human (amber) — not in the deprecated palette list. Cosmetic — could be `text-accent-human` utility — but does not violate Phase 12 success criteria.

---

## §4 — Hardcoded English Strings

| File | Check | Result |
|---|---|---|
| HeaderClient.tsx | `grep -E "'Apply'\|'Most popular'\|'Create & Publish'\|'Engage & Convert'\|'Grow & Optimize'\|'Social Media'\|'Blog Factory'\|'Voice Agent'"` | 0 matches; uses `tHeader('skills.${category.key}.items.${skill.key}.title')` dispatch ✓ |
| HeaderClient.tsx i18n hookups | `grep "useTranslations\|tHeader"` | imports useTranslations, calls `useTranslations('header')` + `useTranslations('nav')` ✓ |
| pricing/page.tsx | `grep "'Most popular'\|\"Most popular\""` | 0 matches ✓ (now `t('tiers.professional.mostPopular')`) |
| SkillsTierMatrix.tsx | `grep "Coming soon"` | 0 matches; uses `tCommon('comingSoon')` ✓ |
| ChatWidget.tsx | `grep -E "'Demo limit reached'\|'Type a message...'\|'Book a call'"` | 0 matches; t() count = 12 in file ✓ |
| error.tsx | Read full file | `useTranslations('errors.generic')`; 4 t() calls (title, description, retryButton); no purple `!` glyph; raw error.message NOT rendered (security) ✓ |
| ApplicationForm success screen | `grep "successTitle\|successBody"` | Lines 107-108 use `t('successTitle')` + `t('successBody')` ✓ |

---

## §5 — Glossary + Interpolation + Dates

| Check | Command | Result |
|---|---|---|
| Apply form `klanten` rewrites | `grep "apply.form.*klanten\|'1 tot 5 klanten'\|'15 tot 30 klanten'"` | 0 matches in apply.form ✓ |
| Remaining `klanten` are legitimate | `grep '"[^"]*klanten[^"]*"' messages/nl.json` | 5 hits: klantenservice (compound), oprichtende klanten (FMai's own customers, audit-confirmed legit), 3 legal third-person refs ✓ |
| Credit pack `Onbeperkt` rename | `jq '.pricing.creditPacks.items.unlimited.name' nl.json` | `"Max"` (NL/EN/ES all renamed) ✓ |
| Remaining `Onbeperkt`/`Unlimited`/`Ilimitado` are legitimate | `grep "Onbeperkt"` | 8 hits: workspaces (Enterprise unlimited workspaces feature), pricing.matrix.unlimited (skill-cap label), faq rhetorical contrast — NOT credit-pack ref ✓ |
| `Boek een strategiegesprek` removed | `grep "Boek een strategie"` | 0 matches; `"Plan een strategiegesprek"` present at contact.book_demo.title ✓ |
| MAX_PARTNERS_PER_YEAR interpolation | `grep -c "{maxPartners}" messages/{nl,en,es}.json` | 10 / 10 / 10 (10 keys per locale, exceeded plan target of 8) ✓ |
| Global substituent wired | `cat src/i18n/request.ts` | `GLOBAL_PLACEHOLDERS = { maxPartners: MAX_PARTNERS_PER_YEAR }` + substituteGlobals walker (next-intl 4.x compatible pattern) ✓ |
| No hardcoded "20 bureaus/agencies/partners" | `grep -E "20 partners\|20 bureaus\|20 agencies\|maximaal 20\|max 20"` | 0 matches ✓ |
| Legal `last_updated` date current | `jq '.legal.last_updated'` | NL: "Laatst bijgewerkt: 24 april 2026" / EN: "Last updated: April 24, 2026" / ES: "Última actualización: 24 de abril de 2026" ✓ |
| No em-dashes in messages | `grep -c "—" messages/{nl,en,es}.json` | 0 / 0 / 0 ✓ |

---

## i18n Key Parity

```
NL keys: 1804
EN keys: 1804 (diff vs NL: 0)
ES keys: 1804 (diff vs NL: 0)
```

All three locales fully synchronized at every key path level.

---

## Build Status

```
$ npm run build
✓ Compiled successfully in 6.0s
✓ Generating static pages using 15 workers (87/87) in 1611ms
```

87 static pages prerendered. Zero TypeScript errors. Zero new ESLint regressions vs Phase 11 baseline.

---

## Anti-Pattern Scan

| File | Pattern | Severity | Notes |
|---|---|---|---|
| SkillsTierMatrix.tsx:65,102 | `text-[#F5A623]` arbitrary hex | ℹ Info | Current accent-human amber, NOT deprecated palette. `text-accent-human` utility cleaner — non-blocking. |
| (none) | TODO/FIXME/PLACEHOLDER in 12-touched files | — | Clean across all 24 files modified by phase 12 |
| (none) | console.log-only stubs | — | Clean |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|---|---|---|---|---|
| WEB-01 | 12-01, 12-02, 12-03, 12-04 | Homepage copy targets "marketing agencies" | SATISFIED (advanced further) | `klanten→merken` glossary, IK/WIJ pass on about/contact/founding-member, header.* i18n routes mega-menu through NL/EN/ES, skills-data tier-matrix labels NL-correct, MAX_PARTNERS interpolation makes 20-bureaus copy locale-aware |
| AUDIT-BLOCKER-P0-BRAND | (prompt) | (Not in REQUIREMENTS.md) | NOT-IN-REQUIREMENTS-FILE | Prompt cited this ID but it does not appear in `.planning/REQUIREMENTS.md`. Phase plans declared `WEB-01`. Phase work substantially closes the audit-flagged brand+copy gaps from `docs/audits/2026-04-24-full-audit/` regardless. |

---

## Gaps Summary

**Zero automated gaps.** All 5 README §Success Criteria pass via grep, jq parity, file checks, palette regression script, and production build.

Items routed to **human verification** (visual / external-system / decision-gate):
1. Visual sweep of /nl/pricing tier matrix (12 skills × 5 tiers — verify no English leaks)
2. Post-deploy social-share validator (LinkedIn Post Inspector + Twitter card validator)
3. Stripe Product rename "Unlimited Credit Pack" → "Max Credit Pack" (DECISION-PENDING-credit-pack-name.md)
4. VoiceDemoSection US phone number decision (DECISION-PENDING-phone-number.md)

Items deliberately **deferred per Phase 12 scope** (explicit in README §Out-of-scope):
- B-1 /api/apply Resend wiring
- B-2 /api/contact Resend wiring
- B-3 Chatbot v9 pricing in leadgen-tools.ts + concierge-tools.ts
- B-4 public/llms.txt + llms-full.txt regeneration
- B-6 Skip-to-content link + Skills mega-menu keyboard navigation
- B-7 --color-text-muted contrast fix (already done in Phase 11-02)
- B-8 ApplicationForm per-field errors + autoComplete (Phase 11)
- B-10 middleware.ts rename + /api/vitals + CVE patches
- ContactForm EN strings (Phase 11)
- Orphan `chatbots.*` namespace deletion (NOT orphan — verified active in /skills/lead-qualifier components)

---

_Verified: 2026-04-25T13:30:00Z_
_Verifier: Claude (gsd-verifier, opus 4.7)_
