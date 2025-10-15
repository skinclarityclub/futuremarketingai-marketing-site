# 🔍 COMPLETE i18n Hardcoded Strings Audit

**Date**: October 11, 2025  
**Status**: CRITICAL - Many hardcoded strings found!

---

## ❌ FOUND HARDCODED STRINGS

### **Hero.tsx** (`src/pages/Hero.tsx`)

#### Line 488 - Main CTA Button

```typescript
❌ "Verken Platform →"
✅ Should be: {t('hero:cta.explore_platform')}
```

#### Line 502 - Premium Services Title

```typescript
❌ "All-in-One Premium Services"
✅ Should be: {t('hero:premium.title')}
```

#### Line 504-505 - Premium Services Description

```typescript
❌ "Three powerful modules working seamlessly for complete marketing automation"
✅ Should be: {t('hero:premium.description')}
```

#### Line 529-530 - Early Adopter CTA

```typescript
❌ "Join the First 10 Pioneer Teams"
❌ "Be among the early adopters building tomorrow's competitive advantage. 3 teams already running 24/7. 7 Founders Pricing spots remaining (60% off, locked forever)."
✅ Should be translation keys
```

#### Line 531 - Primary CTA

```typescript
❌ "Apply for Founders Pricing →"
```

#### Line 536 - Secondary CTA

```typescript
❌ "Calculate Your ROI"
```

#### Line 542 - Urgency Text

```typescript
❌ "💰 €5K/month ROI guarantee or money back"
```

#### Line 544-546 - Trust Indicators

```typescript
❌ '✓ Direct Slack access to founder'
❌ '✓ Co-create the roadmap with us'
❌ '✓ No credit card required - we review in 24h'
```

#### Line 567 - Floating CTA

```typescript
❌ "Ready to Start?"
```

#### Line 574 - Urgency Text

```typescript
❌ "⏰ Only 3 spots left"
```

#### Line 576-577 - Trust Indicators

```typescript
❌ '✓ 30-min call'
❌ '✓ No commitments'
```

#### Line 588-589 - Exit Intent

```typescript
❌ "Wait! Don't Miss This"
❌ "Book a free 30-minute consultation and discover how FutureMarketingAI can automate your marketing."
```

#### Line 591 - Button

```typescript
❌ "Book Free Call"
```

#### Line 597 - Button

```typescript
❌ "Not Now"
```

#### Line 600 - Urgency

```typescript
❌ "⏰ Bonus: Free ROI scan"
```

#### Line 602-604 - Trust Indicators

```typescript
❌ '✓ 30-min call'
❌ '✓ Personal ROI analysis'
❌ '✓ No commitments'
```

#### Line 619 - Loading Text

```typescript
❌ "Scheduling laden..."
```

---

### **Estimate: 30+ hardcoded strings in Hero.tsx ALONE!**

---

## 📋 ACTION REQUIRED

1. ✅ Create `hero:cta` section in translations
2. ✅ Create `hero:premium` section
3. ✅ Create `hero:early_adopter` section
4. ✅ Create `hero:floating_cta` section
5. ✅ Create `hero:exit_intent` section
6. ✅ Create `hero:loading` section

---

## 🎯 PRIORITY

**CRITICAL** - These are the MAIN landing page CTAs that users see first!
