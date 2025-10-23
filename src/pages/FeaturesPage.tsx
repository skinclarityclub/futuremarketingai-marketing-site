/**
 * Features Page - Deep dive into platform capabilities
 *
 * SEO-optimized page for "AI marketing automation features" keywords.
 * Target word count: 2000-3000 words for strong SEO.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { StructuredDataPresets } from '../components/seo/StructuredData'
import { TermDefinitions } from '../components/seo/TermDefinitions'
import FeaturesSection from '../components/landing/FeaturesSection'

export const FeaturesPage: React.FC = () => {
  const { t } = useTranslation(['features', 'common'])

  return (
    <>
      {/* Simple Header */}
      <SimpleHeader />

      {/* SEO Meta Tags */}
      <SEOHead
        title={t('features:seo.title')}
        description={t('features:seo.description')}
        keywords={t('features:seo.keywords', { returnObjects: true }) as string[]}
        canonical="https://futuremarketingai.com/features"
      />

      {/* Structured Data */}
      <StructuredDataPresets.webpage
        name="Platform Features"
        description="Complete overview of Future Marketing AI's 6 autonomous modules"
        url="https://futuremarketingai.com/features"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-100">{t('features:hero.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('features:hero.title')}
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              {t('features:hero.description')}
            </p>
          </div>
        </section>

        {/* Main Content - Full FeaturesSection */}
        <FeaturesSection />

        {/* Marketing Terms Glossary */}
        <TermDefinitions />

        {/* CTA Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('features:cta.title')}
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                {t('features:cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {t('features:cta.demo_button')}
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                >
                  {t('features:cta.pricing_button')}
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

export default FeaturesPage
