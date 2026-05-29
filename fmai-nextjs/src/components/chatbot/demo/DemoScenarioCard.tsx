'use client'

import { useLocale } from 'next-intl'
import { motion } from 'motion/react'
import { Briefcase, TrendingUp, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Briefcase,
  TrendingUp,
}

const STEPS_LABEL: Record<string, (n: number) => string> = {
  nl: (n) => `${n} stappen`,
  en: (n) => `${n} steps`,
  es: (n) => `${n} pasos`,
}

interface DemoScenarioCardProps {
  id: string
  title: string
  subtitle: string
  icon: string
  stepCount: number
  index: number
  onSelect: (id: string) => void
}

export function DemoScenarioCard({
  id,
  title,
  subtitle,
  icon,
  stepCount,
  index,
  onSelect,
}: DemoScenarioCardProps) {
  const Icon = ICON_MAP[icon] || Briefcase
  const locale = useLocale()
  const stepsLabel = (STEPS_LABEL[locale] ?? STEPS_LABEL.nl)(stepCount)

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      onClick={() => onSelect(id)}
      className="w-full cursor-pointer rounded-xl border border-white/10 bg-bg-surface/80 p-3 text-left backdrop-blur-md transition-all duration-200 hover:border-accent-system/40 hover:shadow-lg hover:shadow-accent-system/5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-system/20 to-accent-human/10">
          <Icon className="h-4 w-4 text-accent-system" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-0.5 text-xs text-text-quiet">{subtitle}</p>
          <p className="mt-1.5 font-mono text-[10px] text-text-faint">{stepsLabel}</p>
        </div>
      </div>
    </motion.button>
  )
}
