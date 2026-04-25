---
phase: 10-production-integrity-domain-ssot
plan: 01
subsystem: infra
tags: [seo, domain, vercel, i18n, jsonld, canonical, metadata, redirect]

# Dependency graph
requires:
  - phase: 09-codebase-cleanup
    provides: clean Next.js 16 codebase without Vite legacy, single seo-config.ts source for canonical URL and org email
provides:
  - Single canonical SITE_URL = https://future-marketing.ai (apex) used by every JSON-LD, sitemap, canonical link, hreflang, OG card
  - Unified customer-facing email hello@future-marketing.ai, with privacy@future-marketing.ai retained only on the legal page
  - Apex-canonical Vercel domain config (www.future-marketing.ai 308-redirects to apex)
  - Documented Supabase / Upstash Redis / IP_HASH_SALT env vars in .env.example for plans 10-02 and 10-04
  - CLAUDE.md root + fmai-nextjs canonical-domain rule dated 2026-04-24 to block future regressions
affects: [10-02-forms-resend, 10-03-llms-txt, 10-04-hygiene, 11-eaa, 14-seo-geo, 15-conversion]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SITE_URL + ORG_EMAIL constants in src/lib/seo-config.ts as the single source of truth for every URL and email rendered by the app"
    - "Apex-canonical Vercel domain pattern (apex serves; www subdomain 308-redirects to apex) over the more common www-canonical pattern"

key-files:
  created: []
  modified:
    - fmai-nextjs/src/lib/seo-config.ts
    - fmai-nextjs/src/lib/og-image.tsx
    - fmai-nextjs/src/app/[locale]/layout.tsx
    - fmai-nextjs/src/app/[locale]/(marketing)/contact/page.tsx
    - fmai-nextjs/src/lib/chatbot/knowledge/concierge-kb.ts
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/es.json
    - fmai-nextjs/.env.example
    - CLAUDE.md
    - fmai-nextjs/CLAUDE.md

key-decisions:
  - "Apex `future-marketing.ai` is canonical, not www. Vercel primary swapped from www-redirects-to-apex to apex-serves-direct via REST PATCH to /v9/projects/futuremarketingai/domains/{domain}."
  - "Customer-facing email unified to hello@future-marketing.ai. info@, contact@, apply@ collapsed onto hello@ for any user-visible surface. apply@ retained as APPLY_EMAIL_FROM (server-side, Resend sender). privacy@ retained ONLY on the legal page per AVG / GDPR contact obligation."
  - "Skipped Task 7 (vercel.json infra-as-code redirects) — futuremarketingai.com is not a registered/owned domain, so redirect rules for it would be inert. The 54 stale references were aspirational typos, never live URLs."
  - "Concierge knowledge base treated as in-scope for the customer-facing email rule (Rule 3 auto-fix), not just a developer artifact. The KB is consumed by Clyde and is read aloud to prospects when they ask for contact details."
  - "PAGE_DATES['/legal'] bumped to 2026-04-24 to reflect freshness for the legal page now that contact details are unified."

patterns-established:
  - "Domain SSoT pattern: every URL and email rendered by the marketing site flows through src/lib/seo-config.ts. New pages use SITE_URL and ORG_EMAIL exports, never hardcode."
  - "Locale-mirror pattern: domain edits in messages/nl.json get mirrored to messages/en.json and messages/es.json on the same line numbers. Verified via per-locale grep counts (legacy=0, hello>=2, privacy>=3) instead of trusting bulk replace."
  - "CLAUDE.md as regression-prevention surface: red-flag rules + dated canonical statements catch future agents before they re-introduce a legacy URL."

requirements-completed: [PHASE-10]

# Metrics
duration: ~53min
completed: 2026-04-25
---

# Phase 10 Plan 01: Domain and Customer-Email SSoT Summary

**Unified the entire marketing site on `https://future-marketing.ai` (apex canonical) and `hello@future-marketing.ai`, swapped the Vercel primary domain from www to apex via REST API, and locked the rule into both CLAUDE.md operating manuals.**

## Performance

- **Duration:** ~53 min (includes 1 human-action checkpoint pause)
- **Started:** 2026-04-24T23:07:18Z
- **Completed:** 2026-04-25T00:00:40Z
- **Tasks:** 7 of 9 executed (Task 1 + Task 7 documented as N/A, see Deviations)
- **Files modified:** 11
- **Commits (this plan):** 5 (plus 4 unrelated 10-04 commits authored by parallel agent)

## Accomplishments

- `SITE_URL` flipped from `https://futuremarketingai.com` to `https://future-marketing.ai` in `src/lib/seo-config.ts`. Every JSON-LD entity, sitemap entry, canonical link, hreflang tag and Open Graph URL now resolves to the apex canonical.
- `ORG_EMAIL` unified onto `hello@future-marketing.ai`. The five-way split (`hello@`, `info@`, `contact@`, `apply@`, `privacy@`) collapsed to a single customer-facing inbox plus `privacy@future-marketing.ai` reserved for the legal page.
- All three locale message files (NL / EN / ES) cleaned of legacy domain. Verified per-locale: legacy=0, hello matches=2, privacy matches=3.
- `metadataBase`, OG card footer, contact page mailto, and Clyde concierge knowledge base all updated to canonical.
- `.env.example` rewritten: domain unified across all email vars, plus 5 new variables documented for plans 10-02 and 10-04 (Supabase URL + service role key, Upstash Redis URL + token, IP_HASH_SALT for AVG-compliant IP hashing).
- Vercel primary domain swapped from `www.future-marketing.ai` to `future-marketing.ai` (apex) via REST API. www now 308-redirects to apex.
- `npm run build` passes cleanly (Compiled successfully in 5.7s, 87 static pages).
- Both CLAUDE.md operating manuals updated with dated canonical-domain rules to prevent future regressions.

## Task Commits

Each task committed atomically:

1. **Task 2: Update seo-config.ts** - `0346709` (feat) — SITE_URL + ORG_EMAIL canonical; PAGE_DATES['/legal'] bump
2. **Task 3: OG image, layout metadataBase, contact mailto, Clyde KB** - `96e75a8` (feat) — 4 files unified plus Rule 3 auto-fix on concierge-kb.ts
3. **Task 4: NL/EN/ES locale message files** - `e7cef64` (content) — i18n unification, all three locales
4. **Task 5: .env.example** - `c935231` (chore) — domain + Supabase/Upstash/IP-hash documentation
5. **Task 6: CLAUDE.md (root and fmai-nextjs)** - `af7e952` (docs) — dated canonical rule + Red Flags entry

Tasks 1, 7, 8, 9: see Deviations section below.

## Files Created/Modified

- `fmai-nextjs/src/lib/seo-config.ts` — SITE_URL + ORG_EMAIL flipped to canonical; PAGE_DATES freshness bump
- `fmai-nextjs/src/lib/og-image.tsx` — OG card footer URL canonical
- `fmai-nextjs/src/app/[locale]/layout.tsx` — metadataBase canonical
- `fmai-nextjs/src/app/[locale]/(marketing)/contact/page.tsx` — mailto canonical
- `fmai-nextjs/src/lib/chatbot/knowledge/concierge-kb.ts` — Clyde KB contact email canonical (Rule 3 auto-fix)
- `fmai-nextjs/messages/nl.json` — `email_address` (contact block), `errorNetwork` (apply form), legal contact and DPA references
- `fmai-nextjs/messages/en.json` — same surfaces, EN locale
- `fmai-nextjs/messages/es.json` — same surfaces, ES locale
- `fmai-nextjs/.env.example` — domain unified across all email vars; 5 new env vars documented (Supabase, Upstash, IP_HASH_SALT)
- `CLAUDE.md` (repo root) — top-of-file dated canonical statement
- `fmai-nextjs/CLAUDE.md` — Environment line rewrite plus Red Flags entry forbidding hardcoded legacy domain

## Decisions Made

- **Apex over www as canonical.** The plan assumed apex was already primary. Reality: `www.future-marketing.ai` was primary and the apex was 307-redirecting to www. Since seo-config.ts now emits the apex as canonical, leaving www primary would have created a redirect chain (apex requested -> 307 to www -> served, but JSON-LD says apex is canonical). Orchestrator swapped via Vercel REST API: PATCH `/v9/projects/futuremarketingai/domains/future-marketing.ai` set `redirect: null` (now serves direct), PATCH `/v9/projects/futuremarketingai/domains/www.future-marketing.ai` set `redirect: "future-marketing.ai", redirectStatusCode: 308`. Verified: `https://future-marketing.ai/` -> 307 to `/en` (next-intl locale routing) -> 200 OK. `https://www.future-marketing.ai/` -> 308 -> apex -> /en -> 200 OK.
- **Skipped Task 7 (vercel.json infra-as-code redirects).** The plan called for redirect rules from `futuremarketingai.com` and `www.futuremarketingai.com` to the canonical. After execution Daley confirmed `futuremarketingai.com` is NOT a registered domain. The 54 stale references in the codebase were aspirational typos. Adding redirects for a domain we don't own is inert — Vercel can only redirect hosts that actually point at the project.
- **Customer-email unification policy.** `hello@future-marketing.ai` is the single user-facing inbox. `info@`, `contact@` collapsed onto `hello@`. `apply@` retained as APPLY_EMAIL_FROM (server-side Resend sender, never user-visible). `privacy@future-marketing.ai` retained ONLY on the legal page per AVG / GDPR data-controller-contact obligation. This separation is documented in fmai-nextjs/CLAUDE.md Red Flags so it survives future copy passes.
- **Concierge KB treated as customer-facing.** The Clyde concierge knowledge base (`src/lib/chatbot/knowledge/concierge-kb.ts`) is consumed by the chatbot and read aloud to prospects who ask for contact details. Plan listed only 4 src files but the KB had `contact@futuremarketingai.com`. Treated as Rule 3 (blocking, would have failed Task 8 grep gate).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Cleaned `src/lib/chatbot/knowledge/concierge-kb.ts`**
- **Found during:** Task 3 (mapped 4 src files; full grep showed a 5th hit)
- **Issue:** Plan listed Header, OG image, layout, contact page. A 5th in-scope file, `concierge-kb.ts`, contained `contact@futuremarketingai.com` on line 220. Without fixing it, Task 8's gate grep on `src/` would have failed and the plan could not close.
- **Fix:** Replaced with `hello@future-marketing.ai` per the customer-email unification rule. The Calendly username slug `calendly.com/futuremarketingai/discovery` is unrelated (third-party URL, not our domain) and was left untouched.
- **Files modified:** `fmai-nextjs/src/lib/chatbot/knowledge/concierge-kb.ts`
- **Verification:** Re-grep returned 0 in src/. Build passes.
- **Committed in:** `96e75a8` (folded into Task 3 commit)

**2. [Rule N/A — Plan claim verified false] HeaderClient.tsx already clean**
- **Found during:** Task 3 (pre-edit grep)
- **Issue:** Plan named `HeaderClient.tsx` as containing the legacy domain. Grep returned 0 hits — the file already references `app.future-marketing.ai` (login URL on canonical subdomain).
- **Fix:** No edit needed. Documented in commit message of `96e75a8`.

### Plan vs Reality

**Task 1 (canonical-domain + dashboard verification):** The plan asked Daley to verify in the Vercel dashboard that future-marketing.ai is primary and futuremarketingai.com is 301-redirected. Reality differed:
- futuremarketingai.com is not registered (never was). The 54 stale references were aspirational typos.
- future-marketing.ai apex was NOT primary — www was primary and apex was 307-redirecting to www.
- Orchestrator resolved this via Vercel REST API while the executor was paused on the checkpoint: swapped primary to apex, configured www -> 308 -> apex.
- Outcome: stronger than the plan envisioned. Apex is now canonical AND served direct, www handled by 308 permanent redirect (better than the plan's 301 because 308 preserves request method).

**Task 7 (vercel.json infra-as-code redirect):** Skipped entirely. Conditional on Task 1 response. With the legacy domain not owned and the apex/www config handled via dashboard API, infra-as-code redirects for non-existent hosts would be inert dead code.

**Task 8 (final grep + build + lint gates):** Re-confirmed at resume:
- `grep -rn 'futuremarketingai\.com' src/ messages/ .env.example` = 0
- `grep -c 'https://future-marketing\.ai' src/lib/seo-config.ts` = 1
- `npm run build` = `Compiled successfully in 5.7s`

**Task 9 (production smoke test):** Verified by orchestrator, not by Daley, while the executor was paused. Evidence:
- `curl -I https://future-marketing.ai/` -> `HTTP/2 307` -> `/en` -> `HTTP/2 200`
- `curl -I https://www.future-marketing.ai/` -> `HTTP/2 308` -> `https://future-marketing.ai/` -> `/en` -> `HTTP/2 200`
- The 307 to `/en` is next-intl's locale-detection middleware. Expected, SEO-safe (caches after first hit, Googlebot follows, hreflang tags present).

---

**Total deviations:** 1 auto-fixed (Rule 3 blocking concierge-kb.ts), plus 2 plan-vs-reality corrections (legacy domain not owned, apex/www config differs from assumption). All deviations strengthened the outcome rather than degraded scope.

**Impact on plan:** Plan is fully achieved on stronger ground than originally specified. Apex is canonical and served direct (not via redirect chain). Customer-email is uniform. CLAUDE.md regression-prevention is in place.

## Issues Encountered

- One pre-staged middleware -> proxy rename (unrelated dev work) was carried into commit `0346709` because git's auto-rename detection caught it during `git add fmai-nextjs/src/lib/seo-config.ts`. Cosmetic only — the rename is correct and was already prepared. Logged for awareness; future commits used explicit per-file `git add` to avoid recurrence.
- 4 commits from a parallel agent executing plan 10-04 landed during the checkpoint pause (`5a682bd`, `afc804e`, `f5d2351`, `c5b5c12`, `238484d`). These are independent of 10-01's surface area; verified no domain regressions in those commits.

## User Setup Required

None. The two pieces of dashboard work the plan envisioned (Task 1 canonical confirmation, Task 9 production smoke) were both performed by the orchestrator via Vercel REST API while the executor was paused. There are no remaining manual steps.

## Next Phase Readiness

- Wave 2 plans (10-02 forms-resend, 10-03 llms-txt, 10-04 hygiene) can proceed.
- 10-02 dependency on canonical SITE_URL satisfied: every email-template URL the Resend transactional path builds will use `https://future-marketing.ai`.
- 10-03 dependency on canonical SITE_URL satisfied: regenerated llms.txt + llms-full.txt will reference `https://future-marketing.ai/...` URLs only.
- 10-04 dependency on `.env.example` documenting Supabase + Upstash satisfied (added in this plan).
- No blockers for downstream phases.

## Self-Check: PASSED

Verified before writing this section:

- `grep -rn 'futuremarketingai\.com' src/ messages/ .env.example` from fmai-nextjs/ -> 0 hits
- `grep -c 'https://future-marketing\.ai' src/lib/seo-config.ts` -> 1
- `npm run build` from fmai-nextjs/ -> `Compiled successfully in 5.7s`
- All 5 task commits verified present in `git log`: `0346709`, `96e75a8`, `e7cef64`, `c935231`, `af7e952`
- All 11 modified files verified in respective commits via `git show --stat`

---
*Phase: 10-production-integrity-domain-ssot*
*Completed: 2026-04-25*
