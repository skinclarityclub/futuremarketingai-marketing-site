import { useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

interface WaveformVisualizerProps {
  volumeLevel: number
  isActive: boolean
  barCount?: number
  className?: string
}

export function WaveformVisualizer({
  volumeLevel,
  isActive,
  barCount = 24,
  className,
}: WaveformVisualizerProps) {
  const barsRef = useRef<number[]>(Array.from({ length: barCount }, () => Math.random() * 0.3))

  useEffect(() => {
    if (isActive) {
      barsRef.current = Array.from({ length: barCount }, (_, i) => {
        const centerDistance = Math.abs(i - barCount / 2) / (barCount / 2)
        const base = volumeLevel * (1 - centerDistance * 0.5)
        const jitter = (Math.random() - 0.5) * 0.3
        return Math.max(0.08, Math.min(1, base + jitter))
      })
    } else {
      barsRef.current = Array.from({ length: barCount }, (_, i) => {
        const centerDistance = Math.abs(i - barCount / 2) / (barCount / 2)
        return 0.08 + (1 - centerDistance) * 0.12
      })
    }
  }, [volumeLevel, isActive, barCount])

  return (
    <div
      className={cn('flex items-center justify-center gap-[3px] h-16', className)}
      aria-hidden="true"
    >
      {barsRef.current.map((height, i) => (
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
