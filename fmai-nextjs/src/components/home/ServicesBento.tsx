import { getTranslations } from 'next-intl/server'
import {
  Megaphone,
  UserCheck,
  Inbox,
  BarChart3,
  Search,
  FileText,
  Target,
  MessageSquare,
  Mic,
  Video,
  ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ClydeFeaturedTile } from './ClydeFeaturedTile'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { FOUNDING_SPOTS_TAKEN, FOUNDING_SPOTS_TOTAL } from '@/lib/constants'
import { CTAButton } from '@/components/ui/CTAButton'

type ServiceKey =
  | 'socialMedia'
  | 'leadQualifier'
  | 'emailManagement'
  | 'reporting'
  | 'seoGeo'
  | 'research'
  | 'blogFactory'
  | 'adCreator'
  | 'manychat'
  | 'voiceAgent'
  | 'reelBuilder'

type SkillStatus = 'live' | 'coming_soon'

type ServiceCard = {
  key: ServiceKey
  href: string
  Icon: LucideIcon
  status: SkillStatus
}

const SECONDARY_SERVICES: readonly ServiceCard[] = [
  { key: 'socialMedia',     href: '/skills/social-media',     Icon: Megaphone,       status: 'live'         },
  { key: 'blogFactory',     href: '/skills/blog-factory',     Icon: FileText,        status: 'live'         },
  { key: 'leadQualifier',   href: '/skills/lead-qualifier',   Icon: UserCheck,       status: 'live'         },
  { key: 'emailManagement', href: '/skills/email-management', Icon: Inbox,           status: 'live'         },
  { key: 'manychat',        href: '/skills/manychat',         Icon: MessageSquare,   status: 'live'         },
  { key: 'reporting',       href: '/skills/reporting',        Icon: BarChart3,       status: 'live'         },
  { key: 'seoGeo',          href: '/skills/seo-geo',          Icon: Search,          status: 'live'         },
  { key: 'research',        href: '/skills/research',         Icon: Target,          status: 'live'         },
  { key: 'voiceAgent',      href: '/skills/voice-agent',      Icon: Mic,             status: 'coming_soon'  },
  { key: 'adCreator',       href: '/skills/ad-creator',       Icon: Megaphone,       status: 'coming_soon'  },
  { key: 'reelBuilder',     href: '/skills/reel-builder',     Icon: Video,           status: 'coming_soon'  },
] as const

export async function ServicesBento({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home' })
  const tServices = await getTranslations({ locale, namespace: 'home.services' })
  const tClyde = await getTranslations({ locale, namespace: 'home.services.clyde' })

  const clydePairs = [
    { user: tClyde('prompt1'), clyde: tClyde('response1') },
    { user: tClyde('prompt2'), clyde: tClyde('response2') },
    { user: tClyde('prompt3'), clyde: tClyde('response3') },
  ] as const

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative z-10 px-6 lg:px-12 py-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            id="services-heading"
            className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4"
          >
            {tServices('title')}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {tServices('subtitle')}
          </p>
        </div>

        {/*
          Bento grid: Clyde featured tile col-span-2 row-span-2 (top-left),
          11 secundaire services. 4 koloms desktop, 2 tablet, 1 mobile.
          Auto-rows-fr keeps tile heights aligned in the bento flow.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-4 lg:gap-5">
          <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[260px]">
            <ClydeFeaturedTile
              title={tClyde('title')}
              description={tClyde('description')}
              statusLabel={tClyde('statusLabel')}
              promptIntro={tClyde('promptIntro')}
              pairs={clydePairs}
              userLabel={tClyde('userLabel')}
              clydeLabel={tClyde('clydeLabel')}
              openLink={tClyde('openLink')}
            />
          </div>

          {SECONDARY_SERVICES.map(({ key, href, Icon, status }) => (
            <SpotlightCard
              key={key}
              href={href}
              className="spotlight-card group relative rounded-[var(--radius-card)] border border-border-primary bg-white/[0.02] p-5 lg:p-6 flex flex-col transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
            >
              <header className="flex items-start justify-between gap-3 mb-4">
                <Icon className="w-5 h-5 text-accent-system shrink-0" aria-hidden />
                <StatusBadge
                  status={status}
                  liveLabel={tServices('statusLive')}
                  soonLabel={tServices('statusComingSoon')}
                />
              </header>

              <h3 className="font-display text-base lg:text-lg font-bold text-text-primary mb-1.5 leading-tight">
                {tServices(`${key}.title`)}
              </h3>
              <p className="text-xs lg:text-sm text-text-secondary leading-relaxed flex-1">
                {tServices(`${key}.description`)}
              </p>

              <span
                aria-hidden
                className="mt-3 inline-flex items-center text-text-muted group-hover:text-accent-system transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </SpotlightCard>
          ))}
        </div>

        {/* Final CTA below grid */}
        <div className="text-center mt-12">
          <p className="text-text-secondary mb-6">
            {t('cta.subtitle', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton size="lg" href="/skills/clyde">
              {t('hero.ctaSecondary')}
              <ArrowRight className="ml-1 h-4 w-4" />
            </CTAButton>
            <CTAButton variant="secondary" size="lg" href="/founding-member">
              {t('cta.foundingLabel')}
              <ArrowRight className="ml-1 h-4 w-4" />
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatusBadge({
  status,
  liveLabel,
  soonLabel,
}: {
  status: SkillStatus
  liveLabel: string
  soonLabel: string
}) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-status-active/10 border border-status-active/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.14em] text-status-active">
        <span aria-hidden className="inline-block w-1 h-1 rounded-full bg-status-active" />
        {liveLabel}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent-human/10 border border-accent-human/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.14em] text-accent-human">
      <span aria-hidden className="inline-block w-1 h-1 rounded-full bg-accent-human" />
      {soonLabel}
    </span>
  )
}
