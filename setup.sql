
-- LIMPEZA INICIAL (Garantir que não haja conflitos de versões anteriores)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE PERFIS (Garantir estrutura correta)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text,
  email text,
  business_name text,
  category text,
  phone text,
  address text,
  city text,
  neighborhood text,
  bio text,
  logo_url text,
  social_links jsonb DEFAULT '{}'::jsonb,
  store_config jsonb DEFAULT '{"salesType": "both", "aiChatEnabled": true, "paymentMethods": {"pix": {"enabled": false}, "creditCard": false, "onDelivery": true}}'::jsonb,
  bio_config jsonb DEFAULT '{"themeId": "dark", "fontFamily": "font-sans", "links": []}'::jsonb,
  plan text DEFAULT 'profissionais',
  points integer DEFAULT 50,
  level text DEFAULT 'bronze',
  referral_code text,
  referrals_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id)
);

-- 3. FUNÇÃO DE GATILHO À PROVA DE FALHAS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  generated_code text;
BEGIN
  -- Toda a lógica dentro do bloco de exceção
  BEGIN
    -- Gerador simples de código de indicação (evita falhas de UUID)
    generated_code := 'REF' || floor(random() * (999999-100000 + 1) + 100000)::text;

    INSERT INTO public.profiles (
      user_id, 
      full_name, 
      email, 
      plan, 
      points, 
      level, 
      referral_code
    )
    VALUES (
      new.id, 
      COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'), 
      new.email,
      'profissionais',
      50,
      'bronze',
      generated_code
    )
    ON CONFLICT (user_id) DO UPDATE SET
      email = EXCLUDED.email;
      
  EXCEPTION WHEN OTHERS THEN
    -- Silencia o erro para permitir que o usuário seja criado no Auth.
    -- O perfil poderá ser criado manualmente ou em um segundo momento.
    NULL; 
  END;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. REATIVAÇÃO DO GATILHO
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. PERMISSÕES RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Excluir políticas antigas se existirem para evitar erro de duplicação
DROP POLICY IF EXISTS "Profiles leitura pública" ON public.profiles;
DROP POLICY IF EXISTS "Profiles gestão privada" ON public.profiles;

CREATE POLICY "Profiles leitura pública" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles gestão privada" ON public.profiles FOR ALL USING (auth.uid() = user_id);
