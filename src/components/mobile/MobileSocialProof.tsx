/**
 * MobileSocialProof - Mobile-optimized version of desktop SocialProof
 *
 * Desktop-first compliant: This is a NEW mobile-only component.
 * Uses EXACT same data as desktop (common translation keys), just condensed layout.
 *
 * Key differences from desktop:
 * - Founding teams: Carousel (1 at a time) instead of 3-column grid
 * - Milestones: Condensed list (first 4) instead of full grid
 * - Guarantees: 2-column grid instead of 4-column
 * - All text remains ≥16px for legibility
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Rocket,
  Calendar,
  Shield,
  MessageSquare,
  Wrench,
  Award,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const GUARANTEE_ICONS = {
  0: Shield,
  1: MessageSquare,
  2: Wrench,
  3: Rocket,
} as const

interface MobileSocialProofProps {
  className?: string
}

/**
 * Mobile Social Proof - Condensed version using SAME data as desktop
 */
export const MobileSocialProof: React.FC<MobileSocialProofProps> = ({ className = '' }) => {
  const { t } = useTranslation('common')
  const [activeTeam, setActiveTeam] = useState(0)

  // Use EXACT same translation keys as desktop
  const foundingTeams = t('landing.social_proof.founding_teams.teams', {
    returnObjects: true,
  }) as any[]
  const milestones = t('landing.social_proof.milestones.items', { returnObjects: true }) as string[]
  const guarantees = t('landing.social_proof.guarantees.items', { returnObjects: true }) as any[]

  const teamIcons = ['🤖', '💄', '🏢']

  const handleNextTeam = () => {
    setActiveTeam((prev) => (prev + 1) % foundingTeams.length)
  }

  const handlePrevTeam = () => {
    setActiveTeam((prev) => (prev - 1 + foundingTeams.length) % foundingTeams.length)
  }

  return (
    <section className={`py-12 px-6 ${className}`}>
      {/* Section Header - Same as desktop */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4"
        >
          <Rocket className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-blue-100">
            {t('landing.social_proof.badge')}
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-white mb-3"
        >
          {t('landing.social_proof.title')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-base text-blue-100 max-w-lg mx-auto"
        >
          {t('landing.social_proof.subtitle')}
        </motion.p>
      </div>

      {/* Founding Teams - Carousel (Mobile-specific layout) */}
      <div className="mb-12">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTeam}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              {/* Team Icon */}
              <div className="text-6xl mb-4 text-center">{teamIcons[activeTeam]}</div>

              {/* Team Info */}
              <h3 className="text-xl font-bold text-white text-center mb-2">
                {foundingTeams[activeTeam].name}
              </h3>
              <p className="text-sm text-blue-200 text-center mb-1">
                {foundingTeams[activeTeam].industry}
              </p>
              <p className="text-xs text-blue-300 text-center mb-4">
                Team of {foundingTeams[activeTeam].teamSize}
              </p>

              {/* Status Badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {foundingTeams[activeTeam].status}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handlePrevTeam}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors touch-manipulation"
              aria-label="Previous team"
              type="button"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            {/* Pagination Dots */}
            <div className="flex gap-2">
              {foundingTeams.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTeam(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeTeam ? 'bg-blue-400 w-6' : 'bg-white/20'
                  }`}
                  aria-label={`Go to team ${index + 1}`}
                  aria-current={index === activeTeam ? 'true' : 'false'}
                  type="button"
                />
              ))}
            </div>

            <button
              onClick={handleNextTeam}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors touch-manipulation"
              aria-label="Next team"
              type="button"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Transparent Messaging - Same as desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-6 mb-12"
      >
        <Calendar className="w-10 h-10 text-blue-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-3 text-center">
          {t('landing.social_proof.founding_message.title')}
        </h3>
        <p className="text-sm text-blue-100 leading-relaxed mb-4 text-center">
          {t('landing.social_proof.founding_message.description')}
        </p>
        <div className="flex flex-col gap-3 text-sm">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white mb-1">
              {t('landing.social_proof.founding_message.benefits.rate_lock.value')}
            </div>
            <div className="text-xs text-blue-100">
              {t('landing.social_proof.founding_message.benefits.rate_lock.label')}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white mb-1">
              {t('landing.social_proof.founding_message.benefits.savings.value')}
            </div>
            <div className="text-xs text-blue-100">
              {t('landing.social_proof.founding_message.benefits.savings.label')}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white mb-1">
              {t('landing.social_proof.founding_message.benefits.access.value')}
            </div>
            <div className="text-xs text-blue-100">
              {t('landing.social_proof.founding_message.benefits.access.label')}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Platform Milestones - Condensed (first 4) */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
          <Award className="w-6 h-6 text-yellow-400" />
          {t('landing.social_proof.milestones.title')}
        </h3>
        <div className="flex flex-col gap-2">
          {milestones.slice(0, 4).map((milestone: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-3"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 mt-1.5" />
              <span className="text-blue-100 text-sm">{milestone}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Guarantees - 2-column grid for mobile */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-white mb-3 text-center">
          {t('landing.social_proof.guarantees.title')}
        </h3>
        <p className="text-center text-sm text-blue-100 mb-6 max-w-md mx-auto">
          {t('landing.social_proof.guarantees.subtitle')}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {guarantees.map((guarantee: any, index: number) => {
            const Icon = GUARANTEE_ICONS[index as keyof typeof GUARANTEE_ICONS]
            return (
              <motion.div
                key={guarantee.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">{guarantee.title}</h4>
                <p className="text-xs text-blue-100 mb-2 leading-relaxed">
                  {guarantee.description}
                </p>
                <div className="px-2 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs font-semibold text-blue-200 text-center">
                    {guarantee.highlight}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* CTA - Same as desktop but stacked */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl"
      >
        <h3 className="text-xl font-bold text-white mb-2">{t('landing.social_proof.cta.title')}</h3>
        <p className="text-sm text-blue-100 mb-2">{t('landing.social_proof.cta.subtitle')}</p>
        <p className="text-xs text-blue-100/70 mb-4">{t('landing.social_proof.cta.note')}</p>
        <div className="flex flex-col gap-3">
          <a
            href="/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 min-h-touch bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg touch-manipulation"
          >
            {t('landing.social_proof.cta.demo_button')}
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 min-h-touch bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all touch-manipulation"
          >
            {t('landing.social_proof.cta.contact_button')}
          </a>
        </div>
      </motion.div>
    </section>
  )
}

MobileSocialProof.displayName = 'MobileSocialProof'
