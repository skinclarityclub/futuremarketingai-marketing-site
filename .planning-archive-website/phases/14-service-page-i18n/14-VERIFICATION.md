---
phase: 14-service-page-i18n
verified: 2026-03-13T16:00:00Z
status: passed
score: 7/7 must-haves verified
re_verification: false
---

# Phase 14: Service Page i18n Verification Report

**Phase Goal:** Make all service pages multilingual (EN/NL/ES) so the language switcher works consistently across the entire site. Currently these 3 pages have all text hardcoded in English.
**Verified:** 2026-03-13T16:00:00Z
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                    | Status   | Evidence                                                                                                                                              |
| --- | ------------------------------------------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | AutomationsPage displays correct content in English when EN selected     | VERIFIED | `public/locales/en/automations.json` has 93 keys, all wired via `useTranslation(['automations', 'common'])` at line 62 of AutomationsPage.tsx         |
| 2   | AutomationsPage displays Dutch content when NL selected                  | VERIFIED | `public/locales/nl/automations.json` has identical key structure, verified Dutch content (e.g. "Automatiseer Je Bedrijf Met AI")                      |
| 3   | AutomationsPage displays Spanish content when ES selected                | VERIFIED | `public/locales/es/automations.json` has identical key structure, verified Spanish content (e.g. "Automatiza Tu Negocio Con IA")                      |
| 4   | ChatbotsPage displays correct content in all 3 languages                 | VERIFIED | EN/NL/ES chatbots.json files exist with identical key structure; ChatbotsPage.tsx uses `useTranslation(['chatbots', 'common'])` at line 42            |
| 5   | VoiceAgentsPage displays correct content in all 3 languages              | VERIFIED | EN/NL/ES voice-agents.json files exist with identical key structure; VoiceAgentsPage.tsx uses `useTranslation(['voice-agents', 'common'])` at line 34 |
| 6   | All hardcoded English strings replaced with t() calls across all 3 pages | VERIFIED | grep for hardcoded text in JSX returns zero matches (excluding SEOHead props which stay EN per project decision)                                      |
| 7   | Partnership note section in VoiceAgentsPage is translated                | VERIFIED | NL: "Gebouwd Met Gespecialiseerde Partners", ES: "Construido Con Socios Especializados" present in locale files                                       |

**Score:** 7/7 truths verified

### Required Artifacts

| Artifact                              | Expected                              | Status   | Details                                                                    |
| ------------------------------------- | ------------------------------------- | -------- | -------------------------------------------------------------------------- |
| `public/locales/en/automations.json`  | EN translations for AutomationsPage   | VERIFIED | 93 keys, valid JSON, contains "hero" section                               |
| `public/locales/nl/automations.json`  | NL translations for AutomationsPage   | VERIFIED | Identical key structure, actual Dutch translations                         |
| `public/locales/es/automations.json`  | ES translations for AutomationsPage   | VERIFIED | Identical key structure, actual Spanish translations                       |
| `public/locales/en/chatbots.json`     | EN translations for ChatbotsPage      | VERIFIED | Valid JSON, contains "hero" section                                        |
| `public/locales/nl/chatbots.json`     | NL translations for ChatbotsPage      | VERIFIED | Identical key structure, Dutch translations confirmed                      |
| `public/locales/es/chatbots.json`     | ES translations for ChatbotsPage      | VERIFIED | Identical key structure, Spanish translations confirmed                    |
| `public/locales/en/voice-agents.json` | EN translations for VoiceAgentsPage   | VERIFIED | Valid JSON, contains "hero" and "partnership" sections                     |
| `public/locales/nl/voice-agents.json` | NL translations for VoiceAgentsPage   | VERIFIED | Identical key structure, Dutch translations confirmed                      |
| `public/locales/es/voice-agents.json` | ES translations for VoiceAgentsPage   | VERIFIED | Identical key structure, Spanish translations confirmed                    |
| `src/pages/AutomationsPage.tsx`       | Internationalized with useTranslation | VERIFIED | imports useTranslation, calls `useTranslation(['automations', 'common'])`  |
| `src/pages/ChatbotsPage.tsx`          | Internationalized with useTranslation | VERIFIED | imports useTranslation, calls `useTranslation(['chatbots', 'common'])`     |
| `src/pages/VoiceAgentsPage.tsx`       | Internationalized with useTranslation | VERIFIED | imports useTranslation, calls `useTranslation(['voice-agents', 'common'])` |

### Key Link Verification

| From                | To                   | Via                                          | Status | Details                                                                                                     |
| ------------------- | -------------------- | -------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| AutomationsPage.tsx | en/automations.json  | `useTranslation(['automations', 'common'])`  | WIRED  | Pattern found at line 62, i18next-http-backend loads namespace on demand via `/locales/{{lng}}/{{ns}}.json` |
| ChatbotsPage.tsx    | en/chatbots.json     | `useTranslation(['chatbots', 'common'])`     | WIRED  | Pattern found at line 42, same backend loading pattern                                                      |
| VoiceAgentsPage.tsx | en/voice-agents.json | `useTranslation(['voice-agents', 'common'])` | WIRED  | Pattern found at line 34, same backend loading pattern                                                      |

**Note:** The `ns` array in `src/i18n/config.ts` does not list `automations`, `chatbots`, or `voice-agents`, but this is consistent with existing patterns. Other page namespaces (about, marketing-machine, pricing) are also absent from the `ns` array. The `i18next-http-backend` loads namespaces lazily when `useTranslation()` requests them. The `ns` array only controls preloading.

### Requirements Coverage

| Requirement      | Source Plan         | Description                                                                                                                                                                  | Status    | Evidence                                                                                  |
| ---------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------- |
| REQ-SERVICE-I18N | 14-01, 14-02, 14-03 | Wire useTranslation into AutomationsPage, ChatbotsPage, VoiceAgentsPage; extract hardcoded EN strings; add NL/ES translations; language switcher works on all service routes | SATISFIED | All 3 pages refactored, 9 locale files created, no hardcoded strings remain, build passes |

**Orphaned requirements:** None. REQUIREMENTS.md maps only REQ-SERVICE-I18N to Phase 14, and all plans claim it.

### Anti-Patterns Found

| File                | Line | Pattern                                         | Severity | Impact                                                                   |
| ------------------- | ---- | ----------------------------------------------- | -------- | ------------------------------------------------------------------------ |
| AutomationsPage.tsx | 395  | `TODO: Replace with real demo video/screenshot` | Info     | Pre-existing comment about ProductMedia placeholder, not related to i18n |
| ChatbotsPage.tsx    | 343  | `TODO: Replace with real demo video/screenshot` | Info     | Pre-existing comment, not related to i18n                                |
| VoiceAgentsPage.tsx | 313  | `TODO: Replace with real demo video/screenshot` | Info     | Pre-existing comment, not related to i18n                                |

No blocker or warning anti-patterns found. The TODO comments are pre-existing media placeholders unrelated to i18n work.

### Human Verification Required

### 1. Language Switcher on Automations Page

**Test:** Navigate to /automations, switch language to NL, then ES, then back to EN
**Expected:** All visible text changes to correct language. No English text visible in NL/ES modes (except SEO meta). Layout does not break with longer NL/ES strings.
**Why human:** Runtime language switching behavior and visual layout stability cannot be verified programmatically.

### 2. Language Switcher on Chatbots Page

**Test:** Navigate to /chatbots, switch language to NL, then ES, then back to EN
**Expected:** All visible text changes to correct language including pricing tiers, FAQs, trust metrics. Accordion FAQ still functions.
**Why human:** Interactive FAQ accordion behavior with translated content needs visual confirmation.

### 3. Language Switcher on Voice Agents Page

**Test:** Navigate to /voice-agents, switch language to NL, then ES
**Expected:** All text including partnership note section switches language. Pricing cards render correctly.
**Why human:** Partnership note section is unique to this page and layout behavior with translations needs visual check.

### 4. Translation Quality (Dutch)

**Test:** Read through NL versions of all 3 service pages
**Expected:** Professional, natural Dutch -- not machine-translated or overly formal. User is Dutch-speaking and quality matters.
**Why human:** Translation quality and natural language feel requires native speaker judgment.

### Gaps Summary

No gaps found. All automated checks pass:

- All 9 locale JSON files exist with valid JSON and identical key structures across languages
- All 3 page components import and use `useTranslation` with correct namespace references
- No hardcoded English strings remain in JSX (SEOHead excepted per project decision)
- Translations are real (verified Dutch and Spanish content, not English copies)
- Build succeeds with zero errors
- All 6 commits verified in git history
- Pattern is consistent with existing i18n pages (AboutPage, PricingPage use same approach)

---

_Verified: 2026-03-13T16:00:00Z_
_Verifier: Claude (gsd-verifier)_
