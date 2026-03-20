---
phase: 05-go-to-market
plan: 01
subsystem: gtm
tags: [linkedin, demo-video, content-calendar, marketing, outreach]

requires:
  - phase: 01-website-rebrand
    provides: AaaS positioning language, skill names, pricing tiers, founding member page
provides:
  - LinkedIn profile copy (headline, about, featured, experience) in Dutch and English
  - LinkedIn banner image creative brief
  - Demo video script with timed sections (2:30-3:00)
  - 2-week LinkedIn content calendar with 7 posts
affects: [05-02, 05-03]

tech-stack:
  added: []
  patterns:
    - Obsidian frontmatter on all GTM docs (title, tags, created, source)

key-files:
  created:
    - docs/gtm/linkedin-profile-copy.md
    - docs/gtm/linkedin-banner-brief.md
    - docs/gtm/demo-video-script.md
    - docs/gtm/linkedin-content-calendar.md
  modified: []

key-decisions:
  - "Dutch headline leads with 'Ik help marketingbureaus opschalen zonder personeel' -- problem-first positioning"
  - 'Demo video targets 2:30-3:00 with Loom recording -- authenticity over polish'
  - 'Content calendar uses 3-5 posts/week cadence with NL/EN language mix'
  - 'Banner brief uses dark theme (#050814) with cyan accent (#00D4FF) matching website'

patterns-established:
  - 'GTM docs in docs/gtm/ directory with Obsidian frontmatter'
  - 'Bilingual (Dutch + English) variants for all public-facing copy'

requirements-completed: [GTM-01, GTM-02]

duration: 3min
completed: 2026-03-20
---

# Phase 5 Plan 1: GTM Assets Summary

**LinkedIn profile copy with Dutch+English variants, demo video script (2:30-3:00), banner brief, and 2-week content calendar for founding member launch**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-20T19:23:26Z
- **Completed:** 2026-03-20T19:25:37Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Complete LinkedIn profile copy with headline, about section (problem/solution/proof/CTA structure), featured items, and experience -- both Dutch and English
- Banner image creative brief with exact dimensions (1584x396), brand colors, and visual direction for Canva creation
- Demo video script with 5 timed sections (hook, problem, solution walkthrough, results, CTA) totaling under 3 minutes
- 2-week content calendar with 7 posts covering pre-launch authority building and launch week founding member push

## Task Commits

Each task was committed atomically:

1. **Task 1: Create LinkedIn profile copy and banner brief** - `25f1f8f` (feat)
2. **Task 2: Create demo video script and content calendar** - `55b69bc` (feat)
3. **Task 3: Review GTM asset quality** - checkpoint:human-verify (approved)

## Files Created/Modified

- `docs/gtm/linkedin-profile-copy.md` - Full LinkedIn profile copy (headline, about, featured, experience) in Dutch and English
- `docs/gtm/linkedin-banner-brief.md` - Banner image creative brief for Canva (1584x396, dark theme, cyan accent)
- `docs/gtm/demo-video-script.md` - Demo video script with timing, voiceover text, and screen capture directions
- `docs/gtm/linkedin-content-calendar.md` - 2-week launch content plan with 7 posts (format, language, CTA per post)

## Decisions Made

- Dutch headline leads with problem-first positioning: "Ik help marketingbureaus opschalen zonder personeel"
- Demo video uses Loom for recording -- authenticity over production polish, matching Dutch cultural directness
- Content calendar splits into pre-outreach authority building (week 1) and founding member launch push (week 2)
- Banner brief matches website dark theme for brand consistency

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None -- no external service configuration required.

## Next Phase Readiness

- LinkedIn profile copy is ready to paste into LinkedIn settings
- Banner brief is ready for Canva design creation
- Demo video script is ready for Loom recording
- Content calendar is ready for scheduling
- Plan 05-02 (ICP checklist, outreach templates) can proceed independently

## Self-Check: PASSED

All 4 created files verified on disk. Both task commits (25f1f8f, 55b69bc) verified in git history.

---

_Phase: 05-go-to-market_
_Completed: 2026-03-20_
