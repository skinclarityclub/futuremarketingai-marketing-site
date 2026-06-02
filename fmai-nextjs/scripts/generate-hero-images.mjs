#!/usr/bin/env node
/**
 * FMai kennisbank hero-image generator (OpenAI gpt-image-1).
 *
 * WHY: every cornerstone shared the generic /og-image.png — weak Article rich-result
 * + social/LLM citation signal. This generates a per-article, brand-consistent
 * abstract hero (dark #0a0d14 + teal #00d4aa / amber #f5a623), writes it to
 * public/blog/<slug>.jpg, and points the MDX `heroImage` frontmatter at it.
 *
 * REUSE: `buildHeroPrompt({ slug, category })` is the single source of the FMai
 * visual prompt. The multi-tenant Blog Factory's FMai-tenant image node should call
 * this same logic (port or shell out) so auto-generated posts are born on-brand.
 *
 * Usage:
 *   node scripts/generate-hero-images.mjs            # all 14 NL cornerstones (skips existing)
 *   node scripts/generate-hero-images.mjs --force    # regenerate even if image exists
 *   node scripts/generate-hero-images.mjs slug-a slug-b   # only these slugs
 *   node scripts/generate-hero-images.mjs --dry      # print prompts, no API calls
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const BLOG_DIR = join(ROOT, 'content', 'blog')
const OUT_DIR = join(ROOT, 'public', 'blog')

// ---- env: read OPENAI_API_KEY from .env.local without a dependency ----
function loadKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY
  for (const f of ['.env.local', '.env']) {
    const p = join(ROOT, f)
    if (!existsSync(p)) continue
    const m = readFileSync(p, 'utf8').match(/^OPENAI_API_KEY\s*=\s*["']?([^"'\r\n]+)/m)
    if (m) return m[1].trim()
  }
  return null
}

// ---- brand prompt (the reusable FMai visual contract) ----
// Each of the 4 hub buckets gets a DISTINCT, recognizable signature = palette + motif,
// so a reader can tell the category at a glance on the index thumbnails. Per-article
// micro-variation keeps posts within a bucket from looking identical. Brand-only colors
// (teal #00d4aa, amber #f5a623); purple/cyan-off-brand never introduced.
const CATEGORY_STYLE = {
  geo: {
    palette: 'Cool luminous teal-green light (#00d4aa) on a near-black background, no warm tones at all',
    motif: 'concentric circular signal waves rippling outward from a single bright point low in the frame, like a discovery pulse spreading across space',
  },
  'ai-marketing-automation': {
    palette: 'Teal-green light (#00d4aa) with cooler cyan highlights and a single faint warm amber thread for contrast, on near-black',
    motif: 'several evenly spaced parallel horizontal streams of light flowing across the frame from left to right, like an orchestration pipeline in motion',
  },
  'agency-ops': {
    palette: 'Warm amber-gold light (#f5a623) on a near-black background, no cool or teal tones at all',
    motif: 'ascending diagonal bands of light stepping upward from the lower-left to the upper-right, conveying growth and scale',
  },
  'product-clyde': {
    palette: 'Balanced teal-green (#00d4aa) and warm amber-gold (#f5a623) light of roughly equal strength',
    motif: 'two tall vertical columns of light, one teal and one amber, rising from the base and curving inward to converge toward the center',
  },
}

const VARIATIONS = [
  'rendered tighter and more focused',
  'rendered wider and more expansive',
  'rendered softer and more diffuse',
  'rendered with crisper, brighter cores',
]

const MOODS = {
  'geo-generative-engine-optimization': 'discovery and being found by intelligent systems',
  'geo-vs-seo-waar-investeren-2026': 'a crossroads of two converging paths',
  'zichtbaarheid-meten-ai-overviews': 'measurement and emerging signal clarity',
  'geo-monitoring-tools-chatgpt-perplexity': 'instruments, monitoring and watchful precision',
  'ai-marketing-automation-voor-bureaus': 'orchestration and an engine at scale',
  'wat-is-een-ai-marketing-medewerker': 'a present, capable digital colleague',
  'clyde-vs-jasper-chatgpt-semrush': 'distinction and standing apart',
  'marketingbureau-schalen-met-ai': 'growth that breaks a linear limit',
  'ai-efficientie-marketingbureau': 'effortless flow and efficiency',
  'meetbare-ai-marketing-resultaten': 'measurable, rising proof',
  'ai-marketing-resultaat-in-de-praktijk': 'real-world momentum and traction',
  'ai-marketing-medewerker': 'a foundational, defining category',
  'ai-agent-vs-ai-tool-marketing': 'a clear boundary between two natures',
  'ai-marketing-agent-geheugen-en-leren': 'layered memory and learning over time',
}

const DEFAULT_SLUGS = Object.keys(MOODS)

export function buildHeroPrompt({ slug, category, index = 0 }) {
  const style = CATEGORY_STYLE[category] || CATEGORY_STYLE.geo
  const variation = VARIATIONS[index % VARIATIONS.length]
  const mood = MOODS[slug] || 'intelligent, premium and forward-looking'
  return [
    'A premium abstract background image for a B2B AI-marketing knowledge article.',
    'Absolutely no text, no letters, no words, no numbers, no logos, no UI elements, no human figures, and no recognizable physical objects.',
    'Deep near-black background, color #0a0d14.',
    style.palette + '.',
    'Composition: ' + style.motif + ', ' + variation + '.',
    'Fine subtle grid lines and a faint particle and bokeh field, soft volumetric glow, cinematic depth of field, premium editorial dark-tech aesthetic, high contrast, generous negative space, wide cinematic 3:2 composition.',
    'Mood: ' + mood + '.',
  ].join(' ')
}

function readFrontmatter(slug) {
  const p = join(BLOG_DIR, slug + '.mdx')
  const src = readFileSync(p, 'utf8')
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const block = fm ? fm[1] : ''
  const get = (k) => {
    const m = block.match(new RegExp('^' + k + ':\\s*["\']?([^"\'\\r\\n]+)', 'm'))
    return m ? m[1].trim() : null
  }
  return { path: p, src, category: get('category'), title: get('title'), heroImage: get('heroImage') }
}

function setHeroImage(slug, newHero) {
  const { path, src, heroImage } = readFrontmatter(slug)
  if (heroImage === newHero) return false
  // replace only the heroImage line inside the frontmatter
  const updated = src.replace(/^(heroImage:\s*)["'][^"'\r\n]*["']/m, `$1"${newHero}"`)
  if (updated === src) throw new Error(`heroImage line not found in ${slug}.mdx`)
  writeFileSync(path, updated)
  return true
}

async function generate(slug, key, { index, force, dry }) {
  const { category } = readFrontmatter(slug)
  const prompt = buildHeroPrompt({ slug, category, index })
  const outPath = join(OUT_DIR, slug + '.jpg')
  if (dry) { console.log(`\n[${slug}] (${category})\n${prompt}`); return { slug, skipped: 'dry' } }
  if (existsSync(outPath) && !force) { console.log(`= skip ${slug} (exists)`); setHeroImage(slug, `/blog/${slug}.jpg`); return { slug, skipped: 'exists' } }

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      n: 1,
      size: '1536x1024',
      quality: 'high',
      output_format: 'jpeg',
      output_compression: 85,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`OpenAI ${res.status} for ${slug}: ${body.slice(0, 400)}`)
  }
  const json = await res.json()
  const b64 = json?.data?.[0]?.b64_json
  if (!b64) throw new Error(`No image data for ${slug}: ${JSON.stringify(json).slice(0, 300)}`)
  writeFileSync(outPath, Buffer.from(b64, 'base64'))
  const wired = setHeroImage(slug, `/blog/${slug}.jpg`)
  console.log(`✓ ${slug}.jpg (${(Buffer.from(b64, 'base64').length / 1024).toFixed(0)} KB)${wired ? ' + frontmatter' : ''}`)
  return { slug, ok: true }
}

async function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const dry = args.includes('--dry')
  const slugs = args.filter((a) => !a.startsWith('--'))
  const targets = slugs.length ? slugs : DEFAULT_SLUGS

  const key = loadKey()
  if (!key && !dry) { console.error('No OPENAI_API_KEY found in env or .env.local'); process.exit(1) }
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

  // validate slugs exist
  const have = new Set(readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx')).map((f) => f.replace('.mdx', '')))
  for (const s of targets) if (!have.has(s)) { console.error(`Unknown slug: ${s}`); process.exit(1) }

  console.log(`Generating ${targets.length} hero image(s)${dry ? ' (dry run)' : ''}...`)
  const CONCURRENCY = 4
  const results = []
  for (let i = 0; i < targets.length; i += CONCURRENCY) {
    const batch = targets.slice(i, i + CONCURRENCY)
    const settled = await Promise.allSettled(
      batch.map((slug, j) => generate(slug, key, { index: i + j, force, dry }))
    )
    settled.forEach((r, j) => {
      if (r.status === 'rejected') { console.error(`✗ ${batch[j]}: ${r.reason?.message || r.reason}`); results.push({ slug: batch[j], error: String(r.reason?.message || r.reason) }) }
      else results.push(r.value)
    })
  }
  const ok = results.filter((r) => r.ok).length
  const skipped = results.filter((r) => r.skipped).length
  const failed = results.filter((r) => r.error)
  console.log(`\nDone: ${ok} generated, ${skipped} skipped, ${failed.length} failed.`)
  if (failed.length) process.exit(1)
}

main().catch((e) => { console.error(e); process.exit(1) })
