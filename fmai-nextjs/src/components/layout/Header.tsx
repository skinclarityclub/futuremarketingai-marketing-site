import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { HeaderClient } from './HeaderClient'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

interface HeaderProps {
  locale: string
}

export async function Header({ locale }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-deep/80 backdrop-blur-md border-b border-border-primary">
      <nav
        className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link href="/" className="text-xl font-bold font-display text-text-primary">
          Future<span className="text-accent-system">AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <HeaderClient locale={locale} />
      </nav>
    </header>
  )
}
