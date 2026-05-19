import { CheckCircle, Users, Shield } from 'lucide-react'
import { Link } from '@/i18n/navigation'

interface TrustClusterHeroProps {
  foundingLabel: string
  avgLabel: string
}

export function TrustClusterHero({ foundingLabel, avgLabel }: TrustClusterHeroProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 lg:mb-10"
      style={{ animation: 'fadeInUp 0.8s ease-out 0.55s both' }}
    >
      {/* Client proof — SKC as named reference customer */}
      <div className="flex items-center gap-1.5">
        <CheckCircle className="w-3.5 h-3.5 text-accent-system shrink-0" aria-hidden />
        <span className="text-xs font-medium text-text-secondary">SkinClarity Club</span>
      </div>

      <span className="w-px h-3 bg-bg-elevated hidden sm:block" aria-hidden />

      {/* Founding scarcity counter */}
      <div className="flex items-center gap-1.5">
        <Users className="w-3.5 h-3.5 text-accent-human shrink-0" aria-hidden />
        <span className="text-xs font-semibold text-accent-human">{foundingLabel}</span>
      </div>

      <span className="w-px h-3 bg-bg-elevated hidden sm:block" aria-hidden />

      {/* AVG/GDPR badge */}
      <Link
        href="/legal"
        className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
      >
        <Shield className="w-3.5 h-3.5 text-status-active shrink-0" aria-hidden />
        <span>{avgLabel}</span>
      </Link>
    </div>
  )
}
