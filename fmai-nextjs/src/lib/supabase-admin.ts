/**
 * Server-only Supabase client using the service_role key.
 *
 * WHY: API routes need to insert into applications and contact_submissions
 * tables which have RLS enabled. Only the service_role can bypass RLS.
 *
 * NEVER import this from a client component. The 'server-only' import will
 * cause a compile-time error if it ends up in a client bundle.
 *
 * IMPORTANT: createClient throws "supabaseUrl is required" if URL is empty,
 * which would block `next build` page data collection. We pass a placeholder
 * URL and log a runtime warning when env is missing. Inserts will fail
 * gracefully via the route handler's `if (dbError) console.error(...)` path.
 */
import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

const isConfigured = Boolean(url && key)

if (!isConfigured) {
  console.warn(
    '[supabase-admin] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Inserts will fail.',
  )
}

// Pass a placeholder URL when missing so createClient does not throw at
// import-time during build/page-data-collection. The actual insert at runtime
// will fail and be logged by the API route's error branch.
export const supabaseAdmin: SupabaseClient = createClient(
  url ?? 'https://placeholder.supabase.co',
  key ?? 'placeholder-key',
  { auth: { persistSession: false, autoRefreshToken: false } },
)
