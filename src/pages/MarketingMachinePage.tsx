import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { CTAButton } from '../components/common'
import { Sparkles, Loader2, CheckCircle } from 'lucide-react'

// Lazy load heavy components
const VisionTimeline = lazy(() =>
  import('../components/common/VisionTimeline').then((m) => ({ default: m.VisionTimeline }))
)
const FeatureShowcase = lazy(() =>
  import('../components/landing/FeatureShowcase').then((m) => ({ default: m.FeatureShowcase }))
)
const FeaturesSection = lazy(() =>
  import('../components/landing/FeaturesSection').then((m) => ({ default: m.FeaturesSection }))
)
const SocialProof = lazy(() =>
  import('../components/landing/SocialProof').then((m) => ({ default: m.SocialProof }))
)

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true as const },
}

const LoadingSection = () => (
  <div className="flex items-center justify-center py-24">
    <Loader2 className="w-8 h-8 text-accent-system animate-spin" />
  </div>
)

const pricingTiers = [
  {
    name: 'Starter',
    price: '€2,500/mo',
    description: 'For teams ready to build an AI content foundation',
    features: ['2 active AI modules', '40 posts/month', 'Content strategy', 'Monthly review call'],
    highlighted: false,
  },
  {
    name: 'Marketing Machine',
    price: '€4,500/mo',
    description: 'Full automation — 6 modules, 160 posts/month',
    features: [
      'All 6 AI modules',
      '160 posts/month',
      'Paid ad management',
      'Weekly performance reports',
      'Priority support',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Dedicated AI team for your organisation',
    features: [
      'Custom module configuration',
      'Unlimited content volume',
      'Dedicated AI strategist',
      'SLA guarantee',
    ],
    highlighted: false,
  },
]

export default function MarketingMachinePage() {
  return (
    <>
      <SimpleHeader />
      <SEOHead
        title="FutureMarketingAI - Autonomous AI Marketing Automation"
        description="6 AI modules working 24/7 to create, optimise, and distribute your marketing content. 160 posts/month. Zero manual work. Join the first 10 founding teams."
        keywords={[
          'AI marketing automation',
          'autonomous marketing',
          'marketing AI platform',
          'content automation',
          'AI content creation',
          'marketing machine',
          'FutureMarketingAI',
        ]}
        canonical="https://futuremarketingai.com/marketing-machine"
      />

      <div className="min-h-screen bg-bg-deep">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeInUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-system/10 border border-accent-system/20 rounded-sm mb-6">
                <Sparkles className="w-4 h-4 text-accent-system" />
                <span className="text-sm font-medium text-text-secondary">
                  The Marketing Machine
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
              {...fadeInUp}
            >
              160 Posts/Month. <span className="gradient-text-flow">Zero Manual Work.</span>
            </motion.h1>

            <motion.p
              className="text-xl text-text-muted leading-relaxed max-w-3xl mx-auto mb-10"
              {...fadeInUp}
            >
              6 AI modules working 24/7 to create, optimise, and distribute your content — while you
              focus on growing your business.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" {...fadeInUp}>
              <CTAButton size="lg" calendly arrow>
                Book a Discovery Call
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href="/calculator">
                Calculate Your ROI
              </CTAButton>
            </motion.div>

            <motion.p className="text-sm text-text-muted mt-6" {...fadeInUp}>
              No credit card · 30-min call · 24h response
            </motion.p>
          </div>
        </section>

        {/* Social Proof — trust before features */}
        <Suspense fallback={<LoadingSection />}>
          <SocialProof />
        </Suspense>

        {/* Vision Timeline — 3-era AI adoption timeline */}
        <Suspense fallback={<LoadingSection />}>
          <VisionTimeline />
        </Suspense>

        {/* Feature Showcase — 6 AI module cards overview */}
        <section className="py-4 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-4" {...fadeInUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-system/10 border border-accent-system/20 rounded-sm mb-4">
                <Sparkles className="w-4 h-4 text-accent-system" />
                <span className="text-sm font-medium text-text-secondary">The 6 AI Modules</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
                Your Autonomous Marketing Team
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Each module is a specialised AI agent — working in concert to run your entire
                marketing operation.
              </p>
            </motion.div>
          </div>
        </section>

        <Suspense fallback={<LoadingSection />}>
          <FeatureShowcase />
        </Suspense>

        {/* Features Section — detailed module breakdown */}
        <Suspense fallback={<LoadingSection />}>
          <FeaturesSection />
        </Suspense>

        {/* Pricing Teaser */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
                Founding Member Pricing
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Join the first 10 teams building an unfair 2–3 year AI lead.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {pricingTiers.map((tier, i) => (
                <motion.div
                  key={i}
                  className={`relative bg-bg-surface border rounded-sm p-8 ${
                    tier.highlighted
                      ? 'border-accent-system/50 shadow-glow-sm'
                      : 'border-border-primary'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-system text-bg-deep text-xs font-semibold rounded-sm">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-text-primary mb-1">{tier.name}</h3>
                  <p className="text-sm text-text-muted mb-4">{tier.description}</p>
                  <div className="text-2xl font-bold text-text-primary mb-6">{tier.price}</div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-text-muted">
                        <CheckCircle className="w-4 h-4 text-accent-system flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <CTAButton
                    size="md"
                    href="/pricing"
                    variant={tier.highlighted ? 'primary' : 'secondary'}
                    className="w-full justify-center"
                  >
                    See Pricing Plans
                  </CTAButton>
                </motion.div>
              ))}
            </div>

            <motion.div className="text-center" {...fadeInUp}>
              <CTAButton size="lg" href="/pricing" arrow>
                See All Pricing Plans
              </CTAButton>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="bg-accent-system/5 border border-border-primary rounded-sm p-12"
              {...fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
                Ready to Automate Your Marketing?
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                Talk to a human. 30 minutes, no obligation.
              </p>
              <CTAButton size="lg" calendly arrow>
                Book a Discovery Call
              </CTAButton>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
