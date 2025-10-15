# 🏗️ Complete SaaS Architecture Blueprint

**Date:** October 15, 2025  
**Question:** Hoe landingpage, demo én platform het beste indelen?  
**Answer:** Based on industry best practices from Stripe, Vercel, Notion, Linear

---

## 📊 **Jouw Situatie - Wat Je Hebt**

```
1. Landing Page  → SEO belangrijk
   ├── Demo button
   └── Login button

2. Demo          → Net gemaakt, schone code
   └── ROI Calculator, Explorer, etc.

3. Platform      → Na login, voor klanten
   └── Command Center, Dashboard, Analytics
```

**Vraag:** Aparte repos? Hoe indelen? Wat doen grote bedrijven?

---

## 🎯 **INDUSTRY BEST PRACTICE: 3-Tier Architecture**

### **Tier 1: Marketing Website (Public)**

- **Purpose:** SEO, lead generation, brand awareness
- **URL:** `futuremarketingai.com`
- **Auth:** None (public)
- **Content:** Landing page, about, pricing, blog

### **Tier 2: Interactive Demo (Public)**

- **Purpose:** Product exploration, pre-sales
- **URL:** `futuremarketingai.com/demo`
- **Auth:** None or optional (tracking only)
- **Content:** Calculator, explorer, feature showcase

### **Tier 3: Customer Platform (Protected)**

- **Purpose:** Actual product, customer workflow
- **URL:** `futuremarketingai.com/app`
- **Auth:** Required (authentication wall)
- **Content:** Dashboard, analytics, command center

---

## 🏆 **REAL-WORLD EXAMPLES**

### **1. Stripe (Perfect Example)**

```
Tier 1: stripe.com/                    # Marketing
        ├── Products
        ├── Pricing
        ├── Docs
        └── [Get Started] button

Tier 2: stripe.com/payments/checkout   # Interactive demos
        stripe.com/terminal             # Product demos

Tier 3: dashboard.stripe.com/          # Platform (login required)
        ├── Payments
        ├── Customers
        └── Reports
```

**Architecture:**

- Marketing: One repo (Next.js static)
- Demos: Embedded in marketing site
- Platform: Separate repo + subdomain

**Why it works:**

- ✅ SEO power for marketing
- ✅ Interactive demos for conversion
- ✅ Platform scalability independent

---

### **2. Vercel (Your Exact Use Case!)**

```
Tier 1: vercel.com/                    # Marketing
        ├── Features
        ├── Templates
        ├── Pricing
        └── [Start Deploying] button

Tier 2: vercel.com/templates          # Interactive demo/explorer
        vercel.com/new                 # Try before login

Tier 3: vercel.com/dashboard          # Platform (subpath!)
        OR dashboard.vercel.app        # Alternative subdomain
```

**Architecture:**

- Marketing + Demos: One repo
- Platform: Separate repo (can be subpath OR subdomain)

**Why it works:**

- ✅ Simple structure
- ✅ Fast marketing deploys
- ✅ Platform isolation
- ✅ Great SEO

---

### **3. Notion (Clean Example)**

```
Tier 1: notion.so/                     # Marketing
        └── [Try Notion] button

Tier 2: notion.so/product              # Product demos/pages

Tier 3: notion.so/workspace            # Platform (subpath)
        ├── /workspace/settings
        └── /workspace/templates
```

**Architecture:**

- Everything in one monorepo
- Route-based separation

**Why it works:**

- ✅ Single codebase
- ✅ Easy deployment
- ✅ Unified SEO
- ✅ Consistent UX

---

### **4. Linear (Modern Approach)**

```
Tier 1: linear.app/                    # Marketing
        └── [Get Started] button

Tier 2: linear.app/method              # Methodology/demo content

Tier 3: linear.app/team/[slug]         # Platform (dynamic routes)
```

**Architecture:**

- Unified Next.js monorepo
- Smart routing with middleware

---

## 🎯 **RECOMMENDED ARCHITECTURE FOR YOU**

### **Option A: Hybrid Approach (RECOMMENDED)** ⭐⭐⭐

**Best balance of SEO, maintainability, and scalability.**

```
Repository Structure:
├── Marketing + Demo (Repo 1)
│   └── futuremarketingai.com
│       ├── / (landing)
│       ├── /demo/calculator
│       ├── /demo/explorer
│       ├── /pricing
│       └── /login → redirects to /app
│
└── Platform (Repo 2)
    └── Deployed separately
        But served via: futuremarketingai.com/app
```

**URL Structure:**

```
Public (No Auth):
✅ futuremarketingai.com/              # Landing page
✅ futuremarketingai.com/demo          # Demo hub
✅ futuremarketingai.com/demo/calculator
✅ futuremarketingai.com/demo/explorer
✅ futuremarketingai.com/pricing
✅ futuremarketingai.com/about

Protected (Auth Required):
🔒 futuremarketingai.com/app           # Platform root
🔒 futuremarketingai.com/app/dashboard
🔒 futuremarketingai.com/app/analytics
🔒 futuremarketingai.com/app/campaigns
```

**How it works:**

```javascript
// Vercel Rewrite (in marketing repo)
{
  "rewrites": [
    {
      "source": "/app/:path*",
      "destination": "https://platform-internal.vercel.app/:path*"
    }
  ]
}
```

**To users:** Everything looks like one site!  
**To Google:** All under one domain = maximum SEO!  
**To developers:** Two clean, separate codebases!

---

### **Implementation Details:**

**Repo 1: Marketing + Demo**

```
futuremarketingai-marketing/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── demo/
│   │   ├── page.tsx               # Demo hub
│   │   ├── calculator/            # Calculator demo
│   │   └── explorer/              # Explorer demo
│   ├── pricing/
│   ├── about/
│   └── login/                      # Login form (redirects)
├── components/
│   ├── landing/                    # Landing page components
│   └── demo/                       # Demo components
└── vercel.json                     # Rewrite rules
```

**Deployment:**

- Domain: `futuremarketingai.com`
- Vercel: Static optimization
- Fast, cheap, SEO-optimized

---

**Repo 2: Platform**

```
futuremarketingai-platform/
├── app/
│   ├── layout.tsx                  # Platform layout (with auth)
│   ├── dashboard/
│   ├── analytics/
│   ├── campaigns/
│   └── settings/
├── middleware.ts                   # Auth protection
├── components/
│   ├── dashboard/
│   └── command-center/
└── lib/
    └── supabase/                   # Database, auth
```

**Deployment:**

- Internal URL: `platform-internal.vercel.app`
- Public URL: `futuremarketingai.com/app` (via rewrite)
- Full-stack, Supabase, scalable

---

## 📊 **COMPARISON TABLE**

| Architecture                | SEO    | Maintenance | Scalability | Complexity     | Score     |
| --------------------------- | ------ | ----------- | ----------- | -------------- | --------- |
| **Hybrid (Recommended)**    | ⭐⭐⭐ | ⭐⭐⭐      | ⭐⭐⭐      | ⭐⭐ Medium    | **10/10** |
| Monorepo (All in one)       | ⭐⭐⭐ | ⭐⭐        | ⭐⭐        | ⭐⭐⭐ Complex | **8/10**  |
| Full Separation + Subdomain | ⭐     | ⭐⭐⭐      | ⭐⭐⭐      | ⭐ Easy        | **6/10**  |

---

## 🎨 **USER FLOW - HOW IT WORKS**

### **Scenario 1: New Visitor (Marketing)**

```
1. User lands on: futuremarketingai.com
   → Sees hero section, value prop, features

2. User clicks: [Try Demo]
   → Goes to: futuremarketingai.com/demo/calculator
   → No login required
   → Can explore features

3. User convinced → clicks: [Get Started]
   → Goes to: futuremarketingai.com/login
   → Signs up
   → Redirects to: futuremarketingai.com/app/dashboard
```

**Result:** Smooth funnel, all same domain, excellent SEO!

---

### **Scenario 2: Returning Customer (Platform)**

```
1. User goes to: futuremarketingai.com/app
   → Middleware checks authentication

2. If NOT logged in:
   → Redirect to: /login?redirect=/app

3. If logged in:
   → Show: Platform dashboard
   → Full SaaS features available
```

**Result:** Secure platform access, seamless UX!

---

## 🔒 **AUTHENTICATION STRATEGY**

### **Middleware Protection:**

```typescript
// middleware.ts (in Platform repo)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Redirect to login page on marketing site
    return NextResponse.redirect(
      new URL('/login?redirect=' + req.nextUrl.pathname, 'https://futuremarketingai.com')
    )
  }

  return res
}

export const config = {
  matcher: ['/app/:path*'],
}
```

**Result:**

- ✅ Secure platform
- ✅ Seamless redirect to marketing login
- ✅ Return to intended page after login

---

## 🚀 **BUTTON CONFIGURATION**

### **Landing Page Buttons:**

```typescript
// Landing page (Marketing repo)
<Hero>
  <h1>Future Marketing AI</h1>

  {/* Demo Button - No auth required */}
  <Button href="/demo/calculator" variant="secondary">
    Try Demo
  </Button>

  {/* Login Button - Redirects to app */}
  <Button href="/app" variant="primary">
    Get Started
  </Button>

  {/* Or Login button if they have account */}
  <Button href="/login" variant="ghost">
    Login
  </Button>
</Hero>
```

**Behavior:**

- **Try Demo** → `/demo/calculator` (no auth, instant access)
- **Get Started** → `/app` → checks auth → login if needed
- **Login** → `/login` → form → redirects to `/app` after success

---

## 📁 **COMPLETE FOLDER STRUCTURE**

### **Repo 1: futuremarketingai-marketing**

```
futuremarketingai-marketing/
├── public/
│   ├── images/
│   └── videos/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Marketing layout
│   │   ├── page.tsx                    # Landing page (Hero)
│   │   │
│   │   ├── demo/                       # 🎯 DEMO SECTION
│   │   │   ├── layout.tsx             # Demo layout
│   │   │   ├── page.tsx               # Demo hub/overview
│   │   │   ├── calculator/            # ROI Calculator
│   │   │   ├── explorer/              # Feature Explorer
│   │   │   └── journey/               # AI Journey Assistant
│   │   │
│   │   ├── pricing/
│   │   │   └── page.tsx               # Pricing page
│   │   ├── about/
│   │   │   └── page.tsx               # About page
│   │   ├── blog/
│   │   │   └── [...slug]/             # Blog posts
│   │   │
│   │   └── login/                      # 🔐 LOGIN PAGE
│   │       └── page.tsx               # Login form
│   │
│   ├── components/
│   │   ├── landing/                   # Landing page components
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── CTA.tsx
│   │   │
│   │   ├── demo/                      # Demo components
│   │   │   ├── Calculator/
│   │   │   ├── Explorer/
│   │   │   └── AIAssistant/
│   │   │
│   │   └── ui/                        # Shared UI
│   │
│   ├── lib/
│   │   ├── analytics.ts               # Marketing analytics
│   │   └── tracking.ts                # Demo usage tracking
│   │
│   └── styles/
│
├── vercel.json                         # 🔧 REWRITE RULES
└── package.json
```

**Key Points:**

- ✅ Clean, focused on marketing + demos
- ✅ No platform complexity
- ✅ Fast builds, optimized for SEO
- ✅ Demo section clearly separated

---

### **Repo 2: futuremarketingai-platform**

```
futuremarketingai-platform/
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Platform layout (with sidebar)
│   │   ├── page.tsx                    # Redirect to /dashboard
│   │   │
│   │   ├── dashboard/                  # 📊 MAIN DASHBOARD
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │
│   │   ├── analytics/                  # 📈 ANALYTICS
│   │   │   ├── page.tsx
│   │   │   └── [...views]/
│   │   │
│   │   ├── campaigns/                  # 🚀 CAMPAIGNS
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │
│   │   ├── content/                    # ✍️ CONTENT
│   │   ├── customers/                  # 👥 CUSTOMERS
│   │   ├── settings/                   # ⚙️ SETTINGS
│   │   │
│   │   └── api/                        # API ROUTES
│   │       ├── analytics/
│   │       ├── campaigns/
│   │       └── webhooks/
│   │
│   ├── components/
│   │   ├── dashboard/                  # Dashboard components
│   │   ├── command-center/             # Command center
│   │   ├── layout/                     # Platform layout
│   │   │   ├── Header.tsx             # Consolidated header
│   │   │   └── Sidebar.tsx            # Consolidated sidebar
│   │   └── ui/                         # Shared UI
│   │
│   ├── lib/
│   │   ├── supabase/                   # Supabase client
│   │   ├── ai/                         # AI integrations
│   │   └── workflows/                  # n8n workflows
│   │
│   ├── hooks/
│   ├── middleware.ts                   # 🔒 AUTH PROTECTION
│   └── styles/
│
└── package.json
```

**Key Points:**

- ✅ Full SaaS features
- ✅ Supabase backend
- ✅ Auth protection
- ✅ Complex workflows

---

## 🔗 **CROSS-LINKING STRATEGY**

### **From Marketing → Platform:**

```tsx
// In marketing repo
<Button href="/app/dashboard" onClick={() => trackEvent('cta_clicked', { location: 'hero' })}>
  Get Started
</Button>
```

### **From Platform → Marketing:**

```tsx
// In platform repo (e.g., footer)
<footer>
  <Link href="https://futuremarketingai.com/pricing">Pricing</Link>
  <Link href="https://futuremarketingai.com/about">About</Link>
  <Link href="https://futuremarketingai.com/blog">Blog</Link>
</footer>
```

### **Smart Navigation:**

```typescript
// Shared navigation config
export const NAV_CONFIG = {
  marketing: {
    home: '/',
    demo: '/demo',
    pricing: '/pricing',
    about: '/about',
  },
  platform: {
    dashboard: '/app/dashboard',
    analytics: '/app/analytics',
    campaigns: '/app/campaigns',
  }
}

// Use in both repos
<Link href={NAV_CONFIG.platform.dashboard}>
  Go to Dashboard
</Link>
```

---

## 🎯 **DEPLOYMENT CONFIGURATION**

### **Marketing Repo (Vercel):**

```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/app/:path*",
      "destination": "https://platform-production.vercel.app/:path*"
    }
  ],
  "headers": [
    {
      "source": "/app/:path*",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    }
  ]
}
```

**Configuration:**

- Custom Domain: `futuremarketingai.com`
- Environment: `production`
- Framework: Next.js
- Build Command: `npm run build`

---

### **Platform Repo (Vercel):**

```json
// vercel.json
{
  "headers": [
    {
      "source": "/:path*",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ],
  "env": {
    "SUPABASE_URL": "@supabase-url",
    "SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

**Configuration:**

- Internal URL: `platform-production.vercel.app`
- Public URL: Via marketing rewrite
- Framework: Next.js
- Database: Supabase

---

## 📊 **SEO STRATEGY**

### **What Gets Indexed:**

```
✅ futuremarketingai.com/              # Index
✅ futuremarketingai.com/demo          # Index (valuable content!)
✅ futuremarketingai.com/demo/calculator # Index
✅ futuremarketingai.com/pricing       # Index
✅ futuremarketingai.com/about         # Index
✅ futuremarketingai.com/blog/*        # Index

❌ futuremarketingai.com/app/*         # NoIndex (behind auth)
```

### **robots.txt:**

```
# public/robots.txt (Marketing repo)
User-agent: *
Allow: /
Allow: /demo/
Disallow: /app/

Sitemap: https://futuremarketingai.com/sitemap.xml
```

### **sitemap.xml:**

```xml
<!-- Only include public pages -->
<urlset>
  <url>
    <loc>https://futuremarketingai.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://futuremarketingai.com/demo</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://futuremarketingai.com/demo/calculator</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- etc -->
</urlset>
```

---

## ✅ **FINAL RECOMMENDATION**

### **For Your Situation:**

```
✅ Repo 1: Marketing + Demo
   └── futuremarketingai.com
       ├── / (landing)
       └── /demo/* (demos)

✅ Repo 2: Platform
   └── Served via: futuremarketingai.com/app
       (proxied from separate deployment)
```

**Why This Wins:**

1. **SEO:** ⭐⭐⭐ Maximum authority consolidation
2. **Maintenance:** ⭐⭐⭐ Clean separation of concerns
3. **Scalability:** ⭐⭐⭐ Platform can scale independently
4. **User Experience:** ⭐⭐⭐ Seamless, one domain
5. **Development:** ⭐⭐⭐ Two focused codebases
6. **Deployment:** ⭐⭐⭐ Independent deploy cycles
7. **Security:** ⭐⭐⭐ Platform isolated behind auth

---

## 🚀 **IMPLEMENTATION TIMELINE**

### **Week 1: Setup**

- Day 1-2: Create marketing repo structure
- Day 3-4: Migrate demo code to `/demo`
- Day 5: Configure Vercel rewrites

### **Week 2: Platform**

- Day 1-3: Clean up platform repo (headers, sidebars)
- Day 4-5: Test authentication flow
- Day 6-7: Configure deployments

### **Week 3: Integration**

- Day 1-2: Test complete user flow
- Day 3-4: SEO optimization (sitemap, robots.txt)
- Day 5: Launch!

---

## 📞 **NEXT STEPS**

**Ready to implement?**

**Step 1:** Finalize Git config & commit demo code  
**Step 2:** Create marketing repo with `/demo` structure  
**Step 3:** Deploy both repos  
**Step 4:** Configure Vercel rewrites  
**Step 5:** Test complete flow

**I can help with any step!** 🚀

---

**Status:** ✅ Complete Blueprint Ready  
**Questions:** Ready to answer!
