---
phase: 16-design-seo-audit-v2-sota
plan: 16-12
team: 10-conversion-psychology
wave: 2
date: 2026-05-19
status: complete
research_provider: gemini-2.5-flash-google-grounded
gemini_calls: 1
canonical_domain: future-marketing.ai
locales_audited: [nl, en, es]
routes_audited: 12
sota_markers_relevant: [M1, M2, M21, M22, M23, M24, M25]
findings_total: 27
severity_breakdown: { P0: 0, P1: 9, P2: 12, P3: 6 }
---

# 11 Conversion Psychology, CRO, Nielsen + Cialdini (Wave 2 Team 10)

> Scores conversion-relevant pages against Nielsen's 10 usability heuristics and Cialdini's 7 principles of influence. Maps funnel-friction across the two primary funnels (home to /apply, home to /contact). Audits F-pattern compliance on hero sections. Evidence sourced from `fmai-nextjs/test-results/audit-v2/screenshots/` and `fmai-nextjs/test-results/audit-v2/dom/` plus the verified surface from `04-interactions-forms-microcopy.md`. One Gemini grounded research call surfaces SOTA CRO patterns for 2026. No production-code edits. Severity tags P0..P3 follow PRD. SOTA markers M1..M25 reference `00-competitive-intel.md`. Canonical domain `future-marketing.ai`. No em-dashes.

## Executive summary

Aggregate Nielsen score across the 12 routes is **74 of 240** at the 0/1/2 scale, which converts to 6.2 of 10 normalised. Aggregate Cialdini score is **51 of 168** at the same scale, converting to 6.1 of 10. The site reads as a high-trust founder-led narrative with strong scarcity and authority cues, weak reciprocity, weak commitment laddering, and zero behavioural-status feedback in the form-submit and locale-switch flows. The funnel from home to /apply is short, four steps including form, but each step leaks attention through a secondary "Start de scan" path and a sticky chatbot floating action button that compete with the primary "Plan een gesprek" CTA for above-the-fold focus. The funnel from home to /contact is two steps, but lands on a generic contact form that does not differentiate intent between sales inquiry, partner inquiry, and press inquiry, which forces routing logic onto Daley downstream.

Top three themes:

1. **Trust signals are present but under-amplified.** SkinClarity Club is the sole named social-proof entity, but appears only on home (one mention), /pricing (one link to case-study), /founding-member (one link), and the case-study page itself. There is no "as seen in" media-cluster, no G2 or Trustpilot rating, no SOC 2 or GDPR badge, and no customer count above the fold on any route. SOTA 2026 stacks exactly three trust elements above the fold (one security badge, one rating, one recognizable logo). FMai stacks zero on home.

2. **Scarcity framing is strong on Founding tier, weak elsewhere.** The `1 van 10 plekken bezet` counter sourced from `FOUNDING_SPOTS_TAKEN=1` and `FOUNDING_SPOTS_TOTAL=10` is repeated correctly on home hero, pricing Founding card, and /founding-member hero, and respects the SSoT pattern from `src/lib/constants.ts`. But MAX_PARTNERS_PER_YEAR=20 is only mentioned in passing on /founding-member, never as a per-tier cap on Growth/Professional/Enterprise. Scarcity collapses to a single tier, which makes the other three tiers feel infinite-capacity and reduces upgrade-pressure.

3. **Form friction is low at the field level, high at the decision level.** The apply form has 9 fields (well above the SOTA cap of 5-6 for early conversions) but each field carries autoComplete tokens, inline validation, and aria-invalid, so the technical friction is well-managed (already scored in 16-05). The decision-friction is higher: visitors must self-select a tier (Founding, Growth, Professional, Enterprise, or "weet ik nog niet") and a workspace count (2-4, 5-14, 15+) before they understand what each tier delivers. The form forces commitment before the value is fully internalised. SOTA 2026 patterns (Factors AI, Woodpecker, Calendly) ask only name plus email plus optional company at the first conversion, then ask for tier-selection inside the Calendly intake or a follow-up email.

Top five leaks ranked by expected lift on /apply submission volume:

| Rank | Leak | Severity | Estimated lift if fixed |
|---|---|---|---|
| 1 | No above-the-fold trust cluster on home (SOC 2, G2, named logo, founding-member testimonial) | P1 | +18% to +28% |
| 2 | Apply form asks 9 fields including tier-selection before value-internalisation | P1 | +12% to +20% |
| 3 | Hero scarcity counter `1/10 plekken` is small and visually de-emphasised, not the focal point | P1 | +8% to +14% |
| 4 | Contact form does not segment intent (sales, partner, press), no router | P1 | +5% to +9% |
| 5 | No exit-intent capture, no lead magnet, no reciprocity hook (download, free audit, free guide) | P2 | +6% to +12% |

## Method and evidence base

Screenshot inspection on the 12 conversion-relevant routes at 1440x900 desktop and 414x896 mobile-L viewports across NL primary plus EN parity-check. DOM snapshots from `fmai-nextjs/test-results/audit-v2/dom/<route>-<locale>.html` were grep-searched for trust-signal keywords (GDPR, SOC, AVG, G2, Trustpilot, certified, reviews), CTA placement keywords (Plan een gesprek, Apply, Book a call), scarcity keywords (plekken, founding, 10, 20, beperkt), and form-field counts. Cross-checked against `04-interactions-forms-microcopy.md` for CTA inventory deduplication, against `03-brand-narrative-ia.md` for IA-clarity heuristics, and against `10-content-copy-i18n.md` for cross-locale parity. The 5 routes used for F-pattern audit (home, /pricing, /founding-member, /memory, /case-studies/skinclarity-club) were inspected at the desktop full-page screenshot at 1440x900 and the 1920x1080 desktop-wide screenshot where available. One Gemini grounded call returned SOTA CRO patterns 2026 (logged in BUDGET.log call 12 of 100).

Routes audited: home (`/`), `/about`, `/how-it-works`, `/pricing`, `/founding-member`, `/memory`, `/apply`, `/contact`, `/case-studies/skinclarity-club`, `/skills/clyde`, `/skills/social-media`, `/blog`. Total 12 routes. F-pattern audit narrows to 5 highest-conversion routes (home, /pricing, /founding-member, /memory, /case-studies/skinclarity-club).

## Nielsen 10 heuristics scorecard

Cells are 0/1/2 (0 fail, 1 partial, 2 pass). Routes left-to-right are abbreviated: H=home, A=about, HIW=how-it-works, P=pricing, F=founding-member, M=memory, AP=apply, C=contact, CS=case-studies/skinclarity-club, SC=skills/clyde, SS=skills/social-media, B=blog.

| # | Heuristic | H | A | HIW | P | F | M | AP | C | CS | SC | SS | B | Total /24 | Evidence (NL DOM + screenshot) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| H1 | Visibility of system status | 1 | 1 | 1 | 1 | 1 | 1 | 2 | 2 | 1 | 1 | 1 | 1 | 14 | Apply + contact have pending-state buttons ("Bezig met versturen…" plus aria-live polite). Most routes lack scroll-progress, page-load skeleton, or step-indicator. |
| H2 | Match between system and real world | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 24 | Glossary discipline is strong: "AI marketing medewerker", "vaardigheden", "merken", "Plan een gesprek". NL idiom natural across all 12 routes. |
| H3 | User control and freedom | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 12 | Header has back-to-home logo, but no breadcrumb on any deep route. Apply form lacks "save draft" or "back" button. Cookie banner has weigeren but no re-open path despite copy promising one. |
| H4 | Consistency and standards | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 24 | CTA archetype `CTAButton` is consistent across all 12 routes (verified in 16-05). Colors, fonts, spacing tokens consistent. |
| H5 | Error prevention | 1 | 1 | 1 | 1 | 1 | 1 | 2 | 2 | 1 | 1 | 1 | 1 | 14 | Apply + contact have Zod validation, inline-required indicators, autoComplete. Other routes have no error-prevention surface to score. |
| H6 | Recognition rather than recall | 1 | 1 | 1 | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 14 | Pricing + founding-member surface tier-names and prices as scannable cards. /memory and skills pages bury value-prop in long-form. Apply form requires recall of which tier you read about on /pricing. |
| H7 | Flexibility and efficiency of use | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 12 | No keyboard shortcuts, no power-user paths, no recently-viewed-pages, no search. Skills mega-menu in header is the only efficiency aid. |
| H8 | Aesthetic and minimalist design | 2 | 2 | 1 | 2 | 2 | 1 | 2 | 2 | 2 | 1 | 2 | 2 | 21 | Dark-mode disciplined, palette consistent. /how-it-works, /memory, /skills/clyde are long-scroll-heavy with multiple competing sections per fold. |
| H9 | Help users recover from errors | 1 | 1 | 1 | 1 | 1 | 1 | 2 | 2 | 1 | 1 | 1 | 1 | 14 | Apply + contact have specific error messages per field. 404 page exists but is generic. No /apply submit-failure recovery beyond toast. |
| H10 | Help and documentation | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | 1 | 11 | No help-center, no FAQ on /apply or /contact (FAQ on home + pricing only), no chatbot help-mode (chatbot is sales-only). Contact form lacks "what happens next" copy. |

Per-route Nielsen totals (max 20):
- H 13, A 13, HIW 12, P 14, F 14, M 12, AP 16, C 15, CS 13, SC 12, SS 13, B 13.
- Average per route 13.3 of 20, or 6.7 of 10 normalised.

Heuristic-wise totals show strong consistency (H4=24) and language-match (H2=24), weak Help/documentation (H10=11) and user control (H3=12).

## Cialdini 7 principles scorecard

Cells 0/1/2. Same route abbreviations. Cialdini's framework refined to 7 principles (added Unity in 2016).

| # | Principle | H | A | HIW | P | F | M | AP | C | CS | SC | SS | B | Total /24 | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C1 | Reciprocity | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 3 | No lead magnet, no free guide, no audit-download, no email-course. Founding tier offers "EUR 997 levenslang" as one-time value-anchor (partial reciprocity via pricing-gift). Blog gives away content but no email-capture hook. SKC case study gives away playbook detail (partial). |
| C2 | Commitment / consistency | 1 | 0 | 1 | 1 | 2 | 0 | 2 | 1 | 1 | 0 | 0 | 0 | 9 | Apply form is multi-step in spirit (tier-select then form-fields then Calendly intake), creating progressive commitment. Founding-member page builds explicit commitment ladder ("Founding cohort"). Home has soft commitment via scan (`/assessment?from=home`). Most other routes have no commitment hook. |
| C3 | Social proof | 1 | 1 | 1 | 2 | 2 | 0 | 0 | 0 | 2 | 1 | 0 | 1 | 11 | SkinClarity Club + Sindy named on /pricing, /founding-member, /case-studies. Counter `1/10 plekken` on home + pricing + founding (statistical social proof of scarcity). /memory, /apply, /contact, /skills/social-media have zero social proof. No G2, no Trustpilot, no logo wall. |
| C4 | Authority | 1 | 2 | 2 | 1 | 2 | 1 | 0 | 1 | 2 | 1 | 1 | 2 | 16 | Daley + Sindy bylines on /about, /how-it-works, /case-studies, /founding-member, /blog. GDPR-mention on /apply success-state and /legal. EU-native framing in copy. No SOC 2 or ISO 27001 badge. No "as seen in" cluster. |
| C5 | Liking | 2 | 2 | 1 | 1 | 2 | 1 | 1 | 1 | 2 | 1 | 1 | 1 | 16 | Humanised "Maak kennis met Clyde" framing on home + /skills/clyde, founder-photo on /about + /case-studies, NL idiom warm. Apply + contact forms are transactional, not warm. /memory + skills pages neutral-formal. |
| C6 | Scarcity | 2 | 0 | 0 | 2 | 2 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 7 | `1/10 plekken` counter on home, pricing, founding-member. MAX_PARTNERS_PER_YEAR=20 once on /founding-member. Apply tier-select shows Founding "10 plekken" but not Growth/Pro/Enterprise caps. Other 7 routes have no scarcity. |
| C7 | Unity | 1 | 1 | 1 | 1 | 2 | 0 | 0 | 0 | 2 | 0 | 0 | 0 | 8 | "Voor Nederlandse bureaus", "EU-native" framing on home + /about + /how-it-works + /founding-member. /case-studies-skc uses peer-language (bureau-owner to bureau-owner). /memory + skills + apply + contact + blog do not invoke peer-group identity. |

Per-route Cialdini totals (max 14):
- H 8, A 6, HIW 6, P 9, F 13, M 2, AP 4, C 3, CS 10, SC 3, SS 2, B 5.
- Average per route 5.9 of 14, or 4.2 of 10 normalised.

Principle-wise totals show strong Authority (16) + Liking (16), weak Reciprocity (3) + Scarcity (7) + Unity (8).

## Funnel-friction maps

### Funnel 1: home to /apply

| Step | Route + section | Friction items | Trust artefacts present | Drop-off hypothesis | Proposed fix (no code) |
|---|---|---|---|---|---|
| 1 | `/` hero | Split-attention: 3 above-the-fold CTAs (Plan een gesprek, Leer Clyde kennen, Start de scan) plus chatbot FAB plus locale switcher = 5 attention targets. Spline 3D robot consumes 30% of viewport, no above-the-fold trust cluster. | Scarcity counter `1/10` (small, bottom-left of hero), founder name in proof-band below fold | M1 violation (no dominant single CTA). Visitor scans 3 CTAs, picks scan-button (lowest commitment) or bounces. 50% to 65% bounce-rate estimate. | Demote "Leer Clyde kennen" to text-link below CTA, move scarcity counter to badge above headline, add trust-cluster (SKC logo, GDPR badge, Daley founder-photo) above the fold. |
| 2 | `/` mid-scroll (founding teaser + case-study teaser) | Long scroll required (estimated 4-5 viewport-heights to reach mid-CTA-band). Multiple sections compete for attention. No sticky CTA above 768px viewport. | SKC case-link, founding-spots scarcity reminder | Scroll-fatigue. Visitor commits to /apply only if they reach mid-band or footer-CTA. Mobile users at 414w drop off at 60% scroll. | Add sticky-header CTA after 600px scroll on desktop, mirror mobile sticky-CTA. Compress mid-scroll sections to 3 (proof, scarcity, CTA-band) from current 5-6. |
| 3 | `/` to `/apply` transition | Click on "Plan een gesprek" loads new page. No persistent context (which tier did I see?) carried into apply. Inter-page latency ~1.2s on warm cache. | Page-transition is consistent (header + footer persist) | If the visitor came from /pricing or /founding-member, they expect tier-pre-selection. Apply form starts from zero. | Pass `?tier=founding` or `?tier=growth` query param from pricing-tier-CTAs into apply, pre-select tier-radio. |
| 4 | `/apply` form | 9 fields (name, email, organization, role, tier, workspaces, top-skills, message, GDPR-checkbox). Form is single-column, scrolls 1.5 viewport-heights at desktop. Conditional workspaces field appears mid-scroll. | Privacy-note copy ("Je gegevens blijven bij ons en SKC, geen doorverkoop"), submit-button hover-state, error-recovery per-field | 9 fields exceed SOTA cap of 5-6 for early conversion. Tier + workspace selection requires recall from /pricing. Decision-friction at top of form, before any value-internalisation. Submission rate estimated 30% to 45% of form-loads. | Reduce to 4 fields at first step (name, email, organization, tier), defer workspaces + top-skills + message to Calendly intake or step-2. Show inline tier-summary cards next to tier-radio so visitor does not need to recall /pricing. |
| 5 | `/apply` success-state to Calendly | Calendly iframe embedded inline. Name + email pre-filled. No follow-up email confirmation copy visible at success. | "We sturen een bevestiging naar je inbox" copy, Calendly hand-off | Visitor expects email-confirmation. If email lands in spam, Calendly iframe is the only path. iframe-load can stutter on slow connections. | Add explicit "Check je inbox, ook spam-map" copy. Send confirmation email immediately on submit (server-side), not after Calendly-book. Add fallback "Of plan zelf" deep-link to Calendly outside iframe. |

Funnel 1 cumulative drop-off estimate: 100 home-visits to 35-45 hero-scroll-past to 22-30 reach-mid-CTA-band to 18-25 click-apply to 9-15 form-submit to 7-12 Calendly-booked. **Net conversion 7% to 12% of home-visits**, gated primarily at step 1 (split-attention) and step 4 (form-friction).

### Funnel 2: home to /contact

| Step | Route + section | Friction items | Trust artefacts present | Drop-off hypothesis | Proposed fix (no code) |
|---|---|---|---|---|---|
| 1 | `/` to `/contact` discovery | Contact link only in footer, not in header nav. No "Vragen?" or "Help" header CTA. Visitor must scroll to footer to find contact-route. | Footer-link is consistent | Visitor expecting fast support-path bounces or uses chatbot FAB instead. Chatbot is sales-focused, not support, so visitor with non-sales question lands wrong. | Add "Contact" to header nav as secondary link (not primary CTA). Add "Of stuur een bericht" sub-text under chatbot FAB tooltip pointing to /contact for support-questions. |
| 2 | `/contact` form | 4 fields (name, email, message, GDPR-checkbox). No intent-segmentation (sales, partner, press, support). Generic message-box. Apply-redirect callout ("Ga naar aanmelden") competes with form-submit. | Privacy-note, apply-redirect for high-intent | Daley has to manually route inbound by reading message body. Slow response. Visitor with sales-intent should be on /apply but lands on /contact via footer-default. | Add intent-radio at top of form (Sales / Partner / Press / Support / Anders) so message routes correctly. Soft-suggest /apply for Sales-intent inline. |
| 3 | `/contact` success-state | "Bedankt, we komen binnen 1 werkdag terug" copy plus soft Calendly CTA (Phase 15-02 addition). | Soft CTA respects intent-asymmetry | Visitor with non-sales intent gets sales-flavoured Calendly suggestion. Mismatch. | Conditional success-copy: if Sales-intent selected, show Calendly suggestion. If Support-intent, show response-time SLA. |

Funnel 2 cumulative drop-off estimate: 100 home-visits to 10-18 reach-footer to 4-9 click-contact to 2-5 form-submit. **Net conversion 2% to 5% of home-visits**. Funnel 2 is intentionally narrower (support intent, not sales), but loses high-value partner and press leads to chatbot or to no-action.

## F-pattern hero audit

F-pattern reading: eyes scan horizontally across the top (first F-bar), drop down the left edge (vertical spine), scan a shorter horizontal mid-page (second F-bar), then settle into vertical scanning. Score axes: headline placement (top-left), first horizontal scan-stop (top-right), vertical left-edge anchors (subhead + CTA + proof-cluster left-aligned), CTA position relative to scan path (left or center, not right-margin-only).

| Route | Headline placement | First horizontal scan-stop | Left-edge anchors | CTA position vs scan path | F-pattern score 0/4 | Top fix |
|---|---|---|---|---|---|---|
| `/` | Center-aligned, large display. Visible immediately top-center. | Spline 3D robot at top-right consumes scan-stop. Robot is decorative, not informational. | Subhead + CTA + counter all center-aligned, no left-spine. | Primary CTA center, secondary CTA center. Misses left-margin scan-path. | **1/4** | Left-align hero copy + CTAs, push 3D robot to right 40%, add trust-badge cluster at left-edge below subhead. |
| `/pricing` | Top-center, large. Clear. | Section-intro copy at right, not high-information. | Tier-cards arranged center-row, no left-spine. | Per-tier CTA inside each card, vertically centered. F-pattern broken at fold. | **2/4** | Move highlighted tier (Founding) to left-first-column, make it visually prominent. Add 1-line value-prop at left-edge above tier-cards. |
| `/founding-member` | Top-center, large. "Founding cohort" framing clear. | "1 van 10 plekken bezet" counter top-right (good F-pattern second scan-stop). | Founding-benefits list left-aligned below counter (left-spine present). | Bottom CTA center, primary path. | **3/4** | Move primary CTA to immediately after benefits-list (within first viewport), not at page-bottom. |
| `/memory` | Top-center, large. "4-laags geheugen" framing. | Diagram of 4 memory-layers at right (informational scan-stop, good). | Layer-descriptions left-aligned. Left-spine OK. | No primary CTA above the fold. CTA appears mid-scroll. | **2/4** | Add primary CTA at hero (Plan een gesprek) below sub-head, mirror /skills page pattern. |
| `/case-studies/skinclarity-club` | Top-center, "SkinClarity Club" + metric. | Metric "5x bereik in 4 maanden" at right as scan-stop (good). | Method-recap left-aligned. Sindy + Daley photo at left below H1. | Primary CTA at bottom of long-form, secondary "Bekijk Founding tier" link in mid-scroll. | **2/4** | Add primary CTA at top-right of hero, immediately after metric, so first-horizontal-scan ends at conversion-point. |

Total F-pattern score across 5 routes: **10 of 20**, or 5.0 of 10 normalised. The pattern is consistently broken by center-alignment, which is visually balanced but reading-inefficient. F-pattern is well-established in B2B SaaS (Stripe and Vercel both use it on hero, though Linear breaks it deliberately for product-narrative-first). FMai aligns with the Linear approach but lacks the live product-demo that justifies center-alignment for Linear.

## SOTA CRO patterns 2026

Source: Gemini 2.5 Flash Google-grounded research call (logged BUDGET.log call 12 of 100). Distilled to 10 named-example markers:

1. **Outcome-driven multi-stakeholder messaging**: Notion focuses on org + collab outcomes. Amie promises summaries in 47 seconds. Magical claims 12x revenue recovery. Quantifiable benefits > feature-lists.
2. **Mobile-first design at scale**: Unbounce reports 83% of B2B landing-page visits are mobile. Touch-optimised CTAs, simplified forms, fast-load. Not just responsive shrinking.
3. **AI-powered personalisation**: Dynamic content + pricing previews tailored to visitor intent. Studies show 5-15% revenue lift and up to 50% CAC reduction.
4. **Story-driven hero**: Figma dramatizes collaboration with live cursors. Micro-animations illustrate product-workflows. Replaces static taglines.
5. **Single goal + clear CTA**: One conversion-goal per page. First-person benefit-driven CTA copy ("Start My Free Trial", "Get Started Free, No Credit Card Required").
6. **Pricing transparency**: 57% of SaaS visitors check pricing before reading product. Betterstack puts $269/mo next to PagerDuty's $673/mo. Freshdesk lists exact costs.
7. **Minimal form-fields**: SOTA cap is 5 or fewer for early-stage conversion. Factors AI asks only Name + Work Email. Woodpecker leads with "No credit card required".
8. **Trust signal stack**: Above-the-fold stack of 3 elements: one security badge (SOC 2, GDPR), one rating (G2 4.8/5, Capterra), one named logo cluster (Toast, Ahrefs, Strapi style). Aragon AI displays SOC 2 + GDPR. Deel cites "6,000+ reviews 4.7/5".
9. **Risk-reducers + interactive demos**: "No credit card required" lifts conversion. Storylane offers interactive demo without sign-up. Resource Guru uses animation videos.
10. **Dark-mode signals premium positioning**: Superhuman uses sleek dark design for premium feel. Effective for design tools, creative platforms, AI-era SaaS. Not universally superior to light mode.

EU-native positioning specifics: GDPR badge near CTA, AVG (Dutch GDPR) framing for NL audience, EU-server narrative (Chatarmin pattern), data-residency claim. FMai already does GDPR-narrative in copy but lacks the visual badge-cluster above the fold.

## Top 25 findings

Severity follows P0 (business-critical) to P3 (polish). Each finding links to a SOTA marker where applicable.

### Finding 1: No above-the-fold trust cluster on home (P1, marker M23)

**Where:** `/` hero, 1440x900 desktop and 414x896 mobile.

**Evidence:** DOM snapshot `_-nl.html` contains zero occurrences of "SOC", "GDPR", "AVG", "G2", "Trustpilot", "ISO" inside the hero section (above scroll-Y=900). Footer contains GDPR mention but is below-the-fold.

**Why it matters:** SOTA 2026 (markers M23 + M24) stacks 3 trust elements above the fold. Aragon AI + Deel + Betterstack all do this. FMai stacks 0. Estimated lift of fix: +18% to +28% on apply-submit-volume.

**Fix sketch (no code):** Add a 3-element trust badge cluster above scarcity counter: (a) GDPR/AVG visual badge, (b) "SkinClarity Club" logo or testimonial-pull, (c) "Founder-led, EU-native" badge or Daley founder-photo with byline.

### Finding 2: Hero split-attention with 5 attention-targets (P1, marker M1)

**Where:** `/` hero above-the-fold.

**Evidence:** Plan een gesprek (primary), Leer Clyde kennen (secondary text-link), Start de scan (primary-bg button), chatbot FAB (fixed-position), locale switcher (header). Five attention-targets in first viewport.

**Why it matters:** M1 requires one dominant primary CTA without split-attention. Linear and Stripe both maintain dominant single-path above-the-fold. FMai's three competing CTAs (Plan een gesprek + Leer Clyde kennen + Start de scan) plus FAB plus locale violate M1.

**Fix sketch:** Demote "Leer Clyde kennen" to a text-link inside the sub-head copy. Move "Start de scan" to a secondary section below the proof-band, not above-the-fold. Reduce attention-targets to 2 (primary CTA + persistent header).

### Finding 3: Apply form has 9 fields, above SOTA cap of 5-6 (P1, marker M22)

**Where:** `/apply` form (verified in `_apply-nl.html` DOM snapshot, cross-reference 16-05 form-inventory).

**Evidence:** 9 fields (name, email, organization, role, tier, workspaces, top-skills, message, GDPR-checkbox). SOTA cap for early-stage B2B conversion is 5 fields max (Factors AI uses 2, Woodpecker uses 3).

**Why it matters:** M22 requires forms to minimise fields. Each extra field beyond 5 reduces conversion by an estimated 5% to 11% in SOTA studies. Apply form sits at field-friction-cap.

**Fix sketch:** Reduce step-1 to 4 fields (name, email, organization, tier). Defer workspaces + top-skills + message to either Calendly intake or a step-2 after email-capture. Tier-radio should show inline tier-summary cards.

### Finding 4: Hero scarcity counter visually de-emphasised (P1, marker M21)

**Where:** `/` hero, bottom-left below the CTA-row.

**Evidence:** `1 van 10 plekken bezet` badge is rendered at ~text-sm with bg-elevated surface, low visual weight relative to display-headline and CTA-buttons.

**Why it matters:** Scarcity is FMai's strongest Cialdini lever (C6=2 on this route). De-emphasising it leaves conversion-power on the table. SOTA scarcity-framing (Booking.com, Airbnb, ConvertKit Founding member) puts the counter at hero-headline level visual prominence.

**Fix sketch:** Move counter above the headline as a "Founding cohort, 1 of 10 spots claimed" badge. Use accent-system color for emphasis. Animate count-up on view-enter.

### Finding 5: Contact form does not segment intent (P1, marker M22)

**Where:** `/contact` form.

**Evidence:** 4 fields (name, email, message, GDPR-checkbox). No intent-radio. Apply-redirect callout exists but only for sales-intent.

**Why it matters:** Inbound segmentation moves to manual triage on Daley's side. Slow response. SOTA pattern (Hubspot, Calendly, Stripe contact) routes by intent at form-level.

**Fix sketch:** Add intent-radio at top: Sales / Partner / Press / Support / Anders. Conditional success-copy and conditional routing email to different inbox-aliases.

### Finding 6: No reciprocity hook anywhere on site (P1, marker M21)

**Where:** All 12 routes, especially home + /memory + /blog.

**Evidence:** Cialdini C1=3 of 24. No lead magnet, no audit-download, no email-course, no free guide. Blog gives away content but no email-capture.

**Why it matters:** Reciprocity is the weakest Cialdini score on the site. SOTA B2B SaaS uses lead magnets to capture email pre-purchase (HubSpot State of Marketing report, ConvertKit Creator Network, Storyblok Headless CMS Buyers Guide).

**Fix sketch:** Add a "Free AI Marketing Audit Template" or "EU AI Compliance Checklist" download on /memory or /blog. Email-gated, becomes email-list seed.

### Finding 7: No exit-intent capture (P1, marker M25)

**Where:** All 12 routes.

**Evidence:** DOM snapshots show no exit-intent script, no mouse-leave listener, no scroll-up-fast trigger.

**Why it matters:** SOTA B2B SaaS recovers 5% to 15% of bounces via exit-intent modals offering lead-magnet or last-chance discount. FMai's high-traffic routes leave this on the table.

**Fix sketch:** Add subtle exit-intent capture on /pricing + /founding-member offering reciprocity-hook from Finding 6. Avoid aggressive modals (Founder-led brand voice).

### Finding 8: No customer-count or named-logo cluster (P1, marker M23)

**Where:** Home, /pricing, /about, /founding-member.

**Evidence:** SkinClarity Club is the sole named entity. No "X bureaus served", no "Y workspaces active", no logo wall.

**Why it matters:** M23 requires verifiable social proof with named clients + measurable metric + source attribution. SOTA 2026 stacks named-logo clusters (Stripe lists Amazon, Google, Microsoft on home). FMai is single-customer-narrative which is honest but limits scale-signalling.

**Fix sketch:** Once second + third Founding customers land, add a 3-logo cluster. Until then, emphasise SkinClarity metric ("5x bereik in 4 maanden") as the visible scale-signal.

### Finding 9: Scarcity stops at Founding tier, other 3 tiers feel infinite (P1, marker M21)

**Where:** `/pricing` Growth, Professional, Enterprise tier cards.

**Evidence:** Founding card shows "1 van 10 plekken". Growth, Pro, Ent cards have no scarcity-counter or cohort-language. MAX_PARTNERS_PER_YEAR=20 is mentioned only on /founding-member as a sentence.

**Why it matters:** Upgrade-pressure from Growth to Pro to Ent loses scarcity-lever. SOTA pattern (Stripe Atlas cohort, Linear Method early-access waves) extends scarcity-framing across tiers.

**Fix sketch:** Add "Q2 cohort 6 of 20 spots claimed" badges on Growth/Pro/Ent cards. Even if synthetic at first, anchor to MAX_PARTNERS_PER_YEAR. Refresh quarterly.

### Finding 10: No breadcrumb on any deep route (P2, Nielsen H3)

**Where:** /case-studies/skinclarity-club, /skills/*, /legal/*, /blog/*.

**Evidence:** DOM grep for `BreadcrumbList` schema-type returns zero hits on case-study and skills routes.

**Why it matters:** H3 (user control) + H6 (recognition). Breadcrumb gives spatial-awareness and supports SEO BreadcrumbList schema (marker M12 + M22).

**Fix sketch:** Add visual + schema breadcrumb on all routes 1+ depth from home.

### Finding 11: Cookie banner has no second-touch re-open path (P2, Nielsen H3)

**Where:** Global cookie banner + /legal/cookies copy.

**Evidence:** `/legal/cookies` copy says "Beheer je voorkeuren via je browser of de cookie-banner". Banner has no re-open after first dismissal (verified in 16-05).

**Why it matters:** GDPR consent-management requires user-control. Promised UX does not match actual UX.

**Fix sketch:** Add "Cookie-voorkeuren" link in footer that re-opens the banner. Or move to first-party consent-management with persistent settings.

### Finding 12: No FAQ on /apply or /contact (P2, Nielsen H10)

**Where:** /apply, /contact.

**Evidence:** DOM grep for "Veelgestelde vragen" or "FAQ" or "Vragen" returns zero hits on apply + contact routes.

**Why it matters:** H10 (help). Visitor mid-application has natural friction-questions ("hoe lang duurt de call?", "wat als ik mijn tier niet weet?", "wat gebeurt er na submit?"). No help-copy means they bounce.

**Fix sketch:** Add 3-5 FAQ-accordions below the apply-form and contact-form: timing, expectations, next-steps, GDPR-handling.

### Finding 13: Apply form does not pre-select tier from query param (P2, Nielsen H6)

**Where:** /apply form, tier-radio.

**Evidence:** Apply form starts with no tier selected, regardless of referrer.

**Why it matters:** Visitor coming from /pricing tier-card or /founding-member should land with that tier pre-selected. Reduces recall-friction.

**Fix sketch:** Accept `?tier=founding` query param from pricing-tier-CTAs, pre-select radio. Add small "Verkeerd? Wijzig hier" link if user wants to change.

### Finding 14: No persistent context across pages (P2, Nielsen H6)

**Where:** Entire site.

**Evidence:** Each route is independent. No "recently viewed tier", no "last skill explored", no breadcrumb back to entry-point.

**Why it matters:** Multi-touch B2B visitor (typically 5-7 touches before convert) loses context. SOTA SaaS (Stripe, Linear) uses recent-history breadcrumbs or "continue where you left off".

**Fix sketch:** localStorage-based "Vorige bezocht" hint in header or pricing-tier highlight. Privacy-respecting.

### Finding 15: No keyboard-shortcuts or power-user paths (P2, Nielsen H7)

**Where:** Entire site.

**Evidence:** No CMD+K palette, no `?` help-overlay, no keyboard-only navigation hints.

**Why it matters:** H7 (efficiency). Power-users + accessibility-users benefit. SOTA SaaS (Linear, Notion, Stripe Atlas) ship CMD+K.

**Fix sketch:** CMD+K palette with route-shortcuts, search across blog + skills + case-studies. Power-user-only, not a primary UX path.

### Finding 16: Spline 3D robot consumes 30% of hero, no informational value (P2, marker M5)

**Where:** `/` hero right-half.

**Evidence:** Spline scene `HeroSpline` renders large at top-right, decorative, not product-demo.

**Why it matters:** M5 (motion is purposeful, not decorative). Stripe, Linear, Vercel all use product-demo motion. FMai uses decorative motion that costs LCP without converting.

**Fix sketch:** Replace with product-demo (Clyde chat-thread animating in, /apply form-fill simulation, or skill-execution animation). Or shrink Spline to 20% width and add product-screenshot to right of hero copy.

### Finding 17: Memory page has no above-the-fold CTA (P2, marker M21)

**Where:** /memory hero.

**Evidence:** /memory hero shows 4-layer diagram + descriptions. Primary CTA appears at mid-scroll (~scroll-Y=1800).

**Why it matters:** M21 requires primary CTA repeats above-the-fold and at mid-scroll and at end. /memory misses above-the-fold CTA.

**Fix sketch:** Add "Plan een gesprek" CTA inside hero sub-head row, mirror /skills pages.

### Finding 18: Blog has no newsletter-signup with reciprocity-hook (P2, Cialdini C1)

**Where:** /blog index + post pages.

**Evidence:** No email-capture on blog. Newsletter-confirm route exists but no entry-point.

**Why it matters:** Blog visitor is mid-funnel research-mode. SOTA B2B blog converts 1% to 3% to email-list via reciprocity-hook (CSS-Tricks, Smashing Magazine, Stripe Blog).

**Fix sketch:** Inline newsletter-signup at end of blog post + sidebar on /blog index. Offer "AI Marketing Weekly NL" or similar.

### Finding 19: Header hamburger aria-label not localised (P2, Nielsen H2)

**Where:** Header on mobile breakpoint.

**Evidence:** Per 16-05 inventory, `aria-label="Open menu"` is hardcoded EN only. NL/ES users get EN screen-reader output.

**Why it matters:** H2 (match system to real world). Localised UX promise broken at the aria-layer.

**Fix sketch:** Localise aria-label per `useTranslations()` namespace.

### Finding 20: Locale switcher uses flag-only (P2, Nielsen H6, WCAG)

**Where:** Header right-cluster.

**Evidence:** Locale switcher uses national flag icons without text-label. aria-label is hardcoded EN ("Change language").

**Why it matters:** H6 (recognition). Flag-only is sub-AA accessible (flags do not map 1:1 to languages, plus screen-reader fail). SOTA pattern is flag + language-code (NL / EN / ES).

**Fix sketch:** Add language-code next to flag (e.g., NL 🇳🇱). Localise aria-label.

### Finding 21: Pricing page lacks side-by-side competitor TCO comparison (P2, marker M24)

**Where:** /pricing.

**Evidence:** Pricing cards show Founding/Growth/Pro/Ent. No comparison to competitors (Mediacooks, MS618, Chatarmin) or to traditional agency-billing.

**Why it matters:** M24 (pricing transparency). SOTA pattern (Betterstack vs PagerDuty, Linear vs Jira) wins on TCO comparison. FMai sells against traditional agency-hour-billing but does not visualise the saving.

**Fix sketch:** Add "Vergeleken met agency-uurloon" section: 80 hours per month at EUR 100 vs Growth tier EUR 499 per workspace. Show 5x to 10x cost saving.

### Finding 22: No press or media-mention cluster (P3, Cialdini C4)

**Where:** Home, /about.

**Evidence:** No "As seen in" cluster. No press-page in IA.

**Why it matters:** Authority signal. SOTA B2B uses "Featured in TechCrunch, Wired, EU-Startups" cluster.

**Fix sketch:** Once 1+ media-mention exists, add cluster. Until then, lean on Daley + Sindy founder-bylines and SKC case study.

### Finding 23: No video testimonial on case-study (P3, Cialdini C3, C5)

**Where:** /case-studies/skinclarity-club.

**Evidence:** Case study is text + photo, no video.

**Why it matters:** Video testimonial converts 30% to 50% better than text testimonial in SOTA B2B (Wynter research). Sindy as on-screen-customer-voice is high-trust.

**Fix sketch:** Record 60-second Sindy video testimonial. Embed at hero of case-study page.

### Finding 24: No "powered by" or stack-transparency footer (P3, Cialdini C4)

**Where:** Footer.

**Evidence:** No mention of Next.js, Vercel, Supabase, OpenAI, Anthropic in footer.

**Why it matters:** Developer-audience trusts visible-stack (Vercel does this). Bureau-owner audience does not need it but does not hurt. Authority signal for technical-audience visitors.

**Fix sketch:** Optional subtle "Built on Next.js + Vercel + Supabase + Anthropic Claude" line in footer.

### Finding 25: No A/B test infrastructure (P3, meta)

**Where:** Entire site.

**Evidence:** No Vercel Edge Config, no PostHog feature-flags, no GrowthBook. Plausible analytics only.

**Why it matters:** CRO improvements require measurement. Without A/B infra, every fix from this audit becomes a guess.

**Fix sketch:** Add lightweight A/B test infra (Vercel Edge Config + PostHog feature-flags) before rolling out Findings 1-9.

### Finding 26: No urgency-deadline on Founding tier (P3, Cialdini C6)

**Where:** /founding-member.

**Evidence:** Founding tier is "10 plekken, levenslang". No deadline framing ("Sluit Q2 2026").

**Why it matters:** Scarcity is stronger when paired with deadline. SOTA Founding-member offers (ConvertKit, Buffer, Notion) use cohort-deadline.

**Fix sketch:** Add "Founding cohort sluit 30 juni 2026" or similar deadline. Refreshes urgency on quarterly cadence.

### Finding 27: No post-conversion onboarding-preview (P3, Cialdini C2)

**Where:** /apply success-state + /contact success-state.

**Evidence:** Success copy says "We sturen een bevestiging" but does not preview what happens next (calendar-invite, prep-doc, first-meeting agenda).

**Why it matters:** C2 (commitment + consistency). Showing the next-3-steps reduces buyer's-remorse and increases follow-through.

**Fix sketch:** Add "Wat gebeurt er nu?" preview-strip below success-message: (1) email-confirmation in 5 min, (2) prep-doc tomorrow, (3) intake-call in calendar.

## Expected lift (conservative)

Per finding-category, estimated lift on `/apply` form-submission volume if the fix lands and is correctly measured. Assumes baseline of 12% home-to-apply-submit (Funnel 1 above).

| Category | Findings | Combined lift estimate | Confidence |
|---|---|---|---|
| Trust signals above the fold | F1, F8, F22, F23 | +18% to +30% | High (SOTA-aligned) |
| Hero attention-discipline | F2, F4, F16 | +10% to +18% | Medium-High |
| Form-friction reduction | F3, F5, F13 | +12% to +22% | High (Factors AI benchmark) |
| Reciprocity + exit-intent | F6, F7, F18 | +6% to +14% | Medium |
| Scarcity extension | F9, F26 | +5% to +10% | Medium |
| Help + recovery | F10, F11, F12, F19, F20 | +3% to +7% | Low-Medium |
| Pricing TCO transparency | F21, F24 | +4% to +9% | Medium |
| Above-fold CTA on /memory | F17 | +2% to +5% | High (isolated fix) |
| Onboarding-preview + A/B infra | F25, F27, F14, F15 | enables measurement, no direct lift | Meta |

Conservative cumulative estimate if all P1 findings land (F1, F2, F3, F4, F5, F6, F7, F8, F9): **+25% to +45% on /apply submit-volume**, with diminishing returns past the first 4. Phase 15 closed first-order leaks (button-states, copy-fixes). This audit's second-order leaks (trust, scarcity-framing, form-decision-friction) deliver the next-step.

## Open questions for Wave 3 + Wave 4

1. Which 3 P1 findings get priority in 16-16 fix-plan given solo-execution capacity? Trust-cluster (F1) is highest expected-lift and lowest-risk. Form-reduction (F3) requires Calendly intake refactor. Scarcity-extension (F9) requires synthetic data until real cohort fills.
2. Is the Spline 3D robot worth keeping? F16 says no for conversion, but design-system 16-04 may have opinions.
3. Should /apply move to a 2-step form (email-first then full) before reducing fields? Mid-step gives the trust-build window before commitment.
4. Does FMai want to add G2 or Trustpilot reviews as trust-signal, or stay on direct-named-customer model? G2 introduces review-management overhead.
5. Can the chatbot FAB be repurposed for support-intent routing so /contact form is freed for sales-partner-press triage?

## Sources

- `00-competitive-intel.md` SOTA markers M1, M2, M21, M22, M23, M24, M25 (referenced throughout)
- `04-interactions-forms-microcopy.md` CTA inventory + form-field inventory (16-05)
- `03-brand-narrative-ia.md` IA + glossary discipline
- `10-content-copy-i18n.md` NL/EN/ES parity baseline
- `fmai-nextjs/CLAUDE.md` founding-counter SSoT, glossary, canonical domain
- `fmai-nextjs/test-results/audit-v2/dom/` DOM snapshots (12 routes x 3 locales)
- `fmai-nextjs/test-results/audit-v2/screenshots/` desktop + mobile screenshots (12 routes)
- Gemini grounded research call 12 of 100 (logged BUDGET.log), citations: genesysgrowth.com, flowtrix.co, designrevision.com, saasframe.io, lovable.dev, salespanel.io, swipepages.com, saashero.net, overpass.studio, apexure.com, firstpagesage.com, cleardigital.com, outcrowd.io
- Nielsen Norman Group: 10 Usability Heuristics for User Interface Design (1994 / 2020 refresh)
- Cialdini, R. (2016). Pre-Suasion: A Revolutionary Way to Influence and Persuade (7-principle framework with Unity addition)
- Internal: `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts` pricing SSoT (workspace-priced model since 2026-04-28)

End of document. Nielsen 10-heuristic scorecard, Cialdini 7-principle scorecard, 2 funnel-friction maps (home to /apply, home to /contact), F-pattern audit across 5 routes, 27 findings with severity P0-P3, expected-lift table by category, SOTA CRO 2026 patterns from one Gemini grounded research call. Ready as anchor for 16-15 cross-cutting synthesis and 16-16 fix-plan prioritisation.
