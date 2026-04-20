import type { TopicDefinition } from '../types'

export const LEADGEN_TOPICS: TopicDefinition[] = [
 {
 key: 'content_types',
 priority: 10,
 keywords: [
 'blog',
 'social',
 'newsletter',
 'video',
 'content type',
 'post',
 'article',
 'LinkedIn',
 'Instagram',
 'email',
 'ad copy',
 'script',
 ],
 content: `## Content Types the AI Marketing Employee Produces

**Blog Posts & Articles**
SEO-optimized long-form content (800-2000 words). Includes meta descriptions, internal linking suggestions, and keyword targeting. Output: 2-4 articles per week per client.

**LinkedIn Posts**
Professional thought leadership posts, carousel text, and engagement-driving questions. Platform-optimized formatting with hashtag strategy. Output: 3-5 posts per week.

**Instagram Content**
Captions for feed posts, stories text, and reel scripts. Includes emoji strategy, hashtag sets, and call-to-action variants. Output: 4-7 pieces per week.

**Newsletters**
Email newsletters with subject line A/B variants, preview text, and structured sections (intro, main story, tips, CTA). Output: 1-2 per week.

**Video Scripts**
Short-form video scripts (30-90 seconds) for reels, TikTok, and YouTube Shorts. Includes hook, body, and CTA structure. Output: 2-3 scripts per week.

**Ad Copy**
Google Ads headlines and descriptions, Meta ad primary text and headlines, LinkedIn sponsored content. Includes A/B test variants. Output: ad sets with 3-5 variants.`,
 },
 {
 key: 'content_strategy',
 priority: 9,
 keywords: [
 'strategy',
 'plan',
 'calendar',
 'frequency',
 'audience',
 'goals',
 'KPI',
 'engagement',
 'reach',
 'growth',
 ],
 content: `## Content Strategy Framework

**Discovery Phase (What the AI Asks First)**
1. Client industry and niche
2. Target audience demographics and psychographics
3. Primary business goals (awareness, leads, sales, retention)
4. Existing brand voice and tone guidelines
5. Competitor landscape and differentiation

**Content Pillar Approach**
The AI organizes content around 3-5 pillars per client:
- Educational content (how-to guides, tips, industry insights)
- Authority content (case studies, data-driven posts, expert opinions)
- Engagement content (polls, questions, behind-the-scenes)
- Promotional content (offers, product highlights, CTAs)
- Community content (user stories, testimonials, culture posts)

**Recommended Posting Cadence by Platform:**
- LinkedIn: 3-5x/week (Tuesday-Thursday peak)
- Instagram: 4-7x/week (evenings and weekends peak)
- Blog: 2-4x/week (consistency matters more than volume)
- Newsletter: 1-2x/week (Tuesday and Thursday mornings)
- Ads: Refresh creatives every 2-4 weeks`,
 },
 {
 key: 'seo_basics',
 priority: 8,
 keywords: [
 'SEO',
 'keywords',
 'search',
 'Google',
 'ranking',
 'organic',
 'meta',
 'title',
 'description',
 'backlinks',
 ],
 content: `## SEO Content Optimization

**How the AI Optimizes for Search**
Every blog post and article is created with SEO best practices:
- Primary keyword in title, first paragraph, and 2-3 subheadings
- Secondary keywords naturally woven throughout the content
- Meta description (150-160 characters) with keyword and CTA
- Internal linking suggestions to existing client content
- Readability optimization (short paragraphs, clear structure, scannable headers)

**Content-SEO Integration:**
- Blog posts target long-tail keywords with lower competition
- Each post targets one primary keyword and 2-3 related terms
- Content clusters: pillar pages linked to supporting articles
- FAQ sections for featured snippet opportunities
- Image alt text suggestions for visual content

**What the AI Does NOT Do:**
- No keyword stuffing or unnatural placement
- No duplicate content across clients
- No black-hat SEO techniques
- SEO recommendations are suggestions. Agency has final say`,
 },
 {
 key: 'brand_voice_guidelines',
 priority: 7,
 keywords: [
 'brand voice',
 'tone',
 'style',
 'writing',
 'adapt',
 'client voice',
 'guidelines',
 'personality',
 ],
 content: `## Brand Voice Adaptation

**How the AI Adapts to Each Client's Voice**
The Content Creator skill maintains a separate brand voice profile per client workspace. Content for a law firm reads completely differently from content for a fitness studio.

**Voice Parameters:**
- Formality: corporate, professional, conversational, casual
- Energy: calm, enthusiastic, bold, understated
- Expertise level: expert (assumes knowledge), educational (explains concepts), accessible (simple language)
- Humor: none, subtle, frequent
- Sentence style: short and punchy, balanced, detailed and thorough

**Consistency Mechanisms:**
- Voice profile is loaded before every content generation
- Output is checked against voice parameters before delivery
- Agencies can fine-tune by rating generated content (thumbs up/down)
- Voice profiles improve over time with feedback

**Example Voice Contrasts:**
- Law firm: "Our team ensures full regulatory compliance for your expansion." (formal, expert, calm)
- Fitness studio: "Ready to crush your goals this week? Let's go!" (casual, enthusiastic, bold)`,
 },
 {
 key: 'content_calendar',
 priority: 6,
 keywords: [
 'calendar',
 'schedule',
 'planning',
 'week',
 'month',
 'upcoming',
 'queue',
 'batch',
 'workflow',
 ],
 content: `## Content Calendar Planning

**How the AI Plans Content**
Given a client brief and active content types, the AI generates a weekly content calendar:
1. Maps content pillars to days of the week
2. Balances content types (educational, promotional, engagement)
3. Accounts for industry events, holidays, and seasonal trends
4. Varies formats to keep the audience engaged
5. Builds in repurposing (blog post becomes 3 social posts and a newsletter section)

**Sample Weekly Calendar (Marketing Agency Client):**
- Monday: LinkedIn thought leadership post + blog article
- Tuesday: Instagram carousel + newsletter draft
- Wednesday: LinkedIn case study post + blog article
- Thursday: Instagram reel script + LinkedIn engagement post
- Friday: Weekly performance summary + next week preview

**Batch Production:**
The AI generates content in batches for efficiency. A typical weekly batch for one client includes:
- 2-3 blog posts (drafted, SEO-optimized)
- 5 LinkedIn posts (with image suggestions)
- 5 Instagram captions (with hashtag sets)
- 1 newsletter (with subject line variants)
- Ad copy refreshes (if ad skill is active)`,
 },
]
