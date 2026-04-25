import type { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen pt-16 focus:outline-none">
      {children}
    </main>
  )
}
