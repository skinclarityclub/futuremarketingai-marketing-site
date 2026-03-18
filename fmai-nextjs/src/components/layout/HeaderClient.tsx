'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

interface HeaderClientProps {
  locale: string
}

export function HeaderClient({ locale }: HeaderClientProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-2">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={`text-xs font-mono uppercase px-2 py-1 rounded transition-colors ${
            loc === locale
              ? 'bg-accent-system/20 text-accent-system'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  )
}
