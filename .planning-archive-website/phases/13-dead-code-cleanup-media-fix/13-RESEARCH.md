# Phase 13: Dead Code Cleanup & Media Fix - Research

**Researched:** 2026-03-13
**Domain:** Dead code removal, placeholder media assets, React/Vite project hygiene
**Confidence:** HIGH

## Summary

Phase 13 is a focused cleanup phase that addresses two gaps identified in the v1.0 milestone audit: (1) orphaned Phase 3 shared components that were superseded by the Phase 11 Living System rebuild, and (2) missing `public/media/` placeholder assets causing ProductMedia 404s on all four service pages.

The orphaned components are: SystemPanel, StatusIndicator, MetricDisplay, and SectionContainer. None are imported by any page or active component -- they exist only in their own files and the barrel export `index.ts`. The useTilt hook created in Phase 12-01 was immediately superseded by the CSS `card-tilt` class in Phase 12-02 and has zero imports anywhere in the codebase.

The media fix requires creating `public/media/` with 8 lightweight placeholder files (4 `.mp4` video placeholders + 4 `.webp` poster images) referenced by ProductMedia instances on AutomationsPage, ChatbotsPage, VoiceAgentsPage, and MarketingMachinePage.

**Primary recommendation:** Remove the 4 orphaned component files + useTilt hook, clean their barrel exports, and create minimal placeholder media assets so ProductMedia renders without 404s.

<phase_requirements>

## Phase Requirements

| ID                | Description                                                | Research Support                                                                                                                                                                   |
| ----------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-COMPONENTS    | Remove orphaned Phase 3 shared components (keep CTAButton) | SystemPanel, StatusIndicator, MetricDisplay, SectionContainer have zero imports outside their own files and index.ts. Safe to delete. CTAButton is actively used across all pages. |
| REQ-PRODUCT-MEDIA | Fix ProductMedia 404s by providing placeholder assets      | 4 service pages reference 8 files in `/media/` that do not exist. `public/media/` directory must be created with lightweight placeholders.                                         |

</phase_requirements>

## Standard Stack

No new libraries needed. This phase is pure deletion and asset creation.

### Core (already installed)

| Library          | Purpose    | Relevance                                               |
| ---------------- | ---------- | ------------------------------------------------------- |
| React 18         | Framework  | Components being deleted are React components           |
| Vite 6           | Build tool | Serves `public/` directory as static assets             |
| Framer Motion 11 | Animations | ProductMedia uses `useReducedMotion` from framer-motion |

### Tools for Placeholder Media

| Tool                          | Purpose                      | Notes                                        |
| ----------------------------- | ---------------------------- | -------------------------------------------- |
| FFmpeg (optional)             | Generate minimal .mp4 files  | 1-second black/colored video, ~5KB           |
| Canvas/ImageMagick (optional) | Generate .webp poster images | Simple branded placeholder, ~2KB             |
| Manual creation               | Minimal valid files          | Can create from base64-encoded minimal media |

**No npm install needed.**

## Architecture Patterns

### Current Structure (what exists)

```
src/components/common/
  SystemPanel.tsx      # ORPHANED - 0 imports outside own file + index.ts
  StatusIndicator.tsx  # ORPHANED - 0 imports (command-center has its own local copy)
  MetricDisplay.tsx    # ORPHANED - 0 imports outside own file + index.ts
  SectionContainer.tsx # ORPHANED - 0 imports outside own file + index.ts
  CTAButton.tsx        # ACTIVE - used across all pages (DO NOT DELETE)
  GlassCard.tsx        # LEGACY but still imported by command-center/calculator components
  index.ts             # Barrel export - exports all orphaned components

src/hooks/
  useTilt.ts           # ORPHANED - 0 imports anywhere
  index.ts             # Does NOT export useTilt (already clean)

public/
  # NO media/ directory exists
```

### Target Structure (after cleanup)

```
src/components/common/
  # SystemPanel.tsx      DELETED
  # StatusIndicator.tsx  DELETED
  # MetricDisplay.tsx    DELETED
  # SectionContainer.tsx DELETED
  CTAButton.tsx          # Kept - actively used
  GlassCard.tsx          # Kept - still imported by legacy pages (Dashboard, Calculator, Explorer)
  index.ts               # Updated - removed orphaned exports

src/hooks/
  # useTilt.ts           DELETED
  index.ts               # Already clean (no useTilt export)

public/media/
  placeholder-automations.mp4
  placeholder-automations-poster.webp
  placeholder-chatbots.mp4
  placeholder-chatbots-poster.webp
  placeholder-voice-agents.mp4
  placeholder-voice-agents-poster.webp
  placeholder-marketing-machine.mp4
  placeholder-marketing-machine-poster.webp
```

### Pattern: Safe Deletion Verification

**What:** Before deleting any file, verify zero imports across the entire `src/` tree.
**When to use:** Always, for every file being deleted.
**Method:**

```bash
# For each file, search for imports
grep -r "SystemPanel" src/ --include="*.tsx" --include="*.ts" | grep -v "SystemPanel.tsx" | grep -v "index.ts"
# If no results: safe to delete
```

### Pattern: Minimal Valid Media Placeholders

**What:** Create the smallest valid .mp4 and .webp files that browsers will accept without errors.
**Why:** ProductMedia uses `<video>` with `preload="none"` so the video file is never actually downloaded until user interaction. The poster `.webp` IS loaded immediately via the `poster` attribute and as `<img>` for reduced-motion users.
**Approach:**

- `.webp` posters: Generate simple branded placeholder images (dark background with "Demo Coming Soon" text or just a solid color matching the theme #050814). These ARE visible to users.
- `.mp4` videos: Generate minimal 1-second silent video or even just a valid-but-empty mp4 container. With `preload="none"`, these are never fetched unless the user explicitly plays. The key requirement is that they exist (no 404) and are valid files if fetched.

### Anti-Patterns to Avoid

- **Deleting GlassCard:** GlassCard is still imported by 30+ files in command-center, calculator, and legacy page components. Do NOT delete it in this phase even though it was "replaced" by SystemPanel conceptually. Those legacy routes (/explorer, /dashboard, /calculator) still reference it.
- **Empty placeholder files:** Do not create zero-byte files -- browsers will throw media decode errors. Even minimal placeholders must be valid media formats.
- **Deleting useTilt without checking CSS card-tilt:** The CSS `card-tilt` class in `index.css` is the replacement and must remain. Only the JS hook file is deleted.

## Don't Hand-Roll

| Problem             | Don't Build              | Use Instead                                                                                                  | Why                                                                 |
| ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Minimal valid .mp4  | Write raw bytes manually | FFmpeg `ffmpeg -f lavfi -i color=c=0x050814:s=640x360:d=1 -c:v libx264 -t 1 out.mp4` or pre-made base64 blob | MP4 container format is complex; invalid files cause console errors |
| Minimal valid .webp | Write raw bytes manually | Canvas API, ImageMagick, or pre-encoded base64 minimal webp                                                  | WebP format requires valid RIFF header                              |

**Key insight:** The placeholder files need to be valid media that browsers can parse without errors. The .webp posters are actually visible as fallback content, so they should look intentional (branded placeholder, not corrupt/broken).

## Common Pitfalls

### Pitfall 1: Breaking barrel export ordering

**What goes wrong:** Removing exports from index.ts can accidentally remove adjacent exports or introduce syntax errors.
**Why it happens:** The barrel file has 100+ export lines with no clear sections.
**How to avoid:** Remove one export line at a time, verify TypeScript compiles after each removal.
**Warning signs:** `vite build` fails with "export not found" errors.

### Pitfall 2: GlassCard false positive

**What goes wrong:** GlassCard appears orphaned like the other Phase 3 components but is still actively imported by ~30 legacy files.
**Why it happens:** The legacy command-center/calculator/dashboard pages were never part of the Living System rebuild scope.
**How to avoid:** Only delete the 4 explicitly listed components (SystemPanel, StatusIndicator, MetricDisplay, SectionContainer) and useTilt. Run grep verification before each deletion.

### Pitfall 3: ProductMedia poster visibility

**What goes wrong:** Creating ugly/broken poster images that are visible to users with reduced-motion preferences.
**Why it happens:** Assuming placeholders are never seen. ProductMedia renders poster as `<img>` when `prefers-reduced-motion` is enabled.
**How to avoid:** Make poster .webp images visually acceptable -- dark background (#050814) with subtle branding or "Demo Coming Soon" text.

### Pitfall 4: Video preload behavior

**What goes wrong:** Creating large placeholder videos that slow page load.
**Why it happens:** Not realizing `preload="none"` means the video is never fetched until play.
**How to avoid:** Keep .mp4 files tiny (under 10KB). They exist only to prevent 404s. With `preload="none"` they are never downloaded unless the user explicitly triggers playback.

### Pitfall 5: Forgetting hooks/index.ts check

**What goes wrong:** Deleting useTilt.ts but leaving a broken import in hooks/index.ts.
**Why it happens:** Assuming the barrel was updated.
**How to avoid:** Check hooks/index.ts -- in this case it is already clean (useTilt was never added to hooks barrel), but always verify.
**Current state:** hooks/index.ts does NOT export useTilt. Only need to delete the file itself.

## Code Examples

### Files to delete (verified zero external imports)

**SystemPanel.tsx** - Only referenced in:

- `src/components/common/SystemPanel.tsx` (self)
- `src/components/common/index.ts` (barrel export, line 83)

**StatusIndicator.tsx** - Only referenced in:

- `src/components/common/StatusIndicator.tsx` (self)
- `src/components/common/index.ts` (barrel export, line 84)
- Note: `command-center/system-health/SystemHealthBar.tsx` has its OWN local StatusIndicator (different interface, not imported from common)

**MetricDisplay.tsx** - Only referenced in:

- `src/components/common/MetricDisplay.tsx` (self)
- `src/components/common/index.ts` (barrel export, line 85)

**SectionContainer.tsx** - Only referenced in:

- `src/components/common/SectionContainer.tsx` (self)
- `src/components/common/index.ts` (barrel export, line 87)

**useTilt.ts** - Only referenced in:

- `src/hooks/useTilt.ts` (self)
- NOT in `src/hooks/index.ts` (already excluded from barrel)

### Barrel export lines to remove from index.ts

```typescript
// REMOVE these lines from src/components/common/index.ts:
export { SystemPanel } from './SystemPanel' // line 83
export { StatusIndicator } from './StatusIndicator' // line 84
export { MetricDisplay } from './MetricDisplay' // line 85
export { SectionContainer } from './SectionContainer' // line 87
```

### ProductMedia references (files that will resolve after media fix)

```
AutomationsPage.tsx:
  videoSrc="/media/placeholder-automations.mp4"
  posterSrc="/media/placeholder-automations-poster.webp"

ChatbotsPage.tsx:
  videoSrc="/media/placeholder-chatbots.mp4"
  posterSrc="/media/placeholder-chatbots-poster.webp"

VoiceAgentsPage.tsx:
  videoSrc="/media/placeholder-voice-agents.mp4"
  posterSrc="/media/placeholder-voice-agents-poster.webp"

MarketingMachinePage.tsx:
  videoSrc="/media/placeholder-marketing-machine.mp4"
  posterSrc="/media/placeholder-marketing-machine-poster.webp"
```

### Minimal placeholder generation (FFmpeg approach)

```bash
# Create public/media directory
mkdir -p public/media

# Generate minimal 1-second dark placeholder videos (~5-10KB each)
ffmpeg -f lavfi -i "color=c=0x050814:s=640x360:d=1" -c:v libx264 -pix_fmt yuv420p -t 1 public/media/placeholder-automations.mp4
ffmpeg -f lavfi -i "color=c=0x050814:s=640x360:d=1" -c:v libx264 -pix_fmt yuv420p -t 1 public/media/placeholder-chatbots.mp4
ffmpeg -f lavfi -i "color=c=0x050814:s=640x360:d=1" -c:v libx264 -pix_fmt yuv420p -t 1 public/media/placeholder-voice-agents.mp4
ffmpeg -f lavfi -i "color=c=0x050814:s=640x360:d=1" -c:v libx264 -pix_fmt yuv420p -t 1 public/media/placeholder-marketing-machine.mp4

# Generate minimal dark poster images (~1-2KB each)
# Alternative: use a Node.js canvas script or base64-encoded minimal webp
```

### Alternative: Base64-encoded minimal valid files

If FFmpeg is unavailable, create minimal valid media files programmatically in Node.js using the `canvas` or `sharp` packages for .webp, and a hardcoded minimal valid .mp4 byte sequence.

## State of the Art

| Old Approach              | Current Approach                               | When Changed | Impact                          |
| ------------------------- | ---------------------------------------------- | ------------ | ------------------------------- |
| SystemPanel container     | Inline Tailwind `card-gradient-border` pattern | Phase 11     | SystemPanel is dead code        |
| StatusIndicator component | Inline Tailwind classes per page               | Phase 11     | StatusIndicator is dead code    |
| MetricDisplay component   | Inline font-mono + text styling                | Phase 11     | MetricDisplay is dead code      |
| SectionContainer wrapper  | Inline `max-w-7xl px-12` pattern               | Phase 11     | SectionContainer is dead code   |
| useTilt JS hook           | CSS `card-tilt` class in index.css             | Phase 12-02  | useTilt is dead code            |
| No product media          | ProductMedia component + placeholder refs      | Phase 12-03  | 404s until placeholders created |

## Open Questions

1. **Placeholder poster image design**
   - What we know: Posters are visible to reduced-motion users as `<img>` elements. They need to be valid .webp files.
   - What's unclear: Should they be plain dark rectangles (#050814) or have branded text like "Demo Coming Soon"?
   - Recommendation: Plain dark rectangles matching the background color. They blend in naturally, and real assets will replace them later. Adding text creates a maintenance/i18n burden.

2. **FFmpeg availability on build machine**
   - What we know: FFmpeg is needed for generating valid .mp4 placeholder videos.
   - What's unclear: Whether FFmpeg is installed in the dev environment.
   - Recommendation: Provide both FFmpeg approach and a fallback Node.js script approach using hardcoded minimal valid MP4 bytes. The planner should include both options.

3. **Scope boundary: other potentially orphaned components**
   - What we know: GlassCard is conceptually "replaced" but still imported by ~30 legacy files. Many other common components (ABTestDashboard, PremiumBadge, etc.) may also be unused by active pages.
   - What's unclear: Full orphan analysis of all 70+ common components is out of scope for this phase.
   - Recommendation: Stick to the 4 named components + useTilt. A broader dead code audit could be a future phase.

## Sources

### Primary (HIGH confidence)

- Direct codebase grep analysis of all imports across `src/` directory
- `src/components/common/index.ts` barrel export inspection
- `src/hooks/index.ts` barrel export inspection
- All 4 service page ProductMedia references verified via grep
- `public/` directory listing confirmed no `media/` subdirectory exists

### Secondary (MEDIUM confidence)

- `.planning/STATE.md` decisions confirming Phase 12-02 replaced useTilt with CSS card-tilt
- `.planning/REQUIREMENTS.md` REQ-COMPONENTS status noting orphaned state
- `.planning/ROADMAP.md` Phase 13 description confirming scope

## Metadata

**Confidence breakdown:**

- Dead code identification: HIGH - verified via exhaustive grep across entire src/ tree
- Media fix scope: HIGH - all 8 missing file paths identified from page source code
- Placeholder approach: MEDIUM - valid media format requirements understood, exact generation method depends on available tools
- Scope boundaries: HIGH - GlassCard exclusion and other legacy components clearly delineated

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (stable -- dead code does not change unless new development references these files)
