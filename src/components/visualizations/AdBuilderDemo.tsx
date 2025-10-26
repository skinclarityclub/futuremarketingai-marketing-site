import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * AdBuilderDemo - Product photo to platform-specific ads transformation
 *
 * Shows a demo of the Ad Builder with:
 * - Before: Simple product photo upload
 * - After: 3 platform-specific ad variants (Instagram, Facebook, TikTok)
 * - Performance metrics per variant
 * - Smooth transition animation
 */

export interface AdBuilderDemoProps {
  productImage?: string
  showVariants?: boolean
}

interface AdVariantProps {
  platform: string
  headline: string
  cta: string
  metrics: { ctr: number; cpc: number }
  color: string
}

const AdVariant: React.FC<AdVariantProps> = ({ platform, headline, cta, metrics, color }) => {
  return (
    <motion.div
      className="ad-variant bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Platform Badge */}
      <div
        className={`${color} text-white px-3 py-2 text-sm font-bold flex items-center justify-between`}
      >
        <span>{platform}</span>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">AI Generated</span>
      </div>

      {/* Ad Preview */}
      <div className="p-4">
        {/* Product Image Placeholder */}
        <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-2 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm">Product Photo</span>
            </div>
          </div>
        </div>

        {/* Ad Copy */}
        <div className="mb-3">
          <h4 className="font-bold text-gray-200 mb-2">{headline}</h4>
          <p className="text-sm text-gray-400 mb-3">
            Premium quality at the best price. Limited time offer!
          </p>

          {/* CTA Button */}
          <button
            className={`w-full ${color} text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity`}
          >
            {cta}
          </button>
        </div>

        {/* Metrics */}
        <div className="flex gap-4 pt-3 border-t border-gray-700">
          <div className="flex-1 text-center">
            <div className="text-xs text-gray-400 mb-1">CTR</div>
            <div className="text-lg font-bold text-success">{metrics.ctr}%</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-xs text-gray-400 mb-1">CPC</div>
            <div className="text-lg font-bold text-accent-primary">€{metrics.cpc}</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-xs text-gray-400 mb-1">ROI</div>
            <div className="text-lg font-bold text-accent-secondary">
              {((metrics.ctr / metrics.cpc) * 10).toFixed(0)}x
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const AdBuilderDemo: React.FC<AdBuilderDemoProps> = () => {
  const [activeStep, setActiveStep] = useState<'upload' | 'generated'>('upload')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setActiveStep('generated')
    }, 2000) // 2 second generation animation
  }

  const handleReset = () => {
    setActiveStep('upload')
  }

  return (
    <div className="ad-builder-demo">
      <AnimatePresence mode="wait">
        {activeStep === 'upload' ? (
          /* Upload Stage */
          <motion.div
            key="upload"
            className="upload-stage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Upload Area */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-dashed border-gray-600 hover:border-accent-primary transition-colors">
              <div className="text-center">
                {/* Upload Icon */}
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent-primary/10 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg
                    className="w-10 h-10 text-accent-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </motion.div>

                <h3 className="text-2xl font-bold gradient-text mb-2">Upload Product Photo</h3>
                <p className="text-gray-400 mb-6">
                  Upload één productfoto en genereer automatisch 3-5 platform-geoptimaliseerde
                  advertenties
                </p>

                {/* Sample Product Image */}
                <div className="max-w-sm mx-auto mb-6">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <svg
                        className="w-24 h-24 mx-auto mb-3 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm">Your Product Image</span>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <motion.button
                  onClick={handleGenerate}
                  className="px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-accent-primary/30 transition-all flex items-center gap-3 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <span>Generating Ads...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>Generate Platform Ads →</span>
                    </>
                  )}
                </motion.button>

                {/* Info Badges */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  <div className="px-3 py-1 bg-success/10 text-success text-sm rounded-full">
                    ⚡ 5 variants in 10 seconds
                  </div>
                  <div className="px-3 py-1 bg-accent-primary/10 text-accent-primary text-sm rounded-full">
                    🎯 87% prediction accuracy
                  </div>
                  <div className="px-3 py-1 bg-accent-secondary/10 text-accent-secondary text-sm rounded-full">
                    💰 €2.4K saved/month
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Generated Variants Stage */
          <motion.div
            key="generated"
            className="variants-stage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">3 Platform Ads Generated!</span>
              </motion.div>
              <h3 className="text-2xl font-bold gradient-text mb-2">Platform-Optimized Variants</h3>
              <p className="text-gray-400">
                AI analyzed your product and created these platform-specific ads with predicted
                performance
              </p>
            </div>

            {/* Variants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <AdVariant
                platform="Instagram"
                headline="Shop the Look ✨"
                cta="Shop Now"
                metrics={{ ctr: 4.2, cpc: 0.18 }}
                color="bg-gradient-to-r from-purple-500 to-pink-500"
              />
              <AdVariant
                platform="Facebook"
                headline="Limited Offer 🔥"
                cta="Learn More"
                metrics={{ ctr: 3.8, cpc: 0.22 }}
                color="bg-blue-600"
              />
              <AdVariant
                platform="TikTok"
                headline="Trending Now 🚀"
                cta="Get It"
                metrics={{ ctr: 5.1, cpc: 0.15 }}
                color="bg-black"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-800 text-gray-200 font-semibold rounded-xl hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Try Another Photo
              </motion.button>
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-primary/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Pre-Testing →
              </motion.button>
            </div>

            {/* Winner Indicator */}
            <motion.div
              className="mt-6 p-4 bg-success/10 border border-success/30 rounded-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-success">🏆 TikTok Predicted Winner</div>
                  <div className="text-sm text-gray-400">
                    5.1% CTR + €0.15 CPC = Best ROI potential (+34x multiplier)
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdBuilderDemo
