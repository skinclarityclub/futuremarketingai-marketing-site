'use client'

import { cn } from '@/lib/utils'

interface PhoneMockupProps {
  children: React.ReactNode
  className?: string
}

export function PhoneMockup({ children, className }: PhoneMockupProps) {
  return (
    <div className={cn('relative inline-block', className)}>
      {/* Screen content -- renders first, sits below frame */}
      <div className="rounded-[2.5rem] overflow-hidden bg-bg-deep">
        <div className="mx-[6px] mt-6 mb-6">{children}</div>
      </div>
      {/* Phone frame overlay -- border only, no bg to avoid covering content */}
      <div className="absolute inset-0 rounded-[2.5rem] border-[6px] border-zinc-700/80 z-10 pointer-events-none shadow-2xl">
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-zinc-800 rounded-b-xl z-20" />
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-zinc-600 rounded-full z-20" />
      </div>
    </div>
  )
}
