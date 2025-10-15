/**
 * IndustrySelector Component Tests
 *
 * Tests for the IndustrySelector modal covering:
 * - Industry options rendering and display
 * - User selection and callback handling
 * - Skip functionality (when enabled)
 * - Selected industry highlighting
 * - Modal open/closed states
 * - Accessibility and user interactions
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, userEvent, mockData } from '../../test/test-utils'
import { render } from '@testing-library/react'
import { IndustrySelector, INDUSTRIES } from './IndustrySelector'

describe('IndustrySelector', () => {
  // Mock callbacks for selection and closing
  let mockOnClose: ReturnType<typeof mockData.createMockCallback>
  let mockOnSelect: ReturnType<typeof mockData.createMockCallback>

  beforeEach(() => {
    // Reset mocks before each test for isolation
    mockOnClose = mockData.createMockCallback()
    mockOnSelect = mockData.createMockCallback()
  })

  describe('Industry Options Rendering', () => {
    it('should render all industry options', async () => {
      // Arrange & Act
      render(<IndustrySelector isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />)

      // Assert - Wait for animations and verify all industries are displayed
      await waitFor(() => {
        INDUSTRIES.forEach((industry) => {
          expect(screen.getByText(industry.name)).toBeInTheDocument()
        })
      })
    })

    it('should render all 10 industries with correct names', async () => {
      // Arrange & Act
      render(<IndustrySelector isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />)

      // Assert - Verify each industry is present
      await waitFor(() => {
        expect(screen.getByText('Technology & SaaS')).toBeInTheDocument()
        expect(screen.getByText('E-commerce & Retail')).toBeInTheDocument()
        expect(screen.getByText('Healthcare & Wellness')).toBeInTheDocument()
        expect(screen.getByText('Financial Services')).toBeInTheDocument()
        expect(screen.getByText('Real Estate')).toBeInTheDocument()
        expect(screen.getByText('Education & Training')).toBeInTheDocument()
        expect(screen.getByText('Hospitality & Tourism')).toBeInTheDocument()
        expect(screen.getByText('Professional Services')).toBeInTheDocument()
        expect(screen.getByText('Manufacturing')).toBeInTheDocument()
        expect(screen.getByText('Other')).toBeInTheDocument()
      })
    })
  })

  describe('Industry Selection', () => {
    it('should call onSelect and onClose when industry is clicked', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<IndustrySelector isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />)

      // Wait for first industry to render
      await waitFor(() => {
        expect(screen.getByText('Technology & SaaS')).toBeInTheDocument()
      })

      // Act - Click first industry
      await user.click(screen.getByText('Technology & SaaS'))

      // Assert - Verify callbacks were called with correct data
      expect(mockOnSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'technology',
          name: 'Technology & SaaS',
        })
      )
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should highlight selected industry', async () => {
      // Arrange
      const selectedIndustry = INDUSTRIES[0]

      // Act
      render(
        <IndustrySelector
          isOpen={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          selectedIndustry={selectedIndustry}
        />
      )

      // Assert - Check for ring class on selected card
      await waitFor(() => {
        const selectedCard = screen.getByText(selectedIndustry.name).closest('div.ring-2')
        expect(selectedCard).toBeInTheDocument()
        expect(selectedCard).toHaveClass('ring-accent-primary')
      })
    })
  })

  describe('Skip Functionality', () => {
    it('should show skip button when skippable is true', async () => {
      // Arrange & Act
      render(
        <IndustrySelector
          isOpen={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          skippable={true}
        />
      )

      // Assert - Verify skip button is present
      await waitFor(() => {
        expect(screen.getByText('common:industry_selector.skip')).toBeInTheDocument()
      })
    })

    it('should not show skip button when skippable is false', async () => {
      // Arrange & Act
      render(
        <IndustrySelector
          isOpen={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          skippable={false}
        />
      )

      // Wait for modal to be open
      await waitFor(() => {
        expect(screen.getByText('common:industry_selector.modal_title')).toBeInTheDocument()
      })

      // Assert - Verify skip button is not present
      expect(screen.queryByText('common:industry_selector.skip')).not.toBeInTheDocument()
    })

    it('should call onClose when skip button is clicked', async () => {
      // Arrange
      const user = userEvent.setup()
      render(
        <IndustrySelector
          isOpen={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
          skippable={true}
        />
      )

      // Wait for skip button
      await waitFor(() => {
        expect(screen.getByText('common:industry_selector.skip')).toBeInTheDocument()
      })

      // Act - Click skip button
      await user.click(screen.getByText('common:industry_selector.skip'))

      // Assert - Verify onClose was called
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Modal State', () => {
    it('should render modal with correct title', async () => {
      // Arrange & Act
      render(<IndustrySelector isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />)

      // Assert - Verify modal title is displayed
      await waitFor(() => {
        expect(screen.getByText('common:industry_selector.modal_title')).toBeInTheDocument()
      })
    })

    it('should not render when isOpen is false', () => {
      // Arrange & Act
      const { container } = render(
        <IndustrySelector isOpen={false} onClose={mockOnClose} onSelect={mockOnSelect} />
      )

      // Assert - Modal component renders nothing when closed (via AnimatePresence)
      expect(container.firstChild).toBeNull()
    })
  })
})
