-- ATIVE A EXTENSÃO UUID SE NÃO ESTIVER ATIVA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE PERFIS (ESTENDIDA)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text,
  business_name text,
  category text,
  phone text,
  address text,
  city text,
  neighborhood text,
  bio text,
  logo_url text,
  plan text DEFAULT 'profissionais',
  points integer DEFAULT 0,
  level text DEFAULT 'bronze',
  referral_code text,
  referrals_count integer DEFAULT 0,
  social_links jsonb DEFAULT '{}'::jsonb,
  store_config jsonb DEFAULT '{}'::jsonb,
  bio_config jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. TABELA DE LEADS (CRM)
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  phone text,
  source text DEFAULT 'manual',
  stage text DEFAULT 'new',
  notes text,
  value numeric DEFAULT 0,
  created_at bigint DEFAULT (extract(epoch from now()) * 1000)
);

-- 3. TABELA DE LANÇAMENTOS FINANCEIROS
CREATE TABLE IF NOT EXISTS public.financial_entries (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  value numeric NOT NULL,
  type text NOT NULL,
  category text DEFAULT 'Vendas',
  date timestamp with time zone DEFAULT timezone('utc'::text, now()),
  created_at bigint DEFAULT (extract(epoch from now()) * 1000)
);

-- 4. TABELA DE ITENS DA AGENDA
CREATE TABLE IF NOT EXISTS public.schedule_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  client text,
  date date NOT NULL,
  time text NOT NULL,
  type text DEFAULT 'servico',
  status text DEFAULT 'pending',
  created_at bigint DEFAULT (extract(epoch from now()) * 1000)
);

-- 5. TABELA DE BLOG POSTS
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text,
  content text,
  author text,
  category text,
  image_url text,
  date text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 6. TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  store_category_id text,
  name text NOT NULL,
  description text,
  price numeric DEFAULT 0,
  promo_price numeric,
  image_url text,
  video_url text,
  category text,
  available boolean DEFAULT true,
  variations jsonb DEFAULT '[]'::jsonb,
  button_type text DEFAULT 'buy',
  external_link text,
  stock integer DEFAULT 0,
  points_reward integer DEFAULT 0,
  is_local boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 7. TABELA DE CATEGORIAS DA LOJA
CREATE TABLE IF NOT EXISTS public.store_categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  "order" integer DEFAULT 0
);

-- HABILITAR RLS EM TUDO
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_categories ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS BÁSICAS (CUIDADO: EM PRODUÇÃO REFINAR AS POLÍTICAS DE SELECT)
CREATE POLICY "Acesso total dono perfil" ON public.profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Acesso total dono lead" ON public.leads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Acesso total dono finança" ON public.financial_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Acesso total dono agenda" ON public.schedule_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Leitura pública blog" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Escrita blog dono" ON public.blog_posts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Leitura pública produtos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Acesso total dono produto" ON public.products FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Acesso total dono cat" ON public.store_categories FOR ALL USING (auth.uid() = user_id);