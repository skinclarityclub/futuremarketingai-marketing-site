'use client'

import { useTranslations } from 'next-intl'
import { UserPlus, PenTool, Calculator, MessageCircle, type LucideIcon } from 'lucide-react'

export const DEMO_PERSONAS = ['ecommerce', 'leadgen', 'support', 'concierge'] as const
export type DemoPersonaId = (typeof DEMO_PERSONAS)[number]

const TAB_ICONS: Record<DemoPersonaId, LucideIcon> = {
  ecommerce: UserPlus,
  leadgen: PenTool,
  support: Calculator,
  concierge: MessageCircle,
}

interface PersonaSelectorProps {
  active: DemoPersonaId
  onChange: (id: DemoPersonaId) => void
}

export function PersonaSelector({ active, onChange }: PersonaSelectorProps) {
  const t = useTranslations('chatbots')

  return (
    <div role="tablist" className="flex flex-wrap gap-2 mb-6">
      {DEMO_PERSONAS.map((id) => {
        const Icon = TAB_ICONS[id]
        const isActive = active === id

        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
              isActive
                ? 'border-accent-system/50 bg-accent-system/10 text-white'
                : 'border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20'
            }`}
          >
            <Icon className="w-4 h-4" />
            {t(`demo.tabs.${id}.label`)}
          </button>
        )
      })}
    </div>
  )
}
