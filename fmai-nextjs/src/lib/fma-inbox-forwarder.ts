/**
 * Forwarder voor FMai Unified Chatbot Inbox.
 *
 * WHY: elke user+assistant turn van de FMai Concierge live doorsturen naar de
 * fma-app ingestion-API zodat de agency owner gesprekken kan monitoren.
 * Fire-and-forget — NOOIT awaiten op het chatbot-critisch pad.
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
