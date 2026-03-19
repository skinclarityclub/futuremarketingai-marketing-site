'use client'

import { useTranslations } from 'next-intl'
import { CheckCircle } from 'lucide-react'
import type { DemoPersonaId } from './PersonaSelector'

interface DemoContextCardProps {
  personaId: DemoPersonaId
}

export function DemoContextCard({ personaId }: DemoContextCardProps) {
  const t = useTranslations('chatbots')

  // next-intl does not support returnObjects; use indexed keys (4 capabilities per persona)
  const capabilities: string[] = []
  for (let i = 0; i < 4; i++) {
    capabilities.push(t(`demo.tabs.${personaId}.capabilities_${i}`))
  }

  return (
    <div className="w-full lg:w-[30%] flex-shrink-0 bg-white/[0.02] border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-2">
        {t(`demo.tabs.${personaId}.scenario_title`)}
      </h3>
      <p className="text-sm text-white/70 mb-6 leading-relaxed">
        {t(`demo.tabs.${personaId}.scenario`)}
      </p>

      <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
        {t('demo.capabilities_label')}
      </h4>
      <ul className="space-y-2">
        {capabilities.map((cap) => (
          <li key={cap} className="flex items-start gap-2 text-sm text-white/70">
            <CheckCircle className="w-4 h-4 text-[#00D4FF] mt-0.5 flex-shrink-0" />
            <span>{cap}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
