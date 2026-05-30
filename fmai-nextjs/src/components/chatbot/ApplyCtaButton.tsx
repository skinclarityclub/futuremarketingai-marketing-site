'use client'

import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { Link } from '@/i18n/navigation'
import { useChatbotStore } from '@/stores/chatbotStore'

interface ApplyCtaButtonProps {
  children: ReactNode
  /** sm = compact card CTA, md = primary booking CTA. */
  size?: 'sm' | 'md'
  className?: string
  /** Show the trailing arrow (default true). */
  showArrow?: boolean
}

/**
 * The single application-gated CTA used across Clyde's tool cards and banners.
 * Mirrors CTAButton's `primary` visual style (the site-wide amber CTA) so the
 * chatbot matches the rest of the site instead of the old teal-to-amber gradient.
 * Renders a next-intl Link (so it navigates) AND closes the chat on click, so a
 * prospect lands on /apply with the widget out of the way and can sign up right
 * away. CTAButton can't do Link + onClick together, hence this small mirror —
 * the same pattern BookingCTA already uses for its onClick case.
 */
export function ApplyCtaButton({
  children,
  size = 'md',
  className,
  showArrow = true,
}: ApplyCtaButtonProps) {
  const close = useChatbotStore((s) => s.close)
  const sizeStyles = size === 'sm' ? 'px-4 py-2 text-xs' : 'px-4 py-3 text-sm'

  return (
    <Link
      href="/apply"
      onClick={() => close()}
      className={twMerge(
        'group flex w-full items-center justify-center gap-2 rounded-[var(--radius-btn)] bg-gradient-to-br from-[#F5A623] to-[#E8941A] font-semibold text-bg-deep transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(245,166,35,0.3)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system',
        sizeStyles,
        className
      )}
    >
      {children}
      {showArrow && (
        <ArrowRight
          className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
          aria-hidden
        />
      )}
    </Link>
  )
}

export default ApplyCtaButton
