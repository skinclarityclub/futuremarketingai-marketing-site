# Research Summary: FMai AaaS Pivot

## Key Findings

### Stack

The stack is LOCKED — this is a brownfield rebrand across three production codebases (Website: Next.js 16, Dashboard: Next.js 16 + Supabase, n8n: 115 workflows). Only addition needed: Stripe billing connection (SDK already installed). No new technologies required.

### Table Stakes for AaaS

1. Agency-focused website with skill showcase and agent tier pricing
2. Dashboard with client workspace management and skill activation
3. Multi-tenant n8n workflows (client isolation, per-client brand context)
4. Stripe billing (base agent + skill add-ons)
5. AI-disclosure compliance (EU AI Act, Aug 2026 deadline)
6. Founding member program with demo/video

### Differentiators

- "AI Employee" framing (vs. tools)
- Dutch language + GDPR-first (zero NL competitors)
- Unified multi-skill platform (vs. 5 separate tools)
- Real production pipelines (content, ads, voice — not demos)
- Self-learning analytics with performance feedback loop

### Watch Out For

1. **Scope creep** — rebrand, don't rebuild (60-70% exists)
2. **No revenue while building** — pre-sell founding members Week 1-2
3. **Multi-tenant data leakage** — RLS from day 1
4. **Billing complexity** — start flat-rate, not usage-based
5. **Three-repo coordination** — cross-repo checklists per phase
6. **GTM must start parallel** — not after technical phases

### Architecture Insight

The build order has natural parallelism:

- Website rebrand (Phase 1) is INDEPENDENT of dashboard/n8n work
- Compliance (Phase 4) is INDEPENDENT and can run parallel
- GTM (Phase 5) should start PARALLEL with Phase 1 (pre-selling while building)
- Dashboard (Phase 2) and n8n (Phase 3) have a dependency: dashboard data model must exist before n8n parameterization

### Market Context

- 28,153 agencies in NL, zero AI agent competitors
- Performance agencies = best ICP (highest budget, fastest decisions)
- EUR 997/mo founding member = 1-2 week decision cycle
- OpenClaw/NVIDIA narrative window = 3-6 months
- Infrastructure cost: EUR 50-100/client/mo = 90%+ margin
