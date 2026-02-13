
-- SCRIPT DE CONFIGURAÇÃO DO MENU DE NEGÓCIOS - VERSÃO HOSTINGER/SUPABASE
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

CREATE TABLE IF NOT EXISTS public.store_categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  "order" integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  store_category_id uuid REFERENCES public.store_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price decimal(10,2) DEFAULT 0,
  promo_price decimal(10,2),
  image_url text,
  video_url text,
  category text,
  available boolean DEFAULT true,
  button_type text DEFAULT 'buy',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.offers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  city text,
  price text,
  image_url text,
  video_url text,
  logo_url text,
  social_links jsonb DEFAULT '{}'::jsonb,
  coupons jsonb DEFAULT '[]'::jsonb,
  scheduling jsonb DEFAULT '{}'::jsonb,
  created_at bigint DEFAULT (extract(epoch from now()) * 1000)::bigint
);

CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name text,
  business_name text,
  user_avatar text,
  content text NOT NULL,
  image_url text,
  likes integer DEFAULT 0,
  liked_by uuid[] DEFAULT '{}',
  created_at bigint DEFAULT (extract(epoch from now()) * 1000)::bigint
);

CREATE TABLE IF NOT EXISTS public.community_comments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text,
  user_avatar text,
  content text NOT NULL,
  created_at bigint DEFAULT (extract(epoch from now()) * 1000)::bigint
);

CREATE TABLE IF NOT EXISTS public.points_history (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL,
  points integer NOT NULL,
  category text,
  created_at bigint DEFAULT (extract(epoch from now()) * 1000)::bigint
);

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  phone text,
  source text,
  stage text DEFAULT 'new',
  notes text,
  value decimal(10,2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.financial_entries (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  value decimal(10,2) NOT NULL,
  type text NOT NULL,
  date text NOT NULL,
  category text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.schedule_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  client text,
  date text NOT NULL,
  time text NOT NULL,
  type text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. SEGURANÇA (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS CORRIGIDAS (FOR ALL)
CREATE POLICY "Profiles leitura pública" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles gestão privada" ON public.profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Categorias leitura pública" ON public.store_categories FOR SELECT USING (true);
CREATE POLICY "Categorias gestão privada" ON public.store_categories FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Produtos leitura pública" ON public.products FOR SELECT USING (true);
CREATE POLICY "Produtos gestão privada" ON public.products FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Offers leitura pública" ON public.offers FOR SELECT USING (true);
CREATE POLICY "Offers gestão privada" ON public.offers FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Posts leitura pública" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Usuários logados criam posts" ON public.community_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Dono gerencia posts" ON public.community_posts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Comentários leitura pública" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Usuários logados comentam" ON public.community_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Leads acesso privado" ON public.leads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Financeiro acesso privado" ON public.financial_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Agenda acesso privado" ON public.schedule_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Pontos acesso privado" ON public.points_history FOR ALL USING (auth.uid() = user_id);

-- 4. GATILHO DE PERFIL AUTOMÁTICO
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, plan, points, level, referral_code)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email,
    'profissionais',
    50,
    'bronze',
    'REF' || upper(substring(replace(uuid_generate_v4()::text, '-', ''), 1, 6))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Deletar se já existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Post inicial para teste
INSERT INTO public.community_posts (user_id, user_name, business_name, user_avatar, content, likes, created_at)
VALUES ('00000000-0000-0000-0000-000000000000', 'Sistema', 'Menu ADS', 'https://api.dicebear.com/7.x/initials/svg?seed=ADS', 'Plataforma pronta para hospedar na Hostinger! 🚀', 1, (extract(epoch from now()) * 1000)::bigint)
ON CONFLICT DO NOTHING;
