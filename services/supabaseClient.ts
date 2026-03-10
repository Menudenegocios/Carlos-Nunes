import { createClient } from '@supabase/supabase-js';

const isBrowser = typeof window !== 'undefined';

// Try to get variables from both import.meta.env (Vite) and process.env (Node/Server)
const supabaseUrl = (isBrowser ? import.meta.env.VITE_SUPABASE_URL : process.env.SUPABASE_URL) || process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (isBrowser ? import.meta.env.VITE_SUPABASE_ANON_KEY : process.env.SUPABASE_ANON_KEY) || process.env.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Service role key should ONLY be available on the server
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.");
}

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({}, {
      get: (target, prop) => {
        // Handle common initial calls gracefully
        if (prop === 'auth') {
          return {
            onAuthStateChanged: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            getSession: async () => ({ data: { session: null }, error: null }),
            getUser: async () => ({ data: { user: null }, error: null }),
          };
        }
        // For other properties, return a function that throws a descriptive error
        return () => {
          throw new Error("Supabase client not initialized. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables in the Settings menu.");
        };
      }
    }) as any;

// Only export supabaseAdmin if we are on the server and have the key
export const supabaseAdmin = (!isBrowser && supabaseUrl && supabaseServiceRoleKey) 
  ? createClient(supabaseUrl, supabaseServiceRoleKey) 
  : null;
