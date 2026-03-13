-- ==========================================
-- SCRIPT DE BANCO DE DADOS - MENU DE NEGÓCIOS (RESET COMPLETO & RECRIACAO)
-- ==========================================
-- AVISO: Este script apagará todos os dados se executado.
-- Recomendado apenas para ambientes de desenvolvimento ou antes de um deploy limpo.

-- 1. Habilitar a extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- DROPS DE TABELAS E TRIGGERS EXISTENTES
-- ==========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.coupon_redemptions CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.networking_profiles CASCADE;
DROP TABLE IF EXISTS public.quotes CASCADE;
DROP TABLE IF EXISTS public.points_history CASCADE;
DROP TABLE IF EXISTS public.loyalty_cards CASCADE;
DROP TABLE IF EXISTS public.media CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.platform_events CASCADE;
DROP TABLE IF EXISTS public.b2b_offers CASCADE;
DROP TABLE IF EXISTS public.community_posts CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.schedule_items CASCADE;
DROP TABLE IF EXISTS public.financial_entries CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.offers CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.store_categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.crm_tasks CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.business_canva CASCADE;
DROP TABLE IF EXISTS public.smart_goals CASCADE;
DROP TABLE IF EXISTS public.swot_analysis CASCADE;

-- ==========================================
-- CRIAÇÃO DAS TABELAS
-- ==========================================

-- Tabela: profiles
CREATE TABLE public.profiles (
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

-- Tabela: store_categories
CREATE TABLE public.store_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: products
CREATE TABLE public.products (
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

-- Tabela: offers
CREATE TABLE public.offers (
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

-- Tabela: leads
CREATE TABLE public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    source TEXT DEFAULT 'manual',
    stage TEXT DEFAULT 'new',
    notes TEXT,
    value NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: financial_entries
CREATE TABLE public.financial_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    value NUMERIC NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    date TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: schedule_items
CREATE TABLE public.schedule_items (
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

-- Tabela: blog_posts
CREATE TABLE public.blog_posts (
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

-- Tabela: community_posts
CREATE TABLE public.community_posts (
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

-- Tabela: b2b_offers
CREATE TABLE public.b2b_offers (
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

-- Tabela: media (MenuCast, Treinamentos, etc.)
CREATE TABLE public.media (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('MenuCast', 'Treinamentos', 'Ferramentas', 'Eventos')),
    image TEXT,
    youtube_embed TEXT,
    link TEXT,
    duration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: events (Agenda e Eventos)
CREATE TABLE public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    location TEXT,
    description TEXT,
    image TEXT,
    category TEXT,
    link TEXT,
    price TEXT,
    attendees INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: loyalty_cards (Cartões de Fidelidade)
CREATE TABLE public.loyalty_cards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    business_name TEXT NOT NULL,
    reward TEXT NOT NULL,
    total_stamps INTEGER NOT NULL,
    stamps INTEGER DEFAULT 0,
    color TEXT DEFAULT 'bg-indigo-600',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: points_history (Histórico de Pontuação)
CREATE TABLE public.points_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    points INTEGER NOT NULL,
    category TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: quotes (Orçamentos públicos preenchidos e vistos pelo admin/responsável)
CREATE TABLE public.quotes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_name TEXT NOT NULL,
    service_interest TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'pendente',
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: networking_profiles
CREATE TABLE public.networking_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    sector TEXT NOT NULL,
    avatar TEXT,
    looking_for TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: coupons
CREATE TABLE public.coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    discount TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
    points_reward INTEGER DEFAULT 0,
    description TEXT,
    expiry_date TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: coupon_redemptions
CREATE TABLE public.coupon_redemptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: projects (Gestão de Projetos do Membro)
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    priority TEXT DEFAULT 'normal',
    smart_goal_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: clients (Clientes do CRM)
CREATE TABLE public.clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    company TEXT,
    notes TEXT,
    last_contact TIMESTAMP WITH TIME ZONE,
    tags JSONB DEFAULT '[]'::jsonb,
    total_value NUMERIC DEFAULT 0,
    birth_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: crm_tasks (Tarefas do CRM)
CREATE TABLE public.crm_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending',
    type TEXT NOT NULL CHECK (type IN ('call', 'meeting', 'email', 'whatsapp', 'other')),
    related_to JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: smart_goals (Metas SMART)
CREATE TABLE public.smart_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    specific TEXT NOT NULL,
    measurable TEXT NOT NULL,
    attainable TEXT NOT NULL,
    relevant TEXT NOT NULL,
    time_bound TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: swot_analysis (Análise SWOT)
CREATE TABLE public.swot_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    strengths JSONB DEFAULT '[]'::jsonb,
    weaknesses JSONB DEFAULT '[]'::jsonb,
    opportunities JSONB DEFAULT '[]'::jsonb,
    threats JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: business_canva (Canvas de Negócios)
CREATE TABLE public.business_canva (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    key_partners TEXT,
    key_activities TEXT,
    value_propositions TEXT,
    customer_relationships TEXT,
    customer_segments TEXT,
    key_resources TEXT,
    channels TEXT,
    cost_structure TEXT,
    revenue_streams TEXT,
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
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.networking_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swot_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_canva ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- A. TABELAS PÚBLICAS PARA LEITURA (Public Read, Private Write)
-- ----------------------------------------------------
CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "store_categories_select_public" ON public.store_categories FOR SELECT USING (true);
CREATE POLICY "products_select_public" ON public.products FOR SELECT USING (true);
CREATE POLICY "offers_select_public" ON public.offers FOR SELECT USING (true);
CREATE POLICY "blog_posts_select_public" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "community_posts_select_public" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "b2b_offers_select_public" ON public.b2b_offers FOR SELECT USING (true);
CREATE POLICY "networking_profiles_select_public" ON public.networking_profiles FOR SELECT USING (true);
CREATE POLICY "coupons_select_public" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "media_select_public" ON public.media FOR SELECT USING (true);
CREATE POLICY "events_select_public" ON public.events FOR SELECT USING (true);

-- ----------------------------------------------------
-- B. TABELAS DE DADOS SENSÍVEIS (Private Read & Write)
-- ----------------------------------------------------
CREATE POLICY "leads_select_private" ON public.leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "financial_entries_select_private" ON public.financial_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "schedule_items_select_private" ON public.schedule_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "loyalty_cards_select_private" ON public.loyalty_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "points_history_select_private" ON public.points_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "coupon_redemptions_select_private" ON public.coupon_redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "projects_select_private" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "clients_select_private" ON public.clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "crm_tasks_select_private" ON public.crm_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "smart_goals_select_private" ON public.smart_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "swot_analysis_select_private" ON public.swot_analysis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "business_canva_select_private" ON public.business_canva FOR SELECT USING (auth.uid() = user_id);

-- ----------------------------------------------------
-- C. POLÍTICAS DE INSERÇÃO/ATUALIZAÇÃO/DELEÇÃO (Owners only)
-- ----------------------------------------------------
DO $$
DECLARE
    t_name text;
BEGIN
    FOR t_name IN 
        SELECT unnest(ARRAY[
            'profiles', 'store_categories', 'products', 'offers', 'leads', 'financial_entries', 
            'schedule_items', 'blog_posts', 'community_posts', 'b2b_offers',
            'loyalty_cards', 'points_history', 'coupons', 'coupon_redemptions', 'projects',
            'networking_profiles', 'clients', 'crm_tasks', 'smart_goals', 'swot_analysis', 'business_canva'
        ])
    LOOP
        -- Check if user_id column exists or if it allows insertion
        EXECUTE 'CREATE POLICY "' || t_name || '_insert_owner" ON public.' || t_name || ' FOR INSERT WITH CHECK (auth.uid() = user_id)';
        EXECUTE 'CREATE POLICY "' || t_name || '_update_owner" ON public.' || t_name || ' FOR UPDATE USING (auth.uid() = user_id)';
        EXECUTE 'CREATE POLICY "' || t_name || '_delete_owner" ON public.' || t_name || ' FOR DELETE USING (auth.uid() = user_id)';
    END LOOP;
END $$;

-- ----------------------------------------------------
-- D. EXCEÇÕES E REGRAS ESPECIAIS
-- ----------------------------------------------------

-- Quotes (Formulários públicos)
CREATE POLICY "quotes_select_public" ON public.quotes FOR SELECT USING (true);
CREATE POLICY "quotes_insert_public" ON public.quotes FOR INSERT WITH CHECK (true);

-- Media & Events (Apenas Admins gerenciam, público lê)
CREATE POLICY "media_manage_admin" ON public.media FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "events_manage_admin" ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- GATILHO (TRIGGER) PARA NOVOS USUÁRIOS
-- ==========================================
-- Cria um perfil automaticamente quando um usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, business_name, plan, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', 'profissionais', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
