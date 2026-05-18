#!/usr/bin/env node
/**
 * Measures FMai citation rate across LLMs.
 *
 * Primary provider: Gemini 2.5 Flash via Google Search grounding
 *   (~/.claude/scripts/gemini-research.mjs --json).
 *
 * Secondary providers (best-effort, no auth keys involved):
 *   1. Bing SERP, used as a Bing Copilot proxy because Copilot answer-boxes
 *      draw from Bing organic + Copilot citations heuristically map to
 *      top-3 organic results.
 *   2. Google SERP, used as a ChatGPT-search-with-browsing proxy because
 *      OpenAI does not publish a citation API and ChatGPT search currently
 *      grounds in Bing or open web depending on tier; Google organic is the
 *      best public-fetchable signal short of authenticated scraping.
 *   3. Claude.ai search has no public endpoint, so the cell is filled with
 *      provider_unavailable and the audit doc documents the gap.
 *
 * Usage:
 *   node scripts/audit/measure-llm-citations.mjs               # writes JSON
 *   node scripts/audit/measure-llm-citations.mjs --output=path # custom path
 *   node scripts/audit/measure-llm-citations.mjs --gemini-only # skip SERP probes
 *
 * Exit codes:
 *   0 success, JSON file written.
 *   1 fatal error (no Gemini key, JSON parse failure on stdout, write error).
 *
 * Output schema (per query):
 *   {
 *     gemini_grounded: { cited, urls, answer_excerpt, citation_count, error? },
 *     bing_serp:       { cited, urls, titles, top_titles, error? },
 *     google_serp:     { cited, urls, titles, top_titles, error? },
 *     claude_search:   { cited: null, reason: 'provider_unavailable' },
 *   }
 *
 * No Perplexity calls. Ever. Per audit Wave 0 decision.
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { homedir } from 'os';
import { dirname, join } from 'path';

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

const args = process.argv.slice(2);
const argMap = Object.fromEntries(
  args
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const eq = a.indexOf('=');
      if (eq === -1) return [a.slice(2), true];
      return [a.slice(2, eq), a.slice(eq + 1)];
    }),
);

const OUTPUT_PATH =
  typeof argMap.output === 'string'
    ? argMap.output
    : 'docs/audits/2026-05-18-v2/06-geo-llmeo-matrix.json';
const GEMINI_ONLY = Boolean(argMap['gemini-only']);

function askGeminiGrounded(query) {
  const cmd = `node "${GEMINI_SCRIPT}" ${JSON.stringify(query)} --json`;
  const stdout = execSync(cmd, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  return JSON.parse(stdout);
}

function fmaiCitedIn(urls) {
  const hits = urls.filter((u) => FMAI_DOMAINS.some((d) => u.includes(d)));
  return hits.length > 0 ? hits : null;
}

function detectFmaiCitation(geminiResult) {
  const urls = (geminiResult.citations || []).map((c) => c.url || '');
  return fmaiCitedIn(urls);
}

/**
 * Fetch a SERP page and extract result URLs and titles.
 * Bing layout 2026: <li class="b_algo"><h2><a href="URL">TITLE</a></h2>...
 * Google layout 2026: container div with anchors, title rendered in h3.
 * We accept either layout via two regex passes. If the engine starts rate-limiting
 * or serves a consent wall, the function returns {error}.
 */
async function fetchSerp(url) {
  try {
    const res = await fetch(url, {
      headers: {
        // Plausible desktop UA. Provider may still rate-limit; that is acceptable.
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const html = await res.text();
    // Heuristic extraction. Each provider's HTML can change; we only need top-10 URLs
    // for the citation signal, not perfect ranking. If extraction fails, return [].
    const urlRegex = /<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>([^<]{0,300})<\/a>/gi;
    const out = [];
    let m;
    while ((m = urlRegex.exec(html)) !== null && out.length < 200) {
      const u = m[1];
      const t = m[2].replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim();
      if (
        /^https?:\/\/(www\.)?(bing|google|microsoft|youtube|gstatic|googleusercontent)\.com/i.test(
          u,
        )
      ) {
        continue;
      }
      if (/translate\.google|webcache\.googleusercontent|maps\.google/.test(u)) continue;
      out.push({ url: u, title: t });
    }
    // Dedup by hostname plus path.
    const seen = new Set();
    const unique = [];
    for (const r of out) {
      const k = r.url.replace(/[?#].*$/, '');
      if (seen.has(k)) continue;
      seen.add(k);
      unique.push(r);
      if (unique.length >= 25) break;
    }
    return { results: unique };
  } catch (e) {
    return { error: String(e?.message ?? e) };
  }
}

async function probeBing(query) {
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}&FORM=NTPCHB&setlang=nl`;
  const r = await fetchSerp(url);
  if (r.error) return { cited: null, error: r.error };
  const urls = r.results.map((x) => x.url);
  const titles = r.results.map((x) => x.title);
  return {
    cited: !!fmaiCitedIn(urls),
    urls: fmaiCitedIn(urls),
    top_titles: titles.slice(0, 5),
    result_count: urls.length,
  };
}

async function probeGoogle(query) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=nl&gl=nl`;
  const r = await fetchSerp(url);
  if (r.error) return { cited: null, error: r.error };
  const urls = r.results.map((x) => x.url);
  const titles = r.results.map((x) => x.title);
  return {
    cited: !!fmaiCitedIn(urls),
    urls: fmaiCitedIn(urls),
    top_titles: titles.slice(0, 5),
    result_count: urls.length,
  };
}

const matrix = {};
const summary = {
  started_at: new Date().toISOString(),
  queries: QUERIES.length,
  providers: GEMINI_ONLY
    ? ['gemini_grounded']
    : ['gemini_grounded', 'bing_serp', 'google_serp', 'claude_search'],
  notes:
    'Gemini grounded is the only true LLM citation API used here. Bing and Google ' +
    'serve as Copilot/ChatGPT-search citation proxies. Claude has no public search ' +
    'endpoint and is marked provider_unavailable across all rows.',
};

for (const q of QUERIES) {
  const row = {};
  // Gemini grounded (primary)
  try {
    const gem = askGeminiGrounded(q);
    const cited = detectFmaiCitation(gem);
    row.gemini_grounded = {
      cited: !!cited,
      urls: cited,
      citation_count: (gem.citations || []).length,
      answer_excerpt: (gem.answer || '').slice(0, 500),
    };
  } catch (e) {
    row.gemini_grounded = { error: String(e?.message ?? e) };
  }

  if (!GEMINI_ONLY) {
    // Bing SERP (Copilot proxy)
    row.bing_serp = await probeBing(q);
    // Google SERP (ChatGPT-search proxy)
    row.google_serp = await probeGoogle(q);
    // Claude search (unavailable)
    row.claude_search = {
      cited: null,
      reason: 'provider_unavailable',
      note:
        'Claude.ai search has no public REST endpoint. Manual re-run via Claude web ' +
        'app would be the next step for Phase 17 verification.',
    };
  }

  matrix[q] = row;
}

summary.finished_at = new Date().toISOString();
const payload = { _summary: summary, matrix };

// Write to absolute or cwd-relative output.
const finalOut = OUTPUT_PATH;
const outDir = dirname(finalOut);
if (outDir && !existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(finalOut, JSON.stringify(payload, null, 2));
console.log(`Citation matrix saved to ${finalOut}`);
console.log(`Queries: ${QUERIES.length}. Providers: ${summary.providers.join(', ')}.`);
