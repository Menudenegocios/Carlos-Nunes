
-- SCRIPT DE CONFIGURAÇÃO DO MENU DE NEGÓCIOS - VERSÃO RESILIENTE
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELAS
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

-- (Outras tabelas permanecem iguais, omitidas aqui por brevidade mas devem ser mantidas no banco)
-- Nota: O comando CREATE TABLE IF NOT EXISTS não sobrescreve dados existentes.

-- 4. GATILHO DE PERFIL AUTOMÁTICO (CORRIGIDO E RESILIENTE)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_referral_code text;
BEGIN
  -- Gera um código de indicação curto e único
  new_referral_code := 'REF' || upper(substring(replace(uuid_generate_v4()::text, '-', ''), 1, 6));

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
    new_referral_code
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name);
    
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garantir que o gatilho esteja limpo e recriado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
