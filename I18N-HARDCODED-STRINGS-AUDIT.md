# i18n Hardcoded Strings Audit

## Status: IN PROGRESS

Dit document bevat alle gevonden hardcoded strings die vervangen moeten worden door i18n translation keys.

## Overzicht

- **Totaal gevonden**: 69+ hardcoded strings
- **Gereed**: 2 bestanden
- **In behandeling**: Zie lijst hieronder

## Uitgevoerde fixes:

✅ `src/components/common/StrategicCTA.tsx` - aria-label="Sluit" → t('common:actions.close')
✅ `src/components/ai-assistant/messages/CalendlyBooking.tsx` - Defaults gewijzigd + useTranslation toegevoegd

## Prioriteit 1: Kritieke UI Elementen (Direct zichtbaar voor gebruikers)

### ChatInput.tsx

- [ ] `aria-label="Chat bericht invoeren"` → `t('ai-assistant:input.placeholder')`
- [ ] `aria-label="Verstuur bericht"` → `t('common:actions.submit')`

### ChatHeader.tsx

- [ ] `aria-label="Personalisatie instellingen"` → `t('common:accessibility.personalization_settings')`
- [ ] `title="Instellingen"` → `t('common:navigation.settings')`
- [ ] `title="Bekijk je achievements"` → `t('common:navigation.view_achievements')`
- [ ] `aria-label="Sluit chat"` → `t('common:actions.close_chat')`

### FloatingActionButton.tsx

- [ ] `aria-label="Nieuwe berichten"` → `t('ai-assistant:notifications.new_messages')`

### HolographicInfoPanel.tsx

- [ ] `aria-label="Previous module"` + `title="Vorige module"` → `t('navigation:previous')`
- [ ] `aria-label="Next module"` + `title="Volgende module"` → `t('navigation:next')`
- [ ] `aria-label="Close panel"` + `title="Sluiten"` → `t('common:actions.close')`

### InfoPanel.tsx

- [ ] `aria-label="Sluit panel"` → `t('common:actions.close_panel')`

### NudgeToast.tsx

- [ ] `aria-label="Sluit"` → `t('common:actions.close')`

### MessageList.tsx

- [ ] `aria-label="Chat berichten"` → `t('ai-assistant:accessibility.messages_list')`

### NavigationAction.tsx

- [ ] `aria-label="Navigatie suggestie"` → `t('ai-assistant:accessibility.navigation_suggestion')`

## Prioriteit 2: Form Elements

### CampaignLauncher.tsx

- [ ] `placeholder="e.g., Summer Product Launch"` → `t('dashboard:campaign.name_placeholder')`

### MultiAccountManager.tsx

- [ ] `placeholder="Search accounts..."` → `t('dashboard:accounts.search_placeholder')`

## Prioriteit 3: Accessibility Labels (Belangrijk voor screenreaders)

### CalendlyBooking.tsx

- [x] Defaults vervangen (klaar)
- [ ] `aria-label="Demo booking invitation"`
- [ ] `aria-label="Booking actions"`
- [ ] `aria-label="Trust indicators"`

### CalendlyModal.tsx

- [ ] `aria-label="Schedule appointment"`
- [ ] `aria-label="What to expect"`
- [ ] `aria-label="Booking calendar"`
- [ ] `aria-label="Open Calendly in new tab"`
- [ ] `aria-label="Trust indicators"`

### SystemMessage.tsx

- [ ] `aria-label="Mark as helpful"`
- [ ] `aria-label="Mark as not helpful"`

### Carousel.tsx

- [ ] `aria-label="Previous card"`
- [ ] `aria-label="Next card"`

### PersonalizationControlBar.tsx

- [ ] `aria-label="Open user preferences"`

### PersonalizationSettingsPanel.tsx

- [ ] `aria-label="Close settings"`

### TopBarControls.tsx

- [ ] `aria-label="Change language"`

### LanguageSwitcher.tsx

- [ ] `aria-label="Change language"` (2x)

## Prioriteit 4: Buttons & Interactive Elements

### PerformanceTimeline.tsx

- [ ] `title="Export to CSV"`

### BulkActionsBar.tsx

- [ ] `title="Clear selection"`

### CelebrationToast.tsx

- [ ] `aria-label="Dismiss celebration"`

### Toast.tsx

- [ ] `aria-label="Close notification"`

### MetricDetailModal.tsx

- [ ] `aria-label="Close modal"`

### PricingRevealModal.tsx

- [ ] `aria-label="View pricing details"`
- [ ] `aria-label="View complete value breakdown"`
- [ ] `aria-label="View pricing roadmap"`

### PricingAvailabilityBanner.tsx

- [ ] `aria-label="Collapse banner"`

## Prioriteit 5: Alt Tags & Image Descriptions

### EnhancementStep.tsx

- [ ] `alt="Original"`
- [ ] `alt="Enhanced"`

### FinalizeStep.tsx

- [ ] `alt="Ad background"`

### AccountDetailDrawer.tsx

- [ ] `alt="Post thumbnail"`

## Prioriteit 6: Development/Testing Components

### SentryTestButton.tsx

- [ ] `title="Test error tracking"`
- [ ] `title="Test message tracking"`
- [ ] `title="Test warning tracking"`

### ChatDebugPanel.tsx

- [ ] `title="Clear localStorage and reload"`

## Prioriteit 7: Other/Complex Cases

### VisionTimeline Components

- [ ] Various aria-labels in EraCard, InsightBanner, VisionTimeline
- [ ] `aria-label="Currently in early adopter window"`
- [ ] `aria-label="Key insight about early adoption advantage"`
- [ ] `aria-label="Insight icon"`
- [ ] `aria-label="Timeline showing the evolution of marketing automation"`

### TechnicalShowcase.tsx

- [ ] `aria-label="AI Core System"`

### VisionSection.tsx

- [ ] `aria-label="Current stage in marketing evolution"`

### EarlyAdopterBadge.tsx

- [ ] Multiple `aria-label="Active status"` entries
- [ ] `aria-label="Launching soon indicator"`

### SystemDiagram.tsx

- [ ] Lange aria-label voor interactive diagram

### ChatPanel.tsx

- [ ] `aria-label="AI Journey Assistant Chat"`

### Breadcrumbs.tsx

- [ ] `aria-label="Breadcrumb"`

### ComponentShowcase.tsx

- [ ] `title="Example Modal"`

## Benodigde Translation Keys (toevoegen aan JSON files)

### common.json additions needed:

```json
{
  "accessibility": {
    "personalization_settings": "Personalization settings",
    "close_chat": "Close chat",
    "close_panel": "Close panel",
    "messages_list": "Chat messages",
    "navigation_suggestion": "Navigation suggestion",
    "new_messages": "New messages",
    "view_achievements": "View your achievements"
  },
  "navigation": {
    "settings": "Settings",
    "previous": "Previous",
    "next": "Next"
  }
}
```

### ai-assistant.json additions needed:

```json
{
  "input": {
    "placeholder": "Enter chat message",
    "send": "Send message"
  },
  "notifications": {
    "new_messages": "New messages"
  },
  "accessibility": {
    "messages_list": "Chat messages",
    "navigation_suggestion": "Navigation suggestion"
  }
}
```

## Volgende Stappen:

1. ✅ Audit compleet
2. 🔄 Translations keys toevoegen aan EN/NL/ES JSON files
3. 🔄 Component-by-component vervangen (Prioriteit 1 eerst)
4. ⏳ Testen met alle 3 talen
5. ⏳ Edge cases valideren

## Notities:

- Veel Nederlandse hardcoded strings gevonden
- Sommige componenten missen `useTranslation` hook
- aria-labels zijn kritiek voor accessibility - hoge prioriteit
- Default prop values moeten ook i18n worden waar mogelijk
