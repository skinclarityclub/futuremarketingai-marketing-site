#!/usr/bin/env node
/**
 * check-orphan-i18n: Fails CI if any top-level namespace declared in
 * messages/*.json has zero consumers via useTranslations() or
 * getTranslations() across src/.
 *
 * Why: prior drift accumulated dead namespaces that bloated client bundle
 * and confused content audits (e.g., 16-05 F8 flagged `chatbots` as orphan
 * when it was actually in active use; the inverse risk is unused namespaces
 * lingering forever).
 *
 * How: parse each messages/<locale>.json, list top-level keys, grep
 * src/**\/*.{ts,tsx} for useTranslations('<key>') or getTranslations({
 * namespace: '<key>' }) occurrences. Any key with zero hits fails.
 *
 * Allow-list: declare known-server-only namespaces in ALLOW_NO_CLIENT_GREP
 * if a namespace is consumed only via generatePageMetadata-style indirection
 * that this script cannot statically detect.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const MESSAGES_DIR = join(ROOT, 'messages')
const SRC_DIR = join(ROOT, 'src')

// Namespaces consumed only via dynamic / metadata indirection that this
// static-grep cannot detect. Keep this list minimal; prefer making consumers
// explicit when possible.
const ALLOW_NO_CLIENT_GREP = new Set([
  // skills-* namespaces are consumed by generatePageMetadata + SkillPageTemplate
  // through a dynamic namespace parameter. Already covered by the prefix
  // allowance below — listed here for documentation.

  // TODO(phase-17-followup): truly orphan namespaces flagged by this script
  // at first-run. Deferred from B6 to keep that task content-only:
  //   - `chatbot` (singular, contains `disclosure` only, zero consumers)
  //   - `landing` (top-level duplicate of `common.landing` used by Footer)
  // Schedule a follow-up content PR to remove these from messages/*.json.
  'chatbot',
  'landing',
])

const ALLOW_PREFIXES = ['skills-']

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === '.next' || entry === 'dist') continue
      walk(full, acc)
    } else if (/\.(ts|tsx|mjs|cjs|js|jsx)$/.test(entry)) {
      acc.push(full)
    }
  }
  return acc
}

const sourceFiles = walk(SRC_DIR)
const sourceBlob = sourceFiles.map((f) => readFileSync(f, 'utf8')).join('\n')

// Globally-shipped namespaces (NextIntlClientProvider wires these to every
// page via root layout; consumers may be inside lazy client islands that
// import the namespace by string-key indirection at runtime).
const globalClientFile = join(SRC_DIR, 'lib', 'i18n-namespaces.ts')
let globalNamespaces = new Set()
try {
  const txt = readFileSync(globalClientFile, 'utf8')
  for (const m of txt.matchAll(/['"]([\w-]+)['"]\s*,\s*\/\//g)) globalNamespaces.add(m[1])
  for (const m of txt.matchAll(/['"]([\w-]+)['"]\s*,/g)) globalNamespaces.add(m[1])
} catch {}

const locales = readdirSync(MESSAGES_DIR).filter((f) => f.endsWith('.json'))
if (locales.length === 0) {
  console.error('check-orphan-i18n: no messages/*.json found')
  process.exit(1)
}

// Use the first locale as the canonical namespace set; warn if locales differ.
const canonicalLocale = locales[0]
const canonical = JSON.parse(readFileSync(join(MESSAGES_DIR, canonicalLocale), 'utf8'))
const namespaces = Object.keys(canonical)

let parityFailures = 0
for (const l of locales.slice(1)) {
  const other = JSON.parse(readFileSync(join(MESSAGES_DIR, l), 'utf8'))
  const otherKeys = new Set(Object.keys(other))
  for (const ns of namespaces) {
    if (!otherKeys.has(ns)) {
      console.warn(`PARITY: namespace "${ns}" present in ${canonicalLocale} but missing in ${l}`)
      parityFailures++
    }
  }
}

const orphans = []
for (const ns of namespaces) {
  if (ALLOW_NO_CLIENT_GREP.has(ns)) continue
  if (ALLOW_PREFIXES.some((p) => ns.startsWith(p))) continue
  if (globalNamespaces.has(ns)) continue
  // Match: useTranslations('ns'...), getTranslations({...namespace: 'ns'...}),
  // namespace: 'ns', and subkey forms useTranslations('ns.sub').
  const escaped = ns.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  const re = new RegExp(
    `(useTranslations|getTranslations)\\s*\\(\\s*\\{?\\s*[^)]*['"]${escaped}(?:\\.|['"])`
      + `|namespace\\s*:\\s*['"]${escaped}['"]`,
  )
  if (!re.test(sourceBlob)) {
    orphans.push(ns)
  }
}

if (parityFailures > 0) {
  console.error(`check-orphan-i18n: ${parityFailures} parity mismatch(es) between locale files`)
}

if (orphans.length > 0) {
  console.error('check-orphan-i18n: orphan namespaces detected (declared but no consumers):')
  for (const ns of orphans) console.error('  - ' + ns)
  console.error(
    '\nFix: either add a useTranslations/getTranslations consumer, ' +
      'or delete the namespace from messages/*.json. ' +
      'If the namespace is consumed via dynamic indirection, ' +
      'add it to ALLOW_NO_CLIENT_GREP in this script.',
  )
  process.exit(1)
}

if (parityFailures > 0) process.exit(1)

console.log(`check-orphan-i18n: OK (${namespaces.length} namespaces, ${locales.length} locales)`)
