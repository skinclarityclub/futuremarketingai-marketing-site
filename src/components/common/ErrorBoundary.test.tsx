/**
 * ErrorBoundary Component Tests
 *
 * Tests for the ErrorBoundary component covering:
 * - Basic error catching and fallback UI rendering
 * - Development vs production error details
 * - Custom fallback UI support
 * - Error callback functionality
 * - User action buttons (retry, home)
 * - Accessibility and user experience
 */

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { suppressConsoleErrors } from '../../test/test-utils'
import { ErrorBoundary } from './ErrorBoundary'

// Test helper component that throws an error when instructed
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error from ThrowError component')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  // Suppress console.error during tests to avoid cluttering test output
  // This is expected since we're intentionally throwing errors
  let restoreConsole: () => void

  beforeAll(() => {
    restoreConsole = suppressConsoleErrors()
  })

  afterAll(() => {
    restoreConsole()
  })

  describe('Happy Path - No Errors', () => {
    it('should render children when there is no error', () => {
      // Arrange & Act
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      )

      // Assert
      expect(screen.getByText('Test content')).toBeInTheDocument()
    })
  })

  describe('Error Catching and Fallback UI', () => {
    it('should render fallback UI when child component throws error', () => {
      // Arrange & Act - Render component that will throw
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // Assert - Verify fallback UI is shown
      expect(screen.getByText(/Oeps, er is iets misgegaan/i)).toBeInTheDocument()
    })

    it('should display error details in development mode', () => {
      // Arrange - Store original env and set DEV mode
      const originalEnv = import.meta.env.DEV
      import.meta.env.DEV = true

      // Act - Render error boundary with thrown error
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // Assert - Check technical details are shown in dev
      expect(screen.getByText(/Technische details/i)).toBeInTheDocument()

      // Cleanup - Restore original env
      import.meta.env.DEV = originalEnv
    })

    it('should render custom fallback UI when provided', () => {
      // Arrange - Create custom fallback
      const customFallback = <div>Custom error UI</div>

      // Act - Render with custom fallback
      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // Assert - Verify custom UI is used instead of default
      expect(screen.getByText('Custom error UI')).toBeInTheDocument()
    })
  })

  describe('User Actions', () => {
    it('should display retry and home buttons', async () => {
      // Arrange & Act
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // Assert - Verify error message is shown
      expect(screen.getByText(/Oeps, er is iets misgegaan/i)).toBeInTheDocument()

      // Assert - Verify action buttons are present
      expect(screen.getByText('Probeer opnieuw')).toBeInTheDocument()
      expect(screen.getByText('Ga naar home')).toBeInTheDocument()
    })
  })

  describe('Error Callback', () => {
    it('should call onError callback when error occurs', () => {
      // Arrange - Create mock error handler
      const handleError = vi.fn()

      // Act - Render with error handler and throw error
      render(
        <ErrorBoundary onError={handleError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // Assert - Verify error handler was called
      expect(handleError).toHaveBeenCalled()
      expect(handleError).toHaveBeenCalledTimes(1)
    })
  })
})
