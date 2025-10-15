# ROI Calculator LEAN Upgrade - PRD (Focus on NEW Features Only)

**Version**: 2.0  
**Date**: October 11, 2025  
**Status**: Ready for Implementation  
**Estimated Effort**: 2-3 weeks (~40-60 hours)

---

## Executive Summary

The current Calculator.tsx is already **excellent** with comprehensive features:

- ✅ ICP Scoring & Personalization
- ✅ ComparisonTable & ComparisonCharts
- ✅ StrategicCTA with Calendly integration
- ✅ ShareExportButtons with PDF export
- ✅ BreakEvenTimeline
- ✅ Progressive profiling
- ✅ Analytics tracking (GA4, Hotjar)

**This PRD focuses ONLY on 5 HIGH-IMPACT upgrades** to transform the linear form into a more engaging, gamified experience while **reusing all existing components**.

---

## 🎯 Top 5 New Features (Prioritized)

### Priority 1: Progressive Disclosure Wizard (HIGH IMPACT)

Transform single-page form → 3-step wizard for higher completion rate

### Priority 2: Real-Time Live Preview Panel (HIGH IMPACT)

Show ROI preview as user types → instant gratification

### Priority 3: Competitive Benchmarking Visual (MEDIUM IMPACT)

"You're in bottom 25%" → urgency & social proof

### Priority 4: Interactive Scenario Explorer (MEDIUM IMPACT)

"What if..." sliders → increase engagement time

### Priority 5: Achievement Badge System (LOW IMPACT, HIGH DELIGHT)

Gamification → shareability & viral potential

---

## Feature 1: Progressive Disclosure Wizard ⭐ PRIORITY 1

### Current State

- **Single-page form** with all inputs visible
- 60-70% completion rate
- Average time: 2.5 minutes

### Proposed Change

- **3-step wizard** with progress indicator
- Target completion: 80%+
- Target time: 3-4 minutes (more engagement)

### Wizard Steps

#### Step 1: Quick Profile (30 seconds)

**Reuse:** IndustrySelector component (already exists!)

```tsx
<IndustrySelector
  value={industry}
  onChange={setIndustry}
  variant="cards" // visual cards instead of dropdown
/>
```

**New:** Company size persona selector

- Solo (1) 👤
- Small Team (2-10) 👥
- Growing (11-50) 🏢
- Enterprise (51+) 🌐

**Reuse:** Team size slider (already exists, just move to step 1)

#### Step 2: Current Reality (45 seconds)

**Reuse:**

- Channels selector (already exists!)
- Marketing spend slider (already exists!)
- Campaigns slider (already exists!)

**New:** Live Preview Panel (see Feature 2)

#### Step 3: Your Goals (30 seconds)

**New:** Primary goal selector (cards)

- 🎯 Increase Leads
- ⏱️ Save Time
- 📈 Scale Output
- 💰 Reduce Costs

**Reuse:** Advanced settings (avg salary) - keep collapsible

### Implementation

**New Components Needed:**

1. `CalculatorWizard.tsx` - Main orchestrator
2. `WizardStep.tsx` - Step wrapper with transitions
3. `WizardProgress.tsx` - Progress indicator (or reuse ProgressIndicator?)

**Reuse Existing:**

- All InputSlider components
- All selectors (IndustrySelector, channels, etc.)
- All state management logic

**Changes to Calculator.tsx:**

- Wrap inputs in `<CalculatorWizard>` component
- Group inputs by step
- Add step navigation (Next/Back buttons)
- Auto-advance on selection where possible

**Estimated Effort**: 12-16 hours

---

## Feature 2: Real-Time Live Preview Panel ⭐ PRIORITY 1

### Current State

- ROI only shown after completing all inputs
- No feedback during input process

### Proposed Change

- **Live preview panel** (right side on desktop, below on mobile)
- Updates in real-time as user types
- Shows preview of key metrics

### Design

```tsx
<div className="grid md:grid-cols-2 gap-6">
  {/* Left: Inputs (existing) */}
  <div>
    <InputSlider ... />
  </div>

  {/* Right: Live Preview (NEW) */}
  <GlassCard className="sticky top-24">
    <h3>Your Potential ROI</h3>
    <AnimatedMetric
      value={calculateROI(inputs)}
      format="percentage"
      live // NEW prop for real-time updates
    />
    <ComparisonMini
      current={currentCost}
      withAI={withAICost}
    />
  </GlassCard>
</div>
```

### What to Show in Live Preview

1. **Hero Metric**: Estimated ROI% (animated)
2. **Cost Comparison**: "€3,500/mo → €1,200/mo"
3. **Time Saved**: "Save 40 hours/month"
4. **Benchmark**: "You're 62% behind industry average" (see Feature 3)

### Implementation

**New Component:**

- `LivePreviewPanel.tsx` - Sticky card with real-time updates

**Reuse:**

- AnimatedMetric (add `live` prop for smoother transitions)
- calculateROIMetrics (already exists)
- GlassCard

**Changes:**

- Debounce input updates (300ms) for performance
- useMemo for calculations (already done!)
- Add `useEffect` to track input changes

**Estimated Effort**: 6-8 hours

---

## Feature 3: Competitive Benchmarking Visual 📊 PRIORITY 2

### Current State

- Benchmarks shown as text
- No visual comparison to industry

### Proposed Change

- Visual bar showing user vs industry
- Clear positioning message

### Design

```tsx
<GlassCard className="border-2 border-yellow-500/30">
  <div className="flex items-center gap-3 mb-4">
    <span className="text-3xl">📊</span>
    <div>
      <h3 className="text-lg font-bold">Your Competitive Position</h3>
      <p className="text-sm text-white/70">How you compare to {industry} average</p>
    </div>
  </div>

  {/* Visual Bar */}
  <div className="space-y-3">
    <BenchmarkBar
      label="Content Output"
      yourValue={30}
      industryAvg={80}
      topPerformers={150}
      unit="posts/month"
    />
    <BenchmarkBar
      label="Marketing Efficiency"
      yourValue={40}
      industryAvg={65}
      topPerformers={95}
      unit="% automated"
    />
  </div>

  {/* Message */}
  <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
    <p className="text-sm text-white/90">
      ⚠️ <strong>You're in the bottom 25%</strong> of {industry} companies. With automation, you'd
      rank in the <strong>top 15%</strong>.
    </p>
  </div>
</GlassCard>
```

### Implementation

**New Components:**

1. `BenchmarkBar.tsx` - 3-tier visual bar (You, Avg, Top)
2. `CompetitivePositionCard.tsx` - Complete benchmark section

**Data Source:**

- Extend `benchmarks` object in `usePersonalization` hook
- Add industry-specific benchmarks to `icpScoring.ts`

**Reuse:**

- GlassCard
- Industry data from personalizationEngine.ts

**Estimated Effort**: 8-10 hours

---

## Feature 4: Interactive Scenario Explorer 🎮 PRIORITY 2

### Current State

- Static results based on one calculation
- No "what if" exploration

### Proposed Change

- Interactive sliders in results section
- Real-time ROI updates as user explores scenarios
- "Play around" encouragement

### Design

```tsx
<GlassCard className="p-6">
  <h3 className="text-xl font-bold mb-4">🎮 Explore Scenarios</h3>
  <p className="text-sm text-white/70 mb-6">
    Play with these sliders to see how different scenarios affect your ROI
  </p>

  <div className="space-y-4">
    <InteractiveSlider
      label="What if I scale to..."
      value={scaledCampaigns}
      min={campaignsPerMonth}
      max={campaignsPerMonth * 3}
      onChange={setScaledCampaigns}
      liveROI={calculateROI({ ...inputs, campaignsPerMonth: scaledCampaigns })}
    />

    <InteractiveSlider
      label="What if I add more platforms..."
      value={extraPlatforms}
      min={0}
      max={5}
      onChange={setExtraPlatforms}
      liveROI={calculateROI({ ...inputs, platforms: currentPlatforms + extraPlatforms })}
    />
  </div>

  <div className="mt-6 p-4 rounded-lg bg-accent-primary/10 border border-accent-primary/30">
    <p className="text-lg font-bold text-accent-primary">
      New ROI: {newROI}% (originally {metrics.totalROI}%)
    </p>
    <p className="text-sm text-white/80 mt-1">
      Scaling to {scaledCampaigns} campaigns could increase ROI by {roiIncrease}%!
    </p>
  </div>
</GlassCard>
```

### Implementation

**New Component:**

- `ScenarioExplorer.tsx` - Interactive exploration section

**Reuse:**

- InputSlider (style as InteractiveSlider)
- calculateROIMetrics
- AnimatedMetric for live updates

**Changes:**

- Add local state for scenario inputs
- Create `calculateScenarioROI()` wrapper function
- Use `useMemo` for performance

**Estimated Effort**: 6-8 hours

---

## Feature 5: Achievement Badge System 🏆 PRIORITY 3

### Current State

- No gamification elements
- Results are purely informational

### Proposed Change

- Award badges based on ROI results
- Shareable badge images
- Encourage social sharing

### Design

```tsx
{
  metrics.totalROI >= 300 && (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    >
      <AchievementUnlock
        badge="roi_champion"
        title="🏆 ROI Champion"
        description="You're in the top 5% of potential savings!"
        onShare={() => shareBadge('roi_champion')}
        onClose={() => setShowBadge(false)}
      />
    </motion.div>
  )
}
```

### Badge Tiers

| Badge            | Criteria              | Title                    | Icon |
| ---------------- | --------------------- | ------------------------ | ---- |
| **ROI Champion** | 300%+ ROI             | "Top 5% Potential"       | 🏆   |
| **Time Master**  | 500+ hours saved/year | "3+ months back!"        | ⚡   |
| **Scale Hero**   | 3x+ output increase   | "Dominate your industry" | 🚀   |
| **Cost Crusher** | €20K+ annual savings  | "Efficiency expert"      | 💰   |

### Implementation

**Reuse:**

- `achievementSystem.ts` (already exists!)
- `useAchievementTracking` hook (already exists!)

**New Components:**

1. `AchievementUnlock.tsx` - Full-screen badge reveal animation
2. `BadgeCard.tsx` - Shareable badge card (generates image)

**Integration:**

- Call `trackAchievement()` after ROI calculation
- Show badge unlock animation
- Enable social sharing with Open Graph image

**Estimated Effort**: 8-10 hours

---

## Implementation Roadmap

### Week 1: Foundation & High Impact

**Days 1-2**: Progressive Disclosure Wizard (12-16h)

- Build CalculatorWizard wrapper
- Migrate inputs to 3 steps
- Add progress indicator
- Test step navigation

**Days 3-4**: Live Preview Panel (6-8h)

- Create LivePreviewPanel component
- Add real-time ROI calculation
- Implement sticky positioning
- Mobile responsive layout

**Day 5**: Testing & Polish

- Fix bugs from Week 1
- Performance optimization
- Analytics integration

### Week 2: Engagement & Conversion

**Days 1-2**: Competitive Benchmarking (8-10h)

- Build BenchmarkBar component
- Add industry benchmark data
- Create CompetitivePositionCard
- Test with different industries

**Day 3**: Scenario Explorer (6-8h)

- Build ScenarioExplorer component
- Add interactive sliders
- Real-time ROI updates
- UX testing

**Days 4-5**: Achievement Badges (8-10h)

- Build AchievementUnlock component
- Integrate with achievementSystem.ts
- Add share functionality
- Test unlock animations

### Week 3: Polish & Launch

**Days 1-2**: Integration & Testing

- Integrate all new features
- Cross-browser testing
- Mobile optimization
- Performance audit

**Day 3**: Analytics & Tracking

- Add event tracking for new features
- A/B test setup (wizard vs linear)
- Hotjar heatmaps

**Days 4-5**: Launch Preparation

- Final QA
- Documentation
- Staging deployment
- Production launch

---

## Success Metrics (30 Days Post-Launch)

| Metric                   | Baseline | Target | Measurement               |
| ------------------------ | -------- | ------ | ------------------------- |
| **Completion Rate**      | 60%      | 80%+   | GA4 Funnel                |
| **Time on Calculator**   | 2.5 min  | 4+ min | GA4 Average Session       |
| **CTA Click Rate**       | 15%      | 30%+   | Custom Event Tracking     |
| **Share Rate**           | ~0%      | 10%+   | Share button clicks       |
| **Achievement Unlocks**  | N/A      | 60%+   | Achievement tracking      |
| **Scenario Exploration** | N/A      | 40%+   | Slider interaction events |

---

## Technical Requirements

### Component Reuse (NO new dependencies!)

- ✅ AnimatedMetric
- ✅ BreakEvenTimeline
- ✅ ComparisonTable & ComparisonCharts
- ✅ StrategicCTA
- ✅ ShareExportButtons
- ✅ GlassCard
- ✅ InputSlider
- ✅ ProgressIndicator
- ✅ IndustrySelector
- ✅ usePersonalization
- ✅ calculateROIMetrics
- ✅ achievementSystem.ts
- ✅ analytics (GA4, Hotjar)

### New Components (Minimal)

1. `CalculatorWizard.tsx` (~200 lines)
2. `WizardStep.tsx` (~80 lines)
3. `LivePreviewPanel.tsx` (~150 lines)
4. `BenchmarkBar.tsx` (~100 lines)
5. `CompetitivePositionCard.tsx` (~120 lines)
6. `ScenarioExplorer.tsx` (~180 lines)
7. `AchievementUnlock.tsx` (~150 lines)

**Total New Code**: ~1,000 lines (manageable!)

### Performance Considerations

- Debounce live preview updates (300ms)
- useMemo for all calculations (already done)
- Lazy load achievement animations
- Code splitting for wizard steps

---

## Design Guidelines

### Animation Principles

- **Duration**: 200-400ms for transitions
- **Easing**: `ease-in-out` for smooth feel
- **Stagger**: 50-100ms for sequential reveals
- **Badge unlock**: 800ms spring animation

### Mobile Responsive

- Wizard: Full-screen steps on mobile
- Live Preview: Below inputs (not side-by-side)
- Benchmark bars: Horizontal scroll on mobile
- Achievement: Full-screen overlay

### Accessibility

- Keyboard navigation through wizard
- ARIA labels for progress indicator
- Screen reader announcements for live updates
- Reduced motion support

---

## Risk Mitigation

| Risk                            | Impact | Mitigation                          |
| ------------------------------- | ------ | ----------------------------------- |
| Wizard increases friction       | HIGH   | A/B test: 50% wizard, 50% linear    |
| Live preview hurts performance  | MEDIUM | Debounce + useMemo                  |
| Users skip scenario explorer    | LOW    | Place after results, not before CTA |
| Achievement animations annoying | LOW    | Easy dismiss, show once per session |

---

## A/B Testing Plan

### Test 1: Wizard vs Linear (Week 1-2)

- **Variant A**: Current linear form (50%)
- **Variant B**: New 3-step wizard (50%)
- **Measure**: Completion rate, time on page, CTA clicks

### Test 2: Live Preview Position (Week 3-4)

- **Variant A**: Live preview on right side
- **Variant B**: Live preview below inputs
- **Measure**: Time to complete, scroll depth

---

## Future Enhancements (Post-Launch)

1. **4th Wizard Step**: Platform-specific breakdown
2. **Tool Cost Audit**: "What tools do you pay for?" input
3. **Time Breakdown**: Interactive time allocation slider
4. **Countdown Timer**: "Your estimate expires in 23:45:12"
5. **Leaderboard**: Compare anonymized results

---

## Launch Checklist

**Pre-Launch:**

- [ ] All 5 features implemented and tested
- [ ] Analytics events configured
- [ ] Mobile responsive (tested on 3+ devices)
- [ ] Performance: Lighthouse score >85
- [ ] Accessibility: No critical issues
- [ ] Cross-browser: Chrome, Safari, Firefox, Edge
- [ ] A/B test variants configured
- [ ] Hotjar recordings enabled

**Launch Day:**

- [ ] Deploy to staging
- [ ] QA full flow (3 test users)
- [ ] Deploy to production
- [ ] Monitor analytics for first 2 hours
- [ ] Check error logs

**Post-Launch (Day 2-7):**

- [ ] Daily analytics review
- [ ] User feedback collection
- [ ] Performance monitoring
- [ ] Bug triage and fixes
- [ ] Initial A/B test results

---

**Total Estimated Effort**: 40-60 hours over 2-3 weeks  
**Expected Impact**: 50-100% increase in completion → CTA conversion rate

**Version**: 2.0 (Lean & Focused)  
**Last Updated**: October 11, 2025  
**Status**: ✅ Ready for Taskmaster Parsing
