/**
 * Ad Builder Types
 * Types for the AI-powered ad creation workflow
 */

export type AdCreationStep = 1 | 2 | 3 | 4 | 5

export interface ImageFile {
  id: string
  name: string
  url: string
  type: string
  size: number // in bytes
  dimensions: { width: number; height: number }
}

export interface UploadedImage {
  id: string
  file: File | null
  url: string
  name: string
  size: number
  type: string
  width?: number
  height?: number
  isSample?: boolean
}

export interface Enhancement {
  id: 'removeBackground' | 'upscale' | 'colorCorrection' | 'smartCrop'
  name: string
  description: string
  icon: string // FaIcon name
  processingTime: number // in ms
  applied: boolean
}

export interface SampleImage {
  id: string
  url: string
  name: string
  category: 'product' | 'person' | 'lifestyle' | 'food'
  thumbnail: string
}

export interface AIEnhancement {
  id: string
  name: string
  description: string
  icon: string
  processing: boolean
  applied: boolean
  processingTime: number // in milliseconds
}

export interface VideoTemplate {
  id: string
  name: string
  thumbnail: string
  duration: number // in seconds
  style: 'dynamic' | 'minimal' | 'elegant' | 'bold' | 'playful'
  useCase: 'product' | 'announcement' | 'testimonial' | 'tutorial'
  aspectRatio: '1:1' | '9:16' | '16:9' | '4:5'
  platforms: Array<'instagram' | 'facebook' | 'tiktok' | 'youtube'>
}

export interface VirtualPresenter {
  id: string
  name: string
  avatar: string
  gender: 'male' | 'female' | 'neutral'
  age: 'young' | 'middle' | 'senior'
  style: 'professional' | 'casual' | 'energetic' | 'friendly'
  voicePreview: string
}

export interface VoiceOption {
  id: string
  name: string
  language: string
  accent: string
  gender: 'male' | 'female'
  sampleUrl: string
}

export interface ExportFormat {
  id: string
  name: string
  platform: 'instagram' | 'facebook' | 'tiktok' | 'youtube'
  resolution: string
  aspectRatio: string
  fileType: string
}

export interface AdBuilderState {
  currentStep: AdCreationStep
  uploadedImage: UploadedImage | null
  selectedEnhancements: string[]
  enhancedImageUrl: string | null
  selectedTemplate: VideoTemplate | null
  selectedPresenter: VirtualPresenter | null
  selectedVoice: VoiceOption | null
  script: string
  presenterPosition: { x: number; y: number }
  exportSettings: ExportFormat | null
  isProcessing: boolean
  processingProgress: number
}
