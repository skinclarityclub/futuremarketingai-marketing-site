/**
 * How It Works Page - Deep dive into platform mechanics
 *
 * SEO-optimized page for "how does AI marketing work" keywords.
 * Includes FAQ, process overview, and terminology.
 */

import React from 'react'
import { ArrowRight, Brain, Settings, Zap, Send, BarChart3, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { StructuredDataPresets } from '../components/seo/StructuredData'
import { FAQSection } from '../components/seo/FAQSection'
import { TermDefinitions } from '../components/seo/TermDefinitions'

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

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('how-it-works:hero.title')}
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              {t('how-it-works:hero.description')}
            </p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
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
                    className="flex flex-col md:flex-row gap-6 items-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="text-sm font-semibold text-blue-300 mb-2">
                        {t(`how-it-works:process.steps.${stepKey}.step`)}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {t(`how-it-works:process.steps.${stepKey}.title`)}
                      </h3>
                      <p className="text-blue-100 leading-relaxed">
                        {t(`how-it-works:process.steps.${stepKey}.description`)}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Loop Indicator */}
            <div className="mt-8 text-center p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
              <p className="text-blue-100">
                <strong className="text-white">{t('how-it-works:process.loop_title')}</strong>{' '}
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
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('how-it-works:cta.title')}
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                {t('how-it-works:cta.description')}
              </p>
              <a
                href="/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                {t('how-it-works:cta.button')}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default HowItWorksPage
