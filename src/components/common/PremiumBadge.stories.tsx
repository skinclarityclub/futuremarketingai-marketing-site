import type { Meta, StoryObj } from '@storybook/react'
import { PremiumBadge } from './PremiumBadge'

const meta = {
  title: 'Common/PremiumBadge',
  component: PremiumBadge,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0a0a0f',
        },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['floating', 'inline', 'banner'],
      description: 'Display style of the badge',
    },
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      description: 'Position for floating variant',
    },
    expandedByDefault: {
      control: 'boolean',
      description: 'Start with expanded view (floating variant only)',
    },
    showLabels: {
      control: 'boolean',
      description: 'Show "Premium Services" label in collapsed view',
    },
  },
} satisfies Meta<typeof PremiumBadge>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Floating variant - Collapsed by default
 * Click to expand and see full details
 */
export const FloatingCollapsed: Story = {
  args: {
    variant: 'floating',
    position: 'top-right',
    expandedByDefault: false,
    showLabels: false,
  },
}

/**
 * Floating variant - Expanded by default
 * Shows all 3 premium pillars with descriptions
 */
export const FloatingExpanded: Story = {
  args: {
    variant: 'floating',
    position: 'top-right',
    expandedByDefault: true,
    showLabels: false,
  },
}

/**
 * Floating with labels
 * Shows "Premium Services" text in collapsed view
 */
export const FloatingWithLabels: Story = {
  args: {
    variant: 'floating',
    position: 'top-right',
    expandedByDefault: false,
    showLabels: true,
  },
}

/**
 * Floating - Top Left position
 */
export const FloatingTopLeft: Story = {
  args: {
    variant: 'floating',
    position: 'top-left',
    expandedByDefault: false,
    showLabels: true,
  },
}

/**
 * Floating - Bottom Right position
 */
export const FloatingBottomRight: Story = {
  args: {
    variant: 'floating',
    position: 'bottom-right',
    expandedByDefault: false,
    showLabels: true,
  },
}

/**
 * Banner variant
 * Full-width display with all pillars visible
 * Best for hero sections or landing pages
 */
export const Banner: Story = {
  args: {
    variant: 'banner',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-surface to-bg-dark p-8">
        <Story />
      </div>
    ),
  ],
}

/**
 * Inline variant
 * Compact display with icon and highlight
 * Best for integration in content sections
 */
export const Inline: Story = {
  args: {
    variant: 'inline',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-surface to-bg-dark p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
            Premium Services Overview
          </h2>
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * In Context - Landing Page
 * Shows how the badge integrates in a real landing page
 */
export const InLandingPageContext: Story = {
  args: {
    variant: 'floating',
    position: 'top-right',
    expandedByDefault: false,
    showLabels: true,
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-surface to-bg-dark">
        {/* Mock Header */}
        <header className="glass-card-subtle border-b border-border-primary sticky top-0 z-30 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold gradient-text">FutureMarketingAI</h1>
              <nav className="text-text-secondary text-sm">Navigation</nav>
            </div>
          </div>
        </header>

        {/* Floating Badge */}
        <Story />

        {/* Mock Content */}
        <div className="max-w-4xl mx-auto px-8 py-16">
          <h2 className="text-4xl font-bold text-text-primary mb-4 text-center">
            Stop met Handmatig Content Maken
          </h2>
          <p className="text-xl text-text-secondary text-center mb-8">
            Laat AI 24/7 voor je werken
          </p>
          <div className="glass-card p-8">
            <p className="text-text-secondary">
              Click op de premium badge rechts bovenin om de details te zien van onze 3 core
              services. Deze badge verschijnt op alle main pages.
            </p>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * In Context - With Banner
 * Shows banner variant integrated in page layout
 */
export const InPageWithBanner: Story = {
  args: {
    variant: 'banner',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-surface to-bg-dark">
        {/* Mock Header */}
        <header className="glass-card-subtle border-b border-border-primary sticky top-0 z-30 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold gradient-text">FutureMarketingAI</h1>
              <nav className="text-text-secondary text-sm">Navigation</nav>
            </div>
          </div>
        </header>

        {/* Banner Badge */}
        <div className="sticky top-[73px] z-20">
          <Story />
        </div>

        {/* Mock Content */}
        <div className="max-w-4xl mx-auto px-8 py-16">
          <h2 className="text-4xl font-bold text-text-primary mb-4 text-center">
            All-in-One Marketing Automation
          </h2>
          <div className="glass-card p-8 mt-8">
            <p className="text-text-secondary">
              De banner bovenaan toont onze 3 premium services. Perfect voor hero sections en
              landing pages waar je direct de value proposition wilt communiceren.
            </p>
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Interactive Demo
 * Shows all variants side by side for comparison
 */
export const AllVariantsComparison: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-surface to-bg-dark p-8 space-y-16">
      <div>
        <h3 className="text-2xl font-bold text-text-primary mb-6">Floating Variant</h3>
        <div className="relative glass-card p-8 min-h-[300px]">
          <p className="text-text-secondary mb-4">
            Floating badge in top-right corner. Click to expand.
          </p>
          <PremiumBadge variant="floating" position="top-right" showLabels />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-text-primary mb-6">Banner Variant</h3>
        <PremiumBadge variant="banner" />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-text-primary mb-6">Inline Variant</h3>
        <PremiumBadge variant="inline" />
      </div>
    </div>
  ),
}
