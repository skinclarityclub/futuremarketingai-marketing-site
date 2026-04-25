import { tool } from 'ai'
import { z } from 'zod'
import { SKILLS_DATA } from '@/lib/skills-data'

const CASE_STUDIES = {
  skc: {
    client: 'SkinClarity Club',
    industry: 'Beauty / skincare (DTC plus physical clinic)',
    challenge:
      'Sindy runs SkinClarity Club across 4 brands and 3 Instagram accounts. Single operator capacity cap. Wanted to scale organic content without hiring an agency or junior marketer.',
    solution:
      'Deployed Clyde (the AI Marketing Medewerker) with 6 of 12 skills active: Social Media, Blog Factory, Reporting, SEO/GEO, Research, Clyde orchestrator. Per-account memory isolation. Weekly performance digest at Monday 08:00. Dreaming consolidation for overnight memory compaction.',
    results: [
      'Circa 21 carousels per week across 3 Instagram accounts',
      'Circa 15 Instagram posts per week',
      '2 to 4 longform blog articles per month with SEO optimization',
      'Weekly SEO rapport and Monday performance digest',
      'Carousel approval time from 4 minutes to 30 seconds',
      'Zero added headcount',
    ],
    testimonial:
      '"Clyde beheert onze volledige social-contentoperatie over 3 Instagram-accounts en 4 merken. Wat eerst een hele middag per week kostte, draait nu autonoom op de achtergrond. Ik beoordeel, Clyde voert uit." Sindy, founder SkinClarity Club',
    url: 'https://future-marketing.ai/nl/case-studies/skinclarity-club',
  },
} as const

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/skills/social-media': 'Social Media Manager',
  '/skills/blog-factory': 'Blog Factory',
  '/skills/ad-creator': 'Ad Creator',
  '/skills/reel-builder': 'Reel Builder',
  '/skills/voice-agent': 'Voice Agent',
  '/skills/lead-qualifier': 'Lead Qualifier',
  '/skills/email-management': 'Email Management',
  '/skills/manychat': 'ManyChat DM',
  '/skills/reporting': 'Reporting & Analytics',
  '/skills/seo-geo': 'SEO / GEO Analyst',
  '/skills/research': 'Research',
  '/skills/clyde': 'Clyde AI Employee',
  '/memory': 'Memory System',
  '/case-studies/skinclarity-club': 'SkinClarity Club Case Study',
  '/apply': 'Apply',
  '/pricing': 'Pricing',
  '/founding-member': 'Founding Member program',
  '/about': 'About Us',
  '/contact': 'Contact',
  '/how-it-works': 'How It Works',
}

export const conciergeTools = {
  get_skills: tool({
    description:
      'Get information about FutureMarketingAI skills. Use "all" for an overview of all 12 skills (9 live and 3 coming_soon), or pick a specific skill id. Skills are the core product: Clyde orchestrates these 12 skills across client brands.',
    inputSchema: z.object({
      skillId: z
        .enum([
          'all',
          'social-media',
          'blog-factory',
          'ad-creator',
          'reel-builder',
          'voice-agent',
          'lead-qualifier',
          'email-management',
          'manychat',
          'reporting',
          'seo-geo',
          'research',
          'clyde',
        ])
        .describe('Which skill to get details about'),
    }),
    execute: async ({ skillId }) => {
      if (skillId === 'all') {
        return {
          totalSkills: SKILLS_DATA.length,
          liveSkills: SKILLS_DATA.filter((s) => s.status === 'live').length,
          comingSoonSkills: SKILLS_DATA.filter((s) => s.status === 'coming_soon').length,
          skills: SKILLS_DATA.map((s) => ({
            id: s.id,
            name: s.name,
            route: s.route,
            shortDescription: s.shortDescription,
            status: s.status,
            category: s.category,
            creditCostLabel: s.creditCostLabel,
          })),
        }
      }
      const skill = SKILLS_DATA.find((s) => s.id === skillId)
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
  }),

  book_call: tool({
    description:
      'Open the application page for a partnership call. Clyde does not self-serve; bookings are application-gated.',
    inputSchema: z.object({
      reason: z.string().describe('Why the user wants to book a call'),
    }),
    execute: async ({ reason }) => ({
      action: 'open_apply',
      url: 'https://future-marketing.ai/nl/apply',
      reason,
    }),
  }),

  navigate_to_page: tool({
    description: 'Navigate the user to a specific page on the FutureMarketingAI website.',
    inputSchema: z.object({
      page: z
        .enum([
          '/',
          '/memory',
          '/pricing',
          '/apply',
          '/founding-member',
          '/case-studies/skinclarity-club',
          '/skills/social-media',
          '/skills/blog-factory',
          '/skills/ad-creator',
          '/skills/reel-builder',
          '/skills/voice-agent',
          '/skills/lead-qualifier',
          '/skills/email-management',
          '/skills/manychat',
          '/skills/reporting',
          '/skills/seo-geo',
          '/skills/research',
          '/skills/clyde',
          '/about',
          '/contact',
          '/how-it-works',
        ])
        .describe('The page URL to navigate to'),
    }),
    execute: async ({ page }) => ({
      action: 'navigate',
      url: page,
      label: PAGE_LABELS[page] ?? page,
    }),
  }),

  get_case_study: tool({
    description: 'Get the SkinClarity Club case study showing FMai results with a real client.',
    inputSchema: z.object({
      studyId: z.enum(['skc']).default('skc').describe('The case study identifier'),
    }),
    execute: async ({ studyId }) => {
      const study = CASE_STUDIES[studyId]
      if (!study) return { error: `Case study not found: ${studyId}` }
      return { caseStudy: study }
    },
  }),
}
