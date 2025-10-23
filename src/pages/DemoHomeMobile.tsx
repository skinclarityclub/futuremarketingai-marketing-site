/**
 * DemoHomeMobile Component
 * 
 * Simplified /demo-home page optimized for mobile devices:
 * - Clean vertical layout
 * - Brief platform overview
 * - MobileFeatureCarousel for module showcase
 * - Prominent "Explore Features" CTA
 * - Large touch targets (≥56px)
 * - Minimal animations
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/button'
import { MobileFeatureCarousel, StickyBottomCTA } from '../components/mobile'
import { usePageAnalytics } from '../hooks'

export const DemoHomeMobile: React.FC = () => {
  const { t } = useTranslation(['hero', 'common', 'features'])
  const navigate = useNavigate()

  // Track page analytics
  usePageAnalytics('DemoHomeMobile')

  const handleExploreFeatures = () => {
    // Analytics event
    if (window.gtag) {
      window.gtag('event', 'explore_features_click', {
        event_category: 'demo_home_mobile',
        event_label: 'Explore Features CTA',
      })
    }
    navigate('/demo')
  }

  const handleBookDemo = () => {
    // Analytics event
    if (window.gtag) {
      window.gtag('event', 'book_demo_click', {
        event_category: 'demo_home_mobile',
        event_label: 'Book Demo CTA',
      })
    }
    navigate('/contact')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white pb-[120px]">
      {/* Hero Section */}
      <section className="px-4 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-blue-500/10 border border-blue-400/20 rounded-full">
            <Sparkles className="h-4 w-4 text-blue-400" aria-hidden="true" />
            <span className="text-sm font-medium text-blue-400">
              {t('hero:hero.badge', 'AI-Powered Marketing Platform')}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
            {t('hero:hero.title', 'Transform Your Marketing')}
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-slate-300 mb-8 max-w-md mx-auto">
            {t('hero:hero.subtitle', 'AI-driven automation that works 24/7 to accelerate your growth. Experience enterprise-grade intelligent marketing.')}
          </p>

          {/* Primary CTA */}
          <Button
            size="lg"
            onClick={handleExploreFeatures}
            className="w-full max-w-xs mx-auto h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20 touch-manipulation"
          >
            {t('common:cta.explore_features', 'Explore Features')}
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Button>
        </motion.div>
      </section>

      {/* Platform Overview */}
      <section className="px-4 py-12 bg-slate-900/50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-lg mx-auto"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t('features:hero.title', 'The Complete AI Marketing System')}
          </h2>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">6</div>
              <div className="text-xs text-slate-400">AI Modules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">24/7</div>
              <div className="text-xs text-slate-400">Automation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">3x</div>
              <div className="text-xs text-slate-400">ROI Growth</div>
            </div>
          </div>

          {/* Value Proposition */}
          <p className="text-center text-slate-300 mb-8">
            {t('features:hero.description', '6 autonomous AI modules working together to save you €26,000/month in tools and generate €60,000/month in additional revenue.')}
          </p>
        </motion.div>
      </section>

      {/* Feature Carousel */}
      <section className="py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="px-4 mb-6">
            <h2 className="text-xl font-bold text-center mb-2">
              {t('features:section_title', 'Key Features')}
            </h2>
            <p className="text-sm text-slate-400 text-center">
              {t('features:section_subtitle', 'Swipe to explore')}
            </p>
          </div>
          <MobileFeatureCarousel />
        </motion.div>
      </section>

      {/* Bottom CTA Section */}
      <section className="px-4 py-12 bg-gradient-to-b from-slate-900/50 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="max-w-lg mx-auto text-center"
        >
          <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl font-bold mb-4">
            {t('features:cta.title', 'See All Modules in Action')}
          </h2>
          <p className="text-slate-300 mb-8">
            {t('features:cta.description', 'Try our interactive demo to experience how all 6 AI modules work together to transform your marketing.')}
          </p>
          
          {/* Secondary CTA - Book Demo */}
          <Button
            size="lg"
            variant="outline"
            onClick={handleBookDemo}
            className="w-full max-w-xs mx-auto h-14 text-lg font-semibold border-2 border-blue-500/50 hover:border-blue-400 hover:bg-blue-500/10 touch-manipulation"
          >
            {t('common:cta.book_appointment', 'Book Appointment')}
          </Button>
        </motion.div>
      </section>

      {/* Sticky Bottom CTA */}
      <StickyBottomCTA
        onPrimaryClick={handleExploreFeatures}
        onSecondaryClick={handleBookDemo}
        showAfterScroll={300}
      />
    </div>
  )
}

export default DemoHomeMobile

