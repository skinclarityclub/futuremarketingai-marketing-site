# 03 - Marketing & Conversion Audit

**Scope:** deep CRO + B2B SaaS marketing audit of the FutureMarketingAI marketing site as a lead-gen funnel. High-touch AI partnership model, NL/EU ICP, application-gated Calendly conversion (no self-service signup).

**Snapshot date:** 2026-04-24
**Tree audited:** `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs` (branch `main`, last commit 8dd6e3f).
**Primary SSoT refs:** `src/lib/constants.ts`, `src/lib/skills-data.ts`, `messages/nl.json`.

---

## Executive Summary (5 bullets)

1. **The funnel is single-CTA clean, but the hero leaks intent.** Nearly every page ends at `/apply` (good), but the homepage hero (`src/app/[locale]/page.tsx:128-138`) offers TWO CTAs of equal visual weight - primary "Plan een gesprek" ([`/apply`](#)) and secondary "Leer Clyde kennen" (`/skills/clyde`). Splitting attention in the first 800ms of attention costs roughly 20-40% of apply intents on a complex B2B landing. The secondary CTA should be demoted to a ghost text link, not a size=lg button.
2. **Founding scarcity is real but NOT credible on first read.** The "1/10 Founding plekken bezet" counter appears on 5+ pages but there is no dated context ("gestart Apr 2026", "closed 30 Sep", waitlist number). To a skeptical NL agency owner in the €1-3M band, this reads as fabricated urgency. The counter needs either a time-box OR a visible "spots taken by:" list with logos/masked names. Same for "max 20 partners per jaar" - no cohort calendar.
3. **Zero hard SKC metrics = biggest trust leak on the site.** The SKC case study (`src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx`) is narrative-rich but metric-free: "circa 21 carrousels/week" is output, not outcome. There is no revenue lift, no follower growth, no engagement delta, no cost-saved number, no before/after comparison. For a €997-€7.997/mo partnership that demands a 4-week onboarding commitment, the buyer needs a ROI anchor. Currently: none.
4. **Apply form is friction-light but information-heavy for a pre-qualification gate.** The form (`src/components/apply/ApplicationForm.tsx`) requires 8 fields including revenue band, client count, and a 20-char minimum open-text problem statement. This is appropriate for high-touch screening, BUT the form lives inside a page with no multi-step indication, no progress bar, and no preview of what the agency gets in the 30-min call beyond the 3-step expectations panel. Conversion rate on this form is very likely <20% of page visitors; with small tweaks (multi-step or split into Soft/Hard), you could lift submissions 40-80% without losing lead quality.
5. **No mid-funnel micro-conversions exist.** The site has exactly one conversion type: `/apply`. There is no lead magnet (NL agency AI playbook PDF, Clyde demo video, "AI readiness audit" quiz), no newsletter capture, no gated benchmark report, no booking calendar preview, no "save comparison" feature on pricing. For prospects not yet ready to apply (which is 95%+ of cold traffic), the site has nothing to remarket to. This is the single biggest revenue lift opportunity: introducing ONE well-positioned lead magnet could 3-5x pipeline velocity.

---

## Funnel Map (current flow + drop-off risks)

```
[Cold traffic / organic / referral / social]
           |
           v
  +-----------------+
  |  HOME  /        |  <- hero has 2 CTAs splitting intent
  |  /[locale]/      |
  +-----------------+
        |        \
        |         \-- /skills/clyde  (secondary hero CTA)
        |               |
        v               v
  Memory / Pricing / Case Study / About / How-it-works / 12 skill pages / Founding Member
        |
        v
  All paths end at: /apply  (single CTA on every page)
        |
        v
  +-----------------+
  |  /apply         |  <- single-step form, 8 fields, no progress bar
  +-----------------+
        |
        v
  POST /api/apply  ->  console.log (NO email, NO Supabase write)  [CRITICAL bug]
        |
        v
  "Aanvraag ontvangen" success screen  (no calendar link, no confirmation mail)
```

### Drop-off risk points (highest to lowest)

1. **/apply server side is broken.** `src/app/api/apply/route.ts:86` only does `console.log` and returns 200. There is no email to Daley, no CRM write, no Resend call, no Slack notification. **If this is live in production, every application since launch has been lost unless Vercel logs were harvested.** This is a data-integrity + revenue-continuity issue, not a CRO issue.
2. **No confirmation email.** Success message says "Check je inbox" (`messages/nl.json:1567`) but no email is sent. Prospects who submit will feel ghosted; some will resubmit (inflating rate), most will move on.
3. **Hero CTA split.** Home + multiple pages offer two equal-weight CTAs. The "Leer Clyde kennen" secondary route on home hero sends traffic to `/skills/clyde` which itself ends at `/apply` - but that's a 2-hop detour, and the detour is where drop-off happens.
4. **Pricing page drop-off.** 5 tiers × 10 feature bullets each = ~50 lines of feature copy before the CTA. On mobile this is scroll-heavy. No anchor nav. Pricing FAQ is at the bottom below the credit packs and skill packs; critical objection answers (overages, downgrade path) are 2000px below the pricing cards.
5. **Skill pages have weak proof.** 11 of 12 skill pages use the generic `SkillPageTemplate` with no custom demo, no video, no screenshot of actual output. Only voice-agent has an interactive demo (`VoiceDemoSection`). This tells the prospect "we wrote copy about these, but can't show you any of them work." For a €2-8K/mo commit, that's a major trust gap.
6. **Case study has no data.** See executive summary #3.
7. **No retargeting entry point.** No newsletter, no lead magnet, no gated content. Prospects who leave without applying have zero return path.

---

## Conversion Score per Page (0-10)

Scoring framework: clarity of value prop (2pts) + single dominant CTA (2pts) + objection handling (2pts) + trust/proof (2pts) + friction/length (1pt) + scarcity credibility (1pt).

| Page | Score | Reasoning |
|---|---|---|
| `/` (home) | **6.5 / 10** | Strong hero value prop ("Dit is Clyde. Jouw AI Marketing Medewerker."), clear 12-skill taxonomy, ICP anti-fit section is excellent. Loses points for split CTA, counter lacks context, stats panel uses vague values ("Persistent" as a number at line 85 is meaningless), trust strip at bottom is weak ("gebouwd met NL-bureaus in de praktijk" with 1 client named). |
| `/pricing` | **6.0 / 10** | 5 tiers clearly anchored, transparency messaging is a differentiator ("waarom onze prijzen zichtbaar zijn", `messages/nl.json:531-533`). Loses points for: no annual pricing / no discount, no "Most agencies choose Growth" visual default, no comparison between tiers (rows not columns), onboarding fee shown small and late, FAQ buried below credit packs, no cost calculator, no guarantee/trial messaging. |
| `/apply` | **6.0 / 10** | Form is well-structured with progressive disclosure (name/email first, then agency info, then commitment level). Honeypot + rate limiting good. But: no progress bar, 8 fields is heavy for step 1, tier dropdown shows 5 prices which may cause premature anchoring/dropout, no calendar embed after submit, success screen is cold. Also: server handler is a TODO (line 84). |
| `/founding-member` | **7.0 / 10** | Best-positioned page on the site. Clear anchor (€997 vs Growth €2.497 = 60% off forever, `messages/nl.json:1340`). Value prop crystal clear. Loses points for no named Founding partner visible on page (SKC is mentioned in proof section only), FAQ is solid but "wat als 10 vol zijn" should be higher, no counter updated with date of last signup. |
| `/memory` | **7.5 / 10** | Strongest differentiator page. 4-layer diagram + ChatGPT/Jasper contrast + week1 vs week12 = clean narrative. Loses points for: the comparison with ChatGPT/Jasper might be seen as straw-man (those tools DO have memory features now), no interactive demo ("see Clyde remember"), only one CTA at bottom. |
| `/how-it-works` | **6.5 / 10** | 5-step process is clear, timeline feels honest ("week 1 veel correcties"). Loses points for: no timeline image/gantt, no testimonial per step, CTA only at end, missing "what could go wrong" section that high-intent buyers look for. |
| `/case-studies/skinclarity-club` | **5.0 / 10** | Structurally excellent page (hero, setup, skills, content table, architecture, timeline, testimonial, CTA). Fails on the single thing that matters: NO METRICS. "Circa 21 carrousels/week" and "30 seconden vs 4 minuten approval time" are the only numbers. No revenue, no engagement growth, no follower delta, no CAC drop, no time saved in €. Testimonial quote is authentic but not quantified. |
| `/about` | **7.0 / 10** | Honest founder voice, timeline framing (assisted-era → autonomous-era → standard) builds urgency without being cheesy. Solo-founder positioning + capacity cap is real. Loses points for: no photo of Daley (just "D" initial), no LinkedIn/Twitter link to Daley, no proof of technical depth (no video, no podcast, no article), "evolution" framing is speculative and may turn off data-driven buyers. |
| `/contact` | **7.5 / 10** | Correctly deprioritizes itself: immediately points to `/apply` for partnership inquiries via an inline callout (line 63-80). Direct email visible. Response time expectation set. Simple and effective. |
| `/skills/*` (template) | **5.0 / 10** | Features, how-it-works, integrations, use cases, tier allocation table, CTA. Clean layout but NO PROOF per skill except voice-agent. Every skill page is essentially the same 5-section template with swapped copy. Buyer can't distinguish "you do this" from "we talk about doing this." |
| `/skills/voice-agent` | **7.5 / 10** | The only skill page with working demo. Interactive `VoiceDemoSection` + FAB is the template every other skill page should follow. |
| `/skills/clyde` | **5.5 / 10** (estimated, not inspected but uses same template) | Same issue. Orchestrator skill page should showcase the "one prompt, multiple skills executed" moment interactively. |

**Average site conversion score: ~6.3 / 10.** Well-executed on content architecture and copy; underinvested on proof, demo, and mid-funnel capture.

---

## Top 20 Conversion Leaks (ranked by estimated revenue impact)

Ranking rationale: `revenue_impact = (prospects_affected) × (lift_potential) × (buyer_stage_weight)`. Buyer-stage-weight is highest for decision-stage issues (apply form, pricing objections), lower for top-of-funnel (hero clarity).

| # | Leak | Location | Severity | Est. lift if fixed |
|---|---|---|---|---|
| 1 | `/api/apply` does not deliver applications — only `console.log` | `src/app/api/apply/route.ts:86-91` | **Critical data loss** | N/A — this is not a CRO fix, this is a "stop losing every lead" fix. Wire Resend + Supabase write. |
| 2 | No post-submit calendar embed (Calendly/SavvyCal) | `ApplicationForm.tsx:64-70` success state | Critical | +30-60% book-to-apply rate. Currently success screen says "wait 3 days for Daley to reply" — a 72h cooling period where the prospect's intent decays. Embed Calendly on success so they can self-book a slot in the same session. |
| 3 | SKC case study has zero outcome metrics | `messages/nl.json:1617-1654` (content, testimonial) | Critical | +40-80% trust score for enterprise buyers. Add: follower growth %, engagement rate change, time-saved-per-week in hours, reduction in outsourced content costs, CAC change, conversion rate delta. Without these, the case study is anecdote-grade. |
| 4 | No lead magnet / newsletter / email capture anywhere | Site-wide | High | 3-5x top-of-funnel pipeline. For agencies at 90% of the awareness stage, the site offers them nothing to take home. One gated "NL Bureau AI Readiness Checklist" (PDF) could capture 5-10% of cold traffic. |
| 5 | Founding counter lacks time-box credibility | `src/lib/constants.ts:8` (`FOUNDING_SPOTS_TAKEN = 1`), all pages | High | +15-25% founding tier conversions. Add: "1/10 plekken bezet sinds februari 2026" + "geen heropening na vol" with a date. Currently reads as a static number from a marketing playbook. |
| 6 | Pricing page: no annual/multi-year discount | `src/app/[locale]/(marketing)/pricing/page.tsx`, `messages/nl.json:539-636` | High | +10-20% ACV. For a subscription product the annual-prepay discount (typically 10-20%) is both a revenue lever and a commitment signal. Missing entirely. |
| 7 | Pricing page: no "most agencies choose" default highlight | `pricing/page.tsx:39` has `professional: { highlighted: true, badge: 'popular' }` but visual dominance is weak | High | +15-30% concentration on Professional tier. Make the Pro tier 20% wider, add a subtle elevated shadow, pre-tick the "recommended" radio. |
| 8 | Hero split CTA on home | `src/app/[locale]/page.tsx:128-138` | High | +15-25% apply clicks from home. Demote secondary to text link. |
| 9 | No sticky/mobile CTA bar | Site-wide. Only `VoiceDemoFAB` exists, which is skill-specific | High | +20-40% mobile conversions. For pages like `/memory`, `/case-studies/*`, `/pricing`, a sticky "Plan een gesprek" bar after 50% scroll would recover scroll-abandon intent. |
| 10 | Skills pages (11/12) have no demo, screenshot, or video proof | `SkillPageTemplate.tsx` — only voice-agent has custom proof | High | +25-50% skill-to-apply conversion. Each skill page should have ONE artifact: a screenshot of actual output, an embedded 30-sec Loom, a sample carrousel, a sample email classification, etc. |
| 11 | Case study is the ONLY case study | `src/app/[locale]/(marketing)/case-studies/` has only `skinclarity-club/` | High | +20-40% cross-vertical credibility. Even a "pilot result" from 2-3 other contexts (partner tier solo, growth tier 5-client agency) would defuse the "SKC only works because Daley co-built it" objection. |
| 12 | No founder video on /about | `messages/nl.json:517-518` has bio, page has initial "D" only | Medium-high | +10-20% apply rate. A 60-90 second founder video on /about would double trust. For a €997-€7.997/mo commitment with a solo-operator, "who is Daley" needs a face and voice, not an initial in a circle. |
| 13 | No social proof logos / visible partner list | Footer has social icons only; no client logos anywhere | Medium-high | +15% hero trust. Even a "1 Founding partner: SkinClarity Club" logo strip with "9 plekken open" below the fold would quantify the scarcity better. |
| 14 | Pricing FAQ is buried below credit packs and skill packs | `pricing/page.tsx:286-307` is section 5 of 7 | Medium | +8-12% pricing-to-apply rate. Move critical-objection FAQ (overages, downgrade, 12 skills) ABOVE credit packs. Credit packs are a upsell-once-committed concept, not a pre-sales concern. |
| 15 | No comparison tables (vs DIY Make.com, vs hiring, vs other agencies) | Site-wide | Medium | +10-20% competitive-buyer conversion. Memory page has `contrast.chatgpt/jasper/clyde` (`memory/page.tsx:28`) which is the right pattern, but it needs to extend to "vs building it yourself with n8n + GPT" and "vs hiring an AI specialist." |
| 16 | Apply form has no progress indication, no multi-step, no save-draft | `ApplicationForm.tsx` | Medium | +10-25% submission rate. Even a simple "Stap 1 van 3: Jouw bureau" header would lower perceived effort. |
| 17 | No pricing-tier pre-filter from skills page | Skills pages mention tier caps but don't pre-select a tier in the apply form | Medium | +5-10% form completion. When someone clicks "Apply" from `/skills/voice-agent`, the form should pre-fill `tier=growth` (since voice is only from Growth up). |
| 18 | Header CTA color is gradient not solid — low contrast on some backgrounds | `HeaderClient.tsx:338-343` uses `from-[#F5A623] to-[#0ABAB5]` | Low-medium | +3-5% global CTA clicks. Solid orange (#F5A623) performs better on dark backgrounds than a gradient that muddies in the middle. |
| 19 | `/memory` page lacks a "try it" interactive element | `memory/page.tsx` — all static cards | Low-medium | +10% memory-to-apply on this high-intent page. A fake-but-convincing "ask Clyde about a brand he remembers" mini-demo would prove the USP. |
| 20 | No testimonial on homepage | Home only has `trustStrip` at bottom linking to SKC case study | Low-medium | +5-10% scroll-to-FAQ conversion. One pull-quote from Sindy on the home page above the fold would do more than all 6 trust badges combined (`messages/nl.json:93-101`). |

---

## Objection Coverage Matrix

Rows = the 7 B2B objections every agency has before committing to a €2-8K/mo partnership. Columns = pages where the objection is addressed. "Y" = addressed well, "w" = weakly/implicitly addressed, "-" = not addressed.

| Objection | Home | Pricing | Apply | Founding | Memory | HIW | About | Case Study | Skill pages |
|---|---|---|---|---|---|---|---|---|---|
| **Price too high / ROI unclear** | w (price hint in CTA subtitle) | Y (5 tiers, transparency, credit packs) | - | Y (€997 vs €2.497 anchor) | - | - | - | - (no metrics) | w (tier table shown) |
| **Trust / is this real / who is Daley** | w (1 client mention) | - | - | w (SKC only) | - | - | Y (founder bio) | Y (testimonial) | - |
| **Scope creep / will they actually deliver** | w (ICP) | - | - | - | - | Y (5 steps, 4-week onboarding) | - | Y (timeline narrative) | - |
| **Lock-in / data ownership / exit** | Y (FAQ q2, infra badges) | w (FAQ q3 downgrade) | - | - | - | - | Y (infra section) | - | - |
| **Onboarding too slow / disruptive** | Y (4-week onboarding in trust section) | - | Y (expectations panel) | Y (€0 onboarding as benefit) | - | Y (step 2, 4 weeks) | - | Y (timeline week1 → now) | - |
| **ROI / when do I see results** | - | - | - | - | Y (week1 vs week12) | w (improvement step) | - | w ("maand 1 eerste content week", no metric) | - |
| **Custom vs off-the-shelf / why you vs DIY with GPT / n8n** | Y (trust: custom-built, no platform, founder access) | - | - | - | Y (ChatGPT/Jasper contrast) | - | w (infra: self-hosted n8n) | - | - |

### Gap summary

- **"Why you vs DIY with GPT/Make.com/n8n"** is only partially addressed on `/memory` and implicitly on `/about`. This is THE objection for every agency owner who has played with GPT in 2024-2026. Needs a dedicated comparison page OR a strong section on `/how-it-works` or `/about`.
- **ROI / payback period** is almost entirely absent. No page answers "when is this profitable for me?" Pricing page hints at value but never pencils it out. A simple ROI calculator would be a high-lift conversion tool.
- **Case study is the ONLY proof of "this actually works"** and it has no metrics. Double-weakness.
- **Pricing objections** (what if I go over credits, what if I downgrade, what if I want to pause) are in the FAQ but buried. The overage logic (`messages/nl.json:717-720`) is actually excellent — it deserves a dedicated "What if" card on the pricing page.

---

## Trust / Proof Gap Analysis

**Current proof inventory:**

| Proof type | Present? | Location | Quality |
|---|---|---|---|
| Named client | 1 (SkinClarity Club) | Home trust strip, pricing CTA secondary, founding proof section, case study page | Good but single-client |
| Testimonial | 1 (Sindy, SKC founder) | Case study only — not on home | Good quote, but single |
| Client logos | 0 | — | **Missing** |
| Named partners/integrations | 9 in mega-menu | Header mega-menu shows integrations implicitly via skill names | Weak — no logos |
| Metrics / numbers | Vague ("circa 21", "3 accounts", "4 merken") | Case study + homepage stats | **Weak — no revenue, no growth %, no time saved in hours/€** |
| Founder credibility | Text bio, no photo, no LinkedIn | /about | **Medium — needs face + social proof links** |
| Video | 0 (Voice demo plays audio, not video) | — | **Missing** |
| Screenshots / product shots | Spline 3D robot only | Hero | **Missing actual product UI** |
| Compliance badges | AVG, EU AI Act, self-hosted, no lock-in | Home + about + pricing | Good but no actual certification body |
| Press / media / podcasts | 0 | — | **Missing** |
| G2 / Capterra / Trustpilot reviews | 0 | — | **Missing (appropriate for early-stage, but not ignorable)** |

### Specific prescriptions

1. **Add client logo strip** on home below stats: "1 Founding partner:" with SKC logo + 9 gray placeholder boxes with "Open — Apply for spot 2". Turns scarcity into visual art.
2. **Add founder photo + LinkedIn link** on `/about` and in apply form's expectations panel ("Daley leest je aanvraag persoonlijk" + face).
3. **Add 1 metric per skill page**: each skill page should claim ONE specific outcome from SKC, e.g. Social Media: "SKC: 21 carrousels/week autonomously = ~84h/month saved vs in-house agency rate €95/h = €7.980/mo value."
4. **Add 60-90s founder intro video** on `/about` + `/apply` hero.
5. **Build a minimum of 2 additional case-study vignettes** (even anonymized): "Agency X, 8 FTE, Growth tier, 3 brands — outcome after 12 weeks." Lack of multiple cases is the #1 barrier for the Growth/Professional tier sale.

---

## CTA Audit

### Inventory of all user-facing CTAs

| # | Location | Label (NL) | Href | Variant | Above/below fold | Quality |
|---|---|---|---|---|---|---|
| 1 | Header desktop nav | "Plan een gesprek" | `/apply` | Gradient btn | Above fold (sticky) | 8/10 — good placement, weak contrast (gradient) |
| 2 | Header mobile nav | (login only) | — | — | Above fold | **Missing apply CTA on mobile nav!** — `HeaderClient.tsx:438-448` only has login link in mobile menu |
| 3 | Mega-menu footer | "Apply — Book a partnership call" | `/apply` | Inline link | Dropdown | 6/10 — English (should be NL), good positioning |
| 4 | Home hero primary | "Plan een gesprek" | `/apply` | Primary lg | Above fold | 8/10 — clear, iconed |
| 5 | Home hero secondary | "Leer Clyde kennen" | `/skills/clyde` | Secondary lg | Above fold | 4/10 — **splits intent, same visual weight** |
| 6 | Home services final | "Leer Clyde kennen" | `/skills/clyde` | Primary lg | Below fold | 5/10 — redundant with hero secondary |
| 7 | Home services final 2 | "Bekijk Founding tier" | `/founding-member` | Secondary lg | Below fold | 7/10 — good cross-sell |
| 8 | Home final CTA | "Plan een gesprek" | `/apply` | Primary lg | Below fold | 8/10 |
| 9 | Home final CTA 2 | "Lees SkinClarity case" | `/case-studies/skinclarity-club` | Secondary lg | Below fold | 7/10 — appropriate at end |
| 10 | Home trust strip | "Bekijk de SKC case study →" | Link | Text link | Below fold | 7/10 |
| 11 | Pricing tier cards (5x) | "Plan een gesprek" | `/apply` | Primary | — | 7/10 — clear but every tier has identical CTA (no personalization per tier) |
| 12 | Pricing final CTA | "Plan een gesprek" + "Lees SkinClarity case" | `/apply` + `/case-studies/...` | Primary + Secondary lg | Below fold | 8/10 |
| 13 | Founding-member final | "Plan een gesprek" | `/apply` | Primary lg | Below fold | 8/10 |
| 14 | Founding-member proof | "Lees SkinClarity case study" | `/case-studies/...` | Secondary md | Below fold | 7/10 |
| 15 | Memory final | "Plan een gesprek" | `/apply` | Primary lg | Below fold | 7/10 — single CTA good, but one on a long page is thin |
| 16 | How-it-works final | "Plan een gesprek" | `/apply` | Primary lg | Below fold | 7/10 |
| 17 | About final | "Boek een strategiegesprek" + "Neem contact op" | `/apply` + `/contact` | Primary + Secondary lg | Below fold | 6/10 — two CTAs, "Neem contact op" is a softer alternative for lower-intent |
| 18 | Contact apply callout | "Plan een gesprek" | `/apply` | Inline btn | Above fold | 9/10 — excellent soft redirect |
| 19 | Contact book-demo card | "Plan een gesprek" (`booking.title` btn) | `/apply` | Primary | — | 8/10 |
| 20 | Case study final | "Plan een gesprek" | `/apply` | Primary lg | Below fold | 8/10 |
| 21 | Skill pages (12x) hero | "Plan een gesprek" | `/apply` | Primary lg | Above fold (below hero) | 7/10 — good, but missing from hero; below subtitle |
| 22 | Skill pages (12x) final | "Plan een gesprek" | `/apply` | Primary lg | Below fold | 7/10 |
| 23 | Footer resources | "Apply" (highlighted) | `/apply` | Accent text link | Below fold (footer) | 7/10 |
| 24 | Voice demo FAB | Custom demo trigger | — | Floating btn | Fixed on screen | 9/10 — only skill page with persistent interactive CTA |

### CTA scoring summary

- **CTA consistency: 9/10** — nearly every CTA routes to `/apply`, label discipline is tight ("Plan een gesprek" is the canonical phrase).
- **CTA variety: 5/10** — 95% of CTAs lead to one place. Zero low-friction alternatives (newsletter, demo video, downloadable content).
- **Mobile CTA: 4/10** — no sticky mobile CTA, mobile nav menu has no Apply button visible after the hamburger opens.
- **Hero CTA discipline: 5/10** — home + about have split CTAs of equal weight; skill pages are cleaner (single CTA).
- **Above-fold CTA presence: 8/10** — every page has a CTA visible without scroll.

### Recommendations

1. Add an Apply button to the mobile nav's expanded state (`HeaderClient.tsx:438` — add a CTAButton next to the login link in the mobile drawer).
2. Demote home hero secondary CTA from `size=lg` button to inline text link or `size=sm ghost`.
3. Add per-tier CTA labels on pricing: "Start as Partner", "Book Growth call", "Request Professional demo", etc. Generic "Plan een gesprek" on every tier wastes the intent signal.
4. Add a sticky bottom-bar CTA on long pages (memory, pricing, case study) that appears after 50% scroll.

---

## Pricing Page Deep-Dive

### What's working

- **5 tiers visible + prices visible** with an explicit transparency section (`messages/nl.json:531-533`) — this is a differentiator in the "contact us for pricing" high-end AI agency market.
- **Founding tier as anchor** — €997 at 60% of Growth creates a compelling scarcity story.
- **Skills × Tier Matrix** (`SkillsTierMatrix`) — specific cap per skill per tier is rare and good for sophisticated buyers.
- **Credit packs as progressive upsell** — Partner Top-Up €39 → Unlimited €697 provides upgrade path without forcing tier jump.
- **Skill-specific packs** — Voice Minutes, Video Ads, etc., allows low-tier users to flex without full upgrade.
- **Onboarding fee visible** at each tier — uncommon transparency.

### What's missing / broken

1. **No annual discount.** Every SaaS at this ACV offers 10-20% off annual prepay. Missing = leaving money + commitment on table.
2. **No "Most agencies choose X" visual anchor.** Professional is marked `highlighted` in code (`pricing/page.tsx:39`) but the visual weight doesn't dominate — same card width, same font size, subtle "Most popular" badge only.
3. **No comparison table / feature matrix view.** 5 tiers with 8-10 features each in card form = cognitive overload. A secondary "compare all features" collapsible matrix would help decision-stage buyers.
4. **No ROI / value calculator.** A simple "we save you X hours/week = €Y/month" widget tied to agency size would convert skeptics into math-believers.
5. **No guarantee / trial / risk reversal.** Zero mention of money-back, pilot period, opt-out clause. For a €2.5-8K/mo + €2-6K onboarding commit, the risk reversal is the single biggest lever.
6. **Onboarding fee is shown too small.** "Eenmalige onboarding: €1.997" (`pricing/page.tsx:153-155`) is text-xs text-muted — buyers will miss it on first read and be surprised later. Either make it prominent OR fold it into a "First 4 weeks (setup): €X" combined fee.
7. **"Add-on paden" on Partner tier** (e.g., `features_6: "Statische ads via add-on (€97 voor 15 per maand)"`) is confusing. Add-ons should be a separate tab, not crammed in the Partner feature list.
8. **FAQ position is wrong.** Critical objection FAQ is section 5 of 7, below credit packs. Move pricing FAQ to immediately below tier cards.
9. **No currency toggle.** Site is NL/EN/ES but prices are always EUR. ES and EN markets might expect €/£/$.
10. **No "Start with Founding while 9 spots are open" banner at the top of pricing.** This is the highest-margin tier with scarcity built in — it should dominate top-of-page, not be card 5 of 5.

### Suggested restructure

```
SECTION 1: Hero  (title, description, counter)
SECTION 2: Founding tier spotlight  (NEW — 9/10 plekken open, €997 vs €2.497, lifetime)
SECTION 3: 5 tier cards  (Partner / Growth / Pro [highlighted + wider] / Enterprise / Founding)
SECTION 4: FAQ — critical objections  (MOVED UP from section 5)
SECTION 5: Comparison matrix  (NEW — collapsible "vergelijk alle features")
SECTION 6: ROI calculator  (NEW)
SECTION 7: Why prices visible  (Keep — transparency section)
SECTION 8: Credit packs  (Keep, move lower — post-commit upsell)
SECTION 9: Skill-specific packs  (Keep, move lower)
SECTION 10: Final CTA  (Keep)
```

---

## Apply Form UX Review

### Current form structure

Fields (8): name, email, agency, role, revenue dropdown (5 bands), clientCount dropdown (5 options), tier dropdown (6 options), problem textarea (min 20 chars). Plus hidden honeypot.

### Friction points (ranked)

| # | Friction | Severity | Fix |
|---|---|---|---|
| 1 | **Single-step form with 8 fields = wall of work** | High | Split into 2 steps: Step 1 = name + email + agency (3 fields, "Continue"); Step 2 = role + revenue + clientCount + tier + problem (5 fields, "Submit"). Reduces psychological weight, locks the email on step 1 for retargeting even if they abandon step 2. |
| 2 | **Tier dropdown shows 5 prices, causing premature anchoring** | Medium-high | Rephrase tier question as "Welke maat klantportfolio heb je nu?" (solo / 1-5 / 5-15 / 15+ / Founding interest / geen idee) — let the conversation determine tier, not the form. |
| 3 | **No progress indicator** | Medium | Add "Stap 1 van 2" or a progress bar. Perceived-effort lever. |
| 4 | **Problem textarea min 20 chars is too short to be useful, too long to skip** | Medium | Either: (a) require min 50 + 2 specific sub-prompts ("wat is het grootste bottleneck?" + "welke tool(s) heb je geprobeerd?"), or (b) make it optional with a "skip and we'll ask on the call" option. |
| 5 | **Success state is cold** | Medium-high | Replace `SuccessBody` with Calendly embed: "Boek direct een slot in Daley's agenda" — converts passive wait into active booking. |
| 6 | **No email sent to applicant (confirmation bug)** | Critical | See leak #1 above — `/api/apply` route doesn't send email. |
| 7 | **No email sent to Daley** | Critical | Same root cause. |
| 8 | **Form has no inline validation** (only submit-time validation) | Low | Zod schema only runs onSubmit. Inline validation on blur for email format would reduce failed submits. |
| 9 | **Expectations panel could be more selling** | Low | Current 3 steps are process-focused. Add a 4th: "What you get (even if no match): a 5-minute AI strategy review as part of the call." Adds value-on-fail to lower apply anxiety. |
| 10 | **No "who else applied" / anchor** | Low | "12 bureaus aangemeld deze maand — 3 kregen een call." Provides social proof + frequency signal. |

### Quick-win rewrite of success state

```tsx
// Current: cold confirmation
<h3>Dank je. Aanvraag ontvangen.</h3>
<p>Daley leest je aanvraag persoonlijk en antwoordt binnen 3 werkdagen.</p>

// Proposed: active booking
<h3>Aanvraag binnen. Sneller verder? Boek direct een slot.</h3>
<CalendlyInlineWidget url="https://calendly.com/daley/fmai-intake" />
<p className="text-xs">Of wacht op Daley's persoonlijke reactie binnen 3 werkdagen.</p>
```

---

## A/B Test Hypotheses (ranked by expected lift)

| # | Test | Hypothesis | Expected lift | Duration to stat-sig |
|---|---|---|---|---|
| 1 | **Replace success screen with Calendly embed** | Active booking > passive wait. Converts 30-60% of applicants into booked calls in-session. | +30-60% books/apply | 2-3 weeks |
| 2 | **Demote hero secondary CTA on home** | Single dominant CTA outperforms split CTAs in B2B. | +15-25% apply/home-visit | 3-4 weeks |
| 3 | **Add sticky mobile CTA after 50% scroll** | Mobile users scroll-abandon intent; sticky recovers it. | +20-40% mobile apply | 2-3 weeks |
| 4 | **Multi-step apply form (2 steps instead of 1)** | Perceived effort reduction lifts completion. | +10-25% form completion | 3-4 weeks |
| 5 | **Add 1 outcome metric to SKC case study** | Concrete number (e.g., "€7.980/mo saved") anchors buyer math. | +20-40% case-study-to-apply | 4-6 weeks (case study is lower-traffic) |
| 6 | **Add founder video on /about + /apply hero** | Face + voice of solo founder lifts trust at decision stage. | +10-20% apply | 4 weeks |
| 7 | **Pre-fill tier based on skill page source** | Reduces form decisions, signals personalization. | +5-10% form completion from skills traffic | 3-4 weeks |
| 8 | **Move pricing FAQ above credit packs** | Objection-handling before upsell lifts decisions. | +8-12% pricing-to-apply | 3 weeks |
| 9 | **Add "Most agencies choose Professional" visual dominance** | Default anchor lifts ACV mix. | +10-20% concentration on Pro tier | 4-6 weeks |
| 10 | **Add 1 lead magnet (NL Bureau AI Readiness PDF) on home + blog** | Cold traffic that won't apply today should leave an email. | +3-5x newsletter signups (separate metric, not apply) | 4-6 weeks |

---

## Strategic Repositioning Suggestions

Most of the site's positioning is solid and doesn't need rework. These are targeted recommendations only:

### 1. Reposition "Clyde" from product name to character

Currently Clyde is named like a product ("AI Marketing Medewerker Clyde"). Lean further into the character: give Clyde a visual identity (not just the Spline robot — a distinct portrait, signature, personality), let Clyde have a voice in the site copy ("Clyde says: I noticed you're on the voice agent page. Want to hear me?"). Turning a product into a character is a durable differentiator in a commodity AI market.

### 2. Double down on "high-touch, low-volume" as the category

The site flirts with enterprise-SaaS patterns (5 tiers, credit economy, API access). But the USP is actually the opposite: "Premium AI partnership. Max 20 bureaus per jaar. Daley persoonlijk." This is closer to a boutique consultancy + automation product hybrid. Sharpen this: add a "Why we're not a SaaS" section somewhere prominent. Counter-positioning against OpenAI + Jasper + Make.com "build it yourself" message needs amplification.

### 3. Build a "Clyde for Solo" sub-brand for the Partner tier

At €347/mo, Partner tier is a different buyer than Growth/Pro/Enterprise. A solo consultant doesn't need "portfolio management across 5 workspaces." The Partner tier is buried as "tier 1 of 5" but could be split into its own micro-site or prominent section: "Solo? Start with Partner." This opens up a 10x larger addressable market (NL solo marketing consultants) with minimal content change.

### 4. Make the SKC case study into a living document

Currently the case study is static. Turn it into a "live" page: "SKC this week: 23 carrousels, 4 blogs, 2 ads published. Last updated 2 days ago." A weekly-refreshed data widget powered by actual n8n output would be a moat no competitor can fake.

### 5. Introduce a "founding story" content series

Daley's NL background + solo-operator lens is a genuine asset. Currently expressed only on /about. A 3-post blog series ("Why I'm not building a SaaS", "How SKC became founding partner", "The memory architecture behind Clyde") would give LinkedIn-native content + SEO + retargeting fuel — all from assets that already exist in Daley's head.

---

## Final Scoreboard

| Category | Score | Biggest leverage move |
|---|---|---|
| Funnel clarity | 8/10 | Demote home hero secondary CTA |
| Hero conversion | 7/10 | Single dominant CTA, founder face |
| Objection handling | 6/10 | Build DIY/Make.com comparison page + ROI calculator |
| Trust signals | 5/10 | Add metrics to SKC case, founder video |
| Scarcity & urgency | 6/10 | Date-stamp the 1/10 counter |
| Pricing page | 6/10 | Annual discount + move FAQ up + visual anchor Pro tier |
| Skill pages | 5/10 | Add 1 proof artifact per skill |
| Case studies | 5/10 | Add outcome metrics |
| Apply form UX | 6/10 | Multi-step + Calendly embed |
| Micro-conversions | 2/10 | Add first lead magnet |
| Navigation | 8/10 | Add Apply button to mobile drawer |
| Footer | 7/10 | Solid — minor gaps |
| Mobile conversion | 5/10 | Sticky CTA + mobile nav Apply button |
| Competitive positioning | 6/10 | Dedicated "vs DIY" + "vs other agencies" page |
| Memory USP | 7/10 | Add interactive demo |

**Overall weighted conversion maturity: ~6.0 / 10.** Strong content architecture and messaging. Underbuilt on proof artifacts, mid-funnel capture, and post-submit automation. The single highest-leverage fix is **wiring the /api/apply route to actually deliver applications + embedding Calendly on the success state** — this is not a CRO gain, it's stopping revenue leakage.

---

**End of audit.**
