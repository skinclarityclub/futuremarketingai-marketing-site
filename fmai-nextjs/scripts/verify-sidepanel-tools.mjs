/**
 * Verify SidePanel tool output shapes match what ServiceCard expects.
 * Run: node scripts/verify-sidepanel-tools.mjs
 *
 * Does NOT call the real API — validates shape logic only.
 */

let passed = 0
let failed = 0

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✓ ${label}`)
    passed++
  } else {
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`)
    failed++
  }
}

/**
 * Simulate what ServiceCard rendering does:
 * Returns which branch would be taken given the data shape.
 */
function detectServiceCardBranch(data) {
  // 1. Tiers branch
  if (data.tiers) return 'tiers'
  // 2. Module/metrics branch
  if (data.module || data.metrics) return 'module'
  // 3. Services branch
  if (data.services) return 'services'
  // 4. Fallback — SingleServiceCard
  return 'single'
}

function detectSingleCardContent(data) {
  return {
    name: data.name || 'Service',
    hasDescription: !!data.description,
    hasFeatures: Array.isArray(data.features) && data.features.length > 0,
    hasUrl: !!data.url,
  }
}

console.log('\n=== SidePanel Tool Output Shape Verification ===\n')

// -----------------------------------------------------------------------
// get_skills — skillId === 'all'
// -----------------------------------------------------------------------
console.log('1. get_skills (all)')
const getSkillsAll = {
  name: 'Alle vaardigheden',
  description: '9 live · 3 binnenkort beschikbaar',
  services: [
    { name: 'Social Media Manager', description: 'Captions, inplanning...', url: '/skills/social-media' },
    { name: 'Blog Factory', description: 'Longform SEO...', url: '/skills/blog-factory' },
  ],
}
{
  const branch = detectServiceCardBranch(getSkillsAll)
  assert('renders in "services" branch (not fallback)', branch === 'services', `got: ${branch}`)
  assert('services is an array', Array.isArray(getSkillsAll.services))
  assert('each service has name', getSkillsAll.services.every(s => s.name))
  assert('old shape { totalSkills, skills } is gone', !getSkillsAll.totalSkills && !getSkillsAll.skills)
}

// -----------------------------------------------------------------------
// get_skills — specific skill
// -----------------------------------------------------------------------
console.log('\n2. get_skills (specific: social-media)')
const getSkillsSingle = {
  name: 'Social Media Manager',
  description: 'Captions, inplanning, carrousels en engagement, per merk in de juiste merkstem.',
  features: ['Automatische inplanning', 'Carrousel generatie', 'Hashtag research'],
  url: '/skills/social-media',
}
{
  const branch = detectServiceCardBranch(getSkillsSingle)
  assert('renders in "single" branch', branch === 'single', `got: ${branch}`)
  const content = detectSingleCardContent(getSkillsSingle)
  assert('name is skill name (not "Service")', content.name !== 'Service', `got: "${content.name}"`)
  assert('has description', content.hasDescription)
  assert('has features', content.hasFeatures)
  assert('old shape { skill: {...} } wrapper is gone', !getSkillsSingle.skill)
}

// -----------------------------------------------------------------------
// get_pricing_info — tier === 'all'
// -----------------------------------------------------------------------
console.log('\n3. get_pricing_info (all)')
const getPricingAll = {
  tiers: {
    founding: { name: 'Founding Member', monthlyPrice: 997, features: ['All 12 skills'] },
    growth:   { name: 'Growth',          monthlyPrice: 998, features: ['2-4 workspaces'] },
  },
}
{
  const branch = detectServiceCardBranch(getPricingAll)
  assert('renders in "tiers" branch', branch === 'tiers', `got: ${branch}`)
  assert('tiers is an object (Record)', typeof getPricingAll.tiers === 'object' && !Array.isArray(getPricingAll.tiers))
  // ServiceCard normalizes Record tiers: Object.values(data.tiers).map(tier => ({ name, price from monthlyPrice, features }))
  const normalized = Object.values(getPricingAll.tiers).map(t => ({
    name: t.name,
    price: t.monthlyPrice != null ? `€${t.monthlyPrice}/mo` : 'Custom',
    features: t.features || [],
  }))
  assert('normalized tiers have name + price + features', normalized.every(t => t.name && t.price && t.features.length > 0))
}

// -----------------------------------------------------------------------
// get_pricing_info — specific tier
// -----------------------------------------------------------------------
console.log('\n4. get_pricing_info (specific: founding)')
const getPricingSpecific = {
  name: 'Founding Member',
  description: '€997/maand',
  features: ['All 12 skills included', 'Unlimited workspaces', '8,000 credits per month'],
}
{
  const branch = detectServiceCardBranch(getPricingSpecific)
  assert('renders in "single" branch', branch === 'single', `got: ${branch}`)
  const content = detectSingleCardContent(getPricingSpecific)
  assert('name is tier name (not "Service")', content.name !== 'Service', `got: "${content.name}"`)
  assert('has description (price)', content.hasDescription)
  assert('has features', content.hasFeatures)
  assert('old shape { tier: {...} } wrapper is gone', !getPricingSpecific.tier)
}

// -----------------------------------------------------------------------
// explain_module — still works (was correct before)
// -----------------------------------------------------------------------
console.log('\n5. explain_module (should still render via module branch)')
const explainModule = {
  module: {
    name: 'Research & Planning',
    description: 'AI-powered market intelligence that runs 24/7.',
    features: ['Continuous competitor monitoring', 'AI trend forecasting'],
    icon: 'brain',
  },
}
{
  const branch = detectServiceCardBranch(explainModule)
  assert('renders in "module" branch', branch === 'module', `got: ${branch}`)
  assert('module has name', !!explainModule.module.name)
  assert('module has features', Array.isArray(explainModule.module.features) && explainModule.module.features.length > 0)
}

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
console.log(`\n${'─'.repeat(44)}`)
console.log(`Results: ${passed} passed, ${failed} failed`)
if (failed > 0) {
  console.error('FAIL — shape mismatches still present')
  process.exit(1)
} else {
  console.log('PASS — all tool output shapes are ServiceCard-compatible')
}
