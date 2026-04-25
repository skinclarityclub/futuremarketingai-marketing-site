# Decision Pending — VoiceDemoSection phone number

**Context**: `fmai-nextjs/src/components/voice/VoiceDemoSection.tsx:67,93` displays a US phone number `+1 (570) 783-8236` on a Dutch marketing site (`/skills/voice-agent`).

**Surfaced by**:
- audit `docs/audits/2026-04-24-full-audit/06-data-accuracy.md` §Executive Summary — flagged as data-accuracy issue MEDIUM
- Phase 12 RESEARCH §10 — phone-number locale mismatch
- Plan 12-03 task 5 (this plan flagged it; explicitly does NOT auto-fix)

**Decision required from**: Daley.

## Options

| # | Option | Effort | Recurring cost | Trade-off |
|---|---|---|---|---|
| 1 | Swap to NL number — rent a Dutch DID via Vapi, update number in `VoiceDemoSection.tsx:67,93` and in Vapi assistant config | ~1 uur (Vapi CLI + code edit + test call) | EUR 5/mo for the DID | Most authentic to Dutch market; commits to recurring infra cost |
| 2 | Hide number, show CTA only — remove the phone display, render only the "Bel demo" button linked to Vapi web call (client-side SDK) | ~30 min | None | Voice demo still works via web SDK; sidesteps DID rental |
| 3 | Keep US number, acknowledge mismatch | 0 min | None | Defers decision to after Vapi infrastructure migration; leaves audit finding open |

**Default if not answered within 2 weeks**: option 2 (hide), since it is lowest-risk + cost-free and the voice demo still works via web SDK without ever dialing a phone number.

## Execution path after decision

After the decision is made in a later sprint, execute the chosen option as an isolated 1-task plan (outside Phase 12 scope). Phase 12 closes with the phone number unchanged but the option set documented here.

## Phase 12 status

- 12-03-PLAN.md task 5 = this note. **Marked done** in plan execution because the deliverable is this decision artifact, not a code change.
- VoiceDemoSection.tsx is unchanged by 12-03.
- Audit 06 will continue to flag this until one of the three options ships.
