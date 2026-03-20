'use client'

import { MotionDiv } from '@/components/motion/MotionDiv'
import { Megaphone, Settings, Bot } from 'lucide-react'

const ERAS = [
  {
    icon: Megaphone,
    period: '2000-2015',
    titleKey: 'Manual Marketing',
    descriptionKey:
      'Teams of 5-10 people creating content, managing campaigns, and analyzing results by hand.',
    active: false,
  },
  {
    icon: Settings,
    period: '2015-2023',
    titleKey: 'Basic Automation',
    descriptionKey:
      'Email sequences, scheduled posts, and rule-based workflows. Still needs constant human oversight.',
    active: false,
  },
  {
    icon: Bot,
    period: '2024+',
    titleKey: 'AI Marketing Employee',
    descriptionKey:
      'Autonomous agents that research, create, publish, and optimize — working 24/7 without supervision.',
    active: true,
  },
] as const

export function VisionTimeline() {
  return (
    <section aria-labelledby="vision-timeline" className="py-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-16 left-0 right-0 h-0.5 bg-border-primary">
              <MotionDiv
                className="h-full bg-gradient-to-r from-text-muted via-accent-system to-accent-system"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                viewport={{ once: true }}
                style={{ transformOrigin: 'left' }}
              />
            </div>

            <div className="grid grid-cols-3 gap-8 relative z-10">
              {ERAS.map((era, index) => {
                const Icon = era.icon
                return (
                  <MotionDiv
                    key={era.period}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Icon circle */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                        era.active
                          ? 'bg-accent-system/20 border-2 border-accent-system shadow-[0_0_20px_rgba(0,212,255,0.3)]'
                          : 'bg-bg-elevated border border-border-primary'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${era.active ? 'text-accent-system' : 'text-text-muted'}`}
                      />
                    </div>

                    {/* Period label */}
                    <span
                      className={`text-xs font-mono mb-3 ${
                        era.active ? 'text-accent-system font-semibold' : 'text-text-muted'
                      }`}
                    >
                      {era.period}
                    </span>

                    {/* Title */}
                    <h3
                      className={`text-lg font-bold font-display mb-2 ${
                        era.active ? 'text-accent-system' : 'text-text-primary'
                      }`}
                    >
                      {era.titleKey}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                      {era.descriptionKey}
                    </p>
                  </MotionDiv>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile: vertical stacked */}
        <div className="md:hidden space-y-8">
          {ERAS.map((era, index) => {
            const Icon = era.icon
            return (
              <MotionDiv
                key={era.period}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                viewport={{ once: true }}
                className={`flex gap-4 items-start p-4 rounded-xl border ${
                  era.active
                    ? 'border-accent-system/40 bg-accent-system/5'
                    : 'border-border-primary bg-white/[0.02]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    era.active
                      ? 'bg-accent-system/20 border border-accent-system'
                      : 'bg-bg-elevated border border-border-primary'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${era.active ? 'text-accent-system' : 'text-text-muted'}`}
                  />
                </div>
                <div>
                  <span
                    className={`text-xs font-mono ${era.active ? 'text-accent-system' : 'text-text-muted'}`}
                  >
                    {era.period}
                  </span>
                  <h3
                    className={`text-base font-bold font-display ${
                      era.active ? 'text-accent-system' : 'text-text-primary'
                    }`}
                  >
                    {era.titleKey}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">{era.descriptionKey}</p>
                </div>
              </MotionDiv>
            )
          })}
        </div>
      </div>
    </section>
  )
}
