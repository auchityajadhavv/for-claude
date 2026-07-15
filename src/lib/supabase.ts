import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True once the Supabase env vars are set (in Vercel or .env.local). */
export const supabaseConfigured = Boolean(url && key)

/** Shared client, or null when the backend isn't configured yet. */
export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url as string, key as string)
  : null

/** Only this email may reach the owner dashboard (also enforced by RLS). */
export const OWNER_EMAIL = (
  (import.meta.env.VITE_OWNER_EMAIL as string | undefined) || ''
).toLowerCase()
