import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

interface TabNavigationProps {
  tabs: Tab[]
  defaultTab?: string
  activeTab?: string
  onChange?: (tabId: string) => void
  variant?: 'default' | 'pills'
  className?: string
}

/**
 * TabNavigation - Accessible tab component with keyboard navigation
 *
 * @param tabs - Array of tab objects with id, label, content
 * @param defaultTab - Initial active tab ID
 * @param onChange - Callback when tab changes
 * @param variant - Visual style: 'default' | 'pills'
 */
export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'default',
  className = '',
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id)
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  // Use controlled activeTab if provided, otherwise use internal state
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab

  const handleTabChange = (tabId: string) => {
    setInternalActiveTab(tabId)
    onChange?.(tabId)
  }

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    const enabledTabs = tabs.filter((tab) => !tab.disabled)
    const currentTabIndex = enabledTabs.findIndex((tab) => tab.id === tabs[currentIndex].id)

    let nextIndex = currentTabIndex

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        nextIndex = (currentTabIndex + 1) % enabledTabs.length
        break
      case 'ArrowLeft':
        e.preventDefault()
        nextIndex = currentTabIndex - 1
        if (nextIndex < 0) {
          nextIndex = enabledTabs.length - 1
        }
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = enabledTabs.length - 1
        break
      default:
        return
    }

    const nextTab = enabledTabs[nextIndex]
    if (nextTab) {
      handleTabChange(nextTab.id)
      tabRefs.current[nextTab.id]?.focus()
    }
  }

  const baseTabClasses =
    'px-6 py-3 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg-dark'

  const variantClasses = {
    default: {
      active: 'border-b-2 border-accent-primary text-accent-primary',
      inactive:
        'border-b-2 border-transparent text-white/90 hover:text-text-primary hover:border-text-tertiary',
      disabled: 'border-b-2 border-transparent text-white/60 cursor-not-allowed',
    },
    pills: {
      active: 'bg-accent-primary text-white rounded-xl shadow-glow',
      inactive: 'text-white/90 hover:rounded-xl',
      disabled: 'text-white/60 cursor-not-allowed rounded-xl',
    },
  }

  return (
    <div className={className}>
      {/* Tab List */}
      <div
        role="tablist"
        className={`flex gap-2 ${variant === 'default' ? 'border-b border-border-primary' : ''}`}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id
          const isDisabled = tab.disabled

          const tabClasses = isDisabled
            ? variantClasses[variant].disabled
            : isActive
              ? variantClasses[variant].active
              : variantClasses[variant].inactive

          return (
            <motion.button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              aria-disabled={isDisabled}
              tabIndex={isActive ? 0 : -1}
              disabled={isDisabled}
              className={`${baseTabClasses} ${tabClasses} relative`}
              onClick={() => !isDisabled && handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              transition={{ duration: 0.2 }}
            >
              {tab.label}
              {isActive && variant === 'default' && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary"
                  layoutId="activeTabIndicator"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {tabs.map(
            (tab) =>
              activeTab === tab.id && (
                <motion.div
                  key={tab.id}
                  id={`tabpanel-${tab.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${tab.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1], // easeInOut
                  }}
                >
                  {tab.content}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TabNavigation
