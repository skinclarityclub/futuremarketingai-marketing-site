/**
 * POST /api/assessment
 *
 * AI Readiness Assessment submission endpoint. Lands after the user has
 * answered all 16 questions client-side; the body contains email +
 * consent + answers + scores + persona + lowestCategory. We re-score
 * on the server (trust nothing the client says about the math) to
 * guarantee the persona matches the answers we store.
 *
 * Flow:
 *   1. Validate body shape, honeypot, explicit consent.
 *   2. Re-score answers server-side; if persona mismatches the client's
 *      claim we still trust the server result (silent correction).
 *   3. INSERT newsletter_consents row with assessment_* columns filled,
 *      status='pending', new token.
 *   4. Send confirmation mail with persona-aware subject/CTA (Resend).
 *   5. Webhook + audience-add happen in /api/newsletter/confirm after click.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import crypto from 'node:crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { scoreAssessment } from '@/lib/assessment/scoring'
import { assessmentConfirmEmail } from '@/lib/email/assessment-templates'
import { ASSESSMENT_PERSONAS, type AssessmentAnswers } from '@/lib/assessment/types'

const resend = new Resend(process.env.RESEND_API_KEY ?? 're_placeholder')

const QUESTION_IDS = [
  'q1','q2','q3','q4','q5','q6','q7','q8',
  'q9','q10','q11','q12','q13','q14','q15','q16',
] as const

const answerValueSchema = z.union([
  z.enum(['a', 'b', 'c', 'd']),
  z.number().int().min(1).max(5),
])

const assessmentSchema = z.object({
  email: z.string().email().max(254),
  locale: z.enum(['nl', 'en', 'es']).default('nl'),
  source: z.string().max(50).optional(),
  consent: z.literal(true, { error: 'Consent is required.' }),
  consentText: z.string().min(1).max(500),
  website: z.string().max(0).optional().default(''),
  answers: z.object(
    Object.fromEntries(QUESTION_IDS.map((id) => [id, answerValueSchema])) as Record<
      (typeof QUESTION_IDS)[number],
      typeof answerValueSchema
    >,
  ),
  startedAt: z.string().datetime().optional(),
})

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? ''
  return crypto.createHash('sha256').update(ip + salt).digest('hex')
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = assessmentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation_failed' }, { status: 400 })
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const { email, locale, source, consentText, startedAt } = parsed.data

  // Zod widens numeric literals to `number`; the validator already constrains
  // the range, so cast back to AnswerValue for the scoring function.
  const answers = parsed.data.answers as AssessmentAnswers

  // Re-score on the server: the persisted persona must reflect the actual
  // answers, not whatever the client posted.
  const result = scoreAssessment(answers)
  if (!ASSESSMENT_PERSONAS.includes(result.persona)) {
    return NextResponse.json({ error: 'invalid_persona' }, { status: 500 })
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  const ipHashed = hashIp(ip)
  const userAgent = request.headers.get('user-agent')?.slice(0, 500) ?? 'unknown'

  const token = crypto.randomUUID()
  const completedAt = new Date().toISOString()

  const { error: dbError } = await supabaseAdmin.from('newsletter_consents').insert({
    email: email.toLowerCase(),
    token,
    status: 'pending',
    ip_hashed: ipHashed,
    user_agent: userAgent,
    consent_text: consentText,
    locale,
    source: source ?? 'assessment',
    assessment_answers: answers,
    assessment_scores: { ...result.perCategory, total: result.total },
    assessment_persona: result.persona,
    assessment_started_at: startedAt ?? null,
    assessment_completed_at: completedAt,
  })

  if (dbError) {
    console.error('[assessment] supabase insert failed', dbError)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://future-marketing.ai'
  const confirmUrl = `${siteUrl}/${locale}/newsletter/confirm?token=${token}`
  const fromAddr = process.env.APPLY_EMAIL_FROM ?? 'apply@future-marketing.ai'

  try {
    const mail = assessmentConfirmEmail({ locale, persona: result.persona, confirmUrl })
    const send = await resend.emails.send({
      from: `FutureMarketingAI <${fromAddr}>`,
      to: [email],
      subject: mail.subject,
      html: mail.html,
    })
    if (send.error) {
      console.error('[assessment] resend send failed', send.error)
      return NextResponse.json({ error: 'email_failed' }, { status: 502 })
    }
  } catch (err) {
    console.error('[assessment] resend send threw', err)
    return NextResponse.json({ error: 'email_failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, persona: result.persona })
}
