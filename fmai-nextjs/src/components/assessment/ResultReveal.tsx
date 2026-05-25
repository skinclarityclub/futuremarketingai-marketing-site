'use client'

import { useState, type ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import {
  ArrowRight,
  BarChart3,
  Bot,
  BookOpen,
  Check,
  Clapperboard,
  Globe,
  Linkedin,
  Link as LinkIcon,
  Mail,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Phone,
  Search,
  Share2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import type {
  Archetype,
  AssessmentCategory,
  AssessmentResult,
} from '@/lib/assessment/types'
import type { SkillData } from '@/lib/skills-data'
import { ARCHETYPE_GRADIENT, ARCHETYPE_CODE, STAGE_CODE } from '@/lib/assessment/persona-presentation'
import { CountUp } from '@/components/motion/CountUp'

interface ResultRevealProps {
  result: AssessmentResult
  recommendedSkills: SkillData[]
  /** Email-capture form rendered at the end of the reveal. */
  emailGate: ReactNode
}

const SKILL_ICONS: Record<string, LucideIcon> = {
  'social-media': Share2,
  'blog-factory': BookOpen,
  'ad-creator': Megaphone,
  'reel-builder': Clapperboard,
  'voice-agent': Phone,
  'lead-qualifier': MessageSquare,
  'email-management': Mail,
  manychat: MessageCircle,
  reporting: BarChart3,
  'seo-geo': Globe,
  research: Search,
  clyde: Bot,
}

const CATEGORY_ORDER: readonly AssessmentCategory[] = [
  'strategy',
  'data',
  'tools',
  'team',
] as const

export function ResultReveal({ result, recommendedSkills, emailGate }: ResultRevealProps) {
  const t = useTranslations('assessment.result')
  const tShare = useTranslations('assessment.result.share')
  const tCats = useTranslations('assessment.categories')
  const locale = useLocale()
  const { archetype, stage, perCategory, lowestCategory, total } = result
  const [copied, setCopied] = useState(false)

  const shareParams = new URLSearchParams({
    a: ARCHETYPE_CODE[archetype],
    st: STAGE_CODE[stage],
    t: String(total),
    s: String(perCategory.strategy),
    d: String(perCategory.data),
    tl: String(perCategory.tools),
    tm: String(perCategory.team),
  })
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/${locale}/assessment/result?${shareParams.toString()}`
      : `/assessment/result?${shareParams.toString()}`
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`

  async function handleCopy() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — silent */
    }
  }

  function handleLinkedInClick() {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'assessment_share_click', { network: 'linkedin', archetype, stage })
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Archetype reveal */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-system/30 bg-accent-system/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-system">
            <Sparkles className="h-3.5 w-3.5" />
            {t('eyebrow')}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-2 text-lg text-text-secondary"
        >
          {t('preTitle')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 160, damping: 22 }}
          className="mb-3 font-display text-6xl font-black leading-none tracking-tight sm:text-7xl md:text-8xl"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: ARCHETYPE_GRADIENT[archetype] }}
          >
            {t(`archetypes.${archetype}.name`)}
          </span>
        </motion.h1>

        {/* Stage badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="mb-5 flex items-center justify-center gap-2"
        >
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {t('stagePrefix')} {t(`stages.${stage}.label`)}
          </span>
        </motion.div>

        {/* Validation hook — italic, resonates before the summary */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mx-auto mb-4 max-w-xl text-base italic leading-relaxed text-text-secondary"
        >
          {t(`archetypes.${archetype}.validationHook`)}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mx-auto mb-12 max-w-xl text-lg leading-relaxed text-text-primary"
        >
          {t(`archetypes.${archetype}.summary`)}
        </motion.p>
      </div>

      {/* Score bars per category — lowest is amber, others teal */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mb-10 rounded-2xl border border-border-primary bg-white/[0.02] p-6 md:p-8"
        aria-labelledby="scores-heading"
      >
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 id="scores-heading" className="text-base font-semibold text-text-primary md:text-lg">
            {t('scoresHeading')}
          </h2>
          <span className="text-xs font-medium uppercase tracking-wider text-text-muted tabular-nums">
            <CountUp to={total} duration={1.0} />/100
          </span>
        </div>
        <div className="space-y-3.5">
          {CATEGORY_ORDER.map((cat, i) => {
            const score = perCategory[cat]
            const isLowest = cat === lowestCategory
            return (
              <div key={cat}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span
                    className={`font-medium ${isLowest ? 'text-accent-human' : 'text-text-primary'}`}
                  >
                    {tCats(cat)}
                    {isLowest && (
                      <span className="ml-2 inline-flex items-center rounded-full border border-accent-human/30 bg-accent-human/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-human">
                        {t('lowestHint')}
                      </span>
                    )}
                  </span>
                  <span
                    className={`text-xs font-semibold tabular-nums ${isLowest ? 'text-accent-human' : 'text-text-secondary'}`}
                  >
                    <CountUp to={score} duration={0.9} />/100
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ delay: 0.8 + i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full ${
                      isLowest ? 'bg-accent-human' : 'bg-accent-system'
                    }`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </motion.section>

      {/* Week 1 of the roadmap — concrete first step */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.5 }}
        className="mb-10 rounded-2xl border border-accent-system/30 bg-gradient-to-br from-white/[0.02] to-accent-system/[0.04] p-6 md:p-8"
        aria-labelledby="week1-heading"
      >
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-system">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-system" />
          Week 1
        </div>
        <h2 id="week1-heading" className="mb-3 text-lg font-semibold text-text-primary md:text-xl">
          {t('week1Heading')}
        </h2>
        <p className="text-sm leading-relaxed text-text-secondary md:text-base">
          {t(`archetypes.${archetype}.week1`)}
        </p>
      </motion.section>

      {/* Three skill icons — names only, descriptions teased to email */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.5 }}
        className="mb-10"
        aria-labelledby="skills-heading"
      >
        <div className="mb-4 flex flex-col gap-1 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <h2 id="skills-heading" className="text-base font-semibold text-text-primary md:text-lg">
            {t('skillsHeading')}
          </h2>
          <span className="text-xs text-text-muted">{t('skillsHint')}</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {recommendedSkills.map((skill) => {
            const Icon = SKILL_ICONS[skill.slug] ?? Sparkles
            return (
              <div
                key={skill.slug}
                className="flex items-center gap-3 rounded-xl border border-border-primary bg-white/[0.02] px-4 py-3"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-elevated text-accent-system">
                  <Icon className="h-4.5 w-4.5" aria-hidden />
                </span>
                <span className="text-sm font-medium text-text-primary">{skill.name}</span>
              </div>
            )
          })}
        </div>
      </motion.section>

      {/* Share row — LinkedIn + copy-link */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.5 }}
        className="mb-10 rounded-2xl border border-border-primary bg-white/[0.02] p-5 md:p-6"
        aria-labelledby="share-heading"
      >
        <div className="mb-3 flex items-center gap-2">
          <Share2 className="h-4 w-4 text-accent-system" />
          <h2 id="share-heading" className="text-sm font-semibold text-text-primary">
            {tShare('heading')}
          </h2>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-text-secondary">{tShare('subline')}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={linkedInUrl}
            onClick={handleLinkedInClick}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0a66c2] px-4 py-2.5 text-sm font-semibold text-white transition-[filter] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a66c2]"
          >
            <Linkedin className="h-4 w-4" />
            {tShare('linkedin')}
          </a>
          <button
            type="button"
            onClick={handleCopy}
            aria-live="polite"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border-primary bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
          >
            {copied ? <Check className="h-4 w-4 text-accent-system" /> : <LinkIcon className="h-4 w-4" />}
            {copied ? tShare('copied') : tShare('copy')}
          </button>
        </div>
      </motion.section>

      {/* Email gate */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.25, duration: 0.5 }}
      >
        <p className="mb-3 text-center text-xs text-text-muted">
          <ArrowRight className="inline h-3 w-3 -translate-y-px" /> {t('footerHint')}
        </p>
        {emailGate}
      </motion.div>
    </div>
  )
}
