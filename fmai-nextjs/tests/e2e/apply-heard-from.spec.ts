import { test, expect, type Page } from '@playwright/test'

/**
 * "Hoe ken je ons?" on the last wizard step: required in the UI, sent as `heardFrom`,
 * kept in sessionStorage. /api/apply is mocked so no real application is ever
 * submitted, and Google is aborted like in apply-submit-event.spec.ts.
 */

const GOOGLE = /^https:\/\/([a-z0-9-]+\.)*(googletagmanager\.com|google-analytics\.com|analytics\.google\.com)\//
const STORAGE_KEY = 'fmai-apply-wizard-v1'

test.beforeEach(async ({ context }) => {
  await context.route(GOOGLE, (route) => route.abort())
})

function mockApply(page: Page) {
  const bodies: Record<string, unknown>[] = []
  return page
    .route('**/api/apply', (route) => {
      bodies.push(route.request().postDataJSON())
      return route.fulfill({ json: { branch: 'review', score: 1, maxScore: 17 } })
    })
    .then(() => bodies)
}

async function toProblemStep(page: Page) {
  await page.goto('/nl/apply')
  await page.fill('#apply-name', 'Jan de Vries')
  await page.fill('#apply-email', 'jan@testbureau.nl')
  await page.fill('#apply-agency', 'TestBureau NL')
  await page.fill('#apply-role', 'CEO')
  await page.getByRole('button', { name: /volgende/i }).click()
  await page.locator('#main').getByRole('button', { name: /Nee, korte vragenlijst/i }).first().click()
  const pick = (text: RegExp) => page.locator('#main').getByRole('button', { name: text }).first().click()
  await pick(/nog niet zeker/i)
  await pick(/Minder dan/i)
  await pick(/Solo/i)
  await page.getByRole('radio', { name: '1 van 5' }).click()
  await pick(/verkennen/i)
  await page.getByRole('button', { name: /volgende/i }).click()
  await expect(page.locator('#apply-problem')).toBeVisible()
}

const submit = (page: Page) => page.getByRole('button', { name: /verstuur aanvraag/i })

test('no choice: inline error, focus on the first radio, no request', async ({ page }) => {
  const bodies = await mockApply(page)
  await toProblemStep(page)
  await expect(submit(page)).toBeEnabled()
  await submit(page).click()
  const error = page.getByRole('alert').filter({ hasText: /Kies hoe je ons kent/ })
  await expect(error).toBeVisible()
  await expect(page.getByRole('radio', { name: 'LinkedIn' })).toBeFocused()
  await expect(page.getByRole('group', { name: 'Hoe ken je ons?' })).toHaveAttribute(
    'aria-describedby',
    /apply-heard-from-error/,
  )
  await page.waitForTimeout(500)
  expect(bodies).toEqual([])
})

test('keyboard choice is sent as heardFrom, with no free-text field', async ({ page }) => {
  const bodies = await mockApply(page)
  await toProblemStep(page)
  await submit(page).click()
  await expect(page.getByRole('radio', { name: 'LinkedIn' })).toBeFocused()
  await page.keyboard.press('ArrowDown') // native radio group: moves focus and selects
  await expect(page.getByRole('radio', { name: 'Google' })).toBeChecked()
  await expect(page.getByRole('alert').filter({ hasText: /Kies hoe je ons kent/ })).toHaveCount(0)
  await submit(page).click()
  await expect(page.getByText(/bedankt|daley reviewt/i).first()).toBeVisible({ timeout: 15_000 })
  expect(bodies).toHaveLength(1)
  expect(bodies[0].heardFrom).toBe('google')
  expect(JSON.stringify(bodies[0])).not.toMatch(/heardFromOther/)
})

test('the choice survives a reload', async ({ page }) => {
  await mockApply(page)
  await toProblemStep(page)
  await page.getByRole('radio', { name: /Een podcast of evenement/ }).check()
  await page.reload()
  await expect(page.getByRole('radio', { name: /Een podcast of evenement/ })).toBeChecked()
})

test('a state stored before the deploy (no heardFrom) loads and asks the question', async ({ page }) => {
  const bodies = await mockApply(page)
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.addInitScript((key) => {
    sessionStorage.setItem(
      key,
      JSON.stringify({
        state: {
          step: 'problem',
          identity: { name: 'Jan de Vries', email: 'jan@testbureau.nl', agency: 'TestBureau NL', role: 'CEO' },
          qualification: {},
          assessment: null,
          problem: '',
          scanCheckChoice: 'no',
          startedAt: null,
        },
        version: 0,
      }),
    )
  }, STORAGE_KEY)
  await page.goto('/nl/apply')
  await expect(page.getByRole('group', { name: 'Hoe ken je ons?' })).toBeVisible()
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0)
  await submit(page).click()
  await expect(page.getByRole('alert').filter({ hasText: /Kies hoe je ons kent/ })).toBeVisible()
  expect(bodies).toEqual([])
  expect(errors).toEqual([])
})
