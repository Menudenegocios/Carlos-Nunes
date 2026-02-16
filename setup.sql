
-- 1. TABELA DE LEADS (CRM)
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  phone text,
  source text DEFAULT 'manual',
  stage text DEFAULT 'new', -- 'new', 'contacted', 'negotiation', 'closed', 'lost'
  notes text,
  value numeric DEFAULT 0,
  timeline jsonb DEFAULT '[]'::jsonb,
  created_at bigint DEFAULT (extract(epoch from now()) * 1000)
);

-- 2. TABELA DE LANÇAMENTOS FINANCEIROS (CAIXA)
CREATE TABLE IF NOT EXISTS public.financial_entries (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  value numeric NOT NULL,
  type text NOT NULL, -- 'income' or 'expense'
  category text DEFAULT 'Vendas',
  date timestamp with time zone DEFAULT timezone('utc'::text, now()),
  created_at bigint DEFAULT (extract(epoch from now()) * 1000)
);

-- 3. TABELA DE ITENS DA AGENDA
CREATE TABLE IF NOT EXISTS public.schedule_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  client text,
  date date NOT NULL,
  time text NOT NULL,
  type text DEFAULT 'servico', -- 'servico', 'visita', 'reuniao'
  status text DEFAULT 'pending',
  created_at bigint DEFAULT (extract(epoch from now()) * 1000)
);

-- 4. HABILITAR RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICAS DE ACESSO PRIVADO
CREATE POLICY "Leads gestão privada" ON public.leads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Financeiro gestão privada" ON public.financial_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Agenda gestão privada" ON public.schedule_items FOR ALL USING (auth.uid() = user_id);
