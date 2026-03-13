import { useTranslation } from 'react-i18next'
import { CheckCircle } from 'lucide-react'
import type { DemoPersonaId } from './PersonaSelector'

interface DemoContextCardProps {
  personaId: DemoPersonaId
}

export function DemoContextCard({ personaId }: DemoContextCardProps) {
  const { t } = useTranslation('chatbots')

  const capabilities = t(`demo.tabs.${personaId}.capabilities`, {
    returnObjects: true,
  }) as string[]

  return (
    <div className="w-full lg:w-[30%] flex-shrink-0 card-gradient-border bg-white/[0.02] border border-border-primary rounded-card p-6">
      <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
        {t(`demo.tabs.${personaId}.scenario_title`)}
      </h3>
      <p className="text-sm text-text-secondary mb-6 leading-relaxed">
        {t(`demo.tabs.${personaId}.scenario`)}
      </p>

      <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
        {t('demo.capabilities_label')}
      </h4>
      <ul className="space-y-2">
        {capabilities.map((cap) => (
          <li key={cap} className="flex items-start gap-2 text-sm text-text-secondary">
            <CheckCircle className="w-4 h-4 text-accent-system mt-0.5 flex-shrink-0" />
            <span>{cap}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
