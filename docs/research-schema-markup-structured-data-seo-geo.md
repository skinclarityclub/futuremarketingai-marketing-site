---
title: Schema Markup & Structured Data — SEO + GEO Deep Research
tags: #research #seo #geo #schema #structured-data
created: 2026-03-28
source: Firecrawl deep research (6 searches, 25+ sources)
---

# Schema Markup & Structured Data — SEO + GEO Research Report

Research for automated validation and improvement suggestions by an AI agent.

---

## 1. Schema Types That Matter Most in 2026

### Post-March 2026 Core Update Reality

Google's March 2026 core update completed March 12 and produced the most significant shift in structured data strategy since rich snippets launched. Key changes:

- FAQ rich result impressions dropped ~47% across tracked sites
- How-To rich results removed entirely from desktop; mobile limited to primary content pages only
- Editorial Review schema now triggers manual action risk
- Schema must match the **primary content purpose** of the page — supplementary schema padding is dead
- 31 schema types retain active rich result support

Source: https://www.digitalapplied.com/blog/schema-markup-after-march-2026-structured-data-strategies

### Tier 1: High-Impact Schema Types (Always Implement)

#### Organization Schema
The single highest-leverage implementation in 2026. Not for rich results — for entity resolution in Google's Knowledge Graph and AI Mode citation.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://example.com/#org",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://www.wikidata.org/wiki/Q...",
    "https://www.linkedin.com/company/...",
    "https://twitter.com/...",
    "https://www.crunchbase.com/organization/...",
    "https://www.kvk.nl/..."
  ],
  "knowsAbout": ["Topic 1", "Topic 2", "Topic 3"],
  "contactPoint": [{
    "@type": "ContactPoint",
    "contactType": "sales",
    "telephone": "+31-XX-XXXXXXX",
    "email": "info@example.com"
  }],
  "foundingDate": "2024-01-01"
}
```

**Critical properties:**
- `sameAs` — Wikidata is most powerful (primary Knowledge Graph input), then LinkedIn, Crunchbase, KvK (NL)
- `knowsAbout` — topical authority signal AI Mode uses for source selection per query category
- Stable `@id` (fragment like `/#org` or `/id/org`) — reference from all other entities

#### Person / Author Schema
Essential for E-E-A-T signals and AI citation attribution.

```json
{
  "@type": "Person",
  "name": "Author Name",
  "@id": "https://example.com/team/author-name/#person",
  "sameAs": [
    "https://www.linkedin.com/in/...",
    "https://twitter.com/..."
  ],
  "knowsAbout": ["Huidverzorging", "Dermatologie", "Skincare"],
  "worksFor": { "@type": "Organization", "@id": "https://example.com/#org" },
  "jobTitle": "Huidtherapeut"
}
```

#### Product + Offer Schema (Shopify)
Retains high-value rich results: price, availability, merchant listings. 20-30% higher CTR.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": ["https://example.com/photo1.jpg"],
  "description": "Product description",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "sku": "SKU123",
  "gtin13": "1234567890123",
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/product",
    "priceCurrency": "EUR",
    "price": "49.99",
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "@id": "https://example.com/#org" }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "12"
  }
}
```

**Warning:** AggregateRating requires minimum 5 genuine, verifiable reviews. Inflated ratings face enhanced scrutiny post-March 2026.

#### Article / BlogPosting Schema
Foundation for content sites. Required for AI Mode content classification.

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title (max 110 chars)",
  "description": "Meta description here",
  "author": {
    "@type": "Person",
    "@id": "https://example.com/team/author/#person"
  },
  "datePublished": "2026-03-28T08:00:00+02:00",
  "dateModified": "2026-03-28T08:00:00+02:00",
  "image": {
    "@type": "ImageObject",
    "url": "https://example.com/article-image.jpg",
    "width": 1200,
    "height": 630
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://example.com/#org"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/blog/article-slug"
  },
  "about": [
    { "@type": "Thing", "name": "Topic", "sameAs": "https://www.wikidata.org/wiki/Q..." }
  ]
}
```

#### LocalBusiness Schema
Critical for map pack and local AI answers.

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://example.com/locations/city/#lb",
  "name": "Business Name — City",
  "image": "https://example.com/images/location.jpg",
  "parentOrganization": { "@type": "Organization", "@id": "https://example.com/#org" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Straatnaam 123",
    "addressLocality": "Amsterdam",
    "postalCode": "1012 AB",
    "addressRegion": "Noord-Holland",
    "addressCountry": "NL"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "52.3676",
    "longitude": "4.9041"
  },
  "telephone": "+31-20-1234567",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "priceRange": "$$"
}
```

#### WebSite + SearchAction (Sitelinks Search Box)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://example.com/#website",
  "name": "Site Name",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": { "@type": "Organization", "@id": "https://example.com/#org" }
}
```

#### BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog" },
    { "@type": "ListItem", "position": 3, "name": "Article Title" }
  ]
}
```

### Tier 2: Situational Schema Types

#### FAQPage (Use Conservatively)
Post-March 2026: ONLY on pages where FAQ is the **primary content**. No longer works as padding on blog posts or product pages.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is X?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "X is..."
      }
    }
  ]
}
```

#### HowTo (Mobile Only, Primary Content Only)
Desktop rich results removed entirely. Only implement on pages where step-by-step instructions are the main purpose.

#### Service Schema

```json
{
  "@type": "Service",
  "name": "AI Marketing Automation",
  "description": "Full-service AI marketing for agencies",
  "provider": { "@type": "Organization", "@id": "https://example.com/#org" },
  "serviceType": "Marketing Automation",
  "areaServed": {
    "@type": "Country",
    "name": "Netherlands"
  }
}
```

#### VideoObject

```json
{
  "@type": "VideoObject",
  "name": "Video Title",
  "description": "Video description",
  "thumbnailUrl": "https://example.com/thumb.jpg",
  "uploadDate": "2026-03-28T08:00:00+02:00",
  "duration": "PT5M30S",
  "contentUrl": "https://example.com/video.mp4",
  "embedUrl": "https://example.com/embed/video"
}
```

### Tier 3: GEO-Specific Schema Types

#### Speakable Schema
Flags the most citable passage in long-form content for AI synthesis. No dedicated SERP display — pure AI signal.

```json
{
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".article-summary", ".key-takeaway"]
  }
}
```

#### ClaimReview
For fact-checking content. AI Mode treats these as high-trust verification sources.

#### DefinedTerm
For glossary entries and technical definitions. Improves citation for definition queries.

```json
{
  "@type": "DefinedTerm",
  "name": "Huidbarriere",
  "description": "De beschermende buitenste laag van de huid...",
  "inDefinedTermSet": {
    "@type": "DefinedTermSet",
    "name": "Huidverzorging Woordenlijst"
  }
}
```

---

## 2. Schema Markup for GEO / AI Citations

### How AI Engines Use Structured Data

AI Mode (Gemini 3), ChatGPT, Perplexity all process schema differently from traditional search:

1. **Entity Resolution** — Organization + Person schema with `sameAs` identifiers enables AI to resolve the publishing entity against Knowledge Graph records. Resolved entities get higher trust scores.
2. **Content Classification** — Article/BlogPosting/NewsArticle tells AI the content type, primary topic, and audience for query-intent matching.
3. **Passage Identification** — Speakable schema flags the most citable section. Without it, AI must guess.
4. **Claim Verification** — AI uses schema to verify claims and assess source credibility during answer synthesis.

Source: https://searchengineland.com/schema-markup-ai-search-no-hype-472339

### Key Research Findings

**3.2x AI Mode citation lift** measured on sites with comprehensive entity schema post-March 2026 update.

Source: https://www.digitalapplied.com/blog/schema-markup-after-march-2026-structured-data-strategies

**2-4x more likely** to appear in Google AI Overviews with valid schema markup.

Source: https://www.digitalapplied.com/blog/schema-markup-ai-generation-guide-2026

**300% higher accuracy** for LLMs grounded in knowledge graphs vs. unstructured data alone.

Source: https://almcorp.com/blog/schema-markup-detailed-guide-2026-serp-visibility/

### What Schema Does NOT Guarantee

Per Search Engine Land (March 25, 2026):
- Schema won't guarantee AI citations — it helps AI understand entities
- No "special AI schema" exists — AI uses standard Schema.org with complex nesting
- Entity depth (Product > Manufacturer > Organization > Founder > Person) is the key, not new types
- Content parity is strictly enforced — schema claims must match visible page content

Source: https://searchengineland.com/schema-markup-ai-search-no-hype-472339

### The Entity Depth Strategy

The 2026 approach is **nesting depth**, not breadth:
- Don't just mark up a Product — mark up Product > Manufacturer > Organization > Founder > Person
- Link entities via `sameAs` to Wikidata, LinkedIn, KvK, Wikipedia
- Use `mentions` and `about` properties with Wikidata IDs — strongest signal for entity SEO
- Use `@graph` arrays to connect multiple entities in a single JSON-LD block

### GEO-Optimized Schema Checklist

1. Organization with `sameAs` to 4+ authoritative sources (Wikidata = most powerful)
2. Author Person schema with `knowsAbout` topics and `sameAs` links
3. Article schema with `about` linking to Wikidata topic entities
4. Speakable schema flagging the most citable paragraph
5. BreadcrumbList showing topical hierarchy
6. FAQ only on genuine FAQ pages
7. DefinedTerm for glossary/definition content
8. `mentions` property linking to relevant external entities

---

## 3. Automated Schema Validation

### Programmatic Validation Tools

#### Google Rich Results Test
- URL: https://search.google.com/test/rich-results
- **No public programmatic API** as of March 2026
- Workaround: Use Puppeteer/Playwright to automate the web UI
- Alternative: Use Google Search Console API for rich result impression data

#### Schema.org Validator
- URL: https://validator.schema.org/
- **No public API** — web UI only
- Validates against full Schema.org vocabulary (not just Google-supported subset)

#### Programmatic Validation Approaches

**1. Extract JSON-LD from any page (Node.js / curl + jq):**

```bash
# Extract JSON-LD from a URL using curl + node
curl -s "https://example.com" | node -e "
  const html = require('fs').readFileSync('/dev/stdin','utf8');
  const matches = html.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/gi);
  if (matches) {
    matches.forEach(m => {
      const json = m.replace(/<\/?script[^>]*>/gi, '');
      try { console.log(JSON.stringify(JSON.parse(json), null, 2)); }
      catch(e) { console.error('Invalid JSON-LD:', e.message); }
    });
  } else { console.log('No JSON-LD found'); }
"
```

**2. Python extraction + validation:**

```python
import requests
from bs4 import BeautifulSoup
import json

def extract_jsonld(url):
    resp = requests.get(url)
    soup = BeautifulSoup(resp.text, 'html.parser')
    scripts = soup.find_all('script', type='application/ld+json')
    results = []
    for script in scripts:
        try:
            data = json.loads(script.string)
            results.append(data)
        except json.JSONDecodeError as e:
            results.append({'error': str(e), 'raw': script.string[:200]})
    return results

def validate_schema(jsonld):
    """Basic validation rules"""
    issues = []
    if isinstance(jsonld, list):
        for item in jsonld:
            issues.extend(validate_schema(item))
        return issues

    schema_type = jsonld.get('@type', '')

    # Required @context
    if '@context' not in jsonld:
        issues.append('Missing @context')

    # Type-specific validations
    if schema_type == 'Organization':
        if 'name' not in jsonld: issues.append('Organization missing name')
        if 'sameAs' not in jsonld: issues.append('Organization missing sameAs (critical for GEO)')
        if 'knowsAbout' not in jsonld: issues.append('Organization missing knowsAbout (GEO signal)')

    if schema_type in ('Article', 'BlogPosting', 'NewsArticle'):
        for field in ['headline', 'author', 'datePublished', 'image']:
            if field not in jsonld:
                issues.append(f'{schema_type} missing required: {field}')
        if 'dateModified' not in jsonld:
            issues.append(f'{schema_type} missing recommended: dateModified')

    if schema_type == 'Product':
        if 'offers' not in jsonld: issues.append('Product missing offers')
        if 'image' not in jsonld: issues.append('Product missing image')
        offers = jsonld.get('offers', {})
        if isinstance(offers, dict):
            for f in ['price', 'priceCurrency', 'availability']:
                if f not in offers:
                    issues.append(f'Product.offers missing: {f}')

    if schema_type == 'LocalBusiness':
        for field in ['name', 'address', 'telephone']:
            if field not in jsonld:
                issues.append(f'LocalBusiness missing: {field}')

    return issues
```

**3. NPM packages for validation:**

- `schema-dts` — TypeScript types for Schema.org (compile-time validation)
- `structured-data-testing-tool` — Google's SDTT CLI (deprecated but still works)
- Custom Zod schemas matching Schema.org types (best for agent automation)

**4. Agent automation approach (recommended):**

```typescript
// Agent workflow for schema validation
async function validateClientSchema(url: string) {
  // 1. Fetch page HTML
  const html = await fetch(url).then(r => r.text());

  // 2. Extract all JSON-LD blocks
  const jsonldBlocks = extractJsonLd(html);

  // 3. Validate syntax (valid JSON)
  const syntaxIssues = validateJsonSyntax(jsonldBlocks);

  // 4. Validate against Schema.org requirements
  const schemaIssues = validateSchemaOrg(jsonldBlocks);

  // 5. Check Google rich result eligibility
  const richResultIssues = checkRichResultEligibility(jsonldBlocks);

  // 6. Check GEO optimization (entity depth, sameAs, knowsAbout)
  const geoIssues = checkGeoOptimization(jsonldBlocks);

  // 7. Check content parity (schema claims vs visible content)
  const parityIssues = await checkContentParity(html, jsonldBlocks);

  // 8. Generate improvement suggestions
  const suggestions = generateSuggestions(url, jsonldBlocks, {
    syntaxIssues, schemaIssues, richResultIssues, geoIssues, parityIssues
  });

  return { jsonldBlocks, issues: [...all], suggestions };
}
```

### Validation Checklist for Agent

1. Valid JSON syntax in all `<script type="application/ld+json">` blocks
2. `@context` = `"https://schema.org"` present
3. `@type` is a valid Schema.org type
4. Required properties per type present (see Google docs per type)
5. `sameAs` links resolve to real pages (HTTP 200)
6. `datePublished` / `dateModified` are valid ISO 8601
7. Image URLs are valid and accessible
8. Price/currency format correct for Product
9. No duplicate schema types on same page (unless `@graph`)
10. Content parity: every schema property has matching visible content

---

## 4. Schema for the Dutch Market

### Dutch-Specific Requirements

#### LocalBusiness for Dutch Addresses
- `addressCountry`: `"NL"`
- `addressRegion`: province name (Noord-Holland, Zuid-Holland, etc.)
- `postalCode`: Dutch format (1234 AB)
- `telephone`: include country code `+31`
- `priceRange`: use EUR-based ranges

#### KvK (Chamber of Commerce) as SameAs
Dutch businesses should add KvK profile to `sameAs`:
```json
"sameAs": [
  "https://www.kvk.nl/orderstraat/product-702-inzage-handelsregister/?kvknummer=XXXXXXXX"
]
```

#### Dutch Language Content
- `inLanguage`: `"nl-NL"` on Article/WebPage schema
- Author schema in Dutch where appropriate
- `knowsAbout` topics can be in Dutch for Dutch-market content

#### Hreflang + Schema for Multi-Language
When serving nl/en content on same domain:
- Implement `hreflang` tags in HTML `<head>` (NOT in schema — schema has no hreflang)
- Use separate JSON-LD per language version with correct `inLanguage`
- `@id` should differ per language: `/#article-nl` vs `/#article-en`
- `url` should point to the canonical URL for that language

#### Dutch Legal Pages
- Add `WebPage` schema with `significantLink` pointing to Algemene Voorwaarden, Privacy Policy
- Consider `GovernmentService` for overheids-gerelateerde content

### Sample: Dutch Huidtherapeut LocalBusiness

```json
{
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "@id": "https://skinclarityclub.nl/#business",
  "name": "SkinClarity Club",
  "description": "Professionele huidtherapie en skincare advies",
  "url": "https://skinclarityclub.nl",
  "image": "https://skinclarityclub.nl/images/clinic.jpg",
  "telephone": "+31-XX-XXXXXXX",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Straatnaam 123",
    "addressLocality": "City",
    "postalCode": "1234 AB",
    "addressRegion": "Province",
    "addressCountry": "NL"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "52.XXXX",
    "longitude": "4.XXXX"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:30"
    }
  ],
  "priceRange": "EUR 50-150",
  "parentOrganization": { "@type": "Organization", "@id": "https://skinclarityclub.nl/#org" },
  "sameAs": [
    "https://www.instagram.com/skinclarityclub",
    "https://www.kvk.nl/orderstraat/product-702-inzage-handelsregister/?kvknummer=XXXXXXXX"
  ],
  "inLanguage": "nl-NL"
}
```

---

## 5. Schema per Platform

### Next.js (App Router) Implementation

Official recommendation from Next.js docs (updated March 25, 2026):

Source: https://nextjs.org/docs/app/guides/json-ld

**Pattern: Render JSON-LD as `<script>` tag in page.tsx or layout.tsx**

```tsx
// app/products/[id]/page.tsx
export default async function Page({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
  };

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* page content */}
    </section>
  );
}
```

**TypeScript typing with `schema-dts`:**

```tsx
import { Product, WithContext } from 'schema-dts';

const jsonLd: WithContext<Product> = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Product Name',
  image: 'https://example.com/image.jpg',
  description: 'Description',
};
```

**Key points:**
- Use native `<script>` tag, NOT `next/script` (JSON-LD is data, not executable code)
- `dangerouslySetInnerHTML` with XSS sanitization (replace `<` with `\u003c`)
- Server Components can generate JSON-LD from DB data directly
- Multiple JSON-LD blocks per page are fine — use `@graph` when entities are related
- Install types: `npm install schema-dts`

**Reusable JSON-LD component:**

```tsx
// src/components/JsonLd.tsx
interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
```

### Shopify Implementation

**Built-in schema (Shopify generates automatically):**
- Product schema on product pages (basic: name, price, availability)
- BreadcrumbList on collection/product pages
- Organization schema (partial — from theme settings)
- WebSite + SearchAction (basic)

**What Shopify does NOT auto-generate well:**
- Author schema (no E-E-A-T signals)
- `sameAs` / `knowsAbout` on Organization
- Article schema on blog posts (minimal)
- FAQ schema
- LocalBusiness (physical store locations)
- Speakable / GEO signals

**Custom Liquid implementation:**

```liquid
{% comment %} theme/snippets/schema-organization.liquid {% endcomment %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "{{ shop.url }}/#org",
  "name": "{{ shop.name }}",
  "url": "{{ shop.url }}",
  "logo": "{{ shop.url }}{{ 'logo.png' | asset_url }}",
  "sameAs": [
    "{{ settings.social_instagram_link }}",
    "{{ settings.social_facebook_link }}",
    "https://www.kvk.nl/orderstraat/product-702-inzage-handelsregister/?kvknummer={{ settings.kvk_number }}"
  ],
  "knowsAbout": {{ settings.expertise_topics | split: ',' | json }}
}
</script>
```

**Shopify blog post schema (custom):**

```liquid
{% comment %} templates/article.liquid — add to article template {% endcomment %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": {{ article.title | json }},
  "description": {{ article.excerpt_or_content | strip_html | truncate: 160 | json }},
  "author": {
    "@type": "Person",
    "name": {{ article.author | json }}
  },
  "datePublished": "{{ article.published_at | date: '%Y-%m-%dT%H:%M:%S%z' }}",
  "dateModified": "{{ article.updated_at | date: '%Y-%m-%dT%H:%M:%S%z' }}",
  "image": "https:{{ article.image | image_url: width: 1200 }}",
  "publisher": {
    "@type": "Organization",
    "@id": "{{ shop.url }}/#org"
  },
  "mainEntityOfPage": "{{ shop.url }}{{ article.url }}",
  "inLanguage": "nl-NL"
}
</script>
```

### Platform Comparison

| Feature | Next.js | Shopify | WordPress |
|---------|---------|---------|-----------|
| JSON-LD delivery | `<script>` in component | Liquid snippets | Yoast/RankMath plugin |
| TypeScript types | `schema-dts` npm | N/A | N/A |
| Auto-generated | None (manual) | Product, Breadcrumb | Yoast generates most |
| Custom control | Full (Server Components) | Liquid templates | PHP filters / custom blocks |
| `@graph` support | Easy (JS object) | Manual JSON in Liquid | Plugin-dependent |
| GEO signals | Full control | Requires custom Liquid | Plugin + custom code |

---

## 6. Automated Schema Generation by AI Agent

### Can an AI Agent Generate Correct Schema?

**Yes, with guardrails.** Key findings from research:

Source: https://www.digitalapplied.com/blog/schema-markup-ai-generation-guide-2026
Source: https://www.singlegrain.com/artificial-intelligence/autonomous-schema-optimization-ai-agents-that-maintain-structured-data/

**The 2026 approach (from DigitalApplied):**
1. Feed raw HTML to Gemini/Claude/GPT
2. AI extracts entities and outputs JSON-LD per Schema.org v29.x
3. **Syntax Firewall** (Pydantic/Zod validator) validates before injection
4. Content parity check: every schema property must have matching visible content

**Schema Automation Maturity Model (from SingleGrain):**
- Level 1: Manual — team writes JSON-LD by hand
- Level 2: Template — CMS plugin generates from templates
- Level 3: Automated — AI generates from content, human reviews
- Level 4: Semi-autonomous — AI generates, validates, deploys with human approval
- Level 5: Fully autonomous — AI agent monitors, generates, validates, repairs continuously

### Agent Workflow for Schema Management

```
1. CRAWL    — Fetch client page HTML
2. EXTRACT  — Parse existing JSON-LD blocks
3. ANALYZE  — Check completeness, validity, GEO optimization
4. GENERATE — Create missing schema or improvements
5. VALIDATE — Syntax check + content parity + Google guidelines
6. SUGGEST  — Present changes with explanation to client/agency
7. MONITOR  — Re-check after deployment, track rich result impressions
```

### Templates per Page Type

**Homepage:**
- Organization (with full sameAs + knowsAbout)
- WebSite + SearchAction
- (Optional) LocalBusiness if physical location

**Blog Post:**
- Article / BlogPosting (with author Person)
- BreadcrumbList
- (If applicable) FAQPage, HowTo, VideoObject
- Speakable on key paragraph

**Product Page (Shopify):**
- Product + Offer + AggregateRating
- BreadcrumbList
- (If applicable) FAQ about the product

**Service Page:**
- Service (with provider Organization)
- BreadcrumbList
- (If applicable) FAQ about the service

**About Page:**
- Organization (comprehensive)
- Person schema for team members
- BreadcrumbList

**Contact Page:**
- LocalBusiness (with full address + hours)
- BreadcrumbList
- ContactPoint

### Validation Pipeline (Before Suggesting to Client)

```
Input: Generated JSON-LD

Step 1: JSON syntax validation (JSON.parse)
Step 2: Required @context and @type check
Step 3: Schema.org type validation (is @type valid?)
Step 4: Required properties per type (Google's documented requirements)
Step 5: Property value format validation (dates, URLs, prices)
Step 6: Content parity check (schema claims vs page content)
Step 7: Duplicate detection (no conflicting schema on same page)
Step 8: sameAs URL resolution (HTTP 200 check)
Step 9: GEO optimization score (entity depth, sameAs count, knowsAbout)
Step 10: Output: PASS/FAIL with specific issues + improvement suggestions
```

---

## 7. Key Takeaways for Agent Implementation

### Priority Order for Implementation

1. **Organization schema** with `sameAs` (Wikidata, LinkedIn, KvK) + `knowsAbout` — highest GEO leverage
2. **Author Person schema** on all content pages — E-E-A-T + AI citation
3. **Article/BlogPosting** with proper author linking — content classification
4. **Product + Offer** on all Shopify product pages — rich results + AI shopping
5. **LocalBusiness** for physical locations — local SEO + AI local answers
6. **BreadcrumbList** on every page — topical hierarchy signal
7. **WebSite + SearchAction** on homepage — sitelinks search box
8. **Speakable** on key content — AI citation precision
9. **FAQ/HowTo** only on dedicated FAQ/tutorial pages — conservative post-March 2026

### Critical Rules

- **Content parity**: Every schema claim MUST match visible content. Google flags mismatches as spam.
- **No inflated ratings**: Minimum 5 genuine reviews for AggregateRating.
- **Entity depth over breadth**: Nest entities 4+ levels deep (Product > Brand > Organization > Person).
- **JSON-LD in `<head>`**: Preferred delivery. Multiple blocks OK. Use `@graph` for related entities.
- **Stable @id URIs**: Use fragment identifiers (`/#org`, `/#person`) and keep them permanent.
- **Schema.org v29.x**: Current version. Avoid "pending" properties.

### Measurement

- Rich result impressions in Google Search Console
- AI Mode citation frequency (manual sampling or third-party tools)
- Knowledge Panel accuracy
- CTR delta on pages with vs without schema (20-30% improvement expected)
- Structured data errors in Search Console (target: zero)

---

## Sources

1. https://www.digitalapplied.com/blog/schema-markup-after-march-2026-structured-data-strategies
2. https://www.wearetg.com/blog/schema-markup/
3. https://comms.thisisdefinition.com/insights/ultimate-guide-to-structured-data-for-seo
4. https://outpaceseo.com/article/schema-markup-structured-data/
5. https://medium.com/@vicki-larson/how-structured-data-schema-transforms-your-ai-search-visibility-in-2026-9e968313b2d7
6. https://searchengineland.com/schema-markup-ai-search-no-hype-472339
7. https://geoptie.com/blog/schema-markup-for-ai
8. https://rankharvest.com/structured-data-markup-for-geo/
9. https://www.digitalapplied.com/blog/schema-markup-ai-generation-guide-2026
10. https://almcorp.com/blog/schema-markup-detailed-guide-2026-serp-visibility/
11. https://geneo.app/blog/schema-markup-best-practices-2026-json-ld-audit/
12. https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142
13. https://llmrefs.com/generative-engine-optimization
14. https://www.enrichlabs.ai/blog/generative-engine-optimization-geo-complete-guide-2026
15. https://nextjs.org/docs/app/guides/json-ld
16. https://agilitycms.com/docs/nextjs/implementing-json-ld-structured-data-with-next-js
17. https://www.singlegrain.com/artificial-intelligence/autonomous-schema-optimization-ai-agents-that-maintain-structured-data/
