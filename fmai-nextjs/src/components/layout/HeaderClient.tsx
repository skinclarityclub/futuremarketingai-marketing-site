'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter, Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, LogIn, Sparkles, Bot, Workflow, Mic, Megaphone } from 'lucide-react'

interface HeaderClientProps {
  locale: string
}

const SERVICE_ITEMS = [
  {
    icon: Bot,
    title: 'AI Chatbots',
    description: 'Intelligent conversational agents for your business',
    href: '/chatbots' as const,
  },
  {
    icon: Workflow,
    title: 'Automations',
    description: 'End-to-end workflow automation with AI',
    href: '/automations' as const,
  },
  {
    icon: Mic,
    title: 'Voice Agents',
    description: 'AI-powered voice assistants and phone agents',
    href: '/voice-agents' as const,
  },
  {
    icon: Megaphone,
    title: 'Marketing Machine',
    description: 'Full-stack AI marketing automation',
    href: '/marketing-machine' as const,
  },
]

const NAV_ITEMS = [
  { label: 'Home', href: '/' as const },
  { label: 'Services', href: '/#services' as const, hasDropdown: true },
  { label: 'Pricing', href: '/pricing' as const },
  { label: 'How It Works', href: '/how-it-works' as const },
  { label: 'About', href: '/about' as const },
  { label: 'Contact', href: '/contact' as const },
]

export function HeaderClient({ locale }: HeaderClientProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setMobileServicesOpen(false)
  }, [pathname])

  // Close dropdowns on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close services dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setServicesOpen(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-bg-deep/95 backdrop-blur-xl border-b border-accent-system/20 shadow-2xl shadow-accent-system/5'
          : 'bg-bg-deep/80 backdrop-blur-md border-b border-border-primary'
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Future AI home">
          <Sparkles className="w-5 h-5 text-accent-system group-hover:text-white transition-colors duration-300" />
          <span className="text-xl font-bold font-display">
            <span className="text-text-primary group-hover:text-accent-system transition-colors duration-300">
              Future
            </span>
            <span className="text-accent-system group-hover:text-white transition-colors duration-300">
              AI
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="relative">
              {item.hasDropdown ? (
                <div
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-white/5"
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        servicesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute top-full left-0 mt-1 w-80 bg-bg-deep/98 backdrop-blur-xl border border-border-primary rounded-xl shadow-2xl shadow-accent-system/10 p-4 z-50"
                        role="menu"
                      >
                        <div className="space-y-1">
                          {SERVICE_ITEMS.map((service) => (
                            <Link
                              key={service.href}
                              href={service.href}
                              className="flex items-start gap-3 p-3 rounded-lg transition-all group/item hover:bg-white/5 border border-transparent hover:border-white/10"
                              role="menuitem"
                            >
                              <div className="p-2 rounded-md bg-surface-elevated group-hover/item:bg-accent-system/20 transition-all">
                                <service.icon
                                  className="w-4 h-4 text-accent-system"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-text-primary group-hover/item:text-accent-system transition-colors">
                                  {service.title}
                                </div>
                                <div className="text-xs text-text-muted group-hover/item:text-text-secondary transition-colors leading-relaxed">
                                  {service.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-white/5"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Right side: Login + Locale Switcher + Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Login Button - desktop only */}
          <a
            href="https://app.future-marketing.ai/login"
            className="hidden md:flex items-center gap-2 border border-white/20 hover:border-accent-system/50 text-text-secondary hover:text-text-primary rounded-lg font-medium transition-all duration-300 px-4 py-2 text-sm hover:bg-white/5"
          >
            <LogIn className="w-4 h-4" />
            Log In
          </a>

          {/* Locale Switcher - desktop */}
          <div className="hidden md:flex items-center gap-1">
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all border border-transparent hover:border-white/20"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-text-primary" />
            ) : (
              <Menu className="w-5 h-5 text-text-primary" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-bg-deep/98 backdrop-blur-xl border-t border-border-primary overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="space-y-4">
                {/* Mobile Nav Links */}
                {NAV_ITEMS.map((item) => (
                  <div key={item.label}>
                    {item.hasDropdown ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className="flex items-center justify-between w-full text-text-primary font-semibold py-3 px-4 rounded-lg hover:bg-white/5 transition-all"
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              mobileServicesOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileServicesOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-4 space-y-2 overflow-hidden"
                            >
                              {SERVICE_ITEMS.map((service) => (
                                <Link
                                  key={service.href}
                                  href={service.href}
                                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary border border-white/10 hover:border-white/20 transition-all"
                                  onClick={() => setMobileOpen(false)}
                                >
                                  <div className="p-2 rounded-md bg-surface-elevated">
                                    <service.icon className="w-4 h-4 text-accent-system" />
                                  </div>
                                  <div className="font-medium text-sm">{service.title}</div>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block text-text-secondary hover:text-text-primary font-semibold py-3 px-4 rounded-lg hover:bg-white/5 transition-all"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Mobile Login + Locale */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <a
                    href="https://app.future-marketing.ai/login"
                    className="flex items-center justify-center gap-3 p-4 bg-white/10 text-text-primary rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    Log In
                  </a>

                  <div className="flex items-center justify-center gap-2">
                    {routing.locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          handleLocaleChange(loc)
                          setMobileOpen(false)
                        }}
                        className={`text-xs font-mono uppercase px-3 py-1.5 rounded transition-colors ${
                          loc === locale
                            ? 'bg-accent-system/20 text-accent-system'
                            : 'text-text-muted hover:text-text-secondary'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
