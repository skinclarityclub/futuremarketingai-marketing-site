import { test, expect, type Page } from '@playwright/test'

/**
 * Clyde i18n render guard — locks in the en/es localization of the welcome message
 * and suggested prompts (ChatWidgetIsland WELCOME_MESSAGES / SUGGESTED_PROMPTS).
 *
 * These render from STATIC per-locale maps the moment the panel opens (the welcome
 * shows in the empty-state and is injected as the auto-greet bubble; the suggested
 * prompts render below it). Opening the panel fires NO /api/chatbot call, so this
 * spec is free of the live rate-limit and needs no ANTHROPIC_API_KEY. It must never
 * send a message — that would hit the API.
 *
 * Regression target: before this fix, /en and /es visitors got the Dutch greeting
 * and Dutch prompts on every locale.
 */

async function openClyde(page: Page, locale: string) {
  // Seed cookie consent so the bottom-fixed banner does not overlay the FAB.
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem(
        'cookieConsent',
        JSON.stringify({ functional: true, analytics: true, marketing: true })
      )
    } catch {
      /* storage disabled */
    }
  })
  await page.goto(`/${locale}`)
  const trigger = page.locator('button[aria-label^="Open chat"]').first()
  await trigger.waitFor({ state: 'visible', timeout: 20000 })
  await trigger.click()
  await page.locator('[data-chatwidget-panel]').waitFor({ state: 'visible', timeout: 15000 })
  await page.waitForTimeout(1200) // let the auto-greet settle
}

const CASES = [
  { locale: 'nl', welcome: 'Hoi, ik ben Clyde', prompt: 'Welke vaardigheden heb je?' },
  { locale: 'en', welcome: 'Hi, I am Clyde', prompt: 'Which skills do you have?' },
  { locale: 'es', welcome: 'Hola, soy Clyde', prompt: '¿Qué habilidades tienes?' },
]

for (const c of CASES) {
  test(`Clyde greets and suggests prompts in ${c.locale}`, async ({ page }) => {
    await openClyde(page, c.locale)
    const panel = page.locator('[data-chatwidget-panel]')
    await expect(panel).toContainText(c.welcome, { timeout: 5000 })
    await expect(panel.getByText(c.prompt, { exact: false }).first()).toBeVisible()
  })
}
