---
title: Next.js Visual Parity Plan
tags: #plan #nextjs #design
created: 2026-03-18
---

# Next.js Visual Parity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the Next.js site visually identical to the Vite site homepage.

**Architecture:** Port Vite hero (split layout + OrbitVisual + gradient text), header (FMai logo + accent CTA), and CSS (fadeInUp, gradient-flow, blob mesh, orbit animations) to Next.js. Fix ScrollReveal SSR issue.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, motion/react (Framer Motion 12), next-intl

---

## Task 1: Add missing CSS animations + gradients to globals.css

**Files:**

- Modify: `fmai-nextjs/src/app/globals.css`

Add to the `@theme` block and keyframes:

- `bg-gradient-flow` class (linear-gradient 135deg #00D4AA -> #F5A623)
- `fadeInUp` keyframe (opacity 0, translateY 24px -> visible)
- `orbit-pulse`, `orbit-core-breathe`, `orbit-particle-float` keyframes
- `spin` keyframe (0 -> 360deg)
- `.blob`, `.blob-warm`, `.blob-cool`, `.blob-mixed` classes
- `.card-gradient-border` + `.card-tilt` classes
- `blobFloat1`, `blobFloat2`, `blobFloat3` keyframes

**Commit:** `feat: add Vite CSS animations, gradients, and orbit keyframes to globals.css`

---

## Task 2: Create OrbitVisual component

**Files:**

- Create: `fmai-nextjs/src/components/hero/OrbitVisual.tsx`

Port the pure SVG/CSS orbit visual from `src/components/common/OrbitVisual.tsx` (Vite). Mark as `'use client'` since it uses no SSR dependencies but needs CSS animations. Keep exact same ring definitions, dots, arcs, particles, and center logo.

**Commit:** `feat: port OrbitVisual hero illustration from Vite site`

---

## Task 3: Create GradientMesh background component

**Files:**

- Create: `fmai-nextjs/src/components/hero/GradientMesh.tsx`
- Modify: `fmai-nextjs/src/app/[locale]/layout.tsx` (add GradientMesh)

Port GradientMesh from Vite (3 CSS-only blobs with blur). Add to locale layout above Header.

**Commit:** `feat: add GradientMesh animated background`

---

## Task 4: Rewrite Hero section (split layout + gradient text)

**Files:**

- Modify: `fmai-nextjs/src/app/[locale]/page.tsx` (hero section)
- Modify: `fmai-nextjs/messages/en.json` (add badge, trust_anchor, split headline)

Replace centered hero with Vite's left-aligned split layout:

- Eyebrow badge: "AI Implementation Partner" with accent line
- Headline split: "AI Systems That Run" (white) + "Your Business." (gradient + underline)
- Description paragraph
- Trust anchor: "Businesses working with AI partners are 2.5x more likely to succeed"
- CTA buttons with Zap icon + arrow
- OrbitVisual positioned absolute right

**Commit:** `feat: port Vite hero layout with gradient text and OrbitVisual`

---

## Task 5: Update Header (FMai logo + accent CTA)

**Files:**

- Modify: `fmai-nextjs/src/components/layout/HeaderClient.tsx`

Changes:

- Logo: "FM" white + "ai" gradient (from-accent-human to-accent-system)
- Nav items: Services (dropdown), Pricing, Demo (instead of full list)
- Right side: Login text button + "See Our Work" accent CTAButton
- Add auto-hide on scroll down behavior

**Commit:** `feat: update header to match Vite FMai branding and nav`

---

## Task 6: Upgrade Service Cards (numbered + gradient border)

**Files:**

- Modify: `fmai-nextjs/src/app/[locale]/page.tsx` (services section)
- Modify: `fmai-nextjs/messages/en.json` (service card titles)

Replace simple GlassCards with Vite's numbered service cards:

- Number labels (01, 02, 03, 04)
- Gradient border hover (card-gradient-border class)
- Arrow circle bottom-right
- Tilt hover effect
- Updated titles: "AI Automations", "FutureChatAI", "FutureVoiceAI", "FutureMarketingAI"
- Section title: "AI Platforms Built for Growth"

**Commit:** `feat: upgrade service cards with numbered layout and gradient borders`

---

## Task 7: Fix ScrollReveal SSR hydration

**Files:**

- Modify: `fmai-nextjs/src/components/motion/ScrollReveal.tsx`

The `whileInView` with `initial={{ opacity: 0 }}` causes invisible content when SSR renders `opacity: 0` but client-side animation doesn't trigger for above-fold elements. Fix by using `animate` instead of `whileInView` for elements already in viewport on mount, or set initial to visible for SSR and let client override.

**Commit:** `fix: ScrollReveal SSR hydration - content visible before JS loads`

---

## Task 8: Update Footer (4 columns + correct links)

**Files:**

- Modify: `fmai-nextjs/src/components/layout/Footer.tsx`

Match Vite footer:

- 4 columns: Product (Features, Pricing, Demo), Company (About, How It Works), Resources (ROI Calculator, Showcase), Legal (Privacy, Terms)
- "Q1 2026 · 2/5 Slots Left" availability badge instead of "All systems operational"

**Commit:** `feat: update footer to match Vite 4-column layout`

---

## Task 9: Update translations for NL/ES

**Files:**

- Modify: `fmai-nextjs/messages/nl.json`
- Modify: `fmai-nextjs/messages/es.json`

Copy new keys (badge, trust_anchor, split headlines, service names) to NL/ES with translated values.

**Commit:** `feat: add NL/ES translations for updated hero and services`

---

## Task 10: Run Playwright tests + screenshot comparison

Run full test suite to verify nothing broke. Take new screenshots for visual comparison.

**Commit:** `test: verify visual parity with Playwright tests`
