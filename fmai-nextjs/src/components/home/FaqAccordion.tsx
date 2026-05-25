'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

export interface FaqItem {
  key: string
  question: string
  answer: string
}

interface FaqAccordionProps {
  items: readonly FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      className="space-y-3"
    >
      {items.map(({ key, question, answer }) => (
        <Accordion.Item
          key={key}
          value={key}
          className="rounded-xl border border-border-primary bg-bg-surface/30 overflow-hidden transition-colors data-[state=open]:bg-bg-surface/60 data-[state=open]:border-accent-system/40"
        >
          <Accordion.Header className="flex">
            <Accordion.Trigger
              className="group flex flex-1 items-center justify-between gap-4 px-6 py-5 text-left text-base lg:text-lg font-semibold text-text-primary transition-colors hover:text-accent-system focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-system"
            >
              <span>{question}</span>
              <ChevronDown
                aria-hidden
                className="w-5 h-5 shrink-0 text-text-muted transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-accent-system"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="px-6 pb-5 pt-1 text-text-secondary leading-relaxed">
              {answer}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
