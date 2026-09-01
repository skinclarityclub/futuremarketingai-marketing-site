#!/usr/bin/env node
/**
 * check-llms-consistency: fails when public/llms.txt or llms-full.txt contradicts
 * the source of truth in src/lib/.
 *
 * Why: these two files are hand-written prose that restates facts owned by
 * skills-data.ts and constants.ts. Nothing bound them together, so they drifted —
 * measured 2026-09-01, all four live at once:
 *
 *   1. "Max 20 new partnerships per year" (6 occurrences) while
 *      MAX_PARTNERS_PER_YEAR was 10. The site said 10 everywhere else.
 *   2. "12 skills (9 live, 3 coming soon)" while the SSoT held 10 live and 2.
 *   3. Ad Creator, coming soon, at /nl/skills/ad-creator — the skill is called
 *      Ad Manager, is live, and lives at /nl/skills/ad-manager.
 *   4. Email Management sold as Gmail + Outlook while its own page says Outlook
 *      is roadmap.
 *
 * This matters more here than in ordinary copy. llms.txt exists to be read by
 * ChatGPT, Perplexity and Claude; a wrong number in it is a wrong number those
 * assistants repeat as fact about us. On 2026-09-01, eleven of twelve buyer
 * questions returned no mention of FMai at all — the one file written to fix
 * that was itself feeding bad data.
 *
 * Deliberately a checker, not a generator: llms-full.txt is 400+ lines of
 * editorial prose whose voice is worth keeping. Only the facts are asserted.
 *
 * Run: npm run check:llms
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (...p) => readFileSync(join(ROOT, ...p), 'utf-8')

const skillsSrc = read('src', 'lib', 'skills-data.ts')
const constantsSrc = read('src', 'lib', 'constants.ts')
const files = {
  'public/llms.txt': read('public', 'llms.txt'),
  'public/llms-full.txt': read('public', 'llms-full.txt'),
}

const failures = []
const fail = (msg) => failures.push(msg)

/** Reads `export const NAME = 123` out of constants.ts. */
function constant(name) {
  const m = new RegExp(`export const ${name}\\s*=\\s*(\\d+)`).exec(constantsSrc)
  if (!m) throw new Error(`${name} not found in constants.ts — did it get renamed?`)
  return Number(m[1])
}

// Skills come out of the SSoT in declaration order; each block carries id, name
// and status. Matching them together (rather than counting statuses separately)
// keeps a renamed skill from silently passing the count check.
const skills = []
const skillRe = /id:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?status:\s*'([^']+)'/g
for (let m; (m = skillRe.exec(skillsSrc)); ) {
  skills.push({ id: m[1], name: m[2], status: m[3] })
}
if (skills.length === 0) {
  throw new Error('No skills parsed from skills-data.ts — the shape changed, fix this script.')
}

const live = skills.filter((s) => s.status === 'live')
const soon = skills.filter((s) => s.status === 'coming_soon')
const maxPartners = constant('MAX_PARTNERS_PER_YEAR')
const spotsTaken = constant('FOUNDING_SPOTS_TAKEN')
const spotsTotal = constant('FOUNDING_SPOTS_TOTAL')

for (const [name, text] of Object.entries(files)) {
  // 1 — partnership cap. Catch any number claiming to be the yearly cap.
  for (const m of text.matchAll(/(\d+)\s+(?:new\s+)?partnerships?\s+per\s+year/gi)) {
    if (Number(m[1]) !== maxPartners) {
      fail(`${name}: "${m[0]}" contradicts MAX_PARTNERS_PER_YEAR = ${maxPartners}`)
    }
  }

  // 2 — skill counts, in whatever order the prose puts them.
  for (const m of text.matchAll(/(\d+)\s+live,\s*(\d+)\s+coming soon/gi)) {
    if (Number(m[1]) !== live.length || Number(m[2]) !== soon.length) {
      fail(
        `${name}: "${m[0]}" contradicts skills-data.ts ` +
          `(${live.length} live, ${soon.length} coming soon)`,
      )
    }
  }
  // Only counts that claim to be the whole catalogue. "6 of Clyde's 12 skills
  // active for SKC" is a per-client number and none of this check's business.
  for (const m of text.matchAll(/\b(?:runs|operates|all|of Clyde's)\s+(\d+)\s+skills\b/gi)) {
    if (Number(m[1]) !== skills.length) {
      fail(`${name}: "${m[0].trim()}" contradicts skills-data.ts (${skills.length} skills)`)
    }
  }

  // 3 — founding counter.
  for (const m of text.matchAll(/\((\d+)\s+spots?,\s*(\d+)\s+taken\)/gi)) {
    if (Number(m[1]) !== spotsTotal || Number(m[2]) !== spotsTaken) {
      fail(
        `${name}: "${m[0]}" contradicts constants.ts ` +
          `(${spotsTotal} spots, ${spotsTaken} taken)`,
      )
    }
  }

  // 4 — every /skills/<slug> URL must name a skill that exists. This is what
  // caught ad-creator: the URL 301'd to ad-manager, so it never 404'd, and the
  // redirect quietly pointed AI crawlers at a differently-named product.
  for (const m of text.matchAll(/\/skills\/([a-z0-9-]+)/g)) {
    if (!skills.some((s) => s.id === m[1])) {
      const known = skills.map((s) => s.id).join(', ')
      fail(`${name}: /skills/${m[1]} is not a skill id. Known ids: ${known}`)
    }
  }

  // 5 — a skill tagged with an explicit status marker must match its status.
  //
  // Only the file's two marker conventions count: "### Ad Manager (Live)" and
  // "- [Ad Manager](url): description. Live." Matching any nearby occurrence of
  // the word instead is what made an earlier revision of this check fail on the
  // sentence "12 skills from social media to voice agents ... all 10 live
  // skills active" — "Voice Agent" followed by "live" twenty words later is
  // prose, not a status claim.
  for (const s of skills) {
    const escaped = s.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const marker = new RegExp(
      `${escaped}\\s*\\((Live|Coming soon)\\)|${escaped}\\][^\\n]*?\\.\\s+(Live|Coming soon)\\.`,
      'gi',
    )
    for (const m of text.matchAll(marker)) {
      const word = m[1] ?? m[2]
      const claimed = /coming soon/i.test(word) ? 'coming_soon' : 'live'
      if (claimed !== s.status) {
        fail(`${name}: "${s.name}" is marked ${word} but skills-data.ts says ${s.status}`)
      }
    }
  }
}

if (failures.length > 0) {
  console.error('\nFAIL: llms.txt / llms-full.txt contradict the source of truth.\n')
  for (const f of failures) console.error('  - ' + f)
  console.error(
    '\nThese files are read by AI assistants as fact about FMai. Fix the prose,\n' +
      'or fix the constant if the prose is the one telling the truth.\n',
  )
  process.exit(1)
}

console.log(
  `OK: llms.txt + llms-full.txt agree with the SSoT ` +
    `(${skills.length} skills — ${live.length} live, ${soon.length} coming soon; ` +
    `max ${maxPartners} partners/year; ${spotsTaken}/${spotsTotal} founding spots).`,
)
