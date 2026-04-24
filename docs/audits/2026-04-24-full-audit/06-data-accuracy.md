# Data Accuracy Audit — 2026-04-24

**Scope**: marketing site `fmai-nextjs/` — do the numbers and facts the site displays match the Source-of-Truth, and are they consistent across files/locales/surfaces?

**Method**: line-level diff between `fma-app/src/lib/skills.ts` (SSoT) and `fmai-nextjs/src/lib/skills-data.ts`, full-text grep for every price/counter/skill-count occurrence across `messages/*.json`, `src/**/*.{ts,tsx}`, public assets and SEO JSON-LD.

---

## Executive Summary

**Verdict: FAIL — two surfaces still serve the OLD pricing model (pre-v10).**

| Category | Status | Severity |
|---|---|---|
| skills-data.ts vs SSoT (tier prices, caps, credits, onboarding) | PASS | — |
| `/pricing` page (messages + JSON-LD) | PASS | — |
| Founding counter (1/10) via `constants.ts` | PASS | — |
| Skill count "12 total, 9 live, 3 coming_soon" | PASS | — |
| Skill statuses (skills-data.ts vs header vs messages) | PASS | — |
| Tier caps (blog/email/adCreator/reel/voice/manychat) | PASS | — |
| Credit pack prices (€39 / €149 / €297 / €697) | PASS | — |
| Skill pack prices (€97 / €47 / €147 / €197×3) | PASS | — |
| Legal page (subscription_terms) tier prices | PASS | — |
| SEO `PricingJsonLd` component | PASS | — |
| **Chatbot pricing knowledge bases (`/api/chatbot`)** | **FAIL** | **CRITICAL** |
| **Legacy leadgen/concierge tool JS prices** | **FAIL** | **CRITICAL** |
| **`public/llms.txt` + `llms-full.txt`** | **FAIL** | **HIGH** |
| Contact email inconsistency (4 different `@futuremarketingai.com` mailboxes) | FAIL | MEDIUM |
| Domain mismatch: `future-marketing.ai` (CLAUDE.md) vs `futuremarketingai.com` (code) | FAIL | MEDIUM |
| Legal "last updated March 2026" while we're in April 2026 | FAIL | LOW |
| Header mega-menu hardcoded English (not translated) | FAIL | MEDIUM |
| Voice demo hardcoded US phone number `+1 (570) 783-8236` | FAIL | LOW |
| MAX_PARTNERS_PER_YEAR=20 hardcoded in messages (not interpolated) | FAIL | LOW |

Two production-hitting critical issues and several medium issues with public-facing consequences.

---

## 1. SSoT Diff Table — `fma-app/src/lib/skills.ts` vs `fmai-nextjs/src/lib/skills-data.ts`

### 1.1 Tier prices (AGENT_TIERS vs messages/*.json tier blocks)

| Field | SSoT | Site (skills-data + nl.json) | Match |
|---|---|---|---|
| Partner price | 347 | 347 | OK |
| Growth price | 2497 | 2.497 (NL) / 2,497 (EN) / 2.497 (ES) | OK |
| Professional price | 4497 | 4.497 / 4,497 / 4.497 | OK |
| Enterprise price | 7997 | 7.997 / 7,997 / 7.997 | OK |
| Founding price | 997 | 997 | OK |
| Partner onboarding | 497 | 497 | OK |
| Growth onboarding | 1997 | 1.997 / 1,997 / 1.997 | OK |
| Pro onboarding | 3997 | 3.997 / 3,997 / 3.997 | OK |
| Enterprise onboarding | 5997 | 5.997 / 5,997 / 5.997 | OK |
| Founding onboarding | 0 | 0 | OK |
| Partner credits | 1000 | 1.000 | OK |
| Growth credits | 4000 | 4.000 | OK |
| Pro credits | 12000 | 12.000 | OK |
| Enterprise credits | 30000 | 30.000 | OK |
| Founding credits | 8000 | 8.000 | OK |
| Partner workspaces | 1 | 1 | OK |
| Growth workspaces | 5 | 5 | OK |
| Pro workspaces | 15 | 15 | OK |
| Enterprise workspaces | -1 (unlimited) | "Onbeperkt" / "Unlimited" / "ilimitado" | OK |
| Founding workspaces | -1 | "Onbeperkt" / "Unlimited" / "ilimitados" | OK |

### 1.2 SKILL_CAPS vs skills-data.ts tierCaps

Confirmed line-by-line across PARTNER / GROWTH / PROFESSIONAL / ENTERPRISE / FOUNDING_MEMBER for: blogFactory, emailManagement, adCreatorStatic, adCreatorVideo, reelBuilder, voiceAgentMinutes, manychatDm.

All values match SSoT. (See `skills-data.ts` lines 83-90, 110-117, 136-143, 163-170, 208-215, 234-241.)

### 1.3 CREDIT_PACKS vs messages pricing.creditPacks

| Pack | SSoT | NL | EN | ES |
|---|---|---|---|---|
| PARTNER_TOP_UP | 500 credits / €39 | 500 / 39 | 500 / 39 | 500 / 39 |
| BOOST | 2000 / €149 | 2.000 / 149 | 2,000 / 149 | 2.000 / 149 |
| SCALE | 5000 / €297 | 5.000 / 297 | 5,000 / 297 | 5.000 / 297 |
| UNLIMITED | 15000 / €697 | 15.000 / 697 | 15,000 / 697 | 15.000 / 697 |

All match.

### 1.4 SKILL_PACKS vs messages pricing.skillPacks

| Pack | SSoT price | NL | EN | ES |
|---|---|---|---|---|
| PARTNER_STATIC_ADS | €97 | 97 | 97 | 97 |
| PARTNER_MANYCHAT | €47 | 47 | 47 | 47 |
| VOICE_MINUTES | €147 | 147 | 147 | 147 |
| VIDEO_ADS | €197 | 197 | 197 | 197 |
| REELS | €197 | 197 | 197 | 197 |
| BLOG_POWER | €197 | 197 | 197 | 197 |

All match.

### 1.5 Skill list diff

12 skills in both SSoT (`SKILLS`) and mirror (`SKILLS_DATA`):

| # | SSoT key | skills-data.ts id | Status SSoT | Status mirror | Match |
|---|---|---|---|---|---|
| 1 | socialMedia | social-media | live | live | OK |
| 2 | blogFactory | blog-factory | live | live | OK |
| 3 | adCreator | ad-creator | live | live | OK |
| 4 | reelBuilder | reel-builder | coming_soon | coming_soon | OK |
| 5 | voiceAgent | voice-agent | live | live | OK |
| 6 | leadQualifier | lead-qualifier | live | live | OK |
| 7 | emailManagement | email-management | coming_soon | coming_soon | OK |
| 8 | manychatDm | manychat | coming_soon | coming_soon | OK |
| 9 | reporting | reporting | live | live | OK |
| 10 | seoAnalyst | seo-geo | live | live | OK |
| 11 | intelligence | research | live | live | OK |
| 12 | clyde | clyde | live | live | OK |

9 live + 3 coming_soon. Matches CLAUDE.md claim.

---

## 2. Price String Inventory — every occurrence in site

### 2.1 PASS — values that match SSoT (v10)

| File | Line | Context | Value |
|---|---|---|---|
| `messages/nl.json` | 471 | founding description | €997/mnd |
| `messages/nl.json` | 523 | pricing meta title | €347 … €7.997 |
| `messages/nl.json` | 543 | partner tier | 347 |
| `messages/nl.json` | 555 | partner ad-on | €97 voor 15 |
| `messages/nl.json` | 556 | partner add-on | €47 voor 300 |
| `messages/nl.json` | 563-620 | growth/pro/ent/founding | 2.497 / 4.497 / 7.997 / 997 |
| `messages/nl.json` | 719 | credit pack fallback | €39 … €697 |
| `messages/nl.json` | 853 | legal subscription_terms | Partner EUR 347 … Founding EUR 997 |
| `messages/nl.json` | 1326-1404 | founding-member page | 10 plekken, €997 levenslang, €2.497 Growth ref |
| `messages/nl.json` | 1554-1558 | about page tier glossary | All 5 tier prices |
| `messages/en.json` | same keys | English mirror | all match (using comma separator) |
| `messages/es.json` | same keys | Spanish mirror | all match (with EUR suffix variant) |
| `src/components/seo/PricingJsonLd.tsx` | 14-83 | Offer schema for 5 tiers | 347 / 2497 / 4497 / 7997 / 997 |

### 2.2 FAIL — stale prices still in production code

**CRITICAL — `src/lib/chatbot/tools/leadgen-tools.ts`** (imported by `flagshipTools` → `/api/chatbot`). Old v9 4-tier pricing, no Partner tier:

| Line | Stale value | Should be |
|---|---|---|
| 98 | `monthlyPrice: 1497` (Growth) | `2497` |
| 101 | `onboardingFee: 1500` | `1997` |
| 103 | `"All 11 AI skills included"` | `"All 12 AI skills..."` |
| 106 | `"EUR 1,500 onboarding fee"` | `"EUR 1,997 onboarding fee"` |
| 111 | `monthlyPrice: 2997` (Pro) | `4497` |
| 114 | `onboardingFee: 3000` | `3997` |
| 116 | `"All 11 AI skills included"` | 12 |
| 120 | `"EUR 3,000 onboarding fee"` | `"EUR 3,997..."` |
| 125 | `monthlyPrice: 4997` (Ent) | `7997` |
| 128 | `onboardingFee: 5000` | `5997` |
| 130 | `"All 11 AI skills included"` | 12 |
| 134 | `"EUR 5,000+ onboarding fee"` | `"EUR 5,997+..."` |
| 141 | `credits: 10000` (Founding) | `8000` |
| 144 | `"All 11 AI skills included"` | 12 |
| 146 | `'10,000 credits/mo'` | `8,000 credits/mo` |
| 192 | `monthlySubscription default 1497` | `2497` |

Also missing the Partner tier entirely — chatbot cannot answer Partner pricing questions.

**CRITICAL — `src/lib/chatbot/tools/concierge-tools.ts`** (imported into `/api/chatbot`):

| Line | Stale value | Should be |
|---|---|---|
| 18 | `'Included in all plans (from EUR 1,497/mo)'` | `from EUR 347/mo` (Partner) or `EUR 2,497/mo` (Growth) |
| 30 | same | same |
| 42 | same | same |
| 47 | `'all 11 AI skills'` | 12 |
| 49 | `'All 11 AI skills working as one'` | 12 |
| 54 | `'From EUR 1,497/mo (Growth plan)'` | `EUR 2,497/mo` |

**HIGH — `src/lib/chatbot/knowledge/concierge-kb.ts`** (lines 58-83, 220):

Line 220: `contact@futuremarketingai.com` — a 4th contact address not used anywhere else.

Lines 60-83 describe the correct v10 tiers with correct prices (EUR 2,497 / 4,497 / 7,997 / 997) — so the KB itself is current. BUT it still says `"all 12 AI skills included"` for Partner (line 63), which contradicts the Partner 8-of-12 claim made elsewhere on the site.

**HIGH — `src/lib/chatbot/knowledge/support-kb.ts`** (lines 24-218):

Prices are correct (v10). BUT identical "all 12 AI skills included" claim for Partner tier on line 29, contradicting site pricing FAQ which says "Partner has 8 skills included plus 2 add-on paths".

**HIGH — `public/llms.txt` + `public/llms-full.txt`**:

Both files describe the OLD three-tier model "Starter, Growth, Scale" (llms.txt line 25) and reference skills that no longer exist (chatbots / voice-agents / automations / marketing-machine as top-level products instead of the 12-skill model). llms-full.txt line 104 claims `"Up to 160 posts per month"` — inconsistent with case study figure of ~21 carrousels/week (~84/month). These files are indexed by LLM crawlers and represent the public AI-readable summary of the company — they are actively misleading.

---

## 3. Founding Counter Occurrences

### 3.1 PASS — using `constants.ts` (FOUNDING_SPOTS_TAKEN=1, FOUNDING_SPOTS_TOTAL=10)

| File | Line | Usage |
|---|---|---|
| `src/app/[locale]/page.tsx` | 18, 89, 229, 358 | home hero badge + 2 CTA subtitles |
| `src/app/[locale]/(marketing)/apply/page.tsx` | 11, 53 | apply hero counter |
| `src/app/[locale]/(marketing)/about/page.tsx` | 13, 213-215 | about counter + MAX_PARTNERS_PER_YEAR interp |
| `src/app/[locale]/(marketing)/founding-member/page.tsx` | 12, 73, 200 | founding hero + cta |
| `src/app/[locale]/(marketing)/pricing/page.tsx` | 15, 94, 160-161 | pricing hero + tier card |

Every runtime "{taken} of {total}" string gets its values from the constants file. Good.

### 3.2 FAIL — hardcoded "10 plekken/spots/plazas" in messages

Not drift per se — they all say 10 consistently — but they are NOT interpolated, so if `FOUNDING_SPOTS_TOTAL` ever changes these will be stale:

| File | Line | String |
|---|---|---|
| `messages/nl.json` | 618 | "10 plekken, levenslange deal" |
| `messages/nl.json` | 623 | "10 plekken totaal. Pro-caps." |
| `messages/nl.json` | 1326 | "Founding Member: 10 plekken, €997 levenslang" |
| `messages/nl.json` | 1387 | "Wat gebeurt er als de 10 plekken vol zijn?" |
| `messages/nl.json` | 1404 | "uitzondering voor deze 10 plekken" |
| `messages/nl.json` | 1558 | "Founding (€997/mnd): 10 plekken" |
| `messages/en.json` | 618, 1326, 1387, 1404, 1558 | EN equivalents |
| `messages/es.json` | 618, 1326, 1327, 1387, 1404, 1558 | ES equivalents |
| `src/components/seo/PricingJsonLd.tsx` | 73 | `"Founding Member tier (10 spots, grandfathered lifetime)"` |
| `src/lib/chatbot/knowledge/concierge-kb.ts` | 80 | `"EUR 997/mo**: 10 spots only"` |
| `src/lib/chatbot/knowledge/support-kb.ts` | 46 | `"EUR 997/mo** (10 spots only, lifetime price lock)"` |

These are acceptable if "10" is the permanent business rule. Document in CLAUDE.md that `FOUNDING_SPOTS_TOTAL` is intentionally also hardcoded in messages.

---

## 4. Skill Count Consistency

| Surface | Claim | Match with SSoT (9 live / 3 coming / 12 total) |
|---|---|---|
| `messages/*.json` line 126 — pricing FAQ | "Twaalf in totaal: 9 live … en 3 coming soon" | OK |
| `messages/*.json` line 571, 590 | "Alle 12 vaardigheden beschikbaar" (Growth/Pro) | OK |
| `messages/*.json` line 609 | "Alle 12 vaardigheden zonder caps" (Enterprise) | OK |
| `messages/*.json` line 627 | "Alle 12 vaardigheden (met Pro-caps)" (Founding) | OK |
| `messages/*.json` line 547 | Partner: "8 vaardigheden inbegrepen, plus 2 add-on paden" | OK (12 - reelBuilder - voiceAgent - adCreator - manychat = 8 included; static ads + manychat are add-on paths) |
| `src/lib/skills-data.ts` | 12 objects in array | OK |
| `src/lib/seo-config.ts` line 7 | "Clyde with 12 skills" | OK |
| `src/components/seo/PricingJsonLd.tsx` line 13 | `"Partner tier. 8 of 12 skills included"` | OK |
| `src/components/chatbot/DemoPlayground.tsx` line 34 | "Ask me anything about the 12 skills" | OK |
| `src/lib/chatbot/knowledge/concierge-kb.ts` line 63 | `"all 12 AI skills included"` (Partner) | **CONFLICT** — Partner actually has 8 |
| `src/lib/chatbot/knowledge/support-kb.ts` line 29 | `"all 12 AI skills included"` (Partner) | **CONFLICT** |
| `src/lib/chatbot/tools/leadgen-tools.ts` lines 103/116/130/144 | `"All 11 AI skills included"` | **DRIFT** (says 11, not 12) |
| `src/lib/chatbot/tools/concierge-tools.ts` line 47, 49 | `"all 11 AI skills"` | **DRIFT** (says 11) |
| `messages/*.json` line 1966, 2007 (Clyde page) | "De andere 11 vaardigheden" | OK (Clyde + 11 = 12) |
| `src/components/layout/HeaderClient.tsx` | 12 items across 3 groups | OK |
| `public/llms.txt`, `public/llms-full.txt` | old 4-product model (chatbots / automations / voice-agents / marketing-machine) | **FAIL** — no mention of the 12 skills at all |

---

## 5. Skill Status Consistency Table — 12 skills × surface

Legend: L = live, C = coming_soon, — = not present

| Skill | skills-data.ts | SSoT fma-app | HeaderClient.tsx | nl.json FAQ line 126 | SkillsTierMatrix |
|---|---|---|---|---|---|
| Social Media | L | L | L | L | L |
| Blog Factory | L | L | L | L | L |
| Ad Creator | L | L | L | L | L |
| Reel Builder | C | C | C (comingSoon:true) | C | C |
| Voice Agent | L | L | L | L | L |
| Lead Qualifier | L | L | L | L | L |
| Email Management | C | C | C (comingSoon:true) | C | C |
| ManyChat DM | C | C | C (comingSoon:true) | C | C |
| Reporting | L | L | L | L | L |
| SEO / GEO | L | L | L | L | L |
| Research | L | L | L | L | L |
| Clyde | L | L | L | L | L |

**Status is 100% consistent across all current surfaces.** (The legacy chatbot tool files say "11 skills" / "all 12" but do not specify status per skill.)

---

## 6. Locale Sync Audit

| Fact | nl.json | en.json | es.json | Match |
|---|---|---|---|---|
| Partner price | €347/mnd | €347/mo | 347 €/mes | OK |
| Growth price | €2.497/mnd | €2,497/mo | 2.497 €/mes | OK |
| Pro price | €4.497/mnd | €4,497/mo | 4.497 €/mes | OK |
| Enterprise price | €7.997/mnd | €7,997/mo | 7.997 €/mes | OK |
| Founding price | €997/mnd | €997/mo | 997 €/mes | OK |
| Founding workspaces | Onbeperkt | Unlimited | ilimitados | OK |
| 10 spots (founding) | 10 plekken | 10 spots | 10 plazas | OK |
| 20 agencies/year | Maximaal 20 bureaus per jaar | Max 20 agencies per year | Máx. 20 agencias al año | OK |
| Contact email | hello@futuremarketingai.com | same | same | OK |
| Legal last updated | maart 2026 | March 2026 | marzo de 2026 | OK (all three stale, should be april) |
| Number formatting | `2.497` (nl dot as thousands) | `2,497` (en comma) | `2.497` (es dot) | OK per locale conventions |
| Currency symbol placement | `€997` | `€997` | `997 €` (plus mixed `997 EUR` in some strings) | Minor ES inconsistency |
| Percent format (60% less) | `60% minder` | `60% less` | `60% menos` | OK |

**Note on ES inconsistency**: some es.json strings use `2.497 €` (post-symbol with space) and others use `2.497 EUR`. Examples: line 523 `"De Partner 347 EUR a Enterprise 7.997 EUR"`, line 853 `"Partner (347 EUR al mes)"` but line 1554-1558 uses `"Partner (347 €/mes)"`. Cosmetic but visible drift.

---

## 7. Forbidden-Term Occurrences

Per CLAUDE.md glossary: `"unlimited"` is forbidden when used without fair-use disclaimer.

All `unlimited` / `onbeperkt` / `ilimitado` occurrences in messages/*.json are either:
- (a) paired with "fair use" / "fair-use throttling" / "caps houden de kosten voorspelbaar" disclaimer (see nl.json 646, 714-715)
- (b) labels for Enterprise tier workspaces (which truly have `maxClients: -1` in SSoT)
- (c) the "Onbeperkt"/"Unlimited"/"Ilimitado" label for the €697 credit pack (a product name)

No violations of the glossary contract in messages.

However, **llms-full.txt** and the **chatbot kb files** use "Unlimited workspaces" without caveat — `support-kb.ts` line 216 says `"Unlimited workspaces (same as Enterprise at EUR 7,997/mo)"` for Founding. Founding in SSoT does have `maxClients: -1`, so factually accurate, but the "without fair-use caveat" pattern still triggers the glossary rule.

---

## 8. Contact Info / Social / Domain

### 8.1 Email inconsistencies (4 different mailboxes across codebase)

| Purpose | Address | Location |
|---|---|---|
| User-facing contact (contact page + error toast) | `hello@futuremarketingai.com` | messages/*.json line 822, 1569 ; contact page.tsx line 127 |
| Privacy inquiries | `privacy@futuremarketingai.com` | messages/*.json line 915 |
| Organization schema / SEO config | `info@futuremarketingai.com` | src/lib/seo-config.ts line 3 ; .env.example CONTACT_EMAIL_TO |
| Apply form (Resend) | `apply@futuremarketingai.com` | .env.example APPLY_EMAIL_FROM |
| Chatbot knowledge | `contact@futuremarketingai.com` | src/lib/chatbot/knowledge/concierge-kb.ts line 220 |

Five different addresses. `contact@` is wrong (not used anywhere else) and `info@` (schema.org + env) vs `hello@` (user-facing UI) is the live visible inconsistency.

### 8.2 Domain — potential mismatch with CLAUDE.md

- CLAUDE.md root: `future-marketing.ai` (hyphenated, new TLD)
- CLAUDE.md root "red flags": `NEVER wrong domains — \`future-marketing.ai\`, \`app.future-marketing.ai\``
- `.env.example` NEXT_PUBLIC_SITE_URL: `https://futuremarketingai.com` (concatenated, .com)
- `src/lib/seo-config.ts`: `https://futuremarketingai.com`
- `public/llms*.txt`: `futuremarketingai.com` throughout
- 35+ occurrences across `public/llms-full.txt` all point to `futuremarketingai.com`

The CLAUDE.md root contradicts the code. Either the code is wrong (production domain should be `future-marketing.ai`) or the CLAUDE.md is wrong. The actual production domain needs verification — but the split is documented here for the owner to resolve.

### 8.3 Social handles (Footer.tsx line 225, 234)

- LinkedIn: `https://www.linkedin.com/company/futuremarketingai` — consistent with seo-config.ts
- Twitter: `https://twitter.com/FutureMarketAI` — **camel casing different from all other references** (LinkedIn uses `futuremarketingai`, Twitter `FutureMarketAI`). If both accounts are owned, not a bug. If the Twitter handle was meant to match, drift.

### 8.4 Voice phone number

`src/components/voice/VoiceDemoSection.tsx` lines 67, 93: hardcoded `+1 (570) 783-8236` — a US number for an EU-native product. Either a real VAPI test number or a leftover. Not in i18n.

---

## 9. Legal Page Dates

All three locales (`messages/*/legal/last_updated`) say March 2026. Current date per system context: 2026-04-24. Delta is less than a month so not urgent, but because legal content (subscription_terms) references specific prices (€347 / €2.497 / etc.) the page should be re-dated whenever those prices move.

`src/lib/seo-config.ts` PAGE_DATES has `/legal: '2026-03-18'` — matches the "March 2026" user-visible string. Consistent within the codebase.

---

## 10. Case Study Metrics (SkinClarity Club)

Values in `messages/*/case_studies.skc.content`:

| Metric | Value | Source/credibility |
|---|---|---|
| Carrousels | "Circa 21 per week" | Hedged ("Circa"/"Around") — safe |
| Instagram-posts | "Circa 15 per week" | Hedged — safe |
| Stories | "Op aanvraag" / "On request" | Qualitative — safe |
| Blogartikelen | "2 tot 4 per maand" | Range — safe |
| SEO-rapporten | "Wekelijks" / "Weekly" | Qualitative — safe |
| Prestatie-digest | "Maandag 08:00" | Specific timing — safe |
| Accounts | "3 Instagram-accounts, 4 merken" | Concrete claim (verifiable) |
| Skills actief | "Van de 12 vaardigheden ... staan er 6 aan" | Specific — verify matches reality |
| Timeline month 3 | "goedkeuringstijd zakt van 4 minuten naar 30 seconden" | Specific — verifiable if logged |

All case study metrics use cautious hedged language ("circa" / "approximately" / "around"). No over-claims. No old "4x" metric or "160 posts/month" leakage from llms-full.txt.

**Issue**: llms-full.txt line 104 claims `"Up to 160 posts per month"` — a legacy number from the v9 marketing machine positioning. Public crawlers will report this.

---

## 11. Stripe price ID env vars

`.env.example` lines 36-40 (commented, reference only):
```
# STRIPE_PRICE_PARTNER=price_xxx          # €347/mo
# STRIPE_PRICE_GROWTH=price_xxx           # €2497/mo
# STRIPE_PRICE_PROFESSIONAL=price_xxx     # €4497/mo
# STRIPE_PRICE_ENTERPRISE=price_xxx       # €7997/mo
# STRIPE_PRICE_FOUNDING=price_xxx         # €997/mo (grandfathered)
```

Tier names and annotations match SSoT exactly. But missing from .env.example (present in SSoT):
- STRIPE_PRICE_ONBOARDING_* (5 of them — Partner/Growth/Pro/Ent/Founding)
- STRIPE_PRICE_CREDITS_* (4 — PARTNER_TOP_UP, BOOST, SCALE, UNLIMITED)
- STRIPE_PRICE_PACK_* (6 — PARTNER_STATIC_ADS, PARTNER_MANYCHAT, VOICE_MINUTES, VIDEO_ADS, REELS, BLOG_POWER)

Per CLAUDE.md the site does not call Stripe directly, so these env vars are reference-only. Fine.

---

## 12. MAX_PARTNERS_PER_YEAR Usage

- Defined: `src/lib/constants.ts` line 10 = `20`
- Used in interpolation: `src/app/[locale]/(marketing)/about/page.tsx` line 215 (`maxPerYear: MAX_PARTNERS_PER_YEAR`)
- Only ONE message key uses the interpolation: `about.section.body` ("Maximaal {maxPerYear} bureaus per jaar")
- Other occurrences are hardcoded "20" in text (see section 3.2 above — 8 occurrences across 3 locales)

If the business ever moves to 25 or 30 agencies/year, those 8 message keys will all need manual updates. Low severity (unlikely to change), but violates SSoT principle.

---

## 13. Critical Issues — Ranked

### P0 — Stale pricing served via live chatbot (`/api/chatbot`)

**Files**:
- `src/lib/chatbot/tools/leadgen-tools.ts` (lines 85-232)
- `src/lib/chatbot/tools/concierge-tools.ts` (lines 4-56)

**Impact**: Every visitor who asks Clyde about pricing via the chat widget gets OLD v9 pricing:
- Growth quoted at €1,497/mo (actual: €2,497)
- Professional quoted at €2,997/mo (actual: €4,497)
- Enterprise quoted at €4,997/mo (actual: €7,997)
- Onboarding fees all wrong (1500/3000/5000 vs 1997/3997/5997)
- Founding credits quoted at 10,000 (actual: 8,000)
- Skill count quoted as "11" (actual: 12)
- No mention of Partner tier at all
- ROI calculator default `monthlySubscription = 1497` — gives wrong savings estimate to every user

This is a business-critical bug. A prospect who chats with Clyde, hears "€1,497/mo for Growth" and books, then sees €2,497 on the actual pricing page will (a) feel bait-and-switched or (b) mail invoice disputes. It also damages trust in the chatbot's other claims.

### P0 — Public `llms.txt` and `llms-full.txt` describe obsolete product

**Files**:
- `public/llms.txt`
- `public/llms-full.txt`

**Impact**: These files are explicitly designed to be indexed by LLMs (ChatGPT, Perplexity, Google AI Overviews). They describe:
- Wrong tier names ("Starter, Growth, Scale" — all v9, pre-pivot)
- Wrong product model (four services: chatbots, automations, voice-agents, marketing-machine — instead of 12-skill Clyde model)
- Made-up metric ("Up to 160 posts per month")
- Wrong domain references (see section 8.2)

ChatGPT/Perplexity crawling the site will answer user queries about FMai pricing with obsolete data. The `seo-geo` skill page is itself claiming "AI citation monitoring" — ironically the site's own GEO surface is polluted.

### P1 — Inconsistent contact emails

5 different addresses across 5 files. Visible to customers (contact page shows `hello@`, privacy policy shows `privacy@`, schema.org emits `info@`, chatbot suggests `contact@`). Pick one customer-facing address, document the rest as internal routing only.

### P1 — Partner "all 12 skills" claim in chatbot KB vs pricing "8 of 12"

`src/lib/chatbot/knowledge/concierge-kb.ts` line 63 + `support-kb.ts` line 29 both say Partner tier includes "all 12 AI skills" — this is false. Partner has 8 included + 2 add-on paths (static ads €97, manychat €47). Voice Agent / Video Ads / Reel Builder are genuinely not available on Partner (SKILL_CAPS = 0 with no add-on). A customer told "all 12" who then asks "how many voice minutes?" will get "0 with no path to more" — bait-and-switch.

### P2 — Header mega-menu hardcoded English

`src/components/layout/HeaderClient.tsx` lines 40-127: all skill titles, descriptions, group labels are English string literals inside the component, not translated. NL/ES visitors see an English mega-menu mixed with translated page content. Fix: move to messages/*.json under `header.skills.*`.

### P2 — Domain mismatch CLAUDE.md vs code

CLAUDE.md says `future-marketing.ai`. Code uses `futuremarketingai.com` everywhere (35+ refs in llms-full.txt alone). Resolve which one is production.

### P3 — Legal pages show "March 2026" (stale but not egregious yet)

Update to April 2026 if content has changed. If no content change, leave.

### P3 — MAX_PARTNERS_PER_YEAR not interpolated in 8 message keys

Refactor messages/*.json to use `{maxPerYear}` everywhere and drive from constants.

### P3 — ES locale currency formatting inconsistency

Some es.json strings use `"347 EUR"`, others `"347 €/mes"`, others `"347 €"`. Pick one — `NNN €/mes` matches the pricing page tiers block (line 1554+) so normalize to that.

### P3 — Voice demo hardcoded US phone number

`VoiceDemoSection.tsx` shows `+1 (570) 783-8236`. Not localized. Either confirm this is the intentional test-call number with a "US test line" label, or move behind a demoCallNumber env var.

---

## 14. All Fixes Needed — File × Line × Current × Should Be

| File | Line | Current | Should be |
|---|---|---|---|
| `src/lib/chatbot/tools/leadgen-tools.ts` | 98 | `monthlyPrice: 1497` | `347` (Partner) and add separate growth=2497 |
| `src/lib/chatbot/tools/leadgen-tools.ts` | 90 | `tier: z.enum(['growth','professional','enterprise','founding','all'])` | Add `'partner'` to enum |
| `src/lib/chatbot/tools/leadgen-tools.ts` | 97-151 | v9 tier object | Rewrite with 5 v10 tiers, import from skills-data.ts if possible |
| `src/lib/chatbot/tools/leadgen-tools.ts` | 103,116,130,144 | `'All 11 AI skills included'` | `'All 12 AI skills included'` (Growth/Pro/Ent/Founding); `'8 of 12 skills + 2 add-on paths'` for Partner |
| `src/lib/chatbot/tools/leadgen-tools.ts` | 101 | `onboardingFee: 1500` (Growth) | `1997` |
| `src/lib/chatbot/tools/leadgen-tools.ts` | 114 | `onboardingFee: 3000` (Pro) | `3997` |
| `src/lib/chatbot/tools/leadgen-tools.ts` | 128 | `onboardingFee: 5000` (Ent) | `5997` |
| `src/lib/chatbot/tools/leadgen-tools.ts` | 141 | `credits: 10000` (Founding) | `8000` |
| `src/lib/chatbot/tools/leadgen-tools.ts` | 146 | `'10,000 credits/mo'` | `'8,000 credits/mo'` |
| `src/lib/chatbot/tools/leadgen-tools.ts` | 192 | `default(1497)` | `default(2497)` |
| `src/lib/chatbot/tools/concierge-tools.ts` | 18, 30, 42 | `'from EUR 1,497/mo'` | `'from EUR 347/mo (Partner)'` or `'from EUR 2,497/mo (Growth)'` depending on skill |
| `src/lib/chatbot/tools/concierge-tools.ts` | 47, 49 | `'all 11 AI skills'` | `'all 12 AI skills'` |
| `src/lib/chatbot/tools/concierge-tools.ts` | 54 | `'From EUR 1,497/mo (Growth plan)'` | `'From EUR 2,497/mo (Growth plan)'` |
| `src/lib/chatbot/knowledge/concierge-kb.ts` | 63 | Partner `- all 12 AI skills included` | `- 8 of 12 skills included (Voice/Video/Reel not available; Static Ads + ManyChat via add-on packs)` |
| `src/lib/chatbot/knowledge/concierge-kb.ts` | 220 | `contact@futuremarketingai.com` | `hello@futuremarketingai.com` (unify) |
| `src/lib/chatbot/knowledge/support-kb.ts` | 29 | Partner `- all 12 AI skills included` | same fix as above |
| `public/llms.txt` | 17-32 | Four-service model with old tier names | Rewrite fully for v10 (12 skills + 5 tiers) |
| `public/llms-full.txt` | all | v9 product description | Rewrite fully for v10 |
| `public/llms-full.txt` | 104 | `"Up to 160 posts per month"` | Remove or replace with case-study metric ("~84 posts/month at SkinClarity Club across 3 accounts") |
| `src/lib/seo-config.ts` | 3 | `info@futuremarketingai.com` | decide: unify to `hello@` (customer-visible) or keep `info@` as ORG entity but use `hello@` in ContactPoint |
| `messages/nl.json` `legal.last_updated` | 928 | `"Laatst bijgewerkt: maart 2026"` | `"Laatst bijgewerkt: april 2026"` (if subscription_terms updated) |
| `messages/en.json` `legal.last_updated` | 928 | `"Last updated: March 2026"` | `"Last updated: April 2026"` |
| `messages/es.json` `legal.last_updated` | 928 | `"Última actualización: marzo de 2026"` | `"Última actualización: abril de 2026"` |
| `src/lib/seo-config.ts` PAGE_DATES | 31 | `/legal: '2026-03-18'` | `'2026-04-24'` |
| `src/components/layout/HeaderClient.tsx` | 40-127 | Hardcoded EN strings in `SKILL_GROUPS` | Move to `messages/*/header.skills.{social,blog,ad,reel,voice,lead,email,manychat,reporting,seo,research,clyde}.{title,description}` + `header.skills.groups.{create,engage,grow}.{label,description}` |
| `src/components/layout/HeaderClient.tsx` | 129-135 | Hardcoded `NAV_ITEMS` labels | Add to `messages/*/nav.{skills,memory,caseStudies,pricing,about}` |
| `src/components/voice/VoiceDemoSection.tsx` | 67, 93 | Hardcoded `+1 (570) 783-8236` | Move to env var `NEXT_PUBLIC_VOICE_DEMO_NUMBER` with label "US demo line" |
| `messages/*.json` lines 12, 55, 104, 512, 524, 737, 1503 | Hardcoded "20 bureaus per jaar" | Use `{maxPerYear}` interpolation driven by `MAX_PARTNERS_PER_YEAR` (or document that "20" is a frozen phrase) |
| `messages/es.json` line 853 | `"Partner (347 EUR al mes)"` | `"Partner (347 €/mes)"` to match pricing block formatting |
| `messages/es.json` line 523 | `"De Partner 347 EUR a Enterprise 7.997 EUR"` | `"De Partner 347 € a Enterprise 7.997 €"` |
| `src/components/seo/PricingJsonLd.tsx` | 13 | `"One-time onboarding EUR 497"` | Verify Partner onboarding 497 vs SSoT (matches — OK, just flagged for completeness) |

---

## 15. What's Actually Correct — Reassurance

The structural pricing surfaces — the `/pricing` page, the 5 tier blocks in messages/*.json, the SKILL_CAPS mirror, the credit/skill pack prices, the founding-member page, the SEO JSON-LD Offer schema, the legal subscription_terms, the about-page counters, the apply-page counter, the pricing-page founding counter, the case-study metrics, the skill count claims on customer-facing copy — are ALL in sync with SSoT. The content-upgrade branch landed cleanly.

The rot is in two old subsystems that were never updated for v10:

1. **Chatbot tools** (leadgen + concierge) — written for the v9 3-tier product
2. **Public `llms.txt` / `llms-full.txt`** — written for the pre-pivot 4-service positioning

These two are the entire critical-path problem. Fix them and the "do we lie to customers anywhere" question becomes a clean pass.
