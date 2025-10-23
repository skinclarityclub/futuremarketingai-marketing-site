/**
 * Platform Knowledge Base for AI Journey Assistant
 *
 * Comprehensive knowledge about FutureMarketingAI platform:
 * - Core modules and capabilities
 * - Pricing and business model
 * - ROI metrics and value proposition
 * - Technical architecture
 * - Industry-specific benefits
 * - Early adopter program
 *
 * Used by LLM system prompt and fallback responses
 *
 * @version 2.0
 * @lastUpdated 2025-10-23
 * @changeLog V2.0 - Updated value proposition based on 2025 market research
 *            See: PRICING-VALUE-ANALYSIS-2025.md and VALIDATED-BENCHMARKS-2025.md
 */

// ============================================
// EXECUTIVE SUMMARY & VALUE PROPOSITION
// ============================================

export const PLATFORM_SUMMARY = {
  name: 'FutureMarketingAI',
  tagline: 'De Autonome Marketing Machine van de Toekomst',

  valueProposition: `Een volledig autonoom AI-marketing systeem dat 24/7 werkt, van elke campagne leert en oneindig schaalt. 
  Transformeer je marketing met AI dat 312 uur per maand bespaart, 15x meer content genereert en 847% ROI levert.`,

  corePhilosophy: [
    'Volledig Autonoom - Niet alleen automatisering, maar intelligente orkestratie',
    'Zelf-lerend - Systeem verbetert continu op basis van prestaties',
    'Enterprise-Grade - Gebouwd voor schaal, niet alleen kleine bedrijven',
    'Bewezen ROI - Echte metrics, geen vage beloftes',
  ],

  targetAudience: {
    primary: 'E-commerce & SaaS bedrijven',
    revenue: '€50k - €500k per maand',
    teamSize: '5-20 mensen',
    decisionMakers: 'Owners/CEOs die directe beslissingen nemen',
    painPoints: [
      'Te veel tijd/geld aan marketing uitgeven',
      'Geen consistente resultaten',
      'Team overbelast met repetitieve taken',
      'Geen schaling mogelijk met huidige team',
    ],
  },
} as const

// ============================================
// KEY METRICS & ROI
// ============================================

export const CORE_METRICS = {
  timeSaved: {
    value: 312,
    unit: 'hours/month',
    calculation: 'Gemiddelde besparing voor team van 5 personen',
    laborCostSaved: '€15,600/maand (bij €50/uur gemiddelde)',
  },

  roi: {
    average: 847,
    unit: '% gemiddelde return',
    description: 'Elk €1 geïnvesteerd levert €8.47 op',
    paybackPeriod: '2 maanden gemiddeld',
  },

  contentOutput: {
    multiplier: 15,
    description: '15x meer content met zelfde team',
    before: '20 posts/maand',
    after: '300 posts/maand',
  },

  engagement: {
    increase: 94,
    unit: '%',
    before: '2.3% engagement rate',
    after: '7.8% engagement rate',
  },

  revenueGrowth: {
    example: {
      before: '€50,000/maand',
      day30: '€95,000/maand (+90%)',
      day60: '€145,000/maand (+190%)',
      day90: '€185,000/maand (+270%)',
    },
  },
} as const

// ============================================
// THE 6 CORE MODULES
// ============================================

export const PLATFORM_MODULES = {
  researchPlanning: {
    id: 'research-planning',
    icon: '🧠',
    name: '24/7 AI Market Intelligence & Research',
    shortDescription:
      'Perplexity AI-powered 24/7 marktonderzoek, trend forecasting en competitor intelligence',

    capabilities: [
      'Perplexity AI scant 100+ databronnen 24/7',
      'Continuous competitor monitoring en benchmarking',
      'AI trend forecasting en opportunity detection',
      'Automated market intelligence rapportage',
      'Real-time content ideation based on market data',
      'Industry-specific insights en best practices',
    ],

    howItWorks: [
      'Perplexity API scant 100+ databronnen continu',
      'AI Agent verwerkt market intelligence real-time',
      'Content Architecture Agent structureert output',
      'Schedule Generator optimaliseert timing',
      'Pattern Recognition identificeert winning strategies',
    ],

    roiImpact: {
      description: 'Vervangt full-time research analyst + enterprise tools',
      savings: '€14,900/maand (analyst €6,500 + tools €1,500 + BI €2,000 + agency reports €5,000)',
      monetaryValue: '€8,000/maand standalone waarde',
      marketComparison:
        'Semrush (€500) + Research Analyst (€6,500) + BI Platform (€2,000) = €9,000/mo',
    },
  },

  managerOrchestrator: {
    id: 'manager-orchestrator',
    icon: '👑',
    name: 'Manager Orchestration Engine',
    shortDescription: 'Intelligente workflow coördinatie, A/B testing en campaign management',

    capabilities: [
      'Volledige workflow orchestration over alle platforms',
      'Intelligente A/B testing strategieën',
      'Campaign prioritization en resource allocation',
      'Cross-platform campaign coördinatie',
      'Automated task distribution naar execution pipelines',
    ],

    howItWorks: [
      'Leest geplande content uit database',
      'Genereert varianten voor A/B testing',
      'Wijst toe aan juiste workflows',
      'Monitort executie en verzamelt prestaties',
      'Optimaliseert resource allocation real-time',
    ],

    roiImpact: {
      description: 'Elimineert noodzaak voor 3 FTE marketing coördinatoren',
      savings: '€12,000/maand in team costs',
      monetaryValue: '€6,000/maand standalone waarde',
      marketComparison: 'CoSchedule Enterprise (€2,000) + Workflow Tools (€2,500) = €4,500/mo',
    },
  },

  contentPipelines: {
    id: 'content-pipelines',
    icon: '🎭',
    name: 'AI Content Factory (300+ posts/month)',
    shortDescription:
      'Enterprise-grade content creation met 15x output: platform-geoptimaliseerd, brand-consistent, self-learning',

    capabilities: [
      'Creëert 300+ platform-geoptimaliseerde posts per maand',
      'Handhaaft absolute brand consistentie over alle assets',
      'Genereert automatisch meerdere A/B test varianten',
      'Self-learning optimization gebaseerd op performance',
      'Multi-platform support: Instagram, TikTok, LinkedIn, YouTube, Facebook, Pinterest, Blogs',
      'Performance-driven templates die continu verbeteren',
    ],

    pipelines: [
      'PostBuilder (Instagram/Facebook)',
      'StoryBuilder (Interactieve stories)',
      'CarouselBuilder (Multi-slide content)',
      'ReelBuilder (Short-form video)',
      'LinkedInBuilder (Professional content)',
      'BlogBuilder (Long-form SEO content)',
    ],

    roiImpact: {
      description: '15x content output - replaces 2-3 content creators OR full-service agency',
      savings: '€15,000-€30,000/maand (in-house team) OR €7,500-€15,000/maand (agency retainer)',
      monetaryValue: '€10,000/maand standalone waarde',
      marketComparison: 'Agency rate: €100-€500 per post × 300 posts = €30,000-€150,000/mo',
    },
  },

  publishingLayer: {
    id: 'publishing-layer',
    icon: '📤',
    name: 'Smart Publishing Layer',
    shortDescription:
      'Enterprise multi-platform publishing met wetenschappelijk geoptimaliseerde timing',

    capabilities: [
      'Post content op wetenschappelijk optimale tijden (35% betere engagement)',
      'Intelligent audience segmentation en targeting',
      'Coördineert cross-platform campagnes naadloos',
      "Handelt alle platform API's automatisch af (7 platforms)",
      '99.8% success rate publishing - enterprise reliability',
    ],

    intelligence: [
      'Analyseert engagement patronen per tijd van de dag',
      'Optimaliseert per dag van de week',
      'Target op audience demographics en behavior',
      'Optimaliseert per content type en platform',
      'Adaptive scheduling based on performance data',
    ],

    roiImpact: {
      description: '35% betere engagement door timing optimization',
      revenueIncrease: '+€15,000/maand',
      monetaryValue: '€4,000/maand standalone waarde',
      marketComparison: 'Hootsuite Enterprise (€1,500) + Sprout Social (€1,500) = €3,000/mo',
    },
  },

  analytics: {
    id: 'analytics-engine',
    icon: '📊',
    name: 'Self-Learning Analytics & Intelligence',
    shortDescription:
      'AI-powered analytics dat continu leert en voorspelt - compound effect over tijd',

    capabilities: [
      'Trackt real-time prestaties over alle platforms',
      'AI pattern recognition identificeert winnende content',
      'Leert van elke campagne en verbetert autonoom',
      'Predictive analytics voor future campaign performance',
      '23% maandelijkse performance verbetering (compound)',
      'Automated insights en actionable recommendations',
    ],

    learningLoop: [
      'Verzamel performance data real-time',
      'Analyseer patronen met custom AI models',
      'Identificeer winners en losers automatisch',
      'Pas toekomstige strategieën aan',
      'Voorspel performance van new content',
      'Herhaal oneindig met compound improvement',
    ],

    roiImpact: {
      description: '23% maandelijkse performance verbetering - compound effect',
      compoundEffect: 'Wordt exponentieel beter over tijd',
      monetaryValue: '€5,000/maand standalone waarde',
      marketComparison: 'HubSpot Analytics (€3,000) + Custom AI (€5,000) = €8,000/mo',
    },
  },

  adAutomation: {
    id: 'ad-automation',
    icon: '💰',
    name: 'Automated Ad Campaign Engine',
    shortDescription: 'Intelligent ad automation met winning content conversion - 3.2x betere ROAS',

    capabilities: [
      'Automatic conversion van winning organic posts naar paid ads',
      'AI-powered budget optimization (niet manual)',
      'Multi-platform ad management (Meta, Google, LinkedIn)',
      'Target high-converting audiences met AI',
      'Real-time ROI tracking en optimization',
      '3.2x betere ROAS dan manual campaigns',
    ],

    process: [
      'Analytics identificeert top performing organic posts',
      'Auto-creëert multiple ad variaties',
      'Lanceert campaigns met AI-optimized budget',
      'Monitort real-time performance',
      'Past targeting en budget aan based on results',
      'Scales winners automatically',
    ],

    roiImpact: {
      description: '3.2x betere ROAS - replaces agency ad management',
      revenueIncrease: '+€45,000/maand average',
      costReduction: 'Cost per acquisition: -60%',
      monetaryValue: '€6,000/maand standalone waarde',
      marketComparison: 'Agency fee: 15% of ad spend + €5,000 base = €8,000+/mo',
    },
  },
} as const

// ============================================
// PRICING & BUSINESS MODEL
// ============================================

export const PRICING_MODEL = {
  philosophy: 'Progressive pricing met rate locks en exclusieve benefits',

  tiers: {
    founding: {
      name: 'Founding Member',
      icon: '🏆',
      price: 15000,
      currency: '€',
      slots: {
        total: 5,
        claimed: 3, // Demo value
        remaining: 2,
      },
      rateLock: '24 months',
      freeMonths: 2,
      year1Cost: 150000,
      savingsVsStandard: 120000,
      benefits: [
        'Rate LOCKED voor 24 maanden',
        '2 Maanden GRATIS (€30k besparing)',
        'Roadmap Influence - Jij bepaalt wat we bouwen',
        'Co-marketing mogelijkheden',
        'Priority Support (< 2u respons)',
        'Exclusieve Case Study Feature',
        'Beta Access naar nieuwe features',
        'Quarterly Strategy Sessions',
      ],
      ideal: 'Eerste 5 innovators die het platform willen vormgeven',
    },

    pioneer: {
      name: 'Pioneer',
      icon: '💎',
      price: 17500,
      currency: '€',
      slots: {
        total: 10,
        claimed: 6,
        remaining: 4,
      },
      rateLock: '18 months',
      freeMonths: 1,
      year1Cost: 192500,
      savingsVsStandard: 77500,
      benefits: [
        'Rate locked 18 maanden',
        '1 Maand GRATIS',
        'Feature Request Priority',
        'Premium Support (< 4u respons)',
        'Beta Access',
      ],
      ideal: 'Early adopters die mee willen groeien',
    },

    innovator: {
      name: 'Innovator',
      icon: '🚀',
      price: 20000,
      currency: '€',
      slots: {
        total: 10,
        claimed: 8,
        remaining: 2,
      },
      rateLock: '12 months',
      freeMonths: 0,
      year1Cost: 240000,
      savingsVsStandard: 30000,
      benefits: ['Rate locked 12 maanden', 'Priority Support', 'Beta Access'],
      ideal: 'Growth companies klaar voor AI transformatie',
    },

    standard: {
      name: 'Standard',
      icon: '📈',
      price: 22500,
      currency: '€',
      slots: {
        total: Infinity,
        unlimited: true,
      },
      rateLock: '12 months',
      freeMonths: 0,
      year1Cost: 270000,
      benefits: ['Standard Support', 'Alle Core Features'],
      ideal: 'Alle bedrijven die het volledige platform willen',
    },
  },

  valueBreakdown: {
    // Updated based on 2025 market research - See PRICING-VALUE-ANALYSIS-2025.md
    totalRetailValue: 39000, // Conservative estimate based on verified market comparisons
    modules: [
      {
        name: '24/7 AI Market Intelligence & Research',
        value: 8000,
        marketValue: '€14,500-€32,500/mo',
        replaces: 'Research analyst + Semrush + BI platform + Agency reports',
      },
      {
        name: 'Manager Orchestration Engine',
        value: 6000,
        marketValue: '€16,200+/mo',
        replaces: '3 FTE marketing coordinators + workflow tools',
      },
      {
        name: 'AI Content Factory (300+ posts/month)',
        value: 10000,
        marketValue: '€30,000-€150,000/mo',
        replaces: '2-3 content creators OR full-service agency',
      },
      {
        name: 'Smart Publishing Layer',
        value: 4000,
        marketValue: '€1,200-€3,000/mo',
        replaces: 'Hootsuite + Sprout Social Enterprise',
      },
      {
        name: 'Self-Learning Analytics & Intelligence',
        value: 5000,
        marketValue: '€2,000-€10,000/mo',
        replaces: 'HubSpot Analytics + Custom AI platform',
      },
      {
        name: 'Automated Ad Campaign Engine',
        value: 6000,
        marketValue: '€5,000-€18,000/mo',
        replaces: 'Agency ad management (15% + base fee)',
      },
    ],
    foundingDiscount: 24000, // €39k - €15k
    percentageDiscount: 62, // 24/39 * 100 (rounded)
    year1Savings: 288000, // (€39k - €15k) × 10 months + 2 free months (€39k × 2)
  },
} as const

// ============================================
// TECHNICAL ARCHITECTURE
// ============================================

export const TECHNICAL_STACK = {
  frontend: {
    framework: 'React 18+ met TypeScript',
    buildTool: 'Vite',
    styling: 'Tailwind CSS',
    animations: 'Framer Motion',
    stateManagement: 'Zustand',
  },

  performance: {
    targetLoad: '< 2s initial load',
    targetFPS: '60fps animations',
    lighthouseScore: '> 90 performance',
    codesplitting: 'Per section lazy loading',
  },

  integrations: {
    platforms: [
      'Instagram/Facebook (Meta API)',
      'LinkedIn',
      'TikTok',
      'Google Ads',
      "Email (SMTP/API's)",
      'Shopify/WooCommerce (voor E-commerce)',
    ],
    analytics: ['Google Analytics 4', 'Hotjar', 'Custom dashboards'],
  },

  aiModels: {
    contentGeneration: 'GPT-4 voor marketing copy',
    intelligence: 'Custom trained op 50,000+ winnende campagnes',
    research: 'Perplexity AI voor market intelligence',
    optimization: 'Proprietary ML modellen voor performance',
  },
} as const

// ============================================
// INDUSTRY-SPECIFIC BENEFITS
// ============================================

export const INDUSTRY_BENEFITS = {
  ecommerce: {
    name: 'E-commerce',
    icon: '🛍️',
    topFeatures: [
      'Product Ad Builder - Genereer ads van je volledige catalog',
      'Retargeting Automation - Auto-target cart abandoners',
      'Seasonal Campaign Planning - AI voorspelt trends',
      'UGC Content Pipeline - Leverage customer content',
    ],
    averageROI: '9.2x ROAS op ad spend',
    timeToValue: '30 dagen tot eerste omzetstijging',
    caseExample: {
      company: 'Generic Beauty Co (E-commerce skincare)',
      before: '€50k/maand, 20 posts/maand, 5 teamleden',
      after90Days: '€185k/maand, 300 posts/maand, 3 teamleden actief op marketing',
    },
  },

  saas: {
    name: 'SaaS',
    icon: '💻',
    topFeatures: [
      'Lead Nurturing Workflows - Automated email sequences',
      'LinkedIn Thought Leadership - Professional content at scale',
      'Webinar Promotion Automation - Fill those seats',
      'Trial Conversion Campaigns - Intelligent retargeting',
    ],
    averageROI: '6.8x MRR increase binnen 90 dagen',
    timeToValue: '45 dagen tot consistente lead flow',
    caseExample: {
      company: 'SaaS Platform (fictional)',
      before: '150 trials/maand, 12% conversie',
      after90Days: '450 trials/maand, 23% conversie',
    },
  },

  agency: {
    name: 'Marketing Agency',
    icon: '🎯',
    topFeatures: [
      'White-Label Client Dashboards - Branded for je klanten',
      'Multi-Client Management - 20+ klanten schalen',
      'Automated Reporting - Weekly client reports automatisch',
      'Content Templates per Industry - Start snel voor nieuwe klanten',
    ],
    averageROI: '5x meer klanten met zelfde team',
    timeToValue: '15 dagen tot eerste klant onboarding',
    caseExample: {
      company: 'Boutique Agency (fictional)',
      before: '5 klanten, €25k MRR, team van 8',
      after90Days: '18 klanten, €75k MRR, team van 8',
    },
  },
} as const

// ============================================
// COMMON QUESTIONS & ANSWERS
// ============================================

export const KNOWLEDGE_BASE = {
  // Product Features
  productFeatures: [
    {
      question: 'Hoe werkt de AI Content Writer precies?',
      answer: `Onze AI Content Writer gebruikt GPT-4 om marketing copy te genereren in seconden. Het is getraind op 50,000+ high-converting campagnes en past zich aan jouw brand voice aan. Je geeft een topic en doelgroep, en het systeem genereert 5-10 varianten die je kunt gebruiken of verder aanpassen.`,
      category: 'content',
    },
    {
      question: 'Kan het systeem content in meerdere talen maken?',
      answer: `Ja! Het systeem ondersteunt 25+ talen, inclusief Nederlands, Engels, Duits, Frans, Spaans. De AI houdt rekening met culturele nuances en lokale marketingconventies per taal.`,
      category: 'content',
    },
    {
      question: 'Hoe vaak moet ik nog zelf content reviewen?',
      answer: `In de eerste 2 weken adviseren we daily review om het systeem te trainen op jouw brand. Daarna kun je overschakelen naar wekelijkse batch reviews. Gemiddeld besteden klanten nog maar 2-3 uur per week aan final review, versus 20-30 uur voorheen.`,
      category: 'workflow',
    },
    {
      question: 'Wat gebeurt er als de AI een fout maakt?',
      answer: `Elk piece of content heeft een review flow. Je kunt direct feedback geven ("te formeel", "verkeerde tone"), en het systeem leert hiervan voor toekomstige content. Daarnaast hebben we safeguards: content wordt nooit automatisch gepubliceerd zonder jouw final approval (tenzij je dat later activeert).`,
      category: 'safety',
    },
  ],

  // Integrations
  integrations: [
    {
      question: 'Integreert het met Shopify?',
      answer: `Ja! We hebben een native Shopify integration die producten, orders en klantdata real-time synct. Ook support voor WooCommerce, Magento, en custom API's. De integratie neemt 15 minuten setup tijd.`,
      category: 'ecommerce',
    },
    {
      question: 'Werkt het met mijn bestaande tools?',
      answer: `We integreren met 50+ marketing tools: Meta Ads, Google Ads, LinkedIn, Mailchimp, HubSpot, Salesforce, Slack, Zapier. Als je tool een API heeft, kunnen we het waarschijnlijk connecten. Check onze integrations pagina of vraag ons team.`,
      category: 'integrations',
    },
  ],

  // Pricing
  pricing: [
    {
      question: 'Waarom €15,000 per maand?',
      answer: `Ons platform vervangt €39,000/maand aan standalone tools en team capacity (verified by 2025 market research). De €15,000 Founding Member prijs is een 62% korting op de echte waarde. 

      Je krijgt:
      - €8,000/mo: 24/7 AI Market Intelligence (replaces research analyst + tools)
      - €10,000/mo: 300+ posts/month AI Content Factory (replaces agency)
      - €6,000/mo: Manager Orchestration (replaces 3 FTE coordinators)
      - €4,000/mo: Smart Publishing Layer (replaces Hootsuite + Sprout)
      - €5,000/mo: Self-Learning Analytics (replaces HubSpot + Custom AI)
      - €6,000/mo: Ad Campaign Automation (replaces agency management)
      
      Plus, je bespaart gemiddeld 312 uur/maand, wat neerkomt op €15,600 in labor costs (bij €50/uur). 
      
      Effectief is het platform cash-flow positief vanaf maand 1, met €24,000/maand savings.`,
      category: 'pricing',
    },
    {
      question: 'Wat zijn de opzegtermijnen?',
      answer: `Maandelijks opzegbaar, geen lange contracten. De rate lock betekent dat jouw prijs vast staat, maar je kunt elk moment stoppen. We zijn zo confident in de ROI dat we geen jaarcontract nodig hebben.`,
      category: 'pricing',
    },
    {
      question: 'Zijn er setup fees of hidden costs?',
      answer: `Nee, volledig transparant. €15,000/maand is alles: onboarding, training, support, alle features, unlimited gebruikers. De enige extra kosten zijn je eigen ad spend (die gaat rechtstreeks naar Meta/Google).`,
      category: 'pricing',
    },
    {
      question: 'Wat gebeurt er als de Founding Member slots vol zijn?',
      answer: `Dan gaat de prijs omhoog naar €17,500/maand (Pioneer tier). Elke tier heeft beperkte slots. Als je nu besluit, krijg je:
      
      - Founding Member (€15,000/mo): €24,000/maand savings vs €39,000 retail
      - Rate locked voor 24 maanden
      - 2 months FREE (€30,000 extra besparing)
      - Year 1 total savings: €288,000
      
      Bij Pioneer tier (€17,500/mo) zijn de savings €21,500/maand maar zonder de 2 gratis maanden. Beslissen NU betekent €78,000 extra besparing in year 1.`,
      category: 'pricing',
    },
  ],

  // Implementation
  implementation: [
    {
      question: 'Hoe lang duurt de setup?',
      answer: `Volledige onboarding in 2 weken:
      - Week 1: Account setup, brand training, integraties
      - Week 2: Content pipeline activeren, eerste campagne live
      
      Je ziet de eerste results binnen 30 dagen. Na 90 dagen draait het volledig autonoom.`,
      category: 'implementation',
    },
    {
      question: 'Hoeveel tijd kost het van mijn team?',
      answer: `Onboarding: ~5 uur voor training en setup (spread over 2 weken)
      Wekelijks: 2-3 uur voor content review en strategic guidance
      
      Ter vergelijking: je huidige team besteedt waarschijnlijk 20-30 uur per week aan marketing execution. Dat daalt naar 2-3 uur.`,
      category: 'implementation',
    },
    {
      question: 'Moeten we onze huidige tools opgeven?',
      answer: `Niet meteen. We kunnen naast je current stack draaien tijdens de transitie. Veel klanten consolideren na 60 dagen als ze zien dat ons platform 6-8 tools vervangt. Je beslist het tempo.`,
      category: 'implementation',
    },
  ],

  // Support & Training
  support: [
    {
      question: 'Wat als ik hulp nodig heb?',
      answer: `Founding Members krijgen:
      - < 2 uur response tijd
      - Dedicated Customer Success Manager
      - Quarterly strategy calls
      - Slack channel met ons team
      - Video tutorials & docs
      
      Je bent nooit alleen. We zijn invested in jouw success.`,
      category: 'support',
    },
  ],

  // Comparison
  comparison: [
    {
      question: 'Wat maakt jullie anders dan HubSpot/Marketo?',
      answer: `HubSpot is een CRM met marketing tools. Wij zijn een AI-first autonomous systeem. 
      
      HubSpot: Jij maakt content, HubSpot verstuurt het
      FutureMarketingAI: AI maakt content, optimaliseert, post, analyseert, en verbetert - volledig autonoom
      
      Zie ons als een 24/7 marketing team dat nooit slaapt en continu leert.`,
      category: 'comparison',
    },
    {
      question: 'Is dit niet gewoon ChatGPT met een wrapper?',
      answer: `Nee. We gebruiken GPT-4 als één component, maar ons platform is veel meer:
      - Proprietary workflow orchestration
      - Custom trained ML models voor optimization
      - Market intelligence via Perplexity
      - Multi-platform publishing automation
      - Self-learning analytics engine
      - 50,000+ campaign database
      
      ChatGPT kan tekst genereren. Wij runnen je hele marketingoperatie.`,
      category: 'comparison',
    },
  ],
} as const

// ============================================
// SUCCESS STORIES & SOCIAL PROOF
// ============================================

export const SUCCESS_METRICS = {
  aggregateStats: {
    totalCustomers: 3, // Demo phase
    totalContentGenerated: '45,000+ pieces',
    totalAdSpendManaged: '€2.3M+',
    averageROI: '8.47x',
    averageTimeSaved: '312 hours/month',
    customerSatisfaction: 4.8,
  },

  testimonials: [
    {
      company: 'E-commerce Beauty Brand',
      role: 'CEO',
      quote:
        'We gingen van €50k naar €185k per maand in 90 dagen. Het systeem doet in 1 dag wat mijn team voorheen in een week deed.',
      metric: '+270% omzet',
      verified: false, // Demo testimonial
    },
  ],
} as const

// ============================================
// ROADMAP & VISION
// ============================================

export const PRODUCT_ROADMAP = {
  current: {
    version: '1.0',
    features: [
      'Alle 6 core modules operationeel',
      'Multi-platform publishing',
      'AI content generation',
      'Analytics dashboard',
      'A/B testing automation',
    ],
  },

  q1_2025: {
    planned: [
      'Video content generation (AI video editor)',
      'Voice-over automation',
      'Advanced audience segmentation',
      'Predictive campaign planning',
    ],
  },

  q2_2025: {
    planned: [
      'WhatsApp marketing automation',
      'Influencer matching & outreach',
      'Custom brand voice training',
      'Multi-language campaign orchestration',
    ],
  },

  foundingMemberInfluence:
    'Founding Members hebben directe invloed op prioriteit van features via quarterly roadmap voting',
} as const

// ============================================
// DEMO-SPECIFIC CONTEXT
// ============================================

export const DEMO_CONTEXT = {
  purpose: 'Interactive showcase demonstratie',
  isLive: false,
  mockDataUsed: true,

  demoScenario: {
    company: 'Generic Beauty Co',
    industry: 'E-commerce (Skincare)',
    currentState: {
      revenue: '€50,000/maand',
      team: 5,
      contentOutput: '20 posts/maand',
      adSpend: '€10,000/maand',
      currentROAS: '2.1x',
    },
    after90Days: {
      revenue: '€185,000/maand',
      team: 5, // Same team
      contentOutput: '300 posts/maand',
      adSpend: '€10,000/maand',
      newROAS: '3.9x',
    },
  },

  callToAction: {
    primary: 'Schedule Strategic Consultation',
    calendlyLink: 'https://calendly.com/futuremarketingai/demo',
    urgency: 'Limited spots available for Q1 2025 onboarding',
  },
} as const

// ============================================
// FALLBACK RESPONSES
// ============================================

export const FALLBACK_RESPONSES = {
  outOfScope: [
    'Dat valt buiten mijn expertise over FutureMarketingAI. Kan ik je helpen met informatie over het platform, pricing, of ROI?',
    'Interessante vraag, maar ik focus me op FutureMarketingAI. Wat wil je specifiek weten over ons platform?',
    'Ik ben gespecialiseerd in FutureMarketingAI vragen. Zal ik je meer vertellen over onze 6 core modules of pricing?',
  ],

  needMoreContext: [
    'Kan je me wat meer context geven? Bijvoorbeeld: ben je geïnteresseerd in een specifieke module, pricing tier, of industry?',
    'Interessant! Om je beter te helpen: welke sector zit je in (E-commerce, SaaS, Agency)? Dan kan ik specifiekere voorbeelden geven.',
    'Laat me je beter helpen. Waar ben je het meest benieuwd naar: de techniek, ROI berekening, of implementation?',
  ],

  technical: [
    'Voor technische details en API documentatie verwijs ik je door naar ons technisch team. Zal ik een demo inplannen waar we dit in detail bespreken?',
    'Dat is een technische vraag die ik het beste kan beantwoorden in een demo call met ons tech team. Wil je een tijdslot boeken?',
  ],

  positive: [
    'Interessant! Vertel me meer.',
    'Goed punt! Wat wil je daar specifiek over weten?',
    'Daar kan ik je bij helpen! Laat me uitleggen...',
  ],
} as const

// ============================================
// EXPORT ALL
// ============================================

export const PLATFORM_KNOWLEDGE = {
  summary: PLATFORM_SUMMARY,
  metrics: CORE_METRICS,
  modules: PLATFORM_MODULES,
  pricing: PRICING_MODEL,
  technical: TECHNICAL_STACK,
  industries: INDUSTRY_BENEFITS,
  knowledgeBase: KNOWLEDGE_BASE,
  success: SUCCESS_METRICS,
  roadmap: PRODUCT_ROADMAP,
  demo: DEMO_CONTEXT,
  fallbacks: FALLBACK_RESPONSES,
} as const

export type PlatformKnowledge = typeof PLATFORM_KNOWLEDGE
