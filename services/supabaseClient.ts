
import { createClient } from '@supabase/supabase-js';

// Na Hostinger, você deve configurar estas variáveis no painel de controle (Environment Variables)
const supabaseUrl = process.env.SUPABASE_URL || 'https://hfvfetwhurrhexvawody.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_8e-0o7GXlI9xftMW2s2Wdg_7e7os09G';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
