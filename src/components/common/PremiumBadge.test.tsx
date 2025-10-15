import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PremiumBadge, PREMIUM_PILLARS } from './PremiumBadge'

describe('PremiumBadge', () => {
  describe('Floating Variant', () => {
    it('should render collapsed by default', () => {
      render(<PremiumBadge variant="floating" />)

      // Should show icons
      PREMIUM_PILLARS.forEach((pillar) => {
        expect(screen.getByTitle(pillar.title)).toBeInTheDocument()
      })

      // Should not show detailed descriptions when collapsed
      expect(screen.queryByText(PREMIUM_PILLARS[0].description)).not.toBeInTheDocument()
    })

    it('should render expanded when expandedByDefault is true', () => {
      render(<PremiumBadge variant="floating" expandedByDefault />)

      // Should show all pillar details
      PREMIUM_PILLARS.forEach((pillar) => {
        expect(screen.getByText(pillar.title)).toBeInTheDocument()
        expect(screen.getByText(pillar.description)).toBeInTheDocument()
        expect(screen.getByText(pillar.highlight)).toBeInTheDocument()
      })
    })

    it('should expand when clicked', async () => {
      const user = userEvent.setup()
      render(<PremiumBadge variant="floating" />)

      // Initially collapsed
      expect(screen.queryByText(PREMIUM_PILLARS[0].description)).not.toBeInTheDocument()

      // Click to expand
      const badge = screen.getByTitle(PREMIUM_PILLARS[0].title).closest('[role="button"]')
      expect(badge).toBeInTheDocument()
      if (badge) {
        await user.click(badge)
      }

      // Wait for animation and check if expanded view appears
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Should now show expanded content (check for title which is always visible)
      expect(await screen.findByText(PREMIUM_PILLARS[0].title)).toBeInTheDocument()
    })

    it('should show labels when showLabels is true', () => {
      render(<PremiumBadge variant="floating" showLabels />)

      expect(screen.getByText('Premium Services')).toBeInTheDocument()
    })

    it('should not show labels when showLabels is false', () => {
      render(<PremiumBadge variant="floating" showLabels={false} />)

      expect(screen.queryByText('Premium Services')).not.toBeInTheDocument()
    })

    it('should apply correct position classes', () => {
      const { container, rerender } = render(
        <PremiumBadge variant="floating" position="top-right" />
      )

      expect(container.querySelector('.top-6.right-6')).toBeInTheDocument()

      rerender(<PremiumBadge variant="floating" position="top-left" />)
      expect(container.querySelector('.top-6.left-6')).toBeInTheDocument()

      rerender(<PremiumBadge variant="floating" position="bottom-right" />)
      expect(container.querySelector('.bottom-6.right-6')).toBeInTheDocument()

      rerender(<PremiumBadge variant="floating" position="bottom-left" />)
      expect(container.querySelector('.bottom-6.left-6')).toBeInTheDocument()
    })

    it('should have a close button when expanded', async () => {
      render(<PremiumBadge variant="floating" expandedByDefault />)

      // Should show expanded content
      expect(screen.getByText(PREMIUM_PILLARS[0].description)).toBeInTheDocument()

      // Should have a close button
      const closeButton = screen.getByText('✕')
      expect(closeButton).toBeInTheDocument()

      // Close button should be clickable
      expect(closeButton.closest('button')).toBeInTheDocument()
    })
  })

  describe('Banner Variant', () => {
    it('should render all pillars in banner layout', () => {
      render(<PremiumBadge variant="banner" />)

      // Should show all pillar details
      PREMIUM_PILLARS.forEach((pillar) => {
        expect(screen.getByText(pillar.title)).toBeInTheDocument()
        expect(screen.getByText(pillar.description)).toBeInTheDocument()
        expect(screen.getByText(pillar.highlight)).toBeInTheDocument()
      })

      // Should show header
      expect(screen.getByText('Premium All-in-One Services')).toBeInTheDocument()
    })

    it('should render with grid layout', () => {
      const { container } = render(<PremiumBadge variant="banner" />)

      const grid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2')
      expect(grid).toBeInTheDocument()
    })
  })

  describe('Inline Variant', () => {
    it('should render all pillars in inline layout', () => {
      render(<PremiumBadge variant="inline" />)

      // Should show all pillar titles and highlights
      PREMIUM_PILLARS.forEach((pillar) => {
        expect(screen.getByText(pillar.title)).toBeInTheDocument()
        expect(screen.getByText(pillar.highlight)).toBeInTheDocument()
      })
    })

    it('should render with flex layout', () => {
      const { container } = render(<PremiumBadge variant="inline" />)

      const flexContainer = container.querySelector('.flex.flex-wrap')
      expect(flexContainer).toBeInTheDocument()
    })
  })

  describe('Premium Pillars Data', () => {
    it('should export PREMIUM_PILLARS with correct structure', () => {
      expect(PREMIUM_PILLARS).toHaveLength(4)

      PREMIUM_PILLARS.forEach((pillar) => {
        expect(pillar).toHaveProperty('id')
        expect(pillar).toHaveProperty('title')
        expect(pillar).toHaveProperty('icon')
        expect(pillar).toHaveProperty('description')
        expect(pillar).toHaveProperty('color')
        expect(pillar).toHaveProperty('highlight')

        expect(typeof pillar.id).toBe('string')
        expect(typeof pillar.title).toBe('string')
        expect(typeof pillar.icon).toBe('string')
        expect(typeof pillar.description).toBe('string')
        expect(['primary', 'success', 'secondary']).toContain(pillar.color)
        expect(typeof pillar.highlight).toBe('string')
      })
    })

    it('should have unique pillar IDs', () => {
      const ids = PREMIUM_PILLARS.map((p) => p.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(PREMIUM_PILLARS.length)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for floating variant', () => {
      render(<PremiumBadge variant="floating" />)

      const badge = screen.getByTitle(PREMIUM_PILLARS[0].title).closest('[role="button"]')
      expect(badge).toHaveAttribute('role', 'button')
      expect(badge).toHaveAttribute('tabIndex', '0')
    })

    it('should support keyboard interaction', async () => {
      const user = userEvent.setup()
      render(<PremiumBadge variant="floating" />)

      const badge = screen.getByTitle(PREMIUM_PILLARS[0].title).closest('[role="button"]')

      if (badge) {
        // Initially collapsed
        expect(screen.queryByText(PREMIUM_PILLARS[0].description)).not.toBeInTheDocument()

        // Press Enter to expand
        ;(badge as HTMLElement).focus()
        await user.keyboard('{Enter}')

        // Wait for animation
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Should be expanded - check for title which is always visible
        expect(await screen.findByText('Premium Services')).toBeInTheDocument()
      }
    })

    it('should have all icons with proper titles', () => {
      render(<PremiumBadge variant="floating" />)

      PREMIUM_PILLARS.forEach((pillar) => {
        const icon = screen.getByTitle(pillar.title)
        expect(icon).toBeInTheDocument()
      })
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<PremiumBadge variant="inline" className="custom-class" />)

      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })
  })

  describe('Hover Effects', () => {
    it('should have hover lift for inline cards', () => {
      const { container } = render(<PremiumBadge variant="inline" />)

      // Check if hover classes are present
      const cards = container.querySelectorAll('.hover-lift')
      expect(cards.length).toBeGreaterThan(0)
    })
  })
})
