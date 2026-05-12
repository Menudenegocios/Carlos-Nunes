-- Adiciona colunas de membership que estavam faltando na tabela profiles
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS membership_plan TEXT DEFAULT 'pre-cadastro',
  ADD COLUMN IF NOT EXISTS membership_status TEXT DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS membership_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Sincronizar membership_plan com a coluna plan existente
UPDATE profiles 
SET membership_plan = plan 
WHERE plan IS NOT NULL AND plan != 'pre-cadastro';
