import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.");
}

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Singleton pattern for Supabase client to avoid multiple instances during HMR
const globalForSupabase = globalThis as unknown as { supabaseAuthClient: any };

const createSupabaseClient = () => {
  if (!isSupabaseConfigured) {
    return new Proxy({}, {
      get: (target, prop) => {
        if (prop === 'auth') {
          return {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            getSession: async () => ({ data: { session: null }, error: null }),
            getUser: async () => ({ data: { user: null }, error: null }),
          };
        }
        return () => {
          throw new Error("Supabase client not initialized. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
        };
      }
    }) as any;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    }
  });
};

export const supabase = globalForSupabase.supabaseAuthClient || createSupabaseClient();

if (import.meta.env.DEV) {
  globalForSupabase.supabaseAuthClient = supabase;
}
