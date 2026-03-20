import type { TopicDefinition } from '../types'

export const SUPPORT_TOPICS: TopicDefinition[] = [
  {
    key: 'pricing_tiers',
    priority: 10,
    keywords: [
      'pricing',
      'price',
      'cost',
      'tier',
      'plan',
      'founding member',
      'starter',
      'growth',
      'agency',
      'subscription',
      'monthly',
      'EUR',
    ],
    content: `## FMai Agent Pricing Tiers

**Founding Member — EUR 997/mo** (limited to 10 spots)
- 6-month commitment, locked-in rate
- 3 AI skills included
- Up to 5 client workspaces
- Priority support and direct founder access
- Shape the product roadmap
- Best value: saves EUR 500/mo vs. Starter after founding period

**Starter — EUR 1,497/mo**
- 3 AI skills included
- Up to 10 client workspaces
- Email and chat support
- Weekly performance reports
- Standard onboarding

**Growth — EUR 1,997/mo**
- 5 AI skills included
- Up to 25 client workspaces
- Priority support with dedicated CSM
- Daily performance reports
- Advanced analytics dashboard
- Custom brand voice fine-tuning

**Agency — EUR 3,497/mo**
- All 6 AI skills included
- Unlimited client workspaces
- Dedicated account manager
- Real-time reporting
- Custom integrations
- White-label option
- SLA guarantee`,
  },
  {
    key: 'cost_benchmarks',
    priority: 9,
    keywords: [
      'salary',
      'hiring',
      'cost',
      'junior',
      'marketer',
      'freelancer',
      'employee',
      'compare',
      'versus',
      'vs',
      'FTE',
      'hourly',
    ],
    content: `## Cost Benchmarks: Hiring vs. AI Marketing Employee

**Junior Marketing Employee (Netherlands)**
- Gross salary: EUR 2,800-3,500/mo
- Employer costs (social charges, pension, insurance): +30% = EUR 3,640-4,550/mo
- Total annual cost: EUR 43,680-54,600
- Capacity: 1 person, 40 hrs/week, handles 2-3 clients max
- Ramp-up time: 3-6 months to full productivity

**Freelance Content Creator**
- Rate: EUR 50-100/hr (Netherlands market)
- Average 20 hrs/week for 3 clients: EUR 4,000-8,000/mo
- No benefits, no consistency guarantee, no scaling

**AI Marketing Employee (FMai Starter Tier)**
- Cost: EUR 1,497/mo
- Capacity: up to 10 clients simultaneously
- Available 24/7, no sick days, no vacation
- Consistent quality across all clients
- Scales instantly: add a client in 15 minutes

**Key Comparison:**
- Junior hire for 3 clients: ~EUR 4,000/mo = EUR 1,333/client
- FMai for 10 clients: EUR 1,497/mo = EUR 150/client
- Cost per client drops 89% with FMai`,
  },
  {
    key: 'time_benchmarks',
    priority: 8,
    keywords: [
      'time',
      'hours',
      'save',
      'efficiency',
      'productivity',
      'speed',
      'how long',
      'per piece',
      'content production',
    ],
    content: `## Time Benchmarks: Content Production

**Human Content Creation Time (Industry Average)**
- Blog post (1000 words): 3-4 hours
- LinkedIn post: 30-45 minutes
- Instagram caption + hashtags: 20-30 minutes
- Newsletter: 2-3 hours
- Ad copy set (5 variants): 1-2 hours
- Weekly content for 1 client: 15-20 hours

**AI Marketing Employee Production Time**
- Blog post (1000 words): 5-10 minutes
- LinkedIn post: 1-2 minutes
- Instagram caption + hashtags: 1-2 minutes
- Newsletter: 10-15 minutes
- Ad copy set (5 variants): 5 minutes
- Weekly content for 1 client: 30-60 minutes

**Time Savings per Client per Week: 14-19 hours**

**For a 5-Client Agency:**
- Human approach: 75-100 hours/week (needs 2-3 full-time people)
- With FMai: 5-10 hours/week (review and approval only)
- Time saved: 65-90 hours/week
- That is 1.5-2 full-time employees worth of time, freed up for strategy and client relationships`,
  },
  {
    key: 'roi_calculations',
    priority: 7,
    keywords: [
      'ROI',
      'return',
      'investment',
      'calculate',
      'savings',
      'payback',
      'break even',
      'revenue',
      'profit',
      'margin',
    ],
    content: `## ROI Calculation Framework

**Basic ROI Formula:**
Monthly ROI = (Cost Savings + Revenue Increase - FMai Subscription) / FMai Subscription x 100%

**Scenario A: 5-Client Agency (Starter Tier)**
- Current content costs: 1 junior hire (EUR 4,000/mo) + freelancer overflow (EUR 2,000/mo) = EUR 6,000/mo
- FMai cost: EUR 1,497/mo
- Direct savings: EUR 4,503/mo
- Additional capacity: can take on 5 more clients without hiring
- Potential additional revenue: 5 clients x EUR 1,500/mo retainer = EUR 7,500/mo
- Total monthly value: EUR 4,503 savings + EUR 7,500 growth potential = EUR 12,003
- ROI: 702%

**Scenario B: 10-Client Agency (Growth Tier)**
- Current content costs: 2 junior hires (EUR 8,000/mo) + freelancers (EUR 4,000/mo) = EUR 12,000/mo
- FMai cost: EUR 1,997/mo
- Direct savings: EUR 10,003/mo
- Additional capacity: can scale to 25 clients
- ROI: 401% on direct savings alone

**Scenario C: 20+ Client Agency (Agency Tier)**
- Current content costs: 4-5 staff (EUR 18,000/mo) + tools (EUR 2,000/mo) = EUR 20,000/mo
- FMai cost: EUR 3,497/mo
- Direct savings: EUR 16,503/mo
- ROI: 372% on direct savings alone

**Payback Period:** Typically 1 month — savings exceed subscription from day one.`,
  },
  {
    key: 'founding_member',
    priority: 6,
    keywords: [
      'founding',
      'founding member',
      'early',
      'discount',
      'spots',
      'limited',
      'commitment',
      'lock in',
      'benefit',
      'exclusive',
    ],
    content: `## Founding Member Program

**What Is It?**
The Founding Member program offers the first 10 agencies a permanently discounted rate of EUR 997/mo (vs. EUR 1,497/mo Starter) in exchange for a 6-month commitment and product feedback.

**Benefits:**
- EUR 997/mo locked in (EUR 500/mo savings vs. Starter, EUR 6,000/yr savings)
- 3 AI skills included (same as Starter)
- Up to 5 client workspaces
- Direct access to the founder for support and feature requests
- Priority for new feature rollouts
- Shape the product roadmap based on your agency's needs
- Founding Member badge and case study opportunity

**Requirements:**
- 6-month minimum commitment
- Monthly 30-minute feedback call
- Permission to use anonymized results as case study

**Who Is It For?**
Marketing agencies with 3-10 clients who want to:
- Reduce content production costs by 70-90%
- Scale client capacity without hiring
- Get early access to AI marketing tools before competitors
- Have direct influence on product development

**Spots Remaining:** Limited to 10 agencies total. First come, first served.`,
  },
]
