import React, { useState } from 'react'
import { GlassCard, Button, Tooltip, Modal, ProgressIndicator, TabNavigation } from './index'

/**
 * ComponentShowcase - Demo page showing all UI components
 * Useful for visual testing and reference
 */
export const ComponentShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [progress, setProgress] = useState(45)

  return (
    <div className="min-h-screen bg-bg-dark p-8 space-y-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold gradient-text mb-4">Component Showcase</h1>
          <p className="text-xl text-secondary">FutureMarketingAI Design System Components</p>
        </div>

        {/* GlassCard Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">GlassCard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-2">Default</h3>
              <p className="text-secondary">Standard glassmorphism effect</p>
            </GlassCard>

            <GlassCard variant="strong" className="p-6">
              <h3 className="text-xl font-semibold mb-2">Strong</h3>
              <p className="text-secondary">More opaque glass effect</p>
            </GlassCard>

            <GlassCard variant="subtle" hover glow className="p-6">
              <h3 className="text-xl font-semibold mb-2">Hover + Glow</h3>
              <p className="text-secondary">With hover lift and glow</p>
            </GlassCard>
          </div>
        </section>

        {/* Button Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" glow>
              With Glow
            </Button>
            <Button variant="primary" loading>
              Loading
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* Tooltip Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Tooltips</h2>
          <div className="flex gap-8">
            <Tooltip content="Tooltip on top" position="top">
              <Button variant="outline">Hover me (Top)</Button>
            </Tooltip>

            <Tooltip content="Tooltip on bottom" position="bottom">
              <Button variant="outline">Hover me (Bottom)</Button>
            </Tooltip>

            <Tooltip content="Tooltip on left" position="left">
              <Button variant="outline">Hover me (Left)</Button>
            </Tooltip>

            <Tooltip content="Tooltip on right" position="right">
              <Button variant="outline">Hover me (Right)</Button>
            </Tooltip>
          </div>
        </section>

        {/* Modal Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Modal</h2>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
            size="md"
          >
            <p className="mb-4">
              This is a modal with Framer Motion animations. Press ESC to close or click outside.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Confirm
              </Button>
            </div>
          </Modal>
        </section>

        {/* Progress Indicator Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Progress Indicators</h2>

          <GlassCard className="p-6 space-y-6">
            <ProgressIndicator value={progress} showLabel label="Upload Progress" color="primary" />

            <ProgressIndicator value={75} showLabel color="success" label="Success Progress" />

            <ProgressIndicator indeterminate color="secondary" label="Loading..." />

            <div className="flex gap-3">
              <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                - 10%
              </Button>
              <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                + 10%
              </Button>
            </div>
          </GlassCard>
        </section>

        {/* Tab Navigation Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Tab Navigation</h2>

          <GlassCard className="p-6">
            <TabNavigation
              tabs={[
                {
                  id: 'overview',
                  label: 'Overview',
                  content: (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Overview Tab</h3>
                      <p className="text-secondary">
                        This is the overview content. You can navigate using arrow keys!
                      </p>
                    </div>
                  ),
                },
                {
                  id: 'features',
                  label: 'Features',
                  content: (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Features Tab</h3>
                      <ul className="list-disc list-inside text-secondary space-y-2">
                        <li>Keyboard navigation (Arrow keys, Home, End)</li>
                        <li>ARIA compliant</li>
                        <li>Smooth animations</li>
                        <li>Focus management</li>
                      </ul>
                    </div>
                  ),
                },
                {
                  id: 'settings',
                  label: 'Settings',
                  content: (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">Settings Tab</h3>
                      <p className="text-secondary">Configure your preferences here.</p>
                    </div>
                  ),
                },
                {
                  id: 'disabled',
                  label: 'Disabled',
                  disabled: true,
                  content: <div>This tab is disabled</div>,
                },
              ]}
            />
          </GlassCard>

          <GlassCard className="p-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Pills Variant</h3>
            <TabNavigation
              variant="pills"
              tabs={[
                {
                  id: 'tab1',
                  label: 'Tab 1',
                  content: <p className="text-secondary">Content for Tab 1 (Pills style)</p>,
                },
                {
                  id: 'tab2',
                  label: 'Tab 2',
                  content: <p className="text-secondary">Content for Tab 2 (Pills style)</p>,
                },
                {
                  id: 'tab3',
                  label: 'Tab 3',
                  content: <p className="text-secondary">Content for Tab 3 (Pills style)</p>,
                },
              ]}
            />
          </GlassCard>
        </section>
      </div>
    </div>
  )
}

export default ComponentShowcase
