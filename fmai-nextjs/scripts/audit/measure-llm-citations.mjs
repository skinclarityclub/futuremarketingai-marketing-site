#!/usr/bin/env node
/**
 * measure-llm-citations.mjs
 *
 * SOTA GEO citation measurement — tracks whether LLMs cite FutureMarketingAI
 * when answering relevant queries. Run before + after GEO changes (Wikidata
 * activation, llms.txt updates, schema changes) to measure delta.
 *
 * Uses Gemini 2.5 Flash with Google Search grounding. Grounding returns explicit
 * citation URLs, so we can see precisely whether future-marketing.ai is surfaced.
 *
 * Env resolution (first hit wins):
 *   1. process.env.GEMINI_API_KEY
 *   2. <cwd>/.env.local  →  GEMINI_API_KEY=...
 *   3. ~/.claude/.env    →  GEMINI_API_KEY=...
 *
 * Usage:
 *   node scripts/audit/measure-llm-citations.mjs
 *   node scripts/audit/measure-llm-citations.mjs --label "post-wikidata"
 *   node scripts/audit/measure-llm-citations.mjs --queries 3        # run first N queries only
 *   node scripts/audit/measure-llm-citations.mjs --no-save          # skip JSON output
 *
 * Output:
 *   - Console table with per-query results
 *   - test-results/geo/citations-{label}-{timestamp}.json
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { resolve, join } from 'path'

// ---------------------------------------------------------------------------
// Env loading
// ---------------------------------------------------------------------------

function loadEnvFile(path) {
  if (!existsSync(path)) return
  const txt = readFileSync(path, 'utf-8')
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i)
    if (!m) continue
    if (process.env[m[1]]) continue
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

loadEnvFile(resolve(process.cwd(), '.env.local'))
loadEnvFile(join(homedir(), '.claude', '.env'))

const API_KEY = process.env.GEMINI_API_KEY?.trim()
if (!API_KEY) {
  console.error('Missing GEMINI_API_KEY (checked: env, ./.env.local, ~/.claude/.env)')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
const labelIdx = args.indexOf('--label')
const label = labelIdx >= 0 ? args[labelIdx + 1] : 'baseline'
const queriesIdx = args.indexOf('--queries')
const maxQueries = queriesIdx >= 0 ? parseInt(args[queriesIdx + 1], 10) : Infinity
const noSave = args.includes('--no-save')

// ---------------------------------------------------------------------------
// Brand signals — what to look for in LLM responses
// ---------------------------------------------------------------------------

const BRAND_SIGNALS = [
  { term: 'FutureMarketingAI',       weight: 3 },
  { term: 'Future Marketing AI',     weight: 3 },
  { term: 'future-marketing.ai',     weight: 3 },
  { term: 'FMai',                    weight: 2 },
  { term: 'Clyde',                   weight: 2 },
  { term: 'AI Marketing Medewerker', weight: 2 },
  { term: 'AI Marketing Employee',   weight: 2 },
  { term: 'Daley',                   weight: 1 },
  { term: 'SkinClarity',             weight: 1 },
  { term: '12 skills',               weight: 1 },
  { term: '12 vaardigheden',         weight: 1 },
  { term: 'Founding Member',         weight: 1 },
  { term: 'Founding Lid',            weight: 1 },
]

const CITATION_DOMAIN = 'future-marketing.ai'

// Max weighted score per query (all signals hit once)
const MAX_SIGNAL_SCORE = BRAND_SIGNALS.reduce((s, b) => s + b.weight, 0)

// ---------------------------------------------------------------------------
// Queries — mix of branded, category, and intent-based
// ---------------------------------------------------------------------------

const QUERIES = [
  // Branded
  {
    id: 'brand-direct',
    label: 'Brand: direct lookup',
    query: 'What is FutureMarketingAI and what does it do?',
    category: 'branded',
  },
  {
    id: 'brand-domain',
    label: 'Brand: domain lookup',
    query: 'What is future-marketing.ai?',
    category: 'branded',
  },
  {
    id: 'brand-product',
    label: 'Brand: product (Clyde)',
    query: 'What is Clyde AI Marketing Medewerker?',
    category: 'branded',
  },
  // Category — competitor context
  {
    id: 'category-nl-agencies',
    label: 'Category: AI marketing NL agencies',
    query: 'What AI marketing automation tools or solutions exist for marketing agencies in the Netherlands?',
    category: 'category',
  },
  {
    id: 'category-ai-employee',
    label: 'Category: AI marketing employee concept',
    query: 'Which companies offer an AI Marketing Employee or persistent AI marketing partner for agencies?',
    category: 'category',
  },
  {
    id: 'category-eu-agency-ai',
    label: 'Category: EU-native AI agency tools',
    query: 'What EU-native AI marketing platforms exist for agencies that are GDPR compliant?',
    category: 'category',
  },
  // Intent-based
  {
    id: 'intent-find-solution',
    label: 'Intent: find AI marketing partner',
    query: 'I run a marketing agency and want an AI employee to handle social media, blogs and ads for my clients. What exists?',
    category: 'intent',
  },
]

// ---------------------------------------------------------------------------
// Gemini API call
// ---------------------------------------------------------------------------

const MODEL = 'gemini-2.5-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`

async function queryGemini(query, retries = 3) {
  const body = {
    contents: [{ role: 'user', parts: [{ text: query }] }],
    tools: [{ google_search: {} }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
  }

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    // Retry on 429 (rate limit) and 503 (overloaded) with backoff
    if ((res.status === 429 || res.status === 503) && retries > 0) {
      let waitMs = 20000 // default 20s
      try {
        const errJson = JSON.parse(errText)
        const retryDelay = errJson?.error?.details?.find(d => d.retryDelay)?.retryDelay
        if (retryDelay) waitMs = (parseInt(retryDelay) + 2) * 1000
      } catch {}
      process.stdout.write(` [rate-limited, waiting ${Math.round(waitMs / 1000)}s] `)
      await new Promise(r => setTimeout(r, waitMs))
      return queryGemini(query, retries - 1)
    }
    throw new Error(`Gemini ${res.status}: ${errText}`)
  }

  const data = await res.json()
  const candidate = data.candidates?.[0]
  const text = candidate?.content?.parts?.map(p => p.text).filter(Boolean).join('\n') ?? ''
  const citations = (candidate?.groundingMetadata?.groundingChunks ?? [])
    .map(c => ({ title: c.web?.title ?? '', url: c.web?.uri ?? '' }))
    .filter(c => c.url || c.title)

  return { text, citations }
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

function scoreResponse(text, citations) {
  const combined = [text, ...citations.map(c => c.url + ' ' + c.title)].join(' ')

  const signals = BRAND_SIGNALS.map(({ term, weight }) => {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const hits = (combined.match(regex) ?? []).length
    return { term, weight, hits, scored: hits > 0 ? weight : 0 }
  })

  const signalScore = signals.reduce((s, b) => s + b.scored, 0)
  // Gemini wraps real URLs in vertexaisearch.cloud.google.com redirect URLs.
  // The actual domain is preserved in the title — check both.
  const isCited = c => c.url.includes(CITATION_DOMAIN) || c.title.toLowerCase().includes(CITATION_DOMAIN)
  const citationHit = citations.some(isCited)
  const citationUrls = citations.filter(isCited).map(c => c.title || c.url)

  return {
    signalScore,
    maxSignalScore: MAX_SIGNAL_SCORE,
    signalPct: Math.round((signalScore / MAX_SIGNAL_SCORE) * 100),
    citationHit,
    citationUrls,
    signals: signals.filter(s => s.hits > 0),
    allCitations: citations,
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const queriesToRun = QUERIES.slice(0, maxQueries)
const results = []
const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')

console.log(`\n=== GEO Citation Audit — ${label} (${MODEL}) ===`)
console.log(`Queries: ${queriesToRun.length} / ${QUERIES.length}`)
console.log(`Time: ${new Date().toLocaleString('nl-NL')}\n`)

let totalSignalScore = 0
let totalMaxScore = 0
let totalCitationHits = 0

for (const q of queriesToRun) {
  process.stdout.write(`[${q.id}] ${q.label} ... `)
  const started = Date.now()

  try {
    const { text, citations } = await queryGemini(q.query)
    const score = scoreResponse(text, citations)
    const elapsed = ((Date.now() - started) / 1000).toFixed(1)

    totalSignalScore += score.signalScore
    totalMaxScore += score.maxSignalScore
    if (score.citationHit) totalCitationHits++

    const citIcon = score.citationHit ? '✓ CITED' : '✗ not cited'
    console.log(`${elapsed}s | signals ${score.signalScore}/${score.maxSignalScore} (${score.signalPct}%) | ${citIcon}`)

    if (score.citationHit) {
      for (const url of score.citationUrls) {
        console.log(`    CITATION: ${url}`)
      }
    }

    if (score.signals.length > 0) {
      const terms = score.signals.map(s => `${s.term}(×${s.hits})`).join(', ')
      console.log(`    Signals:  ${terms}`)
    }

    if (score.allCitations.length > 0) {
      const domains = [...new Set(score.allCitations.map(c => {
        try { return new URL(c.url).hostname.replace('www.', '') } catch { return c.url }
      }))].slice(0, 5)
      console.log(`    Sources:  ${domains.join(', ')}`)
    }

    results.push({
      id: q.id,
      label: q.label,
      category: q.category,
      query: q.query,
      elapsed_s: Number(elapsed),
      score,
      response_preview: text.slice(0, 400),
    })

  } catch (err) {
    console.log(`ERROR: ${err.message}`)
    results.push({ id: q.id, label: q.label, category: q.category, query: q.query, error: err.message })
  }

  // Rate limit: 15s between queries (Gemini free tier = 5 req/min)
  if (queriesToRun.indexOf(q) < queriesToRun.length - 1) {
    await new Promise(r => setTimeout(r, 15000))
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

const overallSignalPct = totalMaxScore > 0 ? Math.round((totalSignalScore / totalMaxScore) * 100) : 0
const citationRate = Math.round((totalCitationHits / queriesToRun.length) * 100)

console.log('\n' + '─'.repeat(60))
console.log('SUMMARY')
console.log('─'.repeat(60))
console.log(`Citation rate:  ${totalCitationHits}/${queriesToRun.length} queries (${citationRate}%)`)
console.log(`Signal score:   ${totalSignalScore}/${totalMaxScore} (${overallSignalPct}%)`)
console.log(`Model:          ${MODEL} with Google Search grounding`)
console.log(`Label:          ${label}`)

if (citationRate === 0) {
  console.log('\nStatus: NOT CITED — site not surfaced by Gemini search grounding')
  console.log('Actions: ensure Wikidata item live, llms.txt indexed, schema deployed')
} else if (citationRate < 30) {
  console.log('\nStatus: LOW CITATION — sporadic mentions')
  console.log('Actions: expand llms-full.txt, add more GEO signals, wait for Wikidata to propagate')
} else if (citationRate < 70) {
  console.log('\nStatus: PARTIAL CITATION — good for branded queries, category needs work')
} else {
  console.log('\nStatus: STRONG CITATION — well-represented across query types')
}

// ---------------------------------------------------------------------------
// Save JSON
// ---------------------------------------------------------------------------

if (!noSave) {
  const outDir = resolve(process.cwd(), 'test-results', 'geo')
  mkdirSync(outDir, { recursive: true })
  const outFile = join(outDir, `citations-${label}-${timestamp}.json`)
  const report = {
    meta: {
      label,
      timestamp: new Date().toISOString(),
      model: MODEL,
      queries_run: queriesToRun.length,
      citation_domain: CITATION_DOMAIN,
    },
    summary: {
      citation_rate_pct: citationRate,
      citations_hit: totalCitationHits,
      total_queries: queriesToRun.length,
      signal_score: totalSignalScore,
      signal_max: totalMaxScore,
      signal_pct: overallSignalPct,
    },
    results,
  }
  writeFileSync(outFile, JSON.stringify(report, null, 2))
  console.log(`\nSaved: ${outFile}`)
}
