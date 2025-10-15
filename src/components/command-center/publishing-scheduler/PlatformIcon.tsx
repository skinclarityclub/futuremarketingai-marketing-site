import React from 'react'
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa6'
import type { PlatformType } from '../../../types/scheduler'

interface PlatformIconProps {
  platform: PlatformType
  className?: string
  size?: number
}

const PLATFORM_ICON_MAP = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
  linkedin: FaLinkedinIn,
  twitter: FaXTwitter,
  tiktok: FaTiktok,
  youtube: FaYoutube,
}

const PLATFORM_COLORS = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  twitter: '#1DA1F2',
  tiktok: '#000000',
  youtube: '#FF0000',
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, className = '', size }) => {
  const IconComponent = PLATFORM_ICON_MAP[platform]
  const color = PLATFORM_COLORS[platform]

  return <IconComponent className={className} style={{ color, width: size, height: size }} />
}

export const getPlatformIcon = (platform: PlatformType): React.ReactElement => {
  return <PlatformIcon platform={platform} />
}
