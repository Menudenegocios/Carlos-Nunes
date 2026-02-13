
import { createClient } from '@supabase/supabase-js';

// No ambiente Hostinger, você deve configurar estas variáveis no painel de controle
// Usamos .trim() para garantir que espaços acidentais não quebrem a conexão
const supabaseUrl = (process.env.SUPABASE_URL || 'https://hfvfetwhurrhexvawody.supabase.co').trim();
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || 'sb_publishable_8e-0o7GXlI9xftMW2s2Wdg_7e7os09G').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: Credenciais do Supabase não configuradas no ambiente.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
