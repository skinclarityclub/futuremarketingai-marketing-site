import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { TelegramMockup } from './TelegramMockup'

interface TelegramModalProps {
  isOpen: boolean
  onClose: () => void
  initialAgent?: 'strategy' | 'campaign' | 'content' | 'approval'
}

export const TelegramModal: React.FC<TelegramModalProps> = ({
  isOpen,
  onClose,
  initialAgent = 'approval',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="pointer-events-auto w-full max-w-md"
            >
              {/* Close Button */}
              <div className="flex justify-end mb-2">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Telegram Mockup */}
              <TelegramMockup initialAgent={initialAgent} showInModal />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
