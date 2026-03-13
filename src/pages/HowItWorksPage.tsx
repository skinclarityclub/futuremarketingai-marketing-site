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
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
              {t('how-it-works:hero.title')}
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
              {t('how-it-works:hero.description')}
            </p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-12 text-center">
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
                    className="flex flex-col md:flex-row gap-6 items-start bg-bg-surface border border-border-primary rounded-sm p-8 hover:bg-bg-elevated transition-all"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-accent-system/20 border border-accent-system/30 rounded-sm flex items-center justify-center">
                        <Icon className="w-8 h-8 text-accent-system" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="text-sm font-semibold text-accent-system mb-2">
                        {t(`how-it-works:process.steps.${stepKey}.step`)}
                      </div>
                      <h3 className="text-2xl font-bold text-text-primary mb-3">
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
            <div className="mt-8 text-center p-6 bg-accent-system/5 border border-accent-system/20 rounded-sm">
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
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-bg-surface border border-border-primary rounded-sm p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
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
