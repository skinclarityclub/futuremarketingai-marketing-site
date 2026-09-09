'use client'

import { LogoSynapse } from '@/components/brand/logos/LogoSynapse'

interface FloatingButtonProps {
  onClick: () => void
  hasUnread?: boolean
  isOpen?: boolean
}

/**
 * Post-mount Clyde trigger rendered inside ChatWidget when the chat is
 * minimized. Matches ClydePresence so the identity stays consistent
 * before and after first interaction: same sparkle mark + "Clyde"
 * wordmark in a pill, expanding to "Clyde · nu online" on hover.
 *
 * While the panel is open the trigger renders nothing: the panel header
 * carries its own close button, and the old circular X that stayed on
 * screen sat exactly on top of the composer's send button (measured on
 * desktop, tablet and phone). One close control, in the chrome it closes.
 */
export function FloatingButton({
  onClick,
  hasUnread = false,
  isOpen = false,
}: FloatingButtonProps) {
  if (isOpen) return null

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open chat met Clyde"
      className="clyde-fab group fixed right-6 fab-rest z-[61] inline-flex items-center gap-2 rounded-full border border-accent-system/40 bg-bg-elevated/95 py-2.5 pl-3 pr-4 text-text-primary backdrop-blur-md outline-none transition-[box-shadow,transform,bottom] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-system"
      style={{ boxShadow: 'var(--shadow-glow)' }}
    >
      <LogoSynapse size={22} ariaLabel="" />
      <span className="font-display text-sm font-semibold tracking-tight">Clyde</span>
      <span className="clyde-status overflow-hidden whitespace-nowrap text-sm text-text-secondary" data-visible="hover">
        <span className="clyde-status-inner">
          <span className="mx-1.5 text-text-faint">·</span>
          nu online
        </span>
      </span>
      {hasUnread && (
        <span
          aria-hidden="true"
          className="relative ml-1 flex h-2 w-2 items-center justify-center rounded-full bg-error"
        >
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-error opacity-60" />
        </span>
      )}
    </button>
  )
}

export default FloatingButton
