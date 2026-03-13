/**
 * How It Works Page - Deep dive into platform mechanics
 *
 * SEO-optimized page for "how does AI marketing work" keywords.
 * Includes FAQ, process overview, and terminology.
 */

import React from 'react'
import { Brain, Settings, Zap, Send, BarChart3, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { StructuredDataPresets } from '../components/seo/StructuredData'
import { FAQSection } from '../components/seo/FAQSection'
import { TermDefinitions } from '../components/seo/TermDefinitions'
import { CTAButton } from '../components/common/CTAButton'

export const HowItWorksPage: React.FC = () => {
  const { t } = useTranslation(['how-it-works', 'common'])

  // Icon mapping for the 6 steps
  const STEP_ICONS = [Brain, Zap, Settings, Send, BarChart3, Target]
  const STEP_KEYS = ['research', 'content', 'workflow', 'publishing', 'learning', 'ads']

  return (
    <>
      {/* Simple Header */}
      <SimpleHeader />

      {/* SEO Meta Tags */}
      <SEOHead
        title={t('how-it-works:seo.title')}
        description={t('how-it-works:seo.description')}
        keywords={t('how-it-works:seo.keywords', { returnObjects: true }) as string[]}
        canonical="https://futuremarketingai.com/how-it-works"
      />

      {/* Structured Data - FAQPage */}
      <StructuredDataPresets.faqPage />

      <div className="min-h-screen bg-bg-deep">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1
              className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
            >
              {t('how-it-works:hero.title')}
            </h1>
            <p
              className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
            >
              {t('how-it-works:hero.description')}
            </p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-12 text-center">
              {t('how-it-works:process.title')}
            </h2>
            <div className="space-y-8">
              {STEP_KEYS.map((stepKey, index) => {
                const Icon = STEP_ICONS[index]
                return (
                  <motion.div
                    key={stepKey}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="card-gradient-border rounded-card flex flex-col md:flex-row gap-6 items-start bg-white/[0.02] border border-border-primary p-8 transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                  >
                    {/* Step Number + Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-accent-system/20 border border-accent-system/30 rounded-card flex items-center justify-center relative">
                        <Icon className="w-8 h-8 text-accent-system" />
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent-human/20 border border-accent-human/30 rounded-full flex items-center justify-center text-xs font-mono text-accent-human font-bold">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="text-sm font-semibold font-mono text-accent-human mb-2">
                        {t(`how-it-works:process.steps.${stepKey}.step`)}
                      </div>
                      <h3 className="text-2xl font-bold font-display text-text-primary mb-3">
                        {t(`how-it-works:process.steps.${stepKey}.title`)}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {t(`how-it-works:process.steps.${stepKey}.description`)}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Loop Indicator */}
            <div className="mt-8 card-gradient-border rounded-card bg-accent-system/5 border border-accent-system/20 p-6 text-center transition-all duration-500 hover:bg-accent-system/10">
              <p className="text-text-secondary">
                <strong className="text-text-primary">
                  {t('how-it-works:process.loop_title')}
                </strong>{' '}
                {t('how-it-works:process.loop_description')}
              </p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <FAQSection />

        {/* Marketing Terms */}
        <TermDefinitions showAdvanced />

        {/* Final CTA */}
        <section className="py-16 px-12">
          <div className="max-w-7xl mx-auto text-center">
            <div className="card-gradient-border rounded-card bg-white/[0.02] border border-border-primary p-12 transition-all duration-500 hover:bg-white/[0.03] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
                {t('how-it-works:cta.title')}
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                {t('how-it-works:cta.description')}
              </p>
              <CTAButton calendly arrow size="lg">
                {t('how-it-works:cta.button')}
              </CTAButton>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default HowItWorksPage
