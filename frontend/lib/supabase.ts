import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const hasValidSupabaseUrl = /^https?:\/\//.test(supabaseUrl);

export const isSupabaseConfigured = hasValidSupabaseUrl && Boolean(supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables are not set');
}

export const supabase = createClient(
  hasValidSupabaseUrl ? supabaseUrl : 'https://example.supabase.co',
  supabaseAnonKey || 'missing-anon-key'
);
