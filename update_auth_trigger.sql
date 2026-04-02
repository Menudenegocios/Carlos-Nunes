-- ==========================================
-- RECONSTRUÇÃO DA TRIGGER DE AUTENTICAÇÃO
-- ==========================================
-- Este script apaga a função antiga e cria uma nova versão blindada.
-- Ela garante que mesmo se ocorrer um erro ao criar o perfil (ex: email duplicado ou coluna faltando),
-- o Supabase Auth ainda concluirá o cadastro com sucesso para o Frontend (React/Vite).

-- 1. Remover ligações antigas para evitar conflitos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. Recriar a função com captura de Erros (EXCEPTION block)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Tenta inserir o perfil normalmente
  INSERT INTO public.profiles (user_id, business_name, plan, email, phone)
  VALUES (new.id, new.raw_user_meta_data->>'name', 'pre-cadastro', new.email, new.raw_user_meta_data->>'phone');
  
  RETURN new;

EXCEPTION WHEN OTHERS THEN
  -- Se *qualquer* erro ocorrer ao inserir em 'profiles', 
  -- o erro é capturado aqui e documentado internamente.
  -- O Postgres engole o erro e retorna 'new' com sucesso para o Auth.
  RAISE WARNING 'Erro ao criar profile para user_id %: %', new.id, SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recriar o Gatilho atrelando a nova função ao evento de INSERT do Supabase
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
