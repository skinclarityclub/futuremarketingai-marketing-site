/**
 * Forwarder voor FMai Unified Chatbot Inbox.
 *
 * WHY: elke user+assistant turn van de FMai Concierge live doorsturen naar de
 * fma-app ingestion-API zodat de agency owner gesprekken kan monitoren.
 * Fire-and-forget — NOOIT awaiten op het chatbot-critisch pad.
 *
 * De lead-kant onderaan (`sendLeadToInbox`) werkt precies andersom: die is
 * bedoeld om GEAWAIT te worden, want een formulierinzending mag niet stil
 * verdwijnen. Hij gooit net zo min, hij rapporteert met een boolean.
 *
 * DORMANT: als FMA_INBOX_CHANNEL_ID of FMA_INBOX_CHANNEL_SECRET ontbreken → silent no-op.
 * VOLGORDE: user-turn VOOR streamText aanroep; assistant-turn IN onFinish callback
 * zodat user altijd eerder in DB staat dan assistant.
 *
 * NOTE: external_message_id gebruikt crypto.randomUUID() (built-in, zero-dependency).
 * ROADMAP vermeldde ULID maar UUID v4 is functioneel equivalent voor de UNIQUE constraint
 * idempotentie — geen externe dependency nodig.
 */

const DEFAULT_INBOX_URL = 'https://app.future-marketing.ai/api/webhooks/inbox';

export interface InboxTurn {
  /** Canonical account key — 'fmai_website' voor deze repo */
  account_key: string;
  /** Unieke ID voor deze turn (crypto.randomUUID()) — RPC idempotentie-key */
  external_message_id: string;
  /** Sessie-ID van de gebruiker */
  external_session_id: string;
  /** 'user' of 'assistant' */
  role: 'user' | 'assistant';
  /** Berichttekst */
  content: string;
  /** vendor = 'own-bot' voor eigen bots */
  vendor?: string;
}

/**
 * Best-effort POST naar de inbox ingestion-API. Fire-and-forget: callers
 * NOOIT awaiten op het critisch pad. Logt eigen fouten; gooit nooit.
 */
export async function forwardTurnToInbox(turn: InboxTurn): Promise<void> {
  const channelId = process.env.FMA_INBOX_CHANNEL_ID;
  const secret = process.env.FMA_INBOX_CHANNEL_SECRET;
  // Dormant tot geconfigureerd — ontbrekende env = integratie intentioneel uit.
  if (!channelId || !secret) return;

  const url = process.env.FMA_INBOX_URL || DEFAULT_INBOX_URL;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-inbox-secret': secret,
      },
      body: JSON.stringify({
        type: 'turn',
        account_key: turn.account_key,
        vendor: turn.vendor ?? 'own-bot',
        external_session_id: turn.external_session_id,
        external_message_id: turn.external_message_id,
        role: turn.role,
        content: turn.content,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.error(`[fma-inbox-forwarder] turn forward failed: HTTP ${res.status}`);
    }
  } catch (error) {
    console.error('[fma-inbox-forwarder] turn forward error:', error);
  }
}

// ── Lead-kant ────────────────────────────────────────────────────────────────

/** Vendor-woordenschat, bewust NIET de DB-enum van de app. De app vertaalt
 *  `qualified` naar `on_fire` op één plek in `/api/webhooks/inbox`. */
export type LeadQualification = 'qualified' | 'hot' | 'warm' | 'cold';

export interface InboxLead {
  /** Canonical account key — 'fmai_website' voor deze repo */
  account_key: string;
  /**
   * Sessie-ID. Voor een formulier bestaat die niet, dus de route maakt hem
   * SERVER-SIDE: `apply:<uuid>` / `contact:<uuid>`. Nooit uit de request body,
   * want dit is tegelijk de idempotentiesleutel van de lead-upsert.
   */
  external_session_id: string;
  /** Welk oppervlak de lead opleverde. Landt in `qualification_data.origin`. */
  origin: 'chat' | 'apply' | 'contact';
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  /** 0..100, al genormaliseerd. De app weigert alles daarbuiten met een 400. */
  score?: number;
  qualification?: LeadQualification;
  /** Vrije velden; landen in `qualification_data`. Caller-controlled, dus de
   *  app zet `vendor` en `origin` er ACHTER. */
  metadata?: Record<string, unknown>;
  vendor?: string;
}

/**
 * Zet een ruwe score om naar 0..100. `max` komt uit `scoreApplication()`
 * (17 zonder assessment-handoff, 12 met), dus de constante hoeft hier niet
 * gekopieerd te worden.
 */
export function normalizeLeadScore(total: number, max: number): number {
  if (!Number.isFinite(total) || !Number.isFinite(max) || max <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((total / max) * 100)));
}

/**
 * Label uit de GENORMALISEERDE score, dezelfde banden die `qualify_lead` in de
 * chat gebruikt. Bewust niet uit `branch`: `scoreApplication` zet `qualified`
 * al vanaf 7 van 17 (~41 genormaliseerd), dus dat als `on_fire` doorgeven zou
 * een lauwe lead als de heetste van de lijst tonen.
 */
export function qualificationFromScore(score: number): LeadQualification {
  return score >= 86 ? 'qualified' : score >= 61 ? 'hot' : score >= 31 ? 'warm' : 'cold';
}

/**
 * Schrijf een lead naar de inbox-API. Anders dan `forwardTurnToInbox` is deze
 * bedoeld om GEAWAIT te worden: een formulierinzending mag niet stil verdwijnen.
 * Gooit nooit — faalt hij, dan blijven mail en Telegram-alert gewoon staan en
 * gaat de fout naar de log; de bezoeker ziet nooit een fout die niet van hem is.
 *
 * Retourneert of de lead daadwerkelijk is geaccepteerd, zodat een caller of test
 * het verschil ziet tussen dormant, geweigerd en gelukt.
 */
export async function sendLeadToInbox(lead: InboxLead): Promise<boolean> {
  const channelId = process.env.FMA_INBOX_CHANNEL_ID;
  const secret = process.env.FMA_INBOX_CHANNEL_SECRET;
  // Dormant tot geconfigureerd — ontbrekende env = integratie intentioneel uit.
  if (!channelId || !secret) return false;

  const url = process.env.FMA_INBOX_URL || DEFAULT_INBOX_URL;

  // Dynamisch payload: een veld dat deze inzending niet draagt gaat er niet in.
  // De app doet een upsert met ON CONFLICT DO UPDATE over ALLEEN de meegegeven
  // kolommen, dus een leeg veld hier zou een eerdere waarde wissen.
  const body: Record<string, unknown> = {
    type: 'lead',
    account_key: lead.account_key,
    vendor: lead.vendor ?? 'own-bot',
    external_session_id: lead.external_session_id,
    origin: lead.origin,
  };
  if (lead.name) body.name = lead.name;
  if (lead.email) body.email = lead.email;
  if (lead.phone) body.phone = lead.phone;
  if (lead.company) body.company = lead.company;
  if (lead.score !== undefined) body.score = lead.score;
  if (lead.qualification) body.qualification = lead.qualification;
  if (lead.metadata && Object.keys(lead.metadata).length > 0) body.metadata = lead.metadata;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-inbox-secret': secret,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      // Geen response-body loggen: die kan de ingezonden PII echoën.
      console.error(
        `[fma-inbox-forwarder] lead forward failed: HTTP ${res.status} (origin=${lead.origin})`,
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error('[fma-inbox-forwarder] lead forward error:', error);
    return false;
  }
}
