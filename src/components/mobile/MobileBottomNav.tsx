/**
 * MobileBottomNav Component
 * 
 * A fixed bottom navigation bar for mobile with:
 * - 3 navigation items (Home, Explore, Book)
 * - Large touch targets (≥56px)
 * - Clear icons and labels
 * - Active state indication
 * - Analytics tracking
 */

import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Compass, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

interface MobileBottomNavProps {
  /** Override default nav items */
  items?: NavItem[]
  /** Hide the navigation entirely */
  hidden?: boolean
  /** Analytics event handler */
  onNavigate?: (itemId: string, path: string) => void
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'nav.home',
    icon: Home,
    path: '/',
  },
  {
    id: 'explore',
    label: 'nav.explore',
    icon: Compass,
    path: '/demo',
  },
  {
    id: 'book',
    label: 'nav.book',
    icon: Calendar,
    path: '/contact',
  },
]

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  items = DEFAULT_NAV_ITEMS,
  hidden = false,
  onNavigate,
}) => {
  const { t } = useTranslation(['common'])
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavClick = (item: NavItem) => {
    // Fire analytics event
    if (onNavigate) {
      onNavigate(item.id, item.path)
    }

    // Navigate
    navigate(item.path)
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  if (hidden) {
    return null
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-white/10 safe-area-inset-bottom"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center px-2 py-1 pb-safe">
        {items.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center py-2 px-4 min-h-[56px] touch-manipulation relative group flex-1 max-w-[120px]"
              aria-label={t(item.label, item.id)}
              aria-current={active ? 'page' : undefined}
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-500/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div className="relative z-10 mb-1">
                <Icon
                  className={`h-6 w-6 transition-all duration-200 ${
                    active
                      ? 'text-blue-400 scale-110'
                      : 'text-slate-400 group-hover:text-slate-300 group-hover:scale-105'
                  }`}
                  aria-hidden="true"
                />
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium transition-colors duration-200 relative z-10 ${
                  active
                    ? 'text-blue-400'
                    : 'text-slate-400 group-hover:text-slate-300'
                }`}
              >
                {t(item.label, item.id)}
              </span>

              {/* Ripple effect on tap */}
              <motion.div
                className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-active:opacity-100"
                transition={{ duration: 0.1 }}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav

