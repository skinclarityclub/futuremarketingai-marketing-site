---
phase: 05-go-to-market
plan: 02
subsystem: gtm
tags: [icp, outreach, linkedin, founding-member, agreement, prospecting]

# Dependency graph
requires:
  - phase: 05-go-to-market/05-01
    provides: LinkedIn profile assets and demo video script for outreach reference
provides:
  - ICP qualification checklist with 6 scored criteria
  - Target agency CSV tracking template with stage progression
  - 5-touch LinkedIn outreach sequence templates in Dutch and English
  - Objection handling guide with 5 common objections
  - Founding member agreement template in Dutch
affects: [05-go-to-market/05-03]

# Tech tracking
tech-stack:
  added: []
  patterns: [obsidian-frontmatter-docs, bilingual-templates]

key-files:
  created:
    - docs/gtm/icp-checklist.md
    - docs/gtm/target-agencies.csv
    - docs/gtm/outreach-templates.md
    - docs/gtm/founding-member-agreement.md
  modified: []

key-decisions:
  - 'ICP scoring uses 6 criteria (0-2 each, max 12) with 8+ hot, 5-7 warm, below 5 skip thresholds'
  - 'Outreach sequence follows 5-touch cadence over 21 days with 3-Touch Rule before pitching'
  - 'Founding member agreement drafted in Dutch (primary legal jurisdiction) with EUR 997/mo and 6-month minimum'
  - 'CSV tracking template uses 11-stage pipeline from prospect to signed/lost'

patterns-established:
  - 'Bilingual templates: Dutch primary with English translation for all GTM docs'
  - 'ICP scoring: quantitative 0-2 scale with anti-ICP auto-disqualify signals'

requirements-completed: [GTM-03, GTM-04, GTM-05]

# Metrics
duration: 5min
completed: 2026-03-20
---

# Phase 5 Plan 2: Prospecting Tools Summary

**ICP qualification checklist, target agency CSV tracker, 5-touch LinkedIn outreach sequence (NL+EN), objection handling guide, and founding member agreement template in Dutch**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-20T19:24:33Z
- **Completed:** 2026-03-20T19:26:08Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files created:** 4

## Accomplishments

- ICP qualification checklist with 6 scored criteria, qualification thresholds, and anti-ICP disqualifiers ready for agency evaluation
- Target agency CSV template with 18 tracking columns, 11-stage pipeline, and 3 fictional example rows ready for Sales Navigator results
- Complete 5-touch LinkedIn outreach sequence in Dutch and English with timing guidance and objection handling for 5 common objections
- Professional founding member agreement in Dutch covering services (6 skills), pricing (EUR 997/mo locked), 6-month commitment, data ownership, and liability limits

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ICP checklist, target tracking CSV, and outreach templates** - `57c55e8` (feat)
2. **Task 2: Create founding member agreement template** - `d2f6fcc` (feat)
3. **Task 3: Review prospecting tools and agreement** - checkpoint:human-verify (approved)

## Files Created/Modified

- `docs/gtm/icp-checklist.md` - ICP qualification criteria with 6 scored dimensions and anti-ICP signals
- `docs/gtm/target-agencies.csv` - Target agency tracking spreadsheet with 18 columns and 3 example rows
- `docs/gtm/outreach-templates.md` - 5-touch LinkedIn outreach sequence (NL+EN) with objection handling
- `docs/gtm/founding-member-agreement.md` - Founding member agreement template in Dutch with all commercial terms

## Decisions Made

- ICP scoring uses 6 criteria (team size, focus, LinkedIn activity, multi-client, digital maturity, geography) each scored 0-2 for max 12 points
- Outreach follows 3-Touch Rule: comment, reply, connect before any pitch
- Founding member agreement drafted in Dutch as primary legal jurisdiction with legal review disclaimer
- CSV uses 11-stage pipeline (prospect through signed/lost) for granular tracking

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All prospecting tools ready for 05-03 (demo call script + launch checklist + GTM execution kickoff)
- ICP checklist ready for evaluating agencies from Sales Navigator
- Outreach templates ready for LinkedIn messaging campaigns
- Founding member agreement ready for legal review before prospect delivery

## Self-Check: PASSED

All 4 created files verified on disk. Both task commits (57c55e8, d2f6fcc) verified in git history.

---

_Phase: 05-go-to-market_
_Completed: 2026-03-20_
