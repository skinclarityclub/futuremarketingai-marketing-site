---
title: Research — Automated Scientific Citation Discovery & Verification
tags: #research #pubmed #citations #fact-checking #blog-factory
created: 2026-03-17
source: Web research (NCBI docs, Crossref docs, PubTator papers, GitHub)
---

# Automated Scientific Citation Discovery & Verification for Health Blog Content

Research into programmatic citation discovery, verification, and formatting for evidence-based skincare/acne blog content.

---

## 1. PubMed E-utilities API

The NCBI E-utilities are the primary programmatic interface for searching and retrieving biomedical literature.

### Base URL

```
https://eutils.ncbi.nlm.nih.gov/entrez/eutils/
```

### Core Endpoints

#### ESearch — Find article IDs matching a query

```
GET esearch.fcgi?db=pubmed&term=<query>&retmax=<n>&api_key=<key>
```

**Parameters:**
| Parameter | Description | Default |
|-----------|-------------|---------|
| `db` | Database name | Required (`pubmed`) |
| `term` | Search query (supports Boolean, field tags) | Required |
| `retmax` | Max UIDs returned | 20 |
| `retstart` | Offset for pagination | 0 |
| `usehistory` | `y` to store results on server | - |
| `sort` | `relevance`, `pub_date`, `Author`, etc. | relevance |
| `datetype` | `pdat` (pub date), `edat` (entry date) | - |
| `mindate` / `maxdate` | Date range (YYYY/MM/DD) | - |

**Example — acne treatment studies from last 5 years:**

```
https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=acne+vulgaris[MeSH]+AND+treatment[MeSH]+AND+2021:2026[pdat]&retmax=20&sort=relevance&api_key=YOUR_KEY
```

**Response fields (XML):**

- `<Count>` — total matching records
- `<IdList><Id>` — PMIDs
- `<QueryKey>` + `<WebEnv>` — for history-based retrieval

#### EFetch — Retrieve full records by PMID

```
GET efetch.fcgi?db=pubmed&id=<pmid_list>&rettype=abstract&retmode=xml&api_key=<key>
```

**Key XML fields in response:**

```xml
<PubmedArticle>
  <MedlineCitation>
    <PMID>12345678</PMID>
    <Article>
      <ArticleTitle>Study title here</ArticleTitle>
      <Journal>
        <Title>Journal of Dermatology</Title>
        <JournalIssue>
          <Volume>45</Volume>
          <Issue>3</Issue>
          <PubDate><Year>2024</Year></PubDate>
        </JournalIssue>
      </Journal>
      <AuthorList>
        <Author>
          <LastName>Smith</LastName>
          <ForeName>John</ForeName>
        </Author>
      </AuthorList>
      <ELocationID EIdType="doi">10.1000/example</ELocationID>
      <PublicationTypeList>
        <PublicationType>Randomized Controlled Trial</PublicationType>
      </PublicationTypeList>
    </Article>
    <MeshHeadingList>
      <MeshHeading>
        <DescriptorName>Acne Vulgaris</DescriptorName>
      </MeshHeading>
    </MeshHeadingList>
  </MedlineCitation>
</PubmedArticle>
```

#### ESummary — Lightweight document summaries

```
GET esummary.fcgi?db=pubmed&id=<pmid_list>&version=2.0&api_key=<key>
```

Returns condensed metadata (title, authors, source, pub date, DOI) — faster than EFetch for bulk lookups.

### Batch Processing with History Server

For large result sets, use the history server to avoid passing thousands of IDs in URLs:

```
# Step 1: Search and store on history
esearch.fcgi?db=pubmed&term=acne+vulgaris&usehistory=y

# Step 2: Fetch in batches using WebEnv + query_key
efetch.fcgi?db=pubmed&query_key=1&WebEnv=MCID_xxx&retstart=0&retmax=500&rettype=abstract&retmode=xml
```

### PubMed Query Syntax for Skincare Content

**Field tags:**

- `[MeSH]` — MeSH controlled vocabulary
- `[tiab]` — title/abstract
- `[pt]` — publication type
- `[pdat]` — publication date

**Useful MeSH terms for acne/skincare:**

- `Acne Vulgaris[MeSH]`
- `Skin Care[MeSH]`
- `Dermatology[MeSH]`
- `Retinoids[MeSH]`
- `Benzoyl Peroxide[MeSH]`
- `Anti-Bacterial Agents[MeSH]`
- `Isotretinoin[MeSH]`
- `Sebaceous Glands[MeSH]`
- `Skin Microbiome[MeSH]`
- `Diet, Food, and Nutrition[MeSH]` (for diet-acne link)

**Example search strategies:**

```
# Systematic review style — broad
(acne vulgaris[MeSH] OR acne[tiab]) AND (treatment[MeSH] OR therapy[tiab])

# Specific topic — diet and acne
(acne vulgaris[MeSH]) AND (diet[MeSH] OR glycemic index[tiab] OR dairy[tiab])

# High-quality evidence only
(acne vulgaris[MeSH]) AND (systematic review[pt] OR meta-analysis[pt] OR randomized controlled trial[pt])

# Recent guidelines
(acne vulgaris[MeSH]) AND (guideline[pt] OR practice guideline[pt]) AND 2020:2026[pdat]
```

---

## 2. PubTator 3.0 for Fact Checking

PubTator 3.0 is an AI-powered literature resource that provides pre-computed entity and relation annotations across 36M+ PubMed abstracts and 6M+ full-text PMC articles, updated weekly.

### Capabilities

- **Entity recognition**: Chemicals, Diseases, Genes, Mutations, Species
- **Relation extraction**: Pre-computed entity relationships (e.g., "chemical X treats disease Y")
- **Semantic search**: Search by entity relationships, not just keywords
- **RAG integration**: Designed to augment LLMs with verifiable references

### API Endpoints

**Base URL:** `https://www.ncbi.nlm.nih.gov/research/pubtator3/`

**Retrieve annotations by PMID (GET):**

```
https://www.ncbi.nlm.nih.gov/research/pubtator3-api/publications/export/biocjson?pmids=<pmid_list>
```

**Search by entity/keyword:**

```
https://www.ncbi.nlm.nih.gov/research/pubtator3-api/search/?text=<query>
```

**Legacy REST format for concept annotations:**

```
https://www.ncbi.nlm.nih.gov/CBBresearch/Lu/Demo/RESTful/tmTool.cgi/[BioConcept]/[PMID]/[Format]/
```

Where BioConcept = `Chemical`, `Disease`, `Gene`, `Mutation`, `Species`

**Batch processing (POST):**
Submit arbitrary text via HTTP POST for entity/relation annotation.

### Using PubTator for Health Claim Verification

PubTator 3.0 integrated with GPT-4 via three API functions:

1. **Find entity ID** — resolve entity names to standardized identifiers
2. **Find related entities** — discover entity relationships (e.g., which chemicals treat acne)
3. **Export relevant search results** — retrieve PMIDs with evidence for specific entity relationships

**Workflow for fact-checking a health claim:**

1. Extract entities from the claim (e.g., "niacinamide reduces acne inflammation")
2. Use PubTator to find the entity IDs for "niacinamide" and "acne"
3. Search for relation annotations linking these entities
4. Retrieve supporting PMIDs with textual evidence
5. Verify the claim is supported by the retrieved literature

**Key advantage**: PubTator retrieves more relevant articles than PubMed keyword search or Google Scholar, with higher precision in top-20 results.

---

## 3. DOI Resolution & Metadata Retrieval

### DOI Content Negotiation (doi.org)

Resolve any DOI to structured citation metadata using HTTP Accept headers:

```bash
# CSL-JSON (most useful for programmatic use)
curl -LH "Accept: application/vnd.citationstyles.csl+json" https://doi.org/10.1000/example

# BibTeX
curl -LH "Accept: application/x-bibtex" https://doi.org/10.1000/example

# RIS
curl -LH "Accept: application/x-research-info-systems" https://doi.org/10.1000/example

# Formatted citation (APA style)
curl -LH "Accept: text/x-bibliography; style=apa" https://doi.org/10.1000/example

# Formatted citation with locale
curl -LH "Accept: text/x-bibliography; style=apa; locale=nl-NL" https://doi.org/10.1000/example
```

**Supported formats:**

| Format             | Accept Header                             | Supported By              |
| ------------------ | ----------------------------------------- | ------------------------- |
| CSL-JSON           | `application/vnd.citationstyles.csl+json` | Crossref, DataCite, mEDRA |
| BibTeX             | `application/x-bibtex`                    | Crossref, DataCite, mEDRA |
| RIS                | `application/x-research-info-systems`     | Crossref, DataCite        |
| RDF XML            | `application/rdf+xml`                     | Crossref, DataCite, mEDRA |
| Schema.org JSON-LD | `application/vnd.schemaorg.ld+json`       | DataCite only             |
| Crossref UNIXREF   | `application/vnd.crossref.unixref+xml`    | Crossref only             |

**Response codes:**

- `200` — Success
- `204` — DOI exists but no metadata
- `404` — DOI does not exist (hallucinated or invalid)
- `406` — Requested format not available

### Crossref REST API

**Base URL:** `https://api.crossref.org/`

```bash
# Lookup by DOI
GET https://api.crossref.org/works/10.1000/example

# Search by title (for verification)
GET https://api.crossref.org/works?query.title=acne+treatment+retinoids&rows=5

# Filter by type and date
GET https://api.crossref.org/works?query=acne&filter=type:journal-article,from-pub-date:2020&rows=10

# Polite pool (faster, include mailto)
GET https://api.crossref.org/works/10.1000/example?mailto=you@example.com
```

**No API key required.** Use `mailto` parameter for polite pool (better rate limits). Crossref has 130M+ records.

**CSL-JSON response fields:**

```json
{
  "DOI": "10.1000/example",
  "title": ["Study Title"],
  "author": [{ "given": "John", "family": "Smith" }],
  "container-title": ["Journal of Dermatology"],
  "published-print": { "date-parts": [[2024, 3, 15]] },
  "type": "journal-article",
  "ISSN": ["1234-5678"],
  "volume": "45",
  "issue": "3",
  "page": "123-130"
}
```

### Additional Metadata APIs

- **OpenAlex**: 250M+ works, 100K req/day, free. `https://api.openalex.org/works/doi:10.1000/example`
- **Semantic Scholar**: 200M+ papers, 100 req/sec. `https://api.semanticscholar.org/graph/v1/paper/DOI:10.1000/example`

---

## 4. Automated Citation Formatting

### Converting PubMed Records to Structured Citation Objects

**Target schema for blog citations:**

```typescript
interface Citation {
  id: string // Internal ID
  pmid?: string // PubMed ID
  doi?: string // Digital Object Identifier
  title: string // Article title
  authors: string[] // ["Smith J", "Doe A"]
  journal: string // Journal name
  year: number // Publication year
  volume?: string
  issue?: string
  pages?: string
  studyType: StudyType // See below
  url: string // PubMed or DOI URL
  abstract?: string // For relevance scoring
  meshTerms?: string[] // For topic matching
}

type StudyType =
  | 'meta-analysis'
  | 'systematic-review'
  | 'randomized-controlled-trial'
  | 'cohort-study'
  | 'case-control-study'
  | 'cross-sectional'
  | 'case-report'
  | 'review'
  | 'guideline'
  | 'in-vitro'
  | 'animal-study'
```

### Mapping PubMed XML to Citation Object

```typescript
function parsePubmedXml(xml: PubmedArticle): Citation {
  return {
    pmid: xml.MedlineCitation.PMID,
    doi: xml.MedlineCitation.Article.ELocationID?.find((e) => e.EIdType === 'doi')?.value,
    title: xml.MedlineCitation.Article.ArticleTitle,
    authors: xml.MedlineCitation.Article.AuthorList.Author.map(
      (a) => `${a.LastName} ${a.ForeName?.[0]}`
    ),
    journal: xml.MedlineCitation.Article.Journal.Title,
    year: parseInt(xml.MedlineCitation.Article.Journal.JournalIssue.PubDate.Year),
    studyType: mapPublicationType(xml.MedlineCitation.Article.PublicationTypeList),
    url: `https://pubmed.ncbi.nlm.nih.gov/${xml.MedlineCitation.PMID}/`,
    meshTerms: xml.MedlineCitation.MeshHeadingList?.MeshHeading.map((h) => h.DescriptorName),
  }
}

function mapPublicationType(types: string[]): StudyType {
  if (types.includes('Meta-Analysis')) return 'meta-analysis'
  if (types.includes('Systematic Review')) return 'systematic-review'
  if (types.includes('Randomized Controlled Trial')) return 'randomized-controlled-trial'
  if (types.includes('Practice Guideline')) return 'guideline'
  if (types.includes('Review')) return 'review'
  // ... map remaining types
  return 'review' // fallback
}
```

### Evidence Hierarchy (for weighting)

```
1. Meta-analysis / Systematic review
2. Randomized controlled trial (RCT)
3. Cohort study
4. Case-control study
5. Cross-sectional study
6. Case report / Case series
7. Expert opinion / Narrative review
8. In vitro / Animal study
```

---

## 5. Relevance Scoring

### Approach: Multi-factor scoring for matching PubMed results to blog sections

```typescript
interface RelevanceScore {
  total: number // 0-1 weighted sum
  meshOverlap: number // MeSH term match score
  titleMatch: number // Keyword match in title
  recency: number // Publication date score
  studyQuality: number // Evidence hierarchy score
  abstractMatch: number // Keyword match in abstract
}

function scoreRelevance(article: Citation, query: BlogSection): RelevanceScore {
  const meshOverlap = jaccardSimilarity(article.meshTerms, query.targetMeshTerms)

  const titleMatch = tokenOverlap(article.title.toLowerCase(), query.keywords)

  const recency = calculateRecencyScore(article.year, {
    maxAge: 10, // Older than 10 years = 0
    halfLife: 5, // 50% score at 5 years
    guidelineBonus: true, // Guidelines stay relevant longer
  })

  const studyQuality = evidenceHierarchyScore(article.studyType)

  return {
    meshOverlap,
    titleMatch,
    recency,
    studyQuality,
    abstractMatch: tfIdfScore(article.abstract, query.keywords),
    total:
      meshOverlap * 0.25 +
      titleMatch * 0.2 +
      recency * 0.15 +
      studyQuality * 0.25 +
      abstractMatch * 0.15,
  }
}
```

**Weight rationale:**

- **Study quality (0.25)**: Prefer meta-analyses and RCTs for health claims
- **MeSH overlap (0.25)**: Controlled vocabulary ensures topical relevance
- **Title match (0.20)**: Strong signal for direct relevance
- **Recency (0.15)**: Prefer recent but don't exclude landmark older studies
- **Abstract match (0.15)**: Catches relevant studies missed by title alone

### MeSH-Based Topic Mapping

Pre-define MeSH term sets for common blog topics:

```typescript
const TOPIC_MESH_MAP: Record<string, string[]> = {
  'acne-general': ['Acne Vulgaris', 'Sebaceous Glands', 'Propionibacterium acnes'],
  'acne-diet': [
    'Acne Vulgaris',
    'Diet',
    'Glycemic Index',
    'Dairy Products',
    'Insulin-Like Growth Factor I',
  ],
  'acne-hormonal': [
    'Acne Vulgaris',
    'Androgens',
    'Polycystic Ovary Syndrome',
    'Oral Contraceptives',
    'Anti-Androgen Agents',
  ],
  retinoids: ['Retinoids', 'Tretinoin', 'Isotretinoin', 'Adapalene'],
  'skin-barrier': [
    'Skin',
    'Epidermal Barrier',
    'Ceramides',
    'Transepidermal Water Loss',
    'Moisturizers',
  ],
  niacinamide: ['Niacinamide', 'Skin Care', 'Anti-Inflammatory Agents'],
}
```

---

## 6. Dutch Medical Sources

### NHG-Standaarden (Nederlands Huisartsen Genootschap)

- **URL**: https://richtlijnen.nhg.org/
- **Content**: Clinical guidelines for Dutch GPs, includes acne guideline
- **API access**: No public REST API available. Content is web-based.
- **Access strategy**: Web scraping with caching, or manual curation of relevant guideline URLs
- **Key guideline**: NHG-Standaard Acne (covers diagnosis, stepped treatment, referral criteria)

### NVDV (Nederlandse Vereniging voor Dermatologie en Venereologie)

- **URL**: https://nvdv.nl/
- **Content**: Dermatology-specific guidelines, more specialist-level than NHG
- **API access**: No public API
- **Access strategy**: Manual curation of guideline documents and URLs

### Farmacotherapeutisch Kompas

- **URL**: https://www.farmacotherapeutischkompas.nl/
- **Content**: Independent medication information for Dutch healthcare professionals
- **API access**: No public REST API. Available as offline app (quarterly updates).
- **Integration**: Can link via ATC codes to medication texts
- **Access strategy**: Manual curation or scraping specific medication pages

### Richtlijnendatabase

- **URL**: https://richtlijnendatabase.nl/
- **Content**: 700+ clinical guidelines, 11,000+ clinical questions with recommendations
- **Managed by**: Knowledge Institute of Dutch Association of Medical Specialists
- **API access**: No public API (FHIR standards exist in Dutch healthcare but not exposed for this database)
- **Access strategy**: Web scraping or manual curation

### Other Dutch/European Sources

- **Lareb** (https://www.lareb.nl/) — Dutch pharmacovigilance, side effect reports
- **EMA** (https://www.ema.europa.eu/) — European Medicines Agency, has public API for medicine data
- **CBG-MEB** (https://www.cbg-meb.nl/) — Dutch Medicines Evaluation Board
- **Huidarts.com** — Dutch dermatology patient information

### Recommended Strategy for Dutch Sources

Since Dutch medical databases lack public APIs, the best approach is a **curated reference library**:

```typescript
interface DutchGuideline {
  source: 'NHG' | 'NVDV' | 'FK' | 'Richtlijnendatabase'
  title: string
  url: string
  topic: string // Maps to blog topic
  lastUpdated: string // For staleness checking
  keyRecommendations: string[] // Pre-extracted claims
}

// Pre-curate relevant guidelines
const DUTCH_GUIDELINES: DutchGuideline[] = [
  {
    source: 'NHG',
    title: 'NHG-Standaard Acne',
    url: 'https://richtlijnen.nhg.org/standaarden/acne',
    topic: 'acne-general',
    lastUpdated: '2023-01-01',
    keyRecommendations: [
      'Stap 1: benzoylperoxide of adapaleen',
      'Stap 2: combinatie lokale therapie',
      'Stap 3: orale antibiotica (doxycycline)',
      'Verwijzing dermatoloog bij onvoldoende resultaat na 6 maanden',
    ],
  },
  // ... more guidelines
]
```

---

## 7. Citation Verification Workflow

### The Hallucination Problem

LLMs hallucinate citations at alarming rates:

- **GPT-3.5**: 39-55% hallucination rate
- **GPT-4**: 18-29% hallucination rate
- Common patterns: real author + fake title, real journal + wrong year, completely fabricated DOIs

### Three-Stage Verification Pipeline

Based on the Citation-Hallucination-Detection project (GitHub: Vikranth3140):

#### Stage 1: Exact Lookup

Query Crossref, OpenAlex, and Semantic Scholar APIs with the DOI:

```typescript
async function verifyDoi(doi: string): Promise<VerificationResult> {
  // Check if DOI resolves
  const response = await fetch(`https://doi.org/${doi}`, {
    method: 'HEAD',
    redirect: 'follow',
  })

  if (response.status === 404) {
    return { status: 'hallucinated', reason: 'DOI does not exist' }
  }

  // Get metadata from Crossref
  const metadata = await fetch(`https://api.crossref.org/works/${doi}`).then((r) => r.json())

  return { status: 'exists', metadata: metadata.message }
}
```

#### Stage 2: Fuzzy Matching

For citations without DOIs, or when DOI lookup fails:

```typescript
async function fuzzyVerify(citation: Citation): Promise<VerificationResult> {
  // Search Crossref by title
  const results = await fetch(
    `https://api.crossref.org/works?query.title=${encodeURIComponent(citation.title)}&rows=5`
  ).then((r) => r.json())

  for (const work of results.message.items) {
    const score = calculateMatchScore(citation, work)
    if (score > 0.85) return { status: 'valid', match: work }
    if (score > 0.7) return { status: 'partially_valid', match: work }
  }

  return { status: 'hallucinated', reason: 'No matching publication found' }
}

function calculateMatchScore(cited: Citation, found: CrossrefWork): number {
  const titleSim = fuzzyTokenMatch(cited.title, found.title[0]) * 0.6
  const authorSim = jaccardAuthors(cited.authors, found.author) * 0.3
  const yearMatch = (cited.year === found.published?.['date-parts']?.[0]?.[0] ? 1 : 0) * 0.1
  return titleSim + authorSim + yearMatch
}
```

**Scoring weights** (from research):

- Title similarity: 60% weight (token-based fuzzy matching)
- Author similarity: 30% weight (Jaccard on normalized names)
- Year match: 10% weight

#### Stage 3: LLM Verification (optional)

For ambiguous cases (score 0.50-0.70), use an LLM with structured output to classify.

### Classification Categories

| Category            | Criteria                                                | Action          |
| ------------------- | ------------------------------------------------------- | --------------- |
| **Valid**           | DOI resolves, metadata matches                          | Use citation    |
| **Partially Valid** | Paper found but minor discrepancies (typos, formatting) | Correct and use |
| **Hallucinated**    | No matching publication in any database                 | Remove citation |

### Prevention at Generation Time

To achieve <0.1% hallucination rate in the blog pipeline:

1. **Never let LLM invent citations** — only select from pre-retrieved PubMed results
2. **Retrieve first, cite second** — search PubMed for the topic, then ask LLM to select relevant results
3. **Real-time DOI validation** — verify every DOI before including in output
4. **Post-generation cleaning** — run all citations through the 3-stage pipeline
5. **Audit trail** — store PMID/DOI provenance for every citation

---

## 8. Rate Limits & Best Practices

### NCBI E-utilities

| Scenario     | Rate Limit               | Notes                   |
| ------------ | ------------------------ | ----------------------- |
| No API key   | 3 requests/second        | Per IP address          |
| With API key | 10 requests/second       | Per key, across all IPs |
| Enhanced key | Custom (apply via email) | Requires justification  |

**Getting an API key:**

1. Register at https://www.ncbi.nlm.nih.gov/account/
2. Go to Settings > API Key Management
3. Generate key
4. Add `&api_key=YOUR_KEY` to all requests

**Best practices:**

- Post no more than 3 req/s without key, 10 req/s with key
- Large jobs: weekends or 9 PM - 5 AM ET weekdays
- Use history server (`usehistory=y`) for batch retrieval
- Fetch in batches of 200-500 records per EFetch call
- Include `tool=<appname>&email=<email>` parameters for identification

### Crossref

| Scenario       | Rate Limit                 |
| -------------- | -------------------------- |
| Without mailto | ~50 req/s (shared pool)    |
| With mailto    | Polite pool (better rates) |

Add `?mailto=you@example.com` to all requests.

### Caching Strategy

```typescript
interface CacheConfig {
  // PubMed search results: cache for 24 hours (new papers indexed daily)
  searchResults: { ttl: 86400 }

  // Article metadata: cache for 30 days (rarely changes)
  articleMetadata: { ttl: 2592000 }

  // DOI resolution: cache for 90 days (DOIs are permanent)
  doiMetadata: { ttl: 7776000 }

  // Citation verification: cache for 30 days
  verificationResults: { ttl: 2592000 }

  // Dutch guidelines: cache for 90 days (updated infrequently)
  dutchGuidelines: { ttl: 7776000 }
}
```

**Implementation**: Use Redis or a database table with TTL-based invalidation. For the n8n blog pipeline, store cached results in Supabase.

---

## 9. Proposed Pipeline Architecture

### End-to-End Citation Workflow for Blog Factory

```
Blog Topic/Section
       |
       v
[1. Topic → MeSH Mapping]
       |
       v
[2. PubMed ESearch] ──→ PMIDs
       |
       v
[3. EFetch Metadata] ──→ Citation objects
       |
       v
[4. Relevance Scoring] ──→ Top N citations per section
       |
       v
[5. PubTator Relation Check] ──→ Verify claim-evidence link
       |
       v
[6. DOI Validation] ──→ Confirm citations are real
       |
       v
[7. Dutch Source Enrichment] ──→ Add NHG/NVDV references
       |
       v
[8. Format & Attach to Blog] ──→ Structured citation objects
```

### n8n Implementation Notes

Each step maps to an n8n node:

1. **Code node** — map blog section keywords to MeSH terms
2. **HTTP Request node** — ESearch API call
3. **HTTP Request node** — EFetch API call (batch)
4. **Code node** — relevance scoring algorithm
5. **HTTP Request node** — PubTator3 API (optional, for claim verification)
6. **HTTP Request node** — Crossref DOI validation
7. **Code node** — merge with curated Dutch guideline library
8. **Code node** — format final citation array for blog MDX

### Rate Limit Handling in n8n

- Add 100ms delay between PubMed requests (stays under 10/s with key)
- Add 20ms delay between Crossref requests
- Use n8n's built-in retry on 429 responses
- Cache results in Supabase to avoid repeated API calls

---

## Sources

- [NCBI E-utilities Quick Start](https://www.ncbi.nlm.nih.gov/books/NBK25500/)
- [E-utilities In-Depth Parameters](https://www.ncbi.nlm.nih.gov/books/NBK25499/)
- [NCBI API Keys](https://ncbiinsights.ncbi.nlm.nih.gov/2017/11/02/new-api-keys-for-the-e-utilities/)
- [PubTator 3.0 Paper (NAR 2024)](https://academic.oup.com/nar/article/52/W1/W540/7640526)
- [PubTator3 Interface](https://www.ncbi.nlm.nih.gov/research/pubtator3/)
- [NCBI Text Mining APIs](https://www.ncbi.nlm.nih.gov/research/bionlp/APIs/)
- [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)
- [DOI Content Negotiation](https://citation.doi.org/docs.html)
- [Citation Hallucination Detection (GitHub)](https://github.com/Vikranth3140/Citation-Hallucination-Detection)
- [LLM Citation Hallucination Rates (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11153973/)
- [NHG-Richtlijnen](https://richtlijnen.nhg.org/)
- [Richtlijnendatabase](https://richtlijnendatabase.nl/)
- [Farmacotherapeutisch Kompas](https://www.farmacotherapeutischkompas.nl/)
