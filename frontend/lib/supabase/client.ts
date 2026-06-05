import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const hasValidSupabaseUrl = /^https?:\/\//.test(supabaseUrl);

export const isSupabaseConfigured = hasValidSupabaseUrl && Boolean(supabaseAnonKey);

export function createClient() {
  return createBrowserClient(
    hasValidSupabaseUrl ? supabaseUrl : 'https://example.supabase.co',
    supabaseAnonKey || 'missing-anon-key'
  );
}
