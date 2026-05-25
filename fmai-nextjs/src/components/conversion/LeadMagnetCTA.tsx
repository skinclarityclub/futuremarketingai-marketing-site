'use client'

import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight, Sparkles, Check } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from '@/i18n/navigation'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

type Variant = 'inline' | 'sidebar'

export interface LeadMagnetCTAProps {
  source: string
  variant?: Variant
}

const PREVIEW_BARS = [
  { label: 'Strategie', value: 82 },
  { label: 'Data', value: 64 },
  { label: 'Tools', value: 49 },
  { label: 'Team', value: 71 },
] as const

const PREVIEW_SKILLS = ['Blog Factory', 'Reporting', 'Research'] as const

// Score ring geometry
const RING_R = 34
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R
const SCORE = 74
const SCORE_OFFSET = RING_CIRCUMFERENCE * (1 - SCORE / 100)

function ScoreRing() {
  return (
    <div className="relative shrink-0">
      <svg width="84" height="84" viewBox="0 0 84 84" className="-rotate-90">
        {/* Track */}
        <circle
          cx="42"
          cy="42"
          r={RING_R}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="5"
        />
        {/* Animated score arc */}
        <motion.circle
          cx="42"
          cy="42"
          r={RING_R}
          fill="none"
          stroke="#00d4aa"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
          animate={{ strokeDashoffset: SCORE_OFFSET }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.32, 0.72, 0, 1] }}
        />
      </svg>
      {/* Score number in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-mono text-xl font-bold leading-none tabular-nums text-text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.0 }}
        >
          {SCORE}
        </motion.span>
        <span className="mt-0.5 text-[9px] text-text-muted">/ 100</span>
      </div>
    </div>
  )
}

function ResultPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}
      className="relative flex h-full flex-col gap-5 p-6"
    >
      {/* Ambient glow behind ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-10 h-28 w-28 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.09) 0%, transparent 70%)' }}
      />

      <div className="select-none text-[10px] font-medium uppercase tracking-[0.15em] text-text-muted">
        Voorbeeld resultaat
      </div>

      {/* Score ring + profile info */}
      <div className="flex items-center gap-4">
        <ScoreRing />
        <div className="flex min-w-0 flex-col gap-1">
          <div className="text-sm font-semibold text-accent-system">Strategie-gedreven</div>
          <span className="self-start rounded-full border border-[#f5a623]/25 bg-[#f5a623]/10 px-2 py-0.5 text-[10px] font-medium text-[#f5a623]">
            Groeiend
          </span>
          <span className="text-[10px] text-[#f5a623]/60">Bovengemiddeld</span>
        </div>
      </div>

      {/* Category breakdown bars */}
      <div className="flex flex-col gap-2.5">
        {PREVIEW_BARS.map(({ label, value }, i) => (
          <div key={label}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] text-text-secondary">{label}</span>
              <span className="tabular-nums text-[11px] font-medium text-text-secondary">{value}%</span>
            </div>
            <div className="h-[5px] overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{
                  duration: 0.8,
                  delay: 0.6 + i * 0.1,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="h-full rounded-full bg-accent-system"
                style={{ opacity: 0.6 + (value / 100) * 0.4 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recommended skills */}
      <div className="mt-auto flex flex-wrap gap-1.5">
        {PREVIEW_SKILLS.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-accent-system/20 bg-accent-system/[0.08] px-2.5 py-0.5 text-[10px] font-medium text-accent-system/80"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export function LeadMagnetCTA({ source, variant = 'inline' }: LeadMagnetCTAProps) {
  const t = useTranslations('leadMagnet')
  const locale = useLocale()

  function handleClick() {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'assessment_cta_click', { source, locale })
    }
  }

  const ctaHref = `/assessment?from=${encodeURIComponent(source)}`

  if (variant === 'sidebar') {
    return (
      <aside className="relative rounded-xl border border-border-primary bg-white/[0.02] p-5">
        <div aria-hidden="true" className="absolute right-3 top-3 hidden gap-1.5 sm:flex">
          <span className="rounded-full border border-accent-system/30 bg-accent-system/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-system">
            {t('badges.free')}
          </span>
          <span className="rounded-full border border-border-primary bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            {t('badges.fast')}
          </span>
        </div>
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent-system">
          <Sparkles className="h-4 w-4" />
          <span>{t('eyebrow')}</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-text-primary">{t('title')}</h3>
        <p className="mb-4 text-sm leading-relaxed text-text-secondary">{t('subtitle')}</p>
        <ul className="mb-5 list-disc space-y-1 pl-5 text-sm text-text-secondary">
          <li>{t('bullet1')}</li>
          <li>{t('bullet2')}</li>
          <li>{t('bullet3')}</li>
        </ul>
        <Link
          href={ctaHref}
          onClick={handleClick}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-system px-5 py-3 text-sm font-semibold text-bg-deep transition-[filter] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
        >
          {t('cta')}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-3 text-xs text-text-muted">{t('duration')}</p>
      </aside>
    )
  }

  const bullets = [t('bullet1'), t('bullet2'), t('bullet3')]

  // Inline variant — double-bezel with ambient teal glow
  return (
    <div className="rounded-2xl bg-gradient-to-br from-accent-system/25 via-white/[0.04] to-transparent p-px shadow-[0_0_60px_rgba(0,212,170,0.07)]">
      <aside className="overflow-hidden rounded-[15px] bg-gradient-to-br from-[#111520] to-[#0a0d14] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="flex flex-col md:flex-row">
          {/* Left column — copy + CTA */}
          <div className="flex flex-col p-6 md:w-[55%] md:p-10">

            {/* Eyebrow pill */}
            <div className="mb-5 inline-flex items-center gap-1.5 self-start rounded-full border border-accent-system/25 bg-accent-system/[0.08] px-3 py-1">
              <Sparkles className="h-3 w-3 text-accent-system" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-system">
                {t('eyebrow')}
              </span>
            </div>

            <h3 className="mb-3 text-2xl font-bold leading-tight text-text-primary md:text-3xl">
              {t('title')}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-text-secondary">{t('subtitle')}</p>

            {/* Bullets with check icons */}
            <ul className="mb-7 space-y-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm text-text-secondary">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-system/15">
                    <Check className="h-2.5 w-2.5 text-accent-system" />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>

            {/* Mobile-only preview */}
            <div className="mb-7 rounded-xl border border-white/[0.06] bg-white/[0.02] md:hidden">
              <ResultPreview />
            </div>

            {/* CTA with teal glow */}
            <Link
              href={ctaHref}
              onClick={handleClick}
              className="group inline-flex items-center gap-2.5 self-start rounded-full bg-accent-system px-6 py-3 text-sm font-bold text-bg-deep shadow-[0_0_24px_rgba(0,212,170,0.30)] transition-all duration-700 hover:shadow-[0_0_40px_rgba(0,212,170,0.50)] hover:brightness-105 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
              style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
            >
              {t('cta')}
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-bg-deep/20 transition-transform duration-500 group-hover:translate-x-0.5"
                style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
              >
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>

            {/* Proposition line — below CTA */}
            <div aria-hidden="true" className="mt-3 flex items-center gap-1.5">
              <span className="text-[11px] text-text-muted">{t('badges.free')}</span>
              <span className="select-none text-text-muted/30">·</span>
              <span className="text-[11px] text-text-muted">{t('badges.fast')}</span>
              <span className="select-none text-text-muted/30">·</span>
              <span className="text-[11px] text-text-muted">{t('badges.noAccount')}</span>
            </div>
          </div>

          {/* Desktop-only right column — result preview */}
          <div className="hidden flex-col border-l border-white/[0.05] bg-white/[0.015] md:flex md:w-[45%]">
            <ResultPreview />
          </div>
        </div>
      </aside>
    </div>
  )
}

export default LeadMagnetCTA
