/**
 * Bulk Actions Bar Component
 *
 * Action bar that appears when campaigns are selected,
 * enabling bulk operations.
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPause, FaPlay, FaCopy, FaDownload, FaDollarSign, FaTrash, FaTimes } from 'react-icons/fa'

interface BulkActionsBarProps {
  selectedCount: number
  onPauseSelected: () => void
  onResumeSelected: () => void
  onDuplicateSelected: () => void
  onExportSelected: () => void
  onAdjustBudget: () => void
  onDeleteSelected: () => void
  onClearSelection: () => void
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onPauseSelected,
  onResumeSelected,
  onDuplicateSelected,
  onExportSelected,
  onAdjustBudget,
  onDeleteSelected,
  onClearSelection,
}) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="px-8 py-4 rounded-2xl bg-bg-card/95 backdrop-blur-xl border-2 border-accent-primary/50 shadow-2xl shadow-accent-primary/20">
            <div className="flex items-center gap-6">
              {/* Selection Count */}
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-white font-bold">{selectedCount}</span>
                </motion.div>
                <span className="text-white font-semibold">
                  {selectedCount} campaign{selectedCount !== 1 ? 's' : ''} selected
                </span>
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-white/20" />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <BulkActionButton
                  icon={<FaPause />}
                  label="Pause"
                  onClick={onPauseSelected}
                  color="warning"
                />
                <BulkActionButton
                  icon={<FaPlay />}
                  label="Resume"
                  onClick={onResumeSelected}
                  color="success"
                />
                <BulkActionButton
                  icon={<FaCopy />}
                  label="Duplicate"
                  onClick={onDuplicateSelected}
                  color="primary"
                />
                <BulkActionButton
                  icon={<FaDollarSign />}
                  label="Budget"
                  onClick={onAdjustBudget}
                  color="secondary"
                />
                <BulkActionButton
                  icon={<FaDownload />}
                  label="Export"
                  onClick={onExportSelected}
                  color="primary"
                />
                <BulkActionButton
                  icon={<FaTrash />}
                  label="Delete"
                  onClick={onDeleteSelected}
                  color="error"
                />
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-white/20" />

              {/* Clear Selection */}
              <button
                onClick={onClearSelection}
                className="p-2 rounded-lg hover:text-white/70 hover:text-white transition-all duration-200"
                title="Clear selection"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface BulkActionButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}

const BulkActionButton: React.FC<BulkActionButtonProps> = ({ icon, label, onClick, color }) => {
  const colorClasses = {
    primary:
      'bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary border-accent-primary/50',
    secondary:
      'bg-accent-secondary/20 hover:bg-accent-secondary/30 text-accent-secondary border-accent-secondary/50',
    success: 'bg-success/20 hover:bg-success/30 text-success border-success/50',
    warning: 'bg-warning/20 hover:bg-warning/30 text-warning border-warning/50',
    error: 'bg-error/20 hover:bg-error/30 text-error border-error/50',
  }

  return (
    <motion.button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-xl border font-semibold text-sm
        transition-all duration-200 flex items-center gap-2
        ${colorClasses[color]}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  )
}

export default BulkActionsBar
