import type { TopicDefinition } from '../types'

export const LEADGEN_TOPICS: TopicDefinition[] = [
  {
    key: 'qualification',
    priority: 10,
    keywords: [
      'qualify', 'lead', 'score', 'BANT', 'budget', 'authority',
      'decision maker', 'timeline', 'need', 'pain point', 'ICP',
      'ideal customer', 'company size', 'employees',
    ],
    content: `## Lead Qualification Framework (BANT + MEDDIC Lite)

**Qualification Criteria:**
- Budget: What is the prospect's available budget range?
- Authority: Is the contact a decision maker or influencer?
- Need: What specific pain points does the prospect have?
- Timeline: When does the prospect plan to implement?

**Lead Scoring (0-100):**
- 0-30: Cold — Not enough information or poor fit
- 31-60: Warm — Some criteria met, needs nurturing
- 61-85: Hot — Strong fit, actively evaluating solutions
- 86-100: Qualified — Ready for sales handoff

**Ideal Customer Profile (ICP):**
- B2B company
- 20-500 employees
- Marketing team of 3+ people
- Currently using manual marketing processes
- Monthly marketing budget of EUR 1,000+
- Industry: SaaS, e-commerce, professional services, agencies

**MEDDIC Lite Checklist:**
- Metrics: What KPIs does the prospect want to improve?
- Economic Buyer: Who signs off on the purchase?
- Decision Criteria: What factors drive the buying decision?
- Decision Process: What steps are in their evaluation process?
- Identified Pain: What is the core problem to solve?
- Champion: Is there an internal advocate?`,
  },
  {
    key: 'pricing_tiers',
    priority: 9,
    keywords: [
      'pricing', 'price', 'cost', 'plan', 'tier', 'starter',
      'professional', 'enterprise', 'subscription', 'monthly',
      'annual', 'discount',
    ],
    content: `## Pricing Tiers

**Starter — EUR 299/mo**
- Up to 5 users
- Basic email automation
- Landing page builder (5 pages)
- Basic lead scoring
- Email support
- 1,000 contacts

**Professional — EUR 799/mo**
- Up to 20 users
- Advanced workflow automation
- Unlimited landing pages
- Advanced lead scoring + CRM integration
- Analytics dashboard
- Priority support + dedicated CSM
- 10,000 contacts

**Enterprise — EUR 1,999/mo**
- Unlimited users
- Custom integrations
- Dedicated Customer Success Manager
- Advanced analytics + reporting
- SSO + advanced security
- Custom onboarding
- Unlimited contacts
- SLA guarantee

**Annual Discount:** 20% off all plans when billed annually.
- Starter Annual: EUR 2,870/yr (saves EUR 718)
- Professional Annual: EUR 7,670/yr (saves EUR 1,918)
- Enterprise Annual: EUR 19,190/yr (saves EUR 4,798)`,
  },
  {
    key: 'roi_data',
    priority: 8,
    keywords: [
      'ROI', 'return on investment', 'savings', 'time saved',
      'revenue', 'cost reduction', 'CAC', 'payback', 'benchmark',
    ],
    content: `## ROI Benchmarks

**Average Customer Results:**
- 3.2x ROI within 6 months
- 15 hours/week time savings per marketing team member
- 40% increase in qualified leads
- 25% reduction in Customer Acquisition Cost (CAC)

**ROI Calculation Formula:**
ROI = (time_saved_hours * hourly_rate + additional_revenue - subscription_cost) / subscription_cost * 100

**Breakdown Example (Professional Tier, 5-person team):**
- Time saved: 5 people x 15 hours/week x 4 weeks = 300 hours/month
- Cost of time saved: 300 hours x EUR 50/hr = EUR 15,000/month
- Additional revenue from better leads: ~EUR 5,000/month
- Subscription cost: EUR 799/month
- Monthly ROI: (15,000 + 5,000 - 799) / 799 * 100 = 2,407%

**Payback Period:**
- Average: 3-4 weeks for Professional tier
- Enterprise customers: 2-3 months (larger implementation)`,
  },
  {
    key: 'product_features',
    priority: 7,
    keywords: [
      'feature', 'capabilities', 'email', 'landing page', 'automation',
      'workflow', 'analytics', 'A/B test', 'campaign', 'integration',
      'Salesforce', 'HubSpot', 'CRM',
    ],
    content: `## Key Features

**Core Capabilities:**
- Email sequences and drip campaigns
- Landing page builder (drag-and-drop)
- Lead scoring (behavioral + demographic)
- CRM integration (bi-directional sync)
- Analytics dashboard (real-time)
- A/B testing (email subject, content, send time)
- Multi-channel campaigns (email, social, ads)
- Workflow automation (visual builder)

**Integrations:**
- Salesforce (native, bi-directional)
- HubSpot (native, bi-directional)
- Slack (notifications + commands)
- Zapier (2,000+ app connections)
- Google Analytics, Facebook Ads, LinkedIn Ads
- Webhooks for custom integrations

**AI-Powered Features:**
- Smart send time optimization
- Content suggestions
- Predictive lead scoring
- Automated A/B test winner selection
- Campaign performance forecasting`,
  },
  {
    key: 'competitors',
    priority: 6,
    keywords: [
      'competitor', 'comparison', 'alternative', 'HubSpot', 'Mailchimp',
      'ActiveCampaign', 'versus', 'vs', 'better', 'different',
    ],
    content: `## Competitive Positioning

**Key Differentiators:**
- Faster implementation: 2 weeks vs industry average of 2 months
- More affordable: 30-50% less than comparable platforms
- Better support: Dedicated CSM from Professional tier (competitors charge extra)
- AI-powered optimization: Built-in, not an add-on

**Common Comparisons:**
- vs HubSpot: Similar features at 40% lower cost, faster onboarding
- vs Mailchimp: More advanced automation, better B2B features
- vs ActiveCampaign: Better analytics, more integrations, dedicated CSM earlier
- vs Marketo: Enterprise features at Professional pricing, simpler UI

**Why Customers Switch:**
- 45% cite cost as primary reason
- 30% cite ease of use
- 15% cite better support
- 10% cite specific feature advantages`,
  },
]
