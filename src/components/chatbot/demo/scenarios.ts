export interface DemoCheckpoint {
  prompt: string
  options: { label: string; action: 'next' | 'skip-to-booking' | 'end' | 'next-scenario' }[]
}

export interface DemoStep {
  userMessage: string
  expectTool?: string
  checkpoint?: DemoCheckpoint
}

export interface DemoScenario {
  id: string
  title: string
  subtitle: string
  icon: string // Lucide icon name
  stepCount: number
  steps: DemoStep[]
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'new-client',
    title: 'The New Client Journey',
    subtitle: 'See how prospects discover and evaluate FMai',
    icon: 'Briefcase',
    stepCount: 6,
    steps: [
      { userMessage: 'What services does FMai offer?', expectTool: 'get_services' },
      { userMessage: 'Do you have any case studies?', expectTool: 'get_case_study' },
      {
        userMessage:
          'How much could we save with AI marketing? Our team has 8 people and we spend about 40 hours per week on marketing.',
        expectTool: 'get_roi_estimate',
        checkpoint: {
          prompt: 'Want to see our pricing plans next?',
          options: [
            { label: 'Show pricing', action: 'next' },
            { label: 'Skip to booking', action: 'skip-to-booking' },
            { label: 'End demo', action: 'end' },
          ],
        },
      },
      { userMessage: 'What are your pricing plans?', expectTool: 'get_pricing_info' },
      {
        userMessage:
          'Can you evaluate our needs? We are a mid-size e-commerce company with a budget around 2000 EUR, looking at a 1-3 month timeline. I am the decision maker.',
        expectTool: 'qualify_lead',
        checkpoint: {
          prompt: 'Ready to book a discovery call?',
          options: [
            { label: 'Book a call', action: 'next' },
            { label: 'Try another scenario', action: 'next-scenario' },
            { label: 'End demo', action: 'end' },
          ],
        },
      },
      { userMessage: "I'd like to book a discovery call", expectTool: 'book_call' },
    ],
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Brand in Action',
    subtitle: 'See how FMai powers a skincare brand',
    icon: 'ShoppingBag',
    stepCount: 6,
    steps: [
      { userMessage: 'Show me skincare products for dry skin', expectTool: 'search_products' },
      {
        userMessage: 'Build me a morning and evening routine for sensitive skin',
        expectTool: 'build_routine',
        checkpoint: {
          prompt: 'Want to see the Marketing Machine next?',
          options: [
            { label: 'Show Marketing Machine', action: 'next' },
            { label: 'Skip to booking', action: 'skip-to-booking' },
            { label: 'End demo', action: 'end' },
          ],
        },
      },
      {
        userMessage: 'What Marketing Machine modules would help an e-commerce brand?',
        expectTool: 'explain_module',
      },
      {
        userMessage: 'Calculate the ROI for a team of 5 with a 5000 EUR monthly marketing budget',
        expectTool: 'get_roi_info',
        checkpoint: {
          prompt: 'See a real case study next?',
          options: [
            { label: 'Show case study', action: 'next' },
            { label: 'Book a call', action: 'skip-to-booking' },
            { label: 'End demo', action: 'end' },
          ],
        },
      },
      { userMessage: 'Show me how your case study client used this', expectTool: 'get_case_study' },
      { userMessage: 'Book a demo to see this in action', expectTool: 'book_call' },
    ],
  },
  {
    id: 'support',
    title: 'Client Support Experience',
    subtitle: 'See how we handle customer support',
    icon: 'Headphones',
    stepCount: 4,
    steps: [
      {
        userMessage: 'I need help with my billing, my last invoice seems incorrect',
        expectTool: 'search_knowledge_base',
      },
      {
        userMessage:
          "That doesn't fully solve my issue. Can you create a support ticket for me? Category: billing, subject: Incorrect invoice amount, description: My March invoice shows a charge I don't recognize.",
        expectTool: 'create_ticket',
        checkpoint: {
          prompt: 'Want to see ticket tracking and escalation?',
          options: [
            { label: 'Check ticket status', action: 'next' },
            { label: 'End demo', action: 'end' },
          ],
        },
      },
      { userMessage: 'Can I check the status of my ticket?', expectTool: 'check_status' },
      {
        userMessage: 'I need to speak to someone about this urgently',
        expectTool: 'escalate_to_human',
      },
    ],
  },
]

// The booking step used when user picks "skip-to-booking" at any checkpoint
export const BOOKING_STEP: DemoStep = {
  userMessage: "I'd like to book a discovery call",
  expectTool: 'book_call',
}
