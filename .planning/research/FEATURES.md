# Features Research: AaaS Platform for Marketing Agencies

## Table Stakes (Must Have — Agencies Expect These)

### Website / Marketing

- Agency-focused messaging and copy (not generic "businesses")
- Skill showcase pages (what each skill does, pricing, ROI)
- Founding member program with scarcity (10 spots)
- Pricing page with clear agent tiers
- Demo or video showing the agent in action
- GDPR compliance badges and trust signals
- Multi-language (NL + EN minimum)

### Dashboard / Product

- Agent status dashboard (is my AI employee running? what did it do today?)
- Client workspace management (agency manages multiple clients)
- Skill activation/deactivation per workspace
- Content activity feed (what the agent created/published)
- Performance reporting (leads, content published, engagement)
- Billing management (subscription, invoices, usage)
- Onboarding wizard (new agency → first client → first skill)

### Backend / Operations

- Multi-tenant workflow execution (each client's data isolated)
- Usage metering (track executions, voice minutes per client)
- Automated client setup (new client → configure all workflows)
- Error handling and alerting (agent fails → notify agency)
- AI-disclosure compliance (chatbot/voice identifies as AI)

## Differentiators (Competitive Advantage)

- **"AI Employee" framing** — not a tool, an employee that works 24/7
- **Unified multi-skill platform** — one agent, many capabilities (vs. 5 separate tools)
- **Dutch language + GDPR-first** — zero competitors in NL market for this
- **n8n-powered backend** — production-grade automation, not demo-ware
- **Real ad creative pipeline** — Kling AI video + Remotion + Meta Ads (most competitors don't have this)
- **Voice agent integrated** — Vapi-based, not a separate product
- **Self-learning analytics** — agent improves weekly based on performance data

## Anti-Features (Deliberately NOT Building)

| Feature                                               | Why Not                                                           |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| Self-serve platform (agencies build their own agents) | Too complex for solo founder; done-for-you + managed is the model |
| AI agent marketplace                                  | Premature; simple skill toggles first                             |
| White-label for agencies to resell                    | v2+ feature; focus on direct value first                          |
| Real-time multi-agent orchestration                   | n8n scheduled workflows are sufficient and more reliable          |
| Mobile app                                            | Web dashboard is sufficient for B2B agency owners                 |
| Open API for third-party integrations                 | Not needed until 50+ clients                                      |
| Custom LLM fine-tuning per client                     | Prompt engineering + brand docs is sufficient for v1              |
