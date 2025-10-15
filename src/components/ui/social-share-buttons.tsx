/**
 * Social Share Buttons Component
 * Source: social-share-buttons.tsx
 */

import React from 'react'
import { Facebook, Twitter, Linkedin, Mail, Share2 } from 'lucide-react'
import { Button } from './button'

interface SocialShareButtonsProps {
  url: string
  title: string
  description?: string
  className?: string
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  description = '',
  className = '',
}) => {
  const shareOnTwitter = () => {
    const text = encodeURIComponent(`${title}\n\n${description}`)
    const shareUrl = encodeURIComponent(url)
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
      '_blank',
      'width=550,height=420'
    )
  }

  const shareOnFacebook = () => {
    const shareUrl = encodeURIComponent(url)
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      '_blank',
      'width=550,height=420'
    )
  }

  const shareOnLinkedIn = () => {
    const shareUrl = encodeURIComponent(url)
    const shareTitle = encodeURIComponent(title)
    const shareDescription = encodeURIComponent(description)
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${shareTitle}&summary=${shareDescription}`,
      '_blank',
      'width=550,height=420'
    )
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(title)
    const body = encodeURIComponent(`${description}\n\n${url}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      // TODO: Add toast notification
      console.log('URL copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnTwitter}
        className="flex items-center gap-2"
      >
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Share on Twitter</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareOnFacebook}
        className="flex items-center gap-2"
      >
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Share on Facebook</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareOnLinkedIn}
        className="flex items-center gap-2"
      >
        <Linkedin className="h-4 w-4" />
        <span className="sr-only">Share on LinkedIn</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareViaEmail}
        className="flex items-center gap-2"
      >
        <Mail className="h-4 w-4" />
        <span className="sr-only">Share via Email</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        <span className="sr-only">Copy link</span>
      </Button>
    </div>
  )
}
