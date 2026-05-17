# AI Readiness Assessment — Implementation Plan

> Status: ready for approval. Drafted 2026-05-17 after 5-stream parallel research (newsletter/Resend, UI components, analytics, fma-app patterns, domain research via Gemini grounded search).

## 0. Goal

Replace the email-only "NL Bureau AI Readiness Checklist" lead magnet (currently a PDF-promise behind `LeadMagnetCTA`) with a real interactive assessment at `/assessment` that segments Dutch marketing agencies into Explorer / Builder / Operator personas, captures email at the post-result hybrid gate, and routes warm leads toward `/apply` with persona-specific Clyde-skill recommendations.

Why this matters: current copy promises an assessment but only delivers email-capture; the discrepancy hurts trust and burns a high-intent acquisition channel. Doing it properly turns the lead magnet into a qualification + segmentation engine that warms prospects before they reach `/apply`.

## 1. Locked decisions

| Decision | Choice | Rationale |
|---|---|---|
| Question count | 16 (4 per category) | Research sweet-spot between completion (~65-70%) and persona-accuracy; updates current "20 vragen" copy |
| Categories | Strategy & Vision · Data & Insights · Tools & Workflows · Team & Governance | 4-cat consensus across HubSpot/Gartner/McKinsey/Salesforce/Forrester adapted to agency-context |
| Personas | Explorer (<40%) · Builder (40-70%) · Operator (>70%) | Validated framework in research; already in current copy |
| Question types | Mix: 12 single-select (4-options) + 4 Likert (1-5 agreement) | Single-select is fastest; Likert adds nuance on softer dimensions (people, governance) |
| Email-capture | Post-quiz hybrid gate | B2B industry-standard; persona-name inline = curiosity gap, full report email-gated |
| Inline result depth | Persona name + 1-sentence summary only | Maximizes email-capture rate; full per-category breakdown + 3 recommended Clyde-skills + 4-week roadmap arrive via email |
| Skill-routing | Persona + lowest-scoring category → 3 specific Clyde-skill recommendations with deep links | Connects assessment directly to product offering; high relevance for conversion |
| Anonymous start | Yes | No friction before question 1; abandoned funnel = OK (only completed = lead) |
| i18n scope | NL (authoritative) + EN + ES day 1 | Match site convention; ES translations machine + reviewed per existing pattern |
| Storage | Extend `newsletter_consents` with JSONB columns | Reuse existing token + double-opt-in + RLS + GDPR audit trail; no new table |
| Route | `/assessment` | Short, clear, fits marketing-site URL style |
| Analytics | snake_case events via `window.gtag`, server-side mirror to Supabase | Match existing convention |

## 2. Architecture

```
visitor
  │
  ▼
[entry points]
  /  /pricing  /founding-member  /blog  → LeadMagnetCTA card (copy + CTA → /assessment)
  /  → optional dedicated hero teaser (TBD wave 2)
  │
  ▼
/assessment (anonymous, no email)
  ├ intro (10s, what to expect)
  ├ question 1/16  → answered → question 2/16 → ... → question 16/16
  │   ↑ progress bar bottom "Question N van 16"
  │   ↑ Framer Motion stagger between Qs
  │   ↑ Zustand store keeps answers in-memory (no persist; refresh = restart, deliberate)
  ▼
inline result reveal
  ├ persona name (Explorer | Builder | Operator) animated reveal
  ├ 1-sentence summary in the brand voice
  └ email-capture card: "krijg het volledige actieplan + 3 aanbevolen vaardigheden + 4-week roadmap"
  │
  ▼
POST /api/assessment  (email + locale + answers + scores + persona + source)
  ├ Zod-validate body (incl. honeypot, consent text, ip-hash)
  ├ INSERT into newsletter_consents (status='pending', assessment_* columns filled)
  ├ Resend send confirmation email (NL/EN/ES, follows apply-templates pattern)
  └ Return { ok: true }
  │
  ▼
user clicks confirm-link in email
  │
  ▼
GET /api/newsletter/confirm?token=... (already exists — extended)
  ├ flip status='confirmed'
  ├ add to Resend Audience (existing behaviour)
  └ Resend send assessment-result email (NEW template) with:
       ├ persona-card
       ├ per-category score-bars (4)
       ├ 3 recommended Clyde-skills with deep links
       ├ 4-week roadmap
       └ CTA → /apply
  │
  ▼
/newsletter/confirm page (already exists) → success state
```

## 3. Data model

### 3.1 Migration — extend `newsletter_consents`

```sql
ALTER TABLE newsletter_consents
  ADD COLUMN assessment_answers jsonb,
  ADD COLUMN assessment_scores jsonb,
  ADD COLUMN assessment_persona text CHECK (
    assessment_persona IN ('explorer', 'builder', 'operator')
  ),
  ADD COLUMN assessment_started_at timestamptz,
  ADD COLUMN assessment_completed_at timestamptz,
  ADD COLUMN assessment_locale text;

CREATE INDEX idx_newsletter_consents_assessment_persona
  ON newsletter_consents(assessment_persona)
  WHERE assessment_persona IS NOT NULL;
```

Shapes:
- `assessment_answers`: `{ "q1": "option_a", "q2": "option_c", ..., "q13": 4, "q14": 2 }` (single-select = option-key string; Likert = 1-5 integer)
- `assessment_scores`: `{ "strategy": 78, "data": 45, "tools": 62, "team": 51, "total": 59 }` (per-category + total, 0-100 normalised)

RLS: existing `newsletter_consents` RLS (bypassed via service_role) covers new columns; no policy changes.

### 3.2 SSoT — `src/lib/assessment/questions.ts`

Exports `ASSESSMENT_QUESTIONS: AssessmentQuestion[]` (16 entries, 4 per category). Each:

```typescript
interface AssessmentQuestion {
  id: 'q1' | 'q2' | ... | 'q16'
  category: 'strategy' | 'data' | 'tools' | 'team'
  type: 'single' | 'likert'
  weight: number       // 1 = standard, 2 = critical (e.g., AI Act compliance)
  // single-select questions
  options?: Array<{ key: string; points: number }>  // points 0-4
  // Likert questions
  invertScore?: boolean  // for negatively-worded items
  // i18n keys for question text + options live in messages/{locale}.json under assessment.q{N}.*
}
```

Per-category point math: sum(question_points × weight) → normalise to 0-100. Total = average of 4 categories.

Persona thresholds:
- `<40` total → **Explorer** (experimenting, no systematic AI yet)
- `40-69` total → **Builder** (custom workflows + scaling pilots)
- `>=70` total → **Operator** (autonomous agents, deeply integrated)

### 3.3 Scoring engine — `src/lib/assessment/scoring.ts`

Pure function. Unit-tested. No side-effects.

```typescript
function scoreAssessment(answers: AssessmentAnswers): AssessmentResult
// { perCategory: {strategy,data,tools,team}, total, persona, lowestCategory }
```

### 3.4 Skill-routing — `src/lib/assessment/skill-routing.ts`

Maps `(persona, lowestCategory) → SkillData[]` (3 skills) by lookup table. E.g., `(builder, data) → [reporting, seo-geo, research]`.

Initial matrix lives in code (12 cells = 3 personas × 4 categories), reviewed for product-relevance per cell. Skill objects pulled from `src/lib/skills-data.ts`.

## 4. UI flow

### 4.1 Route

```
src/app/[locale]/(marketing)/assessment/
  ├ page.tsx          — server component, sets locale, loads questions via i18n
  └ AssessmentClient.tsx — client component, owns flow state via Zustand
```

### 4.2 Component breakdown

| Component | New / Reuse | Notes |
|---|---|---|
| `AssessmentClient` | NEW (orchestrator) | Zustand store for answers + current step |
| `AssessmentIntro` | NEW | 10-sec hero with "what you'll get" bullets + start button |
| `AssessmentProgress` | NEW | Bottom-fixed bar "Question N van 16" + animated width |
| `QuestionCard` | NEW | Single/Likert variants, framer-motion entry, GlassCard wrapper |
| `LikertScale` | NEW | 5-point row, keyboard-navigable |
| `OptionButton` | NEW | Single-select pill with hover/selected states |
| `ResultReveal` | NEW | Persona-name big animated reveal + 1-sentence |
| `AssessmentEmailGate` | NEW (mirror of LeadMagnetCTA form) | Email + consent + honeypot, posts to /api/assessment |
| `AssessmentSuccess` | NEW | "Check je inbox" state — copy from existing newsletter pattern |
| `GlassCard`, `CTAButton`, `SectionHeading`, `PageShell` | REUSE | Per UI audit |
| `LeadScoreCard` (in fma-app) | INSPIRE | Score-bar styling for email template only |
| `OnboardingWizard` (in fma-app) | INSPIRE | Multi-step state pattern reference |

### 4.3 State management

```typescript
// src/lib/assessment/store.ts
interface AssessmentState {
  step: 'intro' | { kind: 'question'; index: number } | 'result' | 'email' | 'success'
  answers: Record<QuestionId, string | number>
  setAnswer(qid: QuestionId, value: string | number): void
  next(): void
  prev(): void
  reset(): void
}
```

Zustand (already in project). No persistence — refreshing restarts deliberately (avoids stale-state bugs; assessment is short enough).

### 4.4 Animations

Framer Motion (`motion/react`):
- Cross-fade between questions, `AnimatePresence` mode="wait", duration 200ms easeOut
- Result reveal: persona name slides up + fades in, 600ms spring
- Progress bar: animated width transition, 400ms ease

## 5. API endpoints

### 5.1 NEW: `POST /api/assessment`

```
Body: { email, locale, source, consent, consentText, website (honeypot), answers, scores, persona }
```

- Zod validation
- Honeypot reject
- IP hash (reuse pattern from /api/newsletter)
- INSERT newsletter_consents (status='pending', all assessment_* cols filled, token generated)
- Resend send confirmation mail (subject: "Bevestig je AI Readiness Scan")
- Telegram lead alert (reuse `sendLeadAlert`)
- Return `{ ok: true }`

### 5.2 EXTEND: `POST /api/newsletter/confirm`

- Detect if confirmed row has `assessment_completed_at` set
- If yes → send assessment-result email (NEW template) instead of generic delivery mail
- If no → existing behaviour (generic checklist delivery mail, kept for legacy newsletter signups during transition)

### 5.3 Existing: `POST /api/newsletter` — unchanged

Stays for any future email-only signups; LeadMagnetCTA will be flipped to point at `/assessment` not at this endpoint, but the endpoint remains.

## 6. Email templates

Pattern: follow `src/lib/email/apply-templates.ts` style (inline HTML strings, `escape()`, `${var}` interpolation). No React Email setup.

### 6.1 NEW: `src/lib/email/assessment-templates.ts`

Exports:
- `assessmentConfirmEmail(token, locale, persona)` — confirmation mail (similar to existing newsletter confirm but tailored copy mentioning the persona)
- `assessmentResultEmail(payload, locale)` — full result with persona-card, 4 score-bars (inline CSS), 3 recommended-skills cards with deep links, 4-week roadmap, CTA → /apply

All locales (NL/EN/ES). NL is authoritative, EN/ES translated.

### 6.2 Resend webhook (`/api/webhooks/resend`)

No changes. Existing critical-event logging handles assessment mails identically.

## 7. Analytics events

Add to `src/lib/analytics.ts` (NEW thin wrapper around `window.gtag`):

```typescript
track(event: AnalyticsEvent, params?: Record<string, string|number>): void
```

Events (snake_case, matching existing convention):
- `assessment_view` — page-load on /assessment
- `assessment_start` — click "Start" on intro
- `question_answered` — per-question, params: `{ question_id, category, value }`
- `category_completed` — last question of a category answered, params: `{ category }`
- `assessment_completed` — all 16 done, params: `{ persona, total_score }`
- `result_viewed` — persona-reveal animation finished
- `email_captured_post_assessment` — POST /api/assessment success, params: `{ persona, source }`
- `assessment_confirmed` — fired on /newsletter/confirm success when payload contains assessment data
- `recommended_skill_click` — skill-CTA in email opens (UTM-tagged inbound, tracked via page-load detect)
- `apply_cta_from_assessment` — /apply visit referred from assessment result email (UTM-tagged)

GTM-loader gap: analytics audit found `NEXT_PUBLIC_GTM_ID` is empty and GTM-loader is not installed in `layout.tsx`. **In scope for this build (wave 4)**: install minimal GTM Script-component in `RootLayout` gated on `NEXT_PUBLIC_GTM_ID` presence AND cookie-consent acceptance. Cookie consent stubs in `CookieConsentBanner` get wired to enable/disable GA via `gtag('consent', 'update', ...)`.

## 8. i18n keys

New namespace `assessment` in `messages/{nl,en,es}.json`:

```jsonc
"assessment": {
  "meta": { "title": "...", "description": "..." },
  "intro": {
    "eyebrow": "AI Readiness Scan",
    "title": "Hoe AI-volwassen is jouw bureau?",
    "subtitle": "16 vragen, 5 minuten. Eindigt met je persoonlijke roadmap.",
    "bullets": ["Persona Explorer/Builder/Operator", "Score per categorie", "3 aanbevolen Clyde-vaardigheden"],
    "start": "Start de scan",
    "duration": "5 min"
  },
  "categories": {
    "strategy": "Strategie & Visie",
    "data": "Data & Inzichten",
    "tools": "Tools & Workflows",
    "team": "Team & Governance"
  },
  "questions": {
    "q1": { "category": "strategy", "text": "...", "options": {"a": "...", "b": "...", ...} },
    ...
    "q13": { "category": "team", "text": "...", "likert": { "min": "Zeer mee oneens", "max": "Zeer mee eens" } },
    ...
  },
  "progress": "Vraag {current} van {total}",
  "result": {
    "explorer": { "name": "Explorer", "summary": "Je experimenteert met AI maar mist nog een systeem." },
    "builder":  { "name": "Builder",  "summary": "Je hebt werkende workflows, klaar voor opschaling." },
    "operator": { "name": "Operator", "summary": "AI draait autonoom in je operatie." }
  },
  "emailGate": {
    "title": "Krijg je volledige actieplan",
    "subtitle": "Per categorie scores + 3 aanbevolen vaardigheden + 4-week roadmap. Direct in je inbox.",
    "emailLabel": "Werk-email",
    "consent": "Ja, stuur me het rapport plus maandelijkse inzichten. Ik kan me op elk moment uitschrijven.",
    "submit": "Stuur mijn actieplan",
    "submitting": "Verzenden..."
  },
  "success": { "title": "Bijna klaar.", "body": "Check je inbox voor de bevestigingsmail. Klik op de link en je actieplan komt direct binnen." },
  "error":   { "title": "Er ging iets mis.", "body": "Probeer het opnieuw of mail ons op hello@future-marketing.ai." }
}
```

Also update existing `leadMagnet` namespace copy (in nl/en/es) so the entry-card on home/pricing/etc points to `/assessment` and reframes from "email me the checklist" to "start the scan".

## 9. File-by-file task breakdown (4 waves)

### Wave 1 — Data + scoring (foundation, no UI)

| # | File | Action | Notes |
|---|---|---|---|
| 1.1 | `supabase/migrations/202605XX_assessment.sql` | NEW | ALTER newsletter_consents (see §3.1) |
| 1.2 | `src/lib/assessment/types.ts` | NEW | TS interfaces |
| 1.3 | `src/lib/assessment/questions.ts` | NEW | SSoT 16 questions w/ weights + i18n key refs |
| 1.4 | `src/lib/assessment/scoring.ts` | NEW | Pure scoring function |
| 1.5 | `src/lib/assessment/skill-routing.ts` | NEW | Persona × category → 3 skills lookup |
| 1.6 | `src/lib/assessment/__tests__/scoring.test.ts` | NEW | Unit tests covering edge cases (all 0s, all max, boundary 39/40/69/70, missing answers) |

Wave 1 verification: `npm run build` + tests pass; no UI yet.

### Wave 2 — UI + routing

| # | File | Action |
|---|---|---|
| 2.1 | `src/app/[locale]/(marketing)/assessment/page.tsx` | NEW |
| 2.2 | `src/app/[locale]/(marketing)/assessment/AssessmentClient.tsx` | NEW (orchestrator) |
| 2.3 | `src/components/assessment/AssessmentIntro.tsx` | NEW |
| 2.4 | `src/components/assessment/AssessmentProgress.tsx` | NEW |
| 2.5 | `src/components/assessment/QuestionCard.tsx` | NEW |
| 2.6 | `src/components/assessment/OptionButton.tsx` | NEW |
| 2.7 | `src/components/assessment/LikertScale.tsx` | NEW |
| 2.8 | `src/components/assessment/ResultReveal.tsx` | NEW |
| 2.9 | `src/lib/assessment/store.ts` | NEW (Zustand) |
| 2.10 | `messages/{nl,en,es}.json` | EDIT (add `assessment` namespace) |

Wave 2 verification: scan-flow works end-to-end in dev, prefilled with mock email-capture (stub action). `npm run build` passes.

### Wave 3 — Email-capture + delivery

| # | File | Action |
|---|---|---|
| 3.1 | `src/components/assessment/AssessmentEmailGate.tsx` | NEW (mirror LeadMagnetCTA form) |
| 3.2 | `src/components/assessment/AssessmentSuccess.tsx` | NEW |
| 3.3 | `src/app/api/assessment/route.ts` | NEW (POST handler — see §5.1) |
| 3.4 | `src/app/api/newsletter/confirm/route.ts` | EDIT (branch on assessment data, see §5.2) |
| 3.5 | `src/lib/email/assessment-templates.ts` | NEW (confirm + result mails, NL/EN/ES) |
| 3.6 | `messages/{nl,en,es}.json` | EDIT (extend `assessment.emailGate.*`, `assessment.success.*`) |

Wave 3 verification: full flow with real Supabase + real Resend. Submit test email, click confirm, receive result mail with persona + scores + skill links. `npm run build` passes.

### Wave 4 — Analytics + rewire + verify

| # | File | Action |
|---|---|---|
| 4.1 | `src/lib/analytics.ts` | NEW (thin `track()` wrapper) |
| 4.2 | `src/app/[locale]/layout.tsx` | EDIT (mount GTM Script if env+consent) |
| 4.3 | `src/components/common/CookieConsentBanner.tsx` | EDIT (wire accept/decline to consent-state used by GTM-loader) |
| 4.4 | All `AssessmentClient`/`QuestionCard`/etc. | EDIT (fire events per §7) |
| 4.5 | `src/components/conversion/LeadMagnetCTA.tsx` | EDIT (flip to "start scan" CTA → /assessment, drop email-only form) |
| 4.6 | `messages/{nl,en,es}.json` | EDIT (update `leadMagnet` copy: scan-CTA framing) |
| 4.7 | `src/components/layout/HeaderClient.tsx` | EDIT (optional: add /assessment to nav under a "Resources" or "Tools" submenu, TBD) |

Wave 4 verification: 
- `npm run build` passes
- Manual: scan completes, persona shown, email captured, confirm mail clicked, result mail received with correct persona + correct lowest-cat-driven skills + working deep links
- GA debug-view shows all 10 events firing in order
- Conversion-path test: result-mail apply-link → /apply with `?utm_source=assessment&utm_medium=email&utm_content={persona}`
- Commit per wave; final wave commits with PR-ready summary

## 10. Dependencies and risks

| Risk | Mitigation |
|---|---|
| GTM-loader rewire scope-creeps | Keep it minimal: env-gated, consent-aware, no GTM container customisation in this PR |
| 16-question copy is hard to write in NL + voice-of-Clyde-tone | Allocate dedicated copy-pass before wave 2 closes; can borrow phrasing from existing `home.faq` + `skills-*` copy patterns |
| Resend deliverability for assessment-result mail (image-heavy if we add skill icons) | Use SVG-inline + system fonts; test with Mail Tester before launch |
| Persona thresholds need real-data calibration | Ship with research-based thresholds (`<40 / 40-69 / 70+`); review after 50 completions; thresholds live in `scoring.ts` for easy adjustment |
| Anonymous-start ⇒ refresh = restart | Acceptable: 5-min assessment is short; documented in copy ("een keer de tijd nemen") |
| Cookie consent must precede GA load | Already handled by gating GTM Script behind consent-state in step 4.2-4.3 |
| Email mismatch between assessment + existing newsletter signups | Use `INSERT ... ON CONFLICT(email) DO UPDATE SET assessment_*` so a returning subscriber's row gets enriched, not duplicated |

## 11. Verification criteria (definition of done)

- [ ] `/assessment` route reachable in all 3 locales
- [ ] All 16 questions render with localised text, single-select and Likert variants both work
- [ ] Progress bar updates correctly, accessible (aria-valuenow)
- [ ] Persona correctly derived in unit tests across boundary inputs
- [ ] Email POST persists `assessment_*` columns + sends confirm mail
- [ ] Confirm-link triggers result-mail with correct persona/scores/skills
- [ ] Result-mail apply-CTA includes UTM and lands on /apply
- [ ] All 10 GA events fire in correct order (debug-view checked)
- [ ] Cookie consent gates GTM load
- [ ] `npm run build` passes
- [ ] LeadMagnetCTA across home/pricing/founding/blog points to /assessment
- [ ] No `futuremarketingai.com` reintroduced anywhere
- [ ] All NL copy reviewed: no em-dashes, voice-of-Clyde tone
- [ ] Each wave committed atomically with why-focused message

## 12. Out-of-scope (deliberate)

- PDF generation server-side (HTML email is sufficient; PDF is a follow-on if conversion data warrants)
- A/B test of different intro copy
- Save & resume across sessions (refresh = restart)
- Industry-segmented question paths
- Bureau-size segmented thresholds (one global Explorer/Builder/Operator scale)
- Admin dashboard for assessment analytics (use Supabase Studio + GA)
- Drip-sequence after delivery (single result-mail; nurture handled by existing newsletter cadence)

## 13. Rollout

1. Land all 4 waves on `feature/ai-readiness-assessment` branch
2. PR review (self + run `/code-review`)
3. Merge to `main` → Vercel preview → smoke test on preview URL
4. Promote to production
5. Update `MEMORY.md` index entry under `project_*` with launch date + initial conversion metric placeholder
