# Stack Research: AaaS Platform for Marketing Agencies

## Existing Stack (Brownfield — Keep As-Is)

| Layer               | Technology           | Version     | Status     | Rationale                        |
| ------------------- | -------------------- | ----------- | ---------- | -------------------------------- |
| Website Framework   | Next.js              | 16.1.7      | Production | App Router, SSR, i18n built-in   |
| Website Styling     | Tailwind CSS         | 4.x         | Production | Living System design implemented |
| Website i18n        | next-intl            | 4.8.3       | Production | EN/NL/ES fully translated        |
| Dashboard Framework | Next.js              | 16.1.6      | Production | Same stack as website            |
| Dashboard UI        | Radix UI + shadcn/ui | Latest      | Production | Component library established    |
| Auth                | Supabase Auth        | Latest      | Working    | Email + Google + GitHub OAuth    |
| Database            | Supabase PostgreSQL  | Latest      | Production | 30+ tables, RLS configured       |
| Automation Engine   | n8n                  | Cloud v2.35 | Production | 115 workflows, WAT architecture  |
| Voice AI            | Vapi                 | Latest      | Active     | Webhook server + assistant CRUD  |
| LLM                 | Anthropic Claude API | Latest      | Production | Opus/Sonnet/Haiku multi-tier     |
| Research            | Perplexity API       | Latest      | Production | Content research pipeline        |
| Image Gen           | Orshot + fal.ai      | Latest      | Production | Carousel/ad rendering            |
| Video Gen           | Kling AI + Remotion  | Latest      | Production | Ad creative pipeline             |
| Social Posting      | Blotato API          | Latest      | Production | Instagram scheduling             |
| Payments            | Stripe               | 20.3.1      | Scaffolded | In package.json, not connected   |
| Charts              | Recharts             | Latest      | Production | Analytics dashboards             |
| Animations          | Framer Motion        | 12.x        | Production | Both website and dashboard       |
| Deployment          | Vercel               | Latest      | Production | Website deployed                 |

## What Must Be Added

| Need                | Recommended              | Rationale                                                    | Confidence |
| ------------------- | ------------------------ | ------------------------------------------------------------ | ---------- |
| Billing             | Stripe (already in deps) | Connect existing Stripe SDK to agent tier pricing            | High       |
| Usage metering      | Custom (n8n + Supabase)  | Count executions per client in existing pipeline_runs table  | High       |
| Email transactional | Resend or SendGrid       | Contact form + onboarding emails (TODO in codebase)          | Medium     |
| Monitoring          | Existing Telegram bot    | Already used for n8n alerts, extend for client notifications | High       |

## What NOT To Use

| Technology                      | Why Not                                                             |
| ------------------------------- | ------------------------------------------------------------------- |
| OpenClaw/NemoClaw as foundation | Enterprise readiness 1.2/5, banned by Big Tech, alpha stage         |
| CrewAI for orchestration        | n8n already handles multi-agent workflows in production             |
| GoHighLevel                     | Would create platform dependency; own stack is stronger             |
| New CSS framework               | Tailwind 4 + Living System design already implemented               |
| New database                    | Supabase PostgreSQL with 30+ tables; migration would be destructive |

## Key Insight

The stack is LOCKED. This is a brownfield rebrand, not a greenfield build. Every technology choice is already made and in production. The work is reframing and connecting existing systems, not choosing new ones.
