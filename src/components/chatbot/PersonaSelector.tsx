import { useTranslation } from 'react-i18next'
import { ShoppingCart, Target, LifeBuoy, type LucideIcon } from 'lucide-react'

export const DEMO_PERSONAS = ['ecommerce', 'leadgen', 'support'] as const
export type DemoPersonaId = (typeof DEMO_PERSONAS)[number]

const TAB_ICONS: Record<DemoPersonaId, LucideIcon> = {
  ecommerce: ShoppingCart,
  leadgen: Target,
  support: LifeBuoy,
}

interface PersonaSelectorProps {
  active: DemoPersonaId
  onChange: (id: DemoPersonaId) => void
}

export function PersonaSelector({ active, onChange }: PersonaSelectorProps) {
  const { t } = useTranslation('chatbots')

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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-card border text-sm font-medium transition-colors cursor-pointer ${
              isActive
                ? 'border-accent-system/50 bg-accent-system/10 text-text-primary'
                : 'border-border-primary bg-white/[0.02] text-text-muted hover:border-border-secondary'
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
