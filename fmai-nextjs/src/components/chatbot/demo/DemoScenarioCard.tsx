'use client'

import { motion } from 'motion/react'
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
      className="w-full cursor-pointer rounded-xl border border-white/10 bg-[#0A0E27]/80 p-3 text-left backdrop-blur-md transition-all duration-200 hover:border-[#00D4FF]/40 hover:shadow-lg hover:shadow-[#00D4FF]/5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#00D4FF]/20 to-[#A855F7]/10">
          <Icon className="h-4 w-4 text-[#00D4FF]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-0.5 text-xs text-white/60">{subtitle}</p>
          <p className="mt-1.5 font-mono text-[10px] text-white/40">{stepCount} steps</p>
        </div>
      </div>
    </motion.button>
  )
}
