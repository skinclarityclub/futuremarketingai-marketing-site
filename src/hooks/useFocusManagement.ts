/**
 * Custom hook for managing focus in wizard/multi-step interfaces
 * Ensures proper focus management between steps and on mount
 */

import { useEffect, useRef } from 'react'

interface UseFocusManagementOptions {
  /**
   * Whether to focus the element on mount
   */
  focusOnMount?: boolean

  /**
   * Whether to restore focus when returning to this step
   */
  restoreFocus?: boolean

  /**
   * Delay before focusing (ms) - useful for animations
   */
  delay?: number
}

/**
 * Hook to manage focus on an element
 * @param options Configuration options
 * @returns Ref to attach to the element that should receive focus
 */
export function useFocusManagement<T extends HTMLElement = HTMLElement>(
  options: UseFocusManagementOptions = {}
) {
  const {
    focusOnMount = true,
    restoreFocus = true,
    delay = 150, // Default delay to allow animations to complete
  } = options

  const elementRef = useRef<T>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Store the currently focused element
    if (restoreFocus && document.activeElement instanceof HTMLElement) {
      previousFocusRef.current = document.activeElement
    }

    // Focus the target element after a delay
    if (focusOnMount && elementRef.current) {
      const timeoutId = setTimeout(() => {
        elementRef.current?.focus()
      }, delay)

      return () => clearTimeout(timeoutId)
    }

    return undefined
  }, [focusOnMount, restoreFocus, delay])

  return elementRef
}

/**
 * Hook to create a focus trap within a container
 * Useful for modals and dialogs
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(enabled: boolean = true) {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    if (!enabled || !containerRef.current) {
      return
    }

    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {
        return
      }

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    // Focus first element on mount
    firstElement?.focus()

    container.addEventListener('keydown', handleTabKey)
    return () => container.removeEventListener('keydown', handleTabKey)
  }, [enabled])

  return containerRef
}

export default useFocusManagement
