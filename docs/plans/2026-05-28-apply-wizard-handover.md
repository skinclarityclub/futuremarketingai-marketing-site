# /apply Qualification Wizard — Handover

**Sessie**: 2026-05-28
**Status**: MVP LIVE op `main` (HEAD = `670102b`)
**Volgende sessie**: testing-playbook full E2E + edge-case shaking

---

## Wat er live staat (commit `670102b`)

23 files changed, 2275 insertions:

### Nieuwe libs (`src/lib/apply/`)
- `types.ts` — WizardStep, IdentityFields, QualificationAnswers, AssessmentHandoff, ApplyWizardSubmission/Response, ApplyScoreBreakdown
- `questions.ts` — SSoT scoring matrix (TIER_POINTS, REVENUE_POINTS, CLIENT_COUNT_POINTS, likertMaturityPoints, URGENCY_POINTS, STAGE_BASELINE, MAX_SCORE_FULL=17, MAX_SCORE_HANDOFF=12, QUALIFIED_THRESHOLD=7)
- `scoring.ts` — pure `scoreApplication()` + `formatScorePrefix()` voor problem-column prefix
- `store.ts` — Zustand store met sessionStorage persist (`fmai-apply-wizard-v1`), partialize + nextStep/prevStep helpers

### Nieuwe componenten (`src/components/apply/`)
- `ApplyWizardClient.tsx` — orchestrator met AnimatePresence step-machine + URL-param/sessionStorage handoff-detection + submit handler
- `WizardProgress.tsx` — sticky progress bar mirror van AssessmentProgress
- `ApplyOptionButton.tsx` — variant zonder a-d letter-constraint (voor 5-opt single)
- `IdentityStep.tsx` — Step 1 (name/email/agency/role) met per-veld Zod-style validation
- `ScanCheckStep.tsx` — Step 2 (yes/no choice + auto-detect banner)
- `QualificationStep.tsx` — Step 3a (5 vragen, hergebruikt LikertScale)
- `ScanSummaryStep.tsx` — Step 3b (read-only handoff card + Q1+Q5 nog asked)
- `ProblemStep.tsx` — Step 4 (textarea, char counter)
- `ResultBranchA.tsx` — Branch A (qualified, ApplyCalendlyInline prefill)
- `ResultBranchB.tsx` — Branch B (review, 3-step "wat gebeurt nu")

### Gemodificeerd
- `src/app/[locale]/(marketing)/apply/page.tsx` — vervangt 2-col ApplicationForm met single-col ApplyWizardClient. Hero behouden.
- `src/app/api/apply/route.ts` — accepteert BEIDE legacy + wizard payload shapes via `'identity' in body` discriminator. Server rescore via `scoreApplication()`. Score prefix in problem-column.
- `src/lib/email/apply-templates.ts` — ApplyPayload uitgebreid met score/branch/assessment/urgency/maturity. Admin template heeft prominent branch-banner. Applicant template branch-aware (qualified vs review).
- `src/components/assessment/ResultReveal.tsx` — nieuwe amber "Aanvragen met deze scan" CTA-section met deep-link.

### i18n (3 locales synchroon)
- `apply.wizard.*` namespace: ~40 keys per locale (progress, identity, scanCheck, qualification, scanSummary, problem, result, errors)
- `assessment.result.applyCta.*`: 4 keys per locale (eyebrow, title, body, button)

---

## Verification done in deze sessie

| Test | Result |
|---|---|
| 3/3 locales `/apply` HTTP 200 | ✓ |
| API smoke: ideal-fit (growth/1m_3m/5_15/maturity=4/30days+problem) | 15/17 → qualified ✓ |
| API smoke: low-fit (unsure/under_300k/solo/maturity=1/explore) | 1/17 → review ✓ |
| API smoke: handoff (data-led/scaling + growth/30days) | 8/12 → qualified ✓ |
| Mobile e2e 2 scenarios × 3 locales | 6/6 saved, 0 JS errors |

---

## Wat volgende sessie MOET testen (testing-playbook full E2E)

### Critical path (manual E2E in browser)

1. **Cold-start zonder scan** (NL/EN/ES elk apart):
   - Visit `/{locale}/apply`
   - Fill Identity → Next
   - Scan check: kies "Nee" → Qualification
   - Fill alle 5 vragen → Next
   - Fill problem (200+ chars) → Submit
   - Verify Branch A (qualified) toont Calendly inline met prefill name+email
   - Verify console 0 errors

2. **Cold-start LOW-fit** (verify Branch B):
   - Idem maar kies low-fit answers (unsure/under_300k/solo/maturity=1/explore/geen problem)
   - Verify Branch B (review) thank-you screen toont, GEEN Calendly

3. **Assessment handoff via URL params**:
   - Visit `/nl/apply?from=assessment&a=data-led&st=scaling&lc=tools`
   - Verify ScanCheck step auto-detect banner "Scan-resultaat gevonden"
   - Kies "Ja, gebruik mijn scan"
   - Verify ScanSummary step toont Stage/Archetype/Zwakste
   - Vul Q1 (tier) + Q5 (urgency) → Submit
   - Verify score klopt (stage baseline + Q1 + Q5)

4. **Assessment handoff via sessionStorage** (HARDER):
   - Visit `/nl/assessment` → complete scan (16 vragen) → email gate → submit
   - Klik nieuwe amber "Aanvragen met deze scan" CTA
   - Verify deep-link werkt en pre-vult handoff state

5. **Vorige knop tussen stappen**:
   - Vul step 1 → next → step 2 → next → step 3 (zonder scan)
   - Klik "← Vorige" terug naar identity
   - Verify identity-velden NOG gevuld zijn (Zustand persist)

6. **Refresh midden-flow**:
   - Begin flow, kom in qualification
   - Hard-refresh (Ctrl+Shift+R)
   - Verify user landt op SAME step met SAME state (sessionStorage rehydrate)

7. **Mobile flow**:
   - 390px viewport, doe alle 5 stappen
   - Verify sticky WizardProgress bovenaan zichtbaar
   - Verify per-step buttons (Vorige/Volgende) full-width tappable

8. **Honeypot anti-spam**:
   - Manueel via DevTools: vul `website` field → submit
   - Verify HTTP 200 maar GEEN DB row + GEEN email (server-side silently accepted)

### Email verification (require real Resend send)

- Trigger qualified submission → check Resend dashboard:
  - Admin mail krijgt **groene Branch A banner met score 15/17**
  - Applicant mail krijgt qualified copy "Based on your context this looks like a strong fit"
- Trigger review submission → check Resend dashboard:
  - Admin mail krijgt **oranje Branch B banner met score 1/17**
  - Applicant mail krijgt review copy "I review personally within 3 business days"

### Supabase verification

- Query `applications` tabel na elke submit:
  ```sql
  SELECT name, email, agency, problem, created_at
  FROM applications
  ORDER BY created_at DESC
  LIMIT 5;
  ```
- Verify `problem` kolom heeft prefix-format:
  ```
  [score:15/17][branch:qualified][from:assessment][a:data-led][st:scaling][lc:tools]

  Originele problem tekst hier...
  ```

### Edge cases to verify

1. **Empty problem field** + low scores → bonus niet toegekend
2. **Problem exactly 199 chars** → geen bonus
3. **Problem exactly 200 chars** → +1 bonus
4. **Q4 likert score 5** → 4 points (highest)
5. **Q4 likert score 1** → 0 points (lowest)
6. **Q1 tier "founding"** vs "growth" vs "unsure" → 3 vs 2 vs 0 points
7. **Calendly URL malformed** in env → fallback link in ResultBranchA werkt
8. **Network failure during submit** → submitError shown, kan retry
9. **Rate limit hit** (multiple rapid submits) → 429 response handled gracefully
10. **Invalid URL params** (bv `?a=invalid`) → handoff niet toegepast, treat as cold-start

### TS + Lint + Build

```bash
npx tsc --noEmit    # mag 1 pre-existing error in audit-v2-lighthouse.spec.ts hebben
npm run lint        # clean
npm run build       # success
```

---

## Bekende beperkingen (NIET fixen, Phase B)

1. **Geen DB-migratie** — score+branch zit nu in `problem` column als prefix. Voor analytics queries handig om kolommen `qualification_score INT`, `qualified BOOLEAN`, `qualification_branch TEXT`, `assessment_archetype TEXT`, `assessment_stage TEXT` toe te voegen.

2. **Geen GA4 step-events** — alleen `calendly_load` bestaat. Voor funnel-drop-off analytics moet er per step `wizard_step_completed` event komen.

3. **Single Calendly URL** — `NEXT_PUBLIC_CALENDLY_APPLY_URL` env, geen tier-specifieke routing. Voor Phase B: 4 env vars per tier.

4. **Geen A/B threshold** — `QUALIFIED_THRESHOLD = 7` is hardcoded. Eerste 2-3 weken data verzamelen, dan tuning.

5. **Honeypot only, geen captcha** — `website` field + IP-rate-limit. Goed genoeg voor B2B leads, geen mass-spam.

6. **Geen Calendly webhook handler** — Daley krijgt nu admin email bij submit, geen separate notification bij booking-confirmed. Phase B: webhook in `/api/webhooks/calendly`.

7. **ScanSummaryStep `lowestCategory` toont raw enum** (tools/data/strategy/team) — geen i18n vertaling op die specifieke label. Phase B: koppel `assessment.categories.*` keys.

---

## Branch state bij handover

- **main HEAD**: `670102b` feat(apply): qualification wizard + score-based branching + scan handoff
- **Branch synced** met `origin/main`
- **Working tree mod**:
  - `playwright-report/index.html` (orphan, niet committen)
  - `src/lib/chatbot/tools/concierge-tools.ts` (user WIP, niet committen)
  - `src/lib/chatbot/tools/leadgen-tools.ts` (user WIP, niet committen)
  - `test-results/.last-run.json` (orphan)
  - `tsconfig.json` (whitespace formatting, niet committen)
- **Untracked** (orphan, niet committen):
  - PNGs van screenshots (apply-wizard-*.png, util-*.png, etc.)
  - `.mobile-test/`, `.audit-reports/`, `.clyde-verify/`
  - Plan docs in `docs/plans/2026-05-27-*.md` (user-created, leave alone)

---

## Resume-prompt voor volgende sessie

```
Lees C:\Users\daley\Desktop\Futuremarketingai\docs\plans\2026-05-28-apply-wizard-handover.md

Apply wizard MVP is live op main (670102b). We gaan nu full E2E testen met
testing-playbook en alles laten werken voordat we afsluiten.

Pre-flight (verplicht):
1. cd C:/Users/daley/Desktop/Futuremarketingai/fmai-nextjs
2. git status --short (main moet schoon — chatbot WIP + tsconfig formatting OK te negeren)
3. git pull origin main
4. node scripts/dev.mjs (background)
5. Wacht tot http://localhost:3000/nl/apply 200 geeft

Procedure:
1. Roep testing-playbook skill aan
2. Volg de Critical Path E2E (8 scenarios) uit deze handover
3. Email verification (echte Resend test) — alleen als RESEND_API_KEY gezet is
4. Supabase verification via mcp__supabase tools
5. Edge cases (10 items)
6. TS + Lint + Build
7. Fix elke bug die opduikt, atomic commits per fix
8. Wanneer alles groen: commit + push + update walkthrough doc

Conventies (kritisch):
- Geen em-dashes in user-facing copy
- Founding €997 = MAANDPRIJS met levenslang gelockt tarief
- i18n ALTIJD 3 locales synchroon
- Atomic commits per fix
- Mobile-test verplicht na elke fix
- Geen scope-creep — alleen bugs fixen, geen feature-toevoegingen
```

---

## Quick links

- Plan doc: `C:\Users\daley\.claude\plans\oke-de-volgende-pagina-enchanted-valley.md`
- Walkthrough doc (Wave 1-4): `docs/plans/2026-05-26-post-nightshift-walkthrough.md`
- Memory: `project_pricing_founding_lifetime_lock.md`, `feedback_no_em_dashes.md`, `feedback_mobile_test_per_page.md`
