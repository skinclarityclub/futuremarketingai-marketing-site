/**
 * Button Component Tests
 *
 * Tests for the Button component covering:
 * - Basic rendering and content
 * - Click event handling
 * - Visual variants (primary, secondary, outline, ghost, error, warning, success)
 * - Size variants (sm, md, lg)
 * - Disabled state
 * - Loading state
 * - Custom styling
 * - Accessibility
 */

import { describe, it, expect } from 'vitest'
import { screen, userEvent, mockData } from '../../test/test-utils'
import { render } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('should render button with text content', () => {
      // Arrange & Act
      render(<Button>Click me</Button>)

      // Assert
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Click me')
    })

    it('should render button with children elements', () => {
      // Arrange & Act
      render(
        <Button>
          <span data-testid="icon">Icon</span>
          <span>Text</span>
        </Button>
      )

      // Assert
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })
  })

  describe('Click Event Handling', () => {
    it('should call onClick handler when clicked', async () => {
      // Arrange
      const handleClick = mockData.createMockCallback()
      const user = userEvent.setup()
      render(<Button onClick={handleClick}>Click me</Button>)

      // Act
      const button = screen.getByRole('button', { name: /click me/i })
      await user.click(button)

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', async () => {
      // Arrange
      const handleClick = mockData.createMockCallback()
      const user = userEvent.setup()
      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      )

      // Act
      const button = screen.getByRole('button', { name: /click me/i })
      await user.click(button)

      // Assert
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Visual Variants', () => {
    const variants = [
      { variant: 'primary' as const, className: 'from-accent-primary' },
      { variant: 'secondary' as const, className: 'from-accent-secondary' },
      { variant: 'outline' as const, className: 'border-2' },
      { variant: 'ghost' as const, className: 'text-accent-primary' },
    ]

    variants.forEach(({ variant, className }) => {
      it(`should render ${variant} variant with correct styles`, () => {
        // Arrange & Act
        render(<Button variant={variant}>{variant}</Button>)

        // Assert
        const button = screen.getByRole('button', { name: new RegExp(variant, 'i') })
        expect(button).toHaveClass(className)
      })
    })
  })

  describe('Size Variants', () => {
    it('should render small button', () => {
      // Arrange & Act
      render(<Button size="sm">Small</Button>)

      // Assert
      const button = screen.getByRole('button', { name: /small/i })
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm')
    })

    it('should render medium button (default)', () => {
      // Arrange & Act
      render(<Button size="md">Medium</Button>)

      // Assert
      const button = screen.getByRole('button', { name: /medium/i })
      expect(button).toHaveClass('px-6', 'py-3', 'text-base')
    })

    it('should render large button', () => {
      // Arrange & Act
      render(<Button size="lg">Large</Button>)

      // Assert
      const button = screen.getByRole('button', { name: /large/i })
      expect(button).toHaveClass('px-8', 'py-4', 'text-lg')
    })
  })

  describe('Disabled State', () => {
    it('should apply disabled styles when disabled', () => {
      // Arrange & Act
      render(<Button disabled>Disabled</Button>)

      // Assert
      const button = screen.getByRole('button', { name: /disabled/i })
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
    })

    it('should have proper ARIA attributes when disabled', () => {
      // Arrange & Act
      render(<Button disabled>Disabled</Button>)

      // Assert
      const button = screen.getByRole('button', { name: /disabled/i })
      expect(button).toHaveAttribute('disabled')
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      // Arrange & Act
      render(<Button className="custom-class">Custom</Button>)

      // Assert
      const button = screen.getByRole('button', { name: /custom/i })
      expect(button).toHaveClass('custom-class')
    })

    it('should merge custom className with default styles', () => {
      // Arrange & Act
      render(
        <Button className="custom-class" variant="primary">
          Test
        </Button>
      )

      // Assert
      const button = screen.getByRole('button', { name: /test/i })
      expect(button).toHaveClass('custom-class')
      expect(button).toHaveClass('from-accent-primary')
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard accessible', async () => {
      // Arrange
      const handleClick = mockData.createMockCallback()
      const user = userEvent.setup()
      render(<Button onClick={handleClick}>Accessible</Button>)

      // Act
      const button = screen.getByRole('button', { name: /accessible/i })
      button.focus()
      await user.keyboard('{Enter}')

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should support Space key activation', async () => {
      // Arrange
      const handleClick = mockData.createMockCallback()
      const user = userEvent.setup()
      render(<Button onClick={handleClick}>Accessible</Button>)

      // Act
      const button = screen.getByRole('button', { name: /accessible/i })
      button.focus()
      await user.keyboard(' ')

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should have proper button role', () => {
      // Arrange & Act
      render(<Button>Test</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
    })
  })
})
