# Pitfalls Research: AaaS Platform for Marketing Agencies

## Critical Pitfalls

### P1: Scope Creep — Trying to Rebuild Instead of Rebrand

- **Warning signs**: Creating new components instead of editing i18n files; redesigning dashboard pages instead of renaming labels; building new n8n workflows instead of parameterizing existing ones
- **Prevention**: Every task should answer "am I rebranding or rebuilding?" — if rebuilding, stop and reconsider
- **Phase**: ALL phases — this is the #1 risk

### P2: Multi-Tenant Data Leakage

- **Warning signs**: n8n workflows running with wrong client context; one agency seeing another's data in dashboard
- **Prevention**: RLS policies on ALL new tables from day 1; test with 2+ client configs before founding member launch
- **Phase**: Phase 2-3 (Dashboard + n8n)

### P3: No Revenue While Building

- **Warning signs**: Spending 4+ weeks on technical work before any sales activity; perfectionism blocking launch
- **Prevention**: Pre-sell founding members in Week 1-2 (parallel with build); OpenClaw consulting for quick cash
- **Phase**: Phase 5 (GTM) should start PARALLEL with Phase 1, not after

### P4: Stripe Billing Complexity

- **Warning signs**: Trying to build complex usage-based billing with metered subscriptions from day 1
- **Prevention**: Start with simple flat-rate subscriptions (founding member = EUR 997/mo flat). Add skill add-ons as separate products. Usage-based (voice minutes) can be manual invoicing initially.
- **Phase**: Phase 2 (Dashboard billing)

### P5: n8n Workflow Fragility Under Multi-Tenant

- **Warning signs**: Workflows failing silently for specific clients; Init Config not loading correct client data
- **Prevention**: Test each parameterized workflow with 3 different client configs; add error handling that notifies per-client
- **Phase**: Phase 3 (n8n multi-tenant)

## High-Priority Pitfalls

### P6: Translation File Bloat

- **Warning signs**: 40KB+ translation files becoming hard to manage; inconsistent translations across languages
- **Prevention**: Use structured namespaces (already done); consider splitting into per-page files if files exceed 60KB
- **Phase**: Phase 1 (Website rebrand)

### P7: Founding Member Expectations Mismatch

- **Warning signs**: Founding members expecting fully autonomous agent from day 1; disappointment when manual intervention needed
- **Prevention**: Clear "beta" framing in all founding member communications; explicit list of what works vs. what's coming
- **Phase**: Phase 5 (GTM)

### P8: Dashboard Route Changes Breaking Bookmarks/Links

- **Warning signs**: Renaming routes (/pipeline → /agent-activity) without redirects
- **Prevention**: Add Next.js redirects in next.config.ts for all renamed routes; keep old routes working for 3 months
- **Phase**: Phase 2 (Dashboard reframe)

### P9: Compliance Procrastination

- **Warning signs**: Leaving AI-disclosure and DPA until after launch; "we'll add it later"
- **Prevention**: Compliance is Phase 4 but the simple items (AI-disclosure text) should ship WITH Phase 1
- **Phase**: Phase 4 (Compliance) — but start early

### P10: Three-Repo Coordination Overhead

- **Warning signs**: Website says "voice agent skill" but dashboard doesn't have voice section linked; pricing shows tier that billing doesn't support
- **Prevention**: Create a cross-repo checklist for each phase; verify website ↔ dashboard ↔ n8n alignment before each phase closes
- **Phase**: ALL phases
