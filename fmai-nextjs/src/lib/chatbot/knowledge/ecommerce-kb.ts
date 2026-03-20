import type { TopicDefinition } from '../types'

export const ECOMMERCE_TOPICS: TopicDefinition[] = [
  {
    key: 'onboarding_steps',
    content: `## Agency Onboarding Steps

**Step 1: Create Your Agency Workspace**
Set up your agency profile with company name, logo, and team members. Each team member gets role-based access (Admin, Manager, Viewer).

**Step 2: Add Your First Client**
Create a client workspace with their brand name, industry, and target audience. Each client gets an isolated workspace with its own brand voice, content calendar, and connected channels.

**Step 3: Configure Brand Voice**
Upload the client's brand guidelines, tone of voice document, or simply describe their communication style. The AI Marketing Employee learns to write in their voice across all content types.

**Step 4: Connect Content Channels**
Link the client's social media accounts, blog CMS, email marketing platform, and ad accounts. Supported: LinkedIn, Instagram, Facebook, WordPress, Mailchimp, Google Ads, Meta Ads.

**Step 5: Activate Skills**
Choose which AI skills to enable for this client. Each skill handles a specific marketing function. Start with 1-2 skills and expand as you see results.

**Step 6: Launch the Content Calendar**
Set posting frequency, review workflows (auto-publish or approval queue), and let the AI Marketing Employee start producing content.`,
    keywords: [
      'onboarding',
      'setup',
      'getting started',
      'first steps',
      'how to start',
      'begin',
      'workspace',
      'create account',
      'sign up',
    ],
    priority: 10,
  },
  {
    key: 'skills',
    content: `## AI Marketing Employee Skills

**Content Creator**
Produces blog posts, articles, and long-form content optimized for SEO. Adapts to client brand voice. Output: 2-4 blog posts per week per client.

**Social Media Manager**
Creates platform-specific social posts (LinkedIn, Instagram, Facebook, X). Handles scheduling, hashtag strategy, and engagement prompts. Output: 5-15 posts per week per client.

**Ad Creator**
Generates ad copy and creative briefs for Google Ads, Meta Ads, and LinkedIn Ads. A/B test variants included. Output: ad sets with 3-5 variants each.

**Voice Agent**
Handles inbound calls, appointment scheduling, and lead qualification by phone. Speaks naturally in Dutch and English. Available 24/7.

**Lead Qualifier**
Scores and qualifies inbound leads from forms, chatbots, and email. Routes hot leads to the agency's sales process. Reduces response time to under 5 minutes.

**Reporting Analyst**
Compiles weekly and monthly performance reports across all channels. Tracks KPIs, identifies trends, and suggests optimizations. Output: automated PDF reports.`,
    keywords: [
      'skills',
      'capabilities',
      'what can it do',
      'features',
      'content creator',
      'social media',
      'ad creator',
      'voice agent',
      'lead qualifier',
      'reporting',
    ],
    priority: 9,
  },
  {
    key: 'brand_voice',
    content: `## Brand Voice Setup

**Why Brand Voice Matters**
Every client has a unique tone. The AI Marketing Employee adapts its writing style per client so content sounds authentic, not generic.

**How to Configure Brand Voice**
1. Upload existing content samples (blog posts, social posts, newsletters) -- the AI analyzes patterns
2. Set tone parameters: formal vs. casual, technical vs. accessible, authoritative vs. friendly
3. Define industry-specific terminology and phrases to use or avoid
4. Specify audience demographics and psychographics
5. Review generated sample content and refine settings

**Per-Client Isolation**
Each client workspace has its own brand voice profile. Content for Client A never bleeds into Client B's voice. Agencies managing 10+ clients can maintain distinct voices for each.

**Brand Voice Elements:**
- Tone (professional, playful, bold, empathetic)
- Vocabulary level (expert, intermediate, accessible)
- Sentence structure (short and punchy, detailed and thorough)
- Call-to-action style (direct, suggestive, educational)
- Industry jargon preferences (use, avoid, or explain)`,
    keywords: [
      'brand voice',
      'tone',
      'writing style',
      'content style',
      'brand guidelines',
      'client voice',
      'tone of voice',
    ],
    priority: 8,
  },
  {
    key: 'client_management',
    content: `## Client Workspace Management

**Multi-Client Dashboard**
View all client workspaces from a single agency dashboard. See content status, upcoming posts, performance metrics, and skill activity per client at a glance.

**Client Workspace Includes:**
- Brand voice profile and guidelines
- Connected social accounts and CMS
- Active skills and their configurations
- Content calendar with approval workflows
- Performance analytics and reporting
- Usage metrics and billing allocation

**Team Collaboration**
Assign team members to specific client workspaces. Set approval workflows: auto-publish, single approval, or multi-step review. Track who approved what and when.

**Scaling Clients**
Adding a new client takes under 15 minutes: create workspace, configure brand voice, connect channels, activate skills. The AI Marketing Employee handles the rest.

**Client Offboarding**
Deactivate a client workspace to pause all skills and scheduled content. Data is retained for 90 days. Export all content and analytics before permanent deletion.`,
    keywords: [
      'client',
      'workspace',
      'manage',
      'dashboard',
      'multi-client',
      'scaling',
      'team',
      'collaboration',
      'approval',
    ],
    priority: 7,
  },
  {
    key: 'content_calendar',
    content: `## Content Calendar Basics

**How It Works**
The AI Marketing Employee generates a content calendar based on the client's industry, audience, and active skills. Content is queued for review or auto-published based on your workflow settings.

**Calendar Features:**
- Weekly and monthly views
- Drag-and-drop rescheduling
- Platform-specific post previews (LinkedIn, Instagram, blog)
- Approval status indicators (draft, pending review, approved, published)
- Holiday and industry event integration

**Content Frequency Recommendations:**
- Blog: 2-4 posts per week for SEO impact
- LinkedIn: 3-5 posts per week for visibility
- Instagram: 4-7 posts per week (mix of feed, stories, reels)
- Newsletter: 1-2 per week for engagement without fatigue
- Ad campaigns: Refresh creatives every 2-4 weeks

**Review Workflow Options:**
1. Auto-publish: AI creates and publishes without human review (fastest)
2. Single approval: Content goes to one approver before publishing
3. Agency + Client approval: Agency reviews first, then client approves`,
    keywords: [
      'calendar',
      'schedule',
      'content plan',
      'posting',
      'frequency',
      'workflow',
      'approval',
      'review',
      'publish',
    ],
    priority: 6,
  },
]
