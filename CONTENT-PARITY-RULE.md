# 🔥 CONTENT PARITY RULE - MOBILE DEVELOPMENT

**Last Updated:** 2025-10-24  
**Status:** MANDATORY - MUST FOLLOW

---

## 🚨 Critical Principle

**Mobile components MUST use EXACT same content as desktop.**

---

## ✅ What IS Allowed

### Layout/Presentation Changes:

- ✅ Grid → Carousel (e.g., 3-column → 1-at-a-time carousel)
- ✅ Multi-column → Single column (e.g., 4-col grid → 2-col grid)
- ✅ Horizontal → Vertical stacking
- ✅ Full section → Condensed/collapsed (e.g., show first 4 of 12 items)
- ✅ Tabs → Accordion
- ✅ Sidebar → Bottom sheet/drawer
- ✅ Large imagery → Smaller optimized images (same images, different sizes)

### Technical Implementation:

- ✅ Use EXACT same translation keys: `t('landing.social_proof.title')`
- ✅ Use EXACT same data sources: `const teams = t('...teams', { returnObjects: true })`
- ✅ Use EXACT same API endpoints
- ✅ Use EXACT same prop interfaces (can conditionally render different layouts)
- ✅ Simplify visual hierarchy while keeping all content

---

## ❌ What is NOT Allowed

### Content Creation:

- ❌ Creating new testimonials/quotes for mobile
- ❌ Writing different text than desktop
- ❌ Inventing new statistics or numbers
- ❌ Adding features desktop doesn't have
- ❌ Using different translation keys (e.g., `mobile.new_content`)
- ❌ Fetching from different API endpoints
- ❌ Creating mobile-specific data that desktop doesn't show

### Examples of VIOLATIONS:

```typescript
// ❌ WRONG - New testimonials for mobile
const mobileTestimonials = [{ quote: 'Mobile-only quote', author: 'Mobile User' }]

// ❌ WRONG - Different translation key
const title = t('mobile.hero.new_title') // Desktop uses 'landing.hero.title'

// ❌ WRONG - New data
const mobileStats = { users: '100+', companies: '50+' } // Desktop shows different numbers
```

---

## ✅ Correct Implementation Examples

### Example 1: Social Proof Section

**Desktop (Original):**

```typescript
// src/components/landing/SocialProof.tsx
const { t } = useTranslation('common')
const foundingTeams = t('landing.social_proof.founding_teams.teams', {
  returnObjects: true
})

return (
  <div className="grid grid-cols-3 gap-8">
    {foundingTeams.map(team => (
      <TeamCard key={team.name} {...team} />
    ))}
  </div>
)
```

**Mobile (Adapted Layout):**

```typescript
// src/components/mobile/MobileSocialProof.tsx
const { t } = useTranslation('common')
const foundingTeams = t('landing.social_proof.founding_teams.teams', {
  returnObjects: true
}) // SAME translation key!

return (
  <Carousel>
    {foundingTeams.map(team => (
      <TeamCard key={team.name} {...team} />  // SAME data, different layout
    ))}
  </Carousel>
)
```

**✅ What Changed:** Grid → Carousel (layout only)  
**✅ What Stayed Same:** Translation key, data structure, team content

---

### Example 2: Hero Section

**Desktop:**

```typescript
const { t } = useTranslation('hero')
const headline = t('hero.headline')
const description = t('hero.description')
const ctaText = t('hero.cta')
```

**Mobile:**

```typescript
const { t } = useTranslation('hero')
const headline = t('hero.headline') // SAME key
const description = t('hero.description') // SAME key
const ctaText = t('hero.cta') // SAME key
```

**✅ What Changed:** Font sizes, spacing, button layout  
**✅ What Stayed Same:** All text content via same translation keys

---

## 🔍 How to Verify Content Parity

### Before Creating Mobile Component:

1. **Find the desktop component:**

   ```bash
   # Example: Finding SocialProof
   grep -r "SocialProof" src/components/landing/
   ```

2. **Identify translation keys:**

   ```typescript
   // Look for t('...') calls
   const title = t('landing.social_proof.title')
   const teams = t('landing.social_proof.founding_teams.teams', { returnObjects: true })
   ```

3. **Use EXACT same keys in mobile:**
   ```typescript
   // Mobile component - SAME KEYS
   const title = t('landing.social_proof.title')
   const teams = t('landing.social_proof.founding_teams.teams', { returnObjects: true })
   ```

### During Code Review:

Check for these RED FLAGS:

- ❌ New translation keys not in desktop
- ❌ Hardcoded text different from desktop
- ❌ Different API calls than desktop
- ❌ Data transformation that changes content
- ❌ Missing content that desktop shows

---

## 📋 Content Parity Checklist

Before committing mobile component:

- [ ] Desktop component identified and reviewed
- [ ] All translation keys match desktop EXACTLY
- [ ] All data sources match desktop EXACTLY
- [ ] All text content identical to desktop
- [ ] Only layout/presentation differs
- [ ] No new features added that desktop lacks
- [ ] Tested both desktop and mobile show same info

---

## 🎯 Why Content Parity Matters

### 1. **User Trust & Consistency**

Users switching between devices expect the same information. Different content undermines credibility.

### 2. **SEO & Indexing**

Search engines penalize sites with different mobile/desktop content. Consistent content = better rankings.

### 3. **Maintenance & Translations**

One content source = easier to update, translate, and maintain. No duplicate effort.

### 4. **Brand Consistency**

Testimonials, stats, and messaging should be consistent across all touchpoints.

### 5. **Legal & Compliance**

Claims, statistics, and testimonials must be accurate everywhere. Content divergence = legal risk.

---

## 🚀 Quick Reference

| Aspect               | Desktop                          | Mobile                                              |
| -------------------- | -------------------------------- | --------------------------------------------------- |
| **Translation Keys** | ✅ `landing.hero.title`          | ✅ `landing.hero.title` (SAME)                      |
| **Data Source**      | ✅ `t('teams', {returnObjects})` | ✅ `t('teams', {returnObjects})` (SAME)             |
| **Layout**           | Grid 3-col                       | Carousel 1-at-a-time (DIFFERENT ✅)                 |
| **Text Content**     | "Join 100+ teams"                | "Join 100+ teams" (SAME)                            |
| **Images**           | `/hero.jpg` (1200px)             | `/hero.jpg` (800px) (SAME image, different size ✅) |

---

## 📚 Related Documentation

- [MOBILE-ARCHITECTURE-PRINCIPLES.md](../MOBILE-ARCHITECTURE-PRINCIPLES.md)
- [.cursor/rules/mobile-architecture.mdc](../.cursor/rules/mobile-architecture.mdc)
- [.taskmaster/docs/mobile-optimization-prd.txt](../.taskmaster/docs/mobile-optimization-prd.txt)

---

## 🆘 When in Doubt

**Ask yourself:**

1. Does desktop show this exact content?
2. Am I using the same translation key/data source?
3. Am I only changing layout, not content?

If answer to ANY question is "No" → **STOP and reconsider.**

---

**Remember:** Mobile is a **layout variant**, not a **content variant**.

---
