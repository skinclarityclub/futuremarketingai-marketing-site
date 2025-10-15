import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { IndustrySelector, INDUSTRIES, Industry } from './IndustrySelector'

const meta: Meta<typeof IndustrySelector> = {
  title: 'Components/IndustrySelector',
  component: IndustrySelector,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls modal visibility',
    },
    skippable: {
      control: 'boolean',
      description: 'Allow users to skip industry selection',
    },
  },
}

export default meta
type Story = StoryObj<typeof IndustrySelector>

/**
 * Default industry selector modal with all options
 */
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true)
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null)

    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-accent-primary text-white rounded-lg"
        >
          Open Industry Selector
        </button>

        <IndustrySelector
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelect={(industry) => {
            setSelectedIndustry(industry)
            alert(`Selected: ${industry.name}`)
          }}
          selectedIndustry={selectedIndustry}
        />

        {selectedIndustry && (
          <div className="mt-4 p-4 rounded-lg">
            <p className="text-white">
              Selected Industry: {selectedIndustry.name} {selectedIndustry.icon}
            </p>
          </div>
        )}
      </div>
    )
  },
}

/**
 * Industry selector with pre-selected industry
 */
export const WithPreselection: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true)
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
      INDUSTRIES.find((i) => i.id === 'technology') || null
    )

    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-accent-primary text-white rounded-lg"
        >
          Open Industry Selector
        </button>

        <IndustrySelector
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelect={(industry) => {
            setSelectedIndustry(industry)
            alert(`Selected: ${industry.name}`)
          }}
          selectedIndustry={selectedIndustry}
        />

        <div className="mt-4 p-4 rounded-lg">
          <p className="text-white">
            Current: {selectedIndustry?.name} {selectedIndustry?.icon}
          </p>
        </div>
      </div>
    )
  },
}

/**
 * Industry selector that cannot be skipped (required selection)
 */
export const Required: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true)
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null)

    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-accent-primary text-white rounded-lg"
        >
          Open Industry Selector
        </button>

        <IndustrySelector
          isOpen={isOpen}
          onClose={() => {
            if (selectedIndustry) {
              setIsOpen(false)
            }
          }}
          onSelect={(industry) => {
            setSelectedIndustry(industry)
          }}
          selectedIndustry={selectedIndustry}
          skippable={false}
        />

        {selectedIndustry && (
          <div className="mt-4 p-4 rounded-lg">
            <p className="text-white">
              Selected Industry: {selectedIndustry.name} {selectedIndustry.icon}
            </p>
          </div>
        )}
      </div>
    )
  },
}

/**
 * All available industries displayed
 */
export const AllIndustries: Story = {
  render: () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
        {INDUSTRIES.map((industry) => (
          <div key={industry.id} className="glass-card p-6 text-center">
            <div className="text-5xl mb-3">{industry.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{industry.name}</h3>
            <p className="text-sm text-text-muted">{industry.description}</p>
          </div>
        ))}
      </div>
    )
  },
}
