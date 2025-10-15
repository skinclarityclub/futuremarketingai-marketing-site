# 🚨 CRITICAL: Calculator.tsx Hardcoded Strings

**Date**: October 11, 2025  
**Status**: MANY HARDCODED STRINGS FOUND  
**Priority**: 🔴 **HIGH**

---

## ❌ FOUND HARDCODED STRINGS

### **Calculator.tsx** (`src/pages/Calculator.tsx`)

#### Line 362 - Call to Action

```typescript
❌ "👇 <strong>Calculate below</strong> what you SAVE with automated AI"
```

#### Lines 324-355 - Pain Section (6 bullets)

```typescript
❌ "<strong>60+ hours/week</strong> wasted on manual content creation..."
❌ "<strong>€10K-€15K/month</strong> in team costs..."
❌ "<strong>Only 40 posts/month</strong> across 7 platforms..."
❌ "<strong>No time for strategy</strong> constantly firefighting..."
❌ "<strong>Blind advertising</strong> without data..."
❌ "<strong>Off-the-shelf solutions</strong> require compromises..."
```

#### Lines 416-428 - Team Size Quick Buttons

```typescript
❌ "Lean (1-5)"
❌ "Growing (5-15)"
❌ "⭐ Scaling (15-50) - Recommended"
```

#### Lines 453-459 - Channel Descriptions

```typescript
❌ "Starting out"
❌ "⭐ Perfect fit"
❌ "⭐ High volume"
❌ "Enterprise scale"
```

#### Line 482 - High Spend Alert

```typescript
❌ "<strong>High spend detected!</strong> You could save significant costs..."
```

#### Line 507 - Advanced Settings

```typescript
❌ "Advanced Settings (optional)"
```

#### Lines 539-540 - Team Description

```typescript
❌ "For teams like yours: {teamSize} people managing {channels} channels..."
```

#### Lines 546-547 - Custom-Built Message

```typescript
❌ "<span>🔧 Custom-Built Advantage:</span> This ROI is possible because..."
```

#### Lines 556-602 - Metric Labels (4x)

```typescript
❌ "Time Saved"
❌ "Labor Cost Savings"
❌ "Content Output"
❌ "Revenue Increase"
```

#### Lines 635-638 - Share Section

```typescript
❌ "Share Your Results"
❌ "Save or share your ROI calculation with your team"
```

#### Line 970 - Loading Text

```typescript
❌ "Scheduling laden..." (mixed NL!)
```

---

## 📊 SUMMARY

**Total Hardcoded Strings**: ~25+  
**Sections Affected**:

- Pain points section (6 bullets)
- Team size buttons (3)
- Channel descriptions (4)
- Alert messages (1)
- Metric labels (4)
- Share section (2)
- Misc labels (5+)

---

## ⚠️ IMPACT

**Current State**: Calculator appears mostly translated but has ~25 hardcoded strings  
**User Experience**: Mixed languages, especially in:

- Pain section (ALL bullets hardcoded)
- Quick buttons (ALL hardcoded)
- Metric labels (ALL hardcoded)

---

## 🎯 ACTION NEEDED

1. Add `calculator:pain_bullets` section (6 keys)
2. Add `calculator:team_size_buttons` section (3 keys)
3. Add `calculator:channel_descriptions` section (4 keys)
4. Add `calculator:alerts` section
5. Add `calculator:metric_labels` section (4 keys)
6. Add `calculator:share_section` keys
7. Update Calculator.tsx to use all translations

**Estimated time**: 30-45 minutes  
**Priority**: HIGH - Core calculation page!

---

**Status**: READY TO FIX 🔧
