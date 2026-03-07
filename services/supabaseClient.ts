
import { createClient } from '@supabase/supabase-js';

// No ambiente Hostinger ou em browsers, process.env pode não estar definido
// Usamos uma abordagem segura para evitar erros de referência
const getEnv = (key: string, defaultValue: string): string => {
  try {
    // 1. Tenta process.env (Node.js / Server)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key]!.trim();
    }
    // 2. Tenta import.meta.env (Vite / Client)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[`VITE_${key}`]) {
      // @ts-ignore
      return import.meta.env[`VITE_${key}`].trim();
    }
  } catch (e) {}
  return defaultValue;
};

const supabaseUrl = getEnv('SUPABASE_URL', 'https://hfvfetwhurrhexvawody.supabase.co');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY', 'sb_publishable_8e-0o7GXlI9xftMW2s2Wdg_7e7os09G');

// Se a URL não for válida, o createClient pode falhar silenciosamente ou lançar erro
if (process.env.NODE_ENV !== 'production') {
  console.log("Supabase URL:", supabaseUrl);
  console.log("Supabase Anon Key (início):", supabaseAnonKey.substring(0, 10) + "...");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});
