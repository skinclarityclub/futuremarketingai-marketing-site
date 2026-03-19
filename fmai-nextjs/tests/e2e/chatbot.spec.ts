import { test, expect } from '@playwright/test'

/**
 * E2E Tests: ChatWidget — Next.js site
 *
 * Feature parity check with Vite site chatbot-concierge tests.
 * ChatWidget is loaded via ClientIslands (dynamic import, ssr:false).
 */

// Helper: wait for chat button (loaded lazily)
async function waitForChatButton(page: import('@playwright/test').Page) {
  const btn = page.locator('button[aria-label="Open chat"]')
  await expect(btn).toBeVisible({ timeout: 20000 })
  return btn
}

// Helper: open chat panel
async function openChat(page: import('@playwright/test').Page) {
  const btn = await waitForChatButton(page)
  await btn.click({ force: true })
  const panel = page.locator('[role="dialog"]')
  await expect(panel).toBeVisible()
  return panel
}

test.describe('Floating ChatWidget', () => {
  test('should show floating chat button on homepage', async ({ page }) => {
    await page.goto('/en')
    await waitForChatButton(page)
  })

  test('should show floating chat button on service pages', async ({ page }) => {
    const pages = ['/en/chatbots', '/en/pricing', '/en/about']

    for (const path of pages) {
      await page.goto(path)
      await waitForChatButton(page)
    }
  })

  test('should open chat panel when clicking the floating button', async ({ page }) => {
    await page.goto('/en')
    const panel = await openChat(page)

    // FAB label should change to "Close chat"
    const closeFab = page.locator('button[aria-label="Close chat"]').first()
    await expect(closeFab).toBeVisible()
    await expect(panel).toBeVisible()
  })

  test('should close chat panel with Escape key', async ({ page }) => {
    await page.goto('/en')
    const panel = await openChat(page)

    await page.keyboard.press('Escape')

    await expect(panel).not.toBeVisible()
  })

  test('should close chat panel when clicking floating button again', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const closeFab = page.locator('button[aria-label="Close chat"]').first()
    await closeFab.click({ force: true })

    const panel = page.locator('[role="dialog"]')
    await expect(panel).not.toBeVisible()
  })

  test('chat dialog should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/en')
    const panel = await openChat(page)

    // Should have aria-modal
    await expect(panel).toHaveAttribute('aria-modal', 'true')

    // Should have aria-label
    const ariaLabel = await panel.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
    expect(ariaLabel).toContain('Chat with')
  })

  test('should have message input inside chat panel', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const chatPanel = page.locator('[data-chatwidget-panel]')
    await expect(chatPanel).toBeVisible()

    // Should have a textarea for input
    const textarea = chatPanel.locator('textarea')
    await expect(textarea).toBeVisible()
    await expect(textarea).toHaveAttribute('placeholder', 'Type a message...')
  })
})

test.describe('ChatWidget on different page types', () => {
  const pages = [
    { path: '/en', name: 'homepage' },
    { path: '/en/chatbots', name: 'chatbots service' },
    { path: '/en/pricing', name: 'pricing' },
    { path: '/en/about', name: 'about' },
    { path: '/en/contact', name: 'contact' },
  ]

  for (const { path, name } of pages) {
    test(`should render on ${name} page`, async ({ page }) => {
      await page.goto(path)
      await waitForChatButton(page)
    })
  }
})

test.describe('ChatWidget persistence across navigation', () => {
  test('should persist chat widget across route navigation', async ({ page }) => {
    await page.goto('/en')
    await waitForChatButton(page)

    // Navigate to another page
    await page.click('a[href*="/pricing"]')
    await expect(page).toHaveURL(/\/en\/pricing/)

    // Chat button should still be there
    await waitForChatButton(page)
  })
})
