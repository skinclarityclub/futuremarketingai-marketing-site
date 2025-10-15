/**
 * Pipeline Stage Modal Component
 *
 * Modal popup showing detailed information about a pipeline stage and its items.
 * Similar to the Sphere's satellite info panels.
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PipelineStageData } from './PipelineStage'

interface PipelineStageModalProps {
  stage: PipelineStageData | null
  isOpen: boolean
  onClose: () => void
}

export const PipelineStageModal: React.FC<PipelineStageModalProps> = ({
  stage,
  isOpen,
  onClose,
}) => {
  if (!stage) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto pointer-events-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Modal Content */}
              <div
                className="relative p-8 rounded-3xl backdrop-blur-xl border-2 shadow-2xl"
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderColor: stage.color,
                  boxShadow: `0 0 60px ${stage.color}40, 0 20px 40px rgba(0,0,0,0.3)`,
                }}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all duration-300 group"
                >
                  <span className="text-white text-xl group-hover:rotate-90 transition-transform duration-300">
                    ×
                  </span>
                </button>

                {/* Header */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-white/10">
                  <div
                    className="text-5xl p-4 rounded-2xl"
                    style={{ backgroundColor: `${stage.color}20` }}
                  >
                    {stage.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-2">{stage.name}</h2>
                    <p className="text-white/70 mb-3">{stage.description}</p>
                    <div className="flex items-center gap-4">
                      <div
                        className="px-4 py-2 rounded-full font-semibold"
                        style={{
                          backgroundColor: `${stage.color}30`,
                          color: stage.color,
                        }}
                      >
                        {stage.count} items
                      </div>
                      <div className="px-4 py-2 rounded-full text-white/90 font-medium">
                        Status: {stage.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                {stage.items.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white/90 mb-4">
                      Content in this stage:
                    </h3>
                    {stage.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="p-4 rounded-xl hover:transition-all duration-300 border border-white/10 hover:border-white/20 group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-white font-semibold">{item.title}</h4>
                              <span
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                  backgroundColor: `${stage.color}20`,
                                  color: stage.color,
                                }}
                              >
                                {item.platform}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <span>⏱️</span>
                              <span>{item.timeInStage}</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            className="px-4 py-2 rounded-lg hover:text-white/90 text-sm font-medium transition-all duration-300 opacity-0 group-hover:opacity-100"
                            style={{
                              borderLeft: `2px solid ${stage.color}`,
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-30">{stage.icon}</div>
                    <p className="text-white/50">No items in this stage yet</p>
                  </div>
                )}

                {/* Footer Stats */}
                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-white/60 mb-1">Average Time</p>
                    <p className="text-xl font-bold text-white">
                      {stage.id === 'research'
                        ? '8 min'
                        : stage.id === 'creation'
                          ? '23 min'
                          : stage.id === 'review'
                            ? '1.2h'
                            : stage.id === 'approval'
                              ? '2.5h'
                              : stage.id === 'scheduling'
                                ? '5 min'
                                : stage.id === 'publishing'
                                  ? '2 min'
                                  : '24h'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white/60 mb-1">Success Rate</p>
                    <p className="text-xl font-bold" style={{ color: stage.color }}>
                      {stage.id === 'research'
                        ? '98%'
                        : stage.id === 'creation'
                          ? '95%'
                          : stage.id === 'review'
                            ? '92%'
                            : stage.id === 'approval'
                              ? '88%'
                              : stage.id === 'scheduling'
                                ? '99%'
                                : stage.id === 'publishing'
                                  ? '97%'
                                  : '100%'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white/60 mb-1">This Week</p>
                    <p className="text-xl font-bold text-success">
                      {stage.id === 'research'
                        ? '124'
                        : stage.id === 'creation'
                          ? '118'
                          : stage.id === 'review'
                            ? '95'
                            : stage.id === 'approval'
                              ? '87'
                              : stage.id === 'scheduling'
                                ? '156'
                                : stage.id === 'publishing'
                                  ? '148'
                                  : '142'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PipelineStageModal
