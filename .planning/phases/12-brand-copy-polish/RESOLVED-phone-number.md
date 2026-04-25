# RESOLVED — VoiceDemoSection phone number

**Resolved**: 2026-04-25 by Daley ("US phone wordt een NL phone (later)").

## Outcome

Hybrid of options 1 + 2: phone-display blocks gated behind a single `PHONE_NUMBER`
constant in `fmai-nextjs/src/components/voice/VoiceDemoSection.tsx`, currently `null`.

While `PHONE_NUMBER === null`:
- The "Or call directly" card is hidden on the live-demo section
- The fallback box (when ElevenLabs SDK is unavailable) shows `mailto:hello@future-marketing.ai` instead of a phone number
- The web-SDK voice demo (PhoneMockup + VoiceDemoPhone) keeps working — that is the primary CTA

## Activation when NL DID is ready

1. Procure a Dutch DID via Vapi (~EUR 5/mo)
2. Open `fmai-nextjs/src/components/voice/VoiceDemoSection.tsx`
3. Replace `const PHONE_NUMBER: string | null = null` with E.164 string, e.g.:
   ```ts
   const PHONE_NUMBER: string | null = '+31201234567'
   ```
4. `formatPhoneDisplay()` auto-formats `+31201234567` → `+31 (0)2 0123 4567` for display.
   Adjust the formatter if the chosen number does not split that way (e.g. mobile `+316...`).
5. Wire the same number into the Vapi assistant config so calls route correctly.
6. Commit: `feat(voice): activate NL DID +31...`

## Original options recap (for context)

See git history `commit DECISION-PENDING-phone-number.md` (plan 12-03).
