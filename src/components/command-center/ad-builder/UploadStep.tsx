/**
 * Upload Step - First step of AI Ad Builder
 * Drag & drop image upload with sample images
 */

import React, { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  FaCloudUploadAlt as Upload,
  FaCheckCircle as CheckCircle,
  FaImage as Image,
  FaTimes as X,
} from 'react-icons/fa'
import { sampleImages } from './mockData'
import type { ImageFile } from './types'

interface UploadStepProps {
  previewImage: ImageFile | null
  onFileSelect: (file: ImageFile | null) => void
}

export const UploadStep: React.FC<UploadStepProps> = ({
  previewImage: uploadedImage,
  onFileSelect,
}) => {
  const { t } = useTranslation(['adbuilder'])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      return t('adbuilder:upload.errors.invalid_type')
    }

    if (file.size > maxSize) {
      return t('adbuilder:upload.errors.file_too_large')
    }

    return null
  }

  const processFile = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new window.Image()
      img.src = e.target?.result as string

      img.onload = () => {
        const imageFile: ImageFile = {
          id: `upload-${Date.now()}`,
          name: file.name,
          url: e.target?.result as string,
          type: file.type,
          size: file.size,
          dimensions: { width: img.width, height: img.height },
        }
        onFileSelect(imageFile)
      }
    }

    reader.readAsDataURL(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      processFile(files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const handleSampleSelect = (sample: any) => {
    const imageFile: ImageFile = {
      id: sample.id,
      name: sample.name,
      url: sample.url,
      type: 'image/jpeg',
      size: 0,
      dimensions: { width: 800, height: 600 },
    }
    onFileSelect(imageFile)
    setError(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-3">{t('adbuilder:upload.header.title')}</h2>
        <p className="text-white/60 text-lg">{t('adbuilder:upload.header.subtitle')}</p>
      </div>

      {/* Upload Area or Preview */}
      <AnimatePresence mode="wait">
        {!uploadedImage ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative rounded-2xl border-2 border-dashed transition-all duration-300
                ${
                  isDragging
                    ? 'border-accent-primary bg-accent-primary/10 scale-105'
                    : 'border-white/20 hover:border-accent-primary/50'
                }
                p-12 text-center cursor-pointer
              `}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileInput}
              />

              <label htmlFor="file-upload" className="cursor-pointer block">
                <motion.div
                  animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <Upload className="w-20 h-20 mx-auto text-accent-primary" />
                  <div className="space-y-2">
                    <p className="text-2xl font-semibold text-white">
                      {isDragging
                        ? t('adbuilder:upload.dropzone.dragging')
                        : t('adbuilder:upload.dropzone.idle')}
                    </p>
                    <p className="text-white/60">
                      {t('adbuilder:upload.dropzone.or')}{' '}
                      <span className="text-accent-primary font-semibold hover:text-accent-secondary transition-colors">
                        {t('adbuilder:upload.dropzone.browse')}
                      </span>
                    </p>
                    <p className="text-sm text-white/40">
                      {t('adbuilder:upload.dropzone.formats')}
                    </p>
                  </div>
                </motion.div>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Success Badge */}
            <div className="absolute top-4 left-4 z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/20 border border-success"
              >
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-success font-semibold">
                  {t('adbuilder:upload.preview.uploaded_badge')}
                </span>
              </motion.div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onFileSelect(null)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Preview */}
            <div className="p-8">
              <img
                src={uploadedImage.url}
                alt={uploadedImage.name}
                className="w-full h-auto max-h-96 object-contain rounded-xl mx-auto"
              />
            </div>

            {/* Image Info */}
            <div className="px-8 pb-8 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">{uploadedImage.name}</span>
                {uploadedImage.dimensions && (
                  <span className="text-white/40">
                    {uploadedImage.dimensions.width} × {uploadedImage.dimensions.height}px
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      {!uploadedImage && (
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px" />
          <span className="text-white/40 text-sm font-medium">
            {t('adbuilder:upload.samples.divider')}
          </span>
          <div className="flex-1 h-px" />
        </div>
      )}

      {/* Sample Images Grid */}
      {!uploadedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sampleImages.map((sample) => (
              <motion.button
                key={sample.id}
                onClick={() => handleSampleSelect(sample)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-accent-primary transition-all"
              >
                <img
                  src={sample.thumbnail}
                  alt={sample.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                  <div className="flex items-center gap-2 text-white text-sm font-medium">
                    <Image className="w-4 h-4" />
                    <span>{sample.name}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
