import { motion } from 'framer-motion'
import { Calendar, ExternalLink } from 'lucide-react'
import { useState } from 'react'

const CALENDLY_URL = 'https://calendly.com/futuremarketingai/discovery'

export interface BookingCardData {
  action: string
  url: string
  reason?: string
}

export function BookingCard({ data }: { data: BookingCardData }) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const calendlyUrl = data?.url || CALENDLY_URL

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-system/20">
          <Calendar className="h-4 w-4 text-accent-system" />
        </div>
        <div>
          <p className="font-sans text-sm font-semibold text-text-primary">Schedule Your Call</p>
          {data?.reason && <p className="text-xs text-text-secondary">{data.reason}</p>}
        </div>
      </div>

      {/* Calendly Embed or Fallback */}
      {!iframeError ? (
        <div className="relative overflow-hidden rounded-xl border border-border-primary">
          {!iframeLoaded && (
            <div className="flex h-[420px] items-center justify-center bg-bg-elevated/50">
              <div className="animate-pulse text-xs text-text-secondary">Loading calendar...</div>
            </div>
          )}
          <iframe
            src={`${calendlyUrl}?hide_gdpr_banner=1&background_color=0a0e27&text_color=e0e0e0&primary_color=00d4ff`}
            width="100%"
            height="420"
            frameBorder="0"
            title="Book a discovery call"
            className={iframeLoaded ? 'block' : 'hidden'}
            onLoad={() => setIframeLoaded(true)}
            onError={() => setIframeError(true)}
          />
        </div>
      ) : (
        <a
          href={calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-system to-accent-secondary px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <ExternalLink className="h-4 w-4" />
          Open Calendar
        </a>
      )}
    </motion.div>
  )
}

export default BookingCard
