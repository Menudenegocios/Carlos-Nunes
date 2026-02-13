
import { createClient } from '@supabase/supabase-js';

// No ambiente Hostinger, você deve configurar estas variáveis no painel de controle
// Caso não estejam configuradas, ele usará os valores padrão fornecidos
const supabaseUrl = process.env.SUPABASE_URL || 'https://hfvfetwhurrhexvawody.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_8e-0o7GXlI9xftMW2s2Wdg_7e7os09G';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: Credenciais do Supabase não configuradas no ambiente.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
