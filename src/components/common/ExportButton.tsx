/**
 * ExportButton Component
 *
 * Accessible button for exporting charts to PNG or PDF.
 *
 * Features:
 * - Dropdown menu for format selection
 * - Loading states during export
 * - Keyboard accessible
 * - WCAG AA compliant
 * - Touch-friendly
 *
 * Usage:
 * ```tsx
 * <ExportButton
 *   onExportPNG={() => exportToPNG(ref.current, 'chart-name')}
 *   onExportPDF={() => exportToPDF(ref.current, 'chart-name')}
 *   isExporting={isExporting}
 * />
 * ```
 */

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ExportButtonProps {
  /** Callback for PNG export */
  onExportPNG: () => void
  /** Callback for PDF export */
  onExportPDF: () => void
  /** Loading state */
  isExporting?: boolean
  /** Optional className */
  className?: string
  /** Button label */
  label?: string
}

/**
 * ExportButton Component
 */
export const ExportButton: React.FC<ExportButtonProps> = ({
  onExportPNG,
  onExportPDF,
  isExporting = false,
  className = '',
  label = 'Export',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={isExporting}
        className={`
          flex items-center gap-2
          px-4 py-2 sm:px-5 sm:py-2.5
          min-h-[44px]
          rounded-lg
          bg-white/10 backdrop-blur-sm
          hover:bg-white/15
          active:bg-white/20
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          border border-white/20
          focus:outline-none focus:ring-2 focus:ring-white/30
          touch-manipulation
        `}
        aria-label={`${label} chart. Press to open export format menu.`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {/* Icon */}
        {isExporting ? (
          <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-white/90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )}

        {/* Label */}
        <span className="text-sm font-medium text-white/90 hidden sm:inline">
          {isExporting ? 'Exporting...' : label}
        </span>

        {/* Dropdown Arrow */}
        {!isExporting && (
          <svg
            className={`w-4 h-4 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && !isExporting && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="
              absolute right-0 top-full mt-2
              w-48
              bg-gray-900/95 backdrop-blur-md
              border border-white/20
              rounded-lg
              shadow-xl shadow-black/50
              overflow-hidden
              z-50
            "
            role="menu"
            aria-label="Export format options"
          >
            {/* PNG Option */}
            <button
              onClick={() => {
                onExportPNG()
                setIsOpen(false)
              }}
              className="
                w-full flex items-center gap-3
                px-4 py-3
                min-h-[44px]
                text-left
                hover:bg-white/10
                active:bg-white/15
                transition-colors
                touch-manipulation
                focus:outline-none focus:bg-white/10
              "
              role="menuitem"
              aria-label="Export as PNG image"
            >
              <svg
                className="w-5 h-5 text-blue-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div className="flex-1">
                <div className="text-white font-medium text-sm">Export as PNG</div>
                <div className="text-white/60 text-xs">High-quality image</div>
              </div>
            </button>

            {/* PDF Option */}
            <button
              onClick={() => {
                onExportPDF()
                setIsOpen(false)
              }}
              className="
                w-full flex items-center gap-3
                px-4 py-3
                min-h-[44px]
                text-left
                hover:bg-white/10
                active:bg-white/15
                transition-colors
                touch-manipulation
                focus:outline-none focus:bg-white/10
                border-t border-white/10
              "
              role="menuitem"
              aria-label="Export as PDF document"
            >
              <svg
                className="w-5 h-5 text-red-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <div className="flex-1">
                <div className="text-white font-medium text-sm">Export as PDF</div>
                <div className="text-white/60 text-xs">Printable document</div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExportButton
