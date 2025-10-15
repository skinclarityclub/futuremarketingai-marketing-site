import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUser, FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa'

interface UserProfileFloatProps {
  userName?: string
  userEmail?: string
  userAvatar?: string
  onLogout?: () => void
  onSettings?: () => void
}

/**
 * UserProfileFloat - Compact floating user profile button in top-right corner
 */
export const UserProfileFloat: React.FC<UserProfileFloatProps> = ({
  userName = 'Demo User',
  userEmail = 'demo@futuremarketing.ai',
  userAvatar,
  onLogout,
  onSettings,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="relative">
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-card/90 backdrop-blur-xl hover:bg-bg-card transition-all duration-200 border border-white/10 hover:border-accent-primary/50 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full rounded-full" />
            ) : (
              <FaUser className="text-sm" />
            )}
          </div>

          {/* User Name (Hidden on mobile) */}
          <span className="hidden sm:block text-sm font-medium text-white">{userName}</span>

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
                className="absolute right-0 mt-2 w-64 bg-bg-card/95 backdrop-blur-xl border border-border-primary rounded-xl shadow-glow overflow-hidden z-50"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                {/* User Info */}
                <div className="p-4 border-b border-border-primary">
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
                    <span className="text-sm">Settings</span>
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
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default UserProfileFloat
