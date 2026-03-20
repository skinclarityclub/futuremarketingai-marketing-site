'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Brain, Globe, ShoppingBag, MessageCircle, type LucideIcon } from 'lucide-react'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

const PLATFORMS: readonly { id: string; icon: LucideIcon }[] = [
  { id: 'website', icon: Globe },
  { id: 'shopify', icon: ShoppingBag },
  { id: 'whatsapp', icon: MessageCircle },
] as const

/**
 * MultiPlatformShowcase -- Animated architecture diagram showing Claude AI
 * connecting to Website, Shopify, and WhatsApp with CSS-only animations.
 * Includes case study proof section below the diagram.
 */
export function MultiPlatformShowcase() {
  const t = useTranslations('chatbots')

  return (
    <ScrollReveal>
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            {t('multi_platform.title')}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t('multi_platform.subtitle')}
          </p>
        </div>

        {/* Architecture diagram */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 mb-16">
          {/* Central brain node */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div
              className="w-28 h-28 rounded-full bg-accent-system/10 border-2 border-accent-system/40 flex items-center justify-center"
              style={{
                animation: 'brainPulse 3s ease-in-out infinite',
              }}
            >
              <Brain className="w-12 h-12 text-accent-system" />
            </div>
            <span className="mt-3 text-sm font-mono font-medium text-accent-system">
              {t('multi_platform.brain_label')}
            </span>
          </div>

          {/* Connection lines -- horizontal on desktop */}
          <div className="hidden lg:flex flex-col gap-8 items-center">
            {PLATFORMS.map((_, index) => (
              <div key={index} className="relative w-32 h-0.5 overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-accent-system/50 to-accent-system"
                  style={{
                    animation: `expandLine 1.5s ease-out ${0.3 * index}s both`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Connection line -- vertical on mobile */}
          <div className="lg:hidden w-0.5 h-12 bg-accent-system/30" />

          {/* Platform nodes */}
          <div className="flex flex-col gap-4">
            {PLATFORMS.map((platform, index) => {
              const Icon = platform.icon
              return (
                <ScrollReveal key={platform.id} delay={0.2 * index} direction="right">
                  <div className="bg-white/[0.02] border border-border-primary rounded-xl p-4 flex items-start gap-4 min-w-[280px]">
                    <div className="w-10 h-10 rounded-lg bg-accent-system/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent-system" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary text-sm">
                        {t(`multi_platform.platforms.${platform.id}.name`)}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        {t(`multi_platform.platforms.${platform.id}.behavior`)}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>

        {/* Case study proof section */}
        <div className="bg-white/[0.02] border border-border-primary rounded-xl p-6 lg:p-8 max-w-3xl mx-auto">
          <p className="text-text-secondary text-sm lg:text-base text-center mb-6">
            {t('multi_platform.case_study')}
          </p>
          <div className="flex justify-center gap-8 lg:gap-12">
            {(['inquiries', 'availability', 'platforms'] as const).map((key) => (
              <div key={key} className="text-center">
                <p className="font-mono text-lg lg:text-xl font-bold text-accent-system">
                  {t(`multi_platform.stats.${key}.value`)}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {t(`multi_platform.stats.${key}.label`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CSS keyframes for brain pulse and line expand animations */}
        <style>{`
          @keyframes brainPulse {
            0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
            50% { box-shadow: 0 0 40px rgba(0, 212, 255, 0.6); }
          }
          @keyframes expandLine {
            from { width: 0; }
            to { width: 100%; }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes brainPulse {
              0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
            }
            @keyframes expandLine {
              from { width: 100%; }
              to { width: 100%; }
            }
          }
        `}</style>
      </div>
    </ScrollReveal>
  )
}

export default MultiPlatformShowcase
