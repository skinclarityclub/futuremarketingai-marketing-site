'use client'

import { useState, useEffect } from 'react'
import { usePathname, Link } from '@/i18n/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  ChevronDown,
  LogIn,
  PenTool,
  Mic,
  Bot,
  Share2,
  Megaphone,
  BarChart3,
  Mail,
} from 'lucide-react'

interface HeaderClientProps {
  locale: string
}

const SKILL_ITEMS = [
  {
    icon: PenTool,
    title: 'Content Creator',
    description: 'Blog posts, social content, newsletters — on autopilot',
    href: '/skills/content-creator' as const,
  },
  {
    icon: Mic,
    title: 'Voice Agent',
    description: 'AI-powered inbound and outbound calls',
    href: '/skills/voice-agent' as const,
  },
  {
    icon: Bot,
    title: 'Lead Qualifier',
    description: 'Chatbot that qualifies leads 24/7',
    href: '/skills/lead-qualifier' as const,
  },
  {
    icon: Bot,
    title: 'Chatbot',
    description: 'AI chatbots that qualify and convert 24/7',
    href: '/skills/chatbot' as const,
  },
  {
    icon: Share2,
    title: 'Social Media',
    description: 'Multi-platform scheduling and analytics',
    href: '/skills/social-media' as const,
  },
  {
    icon: Megaphone,
    title: 'Ad Creator',
    description: 'AI-generated static and video ads',
    href: '/skills/ad-creator' as const,
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'Automated campaigns, follow-ups, and inbox AI',
    href: '/skills/email' as const,
  },
  {
    icon: BarChart3,
    title: 'Reporting',
    description: 'Cross-platform dashboards and weekly reports',
    href: '/skills/reporting' as const,
  },
]

const NAV_ITEMS = [
  { label: 'Skills', href: '/#skills' as const, hasDropdown: true },
  { label: 'Pricing', href: '/pricing' as const },
  { label: 'About', href: '/about' as const },
  { label: 'How It Works', href: '/how-it-works' as const },
]

export function HeaderClient({ locale }: HeaderClientProps) {
  const pathname = usePathname()

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [skillsOpen, setSkillsOpen] = useState(false)
  const [mobileSkillsOpen, setMobileSkillsOpen] = useState(false)

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
    setMobileSkillsOpen(false)
  }, [pathname])

  // Close dropdowns on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSkillsOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close services dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => {
      setSkillsOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

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
        <Link href="/" className="flex items-center group" aria-label="FMai home">
          <span className="font-display font-bold text-xl tracking-tight">
            <span className="text-white">FM</span>
            <span className="bg-gradient-to-r from-[#F5A623] to-[#0ABAB5] bg-clip-text text-transparent">
              ai
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="relative">
              {item.hasDropdown ? (
                <div
                  onMouseEnter={() => setSkillsOpen(true)}
                  onMouseLeave={() => setSkillsOpen(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-white/5"
                    aria-expanded={skillsOpen}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        skillsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {skillsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute top-full left-0 mt-1 w-80 bg-bg-deep/98 backdrop-blur-xl border border-border-primary rounded-xl shadow-2xl shadow-accent-system/10 p-4 z-50"
                        role="menu"
                      >
                        <div className="space-y-1">
                          {SKILL_ITEMS.map((skill) => (
                            <Link
                              key={skill.href}
                              href={skill.href}
                              className="flex items-start gap-3 p-3 rounded-lg transition-all group/item hover:bg-white/5 border border-transparent hover:border-white/10"
                              role="menuitem"
                            >
                              <div className="p-2 rounded-md bg-surface-elevated group-hover/item:bg-accent-system/20 transition-all">
                                <skill.icon
                                  className="w-4 h-4 text-accent-system"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-text-primary group-hover/item:text-accent-system transition-colors">
                                  {skill.title}
                                </div>
                                <div className="text-xs text-text-muted group-hover/item:text-text-secondary transition-colors leading-relaxed">
                                  {skill.description}
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
          {/* Login text link */}
          <a
            href="https://app.future-marketing.ai/login"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <LogIn className="w-4 h-4" />
            Login
          </a>

          {/* Primary CTA */}
          <Link
            href="/contact"
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#F5A623] to-[#0ABAB5] text-bg-deep font-semibold text-sm px-4 py-2 rounded-[var(--radius-btn)] hover:opacity-90 transition-all"
          >
            See Our Work
          </Link>

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
                          onClick={() => setMobileSkillsOpen(!mobileSkillsOpen)}
                          className="flex items-center justify-between w-full text-text-primary font-semibold py-3 px-4 rounded-lg hover:bg-white/5 transition-all"
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              mobileSkillsOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileSkillsOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-4 space-y-2 overflow-hidden"
                            >
                              {SKILL_ITEMS.map((skill) => (
                                <Link
                                  key={skill.href}
                                  href={skill.href}
                                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary border border-white/10 hover:border-white/20 transition-all"
                                  onClick={() => setMobileOpen(false)}
                                >
                                  <div className="p-2 rounded-md bg-surface-elevated">
                                    <skill.icon className="w-4 h-4 text-accent-system" />
                                  </div>
                                  <div className="font-medium text-sm">{skill.title}</div>
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

                {/* Mobile Login */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <a
                    href="https://app.future-marketing.ai/login"
                    className="flex items-center justify-center gap-3 p-4 bg-white/10 text-text-primary rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    Log In
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
