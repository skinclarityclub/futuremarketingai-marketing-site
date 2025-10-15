/**
 * Test Utilities
 *
 * Shared testing utilities and helpers for consistent test patterns across the codebase.
 *
 * @module test-utils
 */

import { ReactElement } from 'react'
import { render, RenderOptions, screen } from '@testing-library/react'
import { vi } from 'vitest'

/**
 * Custom render function that wraps components with common providers
 *
 * @param ui - The component to render
 * @param options - Render options
 * @returns Render result with custom utilities
 */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { ...options })
}

/**
 * Suppress console errors during tests
 * Useful for testing error boundaries and expected errors
 *
 * @returns Cleanup function to restore console.error
 */
export function suppressConsoleErrors() {
  const originalError = console.error
  console.error = vi.fn()

  return () => {
    console.error = originalError
  }
}

/**
 * Wait for an element to appear with a custom error message
 *
 * @param text - Text to find
 * @param options - Query options
 * @returns Found element
 */
export async function waitForElement(
  text: string | RegExp,
  options?: Parameters<typeof screen.findByText>[1]
) {
  return await screen.findByText(text, options, {
    timeout: 3000,
  })
}

/**
 * Wait for animation to complete
 * Useful for components with Framer Motion animations
 *
 * @param duration - Animation duration in ms (default: 300ms)
 */
export async function waitForAnimation(duration: number = 300) {
  await new Promise((resolve) => setTimeout(resolve, duration))
}

/**
 * Helper to get element by test id or role with better error messages
 */
export const queries = {
  /**
   * Get button by accessible name with fallback
   */
  getButton: (name: string | RegExp) => {
    try {
      return screen.getByRole('button', { name })
    } catch (error) {
      throw new Error(
        `Button with name "${name}" not found. Available buttons: ${screen
          .queryAllByRole('button')
          .map((el) => el.textContent)
          .join(', ')}`
      )
    }
  },

  /**
   * Get element with better error messaging
   */
  getByTextSafe: (text: string | RegExp) => {
    try {
      return screen.getByText(text)
    } catch (error) {
      throw new Error(`Element with text "${text}" not found in document.`)
    }
  },
}

/**
 * Mock data factory for consistent test data
 */
export const mockData = {
  /**
   * Create mock user event
   */
  createMockEvent: () => ({
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  }),

  /**
   * Create mock callback function with better tracking
   */
  createMockCallback: <T extends (...args: any[]) => any>() => {
    return vi.fn<T>()
  },
}

/**
 * Accessibility test helpers
 */
export const a11y = {
  /**
   * Check if element has proper ARIA attributes
   */
  hasProperARIA: (element: HTMLElement, expectedRole: string) => {
    const role = element.getAttribute('role')
    const hasTabIndex = element.hasAttribute('tabIndex')

    return {
      hasRole: role === expectedRole,
      isKeyboardAccessible: hasTabIndex,
      role,
    }
  },

  /**
   * Check if text is accessible to screen readers
   */
  isScreenReaderAccessible: (text: string) => {
    const byRole = screen.queryByRole('button', { name: new RegExp(text, 'i') })
    const byLabel = screen.queryByLabelText(new RegExp(text, 'i'))
    const byText = screen.queryByText(new RegExp(text, 'i'))

    return !!(byRole || byLabel || byText)
  },
}

/**
 * Re-export everything from @testing-library/react for convenience
 */
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
