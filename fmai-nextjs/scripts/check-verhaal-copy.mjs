#!/usr/bin/env node
/**
 * Toetst de site-copy aan het FMai-verhaal (fma-app spec 2026-10-12-fmai-verhaal-ai-collega-design.md,
 * §3.6 woorden, §8 site). Exit 1 met een lijst als er iets staat dat niet mag.
 *
 * Scant messages/*.json (per sleutel), src/**\/*.{ts,tsx} en public/llms*.txt (per regel).
 * NIET content/blog: die artikelen liggen als aparte vraag bij Daley.
 *
 * Gebruik: node scripts/check-verhaal-copy.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const LOCALES = ['nl', 'en', 'es']

const RULES = [
  { id: 'woord', re: /medewerker|werknemer|employee|empleado/i },
  { id: 'eu', re: /100 ?% ?(EU|UE)|US-clouds?|US clouds?|nubes (de )?EE\.? ?UU/i },
  { id: 'volume', re: /36 posts|36 per week|21 carrousels|21 carousels|21 carruseles|5[.,]000 ?\/ ?(maand|month|mes)|(EUR|€) ?5[.,]000\b|\+18 ?%|\+34 ?%/i },
  { id: 'personeel', re: /zonder extra personeel|extra headcount|sin contratar más personal/i },
  { id: 'icp', re: /5 tot 30|10 tot 50|5 to 30|10 to 50|5 a 30|10 a 50/i },
  { id: 'concurrent', re: /\bAI Collega/ },
  { id: 'placeholder', re: /\[DALEY:/ },
]

// Woorden over MENSEN (de bureaumedewerkers in de AI-scan, escalatie naar een mens) horen er wel.
const ALLOW = [
  { where: /^messages\/\w+\.json:assessment\./, re: /medewerker|employee|empleado/i },
  { where: /skills-data.ts:/, re: /menselijke medewerker/i },
  { where: /leadgen-tools.ts:/, re: /employees at the company/i },
  { where: /assessment-templates.ts:/, re: /beste medewerker|mejor empleado|best employee/i },
  // zoekwoord waarop de chatbot een vraag over aannemen herkent
  { where: /support-kb.ts:/, re: /^'employee',$/ },
  // woorden waaraan fit.ts het aantal mensen herkent dat de bezoeker typt ("8 medewerkers")
  { where: /chatbot\/fit.ts:/, re: /^people: "mensen\|/ },
  // samenvattingen van blogartikelen: volgen het besluit over content/blog
  { where: /llms-full\.txt:/, re: /\/kennisbank\// },
  // de chatbot-instructie die het woord juist verbiedt
  { where: /chatbot\//, re: /never call (him|yourself) an employee/i },
]

const allowed = (where, text) => ALLOW.some((a) => a.where.test(where) && a.re.test(text))
// slugs en ids (blogartikel, glossary-anker) blijven staan, anders breken URL's
const stripSlugs = (text) => text.replace(/ai-marketing-medewerker[\w-]*/g, '')

function flatten(obj, prefix, out) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object') flatten(v, key, out)
    else out.set(key, String(v))
  }
  return out
}

function walk(dir, exts, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, exts, out)
    else if (exts.some((e) => name.endsWith(e))) out.push(p)
  }
  return out
}

const hits = []
const check = (where, text) => {
  for (const r of RULES) if (r.re.test(stripSlugs(text)) && !allowed(where, text)) hits.push(`${r.id.padEnd(11)} ${where}  ${text.slice(0, 140)}`)
}

const keysets = {}
for (const l of LOCALES) {
  const file = `messages/${l}.json`
  const flat = flatten(JSON.parse(readFileSync(join(ROOT, file), 'utf8')), '', new Map())
  keysets[l] = new Set(flat.keys())
  for (const [k, v] of flat) check(`${file}:${k}`, v)
}
for (const l of LOCALES.slice(1)) {
  for (const k of keysets.nl) if (!keysets[l].has(k)) hits.push(`sleutel     messages/${l}.json mist ${k}`)
  for (const k of keysets[l]) if (!keysets.nl.has(k)) hits.push(`sleutel     messages/${l}.json heeft extra ${k}`)
}

const files = [
  ...walk(join(ROOT, 'src'), ['.ts', '.tsx']),
  ...readdirSync(join(ROOT, 'public')).filter((n) => /^llms.*\.txt$/.test(n)).map((n) => join(ROOT, 'public', n)),
]
for (const f of files) {
  const rel = relative(ROOT, f).replaceAll('\\', '/')
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => check(`${rel}:${i + 1}`, line.trim()))
}

if (hits.length) {
  console.log(hits.join('\n'))
  console.log(`\n${hits.length} treffer(s).`)
  process.exit(1)
}
console.log('check-verhaal-copy: schoon')
