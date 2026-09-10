/**
 * Grondslag en doelbinding van de gegevens die de formulieren opleveren.
 *
 * WHY: de aanvraagpagina doet de bezoeker een harde belofte
 * (`apply.form.privacyNote`): "alleen voor de beoordeling, geen
 * marketing-automatisering, geen mailinglijst, geen doorverkoop". Zodra die
 * inzending als lead de app in gaat raakt de belofte los van de tekst die hem
 * gaf. Daarom reist hij mee: elke lead draagt zijn eigen grondslag, doel en
 * de letterlijke belofte in de taal waarin de bezoeker hem las.
 *
 * Dit is bewust GEEN toestemmingsvraag en GEEN cookiebanner-gate. De banner
 * gaat over tracking; wie zijn naam en e-mailadres zelf in een formulier typt
 * en op verzenden drukt, verricht de handeling die de grondslag draagt. Een
 * marketing-cookie-gate zou juist de bezoeker tegenhouden die contact WIL.
 */

/**
 * Versie van het privacybeleid waar de bezoeker op dat moment onder viel.
 * Bron van waarheid is `legal.last_updated` in `messages/{nl,en,es}.json`
 * ("Laatst bijgewerkt: 24 april 2026"). Werk beide bij als het beleid wijzigt.
 */
export const PRIVACY_POLICY_VERSION = '2026-04-24'

export type ConsentPurpose = 'assessment_only' | 'reply_to_enquiry'

export interface LeadConsent {
  /** Wat de grondslag draagt. Voor beide formulieren: de inzending zelf. */
  basis: 'form_submission'
  /** Waar de gegevens voor gebruikt mogen worden, en nergens anders voor. */
  purpose: ConsentPurpose
  /** De letterlijke belofte die op het scherm stond, of null als er geen stond. */
  notice: string | null
  policy_version: string
  captured_at: string
}

export function buildLeadConsent(
  purpose: ConsentPurpose,
  notice: string | null,
): LeadConsent {
  return {
    basis: 'form_submission',
    purpose,
    notice,
    policy_version: PRIVACY_POLICY_VERSION,
    captured_at: new Date().toISOString(),
  }
}
