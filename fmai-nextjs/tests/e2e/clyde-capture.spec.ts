import { test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Clyde SOTA audit — CAPTURE harness (not assertions).
 *
 * Drives each scenario against a LIVE Clyde and drops a screenshot + a
 * structured text dump per scenario, so the auditor can review card content,
 * sidebar behaviour and chips visually + semantically.
 *
 * Requires: dev server with ANTHROPIC_API_KEY on PLAYWRIGHT_BASE_URL.
 * Env knobs:
 *   CLYDE_LOCALE  nl|en|es           (default nl)
 *   CLYDE_VP      "1440x900"          (default 1440x900)
 *   CLYDE_ONLY    "T1-skills,T2-..."  (subset filter; empty = all)
 *   CLYDE_DIR     output dir          (default .audit-screens)
 *
 * Run serial (workers=1) to respect the chatbot IP rate-limit (10/min).
 */

const LOCALE = process.env.CLYDE_LOCALE || 'nl'
const [VW, VH] = (process.env.CLYDE_VP || '1440x900').split('x').map(Number)
const DIR = process.env.CLYDE_DIR || '.audit-screens'
const ONLY = (process.env.CLYDE_ONLY || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

fs.mkdirSync(DIR, { recursive: true })

const PREFIX = `${LOCALE}-${VW}x${VH}`

const SCENARIOS: { id: string; prompt: string }[] = [
  { id: 'T1-skills', prompt: 'Welke vaardigheden hebben jullie?' },
  { id: 'T2-pricing', prompt: 'Wat kost het voor 4 merken?' },
  { id: 'T3-roi', prompt: 'Bereken de ROI voor 3 man, 12 uur per week' },
  { id: 'T4-case', prompt: 'Heb je concreet bewijs dat dit echt werkt?' },
  { id: 'T5-booking', prompt: 'Ik wil graag een gesprek plannen' },
  { id: 'T6-fit', prompt: 'Voor wie werkt dit niet?' },
  { id: 'T7-memory', prompt: 'Wat is jullie geheugen-systeem precies?' },
  { id: 'T8-chatgpt', prompt: 'Hoe verschillen jullie van ChatGPT?' },
  { id: 'T9-qualify', prompt: 'Kwalificeer mij: 50 medewerkers, 5000 euro budget, ik ben de beslisser' },
  { id: 'T10-offtopic', prompt: 'Wat is de hoofdstad van Australie?' },
  { id: 'G1-serum', prompt: 'Wat kost een serum?' },
  { id: 'G2-product', prompt: 'Ik zoek een goed product voor mijn droge huid' },
  { id: 'G3-ticket', prompt: 'Ik heb een klacht, er is iets kapot met mijn bestelling' },
  { id: 'G4-password', prompt: 'Hoe reset ik mijn wachtwoord?' },
]

const PROMPT_I18N: Record<string, Record<string, string>> = {
  en: {
    'T1-skills': 'What skills do you have?',
    'T2-pricing': 'What does it cost for 4 brands?',
    'T4-case': 'Do you have proof that this actually works?',
  },
  es: {
    'T1-skills': 'Que habilidades tienes?',
    'T2-pricing': 'Cuanto cuesta para 4 marcas?',
    'T4-case': 'Tienes pruebas de que esto funciona?',
  },
}

async function openClyde(page: Page) {
  await page.setViewportSize({ width: VW, height: VH })
  // Pre-seed cookie consent: the consent banner is fixed bottom-0 z-[9999] and
  // overlays the Clyde FAB (z-40, lg:bottom-24), intercepting the open click.
  // Seeding consent stops the banner from rendering so the FAB is reachable.
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
  await page.goto(`/${LOCALE}`)
  const trigger = page.locator('button[aria-label^="Open chat"]').first()
  await trigger.waitFor({ state: 'visible', timeout: 20000 })
  await trigger.click()
  await page.locator('[data-chatwidget-panel]').waitFor({ state: 'visible', timeout: 15000 })
  await page.waitForTimeout(900) // let auto-greet settle
}

async function send(page: Page, text: string) {
  const ta = page.locator('[data-chatwidget-panel] textarea')
  await ta.fill(text)
  await ta.press('Enter')
  await page.waitForTimeout(500)
  // Response is fully settled when the regenerate affordance appears on the
  // last assistant message (it only renders when status is no longer streaming).
  await page
    .locator('button[aria-label="Opnieuw genereren"]')
    .first()
    .waitFor({ state: 'visible', timeout: 35000 })
    .catch(() => {})
  await page.waitForTimeout(900)
}

async function getSidebarTitle(page: Page): Promise<string | null> {
  const back = page.locator('button[aria-label="Close details panel"]').first()
  if (!(await back.isVisible().catch(() => false))) return null
  const span = back.locator('..').locator('span').first()
  return (await span.textContent().catch(() => null))?.trim() ?? null
}

async function capture(page: Page, id: string, browserName: string) {
  const panel = page.locator('[data-chatwidget-panel]')
  const hasSidebar = await page
    .locator('button[aria-label="Close details panel"]')
    .first()
    .isVisible()
    .catch(() => false)
  const sidebarTitle = await getSidebarTitle(page)
  const panelText = (await panel.innerText().catch(() => '')) || ''
  // On mobile the sidebar portals to <body>; grab a broader text snapshot too.
  const bodyText = await page.evaluate(() => document.body.innerText).catch(() => '')
  const rec = {
    id,
    locale: LOCALE,
    viewport: `${VW}x${VH}`,
    browser: browserName,
    hasSidebar,
    sidebarTitle,
    rawChipsLeak: panelText.includes('CHIPS:') || bodyText.includes('CHIPS:'),
    hasChipsSection: panelText.toLowerCase().includes('vraag verder'),
    panelText,
  }
  fs.writeFileSync(
    path.join(DIR, `${PREFIX}-${browserName}-${id}.json`),
    JSON.stringify(rec, null, 2)
  )
  await page.screenshot({ path: path.join(DIR, `${PREFIX}-${browserName}-${id}.png`) })
}

const list = ONLY.length ? SCENARIOS.filter((s) => ONLY.includes(s.id)) : SCENARIOS

for (const sc of list) {
  test(`capture ${sc.id}`, async ({ page }, testInfo) => {
    await openClyde(page)
    const prompt = PROMPT_I18N[LOCALE]?.[sc.id] || sc.prompt
    await send(page, prompt)
    await capture(page, sc.id, testInfo.project.name)
  })
}

// VRAAG-2: multi-card transition within ONE session (skills -> pricing).
test('capture MULTI-swap', async ({ page }, testInfo) => {
  test.skip(ONLY.length > 0 && !ONLY.includes('MULTI'), 'filtered out')
  await openClyde(page)
  await send(page, 'Welke vaardigheden hebben jullie?')
  await capture(page, 'MULTI-1-skills', testInfo.project.name)
  await send(page, 'En wat kost het voor 4 merken?')
  await capture(page, 'MULTI-2-pricing', testInfo.project.name)
})
