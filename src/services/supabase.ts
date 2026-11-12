import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  typeof SUPABASE_URL === 'string' &&
  (SUPABASE_URL.startsWith('http://') || SUPABASE_URL.startsWith('https://')) &&
  !SUPABASE_URL.includes('your-project-id') &&
  !SUPABASE_ANON_KEY.includes('your-anon-key') &&
  !SUPABASE_ANON_KEY.includes('...')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export async function checkSupabaseStatus(): Promise<{
  configured: boolean;
  connected: boolean;
  message: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      configured: false,
      connected: false,
      message: 'Supabase credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not set. Running in local JSON database mode.'
    };
  }

  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return {
        configured: true,
        connected: false,
        message: `Supabase reached, but schema table 'profiles' was not found or accessible: ${error.message}. Please execute supabase/schema.sql in the Supabase SQL editor.`
      };
    }
    return {
      configured: true,
      connected: true,
      message: 'Supabase PostgreSQL & Storage fully active and connected!'
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      message: `Error connecting to Supabase: ${err.message}`
    };
  }
}
