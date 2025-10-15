# 🚨 CRITICAL: CTA System Hardcoded Strings

**Date**: October 11, 2025  
**Status**: CRITICAL ISSUE FOUND  
**Priority**: 🔴 **HIGHEST**

---

## ❌ CRITICAL COMPONENT: StrategicCTA.tsx

**Location**: `src/components/common/StrategicCTA.tsx`

### Default Props Are HARDCODED (Lines 70-75)

```typescript
urgencyText = '⏰ Free roadmap session ($1,500 value)',
trustIndicators = [
  '✓ 30-min strategy call',
  '✓ No credit card needed',
  '✓ Built for teams of 10-50',
],
```

**IMPACT**: ❌❌❌

- This component is used **EVERYWHERE** in the app
- Default text shown when props not passed
- Currently displays ENGLISH defaults even in NL/ES!

---

## 🔍 WHERE IT'S USED

StrategicCTA appears in multiple critical locations:

- Hero.tsx (already passing translation props ✅)
- Explorer.tsx (passing some props)
- Calculator.tsx
- Dashboard components
- And many more...

---

## ⚠️ THE PROBLEM

### Scenario 1: Props Passed (Currently OK)

```typescript
<StrategicCTA
  urgencyText={t('hero:exit_intent.urgency')}
  trustIndicators={[
    t('hero:exit_intent.trust_indicators.quick_call'),
    // ...
  ]}
/>
```

✅ Works! (Like in Hero.tsx)

### Scenario 2: Props NOT Passed (BROKEN)

```typescript
<StrategicCTA
  title="Some title"
  primaryText="Click me"
  onPrimaryClick={handleClick}
  // No urgencyText or trustIndicators passed!
/>
```

❌ Shows ENGLISH defaults in NL/ES!

---

## 🎯 THE FIX

### Option 1: Move Defaults to Translations (RECOMMENDED)

```typescript
export const StrategicCTA: React.FC<StrategicCTAProps> = ({
  // ...
  urgencyText,
  trustIndicators,
  // ...
}) => {
  const { t } = useTranslation(['common'])

  // Use translation defaults if not provided
  const finalUrgencyText = urgencyText || t('common:cta.default_urgency')
  const finalTrustIndicators = trustIndicators || [
    t('common:cta.default_trust.strategy_call'),
    t('common:cta.default_trust.no_cc'),
    t('common:cta.default_trust.team_size'),
  ]

  // ... rest of component
```

### Option 2: Force All Callers to Pass Props (NOT RECOMMENDED)

- Would require updating 50+ usages
- Error-prone
- Breaks existing code

---

## 📋 TRANSLATION KEYS NEEDED

### `common:cta` Section

```json
{
  "cta": {
    "default_urgency": "⏰ Free roadmap session ($1,500 value)",
    "default_trust": {
      "strategy_call": "✓ 30-min strategy call",
      "no_cc": "✓ No credit card needed",
      "team_size": "✓ Built for teams of 10-50"
    }
  }
}
```

**EN/NL/ES needed!**

---

## 🚀 ACTION PLAN

1. ✅ Add `cta` section to `common.json` (EN/NL/ES)
2. ✅ Update `StrategicCTA.tsx` to use translations as defaults
3. ✅ Test all StrategicCTA usages
4. ✅ Verify language switching works

---

## 📊 ESTIMATED IMPACT

**Components affected**: 50+ usages  
**Files to update**: 1 (StrategicCTA.tsx)  
**Translation keys to add**: 4 (× 3 languages = 12 total)  
**Priority**: 🔴 **CRITICAL** - Core CTA component!

---

**Status**: READY TO FIX 🔧
