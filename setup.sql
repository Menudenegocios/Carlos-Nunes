
-- SCRIPT DE CONFIGURAÇÃO DO MENU DE NEGÓCIOS - VERSÃO ULTRA RESILIENTE
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. EXTENSÕES (Garantir que uuid-ossp esteja disponível no schema public)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

-- 2. TABELAS (Ajustes de segurança)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
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

-- 3. FUNÇÃO DE GATILHO CORRIGIDA
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_ref_code text;
BEGIN
  -- Gera um código de indicação simples baseado em milissegundos para evitar falhas de UUID
  new_ref_code := 'REF' || upper(substring(replace(public.uuid_generate_v4()::text, '-', ''), 1, 6));

  BEGIN
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
      new_ref_code
    )
    ON CONFLICT (user_id) DO UPDATE SET
      email = EXCLUDED.email;
  EXCEPTION WHEN OTHERS THEN
    -- Se falhar, o Supabase ainda criará o usuário no Auth, evitando o erro fatal no registro
    RAISE WARNING 'Erro ao criar perfil para o usuário %: %', new.id, SQLERRM;
  END;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- 4. RECRIAÇÃO DO GATILHO
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. POLÍTICAS DE ACESSO (RLS) - Garantir que estão ativas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Profiles leitura pública') THEN
        CREATE POLICY "Profiles leitura pública" ON public.profiles FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Profiles gestão privada') THEN
        CREATE POLICY "Profiles gestão privada" ON public.profiles FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;
