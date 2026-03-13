---
title: Phase 12 Design Polish & Media — Research Notes
tags: #research #design #phase-12
created: 2026-03-13
source: Phase 11 verification session research
---

# Design Polish & Media — Research Notes

Research gathered during Phase 11 execution, to inform Phase 12 planning.

## 1. Hero Visual Upgrade Options

### Option A: Spline 3D Embed (most spectacular)

- Free tool, drag-and-drop 3D scene builder
- React component: `@splinetool/react-spline`
- Cursor-responsive rotation, glow effects
- File size: ~200-500KB, lazy-loadable via React Suspense
- **Pro:** Wow-factor, interactive, mouse-responsive
- **Con:** Initial load time, need to design Spline scene
- Production-ready: Yes, used by Vercel and others
- Docs: https://github.com/splinetool/react-spline

### Option B: Rive Interactive Animation (best balance)

- State machine-driven: responds to hover/scroll
- Extremely small files (~30-80KB .riv)
- React runtime: `@rive-app/react-canvas`
- **Pro:** Fastest, interactive, lightweight
- **Con:** Must build animation in Rive editor
- Hero animation tutorials: https://rive.app/use-cases/hero-animations
- React guide: https://help.rive.app/runtimes/overview/react

### Option C: Enhanced CSS/SVG (already implemented in Phase 11)

- Current orbit has 5 rings, 7 glow dots, arc trails, 12 particles, breathing core
- Pure CSS/SVG, zero dependencies
- Could be further enhanced with more layers

### Recommendation

Spline for the hero visual (highest wow-factor for B2B prospects). Rive for micro-interactions throughout the site (lightweight, state-driven).

## 2. Media Strategy for B2B AI SaaS

### What converts best (from research)

- 61% of B2B businesses increasing video investment in 2025
- Interactive content shows 340% higher engagement
- Short-form video is #1 content format for B2B brands

### What to use

1. **Product demo video** (30-60s) — homepage or How It Works page. Show the Marketing Machine in action.
2. **No stock photos** — screams "template". Instead use:
   - Product UI screenshots (from the FMai app at app.future-marketing.ai)
   - Abstract generative visuals (AI-themed, on-brand)
   - Short screen recordings of n8n workflows / dashboards
3. **Service pages** — each gets a short animated GIF or video of that specific product (chatbot in action, voice agent demo, automation workflow)

### What top sites do

| Site          | Hero visual                                  | Technology                |
| ------------- | -------------------------------------------- | ------------------------- |
| Linear        | Subtle gradient mesh + product UI showcase   | CSS + custom shaders      |
| Vercel        | Animated globe / grid                        | React Three Fiber (WebGL) |
| Stripe        | Animated gradient mesh + product screenshots | CSS animations            |
| Jasper/Writer | Product demo video + abstract AI visuals     | Video embeds + Lottie     |

## 3. Micro-Interactions to Add

- Scroll-triggered section reveals (fade + slide)
- Card hover state enhancements (subtle tilt/parallax)
- Button hover micro-animations (icon shifts, glow pulses)
- Navigation transitions between pages
- Loading states with branded animations

## 4. Typography & Spacing Polish

- Fine-tune heading sizes across breakpoints
- Consistent section spacing rhythm
- Letter-spacing adjustments for display font

## 5. Technical Notes

- Spline: lazy-load with React.lazy + Suspense, provide CSS fallback during load
- Video: self-hosted MP4 with poster frame, or embedded from platform
- All animations must respect `prefers-reduced-motion`
- Performance budget: hero LCP < 2.5s with any new visual
