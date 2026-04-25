/**
 * Server-only Supabase client using the service_role key.
 *
 * WHY: API routes need to insert into applications and contact_submissions
 * tables which have RLS enabled. Only the service_role can bypass RLS.
 *
 * NEVER import this from a client component. The 'server-only' import will
 * cause a compile-time error if it ends up in a client bundle.
 */
import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  // Fail loudly at import time if misconfigured. Better than a runtime 500 per submission.
  console.warn(
    '[supabase-admin] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Inserts will fail.',
  )
}

export const supabaseAdmin: SupabaseClient = createClient(url ?? '', key ?? '', {
  auth: { persistSession: false, autoRefreshToken: false },
})
