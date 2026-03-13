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
import { CTAButton } from '../components/common/CTAButton'

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

      <div className="min-h-screen bg-bg-deep">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-12">
          <div className="max-w-7xl mx-auto text-center">
            <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-human/10 border border-accent-human/20 rounded-full mb-6">
                <Rocket className="w-5 h-5 text-accent-human" />
                <span className="text-sm font-medium text-text-secondary">
                  {t('about:hero.badge')}
                </span>
              </div>
            </div>
            <h1
              className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
            >
              {t('about:hero.title')}
            </h1>
            <p
              className="text-2xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-8"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
            >
              {t('about:hero.tagline')}
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-12">
          <div className="max-w-7xl mx-auto">
            <div className="card-gradient-border rounded-card bg-white/[0.02] border border-border-primary p-12 transition-all duration-500 hover:bg-white/[0.03] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <h2 className="text-3xl font-bold font-display text-text-primary mb-6 flex items-center gap-3">
                <Target className="w-8 h-8 text-accent-system" />
                {t('about:mission.heading')}
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-6">
                {t('about:mission.text')}
              </p>
              <h3 className="text-2xl font-bold font-display text-text-primary mb-4">
                {t('about:mission.why_heading')}
              </h3>
              <p className="text-lg text-text-secondary leading-relaxed">
                {t('about:mission.why_text')}
              </p>
            </div>
          </div>
        </section>

        {/* Timeline - Vision Section */}
        <section className="py-16 px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-12 text-center">
              {t('about:timeline.title')}
            </h2>
            <div className="space-y-8">
              {/* Past Era */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 * 0.1 }}
                className="card-gradient-border rounded-card relative border-l-4 border-border-primary pl-8 py-6 bg-white/[0.02] border transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
              >
                <div className="absolute -left-3 top-8 w-6 h-6 bg-accent-system rounded-full border-4 border-bg-deep" />
                <div className="text-sm font-semibold font-mono text-accent-system mb-2">
                  {t('about:timeline.eras.assisted.year')}
                </div>
                <h3 className="text-2xl font-bold font-display text-text-primary mb-3">
                  {t('about:timeline.eras.assisted.title')}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {t('about:timeline.eras.assisted.description')}
                </p>
              </motion.div>

              {/* Current Era */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 * 0.1 }}
                className="card-gradient-border rounded-card relative border-l-4 border-accent-system bg-accent-system/10 pl-8 py-6 border transition-all duration-500 hover:bg-accent-system/15 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
              >
                <div className="absolute -left-3 top-8 w-6 h-6 bg-accent-system rounded-full border-4 border-bg-deep" />
                <div className="text-sm font-semibold font-mono text-accent-system mb-2">
                  {t('about:timeline.eras.autonomous.year')}
                </div>
                <h3 className="text-2xl font-bold font-display text-text-primary mb-3">
                  {t('about:timeline.eras.autonomous.title')}
                  <span className="ml-3 text-lg text-accent-system">
                    {t('about:timeline.eras.autonomous.you_are_here')}
                  </span>
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {t('about:timeline.eras.autonomous.description')}
                </p>
              </motion.div>

              {/* Future Era */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 2 * 0.1 }}
                className="card-gradient-border rounded-card relative border-l-4 border-border-primary pl-8 py-6 bg-white/[0.02] border transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
              >
                <div className="absolute -left-3 top-8 w-6 h-6 bg-accent-system rounded-full border-4 border-bg-deep" />
                <div className="text-sm font-semibold font-mono text-accent-system mb-2">
                  {t('about:timeline.eras.standard.year')}
                </div>
                <h3 className="text-2xl font-bold font-display text-text-primary mb-3">
                  {t('about:timeline.eras.standard.title')}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {t('about:timeline.eras.standard.description')}
                </p>
              </motion.div>
            </div>

            {/* Key Message */}
            <div className="mt-12 card-gradient-border rounded-card bg-accent-system/5 border border-accent-system/20 p-8 text-center transition-all duration-500 hover:bg-accent-system/10">
              <p className="text-xl font-semibold text-text-primary mb-2">
                {t('about:timeline.key_message.title')}
              </p>
              <p className="text-text-secondary">{t('about:timeline.key_message.description')}</p>
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
        <section className="py-16 px-12">
          <div className="max-w-7xl mx-auto text-center">
            <div className="card-gradient-border rounded-card bg-white/[0.02] border border-border-primary p-12 transition-all duration-500 hover:bg-white/[0.03] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
                {t('about:cta.title')}
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                {t('about:cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton calendly arrow size="lg">
                  {t('about:cta.demo_button')}
                </CTAButton>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-bg-elevated border border-border-primary text-text-primary font-semibold rounded-btn hover:bg-bg-surface transition-all"
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
