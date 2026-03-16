import { motion } from 'framer-motion'
import { Briefcase, ShoppingBag, Headphones } from 'lucide-react'

const ICON_MAP: Record<string, typeof Briefcase> = {
  Briefcase,
  ShoppingBag,
  Headphones,
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

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      onClick={() => onSelect(id)}
      className="w-full cursor-pointer rounded-xl border border-border-primary bg-bg-elevated/80 p-3 text-left backdrop-blur-md transition-all duration-200 hover:border-accent-system/40 hover:shadow-lg hover:shadow-accent-system/5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-system/20 to-accent-secondary/10">
          <Icon className="h-4 w-4 text-accent-system" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-medium text-text-primary">{title}</p>
          <p className="mt-0.5 text-xs text-text-secondary">{subtitle}</p>
          <p className="mt-1.5 font-mono text-[10px] text-text-secondary/60">{stepCount} steps</p>
        </div>
      </div>
    </motion.button>
  )
}
