import React from 'react'
import { motion } from 'framer-motion'
import { FaChartLine, FaRocket, FaCalendarAlt, FaBullhorn, FaRobot, FaCog } from 'react-icons/fa'

interface MobileBottomNavProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  tabs: Array<{ id: string; label: string }>
}

/**
 * MobileBottomNav - Fixed bottom navigation bar for mobile devices
 * Displays icon-based navigation for easier thumb access on mobile
 */
export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  tabs,
}) => {
  // Map tab IDs to icons
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    overview: FaChartLine,
    'ai-control': FaRobot,
    'campaign-management': FaRocket,
    'content-pipeline': FaCalendarAlt,
    'analytics-hub': FaBullhorn,
    'content-calendar': FaCalendarAlt,
    'ad-manager': FaBullhorn,
  }

  // Filter to show max 5 most important tabs on mobile
  const priorityTabs = [
    'overview',
    'ai-control',
    'campaign-management',
    'content-pipeline',
    'analytics-hub',
  ]
  const displayTabs = tabs.filter((tab) => priorityTabs.includes(tab.id))

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-bg-card/95 backdrop-blur-xl border-t border-border-primary pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {displayTabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = iconMap[tab.id] || FaCog
          const displayLabel = tab.label.split(' ')[0] // Only show first word on mobile

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[64px] relative ${
                isActive ? 'text-accent-primary' : 'text-white/60 hover:text-white'
              }`}
              whileTap={{ scale: 0.9 }}
              aria-label={tab.label}
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent-primary rounded-full"
                  layoutId="mobileActiveIndicator"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon */}
              <Icon className={`text-xl ${isActive ? 'text-accent-primary' : ''}`} />

              {/* Label */}
              <span className={`text-[10px] font-medium ${isActive ? 'text-accent-primary' : ''}`}>
                {displayLabel}
              </span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav
