# Autonomous Execution Protocol — Phase 16

> Voor `/gsd:execute-phase 16`. Definieert decision rules, abort criteria, resume-flow, budget caps, en logging. Een autonome run mag NOOIT user-input vragen behalve bij hard-abort condities (zie § Hard abort).

## Pre-flight checks (run vóór elke wave)

Executor MUST verify, in deze volgorde, met expliciete exit-codes:

```powershell
# 1. Branch state
git rev-parse --abbrev-ref HEAD
# Expected: audit/2026-05-18-v2-sota (Wave 1+) of fix/audit-2026-05-18-followup (Wave 0)

# 2. Working tree clean (no untracked production code)
git diff --name-only main -- 'fmai-nextjs/src/' 'fmai-nextjs/messages/'
# Expected: empty

# 3. Gemini key (Google grounded research is the sole research provider)
node -e "console.log(!!process.env.GEMINI_API_KEY ? 'OK' : 'MISSING')"
# Required for plan 16-01 + 16-07 + 16-11 + 16-12. Skip-with-warning if missing on others.

# 4. Productie URL reachable
curl -sI https://future-marketing.ai | head -1
# Expected: HTTP/2 200 of HTTP/1.1 200

# 5. Lokale dev-server vereist vanaf 16-02
# Check: node -e "fetch('http://localhost:3000').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
# Indien down én plan-XX vereist: start eerst, dan wacht 60s

# 6. Playwright browsers
npx playwright --version
# Indien error: hard-abort plan 16-02, vraag user `npx playwright install`
```

## Decision rules (DRY: precedence top-down)

### Rule 1 — Skip on individual team failure

Wanneer een Wave-2 team-plan faalt (exit code ≠0 of timeout >120 min):

1. Mark plan-XX als `status: skipped` in `STATE.md`
2. Schrijf failure-stub doc `docs/audits/2026-05-18-v2/SKIPPED-{team}.md` met:
   - Failure-reason (exit code, last log lines, suspected cause)
   - Manual-followup commands (hoe user later kan runnen)
3. Continue met andere teams (parallel batch verlies geen werk)
4. Wave-3 synthesis-plan (16-15) noteert skipped teams in coverage-matrix
5. **Geen retry binnen Phase 16** — manual followup is post-phase werk

### Rule 2 — Soft warn, continue

Bij deze conditions: log waarschuwing in `STATE.md` + relevant doc, ga door:

- Gemini rate-limit (429, 250 RPD gratis tier): wacht 60s, retry 2×. Bij persistent: switch model van `flash` → `pro` (betaald maar separate quota) of fallback naar WebSearch tool indien beschikbaar
- Lighthouse run fails op individuele route: gebruik WebFetch PageSpeed Insights API als fallback
- Cross-browser test crash op WebKit (Windows quirk): skip WebKit shots voor die route, document
- Bundle size > soft-cap (3 GB): switch screenshots naar JPEG quality=80 ipv PNG voor remaining shots
- Cross-LLM citation matrix incompleet (<3 LLMs gerapporteerd succesvol): document gaps, ga door met 2 LLMs minimum
- TypeScript baseline check shows nieuwe errors die niet in audit-scope vallen: log + ga door (geen fix in Phase 16)

### Rule 3 — Adapt within scope

Mid-execution adjustments toegestaan zonder user-input:

- Viewport reductie van 5 naar 4 indien budget krap (drop 1920×1080 desktop-wide eerst)
- Locale reductie van 3 naar 2 (drop ES eerst, dan EN) — NL is authoritative
- Browser-engines reductie van 3 naar 2 (drop Firefox eerst, dan WebKit) — Chromium primary
- Routes-reductie alleen indien budget al >120% overschreden — drop in volgorde: `/logo-lab`, `/newsletter/confirm`, `/legal/cookies`

Alle adaptations gedocumenteerd in `00-executive-summary.md` § "Scope adaptations during execution".

### Rule 4 — Atomic commits per plan

Elke plan-XX-PLAN.md eindigt met EXACT één commit:

```bash
git add <files_modified_from_frontmatter>
git commit -m "docs(audit): 16-XX <plan title>" --no-verify=false
# Geen --no-verify, hooks moeten draaien
```

Indien hook fails: log naar STATE.md, mark plan failed (Rule 1), commit nooit met `--no-verify`.

## Hard abort criteria

Wanneer een van deze condities ZICH VOORDOET, stop alles, schrijf `ABORT-{timestamp}.md` met state, exit:

1. **Git branch creation fails** (Wave 1, 16-02 task 1) — repo state corrupt of permissions issue
2. **`fmai-nextjs/src/` of `fmai-nextjs/messages/` gewijzigd door audit-plan** — Rule 4 invariant breach
3. **Cumulative API spend > €5 EUR (soft cap from README budget)** — Gemini gratis tier dekt scope, spend duidt op verkeerd model of misconfiguratie
4. **Gemini quota uitgeput voor 24u (>200 calls used én >24u tot reset)** — wacht tot reset of vraag user
5. **Disk-usage > 5 GB** voor `test-results/audit-v2/` — risico op disk-full
5. **Productie URL >24u onbereikbaar** — kan geen production SEO/GEO audit doen
6. **Lokale dev-server crash-loop** (3× restart binnen 5 min) — code-state inconsistent
7. **Node/npm catastrophic state** (lock-file corrupt, modules nuked) — vereist user-resolve

In alle gevallen: schrijf `STATE.md`-update met last-completed-plan, abort-reason, recovery-instructions. NIET committen tenzij plan al af was.

## Resume protocol

Bij restart van `/gsd:execute-phase 16` na crash of interrupt:

1. Read `.planning/phases/16-design-seo-audit-v2-sota/STATE.md`
2. Identify last-completed plan-XX (where `status: completed`)
3. Identify in-flight plan-XX (where `status: in_progress`) — restart deze plan from scratch (atomic commits zorgen dat partial werk geen rommel laat)
4. Identify pending plans → resume execution order per wave
5. Indien Wave 2 deels af: complete Wave 2 eerst voordat Wave 3 start

STATE.md schema (per plan):
```yaml
plans:
  16-01:
    status: completed
    started: 2026-05-18T14:00:00Z
    finished: 2026-05-18T14:28:00Z
    commit: abc1234
  16-02:
    status: in_progress
    started: 2026-05-18T14:30:00Z
    last_checkpoint: "playwright spec written, dev-server up"
  16-03:
    status: pending
```

## Budget tracking

Append-only log in `.planning/phases/16-design-seo-audit-v2-sota/BUDGET.log`:

```
2026-05-18T14:05:23Z gemini-flash-grounded call 1 of 100 (query: "Top AI marketing agencies...")
2026-05-18T14:07:11Z gemini-flash-grounded call 2 of 100 (query: "Best-in-class SaaS landing pages...")
2026-05-18T14:12:44Z firecrawl-scrape call 1 of 80 (url: https://competitor-1.com)
2026-05-18T14:35:00Z disk_usage test-results/audit-v2 = 245 MB
```

Bij overschrijding soft cap (80% van max):
- Log warning naar STATE.md
- Schakel naar conservatieve fallbacks: JPEG quality=80 ipv PNG, drop 1920×1080 viewport eerst, reduce locales tot NL+EN
- Continue met conservatieve mode

## Playwright spec templates

Plan 16-02 (Setup) MOET deze 7 spec-templates exact volgen om Wave 2 teams werkbare artefacten te leveren:

### `tests/e2e/audit-v2-screenshots.spec.ts` (Chromium primary)

```ts
import { test, expect } from '@playwright/test';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROUTES = [
  '/', '/about', '/how-it-works', '/pricing', '/founding-member', '/contact',
  '/memory', '/apply', '/roadmap', '/assessment', '/assessment/result',
  '/case-studies/skinclarity-club',
  '/skills/clyde', '/skills/social-media', '/skills/blog-factory',
  '/skills/lead-qualifier', '/skills/email-management', '/skills/reporting',
  '/skills/manychat', '/skills/seo-geo', '/skills/research',
  '/skills/voice-agent', '/skills/ad-creator', '/skills/reel-builder',
  '/blog', '/legal', '/legal/privacy', '/legal/cookies', '/legal/terms',
  '/newsletter/confirm', '/logo-lab',
];
const LOCALES = ['nl', 'en', 'es'];
const VIEWPORTS = [
  { name: 'mobile-s', width: 360, height: 800 },
  { name: 'mobile-l', width: 414, height: 896 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'desktop-w', width: 1920, height: 1080 },
];

const BASE = process.env.AUDIT_BASE_URL || 'http://localhost:3000';
const OUT = join(__dirname, '../../test-results/audit-v2/screenshots');

for (const route of ROUTES) {
  for (const locale of LOCALES) {
    for (const vp of VIEWPORTS) {
      test(`${locale}${route} ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        const url = `${BASE}/${locale}${route === '/' ? '' : route}`;
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(500); // animations settle
          const dir = join(OUT, route.replace(/\//g, '_') || 'home');
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          await page.screenshot({
            path: join(dir, `${locale}-${vp.name}.png`),
            fullPage: true,
          });
        } catch (e) {
          console.error(`SKIP ${url}: ${e.message}`);
        }
      });
    }
  }
}
```

### `tests/e2e/audit-v2-screenshots-webkit.spec.ts`

Zelfde structuur, beperk tot desktop+mobile-l viewport, gebruik `test.use({ browserName: 'webkit' })`. Output naar `test-results/audit-v2/screenshots-webkit/`.

### `tests/e2e/audit-v2-screenshots-firefox.spec.ts`

Idem, `browserName: 'firefox'`. Output naar `test-results/audit-v2/screenshots-firefox/`.

### `tests/e2e/audit-v2-har-capture.spec.ts`

Voor elke route × locale (1440×900 only): `context.routeFromHAR()` plus capture, save `test-results/audit-v2/har/{route}-{locale}.har`.

### `tests/e2e/audit-v2-dom-snapshot.spec.ts`

Voor elke route × locale: `await page.content()` → save als HTML naar `test-results/audit-v2/dom/{route}-{locale}.html`.

### `tests/e2e/audit-v2-axe.spec.ts`

`@axe-core/playwright`:

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Same ROUTES + LOCALES, viewport 1440x900 only
for (const route of ROUTES) {
  for (const locale of LOCALES) {
    test(`a11y ${locale}${route}`, async ({ page }) => {
      const url = `http://localhost:3000/${locale}${route === '/' ? '' : route}`;
      await page.goto(url, { waitUntil: 'networkidle' });
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
        .analyze();
      const dir = join(__dirname, '../../test-results/audit-v2/axe');
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      const file = `${route.replace(/\//g, '_') || 'home'}-${locale}.json`;
      writeFileSync(join(dir, file), JSON.stringify(results, null, 2));
    });
  }
}
```

### `tests/e2e/audit-v2-lighthouse.spec.ts`

`playwright-lighthouse` op productie URL (lokaal dev-server geeft skewed perf-scores):

```ts
import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
// ROUTES, run mobile + desktop config per route, save JSON to test-results/audit-v2/lighthouse/
```

## Logging conventions

- Append to `STATE.md` na elke plan-completion
- Append to `BUDGET.log` na elke API call
- Schrijf failure-details naar `failures/{plan-XX}.md` (gitignored, niet committed)
- Eind van phase: rollup logs in `00-executive-summary.md` § Execution telemetry

## Cross-LLM citation script template (`scripts/audit/measure-llm-citations.mjs`)

```js
#!/usr/bin/env node
/**
 * Measures FMai citation rate across LLMs.
 * Usage: node scripts/audit/measure-llm-citations.mjs [--output path]
 *
 * Primary provider: Gemini 2.5 Flash via Google Search grounding
 *   (~/.claude/scripts/gemini-research.mjs --json).
 * Secondary providers: WebFetch tegen public surfaces van Bing Copilot,
 *   Claude.ai search, ChatGPT search where reachable; document gaps for skipped.
 */
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { homedir } from 'os';
import { join } from 'path';

const QUERIES = [
  'Wat is FutureMarketingAI?',
  'Welke AI marketing agency platforms zijn er voor Nederlandse bureaus in 2026?',
  'Hoe werkt agent-as-a-service voor content marketing?',
  'Wat is Clyde van FutureMarketingAI?',
  'Pricing AI marketing agency platforms EU 2026',
  'Memory system AI marketing platform - wat houdt het in?',
  'SkinClarity Club case study AI marketing',
];
const FMAI_DOMAINS = ['future-marketing.ai'];
const GEMINI_SCRIPT = join(homedir(), '.claude', 'scripts', 'gemini-research.mjs');

function askGeminiGrounded(query) {
  const out = execSync(`node "${GEMINI_SCRIPT}" ${JSON.stringify(query)} --json`, { encoding: 'utf8' });
  return JSON.parse(out); // { answer, citations: [{url, title}], ... }
}

function detectFmaiCitation(result) {
  const urls = (result.citations || []).map(c => c.url || '');
  return urls.some(u => FMAI_DOMAINS.some(d => u.includes(d))) ? urls : null;
}

const matrix = {};
for (const q of QUERIES) {
  try {
    const gem = askGeminiGrounded(q);
    matrix[q] = {
      gemini_grounded: {
        cited: !!detectFmaiCitation(gem),
        urls: detectFmaiCitation(gem),
        answer_excerpt: (gem.answer || '').slice(0, 500),
      },
      // bing/claude/chatgpt: vul aan via WebFetch in plan 16-07
    };
  } catch (e) {
    matrix[q] = { gemini_grounded: { error: e.message } };
  }
}
writeFileSync('docs/audits/2026-05-18-v2/06-geo-llmeo-matrix.json', JSON.stringify(matrix, null, 2));
console.log('Citation matrix saved.');
```

Volledige implementatie komt in plan 16-07.

## Verification automation

Run aan einde van Phase 16 (door gsd-verifier of executor):

```powershell
# Phase 16 verification suite
cd C:\Users\daley\Desktop\Futuremarketingai

$checks = @(
  @{Name='Executive summary'; Path='docs/audits/2026-05-18-v2/00-executive-summary.md'},
  @{Name='Competitive intel'; Path='docs/audits/2026-05-18-v2/00-competitive-intel.md'},
  @{Name='Baseline snapshot'; Path='docs/audits/2026-05-18-v2/01-baseline-snapshot.md'},
  @{Name='Visual design'; Path='docs/audits/2026-05-18-v2/02-visual-design.md'},
  @{Name='Brand narrative IA'; Path='docs/audits/2026-05-18-v2/03-brand-narrative-ia.md'},
  @{Name='Interactions'; Path='docs/audits/2026-05-18-v2/04-interactions-forms-microcopy.md'},
  @{Name='SEO technical'; Path='docs/audits/2026-05-18-v2/05-seo-technical.md'},
  @{Name='GEO/LLMEO'; Path='docs/audits/2026-05-18-v2/06-geo-llmeo.md'},
  @{Name='Accessibility'; Path='docs/audits/2026-05-18-v2/07-accessibility.md'},
  @{Name='Performance'; Path='docs/audits/2026-05-18-v2/08-performance.md'},
  @{Name='Cross-browser'; Path='docs/audits/2026-05-18-v2/09-cross-browser.md'},
  @{Name='Content copy i18n'; Path='docs/audits/2026-05-18-v2/10-content-copy-i18n.md'},
  @{Name='Conversion psychology'; Path='docs/audits/2026-05-18-v2/11-conversion-psychology.md'},
  @{Name='Security privacy'; Path='docs/audits/2026-05-18-v2/12-security-privacy.md'},
  @{Name='Competitive cross-stack'; Path='docs/audits/2026-05-18-v2/13-competitive-cross-stack.md'},
  @{Name='Synthesis'; Path='docs/audits/2026-05-18-v2/14-cross-cutting-synthesis.md'},
  @{Name='Fix plan'; Path='docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md'},
  @{Name='Roadmap'; Path='docs/plans/2026-05-18-design-seo-roadmap-q3.md'},
  @{Name='Gallery index'; Path='fmai-nextjs/test-results/audit-v2/screenshots/index.html'}
)

foreach ($c in $checks) {
  if (Test-Path $c.Path) { Write-Host "OK   $($c.Name)" } else { Write-Host "FAIL $($c.Name) MISSING $($c.Path)" }
}

# Verify no production code touched
$diff = git diff main -- 'fmai-nextjs/src/' 'fmai-nextjs/messages/' 'fmai-nextjs/next.config.*' 'fmai-nextjs/tailwind.config.*'
if ([string]::IsNullOrWhiteSpace($diff)) { Write-Host "OK   No production code changes" } else { Write-Host "FAIL Production code modified" }

# Verify branch
$branch = git rev-parse --abbrev-ref HEAD
if ($branch -eq 'audit/2026-05-18-v2-sota') { Write-Host "OK   On audit branch" } else { Write-Host "WARN Branch: $branch" }
```
