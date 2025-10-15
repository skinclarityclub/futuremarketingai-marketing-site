/**
 * Mock Data for AI Ad Builder
 */

import type {
  SampleImage,
  VideoTemplate,
  VirtualPresenter,
  VoiceOption,
  ExportFormat,
} from './types'

// Sample images voor quick testing
export const sampleImages: SampleImage[] = [
  {
    id: 'sample-1',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    name: 'Product Watch',
    category: 'product',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
  },
  {
    id: 'sample-2',
    url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
    name: 'Sunglasses',
    category: 'product',
    thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200',
  },
  {
    id: 'sample-3',
    url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800',
    name: 'Coffee Lifestyle',
    category: 'lifestyle',
    thumbnail: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200',
  },
  {
    id: 'sample-4',
    url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
    name: 'Pancakes',
    category: 'food',
    thumbnail: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200',
  },
  {
    id: 'sample-5',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
    name: 'Professional Woman',
    category: 'person',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
  },
  {
    id: 'sample-6',
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    name: 'Sneakers',
    category: 'product',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200',
  },
]

// Video templates
export const videoTemplates: VideoTemplate[] = [
  {
    id: 'template-1',
    name: 'Dynamic Zoom',
    thumbnail: 'https://picsum.photos/seed/template1/400/300',
    duration: 15,
    style: 'dynamic',
    useCase: 'product',
    aspectRatio: '9:16',
    platforms: ['instagram', 'tiktok'],
  },
  {
    id: 'template-2',
    name: 'Minimal Fade',
    thumbnail: 'https://picsum.photos/seed/template2/400/300',
    duration: 10,
    style: 'minimal',
    useCase: 'announcement',
    aspectRatio: '1:1',
    platforms: ['instagram', 'facebook'],
  },
  {
    id: 'template-3',
    name: 'Bold Impact',
    thumbnail: 'https://picsum.photos/seed/template3/400/300',
    duration: 20,
    style: 'bold',
    useCase: 'product',
    aspectRatio: '16:9',
    platforms: ['youtube', 'facebook'],
  },
  {
    id: 'template-4',
    name: 'Elegant Slideshow',
    thumbnail: 'https://picsum.photos/seed/template4/400/300',
    duration: 30,
    style: 'elegant',
    useCase: 'testimonial',
    aspectRatio: '4:5',
    platforms: ['instagram', 'facebook'],
  },
  {
    id: 'template-5',
    name: 'Playful Bounce',
    thumbnail: 'https://picsum.photos/seed/template5/400/300',
    duration: 12,
    style: 'playful',
    useCase: 'tutorial',
    aspectRatio: '9:16',
    platforms: ['tiktok', 'instagram'],
  },
]

// Virtual presenters (Nano Banana style)
export const virtualPresenters: VirtualPresenter[] = [
  {
    id: 'presenter-1',
    name: 'Sarah',
    avatar: 'https://i.pravatar.cc/300?img=47',
    gender: 'female',
    age: 'young',
    style: 'professional',
    voicePreview: '/audio/sarah-preview.mp3',
  },
  {
    id: 'presenter-2',
    name: 'Marcus',
    avatar: 'https://i.pravatar.cc/300?img=12',
    gender: 'male',
    age: 'middle',
    style: 'friendly',
    voicePreview: '/audio/marcus-preview.mp3',
  },
  {
    id: 'presenter-3',
    name: 'Emma',
    avatar: 'https://i.pravatar.cc/300?img=45',
    gender: 'female',
    age: 'young',
    style: 'energetic',
    voicePreview: '/audio/emma-preview.mp3',
  },
  {
    id: 'presenter-4',
    name: 'David',
    avatar: 'https://i.pravatar.cc/300?img=33',
    gender: 'male',
    age: 'senior',
    style: 'professional',
    voicePreview: '/audio/david-preview.mp3',
  },
  {
    id: 'presenter-5',
    name: 'Maya',
    avatar: 'https://i.pravatar.cc/300?img=20',
    gender: 'female',
    age: 'middle',
    style: 'casual',
    voicePreview: '/audio/maya-preview.mp3',
  },
]

// Voice options
export const voiceOptions: VoiceOption[] = [
  {
    id: 'voice-1',
    name: 'American Female',
    language: 'English',
    accent: 'American',
    gender: 'female',
    sampleUrl: '/audio/voice-us-female.mp3',
  },
  {
    id: 'voice-2',
    name: 'British Male',
    language: 'English',
    accent: 'British',
    gender: 'male',
    sampleUrl: '/audio/voice-uk-male.mp3',
  },
  {
    id: 'voice-3',
    name: 'Australian Female',
    language: 'English',
    accent: 'Australian',
    gender: 'female',
    sampleUrl: '/audio/voice-au-female.mp3',
  },
]

// Export formats
export const exportFormats: ExportFormat[] = [
  {
    id: 'insta-story',
    name: 'Instagram Story',
    platform: 'instagram',
    resolution: '1080x1920',
    aspectRatio: '9:16',
    fileType: 'MP4',
  },
  {
    id: 'tiktok-feed',
    name: 'TikTok Feed',
    platform: 'tiktok',
    resolution: '1080x1920',
    aspectRatio: '9:16',
    fileType: 'MP4',
  },
  {
    id: 'youtube-hd',
    name: 'YouTube HD',
    platform: 'youtube',
    resolution: '1920x1080',
    aspectRatio: '16:9',
    fileType: 'MP4',
  },
  {
    id: 'facebook-feed',
    name: 'Facebook Feed',
    platform: 'facebook',
    resolution: '1080x1080',
    aspectRatio: '1:1',
    fileType: 'MP4',
  },
]
