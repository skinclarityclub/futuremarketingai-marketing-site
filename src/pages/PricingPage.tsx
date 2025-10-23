/**
 * Pricing Page - Transparent Early Adopter pricing
 *
 * SEO-optimized page for "AI marketing automation pricing" keywords.
 * Shows complete pricing tiers with transparent slot availability.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { StructuredDataPresets } from '../components/seo/StructuredData'
import {
  PricingTable,
  FeatureComparisonTable,
  ToolComparisonTable,
} from '../components/seo/ComparisonTables'
import { FAQSection } from '../components/seo/FAQSection'

export const PricingPage: React.FC = () => {
  const { t } = useTranslation(['pricing', 'common', 'seo'])

  // Load FAQ items from translations and filter to pricing-related only
  const allFAQs = t('seo:faq.items', { returnObjects: true }) as Array<{
    question: string
    answer: string
  }>

  const pricingFAQs = allFAQs.filter(
    (faq) =>
      faq.question.toLowerCase().includes('price') ||
      faq.question.toLowerCase().includes('cost') ||
      faq.question.toLowerCase().includes('roi') ||
      faq.question.toLowerCase().includes('early adopter')
  )

  return (
    <>
      {/* Simple Header */}
      <SimpleHeader />

      {/* SEO Meta Tags */}
      <SEOHead
        title={t('pricing:seo.title')}
        description={t('pricing:seo.description')}
        keywords={t('pricing:seo.keywords', { returnObjects: true }) as string[]}
        canonical="https://futuremarketingai.com/pricing"
      />

      {/* Structured Data - Product/Offer */}
      <StructuredDataPresets.product
        name="Future Marketing AI - Founding Member"
        description="Autonomous AI marketing platform with 6 core modules"
        price="15000"
        currency="EUR"
        availability="LimitedAvailability"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-6">
              <span className="text-sm font-medium text-yellow-100">{t('pricing:hero.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('pricing:hero.title')}
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-8">
              {t('pricing:hero.description')}
            </p>

            {/* Transparency Notice */}
            <div className="inline-flex items-start gap-3 px-6 py-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-left max-w-2xl mx-auto">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-100">
                <strong className="text-white">{t('pricing:hero.transparency_title')}</strong>{' '}
                {t('pricing:hero.transparency_text')}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <PricingTable showUrgency highlightTier={0} />

        {/* What You Get - Platform Value */}
        <FeatureComparisonTable />

        {/* Tool Replacement Comparison */}
        <ToolComparisonTable />

        {/* Pricing FAQs */}
        <FAQSection additionalFAQs={pricingFAQs} initialVisible={5} />

        {/* Final CTA */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('pricing:cta.title')}
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                {t('pricing:cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {t('pricing:cta.demo_button')}
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                >
                  {t('pricing:cta.contact_button')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default PricingPage
