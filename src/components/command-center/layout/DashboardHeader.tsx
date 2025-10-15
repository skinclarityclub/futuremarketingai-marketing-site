import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUser, FaCog, FaSignOutAlt, FaBell, FaChevronDown } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

interface DashboardHeaderProps {
  userName?: string
  userEmail?: string
  userAvatar?: string
  systemStatus?: 'operational' | 'warning' | 'error'
  onLogout?: () => void
  onSettings?: () => void
}

/**
 * DashboardHeader - Command Center header with branding, status, and user menu
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Demo User',
  userEmail = 'demo@futuremarketing.ai',
  userAvatar,
  systemStatus = 'operational',
  onLogout,
  onSettings,
}) => {
  const { t } = useTranslation('dashboard')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const statusConfig = {
    operational: {
      color: 'bg-success',
      pulseColor: 'bg-success/30',
      label: t('header.system_status.operational'),
      textColor: 'text-success',
    },
    warning: {
      color: 'bg-warning',
      pulseColor: 'bg-warning/30',
      label: t('header.system_status.warning'),
      textColor: 'text-warning',
    },
    error: {
      color: 'bg-error',
      pulseColor: 'bg-error/30',
      label: t('header.system_status.error'),
      textColor: 'text-error',
    },
  }

  const status = statusConfig[systemStatus]

  return (
    <header className="sticky top-0 z-50 bg-bg-card/80 backdrop-blur-xl border-b border-border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-2xl font-bold text-white">F</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">{t('header.brand')}</h1>
                <p className="text-xs text-white/60">{t('header.command_center')}</p>
              </div>
            </motion.div>
          </div>

          {/* System Status */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl">
            <div className="relative">
              <div className={`w-2.5 h-2.5 rounded-full ${status.color}`} />
              <motion.div
                className={`absolute inset-0 rounded-full ${status.pulseColor}`}
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className={`text-sm font-medium ${status.textColor}`}>{status.label}</span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:transition-all duration-200 border border-white/10 hover:border-accent-primary/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-full h-full rounded-full" />
                ) : (
                  <FaUser className="text-sm" />
                )}
              </div>

              {/* User Info */}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-white/60">{userEmail}</p>
              </div>

              {/* Dropdown Icon */}
              <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <FaChevronDown className="text-white/60 text-xs" />
              </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    className="fixed inset-0 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMenuOpen(false)}
                  />

                  {/* Menu */}
                  <motion.div
                    className="absolute right-0 mt-2 w-64 bg-bg-card border border-border-primary rounded-xl shadow-glow overflow-hidden z-50"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* User Info (Mobile) */}
                    <div className="lg:hidden p-4 border-b border-border-primary">
                      <p className="text-sm font-medium text-white">{userName}</p>
                      <p className="text-xs text-white/60">{userEmail}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false)
                          onSettings?.()
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:transition-colors duration-200 text-white/90 hover:text-white"
                      >
                        <FaCog className="text-accent-primary" />
                        <span className="text-sm">{t('header.menu.settings')}</span>
                      </button>

                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:transition-colors duration-200 text-white/90 hover:text-white"
                      >
                        <FaBell className="text-accent-secondary" />
                        <span className="text-sm">{t('header.menu.notifications')}</span>
                        <span className="ml-auto bg-accent-primary text-white text-xs px-2 py-0.5 rounded-full">
                          3
                        </span>
                      </button>

                      <div className="my-2 border-t border-border-primary" />

                      <button
                        onClick={() => {
                          setIsMenuOpen(false)
                          onLogout?.()
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-error/10 transition-colors duration-200 text-white/90 hover:text-error"
                      >
                        <FaSignOutAlt className="text-error" />
                        <span className="text-sm">{t('header.menu.logout')}</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
