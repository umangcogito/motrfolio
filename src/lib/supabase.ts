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
