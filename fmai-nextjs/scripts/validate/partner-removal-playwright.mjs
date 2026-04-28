#!/usr/bin/env node
/**
 * Partner-tier removal + Founding-prominence — browser validation.
 *
 * Validates commits ab58816, 048acfb, ee3391e on the marketing site after
 * the upstream fma-app SSoT change (commit 297949d7) which dropped the
 * Partner tier and reordered tiers so Founding leads.
 *
 * Boots Chromium via Playwright and runs assertion groups across NL/EN/ES.
 *
 * Usage:
 *   BASE_URL=http://localhost:3060 node scripts/validate/partner-removal-playwright.mjs
 *
 * Server lifecycle is the caller's responsibility — this script only validates.
 *
 * Output:
 *   - Stdout: human-readable pass/fail per assertion
 *   - test-results/partner-removal-validation/report.json: machine report
 *   - test-results/partner-removal-validation/{locale}/{group}/*.png: failure screenshots only
 */

import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE_URL = process.env.BASE_URL || 'http://localhost:3060'
const OUT_DIR = join(__dirname, '../../test-results/partner-removal-validation')
const LOCALES = /** @type {const} */ (['nl', 'en', 'es'])
const DESKTOP_VIEWPORT = { width: 1280, height: 800 }
const NAV_TIMEOUT = 45000

/** @type {{ group:string, locale:string, name:string, pass:boolean, expected?:string, actual?:string, screenshot?:string, note?:string }[]} */
const results = []
const startedAt = Date.now()

async function ensureDir(p) { await mkdir(p, { recursive: true }).catch(() => {}) }

async function record(result, page) {
  if (!result.pass && page) {
    const dir = join(OUT_DIR, result.locale || 'na', (result.group || 'na').replace(/[^a-z0-9_-]/gi, '_').slice(0, 40))
    await ensureDir(dir)
    const safeName = result.name.replace(/[^a-z0-9_-]/gi, '_').slice(0, 80)
    const shotPath = join(dir, `${safeName}.png`)
    try { await page.screenshot({ path: shotPath, fullPage: false }); result.screenshot = shotPath } catch {}
  }
  results.push(result)
  const status = result.pass ? 'PASS' : 'FAIL'
  // eslint-disable-next-line no-console
  console.log(`[${status}] ${result.group} :: ${result.name} (${result.locale})${result.note ? ' — ' + result.note : ''}${!result.pass && result.actual ? '\n        actual=' + String(result.actual).slice(0, 280) : ''}`)
}

async function getMainText(page) {
  return await page.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText || '')
}

async function getJsonLdScripts(page) {
  return await page.$$eval('script[type="application/ld+json"]', (nodes) => nodes.map((n) => n.textContent || ''))
}

/** Maps founding-badge subtitle text per locale. The pricing page renders
 * the founding "subtitle" key as the orange badge above the Founding card. */
const FOUNDING_BADGE = {
  nl: 'Aanbevolen voor early adopters',
  en: 'Recommended for early adopters',
  es: 'Recomendado para early adopters',
}

/** Locked-note copy per locale (rendered on growth/pro/ent cards while
 * FOUNDING_SPOTS_TAKEN < FOUNDING_SPOTS_TOTAL). */
const LOCKED_NOTE_PREFIX = {
  nl: 'Beschikbaar zodra alle 10 Founding-plekken vergeven zijn',
  en: 'Available once all 10 Founding spots are filled',
  es: 'Disponible una vez que las 10 plazas Founding estén ocupadas',
}

const FOUNDING_LABEL = {
  nl: 'Founding',
  en: 'Founding',
  es: 'Founding',
}

const TIER_NAME = {
  growth: { nl: 'Growth', en: 'Growth', es: 'Growth' },
  professional: { nl: 'Professional', en: 'Professional', es: 'Professional' },
  enterprise: { nl: 'Enterprise', en: 'Enterprise', es: 'Enterprise' },
}

const FOUNDING_OPTION_HINT = {
  nl: '10 plekken',
  en: '10 spots',
  es: '10 plazas',
}

// ---------------------------------------------------------------------------
// Group 1 — /pricing tier-card surface
// ---------------------------------------------------------------------------
async function group1TierCards(browser) {
  for (const locale of LOCALES) {
    const ctx = await browser.newContext({ viewport: DESKTOP_VIEWPORT })
    const page = await ctx.newPage()
    const url = `${BASE_URL}/${locale}/pricing`
    let resp
    try { resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT }) }
    catch (e) {
      await record({ group: 'G1 pricing tier cards', locale, name: 'navigate /pricing', pass: false, actual: String(e) }, page)
      await ctx.close()
      continue
    }
    const ok = resp && resp.status() >= 200 && resp.status() < 400
    if (!ok) {
      await record({ group: 'G1 pricing tier cards', locale, name: 'pricing returns 2xx', pass: false, actual: resp ? String(resp.status()) : 'no resp' }, page)
      await ctx.close()
      continue
    }

    // Tier grid: section with aria-labelledby="pricing-tiers" — the grid is the .grid div inside.
    const tierData = await page.evaluate(() => {
      const sec = document.querySelector('section[aria-labelledby="pricing-tiers"]')
      if (!sec) return { error: 'no tier section' }
      const grid = sec.querySelector('.grid')
      if (!grid) return { error: 'no grid' }
      const headings = Array.from(grid.querySelectorAll('h3')).map((h) => (h.textContent || '').trim())
      const innerText = grid.textContent || ''
      // Founding card is the first one — find by being the first card with an orange badge sibling.
      const firstCard = grid.firstElementChild
      const firstHeading = firstCard?.querySelector('h3')?.textContent?.trim() || ''
      // Badge: orange pill at -top-3 absolute with bg-[#F5A623].
      const cards = Array.from(grid.children)
      const cardInfo = cards.map((card, idx) => {
        const heading = card.querySelector('h3')?.textContent?.trim() || ''
        const badge = card.querySelector('span.bg-\\[\\#F5A623\\]')?.textContent?.trim() || ''
        // Locked note: orange-bordered box with [#F5A623]/30 border + bg/10
        const lockedNoteEl = card.querySelector('div.border-\\[\\#F5A623\\]\\/30')
        const lockedNote = lockedNoteEl?.textContent?.trim() || ''
        const cardText = card.textContent || ''
        return { idx, heading, badge, lockedNote, cardText: cardText.slice(0, 600) }
      })
      // Most popular badge would be a similar absolute pill; check no card except possibly Founding has one.
      return { headingsCount: headings.length, headings, firstHeading, cardInfo, gridText: innerText }
    })

    if (tierData.error) {
      await record({ group: 'G1 pricing tier cards', locale, name: 'tier grid found', pass: false, actual: tierData.error }, page)
      await ctx.close()
      continue
    }

    // 1.1 Exactly 4 cards
    await record({
      group: 'G1 pricing tier cards',
      locale,
      name: 'exactly 4 tier cards in grid',
      pass: tierData.headingsCount === 4,
      expected: '4',
      actual: `${tierData.headingsCount} :: ${JSON.stringify(tierData.headings)}`,
    }, page)

    // 1.2 First card is Founding
    await record({
      group: 'G1 pricing tier cards',
      locale,
      name: 'first tier card is Founding',
      pass: /founding/i.test(tierData.firstHeading),
      expected: 'Founding (or locale equivalent)',
      actual: tierData.firstHeading,
    }, page)

    // 1.3 Founding card has the orange "early adopters" badge
    const foundingCard = tierData.cardInfo[0]
    const expectedBadge = FOUNDING_BADGE[locale]
    const badgeMatch = foundingCard?.badge?.toLowerCase().includes(expectedBadge.toLowerCase())
    await record({
      group: 'G1 pricing tier cards',
      locale,
      name: `Founding card has "${expectedBadge}" badge`,
      pass: !!badgeMatch,
      expected: expectedBadge,
      actual: foundingCard?.badge || '(no badge)',
    }, page)

    // 1.4 Professional card has NO most-popular / "Most popular / Meest gekozen / Más elegido" badge
    const profCard = tierData.cardInfo.find((c) => /professional/i.test(c.heading))
    const profBadge = profCard?.badge || ''
    const profForbidden = /most popular|meest gekozen|m[aá]s elegid/i.test(profBadge)
    await record({
      group: 'G1 pricing tier cards',
      locale,
      name: 'Professional card has NO most-popular badge',
      pass: !profForbidden,
      expected: 'no most-popular badge',
      actual: profBadge ? `prof badge="${profBadge}"` : '(no badge — pass)',
    }, page)

    // 1.5 Growth/Pro/Ent show locked-note; Founding does NOT
    for (const tier of ['growth', 'professional', 'enterprise']) {
      const card = tierData.cardInfo.find((c) => new RegExp(tier, 'i').test(c.heading))
      const noteText = card?.lockedNote || ''
      const expected = LOCKED_NOTE_PREFIX[locale]
      const noteOk = noteText.toLowerCase().includes(expected.toLowerCase())
      await record({
        group: 'G1 pricing tier cards',
        locale,
        name: `${tier} card shows locked-until-Founding note`,
        pass: noteOk,
        expected,
        actual: noteText.slice(0, 200) || '(no locked-note element)',
      }, page)
    }
    const foundingLockedNote = foundingCard?.lockedNote || ''
    await record({
      group: 'G1 pricing tier cards',
      locale,
      name: 'Founding card does NOT show locked-note',
      pass: foundingLockedNote.length === 0,
      expected: 'no locked-note',
      actual: foundingLockedNote.slice(0, 120) || '(none — pass)',
    }, page)

    // 1.6 Zero "Partner" inside the tier grid (case-sensitive)
    const partnerInGrid = tierData.gridText.includes('Partner')
    let partnerContext = ''
    if (partnerInGrid) {
      const idx = tierData.gridText.indexOf('Partner')
      partnerContext = tierData.gridText.slice(Math.max(0, idx - 40), idx + 60)
    }
    await record({
      group: 'G1 pricing tier cards',
      locale,
      name: 'NO "Partner" string in tier grid (case-sensitive)',
      pass: !partnerInGrid,
      expected: '0 occurrences',
      actual: partnerInGrid ? `…${partnerContext}…` : '0',
    }, page)

    // 1.7 Zero €347 anywhere on page main content
    const mainText = await getMainText(page)
    const has347 = /€\s*347|EUR\s*347/i.test(mainText)
    await record({
      group: 'G1 pricing tier cards',
      locale,
      name: 'NO €347 anywhere on /pricing main',
      pass: !has347,
      expected: '0 occurrences of €347',
      actual: has347 ? 'found' : '0',
    }, page)

    await ctx.close()
  }
}

// ---------------------------------------------------------------------------
// Group 2 — /pricing Skills × Tier matrix
// ---------------------------------------------------------------------------
async function group2Matrix(browser) {
  for (const locale of LOCALES) {
    const ctx = await browser.newContext({ viewport: DESKTOP_VIEWPORT })
    const page = await ctx.newPage()
    const url = `${BASE_URL}/${locale}/pricing`
    try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT }) }
    catch (e) {
      await record({ group: 'G2 skills matrix', locale, name: 'navigate /pricing', pass: false, actual: String(e) }, page)
      await ctx.close()
      continue
    }

    const matrixData = await page.evaluate(() => {
      const sec = document.querySelector('section[aria-labelledby="pricing-matrix"]')
      if (!sec) return { error: 'no matrix section' }
      const table = sec.querySelector('table')
      if (!table) return { error: 'no table' }
      const ths = Array.from(table.querySelectorAll('thead th')).map((th) => (th.textContent || '').trim())
      const allCells = Array.from(table.querySelectorAll('tbody td')).map((td) => (td.textContent || '').trim())
      return { ths, cellSample: allCells, allCellsText: allCells.join(' || ') }
    })

    if (matrixData.error) {
      await record({ group: 'G2 skills matrix', locale, name: 'matrix table found', pass: false, actual: matrixData.error }, page)
      await ctx.close()
      continue
    }

    // First TH is "Skill" column (skillHeader). Tier columns = ths.length - 1.
    const tierHeaders = matrixData.ths.slice(1)
    await record({
      group: 'G2 skills matrix',
      locale,
      name: 'exactly 4 tier columns (data ths minus skill header)',
      pass: tierHeaders.length === 4,
      expected: '4',
      actual: `${tierHeaders.length} :: ${JSON.stringify(matrixData.ths)}`,
    }, page)

    // Order check: founding first, then growth, professional, enterprise.
    const expectedOrder = ['founding', 'growth', 'professional', 'enterprise']
    const orderOk = expectedOrder.every((name, i) => new RegExp(name, 'i').test(tierHeaders[i] || ''))
    await record({
      group: 'G2 skills matrix',
      locale,
      name: 'tier column order: founding, growth, professional, enterprise',
      pass: orderOk,
      expected: expectedOrder.join(' | '),
      actual: tierHeaders.join(' | '),
    }, page)

    // Zero "Add-on €47" / "Add-on €97" labels
    const addOnHit = /Add-on\s*€\s*47|Add-on\s*€\s*97|Add\.on\s*€\s*47|Add\.on\s*€\s*97/i.test(matrixData.allCellsText)
    await record({
      group: 'G2 skills matrix',
      locale,
      name: 'NO "Add-on €47" or "Add-on €97" cells',
      pass: !addOnHit,
      expected: '0',
      actual: addOnHit ? 'found' : '0',
    }, page)

    await ctx.close()
  }
}

// ---------------------------------------------------------------------------
// Group 3 — Skill page tier-comparison tables (NL only, sample 3)
// ---------------------------------------------------------------------------
async function group3SkillPages(browser) {
  const skillSlugs = ['voice-agent', 'ad-creator', 'blog-factory']
  for (const slug of skillSlugs) {
    const ctx = await browser.newContext({ viewport: DESKTOP_VIEWPORT })
    const page = await ctx.newPage()
    const url = `${BASE_URL}/nl/skills/${slug}`
    let resp
    try { resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT }) }
    catch (e) {
      await record({ group: 'G3 skill pages', locale: 'nl', name: `navigate /skills/${slug}`, pass: false, actual: String(e) }, page)
      await ctx.close()
      continue
    }
    const ok = resp && resp.status() >= 200 && resp.status() < 400
    if (!ok) {
      await record({ group: 'G3 skill pages', locale: 'nl', name: `${slug} returns 2xx`, pass: false, actual: resp ? String(resp.status()) : 'no resp' }, page)
      await ctx.close()
      continue
    }

    // Skill page tier-comparison: a 2-column table inside section with aria-labelledby="allocation-heading".
    // Columns are: "Tier" header + skill name. Rows = TIER_ORDER length = 4 (one per tier).
    const skillTable = await page.evaluate(() => {
      const sec = document.querySelector('section[aria-labelledby="allocation-heading"]')
      if (!sec) return { error: 'no allocation section' }
      const table = sec.querySelector('table')
      if (!table) return { error: 'no table' }
      const tierRowLabels = Array.from(table.querySelectorAll('tbody tr td:first-child')).map((td) => (td.textContent || '').trim())
      return { tierRowLabels }
    })

    if (skillTable.error) {
      // Some skill pages may not have the allocation section (Group A skills with no tierCaps); record skip.
      await record({
        group: 'G3 skill pages',
        locale: 'nl',
        name: `${slug}: tier-comparison table present`,
        pass: false,
        actual: skillTable.error,
        note: 'page may have no tierCaps; expected for some skills',
      }, page)
      await ctx.close()
      continue
    }

    await record({
      group: 'G3 skill pages',
      locale: 'nl',
      name: `${slug}: 4 tier rows in comparison`,
      pass: skillTable.tierRowLabels.length === 4,
      expected: '4',
      actual: `${skillTable.tierRowLabels.length} :: ${JSON.stringify(skillTable.tierRowLabels)}`,
    }, page)

    const orderOk =
      /founding/i.test(skillTable.tierRowLabels[0] || '') &&
      /growth/i.test(skillTable.tierRowLabels[1] || '') &&
      /professional/i.test(skillTable.tierRowLabels[2] || '') &&
      /enterprise/i.test(skillTable.tierRowLabels[3] || '')
    await record({
      group: 'G3 skill pages',
      locale: 'nl',
      name: `${slug}: tier order founding→growth→prof→ent`,
      pass: orderOk,
      expected: 'Founding | Growth | Professional | Enterprise',
      actual: skillTable.tierRowLabels.join(' | '),
    }, page)

    // No Partner row anywhere
    const hasPartner = skillTable.tierRowLabels.some((l) => /partner/i.test(l))
    await record({
      group: 'G3 skill pages',
      locale: 'nl',
      name: `${slug}: NO Partner row`,
      pass: !hasPartner,
      actual: skillTable.tierRowLabels.join(' | '),
    }, page)

    await ctx.close()
  }
}

// ---------------------------------------------------------------------------
// Group 4 — Apply form /apply
// ---------------------------------------------------------------------------
async function group4ApplyForm(browser) {
  for (const locale of LOCALES) {
    const ctx = await browser.newContext({ viewport: DESKTOP_VIEWPORT })
    const page = await ctx.newPage()
    const url = `${BASE_URL}/${locale}/apply`
    let resp
    try { resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT }) }
    catch (e) {
      await record({ group: 'G4 apply form', locale, name: 'navigate /apply', pass: false, actual: String(e) }, page)
      await ctx.close()
      continue
    }
    const ok = resp && resp.status() >= 200 && resp.status() < 400
    if (!ok) {
      await record({ group: 'G4 apply form', locale, name: 'apply returns 2xx', pass: false, actual: resp ? String(resp.status()) : 'no resp' }, page)
      await ctx.close()
      continue
    }

    const tierSelect = await page.evaluate(() => {
      const select = document.querySelector('select[name="tier"]')
      if (!select) return { error: 'no select[name=tier]' }
      const options = Array.from(select.querySelectorAll('option')).map((o) => ({
        value: o.getAttribute('value') || '',
        text: (o.textContent || '').trim(),
        disabled: o.hasAttribute('disabled'),
      }))
      return { options }
    })

    if (tierSelect.error) {
      await record({ group: 'G4 apply form', locale, name: 'tier select present', pass: false, actual: tierSelect.error }, page)
      await ctx.close()
      continue
    }

    const dataOptions = tierSelect.options.filter((o) => o.value !== '')
    // Spec: exactly 5 data options (founding, growth, professional, enterprise, unsure).
    await record({
      group: 'G4 apply form',
      locale,
      name: 'tier select has exactly 5 data options',
      pass: dataOptions.length === 5,
      expected: '5',
      actual: `${dataOptions.length} :: ${JSON.stringify(dataOptions.map((o) => o.value))}`,
    }, page)

    // Spec: first option (after placeholder) is founding
    const firstDataValue = dataOptions[0]?.value
    await record({
      group: 'G4 apply form',
      locale,
      name: 'first option (after placeholder) is founding',
      pass: firstDataValue === 'founding',
      expected: 'founding',
      actual: firstDataValue || '(none)',
    }, page)

    // No 'partner' option anywhere
    const hasPartner = tierSelect.options.some((o) => o.value === 'partner' || /partner/i.test(o.text))
    await record({
      group: 'G4 apply form',
      locale,
      name: 'NO "partner" option in tier select',
      pass: !hasPartner,
      actual: tierSelect.options.map((o) => `${o.value}=${o.text.slice(0, 40)}`).join(' | '),
    }, page)

    // Founding option text contains the locale-specific 10-spots hint
    const foundingOpt = dataOptions.find((o) => o.value === 'founding')
    const hint = FOUNDING_OPTION_HINT[locale]
    const hintMatch = foundingOpt && foundingOpt.text.toLowerCase().includes(hint.toLowerCase())
    await record({
      group: 'G4 apply form',
      locale,
      name: `founding option contains "${hint}"`,
      pass: !!hintMatch,
      expected: hint,
      actual: foundingOpt?.text || '(missing)',
    }, page)

    await ctx.close()
  }
}

// ---------------------------------------------------------------------------
// Group 5 — Chatbot KB grep (OPTIONAL, time-boxed)
// ---------------------------------------------------------------------------
async function group5ChatbotKB(browser) {
  // Skipped — chat widget invokes a real LLM call (cost + flake risk).
  // Static KB validation already covered by commit ee3391e diff inspection.
  await record({
    group: 'G5 chatbot KB (optional)',
    locale: 'na',
    name: 'chatbot KB no-Partner answer',
    pass: true,
    note: 'SKIPPED — opt-out per task brief (real LLM call, cost + flake). Static KB scan covered separately.',
  })
}

// ---------------------------------------------------------------------------
// Group 6 — JSON-LD on /pricing
// ---------------------------------------------------------------------------
async function group6JsonLd(browser) {
  for (const locale of LOCALES) {
    const ctx = await browser.newContext({ viewport: DESKTOP_VIEWPORT })
    const page = await ctx.newPage()
    const url = `${BASE_URL}/${locale}/pricing`
    try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT }) }
    catch (e) {
      await record({ group: 'G6 JSON-LD', locale, name: 'navigate /pricing', pass: false, actual: String(e) }, page)
      await ctx.close()
      continue
    }

    const ldScripts = await getJsonLdScripts(page)
    let pricingList = null
    let parseError = ''
    for (const s of ldScripts) {
      if (!s) continue
      try {
        const parsed = JSON.parse(s)
        if (parsed && parsed['@type'] === 'ItemList' && Array.isArray(parsed.itemListElement)) {
          // Verify it's the pricing list (offers with Founders Club / AI Marketing names)
          const names = parsed.itemListElement.map((it) => (it && it.name) || '')
          if (names.some((n) => /Founders Club|Founding|AI Marketing|Pricing Tiers/i.test(String(n))) || /Pricing/i.test(String(parsed.name || ''))) {
            pricingList = parsed
            break
          }
        }
      } catch (e) {
        parseError = String(e)
      }
    }

    if (!pricingList) {
      await record({
        group: 'G6 JSON-LD',
        locale,
        name: 'pricing ItemList JSON-LD present',
        pass: false,
        actual: parseError ? `parse error: ${parseError}` : `${ldScripts.length} ld scripts, none matched`,
      }, page)
      await ctx.close()
      continue
    }

    const items = pricingList.itemListElement
    await record({
      group: 'G6 JSON-LD',
      locale,
      name: 'pricing ItemList has exactly 4 entries',
      pass: items.length === 4,
      expected: '4',
      actual: `${items.length} :: ${items.map((i) => i.name).join(' | ')}`,
    }, page)

    const first = items[0] || {}
    const firstIsFounders = /founders club|founding/i.test(String(first.name || '')) && String(first.price) === '997'
    await record({
      group: 'G6 JSON-LD',
      locale,
      name: 'first JSON-LD entry is Founders Club @ 997',
      pass: firstIsFounders,
      expected: 'Founders Club / 997',
      actual: `name=${first.name} price=${first.price}`,
    }, page)

    const has347 = items.some((it) => String(it.price) === '347' || String(it.priceSpecification?.price) === '347')
    await record({
      group: 'G6 JSON-LD',
      locale,
      name: 'NO entry with price 347 in pricing JSON-LD',
      pass: !has347,
      actual: has347 ? items.filter((it) => String(it.price) === '347').map((it) => it.name).join(' | ') : '0',
    }, page)

    await ctx.close()
  }
}

// ---------------------------------------------------------------------------
// Group 7 — Cross-cutting copy (4 routes × 3 locales)
// ---------------------------------------------------------------------------
async function group7CrossCutting(browser) {
  const routes = ['', '/pricing', '/founding-member', '/apply']
  for (const locale of LOCALES) {
    for (const r of routes) {
      const ctx = await browser.newContext({ viewport: DESKTOP_VIEWPORT })
      const page = await ctx.newPage()
      const url = `${BASE_URL}/${locale}${r}`
      try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT }) }
      catch (e) {
        await record({ group: 'G7 cross-cutting copy', locale, name: `navigate ${r || '/'}`, pass: false, actual: String(e) }, page)
        await ctx.close()
        continue
      }

      const text = await getMainText(page)
      // Page also includes invisible meta. We test main text + page metadata for €347.
      const headTitle = await page.title().catch(() => '')
      const metaDesc = await page.evaluate(() => {
        const m = document.querySelector('meta[name="description"]')
        return (m && m.getAttribute('content')) || ''
      })
      const combined = text + '\n' + headTitle + '\n' + metaDesc

      const has347 = /€\s*347|EUR\s*347/i.test(combined)
      let context347 = ''
      if (has347) {
        const idx = combined.search(/€\s*347|EUR\s*347/i)
        context347 = combined.slice(Math.max(0, idx - 40), idx + 60)
      }
      await record({
        group: 'G7 cross-cutting copy',
        locale,
        name: `NO €347 on ${r || '/'}`,
        pass: !has347,
        actual: has347 ? `…${context347}…` : '0',
      }, page)

      // Forbidden 5-tier phrasing
      const fiveTierMatchers = [
        /\b5\s+tiers?\b/i,
        /\bfive\s+tiers?\b/i,
        /\bcinco\s+tiers?\b/i,
        /\b5\s+niveaus?\b/i,
        /\bvijf\s+tiers?\b/i,
        /\bcinco\s+niveles?\b/i,
      ]
      const fiveHit = fiveTierMatchers.find((re) => re.test(combined))
      let fiveContext = ''
      if (fiveHit) {
        const idx = combined.search(fiveHit)
        fiveContext = combined.slice(Math.max(0, idx - 40), idx + 80)
      }
      await record({
        group: 'G7 cross-cutting copy',
        locale,
        name: `NO "5 tiers / five tiers / cinco tiers / 5 niveaus" on ${r || '/'}`,
        pass: !fiveHit,
        actual: fiveHit ? `…${fiveContext}…` : '0',
      }, page)

      await ctx.close()
    }
  }
}

// ---------------------------------------------------------------------------
// Group 8 — Build hygiene (console / page errors mentioning Partner refs)
// ---------------------------------------------------------------------------
async function group8BuildHygiene(browser) {
  /** @type {{ kind:string, msg:string }[]} */
  const errors = []
  const ctx = await browser.newContext({ viewport: DESKTOP_VIEWPORT })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push({ kind: 'pageerror', msg: e.message + ' ' + (e.stack || '') }))
  page.on('console', (m) => { if (m.type() === 'error') errors.push({ kind: 'console', msg: m.text() }) })

  for (const route of ['/nl', '/nl/pricing', '/nl/apply', '/nl/skills/voice-agent', '/nl/skills/ad-creator', '/nl/skills/blog-factory', '/nl/founding-member']) {
    try { await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT }) }
    catch {}
    await page.waitForTimeout(600)
  }

  const partnerErrors = errors.filter((e) =>
    /\bPartner\b|tierOptions\.partner|partnerStaticAds|partnerManychat|partnerTopUp/i.test(e.msg)
  )
  await record({
    group: 'G8 build hygiene',
    locale: 'na',
    name: 'no console/page errors mentioning Partner refs',
    pass: partnerErrors.length === 0,
    actual: partnerErrors.length === 0 ? '0' : JSON.stringify(partnerErrors).slice(0, 500),
  }, page)

  // Persist full error log for debugging
  await writeFile(join(OUT_DIR, 'console-errors.json'), JSON.stringify({ errors, partnerErrors }, null, 2)).catch(() => {})

  await ctx.close()
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
async function probeServer() {
  for (let i = 0; i < 30; i++) {
    try {
      const r = await fetch(`${BASE_URL}/nl`, { redirect: 'manual' })
      if (r.status >= 200 && r.status < 500) return true
    } catch {}
    await new Promise((r) => setTimeout(r, 2000))
  }
  return false
}

async function main() {
  await ensureDir(OUT_DIR)

  const baseUp = await probeServer()
  if (!baseUp) {
    await record({ group: 'Bootstrap', locale: 'na', name: `${BASE_URL}/nl is reachable`, pass: false, actual: 'unreachable' })
    await writeReport()
    process.exit(2)
  }
  await record({ group: 'Bootstrap', locale: 'na', name: `${BASE_URL}/nl is reachable`, pass: true, actual: 'ok' })

  const browser = await chromium.launch()
  try {
    await group1TierCards(browser)
    await group2Matrix(browser)
    await group3SkillPages(browser)
    await group4ApplyForm(browser)
    await group5ChatbotKB(browser)
    await group6JsonLd(browser)
    await group7CrossCutting(browser)
    await group8BuildHygiene(browser)
  } finally {
    await browser.close()
  }

  await writeReport()
  const failed = results.filter((r) => !r.pass).length
  process.exit(failed === 0 ? 0 : 1)
}

async function writeReport() {
  const duration = Math.round((Date.now() - startedAt) / 1000)
  const summary = {
    base_url: BASE_URL,
    started_at: new Date(startedAt).toISOString(),
    duration_seconds: duration,
    total: results.length,
    passed: results.filter((r) => r.pass).length,
    failed: results.filter((r) => !r.pass).length,
    results,
  }
  await ensureDir(OUT_DIR)
  await writeFile(join(OUT_DIR, 'report.json'), JSON.stringify(summary, null, 2), 'utf-8')
  // eslint-disable-next-line no-console
  console.log(`\n=== Partner-removal validation summary ===`)
  console.log(`Total: ${summary.total} | Passed: ${summary.passed} | Failed: ${summary.failed} | ${duration}s`)
  console.log(`Report: ${join(OUT_DIR, 'report.json')}`)
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('Fatal:', e)
  writeReport().finally(() => process.exit(3))
})
