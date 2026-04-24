---
phase: 10-production-integrity-domain-ssot
created: 2026-04-24
source_audit: docs/audits/2026-04-24-full-audit/MASTER-ACTION-PLAN.md
depends_on: []
plans: 4
est_hours: 12
---

# Phase 10: Production Integrity + Domain SSoT

## Why this phase exists

Per the 2026-04-24 Master Audit, the site looks strong on the surface but leaks business-critical on four axes:

1. `/api/apply` and `/api/contact` drop every submission to `console.log`. Every prospect since launch is lost.
2. The live Clyde chatbot quotes v9 pricing (Growth at 1.497, no Partner tier, 11 skills). A prospect who chats with Clyde, hears 1.497, and books, then sees 2.497 on the pricing page, has a trust breach and an invoice dispute.
3. `public/llms.txt` plus `llms-full.txt` feed ChatGPT, Perplexity, Google AI Overviews a pre-pivot four-service model with dead URLs and wrong prices. This is active poisoning of AI crawlers.
4. Domain is split across code: CLAUDE.md says `future-marketing.ai`, code says `futuremarketingai.com` on 54 occurrences in 12 files. Canonical mismatch cascades to every canonical, hreflang, JSON-LD, OG URL.

On top of that, Next.js 16 emits a deprecation warning on every build (`middleware.ts`), npm audit lists 7 CVEs (picomatch ReDoS plus postcss XSS), `/api/vitals` 404s on every pageload, and the in-memory rate-limit Map does not work on Vercel Fluid Compute.

This phase fixes all of it in one coordinated push so the site is production-safe before we add any new features.

## Scope

In scope: audit BLOCKERS B-1, B-2, B-3, B-4, B-10 and cross-cutting theme T-2 (domain SSoT) from `docs/audits/2026-04-24-full-audit/MASTER-ACTION-PLAN.md` Appendix B rows R-001 through R-004, R-011, R-012, R-013, R-014, R-039, R-082.

Explicit out of scope (deferred to later phases):
- og-image.png creation (B-5) — lives in a "brand assets" phase
- skip-link plus keyboard a11y (B-6/7/8) — lives in the EAA phase
- Schema entity graph expansion (R-015, R-029, R-032, R-033) — lives in the GEO phase
- SKC case metrics interview (R-028) — blocked on Sindy availability
- Copy cleanup batches (R-020 through R-027) — lives in copy polish phase

## Plan index

| Plan | Title | Wave | Depends on | Autonomous | Est hours |
|---|---|---|---|---|---|
| 10-01 | Domain SSoT migration + email unification | 1 | none | false (Vercel dashboard) | 2.0 |
| 10-02 | Forms wiring: Resend, Supabase, Upstash rate-limit | 2 | 10-01 | false (Resend, Supabase, Upstash accounts) | 4.0 |
| 10-03 | Chatbot v10 data sync + llms.txt regeneration | 2 | 10-01 | true | 4.5 |
| 10-04 | Next.js hygiene: proxy.ts, vitals, CVE bumps | 1 | none | true | 1.5 |

Wave 1 runs in parallel (10-01 and 10-04 touch disjoint files). Wave 2 (10-02 and 10-03) waits for 10-01 because both embed canonical URLs in output (emails, llms.txt).

## Success criteria

After execution of all four plans:

1. `grep -r "futuremarketingai\.com" src/ public/ messages/` returns 0 results. Every canonical URL, JSON-LD, OG, sitemap, hreflang, llms.txt resolves to `https://future-marketing.ai`.
2. A POST to `/api/apply` with valid data triggers a Resend email to `APPLY_EMAIL_TO`, a confirmation email to the applicant, and inserts a row in Supabase `applications` table. Identical success criteria for `/api/contact`.
3. Both routes use Upstash Redis for rate-limit (sliding window 5 per 10 minutes per IP per endpoint). In-memory `Map` based rate-limit is gone.
4. `/api/contact` has same-origin CORS (no `*`).
5. Chatbot prompt "wat kost Growth" returns 2.497, not 1.497. Chatbot prompt "wat zijn de tiers" returns all 5 (Partner 347, Growth 2.497, Professional 4.497, Enterprise 7.997, Founding 997). Chatbot prompt "welke skills krijgt Partner" returns "8 van 12 inbegrepen, plus 2 add-on paden".
6. `public/llms.txt` and `public/llms-full.txt` describe Clyde, 12 skills (9 live, 3 coming_soon), 5 tiers with v10 pricing, SKC case, memory USP, founding program, AVG plus EU AI Act framing, with all links pointing to `https://future-marketing.ai`.
7. `src/middleware.ts` renamed to `src/proxy.ts`. `next build` emits no deprecation warning.
8. `@vercel/speed-insights/next` is installed and mounted in `[locale]/layout.tsx`. `/api/vitals` 404 is gone.
9. `next@16.2.4`, `eslint-config-next@16.2.4`, `@next/mdx@16.2.4`, `@next/bundle-analyzer@16.2.4` installed. `npm audit` returns 0 high or moderate vulnerabilities.
10. Customer-facing email is unified to `hello@future-marketing.ai` everywhere except the privacy-specific `privacy@future-marketing.ai` on the legal page.

## How to verify per-plan

Each PLAN.md ends with a `<verify>` block containing runnable commands. Orchestrator (`/gsd:execute-phase`) runs them after implementation.

## Related docs

- `docs/audits/2026-04-24-full-audit/MASTER-ACTION-PLAN.md` — master synthesis
- `docs/audits/2026-04-24-full-audit/06-data-accuracy.md` — section 13 and 14 (chatbot and llms.txt drift registry)
- `docs/audits/2026-04-24-full-audit/08-technical-quality.md` — section 7 (security), 8 (deps), 10 (upgrade path)
- `docs/audits/2026-04-24-full-audit/03-marketing-conversion.md` — leaks 1 through 4 (forms plus email)
- `docs/audits/2026-04-24-full-audit/05-geo-llm-citation.md` — llms.txt spec context plus robots allowlist
- `.planning/phases/10-production-integrity-domain-ssot/RESEARCH.md` — API patterns, schema, citations
- `fmai-nextjs/CLAUDE.md` — project operating manual, pricing SSoT rules


---

## Committed Decisions (2026-04-24)

Alle open questions voor deze phase zijn vastgelegd in `.planning/phases/DECISIONS-2026-04-24.md`.

Execute agents: lees dat document vóór elke `plan-XX` die een decision-gate heeft. De decisions zijn bindend voor deze wave, reversible via commit als later blijkt dat een keuze herziening vereist.
