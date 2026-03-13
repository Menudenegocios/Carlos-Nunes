-- ==========================================
-- SCRIPT DE BANCO DE DADOS - MENU DE NEGÓCIOS (RESET COMPLETO)
-- ==========================================
-- AVISO: Este script apagará todos os dados se executado.
-- Recomendado apenas para ambientes de desenvolvimento ou antes de um deploy limpo.

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
