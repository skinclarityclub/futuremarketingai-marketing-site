import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaFileUpload, FaCheckCircle, FaDownload, FaMagic } from 'react-icons/fa'
import { GlassCard } from '../../common'

export const BulkScheduler: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  const handleUpload = () => {
    setIsProcessing(true)
    // Simulate upload processing
    setTimeout(() => {
      setIsProcessing(false)
      setUploadComplete(true)
    }, 2000)
  }

  const mockResults = {
    totalUploaded: 45,
    scheduled: 42,
    failed: 3,
    platforms: {
      instagram: 15,
      facebook: 12,
      linkedin: 8,
      twitter: 7,
    },
  }

  return (
    <GlassCard className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
            <FaFileUpload className="text-indigo-400" />
            Bulk Scheduler
          </h3>
          <p className="text-white/60">
            Upload a CSV file to schedule multiple posts at once with AI-powered optimization
          </p>
        </div>

        {!uploadComplete ? (
          <>
            {/* Upload Zone */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative border-2 border-dashed border-white/20 hover:border-indigo-500/50 rounded-xl p-12 text-center cursor-pointer hover:transition-all"
            >
              <input
                type="file"
                accept=".csv"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleUpload}
              />

              <AnimatePresence mode="wait">
                {!isProcessing ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <FaFileUpload className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-2">
                      Drop your CSV file here
                    </h4>
                    <p className="text-white/60 mb-4">or click to browse</p>
                    <p className="text-sm text-white/40">
                      Supported format: CSV with columns (title, content, platform, date, time)
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <h4 className="text-xl font-semibold text-white mb-2">Processing...</h4>
                    <p className="text-white/60">Analyzing and scheduling your content</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Template Download */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-white/10">
              <div>
                <h4 className="text-white font-semibold mb-1">Need a template?</h4>
                <p className="text-sm text-white/60">
                  Download our CSV template to get started quickly
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 hover:bg-white/10 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaDownload />
                <span>Download Template</span>
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <FaMagic className="w-6 h-6 text-indigo-400 mb-2" />
                <h4 className="text-white font-semibold mb-1">AI Auto-Schedule</h4>
                <p className="text-sm text-white/60">
                  Automatically optimize posting times for each platform
                </p>
              </div>
              <div className="p-4 bg-violet-500/10 rounded-lg border border-violet-500/20">
                <FaCheckCircle className="w-6 h-6 text-violet-400 mb-2" />
                <h4 className="text-white font-semibold mb-1">Platform Balancing</h4>
                <p className="text-sm text-white/60">
                  Evenly distribute content across all your platforms
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Upload Results */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Success Header */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
              >
                <FaCheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              </motion.div>
              <h4 className="text-2xl font-bold text-white mb-2">Upload Successful!</h4>
              <p className="text-white/60">
                Your content has been scheduled across multiple platforms
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border border-white/10 text-center">
                <div className="text-3xl font-bold text-indigo-400 mb-1">
                  {mockResults.totalUploaded}
                </div>
                <div className="text-sm text-white/60">Total Uploaded</div>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {mockResults.scheduled}
                </div>
                <div className="text-sm text-white/60">Scheduled</div>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 text-center">
                <div className="text-3xl font-bold text-red-400 mb-1">{mockResults.failed}</div>
                <div className="text-sm text-white/60">Failed</div>
              </div>
              <div className="p-4 bg-violet-500/10 rounded-lg border border-violet-500/20 text-center">
                <div className="text-3xl font-bold text-violet-400 mb-1">4</div>
                <div className="text-sm text-white/60">Platforms</div>
              </div>
            </div>

            {/* Platform Distribution */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Platform Distribution</h4>
              {Object.entries(mockResults.platforms).map(([platform, count], index) => (
                <motion.div
                  key={platform}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-24 text-white/80 capitalize">{platform}</div>
                  <div className="flex-1 h-8 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / mockResults.scheduled) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-end pr-3"
                    >
                      <span className="text-white text-sm font-semibold">{count}</span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUploadComplete(false)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-semibold"
              >
                Upload Another File
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-3 hover:bg-white/10 text-white rounded-lg font-semibold transition-colors"
              >
                View Calendar
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </GlassCard>
  )
}
