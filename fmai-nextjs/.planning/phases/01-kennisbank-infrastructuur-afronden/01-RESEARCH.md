# Phase 1: Kennisbank-infrastructuur afronden - Research

**Researched:** 2026-06-02
**Domain:** Next.js 16 App Router content hub + glossary, next-intl i18n, schema-dts JSON-LD (SEO/GEO)
**Confidence:** HIGH (codebase reconnaissance), MEDIUM (2026 schema rich-result eligibility — verified via grounded web)

## Summary

KB-01/02/03 zijn geshipt op branch `feature/seo-geo-kennisbank` (commit `99e8cd6`). Het MDX-fundament is compleet en degelijk: een uitgebreid frontmatter-schema met gedeelde `toMeta`-mapper in `src/lib/blog.ts`, een MDX-componentmap in `mdx-components.tsx` (Callout, ComparisonTable, KeyTakeaways, TableOfContents, CtaBlock, Citations, BlogFaq), en een rijke renderer in `src/app/[locale]/(blog)/blog/[slug]/page.tsx` die TOC/takeaways/FAQ/citations uit frontmatter rendert en `ArticleJsonLd` + `FaqJsonLd` emit. De sitemap (`src/app/sitemap.ts`) verwerkt blog-posts al met per-slug hreflang-grouping. KB-03 (rich renderer + Article/FAQPage JSON-LD) is daarmee al grotendeels af; het resterende werk is verificatie + een SKC-grade demo-artikel.

De echte DELTA voor deze fase zit in **KB-04** (de `/resources` hub die pillars → clusters → glossary ontsluit, i18n NL/EN/ES) en **KB-05** (de GEO/agency-taxonomie + per-term-linkbare glossary). Beide bestaan nog niet: er is geen `/resources` route, geen glossary-data, geen glossary-componenten, en `resources`/`glossary` namespaces ontbreken in `messages/*.json`. De category-taxonomie in `BLOG_CATEGORIES` (geo, ai-marketing-automation, agency-ops, comparisons, guides) is al klaar als pillar-buckets.

**Kritieke 2026-bevinding:** Google heeft FAQ rich results gedeprecieerd (volledig uitgefaseerd ~mei 2026); de Rich Results Test verliest FAQ-support in juni 2026. Het FAQPage-schema blijft valide markup, blijft waardevol voor AI/LLM-citatie (AI Overviews leest het), maar produceert geen visuele rich result meer en zal niet als "FAQ" groen in de Rich Results Test verschijnen. Succescriterium 3 moet hierop geherinterpreteerd worden: valideer FAQPage via de **Schema Markup Validator** (validator.schema.org), niet de Rich Results Test FAQ-appearance.

**Primary recommendation:** Bouw `/resources` als statische next-intl marketing-page (volg het `memory`-pagina-patroon: `generatePageMetadata` + `WebPageJsonLd` + `Breadcrumbs`), drijf de hub op `getPillarPosts`/`getClusterPosts` uit het bestaande `blog.ts`, en bouw de glossary als data-gedreven sectie met `DefinedTermSet`+`DefinedTerm` JSON-LD en per-term `#anchor`-links. Valideer Article via Rich Results Test, FAQPage via Schema Markup Validator.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| KB-01 | SKC-grade frontmatter-schema (heroImage/readTime/keyTakeaways/faqs/citations/tableOfContents/pillar/clusterOf/relatedSlugs/schemaType) in `src/lib/blog.ts` | GESHIPT — `BlogPostMeta` interface (blog.ts:26-53) + `toMeta` mapper (blog.ts:81-106). Alleen verificatie nodig. |
| KB-02 | MDX-componentmap (Callout, ComparisonTable, KeyTakeaways, TableOfContents, CtaBlock, Citations, BlogFaq) in elke MDX-body | GESHIPT — `mdx-components.tsx:12-22` (`useMDXComponents`). Components in `src/components/blog/*`. Alleen verificatie. |
| KB-03 | Blog-renderer rendert TOC/takeaways/FAQ/citations, emit FaqJsonLd, hero in OG, BlogPosting/Article schemaType | GESHIPT — `[slug]/page.tsx` rendert alle blokken + `ArticleJsonLd` (type-switch pillar→Article) + `FaqJsonLd`. DELTA: SKC-grade demo-artikel met volledige frontmatter ontbreekt (bestaand `.mdx` gebruikt oud schema); FAQPage rich-result-deprecatie 2026. |
| KB-04 | Kennisbank-hub route (`/resources`) ontsluit pillars → clusters → glossary, i18n NL/EN/ES | NIEUW — geen `/resources` route. Volg `(marketing)/memory/page.tsx`-patroon. Drijf op `getPillarPosts`/`getClusterPosts` (blog.ts:166-173). Voeg `resources` namespace + breadcrumb-config toe. |
| KB-05 | GEO/agency-taxonomie + glossary-sectie (GEO, AI Marketing Medewerker, citation monitoring, tier caps) | NIEUW — geen glossary-data/component. Bouw glossary-data (NL authoritative), `Glossary` component met per-term `id` anchors, `DefinedTermSetJsonLd`. Taxonomie deels aanwezig in `BLOG_CATEGORIES`. |
</phase_requirements>

## Existing Code Reconnaissance (KB-01/02/03 — al geshipt)

### Wat bestaat en wat het doet

| Bestand | Rol | Status |
|---------|-----|--------|
| `src/lib/blog.ts` | Frontmatter-schema (`BlogPostMeta`), gedeelde `toMeta`-mapper, readTime-fallback, `BLOG_CATEGORIES` taxonomie, helpers `getAllPosts`/`getAllPostsAllLocales`/`getPostSlugsWithLocales`/`getCategoryLabel`/**`getPillarPosts`**/**`getClusterPosts`** | KB-01 compleet |
| `mdx-components.tsx` | `useMDXComponents()` levert Callout, ComparisonTable, KeyTakeaways, TableOfContents, CtaBlock, Citations, BlogFaq aan elke MDX-body | KB-02 compleet |
| `src/components/blog/*.tsx` | BlogFaq, Callout, Citations, ComparisonTable, CtaBlock, KeyTakeaways, TableOfContents, BlogContent, BlogPostCard, CategoryFilter | KB-02 compleet |
| `src/app/[locale]/(blog)/blog/[slug]/page.tsx` | Rich renderer: `generateStaticParams` per locale, hreflang-alternates in metadata, hero in OG, rendert TOC/takeaways/FAQ/citations uit frontmatter, emit `ArticleJsonLd`+`BreadcrumbJsonLd`+`FaqJsonLd`, `schemaType` switch (pillar→Article, anders BlogPosting) | KB-03 grotendeels compleet |
| `src/app/[locale]/(blog)/blog/page.tsx` | Blog-index met CategoryFilter, `WebPageJsonLd`, hreflang | bestaand |
| `src/app/sitemap.ts` | Statische pages + blog-posts gegroepeerd per slug met per-slug hreflang `alternates.languages` | bestaand |
| `src/components/seo/ArticleJsonLd.tsx` | Article/BlogPosting JSON-LD, author-`@id` unificatie (Daley), publisher Organization, ImageObject | bestaand |
| `src/components/seo/FaqJsonLd.tsx` | FAQPage JSON-LD met optioneel `@id` (`{url}#faq`) | bestaand |
| `src/components/seo/WebPageJsonLd.tsx` | WebPage JSON-LD met `@id`, `isPartOf` WebSite, optionele speakable selectors | bestaand |
| `src/components/seo/JsonLd.tsx` | Generieke emitter, `schema-dts` getypeerd, `<`-escaping | bestaand |
| `next.config.ts` | `@next/mdx` plugin + `next-intl/plugin`; `@content/*` import-alias actief (`import('@content/blog/${slug}.mdx')`) | bestaand |

### Verschil-detail per criterium

**Succescriterium 3 (artikel rendert TOC/takeaways/FAQ/citations + Article+FAQPage JSON-LD):** De renderpijplijn is af. ENIGE gat: het enige bestaande MDX-bestand `content/blog/ai-marketing-automation-guide.mdx` gebruikt het **oude** frontmatter (geen keyTakeaways/faqs/citations/tableOfContents/pillar). Een SKC-grade demo-artikel met de volledige nieuwe frontmatter is nodig om dit criterium aantoonbaar te bewijzen (en het is ook nuttig als template voor Phase 3-cornerstone). NB: échte cornerstone-content is Phase 3 — dit artikel is een infra-bewijs, geen money-page.

**Succescriterium 4 (build slaagt + hub/nieuwe URLs met hreflang in sitemap):** `sitemap.ts` heeft GEEN entry voor `/resources` of glossary-anchors. DELTA: voeg `/resources` toe aan de `pages`-array (krijgt automatisch hreflang via de bestaande loop over `routing.locales`). Glossary-termen zijn anchors op `/resources` (of een sub-route) — geen aparte sitemap-URLs nodig tenzij per-term aparte routes gekozen worden.

## User Constraints

Geen CONTEXT.md aanwezig voor deze fase (geen `/gsd:discuss-phase` gedraaid). Projectbrede constraints uit CLAUDE.md die de planner MOET honoreren:

- **Canoniek domein:** `future-marketing.ai` (nooit `futuremarketingai.com`). `SITE_URL` is al correct in `seo-config.ts`.
- **Geen em-dashes (—) in user-facing copy** (NL/EN/ES). Komma/punt/dubbele punt. Geldt voor glossary-definities, hub-copy, demo-artikel.
- **Key-phrase glossary:** "AI Marketing Medewerker"/"Clyde" (niet "AI tool"/"platform"), "vaardigheden" (niet "features"), "merken"/"klantportfolio" (niet "klanten"). De glossary-term "AI Marketing Medewerker" moet exact deze positionering definiëren.
- **NL is source-of-truth**, EN/ES machine-vertaald + reviewed. Glossary-definities en hub-copy eerst in NL.
- **Geen hardcoded user-facing strings** — alles via `useTranslations()`/`getTranslations()`.
- **Dark-only theme**, desktop-first; gebruik bestaande theme-tokens (`--color-accent-system` teal, `--color-bg-surface`, etc.).
- **Geen `any`-types, geen `@ts-ignore`, geen secrets in `NEXT_PUBLIC_*`.**

## Standard Stack

Geen nieuwe libraries nodig. Het werk gebruikt uitsluitend de bestaande stack.

### Core (al geïnstalleerd, al in gebruik)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.7 | App Router routes, `generateStaticParams`, `sitemap.ts` | project-stack |
| React | 19.2.3 | Server Components voor hub/glossary | project-stack |
| next-intl | 4.8 | i18n NL/EN/ES, `getTranslations`, `setRequestLocale`, `routing` (localePrefix: always) | project-stack |
| schema-dts | aanwezig | Getypeerde JSON-LD (`WithContext<Thing>`) via `JsonLd.tsx` | project-stack |
| gray-matter | aanwezig | MDX frontmatter parsing in `blog.ts` | project-stack |
| @next/mdx | aanwezig | MDX-compilatie + `@content/*` alias | project-stack |
| Tailwind CSS | 4 | Styling met theme-tokens | project-stack |
| lucide-react | aanwezig | Iconen (ChevronRight in Breadcrumbs, ArrowRight) | project-stack |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Glossary als data-array in `src/lib/` | Glossary-termen als losse MDX-bestanden | MDX overkill voor korte definities; data-array is simpeler, makkelijker i18n via messages, en direct te mappen naar `DefinedTerm` JSON-LD. Gebruik data-array. |
| `/resources` als enkele route met anchors per term | Aparte route per glossary-term (`/resources/glossary/[term]`) | Aparte routes = meer sitemap-URLs + meer crawl-oppervlak, maar fragmenteert dunne content. Succescriterium 2 vraagt "per-term linkbaar" — een `#term-anchor` op de hub voldoet. Begin met anchors. |
| `DefinedTermSet`+`DefinedTerm` JSON-LD | Geen glossary-schema | DefinedTerm geeft AI/LLM-citatie-voordeel (kern van het programma-doel) tegen lage kosten. Gebruik het. |

## Architecture Patterns

### Aanbevolen bestandsstructuur (DELTA — nieuw + wijzigingen)
```
src/
├── app/[locale]/(marketing)/resources/
│   └── page.tsx                      # NIEUW — /resources hub (KB-04). Volg memory/page.tsx-patroon
├── lib/
│   ├── glossary.ts                   # NIEUW — glossary-term ids + category, NL-authoritative shape (KB-05)
│   ├── blog.ts                       # bestaand — hergebruik getPillarPosts/getClusterPosts
│   ├── breadcrumb-config.ts          # WIJZIG — voeg '/resources' toe (+ evt. '/blog' parent reuse)
│   └── seo-config.ts                 # WIJZIG (optioneel) — PAGE_DATES['/resources'] toevoegen
├── components/
│   ├── resources/
│   │   ├── PillarHubCard.tsx         # NIEUW — pillar + clusters bundel (KB-04)
│   │   └── Glossary.tsx              # NIEUW — per-term <dl> met id-anchors (KB-05)
│   └── seo/
│       └── DefinedTermSetJsonLd.tsx  # NIEUW — DefinedTermSet/DefinedTerm + CollectionPage (KB-04/05)
├── app/sitemap.ts                    # WIJZIG — voeg '/resources' aan pages-array
content/blog/
└── <geo-demo>.mdx                    # NIEUW (optioneel infra-bewijs) — volledige SKC-frontmatter
messages/
├── nl.json                           # WIJZIG — voeg "resources" + "glossary" namespaces (NL eerst)
├── en.json                           # WIJZIG — vertaald
└── es.json                           # WIJZIG — vertaald
```

### Pattern 1: Statische i18n marketing-page (voor /resources)
**What:** Server Component page met `generateStaticParams` over `routing.locales`, `generatePageMetadata` voor SEO + hreflang, `setRequestLocale(locale)` vroeg, `getTranslations({ locale, namespace })` voor copy.
**When to use:** De `/resources` hub.
**Example (bewezen patroon uit `memory/page.tsx`):**
```typescript
// Source: src/app/[locale]/(marketing)/memory/page.tsx (bestaand)
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { getPillarPosts, getClusterPosts } from '@/lib/blog'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'resources', path: '/resources' })
}

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'resources' })
  const pillars = getPillarPosts(locale)            // pillar-posts in deze locale
  // per pillar: getClusterPosts(pillar.slug, locale)
  // render WebPageJsonLd + DefinedTermSetJsonLd + Breadcrumbs + pillar/cluster + glossary
}
```
Let op: `generatePageMetadata` verwacht message-keys `resources.meta.title` en `resources.meta.description`.

### Pattern 2: DefinedTermSet + CollectionPage JSON-LD via schema-dts
**What:** Glossary-termen als `DefinedTermSet` met genest `DefinedTerm[]`; hub als `CollectionPage` met genest `ItemList` → `ListItem` naar pillar-artikelen.
**When to use:** `/resources` page-level JSON-LD.
**Example:**
```typescript
// Source: schema.org + bestaand JsonLd.tsx-patroon (src/components/seo/JsonLd.tsx)
// Glossary
const glossaryData = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  '@id': `${SITE_URL}/${locale}/resources#glossary`,
  name: 'GEO & AI marketing glossary',
  hasDefinedTerm: terms.map((term) => ({
    '@type': 'DefinedTerm',
    '@id': `${SITE_URL}/${locale}/resources#${term.id}`,
    name: term.name,
    description: term.definition,
    inDefinedTermSet: `${SITE_URL}/${locale}/resources#glossary`,
  })),
}
// Hub-collectie
const collectionData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE_URL}/${locale}/resources#webpage`,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: pillars.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/${locale}/blog/${p.slug}`,
    })),
  },
}
```
DefinedTerm/CollectionPage geven GEEN visuele rich result, maar verbeteren AI/LLM-citatie en entity-begrip (kern van het programma-doel). [MEDIUM — schema.org + grounded web, 2026-06-02]

### Pattern 3: Per-term linkbare glossary (succescriterium 2)
**What:** Render elke term als `<dt id={term.id}>` zodat `/resources#geo`, `/resources#ai-marketing-medewerker` etc. direct scrollbaar zijn. Gebruik `scroll-margin-top` voor de sticky header-offset (site heeft `pt-16`/`pt-32` headers).
**Example:**
```tsx
<dl>
  {terms.map((term) => (
    <div key={term.id} id={term.id} className="scroll-mt-28">
      <dt className="font-display text-text-primary">{term.name}</dt>
      <dd className="text-text-secondary">{term.definition}</dd>
    </div>
  ))}
</dl>
```

### Anti-Patterns to Avoid
- **Hardcoded glossary-copy in de component:** alle term-namen + definities via `messages/*.json` namespace `glossary` (NL authoritative). Component leest alleen term-ids + category uit `src/lib/glossary.ts`.
- **`/resources` buiten een locale-segment plaatsen:** `localePrefix: 'always'` betekent elke route is `/{locale}/resources`. Plaats de route onder `app/[locale]/(marketing)/`.
- **FAQPage als "Rich Results"-doel rekenen:** FAQ rich results zijn gedeprecieerd (2026). Niet als succesmaatstaf gebruiken; valideer schema-correctheid via Schema Markup Validator.
- **Nieuwe slug-routes voor glossary zonder content:** vermijd dunne `/resources/glossary/[term]`-routes; begin met anchors.
- **Sitemap-drift:** vergeet `/resources` niet in `sitemap.ts` `pages`-array (succescriterium 4 controleert dit expliciet).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| hreflang-alternates voor /resources | Eigen alternates-loop | `generatePageMetadata` (`src/lib/metadata.ts`) | Genereert canonical + alle locale-alternates + x-default identiek aan rest van site |
| Sitemap hreflang | Eigen XML | bestaande `sitemap.ts` `pages`-loop | Loopt al over `routing.locales` en bouwt `alternates.languages` |
| Pillar/cluster-data ophalen | Eigen MDX-parser | `getPillarPosts(locale)` / `getClusterPosts(pillarSlug, locale)` (blog.ts) | Bestaande readers + `toMeta` mapper |
| JSON-LD emit + escaping | Eigen `<script>` | `JsonLd` component (`src/components/seo/JsonLd.tsx`) | Getypeerd via schema-dts, `<`-escape al gedaan |
| Breadcrumbs | Eigen nav | `Breadcrumbs` + `BreadcrumbJsonLd` + `breadcrumb-config.ts` | Visible + structured data blijven gesynct; voeg alleen `/resources`-entry toe |
| Category-labels | Eigen map | `getCategoryLabel(id)` (blog.ts) | Bestaande taxonomie-resolutie |

**Key insight:** De hele i18n/SEO/sitemap-infra bestaat al en is consistent toegepast over ~30 routes. De fase is grotendeels samenstellen van bestaande primitives, niet nieuwbouw.

## Common Pitfalls

### Pitfall 1: FAQPage "Rich Results Test groen" is achterhaald (2026)
**What goes wrong:** Succescriterium 3 vraagt "valide Article + FAQPage JSON-LD (Rich Results Test groen)". De Rich Results Test toont FAQ niet meer als rich-result-feature (uitfasering ~mei-juni 2026).
**Why it happens:** Google heeft FAQ rich results gedeprecieerd; FAQ search-appearance + RRT-support worden verwijderd.
**How to avoid:** Valideer **Article** via Rich Results Test (blijft ondersteund). Valideer **FAQPage** via Schema Markup Validator (validator.schema.org) op syntax-correctheid. Herinterpreteer het criterium als "schema valideert technisch" niet "FAQ rich snippet verschijnt".
**Warning signs:** Planner schrijft een verificatiestap "FAQ rich result zichtbaar" — dat zal nooit slagen in 2026.

### Pitfall 2: Pillar-posts bestaan nog niet → lege hub
**What goes wrong:** `getPillarPosts(locale)` retourneert `[]` omdat er nog geen MDX met `pillar: true` is (cornerstone = Phase 3).
**Why it happens:** Content komt pas in Phase 3; de hub-infra komt nu.
**How to avoid:** De hub moet gracefully degraderen (lege-state copy per pillar-categorie) EN deterministisch de pillar-categorieën uit `BLOG_CATEGORIES`/taxonomie tonen, niet alleen bestaande posts. Toon de structuur (pillar-buckets) ook zonder posts. Eventueel één infra-demo-artikel met `pillar: true` toevoegen om de hub niet leeg te laten en succescriterium 1 aantoonbaar te maken.
**Warning signs:** `/resources` rendert een lege pagina in de planning-verificatie.

### Pitfall 3: Bestaand MDX gebruikt oud frontmatter
**What goes wrong:** `content/blog/ai-marketing-automation-guide.mdx` heeft geen `keyTakeaways/faqs/citations/tableOfContents/pillar`. Renderer toont die blokken dus niet → kan succescriterium 3 niet bewijzen met dit bestand.
**Why it happens:** Bestand dateert van vóór KB-01.
**How to avoid:** Maak een nieuw demo-artikel met volledige frontmatter (of upgrade het bestaande) om de rich renderer + Article+FAQPage JSON-LD aantoonbaar te maken.

### Pitfall 4: i18n message-keys ontbreken → build-fout of MISSING_MESSAGE
**What goes wrong:** `generatePageMetadata` leest `resources.meta.title`; Breadcrumbs leest `common.breadcrumbs.resources`; glossary leest `glossary.*`. Ontbreken → fout/placeholder.
**How to avoid:** Voeg `resources`-namespace (incl. `meta.title`/`meta.description`) + `glossary`-namespace + `common.breadcrumbs.resources` toe in ALLE drie locales. NL eerst (authoritative), dan EN/ES.

### Pitfall 5: `scroll-margin` ontbreekt → anchor-links verbergen term onder sticky header
**What goes wrong:** `/resources#geo` scrollt term-titel onder de fixed header.
**How to avoid:** `scroll-mt-28` (of token-equivalent) op elke term-container.

## Code Examples

### Sitemap-uitbreiding (succescriterium 4)
```typescript
// Source: src/app/sitemap.ts (bestaand) — voeg toe aan `pages`-array
{ path: '/resources', changeFrequency: 'weekly' as const, priority: 0.8 },
// De bestaande loop bouwt automatisch alternates.languages voor en/nl/es.
```

### Breadcrumb-config-uitbreiding
```typescript
// Source: src/lib/breadcrumb-config.ts (bestaand) — voeg toe aan BREADCRUMB_ROUTES
'/resources': { labelKey: 'resources', parent: '/' },
// + messages/*.json: common.breadcrumbs.resources = "Kennisbank" (NL) / "Resources" (EN) / "Recursos" (ES)
```

### Glossary-data shape (KB-05)
```typescript
// Source: nieuw — src/lib/glossary.ts (alleen ids + category; copy via messages)
export interface GlossaryTermRef {
  id: string            // anchor + DefinedTerm @id fragment
  category: 'geo' | 'ai-marketing-automation' | 'agency-ops'
}
export const GLOSSARY_TERMS: GlossaryTermRef[] = [
  { id: 'geo', category: 'geo' },                          // Generative Engine Optimization
  { id: 'ai-marketing-medewerker', category: 'ai-marketing-automation' }, // Clyde-positionering
  { id: 'citation-monitoring', category: 'geo' },
  { id: 'tier-caps', category: 'agency-ops' },
]
// component leest messages: glossary.<id>.name / glossary.<id>.definition
```

## State of the Art

| Old Approach | Current Approach (2026) | When Changed | Impact |
|--------------|-------------------------|--------------|--------|
| FAQPage → rich result snippet in SERP | FAQPage geen visuele rich result; alleen AI/LLM-citatie-waarde | ~mei-juni 2026 (Google-deprecatie) | Succescriterium 3 herinterpreteren; FAQ valideren via Schema Markup Validator, niet RRT |
| Hub-pagina als platte linklijst | CollectionPage + ItemList + DefinedTermSet voor AI-citatie/entity-begrip | doorlopend (GEO-praktijk 2025-2026) | Glossary/hub structureel markeren voor AI Overviews |

**Deprecated/outdated:**
- FAQ rich result als doel: vervangen door AI-citatie-optimalisatie (FAQPage markup behouden, niet als rich-snippet rekenen).

## Open Questions

1. **Glossary: anchors op /resources of aparte sub-route?**
   - Wat we weten: succescriterium 2 vraagt "per-term linkbaar". Anchors (`/resources#term`) voldoen en vermijden dunne content.
   - Wat onduidelijk is: of de user later een volwaardige `/resources/glossary`-sectie wil.
   - Aanbeveling: begin met anchors op `/resources`; refactor naar sub-route alleen als content groeit.

2. **Infra-demo-artikel: nieuw bestand of bestaand upgraden?**
   - Wat we weten: het bestaande MDX heeft oud frontmatter; een volledig-frontmatter artikel is nodig om criterium 3 te bewijzen.
   - Aanbeveling: nieuw klein demo/seed-artikel met `pillar: true` + volledige frontmatter (NL), zodat de hub niet leeg is en de renderer aantoonbaar werkt. Échte cornerstone = Phase 3.

3. **Pillar-mapping: `BLOG_CATEGORIES` vs aparte pillar-definitie?**
   - Wat we weten: `BLOG_CATEGORIES` bevat geo/ai-marketing-automation/agency-ops/comparisons/guides; `getPillarPosts` filtert op `pillar: true` frontmatter.
   - Onduidelijk: of de hub pillars groepeert op categorie of op individuele pillar-posts.
   - Aanbeveling: toon pillar-buckets op basis van de 3-4 strategische categorieën (geo, ai-marketing-automation, agency-ops) zodat de structuur ook zichtbaar is zonder gepubliceerde pillar-posts; vul met `getPillarPosts`/`getClusterPosts` waar aanwezig. Sluit aan op Phase 2 `fma_content_pillars`-spine.

## Sources

### Primary (HIGH confidence)
- Codebase (read tijdens reconnaissance): `src/lib/blog.ts`, `mdx-components.tsx`, `src/app/[locale]/(blog)/blog/[slug]/page.tsx`, `src/app/[locale]/(blog)/blog/page.tsx`, `src/app/sitemap.ts`, `src/components/seo/{ArticleJsonLd,FaqJsonLd,WebPageJsonLd,JsonLd}.tsx`, `src/lib/{seo-config,metadata,breadcrumb-config}.ts`, `src/components/layout/{Breadcrumbs,PageShell}.tsx`, `src/i18n/routing.ts`, `next.config.ts`, `messages/nl.json`, `src/app/[locale]/(marketing)/memory/page.tsx`
- Git: commit `99e8cd6` (KB-01/02/03 shipped), branch `feature/seo-geo-kennisbank`
- schema.org — DefinedTermSet/DefinedTerm, CollectionPage, ItemList, Article, FAQPage type-definities

### Secondary (MEDIUM confidence)
- Gemini grounded web research (2026-06-02): FAQ rich-result-deprecatie (~mei 2026, RRT-support verwijderd juni 2026), DefinedTerm/CollectionPage rich-result-ineligibility maar AI/LLM-citatie-waarde, Article rich-result-eligibility + dateModified-freshness-signaal. Bron via schema.org grounding-redirect.

### Tertiary (LOW confidence)
- Geen.

## Metadata

**Confidence breakdown:**
- Existing-code reconnaissance: HIGH — alle relevante bestanden direct gelezen.
- Standard stack: HIGH — geen nieuwe deps; alles in package al bewezen in gebruik.
- Architecture: HIGH — `/resources` volgt het bewezen `memory`-pagina-patroon; alle primitives bestaan.
- Pitfalls / 2026 schema-eligibility: MEDIUM — FAQ-deprecatie + DefinedTerm-eligibility verified via grounded web, niet via primaire Google-doc URL.

**Research date:** 2026-06-02
**Valid until:** 2026-07-02 (stabiele stack; schema rich-result-beleid evolueert — herijk FAQ/DefinedTerm-eligibility bij twijfel)
