import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { CTAButton } from '../components/common'
import { ScrollReveal } from '../components/common/ScrollReveal'
import { ProductMedia } from '../components/common/ProductMedia'
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

const LoadingSection = () => (
  <div className="flex items-center justify-center py-24">
    <Loader2 className="w-8 h-8 text-accent-system animate-spin" />
  </div>
)

const TIER_KEYS = ['starter', 'marketing_machine', 'enterprise'] as const
const TIER_HIGHLIGHTED = { starter: false, marketing_machine: true, enterprise: false }

export default function MarketingMachinePage() {
  const { t } = useTranslation('common')

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
        <section className="relative pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-12 text-center">
            <div style={{ animation: 'fadeIn 0.6s ease-out both' }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-system/10 border border-accent-system/20 rounded-sm mb-6">
                <Sparkles className="w-4 h-4 text-accent-system" />
                <span className="text-sm font-medium text-text-secondary">
                  {t('marketing_machine.hero_badge')}
                </span>
              </div>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
            >
              {t('marketing_machine.hero_title')}{' '}
              <span className="gradient-text-flow">
                {t('marketing_machine.hero_title_highlight')}
              </span>
            </h1>

            <p
              className="text-xl text-text-muted leading-relaxed max-w-3xl mx-auto mb-10"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
            >
              {t('marketing_machine.hero_description')}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
            >
              <CTAButton size="lg" calendly arrow>
                {t('marketing_machine.hero_cta_primary')}
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href="/calculator">
                {t('marketing_machine.hero_cta_secondary')}
              </CTAButton>
            </div>

            <p
              className="text-sm text-text-muted mt-6"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}
            >
              {t('marketing_machine.hero_trust_note')}
            </p>
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
        <section className="py-4">
          <div className="max-w-7xl mx-auto px-12">
            <motion.div
              className="text-center mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-system/10 border border-accent-system/20 rounded-sm mb-4">
                <Sparkles className="w-4 h-4 text-accent-system" />
                <span className="text-sm font-medium text-text-secondary">
                  {t('marketing_machine.modules_badge')}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
                {t('marketing_machine.modules_title')}
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                {t('marketing_machine.modules_description')}
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

        {/* Product Demo Media */}
        <ScrollReveal>
          <div className="max-w-7xl mx-auto px-12 py-16">
            {/* TODO: Replace with real demo video/screenshot */}
            <ProductMedia
              videoSrc="/media/placeholder-marketing-machine.mp4"
              posterSrc="/media/placeholder-marketing-machine-poster.webp"
              alt="Marketing Machine demo"
              className="max-w-4xl mx-auto"
            />
          </div>
        </ScrollReveal>

        {/* Pricing Teaser */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-12">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
                {t('marketing_machine.pricing_title')}
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                {t('marketing_machine.pricing_subtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {TIER_KEYS.map((tierKey, i) => {
                const highlighted = TIER_HIGHLIGHTED[tierKey]
                const features = t(`marketing_machine.pricing_tiers.${tierKey}.features`, {
                  returnObjects: true,
                }) as string[]

                return (
                  <motion.div
                    key={tierKey}
                    className={`relative card-gradient-border card-tilt rounded-card bg-white/[0.02] border p-8 ${
                      highlighted
                        ? 'border-accent-system/50 shadow-glow-sm'
                        : 'border-border-primary'
                    } hover:bg-white/[0.04] transition-colors`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-system text-bg-deep text-xs font-semibold rounded-sm">
                        {t('marketing_machine.pricing_most_popular')}
                      </div>
                    )}
                    <h3 className="text-xl font-bold font-display text-text-primary mb-1">
                      {t(`marketing_machine.pricing_tiers.${tierKey}.name`)}
                    </h3>
                    <p className="text-sm text-text-muted mb-4">
                      {t(`marketing_machine.pricing_tiers.${tierKey}.description`)}
                    </p>
                    <div className="text-2xl font-bold text-text-primary mb-6">
                      {t(`marketing_machine.pricing_tiers.${tierKey}.price`)}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {Array.isArray(features) &&
                        features.map((feature, j) => (
                          <li key={j} className="flex items-center gap-2 text-text-muted">
                            <CheckCircle className="w-4 h-4 text-accent-system flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                    </ul>
                    <CTAButton
                      size="md"
                      href="/pricing"
                      variant={highlighted ? 'primary' : 'secondary'}
                      className="w-full justify-center"
                    >
                      {t('marketing_machine.pricing_see_plans')}
                    </CTAButton>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <CTAButton size="lg" href="/pricing" arrow>
                {t('marketing_machine.pricing_see_all_plans')}
              </CTAButton>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-12 text-center">
            <motion.div
              className="card-gradient-border rounded-card bg-accent-system/5 border border-border-primary p-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
                {t('marketing_machine.final_cta_title')}
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                {t('marketing_machine.final_cta_description')}
              </p>
              <CTAButton size="lg" calendly arrow>
                {t('marketing_machine.final_cta_button')}
              </CTAButton>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
