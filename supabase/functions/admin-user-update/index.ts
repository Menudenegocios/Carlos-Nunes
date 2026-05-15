import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Verificar se o chamador é um administrador
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Cabeçalho de autorização ausente')
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user: caller }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !caller) throw new Error('Não autorizado')

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', caller.id)
      .single()

    if (profile?.role !== 'admin') {
      throw new Error('Acesso negado: Apenas administradores podem realizar esta ação')
    }

    // 2. Processar a atualização do usuário alvo
    const { userId, password, email, userData } = await req.json()
    if (!userId) throw new Error('ID do usuário alvo é obrigatório')

    console.log(`[AdminUpdate] Atualizando usuário ${userId} por admin ${caller.id}`)

    const updateParams: any = {}
    if (password) updateParams.password = password
    if (email) updateParams.email = email
    if (userData) updateParams.user_metadata = userData

    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      updateParams
    )

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, user: data.user }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    console.error('[AdminUpdate Error]', error.message)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
