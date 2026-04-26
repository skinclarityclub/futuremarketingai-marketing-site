// Telegram fan-out for admin notifications.
// Graceful no-op when env vars missing so dev/preview don't error.

const ENDPOINT = (token: string) =>
  `https://api.telegram.org/bot${token}/sendMessage`

function escapeMarkdownV2(s: string): string {
  return s.replace(/[_*\[\]()~`>#+\-=|{}.!\\]/g, (c) => `\\${c}`)
}

function fmtValue(v: unknown): string {
  if (v == null) return '_(none)_'
  if (typeof v === 'string') return escapeMarkdownV2(v)
  if (typeof v === 'object') {
    try {
      return '`' + escapeMarkdownV2(JSON.stringify(v)) + '`'
    } catch {
      return '_(unserialisable)_'
    }
  }
  return escapeMarkdownV2(String(v))
}

async function send(
  emoji: string,
  title: string,
  fields: Record<string, unknown>,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.warn('[telegram-alert] credentials missing, skipping send')
    return
  }

  const lines: string[] = [`${emoji} *${escapeMarkdownV2(title)}*`, '']
  for (const [k, v] of Object.entries(fields)) {
    lines.push(`*${escapeMarkdownV2(k)}*: ${fmtValue(v)}`)
  }
  lines.push('', `_${escapeMarkdownV2(new Date().toISOString())}_`)

  try {
    const res = await fetch(ENDPOINT(token), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join('\n'),
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
      }),
    })
    if (!res.ok) {
      const body = await res.text()
      console.error('[telegram-alert] send failed', { status: res.status, body: body.slice(0, 300) })
    }
  } catch (err) {
    console.error('[telegram-alert] send threw', err)
  }
}

export const sendCriticalAlert = (title: string, fields: Record<string, unknown>): Promise<void> =>
  send('🚨', title, fields)

export const sendLeadAlert = (title: string, fields: Record<string, unknown>): Promise<void> =>
  send('🎉', title, fields)
