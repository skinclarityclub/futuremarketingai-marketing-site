'use client'

import { motion } from 'motion/react'
import { useLocale } from 'next-intl'
import { Brain } from 'lucide-react'
import { useChatbotStore } from '@/stores/chatbotStore'
import { MEMORY_FIELD_ORDER, type MemoryProfile } from '@/lib/chatbot/memory'

type Loc = 'nl' | 'en' | 'es'
function loc(value: string): Loc {
  return value === 'en' || value === 'es' ? value : 'nl'
}

const FIELD_LABELS: Record<Loc, Record<keyof MemoryProfile, string>> = {
  nl: {
    agencyName: 'Bureau',
    niche: 'Niche',
    brandCount: 'Merken',
    teamSize: 'Teamgrootte',
    painPoint: 'Pijnpunt',
    goal: 'Doel',
  },
  en: {
    agencyName: 'Agency',
    niche: 'Niche',
    brandCount: 'Brands',
    teamSize: 'Team size',
    painPoint: 'Pain point',
    goal: 'Goal',
  },
  es: {
    agencyName: 'Agencia',
    niche: 'Nicho',
    brandCount: 'Marcas',
    teamSize: 'Tamaño del equipo',
    painPoint: 'Punto de dolor',
    goal: 'Objetivo',
  },
}

const EMPTY_HINT: Record<Loc, string> = {
  nl: 'Clyde noteert hier wat hij over je leert terwijl jullie praten.',
  en: 'Clyde notes here what he learns about you as you talk.',
  es: 'Clyde anota aquí lo que aprende sobre ti mientras hablan.',
}

export interface MemoryCardData {
  remembered?: Partial<MemoryProfile>
}

export function MemoryCard(_props: { data: MemoryCardData }) {
  const l = loc(useLocale())
  const profile = useChatbotStore((s) => s.memoryProfile)
  const labels = FIELD_LABELS[l]
  const rows = MEMORY_FIELD_ORDER.filter((k) => {
    const v = profile[k]
    return v !== undefined && v !== null && String(v).trim() !== ''
  })

  if (rows.length === 0) {
    return (
      <div className="my-2 w-full rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md">
        <p className="text-xs leading-relaxed text-text-secondary">{EMPTY_HINT[l]}</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-2">
      {rows.map((key, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.22 }}
          className="flex items-start gap-3 rounded-xl border border-border-primary bg-bg-elevated/80 p-3 backdrop-blur-md"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-system/15">
            <Brain className="h-3.5 w-3.5 text-accent-system" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              {labels[key]}
            </p>
            <p className="mt-0.5 break-words text-sm text-text-primary">{String(profile[key])}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default MemoryCard
