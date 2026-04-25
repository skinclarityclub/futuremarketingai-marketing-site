---
phase: 10-production-integrity-domain-ssot
verified: 2026-04-25T08:30:00Z
status: human_needed
score: 27/28 must-haves verified (1 deferred to production deploy)
human_verification:
  - test: "Production deploy + real form submission against future-marketing.ai/nl/apply"
    expected: "Vercel env vars set in Production scope (RESEND_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, IP_HASH_SALT, APPLY_EMAIL_TO/FROM, CONTACT_EMAIL_TO/FROM); after `git push origin main` and Vercel deploy, submit one real test application; within 60s admin email lands at hello@future-marketing.ai, applicant confirmation email lands at submitter address, Supabase applications table has new row with hashed IP, Upstash counters increment for the IP."
    why_human: "Requires Vercel dashboard env-var configuration (cannot script without Vercel API token + project secret) and a real outbound network roundtrip against production Resend/Supabase/Upstash. User explicitly approved deferral of plan 10-02 Task 8 in 10-02-SUMMARY."
---

# Phase 10: Production Integrity + Domain SSoT Verification Report

**Phase Goal (ROADMAP.md):** close P0 audit blockers — domain/email SSoT, lost form submissions, stale chatbot/llms.txt, Next.js 16 hygiene + 7 npm CVEs.

**Verified:** 2026-04-25T08:30:00Z
**Status:** human_needed (1 deferred production-deploy verification, all code green)
**Re-verification:** No (initial verification)
**Phase requirement:** AUDIT-BLOCKER-P0-INTEGRITY

---

## Goal Achievement

### Plan 10-01 — Domain + Email SSoT

| #   | Must-have                                                                                                                                                            | Status     | Evidence                                                                                                                                                                                                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `grep -rn 'futuremarketingai\.com' fmai-nextjs/src fmai-nextjs/messages fmai-nextjs/.env.example` returns 0                                                          | ✓ VERIFIED | Empty grep result. Extended grep across `public/` also returns 0.                                                                                                                                                 |
| 2   | `seo-config.ts` exports `SITE_URL = 'https://future-marketing.ai'` (apex) + `ORG_EMAIL = 'hello@future-marketing.ai'`                                                | ✓ VERIFIED | `fmai-nextjs/src/lib/seo-config.ts:1` `SITE_URL = 'https://future-marketing.ai'` ; `:3` `ORG_EMAIL = 'hello@future-marketing.ai'`. No `www.` anywhere.                                                             |
| 3   | All three locale files (nl/en/es) use canonical domain + hello@ for customer-facing copy                                                                             | ✓ VERIFIED | `messages/{nl,en,es}.json` line 822 each: `"email_address": "hello@future-marketing.ai"`. Customer-facing fallback at line 1569 in all three: `errorNetwork` uses `hello@future-marketing.ai`. No `.com` matches. |
| 4   | `privacy@future-marketing.ai` retained ONLY on legal page                                                                                                            | ✓ VERIFIED | All `privacy@` occurrences confined to `legal.privacy_policy.*` keys (lines 865, 907, 915 in each locale) — privacy policy contact, GDPR rights, data controller sections. No customer-facing copy uses privacy@. |
| 5   | Both CLAUDE.md files (root + fmai-nextjs/) document the canonical domain rule                                                                                        | ✓ VERIFIED | Root `CLAUDE.md:5`: "Canonical domain (2026-04-24 unified): https://future-marketing.ai. Any legacy futuremarketingai.com in git history is 301-redirected at the Vercel edge." `fmai-nextjs/CLAUDE.md:147,151`: identical rule + production note. |
| 6   | `.env.example` uses canonical domain                                                                                                                                 | ✓ VERIFIED | Lines 9, 17, 18, 21, 22 all use `future-marketing.ai`. `NEXT_PUBLIC_SITE_URL=https://future-marketing.ai`.                                                                                                        |
| 7   | LIVE PRODUCTION: apex serves directly, www → 308 to apex                                                                                                             | ✓ VERIFIED | Confirmed by orchestrator via curl (recorded: `future-marketing.ai` serves 200, `www.future-marketing.ai` serves 308 redirect to apex).                                                                            |

**Plan 10-01 score:** 7/7 PASS

### Plan 10-02 — Apply + Contact API wired

| #   | Must-have                                                                                                            | Status     | Evidence                                                                                                                                                                                                                                                  |
| --- | -------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `apply/route.ts` imports Resend, Supabase service-role, Upstash ratelimit                                            | ✓ VERIFIED | `fmai-nextjs/src/app/api/apply/route.ts:3` `import { Resend } from 'resend'`; `:5` `import { applyRateLimit } from '@/lib/ratelimit'`; `:6` `import { supabaseAdmin } from '@/lib/supabase-admin'`. Pipeline: rate-limit → Zod → DB insert → 2× Resend parallel. |
| 2   | `contact/route.ts` imports Resend, Supabase service-role, Upstash ratelimit                                          | ✓ VERIFIED | `fmai-nextjs/src/app/api/contact/route.ts:3` Resend; `:5` `contactRateLimit`; `:6` `supabaseAdmin`. Same pipeline shape against `contact_submissions` table.                                                                                              |
| 3   | No wildcard CORS                                                                                                     | ✓ VERIFIED | `grep -rn 'Access-Control-Allow-Origin'` over `src/` and `next.config.ts` returns 0. SUMMARY records OPTIONS handler + corsHeaders deleted (commit `316ea0e`). Live smoke probe #6 confirmed OPTIONS /api/contact returns 204 with no CORS header.       |
| 4   | Build-safe init pattern (build doesn't crash on missing env)                                                         | ✓ VERIFIED | Pattern chosen: **placeholder fallback**, not `getResend/getSupabase/getRatelimit` getter functions. `apply/route.ts:35` `new Resend(process.env.RESEND_API_KEY ?? 're_placeholder')`. `supabase-admin.ts:32` `createClient(url ?? 'https://placeholder.supabase.co', key ?? 'placeholder-key', ...)`. **Goal achieved**: `npm run build` passes 87/87 static pages even when env is absent (per 10-02-SUMMARY auto-fix `4881611`). The verification spec's grep pattern would have flagged this as missing, but the goal (build-safe instantiation) is met via a different valid pattern. |
| 5   | Live smoke test results in 10-02-SUMMARY (200 valid, 422 invalid, 429 after 5/10m, no error logs)                    | ✓ VERIFIED | 10-02-SUMMARY records 6 smoke probes against running endpoint on :3001 (2026-04-25T01:13Z): #1 valid apply 200 in 2.1s; #2 valid contact 200 in 1.8s; #3 invalid 422 with field errors; #4 5/10m sliding window enforced; #5 X-RateLimit-* headers present; #6 OPTIONS no CORS. Zero error logs on dev console. |
| 6   | Production env vars NOT yet in Vercel (Task 8 deferred)                                                              | ⚠ DEFERRED | Documented in 10-02-SUMMARY "Task 8 — Production Verification (deferred to next deploy)". User explicitly approved deferral. **NOT a gap, surfaced as the single human-verification item.**                                                                |

**Plan 10-02 score:** 5/5 code PASS; 1 deferred (production deploy + real submission)

### Plan 10-03 — Chatbot + llms.txt aligned to v10

| #   | Must-have                                                                                                                                                                | Status     | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `tool-data.ts` exists, exports CHATBOT_TIERS                                                                                                                             | ✓ VERIFIED | `fmai-nextjs/src/lib/chatbot/tool-data.ts` (99 lines). Lines 13–96 export `CHATBOT_TIERS` with all 5 v10 tiers (partner 347, growth 2497, professional 4497, enterprise 7997, founding 997).                                                                                                                                                                                                                                  |
| 2   | CHATBOT_TIERS is the single import for chatbot pricing tools (no hardcoded prices in tool consumers)                                                                     | ✓ VERIFIED | `leadgen-tools.ts:3` `import { CHATBOT_TIERS, type ChatbotTierKey } from '@/lib/chatbot/tool-data'`; `:97` `return { tiers: CHATBOT_TIERS }`. Note: spec said "imported from skills-data.ts" but the actual decision (10-03-SUMMARY decision #1) is a separate frozen v10 snapshot module that **mirrors** `fma-app/src/lib/skills.ts` AGENT_TIERS rather than imports skills-data. Goal (single chatbot pricing SSoT) achieved. |
| 3   | llms.txt + llms-full.txt list 12 skills (9 live + 3 coming_soon)                                                                                                         | ✓ VERIFIED | `public/llms.txt` lines 25–36 list all 12 skill links with Live/Coming-soon labels. `public/llms-full.txt` lines 35–195 contain 12 H3-level skill sections (Social Media, Blog Factory, Ad Creator, Reel Builder, Voice Agent, Lead Qualifier, Email Management, ManyChat DM, Reporting and Analytics, SEO/GEO Analyst, Research, Clyde Orchestrator).                                                                          |
| 4   | llms.txt + llms-full.txt list 5 tiers (€347/€2.497/€4.497/€7.997/€997)                                                                                                   | ✓ VERIFIED | `llms.txt:15-16` enumerate tiers in pricing summary. `llms-full.txt:202-242` have 5 H3 tier sections (Partner 347, Growth 2,497, Professional 4,497, Enterprise 7,997, Founding 997).                                                                                                                                                                                                                                          |
| 5   | All URLs in `public/llms*.txt` use `https://future-marketing.ai/` (apex, no www)                                                                                         | ✓ VERIFIED | Count: llms.txt has 32 occurrences of `https://future-marketing.ai`, llms-full.txt has 6+ (only counted in the body text via grep `-c future-marketing.ai`). Zero `www.future-marketing.ai` matches. Zero `futuremarketingai.com` matches.                                                                                                                                                                                    |
| 6   | grep `futuremarketingai\.com` over `public/llms*.txt` returns 0                                                                                                          | ✓ VERIFIED | Empty grep result.                                                                                                                                                                                                                                                                                                                                                                                                              |
| 7   | grep v9 prices `1\.497|1497` over `src/lib/chatbot/` returns 0                                                                                                           | ✓ VERIFIED | Empty grep result. SUMMARY also records ROI default bumped from 1497 (v9 Growth) to 2497 (v10 Growth).                                                                                                                                                                                                                                                                                                                          |

**Plan 10-03 score:** 7/7 PASS

### Plan 10-04 — Next.js 16 Hygiene

| #   | Must-have                                                                                                                                                  | Status     | Evidence                                                                                                                                                                                                                                                                                                                                                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `src/proxy.ts` exists; `src/middleware.ts` does NOT                                                                                                        | ✓ VERIFIED | `ls fmai-nextjs/src/proxy.ts` succeeds. `ls fmai-nextjs/src/middleware.ts` returns "No such file or directory".                                                                                                                                                                                                                                                                                  |
| 2   | Vercel Speed Insights mounted in layout                                                                                                                    | ✓ VERIFIED | `fmai-nextjs/src/app/[locale]/layout.tsx:17` `import { SpeedInsights } from '@vercel/speed-insights/next'`; `:76` `<SpeedInsights />` rendered as last child of `<body>`.                                                                                                                                                                                                                       |
| 3   | /api/vitals beacon replaced with Speed Insights component                                                                                                  | ✓ VERIFIED | Directory `fmai-nextjs/src/app/api/vitals` does NOT exist. SUMMARY confirms beacon removed in commit `afc804e` and replaced by SpeedInsights component (commit `5a682bd`). `lib/web-vitals.ts` no longer calls `navigator.sendBeacon('/api/vitals', ...)`.                                                                                                                                       |
| 4   | `npm audit` 0 high/critical                                                                                                                                 | ✓ VERIFIED with note | Live `npm audit --json`: `"high": 0, "critical": 0, "moderate": 3, "total": 3`. The 3 moderate are post-phase registry drift: `resend@^6.12.2` pulls `svix` which depends on `uuid<14` (advisory GHSA-w5hq-g745-h8pq disclosed after the phase audit). The phase requirement of "0 high/critical CVEs" is met. The original "7 CVEs" cited by the audit are closed. **Recommend a follow-up dependabot pass to bump resend if/when a non-major fix lands; current `fixAvailable.isSemVerMajor=true` so cannot be auto-applied without API review.** |
| 5   | CSP header tightened in `next.config.ts`                                                                                                                   | ✓ VERIFIED | `next.config.ts:34-35` Content-Security-Policy header active with strict directives (`default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `connect-src` no longer lists `https://api.anthropic.com`). SUMMARY confirms commit `c5b5c12` dropped Anthropic from connect-src.                                                                                                       |
| 6   | Permissions-Policy includes `microphone=(self)`                                                                                                            | ✓ VERIFIED | `next.config.ts:61` `value: 'camera=(), microphone=(self), geolocation=(), browsing-topics=()'`. Comment line 58: "microphone=(self) so the /skills/voice-agent ElevenLabs demo can request mic access on same-origin".                                                                                                                                                                          |

**Plan 10-04 score:** 6/6 PASS

### Phase Artifacts

| #   | Must-have                                              | Status     | Evidence                                                                          |
| --- | ------------------------------------------------------ | ---------- | --------------------------------------------------------------------------------- |
| 1   | All four SUMMARY.md files exist for plans 10-01..04    | ✓ VERIFIED | `10-01-SUMMARY.md`, `10-02-SUMMARY.md`, `10-03-SUMMARY.md`, `10-04-SUMMARY.md` all present in `.planning/phases/10-production-integrity-domain-ssot/`. |
| 2   | STATE.md shows Phase 10 progress as 4/4                | ✓ VERIFIED | `STATE.md`: "Phase 10: [██████████] 4/4 (code), production verification pending"; per-plan rows for P01/P02/P03/P04 with file/task counts.            |
| 3   | ROADMAP.md shows Phase 10 as Complete                  | ✓ VERIFIED | `ROADMAP.md`: `[x] Phase 10: Production Integrity + Domain SSoT … (completed 2026-04-25)`. Phase 14/15 entries mark Phase 10 as a dependency (now closed). |

**Artifacts score:** 3/3 PASS

---

## Required Artifacts (consolidated)

| Artifact                                                            | Expected                                                            | Status      | Details                                                                                                                                                            |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fmai-nextjs/src/lib/seo-config.ts`                                 | exports `SITE_URL`, `ORG_EMAIL`, `SITE_NAME`, `ENTITY_DESCRIPTION`  | ✓ VERIFIED  | Apex SITE_URL, hello@ ORG_EMAIL.                                                                                                                                   |
| `fmai-nextjs/src/lib/ratelimit.ts`                                  | shared Upstash factory, applyRateLimit + contactRateLimit, 5/10m    | ✓ VERIFIED  | Sliding window 5 req/10m, prefix `fmai:ratelimit:apply` and `fmai:ratelimit:contact`.                                                                              |
| `fmai-nextjs/src/lib/supabase-admin.ts`                             | server-only, service_role, build-safe placeholder                   | ✓ VERIFIED  | `import 'server-only'`, placeholder fallback `https://placeholder.supabase.co`.                                                                                    |
| `fmai-nextjs/src/lib/email/{apply,contact}-templates.ts`            | NL/EN/ES HTML email templates                                       | ✓ VERIFIED  | Imported by both API routes (verified via route imports).                                                                                                          |
| `fmai-nextjs/src/app/api/apply/route.ts`                            | full pipeline: rate-limit → Zod → Supabase → 2× Resend parallel     | ✓ VERIFIED  | All 5 stages present (lines 48–141). Honeypot at line 79.                                                                                                          |
| `fmai-nextjs/src/app/api/contact/route.ts`                          | same pipeline, no OPTIONS handler, no CORS headers                  | ✓ VERIFIED  | OPTIONS handler removed; no `Access-Control-Allow-Origin` anywhere.                                                                                                |
| `fmai-nextjs/src/lib/chatbot/tool-data.ts`                          | CHATBOT_TIERS export with all 5 v10 tiers                           | ✓ VERIFIED  | All prices match v10 (347/2497/4497/7997/997).                                                                                                                     |
| `fmai-nextjs/public/llms.txt`                                       | llmstxt.org spec, 12 skills, 5 tiers, apex URLs                     | ✓ VERIFIED  | 32 apex URL occurrences, 0 .com refs, 0 www refs.                                                                                                                  |
| `fmai-nextjs/public/llms-full.txt`                                  | ~2500 word v10 long-form, 12-skill section, 5-tier section          | ✓ VERIFIED  | 12 H3 skill headers, 5 H3 tier headers, AVG/EU AI Act compliance section.                                                                                          |
| `fmai-nextjs/src/proxy.ts`                                          | Next.js 16 proxy convention                                         | ✓ VERIFIED  | File exists, `middleware.ts` removed.                                                                                                                              |
| `fmai-nextjs/src/app/[locale]/layout.tsx`                           | imports + mounts `<SpeedInsights />`                                | ✓ VERIFIED  | Line 17 import, line 76 render.                                                                                                                                    |
| `fmai-nextjs/next.config.ts`                                        | tightened CSP + microphone=(self) Permissions-Policy                | ✓ VERIFIED  | Both directives present, api.anthropic.com removed from connect-src.                                                                                               |

---

## Key Link Verification

| From                                            | To                                              | Via                                                                          | Status   | Details                                                                                                                                  |
| ----------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| ApplicationForm (UI)                            | `/api/apply`                                    | client `fetch('/api/apply', { method: 'POST', body: ... })`                  | WIRED    | API endpoint exists, full pipeline live, smoke probe #1 confirmed 200 with full pipeline.                                              |
| ContactForm (UI)                                | `/api/contact`                                  | client `fetch('/api/contact', ...)`                                          | WIRED    | Smoke probe #2 confirmed 200.                                                                                                            |
| `/api/apply`                                    | Supabase `applications` table                   | `supabaseAdmin.from('applications').insert(...)`                             | WIRED    | Lines 96–108 of apply route. 10-02-MIGRATION.sql applied (per SUMMARY).                                                                  |
| `/api/contact`                                  | Supabase `contact_submissions` table            | `supabaseAdmin.from('contact_submissions').insert(...)`                      | WIRED    | Lines 76–84 of contact route.                                                                                                            |
| `/api/{apply,contact}`                          | Resend (admin + confirmation emails)            | `resend.emails.send(...)` × 2 in `Promise.all`                               | WIRED    | Both routes invoke Resend twice in parallel. SUMMARY notes localized subjects per locale.                                                |
| `/api/{apply,contact}`                          | Upstash sliding-window counter                  | `applyRateLimit.limit(ip)` / `contactRateLimit.limit(ip)`                    | WIRED    | Counter survives cross-isolate concurrency on Vercel Fluid Compute. Smoke probe #4 confirmed 5/10m policy.                              |
| Chatbot `leadgen-tools`                         | `CHATBOT_TIERS` (v10 SSoT)                      | `import { CHATBOT_TIERS } from '@/lib/chatbot/tool-data'`                    | WIRED    | Line 3 import, line 97/99 usage. No hardcoded prices in tool body.                                                                       |
| Chatbot `concierge-tools`                       | `SKILLS_DATA` (skill metadata SSoT)             | dynamic read from skills-data, `get_skills` tool                              | WIRED    | SUMMARY confirms `get_services` renamed to `get_skills`, sources from SKILLS_DATA.                                                       |
| `[locale]/layout.tsx`                           | Vercel Speed Insights endpoint                  | `<SpeedInsights />` component from `@vercel/speed-insights/next`              | WIRED    | Mounted as sibling of `NextIntlClientProvider`.                                                                                          |
| `next.config.ts` headers                        | All routes (`/(.*)`)                            | `async headers() { return [{ source: '/(.*)', headers: securityHeaders }] }` | WIRED    | CSP + Permissions-Policy + HSTS + X-Frame-Options + Referrer-Policy applied globally.                                                    |

All 10 key links WIRED.

---

## Requirements Coverage

| Requirement                  | Source Plan(s)               | Description                                                                                          | Status      | Evidence                                                                                                                                                                            |
| ---------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUDIT-BLOCKER-P0-INTEGRITY   | 10-01, 10-02, 10-03, 10-04   | Close P0 audit blockers: domain SSoT, lost form submissions, stale chatbot, Next.js 16 hygiene + 7 CVEs | ✓ SATISFIED | All four plans complete; P0 surface-level integrity restored. Forms persist + email; chatbot prices truthful; llms.txt v10 spec; CSP/Permissions-Policy tightened; engines.node pinned; postcss override resolves the 7 original CVEs. Production env vars + 1 real production submission deferred to user (single human-verification item). |

No orphaned requirements detected (REQUIREMENTS.md only assigns AUDIT-BLOCKER-P0-INTEGRITY to Phase 10 and all four plans claim it).

---

## Anti-Patterns Found

None.

- No TODO/FIXME/PLACEHOLDER comments in routes or libs touched by this phase.
- No `return null` / empty-handler stubs in API routes (full pipeline implemented).
- No `console.log`-only handlers.
- No `Access-Control-Allow-Origin: *` anywhere.
- No `any` types or `@ts-ignore` introduced.
- No Map-based / setInterval rate-limit code remains in chatbot.

The placeholder fallback (`'re_placeholder'`, `'placeholder-key'`, `'https://placeholder.supabase.co'`) is **intentional** per the auto-fix decision in 10-02 to keep `next build` page-data collection green pre-provisioning. Real-runtime errors still surface via `dbError` / `adminResult.error` / `confirmationResult.error` log branches and a startup `console.warn` in `supabase-admin.ts`. Documented and not a stub.

---

## Human Verification Required

### 1. Production deploy + real form submission

**Test:**
1. In Vercel dashboard for project `fmai-nextjs`, set the following env vars in the **Production** scope (and Preview if needed):
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `IP_HASH_SALT`
   - `APPLY_EMAIL_TO=hello@future-marketing.ai`
   - `APPLY_EMAIL_FROM=apply@future-marketing.ai`
   - `CONTACT_EMAIL_TO=hello@future-marketing.ai`
   - `CONTACT_EMAIL_FROM=contact@future-marketing.ai`
   Verify via `vercel env ls` that all 10 are present in Production.
2. `git push origin main`. Wait for Vercel deployment to land.
3. Visit `https://future-marketing.ai/nl/apply`. Submit a real test application using your own email.
4. Repeat once for `https://future-marketing.ai/nl/contact`.
5. Within 60s, in Vercel Speed Insights dashboard verify the page-view + vitals events arrived.

**Expected:**
- HTTP 200 response from both forms (no 5xx or 4xx errors visible in dev tools network tab).
- Admin email lands at `hello@future-marketing.ai` for each submission, with full payload + reply-to set to submitter.
- Submitter receives a confirmation email (from `apply@` for /apply, `contact@` for /contact) localized to NL.
- Supabase Dashboard → Table Editor → `applications`: 1 new row with today's timestamp, hashed IP (64-char hex), name/email/agency/role/revenue/clientCount/tier/problem/locale columns populated.
- Supabase `contact_submissions`: 1 new row with name/email/company/message/locale columns populated.
- Upstash Console → Redis → Data Browser → `KEYS fmai:ratelimit:apply:*`: per-IP counter for your IP visible.
- Vercel Speed Insights dashboard: pageview + LCP/INP/CLS metrics for `/nl/apply` and `/nl/contact` populated.
- Resend dashboard → Logs: 4 outbound email events (admin × 2 + confirmation × 2), all `delivered`.

**Why human:** Requires Vercel dashboard access for env-var setup (no programmatic Vercel API token in scope), real outbound network roundtrip against production Resend/Supabase/Upstash, and visual confirmation of email delivery + Supabase row insertion. The plan author (10-02-SUMMARY "Task 8 — Production Verification (deferred to next deploy)") explicitly approved deferring this until the next deploy push, with the documented checklist as the verification contract.

---

## Gaps Summary

**No code-level gaps.** All four plans deliver their artifacts, all key links are wired, no anti-patterns, no orphaned requirements. The single outstanding item is the production deploy + real form submission (10-02 Task 8), which the user explicitly approved deferring.

### Notable observation — pattern variance vs. verification spec

The verification spec asked for two specific patterns that were chosen differently in execution. **Both deviations achieve the underlying goal**:

1. **Lazy-init via `function getResend/getSupabase/getRatelimit`** → executed as **placeholder fallback** at module-load. Same goal (build-safe page-data collection on missing env). Documented in 10-02-SUMMARY auto-fix #1 (`4881611`). Trade-off: simpler import shape, single placeholder warning at module load. The grep pattern `function getResend|function getSupabase|function getRatelimit` returns 0 hits, but the build-safety contract is met (verified via `npm run build` 87/87 static pages green per SUMMARY).

2. **`tool-data.ts` imports CHATBOT_TIERS from skills-data.ts** → executed as **frozen v10 snapshot** in `tool-data.ts` that mirrors `fma-app/src/lib/skills.ts` AGENT_TIERS rather than importing from local skills-data. Same goal (single chatbot pricing SSoT, no v9 drift). The skills metadata SSoT (skills-data.ts) and the tier pricing SSoT (tool-data.ts) are kept as separate concerns because they update on different cadences. Documented in 10-03-SUMMARY decision #1.

Neither variance constitutes a gap. They are documented intentional decisions captured in the SUMMARY frontmatter `key-decisions` and `patterns-established`.

### Notable observation — moderate npm CVEs (post-phase drift)

`npm audit` currently reports **3 moderate** vulnerabilities (resend → svix → uuid<14). All three are transitive through Resend's `svix` webhook helper (which is unused at runtime in this project — we only call `resend.emails.send`). The original "7 CVEs" the phase set out to close (incl. postcss XSS, picomatch, etc.) are all closed via Next 16.2.4 + the `overrides.postcss ^8.5.10` mechanism. The new moderate uuid CVE (GHSA-w5hq-g745-h8pq) was disclosed after Plan 10-04 ran its audit. **Phase contract ("0 high/critical") is still met.** Recommend a follow-up dependabot/manual bump when a non-major resend release ships (currently `fixAvailable.isSemVerMajor: true`, so it would be a major-version regression worth scheduling separately rather than auto-applying).

---

## Final Verdict

| Concern                          | Result                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| Plan 10-01 (Domain + Email SSoT) | ✓ 7/7 PASS                                                                                  |
| Plan 10-02 (API wiring)          | ✓ 5/5 code PASS (1 deferred to production deploy — explicit user approval)                  |
| Plan 10-03 (Chatbot + llms.txt)  | ✓ 7/7 PASS                                                                                  |
| Plan 10-04 (Next.js 16 hygiene)  | ✓ 6/6 PASS (with post-phase npm advisory drift on resend/svix/uuid — moderate only, not high/critical) |
| Phase artifacts (SUMMARY/STATE/ROADMAP) | ✓ 3/3 PASS                                                                            |
| Requirements coverage            | ✓ AUDIT-BLOCKER-P0-INTEGRITY satisfied                                                      |
| Key link wiring                  | ✓ 10/10 WIRED                                                                               |
| Anti-patterns                    | ✓ None                                                                                       |
| Production deploy + real submission | ⚠ 1 human-verification item (per user-approved deferral)                                  |

**Status: human_needed.** All code-level must-haves verified. Phase goal achieved at the code/repo level. The single outstanding item is a production-environment human task (Vercel env-var setup + real form roundtrip) that the user explicitly approved deferring to the next deploy push.

---

_Verified: 2026-04-25T08:30:00Z_
_Verifier: Claude (gsd-verifier)_
