import type { ReactNode } from 'react'
import { StickyMobileCTA } from '@/components/ui/StickyMobileCTA'

interface PageShellProps {
  children: ReactNode
  /**
   * When true, render <StickyMobileCTA /> as a sibling to <main>.
   * Off by default — pages opt in (home, memory, pricing, founding-member,
   * SKC case study, all 12 skill pages via SkillPageTemplate).
   * Excluded: /apply, /contact, /blog/[slug], legal pages, /newsletter/confirm.
   */
  showStickyCta?: boolean
}

export function PageShell({ children, showStickyCta = false }: PageShellProps) {
  return (
    <>
      <main id="main" tabIndex={-1} className="min-h-screen pt-16 focus:outline-none">
        {children}
      </main>
      {showStickyCta ? <StickyMobileCTA /> : null}
    </>
  )
}
