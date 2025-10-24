# 🚨 MOBILE ARCHITECTURE PRINCIPLES - CRITICAL

## ⚠️ DESKTOP-FIRST APPROACH - NON-NEGOTIABLE

**THIS PROJECT IS DESKTOP-FIRST. MOBILE IS AN ADDITIONAL VARIANT.**

### Core Principle:

```
Desktop Performance & Experience = PRIMARY
Mobile Experience = SUPPLEMENTAL (Separate variant)
```

## 🎯 Critical Rules:

### 1. **Desktop Blijft Onaangetast**

- ✅ Desktop code, componenten en performance mogen NIET verslechteren
- ✅ Desktop is de primaire experience en moet altijd optimaal blijven
- ❌ NOOIT desktop breakpoints aanpassen voor mobile
- ❌ NOOIT desktop componenten vervangen/verwijderen voor mobile

### 2. **Mobile is een Separate Variant**

- ✅ Maak NIEUWE mobile-specific componenten (bijv. `SimplifiedHeroMobile`)
- ✅ Gebruik conditional rendering: `isMobile ? <MobileVariant /> : <DesktopVariant />`
- ✅ Mobile componenten leven naast desktop, niet in plaats van
- ✅ Desktop components blijven 100% intact en unchanged

### 2.1 **🔥 CRITICAL: Content Parity Rule**

**Mobile componenten MOETEN exact dezelfde inhoud gebruiken als desktop.**

**Inhoudelijke Content Regels:**

- ✅ **DO:** Gebruik EXACT dezelfde translation keys als desktop
- ✅ **DO:** Gebruik EXACT dezelfde data sources (API, state, props)
- ✅ **DO:** Behoud EXACT dezelfde teksten, testimonials, cijfers, statistieken
- ✅ **DO:** Pas ALLEEN layout/presentatie aan (grid → carousel, 4-col → 2-col)
- ✅ **DO:** Condenseer visuele hiërarchie, maar behoud alle content
- ❌ **DON'T:** Verzin NOOIT nieuwe content voor mobile
- ❌ **DON'T:** Maak GEEN nieuwe testimonials/quotes/data
- ❌ **DON'T:** Gebruik GEEN andere translation keys dan desktop
- ❌ **DON'T:** Verander GEEN teksten of voeg features toe die desktop niet heeft

**Voorbeeld - Social Proof Section:**

```typescript
// ❌ VERKEERD - Nieuwe content voor mobile
function MobileSocialProof() {
  const testimonials = [
    { quote: "Nieuwe mobile testimonial...", author: "Mobile User" }  // FOUT!
  ]
  return <Carousel items={testimonials} />
}

// ✅ CORRECT - Exact desktop data, alleen layout anders
function MobileSocialProof() {
  const { t } = useTranslation('common')
  const foundingTeams = t('landing.social_proof.founding_teams.teams', {
    returnObjects: true
  }) // EXACT dezelfde key als desktop!

  return (
    <Carousel>
      {foundingTeams.map(team => (
        <TeamCard key={team.name} {...team} />  // Zelfde data, andere layout
      ))}
    </Carousel>
  )
}
```

**Desktop Component (blijft intact):**

```typescript
// src/components/landing/SocialProof.tsx - UNCHANGED
const foundingTeams = t('landing.social_proof.founding_teams.teams', {
  returnObjects: true
})

return (
  <div className="grid grid-cols-3">  {/* Desktop layout */}
    {foundingTeams.map(team => <TeamCard {...team} />)}
  </div>
)
```

**Waarom Content Parity Cruciaal Is:**

1. **Consistentie**: Gebruikers moeten dezelfde informatie zien, ongeacht device
2. **Trust**: Verschillende content op mobile/desktop ondermijnt geloofwaardigheid
3. **Maintenance**: Eén content source = eenvoudiger te onderhouden
4. **SEO**: Consistent content = betere search rankings
5. **Translations**: Eén set translation keys = makkelijker te vertalen

### 3. **Responsive Design Strategie**

```typescript
// ✅ CORRECT - Desktop first, mobile variant toegevoegd
{isMobile ? (
  <SimplifiedHeroMobile />  // Nieuwe component
) : (
  <Hero />  // Originele desktop component - INTACT
)}

// ❌ VERKEERD - Desktop aanpassen voor mobile
<Hero className="md:block hidden" />  // Dit pakt desktop aan!
```

### 4. **Tailwind CSS Approach**

- ✅ Desktop styles zijn de BASE styles (geen prefix)
- ✅ Mobile overrides alleen in mobile-specific componenten
- ❌ Gebruik GEEN `sm:` of `md:` prefixes op desktop componenten
- ❌ Verander GEEN bestaande Tailwind config die desktop beïnvloedt

### 5. **Component Architecture**

```
src/
  components/
    common/          # Desktop components (blijven intact!)
      Hero.tsx
      FeatureGrid.tsx
    mobile/          # NIEUWE mobile variants
      SimplifiedHeroMobile.tsx
      MobileFeatureCarousel.tsx
```

### 6. **Performance Priorities**

1. **Desktop performance** = Prioriteit #1 (mag NOOIT verslechteren)
2. Mobile performance = Prioriteit #2 (apart geoptimaliseerd)
3. Mobile krijgt eigen bundle splitting
4. Desktop en Mobile assets gescheiden

## 🔍 Testing Checklist:

### Voor Elke Mobile Change:

- [ ] Desktop versie werkt nog exact zoals voorheen?
- [ ] Desktop performance is gelijk of beter?
- [ ] Desktop componenten zijn niet aangepast?
- [ ] Mobile variant is volledig gescheiden?
- [ ] Conditional rendering werkt correct?

## 📋 Implementation Pattern:

### ✅ CORRECT Pattern:

```typescript
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Hero } from '@/components/common/Hero';
import { SimplifiedHeroMobile } from '@/components/mobile/SimplifiedHeroMobile';

function HeroSection() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      {/* Desktop - Original component, unchanged */}
      {!isMobile && <Hero />}

      {/* Mobile - New separate component */}
      {isMobile && <SimplifiedHeroMobile />}
    </>
  );
}
```

### ❌ WRONG Pattern:

```typescript
// NOOIT DOEN - Dit pakt desktop aan!
function Hero() {
  return (
    <div className="hidden md:flex lg:grid">  // Desktop wordt aangepast!
      {/* ... */}
    </div>
  );
}
```

## 🎨 Why Desktop-First?

1. **Target Audience**: Primaire gebruikers zijn business professionals op desktop
2. **Demo Complexity**: Interactieve visualisaties, complex dashboards vereisen desktop
3. **Conversion**: Desktop heeft hogere conversie voor B2B SaaS demos
4. **Performance**: Desktop power voor 3D visualisaties, real-time updates
5. **Mobile = Teaser**: Mobile is discovery/teaser voor desktop experience

## 🚀 Mobile Philosophy:

**Mobile is een "appetizer" voor de desktop experience:**

- Toon wat mogelijk is
- Encourage desktop usage voor volledige demo
- Simplified, snackable content
- Clear CTA's naar desktop experience

## ⚡ Desktop-First Development Flow:

1. Build desktop feature FIRST
2. Test desktop performance
3. THEN add mobile variant (if needed)
4. Test both independently
5. Never compromise desktop for mobile

## 🔐 Code Review Questions:

Before merging ANY mobile work, ask:

1. Is desktop component/performance unchanged?
2. Are mobile components truly separate?
3. Is conditional rendering clean and clear?
4. Have we tested desktop after mobile changes?
5. Are we adding complexity to desktop code?

---

## 📢 Remember:

> **DESKTOP FIRST. MOBILE SECOND. NEVER COMPROMISE DESKTOP.**

Desktop users are our primary target. Mobile is supplemental discovery.
If in doubt, prioritize desktop experience ALWAYS.

---

**Last Updated**: 2025-10-24
**Status**: ACTIVE - MUST FOLLOW
