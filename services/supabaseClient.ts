import { createClient } from '@supabase/supabase-js';

const isBrowser = typeof window !== 'undefined';

// Try to get variables from both import.meta.env (Vite) and process.env (Node/Server)
const supabaseUrl = (isBrowser ? import.meta.env.VITE_SUPABASE_URL : process.env.SUPABASE_URL) || process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (isBrowser ? import.meta.env.VITE_SUPABASE_ANON_KEY : process.env.SUPABASE_ANON_KEY) || process.env.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Service role key should ONLY be available on the server
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing!");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Only export supabaseAdmin if we are on the server and have the key
export const supabaseAdmin = !isBrowser && supabaseServiceRoleKey 
  ? createClient(supabaseUrl || '', supabaseServiceRoleKey) 
  : null;
