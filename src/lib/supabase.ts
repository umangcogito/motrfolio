import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the public anon key.
 *
 * The waitlist table has an RLS policy that permits anonymous INSERTs only
 * (see supabase/migrations/0001_waitlist.sql), so the anon key is sufficient
 * and the service-role key is never needed on this path.
 *
 * Returns null when env vars are not yet configured, so callers can degrade
 * gracefully during early local development.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

/**
 * Server-side ADMIN client using the service-role key. Bypasses RLS.
 *
 * Use ONLY in trusted server code (never expose to the client). Powers the
 * listing create flow (photo upload + listing insert) so we don't need to
 * open any public write policy. Returns null if the key isn't configured.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
