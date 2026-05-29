'use client'

import { ArrowRight } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'

interface NavigationButtonProps {
  url: string
  label: string
}

export function NavigationButton({ url, label }: NavigationButtonProps) {
  const router = useRouter()

  // The chat closes itself on route change (ChatWidgetIsland), which also lets
  // Clyde follow up on the destination page — so just navigate here.
  const handleClick = () => {
    router.push(url)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-system/10 border border-accent-system/30 text-accent-system text-sm font-medium hover:bg-accent-system/20 transition-colors cursor-pointer"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </button>
  )
}

export default NavigationButton
