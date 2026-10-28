// Tool outputs mirror the execute() returns in concierge/leadgen/flagship-tools.ts.
// Copied from the audit's shots.mjs SCENARIOS so the mocked specs render what production sends.
export const SKILLS = {
  name: 'Vaardigheden van Clyde',
  description: '10 vaardigheden live, 2 binnenkort.',
  services: [
    {
      name: 'Social Media',
      description: 'Posts en carrousels in de toon van elke klant.',
      url: '/nl/skills/social-media',
      status: 'live',
    },
    {
      name: 'SEO-blogs',
      description: 'Blogs die ranken, per klant in eigen stem.',
      url: '/nl/skills/blog-factory',
      status: 'live',
    },
    {
      name: 'Rapportage',
      description: 'Elke week een rapport in het dashboard.',
      url: '/nl/skills/reporting',
      status: 'live',
    },
    {
      name: 'Ad Manager',
      description: 'Campagnes voorbereiden en bijsturen.',
      url: '/nl/skills/ad-creator',
      status: 'live',
    },
    {
      name: 'Voice Agent',
      description: 'Telefoon aannemen namens het bureau.',
      url: '/nl/skills/voice-agent',
      status: 'coming_soon',
    },
  ],
}

export const CASE = {
  caseStudy: {
    client: 'SkinClarity Club',
    industry: 'Huidverzorging: een club, een webshop en het account van oprichter Sindy',
    challenge:
      'SkinClarity Club is onze eerste klant, en FutureMarketingAI is het bureau. Drie Instagram-accounts (@skinclarityclub, @sindy_huidtherapeut, @skinclarityshop), elk met een eigen publiek, toon en agenda, plus een blog en een webshop.',
    solution:
      'Eén werkruimte voor SkinClarity Club met 3 Instagram-accounts en één geheugen voor de hele klant. Alle 10 live vaardigheden staan aan. Clyde maakt en plant de content volgens de agenda, het bureau keurt goed voordat er iets live gaat, en Sindy heeft een eigen dashboard en Clyde op WhatsApp.',
    results: [
      'Posts en carrousels voor 3 accounts, elk in een eigen toon',
      'SEO-blogs voor skinclarityclub.nl',
      'Elke week een rapport in het dashboard, elke vrijdag het SEO-rapport op WhatsApp',
      'Gemeten resultaten volgen; we publiceren nog geen cijfers',
    ],
    url: 'https://future-marketing.ai/nl/case-studies/skinclarity-club',
  },
}

export const PRICING = {
  tiers: [
    {
      name: 'Founding Member',
      price: '€997 per maand, levenslang vast',
      features: ['Maximaal 10 plekken', 'Alle vaardigheden'],
      highlighted: true,
    },
    { name: 'Growth', price: '€499 per werkruimte', features: ['2-4 merken'], highlighted: false },
    {
      name: 'Professional',
      price: '€399 per werkruimte',
      features: ['5-14 merken'],
      highlighted: false,
    },
    {
      name: 'Enterprise',
      price: '€299 per werkruimte',
      features: ['15+ merken'],
      highlighted: false,
    },
  ],
}

export const ROI = {
  monthlySavings: 18406,
  annualSavings: 220872,
  roiPercent: 769,
  paybackPeriodMonths: 1,
  breakdown: {
    hoursSavedPerWeek: 80,
    timeSavedMonthly: 320,
    costSavedMonthly: 20800,
    subscriptionCost: 2394,
  },
}

export const QUALIFY = {
  score: 55,
  qualification: 'hot',
  recommendation:
    'Sterke match. Plan een gesprek om de juiste tier en vaardigheden voor jouw portfolio te bepalen.',
  nextSteps: [
    'Bekijk de SkinClarity Club case study voor concrete resultaten',
    'Dien een aanvraag in via future-marketing.ai/apply',
  ],
}

export const BOOK = {
  action: 'open_apply',
  url: 'https://future-marketing.ai/nl/apply',
  reason: 'kennismaking',
}
