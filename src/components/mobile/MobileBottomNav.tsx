/**
 * MobileBottomNav - Landing page mobile navigation
 *
 * Desktop-first compliant: This is a NEW mobile-only component for landing pages.
 * NOT to be confused with the Command Center MobileBottomNav.
 *
 * Requirements:
 * - 3 navigation items: Home, Explore, Book
 * - Large touch targets (≥56px height)
 * - Clear icons from Heroicons
 * - React Router v7+ navigation
 * - Analytics tracking
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, Sparkles, Calendar } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  analyticsLabel: string
}

interface MobileBottomNavProps {
  className?: string
}

/**
 * Landing page mobile bottom navigation
 * 3 items: Home, Explore (features), Book (call)
 */
export function MobileBottomNav({ className = '' }: MobileBottomNavProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: t('mobile.nav.home', 'Home'),
      icon: Home,
      path: '/',
      analyticsLabel: 'mobile_nav_home',
    },
    {
      id: 'explore',
      label: t('mobile.nav.explore', 'Explore'),
      icon: Sparkles,
      path: '/#features',
      analyticsLabel: 'mobile_nav_explore',
    },
    {
      id: 'book',
      label: t('mobile.nav.book', 'Book'),
      icon: Calendar,
      path: '/book',
      analyticsLabel: 'mobile_nav_book',
    },
  ]

  const handleNavClick = (item: NavItem) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'mobile_navigation', {
        event_category: 'engagement',
        event_label: item.analyticsLabel,
        value: 1,
      })
    }

    // Navigate
    if (item.path.startsWith('/#')) {
      // Handle anchor links
      const anchor = item.path.substring(2)
      const element = document.getElementById(anchor)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(item.path)
    }
  }

  // Determine active item based on current path
  const getActiveItem = () => {
    const path = location.pathname
    if (path === '/') {
      return 'home'
    }
    if (path === '/book' || path.includes('calendly')) {
      return 'book'
    }
    return 'explore' // Default for other pages
  }

  const activeItem = getActiveItem()

  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-bg-card/95 backdrop-blur-xl
        border-t border-white/10
        pb-safe
        ${className}
      `}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-20 px-4 safe-area-inset-x">
        {navItems.map((item) => {
          const isActive = activeItem === item.id
          const Icon = item.icon

          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`
                flex flex-col items-center justify-center gap-1.5
                min-w-[64px] min-h-touch
                rounded-xl transition-all duration-200
                touch-manipulation
                ${isActive ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'}
              `}
              whileTap={{ scale: 0.95 }}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              type="button"
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-accent-primary rounded-full"
                  layoutId="mobileNavIndicator"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon */}
              <Icon
                className={`w-6 h-6 transition-all duration-200 ${
                  isActive ? 'text-accent-primary scale-110' : ''
                }`}
              />

              {/* Label */}
              <span
                className={`text-xs font-medium transition-all duration-200 ${
                  isActive ? 'text-accent-primary' : ''
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}

MobileBottomNav.displayName = 'MobileBottomNav'

// Type for window.gtag
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void
  }
}
