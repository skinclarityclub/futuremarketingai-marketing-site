/**
 * About Page - Company information and founding story
 *
 * Transparent early-stage positioning with founding teams and vision.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Rocket, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { StructuredDataPresets } from '../components/seo/StructuredData'
import { SocialProof } from '../components/landing/SocialProof'
import { FAQSection } from '../components/seo/FAQSection'
import { TermDefinitions } from '../components/seo/TermDefinitions'

export const AboutPage: React.FC = () => {
  const { t } = useTranslation(['about', 'common'])
  return (
    <>
      {/* Simple Header */}
      <SimpleHeader />

      {/* SEO Meta Tags */}
      <SEOHead
        title={t('about:seo.title')}
        description={t('about:seo.description')}
        keywords={t('about:seo.keywords', { returnObjects: true }) as string[]}
        canonical="https://futuremarketingai.com/about"
      />

      {/* Structured Data - Organization */}
      <StructuredDataPresets.organization />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
              <Rocket className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-100">{t('about:hero.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('about:hero.title')}
            </h1>
            <p className="text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-8">
              {t('about:hero.tagline')}
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="w-8 h-8 text-blue-400" />
                {t('about:mission.heading')}
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed mb-6">
                {t('about:mission.text')}
              </p>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t('about:mission.why_heading')}
              </h3>
              <p className="text-lg text-blue-100 leading-relaxed">{t('about:mission.why_text')}</p>
            </div>
          </div>
        </section>

        {/* Timeline - Vision Section */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              {t('about:timeline.title')}
            </h2>
            <div className="space-y-8">
              {/* Past Era */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 * 0.1 }}
                className="relative border-l-4 border-white/20 pl-8 py-6 rounded-r-xl"
              >
                <div className="absolute -left-3 top-8 w-6 h-6 bg-blue-500 rounded-full border-4 border-slate-950" />
                <div className="text-sm font-semibold text-blue-300 mb-2">
                  {t('about:timeline.eras.assisted.year')}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {t('about:timeline.eras.assisted.title')}
                </h3>
                <p className="text-blue-100 leading-relaxed">
                  {t('about:timeline.eras.assisted.description')}
                </p>
              </motion.div>

              {/* Current Era */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 * 0.1 }}
                className="relative border-l-4 border-blue-500 bg-blue-500/10 pl-8 py-6 rounded-r-xl"
              >
                <div className="absolute -left-3 top-8 w-6 h-6 bg-blue-500 rounded-full border-4 border-slate-950" />
                <div className="text-sm font-semibold text-blue-300 mb-2">
                  {t('about:timeline.eras.autonomous.year')}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {t('about:timeline.eras.autonomous.title')}
                  <span className="ml-3 text-lg text-blue-400">
                    {t('about:timeline.eras.autonomous.you_are_here')}
                  </span>
                </h3>
                <p className="text-blue-100 leading-relaxed">
                  {t('about:timeline.eras.autonomous.description')}
                </p>
              </motion.div>

              {/* Future Era */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 2 * 0.1 }}
                className="relative border-l-4 border-white/20 pl-8 py-6 rounded-r-xl"
              >
                <div className="absolute -left-3 top-8 w-6 h-6 bg-blue-500 rounded-full border-4 border-slate-950" />
                <div className="text-sm font-semibold text-blue-300 mb-2">
                  {t('about:timeline.eras.standard.year')}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {t('about:timeline.eras.standard.title')}
                </h3>
                <p className="text-blue-100 leading-relaxed">
                  {t('about:timeline.eras.standard.description')}
                </p>
              </motion.div>
            </div>

            {/* Key Message */}
            <div className="mt-12 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl text-center">
              <p className="text-xl font-semibold text-white mb-2">
                {t('about:timeline.key_message.title')}
              </p>
              <p className="text-blue-100">{t('about:timeline.key_message.description')}</p>
            </div>
          </div>
        </section>

        {/* Founding Teams - Social Proof */}
        <SocialProof />

        {/* FAQ Section */}
        <FAQSection />

        {/* Marketing Terms */}
        <TermDefinitions showAdvanced />

        {/* Final CTA */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('about:cta.title')}
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                {t('about:cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {t('about:cta.demo_button')}
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                >
                  {t('about:cta.contact_button')}
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

export default AboutPage
