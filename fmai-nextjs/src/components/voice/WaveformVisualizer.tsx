'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface WaveformVisualizerProps {
  volumeLevel: number
  isActive: boolean
  barCount?: number
  className?: string
}

function idleBars(barCount: number): number[] {
  return Array.from({ length: barCount }, (_, i) => {
    const centerDistance = Math.abs(i - barCount / 2) / (barCount / 2)
    return 0.08 + (1 - centerDistance) * 0.12
  })
}

export function WaveformVisualizer({
  volumeLevel,
  isActive,
  barCount = 24,
  className,
}: WaveformVisualizerProps) {
  const [bars, setBars] = useState<number[]>(() => idleBars(barCount))

  useEffect(() => {
    if (isActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync bar heights from external volumeLevel/isActive props
      setBars(
        Array.from({ length: barCount }, (_, i) => {
          const centerDistance = Math.abs(i - barCount / 2) / (barCount / 2)
          const base = volumeLevel * (1 - centerDistance * 0.5)
          const jitter = (Math.random() - 0.5) * 0.3
          return Math.max(0.08, Math.min(1, base + jitter))
        })
      )
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset to idle baseline when inactive
      setBars(idleBars(barCount))
    }
  }, [volumeLevel, isActive, barCount])

  return (
    <div
      className={cn('flex items-center justify-center gap-[3px] h-16', className)}
      aria-hidden="true"
    >
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-accent-system transition-all duration-75"
          style={{
            height: `${height * 100}%`,
            opacity: isActive ? 0.6 + height * 0.4 : 0.3,
          }}
        />
      ))}
    </div>
  )
}
