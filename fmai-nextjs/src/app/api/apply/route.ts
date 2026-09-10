import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import crypto from 'node:crypto'
import { applyRateLimit } from '@/lib/ratelimit'
import { supabaseAdmin } from '@/lib/supabase-admin'
import {
  adminApplyTemplate,
  applicantConfirmationTemplate,
  type ApplyPayload,
} from '@/lib/email/apply-templates'
import { sendCriticalAlert, sendLeadAlert } from '@/lib/telegram-alert'
import { calHostedUrl } from '@/config/calConfig'
import { scoreApplication, formatScorePrefix } from '@/lib/apply/scoring'
import {
  sendLeadToInbox,
  normalizeLeadScore,
  qualificationFromScore,
} from '@/lib/fma-inbox-forwarder'
import { buildLeadConsent } from '@/config/privacyConfig'
import { getTranslations } from 'next-intl/server'
import {
  ASSESSMENT_ARCHETYPES,
  ASSESSMENT_STAGES,
  ASSESSMENT_CATEGORIES,
} from '@/lib/assessment/types'

const REVENUE_ENUM = ['under_300k', '300k_1m', '1m_3m', '3m_10m', 'over_10m'] as const
const CLIENT_COUNT_ENUM = ['solo', '1_5', '5_15', '15_50', 'over_50'] as const
const TIER_ENUM = ['founding', 'growth', 'professional', 'enterprise', 'unsure'] as const
const URGENCY_ENUM = ['30days', 'quarter', 'explore', 'unknown'] as const

/**
 * Legacy flat shape — kept for backwards-compat with old ApplicationForm
 * (still embedded on `/apply` Calendly success-page-fallback if any).
 */
const legacyApplicationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  agency: z.string().min(2).max(150).optional(),
  role: z.string().min(2).max(100).optional(),
  revenue: z.enum(REVENUE_ENUM).optional(),
  clientCount: z.enum(CLIENT_COUNT_ENUM).optional(),
  tier: z.enum(TIER_ENUM).optional(),
  workspaces: z.preprocess(
    (v) => (v === '' || v == null ? undefined : v),
    z.coerce.number().int().min(1).max(200).optional(),
  ),
  problem: z.string().min(20).max(5000).optional(),
  // Honeypot: accept any string so the honeypot check below can fire (max(0) would 422 before check)
  website: z.string().optional().default(''),
  locale: z.enum(['nl', 'en', 'es']).optional().default('nl'),
})

/**
 * New wizard-flow shape — nested identity + qualification + optional
 * assessment-handoff. Backwards-compat: server normalises to legacy
 * flat shape before persisting (no DB migration needed).
 */
const wizardSchema = z.object({
  identity: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    agency: z.string().min(2).max(150),
    role: z.string().min(2).max(100),
  }),
  qualification: z
    .object({
      q1: z.enum(TIER_ENUM).optional(),
      q2: z.enum(REVENUE_ENUM).optional(),
      q3: z.enum(CLIENT_COUNT_ENUM).optional(),
      q4: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
      q5: z.enum(URGENCY_ENUM).optional(),
    })
    .optional(),
  assessment: z
    .object({
      archetype: z.enum(ASSESSMENT_ARCHETYPES as readonly [string, ...string[]]),
      stage: z.enum(ASSESSMENT_STAGES as readonly [string, ...string[]]),
      lowestCategory: z.enum(ASSESSMENT_CATEGORIES as readonly [string, ...string[]]),
      source: z.enum(['url', 'session']).optional(),
    })
    .optional(),
  problem: z.string().max(2000).optional(),
  locale: z.enum(['nl', 'en', 'es']).optional().default('nl'),
  // Honeypot: accept any string so the honeypot check below can fire
  website: z.string().optional().default(''),
})

// Resend constructor throws when API key is undefined — placeholder for next build.
const resend = new Resend(process.env.RESEND_API_KEY ?? 're_placeholder')

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? ''
  return crypto.createHash('sha256').update(ip + salt).digest('hex')
}

/**
 * De privacybelofte zoals de bezoeker hem op het scherm zag, in zijn eigen taal.
 * Faalt de vertaallaag, dan gaat de lead zonder belofte mee in plaats van dat de
 * inzending stukloopt; `null` is eerlijker dan een verzonnen tekst.
 */
async function readPrivacyNotice(locale: string | undefined): Promise<string | null> {
  const safeLocale = locale === 'en' || locale === 'es' ? locale : 'nl'
  try {
    const t = await getTranslations({ locale: safeLocale, namespace: 'apply.form' })
    return t('privacyNote')
  } catch (error) {
    console.error('[apply][privacyNote]', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  // Skip rate-limiting outside production (Playwright tests share the same IP)
  const rl =
    process.env.NODE_ENV !== 'production'
      ? { success: true, limit: 5, remaining: 5, reset: 0 }
      : await applyRateLimit.limit(ip)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(rl.limit),
          'X-RateLimit-Remaining': String(rl.remaining),
          'X-RateLimit-Reset': String(rl.reset),
        },
      },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  // Discriminate wizard vs legacy by presence of `identity` field
  const isWizardPayload =
    typeof body === 'object' && body !== null && 'identity' in body

  let payload: ApplyPayload
  // De vrije tekst ZOALS DE BEZOEKER HEM TYPTE. `payload.problem` draagt voor de
  // mail een score-voorvoegsel; dat hoort niet in de lead, waar de ruwe score en
  // de uitkomst al hun eigen rij hebben.
  let problemRaw: string | undefined
  let scoreResult: ReturnType<typeof scoreApplication> | null = null
  let honeypotTriggered = false

  if (isWizardPayload) {
    const parsed = wizardSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed.', fields: parsed.error.flatten().fieldErrors },
        { status: 422 },
      )
    }
    if (parsed.data.website && parsed.data.website.length > 0) {
      honeypotTriggered = true
    }

    // Server-side rescore — trust nothing the client says about the math
    scoreResult = scoreApplication({
      qualification: parsed.data.qualification,
      assessment: parsed.data.assessment as
        | NonNullable<Parameters<typeof scoreApplication>[0]['assessment']>
        | undefined,
      problem: parsed.data.problem,
    })

    const scorePrefix = formatScorePrefix(
      scoreResult,
      parsed.data.assessment as
        | NonNullable<Parameters<typeof formatScorePrefix>[1]>
        | undefined,
    )
    const problemWithPrefix = parsed.data.problem
      ? `${scorePrefix}\n\n${parsed.data.problem}`
      : scorePrefix
    problemRaw = parsed.data.problem

    payload = {
      name: parsed.data.identity.name,
      email: parsed.data.identity.email,
      agency: parsed.data.identity.agency,
      role: parsed.data.identity.role,
      tier: parsed.data.qualification?.q1,
      revenue: parsed.data.qualification?.q2,
      clientCount: parsed.data.qualification?.q3,
      maturity: parsed.data.qualification?.q4,
      urgency: parsed.data.qualification?.q5,
      problem: problemWithPrefix,
      locale: parsed.data.locale,
      score: scoreResult.total,
      maxScore: scoreResult.max,
      branch: scoreResult.branch,
      assessment: parsed.data.assessment
        ? {
            archetype: parsed.data.assessment.archetype,
            stage: parsed.data.assessment.stage,
            lowestCategory: parsed.data.assessment.lowestCategory,
          }
        : undefined,
    }
  } else {
    const parsed = legacyApplicationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed.', fields: parsed.error.flatten().fieldErrors },
        { status: 422 },
      )
    }
    if (parsed.data.website && parsed.data.website.length > 0) {
      honeypotTriggered = true
    }
    payload = {
      name: parsed.data.name,
      email: parsed.data.email,
      agency: parsed.data.agency,
      role: parsed.data.role,
      revenue: parsed.data.revenue,
      clientCount: parsed.data.clientCount,
      tier: parsed.data.tier,
      workspaces: parsed.data.workspaces,
      problem: parsed.data.problem,
      locale: parsed.data.locale,
    }
    problemRaw = parsed.data.problem
  }

  // Honeypot silently accepted: 200 so bots cannot tell
  if (honeypotTriggered) {
    return NextResponse.json(
      {
        success: true,
        branch: scoreResult?.branch ?? 'review',
        score: scoreResult?.total ?? 0,
        maxScore: scoreResult?.max ?? 0,
      },
      { status: 200 },
    )
  }

  // 1. Persist in Supabase. Do not fail user submission on DB error.
  const { error: dbError } = await supabaseAdmin.from('applications').insert({
    name: payload.name,
    email: payload.email,
    agency: payload.agency,
    role: payload.role,
    revenue: payload.revenue,
    client_count: payload.clientCount,
    tier: payload.tier,
    workspaces: payload.workspaces ?? null,
    problem: payload.problem,
    locale: payload.locale,
    ip_hash: hashIp(ip),
    user_agent: request.headers.get('user-agent') ?? null,
  })
  if (dbError) {
    console.error('[apply][supabase]', dbError)
  }

  // 2. Send admin + applicant confirmation in parallel.
  const fromAddr = process.env.APPLY_EMAIL_FROM ?? 'apply@future-marketing.ai'
  const toAddr = process.env.APPLY_EMAIL_TO ?? 'info@future-marketing.ai'

  const subjectAgency = payload.agency ? ` ${payload.agency}` : ''
  const subjectTier = payload.tier ? ` (${payload.tier})` : ''
  const subjectBranch = payload.branch ? ` [${payload.branch.toUpperCase()}]` : ''
  const scoreLine = payload.score !== undefined ? ` score:${payload.score}/${payload.maxScore}` : ''
  const leadHeadline = `Nieuwe apply:${subjectAgency}${subjectTier}${subjectBranch}${scoreLine}`

  const problemSnippet = payload.problem
    ? payload.problem.length > 300
      ? payload.problem.slice(0, 300) + '…'
      : payload.problem
    : undefined

  const leadProblemSnippet = problemRaw
    ? problemRaw.length > 300
      ? problemRaw.slice(0, 300) + '…'
      : problemRaw
    : undefined

  // 2b. Lead-doorvoer naar de Lead Qualifier in de app.
  // `external_session_id` bestaat niet voor een formulier, dus die wordt hier
  // SERVER-SIDE gemaakt en nooit uit de body gelezen: hij is tegelijk de
  // idempotentiesleutel van de lead-upsert.
  const leadSessionId = `apply:${crypto.randomUUID()}`
  // Score genormaliseerd naar 0..100, want `fma_leads.score` eist dat bereik.
  // Het label volgt uit die genormaliseerde score, NIET uit `branch`: die staat
  // al op `qualified` vanaf 7 van 17. `branch` gaat als losse waarde mee.
  const leadScore = scoreResult
    ? normalizeLeadScore(scoreResult.total, scoreResult.max)
    : undefined
  const leadMetadata: Record<string, unknown> = {
    locale: payload.locale,
    ...(payload.role ? { role: payload.role } : {}),
    ...(payload.tier ? { tier: payload.tier } : {}),
    ...(payload.revenue ? { revenue: payload.revenue } : {}),
    ...(payload.clientCount ? { client_count: payload.clientCount } : {}),
    ...(payload.urgency ? { urgency: payload.urgency } : {}),
    ...(typeof payload.maturity === 'number' ? { maturity: payload.maturity } : {}),
    ...(typeof payload.workspaces === 'number' ? { workspaces: payload.workspaces } : {}),
    ...(scoreResult
      ? { branch: scoreResult.branch, score_raw: scoreResult.total, score_max: scoreResult.max }
      : {}),
    ...(payload.assessment ? { assessment: payload.assessment } : {}),
    // Het probleem is de enige vrije tekst van een aanvraag. Zonder dit staat de
    // lead in de app zonder context: het lead-marker-bericht wordt uit het
    // transcript gefilterd, dus het gesprekspaneel blijft leeg.
    ...(leadProblemSnippet ? { problem: leadProblemSnippet } : {}),
    // De doelbinding reist mee met de lead. De aanvraagpagina belooft "alleen voor
    // de beoordeling"; die belofte hoort bij de rij te staan, niet alleen op de
    // pagina die hem gaf. Zie src/config/privacyConfig.ts.
    consent: buildLeadConsent('assessment_only', await readPrivacyNotice(payload.locale)),
    // Expliciet, zodat de app "niet gescoord" kan onderscheiden van "koud bevonden":
    // fma_leads.score en .qualification_label zijn NOT NULL met default 0 en 'cold'.
    scored: leadScore !== undefined,
  }

  const [adminResult, confirmationResult] = await Promise.all([
    resend.emails.send({
      from: `FutureMarketingAI <${fromAddr}>`,
      to: [toAddr],
      replyTo: payload.email,
      subject: `[Apply${subjectBranch}]${subjectAgency}${subjectTier}`,
      html: adminApplyTemplate(payload),
    }),
    resend.emails.send({
      from: `Daley van FutureMarketingAI <${fromAddr}>`,
      to: [payload.email],
      subject:
        payload.locale === 'en'
          ? 'Your application has been received'
          : payload.locale === 'es'
            ? 'Hemos recibido tu solicitud'
            : 'Je aanvraag is ontvangen',
      html: applicantConfirmationTemplate(payload),
    }),
    sendLeadAlert(leadHeadline, {
      name: payload.name,
      email: payload.email,
      ...(payload.agency ? { agency: payload.agency } : {}),
      ...(payload.role ? { role: payload.role } : {}),
      ...(payload.tier ? { tier: payload.tier } : {}),
      ...(typeof payload.workspaces === 'number' ? { workspaces: payload.workspaces } : {}),
      ...(payload.revenue ? { revenue: payload.revenue } : {}),
      ...(payload.clientCount ? { clients: payload.clientCount } : {}),
      ...(payload.urgency ? { urgency: payload.urgency } : {}),
      ...(typeof payload.maturity === 'number' ? { maturity: payload.maturity } : {}),
      ...(payload.score !== undefined ? { score: `${payload.score}/${payload.maxScore}` } : {}),
      ...(payload.branch ? { branch: payload.branch } : {}),
      locale: payload.locale,
      ...(problemSnippet ? { problem: problemSnippet } : {}),
    }),
    // Rijdt mee in deze Promise.all: awaited, want een inzending mag niet stil
    // verdwijnen, maar zonder de bezoeker extra wachttijd te kosten. Gooit nooit,
    // dus een mislukte doorvoer laat mail en Telegram-alert staan.
    sendLeadToInbox({
      account_key: 'fmai_website',
      external_session_id: leadSessionId,
      origin: 'apply',
      name: payload.name,
      email: payload.email,
      ...(payload.agency ? { company: payload.agency } : {}),
      ...(leadScore !== undefined
        ? { score: leadScore, qualification: qualificationFromScore(leadScore) }
        : {}),
      metadata: leadMetadata,
    }),
  ])

  if (adminResult.error) {
    const ctx = { route: '/api/apply', to: toAddr, from: fromAddr, error: adminResult.error }
    console.error('[CRITICAL][apply][resend:admin]', ctx)
    await sendCriticalAlert('Apply admin mail failed', ctx)
  }
  if (confirmationResult.error) {
    const ctx = { route: '/api/apply', to: payload.email, from: fromAddr, error: confirmationResult.error }
    console.error('[CRITICAL][apply][resend:confirm]', ctx)
    await sendCriticalAlert('Apply confirmation mail failed', ctx)
  }

  // Field name kept as `calendlyUrl` for response/store contract stability; the
  // value is a Cal.com hosted booking link since the 2026-06 scheduling migration.
  const calendlyUrl = calHostedUrl({ name: payload.name, email: payload.email })

  return NextResponse.json(
    {
      success: true,
      branch: scoreResult?.branch ?? (payload.branch ?? 'review'),
      score: scoreResult?.total ?? (payload.score ?? 0),
      maxScore: scoreResult?.max ?? (payload.maxScore ?? 0),
      ...(scoreResult?.branch === 'qualified' ? { calendlyUrl } : {}),
    },
    { status: 200 },
  )
}
