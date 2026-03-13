/**
 * SimpleHeader Component - Living System Header
 * Converted from glassmorphism to Living System teal/amber tokens.
 *
 * Design: bg-bg-surface, teal accents, sharp corners (rounded-sm), no backdrop-blur.
 */

import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles, LogIn, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, type Language } from '../../i18n/config'
import { useDemoRedirect } from '../../hooks'
import { DesktopOnlyNoticeModal } from '../mobile/DesktopOnlyNoticeModal'
import { CTAButton } from '../common'
// Import flag SVG components
import GB from 'country-flag-icons/react/3x2/GB'
import NL from 'country-flag-icons/react/3x2/NL'
import ES from 'country-flag-icons/react/3x2/ES'

// Map language codes to flag components
const FLAG_COMPONENTS = {
  en: GB,
  nl: NL,
  es: ES,
} as const

export const SimpleHeader: React.FC = () => {
  const { t, i18n } = useTranslation('common')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const langDropdownRef = useRef<HTMLDivElement>(null)
  const servicesDropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Use demo redirect hook for mobile modal
  const { showDesktopNotice, closeDesktopNotice, noticePage } = useDemoRedirect()

  const currentLanguage = (i18n.language?.split('-')[0] || 'en') as Language
  const currentLangData = LANGUAGES[currentLanguage] || LANGUAGES.en
  const FlagComponent = FLAG_COMPONENTS[currentLanguage] || GB

  const changeLanguage = (lang: Language) => {
    void i18n.changeLanguage(lang)
    setIsLangOpen(false)

    // Track language change
    if (window.gtag) {
      window.gtag('event', 'language_change', {
        previous_language: currentLanguage,
        new_language: lang,
        source: 'mobile_header',
      })
    }
  }

  // Handle scroll for sticky header effect + auto-hide
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Update scrolled state (for styling)
      setIsScrolled(currentScrollY > 20)

      // Don't hide if mobile menu is open
      if (isMobileMenuOpen) {
        setIsVisible(true)
        setLastScrollY(currentScrollY)
        return
      }

      // Hide on scroll down, show on scroll up (2025 UX pattern)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true)
      }

      // Always show at top
      if (currentScrollY < 10) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, isMobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsLangOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false)
      }
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsServicesOpen(false)
      }
    }

    if (isLangOpen || isServicesOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isLangOpen, isServicesOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Focus trap for mobile menu (WCAG requirement)
  useEffect(() => {
    if (!isMobileMenuOpen) {
      return
    }

    const menuEl = document.getElementById('mobile-menu')
    if (!menuEl) {
      return
    }

    const focusableEls = menuEl.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const firstEl = focusableEls[0]
    const lastEl = focusableEls[focusableEls.length - 1]

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {
        return
      }

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault()
          lastEl?.focus()
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault()
          firstEl?.focus()
        }
      }
    }

    document.addEventListener('keydown', trapFocus)
    firstEl?.focus()

    return () => document.removeEventListener('keydown', trapFocus)
  }, [isMobileMenuOpen])

  // Services dropdown items
  const serviceLinks = [
    { label: 'AI Automations', href: '/automations' },
    { label: 'AI Chatbots', href: '/chatbots' },
    { label: 'AI Voice Agents', href: '/voice-agents' },
    { label: 'AI Marketing Machine', href: '/demo' },
  ]

  // Minimal navigation
  const navLinks = [{ label: t('landing.header.nav.pricing'), href: '/pricing' }]

  const isActiveLink = (href: string) => {
    return location.pathname === href
  }

  return (
    <>
      {/* Living System Floating Header with Auto-Hide */}
      <motion.header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Floating Container - Living System surface */}
          <div
            className={`relative transition-all duration-700 ${
              isScrolled
                ? 'bg-bg-surface/95 border border-border-primary shadow-glow-sm'
                : 'bg-bg-surface/80 border border-border-primary shadow-lg'
            } rounded-sm`}
          >
            <div className="relative flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16">
              {/* Logo - Living System Style */}
              <Link
                to="/"
                className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-system rounded-sm"
                aria-label={t('landing.header.logo_aria')}
              >
                {/* Icon */}
                <div className="relative">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-accent-system transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
                </div>

                {/* Text Logo */}
                <div className="font-bold text-base sm:text-lg tracking-tight">
                  <span className="text-text-primary group-hover:text-text-primary transition-colors">
                    {t('landing.header.brand.future')}
                  </span>
                  <span className="text-accent-system ml-0.5">{t('landing.header.brand.ai')}</span>
                </div>
              </Link>

              {/* Mobile: Language Switcher + Hamburger Menu */}
              <div className="lg:hidden flex items-center gap-2">
                {/* Language Switcher - Compact Flag Button */}
                <div className="relative" ref={langDropdownRef}>
                  <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="w-9 h-9 rounded-sm bg-bg-elevated border border-border-primary flex items-center justify-center hover:bg-bg-elevated/80 transition-colors p-1.5"
                    aria-label={t('common:language_switcher.change_language')}
                    aria-expanded={isLangOpen}
                    type="button"
                  >
                    <div className="w-full h-full rounded overflow-hidden">
                      <FlagComponent
                        title={currentLangData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>

                  {/* Language Dropdown */}
                  <AnimatePresence>
                    {isLangOpen && (
                      <>
                        {/* Backdrop */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-40"
                          onClick={() => setIsLangOpen(false)}
                        />

                        {/* Dropdown Menu */}
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 bg-bg-elevated border border-border-primary rounded-sm shadow-glow-sm py-2 min-w-[140px] z-50"
                        >
                          {Object.entries(LANGUAGES).map(([code, data]) => {
                            const FlagIcon = FLAG_COMPONENTS[code as Language]
                            return (
                              <button
                                key={code}
                                onClick={() => changeLanguage(code as Language)}
                                className={`
                                  w-full px-3 py-2 text-left flex items-center gap-3 transition-colors
                                  hover:bg-bg-surface
                                  ${currentLanguage === code ? 'bg-accent-system/10' : ''}
                                `}
                                type="button"
                              >
                                <div className="w-6 h-4 rounded overflow-hidden shadow-sm flex-shrink-0">
                                  <FlagIcon
                                    title={data.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span
                                  className={`text-sm font-medium ${
                                    currentLanguage === code
                                      ? 'text-accent-system'
                                      : 'text-text-secondary'
                                  }`}
                                >
                                  {data.name}
                                </span>
                                {currentLanguage === code && (
                                  <svg
                                    className="w-4 h-4 ml-auto text-accent-system"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </button>
                            )
                          })}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Hamburger Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-sm text-text-primary hover:bg-bg-elevated transition-colors"
                  aria-label={
                    isMobileMenuOpen
                      ? t('landing.header.mobile_menu_close')
                      : t('landing.header.mobile_menu_open')
                  }
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>

              {/* Center: Minimal Navigation */}
              <nav
                className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
                aria-label={t('landing.header.nav_aria')}
              >
                {/* Services Dropdown */}
                <div
                  className="relative"
                  ref={servicesDropdownRef}
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <button
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-all duration-300 flex items-center gap-1 ${
                      serviceLinks.some((s) => isActiveLink(s.href))
                        ? 'text-text-primary bg-bg-elevated'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                    }`}
                    type="button"
                  >
                    {t('landing.header.nav.features')}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isServicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 bg-bg-elevated border border-border-primary rounded-sm shadow-glow-sm py-2 min-w-[200px] z-50"
                      >
                        {serviceLinks.map((link) => (
                          <Link
                            key={link.href}
                            to={link.href}
                            className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                              isActiveLink(link.href)
                                ? 'text-accent-system bg-accent-system/10'
                                : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                            }`}
                            onClick={() => setIsServicesOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-all duration-300 ${
                      isActiveLink(link.href)
                        ? 'text-text-primary bg-bg-elevated'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                    }`}
                    aria-current={isActiveLink(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Right: CTA Hierarchy */}
              <div className="hidden lg:flex items-center gap-2">
                {/* Secondary CTA - Login */}
                <a href="https://app.future-marketing.ai/login">
                  <button className="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-sm hover:bg-bg-elevated">
                    <LogIn className="w-4 h-4 inline mr-1.5" />
                    {t('landing.header.login')}
                  </button>
                </a>

                {/* Primary CTA - Living System CTAButton */}
                <CTAButton size="sm" calendly>
                  {t('landing.header.try_demo')}
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu - Living System Style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-x-0 top-0 z-40 pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-bg-deep/95"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Container */}
            <div
              id="mobile-menu"
              className="relative max-w-lg mx-4 bg-bg-surface border border-border-primary rounded-sm shadow-glow-sm overflow-hidden"
            >
              <nav
                className="flex flex-col p-4 space-y-1"
                aria-label={t('landing.header.mobile_nav_aria')}
              >
                {/* Navigation Links */}
                <Link
                  to="/"
                  className={`px-4 py-2.5 rounded-sm text-sm font-medium transition-all ${
                    isActiveLink('/')
                      ? 'text-text-primary bg-bg-elevated'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('landing.header.nav.home')}
                </Link>

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-2.5 rounded-sm text-sm font-medium transition-all ${
                      isActiveLink(link.href)
                        ? 'text-text-primary bg-bg-elevated'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Divider */}
                <div className="h-px bg-border-primary my-2" />

                {/* Mobile: Service Links */}
                {serviceLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-2.5 rounded-sm text-sm font-medium transition-all ${
                      isActiveLink(link.href)
                        ? 'text-text-primary bg-bg-elevated'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Divider */}
                <div className="h-px bg-border-primary my-1" />

                {/* Mobile CTAs */}
                <div onClick={() => setIsMobileMenuOpen(false)}>
                  <CTAButton size="md" calendly className="w-full justify-center">
                    {t('landing.header.try_demo')}
                  </CTAButton>
                </div>

                <a
                  href="https://app.future-marketing.ai/login"
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <button className="w-full px-4 py-2.5 bg-bg-elevated text-text-primary text-sm font-medium rounded-sm hover:bg-bg-elevated/80 transition-all flex items-center justify-center gap-2 border border-border-primary">
                    <LogIn className="w-4 h-4" />
                    {t('landing.header.login')}
                  </button>
                </a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Notice Modal - Mobile Only */}
      {showDesktopNotice && (
        <DesktopOnlyNoticeModal
          pageName={noticePage}
          onClose={closeDesktopNotice}
          isOpen={showDesktopNotice}
        />
      )}
    </>
  )
}
