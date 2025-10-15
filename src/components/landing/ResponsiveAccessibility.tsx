/**
 * Responsive Accessibility Helper Component
 * Source: responsive-accessibility-helper.tsx
 */

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Moon, Sun, Type } from 'lucide-react'

export const ResponsiveAccessibilityHelper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    screenReader: false,
  })

  useEffect(() => {
    // Apply settings
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }

    if (settings.largeText) {
      document.documentElement.style.fontSize = '120%'
    } else {
      document.documentElement.style.fontSize = ''
    }
  }, [settings])

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-4 right-4 z-50 p-4 rounded-full bg-blue-600 text-white shadow-2xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Accessibility Settings"
      >
        <Type className="h-6 w-6" />
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-4 z-50 w-80 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
              Accessibility Settings
            </h3>

            <div className="space-y-3">
              {/* High Contrast */}
              <button
                onClick={() => toggleSetting('highContrast')}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  settings.highContrast
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {settings.highContrast ? (
                    <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  )}
                  <span className="font-medium text-slate-900 dark:text-white">High Contrast</span>
                </div>
                <div
                  className={`w-10 h-6 rounded-full transition-colors ${
                    settings.highContrast ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full m-0.5"
                    animate={{ x: settings.highContrast ? 16 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>

              {/* Large Text */}
              <button
                onClick={() => toggleSetting('largeText')}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  settings.largeText
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Type className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="font-medium text-slate-900 dark:text-white">Large Text</span>
                </div>
                <div
                  className={`w-10 h-6 rounded-full transition-colors ${
                    settings.largeText ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full m-0.5"
                    animate={{ x: settings.largeText ? 16 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>

              {/* Screen Reader Helper */}
              <button
                onClick={() => toggleSetting('screenReader')}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  settings.screenReader
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {settings.screenReader ? (
                    <Volume2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  )}
                  <span className="font-medium text-slate-900 dark:text-white">Screen Reader</span>
                </div>
                <div
                  className={`w-10 h-6 rounded-full transition-colors ${
                    settings.screenReader ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full m-0.5"
                    animate={{ x: settings.screenReader ? 16 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
