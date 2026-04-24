---
phase: 10-production-integrity-domain-ssot
type: research
date: 2026-04-24
sources: web (resend docs, upstash docs, nextjs docs, vercel docs, llmstxt.org), local audit files
---

# Research Notes for Phase 10

Background research compiled for `/gsd:execute-phase` consumption. Each section captures the exact pattern, env var names, and code snippets needed in the four PLAN.md files.

---

## 1. Resend plus Next.js 16 App Router

### Install and env

```bash
cd fmai-nextjs && npm install resend
```

Required env:
```
RESEND_API_KEY=re_xxx
APPLY_EMAIL_TO=hello@future-marketing.ai     # internal inbox
APPLY_EMAIL_FROM=apply@future-marketing.ai   # must be on verified domain
CONTACT_EMAIL_TO=hello@future-marketing.ai
CONTACT_EMAIL_FROM=contact@future-marketing.ai
```

Daley must verify `future-marketing.ai` in the Resend dashboard under Domains before `APPLY_EMAIL_FROM` and `CONTACT_EMAIL_FROM` can send. Until then, use `onboarding@resend.dev` as the from-address for local testing.

### Route handler pattern

```ts
// src/app/api/apply/route.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// inside POST handler, after Zod validation plus Supabase insert
const { data, error } = await resend.emails.send({
  from: `FutureMarketingAI <${process.env.APPLY_EMAIL_FROM}>`,
  to: [process.env.APPLY_EMAIL_TO!],
  replyTo: validated.email,
  subject: `[Apply] ${validated.agency} — ${validated.tier}`,
  html: adminTemplate(validated),
})

if (error) {
  console.error('[apply][resend]', error)
  // do not fail the user submission if DB insert already happened
  // return success but log for monitoring
}
```

Key rules from Resend docs:
- Resend SDK returns `{ data, error }` — do not wrap in try/catch
- `react` prop takes a function call like `EmailTemplate({ firstName: 'X' })`, not JSX
- For our phase we use `html` (string templates) to avoid adding `react-email` as a dep
- `to` must be an array
- Set `replyTo` so Daley can just hit reply and reach the applicant

### Two-email pattern (admin plus confirmation)

```ts
// Fire both in parallel
const [adminResult, confirmationResult] = await Promise.all([
  resend.emails.send({
    from: `FutureMarketingAI <${process.env.APPLY_EMAIL_FROM}>`,
    to: [process.env.APPLY_EMAIL_TO!],
    replyTo: validated.email,
    subject: `[Apply] ${validated.agency}`,
    html: adminTemplate(validated),
  }),
  resend.emails.send({
    from: `Daley van FutureMarketingAI <${process.env.APPLY_EMAIL_FROM}>`,
    to: [validated.email],
    subject: 'Je aanvraag is ontvangen',
    html: confirmationTemplate(validated),
  }),
])
```

Confirmation template must be NL-first per CLAUDE.md. Plan 10-02 includes exact templates.

### References
- https://resend.com/docs/send-with-nextjs
- https://resend.com/docs/send-with-react-email (if we later add react-email)

---

## 2. Supabase `applications` table

### Schema

```sql
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- identity
  name text not null,
  email text not null,
  agency text not null,
  role text not null,
  -- qualification
  revenue text not null,
  client_count text not null,
  tier text not null,
  problem text not null,
  -- context
  locale text not null default 'nl',
  source text,           -- utm_source or referer
  utm_medium text,
  utm_campaign text,
  utm_content text,
  ip_hash text,          -- SHA256 of IP for dedupe, not raw IP (AVG)
  user_agent text,
  -- state
  status text not null default 'new' check (status in ('new','contacted','qualified','booked','lost'))
);

create index applications_created_at_idx on public.applications (created_at desc);
create index applications_status_idx on public.applications (status);

alter table public.applications enable row level security;

-- Only service_role can insert (the Next.js API route uses SUPABASE_SERVICE_ROLE_KEY)
-- No SELECT policy — table is admin-only, read via Supabase dashboard
create policy "service_role inserts applications"
  on public.applications
  for insert
  to service_role
  with check (true);
```

Same pattern for `contact_submissions`:

```sql
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  locale text not null default 'nl',
  ip_hash text,
  user_agent text,
  status text not null default 'new' check (status in ('new','replied','spam'))
);

create index contact_submissions_created_at_idx on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;
create policy "service_role inserts contact_submissions"
  on public.contact_submissions
  for insert
  to service_role
  with check (true);
```

### Env vars

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # server-only, never commit, never expose
```

### Client usage (server-side only)

```ts
// src/lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js'

// Singleton pattern — do not call from client components
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
)
```

```ts
// inside POST handler
import { supabaseAdmin } from '@/lib/supabase-admin'
import crypto from 'node:crypto'

const ipHash = crypto
  .createHash('sha256')
  .update(ip + process.env.IP_HASH_SALT!)
  .digest('hex')

const { error: dbError } = await supabaseAdmin
  .from('applications')
  .insert({
    name: validated.name,
    email: validated.email,
    agency: validated.agency,
    role: validated.role,
    revenue: validated.revenue,
    client_count: validated.clientCount,
    tier: validated.tier,
    problem: validated.problem,
    locale: request.headers.get('x-locale') ?? 'nl',
    ip_hash: ipHash,
    user_agent: request.headers.get('user-agent') ?? null,
  })

if (dbError) {
  console.error('[apply][supabase]', dbError)
  // still send email so lead is not lost
}
```

### Install

```bash
npm install @supabase/supabase-js
```

### References
- https://supabase.com/docs/guides/auth/row-level-security
- https://supabase.com/docs/reference/javascript/insert

---

## 3. Upstash Redis rate-limit

### Install and env

```bash
npm install @upstash/ratelimit @upstash/redis
```

```
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxx
```

Daley must create a free Upstash Redis database at https://console.upstash.com/redis, choose EU region (Frankfurt preferred for AVG).

### Pattern — module-scoped singleton

```ts
// src/lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Reusable across all API routes. Separate key prefix per endpoint.
export function createRateLimiter(prefix: string) {
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '10 m'),
    analytics: true,
    prefix: `fmai:ratelimit:${prefix}`,
  })
}

export const applyRateLimit = createRateLimiter('apply')
export const contactRateLimit = createRateLimiter('contact')
```

### Usage inside route

```ts
import { applyRateLimit } from '@/lib/ratelimit'

const ip =
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
  request.headers.get('x-real-ip') ??
  'unknown'

const { success, limit, remaining, reset } = await applyRateLimit.limit(ip)

if (!success) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(reset),
      },
    }
  )
}
```

### Why this replaces in-memory Map

Vercel Fluid Compute can spin up multiple concurrent isolates per region. An in-memory `Map` is per-isolate: a bot hitting a new isolate gets a fresh counter. Upstash lives off-process, so every isolate shares the same counter. Also survives cold starts.

### References
- https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted
- https://vercel.com/docs/fluid-compute

---

## 4. llmstxt.org spec

### Format — short `llms.txt`

```
# FutureMarketingAI

> One-sentence description. Followed by a short overview paragraph.

Optional body paragraph (no headings allowed here, any markdown is fine).

## Core pages

- [Home](https://future-marketing.ai/nl): Short description.
- [Pricing](https://future-marketing.ai/nl/pricing): 5 tiers from 347 to 7.997 plus Founding.

## Skills

- [Social Media](https://future-marketing.ai/nl/skills/social-media): Captions, scheduling, engagement.
...

## Optional

- [Blog](https://future-marketing.ai/nl/blog): Long-form thinking.
- [Legal](https://future-marketing.ai/nl/legal): Privacy plus terms.
```

Rules from llmstxt.org:
- Only required section: H1 with project name.
- Optional blockquote (`>`) directly after H1 for one-paragraph summary.
- Free-form markdown body allowed between blockquote and first H2 (no headings though).
- H2 sections contain bullet lists: `- [Name](URL): optional description`.
- "Optional" H2 = items that can be skipped for shorter context.
- The spec explicitly does not define `llms-full.txt` — it is a community convention for the long-form version that links out.

### Long-form `llms-full.txt`

Same format but with the full content of each page embedded as markdown sections instead of links. Use it to give LLMs a one-file dump of everything citation-worthy.

Our `llms-full.txt` structure (see plan 10-03 for full copy):

```
# FutureMarketingAI (FMai)

> Blockquote with Clyde positioning, 12 skills, 5 tiers, domain future-marketing.ai.

## Company

Body copy about founding, Daley, Netherlands, AVG plus EU AI Act.

## Product: Clyde

Who is Clyde, 12 skills taxonomy, memory USP, daily operation.

## 12 Skills

### Social Media Manager
Description paragraph plus capabilities list.

### Blog Factory
...

## Tiers and pricing

### Partner (347 per month)
8 of 12 skills included, 1000 credits, 1 workspace.

### Growth (2.497 per month)
All 12 skills, 4000 credits, 5 workspaces.

### Professional (4.497 per month)
All 12 skills, 12.000 credits, 15 workspaces.

### Enterprise (7.997 per month)
All 12 skills, 30.000 credits, unlimited workspaces.

### Founding Member (997 per month, lifetime)
10 spots, grandfathered pricing.

## Proof: SkinClarity Club case

Sindy as operator, 4 brands, 3 Instagram accounts, 6 active skills.

## Memory system

4-layer architecture.

## Apply process

4 week onboarding cadence.

## Contact

hello@future-marketing.ai, LinkedIn, Calendly via website.
```

All URLs inside llms-full.txt must also use `https://future-marketing.ai`.

### References
- https://llmstxt.org/

---

## 5. Next.js 16 middleware to proxy migration

### Rename and codemod

```bash
npx @next/codemod@canary middleware-to-proxy .
```

This rewrites:
- `src/middleware.ts` to `src/proxy.ts`
- `export default function middleware(...)` to `export default function proxy(...)`
- `export const config = { matcher: [...] }` stays as-is

### next-intl 4.8 compatibility

Our current file:
```ts
// src/middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
export default createMiddleware(routing)
export const config = { matcher: ['/', '/(en|nl|es)/:path*'] }
```

After rename:
```ts
// src/proxy.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
export default createMiddleware(routing)
export const config = { matcher: ['/', '/(en|nl|es)/:path*'] }
```

`next-intl` 4.8.3 still exports `createMiddleware` from `next-intl/middleware`. The import path does not change for proxy.ts. Verified on next-intl docs 2026-04.

Caution: if we upgrade `next-intl` to 4.9+ in plan 10-04 (dep bump), we should also check the changelog. 4.9.1 continues to ship the same middleware helper.

### References
- https://nextjs.org/docs/messages/middleware-to-proxy

---

## 6. Vercel Speed Insights — replaces custom /api/vitals

### Pattern

```bash
npm install @vercel/speed-insights
```

```tsx
// src/app/[locale]/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default async function RootLayout({ children, params }) {
  // ...
  return (
    <html lang={locale}>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

Installs under 5 KB gzipped. Sends to Vercel native endpoint (not `/api/vitals`). Zero server code needed.

### Why pick this over building `/api/vitals/route.ts`

The custom route would require:
- Storage (Redis or Postgres)
- Aggregation logic (rolling p75 calculations)
- A dashboard UI

Vercel Speed Insights gives all of that free. Daley also has Vercel Pro, so data retention is already paid for.

### Decision

Adopt `@vercel/speed-insights`. Remove the `navigator.sendBeacon('/api/vitals', ...)` call from `src/lib/web-vitals.ts` since SpeedInsights replaces it. Keep the local `ratingFor` helper and `initWebVitals` dev-only console logger for local smoke tests.

### References
- https://vercel.com/docs/speed-insights
- https://vercel.com/docs/speed-insights/quickstart

---

## 7. Vercel domain redirect (non-canonical to canonical)

Target state: `https://future-marketing.ai` is canonical (hyphenated, per CLAUDE.md root and user memory `project_pricing_handover`). `https://futuremarketingai.com` 301-redirects to it preserving path.

### Option A — Vercel dashboard (recommended, zero config drift)

1. Log into Vercel dashboard, select the `fmai-nextjs` project.
2. Go to Settings -> Domains.
3. Confirm `future-marketing.ai` is the primary domain (starred).
4. Add `futuremarketingai.com` as additional domain if not present.
5. For `futuremarketingai.com`, click the three-dot menu, choose "Redirect to..."
6. Select `future-marketing.ai`, status code 301, preserve path checked.

This is a one-time setup, does not need re-deploy.

### Option B — vercel.json (if Daley prefers infra-as-code)

```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "has": [{ "type": "host", "value": "futuremarketingai.com" }],
      "destination": "https://future-marketing.ai/$1",
      "permanent": true
    },
    {
      "source": "/(.*)",
      "has": [{ "type": "host", "value": "www.futuremarketingai.com" }],
      "destination": "https://future-marketing.ai/$1",
      "permanent": true
    },
    {
      "source": "/(.*)",
      "has": [{ "type": "host", "value": "www.future-marketing.ai" }],
      "destination": "https://future-marketing.ai/$1",
      "permanent": true
    }
  ]
}
```

Place at repo root of `fmai-nextjs/vercel.json`. Deploy.

### Decision

Plan 10-01 documents BOTH options but defers to Daley for the actual execution (autonomous: false flag). Dashboard is faster, vercel.json is reviewable via git.

### References
- https://vercel.com/docs/projects/domains/add-a-domain
- https://vercel.com/docs/edge-network/redirects-and-rewrites

---

## 8. Canonical domain list of files to change

From `grep -r "futuremarketingai\.com" fmai-nextjs/`:

| File | Count | Kind |
|---|---:|---|
| `messages/nl.json` | 5 | user-visible copy (contact, legal) |
| `messages/en.json` | 5 | user-visible copy |
| `messages/es.json` | 5 | user-visible copy |
| `public/llms-full.txt` | 19 | AI-facing, will be full regen in plan 10-03 |
| `public/llms.txt` | 12 | AI-facing, full regen in plan 10-03 |
| `src/lib/seo-config.ts` | 2 | SSoT constants (SITE_URL, ORG_EMAIL) |
| `src/lib/og-image.tsx` | 1 | OG template |
| `src/app/[locale]/layout.tsx` | 1 | meta / schema |
| `src/app/[locale]/(marketing)/contact/page.tsx` | 1 | visible email link |
| `src/components/layout/HeaderClient.tsx` | 1 | ? verify actual use |
| `src/lib/chatbot/knowledge/concierge-kb.ts` | 1 | chatbot KB (unified in plan 10-03) |
| `scripts/visual-compare.ts` | 1 | dev tool, low priority |
| `docs/plans/2026-03-23-performance-optimization-plan.md` | 1 | stale doc, skip |

Plan 10-01 owns: `seo-config.ts`, `og-image.tsx`, `[locale]/layout.tsx`, `contact/page.tsx`, `HeaderClient.tsx`, `messages/{nl,en,es}.json` (15 refs total across 3 locales), `.env.example`, both CLAUDE.md files.

Plan 10-03 owns: `public/llms.txt`, `public/llms-full.txt`, `concierge-kb.ts`.

Plan 10-02 owns: email templates generated from `SITE_URL` (canonical URL is imported, not hardcoded).

---

## 9. Email unification table

Current state (audit 06 section 8.1):
| Purpose | Address | Location |
|---|---|---|
| User-facing contact | `hello@futuremarketingai.com` | `messages/*.json` lines 822, 1569, `contact/page.tsx:127` |
| Privacy inquiries | `privacy@futuremarketingai.com` | `messages/*.json:915` |
| Organization schema | `info@futuremarketingai.com` | `seo-config.ts:3`, `.env.example` CONTACT_EMAIL_TO |
| Apply form (Resend) | `apply@futuremarketingai.com` | `.env.example` APPLY_EMAIL_FROM |
| Chatbot knowledge | `contact@futuremarketingai.com` | `concierge-kb.ts:220` |

Target state:
| Purpose | Address | Rule |
|---|---|---|
| Customer-facing contact (site, chatbot, Organization schema) | `hello@future-marketing.ai` | single customer-facing inbox, Daley gets all of it |
| Privacy inquiries | `privacy@future-marketing.ai` | kept separate because legal pages reference it under AVG rules, do not merge |
| Apply form `from` address | `apply@future-marketing.ai` | identity for Resend sender, routes back to `hello@` via reply-to |
| Apply form `to` address | `hello@future-marketing.ai` | unified |
| Contact form `from` | `contact@future-marketing.ai` | identity for Resend sender |
| Contact form `to` | `hello@future-marketing.ai` | unified |

Resend needs the `future-marketing.ai` domain verified in the dashboard. Until verified, set `APPLY_EMAIL_FROM=onboarding@resend.dev` for local dev.

---

## 10. Chatbot v10 data sync — SSoT rewrite

### Strategy

Instead of rewriting the stale `get_pricing_info` tool inline, import the v10 tier data from `src/lib/skills-data.ts` (which is already the website mirror of `fma-app/src/lib/skills.ts` pricing SSoT). This makes future tier changes propagate through one edit.

Create a new small helper:

```ts
// src/lib/chatbot/tool-data.ts
// Canonical v10 tier snapshot for chatbot tools.
// Source of truth: fma-app/src/lib/skills.ts (AGENT_TIERS).
// Mirror: src/lib/skills-data.ts (tier caps per skill).

export const CHATBOT_TIERS = {
  partner: {
    name: 'Partner',
    monthlyPrice: 347,
    onboardingFee: 497,
    workspaces: 1,
    credits: 1000,
    skillsIncluded: 8,
    skillsTotal: 12,
    features: [
      '8 of 12 skills included (Social Media, Blog Factory, Lead Qualifier, Email Management, Reporting, SEO/GEO, Research, Clyde)',
      'Add-on paths: Static Ads pack 97 EUR, ManyChat pack 47 EUR',
      '1 workspace',
      '1,000 credits per month',
      '497 EUR one-time onboarding',
    ],
  },
  growth: {
    name: 'Growth',
    monthlyPrice: 2497,
    onboardingFee: 1997,
    workspaces: 5,
    credits: 4000,
    skillsIncluded: 12,
    skillsTotal: 12,
    features: [
      'All 12 skills included',
      '5 workspaces',
      '4,000 credits per month',
      '1,997 EUR one-time onboarding',
    ],
  },
  professional: {
    name: 'Professional',
    monthlyPrice: 4497,
    onboardingFee: 3997,
    workspaces: 15,
    credits: 12000,
    skillsIncluded: 12,
    skillsTotal: 12,
    features: [
      'All 12 skills included',
      '15 workspaces',
      '12,000 credits per month',
      'Dedicated Slack channel',
      '3,997 EUR one-time onboarding',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPrice: 7997,
    onboardingFee: 5997,
    workspaces: -1,
    credits: 30000,
    skillsIncluded: 12,
    skillsTotal: 12,
    features: [
      'All 12 skills included, no caps',
      'Unlimited workspaces',
      '30,000 credits per month',
      'Dedicated Customer Success Manager',
      '5,997 EUR one-time onboarding',
    ],
  },
  founding: {
    name: 'Founding Member',
    monthlyPrice: 997,
    onboardingFee: 0,
    workspaces: -1,
    credits: 8000,
    spotsTotal: 10,
    skillsIncluded: 12,
    skillsTotal: 12,
    features: [
      'All 12 skills with Pro-tier caps',
      'Unlimited workspaces',
      '8,000 credits per month',
      'Lifetime price lock',
      'Direct founder access',
      'Shape the product roadmap',
      '10 spots total, no onboarding fee',
    ],
  },
} as const

export type ChatbotTierKey = keyof typeof CHATBOT_TIERS
```

Then `leadgen-tools.ts` becomes:

```ts
import { CHATBOT_TIERS, ChatbotTierKey } from '@/lib/chatbot/tool-data'

const get_pricing_info = tool({
  description: 'Retrieve pricing information...',
  inputSchema: z.object({
    tier: z.enum(['partner','growth','professional','enterprise','founding','all']).default('all'),
  }),
  execute: async ({ tier }) => {
    if (tier === 'all') return { tiers: CHATBOT_TIERS }
    return { tier: CHATBOT_TIERS[tier as ChatbotTierKey] }
  },
})
```

Also fix the ROI calculator default:
```ts
monthlySubscription: z.number().default(2497).describe(...)   // was 1497
```

### concierge-tools.ts — kill the v9 SERVICE_DATA object

The `SERVICE_DATA` object with "chatbots", "voice-agents", "automations", "marketing-machine" keys (audit 06 section 2.2) is from the v9 four-service product. Replace with the 12-skill taxonomy sourced from `skills-data.ts`:

```ts
import { SKILLS_DATA } from '@/lib/skills-data'

const get_services = tool({
  description: 'Get information about FutureMarketingAI skills. Use "all" for overview or pick a specific skill.',
  inputSchema: z.object({
    skillId: z.enum([
      'all','social-media','blog-factory','ad-creator','reel-builder','voice-agent',
      'lead-qualifier','email-management','manychat','reporting','seo-geo','research','clyde',
    ]).describe('Which skill to get details about'),
  }),
  execute: async ({ skillId }) => {
    if (skillId === 'all') {
      return {
        skills: SKILLS_DATA.map(s => ({
          id: s.id,
          name: s.name,
          route: s.route,
          shortDescription: s.shortDescription,
          status: s.status,
          category: s.category,
        })),
      }
    }
    const skill = SKILLS_DATA.find(s => s.id === skillId)
    if (!skill) return { error: `Unknown skill: ${skillId}` }
    return {
      skill: {
        id: skill.id,
        name: skill.name,
        route: skill.route,
        description: skill.longDescription,
        features: skill.features,
        status: skill.status,
        creditCostLabel: skill.creditCostLabel,
      },
    }
  },
})
```

### concierge-kb.ts and support-kb.ts — fix "all 12 AI skills" for Partner

Current: both KBs claim Partner has "all 12 AI skills included" (line 63 and 29). False.

Fix:
```
**Partner. 2.497 EUR/mo** -> "wrong tier in current KB, does not exist"
```

The KB pricing block (`concierge-kb.ts` lines 56 to 85) does not even list Partner. Rewrite to include it:

```
**Partner. 347 EUR/mo**
- 1 workspace
- 1,000 credits/mo
- 8 of 12 skills included (Social, Blog, Lead Qualifier, Email, Reporting, SEO/GEO, Research, Clyde)
- Add-on paths: Static Ads pack 97 EUR, ManyChat pack 47 EUR
- 497 EUR onboarding
```

Plus correct the 4 other tiers (lines 60-85) to match CHATBOT_TIERS. Same for support-kb.ts lines 22-56.

Line 220 of concierge-kb.ts contains `contact@futuremarketingai.com`. Change to `hello@future-marketing.ai`.

---

## 11. Verification commands (reusable across plans)

### Email delivery smoke test

```bash
curl -X POST http://localhost:3000/api/apply \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test Applicant",
    "email": "daley+test@future-marketing.ai",
    "agency": "Test Agency",
    "role": "Founder",
    "revenue": "300k_1m",
    "clientCount": "5_15",
    "tier": "growth",
    "problem": "Test application from curl to verify Resend wiring."
  }'
```

Expected: 200 `{success: true}`, two emails delivered (admin inbox + confirmation to applicant address within 30 s), one Supabase row in `applications`.

### Supabase insert verification

```sql
-- from Supabase SQL editor
select count(*), max(created_at) from applications;
select * from applications order by created_at desc limit 1;
```

### Upstash rate-limit verification

```bash
for i in {1..8}; do
  curl -X POST http://localhost:3000/api/apply \
    -H 'Content-Type: application/json' \
    -d '{"name":"rate","email":"rate@test.com","agency":"RL","role":"test","revenue":"300k_1m","clientCount":"1_5","tier":"partner","problem":"rate limit test message 20 chars minimum length ok"}' \
    -w '\nHTTP %{http_code}\n'
done
```

Expected: first 5 return 200, requests 6 through 8 return 429 with `X-RateLimit-*` headers.

### Domain migration grep check

```bash
grep -r "futuremarketingai\.com" fmai-nextjs/src fmai-nextjs/messages fmai-nextjs/public fmai-nextjs/.env.example
# Expected: zero matches
```

### Chatbot pricing correctness

Start local dev, open chat, ask "wat kost Growth?". Expected answer contains "2.497", not "1.497". Ask "welke skills krijgt Partner?". Expected: "8 van 12".

### llms.txt validation

```bash
# Structure check
head -5 fmai-nextjs/public/llms.txt
# Expect: # FutureMarketingAI \n \n > [description]

# Domain check
grep -c "future-marketing.ai" fmai-nextjs/public/llms.txt
grep -c "futuremarketingai.com" fmai-nextjs/public/llms.txt
# Expect: all matches use hyphenated, zero legacy
```

### Build and lint gates

```bash
cd fmai-nextjs
npm run build   # zero middleware deprecation warning after 10-04
npm run lint    # expect no regression
npm audit       # 0 high, 0 moderate after 10-04
```

---

## 12. Open questions for Daley (blocking autonomous execution)

1. Does `future-marketing.ai` already resolve to the Vercel deployment? If not, DNS A or CNAME setup needed before Vercel domain setup (plan 10-01 Task 1).
2. Has `future-marketing.ai` been added to Resend as a verified sending domain? If not, plan 10-02 has to fall back on `onboarding@resend.dev` for first deploy and cut over after verification.
3. Is there an existing Supabase project for the marketing site, or should we reuse the fma-app Supabase project? If reuse: confirm service-role key is available in Vercel env.
4. Does Daley already have an Upstash account? The free tier (10 k req per day) is plenty for rate-limiting two forms but he needs to provision the Redis DB.
5. Chatbot KB files: are `leadgen-tools.ts` and `concierge-tools.ts` both mounted in `flagshipTools` / currently exposed through `/api/chatbot`? Plan 10-03 assumes yes, grepped evidence supports it.

Plans 10-01 and 10-02 carry `autonomous: false` because of 1 through 4. Plans 10-03 and 10-04 are fully autonomous.
