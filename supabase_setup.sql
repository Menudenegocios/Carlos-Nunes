-- ==========================================
-- SCRIPT DE BANCO DE DADOS - MENU DE NEGÓCIOS
-- ==========================================
-- Copie todo este código e cole no "SQL Editor" do seu Supabase.
-- Depois clique em "Run" (Executar) para criar todas as tabelas e regras de segurança.

-- 1. Habilitar a extensão UUID (necessária para gerar IDs únicos)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- CRIAÇÃO DAS TABELAS
-- ==========================================

-- Tabela: profiles (Perfis dos Usuários e Vitrine)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    slug TEXT UNIQUE,
    business_name TEXT,
    category TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    neighborhood TEXT,
    bio TEXT,
    logo_url TEXT,
    vitrine_category TEXT,
    is_published BOOLEAN DEFAULT false,
    social_links JSONB DEFAULT '{}'::jsonb,
    store_config JSONB DEFAULT '{}'::jsonb,
    bio_config JSONB DEFAULT '{}'::jsonb,
    plan TEXT DEFAULT 'profissionais',
    points INTEGER DEFAULT 0,
    level TEXT DEFAULT 'bronze',
    menu_cash NUMERIC DEFAULT 0,
    referral_code TEXT UNIQUE,
    referrals_count INTEGER DEFAULT 0,
    role TEXT DEFAULT 'user',
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: store_categories (Categorias da Loja do Usuário)
CREATE TABLE IF NOT EXISTS public.store_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: products (Produtos do Usuário)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    store_category_id UUID REFERENCES public.store_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    promo_price NUMERIC,
    image_url TEXT,
    video_url TEXT,
    category TEXT,
    available BOOLEAN DEFAULT true,
    variations JSONB DEFAULT '[]'::jsonb,
    button_type TEXT DEFAULT 'buy',
    external_link TEXT,
    stock INTEGER,
    points_reward INTEGER DEFAULT 0,
    is_local BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: offers (Ofertas do Marketplace)
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    city TEXT,
    price NUMERIC,
    image_url TEXT,
    video_url TEXT,
    logo_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    scheduling JSONB DEFAULT '{}'::jsonb,
    coupons JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: leads (CRM - Contatos)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    source TEXT DEFAULT 'manual',
    stage TEXT DEFAULT 'new',
    notes TEXT,
    value NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: financial_entries (Financeiro - Lançamentos)
CREATE TABLE IF NOT EXISTS public.financial_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    value NUMERIC NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    date TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: schedule_items (Agenda)
CREATE TABLE IF NOT EXISTS public.schedule_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    client TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    type TEXT DEFAULT 'meeting',
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: blog_posts (Postagens do Blog)
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    author TEXT,
    category TEXT,
    image_url TEXT,
    date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: community_posts (Comunidade)
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_name TEXT,
    business_name TEXT,
    user_avatar TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    likes INTEGER DEFAULT 0,
    liked_by JSONB DEFAULT '[]'::jsonb,
    comments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: b2b_offers (Ofertas B2B)
CREATE TABLE IF NOT EXISTS public.b2b_offers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    business_name TEXT NOT NULL,
    business_logo TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    discount TEXT,
    category TEXT,
    terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: platform_events (Eventos da Plataforma)
CREATE TABLE IF NOT EXISTS public.platform_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('Online', 'Presencial')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- POLÍTICAS DE SEGURANÇA (RLS - ROW LEVEL SECURITY)
-- ==========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_events ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------
-- Regras para PROFILES
-- ------------------------------------------
-- Qualquer pessoa pode ver perfis publicados
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
-- Usuários podem inserir seus próprios perfis
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Usuários podem atualizar seus próprios perfis
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- ------------------------------------------
-- Regras para PLATFORM EVENTS
-- ------------------------------------------
CREATE POLICY "Events are viewable by everyone." ON public.platform_events FOR SELECT USING (true);
CREATE POLICY "Only admins can modify events." ON public.platform_events FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- ------------------------------------------
-- Regras para STORE CATEGORIES
-- ------------------------------------------
CREATE POLICY "Categories are viewable by everyone." ON public.store_categories FOR SELECT USING (true);
CREATE POLICY "Users can insert their own categories." ON public.store_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories." ON public.store_categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories." ON public.store_categories FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------
-- Regras para PRODUCTS
-- ------------------------------------------
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can insert their own products." ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products." ON public.products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own products." ON public.products FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all products." ON public.products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- ------------------------------------------
-- Regras para OFFERS (Marketplace)
-- ------------------------------------------
CREATE POLICY "Offers are viewable by everyone." ON public.offers FOR SELECT USING (true);
CREATE POLICY "Users can insert their own offers." ON public.offers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own offers." ON public.offers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own offers." ON public.offers FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all offers." ON public.offers FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- ------------------------------------------
-- Regras para LEADS (CRM - Privado)
-- ------------------------------------------
CREATE POLICY "Users can view own leads." ON public.leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert leads." ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own leads." ON public.leads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own leads." ON public.leads FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------
-- Regras para FINANCIAL ENTRIES (Privado)
-- ------------------------------------------
CREATE POLICY "Users can view own finances." ON public.financial_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own finances." ON public.financial_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own finances." ON public.financial_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own finances." ON public.financial_entries FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------
-- Regras para SCHEDULE ITEMS (Privado)
-- ------------------------------------------
CREATE POLICY "Users can view own schedule." ON public.schedule_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own schedule." ON public.schedule_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own schedule." ON public.schedule_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own schedule." ON public.schedule_items FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------
-- Regras para BLOG POSTS
-- ------------------------------------------
CREATE POLICY "Blog posts are viewable by everyone." ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Users can insert own blog posts." ON public.blog_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own blog posts." ON public.blog_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own blog posts." ON public.blog_posts FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------
-- Regras para COMMUNITY POSTS
-- ------------------------------------------
CREATE POLICY "Community posts are viewable by everyone." ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Users can insert own community posts." ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own community posts." ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own community posts." ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------
-- Regras para B2B OFFERS
-- ------------------------------------------
CREATE POLICY "B2B offers are viewable by everyone." ON public.b2b_offers FOR SELECT USING (true);
CREATE POLICY "Users can insert own B2B offers." ON public.b2b_offers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own B2B offers." ON public.b2b_offers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own B2B offers." ON public.b2b_offers FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- GATILHO (TRIGGER) PARA NOVOS USUÁRIOS
-- ==========================================
-- Cria um perfil automaticamente quando um usuário se cadastra na plataforma

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, business_name, plan, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'profissionais', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove o gatilho se ele já existir para evitar erros ao rodar o script novamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
